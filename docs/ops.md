# Ops Runbook

## Daily checks
- Confirm app process running
- Confirm `/health` returns ok
- Confirm SMTP is working (test submission)
- Verify backup job completed

## Common tasks
- Resend pending signer invites from Admin page
- Download final PDF packet from Admin page
- Retrieve raw JSON via `/admin/doc/:id`

## Incident response
- SMTP down: continue collecting signatures, resend later
- Lost process: restart Node process and verify `/ready`
- Data concern: restore from latest backup of `data/`
