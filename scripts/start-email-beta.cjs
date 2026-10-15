const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const dotenv = require('dotenv');

const root = path.resolve(__dirname, '..');
const directory = path.join(root, '.local/email-beta');
fs.mkdirSync(directory, { recursive: true });
const accessPath = path.join(directory, 'access.json');
const access = fs.existsSync(accessPath) ? JSON.parse(fs.readFileSync(accessPath, 'utf8')) : {
  username: 'beta-owner', password: crypto.randomBytes(24).toString('base64url'),
  sessionSecret: crypto.randomBytes(48).toString('hex'), apiSecret: crypto.randomBytes(48).toString('hex'),
  pdfSecret: crypto.randomBytes(48).toString('hex')
};
fs.writeFileSync(accessPath, JSON.stringify(access, null, 2), { mode: 0o600 });
const pidPath = path.join(directory, 'server.pid');
if (fs.existsSync(pidPath)) {
  const pid = Number(fs.readFileSync(pidPath, 'utf8'));
  try { process.kill(pid, 0); console.log('Beta server is already running.'); process.exit(0); } catch {}
}
const local = fs.existsSync(path.join(root, '.env')) ? dotenv.parse(fs.readFileSync(path.join(root, '.env'))) : {};
const betaUrl = process.env.EMAIL_BETA_BASE_URL || 'http://192.168.1.70:5051';
const token = fs.readFileSync(path.join(root, '.local/onboarding-automation-token.txt'), 'utf8').trim();
const environment = {
  ...process.env, ...local,
  NODE_ENV: 'development', HOST: '0.0.0.0', PORT: String(new URL(betaUrl).port || 5051),
  PUBLIC_BASE_URL: betaUrl, ROOT_DOMAIN: new URL(betaUrl).hostname,
  DATA_DIR: directory, DB_PATH: path.join(directory, 'app.db'), DB_PROVIDER: 'sqlite', DATABASE_URL: '',
  SESSION_STORE: 'memory', PDF_STORAGE: 'local', COOKIE_SECURE: 'false', TRUST_PROXY: 'false',
  ADMIN_USER: access.username, ADMIN_PASS: access.password, OWNER_EMAIL: '', OWNER_PASSWORD: '',
  SESSION_SECRET: access.sessionSecret, API_TOKEN_SECRET: access.apiSecret, PDF_LINK_SECRET: access.pdfSecret,
  REQUIRE_EMAIL_VERIFICATION: 'true', ALLOW_PUBLIC_REGISTRATION: 'true', AUTH_DEBUG_TOKENS: 'false',
  STRIPE_SECRET_KEY: 'disabled', STRIPE_WEBHOOK_SECRET: 'disabled',
  GOOGLE_CLIENT_ID: '', GOOGLE_CLIENT_SECRET: '', AUTO_SIGNER_REMINDERS: 'false', GA_MEASUREMENT_ID: '',
  SES_REGION: 'us-east-1', FROM_EMAIL: 'no-reply@splitsheetstudio.com', REPLY_TO_EMAIL: 'blakmarigold@gmail.com',
  SMTP_USER: '', SMTP_PASS: '', CONTACT_EXPORT_TOKEN: '',
  EMAIL_JOURNEYS_ENABLED: 'true', EMAIL_JOURNEYS_MODE: 'beta', EMAIL_JOURNEY_DAY_MINUTES: '1440',
  EMAIL_JOURNEY_BETA_RECIPIENTS: 'blakmarigold@gmail.com', ONBOARDING_AUTOMATION_TOKEN: token
};
const output = fs.openSync(path.join(directory, 'server.log'), 'a');
const child = spawn(process.execPath, ['--use-system-ca', path.join(root, 'server.js')], {
  cwd: root, env: environment, detached: true, windowsHide: true, stdio: ['ignore', output, output]
});
fs.writeFileSync(pidPath, String(child.pid));
child.unref();
fs.closeSync(output);
console.log(`Isolated email beta starting at ${betaUrl}/admin/email-journeys`);
console.log('Only blakmarigold@gmail.com can receive email from this environment.');
