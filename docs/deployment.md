# Deployment

## Current deployment shape
The project now has both:
- a local-first development path
- a live AWS-hosted runtime path
- a verified `VST3` / standalone client path against the hosted API

### Live public surfaces
- `https://splitsheetstudio.com`
- `https://www.splitsheetstudio.com`
- `https://app.splitsheetstudio.com`
- `https://staging.splitsheetstudio.com`

## Local development posture

### Default local stack
- `DB_PROVIDER=sqlite`
- local filesystem storage for PDFs
- local dev URL at `http://localhost:5050`

### Local startup
```powershell
cd C:\Users\BlakM\OneDrive\Documents\Split Sheet App\repo
npm install
npm run dev
```

## Hosted AWS posture

### AWS services in use
- `Route 53`
- `ACM`
- `Application Load Balancer`
- `ECS Fargate`
- `ECR`
- `RDS PostgreSQL`
- `ElastiCache Redis`
- `S3`
- `SES`
- `Secrets Manager`
- `CloudWatch Logs`

### Hosted runtime settings
- `DB_PROVIDER=postgres`
- `SESSION_STORE=redis`
- `PDF_STORAGE=s3`
- `COOKIE_SECURE=true`
- `TRUST_PROXY=true`
- `PUBLIC_BASE_URL=https://app.splitsheetstudio.com`

### Current verified state
- live app responds on `https://app.splitsheetstudio.com/health`
- live readiness responds on `https://app.splitsheetstudio.com/api/ready`
- pricing and blog routes respond publicly
- plugin auth and email delivery were exercised end to end against the hosted service

## Persistence model

### Local
- SQLite for users and submissions
- local `data/pdfs/` for generated packets

### Hosted
- PostgreSQL for users, auth sessions, and submissions
- Redis for shared sessions
- S3 for final PDF retention and retrieval

## Email delivery

### Runtime service
- `Amazon SES`

### Current email plan
- branded sender domain: `splitsheetstudio.com`
- app sender: `no-reply@splitsheetstudio.com`
- reply-to inbox: `blakmarigold@gmail.com`
- notify inbox: `blakmarigold@gmail.com`
- support inbox: `SUPPORT_EMAIL` or fallback to notify/reply-to

### SES DNS work
The hosted zone now includes:
- SES DKIM CNAME records
- custom MAIL FROM domain records for `mail.splitsheetstudio.com`

Verification may still be propagating depending on when this document is read.

## Environment values
Typical hosted values:

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=5050
PUBLIC_BASE_URL=https://app.splitsheetstudio.com

DB_PROVIDER=postgres
DATABASE_URL=postgres://...

SESSION_STORE=redis
REDIS_URL=redis://...
REDIS_PREFIX=splitsheet:sess:

PDF_STORAGE=s3
S3_BUCKET=splitsheetstudio-staging-pdfs-309014076408-us-east-1
S3_REGION=us-east-1
S3_PREFIX=final-pdfs

COOKIE_SECURE=true
TRUST_PROXY=true
ALLOW_PUBLIC_REGISTRATION=true

FROM_EMAIL=no-reply@splitsheetstudio.com
REPLY_TO_EMAIL=blakmarigold@gmail.com
NOTIFY_EMAIL=blakmarigold@gmail.com
SUPPORT_EMAIL=blakmarigold@gmail.com

STRIPE_PLUGIN_PRICE_USD_CENTS=1000
PLUGIN_VERSION_LABEL=0.1.0
PLUGIN_DOWNLOAD_BUCKET=...
PLUGIN_DOWNLOAD_KEY=downloads/SplitSheetStudio-Setup-0.1.0.exe
```

## Deployment scripts
Key scripts live in `deploy/aws/`:
- `bootstrap-networking.ps1`
- `bootstrap-staging.ps1`
- `bootstrap-ecs.ps1`
- `bootstrap-secrets.ps1`
- `provision-datastores.ps1`
- `sync-runtime-secrets.ps1`
- `render-task-definition.ps1`
- `deploy-ecs-service.ps1`

## Deployment flow
1. provision AWS networking and shared resources
2. create secrets
3. provision RDS and Redis
4. sync runtime endpoints into Secrets Manager
5. build and push Docker image to ECR
6. render ECS task definition
7. deploy ECS service
8. attach DNS and HTTPS through Route 53 + ACM + ALB

## Operational checks
Hosted checks:
- `https://app.splitsheetstudio.com/health`
- `https://app.splitsheetstudio.com/ready`
- `https://app.splitsheetstudio.com/api/ready`

Public-entry checks:
- `https://splitsheetstudio.com`
- `https://www.splitsheetstudio.com`

## Remaining deployment hardening
- stronger release automation for plugin artifacts
- code signing for installer / binaries
- structured monitoring / alerting
- live Stripe secret and webhook provisioning
