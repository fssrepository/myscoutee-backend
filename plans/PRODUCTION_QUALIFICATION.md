# MyScoutee production qualification

Production qualification is evidence for one immutable release candidate, not
a synonym for passing source tests. The candidate consists of:

- one MyScoutee Debian package;
- the exact API, nginx, MinIO, and Explore-registry image IDs/digests embedded
  by that package;
- the oldest Debian package that this release promises to upgrade;
- the backend and registry source commits;
- the Mongo and SQLite schema versions reached after installation.

Phase 9 is complete for a release only when the automated gates and the
host-changing/external drills below have evidence for those same artifacts.

## Compatibility record

Create one record per supported transition. Do not write `latest` in this
table or substitute a source-built artifact after a candidate has been signed.

| Field | Required value |
| --- | --- |
| source version | exact installed Debian version and SHA-256 |
| target version | exact candidate Debian version and SHA-256 |
| architecture | Debian architecture and host architecture |
| managed images | exact image ID and bundled archive SHA-256 for every image; repository digest when one exists |
| Java/Go protocol | accepted protocol version and registry scope |
| Mongo/SQLite | before/after schema or migration version |
| host | distribution, kernel, filesystem, Docker and Compose versions |
| result | command, timestamps, duration, PASS/FAIL, evidence location |

The candidate package and oldest-supported package must have the same package
name and architecture, and the candidate version must be strictly newer.

## Artifact preflight

The read-only preflight checks exact package identity/version ordering, audits
the extracted candidate for embedded external credentials, binds every
managed image ID to its bundled archive and archive SHA-256, verifies the
installed version marker and isolated Explore Compose contract, and inspects
the exact registry image runtime boundary.

```bash
MYSCOUTEE_QUALIFICATION_EVIDENCE_DIR=/absolute/evidence/1.2.0 \
  bash packaging/scripts/qualify-release-artifacts.sh \
    /absolute/myscoutee_1.2.0_amd64.deb \
    /absolute/myscoutee_1.0.0_amd64.deb \
    myscoutee-registry:1.2.0-prod
```

It writes `release-artifact-evidence.json`. External drills deliberately
remain `OPEN`; this command never installs a package, starts a service, or
pretends that an archive inspection proves an upgrade or restore.

## Automated source and protocol gates

Run these sequentially on a quiet qualification host:

```bash
bash packaging/tests/operator-bootstrap-test.sh
bash packaging/tests/nginx-transport-policy-test.sh
bash packaging/tests/package-content-test.sh
bash packaging/tests/debian-removal-contract-test.sh
bash packaging/tests/registry-packaging-test.sh
bash packaging/tests/update-worker-test.sh

cd server
./gradlew --no-daemon test

cd ../../myscoutee-registry
go test ./...
go test -race ./...
go test -tags=e2e -count=1 -v ./e2e
go vet ./...
./scripts/qualify-java-rails.sh
```

The complete Java and Go suites are mandatory at the end of qualification,
even when a narrower rail test has already passed. The tagged registry E2E
suite starts disposable loopback processes and proves two simultaneously
running registries keep distinct scopes, signing identities, SQLite files,
receipts, and ledger state. It does not prove public TLS routing.

The packaging contract tests cover the update worker's signed request
boundary, durable progress, interruption reconciliation, complete pre-update
backup requirement, guarded Mongo/key/registry restore, and failure behavior.
They use isolated fixtures; they are not a replacement for the candidate
package drill.

## Oldest-supported upgrade, interruption, and restore drill

Perform this on a disposable host or VM that matches a supported production
topology. Preserve console logs and files as evidence.

1. Install the exact oldest-supported package from the compatibility record.
2. Configure only synthetic operator/provider data. Register the deployment
   against a qualification registry and submit at least one signed QMAU and
   revenue record.
3. Create a complete production backup. Verify its manifest, mode, checksum,
   Mongo archive, MinIO data, configuration encryption key, and the matching
   deployment key plus registry state/receipts.
4. Upgrade through the signed Operator update rail to the exact candidate.
   Verify package version, managed image IDs, health checks, preserved
   operator access, deployment identity, receipts, provider configuration,
   Mongo data, and SQLite/Java migrations.
5. Repeat from a clean oldest-supported installation and interrupt each
   release-defined boundary: before download completion, after accepted
   request, during package installation, and after installation before final
   health confirmation. Restart the host. Every job must reconcile to an
   accurate terminal state; ambiguous partial installation must become
   `RECOVERY_REQUIRED`, never a false success.
6. Restore the recorded pre-update backup to a clean host. Restore Mongo and
   its operator-configuration key as one unit, and restore a deployment key
   only with its matching registry state and receipts. Verify every signed
   registry record before enabling outbound synchronization.
7. Re-run the upgrade without interruption and record the final PASS/FAIL.

Do not use a developer database, personal provider credential, real customer
record, or production registry for this drill. A power-loss drill is valid
only when the host/VM is actually stopped at the boundary; killing a browser
or closing the Operator popup is not equivalent.

## Public multi-registry isolation

The automated Go E2E test proves process/database/key/scope isolation locally.
The release drill must additionally use at least two independently hosted
registries with:

- different public TLS endpoints and certificate chains;
- different scopes, signing keys, SQLite files, volumes, and backup locations;
- separate rate-limit and audit evidence;
- explicit deactivation at the old registry before registering at another.

Verify that a request signed for registry A is rejected by registry B, an A
receipt cannot be read from B, and an outage or restore of either registry
does not affect the other. Certificate renewal must preserve the registry
signing identity; replacing a TLS certificate must not silently replace the
registry trust anchor.

## Load evidence

Do not invent a universal throughput number. Before a release drill, record
the intended maximum deployments, commitments per deployment/period,
submission cadence, leaderboard page size/concurrency, proof reads,
announcement reads, retention, and host size. The test must cover:

- sustained signed QMAU/revenue ingestion at the declared steady rate;
- a bounded retry burst after a registry outage;
- concurrent cursor leaderboard and Merkle proof reads;
- restart and checkpoint work while ordinary traffic continues;
- latency percentiles, throughput, errors/retries, CPU, RSS, disk growth,
  SQLite lock time, and backup duration.

The test passes only against explicit release-specific limits and with no lost
accepted record, duplicate accounting, invalid receipt, unbounded memory/disk
growth, or integrity latch. Source microbenchmarks may guide engineering but
do not qualify the release topology.

## Security evidence

Automated tests cover canonical signing, replay/idempotency, strict JSON,
scope separation, key/database binding, package credential audit, update
signature verification, unsafe path rejection, immutable ledger checks, and
Merkle proofs. Independent review must still cover:

- deployment, registry, update, backup, Mongo/MinIO, Firebase, and provider key
  custody and rotation;
- TLS policy/renewal, reverse proxy limits, request size/rate limits, and
  denial-of-service behavior;
- `.deb`, nested image, update URL, checksum, signature, and privileged-worker
  boundaries;
- SQLite corruption, rollback, restore, CLI access, and audit-log retention;
- global-identity privacy/threat assumptions and offline guessing exposure;
- claim, ownership-transfer, dispute, suspension, and exit evidence controls.

Record findings, severity, owner, remediation commit/artifact, retest, and
accepted residual risk. An unchecked box is not a pass.

## Release decision

Store artifact hashes, image IDs/digests, manifests, commands, logs, timings,
host metadata, and reviewer decisions together. A release remains
`NOT QUALIFIED` while any required matrix row, external drill, load limit, or
security finding is open. Source tests passing is necessary but not sufficient.
