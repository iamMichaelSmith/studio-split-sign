// Disposable local UI fixture. No production credentials or external mail.
const {startApp}=require('../tests/helpers/isolated-app.cjs');
const {startSmtpSink,emailToken}=require('../tests/helpers/smtp-sink.cjs');
(async()=>{
  const mail=await startSmtpSink();
  const app=await startApp(mail.environment);
  const email='ui-audit@example.test',password='UI-audit-test-only-123';
  await fetch(app.baseUrl+'/api/auth/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password,displayName:'UI Audit'})});
  await fetch(app.baseUrl+'/api/auth/verify-email',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({token:emailToken(mail.messages.at(-1),'verify-email')})});
  console.log(JSON.stringify({url:app.baseUrl,email,password}));
  let stopped=false;
  const stop=async()=>{if(stopped)return;stopped=true;await app.stop();await mail.stop();process.exit();};
  process.on('SIGINT',stop);process.on('SIGTERM',stop);
  process.stdin.resume();process.stdin.on('data',stop);
})().catch(error=>{console.error(error);process.exit(1);});
