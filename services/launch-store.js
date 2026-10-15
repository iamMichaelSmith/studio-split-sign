const { ApiAuthError } = require('./auth-service');

// Usage is a durable reservation at send time, independent of vault visibility.
function createLaunchStore({ db, provider, submissions }) {
  const ddl = `CREATE TABLE IF NOT EXISTS sheet_usage (
    document_id TEXT PRIMARY KEY, user_id TEXT NOT NULL, charged_at TEXT NOT NULL
  ); CREATE INDEX IF NOT EXISTS idx_sheet_usage_user ON sheet_usage(user_id);
  CREATE TABLE IF NOT EXISTS launch_operations (id TEXT PRIMARY KEY, value_json TEXT NOT NULL);`;
  const ready = provider === 'postgres' ? db.query(ddl) : Promise.resolve(db.exec(ddl));
  const queues = new Map();
  async function withLock(key, work) {
    await ready;
    if (provider === 'postgres') {
      let connection;
      // Do not fill the pool with waiting locks: the holder needs connections too.
      for (let attempt=0; attempt<300; attempt++) {
        const candidate=await db.connect();
        try {
          const result=await candidate.query('SELECT pg_try_advisory_lock(hashtext($1)) AS locked', [`sss:${key}`]);
          if(result.rows[0].locked) { connection=candidate; break; }
        } catch(error) { candidate.release(); throw error; }
        candidate.release();
        await new Promise(resolve=>setTimeout(resolve,100));
      }
      if(!connection) throw new ApiAuthError('Another request is still processing. Please try again.',409);
      try {
        return await work();
      } finally {
        try { await connection.query('SELECT pg_advisory_unlock(hashtext($1))', [`sss:${key}`]); }
        finally { connection.release(); }
      }
    }
    const previous = queues.get(key) || Promise.resolve();
    const current = previous.catch(() => {}).then(work);
    queues.set(key, current);
    try { return await current; }
    finally { if (queues.get(key) === current) queues.delete(key); }
  }
  async function query(sql, params = []) {
    await ready;
    if (provider === 'postgres') return (await db.query(sql, params)).rows;
    const statement = db.prepare(sql.replace(/\$\d+/g, '?'));
    return statement.reader ? statement.all(...params) : statement.run(...params);
  }
  async function importUsage(user) {
    // Existing submitted/archived records retain their original usage on upgrade.
    const docs = await submissions.listSubmissions({ ownerUserId:user.id, ownerEmail:user.email, type:'split-sheet' });
    for (const doc of docs.filter(row => row.status !== 'draft' && row.payload?.archivedFromStatus !== 'draft')) {
      await query('INSERT INTO sheet_usage(document_id,user_id,charged_at) VALUES($1,$2,$3) ON CONFLICT(document_id) DO NOTHING',
        [doc.id, user.id, doc.payload?.usageChargedAt || doc.createdAt]);
    }
  }
  async function usageRows(user) {
    await importUsage(user);
    return query('SELECT * FROM sheet_usage WHERE user_id=$1', [user.id]);
  }
  return {
    withLock,
    usageRows,
    async reserve(user, documentId, window, limit) {
      await importUsage(user);
      return withLock(`usage:${user.id}`, async () => {
        const run = async (client, postgres) => {
          const sql='SELECT * FROM sheet_usage WHERE user_id=$1';
          const rows=postgres ? (await client.query(sql,[user.id])).rows : client.prepare(sql.replace('$1','?')).all(user.id);
          if(rows.some(row=>row.document_id===documentId)) throw new ApiAuthError('This split sheet has already been sent.',409);
          if(rows.filter(row=>row.charged_at>=window.start && row.charged_at<window.end).length>=limit)
            throw new ApiAuthError('Monthly split-sheet limit reached. Upgrade to send more.',402);
          const at=new Date().toISOString();
          if(postgres) await client.query('INSERT INTO sheet_usage VALUES($1,$2,$3)',[documentId,user.id,at]);
          else client.prepare('INSERT INTO sheet_usage VALUES(?,?,?)').run(documentId,user.id,at);
          return at;
        };
        if(provider === 'postgres') return run(db,true);
        // SQLite's write lock must cover both read and insert, even across processes.
        return db.transaction(()=>{
          const rows=db.prepare('SELECT * FROM sheet_usage WHERE user_id=?').all(user.id);
          if(rows.some(row=>row.document_id===documentId)) throw new ApiAuthError('This split sheet has already been sent.',409);
          if(rows.filter(row=>row.charged_at>=window.start && row.charged_at<window.end).length>=limit)
            throw new ApiAuthError('Monthly split-sheet limit reached. Upgrade to send more.',402);
          const at=new Date().toISOString();
          db.prepare('INSERT INTO sheet_usage VALUES(?,?,?)').run(documentId,user.id,at);
          return at;
        }).immediate();
      });
    },
    async release(documentId) { await query('DELETE FROM sheet_usage WHERE document_id=$1',[documentId]); },
    async get(id) { const rows=await query('SELECT value_json FROM launch_operations WHERE id=$1',[id]); return rows[0] ? JSON.parse(rows[0].value_json) : null; },
    async set(id,value) { await query('INSERT INTO launch_operations VALUES($1,$2) ON CONFLICT(id) DO UPDATE SET value_json=excluded.value_json',[id,JSON.stringify(value)]); }
  };
}
module.exports={ createLaunchStore };
