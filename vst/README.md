# SplitSheet Studio VST

This is the first JUCE-based `VST3` / standalone shell for the SplitSheet Studio plugin.

## Current scope
- login form
- API base URL configuration
- `/api/ready` connectivity check
- `/api/auth/login` request flow
- status display for the current session
- multi-step split-sheet submission UI
- installer packaging path for Windows VST3 + standalone delivery

## Current limitations
- draft list/create/update history is not connected yet
- no automatic license / purchase gating yet
- no code signing yet for the installer or plugin
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
- `C:\Program Files\Common Files\VST3\SplitSheet Studio.vst3`

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

## Next plugin milestones
1. verify installer on a clean Windows machine
2. verify Studio One plugin scan and load behavior
3. add purchase / license gating for paid download
4. add signed installer and plugin release pipeline
5. expand DAW compatibility testing beyond Studio One
