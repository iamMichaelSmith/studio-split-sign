param(
  [string]$Region = "us-east-1",
  [string]$AppName = "splitsheetstudio",
  [string]$EnvironmentName = "staging"
)

$ErrorActionPreference = "Stop"

$networkName = "$AppName-$EnvironmentName"
$dbSubnetGroupName = "$networkName-db-subnets"
$cacheSubnetGroupName = "$networkName-cache-subnets"

$azsRaw = aws ec2 describe-availability-zones --region $Region --query "AvailabilityZones[?State=='available'].ZoneName" --output text
$azs = @($azsRaw -split "\s+" | Where-Object { $_ })
if ($azs.Count -lt 2) {
  throw "Need at least two AZs in $Region"
}
$az1 = $azs[0]
$az2 = $azs[1]

function Get-TagValue($tags, $key) {
  ($tags | Where-Object { $_.Key -eq $key } | Select-Object -First 1).Value
}

$existingVpc = aws ec2 describe-vpcs --region $Region --query "Vpcs[?Tags[?Key=='Name' && Value=='$networkName-vpc']].{VpcId:VpcId,CidrBlock:CidrBlock,Tags:Tags}" --output json | ConvertFrom-Json
if ($existingVpc.Count -gt 0) {
  $vpcId = $existingVpc[0].VpcId
} else {
  $vpcId = aws ec2 create-vpc --region $Region --cidr-block 10.20.0.0/16 --query "Vpc.VpcId" --output text
  aws ec2 create-tags --region $Region --resources $vpcId --tags Key=Name,Value="$networkName-vpc" Key=Project,Value=$AppName Key=Environment,Value=$EnvironmentName | Out-Null
  aws ec2 modify-vpc-attribute --region $Region --vpc-id $vpcId --enable-dns-hostnames "Value=true" | Out-Null
  aws ec2 modify-vpc-attribute --region $Region --vpc-id $vpcId --enable-dns-support "Value=true" | Out-Null
}

$igwId = aws ec2 describe-internet-gateways --region $Region --query "InternetGateways[?Attachments[?VpcId=='$vpcId']].InternetGatewayId" --output text
if (-not $igwId) {
  $igwId = aws ec2 create-internet-gateway --region $Region --query "InternetGateway.InternetGatewayId" --output text
  aws ec2 create-tags --region $Region --resources $igwId --tags Key=Name,Value="$networkName-igw" Key=Project,Value=$AppName Key=Environment,Value=$EnvironmentName | Out-Null
  aws ec2 attach-internet-gateway --region $Region --internet-gateway-id $igwId --vpc-id $vpcId
}

function Ensure-Subnet {
  param(
    [string]$Name,
    [string]$Cidr,
    [string]$Az,
    [bool]$Public
  )
  $existing = aws ec2 describe-subnets --region $Region --filters "Name=vpc-id,Values=$vpcId" "Name=tag:Name,Values=$Name" --query "Subnets[0].SubnetId" --output text
  if ($existing -and $existing -ne "None") {
    return $existing
  }
  $subnetId = aws ec2 create-subnet --region $Region --vpc-id $vpcId --cidr-block $Cidr --availability-zone $Az --query "Subnet.SubnetId" --output text
  aws ec2 create-tags --region $Region --resources $subnetId --tags Key=Name,Value=$Name Key=Project,Value=$AppName Key=Environment,Value=$EnvironmentName | Out-Null
  if ($Public) {
    aws ec2 modify-subnet-attribute --region $Region --subnet-id $subnetId --map-public-ip-on-launch
  }
  return $subnetId
}

$publicSubnet1 = Ensure-Subnet -Name "$networkName-public-a" -Cidr "10.20.0.0/24" -Az $az1 -Public $true
$publicSubnet2 = Ensure-Subnet -Name "$networkName-public-b" -Cidr "10.20.1.0/24" -Az $az2 -Public $true
$privateSubnet1 = Ensure-Subnet -Name "$networkName-private-a" -Cidr "10.20.10.0/24" -Az $az1 -Public $false
$privateSubnet2 = Ensure-Subnet -Name "$networkName-private-b" -Cidr "10.20.11.0/24" -Az $az2 -Public $false

$publicRouteTableId = aws ec2 describe-route-tables --region $Region --filters "Name=vpc-id,Values=$vpcId" "Name=tag:Name,Values=$networkName-public-rt" --query "RouteTables[0].RouteTableId" --output text
if (-not $publicRouteTableId -or $publicRouteTableId -eq "None") {
  $publicRouteTableId = aws ec2 create-route-table --region $Region --vpc-id $vpcId --query "RouteTable.RouteTableId" --output text
  aws ec2 create-tags --region $Region --resources $publicRouteTableId --tags Key=Name,Value="$networkName-public-rt" Key=Project,Value=$AppName Key=Environment,Value=$EnvironmentName | Out-Null
}

$defaultRoute = aws ec2 describe-route-tables --region $Region --route-table-ids $publicRouteTableId --query "RouteTables[0].Routes[?DestinationCidrBlock=='0.0.0.0/0'].GatewayId" --output text
if (-not $defaultRoute) {
  aws ec2 create-route --region $Region --route-table-id $publicRouteTableId --destination-cidr-block 0.0.0.0/0 --gateway-id $igwId | Out-Null
}

foreach ($subnetId in @($publicSubnet1, $publicSubnet2)) {
  $assoc = aws ec2 describe-route-tables --region $Region --route-table-ids $publicRouteTableId --query "RouteTables[0].Associations[?SubnetId=='$subnetId'].RouteTableAssociationId" --output text
  if (-not $assoc) {
    aws ec2 associate-route-table --region $Region --route-table-id $publicRouteTableId --subnet-id $subnetId | Out-Null
  }
}

function Ensure-SecurityGroup {
  param(
    [string]$GroupName,
    [string]$Description
  )
  $existing = aws ec2 describe-security-groups --region $Region --filters "Name=vpc-id,Values=$vpcId" "Name=group-name,Values=$GroupName" --query "SecurityGroups[0].GroupId" --output text
  if ($existing -and $existing -ne "None") {
    return $existing
  }
  $groupId = aws ec2 create-security-group --region $Region --group-name $GroupName --description $Description --vpc-id $vpcId --query "GroupId" --output text
  aws ec2 create-tags --region $Region --resources $groupId --tags Key=Name,Value=$GroupName Key=Project,Value=$AppName Key=Environment,Value=$EnvironmentName | Out-Null
  return $groupId
}

$albSg = Ensure-SecurityGroup -GroupName "$networkName-alb-sg" -Description "ALB access for $networkName"
$appSg = Ensure-SecurityGroup -GroupName "$networkName-app-sg" -Description "App access for $networkName"
$dbSg = Ensure-SecurityGroup -GroupName "$networkName-db-sg" -Description "DB access for $networkName"
$redisSg = Ensure-SecurityGroup -GroupName "$networkName-redis-sg" -Description "Redis access for $networkName"

function Ensure-SgRule {
  param(
    [string]$GroupId,
    [string]$Protocol,
    [int]$FromPort,
    [int]$ToPort,
    [string]$CidrIp,
    [string]$SourceGroupId
  )
  try {
    if ($CidrIp) {
      aws ec2 authorize-security-group-ingress --region $Region --group-id $GroupId --ip-permissions "IpProtocol=$Protocol,FromPort=$FromPort,ToPort=$ToPort,IpRanges=[{CidrIp=$CidrIp,Description=ingress}]" | Out-Null
    } elseif ($SourceGroupId) {
      aws ec2 authorize-security-group-ingress --region $Region --group-id $GroupId --ip-permissions "IpProtocol=$Protocol,FromPort=$FromPort,ToPort=$ToPort,UserIdGroupPairs=[{GroupId=$SourceGroupId,Description=ingress}]" | Out-Null
    }
  } catch {
    if (-not $_.Exception.Message.Contains("InvalidPermission.Duplicate")) {
      throw
    }
  }
}

Ensure-SgRule -GroupId $albSg -Protocol tcp -FromPort 80 -ToPort 80 -CidrIp "0.0.0.0/0"
Ensure-SgRule -GroupId $albSg -Protocol tcp -FromPort 443 -ToPort 443 -CidrIp "0.0.0.0/0"
Ensure-SgRule -GroupId $appSg -Protocol tcp -FromPort 5050 -ToPort 5050 -SourceGroupId $albSg
Ensure-SgRule -GroupId $dbSg -Protocol tcp -FromPort 5432 -ToPort 5432 -SourceGroupId $appSg
Ensure-SgRule -GroupId $redisSg -Protocol tcp -FromPort 6379 -ToPort 6379 -SourceGroupId $appSg

$dbSubnetGroup = aws rds describe-db-subnet-groups --region $Region --query "DBSubnetGroups[?DBSubnetGroupName=='$dbSubnetGroupName'].DBSubnetGroupName" --output text 2>$null
if (-not $dbSubnetGroup) {
  aws rds create-db-subnet-group --region $Region --db-subnet-group-name $dbSubnetGroupName --db-subnet-group-description "$networkName database subnets" --subnet-ids $privateSubnet1 $privateSubnet2 | Out-Null
}

$cacheSubnetGroup = aws elasticache describe-cache-subnet-groups --region $Region --query "CacheSubnetGroups[?CacheSubnetGroupName=='$cacheSubnetGroupName'].CacheSubnetGroupName" --output text 2>$null
if (-not $cacheSubnetGroup) {
  aws elasticache create-cache-subnet-group --region $Region --cache-subnet-group-name $cacheSubnetGroupName --cache-subnet-group-description "$networkName cache subnets" --subnet-ids $privateSubnet1 $privateSubnet2 | Out-Null
}

Write-Host "VPC: $vpcId"
Write-Host "Public subnets: $publicSubnet1, $publicSubnet2"
Write-Host "Private subnets: $privateSubnet1, $privateSubnet2"
Write-Host "ALB SG: $albSg"
Write-Host "App SG: $appSg"
Write-Host "DB SG: $dbSg"
Write-Host "Redis SG: $redisSg"
Write-Host "RDS subnet group: $dbSubnetGroupName"
Write-Host "ElastiCache subnet group: $cacheSubnetGroupName"
