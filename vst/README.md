# SplitSheet Studio VST

This is the first JUCE-based `VST3` / standalone shell for the SplitSheet Studio plugin.

## Current scope
- login form
- API base URL configuration
- `/api/ready` connectivity check
- `/api/auth/login` request flow
- status display for the current session

## Current limitations
- not yet compiled in this workspace because the local Windows C++ toolchain is not installed
- draft list/create/update UI is not connected yet
- no signature capture UI yet
- no Studio One runtime verification yet

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

## Next plugin milestones
1. compile the `VST3` shell locally
2. verify plugin window opens in Studio One
3. complete login and session persistence
4. add draft list/create/update workflow
5. add finalize/send flow
