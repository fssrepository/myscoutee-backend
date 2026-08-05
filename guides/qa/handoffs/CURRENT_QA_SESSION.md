# Current QA session handoff

Updated: 2026-08-05  
Purpose: this is the first and normally the only file to read after context
compaction. Load a linked detailed document only when its checkpoint becomes
active. Do not reconstruct current state from the full conversation.

## Resume block

```yaml
active_checkpoint: MEDIA-IMG-001
state: implementation-ready; manual cross-screen proof not run
next_actor: user
next_action: upload one identifiable image larger than 1600x1200 in Event Editor
next_codex_action: inspect the upload response and Network variant URLs; do not start a server
queued_checkpoint: CHAT-AUTH-001
```

## Hard constraints

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

- Parent: `6f533120` (`img fix`), clean.
- Frontend submodule: `abe19606` (`img fix`), clean.
- Existing backend hot-deploy accepted the media change and remained healthy.
- No Codex-started server, watcher, Gradle, Angular-test or Vitest process is
  intentionally left running.

Recheck these facts with `git status --short` and
`git -C frontend status --short`; do not assume they remain true after later
work.

## Proven behavior — do not repeat without a related code change

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

### Media implementation — focused automated PASS

- Managed images keep one canonical domain URL.
- Carousel slots derive `small.webp`; the selected editor preview derives
  `medium.webp`.
- ordinary cards derive `medium.webp`; fullscreen and Article body/viewers
  derive `large.webp`.
- Article HTML is rewritten only while rendering; three URLs are not persisted
  in the Article.
- External, data, blob and local-mode URLs remain unchanged.
- A partial backend rendition set is deleted and the upload fails; it is not
  reported as three copies of the original.
- Focused frontend result: 3 files, 11/11 tests passed.

Detailed contract: [`MEDIA_IMAGE_VARIANTS_MANUAL_QA.md`](../manuals/MEDIA_IMAGE_VARIANTS_MANUAL_QA.md).

## Active checkpoint — `MEDIA-IMG-001`

What remains unproven is visual/network behavior, not the URL helper unit
contract:

1. Upload one non-square source larger than 1600 x 1200 through Event Editor.
2. Capture the response's distinct original/small/medium/large URLs.
3. Verify decoded bounds 128/640/1280, aspect ratio and WebP variants.
4. In Network, verify Event slot `small`, editor preview/card `medium`, and
   fullscreen `large`.
5. Reuse the same contract in Admin Article and Admin Help. Article list is
   `medium`; admin/public Article body is `large`.
6. Save/reopen and prove one canonical stored URL and no second upload.

Do not run a backend E2E for this manual pass. Exact dimensions and the browser
Network mapping are intentionally the manual oracle.

On PASS, update only the `MEDIA-IMG-001` ledger row and regenerate the XLSX:

```bash
python3 guides/qa/tools/sync-qa-matrix-xlsx.py
```

Then change the resume block to `CHAT-AUTH-001`.

## Queued checkpoint — `CHAT-AUTH-001`

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
