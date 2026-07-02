# Repository Tour

This document is written for employers, hiring managers, and technical reviewers who want to understand the repo quickly without reading every file first.

## Why this project exists
Music studios often finish a writing or production session with broad agreement on splits, but not with a clean operational path to capture signatures, send copies, and preserve a trustworthy record. This project was built to solve that gap.

The product goal is straightforward:
- capture split-sheet details while the session is still fresh
- support either in-room signing or invite-link signing
- create a final PDF artifact
- keep enough audit state to make the record useful later
- expose the same workflow through both a web app and a plugin-ready API

## What to read first
1. `README.md`
2. `HIRING_MANAGER.md`
3. `docs/architecture.md`
4. `docs/api.md`
5. `docs/deployment.md`

## Repo layout

### Core application
- `server.js` — main Express entry point, route wiring, middleware, and runtime orchestration
- `views/` — EJS templates for landing page, split-sheet flow, signer view, and admin surfaces
- `public/` — static assets for the browser UI

### Business logic and persistence
- `services/auth-service.js` — registration, login, refresh tokens, and account ownership
- `services/database-service.js` — SQLite and PostgreSQL provider abstraction
- `services/split-sheet-service.js` — validation rules, signer workflow, finalization logic
- `services/submission-service.js` — submission storage and record orchestration

### Plugin work
- `vst/` — JUCE-based standalone/VST3 client shell for DAW use
- `vst/src/ApiClient.*` — API transport for plugin auth and split-sheet operations
- `vst/src/PluginEditor.*` — plugin UI and multi-step workflow
- `vst/src/PluginProcessor.*` — plugin processor shell

### Testing and operations
- `tests/` — smoke coverage for local and PostgreSQL-backed flows
- `scripts/` — local setup scripts, including PostgreSQL helper scripts
- `docs/` — architecture, API, deployment, QA, release, and security notes

## Architecture at a glance
The system has four user-facing entry points:
- web user creating a split sheet
- signer opening a tokenized link
- admin reviewing or reminding
- DAW user entering the workflow through the plugin

These all feed into the same backend rules:
- split validation
- signer status transitions
- persistence
- PDF generation
- email delivery

## What makes this portfolio-relevant
This repository is useful to employers because it shows more than isolated code samples:
- product framing around a real business problem
- backend design that encodes domain rules
- multiple client surfaces against one service layer
- practical documentation and deployment thinking
- evidence of iteration from local tool to public-ready direction

## What still needs hardening
This repo is intentionally honest about its current stage:
- the VST client is functional but still has UX bugs around some signature capture paths
- cloud deployment is planned and documented, but still evolving
- security and compliance posture is pragmatic, not enterprise-complete

That tradeoff is part of the value of the repo: it shows a real build in progress with clear upgrade paths rather than a polished but unrealistic sample.
