# Email Automation Handoff

Split Sheet Studio stores email contacts in its own database so an external automation platform can be connected later without changing the signup or contributor workflow.

## Contact Rules

- Account holders and contributors are recorded as `transactional_only` unless they explicitly opt into marketing.
- Newsletter and other marketing messages may only target contacts whose `marketing_status` is `subscribed`.
- Transactional messages, including invitations, signature requests, completion notices, password resets, and account security notices, do not require marketing consent.
- An unsubscribe changes the contact to `unsubscribed`; later transactional activity must not silently resubscribe that address.
- A previously unsubscribed contact may subscribe again only through a new explicit opt-in action.

## n8n Export Workflow

Use the token-protected API endpoint for automation:

```text
GET https://app.splitsheetstudio.com/api/admin/marketing-contacts
Authorization: Bearer <CONTACT_EXPORT_TOKEN>
```

The default response includes only contacts where `marketingStatus = "subscribed"`.

Optional filters:

- `?status=subscribed` - marketing subscribers only; use this for normal email journeys
- `?status=transactional_only` - recorded transactional contacts without marketing consent
- `?status=unsubscribed` - suppression/audit list
- `?status=all` - full operator export; do not import this whole list into marketing

n8n mapping:

1. Map `email`, `displayName`, `latestSource`, and `consentAt` into the email platform.
2. Store `unsubscribeUrl` and include it in every marketing message.
3. Keep the external subscriber ID in n8n or the email provider rather than replacing the application contact record.
4. Treat `marketing_contact_events` as the consent audit trail and never rewrite old events.

The application database remains the consent source of truth. Contributor addresses must not be imported into a promotional journey unless that contributor separately opted in.
