# Windows beta 0.1.3

Released October 14, 2026 to ECS revision 84 (image 20261014-windows-013). Previous revision: 82.

The installer includes VST3 and standalone builds with Midnight, Neon, Electric, Blueprint, Royal, and Walnut added to the six existing skins. The original skin IDs and saved keys are preserved. The homepage, plugin page, and account skins section promote the same six-skin gallery.

Download: https://app.splitsheetstudio.com/downloads/plugin/latest (Creator or Studio account required).

S3 key: downloads/SplitSheetStudio-Setup-0.1.3.exe

Installer SHA256: 864673ea965c6ed8f378d85bbec195c0dbd3ae7154bf647099f182c284a78518

Verification: 39 application tests plus smoke; 22 isolated PostgreSQL checks; all three packaged artifacts report version 0.1.3; AWS installer readback matches the local checksum; live health/readiness, gallery, and update API passed. Screenshots confirm the live plugin gallery.

The beta is unsigned. Code signing and clean-machine/multi-DAW validation remain separate release work. This release did not install the plugin on this computer. Production email journeys are explicitly disabled. Beta journeys keep the real-day schedule and six-skin email image.

JUCE 8.0.4 may retain the previous Windows resource version after CMake reconfiguration. Regenerate the generated resource using juceaide rcfile with the generated Info.txt, rebuild both targets, and run vst/test-release.ps1 before upload. Packaging now rejects binaries whose embedded version differs from the installer version.

## Signed release follow-up

Azure Artifact Signing is now configured. The installer was rebuilt from signed staged VST3 and standalone binaries and then signed as Blak Marigold Pro LLC. All three artifacts have valid timestamped signatures. The signed installer replaces the unsigned beta at the same S3 download key.

Signed installer SHA256: 39fcaf0bf4b1573edcd3e2a009a5149545098574177afb1cc032ac66f8956655

The website now identifies the verified publisher. Production email journeys remain enabled with the existing real-day schedule and mailing footer. Clean-machine and multi-DAW testing remain outstanding. See windows-code-signing.md for the repeatable Azure release process.

Signed website deployment: splitsheetstudio-staging:87. Container image: 20261014-windows-013-signed.
