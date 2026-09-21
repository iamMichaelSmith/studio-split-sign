# Release Validation — September 2, 2026

## Decision

**Backend regression phase passed after fixes; unrestricted public/commercial release is not signed off.** Stripe is intentionally excluded. The owner reports successful operation on another PC; that is useful beta feedback, not evidence that every packaged build and supported host has been validated.

Changes from this validation pass are local. No Git commit, GitHub push, AWS deployment, installer installation, customer-account modification, or live test email was performed. The desktop was left undisturbed.

## Environment And Isolation

- Windows host, Node.js 24.20.0, PostgreSQL 16.14.
- SQLite databases and PostgreSQL clusters created exclusively for the tests in the OS temp directory.
- PostgreSQL bound to loopback on a random port, using a generated test password. Existing PostgreSQL services/databases were not reused or reconfigured.
- App processes launched hidden from a temporary working directory with an environment allowlist. Production `.env`, SMTP/SES credentials, database URLs, and cloud credentials are not inherited.
- Email sent through the real Nodemailer SMTP path to an in-process loopback SMTP capture server. Names and recipients use synthetic data and `example.test` addresses.
- Test-owned app and PostgreSQL processes stopped at teardown. Temporary data is retained for diagnosis.
- Docker was unavailable; the container image was not rebuilt or validated in this pass.

## Results

| Check | Result | What it establishes |
| --- | --- | --- |
| `npm test` security/auth suites | 18 passing entries, zero failures | Seven auth cases, ten HTTP cases, and their parent test entry |
| Broader `tests/smoke.cjs` | Passed | Existing public-page, authentication, draft, signing, document, usage, and update-metadata assertions |
| `npm run test:postgres` | 12 passing entries, zero failures | Ten HTTP cases, one restore case, and their parent test entry on PostgreSQL |
| `node --check server.js` | Passed | Server syntax validation |
| `npm audit --omit=dev --json` | Zero reported vulnerabilities | Known dependency advisories at scan time, not proof of overall application security |
| `git diff --check` | Passed | No whitespace errors; Git emitted line-ending conversion warnings |
| Marketing home / hosted readiness / update metadata | HTTP 200 | Read-only liveness checks against the existing deployment |
| Windows artifact inspection | Files present, all three unsigned | Installer, staged VST3, and staged standalone exist but are not signed |
| Windows installed-versus-staged check | Failed | Installed VST3 does not match the staged package; standalone hashes also differ |

Read-only hosted readiness reported PostgreSQL, email verification enabled, Stripe disabled, and version `0.1.2`. Its configuration/readiness checks do not prove real inbox delivery or deployment of this patch. The update endpoint reported latest `0.1.2` and no minimum supported version. The GitHub Actions workflow was updated to run on Node.js 22 with both database suites, but that CI execution has not been observed yet.

## Reproduced Problems Fixed Locally

1. **Verification bypass at signup:** with verification enforced, registration previously issued usable API credentials. It now withholds credentials until verification and login.
2. **Verification bypass after restart:** startup migrations marked every unverified account verified. Removed this behavior from both database adapters. The restart regression passes on SQLite and PostgreSQL.
3. **Existing API credentials ignored account eligibility:** access and refresh validation now reject inactive accounts and unverified accounts when verification is required, including credentials minted under the old behavior.
4. **Browser sessions survived password reset:** added a persistent password-change marker, saved it in browser sessions, and reject sessions whose marker no longer matches. Existing API-token revocation was preserved and tested.
5. **Session identifier reuse:** web, OAuth callback, and admin logins now regenerate the session identifier. Automated HTTP coverage exercises web/admin flows; no live OAuth provider was used.
6. **Completed-record overwrite:** final submission accepted a non-draft record as `draftId`. It now rejects already-submitted records with 409 rather than modifying the signed source.
7. **Unvalidated revision lineage:** creation now checks source existence, ownership, and completed status. Revision metadata uses the stored source version, not a client-supplied version. The prior signed record remains unchanged in the sequential regression.
8. **Account existence in recovery responses:** non-debug reset/resend API responses no longer expose per-address existence or delivery details. Existing and nonexistent addresses receive identical JSON responses. Timing-based enumeration has not been evaluated.
9. **Account email HTML:** display names are escaped in verification and reset emails; an HTML-bearing display name is covered by the integration test.
10. **Vulnerable transitive parser:** pinned the `qs` override to `6.16.0` and regenerated the lockfile. Only one installed dependency changed. Both the regular and PostgreSQL tests were rerun afterward.

The initial auth regression run reproduced three failures. Initial HTTP regression tests also reproduced unauthorized revision linkage and modification of an already completed record. Final reruns passed after the fixes.

Dependency references: the [maintainer-linked denial-of-service advisory](https://github.com/advisories/GHSA-4mjr-xmp4-gh2g) identifies `6.16.0` as patched; the [array-limit advisory](https://github.com/advisories/GHSA-x5fp-wj9c-mxmx) is also covered by the updated version. Remove the override only after the parent packages resolve a patched compatible version and regression tests pass.

## End-To-End Coverage

The HTTP suite covers signup, verification email capture, rejection before verification, restart without accidental verification, single-use verification, API login, browser login, foreign-origin rejection, safe redirect handling, admin separation, and login throttling with a Retry-After header.

For split sheets it checks totals below and above 100%, successful validation at 100%, private draft access, cross-account access/write rejection, draft submission, invalid signer tokens, required agreement, first signature remaining pending, and second signature causing completion. Captured completion mail includes both synthetic contributors and a PDF MIME attachment with a PDF header. Replaying the same signature sequentially does not send another completion email or alter the signed payload.

Revisions use a distinct record with fresh unsigned contributors. Other users cannot attach a revision to the source; pending records cannot be used as completed revision sources. Reset tests verify that the old browser cookie, API access token, refresh token, and consumed reset token no longer work and that the new password works.

The PostgreSQL restore exercise creates a custom-format dump, restores it into a second database on the disposable instance, and compares all rows in `users`, `submissions`, `auth_sessions`, `email_verification_tokens`, and `password_reset_tokens`. It does not restore production RDS, S3 PDFs, or Redis sessions, and it does not measure production recovery time.

## Deployment And Migration Notes

- Take and verify a production database backup before deploying. The auth schema adds nullable `password_changed_at`; existing user passwords and verified timestamps are preserved.
- Existing sessions without a marker remain valid only for users whose marker is still null; the first password reset causes old browser sessions to be rejected.
- Old accounts that genuinely remain unverified must use the resend-verification flow. Do not restore the removed blanket-verification migration.
- This fix cannot distinguish users who verified legitimately from users marked verified by a historical startup migration. Audit existing accounts separately; no production verification flags were changed in this run.
- Keep `AUTH_DEBUG_TOKENS=false` and `REQUIRE_EMAIL_VERIFICATION=true` in production. Public recovery responses intentionally no longer include `sent` or provider status fields unless debug mode is enabled.
- Build and deploy a versioned backend artifact, verify readiness, then perform a small authorized production test. Local test success does not change the deployed service.

## Remaining Release Gates, Excluding Stripe

### Document concurrency and delivery reliability

The current signer handler reads a document, performs asynchronous work, and saves the whole payload. Sequential signing/replay tests pass, but concurrent signatures, simultaneous resend/view updates, duplicate draft finalization, and multi-instance operation are not proven safe. This needs database-backed atomic transitions and idempotent completion/delivery behavior, followed by concurrency and failure-injection tests. Do not infer multi-user correctness from the sequential tests.

### Document-link privacy

The current PDF route is accessible using the document ID without an additional authorization or expiring download-token check. Existing smoke tests exercise that behavior; they do not certify it as the desired privacy policy. Decide and implement recipient-friendly authorized/expiring download links, including a migration for existing email links, before unrestricted promotion. Also verify pending summaries cannot be confused with fully signed final records.

### One identifiable Windows release

The locally staged installer is named `0.1.2`, but the checked staged and installed native binaries report embedded product version `0.1.0`. Installed and staged hashes differ. Rebuild from the reviewed source with consistent version metadata, create checksums, sign the binaries and installer, and repeat install/upgrade/uninstall and host tests using that exact release. The owner's second-PC success cannot be mapped to the staged release from the evidence available here.

| Artifact | SHA-256 recorded in this pass |
| --- | --- |
| Staged VST3 | `552119C0B673E251A3A1B99E7AF9D8371992EFD0FD60775016CCC0AF336A1F13` |
| Installed VST3 | `51634E411DFB7E3494777CF66942A705A684C74F864E055679E18637DC88E554` |
| Staged standalone | `619D43D565B44903E9E922E140FBA41F00054B27D9E35EF6CEE381EE536A5180` |
| Installed standalone | `891F490683BABFD1C48D5F10F68EDAEA51C5D00926025363135D073F596D83A4` |
| Installer `0.1.2` | `F7462C6CCF1A24C08DE08A730B191882CD786FA3A149EDFA4B9B2D32BECA04F0` |

### Production operations and external services

Still verify real SES delivery/bounces, an end-to-end RDS plus S3 restore, confirmed operational alerts, Redis-backed rate limiting across instances, and sustained load in a non-production environment. Real Google/Apple authorization requires provider setup and testing; those flows are not certified here. Keep optional integrations unavailable rather than displaying a login path that cannot complete.

Native resize/skin behavior, audio passthrough, project save/reopen, DAW rescan, installer UI, and accessibility/visual checks were not exercised by this backend pass. No macOS/AU compatibility claim is made. Legal review and release-policy decisions remain separate from automated technical tests.

## Recommended Next Phase

Close the concurrency and document-link privacy gates, rerun this suite plus dedicated parallel/failure tests, and then deploy the reviewed backend with a rollback plan. Separately reconcile the native build/version/package and use it for a recorded Windows release-candidate test. Keep paid/public-launch messaging on hold until those gates have evidence.
