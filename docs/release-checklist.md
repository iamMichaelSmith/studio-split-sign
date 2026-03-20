# Release Checklist

## Code and app checks
- [ ] `npm test` passes
- [ ] `node --check server.js` passes
- [ ] core pages load successfully
- [ ] invite-sign flow works end to end
- [ ] admin timeline and reminder flow work

## Configuration checks
- [ ] admin credentials changed from defaults
- [ ] strong `SESSION_SECRET` configured
- [ ] `PUBLIC_BASE_URL` configured correctly
- [ ] SMTP send test completed

## Operational checks
- [ ] backup path for `data/submissions` and `data/pdfs` confirmed
- [ ] `/health` and `/ready` verified in deployment environment
- [ ] restore path for legal records understood by operator

## Documentation checks
- [ ] README is current
- [ ] docs links verified
- [ ] QA checklist reflects current workflow
- [ ] hiring-manager snapshot reflects actual feature set
