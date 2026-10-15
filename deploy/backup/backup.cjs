const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const {Client}=require('pg');
const {S3Client,ListObjectsV2Command,GetObjectCommand,PutObjectCommand}=require('@aws-sdk/client-s3');
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');

async function backup() {
  const bucket=process.env.BACKUP_BUCKET;
  const key=process.env.BACKUP_OBJECT_KEY;
  const publicKey=Buffer.from(process.env.BACKUP_PUBLIC_KEY_BASE64||'','base64').toString();
  if(!bucket || !key?.startsWith('backups/') || !publicKey.includes('PUBLIC KEY')) throw Error('Missing backup destination or encryption public key');
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'sss-backup-'));
  const bundle=path.join(directory,'bundle');fs.mkdirSync(bundle,{mode:0o700});
  const manifest={format:1,createdAt:new Date().toISOString(),tables:{},objects:[],files:{}};
  const url=new URL(process.env.DATABASE_URL);
  const caPath='/opt/aws-rds/global-bundle.pem';
  const db=new Client({host:url.hostname,port:Number(url.port||5432),database:decodeURIComponent(url.pathname.slice(1)),user:decodeURIComponent(url.username),password:decodeURIComponent(url.password),ssl:{rejectUnauthorized:true,ca:fs.readFileSync(caPath,'utf8')}});
  await db.connect();
  try {
    await db.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
    const snapshot=(await db.query('SELECT pg_export_snapshot() AS id')).rows[0].id;
    const tables=(await db.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")).rows;
    for(const {tablename} of tables) {
      const quoted='"'+tablename.replaceAll('"','""')+'"';
      manifest.tables[tablename]=Number((await db.query(`SELECT count(*) AS count FROM public.${quoted}`)).rows[0].count);
    }
    execFileSync('pg_dump',['--format=custom','--no-owner','--no-acl','--snapshot',snapshot,'--file',path.join(bundle,'database.dump')],{
      env:{...process.env,PGHOST:url.hostname,PGPORT:url.port||'5432',PGDATABASE:decodeURIComponent(url.pathname.slice(1)),PGUSER:decodeURIComponent(url.username),PGPASSWORD:decodeURIComponent(url.password),PGSSLMODE:'verify-full',PGSSLROOTCERT:caPath},stdio:['ignore','ignore','pipe']
    });
    await db.query('COMMIT');
  } finally {await db.end();}
  const s3=new S3Client({region:process.env.AWS_REGION||'us-east-1'});
  let cursor;
  do {
    const page=await s3.send(new ListObjectsV2Command({Bucket:bucket,ContinuationToken:cursor}));
    for(const item of page.Contents||[]) {
      if(item.Key.startsWith('backups/')) continue;
      const object=await s3.send(new GetObjectCommand({Bucket:bucket,Key:item.Key,IfMatch:item.ETag}));
      const bytes=Buffer.from(await object.Body.transformToByteArray());
      const file=`object-${manifest.objects.length}.bin`;
      fs.writeFileSync(path.join(bundle,file),bytes,{mode:0o600});
      manifest.objects.push({key:item.Key,file,size:bytes.length,sha256:digest(bytes),versionId:object.VersionId||null,contentType:object.ContentType});
    }
    cursor=page.IsTruncated?page.NextContinuationToken:undefined;
  } while(cursor);
  manifest.files['database.dump']=digest(fs.readFileSync(path.join(bundle,'database.dump')));
  // These keys are needed to keep existing signed links and sessions valid after recovery.
  const recovery={};
  for(const name of ['API_TOKEN_SECRET','PDF_LINK_SECRET','SESSION_SECRET']) if(process.env[name]) recovery[name]=process.env[name];
  fs.writeFileSync(path.join(bundle,'recovery-secrets.json'),JSON.stringify(recovery),{mode:0o600});
  manifest.files['recovery-secrets.json']=digest(fs.readFileSync(path.join(bundle,'recovery-secrets.json')));
  fs.writeFileSync(path.join(bundle,'manifest.json'),JSON.stringify(manifest,null,2),{mode:0o600});
  const archive=path.join(directory,'backup.tar.gz');
  execFileSync('tar',['-czf',archive,'-C',bundle,'.']);
  const secret=crypto.randomBytes(32),iv=crypto.randomBytes(12);
  const cipher=crypto.createCipheriv('aes-256-gcm',secret,iv);
  const ciphertext=Buffer.concat([cipher.update(fs.readFileSync(archive)),cipher.final()]);
  const encrypted=Buffer.from(JSON.stringify({format:'sss-backup-v1',algorithm:'RSA-OAEP-SHA256+AES-256-GCM',key:crypto.publicEncrypt({key:publicKey,oaepHash:'sha256'},secret).toString('base64'),iv:iv.toString('base64'),tag:cipher.getAuthTag().toString('base64'),ciphertext:ciphertext.toString('base64')}));
  await s3.send(new PutObjectCommand({Bucket:bucket,Key:key,Body:encrypted,ServerSideEncryption:'AES256',ContentType:'application/octet-stream',Metadata:{sha256:digest(encrypted)}}));
  console.log(JSON.stringify({event:'production_backup_complete',key,bytes:encrypted.length,sha256:digest(encrypted),tableCount:Object.keys(manifest.tables).length,objectCount:manifest.objects.length}));
}

function decrypt() {
  const [, , , input, privateKey, output]=process.argv;
  if(!input||!privateKey||!output) throw Error('Usage: decrypt encrypted-file private-key output.tar.gz');
  const envelope=JSON.parse(fs.readFileSync(input));
  if(envelope.format!=='sss-backup-v1') throw Error('Unknown backup format');
  const key=crypto.privateDecrypt({key:fs.readFileSync(privateKey),oaepHash:'sha256'},Buffer.from(envelope.key,'base64'));
  const cipher=crypto.createDecipheriv('aes-256-gcm',key,Buffer.from(envelope.iv,'base64'));
  cipher.setAuthTag(Buffer.from(envelope.tag,'base64'));
  const bytes=Buffer.concat([cipher.update(Buffer.from(envelope.ciphertext,'base64')),cipher.final()]);
  fs.writeFileSync(output,bytes,{mode:0o600});
  console.log('Backup authenticated and decrypted to the protected restore workspace.');
}
(process.argv[2]==='decrypt'?Promise.resolve().then(decrypt):backup()).catch(error=>{
  // Do not put connection strings, SQL data, or private keys into task logs.
  console.error(JSON.stringify({event:'production_backup_failed',type:error.name,code:error.code||null}));process.exitCode=1;
});
