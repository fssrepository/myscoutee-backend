# MSC-115 onward — delivery and qualification boundaries

Review date: 2026-10-09. Issue state is a snapshot; the issue/Project is authoritative.

| Task | Classification | Review decision |
| --- | --- | --- |
| [MSC-115](https://github.com/fssrepository/myscoutee-roadmap/issues/153) | Work campaigns, Community cases and multi-group features | Keep open. Its feature acceptance/QA is not satisfied by domain separation or sampled microservice checks. |
| [MSC-116](https://github.com/fssrepository/myscoutee-roadmap/issues/154) | API/MCP access and capability features | Keep open. Implementation evidence does not close deferred execution QA. |
| [MSC-117](https://github.com/fssrepository/myscoutee-roadmap/issues/155) | WebRTC group calling, own STUN and MLS | Keep open. Feature/call qualification is independent of packaging and backend domain ownership. |
| [MSC-118](https://github.com/fssrepository/myscoutee-roadmap/issues/156) | Role guides and notification features | Already closed; leave its state unchanged. Its recorded deferred QA is not newly certified by this session. |
| [MSC-119](https://github.com/fssrepository/myscoutee-roadmap/issues/157) | MCP Read/Events access, statistics and guidance | Keep open. Feature execution QA remains separate. |
| [MSC-120](https://github.com/fssrepository/myscoutee-roadmap/issues/158) | Canonical backend domain segregation and compatibility | Current-source monolith E2E passes 95/95. Keep open: its performance-preservation acceptance remains unresolved (events throughput -25.0% and p95 +71.4%; mixed-sweep throughput -1.1%). Passing stress thresholds is not performance parity. Frontend-local corrections requested during this session are tracked under the user's MSC-120 boundary; see the delay audit. |
| [MSC-121](https://github.com/fssrepository/myscoutee-roadmap/issues/159) | Microservice shell, HTTP/OpenAPI transport and production-style developer lab | Playground delivery complete: revision 101 is Ready, final public/write/browser checks pass, monitoring is healthy and the 28-page PDF is regenerated. Closed / Project Done with measured performance and production-qualification limits retained in the issue. Numbered evidence is in `microservices/PROGRESS.md`. |
| [MSC-122](https://github.com/fssrepository/myscoutee-roadmap/issues/160) | Reusable UI components and generic template extraction | Created and added to MyScoutee Project as Todo for 2026-10-10. Extraction has not started. |

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
