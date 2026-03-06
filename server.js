require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const { nanoid } = require("nanoid");

const app = express();
const PORT = process.env.PORT || 5050;
const HOST = process.env.HOST || "0.0.0.0";
const baseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;
const dataDir = path.join(__dirname, "data");
const submissionsDir = path.join(dataDir, "submissions");
const pdfDir = path.join(dataDir, "pdfs");

fs.mkdirSync(submissionsDir, { recursive: true });
fs.mkdirSync(pdfDir, { recursive: true });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/vendor/signature_pad", express.static(path.join(__dirname, "node_modules", "signature_pad", "dist")));
app.use(session({
  secret: process.env.SESSION_SECRET || "split-open-sign",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: String(process.env.COOKIE_SECURE || "false") === "true",
    maxAge: 1000 * 60 * 60 * 8
  }
}));

function nowIso() { return new Date().toISOString(); }
function uniq(arr) { return [...new Set(arr.filter(Boolean))]; }

const loginAttempts = new Map();
function loginKey(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown");
}
function canAttemptLogin(req) {
  const key = loginKey(req);
  const row = loginAttempts.get(key) || { count: 0, blockedUntil: 0 };
  const now = Date.now();
  if (row.blockedUntil > now) {
    return { allowed: false, retryAfterSec: Math.ceil((row.blockedUntil - now) / 1000) };
  }
  return { allowed: true, retryAfterSec: 0 };
}
function recordLoginFailure(req) {
  const key = loginKey(req);
  const row = loginAttempts.get(key) || { count: 0, blockedUntil: 0 };
  row.count += 1;
  if (row.count >= 5) {
    row.count = 0;
    row.blockedUntil = Date.now() + 1000 * 60 * 10;
  }
  loginAttempts.set(key, row);
}
function clearLoginFailures(req) {
  loginAttempts.delete(loginKey(req));
}

function parseContributors(body) {
  const pick = (k) => Array.isArray(body[k]) ? body[k] : [body[k]].filter(Boolean);
  const names = pick("legalName"), roles = pick("role"), addresses = pick("address"), phones = pick("phone"), emails = pick("email"), pros = pick("pro"), ipis = pick("ipi"), pubs = pick("publisherName"), pubIpis = pick("publisherIpi"), w = pick("writerShare"), p = pick("publisherShare"), sig = pick("signatureData");
  const typed = pick("typedSignatureName");
  return names.map((n, i) => ({
    legalName: n,
    role: roles[i] || "",
    address: addresses[i] || "",
    phone: phones[i] || "",
    email: emails[i] || "",
    pro: pros[i] || "",
    ipi: ipis[i] || "",
    publisherName: pubs[i] || "",
    publisherIpi: pubIpis[i] || "",
    writerShare: Number(w[i] || 0),
    publisherShare: Number(p[i] || 0),
    typedSignatureName: typed[i] || "",
    signatureData: sig[i] || ""
  })).filter((c) => c.legalName);
}

function submissionPath(id) {
  return path.join(submissionsDir, `${id}.json`);
}

function loadSubmission(id) {
  const p = submissionPath(id);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function saveSubmissionRow(row) {
  fs.writeFileSync(submissionPath(row.id), JSON.stringify(row, null, 2));
}

function saveSubmission(type, payload, req) {
  const id = nanoid(10);
  const row = {
    id,
    type,
    status: payload.collectSignaturesByInvite ? "pending-signatures" : "completed",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    userAgent: req.headers["user-agent"],
    payload
  };
  saveSubmissionRow(row);
  return row;
}

function listSubmissions() {
  return fs.readdirSync(submissionsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(submissionsDir, f), "utf-8")))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function nextSplitVersion(songTitle) {
  const normalized = String(songTitle || "").trim().toLowerCase();
  if (!normalized) return 1;
  const all = listSubmissions().filter((d) => d.type === "split-sheet");
  const matches = all.filter((d) => String(d.payload?.songTitle || "").trim().toLowerCase() === normalized);
  const maxV = matches.reduce((m, d) => Math.max(m, Number(d.payload?.version || 1)), 0);
  return maxV + 1;
}

function splitPdfPath(id) {
  return path.join(pdfDir, `split-sheet-${id}-final.pdf`);
}

function checksumFor(row) {
  return crypto.createHash("sha256").update(JSON.stringify({ id: row.id, payload: row.payload, createdAt: row.createdAt })).digest("hex");
}

function generateFinalSplitPdf(docJson) {
  const outPath = splitPdfPath(docJson.id);
  const payload = docJson.payload || {};
  const contributors = payload.contributors || [];

  const pdf = new PDFDocument({ margin: 40 });
  const stream = fs.createWriteStream(outPath);
  pdf.pipe(stream);

  pdf.fontSize(18).text("Blak Marigold Studio Split Sheet - Final Packet", { underline: true });
  pdf.moveDown();
  pdf.fontSize(11).text(`Submission ID: ${docJson.id}`);
  pdf.text(`Status: ${docJson.status}`);
  pdf.text(`Song Title: ${payload.songTitle || ""}`);
  pdf.text(`Alt Title: ${payload.alternateTitle || ""}`);
  pdf.text(`Date: ${payload.date || ""}`);
  pdf.text(`Version: ${payload.version || 1}`);
  pdf.text(`Session Location: ${payload.sessionLocation || ""}`);
  pdf.text(`Created: ${docJson.createdAt}`);
  pdf.text(`Updated: ${docJson.updatedAt || docJson.createdAt}`);
  pdf.moveDown();

  contributors.forEach((c, i) => {
    pdf.fontSize(12).text(`Contributor #${i + 1}: ${c.legalName}`);
    pdf.fontSize(10).text(`Role: ${c.role}`);
    pdf.text(`Email: ${c.email} | Phone: ${c.phone}`);
    pdf.text(`Writer Share: ${c.writerShare}% | Publisher Share: ${c.publisherShare}%`);
    pdf.text(`Typed Signature: ${c.typedSignatureName || ""}`);
    pdf.text(`Signed At: ${c.signedAt || "Pending"}`);
    pdf.moveDown(0.7);
  });

  const auditChecksum = checksumFor(docJson);
  pdf.moveDown();
  pdf.fontSize(10).text("Audit Block", { underline: true });
  pdf.text(`Origin IP: ${docJson.ip || ""}`);
  pdf.text(`User Agent: ${docJson.userAgent || ""}`);
  pdf.text(`Checksum (SHA-256): ${auditChecksum}`);
  pdf.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve({ outPath, auditChecksum }));
    stream.on("error", reject);
  });
}

async function sendEmail({ subject, html, to }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return { ok: false, skipped: true, reason: "smtp_not_configured" };
  }
  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  try {
    await t.sendMail({ from: process.env.FROM_EMAIL || process.env.SMTP_USER, to: to.join(","), subject, html });
    return { ok: true, skipped: false, reason: "sent" };
  } catch (e) {
    console.error("Email send failed:", e.message || e);
    return { ok: false, skipped: false, reason: `smtp_error:${e.message || "unknown"}` };
  }
}

async function sendSplitInvite(doc, contributor) {
  const notifyInbox = process.env.NOTIFY_EMAIL || "blakmarigold@gmail.com";
  const link = `${baseUrl}/split-sheet/sign/${doc.id}/${contributor.signerToken}`;
  await sendEmail({
    subject: `Action required: Sign split sheet for ${doc.payload.songTitle}`,
    to: [contributor.email, notifyInbox],
    html: `<h2>Signature Request</h2><p>Song: ${doc.payload.songTitle}</p><p>Contributor: ${contributor.legalName}</p><p><a href="${link}">Open your secure signing link</a></p><p>Submission ID: ${doc.id}</p>`
  });
}

function requireAdmin(req, res, next) { if (req.session && req.session.isAdmin) return next(); res.redirect("/admin/login"); }

app.get("/", (req, res) => res.render("index"));
app.get("/health", (req, res) => res.json({ ok: true, at: nowIso() }));
app.get("/ready", (req, res) => res.json({
  ok: true,
  at: nowIso(),
  smtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
  baseUrl
}));
app.get("/split-sheet", (req, res) => res.render("split-sheet", { error: null }));

app.post("/split-sheet", async (req, res) => {
  try {
    const contributors = parseContributors(req.body);
    const writerTotal = contributors.reduce((a, c) => a + c.writerShare, 0);
    const publisherTotal = contributors.reduce((a, c) => a + c.publisherShare, 0);
    const collectByInvite = String(req.body.collectSignaturesByInvite || "").toLowerCase() === "yes";

    if (!String(req.body.songTitle || "").trim()) {
      return res.status(400).render("split-sheet", { error: "Song title is required." });
    }
    if (!contributors.length || contributors.length < 2) {
      return res.status(400).render("split-sheet", { error: "At least 2 contributors are required for a valid split sheet." });
    }

    const hasMissingBasicFields = contributors.some((c) =>
      !String(c.legalName || "").trim() ||
      !String(c.role || "").trim() ||
      !String(c.email || "").trim()
    );
    if (hasMissingBasicFields) {
      return res.status(400).render("split-sheet", { error: "Each contributor must include legal name, role, and email." });
    }

    if (!collectByInvite) {
      const hasMissingLegalFields = contributors.some((c) =>
        !String(c.typedSignatureName || "").trim() ||
        !String(c.signatureData || "").startsWith("data:image/")
      );
      if (hasMissingLegalFields) {
        return res.status(400).render("split-sheet", { error: "Each contributor must include typed signature name and drawn signature unless invite flow is enabled." });
      }
    }

    if (Math.round(writerTotal * 100) / 100 !== 100 || Math.round(publisherTotal * 100) / 100 !== 100) {
      return res.status(400).render("split-sheet", { error: `Shares invalid. Writer total=${writerTotal}, Publisher total=${publisherTotal}. Both must equal 100.` });
    }
    if (String(req.body.allPartiesAgree || "").toLowerCase() !== "yes") {
      return res.status(400).render("split-sheet", { error: "All parties agreement confirmation is required." });
    }

    const payload = {
      songTitle: req.body.songTitle,
      alternateTitle: req.body.alternateTitle || "",
      iswc: req.body.iswc || "",
      isrc: req.body.isrc || "",
      date: req.body.date,
      sessionLocation: req.body.sessionLocation || "",
      notes: req.body.notes || "",
      supersedesPrevious: String(req.body.supersedesPrevious || "").toLowerCase() === "yes",
      allPartiesAgree: true,
      collectSignaturesByInvite: collectByInvite,
      version: nextSplitVersion(req.body.songTitle),
      contributors: contributors.map((c) => ({
        ...c,
        signerToken: collectByInvite ? nanoid(22) : null,
        inviteSentAt: collectByInvite ? nowIso() : null,
        reminderSentAt: null,
        viewedAt: null,
        signedAt: collectByInvite ? null : nowIso()
      }))
    };

    const saved = saveSubmission("split-sheet", payload, req);

    let emailResult = { ok: false, skipped: true, reason: "not_attempted" };

    if (collectByInvite) {
      for (const c of payload.contributors) {
        await sendSplitInvite(saved, c);
      }
      const selectedRecipients = Array.isArray(req.body.recipientEmails) ? req.body.recipientEmails : [req.body.recipientEmails].filter(Boolean);
      const rec = uniq([(process.env.NOTIFY_EMAIL || "blakmarigold@gmail.com"), ...payload.contributors.map((c) => c.email), ...selectedRecipients]);
      emailResult = await sendEmail({
        subject: `Split Sheet Created - ${payload.songTitle} (v${payload.version})`,
        to: rec,
        html: `<h2>Split Sheet Created</h2><p>ID: ${saved.id}</p><p>Song: ${payload.songTitle}</p><p>Version: ${payload.version}</p><p>Status: Pending signatures</p><p><a href="${baseUrl}/split-sheet/pdf/${saved.id}">Download Current PDF Summary</a></p><p><b>Recipients:</b> ${rec.join(", ")}</p>`
      });
    } else {
      const selectedRecipients = Array.isArray(req.body.recipientEmails) ? req.body.recipientEmails : [req.body.recipientEmails].filter(Boolean);
      const rec = uniq([(process.env.NOTIFY_EMAIL || "blakmarigold@gmail.com"), ...payload.contributors.map((c) => c.email), ...selectedRecipients]);
      const { auditChecksum } = await generateFinalSplitPdf(saved);
      saved.payload.auditChecksum = auditChecksum;
      saved.updatedAt = nowIso();
      saveSubmissionRow(saved);

      emailResult = await sendEmail({
        subject: `New Split Sheet Signed - ${payload.songTitle} (v${payload.version})`,
        to: rec,
        html: `<h2>Split Sheet Signed</h2><p>ID: ${saved.id}</p><p>Song: ${payload.songTitle}</p><p>Version: ${payload.version}</p><p><a href="${baseUrl}/split-sheet/pdf/${saved.id}">Download Final PDF Packet</a></p><p><b>Recipients:</b> ${rec.join(", ")}</p>`
      });
    }

    res.render("success", {
      title: collectByInvite ? "Split Sheet created. Signature invites sent." : "Split Sheet submitted",
      id: saved.id,
      type: "split-sheet",
      songTitle: payload.songTitle,
      version: payload.version,
      status: saved.status,
      collectSignaturesByInvite: collectByInvite,
      emailResult
    });
  } catch (e) {
    console.error(e);
    res.status(500).render("split-sheet", { error: "Unexpected server error while saving split sheet." });
  }
});

app.get("/split-sheet/sign/:id/:token", (req, res) => {
  const doc = loadSubmission(req.params.id);
  if (!doc || doc.type !== "split-sheet") return res.status(404).send("Not found");
  const signer = (doc.payload?.contributors || []).find((c) => c.signerToken === req.params.token);
  if (!signer) return res.status(404).send("Invalid sign link");

  if (!signer.viewedAt) {
    signer.viewedAt = nowIso();
    doc.updatedAt = nowIso();
    saveSubmissionRow(doc);
  }

  res.render("split-sign", { doc, signer, error: null, success: null });
});

app.post("/split-sheet/sign/:id/:token", async (req, res) => {
  const doc = loadSubmission(req.params.id);
  if (!doc || doc.type !== "split-sheet") return res.status(404).send("Not found");
  const contributors = doc.payload?.contributors || [];
  const signerIndex = contributors.findIndex((c) => c.signerToken === req.params.token);
  if (signerIndex < 0) return res.status(404).send("Invalid sign link");

  const typedSignatureName = String(req.body.typedSignatureName || "").trim();
  const signatureData = String(req.body.signatureData || "").trim();
  if (!typedSignatureName || !signatureData.startsWith("data:image/")) {
    const signer = contributors[signerIndex];
    return res.status(400).render("split-sign", { doc, signer, error: "Typed name and drawn signature are required.", success: null });
  }

  contributors[signerIndex].typedSignatureName = typedSignatureName;
  contributors[signerIndex].signatureData = signatureData;
  contributors[signerIndex].signedAt = nowIso();

  const everyoneSigned = contributors.every((c) => c.signedAt);
  if (everyoneSigned) {
    doc.status = "completed";
    const { auditChecksum } = await generateFinalSplitPdf(doc);
    doc.payload.auditChecksum = auditChecksum;

    const recipients = uniq([
      process.env.NOTIFY_EMAIL || "blakmarigold@gmail.com",
      ...contributors.map((c) => c.email)
    ]);
    await sendEmail({
      subject: `Completed Split Sheet - ${doc.payload.songTitle} (v${doc.payload.version})`,
      to: recipients,
      html: `<h2>All signatures completed</h2><p>ID: ${doc.id}</p><p>Song: ${doc.payload.songTitle}</p><p><a href="${baseUrl}/split-sheet/pdf/${doc.id}">Download Final PDF Packet</a></p>`
    });
  }

  doc.updatedAt = nowIso();
  saveSubmissionRow(doc);

  const signer = contributors[signerIndex];
  res.render("split-sign", { doc, signer, error: null, success: everyoneSigned ? "Signed. Final packet has been generated and emailed." : "Signed successfully. Waiting on other signer(s)." });
});

app.get("/sync-collab", (req, res) => res.render("sync-collab"));
app.post("/sync-collab", async (req, res) => {
  const collaborators = parseContributors(req.body);
  const payload = { agreementName: "Sync Collaboration Agreement", companyRepName: req.body.companyRepName, companyRepSignature: req.body.companyRepSignature, collaborators, signedDate: req.body.signedDate };
  const saved = saveSubmission("sync-collab", payload, req);
  const rec = uniq([(process.env.NOTIFY_EMAIL || "blakmarigold@gmail.com"), ...collaborators.map((c) => c.email)]);
  await sendEmail({ subject: "Sync Collaboration Agreement Signed", to: rec, html: `<h2>Sync Agreement Signed</h2><p>ID: ${saved.id}</p>` });
  res.render("success", { title: "Sync Collaboration Agreement submitted", id: saved.id, type: "sync-collab" });
});

app.get("/work-for-hire", (req, res) => res.render("work-for-hire"));
app.post("/work-for-hire", async (req, res) => {
  const payload = { projectTitle: req.body.projectTitle, contractorName: req.body.contractorName, contractorEmail: req.body.contractorEmail, contractorPhone: req.body.contractorPhone, fee: req.body.fee, signedDate: req.body.signedDate, companyRepName: req.body.companyRepName, companyRepSignature: req.body.companyRepSignature, contractorSignature: req.body.contractorSignature };
  const saved = saveSubmission("work-for-hire", payload, req);
  const rec = uniq([(process.env.NOTIFY_EMAIL || "blakmarigold@gmail.com"), payload.contractorEmail]);
  await sendEmail({ subject: `Work for Hire Signed - ${payload.projectTitle || ""}`, to: rec, html: `<h2>Work for Hire Signed</h2><p>ID: ${saved.id}</p>` });
  res.render("success", { title: "Work for Hire submitted", id: saved.id, type: "work-for-hire" });
});

app.get("/split-sheet/pdf/:id", async (req, res) => {
  const p = submissionPath(req.params.id);
  if (!fs.existsSync(p)) return res.status(404).send("Not found");
  const docJson = JSON.parse(fs.readFileSync(p, "utf-8"));
  if (docJson.type !== "split-sheet") return res.status(400).send("Not a split sheet");

  const finalPdf = splitPdfPath(docJson.id);
  if (fs.existsSync(finalPdf)) {
    return res.download(finalPdf, `split-sheet-${docJson.id}-final.pdf`);
  }

  // fallback summary packet if final not generated yet
  const payload = docJson.payload || {};
  const contributors = payload.contributors || [];
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="split-sheet-${docJson.id}-summary.pdf"`);

  const pdf = new PDFDocument({ margin: 40 });
  pdf.pipe(res);
  pdf.fontSize(18).text("Blak Marigold Studio Split Sheet - Summary", { underline: true });
  pdf.moveDown();
  pdf.fontSize(11).text(`Submission ID: ${docJson.id}`);
  pdf.text(`Song Title: ${payload.songTitle || ""}`);
  pdf.text(`Status: ${docJson.status}`);
  contributors.forEach((c, i) => {
    pdf.moveDown(0.5);
    pdf.text(`${i + 1}. ${c.legalName} - ${c.writerShare}% / ${c.publisherShare}% - Signed: ${c.signedAt ? "Yes" : "No"}`);
  });
  pdf.end();
});

app.get("/admin/login", (req, res) => res.render("admin-login", { error: null }));
app.post("/admin/login", (req, res) => {
  const gate = canAttemptLogin(req);
  if (!gate.allowed) {
    return res.status(429).render("admin-login", { error: `Too many attempts. Try again in ${gate.retryAfterSec}s.` });
  }

  if (req.body.username === (process.env.ADMIN_USER || "Knolly") && req.body.password === (process.env.ADMIN_PASS || "Testsubject5")) {
    clearLoginFailures(req);
    req.session.isAdmin = true;
    return res.redirect("/admin");
  }

  recordLoginFailure(req);
  res.status(401).render("admin-login", { error: "Invalid credentials" });
});
app.get("/admin", requireAdmin, (req, res) => {
  const docs = listSubmissions().map((d) => {
    if (d.type !== "split-sheet") return d;
    const contributors = d.payload?.contributors || [];
    const signedCount = contributors.filter((c) => c.signedAt).length;
    return {
      ...d,
      signerStats: {
        total: contributors.length,
        signed: signedCount,
        pending: Math.max(0, contributors.length - signedCount)
      }
    };
  });
  res.render("admin", { docs });
});

app.post("/admin/split/:id/remind", requireAdmin, async (req, res) => {
  const doc = loadSubmission(req.params.id);
  if (!doc || doc.type !== "split-sheet") return res.status(404).send("Not found");

  const pending = (doc.payload?.contributors || []).filter((c) => c.signerToken && !c.signedAt);
  for (const contributor of pending) {
    contributor.reminderSentAt = nowIso();
    await sendSplitInvite(doc, contributor);
  }
  doc.updatedAt = nowIso();
  saveSubmissionRow(doc);
  res.redirect("/admin");
});

app.get("/admin/doc/:id", requireAdmin, (req, res) => { const p = submissionPath(req.params.id); if (!fs.existsSync(p)) return res.status(404).send("Not found"); res.type("application/json").send(fs.readFileSync(p, "utf-8")); });

app.listen(PORT, HOST, () => console.log(`Split Sheet Open Sign running at ${baseUrl}`));
