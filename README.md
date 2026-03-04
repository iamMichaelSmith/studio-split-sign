# Split Sheet Open Sign

Fast local and LAN signing app for music paperwork.

Main goal
When a song is finished, open this app, capture splits quickly, collect signatures, and immediately send copies to all parties.

## UI Screenshots

### Home
![Home](docs/screenshots/ui-home.jpg)

### Split Sheet flow
![Split Sheet flow](docs/screenshots/ui-split-sheet.jpg)

### Sync Collaboration Agreement
![Sync Collaboration Agreement](docs/screenshots/ui-sync-collab.jpg)

### Work for Hire Agreement
![Work for Hire Agreement](docs/screenshots/ui-work-for-hire.jpg)

## Current Features
- Split Sheet
- Sync Collaboration Agreement
- Work for Hire Agreement
- Mobile friendly drawn signatures
- Split validation: Writer shares must total 100 and Publisher shares must total 100
- Auto versioning for split sheets by song title
- Local storage in `data/submissions/*.json`
- Email notifications to studio + contributors + selected recipients (if SMTP configured)
- PDF summary export for split sheets
- Admin login to review submissions and download JSON/PDF
- Audit fields: timestamp, request IP, user agent

## Fast Studio Workflow
1. Open `/split-sheet`
2. Enter song/session details
3. Add contributors
4. Use `Set equal splits for all` then adjust if needed
5. Capture typed + drawn signatures
6. Confirm recipients
7. Submit and send copies

## Setup
1. Copy `.env.example` to `.env`
2. Fill SMTP values and admin credentials
3. Run:

```powershell
cd C:/Users/User/Documents/Openclaw/split-sheet-open-sign
npm install
npm run dev
```

Local URL: `http://localhost:5050`
LAN URL: `http://<your-computer-ip>:5050`

## Important Security Note
Change default admin credentials before real use.
Do not expose this app publicly without a reverse proxy, TLS, and stronger auth.

## Recommended Next Upgrades (to make it truly industry ready)
1. Add signer invite links with per-signer token instead of one shared form
2. Add signer status timeline: pending, viewed, signed
3. Add final locked PDF packet with all signatures embedded
4. Add audit hash for tamper evidence
5. Add reusable templates for common split patterns and role presets
6. Add publishing export formats (CSV, PRO-ready fields)
7. Add cloud storage + backup strategy for legal records
8. Add optional e-sign vendor integration if you need stronger legal enforceability in some jurisdictions

## Environment
See `.env.example` for SMTP and admin settings.
