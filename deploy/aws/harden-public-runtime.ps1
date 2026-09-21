param(
  [string]$Region = "us-east-1",
  [string]$EnvironmentName = "staging",
  [string]$AlertEmail = "blakmarigold@gmail.com",
  [int]$BackupRetentionDays = 7,
  [int]$LogRetentionDays = 90
)

$ErrorActionPreference = "Stop"
$clusterName = "splitsheetstudio-$EnvironmentName"
$serviceName = $clusterName
$dbIdentifier = "$clusterName-db"
$logGroupName = "/ecs/$clusterName"
$targetGroupName = "$clusterName-tg"
$topicName = "splitsheetstudio-ops-alerts"

aws rds modify-db-instance --region $Region --db-instance-identifier $dbIdentifier --backup-retention-period $BackupRetentionDays --deletion-protection --auto-minor-version-upgrade --apply-immediately | Out-Null
aws logs put-retention-policy --region $Region --log-group-name $logGroupName --retention-in-days $LogRetentionDays

$topicArn = aws sns create-topic --region $Region --name $topicName --query TopicArn --output text
$subscriptions = aws sns list-subscriptions-by-topic --region $Region --topic-arn $topicArn | ConvertFrom-Json
if ($AlertEmail -and -not ($subscriptions.Subscriptions | Where-Object { $_.Endpoint -eq $AlertEmail })) {
  aws sns subscribe --region $Region --topic-arn $topicArn --protocol email --notification-endpoint $AlertEmail | Out-Null
  Write-Host "SNS confirmation sent to $AlertEmail"
}

aws cloudwatch put-metric-alarm --region $Region --alarm-name "$clusterName-ecs-cpu-high" --namespace AWS/ECS --metric-name CPUUtilization --dimensions Name=ClusterName,Value=$clusterName Name=ServiceName,Value=$serviceName --statistic Average --period 300 --evaluation-periods 2 --datapoints-to-alarm 2 --threshold 80 --comparison-operator GreaterThanOrEqualToThreshold --treat-missing-data notBreaching --alarm-actions $topicArn
aws cloudwatch put-metric-alarm --region $Region --alarm-name "$clusterName-ecs-memory-high" --namespace AWS/ECS --metric-name MemoryUtilization --dimensions Name=ClusterName,Value=$clusterName Name=ServiceName,Value=$serviceName --statistic Average --period 300 --evaluation-periods 2 --datapoints-to-alarm 2 --threshold 80 --comparison-operator GreaterThanOrEqualToThreshold --treat-missing-data notBreaching --alarm-actions $topicArn
aws cloudwatch put-metric-alarm --region $Region --alarm-name "$clusterName-rds-low-storage" --namespace AWS/RDS --metric-name FreeStorageSpace --dimensions Name=DBInstanceIdentifier,Value=$dbIdentifier --statistic Average --period 300 --evaluation-periods 1 --threshold 2147483648 --comparison-operator LessThanOrEqualToThreshold --treat-missing-data missing --alarm-actions $topicArn

$targetGroup = aws elbv2 describe-target-groups --region $Region --names $targetGroupName | ConvertFrom-Json
$targetGroupSuffix = ($targetGroup.TargetGroups[0].TargetGroupArn -split ':targetgroup/')[1]
$loadBalancerSuffix = ($targetGroup.TargetGroups[0].LoadBalancerArns[0] -split ':loadbalancer/')[1]
aws cloudwatch put-metric-alarm --region $Region --alarm-name "$clusterName-alb-target-5xx" --namespace AWS/ApplicationELB --metric-name HTTPCode_Target_5XX_Count --dimensions Name=LoadBalancer,Value=$loadBalancerSuffix Name=TargetGroup,Value="targetgroup/$targetGroupSuffix" --statistic Sum --period 300 --evaluation-periods 1 --threshold 5 --comparison-operator GreaterThanOrEqualToThreshold --treat-missing-data notBreaching --alarm-actions $topicArn

Write-Host "Public runtime hardening applied for $clusterName"
