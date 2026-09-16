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

## Repeatable deployment record

Deployment, UI smoke, external security and infrastructure efficiency belong to
one deployment qualification run, separate from the pair-QA matrix. Copy this
small table into each candidate's release evidence and record the artifact
digest, target, run time and versioned fixture/runner revision above it.

| Check | Repeatable scope | Status | Evidence / next action |
| --- | --- | --- | --- |
| Deployment | Install/reinstall, retained production controls, service readiness and external HTTP/render checks | NOT RUN | Record installer and verifier results |
| UI smoke | Normal-account registration and profile update with images; Event and Asset creation, list and detail images | NOT RUN | Record browser actions, rendered results and owned records |
| External security | Versioned access/session/role/input/upload/exposure probes from outside the VM | NOT RUN | Record fixture identities, redacted assertions, findings and retests |
| Infrastructure efficiency | Startup/readiness, peak and idle memory, smoke workload, CPU/I/O and startup-script overhead | NOT RUN | Compare with the retained baseline for the same resources/workload |
| Cleanup | Restore fixture-owned configuration; remove only run-owned data and verify unrelated controls | NOT RUN | Record restoration and remaining retained evidence |

Run these checks for every deployment qualification. Use PASS, FAIL, BLOCKED or
NOT RUN with evidence; a previous candidate's result is not the current result.
Keep versioned test definitions, fixture setup/status/reset and executable
assertions in the repository. Create the required deployment-owned fixture and
runner before the first execution; documenting this contract does not mean those
scripts already exist. Fixtures use unique run ownership, controlled accounts,
objects and uploads, explicit expected outcomes and cleanup. They prepare
prerequisites without substituting for the UI actions being tested. Security
checks are a repeatable suite, not only an ad hoc inspection; turn each confirmed
new finding into a focused regression probe. Keep credentials and target-specific
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

## Production infrastructure efficiency alongside smoke

Alongside production-mode deployment smoke, investigate **resource efficiency**:
smaller memory footprint and less unnecessary CPU, I/O and startup work. Reuse
the already established E2E speedup evidence; this is not a repeat of that speed
comparison or a separate application-latency campaign. Record the installed
artifact, VM resources, Java runtime/version and service configuration so each
comparison uses the same workload and readiness definition.

- Measure time from service start to usable application readiness, including
  health checks and a successful rendered application request. Separate this
  from package installation time and identify slow startup phases/scripts.
- Record per-service/container memory at startup peak, idle readiness and during
  the UI smoke. Include JVM heap/non-heap and process/container memory where
  available; an allocated heap limit alone is not measured memory consumption.
- Inspect installation/startup scripts for repeated work, unnecessary waits,
  serial independent work and avoidable process or I/O overhead.
- Prefer changes that reduce resource waste while preserving the proven
  behavior. Report resource tradeoffs explicitly; a faster start achieved by
  substantially higher memory/CPU usage is not automatically more efficient.
- Consider a different supported Java runtime or JVM configuration when measured
  evidence justifies it. Compare startup, memory and smoke correctness against
  the retained baseline; do not replace the runtime merely on an assumption.
- Re-run readiness and the automated UI/media smoke after an optimization.
  Report before/after measurements, compatibility constraints and any remaining
  bottleneck in deployment qualification evidence, outside the pair-QA matrix.

This is a scoped deployment investigation, not authorization to change the
running QA stack or deploy a new runtime during an unrelated application test.

Include server-side code when profiling identifies substantial avoidable work,
such as repeated database reads, allocation pressure or redundant startup work.
Implement high-impact improvements supported by measurements, then compare the
same workload and verify affected behavior plus readiness/UI smoke. Keep each
change scoped to the measured cause; routine dependency upgrades remain under
the separate maintenance process above.

Record smaller, uncertain or deferred improvements in the candidate's table:

| Improvement / measured cause | Priority | Expected benefit and evidence | Effort / risk | Decision | Before / after |
| --- | --- | --- | --- | --- | --- |
| Populate from deployment measurements | Unassigned | Mark estimates separately from measurements | To assess | Pending investigation | NOT MEASURED |

Use P1 for substantial measured waste worth addressing in this qualification,
P2 for useful optional follow-up and P3 for low-impact work. Implement the P1
items within the qualified scope; retain P2/P3 items for later work rather than
expanding the release effort. A release-blocking correctness or security defect
is tracked as a blocker, not deferred as an optional optimization.

## External security investigation alongside deployment smoke

The user explicitly requests an adversarial security investigation of the
project's VMware production-mode deployment from outside the VM. Run against
the designated installed application origin and exposed services, using a
separate client. Record the client/network vantage point; access through a
workstation tunnel does not prove Internet-facing reachability or protection.

Use the smoke-owned accounts and records to test unauthenticated access,
cross-account object access, role/admin authorization, session boundaries,
API input handling, upload/media access and file paths. Inspect exposed debug,
management and backup/configuration surfaces for unintended access or secret
disclosure. Verify transport and cookie/header behavior on the actual deployed
origin. Keep probes confined to the designated deployment and controlled data;
preserve unrelated users/uploads and service availability.

Retain reproducible requests and minimally necessary redacted evidence for each
finding. Repair confirmed leaks at their owning boundary and replay the failing
probe plus affected smoke steps. Record covered attack surfaces, findings,
fixes, retests and untested boundaries in deployment security evidence, outside
the pair-QA matrix. Do not describe a passing finite probe set as proof that no
vulnerability exists. This authorization is queued for deployment qualification;
it does not start a deployment or an external scan during application QA.

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
