# Architecture

![Architecture diagram](assets/architecture-diagram.svg)

## Overview
`SplitSheet Studio` is a multi-surface music-rights workflow system.

It has one core business workflow but several different access surfaces:
- marketing landing
- hosted app
- signer portal
- admin surface
- JSON API
- DAW plugin

The design goal is to keep the workflow logic centralized while allowing different runtime experiences to consume it.

## Runtime surfaces

### 1. Landing surface
- host: `splitsheetstudio.com`
- purpose: public entry, product explanation, route into the app

### 2. Hosted app
- host: `app.splitsheetstudio.com`
- purpose: account login, draft creation, final submission, browser-first use

### 3. Signer portal
- path pattern: `/split-sheet/sign/:id/:token`
- purpose: low-friction invite signing without requiring signer accounts

### 4. Admin surface
- path pattern: `/admin/*`
- purpose: review, reminders, record access, timeline visibility

### 5. JSON API
- paths under `/api/*`
- purpose: hosted client contract for browser auth state, plugin login, draft/finalize, and status lookups

### 6. DAW plugin
- JUCE standalone / `VST3`
- purpose: studio-session-first workflow inside the DAW environment

## Core stack
- `Node.js`
- `Express`
- `EJS`
- `PDFKit`
- `Nodemailer`
- `SQLite` local path
- `PostgreSQL` hosted path
- `Redis` shared sessions
- `JUCE` plugin client

## AWS architecture in use
- `Route 53` -> domain registration and DNS
- `ACM` -> certificate issuance
- `Application Load Balancer` -> HTTPS entry and host handling
- `ECS Fargate` -> app runtime
- `ECR` -> image storage
- `RDS PostgreSQL` -> hosted relational persistence
- `ElastiCache Redis` -> shared session store
- `S3` -> final PDF storage
- `SES` -> transactional email
- `Secrets Manager` -> runtime secrets
- `CloudWatch Logs` -> container logs

## Request flow

### Browser app
1. request hits `ALB`
2. `ALB` terminates TLS
3. request reaches ECS task
4. app resolves host behavior:
   - root / `www` -> landing
   - `app.*` -> product app
5. app uses:
   - `Redis` for hosted sessions
   - `PostgreSQL` for app data
   - `S3` for final artifact fallback
   - `SES` for transactional mail

### Plugin app
1. plugin authenticates against `https://app.splitsheetstudio.com`
2. plugin uses JSON API endpoints for session and split-sheet actions
3. plugin does not embed workflow rules separately; server stays authoritative

### Signer flow
1. contributor receives signer link
2. signer token resolves the submission and contributor identity
3. signer submits typed and drawn signature
4. final signer completion generates final packet
5. completion email is sent

## Data responsibilities

### PostgreSQL
- users
- auth sessions
- submissions
- ownership and workflow metadata

### Redis
- shared session storage for hosted runtime

### S3
- durable storage for final PDF packets
- fallback retrieval when local filesystem copy is unavailable

## Workflow responsibilities
- validate split-sheet fields
- enforce writer totals
- enforce publisher totals
- issue signer tokens
- track signer state transitions
- generate PDF artifacts
- trigger email delivery
- expose summaries to admin and API clients

## Why this shape works

### Shared backend logic
The browser app and plugin depend on the same backend behavior, which reduces drift between surfaces.

### Hosted runtime
The product is no longer limited to localhost. The AWS stack provides a credible public runtime foundation.

### Surface separation
Marketing and product traffic are separated at the host level:
- `splitsheetstudio.com` -> public entry
- `app.splitsheetstudio.com` -> authenticated product surface

### Gradual hardening
The system started local-first, but the structure supports staged hardening:
- SQLite -> PostgreSQL
- memory sessions -> Redis
- local PDFs -> S3
- local mail config -> SES

## Remaining architectural work
- password recovery flow
- request-level rate limiting
- stronger roles / permissions
- better plugin install / release automation
- observability beyond basic health + logs
