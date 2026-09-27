# DEPLOY-EXTERNAL-CONFIG-001 — Externally configured authentication and integrations

Domain: deployment integration. This is an independent testcase.
This checklist covers the existing checks requiring provider configuration or
external client registration. Use an isolated configured test deployment and
controlled accounts; it does not authorize changing a live production system.
Execution status and evidence belong in the QA ledger, not this checklist.

## Prerequisites

- Configure and activate the tested Firebase revision through the existing
  Operator configuration flow. Use controlled fresh and existing accounts.
- For remote MCP, provide the registered external clients, reachable HTTPS
  endpoint and matching redirect configuration.
- Reuse the existing fixture harness and browser launcher. Real authentication
  must use the normal UI; injected demo sessions cannot prove these checks.

## 1. Firebase entry and location

1. Fresh Firebase registration/sign-in with no saved coordinate: request location
   through Setup, then complete onboarding. The scoped browser pending point
   survives reload and is sent only on the first `/auth/me/profile-ext` request
   as latitude/longitude parameters (alongside groupId when selected), with no
   location X-header. Verify Mongo account/active group profile and local
   IndexedDB separately. Only a successful authoritative response clears pending.
2. Fail that profile request: no cached-success acknowledgement, no losing the
   pending point; retry sends it again. Account switch must not send another
   account's point, and an older reply must not clear a newer staged point.
3. Existing registered Firebase user: logout and sign in once, with avatar preview
   changing. Enter the app on that first attempt. Real logout/account/session
   change still discards stale reads; failed group switch unlocks the selector.

4. Using a verified non-demo identity, reject an unauthorized direct/deep link
   to a pending invitation's private actions/resources. Prepare the private event,
   pending recipient and unrelated account within this checkpoint.

## 2. Remote MCP and external clients

- Install the unpublished OpenAI/Claude packages in their actual external
  clients; local package validation alone does not prove installation.
- Personal remote `/mcp/private`: create a profile-owned MCP connection under
  API keys, copy the one-time secret into client settings, sign in and explicitly
  approve the displayed profile/group. Check both ChatGPT and Claude callbacks.
  Invalid state round-trip, redirect, client, PKCE, resource, expired/reused code,
  refresh replay and revocation must not expose private operations/data.
- An enrolled browser session must not be required for an independently verified
  API key/OAuth grant. Browser logout does not revoke the key; explicit key/grant
  revocation does. Ordinary app requests still require their session.

Record client installation, callbacks, grants and revocation from this run.
Previous configuration or authentication evidence cannot close these checks.

## 3. Configured deployment help initialization/update

On this testcase's separately configured deployment,
verify fresh initialization and the supported help update/import path for both
languages against the canonical help revision. Never reseed live production as
a QA shortcut. Local/dev/e2e and source comparisons remain in Group QA.

## Restaging, checkpoints and cleanup

- Start with an isolated configured test deployment and a snapshot of its tested
  configuration revisions. Prepare fresh and existing identity actors, two
  disjoint groups/profile owners, a private pending invitation and unrelated
  denial actor. Record their IDs in this testcase's fixture manifest.
- Register the fixture and actor/browser configuration under this testcase's
  own checkpoint ID in the existing versioned harness and launcher. Verify the
  baseline before starting; no retained state from another testcase is assumed.
- Capture separate entry checkpoints for Firebase, remote MCP and help setup.
  Restage the applicable checkpoint before retrying a failed branch. Snapshot
  provider settings, test identities, invitation/membership records and grants
  within the exact cleanup scope; never reset unrelated deployment data.
- For fresh-install help checks, use a separately initialized disposable
  deployment. For update checks, stage the recorded prior revision and execute
  the actual supported update path, then verify HU/EN and MCP reads.
- After execution, revoke this run's keys/grants, unregister its test clients
  where applicable, clean up its test accounts and restore captured configuration
  and database state. Independently verify cleanup before closing the testcase.
- Earlier successful combinations are diagnostic context only. Every assertion
  here needs this testcase's own staged execution and persisted evidence.
