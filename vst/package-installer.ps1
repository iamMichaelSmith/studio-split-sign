param(
  [string]$BuildDir = ".\build",
  [string]$Configuration = "Release",
  [string]$OutputDir = ".\dist",
  [string]$Version = "0.1.0",
  [switch]$SkipBuild,
  [switch]$InstallAfterBuild,
  [switch]$LaunchStudioOne
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
$vst3Source = Join-Path $buildPath "SplitSheetStudio_artefacts\$Configuration\VST3\SplitSheet Studio.vst3"

if (-not (Test-Path (Join-Path $standaloneSource "SplitSheet Studio.exe"))) {
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

Copy-Item -LiteralPath (Join-Path $standaloneSource "SplitSheet Studio.exe") -Destination $standaloneStage -Force
Copy-Item -LiteralPath $vst3Source -Destination (Join-Path $vst3Stage "SplitSheet Studio.vst3") -Recurse -Force

$issPath = Join-Path $PSScriptRoot "installer\SplitSheetStudio.iss"
& $isccExe `
  "/DMyAppVersion=$Version" `
  "/DStandaloneSource=$standaloneStage" `
  "/DVst3Source=$(Join-Path $vst3Stage 'SplitSheet Studio.vst3')" `
  "/DOutputDir=$outputPath" `
  $issPath

$installerPath = Join-Path $outputPath "SplitSheetStudio-Setup-$Version.exe"
if (-not (Test-Path $installerPath)) {
  throw "Installer was not created at $installerPath"
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
