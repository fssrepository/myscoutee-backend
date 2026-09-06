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
6. Run pair QA against the selected application candidate. If source or bundled
   release tooling changes afterward, rebuild and requalify the final artifact
   set instead of reusing earlier results.
7. Tag the selected commit, then create the GitHub Release and attach only the
   package, Operator client-tools archive, and checksum sidecars qualified for
   that exact tagged release.

A local build or an installed candidate is not itself a release.

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
