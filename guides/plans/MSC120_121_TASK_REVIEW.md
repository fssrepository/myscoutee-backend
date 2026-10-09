# MSC-115 onward — delivery and qualification boundaries

Review date: 2026-10-10. Issue state is a snapshot; the issue/Project is authoritative.

| Task | Classification | Review decision |
| --- | --- | --- |
| [MSC-115](https://github.com/fssrepository/myscoutee-roadmap/issues/153) | Work campaigns, Community cases and multi-group features | Keep open. Its feature acceptance/QA is not satisfied by domain separation or sampled microservice checks. |
| [MSC-116](https://github.com/fssrepository/myscoutee-roadmap/issues/154) | API/MCP access and capability features | Keep open. Implementation evidence does not close deferred execution QA. |
| [MSC-117](https://github.com/fssrepository/myscoutee-roadmap/issues/155) | WebRTC group calling, own STUN and MLS | Keep open. Feature/call qualification is independent of packaging and backend domain ownership. |
| [MSC-118](https://github.com/fssrepository/myscoutee-roadmap/issues/156) | Role guides and notification features | Already closed; leave its state unchanged. Its recorded deferred QA is not newly certified by this session. |
| [MSC-119](https://github.com/fssrepository/myscoutee-roadmap/issues/157) | MCP Read/Events access, statistics and guidance | Keep open. Feature execution QA remains separate. |
| [MSC-120](https://github.com/fssrepository/myscoutee-roadmap/issues/158) | Canonical backend domain segregation and compatibility | Current-source monolith E2E passes 95/95. The matched actual pre-domain control passes with zero errors: warm event throughput 16.82 → 17.25 req/s and mixed sweep 25.60 → 26.62 req/s, with lower p95 in both. Closed / Project Done after the matched control. The sampled domain performance acceptance is satisfied; the earlier cross-date gap was not a proven source regression. Frontend-local corrections requested during this session are tracked under the user's MSC-120 boundary; see the delay audit. |
| [MSC-121](https://github.com/fssrepository/myscoutee-roadmap/issues/159) | Microservice shell, HTTP/OpenAPI transport and production-style developer lab | Playground delivery complete. Initial revision-101 public/write/browser qualification and 28-page PDF are retained. Final verified revision 123 includes Mongo StatefulSet, idle/cache reconciliation, Kubernetes status/SSE and blocking Redis telemetry; 28 focused reader tests and live durable-cursor checks passed. No new full browser/monolith campaign or post-reader CPU improvement is claimed. Closed / Project Done with measured performance and production-qualification limits retained in the issue. Numbered evidence is in `microservices/PROGRESS.md`. |
| [MSC-122](https://github.com/fssrepository/myscoutee-roadmap/issues/160) | Reusable UI components and generic template extraction | Created and added to MyScoutee Project as Todo for 2026-10-10. Extraction has not started. The [numbered components inventory and execution plan](MSC-122_COMPONENTS_EXTRACTION_PLAN.md) records the UI scope and progress. |

MSC-122 preserves the requested generic login/session/demo/guide/MCP/communication
capabilities, admin/operator installation/configuration and job management,
representative member SmartList/calendar/cards/chat, and the centered logo with
handwritten Gothic “Template”. MyScoutee-specific business policy, content
management and moderation remain outside the generic template. Reusable
operator/registry service boundaries are part of the task design.

No broad manual-QA campaign was opened or marked complete. A later general QA
task can collect the feature execution work without relabeling it as domain
segregation. No repository merge or production deployment is implied by task
creation or any later closure.

## Requested follow-up — four blocks

1. **CONTROL COMPLETE — historical 20.60 requests/s:** the exact unchanged
   historical image now reaches 16.07 warm events/s; current code reaches 17.25.
   Reverting application code does not recover 20.60. Runtime load and returned
   dataset differ. Their individual causal contributions are not proven; see
   `microservices/MONOLITH_COMPARISON.md`. No speculative performance patch.
2. **PASS — frontend-local audit and stability:** existing owner operations
   overlap work and emulation; aggregates avoid nested delays. All ten historical
   failures were diagnosed and repaired in test fixtures/harness selection.
   Angular: 21 files / 134 tests passed. See `FRONTEND_LOCAL_DELAY_AUDIT.md`.
3. **DONE — Project measurements:** both issues have all nine requested
   measurement fields, read back from the live Project; full aggregate evidence
   and rate/interval methodology are retained in the roadmap ledger.
4. **DONE — account/README/heatmap reconciliation:** latest reported account
   lifetime is 40,111,683,863; historical task allocation remains labeled as such.
   Combined daily chart is 42,358,256,064 through October 9. All original daily
   rows through September 30 remain intact; later account revisions are disclosed.

The sampled domain qualification above remains valid. These follow-ups must not
be described as completed merely because the domain task was closed.

## PASS — United Kingdom entry after the four follow-ups

CDP native HTTP login passed with **Emma Parker**, selector index 8 (ninth
member), using her existing London coordinates (51.523, -0.1446). Login returned
200 / ACCEPTED; the browser entered `/game` and logged out through the UI.
No seed coordinate change was necessary. With `securityGateEnabled=true`,
London, Edinburgh, Cardiff and Belfast all resolve to `country:gb`; Dublin is
ineligible and has no matching partition. The demo/E2E/production GB geometries
are identical. All 25 local country tests pass, including these four UK points
and the Dublin negative control. This verifies the shared country boundary and
one real UK demo login, not Firebase or every UK coordinate.

Reproduce with the existing launcher and versioned check:

```sh
QA_BROWSER_SESSION_CONFIG="$PWD/microservices/deploy/browser-sessions.json" \
  node guides/qa/tools/open-checkpoint-browser-sessions.mjs MSC121-UK-ENTRY
node microservices/tools/check-uk-entry.mjs
```

Generated evidence: `microservices/build/reports/browser/uk-entry.json` and
`uk-entry.png`; no private browser profile or session token is committed.
