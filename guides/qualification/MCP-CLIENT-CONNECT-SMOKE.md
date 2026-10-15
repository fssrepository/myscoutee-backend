# MCP external-client Connect — post-deployment smoke

This standalone smoke test is outside the manual QA matrix. It contains the
previously unexecuted real-host acceptance moved from
`DEPLOY-EXTERNAL-CONFIG-001`; no completed result was moved or credited.

## Prerequisites

- A deployed MyScoutee revision and HTTPS `/mcp/private` endpoint reachable from
  the actual external host. A private VMware-only address is insufficient for
  this smoke. Use controlled identities and test data on that deployment.
- The user has access to the chosen host's supported MCP connection mechanism.
  Start with the ChatGPT website; repeat independently for another supported
  host (Claude/Codex) when qualifying that host. Inspector is not a substitute.
- Record deployment revision, host/account, approved profile/group and test
  data cleanup scope. Keep credentials out of screenshots and evidence.

## User-operated browser ChatGPT smoke

1. In ChatGPT's MCP connection setup, enter the MyScoutee MCP URL and choose Connect.
2. Complete the real MyScoutee sign-in and explicit profile/group approval.
   Return to the initiating client without manually copying tokens or secrets.
3. Enable the connection for a conversation. Request one permitted MyScoutee read
   operation and record the actual discovered tool, arguments and returned data
   through that same connection. A callback alone is not a passing result.
4. Verify an existing signed-in session, reconnect and cancellation. Revoke this
   run's permission in MyScoutee and confirm that a subsequent private operation
   through the old connection fails.
5. Remove this run's connection/test data and restore its captured state.

## Other host/package acceptance

Install the unpublished package in its actual target client where applicable;
package validation alone does not prove installation. Repeat the connection,
conversation/read and revocation checks in that client/account. A connection in
one host does not prove another host or assistant session has access.

Record PASS/FAIL/NOT RUN separately for each host, with revision, date, observed
results and cleanup. A failed or unavailable host smoke does not reopen completed
local API/provider QA. Do not count this guide as a manual-QA testcase.

## MSC-119 live host, Events and publication remainder

Status: NOT RUN unless an exact host/deployment result is recorded. These items
are outside MSC-116/119 development QA and outside its matrix estimates.

6. In an actually supported external host with a deployed HTTPS endpoint,
   authorize two independent users and exercise subscribe → signed callback →
   visible chat event → unsubscribe. The publisher's account is not reused.
   Revocation stops delivery; ordinary MCP connection alone does not prove Events.
7. Where supported by the chosen host, configure its real scheduled workflow,
   observe execution and cancellation in that host, and check the documented
   location/permissions. MyScoutee community recurring jobs and a paid host plan
   do not by themselves prove host scheduling or Events interoperability.
8. Qualify each actual target host independently, including external OAuth
   consent/return, account/profile isolation and failed/cancelled setup. Record
   support limitations rather than assuming every host implements every feature.
9. Publication remains with the existing MCP publication handoff: publisher and
   policy facts, deployed endpoints, reviewer access, recorded demo, portal scans,
   attestations and submission/review. A validated development ZIP is not live
   installation or publication acceptance. Do not submit/publish from a QA-only
   request; preserve the user's separate publication instructions.
