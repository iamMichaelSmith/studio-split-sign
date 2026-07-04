param(
  [string]$Region = "us-east-1",
  [string]$AppName = "splitsheetstudio",
  [string]$EnvironmentName = "staging",
  [string]$TaskDefinitionPath = ".\\deploy\\aws\\task-definition.staging.json",
  [ValidateSet("public","private")]
  [string]$SubnetMode = "public",
  [int]$DesiredCount = 0
)

$ErrorActionPreference = "Stop"

$name = "$AppName-$EnvironmentName"
$clusterName = $name
$serviceName = $name

$subnetNames = if ($SubnetMode -eq "public") { "$name-public-a,$name-public-b" } else { "$name-private-a,$name-private-b" }
$serviceSubnets = @(
  aws ec2 describe-subnets --region $Region --filters "Name=tag:Name,Values=$subnetNames" --query "Subnets[].SubnetId" --output text
) -split "\s+" | Where-Object { $_ }
$assignPublicIp = if ($SubnetMode -eq "public") { "ENABLED" } else { "DISABLED" }
$appSg = aws ec2 describe-security-groups --region $Region --filters "Name=group-name,Values=$name-app-sg" --query "SecurityGroups[0].GroupId" --output text
$targetGroupArn = aws elbv2 describe-target-groups --region $Region --names "$name-tg" --query "TargetGroups[0].TargetGroupArn" --output text

$taskRegister = aws ecs register-task-definition --region $Region --cli-input-json "file://$TaskDefinitionPath" | ConvertFrom-Json
$taskDefinitionArn = $taskRegister.taskDefinition.taskDefinitionArn

$existingServiceArn = $null
$existingServiceStatus = $null
try {
  $serviceInfo = aws ecs describe-services --region $Region --cluster $clusterName --services $serviceName --query "services[0].{Arn:serviceArn,Status:status}" --output json 2>$null | ConvertFrom-Json
  $existingServiceArn = $serviceInfo.Arn
  $existingServiceStatus = $serviceInfo.Status
} catch {}

if (-not $existingServiceArn -or $existingServiceArn -eq "None" -or $existingServiceStatus -eq "INACTIVE") {
  aws ecs create-service `
    --region $Region `
    --cluster $clusterName `
    --service-name $serviceName `
    --task-definition $taskDefinitionArn `
    --desired-count $DesiredCount `
    --launch-type FARGATE `
    --enable-execute-command `
    --network-configuration "awsvpcConfiguration={subnets=[$($serviceSubnets -join ',')],securityGroups=[$appSg],assignPublicIp=$assignPublicIp}" `
    --load-balancers "targetGroupArn=$targetGroupArn,containerName=$name,containerPort=5050" | Out-Null
} else {
  aws ecs update-service `
    --region $Region `
    --cluster $clusterName `
    --service $serviceName `
    --task-definition $taskDefinitionArn `
    --desired-count $DesiredCount `
    --network-configuration "awsvpcConfiguration={subnets=[$($serviceSubnets -join ',')],securityGroups=[$appSg],assignPublicIp=$assignPublicIp}" `
    --force-new-deployment | Out-Null
}

Write-Host "Task Definition ARN: $taskDefinitionArn"
Write-Host "Service: $serviceName"
Write-Host "Desired count: $DesiredCount"
Write-Host "Subnet mode: $SubnetMode"
