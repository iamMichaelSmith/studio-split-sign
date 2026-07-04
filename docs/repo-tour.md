# Repository Tour

This document is for reviewers who want to understand the codebase quickly.

## Start here
1. `README.md`
2. `HIRING_MANAGER.md`
3. `docs/architecture.md`
4. `docs/deployment.md`
5. `deploy/aws/README.md`

## What lives where

### Application runtime
- `server.js` -> app entry, host-aware routing, middleware, app/api/admin wiring
- `views/` -> landing, product app, signer pages, success pages, admin pages
- `public/` -> shared browser styling and assets

### Business logic
- `services/auth-service.js` -> account and token lifecycle
- `services/database-service.js` -> SQLite / PostgreSQL runtime selection
- `services/submission-service.js` -> submission persistence orchestration
- `services/split-sheet-service.js` -> workflow shaping and validation rules

### Plugin
- `vst/` -> JUCE plugin workspace
- `vst/src/ApiClient.*` -> hosted API integration
- `vst/src/PluginEditor.*` -> DAW workflow UI
- `vst/src/PluginProcessor.*` -> plugin runtime shell
- `vst/installer/` -> Windows packaging

### Cloud / deployment
- `deploy/aws/bootstrap-networking.ps1`
- `deploy/aws/bootstrap-staging.ps1`
- `deploy/aws/bootstrap-ecs.ps1`
- `deploy/aws/bootstrap-secrets.ps1`
- `deploy/aws/provision-datastores.ps1`
- `deploy/aws/sync-runtime-secrets.ps1`
- `deploy/aws/render-task-definition.ps1`
- `deploy/aws/deploy-ecs-service.ps1`

### Validation / local helpers
- `tests/` -> smoke and PostgreSQL validation
- `scripts/` -> local setup helpers
- `Dockerfile` and `docker-compose*.yml` -> container path

## How the product is divided
The repo supports six practical surfaces:
- landing site
- hosted app
- signer portal
- admin surface
- JSON API
- DAW plugin

These are not six separate backends. They all depend on the same workflow rules.

## What matters most in review
If you only inspect a few parts of the repository, look at:
- `server.js`
- `services/split-sheet-service.js`
- `services/auth-service.js`
- `services/database-service.js`
- `deploy/aws/`
- `vst/src/`

## Why this repo is portfolio-relevant
This repository shows:
- workflow-driven product thinking
- backend rules that map to business/legal constraints
- local-first development with a real hosted AWS path
- a plugin client consuming the same service contract
- documentation aimed at real handoff and review
