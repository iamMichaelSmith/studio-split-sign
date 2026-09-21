const crypto = require("crypto");
const fs = require("fs");

const INSECURE_VALUES = new Set([
  "change-me",
  "change-me-long-random-string",
  "change-me-separate-api-token-secret",
  "change-me-separate-pdf-link-secret",
  "split-open-sign",
  "split-open-sign-api-secret",
  "testsubject5"
]);

function configured(value) {
  const normalized = String(value || "").trim();
  return Boolean(normalized) && !INSECURE_VALUES.has(normalized.toLowerCase());
}

function strongSecret(value, minimumLength = 32) {
  const normalized = String(value || "");
  return configured(normalized) && normalized.length >= minimumLength;
}

function validateProductionRuntime({
  environment,
  baseUrl,
  dbProvider,
  sessionStoreMode,
  cookieSecure,
  pdfStorageMode
}) {
  if (String(environment.NODE_ENV || "").toLowerCase() !== "production") return;

  const errors = [];
  const parsedBaseUrl = new URL(baseUrl);
  const sessionSecret = String(environment.SESSION_SECRET || "");
  const apiTokenSecret = String(environment.API_TOKEN_SECRET || "");
  const pdfLinkSecret = String(environment.PDF_LINK_SECRET || "");
  const stripeSecretKey = String(environment.STRIPE_SECRET_KEY || "").trim();
  const stripeWebhookSecret = String(environment.STRIPE_WEBHOOK_SECRET || "").trim();
  const contactExportToken = String(environment.CONTACT_EXPORT_TOKEN || "").trim();
  const stripeEnabled = configured(stripeSecretKey) && !/^(disabled|unset|none|null)$/i.test(stripeSecretKey);

  if (parsedBaseUrl.protocol !== "https:") errors.push("PUBLIC_BASE_URL must use HTTPS");
  if (String(dbProvider).toLowerCase() !== "postgres") errors.push("DB_PROVIDER must be postgres");
  if (String(sessionStoreMode).toLowerCase() !== "redis") errors.push("SESSION_STORE must be redis");
  if (!environment.REDIS_URL) errors.push("REDIS_URL is required");
  if (!cookieSecure) errors.push("COOKIE_SECURE must be true");
  if (String(pdfStorageMode).toLowerCase() !== "s3") errors.push("PDF_STORAGE must be s3");
  if (!environment.S3_BUCKET) errors.push("S3_BUCKET is required");
  if (!strongSecret(sessionSecret)) errors.push("SESSION_SECRET must be at least 32 characters and non-default");
  if (!strongSecret(apiTokenSecret)) errors.push("API_TOKEN_SECRET must be at least 32 characters and non-default");
  if (!strongSecret(pdfLinkSecret)) errors.push("PDF_LINK_SECRET must be at least 32 characters and non-default");
  if (sessionSecret && apiTokenSecret
      && Buffer.byteLength(sessionSecret) === Buffer.byteLength(apiTokenSecret)
      && crypto.timingSafeEqual(Buffer.from(sessionSecret), Buffer.from(apiTokenSecret))) {
    errors.push("SESSION_SECRET and API_TOKEN_SECRET must be different");
  }
  if (pdfLinkSecret && (pdfLinkSecret === sessionSecret || pdfLinkSecret === apiTokenSecret)) {
    errors.push("PDF_LINK_SECRET must be different from SESSION_SECRET and API_TOKEN_SECRET");
  }
  if (!configured(environment.ADMIN_USER)) errors.push("ADMIN_USER must be configured and non-default");
  if (!strongSecret(environment.ADMIN_PASS, 12)) errors.push("ADMIN_PASS must be at least 12 characters and non-default");
  if (String(environment.REQUIRE_EMAIL_VERIFICATION || "").toLowerCase() !== "true") {
    errors.push("REQUIRE_EMAIL_VERIFICATION must be true");
  }
  if (String(environment.AUTH_DEBUG_TOKENS || "false").toLowerCase() === "true") {
    errors.push("AUTH_DEBUG_TOKENS must be false");
  }
  if (!configured(environment.FROM_EMAIL)) errors.push("FROM_EMAIL is required");
  if (!configured(environment.SUPPORT_EMAIL || environment.REPLY_TO_EMAIL)) errors.push("SUPPORT_EMAIL or REPLY_TO_EMAIL is required");
  if (String(environment.PGSSLMODE || "").toLowerCase() !== "verify-full") {
    errors.push("PGSSLMODE must be verify-full");
  }
  if (String(environment.PG_SSL_REJECT_UNAUTHORIZED || "").toLowerCase() !== "true") {
    errors.push("PG_SSL_REJECT_UNAUTHORIZED must be true");
  }
  if (!environment.PG_SSL_CA_PATH || !fs.existsSync(environment.PG_SSL_CA_PATH)) {
    errors.push("PG_SSL_CA_PATH must reference the trusted database CA bundle");
  }
  if (stripeEnabled && !configured(stripeWebhookSecret)) {
    errors.push("STRIPE_WEBHOOK_SECRET is required when STRIPE_SECRET_KEY is configured");
  }
  if (contactExportToken && !strongSecret(contactExportToken)) {
    errors.push("CONTACT_EXPORT_TOKEN must be at least 32 characters and non-default when configured");
  }

  if (errors.length) {
    throw new Error(`Unsafe production configuration:\n- ${errors.join("\n- ")}`);
  }
}

module.exports = {
  configured,
  strongSecret,
  validateProductionRuntime
};
