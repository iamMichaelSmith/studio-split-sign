param(
  [string]$EnvironmentName = "staging",
  [string]$Region = "us-east-1",
  [string]$AccountId,
  [string]$PublicBaseUrl = "https://app.splitsheetstudio.com",
  [string]$CookieSecure = "true",
  [string]$RepositoryName = "splitsheetstudio-staging",
  [string]$ImageTag = "latest",
  [string]$BucketName,
  [string]$PluginDownloadKey = "downloads/SplitSheetStudio-Setup-0.1.2.exe",
  [string]$PluginVersionLabel = "0.1.2",
  [string]$LogGroupName = "/ecs/splitsheetstudio-staging",
  [string]$TaskExecutionRoleArn,
  [string]$TaskRoleArn,
  [string]$StripeSecretKeyArn = "",
  [string]$StripeWebhookSecretArn = "",
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
function Resolve-OptionalSecretArn([string]$SecretName, [string]$Placeholder) {
  try {
    $arn = aws secretsmanager describe-secret --region $Region --secret-id $SecretName --query ARN --output text 2>$null
    if ($arn -and $arn -ne "None") {
      return $arn
    }
  } catch {}
  return $Placeholder
}

if (-not $StripeSecretKeyArn) {
  try {
    $StripeSecretKeyArn = Resolve-SecretArn "$secretPrefix/stripe-secret-key"
  } catch {
    $StripeSecretKeyArn = "<secrets-manager-stripe-secret-key-arn>"
  }
  if (-not $StripeSecretKeyArn -or $StripeSecretKeyArn -eq "None") {
    $StripeSecretKeyArn = "<secrets-manager-stripe-secret-key-arn>"
  }
}

if (-not $StripeWebhookSecretArn) {
  try {
    $StripeWebhookSecretArn = Resolve-SecretArn "$secretPrefix/stripe-webhook-secret"
  } catch {
    $StripeWebhookSecretArn = "<secrets-manager-stripe-webhook-secret-arn>"
  }
  if (-not $StripeWebhookSecretArn -or $StripeWebhookSecretArn -eq "None") {
    $StripeWebhookSecretArn = "<secrets-manager-stripe-webhook-secret-arn>"
  }
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
  '{ "name": "PLUGIN_VERSION_LABEL", "value": "0.1.2" }' = "{ `"name`": `"PLUGIN_VERSION_LABEL`", `"value`": `"$PluginVersionLabel`" }"
  '{ "name": "PLUGIN_LATEST_VERSION_LABEL", "value": "0.1.2" }' = "{ `"name`": `"PLUGIN_LATEST_VERSION_LABEL`", `"value`": `"$PluginVersionLabel`" }"
  '{ "name": "PLUGIN_DOWNLOAD_KEY", "value": "downloads/SplitSheetStudio-Setup-0.1.2.exe" }' = "{ `"name`": `"PLUGIN_DOWNLOAD_KEY`", `"value`": `"$PluginDownloadKey`" }"
  "splitsheetstudio:latest" = "$RepositoryName`:$ImageTag"
  "/ecs/splitsheetstudio" = $LogGroupName
  "arn:aws:iam::<account-id>:role/ecsTaskExecutionRole" = $TaskExecutionRoleArn
  "arn:aws:iam::<account-id>:role/splitsheetstudioTaskRole" = $TaskRoleArn
  "<secrets-manager-database-url-arn>" = (Resolve-SecretArn "$secretPrefix/database-url")
  "<secrets-manager-session-secret-arn>" = (Resolve-SecretArn "$secretPrefix/session-secret")
  "<secrets-manager-pdf-link-secret-arn>" = (Resolve-SecretArn "$secretPrefix/pdf-link-secret")
  "<secrets-manager-redis-url-arn>" = (Resolve-SecretArn "$secretPrefix/redis-url")
  "<secrets-manager-api-token-secret-arn>" = (Resolve-SecretArn "$secretPrefix/api-token-secret")
  "<secrets-manager-admin-user-arn>" = (Resolve-SecretArn "$secretPrefix/admin-user")
  "<secrets-manager-admin-pass-arn>" = (Resolve-SecretArn "$secretPrefix/admin-pass")
  "<secrets-manager-owner-email-arn>" = (Resolve-SecretArn "$secretPrefix/owner-email")
  "<secrets-manager-owner-password-arn>" = (Resolve-SecretArn "$secretPrefix/owner-password")
  "<secrets-manager-owner-display-name-arn>" = (Resolve-SecretArn "$secretPrefix/owner-display-name")
  "<secrets-manager-contact-export-token-arn>" = (Resolve-SecretArn "$secretPrefix/contact-export-token")
  "<secrets-manager-google-client-id-arn>" = (Resolve-OptionalSecretArn "$secretPrefix/google-client-id" "<secrets-manager-google-client-id-arn>")
  "<secrets-manager-google-client-secret-arn>" = (Resolve-OptionalSecretArn "$secretPrefix/google-client-secret" "<secrets-manager-google-client-secret-arn>")
  "<secrets-manager-apple-client-id-arn>" = (Resolve-OptionalSecretArn "$secretPrefix/apple-client-id" "<secrets-manager-apple-client-id-arn>")
  "<secrets-manager-apple-team-id-arn>" = (Resolve-OptionalSecretArn "$secretPrefix/apple-team-id" "<secrets-manager-apple-team-id-arn>")
  "<secrets-manager-apple-key-id-arn>" = (Resolve-OptionalSecretArn "$secretPrefix/apple-key-id" "<secrets-manager-apple-key-id-arn>")
  "<secrets-manager-apple-private-key-arn>" = (Resolve-OptionalSecretArn "$secretPrefix/apple-private-key" "<secrets-manager-apple-private-key-arn>")
  "<secrets-manager-stripe-secret-key-arn>" = $StripeSecretKeyArn
  "<secrets-manager-stripe-webhook-secret-arn>" = $StripeWebhookSecretArn
}

foreach ($pair in $replacements.GetEnumerator()) {
  $json = $json.Replace($pair.Key, $pair.Value)
}

$taskDefinition = $json | ConvertFrom-Json
foreach ($container in $taskDefinition.containerDefinitions) {
  $container.secrets = @($container.secrets | Where-Object {
    -not (($_.valueFrom -as [string]).StartsWith("<secrets-manager-"))
  })
}
$json = $taskDefinition | ConvertTo-Json -Depth 50

$json | Set-Content -Path $OutputPath -NoNewline
Write-Host "Rendered task definition: $OutputPath"
