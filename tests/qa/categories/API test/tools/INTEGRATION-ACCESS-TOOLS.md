# Integration access QA tools

These development tools were extracted from the delegated MSC-116 session on
2026-10-15. They are executable test support, not application features. The
ordered acceptance criteria remain in `../checklists/api/MSC-116_AUTOMATIC_QA.md`.
This document explains reproduction; it is not a campaign result log.

## What is real and what is controlled

| Tool | Role | Real boundary / controlled behavior |
| --- | --- | --- |
| `oauth-qa-callback.mjs` | Loopback OAuth landing page | Receives the real browser redirect; only the centered status page is QA-owned. It does not issue codes/tokens, emulate consent or forward credentials. |
| `mcp-qa-client.mjs` → `openMcpStdio` | JSON-RPC test client | Launches the actual packaged MyScoutee MCP executable and sends newline-delimited JSON-RPC over stdin/stdout. No private tool results are fabricated. |
| `mcp-qa-client.mjs` → `createMcpHttp` | HTTP JSON-RPC test client | Calls the running `/mcp` or `/mcp/private`; supports its JSON/SSE responses. This minimal client is not ChatGPT, Claude or official Inspector qualification. |
| `mcp-qa-client.mjs` → `runJavaClient` | Java CLI process wrapper | Runs the installed Java client with a dedicated private configuration. It does not implement or imitate the Java SDK. |
| `integration-access-qa.mjs` → `integrationApi`, `manualAccessMatrix` | Permission probes | Calls real settings, connection, query and MCP endpoints. Matrix changes use normal revision-checked PUTs and restore the tested permissions in `finally`. |
| `integration-access-qa.mjs` → `authorizeUi` | OAuth code + S256 PKCE client | Opens the real consent screen in an existing managed browser; checks returned state/issuer and exchanges the real code. Credentials stay in the caller's memory. |
| `withFailedSettingsSave` | Deliberate transport failure | Aborts only settings PUTs while the supplied callback runs, then removes that route. It does not inject an application error or change component state. |
| `holdSettingsResponse` | Deliberate late response | Fetches the actual settings GET response, holds it until released, then forwards it unchanged. Closing the helper releases pending work before removing the route. |
| `setBrowserLocale` | Browser environment control | Sets Chromium locale/language and reloads. Uses `en-US,en` or `hu-HU,hu`, without HTTP `;q=` weights in `navigator.languages`. |
| `walkGuide`, `integrationGuideSet` | Visible guide traversal | Clicks actual Next/Done controls and checks card/focus geometry. The selector draft is discarded. These helpers alone do not prove Back/picker behavior. |
| `manual-qa-checkpoints-docker.sh` work-community commands | Retained fixture boundary | Captures/restores actor-owned data. The integration membership control temporarily sets Alex's existing Work membership to `left`, then restores its exact retained row. This is a deliberately prepared negative fixture. |

The Group MCP probe now shares `mcp-qa-client.mjs`; its original CLI remains
`node tests/qa/categories/API test/tools/group-mcp-client-qa.mjs capture|probe group|base`.
The existing raw-CDP helper `integration-api-cdp.mjs` and guide session helper
`explanation-guide/session.mjs` predate this run. The new access helper accepts
an already attached Playwright page, avoiding another browser/session owner and
preserving the exact EN/HU guide and access-matrix checks from this campaign.

The deliberate settings conflict also used real API requests: one save changed
Work from Write to Read and advanced its revision; the stale visible editor then
attempted Full and received 409. No direct database revision increment was used.

## Runtime and fixture prerequisites

Use the existing development stack and existing compiled client artifacts. Do
not start a second application stack or watcher. The browser actions below
require the campaign's explicit full-flow delegation; these helpers do not
extend manual-QA launcher authorization.

From the backend repository root, inspect the retained baseline first:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh status work-community MSC115-WORK-COMMUNITY
```

On a fresh campaign only, stage `work-community MSC115-WORK-COMMUNITY`, then use
`npm --prefix tests/qa run browser -- INTEGRATION-ACCESS-001`.
Do not restage or relaunch an already active campaign. MSC-116 reuses the named
Work/Community fixture; it does not replay MSC-115 acceptance steps.

The added fixture commands are:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh capture-integration-catalog work-community MSC115-WORK-COMMUNITY
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh capture-integration-roles work-community MSC115-WORK-COMMUNITY
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh stage-integration-former-member work-community MSC115-WORK-COMMUNITY
# Perform the connection/read denial checks, then restore immediately:
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh restore-integration-member work-community MSC115-WORK-COMMUNITY
```

The catalog capture covers actor-owned integration mappings, participant
invitations, events and asset resources before mutations. Existing case,
announcement and schedule capture commands still own those domains. Their
cleanup selectors recognize both MSC115 and MSC116 QA titles. Normal final
fixture reset also restores any outstanding integration membership control.
Role capture retains the existing app-admin/operator profile settings before
role-key changes; it creates no role and grants no additional authority.

## OAuth callback page

```bash
node "tests/qa/categories/API test/tools/oauth-qa-callback.mjs" 6274
```

Keep it running during consent. It listens only on `127.0.0.1`; the development
OAuth callback is `http://127.0.0.1:6274/oauth/callback`. The application's existing
redirect allowlist still applies. Stop it with Ctrl+C. If a receiver or Inspector
already owns that port, stop that known owner before replacing it.

The page contains static English status text in a centered responsive card.
It never prints, writes or embeds the callback query (code, state or issuer).
`callbackHandler` can also be attached to an already running QA HTTP server;
`startCallback()` returns the server for explicit `server.close()` cleanup.

## Reattach to an existing managed browser

Run in Node's persistent REPL (or a private local `.mjs` driver). This connects
to an existing launcher window; it creates no browser or tab:

```js
const {readFile} = await import('node:fs/promises');
const {createRequire} = await import('node:module');
const require = createRequire(process.cwd() + '/myscoutee-frontend/package.json');
const {chromium} = require('playwright');
const manifest = JSON.parse(await readFile('/tmp/myscoutee-qa-browser-sessions/INTEGRATION-ACCESS-001.json', 'utf8'));
const browser = await chromium.connectOverCDP('http://127.0.0.1:' + manifest.sessions[0].devToolsPort);
const page = browser.contexts().flatMap(c => c.pages()).find(p => p.url().startsWith('http://localhost'));
page.setDefaultTimeout(5000);
const qa = await import('./tests/qa/categories/API test/tools/integration-access-qa.mjs');
const clients = await import('./tests/qa/categories/API test/tools/mcp-qa-client.mjs');
```

Actor 0 is Alex; actor 1 is Maya. Capture the four session headers from an actual
browser API request, in memory: `cookie`, `x-app-session-id`,
`x-app-session-kind`, `x-demo-user-id`. Do not copy them into repository files or
console output. The interactive session's current workspace is authoritative.

When changing the signed-in role in an existing window, capture fresh headers
from that identity's real request. For the administrator's combined desktop/MCP
settings, pass `settingsPath: '/admin/client-api/settings'` to `integrationApi`;
member and operator settings use its default path.

Create disposable API/manual credentials through the ordinary settings UI and
capture the corresponding successful creation response in memory. An API key
requires a persistent UUID client ID; first use claims it. A manual MCP secret
is an OAuth client secret, not an API bearer token. Use real consent first:

```js
const grant = await qa.authorizeUi({page, clientId: manual.client.clientId,
  clientSecret: manual.secret});
// Public DCR uses the same function with the registered client ID and no secret.
// grant.tokens and grant.exchange contain secrets: do not log them.
```

`authorizeUi` expects English controls and returns to `/game`. Its callback
receiver must already be running. For DCR, register through the metadata's
registration endpoint using `token_endpoint_auth_method: "none"`, the exact
callback, `authorization_code`/`refresh_token`, `code`, and `myscoutee:api`.

Retain the CDP session returned by `setBrowserLocale(page, locale)` and pass it
as the third argument on subsequent changes. If the managed session already has
a locale override, pass that existing CDP session from the start; Chromium
rejects a competing override. Restore the original locale when the checks end.

After that real consent, `oauthProtocolChecks({page, browserHeaders, clientId,
profileId})` exercises wrong redirect/resource/scope/verifier, code reuse and
refresh rotation/replay through the real endpoints, matching the earlier
`deploy-oauth-protocol.py` protocol cases. It creates a separate grant because
the replay check deliberately revokes it. The returned `rows` are sanitized;
`expiry.check()` privately retains a real unused code and verifies its natural
expiry after `expiry.expiresAfter`. Continue independent checks in the meantime;
do not shorten the product lifetime or block the session with a five-minute sleep.

## Real MCP and Java clients

Copy the currently deployed MCP binary without building or starting a server:

```bash
mkdir -p /tmp/msc116-qa
chmod 700 /tmp/msc116-qa
docker cp mcp-dev:/myscoutee-mcp /tmp/msc116-qa/myscoutee-mcp
```

```js
const rpc = await clients.openMcpStdio({binary: '/tmp/msc116-qa/myscoutee-mcp',
  apiBase: 'http://localhost/api', token: apiKey.value, clientId: apiClientUuid});
try {
  const discovery = await rpc.call('tools/list');
  console.log(discovery.result.tools.map(t => t.name));
} finally { await rpc.close(); }

const http = clients.createMcpHttp({request: page.request, token: grant.tokens.access_token});
const discovery = await http('tools/list');
// Omit token for anonymous help-only /mcp. This is the real running MCP service.
```

The executable's stdio configuration requires API token and UUID together.
Use HTTP `/mcp/private` for OAuth and Events checks. The Java client configuration
is a chmod-600 file outside the repository containing `baseUrl`, `token`,
`clientId`. Its base URL ends in `/api/integrations/v1`. Reuse the API key's claimed
UUID, then call:

```js
const result = await clients.runJavaClient({
  executable: '/home/raxim/workspace/myscoutee-client/build/install/myscoutee-client/bin/myscoutee-client',
  configPath: '/tmp/msc116-qa/java-client.properties', args: ['query', 'listCampaigns']});
console.log({exitCode: result.code, httpStatus: result.httpStatus});
```

Use `command updateCampaign request.json resource-id` and the other existing CLI
commands with disposable fixture-owned records. Raw query responses may contain
personal data; evidence should contain explicit counts/status/assertions only.

## Permission matrix and controlled transport faults

Select the credentials' issuing workspace before running the 16-case matrix:

```js
const rows = await qa.manualAccessMatrix({page, browserHeaders,
  manual: {tokenId: manual.client.token.id, accessToken: grant.tokens.access_token},
  apiKey: {tokenId: apiKey.token.id, value: apiKey.value, clientId: apiClientUuid}});
console.log({cases: rows.length, passed: rows.filter(r => r.pass).length});
```

The matrix covers Blocked/Write/Read/Full main × manual-client combinations,
real discovery and query enforcement, plus API-key independence. It restores the
original tested packs but naturally advances settings revisions; reopen any
editor before continuing. Actual organizing writes, queued delivery cancellation
and membership loss remain separate checklist cases.

For the four independent API packs, use `qa.integrationApi(...).save(null,
{[apiKey.token.id]: pack})`, followed by `/connect`, `/events?limit=1` and real
stdio `tools/list`. Restore the original pack after the loop.

```js
await qa.withFailedSettingsSave(page, async () => {
  // Stage a change, click the parent Save, and assert the visible retained draft/error.
}); // The PUT abort is removed before the normal retry.

const delayed = await qa.holdSettingsResponse(page);
try {
  // Open integration settings normally.
  await delayed.started;
  // Close the popup and switch workspace normally, then release the old response.
  delayed.release();
  // Assert that the old popup/draft does not reappear in the new workspace.
} finally { await delayed.close(); }
```

These fault helpers change transport timing/failure only. They never inject
application state or fabricate a successful response. A prior ad-hoc delayed
request handler failed because it was removed before completion; that harness
failure is not evidence of a product defect.

## Guide traversal

Open the existing integration settings through the UI. For each Dating/Work/
Community profile, use EN/HU and desktop/mobile viewport settings:

```js
await qa.setBrowserLocale(page, 'hu-HU'); // Reloads; reopen the settings normally.
await page.setViewportSize({width: 390, height: 844});
const tours = await qa.integrationGuideSet(page, 'Community HU mobile');
// Desktop is 1280 × 900. Restore en-US and the original viewport afterward.
```

The recovered helper covers parent, changed selector and help tours. It records
step titles and geometry, not credentials or private form content. Add explicit
Back/picker and role/local cases when those checklist steps are reached.

For a reported loading flash, use the same tour with a human-visible delay:

```js
const frames = await qa.observeGuideFrames(page, async () => {
  await page.locator('.explanation-guide-menu').getByRole('button').click();
  await qa.walkGuide(page, 'slow guide', {stepDelayMs: 1200});
});
```

This read-only observer samples rendered frames and records only changes in
loading-ring, card and focus visibility plus numeric progress and elapsed time.
It removes its animation-frame observer in `finally`. Compare reopening the
current guide with opening a different popup's guide: context changes discard
the current guide revision. Frame sampling distinguishes the loading backdrop
from the short focus-positioning interval; it does not measure network latency
or prove that a transient shorter than one rendered frame never existed.

## MCP Events receiver and temporary HTTPS endpoint

Before creating Events subscriptions, capture their cleanup boundary with the
existing fixture:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh capture-integration-events work-community MSC115-WORK-COMMUNITY
node --test tests/qa/node_modules/@fssrepository/myscoutee-qa/webhooks/signed-webhook-receiver.test.mjs
```

The capture retains actor-owned subscriptions, deliveries, delivery-linked retries
and DCR registrations named `MSC116 QA Events ...`. Fixture reset restores these
snapshots. Disposable assets must use the exact title `MSC116 QA Events owned asset`;
reset removes only captured actors' matching assets created after the capture.
An ordinary asset delete only moves it to Trash and is not final fixture cleanup.

For the encounters case, create `MSC116 QA Events Mingle` through the normal
integration API, then run `capture-mixing-event` with `MANUAL_QA_EVENT_ID` set to
its returned internal UUID before admission or Mingle actions. The existing
mixing capture accepts this narrowly checked, newly created actor-owned event;
the earlier integration capture removes the event at final reset. Use the same
external participant ID for the same person across events. Mingle actions use
the selected workspace profile ID, as the UI does, rather than its base account ID.

In the persistent Node QA driver:

```js
const {startEventsReceiver} = await import('./tests/qa/categories/API test/tools/integration-api-webhook-receiver.mjs');
const receiver = await startEventsReceiver({port: 18090});
const callback = receiver.register('primary');
// Keep callback.path and callback.secrets in private memory; never print them.
// Subscribe with delivery.url = tunnelOrigin + callback.path and
// delivery.secret = callback.secrets[0], using the ordinary MCP request.
callback.setBehavior('accept');
```

The receiver binds only to `127.0.0.1`. It validates the Standard Webhooks HMAC
over the exact received bytes, message ID and timestamp, then echoes a signed
verification challenge or returns 204 for an event. It is a callback test double;
the OAuth server, subscriptions, event producers, queue and outbound sender are
the real application. `setSecrets([current, previous])` checks both signatures.
Fault behaviors are `mismatch`, `stall`, `drop`, an HTTP status number, or `hold`.
For bounded response faults, use `{status, headers, body, chunks, intervalMs}`:
4096/4097 ASCII bytes check the response-size boundary; 20 one-byte chunks at
1000 ms intervals check the total deadline. The fixture caps output at 16 KiB,
30 chunks and 1000 ms between chunks. A 302/307/308 `Location` response tests
redirect handling; inspect the actual queue's `http_302`/`http_307`/`http_308`
result, rather than inferring non-following only from a missing signed receipt.
For the concurrent unsubscribe test, wait for the held challenge receipt, perform
the real unsubscribe, then call `callback.release()`. No DB version is fabricated.

The application's callback validation requires public HTTPS and rejects loopback
and private addresses. For this development run, the official Cloudflare
`cloudflared` executable (2026.10.0) forwards only the receiver port:

```bash
cloudflared tunnel --url http://127.0.0.1:18090 --no-autoupdate
```

Capture the generated HTTPS origin privately from its process output. This is a
temporary Cloudflare Quick Tunnel, not an SSH tunnel or the VM access connection.
It exposes the receiver only; it does not expose the application or browser ports.
Use random per-test callback paths, retain the tunnel process handle and stop that
process during cleanup. Download instructions: https://developers.cloudflare.com/tunnel/downloads/
Quick Tunnel behavior: https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/

The HTTP pool permits four connections per destination host. To measure the
eight-callback process limit, run a second Quick Tunnel to the **same** receiver
port, alternate twelve subscriptions across the two origins, then hold deliveries.
Read the existing fixture status while eight callbacks are held: the remaining
four rows must still be `PENDING`, attempt zero, with their original due time.
Release all callbacks and revoke those disposable subscriptions. Retain and stop
both tunnel process handles; no second application stack is needed.

For actual connection-resolver checks, `mcp-events-dns-fixture.py` changes only
marked `/etc/hosts` lines in the existing `myscoutee` container. It accepts only
disposable Quick Tunnel names or `msc116-*.invalid` test names, validates IPs,
preserves unrelated entries, and never starts/restarts a container:

```bash
python3 "tests/qa/categories/API test/tools/mcp-events-dns-fixture.py" stage --host "$qa_callback_host" --address 127.0.0.1
python3 "tests/qa/categories/API test/tools/mcp-events-dns-fixture.py" clear
```

Always clear in `finally`. Use fresh test names for each private-range case.
For rebinding, first prove the public callback, change its resolution, wait for
the JVM's positive DNS cache to expire (35 seconds in this dev runtime), and use
a new signing key to bypass the five-minute challenge cache. Verify rejection,
clear the override, wait for DNS cache expiry again and prove public success.
Do not change JVM TLS verification or callback allowlists for these checks.

The existing work-community fixture owns bounded queue-admission data:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh stage-events-backlog-profile-998 work-community MSC115-WORK-COMMUNITY
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh clear-events-backlog work-community MSC115-WORK-COMMUNITY
```

Accepted boundaries are `profile-998`, `profile-999`, `profile-1000`,
`database-9998`, `database-9999`, and `database-10000`. Capture the Events baseline
and produce one real delivered envelope first. The fixture snapshots an empty,
dedicated ID namespace, clones only queue structure, distributes database-level
rows across existing fixture actors, and makes every synthetic row due two hours
later. These rows are backlog ballast, never simulated delivery results. Real
app mutations and MCP refreshes test admission and durable `truncated` reporting.
Each stage replaces only the fixture's own rows; `clear-events-backlog` removes
them, and ordinary campaign reset also restores their captured empty namespace.
Do not leave staged backlog while moving to another checkpoint.

`receiver.receipts` contains private in-memory payloads. Persist only
`receiver.evidence()`, which removes payloads and records hashes, byte counts,
timestamps, IDs and key-validation booleans. Keep any resumable credentials outside
Git in a mode-0600 file under a private directory, and delete it at cleanup.
`await receiver.close()` releases held callbacks, destroys sockets and clears
in-memory receipts. The legacy command-line `/watch` receiver remains unchanged.

For `createMcpHttp`, choose `protocolVersion: '2026-07-28'` to send the MCP Events
protocol's `Mcp-Method` header and required `_meta` protocol/client fields. The
`tools/call` path also sends its required `Mcp-Name` routing header. The
helper defaults to the older protocol for existing non-Events checks; static
API-key stdio remains a separate transport test.

The sibling MCP Go transport tests can reuse its existing compiler/cache image
without starting another application server (run only after the normal resource
check; no overlapping test owner):

```bash
docker run --rm --name msc116-mcp-tests --cpus=2 --memory=2g \
  --mount type=bind,src=/home/raxim/workspace/myscoutee-mcp,dst=/src,readonly \
  --mount type=volume,src=msc-mcp-go-mod,dst=/go/pkg/mod \
  --mount type=volume,src=msc-mcp-go-build,dst=/root/.cache/go-build \
  -w /src -e GOMAXPROCS=2 golang:1.26-bookworm go test -race -p 1 ./...
```

For account-purge cleanup, the existing admin-job harness has a bounded
`with-mcp-events` variation:

```bash
bash server/docker/scripts/admin-job-fixtures/admin-job-fixtures.sh status account-purge
bash server/docker/scripts/admin-job-fixtures/admin-job-fixtures.sh prepare account-purge with-mcp-events
bash server/docker/scripts/admin-job-fixtures/admin-job-fixtures.sh status account-purge
bash server/docker/scripts/admin-job-fixtures/admin-job-fixtures.sh reset account-purge
```

It stages a deleted synthetic account, one disabled Events subscription and a
future-due queued payload, plus separate control-owner rows. It invokes the real
purge scheduler through the existing due-rule mechanism. The oracle requires
owned rows to disappear and control rows to remain. No callback is sent by this
fixture. The account-purge definition explicitly selects `baseGroupId: null`;
the common harness uses that scope for rule capture/mutation and restores the
captured rule by its document ID. Reset restores the retained rule and removes
the synthetic namespace. Do not reuse a real campaign actor for purge testing.

## Existing email-provider simulation

`email-provider-stub.py` predates MSC-116. It emulates SendGrid's
`POST /v3/mail/send`, checks the request envelope, returns configurable acceptance
or failure, can drop an accepted response, and has a deterministic retry scenario.
It never forwards email. Its request payload log is private runtime evidence;
Authorization headers are excluded. Example startup:

```bash
python3 "tests/qa/categories/Operator/tools/email-provider-stub.py" --host 127.0.0.1 --port 18991 --output /tmp/myscoutee-email-qa.jsonl
```

The complete endpoint override, fixture, synthetic credentials, failure/retry
cases and cleanup are in `../checklists/operator/OPERATOR-EMAIL-WARNING-001.md`.
`test_email_provider_stub.py` and `verify-email-retry-qa.py` provide its checks.
It was not started or used in this MSC-116 run.

## Cleanup

Remove fault routes and restore the browser locale/viewport. Close spawned stdio
clients and the callback receiver. Revoke disposable keys/grants/subscriptions
through their normal flows; restore captured fixtures only at campaign closure.
Delete private temporary credential/configuration files. Leave the original
application/watchers and managed browser ownership as required by the campaign.
Never commit tokens, OAuth codes/verifiers, session headers or private responses.

## Central Feedback local fixture boundary

`localFeedbackFixture(page)` captures only users, serviceCases,
feedbackEvaluations, feedbackStates and notifications from the disposable local
IndexedDB. Save the returned object privately before the normal case completion
and labelled Feedback form submission. `localFeedbackFixture(page, snapshot)`
restores the same five entries, then returns to entry. Restore the HTTP build
through the existing watcher and reload the managed actor afterward.

The central schema initializes empty tables in memory. The general persistence
policy omits empty IndexedDB tables, so the snapshot records absence as null and
cleanup deletes that entry instead of inventing data. All evaluation creation,
submission and counters still use normal application actions and their owner.

Restore opens a same-origin empty fixture page with a route handler. It enables
CDP Network and bypasses the service worker only for this guarded restoration
page; its title must match before writes are allowed. This prevents the worker
from substituting the app shell and leaving application writers active during
restore. The helper removes the route, restores normal service-worker handling
and detaches afterward. No network-offline mode or UI/store injection is used.

For a pre-rename MSC116 Mingle fixture whose old projection marker is already
set but whose canonical feedbackStates row and feedbackCounts projection are
absent, retain the event in the existing campaign snapshot first. Export only
that fixture event to a temporary events.json, retaining its _id and all data
except feedbackCountersProjected=false. Require exactly one matching fixture
and absent canonical projection before proceeding. Use the normal importer with
MONGO_IMPORT_SINGLE_FILE pointing at this one-row events.json,
MONGO_IMPORT_REPLACE_COLLECTIONS=false and MONGO_APP_DATABASE=demo_db.
The existing event-counter-expiry worker then creates the canonical state and
counter receipt. Do not write counters or call this a manual job execution.
The normal campaign reset owns eventual restoration of this retained fixture.

Translation content/version changes use the existing generator and importer:

```bash
node myscoutee-frontend/scripts/generate-i18n-mongo-seed.js
# Import messages first, then publish the bundle revision; only these two files.
for collection in i18n_messages i18n_bundles; do
  docker exec -e MONGO_APP_DATABASE=demo_db -e MONGO_SEED_DIRECTORY=demo_db \
    -e MONGO_IMPORT_SINGLE_FILE=/docker-entrypoint-initdb.d/demo_db/${collection}.json \
    -e MONGO_IMPORT_REPLACE_COLLECTIONS=true mongodb \
    bash /docker-entrypoint-initdb.d/mongo_import.sh
done
```

The normal single-file replacement avoids old renamed message IDs conflicting
with the unique key/language index. This is catalog replacement through the seed
policy, not direct mutation of live application transactions. Keep mongodb-sync
off during the retained campaign and do not import unrelated fixture collections.

## Guide introduction and serial deployment handoff

Use the existing EXPLANATION-GUIDE-LANDING-001 launcher without --headless.
Its current retained work-community baseline is verified before each fresh
anonymous run. Entry consent and introduction auto-dismiss are disabled.
`guideIntroductionSnapshot(page)` is a read-only DOM/storage oracle for text,
line count, bounds and consent/seen state. `holdGuideIntroductionResponse(page)`
uses the same held-response implementation as settings: it fetches the real
`/api/landing/explanation?contextKey=landing.guide` response and forwards it
unchanged after release. Always close the hold in cleanup. It creates no guide
or consent data. This enables a deterministic stale-response check without
waiting on an arbitrary backend delay.

For the serial KVM handoff, preserve the authenticated INTEGRATION-ACCESS-001
manifest, profiles and tracked sessions. A Playwright CDP browser.close() only
disconnects the attachment; use a browser CDP session's Browser.close command to
close the owned Chrome process. The existing launcher --reopen-actor=0 and
--reopen-actor=1 restore those same profiles/windows after monolith returns.
Use --close-only for the disposable anonymous introduction session, whose
profile and manifest can be deleted. Do not apply --close-only to retained
campaign actors before their owning cleanup boundary.

## Bounded Events catalog timing

`measureMcpEventsCatalog(client, { warmup: 3, samples: 20 })` reuses an already
authorized MCP client and executes `events/list` serially. It checks a stable,
non-empty catalog and reports total request count, errors, mean, median, p95 and
maximum latency. Samples are bounded to100. It creates no subscription and
changes no application state. Close the existing client/session normally.

Use the existing `microservices/tools/measure-stress.py` resource snapshot and
resource-delta functions around the same window when CPU evidence is needed.
Host/VM deltas include background jobs and harness overhead; they are not
exclusive request CPU. A comparison requires matching revisions, data, workload,
warmup, concurrency and deployment limits. Missing historical evidence must be
reported as unavailable, never inferred from a successful functional check.
