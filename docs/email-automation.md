# Email Automation Handoff

Split Sheet Studio stores email contacts in its own database so an external automation platform can be connected later without changing the signup or contributor workflow.

## Contact Rules

- Account holders and contributors are recorded as `transactional_only` unless they explicitly opt into marketing.
- Newsletter and other marketing messages may only target contacts whose `marketing_status` is `subscribed`.
- Transactional messages, including invitations, signature requests, completion notices, password resets, and account security notices, do not require marketing consent.
- An unsubscribe changes the contact to `unsubscribed`; later transactional activity must not silently resubscribe that address.
- A previously unsubscribed contact may subscribe again only through a new explicit opt-in action.

## n8n Export Workflow

Use the token-protected API endpoint for automation:

```text
GET https://app.splitsheetstudio.com/api/admin/marketing-contacts
Authorization: Bearer <CONTACT_EXPORT_TOKEN>
```

The default response includes only contacts where `marketingStatus = "subscribed"`.

Optional filters:

- `?status=subscribed` - marketing subscribers only; use this for normal email journeys
- `?status=transactional_only` - recorded transactional contacts without marketing consent
- `?status=unsubscribed` - suppression/audit list
- `?status=all` - full operator export; do not import this whole list into marketing

n8n mapping:

1. Map `email`, `displayName`, `latestSource`, and `consentAt` into the email platform.
2. Store `unsubscribeUrl` and include it in every marketing message.
3. Keep the external subscriber ID in n8n or the email provider rather than replacing the application contact record.
4. Treat `marketing_contact_events` as the consent audit trail and never rewrite old events.

The application database remains the consent source of truth. Contributor addresses must not be imported into a promotional journey unless that contributor separately opted in.

## Connected onboarding journeys

### Beta before production

Production is on ECS revision 85. The owner approved production onboarding on October 14 after beta testing. EMAIL_JOURNEYS_ENABLED=true and EMAIL_JOURNEYS_MODE=production enable the real-day schedule. The business mailing footer is configured in ECS; the automation token is supplied by AWS Secrets Manager.

The separate beta runs on this computer at `http://192.168.1.70:5051/admin/email-journeys` with its own SQLite database and generated beta admin credentials under `.local/email-beta`. Start it with `node scripts/start-email-beta.cjs`. This computer must be awake and reachable from the n8n server at `192.168.1.120:5678` for scheduled beta emails.

- The allowlisted test address is `blakmarigold@gmail.com`.
- The beta's entire email delivery function rejects any recipient outside the allowlist, including transactional sends.
- `EMAIL_JOURNEYS_MODE=beta` enables this restriction; beta cannot start with delivery enabled and an empty allowlist.
- As of October 14, beta uses `EMAIL_JOURNEY_DAY_MINUTES=1440`: welcome immediately, then days 2, 4, 7, 10, and 14. The completed accelerated test enrollments are retained without restarting or resending. Manual previews remain available for review. Production always uses real days.
- The beta control page previews all 12 emails and can start, restart, or send the next email for either path. These are isolated sample enrollments; production users are not enrolled.
- Every test subject starts with `[BETA direct n/6]` or `[BETA invited n/6]`.
- Email headers embed one of six campaign images as a CID attachment so the beta image does not depend on external access to the local app. The Windows VST3 and skins email uses the same six-skin gallery as the website: Midnight, Neon, Electric, Blueprint, Royal, and Walnut. Every campaign hero and header logo links to https://splitsheetstudio.com.
- Both journeys use the website's `split-sheet-studio-logo.png` in the brand header, embedded separately by CID for email delivery. The shared SMTP/SES sender displays as `Split Sheet Studio` with the existing configured email address.
- The single-preview form can send any email as Free, Creator, or Studio without advancing either campaign. Preview subjects identify the plan and email number.

Generate the separate beta workflow files with `node scripts/build-onboarding-workflows.cjs --beta`. Their HTTP URLs point at the local beta, and their schedule checks every minute. The credential's allowed domains must match the beta host when used for beta. Production was approved by the owner on October 14; keep future template imports unpublished until their connection is verified.

Installed beta workflows (published for mailbox-only testing):

- Direct: `http://192.168.1.120:5678/workflow/DbQ1YdZIJdhCQIdX`
- Invited: `http://192.168.1.120:5678/workflow/nXtIHWWl72VIYmgB`

Production workflows are `RQ1Stni5Vg6tEDtf` (direct) and `V7uedCtC8gMzmg5d` (invited). They call the production endpoints every 15 minutes with dryRun=false after a successful dry run. The existing n8n credential is restricted to the approved beta host and app.splitsheetstudio.com. The previous attempted release image/task revision 83 predates the beta safeguards and must not be used for the eventual production release; build a fresh reviewed image after beta approval.

Two n8n workflows are provided:

- `integrations/n8n/onboarding-direct.json`: people signing up directly.
- `integrations/n8n/onboarding-invited.json`: people creating an account from a valid invitation addressed to their account email.

The app persists enrollment during email/API/social signup. Invitation classification checks the token and recipient; it stores only the submission ID, never the signing token. The first enrollment wins, so repeat events cannot restart or change a journey. Existing accounts are not automatically enrolled or backfilled.

n8n runs the schedule every 15 minutes. The app checks due enrollments and sends through the **same SES/SMTP service and FROM_EMAIL used for split-sheet delivery**. No AWS keys need to be copied to n8n. n8n receives delivery counts only, not email addresses, signing URLs, or split paperwork. Signup never makes a network request to n8n; an n8n outage simply delays the next run.

Both sequences cover welcome, first action, vault, Windows VST3 and skins, approved collaborator profiles, and the next session. Planned timing is days 0, 2, 4, 7, 10, and 14, measured from the welcome delivery. Delays follow actual delivery rather than catching up with a burst after an outage. Direct signups who already sent a sheet receive progress copy instead of the first-action tutorial. Invitation links, signature status, and plan descriptions are resolved again when each email is sent. Upgrade emails wait while the invited contributor's signature is pending; the same step is checked again the next campaign day.

Campaign edition 2 uses distinct subjects, hidden inbox preview text, headlines without dashes, plain-text alternatives, one primary action per email, and campaign tracking parameters. Free users see the paid-plan invitation for Windows access. Paid users see the download action; users who have requested the installer see the skin guide. Installer requests are recorded as activity, not proof of installation. Complimentary paid access uses the paid content too.

To reproduce the artwork, build the optional `SplitSheetScreenshotRenderer` CMake target, set `SPLITSHEET_SCREENSHOT_DIR` to `.local/email-marketing-captures`, and run it. It renders the real editor without initializing audio hardware. Run `scripts/build-email-art.cjs` with `sharp` available to compose the SVG layouts and PNG email assets. Do not replace real product screenshots with invented interfaces.

Beta links intentionally point to the isolated local app. Test them on the same network. The synthetic invited journey previews contributor messaging without creating real signing credentials or paperwork. A full invitation test requires creating a real beta sheet through the beta app.

### Connection

1. Deploy the app with these changes to the intended environment.
2. Set `ONBOARDING_AUTOMATION_TOKEN` to a separate random secret of at least 32 characters. Do not reuse the session, contact export, or API signing secret. Store it in the hosting secret manager.
3. Set `EMAIL_JOURNEY_POSTAL_ADDRESS` to the business mailing address for the footer. The sender and reply-to continue using the app's existing settings.
4. Import each workflow JSON into n8n. The server currently supplied by the owner is `http://192.168.1.120:5678`.
5. In each HTTP node select a **Header Auth** credential with name `Authorization` and value `Bearer <ONBOARDING_AUTOMATION_TOKEN>`. Select the same credential in both workflows. Set each node's URL to the intended app environment; the files default to `https://app.splitsheetstudio.com`.
6. Run manually with `dryRun: true`. Confirm the counts without sending anything. A newly verified account that opted in should show as eligible in exactly one path.
7. After beta approval, set `EMAIL_JOURNEYS_MODE=production` and `EMAIL_JOURNEYS_ENABLED=true` in the production app, then set `dryRun: false` in the production HTTP nodes. Publish only after the owner approves release. Never publish a beta URL as the production workflow.

The files ship **inactive and in dry-run mode** because credentials and the deployed endpoint must be connected first. Regenerate them with `npm run n8n:build-onboarding` only when needed; regeneration overwrites the local workflow files.

### App automation API

```text
POST /api/automations/onboarding/direct/run
POST /api/automations/onboarding/invited/run
Authorization: Bearer <ONBOARDING_AUTOMATION_TOKEN>
Content-Type: application/json

{"dryRun":true,"limit":25}
```

The default is dry run. Actual delivery requires both `dryRun: false` and `EMAIL_JOURNEYS_ENABLED=true`. Missing credentials are rejected. Use this token only for these endpoints; it cannot export contacts or sign in to an account.

Every send requires an active, verified account and a current `subscribed` contact. Verification makes the welcome due immediately. Unsubscribes suppress future emails; transactional activity never resubscribes a contact. Social signup enrolls the path but does not imply marketing consent. A social user can opt in through the existing newsletter form.

### Delivery recovery

`email_journey_enrollments` stores the next step, next due time, latest delivery ID, and claim state. Atomic claims prevent concurrent n8n runs from sending the same step twice. Successful steps advance in the database and survive app restarts.

Failures whose delivery state is uncertain are marked `review`. A process interruption can leave a `sending` claim; after 15 minutes this also appears in `needsReview`. Neither case is automatically resent. The n8n results node fails the execution when review is required. Configure the instance's normal error notifications for these workflows.

Before manually recovering a row, inspect SES/SMTP delivery records for `last_message_id`, the recipient, and the attempted delivery time. If accepted, advance the step using the actual delivery time. If definitely unsent, reset only that row to pending after fixing the cause. If uncertain, leave it for review. Never reset all enrollments or automatically retry the email itself. Re-running the scheduler is safe; it will not reclaim a sending/review row.

Use `npm test` for SQLite and local SMTP coverage, and `npm run test:release:postgres` for isolated PostgreSQL coverage. Tests never send through the live AWS service.
