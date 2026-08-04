# Reproducible manual-QA prompt

## Source requirements translated into English

The following translated requests define why this harness exists. They preserve
the requested workflow and constraints without retaining non-English source
text:

> Test the real scheduler by changing its persisted database schedule and then
> waiting for the scheduler to pick up the work. Repeat the test with enough
> time for the human observer to capture at least one screenshot and provide
> meaningful evidence at every checkpoint.

> Do not adapt or extend the automated fixture suite for this manual test. Do
> not touch its 57 tests. Create a separate manual workflow in a dedicated
> directory so another QA operator can execute it without depending on the
> original human observer.

> Include the request itself as a reusable prompt so the workflow is
> reproducible.

> Open every observation window before shortening the schedule. Use three
> separate Gmail/browser accounts so sessions and active users cannot mix. This
> allows a much shorter scheduling window.

> Document this multi-session setup in the plan for anyone reproducing the
> test.

> Do not impose an unnecessary three-minute wait.

> Create equivalent reproducible manual QA scripts for the tests already
> completed, but do not rerun those completed tests solely to create the
> documentation.

> The manual helper must be able to prepare a testable state and, when the
> scenario genuinely uses a scheduler, shorten the persisted scheduler timing
> before the human observation begins.

Related standing instructions from the same QA session:

- Always begin a manual step by explaining why it is performed and what is
  being tested.
- Use the already-running dev stack and its hot deploy; do not start a parallel
  backend, frontend, Gradle build, database, or scheduler.
- Exercise the real scheduler by changing persisted timing and waiting for its
  normal poll. Do not replace this with a manual hook or direct job endpoint.
- Test data may establish a controlled initial state, but baselines must be
  captured after staging and before the scheduler-created result.
- Preserve every checkpoint and record manual versus automated evidence in the
  QA plan/matrix.
- Open all observation windows first in three isolated Gmail/browser sessions,
  then use a short persisted schedule delay; the sessions must not share active
  users or cookies.
- Split long product lifecycles into independently passable test cases. A later
  case may consume a manually created event from the same campaign, but it must
  also have an independent staging path.
- Group cases by producer domain and explicitly map every downstream consumer.
  Event Editor save/publish, invitation acceptance, tournament grouping, asset
  linkage and operator authentication mode are causal workflows, not static
  form smoke tests.
- Define checkpoint chains, not cross-products. Every checkpoint has one
  before state, one action, one immediate result, one named worker expectation,
  one delayed consumer and explicit `X` surfaces. `MUST NOT RUN` is evidence,
  not a missing scheduler setup.
- Verify user-facing projections in addition to database state. Examples
  include the invited user appearing once as pending in Event Members, the
  matching recipient invitation, accepted-only chat access after terminal
  acceptance, tournament group membership, and the correct asset-to-user or
  event/sub-event assignment.
- Treat feedback, Impressions, ticketing, lifecycle buckets and event
  deletion/restore as Event-domain boundary checkpoints. Verify whether the
  mutation must start a worker and explicitly prove no worker for read-only or
  direct request-path checkpoints.

## Reusable prompt for another Codex or QA operator

```text
Continue the MyScoutee manual dynamic-surfaces QA with STAT-012.

Use server/docker/scripts/manual-qa-checkpoints only. Do not modify or execute
the admin-job-fixtures automated suite and do not start any additional dev
stack, frontend, backend, Gradle, Mongo, or scheduler process.

At every human action, first explain why the step is needed, what it tests, and
the exact expected visible result. Work through these checkpoints one at a
time, waiting for the human screenshot/confirmation before continuing:

1. Verify `status stat-012` is not-staged.
2. Run `stage stat-012`. Verify the baseline-ready database oracle has zero
   invite/marker/outbox/bell artifacts. Record the printed deterministic
   `expectedInvitee`; the stage has already materialized the test event in the
   Statistics event inventory baseline.
3. Ask the human to capture post-stage Statistics, Monitoring/All, and
   event-auto-inviter Admin Job baseline screenshots. Do not schedule yet.
   If evidence collection approaches the one-hour deadline, run
   `hold stat-012`; record the new synthetic timing anchor and continue without
   attributing it to a scheduler execution.
4. Before scheduling, have the human open Monitoring, Statistics, Admin Job
   detail, and the `expectedInvitee` notification view across three isolated
   Gmail/browser sessions. After all baseline screenshots are confirmed, run
   `schedule stat-012 30`. Report the printed real scheduler run window and ask
   for the scheduled Admin Job checkpoint.
5. Wait for the existing scheduler; never call Run or a job endpoint. Poll only
   `status stat-012` until scheduler-completed.
6. Verify exactly one invitation, marker, outbox, and bell with identical seeded
   recipient, lastRunCount 1, and pendingCount 0.
7. Ask for post-run Monitoring, Statistics, Admin Job, and invited-user bell
   screenshots, one step at a time. Compare only against the post-stage
   baseline.
8. Record evidence and manual/automated status in the QA MD/CSV/XLSX without
   deleting existing rows or priorities.
9. Run `reset stat-012`, confirm not-staged, and report what was restored.

The already completed BASE-STAT, STAT-010, STAT-011, and STAT-020 cases must be
maintained as reproducible manual QA scripts under completed-runs, but do not
rerun them merely to create or improve their documentation.

Each completed-case script must also have a callable helper where applicable:
`stage` creates a controlled post-stage baseline, `schedule` shortens only the
persisted real scheduler window when that flow actually has a scheduler,
`status` provides independent machine oracles, and `reset` restores selected
temporary data/configuration. Never invent a scheduler for immediate chat or
frontend-batched rating paths; preserve their real periodic mechanism.

If a functional gap appears, retain the failed evidence, fix it with a focused
regression test where appropriate, verify the existing hot deploy compiled it,
and repeat only the affected manual checkpoint. Be explicit about which data
was staged directly and which result was created by the real scheduler.
```
