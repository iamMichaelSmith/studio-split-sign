# Hiring Manager Snapshot

## Project summary
`split-sheet-open-sign` is a workflow tool for music studios to create split sheets, collect signatures, track signer progress, generate final PDF packets, and keep lightweight legal records organized.

This is not a toy CRUD app. It is a focused operational product built around a real workflow bottleneck.

## What this project demonstrates
### Product and systems thinking
- Identifies a narrow but real business problem in studio operations
- Turns a messy human workflow into a guided system with clear states
- Balances speed of use with legal/admin traceability

### Backend engineering
- Express server with route separation by workflow type
- Input validation around business rules such as 100/100 split totals
- Tokenized per-signer invite flow
- File artifact generation for downstream records
- Local persistence strategy designed for easy iteration

### Operational maturity
- Admin review surface
- Reminder workflow for incomplete signature sets
- Health and readiness endpoints
- Security notes, deployment notes, and release checklist
- Testable local setup for fast handoff

### Communication maturity
- README written for both technical and non-technical readers
- Architecture, deployment, ops, security, and QA docs included
- Screenshots and end-to-end walkthroughs included

## Business impact
- Reduces post-session friction after song creation
- Helps capture agreement details while context is still fresh
- Gives studios a cleaner delivery path for final paperwork
- Improves reliability of record-keeping with downloadable artifacts and audit metadata

## Technical tradeoffs
- **Local JSON persistence** was chosen for speed, transparency, and low deployment friction
- **Server-rendered EJS UI** was chosen to keep the stack simple and shipping velocity high
- **Tokenized invite links** provide practical signer routing without building a full account system
- **PDF generation at completion time** keeps artifact generation deterministic and easy to verify

## Known limitations
- Not a full regulated e-sign platform
- No database-backed audit immutability yet
- Admin auth is intentionally lightweight and should be upgraded for wider deployment
- Best suited today for local/LAN/internal studio workflows rather than public internet exposure

## Why this is portfolio-credible
Hiring managers can evaluate more than code here:
- problem selection
- ability to scope a useful MVP
- practical tradeoff decisions
- operational awareness
- documentation quality
- evidence of iterative improvement

## Good interview talking points
- Why local-first was the right starting point
- How signer state transitions were designed
- Where this should evolve next for production hardening
- How product constraints shaped architecture choices
- What would change when moving from internal tool to multi-tenant SaaS
