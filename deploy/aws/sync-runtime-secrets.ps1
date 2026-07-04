param(
  [string]$Region = "us-east-1",
  [string]$AppName = "splitsheetstudio",
  [string]$EnvironmentName = "staging"
)

$ErrorActionPreference = "Stop"

$prefix = "$AppName/$EnvironmentName"
$dbIdentifier = "$AppName-$EnvironmentName-db"
$cacheIdentifier = "$AppName-$EnvironmentName-redis"

$db = $null
try {
  $db = aws rds describe-db-instances --region $Region --db-instance-identifier $dbIdentifier --output json | ConvertFrom-Json
} catch {}

if ($db -and $db.DBInstances[0].DBInstanceStatus -eq "available") {
  $dbPassword = aws secretsmanager get-secret-value --region $Region --secret-id "$prefix/rds-master-password" --query SecretString --output text
  $dbHost = $db.DBInstances[0].Endpoint.Address
  $databaseUrl = "postgres://splitsheet:$dbPassword@$dbHost`:5432/splitsheetstaging"
  aws secretsmanager put-secret-value --region $Region --secret-id "$prefix/database-url" --secret-string $databaseUrl | Out-Null
  Write-Host "Updated DATABASE_URL secret."
} else {
  Write-Host "RDS not ready yet."
}

$cache = $null
try {
  $cache = aws elasticache describe-cache-clusters --region $Region --cache-cluster-id $cacheIdentifier --show-cache-node-info --output json | ConvertFrom-Json
} catch {}

if ($cache -and $cache.CacheClusters[0].CacheClusterStatus -eq "available") {
  $endpoint = $cache.CacheClusters[0].CacheNodes[0].Endpoint.Address
  $redisUrl = "redis://$endpoint`:6379"
  aws secretsmanager put-secret-value --region $Region --secret-id "$prefix/redis-url" --secret-string $redisUrl | Out-Null
  Write-Host "Updated REDIS_URL secret."
} else {
  Write-Host "Redis not ready yet."
}
