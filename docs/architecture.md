# Architecture

## Overview
This application is a server-rendered Node.js workflow tool for creating and completing studio paperwork, with split sheets as the primary product surface.

The design goal is simple: ship a fast, reliable internal tool with enough operational maturity to be useful immediately, while leaving obvious upgrade paths toward stronger production infrastructure later.

## Stack
- Node.js
- Express
- EJS server-rendered templates
- Local JSON persistence under `data/submissions/`
- PDF generation via PDFKit
- SMTP delivery via Nodemailer
- Session-based admin auth via `express-session`

## Core workflow model
### 1. Split sheet creation
- User enters song and contributor data
- Server validates required fields
- Server validates writer and publisher shares total 100 each
- Submission is persisted as JSON
- Workflow branches into:
  - immediate completion for in-session signing, or
  - pending-signatures for invite-based signing

### 2. Invite-based signer flow
- Each contributor gets a unique signer token
- Signer opens `/split-sheet/sign/:id/:token`
- First page open stamps `viewedAt`
- Signature submission stamps `signedAt`
- When all signers complete, server generates final PDF and sends completion email if SMTP is configured

### 3. Admin flow
- Admin authenticates via session login
- Admin reviews submissions and signer progress
- Admin can inspect raw JSON, download PDFs, copy signer links, and send reminders to pending signers

## Data model
### Submission record
Each submission is stored in `data/submissions/<id>.json` and includes:
- submission id
- type
- status
- created/updated timestamps
- request metadata
- workflow payload

### Contributor signer fields
For split sheets, each contributor may include:
- identity/contact fields
- role
- share allocations
- signer token
- invite sent timestamp
- viewed timestamp
- reminder sent timestamp
- signed timestamp
- typed signature name
- signature image data

## Artifact generation
### Stored artifacts
- submission JSON: `data/submissions/<id>.json`
- split sheet final PDF: `data/pdfs/split-sheet-<id>-final.pdf`
- agreement PDF: `data/pdfs/<type>-<id>.pdf`

### Finalization behavior
When a split sheet reaches full signature completion:
- final packet is generated
- checksum is computed
- checksum is stored back into the submission payload
- PDF becomes available for download from the admin flow and split PDF route

## Reliability posture
- `/health` provides quick process liveness check
- `/ready` provides lightweight readiness info including SMTP configuration state
- SMTP is optional so the app can still preserve records even if email delivery is down
- Reminder actions are idempotent enough for internal operational use

## Security posture
Current protections are intentionally pragmatic rather than enterprise-grade:
- session auth for admin routes
- login throttling for admin login
- tokenized signer URLs
- secure-cookie option via environment config
- audit metadata on submissions and final packets

## Design tradeoffs
### Why server-rendered UI
A server-rendered EJS app keeps complexity low, startup fast, and maintenance simple for an internal operations product.

### Why local JSON persistence
Flat-file storage is transparent, easy to inspect, easy to back up, and fast to ship for single-studio use.

### Why tokenized links instead of accounts
Per-signer links remove account friction and better match the “finish the paperwork quickly” use case.

## Future evolution path
If taken beyond internal/local-first use, the most natural next steps would be:
- database-backed persistence
- stronger auth and audit controls
- background job processing for email/reminders
- object storage for artifacts
- stricter legal/compliance posture depending on target customers
