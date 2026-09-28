# INTEGRATION-API-GROUP-001 — Group participant links

Domain: API test. Independently execute the application's normal API-key/client
and sign-in/registration paths from this testcase's own staged baseline.

## 0. Completed development checks — reference, no routine rerun

These checks were actually executed before the ordered campaign. Per the user's
request, keep them here as completed prerequisites instead of duplicating them
at the end as pending work. Rerun only if a subsequent change affects them.
Detailed results: [development evidence](../../evidence/INTEGRATION-API-GROUP-001-oauth-development-20260928.md)
and [generated-key usage](../../evidence/INTEGRATION-API-GROUP-001-generated-keys-20260928.json).

### 0.1 Advanced key table and generation — DONE in HTTP UI

Generate immediately produces a client ID and one-time secret without a name or
callback form. Existing keys survive; Advanced opens/reopens from the same store
without a settings reload; its manual-key badge changes with generation/revoke.
Reload preserves IDs and hides the secret. Revoke removes only the selected key.
The Generate label is visible on mobile. Base URL uses heading + copy-link row;
the short OAuth heading and copy labels resolve from the updated EN bundle.

### 0.2 Generated credentials and OAuth protocol — DONE at HTTP/API boundary

A UI-generated client ID/secret completed real consent and PKCE token exchange,
MCP initialization and personal-tool discovery. UI revoke invalidated bearer and
refresh access; the previously existing key remained. Eleven checks passed.
Public registration/consent/cancel, wrong PKCE, single-use code, refresh replay
and grant revocation were also verified through12 real HTTP checks. This is not
proof of an external browser callback or a private business-data read; those
remain in7.1–7.2.

### 0.3 Focused tests and seed parity — DONE within the recorded boundary

Java27/27 passed, including configured exact callbacks with no callback input.
The local MCP repository persistence/scope/reload/revoke check passed. Its wider
file had10/11 passing tests: the unrelated cash-refund expectation mismatch is
recorded for6.5, not counted as a complete-file PASS. HU/EN i18n and all42 system
seed baselines passed. Local UI and both language help entry points remain in7.6.

## Execution order and baseline

Execute blocks1–7 in order. Announce each numbered point before execution and
its PASS/FAIL/BLOCKED result afterwards. Repair/retest a concrete failure before
claiming that point complete. Keep detailed run status in the
[ordered evidence](../../evidence/INTEGRATION-API-GROUP-001-20260928.md).

Prepare an administrator-owned invitation-only group, a second group, a fresh
registration actor, and an existing non-member. Generate the integration key
through the normal Profile API UI. Snapshot only checkpoint-owned records and
register the scenario with the existing harness/browser launcher. External
systems distribute the returned links; QA uses them directly and sends no messages.

## 1. Issue and repeat participant links

### 1.1 Issue two participant links

Call the existing `inviteGroupParticipants(groupId, participantIds)` client
   method / `POST /groups/{groupId}/invites` with two distinct external IDs.
   The response has one app URL per ID in request order. No recipient account
   or membership exists merely because a URL was issued.
### 1.2 Repeat and reject invalid requests

Repeat the batch and verify stable URLs. Reject blank/duplicate IDs and
   oversized batches; a different owner cannot issue invitations for this group.

## 2. Fresh registration and active group

Run the entry path from the real signed-out UI. Do not inject a session or
pre-bind the recipient to skip registration, consent, location or onboarding.
Demo selection is an existing-account branch, never evidence of creating a new
registered identity. Use the actual registration mode for the fresh account.

### 2.1 Signed-out registration through the first link

Open the first URL while signed out. Complete the ordinary registration and
   onboarding flow. The return URL retains the invitation through every gate.
### 2.2 Persisted membership and active workspace

After registration, verify that the external participant ID is bound to that
   account, its `activityMembers` community membership is accepted, and exactly
   one workspace profile exists. The claim persists `activeWorkspaceGroupId`
   on the base account. A subsequent full profile load without a selection
   parameter, including after reload/login, returns that workspace. The group
   is selected automatically in the
   header and its profile/body menus are active.
### 2.3 Replay and filter preservation

Reopen the same URL as that account: membership/profile/participant binding
   are not duplicated. An explicitly cleared home gender filter is preserved.
   Registration defaults initially select the opposite gender on home cards.

## 3. Existing accounts and rejected claims

For the demo existing-account branch, follow the invitation while signed out,
then select its pre-registered recipient through the real demo selector. Stage
this testcase's own valid, missing and invalid saved-coordinate controls; verify
consent, admission and first full profile load through that UI.
The URL must survive Setup cancellation/retry and successful login. A failed
entry must not claim the link or create membership/workspace/session records.
The demo-user list remains visible underneath Setup while an existing user is
being selected, just as it does beneath new-profile setup; pending selection
disables the list until the child flow returns.
Closing Setup without permission closes only that child popup: the same list
becomes selectable again, with no registration navigation or cancellation error.
After successful entry, verify the target group is active on the first profile
load, after reload, and after logout/login. A valid saved coordinate remains
usable with browser GPS denied or outside supported countries.

### 3.1 Existing and pending recipients

Open the second URL using the existing non-member account and compare the
   same accepted membership/active-workspace result. Repeat using an existing
   pending join request; the administrator-issued link supplies invitation
   authority without requiring a second manual membership approval.
### 3.2 Rejected claims and removed administrator

Try the claimed first URL from another account, and a token with altered
   bytes. Reject the claim; neither account gains membership or a profile.
   Reusing an external participant ID already bound to another account is also
   rejected. Revoking the issuing administrator's role prevents new claims.

## 4. Workspace changes and retry

### 4.1 Switch from another workspace

Start from an already selected second workspace, then follow a valid link
   for the first group. Bind the base account, not the virtual workspace
   profile; select the target once and do not duplicate the claim on switching.
### 4.2 Transport failure and retry

Retry after a real transport failure during claim or workspace selection.
   A failed selection retains the claim URL for retry. Retried successful
   operations converge to one participant binding, membership and profile.

## 5. Event control, isolation and cleanup

### 5.1 Event admission control

Issue an Event link as a control through the same client. Its normal
    pending-invitation, payment/approval and ended-event rules remain intact;
    group auto-admission must not bypass Event acceptance or checkout.
### 5.2 Base and other-workspace isolation

Verify the new group profile against Base and the second group using the
    private target IDs prepared and recorded in this testcase's own baseline. No cross-workspace
    access follows from possessing this group invitation.
### 5.3 API-key revocation and branch cleanup

Revoke the QA API key and verify rejection. Reset only checkpoint-owned
    invitation mappings, accounts/profiles, memberships and groups, preserving
    unrelated records and earlier closed API evidence.

### 5.4 Evidence boundary

Unit tests are supporting evidence. PASS needs real client responses, the
registration/claim UI, persisted membership/profile, active workspace and
negative authorization outcomes. This integration path is server-owned even
when the application's other demo routes use local data.

## 6. Affiliate attribution and cash exclusion

### 6.1 API links versus UI sharing

Generate event and group participant URLs through the existing API client.
  Compare their complete URLs with UI-generated external sharing links; both
  retain the inviter through sign-in/onboarding. API participant IDs stay
  individually bound; a reusable UI share link must not acquire the API's
  single-recipient identity binding or inflate its imported-participant count.
### 6.2 Registration attribution and replay

Register fresh recipients from both API URL types. Inspect the persisted
  affiliate referrer/registration and the API participant binding, not only the
  UI counters. Each new user counts once. Retry registration/claim and open an
  existing account: never transfer existing attribution to the latest inviter.
### 6.3 Target participation

Check automatic target participation after registration: group acceptance
  and saved active workspace; event participation with the existing admission,
  payment and capacity rules. A missing target association is a failure even
  if the affiliate registration itself is correct.
### 6.4 Invalid authority and target

Revoke the inviter's required role, tamper with the target/token and attempt
  a foreign-workspace target. Verify rejection without new memberships,
  profile copies or participant bindings. Preserve the existing late/ended
  event behavior and previously claimed API identity constraints.
### 6.5 Cash exclusion and payment history

Compare cash and non-cash payments by the registered recipients: only the
  latter enter affiliate revenue/commission. Ordinary cash payment history
  remains available. Capture persisted counters and replay outcomes separately.

These are additional microsteps of this existing NOT RUN case, not new QA IDs
and not updates to any closed Affiliate/Event/API PASS evidence.

## 7. Remaining MCP integration, help and package checks

Use the separately launched official Inspector2.8.0 in sibling
`myscoutee-mcp/tools/oauth-client` (`make oauth-client`). It owns discovery,
registration, state, PKCE, callback and client-side MCP requests. MyScoutee owns
normal login/consent/grants. Use dev endpoints and isolated identities; no live
production or external ChatGPT account is required. No simulated success, manual
token injection or fabricated callback can close these checks.

### 7.1 URL → external client → browser login → callback → private operation

Enter the MCP URL in Inspector and choose Connect. Complete normal MyScoutee
sign-in, inspect the displayed profile/group, approve and return to that same
client. Verify initialization/discovery and an allowed private business-data
read with its actual result. Retain the client transcript. Ordinary automatic
registration requires no client-ID/secret copying; manual Advanced credentials
are a separate supported path. Callback completion alone is insufficient.

### 7.2 Signed-in, cancellation, reconnect and separate OAuth permissions

Repeat with an existing signed-in session, cancellation and reconnect. No
permission is created by cancellation. URL-based approved connections appear
under OAuth permissions in the main popup, separate from manual Advanced keys
and their badge. Revoke the OAuth row and verify its old connection fails while
a manual key remains usable. The MCP URL stays copyable for a later connection.
Browser logout alone does not revoke independently issued credentials. Reload
must preserve the recorded separation and exact profile ownership.

### 7.3 Profile-bound capabilities and changing administrator authority

The connect response and tool discovery identify the approved Base/group
profile. Group keys do not advertise asset creation; group invitations list only
groups the actor administers. Remove that role: next discovery changes and stale
invitation calls fail. Discovery never probes write endpoints. Switching app
groups or mentioning a group in a prompt cannot change the connection's owner.

### 7.4 Denial and capability failure boundaries

Revoked keys, unavailable capability API and older connect responses lacking
capabilities hide all personal tools; anonymous help remains accessible. Foreign
Event IDs, incomplete Mingle events and malformed payloads fail at the API despite
a tool being listed. Tool descriptions state ownership/lifecycle preconditions.
Already-proven protocol checks are listed in0.2–0.3; rerun those only if affected.

### 7.5 Concurrent profiles, pending mutations and retained UI

Use two identities. Switching profiles during key creation must not reveal the
previous profile's delayed secret. Failed revoke retains the row and normal
confirmation/retry. Mutations reconcile canonical results without list reload.
API-key slots remain independent of MCP keys. On narrow/mobile and desktop,
Revoke stays reachable at the card's top right, including tall credential rows.
Do not repeat the unchanged successful-generation path already closed in0.1.

### 7.6 Local UI and both HU/EN help surfaces

On mobile, the shared API/Affiliate popup, Advanced and affiliate revenue summary
use the standard fullscreen popup layout.

Verify local persistence/revoke UI and profile separation; browser-only local
mode does not establish external OAuth. Check the full Help Center and API popup
`?` separately in HU/EN and local/HTTP modes. Instructions stay in help. AI
integration follows Getting started; URL/Connect/login/profile approval/client
return/use/revoke are accurate. Anonymous MCP help requires no login and reads
the current published revision. Verify fresh seed and supported update behavior.
Canonical owners: `app-static-data.ts`/Help Center builder and
`helpCenterRevisions.json`; popup text uses i18n bundles/`i18n_messages.json`.

### 7.7 Unpublished package validation

Build separate OpenAI/Claude packages from the common plugin source. Verify the
original MyScoutee logo and shared skill. Record validation; package creation
alone does not prove installation or a model-selected tool call.

### 7.8 Final checkpoint cleanup

Revoke this run's remaining keys/grants, stop the optional Inspector/callback
receiver, close managed browsers and restore the exact checkpoint snapshots.
Keep no plaintext credentials in logs/screenshots. Verify no owned test records
remain and preserve unrelated records plus earlier closed evidence.

Actual ChatGPT/Claude/Codex installation and conversation acceptance belongs to
[standalone post-deployment smoke](../../../qualification/MCP-CLIENT-CONNECT-SMOKE.md),
outside this QA case.
