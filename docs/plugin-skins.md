# Plugin skins

The selector includes Bronze, Paper Thin, Denim, Soft, Speakeasy, Plush, Midnight, Neon, Electric, Blueprint, Royal, and Walnut. Theme keys are saved in the existing plugin project state. Existing numeric IDs remain unchanged.

The six new source images are unmodified 1536 × 1024 PNG files in `vst/assets`. Each has its own palette. Their backgrounds stretch to the editor's inner bounds to retain the decorative side borders at different window proportions. Form panels and fields are opaque; translucent dark backplates protect the header, welcome label, and footer. The original skins retain their existing rendering.

The artwork is strongest in Neon and Electric. Midnight and Blueprint are quieter blue options; Royal pairs green with gold; Walnut uses warm brown and wood. Texture opacity is 90% on login and 64.8% behind the signed-in interface.

For a new skin, append its enum value in `PluginEditor.h` to preserve old IDs, add the asset to CMake, and register its palette, texture, stable key, reverse key mapping, selector item, and accepted theme range in `PluginEditor.cpp`.

## Preview validation

Build `SplitSheetScreenshotRenderer`, set `SPLITSHEET_SCREENSHOT_DIR` to a local output directory, and run the renderer. It creates actual editor captures for the six new skins at default 920 × 680 and minimum signed-in 860 × 620 window sizes, plus large song, contributor, and review screens. Captures use 1.5× pixel density.

The new palette's body text, secondary text, field text, placeholders, and active step button text were checked against their backgrounds. These combinations exceed 4.5:1 contrast; this is a targeted palette check, not a full accessibility audit. Screenshots are also checked visually for artwork interference.

Build the VST3 and Standalone targets for local testing. Local builds do not update the installed plugin or the public download. Publish a fresh packaged build through the normal release process when ready.

## October 14 Windows beta release

Version 0.1.3 is published through the account download, including all six new skins. The homepage, plugin page, and account page feature the original six-skin gallery. The installer, VST3, and standalone app are now timestamped and digitally signed by Blak Marigold Pro LLC. See windows-release-2026-10-14.md for verification and checksum.

## Version 0.1.4 layout

All signed-in pages now share one centered translucent shell, with equal margins and consistent control padding. Review & Send uses recipients and confirmations on the left and a larger independently scrollable summary on the right. Preferences and sign-out controls are removed. Contributor cards reserve space for their full signature area. Native previews cover default, compact, and large sizes. Use scripts/build-plugin-gallery.cjs with the renderer capture directory to update the website and email gallery together.
