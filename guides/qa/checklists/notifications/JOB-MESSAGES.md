# JOB-MESSAGES user test guide

This journey proves both outcomes of the real **Send scheduled messages** job:
an inactive user is changed once, while a recently active user is only
rescheduled. It records Admin Job and Monitoring evidence without inventing a
bell or email for an action-only task.

## Actor and startup

- **Ava** performs every Admin UI check.
- A disposable fixture-user window is present only to show the resulting user
  state; Codex supplies its exact name.
- The existing scheduler owns execution. `Run` is expected to be disabled.
- Codex prepares and resets one variation at a time and temporarily isolates
  other due scheduled-message tasks.

To start, tell Codex:

`Prepare JOB-MESSAGES with the inactive-user variation.`

Do not start another worker, edit Timing or press any hidden/manual trigger.

## 1. Inactive-user action

1. In **Ava**, open `Configuration -> Jobs -> Send scheduled messages`.
2. Confirm `Eligible before next run` is **1**, the job is enabled, `Run` is
   disabled, and the newest Runner history row predates this fixture.
3. Open `Monitoring -> Background -> Jobs` and record Scheduler / Scheduled
   triggers and Audit trail / Audit events, then return to Job Detail.
4. Leave Job Detail open for up to one minute. The normal scheduler must run
   without a manual action.
5. After the live update, confirm one new Completed history row, affected count
   **1**, a duration and no error. Eligible work returns to zero.
6. In the fixture-user window, confirm the profile now shows
   **Your profile is inactive**. The user cannot continue an ordinary active
   member action.
7. Reopen Monitoring once after Codex confirms ingestion. The scheduled trigger
   and audit values each contain this one attributed run; do not count an
   unrelated job.
8. Report:

   `JOB-MESSAGES inactive-user complete`

Codex verifies task `completed`, `lastRunCount=1`, user `status=I`,
`profileStatus=inactive`, exactly one action delivery/audit and the one expected
user-affinity task. This variation does not require a user bell or email.

## 2. Recent-user reschedule control

9. Wait while Codex saves the first oracle, resets it and prepares
   `recent-user`. Start only after the new boundary is confirmed.
10. In Ava, reopen **Send scheduled messages**. Again confirm Eligible is 1,
    `Run` is disabled and the top history row predates this variation.
11. Leave the page open for the normal scheduler pass.
12. Confirm the new history detail says the active user was rescheduled, not
    inactivated. The task remains Scheduled and its due time moves to about 30
    days after the fixture's recorded activity.
13. In the fixture-user window, confirm the profile remains active and no
    inactive banner appears. No unexplained notification/email is visible.
14. Reopen Monitoring once and confirm exactly one attributed scheduler/audit
    result for this control, with no failure.
15. Report:

    `JOB-MESSAGES recent-user complete`

Codex verifies the moved due time, unchanged active user, one rescheduled audit
delivery, isolated controls and exact reset.

## Expected effort

| Work | Clean run | With scheduler-delay replay |
| --- | ---: | ---: |
| Inactive-user branch | 8 min | 25 min |
| Recent-user control | 7 min | 20 min |
| Monitoring, evidence and reset | 5 min | 20 min |
| **Total** | **20 min** | **65 min** |

