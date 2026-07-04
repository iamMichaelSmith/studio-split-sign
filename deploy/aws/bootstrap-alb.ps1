param(
  [string]$Region = "us-east-1",
  [string]$AppName = "splitsheetstudio",
  [string]$EnvironmentName = "staging"
)

$ErrorActionPreference = "Stop"

$name = "$AppName-$EnvironmentName"
$albName = "$name-alb"
$tgName = "$name-tg"

$publicSubnets = @(
  aws ec2 describe-subnets --region $Region --filters "Name=tag:Name,Values=$name-public-a,$name-public-b" --query "Subnets[].SubnetId" --output text
) -split "\s+" | Where-Object { $_ }
$vpcId = aws ec2 describe-vpcs --region $Region --filters "Name=tag:Name,Values=$name-vpc" --query "Vpcs[0].VpcId" --output text
$albSg = aws ec2 describe-security-groups --region $Region --filters "Name=group-name,Values=$name-alb-sg" --query "SecurityGroups[0].GroupId" --output text

$albArn = $null
try {
  $albArn = aws elbv2 describe-load-balancers --region $Region --names $albName --query "LoadBalancers[0].LoadBalancerArn" --output text 2>$null
} catch {}
if (-not $albArn -or $albArn -eq "None") {
  $albArn = aws elbv2 create-load-balancer --region $Region --name $albName --subnets $publicSubnets --security-groups $albSg --scheme internet-facing --type application --ip-address-type ipv4 --query "LoadBalancers[0].LoadBalancerArn" --output text
}

$albDns = aws elbv2 describe-load-balancers --region $Region --load-balancer-arns $albArn --query "LoadBalancers[0].DNSName" --output text

$targetGroupArn = $null
try {
  $targetGroupArn = aws elbv2 describe-target-groups --region $Region --names $tgName --query "TargetGroups[0].TargetGroupArn" --output text 2>$null
} catch {}
if (-not $targetGroupArn -or $targetGroupArn -eq "None") {
  $targetGroupArn = aws elbv2 create-target-group --region $Region --name $tgName --protocol HTTP --port 5050 --target-type ip --vpc-id $vpcId --health-check-protocol HTTP --health-check-path /health --health-check-port traffic-port --query "TargetGroups[0].TargetGroupArn" --output text
}

$listenerArn = aws elbv2 describe-listeners --region $Region --load-balancer-arn $albArn --query "Listeners[?Port==`80`].ListenerArn | [0]" --output text
if (-not $listenerArn -or $listenerArn -eq "None") {
  $listenerArn = aws elbv2 create-listener --region $Region --load-balancer-arn $albArn --protocol HTTP --port 80 --default-actions "Type=forward,TargetGroupArn=$targetGroupArn" --query "Listeners[0].ListenerArn" --output text
}

Write-Host "ALB ARN: $albArn"
Write-Host "ALB DNS: $albDns"
Write-Host "Target Group ARN: $targetGroupArn"
Write-Host "Listener ARN: $listenerArn"
