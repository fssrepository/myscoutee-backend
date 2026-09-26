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

## Numbered block progress

| Block | Stable checklist section | Dev HTTP | Local |
| --- | --- | --- | --- |
| 1/25 | Group lists and category colors | NOT RUN | NOT RUN |
| 2/25 | Create and reopen a group | NOT RUN | NOT RUN |
| 3/25 | Group rules and draft persistence | NOT RUN | NOT RUN |
| 4/25 | Join requests and member decisions | NOT RUN | NOT RUN |
| 5/25 | Workspace selection and profile loading | NOT RUN | NOT RUN |
| 6/25 | App moderation, group moderation and support | NOT RUN | NOT RUN |
| 7/25 | Leave and remove membership | NOT RUN | NOT RUN |
| 8/25 | External sharing links and admission | NOT RUN | NOT RUN |
| 9/25 | Chat sharing basket and message changes | NOT RUN | NOT RUN |
| 10/25 | Cash history and affiliate exclusion | NOT RUN | NOT RUN |
| 11/25 | Contacts and the existing chat popup | NOT RUN | NOT RUN |
| 12/25 | Selection limits and contact-request controls | NOT RUN | NOT RUN |
| 13/25 | Empty calendar export | NOT RUN | NOT RUN |
| 14/25 | Birthday, horoscope and children fields | NOT RUN | NOT RUN |
| 15/25 | Landing social heading | NOT RUN | NOT RUN |
| 16/25 | Setup permission help | NOT RUN | NOT RUN |
| 17/25 | Common help seed and AI integration | NOT RUN | NOT RUN |
| 18/25 | Back and close-button history | NOT RUN | NOT RUN |
| 19/25 | First location save and Firebase sign-in | NOT RUN | NOT RUN |
| 20/25 | Stored location and optional tracking | NOT RUN | NOT RUN |
| 21/25 | Mobile sheet close buttons | NOT RUN | NOT RUN |
| 22/25 | Account-owned tools and Asset Explore | NOT RUN | NOT RUN |
| 23/25 | Profile scope and asset payment history | NOT RUN | NOT RUN |
| 24/25 | Account contacts and event-linked assets | NOT RUN | NOT RUN |
| 25/25 | Global notifications and scoped API keys | NOT RUN | NOT RUN |


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
