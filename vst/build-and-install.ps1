param(
  [string]$BuildDir = ".\build",
  [string]$Configuration = "Release",
  [switch]$InstallToSystemVst3,
  [switch]$LaunchStudioOne
)

$ErrorActionPreference = "Stop"

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

& $cmakeExe -S . -B $BuildDir -G "Visual Studio 17 2022" -A x64
& $cmakeExe --build $BuildDir --config $Configuration

$pluginPath = Join-Path $BuildDir "SplitSheetStudio_artefacts\$Configuration\VST3\SplitSheet Studio.vst3"
if (-not (Test-Path $pluginPath)) {
  throw "Expected VST3 bundle was not found at $pluginPath"
}

if ($InstallToSystemVst3) {
  $targetDir = "C:\Program Files\Common Files\VST3\SplitSheet Studio.vst3"
  if (Test-Path $targetDir) {
    Remove-Item -LiteralPath $targetDir -Recurse -Force
  }

  Copy-Item -LiteralPath $pluginPath -Destination $targetDir -Recurse -Force
  Write-Host "Installed plugin to $targetDir"
}

if ($LaunchStudioOne) {
  if (-not $studioOneExe) {
    throw "Studio One executable was not found."
  }

  Start-Process -FilePath $studioOneExe
}

Write-Host "Build complete."
Write-Host "Plugin bundle: $pluginPath"
