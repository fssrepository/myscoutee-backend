# INTEGRATION-API-GROUP-001 — Group participant links

Domain: API test. Independently execute the application's normal API-key/client
and sign-in/registration paths from this testcase's own staged baseline.

## Baseline

Prepare an administrator-owned invitation-only group, a second group, a fresh
registration actor, and an existing non-member. Generate the integration key
through the normal Profile API UI. Snapshot only checkpoint-owned records and
register the scenario with the existing fixture harness and browser launcher
before execution. The external system distributes returned links; testing uses
the links directly and sends no unsolicited messages.

## 1. Issue and repeat participant links

1. Call the existing `inviteGroupParticipants(groupId, participantIds)` client
   method / `POST /groups/{groupId}/invites` with two distinct external IDs.
   The response has one app URL per ID in request order. No recipient account
   or membership exists merely because a URL was issued.
2. Repeat the batch and verify stable URLs. Reject blank/duplicate IDs and
   oversized batches; a different owner cannot issue invitations for this group.

## 2. Fresh registration and active group

Run the entry path from the real signed-out UI. Do not inject a session or
pre-bind the recipient to skip registration, consent, location or onboarding.
Demo selection is an existing-account branch, never evidence of creating a new
registered identity. Use the actual registration mode for the fresh account.

3. Open the first URL while signed out. Complete the ordinary registration and
   onboarding flow. The return URL retains the invitation through every gate.
4. After registration, verify that the external participant ID is bound to that
   account, its `activityMembers` community membership is accepted, and exactly
   one workspace profile exists. The claim persists `activeWorkspaceGroupId`
   on the base account. A subsequent full profile load without a selection
   parameter, including after reload/login, returns that workspace. The group
   is selected automatically in the
   header and its profile/body menus are active.
5. Reopen the same URL as that account: membership/profile/participant binding
   are not duplicated. An explicitly cleared home gender filter is preserved.
   Registration defaults initially select the opposite gender on home cards.

## 3. Existing accounts and rejected claims

For the demo existing-account branch, follow the invitation while signed out,
then select its pre-registered recipient through the real demo selector. Stage
this testcase's own valid, missing and invalid saved-coordinate controls; verify
consent, admission and first full profile load through that UI.
The URL must survive Setup cancellation/retry and successful login. A failed
entry must not claim the link or create membership/workspace/session records.
After successful entry, verify the target group is active on the first profile
load, after reload, and after logout/login. A valid saved coordinate remains
usable with browser GPS denied or outside supported countries.

6. Open the second URL using the existing non-member account and compare the
   same accepted membership/active-workspace result. Repeat using an existing
   pending join request; the administrator-issued link supplies invitation
   authority without requiring a second manual membership approval.
7. Try the claimed first URL from another account, and a token with altered
   bytes. Reject the claim; neither account gains membership or a profile.
   Reusing an external participant ID already bound to another account is also
   rejected. Revoking the issuing administrator's role prevents new claims.

## 4. Workspace changes and retry

8. Start from an already selected second workspace, then follow a valid link
   for the first group. Bind the base account, not the virtual workspace
   profile; select the target once and do not duplicate the claim on switching.
9. Retry after a real transport failure during claim or workspace selection.
   A failed selection retains the claim URL for retry. Retried successful
   operations converge to one participant binding, membership and profile.

## 5. Event control, isolation and cleanup

10. Issue an Event link as a control through the same client. Its normal
    pending-invitation, payment/approval and ended-event rules remain intact;
    group auto-admission must not bypass Event acceptance or checkout.
11. Verify the new group profile against Base and the second group using the
    private target IDs prepared and recorded in this testcase's own baseline. No cross-workspace
    access follows from possessing this group invitation.
12. Revoke the QA API key and verify rejection. Reset only checkpoint-owned
    invitation mappings, accounts/profiles, memberships and groups, preserving
    unrelated records and earlier closed API evidence.

## Evidence boundary

Unit tests are supporting evidence. PASS needs real client responses, the
registration/claim UI, persisted membership/profile, active workspace and
negative authorization outcomes. This integration path is server-owned even
when the application's other demo routes use local data.

## 6. Affiliate attribution and cash exclusion

- Generate event and group participant URLs through the existing API client.
  Compare their complete URLs with UI-generated external sharing links; both
  retain the inviter through sign-in/onboarding. API participant IDs stay
  individually bound; a reusable UI share link must not acquire the API's
  single-recipient identity binding or inflate its imported-participant count.
- Register fresh recipients from both API URL types. Inspect the persisted
  affiliate referrer/registration and the API participant binding, not only the
  UI counters. Each new user counts once. Retry registration/claim and open an
  existing account: never transfer existing attribution to the latest inviter.
- Check automatic target participation after registration: group acceptance
  and saved active workspace; event participation with the existing admission,
  payment and capacity rules. A missing target association is a failure even
  if the affiliate registration itself is correct.
- Revoke the inviter's required role, tamper with the target/token and attempt
  a foreign-workspace target. Verify rejection without new memberships,
  profile copies or participant bindings. Preserve the existing late/ended
  event behavior and previously claimed API identity constraints.
- Compare cash and non-cash payments by the registered recipients: only the
  latter enter affiliate revenue/commission. Ordinary cash payment history
  remains available. Capture persisted counters and replay outcomes separately.

These are additional microsteps of this existing NOT RUN case, not new QA IDs
and not updates to any closed Affiliate/Event/API PASS evidence.

## 7. MCP discovery, help and client packages

### Local/dev execution scope

This final API block owns the local MCP OAuth client/simulator development and
its complete local/dev execution. It requires no production configuration,
external ChatGPT account, public deployment or real external-client registration.
Use the development API/MCP endpoints, a local callback receiver and isolated
test identities/configuration. Discovery, browser sign-in/consent, callback,
token exchange and authenticated tool discovery/calls must all reach the real
local/dev implementation. Develop the missing client flow first, then run this
block from its own baseline, checkpoints and cleanup.

An actual browser-based ChatGPT connection is a separate, user-operated manual
deployment acceptance test; it is not a prerequisite or a substitute for this
local API block.

### External client and application contract

The URL-first MCP connection flow must satisfy the following contract. Verify
it in the API/MCP domain first, then execute this block from its own staged
baseline. This is API feature work, not deployment configuration.

Required behavior: the user enters the MCP URL in a supported client such as
ChatGPT or Codex and starts Connect there. The client opens the application's
sign-in and profile/group approval flow, completes its callback and gains the
approved private tools. Ordinary users must not manually copy a client secret.
Manual client-ID/secret registration and a consent page alone do not satisfy
this complete connection flow.

Extend the existing MCP authorization and connection owners. The external client
initiates Connect; determine any additional application-side action from that
flow rather than adding a speculative sign-in button beside Revoke.

### Client experience and simulator acceptance target

Provide a small browser client surface: MCP URL input, Connect, connection status
and a tool request/result view. Connect discovers the server's authorization
metadata and opens the real MyScoutee sign-in/approval surface. The callback
returns to this initiating client; subsequent private MCP requests use the grant
obtained by that flow, without a manually pasted token or client secret. Exercise
initialization, tool discovery and an allowed tool call with its real result.
Keep the post-connect request/result transcript visible so QA can follow the
same connection through to use. Label deterministic test actions accurately;
they do not prove model-driven tool selection or a real ChatGPT/Claude chat.

First evaluate the existing MCP Inspector browser/OAuth client for reuse. Keep
only the missing MyScoutee-specific scenario/UI wrapper in the optional
`myscoutee-mcp` test command; do not reimplement an existing OAuth client merely
to reproduce a client's appearance. An LLM is unnecessary for the local OAuth
and authenticated MCP-call oracle. Real conversation/tool-selection acceptance
is executed separately in the actual external clients.

The connection implementation must support the chosen external client's
discovery and client-identification/registration contract. Current MyScoutee
manual confidential-client provisioning does not establish URL-only onboarding.
Select and implement the supported automatic registration/metadata route before
claiming that an ordinary user needs only the URL. Keep the configured client
identity, redirect, issuer, resource and PKCE checks in the real exchange.

Reference behavior, reviewed 2026-09-27 (recheck client UI labels at execution):

- ChatGPT: add an MCP connection, complete OAuth when requested, then enable it
  in a conversation and make a request that invokes an approved tool. The OAuth
  callback itself need not create or open a new chat. See official
  [connection testing](https://developers.openai.com/plugins/deploy/connect-chatgpt)
  and [OAuth authentication](https://developers.openai.com/plugins/build/auth).
- Claude: add the remote MCP URL under custom connectors, Connect and approve,
  then enable the connector in the conversation. See official
  [custom connector instructions](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).
- Reuse candidate: official [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector),
  which supplies a browser client and OAuth support. Its acceptance here still
  requires exercising the actual MyScoutee endpoints and approved identity.

### Two separately seeded help surfaces

After the connection flow is implemented, extend both existing HU/EN help
surfaces and verify each from its own UI entry:

- Full Help Center: the AI integration chapter owned by
  `frontend/src/app/shared/app-static-data.ts` through the existing Help Center seed builder
  and the Mongo `helpCenterRevisions.json` seeds. Explain URL, client-side
  Connect, MyScoutee sign-in/profile approval, return to the client, conversation
  use and revocation.
- API/Affiliate popup's `?` help: the existing template renders `affiliate.help`
  and `integration.help.*`. Extend its concise instructions through
  `frontend/src/assets/i18n/{en,hu}.json` and the corresponding Mongo
  `i18n_messages.json` seed entries; retain its documentation link. These are
  separate from Help Center revision content.

Use the existing generation/synchronization paths for demo, e2e and deployment
seed variants. Verify both help entry points in local and HTTP modes, including
fresh seed and the supported update path. Record the feature as pending until
implemented; do not publish URL-only onboarding as current functionality early.
This requirement alone does not call for an API management popup redesign.

Make the complete flow runnable in local/dev during development. Provide a
versioned test MCP/OAuth client with its own callback receiver and isolated
identities through the existing QA harness. Keep this simulator in the existing
`myscoutee-mcp` repository as a separately invoked command (for example,
`tools/oauth-client` via `make oauth-client`), reusing the pinned official Inspector and existing Makefile. A new
GitHub repository is unnecessary. Give it an explicit development/test target;
starting the production MCP service must not start the simulator.
This is an optional QA client, not an application runtime dependency. Its
repository location does not make it part of the normal deployment: launch it
only for the test, and stop its callback receiver during checkpoint cleanup.
It must start from the MCP URL,
use the real application discovery/authorization/token/private-tool endpoints,
open the normal browser sign-in and consent UI, receive the callback and finish
with an authenticated private tool call. Do not fabricate grants, callbacks,
tokens or successful responses; a mocked callback is not full-flow evidence.
Run this client simulator outside the application, with its own registered
callback address. Follow discovered authorization metadata to the existing
`/mcp/authorize` browser route with a fresh state and PKCE challenge. After the
real user approval and callback, exchange the code through
`/api/mcp/oauth/token` and call `/mcp/private`. The simulator owns the client
side of this exchange; the application handles real sign-in, consent and grants.
Use a development identity provider/test configuration if sign-in needs one.
Determine the supported local redirect/transport setup during implementation
without weakening production validation. A live production system must not be
required merely to finish development of this API flow.

After implementation, independently stage and run this complete local/dev flow
in this testcase. Verify signed-out and signed-in authorization, explicit profile/group approval,
cancellation, callback completion, reconnect and revocation. Private tools must
remain unavailable before approval and after revocation. Validate client/state,
redirect, PKCE, resource, code expiry/reuse and refresh replay at their existing
API authorization boundaries.

### API QA checks

Prepare this testcase's own UI-created keys and profile boundaries. Execute
these checks again from its versioned checkpoint, regardless of earlier coverage.

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
  Verify the original MyScoutee logo and shared skill; record package validation here.

An independently verified API key must still work without an enrolled browser
session; browser logout does not revoke it, while explicit key revocation does.

- Two concurrent identities remain isolated. Profile switches during creation
  cannot expose the previous secret; create/revoke reconcile the table without
  reload. Local/demo persists settings only. API-key slots remain independent.

- Keep Revoke at the top right of every API-key/MCP connection card, including
  tall cards with a one-time credential, wrapped callback and last-used text.
  Verify narrow mobile and desktop layouts; the action remains reachable.

- The main API popup retains the copyable MCP URL and URL-based OAuth permission
  rows with per-connection revocation. Advanced opens the existing profile-owned
  manual MCP key table with Generate and Revoke; its badge counts those manual
  keys only. Opening Advanced performs no independent reload. Verify both
  collections remain separate after create/revoke and profile changes.
- Base URL uses the same heading plus copy-link-row layout as the personal
  invitation link. Setup instructions stay in the `?` popup.
- Real ChatGPT/Claude/Codex conversation acceptance is a standalone
  [post-deployment smoke](../../../qualification/MCP-CLIENT-CONNECT-SMOKE.md),
  outside this API QA case.
