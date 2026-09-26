# GROUP-LIFECYCLE-001 — 2026-09-26 execution

Status: **NOT RUN** overall; Dev HTTP block **1/25** partially exercised under
explicit delegated automated QA. No full-block PASS is claimed. Local remains
NOT RUN.

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
not declared fixed by this change. Source inspection also found no notification
emission in either community-group membership service; the existing event
notification workflow is the reuse reference. Recipient, retry, write-side
counter, and live update behavior remain unverified.

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
| 6 | Relevant operation/change totals at menu/card/dropdown/sidebar; member-visible changes plus admin-only moderation; write-side, signal updates, no reload | L6.1; current membership/aggregate defects under investigation |
| 7 | Notification goes to the affected recipient, not the mutating actor; no duplicate on retry; global bell with group reference/filter | L6.1, L25, I4; community membership notification hook absent in inspected services |
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

Next action belongs to the user: Alex → Community → Groups, block 1 list/filter/
color checks above. The 25-block progress table remains NOT RUN until execution
results arrive. Later write blocks still require scoped fixture preparation.
