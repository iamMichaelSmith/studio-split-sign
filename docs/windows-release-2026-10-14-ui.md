# Windows 0.1.4 interface update

The signed Windows release unifies the Song, Contributors, and Review & Send pages behind one centered translucent panel with equal outer margins and 24-pixel inner padding. Song fields fill two aligned columns and Notes expands into the available area.

Preferences, connection settings, and plugin sign-out controls are removed from the visible interface. The footer reserves a complete right-aligned action button before sizing the validation text, preventing the previous clipped ellipsis button.

Review & Send places recipients and confirmations in a scrolling left column, and a larger read-only summary in the wider right column. Summary text can scroll independently for unusually long content. The footer remains fixed and all confirmation controls remain reachable at the minimum 860 by 620 editor size.

Contributor cards now reserve sufficient height for every field and the complete signature pad, with consistent 22-pixel card padding. Their viewport adapts to the available width rather than forcing horizontal clipping.

The actual editor is rendered at default, minimum, and large sizes across all six new skins. Native VST3 and standalone builds are packaged with Azure Artifact Signing under Blak Marigold Pro LLC, using the existing signed release workflow. Theme keys, account sessions, validation and submission behavior are preserved.

The website and skins email share an updated six-skin gallery captured from the real editor. Production email journeys retain their existing real-day schedule.

Installer SHA256: 256426ca0e7bef3edcf5cd7c2254a6dc2b9775d77a4b3d8fe81d2194c0fefce2

Validation: signed VST3 and standalone builds succeeded; all three release artifacts report version 0.1.4 with valid timestamped signatures; 39 application tests and smoke passed. Native editor captures cover six new skins at 1280 by 980 review, 920 by 680 default, and 860 by 620 minimum.

AWS task definition: splitsheetstudio-staging:88. Image: 20261014-ui-014. Download key: downloads/SplitSheetStudio-Setup-0.1.4.exe.
