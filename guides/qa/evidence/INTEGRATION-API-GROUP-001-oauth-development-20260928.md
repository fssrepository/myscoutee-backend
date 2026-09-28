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
- Isolated API fixture not staged yet; original Isolation data stays reset.

## Remaining

- Verify actual external Connect, normal app sign-in/consent, callback and private tool access; negative paths and cleanup.
- Show API popup advanced/details implementation; HU/EN Help Center + `?` seed parity.
- Move actual browser ChatGPT acceptance to standalone post-deployment smoke documentation; keep VMware/local checks in QA.
