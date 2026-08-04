# EVENT-PUBLISH-CHAT-001 handoff

Status: implementation complete; clean manual Publish retest staged on 2026-08-04.

Do not start or rebuild the stack. The existing dev stack and both hot-deploy watchers are already running.

## Exact staged state

- Event: `manual-qa-checkpoint:v1:event-domain:event`
- Title: `Manual QA EVENT-PUBLISH-CHAT-001`
- Lifecycle: Draft (`DR`), one canonical event
- Casey Bridge (`650000000000000000000061`): accepted Admin
- Nova Social (`650000000000000000000062`): pending invite
- Riley Outside (`650000000000000000000063`): pending invite
- Event chats: none
- Casey/Nova/Riley persisted chat counters: `0`; checkpoint action deltas: all `0`
- Casey `My Events` / `hosting`: `1`; `event.drafts`: `1`
- Scheduler: not involved

## One remaining action

In the existing Casey session, reload once, open Events > Drafts, and Publish `Manual QA EVENT-PUBLISH-CHAT-001` exactly once. Keep Nova and Riley as negative controls.

Require immediately after the response:

- Casey top-level Chats badge `+1`;
- Casey Chat > All and Event unread counters `+1`;
- Casey My Events remains `1`; Drafts changes `1 → 0`;
- exactly one Casey main-event chat, unread `1`;
- exactly one idempotent `system:event-published` message;
- the same Casey values after reload;
- Nova and Riley chat rows/counters unchanged;
- event active with occupancy `1 / 8` and pending badge `2`;
- no invitation-accepted notification.

Then run only this read-only oracle:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints.sh status event-domain EVENT-PUBLISH-CHAT-001
```

The oracle must show one Casey event chat, no Nova/Riley event chat, Casey `actionDelta.chats/chatAll/chatEvent = 1`, and Nova/Riley chat deltas `0`.

Reset only after evidence is captured:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints.sh reset event-domain EVENT-PUBLISH-CHAT-001
```

## Verification already completed

- Running frontend hot-deploy build: green.
- Running backend hot-deploy main-source compile: green.
- Focused local frontend suites passed 12/12 before the final operation-direction
  refactor; the full frontend hot-deploy TypeScript build is green afterward.
- A fresh backend unit run was stopped under laptop memory pressure; do not rerun it during this manual pass.
- No additional server, watcher, Angular test, Vitest, or Gradle test process remains running.

The worktree contains intentional pre-existing QA changes plus this
`Users.activities`/unit-direction implementation. No delta is persisted. Chat
owner documents and their user-counter updates are written in batches. Do not
reset or discard unrelated changes. Mutation responses contain only directions
owned by that operation; the periodic poll reconciles concurrent external
changes.
