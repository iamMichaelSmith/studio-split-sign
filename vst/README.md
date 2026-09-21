# Split Sheet Studio VST

This is the JUCE-based native client for Split Sheet Studio. It builds `VST3` and standalone targets on Windows and adds `Audio Unit`, `VST3`, and standalone targets on macOS.

## Current scope
- login form
- API base URL configuration
- `/api/ready` connectivity check
- `/api/auth/login` request flow
- status display for the current session
- multi-step split-sheet submission UI
- installer packaging path for Windows VST3 + standalone delivery
- macOS Audio Unit build path for Logic Pro
- default hosted API target: `https://app.splitsheetstudio.com`
- selectable Bronze, Paper Thin, Denim, and Soft skins embedded into the plugin binary
- theme preference saved in plug-in state

## Current limitations
- draft list/create/update history is not connected yet
- no automatic license / purchase gating yet
- a public release requires an Authenticode certificate; unsigned development builds are blocked by the release command
- compatibility still needs manual verification in each supported Windows VST3 host
- the macOS package must be built on a Mac, signed with Developer ID certificates, notarized by Apple, and validated in Logic Pro before Mac support is advertised publicly

## Intended build path
Once the machine has:
- CMake
- Visual Studio Build Tools with C++

you should be able to configure and build this project with JUCE via CMake.

## Local build command
From `vst/`:

```powershell
powershell -ExecutionPolicy Bypass -File .\build-and-install.ps1
```

To also copy the plugin into the system `VST3` folder:

```powershell
powershell -ExecutionPolicy Bypass -File .\build-and-install.ps1 -InstallToSystemVst3
```

Expected install target:
- `C:\Program Files\Common Files\VST3\Split Sheet Studio.vst3`

## macOS Audio Unit and Logic Pro

Logic Pro loads Audio Units rather than VST3 plug-ins. On a Mac with Xcode and CMake installed:

```bash
cd vst
chmod +x build-macos.sh package-macos.sh
INSTALL_AFTER_BUILD=1 ./build-macos.sh
auval -v aufx Ssst Bmss
```

This creates universal Apple silicon and Intel builds. See `docs/macos-release.md` for Developer ID signing, notarization, packaging, and the Logic Pro acceptance test.

## Build installer
From `vst/`:

```powershell
powershell -ExecutionPolicy Bypass -File .\package-installer.ps1
```

Build and install the Windows VST3 package:

```powershell
powershell -ExecutionPolicy Bypass -File .\package-installer.ps1 -InstallAfterBuild
```

Expected installer output:
- `vst\dist\SplitSheetStudio-Setup-0.1.0.exe`

Verify the build artifacts and the currently installed VST3:

```powershell
npm run vst:verify
```

## Signed public release

The release command refuses to create a customer release unless a signing identity is configured:

```powershell
$env:SPLITSHEET_SIGNING_CERT_THUMBPRINT = "YOUR_CERTIFICATE_THUMBPRINT"
npm run vst:release
```

You can alternatively set `SPLITSHEET_SIGNING_PFX_PATH` and `SPLITSHEET_SIGNING_PFX_PASSWORD`. The standalone executable, VST3 binary, and final installer are signed and timestamped before release verification.

See [`docs/windows-code-signing.md`](../docs/windows-code-signing.md) for the certificate purchase, setup, signing, verification, and clean-machine release process.

## Next plugin milestones
1. purchase and connect an Authenticode code-signing certificate
2. verify the signed installer on a clean Windows machine
3. add purchase / license gating for paid download
4. build, sign, notarize, and validate the macOS Audio Unit in Logic Pro
5. expand compatibility testing across major Windows VST3 and macOS Audio Unit hosts
