# MSC-116 — API/MCP access and authenticated capabilities

Tracking: [MSC-116](https://github.com/fssrepository/myscoutee-roadmap/issues/154).
Implementation sources prepared; execution QA and artifact qualification remain pending.

## User contract

- Contextual shield button beside each API key, each manual/OAuth MCP client and
  the main MCP URL. Red Blocked / amber Write / green Full; three fixed packs.
- Nested popup selection is local. The shield and label follow that draft.
  Its changed-state tick applies to the parent draft and closes; X discards it.
- One existing settings GET returns API/MCP metadata and access revision. The
  parent's tick sends one revision-checked PUT and closes after success.
  Opening or moving the selector sends no request. Key creation/revocation stay
  explicit operations, separate from staging permissions.
- API keys have independent packs. Each MCP client is capped by the main MCP
  pack. Missing stored configuration preserves the existing Write default.
- Write permits supported organizing writes and necessary results; Full adds
  broader private/workspace reads. Full does not add decision authority.
- Current owner, group membership, visibility and domain lifecycle rules remain
  authoritative; Full does not supply operator privileges or another identity.

## Human review and decisions

The boundary is whether the person must see the relevant picture, profile,
conditions or other context and make their own judgment. Rejection itself is not
inherently prohibited. The current text tool interface does not provide that
complete review flow, so personal ratings, interest, feedback, ballots,
endorsements, participation/invitation responses, taking ownership, offers and
offer decisions remain in the application. There are no API writes for these.

Organizing operations can prepare/manage resources under the existing domain
permissions. Case commands use an explicit allowlist (invitations, board and case
status); personal actions are rejected before entering the domain service. Reads
may return existing results and possible in-app actions; that does not authorize
calling them through an integration. There is no new approval queue or extra confirmation step for those existing buttons.

## Existing owners extended

- `IntegrationSettingsService` coordinates existing token, MCP and affiliate
  services into the combined response. Profile configuration is one atomic
  revision-checked update. Foreign, inactive and admin keys are rejected.
- The old MCP connection store became `IntegrationSettingsStore`, shared by the
  parent and MCP children. Existing local repository/service implement the same
  draft/save contract, preserving access across profile edits and IndexedDB reload.
- Existing Popup, AppMenu, Rate and CopyLink controls are reused. Rate accepts an
  optional discrete palette/label; ordinary ratings retain their original palette.
- API/OAuth authentication checks effective access on each request. Discovery is
  live; a downgrade removes Full tools and blocks stale calls. OAuth grant/refresh
  and queued callback delivery also respect blocking.
- Read and write adapters call existing domain services. New write endpoints return
  only ID, status and version, never the complete domain record. Full reads remain
  separate. MCP message reads do not mark messages as viewed by the person; the
  existing app query keeps its original behavior. Actor identity comes from the key,
  never a payload field. Lists use bounded paging; queries do not create seed data.
- Canonical Java client OpenAPI and the existing MCP schema synchronizer describe
  37 operations (7 existing + 21 reads + 9 organizing command adapters). The watch
  registration and connect routes remain API plumbing, not additional MCP tools.

## Related user corrections

Service feedback now uses the existing event FormFlow image header and labeled
radio/switch blocks: four criteria, five fixed choices (2/4/6/8/10), no text field.
It displays the service image, title, provider and case. Existing historical scores
remain readable; there is no score migration. The shared media badge height is
30 px. EN/HU guides cover all changed controls; generated seeds use existing tools.

## Delivery and verification boundary

The running backend/frontend watcher owns compilation. No second build, server,
fixture reset or browser manipulation was used. Focused regression test sources
were added/extended; execution is deferred at the user's request. Schema and seed
synchronizers and whitespace checks are distinct from executed behavioral tests.

Java client 1.5.0 `installDist` built successfully (tests not invoked). MCP 1.4.0
dev image built through the existing Compose service. Only the old mcp-dev
container was stopped, then replaced with that image; it reports healthy. No
other stack service was restarted. These are build/health results, not proof of
end-to-end access enforcement. Source-only focused regression tests and browser
QA remain NOT RUN. Production artifacts and public plugin publication are not
part of this development delivery.

- [Stable access QA checklist](../qa/checklists/api/INTEGRATION-ACCESS-001.md)
- [Service feedback UI checklist](../qa/checklists/general/SERVICE-FEEDBACK-UI-001.md)
- [Publication, embedded UI and Events research](MSC-116_PLUGIN_PUBLICATION_RESEARCH.md)

## MCP Events continuation — 2026-10-06

Requested: authenticated MCP Events for every consenting user's own connection,
using OAuth 2.1 authorization code + S256 PKCE. DCR client registration is shared
client metadata; the existing per-profile connection and grants own user authority.

References reused: `IntegrationWebhookService` (publication, Mongo delivery queue,
bounded worker pool and retries), `McpAuthorizationService` (OAuth identity and
revocation), and `DeploymentConfigurationCrypto` (encrypted secret envelopes).
The existing watch subscription has a unique token/client index and one callback;
Events needs multiple filtered subscriptions, expiry and signing-key rotation.
Therefore only its subscription records use a separate collection; deliveries and
workers retain their existing owner. No frontend seed or startup change is needed.

Events initially cover existing event.changed, event.encounters and asset.changed
publication points, with a required resourceId filter and compact summaries.
Background Events reads require Full on both the MCP main link and its client.
The existing Write watch/API behavior remains unchanged. Authorization is checked
at subscribe and delivery, including resource ownership, group membership and the
OAuth grant. Human ratings and decisions remain unavailable as integration writes.

Protocol: MCP 2026-07-28, events/list, events/subscribe, events/unsubscribe;
verified HTTPS callbacks, Standard Webhooks signatures, encrypted signing keys,
finite refresh lifetime, idempotent identity and unsubscribe, no replay/cursor.
Implementation and negative-path test sources are complete; execution QA is
deferred as requested. The private ChatGPT conversation could not be read.

The user's follow-up requested lightweight threads and explicit throttling so
Events cannot overwhelm the server. The shared webhook worker now uses virtual
threads with its existing semaphore ceiling. Events reserves a token-bucket and
concurrency permit before claiming a Mongo row: default 4 starts/second, burst 4,
8 simultaneous callbacks and at most 2 verifications. No throttled-row DB churn or
retry consumption. Config is in the existing application environment path.
Subscription/queue admission and seven-day payload retention bound stored work;
concurrent publishers may occupy already-admitted slots. Overload marks a durable
gap and reports truncated at refresh, without failing the user's app action.

Efficiency: one bounded subscription lookup per publication; queue counts only
when subscribers exist. Permissions remain fresh for each outbound delivery;
resource authorization reuses requireOwnedEvent without an unused external-ID
mapping query. Delayed callbacks have a 10s full-response deadline. DNS validates
the actual addresses used for connections, with normal hostname TLS verification.
Signing secrets use the existing deployment encryption key and never leave the
backend. Real/demo index creation extends the existing integration initializer.

Verification: existing Java watcher compilation and frontend watcher compilation
succeeded. The existing Compose MCP build succeeded (1.5.0). Its replacement was
started only after stopping the previous mcp service; health is healthy.
Image: `sha256:d8e39aa64b7c5b4662dd74c6775b526b2aba3c053a783432b29707cc478ef40e`.
EN/HU guide/help revisions, versioned Mongo content, API guide PDF and QA workbook
were regenerated. Source diffs are whitespace-clean. Unit/HTTP/browser/ChatGPT and
load/restart lifecycle tests were not run, as requested. No browser/storage hacks,
additional server stack, real callback subscriptions or public plugin submission
were performed. [MCP-EVENTS-001](../qa/checklists/api/MCP-EVENTS-001.md) remains NOT RUN.

Current Events source commits: frontend `7cc8075c3`, MCP `8500b8c` (1.5.0).
Backend is the MSC-116 commit containing this continuation. Java client 1.5.0 is
unchanged: protocol subscriptions are handled by the remote MCP adapter.

### Earlier development artifact references

- Frontend: `23a118a09` (MSC-116).
- Java client: `246026f` (1.5.0, installDist build successful).
- MCP: `d593b0f` (1.4.0, Compose image build successful).
- Development MCP image ID: `sha256:bb786613182b58ab1298285a9aae4c74822fb5c1af0724c64f56a77372594583`.
- Backend/frontend watcher compilation successful after the final source changes.
- MCP contract synchronizer: 37 operation schemas agree with canonical OpenAPI.
- EN/HU seed generation, selected API guide PDF and QA workbook generation completed.
- Behavior tests, browser QA, production qualification and external publication: NOT RUN.
