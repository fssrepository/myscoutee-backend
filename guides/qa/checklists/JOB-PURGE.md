# JOB-PURGE manual execution checklist

## Prepared state

- **IN PROGRESS — 2026-08-31**
- Variation: `with-reference`
- Prepared at: `2026-08-31T11:19:25.857Z`
- The existing scheduler owns execution; do not press a hidden/manual trigger
  and do not start another backend, worker or stack.
- Exact fixture user: `admin-job-fixture:v1:account-purge:user`
- Exact purge job: `admin-job-fixture:v1:account-purge:purge-job`

## Journey

1. [ ] Open the existing Ava admin session and select
   `Configuration → Jobs → account-purge`.

2. [ ] Verify the prepared pre-run state:

   - the rule is enabled;
   - manual Run is disabled;
   - pending/pre-run count is `1`;
   - the screen identifies the normal scheduled account-purge worker.

3. [ ] Leave the screen open and wait for the existing scheduler poll. Do not
   reload merely to force a result and do not start or trigger another worker.

4. [ ] Verify the completed job detail after its normal live refresh/poll:

   - status is Completed;
   - affected/last-run count is `1`;
   - pending count returns to `0`;
   - completion time is present and no error is shown;
   - manual Run remains disabled.

5. [ ] Report `JOB-PURGE complete`. Codex then runs the persisted fixture
   oracle. PASS requires the fixture user and its `userRates` reference to be
   absent, while the exact purge job is Completed, has an empty `userId`, a
   completion timestamp, retry count `0`, and no error. Codex then resets the
   fixture and proves `prepared:false`.

The user owns the frontend visual and interaction verdict. Codex owns only the
backend/API/persisted oracle after the visible scheduler result.
