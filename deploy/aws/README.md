# AWS Deployment Notes

This folder contains the AWS deployment path for `SplitSheet Studio`.

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
- SES domain identity setup in progress for `splitsheetstudio.com`
- CloudWatch Logs

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
- `IAM`

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

## Email settings
Current hosted defaults:
- `FROM_EMAIL=no-reply@splitsheetstudio.com`
- `REPLY_TO_EMAIL=blakmarigold@gmail.com`
- `NOTIFY_EMAIL=blakmarigold@gmail.com`

SES setup uses:
- domain identity for `splitsheetstudio.com`
- DKIM CNAME records in Route 53
- custom MAIL FROM domain: `mail.splitsheetstudio.com`

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

## What still needs work
- final SES verification confirmation
- plugin release automation
- production/staging environment separation cleanup
- WAF / rate limiting if traffic increases
- production release checklist automation
