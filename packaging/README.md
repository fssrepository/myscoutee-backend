# MyScoutee Packaging

This folder is the root-level packaging workspace for production deploys. It is separate from the dev Docker setup so dev hot reload, workspace mounts, e2e mode, and demo helpers can keep their current behavior.

## Current Scope

The current packaging path builds and runs the production Docker stack from the existing repo layout:

- nginx production image with baked frontend assets
- backend production image with the jar under `/app`
- MongoDB
- Redis
- MinIO

It intentionally does not add Java, Mongo, or Redis memory caps. Optional small/medium/large presets can be added later as explicit production profiles.

## Scripts

Run from the repo root:

```bash
bash packaging/scripts/build-production.sh
bash packaging/scripts/start-production.sh
bash packaging/scripts/status-production.sh
bash packaging/scripts/stop-production.sh
bash packaging/scripts/backup-production.sh
bash packaging/scripts/package-production.sh
bash packaging/scripts/smoke-mongo-compatibility.sh
```

Useful overrides:

```bash
MYSCOUTEE_VERSION=1.0.0 bash packaging/scripts/build-production.sh
BUILD_FRONTEND=false bash packaging/scripts/build-production.sh
BUILD_BACKEND=false bash packaging/scripts/build-production.sh
BUILD_IMAGES=false bash packaging/scripts/build-production.sh
BUILD_ARTIFACTS=false PACKAGE_IMAGES=false \
  ALLOW_UNBUNDLED_IMAGES_FOR_TESTS=true \
  bash packaging/scripts/package-production.sh
```

`package-production.sh` creates `packaging/dist/myscoutee_<version>_amd64.deb`. By default it builds production artifacts and packages the MyScoutee nginx/API images. During install, `postinst` checks Docker and prepares MongoDB, Redis, and MinIO images by pulling them if they are missing. Set `PACKAGE_OFFICIAL_IMAGES=true` only when you want a larger offline-style bundle that also includes those official service image archives.

`MYSCOUTEE_VERSION` is always the plain SemVer core (`1.0.0`). Image purpose
is expressed once in the derived tags (`1.0.0-base`, `1.0.0-dev`, and
`1.0.0-prod`); do not use `1.0.0-prod` as the package/base version.

MongoDB is pinned to `mongo:8.0.4` for the packaged and dev stacks. Run `smoke-mongo-compatibility.sh` against a running stack to confirm the configured image, running Mongo version, feature compatibility version, backend health, landing content query, and a temporary app-user CRUD round trip all work on Mongo 8.0.

Install the local deb with `apt`, not `dpkg`, so Docker Engine and Docker Compose dependencies are installed before MyScoutee is configured:

```bash
sudo apt install ./packaging/dist/myscoutee_1.0.0_amd64.deb
```

## Operator-approved package updates

An `UPDATE` announcement only tells the authenticated Operator workspace that
a release is available. It never installs anything automatically. The
operator must open the update action, review the version, channel, artifact
URL, size, SHA-256 digest, and signing-key ID, and explicitly approve the
download and installation.

The Java backend is the unprivileged control plane. It downloads the exact
HTTPS artifact named by the registry-signed manifest, enforces the configured
size limit, verifies its SHA-256 digest and separately pinned Ed25519 package
signature, and stages it under:

```text
/var/lib/myscoutee/update/staging/<job-id>/
```

Java records the `CHECKING` and `DOWNLOADING` states in that staging directory,
then atomically publishes a fixed-schema JSON request under:

```text
/var/lib/myscoutee/update/requests/
```

Those are the container paths. They map to the fixed host inbox paths
`/var/lib/myscoutee/update/inbox/staging` and
`/var/lib/myscoutee/update/inbox/requests`. The JSON contains only the fixed
relative artifact name `myscoutee.deb`; it cannot supply a host path.

The local `myscoutee-update.path` unit watches whether the request directory is
non-empty and starts the root-only `myscoutee-update.service` for any entry,
including malformed names and hidden files. This worker accepts no URL and no
shell command. It first atomically claims every inbox entry into a root-only
processing directory, quarantining anything that is not a valid request. A
packaged Python helper opens each source path component with directory file
descriptors and `O_NOFOLLOW`, then performs a bounded, mutation-detecting copy.
The worker independently checks the package name, plain SemVer, architecture,
size, digest, release-signing key ID, signature, bundled-image manifest, and
cache capacity before requiring a complete production backup and calling
`apt-get install` on the local `.deb`. Managed compose services use
`pull_policy: never`; after restart the worker verifies every running managed
container has the exact packaged image reference and image ID and reports
healthy.

Install the vendor release-signing public key only after checking its full
SPKI DER fingerprint through an independent channel:

```bash
sudo install -o root -g 10001 -m 0640 release-public-key.pem \
  /etc/myscoutee/update/release-public-key.pem
```

Then set the host execution gate in `/etc/myscoutee/myscoutee.env`:

```bash
MYSCOUTEE_UPDATE_ENABLED=true
```

`MYSCOUTEE_UPDATE_STAGING_SAFETY_RESERVE_BYTES` is the free-space reserve Java
requires before downloading into the shared staging directory.
`MYSCOUTEE_UPDATE_MIN_FREE_BYTES` is the independent reserve the privileged
worker requires before copying into its root-owned cache. Both default to
512 MiB in addition to the signed artifact size.
`MYSCOUTEE_UPDATE_CACHE_RETENTION_JOBS` bounds retained package caches and
defaults to two jobs.

Restart the path watcher after changing host update configuration:

```bash
sudo systemctl restart myscoutee-update.path
```

The package-signature message is deliberately independent from the
announcement and registry signing keys. It is the following UTF-8 text,
including the final newline:

```text
myscoutee-release-package-v1
<release-version>
<channel>
<artifact-size-as-base-10>
<artifact-sha256-with-sha256-prefix>
```

The package key ID is
`pkey_<first 32 lowercase hex characters of SHA-256(complete Ed25519 SPKI DER)>`.
The detached signature is canonical padded RFC 4648 base64. The release
private key must never be installed on an application deployment or registry
server.

Progress is durable and reconnectable. Once the privileged worker accepts a
request, its state supersedes the Java staging state and is available at:

```text
/var/lib/myscoutee/update/runtime/jobs/<job-id>/status.json
/var/lib/myscoutee/update/runtime/jobs/<job-id>/events.ndjson
/var/lib/myscoutee/update/runtime/jobs/<job-id>/install.log
```

Accepted request evidence is copied to
`/var/log/myscoutee/update/<job-id>/request.json`. Completed, failed, and
rejected request files are retained under the corresponding root-only
subdirectory of `/var/lib/myscoutee/update/archive/`. A crash never leaves an
accepted job indefinitely nonterminal: it is reconciled only when the exact
requested package and images can be proved active, otherwise it ends as
`RECOVERY_REQUIRED`. A failed install does not silently restore old data;
recovery remains an explicit audited operator action:

```bash
sudo journalctl -u myscoutee-update.service
sudo cat /var/lib/myscoutee/update/runtime/jobs/<job-id>/status.json
sudo cat /var/lib/myscoutee/update/runtime/jobs/<job-id>/install.log
sudo CONFIRM_RESTORE=true \
  /opt/myscoutee/packaging/scripts/restore-production.sh \
  /var/backups/myscoutee/<recorded-backup>.tar.gz
```

The worker contract, signature verification, progress journal, unsafe path
rejection, and tamper rejection can be tested without starting the dev stack:

```bash
bash packaging/tests/update-worker-test.sh
bash packaging/tests/package-content-test.sh
```

## Deployment Registry Identity

Package installation does not create a node identity, select a registry, or
make a registry request. A new installation starts in the
`installed/uninitialized` state.

The normal product workflow is owned by the authenticated local operator
workspace. Its Java API will inspect the operator-selected registry, show its
signed public identity, and only after explicit confirmation initialize the
node once and show the node's public fingerprint. The packaged shell utility is
retained only for development, recovery, and milestone-1 protocol testing:

```bash
sudo /opt/myscoutee/packaging/scripts/ensure-deployment-identity.sh
```

After node initialization, the Ed25519 identity is stored at:

```text
/etc/myscoutee/registry/deployment-private-key.pem
/etc/myscoutee/registry/deployment-public-key.der
```

The private key is PKCS#8 PEM with mode `0600`. The public key is X.509
SubjectPublicKeyInfo DER. The root-only key directory is mounted writable in
the backend container solely so the explicit operator action can publish a new
key pair. The initializer uses atomic create-new publication, rejects symlinks,
mismatches, private-key loss, and any identity loss after registry state
exists, and never rotates a complete existing pair. It can recover only the
public-only, state-free footprint left if power is lost during initial
publication. This writable mount is a necessary privilege: compromise of the
backend process would also expose its deployment private key, so the directory
must not be shared with other services.

The Java backend is the only registry network client. It registers the public
key, submits the signed installation-test batch, verifies central receipts,
and retries temporary failures without making the local application
unavailable. Its durable state is stored under:

```text
/var/lib/myscoutee/registry/deployment-state.json
/var/lib/myscoutee/registry/receipts/
```

Registry defaults live in `/etc/myscoutee/myscoutee.env`:

```bash
REGISTRY_ENABLED=false
REGISTRY_OUTBOUND_ALLOWED=false
REGISTRY_OPERATOR_REGISTRATION_CONFIRMED=false
REGISTRY_BASE_URL=
REGISTRY_SCOPE=
REGISTRY_CONNECT_TIMEOUT=5s
REGISTRY_REQUEST_TIMEOUT=15s
REGISTRY_RETRY_DELAY=15m
REGISTRY_MAX_RESPONSE_BYTES=1048576
REGISTRY_EXPECTED_KEY_FINGERPRINT=
REGISTRY_TRUST_ON_FIRST_USE=false
REGISTRY_ALLOW_INSECURE_HTTP=false
REGISTRY_INSECURE_HTTP_ALLOWED_HOSTS=
```

`REGISTRY_OUTBOUND_ALLOWED` is the host-level production egress kill switch.
The Operator UI cannot override it. `REGISTRY_ENABLED` and
`REGISTRY_OPERATOR_REGISTRATION_CONFIRMED` are retained only for compatibility
with explicitly invoked recovery/protocol operations; they do not start a
background enrollment service. In the normal workflow, the authenticated
two-phase Operator confirmation stored in Mongo supplies the enable/consent
state while the host outbound policy still has to allow the call.

No parent or region is built into these defaults. The operator may select any
compatible registry deployment. The prepare step reads and displays its scope,
signing identity, and endpoint without creating a deployment; the confirmation
step pins that identity and enables the atomic/idempotent registration request.

The production landing page still offers Explore mode, including a sample
Operator workspace. That demo session is intentionally non-persistent registry
sample state: it does not create keys, contact a registry, register a
deployment, or write a ledger. The production package does not contain or
start a demo Go registry image. Only an authenticated production Operator can
use the real workflow above, and its selected central registry must be an
independently deployed HTTPS service.

Set `OPERATOR_USER` in `/etc/myscoutee/myscoutee.env` to the comma-separated
Firebase email addresses that may enter the real Operator workspace. This is
independent from `ADMIN_USER`; admin authority does not imply operator
authority.

The source development stack is different by design: its canonical
`cd server && docker compose up --build` command includes a real isolated Go
registry so the complete Operator protocol can be tested against `demo_db`.
That development registry's SQLite/signing key and Java client identity/state
are separate from all production paths and are excluded from production
backup/restore and purge semantics.

Plain HTTP is rejected unless
`REGISTRY_ALLOW_INSECURE_HTTP=true`; non-loopback development hosts must also
be named exactly in `REGISTRY_INSECURE_HTTP_ALLOWED_HOSTS`. Wildcards are not
supported, and package installations leave the list empty. TOFU is also off by
default so an endpoint cannot be trusted before the operator sees and confirms
its identity.

## Optional Mongo Change Streams

Affinity recompute change-stream wakeups are disabled by default. The normal polling worker still runs if you do nothing.

To enable them on a VPS package install, edit `/etc/myscoutee/myscoutee.env` before `systemctl start myscoutee`:

```bash
MONGO_REPLICA_SET_ENABLED=true
```

When that flag is true, systemd uses `/opt/myscoutee/server/docker-compose.replicaset.yml`, starts Mongo as a single-node replica set, initializes it as `rs0`, and passes `MONGODB_REPLICA_SET=rs0` to the backend. You can override the set name with `MONGO_REPLICA_SET_NAME`, but `rs0` is the expected default.

`restore-production.sh` is intentionally guarded:

```bash
CONFIRM_RESTORE=true bash packaging/scripts/restore-production.sh /path/to/myscoutee-backup.tar.gz
```

Set `RESTORE_MINIO=true` to restore MinIO files and `RESTORE_CONFIG=true` to restore `.env` files.
Set `RESTORE_REGISTRY=true` only when the deployment identity and its verified
registry state and receipts must also be restored. A key-only backup is
rejected because it cannot safely recover the enrollment history. Restoring
that directory transfers
control of the registered deployment, so do not restore one deployment's
identity onto a different independent installation. If the backend is running,
the restore briefly stops and recreates `profilemanagement` around the
identity/state replacement so its registry retry worker cannot race the
restore.

Production backups contain database credentials and, when present, the
deployment private key. The backup script creates the archive with mode
`0600`; store and transfer it as a secret. Package installations write backups
to `/var/backups/myscoutee` by default so `apt purge` does not remove the
archive along with `/opt/myscoutee`.

Operator-managed deployment credentials use a separate at-rest encryption key:

```text
/etc/myscoutee/configuration/deployment-master-key
```

`postinst` generates it once as 32 random bytes encoded by 64 lowercase
hexadecimal characters. The directory is `root:10001` mode `0750`; the key is
`root:10001` mode `0640` and is mounted read-only into the API container.
Package upgrades validate and preserve it. Production backup/restore treats
the key and MongoDB snapshot as one recovery set because encrypted deployment
credentials cannot be decrypted with a different key. Replacing or rotating
this file without atomically re-encrypting every stored credential is invalid
and will make those credentials unreadable.

Restore validates and stages the backup key, stops the API, restores MongoDB,
and activates the key only after `mongorestore` succeeds. If MongoDB/key or
registry identity/state replacement is incomplete, the API deliberately
remains stopped for operator recovery instead of restarting with mismatched
cryptographic state.

`apt purge myscoutee` deliberately removes both
`/etc/myscoutee/registry` and `/var/lib/myscoutee/registry`. Back up the
deployment identity and registry state before purging; without that backup,
the deployment cannot recover its signing control and accepted receipt
history.

## Image Naming

Production:

```text
myscoutee-nginx:1.0.0-prod
myscoutee-api:1.0.0-prod
```

Development:

```text
myscoutee-nginx:1.0.0-dev
myscoutee-api:1.0.0-dev
```

Shared nginx base:

```text
myscoutee-nginx:1.0.0-base
```

## Future Debian Package

The Debian package installs a prepared bundle under `/opt/myscoutee`, with configuration under `/etc/myscoutee` and persistent data linked through `/var/lib/myscoutee`. The package declares Docker Engine and Docker Compose v2 as dependencies.

On first install, `postinst` creates `/etc/myscoutee/myscoutee.secrets.env` with generated values for `MONGO_INITDB_ROOT_PASSWORD`, `MONGO_APP_PASSWORD`, and `MINIO_ROOT_PASSWORD`, and generates the dedicated operator-configuration master key. It does not create a deployment identity or contact a registry. Existing secrets, configuration keys, and deployment keys are never overwritten, so package upgrades do not rotate live credentials or change the registered deployment by surprise.

The package should avoid aggressive system upgrades. Server convenience tools should be installed only when missing, and only in the smallest useful set.

Target helper tools:

- curl
- jq
- gnupg
- ufw
- ncdu
- iotop
- redis-tools
- mongosh

The systemd unit is in `packaging/systemd/myscoutee.service`.
