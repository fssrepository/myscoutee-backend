# INTEGRATION-API-GROUP-001 — OAuth prerequisite development

Status: IN PROGRESS. This is development evidence, not a completed API QA row.

## Scope and reuse

- User requested a small external Connect client, normal MyScoutee login (demo in dev), consent and genuine MCP access. No LLM/chat simulator needed.
- Use official MCP Inspector 2.8.0, pinned with lockfile under sibling `myscoutee-mcp/tools/oauth-client`; a separate `make oauth-client` invocation. The wrapper isolates state and lifetime only. It does not implement OAuth or start with the production server.
- Existing owners: `McpAuthorizationService`, `IntegrationTokenService`, `McpAuthorizationRepository`, `/mcp/authorize` with its existing entry redirect. Added public client registration metadata separately from profile permissions. Registration alone grants nothing.
- HTTP dev uses the existing demo login only when `config.mcp-demo-enabled` is explicitly enabled (dev profile) and Firebase is disabled. Caller headers cannot choose the OAuth database. Production default remains real; browser-local IndexedDB cannot act as an external OAuth server.
- API popup: URL and connections; instructions stay in `?`. Advanced manual registration is separate. Per-connection settings beside Revoke opens technical details.

## Verification so far

- Existing backend continuous compiler: latest main compilation PASS (intermediate incomplete edit failed, subsequently fixed).
- Test-only `javac` against watcher-owned main classes; existing JUnit launcher: **25/25 PASS** across McpAuthorizationServiceTest, McpOAuthControllerTest, SessionMongoRoutingFilterTest.
- Includes public registration without authority, callback validation, PKCE/one-use code, owner binding, cancel, explicit displayed profile, reconnect reuse, revocation, refresh replay, and dev/real realm controls.
- Nginx syntax check PASS and existing process reloaded for bounded `/api/mcp/oauth/register` route.
- Inspector startup succeeded. Browser Connect / callback / actual private-tool full flow: NOT RUN yet.
- Minimal `mcp-oauth` block7 development fixture staged for OAuth Demo Alex; two managed browsers launched through the versioned launcher. It does not stage blocks1–6. Original Isolation data stays reset.
- Real dev HTTP checks **12/12 PASS**, recorded in `INTEGRATION-API-GROUP-001-oauth-http-20260928.json`: registration/context/consent, PKCE, code replay, actual MCP initialization/discovery/help call, refresh replay and revocation. This did not exercise browser callback or a private business-data read.
- API popup now separates manual MCP keys under Advanced (same retained store, manual count badge) from OAuth permissions in the main popup. Base URL reuses the personal invitation copy-link layout. User accepted Advanced layout and requested the visible Generate label on mobile; compact mode removed.
- HU/EN i18n seed audit PASS (8056 messages); all42 system seed baselines PASS. Frontend watcher build PASS; final label-only rebuild recorded below when complete.
- Unexecuted real-host ChatGPT/Claude/Codex acceptance moved out of QA to `guides/qualification/MCP-CLIENT-CONNECT-SMOKE.md`; deployment QA retains configured-provider OAuth, independently runnable with Inspector. No completed result moved.

## Remaining

- Verify actual external Connect, normal app sign-in/consent, callback and private tool access; negative paths and cleanup.
- Verify browser help entry points and full OAuth flow; source/seed parity already verified.
- Retained development fixture and Inspector require scoped cleanup after the pending browser development verification. Do not close the independent API testcase from development-only evidence.

## Ordered QA handoff — 2026-09-28

User requested recording this work in the Group API checklist and proceeding
from block1 in order, announcing every point and result. The added Advanced/OAuth
microsteps belong to block7; development checks below are not the full-case PASS.

- UI on managed OAuth Demo Alex: Advanced opens without a settings request;
  Generate directly adds a real ID/secret row, no form; pre-existing key retained;
  count changes1→2; close/reopen preserves rows without requests; reload preserves
  IDs and hides the one-time secret; revoke returns2→1 without list reload.
- Base URL copy row is below its label. Updated EN bundle `.3` returns the short
  OAuth permissions heading and translated copy labels, confirmed in browser.
- Generated key usage:11/11 checks PASS in
  `INTEGRATION-API-GROUP-001-generated-keys-20260928.json`. Real UI generation,
  configured callback validation, profile consent, client-ID/secret PKCE token
  exchange, actual MCP initialization/private discovery, UI revoke, rejected old
  bearer and refresh. Pre-existing key preserved during these probes. No private
  business read or external-client browser callback claimed.
- Java27/27 PASS, including generation without callback inputs and exact trusted
  deployment callbacks; existing saved callbacks retain their restrictions.
- Focused local repository file:10/11 PASS. MCP persistence/scope/reload/revoke
  test PASS with callback-free generation. Unrelated cash-receipt test expects
  `canRequestRefund:false`, receives true (line83); code not changed by this work.
  Record for block6 diagnosis against its stable cash rules; do not silently alter
  the expected refund rule or claim this entire test file passed.
- New predefined keys use `config.mcp-manual-redirect-uris`; dev permits only
  Inspector loopback callbacks. No arbitrary redirect is accepted when the UI
  omits callback entry. Public registration unchanged.
