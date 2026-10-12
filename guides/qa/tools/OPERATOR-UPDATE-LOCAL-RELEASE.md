# Local signed release source for Operator Update QA

The user-authorized local fixture replaces the remote release host for the
QA1 → QA2 → QA1 run. Both packages must be normal builds of the current source,
including rollback support. GitHub releases/tags/assets remain untouched.
This proves the updater against an emulated release source; it does not qualify
GitHub availability or authentication. The application still discovers, downloads,
verifies and installs the selected artifact through its normal HTTP/UI path.

## Prepare and serve

1. Build and sign QA1 and QA2 through the normal release tools. Retain each
   package identity and image manifest. Final stable version remains `1.0.0`.
2. Create a short-lived public TLS certificate with SAN matching the fixture
   host address. Keep its private key and the QA release-signing key outside
   the explicit asset catalog. Never publish either key.
3. Prepare a new fixture directory:

   ```bash
   python3 guides/qa/tools/operator-update-release-server.py prepare \
     --root /tmp/operator-release-fixture \
     --origin https://192.168.153.1:18445 \
     --release packaging/dist/local-rollback-qa1-20260916 \
     --release packaging/dist/local-rollback-qa2-20260916 \
     --key /path/outside/repository/qa-release-private.pem
   ```

   Preparation verifies package version, size and hash, and re-signs only the
   fixture metadata with local URLs. Package bytes and package signatures remain
   unchanged. Only the explicit package and signed-metadata routes are served;
   there is no directory listing or generic filesystem route.
4. Start one HTTPS server bound to the VMware host-only/NAT interface:

   ```bash
   python3 guides/qa/tools/operator-update-release-server.py serve \
     --root /tmp/operator-release-fixture --bind 192.168.153.1 \
     --certificate /path/to/public-fixture-cert.pem \
     --tls-key /path/to/private-fixture-tls-key.pem
   ```

   The VM's `localhost` is the VM itself. Use the actual reachable host address.
   The catalog is `/repos/fssrepository/myscoutee/releases`; signed metadata and
   package URLs retain the GitHub-compatible release-path shape.
5. Copy the public TLS certificate and `operator-update-source-fixture.py` to
   the designated QA VM. Run its `stage --origin ... --certificate ...` action
   as root. It snapshots only the three affected configuration lines, writes a
   public CA file and sets the normal production release-source settings. It
   neither installs packages nor creates update jobs/success state.
   For the template guest, pass `--package myscoutee-template`; the fixture uses
   that package's runtime group and host paths while retaining the container's
   existing certificate mount. A delegated test of an installed stable baseline
   requires `--expected-stable-version` matching its exact installed version.
6. Install the newly built QA1 baseline through the signed client installer.
   The installer records the actual installed package version/hash after host
   qualification. Do not fake a prior-package receipt for a historical install.
7. Use Updates in the managed Operator browser to apply QA2, then use its
   Rollback action to return to the retained QA1. Both releases must be present
   in this fixture. Compare the actual jobs, download logs, package hashes,
   installed images and retained data controls.

The source uses HTTPS with normal hostname verification. A configured public
CA is scoped to the update HTTP clients, including package download. The
independent Ed25519 release-signing trust key remains required. No TLS or
signature bypass is enabled. Production defaults remain GitHub and system TLS
trust when the overrides are absent.

## Controlled download failure

For the declared failure branch, restart only this fixture server with
`--fail-package-after-bytes 1048576`. It advertises the real package size but
closes the package response after1MiB. Metadata stays available. Use the normal
UI Apply once and require a failed durable staging job, no host install request,
unchanged installed package/data and enabled retry controls. Restart this server
without the cutoff to reset the trigger, then use the explicit UI retry. This
is external transport emulation, not an application failure/success override.

## Reset

On the VM run `operator-update-source-fixture.py reset`; it restores the three
original setting lines and removes only its unchanged public CA file. It refuses
to overwrite intervening changes. Restart the configured application to apply
restored settings. Stop only the fixture server process that was started for this
run. Retain evidence separately; remove the fixture directory only after the
campaign no longer needs its exact signed metadata. No user data backup/restore
is part of this fixture.


## Managed HTTPS fixture on the same disposable QA guest

Run `operator-update-tls-fixture.py stage` as root on the QA guest. It requires
an installed QA package and uses the existing bootstrap QA certificate as the
local trust anchor. It creates a seven-day `qa.localhost` server certificate
(with localhost SANs to retain the current tunnel), private input files and a
TLS-only restoration record under `/var/lib/myscoutee/qa-fixtures/update/tls`.
It does not apply TLS or create a successful job. Keep private inputs mode0600
and outside evidence/screenshots; the delegated browser harness supports
`fill-file` to enter them without putting key content in command arguments.

Apply Manual HTTPS through the visible Operator Configuration controls.
Correlate the real job, reopened settings and served certificate. Verify the
configured hostname externally with the retained CA and `curl --resolve`;
managed QA Chromium ignores certificate errors, so its page alone is not
certificate-trust evidence. This local-CA case does not prove public ACME issuance.

After the UI checks, use `operator-update-tls-fixture.py reset` on the guest.
It refuses an unrelated changed certificate/key, restores only the recorded
TLS files and six changed environment settings, and recreates nginx through
the packaged Compose wrapper. It does not restore MongoDB, MinIO or user data.
Verify the original HTTPS connection, Operator access and retained file hashes.


## Persistent dev Compose service

`server/docker-compose-dev.yml` starts `release-simulator` on the dev network,
with its host port restricted to `127.0.0.1:18445`. It runs this same HTTPS
catalog and package server. The existing `OPERATOR_UPDATE_RELEASE_API_ORIGIN`,
`OPERATOR_UPDATE_RELEASE_DOWNLOAD_ORIGIN`, `OPERATOR_UPDATE_TLS_CA_CERTIFICATE`
and `OPERATOR_UPDATE_RELEASE_PUBLIC_KEY_PATH` settings select the local source.
Production Compose and production defaults remain unchanged. No development
branch bypasses TLS, signed metadata or package-signature verification.

The development TLS certificate is generated once under the gitignored
`server/data/release-simulator/tls`. The catalog is persistent under
`server/data/release-simulator/catalog`. A new checkout starts with an empty
catalog, so development never falls back to GitHub when no local package exists.

To add actual locally built packages, stop only `release-simulator`, prepare a
new catalog directory with the existing tool's `prepare --copy-assets`, then
replace the previous local catalog after retaining any needed QA evidence.
Use `https://release-simulator:18445` as its origin. `--copy-assets` copies the
unchanged package bytes into the fixture and stores relative paths so the same
catalog works inside Docker. Supply the same external signing key that signed
the packages, and export only its public key to
`server/data/release-simulator/release-public-key.pem`. Never mount the release
signing private key into the service. Restart only `release-simulator` afterward.

For interrupted-download QA, set `RELEASE_SIMULATOR_FAIL_PACKAGE_AFTER_BYTES`
in the dev Compose environment and recreate only this service. The existing
fixture cuts the package response after that byte count while keeping metadata
available. Unset it and recreate that service to restore normal downloads.

The dev runtime does not install production packages on the development host.
Full install/rollback testing still uses the dedicated packaged QA guest.
