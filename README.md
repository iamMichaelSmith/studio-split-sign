# Split Sheet Open Sign

A local-first signing workflow for music studios that need to capture split sheets, collect signatures, generate final PDFs, and keep legal records organized without waiting on generic admin tools.

## Why this project exists
Studios often finish a session with verbal agreement on splits but no clean operational path to capture signatures, distribute copies, and preserve a trustworthy record. This app turns that messy handoff into a simple workflow:

- create the split sheet immediately after the session
- collect signatures in-session or by invite link
- track who has viewed and signed
- generate a final packet
- email and archive the result

## What it demonstrates
This repo is intentionally structured like a production-minded portfolio project, not just a prototype.

It demonstrates:
- product thinking around a niche business workflow
- backend validation for legal/business constraints
- multi-party signing flow with tokenized links
- operational features such as admin review, reminder sends, and health checks
- practical documentation for setup, security, deployment, and handoff

## Core feature set
- Split Sheet workflow
- Sync Collaboration Agreement workflow
- Work for Hire Agreement workflow
- Mobile-friendly drawn signatures
- Optional signer invite flow with one tokenized link per signer
- Signer state tracking: invited, viewed, reminder sent, signed
- Split validation: writer shares must total 100 and publisher shares must total 100
- Auto versioning by song title
- Local JSON persistence in `data/submissions/*.json`
- Final PDF generation in `data/pdfs/`
- Email notifications for studio + contributors + selected recipients when SMTP is configured
- Admin login for review, timeline visibility, JSON retrieval, PDF download, and reminder actions
- Audit metadata: request IP, user agent, timestamps, and checksum on final packet

## UI screenshots
### Home
![Home](docs/screenshots/ui-home.jpg)

### Split Sheet flow
![Split Sheet flow](docs/screenshots/ui-split-sheet.jpg)

### Sync Collaboration Agreement
![Sync Collaboration Agreement](docs/screenshots/ui-sync-collab.jpg)

### Work for Hire Agreement
![Work for Hire Agreement](docs/screenshots/ui-work-for-hire.jpg)

## Main user flows
### 1. Split sheet, signed in-session
1. Open `/split-sheet`
2. Enter song details and contributors
3. Confirm shares total 100/100
4. Capture signatures in-session
5. Submit
6. Generate final PDF and email copies if SMTP is configured

### 2. Split sheet, signed by invite
1. Open `/split-sheet`
2. Enter song details and contributors
3. Enable invite-based signing
4. Submit and send unique links to each signer
5. Each signer opens `/split-sheet/sign/:id/:token`
6. Final signer completion generates the final packet automatically

### 3. Admin operations
1. Log in at `/admin/login`
2. Review all submissions
3. Open signer timeline for a split sheet
4. Copy signer links if needed
5. Send reminders to pending signers
6. Download JSON or PDF artifacts for records

## Local setup
1. Copy `.env.example` to `.env`
2. Fill admin and SMTP values
3. Start the app:

```powershell
cd C:/Users/User/Documents/Openclaw/split-sheet-open-sign
npm install
npm test
npm run dev
```

Local URL: `http://localhost:5050`  
LAN URL: `http://<your-computer-ip>:5050`

## 5-minute QA pass
For a fast confidence check:

1. Run `npm test`
2. Open `/health` and `/ready`
3. Create a split sheet with invite mode enabled
4. Open signer link #1 and sign
5. Open signer link #2 and sign
6. Confirm:
   - admin timeline updates correctly
   - reminder button appears only while signers are pending
   - final PDF downloads
   - email flow works if SMTP is configured

For a fuller walkthrough, see `docs/qa-checklist.md` and `docs/e2e-invite-flow.md`.

## Security note
This app is ready for local use, LAN use, and controlled internal testing.

Before any real internet exposure:
- change default admin credentials
- set a strong random `SESSION_SECRET`
- configure `PUBLIC_BASE_URL`
- put the app behind HTTPS via reverse proxy
- restrict exposure with VPN, firewall rules, or allowlists where possible

This project is not positioned as a regulated e-sign compliance platform. It is a practical studio workflow tool with clear upgrade paths.

## Employment-readiness snapshot
This project is strong as a portfolio/recruiter-facing repo because it includes:
- runnable local setup
- screenshots and walkthrough docs
- smoke test coverage
- CI workflow
- operational docs
- security notes
- hiring-manager summary
- business-context framing, not just code

## Documentation map
- Project summary: `README.md`
- Hiring-manager summary: `HIRING_MANAGER.md`
- Architecture: `docs/architecture.md`
- Deployment: `docs/deployment.md`
- Ops runbook: `docs/ops.md`
- Security notes: `docs/security.md`
- Release checklist: `docs/release-checklist.md`
- QA checklist: `docs/qa-checklist.md`
- Split-sheet walkthrough: `docs/split-sheet-walkthrough.md`
- Invite-signature walkthrough: `docs/e2e-invite-flow.md`

## Recommended next upgrades
- Database-backed persistence instead of flat JSON
- Stronger admin identity model and role separation
- Structured event logging / audit export
- Reusable split templates and contributor presets
- CSV / PRO export formats
- Optional third-party e-sign integration for stricter legal/compliance needs

## Environment
See `.env.example` for SMTP, session, and admin settings.
