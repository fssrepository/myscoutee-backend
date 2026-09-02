# JOB-PURGE user test guide

This file is the tester's stable, repeatable click-by-click guide. It is not an
execution log: do not check off its steps or add the current status, dates, or
machine-oracle evidence to it.

## Actor and startup

- Perform every visible step in the isolated **Ava admin** window opened by
  Codex.
- The displayed job name is **Finalize deleted accounts**. Its internal key is
  `account-purge`.
- Codex prepares and resets the `with-reference` fixture. Do not create or
  delete a replacement account through the UI.
- The already-running scheduler owns execution. Do not select a hidden or
  manual trigger, and do not start another backend, worker, or stack.

To start a replay, tell Codex:

`Prepare the JOB-PURGE user test with the with-reference fixture.`

Start step 1 only after Codex confirms that the fixture is prepared and a
fresh Ava admin window is open. Stop at the first mismatch and report the step
number plus the state that is actually visible.

## Complete user journey

1. In Ava, open:

   `Configuration → Jobs → Finalize deleted accounts`

2. Confirm the prepared state on Job Detail:

   - the rule is enabled and not suspended;
   - `Run` is disabled;
   - `Eligible before next run` shows `1`;
   - the page identifies the normal scheduled account-purge process;
   - no Running or Failed state is already present.

3. Record the current `Last run` values and the top `Runner history` row so the
   next scheduler result can be distinguished from older history.
4. Leave Job Detail open for up to one minute. Do not reload merely to force a
   result and do not start or trigger another worker.
5. Wait for the normal live refresh, then confirm:

   - the new run is Completed;
   - `Last run` shows `1` affected and a completion time;
   - `Eligible before next run` returns to `0`;
   - a duration is present;
   - the top Runner history row belongs to this run, is Completed, and shows
     `1` affected;
   - no error is shown;
   - `Run` remains disabled.

6. Report:

   `JOB-PURGE complete`

The user portion ends here. Codex then verifies that the controlled user and
its reference are absent, the exact purge job is Completed without an error,
and the fixture reset returns to `prepared:false`. PASS/FAIL and that evidence
belong to the QA ledger, never to this file.
