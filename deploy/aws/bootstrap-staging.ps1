param(
  [string]$Region = "us-east-1",
  [string]$AppName = "splitsheetstudio",
  [string]$EnvironmentName = "staging"
)

$ErrorActionPreference = "Stop"

$identity = aws sts get-caller-identity | ConvertFrom-Json
$accountId = $identity.Account

$bucketName = "$AppName-$EnvironmentName-pdfs-$accountId-$Region"
$repositoryName = "$AppName-$EnvironmentName"
$logGroupName = "/ecs/$AppName-$EnvironmentName"

Write-Host "Account: $accountId"
Write-Host "Region: $Region"
Write-Host "Bucket: $bucketName"
Write-Host "Repository: $repositoryName"
Write-Host "Log group: $logGroupName"

$bucketExists = $false
try {
  aws s3api head-bucket --bucket $bucketName 2>$null | Out-Null
  $bucketExists = $true
} catch {}

if (-not $bucketExists) {
  if ($Region -eq "us-east-1") {
    aws s3api create-bucket --bucket $bucketName --region $Region | Out-Null
  } else {
    aws s3api create-bucket --bucket $bucketName --region $Region --create-bucket-configuration "LocationConstraint=$Region" | Out-Null
  }
}

$bucketEncryption = Join-Path $env:TEMP "$AppName-$EnvironmentName-s3-encryption.json"
@'
{
  "Rules": [
    {
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }
  ]
}
'@ | Set-Content -Path $bucketEncryption -NoNewline

aws s3api put-bucket-versioning --bucket $bucketName --versioning-configuration Status=Enabled | Out-Null
aws s3api put-bucket-encryption --bucket $bucketName --server-side-encryption-configuration "file://$bucketEncryption" | Out-Null
aws s3api put-public-access-block --bucket $bucketName --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true | Out-Null

$repoExists = $false
try {
  aws ecr describe-repositories --repository-names $repositoryName --region $Region 2>$null | Out-Null
  $repoExists = $true
} catch {}

if (-not $repoExists) {
  aws ecr create-repository --repository-name $repositoryName --region $Region --image-scanning-configuration scanOnPush=true | Out-Null
}

$lifecyclePolicy = Join-Path $env:TEMP "$AppName-$EnvironmentName-ecr-lifecycle.json"
@'
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Keep last 10 images",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
'@ | Set-Content -Path $lifecyclePolicy -NoNewline

aws ecr put-lifecycle-policy --repository-name $repositoryName --region $Region --lifecycle-policy-text "file://$lifecyclePolicy" | Out-Null

$existingLogGroup = aws logs describe-log-groups --log-group-name-prefix $logGroupName --region $Region --query "logGroups[?logGroupName=='$logGroupName'].logGroupName" --output text
if (-not $existingLogGroup) {
  aws logs create-log-group --log-group-name $logGroupName --region $Region
}
aws logs put-retention-policy --log-group-name $logGroupName --retention-in-days 30 --region $Region | Out-Null

$repositoryUri = aws ecr describe-repositories --repository-names $repositoryName --region $Region --query "repositories[0].repositoryUri" --output text

Write-Host ""
Write-Host "Staging bootstrap complete."
Write-Host "S3 bucket: $bucketName"
Write-Host "ECR repo: $repositoryUri"
Write-Host "CloudWatch logs: $logGroupName"
