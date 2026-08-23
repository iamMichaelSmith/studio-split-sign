param(
  [string]$BuildDir = ".\build",
  [string]$Configuration = "Release",
  [switch]$InstallToSystemVst3,
  [switch]$InstallToUserVst3,
  [switch]$LaunchStudioOne
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourceDir = $scriptRoot
$resolvedBuildDir = if ([System.IO.Path]::IsPathRooted($BuildDir)) {
  $BuildDir
} else {
  Join-Path $scriptRoot $BuildDir
}

$cmakeCommand = Get-Command cmake -ErrorAction SilentlyContinue
if (-not $cmakeCommand -and (Test-Path "C:\Program Files\CMake\bin\cmake.exe")) {
  $cmakeCommand = Get-Item "C:\Program Files\CMake\bin\cmake.exe"
}

if (-not $cmakeCommand) {
  throw "CMake is not installed. Install Kitware.CMake first."
}

$cmakeExe = if ($cmakeCommand -is [System.Management.Automation.CommandInfo]) {
  $cmakeCommand.Source
} elseif ($cmakeCommand.PSObject.Properties.Match("FullName").Count -gt 0) {
  $cmakeCommand.FullName
} else {
  [string]$cmakeCommand
}

$studioOneExe = @(
  "C:\Program Files\PreSonus\Studio One 7\Studio One.exe",
  "C:\Program Files\PreSonus\Studio One 6\Studio One.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

& $cmakeExe -S $sourceDir -B $resolvedBuildDir -G "Visual Studio 17 2022" -A x64
if ($LASTEXITCODE -ne 0) {
  throw "CMake configuration failed with exit code $LASTEXITCODE."
}

& $cmakeExe --build $resolvedBuildDir --config $Configuration
if ($LASTEXITCODE -ne 0) {
  throw "CMake build failed with exit code $LASTEXITCODE."
}

$pluginPath = Join-Path $resolvedBuildDir "SplitSheetStudio_artefacts\$Configuration\VST3\Split Sheet Studio.vst3"
if (-not (Test-Path $pluginPath)) {
  throw "Expected VST3 bundle was not found at $pluginPath"
}

function Install-Vst3Bundle {
  param(
    [string]$TargetDir,
    [string]$LegacyTargetDir
  )

  if ($LegacyTargetDir -and (Test-Path $LegacyTargetDir)) {
    try {
      Remove-Item -LiteralPath $LegacyTargetDir -Recurse -Force
    } catch {
      Write-Warning "Could not remove legacy VST3 bundle at $LegacyTargetDir. Run PowerShell as Administrator to remove it."
    }
  }
  if (Test-Path $targetDir) {
    Remove-Item -LiteralPath $targetDir -Recurse -Force
  }

  Copy-Item -LiteralPath $pluginPath -Destination $targetDir -Recurse -Force
  Write-Host "Installed plugin to $targetDir"
}

if ($InstallToSystemVst3) {
  Install-Vst3Bundle `
    -TargetDir "C:\Program Files\Common Files\VST3\Split Sheet Studio.vst3" `
    -LegacyTargetDir "C:\Program Files\Common Files\VST3\SplitSheet Studio.vst3"
}

if ($InstallToUserVst3) {
  $userVst3Root = Join-Path $env:LOCALAPPDATA "Programs\Common\VST3"
  New-Item -ItemType Directory -Force -Path $userVst3Root | Out-Null
  Install-Vst3Bundle `
    -TargetDir (Join-Path $userVst3Root "Split Sheet Studio.vst3") `
    -LegacyTargetDir (Join-Path $userVst3Root "SplitSheet Studio.vst3")
}

if ($LaunchStudioOne) {
  if (-not $studioOneExe) {
    throw "Studio One executable was not found."
  }

  Start-Process -FilePath $studioOneExe
}

Write-Host "Build complete."
Write-Host "Plugin bundle: $pluginPath"
