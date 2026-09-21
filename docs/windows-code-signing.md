# Windows Code Signing

Split Sheet Studio can stay in public beta while the installer is unsigned, but a broad paid release should use a trusted Windows code-signing certificate. Signing gives customers a clear publisher identity, lets Windows verify that the installer was not modified after release, and preserves trust after the certificate expires when the signature is timestamped.

## What Gets Signed

For a Windows public release, sign all three release artifacts:

- standalone app: `Split Sheet Studio.exe`
- VST3 binary inside the bundle: `Split Sheet Studio.vst3`
- final installer: `SplitSheetStudio-Setup-0.1.2.exe`

The current release script signs the standalone executable and the VST3 binary before packaging, then signs the final installer after Inno Setup creates it.

## Choose The Signing Path

There are two realistic paths:

- **Fastest path for this repo:** buy a traditional OV code-signing certificate from a public CA and use the existing `vst/package-installer.ps1` signing hooks.
- **Lower-cost Microsoft path:** use Azure Artifact Signing, formerly Trusted Signing, which Microsoft recommends for many non-Store apps distributed outside the Microsoft Store. This can be a strong later move, but it requires adding the Microsoft signing integration to the release pipeline instead of only using the current certificate-thumbprint or PFX flow.

For the next public Windows release, the OV certificate path is the shortest because the build script already supports it.

## Traditional OV Certificate To Buy

Buy an OV code-signing certificate in the exact legal name you want Windows to show as the publisher, such as the registered business entity behind Split Sheet Studio. Use a public trusted certificate authority such as DigiCert, GlobalSign, Sectigo, SSL.com, or Certum.

Modern public code-signing certificates require protected private-key storage. Most CAs now issue the key through a hardware token, cloud signing service, or hardware security module workflow. Do not expect to receive a normal reusable `.pfx` file unless the CA explicitly supports a compliant cloud or hardware-backed export flow.

Extended Validation can still be offered by vendors, but Microsoft no longer treats EV code-signing certificates as a separate technical requirement for Windows trust. For this project, start with OV unless the vendor's EV package gives you a clear operational advantage.

## Before Buying

Prepare these details before the CA validation process:

- legal business name and address
- business phone number that can be verified
- company website: `https://splitsheetstudio.com`
- support email on the same domain if possible
- government or business-registration records
- the person who is allowed to approve certificate issuance

Use the same publisher name consistently across the installer, website, privacy policy, support pages, and certificate request.

## Install Signing Tools

Install the Windows SDK signing tools. The release script searches for `signtool.exe` automatically under the Windows Kits folder.

After installation, confirm SignTool is available:

```powershell
Get-Command signtool.exe -ErrorAction SilentlyContinue
```

If PowerShell does not find it, check a path like:

```powershell
C:\Program Files (x86)\Windows Kits\10\bin\*\x64\signtool.exe
```

## Option A: Certificate In Windows Certificate Store

Use this path when the CA installs the certificate into your Windows certificate store or exposes it through a hardware token provider.

Find the certificate thumbprint:

```powershell
Get-ChildItem Cert:\CurrentUser\My |
  Where-Object { $_.EnhancedKeyUsageList.FriendlyName -contains "Code Signing" } |
  Select-Object Subject, Thumbprint, NotAfter
```

Set the environment variable and build the release:

```powershell
cd "C:\Users\BlakM\OneDrive\Documents\Split Sheet App\repo"
$env:SPLITSHEET_SIGNING_CERT_THUMBPRINT = "PASTE_CERT_THUMBPRINT_HERE"
npm run vst:release
```

The script will call SignTool with SHA-256 digest options and a timestamp server, then verify each signed file.

## Option B: PFX File

Use this only if the CA gives you a compliant `.pfx` workflow. Keep the file outside the repository and never commit it.

```powershell
cd "C:\Users\BlakM\OneDrive\Documents\Split Sheet App\repo"
$env:SPLITSHEET_SIGNING_PFX_PATH = "C:\secure\SplitSheetStudio-CodeSigning.pfx"
$env:SPLITSHEET_SIGNING_PFX_PASSWORD = "PASTE_PASSWORD_HERE"
npm run vst:release
```

Clear the password from the shell when finished:

```powershell
Remove-Item Env:\SPLITSHEET_SIGNING_PFX_PASSWORD -ErrorAction SilentlyContinue
```

## Manual Release Command

The package script can also be run directly:

```powershell
cd "C:\Users\BlakM\OneDrive\Documents\Split Sheet App\repo\vst"
powershell -ExecutionPolicy Bypass -File .\package-installer.ps1 -RequireSigning -CertificateThumbprint "PASTE_CERT_THUMBPRINT_HERE"
```

Expected output:

```text
vst\dist\SplitSheetStudio-Setup-0.1.2.exe
```

## Verify The Signature

Use SignTool:

```powershell
signtool verify /pa /v ".\vst\dist\SplitSheetStudio-Setup-0.1.2.exe"
```

Use PowerShell:

```powershell
Get-AuthenticodeSignature ".\vst\dist\SplitSheetStudio-Setup-0.1.2.exe" | Format-List
```

The status should be `Valid`, and the signer should show the expected publisher. Also right-click the installer, open Properties, and confirm the Digital Signatures tab shows the same publisher.

## Clean-Machine Test

Before replacing the public beta download, test the signed installer on a clean Windows 10 or Windows 11 machine or VM:

1. Download the installer from the public route.
2. Run the installer as a normal user.
3. Confirm the publisher name shown by Windows.
4. Open the standalone app and sign in.
5. Open Studio One, REAPER, Ableton Live, FL Studio, Cubase, Bitwig, Cakewalk/Sonar, or another Windows VST3 host and rescan.
6. Load Split Sheet Studio as a VST3 effect.
7. Create one disposable test split sheet.
8. Uninstall and reinstall to confirm the installer can upgrade cleanly.

Record the installer SHA-256 hash:

```powershell
Get-FileHash ".\vst\dist\SplitSheetStudio-Setup-0.1.2.exe" -Algorithm SHA256
```

## After The First Signed Release

Once the signed installer passes the clean-machine matrix:

- upload the signed installer to the configured S3 download key
- update the public beta/release notes with the signed build date
- keep a local backup copy and SHA-256 hash
- keep the unsigned build out of the public download route
- store CA account recovery details somewhere secure
- rotate the certificate before expiration and keep timestamping enabled

## Do Not

- do not commit certificates, token PINs, `.pfx` files, passwords, or CA recovery data
- do not publish an unsigned installer as a final commercial release
- do not sign a build that was not produced from the reviewed release source
- do not skip timestamping
- do not use a personal certificate when the product should show the business as publisher
