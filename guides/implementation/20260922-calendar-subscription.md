# Personal calendar subscription — 2026-09-22

Status (2026-09-24): manual ICS export and concrete slot occurrences implemented; live QA evidence is in EVENT-CALENDAR-EXPORT-001-20260924.md. The research below is superseded and retained as decision history.

## Accepted implementation — manual download

- User selected **Sync calendar / Naptár szinkronizálása** beside ordinary-user Affiliate. One click downloads `myscoutee-calendar.ics`, with the existing AppMenu ring. No provider/setup popup, background sync, subscription token, native app or email sending. Desktop users can send the downloaded file themselves.
- Authenticated `GET /activities/events/calendar/export` resolves the actor from the session, with no caller-selected user ID. UTF-8 text/calendar attachment, private/no-store. Reuses personal event scope and canonical occurrence generation; local adapter uses a batched canonical membership lookup.
- Export active/published root events owned/organized by the actor or with accepted membership, with valid timezone-aware start/end and end in the future (includes ongoing). Exclude drafts, invitations, pending membership, watch-only, moderation-suppressed, deleted and past events. Slots-enabled parents export their concrete ongoing/upcoming occurrences instead of a duplicate parent summary. Participants require accepted membership on the occurrence; organizers receive the occurrence schedule. Uses existing recurrence/closed-date rules through the event mappers; no separate tournament-round expansion.
- Stable event-derived UID, export DTSTAMP, UTC start/end, title, location and DISPLAY reminder at event start. No participants, credentials or payments. RFC 5545 text escaping and 75-octet UTF-8-safe folding. No invented revision sequence or scheduling METHOD.
- Local and HTTP paths preserve the same contract. The download store prevents duplicate clicks, bounds the HTTP wait, discards results after account change and reports errors through the shared dialog. It does not claim that download proves import/sync.
- Mobile may offer an import dialog immediately or only when opening the downloaded file. Stable UID does not guarantee a particular importer's duplicate/update handling. Omitting a cancelled/left event does not remove its older imported entry.
- New QA: `guides/qa/checklists/event/EVENT-CALENDAR-EXPORT-001.md`, including physical Android import UI, repeated/changed import and offline calendar reminder. Earlier ADB package inspection is not proof of import. Reuses the versioned gallery fixture/launcher after reset, with separate calendar evidence.
- References reused: IntegrationSettingsController actor resolution, ActivitiesEventsService personal query, EventsService adapter dispatch, profile-editor AppMenu progress configuration and DialogStore. No new database/model or external API registration.

## Verification of the implementation (2026-09-23)

- Backend: `./gradlew --no-daemon --max-workers=2 :projects:profile:test --tests '*CalendarExport*Test'` — 5 tests PASS; `/tmp/calendar-backend-tests.log` and JUnit XML.
- Frontend: `node_modules/.bin/vitest run src/app/shared/core/common/calendar-export.spec.ts src/app/shared/ui/context/stores/calendar-export.store.spec.ts --environment node --maxWorkers 1` — 7 tests PASS; `/tmp/calendar-frontend-tests.log`. Covers snapshot selection/serialization, stable UID after time change, duplicate request guard, wrong-account response, invalid response/retry and timeout.
- Angular local build with two workers passed; output `/tmp/myscoutee-calendar-build`, log `/tmp/calendar-frontend-build.log`. EN/HU seed audit passed: 7,384 messages, three Mongo seeds. Diffs whitespace-clean.
- No dev stack running or started. `adb devices -l` returned no devices; physical import/duplicate handling/offline reminder NOT RUN. UI/HTTP full-flow awaits the user's stack and phone; no test calendar entries were created.

## Superseded research: original user request

- Calendar action next to the ordinary user's Affiliate action.
- Reusable setup from another device: do not replace the action with a global Sync/Unsync toggle.
- External calendar should eventually receive event changes; delayed refresh is acceptable.
- Avoid another Google developer application/API registration if possible.
- Reuse the existing common menu/progress-ring conventions and i18n.
- User referenced the end of a ChatGPT conversation titled “Firebase értesítés”. Its contents are not available through the current tools or repository, so no requirements from that missing conversation have been assumed.

## Superseded transport proposal

A personal read-only iCalendar subscription over HTTPS, with a webcal handoff where supported. This is a live subscription URL, not a one-time imported ICS file. It requires no application-specific Google OAuth client. The URL is an access credential for the exported calendar, so it must be unguessable, scoped, recoverable for the authenticated owner and revocable; app login/API keys must not appear in it. A public production URL is needed for server-side calendar fetches; localhost is insufficient for Google/Outlook cloud polling.

CalDAV is a standardized calendar access/edit protocol, not a universal browser “sync now” mechanism. Connecting to Google's CalDAV server still requires a registered OAuth client. Running our own CalDAV server is a different and larger feature, with client-specific setup and authentication.

## Superseded popup proposal and status constraints

A compact Calendar popup is useful because provider setup differs: subscription handoff plus copyable personal URL and short provider-specific help. The action remains available on every device; reopening reuses the same subscription identity. Already subscribed users of the same calendar account should not be encouraged to add duplicates.

Use the existing request-progress ring only while preparing/retrieving the subscription link. Handing off the link does not prove that the calendar app accepted it or downloaded events. Do not show “synced” or a countdown to an external refresh without evidence. External calendar services control refresh timing; requests from our app cannot force their polling schedule.

Data inclusion rules and the referenced brainstorming remain to be settled before an exporter is implemented. In particular, do not silently export every visible Explore item, draft, invitation, asset record or participant's personal information.

## Primary-source findings

- Google URL subscription setup is documented for the desktop web interface; the Google Calendar mobile apps cannot add a new URL subscription: https://support.google.com/calendar/answer/37100?hl=en
- Apple supports subscribed calendars and iCloud propagation across devices: https://support.apple.com/en-ie/102301
- Outlook distinguishes snapshot import from subscription and notes that refresh can take more than 24 hours: https://support.microsoft.com/en-us/outlook/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web
- Google CalDAV requires Cloud project/client registration and HTTPS OAuth 2.0: https://developers.google.com/workspace/calendar/caldav/v2/guide?hl=en
- CalDAV specification: https://www.rfc-editor.org/rfc/rfc4791.html
