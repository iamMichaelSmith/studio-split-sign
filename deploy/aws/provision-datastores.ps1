param(
  [string]$Region = "us-east-1",
  [string]$AppName = "splitsheetstudio",
  [string]$EnvironmentName = "staging"
)

$ErrorActionPreference = "Stop"

function New-RandomSecret([int]$Length = 28) {
  $chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!#$%^&*()-_=+"
  -join (1..$Length | ForEach-Object { $chars[(Get-Random -Minimum 0 -Maximum $chars.Length)] })
}

function Ensure-Secret {
  param([string]$Name, [string]$Value)
  $arn = $null
  try { $arn = aws secretsmanager describe-secret --region $Region --secret-id $Name --query ARN --output text 2>$null } catch {}
  if (-not $arn -or $arn -eq "None") {
    $arn = aws secretsmanager create-secret --region $Region --name $Name --secret-string $Value --query ARN --output text
  }
  return $arn
}

$prefix = "$AppName/$EnvironmentName"
$dbIdentifier = "$AppName-$EnvironmentName-db"
$dbName = "splitsheetstaging"
$dbUsername = "splitsheet"
$dbSubnetGroupName = "$AppName-$EnvironmentName-db-subnets"
$dbSecurityGroupId = aws ec2 describe-security-groups --region $Region --filters "Name=group-name,Values=$AppName-$EnvironmentName-db-sg" --query "SecurityGroups[0].GroupId" --output text

$dbStatus = $null
try {
  $dbStatus = aws rds describe-db-instances --region $Region --db-instance-identifier $dbIdentifier --query "DBInstances[0].DBInstanceStatus" --output text 2>$null
} catch {}
if (-not $dbStatus -or $dbStatus -eq "None") {
  $dbPassword = New-RandomSecret 24
  $dbPasswordSecretName = "$prefix/rds-master-password"
  $dbPasswordArn = Ensure-Secret -Name $dbPasswordSecretName -Value $dbPassword
  aws secretsmanager put-secret-value --region $Region --secret-id $dbPasswordSecretName --secret-string $dbPassword | Out-Null
  aws rds create-db-instance `
    --region $Region `
    --db-instance-identifier $dbIdentifier `
    --db-instance-class db.t4g.micro `
    --engine postgres `
    --master-username $dbUsername `
    --master-user-password $dbPassword `
    --allocated-storage 20 `
    --storage-type gp2 `
    --db-name $dbName `
    --db-subnet-group-name $dbSubnetGroupName `
    --vpc-security-group-ids $dbSecurityGroupId `
    --backup-retention-period 1 `
    --no-publicly-accessible `
    --storage-encrypted `
    --no-multi-az `
    --no-auto-minor-version-upgrade | Out-Null
  $dbStatus = aws rds describe-db-instances --region $Region --db-instance-identifier $dbIdentifier --query "DBInstances[0].DBInstanceStatus" --output text
}

$cacheIdentifier = "$AppName-$EnvironmentName-redis"
$cacheSubnetGroupName = "$AppName-$EnvironmentName-cache-subnets"
$cacheSecurityGroupId = aws ec2 describe-security-groups --region $Region --filters "Name=group-name,Values=$AppName-$EnvironmentName-redis-sg" --query "SecurityGroups[0].GroupId" --output text
$cacheStatus = $null
try {
  $cacheStatus = aws elasticache describe-cache-clusters --region $Region --cache-cluster-id $cacheIdentifier --show-cache-node-info --query "CacheClusters[0].CacheClusterStatus" --output text 2>$null
} catch {}
if (-not $cacheStatus -or $cacheStatus -eq "None") {
  aws elasticache create-cache-cluster `
    --region $Region `
    --cache-cluster-id $cacheIdentifier `
    --engine redis `
    --cache-node-type cache.t4g.micro `
    --num-cache-nodes 1 `
    --cache-subnet-group-name $cacheSubnetGroupName `
    --security-group-ids $cacheSecurityGroupId `
    --preferred-availability-zone us-east-1a | Out-Null
  $cacheStatus = "creating"
}

Write-Host "RDS identifier: $dbIdentifier ($dbStatus)"
Write-Host "Redis identifier: $cacheIdentifier ($cacheStatus)"
