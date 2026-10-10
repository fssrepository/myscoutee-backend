# MyScoutee service packaging — MSC-121

Current numbered implementation status and measured qualification boundaries: [PROGRESS.md](PROGRESS.md).

This shell builds independently packaged services from the canonical source in
`server/projects/profile`. It contains no copy of that business source and has
no dependency on the monolith's executable JAR or compiled output.

**Verified lab snapshot (2026-10-09):** Helm revision 101; all six independent
backends and nine support deployments are Ready. All 21 domains are included.
The VM is 8 GiB / 4 vCPU with host-boot autostart disabled. The source-batch
standard suite passed 1691 cases, embedded checks passed 81 across group/focused
runs, the latest adapter suite passed 219, and the scheduler refinement passed
16 focused cases. Six artifact audits and real Spring contexts pass.

Native DEMO login, reads through every assembly and logout pass through
`http://localhost:18080`. All three landing catalogs/images and the disposable
two-identity contact mutation/replay sample pass. The bounded stress result and
qualification limits are recorded in [PROGRESS.md](PROGRESS.md).

### MSC-122 preparation — 2026-10-10, KVM gate passed

Generic bootstrap/configuration/TLS/update source now belongs to platform.
Help and MyScoutee operator/Registry have separate `help` and `network` assemblies;
content stays in community. Eight Java processes cover all 21 domains. The
virtual-company network is excluded from the template; retained minimal models
stay unchanged, including localization and location.

Helm revision 129 is Ready. Native KVM reads/consent and all 15 delegated headless
browser checks pass, including editable operator configuration and HTTP 200
release discovery. Warmed read load completed 4,498 requests with zero errors at
74.9 requests/s. The persistent configuration key and existing Compose release
simulator are now wired into the lab. The independently found public release
catalog defect was also repaired, without weakening signature verification.

Final regression: 228 transport, 359 targeted canonical JUnit and 65 infrastructure
checks pass. The monolith native login/seven reads/logout and the same 15 browser checks also
pass. KVM is stopped and the existing dev stack is running; never run both together. See [progress/evidence](PROGRESS.md) and
[the complete template plan](../guides/plans/MSC-122_TEMPLATE_EXTRACTION_PLAN.md).

### Latest delegated qualification

UK regional entry also passes: London, Edinburgh, Cardiff and Belfast resolve
to `country:gb` with the security gate enabled; Dublin is rejected. The managed
`MSC121-UK-ENTRY` checkpoint and `tools/check-uk-entry.mjs` verify an existing
non-first London demo member through native HTTP login, `/game` and logout.
Canonical coordinates and country geometry are unchanged.

The managed native-HTTP browser check passes landing/consent/carousel, native
DEMO login, event/explore popups, Work → Dating workspace switches and logout.
It rejects a frontend-local fallback as evidence of working HTTP services.

```sh
QA_BROWSER_SESSION_CONFIG="$PWD/microservices/deploy/browser-sessions.json" \
  node guides/qa/tools/open-checkpoint-browser-sessions.mjs MSC121-QUALIFICATION
node microservices/tools/check-browser.mjs
```

Run this only within explicitly delegated automated QA. Generated screenshots
and the report are in `microservices/build/reports/browser/`. The ordinary manual
QA browser boundary remains unchanged.

The unchanged monolith stress scenarios, measured CPU contribution and retained
performance regression are in [MONOLITH_COMPARISON.md](MONOLITH_COMPARISON.md).
The original monolith baseline is retained. A separately authorized current-source regression run is recorded in that comparison. Capture the same guest cgroup measurements with:

```sh
python3 microservices/tools/measure-stress.py server-events-read
python3 microservices/tools/measure-stress.py server-read-sweep
```

### Shared Mongo replica set

`deploy/runtime.json` enables `mongoReplicaSet` and sets a 3-core Mongo CPU ceiling.
Both members reuse the same locked Mongo image; no additional image build occurs.
Each has 768 MiB RAM limit and a 256 MiB WiredTiger cache. Their CPU limits share
the existing four guest CPUs; limits do not reserve cores. One **StatefulSet**
`mongodb` owns `mongodb-0` and `mongodb-1`, each with a retained 4-GiB claim
(`data-mongodb-0` / `data-mongodb-1`). The existing member DNS aliases `mongodb`
and `mongodb-secondary` select the corresponding pod; application URIs and
replica membership do not change. `mongodb-members` is the governing headless
Service. Parallel pod creation permits both voting members to recover together.

```sh
# Existing two-Deployment lab: guarded data-preserving conversion.
python3 microservices/tools/mongo_replica.py statefulset
# Read/verify replica health:
python3 microservices/tools/mongo_replica.py status
```

The StatefulSet conversion stops the six backends and makes a new private
Mongo archive, validates gzip and SHA-256, and records namespace/controller/PVC/
PV identities, document counts, collection hashes and indexes. It stops both
old Mongo pods, sets the original PVs to **Retain**, prebinds the new ordinal
claims to those exact volumes, and replaces the controllers through Helm.
It verifies unchanged REAL/DEMO data and indexes, then exercises a majority
write and a secondary read, cleans the probe and restarts the six backends.
The source is `tools/mongo_replica.py`; interrupted conversion resumes from
`mongo-statefulset.json`. Normal chart updates refuse unconverted legacy data.
A verified rerun checks volume identities and replication without restarting.

The backup, credentials and receipts stay in private lab state, not Git. The
receipt records the archive path/checksum and the original resource manifests.
Do not blindly Helm-rollback to the old Deployment chart: its old claim names
no longer own the data. Keep the retained PVs and archive; diagnose a failed
step and rerun the migration instead of deleting/reprovisioning storage.
Archive decompression/hash and live data preservation were verified; an archive
restore into a separate database has not been exercised by this migration.

Fresh `workloads.py up` creates ordinal claims and initializes the replica using
the existing initialization owner. Seed import/restart, lifecycle stop/status,
and the one-second observer understand the StatefulSet. The observer aggregates
its two pods into the `mongodb` **2/2** workload row. No service image build or
pull is required for this controller change.

Member Services are headless and publish not-ready pod addresses. Each member
waits for its own DNS name to resolve to its pod IP before Mongo starts. This
avoids a simultaneous VM-restart race where Mongo validates its stored member
name before a normal Service has ready endpoints and both nodes remain removed.
The versioned Helm upgrade replaces only the two owned legacy ClusterIP Services
while backends are stopped; replica membership names remain unchanged.
See the [Kubernetes DNS documentation](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/).

Both members vote: **two members require both for majority writes**. This lab
proves replication; it does not survive a member loss with continued writes.
Default reads remain on the primary, preserving immediate consistency; adding
a secondary does not automatically relieve read CPU. Host/VM loss still affects
both. `workloads.py stop` stops both; owned VM destruction also deletes their
volumes and private backups. Copy a required backup before destroying the lab.
Never turn the flag off against replica-set data as an implicit rollback.

### Recovery implementation and coordinated upgrade

Native recovery and HTTP adapter changes are verified by the accumulated suite.
The [English guide](../guides/manuals/myscoutee-microservices-guide-en.html) and
[branded PDF](../guides/manuals/MyScoutee_Microservices_Guide_EN.pdf) describe
the actual deployment, operations, measurements and limits.

`assets`, `events` and `eventFeedbackStates` now use optimistic document versions.
Their existing owners initialize missing versions to zero before accepting work.
For this upgrade, stop all old backend writers before a context probe or new
backend image deployment. The versioned command preserves supporting services:

```sh
python3 microservices/tools/workloads.py backends-stop
python3 microservices/tools/check-contexts.py
python3 microservices/tools/workloads.py up
```

Build and lock the new images explicitly before `up`; startup never builds them.
The deployment guard rejects changed backend images while old backend pods remain.
A monolith upgrade requires the same stop-old/start-new boundary. Do not roll back
to pre-version writers against a migrated database; restore a matched database
backup and application version together if a rollback is needed.

The mutation harness passed against the lab with two identity pods:

```sh
python3 microservices/tools/check-business.py --two-identity
```

It creates receipt-owned disposable DEMO actors, checks contact request/reject/
approve and retries, checks both identity pods served writes, restores one replica
and removes its own fixture. It does not reset canonical actors or write REAL.
An interrupted fixture can be cleaned with the exact `--cleanup RUN_ID` command
printed by the harness. This is contact-flow coverage, not every business flow. The extended live recovery check also passes:

```sh
python3 microservices/tools/check-business.py --worker-recovery --write-cycles 20
```

It temporarily rejects only contact delivery at the communication Service,
accepts a durable contact command, kills its identity worker, restores routing,
and observes completion without API replay. The recorded run has 44 commands,
44 notification intents, 20 request/reject cycles and cleaned temporary routing,
actors and sessions. Embedded tests cover other recovery/lifecycle boundaries.

### Live application checks

```sh
python3 microservices/tools/check-public.py
python3 microservices/tools/check-session.py
```

For the bounded read-load and two-pod routing sample:

```sh
python3 microservices/tools/check-load.py --two-assets --seconds 60 --concurrency 8
```

This temporarily adds only a second assets pod, reuses the native session helper,
measures six authenticated read routes, records per-pod counters/latencies and
restores one replica. The final sample completed 3,790 authenticated requests in 60.04 seconds with eight clients, zero errors and 63.12 requests/second; per-route p95 137.24–323.35 ms. It does not qualify every business mutation, worker failover or production capacity. See [PROGRESS.md](PROGRESS.md) for exact route measurements.


The public check verifies anonymous/protected routes, canonical landing slide
metadata for dating/work/community, and the three actual PNG assets. The session
check uses the existing native DEMO login contract, reads routes owned by all six
backends and revokes only its own temporary session. It never clears another
session or resets fixtures. Reports are written to ignored `build/reports/`.

Identity runs the canonical `WebSecurityConfig`. Other backends submit the
original public method/path/authentication headers to identity for its native
security decision, then validate an audience- and request-nonce-bound actor
proof. Business bodies stay on the receiving backend, preserving streaming and
multipart behavior. Internal RPC proofs continue to bind their exact payload.
No authentication policy list is copied into each backend.

The production `landingSlides` allowlist omission was corrected in the canonical
import configuration (MSC-120). New empty lab databases receive it through normal
bootstrap. For an existing verified lab baseline, the explicit catalog-only
migration is:

```sh
python3 microservices/tools/workloads.py frontend-up
python3 microservices/tools/seed-mongo.py --add-catalog landingSlides --from-fingerprint <reviewed-original-fingerprint>
python3 microservices/tools/seed-mongo.py --verify
python3 microservices/tools/workloads.py up
```

Record and verify the original bootstrap/source fingerprint before changing the
catalog/import allowlist. The migration rejects unrelated ownership/content
changes and differing existing catalog rows. It invokes the canonical single-file
importer only for missing catalog data, retains all business collections and
indexes, and records the new fingerprint after verifying exact canonical rows.
A completed rerun is a no-op; deleted data is not silently repaired.

## Composition

[`assemblies.json`](assemblies.json) owns domain grouping, external libraries,
Spring starters and initial memory budgets. It currently defines:

| Service | Domains | Heap / proposed container limit |
| --- | --- | --- |
| identity | accounts, access, administration, platform, integrations | 512 / 1024 MiB |
| community | groups, community, events, campaigns, content | 512 / 1024 MiB |
| communication | chat, notifications, email, localization | 384 / 768 MiB |
| assets | assets, media | 384 / 768 MiB |
| payments | payments | 384 / 768 MiB |
| affinity | affinity | 384 / 768 MiB |
| help | help | 256 / 512 MiB |
| network | operator, registry | 384 / 768 MiB |

The number of deployments is not fixed. Splitting a group means adding an entry
and reassigning its domains, dependencies and memory budget. Settings generate
its Gradle project; the build generates its Spring configuration; the renderer
generates its Dockerfile and Prometheus target. Every domain must have exactly
one implementation owner. The implemented transport inventory in
[`transport/bindings.json`](transport/bindings.json) drives both generated Java
imports and Helm endpoint addresses from that same ownership map. Regrouping an
implemented boundary therefore updates its destination without editing URLs.
New remote boundaries still require real adapters.

One [`CoreApplication`](bootstrap/src/main/java/com/raxim/myscoutee/microservices/bootstrap/CoreApplication.java)
source is compiled into every service. `AssemblyConfiguration` is generated with
that artifact's exact component and repository packages. There is no `core`
deployment. All API/DTO contracts compile once into a shared contract library;
foreign services, repositories, controllers and document packages are absent
from each service artifact. Existing API projections are not automatically a
network serialization contract.

Use **one shared MongoDB replica set**, with the existing REAL/DEMO databases and
collection ownership. The current lab has two voting members and primary reads. Splitting another domain does not create another Mongo.
The Helm chart deploys both Mongo members, Redis, MinIO and the frontend. Each backend
currently runs one replica; explicit seed migrations stop only those six backends
while retaining support services and volumes. The existing frontend is reachable at `http://localhost:18080`.

### Supporting services and production parity

| Component | Current lab state | Purpose / remaining integration |
| --- | --- | --- |
| MongoDB | Two members, each with a persistent 4-GiB PVC | Shared REAL/DEMO databases; domain collection ownership remains explicit |
| Redis | One running pod, bounded ephemeral cache | Existing cache/realtime coordination |
| MinIO | One running pod, persistent 1-GiB PVC | S3-compatible media store, canonical production seed and client; 384-MiB container limit |
| nginx / frontend | One running pod | Static production bundle and API routing; no frontend replica experiment |
| Prometheus / Grafana | Host monitoring containers | Metrics and dashboards; private guest metrics gateway connected; all backend management endpoints are private |
| STUN | One running pod; 64-MiB limit | Canonical STUN-only coturn; host-accessible VM NodePort 30478 over UDP/TCP; no TURN relay |
| MCP server | One running pod; 128-MiB limit | Existing prod image points through the gateway; `/mcp` and `/mcp/private` preserve streaming/authentication |
| DEMO registry | One running pod; 128-MiB limit and 1-GiB PVC | Canonical `start-demo`; separate persistent client identity; REAL outbound registry remains disabled |
| Payment simulator | One running pod; 128-MiB limit and 1-GiB PVC | Existing DEMO provider and browser routes; callbacks target payments; native read access verified; payment mutations still require qualification |
| Firebase / FCM, SendGrid | Disabled | External providers, not missing local containers |

The supporting production containers are deployed. Full business-flow qualification
remains in progress; healthchecks and read smoke tests do not prove complete prod parity.
There is no application requirement here for an additional Kafka, RabbitMQ or SQL database.

MinIO reuses `server/docker/images/minio/Dockerfile` and its existing seed/start
scripts. Build it explicitly once, then use the normal immutable image lifecycle:

```sh
bash microservices/tools/lab.sh minio-image
python3 microservices/tools/workloads.py lock-images
python3 microservices/tools/workloads.py frontend-up
python3 microservices/tools/check-minio.py --seed --restart
```

`frontend-up` keeps backend replicas at zero during their wiring work. MinIO is
private to the cluster: S3 `http://minio:9000`, console `http://minio:9001`.
The backend's existing prod properties receive that endpoint and bucket
`myscoutee-media`. Access ID `lab-media` and a generated private password are
injected through Kubernetes Secrets; no password is committed. This lab shares
the bootstrap credential with the existing S3 client, matching current prod
configuration; separate restricted service credentials remain a production concern.
Startup readiness waits for canonical seed completion. The container runs as
10001 with a read-only root filesystem; `/data` persists and `/tmp` is ephemeral.
Workload stop retains the PVC; destroying the owned VM removes its backing data.

The `--seed` check compares all 879 canonical prod media keys and SHA-256 hashes
against both packaged files and actual S3 object bytes; the full comparison passed.
The versioned check also writes/reads a unique probe object, optionally replaces only
the MinIO pod, verifies persistence across reseeding, and deletes that object.
It passed against the guest; observed idle working-set memory was about 169 MiB,
not a load-test result. Existing image versions are reused on repeated startup.

### Canonical data initialization

```sh
python3 microservices/tools/workloads.py frontend-up
python3 microservices/tools/seed-mongo.py
python3 microservices/tools/seed-mongo.py --restart
python3 microservices/tools/check-minio.py --seed
python3 microservices/tools/check-support.py --data --restart-data-services
```

Mongo bootstrap runs the existing `server/docker/conf/mongodb/mongo_import.sh`
against the canonical `myscoutee_db` and `demo_db` seeds. It reads the production
collection allowlist from `server/.env` and maps only the database names to
`msc121_real` / `msc121_demo`. The shared importer now accepts `MONGO_SEED_ROOT`;
its existing default and monolith behavior are unchanged. No sync watcher runs.
Both owned databases must initially be empty and all backend replicas stopped.
A durable fingerprint in `msc121_bootstrap` makes repeated identical bootstrap a
no-op and allows the same interrupted import to resume. Changed seed/namespace
identity is rejected; updating existing application data requires a separate
explicit migration. Temporary import files are removed after the attempt.

Verified import: REAL has zero synthetic users, DEMO has 125 users; each has 26
articles, 14,992 translation messages and 50 policy definitions. Repeating the
bootstrap leaves its completion record unchanged. Wrong fingerprint and foreign
namespace checks fail without replacing that record. `--verify` checks the completed
bootstrap without importing; `--restart` additionally replaces only the Mongo pod
and compares every collection hash/count, index definition and bootstrap marker.
The restart passed with 17,590 REAL documents across 53 collections and 42,499
DEMO documents across 66 collections, with no changes to those snapshots.

Registry uses its canonical `start-demo` seed and rolling QMAU refresh. The
payment simulator uses its native SQLite initialization and built-in DEMO cards;
configuration and credentials persist in its PVC. The pod-replacement check
verifies the registry seed and signing identity and simulator configuration.
Kubernetes volume ownership uses `OnRootMismatch`; a non-root init container
restores mode `0600` on the registry signing key and VOPRF keyring before the
canonical binary checks them. No key is regenerated or copied. These are the same source
initializers as prod, with isolated lab keys/state. Redis is ephemeral cache;
MCP and STUN have no separate application-data import. nginx packages the existing
frontend bundle. All 31 canonical startup/index/cache components are present in their owning
service JARs. Backend localization, settings and access-policy cache loaders
and domain index initializers remain in their original owners; their runtime
completion still depends on resolving the missing backend connections.

The other supporting images reuse the sibling repositories' canonical production
Dockerfiles. Kubernetes probes for MCP, registry and payment simulator call their
existing `/healthz` endpoints directly; they do not spawn the image's healthcheck
CLI. Startup/readiness/liveness periods remain 2/10/30 seconds. STUN keeps its
protocol-level exec check. Compose continues to use the canonical image checks.
This configuration belongs to Helm, not VM/Terraform settings.
Release builds are explicit and serial:

```sh
bash microservices/tools/lab.sh support-images
python3 microservices/tools/workloads.py lock-images
python3 microservices/tools/workloads.py frontend-up
python3 microservices/tools/check-support.py
```

The developer lab also packages the existing Compose release simulator, including
its canonical startup wrapper and HTTPS catalog server. Build this image explicitly:

```bash
bash microservices/tools/lab.sh release-simulator-image
python3 microservices/tools/workloads.py lock-images
```

On first deployment, `workloads.py up` starts support services with backend replicas
at zero, copies only the simulator's public TLS certificate into a ConfigMap, then
starts the backends. The private TLS volume remains simulator-owned. Only the
platform owner receives the HTTPS release origins and public CA. An empty local
catalog is explicit and never falls back to GitHub; it proves discovery, not a
package upgrade. Signed upgrade/interruption/rollback qualification uses the
existing release fixture and remains a separate gate.

The check passed all four image healthchecks, STUN Binding Responses over host-to-VM
UDP and TCP, the localhost MCP private endpoint's 401/OAuth challenge, the simulator
browser asset route, and public denial of internal/management endpoints.
The gateway uses full Kubernetes DNS names because nginx's dynamic resolver does
not apply pod search suffixes. The simulator's private provider APIs remain on the
cluster network; public browser routes match the production allowlist.
Generated simulator test keys are shared through private Secrets with the payments
assembly. DEMO registry server/client keys and SQLite data live on separate PVCs.
The client PVC is first provisioned when its owning backend starts; stopping retains it.
STUN is advertised as `stun:192.168.173.10:30478` for this host-accessible lab;
remote clients require a separately reachable deployment address.
The canonical coturn binary is invoked directly so the image's shell wrapper does
not discard `-n`; both Helm and the shared Compose definition preserve that option.
Idle measurements: MCP ~3 MiB, simulator ~3 MiB, registry ~11 MiB, STUN ~5 MiB.
These measurements do not qualify business load or public Internet connectivity.

## Build and inspect

Run from any directory:

```sh
/path/to/myscoutee-backend/microservices/tools/lab.sh preflight
/path/to/myscoutee-backend/microservices/tools/lab.sh build
```

`jars` runs the serial Gradle build, management-port security tests and artifact
audit. `images` packages existing audited JARs. `build` performs both in order.
The resource preflight refuses to compete with a detected dev build owner.

For a local Java correction, select the affected assemblies instead of running
the full `lab.sh build`. For example, the integration publisher belongs to
`identity`, while event workers belong to `community`:

```sh
microservices/gradlew --offline --no-daemon --max-workers=1 \
  -Dorg.gradle.jvmargs=-Xmx1024m :identity:bootJar :community:bootJar
```

Audit and package those assemblies only, using their existing generated
Dockerfiles and cached runtime image. `--offline` fails if a dependency is
missing rather than downloading it. Shared implementation or contract changes
may require additional consumers; identify those from `assemblies.json` and
the transport bindings. Image import transfers only identities absent from the
guest cache. The existing coordinated backend stop/upgrade guard still applies;
selective compilation does not remove that deployment safety rule.

The `vm.py observe` terminal samples container cgroup CPU and memory counters
once per second through one persistent SSH connection. Kubernetes and Docker
inventory refresh every five seconds; VM identity metadata refreshes every 30
seconds. It does not launch `kubectl`, `crictl` or `docker stats` for every CPU
sample. A replaced container requires a fresh pair of samples, so its first CPU
rate is shown as unavailable instead of reusing an old counter. The guest's
existing TLS credentials stay inside the guest; closing the terminal closes
its observation connection. `vm.py observe --once` remains a bounded snapshot.
Host Grafana and Prometheus CPU are displayed separately from VM workloads.

Before packaging another image, `python3 microservices/tools/check-contexts.py`
can refresh each real assembly's Spring context serially using its built JAR,
the existing production runtime base image and the Helm-rendered environment.
It requires zero backend replicas and an idle host build pipeline. One temporary
pinned SSH tunnel connects to the existing lab support services; native startup
and index initializers use the lab databases. Previously started owners remain reachable on loopback until the round ends,
so later startup initializers can call their real HTTP owners. The script then
removes its own probe containers and tunnel, and writes private logs plus results under
`build/reports/contexts/`. A refreshed context proves wiring and the required startup calls only. Worker
calls can fail while their owner is still starting; Kubernetes readiness and
user flows are not established by this check. No images are built or workload replicas changed by this check.

Outputs are ignored build products:

- `build/<service>/libs/myscoutee-<service>.jar`
- `build/deployment/<service>.Dockerfile`
- `build/reports/assemblies.json`: artifact hashes, sizes, implementation counts,
  dependency libraries and candidate cross-service API references
- `build/<service>/generated/`: selected Spring configuration, production
  resources and assembly identity

Explicit builds use `myscoutee-service-<service>:msc121`; `workloads.py lock-images`
records immutable `0.1.0-<image-hash>` references for deployment. Startup imports
only missing locked artifacts into guest containerd and never builds. Their dependency and
application layers are separate. Only the assets image includes ImageMagick and
WebP tools; all services use Java 25 JRE, user 10001, bounded heaps and fail-fast
OOM handling. Library versions/security overrides and runtime base stages are
reused from the backend production build. There are no watchers, sync services,
DevTools, source mounts or build tools in these runtime images. Container memory
limits in the table are planned deployment limits, not measurements of a running
six-service application.

The monolith still builds without this directory. To use a future standalone
shell checkout/submodule, set `MYSCOUTEE_BACKEND_SOURCE` to a compatible backend
checkout; no source copying is needed.

The group directory transports its existing nine reads and owner-computed lifecycle
facts through `group-directory-v1.openapi.json`. `CommunityMembershipReads`
extracts only the two membership reads required by account workspace selection;
registration and transitions remain with `CommunityMemberships` in its owner.
`EdgeDirectory` transports its existing two reads with the seven-field
`AffinityEdgeDto`; private affinity evidence is excluded. All three reuse the
bounded read transport, dedicated credentials and REAL/DEMO context. They do not
grant delegated actor authority or add writes. `RatingDirectory` retains its four
canonical reads and the existing 23-field view, excluding supplemental actor
snapshots. Home-game projections and positive campaign rating checks stay in
the existing owner queries; their semantics are tested over HTTP.

`ChatReview` transports the existing reported-message and report-evidence reads;
canonical membership/author checks and message order stay owner-side. `EventHomeReads`
narrows the home activity/report queries to thirteen consumed event fields, and
`FeedbackDirectory` preserves the existing target-user query and answer view.
The home consumer no longer requests an unused asset ownership dependency.
The event-home HTTP fixture mocks the owner port; 56 existing canonical home/profile
tests separately cover the consumer using its original owner services.

## Monitoring

```sh
microservices/tools/lab.sh monitoring-up
microservices/tools/lab.sh monitoring-stop
microservices/tools/lab.sh monitoring-destroy
```

Prometheus binds to `127.0.0.1:19090`; Grafana to `127.0.0.1:13000`. Grafana's user
is `lab`; the loopback-only lab default password is `msc121-local-only`. The
private `~/.local/state/myscoutee-microservices/msc121/monitoring.env` file (or the
equivalent under `XDG_STATE_HOME`) retains the configured value. An existing
custom credential is preserved. Re-running startup preserves the password and volumes.
Datasources and dashboards are provisioned from this repository. Bundled plugins
remain pinned to the image; runtime plugin installation/update is disabled.

Each sidecar has a 256 MiB container limit. Prometheus retention is bounded to
24 hours / 256 MB. Target generation follows the assembly map. Service metrics
use `/metrics` on private port 8081, separate from domain routes on 8080. The
shell includes the Prometheus Micrometer registry and service tags; its security
tests verify the management-port boundary. Domain routes currently deny access
until their explicit authenticated transport chains are supplied. The internal
localization read now has its own narrowly scoped credential chain.

The monitoring stack is independently testable now. Its own scrape is healthy;
application targets remain DOWN while backend replicas are stopped or unready.
No application traffic, latency, tenant isolation or saga result is implied by a
healthy Grafana. Both monitoring containers use host networking with explicit
loopback listeners because Docker bridge forwarding cannot reach this host’s
libvirt guest. No host firewall rules are added. Prometheus reaches
`192.168.173.10:30081/metrics/<service>` through a separate nginx listener that
only maps configured services to private management port 8081. The public
application listener still denies internal/management paths. No general API
proxy is exposed on the metrics listener. Tracing, log aggregation and business-operation
metrics are follow-up work, not yet implemented.

## KVM / Terraform

```sh
bash microservices/tools/setup-host.sh
python3 microservices/tools/vm.py preflight
python3 microservices/tools/vm.py start
python3 microservices/tools/vm.py status
python3 microservices/tools/vm.py stop
microservices/tools/terraform.sh validate
```

Run setup in a terminal so sudo can authenticate you. `host.py` records existing
packages, versions, units and added group membership under root-owned
`/var/lib/myscoutee-msc121-host/`. It installs the headless dependencies on the
inspected Ubuntu 22.04 host and starts libvirt for this session. New units are
masked during installation, then disabled at boot. Pre-existing units are
preserved; an existing guest resume-at-boot service is a reported conflict.

The VM, NAT network, pool and new host daemons have autostart disabled. After a
host reboot explicitly run `sudo python3 microservices/tools/host.py start`, then
`vm.py start`. Guest k3s starts when the VM is explicitly started. Libvirt socket
activation and guest save/resume are included in this boundary; see the
[libvirt daemon documentation](https://libvirt.org/daemons.html).

Terraform owns VM/network/storage resources; cloud-init configures the guest.
Persist accepted VM tuning in `infra/terraform`, guest OS tuning in its
versioned `infra/guest`/cloud-init inputs, pod tuning in `deploy/chart`, and
application behavior in the canonical Java/configuration owner. Record the
reason, before/after evidence, rollout and rollback in
[PROGRESS.md](PROGRESS.md#idle-cpu-investigation--2026-10-09-open). A temporary
experiment must restore its original setting unless the change is adopted
through that owner. Updating cloud-init source alone does not reconcile an
already-provisioned guest; verify existing-VM application separately and never
replace its system/data disks to apply tuning.
State, SSH keys, known hosts, downloaded tools/images and kubeconfig remain under
`~/.local/state/myscoutee-microservices/msc121/`, with private permissions. Normal
SSH and Kubernetes configuration are untouched. The guest SSH host key is pinned
through the authenticated libvirt guest-agent channel. `terraform.sh validate`
checks the pinned provider/schema without creating a VM. The provider lock file
is versioned and artifact downloads are SHA-256 verified.

The definition is a headless 4-vCPU / 8-GiB k3s VM, a 40-GiB sparse system disk,
an owned storage pool and an owned NAT network. Ubuntu and k3s inputs are pinned
by version/date and SHA-256. Cloud-init supplies SSH-key access, the versioned
k3s installer and systemd unit. There is no VMware or graphical desktop.

`start` checks KVM, route/Docker/libvirt subnet overlap, the dev owner, disk space
and available memory (VM plus a 2-GiB host reserve). It rejects foreign names/UUIDs
and plans that would replace or delete persistent resources. Missing state is
not permission to adopt a guest. AppArmor remains enforcing: the domain definition
contains explicit system, backing-image and cloud-init paths.

Host installation and the pinned guest bootstrap have been exercised. Repeated
`start` produced Terraform **No changes**. Graceful stop deactivated the guest,
network and pool; restart preserved its UUID, disks and SSH identity and returned
a ready k3s API. Host package purge and host reboot remain separate verification
gates; unit enablement and resource boot flags were checked without rebooting
the user's PC.

## Typed HTTP boundaries

The typed client and thin owner endpoint implement the canonical
`localization.api.TranslationBundles`. Business behavior remains in `I18nService`
and responses reuse `I18nBundleResponseDto`. The
[OpenAPI contract](transport/contracts/localization/localization-v1.openapi.json) defines the
wire boundary. Generated configuration imports the server in the localization
owner and a client in outside consumers. Currently identity consumes remotely;
email remains local within communication.

The media-policy reads also retain their canonical owners:

| Contract | Owner → consumer | OpenAPI | Response DTO |
| --- | --- | --- | --- |
| `GroupMediaVisibility` | community → identity | [groups-media-v1](transport/contracts/groups/groups-media-v1.openapi.json) | `GroupMediaVisibilityDto`: lifecycle status |
| `CommunityMediaVisibility.announcement` | community → identity | [community-media-v1](transport/contracts/community/community-media-v1.openapi.json) | `AnnouncementMediaVisibilityDto`: community ID and status |
| `CommunityMediaVisibility.offering` | community → identity | same contract, separate operation | `OfferingMediaVisibilityDto`: base-group ID and status |
| `AssetMediaVisibility` | assets → identity | [assets-media-v1](transport/contracts/assets/assets-media-v1.openapi.json) | `AssetMediaVisibilityDto`: owner ID, visibility, lifecycle and moderation status |
| `EventMediaVisibility` | community → identity | [events-media-v1](transport/contracts/events/events-media-v1.openapi.json) | `EventMediaVisibilityDto`: existing visibility/member projection; `CommunityMediaMembershipDto`: accepted role |
| `ContentMediaVisibility` | community → identity | [content-media-v1](transport/contracts/content/content-media-v1.openapi.json) | `FeedPostMediaVisibilityDto`: moderation status |
| `ChatMediaVisibility` | communication → identity | [chat-media-v1](transport/contracts/chat/chat-media-v1.openapi.json) | List of `ChatMessageMediaVisibilityDto`: chat ID and deletion timestamp |
| `ProfileIdentities` | identity → payments | [profile-identities-v1](transport/contracts/accounts/profile-identities-v1.openapi.json) | `ProfileIdentityDto`: user, account and workspace IDs; separate existence and workspace-ID-list operations |

Interfaces stay in the owning domain's `api`; concrete DTOs stay in its `dto`.
The shell supplies transport and generated composition, never copied business
rules. Group lookup is a GET by ID; media URL lookups use POST with a bounded
URL-array query because existing media variants can exceed an HTTP request-line
limit. These POST operations are reads. Small projections have a 4-KiB response limit; event member and chat reference
lists have a 2-MiB limit. Media queries allow at most 32 URLs and 1 MiB of JSON,
including chunked bodies. The chat operation preserves an empty list as `200 []`;
all matching chat references are retained for forwarded-attachment authorization.
Each contract has a separate service credential. A domain `404 NOT_FOUND` maps
to canonical absence; a proxy 404, timeout or owner failure remains an error.
These facts inform the existing access-policy owner; they do not grant user access.

`ChatDirectory` uses [chat-directory-v1](transport/contracts/chat/chat-directory-v1.openapi.json)
for owner/chat lookup, all views of a chat, unread version and support counts.
`ChatDirectoryEntryDto` contains only the existing directory view, including
member IDs and support status; persistence IDs and messages never cross the wire.
Nullable/empty values and the canonical count aggregation are preserved.

`NotificationCatalog` transports the existing notification template and unread,
failed-job and outbox counts. `RecomputeQueue` exposes the existing affinity queue
count. Both preserve their canonical query and count semantics; neither grants
write access. Their contracts are `notification-catalog-v1.openapi.json` and
`recompute-queue-v1.openapi.json`.

`CaseParticipants` uses `case-participants-v1.openapi.json` for the existing case
conversation DTO, active participant account IDs, and visible-case count. Its
bounded POST count query carries only workspace/account/managed-group IDs.
Canonical membership filtering and REAL/DEMO context remain owner-side.
`CampaignMediaVisibility` is a focused port implemented by the existing campaign
catalog service, with `CampaignMediaVisibilityDto` carrying only workspace and
status through `campaigns-media-v1.openapi.json`.

`MemberDirectory` transports all existing read operations: member lookup/lists,
owner batches, accepted-member batches, paged membership and owner-controlled VIP
pricing. `MemberDirectoryEntryDto` contains the existing membership view, not the
attendance/counter/invitation-audit document. Queries allow up to 4096 owner IDs,
1 MiB of JSON, pages of 1–1000 items and 2-MiB responses. Null, empty and absent
results retain their canonical distinctions; failed VIP reads never become free pricing.

`EventMembershipFacts` and `AssetMembershipFacts` narrow the existing ownership
APIs to the facts used by `MemberPolicyFacts`. Their DTOs carry five event fields
and four asset fields; lifecycle/role/workspace policy still runs in its original
owner. They grant no mutation or actor authority. Canonical ownership services
implement these ports through the existing API inheritance, so the monolith uses
its original queries. Remote fixtures verify serialization and context; existing
canonical access-control/resource tests verify local rules.

The identity port reuses `ProfileDirectoryService` and its existing repository
queries. Payment administration, affiliate validation and refund notification
consume this focused port. The remaining profile consumers still need their own
use-case contracts; there is no aggregated profile snapshot.

Helm supplies each binding’s `myscoutee.remote.<propertyPrefix>.*` settings using
the private workload secret inventory. Upgrading that inventory atomically adds
missing tokens and preserves existing credentials. The JAR audit checks both domain ownership and actual generated
client/server imports, including fully qualified source references.

Supply `myscoutee.remote.localization.read-token` privately to owner/consumers
and `myscoutee.remote.localization.url` to consumers. Generate at least 256 random
bits for this dedicated read secret and rotate both ends together. HTTPS is
required unless `myscoutee.remote.localization.allow-insecure-http=true` explicitly
selects an isolated lab network. Keep the internal endpoint out of public ingress.
It accepts a mandatory REAL/DEMO mode only after authentication, restores request
context on errors and grants no actor/workspace authority.

The client permits eight concurrent reads, no queue, 1-second connect / 3-second
total defaults and a 2-MiB response maximum. There are no redirects, automatic
retries or local fallbacks. `myscoutee.remote.requests` uses fixed operation/outcome
labels. Other interfaces, including formatted `Translations.t`, remain unbound.

```sh
microservices/tools/lab.sh jars
node microservices/tools/verify-transport-contracts.mjs
python3 microservices/tools/test_infra.py
```

HTTP tests use the real canonical owners and actual loopback sockets with mocked
repository/Mongo fixtures. They prove wire/language/version/null parity, mode isolation,
credential rejection, bounded errors and live metrics. They do not prove Mongo
persistence, inter-pod networking or delegated user authority. The contract check
reuses Ajv from the backend checkout's existing frontend dependencies.

## Empty scheduled passes and chat waits

Content moderation, event watching, promotional email planning and scheduled
basket expiry use the existing shared Mongo change stream to remember whether
the current database contains candidate work. An empty pass returns from memory;
no new watcher process, polling query or scheduler-rule cache is introduced.
The check is separate for REAL/DEMO, with aliases sharing the REAL cursor when
both modes use one database. Subscribe-before-reconcile, change-during-query
rescheduling and reconnect reconciliation come from `MongoChangeStreamService`.
Disconnected streams do not declare their old presence result authoritative.

Presence includes future candidates and committed moderation effects. Therefore
time passing or an admin edit cannot make a truly empty collection silently
become due work. When candidates exist, the established scheduler still checks
current admin configuration and retains its atomic claim/history path. Withheld
moderation items remain candidates for release when moderation is disabled;
active promotional workers retain their cancellation path. Basket expiry still
receives its existing owner HTTP call, but the owner skips empty claims/queries.
This is suppression of empty I/O, not removal of every minute timer or conversion
of all remaining workers to exact deadline scheduling. Admin telemetry's
clock-derived graph/queue refresh is retained in this change.

Chat Redis `XREAD` defaults to a 10-second blocking wait (also in dev/E2E Compose).
Incoming records wake it immediately; this is not a delivery/batching delay.
The dedicated chat consumer thread and Spring/Lettuce's dedicated blocking
connection leave normal Redis operations available. Default Lettuce command
timeout is 60 seconds; custom deployment timeouts must remain above the selected
block time. `CHAT_STREAM_BLOCK_MS` remains configurable.
`python3 packaging/tests/chat-redis-blocking-test.py` verifies the actual packaged
client libraries against isolated cached Redis: concurrent SET/GET, immediate
XADD wakeup, empty timeout and interrupt shutdown. It does not use application data.

## Landing availability without application requests

Kubernetes uses the **existing readiness probes** (`/health`, every five seconds).
The gateway's canonical Go status receiver is built with the infrastructure
adapter in [`runtime-status/kubernetes.go`](runtime-status/kubernetes.go). One
namespace-scoped EndpointSlice list/watch tracks the configured backend Services;
all expected Services need at least one ready, non-terminating endpoint. Losing
one redundant pod does not change the aggregate. No separate backend heartbeat,
Redis status store, or additional health request is used in Kubernetes.

The adapter and its Dockerfile live under `microservices`; the Helm chart owns
its ServiceAccount and namespace-only `list/watch endpointslices` Role. No
cluster-wide or Secret-reading permission is granted. Projected service-account
tokens are reread on each API connection. TLS uses the mounted cluster CA.
An initial list supplies a resourceVersion, followed by a watch. Normal 30-second
watch timeouts resume from that version; failed watches and expired versions
invalidate readiness and reconcile a fresh list after a two-second retry delay.
Each connection has a 40-second deadline, bounding a silent API stall; discovery
and Kubernetes probe/node detection delays still apply. The latest known state
must not be treated as indefinitely healthy after losing the observer.

**Monolith / Compose / E2E remain independent of Kubernetes.** Their canonical
receiver is built without the adapter and retains authenticated backend pushes
every five seconds and twenty-second per-instance leases. The existing dedicated
credential volume and shutdown DOWN message remain. Expiration wakes SSE readers
at the next lease deadline; it does not poll the application. The private push
listener exists only in this mode.

Both modes expose the same public `/api/runtime-status` snapshot (`ready`,
`known`, `checkedAt`) and `/api/runtime-status/events` SSE stream through nginx.
The stream sends an initial snapshot and aggregate changes, including recovery.
Fifteen-second transport pings keep the connection observable; they are not
backend probes. The browser marks a failed or silent (45 seconds) stream
unavailable and reconnects. A local ten-second timer still retries deferred safe
navigation (such as waiting for a popup to close), but performs no status HTTP
poll. Initial page/eligible-session bootstrap reads and existing identity/data
switching restrictions remain. Native local/GitHub builds do not open this stream.
No Kubernetes objects, credentials or management details reach the browser.

Nginx still embeds the snapshot in the HTML head through SSI. A missing,
malformed or older-than-ten-seconds bootstrap snapshot is not ready. Anonymous
landing recovery uses a fresh bootstrap and existing local adapters; an open
form/popup defers it. Real/operator/support identities are never converted to
synthetic users, and active demo recovery retains its natural-reload policy.
Cached-shell fallback still removes old readiness snapshots.

Build via the existing `tools/lab.sh frontend-image` action (optimized Angular
bundle, canonical receiver image, then microservices adapter), or
`tools/lab.sh frontend-package` for receiver-only packaging of an existing
bundle. The Docker builds use cached images and `--network=none --pull=false`.
No Java, supporting-service or Terraform VM rebuild is required. Disabling the
old heartbeat through Helm environment configuration does restart the six Java
pods once. Full monolith E2E and browser-operated failover are separate proof
boundaries from the focused receiver and frontend tests.

## Required final application milestone

Serve the production-built frontend and routed services at one loopback-only
localhost entry point with a versioned forwarding lifecycle. Run the existing
`e2e/stress/backend` harness against that ingress with isolated fixtures, exact
image identities, error/latency/throughput results and guest resource measurements.
Do not launch the harness documentation's monolith Compose example for this lab.
Preserve the user's browser control under the repository QA rules. These remain
unfinished acceptance criteria, not claims implied by a ready k3s API.

The English [Microservices Guide](../guides/manuals/MyScoutee_Microservices_Guide_EN.pdf)
uses the existing M logo, shared manual stylesheet and PDF generator. Version
0.1.0 is an implementation preview. Update it with the final application/stress
results; it is listed in the backend/frontend README documentation tables.

## Cleanup and evidence

```sh
bash microservices/tools/cleanup-lab.sh --purge-host # full owned removal; deletes lab data
# Or select operations individually:
python3 microservices/tools/vm.py stop          # retain lab data
python3 microservices/tools/vm.py destroy       # explicitly delete lab VM/data
sudo python3 microservices/tools/host.py purge  # tracked additions, after destroy
microservices/tools/lab.sh monitoring-destroy  # only this stack and its volumes
microservices/tools/lab.sh clean-images        # only recorded unchanged task tags
microservices/tools/lab.sh clean-build         # only shell-generated build output
microservices/tools/terraform.sh clean-tools   # only downloaded lab tooling/cache
```

Image cleanup checks recorded image IDs, refuses changed tags, uses no `--force`
and never prunes shared Docker caches or unrelated images. Inventory is kept in
private lab state. Host setup has a separate root inventory. Purge refuses
changed package versions, foreign libvirt resources and apt plans affecting
unowned dependencies; it never runs autoremove. Tiny lifecycle lock files may
remain for safe command locking.

MSC-120 changes: canonical dependency version/policy extraction, the accounts
realtime following DTO boundary and its wire-parity tests, and removal of an
unused community document import, focused media DTOs and the profile-identity
port with its three payment consumers. MSC-121 changes: this shell, service runtime
base stages, monitoring, infrastructure definitions and the English
[implementation plan](../guides/plans/MICROSERVICES_ARCHITECTURE.md).

Validated: six JAR ownership audits, six current image builds, 108 targeted
canonical tests from the earlier qualification, 93 current shell tests, 969 HTTP
responses against twenty-three OpenAPI contracts, 24 infrastructure safety tests, Terraform schema validation, monitoring and KVM/k3s bootstrap.
The latest canonical changes also pass seven `MediaPolicyFactsTest` cases and
ten profile-identity/payment-consumer tests. The narrowed membership-policy ports
also pass 119 existing access-control/resource tests; the membership-read narrowing
passes 15 existing workspace-selection/filter tests. HTTP tests use real sockets with
mocked repository/Mongo fixtures; profile-identity HTTP tests mock the canonical
port, whose mapping and consumers are checked separately by canonical JUnit. Full application startup, business flows against shared Mongo, delegated
context and stress measurements remain open. Trust validation reports pre-existing AGENTS.md size and
missing PROJECT_CONTEXT/PRODUCTION_QUALIFICATION references; the added card has no
broken references.

Cleanup verification: repeated monitoring startup retained the same container IDs;
destroy removed only its containers, network and volumes and was safe to repeat.
Recorded service image cleanup was safe to repeat, preserved all unrelated tagged
images and was followed by a successful cached rebuild. Private Terraform tooling
cleanup also passed twice. Those cleanup checks were historical qualification runs. The lab was subsequently
recreated: host monitoring, the guest, MongoDB, Redis, MinIO, frontend, MCP, STUN, DEMO registry and payment simulator are running.
Service images and JARs remain available.
The VM's graceful stop/restart preserved identity. Terraform destroy then removed
all seven resources and the owned disk directory, and repeated destroy/stop passed.
The recreated VM is running by explicit startup; host boot enablement remains disabled.

## Remaining database polling

The numbered [database polling audit](DATABASE_POLLING_AUDIT.md) records the
existing service owners, default cadences, empty-queue reads, deadline/recovery
requirements and follow-up boundaries. Affinity task discovery now uses one
change stream per configured database with fallback polling disabled. Normal
Compose replica defaults and isolated bootstrap verification are documented in
[the packaging guide](../packaging/README.md#default-mongo-replica-set-and-change-streams).
