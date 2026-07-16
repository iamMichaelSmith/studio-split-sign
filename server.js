try {
  require("dotenv").config();
} catch {}
const express = require("express");
const { rateLimit } = require("express-rate-limit");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const Stripe = require("stripe");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { SESv2Client, SendEmailCommand, ListEmailIdentitiesCommand } = require("@aws-sdk/client-sesv2");
const { RedisStore } = require("connect-redis");
const { RedisStore: RateLimitRedisStore } = require("rate-limit-redis");
const { createClient } = require("redis");
const { nanoid } = require("nanoid");
const { createAuthService, ApiAuthError } = require("./services/auth-service");
const { createDatabaseService } = require("./services/database-service");
const { createStorefrontService } = require("./services/storefront-service");
const { createSubmissionService } = require("./services/submission-service");
const { listPosts, getPostBySlug } = require("./content/blog-posts");
const {
  SplitSheetValidationError,
  buildSplitSheetDraftPayload,
  buildSplitSheetPayload,
  detailSplitSheet,
  splitTotals,
  summarizeSplitSheet
} = require("./services/split-sheet-service");

const app = express();
const PORT = process.env.PORT || 5050;
const HOST = process.env.HOST || "0.0.0.0";
const baseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;
const baseOrigin = new URL(baseUrl);
const appHost = baseOrigin.hostname.toLowerCase();
const rootDomain = String(process.env.ROOT_DOMAIN || appHost.replace(/^app\./, "")).toLowerCase();
const marketingHosts = new Set([rootDomain, `www.${rootDomain}`].filter(Boolean));
const trustProxy = String(process.env.TRUST_PROXY || "false").toLowerCase() === "true";
const dbProvider = process.env.DB_PROVIDER || "sqlite";
const sessionStoreMode = String(process.env.SESSION_STORE || (process.env.REDIS_URL ? "redis" : "memory")).toLowerCase();
const dataDir = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, "data");
const submissionsDir = path.join(dataDir, "submissions");
const pdfDir = path.join(dataDir, "pdfs");
const authDbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.join(dataDir, "app.db");
const pdfLogoMarkPath = path.join(__dirname, "public", "pdf-logo-mark.png");
const cookieSecure = String(process.env.COOKIE_SECURE || "false") === "true";
const cookieMaxAgeMs = 1000 * 60 * 60 * 8;
const sessionTtlSeconds = Math.max(60, Math.floor(cookieMaxAgeMs / 1000));
const redisPrefix = process.env.REDIS_PREFIX || "splitsheet:sess:";
const pdfStorageMode = String(process.env.PDF_STORAGE || (process.env.S3_BUCKET ? "s3" : "local")).toLowerCase();
const s3Bucket = process.env.S3_BUCKET || "";
const s3Region = process.env.S3_REGION || process.env.AWS_REGION || "us-east-1";
const s3Prefix = String(process.env.S3_PREFIX || "final-pdfs/").replace(/^\/+/, "").replace(/\/+$/, "");
const authDebugTokens = String(process.env.AUTH_DEBUG_TOKENS || "false").toLowerCase() === "true";
const requireEmailVerification = String(process.env.REQUIRE_EMAIL_VERIFICATION || "false").toLowerCase() === "true";
const supportEmail = process.env.SUPPORT_EMAIL || process.env.NOTIFY_EMAIL || process.env.REPLY_TO_EMAIL || "blakmarigold@gmail.com";
const rawStripeSecretKey = String(process.env.STRIPE_SECRET_KEY || "").trim();
const rawStripeWebhookSecret = String(process.env.STRIPE_WEBHOOK_SECRET || "").trim();
const stripeSecretKey = /^(disabled|unset|none|null)$/i.test(rawStripeSecretKey) ? "" : rawStripeSecretKey;
const stripeWebhookSecret = /^(disabled|unset|none|null)$/i.test(rawStripeWebhookSecret) ? "" : rawStripeWebhookSecret;
const stripePluginPriceUsdCents = Number(process.env.STRIPE_PLUGIN_PRICE_USD_CENTS || 1000);
const stripePluginProductSku = process.env.STRIPE_PLUGIN_PRODUCT_SKU || "splitsheet-studio-vst3";
const stripePluginProductName = process.env.STRIPE_PLUGIN_PRODUCT_NAME || "SplitSheet Studio VST3 Plugin";
const stripePluginProductDescription = process.env.STRIPE_PLUGIN_PRODUCT_DESCRIPTION || "Compact split-sheet workflow inside your DAW with hosted account, email delivery, and signed session records.";
const pluginVersionLabel = process.env.PLUGIN_VERSION_LABEL || "0.1.0";
const pluginDownloadUrl = process.env.PLUGIN_DOWNLOAD_URL || "";
const pluginDownloadBucket = process.env.PLUGIN_DOWNLOAD_BUCKET || s3Bucket;
const pluginDownloadKey = process.env.PLUGIN_DOWNLOAD_KEY || `downloads/SplitSheetStudio-Setup-${pluginVersionLabel}.exe`;
const pluginDownloadPath = process.env.PLUGIN_DOWNLOAD_PATH ? path.resolve(process.env.PLUGIN_DOWNLOAD_PATH) : "";

fs.mkdirSync(submissionsDir, { recursive: true });
fs.mkdirSync(pdfDir, { recursive: true });

let redisClient = null;
let s3Client = null;
let redisStore = null;
let redisReady = Promise.resolve();

if (sessionStoreMode === "redis") {
  if (!process.env.REDIS_URL) {
    throw new Error("SESSION_STORE=redis requires REDIS_URL");
  }
  redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.on("error", (err) => {
    console.error("Redis session store error:", err.message || err);
  });
  redisStore = new RedisStore({
    client: redisClient,
    prefix: redisPrefix,
    ttl: sessionTtlSeconds
  });
  redisReady = redisClient.connect().then(() => {
    console.log(`Redis session store connected (${redisPrefix})`);
  });
}

if (pdfStorageMode === "s3") {
  if (!s3Bucket) {
    throw new Error("PDF_STORAGE=s3 requires S3_BUCKET");
  }
  s3Client = new S3Client({ region: s3Region });
}

const stripeClient = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const stripeEnabled = Boolean(stripeClient);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
if (trustProxy) {
  app.set("trust proxy", 1);
}
app.use("/api/stripe/webhook", express.raw({ type: "application/json", limit: "2mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/vendor/signature_pad", express.static(path.join(__dirname, "node_modules", "signature_pad", "dist")));
app.use(session({
  store: redisStore || undefined,
  secret: process.env.SESSION_SECRET || "split-open-sign",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieSecure,
    maxAge: cookieMaxAgeMs
  }
}));

function nowIso() { return new Date().toISOString(); }
function uniq(arr) { return [...new Set(arr.filter(Boolean))]; }
function pdfDownloadFilename(id, kind = "final") { return `split-sheet-${id}-${kind}.pdf`; }
function splitPdfS3Key(id) {
  return s3Prefix ? `${s3Prefix}/${pdfDownloadFilename(id)}` : pdfDownloadFilename(id);
}
let sesIdentityCache = null;
const allowPublicRegistration = String(process.env.ALLOW_PUBLIC_REGISTRATION || "false").toLowerCase() === "true";
const databaseService = createDatabaseService({
  provider: dbProvider,
  dbPath: authDbPath,
  databaseUrl: process.env.DATABASE_URL
});
const storefrontService = createStorefrontService({
  db: databaseService.client,
  provider: databaseService.provider
});
const submissionStore = createSubmissionService({
  db: databaseService.client,
  legacySubmissionsDir: submissionsDir,
  provider: databaseService.provider
});
const authService = createAuthService({
  db: databaseService.client,
  tokenSecret: process.env.API_TOKEN_SECRET || process.env.SESSION_SECRET || "split-open-sign-api-secret",
  accessTokenTtlMinutes: Number(process.env.API_ACCESS_TOKEN_TTL_MINUTES || 15),
  refreshTokenTtlDays: Number(process.env.API_REFRESH_TOKEN_TTL_DAYS || 30),
  verificationTokenTtlHours: Number(process.env.EMAIL_VERIFICATION_TOKEN_TTL_HOURS || 48),
  passwordResetTokenTtlHours: Number(process.env.PASSWORD_RESET_TOKEN_TTL_HOURS || 2),
  provider: databaseService.provider,
  requireEmailVerification,
  bootstrapOwner: {
    email: process.env.OWNER_EMAIL || "",
    password: process.env.OWNER_PASSWORD || "",
    displayName: process.env.OWNER_DISPLAY_NAME || "Owner"
  }
});

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

function requestIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "");
}

function clientIpKey(req) {
  return String(req.ip || requestIp(req) || "unknown").trim().toLowerCase();
}

function requestHost(req) {
  const forwardedHost = String(req.headers["x-forwarded-host"] || "").split(",")[0].trim();
  const directHost = String(req.headers.host || "").split(",")[0].trim();
  return (forwardedHost || directHost).replace(/:\d+$/, "").toLowerCase();
}

function isMarketingHost(req) {
  const host = requestHost(req);
  if (!host || host === appHost) {
    return false;
  }
  return marketingHosts.has(host);
}

function rateLimitHandler(req, res) {
  const retryAfterSeconds = req.rateLimit?.resetTime
    ? Math.max(1, Math.ceil((new Date(req.rateLimit.resetTime).getTime() - Date.now()) / 1000))
    : undefined;

  if (retryAfterSeconds) {
    res.setHeader("Retry-After", String(retryAfterSeconds));
  }

  const payload = {
    ok: false,
    error: "Too many requests. Please wait and try again.",
    retryAfterSeconds
  };

  if (req.path.startsWith("/api/")) {
    return res.status(429).json(payload);
  }

  return res.status(429).render("auth-message", {
    title: "Too many requests",
    message: "This action has been rate limited for now.",
    details: retryAfterSeconds
      ? `Try again in about ${retryAfterSeconds} seconds.`
      : "Try again in a few minutes.",
    actionHref: baseUrl,
    actionLabel: "Back to app",
    debugLink: null,
    supportEmail
  });
}

function createRateLimiter({
  prefix,
  windowMs,
  limit,
  message,
  keyGenerator,
  skip,
  standardHeaders = true
}) {
  const store = redisClient
    ? new RateLimitRedisStore({
      sendCommand: async (...args) => {
        await redisReady;
        return redisClient.sendCommand(args);
      },
      prefix: `rl:${prefix}:`
    })
    : undefined;

  return rateLimit({
    windowMs,
    limit,
    standardHeaders,
    legacyHeaders: false,
    skip,
    keyGenerator: keyGenerator || ((req) => clientIpKey(req)),
    store,
    handler: (req, res) => {
      if (message) {
        req.rateLimit = { ...req.rateLimit, message };
      }
      return rateLimitHandler(req, res);
    }
  });
}

function ensureAppHost(req, res, next) {
  if (!isMarketingHost(req)) {
    return next();
  }
  return res.redirect(302, `${baseUrl}${req.originalUrl}`);
}

async function loadSubmission(id) {
  return submissionStore.getSubmission(id);
}

async function saveSubmissionRow(row) {
  return submissionStore.saveSubmission(row);
}

async function saveSubmission(type, payload, req) {
  return submissionStore.createSubmission({
    id: nanoid(10),
    type,
    status: payload.collectSignaturesByInvite ? "pending-signatures" : "completed",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    ip: requestIp(req),
    userAgent: req.headers["user-agent"],
    ownerUserId: req.apiUser?.id || null,
    ownerEmail: req.apiUser?.email || null,
    payload
  });
}

async function listSubmissions() {
  return submissionStore.listSubmissions();
}

async function nextSplitVersion(songTitle) {
  return submissionStore.nextSplitVersion(songTitle);
}

function splitPdfPath(id) {
  return path.join(pdfDir, `split-sheet-${id}-final.pdf`);
}

function checksumFor(row) {
  return crypto.createHash("sha256").update(JSON.stringify({ id: row.id, payload: row.payload, createdAt: row.createdAt })).digest("hex");
}

function splitSignerTimeline(docJson) {
  const contributors = docJson?.payload?.contributors || [];
  return contributors.map((c, index) => ({
    index: index + 1,
    legalName: c.legalName || "",
    role: c.role || "",
    email: c.email || "",
    writerShare: Number(c.writerShare || 0),
    publisherShare: Number(c.publisherShare || 0),
    inviteSentAt: c.inviteSentAt || null,
    viewedAt: c.viewedAt || null,
    reminderSentAt: c.reminderSentAt || null,
    signedAt: c.signedAt || null,
    typedSignatureName: c.typedSignatureName || "",
    status: c.signedAt ? "Signed" : (c.viewedAt ? "Viewed" : (c.inviteSentAt ? "Invited" : "Pending"))
  }));
}

function safeText(value) {
  return String(value || "").trim() || "N/A";
}

function formatPercent(value) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? `${amount}%` : "0%";
}

function formatIsoLabel(value) {
  if (!value) return "Pending";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function signatureImageBuffer(signatureData) {
  const match = String(signatureData || "").match(/^data:image\/\w+;base64,(.+)$/);
  if (!match) return null;
  try {
    return Buffer.from(match[1], "base64");
  } catch {
    return null;
  }
}

function ensurePdfSpace(pdf, neededHeight = 80) {
  const bottom = pdf.page.height - pdf.page.margins.bottom;
  if (pdf.y + neededHeight > bottom) {
    pdf.addPage();
  }
}

function drawPdfHeader(pdf, title, subtitle) {
  const left = pdf.page.margins.left;
  const width = pdf.page.width - pdf.page.margins.left - pdf.page.margins.right;
  const top = pdf.y;
  const textLeft = left + 82;

  pdf.save();
  pdf.roundedRect(left, top, width, 62, 10).fill("#111111");
  if (fs.existsSync(pdfLogoMarkPath)) {
    pdf.image(pdfLogoMarkPath, left + 14, top + 8, { fit: [54, 54], align: "center", valign: "center" });
  } else {
    pdf.roundedRect(left + 14, top + 11, 54, 38, 8).fill("#d4af37");
  }
  pdf.fillColor("#d4af37").fontSize(9).text("BLAK MARIGOLD STUDIO", textLeft, top + 14, {
    width: width - (textLeft - left) - 18,
    characterSpacing: 1.2
  });
  pdf.fillColor("#ffffff").fontSize(15.5).text(title, textLeft, top + 24, {
    width: width - (textLeft - left) - 18
  });
  if (subtitle) {
    pdf.fillColor("#d8d8d8").fontSize(8).text(subtitle, textLeft, top + 40, {
      width: width - (textLeft - left) - 18
    });
  }
  pdf.restore();
  pdf.moveDown(3.8);
}

function drawSectionHeading(pdf, title) {
  ensurePdfSpace(pdf, 22);
  const headingTop = pdf.y + 2;
  const headingLeft = pdf.page.margins.left + 18;
  const headingWidth = pdf.page.width - pdf.page.margins.left - pdf.page.margins.right - 36;
  pdf.fillColor("#b8860b").fontSize(9).text(title.toUpperCase(), headingLeft, headingTop, {
    width: headingWidth,
    align: "left"
  });
  pdf.y = headingTop + 16;
  pdf.fillColor("#111111");
}

function drawKeyValueGrid(pdf, rows = []) {
  const usableWidth = pdf.page.width - pdf.page.margins.left - pdf.page.margins.right;
  const colGap = 16;
  const colWidth = (usableWidth - colGap) / 2;
  const startX = pdf.page.margins.left;
  const rightX = startX + colWidth + colGap;
  const rowHeight = 24;

  for (let index = 0; index < rows.length; index += 2) {
    ensurePdfSpace(pdf, rowHeight + 10);
    const pair = rows.slice(index, index + 2);
    const rowTop = pdf.y;

    pair.forEach((item, offset) => {
      const x = offset === 0 ? startX : rightX;
      pdf.save();
      pdf.roundedRect(x, rowTop, colWidth, rowHeight, 6).fillAndStroke("#f7f2e7", "#d7c49b");
      pdf.fillColor("#6b5b3a").fontSize(6.5).text(item.label, x + 9, rowTop + 4, { width: colWidth - 18 });
      pdf.fillColor("#111111").fontSize(8.5).text(item.value, x + 9, rowTop + 12, { width: colWidth - 18 });
      pdf.restore();
    });

    pdf.y = rowTop + rowHeight + 4;
  }
}

function drawContributorCard(pdf, contributor, index, options = {}) {
  const signed = Boolean(contributor.signedAt);
  const statusLabel = signed ? "Signed" : (options.pendingSummary ? "Awaiting signature" : "Pending");
  const signatureBuffer = signatureImageBuffer(contributor.signatureData);
  const cardHeight = signatureBuffer ? 104 : 92;
  ensurePdfSpace(pdf, cardHeight);

  const left = pdf.page.margins.left;
  const width = pdf.page.width - pdf.page.margins.left - pdf.page.margins.right;
  const top = pdf.y;

  pdf.save();
  pdf.lineWidth(1);
  pdf.roundedRect(left, top, width, cardHeight, 10).fillAndStroke("#ffffff", "#c8b68b");
  pdf.roundedRect(left + 12, top + 9, 80, 18, 9).fill("#f3ead4");
  pdf.fillColor("#6b5b3a").fontSize(6.4).text(`PARTY ${index + 1}`, left + 12, top + 15, { width: 80, align: "center" });
  pdf.fillColor("#111111").fontSize(9.4).text(`${safeText(contributor.legalName)}`, left + 102, top + 11, { width: width - 210 });
  pdf.fillColor(signed ? "#1f5f35" : "#8a6d1d").fontSize(7.8).text(statusLabel, left + width - 120, top + 14, { width: 100, align: "right" });

  const detailsTop = top + 23;
  const columnGap = 16;
  const columnWidth = (width - 32 - columnGap) / 2;
  const leftCol = left + 16;
  const rightCol = leftCol + columnWidth + columnGap;

  const leftDetails = [
    `Role: ${safeText(contributor.role)}`,
    `Email / Phone: ${safeText(contributor.email)} / ${safeText(contributor.phone)}`,
    `Address: ${safeText(contributor.address)}`
  ];
  const rightDetails = [
    `Shares: W ${formatPercent(contributor.writerShare)} / P ${formatPercent(contributor.publisherShare)}`,
    `PRO / IPI: ${safeText(contributor.pro)} / ${safeText(contributor.ipi)}`,
    `Pub / IPI: ${safeText(contributor.publisherName)} / ${safeText(contributor.publisherIpi)}`
  ];

  pdf.fontSize(7.2).fillColor("#222222");
  leftDetails.forEach((line, lineIndex) => pdf.text(line, leftCol, detailsTop + (lineIndex * 7.5), { width: columnWidth }));
  rightDetails.forEach((line, lineIndex) => pdf.text(line, rightCol, detailsTop + (lineIndex * 7.5), { width: columnWidth }));

  pdf.moveTo(left + 14, top + 48).lineTo(left + width - 14, top + 48).strokeColor("#e2d8bd").stroke();
  pdf.fillColor("#6b5b3a").fontSize(6.4).text("EXECUTED BY", left + 14, top + 53, { width: 150 });
  pdf.moveTo(left + 14, top + 74).lineTo(left + 205, top + 74).strokeColor("#6f6f6f").lineWidth(0.8).stroke();
  pdf.fillColor("#111111").fontSize(7.8).text(safeText(contributor.typedSignatureName || contributor.legalName), left + 14, top + 61, { width: 190, align: "center" });
  pdf.fontSize(6.2).fillColor("#666666").text("Typed name / electronic signature", left + 14, top + 76, { width: 190, align: "center" });
  pdf.fontSize(6.6).fillColor("#444444").text(`Date signed: ${formatIsoLabel(contributor.signedAt)}`, left + 14, top + 85, { width: 210 });

  if (signatureBuffer) {
    try {
      pdf.roundedRect(left + width - 138, top + 55, 108, 26, 6).fill("#fbf7ee").strokeColor("#d9ccb1").stroke();
      pdf.image(signatureBuffer, left + width - 134, top + 58, {
        fit: [100, 16],
        align: "right",
        valign: "center"
      });
    } catch {
      pdf.fontSize(6).fillColor("#666666").text("Signature image on file could not be rendered.", left + width - 138, top + 65, {
        width: 108,
        align: "right"
      });
    }
  } else {
    pdf.fontSize(6).fillColor("#666666").text("No drawn signature on file yet.", left + width - 138, top + 65, {
      width: 108,
      align: "right"
    });
  }

  pdf.restore();
  pdf.y = top + cardHeight + 5;
}

function drawContributorGrid(pdf, contributors, options = {}) {
  if (contributors.length !== 2) {
    contributors.forEach((contributor, index) => drawContributorCard(pdf, contributor, index, options));
    return;
  }

  const left = pdf.page.margins.left;
  const gap = 12;
  const totalWidth = pdf.page.width - pdf.page.margins.left - pdf.page.margins.right;
  const cardWidth = (totalWidth - gap) / 2;
  const top = pdf.y;
  const cardHeight = 138;
  ensurePdfSpace(pdf, cardHeight + 4);

  contributors.forEach((contributor, index) => {
    const signed = Boolean(contributor.signedAt);
    const statusLabel = signed ? "Signed" : (options.pendingSummary ? "Awaiting signature" : "Pending");
    const signatureBuffer = signatureImageBuffer(contributor.signatureData);
    const x = left + (index * (cardWidth + gap));

    pdf.save();
    pdf.lineWidth(1);
    pdf.roundedRect(x, top, cardWidth, cardHeight, 10).fillAndStroke("#ffffff", "#c8b68b");
    pdf.roundedRect(x + 10, top + 9, 72, 16, 8).fill("#f3ead4");
    pdf.fillColor("#6b5b3a").fontSize(6.2).text(`PARTY ${index + 1}`, x + 10, top + 14, { width: 72, align: "center" });
    pdf.fillColor("#111111").fontSize(9.2).text(safeText(contributor.legalName), x + 12, top + 31, { width: cardWidth - 24 });
    pdf.fillColor(signed ? "#1f5f35" : "#8a6d1d").fontSize(7.2).text(statusLabel, x + cardWidth - 78, top + 14, { width: 66, align: "right" });

    const lines = [
      `Role: ${safeText(contributor.role)}`,
      `Email: ${safeText(contributor.email)}`,
      `Phone: ${safeText(contributor.phone)}`,
      `PRO / IPI: ${safeText(contributor.pro)} / ${safeText(contributor.ipi)}`,
      `Pub / IPI: ${safeText(contributor.publisherName)} / ${safeText(contributor.publisherIpi)}`,
      `Shares: W ${formatPercent(contributor.writerShare)} / P ${formatPercent(contributor.publisherShare)}`
    ];
    pdf.fillColor("#222222").fontSize(7).text(lines.join("\n"), x + 12, top + 45, {
      width: cardWidth - 24,
      lineGap: 1.5
    });

    pdf.moveTo(x + 12, top + 94).lineTo(x + cardWidth - 12, top + 94).strokeColor("#e2d8bd").stroke();
    pdf.fillColor("#6b5b3a").fontSize(6.2).text("EXECUTED BY", x + 12, top + 99, { width: 110 });
    pdf.moveTo(x + 12, top + 121).lineTo(x + cardWidth - 12, top + 121).strokeColor("#6f6f6f").lineWidth(0.8).stroke();
    pdf.fillColor("#111111").fontSize(7.4).text(safeText(contributor.typedSignatureName || contributor.legalName), x + 12, top + 108, {
      width: cardWidth - 24,
      align: "center"
    });
    pdf.fontSize(6).fillColor("#666666").text("Typed name / electronic signature", x + 12, top + 123, {
      width: cardWidth - 24,
      align: "center"
    });
    pdf.fontSize(6.2).fillColor("#444444").text(`Date signed: ${formatIsoLabel(contributor.signedAt)}`, x + 12, top + 130, {
      width: cardWidth - 24
    });

    if (signatureBuffer) {
      try {
        pdf.roundedRect(x + cardWidth - 94, top + 98, 82, 18, 5).fill("#fbf7ee").strokeColor("#d9ccb1").stroke();
        pdf.image(signatureBuffer, x + cardWidth - 90, top + 100, {
          fit: [74, 12],
          align: "right",
          valign: "center"
        });
      } catch {}
    }

    pdf.restore();
  });

  pdf.y = top + cardHeight + 5;
}

function drawDetailRow(pdf, label, value, x, y, width) {
  pdf.fillColor("#7a6740").fontSize(7).text(label, x, y, { width });
  pdf.fillColor("#111111").fontSize(9).text(safeText(value), x, y + 10, { width });
}

function drawContributorDetailSection(pdf, contributor, index) {
  ensurePdfSpace(pdf, 470);
  const left = pdf.page.margins.left;
  const width = pdf.page.width - pdf.page.margins.left - pdf.page.margins.right;
  const top = pdf.y;
  const signatureBuffer = signatureImageBuffer(contributor.signatureData);

  pdf.save();
  pdf.roundedRect(left, top, width, 470, 10).fillAndStroke("#ffffff", "#c8b68b");
  pdf.roundedRect(left + 16, top + 16, 110, 22, 10).fill("#f3ead4");
  pdf.fillColor("#6b5b3a").fontSize(8).text(`CONTRIBUTOR ${index + 1}`, left + 16, top + 23, { width: 110, align: "center" });
  pdf.fillColor("#111111").fontSize(14).text(safeText(contributor.legalName), left + 140, top + 19, { width: width - 156 });

  const colGap = 18;
  const colWidth = (width - 48 - colGap) / 2;
  const col1 = left + 16;
  const col2 = col1 + colWidth + colGap;
  let y = top + 52;

  drawDetailRow(pdf, "Role", contributor.role, col1, y, colWidth);
  drawDetailRow(pdf, "Email", contributor.email, col2, y, colWidth);
  y += 28;
  drawDetailRow(pdf, "Phone", contributor.phone, col1, y, colWidth);
  drawDetailRow(pdf, "Address", contributor.address, col2, y, colWidth);
  y += 34;
  drawDetailRow(pdf, "PRO", contributor.pro, col1, y, colWidth);
  drawDetailRow(pdf, "IPI / CAE", contributor.ipi, col2, y, colWidth);
  y += 28;
  drawDetailRow(pdf, "Publisher Name", contributor.publisherName, col1, y, colWidth);
  drawDetailRow(pdf, "Publisher IPI / CAE", contributor.publisherIpi, col2, y, colWidth);
  y += 34;
  drawDetailRow(pdf, "Writer Share", formatPercent(contributor.writerShare), col1, y, colWidth);
  drawDetailRow(pdf, "Publisher Share", formatPercent(contributor.publisherShare), col2, y, colWidth);

  const signatureTop = y + 42;
  pdf.moveTo(left + 16, signatureTop).lineTo(left + width - 16, signatureTop).strokeColor("#e2d8bd").lineWidth(1).stroke();
  pdf.fillColor("#b8860b").fontSize(10).text("SIGNATURE AND EXECUTION", left + 16, signatureTop + 12, { width: 220 });

  pdf.roundedRect(left + 16, signatureTop + 46, width - 32, 100, 8).fillAndStroke("#fbf7ee", "#d9ccb1");
  pdf.fillColor("#7a6740").fontSize(8).text("Drawn signature on file", left + 30, signatureTop + 58, { width: 180 });

  if (signatureBuffer) {
    try {
      pdf.image(signatureBuffer, left + 30, signatureTop + 76, {
        fit: [width - 92, 42],
        align: "center",
        valign: "center"
      });
    } catch {
      pdf.fontSize(8).fillColor("#666666").text("Signature image could not be rendered from saved data.", left + 30, signatureTop + 88, {
        width: width - 92,
        align: "center"
      });
    }
  } else {
    pdf.fontSize(8).fillColor("#666666").text("No drawn signature was saved for this contributor.", left + 30, signatureTop + 88, {
      width: width - 92,
      align: "center"
    });
  }

  pdf.moveTo(left + 16, signatureTop + 184).lineTo(left + 290, signatureTop + 184).strokeColor("#6f6f6f").lineWidth(0.8).stroke();
  pdf.fillColor("#111111").fontSize(10).text(safeText(contributor.typedSignatureName || contributor.legalName), left + 16, signatureTop + 163, {
    width: 274,
    align: "center"
  });
  pdf.fontSize(7).fillColor("#666666").text("Typed name / electronic signature", left + 16, signatureTop + 187, {
    width: 274,
    align: "center"
  });
  drawDetailRow(pdf, "Signed At", formatIsoLabel(contributor.signedAt), left + 330, signatureTop + 155, 180);
  drawDetailRow(pdf, "Email Confirmation", contributor.email, left + 330, signatureTop + 195, 180);

  pdf.restore();
  pdf.y = top + 486;
}

function renderSplitSheetPdf(pdf, docJson, options = {}) {
  const payload = docJson.payload || {};
  const contributors = payload.contributors || [];
  const totals = splitTotals(contributors);
  const auditChecksum = checksumFor(docJson);
  const packetLabel = options.pendingSummary ? "Signature Packet Summary" : "Final Executed Split Sheet";

  drawPdfHeader(
    pdf,
    "Songwriter Split Sheet",
    `${packetLabel} for ${safeText(payload.songTitle)}`
  );

  const summaryLeft = pdf.page.margins.left;
  const summaryTop = pdf.y + 6;
  const summaryWidth = pdf.page.width - pdf.page.margins.left - pdf.page.margins.right;
  const summaryBottom = pdf.page.height - pdf.page.margins.bottom - 24;
  pdf.save();
  pdf.roundedRect(summaryLeft, summaryTop, summaryWidth, summaryBottom - summaryTop, 12).strokeColor("#d9ccb1").lineWidth(1).stroke();
  pdf.restore();
  pdf.y = summaryTop + 14;

  drawSectionHeading(pdf, "Song Information");
  const songInfoRows = [
    { label: "Song title", value: safeText(payload.songTitle) },
    { label: "Alternate title", value: safeText(payload.alternateTitle) },
    { label: "Session date", value: safeText(payload.date) },
    { label: "Session location", value: safeText(payload.sessionLocation) },
    { label: "ISWC", value: safeText(payload.iswc) },
    { label: "ISRC", value: safeText(payload.isrc) },
    { label: "Submission ID", value: safeText(docJson.id) },
    { label: "Version / status", value: `${safeText(payload.version || 1)} / ${safeText(docJson.status)}` }
  ];
  drawKeyValueGrid(pdf, songInfoRows);

  if (String(payload.notes || "").trim()) {
    drawSectionHeading(pdf, "Session Notes");
    ensurePdfSpace(pdf, 50);
    pdf.roundedRect(pdf.page.margins.left, pdf.y, pdf.page.width - pdf.page.margins.left - pdf.page.margins.right, 42, 8)
      .fillAndStroke("#fffdf8", "#d7c49b");
    pdf.fillColor("#111111").fontSize(9).text(safeText(payload.notes), pdf.page.margins.left + 12, pdf.y + 10, {
      width: pdf.page.width - pdf.page.margins.left - pdf.page.margins.right - 24
    });
    pdf.y += 52;
  }

  drawSectionHeading(pdf, "Ownership Summary");
  drawKeyValueGrid(pdf, [
    { label: "Total writer share", value: formatPercent(totals.writer) },
    { label: "Total publisher share", value: formatPercent(totals.publisher) },
    { label: "Contributors", value: String(contributors.length) },
    { label: "Signature state", value: options.pendingSummary ? "Still collecting signatures" : "All signatures completed" }
  ]);

  contributors.forEach((contributor, index) => {
    pdf.addPage();
    drawPdfHeader(
      pdf,
      "Contributor Signature Packet",
      `${safeText(payload.songTitle)} | contributor ${index + 1} of ${contributors.length}`
    );
    drawSectionHeading(pdf, "Contributor Details");
    drawContributorDetailSection(pdf, contributor, index);
  });

  pdf.addPage();
  drawPdfHeader(
    pdf,
    "Agreement Language",
    `${safeText(payload.songTitle)} | legal summary`
  );
  drawSectionHeading(pdf, "Agreement Language");
  ensurePdfSpace(pdf, 240);
  const legalLeft = pdf.page.margins.left;
  const legalWidth = pdf.page.width - pdf.page.margins.left - pdf.page.margins.right;
  const legalTop = pdf.y;
  pdf.roundedRect(legalLeft, legalTop, legalWidth, 190, 10).fillAndStroke("#fffdf8", "#d7c49b");
  pdf.fillColor("#111111").fontSize(10).text(
    "This split sheet is intended to memorialize the parties' current agreement regarding ownership of the musical composition identified in this packet.",
    legalLeft + 18,
    legalTop + 18,
    { width: legalWidth - 36, lineGap: 3 }
  );
  [
    "Each contributor confirms that the writer share and publisher share percentages shown in this packet are accurate to the best of that contributor's knowledge as of the execution date.",
    "Each contributor agrees that the typed name and captured signature image associated with that contributor are intended to serve as that contributor's electronic signature and authentication of this record.",
    "The parties acknowledge that this document may be relied upon as a written record of authorship, ownership, and publishing information for administrative, royalty, and clearance purposes.",
    "Any later change to ownership, publishing, administration, or contributor information should be documented in a revised split sheet signed by all affected parties."
  ].forEach((line, index) => {
    pdf.fillColor("#222222").fontSize(9.5).text(
      `${index + 1}. ${line}`,
      legalLeft + 18,
      legalTop + 52 + (index * 28),
      { width: legalWidth - 36, lineGap: 3 }
    );
  });
  pdf.y = legalTop + 206;

  pdf.fontSize(7).fillColor("#666666").text(
    "Blak Marigold Studio | blakmarigold.com | splitsheet delivery record",
    pdf.page.margins.left,
    pdf.page.height - pdf.page.margins.bottom - 8,
    { width: pdf.page.width - pdf.page.margins.left - pdf.page.margins.right, align: "center" }
  );

  return { auditChecksum };
}

function generateFinalSplitPdf(docJson) {
  const outPath = splitPdfPath(docJson.id);
  const pdf = new PDFDocument({ margin: 24 });
  const stream = fs.createWriteStream(outPath);
  pdf.pipe(stream);
  const { auditChecksum } = renderSplitSheetPdf(pdf, docJson, { pendingSummary: false });
  pdf.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", async () => {
      try {
        let storage = null;
        if (pdfStorageMode === "s3") {
          const key = splitPdfS3Key(docJson.id);
          await s3Client.send(new PutObjectCommand({
            Bucket: s3Bucket,
            Key: key,
            Body: fs.createReadStream(outPath),
            ContentType: "application/pdf",
            ContentDisposition: `attachment; filename="${pdfDownloadFilename(docJson.id)}"`
          }));
          storage = {
            provider: "s3",
            bucket: s3Bucket,
            key,
            region: s3Region,
            uploadedAt: nowIso()
          };
          docJson.payload = docJson.payload || {};
          docJson.payload.finalPdfStorage = storage;
        }
        resolve({ outPath, auditChecksum, storage });
      } catch (error) {
        reject(error);
      }
    });
    stream.on("error", reject);
  });
}

async function streamStoredFinalPdf(docJson, res) {
  const remotePdf = docJson?.payload?.finalPdfStorage;
  if (!remotePdf || remotePdf.provider !== "s3" || !remotePdf.bucket || !remotePdf.key || !s3Client) {
    return false;
  }

  const s3Object = await s3Client.send(new GetObjectCommand({
    Bucket: remotePdf.bucket,
    Key: remotePdf.key
  }));
  res.setHeader("Content-Type", s3Object.ContentType || "application/pdf");
  res.setHeader("Content-Disposition", s3Object.ContentDisposition || `attachment; filename="${pdfDownloadFilename(docJson.id)}"`);
  if (s3Object.ContentLength) {
    res.setHeader("Content-Length", String(s3Object.ContentLength));
  }
  s3Object.Body.pipe(res);
  return true;
}

async function initializeRuntime() {
  await redisReady;
  if (pdfStorageMode === "s3") {
    console.log(`S3 PDF storage enabled (${s3Bucket}/${s3Prefix || "."})`);
  }
}

async function sendEmail({ subject, html, to, attachments = [] }) {
  const recipientList = Array.isArray(to) ? to.filter(Boolean) : [];
  if (!recipientList.length) {
    return { ok: false, skipped: true, reason: "no_recipients" };
  }

  const hasSmtp = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
  const hasSes = Boolean((process.env.SES_REGION || process.env.AWS_REGION || process.env.AWS_PROFILE || process.env.FROM_EMAIL) && process.env.FROM_EMAIL);

  if (!hasSmtp && !hasSes) {
    return { ok: false, skipped: true, reason: "smtp_not_configured" };
  }

  if (hasSmtp) {
    const t = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || "true") === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: {
        rejectUnauthorized: String(process.env.SMTP_TLS_REJECT_UNAUTHORIZED || "true") === "true"
      }
    });
    try {
      await t.sendMail({ from: process.env.FROM_EMAIL || process.env.SMTP_USER, to: recipientList.join(","), subject, html, attachments });
      return { ok: true, skipped: false, reason: "sent" };
    } catch (e) {
      console.error("Email send failed:", e.message || e);
      return { ok: false, skipped: false, reason: `smtp_error:${e.message || "unknown"}` };
    }
  }

  const sesRegion = process.env.SES_REGION || process.env.AWS_REGION || "us-east-1";
  const sesClient = new SESv2Client({ region: sesRegion });
  let normalizedRecipients = recipientList;
  try {
    if (!sesIdentityCache) {
      const identityResp = await sesClient.send(new ListEmailIdentitiesCommand({}));
      sesIdentityCache = (identityResp.EmailIdentities || [])
        .filter((row) => row.IdentityType === "EMAIL_ADDRESS" && row.VerificationStatus === "SUCCESS")
        .reduce((map, row) => {
          map[String(row.IdentityName || "").toLowerCase()] = row.IdentityName;
          return map;
        }, {});
    }
    normalizedRecipients = recipientList.map((address) => sesIdentityCache[String(address).toLowerCase()] || address);
  } catch (e) {
    console.error("SES identity lookup failed:", e.message || e);
  }
  const sesTransport = nodemailer.createTransport({
    SES: { sesClient, SendEmailCommand }
  });
  try {
    await sesTransport.sendMail({
      from: process.env.FROM_EMAIL,
      to: uniq(normalizedRecipients).join(","),
      replyTo: process.env.REPLY_TO_EMAIL || process.env.NOTIFY_EMAIL || process.env.FROM_EMAIL,
      subject,
      html,
      attachments
    });
    return { ok: true, skipped: false, reason: "sent" };
  } catch (e) {
    console.error("SES send failed:", e.message || e);
    return { ok: false, skipped: false, reason: `ses_error:${e.message || "unknown"}` };
  }
}

function verificationEmailHtml({ displayName, verifyUrl, expiresAt }) {
  return `<div style="font-family:Arial,sans-serif;line-height:1.55;color:#111">
    <h2 style="margin:0 0 10px">Verify your SplitSheet Studio account</h2>
    <p style="margin:0 0 12px">Hi ${displayName || "there"},</p>
    <p style="margin:0 0 12px">Confirm this email address so you can recover your password and keep your account secure.</p>
    <p style="margin:0 0 14px"><a href="${verifyUrl}">Verify your email</a></p>
    <p style="margin:0 0 12px">This link expires on ${new Date(expiresAt).toUTCString()}.</p>
    <hr style="border:none;border-top:1px solid #ddd;margin:14px 0" />
    <p style="margin:0">SplitSheet Studio<br/>Account verification</p>
  </div>`;
}

function passwordResetEmailHtml({ displayName, resetUrl, expiresAt }) {
  return `<div style="font-family:Arial,sans-serif;line-height:1.55;color:#111">
    <h2 style="margin:0 0 10px">Reset your SplitSheet Studio password</h2>
    <p style="margin:0 0 12px">Hi ${displayName || "there"},</p>
    <p style="margin:0 0 12px">Use the link below to set a new password for your account.</p>
    <p style="margin:0 0 14px"><a href="${resetUrl}">Reset password</a></p>
    <p style="margin:0 0 12px">This link expires on ${new Date(expiresAt).toUTCString()}.</p>
    <p style="margin:0 0 12px">If you did not request this change, you can ignore this email.</p>
    <hr style="border:none;border-top:1px solid #ddd;margin:14px 0" />
    <p style="margin:0">SplitSheet Studio<br/>Account recovery</p>
  </div>`;
}

async function sendVerificationEmail({ user, token, expiresAt }) {
  if (!user?.email || !token || !expiresAt) {
    return { ok: false, skipped: true, reason: "missing_verification_payload" };
  }
  const verifyUrl = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
  const emailResult = await sendEmail({
    to: [user.email],
    subject: "Verify your SplitSheet Studio account",
    html: verificationEmailHtml({
      displayName: user.displayName,
      verifyUrl,
      expiresAt
    })
  });
  return {
    ...emailResult,
    verifyUrl: authDebugTokens ? verifyUrl : undefined
  };
}

async function sendPasswordResetEmail({ user, token, expiresAt }) {
  if (!user?.email || !token || !expiresAt) {
    return { ok: false, skipped: true, reason: "missing_reset_payload" };
  }
  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
  const emailResult = await sendEmail({
    to: [user.email],
    subject: "Reset your SplitSheet Studio password",
    html: passwordResetEmailHtml({
      displayName: user.displayName,
      resetUrl,
      expiresAt
    })
  });
  return {
    ...emailResult,
    resetUrl: authDebugTokens ? resetUrl : undefined
  };
}

function formatMoney(amountCents, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: String(currency || "usd").toUpperCase()
  }).format(Number(amountCents || 0) / 100);
}

function storefrontPriceLabel() {
  return formatMoney(stripePluginPriceUsdCents, "usd");
}

function latestBlogPosts(limit = 3) {
  return listPosts().slice(0, limit);
}

function publicNavModel() {
  return {
    appUrl: baseUrl,
    signupUrl: `${baseUrl}/signup`,
    pricingUrl: "/pricing",
    blogUrl: "/blog",
    supportEmail,
    rootDomain
  };
}

function pluginDownloadHref(purchase) {
  return `${baseUrl}/downloads/plugin/${encodeURIComponent(purchase.id)}?token=${encodeURIComponent(purchase.downloadToken)}`;
}

function pluginPurchaseEmailHtml({ purchase, downloadHref }) {
  return `<div style="font-family:Arial,sans-serif;line-height:1.55;color:#111">
    <h2 style="margin:0 0 10px">Your SplitSheet Studio plugin is ready</h2>
    <p style="margin:0 0 10px">Thanks for purchasing <b>${stripePluginProductName}</b>.</p>
    <p style="margin:0 0 10px">Order amount: <b>${formatMoney(purchase.amountTotal, purchase.currency)}</b></p>
    <p style="margin:0 0 10px">Version: <b>${pluginVersionLabel}</b></p>
    <p style="margin:0 0 14px"><a href="${downloadHref}">Download the installer</a></p>
    <p style="margin:0 0 10px">This link is tied to your purchase record and can be used to install the current build.</p>
    <hr style="border:none;border-top:1px solid #ddd;margin:14px 0" />
    <p style="margin:0">SplitSheet Studio storefront<br/>${rootDomain}</p>
  </div>`;
}

async function sendPluginPurchaseEmail(purchase) {
  if (!purchase?.customerEmail) {
    return { ok: false, skipped: true, reason: "missing_customer_email" };
  }
  const downloadHref = pluginDownloadHref(purchase);
  const result = await sendEmail({
    to: [purchase.customerEmail],
    subject: `${stripePluginProductName} download`,
    html: pluginPurchaseEmailHtml({ purchase, downloadHref })
  });
  if (result.ok) {
    await storefrontService.markDeliveryEmailSent(purchase.id);
  }
  return result;
}

async function fulfillPluginCheckoutSession(session) {
  const purchase = await storefrontService.recordCheckoutSession(session, {
    productSku: stripePluginProductSku
  });
  if (!purchase.deliveryEmailSentAt && String(purchase.paymentStatus).toLowerCase() === "paid") {
    await sendPluginPurchaseEmail(purchase);
    return storefrontService.getPurchaseById(purchase.id);
  }
  return purchase;
}

async function sendPluginInstaller(res) {
  if (pluginDownloadUrl) {
    return res.redirect(302, pluginDownloadUrl);
  }

  if (pluginDownloadPath && fs.existsSync(pluginDownloadPath)) {
    return res.download(pluginDownloadPath, path.basename(pluginDownloadPath));
  }

  if (s3Client && pluginDownloadBucket && pluginDownloadKey) {
    const object = await s3Client.send(new GetObjectCommand({
      Bucket: pluginDownloadBucket,
      Key: pluginDownloadKey
    }));
    res.setHeader("Content-Type", object.ContentType || "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${path.basename(pluginDownloadKey)}"`);
    if (object.ContentLength) {
      res.setHeader("Content-Length", String(object.ContentLength));
    }
    object.Body.pipe(res);
    return;
  }

  return res.status(503).render("auth-message", {
    title: "Installer unavailable",
    message: "The plugin installer is not configured on this environment yet.",
    details: "Set PLUGIN_DOWNLOAD_URL, PLUGIN_DOWNLOAD_PATH, or S3 download settings before opening storefront downloads.",
    actionHref: "/pricing",
    actionLabel: "Back to pricing",
    debugLink: null
  });
}

function parseWebhookBody(req) {
  if (Buffer.isBuffer(req.body)) {
    return req.body;
  }
  return Buffer.from(JSON.stringify(req.body || {}));
}

function splitSummaryHtml(contributors = []) {
  if (!Array.isArray(contributors) || !contributors.length) return "";
  const rows = contributors.map((c) => {
    return `<tr>
      <td style="padding:6px 8px;border:1px solid #ddd;">${c.legalName || ""}</td>
      <td style="padding:6px 8px;border:1px solid #ddd;">${c.role || ""}</td>
      <td style="padding:6px 8px;border:1px solid #ddd;text-align:right;">${Number(c.writerShare || 0)}%</td>
      <td style="padding:6px 8px;border:1px solid #ddd;text-align:right;">${Number(c.publisherShare || 0)}%</td>
    </tr>`;
  }).join("");

  return `<h3 style="margin:12px 0 6px;">Split summary</h3>
    <table style="border-collapse:collapse;width:100%;max-width:720px;font-size:14px;">
      <thead>
        <tr>
          <th style="padding:6px 8px;border:1px solid #ddd;text-align:left;">Contributor</th>
          <th style="padding:6px 8px;border:1px solid #ddd;text-align:left;">Role</th>
          <th style="padding:6px 8px;border:1px solid #ddd;text-align:right;">Writer %</th>
          <th style="padding:6px 8px;border:1px solid #ddd;text-align:right;">Publisher %</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function completionEmailHtml({ title, id, songLabel, downloadUrl, recipients, splitHtml = "" }) {
  return `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#111">
    <h2 style="margin:0 0 8px">${title}</h2>
    <p style="margin:0 0 10px">Submission ID: <b>${id}</b></p>
    ${songLabel ? `<p style="margin:0 0 10px">${songLabel}</p>` : ""}
    ${splitHtml || ""}
    <p style="margin:12px 0 12px">Your agreement is complete and attached to this email for your records.</p>
    <p style="margin:0 0 12px"><a href="${downloadUrl}">Download agreement packet</a></p>
    <p style="margin:0 0 12px"><b>Recipients:</b> ${recipients.join(", ")}</p>
    <hr style="border:none;border-top:1px solid #ddd;margin:14px 0" />
    <p style="margin:0">Blak Marigold Studio<br/>blakmarigold.com<br/>512-593-1267</p>
  </div>`;
}

async function sendSplitInvite(doc, contributor) {
  const notifyInbox = process.env.NOTIFY_EMAIL || "blakmarigold@gmail.com";
  const link = `${baseUrl}/split-sheet/sign/${doc.id}/${contributor.signerToken}`;
  const splitHtml = splitSummaryHtml(doc.payload?.contributors || []);
  await sendEmail({
    subject: `Action required: Sign split sheet for ${doc.payload.songTitle}`,
    to: [contributor.email, notifyInbox],
    html: `<h2>Signature Request</h2><p>Song: <b>${doc.payload.songTitle}</b></p><p>Contributor: ${contributor.legalName}</p>${splitHtml}<p style="margin-top:12px;"><a href="${link}">Open your secure signing link</a></p><p>Submission ID: ${doc.id}</p>`
  });
}

function requireAdmin(req, res, next) { if (req.session && req.session.isAdmin) return next(); res.redirect("/admin/login"); }
function apiError(res, status, message, details = undefined) {
  const body = { ok: false, error: message };
  if (details) body.details = details;
  return res.status(status).json(body);
}

function bearerTokenFrom(req) {
  const authHeader = String(req.headers.authorization || "").trim();
  if (!authHeader.toLowerCase().startsWith("bearer ")) return "";
  return authHeader.slice(7).trim();
}

async function requireApiAuth(req, res, next) {
  try {
    const session = await authService.getSessionByAccessToken(bearerTokenFrom(req));
    req.apiUser = session.user;
    req.apiSession = session;
    return next();
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return apiError(res, error.statusCode, error.message);
    }
    console.error(error);
    return apiError(res, 500, "Unexpected server error while authenticating request.");
  }
}

function canAccessSplitSheet(doc, user) {
  if (!doc) return false;
  if (doc.ownerUserId && user?.id) return doc.ownerUserId === user.id;
  if (doc.ownerEmail && user?.email) return String(doc.ownerEmail).toLowerCase() === String(user.email).toLowerCase();
  if (doc.ownerUsername && user?.email) return String(doc.ownerUsername).toLowerCase() === String(user.email).toLowerCase();
  return false;
}

async function createSplitSheetSubmission(input, req) {
  let draft = null;
  if (input.draftId) {
    draft = await loadSubmission(String(input.draftId).trim());
    if (!draft || draft.type !== "split-sheet") {
      throw new SplitSheetValidationError("Draft split sheet not found.", { field: "draftId" });
    }
    if (!canAccessSplitSheet(draft, req.apiUser)) {
      throw new ApiAuthError("You do not have access to this draft.", 403);
    }
  }

  const { payload, collectByInvite, recipientEmails } = await buildSplitSheetPayload(input, {
    nextVersion: nextSplitVersion,
    createSignerToken: () => nanoid(22),
    nowIso
  });
  const saved = draft
    ? await saveSubmissionRow({
      ...draft,
      status: collectByInvite ? "pending-signatures" : "completed",
      updatedAt: nowIso(),
      ip: requestIp(req),
      userAgent: req.headers["user-agent"],
      payload
    })
    : await saveSubmission("split-sheet", payload, req);
  const recipients = uniq([
    process.env.NOTIFY_EMAIL || "blakmarigold@gmail.com",
    ...payload.contributors.map((contributor) => contributor.email),
    ...recipientEmails
  ]);

  let emailResult = { ok: false, skipped: true, reason: "not_attempted" };

  if (collectByInvite) {
    for (const contributor of payload.contributors) {
      await sendSplitInvite(saved, contributor);
    }
    emailResult = await sendEmail({
      subject: `Split Sheet Created - ${payload.songTitle} (v${payload.version})`,
      to: recipients,
      html: `<h2>Split Sheet Created</h2><p>ID: ${saved.id}</p><p>Song: ${payload.songTitle}</p><p>Version: ${payload.version}</p><p>Status: Pending signatures</p><p><a href="${baseUrl}/split-sheet/pdf/${saved.id}">Download Current PDF Summary</a></p><p><b>Recipients:</b> ${recipients.join(", ")}</p>`
    });
  } else {
    const { auditChecksum } = await generateFinalSplitPdf(saved);
    saved.payload.auditChecksum = auditChecksum;
    saved.updatedAt = nowIso();
    await saveSubmissionRow(saved);

    const finalPdf = splitPdfPath(saved.id);
    emailResult = await sendEmail({
      subject: `Split Sheet Complete - ${payload.songTitle} (v${payload.version})`,
      to: recipients,
      html: completionEmailHtml({
        title: "Split Sheet Completed",
        id: saved.id,
        songLabel: `Song: ${payload.songTitle} (v${payload.version})`,
        downloadUrl: `${baseUrl}/split-sheet/pdf/${saved.id}`,
        recipients,
        splitHtml: splitSummaryHtml(payload.contributors || [])
      }),
      attachments: fs.existsSync(finalPdf) ? [{ filename: path.basename(finalPdf), path: finalPdf }] : []
    });
  }

  return { saved, payload, collectByInvite, emailResult };
}

async function createDraftSplitSheet(input, req) {
  const payload = await buildSplitSheetDraftPayload(input, {
    nextVersion: nextSplitVersion
  });
  return submissionStore.createSubmission({
    id: nanoid(10),
    type: "split-sheet",
    status: "draft",
    createdAt: nowIso(),
    updatedAt: nowIso(),
    ip: requestIp(req),
    userAgent: req.headers["user-agent"],
    ownerUserId: req.apiUser.id,
    ownerEmail: req.apiUser.email,
    payload
  });
}

async function updateDraftSplitSheet(doc, input, req) {
  const payload = await buildSplitSheetDraftPayload(input, {
    nextVersion: nextSplitVersion,
    existingPayload: doc.payload || {}
  });
  return saveSubmissionRow({
    ...doc,
    status: "draft",
    updatedAt: nowIso(),
    ip: requestIp(req),
    userAgent: req.headers["user-agent"],
    payload
  });
}

const publicPageLimiter = createRateLimiter({
  prefix: "public-page",
  windowMs: 15 * 60 * 1000,
  limit: 300
});

const loginLimiter = createRateLimiter({
  prefix: "auth-login",
  windowMs: 15 * 60 * 1000,
  limit: 10
});

const registerLimiter = createRateLimiter({
  prefix: "auth-register",
  windowMs: 60 * 60 * 1000,
  limit: 5
});

const forgotPasswordLimiter = createRateLimiter({
  prefix: "auth-forgot-password",
  windowMs: 60 * 60 * 1000,
  limit: 5
});

const resendVerificationLimiter = createRateLimiter({
  prefix: "auth-resend-verification",
  windowMs: 60 * 60 * 1000,
  limit: 6
});

const authenticatedApiLimiter = createRateLimiter({
  prefix: "api-authenticated",
  windowMs: 15 * 60 * 1000,
  limit: 600,
  keyGenerator: (req) => `user:${req.apiUser?.id || req.apiUser?.email || clientIpKey(req)}`
});

const splitValidateLimiter = createRateLimiter({
  prefix: "split-validate",
  windowMs: 15 * 60 * 1000,
  limit: 60,
  keyGenerator: (req) => `user:${req.apiUser?.id || req.apiUser?.email || clientIpKey(req)}`
});

const splitDraftLimiter = createRateLimiter({
  prefix: "split-draft-write",
  windowMs: 15 * 60 * 1000,
  limit: 120,
  keyGenerator: (req) => `user:${req.apiUser?.id || req.apiUser?.email || clientIpKey(req)}`
});

const splitFinalizeLimiter = createRateLimiter({
  prefix: "split-finalize",
  windowMs: 60 * 60 * 1000,
  limit: 20,
  keyGenerator: (req) => `user:${req.apiUser?.id || req.apiUser?.email || clientIpKey(req)}`
});

const pluginDownloadLimiter = createRateLimiter({
  prefix: "plugin-download",
  windowMs: 60 * 60 * 1000,
  limit: 20,
  keyGenerator: (req) => {
    const purchaseId = String(req.params.purchaseId || "").trim();
    const token = String(req.query.token || "").trim();
    return `download:${purchaseId}:${token || clientIpKey(req)}`;
  }
});

const adminLimiter = createRateLimiter({
  prefix: "admin-surface",
  windowMs: 15 * 60 * 1000,
  limit: 60
});

const splitSheetPublicLimiter = createRateLimiter({
  prefix: "split-sheet-public",
  windowMs: 15 * 60 * 1000,
  limit: 60
});

const splitSheetSubmitLimiter = createRateLimiter({
  prefix: "split-sheet-submit",
  windowMs: 60 * 60 * 1000,
  limit: 20
});

const signerViewLimiter = createRateLimiter({
  prefix: "signer-view",
  windowMs: 15 * 60 * 1000,
  limit: 60,
  keyGenerator: (req) => `signer:${String(req.params.id || "")}:${String(req.params.token || "")}:${clientIpKey(req)}`
});

const signerSubmitLimiter = createRateLimiter({
  prefix: "signer-submit",
  windowMs: 60 * 60 * 1000,
  limit: 20,
  keyGenerator: (req) => `signer-submit:${String(req.params.id || "")}:${String(req.params.token || "")}:${clientIpKey(req)}`
});

app.use(["/split-sheet", "/admin", "/signup", "/forgot-password", "/reset-password", "/verify-email"], ensureAppHost);

app.get("/", publicPageLimiter, (req, res) => {
  if (isMarketingHost(req)) {
    return res.render("landing", {
      ...publicNavModel(),
      pluginUrl: `${baseUrl}#plugin`,
      pluginPriceLabel: storefrontPriceLabel(),
      stripeEnabled,
      latestPosts: latestBlogPosts()
    });
  }
  return res.render("index", {
    ...publicNavModel(),
    forgotPasswordUrl: `${baseUrl}/forgot-password`
  });
});
app.get("/pricing", publicPageLimiter, (req, res) => {
  return res.render("pricing", {
    ...publicNavModel(),
    priceLabel: storefrontPriceLabel(),
    pluginName: stripePluginProductName,
    pluginVersionLabel,
    checkoutEnabled: stripeEnabled,
    launchMode: stripeEnabled ? "checkout" : "prelaunch"
  });
});
app.post("/buy/plugin", publicPageLimiter, async (req, res) => {
  if (!stripeEnabled) {
    return res.status(503).render("pricing", {
      ...publicNavModel(),
      priceLabel: storefrontPriceLabel(),
      pluginName: stripePluginProductName,
      pluginVersionLabel,
      checkoutEnabled: false,
      launchMode: "prelaunch",
      error: "Stripe checkout is not configured on this environment yet."
    });
  }

  try {
    const session = await stripeClient.checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      billing_address_collection: "auto",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: stripePluginPriceUsdCents,
            product_data: {
              name: stripePluginProductName,
              description: `${stripePluginProductDescription} Version ${pluginVersionLabel}.`
            }
          }
        }
      ],
      metadata: {
        productSku: stripePluginProductSku,
        pluginVersionLabel
      }
    });

    return res.redirect(303, session.url);
  } catch (error) {
    console.error(error);
    return res.status(500).render("pricing", {
      ...publicNavModel(),
      priceLabel: storefrontPriceLabel(),
      pluginName: stripePluginProductName,
      pluginVersionLabel,
      checkoutEnabled: stripeEnabled,
      launchMode: stripeEnabled ? "checkout" : "prelaunch",
      error: "Stripe checkout failed to initialize."
    });
  }
});
app.get("/checkout/cancel", publicPageLimiter, (req, res) => {
  return res.render("checkout-cancel", {
    pricingUrl: "/pricing",
    appUrl: baseUrl
  });
});
app.get("/checkout/success", publicPageLimiter, async (req, res) => {
  if (!stripeEnabled) {
    return res.status(503).render("auth-message", {
      title: "Checkout unavailable",
      message: "Stripe is not configured on this environment.",
      details: "Configure STRIPE_SECRET_KEY before using hosted checkout.",
      actionHref: "/pricing",
      actionLabel: "Back to pricing",
      debugLink: null
    });
  }

  const sessionId = String(req.query.session_id || "").trim();
  if (!sessionId) {
    return res.status(400).render("auth-message", {
      title: "Missing checkout session",
      message: "Stripe did not return a checkout session ID.",
      details: "Retry the purchase flow from the pricing page.",
      actionHref: "/pricing",
      actionLabel: "Back to pricing",
      debugLink: null
    });
  }

  try {
    const session = await stripeClient.checkout.sessions.retrieve(sessionId);
    const purchase = await fulfillPluginCheckoutSession(session);
    return res.render("checkout-success", {
      purchase,
      pluginName: stripePluginProductName,
      pluginVersionLabel,
      priceLabel: formatMoney(purchase.amountTotal, purchase.currency),
      downloadHref: pluginDownloadHref(purchase),
      pricingUrl: "/pricing",
      appUrl: baseUrl
    });
  } catch (error) {
    console.error(error);
    return res.status(500).render("auth-message", {
      title: "Checkout verification failed",
      message: "The payment completed page could not verify your Stripe session.",
      details: "Retry from your Stripe receipt or contact support.",
      actionHref: "/pricing",
      actionLabel: "Back to pricing",
      debugLink: null
    });
  }
});
app.post("/api/stripe/webhook", async (req, res) => {
  if (!stripeEnabled) {
    return res.status(503).json({ ok: false, error: "stripe_not_configured" });
  }

  try {
    const rawBody = parseWebhookBody(req);
    const signature = req.headers["stripe-signature"];
    let event;

    if (stripeWebhookSecret && signature) {
      event = stripeClient.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret);
    } else {
      event = JSON.parse(rawBody.toString("utf8"));
    }

    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      await fulfillPluginCheckoutSession(event.data.object);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ ok: false, error: "stripe_webhook_failed" });
  }
});
app.get("/downloads/plugin/:purchaseId", pluginDownloadLimiter, async (req, res) => {
  const purchaseId = String(req.params.purchaseId || "").trim();
  const token = String(req.query.token || "").trim();
  const purchase = await storefrontService.getPurchaseByIdAndToken(purchaseId, token);
  if (!purchase) {
    return res.status(404).render("auth-message", {
      title: "Download link not found",
      message: "That plugin download link is invalid or expired.",
      details: "Use the most recent purchase email or purchase again from the pricing page.",
      actionHref: "/pricing",
      actionLabel: "Back to pricing",
      debugLink: null
    });
  }
  await storefrontService.recordDownload(purchase.id);
  return sendPluginInstaller(res);
});
app.get("/blog", publicPageLimiter, (req, res) => {
  return res.render("blog-index", {
    posts: listPosts(),
    ...publicNavModel()
  });
});
app.get("/blog/:slug", publicPageLimiter, (req, res) => {
  const post = getPostBySlug(String(req.params.slug || ""));
  if (!post) {
    return res.status(404).render("auth-message", {
      title: "Article not found",
      message: "That blog post does not exist.",
      details: null,
      actionHref: "/blog",
      actionLabel: "View all articles",
      debugLink: null
    });
  }
  return res.render("blog-post", {
    post,
    ...publicNavModel()
  });
});
app.get("/health", (req, res) => res.json({ ok: true, at: nowIso() }));
app.get("/ready", (req, res) => res.json({
  ok: true,
  at: nowIso(),
  dbProvider: databaseService.provider,
  requireEmailVerification,
  stripeEnabled,
  smtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
  sesConfigured: Boolean((process.env.SES_REGION || process.env.AWS_REGION || process.env.AWS_PROFILE || process.env.FROM_EMAIL) && process.env.FROM_EMAIL),
  baseUrl
}));
app.get("/api/health", (req, res) => res.json({ ok: true, at: nowIso(), api: "v1" }));
app.get("/api/ready", (req, res) => res.json({
  ok: true,
  at: nowIso(),
  api: "v1",
  dbProvider: databaseService.provider,
  allowPublicRegistration,
  requireEmailVerification,
  stripeEnabled,
  smtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
  sesConfigured: Boolean((process.env.SES_REGION || process.env.AWS_REGION || process.env.AWS_PROFILE || process.env.FROM_EMAIL) && process.env.FROM_EMAIL),
  baseUrl
}));
app.post("/api/auth/register", registerLimiter, async (req, res) => {
  if (!allowPublicRegistration && await authService.userCount() > 0) {
    return apiError(res, 403, "Public registration is disabled.");
  }
  try {
    const result = await authService.registerUser({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
      ip: requestIp(req),
      userAgent: req.headers["user-agent"]
    });
    const verificationEmail = await sendVerificationEmail({
      user: result.user,
      token: result.verificationToken,
      expiresAt: result.verificationExpiresAt
    });
    clearLoginFailures(req);
    return res.status(201).json({
      ok: true,
      ...result,
      verificationEmail,
      verificationToken: authDebugTokens ? result.verificationToken : undefined
    });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return apiError(res, error.statusCode, error.message);
    }
    console.error(error);
    return apiError(res, 500, "Unexpected server error while creating account.");
  }
});
app.post("/api/auth/login", loginLimiter, async (req, res) => {
  const gate = canAttemptLogin(req);
  if (!gate.allowed) {
    return apiError(res, 429, `Too many attempts. Try again in ${gate.retryAfterSec}s.`);
  }
  try {
    const result = await authService.createSession({
      email: req.body.email,
      password: req.body.password,
      ip: requestIp(req),
      userAgent: req.headers["user-agent"]
    });
    clearLoginFailures(req);
    return res.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      if (error.statusCode === 401) {
        recordLoginFailure(req);
      }
      return apiError(res, error.statusCode, error.message);
    }
    console.error(error);
    return apiError(res, 500, "Unexpected server error while creating API session.");
  }
});
app.post("/api/auth/resend-verification", resendVerificationLimiter, async (req, res) => {
  try {
    const verification = await authService.createVerificationRequest({
      email: req.body.email
    });
    let verificationEmail = { ok: true, skipped: true, reason: "not_requested" };
    if (verification.created) {
      verificationEmail = await sendVerificationEmail({
        user: verification.user,
        token: verification.token,
        expiresAt: verification.expiresAt
      });
    }
    return res.json({
      ok: true,
      sent: Boolean(verification.created),
      verificationEmail,
      verificationToken: authDebugTokens ? verification.token : undefined
    });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return apiError(res, error.statusCode, error.message);
    }
    console.error(error);
    return apiError(res, 500, "Unexpected server error while resending verification.");
  }
});
app.post("/api/auth/verify-email", async (req, res) => {
  try {
    const result = await authService.verifyEmailToken(req.body.token);
    return res.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return apiError(res, error.statusCode, error.message);
    }
    console.error(error);
    return apiError(res, 500, "Unexpected server error while verifying email.");
  }
});
app.post("/api/auth/request-password-reset", forgotPasswordLimiter, async (req, res) => {
  try {
    const resetRequest = await authService.createPasswordResetRequest({
      email: req.body.email
    });
    let resetEmail = { ok: true, skipped: true, reason: "not_requested" };
    if (resetRequest.created) {
      resetEmail = await sendPasswordResetEmail({
        user: resetRequest.user,
        token: resetRequest.token,
        expiresAt: resetRequest.expiresAt
      });
    }
    return res.json({
      ok: true,
      sent: Boolean(resetRequest.created),
      resetEmail,
      resetToken: authDebugTokens ? resetRequest.token : undefined
    });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return apiError(res, error.statusCode, error.message);
    }
    console.error(error);
    return apiError(res, 500, "Unexpected server error while requesting password reset.");
  }
});
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const result = await authService.resetPasswordWithToken({
      token: req.body.token,
      password: req.body.password
    });
    return res.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return apiError(res, error.statusCode, error.message);
    }
    console.error(error);
    return apiError(res, 500, "Unexpected server error while resetting password.");
  }
});
app.post("/api/auth/refresh", async (req, res) => {
  try {
    const result = await authService.refreshSession({
      refreshToken: req.body.refreshToken,
      ip: requestIp(req),
      userAgent: req.headers["user-agent"]
    });
    return res.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return apiError(res, error.statusCode, error.message);
    }
    console.error(error);
    return apiError(res, 500, "Unexpected server error while refreshing API session.");
  }
});
app.post("/api/auth/logout", async (req, res) => {
  const revoked = await authService.revokeSessionByRefreshToken(req.body.refreshToken);
  return res.json({ ok: true, revoked });
});
app.get("/api/me", requireApiAuth, (req, res) => res.json({
  ok: true,
  user: req.apiUser
}));
app.get("/signup", publicPageLimiter, (req, res) => res.render("auth-signup", {
  error: null,
  values: { displayName: "", email: "" },
  allowPublicRegistration,
  baseUrl,
  supportEmail
}));
app.post("/signup", registerLimiter, async (req, res) => {
  if (!allowPublicRegistration && await authService.userCount() > 0) {
    return res.status(403).render("auth-signup", {
      error: "Public registration is disabled right now.",
      values: {
        displayName: String(req.body.displayName || ""),
        email: String(req.body.email || "")
      },
      allowPublicRegistration,
      baseUrl,
      supportEmail
    });
  }
  try {
    const result = await authService.registerUser({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
      ip: requestIp(req),
      userAgent: req.headers["user-agent"]
    });
    const verificationEmail = await sendVerificationEmail({
      user: result.user,
      token: result.verificationToken,
      expiresAt: result.verificationExpiresAt
    });
    return res.render("auth-message", {
      title: "Account created",
      message: `We created your account for ${result.user.email}. Check your inbox for the verification link.`,
      details: verificationEmail.ok
        ? "Verification email sent."
        : `Verification email status: ${verificationEmail.reason || "not_sent"}.`,
      actionHref: "/forgot-password",
      actionLabel: "Need a reset later?",
      debugLink: authDebugTokens ? verificationEmail.verifyUrl : null
    });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return res.status(error.statusCode).render("auth-signup", {
        error: error.message,
        values: {
          displayName: String(req.body.displayName || ""),
          email: String(req.body.email || "")
        },
        allowPublicRegistration,
        baseUrl,
        supportEmail
      });
    }
    console.error(error);
    return res.status(500).render("auth-signup", {
      error: "Unexpected server error while creating your account.",
      values: {
        displayName: String(req.body.displayName || ""),
        email: String(req.body.email || "")
      },
      allowPublicRegistration,
      baseUrl,
      supportEmail
    });
  }
});
app.get("/forgot-password", publicPageLimiter, (req, res) => res.render("auth-forgot-password", {
  error: null,
  value: "",
  baseUrl,
  supportEmail
}));
app.post("/forgot-password", forgotPasswordLimiter, async (req, res) => {
  try {
    const resetRequest = await authService.createPasswordResetRequest({
      email: req.body.email
    });
    let resetEmail = { ok: true, skipped: true, reason: "not_requested" };
    if (resetRequest.created) {
      resetEmail = await sendPasswordResetEmail({
        user: resetRequest.user,
        token: resetRequest.token,
        expiresAt: resetRequest.expiresAt
      });
    }
    return res.render("auth-message", {
      title: "Check your inbox",
      message: "If that email exists in SplitSheet Studio, a password reset link is on the way.",
      details: resetEmail.ok
        ? "Password reset email sent."
        : `Password reset email status: ${resetEmail.reason || "not_sent"}.`,
      actionHref: "/signup",
      actionLabel: "Create a new account",
      debugLink: authDebugTokens ? resetEmail.resetUrl : null
    });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return res.status(error.statusCode).render("auth-forgot-password", {
        error: error.message,
        value: String(req.body.email || ""),
        baseUrl,
        supportEmail
      });
    }
    console.error(error);
    return res.status(500).render("auth-forgot-password", {
      error: "Unexpected server error while requesting password reset.",
      value: String(req.body.email || ""),
      baseUrl,
      supportEmail
    });
  }
});
app.get("/reset-password", publicPageLimiter, (req, res) => res.render("auth-reset-password", {
  error: null,
  success: false,
  token: String(req.query.token || ""),
  baseUrl,
  supportEmail
}));
app.post("/reset-password", async (req, res) => {
  try {
    await authService.resetPasswordWithToken({
      token: req.body.token,
      password: req.body.password
    });
    return res.render("auth-reset-password", {
      error: null,
      success: true,
      token: "",
      baseUrl,
      supportEmail
    });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return res.status(error.statusCode).render("auth-reset-password", {
        error: error.message,
        success: false,
        token: String(req.body.token || ""),
        baseUrl,
        supportEmail
      });
    }
    console.error(error);
    return res.status(500).render("auth-reset-password", {
      error: "Unexpected server error while resetting your password.",
      success: false,
      token: String(req.body.token || ""),
      baseUrl,
      supportEmail
    });
  }
});
app.get("/verify-email", publicPageLimiter, async (req, res) => {
  try {
    const token = String(req.query.token || "");
    if (!token) {
      return res.status(400).render("auth-message", {
        title: "Verification link missing",
        message: "This verification link is incomplete.",
        details: "Request a fresh link from the signup flow or contact support.",
        actionHref: "/signup",
        actionLabel: "Create account",
        debugLink: null
      });
    }
    const result = await authService.verifyEmailToken(token);
    return res.render("auth-message", {
      title: "Email verified",
      message: `${result.user.email} is now verified.`,
      details: "You can use this account in the plugin and future hosted account flows.",
      actionHref: "/forgot-password",
      actionLabel: "Test password recovery",
      debugLink: null
    });
  } catch (error) {
    const message = error instanceof ApiAuthError ? error.message : "Unexpected server error while verifying email.";
    if (!(error instanceof ApiAuthError)) {
      console.error(error);
    }
    return res.status(error instanceof ApiAuthError ? error.statusCode : 500).render("auth-message", {
      title: "Verification failed",
      message,
      details: "Request a fresh verification link if you still need access.",
      actionHref: "/signup",
      actionLabel: "Back to signup",
      debugLink: null
    });
  }
});
app.get("/api/split-sheets", requireApiAuth, authenticatedApiLimiter, async (req, res) => {
  const statusFilter = String(req.query.status || "").trim().toLowerCase();
  let docs = await submissionStore.listSubmissions({
    ownerUserId: req.apiUser.id,
    ownerEmail: req.apiUser.email,
    type: "split-sheet"
  });
  if (statusFilter) {
    docs = docs.filter((doc) => String(doc.status || "").toLowerCase() === statusFilter);
  }
  return res.json({
    ok: true,
    splitSheets: docs.map((doc) => summarizeSplitSheet(doc, baseUrl))
  });
});
app.get("/api/split-sheets/:id", requireApiAuth, authenticatedApiLimiter, async (req, res) => {
  const doc = await loadSubmission(req.params.id);
  if (!doc || doc.type !== "split-sheet") {
    return apiError(res, 404, "Split sheet not found.");
  }
  if (!canAccessSplitSheet(doc, req.apiUser)) {
    return apiError(res, 403, "You do not have access to this split sheet.");
  }
  return res.json({
    ok: true,
    splitSheet: detailSplitSheet(doc, baseUrl)
  });
});
app.post("/api/split-sheets/drafts", requireApiAuth, splitDraftLimiter, async (req, res) => {
  try {
    const draft = await createDraftSplitSheet(req.body, req);
    return res.status(201).json({
      ok: true,
      splitSheet: detailSplitSheet(draft, baseUrl)
    });
  } catch (error) {
    console.error(error);
    return apiError(res, 500, "Unexpected server error while saving draft.");
  }
});
app.put("/api/split-sheets/:id/draft", requireApiAuth, splitDraftLimiter, async (req, res) => {
  try {
    const doc = await loadSubmission(req.params.id);
    if (!doc || doc.type !== "split-sheet") {
      return apiError(res, 404, "Split sheet not found.");
    }
    if (!canAccessSplitSheet(doc, req.apiUser)) {
      return apiError(res, 403, "You do not have access to this split sheet.");
    }
    if (doc.status !== "draft") {
      return apiError(res, 409, "Only draft split sheets can be updated with this endpoint.");
    }
    const updated = await updateDraftSplitSheet(doc, req.body, req);
    return res.json({
      ok: true,
      splitSheet: detailSplitSheet(updated, baseUrl)
    });
  } catch (error) {
    console.error(error);
    return apiError(res, 500, "Unexpected server error while updating draft.");
  }
});
app.post("/api/split-sheets/validate", requireApiAuth, splitValidateLimiter, async (req, res) => {
  try {
    const prepared = await buildSplitSheetPayload(req.body, {
      nextVersion: nextSplitVersion,
      createSignerToken: () => nanoid(22),
      nowIso
    });
    return res.json({
      ok: true,
      songTitle: prepared.payload.songTitle,
      version: prepared.payload.version,
      collectSignaturesByInvite: prepared.collectByInvite,
      totals: prepared.totals,
      contributorCount: prepared.contributors.length
    });
  } catch (error) {
    if (error instanceof SplitSheetValidationError) {
      return apiError(res, error.statusCode, error.message, error.details);
    }
    console.error(error);
    return apiError(res, 500, "Unexpected server error while validating split sheet.");
  }
});
app.post("/api/split-sheets", requireApiAuth, splitFinalizeLimiter, async (req, res) => {
  try {
    const result = await createSplitSheetSubmission(req.body, req);
    return res.status(201).json({
      ok: true,
      splitSheet: summarizeSplitSheet(result.saved, baseUrl),
      emailResult: result.emailResult
    });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return apiError(res, error.statusCode, error.message);
    }
    if (error instanceof SplitSheetValidationError) {
      return apiError(res, error.statusCode, error.message, error.details);
    }
    console.error(error);
    return apiError(res, 500, "Unexpected server error while saving split sheet.");
  }
});
app.get("/api/split-sheets/:id/status", requireApiAuth, authenticatedApiLimiter, async (req, res) => {
  const doc = await loadSubmission(req.params.id);
  if (!doc || doc.type !== "split-sheet") {
    return apiError(res, 404, "Split sheet not found.");
  }
  if (!canAccessSplitSheet(doc, req.apiUser)) {
    return apiError(res, 403, "You do not have access to this split sheet.");
  }
  return res.json({
    ok: true,
    splitSheet: summarizeSplitSheet(doc, baseUrl)
  });
});
app.get("/split-sheet", splitSheetPublicLimiter, (req, res) => res.render("split-sheet", { error: null }));

app.post("/split-sheet", splitSheetSubmitLimiter, async (req, res) => {
  try {
    const { saved, payload, collectByInvite, emailResult } = await createSplitSheetSubmission(req.body, req);

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
  } catch (error) {
    if (error instanceof SplitSheetValidationError) {
      return res.status(error.statusCode).render("split-sheet", { error: error.message });
    }
    console.error(error);
    res.status(500).render("split-sheet", { error: "Unexpected server error while saving split sheet." });
  }
});

app.get("/split-sheet/sign/:id/:token", signerViewLimiter, async (req, res) => {
  const doc = await loadSubmission(req.params.id);
  if (!doc || doc.type !== "split-sheet") return res.status(404).send("Not found");
  const signer = (doc.payload?.contributors || []).find((c) => c.signerToken === req.params.token);
  if (!signer) return res.status(404).send("Invalid sign link");

  if (!signer.viewedAt) {
    signer.viewedAt = nowIso();
    doc.updatedAt = nowIso();
    await saveSubmissionRow(doc);
  }

  res.render("split-sign", { doc, signer, timeline: splitSignerTimeline(doc), error: null, success: null });
});

app.post("/split-sheet/sign/:id/:token", signerSubmitLimiter, async (req, res) => {
  const doc = await loadSubmission(req.params.id);
  if (!doc || doc.type !== "split-sheet") return res.status(404).send("Not found");
  const contributors = doc.payload?.contributors || [];
  const signerIndex = contributors.findIndex((c) => c.signerToken === req.params.token);
  if (signerIndex < 0) return res.status(404).send("Invalid sign link");

  const typedSignatureName = String(req.body.typedSignatureName || "").trim();
  const signatureData = String(req.body.signatureData || "").trim();
  if (!typedSignatureName || !signatureData.startsWith("data:image/")) {
    const signer = contributors[signerIndex];
    return res.status(400).render("split-sign", { doc, signer, timeline: splitSignerTimeline(doc), error: "Typed name and drawn signature are required.", success: null });
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
    const finalPdf = splitPdfPath(doc.id);
    await sendEmail({
      subject: `Completed Split Sheet - ${doc.payload.songTitle} (v${doc.payload.version})`,
      to: recipients,
      html: completionEmailHtml({
        title: "All Signatures Completed",
        id: doc.id,
        songLabel: `Song: ${doc.payload.songTitle} (v${doc.payload.version})`,
        downloadUrl: `${baseUrl}/split-sheet/pdf/${doc.id}`,
        recipients,
        splitHtml: splitSummaryHtml(doc.payload?.contributors || [])
      }),
      attachments: fs.existsSync(finalPdf) ? [{ filename: path.basename(finalPdf), path: finalPdf }] : []
    });
  }

  doc.updatedAt = nowIso();
  await saveSubmissionRow(doc);

  const signer = contributors[signerIndex];
  res.render("split-sign-success", {
    doc,
    signer,
    everyoneSigned,
    message: everyoneSigned
      ? "Submitted. Final packet has been generated and emailed to all recipients. Please check your email."
      : "Submitted. Your signature is saved. We are waiting on the remaining signer(s)."
  });
});

app.get("/split-sheet/pdf/:id", splitSheetPublicLimiter, async (req, res) => {
  const docJson = await loadSubmission(req.params.id);
  if (!docJson) return res.status(404).send("Not found");
  if (docJson.type !== "split-sheet") return res.status(400).send("Not a split sheet");

  const finalPdf = splitPdfPath(docJson.id);
  if (fs.existsSync(finalPdf)) {
    return res.download(finalPdf, pdfDownloadFilename(docJson.id));
  }
  try {
    if (await streamStoredFinalPdf(docJson, res)) {
      return;
    }
  } catch (error) {
    console.error(`Failed to stream final PDF from S3 for ${docJson.id}:`, error.message || error);
  }

  // fallback summary packet if final not generated yet
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${pdfDownloadFilename(docJson.id, "summary")}"`);

  const pdf = new PDFDocument({ margin: 24 });
  pdf.pipe(res);
  renderSplitSheetPdf(pdf, docJson, { pendingSummary: true });
  pdf.end();
});

app.get("/admin/login", adminLimiter, (req, res) => res.render("admin-login", { error: null }));
app.post("/admin/login", adminLimiter, (req, res) => {
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
app.get("/admin", adminLimiter, requireAdmin, async (req, res) => {
  const docs = (await listSubmissions()).map((d) => {
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

app.get("/admin/split/:id", adminLimiter, requireAdmin, async (req, res) => {
  const doc = await loadSubmission(req.params.id);
  if (!doc || doc.type !== "split-sheet") return res.status(404).send("Not found");

  const timeline = splitSignerTimeline(doc).map((row, index) => {
    const contributor = doc.payload?.contributors?.[index] || {};
    return {
      ...row,
      signerLink: contributor.signerToken ? `${baseUrl}/split-sheet/sign/${doc.id}/${contributor.signerToken}` : null
    };
  });
  const signerStats = {
    total: timeline.length,
    signed: timeline.filter((row) => row.signedAt).length,
    viewed: timeline.filter((row) => row.viewedAt).length,
    pending: timeline.filter((row) => !row.signedAt).length
  };

  res.render("admin-split-detail", { doc, timeline, signerStats, banner: req.query.banner || "" });
});

app.post("/admin/split/:id/remind", adminLimiter, requireAdmin, async (req, res) => {
  const doc = await loadSubmission(req.params.id);
  if (!doc || doc.type !== "split-sheet") return res.status(404).send("Not found");

  const pending = (doc.payload?.contributors || []).filter((c) => c.signerToken && !c.signedAt);
  let sent = 0;
  for (const contributor of pending) {
    contributor.reminderSentAt = nowIso();
    await sendSplitInvite(doc, contributor);
    sent += 1;
  }
  doc.updatedAt = nowIso();
  doc.lastReminderRun = { at: nowIso(), sent };
  await saveSubmissionRow(doc);
  res.redirect(`/admin/split/${doc.id}?banner=${encodeURIComponent(`Reminder email run complete. Sent ${sent} reminder(s).`)}`);
});

app.get("/admin/doc/:id", adminLimiter, requireAdmin, async (req, res) => {
  const doc = await loadSubmission(req.params.id);
  if (!doc) return res.status(404).send("Not found");
  res.type("application/json").send(submissionStore.serializeSubmission(doc));
});

if (require.main === module) {
  initializeRuntime()
    .then(() => {
      app.listen(PORT, HOST, () => console.log(`Split Sheet Open Sign running at ${baseUrl}`));
    })
    .catch((error) => {
      console.error("Startup failed:", error.message || error);
      process.exit(1);
    });
}

module.exports = app;
