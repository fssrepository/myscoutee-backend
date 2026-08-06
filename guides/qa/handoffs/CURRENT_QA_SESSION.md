# Current QA session handoff

Updated: 2026-08-06
Purpose: this is the first and normally the only file to read after context
compaction. Load a linked detailed document only when its checkpoint becomes
active. Do not reconstruct current state from the full conversation.

## Resume block

```yaml
active_checkpoint: EVENT-TICKET-002
state: EVENT-TICKET-001 is PASS/CLOSED. The first real EVENT-TICKET-002 publish exposed that opening Ticket could manufacture a Casey Admin credential. Ticket is now a physical EventTicket with A/D lifecycle, created only by publish or a terminal participant-acceptance write; Ticket list/open is read-only and the admin is ineligible. The red Ticket badge is sourced from the users table, specifically activities.tickets and activities.asset.tickets, rather than counted from ticket reads. Focused backend tests pass. EVENT-TICKET-002 was reset and freshly staged at 2026-08-06T04:47:51.294Z with the retained managed large image URL, active/published Ticketing Off, Casey accepted Admin, Nova accepted Member, Riley pending join, accepted occupancy 2 / 8 and no physical ticket. All three users have both stored ticket counters at zero; Riley's nested event counters correctly show all=1 and pending=1. Stage created no recompute or outbox side effect. EVENT-TICKET-003 remains the physical Android scan through adb reverse tcp:8080 tcp:80 at http://localhost:8080. Local/SeedBuilder Ticket and QR behavior is aligned to this HTTP contract in repository/service/mapper/seed layers only, never a component
next_actor: user
next_action: as Casey, open Manual QA EVENT-TICKET-002 and perform Unpublish -> Ticketing On -> Publish through the UI; stop before Nova opens Ticket and report that publish completed
next_codex_action: immediately prove the event remains 2 / 8 with Riley pending, one Nova A physical ticket, zero Casey and Riley tickets/users-table counters, and one normal publish recompute; then ask Nova to open Ticket twice and prove stable id/code, no read write, and a medium.webp card request
queued_checkpoint: [EVENT-TICKET-003, EVENT-TICKET-004, EVENT-TICKET-005, EVENT-TICKET-006, EVENT-TICKET-007, EVENT-VISIBILITY-001]
```

Active detail: [`EVENT-TICKET-002`](../manuals/DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md#event-ticketing-checkpoints).

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

## Active checkpoint — `EVENT-TICKET-002`

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
  event and both physical tickets while Casey performs Unpublish -> Friends
  Only -> Publish. External non-member Lina Park is the friend Explore control
  and external non-member Liam Parker the non-friend control. Nova and Riley
  are not visibility controls because their tracked participation excludes
  them from Explore. Slot/tournament evolution is only a later planned branch
  and is not part of the current run.

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
