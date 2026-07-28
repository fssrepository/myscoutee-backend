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
BUILD_ARTIFACTS=false PACKAGE_IMAGES=false bash packaging/scripts/package-production.sh
```

`package-production.sh` creates `packaging/dist/myscoutee_<version>_amd64.deb`. By default it builds production artifacts and packages the MyScoutee nginx/API images. During install, `postinst` checks Docker and prepares MongoDB, Redis, and MinIO images by pulling them if they are missing. Set `PACKAGE_OFFICIAL_IMAGES=true` only when you want a larger offline-style bundle that also includes those official service image archives.

MongoDB is pinned to `mongo:8.0.4` for the packaged and dev stacks. Run `smoke-mongo-compatibility.sh` against a running stack to confirm the configured image, running Mongo version, feature compatibility version, backend health, landing content query, and a temporary app-user CRUD round trip all work on Mongo 8.0.

Install the local deb with `apt`, not `dpkg`, so Docker Engine and Docker Compose dependencies are installed before MyScoutee is configured:

```bash
sudo apt install ./packaging/dist/myscoutee_1.0.0_amd64.deb
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

On first install, `postinst` creates `/etc/myscoutee/myscoutee.secrets.env` with generated values for `MONGO_INITDB_ROOT_PASSWORD`, `MONGO_APP_PASSWORD`, and `MINIO_ROOT_PASSWORD`. It does not create a deployment identity or contact a registry. Existing secrets and deployment keys are never overwritten, so package upgrades do not rotate live credentials or change the registered deployment by surprise.

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
