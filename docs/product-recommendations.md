# Product Recommendations

## Vision
Turn this into a fast legal capture system for end-of-session paperwork.

## What to optimize for
- Speed in studio sessions
- Clear legal intent and signer identity
- Immediate delivery to all relevant parties
- Reliable record retention and retrieval

## Recommended roadmap

### Phase A Fast session capture
- Session preset profiles per producer/engineer
- Contributor quick-add with saved contacts
- One-tap equal split and role presets
- Auto-save drafts per song title

### Phase B Signing flow integrity
- Individual signer invite links (tokenized)
- Required signer sequence or parallel signing options
- Signer completion tracking and reminders
- Prevent edits once first signature is captured unless version bump

### Phase C Legal packet quality
- Final compiled PDF with all signature images and audit info
- Evidence fields: timestamp, IP, user agent, signer email, token id
- Immutable checksum for final packet
- Version chain view for superseded drafts

### Phase D Music industry expansion
- Add producer agreement template
- Add beat lease/exclusive agreement template
- Add collaborator release and sample clearance intake
- Add split-to-PRO export helper fields

## Suggested data model additions
- `songId` stable key across versions
- `documentVersion`
- `signers[]` with status and signedAt
- `deliveries[]` with recipient and sentAt
- `auditEvents[]` append-only timeline

## Operational notes
- Keep local-first mode for speed and studio control
- Add optional cloud backup job to prevent single-machine risk
- Keep SMTP failure visible so staff can resend quickly
