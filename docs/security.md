# Security Notes

## Current protections
- Session auth for admin routes
- Login attempt throttling for admin login
- Optional secure cookie mode (`COOKIE_SECURE=true`)
- Tokenized signer links for invite flow
- Audit metadata in submissions and final packet checksum

## Required for production internet use
- Reverse proxy + HTTPS
- Strong randomized `SESSION_SECRET`
- Strong unique admin credentials
- Firewall allowlist/VPN access where possible

## Limitations
- Local JSON persistence is not tamper-proof by itself
- Not a substitute for regulated e-sign platforms in all legal contexts
