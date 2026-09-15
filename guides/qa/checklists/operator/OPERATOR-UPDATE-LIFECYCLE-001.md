# OPERATOR-UPDATE-LIFECYCLE-001 — Apply one prepared update

## Purpose

Apply one valid, compatible QA release from Updates. Compare progress, the
durable task result and the installed version, then reopen Operator.

**Actor:** Operator on the designated disposable update target. Codex names
the current/target versions, package and recovery baseline in advance.
The active development checkout is not the update target.

## 1. Current and target versions

1. Open **Updates** on the designated Operator. Check deployment name and
   current version.
2. Use **Refresh** to retrieve the available release. Target version and
   compatibility match the prepared package.
3. Read the update information. Codex verifies that the selected release
   matches the designated QA package.

Report: `OPERATOR-UPDATE-LIFECYCLE-001 block 1 done`.

## 2. Apply and observe progress

4. Select **Apply update** once.
5. Follow the displayed phases. The UI must not report completion before
   the actual update task finishes.
6. Wait for the final result. Codex compares task identity, start/end times,
   status and target version against the designated QA target.

Report: `OPERATOR-UPDATE-LIFECYCLE-001 block 2 done`.

## 3. Operator after the update

7. Reopen Operator on the updated target. Normal access works and the
   actually installed target version is displayed.
8. Reopen Updates. The completed result persists and that release is now
   shown as the current version.
9. Codex retains UI and durable evidence, then restores the designated QA
   target according to its baseline. Update outcome and fixture restoration
   are recorded separately.

Report: `OPERATOR-UPDATE-LIFECYCLE-001 done`.

## Execution boundary

The release/target fixture is prepared separately when this test starts.
Use fixture prerequisites instead of repeating deployment or registration
journeys. Corrupt packages, invalid signatures, downgrade, interruption and
rollback failure injection belong to packaging/update automated coverage.
