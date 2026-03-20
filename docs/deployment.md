# Deployment

## Recommended deployment posture
This application is best deployed first as:
- local-only on a studio machine, or
- private LAN / VPN accessible tool

If exposed beyond a trusted network, place it behind a reverse proxy with HTTPS and stronger operational controls.

## Minimum environment for go-live
Set these before any real usage:
- `ADMIN_USER`
- `ADMIN_PASS`
- `SESSION_SECRET`
- `PUBLIC_BASE_URL`

For automatic email delivery, also configure:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `FROM_EMAIL`

## Local startup
```powershell
cd C:/Users/User/Documents/Openclaw/split-sheet-open-sign
npm install
npm test
npm run dev
```

## Health and readiness checks
- `GET /health` → process liveness
- `GET /ready` → lightweight readiness signal including SMTP configured state

Recommended quick verification after startup:
```powershell
Invoke-WebRequest http://localhost:5050/health
Invoke-WebRequest http://localhost:5050/ready
```

## Reverse proxy guidance
For internet-facing or semi-public use:
- terminate TLS at proxy layer
- forward to app on private port
- preserve `x-forwarded-for` and host headers
- restrict access with VPN or IP allowlist where possible

## Backup expectations
Back up these paths daily:
- `data/submissions/`
- `data/pdfs/`

If this becomes an important operational system, also back up:
- `.env` via secret-management-safe method
- deployment config
- release artifacts and screenshots for incident review

## Recommended rollout process
1. Run test suite locally
2. Verify health/readiness endpoints
3. Test one invite-sign flow end to end
4. Confirm SMTP send behavior
5. Confirm backup destination exists
6. Move users onto the app

## Production-hardening next steps
If moving beyond internal testing, prioritize:
- stronger auth
- structured log capture
- database-backed storage
- artifact/object storage strategy
- proxy-level rate limiting and access control
