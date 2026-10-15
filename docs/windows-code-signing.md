# Windows code signing

The Windows 0.1.3 release uses Azure Artifact Signing. The verified publisher is **Blak Marigold Pro LLC**. The standalone app and VST3 binary are signed before packaging; the completed installer is signed afterward. All three signatures must be valid and timestamped.

## Configured tools

- Signing metadata stays outside Git at `C:\Signing\metadata.json`.
- Azure signing client: `$env:LOCALAPPDATA\Microsoft\MicrosoftArtifactSigningClientTools\Azure.CodeSigning.Dlib.dll`.
- SignTool comes from the x64 Windows SDK bin directory.
- Authentication uses the existing Azure account session. Run `az login` if the session needs renewal. Do not store Azure access tokens or private signing credentials in the repository.

Microsoft integration reference: https://learn.microsoft.com/en-us/azure/artifact-signing/how-to-signing-integrations

## Package a signed release

In PowerShell, configure the paths for the current session:

```powershell
$env:SPLITSHEET_AZURE_METADATA_PATH = 'C:\Signing\metadata.json'
$env:SPLITSHEET_AZURE_DLIB_PATH = Join-Path $env:LOCALAPPDATA 'Microsoft\MicrosoftArtifactSigningClientTools\Azure.CodeSigning.Dlib.dll'
npm run vst:release
```

For existing release binaries in the clean build directory:

```powershell
.\vst\package-installer.ps1 -BuildDir '.\build-release-clean' -Version '0.1.3' -SkipBuild -RequireSigning
```

Azure signing uses SignTool `/dlib` and `/dmdf`, SHA-256 digests, and the Microsoft timestamp server at `http://timestamp.acs.microsoft.com`. A timestamp keeps the signing-time validation available after the short-lived signing certificate expires.

The package script regenerates JUCE Windows version resources for fresh builds, verifies binary versions before packaging, signs both staged binaries, compiles the installer, signs it, and checks signature validity and timestamp presence. No release installer is accepted after a failed build or compiler step.

The existing certificate-thumbprint and PFX options remain supported for other environments. Choose one signing method per release.

## Verify before publication

```powershell
.\vst\test-release.ps1 -Version '0.1.3' -RequireSigned
```

Verification requires valid timestamped signatures from Blak Marigold Pro LLC for the installer, VST3, and standalone binary, and matching embedded product versions. The report includes SHA-256 checksums. Only use `-CheckInstalled` after deliberately installing the release on a test machine.

Upload the verified installer to the configured private S3 key, download it back, compare its checksum, and verify the downloaded signature. Preserve the previous S3 version for rollback. Update website copy only after the signed installer is available.

Code signing establishes publisher identity and file integrity. It does not replace clean-machine installation tests or DAW compatibility checks.
