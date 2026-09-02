# EVENT-SCHEDULERS-001 user test guide

This file is the tester's stable, repeatable click-by-click guide. It is not an
execution log: do not check off its steps or add the current status, dates, or
machine-oracle evidence to it.

## Actor and shared rules

- Perform every visible step in the isolated **Ava admin** window opened by
  Codex.
- Codex prepares and restores all fixtures. Do not edit Timing, Parameters, or
  job status.
- Do not select `Run`, even when it is enabled. The already-running scheduler
  picks up the prepared work in these checks.
- Do not start another backend, scheduler, or browser session.
- Stop at the first mismatch. Do not repeat the job, add reloads, or repair a
  fixture through the UI.

For every branch, observe these areas on Job Detail:

- `Eligible before next run`;
- `Last run`, including time, affected count, and duration;
- `Runner history`, including the newest row's time, duration, affected count,
  status, and detail.

Use this path for each Metrics comparison:

`Open Ava's menu → MONITORING section → Metrics → Background → Jobs`

Record `Scheduler / Scheduled triggers` and `Audit trail / Audit events`.
These are global counters shared by every enabled job. The fixture temporarily
moves every unrelated scheduler to a long future interval and restores all of
their original timing controls after the branch. Some target jobs enqueue a
required reactive downstream job, so use the exact branch-specific delta below.
The selected Job Detail history and Codex's rule-key oracle independently prove
that each expected rule ran exactly once. Allow up to 75 seconds for Metrics
ingestion, then reopen Metrics once.

## 1. Automatic room assignment

Internal key: `event-random-groups`  
Display name: `Automatic room assignment`

1. Tell Codex:

   `Prepare the EVENT-SCHEDULERS-001 random-groups branch.`

2. Wait until Codex confirms the `balanced` fixture and opens Ava's admin
   window.
3. In Ava, open `Configuration → Jobs`.
4. In the `All` list, find `Automatic room assignment`. Its secondary label
   identifies `event-random-groups`.
5. Select the row's `View process`/settings icon.
6. At the prepared boundary, confirm:

   - the job is not suspended;
   - `Eligible before next run` is `6 users`;
   - the job is neither Running nor Failed;
   - the current top `Runner history` row still predates the fixture.

7. Open Ava's menu, select `Metrics` under `MONITORING`, open
   `Background → Jobs`, record the two shared baseline values, and return to
   this job's detail view.
8. Report both baseline values to Codex and wait until Codex confirms that the
   persisted schedule is armed. Do not select `Run`. Then leave the detail open
   and wait for its normal live refresh.
9. After the scheduler run, confirm:

   - the run is Completed;
   - `Eligible before next run` is `0`;
   - `Last run` shows `6` affected and a duration;
   - the top `Runner history` row is one new Completed row with `6` affected
     and a time belonging to this run;
   - no second new history row or error appears.

10. Reopen `Metrics → Background → Jobs` once. `Scheduled triggers` and
    `Audit events` remain equal and are each exactly `+2` from their recorded
    baselines: one `event-random-groups` run plus its required reactive
    `notification-outbox` wake-up. Reopen once more after one scheduler poll and
    confirm that both values remain unchanged; any further increment is a
    duplicate or unrelated-run failure.
11. There is no additional UI check in this step. If steps 9 and 10 both
    passed, send this completion phrase to Codex:

    `EVENT-SCHEDULERS-001 random-groups UI ready`

12. Wait for Codex to run the persisted oracle, reset this fixture, and permit
    the next branch.

## 2. Past-event expiry and zero-work repeat

Internal key: `event-counter-expiry`  
Display name: `Close past events`

13. Tell Codex:

    `Prepare the EVENT-SCHEDULERS-001 counter-expiry branch.`

14. After Codex confirms preparation, open
    `Configuration → Jobs → Close past events`.
15. Before the first run, confirm:

    - the job is not suspended;
    - `Eligible before next run` is `1 affected`;
    - the job is neither Running nor Failed.

16. Record the top Runner history row and the two shared Metrics baseline
    values, then return to Job Detail.
17. Report both baseline values to Codex and wait until Codex confirms that the
    persisted schedule is armed. Do not select `Run`; wait for the normal
    scheduler run and live refresh.
18. After the first run, confirm:

    - the run is Completed;
    - `Eligible before next run` is `0`;
    - `Last run` shows `1` affected;
    - the top Runner history row is exactly one new Completed row with `1`
      affected;
    - the detail reports one expired Event source with no error.

19. In `Metrics → Background → Jobs`, both shared values remain equal and
    are each exactly `+1` from the first baseline.
20. Report:

    `EVENT-SCHEDULERS-001 counter-expiry first run ready`

21. Wait while Codex makes the same rule due again without changing domain
    data. Do not edit the Event or select `Run`.
22. Record the two Metrics values after the first run, report them to Codex,
    and wait until Codex confirms that the persisted zero-work schedule is
    armed. Return to Job Detail without selecting `Run` and wait for the next
    normal scheduler pass.
23. After the second, zero-work run, confirm:

    - the run is Completed;
    - `Last run` shows `0` affected;
    - the top Runner history row is one new Completed row with `0` affected;
    - the detail reports that no Event counter or ticket record was due;
    - no error or false positive domain result appears.

24. `Scheduled triggers` and `Audit events` remain equal and are each exactly
    `+1` from the values recorded after the first run.
25. Report:

    `EVENT-SCHEDULERS-001 counter-expiry zero-work ready`

26. Wait for Codex's persisted oracle and reset confirmation.

## 3. Expired checkout draft purge

Internal key: `event-checkout-basket-purge`  
Display name: `Delete expired baskets`

27. Tell Codex:

    `Prepare the EVENT-SCHEDULERS-001 basket-purge branch.`

28. After Codex confirms preparation, open
    `Configuration → Jobs → Delete expired baskets`.
29. At the prepared `mixed` boundary, confirm:

    - the job is not suspended;
    - `Eligible before next run` is `2 affected`;
    - the job is neither Running nor Failed.

30. Record the top Runner history row and the two shared Metrics baseline
    values, then return to Job Detail.
31. Report both baseline values to Codex and wait until Codex confirms that the
    persisted schedule is armed. Do not select `Run`; wait for the normal
    scheduler run and live refresh.
32. After the run, confirm:

    - the run is Completed;
    - `Eligible before next run` is `0`;
    - `Last run` shows `1` affected;
    - the top Runner history row is exactly one new Completed row with `1`
      affected;
    - the detail reports that one expired checkout basket item was marked
      deleted;
    - no error or second new history row appears.

33. In `Metrics → Background → Jobs`, `Scheduled triggers` and `Audit events`
    remain equal and are each exactly `+1` from the baseline.
34. Report:

    `EVENT-SCHEDULERS-001 basket-purge UI ready`

35. Wait for Codex's persisted oracle and reset confirmation.

The user portion ends here. Codex records PASS/FAIL only after its independent
machine-side oracle. The execution result never gets written into this file.
