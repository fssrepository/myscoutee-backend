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

### Block 3 corrections and partial evidence, 00:44–01:02

Social switch browser PASS: one header control before X, visible switch on desktop
and 360px, both sections synchronized, Social-on aggregate constant off/on.
Initial distinct totals Base1/A2/B3; no semantic change to friends-in-common or
separated-friends. Frontend watcher PASS22:44:54Z.

Home/filters provisional checks: A rated Nia/Lea through Go; real sync200.
Base/B rate documents unchanged. Filters saved Base woman, A empty, B man; A
empty survived profile Profession edit (profile save200), switch and reload.
The first clear attempt clicked the menu trigger rather than the Woman option;
this was harness selection error, not a product defect.

Further fixture repairs: Users 24-hex IDs must also be BSON ObjectIds; profile
save failed with duplicate users_sync_key until corrected. Photo Feed requires
UUID post IDs; the first controls incorrectly used 24-hex IDs, causing seen400.
Failure snapshots retained; restored exact after-block2, corrected versioned
fixture IDs, added a distinct peer-organized A Event for the Following control,
and relaunched clean managed sessions. Current baseline before-block3-valid-feed.
These fixture repairs are not application behavior changes. Block3 remains open.

Reported header ring defect repaired: circular indicator stroke no longer scales
with avatar size; ring remains square and excludes badge overhang. Edit/badge
render above the indicator, edit sits at avatar top-right. Browser measured
96×96 avatar,108×108 ring,3px non-scaling stroke;16px icon centered in30px button.
Watcher PASS22:54:51Z. Feed uses existing mediaFit contain and ProfileStore avatar
action, giving shared monogram chevron without custom styles; watcher PASS22:58:51Z,
browser verification pending after fixture replay.

## Block 3 HTTP PASS

Corrected fixture replay: A Home rated Nia13 and Lea14, real sync200; Base/B
rate documents, exclusions, impressions and nonzero counters unchanged.
Filters Base woman/A empty/B man persisted; A clear remains after workspace
switch, reload and ordinary Profession edit/save200. Feed showed only the own
control in each workspace; persisted view receipts exactly A301/B302/Base303.
A followed Eszter via Feed card action/confirmation; persisted organizer12 and
eventCount1, immediate and reopened Unfollow. Base/B Following unchanged.
Social desktop/mobile and Base1/A2/B3 evidence retained from this block's
identical Social controls; both sections retain their established meaning.

Feed UI corrections browser PASS: shared monogram chevron opens the creator
profile, contain image leaves the face visible,3.2km belongs to0km using shared
AppUtils label. Watcher PASS23:06:09Z. Profile unavailable was a real routing
defect: shared profile-view route wrongly bypassed workspace resolution along
with account contacts. Corrected only profile GET routing;10 focused filter
JUnit tests PASS including unchanged account contacts and forged-group denial.
Backend watcher restarted01:04:20; actual Base/A creator profiles now render.
No unauthorized-profile UI scenario added. Own after-block3 captured.
Evidence: GROUP-ISOLATION-001-block3-20260928.json. Full Local browser NOT RUN.

## Block 4 HTTP PASS

Held real A POST events/filter poll at CDP Response stage. Closed Activities and
selected B through ordinary UI; client cancellation invalidated the intercepted
request before release (Invalid InterceptionId). B stayed selected, A card did
not appear, B Event list remained empty; A reopen retained its Event. This proves
the cancellation branch, not delivery of a fabricated late response.

Versioned same-name B target prepared alongside A, own checkpoint captured.
While B selected, opened A Eszter notification through Open Event. Workspace
selected A, exact A Event capacity2 and Alex/Eszter Members opened. Actual
GET members ownerId=h1790547269571 returned200; same-name B target was not used.
Independent before/after oracle: events3/members11/chats2/messages2 unchanged.
Own after-block4 captured. Evidence GROUP-ISOLATION-001-block4-20260928.json.

## Block 5 HTTP PASS

Own A moderation queue1/Feed-only/delay0 and B queue2/Event+Feed/delay30 prepared
with auto-approve off; existing accepted Event item/count preserved. Snapshot
selectors now include group:<id> moderation-state keys as well as scoped items.
Held actual A Feed preview HTTP response, closed A popup, selected B, opened B
queue and settings through UI, then released the original response unchanged.
B retained two rows, delay30 and own categories; no A gallery appeared. A
reopen retained one row/delay0. Mongo state2/items4/groups2/posts6 unchanged.
Own after-block5 captured. Evidence GROUP-ISOLATION-001-block5-20260928.json.

## Block 6 HTTP PASS

Versioned prerequisite temporarily made Eszter A owner/admin and Alex Member;
original roles were captured. Eszter removed Alex through Members confirmation.
Ordinary refresh selected Base without reload and removed A from the picker.
Old A Event detail404, members403, chat/detail/messages/members404; B Events
remained usable. Base/B relationships, impressions and exclusions unchanged;
B domain counters unchanged. Base notification2→3 is the canonical
community-member-removed notification for A, independently verified in snapshot.
Captured after-block6-revoked, restored exact before-block6 and verified; own
managed sessions relaunched. Evidence GROUP-ISOLATION-001-block6-20260928.json.

Queue confirmed by user: after Isolation, INTEGRATION-API-GROUP-001 starts with
its required development before tests. User prepares VMware for Firebase checks.

## Block 7 HTTP PASS

Prepared eventless App support (Base01/02) and A Group support (11/12), with45
A history messages. Normal chat/header entry showed the correct conversation
and two A members; pending filter empty. App support opened normally; its
participant read200 returned the two account identities. Old A message1 was
outside first15; authorized target read200 returned old page1–15 of45.
B/Base/outsider each made8 private A requests (detail, messages, old target,
members/pending, send, old edit/reaction): all403/404. No owner copy/unread or
message mutation. Held actual A conversation load, switched through UI to B,
released unchanged; B empty chat list and workspace remained intact. A reopened
with retained history. All6 chat copies and48 messages unchanged.
Initial member interception found no HTTP request because DTO members were
already loaded; real messages-load replay supplied the delayed-response proof.
Own after-block7 captured. Evidence GROUP-ISOLATION-001-block7-20260928.json.

## Block 8 in progress — eligibility and consent

User clarified: unavailable people must be absent from invitation picker;
unapproved saved contacts request access on the contact card first. Existing
code already implements this; no production edit required. Versioned consent
control Maya added, own baseline before-block8-consent captured. UI Request
created pending01→03, no new pair chat, existing conversation members01/02
unchanged. Picker contains only approved Nia05/Lea06, not Maya03 or non-contact
Milo04. Six focused existing ChatService Java authority tests PASS; compiled
only the test class against watcher main output after capacity check.
Five earlier raw HTTP denials retained as API evidence, not UI scenarios.
Normal Lea invitation measured35.8ms/200, picker closed and header4 immediately.

Late mutation replay attempts did not prove a cross-scope result: existing
isConfirmPending guard prevents closing the picker while the request is held.
The harness initially mistook hidden/offscreen menu nodes for available UI;
corrected visibility inspection and exact own snapshot replays. Do not count
these attempts as successful workspace/account-change tests. Interception was
removed after each attempt. The intentional QA hold prolonged those intercepted calls. The user clarified
that the slow call they meant was earlier; its cause is unproven. The ordinary
35.8ms sample above does not establish that earlier call's duration or cause.
Evidence GROUP-ISOLATION-001-block8-progress-20260928.json; remaining late
picker/account and mutation boundary checks plus block9 still open.

Late invite-picker response across actual UI logout/login Alex→Maya PASS: real
contact-access response released unchanged, Maya account retained with no old
picker or participants. Supplementary Java tests PASS: both support channel
types and foreign conversation, no writes/unread change (7 unique authority
tests overall). Mutation cross-scope replay remains unproven because the
existing pending guard prevents the normal close/switch sequence.

Demo selector correction: same header row before role selector, standard compact
mobile action and labelled red desktop action; original person_add preserved.
Removed automatic parent-selector close when opening new-profile setup. At
360/1280px no header overflow; child permission popup retained the list and
cancelling restored enabled rows. Actual profile form/registration not run:
location permission prerequisite not completed. Evidence demo-selector JSON.
