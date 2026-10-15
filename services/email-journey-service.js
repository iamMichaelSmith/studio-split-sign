const { randomUUID } = require('node:crypto');
const { journeyEmail, betaInvitation } = require('./email-journey-content');

const DAY = 86400000;
const JOURNEYS = ['direct', 'invited'];
const DELAYS = [0, 2, 2, 3, 3, 4];

function createEmailJourneyService({ db, provider = 'sqlite', auth, contacts, submissions, sendEmail, baseUrl, enabled = false, postalAddress = '', headerImagePath = null, mode = 'production', allowedRecipients = [], dayMinutes = 1440, now = () => new Date() }) {
  const beta = mode === 'beta';
  const recipients = new Set(allowedRecipients.map(email => email.trim().toLowerCase()));
  const dayLength = beta ? Math.max(1, Number(dayMinutes) || 1) * 60000 : DAY;
  const postgres = provider === 'postgres';
  const schema = `CREATE TABLE IF NOT EXISTS email_journey_enrollments (
    user_id TEXT PRIMARY KEY, journey TEXT NOT NULL, invitation_id TEXT,
    enrolled_at TEXT NOT NULL, next_due_at TEXT NOT NULL, next_step INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending', claim_token TEXT, claimed_at TEXT,
    last_sent_at TEXT, last_message_id TEXT, failure_code TEXT
  ); CREATE INDEX IF NOT EXISTS idx_email_journey_due ON email_journey_enrollments(journey, status, next_due_at);
  CREATE TABLE IF NOT EXISTS email_journey_activity (user_id TEXT NOT NULL, event_type TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY(user_id, event_type));`;
  const ready = postgres ? db.query(schema) : Promise.resolve(db.exec(schema));
  async function rows(sql, params = []) {
    await ready;
    return postgres ? (await db.query(sql, params)).rows : db.prepare(sql.replace(/\$\d+/g, '?')).all(...params);
  }
  async function execute(sql, params = []) {
    await ready;
    return postgres ? (await db.query(sql, params)).rowCount : db.prepare(sql.replace(/\$\d+/g, '?')).run(...params).changes;
  }
  return {
    async sendBetaPreview({ email, journey, step, planKey = 'free', pluginDownloaded = false }) {
      email = String(email || '').trim().toLowerCase();
      if (!beta || !enabled || !recipients.has(email) || !JOURNEYS.includes(journey)
          || !Number.isInteger(step) || step < 0 || step > 5 || !['free', 'creator', 'studio_pro'].includes(planKey)) throw new Error('Invalid beta preview');
      const contact = await contacts.recordContact({ email, displayName: 'Blak Marigold', source: 'owner_requested_beta_preview', marketingOptIn: true });
      const message = journeyEmail({ journey, step, user: { email, displayName: 'Blak Marigold', planKey }, contact,
        invitation: betaInvitation(journey, step, email), activity: { createdCount: 0, pluginDownloaded }, baseUrl, postalAddress, headerImagePath });
      message.subject = `[BETA PREVIEW ${journey} ${planKey} ${step + 1}/6] ${message.subject}`;
      return sendEmail(message);
    },
    async recordActivity(userId, eventType) {
      if (!userId || eventType !== 'windows_download') return;
      await execute(`INSERT INTO email_journey_activity (user_id, event_type, updated_at) VALUES ($1, $2, $3)
        ON CONFLICT(user_id, event_type) DO UPDATE SET updated_at = excluded.updated_at`, [userId, eventType, now().toISOString()]);
    },
    async startBeta({ email, journey }) {
      email = String(email || '').trim().toLowerCase();
      if (!beta || !recipients.has(email) || !JOURNEYS.includes(journey)) throw new Error('Beta test recipient or journey not allowed');
      const id = `beta:${journey}:${email}`;
      await this.enroll({ userId: id, journey });
      await execute(`UPDATE email_journey_enrollments SET next_step = 0, next_due_at = $1, status = 'pending', failure_code = NULL WHERE user_id = $2 AND status <> 'sending'`, [now().toISOString(), id]);
      await contacts.recordContact({ email, displayName: 'Blak Marigold', source: 'owner_requested_beta_test', marketingOptIn: true });
    },
    async advanceBeta(journey) {
      if (!beta || !JOURNEYS.includes(journey)) throw new Error('Beta mode required');
      await execute(`UPDATE email_journey_enrollments SET next_due_at = $1 WHERE journey = $2 AND status = 'pending' AND user_id LIKE 'beta:%'`, [now().toISOString(), journey]);
    },
    async betaStatus() {
      if (!beta) return [];
      return rows(`SELECT journey, next_step, status, next_due_at FROM email_journey_enrollments WHERE user_id LIKE 'beta:%' ORDER BY journey`);
    },
    async enroll({ userId, journey = 'direct', invitationId = null }) {
      if (!JOURNEYS.includes(journey)) throw new Error('Invalid email journey');
      const timestamp = now().toISOString();
      await execute(`INSERT INTO email_journey_enrollments (user_id, journey, invitation_id, enrolled_at, next_due_at)
        VALUES ($1, $2, $3, $4, $5) ON CONFLICT(user_id) DO NOTHING`, [userId, journey, invitationId, timestamp, timestamp]);
    },
    async activate(userId) {
      await execute(`UPDATE email_journey_enrollments SET next_due_at = $1 WHERE user_id = $2 AND status = 'pending' AND next_step = 0`, [now().toISOString(), userId]);
    },
    async run(journey, { dryRun = true, limit = 25 } = {}) {
      if (!JOURNEYS.includes(journey)) throw new Error('Invalid email journey');
      if (!enabled && !dryRun) return { enabled: false, sent: 0, reason: 'disabled' };
      const timestamp = now().toISOString();
      const due = await rows(`SELECT * FROM email_journey_enrollments WHERE journey = $1 AND status = 'pending' AND next_due_at <= $2 ORDER BY next_due_at LIMIT $3`, [journey, timestamp, Math.min(100, Math.max(1, Number(limit) || 25))]);
      const summary = { enabled, mode, dryRun, considered: due.length, eligible: 0, sent: 0, skipped: 0, deferred: 0, suppressed: 0, review: 0 };
      for (const enrollment of due) {
        const betaEmail = beta && enrollment.user_id.startsWith(`beta:${journey}:`) ? enrollment.user_id.slice(`beta:${journey}:`.length) : null;
        const user = betaEmail ? { id: enrollment.user_id, email: betaEmail, displayName: 'Blak Marigold', status: 'active', emailVerifiedAt: timestamp, planKey: 'free' } : await auth.getUserById(enrollment.user_id);
        const contact = user && await contacts.getByEmail(user.email);
        if (!user || (beta && !recipients.has(user.email.toLowerCase())) || user.status !== 'active' || !user.emailVerifiedAt || contact?.marketingStatus !== 'subscribed') {
          summary.suppressed++;
          if (!dryRun) await execute(`UPDATE email_journey_enrollments SET next_due_at = $1 WHERE user_id = $2 AND status = 'pending'`, [new Date(now().getTime() + DAY).toISOString(), enrollment.user_id]);
          continue;
        }
        const docs = await submissions.listSubmissions({ ownerUserId: user.id, ownerEmail: user.email, type: 'split-sheet' });
        const invitation = betaEmail ? betaInvitation(journey, enrollment.next_step, user.email)
          : enrollment.invitation_id ? await submissions.getSubmission(enrollment.invitation_id) : null;
        const downloads = await rows(`SELECT event_type FROM email_journey_activity WHERE user_id = $1`, [user.id]);
        const email = journeyEmail({ journey, step: enrollment.next_step, user, contact, invitation,
          activity: { createdCount: docs.filter(d => d.status !== 'draft').length, pluginDownloaded: downloads.length > 0 }, baseUrl, postalAddress, headerImagePath });
        if (email?.defer) {
          summary.deferred++;
          if (!dryRun) await execute(`UPDATE email_journey_enrollments SET next_due_at = $1 WHERE user_id = $2 AND status = 'pending' AND next_step = $3`, [new Date(now().getTime() + dayLength).toISOString(), user.id, enrollment.next_step]);
          continue;
        }
        if (beta && email && !email.skip) email.subject = `[BETA ${journey} ${enrollment.next_step + 1}/6] ${email.subject}`;
        summary.eligible++;
        if (dryRun) continue;
        const claim = randomUUID();
        const claimed = await execute(`UPDATE email_journey_enrollments SET status = 'sending', claim_token = $1, claimed_at = $2
          WHERE user_id = $3 AND status = 'pending' AND next_step = $4`, [claim, timestamp, user.id, enrollment.next_step]);
        if (!claimed) continue;
        try {
          // Recheck consent after claiming, immediately before delivery.
          if ((await contacts.getByEmail(user.email))?.marketingStatus !== 'subscribed') {
            await execute(`UPDATE email_journey_enrollments SET status = 'pending', claim_token = NULL, next_due_at = $1 WHERE user_id = $2 AND claim_token = $3`, [new Date(now().getTime() + DAY).toISOString(), user.id, claim]);
            summary.suppressed++;
            continue;
          }
          const result = email?.skip || !email ? { ok: true } : await sendEmail(email);
          if (!result.ok) throw new Error('delivery_not_confirmed');
          const nextStep = enrollment.next_step + 1;
          const nextDueAt = new Date(now().getTime() + (DELAYS[nextStep] || 0) * dayLength).toISOString();
          await execute(`UPDATE email_journey_enrollments SET status = $1, next_step = $2, next_due_at = $3,
            last_sent_at = $4, last_message_id = $5, claim_token = NULL, failure_code = NULL WHERE user_id = $6 AND claim_token = $7`,
          [nextStep >= DELAYS.length ? 'completed' : 'pending', nextStep, nextDueAt, email?.skip ? enrollment.last_sent_at : now().toISOString(), result.messageId || null, user.id, claim]);
          if (email?.skip) summary.skipped++; else summary.sent++;
        } catch {
          // An interrupted/uncertain delivery needs review; never blindly resend it.
          await execute(`UPDATE email_journey_enrollments SET status = 'review', failure_code = 'delivery_or_commit_uncertain' WHERE user_id = $1 AND claim_token = $2`, [user.id, claim]);
          summary.review++;
        }
      }
      const attention = await rows(`SELECT COUNT(*) AS count FROM email_journey_enrollments WHERE journey = $1 AND (status = 'review' OR (status = 'sending' AND claimed_at < $2))`, [journey, new Date(now().getTime() - 15 * 60000).toISOString()]);
      summary.needsReview = Number(attention[0].count);
      return summary;
    }
  };
}

module.exports = { createEmailJourneyService, journeyEmail, JOURNEYS };
