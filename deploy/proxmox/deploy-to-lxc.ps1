param(
  [string]$ProxmoxHost = "proxmox-host",
  [int]$Vmid = 103,
  [string]$RemoteAppDir = "/opt/split-sheet-studio",
  [string]$LegacyAppDir = "/opt/split-sheet-studio-legacy",
  [string]$PublicBaseUrl = "http://192.168.1.237:5050",
  [switch]$SyncLocalEnv
)

$ErrorActionPreference = "Stop"

function Quote-BashString {
  param([string]$Value)
  return "'" + ($Value -replace "'", "'\''") + "'"
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$stamp = Get-Date -Format "yyyyMMddHHmmss"
$archiveName = "splitsheet-$stamp.tar.gz"
$scriptName = "splitsheet-deploy-$stamp.sh"
$hostScriptName = "splitsheet-host-$stamp.sh"
$archivePath = Join-Path $env:TEMP $archiveName
$insideScriptPath = Join-Path $env:TEMP $scriptName
$hostScriptPath = Join-Path $env:TEMP $hostScriptName
$remoteArchivePath = "/tmp/$archiveName"
$remoteScriptPath = "/tmp/$scriptName"
$remoteHostScriptPath = "/tmp/$hostScriptName"
$remoteEnvPath = "/tmp/splitsheet-env-$stamp"

Write-Host "Packaging $repoRoot"

$tarExcludes = @(
  "--exclude=.git",
  "--exclude=node_modules",
  "--exclude=data",
  "--exclude=.env",
  "--exclude=.local",
  "--exclude=vst/build",
  "--exclude=vst/build-release-clean",
  "--exclude=vst/build-release",
  "--exclude=vst/build-debug",
  "--exclude=vst/cmake-build-*",
  "--exclude=vst/.cmake",
  "--exclude=vst/dist"
)

& tar -C $repoRoot @tarExcludes -czf $archivePath .
if ($LASTEXITCODE -ne 0) {
  throw "tar failed with exit code $LASTEXITCODE"
}

$syncEnvFlag = if ($SyncLocalEnv) { "1" } else { "0" }
$quotedRemoteAppDir = Quote-BashString $RemoteAppDir
$quotedLegacyAppDir = Quote-BashString $LegacyAppDir
$quotedPublicBaseUrl = Quote-BashString $PublicBaseUrl
$quotedStamp = Quote-BashString $stamp
$quotedSyncEnvFlag = Quote-BashString $syncEnvFlag

$insideScript = @"
set -eu

REMOTE_APP_DIR=$quotedRemoteAppDir
LEGACY_APP_DIR=$quotedLegacyAppDir
PUBLIC_BASE_URL=$quotedPublicBaseUrl
STAMP=$quotedStamp
SYNC_ENV=$quotedSyncEnvFlag
BACKUP_DIR="`$REMOTE_APP_DIR.backup.`$STAMP"

case "`$REMOTE_APP_DIR" in
  /opt/split-sheet-studio|/opt/split-sheet-studio/*) ;;
  *) echo "Refusing unexpected app dir: `$REMOTE_APP_DIR" >&2; exit 1 ;;
esac

if [ -d "`$LEGACY_APP_DIR" ] && [ "`$LEGACY_APP_DIR" != "`$REMOTE_APP_DIR" ]; then
  cd "`$LEGACY_APP_DIR"
  docker compose down || docker compose -f docker-compose.prod.yml down || true
  pkill -x node || true
  if [ ! -d "`$REMOTE_APP_DIR" ]; then
    [ -f .env ] && cp .env /tmp/splitsheet-preserved.env || true
    [ -d data ] && cp -a data /tmp/splitsheet-preserved-data || true
  fi
  mv "`$LEGACY_APP_DIR" "`$LEGACY_APP_DIR.backup.`$STAMP"
fi

if [ -d "`$REMOTE_APP_DIR" ]; then
  cd "`$REMOTE_APP_DIR"
  docker compose down || docker compose -f docker-compose.prod.yml down || true
  pkill -x node || true
  [ -f .env ] && cp .env /tmp/splitsheet-preserved.env || true
  [ -d data ] && cp -a data /tmp/splitsheet-preserved-data || true
  mv "`$REMOTE_APP_DIR" "`$BACKUP_DIR"
fi

mkdir -p "`$REMOTE_APP_DIR"
tar -xzf /tmp/splitsheet-current.tar.gz -C "`$REMOTE_APP_DIR"

if [ "`$SYNC_ENV" = "1" ] && [ -f /tmp/splitsheet-local.env ]; then
  cp /tmp/splitsheet-local.env "`$REMOTE_APP_DIR/.env"
elif [ -f /tmp/splitsheet-preserved.env ]; then
  cp /tmp/splitsheet-preserved.env "`$REMOTE_APP_DIR/.env"
elif [ -f "`$REMOTE_APP_DIR/.env.example" ]; then
  cp "`$REMOTE_APP_DIR/.env.example" "`$REMOTE_APP_DIR/.env"
fi

if [ -d /tmp/splitsheet-preserved-data ]; then
  cp -a /tmp/splitsheet-preserved-data "`$REMOTE_APP_DIR/data"
else
  mkdir -p "`$REMOTE_APP_DIR/data"
fi

touch "`$REMOTE_APP_DIR/.env"
if grep -q "^PUBLIC_BASE_URL=" "`$REMOTE_APP_DIR/.env"; then
  sed -i "s|^PUBLIC_BASE_URL=.*|PUBLIC_BASE_URL=`$PUBLIC_BASE_URL|" "`$REMOTE_APP_DIR/.env"
else
  printf "\nPUBLIC_BASE_URL=%s\n" "`$PUBLIC_BASE_URL" >> "`$REMOTE_APP_DIR/.env"
fi

if grep -q "^PORT=" "`$REMOTE_APP_DIR/.env"; then
  sed -i "s|^PORT=.*|PORT=5050|" "`$REMOTE_APP_DIR/.env"
else
  printf "PORT=5050\n" >> "`$REMOTE_APP_DIR/.env"
fi

if grep -q "^HOST=" "`$REMOTE_APP_DIR/.env"; then
  sed -i "s|^HOST=.*|HOST=0.0.0.0|" "`$REMOTE_APP_DIR/.env"
else
  printf "HOST=0.0.0.0\n" >> "`$REMOTE_APP_DIR/.env"
fi

cat > "`$REMOTE_APP_DIR/docker-compose.override.yml" <<YAML
services:
  split-sheet:
    build:
      args:
        INSTALL_OPTIONAL_DEPS: "true"
    environment:
      NODE_ENV: development
      PUBLIC_BASE_URL: "`$PUBLIC_BASE_URL"
      DB_PROVIDER: sqlite
      DATABASE_URL: ""
      SESSION_STORE: memory
      REDIS_URL: ""
      COOKIE_SECURE: "false"
      TRUST_PROXY: "false"
      CSRF_PROTECTION_ENABLED: "false"
      PDF_STORAGE: local
      S3_BUCKET: ""
      REQUIRE_EMAIL_VERIFICATION: "false"
      ALLOW_PUBLIC_REGISTRATION: "true"
      PGSSLMODE: disable
      PG_SSL_REJECT_UNAUTHORIZED: "false"
YAML

cd "`$REMOTE_APP_DIR"
docker compose up -d --build
docker compose ps
"@

[System.IO.File]::WriteAllText(
  $insideScriptPath,
  $insideScript.Replace("`r`n", "`n"),
  [System.Text.Encoding]::ASCII
)

try {
  Write-Host "Uploading archive to $ProxmoxHost"
  & scp $archivePath "${ProxmoxHost}:$remoteArchivePath"
  if ($LASTEXITCODE -ne 0) {
    throw "scp archive failed with exit code $LASTEXITCODE"
  }

  Write-Host "Uploading deploy script to $ProxmoxHost"
  & scp $insideScriptPath "${ProxmoxHost}:$remoteScriptPath"
  if ($LASTEXITCODE -ne 0) {
    throw "scp deploy script failed with exit code $LASTEXITCODE"
  }

  if ($SyncLocalEnv) {
    $localEnvPath = Join-Path $repoRoot ".env"
    if (-not (Test-Path $localEnvPath)) {
      throw "Cannot sync .env because $localEnvPath does not exist"
    }

    Write-Host "Uploading local .env to $ProxmoxHost"
    & scp $localEnvPath "${ProxmoxHost}:$remoteEnvPath"
    if ($LASTEXITCODE -ne 0) {
      throw "scp .env failed with exit code $LASTEXITCODE"
    }
  }

  $remoteHostScript = @"
set -eu
VMID="$Vmid"
pct status "`$VMID" | grep -q running || pct start "`$VMID"
sleep 3
pct push "`$VMID" "$remoteArchivePath" /tmp/splitsheet-current.tar.gz
pct push "`$VMID" "$remoteScriptPath" /tmp/splitsheet-deploy.sh
if [ "$syncEnvFlag" = "1" ]; then
  pct push "`$VMID" "$remoteEnvPath" /tmp/splitsheet-local.env
fi
pct exec "`$VMID" -- bash /tmp/splitsheet-deploy.sh
rm -f "$remoteArchivePath" "$remoteScriptPath"
if [ "$syncEnvFlag" = "1" ]; then
  rm -f "$remoteEnvPath"
fi
"@

  [System.IO.File]::WriteAllText(
    $hostScriptPath,
    $remoteHostScript.Replace("`r`n", "`n"),
    [System.Text.Encoding]::ASCII
  )

  Write-Host "Uploading Proxmox host script to $ProxmoxHost"
  & scp $hostScriptPath "${ProxmoxHost}:$remoteHostScriptPath"
  if ($LASTEXITCODE -ne 0) {
    throw "scp host script failed with exit code $LASTEXITCODE"
  }

  Write-Host "Deploying inside LXC $Vmid"
  & ssh $ProxmoxHost "bash $remoteHostScriptPath"
  if ($LASTEXITCODE -ne 0) {
    throw "remote deployment failed with exit code $LASTEXITCODE"
  }

  Write-Host "Checking health at $PublicBaseUrl/health"
  $health = $null
  $lastHealthError = $null
  for ($attempt = 1; $attempt -le 12; $attempt += 1) {
    try {
      $health = Invoke-WebRequest -UseBasicParsing -Uri "$PublicBaseUrl/health" -TimeoutSec 10
      break
    } catch {
      $lastHealthError = $_.Exception.Message
      Start-Sleep -Seconds 5
    }
  }
  if (-not $health) {
    throw "health check failed after waiting: $lastHealthError"
  }
  Write-Host $health.Content
  Write-Host "Done"
}
finally {
  Remove-Item $archivePath -Force -ErrorAction SilentlyContinue
  Remove-Item $insideScriptPath -Force -ErrorAction SilentlyContinue
  Remove-Item $hostScriptPath -Force -ErrorAction SilentlyContinue
}
