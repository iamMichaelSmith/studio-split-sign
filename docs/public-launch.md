# Public Launch

## Current status

The hosted app, Windows installer route, Stripe subscription checkout, webhook endpoint, and customer billing portal are technically ready for controlled launch validation. The app should still be promoted as a **Windows public beta** until the installer is signed and a clean-machine DAW matrix passes.

Live and validated on September 13, 2026:

- public marketing site and hosted application
- signup, email verification, login, and password recovery
- split creation, percentage validation, remote signer invitations, finalization, PDF delivery, and revisions
- Windows standalone client and VST3 plugin against the hosted API
- Windows beta installer `0.1.2` through the public latest-download route
- private PostgreSQL, Redis, and S3 production dependencies
- SES sending with verified domain, DKIM, and custom MAIL FROM
- request security headers, secure sessions, origin checks, rate limits, and structured logs
- health/readiness checks for database, Redis, S3, and email configuration
- RDS backups/deletion protection, S3 versioning/encryption, 90-day logs, and CloudWatch alarms
- Stripe Creator and Studio launch prices, webhook endpoint, and billing portal configuration
- consented marketing-contact storage with CSV and token-protected n8n JSON export

## Launch classification

Use the wording **Windows public beta**, not final commercial release. The installer and binaries are currently unsigned, so Windows may display a trust warning. Mac, AU, and mobile builds are not public deliverables.

## Deferred until owner action

- one live paid purchase, webhook fulfillment, customer portal, cancellation, and refund rehearsal
- Google OAuth client and consent-screen configuration
- Apple Sign in with Apple identifiers, key, and redirect configuration
- trusted Windows code-signing certificate
- complete the Windows signing process in [`windows-code-signing.md`](./windows-code-signing.md)
- legal review by qualified counsel
- Google Search Console, analytics identifiers, and marketing automation credentials

## Owner actions before promotion

1. Confirm the SNS subscription email sent to `blakmarigold@gmail.com` so alarms can reach the operator.
2. Reinstall the `0.1.2` Windows beta on this computer and validate standalone plus VST3 discovery in the intended DAWs.
3. Run the installer on one clean Windows machine or VM.
4. Review every public legal page with qualified counsel.
5. Publish a support response target and an incident owner.
6. Back up the release installer and record its SHA-256 hash.

## Controlled-beta promotion

Recommended first cohort: 10-25 invited Windows users. Collect:

- Windows version and architecture
- DAW name and version
- install and plugin-rescan outcome
- signup and email-delivery outcome
- split creation and signer-completion outcome
- screenshots and logs for failures
- explicit consent before adding users or contributors to marketing automation

Do not automatically market to contributor email addresses. Contributor addresses are collected to perform the requested transaction. Marketing use requires separate, explicit consent.

## Commercial-launch gate

Before charging users, require all of the following:

- code-signed installer and binaries
- verified signed installer SHA-256 hash and clean-machine install/upgrade/uninstall pass
- successful clean-machine compatibility matrix
- live purchase, webhook fulfillment, portal, cancellation, and refund verification
- refund/support process
- legal review
- confirmed alarm delivery and practiced restore procedure
- one complete paid checkout, download, install, account, split, signer, and final-email test

## Messaging guidance

Lead with faster session closeout, clear contributor records, remote signatures, immutable revisions, and delivery of completed split sheets. Avoid implying that the product registers copyrights, pays royalties, replaces a PRO or publisher, guarantees ownership, or provides legal advice.
