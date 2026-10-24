# Backend packaging and deployment context

Shared build, installation, TLS, update and recovery mechanisms are documented in the pinned
[packaging dependency](../../../config/packaging/node_modules/@fssrepository/myscoutee-packaging/docs/production.md).
Project selections live in `config/packaging/`.

The latest published Debian package is **1.4.1**. Its
[release](../releases/v1.4.1.md) includes the seven-image Docker inventory,
signed DEB and helpers. The owner’s uploaded DEB hash and canonical catalog/asset
discovery are verified. Production Netcup now runs the exact signed 1.4.1 DEB;
host qualification, 13 external checks, Angular render and retained-data checks
passed. See the linked release evidence.
The
[1.3.1 frontend patch](../releases/v1.3.1.md) publishes only an nginx image
compatible with that package; it does not build or install a new DEB.
Production packaging includes the MCP
image as the seventh managed image and publishes its anonymous help endpoint at
`/mcp` through nginx. See [release preparation](../releases/v1.3.0.md)
for the older-updater compatibility boundary and remaining qualification gates.


## Current Scope

The current packaging path builds and runs the production Docker stack from the existing repo layout:

- nginx production image with baked frontend assets
- backend production image with the jar under `/app`
- MongoDB
- Redis
- MinIO
- isolated Explore registry
- isolated Explore payment simulator

It intentionally does not add Java, Mongo, or Redis memory caps. Optional small/medium/large presets can be added later as explicit production profiles.

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
Operator workspace. It is a server-side demo session: Angular calls Java, Java
uses Mongo `demo_db`, and registry actions call an internal Go service built as
`myscoutee-registry:<version>-prod`. The package contains that stripped image
and starts it with the explicit guarded `start-demo` command. Its seeded SQLite
database, signing key, registry identity, and Java demo-client state use
dedicated volumes, and the service exposes no host port. Demo actions therefore
exercise real signatures, registration, claims, QMAU/revenue receipts, ledger
and query-table writes without touching the operator-selected registry.

Only an authenticated production Operator can use the real workflow above.
That operator's registry remains an independently deployed HTTPS service; its
URL, keys, identities, receipts, claims, and ledger are never forwarded to or
stored in the bundled Explore registry.

The `.deb` contains `OPERATOR_USER=`, `OPERATOR_BOOTSTRAP_EMAIL=`, and
`OPERATOR_BOOTSTRAP_PASSWORD_SHA256=` as empty placeholders. On first install,
if `OPERATOR_USER` is still empty, `postinst` creates a deployment-local
`operator-<random>@deployment.invalid` identity and a 256-bit random password,
prints that pair once, and stores the generated subject plus the password's
lowercase SHA-256 digest in the root-only secrets file. Save the printed
credential and protect installation logs: upgrades neither rotate nor reprint
it. A preconfigured `OPERATOR_USER` is preserved and causes no local credential
to be generated.

The generated local credential remains an ongoing Operator login. Configuring
Firebase does not automatically replace, disable, or rebind it. Changing
`OPERATOR_USER` so it no longer exactly matches the stored bootstrap subject
causes local bootstrap authentication to fail closed; the installer preserves
the original subject and digest, warns, and lets the package upgrade continue
instead of rotating or attaching them to the new identity.

Once authenticated, the operator configures Firebase and the dedicated
administrator emails in the Configuration screen. Saving Firebase stages the
configuration but does not switch live authentication or messaging. The
operator must complete the real authentication and test-notification checks,
then use the separate activation action; rotating any Firebase field or
service-account credential invalidates those checks and deactivates that
revision. The deployment-local bootstrap login remains available throughout.
Administrator addresses are
persisted in the deployment database and are not supplied by a packaged
`ADMIN_USER` fallback. Administrator authority still does not imply Operator
authority.

The standalone helper is parameterized for safe verification without touching
the host installation:

```bash
MYSCOUTEE_BOOTSTRAP_ENV_FILE=/tmp/myscoutee.env \
MYSCOUTEE_BOOTSTRAP_SECRETS_FILE=/tmp/myscoutee.secrets.env \
  npm --prefix config/packaging run runtime -- ensure-operator-bootstrap.sh
```

The source development and E2E stacks use the same isolation model with the
`myscoutee-registry:1.0.0-dev` tag and a loopback host port for inspection.
Every backend-connected development, E2E, and production Explore build
exercises the complete Operator protocol against `demo_db`; each stack keeps
its demo SQLite/signing key and Java client identity/state separate from every
real registry path.

Plain HTTP is rejected unless
`REGISTRY_ALLOW_INSECURE_HTTP=true`; non-loopback development hosts must also
be named exactly in `REGISTRY_INSECURE_HTTP_ALLOWED_HOSTS`. Wildcards are not
supported, and package installations leave the list empty. TOFU is also off by
default so an endpoint cannot be trusted before the operator sees and confirms
its identity.

## Default Mongo replica set and change streams

Normal dev, prod, E2E and packaged Compose entry points inherit the retained
replica override with `extends`. No extra `-f` argument is required. The files
`server/docker-compose.replicaset.yml` and the production replica override remain
the configuration owners; explicit overlay invocation remains supported.
Packaged installations default `MONGO_REPLICA_SET_ENABLED=true`. The legacy flag
controls explicit overlay selection in the wrapper; setting it false does not
turn the base file's inherited replica configuration into a standalone Mongo.

A single Mongo container is still a **single member**, now running replica set
`rs0` (`MONGO_REPLICA_SET_NAME` can override it). This enables change streams;
it does not add a second Mongo process or provide failover. The shared Mongo
entrypoint preserves the official user/seed initializer and initializes the
replica only after the final authenticated daemon starts. Its internal key is
created once under `/data/db/.myscoutee-replica-key` and retained on restart.
Existing standalone data is preserved; conflicting replica identity is rejected
instead of silently reconfigured. Health requires an authenticated writable
primary. No data JSON field or collection index is needed to enable a stream.

Affinity uses one task-collection stream per configured REAL/DEMO database.
`AFFINITY_RECOMPUTE_CHANGE_STREAM_ENABLED=true` and
`AFFINITY_RECOMPUTE_CHANGE_STREAM_FALLBACK_POLL_ENABLED=false` are the normal
Compose defaults. Startup and reconnect read pending tasks after opening the
stream; future deadlines and remaining queued work use local wakeup timers.
An empty queue does not cause periodic affinity task queries. The 30-second
stream await timeout returns early on an event; the existing 250-ms application
coalescing is separate. Explicit configuration overrides remain available.
The existing task index initializer supplies both databases, including a DEMO
database recreated after a wipe. DEMO data remains disposable.

Validation: `npm --prefix config/packaging test -- mongo-replica-default-test.py` resolves all
five Compose entry points. Add `--runtime` for a sequential, isolated cached-image
check of standalone-data conversion, actual stream delivery, restart/key
persistence and fresh initialization. It publishes no ports, pulls no images,
and cleans only its own labelled container and volume. The E2E image must be
rebuilt to receive changed Mongo entrypoint files; Compose configuration checks
alone do not prove that an old prebuilt E2E image contains them.

## Image Naming

Production:

```text
myscoutee-nginx:1.0.0-prod
myscoutee-api:1.0.0-prod
myscoutee-minio:1.0.0-prod
myscoutee-registry:1.0.0-prod
myscoutee-payment-simulator:1.0.0-prod
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

