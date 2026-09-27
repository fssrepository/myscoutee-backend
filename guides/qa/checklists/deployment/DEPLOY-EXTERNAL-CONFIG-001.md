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

### Manual browser-based ChatGPT acceptance

The user performs this test in the **ChatGPT website in a browser**. Prepare
this testcase's own reachable test MCP endpoint, identities and checkpoint;
the user controls connection setup, login/consent and the ChatGPT conversation.

1. Enter the MyScoutee MCP URL in ChatGPT's connection setup and choose Connect.
2. Complete the real MyScoutee browser login and profile/group approval, then
   return to ChatGPT without manually copying a client secret or access token.
3. Enable the connection in a ChatGPT conversation and ask for an allowed
   MyScoutee read operation. Verify tool discovery and the actual returned data
   under the approved identity, using the OAuth connection just established.
4. Reconnect and cancel a connection attempt, then revoke this run's grant and
   verify that the private operation is no longer available through it.
5. Record this manual run's results and restore its own checkpoint/test data.

This is real external-client interoperability. The local/dev OAuth simulator
needs no production configuration and is outside this deployment block.

### Other configured external-client checks

This section owns checks that actually require a configured reachable deployment
or an external provider/client: public HTTPS, service registration, permitted
redirects and real ChatGPT/Codex/Claude interoperability. Develop and exercise
the application protocol end to end in local/dev; deployment-only configuration
must not be used as a substitute for a working development flow. The complete
URL-first user flow is not implemented yet, so this checklist is an acceptance
target, not a claim of current support. This testcase still requires its own
fresh configured run and cannot inherit a local/dev PASS.

- Install the unpublished OpenAI/Claude packages in their actual external
  clients; local package validation alone does not prove installation.
- Personal remote `/mcp/private`: add the MCP URL in each supported external
  client (ChatGPT, Codex and Claude), then use its Connect action. Verify the
  browser sign-in and explicit profile/group approval, return to the initiating
  client, and a successful private tool call without manual client-secret copying.
  Enable the connection in an actual conversation and submit a representative
  prompt; record the selected tool, arguments and real result using that same
  OAuth connection. Callback completion alone is not conversation acceptance,
  and automatic opening of a new chat is not required.
  For the assistant-host acceptance, the user clicks Connect and completes the
  real MyScoutee login/approval. In that same configured host/account, verify
  that the assistant can discover the authorized MyScoutee MCP tools and invoke
  an allowed read operation through the resulting connection. Record the
  approved profile/group and actual tool result. A simulator success or a
  connector visible only in a different client/session does not prove this
  assistant has access. Configure the host's supported MCP connection mechanism
  before execution; the simulator callback cannot install tools into a host.
  Check fresh sign-in, an existing signed-in session, cancellation, reconnect,
  and each client's callback within this testcase's own checkpoint.
  Invalid state round-trip, redirect, client, PKCE, resource, expired/reused code,
  refresh replay and revocation must not expose private operations/data.
- An enrolled browser session must not be required for an independently verified
  API key/OAuth grant. Browser logout does not revoke the key; explicit key/grant
  revocation does. Ordinary app requests still require their session.

Record client installation, callbacks, grants and revocation from this run.
Previous configuration or authentication evidence cannot close these checks.
External-client QA may use an isolated development deployment exposed through a
supported tunnel; production data is not required. Record the actual transport
and reachability. ChatGPT documents public HTTPS and Secure MCP Tunnel options;
Claude remote connectors require reachability from Anthropic's infrastructure.
See [ChatGPT connection testing](https://developers.openai.com/plugins/deploy/connect-chatgpt)
and [Claude remote connector requirements](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

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
