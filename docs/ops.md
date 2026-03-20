# Ops Runbook

## Daily checks
- confirm process is running
- confirm `/health` returns ok
- confirm `/ready` returns expected config state
- confirm at least one recent submission can still be opened from admin
- verify backup job completed successfully

## Common operator tasks
### Review signer progress
- log in at `/admin/login`
- open the relevant split sheet timeline
- inspect invited, viewed, reminded, and signed states

### Resend pending signer invites
- open split detail in admin
- use the reminder action for pending signers
- confirm banner result and last reminder run metadata

### Retrieve records
- download final PDF from admin or split PDF route
- retrieve raw JSON from `/admin/doc/:id`

## Incident response
### SMTP outage
- continue collecting signatures
- preserve records locally
- resend later when mail service is restored

### App process lost
- restart Node process
- verify `/health` and `/ready`
- test admin login and one recent record

### Data concern
- stop writing new changes if possible
- inspect `data/submissions/` and `data/pdfs/`
- restore from latest backup if corruption or loss is confirmed

## Operational maturity notes
This app is intentionally lightweight, so operators should treat backup verification and environment hygiene as part of normal operations.

Most likely future ops improvements:
- background jobs for reminders/email
- structured application logs
- centralized artifact storage
- database-backed audit and reporting
