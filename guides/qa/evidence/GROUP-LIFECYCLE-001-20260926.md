# GROUP-LIFECYCLE-001 — 2026-09-26 execution

Status: **NOT RUN** overall. Development corrections precede an ordered restart
from **1/25**, as requested on 2026-09-26. Earlier Dev HTTP spot checks remain
diagnostic evidence only. No full-block PASS is claimed; Local remains NOT RUN.

## Current defect and acceptance boundary

The user confirmed that group badges sum relevant **operations/changes**, not
the number of groups. This replaces the incorrect group-count interpretation;
no distinct-group-count implementation is authorized. Group member/organizer
visibility determines relevance; moderation is an additional admin-only source.
The complete badge and notification checks are numbered in checklist section 6.1.

Observed in Alex's prepared HTTP session: Hosting has Design Circle and Seattle
Friends; Participation has accepted and pending controls; Explore excludes those
own/interacted groups. Sport filtering leaves Seattle Trail Club. Category tints
and the orange Sport icon agree. Pagination and remaining block-1 checks are not
yet proven.

Confirmed defect: Seattle Friends displays its pending member count on the card
but the Members action had no counter. The shared converter now binds that
counter; deployed UI shows `Members 1` with the common red `counter--alert`
gradient (managed Alex session, `/tmp/group-member-badge-verified.json`). Broader group activity is
not declared fixed by that style change. Initial source inspection also found
no notification emission in either community-group membership service; the
follow-up below records the implementation and focused checks. Full recipient,
retry, persistence and live UI behavior still require the ordered QA journey.

### Badge geometry follow-up

The shared dropdown counter had an automatic width with horizontal padding:
the single-digit Members badge measured 20.84375 × 18px. The user asked for the
same circle size as the card's red badge, so its final minimum is 20 × 20px,
with natural width growth for longer labels. Existing flex centering is retained;
numeric glyph widths are tabular and counters cannot shrink in the menu row.

The shared media badge and card pending counter now use explicit unit line
height, normal letter spacing and tabular numerals. Final deployed DOM oracle
(`/tmp/group-badge-final-geometry.json`): menu 20 × 20px, card pending 20 × 20px,
main member badge 28 × 28px. Its label center differs from the badge center by
less than 0.02px on both axes. Existing frontend watcher build/sync passed at
2026-09-26 17:54:38 local time. These style checks do not prove the missing
membership notification/counter lifecycle or close block 1.

## Retained baseline and resume gate

### Conversation coverage audit (not execution results)

This inventory follows the original chat and its later corrections, rather than
only the latest defect. A checklist entry is **not** implementation or PASS
evidence. `L` means GROUP-LIFECYCLE-001, `I` GROUP-ISOLATION-001 and `A`
INTEGRATION-API-GROUP-001. Closed cases are not reopened.

| # | Final requested behavior | Existing check / gap |
| --- | --- | --- |
| 1 | Selected menu tint; group category/card palette; Join uses Event blue; pale rule-row toggle colors | L1, L3, L4 |
| 2 | Demo status badges supplied by both adapters; exclusive location-warning slot | L19; backend/local source and real selector need comparison |
| 3 | Own/interacted groups excluded from Explore; pending belongs in Participation; canonical association and varied local/Mongo seeds, no separate seed catalogue | L1, L4 and baseline |
| 4 | Group invitation reuses Event/affiliate flow, returned URL list, registration attribution, accepted group and saved active workspace | L8, A1–6 |
| 5 | Group-admin moderation and support; app-admin configurable group review; group status badge; no group-creation review by group admin | L6, I5, I7 |
| 6 | Relevant operation/change totals at menu/card/dropdown/sidebar; member-visible changes plus admin-only moderation; write-side, signal updates, no reload | L6.1; source corrected and focused checks below; complete UI journey NOT RUN |
| 7 | Notification goes to the affected recipient, not the mutating actor; no duplicate on retry; global bell with group reference/filter | L6.1, L25, I4; existing outbox/local repository reused; full HTTP journey NOT RUN |
| 8 | Avatar/profile load persists optional group selection and location parameters; no repeated X headers; membership-only selection; shared loading/timeout/rollback/retry | L5, L19–20, A4, I2 |
| 9 | Community/Impressions/Activities and profile scoped; header global; My tools and nested asset lists Base-owned/global; no subgroups | L22–25, I1–6; explicit subgroup/menu check to retain |
| 10 | Asset Explore global, Event Explore scoped; Base-key assets, scoped-key events; repository/service owns queries, stores hold identity/state | L22–25, I1–3, A5 |
| 11 | Asset expense remains with payer's group; Base owner can query income from stored payment fields; no split payer, copied payment or extra asset group label | L23, I12 |
| 12 | External sharing popup matches Profile Affiliate; no legacy raw-token menu; common Share icon/color | L8 |
| 13 | Existing chat share basket; tick below three-dot; selection count/list; mixed adds/removals; separate messages, deletion even beyond loaded page; circular controls | L9 |
| 14 | Cash receipt with member/note/notification; no affiliate commission; API-imported participant attribution | L10, A6 |
| 15 | Existing eventless chat popup; MyScoutee contact method; contact filter; invite only own contacts; separate App/Group support authority | L11, I7–8 |
| 16 | Separate chat permission request; orange/pending, approved/rejected colors; short noncompact filter beside search; newest-first Requests; pending-only sidebar count; live bucket moves | L12, I9–12 |
| 17 | Maximum selections in shared menu heading; date input/day-month/Libra; children labels; empty ICS notice | L12–14 |
| 18 | Setup help beside X; concise location/notification/install and Android/iOS denial recovery; confirmation overlays blur parent | L13, L16, I9 |
| 19 | Mobile sheets including baskets have own X/header; desktop title allowed but no extra X; native Back preserves session/consent | L18, L21 |
| 20 | Saved eligible coordinates survive rejected GPS/disabled tracking; first admission before app session; temporary point through avatar load; watcher 5km; demo seed normally eligible, retry controls | L19–20; full real entry still NOT RUN |
| 21 | Firebase rate-limit source and available retry information; no invented unlock time | UI notes item 6; real provider behavior not proved by demo |
| 22 | Expanded common help across environments; AI topic near start; API-backed anonymous help | L17 |
| 23 | MCP Go/Docker, Compose/nginx; actual API authority/discovery; group-key guidance; separate unpublished client packages using logo; local settings persistence only | L17, A7; moved unexecuted micros out of closed INTEGRATION-API-001 |
| 24 | Landing partner group/company card and distinct full-width API block/link; HU/EN; supported-country/report blur; desktop CTA left; social heading | L15.1 restores omitted micros; translated partner content exists in source, live test still NOT RUN |
| 25 | Notification description space up to three-dot; date at first row; two-line explanation; only All menu moved below X, no title widening | L25.1 restores omitted layout micros |
| 26 | Concise GitHub bug/feature reporting templates; installation-menu right-side dynamic version, not a popup-only label | L15.1; three local issue templates and menu runtime version binding found; remote/UI proof NOT RUN |
| 27 | Release 1.3.0 consistently across Docker/artifacts/Git tags; old releases preserved; supported packaged upgrades and install verification | Release/deployment queue; no release/upgrade PASS inferred |

Reuse existing component/service/store/repository flows throughout. Every later
user correction takes precedence over earlier proposals. This audit does not
authorize reseeding live data, publishing plugins or changing closed QA results.

The previous managed startup was interrupted by the reported location defect.
The reverted launcher configuration was restored in the existing launcher;
no alternative seed catalogue or browser runner was added.

The versioned command is read-only:

```sh
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh status community-group GROUP-LIFECYCLE-001
```

It verifies the retained `community-group` snapshot: ten groups and 27 community
memberships remain identical, and all three actors have eligible stored points.
The old marker's `permittedBlocks: [1,2]` referred to two list steps, which now
both belong to numbered block **1**. It does **not** prepare group creation in
block 2. Before mutation blocks, extend the existing fixture with exact snapshots
for their writes; do not restore this old snapshot over new user actions.

Actors: Alex Turner (owner control), Nagy Eszter (member/other owner), Maya Stone
(pending/other owner). Closed Calendar and Affiliate checkpoints remain closed.
The existing dev watchers own builds. No seed replacement or stack restart was
performed for this resume.

## Reported location popup

Read-only inspection of Maya's reported window found `/game`, a public member
with stored coordinates `47.5111, 19.0354`, and Setup open in settings mode:
`loggedIn=true`, `locationMissing=false`, no pending login completion or location
validation callback. This does not establish which earlier action opened it.
Current source routes automatic Setup requests through entry; background location
rejection does not open it. The user rule is explicit: discard unsupported new
coordinates, retain the last accepted point, and never automatically open Setup
or terminate a session for that update. This is recorded in block 20; the complete
manual regression remains NOT RUN. User-invoked Settings remains available.

## First manual block

In Alex's Groups list, compare these controls without writing data:

- Hosting: Seattle Friends, Design Circle.
- Participation: Photo Walks, Study Buddies (accepted), Makers Network
  (pending join), Game Night (pending invitation).
- Explore: the own and interacted groups above must be absent. Seattle Trail
  Club and Seattle Neighbours are public unrelated controls. Apply the existing
  visibility rules to private/invitation-only groups; no new rule is inferred.
- Check category filters, selected-menu tint, icon/card colors and pending badges.

Do not click Create/Join/Approve/Leave during this read-only block.

## Numbered block progress — current execution boundaries

Updated 2026-09-26 after the user requested sequential, fully closable blocks.
This table supersedes the original all-NOT-RUN table and old “partial blocks 2–4”
summaries below. Historical observations remain unchanged. Structural relocation
is not execution evidence: the moved checks remain required in blocks 27–29.

**HTTP: 7/29 closed; current 8. Local: 0/29 closed, queued as its own run.**
Full Lifecycle execution: **7/58 closed adapter-blocks**. This is coverage count,
not an estimate of elapsed or remaining effort. Isolation and Integration retain
their own untouched pending ledgers; these figures do not claim campaign completion.

| Block | Scope | HTTP | Local | Evidence / next boundary |
| --- | --- | --- | --- | --- |
| 1 | Group lists and category colors | PASS | NOT RUN | 54 HTTP page/sync combinations, browser pagination/bands; live mutation and Activity cross-check retained in 29. |
| 2 | Create and reopen a group | PASS | NOT RUN | QA Group Flow creation/name validation/save/reopen; role roster matrix moved to 27.1. |
| 3 | Group rules and draft persistence | PASS | NOT RUN | Required fields and textual policies cancel/save/reopen, off/on retention, read-only; geometry in 27.2 and requests in 28. |
| 4 | Join requests and member decisions | PASS | NOT RUN | Real join/approval and send/reject/reinvite/accept, live lists, persisted memberships and profiles; after-invitation-checks. |
| 5 | Workspace selection and profile loading | PASS | NOT RUN | Saved workspace, failure/timeout/retry/stale response/reload and policy authority; after-workspace-selection; role geometry in 27.3. |
| 6 | App moderation, group moderation and support | PASS | NOT RUN | 2026-09-27 closure below; after-moderation-checks captured and verified, resume 7. |
| 7 | Leave, Trash, restore and blocked reapproval | PASS | NOT RUN | 2026-09-27 evidence below; after-membership-trash captured/verified, resume 8. |
| 8 | External sharing links and admission | IN PROGRESS | NOT RUN | Scoped sharing fixture active; admission/UI subcases recorded below. No partial closure. |
| 9 | Chat sharing basket and message changes | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 10 | Cash history and affiliate exclusion | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 11 | Contacts and the existing chat popup | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 12 | Selection limits and contact-request controls | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 13 | Empty calendar export | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 14 | Birthday, horoscope and children fields | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 15 | Landing social heading | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 16 | Setup permission help | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 17 | Common help seed and AI integration | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 18 | Back and close-button history | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 19 | First location save and Firebase sign-in | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 20 | Stored location and optional tracking | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 21 | Mobile sheet close buttons | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 22 | Account-owned tools and Asset Explore | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 23 | Profile scope and asset payment history | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 24 | Account contacts and event-linked assets | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 25 | Global notifications and scoped API keys | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 26 | Group administrators, responsibility transfer and last-member deletion | NOT RUN | NOT RUN | Retained earlier branch observations; complete here when reached. |
| 27 | Group editor and roster presentation across roles | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 28 | Group detail loading and adapter request boundaries | NOT RUN | NOT RUN | Execute in order; no partial credit. |
| 29 | Cross-surface distance and mutation ordering | NOT RUN | NOT RUN | Execute in order; no partial credit. |

Closure provenance for 2–5: the creation, members/media/policy, join-live and
admin/selector evidence sections below and their linked JSON artifacts. Additional
earlier off/on and cancel/reopen observations are retained in
[Editor closure evidence](GROUP-LIFECYCLE-001-editor-closure-20260926.json).

Execution order: continue HTTP 7–29 without returning to closed 1–6.
Next run Local 1–29 with its own evidence and savepoints; then the queued Isolation
and Integration campaigns. A newly discovered defect is repaired/retested within
the current block. A genuine unavailable prerequisite moves to an explicitly
counted later block before advancement; no requirement disappears.

## Setup popup defect follow-up

The popup reappeared during standardized startup despite valid stored actor
coordinates. Source tracing found an independent trigger in AppSetupPopupComponent:
`installPromptVisible` opened Setup whenever no other popup covered it. It had
no session guard. This supersedes the earlier incomplete diagnosis based only
on the open store state; no user settings click is inferred.

Added a session guard at that existing automatic-offer boundary, using session
identity even before the profile loads. Explicit Settings and entry permission
requests remain available. Four focused tests pass (demo/Firebase/operator
sessions and signed-out automatic offer); the separate existing help-rendering
test was not run in that focused command. Existing frontend watcher rebuilt and
published successfully. The first focused runner attempt failed before loading
tests because its temporary setup file was outside the Vite root; the rerun used
a removed-after-run setup file in the project root. No duplicate Angular build.

Initial resume startup completed for all three actors, but this popup defect
interrupted the handoff; that startup does not prove the fix. Group block 1 and
the complete entry regressions remain NOT RUN. Block 19.1 and API blocks 2–3 now
explicitly require real entry UI; closed PASS rows remain unchanged.


## Corrected startup handoff

Versioned baseline status and launcher completed again after the popup fix.
Read-only inspection of the reported defect found all three actors at `/game`,
each with its own accepted stored point and `setupOpen=false`, while both
`installAvailable` and `installPromptVisible` remained true. This exercises the
previously failing automatic-install trigger on the deployed build; no browser
click, form, manual list action or full-entry PASS is claimed.

This startup record predates the explicit automated-QA delegation. The current
instruction is to finish corrections and restart at block 1 in order; the user
does not need to perform checklist actions. The 25-block table remains NOT RUN
until execution results arrive. Later write blocks require scoped preparation.

## Group correction follow-up — development verification, not QA PASS

1. Stored pending-member counters now receive transition deltas through the
   existing member-write path on both adapters, following Activity Event's
   `applyActiveEventMembershipDeltas`. The intermediate recount implementation
   was removed after the user's correction. Notification insert/read success
   likewise increments/decrements stored member attention; duplicates do neither.
   Mongo upgrade 007, demo/E2E JSON and local storage hydration
   initialize the new field. Membership actions update only their own fields,
   preserving counters concurrently maintained by notification writes.
2. Membership notifications use the existing backend outbox and local notification
   repository. Join/invite/accept/remove/role changes target affected recipients,
   exclude the actor and carry the group reference. Stable operation identifiers
   prevent duplicate notifications when a completed action is retried.
3. Bucket/category counters, member menus and group cards share returned state
   through existing stores. Read deltas update the same state; stale polls are
   rejected. Explore explicitly supplies zero to the shared menu (null would
   aggregate alerts). Retained profiles do not expose activity after membership
   removal or before acceptance. Shared Event distance grouping handles 0 km.
4. User-confirmed correct scope: Design Circle 1 + Seattle Friends 1 gives the
   selectable workspace menu **2**; the pending Game Night invitation adds one
   to the Groups sidebar, giving **3**. No pending workspace becomes selectable.
5. Thirteen focused frontend checks passed with the existing Vitest configuration
   and one worker: five popup/category/distance checks, five local membership/
   recipient/read/retry checks, and three store scope/stale-poll checks. The local
   test fixture initially omitted the empty Event table; that fixture-only error
   was corrected before the successful rerun. These are not browser/IndexedDB
   persistence or HTTP lifecycle proof.
6. Existing frontend and backend dev watchers compiled the changes successfully;
   no second application build was started. Backend mapper/invitation regression
   tests were extended but not executed alongside the continuous Gradle owner.
   Full Java tests and ordered local/HTTP UI execution remain pending.

The retained fixture reports `badge-writes-ready` with join snapshots prepared.
No product membership action has been performed for these prepared blocks.
The versioned `verify-lists` gate confirmed all ten groups and 27 memberships
against the retained baseline without mutation. BSON field order after adding
`pendingMembers` is ignored; field presence and values remain exact. Restore
now retains the new counter schema and the original snapshots for provenance. No closed PASS case was changed.

## Block 1 continuation and replay boundary — 19:06 local

- HTTP lists checked for Alex, Eszter and Maya. Hosting/Participation/Explore
  reflect their accepted, pending and unrelated memberships. Alex has two
  Hosting groups; Participation includes Game Night invitation and Makers
  request; Explore excludes both. Category Sport leaves Seattle Trail Club.
- The versioned `prepare-list-pagination` fixture temporarily added 24 named
  controls. Scrolling loaded all 27 Explore cards, and Sport loaded all 25
  matching cards, without duplicate IDs. `restore-list-pagination` removed
  only those controls and verified the original ten groups/27 memberships.
- **Correction:** the earlier 3.2 → 5 km expectation was wrong. The user requires
  interval starts: 3.2 → 0 km, 5.1 → 5 km, 10 → 10 km everywhere. Shared Activity
  labels, Event Explore labels, group ordering on HTTP/local and Rate ordering
  on HTTP/local were corrected together; the Feed already used this rule.
  The old upper-bound focused assertion is superseded, not evidence of PASS.
- Ten focused checks passed (five rate-order and five group-menu/shared-distance
  checks), including 4.999/5 and 9.999/10 boundaries. Existing frontend and Java
  watchers compiled successfully. Java test execution remains pending.
- `capture ... lists-ready`, `verify-savepoint ... lists-ready` and
  `restore ... lists-ready` succeeded through the existing common Mongo
  snapshot/restore helpers. The restore verifies the exact saved documents.
  Original cleanup snapshots remain retained. This checkpoint resumes block 1;
  it does not claim that block 1 passed. Browser sessions subsequently reopen
  through the versioned launcher.

### Replay commands

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh status community-group GROUP-LIFECYCLE-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh restore community-group GROUP-LIFECYCLE-001 lists-ready
node guides/qa/tools/open-checkpoint-browser-sessions.mjs GROUP-LIFECYCLE-001
```

After a verified section, capture its named boundary before subsequent writes
and record the next numbered block here and in the handoff. Reuse the existing
scenario and snapshot helpers. Extend the prepared selectors/oracle for later
write blocks before capturing them. Never overwrite an existing savepoint or
mark a fixture capture as a test PASS. `block-1-complete` was captured at
17:10:23 UTC, before the additional ordering checks; its name is not evidence
that block 1 passed. Remaining block-1 UI replay is still in progress. Local UI
execution remains NOT RUN. Closed PASS cases remain untouched.

## Block 1 continuation — list ordering, privacy and toolbar

- Historical coverage correction: the original checklist in `ae0342ea9`
  (2026-09-24) included an invitation-only fixture, but did not explicitly
  require exclusion from Explore totals, pages and sync. Those assertions were
  added in `2c7d250a9` (2026-09-26 19:22 local). This closes an omitted QA
  expectation from the original request; it is not a changed user requirement.
- `verify-community-group-lists.mjs` passed 54 HTTP page/sync combinations
  across Alex, Eszter and Maya, both sorts and all Explore categories. Each
  page contained one item, exercising the full cursor sequence. No invitation
  group appeared in Explore; the stale invitation-only card was removed by
  sync. Alex's direct Book Circle detail request returned 404. Results:
  `GROUP-LIFECYCLE-001-list-orders-varied-20260926.json`.
- The existing temporary pagination fixture uses 24 groups at eight real
  coordinate distances. Creation dates deliberately run in the opposite order
  from modification dates. The browser loaded all 27 Explore cards in both
  Distance and Recent; both sequences exactly matched the HTTP oracle. Recent
  started with controls 24, 23, 22, 21, proving modification-date order.
- All 24 distance controls had correct visible bands: nine under 0 km, nine
  under 5 km, six under 10 km. No missing or duplicate cards were observed.
- The shared popup now puts Recent/Distance before X and the existing create
  action, as an icon-only circular plus, at the second row's right edge.
  Measured at 500px and 390px: sort and X share the first row; plus and bucket
  share the second row; plus is 36x36px. No new popup/style mechanism was added.
- Existing frontend watcher compiled/deployed at 19:29:45 local. The six
  focused group popup tests passed after moving the sort control. Local service
  privacy/order tests previously passed eight cases. These unit results are
  separate from Local browser execution, which remains NOT RUN.

The ordered campaign remains at block 1; live write-driven reorder coverage
and Local browser coverage are not inferred from list reads or fixture setup.

## Continued corrections — policy, confirmations and contextual aggregates

The campaign remains at block 1/25; the following are focused regression proofs,
not a complete block or local/HTTP campaign PASS.

1. Four buckets use Hosting / Active groups / Invitations / Explore. A real
   Game Night invitation acceptance was confirmed through the managed browser:
   pending card counter 1, matching brown action/confirmation, then immediate
   removal from Invitations and appearance in Active groups with member count 3
   and no pending counter. The versioned prepare-invitation/restore-invitation
   helpers restored the exact affected group, members, profiles and notifications.
   Notification delivery to the non-managed inviter was not proven by this check.
2. Group textual policies reuse Event Policy/FormFlow. The managed browser saved
   a named policy with description and reopened it successfully. The read-only
   view opens the same editor with all inputs disabled and the heading Policy.
   At 390px, Open Policy Setup measured 164.72px inside a 320.22px panel, left
   aligned; Profile visibility rules retained its text. Required Profile Fields
   distinguishes profile requirements from Group Policies. The requirements
   heading now uses the existing profile-form badge icon. The temporary policy
   was restored through prepare-editor/restore-editor; no test policy remains.
3. Workspace rows aggregate each user/group profile's contextual attention;
   Main owns account tool/contact counters. Avatar sums these scopes once,
   without adding event invitations to event.all again. Group realtime responses
   now carry accountCounters on the existing poll and apply them through the
   existing counter revision guard. The 27 focused base/HTTP/workspace tests
   passed. A watcher-only TypeScript failure exposed an incompatible DTO shape;
   using the existing realtime converter corrected it. The seven base tests
   passed again and the frontend watcher deployed successfully. Live inactive
   Main polling and all impression/mutation combinations remain to be proven.
4. Application-wide confirmation source review covers 72 direct dialog open
   calls plus helper/runtime-menu and template-provided headings. The inventory
   is CONFIRMATION-DIALOG-AUDIT-20260926.json. Short action headings became
   questions; action buttons remain short. Hungarian and English entries also
   cover dynamic contact names, asset names and help revision numbers. Forms,
   error notices and payment summaries were not mislabeled as confirmations.
   Managed UI verified the invitation question and Cancel without a write.
   The moderation/following tests initially failed on old title expectations;
   after updating them, all 25 passed. Other focused dialog checks passed 29
   cases. This does not claim every destructive action was executed in a browser.
5. Existing backend and frontend watcher builds succeeded. The i18n seed audit
   passed with 7,968 entries across two source bundles and demo/e2e/prod seeds.
   Source generation does not claim a live production database reseed.
6. Latest fixture status: ten groups, 27 memberships; paginationPrepared,
   invitationPrepared and editorPrepared are false. Retained join preparation
   and original checkpoint snapshots remain. No closed PASS case was reopened.

## Realtime group cursor regression

- A read-only live oracle reproduced false impression changes on an unchanged
  group profile: the generated profile ID contains colons, which shifted the
  colon-delimited cursor's fingerprint positions. Both flags were true despite
  identical cursors and no domain mutation.
- The existing cursor writer now escapes the identifier delimiter; the reader
  also normalizes retained unescaped cursors for that profile. No counter reset
  or profile/session deletion was added.
- The running Java watcher compiled and restarted successfully. Two unchanged
  live polls returned both flags false, with both new and retained cursor input.
  Evidence: GROUP-LIFECYCLE-001-realtime-cursor-20260926.json. A focused Java
  regression test was added for unchanged and actual stored-impression changes;
  that Java test has not been executed separately from the running dev build.
- The managed browser subsequently showed Design Circle attention 1 rather than
  the erroneous 3, Main attention 155 and avatar 158 (Main plus three relevant
  group operations). Read-only store inspection matched the accountCounters
  delivered by the same existing group-profile poll. No extra polling endpoint
  was introduced. All mutation/impression combinations remain outside this proof.
- Actor 0 was returned to Main profile through the normal workspace menu.

## Block 2 started — created group and runtime continuity

- After the Main-profile badge report, read-only inspection proved actors 1 and
  2 still ran older frontend code without accountAttention and retained local
  IDs u3/u4. Refreshing their existing managed pages loaded the current HTTP
  actor profiles. Main-profile menu row and selector both rendered 99+ with
  underlying sums 171 (Eszter) and 166 (Maya). No badge rule was redefined.
- The versioned creation fixture snapshots owner groups, owner memberships,
  account/group profiles and affected moderation state before product writes.
  Restore refuses an unrelated created group, other members in the created
  group or changes to unrelated moderation items. This is a temporary control,
  not a new seed or another runtime stack.
- Created QA Group Flow through the editor, after proving empty and 21-character
  names disable Save. Uploaded the repository app icon through the real input.
  Public/Friends/name/description/image persisted and reopened; server detail
  confirms accepted Admin membership. Immediate SmartList insertion put the new
  card first in Recent. Resource timing showed the save and workspace refresh,
  with no separate group page reload.
- Creation snapshots remain prepared while blocks 2–3 run. The app-owned upload
  URL is recorded in the structured evidence; physical media cleanup is not yet
  proven. The overall case remains NOT RUN/unfinished.

## Blocks 2–4 continuation: member access, card attention, images and rules

- Removed the duplicate Members card-menu entry; the media member badge remains
  the roster entry. Hidden rosters use the existing Event Explore accessory/disabled
  card presentation. Non-admins see the crossed-out eye with no red member badge;
  accepted administrators retain management and pending/member-change attention.
- Card three-dot counters now use the shared appMenuAlertCounter over their actual
  menu entries (currently moderation). Full group/profile attention remains in
  the workspace/category/bucket aggregates; it is not copied onto unrelated card
  actions. Accessible member badges use membersActivity (already includes pending
  decisions) without adding pending twice. Nine focused Vitest cases passed.
- Browser proof: hidden outsider badge is inert with no red counter; organizer
  Design Circle badge remains clickable with pending 1. Invitation Game Night
  three-dot has zero while invitation bucket/category retain 1 and Accept remains.
- Group info cards use the existing media-fit type, now supported by shared InfoCard,
  with contain. A 192x192 uploaded icon renders fully within the 452x132 compact
  media area, preserving its top edge and proportions. Existing cards keep defaults.
- Required-field picker: two equal columns verified at 500/390/320px, no control
  overflow. Only this picker opts into the shared FormFlow mobile column setting.
- Required Profession/Interest persist. Textual mandatory rule and recommendation
  were entered through the shared policy editor. Cancelling outer group edit left
  stored policies disabled/empty; repeating and saving persisted both texts and
  required=true/false. Read-only reopen title is Policy and all fields disabled.
- Versioned prepare-hidden-invitation snapshots the existing invitation before
  setting hideMembers for this negative-access branch. Hidden Game Night invitation:
  Cancel left pending/invite, acceptedMembers=2, pendingMembers=1, version=0.
  Confirm Accept moved it in place from Invitations to Active groups; backend read
  shows accepted Member, requestKind=null, acceptedMembers=3, pendingMembers=0,
  activity=0, version=1. Hidden badge stays inert with member total 3 and no red count.
  No membership or visibility bypass was added to production code.
- Evidence: GROUP-LIFECYCLE-001-members-media-policy-20260926.json. Case remains
  unfinished; complete local-adapter browser coverage and remaining numbered
  blocks are pending. No earlier closed PASS case was reopened.

## 21:17 continuation: shared badge, separate Explore and live join/approval

The enabled Group member badge now uses the same `badge-with-leading-accessory`
layout as Event Explore, including its shared dark-blue gradient and white border.
Deployed DOM: 43.15625 × 28px, 2px rgba(255,255,255,.9) border, 999px radius.
Hidden-roster access rules remain as previously verified. Structured observations:
[`GROUP-LIFECYCLE-001-join-live-20260926.json`](GROUP-LIFECYCLE-001-join-live-20260926.json).

The normal launcher initially timed out for Maya. Her stored main and group
coordinates were valid. `/auth/me` and realtime resolve her retained active group
profile, while the readiness check incorrectly required the base account ID.
The launcher now verifies the returned profile against the authenticated account's
accepted workspace list and requires realtime to return that same profile. All
three managed sessions then launched successfully, preserving the selection.
The nearby 403 location writes were rejected Austin browser samples, not evidence
of invalid persisted coordinates or failed authentication.

HTTP block 4 observations, through the ordinary managed UI:

- Main buckets Hosting/Active/Pending/Invitations use green/orange/amber/violet.
  Only the separate Explore has categories; sorting precedes Close in its header.
- Main Pending remained open behind Explore. Join Cancel preserved the state;
  confirmed Join removed Seattle Neighbours from Explore and inserted it into
  Pending through the existing change store. The pending applicant had no profile.
- Eszter's already-open roster received Alex's new pending row, and the underlying
  card/member counter and Hosting/sidebar attention updated without reload.
  The shared member polling gate previously excluded `community`; it now includes
  it, and its existing change callback refreshes/publishes the changed group.
- Approve Cancel preserved pending. Approve confirmed with a full question and the
  same success palette as the menu. Eszter's roster/card changed from 2 accepted +
  1 pending to 3 accepted + 0 pending. Alex left Pending when that list resumed its
  foreground poll and appeared in Active, with exactly one workspace profile.
- While Explore covered Pending, a remote approval did not poll the covered list;
  the ordinary foreground resume converged. This is distinct from the immediate
  same-window Join signal update; do not claim hidden surfaces independently poll.
- The accepted workspace appeared in Alex's normal selector. Selecting it and
  reloading retained Seattle Neighbours. Pending/loading/timeout behavior is not
  proven by the immediate synchronous DOM sample and remains to be tested.
- The ordinary invitation picker was inspected without submitting: Alex was not
  found in the candidates examined. Normal send/accept/reject remains open; the
  earlier seeded hidden invitation acceptance is separate evidence.

Existing frontend watcher compilation and deployment passed at 21:12:48.
Focused Vitest: member popup 6/6 and Group converter 9/9 passed. No separate build
or stack was started. The `after-join-approval` savepoint was captured and verified
at 2026-09-26T19:17:15Z with accepted Alex, three accepted members, zero pending and
one workspace profile. It resumes block 4's remaining invitation branch, not a
complete block/case PASS. Local browser coverage remains NOT RUN.

### Normal invitation and invite-popup identity checks

The candidate prerequisite was Eszter→Alex's existing `single` rate with `met=false`.
The first fixture preparation attempted a separate record and was rejected by the
owner/mode/target unique index; its retained snapshot was restored immediately.
The corrected versioned `prepare-member-invitation` snapshots the exact pair and
Trail Club mutation scope, then sets the encounter prerequisite on that existing
record. This is preparation only: no invitation/membership is fixture-created.

Eszter selected Alex in the ordinary Invite members popup and submitted. Alex's
Invitations card appeared with no workspace profile. A concrete UI defect was
reproduced while Alex retained Seattle Neighbours as his active profile: his own
incoming invitation had no member actions because identity comparison used the
workspace profile ID. Community member actions now use the existing account
resolver; Event actions retain profile identity. After deployment, Reject Cancel
preserved pending; confirmed Reject removed it. The danger menu/confirmation
matched, and Eszter's open roster converged. Eszter invited Alex again; card Accept
Cancel preserved pending, then confirmed Accept moved him out of Invitations,
created one Trail Club workspace and changed accepted count 3→4, pending 1→0.
Both Accept surfaces used the established brown palette and a full question.

The user clarified self-exclusion refers specifically to **Invite members**, not
the incoming invitation's member actions. The existing candidate repositories
already exclude the inviter. A separate HTTP defect was reproduced: with Maya's
Seattle Neighbours profile selected, querying candidates for Language Lab (which
Maya administers) returned 403. Java now resolves the authenticated community actor
through the existing account resolver before checking admin membership; other
owner types retain profile identity. Frontend query dispatch likewise normalizes
community identity before either adapter. Same read-only request after deployment:
200, 20 candidates, no Maya/base/group-profile self candidate. Eszter: 200,
25 candidates, no self. Both actual Invite members popups loaded and showed no
inviter. No new self-exclusion rule or self-invitation capability was added.

Focused tests: updated member popup 7/7; invite service/local self-exclusion 3/3.
Java regression added; no separate Java test runner was started. Existing backend
watcher build succeeded and actual HTTP before/after was verified. Frontend watcher
deployment succeeded at 21:28. Java unit execution is not claimed.

Remaining observed issue: remote list delta can insert an invitation while its
bucket aggregate remains stale (two invitation cards with 1 each, header still 1).
`CommunityGroupsStore.sync` applies list results without updating workspace-owned
aggregates, and the background workspace poll yields to the foreground list.
This is not marked fixed or PASS. Follow the existing Activity counter update
contract when repairing the missing aggregate propagation.

### Foreground aggregates and retained checkpoint

The aggregate issue above was repaired in the existing Group sync owner by
refreshing workspace-owned counters after a current foreground response. Actual
Explore-open invitation delivery changed Invitations 1→2 and Groups 4→5 while
Explore remained 0. Focused store tests 2/2 passed; frontend watcher deployed at
21:32:02. Temporary Trail Club invitation controls and encounter prerequisite
were restored before capture. `after-invitation-checks` was captured and verified
at 2026-09-26T19:34:07.723Z, resuming block 5. A Main-profile request was then
failed using the existing CDP network harness; rollback/retry remains unverified.

### Block 26 — Admin responsibility and notifications: NOT RUN

The requested separate block covers promotion, revocation by the granting Admin
only, creator departure, Admin-first/member-fallback takeover, last-member
deletion, contextual Asset Manager icons/palettes/confirmation buttons, and the
corresponding notifications, recipient scoping and exact-once badge effects.
Local and dev HTTP execution are NOT RUN. No closed PASS case was reopened.
Source inspection: CommunityGroupsService currently rejects creator removal and
step-down, and implements promotion without durable granting-Admin provenance.
The local adapter mirrors those limitations. These are implementation gaps, not
passing tests. This documentation update does not claim the lifecycle is fixed.


### Block 26 — implementation and partial execution, 22:10 CEST

The previous NOT RUN entry records the earlier source state. The implementation
now reuses ActivityMember.managerGrantedByUserId, shared member actions, menus,
confirmations and notification outbox in HTTP and local adapters. No full block
or testcase PASS is claimed.

Actual browser/HTTP sequence on isolated `manual-qa-community-admin`:
- Alex promoted Eszter; Eszter promoted Maya. Persisted granting IDs matched.
  Alex could not revoke Maya (no menu action; HTTP 403); Eszter could revoke her,
  leaving her accepted Member. Menu and confirm palettes matched.
- Creator Alex left; Eszter took responsibility. Eszter subsequently left with
  only ordinary member Maya remaining; Maya took responsibility as Admin.
- Maya selected the group profile and left as last member. Card disappeared,
  workspace returned to Main profile, group detail returned 404; deleted lifecycle
  and deleted memberships were stored.
- Fixture restored and prepared through versioned commands. Ordinary member Maya
  cancelled Leave, then confirmed it: card removed immediately, Alex and Eszter
  remained accepted, group active. One member-removed notice to Alex; no takeover
  notice. Alex then promoted Eszter and left. Clean release produced exactly one
  owner-left notice for Eszter, no duplicate member-removed notice for that release.

The first owner-release run exposed duplicate member-removed + owner-left
notifications. Both adapters now emit the responsibility notice for that release;
retry notification is restricted to the matching release timestamp.
Opening the takeover notice marked it read and decremented Eszter's group counter
2 to 1, but exposed an initial-bucket bug: a mounted list stayed in Invitations
when the async detail selected Hosting. Reactive bucket fix is awaiting retest.

Earlier focused execution: 49/49 passed across local group service, Group card,
member popup and notification converter. Java watcher build and actual HTTP
requests passed; no separate Java unit runner was started. Latest focused rerun
including ordinary-member leave is in progress. No full local browser lifecycle,
concurrent takeover, crash/retry boundary or closed campaign row is claimed PASS.

Retained isolated fixture must be restored before main-campaign replay. The
`after-invitation-checks` savepoint remains the main campaign resume point (block 5).


Follow-up: 52/52 focused tests passed (five files), including ordinary-member
leave/retry. After watcher deployment, notification Open group loaded Hosting
with the eligible QA group. Normal Take Over confirmed Eszter as responsible
Admin; group active. The isolated snapshot was restored using the versioned
restore-admin-lifecycle command; main campaign savepoint was not replayed.

User-reported duplicate group-name badge removed from notification headlines.
Actual 360px DOM inspection: Seattle Neighbours and two long Event titles show
no inline duplicate badge, row overflow false, timestamp retained. Shared menu
counterTone=alert restores outside red Home Filters/Ratings counters; final
render verification pending.


### Block 5 selection transport checks and reusable boundary — 22:14 CEST

The versioned CDP harness held the real Main-profile HTTP response past the
configured timeout. At 150ms the selector was disabled and Seattle Neighbours
remained selected. After 3.5s it re-enabled, retained Seattle Neighbours and showed
Unable to switch workspace. A normal subsequent Design Circle selection succeeded.
Releasing the older held response did not replace Design Circle; reload retained
Design Circle. Earlier normal same-target retry to Main also succeeded.
`after-workspace-selection` was captured and verified at
2026-09-26T20:13:47.292Z. Resume block 5's remaining profile/policy/layout checks,
then block 6; do not replay completed setup from block 1. No whole block 5 PASS.

Home red-counter position verified at 360px: alert class, absolute positioning,
above and outside both buttons. That check additionally exposed 118px minimum
button widths: compact density was mistakenly an inert attribute. Corrected it
to the existing AppMenu model density setting; final width verification follows.

Final Home check at 360px: Preferences 123.5px, Filters 71.7px, Ratings 79.6px;
all controls fit. Both counters retain alert class and sit above/outside their
buttons. Durable sanitized observations are retained in
[Admin/selector/layout evidence](GROUP-LIFECYCLE-001-admin-selector-layout-20260926.json).
The initial failed notification route is preserved alongside the successful
retest, rather than represented as passing evidence.


### Block 26 concurrency, former creator and step-down — 22:20 CEST

A fresh isolated Admin control was prepared through the versioned harness. Alex
left normally. Two concurrent HTTP takeover commands from the accepted ordinary
members returned Eszter 200 and Maya 403. Eszter's retry returned 200 without an
extra notification. DB: one responsible Admin, two accepted memberships, one
owner-left notice per eligible successor and one takeover notice for the other
candidate only. This proves the running single-instance boundary, not a
multi-instance or process-crash transaction boundary.

Former creator Alex appeared in Explore after takeover. He requested to join
through the normal card menu; Eszter approved in Members. Alex returned accepted
Member with no grant. His card menu showed View, Leave group, Report group; no
Edit or Moderation. Eszter then cancelled and confirmed Step down as admin through
her member menu. Group entered under-review, all three remained accepted Members,
responsibility notices targeted Alex and Maya. Hosting removed the card in place.
The isolated control was restored afterwards. One additional local retry test
passed; current local Group service 17/17. Full local browser and HU coverage,
process-crash recovery and remaining broad campaign checks are still unproven.

Block 5 policy read: Design Circle's saved requiredFields contains
profile.profession. Its active group-profile editor renders the Profession
visibility as Public and disabled; the same control in Main profile is enabled.
Unrelated Workplace/School controls remain enabled. Both editors were closed
without saving; Design Circle was selected again. This checks the established
visibility policy, not a newly invented mandatory nonempty-value rule.

## 22:48 continuation — retained moderation branch and progress restructuring

No fixture reset or replay occurred for the restructuring. The main
`after-workspace-selection` savepoint remains retained. Isolated
`manual-qa-community-admin` remains prepared with exact restoration snapshots.
Two pending Photo Feed items were fixture-prepared; this proves no publication
flow. UI approval reduced pending 2→1, rejection with message reduced 1→0;
card/Hosting/Groups counters updated immediately. Both repeated HTTP commands
returned 200 with unchanged item version 2, state revision 5 and pending 0.
One Group support message was stored. Recipient filtering showed Group support 1,
App support 0; reading removed the Group support/Chats count, and normal reply
created the return message. These observations do not close block 6.

Categories now use the existing tabbed AppMenu multi-toggle sheet, preserve the
selection label and have a working X. Actual DOM: three toggles, zero check icons,
label All → Asset, Photo Feed → All, close/reopen successful. Shared component
covers app and group modes; app-admin/browser, mobile and save/reopen remain to
verify. Item action menus omit the current state. The group rejection input label
was corrected from App support to Group support; EN/HU and all three i18n seeds
synchronized (8008 messages). Focused moderation component tests: 10/10.

Outstanding within block 6: finish settings save/reopen/mobile/authority,
publication producer, block/unblock, worker, stale response and full support/app
moderation boundaries. Group support currently shows an unrelated View Event
header action; this observed defect must be repaired and retested here.
The last proof is a live prepared branch, not a new savepoint or whole-block PASS.


## 23:02 continuation — real publication and shared gallery regression

HTTP Lifecycle remains 5/29 closed, block 6 in progress; across the three HTTP
cases this is 5/48 (29 Lifecycle + 12 Isolation + 7 Integration). Local execution
is reported separately, not added to the number of defined HTTP blocks.

Settings save/reopen preserved Asset, Photo Feed; All was restored. At 360px,
the Categories sheet has three toggles, no checkmark items, a reachable X and no
horizontal overflow. An ordinary member's moderation read and settings write
returned 403, with unchanged administrator settings. Block/unblock changed the
pending counter 0→1 once; the configured real content-auto-approve worker then
accepted the item (version 5) and removed it from Under moderation without a
reload. Auto approve was subsequently disabled again; delay remains 1 minute.
The unrelated View Event action on Group support was removed through the shared
chat header guard and verified after normal reload, with both messages retained.

Share photos originally skipped the two-slot layout below 760px. The shared
carousel now displays two slots at 730px (335.7px each), and one at 360px.
Forward/back navigation works in both. A follow-up exposed a blank half-page
after slot 5: native scrolling now ends at the actual final slot; its final view
contains slots 4 and 5, with no Next arrow. Existing desktop transform is retained.
The running frontend watcher built/synced successfully at 22:58:49 CEST.

The real Photo Feed producer initially had no eligible Event. The versioned
prepare-admin-feed-event command retained exact Event/member snapshots within
the existing Admin restoration boundary and inserted one eligible scoped event.
This is prerequisite preparation, not an Event creation PASS. Eszter selected
that Event in Image details, entered QA group publication and saved normally.
Stored post 4b172683-f636-48dc-a3a8-c7f88c1ef7c5 belongs to her group profile,
contains the authoritative Event reference and starts under-review. The group
pending counter changed 0→1; Alex's already-open moderation list received the
item and its card/menu counters updated. His normal approval dialog/action
removed the row immediately, pending/card red counter returned to 0 and Groups
returned 6→5, retaining unrelated attention. No gallery draft was discarded for
this test. The isolated control remains LIVE; cleanup has not yet run.

Sanitized observations: [moderation/publication JSON](GROUP-LIFECYCLE-001-moderation-publication-20260926.json).
Still open within block 6: app-admin group review/report/settings lifecycle,
late stale-response counter guard, full HU/support/global-isolation and remaining
6.1 counter/recipient combinations. No whole-block PASS or fixture reset.


## Block 6 resume checkpoint — 23:17 CEST

**User requested a retained checkpoint before leaving. Stop at this boundary;
leave all four windows open. HTTP 5/48 closed across the three cases, Lifecycle
5/29 closed/current 6; Local NOT RUN. No block-6 PASS.**

Completed since the previous entry:
- Added full read-only Group and Photo Feed previews to block 6 at the user's
  request. App/group moderation share the existing editor/gallery components.
- Photo Feed moderation now opens the editor layout read-only, with per-image
  Event/organizer/location/caption details. A real two-image group post was
  published; Alex selected both images and read their distinct captions. No
  upload/remove/save controls; Event/location/caption cannot be changed.
  Existing gallery/carousel tests: 15/15 PASS; normal slideshow retained.
- Group form controls wrap against their actual available container width.
  Editor and admin read-only view at 780/860px: complete labels, no overlap;
  mobile and 1000px checks retained. Read-only disabled/empty textual policies
  no longer leave an empty section; the editable policy toggle remains.
- App-admin Ava opened the existing Design Circle moderation record through
  Accepted/Groups. Full stored description and Profession policy were visible;
  fields disabled, no save. A populated textual-policy nested preview is still
  to verify. No claim that every Group policy variation passed.

Runtime incident and recovery: the companion admin launcher initially omitted
its existing preserveOtherSessions option and closed the three actor windows.
No fixture was reset and no stored test action was replayed. Both configurations
now preserve other sessions; the three actors were relaunched through the
versioned launcher after the read-only fixture status gate. The admin companion
uses fixtureCheckpointId GROUP-LIFECYCLE-001, so its centralized login snapshot
belongs to the same retained fixture, not a new QA case. Ava's startup guide
dismissal is disabled because that app-admin surface has no client guide.

### Exact retained UI and next action

1. **Alex (GROUP-LIFECYCLE-001 actor 0):** Design Circle editable Group form open,
   unchanged. Can close without save to return to Groups.
2. **Eszter (actor 1):** QA Admin Transfer workspace, Public Feed open. Both
   normal publications persisted; the first is approved, the two-image post
   with captions QA group photo one/two remains under review.
3. **Maya (actor 2):** Main profile, Share photos editor open with TWO uploaded
   images, existing Event selected on both, captions QA base photo one/two.
   Save is enabled but **has NOT been clicked**. This draft is not a published
   post and must not be counted as a successful producer action. Exact image
   references/metadata are retained in the JSON checkpoint.
4. **Ava (GROUP-LIFECYCLE-001-APP-ADMIN actor 0):** app-admin moderation,
   Accepted/Groups, Design Circle read-only preview open.

**Next:** verify the retained Maya draft and then click its normal Save action;
current app moderation is disabled, so verify the resulting accepted Base feed
post. In Ava's moderation select Accepted/Photo Feed and verify that same
read-only multi-image editor and both metadata panels. Then continue the remaining
block-6 app Group report/create-review/settings lifecycle, stale-response guard,
HU/support/global invariance and outstanding 6.1 counter/recipient combinations.
Keep existing settings snapshots and restore them within their own boundaries.

### Data boundary / resume gate

Main community-group phase badge-writes-ready, after-workspace-selection retained.
Isolated manual-qa-community-admin and adminLifecycleSnapshots remain LIVE. The
versioned prepare-admin-feed-event prerequisite is included in those snapshots.
prepare-admin-base-feed captured Maya's Base feed/global moderation boundary
before the pending publication, and guarded restoration against unrelated global
moderation writes. **Do not restore either fixture, recapture an old baseline,
close windows, relaunch, reupload or repeat prior actions on normal resume.**
Read this checkpoint, run community-group status, then inspect only these retained
windows/state; continue at Maya's pending Save. If the browser boundary changed,
diagnose it first and retain the saved results.

[Exact retained state and UI evidence](GROUP-LIFECYCLE-001-block6-resume-20260926.json).

## Block 6 continuation — 2026-09-27

Retained status gate passed; all windows and Maya's exact unsaved two-image draft survived. Normal Save persisted Base Feed `6f4b3399-efbd-4490-8122-473d750d1f8b`, accepted with both captions and Event metadata. Ava opened Accepted/Photo Feed and selected both images/details: correct distinct captions, Event/organizer/location, no Save/upload/remove; fields read-only.

Creation prerequisite initially refused the block-1 baseline because Seattle Neighbours had the retained join transition. The creation harness now verifies the existing after-workspace-selection list snapshot and retains that same boundary for cleanup; no domain reset or loosened field comparisons. Preparation passed with productWrites=false.

App moderation disabled: normal creation QA Group Flow Off was immediately accepted. The first settings save correctly conflicted with a concurrent Group creation revision; settings remained unchanged. QA Group Flow On therefore also belongs to the disabled branch, not an enabled PASS. Reopened fresh settings, enabled moderation/all four categories and disabled auto-approve; persisted revision 781 verified before the next producer. QA Group Flow Hold `7fc7c15d-a3d2-429b-a18c-8e239303e24a` was then created normally and is under-review. Owner card shows Under moderation. Ava opened its complete read-only Group editor including both textual policies, then the mandatory Policy details: all fields disabled, no save.

Evidence: [continued block-6 observations](GROUP-LIFECYCLE-001-block6-continued-20260927.json). HTTP remains 5/48 closed; block 6 still in progress. Creation snapshots are LIVE alongside retained Admin/Base Feed snapshots; restore creation before restoring Admin. Next: app-admin decision/report branches, status badge geometry, then remaining support/counter checks.

### 00:39 — app moderation/report branch and user UI corrections

App-admin accepted Group Hold and Group Error through their confirmation dialogs. Under-review rows/counters disappeared immediately. Replaying Hold's exact approval command returned version 2 and unchanged global revision 790. Maya's report persisted once with community source/id and appeared in Ava's Reports. Found and fixed the source card routing: it previously generated an Event support URL; it now invokes the existing read-only Group editor. Actual UI opened full description/policies with disabled fields and no Save. The reported-owner card now names Alex, not the group's name.

User-requested errors: the moderation error was unstyled and below the form. It now uses existing danger colors at the top of the popup body immediately below the header. Actual revision-conflict observation measured red rgb(164,60,69), a single alert and no horizontal overflow. Successful list polling previously cleared the settings failure; separate settings-error state prevents that. Focused moderation component tests 11/11 PASS. The first mobile observation occurred after the old poll cleared the error and is NOT claimed as mobile error-layout PASS.

User-requested review card color: Group moderationStatus now selects the existing shared review surface used by Event/Asset. Browser verified review's sand gradient while under-review and normal green after remote approval via the existing 30-second list poll, without reload for the transition. This uses the existing review layout as well as its palette.

The existing frontend watcher built/synced successfully at 00:37:52 CEST; no independent app build. restore-creation passed with exact after-workspace-selection list verification, removed the four owned test groups/reports and restored the original app moderation settings/global queue. Admin/Base Feed fixture remains LIVE. Remaining block 6: support/HU/global isolation and outstanding 6.1 counter/recipient/stale/concurrency checks. HTTP remains 5/48 closed.

### 00:43 — Group support isolation and language

Alex read Eszter's retained reply: Group support/Chats 1→0 and Groups 6→5 in place, leaving moderation pending 1 and other group attention intact. His normal reply produced one new message; only Eszter's group chat copy gained unread=1 and her base account notification total gained one (36→37). Base chat/App-support counters, every unrelated chat and global moderation state remained identical. Eszter read it: group unread/Chats/Groups 1→0. Both actors retained the list beneath the message popup. One logical conversation has two owner copies, not two conversations. Replaying the original rejection returned version2/revision21/pending1; message count remained3, with read receipt updates only.

Browser-language emulation through the existing CDP helper loaded real Hungarian bundles after reload: html lang=hu, Csoport support and Alkalmazástámogatás filters present. The helper restored original browser languages and reloaded afterward. The initial short-lived locale override disconnected before load and remained English; only the final language-eval observation is Hungarian evidence. No navigator monkey patch or application-store mutation.

### 00:44 — real delayed moderation response: FAIL → fixed browser replay PASS

Held the actual periodic group moderation response before accepting the real two-image post. Original behavior: decision immediately removed the row and badges, then releasing the old response resurrected the row (counters stayed correct). Fixed the popup loader to reject snapshots older than the existing scoped store revision with the existing SmartList AbortError contract. No parallel polling or full-list reload. Replayed via normal Block/Unblock to obtain the same retained content pending, then held its normal poll and accepted through the dialog. Immediate pending/card1→0, Hosting3→2, Groups5→4. Released old response: list stayed empty and counters stayed correct. No reload between decision and assertions. Initial unit run exposed DOMException/Error identity in jsdom; the abort guard now explicitly accepts DOMException too. Final focused rerun follows.

### 00:47 — confirmation waits for persistence, failure and delayed-response proof

The existing shared DialogStore awaits the mutation promise; moderation applies the saved snapshot/row only after the HTTP result. A real intercepted Block POST failed before reaching the server: confirmation remained open with its error and draft, accepted row/count stayed unchanged. Retried from that same dialog while withholding the real successful response for 1.5 seconds: Saving… remained visible, both buttons disabled, original row and Accepted=3 retained. Only after releasing the response did the dialog close and the row disappear, Accepted=2. Mongo independently showed the same post blocked/version6. No UI/store injection or reload. Unblock through the normal confirmation then returned it to pending for the remaining combined member/moderation counter checks.

Shared-dialog regression tests now cover delayed success, duplicate confirmation suppression and failed-save draft/retry retention. Focused moderation plus dialog tests: 17/17 PASS; earlier stale-response-only rerun was 12/12 PASS. The misleading EN/HU moderation error instruction to reload was replaced with retry wording; existing frontend watcher sync succeeded at 00:47:05 CEST.

### 00:51 — member/notification counters: adapter regression fixed

Using the retained isolated QA Admin Transfer control, Maya left and requested membership again through normal confirmations while one Feed moderation remained pending. Stored pendingMembers=1 and moderationPending=1 coexisted. Approving the Feed removed moderation attention without clearing member attention. Alex's unread member-departure notification independently contributed one member change in addition to the pending decision. Reading it persisted communityUpdates 1→0 but the open card remained stale: FAIL.

Cause: both HttpNotificationsService and the base NotificationsService rebuilt the read response without its existing communityActivityDelta. The NotificationCenterStore/GroupWorkspaceStore/Groups SmartList delta path already existed. Both adapters now preserve the committed delta; no new refresh request or counter reconstruction. Focused HTTP and Local adapter-boundary tests: 2/2 PASS (the Local route here is a mocked adapter boundary, not a Local lifecycle browser PASS).

Alex then approved Maya through the normal dialog: retained Members 2+1pending→3, card total2→3, pending badge1→0 and Hosting3→2 immediately, with underlying Groups still open. Mongo confirmed accepted membership/pending0. Only Maya and Eszter received membership-approved notifications; Alex did not. Maya's browser loaded the new bundle once before retest. Thereafter normal notification read, with no reload, changed her retained group member badge1→0 and sidebar Groups2→1 within the response; Seattle Neighbours' unread change remained. Mongo: Maya communityUpdates0, Eszter1 unchanged. Retrying the same read returned HTTP200/delta0/unread12 and identical read timestamp. No duplicate decrement.

Current retained control: all three accepted; moderation pending0; two-image post accepted again; Eszter has one unread member change and Group support messages. Main/Admin snapshots remain live. No block-6 closure yet.

### 00:54 — concurrent read/membership and member toolbar labels

Started Eszter's unread member notice read and voluntary departure concurrently through authenticated HTTP. Both returned200; read delta-1 and membership deleted, accepted total2/pending0. Mongo retained communityUpdates0 on the deleted association; Alex's one departure change remained. Rejoined through the normal HTTP endpoint, then Alex approved through the browser confirmation. All three accepted again; Alex's independent unread departure still counted. This is concurrent API evidence, not a browser-confirmation test for the departure itself.

User-requested Members toolbar labels now remain visible on both Invite and Pending only in the shared Event/Asset/Group member popup. Existing watcher build/sync completed00:52:17. Actual360px viewport: both36px-high buttons on the same row, labelClipped=false, no popup horizontal overflow; pending counter right edge355.8px fits. The initial button.scrollWidth heuristic included the intentional outside badge and was not a clipped-label finding; measuring the label itself confirms it fits.


### 01:08 — HTTP block 6 closed; replayable block-7 boundary

Existing app-admin Event/Asset queue rows referred to removed Affiliate QA resources (both source collections confirmed absent), so they were not preview PASS evidence. The versioned prepare-admin-previews branch used the retained Group Feed Event and an existing unchanged Asset as read-only preview prerequisites. Actual Group moderation opened the full View Event and View Supplies editors: all content fields read-only/disabled, descriptions and cover shown, no Save. Underlying Groups/moderation remained. These prepared queue records do not prove publication of Event/Asset. Group and multi-image Feed publication/preview had independent real producer evidence above.

Settings save transport failure remained red below the header at360px after subsequent list polls, preserving draft values, with no overflow. EN/HU source and all three Mongo translation seed bundles now agree at2026.09.27.*.1; existing Mongo watcher imported only i18n_messages/i18n_bundles. Live HTTP bundles return retry wording without page-reload instructions. The already-open popup had the prior in-memory dictionary; that observation was not represented as new wording.

Profile aggregate oracle: Maya Main166 (118 rates +9 chats +37 event.all +1 feedback +1 asset), Group1+1, avatar168. Nested invitation/hosting values were not added twice. For live Main changes while a group remains selected, first snapshotted the existing Base chat plus all affected owner profiles/notifications through the versioned harness. Attempting to read that Base chat as Alex while his Group profile was selected returned404 and wrote nothing. Maya, on Main, then sent one real HTTP message. Alex's stored Base chats5→6 and notification count11→12; selected Group chat0 unchanged. His existing browser realtime path updated Main155→156 and avatar160→161, with Group buckets/rows unchanged and no reload. One stored message confirmed. This is an external-producer/realtime-consumer check, not an Alex Base chat navigation PASS.

Together with the earlier settings ON/OFF, auto-approval worker, decision/retry, read-only publication, Group support, locale, role/counter and concurrent member/read evidence, HTTP block6 is PASS. Local remains NOT RUN as its separate adapter pass. No later block is closed by these observations.

restore-admin-lifecycle succeeded: temporary Group/feed/moderation/Event controls and Base-chat message effects restored from their retained snapshots, including other affected Base-chat owners; global moderation unrelated-record guard passed. Captured after-moderation-checks at2026-09-26T23:05:42.557Z for resumeBlock7. Initial exact verification detected only Alex's automatic Main fallback after fixture removal; selecting his retained Design Circle through normal UI restored the captured workspace boundary. Exact verify-savepoint then PASS. HTTP progress6/48; Lifecycle6/29.


## 01:30 — HTTP block 7 closed: leave, Trash and blocked restoration

User steering during this block: Group Trash follows the Activity Event bucket;
Restore after voluntary leave restores accepted membership without new approval;
admin removal is blocked and Restore requires approval. These are distinct
membership transitions, not group deletion. Last-member deletion and Admin
handover remain separate block-26 browser checks. Existing creator/grant rules
remain: restoring membership does not restore historical Admin authority.

Seattle Neighbours (`seed-community-neighbours`) was the retained real control.
Alex's ordinary leave removed the card and workspace; server membership became
`deleted`, Eszter Admin and Maya Member remained accepted. Direct removal of the
owner by Alex returned403. Reload independently preserved the left state.
The new Trash page returned the group with activity0, while Active/Explore
excluded it. Its member badge is disabled and its menu contains Restore.

The actual Restore confirmation was failed at the HTTP transport boundary:
error retained, original Trash card remained, server still deleted. Retrying
with the real successful response held for1.8s kept both dialog buttons disabled
and the original card visible. Releasing the response closed the dialog,
removed the card and restored the workspace through the canonical store response,
without reload. Membership was accepted, requestKind null, accepted roster3.

Eszter then removed Alex through the retained member menu and confirmation.
The roster/card count changed3→2 immediately; Alex's server status was blocked.
The existing cross-session polling moved his card into Trash and removed the
workspace. Its Restore confirmation explicitly requested administrator approval.
After confirmation, the card left Trash and appeared in Pending groups;
requestKind join/status pending, accepted roster2, workspace not selectable.
The admin's retained roster showed2 accepted+1 pending and its badges reflected
that request. Repeated Restore returned the same pending state. Direct self
approval returned403. A second admin-removal branch also explicitly proved that
self-remove cannot recast blocked status as voluntary leave:403; Restore remained
pending and self-approve remained403. The ordinary administrator Approve
confirmation returned Alex to accepted; roster/card3, pending0, and Alex's
retained Pending list and workspace selector updated through normal polling.
An independent reopened list and API/DB reads confirmed three accepted members.

Implementation uses the existing membership association, shared app menu,
Activity Event Trash palette/card tone and shared persisted confirmation/store
path. HTTP and Local adapters preserve the same deleted/blocked distinction.
Local roster writes retain inactive associations while other people are invited.
A focused retry test exposed same-millisecond owner-release ambiguity; handover
notifications now also match the actual responsible account, not timestamp alone.

Verification:41/41 focused frontend tests across4 files; existing frontend
watcher build/sync and backend hot-deploy successful; i18n audit8016 messages,
three generated Mongo seeds; no parallel build or domain seed replacement.
Unit checks include invitation-only blocked reapproval, retained Trash during
another invitation, last-member no-resurrection and no historical Admin
privilege restoration. These are not a Local browser campaign PASS or a block26
browser PASS. Detailed real UI/API observations:
[block7 evidence](GROUP-LIFECYCLE-001-block7-trash-20260927.json).

Captured and exactly verified `after-membership-trash` at
`2026-09-26T23:28:34.299Z`, resumeBlock8. Alex remains on Design Circle with
Groups Active open; Eszter retains Seattle Neighbours Members over Groups.
No closed block was replayed/reset. **HTTP7/48; Lifecycle7/29; next8.**

01:34 follow-up: Pending only now reuses the shared inline label toggle: icon + label + switch, external alert counter. Actual360px DOM:160.2×36px, right352.3px, no overflow; false→true→false filters3→0→3 with Groups retained beneath. Existing watcher build/sync PASS; user reviewed and requested continuation to8. No new block credit.

### 01:52 — Block 8 in progress; entry UI corrections

HTTP remains **7/48 closed**, Lifecycle **7/29**; block 8 remains open.
`prepare-sharing` retains its scoped baseline; `GROUP-LIFECYCLE-001-ENTRY`
adds two isolated anonymous entry sessions without replacing the existing actors.
Alex's Design Circle share URL reached the signed-out entry and New profile UI.
The fresh UI identity `demo-profile-331d498c-7fb5-4e0a-8626-5785c6060fb8`
was tracked with `track-sharing-registration` before any registration submission.
No admission/registration outcome is claimed yet.

User-reported entry defects repaired while preserving this branch:

- Setup help uses API/Affiliate's `question_mark` and the same blue popup
  header action. Live open/close retained the parent setup and its six help cards.
- Birthday uses the shared DateInput with an opt-in fixed `____/__/__` typing
  mask. Digits fill/overwrite slots, `/` separators stay fixed, and the caret can
  move ahead or back. Browser check: typing `19741004`, replacing the year,
  backspacing across the month/day separator and replacing the month produced
  `1980/11/04`; the actual form review showed `1980-11-04` and Scorpio.
  This is form-state proof, not a persisted profile claim.
- Removed the setup component's unsolicited PWA-installability → permission
  popup effect. Explicit settings and existing Firebase login gates still own
  opening; demo entry no longer opens the permission popup merely because the
  browser offers installation.

Focused existing date-adapter/control and setup specs: **20/20 PASS**,
`frontend/.agent/date-mask-vitest.log`; existing frontend watcher build and sync
PASS at 2026-09-26T23:50:39Z. No separate Angular build was launched.
The second entry session's unsaved date-mask probe was discarded by reload to
verify the new entry bundle; no profile was saved there. First entry session's
tracked registration form remains open.

### 02:18 — Shared SmartList card sizing correction (block 8 remains open)

- User reported full-width Activities cards despite room for two columns.
  The shared SmartList mobile breakpoint forced a flex column below 760px.
- Existing container-adaptive, `auto-fill` card layout is now the common
  default (280px minimum), rather than a Community Groups customization.
  Explicit single-column and mobile-column configurations remain respected.
- Existing frontend-sync watcher compiled and deployed successfully.
  Live HTTP Activities at viewport 596px: available list width 568px,
  two 281.39px columns; an isolated card under a date heading keeps that width.
  At 360px: one 332.22px column, no forced two-column overflow.
- This is a presentation regression check, not closure of sharing/admission.
  HTTP progress remains 7/48; Lifecycle 7/29, block 8 in progress.

### 02:55 — Block 8 continuation: admission, language comparison and removed-member protection

HTTP remains **7/48 closed**, Lifecycle **7/29**. Block 8 is not closed;
sharing snapshots and temporary media remain retained pending exact cleanup.
Machine observations: [block-8 progress](GROUP-LIFECYCLE-001-block8-progress-20260927.json).

- Fresh Group Link Visitor completed normal registration through the Design
  Circle external link: accepted membership, one group profile and selected
  workspace. Existing Maya's historical inviter attribution was retained.
- Fresh Event Link Visitor and existing Maya entered the Main Event's normal
  pending-invitation flow. The Main event did not create a group membership.
- The group-owned QA Workspace Link Event admitted Event Link Visitor to
  Design Circle, created one group profile, selected that workspace and created
  one pending Event invitation for that profile. Reopening retained the same
  membership/profile identities and the independent Main Event invitation.
- HU desktop (676px) and mobile (360px) checks now pass for Group, Event and
  Affiliate copy controls: read-only complete URL, copied checkmark, 32px Copy
  button and 27.44px field height, no horizontal overflow. Earlier EN desktop/
  mobile observations are retained. Initial HU clipboard failure was not a
  product PASS; foreground-window retries succeeded without application changes.
- Using the owner's real Members menu and confirmation, removed Event Link
  Visitor. The retained Members/Groups surfaces updated without reloading.
  The confirmation used the shared red gradient. The external Event link was
  then rejected; Mongo retained blocked Group membership and the same Event
  association. A normal Trash Restore requested approval; replaying the Event
  link again failed instead of accepting the pending restoration.
- Asset external Share-link entries were removed as requested; chat checkbox/
  basket sharing remains for block 9. The owned Asset menu visibly contained
  Availability, Edit and Delete only.
- Home Local candidate scoping was corrected earlier; five focused tests passed,
  and the combined group-entry suite passed 30/30. This does not constitute the
  full browser Home rating isolation check, which belongs to Isolation block 3.
- User asked to stop editing the missing Events primary badge and continue QA.
  The current code still uses the Active Events count there: invitation-only
  observation Events=0 / All=1 remains unresolved; no badge-fix PASS is claimed.
- User explicitly requested fixing the fresh test user's missing location.
  Normal Settings Update returned 403; it did not save coordinates. The tracked
  QA account and its retained group profile were given the launcher's configured
  Austin coordinates (30.2672, -97.7431). After fixture verification reload,
  locationRequired=false and memberActionsAvailable=true. This is an authorized
  test-data correction, not proof of the production Settings save path.
- Only Alex and Event Link Visitor browser windows remain open. Other managed
  actors were closed at the user's request; their persisted fixture state remains.

Remaining before block 8 closure: exact sharing/media cleanup. Its group-profile
Affiliate link selector needs attention: the snapshot uses userId, while the
stored affiliateLinks record is keyed by _id. Do not discard the retained
snapshot or claim cleanup until this scope is accounted for. The fresh visitor
currently has a pending restoration; the event-link rejection dialog remains
open. No closed block was reset or replayed.

### Continuation with a valid existing actor — Maya, application UI only

The user prohibits ad hoc Mongo writes. The manually corrected fresh actor is
excluded from subsequent PASS evidence. No location fixture command or product
code change was introduced. Existing actors were reopened by the versioned
launcher after the read-only status gate; only Alex and Maya remain open.

Maya's location was present before this replay in Mongo and the loaded UI:
`locationRequired=false`, `memberActionsAvailable=true`. All membership changes
below were submitted through visible application controls and confirmations.
Mongo was used only as an independent read oracle.

- External group-owned Event link selected Design Circle and created one pending
  invitation for Maya's existing group profile. Existing Group membership,
  historical referrer and independent Main Event invitation remained intact.
- Accept through the card and confirmation persisted accepted membership.
  The retained card changed 1/10→2/10 without reload. Reopening the same link
  preserved the identical membership IDs, accepted state and one group profile.
- Alex removed Maya through Members. Reopening the old Event link failed and
  left Group membership blocked; accepted Event membership did not bypass it.
- Maya used Trash→Restore and confirmed the request. The existing owner Members
  popup received the pending request without reload. Reopening the Event link
  again failed, preserving pending restoration.
- Alex approved Maya through the Members confirmation. Group membership became
  accepted; the link then opened the existing accepted Event again with the same
  profile and association. No test outcome was seeded or patched.

[Full replay evidence](GROUP-LIFECYCLE-001-block8-maya-20260927.json).
This completes the valid-existing-user admission/replay/removed-member chain.
Block 8 remains open pending its cleanup boundary; HTTP7/48, Lifecycle7/29.
The fresh-user location correction is not a successful registration/location
save test. Earlier fresh-actor observations must not be presented as that proof.
