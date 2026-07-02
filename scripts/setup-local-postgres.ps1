param(
  [switch]$InstallIfMissing,
  [string]$Port = "54329",
  [string]$SuperUser = "postgres",
  [string]$SuperPassword = "splitsheet-postgres-admin",
  [string]$AppUser = "splitsheet",
  [string]$AppPassword = "splitsheet",
  [string]$Database = "splitsheet_dev"
)

$ErrorActionPreference = "Stop"

function Resolve-PostgresBin {
  $candidates = @(
    "C:\Program Files\PostgreSQL\16\bin",
    "C:\Program Files\PostgreSQL\17\bin"
  )

  foreach ($candidate in $candidates) {
    if (Test-Path (Join-Path $candidate "psql.exe")) {
      return $candidate
    }
  }

  $command = Get-Command psql.exe -ErrorAction SilentlyContinue
  if ($command) {
    return Split-Path -Parent $command.Source
  }

  return $null
}

function Install-Postgres {
  Write-Host "Installing PostgreSQL via winget..."
  winget install --id PostgreSQL.PostgreSQL.16 --source winget --accept-package-agreements --accept-source-agreements --silent --override "--mode unattended --unattendedmodeui minimal --superpassword `"$SuperPassword`" --servicename postgresql-x64-16 --serverport $Port"
}

$binDir = Resolve-PostgresBin
if (-not $binDir) {
  if (-not $InstallIfMissing) {
    throw "PostgreSQL was not found. Re-run with -InstallIfMissing or install PostgreSQL 16 first."
  }

  Install-Postgres
  $binDir = Resolve-PostgresBin
}

if (-not $binDir) {
  throw "PostgreSQL install did not provide psql.exe."
}

$psql = Join-Path $binDir "psql.exe"
$pgIsReady = Join-Path $binDir "pg_isready.exe"

$service = Get-Service | Where-Object { $_.Name -match "^postgresql.*(16|17)" } | Sort-Object Name | Select-Object -First 1
if (-not $service) {
  throw "No PostgreSQL Windows service was found after installation."
}

if ($service.Status -ne "Running") {
  Start-Service -Name $service.Name
  $service.WaitForStatus("Running", [TimeSpan]::FromSeconds(45))
}

$env:PGPASSWORD = $SuperPassword

$ready = $false
for ($index = 0; $index -lt 30; $index += 1) {
  & $pgIsReady -h 127.0.0.1 -p $Port -U $SuperUser | Out-Null
  if ($LASTEXITCODE -eq 0) {
    $ready = $true
    break
  }

  Start-Sleep -Seconds 2
}

if (-not $ready) {
  throw "PostgreSQL service started, but the server did not become ready on port $Port."
}

$roleSql = @"
DO `$$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$AppUser') THEN
    CREATE ROLE $AppUser LOGIN PASSWORD '$AppPassword';
  ELSE
    ALTER ROLE $AppUser WITH LOGIN PASSWORD '$AppPassword';
  END IF;
END
`$$;
"@

$databaseSql = @"
SELECT format('CREATE DATABASE %I OWNER %I', '$Database', '$AppUser')
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$Database');
\gexec
"@

$roleSql | & $psql -h 127.0.0.1 -p $Port -U $SuperUser -d postgres -v ON_ERROR_STOP=1 | Out-Null
$databaseSql | & $psql -h 127.0.0.1 -p $Port -U $SuperUser -d postgres -v ON_ERROR_STOP=1 | Out-Null

Write-Host "PostgreSQL is ready."
Write-Host "DATABASE_URL=postgres://$($AppUser):$($AppPassword)@127.0.0.1:$Port/$($Database)?sslmode=disable"
