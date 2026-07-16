# SplitSheet Studio

`SplitSheet Studio` is a music-rights workflow platform for split sheets, signatures, delivery, and record retention.

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

`SplitSheet Studio` exists to remove that friction with a workflow that is:
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
   - invite-link signing
   - tokenized signer access
   - final packet completion trigger

4. **Admin surface**
   - submission review
   - signer timeline visibility
   - reminder actions
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
- supports in-session or invite-based signatures
- tracks signer state (`invited`, `viewed`, `reminder sent`, `signed`)
- generates final PDFs
- stores final packets durably
- emails final results
- exposes the same workflow to the web app and plugin

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
6. Final packet is uploaded to `S3`
7. Transactional email sends through `SES`
8. Admin and API clients can retrieve the resulting record state

## Public-launch posture
The hosted app, plugin login target, signup flow, password reset flow, invite workflow, blog, pricing/storefront surface, and request-level rate limiting are all in this repo now.

What is still intentionally deferred:
- live Stripe payment activation
- final purchase-to-download automation in production
- code signing for the Windows installer

That means the product can be validated publicly before live payments are turned on.

## Repository structure

### Core app
- `server.js` -> Express entry point, routing, runtime orchestration
- `services/auth-service.js` -> registration, verification, reset, login, refresh, ownership
- `services/database-service.js` -> SQLite / PostgreSQL provider selection
- `services/submission-service.js` -> submission lifecycle and persistence
- `services/split-sheet-service.js` -> split-sheet rules and payload shaping
- `services/storefront-service.js` -> plugin purchase records and gated download tracking
- `content/blog-posts.js` -> blog content source
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

Current installer output:
- `vst\dist\SplitSheetStudio-Setup-0.1.0.exe`

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
- plugin sign-in and end-to-end split email delivery tests

## Remaining public-launch work
The core hosted system is live, but these remain the main product-hardening items:
- plugin installer final verification on a clean machine
- code signing for installer / binaries
- privacy policy / terms / commercial packaging
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
`SplitSheet Studio` is a studio paperwork system that moved from local-first prototype to hosted product foundation.

This repository now reflects the actual platform:
- public domain
- hosted app
- AWS-backed runtime
- plugin client
- operational scripts
- content/blog surfaces
- product documentation
