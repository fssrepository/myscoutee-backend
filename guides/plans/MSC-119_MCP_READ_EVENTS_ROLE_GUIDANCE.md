# MSC-119 — MCP Read, Events and role guidance

Current implementation task, 2026-10-07. Project issue:
https://github.com/fssrepository/myscoutee-roadmap/issues/157

## Current follow-up scope — user decision, 2026-10-07

The two remaining work areas are:

1. Complete execution QA, including the expanded guides, Local/HTTP flows,
   mobile surfaces, OAuth/Events and load checks.
2. ChatGPT/Claude publication. The user subsequently excluded embedded interfaces.

Publication dev preparation and the ordered continuation checklist are maintained
in the MCP repository: `plugins/PUBLICATION_HANDOFF.md`. It records the canonical
manifests, five positive/three negative review cases per variant, ZIP verification,
and remaining publisher/policy/deployment/host-QA steps. A valid development ZIP
does not mean that publication is ready or that live OAuth/Events QA passed.

The user requested MSC-by-MSC branch consolidation and master integration before
tomorrow's QA. Preserve both original branch tips and master-only documentation;
first form the consolidated feature history, then make master identical and
archive/remove the completed remote feature branches. Other sessions' QA changes
must be retained. See `MSC-119_BRANCH_CONSOLIDATION.md` for the final archive map.

Full QA explicitly includes new QA items recorded by the other Codex session.
Before execution, reconcile the latest shared QA ledger and versioned checklists
across sessions, retaining their evidence and reopened/pending status. This
conversation and the MSC-119 checklist alone are not the complete QA inventory.

The user explicitly removed free-hosting/subscription-cancellation research and
reconstruction of the earlier Docker rebuild from further follow-up. Their
historical findings below remain evidence, not open tasks or blockers.
This scope decision does not start a manual-QA checkpoint or delegate browser
execution; the repository's existing QA authorization and launcher rules apply.

## Accepted contract

- Four cumulative packs: Blocked, Write, Read, Full. Read adds broad permitted
  queries to Write; Full adds OAuth MCP Events. API keys never receive MCP Events.
- Main MCP access defaults to Blocked when no preference was saved. Existing
  explicitly stored packs retain their meaning. Client generation and OAuth
  consent remain the existing flows, without an extra approval step.
- Main and per-client packs cap each other. Saving remains the existing single
  settings request; the nested permission tick only stages the parent draft.
- Privileged base profiles expose role statistics only. Administrator overview
  reuses AdminClientService; operator reports reuse the paged QMAU/revenue readers.
  No moderation, deployment, payment, configuration or human-decision writes.
- `admin.attention` and `operator.attention` reuse MSC-118 role notifications and
  the existing durable webhook queue, signatures, throttling and delivery checks.
  Filter `resourceId: node`; payload contains a bounded kind, not member details.
  Current role is checked before discovery, subscription and delivery.
- Explain all packs and Events in both the popup's own help and contextual guide,
  as well as shared help and canonical local/Mongo seeds (EN/HU).
- Do not claim that all AI clients support Events or that every client requires
  a paid plan. Host support is a separate condition, not a MyScoutee paywall.

## Queued user follow-ups, in order

1. Finish the MCP implementation/documentation above.
2. Inspect **Docker image builds at dev-stack startup**, not Angular/Java
   hot-reload. Identify rebuild triggers, forced builds, cache use and fix an
   evidenced defect in the existing launcher/build owner.
3. Fix the missing-guide message layout: “Magyarázatok” belongs in the header
   row beside the X. Audit guide registrations and anchored steps on surfaces
   added/changed from MSC-114 through MSC-119; fix the reported Community service
   home missing-guide case and actual coverage gaps using existing guide owners.
4. Update QA coverage, review diffs, commit with the project task ID and push.

## Verification boundary

Existing backend/frontend dev watchers own compilation. No parallel build or
test runner. User deferred functional/browser/load tests; this task prepares QA
coverage without treating compilation or source checks as a QA pass. Browser
actions are not authorized. Canonical generators may run, but no ad hoc runtime
seed/IndexedDB manipulation or application bootstrap hooks.

## Official sources consulted

- https://developers.openai.com/plugins/build/mcp-events — ChatGPT Work web,
  desktop Cloud, MCP 2.0 webhook Events; no universal paid-plan claim.
- https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp
  — custom remote connectors include Free (one connector); this does not prove
  support for the draft MCP Events extension.

## Evidence

Implementation and documentation complete. Build and source/contract evidence
are recorded below. These checks do not substitute for execution QA.
Functional, browser, security and load QA: **NOT RUN**.

## Implementation and source verification — 2026-10-07

- Implemented four cumulative packs, main-MCP default Blocked, unchanged client
  generation, shared draft save, bounded role statistics and role Events through
  the existing outbox/webhook queue. Java client and MCP contract are 1.6.0.
- Existing backend watcher: BUILD SUCCESSFUL; Main restarted 05:10:44 CEST.
  Existing frontend watcher: AOT bundle generation completed 05:12:41 CEST.
  No second backend/frontend compiler or test process was started.
- Standalone Java client `installDist` succeeded. Its SDK has no running watcher.
  MCP image build succeeded; `mcp-dev` restarted sequentially and is healthy.
  MCP dependency layers were cached; the changed Go source compiled.
- Contract generator check: 40 MCP operations match the SDK OpenAPI source.
- Guide source consistency: 118 contexts / 1458 conditional fields, EN/HU text,
  canonical local group revisions and all three Mongo seed sets. The existing
  seed watcher imported updated definitions without errors. See
  `guides/qa/evidence/general/MSC-119_GUIDE_WIRING_20261007.md` for concrete repairs.
- API manual PDF regenerated with the existing renderer. API/Events/guide QA
  checklists and CSV/XLSX ledger updated; extensions remain NOT RUN.

## Docker startup build investigation

Several existing dev services use `pull_policy: build` (including nginx,
profilemanagement, frontend-sync, mongodb-sync, Minio, registry and the payment
simulator). Those declarations predate this task (git blame includes June 2026).
They ask Compose to build at startup; they do not disable layer caching.
No forced `--no-cache` startup path was found. Explicit release packaging options
are separate. Tooling-only frontend/backend development images mount application
sources; registry/payment/MCP code and Minio image-seed changes can legitimately
invalidate copied layers. The required MCP build showed cached dependency layers
and recompiled changed source. No full-stack rebuild was used for this audit.
The user's earlier unexplained run cannot be proven without that run's log.
Existing startup policy was retained.

Sources: https://docs.docker.com/reference/compose-file/services/#pull_policy
and https://docs.docker.com/build/cache/invalidation/

## Additional user-requested deliverable

After the implementation/guide wiring, prepare a separate full MCP User Guide
PDF alongside the API Guide. Reuse the official manual cover/M logo and renderer;
include client generation and permission tables, ChatGPT/Claude setup, supported
operations, Events, scheduled-task locations, limitations and troubleshooting.
Provider-specific instructions must cite current official documentation.

## MCP User Guide — completed

- Added `guides/manuals/myscoutee-mcp-user-guide-en.html` and the versioned
  `MyScoutee_MCP_User_Guide_v1.0.0_EN.pdf` (MSC-MCP-001), built by the existing
  manual renderer and copied identically into the public frontend manual folder.
- Reuses the official M logo, cover, document-control table, linked contents,
  shared typography, PDF header/footer and page numbering. Client generation,
  four cumulative packs and main/client cap examples have dedicated tables.
- Includes ChatGPT/Claude setup from official sources checked 2026-10-07,
  identity/consent, capabilities, role statistics, Events, host schedules versus
  community recurring tasks, prompts, revocation, troubleshooting and local
  stdio configuration. Host subscription/plan availability is not inferred from
  MyScoutee Full access. English matches the existing official manual collection.
- PDF HTML metadata and anchors validated by the existing renderer; tagged A4
  output and text/page structure checked, cover and permission/client tables
  visually inspected. Backend/frontend published bytes match.
- Added download links beside the API Guide in both root READMEs and the manual
  catalog. Updated the API Guide's source-extension history and companion link.
- Final contract audit also corrected four old Full-only operation descriptions
  to the actual Read/Write pack requirements; regenerated the canonical MCP
  contract. Final MCP image rebuilt with cached dependency layers and deployed
  by stopping/restarting only mcp-dev; no additional backend/frontend compiler.

Documentation setup walkthroughs, live OAuth/Events and scheduled-host execution
remain part of deferred QA, not a claimed pass.

## Final artifact and revision evidence

- MCP manual: 20 tagged A4 pages; SHA-256
  `8efc7882aca1fb33610465638e3f38e7592efdeec1e4f263323c54295803f6a8`.
- Final frontend watcher compilation completed 05:34:18 CEST after the final
  four-pack guide-label correction; i18n revision `2026.10.07.15`. Existing Mongo
  seed watcher imported the updated bundles/messages without failed documents.
- Final MCP runtime image: `6702602f54e5fcf3d0721813382c802af9e1dcf2d367ae731e1fd94afa74a6a5`.
- Frontend: `e7e800bb3` (guide wiring, four-pack UI, published PDF).
- Java client: `094caa8` (v1.6.0 contract and bounded role reads).
- MCP: `ece2007` (v1.6.0 generated contract, capabilities and host instructions).
- `git diff --check`, canonical seed synchronization and 40-operation contract
  comparison passed. Functional execution remains NOT RUN as requested.

## Documentation publication correction — 2026-10-07

The user clarified that “beside the API Guide” means a dedicated new table row
in every affected repository, and that each touched README must have its other
content refreshed too. The earlier feature-branch push did not update the
GitHub default-branch README or satisfy its master-based raw PDF links.

- Published the MCP PDF, matching API companion and maintainable manual sources
  to backend master (`80edd49a4`), and the public PDFs to frontend master
  (`ce041f705`), using isolated documentation-only worktrees. Application code,
  the committed Pages bundle and the default backend submodule pointer were not
  advanced to the feature branch.
- Dedicated MCP User Guide rows now exist in frontend/backend manuals tables,
  the backend manual catalog, Registry manuals and admin-client downloads.
- All four root READMEs were reviewed. Corrected the admin installer/API PDF to
  its verified v1.3.0 release assets; backend/frontend distinguish the v1.3.0
  complete installer, v1.3.3 tagged application source, committed Pages v1.3.2,
  and current MCP/client v1.6.0 development work. Manual document versions stay
  independent. Registry release scope is explicit.
- Replaced the unexplained frontend ~500,000-line claim with a dated tracked-file
  measurement: UI TS/HTML/SCSS 363,570; profile Java 157,658; graph JS 4,876;
  core total 526,104 physical lines including comments/blank lines and UI tests.
  Seed JSON (69,872 lines), dependencies, bundles and manuals are excluded.
- Current development ledger: 146 scenarios excluding four legend rows;
  120 recorded PASS statuses, 25 NOT RUN, one reopened guide case. This is a
  snapshot of recorded scope, not a new QA pass.
- Verified dedicated table rows, local document targets, identical canonical
  PDF bytes and actual remote release asset names. No application build/test,
  fixture or browser action was required for this documentation correction.
