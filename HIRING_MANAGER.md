# Hiring Manager Snapshot

## Executive summary
`split-sheet-open-sign` is a workflow platform for music studios to create split sheets, collect signatures, track signer progress, generate final PDF packets, and preserve lightweight legal records.

It exists because studio paperwork is often handled manually at the worst possible time: right after a writing or production session, when everyone wants to leave and no one wants to chase signatures later.

This repository is valuable as a hiring artifact because it combines:
- a real business problem
- a productized workflow
- a backend service layer
- operational documentation
- a second client surface through a JUCE-based VST / standalone plugin

## What problem this solves
Studios regularly agree on song splits verbally, but the agreement often does not become a durable record until much later, if at all. That creates friction, ambiguity, and avoidable risk.

This project was built to:
- capture split information immediately
- support either in-session or invite-based signature collection
- preserve signer state transitions
- generate final downloadable records
- create a practical path from an internal tool to a public-facing product

## What this project demonstrates
### Product and systems thinking
- Identifies a narrow but meaningful operational bottleneck
- Builds around actual user behavior rather than idealized workflows
- Creates one core workflow that can be used from multiple entry points
- Documents a credible evolution path from local-first tool to public cloud product

### Backend engineering
- Express application with both server-rendered pages and authenticated JSON APIs
- Shared validation around domain rules such as writer and publisher totals
- Split-sheet draft, finalize, and signer-completion states
- Tokenized signer links for low-friction completion
- PDF generation and email delivery triggered by workflow state
- Provider abstraction for SQLite and PostgreSQL-backed persistence

### Architecture maturity
- Service separation for auth, submission orchestration, database access, and split-sheet rules
- Health and readiness endpoints
- Admin review and reminder workflow
- Local-first persistence with cloud migration posture documented
- Plugin-safe API foundation

### Communication maturity
- README written to onboard both technical and non-technical readers
- Dedicated hiring-manager summary
- Architecture, deployment, API, QA, security, and repo-tour docs
- Visual architecture diagram and repository map

## Why this is a credible portfolio project
This is not just a CRUD scaffold with a custom theme. Hiring managers can evaluate:

- how a product problem was selected
- how the scope was kept realistic
- how business rules became backend rules
- how multiple clients were aligned to one backend
- how tradeoffs were made and documented
- how the repo was prepared for external review

## Technical shape
### User-facing surfaces
- browser workflow for split-sheet creation
- tokenized signer flow
- admin review flow
- JUCE standalone/VST3 client shell

### Core backend responsibilities
- registration, login, refresh, logout, current-user lookup
- split-sheet validation and ownership
- draft and finalized submission paths
- signer status progression
- PDF artifact creation
- SMTP / SES-compatible delivery path

### Persistence story
- SQLite is the current default for local use and fast iteration
- PostgreSQL is supported through the service layer as the intended public-cloud path

## Engineering tradeoffs
### Why server-rendered EJS
The product needed to move quickly around workflow correctness, not frontend framework complexity. Server rendering kept the stack smaller and easier to debug.

### Why SQLite first
This started as a local-first studio operations tool. SQLite keeps setup simple, makes data easy to inspect, and lowers friction for internal use.

### Why tokenized signer links
Signer accounts would add friction to the exact moment where speed matters most. Tokenized links are a pragmatic fit for this workflow.

### Why add a VST client
The real end-state is not just a browser app. If the tool is meant for studios, the fastest place to use it is often inside the DAW session. The plugin work shows product expansion through the same API contract.

## Current limitations
- not a regulated e-sign compliance platform
- plugin signature capture still has UX bugs in some in-session paths
- public-cloud deployment is documented but still evolving
- auth and role separation should be hardened before broader exposure

## Business impact if extended
- less paperwork drift after sessions
- cleaner record-keeping for rights splits
- faster contributor follow-up
- easier delivery of final paperwork packets
- a stronger platform foundation for public launch

## Good interview talking points
- why local-first was the right initial constraint
- how workflow state was modeled
- why multiple clients were built against one backend
- what would need to change for a public SaaS release
- where the plugin architecture is promising and where it still needs work
