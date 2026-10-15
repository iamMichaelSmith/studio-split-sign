# Split Sheet Studio: Prelaunch Audit

Date: October 2, 2026

## Verdict

**Not ready for an unrestricted public paid launch.** The product has a useful core workflow, substantial educational content, working public destinations, and several good infrastructure protections. However, confirmed security, billing, entitlement, and draft-recovery defects should be fixed before inviting paying customers.

This was an audit, not a deployment. Application behavior and production configuration were not changed. No real payment was made, no real collaborator was invited, and no production customer record was modified. The existing change to `deploy/aws/task-definition.staging.json` was left untouched.

Source reviewed: commit `4a81ad4` (September 22, 2026). The running ECS task was revision 76, using image tag `20260922-4a81ad4`. Local reproductions use the checked-out source; they are not live exploitation tests.

## Scope And Evidence

- Read-only crawl of 42 public/auth-related URLs, including 23 blog posts, and checks of 53 distinct internal page/image destinations. These returned successful responses. HTTP success is not proof of a working submission or checkout.
- Browser checks of public navigation, pricing, signup, Google authorization entry, and mobile layouts. Google reached its account chooser; account consent and callback were not completed.
- Disposable local browser account: account navigation, split-sheet steps, contributor entry, equal splits, remote-signing selection, review validation, draft reload, and a harmless XSS marker.
- Existing `npm test`: 23 security/HTTP tests passed; smoke test passed.
- Existing `npm run test:release:postgres`: passed (13 reported test entries, including its parent suite), including an isolated database backup/restore check.
- Additional isolated audit reproductions against both SQLite and PostgreSQL. Emails went only to a local SMTP sink; Stripe events were signed synthetic fixtures, not live payments.
- Read-only inspection of ECS, RDS, S3, CloudWatch, SNS, SES, and the Proxmox replica and backup inventory.
- Downloaded the public Windows installer for signature inspection only; did not run it.

Reproduction artifacts:

- `public-pages.json`: public page, destination, and fragment inventory.
- `isolated-observations.json`: isolated SQLite observations.
- `isolated-observations-postgres.json`: isolated PostgreSQL observations.
- `../../../scripts/audit-launch.cjs`: synthetic account, quota, logging, and billing probes.
- `../../../scripts/audit-public-site.ps1`: read-only public crawler.

## P1: Fix Before Public Paid Launch

### 1. Contributor data can execute JavaScript in the review screen

**Confirmed locally in the browser.** An image error handler entered in a contributor role executed and replaced itself with the harmless text `AUDIT_XSS_EXECUTED` when the review rendered. User-entered song, contributor, signature-name, and recipient data are interpolated into HTML.

Evidence: `views/split-sheet.ejs:492`, `:502`, `:523`; CSP permits inline scripts at `server.js:211`. Remote signers can also supply profile strings (`server.js:3895`), which are persisted and can later be reused through approved collaborator profiles. The local sink was demonstrated; a complete remote-signer-to-owner exploit was not performed.

Impact: malicious contributor content could execute in an authenticated user's browser. HttpOnly cookies do not prevent injected JavaScript from making same-origin requests as that user.

Fix: build review and recipient elements using safe DOM APIs and `textContent`; avoid interpolation into attributes. Encode all remaining output contexts correctly. Add stored/reflected payload regression tests, then remove inline script allowances using external scripts or nonces.

### 2. Bearer signing links are written to application logs

**Confirmed in isolated application output.** Request logging records `req.path`, including the complete `/split-sheet/sign/:id/:token` path. Someone with log access can obtain an unexpired signing credential without the invitation email.

Evidence: `server.js:227`. Production application logs have 90-day retention. Revision and other token-bearing path routes need the same review.

Fix: log route templates or redact sensitive segments before logging. Check application, proxy, analytics, and error logs for equivalent leaks. Review access to existing logs and invalidate affected active links where warranted. Do not copy raw tokens into tickets or monitoring alerts.

### 3. Stripe events can grant unpaid access or remove a valid paid plan

**Confirmed with signed synthetic events locally.** A subscription `checkout.session.completed` with `payment_status: unpaid` granted Creator. A later cancellation event for an older subscription changed a user with a newer active Studio subscription back to Free.

Evidence: `server.js:1560`, `:1572`, `:2795`. Subscription metadata is trusted for the plan; the current subscription identity, current price, event age, and duplicate processing are not adequately reconciled.

This is not a webhook-signature bypass: unsigned webhook rejection passed. The flaw is handling of legitimate signed lifecycle events, including asynchronous payment and out-of-order delivery.

Fix: derive access from a verified subscription/payment state and an allowlisted price mapping. Reconcile the current subscription, handle delayed payment success/failure, track processed event IDs, and prevent stale events from overwriting newer state. Test failed payment, renewal, cancellation at period end, plan changes, duplicate delivery, and reversed event order. Stripe explicitly warns that [webhook events can arrive out of order or more than once](https://docs.stripe.com/webhooks).

### 4. Paid users can initiate an additional subscription instead of changing the existing one

**Code-confirmed risk; no real double charge attempted.** `/account/billing/checkout` always creates a new subscription checkout. It does not route an existing subscriber into a controlled subscription update, nor protect repeated checkout requests with an application-level idempotency strategy.

Evidence: `server.js:2630`. An upgrade must not leave the old recurring charge active beside a new one.

Fix: enforce one intended active subscription per account, route upgrades/downgrades through a defined update or portal flow, and test simultaneous clicks and abandoned/repeated checkout sessions. See [Stripe's subscription-limiting guidance](https://docs.stripe.com/payments/checkout/limit-subscriptions).

### 5. Monthly limits can be bypassed

**Confirmed locally.** Archiving a used split sheet changed usage from 1 to 0. On PostgreSQL, four simultaneous submissions by a Free account all returned 201, producing usage 4 against a limit of 3. SQLite happened to accept only three in the same test, so SQLite-only coverage misses the production-database race.

Evidence: `server.js:558`, `:568`, `:2149`, `:3295`; `services/plan-service.js:68`.

Usage is also based on original `createdAt` and all non-draft records, not successful completion. That conflicts with the public promise of "completed split sheets per month" and deserves month-boundary testing for older drafts.

Fix: choose and publish the precise charging rule; implement an atomic, durable usage ledger or equivalent transactional reservation. Archiving must not reset usage. Cover concurrent submissions, retries, month rollover, revisions, pending signatures, canceled work, and previously saved drafts.

### 6. Free-plan plugin restrictions are not enforced on the server

**Public download and local API behavior confirmed.** An unauthenticated request to `/downloads/plugin/latest` returned the installer. A Free account could authenticate to the same API used by the plugin and create a split sheet successfully.

Evidence: `server.js:2812`, `:3683`; `vst/src/ApiClient.cpp:124`. Hiding download links in the account interface is not an entitlement check.

Fix: protect paid downloads and paid client access server-side. Define plugin-session/entitlement handling without breaking the Free web workflow. A client-supplied header claiming "web" or "plugin" is not a security boundary. Test Free, canceled, expired, Creator, and Studio accounts against the actual installed client.

### 7. Draft autosave loses the user's work on reload

**Confirmed in the local browser.** Entered a song title, two contributors, shares, and remote-signing options. Reload restored an empty title and one blank contributor.

Evidence: `views/split-sheet.ejs:119`, `:127`, `:318`, `:635`. Initial contributor/signature-pad setup saves before restoring the old draft. Serialization also depends on field index without preserving the contributor structure. The submit handler removes the draft before the server confirms success (`:631`).

Fix: restore structured, versioned draft data before enabling autosave; reconstruct all contributors; scope drafts to the signed-in account; clear only after confirmed success. Test reload, tab close, network failure, server validation failure, changing accounts, and multiple contributors.

### 8. Email recipients do not match the selection presented to users

**Code-confirmed.** The final delivery list unconditionally includes every contributor and an operator notification inbox, then adds the selected recipients. Unchecking a contributor does not remove that person. The proposal path uses a similar recipient construction.

Evidence: `server.js:1828`, `:2216`; `views/split-sheet.ejs:492`.

Impact: packets containing personal contact details and signatures are distributed more broadly than the checkbox interface implies. Public copy says delivery goes to selected recipients.

Fix: decide whether all contributors must receive records. If so, make that mandatory behavior explicit instead of offering ineffective deselection. Remove the operator's full-packet copy unless required, authorized, and clearly disclosed; prefer metadata-only operational notifications. Make privacy text and actual delivery agree.

### 9. Production-dependency audit reports unresolved advisories

`npm audit --omit=dev --omit=optional --json` reported 3 affected packages: 2 high and 1 moderate, with 0 critical. Packages: `nodemailer`, `brace-expansion`, and `ip-address`. Nodemailer is a direct dependency (`package.json:32`).

An advisory is not proof that every reported attack is reachable in this app; dependency-path and input-flow review is still required. The scan suggested Nodemailer 10.0.13, a major-version upgrade.

Fix: patch supported versions deliberately, review changelogs and reachable paths, rebuild the production image, and retest SMTP/SES delivery, PDF generation, and the full release suite. Do not blindly run a force upgrade.

### 10. Operational alarms have no delivery subscribers

**Confirmed in AWS.** Four CloudWatch alarms were enabled and in OK state, but their `splitsheetstudio-ops-alerts` SNS topic returned an empty subscription list.

Fix: add and confirm an operator notification destination, send a test notification, and exercise an alarm. Cover webhook failures, email delivery problems, database/storage errors, and sustained HTTP failures. An alarm showing OK is not proof that anyone will receive a future incident.

## P2: Conversion, Reliability, And Release Readiness

### 11. Paid-plan selection is lost before checkout

Live "Choose Creator," "Choose Studio," and Free CTAs all lead to the same bare signup URL. Clicking Studio loses both plan intent and billing interval; signup/Google sign-in returns to the generic account flow.

Evidence: `views/pricing.ejs:78`.

Fix: preserve an allowlisted plan and billing interval through signup, verification, login, and OAuth. Show the chosen plan after authentication, then initiate checkout intentionally. Keep Free signup checkout-free.

### 12. Configured Stripe Price IDs are not selected by the deployed configuration

AWS task configuration contains four plan Price IDs, but omits `STRIPE_USE_CONFIGURED_PRICE_IDS`. Code defaults this setting to false and uses inline `price_data` instead.

Evidence: `server.js:80`, `:1531`.

This does not by itself prove checkout fails or the displayed amount is wrong. It does mean the existing Stripe catalog mapping is not the path the app currently selects.

Fix: validate the intended catalog prices, currency, recurring intervals, and live/test mode; enable the configured-price path; fail closed on missing/mismatched required prices. Confirm the exact price on actual sandbox checkout and subscription records.

### 13. Mobile navigation disappears without a replacement

At 390px width, the main product/blog/support navigation and header Sign in link were hidden. No replacement menu was present. Users can still find some destinations in the footer, but returning-user access is unnecessarily difficult.

Evidence: `public/premium.css:456`, `:473`; `views/partials/site-nav.ejs`.

Fix: add an accessible mobile menu with Pricing, Blog, Support, and Sign in, with keyboard focus handling and appropriate expanded state. Add an obvious Pricing link on desktop too.

### 14. Some navigation is technically clickable but does not do what its label promises

- The split-sheet "View vault" link goes to `/account#split-sheet-vault`; the account defaults to Overview, and the vault is on `/account?tab=vault`. Local browser testing confirmed the wrong destination. Source: `views/split-sheet.ejs:8`.
- `/blog/best-music-distribution-services-2026#practical-field-guide` has no matching anchor target.
- The footer labels the Pricing destination "DAW plugin," making pricing harder to find.

Fix these links and include fragment/tab validation, not just HTTP status checks, in future smoke tests.

### 15. Input accessibility needs a focused pass

Signup display-name, email, and password inputs had zero programmatically associated labels and no autocomplete hints in the inspected DOM. The split-sheet form has similar label associations to repair.

Fix: explicit `for`/`id` or wrapping labels, appropriate autocomplete, field-linked error messages, visible keyboard focus, and an announced validation summary. Test keyboard-only signup and signing, a screen reader, and reduced-motion preferences. No claim of WCAG conformance is made by this audit.

### 16. The distributed Windows installer is unsigned

The public installer returned `NotSigned` from `Get-AuthenticodeSignature`.

- Size: 40,743,132 bytes.
- SHA-256: `F7462C6CCF1A24C08DE08A730B191882CD786FA3A149EDFA4B9B2D32BECA04F0`.

Fix: sign and timestamp the executable/plugin artifacts and installer in the release process; verify the publisher and signatures on the distributed files. Test on a clean Windows machine. Do not solve customer installation problems by recommending global antivirus exclusions. Until then, clearly label the download as an unsigned beta; a web-only launch has a different release gate from a broad plugin launch.

### 17. Proxmox backup presence does not prove production-data recoverability

CT 103 was running and its local HTTP health check passed. The enabled daily 01:00 backup job includes CT 103. Backup inventory showed September 30, October 1, and October 2 snapshots, approximately 2.4 GB each.

However, `deploy/proxmox/README.md:43` explicitly describes this as a local replica using different data services. Production PostgreSQL and S3 need a separate backup/import flow. A focused search found no `.dump` files under the container's app or `/var/backups`; this is not an exhaustive proof that no other backup exists.

Fix: document and verify an encrypted production database export plus matching PDF/object backup, secret/config recovery, retention, off-host access, and a restore runbook. Restore into a separate environment and verify real schema compatibility, record counts, PDFs, authentication, and a signing flow. The isolated PostgreSQL restore test passed, but a production-data disaster-recovery drill was not performed.

### 18. Google-created accounts need a clear plugin sign-in path

The browser supports Google; the plugin login client uses email/password (`vst/src/ApiClient.cpp:122`). A Google-only customer should not be left guessing how to obtain plugin credentials.

Fix: confirm and document a secure password-setup flow for social-login users, or implement browser-mediated plugin authorization. Test signup with a new Google account, paid upgrade, installation, plugin login, password reset, and session revocation as one journey. This end-to-end production journey remains unverified.

## Content, Trust, And Organic Discovery

Positive observations:

- All 23 crawled blog posts returned successfully and had one H1, a meta description, and a canonical tag.
- Pricing contains 10 visible music/workflow FAQs and corresponding FAQ structured data.
- Pricing separates Free, Creator, and Studio and explains that VST access is included in paid plans.
- The copy distinguishes composition and master rights and says split sheets do not guarantee sync placement or clearance.
- The homepage reputation-style section currently contains labeled use cases, not the previously requested fabricated customer reviews. Keep that truthful distinction; collect permission-backed testimonials before presenting customer ratings.

Recommended improvements:

- Replace "Free keeps new users coming back to the website" with customer-facing value, such as "Start with three web-based split sheets each month."
- Clarify exactly when a monthly credit is consumed and when it resets; align the implementation and wording.
- Preserve blog-to-pricing-to-signup intent. Give each article a relevant CTA, then show the promised selected plan after signup.
- Document the basis for crossed-out comparison prices and what happens after launch pricing ends; avoid unsupported popularity claims such as "Studio favorite."
- Clearly separate host-format compatibility from DAWs actually tested with this beta; publish tested versions and known limitations.
- Keep author expertise, sources, updated dates, topic-specific internal links, and practical examples visible. Don't imply Google affiliation through review styling or guarantee SEO/AI rankings.
- Run mobile performance measurements, Search Console indexing checks, structured-data validation, and conversion analytics after the blocking defects are resolved. This audit did not measure field Core Web Vitals or independently fact-check every claim in every blog.

## Button And Flow Coverage

| Area | What was checked | Result / limitation |
| --- | --- | --- |
| Public page/image destinations | 53 distinct internal destinations | Successful HTTP responses; external destinations not comprehensively checked |
| Public navigation and signup CTAs | Live desktop/mobile browsing and link inventory | Working destinations; mobile navigation and plan intent issues above |
| Blog links | 23 article pages plus internal link/fragment checks | Pages load; one missing fragment target |
| Google button | Live authorization redirect | Google account chooser reached; actual consent/callback not completed |
| Email signup/login/recovery | Existing isolated security and smoke tests | Passed; real mailbox delivery not established by local sink |
| Account tabs | Overview, Vault, Collaborators, Resources, VST, Plans | Local browser navigation rendered expected views |
| Split-sheet wizard | Song/People/Send, Add contributor, equal splits, remote options, review confirmation | Core controls worked; XSS and draft loss reproduced |
| Submit/sign/PDF/revision | Existing isolated release tests | Passed baseline scenarios; not a new real-customer production transaction |
| Monthly usage | Additional isolated serial and concurrent checks | Archive and PostgreSQL race defects reproduced |
| Billing lifecycle | Signed synthetic webhook fixtures and code review | Payment-state and stale-event defects reproduced |
| Stripe Checkout/portal | Code/config inspected | No live charge, live upgrade, cancellation, or portal session completed |
| Download | Public download and Authenticode inspection | Accessible without sign-in; unsigned |
| Windows installation/DAW loading | Not executed during this audit | Clean-machine and real-DAW acceptance testing still required |
| Newsletter/support delivery | Routes and content inspected | No real subscription/support message sent; delivery not certified |

**It would be inaccurate to mark every button and every end-to-end production workflow as passed.** Coverage above distinguishes navigation, isolated behavior, source review, and untested external outcomes.

## Infrastructure Positives

- ECS desired/running tasks: 1/1; rollout completed at inspection time. A single task is a resilience limitation, not a current outage.
- Production RDS: private, encrypted, deletion protection enabled, seven-day backup retention; latest restorable time was current on the audit date.
- S3 PDF bucket: all four public-access block settings enabled; versioning enabled; AES256 encryption configured.
- Docker image uses the non-root `node` user.
- Live security response headers include CSP, HSTS, and frame protection. CSP still needs tightening as described above.
- CSRF protection is enabled in deployed configuration. Existing tests covered ownership isolation, verification, token/session revocation, unsigned webhook rejection, and several rate-limit/signature cases.
- SES production sending is enabled. This does not prove inbox placement, bounce handling, or successful delivery of every packet.

## Required Acceptance Run Before Launch

1. Fix P1 issues with regression tests. Re-run SQLite and PostgreSQL suites, browser tests, dependency audit, and production image checks.
2. In Stripe sandbox, test both paid plans with monthly/annual billing, a declined payment, delayed payment, duplicate clicks, upgrade/downgrade, renewal, cancellation, and reordered/duplicate webhooks. Verify exactly one intended subscription and correct entitlements.
3. Complete fresh email and Google signup journeys in a clean browser. Confirm plan choice survives, verification/recovery work, and returning users can sign in on mobile.
4. Send a two-person split sheet to controlled real mailboxes. Sign from desktop and phone, inspect all PDF pages, verify delivery recipients, reminders, expiry, resend, immutable originals, and revisions.
5. Enforce Free's three-per-month web-only rule and paid plugin access, including cancellation and concurrent requests.
6. Exercise draft recovery and failed submission recovery. Check keyboard accessibility and 390px/768px/desktop layouts across the important account/signing screens.
7. Verify a production-data backup restore in an isolated environment. Confirm an operator actually receives a test alarm.
8. For a plugin launch, validate signed installer artifacts on a clean Windows system and explicitly tested DAWs. Test Google-created users' plugin onboarding.
9. Then have the owner perform one deliberately authorized small live purchase, inspect the Stripe subscription and app plan, and verify self-service cancellation. Do not use a real paid customer as the first end-to-end test.
10. Begin with a small invited cohort and monitor errors, email delivery, webhook failures, and abandoned signup/checkout steps before broad promotion.

## Reproduce The Isolated Audit

From the repository directory:

```powershell
npm test
npm run test:release:postgres
node scripts/audit-launch.cjs
$env:RELEASE_TEST_POSTGRES = '1'
node scripts/audit-launch.cjs
Remove-Item Env:RELEASE_TEST_POSTGRES
npm audit --omit=dev --omit=optional
powershell -File scripts/audit-public-site.ps1
```

The audit script records observed behavior rather than asserting that the application is safe. After fixes, convert these cases into fail-on-regression release tests. Public crawling should remain low-volume and read-only.
