const test=require('node:test');
const assert=require('node:assert/strict');
const {createBillingService}=require('../services/billing-service');
const {createLaunchStore}=require('../services/launch-store');
const {PLAN_DEFINITIONS,currentUsageWindow}=require('../services/plan-service');
const {startApp}=require('./helpers/isolated-app.cjs');
const {startSmtpSink,emailToken}=require('./helpers/smtp-sink.cjs');
const {startTemporaryPostgres}=require('./helpers/temporary-postgres.cjs');

function billingFixture() {
  const user={id:'billing-user',email:'billing@example.test',planKey:'free',stripeCustomerId:'cus_fixture'};
  let subs=[], sessions=[], updates=0;
  const data=new Map();
  const sqlite=require('better-sqlite3')(':memory:');
  const store=createLaunchStore({db:sqlite,provider:'sqlite',submissions:{listSubmissions:async()=>[]}});
  const priceId=(plan,interval)=>`price_${plan.key}_${interval}`;
  const stripe={
    subscriptions:{list:async function*(){yield* subs;},retrieve:async id=>subs.find(sub=>sub.id===id)||{id,object:'subscription',status:'canceled',metadata:{userId:user.id},customer:user.stripeCustomerId}},
    prices:{retrieve:async id=>({id,active:true,currency:'usd',unit_amount:id.endsWith('year')?7000:700,recurring:{interval:id.endsWith('year')?'year':'month',interval_count:1}})},
    billingPortal:{sessions:{create:async()=>({url:'https://billing.stripe.test/portal'})}},
    checkout:{sessions:{
      retrieve:async id=>sessions.find(session=>session.id===id),
      expire:async id=>{sessions.find(session=>session.id===id).status='expired';},
      create:async (params,options)=>{
        if(data.has(options.idempotencyKey)) return data.get(options.idempotencyKey);
        const session={id:`cs_${sessions.length}`,status:'open',url:`https://checkout.stripe.test/${sessions.length}`,params};
        sessions.push(session);data.set(options.idempotencyKey,session);return session;
      }
    }}
  };
  const auth={getUserById:async()=>({...user}),updateUserBilling:async fields=>{updates++;Object.assign(user,fields);return user;}};
  const service=createBillingService({stripe,auth,store,plans:PLAN_DEFINITIONS,priceId,baseUrl:'https://app.example.test'});
  const subscription=(id,status='active',plan='creator')=>({id,object:'subscription',status,created:1,customer:user.stripeCustomerId,metadata:{userId:user.id,planKey:plan},items:{data:[{quantity:1,price:{id:`price_${plan}_month`}}]}});
  return {user,service,subscription,sessions,close:()=>sqlite.close(),setSubs:value=>{subs=value;},updates:()=>updates};
}

test('checkout retries reuse one session; plan changes expire the old session; active customers use portal',async t=>{
  const f=billingFixture();t.after(f.close);
  const urls=await Promise.all(Array.from({length:12},()=>f.service.checkout(f.user,PLAN_DEFINITIONS.creator,'month')));
  assert.equal(new Set(urls).size,1);assert.equal(f.sessions.length,1);
  await f.service.checkout(f.user,PLAN_DEFINITIONS.creator,'year');
  assert.equal(f.sessions[0].status,'expired');assert.equal(f.sessions.length,2);
  f.setSubs([f.subscription('sub_active')]);
  assert.equal(await f.service.checkout(f.user,PLAN_DEFINITIONS.creator,'month'),'https://billing.stripe.test/portal');
  assert.equal(f.sessions.length,2);
});

test('unpaid checkout cannot upgrade; old deletion cannot downgrade a current subscription; events deduplicate',async t=>{
  const f=billingFixture();t.after(f.close);
  f.setSubs([f.subscription('sub_unpaid','incomplete')]);
  await f.service.event({id:'evt_unpaid',data:{object:{object:'checkout.session',subscription:'sub_unpaid',payment_status:'unpaid'}}});
  assert.equal(f.user.planKey,'free');
  f.setSubs([f.subscription('sub_old','canceled'),f.subscription('sub_new')]);
  const event={id:'evt_old_delete',data:{object:f.subscription('sub_old','canceled')}};
  await f.service.event(event);
  assert.equal(f.user.planKey,'creator');assert.equal(f.user.stripeSubscriptionId,'sub_new');
  const count=f.updates();await f.service.event(event);assert.equal(f.updates(),count);
  f.setSubs([f.subscription('sub_new','canceled')]);
  await f.service.event({id:'evt_new_delete',data:{object:f.subscription('sub_new','canceled')}});
  assert.equal(f.user.planKey,'free');
});

test('a cancelled former subscriber can purchase again; invalid prices fail closed',async t=>{
  const f=billingFixture();t.after(f.close);
  await f.service.checkout(f.user,PLAN_DEFINITIONS.creator,'month');f.sessions[0].status='complete';
  f.setSubs([f.subscription('sub_old','canceled')]);
  await f.service.checkout(f.user,PLAN_DEFINITIONS.creator,'month');assert.equal(f.sessions.length,2);
  await assert.rejects(f.service.checkout(f.user,PLAN_DEFINITIONS.studio_pro,'month'),/does not match/);
  assert.equal(f.service.planForSubscription({...f.subscription('bad'),items:{data:[{quantity:2,price:{id:'price_creator_month'}}]}}),null);
});

test('usage ledger counts send time and survives archive/delete without counting drafts',async t=>{
  const db=require('better-sqlite3')(':memory:');t.after(()=>db.close());
  let docs=[{id:'draft',status:'archived',createdAt:new Date().toISOString(),payload:{archivedFromStatus:'draft'}}];
  const store=createLaunchStore({db,provider:'sqlite',submissions:{listSubmissions:async()=>docs}});
  const user={id:'u',email:'u@example.test'};
  assert.equal((await store.usageRows(user)).length,0);
  await store.reserve(user,'old-draft',currentUsageWindow(),3);
  docs=[];
  assert.equal((await store.usageRows(user)).length,1);
  await assert.rejects(store.reserve(user,'old-draft',currentUsageWindow(),3),/already been sent/);
  const attempts=await Promise.allSettled(Array.from({length:10},(_,i)=>store.reserve(user,`doc${i}`,currentUsageWindow(),3)));
  assert.equal(attempts.filter(result=>result.status==='fulfilled').length,2);
  assert.equal((await store.usageRows(user)).length,3);
});

test('HTTP launch regressions: parallel free quota, download gate, safe logs, plan intent and CSP',async t=>{
  const mail=await startSmtpSink();let app,database;
  t.after(async()=>{try{await app?.stop();}finally{try{await database?.stop();}finally{await mail.stop();}}});
  if(process.env.RELEASE_TEST_POSTGRES==='1') database=await startTemporaryPostgres();
  app=await startApp({...mail.environment,...database?.environment});
  const next='/account?tab=plans&plan=creator&interval=year';
  const signup=await fetch(`${app.baseUrl}/signup?next=${encodeURIComponent(next)}`);
  const html=await signup.text();assert.ok(html.includes('name="next"'));assert.ok(html.includes('plan=creator'));
  const csp=signup.headers.get('content-security-policy');
  assert.match(csp,/script-src[^;]+'nonce-/);assert.doesNotMatch(csp,/script-src[^;]+'unsafe-inline'/);
  const email='launch@example.test',password='Launch-fixture-password-123';
  const registration=await fetch(app.baseUrl+'/api/auth/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,password,displayName:'Launch Test'})});
  assert.equal(registration.status,201);
  const token=emailToken(mail.messages.at(-1),'verify-email');
  await fetch(app.baseUrl+'/api/auth/verify-email',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({token})});
  const login=await fetch(app.baseUrl+'/login',{method:'POST',redirect:'manual',headers:{'content-type':'application/x-www-form-urlencoded',origin:app.baseUrl},body:new URLSearchParams({email,password,next})});
  assert.equal(login.headers.get('location'),next);
  const cookie=login.headers.get('set-cookie').split(';')[0];
  const headers={cookie,origin:app.baseUrl,'content-type':'application/json'};
  const download=await fetch(app.baseUrl+'/downloads/plugin/latest',{headers:{cookie},redirect:'manual'});
  assert.equal(download.status,302);assert.equal(download.headers.get('location'),'/account?tab=plans');
  const payload={songTitle:'Launch quota test',date:'2026-10-02',allPartiesAgree:true,collectSignaturesByInvite:true,contributors:[{legalName:'Test Artist',role:'Writer',email:'artist@example.test',writerShare:50,publisherShare:50},{legalName:'Test Producer',role:'Producer',email:'producer@example.test',writerShare:50,publisherShare:50}]};
  const responses=await Promise.all(Array.from({length:12},()=>fetch(app.baseUrl+'/api/split-sheets',{method:'POST',headers,body:JSON.stringify(payload)})));
  assert.equal(responses.filter(response=>response.status===201).length,3,await responses[0].clone().text());
  assert.equal(responses.filter(response=>response.status===402).length,9);
  const created=await responses.find(response=>response.status===201).json();
  const archived=await fetch(`${app.baseUrl}/account/split-sheets/${created.splitSheet.id}/archive`,{method:'POST',headers,redirect:'manual',body:'{}'});
  assert.equal(archived.status,302);
  const denied=await fetch(app.baseUrl+'/api/split-sheets',{method:'POST',headers,body:JSON.stringify(payload)});assert.equal(denied.status,402);
  await fetch(app.baseUrl+'/split-sheet/sign/audit/MARKER_SECRET_MUST_NOT_LOG');
  assert.ok(!app.getOutput().includes('MARKER_SECRET_MUST_NOT_LOG'));
  assert.ok(mail.messages.every(message=>!message.recipients.includes('operator@example.test')),'Operator must not receive contributor copies');
});
