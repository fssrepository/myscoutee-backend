# INTEGRATION-API-001 — API resources and callback

This checkpoint proves the assembled development stack through nginx. It uses
one key generated through the normal Casey profile UI; no integration token is
seeded or written directly to MongoDB.

## Actors

- Casey Bridge: API key and resource owner.
- Nova Social: ordinary participant who triggers the callback with Join.

## Flow

1. Launch the two managed sessions with the versioned
   `INTEGRATION-API-001` browser configuration.
2. In Casey's Profile, open API integration, generate one expiring test key,
   and copy the one-time secret. Confirm the key appears in the list.
3. Configure a fresh MyScoutee Java client identity with the displayed public
   base URL and that key. `connect` must succeed through nginx.
4. Register one callback for `event.changed` and `asset.changed`.
5. Through the client, POST one image-bearing Asset and one image-bearing
   public Event. Both results must preserve the caller UUID as `id` and return
   a MyScoutee UUID as `externalId`.
6. In Casey's UI, confirm the Asset and Event are shown once under Casey's
   managed/owned data with the submitted required fields and image.
7. In Nova's UI, open the public Event and perform the normal Join action.
8. Confirm the callback receiver gets `event.changed` for the same caller
   `id` and MyScoutee `externalId`, with participant change status and only the
   documented minimal participant projection.
9. Disable watch through `POST /watch`, revoke the generated key through
   Casey's UI, and confirm a later `connect` with it returns HTTP 401.

## Pass boundary

PASS requires the UI ownership/presentation checks, the persisted id mapping,
the real Join mutation and the delivered callback. API-only creation without
the two UI views is not sufficient.

## Extension — organizer link, invitations and completed encounters

The historical result below does not prove this extension. Record a separate
dated execution result. Use fresh disposable resources and a UI-generated key;
retain the existing managed browser launcher and client identity rules.

1. Register `event.encounters` in addition to the existing watch types before
   completion. Create a Speed meeting event with `sourceLink` and configuration.
   Verify the API read, owner editor and public external-link action agree.
2. Create invitation links for partner participant IDs. Open Nova's claim URL
   through the managed browser, complete the normal claim/join flow, and verify
   the participant mapping and membership. Reopening must not duplicate either.
3. Run and complete two rounds through organizer controls. Include repeated
   co-participants so the expected export contains each unordered pair once.
4. Before completion, encounter reads must report the documented conflict.
   After completion, read all pages and compare the partner identifiers with
   actual saved completed-table assignments, independently of ratings.
5. Receive `event.encounters` at the real callback receiver and compare its
   event, revision, pair set and page offsets with the dedicated API response.
   Verify no internal user IDs or e-mail addresses are exposed.
6. Verify another owner's event cannot be read through this key. Disable watch,
   revoke only the newly generated key in the UI and verify subsequent rejection.

PASS requires actual browser claim/runtime actions, persisted reads and delivered
callbacks; mocked SDK responses are supporting tests only.

## Result — 2026-09-20

PASS / CLOSED on the assembled development stack through nginx.

- Casey generated a fresh key in the Profile API panel; no token fixture was
  used. The Java client connected through the displayed public Base URL.
- One image-bearing Asset and one image-bearing Event were accepted. The
  response preserved each caller UUID as `id` and returned a distinct
  MyScoutee UUID as `externalId`; the server produced all three image sizes.
- Casey's owned Asset/Event views and Nova's public Explore view displayed the
  submitted data and image. The missing public Event image found during the
  run was repaired in `MediaPolicyFacts` and replayed successfully.
- Nova joined through the normal UI and Casey approved the request. Casey then
  showed `2 members`; the callback delivered the same caller/MyScoutee ID pair,
  `accepted`, `Member`, and only name, age, gender and profile image for Nova.
- Watch was disabled, the test key was revoked through the confirmation dialog,
  the Profile API panel returned to `0 / 3 active`, and the same client then
  received HTTP 401. No pre-existing/user-provided key was revoked.

Machine-readable evidence is stored in
`guides/qa/evidence/INTEGRATION-API-001-2026-09-20.json`.
