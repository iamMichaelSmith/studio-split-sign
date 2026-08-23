# Public Beta Release Runbook

## Current beta
- Product: Split Sheet Studio
- Plugin version: `0.1.1`
- Installer: `vst/dist/SplitSheetStudio-Setup-0.1.1.exe`
- Public download: `https://app.splitsheetstudio.com/downloads/plugin/latest`
- Hosted app: `https://app.splitsheetstudio.com`
- Marketing page: `https://splitsheetstudio.com/beta`

## What this beta is for
This beta validates the full creator workflow before Stripe checkout and code signing become launch blockers:
- account creation and login
- VST3 launch inside Studio One
- hosted API connection
- split-sheet creation
- remote signature links
- final PDF delivery
- revision requests after completion
- plugin update checks

## Beta tester instructions
1. Close Studio One and any DAW that may scan VST3 plugins.
2. Download the installer from `https://app.splitsheetstudio.com/downloads/plugin/latest`.
3. Run the installer.
4. Open Studio One and rescan plugins if Split Sheet Studio does not appear.
5. Add `Split Sheet Studio` to a track.
6. Sign in using a hosted account.
7. Create a two-contributor test split.
8. Use real reachable emails for the contributor signature links.
9. Sign all links.
10. Confirm every party receives the final completed PDF.

## Known beta limits
- Installer is unsigned; Windows SmartScreen warnings are expected.
- Stripe checkout can remain disabled during the free beta.
- Plugin update checks open a browser download; they do not hot-replace the VST while the DAW is open.
- Studio One is the validated DAW. Other VST3 hosts need additional compatibility testing.

## Admin support checklist
- Use `/admin` to review users, plans, split sheets, email status, and pending signatures.
- Use `/admin/users/:id` to inspect one user’s usage and documents.
- Use `/admin/split/:id` to copy signer links, resend pending signer invites, resend the final packet, or copy the revision link.

## Go/no-go criteria
The beta can be promoted when:
- `npm test` passes
- `/health` and `/api/ready` are live
- Studio One loads the plugin without the standalone app running
- a full two-party remote signing flow completes
- both final emails arrive
- admin resend final packet works
- revision link creates a new signable version
- plugin update check reports `0.1.1` as current/latest

## Before paid launch
- Buy and configure Windows code-signing certificate.
- Connect live Stripe keys and webhook secret.
- Run checkout in Stripe test mode, then live mode.
- Add a public changelog/release notes page.
- Expand DAW QA beyond Studio One.
