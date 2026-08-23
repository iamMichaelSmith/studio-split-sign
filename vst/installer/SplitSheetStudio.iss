#define MyAppName "Split Sheet Studio"
#define MyAppPublisher "Blak Marigold Studio"
#define MyAppURL "https://splitsheetstudio.com"
#define MyAppSupportURL "https://app.splitsheetstudio.com"
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
AppSupportURL={#MyAppSupportURL}
AppUpdatesURL={#MyAppURL}
AppContact=blakmarigold@gmail.com
DefaultDirName={autopf64}\Blak Marigold Studio\Split Sheet Studio
DefaultGroupName={#MyAppName}
UninstallDisplayIcon={app}\Split Sheet Studio.exe
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
DisableProgramGroupPage=yes
CloseApplications=yes
RestartApplications=no
SetupLogging=yes
UninstallDisplayName={#MyAppName}
VersionInfoCompany={#MyAppPublisher}
VersionInfoDescription={#MyAppName} Windows installer
VersionInfoProductName={#MyAppName}
VersionInfoProductVersion={#MyAppVersion}
InfoAfterFile={#SourcePath}\POSTINSTALL.txt
OutputDir={#OutputDir}
OutputBaseFilename=SplitSheetStudio-Setup-{#MyAppVersion}
[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut for the standalone app"; GroupDescription: "Additional icons:"; Flags: unchecked

[Files]
Source: "{#StandaloneSource}\Split Sheet Studio.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#Vst3Source}\*"; DestDir: "{commoncf64}\VST3\Split Sheet Studio.vst3"; Flags: ignoreversion recursesubdirs createallsubdirs

[InstallDelete]
Type: filesandordirs; Name: "{commoncf64}\VST3\SplitSheet Studio.vst3"
Type: filesandordirs; Name: "{autopf64}\Blak Marigold Studio\SplitSheet Studio"

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\Split Sheet Studio.exe"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\Split Sheet Studio.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\Split Sheet Studio.exe"; Description: "Launch Split Sheet Studio standalone"; Flags: nowait postinstall skipifsilent
