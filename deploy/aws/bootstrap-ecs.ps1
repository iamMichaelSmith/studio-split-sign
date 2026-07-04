param(
  [string]$Region = "us-east-1",
  [string]$AppName = "splitsheetstudio",
  [string]$EnvironmentName = "staging",
  [string]$BucketName
)

$ErrorActionPreference = "Stop"

$accountId = (aws sts get-caller-identity | ConvertFrom-Json).Account
if (-not $BucketName) {
  $BucketName = "$AppName-$EnvironmentName-pdfs-$accountId-$Region"
}

$clusterName = "$AppName-$EnvironmentName"
$executionRoleName = "ecsTaskExecutionRole"
$taskRoleName = "$AppName" + "TaskRole"

function Wait-ForRole {
  param([string]$RoleName, [int]$Attempts = 10)
  for ($index = 0; $index -lt $Attempts; $index += 1) {
    try {
      aws iam get-role --role-name $RoleName | Out-Null
      return
    } catch {
      Start-Sleep -Seconds 2
    }
  }
  throw "Timed out waiting for IAM role $RoleName"
}

$trustPolicyPath = Join-Path $env:TEMP "$AppName-ecs-trust-policy.json"
@'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
'@ | Set-Content -Path $trustPolicyPath -NoNewline

$taskPolicyPath = Join-Path $env:TEMP "$AppName-ecs-task-policy.json"
@"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSplitSheetPdfBucketAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::$BucketName",
        "arn:aws:s3:::$BucketName/*"
      ]
    },
    {
      "Sid": "AllowSesDelivery",
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:ListEmailIdentities"
      ],
      "Resource": "*"
    }
  ]
}
"@ | Set-Content -Path $taskPolicyPath -NoNewline

$executionSecretsPolicyPath = Join-Path $env:TEMP "$AppName-ecs-execution-secrets-policy.json"
@"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowStagingSecretsRead",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:${Region}:${accountId}:secret:${AppName}/${EnvironmentName}/*"
      ]
    }
  ]
}
"@ | Set-Content -Path $executionSecretsPolicyPath -NoNewline

$clusterExists = $false
try {
  $existing = aws ecs describe-clusters --clusters $clusterName --region $Region | ConvertFrom-Json
  if ($existing.clusters.Count -gt 0) { $clusterExists = $true }
} catch {}
if (-not $clusterExists) {
  aws ecs create-cluster --cluster-name $clusterName --region $Region | Out-Null
}

$executionRoleExists = $true
try {
  aws iam get-role --role-name $executionRoleName | Out-Null
} catch {
  $executionRoleExists = $false
}
if (-not $executionRoleExists) {
  aws iam create-role --role-name $executionRoleName --assume-role-policy-document "file://$trustPolicyPath" | Out-Null
  Wait-ForRole -RoleName $executionRoleName
}
aws iam attach-role-policy --role-name $executionRoleName --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy | Out-Null
aws iam put-role-policy --role-name $executionRoleName --policy-name "$AppName-$EnvironmentName-execution-secrets" --policy-document "file://$executionSecretsPolicyPath" | Out-Null

$taskRoleExists = $true
try {
  aws iam get-role --role-name $taskRoleName | Out-Null
} catch {
  $taskRoleExists = $false
}
if (-not $taskRoleExists) {
  aws iam create-role --role-name $taskRoleName --assume-role-policy-document "file://$trustPolicyPath" | Out-Null
  Wait-ForRole -RoleName $taskRoleName
}
aws iam put-role-policy --role-name $taskRoleName --policy-name "$AppName-runtime-access" --policy-document "file://$taskPolicyPath" | Out-Null

Write-Host "Cluster: arn:aws:ecs:${Region}:${accountId}:cluster/$clusterName"
Write-Host "Execution role: arn:aws:iam::${accountId}:role/$executionRoleName"
Write-Host "Task role: arn:aws:iam::${accountId}:role/$taskRoleName"
