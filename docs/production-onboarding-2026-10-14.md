# Production onboarding release

Enabled October 14, 2026 with owner approval. AWS ECS task definition: splitsheetstudio-staging:85. Application image: 20261014-windows-013. Release ID: 20261014-onboarding-production.

Both direct-signup and invited-contributor journeys run on days 0, 2, 4, 7, 10, and 14. n8n checks due emails every 15 minutes. Production does not use beta time acceleration.

The app uses its existing AWS SES sender, displayed as Split Sheet Studio. The footer is 14205 N Mopac Expressway, STE 570, Austin, TX 78728. Every header logo and campaign image links to https://splitsheetstudio.com. The Windows VST3 and skins email embeds the original six-skin website gallery.

Production workflow IDs: RQ1Stni5Vg6tEDtf (direct) and V7uedCtC8gMzmg5d (invited). Each uses the existing restricted Header Auth credential. The token stays in AWS Secrets Manager and n8n, outside Git. Workflow JSON files are reusable inactive, dry-run templates rather than exports containing live credentials.

Only new enrollments with verified active accounts and current marketing consent can receive the sequence. Existing users are not backfilled. Unsubscribes suppress later sends, atomic claims prevent duplicate steps, and uncertain delivery requires review. Invited contributors finish signing before upgrade messages proceed.

Validation: ECS deployment completed and healthy; both production automation endpoints return HTTP 200 with enabled=true and mode=production; both n8n dry runs succeeded with no due recipients; business footer and six-skin attachment verified. Earlier release validation passed 39 application checks plus smoke and 22 PostgreSQL checks.

Windows 0.1.3 was subsequently published with valid timestamped Azure signatures as Blak Marigold Pro LLC; see windows-release-2026-10-14.md for artifact verification.
