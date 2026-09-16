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
