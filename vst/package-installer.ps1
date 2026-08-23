param(
  [string]$BuildDir = ".\build",
  [string]$Configuration = "Release",
  [string]$OutputDir = ".\dist",
  [string]$Version = "0.1.0",
  [string]$CertificateThumbprint = $env:SPLITSHEET_SIGNING_CERT_THUMBPRINT,
  [string]$PfxPath = $env:SPLITSHEET_SIGNING_PFX_PATH,
  [string]$PfxPassword = $env:SPLITSHEET_SIGNING_PFX_PASSWORD,
  [string]$TimestampUrl = "http://timestamp.digicert.com",
  [switch]$SkipBuild,
  [switch]$InstallAfterBuild,
  [switch]$LaunchStudioOne,
  [switch]$RequireSigning
)

$ErrorActionPreference = "Stop"

function Resolve-ToolPath {
  param(
    [string[]]$Candidates,
    [string]$CommandName
  )

  $command = Get-Command $CommandName -ErrorAction SilentlyContinue
  if ($command) {
    return $command.Source
  }

  foreach ($candidate in $Candidates) {
    if (Test-Path $candidate) {
      return $candidate
    }
  }

  return $null
}

function Resolve-SignToolPath {
  $command = Get-Command "signtool.exe" -ErrorAction SilentlyContinue
  if ($command) {
    return $command.Source
  }

  $kitsRoot = Join-Path ${env:ProgramFiles(x86)} "Windows Kits\10\bin"
  if (Test-Path -LiteralPath $kitsRoot) {
    return Get-ChildItem -LiteralPath $kitsRoot -Filter "signtool.exe" -Recurse -File -ErrorAction SilentlyContinue |
      Where-Object { $_.FullName -match "\\x64\\signtool\.exe$" } |
      Sort-Object FullName -Descending |
      Select-Object -ExpandProperty FullName -First 1
  }

  return $null
}

function Invoke-CodeSigning {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,
    [Parameter(Mandatory = $true)]
    [string]$SignToolPath
  )

  $arguments = @("sign", "/fd", "SHA256", "/td", "SHA256", "/tr", $TimestampUrl)
  if ($PfxPath) {
    $resolvedPfxPath = (Resolve-Path -LiteralPath $PfxPath).Path
    $arguments += @("/f", $resolvedPfxPath)
    if ($PfxPassword) {
      $arguments += @("/p", $PfxPassword)
    }
  } else {
    $arguments += @("/sha1", $CertificateThumbprint)
  }
  $arguments += $Path

  & $SignToolPath @arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Code signing failed for $Path"
  }

  & $SignToolPath verify /pa /v $Path
  if ($LASTEXITCODE -ne 0) {
    throw "Signature verification failed for $Path"
  }
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$buildPath = Join-Path $PSScriptRoot $BuildDir
$outputPath = Join-Path $PSScriptRoot $OutputDir
$stagePath = Join-Path $outputPath "stage"
$standaloneStage = Join-Path $stagePath "Standalone"
$vst3Stage = Join-Path $stagePath "VST3"

$cmakeExe = Resolve-ToolPath -Candidates @("C:\Program Files\CMake\bin\cmake.exe") -CommandName "cmake"
if (-not $cmakeExe) {
  throw "CMake is not installed. Install it first."
}

$isccExe = Resolve-ToolPath -Candidates @(
  "C:\Program Files (x86)\Inno Setup 6\ISCC.exe",
  "C:\Program Files\Inno Setup 6\ISCC.exe",
  (Join-Path $env:LOCALAPPDATA "Programs\Inno Setup 6\ISCC.exe")
) -CommandName "ISCC"
if (-not $isccExe) {
  throw "Inno Setup 6 is not installed. Install it first with: winget install JRSoftware.InnoSetup"
}

if (-not $SkipBuild) {
  & $cmakeExe -S $PSScriptRoot -B $buildPath -G "Visual Studio 17 2022" -A x64
  & $cmakeExe --build $buildPath --config $Configuration
}

$standaloneSource = Join-Path $buildPath "SplitSheetStudio_artefacts\$Configuration\Standalone"
$vst3Source = Join-Path $buildPath "SplitSheetStudio_artefacts\$Configuration\VST3\Split Sheet Studio.vst3"

if (-not (Test-Path (Join-Path $standaloneSource "Split Sheet Studio.exe"))) {
  throw "Standalone build artifact missing at $standaloneSource"
}
if (-not (Test-Path $vst3Source)) {
  throw "VST3 build artifact missing at $vst3Source"
}

New-Item -ItemType Directory -Force -Path $outputPath | Out-Null
if (Test-Path $stagePath) {
  Remove-Item -LiteralPath $stagePath -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $standaloneStage | Out-Null
New-Item -ItemType Directory -Force -Path $vst3Stage | Out-Null

Copy-Item -LiteralPath (Join-Path $standaloneSource "Split Sheet Studio.exe") -Destination $standaloneStage -Force
Copy-Item -LiteralPath $vst3Source -Destination (Join-Path $vst3Stage "Split Sheet Studio.vst3") -Recurse -Force

$standaloneBinary = Join-Path $standaloneStage "Split Sheet Studio.exe"
$vst3Binary = Join-Path $vst3Stage "Split Sheet Studio.vst3\Contents\x86_64-win\Split Sheet Studio.vst3"
$signingRequested = [bool]($CertificateThumbprint -or $PfxPath)
$signToolExe = Resolve-SignToolPath

if ($RequireSigning -and -not $signingRequested) {
  throw "Release signing is required. Set SPLITSHEET_SIGNING_CERT_THUMBPRINT or SPLITSHEET_SIGNING_PFX_PATH."
}
if ($signingRequested -and -not $signToolExe) {
  throw "SignTool was not found. Install the Windows SDK signing tools."
}
if ($signingRequested) {
  Invoke-CodeSigning -Path $standaloneBinary -SignToolPath $signToolExe
  Invoke-CodeSigning -Path $vst3Binary -SignToolPath $signToolExe
} else {
  Write-Warning "Building an unsigned development installer. Do not publish it to customers."
}

$issPath = Join-Path $PSScriptRoot "installer\SplitSheetStudio.iss"
& $isccExe `
  "/DMyAppVersion=$Version" `
  "/DStandaloneSource=$standaloneStage" `
  "/DVst3Source=$(Join-Path $vst3Stage 'Split Sheet Studio.vst3')" `
  "/DOutputDir=$outputPath" `
  $issPath

$installerPath = Join-Path $outputPath "SplitSheetStudio-Setup-$Version.exe"
if (-not (Test-Path $installerPath)) {
  throw "Installer was not created at $installerPath"
}

if ($signingRequested) {
  Invoke-CodeSigning -Path $installerPath -SignToolPath $signToolExe
}

Write-Host "Installer created: $installerPath"

if ($InstallAfterBuild) {
  Start-Process -FilePath $installerPath -ArgumentList "/VERYSILENT", "/NORESTART" -Wait
  Write-Host "Installer completed."
}

if ($LaunchStudioOne) {
  $studioOneExe = @(
    "C:\Program Files\PreSonus\Studio One 7\Studio One.exe",
    "C:\Program Files\PreSonus\Studio One 6\Studio One.exe"
  ) | Where-Object { Test-Path $_ } | Select-Object -First 1

  if (-not $studioOneExe) {
    throw "Studio One executable was not found."
  }

  Start-Process -FilePath $studioOneExe
}
