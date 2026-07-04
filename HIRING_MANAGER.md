# Hiring Manager Snapshot

## Executive summary
`SplitSheet Studio` is a rights-workflow product for music sessions. It captures split sheets, supports in-session or invite-based signatures, generates final packets, stores artifacts, and exposes the same workflow to both a hosted web app and a DAW plugin.

This repository is useful as a hiring artifact because it combines:
- a real operations problem
- product framing
- backend implementation
- cloud deployment work
- a second client runtime through a `VST3` / standalone plugin

## What makes this project substantive
- It solves a narrow but real workflow problem instead of building generic CRUD screens
- It encodes business rules that matter to ownership records
- It supports multiple user surfaces against one backend contract
- It includes live AWS deployment infrastructure, not only local code
- It shows product expansion from browser to DAW instead of staying single-surface

## What an employer can evaluate from this repo

### Product thinking
- identifying a specific workflow bottleneck
- keeping scope focused around session closeout
- deciding where the browser ends and the plugin begins
- separating public marketing entry from authenticated product use

### Backend engineering
- Express app with server-rendered pages and JSON APIs
- SQLite / PostgreSQL provider split
- Redis-backed session handling for hosted runtime
- S3-backed final artifact retrieval path
- tokenized signer-link flow
- PDF generation and email delivery on workflow completion

### Cloud / operations thinking
- Route 53 + ACM + ALB for public HTTPS delivery
- ECS Fargate runtime
- ECR image pipeline
- RDS PostgreSQL
- ElastiCache Redis
- S3 artifact storage
- SES transactional email setup
- Secrets Manager integration
- CloudWatch log visibility

### Client-platform thinking
- JUCE-based standalone / `VST3` shell
- plugin API login flow
- plugin workflow shaped differently from the full browser app
- hosted default API target instead of localhost

## Main user/runtime surfaces
- landing site at `splitsheetstudio.com`
- hosted product app at `app.splitsheetstudio.com`
- signer portal
- admin review surface
- JSON API
- DAW plugin

## Good interview topics
- why this started local-first but moved to AWS
- how workflow rules became backend validation rules
- why tokenized signer links are better than forced signer accounts here
- why the plugin should target the same hosted API instead of embedding separate logic
- how domain split, TLS, sessions, storage, and email were wired for public access

## Current limitations
- password reset is not finished
- plugin installer still needs final clean-machine validation
- email branding is being polished
- enterprise-grade auth / compliance work remains out of scope for now

## Bottom line
This repo demonstrates product judgment, systems design, implementation depth, and deployment maturity in a way that a simple demo app does not.
