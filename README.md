# Split Sheet Studio

`Split Sheet Studio` is a music-rights workflow platform for split sheets, signatures, delivery, and record retention.

It runs today as:
- a public marketing surface at `https://splitsheetstudio.com`
- a hosted app at `https://app.splitsheetstudio.com`
- a signer flow for invite-based completion
- an admin review surface
- a JSON API for external clients
- a JUCE-based standalone / `VST3` plugin for DAW use

This repository is the full product workspace: web app, API, plugin client, AWS deployment scripts, tests, and operator-facing documentation.

## Why this project exists
Studios and writing rooms often leave a session with verbal agreement on ownership but no clean operational path to:
- capture splits immediately
- collect signatures fast
- send copies to contributors
- preserve a final record

That gap creates friction at the exact moment everyone wants to leave the room.

`Split Sheet Studio` exists to remove that friction with a workflow that is:
- fast enough for the room
- structured enough for records
- flexible enough for browser and DAW use

## Live product surfaces

### Public-facing surfaces
- `https://splitsheetstudio.com` -> landing / product entry
- `https://www.splitsheetstudio.com` -> landing alias
- `https://app.splitsheetstudio.com` -> hosted app
- `https://staging.splitsheetstudio.com` -> staging alias

### Runtime surfaces inside the product
These are the practical micro-apps or workflow surfaces that make up the system:

1. **Marketing landing**
   - explains the product
   - routes users into the hosted app
   - now includes plugin pricing entry and blog access

2. **Hosted app**
   - account registration and login
   - email verification and password reset
   - split-sheet creation
   - draft / finalize workflow

3. **Signer portal**
   - mobile-friendly, no-account-required signing
   - expiring and resendable secure links
   - explicit per-contributor review confirmation
   - final packet completion trigger only after every signature

4. **Admin surface**
   - submission review
   - signer timeline visibility
   - reminder actions
   - user plan management and monthly usage visibility
   - artifact access

5. **JSON API**
   - auth endpoints
   - draft / finalize endpoints
   - status endpoints for external clients

6. **DAW plugin**
   - JUCE standalone / `VST3` client
   - compact session-first UI
   - hosted API login and submission flow

7. **Plugin storefront**
   - hosted pricing page
   - Stripe-ready Checkout session flow
   - gated installer delivery path

8. **Content layer**
   - product blog for search visibility
   - educational articles around split sheets and sync-readiness

## What the system does
- creates split sheets
- validates writer and publisher percentages
- supports composition, master recording, or combined ownership splits
- supports in-session or invite-based signatures
- tracks signer state (`invited`, `viewed`, `reminded`, `expired`, `agreed`, `signed`)
- records invite and completion-email delivery status
- locks remote split sheets only after every contributor agrees and signs
- generates final PDFs
- stores final packets durably
- emails final results
- exposes the same workflow to the web app and plugin

## Blak Marigold visual system
- bronze, copper, champagne, espresso, and warm ivory palette derived from the Blak Marigold studio brand
- real brushed-bronze texture shared by the marketing site and embedded directly into the native VST binary
- engraved panel geometry, restrained metallic highlights, and high-contrast form controls
- consistent premium presentation across the public site, pricing, blog, standalone app, and Studio One plugin
- keyboard focus, readable contrast, reduced-motion support, and responsive layouts remain part of the design system

## Current architecture

### Application stack
- `Node.js`
- `Express`
- `EJS`
- `PDFKit`
- `Nodemailer`
- `Redis` session store support
- `SQLite` for local-first development
- `PostgreSQL` for hosted runtime
- `JUCE` for the plugin / standalone app

### AWS services currently used
- `Route 53` for domain registration and DNS
- `ACM` for TLS certificates
- `Application Load Balancer` for HTTPS termination and redirects
- `ECR` for container images
- `ECS Fargate` for the hosted Node runtime
- `RDS PostgreSQL` for hosted persistence
- `ElastiCache Redis` for shared session state
- `S3` for final PDF storage
- `SES` for transactional email delivery
- `Secrets Manager` for runtime secrets
- `CloudWatch Logs` for container logs
- `IAM` for task execution and runtime permissions

## System flow
1. User signs in through the hosted app or plugin
2. User creates a split sheet
3. Server validates domain rules and persists the draft or final record
4. Workflow either:
   - captures signatures in-session, or
   - sends invite links to contributors
5. Final signer completion generates the final PDF packet
6. The server records agreement timestamps and the final audit checksum
7. Final packet is uploaded to `S3`
8. Transactional email sends the completed copy to every contributor through `SES`
9. Admin and API clients can retrieve delivery and signer state

## Public-launch posture
The hosted app, plugin login target, signup flow, password reset flow, invite workflow, blog, legal pages, pricing/storefront surface, plugin update metadata, and request-level rate limiting are all in this repo now.

### Plans and usage limits
The app has an internal subscription model with Stripe subscription checkout hooks:

| Plan | Price target | Monthly split-sheet limit | Intended user |
| --- | --- | ---: | --- |
| Free | `$0` | `3` | testing, first-time users, low-volume creators |
| Creator | `$5/mo` | `25` | artists, producers, and songwriters who create split sheets regularly |
| Studio Pro | `$20/mo` | `250` | studios, engineers, managers, and higher-volume teams |

Limits are enforced when a user finalizes a split sheet. Drafts do not count. Admins can move users between plans manually from `/admin`. When `STRIPE_SECRET_KEY` is configured, paid users can start Creator or Studio Pro subscription checkout from `/account`, and Stripe webhooks update `users.plan_key`.

What is still intentionally deferred:
- live Stripe account keys, webhook secret, and Stripe Customer Portal configuration
- code signing for the Windows installer
- attorney review of public legal templates

That means the product can be validated publicly before live payments are turned on.

### Revisions after completion
Completed split sheets remain immutable as signed PDF records. If a split needs to change later, the final completion email includes a requester-only revision link. The requester signs in, reloads the previous song and contributor data, adjusts the split, and sends a new version to every contributor. The revised split is not final until all contributors sign again.

## Repository structure

### Core app
- `server.js` -> Express entry point, routing, runtime orchestration
- `services/auth-service.js` -> registration, verification, reset, login, refresh, ownership
- `services/database-service.js` -> SQLite / PostgreSQL provider selection
- `services/submission-service.js` -> submission lifecycle and persistence
- `services/split-sheet-service.js` -> split-sheet rules and payload shaping
- `services/storefront-service.js` -> plugin purchase records and gated download tracking
- `content/blog-posts.js` -> blog content source
- `content/legal-pages.js` -> public terms, privacy, refund, E-SIGN consent, and disclaimer content
- `views/` -> landing, app, auth, signer, success, admin, pricing, and blog templates
- `public/` -> shared browser styling and assets

### Plugin
- `vst/` -> JUCE-based plugin workspace
- `vst/src/ApiClient.*` -> hosted API transport
- `vst/src/PluginEditor.*` -> compact DAW workflow UI
- `vst/src/PluginProcessor.*` -> plugin processor shell
- `vst/installer/` -> Windows installer packaging

### AWS / operations
- `deploy/aws/` -> provisioning, secret sync, task-definition rendering, and ECS deployment scripts
- `deploy/proxmox/` -> local LXC deployment script and LAN runbook
- `Dockerfile` -> hosted container runtime
- `docker-compose.yml` -> local container path
- `tests/` -> smoke coverage for local and PostgreSQL-backed flows

## Local development
```powershell
cd C:\Users\BlakM\OneDrive\Documents\Split Sheet App\repo
npm install
npm run dev
```

Local dev URL:
- `http://localhost:5050`

## Plugin status
The plugin is already wired to the hosted app by default:
- default API target: `https://app.splitsheetstudio.com`
- startup update check: `/api/plugin/update?currentVersion=...`
- latest version is controlled by `PLUGIN_LATEST_VERSION_LABEL`
- forced upgrade floor is controlled by `PLUGIN_MINIMUM_SUPPORTED_VERSION`
- update download URL: `https://app.splitsheetstudio.com/downloads/plugin/latest`
- public installer artifact storage: S3 key `downloads/SplitSheetStudio-Setup-0.1.1.exe`

Current installer output:
- `vst\dist\SplitSheetStudio-Setup-0.1.1.exe`

Current VST release:
- `0.1.1` adds the Blak Marigold logo to the plugin UI and preserves the hosted update-check path for older installs.

## Deployment status
The public cloud path is no longer theoretical.

This repo has already been moved to a live AWS stack with:
- public DNS
- HTTPS
- hosted app
- hosted plugin target
- managed Postgres
- shared sessions
- durable PDF storage
- SES transactional email foundation

The current hosted runtime is verified through:
- `https://app.splitsheetstudio.com/health`
- `https://app.splitsheetstudio.com/api/ready`
- live pricing and blog routes
- public legal routes under `https://splitsheetstudio.com/legal/...`
- plugin sign-in and end-to-end split email delivery tests

Local Proxmox copy:
- LXC `103` / `split-sheet-studio`
- LAN URL: `http://192.168.1.237:5050`
- repeatable deploy: `powershell -ExecutionPolicy Bypass -File .\deploy\proxmox\deploy-to-lxc.ps1 -SyncLocalEnv`

## Remaining public-launch work
The core hosted system is live, but these remain the main product-hardening items:
- plugin installer final verification on a clean machine
- code signing for installer / binaries
- attorney review of privacy policy / terms / commercial packaging
- live Stripe keys and webhook secret
- purchase-to-download fulfillment with live Stripe enabled
- alerting / uptime monitoring beyond base CloudWatch logs

## Fast links
- Product entry: `https://splitsheetstudio.com`
- Hosted app: `https://app.splitsheetstudio.com`
- Health: `https://app.splitsheetstudio.com/health`
- Ready: `https://app.splitsheetstudio.com/api/ready`

## Documentation map
- `docs/architecture.md`
- `docs/api.md`
- `docs/deployment.md`
- `docs/public-launch.md`
- `docs/release-checklist.md`
- `docs/repo-tour.md`
- `deploy/aws/README.md`

## Summary
`Split Sheet Studio` is a studio paperwork system that moved from local-first prototype to hosted product foundation.

This repository now reflects the actual platform:
- public domain
- hosted app
- AWS-backed runtime
- plugin client
- operational scripts
- content/blog surfaces
- product documentation
