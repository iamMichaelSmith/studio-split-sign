# Release Checklist

## Code and app checks
- [ ] `npm test` passes
- [ ] `node --check server.js` passes
- [ ] core pages load successfully
- [ ] landing, pricing, and blog pages load successfully
- [ ] invite-sign flow works end to end
- [ ] admin timeline and reminder flow work
- [ ] plugin can sign in against hosted API

## Configuration checks
- [ ] admin credentials changed from defaults
- [ ] strong `SESSION_SECRET` configured
- [ ] `PUBLIC_BASE_URL` configured correctly
- [ ] SMTP send test completed
- [ ] `SUPPORT_EMAIL` configured
- [ ] Stripe left intentionally disabled or fully configured

## Operational checks
- [ ] backup path for `data/submissions` and `data/pdfs` confirmed
- [ ] `/health` and `/ready` verified in deployment environment
- [ ] restore path for legal records understood by operator
- [ ] plugin installer artifact path confirmed

## Documentation checks
- [ ] README is current
- [ ] docs links verified
- [ ] QA checklist reflects current workflow
- [ ] public launch guidance reflects actual feature set
