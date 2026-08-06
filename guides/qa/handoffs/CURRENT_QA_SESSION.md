# Current QA session handoff

Updated: 2026-08-06
Purpose: this is the first and normally the only file to read after context
compaction. Load a linked detailed document only when its checkpoint becomes
active. Do not reconstruct current state from the full conversation.

## Resume block

```yaml
active_checkpoint: EVENT-TICKET-001
state: The valid Event Feedback and Impressions checkpoints are closed. EVENT-TICKET-001 was freshly staged at 2026-08-06T02:49:47.425Z. The active event is Manual QA EVENT-TICKET-001 with ticketing=false, Casey as Admin and Nova as the single accepted Member; there are no pending/invited members, tickets or checkpoint side effects. EVENT-TICKET-003 is documented as a required physical Android phone test: Casey Admin scans Nova's QR through adb reverse tcp:8080 tcp:80 at http://localhost:8080 with the real phone camera
next_actor: user
next_action: as Casey, open Manual QA EVENT-TICKET-001 in Event Editor, enable Ticketing, Save exactly once, close, then reopen the same event
next_codex_action: inspect the canonical event, exact member roles and normal event recompute after Save; then compare the reopened editor and Nova participant surface without invoking a ticket scheduler
queued_checkpoint: [EVENT-TICKET-002, EVENT-TICKET-003]
```

Active detail: [`EVENT-TICKET-001`](../manuals/DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md#event-ticketing-checkpoints).

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

## Repository baseline at this handoff

- Parent: `132dbc40`, clean before this QA documentation update.
- Frontend submodule: `93f13be5` (`img size fix`), clean.
- Existing backend hot-deploy accepted the media change and remained healthy.
- No Codex-started server, watcher, Gradle, Angular-test or Vitest process is
  intentionally left running.

Recheck these facts with `git status --short` and
`git -C frontend status --short`; do not assume they remain true after later
work.

## Proven behavior — do not repeat without a related code change

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

## Active checkpoint — `ARTICLE-EDITOR-001`

The Article Editor owns one create/save/reopen operation. Its managed image is a
subcase of that Save, not a standalone upload checkpoint:

1. Complete the open English draft with an identifiable title, excerpt and HTML
   body.
2. Upload the retained PNG once into the Article as part of that draft.
3. Save once, reopen and prove all fields plus one canonical managed URL persist
   without another upload.
4. Verify the admin Article list requests `medium.webp` and the admin viewer
   body requests `large.webp`.
5. Keep publication and landing propagation out of this checkpoint.

Do not run a backend E2E for this manual pass. Use the existing stack and the
smallest focused test only if another code change is required.

On PASS, update only the `ARTICLE-EDITOR-001` ledger row and regenerate the XLSX:

```bash
python3 guides/qa/tools/sync-qa-matrix-xlsx.py
```

Then change the resume block to `LANDING-ARTICLE-001`.

## Queued checkpoint — `LANDING-ARTICLE-001`

Publish the retained Article once and compare the public landing behavior as a
separate test case. Existing automated coverage proves fresh endpoint inclusion
and frontend list/body mapping, but there is no browser test for the complete
Admin publish-to-rendered-landing transition or live refresh of an already-open
landing surface.

## Later queued checkpoint — `CHAT-AUTH-001`

The old positive failure was missing accepted-user chat materialization. The
closed acceptance run now proves that Casey Admin and Riley accepted both have
the channel while Nova pending does not. Do not redo `EVENT-INV-003`.

The remaining auth proof is one participant-authored message:

- keep Casey Admin, Riley accepted and Nova pending isolated;
- Riley sends one uniquely identifiable ordinary message;
- Casey and Riley see the same single persisted message/history;
- Nova still has no channel and remains server-denied;
- only a real unread message may change chat attention; join/system rows do
  not.

Use the detailed event handoff only for fixture IDs or its read-only oracle:
[`EVENT_PUBLISH_CHAT_HANDOFF.md`](EVENT_PUBLISH_CHAT_HANDOFF.md).

## Known documentation conflict — do not turn it into an automatic retest

`EVENT-PUBLISH-CHAT-001` is still labelled `CLEAN RETEST REQUIRED` in the
ledger and at the top of the older handoff, while that handoff later records a
successful retained acceptance run. The subsequent run proves the chain could
continue, but it does not by itself reconstruct every publish-only counter
oracle. This is an evidence-reconciliation item, not part of `MEDIA-IMG-001` or
`CHAT-AUTH-001`. Revisit it only when the user explicitly returns to the
Publish checkpoint.

## Update rule

After every checkpoint, change this file before starting another one:

1. replace the five values in the resume block;
2. move newly proven facts into `Proven behavior`;
3. record only the next unproven observable;
4. link detailed evidence instead of copying screenshots or long histories;
5. keep this handoff short enough to read without loading the full QA pack.
