# MyScoutee Operator client tools

These release-packaged client-side wrappers manage a Debian deployment. They do not contain
application installation policy: host qualification and diagnostics are
commands shipped by the installed package.

## Configure

```bash
cp install.env.example install.env
chmod 0600 install.env
```

Set `REMOTE_HOST`, `REMOTE_USER`, and either `REMOTE_KEY_FILE` or
`REMOTE_PASSWORD`. `install.env` is local secret input and must never be
committed or included in a release.

## Install or reinstall

```bash
./install.sh /path/to/myscoutee_1.0.0_amd64.deb
```

The wrapper validates the package name and version, uploads it, then calls the
package-provided `qualify-deployment.sh`. Fresh installs and version changes
use APT. An already installed copy of the same version is unpacked over the
existing payload, then configured with APT dependency repair and
`--no-remove`; it is never removed first.

For a GitHub Release, download the DEB, `myscoutee-release_<version>.json`, and
the release public key. Configure `RELEASE_MANIFEST_PATH`,
`RELEASE_PUBLIC_KEY_PATH`, and the complete
`RELEASE_PUBLIC_KEY_FINGERPRINT=sha256:<64 hex>` obtained through an
independent channel. `install.sh` verifies the size, SHA-256, canonical
Ed25519 signatures, key ID, package identity, and full trusted-key fingerprint
before uploading anything.

The release public key shipped next to an artifact does not establish its own
trust. Do not copy the fingerprint from the same GitHub Release page as the
only verification step.

A package built directly from a trusted local checkout has no release
signature. It can be installed only with the explicit local configuration:

```text
ALLOW_UNSIGNED_LOCAL_PACKAGE=true
```

Never use that override for a downloaded or published artifact.

## Verify the deployment

Deployment transport and browser-facing integrity must be tested from the
client, after installation:

```bash
node verify-deployment/run.mjs \
  --url https://deployment.example \
  --expected-version 1.0.0
```

The helper archive published beside the DEB includes this read-only deployment
verifier. It validates normal TLS trust and has no insecure mode.

## SSH tunnel

```bash
sudo -E ./forward-localhost.sh
```

The default forwards bind only local loopback:

```text
127.0.0.1:80  -> remote 127.0.0.1:80
127.0.0.1:443 -> remote 127.0.0.1:443
```

To avoid privileged local ports, use an explicit one-shot mapping:

```bash
LOCAL_FORWARD_PORTS_OVERRIDE=18080:80,18443:443 \
  ./forward-localhost.sh
```

Then deployment verification can run through the high-port tunnel:

```bash
NODE_EXTRA_CA_CERTS=/path/to/deployment-bootstrap-ca.pem \
  node verify-deployment/run.mjs \
    --url https://localhost:18443 \
    --expected-version 1.0.0
```

The custom HTTPS port intentionally leaves out `--http-url`: the production
HTTP redirect targets the deployment's canonical HTTPS origin, not the
client-side remapped port. The HTTPS, frontend, backend, i18n, and anonymous
Operator-boundary checks still run; the three HTTP-listener checks are skipped.

## Explicit purge

```bash
./purge.sh
```

This invokes `apt-get purge myscoutee` remotely. Package lifecycle scripts own
the scoped Compose, volume, image, configuration, and state cleanup. Backups
under `/var/backups/myscoutee` remain outside the purge contract.

## Installed host commands

The Debian package installs operational commands under:

```text
/opt/myscoutee/packaging/scripts/
```

The main entry points are:

- `status-production.sh`
- `doctor-production.sh`
- `qualify-deployment.sh`
- `deployment-diagnostics.sh`
- `backup-production.sh`
- `restore-production.sh`
- `start-production.sh`
- `stop-production.sh`

The package `postinst` never runs deployment qualification or public smoke
automatically.
