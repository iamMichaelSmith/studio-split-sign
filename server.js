require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const { nanoid } = require("nanoid");

const app = express();
const PORT = process.env.PORT || 5050;
const HOST = process.env.HOST || "0.0.0.0";
const submissionsDir = path.join(__dirname, "data", "submissions");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "split-open-sign", resave: false, saveUninitialized: false }));

function nowIso(){ return new Date().toISOString(); }
function uniq(arr){ return [...new Set(arr.filter(Boolean))]; }

function parseContributors(body){
  const pick = (k) => Array.isArray(body[k]) ? body[k] : [body[k]].filter(Boolean);
  const names=pick('legalName'), roles=pick('role'), addresses=pick('address'), phones=pick('phone'), emails=pick('email'), pros=pick('pro'), ipis=pick('ipi'), pubs=pick('publisherName'), pubIpis=pick('publisherIpi'), w=pick('writerShare'), p=pick('publisherShare'), sig=pick('signatureData');
  const typed = pick('typedSignatureName');
  return names.map((n,i)=>({legalName:n,role:roles[i]||'',address:addresses[i]||'',phone:phones[i]||'',email:emails[i]||'',pro:pros[i]||'',ipi:ipis[i]||'',publisherName:pubs[i]||'',publisherIpi:pubIpis[i]||'',writerShare:Number(w[i]||0),publisherShare:Number(p[i]||0),typedSignatureName:typed[i]||'',signatureData:sig[i]||''})).filter(c=>c.legalName);
}

function saveSubmission(type,payload,req){
  const id=nanoid(10);
  const row={id,type,createdAt:nowIso(),ip:req.headers['x-forwarded-for']||req.socket.remoteAddress,userAgent:req.headers['user-agent'],payload};
  fs.writeFileSync(path.join(submissionsDir, `${id}.json`), JSON.stringify(row,null,2));
  return row;
}

function listSubmissions(){
  return fs.readdirSync(submissionsDir).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join(submissionsDir,f),'utf-8'))).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
}

function nextSplitVersion(songTitle){
  const normalized = String(songTitle || '').trim().toLowerCase();
  if(!normalized) return 1;
  const all = listSubmissions().filter(d => d.type === 'split-sheet');
  const matches = all.filter(d => String(d.payload?.songTitle || '').trim().toLowerCase() === normalized);
  const maxV = matches.reduce((m, d) => Math.max(m, Number(d.payload?.version || 1)), 0);
  return maxV + 1;
}

async function sendEmail({subject,html,to}){
  if(!process.env.SMTP_USER||!process.env.SMTP_PASS) return;
  const t=nodemailer.createTransport({host:process.env.SMTP_HOST||'smtp.gmail.com',port:Number(process.env.SMTP_PORT||465),secure:String(process.env.SMTP_SECURE||'true')==='true',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
  await t.sendMail({from:process.env.FROM_EMAIL||process.env.SMTP_USER,to:to.join(','),subject,html});
}

function requireAdmin(req,res,next){ if(req.session&&req.session.isAdmin) return next(); res.redirect('/admin/login'); }

app.get('/',(req,res)=>res.render('index'));
app.get('/split-sheet',(req,res)=>res.render('split-sheet',{error:null}));
app.post('/split-sheet',async(req,res)=>{
  const contributors=parseContributors(req.body);
  const writerTotal=contributors.reduce((a,c)=>a+c.writerShare,0);
  const publisherTotal=contributors.reduce((a,c)=>a+c.publisherShare,0);

  if (!String(req.body.songTitle || '').trim()) {
    return res.status(400).render('split-sheet',{error:'Song title is required.'});
  }
  if (!contributors.length || contributors.length < 2) {
    return res.status(400).render('split-sheet',{error:'At least 2 contributors are required for a valid split sheet.'});
  }

  const hasMissingLegalFields = contributors.some(c =>
    !String(c.legalName || '').trim() ||
    !String(c.role || '').trim() ||
    !String(c.email || '').trim() ||
    !String(c.typedSignatureName || '').trim() ||
    !String(c.signatureData || '').startsWith('data:image/')
  );
  if (hasMissingLegalFields) {
    return res.status(400).render('split-sheet',{error:'Each contributor must include legal name, role, email, typed signature name, and drawn signature.'});
  }

  if (Math.round(writerTotal*100)/100!==100 || Math.round(publisherTotal*100)/100!==100){
    return res.status(400).render('split-sheet',{error:`Shares invalid. Writer total=${writerTotal}, Publisher total=${publisherTotal}. Both must equal 100.`});
  }
  if(String(req.body.allPartiesAgree || '').toLowerCase() !== 'yes'){
    return res.status(400).render('split-sheet',{error:'All parties agreement confirmation is required.'});
  }

  const payload={
    songTitle:req.body.songTitle,
    alternateTitle:req.body.alternateTitle || '',
    iswc:req.body.iswc || '',
    isrc:req.body.isrc || '',
    date:req.body.date,
    sessionLocation:req.body.sessionLocation || '',
    notes:req.body.notes || '',
    supersedesPrevious:String(req.body.supersedesPrevious || '').toLowerCase()==='yes',
    allPartiesAgree:true,
    version: nextSplitVersion(req.body.songTitle),
    contributors
  };
  const saved=saveSubmission('split-sheet',payload,req);
  const selectedRecipients = Array.isArray(req.body.recipientEmails)
    ? req.body.recipientEmails
    : [req.body.recipientEmails].filter(Boolean);
  const rec=uniq([(process.env.NOTIFY_EMAIL||'blakmarigold@gmail.com'), ...contributors.map(c=>c.email), ...selectedRecipients]);
  await sendEmail({subject:`New Split Sheet Signed - ${payload.songTitle} (v${payload.version})`,to:rec,html:`<h2>Split Sheet Signed</h2><p>ID: ${saved.id}</p><p>Song: ${payload.songTitle}</p><p>Version: ${payload.version}</p><p><a href="http://localhost:${PORT}/split-sheet/pdf/${saved.id}">Download PDF Summary</a></p><p><b>Recipients:</b> ${rec.join(', ')}</p>`});
  res.render('success',{title:'Split Sheet submitted',id:saved.id,type:'split-sheet',songTitle:payload.songTitle,version:payload.version});
});

app.get('/sync-collab',(req,res)=>res.render('sync-collab'));
app.post('/sync-collab',async(req,res)=>{
  const collaborators=parseContributors(req.body);
  const payload={agreementName:'Sync Collaboration Agreement',companyRepName:req.body.companyRepName,companyRepSignature:req.body.companyRepSignature,collaborators,signedDate:req.body.signedDate};
  const saved=saveSubmission('sync-collab',payload,req);
  const rec=uniq([(process.env.NOTIFY_EMAIL||'blakmarigold@gmail.com'), ...collaborators.map(c=>c.email)]);
  await sendEmail({subject:'Sync Collaboration Agreement Signed',to:rec,html:`<h2>Sync Agreement Signed</h2><p>ID: ${saved.id}</p>`});
  res.render('success',{title:'Sync Collaboration Agreement submitted',id:saved.id,type:'sync-collab'});
});

app.get('/work-for-hire',(req,res)=>res.render('work-for-hire'));
app.post('/work-for-hire',async(req,res)=>{
  const payload={projectTitle:req.body.projectTitle,contractorName:req.body.contractorName,contractorEmail:req.body.contractorEmail,contractorPhone:req.body.contractorPhone,fee:req.body.fee,signedDate:req.body.signedDate,companyRepName:req.body.companyRepName,companyRepSignature:req.body.companyRepSignature,contractorSignature:req.body.contractorSignature};
  const saved=saveSubmission('work-for-hire',payload,req);
  const rec=uniq([(process.env.NOTIFY_EMAIL||'blakmarigold@gmail.com'), payload.contractorEmail]);
  await sendEmail({subject:`Work for Hire Signed - ${payload.projectTitle||''}`,to:rec,html:`<h2>Work for Hire Signed</h2><p>ID: ${saved.id}</p>`});
  res.render('success',{title:'Work for Hire submitted',id:saved.id,type:'work-for-hire'});
});

app.get('/split-sheet/pdf/:id',(req,res)=>{
  const p = path.join(submissionsDir, `${req.params.id}.json`);
  if(!fs.existsSync(p)) return res.status(404).send('Not found');
  const docJson = JSON.parse(fs.readFileSync(p,'utf-8'));
  if(docJson.type !== 'split-sheet') return res.status(400).send('Not a split sheet');

  const payload = docJson.payload || {};
  const contributors = payload.contributors || [];

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="split-sheet-${docJson.id}.pdf"`);

  const pdf = new PDFDocument({ margin: 40 });
  pdf.pipe(res);
  pdf.fontSize(18).text('Blak Marigold Studio Split Sheet', { underline: true });
  pdf.moveDown();
  pdf.fontSize(11).text(`Submission ID: ${docJson.id}`);
  pdf.text(`Song Title: ${payload.songTitle || ''}`);
  pdf.text(`Alt Title: ${payload.alternateTitle || ''}`);
  pdf.text(`ISWC: ${payload.iswc || ''} | ISRC: ${payload.isrc || ''}`);
  pdf.text(`Date: ${payload.date || ''}`);
  pdf.text(`Version: ${payload.version || 1}`);
  pdf.text(`Session Location: ${payload.sessionLocation || ''}`);
  pdf.text(`Created: ${docJson.createdAt}`);
  pdf.text(`IP: ${docJson.ip || ''}`);
  pdf.moveDown();

  contributors.forEach((c, i) => {
    pdf.fontSize(12).text(`Contributor #${i+1}: ${c.legalName}`);
    pdf.fontSize(10).text(`Role: ${c.role}`);
    pdf.text(`Email: ${c.email} | Phone: ${c.phone}`);
    pdf.text(`Address: ${c.address}`);
    pdf.text(`PRO: ${c.pro} | IPI: ${c.ipi}`);
    pdf.text(`Publisher: ${c.publisherName} | Publisher IPI: ${c.publisherIpi}`);
    pdf.text(`Writer Share: ${c.writerShare}% | Publisher Share: ${c.publisherShare}%`);
    pdf.text(`Typed Signature: ${c.typedSignatureName || ''}`);
    pdf.moveDown(0.7);
  });

  pdf.moveDown();
  pdf.fontSize(10).text(`Notes: ${payload.notes || ''}`);
  pdf.end();
});

app.get('/admin/login',(req,res)=>res.render('admin-login',{error:null}));
app.post('/admin/login',(req,res)=>{
  if(req.body.username===(process.env.ADMIN_USER||'Knolly') && req.body.password===(process.env.ADMIN_PASS||'Testsubject5')){ req.session.isAdmin=true; return res.redirect('/admin'); }
  res.status(401).render('admin-login',{error:'Invalid credentials'});
});
app.get('/admin',requireAdmin,(req,res)=>res.render('admin',{docs:listSubmissions()}));
app.get('/admin/doc/:id',requireAdmin,(req,res)=>{const p=path.join(submissionsDir,`${req.params.id}.json`); if(!fs.existsSync(p)) return res.status(404).send('Not found'); res.type('application/json').send(fs.readFileSync(p,'utf-8'));});

app.listen(PORT,HOST,()=>console.log(`Split Sheet Open Sign running at http://${HOST}:${PORT}`));
