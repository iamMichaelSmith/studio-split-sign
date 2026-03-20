# Security Notes

## Current protections
The app currently includes pragmatic protections appropriate for local/LAN/internal workflow use:
- session auth for admin routes
- login-attempt throttling on admin login
- tokenized signer links for invite flow
- optional secure cookie mode with `COOKIE_SECURE=true`
- audit metadata captured in submissions
- final packet checksum for split sheet completion artifacts

## What is secure enough today
This project is well-positioned for:
- local desktop use
- internal office/studio network use
- controlled testing behind trusted network boundaries

## What is not yet the goal
This repo should not be represented as:
- a regulated e-sign compliance platform
- a tamper-proof records system
- a hardened multi-tenant SaaS application

## Required controls before broader deployment
Before exposing the app to wider internet traffic:
- set a strong random `SESSION_SECRET`
- replace any default admin credentials
- enable HTTPS via reverse proxy
- restrict access with VPN, firewall, or allowlists where possible
- review SMTP provider settings and sender identity
- define backup and restoration procedures for legal records

## Residual risks / limitations
- JSON persistence is operationally convenient but not immutable
- signer identity relies on possession of the tokenized URL
- admin auth is lightweight and should evolve for broader use
- reminder/email actions run inline rather than through a job queue

## Recommended next security upgrades
- move secrets into managed secret storage
- add stronger admin password policy or SSO
- store artifacts in managed storage with retention policy
- introduce structured audit logging
- add signature/event history normalization in persistent storage
