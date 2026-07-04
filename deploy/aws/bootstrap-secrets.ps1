param(
  [string]$Region = "us-east-1",
  [string]$AppName = "splitsheetstudio",
  [string]$EnvironmentName = "staging",
  [string]$OwnerEmail = "blakmarigold@gmail.com",
  [string]$OwnerDisplayName = "Blak Marigold Studio",
  [string]$AdminUser = "admin"
)

$ErrorActionPreference = "Stop"

function New-RandomSecret([int]$Length = 40) {
  $chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*()-_=+"
  -join (1..$Length | ForEach-Object { $chars[(Get-Random -Minimum 0 -Maximum $chars.Length)] })
}

function Ensure-Secret {
  param(
    [string]$Name,
    [string]$Value
  )
  $arn = $null
  try {
    $arn = aws secretsmanager describe-secret --region $Region --secret-id $Name --query ARN --output text 2>$null
  } catch {}
  if (-not $arn -or $arn -eq "None") {
    $arn = aws secretsmanager create-secret --region $Region --name $Name --secret-string $Value --query ARN --output text
  }
  return $arn
}

$sessionSecret = New-RandomSecret
$apiTokenSecret = New-RandomSecret
$adminPass = New-RandomSecret 24
$ownerPass = New-RandomSecret 24

$prefix = "$AppName/$EnvironmentName"
$secretArns = [ordered]@{
  DATABASE_URL = Ensure-Secret -Name "$prefix/database-url" -Value "postgres://replace-me"
  REDIS_URL = Ensure-Secret -Name "$prefix/redis-url" -Value "redis://replace-me:6379"
  SESSION_SECRET = Ensure-Secret -Name "$prefix/session-secret" -Value $sessionSecret
  API_TOKEN_SECRET = Ensure-Secret -Name "$prefix/api-token-secret" -Value $apiTokenSecret
  ADMIN_USER = Ensure-Secret -Name "$prefix/admin-user" -Value $AdminUser
  ADMIN_PASS = Ensure-Secret -Name "$prefix/admin-pass" -Value $adminPass
  OWNER_EMAIL = Ensure-Secret -Name "$prefix/owner-email" -Value $OwnerEmail
  OWNER_PASSWORD = Ensure-Secret -Name "$prefix/owner-password" -Value $ownerPass
  OWNER_DISPLAY_NAME = Ensure-Secret -Name "$prefix/owner-display-name" -Value $OwnerDisplayName
}

Write-Host "Secrets created or verified:"
$secretArns.GetEnumerator() | ForEach-Object { Write-Host "$($_.Key): $($_.Value)" }
Write-Host ""
Write-Host "Generated staging credentials:"
Write-Host "ADMIN_USER=$AdminUser"
Write-Host "ADMIN_PASS=$adminPass"
Write-Host "OWNER_EMAIL=$OwnerEmail"
Write-Host "OWNER_PASSWORD=$ownerPass"
