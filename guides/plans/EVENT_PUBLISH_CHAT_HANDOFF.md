# EVENT-PUBLISH-CHAT-001 handoff

Status: implementation updated; a clean manual Publish retest is required before
the retained event continues into the invitation-acceptance chat branch.

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

## Publish evidence captured

Casey published `Manual QA EVENT-PUBLISH-CHAT-001` exactly once. The read-only
oracle confirmed one Casey event chat and unit chat bucket counter changes,
Drafts `-1`, unchanged Hosting/My Events, no pending-recipient chat and no
invitation-accepted notification. The run also exposed an invalid automatic
`Event published.` chat message and Casey notification; that run is not PASS.

Require immediately after the response:

- Casey top-level Chats badge `+1`;
- Casey Chat > All and Event bucket counters `+1`;
- Casey My Events remains `1`; Drafts changes `1 → 0`;
- exactly one empty Casey main-event chat with unread `0`;
- no automatic Publish system message in the channel;
- no Casey notification for Casey's own Publish;
- the same Casey values after reload;
- Nova and Riley chat rows/counters unchanged;
- event active with occupancy `1 / 8` and pending badge `2`;
- no invitation-accepted notification.

The read-only oracle used was:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints.sh status event-domain EVENT-PUBLISH-CHAT-001
```

It showed one Casey event chat, no Nova/Riley event chat, Casey
`actionDelta.chats/chatAll/chatEvent = 1`, and Nova/Riley chat deltas `0`.

## Remaining acceptance branch

After a clean Publish proof, retain the event and capture the reloaded Casey
Chat > Event list showing the empty channel before continuing.

The first Publish happened before the notification-audience correction was
hot-deployed. Before invitation acceptance, use the retained event for one
explicit Unpublish/Republish notification pass:

- Casey Unpublishes once. Nova and Riley receive the separate event-context
  `under-review` lifecycle notification with warning/amber presentation; it
  must not appear as a Scheduled notification. Casey receives no notification
  for the action he performed.
- Casey Publishes once again. Nova and Riley receive an event-context
  `modified`/available-again notification with information/blue presentation,
  not another invite and not a Scheduled notification. Casey again receives
  no self-notification.
- The original first Publish is the event-invite occurrence. Later lifecycle
  transitions remain separate and are not collapsed into that invite.
- The existing empty main chat remains single; Republish creates no automatic
  chat message and Casey's chat counters do not increase a second time.

Then retain the same event and continue the checkpoint metadata:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints.sh \
  advance event-domain EVENT-PUBLISH-CHAT-001 EVENT-INV-003
```

Riley Outside is the selected recipient and Nova Social remains the pending
negative control. Riley accepts exactly once through the recipient UI. Require:

- Riley becomes accepted exactly once and the event changes to `2 / 8` with
  one pending recipient;
- Casey and Riley see the same main-event chat while Nova sees none;
- Riley's chat counters increase by one unit and remain stable after reload;
- Riley sends one unique proof message which Casey receives in that same chat;
- Casey receives exactly one invitation-accepted notification naming Riley
  and the event.

The special `prepare-invitation-acceptance-retest` command is not required for
this retained chain because Riley is still pending. Run the EVENT-INV-003
read-only oracle after the UI evidence. Reset only after both the Publish and
acceptance branches pass:

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
