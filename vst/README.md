# Split Sheet Studio VST

This is the first JUCE-based `VST3` / standalone shell for the Split Sheet Studio plugin.

## Current scope
- login form
- API base URL configuration
- `/api/ready` connectivity check
- `/api/auth/login` request flow
- status display for the current session
- multi-step split-sheet submission UI
- installer packaging path for Windows VST3 + standalone delivery
- default hosted API target: `https://app.splitsheetstudio.com`
- premium Blak Marigold bronze login skin with the production texture embedded into the plugin binary

## Current limitations
- draft list/create/update history is not connected yet
- no automatic license / purchase gating yet
- a public release requires an Authenticode certificate; unsigned development builds are blocked by the release command
- Studio One runtime still needs manual verification after install

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

To also copy the plugin into the system `VST3` folder and open Studio One:

```powershell
powershell -ExecutionPolicy Bypass -File .\build-and-install.ps1 -InstallToSystemVst3 -LaunchStudioOne
```

Expected install target:
- `C:\Program Files\Common Files\VST3\Split Sheet Studio.vst3`

## Build installer
From `vst/`:

```powershell
powershell -ExecutionPolicy Bypass -File .\package-installer.ps1
```

Build + install + open Studio One:

```powershell
powershell -ExecutionPolicy Bypass -File .\package-installer.ps1 -InstallAfterBuild -LaunchStudioOne
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

## Next plugin milestones
1. purchase and connect an Authenticode code-signing certificate
2. verify the signed installer on a clean Windows machine
3. add purchase / license gating for paid download
4. expand DAW compatibility testing beyond Studio One
