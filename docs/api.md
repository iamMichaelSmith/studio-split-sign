# API Foundation

This repository now includes a JSON API layer for split-sheet workflows and plugin integration.

## Current purpose
- provide a plugin-safe transport layer separate from the EJS UI
- reuse the existing split-sheet business rules
- support authenticated web and future `VST3` clients
- support local SQLite now and PostgreSQL later behind the same route contract

## Current endpoints
- `GET /api/health`
- `GET /api/ready`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/split-sheets`
- `GET /api/split-sheets/:id`
- `POST /api/split-sheets/drafts`
- `PUT /api/split-sheets/:id/draft`
- `POST /api/split-sheets/validate`
- `POST /api/split-sheets`
- `GET /api/split-sheets/:id/status`

## Current status
The backend now supports:
- SQLite-backed local development
- PostgreSQL-compatible persistence adapters
- authenticated account ownership
- draft and finalized split-sheet flows

What is ready:
- shared split-sheet validation between web and API requests
- token-based auth with user registration, login, refresh, logout, and current-user lookup
- split-sheet list, detail, draft, finalize, and status endpoints
- SQLite-backed local persistence
- PostgreSQL adapter support behind the same service contract
- legacy JSON import into the current database-backed model

What is not ready yet:
- production PostgreSQL environment verification in this repo
- fine-grained authorization and team roles
- richer dashboard/catalog endpoints beyond the current split list/detail API
- rate limiting for public API traffic
- password reset and account recovery

## Draft flow
Drafts are stored as split sheets with `status: "draft"`.

Recommended plugin flow:
1. `POST /api/auth/login`
2. `POST /api/split-sheets/drafts`
3. `PUT /api/split-sheets/:id/draft` as the user edits
4. `GET /api/split-sheets` for dashboard/state restore
5. `POST /api/split-sheets` with `draftId` to finalize and send

## Request shape for `POST /api/split-sheets`
```json
{
  "draftId": "optional-draft-id",
  "songTitle": "Example Song",
  "date": "2026-07-01",
  "allPartiesAgree": true,
  "collectSignaturesByInvite": true,
  "contributors": [
    {
      "legalName": "Writer One",
      "role": "Writer",
      "email": "writer1@example.com",
      "writerShare": 50,
      "publisherShare": 50
    },
    {
      "legalName": "Writer Two",
      "role": "Producer",
      "email": "writer2@example.com",
      "writerShare": 50,
      "publisherShare": 50
    }
  ]
}
```

## Next API priorities
1. validate the PostgreSQL path against a real database
2. profile and catalog endpoints
3. rate limiting and public-traffic hardening
4. password reset and account recovery
5. team roles and shared studio access
