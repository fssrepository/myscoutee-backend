# OPERATOR-UPDATE-LIFECYCLE-001 — One verified release and durable update

## Purpose

Apply one valid, compatible QA release. Correlate verification, visible progress,
the durable update job, controlled restart and actually installed version.
**Actor:** Operator on the designated disposable update target.

## Fixture prerequisites

Codex names the initial/target versions, package identity and recovery baseline,
and records existing release/job state. Fixtures prepare the target and access
instead of replaying deployment/registration. The real update path verifies and
applies the release; fixture-written success or version state is not evidence.
Use the designated QA target, not the active development checkout.

For the user-designated VMware run, also follow the separate
[deployment qualification](../../../releases/PRERELEASE_DEPLOYMENT_QUALIFICATION.md):
its per-run table tracks deployment, automated normal-account UI/image smoke,
external security probes, measured memory/startup efficiency and cleanup.
Deferred optimizations have their own priority/evidence table. These results
remain deployment evidence outside the pair-QA matrix; they do not substitute
for this update checklist. Keep dependency upgrades in their separate workflow.

## 1. Current version and release verification

1. Open **Updates**. Check deployment identity and the actual current version.
2. Use **Refresh** to retrieve the prepared release. Displayed target version
   and compatibility match the designated package.
3. Read the release information. Codex correlates the package identity and
   successful verification result with the one release accepted for this test.
   Listing a release alone does not prove verification or installation.

Report: `OPERATOR-UPDATE-LIFECYCLE-001 block 1 done`.

## 2. Apply and observe the durable job

4. Select **Apply update** once. Codex records the one resulting durable update
   job, target release and starting state against the baseline.
5. Follow the displayed phases and timestamps. Progress agrees with the actual
   task; the UI must not report completion before the task succeeds.
6. Allow the normal controlled restart required by the update. Its temporary
   connection loss is not a success result; record the subsequent recovery.
7. At completion, Codex correlates job ID, start/end, outcome, verified release
   and installed target version. The single Apply action has not created
   duplicate update work or contradictory terminal results.

Report: `OPERATOR-UPDATE-LIFECYCLE-001 block 2 done`.

## 3. Reconnection, reopening and restoration

8. After the controlled restart, reopen Operator on the same target. Normal
   access works and the displayed active version matches the installed version.
9. Reopen Updates. The completed job remains visible and the prepared release
   is now the current version.
10. Codex checks that reconnection/reopening created no second Apply operation
    or update job. Release verification, durable result and active version agree.
11. Retain UI and durable evidence, then restore the target through its declared
    QA recovery procedure. Record successful update and fixture restoration
    separately; neither result substitutes for the other.

Report: `OPERATOR-UPDATE-LIFECYCLE-001 done`.

## Original matrix coverage

| Source requirement | Owning checks |
| --- | --- |
| One prepared valid/compatible verified release | Block 1 |
| One durable update job and honest progress | Block 2 |
| Controlled restart, reconnect and correct active version | Block 2 step 6 and block 3 |
| No duplicate work after one Apply or reopening | Steps 4, 7 and 10 |
| Package/job/installed-version correlation and cleanup | Steps 7–11 |

## Execution boundary

The package/target fixture is prepared when this checkpoint starts. Corruption,
invalid signatures, downgrade, interrupted-worker and rollback failure branches
remain packaging/update automated coverage; no fault-injection loop is added here.
