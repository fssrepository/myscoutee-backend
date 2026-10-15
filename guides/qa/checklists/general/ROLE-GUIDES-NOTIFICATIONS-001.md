# MSC-118 — ordered automatic role-guide and notification QA

Prepared on 2026-10-15 for the remaining development scope after MSC-115.
This document prepares execution; it does not start a browser campaign. Once
the user delegates MSC-118, execute the numbered steps in order, repair defects,
retest affected behavior and continue without repeated permission requests.

## Execution contract

Each block gives its baseline, actions and expected behavior. No checklist
hopping is required. Report progress by block/step; collect bounded evidence and
reconcile results at block/campaign end instead of editing this document after
every action. Preserve other campaigns and their fixtures. The active MSC-116
list already owns overlapping API/MCP, Events and role-producer checks, including
steps the executing agent has not reached yet. They are not additional work
here or in the later MSC-119 list.

Credit accepted MSC-115 evidence: common Next/Back/picker/Done, child/parent
restoration, launcher continuity, EN/HU desktop/mobile/short layouts in recorded
surfaces, no-guide/error/retry/pending-close, protected-context selector exclusion
and recorded local member/admin samples. Admin Home, Help Editor and article
list/view/editor variants have actual evidence; Reports has only an empty HU
mobile tour. Carry forward exact covered cells, not an entire untested role.

There are37 system contexts. The current catalog has189 conditional fields;
136 was the October7 delivery count. A catalog field is not a visible step.
Use actual rendered targets and preserve explicit unavailable prerequisites.

Use the existing watcher and serial test exceptions. Backend JUnit runs through
tools/run-backend-junit.sh. Frontend tests stop frontend-sync, wait for watcher
exit, run one non-watching test and restore the same service even on failure.
Never duplicate build owners or overlap monolith/KVM. Production, provider push,
full registration/moderation/payment business journeys and an actual six-hour
release-discovery observation remain separate qualification.

## Preparation

Baseline: Disposable Operator, Ava and Casey on the existing monolith.

1. Record source revisions, worktree state, active runtime/database/profile, health, CPU and memory. Check existing watcher logs and keep KVM stopped.

2. Run `node --max-old-space-size=192 frontend/scripts/sync-work-seeds.js --check`. Verify Operator `operator@myscoutee.local`, Ava `admin-demo-ava` and Casey `650000000000000000000061` in the current demo database. Compare each unread count to its actual recipient/workspace inbox.

3. Verify the role-v1 baseline: Operator release/join/security rows and Ava report/feedback/join/security rows. Preserve additional legitimate notifications. Record candidate IDs, read state, counters, mute and launcher preferences. Retain affected disposable records through the existing fixture snapshot owner before writes; missing restore support blocks writes, not read-only inspection.

4. Start `node guides/qa/tools/open-checkpoint-browser-sessions.mjs ROLE-GUIDES-NOTIFICATIONS-001` with access to the existing Mongo container. The configured three profiles, URLs and retained session cleanup own startup. Reuse those windows and capture bounded errors/request counts without secrets.

## MSC118-CONTROLS — Shared controls in three roles

Baseline: Recorded unread/mute state; EN1280×900, then HU and390×844/390×560.

5. In all three avatar menus check Notifications, Explanations and notification-button visibility. Operator and Ava can open their inbox without a member location. With unread/unmuted rows, both floating buttons are reachable.

6. Drag both buttons near each screen edge without accidental activation. Their targets remain separate and reachable on desktop/mobile/short mobile; preserve existing guide-card placement.

7. Switch each visibility setting OFF, close/reopen the menu and reload; then restore ON. After red-X dismissal the existing menu can restore the launcher. Hiding the bell neither mutes nor reads rows.

8. With the bell hidden, open Notifications from the menu. Open/close Guide and the inbox; ownership returns to the parent. Check EN/HU labels and actual five-line fit. Credit the accepted common no-guide/error matrix instead of replaying it.

## MSC118-OPERATOR — Nine system-guide contexts

Baseline: Deployment-wide Operator dashboard. On every surface in this block,
open Guide, walk every rendered target, use Back/picker/Done, then close the child.
Check foreground ownership, parent restoration, five-line fit and no per-step
content request in EN/HU at1280×900,390×844 and390×560. Guide navigation must not
execute a business action. Record unavailable conditional controls and their
prerequisites; do not install, register or claim a node just to expose a target.

9. Cover Operator Home and navigation: `operator.home`, `operator.navigation`.

10. Open Updates: `operator.updates`. Its normal signed metadata check is allowed; no installation, approval or rollback.

11. Open Registration and Claim when ordinary prerequisites permit: `operator.registration`, `operator.claim`. Inspect only; do not submit either form.

12. Open Configuration: `operator.configuration`. Discard the draft after the tour.

13. Open Revenue, Community and Deployments: `operator.revenue`, `operator.community`, `operator.deployments`. Return to Home between surfaces without modifying deployment state.

## MSC118-ADMIN — Uncovered contexts and conditional variants

Baseline: Ava's admin menu and legitimate disposable reports/feedback/jobs.
Use the same EN/HU three-viewport tour procedure. Credit the exact MSC-115 cells;
only missing variants require execution. Never moderate a user, run a job, save
a parameter or submit a payment merely to obtain a guide target.

14. Cover `admin.navigation`; retain accepted `admin.home` layout evidence and check parent continuity.

15. Open moderation and its settings: `admin.content-moderation`, `admin.moderation-settings`. Discard any settings draft.

16. Open Reports, report detail and item preview: `admin.reports`, `admin.report-detail`, `admin.item-preview`. Carry forward the empty HU mobile Reports tour; cover missing populated/detail cells.

17. Open Blocked users, Feedback/detail and Chat review: `admin.blocked-users`, `admin.feedback`, `admin.feedback-detail`, `admin.chat-review`. Record a missing legitimate child prerequisite explicitly.

18. Reconcile `admin.help-editor`, `admin.idea-editor`, `admin.article-view`, `admin.article-edit` with accepted MSC-115 editor/gallery/image tests. Test only previously unrendered conditional variants now exposed by the baseline. Do not reopen accepted tours without a relevant change.

19. Open Jobs, process detail, schedule editor and parameter editor: `admin.notifications`, `admin.process-detail`, `admin.schedule-edit`, `admin.job-parameter`. Close without running/rescheduling anything.

20. Open Parameters, edit and history: `admin.params`, `admin.parameter-edit`, `admin.parameter-history`. Close without changing a value.

21. Open Statistics, Graph help, Affinity graph and Monitoring: `admin.stats`, `admin.graph-help`, `admin.affinity-graph`, `admin.monitoring`.

22. Open Payment simulator and authorizations: `admin.payment-simulator`, `admin.payment-authorizations`. Inspect guide targets without payment/authorization changes.

## MSC118-PROTECTION — Current-source guards and seed parity

Baseline: Current watcher output and ordinary authorized Help API sessions.
October7 service-level checks are inherited evidence, not fresh controller proof.

23. Run `node --max-old-space-size=192 frontend/scripts/check-role-guides-notifications-runtime.mjs server/docker/conf/nginx/app/myscoutee`. Verify current catalog, EN/HU default/Work/Community seed parity, protected flag, local create/clone/activate/delete guards, role replay/isolation and stale unread synchronization. Diagnose stale probe assumptions against the real contract.

24. Using Ava's authenticated Help API, attempt protected new-language/create, protected-source clone into an editable context, activation and deletion. Forged `isSystem:false` cannot bypass the guard. Expect forbidden responses and independently unchanged revisions; member/anonymous access still enforces session/role policy. Credit the existing selector-exclusion proof.

25. Compare active guide HTTP reads for EN/HU and Dating/Work/Community to current catalog IDs/flags. Run only relevant existing JUnit guard/notification tests serially when current-source proof is missing or a repair requires it. Keep service/controller/browser evidence distinct.

## MSC118-INBOX — Role targets, read counts and mute

Baseline: Recorded disposable inbox rows and recipient/workspace counters;
EN/HU desktop/mobile. Normal actions own state changes, never direct counter edits.

26. Compare New/All for all actors: Operator release/join/security; Ava report/feedback/join/security; Casey no privileged role events. Security messages describe their owner's login, not another member's location.

27. Open Operator's release row: existing Updates popup, no installation. Close/return/reopen; the consumed route marker must not reopen the popup unexpectedly.

28. Open Ava's report, feedback and join rows: Reports, Feedback and Statistics. Operator's join row is informational; security targets stay in the owning actor's workspace.

29. Verify unknown/external targets and wrong-role target use are rejected. Use existing bounded converter/route tests for forged values, without inserting malicious rows into retained inboxes.

30. Mark one recorded unread row per role read. It leaves New, remains once in All and decrements only its recipient once. Repeat and reload: no second decrement or stale realtime resurrection; workspace filtering remains respected. MSC-115's Cases target/read PASS proves shared behavior, not these role targets.

31. Mute through the existing inbox action, reopen/reload and unmute. Read state, count and saved mute preference remain distinct from launcher hiding. Restore original mute and visibility settings.

32. Keep release/join/report-feedback/login producer execution with the existing MSC-116 role block, including currently pending steps. This is an ownership checkpoint, not another producer test. Record its eventual result against MSC-118 when available; continue the independent role-inbox UI checks without rerunning those producers. Seeded navigation alone does not prove real production; physical push remains separate.

## MSC118-LOCAL — Remaining adapter coverage

Baseline: Retain HTTP state. Switch serially through the established local route:
reuse the existing frontend fallback after its backend stops, not another Angular
server. Verify local adapter and disposable IndexedDB actors before actions.

33. Repeat three-role visibility, hidden-bell menu access, role targets, read/reload and mute restoration locally. Preferences/counts remain actor-owned.

34. Run missing operator/admin guide cells locally in EN/HU desktop/mobile/short view through ordinary navigation. Carry forward exact accepted MSC-115 local article/gallery/editor/no-guide samples; do not claim its untested combinations. Check parent restoration and protected-content guards with the actual local repositories. Restore HTTP and original service/watch owners; verify health.

## Closure

Baseline: Inherited evidence remains credited; only relevant changes trigger replay.

35. Repair each defect in its existing owner and retest the affected boundary. Record template affected/unaffected with a reason and propagate applicable shared fixes. Queue the exact remaining template checks in the existing template QA record; no template execution belongs to this campaign. Do not reopen its completed baseline or add omitted product screens.

36. If backend behavior changed, qualify the coherent batch with focused monolith and KVM runtime checks, serially with equivalent disposable data. Stop the first stack before starting the second; leave KVM off and restore the original monolith. No backend change means no unrelated KVM campaign.

37. Record visible jank, request counts and comparable CPU/latency observations. Next/Back must not refetch content or accumulate registrations. Signed release discovery retains startup/Updates/six-hour scheduling and deduplication. Do not wait six hours or claim that observation from unit tests.

38. Restore only owned inbox/session snapshots and recorded mute/visibility preferences through the existing fixture owner. Verify counters/retained records; preserve other campaigns. Close managed windows with `node guides/qa/tools/open-checkpoint-browser-sessions.mjs ROLE-GUIDES-NOTIFICATIONS-001 --close-only`.

39. At campaign end record block results with role, context/conditional field, language, viewport, adapter and revision. Separate inherited and new PASS, blocked and not-proven cells. Update the single ROLE-GUIDES-NOTIFICATIONS-001 row and regenerate CSV/XLSX totals. Close only demonstrated development scope; historical evidence does not imply a full new matrix, provider delivery or six-hour observation.
