# QA prerelease deployment qualification

This is the reusable deployment and qualification method for a MyScoutee QA
prerelease candidate. It is a separate runtime boundary from manual pair QA:
deployment qualification never advances, resets, or supplies a manual-QA
verdict.

Candidate-specific measurements, limitations, and artifact digests belong in
the matching file under [`guides/releases`](README.md). Command-level options
for the external verifier and browser render check belong in
[`packaging/verify-deployment`](../../packaging/verify-deployment/README.md).
The broader production release gate, including upgrade, restore, load, and
security evidence, remains in
[`PRODUCTION_QUALIFICATION.md`](../plans/roadmap/PRODUCTION_QUALIFICATION.md).

## Candidate sequence

Use one immutable artifact set throughout the sequence:

1. Build the release artifacts once and record each SHA-256 digest.
2. Install or same-version reinstall the Debian package through the supported
   installer.
3. Run the installed package qualification and require every managed service,
   including the Explore payment simulator, to be healthy.
4. Run all 13 read-only external HTTP verifier checks with normal certificate
   validation and the expected package version.
5. Run the isolated read-only browser render check. Require HTTP 200, completed
   Angular rendering, matching build metadata, no uncaught exception, and no
   unexpected browser error. This check never replaces or drives pair QA.
6. Run the automated UI deployment smoke below against the installed normal
   application, using a newly registered non-demo account. Retain its own
   deployment evidence; do not update the pair-QA matrix from this result.
7. Run pair QA against the selected application candidate. If source or bundled
   release tooling changes afterward, rebuild and requalify the final artifact
   set instead of reusing earlier results.
8. Tag the selected commit, then create the GitHub Release and attach only the
   package, Operator client-tools archive, and checksum sidecars qualified for
   that exact tagged release.

A local build or an installed candidate is not itself a release.

Use the numbered [environment parity checklist](../qualification/ENVIRONMENT_PARITY_CHECKLIST.md)
to compare DEV, E2E, KVM and installed inputs and their resulting runtime state.
Fix installation defects in the versioned source/installer/migrations; never
repair the installed database directly to make qualification pass.

## Packaging gate before release

The local VMware deployment is the preproduction environment for these checks.
Review every checkpoint against the exact candidate before publishing it for
production use. Packaging success alone is not approval to release. Record
PASS, FAIL, BLOCKED or NOT RUN with evidence; unresolved checkpoints stay open.

Update and package rollback preserve live data in place. They do not take a
full database/media backup or restore an earlier dataset. The optional standalone
backup/restore tools are not an update prerequisite. Package-owned static data
may change even when it lives in MongoDB or MinIO; storage location alone does
not determine ownership.

| Checkpoint | Required check | Evidence |
| --- | --- | --- |
| P01 — Candidate identity | Package version, source revision, image identities, checksums and signatures agree | Exact artifact manifest and signature verification |
| P02 — Data change inventory | List every changed packaged seed, static media item and migration; compare with the source release | Completed change table below, including explicit `none` when no migrations exist |
| P03 — Ownership boundary | Static updates affect only their declared package-owned records/fields/object keys; existing operator overrides and user data survive | Installer/seed review and focused boundary tests |
| P04 — Install and upgrade | Apply the actual package on VMware; verify versions, services and retained record/media/settings controls | Installer logs and before/after assertions, without copying full user datasets |
| P05 — Rollback and failure | Return to the actual previous application version; preserve user data created both before and after upgrade; verify interruption/progress behavior | Operator Update lifecycle evidence for this candidate |
| P06 — Deployment qualification | Complete readiness and UI/image smoke; preserve owned smoke records across upgrade | Deployment record below |

### Candidate data change inventory

Fill this table for the source-to-target package transition **before installation**.
List exact collection + record/field identities or object paths, operation and
ownership. If a script touches existing user data, indexes, schema or meaning,
classify it as a migration, record its compatibility/rollback behavior and test
it on VMware before release. Do not silently classify it as a seed refresh.
An unexpected write or an unclassified change fails P02/P03 until reviewed.

| Collection / file / object key | Source → target change | Ownership | Operation | Migration and rollback compatibility | VMware evidence |
| --- | --- | --- | --- | --- | --- |
| QA2 monitor-r7: `004-deployment-configuration.js` | Added | Operator-managed singleton | Only schemaVersion3→4 and optimistic document version+1; all values retained | Current-source QA1/QA2 both accept schema4; older schema3-only binaries excluded | Isolated real-Mongo preservation/idempotency/rejection PASS; native QA1 r6→QA2 r7 migration and exact planned preservation hash PASS. No further rollback replay per user; source QA1 schema4 compatibility only after this migration |

Use the existing package-content, demo-reset, i18n seed-sync, Debian lifecycle
and update-worker checks for their respective boundaries. Those source checks
support P03; they do not replace P04/P05 on the installed candidate. A candidate
change invalidates the affected evidence and requires those checkpoints again.

## Repeatable deployment record

Deployment and UI smoke belong to one deployment qualification run, separate
from the pair-QA matrix. Security, startup and memory efficiency belong to the
independent [security and infrastructure campaign](../qualification/SECURITY_AND_INFRASTRUCTURE.md). Copy this
small table into each candidate's release evidence and record the artifact
digest, target, run time and versioned fixture/runner revision above it.

| Check | Repeatable scope | Status | Evidence / next action |
| --- | --- | --- | --- |
| Deployment | Install/reinstall, retained production controls, service readiness and external HTTP/render checks | NOT RUN | Record installer and verifier results |
| UI smoke | Normal-account registration and profile update with images; Event and Asset creation, list and detail images | NOT RUN | Record browser actions, rendered results and owned records |
| Cleanup | Restore fixture-owned configuration; remove only run-owned data and verify unrelated controls | NOT RUN | Record restoration and remaining retained evidence |

Retain the smoke-owned profile, Event, Asset and media as upgrade controls. After
the upcoming release update, verify their saved values and image content against
the fixture baseline before cleanup. A later unrelated Borrow test does not
invalidate a proven registration; rerun only affected smoke behavior.

Run readiness and retained-data checks for each deployment qualification. Use PASS, FAIL, BLOCKED or
NOT RUN with evidence; a previous candidate's result is not the current result.
Keep versioned test definitions, fixture setup/status/reset and executable
assertions in the repository. Create the required deployment-owned fixture and
runner before the first execution; documenting this contract does not mean those
scripts already exist. Fixtures use unique run ownership, controlled accounts,
objects and uploads, explicit expected outcomes and cleanup. They prepare
prerequisites without substituting for the UI actions being tested. Keep credentials and target-specific
secrets outside version control, and redact retained evidence.

## Dependency maintenance boundary

Angular and other package upgrades belong to a separate maintenance process.
Keep the release candidate's dependency versions and lockfiles stable during
qualification; do not combine routine upgrades with deployment, smoke, security
or infrastructure optimization. Assess security findings against the installed
versions and record any required remediation. A confirmed dependency issue that
blocks release is a tracked release blocker, not permission for a broad upgrade.
Any accepted dependency change produces a new candidate that must be qualified
again with the affected regression checks.

## Automated UI deployment smoke

For VMware installation qualification, Codex executes this short browser journey
through the installed application's real forms and controls. This is automated
deployment smoke, not user-operated pair QA, and it is outside the QA matrix.
Use the normal application and a newly registered non-demo user; do not substitute
an Explore/demo identity, seeded account, API-created record or database write
for a tested UI action.

1. Register through the UI with a profile image. Verify successful sign-in and
   the rendered image on the resulting profile.
2. Update that profile through the UI, including an image change. Reopen the
   profile and verify the saved fields and new image.
3. Create an Event through the UI with an image. Find it in the Event list and
   reopen it; verify the saved content and image on both surfaces.
4. Create an Asset through the UI with an image. Find it in the Asset list and
   reopen it; verify the saved content and image on both surfaces.

Any required Firebase configuration is prepared by a deployment-owned smoke
fixture before the journey. That fixture provides prerequisites, not the account,
profile update, Event or Asset outcomes being tested. Keep secrets in the local
deployment configuration. Scope fixture changes and cleanup to smoke-owned data
and retain the original configuration for restoration; preserve unrelated users
and uploads. Record the installed version, target, UI results, media rendering,
owned records and cleanup in deployment evidence. A read-only render check or
successful HTTP response alone does not prove this smoke journey.

## Pair-QA boundary

A package installation or deployment qualification performed while pair QA is
paused must not rewrite the active QA checkpoint. On return, use the checkpoint
handoff's read-only resume gate. Continue from the persisted fixture oracle;
never infer that deployment success also proves or replaces manual-QA state.

If installation reset a not-yet-run fixture, keep already-recorded historical
evidence unchanged, stage that active fixture exactly once through its
versioned harness, and require its read-only baseline proof before the next
manual action.

## Target-specific transport

For the local VMware node, use only the canonical loopback forwards
`localhost:80 -> VM:80` and `localhost:443 -> VM:443`. Extend Node trust with
the exported public localhost bootstrap certificate for the HTTP verifier;
never disable TLS verification. The isolated browser render check may use its
loopback-only bootstrap-certificate option and must report the expected Service
Worker TLS diagnostic separately from unexpected errors.

For an Aruba or other Internet-hosted node, run the same qualification directly
against its public HTTPS origin. Do not use the VMware tunnel or the localhost
certificate option. DNS, the public certificate chain, hostname, and HSTS must
validate normally. Target addresses, credentials, and access details belong in
ignored local operator configuration, never in source control or release notes.

## Installed data boundary

The packaged Explore database is deliberately disposable. Every successful
install or reinstall rebuilds exactly `demo_db` from the current packaged seed
and refreshes only the package-owned `images/demo-assets`, `images/demo-events`,
and `images/demo-profiles` MinIO prefixes. The destructive path must be guarded
to the literal demo database, rejected when the configured production database
has the same name, and retain its retry marker until Mongo import, MinIO seed,
and the demo oracle all succeed.

Production data has the opposite contract. Install and reinstall preserve the
production database and operator/user uploads byte-for-byte except for an
explicit versioned migration or narrowly allow-listed system-seed sync. Capture
a read-only production control snapshot before the release replay and prove it
unchanged afterward, independently from the clean demo oracle. Never generalize
the demo reset helper into a caller-selected database drop or clear the complete
MinIO volume to refresh demo media.
