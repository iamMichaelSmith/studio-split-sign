# Security Posture

## Production safeguards

The hosted runtime fails closed when critical production settings are unsafe. Startup validation requires:

- HTTPS public URLs and secure cookies
- PostgreSQL persistence and Redis-backed sessions
- verified TLS for PostgreSQL using the AWS RDS CA bundle
- private S3 artifact storage
- strong, separate session and API secrets
- non-default administrator credentials
- email verification with authentication debug output disabled
- configured sender and support addresses

Requests receive a unique request ID, structured JSON access logging, Content Security Policy, HSTS, frame protection, a strict referrer policy, and a restrictive permissions policy. Private application surfaces are marked `no-store` and `noindex`. State-changing browser requests are protected by same-origin checks, and sensitive endpoints use request rate limits.

## Data and workflow protections

- Passwords are hashed before storage.
- Sessions are stored in Redis and use secure, HTTP-only cookies in production.
- Signer access uses expiring, scoped tokens.
- Final records are immutable; later adjustments create a linked revision.
- Final PDFs are stored in a private, encrypted, versioned S3 bucket.
- Database connections require certificate verification.
- Transactional email and optional marketing consent are treated separately.
- Administrator access uses constant-time credential comparison and must use non-default secrets.

## AWS controls

- Application traffic terminates at an HTTPS Application Load Balancer.
- ECS task permissions are limited to the required S3 and SES actions.
- RDS has seven-day backups, deletion protection, and automatic minor updates.
- S3 has public-access blocking, encryption, and versioning enabled.
- CloudWatch logs retain 90 days of application output.
- CloudWatch alarms monitor ECS CPU, ECS memory, RDS free storage, and ALB target 5xx responses.
- Alarm delivery uses an SNS operations topic.

## Remaining commercial-release controls

- Sign the Windows installer and plugin binaries with a trusted code-signing certificate.
- Complete a clean-machine install and DAW compatibility matrix.
- Configure Stripe keys, webhook signing secret, products, prices, and live checkout tests.
- Configure Google and Apple OAuth only if those sign-in options are enabled publicly.
- Obtain qualified legal review of the Terms, Privacy Policy, e-sign disclosures, refund language, and music-rights disclaimer.
- Add AWS WAF or an edge rate-limiting layer when traffic or abuse warrants it.

## Product boundary

Split Sheet Studio records contributor-provided information and workflow events. It is not a law firm, PRO, publisher, copyright office, royalty administrator, or substitute for legal advice. Legal pages can reduce ambiguity but cannot eliminate the operator's legal responsibility. Public launch should include qualified counsel review and appropriate business insurance.

## Reporting

Security issues can be reported through `/.well-known/security.txt` or the support address configured for the hosted app. Never include passwords, signing tokens, private split-sheet contents, or other sensitive personal information in a public issue.
