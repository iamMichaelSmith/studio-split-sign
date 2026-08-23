# QA Checklist

## Goal
Use this checklist to validate the phase-one split-sign workflow quickly and consistently.

## Pre-check
- [ ] `npm install` completed
- [ ] `npm test` passes
- [ ] app starts with `npm run dev`
- [ ] `/health` responds successfully
- [ ] `/ready` responds successfully

## In-session signing flow
- [ ] open `/split-sheet`
- [ ] create a split with at least 2 contributors
- [ ] confirm writer shares total 100
- [ ] confirm publisher shares total 100
- [ ] capture typed + drawn signatures in-session
- [ ] submit successfully
- [ ] download resulting PDF

## Invite-based signing flow
- [ ] create another split with invite mode enabled
- [ ] confirm submission lands in `pending-signatures`
- [ ] open signer link #1 and confirm timeline shows `viewed`
- [ ] sign signer link #1 and confirm signer becomes `signed`
- [ ] open signer link #2 and sign
- [ ] confirm final completion state is reached
- [ ] confirm final PDF is available

## Admin flow
- [ ] log in at `/admin/login`
- [ ] open a user detail page from Users and Plans
- [ ] verify user plan, usage, and split-sheet history are accurate
- [ ] open signer timeline detail page
- [ ] verify counts for total/signed/viewed/pending
- [ ] copy a signer link from admin
- [ ] run reminder action while at least one signer is pending
- [ ] confirm reminder success banner appears
- [ ] confirm last reminder run metadata updates
- [ ] resend a completed final packet from admin
- [ ] confirm completion email status is visible
- [ ] copy the revision request link for a completed split
- [ ] verify JSON retrieval route works

## Studio One VST3 beta flow
- [ ] close Studio One before installing the beta
- [ ] install `SplitSheetStudio-Setup-0.1.1.exe`
- [ ] confirm VST3 binary exists at `C:\Program Files\Common Files\VST3\Split Sheet Studio.vst3\Contents\x86_64-win\Split Sheet Studio.vst3`
- [ ] open Studio One and rescan plugins
- [ ] load `Split Sheet Studio` on an audio track or instrument track
- [ ] confirm the marigold logo appears instead of the old `SS` mark
- [ ] confirm the standalone app does not need to be open
- [ ] sign in from the plugin using the hosted account
- [ ] create a two-contributor split with writer/publisher totals exactly 100%
- [ ] send remote invite links from the plugin
- [ ] sign both links in the browser
- [ ] confirm both completed emails arrive with PDF and revision link
- [ ] reopen the plugin and confirm `/api/plugin/update` reports up to date for `0.1.1`

## Plugin update flow
- [ ] install or simulate plugin version `0.1.0`
- [ ] open plugin and confirm update notice appears
- [ ] click Download Update
- [ ] confirm browser opens `https://app.splitsheetstudio.com/downloads/plugin/latest`
- [ ] close Studio One before running installer
- [ ] install latest package
- [ ] reopen Studio One and confirm version `0.1.1` behavior

## Email flow
If SMTP is configured:
- [ ] invite emails are delivered
- [ ] completion email is delivered
- [ ] reminder emails are delivered

If SMTP is not configured:
- [ ] app still stores submissions locally
- [ ] UI communicates email limitation clearly enough for local testing

## Negative-path checks
- [ ] reject split submission when song title is blank
- [ ] reject split submission when fewer than 2 contributors are present
- [ ] reject split submission when share totals do not equal 100/100
- [ ] reject invite signer submit when typed signature name is blank
- [ ] reject invite signer submit when signature image is missing
- [ ] reject invalid signer token with not found / invalid link response

## Release confidence
A phase-one build is ready for internal testing when:
- [ ] smoke test passes
- [ ] both signing modes work
- [ ] admin timeline is accurate
- [ ] final PDF generation works
- [ ] reminder flow works
- [ ] Studio One VST3 opens and submits
- [ ] beta installer path and update URL work
