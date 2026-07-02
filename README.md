<p align="center">
  <img src="docs/assets/github-header.svg" alt="Split Sheet Open Sign header" width="100%">
</p>

# Split Sheet Open Sign

`Split Sheet Open Sign` is a music studio workflow system built to capture split sheets, collect signatures, generate final PDFs, preserve records, and expose the same workflow through both a web app and a plugin-ready JSON API.

This repository is structured so an engineer, employer, or hiring manager can understand the product problem, the system design, and the implementation path without reverse-engineering the codebase first.

## Why this project exists
Studios often finish a session with verbal agreement on splits but no clean operational path to capture signatures, distribute copies, and preserve a trustworthy record. That creates avoidable risk at exactly the moment when everyone wants to leave the room and move on.

This project was made to solve that operational gap:

- create the split sheet immediately after the session
- collect signatures in-session or by invite link
- track who has viewed and signed
- generate a final packet
- email and archive the result

The broader product vision is simple:
- help studios move faster without losing accountability
- reduce post-session admin chaos
- create a foundation that could later grow into a public workflow product

## Who this repository is for
This repo is designed to be understandable by three audiences:

- **studio operators** who want to understand the workflow value
- **engineers** who want to evaluate the architecture and implementation choices
- **employers and hiring managers** who want to assess product thinking, systems design, and execution quality from a real project

## Architecture diagram
![Split Sheet Open Sign architecture](docs/assets/architecture-diagram.svg)

## System summary
At a high level, the system has four user-facing entry points:

- a browser-based studio workflow for creating and submitting split sheets
- a signer link workflow for tokenized invite-based completion
- an admin surface for review, reminders, and downloads
- a JUCE-based standalone/VST3 client for DAW-native access

Those entry points all converge on the same backend responsibilities:

- authentication and user ownership
- split-sheet validation rules
- signer-state transitions
- persistence
- PDF generation
- email delivery

## Why this is a strong portfolio project
This is not just a demo UI or a toy CRUD server. It is a focused systems project that shows:

- product framing around a real operations problem
- backend rules that encode domain constraints
- multiple client surfaces against one service contract
- local-first delivery with a cloud path defined
- documentation written for both technical and non-technical readers

## What it demonstrates
This repo is intentionally structured like a production-minded portfolio project, not just a prototype.

It demonstrates:
- product thinking around a niche business workflow
- backend validation for legal/business constraints
- multi-party signing flow with tokenized links
- operational features such as admin review, reminder sends, and health checks
- practical documentation for setup, security, deployment, and handoff

## Main architecture decisions
### 1. Server-rendered web app first
The browser app is built with Node.js, Express, and EJS. That keeps the stack smaller, speeds up iteration, and makes it easier to focus on workflow correctness before introducing frontend framework complexity.

### 2. Shared service layer for web and plugin clients
The app does not treat the plugin as a separate product line. Instead, the API and service layer are meant to support both the browser experience and the DAW client. That matters because the long-term product value is in consistent workflow behavior across both entry points.

### 3. Local-first persistence with a public-cloud path
SQLite is the default local persistence layer because it is fast to ship, transparent, easy to back up, and simple for single-studio use. PostgreSQL support exists as the path for managed cloud deployment later.

### 4. Workflow-specific validation over generic form handling
The app includes business rules that matter to the actual use case, especially around split percentages and signature completion states. That is more meaningful than generic form posting because it shows domain-aware engineering.

## Core feature set
- Split Sheet workflow
- Mobile-friendly drawn signatures
- Optional signer invite flow with one tokenized link per signer
- Signer state tracking: invited, viewed, reminder sent, signed
- Split validation: writer shares must total 100 and publisher shares must total 100
- Auto versioning by song title
- SQLite persistence for users, auth sessions, and submissions
- Final PDF generation in `data/pdfs/`
- Email notifications for studio + contributors + selected recipients when SMTP is configured
- Admin login for review, timeline visibility, JSON retrieval, PDF download, and reminder actions
- Audit metadata: request IP, user agent, timestamps, and checksum on final packet

## Product surfaces
### Browser app
- home / product overview
- split-sheet creation flow
- signer completion flow
- admin dashboard and artifact review

### JSON API
- registration and login
- current-user lookup
- split-sheet draft and finalize flows
- status lookups for DAW and external clients

### VST / DAW client
- JUCE-based standalone/VST3 shell in `vst/`
- authenticated API client for login and split-sheet submission
- compact multi-step UI adapted to a DAW context

## UI screenshots
### Home
![Home](docs/screenshots/ui-home.jpg)

### Split Sheet flow
![Split Sheet flow](docs/screenshots/ui-split-sheet.jpg)

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

## Repository tour
### Core app
- `server.js` — Express entry point and route orchestration
- `services/` — auth, database, submission, and split-sheet logic
- `views/` — EJS pages for the user, signer, and admin flows
- `public/` — static browser assets

### Plugin work
- `vst/` — JUCE-based standalone/VST3 client shell
- `vst/src/ApiClient.*` — plugin transport layer
- `vst/src/PluginEditor.*` — plugin UI
- `vst/src/PluginProcessor.*` — plugin processor shell

### Supporting docs
- `HIRING_MANAGER.md` — recruiter and interviewer summary
- `docs/architecture.md` — system design
- `docs/api.md` — API contract and goals
- `docs/deployment.md` — local and cloud deployment posture
- `docs/repo-tour.md` — fast repo guide for reviewers

## Local setup
1. Copy `.env.example` to `.env`
2. Fill owner, session, token, and SMTP values
3. Start the app:

```powershell
cd C:/Users/User/Documents/Openclaw/split-sheet-open-sign
npm install
npm test
npm run dev
```

Local URL: `http://localhost:5050`  
LAN URL: `http://<your-computer-ip>:5050`

## API quick view
Current API routes include:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/me`
- `GET /api/split-sheets`
- `POST /api/split-sheets/drafts`
- `PUT /api/split-sheets/:id/draft`
- `POST /api/split-sheets/validate`
- `POST /api/split-sheets`
- `GET /api/split-sheets/:id/status`

## Local database options
SQLite is the default and already validated in this repo:

```powershell
npm test
npm run dev
```

For a local PostgreSQL run:

```powershell
npm run db:postgres:setup
$env:DB_PROVIDER='postgres'
$env:DATABASE_URL='postgres://splitsheet:splitsheet@127.0.0.1:54329/splitsheet_dev?sslmode=disable'
npm run test:postgres
```

If PostgreSQL is not installed yet:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-local-postgres.ps1 -InstallIfMissing
```

## VST shell
The first plugin shell lives in `vst/`.

Build command:

```powershell
npm run vst:build
```

System requirements:
- `CMake`
- Visual Studio 2022 Build Tools with C++
- JUCE dependencies fetched by CMake at configure time

The plugin work exists because the ideal end-state is not only a browser tool. In a real studio, the fastest place to complete the workflow is often inside the DAW session itself. The `VST3` path is the first step toward that product direction.

Studio One 7 is installed on this machine, and the target `VST3` location is:
- `C:\Program Files\Common Files\VST3\SplitSheet Studio.vst3`

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
- change default owner credentials
- set a strong random `SESSION_SECRET`
- set a strong random `API_TOKEN_SECRET`
- configure `PUBLIC_BASE_URL`
- put the app behind HTTPS via reverse proxy
- restrict exposure with VPN, firewall rules, or allowlists where possible

This project is not positioned as a regulated e-sign compliance platform. It is a practical studio workflow tool with clear upgrade paths.

## Employer / hiring-manager snapshot
This repository is strong as an employer-facing project because it includes:
- runnable local setup
- screenshots and walkthrough docs
- smoke test coverage
- CI workflow
- operational docs
- security notes
- hiring-manager summary
- business-context framing, not just code
- a documented architecture path from local tool to public product
- a secondary plugin client that exercises the API from a different runtime context

## Documentation map
- Project summary: `README.md`
- Hiring-manager summary: `HIRING_MANAGER.md`
- Architecture: `docs/architecture.md`
- API foundation: `docs/api.md`
- Repository tour: `docs/repo-tour.md`
- Deployment: `docs/deployment.md`
- Ops runbook: `docs/ops.md`
- Security notes: `docs/security.md`
- Release checklist: `docs/release-checklist.md`
- QA checklist: `docs/qa-checklist.md`
- Split-sheet walkthrough: `docs/split-sheet-walkthrough.md`
- Invite-signature walkthrough: `docs/e2e-invite-flow.md`

## Recommended next upgrades
- Better plugin UX and more reliable in-session signature capture in the VST client
- Stronger admin identity model and role separation
- Structured event logging / audit export
- Reusable split templates and contributor presets
- CSV / PRO export formats
- Optional third-party e-sign integration for stricter legal/compliance needs
- Multi-tenant studio model if taken public as a SaaS

## Environment
See `.env.example` for SMTP, session, owner, and token settings.
