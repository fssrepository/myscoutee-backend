# NOTIFICATION-ADMIN-LIFECYCLE-001 user test guide

This journey proves one Admin notification-rule edit, one target notification,
the real outbox worker, an unchanged second pass and restoration. Saving a rule
does not itself send a notification.

## Actors and startup

- **Ava** edits and observes **Send notifications**.
- **Nova** is the sole controlled notification recipient.
- **Casey** is the controlled source and must receive no self-notification.
- Codex snapshots the complete original rule, one unrelated rule, the target
  inbox/outbox rows, counters and Monitoring baseline.

To start, tell Codex:

`Prepare NOTIFICATION-ADMIN-LIFECYCLE-001 at the rule-edit baseline.`

Start only after Codex prints the original Send notifications interval and
confirms that no target row has yet been enqueued. The test uses the already
running scheduler and current configured Firebase mode.

## 1. Save, reopen and invalid atomicity

1. In **Ava**, open `Configuration -> Jobs -> Send notifications`.
2. Record its current Timing value, enabled state, Last run and newest Runner
   history row. Do not change Suspend or Run.
3. Open `Timing -> Edit`, set the interval to **2 minutes**, and save with the
   checkmark once. Close Job Detail and reopen **Send notifications**.
4. Confirm the persisted interval is exactly **Every 2 minutes**, the enabled
   state is unchanged and no notification or run was created by this save.
5. Report:

   `NOTIFICATION-ADMIN-LIFECYCLE-001 valid rule save complete`

6. Codex now submits the checkpoint's versioned invalid-rule request. The UI
   is not asked to fake an invalid value that it normalizes before save.
7. After Codex reports the expected rejection, close and reopen Job Detail.
   The valid two-minute revision is intact. The unrelated control rule,
   outbox/inbox rows and runtime history remain byte-for-byte unchanged.

## 2. One recipient and the real outbox worker

8. In **Nova**, open Notifications and record the New count. Casey records the
   same source-side count as a negative control.
9. Report:

   `NOTIFICATION-ADMIN-LIFECYCLE-001 recipient baseline ready`

10. Wait while Codex uses the versioned fixture to enqueue one controlled
    Casey-to-Nova notification and arms only **Send notifications** for its
    next normal scheduler pass.
11. Without reloading, Nova's counter increases by one. In
    `Notifications -> New`, exactly one row identifies the controlled source;
    Casey receives no matching row.
12. In Ava, reopen **Send notifications**. `Eligible before next run` shows the
    one tracked item and `Run` remains disabled. Leave the detail open for the
    normal scheduler.
13. Confirm one new terminal Runner history row, a duration, no unexplained
    second run and a detail matching the environment:

    - with Firebase inactive, the job completes with zero sent and explicitly
      says delivery is inactive; the one logical outbox row remains Pending;
    - with verified Firebase active, the outbox reaches its real Sent/Failed
      result and its device-result counts agree with Monitoring.

    The already-created in-app bell is valid in both modes.

14. Open Nova's row once. It leaves New, remains once in All and decrements
    only Nova's notification count. It does not mark the source Chat read.
15. In Ava, open `Monitoring -> Notifications`. Pending/running/sent/failed and
    health must match the actual Firebase branch; an inactive gateway is not
    recorded as a fabricated successful push.
16. Report:

    `NOTIFICATION-ADMIN-LIFECYCLE-001 first delivery complete`

Codex verifies the exact task, one logical outbox, one Nova inbox row, no Casey
row, the stable read timestamp and matching Job/Monitoring identity.

## 3. Unchanged second pass and restoration

17. Wait while Codex re-arms only the same scheduler rule without creating a
    new producer item. Leave Job Detail open for the second normal pass.
18. Confirm the second run adds no inbox row, no logical outbox row and no
    counter increment. The existing Firebase-inactive Pending row may remain
    Pending; an active environment retains its prior terminal delivery.
19. Open Timing, restore the exact original interval printed at startup and
    save once. Close/reopen Job Detail and confirm the original interval and
    enabled state.
20. Report:

    `NOTIFICATION-ADMIN-LIFECYCLE-001 restored`

Codex checks dedupe, configuration history, unrelated controls and exact
fixture restoration.

## Expected effort

| Work | Clean run | With one worker/failure replay |
| --- | ---: | ---: |
| Rule save/reopen/invalid contract | 20 min | 45 min |
| Producer, bell and outbox lifecycle | 30 min | 70 min |
| Second pass, Monitoring and restore | 20 min | 50 min |
| Evidence and reset | 10 min | 25 min |
| **Total** | **80 min** | **190 min** |

