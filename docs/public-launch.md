# Public Launch

## Current status
The product is close to public-ready without live payments.

Already in place:
- public landing page
- hosted app
- public signup
- email verification
- password reset
- invite-based split completion
- hosted plugin target
- blog section
- plugin pricing/storefront page
- request-level rate limiting

Not live yet:
- Stripe payments
- automatic paid download fulfillment in production
- code-signed installer

## What can be promoted now
- the hosted app workflow
- the plugin demo and test flow
- the rights-workflow positioning
- the blog / SEO surface
- producer / writer / sync-facing education content

## Recommended order
1. Promote the workflow and collect early interest
2. Let users create accounts and test the hosted app
3. Validate plugin install on clean machines
4. Turn on Stripe in test mode
5. Run one full AWS checkout test
6. Switch Stripe to live mode
7. Publish final commercial offer

## Minimum prelaunch checklist
- `npm test` passes
- `node --check server.js` passes
- landing page loads
- blog index and blog post pages load
- signup flow works
- password reset flow works
- plugin signs in against hosted API
- invite-based split flow completes
- SES emails arrive consistently

Current repo status already satisfies the technical checklist above in staging.

## Launch-day checklist
- live Stripe keys stored in Secrets Manager
- live Stripe webhook endpoint created
- installer uploaded to the configured delivery path
- ECS task definition rendered with live secrets
- ECS service updated successfully
- one live $10 purchase completes end to end
- installer download works from purchase confirmation

## Risk areas to watch
- email deliverability
- plugin installer trust warnings until code signing is added
- support load from password reset and first-time onboarding
- split validation friction if contributors enter bad percentages

## Messaging guidance
Lead with:
- faster session closeout
- cleaner split records
- invite-based signature collection
- sync-readiness and chain-of-title clarity

Do not lead with:
- backend stack
- AWS details
- API language unless the audience is technical
