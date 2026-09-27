# DEPLOY-EXTERNAL-CONFIG-001 — Externally configured authentication and integrations

Domain: deployment integration. Deferred by the user from the Group campaign.
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

## 1. Firebase entry and location — DEPLOY-FIREBASE-LIFECYCLE-001

Moved from GROUP-LIFECYCLE-00119.2; shared demo behavior remains in Group QA.

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

- Retain the previously deferred EVENT-INV-002 assertion: using a verified
  non-demo identity, reject an unauthorized direct/deep link to a pending
  invitation's private actions/resources. Do not reopen its closed demo UI case.

## 2. Remote MCP and external clients

Moved from INTEGRATION-API-GROUP-0017. Keep the existing local API-key,
discovery, package validation and connection-table evidence separate.

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

Use `myscoutee-mcp/docs/QA.md` for the detailed external-client steps. Reuse
existing configuration and auth QA evidence where it proves the same assertion.

## 3. Configured deployment help initialization/update

Moved from GROUP-LIFECYCLE-00117: on the separately configured deployment,
verify fresh initialization and the supported help update/import path for both
languages against the canonical help revision. Never reseed live production as
a QA shortcut. Local/dev/e2e and source comparisons remain in Group QA.

## Scope boundary

Configuration-dependent checks are deferred here; this is not a PASS or a
replacement for real provider evidence. Local/demo and simulator-backed payment,
API-key, help and data-isolation checks remain in the active Group campaign.
Earlier closed provider cases retain their recorded results and limitations.
