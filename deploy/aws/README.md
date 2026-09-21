# AWS Deployment Notes

This folder contains the AWS deployment path for `Split Sheet Studio`.

## What is already live
- domain registration: `splitsheetstudio.com`
- hosted zone in Route 53
- TLS via ACM
- ALB with HTTP -> HTTPS redirect
- ECS Fargate app runtime
- ECR image repository
- RDS PostgreSQL
- ElastiCache Redis
- S3 final PDF storage
- Secrets Manager runtime secrets
- SES domain identity, DKIM, and custom MAIL FROM verified for `splitsheetstudio.com`
- CloudWatch Logs with 90-day retention
- CloudWatch alarms and SNS operations notifications

## Public host split
- `splitsheetstudio.com` -> landing
- `www.splitsheetstudio.com` -> landing
- `app.splitsheetstudio.com` -> hosted app
- `staging.splitsheetstudio.com` -> staging alias

## Runtime environment shape
The ECS task definition is built around:
- `PUBLIC_BASE_URL=https://app.splitsheetstudio.com`
- `DB_PROVIDER=postgres`
- `SESSION_STORE=redis`
- `PDF_STORAGE=s3`
- `COOKIE_SECURE=true`
- `TRUST_PROXY=true`
- `PGSSLMODE=verify-full`
- `PG_SSL_REJECT_UNAUTHORIZED=true`
- `PG_SSL_CA_PATH=/opt/aws-rds/global-bundle.pem`
- `REQUIRE_EMAIL_VERIFICATION=true`
- `AUTH_DEBUG=false`
- `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` when checkout is live
- optional `STRIPE_CREATOR_PRICE_ID`, `STRIPE_CREATOR_ANNUAL_PRICE_ID`, `STRIPE_STUDIO_PRO_PRICE_ID`, and `STRIPE_STUDIO_ANNUAL_PRICE_ID` for fixed Stripe Price IDs

## AWS services used
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
- `CloudWatch Alarms`
- `SNS`
- `IAM`

Stripe remains an external payment processor. The app uses Stripe Checkout for Creator/Studio subscriptions, Stripe webhooks for plan updates, and Stripe Customer Portal for customer billing management. During launch, the VST plugin is included with paid packages rather than sold as a separate license.

## Script responsibilities

### Infrastructure
- `bootstrap-networking.ps1` -> VPC, subnets, security groups, subnet groups
- `bootstrap-staging.ps1` -> S3, ECR, CloudWatch log group
- `bootstrap-ecs.ps1` -> ECS cluster and IAM roles
- `bootstrap-secrets.ps1` -> initial Secrets Manager entries
- `provision-datastores.ps1` -> RDS + Redis resources
- `bootstrap-alb.ps1` -> ALB, listener, target group

### Runtime sync and deploy
- `sync-runtime-secrets.ps1` -> writes live `DATABASE_URL` and `REDIS_URL`
- `render-task-definition.ps1` -> renders task definition JSON from the template
- `deploy-ecs-service.ps1` -> registers task definition and updates service
- `harden-public-runtime.ps1` -> enables backup, storage, log-retention, alarm, and SNS safeguards

## Email settings
Current hosted defaults:
- `FROM_EMAIL=no-reply@splitsheetstudio.com`
- `REPLY_TO_EMAIL=blakmarigold@gmail.com`
- `NOTIFY_EMAIL=blakmarigold@gmail.com`

SES setup uses:
- domain identity for `splitsheetstudio.com`
- DKIM CNAME records in Route 53
- custom MAIL FROM domain: `mail.splitsheetstudio.com`

## Current operations posture

- RDS backup retention: 7 days
- RDS deletion protection: enabled
- RDS automatic minor updates: enabled
- S3 public access: blocked
- S3 server-side encryption: enabled
- S3 versioning: enabled
- CloudWatch log retention: 90 days
- alarms: ECS CPU, ECS memory, RDS free storage, and ALB target 5xx
- public container runtime: Node.js 22
- current task definition: revision 38 at the September 13, 2026 Stripe and n8n export validation

## Typical deploy commands
```powershell
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 309014076408.dkr.ecr.us-east-1.amazonaws.com
docker build -t splitsheetstudio-staging:latest .
docker tag splitsheetstudio-staging:latest 309014076408.dkr.ecr.us-east-1.amazonaws.com/splitsheetstudio-staging:latest
docker push 309014076408.dkr.ecr.us-east-1.amazonaws.com/splitsheetstudio-staging:latest
```

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy\aws\render-task-definition.ps1 `
  -EnvironmentName staging `
  -Region us-east-1 `
  -AccountId 309014076408 `
  -PublicBaseUrl https://app.splitsheetstudio.com `
  -RepositoryName splitsheetstudio-staging `
  -ImageTag latest `
  -BucketName splitsheetstudio-staging-pdfs-309014076408-us-east-1 `
  -LogGroupName /ecs/splitsheetstudio-staging

powershell -ExecutionPolicy Bypass -File .\deploy\aws\deploy-ecs-service.ps1 `
  -Region us-east-1 `
  -AppName splitsheetstudio `
  -EnvironmentName staging `
  -TaskDefinitionPath .\deploy\aws\task-definition.staging.json `
  -SubnetMode public `
  -DesiredCount 1
```

## Remaining owner and commercial-release work

- confirm the SNS email subscription sent to `blakmarigold@gmail.com`
- sign the Windows installer and binaries
- complete clean-machine and multi-DAW Windows beta testing
- complete one live end-to-end paid checkout and refund rehearsal
- configure Google and Apple OAuth only if those providers will be offered
- review legal pages with qualified counsel
- separate production naming from the current staging-named public resources when operationally convenient
- add AWS WAF when traffic or abuse justifies the additional cost
