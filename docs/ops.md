# Operations Runbook

## Daily checks

- Confirm `https://app.splitsheetstudio.com/health` returns HTTP 200.
- Confirm `https://app.splitsheetstudio.com/ready` reports database, session store, artifact storage, and email delivery as ready.
- Review ECS service health and the latest CloudWatch errors.
- Review failed or delayed email deliveries and pending signer workflows.
- Confirm no CloudWatch alarm is in `ALARM` or `INSUFFICIENT_DATA` unexpectedly.

## Weekly checks

- Review RDS backup status and available storage.
- Review S3 versioning and recent final-PDF artifacts.
- Review administrator and contact exports for unusual activity.
- Test one non-production split workflow and one installer download.
- Check dependency audit output and available runtime updates.

## Monitoring

The staging-named public service currently has alarms for:

- ECS CPU utilization
- ECS memory utilization
- RDS free storage
- ALB target 5xx responses

Alarm actions target `arn:aws:sns:us-east-1:309014076408:splitsheetstudio-ops-alerts`. Alarm delivery remains inactive until the operator confirms the SNS subscription email.

## Common operator tasks

### Review signer progress

1. Sign in at `/admin/login`.
2. Open the relevant split-sheet timeline.
3. Inspect invited, viewed, reminded, signed, finalized, and delivered events.

### Resend pending signer invites

1. Open the split detail in admin.
2. Use the reminder action for pending signers.
3. Confirm the banner result and last reminder metadata.

### Retrieve records

- Download the final PDF through the admin or split PDF route.
- Retrieve raw JSON from `/admin/doc/:id` when an audit export is needed.
- Preserve both the original and any linked revision; never overwrite a signed source record.

## Incident response

### Application unavailable

1. Check ALB target health, ECS events, and current task health.
2. Inspect `/ecs/splitsheetstudio-staging` logs using the request ID reported by the affected user.
3. Roll back to the previous healthy ECS task definition if the latest deployment caused the incident.
4. Verify `/health`, `/ready`, signup, login, and a recent record after recovery.

### Email delivery failure

1. Check SES identity, suppression, bounce, and complaint status.
2. Keep signature and finalization records intact while delivery is unavailable.
3. Resend the final packet from admin after delivery recovers.

### Database or storage concern

1. Stop risky deployments and avoid destructive writes.
2. Check RDS events, backup availability, and free storage.
3. Check S3 object versions before restoring or replacing an artifact.
4. Restore to an isolated environment first and validate record counts and PDFs.

### Suspected account compromise

1. Rotate the affected password and invalidate active sessions.
2. Rotate administrator, session, and API secrets when their exposure is possible.
3. Review request logs and workflow audit events.
4. Notify affected users when legally or contractually required.

## Release discipline

- Build immutable versioned images and installer artifacts.
- Deploy one revision at a time and wait for ECS stability.
- Verify readiness and public endpoints before declaring success.
- Keep at least one known-good task definition available for rollback.
- Never place production secrets in Git, images, screenshots, or support tickets.
