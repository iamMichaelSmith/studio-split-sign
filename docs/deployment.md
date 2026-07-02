# Deployment

## Recommended deployment posture
Build and validate locally first, then move to cloud hosting once the API and persistence contracts are stable.

Current best use:
- local-only studio use
- private LAN / VPN access
- controlled staging environments

For a public launch, deploy behind HTTPS with stronger operational controls and a managed database/storage plan.

## Current persistence model
- user accounts, auth sessions, and split-sheet records currently live in `data/app.db` when `DB_PROVIDER=sqlite`
- generated PDFs live in `data/pdfs/`
- `data/submissions/` is retained only for legacy JSON import and backward compatibility

## Database provider configuration
Supported configuration:
- `DB_PROVIDER=sqlite` -> local/dev path, validated in this repo
- `DB_PROVIDER=postgres` -> adapter implemented, intended for managed cloud databases

Provider envs:
- `DB_PROVIDER`
- `DB_PATH`
- `DATABASE_URL`

Current local defaults:
- `DB_PROVIDER=sqlite`
- `DB_PATH=./data/app.db`

Future AWS-oriented configuration:
- `DB_PROVIDER=postgres`
- `DATABASE_URL=<managed postgres connection string>`

## Minimum environment for go-live
Set these before any real usage:
- `SESSION_SECRET`
- `API_TOKEN_SECRET`
- `PUBLIC_BASE_URL`
- `DB_PROVIDER`

For SQLite local/dev:
- `DB_PATH`

For PostgreSQL/cloud:
- `DATABASE_URL`

For initial owner bootstrap, set:
- `OWNER_EMAIL`
- `OWNER_PASSWORD`
- `OWNER_DISPLAY_NAME`

Optional registration control:
- `ALLOW_PUBLIC_REGISTRATION`

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

## Local PostgreSQL validation
This repo includes a Windows helper for the PostgreSQL path used by `tests/smoke-postgres.cjs`.

```powershell
cd C:/Users/User/Documents/Openclaw/split-sheet-open-sign
npm run db:postgres:setup
$env:DB_PROVIDER='postgres'
$env:DATABASE_URL='postgres://splitsheet:splitsheet@127.0.0.1:54329/splitsheet_dev?sslmode=disable'
npm run test:postgres
```

If PostgreSQL 16 is not installed yet:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-local-postgres.ps1 -InstallIfMissing
```

Current machine note:
- Docker Desktop is installed but not starting as of `July 1, 2026`
- Studio One 6 and Studio One 7 are installed
- `CMake` and Visual Studio Build Tools are not installed yet

## Container startup
This repo includes a `Dockerfile` and `docker-compose.yml`.

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
Invoke-WebRequest http://localhost:5050/api/ready
docker compose ps
```

## Reverse proxy guidance
For internet-facing or semi-public use:
- terminate TLS at proxy layer
- forward to app on a private port
- preserve `x-forwarded-for` and host headers
- add rate limiting at the proxy or edge layer
- restrict admin access where possible

## Backup expectations
Back up these paths daily:
- `data/app.db` when using SQLite
- `data/pdfs/`

Also back up:
- `.env` via a secret-management-safe method
- deployment configuration

## Recommended rollout process
1. Run the test suite locally
2. Verify `/health`, `/ready`, and `/api/ready`
3. Register a test account
4. Create and update a draft split sheet
5. Finalize one invite-sign flow end to end
6. Confirm SMTP send behavior
7. Confirm backups exist for the active database and `data/pdfs/`

## Public-cloud recommendation
For a serious public launch:
- keep local development on SQLite
- move cloud runtime to containers
- point the app at managed PostgreSQL
- move PDF artifacts to object storage

Recommended target architecture:
- app container on AWS ECS Express Mode or ECS/Fargate
- PostgreSQL on Amazon RDS
- PDF or object artifacts on Amazon S3
- email via Amazon SES

## Production-hardening next steps
Before full public exposure, prioritize:
- validate the PostgreSQL path against a real database
- rate limiting
- password reset and recovery
- stronger logging and monitoring
- object storage strategy for PDFs
