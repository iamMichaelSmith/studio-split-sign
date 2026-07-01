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

## Container startup
This repo now includes a `Dockerfile` and `docker-compose.yml`.

### First-time container run
```powershell
cd C:/path/to/repo
docker compose build
docker compose up -d
```

### Container health checks
```powershell
Invoke-WebRequest http://localhost:5050/health
Invoke-WebRequest http://localhost:5050/ready
docker compose ps
```

### Persistent data paths
The compose file keeps records outside the container by binding:
- `./data/submissions` → `/app/data/submissions`
- `./data/pdfs` → `/app/data/pdfs`

That means a container rebuild or replacement does not wipe split sheet records or PDFs.

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

## Proxmox container replacement
Use this when replacing an older split-sheet container on a Proxmox host.

### 1. Back up the old container first
- export the existing `.env`
- back up any split-sheet JSON or PDF data directories
- note the current published port and reverse-proxy target

### 2. Pull the updated repo onto the Proxmox host
```bash
cd /opt
git clone https://github.com/iamMichaelSmith/studio-split-sign.git split-sheet-app
cd split-sheet-app
```

If the repo already exists:
```bash
cd /opt/split-sheet-app
git pull origin main
```

### 3. Create the runtime env file
```bash
cp .env.example .env
```

Set at minimum:
- `ADMIN_USER`
- `ADMIN_PASS`
- `SESSION_SECRET`
- `PUBLIC_BASE_URL`
- `SES_REGION`
- `FROM_EMAIL=no-reply@blakmarigold.com`
- `REPLY_TO_EMAIL=Blakmarigold@gmail.com`
- `NOTIFY_EMAIL=Blakmarigold@gmail.com`

### 4. Build and start the new container
```bash
docker compose build
docker compose up -d
```

### 5. Verify before cutover
```bash
curl http://127.0.0.1:5050/health
curl http://127.0.0.1:5050/ready
docker compose ps
docker compose logs --tail=100
```

Expected:
- `/health` returns `ok`
- `/ready` returns `sesConfigured: true`
- container shows `healthy`

### 6. Cut over traffic
- point your reverse proxy to the new container port
- or stop the old split-sheet container if the new one is using the same external port

Example:
```bash
docker stop old-split-sheet-container
docker rm old-split-sheet-container
```

### 7. Final live check
- submit one real test split sheet
- confirm the PDF generates
- confirm emails send from `no-reply@blakmarigold.com`
- confirm both `data/submissions` and `data/pdfs` are being written on disk

## Production-hardening next steps
If moving beyond internal testing, prioritize:
- stronger auth
- structured log capture
- database-backed storage
- artifact/object storage strategy
- proxy-level rate limiting and access control
