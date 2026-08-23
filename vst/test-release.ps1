param(
  [string]$Version = "0.1.0",
  [switch]$RequireSigned,
  [switch]$CheckInstalled
)

$ErrorActionPreference = "Stop"

if ($PSVersionTable.PSEdition -eq "Desktop") {
  $securityModule = Join-Path $PSHOME "Modules\Microsoft.PowerShell.Security\Microsoft.PowerShell.Security.psd1"
  $utilityModule = Join-Path $PSHOME "Modules\Microsoft.PowerShell.Utility\Microsoft.PowerShell.Utility.psd1"
  Import-Module $securityModule -Force
  Import-Module $utilityModule -Force
}

$installerPath = Join-Path $PSScriptRoot "dist\SplitSheetStudio-Setup-$Version.exe"
$packagedVstBinary = Join-Path $PSScriptRoot "dist\stage\VST3\Split Sheet Studio.vst3\Contents\x86_64-win\Split Sheet Studio.vst3"
$packagedStandalone = Join-Path $PSScriptRoot "dist\stage\Standalone\Split Sheet Studio.exe"
$requiredPaths = @($installerPath, $packagedVstBinary, $packagedStandalone)

foreach ($path in $requiredPaths) {
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Required release artifact is missing: $path"
  }
  if ((Get-Item -LiteralPath $path).Length -le 0) {
    throw "Release artifact is empty: $path"
  }
}

$signatureResults = foreach ($path in $requiredPaths) {
  $signature = Get-AuthenticodeSignature -LiteralPath $path
  [pscustomobject]@{
    Path = $path
    Signature = $signature.Status.ToString()
    Sha256 = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash
  }
}

if ($RequireSigned -and ($signatureResults | Where-Object Signature -ne "Valid")) {
  throw "Release verification failed because one or more artifacts are not signed."
}

$installedResult = $null
if ($CheckInstalled) {
  $installedVstBinary = "C:\Program Files\Common Files\VST3\Split Sheet Studio.vst3\Contents\x86_64-win\Split Sheet Studio.vst3"
  $installedStandalone = "C:\Program Files\Blak Marigold Studio\Split Sheet Studio\Split Sheet Studio.exe"
  if (-not (Test-Path -LiteralPath $installedVstBinary)) {
    throw "Installed VST3 binary is missing: $installedVstBinary"
  }
  if (-not (Test-Path -LiteralPath $installedStandalone)) {
    throw "Installed standalone app is missing: $installedStandalone"
  }

  $installedResult = [pscustomobject]@{
    VstPath = $installedVstBinary
    StandalonePath = $installedStandalone
    VstMatchesPackage = (Get-FileHash -LiteralPath $installedVstBinary).Hash -eq (Get-FileHash -LiteralPath $packagedVstBinary).Hash
  }
  if (-not $installedResult.VstMatchesPackage) {
    throw "The installed VST3 does not match the current installer package."
  }
}

[pscustomobject]@{
  Version = $Version
  Artifacts = $signatureResults
  Installed = $installedResult
  ReadyForUnsignedTesting = $true
  ReadyForPublicDistribution = -not [bool]($signatureResults | Where-Object Signature -ne "Valid")
} | ConvertTo-Json -Depth 6
