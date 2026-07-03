#define MyAppName "SplitSheet Studio"
#define MyAppPublisher "Blak Marigold Studio"
#define MyAppURL "https://github.com/iamMichaelSmith/studio-split-sign"
#ifndef MyAppVersion
  #define MyAppVersion "0.1.0"
#endif
#ifndef StandaloneSource
  #error "StandaloneSource must be provided to the compiler."
#endif
#ifndef Vst3Source
  #error "Vst3Source must be provided to the compiler."
#endif
#ifndef OutputDir
  #define OutputDir "."
#endif

[Setup]
AppId={{4D8B840A-8F20-4D3B-8E7C-B7A9C1F4B7C1}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf64}\Blak Marigold Studio\SplitSheet Studio
DefaultGroupName={#MyAppName}
UninstallDisplayIcon={app}\SplitSheet Studio.exe
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
DisableProgramGroupPage=yes
InfoAfterFile={#SourcePath}\POSTINSTALL.txt
OutputDir={#OutputDir}
OutputBaseFilename=SplitSheetStudio-Setup-{#MyAppVersion}
[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut for the standalone app"; GroupDescription: "Additional icons:"; Flags: unchecked

[Files]
Source: "{#StandaloneSource}\SplitSheet Studio.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#Vst3Source}\*"; DestDir: "{commoncf64}\VST3\SplitSheet Studio.vst3"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\SplitSheet Studio.exe"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\SplitSheet Studio.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\SplitSheet Studio.exe"; Description: "Launch SplitSheet Studio standalone"; Flags: nowait postinstall skipifsilent
