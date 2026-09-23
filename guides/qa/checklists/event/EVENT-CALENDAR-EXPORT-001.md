# EVENT-CALENDAR-EXPORT-001 — Manual calendar download and import

Status: **NOT RUN — awaits user-started dev stack and connected Android.** New case; earlier PASS evidence unchanged. User authorized automatic testing, explicitly including the mobile import window. Record application export separately from calendar-client compatibility.

## Baseline

1. Verify dev pipeline, demo database and frontend/backend versions. Do not start a second stack. After the preceding gallery case is reset, reuse `python3 guides/qa/tools/gallery-moderation-fixture.py stage`, then `status`, and `node guides/qa/tools/open-checkpoint-browser-sessions.mjs EVENT-GALLERY-FEED-001`. The shared launcher key intentionally matches that fixture's session-restore key; evidence for this run belongs to EVENT-CALENDAR-EXPORT-001. Never stage over an existing baseline.
2. Using disposable Creator/Viewer and moderation admin, create short future published/accepted Standard, Tournament and Speed meeting events. Include Viewer as accepted on one, pending on one, invited on another. Add unrelated/watch-only, draft and ended controls. Record IDs, statuses, memberships and UTC times. Root events are exported; tournament rounds are not separate entries.

## App checks

3. Desktop Profile: Calendar sync beside Affiliate, calendar icon, EN/HU text. One click makes one request with the existing ring. Repeated clicks while pending do not duplicate requests. No setup popup. At 360px buttons fit without covering avatar/name or overflowing. Admin API has no Calendar button.
4. HTTP: text/calendar UTF-8, attachment filename `myscoutee-calendar.ics`, private/no-store. Only own/organized or accepted, published ongoing/upcoming root events included. Draft/UR/blocked/deleted/past/invited/pending/watch-only excluded. Anonymous request rejected; userId query tampering cannot select another calendar. Verify local adapter parity against canonical memberships.
5. Check CRLF, valid UTC DTSTART/DTEND, stable unique UID, DTSTAMP, DISPLAY alarm at start, UTF-8 folding <=75 octets. Include accents/emoji and newline/comma/semicolon/backslash in title/location. No injected properties, participants, credentials or payments. Duplicate source IDs produce one VEVENT. Empty account downloads valid empty calendar.
6. Repeat export: same UIDs. Change a future event's time in its editor: same UID with updated time. Leave/cancel/trash an event: absent in next export. Absence does not prove removal from an already imported calendar.
7. Expired session, offline request and timeout: translated error, released ring, no HTML/error body downloaded. Retry succeeds. Change account during request: no prior-account file. Download must not claim verified calendar synchronization.

## Physical Android / calendar import

8. Record authorized ADB device, Android/browser/calendar versions. Open the real app through the established device route as a disposable actor and click Calendar sync. Check whether the browser immediately offers a chooser/import dialog, a download/open banner, or requires opening Downloads. **Open the actual downloaded ICS and verify the calendar import window.** Merely finding an intent handler or simulating a mobile viewport cannot pass this step. Record any failure/extra steps precisely.
9. Import only QA events, preferably into an isolated QA calendar. Verify title/location, timezone/time and reminder. Import twice into the same calendar: count duplicates. Import changed time: record update/ignored/duplicate/prompt behavior. Import the file omitting a cancelled event: record whether the old entry remains. On Ubuntu, open the actual downloaded ICS through the desktop file handler; record the chosen application, any chooser and what it can do with the file. If a calendar importer is available, repeat the import/update/duplicate observations there. If absent, report that concrete Ubuntu behavior and mark calendar import NOT RUN, even if download passes. No paid app or new calendar account required.
10. For offline reminder verification, create/import a disposable event a few minutes ahead and inspect its calendar reminder. With device-testing authorization, temporarily disconnect network, close app UI and observe local reminder at event time; restore connectivity afterward. Record notification permissions/DND and whether VALARM was honored. No guarantee of sound under muted/DND settings; Firebase delivery cannot prove this test. Do not change unrelated events/settings.
11. Record dated PASS/FAIL/NOT RUN evidence in `guides/qa/evidence/EVENT-CALENDAR-EXPORT-001-YYYYMMDD.md`, distinguishing export correctness from each importer's behavior. Delete only imported QA entries/downloads, never clear a personal calendar. Close managed windows and run `python3 guides/qa/tools/gallery-moderation-fixture.py reset`; verify settings/Jobs/actors/session snapshot restored.

## Acceptance

The app provides a private, valid snapshot with stable IDs and truthful request status. Import prompts, duplicate replacement/deletion and reminder behavior are compatibility observations, not universal promises. A failed physical-device import remains visible; serializer tests cannot substitute for it.
