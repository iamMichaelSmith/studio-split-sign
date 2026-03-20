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
- [ ] open signer timeline detail page
- [ ] verify counts for total/signed/viewed/pending
- [ ] copy a signer link from admin
- [ ] run reminder action while at least one signer is pending
- [ ] confirm reminder success banner appears
- [ ] confirm last reminder run metadata updates
- [ ] verify JSON retrieval route works

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
