# Architecture

## Stack
- Node.js + Express
- EJS templates for server-rendered UI
- Local JSON persistence under `data/submissions`
- PDF generation via PDFKit
- SMTP delivery via Nodemailer

## Core Flows
1. Split sheet create
   - Validate contributor/legal fields
   - Validate writer/publisher totals == 100
   - Save submission JSON
   - Either invite signers or finalize immediately
2. Signer invite flow
   - One token per contributor
   - Signer opens `/split-sheet/sign/:id/:token`
   - On final signer completion, final packet is generated + emailed
3. Admin flow
   - Session-auth login
   - View submissions and signer status
   - Trigger reminders for pending signers

## Data and Artifacts
- Submission JSON: `data/submissions/<id>.json`
- Final split packet: `data/pdfs/split-sheet-<id>-final.pdf`

## Reliability Notes
- `/health` and `/ready` support process/deployment checks
- SMTP is optional; app still stores legal records locally if email unavailable
