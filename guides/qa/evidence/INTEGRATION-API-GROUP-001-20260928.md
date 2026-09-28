# INTEGRATION-API-GROUP-001 — ordered execution, 2026-09-28

Status: blocks1–6 PASS; 6/7 blocks completed in this independent run.
Current point:7.2, cancellation/reconnect and separate OAuth permissions;7.1 PASS.

## Execution contract

Announce every block/point before execution and its actual result afterwards.
Follow blocks1–7 in order; fix/retest concrete failures without silently skipping.
The user subsequently explicitly requested continuing the automatic test on
2026-09-28. Full-flow browser/API execution is delegated for this Group API
case; this supersedes the initial user-controlled startup handoff.

## Baseline and startup

- `mcp-oauth` development fixture reset completed with exact restore; its managed
  browsers closed and optional Inspector process stopped. Development proof is
  retained in `INTEGRATION-API-GROUP-001-oauth-development-20260928.md` and
  `INTEGRATION-API-GROUP-001-generated-keys-20260928.json`.
- Versioned scenario: `integration-api-group`, same testcase ID. Four isolated
  actors: Group API Alex (administrator), Maya (existing non-member), Milo
  (outsider), Nia (pending-branch control). Namespaced IDs use `f0300926`.
- Groups `qa-group-api-a` and `qa-group-api-b`: private/workspace-enabled, Alex
  accepted as Admin, no recipients/memberships/keys pre-created for the test.
- Fresh registration names reserved for the actual entry UI: Group API Fresh
  Rowan / Group API Fresh Event. No fresh user inserted or session injected.
- Baseline snapshots retained by the common harness. Only checkpoint-owned
  identities/resources/registrations are in the cleanup boundary.
- Existing versioned launcher prepared two windows: Group API Alex and a signed-
  out recipient. Both reported ready. Common active-session cleanup is retained.
- Startup completed before the ordered actions recorded below.

## Point ledger

| Block | State | Next check |
| --- | --- | --- |
| 1 | PASS | UI-created Alex and outsider keys; ordered two links; unchanged on replay; blank/duplicate/1001-ID batches400; outsider403; only two unclaimed mappings, no recipient memberships/profiles. |
| 2 | PASS | Fresh account, linked group profile, reload/login, replay and explicit base filter preservation. |
| 3 | PASS | Existing/pending recipients, entry controls, rejection statuses409/404/403; Milo gained no membership/profile on denied claims. |
| 4 | PASS | B→A base binding and blocked-claim transport retry; exact membership/profile counts. |
| 5 | PASS | Event free/paid/ended controls; private-profile 3×3 matrix; revoked key401; exact fixture/media/session cleanup. |
| 6 | PASS | Attribution, paid invitation EUR5 and cash EUR7 exclusion; replay and persisted counters verified. |
| 7 | IN PROGRESS | Current7.1 external Inspector OAuth; subsequent checks and final cleanup remain. |

The application and frontend watchers own compilation. No additional stack,
server or main build was started. Latest UI build and seed parity passed.

Block1 proof: `INTEGRATION-API-GROUP-001-ordered-20260928.json`; fixture status confirmed only Alex Admin memberships and no fresh users/workspace profiles. Initial runner used `url` instead of DTO `inviteUrl`; corrected the test harness, no product change.

## 2.1–2.2 — fresh registration and persistence PASS

Normal entry Login → New demo profile → Setup → onboarding (required fields
and three uploads using existing demo media) → Save profile created
`Group API Fresh Rowan`. No seeded fresh account or injected login was used.
The invitation survived the entry gates and was claimed only after registration.
Mongo status confirmed one accepted Member entry, the original base account and
one linked workspace profile; base `activeWorkspaceGroupId=qa-group-api-a`.
The UI selected QA Group API A after creation, full reload, and normal logout /
demo-login to the newly registered account without an invitation URL.

Location boundary: the launcher's default Austin sample was rejected by the
running eligibility endpoint. Budapest was eligible. Only this checkpoint's
managed-browser geolocation was changed through the versioned helper/config;
no application eligibility rule, fallback or production configuration changed.
Code inspection confirms fresh native getCurrentPosition(maximumAge:0), no
invented fallback coordinates, and retryable Setup after rejection. This is
simulated-location QA, not proof of actual device GPS or Firebase production login.

## 2.3 — replay and base filter preservation PASS

Returned to Main profile through the normal workspace picker. Default Gender was
Woman for the new man profile; deselected it to Any and applied. Reopened the
original invitation: QA Group API A became active; base profile remained
accessible and retained Any. Mongo still contained one fresh base account, one
linked workspace profile and one accepted membership. Structured results are
in the ordered JSON evidence.

## 3.1 — entry controls in progress

The first missing-coordinate attempt for Maya was invalid fixture preparation:
the direct Mongo edit bypassed the application's demo-directory cache eviction.
The cached selector retained her earlier coordinates, while the full profile
correctly returned no coordinates and displayed Location required. Do not count
that attempt as proof of the missing-location entry gate. Restored only Maya's
fixture location (base and newly copied workspace) from the staged baseline.

The versioned runner now refreshes the directory through the existing owner
profile-load operation, sending the owner's unchanged saved coordinates, and
reads back the control DTO before browser selection. No application cache or
location fallback was added. Nia is the pending-join and entry-control actor:
missing coordinates → Setup; cancel retains invitation and pending membership,
with no claim/workspace. Invalid coordinates plus denied native GPS → Setup
error, still entry and retained invitation. Valid saved-coordinate check pending.

User corrections during this point: keep the demo selector list under Setup
for existing users too; closing Setup without permission must only dismiss the
child and restore the same selectable list. Narrow frontend changes await
runtime verification after the existing frontend-sync build.

### 3.1 verified continuation

After the correction, the existing-user selector retained all58 rows beneath
Setup and disabled them during selection. Closing Setup with GPS denied kept
all58 rows, re-enabled them, retained the invitation, and opened no onboarding.
Existing frontend-sync build passed at2026-09-28T01:41:25.500Z.

Nia's eligible saved coordinates allowed normal login with native GPS denied.
The pre-existing pending join became one accepted membership and one workspace
profile, bound to the base account. Reload preserved QA Group API A. Normal
logout/login with the browser sample outside eligible regions (Austin) also
restored A using the valid saved profile location. 3.1 PASS.

### In-scope mobile popup correction

Shared API/Affiliate model and affiliate revenue summary now use the existing
fullscreen mobile presentation; Advanced states it explicitly. Runtime DOM
measurements at390×844: Affiliate, Advanced, Referral revenue each at(0,0),
390×844. Existing frontend-sync build PASS at2026-09-28T01:44:56.146Z. This
early regression check does not mark the remaining7.6 Local/HU/EN checks done.

## 3.2 — rejected claims PASS

Actual outsider Milo session: opening Rowan's already-claimed invitation showed
an error and stayed on Main profile. HTTP checks: other account409, altered
token404, same external participant ID issued in B but bound to Rowan409.
Temporarily removed Alex's B administrator role through the versioned fixture;
an otherwise unused B invitation then returned403. Restored the role in a
finally step. Mongo confirmed Milo had zero group memberships, workspace
profiles and claimed invitations before block4 started.

Corrected misleading Event-only error wording in the shared group/Event claim
UI to Invitation / Meghívó in EN/HU, using the existing keys. Affiliate revenue
button now uses account_balance_wallet. I18n8056-message audit and42 seed parity
checks PASS; existing frontend build passed at2026-09-28T01:49:00.228Z.

## 4.1–4.2 — B→A claim and transport retry PASS

Milo entered B, then A through normal browser invitation URLs. Both claims bind
to the same base account; one workspace profile and accepted membership per
group. Initial runner incorrectly allocated a second external ID for the same
person; the existing unique owner/resource/internal-ID rule rejected it409.
Corrected the runner to use the same participant ID across groups; no product
rule changed. The rejected extra link remains unclaimed and cleanup-owned.

An initial profile-load interception during a full page navigation was not a
valid prior-resident-B oracle: the invitation claim had already activated A
server-side, and the independent initial profile load could return A. Do not
count that attempt as a verified resident workspace-selection failure.
The explicit4.2 claim-transport branch blocked the actual claim HTTP request:
error shown, B remained selected, invitation URL retained. Removing the network
block and reloading that URL completed A and consumed the parameters. Persisted
counts remained exactly two memberships and two profiles for Milo.

## 5.1 — Event admission control PASS

API-created own controls: free `a3d925e9-f74b-404d-872b-a2b970dd43b7`,
paid `efa7c90e-fb27-4f98-b4a1-e978725f56e9`, ended
`b621eb95-8890-467f-bd39-dc9ed5ac50f6`.
Milo's free invitation stayed pending until normal Accept plus confirmation;
then the persisted membership became accepted. Paid invitation opened the normal
price review (regular EUR10, organizer VIP EUR5, approvalRequired=true). Join plus
confirmation advanced to card/payment review with a persisted EUR5 confirmed
basket, pending/join membership and zero payments. Organizer invitation retains
its normal organizer preapproval; it does not bypass payment. No card/provider
payment was submitted in this admission control.

Ended URL was consumed without a participant membership: the only ended-event
member remains its owner/admin. Earlier apparent no-op Join was a harness
inspection mistake: the shared confirmation dialog is `app-dialog`, outside the
`[role=dialog]` selector used by the initial reader. Normal scoped confirmation
completed; no checkout product change was required.

## 5.2 — Private Event profile isolation PASS

Own baseline extension `prepare-private-controls` cloned the run's free Event
into `qa-group-api-private-a` / `qa-group-api-private-b`, each owned by Milo's
already-created corresponding workspace profile and with its own Admin member.
No unrelated case fixture was used. UI workspace selection Base/A/B followed by
actual detail HTTP reads produced the full 3×3 matrix: same-scope200, all six
cross-scope404. The controller intentionally hides unavailable Event details as
404; the runner's initial403 expectation was corrected against that contract.
These private IDs and all related membership records remain reset-owned.

## 5.3 — API-key revocation and branch cleanup PASS

Alex revoked Client1 through the retained Affiliate popup and confirmation. Its
previous token returned401 on an invitation write; no mapping was created.
Managed browsers closed. Common pre-launch sessions restored, exact scoped
fixture reset completed, and status reports no users, memberships, profiles,
Events, checkout items, payments or invitation mappings. Fresh Rowan
Minio upload prefix independently lists zero objects after exact-owner cleanup.
Additional checkout/payment/audit selectors are now owned by this fixture reset.
Blocks6–7 use a fresh independent baseline, preserving this evidence.

Cleanup correction before6: the initial generic selector omitted
`affiliateRegistrations.referrerUserId`; Rowan's immutable audit survived the
first reset. No new attribution checks were accepted on that baseline.
Extended the owning scenario with affiliate collections/referrer scope, reset
the short-lived restage again, and independently verified zero owned affiliate
registrations/links and actors/memberships. This completed reset supersedes the
initial incomplete cleanup claim above. No product behavior changed.

## 6.1 — API and UI sharing links PASS

On the clean block6 baseline, Alex generated a new API key through Profile.
Normal Groups card → Share link and free Event card → Share Event produced
URLs with the same affiliate identity as the API group/Event invitations.
Complete secret URLs are held only in0600 temporary files. Both UI mappings are
reusable with no participant ID or claimed user; five API mappings represent
three distinct participants. Actual `/integrations/settings` reports imported3,
registered0, affiliate registrations0 and no revenue: UI shares add no imported
participant. The requested wallet icon was also observed in the refreshed UI.

## 6.2–6.3 — Fresh group recipient, partial PASS

Fresh UI registration `demo-profile-9fe42c09-e4b1-4bf5-952b-f6f5fe7f032e`
(Group API Fresh Rowan) used the retained API group URL, native browser location,
normal required onboarding fields and three actual image uploads. Persisted base
profile affiliateRegistration and one affiliateRegistrations audit both refer to
Alex. One accepted A membership, one linked A profile and activeWorkspaceGroupId=A.
Reopening the claimed URL preserves one affiliate registration and registered
participant1 (actual settings summary1/3). Existing source branch evidence is
unchanged. Event recipient and different-inviter replay remain under execution.

Fresh Event recipient `demo-profile-b7b37f25-8acf-44b1-8e3e-93e25fef07ea`
registered through its own API URL and the same normal onboarding. Base profile
and immutable registration audit both retain Alex. Target free Event
`ac34664b-46d5-43a3-bc97-31ccd383a835` has one pending/invite member for this user;
claim did not bypass normal acceptance. Reopening the URL leaves aggregate
registered2 and participants2/4. No payment/revenue exists yet.

## 6.2–6.3 — Attribution/replay and target association PASS

Milo logged in normally and copied his personal invitation from Profile →
Affiliate. After logout, that different-inviter URL was opened and the existing
Fresh Event account selected through Login. Both its embedded attribution and
immutable audit still refer to Alex with the original timestamp; Alex summary
remains registrations2, participants2/4. Neither API replay creates a duplicate.
Group target is accepted/active as recorded above; Event target is a real
pending invitation, preserving acceptance/payment rules. Paid end-to-end
settlement is explicitly required in6.5 following the user's clarification.

## 6.4 — Authority, tampering and foreign target PASS

Fresh Event account: Rowan's already-bound URL409, altered token404, own B URL
after Alex loses B Admin403. Alex's Base API key cannot invite into Rowan's
private A-workspace Event (`qa-group-api-attribution-private`):404, matching
requireOwnedEvent's deliberate concealment contract (initial runner403 corrected
against source). Restored Alex's original B Admin role. Fresh Event then opened
an ended-event URL bound to its own external participant ID: no ended membership.
Oracle: registrations remain2, Fresh Event has no community memberships or group
profile, foreign target participant mapping absent, ended Event only its owner.

Fixture correction entering6.5: the private denial Event had copied its source
Event's pending-recipient arrays even though its own membership contained only
Rowan/Admin. Cleared all pending/invited projections in the existing fixture
preparation and made restaging conditional on unchanged own ownership/no extra
members. This was malformed copied QA data; no application fallback or access
rule was changed. The API owner denial remains the source-scoped404 contract.


### 6.5 Paid invitation and cash exclusion PASS after repairs

Normal UI Barion card registration completed with the payment simulator. The
first payment failed before provider I/O: optional checkout detail was passed
as null to Map.of. Barion requires Description; the adapter now uses the item
label when no additional detail exists (https://docs.barion.com/Item).
Checkout ignores Spring's "No message available" placeholder and retains its
existing meaningful operation failure message.

Retry captured EUR5 once, then exposed loss of organizer preapproval between
invitation acceptance and payment finalization. requestJoin now preserves the
stored accepted organizer invitation while its inviter still has Admin role,
using the already-loaded membership snapshot. Retrying reused the captured
payment: recipient membership accepted, one captured EUR5 payment and one
failed pre-provider attempt; no duplicate charge or contribution. Reload kept
accepted membership, two accepted members and the pending free control intact.
Affiliate totals EUR5 gross/net, purchases1, bookings1.

Cash control: ordinary authenticated receipt endpoint recorded EUR7 from Fresh
Event to Alex. Same request replay returned the same receipt; owner income and
payer expense each contain one row. Affiliate totals unchanged at EUR5/1/1.
Versioned runner: group-api-ordered-qa.mjs cash-control.

Verification: existing backend/frontend watchers compiled the product changes.
Focused JUnit reused watcher-built main classes and compiled only tests:
Barion optional description4 cases, retained organizer approval2 cases including
removed inviter Admin, existing member-invitation approval1 =7/7 PASS. The first
new-test run had an incorrectly populated accepted-members snapshot (5/6); fixed
only that test setup before the successful run. Focused Vitest checkout errors3
and integration repository11 =14/14 PASS. Cash refund assertion corrected to the
existing active-cash refund-request contract (GROUP-LIFECYCLE-001); no cash
product behavior changed.

Concurrent reported card layout defect repaired in the existing SmartList grid:
projected template hosts now stretch through flex shells. Actual cards before:
257.734/218.578px; after normal page reload:257.734/257.734px. Content retained.


### 7.1 External Inspector OAuth and private operation PASS

Official Inspector2.8.0 launched from the sibling MCP repository, target
http://localhost/mcp/private. Initial Connect reached authorization but failed
invalid_target: the running dev MCP advertised https://myscoutee.com resource
metadata because Compose reused DOMAIN. Dev/E2E now default the existing
MYSCOUTEE_PUBLIC_API_BASE_URL explicitly to http://localhost/api (override
supported); production unchanged. Stopped/recreated only MCP, without build or
dependencies. Its401 challenge now points to the correct local metadata.

Fresh Inspector state: normal Connect/discovery/DCR/S256 PKCE reached MyScoutee
consent displaying Group API Alex/Base. User approval returned to the same
Inspector; connected MCP2025-11-25,9 tools including the authorized private set.
Actual event tool returned the paid Event using API-returned Event externalId
553b598f-bbf2-4327-8224-f7d7e2333af4. The initially supplied submitted request UUID
returned404; corrected to the identifier in the creation response, no access
rule changed. Raw client transcript stays private under the run's0700 temp
root; no tokens, authorization parameters or organizer URLs in committed logs.
Reload/reconnect reused credentials successfully. Fresh signed-out login,
cancellation/revocation and profile separation remain7.2–7.5.

User-requested external-client presentation repair: official client retained;
versioned launcher applies responsive.css to pinned Inspector2.8.0 assets with
content-based CSS cache busting. Removed1280px root minimum; at<=760px header,
tool selection/detail and monitoring panels stack. Logs have an opaque surface.
Search is a full-width row beneath Logs/Protocol/Network at all sizes.
Measured viewport390/760/1280: document widths375/760/1280, no horizontal
overflow; search/tab widths296/681/256px respectively and12px vertical gap.
MCP README includes a short make oauth-client/open printed URL/Connect/Ctrl+C
section. No custom OAuth protocol or second client implementation introduced.

Authorization consent redesigned with shared Popup/Menu styles, client identity,
profile panel, concise HU/EN permission text, optional callback disclosure and
right-aligned actions. Source+3Mongo seed audit8056keys PASS; watcher build PASS.
Actual new-consent rendering still to verify during7.2.

### 7.2 Partial evidence — revocation, reconnect and common consent actions

OAuth-row failed DELETE retained the row, Advanced badge1 and retryable error
confirmation. Successful normal retry removed the OAuth row while retaining the
manual Client1 key and copyable MCP URL. Inspector's old credentials required
reauthorization. Cancel returned access_denied to the real Inspector. Subsequent
normal approval reconnected using MCP2025-11-25. Fresh signed-out login and
logout independence remain pending; this is not a full7.2 PASS.

The UI-generated manual client_id/secret also completed a real S256 code/token
exchange through HTTP and authenticated private MCP discovery (9tools) plus
paid Event read. This separate protocol probe is not claimed as an Inspector
manual-credentials UI test. First probe incorrectly used eventId; the advertised
externalId field corrected that harness error and the read passed. Secrets and
raw Event payload retained only in the private run directory.

Connection details uses grouped labels/copy rows:243.44px popup height,
9.27px label-to-input gap, no overflow. Consent uses existing app-popup and
app-menu; action layout/slate+blue match common confirmation buttons, and
loading uses shape=button instead of the incorrect circle on a labelled pill.
390px viewport: shared fullscreen popup390x844, document width390; both action
buttons36px tall. Held consent response verified disabled actions and stable
button geometry; release completed the real callback. Current short consent
translation loaded. Callback URL disclosure removed from consent at user request;
it remains available in connection details and OAuth validation is unchanged.
Existing frontend-sync watcher compiled/synced the changes successfully.

7.2 completed: normal browser Logout left manual bearer discovery/private Event
read usable, and Inspector reconnect reused its independent OAuth credentials.
Cleared client-stored OAuth state with token revocation disabled via Inspector
settings, then Connect redirected the signed-out browser to normal entry.
Accepted privacy, selected Group API Alex from the normal demo list; returned to
/mcp/authorize with the correct Base identity. No injected login was used.
Cancel preserved the exact server settings snapshot (manual1/OAuth1); actual
Inspector displayed access_denied. Re-authenticate plus Allow access returned
Connected/MCP2025-11-25. This second registered client adds a separate OAuth row;
all run-owned rows remain scheduled for7.8 cleanup.7.2 PASS.
Latest consent rendered without callback URL; shared action buttons retained.

### 7.3 Profile capabilities PASS;7.4 unchanged development boundary retained

Versioned prepare-issuer-workspaces adds Alex's missing account-linked A/B
personal-profile prerequisites only. Original fixture had accepted Admin
memberships but no owner group-profile copies, so normal picker correctly hid
those choices. This preparation is not claimed as admission/profile-copy proof.
Normal UI selection of A and Advanced generation produced a group-bound key.
Real PKCE exchange/discovery identified qa-group-api-alex-a / QA Group API A;
createAssets absent, Base key still advertised it and kept its Base ownership
while the app displayed A. Both authorized invitation groups initially listed.
Versioned removal of B administrator role followed by discovery in the SAME MCP
session removed B; a stale inviteGroupParticipants(B) call failed. A remained.
Foreign Base paid Event read from A failed. Finally restored Admin using the
versioned harness. No write operation was used to discover permissions.
7.4 unchanged0.2–0.3 protocol proofs retained; foreign ownership replay passed.

### 7.5 Retained UI/profile race PASS at exercised boundary

Held the HTTP response to a second A manual-key generation. Closed ordinary
popups and selected Main profile normally before releasing the response.
After release no A secret was visible in Base. Reopened Base Advanced: manual1,
OAuth2, no secret; independent Fresh Event identity Advanced remained empty.
The delayed key exists only under A for final cleanup. Existing first A secret
was visible before closing (not the delayed response). Failed revoke/retry was
already exercised in7.2. At390px Base Revoke remained inside viewport at its
row top (9.8px inset), no document overflow. API-key and MCP storage remain
separate; MCP URL grants/manual rows retained their separate sections.
