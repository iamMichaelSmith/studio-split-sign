param(
  [string]$EnvironmentName = "staging",
  [string]$Region = "us-east-1",
  [string]$AccountId,
  [string]$PublicBaseUrl = "https://app.splitsheetstudio.com",
  [string]$CookieSecure = "true",
  [string]$RepositoryName = "splitsheetstudio-staging",
  [string]$ImageTag = "latest",
  [string]$BucketName,
  [string]$LogGroupName = "/ecs/splitsheetstudio-staging",
  [string]$TaskExecutionRoleArn,
  [string]$TaskRoleArn,
  [string]$OutputPath = ".\\deploy\\aws\\task-definition.staging.json"
)

$ErrorActionPreference = "Stop"

if (-not $AccountId) {
  $AccountId = (aws sts get-caller-identity | ConvertFrom-Json).Account
}

if (-not $BucketName) {
  $BucketName = "splitsheetstudio-$EnvironmentName-pdfs-$AccountId-$Region"
}

if (-not $TaskExecutionRoleArn) {
  $TaskExecutionRoleArn = "arn:aws:iam::${AccountId}:role/ecsTaskExecutionRole"
}

if (-not $TaskRoleArn) {
  $TaskRoleArn = "arn:aws:iam::${AccountId}:role/splitsheetstudioTaskRole"
}

$secretPrefix = "splitsheetstudio/$EnvironmentName"
function Resolve-SecretArn([string]$SecretName) {
  aws secretsmanager describe-secret --region $Region --secret-id $SecretName --query ARN --output text
}

$templatePath = Join-Path $PSScriptRoot "task-definition.template.json"
$json = Get-Content $templatePath -Raw

$replacements = @{
  "<account-id>" = $AccountId
  "<region>" = $Region
  "splitsheetstudio-app" = "splitsheetstudio-$EnvironmentName"
  "https://app.splitsheetstudio.com" = $PublicBaseUrl
  '{ "name": "COOKIE_SECURE", "value": "true" }' = "{ `"name`": `"COOKIE_SECURE`", `"value`": `"$CookieSecure`" }"
  "splitsheetstudio-production-pdfs" = $BucketName
  "splitsheetstudio:latest" = "$RepositoryName`:$ImageTag"
  "/ecs/splitsheetstudio" = $LogGroupName
  "arn:aws:iam::<account-id>:role/ecsTaskExecutionRole" = $TaskExecutionRoleArn
  "arn:aws:iam::<account-id>:role/splitsheetstudioTaskRole" = $TaskRoleArn
  "<secrets-manager-database-url-arn>" = (Resolve-SecretArn "$secretPrefix/database-url")
  "<secrets-manager-session-secret-arn>" = (Resolve-SecretArn "$secretPrefix/session-secret")
  "<secrets-manager-redis-url-arn>" = (Resolve-SecretArn "$secretPrefix/redis-url")
  "<secrets-manager-api-token-secret-arn>" = (Resolve-SecretArn "$secretPrefix/api-token-secret")
  "<secrets-manager-admin-user-arn>" = (Resolve-SecretArn "$secretPrefix/admin-user")
  "<secrets-manager-admin-pass-arn>" = (Resolve-SecretArn "$secretPrefix/admin-pass")
  "<secrets-manager-owner-email-arn>" = (Resolve-SecretArn "$secretPrefix/owner-email")
  "<secrets-manager-owner-password-arn>" = (Resolve-SecretArn "$secretPrefix/owner-password")
  "<secrets-manager-owner-display-name-arn>" = (Resolve-SecretArn "$secretPrefix/owner-display-name")
}

foreach ($pair in $replacements.GetEnumerator()) {
  $json = $json.Replace($pair.Key, $pair.Value)
}

$json | Set-Content -Path $OutputPath -NoNewline
Write-Host "Rendered task definition: $OutputPath"
