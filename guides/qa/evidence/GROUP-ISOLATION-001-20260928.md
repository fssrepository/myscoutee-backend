# GROUP-ISOLATION-001 — 2026-09-28 execution

## Authorization and start

User explicitly requested automated full-flow Isolation QA like Lifecycle.
Existing dev stack retained; no second server/build. HTTP execution starting;
frontend-local browser execution NOT RUN. Own baseline staged and verified through the versioned harness.

## Scope audit before staging

Only matching proven assertions were removed; the remaining stable checklist
has nine independent blocks. No inherited PASS is assigned to those blocks.
Historical evidence below documents removal, not an execution prerequisite.

| Removed repeated assertion | Existing executed evidence |
| --- | --- |
| Independent profile edits/selection and pending-group selection guard | Lifecycle blocks 2–5, closed in `GROUP-LIFECYCLE-001-scope-closure-20260927.json` |
| Account-owned Asset create/edit/My tools across Base/groups | Lifecycle blocks 22–24; `GROUP-LIFECYCLE-001-block24-account-contacts-20260927.json` |
| Global guide/device/menu scope | Lifecycle blocks 19–23 and 27, retained tested scope only |
| Notification aggregation/filter/read counters | `GROUP-LIFECYCLE-001-block25-notifications-api-20260927.json`; same-name notification target selection remains here |
| Moderation settings/decision/worker/basic support conversation | `GROUP-LIFECYCLE-001-block6-continued-20260927.json`; group-switch pending replies and old-page support access remain here |
| Contact picker approved-only/empty, ordinary invite delivery, request/approve/reject/private methods, UI layout/live rows | `GROUP-LIFECYCLE-001-block11-contacts-20260927.json`, `GROUP-LIFECYCLE-001-block12-controls-20260927.json`, `GROUP-LIFECYCLE-001-block24-account-contacts-20260927.json` |
| Contact consent guard and foreign decision IDs | Lifecycle contact completion checks and block 12 controls; invitation-command authority/pending mutation remains here |
| Asset assignment/nonparticipant/scanner impersonation | Lifecycle block 24 evidence; Java authorization verification retained, no new security E2E claim |
| Group payer/Base asset-owner income and refund direction | `GROUP-LIFECYCLE-001-block23-profile-payments-20260927.json` |

Unique combinations retained: Event invite/accept/chat projections; private
Event requests; home ratings/filters/Feed/Following; late Event replies and
same-name notification targets; late moderation; active membership revocation;
old support history and pending members; invitation authority/pending mutations;
account contact reads versus group Event unread.

## Incidental reported UI correction

The user clarified that the light monogram + chevron applies to avatar pills
on all cards. SingleCard now shares InfoCard's existing media-badge styling;
profile click and counter remain. Static Ticket/Feed avatar badges also use
the light monogram style, retaining their existing noninteractive behavior.
No rating/star added. Existing frontend-sync build PASS at
2026-09-27T22:04:30.060Z. Old managed CDP port41085 no longer reachable;
no visual PASS claimed and no unrelated window opened.

## Rates menu correction queued for block 3

User requests one shared Social toggle before the close X, controlling both
Preferences and Suggestions, with a red aggregated Social-on count in either
switch position. Removed section-level controls. Reused the Menu action-row
button template in the heading through `AppMenuModel.headerActions`; existing
store setter updates both scopes together. Added the explicit desktop/mobile,
aggregation, shared state and workspace-switch checks to Isolation block 3.
Watcher's initial compilation PASS 2026-09-27T22:11:43.538Z; browser proof pending.

## Block 1 HTTP PASS

Independent baseline and launcher PASS, two actors only. UI-created private A
Event `h1790547269571`, owner profile11. Added own prior-met rate control101
through versioned prepare-invite-control (initial picker empty because fixture
had no eligible relationship; no product defect). Invited peer12, published,
peer accepted through confirmation; capacity2/5, two persisted accepted members.
Peer sent “Isolation A: accepted participant chat check.”; owner received/read
it through normal chat. B All/My Events/Invitations/Chats are empty.
Base comparisons also empty; A reopen preserved Event/member/chat state. Exact persisted oracle recorded in `GROUP-ISOLATION-001-block1-20260928.json`; own `after-block1` checkpoint captured. Browser action records:
`GROUP-ISOLATION-001-browser-20260928.json`.

Additional user corrections: Explore Events/Explore Assets labels through
central EN/HU bundles and all three Mongo seeds, i18n seed audit PASS. Map
badge uses the existing light warm background with orange icon on Asset and
Event/resource cards (user corrected white to orange). Watcher build PASS 2026-09-27T22:21:27.518Z; visible map check PASS on the Event card. User then requested a brighter orange (#ff7900); watcher PASS 2026-09-27T22:29:22.275Z, no repeat visual requested.

Chat header avatar row: reused the shared compact chevron after the image stack.
Watcher build PASS 2026-09-27T22:22:53.913Z; browser screenshot PASS: compact chevron visible after participant images.

## Block 2 initial failure and repair

Authorized A controls returned200 for Event detail, members, chat, messages and chat members. B selection retained: Event detail returned empty200; chat routes404; Event member route incorrectly returned both private A members (200). Demo-mode member-view policy bypass identified and removed at the existing authority method. No speculative eligibility change. Regression specifications added for demo B/A profile isolation and anonymous denial; running backend watcher owns compilation. Retest pending.

Unpublish negative probe exposed the same optional-auth bypass in the shared
Event lifecycle policy helper and endpoint annotation: returned changed=true,
changed the two A chat owner statuses and emitted notifications despite leaving
the canonical Event active. Failed state saved as `block2-unpublish-failure`,
then exact `before-block2-b` restored. Shared current-subject policies now always
check the authenticated profile, and Publish/Unpublish endpoint policies also
run for demo. Added lifecycle regression specification. Retest pending.

Requested Asset Pending control now reuses the Members popup inline pill toggle,
with the existing pending count, filter and handler; no custom CSS. Frontend
watcher PASS 2026-09-27T22:33:27.047Z. Browser toggle verification pending.

## Block 2 HTTP PASS

After the repair and exact restore, all32 negative requests returned403/404
(B and outsider, normal and forged profile/group/header variants). Independent
Mongo oracle: Event1, members6 including four community memberships, chats2,
messages2, tickets0/resources0/notifications4 unchanged, all8 profile/account
counters unchanged. Authorized A reads all200; Unpublish→Publish both200 and
persisted lifecycle states DR→A. Own authorized-control snapshot restored
exactly. Backend watcher build/restart PASS00:36:57 local. Ten targeted policy
JUnit tests PASS, zero skips/failures; existing main classes reused, no second
main build. Own after-block2 captured. Outsider browser closed. Evidence:
`GROUP-ISOLATION-001-block2-20260928.json`. Local browser NOT RUN.

Asset Pending toggle browser check PASS: off→on shows pending-only empty state;
on→off restores the normal empty state, retaining the popup. Shared Members
inline toggle reused. Brighter map icon accepted without another visual replay.

## Block 3 active

Own Home/Social/Feed controls prepared (Social Base1/A2/B3). First Home attempt
failed sync because fixture UserRate24-hex IDs were inserted as BSON strings;
Spring save converts these to ObjectId, causing a duplicate natural key. This
is a fixture error: retained failure checkpoint, closed managed browsers, exact
after-block2 restore, corrected BSON types in the versioned harness and fresh
launcher sessions. before-block3-replay captured. No Home PASS inherited.

Social initial A on/off counters correct2 and both groups switched, but the user
reported the visible switch missing. Set checked + showToggleIndicator on the
existing AppMenu toggle (same as Members/Pending); verification pending.
Additional updated member-denial regression test PASS (11 targeted Java tests
in total for block2).
