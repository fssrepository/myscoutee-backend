# Current QA session handoff

Updated: 2026-08-06
Purpose: this is the first and normally the only file to read after context
compaction. Load a linked detailed document only when its checkpoint becomes
active. Do not reconstruct current state from the full conversation.

## Resume block

```yaml
active_checkpoint: EVENT-NOTIFICATION-001
state: EVENT-TICKET-001, EVENT-TICKET-002, EVENT-TICKET-POLL-001, EVENT-TICKET-003, EVENT-TICKET-004, EVENT-TICKET-010 and EVENT-TICKET-012 are PASS/CLOSED. EVENT-TICKET-004 Republish retained the original used ticket as D and created exactly one new unused A ticket with different ID/code/issuedAt; Nova ticket counters returned to 1/1 and membership stayed 2/8. The missing participant-facing Republish notification is a separate EVENT-NOTIFICATION-001 defect: persisted state showed no event-modified task/row after Publish because recreated actor-chat handling skipped lifecycle scheduling. Backend write-side and frontend independent notification-poll-lane fixes are hot-deployed; manual retest is next. EVENT-TICKET-011 separately records the unimplemented Event Members attendance projection
next_actor: user
next_action: leave Nova's Ticket popup open and capture the event-bound physical chat IDs/history. As Casey, Unpublish the active event once; verify the same main/optional/group/service chat documents remain usable with the inline and popup-title Under review badge, and wait one poll interval for Nova's independent notification count/attention. Then Publish once with Ticketing still On; verify the same chats return to A without the badge and wait for exactly one event-modified/available-again notification without closing or reloading Nova
next_codex_action: verify one indexed eventId-scoped chats batch per lifecycle mutation changes only ownerStatus across all physical owner copies, chat/message identity and history stay unchanged, one new under-review task/row and one new event-modified task/row exist for Nova, users unread count increments exactly once per lifecycle row, Casey receives neither, polling creates no writes, and after Nova closes the Ticket popup the ordinary side-menu snapshot resumes and reconciles deferred event/ticket counters
queued_checkpoint: [EVENT-NOTIFICATION-001, EVENT-CHAT-LIFECYCLE-001, EVENT-TICKET-005, EVENT-TICKET-006, EVENT-TICKET-007, EVENT-TICKET-008, EVENT-TICKET-009, EVENT-TICKET-011, EVENT-VISIBILITY-001, AUTH-SESSION-001, LANDING-ELIGIBILITY-001, OPERATOR-PAYMENT-001, OPERATOR-PAYMENT-IP-001]
```

Active detail: [`EVENT-NOTIFICATION-001`](../manuals/DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md#event-ticketing-checkpoints).

## Hard constraints

- This QA session already has an owning dev hot-deploy pipeline: use it as the
  only compile/build path and inspect its existing logs. Do not duplicate its
  work with separate Gradle/npm/build processes. For a cache lock or stuck
  deploy, identify and restart only the single owning process.
- Use the already-running dev stack and its hot-deploy watchers.
- Do not start, rebuild, stop or duplicate a server, Angular watcher, database
  or Compose stack.
- Do not reset fixtures or Git state unless the active checkpoint explicitly
  requires it and the user asks for that step.
- Parent and frontend are separate Git repositories. Inspect both before any
  edit and preserve unrelated changes.
- One operation owns only one `+1` or `-1` delta. A later poll reconciles the
  absolute state and concurrent work; the operation must not manufacture a
  larger correction.
- Menu bar and dropdown bucket counters consume the same signal. Do not create
  a second signal for the same activity bucket.
- Run the smallest focused test only after code changes. A manual checkpoint
  does not authorize a broad suite.

## Repository state at this handoff

- Parent worktree contains the in-progress Ticket physical-object implementation,
  fixture and QA-documentation changes; preserve them.
- Frontend submodule contains the in-progress local physical Ticket,
  repository/service/mapper and SeedBuilder parity implementation; no component
  file is part of that implementation.
- Existing backend hot-deploy compiled the Ticket changes and remained healthy;
  the two focused Ticket service test classes pass.
- No Codex-started server, watcher, Gradle, Angular-test or Vitest process is
  intentionally left running.

Recheck these facts with `git status --short` and
`git -C frontend status --short`; do not assume they remain true after later
work.

## Proven behavior — do not repeat without a related code change

### `EVENT-TICKET-001` — PASS / CLOSED

- The ticket fixture now projects the same shared event-counter signal consumed
  by the menu and popup: Casey received hosting/event.hosting/all `+1`, Nova
  events/event.active/all `+1`, and reset owns both activity snapshots.
- Casey's My Events badge was `1` and the event survived repeated polls. After
  unpublish-for-edit, Ticketing On persisted across save/reopen; Casey remained
  accepted Admin, Nova accepted Member, and exactly one event recompute followed
  the save.

## Completed checkpoint — `EVENT-TICKET-002`

- The clean reset baseline contains no physical ticket and both Casey and Nova
  have `activities.tickets=0` and `activities.asset.tickets=0`. The next normal
  poll must therefore remove any stale Ticket red badge.
- The fixture baseline is Casey accepted Admin + Nova accepted Member + Riley
  pending join: every event projection must show accepted occupancy `2 / 8`
  with one pending control. Riley's two stored `users` ticket counters remain
  zero before and after publish.
- Casey must perform the real `Unpublish -> Ticketing On -> Publish` UI flow.
  Stop before opening Nova's Ticket list so the write side can be proved first.
- Publish must create exactly one physical `A` ticket for accepted Member Nova,
  none for Admin Casey or pending Riley, and exactly one normal event recompute.
- The first publish attempt after the corrected `2 / 8` fixture failed this
  oracle before any Ticket read: Nova still had no physical ticket and both
  stored counters were zero. The missing lifecycle-publish ticket sync was
  added before counter refresh and hot-deploy compilation passed. The active
  baseline is the clean restage from `2026-08-06T05:01:50.062Z`.
- Opening Nova's Ticket list twice must preserve the same ticket id, QR code and
  `issuedAt`; reads must create no ticket or side effect.
- The canonical Event image is the retained MinIO `large.webp`; the Ticket card
  must request its derived `medium.webp`, not the external fallback URL.
- Local/SeedBuilder behavior is a parity subcase: compare lifecycle,
  eligibility, counters and QR scan outcome with the HTTP-backed flow before
  changing it.
- Local parity implementation now persists physical A/D ticket records and
  keeps both `users.activities.tickets` and
  `users.activities.asset.tickets` synchronized from those records. Publish
  performs the full accepted-participant sync; a membership write evaluates
  only its target user. Ticket list/open and QR reads never issue a ticket.
  The targeted seed checkpoint passes, and the ticket repository plus event
  service suites pass 17/17. No component file contains ticket lifecycle logic.
- Keep the two later acceptance producers separate: `EVENT-TICKET-005` starts
  with Casey alone on a Public, approval-required event; Nova discovers it in
  Explore, Join creates only a pending membership, and Casey approval directly
  makes Nova accepted and creates Nova's ticket. `EVENT-TICKET-007` starts with
  Casey and ticketed Nova accepted; Nova invites Riley, Casey preapproval
  leaves Riley pending and ticketless, and only Riley's later acceptance
  creates Riley's physical ticket and updates both Riley `users` table
  counters. After 007 is complete, `EVENT-VISIBILITY-001` retains the same
  event, memberships and pre-transition ticket identities while Casey performs
  Unpublish -> Friends Only -> Publish. Unpublish retains the old tickets as
  `D`; republish creates new `A` ticket IDs/codes. External non-member Lina Park is the friend Explore control
  and external non-member Liam Parker the non-friend control. Nova and Riley
  are not visibility controls because their tracked participation excludes
  them from Explore. Slot/tournament evolution is only a later planned branch
  and is not part of the current run.

## Closed checkpoint — `EVENT-TICKET-POLL-001`

- The existing Ticket SmartList 30-second poll is now wired to the same shared
  `ActivityStore` counter signal pattern as Activity/Event; `tickets` and
  `asset.tickets` change together and the dropdown no longer reads a separate
  popup-only red counter. Existing `frontend-sync` hot-deploy compilation is
  green.
- Baseline restaged at `2026-08-06T05:42:44.447Z`: published + Ticketing Off,
  Casey Admin and Nova accepted at
  `2 / 8`, Riley pending as the ticketless control, no physical tickets, and
  all three users' stored ticket counters at `0 / 0`.
- Nova opens Ticket in Upcoming mode and leaves the empty popup open. Casey then
  performs real Unpublish -> Ticketing On -> Publish in an isolated session.
- Without closing or reloading Nova, one 30-second SmartList poll must make the
  list and shared Ticket dropdown/menu counter converge together from `0` to
  `1`. This phase is PASS.
- Shared `UiPollCoordinator` owns scheduling: the popup SmartList has
  foreground priority, the side-menu realtime poll is background, and only one
  poll may execute at once. Popup presence suppresses or aborts background
  ownership; an aborted background response must not touch `ActivityStore`.
  Closing the popup returns ownership to the normal side-menu poll. The same
  rule covers Activity/Event SmartLists.
- Casey's publish must create exactly one Nova status `A` physical ticket and
  one normal recompute. Riley must remain pending and ticketless at `0 / 0`.
  The poll itself is read-only: no ticket replacement, recompute, notification
  or outbox write.
- Phase 2 closed Nova's Ticket popup, left the side menu open, and performed
  Casey **Unpublish** once. Without reopening or reloading Nova, the resumed
  background side-menu poll changed Events and Ticket from `1 -> 0` within one
  30-second interval.
- Unpublish preserves Ticketing On in the draft but owns the write-side ticket
  revocation: Nova's physical ticket changes `A -> D`; her stored event/ticket
  counters become zero; Casey and pending Riley remain ticketless.
- Persisted oracle proved the same ticket became `D`, all controlled ticket
  counters became zero, and membership remained exact. PASS/CLOSED; reset
  completed at `2026-08-06T06:09:19.840Z`.

## Completed checkpoint — `EVENT-TICKET-003` + `EVENT-TICKET-010`

- Current clean retest baseline staged at `2026-08-06T10:12:01.825Z` after the
  aggregate-upsert fix: fresh code
  `TKT-1a7df4b6-c8a6-44bd-b859-dac4cd412d15`, `status=A`, unused, Casey Admin
  plus Nova Member accepted at `2 / 8`, and zero replay audits/outbox/warning
  rows. The retained canonical MinIO `large.webp` image is present. The old QR
  screenshot is invalid; Nova must retain this newly issued complete QR.
- Current post-fix evidence: Casey's first scan set
  `usedAtIso=2026-08-06T10:16:50.744525385Z`. The first saved-QR replay at
  `2026-08-06T10:18:11.470491618Z` preserved it and produced one immutable
  Casey audit, one sanitized pending outbox row, and one unread Nova warning
  with `occurrenceCount=1`. Nova visibly received the row and red badge;
  persisted `users.activities.notifications=2` is the unread check-in row plus
  this warning. The fixed aggregate write therefore materializes the inbox row
  and increments the users-table counter together.
- Final manual closure: Nova marked the first warning occurrence read and Casey
  replayed the same retained QR. The exact ticket use remained unchanged; two
  immutable replay audits now exist, while one and only one Nova warning row
  advanced to `occurrenceCount=2`, `revision=3` and unread. Persisted
  `users.activities.notifications=2` is again the unread check-in plus warning.
  The user accepted this physical check-in/replay checkpoint as PASS/CLOSED.
- Clean baseline restaged at `2026-08-06T09:29:57.060Z`: active Ticketing On,
  Casey accepted Admin, Nova accepted Member, one Nova `A` physical ticket and
  users counters `1 / 1`; the ticket is unused and Nova's participant-owned
  event overlay is present.
- Ticket code is the newly generated UUID-v4 value
  `TKT-fbfd8c02-af26-4812-b314-ef754ee6b82c`; the canonical event image is the
  retained managed MinIO `large.webp` URL. A later reset/stage or republish must
  produce a different code/QR.
- The retained QR was captured before use. Casey's first scan persisted the
  canonical use at `2026-08-06T09:54:28.300791752Z`; ticket status remains `A`.
  Replay audits/outbox/warnings were still empty immediately after first use.
- The first saved-QR replay at `2026-08-06T10:01:10.053713457Z` correctly
  returned **already used**, preserved the canonical use and wrote one Casey
  replay audit plus one sanitized pending outbox row. It exposed a backend
  aggregate-upsert defect: no Nova warning row was materialized and the
  users-table unread/red counter did not increment. Reload therefore could not
  repair the UI. `UserNotificationPageRepository.upsertAggregated` incorrectly
  targeted `revision` in both `$setOnInsert` and `$inc`; the fix retains only
  `$inc`, which initializes an absent revision and increments existing rows.
  This partially executed baseline must be reset/restaged before retest.
- Physical Android `aer8vgcmyd9lzxv8` is authorized. The existing reverse is
  `tcp:8080 tcp:80`; do not restart the dev stack.
- Before scanning, Nova displays the QR on desktop and saves a screenshot with
  the complete QR; retain it because the consumed credential has no UI surface
  from which to display the QR again. Casey then opens `http://localhost:8080`
  on the phone, enters Ticket -> Scan Ticket, grants camera permission and
  scans once. Capture the first success, then reuse the saved screenshot for
  the repeat scan before invalid and unauthorized no-op scans.
- The first physical scan persisted one use at
  `2026-08-06T06:18:07.529719781Z` by Casey, but the checkpoint is restarting
  because the required pre-scan QR screenshot was not retained.
- The preceding used baseline's first scan is retained PASS evidence: the
  revised scanner UI worked on the
  physical phone and the persisted ticket has
  `usedAtIso=2026-08-06T06:59:21.130578868Z` and `usedByUserId=Casey`. Reuse the
  saved QR next and prove those values do not change before running invalid and
  unauthorized branches.
- On that preceding baseline the user also completed the saved-QR repeat and
  saw **already used**. The
  persisted oracle still reports the exact same `status=A`, `usedAtIso` and
  Casey `usedByUserId`, so the original repeat no-op is PASS.
- The scanner UI now uses one contextual `app-menu` Kamera be/ki toggle. Off
  stops detection and MediaStream tracks and shows the white/red-X state;
  successful validation stops the stream and retains the recognized frame;
  Kamera be owns restart, with no separate retry button. Frontend hot-deploy
  compilation completed successfully after the source sync.
- Scanner reading/validating text now occupies a centered top badge overlay in
  the camera target. The toggle remains in one stable layout position and is
  merely disabled during validation, so state changes cannot move it vertically.
- Canonical roles `Manager`, `Admin` and `Member` render verbatim on Casey's
  scanner as contextual badges beneath the avatar; the scanner must not
  localize `Member` to `Tag`. Nova's own QR surface may retain its localized
  contextual badge. The event title is always a separate unprefixed line.
- The four camera labels are present in both frontend local bundles and the
  generated `demo_db`/`e2e_db`/`myscoutee_db` Mongo JSON seeds. Bundle versions
  are `2026.08.06.en.51` and `2026.08.06.hu.51`; the i18n seed audit passed
  `6126` messages, the existing Mongo watcher imported the active demo seed,
  and the live API returned all four English and Hungarian values.
- `EVENT-TICKET-009` is a later separate asymmetric-connectivity checkpoint:
  warm Nova's Ticket/QR surface, put only Nova's desktop browser target offline
  and reload it from cache while the backend and Casey's physical-phone scanner
  remain online. Casey scans Nova's cached QR and the server must apply the use
  exact-once. Prefer Codex target-scoped CDP control and record target metadata;
  otherwise use the documented Nova-tab DevTools Network Offline procedure.
  Always restore Nova online afterward. Never stop the shared server for this
  case.
- The first offline reload exposed a real session-route defect: the cached
  anonymous landing loaded, but an already-open member session was not routed
  back into the app. Session restore, root routing and warmed HTTP-demo cache
  fallback are hot-deployed; the dedicated 009 retest must start with one
  online reload so the new bundle and member cache are warm. This result is
  not part of the online notification checkpoint.
- `EVENT-TICKET-010` is hot-deployed on the same used fixture. Every
  server-confirmed replay writes an immutable actor audit, while Nova gets one
  aggregated warning row whose occurrence badge increments. The required
  sequence is replay -> mark read -> replay -> replay, proving read-to-unread
  reactivation and no unread-counter inflation while already unread. The
  baseline is zero audits/outbox/warning rows.
  Nova remains online for the complete replay/read/replay sequence.
  Neither audit nor notification may expose the raw QR or alter the canonical
  ticket use.
- `EVENT-TICKET-011` is a newly captured GAP: successful ticket use currently
  leaves Nova's membership merely `accepted`, with no separate attendance
  projection. The intended contract keeps membership acceptance unchanged but
  adds event-scoped checked-in time/actor/ticket identity and a localized
  Beléptetve/Checked in badge to the Event Members row. Replay and negative
  scans are exact no-ops for attendance.

## Completed checkpoint — `EVENT-TICKET-004`

- Reuse the just-closed active event and its used physical Nova ticket; do not
  reset or manufacture another credential before the lifecycle mutation.
- Casey Unpublishes once while Ticketing remains configured On in the draft.
  Stop before republish. The oracle must retain the existing ticket object with
  `status=D`, remove only its active Nova Ticket projection/counter, and keep
  Casey Admin plus Nova Member accepted at `2 / 8`.
- Unpublish midpoint PASS: persisted canonical event is `DR` with Ticketing On;
  the retained used Nova ticket is `status=D`, Nova active Ticket counters are
  `0 / 0`, and membership remains `2 / 8`. Do not republish until the saved-QR
  revocation checkpoint below completes.
- After that persisted midpoint passes, Casey publishes again. Republish must
  create a different physical object/code/issued time rather than reactivate
  the old D ticket.
- PASS/CLOSED: Republish kept the old used object D and created one new unused
  A ticket `6a74645b7c85995dcf3955eb`, code
  `TKT-942126c0-4c90-44b0-8017-baf5c0810a82`, issued at
  `2026-08-06T10:39:23.880809028Z`. Nova counters returned to `1 / 1` and
  membership stayed `2 / 8`. The missing available-again notification is the
  separate active checkpoint below.

## Completed inserted checkpoint — `EVENT-TICKET-012`

- Casey scans the saved QR of the now-D Nova ticket before Republish. Expected
  visible result is revoked/inactive, not already-used.
- Unpublish itself created one ordinary unread `event-under-review` notification
  for Nova at `2026-08-06T10:30:47.791763232Z`; this correctly changed the
  users-table notification counter `2 -> 3` before the QR rejection oracle.
- The later saved-QR scan returned revoked/inactive. No notification was created
  by the scan: the only post-Unpublish row is the lifecycle notification above.
  Two replay audits, two sanitized replay outbox rows, the single aggregated
  warning at `occurrenceCount=2`, users notification counter `3`, and the D
  ticket's identity/original use all remained unchanged. PASS/CLOSED.

## Active checkpoint — `EVENT-NOTIFICATION-001`

- The failed observation is exact: the first Republish created the replacement
  ticket but no `event-modified` task or Nova inbox row. The only lifecycle row
  in the screenshot/database was the earlier Unpublish `event-under-review`.
- Backend root cause: Publish skipped lifecycle notification scheduling whenever
  main-chat materialization reported that Casey's owner copy was created. The
  write now additionally schedules accepted non-actor participants in that
  branch; Nova receives available-again, Casey does not.
- Frontend root cause: the closed notification center relied on the background
  side-menu long poll, which popup presence suppresses. Notification realtime
  now owns a separate shared-coordinator lane that runs during popup ownership
  and concurrently with foreground SmartList polling. While a popup is open it
  applies only the notification count; ordinary side-menu reconciliation waits
  until close and then reuses the unadvanced cursor.
- Existing backend hot-deploy reports `BUILD SUCCESSFUL` and restarted healthy;
  existing frontend-sync reports successful bundle generation/sync.
- Manual retest: keep Nova Ticket open, Casey Unpublish, observe the independent
  under-review count/attention without reload, then Casey Publish and observe
  exactly one `event-modified` available-again contribution the same way. Close
  Ticket only afterward and prove ordinary event/ticket counters resume.
- The same lifecycle mutations also own `EVENT-CHAT-LIFECYCLE-001`: before the
  Unpublish capture physical main/optional/group/service chat owner-copy and
  message identities. Unpublish must batch only `ownerStatus=DR` by indexed
  `eventId`, keep every accepted chat usable and show a compact **Under review**
  badge; Publish batches `ownerStatus=A`, removes the badge and preserves all
  captured identities/history. Chat reads do not query-project Event status.

### `CHAT-AUTH-001` — PASS / CLOSED

- Casey Admin and accepted Riley share one `mainEvent` chat; pending Nova has no
  chat owner copy, no chat-message notification and direct history access
  returns `404 Chat not found`.
- A WebSocket query-param defect encoded `:` as `%3A` and caused the first send
  to fail without persistence. The handshake now decodes query parameters; its
  focused regression passed and hot deploy was verified.
- Two deliberate Riley messages each persisted once and produced one Casey-only
  notification/outbox row. The second message separately proved the Event
  bucket after the first was read.
- Casey UI proved Chats, All and Event unread cycles `0 -> 1 -> 0`, shared
  two-message history, and Notification Center `5 -> 6`; both chat owner copies
  finished at unread `0`.

### `EVENT-FEEDBACK-001` — PASS / CLOSED

- The popup exposed exactly one accepted, non-admin, non-trashed event only
  after `start + 2h`; locked, trashed, admin and pending-member controls stayed
  absent.
- Eligibility is materialized once by the bounded scheduled write path. Menu
  and popup reads do not recalculate or send deltas.
- A fresh reload showed the profile-menu Feedback badge `1`. The persisted
  exact main counter was `feedback=1`, with four buckets
  `ownEvents/pending/feedbacked/removed = 0/1/0/0` and one
  `eligible/counterTracked` state.

### `EVENT-FEEDBACK-002` — PASS / CLOSED

- Casey, Nova and Riley remained exact accepted membership `3/8` on one staged
  event with the retained canonical image.
- Nova and Riley submitted separately. Casey ended with stored main
  `feedback=2` and `eventFeedback.ownEvents=2`; the Own Events list still had
  one event card and its response badge was `2`.
- Casey's visible counters changed through the existing realtime auto-poll
  without reload or a second popup-specific polling loop.
- The final oracle matched two submitted viewer states and three card answers
  from the two viewers; the previously proven event opinion, target recompute
  and first-submit notification paths remained intact.

### `EVENT-FEEDBACK-005` — PASS / CLOSED

- Add note and Edit note worked on Nova's already-submitted feedback.
- Nova's own-feedback view and Casey's received-feedback view displayed the
  saved organizer note separately from the structured event answer.
- The oracle proved the answer and counters unchanged and found no recompute,
  notification or outbox effect from the note mutation.

### `EVENT-IMPRESSION-002` — PASS / CLOSED

- This remains a separate QA checkpoint for the Impressions-section Feedback
  tile; it is not folded into the trait-propagation checkpoint.
- Nova's stored badge was `1`, the UI acknowledged the tile open by hiding the
  badge immediately, and the next authoritative realtime poll restored `1`.
- This `1 -> hidden -> 1` presentation cycle is accepted UI behavior. Opening
  the tile did not submit, remove or otherwise mutate event feedback.

### `EVENT-INV-003` — PASS / CLOSED

- Riley accepted exactly once; Casey and Riley share the main-event chat.
- Nova remains pending and has no chat access.
- The chat avatar stack contains accepted users only; it has no pending `+1`.
- Sub-events > Members carries the single pending badge.
- There is exactly one `member-joined` chat row and it creates no Notification
  Center chat-message item.
- For the Open event, Casey and visible pending Nova received one acceptance
  event notification; actor Riley received none.
- Riley's invite was resolved/read. Do not rerun acceptance before
  `CHAT-AUTH-001` merely to prove these facts again.

### `MEDIA-IMG-001` — PASS / CLOSED Event Editor subcase

- Managed images keep one canonical domain URL.
- The tested 1853 x 919 PNG produced distinct original, 128 x 63 small,
  640 x 317 medium and 1280 x 635 large objects; all returned HTTP 200.
- The saved Event retained one canonical `large.webp` URL after reopen and no
  second upload; the ordinary card requested `medium.webp`.
- A fresh editor proved that stretching `small.webp` across its large image slot
  was visibly blurred. The owning frontend fix lets the Event Editor request
  `medium.webp`; its focused regression passed 3/3 and hot deploy was verified.
- The Event Activities card exposes no fullscreen presentation, so no Event
  fullscreen claim is recorded.
- This remains a separate Event Editor media subcase and does not merge into or
  reopen the already closed Event Editor create/save/reopen checkpoint.

### Media implementation — prior focused automated PASS

- Default compact carousel slots derive `small.webp`; configured large editor
  slots and selected previews derive `medium.webp`.
- Ordinary cards derive `medium.webp`; fullscreen-capable cards and Article
  body/viewers derive `large.webp`.
- Article HTML is rewritten only while rendering; three URLs are not persisted
  in the Article.
- External, data, blob and local-mode URLs remain unchanged.
- A partial backend rendition set is deleted and the upload fails; it is not
  reported as three copies of the original.
- Focused frontend result: 3 files, 11/11 tests passed.

Detailed contract and split cases:
[`MEDIA_IMAGE_VARIANTS_MANUAL_QA.md`](../manuals/MEDIA_IMAGE_VARIANTS_MANUAL_QA.md).

## Update rule

After every checkpoint, change this file before starting another one:

1. replace the five values in the resume block;
2. move newly proven facts into `Proven behavior`;
3. record only the next unproven observable;
4. link detailed evidence instead of copying screenshots or long histories;
5. keep this handoff short enough to read without loading the full QA pack.
