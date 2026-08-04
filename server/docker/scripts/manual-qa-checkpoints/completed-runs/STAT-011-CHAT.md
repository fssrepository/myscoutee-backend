# STAT-011 — one ordinary chat message

Status: `MANUAL UI + FUNCTIONAL PASS` on 2026-08-04; historical reconstruction,
not rerun.

## Why and what

Prove that one ordinary, non-system chat message exists once and produces
exactly one Daily usage Messages delta and one Communication/Messages delta.

## Preconditions and isolation

- Use an existing chat visible to the signed-in sender and record its API/UI
  message count plus the Statistics baseline.
- Generate a globally unique plain-text token containing the test ID and current
  timestamp; keep attachments and system actions out of the test window.
- Do not invoke a direct telemetry or Statistics hook.

## Reproduction helper

From `server/docker/scripts/manual-qa-checkpoints`:

```bash
bash manual-qa-checkpoints.sh stage stat-011
# send the printed uniqueMessage exactly once
bash manual-qa-checkpoints.sh status stat-011
bash manual-qa-checkpoints.sh reset stat-011
```

The default sender/chat is Farkas Anna in **Host Circle Ops**. `stage` validates
the existing chat, captures all exact counter baselines, and prints a unique
token; it does not insert the message. No scheduler is shortened because chat
persistence is immediate; `status` waits for the normal Statistics/Monitoring
materialization.

## Reproduction checkpoints

1. Record the selected chat's exact message count and Statistics baseline.
2. Send one globally unique ordinary text from a known user. Do not send an
   attachment or system message.
3. Capture the single new chat bubble.
4. Verify the API contains exactly one matching normal message and total count
   increased by one.
5. Wait for the normal Statistics worker, refresh Statistics, and verify only
   the expected message/communication counters changed.

## Pass criteria and cleanup

- Exactly one ordinary message row and one UI bubble match the unique token.
- Daily Messages and Communication/Messages rise by exactly one; no other delta
  is attributed to chat without independent evidence.
- Preserve the unique message as traceable QA evidence unless the run explicitly
  uses a disposable chat. No scheduler history is rewound.

## Historical evidence

- Farkas Anna sent `QA STAT-011 ordinary message 2026-08-04 06:48` once in
  **Host Circle Ops**.
- The UI showed one bubble; API total changed `41→42` and found one matching
  non-system record.
- Today's Messages changed `0→1`, Communication/Messages `417→418`, and
  Communication total `426→427`.
- Ratings and Moderation stayed stable. Events had already reached its later
  value before the message snapshot and was not attributed to chat.

## Reusable prompt

```text
Run STAT-011 with one unique ordinary chat message. Explain that the test
separates a real user message from system-message telemetry. Capture chat/API
and Statistics baselines, send once, prove exactly one persisted bubble, wait
for the normal Statistics worker, and require Messages and Communication +1.
Do not attribute unrelated scheduler changes to chat. Append a dated result;
do not replace the 2026-08-04 pass.
```
