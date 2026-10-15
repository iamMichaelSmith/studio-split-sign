# Release Checklist

Latest signing and application validation: October 14, 2026. Windows 0.1.3 artifacts have valid timestamped signatures from Blak Marigold Pro LLC; clean-machine and multi-DAW checks remain separate gates.

## Code and app checks
- [x] `npm test` passes
- [x] `node --check server.js` passes
- [x] core pages load successfully
- [x] landing, pricing, and blog pages load successfully
- [x] invite-sign flow works end to end
- [x] admin timeline and reminder flow work
- [x] admin user detail page works
- [x] admin final-packet resend works
- [x] completed split revision link creates a new version request
- [x] plugin can sign in against hosted API
- [x] beta page download points to latest installer
- [x] Windows VST3 unsigned-test compatibility checklist passes
- [x] installer and plugin binaries are code signed with Azure Artifact Signing (October 14, 2026)
- [ ] clean-machine Windows and DAW matrix passes

## Configuration checks
- [x] admin credentials changed from defaults
- [x] strong, separate session and API secrets configured
- [x] `PUBLIC_BASE_URL` configured correctly
- [x] SES domain, DKIM, and custom MAIL FROM verified
- [x] `SUPPORT_EMAIL` configured
- [x] Stripe live keys, launch price IDs, webhook secret, and Customer Portal configured
- [x] production runtime fails closed on unsafe configuration
- [x] token-protected marketing-contact export configured for n8n

## Operational checks
- [x] RDS backup retention and deletion protection confirmed
- [x] S3 encryption, public-access block, and versioning confirmed
- [x] `/health` and `/ready` verified in deployment environment
- [x] restore path for legal records documented
- [x] plugin installer artifact path confirmed
- [x] public latest installer route confirmed
- [x] S3 installer key matches `PLUGIN_DOWNLOAD_KEY`
- [x] CloudWatch alarms target the operations SNS topic
- [ ] operations SNS email subscription confirmed by owner

## Documentation checks
- [x] README is current
- [x] docs links verified
- [x] QA checklist reflects current workflow
- [x] public launch guidance reflects actual feature set
- [x] public beta runbook reflects current installer version
- [x] Windows code-signing process is documented in [`windows-code-signing.md`](./windows-code-signing.md)

## External owner gates

- [ ] qualified legal review completed
- [ ] Google Search Console and production analytics configured
- [ ] Google OAuth credentials configured, if enabled
- [ ] Apple OAuth credentials configured, if enabled
- [ ] one live paid Stripe purchase, webhook fulfillment, billing portal, cancellation, and refund rehearsal completed
