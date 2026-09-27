# GROUP-ISOLATION-001 — 2026-09-28 execution

## Authorization and start

User explicitly requested automated full-flow Isolation QA like Lifecycle.
Existing dev stack retained; no second server/build. HTTP execution starting;
frontend-local browser execution NOT RUN. Fixture not yet staged.

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

## Block 1 in progress

Independent baseline and launcher PASS, two actors only. UI-created private A
Event `h1790547269571`, owner profile11. Added own prior-met rate control101
through versioned prepare-invite-control (initial picker empty because fixture
had no eligible relationship; no product defect). Invited peer12, published,
peer accepted through confirmation; capacity2/5, two persisted accepted members.
Peer sent “Isolation A: accepted participant chat check.”; owner received/read
it through normal chat. B All/My Events/Invitations/Chats are empty.
Base comparisons and A reopen still pending. Browser action records:
`GROUP-ISOLATION-001-browser-20260928.json`.

Additional user corrections: Explore Events/Explore Assets labels through
central EN/HU bundles and all three Mongo seeds, i18n seed audit PASS. Map
badge uses the existing light warm background with orange icon on Asset and
Event/resource cards (user corrected white to orange). Watcher verification
and visible checks pending for that final palette change.
