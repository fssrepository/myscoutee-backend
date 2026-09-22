# Personal calendar subscription — 2026-09-22

Status: feasibility research and proposed design; not implemented. This is a new addition after the completed implementation work, not a PASS or a blocker retroactively added to the existing QA cases.

## User request

- Calendar action next to the ordinary user's Affiliate action.
- Reusable setup from another device: do not replace the action with a global Sync/Unsync toggle.
- External calendar should eventually receive event changes; delayed refresh is acceptable.
- Avoid another Google developer application/API registration if possible.
- Reuse the existing common menu/progress-ring conventions and i18n.
- User referenced the end of a ChatGPT conversation titled “Firebase értesítés”. Its contents are not available through the current tools or repository, so no requirements from that missing conversation have been assumed.

## Recommended transport

A personal read-only iCalendar subscription over HTTPS, with a webcal handoff where supported. This is a live subscription URL, not a one-time imported ICS file. It requires no application-specific Google OAuth client. The URL is an access credential for the exported calendar, so it must be unguessable, scoped, recoverable for the authenticated owner and revocable; app login/API keys must not appear in it. A public production URL is needed for server-side calendar fetches; localhost is insufficient for Google/Outlook cloud polling.

CalDAV is a standardized calendar access/edit protocol, not a universal browser “sync now” mechanism. Connecting to Google's CalDAV server still requires a registered OAuth client. Running our own CalDAV server is a different and larger feature, with client-specific setup and authentication.

## Proposed UI and truthful status

A compact Calendar popup is useful because provider setup differs: subscription handoff plus copyable personal URL and short provider-specific help. The action remains available on every device; reopening reuses the same subscription identity. Already subscribed users of the same calendar account should not be encouraged to add duplicates.

Use the existing request-progress ring only while preparing/retrieving the subscription link. Handing off the link does not prove that the calendar app accepted it or downloaded events. Do not show “synced” or a countdown to an external refresh without evidence. External calendar services control refresh timing; requests from our app cannot force their polling schedule.

Data inclusion rules and the referenced brainstorming remain to be settled before an exporter is implemented. In particular, do not silently export every visible Explore item, draft, invitation, asset record or participant's personal information.

## Primary-source findings

- Google URL subscription setup is documented for the desktop web interface; the Google Calendar mobile apps cannot add a new URL subscription: https://support.google.com/calendar/answer/37100?hl=en
- Apple supports subscribed calendars and iCloud propagation across devices: https://support.apple.com/en-ie/102301
- Outlook distinguishes snapshot import from subscription and notes that refresh can take more than 24 hours: https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web
- Google CalDAV requires Cloud project/client registration and HTTPS OAuth 2.0: https://developers.google.com/workspace/calendar/caldav/v2/guide?hl=en
- CalDAV specification: https://www.rfc-editor.org/rfc/rfc4791.html
