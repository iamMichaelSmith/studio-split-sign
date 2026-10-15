# Split Sheet Studio launch remediation status

Date: 2026-10-02

## Live deployment

- Production app is deployed on ECS task definition `splitsheetstudio-staging:77`.
- Live health check is passing at `https://app.splitsheetstudio.com/health`.
- Current release id: `20261002-7430a246`.
- Deployment circuit breaker rollback is enabled for the ECS service.

## Fixed

- Stripe checkout now validates the configured live price IDs before creating Checkout sessions.
- Stripe webhook handling now covers subscription create/update/delete, checkout completion, successful invoice payment, and failed invoice payment.
- Duplicate subscriptions are guarded through Checkout reuse, Stripe customer reuse, and active-subscription portal routing.
- Free-plan users are limited through a durable monthly send ledger instead of draft creation count.
- Free API bearer-token split-sheet creation is blocked; browser-based free use remains available.
- Paid installer downloads require authentication and paid entitlement.
- Signing links and generated PDFs no longer copy the operator email by default.
- Final PDF delivery is limited to contributors and explicit recipients.
- CSP now uses nonced scripts and removes broad inline script allowance.
- User-controlled review content is rendered as text, not HTML.
- Route logging avoids sensitive token paths.
- Mobile navigation and pricing links were corrected.
- Pricing, account copy, quota language, no-refund language, and unsigned Windows beta warnings were tightened.
- Blog/public page crawl now works from Windows PowerShell.
- Runtime dependency audit is clean after upgrading vulnerable packages.

## Tests and verification

- `npm test` passed.
- PostgreSQL release/security test suite passed.
- Launch regression suite passed, including concurrent free-quota send tests.
- Local browser fixture verified login, draft persistence, contributor restore, review text escaping, vault link routing, and mobile pricing navigation.
- Live public crawl passed: 42 pages, 23 blog pages, 53 internal destinations, zero broken internal destination checks, zero broken anchors.
- Recent live app logs show healthy requests and no launch-remediation errors.

## Stripe and alerts

- Stripe product prices are active and mapped:
  - Creator monthly: `$7/mo`
  - Creator annual: `$70/yr`
  - Studio monthly: `$19/mo`
  - Studio annual: `$190/yr`
- Stripe webhook is pointed at `https://app.splitsheetstudio.com/api/stripe/webhook`.
- Billing-failure metric filter and CloudWatch alarm are configured.
- Alert email subscription for `Contact@blakmarigold.com` is confirmed.

## Backup and restore

- Pre-deployment RDS snapshot exists: `sss-prelaunch-hardening-20261002`.
- Encrypted production backup completed and uploaded to S3:
  - Key: `backups/production-20261002T192159Z-encrypted.json`
  - SHA-256: `f770f7dbc3718e253912915129acf4809ad8bf3d73ec94103829af15ef745085`
  - Tables captured: `11`
  - S3 objects captured: `10`
- Durable encrypted local Proxmox copy:
  - `/backup2tb/splitsheetstudio-production/backups/production-20261002T192159Z-encrypted.json`
- Restore drill completed against an isolated temporary Postgres container:
  - Tables restored and counted: `11`
  - S3 object hashes verified: `10`
  - Backup files verified: `2`
- The restore workspace was removed after verification.

## Still needs owner action

- Do a real Google signup/login test using the public site.
- Do a real Stripe paid-plan purchase test with a card you control, then cancel from the billing portal.
- Buy and configure a Windows code-signing certificate before treating the installer/plugin as fully production-trusted on Windows.
- Save an offline copy of the Proxmox backup private key from CT103:
  - `/var/backups/splitsheetstudio-production/keys/recovery.pem`
- Decide whether to schedule the encrypted production backup as a recurring nightly ECS task.

## Remaining launch risks

- Apple login is intentionally deferred; Google-only is the current launch auth path.
- The Windows app/plugin is still unsigned until the code-signing certificate process is complete.
- Stripe Checkout has been code-verified and webhook-verified, but the final live purchase test still needs the owner to run it.
- Google OAuth is configured in code, but final fresh-user consent/sign-in should be tested by the owner.
