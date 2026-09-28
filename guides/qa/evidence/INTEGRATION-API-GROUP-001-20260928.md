# INTEGRATION-API-GROUP-001 — ordered execution, 2026-09-28

Status: baseline ready; 0/7 blocks completed in this independent run.
Current point: block1, issue and repeat participant links; prerequisite UI key.

## Execution contract

Announce every block/point before execution and its actual result afterwards.
Follow blocks1–7 in order; fix/retest concrete failures without silently skipping.
The default repository manual-QA boundary applies to this newly staged campaign:
launcher preparation is complete; the user controls checklist browser actions
unless they explicitly delegate this full testcase. Earlier automated Isolation
and the delegated MCP credential-development probes do not authorize arbitrary
browser actions in this new checkpoint.

## Baseline and startup

- `mcp-oauth` development fixture reset completed with exact restore; its managed
  browsers closed and optional Inspector process stopped. Development proof is
  retained in `INTEGRATION-API-GROUP-001-oauth-development-20260928.md` and
  `INTEGRATION-API-GROUP-001-generated-keys-20260928.json`.
- Versioned scenario: `integration-api-group`, same testcase ID. Four isolated
  actors: Group API Alex (administrator), Maya (existing non-member), Milo
  (outsider), Nia (pending-branch control). Namespaced IDs use `f0300926`.
- Groups `qa-group-api-a` and `qa-group-api-b`: private/workspace-enabled, Alex
  accepted as Admin, no recipients/memberships/keys pre-created for the test.
- Fresh registration names reserved for the actual entry UI: Group API Fresh
  Rowan / Group API Fresh Event. No fresh user inserted or session injected.
- Baseline snapshots retained by the common harness. Only checkpoint-owned
  identities/resources/registrations are in the cleanup boundary.
- Existing versioned launcher prepared two windows: Group API Alex and a signed-
  out recipient. Both reported ready. Common active-session cleanup is retained.
- No checklist action after startup has run in this ordered campaign.

## Point ledger

| Block | State | Next check |
| --- | --- | --- |
| 1 | READY | Generate Alex's ordinary API key in the profile API UI; issue two ordered participant links. |
| 2 | NOT RUN | Fresh registration/active group through real entry UI. |
| 3 | NOT RUN | Existing recipient and rejected claims. |
| 4 | NOT RUN | Workspace changes and failed-transport retry. |
| 5 | NOT RUN | Event control/isolation and scoped cleanup checkpoint. |
| 6 | NOT RUN | Attribution and cash exclusion; diagnose the supporting cash-refund test expectation recorded in development evidence. |
| 7 | NOT RUN | Ordered Advanced/manual-key, URL OAuth, callback/tool and help checks; development probes do not replace this run. |

The application and frontend watchers own compilation. No additional stack,
server or main build was started. Latest UI build and seed parity passed.
