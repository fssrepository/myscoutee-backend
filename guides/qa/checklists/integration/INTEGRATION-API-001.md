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

### Additional MCP regression micros — NOT RUN (2026-09-26)

These additions do not change any historical PASS result. Reuse this checkpoint's
UI-created keys and the group checkpoint's profile boundaries.

- The authenticated connect response identifies the key's profile/group and
  authorized operations. Base/group keys produce the corresponding MCP discovery;
  group keys do not advertise asset creation. Discovery never probes write URLs.
- Group invitation discovery contains only groups the actor administers. Removing
  that role changes the next discovery and blocks stale calls before invitation.
- Revoked keys, unavailable capability API and older connect responses without
  capabilities hide all personal tools; anonymous help remains discoverable.
- Tool descriptions expose ownership/lifecycle preconditions. Foreign event IDs,
  incomplete Mingle events and malformed payloads still fail in the API; a listed
  operation does not grant blanket resource access.
- HU/EN help starts with the AI integration topic after Getting started; frontend
  local and Mongo-backed help agree. Anonymous MCP help explains that no login or
  key is needed, and uses the current published revision.
- Build separate unpublished OpenAI/Claude packages from the common plugin source.
  Verify the original MyScoutee logo and shared skill, then test installation in
  the chosen client separately. No personal remote OAuth pass follows from a local
  API-key test. See `myscoutee-mcp/docs/QA.md` for the individual steps.

- Personal remote `/mcp/private`: create a profile-owned MCP connection under
  API keys, copy the one-time secret into client settings, sign in and explicitly
  approve the displayed profile/group. Check both ChatGPT and Claude callbacks.
  Invalid state round-trip, redirect, client, PKCE, resource, expired/reused code,
  refresh replay and revocation must not expose private operations/data.
- An enrolled browser session must not be required for an independently verified
  API key/OAuth grant. Browser logout does not revoke the key; explicit key/grant
  revocation does. Ordinary app requests still require their session.
- Two concurrent identities remain isolated. Profile switches during creation
  cannot expose the previous secret; create/revoke reconcile the table without
  reload. Local/demo persists settings only. API-key slots remain independent.
  Full steps: `myscoutee-mcp/docs/QA.md`, still **NOT RUN**.

### Existing checkpoint acceptance

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


## Extension result — 2026-09-22

PASS / CLOSED. The original 2026-09-20 base result remains valid; the extension
was executed through the existing managed Casey/Nova browsers and public SDK.

1. **Link/read PASS:** the Speed meeting `sourceLink` agreed between SDK event
   read, owner editor and Nova's public External Info action. The public mapper
   omission was repaired and replayed. An intercepted destination proves exact
   new-tab navigation only. Standard public navigation was separately completed
   under EVENT-MODE-REGRESSION-001 step 5.5.
2. **Invitation PASS:** Nova claimed the generated invitation through the browser
   and completed the normal membership flow. Reopening retained one membership;
   mapped partner identifiers were preserved.
3. **Runtime PASS:** organizer controls and the real scheduler completed two
   rounds, including repeated co-participants; pause/resume and stale command
   rejection preserved the current state. Fixture membership inputs did not seed
   completed rounds or encounters.
4. **Read/privacy PASS:** pre-completion encounters returned 409; completed reads
   returned the distinct unordered pair union. The two-person case returned
   `qa-casey`/`qa-nova`, revision 6, and empty offset-1 terminal page. The eight-person
   case returned 28 pairs over pages 10/10/8, revision 4. Payload assertions excluded
   internal user IDs and email addresses. Public opaque IDs remain valid for peers
   without a partner mapping.
5. **Watch PASS:** the actual `event.encounters` callback matched event, revision,
   offset and combined API pair set. The eight-person callback matched all 28 pairs.
6. **Authorization/cleanup PASS:** another owner's event read, encounters and
   invitation creation each returned 404. Unwatch disabled the subscription;
   normal UI key revocation returned 200 and subsequent connect returned 401.
   Only disposable resources were soft-trashed; the owned receiver was stopped,
   preferences restored and versioned fixture/session cleanup completed.
7. **Timeout regression PASS:** a real loopback server reproduced the missing
   response-body deadline (original code exceeded a 20-second test limit after
   headers). Delivery now cancels unfinished HTTP responses after 10 seconds.
   Silent headers and partial bodies passed at 10.121/10.025 seconds, each followed
   by a successful healthy delivery. A refused connection persists RETRY after
   failures 1/2, delays 5/30 seconds, then FAILED with no next attempt after failure
   3. All six IntegrationWebhookService tests passed. These are real HTTP/service
   tests with mocked repositories, not a claim of a live-stack failure replay.

The existing backend watcher compiled production successfully. Focused Gradle
execution excluded production compile/resources/classes, avoiding a duplicate
production build. The API HTML, generated PDF and frontend-published PDF now
state the three-attempt limit and complete-response timeout.

Sanitized machine evidence:
`guides/qa/evidence/INTEGRATION-API-001-2026-09-22.json`.

## Late participant claim follow-up — 2026-09-22

The agreed cutoff is the event **end**, not its start. Links have no time-based
expiry. Before that cutoff, normal invitation permission still applies. After
expiry/end, or a completed Speed meeting session, claim retains the external-ID
mapping and returns `invitationAvailable: false`; it creates no invitation and
changes no existing membership. The UI clears the claim URL and remains on the
normal screen. Ownership and conflicting-account checks remain enforced.

Eight focused service tests PASS, including an already-started ongoing event,
all three expired formats, replay, an early-completed Speed meeting, and account
conflicts. Production compilation used the existing watchers; the focused test
excluded their compile/classes/resource tasks. API HTML/PDF regenerated.
Evidence: [late-claim service result](../../evidence/INTEGRATION-API-001-late-claim-2026-09-22.json).
This supplements the earlier closed API run; it does not claim a new browser
PASS. Fresh registration plus claim and the new late branch through assembled
HTTP remain unproven.

For a future explicit full-flow replay, use disposable participant IDs: claim
one link while the event is ongoing and verify one ordinary pending invitation;
claim another after its end and verify only the external identity mapping,
without invitation or event popup. Repeat with an already-completed Speed
meeting before its scheduled end. Reopen each link under the same account and
verify no duplicates; a different account must remain rejected.
