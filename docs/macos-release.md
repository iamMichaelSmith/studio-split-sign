# macOS Audio Unit release

Logic Pro does not load VST3 plug-ins. Split Sheet Studio therefore builds an Audio Unit (`.component`) alongside the macOS VST3 and standalone app.

## What is already implemented

- JUCE `AU`, `VST3`, and `Standalone` targets on macOS
- Intel and Apple silicon universal build configuration
- Audio Unit effect category and macOS-safe four-character IDs
- hardened runtime configuration for direct distribution
- shared hosted API, authentication, split-sheet workflow, update check, logo, and selectable skins
- repeatable local build, installation, signing, packaging, and notarization scripts

## Mac requirements

- a Mac capable of running the supported Xcode version
- Xcode and Xcode command-line tools
- CMake 3.22 or newer
- an Apple Developer Program membership for public distribution
- `Developer ID Application` and `Developer ID Installer` certificates
- a notarization credential stored with `xcrun notarytool store-credentials`

## Local beta build

```bash
cd vst
chmod +x build-macos.sh package-macos.sh
INSTALL_AFTER_BUILD=1 ./build-macos.sh
```

The script creates universal `arm64` and `x86_64` builds and installs them for the current user:

- `~/Library/Audio/Plug-Ins/Components/Split Sheet Studio.component`
- `~/Library/Audio/Plug-Ins/VST3/Split Sheet Studio.vst3`
- `~/Applications/Split Sheet Studio.app`

## Validate before opening Logic

```bash
auval -v aufx Ssst Bmss
```

The validation must complete without errors. Then open Logic Pro, open **Logic Pro > Settings > Plug-in Manager**, find **Blak Marigold Studio > Split Sheet Studio**, and run a rescan if needed.

## Signed public installer

Store notarization credentials once:

```bash
xcrun notarytool store-credentials split-sheet-studio-notary \
  --apple-id "YOUR_APPLE_ID" \
  --team-id "YOUR_TEAM_ID" \
  --password "YOUR_APP_SPECIFIC_PASSWORD"
```

Then package the release:

```bash
export SPLITSHEET_MAC_APP_IDENTITY="Developer ID Application: Blak Marigold Studio (TEAMID)"
export SPLITSHEET_MAC_INSTALLER_IDENTITY="Developer ID Installer: Blak Marigold Studio (TEAMID)"
export SPLITSHEET_NOTARY_PROFILE="split-sheet-studio-notary"
VERSION=0.1.2 ./package-macos.sh
```

The resulting installer is written to `vst/dist-macos/`. It contains the Audio Unit, VST3, and standalone app, and the script refuses to finish unless signing, notarization, stapling, and Gatekeeper verification pass.

## Logic Pro acceptance test

1. Install the notarized package on a clean Apple silicon Mac.
2. Confirm `auval -v aufx Ssst Bmss` passes.
3. Open Logic Pro without opening the standalone app.
4. Insert **Split Sheet Studio** as an Audio FX plug-in.
5. Sign in and confirm the session restores after reopening the project.
6. Test Bronze, Paper Thin, Denim, and Soft skins and confirm the selected skin restores.
7. Complete a two-contributor invite flow and verify both final emails and the PDF.
8. Repeat the host test under Rosetta on an Intel-compatible test path if Intel support will be advertised.

## Release boundary

The source and build automation are macOS-ready, but a Windows machine cannot produce or validate the final Apple binary. Public Mac compatibility should only be advertised after the AU is built on macOS, signed with the real Developer ID certificates, notarized by Apple, and tested in Logic Pro.
