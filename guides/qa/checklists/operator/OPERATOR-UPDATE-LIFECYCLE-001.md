# OPERATOR-UPDATE-LIFECYCLE-001 — Verified update, rollback and managed HTTPS

## Purpose

Apply one valid, compatible QA release. Correlate verification, visible progress,
the durable update job, controlled restart and actually installed version.
Start from QA1, upgrade to QA2 through Updates, then roll back to QA1 through
the UI with the previous installer absent locally. Also verify a controlled
failed update and disabled actions while an operation is running. On the same VMware target, verify the
managed HTTPS lifecycle. All three parts are required to close this Update row.
**Actor:** Operator on the designated disposable update target.

## Fixture prerequisites

Codex names the initial/target versions, package identity and recovery baseline,
and records existing release/job state. Fixtures prepare the target and access
instead of replaying deployment/registration. The real update path verifies and
applies the release; fixture-written success or version state is not evidence.
Use the designated QA target, not the active development checkout. Preserve its
current state first. The intended sequence is `1.0.0-qa.1` to `1.0.0-qa.2`,
then rollback to `1.0.0-qa.1`. Debian represents these prereleases as
`1.0.0~qa.1` and `1.0.0~qa.2`; the final stable release stays `1.0.0`.
Retain the original GitHub downloads and record the new hashes of any repackaged
artifacts. Signing or correcting version metadata does not add current update
code to historical binaries. Verify that the baseline actually implements the
Registry-independent update path before executing the UI sequence; otherwise
record that limitation and prepare a corrected baseline separately.

Record each GitHub release tag, artifact digest, internal package version and
installed build identity separately; a filename does not establish a version.
Prepare required signed GitHub release metadata through the versioned fixture
with an exact snapshot/reset. They must agree with the actual signed artifacts;
do not write successful job state or falsify the installed package version.
The application's normal update path downloads the GitHub artifact. Codex must
not pre-download or manually install it in place of the action under test.

### Persistent data preservation

This scenario does not test a data-model migration. Inventory all persistent
stores before installation, including MongoDB, MinIO, other mounted data/volumes,
deployment identity, secrets, certificates and operator-managed settings.
User-created records, uploaded objects and customized settings must survive
upgrade and rollback. Compare retained controls and object hashes before/after;
a recovery backup is not permission to delete or overwrite live data. Do not
purge the deployment or reset production databases/volumes for this test.
Application-owned static resources, such as bundled images, translations and
explicitly package-managed reference data, may change with a release. Establish
ownership before replacing anything; sharing a database or bucket does not make
user content package-owned. Future schema changes require explicit versioned
migration scripts and separate migration tests.

Before the failure branch, retain a verified recovery baseline and declare one
reproducible external failure trigger, its phase and its reset. Preserve user
data and configuration controls for comparison. Remove only the fixture-owned
cached previous installer for the cache-miss check; retain the recovery backup.

For the user-designated VMware run, also follow the separate
[deployment qualification](../../../releases/PRERELEASE_DEPLOYMENT_QUALIFICATION.md):
its per-run table tracks deployment, automated normal-account UI/image smoke,
external security probes, measured memory/startup efficiency and cleanup.
Deferred optimizations have their own priority/evidence table. These results
remain deployment evidence outside the pair-QA matrix; they do not substitute
for this update checklist. Keep dependency upgrades in their separate workflow.

## 1. Current version and release verification

1. Start with no Registry selection or enrollment; no real Registry service is
   required. Open **Updates**. Check deployment identity and the actual current version.
2. Use **Refresh** to retrieve the prepared release directly from GitHub through
   the local backend. Confirm discovery and Apply do not call Registry endpoints. Displayed target version
   and compatibility match the designated package.
3. Read the release information. Codex correlates the package identity and
   successful verification result with the one release accepted for this test.
   Listing a release alone does not prove verification or installation.

Report: `OPERATOR-UPDATE-LIFECYCLE-001 block 1 done`.

## 2. Apply and observe the durable job

4. Select **Apply update** for QA2 once. Codex records the one durable job,
   target release and starting state. While the job is pending/running, **Apply
   update** remains disabled, including after reopening the popup. Do not
   bypass the disabled control to manufacture repeated submissions.
5. Follow the visible phase, percentage, progress bar and timestamps. Download
   byte counts, when available, agree with actual transfer progress. Phase-based
   percentages must not imply measured byte progress. The UI remains busy and
   must not show 100%/completed before the actual task succeeds.
6. Allow the normal controlled restart required by the update. Its temporary
   connection loss is not a success result; record the subsequent recovery.
7. At completion, Codex correlates job ID, start/end, outcome, verified release
   and installed target version. The accepted action has not created
   duplicate update work or contradictory terminal results.

Report: `OPERATOR-UPDATE-LIFECYCLE-001 block 2 done`.

## 3. Reconnection and reopening

8. After the controlled restart, reopen Operator on the same target. Normal
   access works and the displayed active version matches the installed version.
9. Reopen Updates. The completed job remains visible and the prepared release
   is now the current version.
10. Codex checks that reconnection/reopening created no second Apply operation
    or update job. Release verification, durable result and active version agree.
11. Retain UI and durable update evidence, then continue directly from installed
    QA2 to rollback. Keep update, rollback, error and TLS results separate.

Report: `OPERATOR-UPDATE-LIFECYCLE-001 block 3 done`.

## 4. Roll back QA2 to QA1 without a cached installer

12. On the successfully updated QA2 target, inspect the visible **Rollback**
    action and its QA1 recovery point. If no UI recovery action exists, record
    the missing capability; a command-line restore does not pass this UI check.
13. Verify the retained backup and data controls. Remove only the fixture-owned
    cached QA1 installer, preserving the backup. No release or recovery result
    may be manufactured in the database.
14. Select **Rollback** to QA1 once. Its action remains disabled while recovery
    is pending/running, including after reopening. Require one recovery operation
    and visible phase/progress; do not bypass the disabled control.
15. Verify that the recovery process downloads the exact QA1 artifact from GitHub,
    validates its identity, checksum and trusted signature, then restores it.
    Observe the actual download; neither a local substitute nor an unchecked
    same-name file satisfies this step.
16. Follow the rollback operation through its actual phases and any controlled
    restart. Correlate its terminal result with the QA2 update and QA1 recovery
    point. Refreshing/reopening must not start another rollback operation.
17. Reopen Operator and compare the displayed version, installed package/build,
    health, retained access and fixture data/configuration controls with the QA1
    recovery baseline. Successful package download alone is not rollback success.

Report: `OPERATOR-UPDATE-LIFECYCLE-001 block 4 done`.

## 5. Failed update and recovery

18. Use the versioned fixture to prepare one declared failure scenario from the
    retained baseline. Start the update through the UI and apply the controlled
    external failure trigger. Observe the real failed/recovery-required phase
    and job. The action stays disabled while work is running; a failure must not
    appear as completed or leave a permanent misleading busy indicator.
19. Reopen Updates when reachable. The failure and its explanation persist.
    Verify the available retry/rollback action against the actual failed phase.
    If the application is unavailable, use the retained recovery procedure and
    record the limitation; do not claim UI recovery passed.
20. Remove the trigger and use the supported explicit retry or rollback once.
    Require a single operation, disabled action while running, an auditable link
    to the failed attempt, an honest terminal result and intact data. A deliberate
    retry may have a new job ID; it must not silently resume an unsafe partial
    installation. Record missing actions or unsupported recovery as open gaps.

Report: `OPERATOR-UPDATE-LIFECYCLE-001 block 5 done`.

## Deferred update variant: skip an intermediate release

After a genuine signed QA3 release is published, repeat the update/rollback
blocks with QA1 as the installed baseline and QA3 as the target. While QA2 is
available, leave it unapplied. Refresh after QA3 appears: QA3 must replace QA2 as
the offered target. QA3's signed compatibility range must include QA1.
Apply once and verify one direct QA1 → QA3 job and download, with no QA2 install.
Rollback must select the actual prior QA1 recovery point, not QA2 merely because
it precedes QA3 in the release list. Keep the previous-installer cache-miss check.
Do not mark this variant passed using a renamed QA2 artifact or a fixture-written
successful job/version. Source tests of release ordering are separate evidence.

## 6. Managed HTTPS on the VMware target

Prepare the declared TLS/DNS/certificate prerequisites and their recovery
baseline. Stop the development stack before running VMware on this workstation;
run them sequentially because of its memory limit.

21. In Configuration on the prepared target, apply the declared reversible HTTPS
    configuration through its visible action.
22. Observe progress and the resulting capability state. Reopen the block and
    compare the normalized saved configuration.
23. Correlate the changed TLS block with its configuration revision and, where
    the visible action creates work, its actual operation/job result. A saved
    value alone does not prove certificate provisioning or readiness.
24. Open the configured trusted HTTPS origin and confirm its actual certificate
    and connection. Restore the prior configuration and fixture-owned TLS state;
    verify the restored capability and retained Operator access. Then restore
    the target through its declared QA recovery procedure and verify cleanup.
    Record successful update, rollback, HTTPS and cleanup separately; none substitutes
    for the others.

Report: `OPERATOR-UPDATE-LIFECYCLE-001 done`.

## Original matrix coverage

| Source requirement | Owning checks |
| --- | --- |
| One prepared valid/compatible verified release | Block 1 |
| One durable update job and honest progress | Block 2 |
| Controlled restart, reconnect and correct active version | Block 2 step 6 and block 3 |
| No duplicate work after one Apply or reopening | Steps 4, 7 and 10 |
| Package/job/installed-version correlation and cleanup | Steps 7–11 and final restoration in step 24 |
| QA1 → QA2 → QA1, visible rollback and verified GitHub re-download on cache miss | Block 4, steps 12–17 |
| Disabled Apply/Rollback, visible progress, controlled failure and recovery | Steps 4, 14 and block 5, steps 18–20 |
| Managed HTTPS save/reopen, actual certificate/capability and restoration | Block 6, steps 21–24 |

## Execution boundary

The package/target fixture is prepared when this checkpoint starts. Blocks 4–5 are
explicit user-added acceptance coverage, not a statement that UI rollback or
automatic prior-artifact download already exists. Missing capability is an open
gap, never an inferred PASS. Prepare the versioned failure/cache-miss fixture
before executing those blocks. Other corruption, invalid-signature, arbitrary
downgrade and interruption permutations remain packaging regression coverage.
