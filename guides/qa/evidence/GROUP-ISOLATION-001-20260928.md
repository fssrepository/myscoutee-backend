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
