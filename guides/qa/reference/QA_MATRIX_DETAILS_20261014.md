# QA matrix detail archive — 2026-10-14

Verbatim detail moved out of the matrix to keep its rows short. This is a dated
snapshot, not the current status ledger. Current results remain in the
[CSV matrix](../matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv). Stable actions
remain in the linked checklists; new execution evidence belongs in the QA pack
and evidence files. Find a section by its QA ID.

## LEGEND-X

### ID

LEGEND-X

### Type

Legend

### QA domain

Legend

### Area

All

### Scenario

No expected effect

### Statistics

X

### Monitoring / Metrics

X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

X

### Manual status

N/A

### Next manual oracle

An unchanged X cell is PASS

### Evidence / notes

X means no direct effect is expected

### Manual QA priority

N/A

## LEGEND-DELTA

### ID

LEGEND-DELTA

### Type

Legend

### QA domain

Legend

### Area

All

### Scenario

Required direct effect

### Statistics

DELTA

### Monitoring / Metrics

DELTA

### Affinity Graph

DELTA

### Admin Jobs

DELTA

### Domain / other UI

DELTA

### Manual status

N/A

### Next manual oracle

Record before/after count and direction

### Evidence / notes

DELTA means a required direct observable

### Manual QA priority

N/A

## LEGEND-INDIRECT

### ID

LEGEND-INDIRECT

### Type

Legend

### QA domain

Legend

### Area

All

### Scenario

Conditional effect

### Statistics

INDIRECT

### Monitoring / Metrics

INDIRECT

### Affinity Graph

INDIRECT

### Admin Jobs

INDIRECT

### Domain / other UI

INDIRECT

### Manual status

N/A

### Next manual oracle

State the condition and prove it occurred

### Evidence / notes

INDIRECT means conditional or downstream

### Manual QA priority

N/A

## LEGEND-GAP

### ID

LEGEND-GAP

### Type

Legend

### QA domain

Legend

### Area

All

### Scenario

Known observability gap

### Statistics

GAP

### Monitoring / Metrics

GAP

### Affinity Graph

GAP

### Admin Jobs

GAP

### Domain / other UI

GAP

### Manual status

N/A

### Next manual oracle

Record FAIL/GAP separately from domain PASS

### Evidence / notes

Do not turn a missing intended metric into X

### Manual QA priority

N/A

## INTEGRATION-API-001

### ID

INTEGRATION-API-001

### Type

Release integration

### QA domain

API test

### Area

Integration API

### Scenario

Generate a fresh Profile API key; connect the Java client through nginx; register watch; POST one image-bearing Asset and Event; verify owner/public UI; Join and approve from the second user; verify callback; unwatch and revoke

### Statistics

X

### Monitoring / Metrics

DELTA durable webhook subscription/delivery and terminal callback

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Caller and MyScoutee UUIDs map exactly; Casey owns and sees both resources with images; Nova sees the public Event image; approved Join emits the minimal participant callback; revoked key returns 401

### Manual status

BASE + EXTENSION PASS / CLOSED

### Dev

PASS

### Last manual date

2026-09-22

### Automated coverage

Java client tests cover request validation, missing/invalid/revoked tokens and required/UUID format errors; webhook and media regression sources added; live assembled-stack flow through nginx passed; extension browser claim/runtime, event read/encounters, delivered callback parity, ownership rejection and cleanup PASS; six focused real-HTTP webhook service tests PASS (mocked repositories).

### Next manual oracle

Closed. Release work is separate; new Event activity-rating QA is queued only.

### Result

PASS

### Evidence / notes

Fresh key generated from UI without a token fixture. Asset id 1f2f24d2-d14c-43ce-a27f-67270ae93d4a -> externalId 1dd7cf24-aca0-4f54-8ab3-6af7872e19a3; Event id a3b891c2-1a45-4fe8-b8c2-c217c22466b4 -> externalId a06e0ab2-8703-4480-bbc0-5379fde23d1e. Casey owner views and Nova public image PASS. Nova Join plus Casey approval produced accepted participant callback with name/age/gender/profileImage only and final 2/0 counts. Watch disabled, QA key revoked, subsequent connect HTTP 401. Evidence: guides/qa/evidence/INTEGRATION-API-001-2026-09-20.json. New extension: guides/qa/checklists/api/INTEGRATION-API-001.md. Earlier PASS covers the original scope only. 2026-09-22 extension: external event read/sourceLink, claim replay, completed encounters and event.encounters webhook page/revision parity, incomplete-session 409 and foreign-owner 404 passed. Final cleanup complete: watch disabled, key revoked/401, disposable events trashed and receiver stopped. See guides/qa/evidence/INTEGRATION-API-001-2026-09-22.json. User-requested total attempts reduced to three; stalled response body reproduced and fixed with a cancellable 10-second full HTTP response deadline. API HTML/PDF regenerated. Follow-up: late claim ends invitation eligibility at event end/completed Speed meeting; 8 service tests PASS, HTML/PDF updated. Fresh-registration/late-claim browser flow not proven; see INTEGRATION-API-001-late-claim-2026-09-22.json.

### Manual QA priority

P0 100

## AFFILIATE-INVITATION-001

### ID

AFFILIATE-INVITATION-001

### Type

Release integration

### QA domain

API test

### Area

Affiliate invitations

### Scenario

New personal-link registration; API import of two participants; claim one; repeat/reload; revoke without counter deletion

### Statistics

X

### Monitoring / Metrics

X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Personal badge 0→1; API badge 0/0→0/2→1/2; replay/reload/revoke preserve counts

### Manual status

AUTOMATED CDP PASS / CLOSED

### Dev

PASS

### Local

NOT RUN

### Last manual date

2026-09-22

### Automated coverage

Actual UI onboarding and key generation/revocation; real API imports; browser claim; persisted attribution/mapping and badges asserted.

### Next manual oracle

None in this dev-demo scope. External Firebase IdP redirect is not covered.

### Result

PASS

### Evidence / notes

Independent new case; historical PASS rows unchanged. guides/qa/checklists/api/AFFILIATE-INVITATION-001.md; guides/qa/evidence/AFFILIATE-INVITATION-001-2026-09-22.json. Cleanup completed.

### Manual QA priority

P0 100

## ADMIN-CLIENT-API-001

### ID

ADMIN-CLIENT-API-001

### Type

Delegated full-flow journey

### QA domain

API test

### Area

Private admin API and Linux monitor

### Scenario

Create scoped admin API key and connect v1.0.2 Linux client; verify aggregate metrics, configurable polling, notification-center delivery, background reopen, disconnect, revocation and package startup.

### Statistics

X

### Monitoring / Metrics

DELTA aggregate profile/registration/attention snapshots, bounded polling and deduplicated desktop notifications

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

DELTA admin-only API popup without affiliate controls; client URL/key/connect/disconnect and Ubuntu notification behavior

### Manual status

PASS

### Dev

PASS

### Local

NOT RUN

### Last manual date

2026-09-23

### Automated coverage

Existing Java/Angular watcher builds PASS; 14 Python client tests PASS; versioned runtime API, owner guards, cadence, transport-fault and support-notification oracles PASS.

### Next manual oracle

Closed in dev scope and reset. OS notification-center visual icon, desktop login/reboot and separate REAL/DEMO databases NOT RUN.

### Result

PASS

### Evidence / notes

guides/qa/checklists/api/ADMIN-CLIENT-API-001.md; guides/implementation/20260922-admin-client-api.md. Private v1.0.2 release publication is separate. Startup is disconnected after process restart because the key is RAM-only. Planning only: priority I/L/A/N/O=5/4/3/4/4; effort actions/extra actors/oracles/boundaries/restore/external=25/1/3/5/1/1, per QA models. Estimates are manual wall-clock planning, not required scheduler waits. Runtime evidence: guides/qa/evidence/ADMIN-CLIENT-API-001-20260923-progress.md. Full API/UI key lifecycle, 5/20-second cadence, real feedback/support alerts, background reopen, timeout/recovery/disconnect, revocation and RAM-only key restart PASS. D-Bus Notify observed; existing DND preserved. Installer app-menu side correction accepted by user; fresh fixture reset. Explicit platform boundaries remain NOT RUN.

### Manual QA priority

P0 80

## AFFILIATE-REVENUE-001

### ID

AFFILIATE-REVENUE-001

### Type

Delegated full-flow journey

### QA domain

API test

### Area

Affiliate turnover, FX summaries and refunds

### Scenario

Refer a disposable user, capture EUR/HUF purchases and event checkouts, complete refunds, replay callbacks and recover interrupted counter writes; inspect normal-user Revenue popup and compact mobile controls.

### Statistics

X

### Monitoring / Metrics

DELTA write-side partner totals and versioned contribution ledger; idempotent capture/refund recovery

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

DELTA selected-currency summary from payment-day snapshots, persistent shared picker, purchase/event counts; original payment currencies retained

### Manual status

PASS

### Dev

PASS

### Local

PASS

### Last manual date

2026-09-24

### Automated coverage

Existing backend/frontend watcher builds PASS. Focused local lifecycle, seed, ledger, history and client-checkout regressions PASS as recorded. Compiled production authorization/capture accounting + real Mongo probe PASS. Actual UI/provider/Mongo and IndexedDB financial flows PASS; latest standalone Java/Go suites and installed production artifact NOT RUN.

### Next manual oracle

Closed in recorded dev HTTP/simulator and frontend-local scope. Calendar explicitly deferred by user; do not execute. Retain financial fixture evidence.

### Result

PASS

### Evidence / notes

guides/qa/checklists/api/AFFILIATE-REVENUE-001.md; guides/implementation/20260922-gallery-feed-moderation-email.md. No configured commission; daily persisted FX snapshots and shared summary currency added; key revocation preserves attribution/revenue. Earlier invitation PASS unchanged. Planning only: priority I/L/A/N/O=5/4/3/5/5; effort actions/extra actors/oracles/boundaries/restore/external=25/1/4/4/1/1, per QA models. Estimates are manual wall-clock planning, not required scheduler waits. 2026-09-23 extension: independent payment-grace ON/OFF and hours in Pricing, both approval modes, unpaid expiry/fresh Join and paid control; see guides/qa/evidence/AFFILIATE-REVENUE-001-20260923-progress.md. UI persistence, real scheduled unpaid expiry in both modes, fresh manual approval/auto Join, OFF offset control and correct pending/payment card labels verified; zero grace-case payments, paid EUR control unchanged. See 21:49 evidence. Full checkpoint remains IN PROGRESS. 22:18 continuation: partner purchases3/bookings3; EUR110/25/85 and HUF5000. Profile save/key revoke unchanged; mobile EN/HU payment header and revenue overflow verified. See dated evidence for callback defect and pending asset retest. 22:30: asset purchase-only count and supported EUR2 full refund PASS. Totals purchases5/bookings4; EUR132/27/105; HUF5000. Public DTO/cross-user summary privacy PASS. Four injected-fault tests NOT RUN/BLOCKED, validators unchanged. See latest evidence and handoff. 2026-09-24: local FX job and mixed-currency picker verified; corrected concurrent capture PASS, purchases10/bookings9, nativeEUR167/27/140 plusHUF5000, selectedCZK4487.50/675/3812.50 after reload. Fixture String/ObjectId attribution defect repaired without changing paid outcomes. See 00:24 evidence. 2026-09-24 01:02: concurrent full refunds PASS, totals10/9 EUR167/41/126 + HUF5000; FX dev/production Explore unified onto packaged payment-simulator. Source save/reload + failure/cache preservation/recovery PASS; migration preservation/idempotence PASS. Frontend-local fixed rates compiled, browser NOT RUN. Production artifact qualification NOT RUN. See dated evidence. 01:16: callback replay and compiled real-Mongo stale-version/four isolated recovery probes PASS. Valid configured admin credential located; full-flow collMod intent case PASS, paymentv3 retained/pending cleared, totals11/10 EUR169/41/128+HUF5000. Ledger/commit/ack in progress; no Calendar test performed. 01:22: ledger/commit/ack full-flow recovery PASS, no active fault; see dated evidence. User confirms25% policy retains75%, but organizer event cancellation must return full amount; separate branch not yet passed. 01:37: final CZK totals14/13 4837.50/1025/3812.50 visually verified; four callback replays200 with unchanged sums, revision86/paymentv6 pendingfalse. HU confirmation verified without payment; second buyer event...006 unpaid draft retained. Local mapper focused execution PASS; browser-local not run. See evidence for cancellation scope question and unsupported hold-only capability.; 2026-09-24 01:56 default FX: identical dev/e2e/prod seeds, production install/upgrade allow-list, immutable insert-only importer, parity and compiled Java+Mongo default/daily/outage/refund/CZK summary PASS. No production artifact installation claim.; 2026-09-24 02:04 partial-to-full foundation PASS with compiled PaymentService/Mongo and provider double: separate25/75 refund records, cumulative primary100, first audit immutable; normal/lost-response/concurrent-late-receipt/legacy/cash and replay. Organizer/participant cancellation full-flow still pending. | 2026-09-24 02:44: actual provider/UI Cancel100 with prior25 => new75 and unchanged old audit; admin Remove HUF5000 => full5000; programme edit => notified two payers, no automatic refund, modifier excluded; individual Cancel => own7 only. See evidence/AFFILIATE-REVENUE-001-20260923-progress.md. Whole checkpoint remains IN PROGRESS. 03:12 revised participant request/approval browser+provider3 PASS, pending1->0 and replay200; local partial25/pending75 approval unit PASS4/4. Organizer UI republication clears cancelled+old membership while preserving25/75 audit. Found old paid basket Continue issue; repair/retest active. Missing dated FX summary uses default, probe PASS; header explanation removed. See dated evidence. 03:23: header desktop/360px no scrollbar or movement with hover/press feedback PASS; republish old basket retirement/fresh Join/new unpaid reservation and repeated Publish preservation PASS. See dated evidence. 03:34 partial25 -> pending75 -> organizer approval actual UI/provider PASS, first25 audit immutable, replay no duplicate. Final Cancel12/Delete13 provider oracle all four payments exactly one7 refund PASS. See dated evidence. 03:41: member-list replacement linked asset20 full refund PASS; two-payment organizer batch with real provider404/repeated retries/recovery PASS, each10 refunded once, fault restored. No process-kill claim. See dated evidence. 04:03: local finance7/7 and clean local-browser HUF/EUR conversion, both badges, affiliate monetary zero/currency sharing and reload PASS. Missing20 guide SVG assets repaired, actual profile guide four images loaded. Dev restored through existing watcher. Final owner UI/Mongo16/15 CZK7587.50/7312.50/275, revision136, no pending/fault. See dated evidence. 04:24 correction: Local remains IN PROGRESS; previous PASS covered currency/guide assets and repository cases only, not the requested full local financial UI flow. Review Booking CPU freeze reproduced with explanations off; diagnosis active. 05:06: Review Booking freeze fixed (stable gallery model, idle58ms/5s); actual local capture100 and pending25 PASS, approval FAIL on stale service-worker version retained. CacheStorage cleared only, fresh unpaid replay prepared. Fixed missing active-checkout ledger and policy-refund path, focused8/8 PASS; saved membership seed overwrite repaired, focused3/3 PASS. Full local still IN PROGRESS. 2026-09-24 05:50 local: actual25+75 separate refunds PASS, history DOM preserved/no loader, HUF5000 capture PASS. Main Event visible; viewer entitlement fixed. Local canonical deadline/purge focused4 PASS; runtime scheduled expiry next. Review Booking uses existing service context without duplicate basket request; actual1551.4ms with1500ms delay. Java invitation-context contract unchanged. See dated evidence. 06:00: local Cancel10/Delete7 full refunds and HUF5000 admin removal PASS; manual12 approval waits for payment, no repeated Approve. Calendar explicitly deferred. Scheduler configuration bootstrap gap repaired; runtime expiry next. 2026-09-24 06:30 closure: actual local scheduled manual/auto expiry, fresh reapproval, OFF/paid controls, changed-terms pending/admin-approved untouched100 and25+75, Cancel/Delete/reactivation/admin HUF removal PASS. Final local asset20 adds purchase only:7/6,EUR337/317/20,HUF5000/5000/0; actual Revenue349.50/329.50/20EUR. Final dev refund/history/callback PASS,16/15,EUR291/282/9,HUF5000/5000/0,revision138,no pending/faults. Authorization-only zero verified at compiled service+Mongo boundary; no provider hold-only UI or installed production qualification claimed. Calendar deferred. See dated evidence for retained failed-version artifacts and exact boundaries.

### Manual QA priority

P0 86

## INTEGRATION-API-GROUP-001

### ID

INTEGRATION-API-GROUP-001

### Type

Group regression journey

### QA domain

API test

### Area

Group participant invitation links

### Scenario

Shared Event invitation API flow: ordered stable URLs, new registration and existing-account claim, accepted group membership, active workspace, replay/conflict/failure handling and unchanged Event acceptance/payment.

### Statistics

INDIRECT only existing producers; compare before/after

### Monitoring / Metrics

DELTA authorized writes and denied cross-scope requests; no secrets

### Affinity Graph

INDIRECT workspace-owned rating/following mutations only

### Admin Jobs

INDIRECT configured moderation worker only; no invented scheduling rule

### Domain / other UI

DELTA one external-ID binding, accepted community membership and workspace profile; target group active after registration; foreign/replayed identity does not gain access.

### Manual status

CLOSED / PASS — recorded dev scope

### Dev

PASS — 7/7 ordered blocks; HTTP/simulator

### Local

PASS — keys, profile isolation and EN/HU help; external OAuth N/A

### Last manual date

2026-09-28

### Automated coverage

15 focused backend tests PASS (2026-09-24): filter defaults/preservation and shared invitation claim plus community admission/replay. Does not prove this full UI/HTTP journey. Profile selection correction: 21 focused Java tests PASS (2026-09-25); profile-load parameter, read-only restore, accepted-membership authority, failed-load non-commit, invite activation and removal. Added frontend HTTP parameter/retry unit cases; not executed separately from the running build watcher. | 2026-09-28: ordered delegated UI/HTTP campaign7/7 PASS; focused payment backend7/7 and frontend14/14 PASS; six package structural checks PASS; existing build owners verified.

### Next manual oracle

Closed. Actual ChatGPT/Claude/Codex installation and conversation acceptance is standalone post-deployment smoke, outside this QA case.

### Result

PASS

### Evidence / notes

guides/qa/checklists/api/INTEGRATION-API-GROUP-001.md; Added 2026-09-24. No campaign fixture or browser actions executed. Priority I/L/A/N/O=5/4/4/4/4; effort actions/extra actors/oracles/boundaries/restore/external=26/2/4/3/1/1. Profile loading owns activeWorkspaceGroupId persistence; no per-request group header. Checklist includes shared loading state, timeout retaining prior selection, same-target retry and stale responses. Manual results remain NOT RUN. | 2026-09-25: sharing batch and discovered eventless-support regression checklist expanded; execution remains NOT RUN, no manual result claimed. | NOT RUN blocks 2-3: fresh registration versus existing pre-registered demo recipient; real entry UI, cancelled/retried Setup retains invitation, first active-group load and reload/login. No session injection to skip entry gates. | User clarification 2026-09-27: testcases are independent closed execution units. Transferred checks are CLOSED BY SCOPE TRANSFER in the source, not pending dependencies. DEPLOY-EXTERNAL-CONFIG-001 requires its own fixture, restaging, entry checkpoints, execution and cleanup; prior/cross-case evidence cannot substitute. Transfer provenance stays in the ledger, not executable cross-case references. Audit the remaining NOT RUN cases only at the current testcase boundary, before advancing to another testcase. | User clarification2026-09-27: URL-first MCP connection is API-domain development, NOT IMPLEMENTED. Added to section7: implement first, then execute the independent API checkpoint. Existing manual client registration/consent is partial implementation; ordinary user flow must not require client-secret copying. Tall revoke-card layout included. | Local/dev full-flow requirement: implement a versioned real MCP/OAuth test client and callback receiver so URL discovery -> browser sign-in/consent -> token exchange -> private tool call completes against the running application without fabricated grants/responses or a production dependency. | MCP client development target refined: optional browser URL/Connect client in myscoutee-mcp; reuse Inspector/OAuth, real login/callback/private tool result. Full Help Center and API popup question-mark help have separate HU/EN seeds. Feature remains NOT IMPLEMENTED; no runtime UI support claimed. | 2026-09-27 clarification: local MCP OAuth simulation remains in final API NOT RUN block7; no live deployment config prerequisite. Actual browser-based ChatGPT is a separate user-operated manual deployment test. | 2026-09-28 prerequisite development: official Inspector2.8.0 launcher implemented; public DCR/PKCE/dev demo realm and split manual Advanced/OAuth permission UI. Development evidence: 25 focused Java tests and12 real HTTP checks PASS; not a full browser callback/private business-read proof or full API QA PASS. Own block7 fixture/browser staged. Actual ChatGPT conversation moved to standalone post-deployment smoke outside QA. | 2026-09-28 ordered campaign requested: Advanced credentials/OAuth microsteps added to block7. Development Java27/27; generated credentials actual UI/OAuth/MCP/revoke11/11. Development fixture reset exactly. New integration-api-group baseline ready with four actors/two groups; managed startup complete, no ordered checklist actions yet. Evidence guides/qa/evidence/INTEGRATION-API-GROUP-001-20260928.md. | 2026-09-28 CLOSED: ordered blocks1–7 PASS in dev HTTP/simulator plus local key/help scope. Actual entry/admission, paid invitation EUR5, cash EUR7 exclusion, Inspector OAuth callback/private Event, generated manual credentials, denial/profile isolation, failed-write retry and EN/HU help verified. Scoped fixture/session/media reset exact; saved provider card deleted and optional Inspector/managed browsers closed. Full details and limits: guides/qa/evidence/INTEGRATION-API-GROUP-001-20260928.md; ordered JSON alongside. No live vendor installation claimed.

### Manual QA priority

P0 85

## MSC115-CAMPAIGN-API

### ID

MSC115-CAMPAIGN-API

### Type

Flow

### QA domain

API test

### Area

Campaign create through existing API/MCP architecture

### Scenario

MSC-115 steps 37–39: Existing Campaign draft-create capability, actor/group ownership and unchanged Event/Group create contracts. Broader access packs and Events belong to MSC-116/119. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

NOT RUN

### Last manual date

2026-10-15

### Automated coverage

Campaign store 12/12 and realtime counter sync 7/7 PASS. Supplemental local Campaign service 7/9; two unresolved profile/seed counter assertions. Full command: 26 PASS, 2 FAIL.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 user-requested synchronization: current steps 37–39; old scenario wording replaced by the active checklist. No new test or PASS claimed. | 2026-10-13 step37 HTTP: UI-generated Work write key; API creates draft and retries return existing ID. Corrected CampaignsStore own-status list counter reconciliation with existing revision guard. Desktop EN/mobile HU and reload show draft2, published1, sidebar3; two disposable drafts retained for38–39. Focused19/19 PASS; supplemental local7/9, full26/28. Evidence: guides/qa/evidence/work-community/MSC115-step37-campaign-api-20261013.json. No local-browser/KVM or whole-block PASS claimed. | 2026-10-13 steps38–39 HTTP: wrong owner Campaign edit/publish404, wrong workspace create/update403; unchanged drafts. Event draft created/retried with one stable ID; existing Group participant-link create/retry stable and unclaimed, non-admin denied403. Exact scope and retained IDs: guides/qa/evidence/work-community/MSC115-step38-39-campaign-api-20261013.json. No standalone group-create API claim. Step40 prepared only; continuation stopped by user.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## INTEGRATION-ACCESS-001

### ID

INTEGRATION-ACCESS-001

### Type

Feature extension

### QA domain

API test

### Area

API/MCP access packs

### Scenario

MSC-116/119: contextual Blocked/Write/Read/Full access packs; atomic parent save; HTTP/local parity; OAuth/discovery downgrade; role access and personal-decision exclusion. Follow INTEGRATION-ACCESS-001.

### Statistics

X

### Monitoring / Metrics

Existing operation and error evidence only

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

See stable checklist

### Manual status

NOT RUN — MSC-119 four-pack and role extension

### Dev

NOT RUN

### Local

NOT RUN

### Automated coverage

Focused regression source prepared; execution deferred by user. 2026-10-07 Help-only watcher-AOT check PASS: enabled parent/child contexts, EN/HU in Dating/Work/Community, bounded loads and cleanup; scoped/local/Mongo seed parity PASS. Permission enforcement remains untested here.

### Next manual oracle

Run INTEGRATION-ACCESS-001 with backend/frontend/client/MCP 1.6.0: Blocked/Write/Read/Full, default blocked main MCP, unchanged generation, API/MCP per-client caps, atomic draft save, role statistics and revoked-role denial. | Template baseline is closed; assess newly found defects, carry over affected fixes and run only their targeted template regression.

### Result

NOT RUN

### Evidence / notes

MSC-116. Watcher compilation and schema generation are not behavioral QA. Existing guide/API PASS does not cover this extension. | 2026-10-07: fixed missing profile.integration-access enabled-surface registration and Work/Community child guide content; existing parent shield and level/Apply/Close steps reused. guides/qa/evidence/general/EXPLANATION-GUIDE-001-20261007.md. Section 4 now names the manual Help checks. Manual status unchanged. MSC-119 extension 2026-10-07: guides/plans/MSC-119_MCP_READ_EVENTS_ROLE_GUIDANCE.md and guides/qa/evidence/general/MSC-119_GUIDE_WIRING_20261007.md. Source/build evidence only; no functional/browser/security/load PASS claimed. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement.

### Manual QA priority

P0 100

### Remaining QA complexity (min/max)

90/180

## MCP-EVENTS-001

### ID

MCP-EVENTS-001

### Type

Feature extension

### QA domain

API test

### Area

MCP Events and OAuth users

### Scenario

MSC-116/119: Full-only signed subscriptions, user grants and role/node filters; revocation/downgrade, bounded delivery, retries and idempotence. Follow MCP-EVENTS-001.

### Statistics

X

### Monitoring / Metrics

Queue status; sanitized protocol error categories

### Affinity Graph

X

### Admin Jobs

Existing integration-webhooks worker

### Domain / other UI

EN/HU MCP guide; host subscription flow

### Manual status

NOT RUN — MSC-119 role Events extension

### Dev

NOT RUN

### Local

N/A — external callbacks require backend

### Automated coverage

Java/Go regression source prepared; execution deferred by user.

### Next manual oracle

Run MCP-EVENTS-001 with MCP 1.6.0: Full-only Events, Read downgrade, ordinary owned-resource Events, role catalogs and node filters, role/grant revocation during delivery, queue limits/retries/idempotency and multiple users. | Template baseline is closed; assess newly found defects, carry over affected fixes and run only their targeted template regression.

### Result

NOT RUN

### Evidence / notes

Source/build evidence only; no live ChatGPT callback or load test yet. MSC-119 extension 2026-10-07: guides/plans/MSC-119_MCP_READ_EVENTS_ROLE_GUIDANCE.md and guides/qa/evidence/general/MSC-119_GUIDE_WIRING_20261007.md. Source/build evidence only; no functional/browser/security/load PASS claimed. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement.

### Manual QA priority

P0 100

### Remaining QA complexity (min/max)

90/180

## CLEANUP

### ID

CLEANUP

### Type

Safety

### QA domain

QA infrastructure

### Area

Environment

### Scenario

Reset fixture and revert parameters

### Statistics

No fixture-induced future delta

### Monitoring / Metrics

No fixture queue left pending/failed

### Affinity Graph

Baseline graph restored where data was reverted

### Admin Jobs

No fixture rule running; original rule config restored

### Domain / other UI

No prepared fixture; original parameter versions active by value

### Manual status

PASS / CLOSED

### Last manual date

2026-08-30

### Automated coverage

Versioned admin-job and manual-QA read-only status guards; deployment schema-v4 safety marker

### Next manual oracle

Closed; repeat the read-only gate at the start of a new session or after an interrupted fixture

### Result

PASS

### Evidence / notes

Both snapshot collections were empty. event-random-groups reported prepared=false, pending=0 and no fixture event, generated room, chat, message, outbox or bell artifact. stat-012 reported phase=not-staged, prepared=false and pending=0. Two legacy schema-v3 marker guards were aligned with the current deployment schema v4 before the successful status replay; no fixture/reset mutation was performed.

### Manual QA priority

P0 100

## QA-RESET-001

### ID

QA-RESET-001

### Type

Harness defect retest

### QA domain

QA infrastructure

### Area

Manual QA isolation

### Scenario

Reset a scheduler scenario after it creates an invitation and notification

### Statistics

X

### Monitoring / Metrics

X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Reloaded invitee shows the exact pre-stage Invitations and Notifications badge values and no fixture-owned rows

### Manual status

PASS / CLOSED

### Last manual date

2026-08-30

### Automated coverage

STAT-012 helper snapshots/restores both selected users' activity projections; schema-v4 deployment guard; managed Nova browser plus independent terminal Mongo oracle

### Next manual oracle

Closed; replay only after reset projection ownership or the STAT-012 helper changes

### Result

PASS

### Evidence / notes

After one explicit Nova reload, the user confirmed Invitations and Notifications both had no red badge and empty lists. The independent terminal oracle returned stat-012 phase=not-staged, prepared=false, pending=0, snapshot count 0; Nova activities.invitations, activities.event.all, activities.event.invitations and activities.notifications were all 0, with zero pending event memberships and zero live notifications.

### Manual QA priority

P0 88

## ENTRY-DEMO-REG-001

### ID

ENTRY-DEMO-REG-001

### Type

Expansion checkpoint CP03

### QA domain

Identity & access

### Area

Entry and registration

### Scenario

Register and onboard one fresh identity with Firebase inactive

### Statistics

INDIRECT user inventory

### Monitoring / Metrics

DELTA one user/profile and consent lineage

### Affinity Graph

INDIRECT after normal profile processing

### Admin Jobs

X

### Domain / other UI

Demo/bootstrap auth reaches required onboarding once without manufacturing Firebase state; pasted numeric profile input remains identical in the draft and Review

### Manual status

MANUAL UI + SERVER ORACLE PASS / CLOSED

### Last manual date

2026-08-13

### Automated coverage

Focused FormFlow paste regression added; active frontend watcher compile passed; standalone test not run during the owned dev build

### Next manual oracle

Closed: replay only if demo identity, onboarding persistence or shared numeric-control behavior changes

### Result

PASS

### Evidence / notes

• Pre-Save open, Basics, three images and Review retained zero post-baseline users; no media error.• One Save created demo-profile-7e3c471d-d5fb-4175-ba07-885db86856fe: public/A, form v2, 3 images, 1 experience profile, 0 provider identities and one unique stable development-email owner.• Height paste defect reproduced as DOM 170 versus draft/Review 0170; shared FormFlow number write fixed. Fresh-bundle focused replay returned input/draft/Review 170 and created no second user.

### Manual QA priority

P0 98

## ENTRY-CONSENT-001

### ID

ENTRY-CONSENT-001

### Type

Expansion checkpoint CP03

### QA domain

Identity & access

### Area

Entry privacy consent

### Scenario

Accept required privacy and selected optional sections before registration

### Statistics

X

### Monitoring / Metrics

DELTA immutable exact-revision consent

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Anonymous evidence transfers once to authenticated user without broadening selected consent

### Manual status

MANUAL UI + SERVER ORACLE PASS / CLOSED

### Last manual date

2026-08-13

### Automated coverage

Versioned entry-consent fixture, read-only browser-state oracle and terminal Mongo oracle passed | 2026-10-07 isolated CDP regression PASS (EN desktop / 390x844 mobile): dismissed consent stays closed on group switch; correct images on first selection; Login reopens consent; one stable consent Help step with translated label; duplicate Privacy summary removed. SW 20/20 PASS; EN/HU live seed/translation parity PASS.

### Next manual oracle

Closed: replay only if consent selection, anonymous transfer or revision enforcement changes

### Result

PASS

### Evidence / notes

• Controlled English privacy v2 started from 25 consents, 0 ownerless consents and no post-baseline user.• Anonymous acceptance retained only qa-analytics for the exact revision, wrote one entry audit and created no session or server consent before registration.• One Save created demo-profile-5b569629-0a7b-46c8-b7e3-044f8f8f80dd with 3 images and exactly one user-owned consent; total delta +1, ownerless delta 0, qa-marketing absent, and /game did not reopen privacy.• Reset restored privacy-default-v1 as sole active revision and retained the inactive QA revision, profile and consent evidence. | Later user-authorized fresh anonymous browser evidence: guides/qa/evidence/general/EXPLANATION-GUIDE-001-20261007.md, landing follow-up. No full manual case replay, acceptance/registration or fixture reset; historical status preserved.

### Manual QA priority

P0 100

## ENTRY-CONSENT-002

### ID

ENTRY-CONSENT-002

### Type

Expansion checkpoint CP03

### QA domain

Identity & access

### Area

Entry privacy consent

### Scenario

Reject once, activate a newer revision, then reaccept

### Statistics

X

### Monitoring / Metrics

DELTA rejection/no-session then new immutable consent

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Old acceptance cannot satisfy new privacy revision and old audit history remains intact

### Manual status

MANUAL UI + SERVER ORACLE PASS / CLOSED

### Last manual date

2026-08-13

### Automated coverage

Versioned two-revision fixture, browser-state oracles and terminal Mongo oracle passed

### Next manual oracle

Closed: replay only if rejection, revision enforcement, audit retention or immutable consent semantics change

### Result

PASS

### Evidence / notes

• Previous v3 started as sole active revision; controlled newer v4 was inactive.• Baseline: Nova consents 2, total consents 26, ownerless 0, controlled-revision consents 0.• Fresh anonymous /entry browser shows exact v3 with no selected optional IDs, consent, audit or session; Cancel/Accept boundary visible.• One Cancel wrote exactly one rejected v3 audit; browser consent/session stayed absent and all server consent deltas stayed 0.• Login/Member reopened the same v3 gate without mutating the rejection audit, optional selection, session or server cardinality.• Accepting only Previous analytics stored the exact local v3 consent and prepended one accepted audit without removing the rejection; session stayed absent and server deltas stayed 0.• Nova login transferred one entry-source v3 consent (6a7e170d67960971c52a31b6): only qa-previous-analytics, target/total delta +1, ownerless 0, v4 consent absent.• Guarded activation made only v4 active at 19:13:40.771Z; v3 consent remained byte-identical and v4 consent stayed absent before reload.• Reload retained Nova/v3/audit history but forced a non-backdrop-dismissible v4 popup with empty selection; server still had no v4 consent and cardinality stayed +1/+1/0.• Approving only Current analytics created settings-source v4 consent 6a7e188067960971c52a31b8; v3 stayed immutable, marketing absent, target/total +2, ownerless 0.

### Manual QA priority

P0 100

## ENTRY-CONSENT-003

### ID

ENTRY-CONSENT-003

### Type

Expansion checkpoint CP03

### QA domain

Identity & access

### Area

Entry privacy consent

### Scenario

Carry stable optional choices into a new revision that adds one rubric

### Statistics

X

### Monitoring / Metrics

DELTA one immutable v5 consent; v4 unchanged

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Only previously approved matching stable IDs are preselected; new and prior-unselected rubrics remain opt-in

### Manual status

PASS / CLOSED

### Last manual date

2026-08-13

### Automated coverage

Versioned inheritance fixture, repair path and browser/server oracles implemented; display and save branches passed

### Next manual oracle

Closed; reset restores the original active privacy revision while retaining immutable v4/v5 consent evidence

### Result

PASS

### Evidence / notes

• Distinct v5 revision staged from exact retained v4 consent; baseline Nova/total/ownerless counts 4/28/0 and every delta 0.• Fresh Nova browser with no local consent bootstrap forced v5 and preselected only qa-current-analytics from v4.• Previously unselected qa-current-marketing and new qa-product-research both started unselected; v5 consent was absent before the user action.• Nova approved exactly qa-current-analytics plus qa-product-research; the popup closed and the demo session remained active.• Initial terminal verification found a fixture-stage defect, not an application write: stage had updated metadata on all English privacy revisions. Stage now deactivates only the active revision; versioned repair-stage restored three inactive snapshots without touching consents.• Final terminal oracle PASS 2026-08-13T19:40:23.017Z: v5 consent 6a7e1ce567960971c52a31b9 is settings-source with exactly analytics + product research; marketing absent; v4 revision/consent byte-identical; target/total/ownerless deltas +1/+1/0.

### Manual QA priority

P0 100

## AUTH-SESSION-001

### ID

AUTH-SESSION-001

### Type

Security checkpoint

### QA domain

Identity & access

### Area

Authentication / concurrent sessions

### Scenario

Authenticate one controlled user from three isolated clients and enforce a server-side maximum of two active sessions

### Statistics

INDIRECT authentication/security metrics only if separately attributed

### Monitoring / Metrics

DELTA one immutable login audit per explicit attempt and one security warning for every distinct additional or blocked client login; refresh X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Client A is accepted without a remote-login warning; distinct B is accepted and warns with a normalized machine label; distinct C is blocked while A/B remain valid and warns; after one slot is explicitly released C is accepted and warns. Notification time is supplied by its timestamp, active sessions never exceed two and credentials/raw tokens are absent from UI and audit

### Manual status

PASS / CLOSED

### Last manual date

2026-08-14

### Automated coverage

Server-authoritative two-slot session registry, immutable login audit and normalized security notification implementation; guarded auth-session fixture/oracle; tracked-demo publication-order regression source; existing backend/frontend watcher builds PASS

### Next manual oracle

Closed; repeat only after authentication/session registration, logout/revocation, client-label normalization, login audit, security notification delivery, demo-selector error propagation or i18n scope changes

### Result

PASS

### Evidence / notes

• Clean Nova baseline: sessions/audits/notifications/outbox all 0.• A accepted once with no warning; reload retained the same one slot/audit.• B accepted as slot 2; A/B stayed usable and converged to the same warning counter.• C remained blocked at two slots. A generic selector-message defect was fixed and replayed without deleting the first immutable audit; the exact repair-run order was ACCEPTED/ACCEPTED/BLOCKED_LIMIT/BLOCKED_LIMIT/ACCEPTED.• Explicit A logout released only A; accepted C then joined B as the exact final two sessions.• Final oracle: 2 active opaque sessions, 5 explicit-attempt audits, 4 normalized security notification/outbox rows, B/C counters 4, no raw UA/IP/token/session ID in UI.• C loaded demo.en .56 with Got it translated. Screenshot 2026-08-14 22-21-30 shows two New login and two Blocked login attempt rows; list open left all four unread.

### Manual QA priority

P0 100

## LANDING-ELIGIBILITY-001

### ID

LANDING-ELIGIBILITY-001

### Type

Security checkpoint

### QA domain

Identity & access

### Area

Public landing / regional login eligibility

### Scenario

• Budapest and London with granted browser geolocation• Paris as an absent-country control• Paris target after permission reset and Block

### Statistics

X

### Monitoring / Metrics

X for read-only eligibility checks unless dedicated security metrics are later specified

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

• Budapest 47.4979/19.0402 resolves eligible=true and country:hu• London 51.5074/-0.1278 resolves eligible=true and country:gb from the versioned OSM partition• Paris 48.8566/2.3522 resolves eligible=false while country:fr is absent, without implying a ban• Denied permission keeps Allow location without assuming a country or creating a session• Switching branches cannot reuse stale coordinates

### Manual status

PASS / CLOSED

### Last manual date

2026-08-15

### Automated coverage

Budapest/HU, London/GB and Paris/FR-absent granted branches PASS with exact requests and screenshot 2026-08-14 23-05-56. Paris permission denied -> explicit Allow location -> native Chrome grant -> one exact Paris retry PASS; screenshot 2026-08-15 00-44-26. Public Start exploring remained available; demo entry no longer persisted Paris into the seeded profile. Normal Logout revoked the exact backend demo session. Guarded cleanup removed only 2 session states, 3 accepted demo audits, 1 security outbox and 1 inbox row, reversed both +1 projections, and final status/verify/reset restored 56/0/0 with HU/GB unchanged.

### Next manual oracle

Closed: replay only if regional eligibility, permission handling, stale-coordinate isolation or demo-entry partition behavior changes

### Result

PASS

### Evidence / notes

Coordinates come from the browser and are untrusted input. Eligibility is allowlist-based: absence of an enabled countryPartition means not yet available, not forbidden. Functional geolocation gating does not by itself prevent spoofing; a server-trusted corroborating signal needs a separate security design if required. Verified Firebase login/profile partition retention is owned by external CP04 ENTRY-FIREBASE-REG-001.

### Manual QA priority

P0 100

## ROLE-TRIAD-CORE-001

### ID

ROLE-TRIAD-CORE-001

### Type

Consolidated journey

### QA domain

Identity & access

### Area

Three-role authorization, configuration and moderation

### Scenario

Keep exactly one member, admin and operator session open; prove route boundaries, persist one branding revision, then execute warn/report/feedback/support/block/unblock as one lifecycle

### Statistics

INDIRECT role-scoped counters; X; INDIRECT member access state; INDIRECT warning count; INDIRECT active user/access state; INDIRECT moderation count; INDIRECT pending feedback count; Moderation timeline/item and attention change

### Monitoring / Metrics

DELTA denied access audit where defined; DELTA one public revision; DELTA moderation audit; DELTA denial audit where defined; DELTA warning/audit/target notification; DELTA block/unblock audit and session policy; DELTA report resolution and target policy effect; DELTA feedback moderation state; DELTA time/actor/scope-bound capability audit; Users/Jobs or relevant domain delta

### Affinity Graph

X

### Admin Jobs

X; DELTA one notification delivery when policy requires; CONDITIONAL target notification only if policy names it; CONDITIONAL creator effect only if policy names it

### Domain / other UI

Each role sees only its capabilities and direct cross-role calls are denied without state mutation; The authorized branding revision persists; already-open consumers may require explicit reload and automatic refresh is not required; neither can edit operator config; Member access closes per policy; operator network/session remains intact and admin cannot alter operator authority; Admin succeeds within policy; operator/member direct calls are denied without data leakage or mutation; One target warning/notification occurs; admin receives no self-notification and replay is deduped; Protected requests fail per policy; operator/admin remain usable and unblock restores only authorized access; Exact report records actor/time/reason once; adjacent control remains unchanged; Creator-facing effect matches policy and unrelated impression/rating/report is unchanged; Sensitive actions remain separately authorized and expiry/revoke immediately denies reuse; Bell/moderation state correct

### Manual status

MANUAL UI + PERSISTED ORACLE PASS / CLOSED

### Last manual date

2026-08-31

### Automated coverage

Consolidated role/security, configuration, moderation, notification and support-session sources; running backend owner compile/classes and frontend owner watcher builds passed during defect correction; versioned role-triad Mongo checkpoint oracle supplied persisted boundary evidence without launching a parallel test/build process

### Next manual oracle

Closed; retain the complete three-role journey as a release-change regression sample

### Result

PASS

### Evidence / notes

The user accepted all 22 visual/interaction checkpoints after the full run and focused correction replays. Persisted boundary oracles covered branding save/restore, one warning, the shared support thread, live support-status bucket transitions, one report resolution, notification-only feedback resolution, block/unblock and access restoration. Final broad oracle: actor roles intact; Kai unblocked as host only; branding restored to revision 0; feedback 690000000000000000000202 resolved by admin-demo-ava at 2026-08-31T11:07:11.199156350Z; canonical feedback notification/outbox 1/1; moderation and legacy feedback chat/message/notification/outbox/support-case counts all 0; Ava support buckets and affinity residue 0. Versioned resets intentionally removed earlier transaction artifacts only after their evidence was recorded.

### Manual QA priority

P1 94

## JOB-PURGE

### ID

JOB-PURGE

### Type

Scheduled job

### QA domain

Identity & access

### Area

account-purge

### Scenario

Real scheduler purges due deleted account

### Statistics

INDIRECT network graph after user removal; ordinary deletion counted earlier

### Monitoring / Metrics

DELTA scheduler/audit; X for new profile.deleted event at purge time

### Affinity Graph

INDIRECT member/edge totals after removal

### Admin Jobs

DELTA

### Domain / other UI

DELTA removed/anonymized data and terminal purge job

### Manual status

MANUAL UI + PERSISTED ORACLE PASS / CLOSED

### Last manual date

2026-08-31

### Automated coverage

Versioned snapshot-protected account-purge fixture; real scheduler; exact terminal Mongo oracle; running frontend watcher compilation

### Next manual oracle

Closed; repeat only after deleted-account purge eligibility, cascade cleanup, scheduler runtime, pending counter or Jobs timing editor changes

### Result

PASS

### Evidence / notes

The dynamic Jobs table/detail visibly moved from one eligible item to Completed with affected 1 and pending 0 without manual Run. The exact oracle proved the fixture user and its userRates reference absent, and the terminal purge job Completed with cleared userId, completion timestamp, retry count 0 and no error. Snapshot-safe reset restored the original 86400-second rule and proved prepared:false. The same pass corrected Timing-popup X cancellation, unchanged-checkmark dirty behavior, duplicate header Quartz text and the redundant Timing Edit dirty dot; the existing frontend watcher compiled successfully.

### Manual QA priority

P0 98

## DEPLOY-EXTERNAL-CONFIG-001

### ID

DEPLOY-EXTERNAL-CONFIG-001

### Type

Configured deployment QA

### QA domain

Identity & access

### Area

Firebase and remote MCP external configuration

### Scenario

Fresh/existing Firebase entry, pending location persistence/retry/account isolation; verified non-demo invitation denial; configured-provider OAuth via external Inspector client; configured registration/profile fields, authenticated reporting chooser, installed-app version and physical Android permission retry

### Statistics

X

### Monitoring / Metrics

DELTA normal authenticated session and provider outcomes

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

No demo substitution for real provider authentication; no cross-account grant or pending-coordinate leakage

### Manual status

CLOSED / PASS

### Dev

NOT RUN

### Local

N/A

### Last manual date

2026-09-28

### Automated coverage

Supporting tests:63 focused entry/Setup/location tests PASS, including demo admission;20 menu tests PASS including HU double-translation regression. These do not replace configured-provider/device evidence. | Corrected permission-grant timer:38 focused Setup/location tests PASS; production build63e45751e41b-20260928075329 deployed.

### Next manual oracle

Closed.

### Result

PASS

### Evidence / notes

User explicitly deferred configuration-dependent checks2026-09-27. Moved from GROUP-LIFECYCLE-00119.2 and INTEGRATION-API-GROUP-0017; retains earlier DEPLOY-FIREBASE-LIFECYCLE-001 invitation-policy assertion. guides/qa/checklists/identity-access/DEPLOY-EXTERNAL-CONFIG-001.md. Current firebase-config404; no external-provider PASS. Time range is a planning estimate after prerequisites are configured; includes configured deployment help update/import. | User clarification 2026-09-27: testcases are independent closed execution units. Transferred checks are CLOSED BY SCOPE TRANSFER in the source, not pending dependencies. DEPLOY-EXTERNAL-CONFIG-001 requires its own fixture, restaging, entry checkpoints, execution and cleanup; prior/cross-case evidence cannot substitute. Transfer provenance stays in the ledger, not executable cross-case references. Audit the remaining NOT RUN cases only at the current testcase boundary, before advancing to another testcase. | User clarification2026-09-27: URL-first ChatGPT/Codex/Claude MCP connection without manual client-secret copying is NOT IMPLEMENTED. Development is required BEFORE deployment QA. Existing manual client registration and consent page do not prove the complete flow; external client initiates Connect. Tall connection cards keep Revoke top right. | Corrected domain2026-09-27: URL-first MCP implementation belongs to API test, not deployment setup. This row retains actual configured external-client interoperability checks only; no cross-case execution dependency or inherited PASS. | Boundary clarified: public HTTPS/external service registration/real ChatGPT-Codex-Claude interoperability belong here when they require configured deployment. Local/dev must still complete the real application protocol with a test client. Each case runs independently; URL-first feature still NOT IMPLEMENTED. | External assistant acceptance requires user Connect/login/approval, followed by actual authorized MCP tool discovery and read invocation in that same host/account. Simulator success alone is insufficient. Record actual ChatGPT/Claude conversation result; a supported dev tunnel may supply reachability. | 2026-09-27 clarification: explicit user-operated manual ChatGPT website acceptance added; not Codex-host substitution. Local simulator needs no production config and remains API scope. | 2026-09-27 closure reconciliation: independent blocks4–6 now contain residual configured registration/profile/filter, remote reporting, installed version and physical permission recovery; own setup/checkpoints/cleanup required. Source14–16 scope transfer CLOSED; destination remains NOT RUN, no inherited PASS. | 2026-09-28 current scope: unexecuted real-host ChatGPT/Claude/Codex smoke moved to guides/qualification/MCP-CLIENT-CONNECT-SMOKE.md outside the QA matrix; no tested result moved. Section2 retains configured-provider OAuth with Inspector. This supersedes earlier real-host acceptance scope notes; QA status stays NOT RUN. | 2026-09-28: user delegated full-flow QA on their Android phone. VMware production runtime1.3.0 prepared; final DEB upgrade remains pending. Production parity audit found/fixed packaged session-limit/Integration URL forwarding and retained help-v3 migration; see guides/qualification/evidence/PROD_PARITY_20260928.md. No checklist PASS inferred. User explicitly requests separate iOS block7 IGNORED because no iPhone/iPad; blocks1–6 can close this case independently. IGNORED is not a claim that iOS is unsupported. | 2026-09-28: production UI build0f723f2d23a0-20260928044638 running on VMware. Physical required Setup→Update→Close→Google login observed; user second Google account reached registration, initial Mongo absence query omitted firebaseUid and is not valid fresh-record evidence. Full1.1 remains incomplete. See PROD_PARITY_20260928.md. | Current continuation2026-09-28: registration completed; authoritative profile HTTP200, Mongo point matches request, pending point cleared, IndexedDB checked independently. Children repair production build050359 deployed;1.2 user verification pending. Former block4 merged into1; reporting is4, Android5, iOS6 IGNORED. See PROD_PARITY_20260928.md for baseline limitation and current evidence. | User confirmed Children label repair on phone (“jo lett a gyerek”); remaining1.2 assertions stay open. | 2026-09-28 current order: Firebase1 retained, no completed-check replay; machine2 active, desktop OAuth3, Android4 last. iOS removed from active scope by user. Saved-point login and location retry observed; controls restored. UI06450 deployed, backend JAR matches. Disposable help importer/migration PASS, configured HU/EN HTTP200; MCP/full boundary pending. See parity evidence. | Final user clarification: machine1 first, OAuth2, single mobile3 block retaining Firebase3.1; skip completed Firebase assertions. HU/EN canonical HTTP and MCP17-topic reads PASS. Private outsider8 direct requests denied403/404, existing chat controls verified separately; DB unchanged and scoped fixture restored. OAuth discovery and5 initial invalid-request probes PASS; grant-dependent cases pending. GitHub chooser needs signed-in session. | OAuth2.1: official Inspector on physical phone connected with existing real Firebase session, correct base-profile discovery and successful account-owned event read. No injected grant. Desktop unused client removed; phone client captured, pending revocation/cleanup. User requires all remaining browser actions on phone in numbered order. | OAuth2.2 reconnect, cancellation(no grant), retry and protocol negatives PASS; expired-code deadline prepared by scoped fixture.2.3 normal phone logout: OAuth/API200 and old browser401. Await user sign-in for explicit revocation. Three Inspector clients and one QA API key retained in harness; cleanup pending. See DEPLOY_OAUTH_20260928.json. | OAuth2.1–2.4 PASS/CLOSED: normal phone logout retained independent OAuth/API access200 and rejected old browser401; explicit ordinary endpoint revocations then rejected both credentials401. Three captured clients and one QA key exactly restored, zero remaining. Inspector stopped, owned tabs/callback6274 and private credentials removed; original8443 transport and real account/Event retained. Next: finish audit of1.1–1.4 before3, per user. | 1.4 PASS: authenticated actual GitHub chooser and all three Bug/Feature/Question forms opened on physical Android; concise fields match versioned templates. No issue submitted. See DEPLOY_GITHUB_20260928.json. Blocks1.2/1.3 and2 remain complete;1.1 retains verified importer/migration/HTTP/MCP scope and documented standalone-deployment limitation, with no restart per user. | 2026-09-28 CLOSED / PASS. Exact fixture reset complete. Next work: VMware DEB1.3.0 upgrade.

### Manual QA priority

P2 60

## MSC115-LANDING

### ID

MSC115-LANDING

### Type

Flow

### QA domain

Identity & access

### Area

Shared landing and demo selection

### Scenario

MSC-115 steps 4–17: Mode selection, articles, demo entry, consent/login, workspace identity and build-defined landing palette. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

NOT RUN

### Last manual date

2026-10-15

### Automated coverage

See guides/plans/MULTI_GROUP_PRODUCT_DIRECTION_2026_10.md; code/build checks do not establish manual PASS. | 2026-10-07: compiled main-group identity/global paging checks and read-only HTTP paging/sync PASS; guides/qa/evidence/work-community/MAIN-GROUPS-20261007.md.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 full automatic MSC-115 delegated, visible CDP only. Existing dev stack started; initial desktop/mobile mode switching and request reuse observed. Mobile hero clipping and requested fixed header source fixes under verification. No full row PASS. Evidence guides/qa/evidence/work-community/MSC-115_AUTOMATIC_20261013.json; A01-A12 mandatory at each step. Live-only checks separated without marking PASS. | 2026-10-13 ledger reconciliation: retained MSC115-LANDING-* evidence records header/hero/autoplay, mode-specific demo pickers and eight six-section English articles. Overall row remains IN PROGRESS; the old step4 restart pointer is superseded. | 2026-10-13 user-requested synchronization: current steps 4–17; old scenario wording replaced by the active checklist. No new test or PASS claimed.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## ROLE-GUIDES-NOTIFICATIONS-001

### ID

ROLE-GUIDES-NOTIFICATIONS-001

### Type

Feature extension

### QA domain

Identity & access

### Area

Role guides and notifications

### Scenario

MSC-118: 37 system contexts; all-role launchers and persistent preferences; role inbox events and targets

### Statistics

X

### Monitoring / Metrics

Existing outbox and login audit evidence

### Affinity Graph

X

### Admin Jobs

Existing notification worker; signed release discovery

### Domain / other UI

Guide/card/read/mute/context behavior only; business actions use their own fixtures

### Manual status

NOT RUN

### Dev

NOT RUN

### Local

NOT RUN

### Automated coverage

Compiled watcher runtime PASS; Java + isolated Mongo PASS; 222 live guide GETs PASS; seed parity PASS

### Next manual oracle

Follow the dedicated MSC-118 role-guide/notification browser checklist. Issue156 closes development only; desktop/mobile Local/HTTP manual QA remains open. | Template baseline is closed; assess newly found defects, carry over affected fixes and run only their targeted template regression.

### Result

NOT RUN

### Evidence / notes

Development evidence: guides/qa/evidence/general/ROLE-GUIDES-NOTIFICATIONS-001-20261007.md. No browser click-through, provider push or six-hour cycle claimed. https://github.com/fssrepository/myscoutee-roadmap/issues/156 | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 read-only reconciliation with https://github.com/fssrepository/myscoutee-roadmap/issues/156: issue closed2026-10-07 for implementation; its body explicitly retains manual browser QA NOT RUN. This is the fifth task represented in outstanding QA (MSC-115 through119), not MSC-122. Status intentionally unchanged.

### Manual QA priority

P0 100

### Remaining QA complexity (min/max)

60/120

## EVENT-FOLLOWING-001

### ID

EVENT-FOLLOWING-001

### Type

Release integration

### QA domain

Event

### Area

Followed organizers

### Scenario

Organizer follow, current-event counter, filtered Explore, shared Members, expiry and Watchlist independence

### Statistics

X

### Monitoring / Metrics

X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Separate stored following count and members; excluded avatar aggregate

### Manual status

AUTOMATED CDP PASS / CLOSED

### Dev

PASS

### Local

UNIT PASS

### Last manual date

2026-09-22

### Automated coverage

44 backend and 9 local eligibility tests PASS; browser follow/unfollow/filter/compact UI plus authenticated API lifecycle, identity and stored expiry oracles.

### Next manual oracle

None in dev HTTP scope. Physical mobile and full local browser path not exercised.

### Result

PASS

### Evidence / notes

guides/qa/evidence/EVENT-FOLLOWING-001-20260922-progress.md; managed windows closed and fixture reset.

### Manual QA priority

P0 100

## EVENT-FOLLOWING-002

### ID

EVENT-FOLLOWING-002

### Type

Release integration

### QA domain

Event

### Area

Following menus and confirmation

### Scenario

Activities external/follow menus, confirmation, signed save deltas, live removal and persisted poll

### Statistics

X

### Monitoring / Metrics

X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Separate stored following count and members; excluded avatar aggregate

### Manual status

AUTOMATED CDP PASS / CLOSED

### Dev

PASS

### Local

UNIT PASS

### Last manual date

2026-09-22

### Automated coverage

27 frontend and 12 backend focused tests PASS; 8 numbered dev HTTP browser checks PASS including delayed save, failed transport/retry, idempotency and reload/poll.

### Next manual oracle

None in delegated dev HTTP scope. Local browser and physical mobile not exercised.

### Result

PASS

### Evidence / notes

guides/qa/evidence/EVENT-FOLLOWING-002-20260922-progress.md; isolated windows closed and fixture reset.

### Manual QA priority

P0 100

## EVENT-MODE-REGRESSION-001

### ID

EVENT-MODE-REGRESSION-001

### Type

Regression journey

### QA domain

Event

### Area

Event formats and Explore

### Scenario

Standard/Tournament isolation, Speed meeting rounds and feedback, saved Explore preferences, external links, local restart persistence

### Statistics

X

### Monitoring / Metrics

Observe real writes only

### Affinity Graph

Met plus reciprocal positive ratings

### Admin Jobs

Existing workers only

### Domain / other UI

Editor, Explore, filters, members, rounds, feedback and landing

### Manual status

DELEGATED AUTOMATED PASS / CLOSED

### Dev

PASS

### Local

PASS (adapter/IndexedDB)

### Last manual date

2026-09-22

### Automated coverage

Numbered steps 1–11 closed: Standard links/membership/feedback; Tournament real worker and saved scores; Speed meeting rounds and six distinct peers; local compiled adapter reload; scoped service friendship checks.

### Next manual oracle

Closed. Separate EVENT-ACTIVITY-RATING-001 now prepared for user-controlled manual rating.

### Result

PASS

### Evidence / notes

guides/qa/checklists/event/EVENT-MODE-REGRESSION-001-20260921-progress.md and guides/qa/evidence/EVENT-MODE-REGRESSION-001-2026-09-22.json. All 11 QA events trashed, preferences restored, key revoked/401, watch disabled, receiver stopped, native viewports retained. Local and friendship evidence are adapter/service coverage, not full visible browser journeys. Actual device FCM and separate Admin geometry not claimed.

### Manual QA priority

P0 98

## EVENT-ACTIVITY-RATING-001

### ID

EVENT-ACTIVITY-RATING-001

### Type

Fixture-backed manual journey

### QA domain

Event

### Area

Activity rating by event format

### Scenario

Two starting states: meeting before first rating; one-sided rating without meeting -> Mutual. Side-menu total-rate badge.

### Statistics

Observe actual rating writes; no synthetic result seeded

### Monitoring / Metrics

Existing rating sync and projection jobs

### Affinity Graph

Observe reciprocal Met friendship; no outcome seeded

### Admin Jobs

Existing event-counter-expiry, temporarily shortened for preparation then restored

### Domain / other UI

Manual Rates buckets, scores from both perspectives, save/reopen/reload, distinct feedback peer

### Manual status

PASS / CLOSED — corrected numbered checklist coverage

### Dev

PASS (fixture and persisted reads)

### Local

NOT RUN

### Last manual date

2026-09-22

### Automated coverage

Core transitions and four bucket lists; continuation UI Saves 4/9, reopen/reload both actors, independent friendship/feedback reads and single event/host feedback flow. Prior Standard projection preservation evidence reviewed. Scoped cleanup.

### Next manual oracle

Closed. Numbered 1–10 results in progress log; fixture reset and managed windows closed.

### Result

PASS

### Evidence / notes

Updated user expectations; no nonexistent All/Friends Rates list. Both core flows PASS; side-menu total 1; actual 4/9 saved/reloaded. One friendship, zero feedback answers. Host is not duplicated as attendee. Step 9 retains historical 9/4 Standard projection evidence, not a new isolated Tournament replay. Step 10 not-staged after versioned cleanup. Detailed checklist retained; no application change. See dated progress, continuation/outcomes and closure JSON.

### Manual QA priority

P0 99

## EVENT-EDITOR-001

### ID

EVENT-EDITOR-001

### Type

Checkpoint

### QA domain

Event

### Area

Event Editor

### Scenario

Create, save and reopen one draft event

### Statistics

INDIRECT after the statistics snapshot worker

### Monitoring / Metrics

DELTA event write and recompute queue

### Affinity Graph

INDIRECT after recompute

### Admin Jobs

DELTA affinity recompute task; active-only schedulers X

### Domain / other UI

Draft appears once in Hosting/Drafts and every saved field reopens exactly

### Manual status

MANUAL UI + FUNCTIONAL PASS

### Last manual date

2026-08-04

### Automated coverage

Event sync/service coverage partial; focused HTTP/local timezone regressions pass

### Next manual oracle

Retain as a release-change sample; continue the same canonical draft into EVENT-EDITOR-002

### Result

PASS

### Evidence / notes

One canonical draft, one deduplicated recompute task, zero outbox, no read-only duplicate, and no Nova All/Active/Invitations visibility. Venue label remained Austin while proximity coordinates exactly matched Casey. The fixed retest stored local 18:00-20:00 as 16:00Z-18:00Z and both card and reopened editor showed 18:00-20:00.

### Manual QA priority

P0 88

## EVENT-TIMEZONE-001

### ID

EVENT-TIMEZONE-001

### Type

Defect retest

### QA domain

Event

### Area

Event Editor date/time

### Scenario

Preserve a locally entered event range across UTC persistence and editor reopen

### Statistics

INDIRECT only after the normal snapshot worker

### Monitoring / Metrics

DELTA only for the intentional corrective Save

### Affinity Graph

INDIRECT only after recompute

### Admin Jobs

Time-dependent jobs consume the corrected UTC instant; no job is invoked by reopen

### Domain / other UI

Europe/Bratislava 18:00-20:00 persists as 16:00Z-18:00Z and reopens as 18:00-20:00

### Manual status

MANUAL UI + FUNCTIONAL PASS

### Last manual date

2026-08-04

### Automated coverage

Focused HTTP and local IndexedDB service regressions pass 12/12 under Europe/Bratislava

### Next manual oracle

Retain as a release-change timezone sample

### Result

PASS

### Evidence / notes

Initial failure was a timezone-free local datetime sent unchanged to a backend UTC field. After the shared persistence-payload fix and hot deploy, MongoDB contained 16:00Z-18:00Z while the card and reopened editor both showed 18:00-20:00; the editor model remained local and unchanged before persistence.

### Manual QA priority

P0 98

## EVENT-EDITOR-002

### ID

EVENT-EDITOR-002

### Type

Checkpoint

### QA domain

Event

### Area

Event Editor

### Scenario

Publish one controlled draft

### Statistics

INDIRECT event inventory delta

### Monitoring / Metrics

DELTA event lifecycle and recompute

### Affinity Graph

INDIRECT after recompute

### Admin Jobs

DELTA affinity recompute; slot/reminder consumers conditional

### Domain / other UI

Hosting and Explore visibility obey user and visibility boundaries

### Manual status

MANUAL UI + FUNCTIONAL PASS

### Last manual date

2026-08-04

### Automated coverage

Publish/service coverage partial

### Next manual oracle

Retain the same event for the Unpublish and EVENT-EDITOR-003 draft-save checkpoints; repeat visibility after publication changes

### Result

PASS

### Evidence / notes

Casey published once: the same h1785836388222 identity became active, remained once in My Events, left Drafts and kept 18:00-20:00 local / 16:00Z-18:00Z persisted. One deduplicated recompute task refreshed, outbox stayed zero, and Nova received no invitation/counter and saw no Aug 6 event in Explore. A helper-only dynamic-ID selector defect was corrected before the final oracle.

### Manual QA priority

P0 90

## EVENT-VISIBILITY-001

### ID

EVENT-VISIBILITY-001

### Type

Continuation checkpoint / defect retest

### QA domain

Event

### Area

Event visibility

### Scenario

After EVENT-TICKET-007, change the same event to Friends Only and enforce discovery for external friend/non-friend controls

### Statistics

X

### Monitoring / Metrics

DELTA only for Casey Unpublish/visibility/Publish lifecycle writes; Explore reads X; visibility-only Save must not create a false definition-change occurrence

### Affinity Graph

X

### Admin Jobs

DELTA normal event recompute only for owning lifecycle writes; Explore reads X

### Domain / other UI

Retained Casey/Nova/Riley memberships stay unchanged; Unpublish rotates Nova/Riley A tickets to D and republish creates new A IDs/codes with restored counters; visibility-only Save creates no general change notification; Nova/Riley open UI converges on Publish; external non-member Lina Park sees the event exactly once in Explore as Casey's friend; external non-member Liam Parker does not see it and is denied direct detail access; neither control gains participation or ticket artifacts

### Manual status

PASS / CLOSED

### Last manual date

2026-08-13

### Automated coverage

Backend regression sources added for Friends-only detail parity and tracked Invitation-only participant access; existing backend owner compile and healthy restart PASS; full fixed Save/Publish replay plus Explore list/direct HTTP replay PASS; no parallel test/build process started

### Next manual oracle

Closed; reset the retained visibility fixture, then stage the next independent checkpoint from a fresh verified baseline

### Result

PASS

### Evidence / notes

• EVENT-TICKET-007 PASS/CLOSED retained Nova A ticket manual-qa-checkpoint:v1:event-domain:ticket / TKT-d6bd7582-1849-46bb-ba09-24dd7fb92b44 and Riley A ticket 6a7cd3aff8a7d3829acd805a / TKT-d05cdd81-86da-430d-b166-b508cccb42c6 with counters 1/1 and Casey ticketless.• Guarded advance at 22:42:44+02:00 changed only the active checkpoint pointer and retained original reset snapshots; follow-up status kept one active Ticketing On event, Casey/Nova/Riley accepted 3/8, no pending/invited rows and both exact active tickets.• Lina Park is the deterministic Casey-friend external control and Liam Parker the deterministic non-friend; neither has tracked participation on the event and both activity snapshots are now owned.• Prior three managed browsers were closed before replacement; new Casey/Lina/Liam windows are identity-verified with Austin geolocation. Nova/Riley remain persisted membership/ticket controls and need no active browser for the visibility producer.• Casey Unpublish PASS: the same event is DR/Public/Ticketing On with unchanged Casey/Nova/Riley accepted membership 3/8 and no pending/invited/request rows; the already-open Casey My Events projection shows the single draft without reload.• Nova's and Riley's exact original tickets were retained and changed A->D; no new ticket appeared, ticket counters are 0/0 and Casey remains ticketless. Lina/Liam still have no participation or ticket artifact.• The Unpublish-owned event recompute completed at 20:55:46Z, attempt 2, empty lastError; the affinity worker returned to pendingCount 0.• Friends only draft Save DOMAIN PASS / NOTIFICATION FAIL: the same event remained DR/Ticketing On and persisted visibility=Friends only; Casey/Nova/Riley remained accepted 3/8 with no pending/invited/request row.• Both exact original tickets stayed D with unchanged IDs/codes/issue times, no replacement appeared, counters stayed 0/0, Casey remained ticketless and Lina/Liam controls remained unchanged. Casey's open card changed to the Friends icon without reload.• The strengthened oracle found one false completed event-definition-changed task with reasons schedule,sub-events and exactly two unread event-details-changed / The event schedule changed rows plus outbox intents, one for Nova and one for Riley. Their UI was not open, so in-place Save behavior was NOT EXECUTED.• First Publish server/Casey PASS: active Friends only, unchanged accepted 3/8, original D history retained, Nova new A 6a7ce077f8a7d3829acd807b / TKT-f9c24f1f-6b83-4d66-b0db-2bcb1ef2280b, Riley new A 6a7ce077f8a7d3829acd807d / TKT-cf9ab939-5da5-4d42-8b13-e5402bf047af, counters 1/1 and exact modified lifecycle notifications. Nova/Riley UI was NOT EXECUTED.• Fix canonicalizes missing/default frequency, slots, sub-event and mode values before classifying changes. Running backend owner compiled/restarted green; no parallel process. Three-account limit is explicit: Casey/Nova/Riley replay first, then replace with Casey/Lina/Liam; never more than three concurrent windows.• Guarded replay preparation and independent status PASS: DR/Public/Ticketing On, accepted membership unchanged at 3/8, all four retained physical tickets D, Nova/Riley counters 0/0, and the failed Save's false definition task plus two generic outbox/notification rows absent. The stale three-window manifest had no live browser process; its replacement identity-verified exactly three live Casey/Nova/Riley sessions and opened no fourth QA window.• Pre-Save open UI baseline PASS: Nova New shows exactly the retained modified + under-review rows (2); Riley New shows those plus member-approved (3); neither contains the removed false schedule-changed row. Both lists remain open for the visibility-only Save.• Fixed visibility-only Save full replay PASS: one Casey sync write at 01:13:16+02:00 persisted DR/Friends only with unchanged accepted 3/8, all four retained tickets D and counters 0/0; no new generic definition task/outbox/notification; Nova stayed at New 2 and Riley at New 3 in-place without reload/reopen. The normal recompute completed done at 01:16:46+02:00, attempt 5, empty lastError, and the post-worker oracle remained identical.• First replay Publish instruction NOT EXECUTED / fixture timing invalid: original endAt reached 01:18; Casey's normal poll changed from the card to empty at 01:18:25, screenshot 01:19:17 confirmed it, no Publish request was sent and the persisted oracle stayed unchanged.• Guarded one-shot window repair READY: exact post-Save oracle was enforced, all projections moved to Aug 13 13:22 through Aug 14 13:22, and independent status retained DR/Friends only, membership 3/8, 4xD tickets, 0/0 counters and unchanged notifications. Casey's same open list recovered the card by normal poll without reload; Nova stayed New 2 and Riley New 3.• Clean Publish full replay PASS: exactly one publish POST at 01:25:27+02:00 produced A/Friends only/Ticketing On, unchanged 3/8 membership, retained 4xD history, Nova A 6a7d00e7f8a7d3829acd8084 / TKT-98fa21bc-abd4-4240-873d-09b83c4f3b3c and Riley A 6a7d00e7f8a7d3829acd8085 / TKT-0cbd5e00-4694-4408-95bf-d21018128526 with counters 1/1. Exact modified task targeted two recipients; Nova New 2->3, Riley 3->4 and both Ticket counters 0->1 in-place without reload. Each later Ticket open showed exactly one current event card without reload. Recompute completed done at 01:28:52+02:00, attempt 6, empty lastError; terminal oracle retained exact audit/counters/notifications.• Explore replacement baseline READY: exact Casey/Nova/Riley PIDs were validated, terminated and proven absent before exactly three Casey/Lina/Liam sessions launched and identity-verified. Lina is deterministic Casey-friend, Liam non-friend; neither has membership/tracked participation/ticket. Baselines: Lina events6/tickets0/all10/active6/pending1/invitations2/hosting1; Liam events9/tickets0/all12/active9/pending2/invitations0/hosting1; event A/Friends only/Ticketing On 3/8 and recompute done.• Explore list PASS: Lina's open Explore list contained QA EVENT-TICKET-007 exactly once and Liam's contained no target card; neither changed filters or opened a card. The immediate oracle retained both controls and all membership/ticket/task state unchanged.• Direct detail initially FAIL: Liam's server request returned the full Friends-only event DTO, proving the detail read omitted the external-viewer visibility authorization even though Explore filtering was correct.• Owning Java fix applies one shared canonical external-viewer visibility boundary to detail and Explore while retaining Admin and tracked-participant detail access. Friends-only friend/non-friend and Invitation-only participant regression sources were added. The existing backend owner compiled BUILD SUCCESSFUL and restarted healthy; no parallel Gradle/test/server process ran.• Focused direct replay PASS: Liam returned HTTP 200 with an empty 0-byte body; Lina, Nova and Casey each returned the exact target DTO. Final Docker-backed status retained Lina/Liam with no membership/invitation/ticket/counter change, Casey/Nova/Riley accepted 3/8, exact six-ticket audit and recompute attempt 6 done with empty lastError.

### Manual QA priority

P1 99

## EVENT-PUBLISH-CHAT-001

### ID

EVENT-PUBLISH-CHAT-001

### Type

Defect retest / lifecycle checkpoint

### QA domain

Event

### Area

Event publish + chat authorization and persisted counters

### Scenario

Stage one isolated Draft with Casey accepted and Nova/Riley pending, record all three Chat baselines, then publish once from the Casey Draft card

### Statistics

INDIRECT event inventory delta

### Monitoring / Metrics

DELTA publish lifecycle, event recompute and exactly one main-event chat; chat attention counts stay unchanged

### Affinity Graph

X

### Admin Jobs

DELTA normal publish recompute; scheduler X

### Domain / other UI

Casey gains exactly one empty event-chat row with unread 0 while top Chats / Chat All / Event attention counters remain unchanged; Publish creates no automatic chat system message and no Casey notification; My Events remains 1 while Drafts changes 1 to 0 from either Publish surface; reload agrees with backend; Nova and Riley chat rows and counters remain unchanged; active card is 1 / 8 with pending badge 2; acceptance notification X

### Manual status

MANUAL UI + FUNCTIONAL PASS; FIX VERIFIED

### Last manual date

2026-08-13

### Automated coverage

Clean Draft Publish ran once at 14:12:42Z. Counter/scope switching, exact Nova/Riley in-place invitations, terminal recompute and three-client authorization lists passed. Casey opened the single chat and saw No messages yet; after one Casey-only reload the client restored Chats0/Invitations3/My Events1/Drafts0 and the same single empty chat. Final oracle retained one Casey-only chat unread0, no messages/outbox/chat notifications, zero chat deltas, Nova/Riley one invite each and no chat; recompute done attempt1 empty lastError.

### Next manual oracle

Retain the fixture for guarded EVENT-INV-003 advance; never replay Publish or reconstruct the proven baseline

### Result

PASS

### Evidence / notes

Historical backend chat materialization/system-message/attention defects and the later Draft stale-scope counter defect are all fixed and closed. Shared SmartList was not modified; full in-place and reload parity passed.

### Manual QA priority

P0 100

## EVENT-EDITOR-003

### ID

EVENT-EDITOR-003

### Type

Checkpoint

### QA domain

Event

### Area

Event Editor + Auto inviter

### Scenario

Unpublish the retained event, enable Auto inviter in Draft and Save; execute CARD-PUBLISH from the Draft card overflow menu; then prepare Riley and arm the persisted real periodic schedule while recipient and host lists remain open

### Statistics

INDIRECT event/member activity

### Monitoring / Metrics

DELTA event save and card lifecycle; member/outbox X before publish

### Affinity Graph

INDIRECT after event/member recompute

### Admin Jobs

X while draft; DELTA only after schedule-auto-inviter makes the named real rule due

### Domain / other UI

Draft persists Auto inviter On with no invitation; CARD-PUBLISH keeps one identity and consistent capacity; publish-time Nova and periodic Riley invitations remain separately attributable; open lists converge without reopen

### Manual status

MANUAL UI + FUNCTIONAL PASS

### Last manual date

2026-08-04

### Automated coverage

Focused creator-anchor regression passed; auto-inviter service/fixture coverage; STAT-012 scheduler path passed

### Next manual oracle

Retain the real-scheduler identity oracle and open-list convergence as the regression sample; reset through the guarded helper before a new run

### Result

PASS

### Evidence / notes

Draft persistence and the reversible pre-publish baseline passed. The first CARD-PUBLISH exposed a missing creator graph anchor when no event member rows existed; the backend fix and focused normal-cache regression passed. The repeated CARD-PUBLISH moved the same event from Drafts to My Events and synchronously created exactly one Nova pending member, notification and outbox item while Riley stayed unchanged and the periodic rule remained idle. The later persisted schedule became eligible at 14:38:20; the real scheduler claimed it at 14:39:13 and completed in 140 ms with processedCount 1. The exact oracle proved Riley alone was added by that periodic batch while Nova remained the publish-time recipient. The 14:39:22 intermediate screenshot contained mixed 1 / 8 (1) and 1 / 8 (2) projections. By 14:39:52 the already-open Nova Invitations, Riley Invitations and Casey My Events projections all converged to 1 / 8 (2) without refresh or reopen.

### Manual QA priority

P0 94

## EVENT-ACTIVITY-REFRESH-001

### ID

EVENT-ACTIVITY-REFRESH-001

### Type

Defect retest / cross-cutting checkpoint

### QA domain

Event

### Area

Event activity buckets

### Scenario

Keep Nova Invitations, Riley Invitations and Casey My Events open while the EVENT-EDITOR-003 real periodic run adds Riley; observe without popup or browser refresh

### Statistics

X

### Monitoring / Metrics

X for the read-only poll; DELTA belongs only to the owning mutation

### Affinity Graph

X

### Admin Jobs

X for the poll; the auto-inviter worker belongs only to EVENT-EDITOR-003

### Domain / other UI

Within one 30-second SmartList interval all three open projections converge to the same accepted-occupancy and pending-badge values; accepted occupancy remains unchanged until acceptance; unaffected buckets remain X

### Manual status

MANUAL UI PASS; FIX VERIFIED

### Last manual date

2026-08-04

### Automated coverage

SmartList visible-range polling and keyed patching already covered; no dedicated Activities popup component spec

### Next manual oracle

Reuse the same no-reopen assertion when sampling All or another affected event bucket after a controlled mutation

### Result

PASS

### Evidence / notes

Before the fix, Nova's notification and counters arrived but the already-open Invitations list stayed empty until popup reopen. All non-calendar event activity scopes now share one 30-second SmartList-owned visible-list poll, paused behind dialogs/event chat; no new cache, worker or full-app rerender was added. During the Riley periodic retest, all three sessions remained open. The 14:39:22 screenshot captured mixed 1 / 8 (1) and 1 / 8 (2) projections after the 14:39:13 scheduler run. The 14:39:52 screenshot showed Riley's invitation and Nova, Riley and Casey all at 1 / 8 (2) without refresh or reopen. Accepted occupancy stayed 1 / 8 because Nova and Riley were still pending; the red (2) was the synchronized pending-invitation count.

### Manual QA priority

P1 78

## EVENT-MEMBER-CREATOR-001

### ID

EVENT-MEMBER-CREATOR-001

### Type

Defect checkpoint

### QA domain

Event

### Area

Event creator/admin membership

### Scenario

Publish an event with no creator member document, add pending invitations, then compare event-card occupancy with Event Members and the exact member oracle before acceptance

### Statistics

INDIRECT only after a real membership mutation

### Monitoring / Metrics

DELTA belongs to publish/invite; read-only comparison is X

### Affinity Graph

INDIRECT because downstream graph may consume canonical membership

### Admin Jobs

X for the read-only comparison

### Domain / other UI

Creator appears once as accepted Admin; Members reports 1 member and N pending; cards report 1 / capacity with pending badge N

### Manual status

MANUAL UI + FUNCTIONAL PASS; FIX VERIFIED

### Last manual date

2026-08-04

### Automated coverage

Creator materialization/idempotence, publish/sync invocation, no-fallback mapper and stored-admin-order regressions passed in the 99-test focused profile selection. The existing Java container was stopped for the run, then restarted healthy; no parallel stack or cache was created.

### Next manual oracle

Retain Unpublish then CARD-PUBLISH as the regression sample; verify the creator exactly once and keep pending recipients unchanged before acceptance

### Result

PASS

### Evidence / notes

Historical failure: all three event cards displayed 1 / 8 (2) while Event Members and the exact oracle contained no accepted Casey membership. After removing Java creator synthesis, the post-fix Unpublish converged every open projection to the truthful legacy-draft baseline 0 / 8 (2). CARD-PUBLISH repaired the same event identity: all three sessions converged to 1 / 8 (2), Event Members reported 1 member / 2 pending, and Casey appeared exactly once as Admin while Nova and Riley remained pending. The independent oracle stored acceptedMembers 1, pendingMembers 2, Casey in acceptedMemberUserIds and admins, and exactly one accepted Admin creator membership plus the two pending invite memberships. No fixture or direct database mutation was used.

### Manual QA priority

P0 99

## EVENT-CAPACITY-SYNC-001

### ID

EVENT-CAPACITY-SYNC-001

### Type

Defect retest

### QA domain

Event

### Area

Event card capacity projection

### Scenario

Keep occupancy stable across Unpublish and SmartList scope changes

### Statistics

X

### Monitoring / Metrics

DELTA event lifecycle only; occupancy remains authoritative

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

My Events and Drafts show the same canonical occupancy before and after reload

### Manual status

MANUAL UI + FUNCTIONAL PASS; FIX VERIFIED

### Last manual date

2026-08-04

### Automated coverage

No-fallback mapper and canonical membership regressions passed in the 99-test focused profile selection. The existing Java container was stopped for the run and restarted healthy.

### Next manual oracle

Reuse one Unpublish and CARD-PUBLISH transition while multiple isolated event projections remain open; compare each state with the canonical membership oracle

### Result

PASS

### Evidence / notes

Historical failure: Unpublish briefly split My Events at 1 / 8 from the authoritative empty membership and Drafts at 0 / 8. In the post-fix retest, Unpublish converged the open projections and exact draft oracle to 0 / 8 (2). CARD-PUBLISH materialized the creator membership and all three already-open sessions converged to the new canonical 1 / 8 (2), with no frontend fallback or direct database repair.

### Manual QA priority

P1 72

## EVENT-SLOT-TOURNAMENT-001

### ID

EVENT-SLOT-TOURNAMENT-001

### Type

Consolidated journey

### QA domain

Event

### Area

Tournament definition and recurring-slot lifecycle

### Scenario

Save/reopen one tournament definition with a weekly template and two occurrences, inspect host/participant action gating, then close an ended stage and edit one past leaderboard score

### Statistics

INDIRECT event activity; INDIRECT event inventory after Save; X; INDIRECT stage activity; INDIRECT score activity

### Monitoring / Metrics

DELTA event write and recompute; DELTA parent event write and recompute; X; DELTA slot-scoped runtime mutation and recompute; DELTA score row and tournament-input recompute

### Affinity Graph

INDIRECT after recompute; INDIRECT after event recompute; X

### Admin Jobs

Tournament review/grouping X until explicitly armed; X unless a named downstream job becomes eligible; X; Tournament review X until separately armed; Review scheduler X until separately armed

### Domain / other UI

Stages, capacities and group definition survive reopen; Upcoming list shows multiple dated sections with the same two definitions once each; Only role/mode/time-valid member, resource and runtime actions are visible; Only selected slot/stage changes RS or A to SR with stage-closed reason; Group members and changed score remain scoped to one slot/stage/group

### Manual status

MANUAL UI + FUNCTIONAL PASS; FIX VERIFIED

### Last manual date

2026-09-01

### Automated coverage

Consolidates EVENT-EDITOR-004, EVENT-SLOT-001, EVENT-SLOT-002, EVENT-SLOT-003, EVENT-SLOT-004; focused regression sources cover slot-owner leaderboard loading and same-ID generated/manual group overlay; running frontend/backend hot-deploy owner builds PASS

### Next manual oracle

Closed; proceed to EVENT-EDIT-RUNTIME-001. Retain definition/template/occurrence identity, unique group merge, stage Close and slot score/history as regression controls

### Result

PASS

### Evidence / notes

All five sources PASS. Save/reopen retained ordered Qualifier/Final definitions; save completion reloaded the mounted Sub Events list and six weekly occurrences remained identity-stable. Future host/participant menus were read-only and role/time gated. Clean Close changed one full slot runtime RS->SR/stage-closed with groupsCount 2->2, stable 7/4 scores, one EVENT_CHANGED recompute and no tournament review/group generation. EVENT-SLOT-004 returned Group A once with Nova/Riley, saved exactly one Nova +3 note under the September 1 slot for total 10/2 updates, retained Riley 4/1 and left the September 8 occurrence empty. Frontend snapshot slot scope, same-ID group overlay/counting, raw template _id fixture shape and list-card mode/slots/avatar projection defects were repaired. User confirmed the manual UI; independent API/Mongo oracles proved exact scope and side effects. All retained fixtures reset/not-staged.

### Manual QA priority

P0 98

## EVENT-EDIT-RUNTIME-001

### ID

EVENT-EDIT-RUNTIME-001

### Type

Consolidated journey

### QA domain

Event

### Area

Event creation, runtime view switching and active edit

### Scenario

Create one normal childless Draft through the UI; prove its root MAIN_EVENT; assign root Transport; save exactly two Slots and prove one slot-scoped MAIN_EVENT per Slot replaces the root view; isolate first-Slot Accommodation and second-Slot Supplies; remove both Slots and prove the same root MAIN_EVENT and Transport return; publish; edit capacity; execute scoped root-Transport Invite/Delete; then remove and reassign the Transport

### Statistics

INDIRECT after each owning create/edit/publish delta; every View/reload X

### Monitoring / Metrics

DELTA Event create/edit/publish and normal recompute; DELTA root MAIN_EVENT active -> D -> active on childless/two-Slot switching without identity replacement; DELTA independently scoped Slot resources; DELTA root resource assignment and scoped invite/delete write; every View/reload X

### Affinity Graph

INDIRECT only after documented owning Event/resource recompute

### Admin Jobs

DELTA normal Event recompute for changed Saves; other consumers conditional; scoped Invite/Delete and Remove/Reassign enqueue deduplicated Asset recomputes; no unchanged Event participation rewrite

### Domain / other UI

First Save shows one root MAIN_EVENT card; the two-Slot Save shows exactly one MAIN_EVENT in each Slot and no third root card; removing both Slots restores the original root document/record/sync identity and Transport; Publish and capacity 2/8 -> 2/9 preserve it; Event Members contains Casey Admin and Nova Member once each; root Transport occupancy 1/0-4 has no red badge; scoped Nova invite changes pending badge 0 -> 1 and Delete restores it to absent; Remove/Reassign changes accepted 1 -> 0 -> 1 across reopen/reload; no empty list, duplicate parent, global Asset member, synthetic :default child or tournament-only action

### Manual status

MANUAL UI + FUNCTIONAL PASS; FIX VERIFIED; CLOSED

### Last manual date

2026-09-02

### Automated coverage

Consolidates EVENT-EDITOR-005 and EVENT-RUNTIME-001. Existing backend/frontend regression sources cover childless materialization, empty enabled-collection canonicalization and per-Slot MAIN_EVENT mapping; existing MAIN_EVENT resource-scope controls passed. The running frontend/backend hot-deploy owner builds passed; no duplicate build or test process was launched beside the watchers.

### Next manual oracle

Closed. Preserve the captured post-create boundary only for the focused Delete replay; otherwise reset through the versioned harness before selecting the next Pair-QA testcase.

### Result

PASS

### Evidence / notes

Complete English checklist PASS through step 62. Casey created Event h1788317751991 through the UI and proved the root MAIN_EVENT, two independent Slot MAIN_EVENT scopes, isolated Accommodation/Supplies, then restoration of the same root runtime document 6a9790503071603425ae103d, recordId main-event:h1788317751991 and syncKey 0e21c605-865c-4e49-bd89-b5288cf3df82. Publish, fixture-provided accepted Nova membership, capacity 2/8 -> 2/9, Members and presentation checks passed. Root Transport invite/delete ended with one Casey accepted request/projection, no Nova pending request/projection or Transport member row, and accepted=1/pending=0/capacityMax=4. Remove at 05:38:05 deleted the accepted root request and saved the runtime; backend reads at 05:38:10 and 05:38:12 preceded reassign at 05:38:14, corroborating the user's step-57 reopen/reload PASS. Reassign restored exactly one root Transport; the final task completed at 2026-09-02T03:39:01.795480583Z with no error. Dev-only platform seed debounce is 15s while Java and production behavior remain unchanged.

### Manual QA priority

P0 100

## EVENT-LIFE-001

### ID

EVENT-LIFE-001

### Type

Checkpoint

### QA domain

Event

### Area

Event lifecycle

### Scenario

Unpublish active event to draft

### Statistics

INDIRECT lifecycle inventory delta

### Monitoring / Metrics

DELTA event lifecycle and recompute

### Affinity Graph

INDIRECT after recompute

### Admin Jobs

DELTA affinity recompute; reminders/attachments conditional

### Domain / other UI

Explore removes it; organizer Drafts/Hosting contains it once

### Manual status

MANUAL UI + FUNCTIONAL PASS

### Last manual date

2026-08-04

### Automated coverage

Lifecycle service coverage partial

### Next manual oracle

Retain as a lifecycle regression sample; reopen/refresh remain read-only X checks

### Result

PASS

### Evidence / notes

Casey unpublished h1785836388222 once. My Events retained one card, Drafts became 1, Mongo status became DR, time and organizer coordinates stayed unchanged, no member/invitation/outbox record appeared, and the held auto-inviter remained idle. Nova's invitation-only Explore boundary had already shown the event absent immediately before the transition.

### Manual QA priority

P0 92

## EVENT-LIFE-002

### ID

EVENT-LIFE-002

### Type

Checkpoint

### QA domain

Event

### Area

Event lifecycle

### Scenario

Trash one organizer event

### Statistics

INDIRECT active/trash inventory delta

### Monitoring / Metrics

DELTA lifecycle, recompute and conditional notification

### Affinity Graph

INDIRECT after recompute

### Admin Jobs

DELTA affinity recompute; auto-inviter becomes ineligible

### Domain / other UI

Only organizer Trash contains it; accepted participants lose active access without gaining personal Trash; active attachments and ticket affordances unavailable

### Manual status

MANUAL UI + FUNCTIONAL PASS; COUNTER FIX VERIFIED

### Last manual date

2026-08-13

### Automated coverage

Versioned fixture counter/creator-occupancy projection repairs; organizer-vs-participant Trash counter regression source; list-adapter error/empty regressions; full stored event-counter snapshot HTTP/store regression sources; guarded lifecycle baseline + terminal Trash verifier; existing dev frontend/backend owner builds PASS

### Next manual oracle

Closed. Retain the trashed identity and continue once with EVENT-LIFE-003 Restore; never replay Delete

### Result

PASS

### Evidence / notes

• Baseline staged 2026-08-13T19:44:57.209Z: public active QA EVENT-LIFE-002, Casey accepted Admin/owner, Nova accepted Member, canonical occupancy 2/8.• No ticket/payment/chat/lifecycle/recompute artifact existed; affinity and notification workers were terminal with pending 0.• FAIL before producer: reload showed no Casey My Events badge and /api/auth/me returned hosting/event counters 0; opening the popup alone patched the UI.• Root cause was fixture stage omitting the existing write-side event-counter projection, not SmartList or Trash behavior.• Guarded repair captured two reset snapshots and projected counters without changing event/SmartList. HTTP reload oracle now gives Casey hosting/event.hosting/event.all=1 and Nova events/event.active/event.all=1 with matching counterOverrides.• Focused reload replay PASS: closed-popup main badges were Casey My Events=1 and Nova Events=1; both opened lists contained the same event once.• Fixture occupancy defect repaired: creator/Admin is now included in the shared embedded projection; both already-open lists converged 1/8 -> 2/8 by normal popup poll without reload or SmartList change.• Backend preflight defect fixed: global organizer Trash no longer increments an accepted participant's personal Trash counter; explicit deleted memberships still do. Regression source added; owner hot deploy compiled/restarted successfully.• Exact action baseline captured 2026-08-13T20:16:21.233Z: A/public, Casey+Nova 2/8, Casey Hosting/All=1, Nova Active/All=1, lifecycle task/outbox/notification 0. One completed earlier read/location recompute is retained and excluded from Trash attribution.• NOT EXECUTED before producer: Codex's Java hot restart raced the continuous classes deletion wave, left /activities/events/filter unmapped and both open polls showed empty/zero. No Delete request or persisted delta occurred; this is not attributed to the user.• Correct-scope repair: DevTools restart is gated by a marker touched after successful classes; HTTP list failures remain errors while successful empty pages remain authoritative. SmartList was unchanged.• Focused recovery PASS: after restarting only the existing backend owner, Casey and Nova endpoints returned 200 with the same A/public 2/8 event; both already-open lists and badges recovered through normal poll without reload or interaction. The captured action baseline remained current.• Real producer PASS: Casey confirmed Delete Event once. Without reload, Casey My Events and Nova Active Events removed the card and active/hosting badges became zero. Final user verification accepted the deletion/counter branch as fully executed: Casey Trash=1 and the exact event appeared once.• Terminal verifier PASS at 2026-08-13T20:46:09.146Z: T/statusBeforeSuppression=A/post-baseline trashedAtIso; unchanged Casey Admin + Nova Member 2/8 audit rows; Casey Hosting/All/Trash=0/0/1; Nova Events/Active/All/Trash=0/0/0/0.• Exactly one completed Nova-only deleted lifecycle task, one unread event-deleted Notification Center row, one matching dev-mode pending Firebase outbox and one terminal EVENT_CHANGED recompute were attributable to the saved action baseline. Oracle now exposes canonical lifecycle flags/timestamp and the guarded verify-lifecycle-trash command.• Casey's organizer Trash UI and later fresh-bundle read both PASS: Trash=1 and exactly one QA EVENT-LIFE-002 card.• Nova's untouched Active foreground poll removed the card, but initially FAIL: inclusive All stayed 1 until switching to All returned no card and corrected the menu to 0. Persisted Active/All were already 0/0.• Proper-scope fix transports the complete stored write-side event snapshot on Java list pages through HTTP and frontend-local routes and applies it atomically; SmartList is unchanged. Runtime read oracle gives Nova All total0/full zeros and Casey Trash total1/trash1; both owner builds PASS. Final fresh-bundle Nova and Casey reconstructions passed and the user explicitly closed Activity Events counter as executed/PASS; no Restore replay remains required for this fix.• Nova Notifications New UI PASS: exact unread QA EVENT-LIFE-002 / The event was deleted. row was visible and not opened. Repeated guarded verifier at 2026-08-13T21:05:00.659Z retained exactly one row with empty readAtIso, one pending dev-mode outbox and no duplicate lifecycle effect.• Fresh-bundle Nova reconstruction PASS: after one reload, Events > All was empty and both the main Events and All red counters were absent, agreeing with persisted Active/All=0/0 without a corrective bucket switch.• Fresh-bundle Casey reconstruction PASS: Events > Trash showed counter1 and exactly one event. EVENT-LIFE-002 and its Activity Events counter repair are PASS/CLOSED.

### Manual QA priority

P0 96

## EVENT-LIFE-003

### ID

EVENT-LIFE-003

### Type

Checkpoint

### QA domain

Event

### Area

Event lifecycle

### Scenario

Restore one organizer event from Trash

### Statistics

INDIRECT restored inventory delta

### Monitoring / Metrics

DELTA lifecycle and recompute

### Affinity Graph

INDIRECT after recompute

### Admin Jobs

DELTA affinity recompute

### Domain / other UI

Preserved draft/active bucket returns with no duplicate members or resources

### Manual status

MANUAL UI + FUNCTIONAL PASS

### Last manual date

2026-08-14

### Automated coverage

Versioned direct Trash fixture; saved pre-Restore oracle; guarded terminal Restore verifier; HTTP and frontend-local restore implementations

### Next manual oracle

Closed. Advance the retained active identity once into EVENT-LIFE-004; never replay organizer Restore

### Result

PASS

### Evidence / notes

• Deliberate dev-stack seed reset removed the retained EVENT-LIFE-002 transaction; its closed Delete was not replayed. Guarded discard-stale plus direct EVENT-LIFE-003 staging produced T/statusBeforeSuppression=A, Casey Admin + Nova Member 2/8, Casey Trash1 and Nova Active/All/Trash0.• The first direct stage exposed a harness-only Nova Trash1 error. Counter reconstruction now treats organizer Trash as host/admin-only and keeps participant membership Trash separate; corrected baseline and Casey Trash UI both passed.• Saved pre-Restore oracle at 2026-08-14T11:13:29.545Z: exactly one event, two members, zero resources/tickets/lifecycle artifacts, Casey Trash1 and Nova Active/All/Trash0.• In-place PASS: Casey restored exactly once; the Trash card/counter disappeared and Nova saw the event through the normal foreground poll without reload.• Java write oracle PASS: same record/source/title became A/published, statusBeforeSuppression and trashedAtIso cleared; exact Casey Admin + Nova Member 2/8 remained; zero member/resource/basket/payment/ticket/chat/lifecycle notification/outbox duplication.• Counter delta PASS: Casey Hosting/My Events +1 and Trash -1; Nova Events/Active/All +1 and Trash unchanged0.• Fresh-bundle read-only PASS: Casey My Events and Nova Active/All each showed the same single event with no Trash counter. Reads created no second task.• Terminal verifier PASS at 2026-08-14T11:23:42.462Z: one coalesced task containing EVENT_CHANGED finished done at 11:23:06.324Z; unchanged cardinality events1/members2/resources0/tickets0.

### Manual QA priority

P0 94

## EVENT-LIFE-004

### ID

EVENT-LIFE-004

### Type

Checkpoint

### QA domain

Event

### Area

Event participation lifecycle

### Scenario

Participant leave and restore without organizer authority

### Statistics

INDIRECT participation delta

### Monitoring / Metrics

DELTA member mutation; event lifecycle X

### Affinity Graph

INDIRECT only if membership evidence changes affinity

### Admin Jobs

CONDITIONAL member recompute; organizer lifecycle job X

### Domain / other UI

Viewer Attending/Trash changes; canonical event stays active for others

### Manual status

MANUAL UI + FUNCTIONAL PASS

### Last manual date

2026-08-14

### Automated coverage

Java stored-counter regressions added; existing dev watcher compile/restart PASS; frontend-local Leave/Restore persistence path inspected

### Next manual oracle

Closed. Advance the retained active identity once into EVENT-LIFE-005; never replay participant Leave/Restore

### Result

PASS

### Evidence / notes

• Baseline: Casey Admin + Nova Member 2/8; Casey Hosting/All/Trash 1/1/0; Nova Active/All/Trash 1/1/0.• Original Leave UI passed but Java persisted Nova Trash0; later poll removed the badge. Exact failed state retained and root cause fixed in the canonical write-side counter projector, not SmartList/query code.• Corrected Leave PASS: same Casey canonical stayed A at 1/8; same Nova overlay/member became T/suppressed; Nova persisted Active/All/Trash 0/0/1; one member-left chat message; no organizer lifecycle artifacts.• Repeated filter/realtime polls retained Trash1. Nova fresh reload still showed badge1 and exactly one Trash card.• Final Restore PASS: same identities returned A/accepted with suppression cleared, occupancy2/8, Casey counters1/1/0 and Nova counters1/1/0; one member-joined message and correct per-user chat projections.• Final Casey My Events and Nova Active Events fresh DOM reads each showed exactly one 2/8 card and no Trash. One coalesced EVENT_MEMBERS_CHANGED task finished done at 2026-08-14T12:03:21.935Z with no error.• Frontend-local parity inspection found persisted viewer T record + user counter patch + IndexedDB flush already aligned; no local production change required.

### Manual QA priority

P0 96

## EVENT-LIFE-005

### ID

EVENT-LIFE-005

### Type

Checkpoint

### QA domain

Event

### Area

Event buckets

### Scenario

Open and refresh Hosting, Drafts, Attending, Invitations and Trash

### Statistics

X

### Monitoring / Metrics

X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Each identity appears only in its documented bucket; no writes occur

### Manual status

MANUAL UI + FUNCTIONAL PASS

### Last manual date

2026-08-14

### Automated coverage

Versioned full persisted snapshot oracle plus independent Casey/Nova DOM reads

### Next manual oracle

Closed. Stage EVENT-INV-001 independently; never replay these read-only branches

### Result

PASS

### Evidence / notes

• Casey organizer branch: My Events exactly one QA EVENT-LIFE-003 at 2/8; Drafts and Trash empty before/after reload; final DOM My Events1 with no Trash.• Nova participant branch: Active Events exactly one QA EVENT-LIFE-003 at 2/8; Invitations and Trash empty before/after reload; final DOM Active1 with no Trash.• The initial oracle stop was a harness-only undefined/null serialization mismatch for absent statusBeforeSuppression. Field-level diagnosis proved no product mutation; stable snapshot canonicalization fixed the comparison without changing fixture/browser state or replaying manual steps.• Terminal verifier PASS at 2026-08-14T12:22:09.765Z: Casey canonical + Nova overlay remain active 2/8 with counters 1/1/0/0 and 1/1/0/0; every tracked event/member/resource/basket/payment/ticket/chat/notification/task/runtime/user-counter collection is unchanged.

### Manual QA priority

P1 74

## EVENT-INV-001

### ID

EVENT-INV-001

### Type

Checkpoint

### QA domain

Event

### Area

Event membership

### Scenario

Owner/admin manually invites one controlled user

### Statistics

INDIRECT member activity

### Monitoring / Metrics

DELTA membership write and notification outbox

### Affinity Graph

INDIRECT after membership evidence/recompute

### Admin Jobs

Notification outbox conditional; scheduler X

### Domain / other UI

One pending Event Members row and one recipient invitation; pending invite creates no chat or chat-counter increment

### Manual status

MANUAL UI + FUNCTIONAL PASS

### Last manual date

2026-08-14

### Automated coverage

Versioned invitation action baseline, terminal Mongo oracle, authenticated Nova realtime response and focused DOM convergence replay

### Next manual oracle

Closed. Reset independently, then stage EVENT-INV-004; never repeat this Invite+Save producer

### Result

PASS

### Evidence / notes

• Casey invited Nova exactly once; Members converged in place to 1 accepted + 1 pending, with Nova once as Invitation Pending and Casey once as Admin.• Persisted terminal oracle proved pendingSource=admin, requestKind=invite, exact Casey-to-Nova unread invitation/outbox identities, Nova Invitations/All 1/1 and no unrelated domain/task artifacts.• Nova showed one notification and exactly one QA EVENT-INV-001 Invitations card at 1/8 with pending badge 1.• Apparent Chats1 was a stale browser snapshot loaded before fixture stage. Mongo and authenticated realtime both returned flat/nested chat zero and no chat record; popup-close convergence corrected it to zero, and Invitations reopen retained the exact card without chat.

### Manual QA priority

P0 94

## EVENT-INV-002

### ID

EVENT-INV-002

### Type

Checkpoint

### QA domain

Event

### Area

Pending invitation privacy and authorization

### Scenario

With owner, invited target and unrelated control isolated, inspect one pending invitation before acceptance through list and detail paths

### Statistics

X

### Monitoring / Metrics

X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Accepted-only controls, chat and resources are hidden; Firebase-authenticated direct/deep-link denial is external

### Manual status

MANUAL UI PASS; LOCAL EVENT GATE CLOSED

### Last manual date

2026-08-04

### Automated coverage

Local demo UI/privacy branch PASS; authenticated policy denial is owned by DEPLOY-FIREBASE-LIFECYCLE-001

### Next manual oracle

Closed locally; replay only the production-authenticated direct/deep-link denial as an assertion inside DEPLOY-EXTERNAL-CONFIG-001 section1 (DEPLOY-FIREBASE-LIFECYCLE-001)

### Result

PASS

### Evidence / notes

Riley opened the invitation and read-only event view. Fields were disabled; invitation-specific View, Accept and Reject actions were present; no event chat or participant resources were visible. Members remained visible because Open Event allows preview. The demo session cannot prove the production policy denial, so that one assertion moved to the production-like Firebase deployment journey and no longer gates Event. The Members screen separately exposed EVENT-MEMBER-CREATOR-001. No acceptance action belongs to this case.

### Manual QA priority

P0 100

## EVENT-INV-003

### ID

EVENT-INV-003

### Type

Checkpoint

### QA domain

Event

### Area

Event membership

### Scenario

Accept an owner/admin invitation once

### Statistics

INDIRECT membership and later chat deltas

### Monitoring / Metrics

DELTA accepted membership, resolved invitation and visibility-scoped acceptance notifications

### Affinity Graph

INDIRECT after membership recompute

### Admin Jobs

CONDITIONAL direct recompute/notification outbox; scheduler X

### Domain / other UI

Pending becomes accepted once; accepted recipient and Admin share the chat; pending control remains chat-denied and absent from the avatar stack but appears as the Sub-events Members pending badge; every visibility-authorized non-actor receives exactly one acceptance event notification

### Manual status

PASS / CLOSED

### Last manual date

2026-08-04

### Automated coverage

Backend hot-deploy green; invitation acceptance, event-chat and Open/Blind recipient regression sources; independent read-only membership, chat and notification oracle

### Next manual oracle

Closed. Continue participant-authored message delivery separately in CHAT-AUTH-001.

### Result

PASS

### Evidence / notes

Riley accepted exactly once; Casey and Riley share two owner copies with the same accepted member IDs; Nova remains pending and chat-denied. Exactly one join system row and zero chat-message notification artifacts exist. Casey and Nova each received one acceptance notification, Riley received none, and Riley's invite is read. UI confirmed no pending avatar +1 and Sub-events Members pending 1.

### Manual QA priority

P0 100

## EVENT-INV-004

### ID

EVENT-INV-004

### Type

Checkpoint

### QA domain

Event

### Area

Event membership approval

### Scenario

Ordinary accepted member invites a target; target responds, then Admin approves

### Statistics

INDIRECT only after terminal acceptance

### Monitoring / Metrics

DELTA target response remains pending; Admin approval creates accepted membership

### Affinity Graph

INDIRECT after terminal transition

### Admin Jobs

CONDITIONAL recompute/outbox; scheduler X

### Domain / other UI

Chat stays denied after the target response and appears only after terminal Admin approval

### Manual status

MANUAL UI + FUNCTIONAL PASS; FIX VERIFIED

### Last manual date

2026-08-14

### Automated coverage

Versioned invitation fixture, terminal Mongo/read oracle, three isolated browsers, fresh-bundle DOM/action-response proof, dev-watcher logs and terminal normal-worker oracle

### Next manual oracle

Closed; reset independently and continue EVENT-INV-005 without replaying Riley Accept or Admin Approve

### Result

PASS

### Evidence / notes

• Baseline accepted/pending 2/1: Casey accepted Admin, Nova accepted ordinary Member, Riley pending invite from Nova with pendingSource=member and requestKind=invite.• No event chat or chat counters exist for any actor. Riley Invitations/All is 1/1; Nova Active/All is 1/1; Casey Hosting is 1.• Fresh DOM baseline: Casey My Events1/Chats0, Nova Events1/Chats0, Riley Invitations1/Chats0. Riley's list contains exactly one QA EVENT-INV-004 card at 2/8 with pending1.• Riley Accept ran once: membership stayed pending and moved invite->approval; Riley Invitations/Pending changed 1/0->0/1, chat stayed zero, and Casey received one unread Admin join-request.• In-place controls: Casey card remains 2/8 pending1 with notification 3->4; Nova Events1/Chats0; Riley Invitations0/Chats0.• Casey Members action baseline is 2 members + 1 pending with Riley once Waiting For Admin Approval, Casey once Admin and Nova once accepted Member; the repeated read oracle is unchanged.• First Admin Approve persisted the exact accepted3/pending0, three-owner chat, one member-joined row, Chats1 for all and target-only approval notification/outbox; poll, reopen and refreshed Members reads passed.• Focused FAIL: Casey Chats stayed0 in the action-owning document while Members suppressed the side poll. Java returned only members although its write-side counters were correct.• Repair returns and atomically applies the canonical actor counter snapshot; HTTP hot-deploy compatibility and full frontend-local event/chat/counter plus later-poll parity are implemented.• Guarded replay at 13:56:35.748Z restored only the same Admin approval boundary: accepted/pending2/1, Riley pending approval, Chats0, exact-one retained join-request, zero chat and zero approval artifacts. Riley Accept remains proven and is not replayed.• The first repair replay used Casey's 13:06 pre-fix main.js and was NOT EXECUTED as fix evidence. A no-write endpoint probe returned members plus canonical Casey Chats1, proving Java response shape. All three existing documents were then reloaded after the 14:39 bundle sync and recaptured at shared Chats0.• Fixed replay PASS at 15:13:47Z: Casey's still-open Members document changed Chats0->1 from the approval response and reached 3 members immediately. The 17:14 screenshot shows Nova and Riley at Chats1; Riley also has the one approval notification.• Terminal oracle: accepted/pending3/0, three identical mainEvent owner copies all unread1, one Riley Outside joined the event system row, stored Chats/All/Event1 for all three, one Riley-only approval notification/outbox and zero chat-message notification artifacts.• Normal affinity worker completed the one EVENT_MEMBERS_CHANGED task at 15:19:45Z on attempt1 with empty lastError; the terminal oracle remained unchanged. Shared semantics intentionally gives every current member, including Riley, the same unread join event without special WebSocket or poll branches.

### Manual QA priority

P0 100

## EVENT-INV-005

### ID

EVENT-INV-005

### Type

Checkpoint

### QA domain

Event

### Area

Event membership edges

### Scenario

Reject, cancel, capacity-block and repeat acceptance independently

### Statistics

INDIRECT only for real state changes

### Monitoring / Metrics

DELTA per real mutation; no-op repeats X

### Affinity Graph

INDIRECT only for real state changes

### Admin Jobs

CONDITIONAL; duplicate tasks/outbox forbidden

### Domain / other UI

No duplicate member, overbooking, stale bell or rejected-user chat access

### Manual status

MANUAL UI + FUNCTIONAL PASS; FIX VERIFIED; CLOSED

### Last manual date

2026-08-14

### Automated coverage

Versioned invitation-full fixture, three fresh managed browser documents, exact demo-identity server replay and independent Mongo/read oracle

### Next manual oracle

Closed; never repeat branches A-D unless invitation capacity or idempotence contracts change

### Result

PASS

### Evidence / notes

• Branch A first attempt is NOT EXECUTED because the fixture staged capacity1 around Casey+Nova accepted plus Riley's reserved invite.• Riley Reject itself removed the live invitation and in-place Invitations badge while Chats stayed0; persisted accepted/pending became2/0 with Riley suppressed and zero chat/acceptance/approval notification artifacts.• The first normal embedded-member refresh normalized the impossible capacity1 to accepted2. This diagnosed a fixture defect, not a reject write defect.• Fixture repaired to the coherent full boundary: Casey+Nova accepted plus Riley's reserved final seat equals capacity3.• Repaired replay UI/write PASS at 15:40:50.696Z: the user confirmed in-place Invitations1->0 with Chats0; fresh Riley reconstruction shows Invitations0, Chats0 and the single personal Trash card.• Oracle retained capacity3, accepted/pending2/0, Casey+Nova exact accepted identities and only Riley suppressed from pending. Live pending/invited lists, chats/messages and invitation/acceptance/approval notifications/outbox are zero.• Normal worker PASS at 15:45:57.345Z: the one EVENT_MEMBERS_CHANGED task completed on attempt1 with empty lastError and pendingCount0; all state and zero-artifact controls remained unchanged.• Branch A PASS/CLOSED. Never repeat Riley Reject; reset independently before branch B.• Branch B first action at 15:51:50.195674866Z: Casey Members changed 2 members · 1 pending -> 2 members in place, Riley disappeared once, Riley Invitations1->0 live, Nova unchanged; capacity3 and Casey+Nova accepted persisted with Riley deleted and all chat/notification controls zero.• FAIL: zero EVENT_MEMBERS_CHANGED tasks were stored although cancelling the pending invite released its reserved final seat; the same path also skipped waitlist promotion.• Java write repair now routes the released seat through the waitlist and otherwise refreshes dependent slot/event projections plus recompute, while preserving zero ticket/chat. Main source compiled through the existing watcher; two focused regression tests were authored but no separate Gradle process was started because swap was full.• Repair replay baseline staged at 16:01:33.676Z and proved again by read-only status: capacity3, accepted/pending2/1, Riley final-seat invite, chats0 and zero tasks/artifacts. Same three managed documents reloaded and match Casey My Events1, Nova Events1, Riley Invitations1, all Chats0.• Branch C independent baseline staged at 17:27:14.493Z; post-stage Casey/Nova/Riley hard reloads and a later oracle prove capacity3, accepted/pending2/1 with Riley reserving the final seat and zero tasks/artifacts.• Casey read-only candidate query returned multiple selectable non-members; a repeated Mongo oracle proved the query itself performed no write. The actual picker shows Riley selected and Farkas Anna as the visible new candidate.• Branch C first write at 19:48:43+02:00 is server/write PASS but UX FAIL: Farkas Anna was rejected with unchanged capacity3 accepted/pending2/1 and zero tasks/artifacts, yet the picker closed silently.• Repair requires one shared HTTP/local invite outcome, frontend-local capacity parity, the existing confirmation dialog in actionless information mode, and matching versioned en/hu local plus Mongo translations.• Branch C repair hot-deployed: Java returns committed members plus typed invited/rejected outcomes; shared HTTP/local handling enforces reserved-seat capacity parity; the existing dialog has an actionless notice mode. Frontend watcher built20:05:23+02:00/synced20:05:26; live Mongo API returned en.55 and hu.55 with the expected capacity/generic keys. Regression tests authored but not separately run because the dev pipeline owns compilation and swap is full.• Branch C repaired replay READY: reset->not-staged then one stage at18:11:43.640Z; repeated statuses prove capacity3 accepted/pending2/1, Riley final-seat reservation and zero artifacts. Same documents hard-reloaded after bundle sync at Casey18:13:10.693Z, Nova18:13:13.525Z, Riley18:13:16.460Z; initial My Events/Events/Invitations are1 and all Chats0.• First repaired display content/write PASS but close-control FAIL: correct capacity title/message, no action row and unchanged zero-write oracle, but standard top-right close was missing. Shared dialog now reuses existing .popup-close only for notice mode; watcher built20:21:31/synced20:21:33 and Casey alone reloaded18:22:14.622Z. Replay only this no-write display without reset.• Standard-close replay write PASS but visual proof pending: exact capacity3 accepted/pending2/1 and all artifacts0, but the dialog was closed by the 18:23:40.879Z DOM inspection. Accept explicit user confirmation that the visible X closed it, otherwise repeat only the no-write display and leave it open; no reset.• Branch C terminal PASS/CLOSED: user explicitly confirmed the visible standard top-right X closed the notice; combined screenshot proves exact message/no footer actions, and terminal oracle proves capacity3 accepted/pending2/1 with every artifact0. Never repeat Branch C.• Branch D next: fresh reset/stage, Riley accepts once through UI, snapshot exact membership/chat/task/notification effects, then replay the identical authenticated join once and require changed=false with every count unchanged.• Branch D READY: staged18:31:33.042Z; two statuses prove capacity3 accepted/pending2/1 and zero chats/tasks/acceptance artifacts/payments. Same documents reloaded Casey18:32:11.813Z, Nova18:32:15.329Z, Riley18:32:19.418Z; initial My Events/Events/Invitations1 and Chats0.• Branch D first UI Accept PASS at18:35:47.091901466Z: exact Casey+Nova+Riley accepted3/pending0, Riley Events1/Chats1/card3/3, unchanged Casey/Nova documents each Chats1. Fingerprint chat projections3, member-joined1, task1 id6a7f6003ae56910e99a48529, acceptance notifications2/outbox1, payments/basket0.• Raw replay18:38:34.950Z NOT IDEMPOTENCE EXECUTION / orchestration error: missing X-App-Session-Kind and X-Demo-User-Id authenticated the configured default member bf057de7c586eede7e84bdc7, creating that different actor's waitlist row. Preserve prior UI PASS, reset contamination, replay server pair with exact Riley headers; no user repeat.• Clean Riley server pair: first18:43:38.889Z recreated fingerprint; identical second18:44:10.885Z changed no persisted field/count but response incorrectly changed=true with counterDelta null. Common Java mapper now uses mutationApplied; regressions authored, watcher BUILD SUCCESSFUL/restarted20:45:47.587. Replay only response without reset.• Post-fix no-op18:47:37.568Z PASS: HTTP200 accepted changed=false counterDelta null; accepted3/pending0, Riley timestamp18:43:38.772815972Z, chat3/message1/task1 same id/availability, notifications2/outbox1, payments/basket0. Only terminal original-task read remains; no more joins.• Terminal worker PASS/CLOSED: task6a7f61daae56910e99a48530 done18:49:15.677199764Z attempt1/error-empty, pendingCount0; final membership/chat/notification/payment fingerprint unchanged. EVENT-INV-005 all branches PASS/CLOSED.• Java repair replay at 16:06:13.505868724Z PASS: one EVENT_MEMBERS_CHANGED task, completed 16:12:08.607775317Z attempt1/error-empty; capacity3, accepted/pending2/0 and every chat/notification control zero.• UI FAIL: event-card pending badge did not update from the action signal and only a later poll repaired it. Root cause was the common Activities consumer discarding membership sync while Event Editor was open. The absolute/idempotent sync is now always applied under stacked surfaces; no action-specific or Smart List poll branch was added. Existing frontend watcher built successfully in 7.612s.• The 16:13:41.562Z replay lineage is NOT EXECUTED because the reload boundary was not yet proven; no Delete occurred and the fixture was reset.• Current baseline staged 16:18:50.026Z and re-proved by read-only status: capacity3, accepted/pending2/1, Riley pending admin invite from Casey, chats0 and zero tasks/artifacts. All three existing documents were hard reloaded with cache/service-worker bypass; new time origins are Casey16:19:57.407Z, Nova16:19:55.167Z and Riley16:19:53.108Z.• Hard-reloaded replay at 16:54:18.515456561Z UI FAIL: Members/write succeeded but the event-card pending badge remained1 about ten seconds after Delete. Terminal Java oracle still PASS: one task done 16:59:28.940091047Z attempt1/error-empty, capacity3 accepted/pending2/0 and zero chat/notification controls.• Live Angular proof: membership signal already had pendingMembers0, but the common Activities consumer looked only in an empty EventsService cache and silently returned the stale row; the server-backed Smart List source held the complete capacity3 DTO. The consumer now resolves and re-caches that source, preserves known capacity and has a direct card fallback. No Delete-specific or poll/query branch changed. Existing watcher built/synced at 17:06:56Z; focused regression tests authored but not separately run with full swap.• Source-fallback replay baseline staged17:09:30.775Z and second status proves capacity3 accepted/pending2/1, Riley pending admin invite, chats0 and zero tasks/artifacts. Same three documents hard reloaded with repaired bundle at time origins Casey17:10:01.546Z, Nova17:10:01.160Z, Riley17:10:01.022Z; initial counters My Events1/Events1/Invitations1 and Chats0.• Final action17:17:47.400237969Z immediate UI/write PASS: Casey same document (origin17:17:39.954Z before action) has action-time signal pending0, row/source pending0 and capacity3, DOM 2/3 without red pending number; Riley unchanged document Invitations0 and Nova unchanged Events1. Oracle capacity3 accepted/pending2/0, Riley deleted, zero chat/notification controls, exactly one task.• Branch B worker terminal PASS/CLOSED at17:23:40.030663919Z: task done attempt1/error-empty, worker pendingCount0, capacity/members and every zero-artifact control unchanged. Never repeat Casey Delete; reset before independent capacity branch.

### Manual QA priority

P0 98

## EVENT-INV-006

### ID

EVENT-INV-006

### Type

Checkpoint

### QA domain

Event

### Area

Event acceptance notification privacy

### Scenario

Accept equivalent invitations in one Open and one Blind event

### Statistics

INDIRECT membership delta

### Monitoring / Metrics

DELTA one acceptance event notification per visibility-authorized non-actor recipient; system-chat notification X

### Affinity Graph

INDIRECT after membership evidence/recompute

### Admin Jobs

CONDITIONAL direct recompute/notification outbox; scheduler X

### Domain / other UI

Open notifies Admin plus visible pending control; Blind notifies Admin only; actor never receives own acceptance; each chat has one join row and zero system-derived chat notifications

### Manual status

PASS / CLOSED

### Last manual date

2026-08-14

### Automated coverage

Backend and local Open/Blind recipient tests added; system-chat notification regression added; backend dev-profile hot reload PASS with 15s member-change debounce while production remains 5m

### Next manual oracle

Closed; repeat only after acceptance recipient visibility, Blind member visibility, join-system-message notification suppression or affinity task scheduling changes

### Result

PASS

### Evidence / notes

• Open: Riley accepted; Casey and visible pending Nova alone received the acceptance row; Riley received none.\n• Blind used a role-equivalent actor/control swap: Nova accepted; Casey alone received the row; actor Nova and hidden pending Riley received none.\n• UI and oracle agreed; both event chats contain one member-joined row and zero chat-message notifications.\n• Both event-scoped recompute tasks completed exactly once with empty error and unchanged accepted2/pending1 fingerprints.\n• Dev member-change debounce is now 15s to avoid the production five-minute wait during manual QA.

### Manual QA priority

P0 100

## EVENT-FEEDBACK-001

### ID

EVENT-FEEDBACK-001

### Type

Checkpoint

### QA domain

Event

### Area

Event feedback

### Scenario

Cross the feedback eligibility boundary

### Statistics

X

### Monitoring / Metrics

DELTA exact persisted users.activities.feedback and eventFeedback.pending at the eligibility write; popup/menu reads X

### Affinity Graph

X

### Admin Jobs

CONDITIONAL bounded due-event worker materializes the eligibility transition once; repeated pass X

### Domain / other UI

Accepted non-admin participant sees one pending item only after start plus two hours; the independently reloaded profile menu shows the same actionable count

### Manual status

MANUAL UI + FUNCTIONAL PASS; MENU BADGE DEFECT FIXED

### Last manual date

2026-08-05

### Automated coverage

Focused UserActivityCountersService and EventCounterExpiryService eligibility/idempotence tests PASS; status oracle prints the exact main counter, four buckets and tracking markers

### Next manual oracle

On any eligibility-policy change compare accepted participant against locked, trashed, admin and pending controls; require feedback=1 with ownEvents/pending/feedbacked/removed=0/1/0/0 before opening the popup

### Result

PASS

### Evidence / notes

The popup showed exactly one eligible event and excluded the start+2h locked, trashed, admin and pending-member controls. The initial reload exposed a missing profile-menu badge because eligibility was computed only by the read projection. The fix materializes the transition through the existing bounded worker and owner service, with no frontend delta and no menu/popup recomputation. After hot deploy, reload independently showed red badge 1. Read-only Mongo proof: users.activities.feedback=1, eventFeedback ownEvents=0 pending=1 feedbacked=0 removed=0, exactly one eligible/counterTracked state, and the due source marked projected. The reusable checkpoint oracle now prints these exact values.

### Manual QA priority

P0 90

## EVENT-FEEDBACK-002

### ID

EVENT-FEEDBACK-002

### Type

Checkpoint

### QA domain

Event

### Area

Event feedback

### Scenario

Submit controlled event feedback responses with an optional event opinion

### Statistics

DELTA event feedback activity after snapshot

### Monitoring / Metrics

DELTA feedback telemetry, counters and outbox

### Affinity Graph

INDIRECT after target-user recompute

### Admin Jobs

DELTA affinity recompute; first-submit outbox

### Domain / other UI

Before submit, Activities Event card, feedback-list card and feedback form use the same persisted image on both backend HTTP and frontend local/demo paths; when image is empty all three use neutral placeholders with no runtime stock photo. The first event page accepts an optional event opinion up to 160 characters. View my feedback and the organizer received view show that opinion separately from any note to organizer; submitted item and recipient notification agree

### Manual status

PASS / CLOSED

### Last manual date

2026-08-05

### Automated coverage

Feedback submit service coverage; empty-image list/detail regressions added; event-opinion persistence/limit/view regressions authored but not separately run; backend and frontend hot-deploy compilation passed

### Next manual oracle

Closed; do not repeat unless the feedback counter contract changes

### Result

PASS

### Evidence / notes

Browser and stored oracle passed with one event and two accepted participant responses: Casey main Feedback=2 and Own Events=2, one Own Events card remained with response badge 2, and the existing auto-poll refreshed Casey without reload. Persisted state had two submitted viewers and three card answers; event membership remained exact 3/8 and the previously proven image/opinion/notification paths remained intact.

### Manual QA priority

P0 96

## EVENT-FEEDBACK-005

### ID

EVENT-FEEDBACK-005

### Type

Checkpoint

### QA domain

Event

### Area

Event feedback metadata

### Scenario

Save and reopen one participant note to the organizer

### Statistics

X

### Monitoring / Metrics

INDIRECT received-feedback counter refresh only

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Add/Edit note remains available after feedback submission. The exact note persists in feedback state; View my feedback and the organizer received view show it separately from the event opinion; participant answers and profile traits remain unchanged

### Manual status

PASS / CLOSED

### Last manual date

2026-08-05

### Automated coverage

Feedback note access tests partial; submitted-card note action and separate viewer fields added

### Next manual oracle

Closed; do not repeat unless organizer-note persistence or rendering changes

### Result

PASS

### Evidence / notes

Add note and Edit note worked after submission. Nova's View my feedback and Casey's received-feedback view showed organizerNote `cyxcyxcxy-t` separately from the structured answer. The read-only oracle proved the answer and counters unchanged at Casey 1/1 and Nova feedbacked=1, with zero recompute, notification and outbox effects.

### Manual QA priority

P1 72

## EVENT-FEEDBACK-006

### ID

EVENT-FEEDBACK-006

### Type

Checkpoint

### QA domain

Event

### Area

Event feedback lifecycle

### Scenario

Remove and restore one pending feedback item before submission

### Statistics

X

### Monitoring / Metrics

DELTA exact feedback pending/removed buckets; answers and outbox X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

The same event moves Pending -> Removed -> Pending; participant feedback/pending/feedbacked/removed changes 1/1/0/0 -> 0/0/0/1 -> 1/1/0/0 while Casey Own Events stays 1

### Manual status

MANUAL UI + FUNCTIONAL PASS

### Last manual date

2026-08-05

### Automated coverage

Checkpoint harness stages one eligible and counterTracked pending state with exact persisted participant and host counters

### Next manual oracle

Repeat only after feedback state, bucket or counter policy changes; retain the same no-answer and no-side-effect controls

### Result

PASS

### Evidence / notes

Nova UI proved the retained title/image moved once from Pending to Removed, Pending emptied and Removed became 1, then Restore emptied Removed and returned the same card once to Pending. Read-only oracles proved Casey feedback=0 ownEvents=1 throughout; Nova changed exactly 1/1/0/0 -> 0/0/0/1 -> 1/1/0/0; state removed false -> true -> false with submittedAtIso empty and organizerNote empty; answers, affinity tasks, notifications and outbox stayed empty. Add organizer note remains the separate EVENT-FEEDBACK-005 checkpoint.

### Manual QA priority

P0 94

## EVENT-IMPRESSION-001

### ID

EVENT-IMPRESSION-001

### Type

Checkpoint

### QA domain

Event

### Area

Profile Impressions

### Scenario

Observe target profile after controlled event feedback

### Statistics

X

### Monitoring / Metrics

INDIRECT normal user-realtime snapshot only

### Affinity Graph

INDIRECT because feedback submit queued target recompute

### Admin Jobs

X

### Domain / other UI

Correct Host or Attendee trait evidence changes; unrelated user and section remain unchanged

### Manual status

PASS

### Last manual date

2026-08-05

### Automated coverage

Two focused HomeUserProfileService regressions plus retained manual retest

### Next manual oracle

Retain initial failure, mandatory impressions payload, Casey target result and Nova post-poll/reopen control

### Result

PASS

### Evidence / notes

PASS-after-fix: Casey Host gained Creative Soul 18%; backend now always sends impressions and uses stable eventFeedback lifecycle; Nova 56/24/15 control survived poll and close/reopen

### Manual QA priority

P0 94

## EVENT-IMPRESSION-002

### ID

EVENT-IMPRESSION-002

### Type

Checkpoint

### QA domain

Event

### Area

Profile Impressions

### Scenario

Open a non-zero Impressions Feedback tile and observe UI acknowledgement plus authoritative poll reconciliation

### Statistics

X

### Monitoring / Metrics

INDIRECT normal user-realtime snapshot only

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Stored Feedback badge may hide immediately on tile open and return with the same value on the next poll; no feedback mutation occurs

### Manual status

PASS / CLOSED

### Last manual date

2026-08-05

### Automated coverage

Manual checkpoint captured

### Next manual oracle

Closed; retain the separate 1 -> hidden -> 1 acknowledgement cycle unless the counter or polling contract changes

### Result

PASS

### Evidence / notes

Nova badge was 1, disappeared immediately on tile open and returned as 1 on the next realtime poll. This is the accepted UI acknowledgement cycle; no feedback was submitted, removed or otherwise mutated.

### Manual QA priority

P0 95

## EVENT-CHECKOUT-001

### ID

EVENT-CHECKOUT-001

### Type

Checkpoint

### QA domain

Event

### Area

Event Explore Stripe checkout and Cash-only control

### Scenario

From Event Explore traverse paid review, resumable basket, Cancel and one successful Stripe payment, then compare free, approval-required and waitlist action states

### Statistics

INDIRECT one Event participation delta after successful Stripe payment; draft/cancel/summary reads X

### Monitoring / Metrics

DELTA one basket/payment/membership chain for success and one closed Cancel audit; every reload/summary read X

### Affinity Graph

INDIRECT only after accepted membership evidence/recompute

### Admin Jobs

CONDITIONAL normal member/chat/affinity/outbox and simulator callback work for the selected demo branch

### Domain / other UI

Fresh paid: Book Event -> Join -> Stripe card/Payment; saved pre-pay: Continue booking plus Back/Cancel payment/Payment; assign orders selectable cards before provider-mismatched Reconnect cards and Expired cards, which remain unselectable while their badge menus remain usable without closing checkout; provider-change response names and carries the current provider, updates the open provider badge directly with no second request, and retains the selected card under a static Update needed badge; success: one accepted Activity Events Active/All row with View Event, Payment summary and Leave Event; free/approval/waitlist controls never expose Payment in an ineligible state; no freeze, duplicate popup, payment, membership, chat or counter

### Manual status

PASS / CLOSED

### Last manual date

2026-09-06

### Automated coverage

User-controlled 81-step journey, named rollback checkpoints and final persisted oracle; backend/frontend hot-deploy builds passed; Watchlist visibility and recipient-scope regression specifications added

### Next manual oracle

Closed; repeat only after further Event checkout, payment, multi-Slot participation, Watchlist availability or leave-notification behavior changes

### Result

PASS

### Evidence / notes

All UI blocks passed. Final oracle retained exactly two authorized joined Stripe payments and no active basket, left Casey as the sole root/Slot member with one free place in each Slot, removed Nova/Riley membership and Watchlist state, and proved the expected availability/member notifications, outbox rows and two voluntary-leave chat messages exactly once. The later extra Add-to-watchlist action was isolated and cleaned through the versioned fixture before the final PASS. The accepted post-close copy/privacy follow-up uses left for self-leave, neutral new-spot copy, hides no-longer-visible watched Events, rejects hidden-event Watchlist writes/availability notices and sends generic republish or public-definition-change notifications only to outside watchers who can still view the Event.

### Manual QA priority

P0 100

## EVENT-TICKET-001

### ID

EVENT-TICKET-001

### Type

Checkpoint

### QA domain

Event

### Area

Event ticketing

### Scenario

Enable ticketing and reopen the event

### Statistics

INDIRECT event definition delta

### Monitoring / Metrics

DELTA event save and recompute

### Affinity Graph

INDIRECT after recompute

### Admin Jobs

DELTA affinity recompute; ticket scheduler X

### Domain / other UI

Reopened draft editor retains ticketing without role changes; participant ticket projection is not expected before publish

### Manual status

PASS / CLOSED

### Last manual date

2026-08-06

### Automated coverage

Ticket sync/service tests

### Next manual oracle

Closed; repeat only after event ticketing persistence or shared event-counter projection changes

### Result

PASS

### Evidence / notes

Fixture counter projection was corrected first: Casey My Events stayed at 1 and the event survived repeated polls. Casey then unpublished for editing, enabled Ticketing, saved once and reopened with Ticketing On. The preferred canonical state was DR with ticketing=true; Casey remained accepted Admin, Nova accepted Member, and exactly one event recompute followed the save. Publish-to-participant-overlay and credential issue/reuse remain isolated in EVENT-TICKET-002.

### Manual QA priority

P0 92

## EVENT-TICKET-002

### ID

EVENT-TICKET-002

### Type

Checkpoint

### QA domain

Event

### Area

Event ticketing

### Scenario

Publish Ticketing On through the real UI path and create one accepted-participant physical ticket while retaining a pending control

### Statistics

X

### Monitoring / Metrics

DELTA publish-owned event/ticket projection; Ticket reads X

### Affinity Graph

INDIRECT after publish recompute

### Admin Jobs

DELTA only for publish recompute; Ticket reads X

### Domain / other UI

Fixture and UI stay 2 / 8 for Casey accepted Admin plus Nova accepted Member with Riley pending; reset restores all three users-table ticket counters to zero; publish creates one Nova EventTicket status A; Casey and Riley get no ticket/counter; two Ticket opens read one stable event/holder/code; managed large URL renders through medium.webp

### Manual status

PASS / CLOSED

### Last manual date

2026-08-06

### Automated coverage

EventTicketServiceTest + EventParticipationTicketServiceTest PASS; lifecycle publish regression added; hot-deploy BUILD SUCCESSFUL; persisted pre/post-read oracle; nginx medium.webp HTTP 200

### Next manual oracle

Closed; retain the Previous-filter/reload observation and repeat only after publish issuance, ticket-read purity, users-table counters or Ticket filter initialization changes

### Result

PASS

### Evidence / notes

After removing the earlier read-side Admin issuance defect, the corrected 2 / 8 plus Riley-pending retest exposed and fixed a separate lifecycle publish() omission. The final real publish created exactly one Nova A ticket and users counters 1 / 1; Casey Admin and pending Riley remained ticketless at 0 / 0; membership stayed 2 / 8 plus pending 1 and recompute count was one. Ticket reads/reload preserved id 6a7415d366fe4ab1cd12e373, code and issuedAt without writes; medium.webp returned 200. The first open retained Previous and was empty; reload reset Upcoming and displayed the ticket, recorded as a filter/reload observation rather than lifecycle failure.

### Manual QA priority

P0 100

## EVENT-TICKET-POLL-001

### ID

EVENT-TICKET-POLL-001

### Type

Checkpoint

### QA domain

Event

### Area

Event ticket live refresh

### Scenario

Prove foreground Ticket-popup convergence, then close it and prove the background side-menu poll resumes after Unpublish

### Statistics

X

### Monitoring / Metrics

INDIRECT shared frontend ActivityStore counter signal; persisted users counters remain write-owned

### Affinity Graph

X

### Admin Jobs

X for polls; DELTA one normal recompute for publish and lifecycle revocation/counter refresh for unpublish

### Domain / other UI

Phase 1: from Casey/Nova accepted 2 / 8 plus Riley pending and zero tickets, the already-open Upcoming list gains exactly one Nova A ticket and Ticket changes 0 -> 1 within one 30-second foreground interval without reload/oscillation. Phase 2: close the popup, leave Nova side menu open and Casey Unpublish; within one background interval Events and Ticket both change 1 -> 0, the physical ticket changes A -> D, Ticketing remains configured On in draft, and Riley remains pending/ticketless

### Manual status

PASS / CLOSED

### Last manual date

2026-08-06

### Automated coverage

Shared UiPollCoordinator plus ActivityStore Ticket signal regressions; frontend hot-deploy compilation PASS; backend unpublish A-to-D regression; persisted phase-2 oracle PASS

### Next manual oracle

Closed; repeat only after shared poll ownership, ActivityStore ticket signal, unpublish revocation or users-table counter refresh changes

### Result

PASS

### Evidence / notes

Phase 1 UI converged open Ticket list/counter 0 -> 1. Phase 2 closed the popup and the resumed side-menu poll changed Events/Ticket 1 -> 0 without reopen/reload. Oracle at 2026-08-06T06:08:58.365Z proved DR + Ticketing On, Nova ticket 6a741f2e66fe4ab1cd12e39b status D, exact 2 / 8 plus Riley pending, and all controlled ticket counters 0 / 0.

### Manual QA priority

P0 100

## EVENT-TICKET-003

### ID

EVENT-TICKET-003

### Type

Checkpoint

### QA domain

Event

### Area

Event ticketing

### Scenario

Physical-phone Admin QR check-in through ADB localhost tunnel

### Statistics

INDIRECT check-in counter only if documented

### Monitoring / Metrics

X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Every clean stage/new ticket has a different server-style UUID-v4 QR; one app-menu Kamera be/ki toggle owns stream state; manual Off stops tracks and shows white/red X; valid scan stops the stream and retains the recognized frame; Member/Manager/Admin is an avatar-under contextual badge while the event title is unprefixed; first scan succeeds once while repeat, invalid and unauthorized scans do not mutate

### Manual status

PASS / CLOSED

### Last manual date

2026-08-06

### Automated coverage

Ticket check-in service tests, scanner-store pause regression, ticket-scan role-layout converter regression and persisted first/repeat oracle

### Next manual oracle

Closed; repeat only after physical scanner, ticket-use CAS, role rendering or rejection-path changes

### Result

PASS

### Evidence / notes

Final clean physical-phone run used the fresh random QR exactly once at 10:16:50.744525385Z by Casey and retained status A. Two saved-QR replays returned already used while preserving the original use. Invalid and unauthorized no-op paths retain automated service coverage; replay audit/warning behavior is closed separately in EVENT-TICKET-010.

### Manual QA priority

P0 98

## EVENT-TICKET-004

### ID

EVENT-TICKET-004

### Type

Checkpoint

### QA domain

Event

### Area

Event ticketing lifecycle

### Scenario

Prove physical ticket A/D audit history across Unpublish and a later republish

### Statistics

INDIRECT lifecycle delta owned by the event mutation

### Monitoring / Metrics

DELTA event lifecycle/recompute; ticket reads X

### Affinity Graph

INDIRECT after event recompute

### Admin Jobs

DELTA only for the owning lifecycle mutation

### Domain / other UI

Unpublish retains the old ticket as D even while Ticketing stays configured On in draft; republish creates a new A object with new id/code/issuedAt and exactly one active ticket remains

### Manual status

PASS / CLOSED

### Last manual date

2026-08-06

### Automated coverage

EventTicketService focused A/D lifecycle coverage including draft revocation; persisted Unpublish, revoked-scan and Republish oracles PASS

### Next manual oracle

Closed; repeat only after physical ticket publish/revocation sync changes. Republish notification/poll delivery is separated into EVENT-NOTIFICATION-001

### Result

PASS

### Evidence / notes

Republish retained the original used D ticket/code and created exactly one new unused A object 6a74645b7c85995dcf3955eb with different code TKT-942126c0-4c90-44b0-8017-baf5c0810a82 and issuedAt 2026-08-06T10:39:23.880809028Z. Nova ticket counters returned to 1/1; membership stayed 2/8. Missing available-again notification does not invalidate this physical-object lifecycle result.

### Manual QA priority

P0 100

## EVENT-TICKET-005

### ID

EVENT-TICKET-005

### Type

Checkpoint

### QA domain

Event

### Area

Event ticket join approval

### Scenario

Discover a Public event in Explore; prove repeated Join/Cancel signal removal, visible-basket reload retention and terminal admin-approval ticket ownership

### Statistics

INDIRECT Join/cancel/approval counter deltas

### Monitoring / Metrics

DELTA pending Join membership; every Cancel emits one ID-scoped activity removal; re-Join reopens only that pending request; approval owns physical ticket, users-table counter creation and terminal closure of the current basket reservation

### Affinity Graph

INDIRECT after Join/cancel/approval recompute

### Admin Jobs

DELTA only for owning Join, cancel and approval writes; separate Pending/Cancelled admin notification intents; Explore/Ticket reads X

### Domain / other UI

• Baseline/Join: Casey-only baseline; Nova Join creates one member-origin pending request, one physical approval-pending basket, one Casey Pending notification and zero tickets.• Pending reload: the Public Explore card and orange Continue booking survive from the visible basket without writes.• Each Cancel: in-place Continue booking -> Request Join and ID-scoped Activity removal; one reload reconstructs the same fresh state while retaining a closed basket audit.• Re-Join: appends a distinct physical basket and leaves all prior audits immutable.• Terminal approval: directly accepts Nova, creates one A ticket/counters 1/1 and closes the current basket reservation without changing prior Cancel audits; Casey/Riley stay ticketless.• Ticket reads: normal poll exposes counter 1 and two opens reuse the same Nova ticket ID/code.

### Manual status

PASS / CLOSED; TWO REPAIRS VERIFIED

### Last manual date

2026-08-12

### Automated coverage

• PASS: all three Join identities and both Cancel in-place/reload branches.• PASS: approval membership, occupancy, ticket identity and counters.• FAIL retained: terminal approval basket-closure oracle.• UPDATED: active-slot-only basket finalizer and acceptance-before-ticket ordering source regressions; backend/frontend hot deploys PASS.• BASELINE PASS: reset -> not-staged -> fresh stage -> independent Casey-only oracle; managed actors relaunched and identity-verified.• REPLAY FIRST JOIN PASS: one active basket 6a7c9fdbf8a7d3829acd8028, one pending membership/notification, zero tickets/counters.• PENDING RELOAD PASS: Continue booking retained; basket/membership/notification identities and timestamps unchanged; no ticket write.• FIRST CANCEL IN-PLACE PASS: Request Join appeared without reload; basket 6a7c9fdbf8a7d3829acd8028 closed as cancelled/deleted and inactive; Nova pending 0/trash 1; Casey Pending then Cancelled; tickets/counters 0/0.• FIRST POST-CANCEL RELOAD PASS: Request Join reconstructed; closed audit, membership, notification identities/timestamps and zero ticket state remained unchanged.• FIRST RE-JOIN PASS: distinct active basket 6a7ca1dcf8a7d3829acd8030 appended; first audit immutable; Nova pending 1; Casey Pending/Cancelled/Pending; tickets/counters 0/0.• SECOND CANCEL IN-PLACE PASS: Request Join appeared without reload; both basket attempts are distinct closed audits; Nova pending 0/trash 1; Casey Pending/Cancelled/Pending/Cancelled; tickets/counters 0/0.• SECOND POST-CANCEL RELOAD PASS: Request Join reconstructed; both audits/timestamps, membership, four notifications and zero ticket state remained unchanged.• FINAL JOIN PASS: third distinct active basket 6a7ca61cf8a7d3829acd8035 appended; older audits immutable; Nova pending 1; Casey has five ordered notifications; tickets/counters 0/0.• TERMINAL APPROVAL PASS / REPAIR VERIFIED: Nova accepted 2+0/8; one A ticket 6a7ca6ddf8a7d3829acd8038 / TKT-be2fc931-af92-47f8-83ad-0cefc4c1d416; counters 1/1; third basket approved/succeeded/inactive; two Cancel audits immutable.• NORMAL TICKET POLL FAIL: repeated successful realtime responses carried tickets 1/asset.tickets 1, but an open Explore popup caused the frontend to discard the snapshot and Ticket showed no item badge.• UPDATED: popup-visible global counters now converge without advancing deferred profile/impressions cursor; per-user revision tokens reject stale pre-mutation poll responses; watcher build PASS.• FOCUSED REPLAY BASELINE PASS: reset -> not-staged -> fresh stage -> independent Casey-only oracle; managed actors replaced with new bundle and identities verified; prior clean Cancel/reload/re-Join evidence retained.• FOCUSED REPLAY JOIN PASS: POST join 200; basket 6a7ca9c2f8a7d3829acd8039 is the one active approval-pending attempt; Nova pending 1, Casey Pending 1, tickets/counters 0/0.• FOCUSED APPROVAL/POLL PASS: action POST 200; Nova accepted 2+0/8; basket approved/succeeded/inactive; one A ticket 6a7cab4ef8a7d3829acd803f, counters 1/1; repeated normal polls exposed item-level Ticket 1 while Explore/join-review stayed open.• FIRST TICKET READ PASS: GET /api/assets/tickets 200 at 19:24:09; persisted ticket ID/code, issue/use state and counters remained unchanged with no second credential or domain write.• SECOND TICKET READ PASS: GET /api/assets/tickets 200 at 19:29:16; DOM showed one ticketed event/QA card; final oracle retained the exact sole ticket ID/code/status/issuedAt and counters without writes.

### Next manual oracle

Closed; proceed to EVENT-TICKET-006. Repeat only after Join/Cancel basket identity, approval finalization, realtime counter synchronization or Ticket-read ownership changes.

### Result

PASS

### Evidence / notes

• Historical basket-ID FAIL retained; its new-identity fix is verified.• Approval POST 200: Nova accepted at 2+0/8; one A ticket 6a7c9b3ff8a7d3829acd8013 / TKT-7b0475a4-136d-427c-beb8-b99bccb66fa6; Nova counters 1/1, Casey 0/0.• Terminal basket-closure FAIL: current basket 6a7c996af8a7d3829acd8007 stayed approval-pending/pending with reservationActive true; both earlier Cancel audits stayed closed.• Owning-domain and local-parity fixes are hot-deployed; source regressions added without a separate build/test process.• Fresh replay baseline independently proved Casey-only 1+0/8 with no Nova membership/basket/notification/ticket; three managed actors replaced and verified.• First replay Join PASS: basket 6a7c9fdbf8a7d3829acd8028 is approval-pending/pending active; Nova pending 1, Casey Pending rows 1, tickets/counters 0/0.• Pending Explore reload PASS: same basket ID and exact timestamps; same pending membership/notification; Continue booking retained; zero writes/tickets.• First Cancel in-place PASS: same basket is now cancelled/deleted inactive at 2026-08-12T16:35:47.888144723Z; Nova is suppressed at pending 0/trash 1; Casey has exactly Pending then Cancelled; tickets/counters remain 0/0.• First post-Cancel reload PASS: same closed basket timestamps and state, suppressed membership, two Casey notification identities and 0/0 tickets/counters were unchanged.• First re-Join PASS: new active basket 6a7ca1dcf8a7d3829acd8030 appended without mutating first audit; pending membership/occupancy restored; Casey order Pending/Cancelled/Pending; tickets/counters 0/0.• Second Cancel in-place PASS: second basket closed at 2026-08-12T16:41:18.371454648Z while first audit stayed unchanged; Nova pending 0/trash 1; Casey has four ordered notification rows; tickets/counters 0/0.• Second post-Cancel reload PASS: both closed audit IDs/timestamps, suppressed membership, four notification rows and tickets/counters 0/0 remained unchanged.• Final Join PASS: third active basket 6a7ca61cf8a7d3829acd8035 appended with two prior audits immutable; Nova pending 1; Casey has five ordered notifications; tickets/counters 0/0.• Clean terminal approval PASS: action endpoint 200; Nova accepted 2+0/8; exactly one A ticket 6a7ca6ddf8a7d3829acd8038 / TKT-be2fc931-af92-47f8-83ad-0cefc4c1d416, counters 1/1; third basket approved/succeeded/inactive; both Cancel audits immutable.• Terminal basket-closure repair is verified.• Ticket poll FAIL: backend payload was correct but open-popup gating discarded every non-notification snapshot; Ticket item badge stayed absent.• Popup-safe, stale-response-protected global counter synchronization is hot-deployed; only the affected Join -> approval-with-Explore-open -> poll -> two-read path requires replay. Prior clean Cancel/reload/re-Join evidence remains valid.• Focused popup-counter replay Join PASS: POST join 200 at 19:13:38; basket 6a7ca9c2f8a7d3829acd8039 active approval-pending, Nova pending 1, Casey Pending 1, tickets/counters 0/0; Join was not repeated.• Focused approval/poll PASS: action POST 200 at 19:20:14; one A ticket 6a7cab4ef8a7d3829acd803f / TKT-970b4c17-dd7c-4d93-88c9-d42a1dfde12b; basket closed, counters 1/1; normal polls at 19:20:26/56 and 19:21:26/56 converged item-level Ticket 1 with Explore/join-review open.• First Ticket read PASS: GET /api/assets/tickets 200 at 19:24:09; the oracle retained the exact ticket ID/code, issue/use state and counters with no second credential or domain write.• Second Ticket read PASS / CHECKPOINT CLOSED: GET 200 at 19:29:16; DOM showed exactly one QA EVENT-TICKET-005 card; final oracle retained sole A ticket 6a7cab4ef8a7d3829acd803f / TKT-970b4c17-dd7c-4d93-88c9-d42a1dfde12b with original issuedAt, unused state and counters 1/1; Casey 0/0; no write or duplicate.

### Manual QA priority

P0 100

## EVENT-TICKET-006

### ID

EVENT-TICKET-006

### Type

Checkpoint

### QA domain

Event

### Area

Event ticket past lifecycle

### Scenario

Move an ended event ticket from Upcoming to Past without changing physical A/D status

### Statistics

X

### Monitoring / Metrics

X

### Affinity Graph

INDIRECT normal event-expiry convergence

### Admin Jobs

DELTA only for the existing event-expiry counter worker

### Domain / other UI

Same A ticket id/code moves Upcoming -> Past; expired scan is rejected without mutation or replacement

### Manual status

PASS / CLOSED

### Last manual date

2026-08-12

### Automated coverage

Ticket expiry/check-in service coverage plus stable pre-expiry stage, explicit arm-ticket-expiry action, live poll, physical-phone scan and persisted no-mutation oracle

### Next manual oracle

Closed; repeat only after ticket expiry bucketing, event-end validation precedence or expired-scan behavior changes

### Result

PASS

### Evidence / notes

• First timing-invalid attempt retained as NOT EXECUTED: setup consumed the stage-owned two-minute window; post-expiry oracle still retained one unchanged A ticket and counters 1/1.• Repaired stable baseline plus explicit arm PASS: arm at 17:45:25.759Z set the printed 17:47:25.759Z deadline only after Nova confirmed Upcoming.• Upcoming transition PASS: GET 19:47:17 returned the one card; GET 19:47:47 returned empty and the already-open UI converged without reload.• Past classification PASS: Nova selected Past once; DOM showed one QA EVENT-TICKET-006 card; oracle retained the same unused A ticket manual-qa-checkpoint:v1:event-domain:ticket / TKT-ba6bfa5c-b14d-48e6-bb62-3af1e245b0c6 and counters 1/1.• Expired scan PASS: authorized Android POST /api/assets/tickets/validate returned 200 at 20:14:06; visible result was 'Ez a jegy lejárt.' Final oracle retained the same A/unused ticket, no replacement, replay audit, outbox or notification.• Reset completed at 18:16:56.416Z; follow-up status was not-staged.

### Manual QA priority

P0 100

## EVENT-TICKET-007

### ID

EVENT-TICKET-007

### Type

Checkpoint

### QA domain

Event

### Area

Event ticket invitation acceptance

### Scenario

Let accepted Nova invite Riley; Riley responds first and stays ticketless pending Casey approval; Casey's later terminal approval creates Riley's ticket

### Statistics

INDIRECT invitation/invitee-response/Admin-approval deltas

### Monitoring / Metrics

DELTA only Casey terminal-approval-owned physical ticket and users-table counters; invitation, invitee response and reads X for ticket creation

### Affinity Graph

INDIRECT after terminal Admin approval recompute

### Admin Jobs

DELTA only for owning membership writes; terminal Admin approval must finalize the latest open payment before ticket sync and emit one target approval notification; Ticket/Notification reads X

### Domain / other UI

Baseline Casey accepted Admin and Nova accepted Member with one stable Nova A ticket/counters 1, while Riley is outside membership with zero ticket/counters; Nova invite creates one pending invitation and one unread Riley event-invite visible in New before response; Riley acceptance converts membership to a pending Admin-approval request, remains ticketless and resolves that invite notification; Casey approval creates one Riley A ticket, both Riley counters 1 and one unread event-member-approved row visible in New without changing Nova's ticket; repeated reads reuse the ticket

### Manual status

PASS / CLOSED

### Last manual date

2026-08-12

### Automated coverage

Backend accepted-eligibility ticket tests PASS; existing admin-before-invitee denial and ordinary-inviter approval-order regressions present; local invitation-boundary regression PASS; write-side terminal payment-finalization ordering/idempotence regressions added; invite-candidate fixture ownership and authenticated actor/owner preflight added; Java mutationApplied response and shared counter-revision regressions added; target approval-notification writer, materialized category and frontend-local parity regressions added; existing backend/frontend hot-deploy builds and Spring restart PASS; manual Riley-response HTTP replay PASS in-place and after fresh document read; focused Admin-approval durable, notification oracle/New UI, delayed affinity worker and repeated Ticket reads PASS; Firebase-disabled dev push outbox retention classified as configured; separate Gradle/npm test processes intentionally not started

### Next manual oracle

Advance without reset to EVENT-VISIBILITY-001, retaining the completed Casey/Nova/Riley memberships and exact Nova/Riley active ticket identities as the visibility checkpoint's before oracle

### Result

PASS

### Evidence / notes

• Baseline PASS: Casey accepted Admin/ticket 0; Nova accepted Member with sole A ticket manual-qa-checkpoint:v1:event-domain:ticket / TKT-d6bd7582-1849-46bb-ba09-24dd7fb92b44 and counters 1/1; Riley outside membership/counters 0/0.• Initial list FAIL at 20:23:14+02:00: Nova Events and Active Events badges were 1, but the authenticated 200 response and popup list were empty; no invite request was sent and the persisted baseline was unchanged.• Root cause: payment oracle exposed three legacy reserved-event records—one joined then two later initiated—outside the old fixture selector; latest-open payment therefore classified accepted Nova as pending.• Write-side repair: terminal event acceptance now finalizes the latest open payment after basket finalization and before ticket sync. No query/projection masking was retained.• Fixture repair at 18:44:01.807Z removed the three guarded legacy records; future stage/reset/status owns payments. Event/member/ticket/counters/outbox/tasks stayed unchanged and payments became empty.• Focused replay PASS without reload: authenticated Active Events returned exactly one record, and Nova's already-open popup converged on its normal poll to QA EVENT-TICKET-007 with badge 1 and members 2/8.• Invite-candidate fixture FAIL at 20:49:08+02:00: the popup was empty and confirmation disabled; no request or persisted invite mutation occurred. Riley was public and outside membership, but event candidates require a prior single + met=true rate that the fixture omitted.• Guarded candidate preparation at 18:54:03.858Z created one reset-owned Nova-Riley rate. Independent status retained membership/ticket/counter/payment/outbox/task baselines, and Nova-authenticated candidate API returned only Riley with total 1.• The already-open empty popup retained its prior response, so the replay resumed only at Invite popup close/reopen.• Nova invite PASS at 20:57:41+02:00: exactly one members/invite POST returned 200. Oracle shows Riley pending invite from Nova, no Riley ticket/counters, unchanged Nova ticket/counters and empty payments. In-place UI shows Nova 2 members + 1 pending, Casey 2/8 + pending 1, and untouched Riley Invitations 1 with no Ticket badge.• QA sequence corrected without resetting the live boundary: backend authorization and existing tests deliberately forbid Admin acceptance before the invitee responds. Riley must accept first and remain pending requestKind approval/ticketless; Casey's later approval is terminal and owns ticket creation.• Initial Riley response in-place FAIL: Invitations emptied, but Pending did not become 1. Persisted oracle/read PASS: pending requestKind approval/pendingSource member, stored Pending 1/Invitations 0, ticket counters 0/0, no Riley ticket, one Casey join-request; reload reconstructed the row.• Owning repair: Java requestJoin now reports its saved mutation so the response emits Invitations -1 and Pending +1; the shared frontend delta path advances the counter revision so older realtime state cannot overwrite it. Existing hot-deploy owners compiled/restarted successfully; no parallel build/test process ran.• Guarded focused replay PASS at 21:40:46+02:00: HTTP 200 returned changed=true plus Invitations -1 / event Pending +1 / event Invitations -1. Riley observed Pending 1 without reload; DOM showed Waiting for approval; oracle retained ticketless Riley and the exact Nova ticket. A later full document/fresh-filter read showed the same state.• Frontend-local runtime NOT EXECUTED for the Riley-response projection: the active deterministic fixture uses HTTP; local adapter contract was inspected and the shared regression covers the affected store, but no local runtime PASS is claimed.• Invite notification New observation NOT EXECUTED: the persisted event-invite was created unread and Riley's response later resolved it to read exactly once, but New was not manually inspected before that response. This is now an explicit pre-response stop, not a retroactive product FAIL.• First Casey terminal approval durable PASS at 21:49:11+02:00: Riley accepted, one A ticket 6a7cce37f8a7d3829acd8053 / TKT-3d3eddd0-221f-453e-b8f2-1b40fe29d795, counters 1/1, one Riley overlay, one three-member main chat and one joined system message; Nova's exact ticket stayed unchanged.• Approval notification FAIL: the same oracle found zero event-member-approved outbox rows and zero Riley approval notifications. Casey's apparent Invitations 0->3 / All 1->4 was a stale fixture baseline corrected by full recompute from three real demo invitations, not a product-query failure.• Owning repair: Java terminal approval emits one target-only unread event-member-approved intent after ticket/event refresh; materialization categorizes it event-admin, and frontend-local approval appends the equivalent unread row. Existing dev hot-deploy owners rebuilt/restarted successfully; no second build ran.• Guarded focused rearm READY at 22:08:27+02:00: only the failed approval effects were removed. Riley is pending approval with Pending 1/Tickets 0, no overlay/ticket/chat/task; Nova's original ticket, Riley's resolved invite, Casey's join-request and all earlier PASS evidence remain.• Focused approval replay durable + notification oracle PASS at 22:12:31+02:00: Riley accepted with sole new A ticket 6a7cd3aff8a7d3829acd805a / TKT-d05cdd81-86da-430d-b166-b508cccb42c6 and counters 1/1; one Riley overlay, three-member chat and joined system message exist; Nova's original A ticket/counters are unchanged. Exactly one target event-member-approved outbox and one materialized unread event-admin notification exist with Casey sender.• Notifications New PASS: manual observation plus managed read-only DOM proved 1 new/New 1 and the exact QA EVENT-TICKET-007 / Approved / Casey Bridge · Event admin row; merely opening New kept readAtIso empty.• Delayed worker PASS: approval task EVENT_MEMBERS_CHANGED became done at 22:18:31+02:00 on attempt 1 with no error; enabled 60-second affinity rule reached pending 0. Firebase is inactive in dev, so the worker intentionally retained the push outbox pending while the exact in-app row was already materialized; this is configured behavior.• Repeated Ticket read PASS/CLOSED: Riley opened Upcoming, closed only Ticket and reopened Upcoming without reload/scan. Second-open DOM showed one ticketed event/filter 1 and the sole QA EVENT-TICKET-007 card. Final oracle retained Riley ticket 6a7cd3aff8a7d3829acd805a / TKT-d05cdd81-86da-430d-b166-b508cccb42c6 A/unused with counters 1/1, unchanged Nova ticket/counters and ticketless Casey; notification stayed unread and no extra ticket/chat/membership/outbox/task appeared. The earlier invite New UI check remains documented NOT EXECUTED and is enforced in future runs.

### Manual QA priority

P0 100

## EVENT-TICKET-008

### ID

EVENT-TICKET-008

### Type

Checkpoint

### QA domain

Event

### Area

Event ticket isolation

### Scenario

Keep two similar ticketed events with the same Casey Admin, Nova accepted Member and Riley pending roles, then mutate only one event

### Statistics

INDIRECT only for the selected event lifecycle

### Monitoring / Metrics

DELTA only for selected-event lifecycle/ticket counters; reads X

### Affinity Graph

INDIRECT only after selected-event recompute

### Admin Jobs

DELTA only for the selected event's owning mutation

### Domain / other UI

Nova starts with two distinct A tickets bound to two event IDs. Unpublishing event A changes only A ticket A -> D and total counters 2 -> 1; event B ticket keeps the same id/code/A status and remains visible. Republishing A creates a new A id/code and counters return 1 -> 2 without duplicating or reassigning B

### Manual status

PASS / CLOSED

### Last manual date

2026-08-13

### Automated coverage

Removal and insertion replay passed through Java POST ticket sync plus exact persisted isolation; shared SmartList stays reverted; Ticket-specific Java HTTP and frontend-local delta adapters retain foreground ownership; independent Nova/Riley notification lane remained live

### Next manual oracle

Closed; retain as regression checkpoint for Ticket delta removal/insertion, immediate publication menu sync and adjacent ticket identity isolation

### Result

PASS

### Evidence / notes

• Fresh stage owns event A manual-qa-checkpoint:v1:event-domain:event and event B manual-qa-checkpoint:v1:event-domain:ticket-isolation-control; both are A/Public/Ticketing On with Casey+Nova accepted, Riley pending and occupancy 2/8 (1).• Nova owns exactly two distinct active unused tickets: A manual-qa-checkpoint:v1:event-domain:ticket:isolation:a / TKT-f7fe4c90-de37-46e2-973e-ce51695454c3 and B manual-qa-checkpoint:v1:event-domain:ticket:isolation:b / TKT-a0046ee8-d818-49de-8b4c-84714b31e8ec; stored counters are 2/2. Casey/Riley remain ticketless.• Stage created zero outbox and recompute tasks. The previous visibility trio was closed before exactly three Casey/Nova/Riley sessions launched and identity-verified; no fourth QA window runs.• Nova pre-mutation Ticket PASS: Upcoming reported 2 ticketed events and showed A/B exactly once without opening a card/QR. Immediate oracle retained both events active/Ticketing On, both exact A tickets unused, Nova counters 2/2, Casey/Riley 0/0 and stage-relative outbox/recompute counts zero.• Casey pre-Unpublish My Events PASS: A and B appear exactly once with 2/8 (1); Nova's two-ticket list stays open and Riley is idle. Second read oracle remained identical with zero new outbox/recompute.• A-only Unpublish immediate PASS: one POST at 02:01:34+02:00; Nova's open Ticket list/count converged 2->1 to B-only without reload. Oracle proved A DR + original ticket D + Nova counters 1/1 while B stayed active with exact same A ticket ID/code; Casey/Riley remain ticketless.• Notification full PASS: one completed A under-review task targeted exactly Nova accepted + Riley pending and created one unread A row/outbox per recipient; both New counters became 1 in-place. Each New list showed exactly one A / The event is under review row, no B row, and opening the list retained readAtIso empty. Casey actor and B received none. Normal A recompute completed done on attempt 1 with empty lastError; ticket/counter boundary stayed A-D/B-A and Nova 1/1.• Fresh Ticket-read PASS: after closing Notifications, Nova newly opened Upcoming; a new GET returned exactly one B row and the UI reconstructed B-only/count 1. Repeated poll plus repeated isolation oracle retained exact A-D/B-A IDs/codes and Nova 1/1, proving read purity beyond the in-place branch.• First Republish server PASS / live poll FAIL: A gained new active ticket 6a7d0c43f8a7d3829acd809b / TKT-888bb042-3d3f-45cb-9baf-15ae9d2e565a, original A stayed D, B retained its exact A ticket and Nova counters became 2/2. Nova notification became 2 and Riley remained one under-review row. Ticket total/filter became 2 but pageSize=1 returned only newly sorted A and replaced visible B, so one card rendered.• Shared SmartList repair built: normal poll now requests at least the configured current page while retaining a larger loaded window; focused 1-of-18 and two-page regressions added. Existing frontend-sync hot-deploy completed at 02:21:31+02:00; focused live replay remains pending.• Focused replay READY: versioned reset + fresh image-qualified stage and independent status proved A/B active, Nova exact new tickets TKT-2b136618-7f8f-424f-b931-1e6a4af24c16 and TKT-a6d1861a-746d-4609-8493-c054eb9a3b89, counters 2/2 and zero stage-relative effects. Only the same three managed pages reloaded; DOM identity/counter preflight passed Casey 0, Nova 2, Riley 0.• Pre-producer menu FAIL / repair built: persisted A was still published and Nova showed A+B/2, but Casey's 02:28:02 screenshot rendered Publish until a later Activities poll changed it to Unpublish; inverse drift was also observed. Converted InfoCardData changed without SmartList source DTO, while shared menu reads the source. Publish/Unpublish now emits the established source Activity Event sync, with DR->A and A->DR regression coverage; frontend-sync hot-deploy passed at 02:33:44+02:00.• Interrupted old replay NOT EXECUTED for UI: nginx proves two successful Unpublish/Publish pairs at 02:27:16/02:27:50 and 02:37:40/02:37:44, but no matched stop captured the immediate menu and complete Nova list observations. Later expiry/restart yielded events=[] and counters 0; do not promote those writes to UI PASS.• Clean post-restart replay READY: restarted frontend-sync built/synced current repairs at 11:25:20/11:25:23; resource preflight had 7.3 GiB available and zero swap. Guarded stale discard + image-qualified stage + independent status proved future A+B active/Ticketing On, Nova exact tickets TKT-66b31ab7-75f9-4929-b0e3-1ec3fb546093 and TKT-1624f5d2-9181-49bf-b467-7859e21d3726, counters 2/2, controls 0/0 and zero stage-relative effects. Exactly three new identity-verified sessions run; closed-menu DOM is Casey My Events 2, Nova Ticket 2, Riley Ticket 0.• Post-restart Unpublish server PASS / open Ticket UI FAIL: one A Unpublish at 11:43:46; oracle proved A DR + exact A ticket D, B exact ticket stable A and Nova 1/1. Ticket GET at 11:44:14 returned B-only/total1 and red Ticket badge became1, but screenshot retained popup header2 plus A+B. Later convergence does not erase this boundary.• Corrected diagnosis: no race was proven. The foreground Ticket list lacked the established delta reconciliation contract, while the notification-priority realtime path also applied non-notification domain counters under an open popup.• Scoped repair built: the prior SmartList core page-size edit and its core tests are exactly reverted. Ticket uses stable identity/revision + Notification-style pollDelta on authenticated Java POST /assets/tickets/sync and the equivalent frontend-local repository; open popups defer side-menu domain snapshots while notifications remain independent. Existing backend compile/restart and frontend build/sync passed; authenticated Java preflight returned removed A, B upsert, total1.• Clean delta replay READY: the first reset revealed that scheduledMessageTasks was read by the oracle but absent from fixture cleanup. The versioned harness now owns only its controlled event-task rows. Second reset + image stage + independent status proved A+B active through 2026-08-13T15:07:37.047Z, Nova exact active tickets TKT-cc7f973d-f97b-471a-9559-7dde22e12086 and TKT-e5230543-0bd6-4c03-9375-b271e32bd9a5, counters2/2, controls0/0 and zero lifecycle/outbox/notification/recompute residue. Only the same three pages were reloaded; read-only DOM proved Casey/Nova/Riley identities and Ticket counters0/2/0.• Removal replay PASS: Casey sent one A Unpublish at 12:14:59 and confirmed the immediately reopened menu showed Publish. Nova's already-open popup used Java POST /api/assets/tickets/sync at 12:15:24 and reached B-only/header1/red Ticket1 without reload; later no-op sync retained it. Oracle proved A DR + exact A ticket D, B exact ticket unchanged A and Nova1/1. Nova/Riley notification badges independently became1.• Insertion replay PASS/CLOSED: Casey Published only A at 12:18:36 and confirmed the immediately reopened menu showed Unpublish. Nova's open popup used Java POST /api/assets/tickets/sync at 12:18:54 and reached A+B/header2/red Ticket2 without reload or loss of B. Oracle proved new active A 6a7d99fce90c0afb4dd44fdb / TKT-d5034907-9acd-42b3-bfec-4707fb2e700a, original A stayed D, B exact TKT-e5230543-0bd6-4c03-9375-b271e32bd9a5 stayed A, and Nova2/2. Nova notification2/Riley1 passed.

### Manual QA priority

P0 100

## EVENT-TICKET-009

### ID

EVENT-TICKET-009

### Type

Checkpoint

### QA domain

Event

### Area

Event ticket offline holder

### Scenario

Prove a warmed authenticated holder session survives offline reload and can present the cached QR while only that client is offline, then an online Admin scanner checks it in exactly once

### Statistics

X

### Monitoring / Metrics

DELTA one canonical ticket-use mutation from the online scanner

### Affinity Graph

X

### Admin Jobs

X; check-in is a direct request path

### Domain / other UI

• Automatic warm: with Ticket closed, the authenticated side-menu realtime response writes the bounded Upcoming offlineTicketSnapshot; online SmartList continues through its own page/delta APIs and Past is not auto-warmed.• Offline reload: authenticated Nova shell uses a distinct dark-gray Offline background/status; only the menu visibility header is gray with an Offline badge. Preferences/filter/history and every member domain action except Ticket are disabled without recoloring their palettes; profile pencil and both notification launchers are absent without notification mutation.• Cached holder: the same exact unused B card and complete QR remain available without a server response.• Online scanner: Casey succeeds once, repeat is already-used, and Nova reconnect creates no replacement/duplicate.

### Manual status

PASS / CLOSED

### Last manual date

2026-08-13

### Automated coverage

• Dev-only checkpoint PWA switch is ignored in production; held target cleanup restores online.• Existing watcher synced the home repair at 12:55:38 and final side-menu chunk at 13:04:29; no parallel build.• Read oracle: navigator false, activated controlling worker, game-page-status-offline, gray visibility header + Offline badge, three home controls/all non-Ticket domain items disabled, Ticket active, pencil/header-notification/FAB absent.• Existing watchers built Java + users.service-3VAB3CS6.js by 13:20:03. With Ticket never opened after reload, the side-menu poll advanced Upcoming cache 10:46:45Z -> 11:22:56Z and retained A+B with scanCode; B remains A/unused: TKT-e5230543-0bd6-4c03-9375-b271e32bd9a5.• First offline B QR visual result is retracted: app-sw returned a cached GET /api/assets/tickets and the local timestamp changed despite no nginx request. The watcher synced the fix at 13:37:19 and the waiting worker was activated.• Corrected replay PASS: offline B full QR opened with cache timestamp unchanged at 11:40:47.443Z, no ticket API request and persisted B A/unused. Its visible medium.webp was a CacheStorage hit; automatic unseen-image prefetch is not claimed.• First physical scan PASS: Casey's authorized phone sent one validate at 13:54:29/HTTP 200; original B now has usedAt 11:54:29.767918052Z and Casey actor, while Nova remained offline.• Replay PASS: second validate at 13:57:04 returned already-used; canonical B fields stayed exact. One immutable replay audit plus one Nova warning/outbox occurrence1 were created without raw code and are not a second ticket-use mutation.• Reconnect PASS: held process released online in finally; after reload/realtime the cache advanced to 12:00:05.116Z with exact original A+B, both used, B exact time, counter2 and no duplicate/replacement/additional replay mutation.

### Next manual oracle

Closed; repeat only after PWA offline policy, automatic Upcoming snapshot, service-worker ticket/media caching, ticket validation or reconnect reconciliation changes

### Result

PASS

### Evidence / notes

Complete offline holder path passed after retracting and fixing the service-worker ticket API-cache false-positive: shell, no-popup warm, snapshot-only B QR, cached card image, first physical use, already-used replay audit/warning and online reconciliation all have independent read/persisted evidence.

### Manual QA priority

P0 100

## EVENT-TICKET-010

### ID

EVENT-TICKET-010

### Type

Checkpoint

### QA domain

Event

### Area

Event ticket replay warning

### Scenario

With holder Nova online throughout, audit every authenticated already-used replay actor while aggregating holder warnings into one counted inbox row

### Statistics

X

### Monitoring / Metrics

DELTA one immutable audit per replay and one aggregated holder notification row; users unread counter changes only on insert or read-to-unread reactivation; ticket fields/counters X

### Affinity Graph

X

### Admin Jobs

INDIRECT bounded/collapsible outbox delivery; ticket/event workers X

### Domain / other UI

Capture unrelated total-unread baseline B. Replay 1 prepends one Nova warning count 1 and changes total unread to B+1 without removing or rerendering the existing check-in row; marking it read returns total unread to B; replay 2 reopens the same row at count 2/B+1; replay 3 while unread produces count 3 while total unread stays B+1. Three Casey audits exist, canonical ticket use is unchanged, no raw QR is persisted, and negative paths create no replay artifacts

### Manual status

PASS / CLOSED

### Last manual date

2026-08-06

### Automated coverage

Backend actor-audit and atomic notification aggregation regressions; frontend HTTP/local occurrence mapping and row-badge regression; shared SmartList delta polling; persisted physical replay/read/replay oracle

### Next manual oracle

Closed; repeat only after replay audit, aggregation revision, unread counter or notification delta-poll changes

### Result

PASS

### Evidence / notes

After fixing the Mongo revision update conflict, physical replay 1 created one Casey audit and one Nova warning count 1 with users notifications 2. Nova marked it read; replay 2 preserved the canonical ticket use, created the second immutable audit, reactivated the same warning at count 2/revision 3, and restored users notifications to 2 without a duplicate row or raw QR. User accepted closure; the already-unread further occurrence/no-inflation branch remains automated.

### Manual QA priority

P0 100

## EVENT-TICKET-011

### ID

EVENT-TICKET-011

### Type

Defect retest checkpoint

### QA domain

Event

### Area

Event ticket attendance

### Scenario

Project the first successful physical-ticket check-in into the event-scoped Members list without replacing membership acceptance

### Statistics

INDIRECT attendance statistics only after a separately owned aggregation

### Monitoring / Metrics

DELTA one direct only-if-missing member-attendance write; accepted member/capacity and ticket counters stay unchanged; authorized replay repairs only an interrupted missing projection from original ticket use

### Affinity Graph

INDIRECT only after later attendance-affinity policy is explicitly defined

### Admin Jobs

X; first check-in and idempotent replay recovery are direct request paths

### Domain / other UI

Nova remains membership status accepted but gains separate Checked in/Beléptetve attendance with exact check-in time, Casey actor and physical ticket ID; the already-open Members list updates by its revision delta poll without shared SmartList changes; replay and invalid/unauthorized/revoked/expired scans do not rewrite or create attendance

### Manual status

PASS / CLOSED

### Last manual date

2026-08-13

### Automated coverage

Baseline PASS. First scan persisted exact ticket/member 2026-08-13T12:51:48.620332085Z, Casey actor/ticket ID; Nova accepted/actionAt unchanged, Casey Admin, exact 2/8/counters/profiles/cardinality. Never-reopened Members patched one Nova row in-place to Checked in. Same-QR replay returned Already used; complete first-scan snapshot stayed exact, one immutable audit preserved original identity, and read-only DOM retained 2 members/one Nova/same 2:51:48 PM

### Next manual oracle

Closed; repeat only after ticket check-in, member attendance fields/revision, member delta endpoint/popup poll, replay recovery or frontend-local ticket mutation changes

### Result

PASS

### Evidence / notes

Shared SmartList remained untouched. First ticket CAS is authoritative; only-if-missing member projection plus authorized replay recovery closes interruption. Local mode uses one state write. Previously proven guarded negative paths were not replayed because the new projection is unreachable before their rejection. One-time codes must be retained before success hides them.

### Manual QA priority

P0 100

## EVENT-TICKET-012

### ID

EVENT-TICKET-012

### Type

Checkpoint

### QA domain

Event

### Area

Event ticket revocation

### Scenario

Scan the previously saved physical-ticket QR after Casey Unpublishes but before Republish

### Statistics

X

### Monitoring / Metrics

X; rejected scan is a strict no-op and prior replay/audit/unread counts remain stable

### Affinity Graph

X

### Admin Jobs

X; direct request path

### Domain / other UI

Unpublish midpoint retains the old ticket as D and removes Nova's active Ticket contribution. Casey's saved-QR scan returns revoked/inactive before already-used evaluation; ticket ID/code/original use, event, 2/8 membership, two prior replay audits, one warning count 2, replay outbox and Nova red counter remain unchanged. Later Republish creates a different active credential and never reactivates this QR

### Manual status

PASS / CLOSED

### Last manual date

2026-08-06

### Automated coverage

Backend revoked-before-used decision coverage plus persisted physical scan and notification/replay no-op oracle

### Next manual oracle

Closed; repeat only after Unpublish revocation, scanner rejection precedence or rejected-scan notification policy changes

### Result

PASS

### Evidence / notes

Unpublish itself created one normal unread event-under-review notification at 10:30:47.791763232Z and users notifications became 3. The subsequent saved-QR scan returned revoked/inactive and created no notification: old ticket remained D with original use, replay audits/outbox stayed 2/2, one warning stayed count 2 and users notifications stayed 3.

### Manual QA priority

P0 100

## EVENT-NOTIFICATION-001

### ID

EVENT-NOTIFICATION-001

### Type

Defect retest checkpoint

### QA domain

Event

### Area

Event lifecycle notifications + shared polling

### Scenario

Deliver Unpublish and Republish lifecycle notifications while another popup owns foreground polling

### Statistics

X

### Monitoring / Metrics

DELTA one write-side lifecycle task/inbox row and users unread increment per mutation; notification poll X; ordinary side-menu snapshot deferred while popup open

### Affinity Graph

X

### Admin Jobs

DELTA event-definition scheduled task only for each lifecycle mutation; poll X

### Domain / other UI

With Nova chat open, Casey Unpublish yields one short bundle-resolved under-review notification within one interval; Casey Republish yields one green available-again row the same way; both titles are only the compact event name with no Manual/changed; Casey receives neither; stable rows are preserved; closing chat resumes deferred ordinary side-menu reconciliation

### Manual status

PASS / CLOSED

### Last manual date

2026-08-06

### Automated coverage

Detailed pack retained the completed retest: Nova left Activities -> Chats open; Casey Unpublish added compact Under review within one 30-second foreground poll and Republish removed it without reload/close. The independently serialized notification lane delivered the concise lifecycle row throughout

### Next manual oracle

Closed; repeat only after lifecycle notification scheduling/i18n, UiPollCoordinator notification-lane isolation, ordinary chat-list header delta polling or popup ownership changes

### Result

PASS

### Evidence / notes

Lifecycle messages remain semantic bundle keys. Notification title is exactly @event_title. Chat-list header delta and notification polling are independent read-only lanes; stable rows are patched, not rebuilt. Matrix status reconciled to the already-recorded detailed PASS evidence on 2026-08-13.

### Manual QA priority

P0 100

## EVENT-CHAT-LIFECYCLE-001

### ID

EVENT-CHAT-LIFECYCLE-001

### Type

Defect retest checkpoint

### QA domain

Event

### Area

Event chat lifecycle

### Scenario

Keep every physical event-bound chat and its history usable across Unpublish and Republish

### Statistics

X

### Monitoring / Metrics

DELTA one eventId-indexed physical-chat ownerStatus+revision batch per lifecycle mutation; indexed owner-copy header poll X

### Affinity Graph

X

### Admin Jobs

X; direct event lifecycle write path

### Domain / other UI

Capture main/optional/group/service chat owner-copy IDs and message IDs; leave Nova Activities Chats list open; Unpublish advances revision and the foreground 30-second row delta shows compact Under review without reload; Republish advances the same documents to A and removes the badge; no chat/message recreation, unread inflation, unauthorized pending access or cross-event change

### Manual status

PASS

### Last manual date

2026-08-06

### Automated coverage

Manual repaired-list retest: Nova left Activities Chats open without entering inner chat; Unpublish added compact Under review and Republish removed it within one 30-second foreground poll in each direction; no reload/close; independent concise notification polling remained live

### Next manual oracle

Closed; preserve as regression checkpoint for every event-bound physical chat variant

### Result

PASS / CLOSED

### Evidence / notes

Read-side Event projection is forbidden. The list sends known row revisions, patches only changed rows and cannot reload the Event, chat list or history.

### Manual QA priority

P0 100

## MEDIA-IMG-001

### ID

MEDIA-IMG-001

### Type

Event Editor subcase

### QA domain

Event

### Area

Event Editor

### Scenario

Within the closed Event Editor save/reopen flow, upload one managed non-square image once and retain one canonical URL

### Statistics

X

### Monitoring / Metrics

X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Original plus distinct small/medium/large WebP objects exist; the saved Event retains one canonical large URL; Event card and large editor slot use medium without another upload

### Manual status

MANUAL UI + ORACLE PASS; FIX VERIFIED

### Last manual date

2026-08-05

### Automated coverage

Backend response/strict distinct-rendition HTTP E2E plus frontend URL/carousel coverage; focused editor-slot regression 1 file 3/3

### Next manual oracle

Do not repeat without a related Event Editor/media change; Article and Help images belong to their owning editor save cases

### Result

PASS

### Evidence / notes

Event manual-qa-checkpoint:v1:event-domain:event used one 1853x919 PNG. The original remained PNG 1853x919/52326 B; distinct WebP objects returned 128x63/242 B, 640x317/1930 B and 1280x635/5766 B with HTTP 200 and preserved landscape ratio. MongoDB retained one canonical large.webp URL after save/reopen and the card requested medium.webp. A fresh editor request exposed small.webp stretched across the large slot; after the owning shared-carousel input and Event Editor medium configuration fix, the focused test passed 3/3, hot deploy synced, and the reopened editor was sharp without a second upload. Event cards expose no fullscreen image presentation, so no such control is claimed.

### Manual QA priority

P0 96

## EVENT-SCHEDULERS-001

### ID

EVENT-SCHEDULERS-001

### Type

Consolidated journey

### QA domain

Event

### Area

Event background-worker lifecycle

### Scenario

Prepare bounded random-group, counter/ticket-expiry and checkout-basket-purge inputs and let each real scheduler process its exact work once

### Statistics

X

### Monitoring / Metrics

DELTA scheduler/audit; INDIRECT Chat/outbox; DELTA scheduler/audit for zero/success/failure; INDIRECT domain event when non-empty; DELTA scheduler/audit

### Affinity Graph

X

### Admin Jobs

DELTA status/count/duration/history; DELTA

### Domain / other UI

DELTA rooms/members/chats/system messages/counters; DELTA expired counters/tickets/user counters; DELTA basket resultState deleted and pending count

### Manual status

MANUAL UI + PERSISTED ORACLE PASS / CLOSED

### Last manual date

2026-09-02

### Automated coverage

Consolidates JOB-RANDOM, JOB-COUNTER, JOB-BASKET. Extensive fixture/self-tests; common lifecycle tests; Fixture/service/common lifecycle tests

### Next manual oracle

Closed; repeat only after Event scheduler, Job Detail polling, generated-room runtime, counter-expiry or checkout-basket reconciliation changes

### Result

PASS

### Evidence / notes

All three reset-isolated branches passed through the already-running scheduler without UI Run or direct worker calls. Random groups produced the exact six-user rooms/runtime/chat result; counter expiry passed one-work and zero-work with an unchanged second-pass domain fingerprint; basket purge ran exactly once at 2026-09-02T08:18:21Z, moved Metrics 1186/1186 to 1187/1187, deleted only the expired basket, preserved the future control and Event, and disappeared from the still-open Explore Basket while the menu returned to Book Event. Final fixture status: not-staged/prepared=false.

### Manual QA priority

P1 76

## JOB-AUTO

### ID

JOB-AUTO

### Type

Scheduled job

### QA domain

Event

### Area

event-auto-inviter

### Scenario

Real scheduler invites eligible users

### Statistics

DELTA event/member activity when invites created

### Monitoring / Metrics

DELTA scheduler/audit and Events/Members/outbox

### Affinity Graph

INDIRECT after affinity evidence/recompute

### Admin Jobs

DELTA

### Domain / other UI

DELTA invites/member state/bell

### Manual status

MANUAL UI + FUNCTIONAL PASS

### Last manual date

2026-08-04

### Automated coverage

Fixture/service/common lifecycle tests; dedicated manual-helper exact oracle

### Next manual oracle

Repeat on scheduler/domain changes; retain cross-surface sample

### Result

PASS

### Evidence / notes

Real scheduler picked up the persisted short window at 08:49 and processed exactly one eligible Nova invitation. Job Detail, invitation/marker/outbox/bell database oracle, Nova notification UI, Monitoring and Statistics all agreed. No Run button or direct job endpoint was used. Guarded reset restored the original data and rule configuration.

### Manual QA priority

P0 84

## STAT-012

### ID

STAT-012

### Type

Causal

### QA domain

Event

### Area

Statistics

### Scenario

Invite or join one event member

### Statistics

Event activity delta; Activities interaction changes

### Monitoring / Metrics

Events/Members and outbox deltas

### Affinity Graph

INDIRECT after affinity evidence/recompute

### Admin Jobs

Auto-inviter may be the trigger

### Domain / other UI

Member state and notification agree

### Manual status

MANUAL UI + FUNCTIONAL PASS

### Last manual date

2026-08-04

### Automated coverage

Service tests; dedicated manual-helper exact oracle

### Next manual oracle

Retain as a release-change sample; UI-POLL-JANK-001 remains separate

### Result

PASS

### Evidence / notes

A controlled 30-second eligibility window was picked up by the real scheduler at 08:49 without a Run button. Job Detail showed processed 1, pending 0 and 131ms. The exact machine oracle proved one Nova invitation, marker, outbox and bell with matching recipient sets. Monitoring showed membership writes 1359->1360, capacity/invites 1322->1323 and shared outbox 228->229 while event writes/model remained 59. Statistics showed Daily Events/assets 1322->1323, section total 1502->1503 and Event participation 1370->1371 while Active/Total events stayed 69/79. Nova UI showed exactly one Casey event invite. The manual bell query was corrected to accept payload.type. Guarded reset verified not-staged and restored the original rule/data.

### Manual QA priority

P1 74

## PAYMENT-METHODS-HISTORY-001

### ID

PAYMENT-METHODS-HISTORY-001

### Type

Checkpoint

### QA domain

Event

### Area

Member side-menu Payment history and saved cards

### Scenario

From the side menu prove Cash-only blocks card registration; verify All/Expenses/Income history, immutable summaries and totals; register Stripe with admin-approved 3DS; switch provider, verify Retokenize/Delete recovery on the now mismatched Stripe cards, and register Barion without 3DS; then remove one expired card through its badge menu

### Statistics

X; exact user payment totals remain unchanged

### Monitoring / Metrics

X; Payment History and card reads do not create audit or queue work

### Affinity Graph

X

### Admin Jobs

X; expiry job generation is machine-proven separately and is not rerun by this UI fixture

### Domain / other UI

Cash-only disables Add card; two header totals, translated filters, day groups, contextual row/status tones and failure reason render; Stripe registration waits for the matching admin 3DS approval; after the Barion switch every Stripe-tokenized card retains artwork under the expired-strength white overlay, is unselectable, and exposes vivid blue Reconnect > -> Retokenize/Delete recovery; both complete autofills produce one tokenized active method each; expired coral card is not selectable, exposes only vivid Expired > -> Delete cleanup, and its translated notification remains attributable

### Manual status

PASS / CLOSED

### Dev

PASS

### Local

-

### Last manual date

2026-09-06

### Automated coverage

User-driven 39-step HTTP journey plus persisted savepoint/final oracles; real expiry scheduler smoke; focused simulator cancellation regression; running frontend watcher build and live EN/HU i18n import PASS

### Next manual oracle

Closed; proceed to EVENT-CHECKOUT-001 and repeat only after Payment History, card registration, provider recovery or expired-card behavior changes

### Result

PASS

### Evidence / notes

The 39-step Ava/Alex journey passed Stripe and Barion registration, replacement, reconnect, expired cleanup and immutable history/totals. The standalone Stripe 3DS cancellation saved no card and created no payment; its old generic failure copy was split into the existing cancelled state and dedicated message without changing technical failures. Exact cleanup restored three cards, nine prior registrations and five payments, then returned the simulator to Cash only, 3DS Off and phase=not-staged.

### Manual QA priority

P0 100

## EVENT-GALLERY-FEED-001

### ID

EVENT-GALLERY-FEED-001

### Type

Delegated full-flow journey

### QA domain

Event

### Area

Gallery, Photo Feed and content moderation

### Scenario

Exercise five-image shared editing/read-only galleries, Event cover, Article image metadata, profile info scrolling, localized Feed and shared admin moderation with category/state buckets.

### Statistics

X

### Monitoring / Metrics

DELTA persisted moderation counters and support-message deduplication

### Affinity Graph

X

### Admin Jobs

DELTA content-auto-approve eligibility, delay, suspension and repeat-run history

### Domain / other UI

DELTA gallery save/reopen, mobile fit, Feed ordering/visibility, moderation SmartList moves and shared settings/counters

### Manual status

PASS

### Dev

PASS

### Local

NOT RUN

### Last manual date

2026-09-23

### Automated coverage

Implementation record: 109 backend tests and 36 focused frontend tests passed; Angular build and EN/HU seed audit passed. Later moderation-filter focused checks recorded separately. Runtime IN PROGRESS: gallery/feed, Article/profile, moderation/settings branches exercised; see dated evidence. Latest regression tests not run; broader suite not claimed PASS.

### Next manual oracle

Closed; fixture reset. Next OPERATOR-EMAIL-WARNING-001; Calendar remains last.

### Result

PASS

### Evidence / notes

guides/qa/checklists/event/EVENT-GALLERY-FEED-001.md; guides/qa/evidence/EVENT-GALLERY-FEED-001-20260923-progress.md; 2026-09-23 supplements added, runtime verification in progress. Final Feed supplement PASS: event links/follow, owner buckets/remove/counters/colors; viewport-only Seen, durable outbox/retry/reopen and filtered-page continuation; own-ID receipt negative, duplicate receipt and blocked/deleted Seen exclusion. See 16:30–16:36 evidence. Final opening sync+page and exact outbox cleanup/lost-response retry PASS; zero-minute Event/Asset and suspended/due Feed PASS; EN/HU and shared picker headers PASS; cleanup oracle zero owned items/intents, counts consistent. Local runtime/latest standalone units NOT RUN.

### Manual QA priority

P1 75

## EVENT-CALENDAR-EXPORT-001

### ID

EVENT-CALENDAR-EXPORT-001

### Type

Delegated full-flow journey

### QA domain

Event

### Area

Manual calendar ICS export

### Scenario

Download own upcoming/ongoing published or accepted events from Profile; verify private snapshot, stable IDs, actual Android import window, repeated/changed import and offline calendar reminder.

### Statistics

X

### Monitoring / Metrics

X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

DELTA one-click desktop/mobile ICS download, ring/error state, physical Android import UI and per-calendar compatibility observations

### Manual status

PASS

### Dev

PASS

### Local

PASS

### Last manual date

2026-09-24

### Automated coverage

11/11 focused frontend-local occurrence/serializer/download tests PASS; existing backend/frontend watcher builds PASS; actual HTTP and UI export/time-change/cancellation/empty/error/retry checks, Android and Ubuntu imports, physical offline native alarm.

### Next manual oracle

None: closed within recorded manual snapshot/export scope; importer limitations are documented.

### Result

PASS

### Evidence / notes

PASS/CLOSED 2026-09-24. guides/qa/evidence/EVENT-CALENDAR-EXPORT-001-20260924.md; guides/qa/checklists/event/EVENT-CALENDAR-EXPORT-001.md. One-time/Daily/Weekly concrete occurrences; local adapter regression coverage distinguished from native testing. Android same-UID update without duplicate; omitted entries remain; native alarm setup required. Ubuntu duplicate batch rejected; clean import succeeds. Dev auth fallback limitation explicit. Scoped native/download cleanup and versioned fixture/session reset verified; settings/Job restored. Earlier affiliate results unchanged.

### Manual QA priority

P1 73

## EVENT-PAST-BADGES-001

### ID

EVENT-PAST-BADGES-001

### Type

Regression follow-up

### QA domain

Event

### Area

Time-bound activity badges

### Scenario

Stored Event badges before/after expiry, subsequent write-side recount and repeated worker; Rates excluded

### Admin Jobs

Close past events; Followed expiry; batch implementation retained

### Domain / other UI

Event dropdown All binding; Event scopes, Tickets and Followed time boundaries

### Manual status

PASS / CLOSED (server expiry regression)

### Dev

PASS

### Local

PARTIAL

### Last manual date

2026-09-30

### Automated coverage

20/20 focused Java tests; existing dev scheduler and real HTTP watch/unwatch; start fallback and real 90-second end boundary; exact fixture reset.

### Next manual oracle

None in the requested server expiry/recount scope. Frontend-local and new Ticket/Followed end-to-end coverage are not claimed.

### Result

PASS

### Evidence / notes

2026-09-30 focused closure: real HTTP All/Hosting2 before end; existing expiry worker1 afterward; genuine watch/unwatch recount remains1; repeated scheduled pass0 with unchanged event/control/full activity counters. Start-only fallback/future control also passed. Job first total2 is expired source1 plus existing friendship projection1. Java tests13+7 PASS; test-only compilation with backend stopped serially and restored. Original expiry batch implementation unchanged; no new Past job. Exact fixture reset and zero owned leftovers;12 retained manual markers preserved. See guides/qa/evidence/event/EVENT-PAST-BADGES-001-20260930.md and JSON. Local PARTIAL retains the unrun local-adapter boundary.

### Manual QA priority

P1

## MSC115-WORK-EVENT

### ID

MSC115-WORK-EVENT

### Type

Flow

### QA domain

Event

### Area

Campaign-scoped invitation, capacity and related filters

### Scenario

MSC-115 steps 33–36: Campaign-selected event with its own capacity; Events and feedback filters; recipient-only invitations/acceptance/removal/feedback; Work excluded from random-room generation. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

PARTIAL — recorded samples

### Last manual date

2026-10-15

### Automated coverage

2026-10-13: step36 Work random-room exclusion PASS; EventSchedulerTest37 + JobGroupIsolationTest3; local admin-base-scope9. No production change.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13: Step35 closed per prior session and retained step35 evidence. Step36 PASS: three active Work events, no Work random rule or random room; strengthened main/private Work test, 40 Java +9 local tests pass. frontend-sync restored healthy. Evidence: guides/qa/evidence/work-community/MSC115-step36-random-work-exclusion-20261013.json. No new due Dating run forced; KVM campaign sample still open. | 2026-10-13 reconciliation: executionBlocks[1] in guides/qa/evidence/work-community/MSC-115_AUTOMATIC_20261013.json records steps31–35 HTTP event/filter/invitation/removal and local filter/chat evidence. MSC115-step35-local-invite-confirmations-20261013.json and MSC115-step35-http-feedback-mobile-20261013.json close the former35 gaps. Step36 record closes Work random exclusion. These supersede earlier partial35 notes without closing unrelated campaign gaps. | 2026-10-13 user-requested synchronization: current steps 33–36; old scenario wording replaced by the active checklist. No new test or PASS claimed.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## MSC115-PAYMENT

### ID

MSC115-PAYMENT

### Type

Flow

### QA domain

Event

### Area

Group-scoped history, member basket and manual transfer

### Scenario

MSC-115 steps 88–91: Member-scoped payment history, manual cash/transfer receipts, retry/refund and workspace isolation. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

NOT RUN

### Automated coverage

See guides/plans/MULTI_GROUP_PRODUCT_DIRECTION_2026_10.md; code/build checks do not establish manual PASS.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 user-requested synchronization: current steps 88–91; old scenario wording replaced by the active checklist. No new test or PASS claimed.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## TOURNAMENT-001

### ID

TOURNAMENT-001

### Type

Checkpoint

### QA domain

Tournament

### Area

Tournament

### Scenario

Inspect saved tournament definition before grouping

### Statistics

INDIRECT event inventory only

### Monitoring / Metrics

DELTA definition write; runtime processing X

### Affinity Graph

INDIRECT after event recompute

### Admin Jobs

Tournament grouping/review X

### Domain / other UI

Parent, stages, capacities, sequence and initial counts agree

### Manual status

MANUAL UI PASS

### Last manual date

2026-08-15

### Automated coverage

Shared Java and frontend-local group-count policy coverage; tournament service coverage partial

### Next manual oracle

Reset cleanly, then stage TOURNAMENT-002 and capture the real grouping identities

### Result

PASS

### Evidence / notes

Published runtime repair replay showed Qualifiers Groups: 2 × 1–2 members with A–B and Final Groups: 1 × 1–2 members with A only. The separate draft editor screenshots 13-16-22/05/10 proved Tournament, parent 1–8, Qualifiers 60/0, per-group 1–2, Score, advance 1 and estimate 1–4; Final 45/0, per-group 1–2, Score, advance 0 and estimate 1–2. The final oracle retained DR/published=false, three exact accepted identities and zero runtime/group/leaderboard/task/outbox writes. Published locking is respected: the checkpoint no longer asks for Unpublish merely to reach Edit Event.

### Manual QA priority

P0 90

## TOURNAMENT-002

### ID

TOURNAMENT-002

### Type

Checkpoint

### QA domain

Tournament

### Area

Tournament

### Scenario

Run real grouping and inspect group membership

### Statistics

INDIRECT event/member activity

### Monitoring / Metrics

DELTA group/member/chat materialization

### Affinity Graph

INDIRECT after membership changes

### Admin Jobs

DELTA named real grouping path

### Domain / other UI

Each accepted user occurs once in the correct group and group chat

### Manual status

PASS / CLOSED

### Last manual date

2026-08-15

### Automated coverage

Random grouping fixture/service coverage; targeted-query, exact-coverage, generated-room oracle, write-roundtrip, explicit membership-owner, tournament-room presentation/notification/card-owner and recovery-notification causality regressions added

### Next manual oracle

Reset TOURNAMENT-002, stage TOURNAMENT-003 and prove deterministic review/advancement exactly once

### Result

PASS

### Evidence / notes

Clean recovery Start persisted exact R1/R2 rooms, memberships, chats and counters. Started was written once for Nova+Riley before the exact ready rows; all three actors passed unread notification UI and ordering. Casey/Nova passed exact R1 membership and Nova the R1 chat; Riley passed R2 1 / 2, singleton Members and R2 chat. Final oracle retained rooms/stage/notifications and proved only owner-scoped chat read transitions: Nova/Riley unread and Chat counters became 0 while untouched Casey remained 1. No cross-user or duplicate effect remained.

### Manual QA priority

P0 96

## TOURNAMENT-003

### ID

TOURNAMENT-003

### Type

Checkpoint

### QA domain

Tournament

### Area

Tournament

### Scenario

Finalize stage and let real review advance it

### Statistics

INDIRECT stage/member activity

### Monitoring / Metrics

DELTA stage, membership and outbox

### Affinity Graph

INDIRECT after advancement recompute

### Admin Jobs

DELTA event-tournament-review real run

### Domain / other UI

Winners advance once; losers and stale groups are removed correctly

### Manual status

PASS / CLOSED

### Last manual date

2026-08-15

### Automated coverage

Tournament-review fixture/service coverage; deterministic review harness, exact notification no-op verifier, manual actor-boundary regression, separate advanced/not-advanced outcomes and EN/HU keys added

### Next manual oracle

Carry the exact Casey+Riley Final membership into TOURNAMENT-004 without reset

### Result

PASS

### Evidence / notes

Casey human Finalize stayed separate for Nova+Riley; worker count1 wrote exact Casey+Riley Final membership, automatic Casey+Riley advancement and automatic Nova non-advancement. Worker count0 preserved byte-exact domain/notifications. Screenshot 2026-08-15 19-50-31 passed all three unread views, human/stage avatars, texts and counts.

### Manual QA priority

P0 98

## TOURNAMENT-004

### ID

TOURNAMENT-004

### Type

Expansion checkpoint CP12

### QA domain

Tournament

### Area

Tournament final lifecycle

### Scenario

Start the advanced Final stage, then finalize the completed tournament

### Statistics

INDIRECT stage/event notification counters

### Monitoring / Metrics

DELTA Final runtime, whole-tournament result and ordered notification outbox

### Affinity Graph

X

### Admin Jobs

DELTA real stage lifecycle; automatic branch conditional

### Domain / other UI

• Final Start creates a new stage-named notification only at actual Start• Stage-system avatar reuses the Final card accent while the row background keeps its notification tone• Every automatic lifecycle message names the completed/started stage; advancement names source and destination• Finalize identifies whole-tournament completion and localized winner/result context exactly once

### Manual status

PASS / CLOSED

### Last manual date

2026-08-16

### Automated coverage

Guarded terminal-only replay harness and stable-identity oracle; Java/frontend-local lifecycle recipient coverage; shared notification converter outcome-avatar coverage

### Next manual oracle

Closed; stage TOURNAMENT-ROOM-LIFE-001 independently without replaying Final Start or Finalize

### Result

PASS

### Evidence / notes

• Clean Final Start replay persisted one Riley-only Casey Start audit followed by one Casey+Riley system room-ready record; Nova remained excluded.• Guarded terminal replay preserved PASS Start/room evidence byte-identically, set Casey 7 / Riley 9 and finalized once.• Persisted terminal oracle proved three separate ordered records: Riley Casey-authored Final finalized, Riley system Won the tournament, Casey system Did not win; Nova received none.• Three-browser UI passed exact recipients, short texts and separate producer avatars. Winner/advanced trophy glow and not-winner/not-advanced diagonal strike passed after the existing frontend watcher rebuild; Casey audit portrait stayed unchanged.• No Start, Qualifiers or Finalize producer was replayed during presentation qualification.

### Manual QA priority

P0 99

## TOURNAMENT-ROOM-LIFE-001

### ID

TOURNAMENT-ROOM-LIFE-001

### Type

Expansion checkpoint CP12

### QA domain

Tournament

### Area

Tournament room nested visibility

### Scenario

Inspect one active parent tournament and its accepted generated rooms through the parent → stage → Groups path

### Statistics

Root list contains only the parent; nested rooms and accepted counts remain available through View Event; pending counters are zero

### Monitoring / Metrics

READ parent-linked/generated rooms with accepted-only membership; no mutation

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Casey sees only the parent Activity card, then exact Group A 2 and Group B 1 accepted membership under Qualifiers; room chats remain member scoped

### Manual status

PASS / CLOSED

### Last manual date

2026-08-16

### Automated coverage

Strict persisted hierarchy baseline plus Casey root-list/View Event/Qualifiers/Groups visual read; invalid pending branch discarded without action

### Next manual oracle

Closed; repeat only after tournament-room materialization, root visibility or nested Groups navigation changes

### Result

PASS

### Evidence / notes

First root-room fixture reset without action. Corrected fixture proved parent-linked/generated rooms and nested navigation. Its synthetic room pending membership was impossible because Start materializes accepted-only members and event-owner groups are read-only; no resolution was executed and guarded reset preserved TOURNAMENT-004.

### Manual QA priority

P0 98

## TOURNAMENT-CARD-001

### ID

TOURNAMENT-CARD-001

### Type

Expansion checkpoint CP12

### QA domain

Tournament

### Area

Tournament parent card current stage

### Scenario

Persist and display the current stage summary on the root tournament event card

### Statistics

DELTA parent card stage row updates in place and survives reload; generated rooms remain hidden

### Monitoring / Metrics

DELTA parent event current-stage wire value on lifecycle transition; nested runtime remains authoritative and consistent

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

A separate compact row below the event name shows the current stage without a nested query/projection; server and frontend-local match; long mobile labels remain readable

### Manual status

PASS / CLOSED

### Last manual date

2026-08-16

### Automated coverage

Backend/frontend-local write materializer and shared card converter; guarded isolated fixture plus Mongo/HTTP list and terminal transition oracles; documented shell verifier dispatch repaired

### Next manual oracle

Closed; choose the TOURNAMENT-ADMISSION-001 policy before staging its fixture

### Result

PASS

### Evidence / notes

Casey saw Qualifiers 1/2, then the row changed immediately to Final 2/2 after one Finalize and survived explicit reload. The terminal oracle retained persisted final RS, finalized Qualifiers, three accepted parent members, two authoritative runtime groups, one root parent and zero generated root rooms. Closed tournament notification producers remained untouched.

### Manual QA priority

P1 90

## TOURNAMENT-ADMISSION-001

### ID

TOURNAMENT-ADMISSION-001

### Type

Expansion checkpoint CP12

### QA domain

Tournament

### Area

Tournament first-stage admission boundary

### Scenario

Attempt late join, existing-invitation acceptance and Admin approval after the first stage Start boundary

### Statistics

X for all rejected branches; each returns the localized registration-closed result

### Monitoring / Metrics

DELTA strict first-Start lock with no parent/group membership, capacity, counter or notification mutation; no pending room membership

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Parent admission never feeds the nested Groups counter; event-owner room member-pending stays zero; Explore omits the Invitation-only parent while accepted users retain it

### Manual status

PASS / CLOSED

### Dev

X

### Local

-

### Last manual date

2026-08-17

### Automated coverage

Direct Java pre-mutation guards; guarded replay fixture; three independent Mongo oracles across 14 sections

### Next manual oracle

Closed; repeat only after first-stage admission policy or Java membership transition changes

### Result

PASS

### Evidence / notes

Join hidden/rejected, invitation Accept rejected and Admin Approve rejected. Qualifiers remained A; Casey+Nova accepted; Riley remained one pending approval; chat, checkout, payment, ticket, leaderboard, counters, owned notification baseline and workers remained unchanged.

### Manual QA priority

P0 100

## TOURNAMENT-SCORE-REOPEN-001

### ID

TOURNAMENT-SCORE-REOPEN-001

### Type

Expansion checkpoint CP12

### QA domain

Tournament

### Area

Tournament corrected score revision

### Scenario

Auto-close one stage to Score review, Finalize once, then Reopen scores, change one deterministic outcome and Finalize again

### Statistics

INDIRECT result and unread counters change once per approved revision

### Monitoring / Metrics

DELTA new durable result revision; one human Finalize audit followed by corrected automatic outcomes; unchanged replay is a no-op

### Affinity Graph

X

### Admin Jobs

DELTA tournament-review worker consumes each approved revision exactly once

### Domain / other UI

Old outcome notification remains as audit; corrected winners/advancers receive one new revision-linked result in Java and frontend-local

### Manual status

PASS / CLOSED

### Dev

X

### Local

-

### Last manual date

2026-08-17

### Automated coverage

Dedicated revision fixture; guarded Reopen/correction/finalize/worker/no-op oracles; generic tournament reminder regression; three-actor notification and finalized-menu UI replay

### Next manual oracle

Closed; stage TOURNAMENT-SCORE-REOPEN-002 without replaying revision-1 or revision-2 producers

### Result

PASS

### Evidence / notes

Reopen preserved immutable revision 1 and sent one Casey-authored under-review audit to Nova+Riley only. Correction 9/14/7 finalized revision 2; the real worker changed Final membership from Casey+Riley to Nova+Riley and emitted separate corrected outcomes. All three browsers showed both old and new results without merge, two human Finalize audits remained separate, and Final starts soon stayed absent. A second worker pass completed with count 0 and byte-identical normalized membership, scores, markers and notification evidence; finalized Qualifiers exposed no second Finalize action.

### Manual QA priority

P0 100

## TOURNAMENT-SCORE-REOPEN-002

### ID

TOURNAMENT-SCORE-REOPEN-002

### Type

Expansion checkpoint CP12

### QA domain

Tournament

### Area

Tournament late correction safety

### Scenario

Compare Reopen scores before and after the dependent next stage starts

### Statistics

X

### Monitoring / Metrics

DELTA allow correction only before downstream play; late rejection preserves every domain and notification record

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

No ordinary Reopen after a dependent stage is active/closed; a future explicit rollback workflow is separate

### Manual status

PASS / CLOSED

### Dev

X

### Local

-

### Last manual date

2026-08-17

### Automated coverage

Backend/frontend-local guard implementation; replayable dependent-stage fixture; authenticated Java HTTP rejection; full related-record snapshot oracle

### Next manual oracle

Closed; repeat only after Reopen eligibility or stage progression semantics change

### Result

PASS

### Evidence / notes

The already-PASS pre-start Reopen branch remained untouched. With Final active, Casey's reloaded Qualifiers menu omitted Reopen Scores. One authenticated forbidden Java request returned unchanged F/revision 2; exact 9/14/7 scores, Nova+Riley Final membership, current-stage state and every related event/member/runtime/group/chat/notification/task/counter record remained byte-identical. No lifecycle producer was replayed; frontend-local runtime was not executed.

### Manual QA priority

P0 100

## TOURNAMENT-MEMBER-001

### ID

TOURNAMENT-MEMBER-001

### Type

Expansion checkpoint CP14

### QA domain

Tournament

### Area

Tournament first-stage materialization admission cutoff

### Scenario

Accept one invitation while a scheduled first-stage Start is in flight, retain one pending invitation, then complete the materialization once

### Statistics

INDIRECT accepted/pending participation counts

### Monitoring / Metrics

DELTA successful first-stage materialization determines the exact participant set; no duplicate room membership or chat

### Affinity Graph

INDIRECT existing affinity may select a group but is not mutated

### Admin Jobs

X for scheduled Start itself; Casey may complete one stuck in-flight materialization

### Domain / other UI

The in-flight accepted identity appears exactly once in one generated group; after commit, the pending invite remains parent-scoped and Accept is rejected without any mutation

### Manual status

MANUAL UI + FUNCTIONAL PASS / CLOSED

### Last manual date

2026-08-25

### Automated coverage

Real invitation terminal states, scheduled/in-flight Start materialization, post-commit admission guard and the parent-child write-side counter gate were exercised through the running stack

### Next manual oracle

Closed; fixture reset. Next physical row: TOURNAMENT-MEMBER-002 active-member removal

### Result

PASS

### Evidence / notes

A scheduled Start was already in flight when Nova accepted; Casey's assistance committed materialization, creating R1=Casey and R2=Nova. Nova Activities showed one parent card and Events/Active Events=1; Casey saw the parent under My Events. R2 Standings showed Nova alone at 0; acceptance and room-ready notifications were visible. Riley then attempted post-commit Accept: UI rejected it and the independent oracle retained Riley pending with parent, rooms, chats, standings, counters and notifications unchanged. Fixture reset.

### Manual QA priority

P0 100

## TOURNAMENT-MEMBER-002

### ID

TOURNAMENT-MEMBER-002

### Type

Expansion checkpoint CP14

### QA domain

Tournament

### Area

Tournament active-member removal

### Scenario

From an already-started nonblocked Tournament with parent currentStage and Qualifiers runtime both A, remove one accepted participant after its generated room and leaderboard row exist

### Statistics

INDIRECT participant, activity and unread counts

### Monitoring / Metrics

DELTA parent and generated-room active membership/chat authorization/counters are revoked once while retained score history remains auditable

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Removed participant disappears from active Members and room access without becoming DQ or blocked; Nova receives one self-removal notice, Riley receives one parent-event participant notice and Event chat message despite staying unchanged in Group B; only affected Group A receives the group removal message

### Manual status

PASS / CLOSED

### Dev

PASS

### Local

PARITY IMPLEMENTED / NOT EXECUTED

### Last manual date

2026-08-30

### Automated coverage

Backend notification/chat/leaderboard regressions authored; frontend-local repository/service parity authored; existing backend and frontend hot-deploy owners compiled successfully

### Next manual oracle

Closed; repeat only after removal, standings identity/order, chat wording/scope, parent-participant fan-out or write-side event-counter semantics change

### Result

PASS

### Evidence / notes

Casey removed Nova once from a clean already-started baseline. UI showed R / Nova Social / 7 and V / -----; Nova got the self-removal row, Riley the cross-group event-participant row, Casey none. The widened persisted oracle proved one parent Event message shared by Casey/Riley, one affected Group A removal message, and Group B unchanged with zero messages, zero unread and empty lastMessage, alongside parent/group removal, immutable score 7, exact recipients/counters and Nova chat revocation.

### Manual QA priority

P0 100

## TOURNAMENT-MEMBER-003

### ID

TOURNAMENT-MEMBER-003

### Type

Expansion checkpoint CP14

### QA domain

Tournament

### Area

Tournament removal notification fan-out

### Scenario

Remove one scored non-host participant from a single four-person generated group while the actor and two other parent participants stay active

### Statistics

INDIRECT participant, activity and unread counts

### Monitoring / Metrics

DELTA parent=deleted and generated-room=removed; retained score/chat/counter state and exact notification recipients converge once

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Standings retain all four score identities with active rows first, the actual target as R and one V slot; removed member gets one self-removal notice, both remaining non-actor participants one event-participant notice each, Casey none; parent Event and Group A each get one canonical removal message

### Manual status

PASS / CLOSED

### Dev

PASS

### Local

PARITY IMPLEMENTED / NOT EXECUTED

### Last manual date

2026-08-30

### Automated coverage

Dedicated four-person fixture; target-derived parent/group/chat/score/counter oracle; server outbox path and frontend-local repository/service parity

### Next manual oracle

Closed; repeat only after four-person recipient fan-out, target identity, chat projection/message scope or counter semantics change

### Result

PASS

### Evidence / notes

Casey removed Lina from the clean four-person room. UI retained R / Lina Park / 5. Persisted oracle proved Lina parent=deleted and Group A=removed; Casey/Nova/Riley remained in both chats; exactly one parent Event and one Group A removal message named Lina; Lina got self-removal, Nova+Riley participant notifications, Casey none; all four scores remained immutable; Lina counters decremented once and remaining counters stayed unchanged. This same-room target-derived fan-out remains separate from the widened T002 2+1 cross-room control. Fixture reset.

### Manual QA priority

P0 100

## TOURNAMENT-DQ-001

### ID

TOURNAMENT-DQ-001

### Type

Expansion checkpoint CP14

### QA domain

Tournament

### Area

Tournament disqualification and reinstatement

### Scenario

Disqualify one scored participant, inspect ranking and advancement, then reinstate before a separate finalization replay

### Statistics

INDIRECT eligible/advanced result counts

### Monitoring / Metrics

DELTA membership stays present with disqualified status; score/history are retained and advancement eligibility changes exactly once

### Affinity Graph

X

### Admin Jobs

DELTA tournament review excludes DQ rows and remains idempotent

### Domain / other UI

Members and standings show DQ distinctly and rank it after eligible rows; DQ user keeps event membership but cannot advance; Reinstate restores eligibility without duplicate membership; system-chat delivery does not create a red Impressions badge from a newly visible zero-evidence profile presentation

### Manual status

PASS / CLOSED

### Last manual date

2026-08-30

### Automated coverage

Persisted manual DQ, Reinstate, Finalize, real review and unchanged-review oracles; authoritative persisted-Impressions realtime flags plus shared frontend consumption and frontend-local synthetic parity.

### Next manual oracle

Closed; repeat only after DQ/Reinstate membership, leaderboard participant-state sorting, tournament advancement, outcome notifications, Groups pending-counter semantics or persisted-Impressions realtime ownership changes.

### Result

PASS

### Evidence / notes

One exact DQ/Reinstate cycle retained Nova membership and score with exact Event/Group chat and notifications and no Impression write. Separate review branch kept Nova as DQ 10 behind active rows; Finalize revision 1 preceded real worker count 2 (one group write plus one outcome revision), Final contains exactly Riley+Lina, Nova is excluded and Casey is the non-advancer. Unchanged worker replay count 0 preserved byte-identical domain/notifications. Groups red counter remained absent because pending=0; Impression evidence remained null/0 throughout.

### Manual QA priority

P0 100

## TOURNAMENT-RESOURCE-001

### ID

TOURNAMENT-RESOURCE-001

### Type

Expansion checkpoint CP14

### QA domain

Tournament

### Area

Generated group resource aggregation

### Scenario

Assign controlled Transport, Accommodation and Supplies to one generated Tournament group and inspect every aggregate level

### Statistics

INDIRECT event/resource activity

### Monitoring / Metrics

DELTA group resource record and persisted group-runtime metrics; parent/stage pending totals change only by the exact assignment delta

### Affinity Graph

X

### Admin Jobs

X unless an explicitly documented resource notification task is produced

### Domain / other UI

The generated group three-dot menu, Groups counter, stage/View Event navigation and root event action badge agree in place and after reload; no generated room card leaks into the root list

### Manual status

PASS / CLOSED

### Dev

PASS

### Local

PARITY IMPLEMENTED / NOT EXECUTED

### Last manual date

2026-08-30

### Automated coverage

Replayable isolated fixture/oracle; Java scope-read regression authored; frontend HTTP/local scope adapters and signal-store visibility compiled through the running watchers

### Next manual oracle

Closed; repeat only after generated-group resource write metrics, cross-owner card visibility, read receipts, aggregate counters or role isolation changes

### Result

PASS

### Evidence / notes

Casey/Nova/Riley wrote one Transport/Accommodation/Supplies assignment each and all three viewers saw all three cards. The independent oracle proved exactly three owner records, raw pending 1 per created item, root activity 3, stage groupsPending 3, exact per-viewer durable reads, no generated root-room leak, unchanged parent/room roles and user counters, and zero notifications. Join/Invite and group Resource Explore are routed into existing Asset membership/borrow rows with exact group-scope controls. Generic asset ownership and assignment remain in Asset cases; this row owns only Tournament generated-group scoping and aggregate navigation.

### Manual QA priority

P0 98

## JOB-TOURNAMENT

### ID

JOB-TOURNAMENT

### Type

Scheduled job

### QA domain

Tournament

### Area

event-tournament-review

### Scenario

Real scheduler reviews stage transitions

### Statistics

X

### Monitoring / Metrics

DELTA scheduler/audit; INDIRECT domain/outbox

### Affinity Graph

X

### Admin Jobs

DELTA

### Domain / other UI

DELTA stage review/advancement/score-plan/notifications

### Manual status

PASS / CLOSED

### Dev

PASS

### Local

PARITY IMPLEMENTED / NOT EXECUTED

### Last manual date

2026-08-30

### Automated coverage

Real scheduler advancement and DQ eligibility replays; exact count>0 domain writes followed by byte-identical count=0 no-op oracles; browser stage/leaderboard/advancement evidence

### Next manual oracle

Closed; repeat only after tournament-review scheduling, advancement eligibility, score-plan, notification or idempotency changes. Generic Monitoring UI remains in Admin optional MON-013.

### Result

PASS

### Evidence / notes

TOURNAMENT-003 produced exact next-stage membership and score-plan state through the real scheduler, then an unchanged count=0 replay. TOURNAMENT-DQ-001 independently proved DQ exclusion, exact Final membership/outcomes and another count=0 replay. Browser state matched both persisted results; the remaining generic Monitoring surface is owned by Admin optional MON-013 and does not keep this Core row partial. The scheduler/domain contract is Core Tournament; its generic Job Detail/Monitoring presentation is qualified separately under Admin optional.

### Manual QA priority

P0 86

## MSC115-MIXING

### ID

MSC115-MIXING

### Type

Flow

### QA domain

Tournament

### Area

Priority-off Mingle and Tournament

### Scenario

MSC-115 steps 92–94: Private Community Mingle/Tournament without affinity weighting; manual/automatic notification recipients and Dating control. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

NOT RUN

### Automated coverage

See guides/plans/MULTI_GROUP_PRODUCT_DIRECTION_2026_10.md; code/build checks do not establish manual PASS.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 user-requested synchronization: current steps 92–94; old scenario wording replaced by the active checklist. No new test or PASS claimed.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## CHAT-AUTH-001

### ID

CHAT-AUTH-001

### Type

Checkpoint

### QA domain

Chat

### Area

Event chat authorization

### Scenario

Compare Admin, accepted, pending and left membership against the same event chat

### Statistics

INDIRECT only for the controlled proof messages; causal Statistics replay is STAT-011

### Monitoring / Metrics

DELTA chat writes only after accepted state

### Affinity Graph

X

### Admin Jobs

X unless a message creates documented delivery work

### Domain / other UI

Admin and accepted member share history; pending/left users have no channel and are server-denied

### Manual status

MANUAL UI + FUNCTIONAL PASS; WEBSOCKET DEFECT FIXED

### Last manual date

2026-08-05

### Automated coverage

Chat/access-control coverage plus focused ChatHandshakeInterceptorTest PASS

### Next manual oracle

Proceed to retained-message Statistics checkpoint STAT-011; repeat authorization only after chat-id, membership or access-policy changes

### Result

PASS

### Evidence / notes

Casey Admin and Riley accepted shared one mainEvent chat with only their two avatars; Nova stayed pending with an empty Chats UI and no chat-message notification. The first send exposed encoded %3A being used as the WebSocket database key; it persisted nothing. Query-param decoding was fixed, its focused test passed and hot deploy loaded. Riley then sent two deliberate messages: the second separately proved the Event bucket after the first was read. Each message persisted once and created one Casey-only notification/outbox row. Casey UI proved Chats/All/Event unread cycles 0->1->0, both messages in shared history and Notification Center 5->6; final unread was 0. Nova received neither message, retained no chat owner copy, and direct history access returned 404 Chat not found.

### Manual QA priority

P0 100

## CHAT-FLOW-001

### ID

CHAT-FLOW-001

### Type

Consolidated checkpoint CP13

### QA domain

Chat

### Area

Everyday conversation and recovery

### Scenario

With Casey, Nova and Riley in one controlled Event/Group conversation, verify list contexts, 18-message history, typing, exact-once send, closed-recipient unread, read receipt and one transport reconnect/catch-up as one journey

### Statistics

DELTA two ordinary chat.message.sent events; list/history/typing reads X

### Monitoring / Metrics

DELTA exact recipient unread/read and reader identities; no lost/duplicate message across reconnect

### Affinity Graph

X

### Admin Jobs

X unless documented message delivery work is produced

### Domain / other UI

All/context rows and 18-message history are exact; open recipient sees live delivery without unread, closed recipient gets +1 then read clears once, an already-open Chat list converges through its existing poll without reopen, reconnect catches up once and all views survive reopen

### Manual status

PASS / CLOSED

### Dev

PASS

### Local

PARITY IMPLEMENTED / NOT EXECUTED

### Last manual date

2026-08-30

### Automated coverage

Replayable three-actor fixture and terminal oracle pass: 18 history plus two exact Casey messages, Nova+Riley read both, all chat counters zero, Group revisions Casey=2/Nova=3/Riley=3, two Riley-only outboxes/inbox rows, Casey/Nova notification delta zero and Riley +2. Focused backend/local coverage owns live read, active-viewer suppression and full poll row sync; both dev watchers compiled.

### Next manual oracle

Closed; continue with CHAT-ACTIONS-001

### Result

PASS

### Evidence / notes

The former LIST, HISTORY, SEND, COUNTER, READ, RECONNECT and TYPING micro rows are assertions of this closed owner. User confirmed the already-open Riley Chat list converged without reopen; terminal Mongo oracle passed every exact assertion.

### Manual QA priority

P0 100

## CHAT-ACTIONS-001

### ID

CHAT-ACTIONS-001

### Type

Consolidated checkpoint CP13

### QA domain

Chat

### Area

Message action lifecycle

### Scenario

Against one existing three-user thread, reply to an older message, aggregate/change/remove reactions, pin and locate the source, edit as owner with non-owner denial, then unpin and unsend with non-owner denial

### Statistics

INDIRECT one ordinary reply message; mutations do not add messages

### Monitoring / Metrics

DELTA same-message reply/reaction/pin/edit/tombstone state only; unauthorized writes X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

All open clients converge in place; reopen retains one canonical ID and audit, source navigation works, tombstone clears owned payload state and surrounding history/counters remain intact

### Manual status

PASS / CLOSED

### Dev

PASS

### Local

PARITY IMPLEMENTED / NOT EXECUTED

### Last manual date

2026-08-30

### Automated coverage

Three-window lifecycle and terminal oracle passed: 18 unchanged surrounding messages plus one same-ID tombstone; source navigation, reactions, pin/edit/unpin/unsend accepted; Nova Edit and Unsend both HTTP 403. Lost concurrent read updates and tombstone read recreation were corrected with guarded atomic write-side additions; simultaneous Nova/Riley websocket replay retained both readers while tombstone readers stayed empty. Live read receipts now carry canonical profile image URLs through backend/websocket and frontend HTTP/local paths; the user confirmed both real avatars immediately and after reopen, and a read-only database check retained both reader IDs with all unread/chat counters zero. Both dev watchers compiled successfully.

### Next manual oracle

Closed; continue with CHAT-CONTENT-001

### Result

PASS

### Evidence / notes

Owns the former REPLY, EDIT, DELETE, REACTION and PIN micro rows as one user journey. No separate mutation-audit collection exists; transient transitions are accepted UI evidence and the final tombstone/denials are persisted/API evidence.

### Manual QA priority

P0 98

## CHAT-CONTENT-001

### ID

CHAT-CONTENT-001

### Type

Consolidated checkpoint CP13

### QA domain

Chat

### Area

Rich-content conversation

### Scenario

In one accepted Group thread send one image, short voice clip, two-option poll, Event card and Asset/link card; consume them as Nova/Riley, change one vote and exercise denied recorder plus unavailable-target controls

### Statistics

INDIRECT five chat messages

### Monitoring / Metrics

DELTA one canonical attachment/target record per sent message and exact per-user poll votes

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Both recipients receive each message once; media opens/plays after reopen, poll totals remain exact, available cards navigate and unavailable targets reveal nothing; denied/cancelled media creates no row

### Manual status

PASS / CLOSED

### Dev

PASS

### Local

PARITY IMPLEMENTED / NOT EXECUTED

### Last manual date

2026-08-30

### Automated coverage

Replayable three-actor fixture plus exact Mongo and authenticated browser media/reopen/category-filter oracles; running backend/frontend watchers compiled the owning changes

### Next manual oracle

Closed; continue with CHAT-GOVERNANCE-001

### Result

PASS

### Evidence / notes

Exactly five canonical content messages retained Nova and Riley as readers; two South votes persisted canonical names, initials, genders and real profile-image URLs. All three actors received identical content; image, preview, voice and both voter avatars returned HTTP 200; All Transport/Sedan/SUV filtering, canonical Event/Asset navigation, unavailable-target isolation, notification/share-token state and zero terminal Chat counters passed. Denied/cancelled media produced no extra row or orphan. Vote mutation intentionally produces no unread item.

### Manual QA priority

P0 96

## CHAT-GOVERNANCE-001

### ID

CHAT-GOVERNANCE-001

### Type

Consolidated checkpoint CP13

### QA domain

Chat

### Area

Members and moderation intake

### Scenario

Inspect canonical Event and Group members, including pending/left/other-group negative controls, then report one accepted participant message twice and open the resulting Admin review item

### Statistics

INDIRECT one moderation input

### Monitoring / Metrics

DELTA exactly one idempotent report/review identity; member reads X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Members/roles/avatars match accepted event/group scope; denied identities stay absent; reporter gets one acknowledgement and Admin sees one exact context without unrelated history

### Manual status

PASS / CLOSED

### Dev

PASS

### Local

PARITY IMPLEMENTED / NOT EXECUTED

### Last manual date

2026-08-30

### Automated coverage

Replayable three-actor fixture plus independent terminal Mongo and authenticated browser oracles; running backend/frontend hot-deploy owners compiled the owning changes

### Next manual oracle

Closed; continue with CHAT-PUSH-001

### Result

PASS

### Evidence / notes

All three actors returned exact Event and Group A accepted members with real avatar URLs; Lina stayed pending-only, Sophia stayed denied and Olivia stayed Event/Group-B-only. Two identical Nova submissions retained one unresolved Riley review with exact reason/details and Event/Group/chat/message context, unchanged three-message history and no unrelated fixture write. User confirmed the Admin review/source/member UI; shared app-image-card portrait/contain rendering also fixed the Event Members list. Frontend-local parity is implemented but was not separately executed.

### Manual QA priority

P0 96

## STAT-011

### ID

STAT-011

### Type

Causal

### QA domain

Chat

### Area

Statistics

### Scenario

Send controlled ordinary chat messages

### Statistics

Messages timeline +1 per message; Communication +1 per message

### Monitoring / Metrics

Chat flow +1 per message; outbox conditional

### Affinity Graph

X

### Admin Jobs

Notification outbox conditional

### Domain / other UI

Message and unread/read projection correct

### Manual status

MANUAL UI + FUNCTIONAL PASS

### Last manual date

2026-08-05

### Automated coverage

Chat/realtime E2E support; focused WebSocket handshake regression PASS

### Next manual oracle

Closed; retain both historical one-message and current two-message causal samples, and repeat only after chat/statistics changes

### Result

PASS

### Evidence / notes

Historical 2026-08-04 sample: one Farkas Anna message changed chat 41->42, today's Messages 0->1, Communication/Messages 417->418 and Communication 426->427. Current 2026-08-05 replay reused the two deliberate Riley messages from CHAT-AUTH-001 without another write: the real worker snapshot at 08:42 reported daily Messages 2, chat.message.sent 419 and Communication 428 (Messages 419 + Warnings 9). Admin Statistics screenshots from snapshot 08:43 independently showed Daily usage Message 2 and Segments Communication 428 / Messages 419 / Warnings 9. Other visible daily metrics were Activity 18, New 0, Ratings 0, Event/assets 1306 and Moderation 0; no unrelated delta was attributed to the chat operation.

### Manual QA priority

P1 66

## MSC115-WORK-CHAT

### ID

MSC115-WORK-CHAT

### Type

Flow

### QA domain

Chat

### Area

Campaign questions and event group chat

### Scenario

MSC-115 steps 30–32: Rating before organizer questions; Campaign chat, recipient notifications/unread and retry; separate real Event group chat. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

PARTIAL — recorded samples

### Last manual date

2026-10-15

### Automated coverage

See guides/plans/MULTI_GROUP_PRODUCT_DIRECTION_2026_10.md; code/build checks do not establish manual PASS.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 ledger reconciliation: HTTP question chat created/reopened once; recipient-only message notification and unread clear checked. Local message persisted/reopened once. Real Event group chat remains separate and keeps View Event. Evidence: guides/qa/evidence/work-community/MSC-115_AUTOMATIC_20261013.json executionBlocks[0..1]. Full case remains open; no new test was executed for this status correction. | 2026-10-13 user-requested synchronization: current steps 30–32; old scenario wording replaced by the active checklist. No new test or PASS claimed.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## MSC115-CASE-CHAT

### ID

MSC115-CASE-CHAT

### Type

Flow

### QA domain

Chat

### Area

Shared case channel and permission changes

### Scenario

MSC-115 steps 64–69: Case and quotation channels, current membership access, recipient unread, direct Tasks navigation and failure/retry without an underlying Cases list. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

NOT RUN

### Last manual date

2026-10-15

### Automated coverage

14 focused frontend tests PASS; i18n audit15000messages PASS.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-07 guide expansion only: Tasks-button direct-board/close/error checks added from MSC-117 regression; no new manual run. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 user-requested synchronization: current steps 64–69; old scenario wording replaced by the active checklist. No new test or PASS claimed. | 2026-10-14:64–69 main/quote channels, recipient unread, removed-provider HTTP404 with positive200 control and already-open WS rejection, direct Tasks1read/no Cases overview, counter4→5 and error-close-retry verified. Shared centered error card replaces wrong top save error. EN/HU backend/source seeds synchronized; template common commitb4e04b8 propagated881640a/5efc5f6, targeted runtime check queued for final batch per user. See guides/qa/evidence/work-community/MSC115-step40-45-services-20261014.json.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## CHAT-CALL-001

### ID

CHAT-CALL-001

### Type

Dedicated checkpoint MSC-117

### QA domain

Chat

### Area

Chat WebRTC group calls

### Scenario

CHAT-CALL-001 steps 1-34: owned STUN direct calls; synchronized media controls; admin mute and coordinator handover; native participant paging and video RTP pause/resume with uninterrupted audio; recent speakers; physical self-audio; chat-header regressions

### Statistics

X: signaling is not a saved chat message

### Monitoring / Metrics

DELTA live STUN health via existing WebSocket

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Immediate phone audio; optional camera; full-size tiles; shared 2x2 mobile/up-to-3x2 laptop native stepper; only visible video streams, all audio retained; standard app-menu recent-speaker switch; individual receive-video/mute/volume controls synced with tiles; compact upward volume panel; mirrored unavailable phone

### Manual status

NOT RUN

### Dev

NOT RUN

### Local

UNSUPPORTED: server WebSocket required

### Automated coverage

PASS: 3 real WASM MLS, 2 PCM/FFT, 2 authenticated WebSocket tests; encrypted video control replay PASS; 4 watcher-AOT runtime checks for viewport/sender/SmartList/layout-reactivity PASS; existing watchers compile; all 50 call keys per language match live API

### Next manual oracle

Follow guides/qa/checklists/general/CHAT-CALL-001.md steps 1-34. Revalidate the three-actor baseline after dev/demo reset; prepare at least seven distinct participants for full desktop pages. Record per-peer audio/video RTP deltas; use the linked MSC115-CASE-CHAT steps 4-6 for direct Tasks navigation and request counts. | Template baseline is closed; assess newly found defects, carry over affected fixes and run only their targeted template regression.

### Result

NOT RUN

### Evidence / notes

MSC-117 https://github.com/fssrepository/myscoutee-roadmap/issues/155; guides/qa/evidence/CHAT-CALL-001-2026-10-06.json; isolated Alice admin/Bob/Carol fixture ready; browser checklist not executed by Codex | 2026-10-07 guide expansion only: 34 numbered steps; obsolete visible verification-code assertions removed; physical echo isolation and linked Tasks regression added. Earlier fixture-ready evidence is historical; revalidate after dev/demo reset. No new manual run. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

30/60

## ASSET-LIFE-001

### ID

ASSET-LIFE-001

### Type

Expansion checkpoint CP14

### QA domain

Asset

### Area

Asset lifecycle and type schemas

### Scenario

Create one Transport, one Accommodation and one Supplies asset; edit one shared field, then delete the Transport

### Statistics

INDIRECT asset inventory counts

### Monitoring / Metrics

DELTA canonical asset documents and lifecycle status; assigned projections are unchanged until a later assignment case

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Each type keeps its required type-specific fields and media; edit persists once; Save-confirmed Create and Delete update both counter surfaces without reload; Delete removes only the selected asset from active lists

### Manual status

PASS / CLOSED

### Dev

PASS

### Local

NOT EXECUTED

### Last manual date

2026-09-03

### Automated coverage

Terminal versioned Mongo oracle plus successful existing frontend watcher builds; focused shared ActivityStore regression authored but no duplicate standalone test process was started

### Next manual oracle

Closed; continue with ASSET-VIS-001

### Result

PASS

### Evidence / notes

Casey completed Create/Edit/Delete and one reload with no remaining material Asset issue. Compact editor carousel and owned-Asset InfoCard now contain square media without crop/stretch. Transport asset-1788401138449 retained edited Subtitle and status T; Accommodation asset-1788401224102 and Supplies asset-1788401283920 remained active with exact type fields. Authoritative/legacy/nested counts matched Transport 0/0/0, Accommodation 2/2/2 and Supplies 1/1/1; out-of-scope active Accommodation asset-1788401751580 (ddd) explains the second Accommodation and was preserved. Asset Trash/Restore and redundant replacement Create were removed from the UI contract; own-Asset list polling remains intentionally absent.

### Manual QA priority

P0 98

## ASSET-VIS-001

### ID

ASSET-VIS-001

### Type

Expansion checkpoint CP14

### QA domain

Asset

### Area

Asset visibility and discovery

### Scenario

Compare one Public, Friends only and Invitation only asset as owner, friend and unrelated member; edit Public to Invitation only and reload

### Statistics

INDIRECT visible asset counts

### Monitoring / Metrics

X for reads; DELTA one canonical Asset Visibility/update audit for the Edit

### Affinity Graph

INDIRECT existing friendship graph; DELTA edited-Asset affinity/boost recompute only

### Admin Jobs

X for reads; DELTA one collapsed ASSET_CHANGED task for the Save

### Domain / other UI

Explore and owned/managed lists expose exactly the policy-eligible assets; category filtering and owner impressions use the shared paths; the edited matrix persists after reload; direct denied reads reveal no hidden detail

### Manual status

PASS / CLOSED

### Dev

PASS

### Local

NOT EXECUTED

### Last manual date

2026-09-03

### Automated coverage

Authenticated baseline/edited HTTP visibility and detail-denial matrices; versioned Mongo read-only and exact single-edit oracles; successful existing backend/frontend watcher builds

### Next manual oracle

Closed; continue with ASSET-MEMBER-LIFECYCLE-001

### Result

PASS

### Evidence / notes

User completed representative Casey/Lina/Liam UI coverage, confirmed the Sedan/Van/All Transport filter and confirmed Casey's real interactive owner avatar appeared instead of CB. Baseline HTTP sets were Lina Public+Friends and Liam Public; after Casey changed only the Public-title control to Invitation only, terminal sets were Lina Friends only and Liam empty, with every forbidden detail read denied. Mongo at 2026-09-03T03:20:18.902Z proved only the target Asset plus one done ASSET_CHANGED task changed, siblings stayed byte-identical, Transport counts stayed 3/3/3 and no request/member/assignment/outbox/notification write appeared. A missing default-pricing/_class/imageUrl fixture schema was repaired and versioned; the strict oracle was not weakened.

### Manual QA priority

P0 96

## ASSET-MEMBER-LIFECYCLE-001

### ID

ASSET-MEMBER-LIFECYCLE-001

### Type

Consolidated journey

### QA domain

Asset

### Area

Asset invitation and join membership lifecycle

### Scenario

On one generated-group resource create one manager Invite and participant Join request, accept both, have the owner promote the invitee, let that delegated Manager promote then revoke the requester, and have the owner remove the requester; separately reset and reject an Invite once

### Statistics

INDIRECT asset/member activity

### Monitoring / Metrics

DELTA two pending request states, two accepted transitions, two explicit Asset Manager grants, one delegated revocation and one owner removal; alternate reject creates no membership; exact scoped Service chat and notification records; parent/group membership stays unchanged

### Affinity Graph

X

### Admin Jobs

Notification outbox MUST RUN once each for Invite, Join request, invitation accepted, invitation declined in its reset branch, Join accepted and member removed; manager promotion runs twice and delegated manager revocation once; scheduler X

### Domain / other UI

Distinct pending rows retain exact asset/event/stage/generated-group scope; live and reload pending-counter chains agree and drop only on resolution; manager role/icon/menu updates occur in place and persist; the owner can revoke/remove any non-owner Manager, while a delegated Manager can revoke only a Manager they granted and cannot remove a Manager; Asset Manager never changes Event Admin/Member role; recipient Notifications counters and exact occurrences cover resolved transitions; Service chat and sibling group stay unchanged

### Manual status

PASS / CLOSED

### Dev

PASS

### Local

NOT EXECUTED

### Last manual date

2026-09-03

### Automated coverage

Consolidated ASSET-MEMBER-001/002 user-driven UI coverage; real authenticated HTTP plus versioned Mongo replay of owner handover, member removal and final-owner Leave; successful existing backend/frontend watcher builds; focused server and frontend regression coverage authored

### Next manual oracle

Closed; continue with ASSET-ASSIGNMENT-LIFECYCLE-001

### Result

PASS

### Evidence / notes

User-approved flexible closure from the accumulated 2026-09-03 run instead of another ordered 46-step replay. The run covered distinct Invite/Join pending states, resolution and rejection, contextual pending counters, recipient Notifications, standard Service chat/Ask Organizer, ordinary-member restrictions, owner/delegated Manager grant and revoke rules, live/reload card role and menu changes, removal, Event-role isolation, and both Manager-first and no-manager Take Over branches. The final correction replay produced Casey Leave 3->2, Nova Take Over 2->2, Riley removal 2->1 and Nova final Leave 1->absent through the live UI. The terminal read-only Mongo oracle proved Riley's canonical Asset member row was deleted, activityResources was D with no Asset assignment, the generated-group runtime resource map was empty, and no notification was created after Nova's final Leave. The corrections use canonical write-side status and existing signal propagation, with no read projection or frontend-only hide; the retained terminal fixture was not silently reset after the user's verdict.

### Manual QA priority

P0 94

## ASSET-BORROW-001

### ID

ASSET-BORROW-001

### Type

Consolidated journey

### QA domain

Asset

### Area

One-unit free and paid Borrow, timeframe, capacity and exact-scope Organizer-only lifecycle

### Scenario

Against three free and one paid Public Transport control, cancel one request, reject one, accept one, submit the same paid Borrow twice as separate requests, compare overlapping/non-overlapping capacity and fine-tune Organizer-only at Event, Stage, Group and Asset scope

### Statistics

INDIRECT pending/accepted Asset request counts; INDIRECT available quantity/order; exact-scope participant counter delta; Asset activity and request delta

### Monitoring / Metrics

DELTA one request identity per one-unit submission; separate paid payment/approval/card per repeated Borrow; exact availability and date range; no request merging

### Affinity Graph

X

### Admin Jobs

Normal Asset request notification/outbox and affinity-task effects; Barion once per paid submission; schedulers X

### Domain / other UI

Every Borrow quantity is read-only 1; source Explore Asset appears once without Payment summary; repeated assigned request cards remain separate with #1/#2, date ranges and paid summaries; Organizer-only changes only the selected scope counter without role or membership cascade; reload retains the exact projection

### Manual status

PASS / CLOSED

### Last manual date

2026-09-17

### Automated coverage

Read-only step-12 persisted-state/HTTP review: four Cancel requests and projections D; no active Group A resource or Cancel member; Group B two accepted requests unchanged. Versioned Block 4 reset/stage and independent status passed all ten baseline guards. Earlier 18 focused JVM regressions passed against watcher-built classes.

### Next manual oracle

Closed by explicit user acceptance; no final toggle or replay required. Retain fixture/evidence. Pair-QA campaign complete.

### Result

PASS

### Evidence / notes

Blocks 1–3 reviewed from retained data with qualifications: pre-fix Organizer-only state and multiple attempts prevent a clean exactly-once run claim. Step 12 persisted removal verified for Casey/Nova; visual no-reload behavior is not independently claimed. Previous run archived in /tmp/asset-borrow-block4.QIP5RR/previous-run.json. Normal reset/stage at 12:36 CEST restored Group A empty and Lina Group B two one-item controls; phase borrow-reject-ready/startBlock=4. No prior Cancel success fabricated. Overlap Sep17 11:36–Sep24 12:36; non-overlap Sep25 12:36–Sep26 12:36; paid Sep18 12:36–Sep20 12:36 (Europe/Bratislava), HUF 6400. Three managed windows ready. No application code changed by this restage. Step 14 fix: pending-to-deleted audit now uses existing Reject/Cancel policy. Existing backend watcher passed at 12:50 CEST; 25 focused regressions passed. Same pending Riley request confirmed by HTTP; user subsequently confirmed rejection; verify-borrow-reject PASS. One D request/projection, Group A resource/metric absent, exactly one rejection notification to Riley. Group B two accepted requests and zero payments unchanged. Phase borrow-reject-verified; no reset. Evidence /tmp/borrow-reject-verification.log and /tmp/borrow-reject-verified-state.json. Block 5 user confirmation + verify-borrow-accepted PASS: three accepted one-item Capacity requests (Nova Group A 1, Lina Group B 2), occupied 3, pending 0, exact overlap dates, one owner request and one Nova acceptance notification, no payment or Event/Group membership change. Phase borrow-accepted-verified. Evidence /tmp/borrow-accepted-verification.log; no reset. Block 6 PASS: one pending one-item Paid request/projection, one captured/fulfilled Barion HUF 6400 payment, one owner notification, Nova pending Manager organizerOnly=true. Actual Sep17 11:36–Sep18 12:36 is 25 hours/two started billable days; reuse this actual range in Block 8. Harness fixed to count Paid contribution in shared Transport metric (1 accepted/1 pending); nine guard checks and corrected oracle passed. Application/fixture unchanged; no reset. Evidence /tmp/borrow-paid-pending-verification-after.log. Steps 26–27 user confirmation + verify-borrow-paid-accepted-participant PASS: one accepted Paid request, Nova Manager/organizerOnly=false, same HUF 6400 payment; Group A accepted 2/pending 0, free/Group B controls unchanged. Step 28 next. Button-ring fractional layout measurement fix built by existing frontend watcher at 11:15:40Z; visual confirmation pending after refresh. No reset. Extra Organizer-only toggles reviewed: two accepted Paid requests/projections and two independent captured HUF 6400 payments; same booking range; exactly two request and two acceptance notifications. Currently organizerOnly=false, Paid counted 2, Group A accepted 3/pending 0: consistent. Free branches/Group B/Event/Stage/Group memberships unchanged from Block 5. Strict terminal on-state not yet reached. Evidence /tmp/borrow-terminal-review-result.json. No reset or acceptance-rule change. FINAL CLOSURE 2026-09-17: user explicitly accepted PASS with Organizer only left off. Current two accepted Paid requests/payments and participant counters are consistent; earlier toggles retain their evidence. This accepted variation replaces the requested final on-state action; strict verify-borrow-terminal is not claimed as passing and its assertion remains unchanged. No fixture reset or replay. Pair QA 104/104 PASS.

### Manual QA priority

P2 72

## ASSET-CHECKOUT-001

### ID

ASSET-CHECKOUT-001

### Type

Checkpoint

### QA domain

Asset

### Area

Resource/Asset Explore Barion and 3DS checkout

### Scenario

From scoped Asset Explore traverse review, resumable checkout, one Barion payment, pending owner request and terminal acceptance while comparing free, unavailable, Cancel, decline and timeout action states

### Statistics

INDIRECT one paid Asset request/accepted-resource delta; draft/payment-summary reads X

### Monitoring / Metrics

DELTA zero server checkout writes before Pay; then one final Barion session/payment, exact borrow request, reservation and scoped resource projection; owner acceptance changes request state once; reads X

### Affinity Graph

X; no Event or Tournament affinity role is created

### Admin Jobs

CONDITIONAL normal Asset request/outbox work; simulator callback work follows the selected Barion/3DS branch

### Domain / other UI

Fresh paid: Borrow -> Confirm borrow; saved draft: Borrow Basket/Continue request; payment-ready: Barion card/Pay plus neutral Back and red Cancel; paid pending: Payment summary and one owner Pending row; accepted: same read-only summary and exact scoped resource; free uses Send borrow request and unavailable is absent from availability-filtered Explore; no freeze or duplicate payment/request/reservation

### Manual status

PASS / CLOSED

### Last manual date

2026-09-08

### Automated coverage

Complete user-driven steps 1-98; guarded core, request-destination, acceptance, manager-left, paid Take Over, refund, last-Leave and mixed-status Remove Mongo oracles; running backend/frontend watcher builds passed during defect repairs

### Next manual oracle

Closed; continue with the restaged one-unit free/paid ASSET-BORROW-001 baseline

### Result

PASS

### Evidence / notes

Steps 1-68 proved one approved, one declined and one expired payment plus one cancelled basket with quantity and sibling isolation. Steps 69-89 proved manager Leave, paid Take Over, runtime Remove, exact Asset-owner service chat and one separate 50% refund request/approval with pending counter 0->1->0. The last-manager Leave oracle passed at 2026-09-08T03:42:02.224Z. The final mixed-status Remove oracle passed at 2026-09-08T03:48:22.239Z: accepted Nova and pending Riley requests/projections were retired, runtime metrics disappeared, Casey's global Asset and all payment histories remained unchanged, availability returned to 3 and no automatic refund or Take Over notification appeared. The observed missing refund action was fixture policy/window drift and is corrected for future guarded replays without restaging this completed run.

### Manual QA priority

P0 100

## ASSET-PRICING-001

### ID

ASSET-PRICING-001

### Type

Interactive journey

### QA domain

Asset

### Area

Interactive pricing configuration and payment-time snapshots

### Scenario

Edit fixed and Hybrid Asset pricing, observe Borrow and payment disclosures, retain payment-time terms, and check independently submitted rentals and per-request member counts

### Statistics

X before payment; indirect Asset visibility and Borrow price projection changes

### Monitoring / Metrics

DELTA one Asset pricing config per user Save; then exactly three primary captured payments with distinct immutable effective-row and cancellation-policy snapshots

### Affinity Graph

X

### Admin Jobs

Barion provider runs exactly once per payment; no scheduler; normal Asset request/outbox and affinity effects only

### Domain / other UI

Fixed daily duration, Hybrid quantity/demand/time/min-max/rounding, Asset has no VIP, stage non-member access, Confirm/Payment/history disclosure and independent rental badges/member lists

### Manual status

PASS / CLOSED

### Last manual date

2026-09-17

### Automated coverage

Existing dev backend/frontend watcher builds passed. Read-only Mongo and native request-scoped HTTP review verified distinct requests/payments, one member per rental, exact stage totals and two-day billing. Original phase-by-phase oracle was not replayed.

### Next manual oracle

Closed; continue user-controlled ASSET-BORROW-001.

### Result

PASS

### Evidence / notes

2026-09-17 user accepted closure after saved-data review. Earlier run: Hybrid 1150, fixed 900 and 800 captured with their own rows/policies; Variable initially view-only. Final fresh run: two distinct Cutoff payments USD 900 and one 26-hour Variable payment USD 1800 at USD 900/day, all captured/fulfilled. Native member queries and persisted counters: Cutoff 2, Variable 1; every individual request has one Nova row. User reported repaired UI correct. Verdict combines these observations; no claim of literal original 2300/800/900 sequence. Refund actions reuse ASSET-CHECKOUT-001 block 8. Pricing fixture reset restored baseline with zero scoped artifacts.

### Manual QA priority

P0 98

## ASSET-ASSIGNMENT-LIFECYCLE-001

### ID

ASSET-ASSIGNMENT-LIFECYCLE-001

### Type

Consolidated journey

### QA domain

Asset

### Area

Normal sub-event and tournament-group assignment

### Scenario

Assign Transport, Accommodation and multi-user Supplies to one normal sub-event, then edit/unassign/remove one Group A resource while Group B stays unchanged

### Statistics

INDIRECT asset/event activity; INDIRECT per-type resource counts; INDIRECT exact resource/activity aggregate deltas

### Monitoring / Metrics

DELTA assignment and availability projection; DELTA one owner-scoped resource state per contributor and exact aggregate type metrics; DELTA write-side owner/type assignment refresh and exact Group A, stage groupsPending and root Event activity reversal; Group B stays an unchanged domain control

### Affinity Graph

X

### Admin Jobs

CONDITIONAL availability/outbox; scheduler X unless explicitly documented; X unless a documented resource notification is emitted; X unless the documented cleanup produces explicit work

### Domain / other UI

Event, sub-event, asset owner, asset ID, route and capacity agree; Transport route/capacity, Accommodation capacity and Supplies quantities agree in Event Resources, sub-event badges and parent navigation in place and after reload; Every affected Group A resource badge and stage/root aggregate converges without read-time reconstruction; unrelated Group A owners/types and all Group B rows/counters remain unchanged after reopen and reload

### Manual status

PASS / CLOSED

### Dev

PASS

### Local

PASS

### Last manual date

2026-09-04

### Automated coverage

Accumulated three-actor UI journey through the terminal manager removal; exact normal, capacity-edit, unassign, reassign and step-29 rollback savepoints; real authenticated Event-member removal HTTP replay; terminal Mongo oracle passed all thirteen checks; successful running backend/frontend watcher builds

### Next manual oracle

Continue with CONTENT-ADMIN-LIFECYCLE-001; stage it only after this closed fixture is reset and its read-only baseline is proven

### Result

PASS

### Evidence / notes

Steps 1-9 were accepted from the accumulated user-driven run and persisted normal savepoint. The bounded Tournament tail used guarded rollback points, preserving earlier evidence. Final removal status-deleted the affected resource and active requests as audit history, preserved Nova's resource generation at 1/0/0-5, reversed pending to zero, retained the normal Event and Group B domain state, and emitted the exact scoped notification once. Generated-room parent/stage/group identity now survives Event counter saves, and hierarchical assignment cleanup updates only affected resource scopes. The terminal phase is complete.

### Manual QA priority

P0 94

## GROUP-LIFECYCLE-001

### ID

GROUP-LIFECYCLE-001

### Type

Group regression journey

### QA domain

Group

### Area

Community group lifecycle

### Scenario

Create/edit/view groups and draft visibility rules; category/roster/role controls; disjoint hosting/participation/explore; join/invite/approve/leave; workspace selector; configurable app-admin Group review versus group-admin content moderation; persisted red badges updated through SmartList signals; Group support channel/filter.

### Statistics

INDIRECT only existing producers; compare before/after

### Monitoring / Metrics

DELTA authorized writes and denied cross-scope requests; no secrets

### Affinity Graph

INDIRECT workspace-owned rating/following mutations only

### Admin Jobs

INDIRECT configured moderation worker only; no invented scheduling rule

### Domain / other UI

DELTA community membership, workspace profile and stored policy; accepted/pending lists and counters match canonical records.

### Manual status

CLOSED / PASS — agreed HTTP scope

### Dev

CLOSED: HTTP29/29 current-scope blocks;26 full closures and3 scope-transfer closures.

### Local

NOT RUN

### Last manual date

2026-09-27

### Automated coverage

31 focused backend moderation/chat/counter tests PASS (2026-09-25): separate scope settings, authority/foreign IDs, persisted pending count and idempotence, worker, Group support access/filter/unread. Earlier 15 filter/invitation tests PASS (2026-09-24). Frontend/backend dev watchers compiled. Full local/UI/HTTP journey NOT RUN. Profile selection correction: 21 focused Java tests PASS (2026-09-25); profile-load parameter, read-only restore, accepted-membership authority, failed-load non-commit, invite activation and removal. Added frontend HTTP parameter/retry unit cases; not executed separately from the running build watcher. | 2026-09-26: 105 focused backend tests PASS and 47 frontend tests PASS, covering explore boundaries, Base-only asset API key, contact repository account resolution and ticket account aggregation. These unit results do not close the manual local/HTTP journey. | My Tools follow-up (2026-09-26): 40 focused frontend tests PASS; 1 backend stored menu-counter test PASS. Account ownership/store/counters and stale-poll checks covered; browser journey NOT RUN. | Scope follow-up (2026-09-26): 195 backend and 32 frontend focused tests PASS. Payment payer/recipient query identity, account contacts, group event authorization and ticket scanner covered; manual local/HTTP journey NOT RUN. | Overlay navigation (2026-09-26): 27 focused frontend tests PASS; no real-device/Router/Firebase journey claimed. MCP Go race tests and image 1.3.0 initialization/discovery PASS; six generated schemas match OpenAPI. Help source parity PASS. | 2026-09-26: 13 focused frontend checks passed: popup/category/distance (5), local membership/notification lifecycle (5), workspace scopes and stale polls (3). Existing dev watchers compiled frontend/backend; added Java regression cases not run. No full-flow PASS.

### Next manual oracle

Closed. Independent deployment checks retain their separate scope; Isolation also closed 2026-09-28.

### Result

PASS

### Evidence / notes

guides/qa/checklists/group/GROUP-LIFECYCLE-001.md; Added 2026-09-24. No campaign fixture or browser actions executed. Priority I/L/A/N/O=4/4/4/3/3; effort actions/extra actors/oracles/boundaries/restore/external=40/2/4/3/2/0. Finalized 2026-09-25: app-admin configurable Group review; group-admin Asset/Event/Feed scope; write-side badges propagated through signal store/SmartList without reload; Group support channel and separate unread count. Profile loading owns activeWorkspaceGroupId persistence; no per-request group header. Checklist includes shared loading state, timeout retaining prior selection, same-target retry and stale responses. Manual results remain NOT RUN. | 2026-09-25: sharing batch and discovered eventless-support regression checklist expanded; execution remains NOT RUN, no manual result claimed. | Shared UI micros appended to existing GROUP-LIFECYCLE-001 checklist; no execution or new PASS claimed. UI_NOTES_2026_09_25.md separates completed code from pending implementation. | 2026-09-26 resume: retained 10-group/27-membership baseline verified for read-only block 1/25. No manual PASS; mutation blocks not staged. guides/qa/evidence/GROUP-LIFECYCLE-001-20260926.md | NOT RUN block 19.1: complete real demo-selector entry, consent, admission before session, saved/rejected location, cancel/retry, first avatar load, reload/logout/login. No injected-session proof. | Source audit: community membership notification hook absent; Members action missing pending badge fixed and observed red in managed UI. Shared menu single-digit circle 20x20px; card numeric alignment checked after watcher deploy. Full counter/notification lifecycle is not fixed or verified. Overall remains NOT RUN. Full conversation coverage inventory in the dated execution log. | Superseding 2026-09-26 correction: member write counters, notification hooks and live store reconciliation implemented; complete lifecycle remains NOT RUN. Correct selector 2 / Groups 3 scope preserved. Retained badge-writes-ready and join snapshots exist; no product membership writes executed. Earlier absent-hook/not-staged descriptions are historical. See dated evidence follow-up and checklist 6.1.5–8. | Group/member attention writes now apply transition deltas like Activity Event, rather than recounting child collections. Versioned block-1 baseline verified without data writes; ordered browser restart in progress. | 2026-09-26 automated delegated browser continuation: creation and required/textual policy draft/save/read-only; hidden roster badge and private-roster invitation cancel/accept/reload; compact image; contextual menu/member counters. Nine focused frontend checks PASS. See GROUP-LIFECYCLE-001-members-media-policy-20260926.json. No full-case PASS. | 2026-09-26: separate checklist block 26 added for group Admin grant/revoke provenance, creator departure, Admin-first/member-fallback takeover, last-member deletion, Asset Manager icon/palette/confirmation parity and notification recipients/retry/scoped badges. Block 26 local and dev HTTP NOT RUN; closed PASS rows unchanged. | 2026-09-26 22:14: block 26 partially exercised in HTTP (grant provenance/403/revoke, ordinary-member leave, creator departure, Admin-first/member-fallback takeover, last-member deletion and Main fallback); 52 focused frontend tests PASS. Notification routing and duplicate release notification repaired/retested. Isolated admin fixture restored. Block 5 timeout/disabled selector/rollback/new-choice/late-response/reload proved; versioned after-workspace-selection checkpoint captured and verified. See dated evidence; no whole-case PASS. 2026-09-26: sequential closure map audited; earlier 2–4 evidence retained. Deferred role/layout and request/live-order checks mapped to 27–29. Current isolated moderation branch retained, support header defect open; see dated evidence.; 2026-09-26 23:17 retained checkpoint: shared read-only multi-image moderation editor and metadata verified in Group scope; 15/15 gallery tests. Group button overlap and empty read-only policy section repaired, editor/admin layout checked. App-admin companion and actor windows retained; Maya Base Feed draft NOT published. Evidence GROUP-LIFECYCLE-001-block6-resume-20260926.json. No block-6 PASS. 2026-09-27 resumed: Base Feed multi-image readonly admin PASS; app-disabled creation accepted, enabled creation under-review; full Group/nested policy readonly verified. See block6-continued evidence. Group support scope/read/reply/retry and HU verified. Late moderation response resurrected row: fixed and real delayed-response on-the-fly replay PASS; counters preserved. 2026-09-27 01:08: HTTP block 6 PASS; confirmation waits for save/failure retains state, notification delta adapters repaired and browser read/retry PASS, concurrent member/read PASS, Main realtime aggregate PASS, Event/Asset readonly previews PASS, member labels fit360px. 17 moderation/dialog +2 adapter tests PASS. Exact after-moderation-checks savepoint verified; resume7. Local NOT RUN. 2026-09-27 01:30: HTTP block7 PASS: voluntary leave→Trash→accepted Restore; admin remove→blocked→pending Restore→admin approval. Failure/delay/retry/direct403 bypass checks and live retained UI verified;41 focused frontend tests PASS. Exact after-membership-trash boundary saved for8; Local browser NOT RUN. | 2026-09-27 02:55: Block8 Group/Main Event/group-owned Event admission and replay checked; HU desktop/mobile Group/Event/Affiliate Copy PASS. Removed Group member cannot bypass blocked/pending restoration with Event link. Fresh visitor location fixture corrected by explicit request. Exact cleanup pending; no block8 closure. See GROUP-LIFECYCLE-001-block8-progress-20260927.json. | Valid Maya replay: external group Event accepted, identical replay, blocked/pending restore cannot bypass Group approval, Admin approval restores Event access; UI writes only and independent Mongo reads. See GROUP-LIFECYCLE-001-block8-maya-20260927.json. No block8 closure. Main Event Maya UI Accept updated retained card1/10→2/10; duplicate link preserved exact normalized state, base/group Event memberships and prior referrer. Registration-first source route checked; fresh-account browser PASS not claimed. Native-browser registration replay: guides/qa/evidence/GROUP-LIFECYCLE-001-block8-registration-20260927.json. New Group/Event users persist real browser coordinates through UI; accepted memberships/replay PASS. Setup Update remains open; explicit Close resumes login for existing missing-location user. Watcher build PASS; new units/live Firebase NOT RUN. Block8 CLOSED: versioned restore-sharing scope verification PASS, independent reserved resources/fresh profiles zero, exact after-membership-trash savepoint verification PASS. Evidence: GROUP-LIFECYCLE-001-block8-cleanup-20260927.json. No replay of closed1–7. | Block9 in progress: Event/Asset two-message and mixed delta UI+Mongo PASS; intentional share-token network failure after asset deletions retained picker, Retry sent only outstanding two additions (49 messages). Evidence GROUP-LIFECYCLE-001-block9-chat-sharing-20260927.json. No block9 closure. | Block9 CLOSED 2026-09-27: complete chat sharing basket/delta/retry/paging/context/mobile HTTP chain, logout history race fixed and replayed. 13-scope exact cleanup, chat original41/zero paging, immutable after-chat-sharing captured resume10. Evidence GROUP-LIFECYCLE-001-block9-chat-sharing-20260927.json. Added overlay specs NOT RUN; owning watcher builds PASS. | 2026-09-27 block10 active: manual cash create/retry, Deleted state, red busy confirmation and refund request/approval replay; evidence GROUP-LIFECYCLE-001-block10-cash-20260927.json. 9/48 closed unchanged; checkout/affiliate controls pending. Cash refund live replay PASS; lost DELETE response/retry retains Deleted with one reversal. Short-window poll fix replay PASS. Checkout/negative controls remain; block10 IN PROGRESS. | Block10 latest: corrected referral prerequisite via exact versioned restore, valid cash exclusion/card EUR10 contribution+refund PASS. All eight recipient/payer denials plus unrelated deletion404 PASS with unchanged totals. Canonical header summary centralized in existing signal store; watcher03:17Z and both actor browser reads PASS. Points9/11 complete; point10 solely awaits cash-checkout accounting semantics. See block10-cash JSON pointStatus; no full block PASS. | Block10 CLOSED: final Cash-only booking accepted/no affiliate contribution; manual cash receipt separately proves history/totals/refund. Prior additional-booking-receipt expectation withdrawn as QA interpretation error; no semantics change. Barion/3DS-off restored. Exact cash restore and after-chat-sharing verification PASS; after-cash-history captured03:24:57Z resume11. Evidence block10-cash JSON finalCashBooking/cleanup. | 2026-09-27 block11 CLOSED: approved-only contact invitations/denials, retained overlays, recipient messages/unread reset, phone/share nesting, EN desktop/HU mobile; exact fixture restore PASS; after-contacts savepoint resume12. Evidence GROUP-LIFECYCLE-001-block11-contacts-20260927.json. | 2026-09-27 block12 CLOSED: selection limits including nested/mobile; contact consent cancellation/failure/retry/decisions, pagination/search, private methods, same chat/persistence and delayed group/account switch PASS. Exact contacts restore and after-contacts verification PASS; after-contact-controls captured resume13. Evidence GROUP-LIFECYCLE-001-block12-controls-20260927.json. | 2026-09-27 block13 CLOSED: empty HU/EN calendar notices retain blurred parent and produce no download; positive ICS download and libical import four events PASS. Desktop calendar UI NOT RUN. Blocks14–16 partial evidence retained in per-block JSON; no replay of completed subchecks. | 2026-09-27 block17 CLOSED for user-agreed HTTP Help/native anonymous MCP scope: current Codex conversation directly invoked MyScoutee topic list/read successfully. MCP connection UI create/reload/secret-hide/revoke also verified. No private OAuth or Local PASS claimed. Block18 X/Back and rapid reopen checks passed; remaining checks continue. | 2026-09-27 block18 CLOSED: physical Android native-Back defect fixed in shared overlay history owner; nested Back, X/Back, rapid reopen, busy refusal, desktop Forward/Router/reload and unchanged rating dock verified. Existing frontend-sync PASS05:46:29Z; unit specs not rerun. Evidence GROUP-LIFECYCLE-001-block18-20260927.json. Normal phone logout, owned browser/tunnel cleanup complete; ENTRY untouched. User requested STOP before19. | 2026-09-27 resumed19: actual demo selector admission, denied/unsupported GPS, isolated Zoe missing/invalid Setup cancel/retry and first profile persistence/reload partially PASS. False Location required race fixed; real stale null poll retest retained accepted point over12.4s. frontend-sync PASS15:24:34Z. One ENTRY-BLOCK19 window, Zoe snapshot retained. Block19 IN PROGRESS; counts unchanged. Evidence GROUP-LIFECYCLE-001-block19-entry-20260927.json. | 2026-09-27 18:22:19.1 HTTP complete incl invitation claim/first target profile/reload/replay and GPS-denied relogin; exact scoped cleanup. Avatar wait/error boundary and Setup disabled action verified.19.2 active:53/53 seed points accepted; Firebase config404 blocks real sign-in; pending-coordinate controls/Local remain. No count change. | User scope change2026-09-27: Firebase and actual external-client/provider-configuration checks moved to DEPLOY-EXTERNAL-CONFIG-001, DEFERRED/NOT RUN. They no longer gate Group19; continue demo pending-coordinate controls. | Block19 HTTP CLOSED in user-approved demo scope:53/53 seed points; two-account real login/profile-ext unsupported pending samples rejected with original points retained and per-account acknowledgement. Earlier failure/retry/claim/cleanup evidence retained.16/48 and16/29 closed;20 active. | 2026-09-27 block20 HTTP PASS/CLOSED: stored point with denied GPS and same-session reload; tracking OFF/save/reopen/ON; <5km zero writes, >=5km POST200; unsupported Paris POST403 retains accepted profile/cache/baseline/session and no popup; later eligible movement POST200. Independent Mongo point47.6747/19.0354 verified, normal logout then exact original47.5147/19.0354 restore, location snapshot removed. Evidence: GROUP-LIFECYCLE-001-block20-tracking-20260927.json. HTTP17/48 (35.42%), Lifecycle17/29 closed (1–13,17–20);21 active. Local NOT RUN; older contact/badge snapshots retained. | User clarification 2026-09-27: testcases are independent closed execution units. Transferred checks are CLOSED BY SCOPE TRANSFER in the source, not pending dependencies. DEPLOY-EXTERNAL-CONFIG-001 requires its own fixture, restaging, entry checkpoints, execution and cleanup; prior/cross-case evidence cannot substitute. Transfer provenance stays in the ledger, not executable cross-case references. Audit the remaining NOT RUN cases only at the current testcase boundary, before advancing to another testcase. | 2026-09-27 block21 HTTP partial: seven audited menu surfaces, profile multiselect, pricing scope and card menus exercised; HU320/EN360/desktop1100 representative checks. Notification launcher overlap and forced-sheet desktop X repaired and replayed through existing frontend-sync. Assignment basket restaged with own Group fixture and exactly restored, no assignment/share/checkout commit. Checkout optional-item menu remains NOT RUN because selected real event/date combinations returned no available slots; suitable own checkpoint required. Do not mark full21 closed. Evidence GROUP-LIFECYCLE-001-block21-menus-20260927.json. HTTP17/48 and Lifecycle17/29 unchanged. | 2026-09-27 block21 HTTP PASS/CLOSED: final checkout optional-card control used its own versioned Group slot fixture. Native pointer selected/reverted optional item; mobile X remained reachable and closed only the sheet with parent dialogs/scroll retained; desktop title/no mobile X PASS. No checkout writes; draft discarded. Exact restore-sharing completed and original contact/badge snapshots retained. Together with the recorded seven menu surfaces, profile/price controls and HU/EN smoke,21 is closed. Evidence GROUP-LIFECYCLE-001-block21-menus-20260927.json. HTTP18/48 (37.50%), Lifecycle18/29 (1–13,17–21);22 active. Local NOT RUN. | 2026-09-27 block22 HTTP PASS/CLOSED: Design Circle UI create/edit/delete persisted Base asset ownership; Main/Design Circle/Seattle Friends inventory and immediate asset counters match, event counters remain separate. Real response-stage delayed long-poll released after deletion did not resurrect count; no page reload. Own scoped fixture public Asset booked to an inaccessible Language Lab event remains in Explore (UI + three-profile authenticated reads); own/private/non-friend controls absent, foreign Event/private Asset details withheld with empty HTTP200. Event Explore UI changes with workspace. Existing Group chat preparation and tools fixtures exactly restored; no chat share submitted. Evidence GROUP-LIFECYCLE-001-block22-tools-20260927.json. HTTP19/48 (39.58%), Lifecycle19/29 (1–13,17–22);23 active. Local NOT RUN. | 2026-09-27 block23 HTTP PASS/CLOSED: independent Group Asset checkout captured HUF3200 on Design Circle payer; Maya Base reads the same stored payment as income, Base/other Group controls excluded. Real owner acceptance and payer refund request/recipient approval reversed HUF3200 on the same payer/recipient; one capture plus normal refund audit. Initial unknown provider-card fixture caused one failed attempt; repaired via snapshot-protected real provider card registration, not a manufactured payment. Card revoked and restore-sharing exactly verified. Base/Group Profile/Affiliate/API/history and bounded Feed/Impressions/Chats/Ticket scope smoke recorded; empty ticket views supported by account-scope/converter source review, no populated-ticket visual claim or exhaustive nested-screen sweep. Shared booking-row badge overlap fixed and watcher/mobile320/360/desktop1100 verified. Evidence GROUP-LIFECYCLE-001-block23-profile-payments-20260927.json. HTTP20/48 (41.67%), Lifecycle20/29 (1–13,17–23);24 next. Local NOT RUN. | 2026-09-27 block24 HTTP checklist scope PASS/CLOSED: own contact snapshot; Group Create contact candidate account resolution repaired, eight real candidates returned. Saved contact request/reject/re-request/approve passed; one Base-account conversation, same senders and read receipts under Main/Design Circle; delayed old-account HTTP response did not replace the new account contact list. Contact snapshot restored exactly. Independent free resource fixture: account-owned Asset assigned by the participating Design Circle profile; persisted request retained that participant profile. Base/Seattle Friends subjects without target Event membership returned403. Assets remain usable from any workspace; authority comes from target Event/group membership. Both Base- and Group-held tickets visible from all three workspaces; scanner rejected forged actor bodies from Base/Seattle and accepted authenticated Design Circle despite Base body, persisted correct usedByUserId and attendance. No saved contacts meant zero Event invite candidates despite prior-met profiles. Exact restore-sharing PASS. Shared empty-state spans full grid; user-requested entire contact headline row removed without replacement, watcher/UI verified. Extra forged resource-subject probe under optional-auth dev policy is separately recorded as unproven authenticated-policy boundary, not a security PASS. Evidence GROUP-LIFECYCLE-001-block24-account-contacts-20260927.json. HTTP21/48 (43.75%), Lifecycle21/29 (1–13,17–24);25 next. Local NOT RUN. | Correction:24 closure superseded by reopened forged-resource-actor repair; user requested Java verification without E2E. | 2026-09-27 block24 authorization correction and closure: user explicitly required direct forged-actor assignment rejection, then requested Java verification and excluded E2E. Reopened premature closure; removed optional-auth/demo bypass from resource-assignment submit/manage checks, using authenticated caller and existing policies. Added demo forged-subject/no-write, anonymous and valid-admin regressions; updated obsolete anonymous dev acceptance. Existing main watcher compile/restart PASS20:33:41 local. 19 focused JUnit authorization/resource-service tests PASS (zero skips/failures), reusing existing main outputs and cached test dependencies; no second main build/Gradle/server and no post-fix browser/E2E replay. Valid accepted member/admin and parent Event/generated-group assignment remain allowed; missing membership/forged actor rejected before writes.24 now closed on prior HTTP lifecycle plus this user-approved Java-only repair verification. HTTP21/48, Lifecycle21/29;25 next.24 fixtures and temporary25 notification snapshot were exactly restored. | 2026-09-27 block25 partial PASS: EN320/360/1100 and HU320 notification layout verified; remaining account notification/live-counter branch not yet executed. UI-issued Base and Photo Walks API keys used while Seattle Friends selected: Base asset and Photo Walks event created under their issuing profiles; Group JSON/multipart asset requests returned403 both from Seattle Friends and after Base selection, without created assets/external-ID mappings. Authentication filter rejects before image-controller ingestion; separate object-store inventory was not captured. Real UI Leave group caused Group key403; Base key Revoke caused401. Exact versioned restore-profile-api PASS, membership restored, generated resources/mappings/dependents and the newly created affiliate link removed; old keys retained. Shared menu checkmark moved before badges in all three list item variants; watcher PASS18:52:18.930Z and actual checked/unchecked rows share badge right edge336.125px at360px viewport. Evidence GROUP-LIFECYCLE-001-block25-notifications-api-20260927.json.25 remains IN PROGRESS for notification account scope/live counters and confirmation wording; HTTP21/48 and Lifecycle21/29 unchanged. | 2026-09-27 block25 HTTP PASS/CLOSED: notification layout and API-key scope evidence retained; versioned group notification inputs with actual read mutations verified All/Base/group filtering and account counter23→22→21 across Design/Seattle/Base. Original fixture counter drift recorded separately; aligned prerequisite before assertions, exactly restored afterward. Missing notification group label repaired in existing source subtitle. Real contact request/cancel/approve drove pending1→0 and account approval notification visible from Seattle; own snapshot restored. Independent two-group ticket inputs returned2 in Base/A/B; real Seattle Leave event canceled then confirmed, ticketD/member suppressed and both account ticket counters1, one Design ticket in all profiles. User-requested ticket group label added to existing metadata line; watcher/mobile PASS. Confirmation source audit99 objects/82 EN-HU keys plus bounded runtime/cancellation/320px HU check recorded separately; not every dialog executed, no extra unit runner. Exact temporary fixture/dependent cleanup PASS. Evidence block25-notifications-api-20260927.json and block25-confirmation-audit-20260927.json. HTTP22/48 (45.83%), Lifecycle22/29 (1–13,17–25);26 active. Local NOT RUN. | 2026-09-27 21:37: Block26.1–4 own HTTP execution: grants and revocations preserve provenance; Admin-first owner handover, ordinary-member fallback, sole-Admin step-down verified. Trash Restore returns former creator as Member; normal invitation return, last-member deletion and remaining notification/UI checks continue. Same-actor takeover retry200 is idempotent, competing403; pending fallback403/outsider404. See block26-admin-authority-20260927.json. Block26 remains IN PROGRESS. | 2026-09-27 22:00: Block26 HTTP PASS/CLOSED. Own grants/revocations, Admin-first and ordinary-member fallback, sole-admin step-down, normal invite and Trash return, final-member deletion and user-corrected recovery verified. Corrected rule: Deleted card remains in Trash; any voluntarily departed Admin can restore group/responsibility, ordinary member has no Restore and direct restore/join404 until admin recovery; then Member Restore succeeds. Earlier departed Admin cancel/confirm and idempotent retry proven. Exact notification read/avatar173→172/group2→1 survives reload. Shared Deleted badge bottom-right and common X16px centered. Local25+store2+popup6+converter12 focused tests PASS (45 distinct), full Local browser NOT RUN; Java mapper spec added/not run separately. Existing dev watchers compiled, exact fixture cleanup PASS. HTTP23/48 (47.92%), Lifecycle23/29 (1–13,17–26);27 next. See block26-admin-authority-20260927.json. | 2026-09-27: Blocks27–28 HTTP PASS/CLOSED. Three-role roster, responsive editor EN/HU, requested mobile single-column fix, normal/Admin/Operator header smoke. List summary/detail/nested-rule request boundaries verified. Existing watcher build; exact temporary fixture cleanup. Evidence block27-presentation-20260927.json and block28-requests-20260927.json. HTTP25/48, Lifecycle25/29;29 next;14–16 retained partial; Local NOT RUN. | 2026-09-27: Block29 HTTP PASS/CLOSED. Live Activities/Event Explore seven exact distance boundaries; Group save third→first, duplicate409/version2, sync200, scroll51 retained. Shared SmartList sticky-date refresh fixed and own fresh restage retest passed. Existing watcher build, exact14-event/Admin fixture cleanup. HTTP26/48; Lifecycle26/29;14–16 partial retained. Evidence block29-distance-ordering-20260927.json. | 2026-09-27 final closure: user accepted round badges with compact chevron. Remaining branches14–16 physically separated into independent deployment blocks4–6; source scopes CLOSED, not pending dependencies. Retained successful editor/landing/help evidence closes source; no new external/device PASS. HTTP29/29 current scope, Group29/48; Local full run NOT RUN. Next Group Isolation NOT STARTED. See GROUP-LIFECYCLE-001-scope-closure-20260927.json.

### Manual QA priority

P1 74

## GROUP-ISOLATION-001

### ID

GROUP-ISOLATION-001

### Type

Group regression journey

### QA domain

Group

### Area

Workspace privacy and domain samples

### Scenario

Nine independent blocks: Event lifecycle/private requests; home ratings/filters/Feed/Following; late replies/notification targets; moderation switch; revocation; support history; invitation authority/pending replies; contact reads versus Event unread. Shared Social menu toggle/count included in block3.

### Statistics

INDIRECT only existing producers; compare before/after

### Monitoring / Metrics

DELTA authorized writes and denied cross-scope requests; no secrets

### Affinity Graph

INDIRECT workspace-owned rating/following mutations only

### Admin Jobs

INDIRECT configured moderation worker only; no invented scheduling rule

### Domain / other UI

DELTA only the owning workspace; no cross-workspace private detail/write, relationship, card exclusion or counter leak. Group-admin moderation is scoped to its group.

### Manual status

CLOSED / PASS — HTTP scope

### Dev

9/9 HTTP isolation blocks PASS; exact fixture/session restore complete.

### Local

NOT RUN

### Last manual date

2026-09-28

### Automated coverage

31 focused backend moderation/chat/counter tests PASS (2026-09-25): separate scope settings, authority/foreign IDs, persisted pending count and idempotence, worker, Group support access/filter/unread. Earlier 15 filter/invitation tests PASS (2026-09-24). Frontend/backend dev watchers compiled. Full local/UI/HTTP journey NOT RUN. Profile selection correction: 21 focused Java tests PASS (2026-09-25); profile-load parameter, read-only restore, accepted-membership authority, failed-load non-commit, invite activation and removal. Added frontend HTTP parameter/retry unit cases; not executed separately from the running build watcher. | 2026-09-28:10 targeted policy JUnit tests PASS; existing watcher-built main classes reused. | Block3:10 workspace filter JUnit tests PASS; watcher main classes reused. | Block8:7 unique ChatService authority tests PASS; App/Group support and foreign-account conversation no-write checks. Existing watcher compilation PASS.

### Next manual oracle

Closed. Next: checklist directories aligned to QA domain, then INTEGRATION-API-GROUP-001 prerequisite development before testing.

### Result

PASS

### Evidence / notes

guides/qa/checklists/group/GROUP-ISOLATION-001.md; Added 2026-09-24. No campaign fixture or browser actions executed. Priority I/L/A/N/O=5/5/4/4/5; effort actions/extra actors/oracles/boundaries/restore/external=40/2/5/5/1/0. Finalized 2026-09-25: app-admin configurable Group review; group-admin Asset/Event/Feed scope; write-side badges propagated through signal store/SmartList without reload; Group support channel and separate unread count. Profile loading owns activeWorkspaceGroupId persistence; no per-request group header. Checklist includes shared loading state, timeout retaining prior selection, same-target retry and stale responses. Manual results remain NOT RUN. | 2026-09-25: sharing batch and discovered eventless-support regression checklist expanded; execution remains NOT RUN, no manual result claimed.; 2026-09-26 NOT RUN micros: separate direct-chat request/approve/reject; recipient-only notifications; approval saves public contact; write-side pending counter vs saved-contact count; search-row icon+label menu on mobile; SmartList live remove/insert; blurred confirmation; retry, stale version and workspace isolation. See existing GROUP-ISOLATION-001 checklist. | 2026-09-27: queued next after user-requested Group Lifecycle closure. User explicitly prohibited starting now; no fixture/browser/test action performed. | 2026-09-28: explicit full-flow automation authorized. Exact duplicate assertions removed after evidence audit; 9 unique blocks remain, no inherited PASS. Own namespace baseline verified and two managed sessions launched. Execution: guides/qa/evidence/GROUP-ISOLATION-001-20260928.md. | 2026-09-28 block1 HTTP PASS: UI create/invite/publish/accept/message; A event h1790547269571, two accepted members and two chat copies. Base/B lists and domain counters empty; A reopen intact. Own after-block1 checkpoint captured. Evidence GROUP-ISOLATION-001-block1-20260928.json. | Block2 HTTP PASS after private member/demo lifecycle authority repairs.32 negative requests403/404; forged profile/group/header rejected; Event/member/chat/notification/counter oracle unchanged. A reads and Unpublish→Publish200; exact own snapshot restored. Evidence GROUP-ISOLATION-001-block2-20260928.json. | Block3 HTTP PASS: own canonical-ID fixture replay, scoped Home writes/filter clear/profile edit, shared Social toggle, distinct Feed receipts and A Following; Base/B unchanged. Shared profile-view routing repaired, actual profiles render. Evidence GROUP-ISOLATION-001-block3-20260928.json. after-block3 captured. | Block4 HTTP PASS: real A poll canceled on UI close/switch, B retained, A reopen intact; same-name notification selected exact A target from B. Domain snapshot unchanged. Evidence GROUP-ISOLATION-001-block4-20260928.json. | Block5 HTTP PASS: real A moderation preview held then released after UI B switch; B queue2/settings retained, A reopen queue1. Mongo state/items/groups/posts unchanged. Evidence GROUP-ISOLATION-001-block5-20260928.json. | Block6 HTTP PASS: real admin removal, ordinary refresh to Base, private requests denied; Base/B controls preserved except legitimate removal notification. Exact before-block6 restored. Evidence GROUP-ISOLATION-001-block6-20260928.json. | Block7 HTTP PASS: support history45, real members,24 denials, late A messages response released in B; chats6/messages48 unchanged. Evidence GROUP-ISOLATION-001-block7-20260928.json. | Blocks8–9 HTTP PASS 2026-09-28: approved-only picker, actual request/approval/invitation, delayed picker across workspace/account, pending-write modal guard and canonical5members; account contact read receipts in Base/A, A/B Event chats/messages/unread counters unchanged, scoped Event-share lists. Obsolete switch-behind-pending-modal attempt was not executable UI and is not counted as cross-scope mutation proof; checklist aligned with existing blocking-save contract. Exact fixture + pre-launch sessions restored; managed windows closed. Full Local NOT RUN. Evidence: GROUP-ISOLATION-001-block8-progress-20260928.json; GROUP-ISOLATION-001-block9-20260928.json; GROUP-ISOLATION-001-cleanup-20260928.json.

### Manual QA priority

P0 92

## MSC115-INVITE

### ID

MSC115-INVITE

### Type

Flow

### QA domain

Group

### Area

Shared links, workspace registration and promotion

### Scenario

MSC-115 steps 18–20: Work/Community shared links, registration/claim, workspace membership and independent Dating behavior. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

NOT RUN

### Automated coverage

See guides/plans/MULTI_GROUP_PRODUCT_DIRECTION_2026_10.md; code/build checks do not establish manual PASS.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 user-requested synchronization: current steps 18–20; old scenario wording replaced by the active checklist. No new test or PASS claimed.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## MSC115-WORK-CAMPAIGN

### ID

MSC115-WORK-CAMPAIGN

### Type

Flow

### QA domain

Group

### Area

Campaign authoring and discovery

### Scenario

MSC-115 steps 21–24: Campaign authoring/lifecycle, images and document tables, published picker, Home discovery and Details/Organizer navigation. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

PARTIAL — recorded samples

### Last manual date

2026-10-15

### Automated coverage

See guides/plans/MULTI_GROUP_PRODUCT_DIRECTION_2026_10.md; code/build checks do not establish manual PASS.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 ledger reconciliation: HTTP campaign create/edit/publish/unpublish/trash/restore and document save/download passed. Local/HTTP Details-to-Organizer and published campaign picker checked. Evidence: guides/qa/evidence/work-community/MSC-115_AUTOMATIC_20261013.json currentBlock (archived during this reconciliation). Full case remains open; no new test was executed for this status correction. | 2026-10-13 user-requested synchronization: current steps 21–24; old scenario wording replaced by the active checklist. No new test or PASS claimed.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## MSC115-WORK-RATING

### ID

MSC115-WORK-RATING

### Type

Flow

### QA domain

Group

### Area

Person ratings with optional Campaign context

### Scenario

MSC-115 steps 25–29: Person aggregates and campaign history; campaign menu opens scoped Ratings, ordinary Ratings clears scope; revision, event-priority control and domain-specific criteria. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

PARTIAL — recorded samples

### Last manual date

2026-10-15

### Automated coverage

See guides/plans/MULTI_GROUP_PRODUCT_DIRECTION_2026_10.md; code/build checks do not establish manual PASS.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 ledger reconciliation: HTTP and local 8/9 person mean8.5, revision to9.5, campaign history state and HTTP unchanged-rating notification dedup passed. Aggregate has no fabricated criteria. Evidence: guides/qa/evidence/work-community/MSC-115_AUTOMATIC_20261013.json executionBlocks[0]. Full case remains open; no new test was executed for this status correction. | 2026-10-13 user-requested synchronization: current steps 25–29; old scenario wording replaced by the active checklist. No new test or PASS claimed.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## MSC115-SERVICE

### ID

MSC115-SERVICE

### Type

Flow

### QA domain

Group

### Area

Community service sheet and priority discovery

### Scenario

MSC-115 steps 40–45, 95–99: Community service discovery, owned sheets, staff pills, service link and provider calendar; case-completion feedback worker, shared Feedback list and criterion statistics. Reuse SERVICE-FEEDBACK-UI-001 evidence for overlapping form checks. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

NOT RUN

### Last manual date

2026-10-15

### Automated coverage

See guides/plans/MULTI_GROUP_PRODUCT_DIRECTION_2026_10.md; code/build checks do not establish manual PASS.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 user-requested synchronization: current steps 40–45, 95–99; old scenario wording replaced by the active checklist. No new test or PASS claimed. | 2026-10-14 resumed40: discovery/lifecycle/staff/link HTTP observations and shared UI fixes; canonical demo images retained. Full local/template/KVM gates pending. See MSC115-step40-45-services-20261014.json; no whole-block PASS.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## MSC115-CASE

### ID

MSC115-CASE

### Type

Flow

### QA domain

Group

### Area

Cases lifecycle, member access and task board

### Scenario

MSC-115 steps 46–51, 58–63: Group-scoped case creation, member/admin ownership and lifecycle; task board, assignments, quotations, dependencies, agreed dates and provider calendar. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

NOT RUN

### Last manual date

2026-10-15

### Automated coverage

See guides/plans/MULTI_GROUP_PRODUCT_DIRECTION_2026_10.md; code/build checks do not establish manual PASS.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 user-requested synchronization: current steps 46–51, 58–63; old scenario wording replaced by the active checklist. No new test or PASS claimed. | 2026-10-14: step46 shared-picker clear-All/save/reopen/reload HTTP PASS, persisted version2 empty audience, accepted creator/admin retained. Step47 task badges4/2/0/0 and case/category totals match persisted state. See guides/qa/evidence/work-community/MSC115-step40-45-services-20261014.json; overall row remains IN PROGRESS. | 2026-10-14:48 HTTP member/manager read-only and unrelated404 verified.49 read-driven version conflict repaired in backend/local;2 embedded Mongo and7 local tests PASS; live original admin confirmation survives member read (0→0, then command0→1). Lifecycle tail and Water leak counter baseline remain open. | 2026-10-14 follow-up: Water leak counters reconciled through normal Save;49 lifecycle/bucket/sidebar and persisted notification recipient checks passed.50 membership/ownership terminal branches passed after backend/local current-state command fix; original Leave0 succeeds after Join1 without reopening.3 embedded+6 standard+9 local tests PASS; menu390x568 scroll PASS. Notification UI, other-actor menu convergence and KVM remain open. | 2026-10-14 notification follow-up: Maya View case opened the correct task board, unread28→27, case version unchanged3. See current evidence. | 2026-10-14:58 mobile swipe/end gutter+desktop columns PASS;59 HTTP task roles/quotation guards, profile-poll cached converted price≈378.75EUR with zero per-card requests;60 clear-all/save/reload/restore PASS.51 real shared dates and cycle-error header placement PASS.61 Reopen/Start/Complete PASS, deletion tail pending.9 backend+23 frontend+1 transport tests and assembly audit PASS. App-only fix, template N/A; prior calendar runtime gate remains. | 2026-10-14:61 retained deletion/status preservation/self-dependency and63 provider-calendar removal PASS over HTTP;62 Evan accepted quotation terms verified. Stale provider-list exclusion reconciled to existing step54/product rule, no access change. See named work-community evidence.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## MSC115-CASE-PROVIDER

### ID

MSC115-CASE-PROVIDER

### Type

Flow

### QA domain

Group

### Area

Recommendations, provider invitations and quotations

### Scenario

MSC-115 steps 52–57: Chat-based provider recommendation/invitation; quotations, provider-specific quotation conversations, notifications and private-workspace isolation. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

NOT RUN

### Last manual date

2026-10-15

### Automated coverage

See guides/plans/MULTI_GROUP_PRODUCT_DIRECTION_2026_10.md; code/build checks do not establish manual PASS.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 user-requested synchronization: current steps 52–57; old scenario wording replaced by the active checklist. No new test or PASS claimed. | 2026-10-14:52–54 HTTP/UI recommendation/invite/join, HUF quotation save/reload, member/provider read-only, admin edit/reversible status buckets PASS. Currency uses existing profile poll/owner;19 backend+25 frontend+1 transport tests PASS and assembly audit PASS. Shared policy layout and signal-driven menu/trigger counters verified390px; status write made no extra case read. No template equivalent for these application-only fixes; prior calendar template runtime stays open. Evidence: guides/qa/evidence/work-community/MSC115-step40-45-services-20261014.json. | 2026-10-14:55–57 stable separate quote-group chat across3 actors/All/Cases; competing-provider404 with own200; four notification destinations; repeat-invite accepted/version stable; private group/announcements404 with owner200; decline keeps history200 but revokes own chat404, then Join restores accepted15.3 focused JUnit PASS. No production change.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## MSC115-SCHEDULE

### ID

MSC115-SCHEDULE

### Type

Flow

### QA domain

Group

### Area

Scheduled task and 45-day case reminder

### Scenario

MSC-115 steps 70–75: Personal/group schedules, 45-day occurrence boundary, case takeover, idempotence, recurrence progress, suspend/delete/restore and live counters. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

NOT RUN

### Last manual date

2026-10-15

### Automated coverage

See guides/plans/MULTI_GROUP_PRODUCT_DIRECTION_2026_10.md; code/build checks do not establish manual PASS.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 user-requested synchronization: current steps 70–75; old scenario wording replaced by the active checklist. No new test or PASS claimed. | 2026-10-14:70 HTTP UI PASS: labelled separate popup/counter1; yearly passive row/affected4/menu; overview personal creation; entered Park Court admin defaults all3; ordinary Maya remains personal; no group selector. Original Riverside affected4 survives profile open/close, shared picker All/4. No schedule saved; no original task mutated. See work-community evidence and /tmp/msc115-20261014/schedule70-partial.json.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## MSC115-VOTING

### ID

MSC115-VOTING

### Type

Flow

### QA domain

Group

### Area

Member voting rights and final votes

### Scenario

MSC-115 steps 82–87: Accepted-member voting rights, one final ballot per member, preserved ballots on revoke/regrant, results, deadline/worker and Voting filters. No apartment/unit weighting. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

NOT RUN

### Automated coverage

See guides/plans/MULTI_GROUP_PRODUCT_DIRECTION_2026_10.md; code/build checks do not establish manual PASS.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 user-requested synchronization: current steps 82–87; old scenario wording replaced by the active checklist. No new test or PASS claimed.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## SERVICE-FEEDBACK-UI-001

### ID

SERVICE-FEEDBACK-UI-001

### Type

Feature extension

### QA domain

Group

### Area

Service feedback UI

### Scenario

MSC-116 service image and event FormFlow switch/radio choices; no text input; shared badge; EN/HU guide extension

### Statistics

X

### Monitoring / Metrics

Existing operation and error evidence only

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

See stable checklist

### Manual status

NOT RUN — extension pending

### Dev

NOT RUN

### Local

NOT RUN

### Automated coverage

Focused regression source prepared; execution deferred by user.

### Next manual oracle

Run checklists/general/SERVICE-FEEDBACK-UI-001.md with approved feedback fixture in HTTP/local modes. | Template baseline is closed; assess newly found defects, carry over affected fixes and run only their targeted template regression. | Shared execution with MSC-115 steps95–99: reuse matching evidence; run only checklist assertions not already proven there.

### Result

NOT RUN

### Evidence / notes

MSC-116. Watcher compilation and schema generation are not behavioral QA. Existing guide/API PASS does not cover this extension. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement.

### Manual QA priority

P1 80

### Remaining QA complexity (min/max)

30/60

## ARTICLE-EDITOR-001

### ID

ARTICLE-EDITOR-001

### Type

Checkpoint

### QA domain

Content

### Area

Admin Article Editor

### Scenario

Create, save and reopen one English Article draft; image upload is a subcase of the owning Save flow

### Statistics

X

### Monitoring / Metrics

X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Title, excerpt, canonical managed image URL and Article HTML persist once; admin list requests medium and the admin viewer body requests large

### Manual status

MANUAL UI PASS

### Last manual date

2026-08-05

### Automated coverage

Backend admin idea/content HTTP coverage plus frontend Article list/viewer, managed-HTML variant, paste and focused Article service coverage

### Next manual oracle

Proceed to LANDING-ARTICLE-001 with the retained draft; keep publication outside this checkpoint

### Result

PASS

### Evidence / notes

ARTICLE-SRC-002 saved and reopened with title, excerpt, body and one canonical large.webp URL in Mongo imageUrl/imageUrls plus HTML. The list requested medium.webp; the viewer requested large.webp 200 and rendered without a broken link. Source 1229x706; variants 128x74, 640x368 and 1229x706, all HTTP 200. Delete-without-replacement removed the HTML reference and all four stored objects while preserving the body. Raw-HTML and URL copy-paste regressions were fixed and focused frontend 5/5 plus IdeaPostsService tests passed.

### Manual QA priority

P0 94

## LANDING-ARTICLE-001

### ID

LANDING-ARTICLE-001

### Type

Checkpoint

### QA domain

Content

### Area

Public landing / Articles

### Scenario

Publish the retained Article and compare a fresh landing load with any already-open landing surface

### Statistics

X

### Monitoring / Metrics

X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

A fresh landing load shows the published Article exactly once with the expected count, medium card image and large body image; refresh/live-update behavior is recorded explicitly

### Manual status

MANUAL UI PASS

### Last manual date

2026-08-05

### Automated coverage

Backend ContentMedia HTTP E2E proves published inclusion and deleted exclusion; frontend landing specs cover featured/regular lists and large body-image rendering

### Next manual oracle

Proceed to CHAT-AUTH-001; no Article republish or landing retest is required

### Result

PASS

### Evidence / notes

Pre-publish landing content and full list both reported 5 and excluded ARTICLE-SRC-002. One publish kept All 7 and Featured 4 stable while Published changed 5->6 and Drafts 2->1. Fresh APIs reported total 6 and exactly one QA article. The already-open list stayed at 5 without live update; hard refresh showed 6 and the QA card once. Card medium.webp and detail large.webp both returned 200; landing detail rendered title, body and image without a broken link.

### Manual QA priority

P0 92

## CONTENT-ADMIN-LIFECYCLE-001

### ID

CONTENT-ADMIN-LIFECYCLE-001

### Type

Consolidated journey

### QA domain

Content

### Area

Admin content lifecycle

### Scenario

Create/reopen four scoped inactive revisions, activate Privacy with per-user consent, delete inactive and active controls with fallback, then trash/restore/republish one disposable Article

### Statistics

X; INDIRECT public/admin bucket count

### Monitoring / Metrics

DELTA four draft revisions/version/base/author and exact audits; DELTA one active Privacy revision and one actor consent; DELTA inactive deletion and active-delete fallback audit; DELTA Article lifecycle state/buckets and telemetry

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

Drafts persist once while active public content remains unchanged; fresh clients show exact activated Privacy and only stale users require approval; historical consent remains immutable; inactive deletion preserves its active control; deleting isolated active Privacy selects newest remaining same-scope fallback without empty public content; Article Published/Trashed/Draft action sets and buckets reconcile once; Restore stays non-public until separate Publish; identity/media remain stable

### Manual status

PASS / CLOSED

### Dev

PASS

### Local

PASS

### Last manual date

2026-09-04

### Automated coverage

Accumulated Ava/Kai/Riley UI journey; guarded revision and Article savepoints; terminal Mongo identity/content/audit/consent/control oracle; two managed-image HTTP size/SHA-256 oracles; running backend/frontend watcher builds; focused frontend 3/3 and backend status-only save regression PASS

### Next manual oracle

Closed; repeat only after governed-content, consent, Article lifecycle, SmartList reconciliation or status-only save behavior changes

### Result

PASS

### Evidence / notes

The user completed the governed revision, consent, fallback and Article lifecycle UI journey. Restore confirmation and persisted Draft behavior worked across five moved Article cards. The guarded step-59 rollback preserved steps 1-58 and restored only the recorded exploratory Article changes. One final Publish returned exact buckets to 7/5/7/0/0. The terminal oracle retained exactly seven governed-content audits, Kai v3 consent, Riley's absent v3 consent, every negative control, Article identity and managed media; contentKey and contentHtml remained byte-identical. Both managed images returned HTTP 200 with their original size and SHA-256.

### Manual QA priority

P1 92

## MSC115-ANNOUNCEMENT

### ID

MSC115-ANNOUNCEMENT

### Type

Flow

### QA domain

Content

### Area

Private Community Home and document editing

### Scenario

MSC-115 steps 76–81, 100: Private Home notices/votes, document-table lifecycle, Ask the group admin, member visibility, read-only content and contextual badges. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

NOT RUN

### Automated coverage

See guides/plans/MULTI_GROUP_PRODUCT_DIRECTION_2026_10.md; code/build checks do not establish manual PASS.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 user-requested synchronization: current steps 76–81, 100; old scenario wording replaced by the active checklist. No new test or PASS claimed.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## MOBILE-PUSH-LIFECYCLE-001

### ID

MOBILE-PUSH-LIFECYCLE-001

### Type

Consolidated journey

### QA domain

Notifications

### Area

Physical-device notification lifecycle

### Scenario

With an Operator-tested active Firebase revision, use one disposable device to test foreground, background and closed delivery plus one ordinary Chat message; tap cold-start routing; then deny/grant permission and rotate/revoke/re-register the token

### Statistics

INDIRECT unread count; INDIRECT unread count becomes read after open; X

### Monitoring / Metrics

DELTA inbox/outbox/token delivery; DELTA real FCM delivery while app is closed; DELTA intentional read transition and route consumption; DELTA token lifecycle and delivery result

### Affinity Graph

X

### Admin Jobs

DELTA one notification delivery task; X; DELTA only for eligible current token

### Domain / other UI

Foreground shows one in-app item/counter and no duplicate system notification; One system notification appears; persisted unread stays one and no desktop control receives it; Exact authenticated route opens once; read occurs only after tap/open and does not replay; Denial is non-blocking; stale token is retired and later delivery reaches only new token

### Manual status

MANUAL PASS / CLOSED

### Last manual date

2026-09-15

### Automated coverage

Consolidates MOBILE-PUSH-001, MOBILE-PUSH-002, MOBILE-PUSH-003, MOBILE-PUSH-004 and CHAT-PUSH-001. Foreground notification code exists; ADB/manual observation not run; Requires real Firebase/FCM and physical device; not run; Deep-link and notification code exist; cold-start real-device flow not run; Token lifecycle implementation partial; real permission/rotation sequence not run

### Next manual oracle

Closed; continue NOTIFICATION-ADMIN-LIFECYCLE-001

### Result

PASS

### Evidence / notes

Source status: MOBILE-PUSH-001=DESIGN CAPTURED / REAL DEVICE NOT RUN; MOBILE-PUSH-002=DESIGN CAPTURED / REAL DEVICE NOT RUN; MOBILE-PUSH-003=DESIGN CAPTURED / REAL DEVICE NOT RUN; MOBILE-PUSH-004=DESIGN CAPTURED / REAL DEVICE NOT RUN. One desktop actor produces while phone replaces another observation phase; This specifically proves app-not-open delivery; Do not pre-mark new notification as read; Raw token never becomes QA evidence; An Operator-tested active Firebase revision is an environment prerequisite, not a Deployment testcase 2026-09-15 read-only preflight: ADB connected and original localhost WebAPK native notification permission granted; no USB mappings; phone build route inactive. Runtime Firebase revision0 inactive, no tested revisions/public config/credential envelopes; exact public firebase-config HTTP404. Casey/Nova/Riley exist with zero devices. Zero checkpoint messages/common snapshots; WebView status not-staged. No fixture mutation, message, browser launch or build. See Mobile Push device preflight in QA pack. Delivery remains NOT RUN; waiting for prior QA configuration location. Continuation supersedes missing-config blocker: local ignored Firebase files restored by fixture, genuine Riley provider identity and one device registered. Baseline 09:22Z. WebSocket context repair compiled; user haha message persisted 09:35:25Z, one inbox each Nova/Riley, counters Casey/Nova/Riley 0/1/2. Provider batch HTTP404; delivery remains unproven, SDK migration underway. Installed phone menu/popup no-close repair verified lifecycle38. See continuation in Mobile Push device preflight. User assists; inspect before actions to prevent duplicate sends. Foreground replay PASS09:46Z: SDK9.10.0 fixes provider batch404; worker visible-client guard fixes foreground system duplicate. Four direct Node worker tests PASS, existing owner builds passed. Marker5e9f8221-f05e-4f7f-80e9-dd4b15f7b355 sent09:45:24Z retry0/success1/failure0, one unread per Nova/Riley, Casey excluded, physical Android zero system notifications; New list marker once unread. Two prior user diagnostic messages retained. Current lifecycle39, fixture foreground-replay, section2 next. Home background PASS09:48Z: message5dfaba47-9347-4396-9429-e6f9945b66a9, outbox6aa9141df59d38d912af420b sent09:47:09.912Z retry0/success1/failure0. Phone hidden received exactly one worker notification with exact Chat tag/url; Android record1 before resume. Recents card return preserved timeOrigin1789465508440.1. New list row exactly once unread; counters Casey0/Nova2/Riley5. Background savepoint09:48:15.943Z. Settings variant next. Settings background PASS09:49Z: message6e4df2b0-9c9e-45cc-9125-e5fa721256e8, outbox6aa91489f59d38d912af420e sent09:49:00.318Z success1/failure0. Android Settings activity foreground, app hidden; one native/worker notification with exact background-settings body and Chat tag. Recents return preserved timeOrigin1789465508440.1; New list exact row once unread, counters Casey0/Nova3/Riley6. background-settings savepoint captured. Chrome variant next. Chrome background remains NOT PASSED: marker957517eb-0600-4055-81a0-06eb3f205257 outbox6aa914e9f59d38d912af4211 sent09:50:36.165Z success1/failure0, two unread inbox rows, but native shade retained previous Settings notification. With Chrome example.com foreground, PWA Notification.permission and Permissions API both denied while old UI signal still granted. Returning to installed PWA restores native granted. Native WebAPK permission granted; Chrome host permission denied USER_FIXED. No OS permission toggle was changed. User requires enabling through shared popup and backend device data through users poll -> shared signal, no lazy popup read. Backend users.devices already owns registration writes; added token-free notificationDevices projection to existing realtime response and signal propagation through side menu, HTTP/local adapters and popup with draft preservation. Native visibility/permission onchange observers added. Existing backend build passed09:58:40Z; frontend local mapper union fixed, final owner build passed10:01:47Z. Lifecycle41 1789466529464 now being activated. Direct live popup signal oracle and native replay remain pending; earlier foreground/Home/Settings passes retained. Lifecycle41 live signal verification PASS: real users poll2 projected fixture notificationsEnabled=false; restoring true switched the same open popup at poll3, no lazy fetch or reload. Native Chrome foreground then native denied/signal denied/popup selectedfalse/effectivefalse all matched. Device flag restored, token unchanged. Chrome native permission still blocked; popup-based enabling remains next. Chrome replay PASS 10:16:44Z: message65fe8c07-e273-4d42-87a8-d56f82e80e09 provider1/0, exact native/worker system notification while hidden; Recents same timeOrigin, one unread row, Casey0/Nova5/Riley8. User authorized temporary Chrome Android app-level notification grant after real lifecycle42 popup request remained denied; original denial snapshot retained for cleanup. Shared users-poll signal/native state verification passed. Cold start next; no prior phase replay. Cold-start message660828b8-0eab-4f49-8579-90160b314511 provider accepted but Chrome wake process killed by Android LOW_MEMORY before native notification. Separate resident-Chrome route diagnostic9590b1f9-804b-4a17-803a-2ff37dbd353c produced native notification; tap opened standalone Riley on Home with chatId unconsumed, zero read changes. Section2 step12 FAIL; nine messages, Casey0/Nova7/Riley10. ROLLBACK at user request: queue/inbox redesign, NotificationContent, changed tests and incomplete deep-link edits removed. Application source restored to pre-investigation baseline; earlier SDK/worker/menu/users-poll fixes retained. Withdrawn design tests are not current evidence. Existing worker Firebase availability guard retained; no new architecture. Step12 remains unresolved, saved fixture/devices preserved. 2026-09-15 focused cold-start-replay PASS lifecycle43: message1f0959d0-22cc-4a21-8d82-23c8e03f06c3, one native notification/exact Chat/message route; only Riley inbox6aa9220df59d38d912af422d read10:47:19.228555542Z; Back/normal relaunch no duplicate route/read. Casey0/Nova8/Riley10. Savepoint cold-start. Earlier stopped-Chrome LOW_MEMORY failure retained separately. Current two focused ChatService regressions PASS. User now explicitly authorized Firebase/device decision snapshot in existing queue; verification pending. 2026-09-15: 14 decision/worker tests PASS including actual isolated Mongo merge. Section3 permission-denied bb4ef0ae-622a-4871-b151-3abe0f3cf4cf: empty saved device maps, zero provider attempts/retries, inbox once; independent personal mute verified. Section4 replacement-token869b435c-b8c1-4028-bf12-a52a7a32c2eb: new token fingerprint only, FCM1/0, exact Chat/read once, Back/relaunch stable. Casey0/Nova10/Riley11. Native permission after OS deny required fixture grant restoration; no native-dialog PASS. Browser-neutral error verified on phone, i18n103 audit PASS. Cleanup pending.; 2026-09-15 user accepted PASS with retained native re-prompt and stopped-Chrome qualifications. Versioned rollback-mobile-push.py --apply PASS twice: seven snapshot collections restored and compared, provider identity verified absent, owned browsers closed, Chrome permission and screen restored, zero fixture/snapshot/message/outbox/inbox/device/new login audit remnants.

### Manual QA priority

P0 98

## BELL-RATING-LIFECYCLE-001

### ID

BELL-RATING-LIFECYCLE-001

### Type

Consolidated journey

### QA domain

Notifications

### Area

Rating, bell, Statistics and affinity lifecycle

### Scenario

Read the initial bell, save one controlled rating/feedback once, verify target notification and exact Statistics delta, let the real affinity worker finish and compare the changed/control graph pair

### Statistics

Rating/moderation deltas expected in future cross-surface run; Ratings timeline +1; Matching rates.synced rises by row count; INDIRECT two rating deltas after Statistics refresh; DELTA network graph summary after refresh

### Monitoring / Metrics

Notification/read and relevant domain flows; Matching rate/recompute flow rises; DELTA rating sync and recompute flow; DELTA scheduler/audit and recompute queue

### Affinity Graph

INDIRECT after rating recompute; Edge/score may change after recompute; DELTA mutualSingleCount and pair weight; same pair visible at depth 1; DELTA when edge inputs changed

### Admin Jobs

Affinity recompute/outbox conditional; Affinity recompute may run; Affinity recompute may run for both users; direct edge recompute also occurs during each sync; DELTA

### Domain / other UI

Read path, rating and feedback persist once; Slider selection only stages; Save queues once; the Met card remains and shows the score; frontend pushes at most 50 queued ratings on its 30-second cycle; One shared rating row retains both scores; viewer mapping, notifications and pair identity agree; DELTA terminal tasks and updated affinity/discovery

### Manual status

PASS

### Last manual date

2026-09-15

### Automated coverage

Consolidates BELL-RATING, STAT-010, GRAPH-RATING-001, JOB-AFFINITY. API/service tests; Rating and graph-science tests; frontend stage/save/batch timing unit contract not yet isolated; Rating/affinity service tests and graph endpoint tests exist; assembled two-browser to graph projection is manual; Fixture/worker/graph/common lifecycle tests

### Next manual oracle

Closed. Exact rating/graph/feedback fixture restoration verified; next ADMIN-MONITORING-001 preparation only.

### Result

PASS

### Evidence / notes

Source status: BELL-RATING=MANUAL FUNCTIONAL PASS; RATING BELL UI PASS; FEEDBACK/READ UI PARTIAL; STAT-010=MANUAL STATISTICS + BELL UI + FUNCTIONAL PASS; MONITORING/GRAPH PENDING; GRAPH-RATING-001=NOT RUN; JOB-AFFINITY=MANUAL FUNCTIONAL PASS. Historical rating/feedback API and database oracles passed. On 2026-08-04 Nova's UI showed exactly one unread New rating item from Casey with the expected timestamp after the frontend batch. Rating read transition and feedback notification presentation are still pending; English notification copy on the Hungarian page is an i18n observation.; Casey staged 4 for Nova and pressed Save once; the Met card remained and displayed 4. The delayed frontend batch reached the backend; fixture/API oracles passed exactly one stored rating, one outbox, one unread Nova bell, matching unread projection, and no Casey bell. Nova's 06:31 screenshot showed exactly one New rating item from Casey at 06:22. Statistics screenshots at 06:37/06:38 showed today's Ratings 0->1 and Matching/Rating activity 342->343, while Events/assets 1495, Communication 426 and Moderation 14 stayed stable. English notification copy on the Hungarian page is a nonblocking i18n observation. Monitoring/Graph effects remain separate.; Do not require a brand-new edge: seeded Met evidence may already create one. Active config currently weights mutual rating 10, mutual edge evidence 1, one-sided edge evidence 0 and Met evidence 0.5. Old materialized layout is a separate projection checkpoint.; Primary domain oracle passed; graph UI not manually qualified; 2026-09-15 delegated live run: first/reciprocal ratings4/3, one inbox/outbox per recipient, both read and New0, no self/duplicate. Stats Ratings0->2, matching342->344, unrelated counters stable. Both recompute tasks done. Seeded Met prerequisite retained at user request; event-end transition not tested here. Monitoring/graph/feedback and paired-row persistence assessment remain.; Final closure2026-09-15: shared-row4/3 UI replay and 12 service tests PASS; real graph layout14:02Z, Casey/Nova edge and unchanged controls/history PASS; feedback three targets and Maya read/reopen PASS. Final consistent-baseline oracle14:32:21.553Z preserves all465 rating identities and all input/Met/mutual fields, only one computed affinityScore changes; three real worker tasks done. Fixture now settles pre-existing reciprocal seed data through the normal worker before feedback, and can make only scoped pending tasks due to avoid the five-minute wait. All exact fixture/session resets PASS. See final Bell closure in QA pack; earlier paired-row and unclassified-worker claims superseded.

### Manual QA priority

P1 78

## JOB-MESSAGES

### ID

JOB-MESSAGES

### Type

Scheduled job

### QA domain

Notifications

### Area

scheduled-messages

### Scenario

Real scheduler dispatches due messages

### Statistics

X

### Monitoring / Metrics

DELTA scheduler/audit; INDIRECT Notifications/outbox

### Affinity Graph

X

### Admin Jobs

DELTA

### Domain / other UI

DELTA task audit plus notification/email result

### Manual status

PASS

### Last manual date

2026-09-15

### Automated coverage

Fixture/service/common lifecycle tests

### Next manual oracle

Closed; task results visible and exact fixture/runtime reset verified. Next BELL-RATING-LIFECYCLE-001.

### Result

PASS

### Evidence / notes

Primary domain oracle passed; 2026-09-15 startup only: existing scheduled-messages inactive-user fixture bound to versioned job-messages checkpoint and two managed Ava/fixture-user browsers. One Scheduled task, active/public user, no audit/delivery; scheduler held until arm. First launcher attempt failed waiting for an absent explanation guide and closed its owned windows; corrected per-checkpoint dismissal setting and second startup succeeded. No checklist worker action or PASS claimed.; Final startup readiness PASS after fixture profileFormVersion2 correction prevented onboarding redirect. Both configured identities/realtime verified; one Scheduled task, active user, zero runs/deliveries remain. Current section1 step1.; Full delegated execution2026-09-15: inactive task completed/affected1, profileI/inactive banner/rating controls absent, action delivery1 and affinity1; recent task rescheduled exactly30days, profileA/public/rating available, action delivery1/affinity0. Both no bell/email/failures. Exact oracles PASS, recent target telemetry pair ingested and Monitoring Healthy. Step12 public UI lacks task audit outcome: only dispatcher summary displayed, so not full PASS. Initial poll1800000ms required temporary compiled-dev60000ms override; original property restored after both exact resets. Final fixture artifacts0, browsers closed. Monitoring top alignment and one-line contained badges verified916/596/360px.; Step12 closure2026-09-15: existing Jobs poll now exposes latest12 task results with next due; separate dispatcher history unchanged. Real recent-user retest run506eea79-8b65-4724-9a6c-27b0b3916f4e: scheduled/affected0, due2026-10-15T12:52:04.201Z, exact oracle PASS. Open Ava UI updated automatically; reopened result retained;916/360px no overflow. Five focused AdminNotificationService tests and i18n audit PASS. Exact fixture/session/runtime restoration verified; managed windows closed. Full JOB-MESSAGES PASS/CLOSED.; Final user-requested table presentation: both tables show compact status icons and borderless info-outline/filled toggles; detail expands below the unchanged row. No rectangular fill/scaling/internal task identifier.916/360px verified; both mobile tables282px wide with no horizontal overflow. Presentation-only prepared result does not replace prior real worker evidence.

### Manual QA priority

P0 86

## NOTIFICATION-ADMIN-LIFECYCLE-001

### ID

NOTIFICATION-ADMIN-LIFECYCLE-001

### Type

Consolidated journey

### QA domain

Notifications

### Area

Admin rule, outbox and delivery lifecycle

### Scenario

Save/reopen/validate one safe rule, run it for one target, let the real outbox worker process it, compare task/outbox/inbox/bell and prove unchanged second-run dedupe before restore

### Statistics

X; INDIRECT unread count

### Monitoring / Metrics

DELTA runtime config revision/history; DELTA task, outbox and inbox identities; DELTA scheduler/audit plus pending/running/sent/failed; Pending/running/sent or failed and health correct

### Affinity Graph

X

### Admin Jobs

X; DELTA one named task/delivery; DELTA; Notification-outbox runState changes

### Domain / other UI

Invalid save is atomic and unrelated rule/outbox rows stay unchanged; Exactly one attributed delivery occurs and unchanged second run respects dedupe; DELTA terminal delivery/no-op/token cleanup as configured; Bell/Firebase/no-op and outbox row agree

### Manual status

PASS

### Last manual date

2026-09-15

### Automated coverage

Consolidates ADMIN-NOTIFICATION-RULE-001, ADMIN-NOTIFICATION-RUN-001, JOB-OUTBOX, MON-012. Notification rule tests exist; complete UI save/reopen/restore flow not run; Notification task/outbox coverage exists; end-to-end manual run not performed; Fixture/worker/common lifecycle tests; Outbox tests

### Next manual oracle

Closed; exact fixture reset verified. Next JOB-MESSAGES inactive-user.

### Result

PASS

### Evidence / notes

Source status: ADMIN-NOTIFICATION-RULE-001=DESIGN CAPTURED / NOT RUN; ADMIN-NOTIFICATION-RUN-001=DESIGN CAPTURED / NOT RUN; JOB-OUTBOX=MANUAL FUNCTIONAL PASS; MON-012=MANUAL CAUSAL PARTIAL. No delivery is implied by saving a rule; Admin self-notification remains an unchanged control unless policy says otherwise; Firebase-off oracle passed; STAT-012 browser evidence showed the shared outbox flow 228->229 and exactly one matching Nova bell. Direct read-only evidence showed the logical outbox pending because Firebase delivery is inactive and the notification-outbox job retained pending work as documented. The dedicated outbox Job Detail lifecycle and failure/recovery UI states remain pending.; 2026-09-15 versioned notification-admin baseline and three managed Ava/Nova/Casey browsers prepared. Original timing60 seconds, enabled true, target outbox/inbox0/0, actor counters0. Push is closed and fully cleaned up. New-message oracle follows explicit saved Firebase decision; legacy inactive Pending behavior is retained only for null snapshots. No manual rule edit or delivery claimed.; Section1 PASS: fixed detail Timing save to send only edited rule; UI/Mongo2min and invalid-fieldHTTP400 unchanged full rules/outbox/inbox digests. Section2 recipient baseline0/0 and one real Casey message18c4030e-ced6-491c-84e3-6678f2e5c7de gave Nova1/Casey0 in already-open UI. Fixture temporarily held worker and removed only its one Redis wakeup hint to isolate normal scheduler; logical durable item unchanged. First normal run armed11:59Z.; Section2/3 PASS: first scheduled run52ms/processed1, saved Firebasefalse/provider0/0; Nova read once and source Chat unread1. Monitoring fixed by ordering existing Mongo key-preservation post-processor before eager converter initialization; three focused tests PASS and live global queues0/0/0/308 agree. Responsive cards4columns at596px/2at360px, zero badge overflow. Second run df6b70e7-9cbf-4e47-b08e-6b4f8d26f421 completed35ms/processed0; exact same outbox/inbox/read timestamp. UI restored1minute/enabledtrue, then exact fixture reset verified zero controlled chat/message/outbox/inbox/member/snapshot remnants and all actor counters0. Owned browsers closed. No native Firebase delivery claimed for this inactive-config test.

### Manual QA priority

P0 96

## MOBILE-WEBVIEW-LIFECYCLE-001

### ID

MOBILE-WEBVIEW-LIFECYCLE-001

### Type

Consolidated journey

### QA domain

Notifications

### Area

Android WebView, ADB and authenticated-cache lifecycle

### Scenario

Use ADB to verify transport/tunnel, cold-start with old cache, resume after server mutation, switch/logout with authenticated caches and perform offline/online recovery

### Statistics

X; INDIRECT current counters

### Monitoring / Metrics

DELTA coherent service-worker/WebView cache generation; DELTA resume reconciliation revision; DELTA user-scope cache purge and new identity hydration; DELTA explicit transport/cache/offline diagnostic state

### Affinity Graph

X

### Admin Jobs

X; CONDITIONAL normal poll/task ownership only

### Domain / other UI

One coherent build loads and old HTML never references missing new chunks or mixed revisions; User, counters and open surface reconcile once; stale WebView state cannot overwrite server truth; Tickets, QR, counters and notifications disappear before next identity renders; public assets may remain; Offline exposes only supported ticket contract and reconnect converges without clearing app data

### Manual status

USER-AUTHORIZED ADB/CDP PASS / CLOSED

### Last manual date

2026-09-15

### Automated coverage

Physical Android: coherent old/candidate upgrade; native clipboard approval and exact paste; Chrome resident resume; own Ticket/QR and empty Nova Notifications; cached Nova QR under verified transport loss and online restore. No separate build/test process run. Opt-in demo fallback: watcher-output regression checks cover identity/security gates, storage restoration, write/editor guards, cold start and account switch. Phone API-outage/local-save/repeated-outage passed; reconnect preserves the local page. API-only and network-emulated offline icons, polling recovery without reload, drag/dismiss and mute-control recovery verified. Continuation: fixture media public/negative boundary checks passed; standalone Java QA removed. Physical offline cold-start avatar, own cached Ticket/QR and reconnect without reload passed on lifecycle-3. Shared setup: seven compiled workflow contract groups passed on desktop and physical PWA with native/provider doubles; 340/341 px panels, equal 224 px switches, no overflow, notification toggle both ways, location locked and Update right-aligned. Existing watcher build/sync passed. Candidate 25: existing watcher build and compiled failover regression passed. Physical local-offline mode/filter/history/menu and seeded Chat read/composer passed; local notification mute save/reopen/unmute passed. Final physical replay: native install without API doubles; local device off/on/reload/profile-save/automatic account transfer after initialization fix; monotonic seed DOM trace ending at 100; neutral 28 px footer icons. Existing frontend watcher compiled. Localized consent harness shell/JS syntax and actual hu stage/verify/reset passed; new seed spec not separately run. Closure: actual Chrome desktop Allow/exact paste and physical Android fresh native Allow/exact paste PASS; no provider doubles. Popup widths and unchanged sourceLink/update timestamp verified. No application build/test process needed for this execution-only closure.

### Next manual oracle

Closed. Next queued Notifications journey: MOBILE-PUSH-LIFECYCLE-001 device preflight; retain shared permission evidence and establish its current single-device baseline.

### Result

PASS

### Evidence / notes

See DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md, Mobile WebView physical-device execution 2026-09-14. Old 4be4a1c596e2-20260905140310 -> mobile-webview-20260914-icon-fix. Initial mixed dev/old fixture caused font HTML responses; coherent old shell fixed them. Candidate Preview badge hidden offline. Riley offline Ticket/profile keys retained after ordinary logout. Chrome open list reconciled one new row, counter 2 -> 3. Settings observation recreated page. Paste exact, editor width stable; notification trigger covered Remove link. Real offline Nova QR rendered; uncached Game showed misleading empty result. Native Chrome SIGTRAP captured; seamless offline cold-start not proven. Owned fixture and server session snapshot restored; original nginx route restored. No FCM test. Later authorized localhost/dev-only offline-demo trial implemented: phone HTTP Anna -> local u1 passed; reconnect stays local without reload, next explicit opening prefers HTTP; saved local edit survives another outage, cancelled draft does not; Mongo confirms neither marker reached live user. Full internet-offline cold start remains unproven. See the added opt-in trial evidence. Floating cloud_off appears at zero unread, remains movable/dismissible; menu/list icons track connection and preserve mute preference. Continuation evidence supersedes the earlier cache-purge/cold-start failures: Riley logout purged private cache, Nova isolated Ticket/QR remained usable after offline cold-start; reconnect retained timeOrigin. Fixture currently staged, Nova logged in, transport online, lifecycle-3 route retained. Existing hash-based Friends only is not the clarified completed-event friendship rule; unfinished replacement removed pending member-screen analysis. Latest continuation supersedes stale friendship and actor notes: real completed-event/media policy proof is in the QA pack; Riley phone and Casey managed desktop remain staged, Nova logged out. lifecycle-16 build mobile-webview-lifecycle-1789393814593, shared-setup screenshots/results retained. No real FCM activation/delivery or external Firebase entry proof; PARTIAL remains. 2026-09-14 correction: application query/storage test switches removed; six local device persistence checks and seven popup contracts on desktop/phone passed; external page+worker outage and same-page reconnect passed lifecycle-17. Extra offline labels removed; latest candidate lifecycle-19. Full local UI and real provider tests remain open. Latest continuation: candidate-25 local data-source availability fix removes physical-network-only disabling from local operations. Physical local About save/reopen and draft-preserving reconnect passed; HTTP About unchanged. External Rating URLs are valid and load on phone online; uncached external images unavailable under full network loss are accepted. All transport shapers stopped. See Candidate 25 local offline verification in QA pack; earlier disabled-local-mute expectation superseded. PARTIAL/OPEN remains. Latest cleanup: local About/mute restored, both devices normally logged out, versioned fixture reset completed. Public Firebase bootstrap filter corrected for exact paths; watcher compilation passed. Config returns controller 404 (inactive revision), Operator 403/private media 401 retained. Added JUnit regression unexecuted due existing test compilation blocker. API-only server loss does not imply external-image loss. 2026-09-14: Operator cross-guide coverage mapped; reported mobile country-label wrap diagnosed read-only and repaired. Entry browser online/offline listeners and stale-response invalidation added; watcher compile and i18n seed audit PASS, actual updated-phone replay pending. Latest continuation: real phone Google registration, three-image profile Save, logout and repeat same-identity login observed; fresh Mongo count 1, images 3, devices 1. Desktop three-provider Login footer visible and tester confirmed. No-change Firebase Save/reopen preserves active tested revision 1. Country-label and corrected worker-first network restoration replay passed. Candidate 26 activation remains unproven; see Firebase registration and desktop login footer in QA pack. Candidate 27 physical Firebase block passed: actual cold reopen retains identity/avatar; only-QA-client close activates new worker without data clearing. API-only outage/reconnect preserves same Firebase document. Private media 200 before logout, anonymous/invalid 401, retained-cookie 401 after logout, legacy public path redirects to protected 401. Added Settings -> Permissions because installed PWA lacked reentry; ordinary off/reopen leaves zero devices, bell mute/unmute cannot override opt-out, on/reopen/repeated Update leaves one device. Existing watcher compiled, no extra compiler. Push message explicitly deferred, none sent. See Installed-PWA permission replay in QA pack. Latest: actual desktop native installation and standalone reopen through Chrome Apps retained one profile; shared install pending/ring separation compiled at 21:05:04Z and isolated compiled-service checks passed. Native corrected replay remains pending. Own demo avatar loads; earlier Firebase QA card private images return 401 in shared dev demo_db. See Desktop installation, native progress and mixed dev media in QA pack. Latest 2026-09-14: actual desktop native waiting/cancel/accept/ring/completion PASS; original demo normal logout/selector return PASS; user-completed fresh WebView Email Replay first save verified 21:24:16.469Z with 3 images and unique email before backend restart. Peter Szabo card still No image: private requests 401 in mixed dev data; own avatar success does not resolve this OPEN defect. Physical native replay remains unproven. Correction/repair 2026-09-14 23:40 local: profile visibility governs images; no private-image setting. Firebase-only media gate and untracked HTTP onboarding fixed. 11 backend unit tests + scoped live HTTP qualification + 4 compiled onboarding checks PASS. Public profile image 200/private 403/revoked or invalid 401. Existing screen still awaits normal user re-login; no card-image UI PASS yet. Desktop UI replay 2026-09-14/15 PASS: Email Replay ordinary logout/selector return, all 3 Peter Szabo images/profile detail, installed-app close/reopen with 3 HTTP 200 reads; new user-completed Session Replay save and reload verified 3 images/unique email/1 active session/1 login audit, no duplicate or second onboarding. Broader row remains PARTIAL; next consent 002/003 and session/phone gaps. Help/Guide repair 2026-09-15: seeded-help namespace was incorrectly redirected to private media (307 then 403). Existing backend watcher fix loaded; all 77 seeded SVGs now anonymous HTTP 200 with exact seed bytes; 2 path/security tests PASS. Guide visual reopen remains pending. Consent 002 status previous-active: v3 accepted with previous analytics only, target/total +1, anonymous 0; v4 not activated. Footer glyph colors removed, Facebook icon retained, visual check pending. See Help/Guide media repair and consent resume in QA pack. Desktop consent 002 verified 22:29:18.948Z: v4 forced, Close cannot bypass, analytics only; v3 unchanged; +2 target/total, zero anonymous. User reports Guide images now working elsewhere. Consent 003 verified 22:31:29.822Z: only analytics preselected, research explicitly added through later Save choices (agent initially approved too early); v4 revision/consent unchanged, +1 consent, marketing absent, anonymous 0. Exact sequence documented in pack. Per-profile AUTH-SESSION-001 PASS: A/B/C all Maya Stone via supported actor override; first two accepted, third blocked, A logout frees slot for C. Exact 4 audits/2 active sessions/3 warnings; B/C unread 11 to 14. Nova evidence untouched. Home cards guide illustrations visually verified. See Per-profile session limit desktop replay in QA pack. Clarification: demo exemption was a misinterpretation and fully reverted; original per-profile Maya result remains valid. Same C browser: Maya blocked, Try again then Kiss Balázs enters; Maya 2 sessions/Balázs 1. Candidate lifecycle-31 served for phone, activation pending. Candidate 31 phone cold reopen/entry passed; neutral footer glyphs + Facebook visually verified. Settings resident replay: same timeOrigin 1789425983526.4, native Settings foreground, one versioned mutation, Recents resume unread 4->5 and one row stable through polling/reopen. Mobile rating photo contain fix requested, replay pending. Candidate 32 main Home rating photo fit PASS: physical screenshot shows full proportional image; live /game inspection confirms contain on all three image layers. Existing watcher compiled 22:51:09.164Z. See Mobile home rating photo fit in QA pack; full checkpoint remains PARTIAL/OPEN. FINAL 2026-09-15: supersedes prior pending/runtime notes. Physical Chrome native install pending no ring, Cancel no ring, acceptance ring then appinstalled completion PASS. Local candidate35 device initialization repair: off/on/reload/repeated Update/profile-save and automatic Anna/Balazs transfer PASS; other-device preservation remains adapter coverage. Seed progress actual phone trace 0,0,11,22,34,40,43,52,64,82,94,97,97,98,100 PASS. Footer neutral 28px glyphs/Facebook visually PASS. Phone hu consent002 v2/v3 reject/forced acceptance/immutable previous +2 audits PASS; consent003 v4 analytics inherited and research selected before first approval +1 audit PASS. Supplemental phone Maya blocked at two sessions; desktop logout then phone retry accepted, exactly two sessions/four audits/three warnings. Selector remains available to other profiles; no demo exemption. Mobile/auth/consent fixtures reset; Maya residue zero, immutable Nova consents retained. Exact HTTP dev environment restored; original phone PWA activated lifecycle36 1789428466369 standalone. Owned 127 probe app/tabs and managed desktop windows removed; original apps/cache/reverse tunnel preserved. Non-deferred execution complete; PARTIAL only for tester-deferred clipboard. See WebView final physical replay and cleanup in QA pack. CLOSURE 2026-09-15: user resumed both deferred clipboard observations. Desktop real native Allow inserted exact 44-character URL, viewport/scrollWidth1136. Physical localhost PWA native prompt -> Allow inserted same URL at00:04:21.759Z, permission granted, standalone lifecycle36, viewport/dialog width360 without overflow. Subsequent Permissions popup341px and zero Asset editors; desktop340px. Native Android Copy menu used, no clipboard API replacement/permission override. Both Asset editors cancelled, sourceLink empty and updatedDate unchanged at23:56:01.260Z. Both normal Logout confirmations completed; versioned fixture/common sessions reset, status not-staged, managed desktop/temporary phone tab closed. Original apps/cache/tunnel retained. All previously open WebView observations complete; PASS/CLOSED. See WebView clipboard closure in QA pack.

### Manual QA priority

P0 100

## UI-POLL-JANK-001

### ID

UI-POLL-JANK-001

### Type

Performance defect retest

### QA domain

Notifications

### Area

Admin Jobs + Chat

### Scenario

Compare pointer, scroll and input frame pacing across idle UI, Admin process list, Job Detail and Chat during periodic/live updates; in the same run attribute unexpected logout across two intended sessions, CDP attachment and normal browser close

### Statistics

X

### Monitoring / Metrics

X

### Affinity Graph

X

### Admin Jobs

Job Detail must stay responsive during SmartList refresh; unchanged polls must not mutate rows; only the selected changed rule may reach the detail signal

### Domain / other UI

Chat must stay responsive during WebSocket and user-realtime updates; read-only CDP attach creates no server session/context, and browser-close evidence is captured before intentional launcher cleanup

### Manual status

USER-AUTHORIZED CDP PASS / CLOSED

### Last manual date

2026-09-14

### Automated coverage

Real browser CDP: idle/list/detail 30 s each, Chat 45 s; four compiled SmartList method regressions passed; matching Vitest cases authored but not separately run; existing frontend watcher build and sync passed.

### Next manual oracle

Closed; next queued Notifications checkpoint is MOBILE-WEBVIEW-LIFECYCLE-001, not started.

### Result

PASS

### Evidence / notes

See guides/qa/diagnostics/UI_POLL_JANK_DIAGNOSIS.md measured closure 2026-09-14. Fixed unchanged-row replacement during reorder and old-object track-key loss. Final recordings: zero main-thread tasks >=50 ms; frame maxima idle/list/detail/chat 16.8/20.9/16.8/42.7 ms, with isolated Chat gap near live arrival. One native Nova send, one live bubble and one persisted message; unsent probe cleared. Read-only CDP attach preserved exactly two Casey sessions, 29 audits and target/context sets. Ordinary Casey B close retained its server slot and valid auth before any cleanup. Nova logout, managed-browser close and guarded fixture reset completed; pre-launch sessions restored, fixture not-staged. Automated evidence, not a new human visual pass or a physical-device/local-adapter run.

### Manual QA priority

P1 65

## BASE-STAT

### ID

BASE-STAT

### Type

Baseline

### QA domain

Administration

### Area

Statistics

### Scenario

Render and refresh persisted dashboard

### Statistics

All sections stable; refresh reloads snapshot

### Monitoring / Metrics

X

### Affinity Graph

X

### Admin Jobs

X

### Domain / other UI

X

### Manual status

MANUAL UI PASS

### Last manual date

2026-08-04

### Automated coverage

DTO/service support only

### Next manual oracle

Proceed with the controlled causal Statistics rows

### Result

PASS

### Evidence / notes

06:05 initial and 06:06 no-action refresh screenshots: all nine KPIs, five segments, graph/timeline, event type, city and topic panels rendered and visible values stayed stable; the header timestamp advanced normally. A separate 06:02/06:07 API sample later absorbed one user restored during fixture cleanup, so that delayed materialization was excluded from the refresh oracle. Mixed Hungarian/English labels are a nonblocking i18n observation.

### Manual QA priority

P1 68

## ADMIN-MONITORING-001

### ID

ADMIN-MONITORING-001

### Type

Consolidated journey

### QA domain

Administration

### Area

Monitoring dashboard, queues and jobs

### Scenario

Open All/Watch/Domains/Delivery/Workers once and reuse one recompute plus one parameter save/revert to observe exact pending-to-terminal states, filters, totals, health and job details

### Statistics

X; Graph summary later; Per job matrix

### Monitoring / Metrics

Categories and filter counts match contract; Pending/running/failed and health transition correct; DELTA: scheduler start and terminal audit change once per real run; DELTA Jobs config once per persisted version; recompute/outbox should transition

### Affinity Graph

X; Changed edge visible after terminal; Per job matrix; Section-dependent

### Admin Jobs

X; Affinity recompute runState/history changes; Every runState/history must change; Affinity recompute pending/run changes

### Domain / other UI

X; Task terminal; Every domain oracle must pass independently; New config version and admin notification

### Manual status

PASS / CLOSED

### Last manual date

2026-09-16

### Automated coverage

Live delegated HTTP/UI/normal-worker oracles; exact fixture reset; existing backend/frontend hot-deploy builds; guarded no-op HTTP probe; updated unit regression source not separately executed.

### Next manual oracle

Closed; next ADMIN-AFFINITY-GRAPH-001 delegated by user. Replay only affected assertions after relevant changes.

### Result

PASS

### Evidence / notes

Source status: BASE-MON=NOT RUN; MON-011=NOT RUN; MON-013=NOT RUN as cross-surface pack; MON-014=NOT RUN. Queue counts are live; event totals accumulate; Universal job-run telemetry is wired; manual all-job cross-surface pack remains; admin.params.changed now emits on successful save/revert and not on no-op revert; 2026-09-15 numbered guide and versioned baseline/capture/reset harness prepared. Baseline staged with no task or parameter mutation; managed Ava Admin startup ready. Initial absent explanation-guide timeout corrected in checkpoint startup configuration. Jobs presentation reused from JOB-MESSAGES; parameter save/history/revert occurs only here, later Parameters uses fixture.; 2026-09-15 Documentation coverage repair against334d4787:20 explicit steps map BASE-MON/MON-011/MON-013/MON-014. Retains per-job run/audit/domain proof and parameter recipient/projection/no-op checks. Reuse named prior job evidence; only missing correlations need scoped fixture-backed execution. Existing startup/capture/reset harness remains prepared; no new execution.; Closure2026-09-16: all20 checks covered, filters8/1/5/1/2, isolated recompute, ten-job assertion mapping with four scoped missing-audit runs, Params300->301->300, exact version/telemetry/recipient/queue oracles. Fixed self-notification, duplicate CONFIG key, Firebase=false window gating and active-version no-op. User-requested contextual icon colors use existing palettes. All fixture/session resets verified. Full evidence and qualifications in Monitoring delegated execution and closure section and versioned JSON.

### Manual QA priority

P0 94

## ADMIN-AFFINITY-GRAPH-001

### ID

ADMIN-AFFINITY-GRAPH-001

### Type

Consolidated journey

### QA domain

Administration

### Area

Affinity Graph exploration and materialization

### Scenario

Open the known graph; traverse forest/component/member depths; change weights; exercise viewport controls and scale; then let the real layout worker materialize and reopen the graph

### Statistics

Graph summary only; compare later; Graph metrics/timeline change in predicted direction; prior dates stay immutable; X; Graph summary is not live-filtered: X; Graph summary direction agrees after refresh

### Monitoring / Metrics

X; Matching queue returns terminal; Matching queue transition; DELTA scheduler/audit

### Affinity Graph

Member/link/component/isolated totals match; Edges/neighborhood/components agree; Component expands with bounded lazy load; Panel and strongest connections match; depths are bounded supersets; Only in-range edges; isolated members retained; Controls/progress work; reset returns overview; Expected edge/weight/component changes; unrelated edge stable; Forest paging/tiles/neighborhood bounded; isolated users visible; DELTA new layoutVersion and matching node/edge/forest totals

### Admin Jobs

X; Affinity recompute terminal; DELTA

### Domain / other UI

X; Discovery/affinity projection correct; Profile detail visible; No clipping at popup boundary; Affinity/discovery projection correct; No request loop or blank canvas

### Manual status

PASS / CLOSED

### Last manual date

2026-09-16

### Automated coverage

Delegated native browser actions, exact HTTP/Mongo oracles, normal scheduler, mobile viewport and camera invariance checks, existing frontend hot-deploy; no standalone unit runner.

### Next manual oracle

Closed; next ADMIN-PARAMETERS-001 delegated by user. Replay only affected assertions after relevant changes.

### Result

PASS

### Evidence / notes

Source status: BASE-GRAPH=NOT RUN; STAT-020=DEFECT FIXED; HOT-DEPLOY RUNTIME + MANUAL STATISTICS UI PASS; AFFINITY GRAPH COMPARISON PENDING; GRAPH-002=NOT RUN; GRAPH-003=NOT RUN; GRAPH-004=NOT RUN; GRAPH-005=NOT RUN; GRAPH-006=NOT RUN; GRAPH-007=NOT RUN; JOB-GRAPH-LAYOUT=NOT RUN. Dedicated graph is not random-room generation; Initial manual refresh exposed a real defect: every Jul 22-Aug 3 point was rewritten from bridgeUsers 2->0, communities 2->1 and clusterQuality 7->3. Fix preserves stored past dates and replaces only today. Hot-deploy runtime proof compared 04:51:23 to 04:58:42: today's activeEdges changed 309->313 and recurringEdges 274->278 while all 13 prior points stayed exactly unchanged. The post-fix 07:05 browser screenshot, from the 07:03 admin snapshot after another real Refresh, reselected Jul 22 and retained Active edges 16, New edges 0, Recurring 13, Weak ties 16, Network quality 67%, and Cluster quality 3%. Manual Statistics UI retest passed; direct Affinity Graph comparison remains pending and the original FAIL evidence is retained.; The same worker and persisted one-day rule run in demo_db and myscoutee_db; the manual helper never calls the rebuild endpoint. Non-manual runtime evidence on 2026-08-04: automatic demo seed sync imported the tenth rule and the real scheduler completed it in 231 ms, publishing one version with 54 nodes, 1126 edges and 4 forests whose stored counts matched the layout header. Manual screenshot checkpoints remain NOT RUN.; 2026-09-15 stable guide prepared, not executed. Proven Jobs/Bell paths removed from manual sequence and replaced by fixture prerequisites. Parameter save/history/revert is owned once by Monitoring; Parameters retains section-specific consumer/validation checks. Dedicated fixture orchestration deferred per user.; 2026-09-15 Documentation coverage repair against334d4787:23 explicit steps map overview, component loading, depths1/2/3, weight bounds, controls, isolated members, paging/tiles/neighborhood limits, version/header/stored/reopened counts and current/historical controls. Bell/STAT-020 proof reused only for its exact assertions. No new Graph execution.; 2026-09-16 delegated run: blocks1–3 exercised, exact chain depths1/2/3 and inclusive range passed, unchanged graph-statistics filter and past dates passed. Fixed selection projection reset, small-neighborhood fit and origin-relative layout; user requested compact2–4 member layout. Larger real layout154/1173/23/2 and bounded HTTP pages20+3 passed. Remaining UI paging/distant member and cleanup.; Closure2026-09-16: all23 steps passed with exact Bell/STAT-020 reuse; real layout154/1173/23/2; pages20+3; depth1/2/3 and inclusive0.4 boundaries; zoom7/14/23; camera jump fixed; compact/readable mobile360/390 and unchanged camera on panel overlay; Statistics deltas100/80/20 and restored metrics; exact fixture/session reset, owned users/edges/snapshots0. See evidence/ADMIN-AFFINITY-GRAPH-001-2026-09-16.json and pack Graph closure.

### Manual QA priority

P2 52

## ADMIN-PARAMETERS-001

### ID

ADMIN-PARAMETERS-001

### Type

Consolidated journey

### QA domain

Administration

### Area

All Parameters lifecycle and downstream controls

### Scenario

In one session save/reopen/history/revert one safe value per section, reject each input type once, verify owned downstream effects and controls, then restore the full baseline

### Statistics

X; Graph summary changes after recompute; Graph summary may change after recompute; X unless screen documents a statistic

### Monitoring / Metrics

Config delta plus recompute/outbox transitions; Config delta and Matching queue; Config delta and Matching queue from generic save; Config delta plus outbox strategy/count transition; Config delta plus affected worker behavior; X; X unless action emits documented telemetry

### Affinity Graph

Section-dependent; User edge/score changes predicted direction; User affinity/order changes predictably; X; Distance-derived user edge changes predictably

### Admin Jobs

Affinity recompute pending/run changes; Affinity recompute terminal; Affinity recompute is enqueued generically; Affected worker cadence/batch behavior; No new run on cancel/failed save; X unless job/config input

### Domain / other UI

Exact value, new version, actor/date/summary, notification, non-destructive revert; Affinity output changes only for fixture signal; Profile/affinity ordering correct; Event recommendation/rank changes predicted direction; Asset recommendation/rank changes predicted direction; Discovery boundary/ranking correct; Direct vs multicast delivery changes and restores; Persist/reopen/revert; no hidden hook; No version/task/notification on cancel or rejected save; Exact persistence and validation only

### Manual status

PASS

### Last manual date

2026-09-16

### Automated coverage

Consolidates PARAM-001, PARAM-010, PARAM-011, PARAM-012, PARAM-013, PARAM-014, PARAM-015, PARAM-016, PARAM-017, STATIC-SMOKE. AdminParamsService exact-once tests; notification HTTP E2E; Calculation/service tests; Absolute affinity tests; Absolute event affinity tests; Absolute asset affinity tests; Affinity calculation tests; BackendAdminParamsRealtimeE2ETest; exact-once telemetry tests; Service/config tests; Server bounds tests partial; Form/component tests vary

### Next manual oracle

Closed. Continue Operator Configuration C01.

### Result

PASS

### Evidence / notes

Source status: PARAM-001=NOT RUN; PARAM-010=NOT RUN; PARAM-011=NOT RUN; PARAM-012=NOT RUN; PARAM-013=NOT RUN; PARAM-014=NOT RUN; PARAM-015=AUTO COVERAGE; MANUAL NOT RUN; PARAM-016=NOT RUN; PARAM-017=NOT RUN; STATIC-SMOKE=NOT RUN / not recorded. Graph explorer contains user edges, not event ranking; Graph explorer contains user edges, not asset ranking; HTTP E2E already proves save, consumer, history and revert; A static form pass is not downstream functional proof; 2026-09-15 stable guide prepared, not executed. Proven Jobs/Bell paths removed from manual sequence and replaced by fixture prerequisites. Parameter save/history/revert is owned once by Monitoring; Parameters retains section-specific consumer/validation checks. Dedicated fixture orchestration deferred per user.; 2026-09-15 Documentation coverage repair against334d4787:25 explicit steps retain all seven consumer branches, six distinct real field saves and per-section version/author/summary/task/outbox/projection checks, bounds/cancel atomicity and restored consumer outputs. Monitoring owns shared History/revert UI once; fixtures replace repeated prerequisites/cleanup and Jobs save. This is user-directed removal of repeated interaction, not proof that untested section effects pass.; 2026-09-16 delegated execution started. Versioned fixture staged15 collection snapshots; block1 seven sections/old-test fields declared. Matching met0.5->1 saved in visible UI, reopened1, exactlyv5/actor/section and other config sections unchanged. Logical notification sent to Noel, excludes Ava. CONFIG made due through captured fixture command; consumer pending, not PASS.; 2026-09-16 Matching consumer/materialization/Stats and Profile55 exact age deltas verified; config/derived outputs restored, no pending work. Profile actor Ava initially lacked affinity; no delta claim for that actor. See evidence/ADMIN-PARAMETERS-001-2026-09-16.json. Remaining sections not passed.; Events steps9–10 PASS: boosts+6/+1; Explore order defect repaired, API10 sort/view contracts and browser36 paginated rows match; baseline restored. Evidence JSON updated.; Assets11–12 PASS: exact quantity+3/+4, 12-record affinity consumer order, restoration. Paged Explorer ordering is availability/price/policy; no claim of UI relevance mode. Discovery13–14 PASS:25km boundary0.5/0/0, insideedge0.25, layout-1789545171154, restored. Notifications15–17 PASS:2targets multicast at2/direct at3, terminal/no retry; missing fixture activityMembers repaired. No physicalFCM claim. Jobs18–19 PASS: real USER task created08:15:09Z, due+12s, done08:16:00Z, pendingcleared; original profile/config restored. Evidence JSON retained. Closure2026-09-16: all25 steps accounted for with declared reused Monitoring evidence. Bounds0/1000000, strategy defect fixed/live400 without writes, cancel unchanged. Shared app-menu pill verified. Full15-snapshot restoration/comparison completed,0 retained snapshots/pending/owned probes. Unit regression added but not executed separately; watcher/live HTTP proof. See evidence JSON for qualifications.; Discovery menu follow-up PASS: standard shared tinted items, no underline or selected-item clipping, mobile sheet, desktop automatic placement and input-column alignment. Visual fixture reset verified:0 snapshots/pending; configv4.

### Manual QA priority

P3 38

## MSC115-ADMIN

### ID

MSC115-ADMIN

### Type

Flow

### QA domain

Administration

### Area

App-admin scope and aggregate badges

### Scenario

MSC-115 steps 101–104: Admin workspace identity, scoped surfaces/counters, content/parameter isolation and payment-tool context. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

NOT RUN

### Automated coverage

See guides/plans/MULTI_GROUP_PRODUCT_DIRECTION_2026_10.md; code/build checks do not establish manual PASS. | 2026-10-07: compiled main-group identity/global paging checks and read-only HTTP paging/sync PASS; guides/qa/evidence/work-community/MAIN-GROUPS-20261007.md.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

2026-10-14: monolith UI/HTTP checks recorded through107; admin selector/reload repaired,8/8 frontend and7/7 backend tests PASS. Work draft and job isolation verified. Local/KVM and optional private-group report branch remain unproven. Stopped before Guides108. See [execution evidence](../evidence/work-community/MSC115-admin101-107-20261014.json).

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 user-requested synchronization: current steps 101–104; old scenario wording replaced by the active checklist. No new test or PASS claimed.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## MSC115-JOBS

### ID

MSC115-JOBS

### Type

Flow

### QA domain

Administration

### Area

Per-base-group job ownership and execution

### Scenario

MSC-115 steps 105–107: Per-base-group job definitions, execution/results and Community scheduled-case/vote-close workers. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

NOT RUN

### Automated coverage

See guides/plans/MULTI_GROUP_PRODUCT_DIRECTION_2026_10.md; code/build checks do not establish manual PASS.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

2026-10-14: monolith UI/HTTP checks recorded through107; admin selector/reload repaired,8/8 frontend and7/7 backend tests PASS. Work draft and job isolation verified. Local/KVM and optional private-group report branch remain unproven. Stopped before Guides108. See [execution evidence](../evidence/work-community/MSC115-admin101-107-20261014.json).

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 user-requested synchronization: current steps 105–107; old scenario wording replaced by the active checklist. No new test or PASS claimed.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

10/25



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## EXPLANATION-GUIDE-001

### ID

EXPLANATION-GUIDE-001

### Type

Consolidated journey

### QA domain

General UI

### Area

Application explanation guides

### Scenario

Dynamic compact tours: 110 contexts / 1331 conditional fields; EN/HU; desktop/mobile; WebRTC call/volume; one-step first-visit guide-button introduction; shared launcher overlap checks; one-step consent Accept guide

### Domain / other UI

Available target counts; popup/menu/scroll; granular editors; slider and Save; floating guide; public landing; repeated pair targets

### Manual status

IN PROGRESS — partial browser evidence

### Dev

IN PROGRESS

### Local

NOT RUN

### Last manual date

2026-10-07

### Automated coverage

2026-10-07: EN/HU catalog/i18n and guide-field seed parity; revision/section parity for chats, event.chat, chat.call, chat.call.volume and landing.guide across Dating/Work/Community and all three Mongo seeds. Existing watcher AOT call/guide context and intro lifecycle checks PASS. Public intro HTTP EN/HU x 3 modes PASS; private call context denial 404 PASS. Browser tour NOT RUN. Follow-up: watcher AOT launcher geometry (1500 cases, 400 Rates rechecks) and versioned introduction lifecycle/text parity PASS. See guides/qa/evidence/general/EXPLANATION-GUIDE-001-20261007.md. Consent follow-up: watcher AOT directive/service/Accept target PASS; 200 target checks reuse one index scan. Live public consent HTTP EN/HU x 3 modes PASS; private-context 404 preserved. | 2026-10-07 isolated CDP regression PASS (EN desktop / 390x844 mobile): dismissed consent stays closed on group switch; correct images on first selection; Login reopens consent; one stable consent Help step with translated label; duplicate Privacy summary removed. SW 20/20 PASS; EN/HU live seed/translation parity PASS. | Mobile header follow-up: 24 isolated CDP cases PASS (EN/HU x 320/360/390/1236px x 3 groups): full label/caret, one-line Login/Belépés, no header overlap. Translation .7 live/source/seed parity PASS. | 2026-10-07 shared missing-guide feedback: watcher-AOT DOM regression PASS for persistent centered EN/HU message, cold/cached/empty cases, X/Escape/Back/launcher/shade dismissal, Next/Back/Done and 200 viewport notifications with zero rescans.

### Next manual oracle

Complete the MSC-119 guide extension and remaining WebRTC/introduction/full-tour local/HTTP cases. Retain the Oct7 consent/help and24 header browser checks; compiled/JSDOM checks do not close the remaining browser tour. | Template baseline is closed; assess newly found defects, carry over affected fixes and run only their targeted template regression.

### Result

IN PROGRESS

### Evidence / notes

45 contexts / 963 fields. Existing recorded scope retained. Added landing: 64 steps per viewport; feedback: 39 per viewport; Rates arrow-only, shared double-panel highlights and editable badge passed at mobile/desktop. EN/HU local/demo/e2e/prod seed parity. Landing visit visibility, internal default ON/preserved OFF, fresh-browser consent and shared guide/notification clearance above rating actions/profile eyes passed mobile/desktop. Mobile-only launcher clearance; unchanged desktop positioning; pair divider hover/tap/drag and fixed photo scale at 0/50/100% passed Home/Rates browser and Android Rates over ADB. Mobile pair image fit unified to contain on Home/Activity Rates; both targeted browser checks passed, desktop preserved. Guide screenshots removed from Git. No final form submission. Full local persistence and native WebView not claimed. guides/qa/evidence/general/EXPLANATION-GUIDE-001-20260930.md Final Android Home rail stability, mobile/desktop guide card continuity and filter badge save/reload/restore passed. No screenshots committed. Earlier Android fullscreen/drag lag was confirmed; the subsequent retained-panel and image-scroll fixes below were accepted and close that follow-up. No universal performance PASS is claimed. Follow-up: one retained list row rebuilt instead of six; one DTO snapshot per card; hidden controls excluded from launcher measurement. Native menu/guide visibility and raised list badge clearance passed. Small warm RAF-proxy medians: fullscreen 293 to 254ms, list 161 to 108ms; these preliminary measurements are superseded by the final user-accepted retained-panel result below. Final user-accepted retained-panel change: one shared loaded collection; persistent list/fullscreen DOM; z-order-only presentation; inactive new-image gating; no warm card rebuilds or switch scroll shift; saved-score paging identity preserved. Warm fullscreen median207.9→127.7ms; list103→128.1ms (dev two-RAF proxy, no universal performance claim). Rates list-scroll launchers fixed: native100-frame check0/0px movement versus48/56px before. Follow-up: panel-bottom launcher anchor56px list/96px fullscreen; native scroll0/0px. Whole-card scroll preview/adaptive prefetch withdrawn. Image-only handling preserves visible photos; only offscreen/passed photos suspend, returning once from cache. Fast-scroll requests/spinners0; sampled visible-image flickers0; focused tests15/15. See phone-image-scroll.json. Mobile photo badges/eye/image indicators follow per-image suspension; individual/pair native swipe90frames each passed; user accepted. Release1.3.2: both guide branches consolidated/master merged; GHCR frontend/backend images; Netcup migration010 retained-data check;8 healthy containers; publicHTTP13/13 and landing guide10/10 plus private-context denial passed. See RELEASE_1.3.2_20260930.json. Launcher follow-up: desktop icons remain with menus; guide above shade; bell layering unchanged; mobile menus hide both icons without hiding tour;1280/390px regression passed and user accepted.; Accepted launcher follow-up republished1.3.2: nginx-only Netcup update,13/13 HTTP PASS,8 healthy containers,7 unchanged. Final ledger closure 2026-09-30: PASS / CLOSED for the accepted guide scope and follow-ups; no remaining guide oracle. Local PARTIAL records the untested persistence boundary, not an open guide defect. 2026-10-01 scoped granular-rating addendum: Home/Activity list/fullscreen CDP at1280/390; no-backdrop popup, equal-width bar, mobile menu launcher hiding, integer details, profile-count-derived main step, exact6.75 save/reload and affinity precision, EN/HU guide/i18n parity. Existing PASS/CLOSED retained; see granular-rating-checks.json and rating-step-checks.json in the linked evidence. | 2026-10-06: user explicitly reopens for expanded scope. September PASS remains historical evidence, not current completion. | 2026-10-07: Added 17 call + 7 volume catalog fields, phone steps in chats/event.chat and the one-step landing.guide intro; workspace-specific EN/HU content seeded. Existing shared guide engine/launcher reused. Watcher frontend build and backend hot-deploy PASS; check-chat-call-runtime.mjs PASS including nested guide/context/language/destruction checks. Compiled Guide first-visit/dismissal/known-visitor/transition checks PASS; consent and saved guide preference unchanged. Public intro HTTP 6/6 plus private-context denial PASS. Targeted audit-seeds.py --context chats --context event.chat --context chat.call --context chat.call.volume --context landing.guide PASS; i18n audit and sync-work-seeds.js --check PASS. Full revision audit is not a PASS: pre-existing home.game rating-details and payment.history counterparty steps are absent from global HTTP revisions; left outside this change. At that earlier checkpoint, launcher component and placeCard positioning were identical to HEAD after the positioning edits were withdrawn. No browser actions, fixture staging or full guide click-through performed. September evidence remains historical; new manual status NOT RUN. | 2026-10-07 authorized follow-up: launcher-to-launcher clearance repaired using registered references; Rates stable panel anchors and Help card placement preserved. Bounded geometry/lifecycle checks PASS; single-step HU163/EN166 introduction explains drag, red-X hide and Side menu Explanations OFF/ON. QA CSV line endings normalized. Evidence: guides/qa/evidence/general/EXPLANATION-GUIDE-001-20261007.md. Manual browser status remains NOT RUN. | 2026-10-07 consent follow-up: landing.consent one-step Accept binding; canonical source and all Mongo seeds synchronized. Introduction now explicitly names the notification bell (HU156/EN155). i18n version 2026.10.07.5. Development checks PASS; browser manual NOT RUN. | Later user-authorized fresh anonymous browser evidence: guides/qa/evidence/general/EXPLANATION-GUIDE-001-20261007.md, landing follow-up. No full manual case replay, acceptance/registration or fixture reset; historical status preserved. | Article/no-guide follow-up: shared guide feedback now remains centered until dismissed instead of flashing closed. Per-surface checklist step 9 added. Focused JSDOM evidence only; manual campaign status unchanged. guides/qa/evidence/general/EXPLANATION-GUIDE-001-20261007.md. | 2026-10-07 operator/app-admin audit: GAP, no dedicated surface registrations/catalog fields/revisions; operator launcher excluded; Explanations toggle excluded for both privileged roles. Common avatar-menu guide is not role-surface coverage. See evidence/general/EXPLANATION-GUIDE-001-20261007.md#operator--app-admin-wiring-audit. | MSC-118: prior role wiring gap implemented; 37 system contexts / 136 fields, shared launchers and role notifications have dedicated ROLE-GUIDES-NOTIFICATIONS-001 checklist/evidence. Manual role QA NOT RUN. MSC-119 extension 2026-10-07: guides/plans/MSC-119_MCP_READ_EVENTS_ROLE_GUIDANCE.md and guides/qa/evidence/general/MSC-119_GUIDE_WIRING_20261007.md. Source/build evidence only; no functional/browser/security/load PASS claimed. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 ledger reconciliation: Actual isolated browser consent-close/mode-switch/Login behavior passed desktop/mobile; consent Help and24 EN/HU header cases passed. These later browser checks supersede the initial NOT RUN statement only for their recorded scope. Evidence: guides/qa/evidence/general/EXPLANATION-GUIDE-001-20261007.md. Full case remains open; no new test was executed for this status correction.

### Manual QA priority

P1

### Remaining QA complexity (min/max)

60/120

## MSC115-GUIDES

### ID

MSC115-GUIDES

### Type

Flow

### QA domain

General UI

### Area

Context guides and shared-surface continuity

### Scenario

MSC-115 steps 108–114: Actual visible EN/HU guides, desktop/mobile variants, nested context lifecycle, empty-guide feedback and workspace isolation. Completed template baseline stays closed; only new affected fixes require targeted template retest. The numbered checklist is authoritative; this row tracks the same execution, not an additional run.

### Manual status

CLOSED / PASS — accepted development scope

### Dev

PASS — recorded scope

### Local

PASS — scoped spot checks

### Automated coverage

Source guide7/7 and positioning6/6, compiled context assertions,118 step-transition frames and52 fresh-popup opening frames; exact key parity verified.

### Next manual oracle

None for MSC-115. Separate template and live-deployment QA retain their own status.

### Result

PASS

### Evidence / notes

Prepared 2026-10-05 from user requirements. No browser actions or live data mutation performed. Preserve other completed campaign checkpoints. | 2026-10-06 conversation reconciliation: MSC-115 checklist updated; full flow remains NOT RUN. | 2026-10-11 MSC-122 follow-up REQUIRED: for each defect record template affected/unaffected with reason, source and template fix revisions, targeted template environment/result/evidence; affected propagation or verification stays open until completed. Source PASS does not imply template PASS. See guides/qa/checklists/README.md#template-regression-and-fix-propagation--msc-122. No execution status changed by this requirement. | 2026-10-13 user-requested synchronization: current steps 108–114; old scenario wording replaced by the active checklist. No new test or PASS claimed.

### Manual QA priority

P1

### Remaining QA complexity (min/max)



2026-10-15: [Final source guide evidence](../evidence/work-community/MSC115-guides-20261015/summary.json). HTTP matrix completed; local verification deliberately reduced to representative samples after exact backend key parity, per user instruction. Historical template gate wording above is superseded by the explicit separate-template QA decision.



Closure 2026-10-15: [MSC-115 closure receipt](../evidence/work-community/MSC115-closure-20261015/summary.json). Earlier partial observations remain historical evidence; their old next-step pointers are superseded. Local NOT RUN/PARTIAL records coverage, not an open MSC-115 defect. Separate template/live QA does not block this task.

## OPERATOR-CONFIGURATION-LIFECYCLE-001

### ID

OPERATOR-CONFIGURATION-LIFECYCLE-001

### Type

Consolidated journey

### QA domain

Operator

### Area

Configuration workspace

### Scenario

Save and reopen changed Firebase configuration; test authentication and browser messaging, activate the tested revision, verify entry mode and restore the exact baseline. Reuse completed public/payment and actual Firebase sign-in evidence.

### Statistics

X

### Monitoring / Metrics

DELTA one Firebase configuration revision, matching tested and active revisions

### Affinity Graph

X

### Admin Jobs

CONDITIONAL only for the visible Firebase capability action; managed TLS owned by Update

### Domain / other UI

Each save reports one honest result; reopening shows the normalized value; credentials remain masked; Payment and Firebase happy-path checks succeed; public output matches after reload; Firebase login reuses one application identity; final restore returns every block to its baseline

### Manual status

PASS / CLOSED

### Last manual date

2026-09-16

### Automated coverage

Configuration validation, secret masking and Firebase regression coverage; managed HTTPS is owned by Update.

### Next manual oracle

Closed. Next: Operator Update on VMware, including managed HTTPS. Stop dev before VMware.

### Result

PASS

### Evidence / notes

Consolidates OPERATOR-FIREBASE-LIFECYCLE-001, OPERATOR-PAYMENT-CONFIG-001, OPERATOR-PUBLIC-CONFIG-001 and OPERATOR-TLS-LIFECYCLE-001. Pair QA follows only the normal Operator UI path; invalid input, secret-leak, callback-security, renewal-failure and fault-injection branches are not manual checkpoints. 2026-09-14: shared real Firebase revision 1 is active; read-only harness confirms Authentication and Messaging tested revision 1. Desktop native notification Allow confirmed by user. Save/Auth API evidence is not manual save/reopen proof. Stable guide: guides/qa/checklists/operator/OPERATOR-CONFIGURATION-LIFECYCLE-001.md. Parent remains partial. User parked broader Operator execution after reviewing the guide; no additional Operator PASS claimed. Shared WebView continuation: ordinary no-change Firebase Save/reopen preserved masked active revision 1. Real Google registration and repeated identity login observed on phone. This is shared partial evidence, not configuration rotation or parent closure.; 2026-09-15 Operator screen-level checklist prepared under checklists/operator; documentation only, no new execution or PASS. Reuse proven downstream product flows via fixtures.; 2026-09-15 English guide mapped against334d4787: C01–C08 retain exact changed-block revisions, normalized public/provider state, masked credentials, real TLS/Firebase capability correlation, one subject/user/profile identity and complete local/external restoration. Matching proven Firebase/WebView/Push prerequisites use fixtures; no-change Save is not changed-save proof. No execution.; 2026-09-16 C01/C02 PASS, native branding revisions0/1/2 with public reload and restoration; C04 configuration save/masking/reopen/removal PASS using local payment simulator, no external charge claim. C03 managed HTTPS unavailable; live Firebase C05/C06 require non-demo capability environment. See dated evidence JSON.; 2026-09-16 User explicitly moved VMware-dependent C03 HTTPS intact to OPERATOR-UPDATE-LIFECYCLE-001 block4/steps12–15. Configuration closure now requires C01–C02,C04–C08; no TLS PASS claimed. Current work C05 preparation, not yet executed.; C01 clarified as previously verified setup/access, not newly executed functional PASS. Stable guide removes repeated C01 login/navigation, C06 registration/return and C07 consumer click sequences; existing owning evidence plus fixture prerequisites replace them. C05 remains unexecuted in this continuation.; Current checklist renumbered after user-directed removal of repeated flows: C01 Firebase (formerly C05), C02 activation (formerly C06), C03 restoration (formerly C08). Historical evidence block labels retain their original meaning. No new functional PASS.; Closure 2026-09-16: renumbered C01–C03 PASS. Native changed Save revision1, masked reopen, real Auth/Message capability tests revision1, activation and public Firebase chooser; retained bootstrap Operator access. Actual Google sign-in/logout/re-login reuses WebView evidence2026-09-14; no new user-login execution claimed. Exact Mongo/runtime restore revision0/inactive, temporary identity/session/device counts0, fresh entry demo chooser, managed browsers closed. See evidence/OPERATOR-CONFIGURATION-LIFECYCLE-001-2026-09-16.json firebaseContinuation.

### Manual QA priority

P0 100

## OPERATOR-REGISTRY-LIFECYCLE-001

### ID

OPERATOR-REGISTRY-LIFECYCLE-001

### Type

Consolidated journey

### QA domain

Operator

### Area

Registration, claim, community and measurement

### Scenario

Register one disposable binding, complete claim and community checks, synchronize measurements, then disconnect, reconnect as a new connection and resynchronize retained local data

### Statistics

DELTA one measurement report; X for read-only leaderboard

### Monitoring / Metrics

DELTA signed deployment membership, claim/group receipt and measurement receipt; X for read-only views

### Affinity Graph

INDIRECT registry leaderboard only

### Admin Jobs

CONDITIONAL registry or measurement operation

### Domain / other UI

Registration and claim converge once; leaderboard/community membership agrees; exact measurements accepted; disconnect preserves local data/access; a new connection resynchronizes retained sources without duplicates within that connection

### Manual status

PASS

### Dev

PASS

### Last manual date

2026-09-16

### Automated coverage

Registry protocol, token/security, retry/idempotency and measurement failure handling belong to automated coverage; the integrated Operator happy path has not run

### Next manual oracle

Closed; next Operator Update prerequisite gate, then Revenue.

### Result

PASS

### Evidence / notes

Consolidates the previous OPERATOR-REGISTRY-LIFECYCLE-001, OPERATOR-COMMUNITY-LIFECYCLE-001 and OPERATOR-MEASUREMENT-LIFECYCLE-001 rows using one disposable registry fixture. Failure injection, token abuse, announcement fan-out and worker-retry branches are automated rather than separate Pair-QA checkpoints. Installed-host health and restart remain outside Pair QA.; 2026-09-15 Operator screen-level checklist prepared under checklists/operator; documentation only, no new execution or PASS. Reuse proven downstream product flows via fixtures.; 2026-09-15 English guide restored to original matrix detail:18 steps include one binding, signed membership, claim/group receipt, honest provider availability, exact accepted measurement totals/receipt, read-only no-duplicates, member/Admin fail-closed access and retained Operator recovery, then exact local/Registry restoration. No execution. | 2026-09-16 block1 PASS: real Java-to-Go registration, signed registration and installation receipt ledger45, reopened without duplicate. Root-owned dev data prerequisite repaired in Compose; fixture workaround removed. False UI success fixed and native error/success replayed. Evidence: guides/qa/evidence/OPERATOR-REGISTRY-LIFECYCLE-001-2026-09-16.json. | 2026-09-16 block2 PASS: pending/approved claim, signed owner membership and UI reopen; ledger45/audit7/review3 stable across final read. Claim controls desktop/mobile verified. | Block3 PASS: six accepted period reports, QMAU5/1/3/0/4/0, receipts46–51; unchanged sources/no duplicates on reopen. User corrected block4: new connection, retained local data/access, resynchronization; earlier full denial/reactivation wording was wrong.; 2026-09-16 block4 PASS: fresh enrollment, signed reactivation without claim restoration, exact six retained report receipts, second distinct signed disconnect/archive, Casey Events and Ava Reports accessible while disconnected. Mobile shared popup fullscreen and native scroll PASS. Paired Go bytes/local state/Mongo/session reset PASS. Targeted replay only; regression test added, not separately run. See evidence/OPERATOR-REGISTRY-LIFECYCLE-001-2026-09-16.json.

### Manual QA priority

P0 100

## OPERATOR-UPDATE-LIFECYCLE-001

### ID

OPERATOR-UPDATE-LIFECYCLE-001

### Type

Consolidated journey

### QA domain

Operator

### Area

Signed update and managed HTTPS

### Scenario

QA1 baseline; verified UI upgrade to QA2; UI rollback to QA1 with GitHub download on cache miss; disabled actions, visible progress, controlled failure/recovery; managed HTTPS and restoration.

### Statistics

X

### Monitoring / Metrics

DELTA one verified release, update job and active version

### Affinity Graph

X

### Admin Jobs

DELTA one durable update job

### Domain / other UI

The prepared release is accepted once; progress is honest; the screen reconnects after the controlled restart and shows the expected active version without duplicate work; managed HTTPS save/reopen, actual certificate and capability, operation correlation and exact restoration must also pass

### Manual status

PASS / CLOSED

### Last manual date

2026-09-16

### Automated coverage

Signature, corruption, downgrade, rollback and interrupted-worker branches belong to packaging/update automation

### Next manual oracle

Closed; final stable GitHub/security/UI smoke/performance campaign tracked separately.

### Result

PASS

### Evidence / notes

Consolidates the normal UI path from OPERATOR-UPDATE-001. Invalid/corrupt/downgrade controls and interruption fault injection are automated checks, not manual Pair-QA branches. Use only the prepared QA target, never the active development checkout.; 2026-09-15 Operator screen-level checklist prepared under checklists/operator; documentation only, no new execution or PASS. Reuse proven downstream product flows via fixtures.; 2026-09-15 English guide restored to original matrix detail:11 steps correlate one verified compatible release, one durable update job, honest progress, controlled restart/reconnect and active installed version; single Apply/reopen must not duplicate work. Disposable QA target and restoration remain required. No execution.; 2026-09-16 User queued Update last and will open VMware; read-only gate:0 running VMs. No update/deployment executed. PRERELEASE_DEPLOYMENT_QUALIFICATION.md retains UI image smoke, security fixtures/probes, measured memory/startup efficiency and prioritized deferred work.; 2026-09-16 User transferred complete Configuration C03 to Update block4/steps12–15. No assertion removed or passed by transfer. Dev must be stopped before VMware because of memory limits. Deployment qualification remains a separate evidence table. 2026-09-16: Preparation only. Localhost80/443 tunnel and trusted HTTPS health verified; installed manifest matches QA2. Both DEBs internally1.0.0, signed manifests/key absent, UI rollback not found. No install/apply/rollback. See OPERATOR-UPDATE-LIFECYCLE-001-2026-09-16.json. QA1 baseline subsequently installed per user request; snapshot complete, root LV18.22GiB, exact QA1 manifest, packaged qualification and trusted HTTPS health PASS. Upgrade/rollback remain NOT RUN. Real Operator bootstrap UI login and Updates popup open verified on QA1. UPDATE-UI-01: truncated action label and oversized empty popup body on narrow viewport; user requested deferred batch repair, no application change. Block1 step2 visible Refresh returned409 before Registry registration. UPDATE-UI-02: raw URL/long error covers icon and current-release label remains after failed lookup; deferred batch repair. Release verification not passed. UPDATE-UI-01/02 subsequently source-fixed with explicit user authorization:22/22 focused HTTP-service tests and ngc PASS; i18n audit blocked by existing landing loading key. Live candidate retest pending; QA1 runtime unchanged.; 2026-09-16 complete current-source QA1 signed/installed, packaged qualification and five retained configuration hashes PASS. Registry-independent GitHub QA2 discovery visible. FAIL: inline list layout hides Refresh/Apply; corrected to row, full QA1 r2 package preparing. No functional Apply or rollback PASS.; 2026-09-16 actual native QA1 r2 to QA2 Apply completed13:57:20Z, job upd_ec17edbf732bdebb08d37b9b3e55dd6a. Installation and Mongo/MinIO/configuration controls PASS; UI restart tracking FAIL. Source fix: all eight new regression cases PASS, focused files45/46 with unrelated old leaderboard-header expectation failure; not deployed. Historical QA2 discovery409 and no UI Rollback. Full row remains IN PROGRESS.; Local signed-source current-code replay: job upd_e706a97a8ab99457775c37903b5cadab completed14:42:46Z. Original popup reached100% without reload; busy and post-success controls PASS. Retained data unchanged; QA2 has exact QA1 recovery action. Independent progress reader requested next: source tests PASS, monitor QA1/QA2 packages preparing; not yet live-qualified.; Monitor r4 native update upd_d1194357f035a4a47afcd280169e1995 completed16:00:12Z; original popup100%,209 monitor responses, exact QA2 image health and preserved data/config PASS. Popup reopen no release request; explicit Check only, Update hidden without newer version. Success rollback control correction and duplicate success notice removal76/76 focused tests PASS; QA2 r5 building, live voluntary rollback pending.; r5 voluntary success rollback/cache-miss PASS. r6 controlled download failure, explicit retry and automatic reload in both update/rollback directions PASS; retained controls unchanged. r7 native schema3-to4 migration PASS with exact predicted hash and Configuration restored. TLS certificate installed/externally verified, but worker runtime0700 denied API reads; source fix and TLS/ownership tests PASS, r8 installation for focused HTTPS recheck underway.; CLOSED: r8 normal signed install and host qualification PASS. Native TLS job tls_95a2fb42967d1ca619fbcc7c2e8220d9 COMPLETED17:11:06Z, API200, saved/reopened manual qa.localhost, private inputs cleared; explicit-CA hostname/certificate verification PASS. TLS and release-source fixtures reset, QA Mongo/MinIO controls removed, original five configuration/key/TLS hashes restored, default source config and all services healthy. No additional rollback replay per user request. Local-source/manual-QA-CA scope; final stable release qualification separate.

### Manual QA priority

P0 98

## OPERATOR-REVENUE-LIFECYCLE-001

### ID

OPERATOR-REVENUE-LIFECYCLE-001

### Type

Consolidated journey

### QA domain

Operator

### Area

Revenue reporting

### Scenario

Open Revenue for one controlled captured/released payment set, synchronize once, inspect totals and one settlement, then reopen the view

### Statistics

DELTA exact eligible-provider aggregation by currency and completed period

### Monitoring / Metrics

DELTA daily revision-1 reports and signed acceptance receipts

### Affinity Graph

X

### Admin Jobs

X — durable Revenue outbox delivery; no separate Admin Jobs row

### Domain / other UI

Eligible payments aggregate once by currency; excluded controls remain unchanged; signed monthly network settlement matches daily reports and local source correlation; reopening preserves results

### Manual status

PASS

### Dev

PASS

### Last manual date

2026-09-16

### Automated coverage

Versioned fixture/oracle and live Java/Go/UI flow PASS; injected failures/requeue not run in this happy-path checkpoint.

### Next manual oracle

Closed; next Operator Update on user-opened VMware target.

### Result

PASS

### Evidence / notes

Consolidates the normal UI path from OPERATOR-REVENUE-001 and OPERATOR-REVENUE-003. Injected report failure and requeue behavior remain automated rather than a separate Pair-QA checkpoint.; 2026-09-15 Operator screen-level checklist prepared under checklists/operator; documentation only, no new execution or PASS. Reuse proven downstream product flows via fixtures.; 2026-09-15 English guide restored to original matrix detail:11 steps retain captured totals and authorized-only/released/dummy exclusions, provider/currency/period controls, one synchronization job/report revision/reconciliation, settlement/payment/booking identity and unchanged durable reopen. Payment creation remains fixture setup. No execution.; 2026-09-16 Full-flow PASS: EUR4850/count4, USD4000/count1; one UI sync accepted16 daily revision1 reports with signed receipts; exact exclusions/current-day boundary; signed AugustEUR monthly settlement basis3000/pool150, revision2 after normal eligibility preparation; reopen exact oracle unchanged; paired Go/local/Mongo/session reset PASS. Corrected earlier generated descriptions: no Admin Jobs row or per-booking Registry settlement; identities remain local. Evidence guides/qa/evidence/OPERATOR-REVENUE-LIFECYCLE-001-2026-09-16.json.

### Manual QA priority

P1 92

## OPERATOR-EMAIL-WARNING-001

### ID

OPERATOR-EMAIL-WARNING-001

### Type

Delegated full-flow journey

### QA domain

Operator

### Area

Email provider and deletion-warning Job

### Scenario

Configure backend-catalog SendGrid with a non-delivering local stub; verify secret handling, fixed five-day warning eligibility, provider failures, repeat-run suppression and restore.

### Statistics

X

### Monitoring / Metrics

DELTA stub request evidence and persisted warning outcomes; no real email delivery

### Affinity Graph

X

### Admin Jobs

DELTA account deletion warning eligibility, suspension, persisted outcome and failure history

### Domain / other UI

DELTA Operator email configuration save/reopen, masked credentials, validation and permissions

### Manual status

PASS

### Dev

PASS

### Local

NOT RUN

### Last manual date

2026-09-23

### Automated coverage

Existing backend/frontend watcher builds PASS. Versioned retry oracle PASS. Latest added standalone provider/worker/job-claim regression tests NOT RUN alongside dev compiler.

### Next manual oracle

Closed; fixture/config/jobs restored. Next ADMIN-CLIENT-API-001; Calendar remains last.

### Result

PASS

### Evidence / notes

guides/qa/checklists/operator/OPERATOR-EMAIL-WARNING-001.md; guides/qa/evidence/OPERATOR-EMAIL-WARNING-001-20260923-progress.md. UI save/reload, EN/HU, encrypted secret and 403/400/409 checks PASS; 202, 401, lost response unknown/no duplicate PASS. User retry supplement: initial + 3 durable retries, 503/429 and 5/10/20s dev delays; suspend/restart/resume, hourly-scan independence, success/exhaustion/no fifth call PASS. Email OFF/restored/expired retry guards PASS. No real mail. Cleanup PASS. Unsubscribe/branding supplement PASS: standalone anonymous EN/HU page, compact desktop/mobile button, confirmation/busy/failure/reload/invalid-link; durable suppression of queued retries and fresh normalized-recipient episodes, account-independent opt-out. See guides/qa/evidence/EMAIL-UNSUBSCRIBE-001-20260923.md. Fixture/stub/overrides cleaned. Separate-db isolation and latest Java units NOT RUN.

### Manual QA priority

P0 83


## 2026-10-15 — MSC115-JOBS bounded outbound retry follow-up

Focused backend verification passed: 65 JUnit tests, 9 HTTP transport tests,
11 seed-safety tests and all 8 service assembly ownership audits. A 40-task
worker-only stress fixture observed at most 10 simultaneous HTTP calls, 67 retry
calls total and no fourth attempt (733 ms elapsed, 3760 ms JVM CPU). These are
local component measurements, not application performance-parity evidence.

On KVM REAL and DEMO, the hourly producer recorded its first failure without
retrying inline. After restoring the owner URL and restarting affinity, the same
durable task succeeded on attempt 3 and all six originating Jobs entries became
completed. Two old-revision HTTP replays left signal/task/history state unchanged.
Identity's live streams no longer watch six foreign collections. Monolith live
health, local signal intents, six subscription collections and nine hourly Jobs
entries also passed. The original eight monolith containers, including
frontend-sync, are running again; the KVM is off.

Evidence: [bounded retry verification](../evidence/work-community/MSC115-retry-20261015/summary.json).
No full 115–119 campaign PASS is inferred. Original business flow and cleanup
items remain at their previous status; source guide checks are not repeated.
Template qualification and compilation optimization remain separate.
