# MyScoutee Microservices Implementation Plan

Status: MSC-121 implementation in progress, 2026-10-08. Six independent JARs/images, the first typed localization HTTP read boundary and a script-provisioned headless KVM/k3s guest are verified. Artifact checks, 108 focused MSC-120 regressions, 12 shell tests and 14 infrastructure safety tests pass. Remaining domain bindings, the localhost application deployment and application stress qualification remain open.

Build an experimental deployment shell around the existing MyScoutee backend. The same domain implementation must run in the current multi-tenant application and in separately packaged services. Keep business source files in their current repository; add only the build composition, application entry points, transport adapters and deployment configuration needed to run selected domains in separate processes.

The initial directory will be `microservices/`. Design it so that it can later become a separate `myscoutee-microservices` repository, included at the same path as a Git submodule. This can remain the long-term architecture: separate deployment artifacts do not require separate copies of the domain source.

## Existing foundation

The [cross-domain progress record](BACKEND_CROSS_DOMAIN_PROGRESS.md) reports all 21 domains implemented and locally verified. The [backend E2E report](BACKEND_CROSS_DOMAIN_E2E.md) records 1,733 local tests, 44 Java HTTP E2E cases and 95 deployed HTTP cases passing. These establish the existing in-process baseline; separate-process execution needs its own evidence.

Planning source snapshot: backend commit `a7cda0e2fff5e1d3b984fb110005ba5c2f277c5d` on `refactor/MSC-120-backend-domain-segregation`. Pin the actual implementation baseline again when work begins.

`server/projects/profile` is a historical application container. The project originally anticipated microservices, while later features accumulated in this Gradle project. Its directory name does not describe the current domain boundary: it now contains the complete backend. Keep that source location as an input to the new shell. A later path rename can be handled independently after both deployment forms work.

| Existing implementation | Use in this work |
| --- | --- |
| `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/` | Canonical business implementations and domain contracts |
| `domain/*/api/` and reviewed `domain/*/dto/` types | Existing dependency boundaries to adapt for remote calls |
| `server/projects/profile/build.gradle` and the existing Gradle wrapper | Java 25, Spring Boot 4.0.8, dependency versions and build conventions |
| `common/config/RepositoryConfig.java` | Existing custom repository factory; replace broad registration with explicit domain registration where required |
| `common/config/MongoRoutingConfig.java` and `common/config/mongo/` | Existing REAL/DEMO database routing and scheduled database traversal |
| `common/config/MongoConverterConfig.java` and `mongo-domain-types.properties` | Existing persisted type identities and conversion behavior |
| `common/config/WebSecurityConfig.java`, account authentication and workspace selection | Existing actor, session, role and workspace semantics |
| `DomainServiceBoundaryTest` | Existing checks against foreign persistence and implementation dependencies |
| `server/docker/images/profilemanagement/prod/Dockerfile` and `packaging/` | Existing runtime image and production packaging conventions |
| `tools/run-backend-junit.sh`, `e2e/functional/backend/`, `e2e/stress/backend/` | Existing verification and comparison tools |

The concrete gap is deployment composition and communication across processes. The completed domain refactor intentionally keeps calls in-process. There is still one application entry point, one main source set and broad component/repository discovery.

## Scope and operating model

Preserve the complete application's multi-tenant behavior, API behavior and persistence semantics. Start with six deployment groups, independently compiled from the canonical sources. The existing monolith remains the behavioral reference; the shell does not introduce another full-monolith `core` image. A shared `CoreApplication` bootstrap is compiled into each service with that service's generated configuration. Its name does not denote a seventh service.

The executable mapping is [`microservices/assemblies.json`](../../microservices/assemblies.json). The initial groups are:

| Deployment | Domains |
| --- | --- |
| identity | accounts, access, administration, platform, operator, registry, integrations |
| community | groups, community, events, campaigns, content, help |
| communication | chat, notifications, email, localization |
| assets | assets, media |
| payments | payments |
| affinity | affinity |

This adapts the discussion's suggested groups to six processes, initially keeping integration and deployment administration with identity. The mapping is adjustable: moving a domain to a new service generates another build project, configuration and Dockerfile. Ten deployments later are supported without changing the source tree or bootstrap mechanism. Dependency and transport bindings must still be reviewed for the new boundary.

Use **one MongoDB process** throughout this local experiment, retaining the existing REAL/DEMO database separation. Service ownership applies to collections and repositories, not to one Mongo container per domain. Do not create separate Mongo instances as groups are split.

The relevant direction from the [shared discussion](https://chatgpt.com/share/6ac62754-e31c-83ed-9f08-e02e46ccda31) is to reuse one source tree, use deployment experiments to test domain boundaries, compare equivalent workloads and keep the laboratory reproducible. Twenty-one domains do not prescribe twenty-one JVMs. Domain ownership remains fixed while deployment groups can change.

This work targets a local laboratory using production-style immutable images. Production migration, a Go rewrite, a high-availability cluster and a database-per-domain migration are separate later decisions. Do not introduce those changes to make the first service start.

## Repository and source ownership

Proposed layout:

```text
myscoutee-backend/
  server/projects/profile/
    src/main/java/com/raxim/myscoutee/
      domain/                         existing business source
      common/                         existing shared infrastructure
    src/main/resources/               canonical resources
  microservices/                      future submodule boundary
    settings.gradle
    build.gradle
    build-logic/                      shared source and packaging conventions
    assemblies.json                   configurable domain/dependency/resource groups
    contracts/                        canonical API/DTO source selection
    bootstrap/                        one shared CoreApplication source
    build/                            ignored generated projects, configuration, JARs
      deployment/                     generated Dockerfile for each service
    transport/
      <domain>/                       HTTP server and client adapters
    transport/contracts/              future internal OpenAPI descriptions
    deploy/
      compose/
      kubernetes/
    infra/
      terraform/
      cloud-init/
    observability/
    tools/
      lab.sh                          preflight, setup, start, stop and cleanup
    README.md
```

The shell owns packaging and remote transport. The backend owns domain implementations, domain interfaces, persistence, reusable domain configuration and general fixes required by both deployment forms. Business rules must not migrate into HTTP controllers or bootstrap classes in the shell.

Accept the backend source location through one explicit build property, such as `backendSourceDir`. In the nested checkout it defaults to the parent repository. In a standalone checkout it must identify a compatible backend checkout explicitly. Fail with an actionable error if that source is absent or incompatible; do not silently download another version.

Record the backend commit, shell commit, contract revision and image digest for every assembled deployment. When the shell becomes a submodule, the parent pins its commit. Keep compatibility information in the shell without requiring the parent commit to contain a hash of itself. No source copies, symlink trees or generated business-code forks are needed.

The existing monolith build must remain usable without initializing the future microservices submodule. Shared configuration classes in the backend must therefore never import shell-only bootstrap or transport classes.

## Build composition

Use Gradle source sets and library projects to compile selected files directly from the existing backend source directories. The first source bridge belongs to the shell's shared build convention; individual services declare their domain set and dependency set through that convention.

Separate three kinds of build input:

1. Domain contracts and their required value types.
2. Domain implementations, persistence and reusable configuration.
3. Explicitly selected shared infrastructure and resources.

Compile each input once per build graph and include it once in each application artifact. A service may depend on another domain's contract library without receiving its implementation or repositories. The executable monolith `bootJar` is not a suitable library dependency for a small service.

Inventory contract dependencies before creating modules. Existing `api` and `dto` packages may reference other contract types, Spring APIs or common types. Resolve that actual closure; directory naming alone does not prove a standalone Java library. Keep contract cycles together in a reviewed contract artifact initially if necessary, while continuing to exclude domain implementations.

Reuse the backend's dependency versions and toolchain through a shared Gradle convention or exported dependency constraints. If the current build does not expose them, extract the minimum reusable build configuration in the backend. Avoid a second manually maintained dependency list in every service.

Use explicit resource inclusion for templates, translations, serializers and Mongo type mappings. Do not copy the entire monolith resource directory into every service. Preserve stored Mongo aliases for all types a service owns, including nested polymorphic values. Verify resource presence and conversion with the actual reduced classpath.

Gradle composite builds become useful if the backend later exports these libraries itself; they can substitute source projects for module dependencies. They do not automatically split the existing application into domain libraries. Keep one active source-composition mechanism. [Gradle composite build documentation](https://docs.gradle.org/current/userguide/composite_builds.html)

A successful artifact check must show that an extracted service has no foreign implementation classes or accidental dependency on the full application output. Separate compilation is part of proving the boundary.

## Domain configuration and application startup

Each domain should expose a reusable configuration entry point under its own package, for example `domain/events/config/EventsDomainConfiguration`. It declares the domain's components, repositories, properties and required shared infrastructure. It obtains other domain capabilities through the existing interfaces.

`@Configuration` marks a source of bean definitions; its value is a bean name, not a package-selection setting. Package discovery is controlled by `@ComponentScan`, while `@Import` explicitly composes configuration classes. Use marker classes through `basePackageClasses` where practical so package refactoring remains type checked. [Spring configuration](https://docs.spring.io/spring-framework/reference/core/beans/java/configuration-annotation.html), [component scanning](https://docs.spring.io/spring-framework/reference/core/beans/classpath-scanning.html)

Keep the following composition boundaries explicit:

- Domain services and persistence.
- Existing public controllers, if that deployment owns their routes.
- Workers, schedulers and event consumers enabled for that deployment.
- Shared Mongo, Redis, serialization and security infrastructure actually required by those components.
- Remote clients and internal HTTP endpoints supplied by the shell.

Do not scan `com.raxim.myscoutee` from a small service. A broad scan can discover unrelated configurations, schedulers and controllers even when the intended domain scan is narrow. Distinct package names also do not guarantee distinct bean names; prevent collisions explicitly and keep bean overriding disabled.

Each artifact compiles the same small Java `main` class in a shell-specific package. Generated `AssemblyConfiguration` supplies the package list for that artifact. The current implementation imports only the selected domain packages and explicitly chosen shared infrastructure. Additional transport configurations will be added as their boundaries are implemented. Conceptually:

```java
// Proposed composition; configuration class names are illustrative.
@SpringBootConfiguration
@EnableAutoConfiguration(exclude = UserDetailsServiceAutoConfiguration.class)
@Import({
    ServiceInfrastructureConfiguration.class,
    EventsDomainConfiguration.class,
    EventsHttpServerConfiguration.class,
    RequiredRemoteClientsConfiguration.class
})
public class CoreApplication {
    public static void main(String[] args) {
        SpringApplication.run(CoreApplication.class, args);
    }
}
```

The production entry point currently excludes `UserDetailsServiceAutoConfiguration`; preserve that intent and audit other auto-configuration against each reduced classpath. Explicit configuration composition is supported by Spring's `@Import` mechanism. [Spring configuration composition](https://docs.spring.io/spring-framework/reference/core/beans/java/composing-configuration-classes.html)

The monolith loads the same domain configuration with local implementations of all required interfaces. The split assembly binds remote clients for domains hosted elsewhere. For each required interface there must be exactly one selected implementation. Do not make a failed remote call silently fall back to local persistence.

Preserve `MongoRepositoryFactoryBean` when introducing domain-specific `@EnableMongoRepositories`. Coordinate that change with the existing broad `RepositoryConfig`: a repository must have exactly one registration owner. Domain configuration must work under both monolith and service startup without relying on duplicate scans.

Audit `common/config` before treating it as a reusable block. For example, the current security and session-routing configuration references several domain implementations. Extract reusable infrastructure or introduce existing contract dependencies at that boundary instead of importing all of `common/config` into every service.

## Existing interfaces over HTTP

Keep existing Java interfaces as the domain-facing dependency boundary. A local service implements the interface in the monolith; a client adapter implements the same interface when the owner runs remotely.

```text
Caller domain
  -> existing Java interface
     -> local implementation
     or
     -> HTTP client adapter
        -> internal HTTP controller
           -> existing owner implementation
```

Use OpenAPI to describe the internal HTTP operations, payloads, errors and security requirements. OpenAPI describes an HTTP API; it does not itself turn arbitrary Java interfaces into network calls. The adapters perform that mapping. [OpenAPI specification](https://spec.openapis.org/oas/latest.html)

Maintain one checked-in OpenAPI description for each extracted wire contract in the shell. Generate transport clients/models where that removes repetitive code, and keep a thin adapter to the canonical domain interface. Validate server behavior against the same description. Do not introduce a second set of business DTOs; wire-only representations exist only where serialization requires a defined conversion.

Start with ordinary request/response operations. Preserve batching, result ordering, pagination, optional versus absent values, timestamps, decimal precision, validation and observable error behavior. A batch interface must remain a batch call rather than become one HTTP request per item.

Classify interfaces before exposing them:

| Contract shape | Treatment |
| --- | --- |
| Value-based query or command | Map to a bounded HTTP operation and preserve existing semantics |
| Java callback or executable parameter | Keep the orchestration local or define explicit job/progress operations before extraction |
| Servlet request or response | Keep at the HTTP boundary; identify the underlying value-based domain operation |
| Stream, large media or long-running work | Define streaming or durable job semantics explicitly |
| Request-scoped authentication or workspace lookup | Supply validated execution context rather than serialize framework objects |

Concrete examples already present are `RandomGroupAssignment.assignRandomGroups(Consumer<Progress>)`, `NotificationJobs.forEachGroup(..., Runnable)` and servlet-based methods in `MediaSessionAccess`. These are valid local contracts, but they are not mechanically serializable remote procedures. This is a reason to choose extraction boundaries carefully, not to redesign every interface in advance.

Internal routes belong to the shell and are reachable only through the intended service network and authentication policy. Keep existing public URLs and frontend behavior stable through the current nginx entry point and explicit route ownership. Do not expose internal adapters as a second public API by default.

## Multi-tenant execution across processes

Preserve the application's existing scopes independently: authenticated account, selected workspace/profile, role or service authority, and REAL/DEMO database mode. A domain split must not redefine a tenant or introduce one database per tenant implicitly.

The current `MongoSessionModeContext` uses a `ThreadLocal`. `GroupWorkspaceFilter` resolves the selected profile and temporarily updates the Spring security context; `WorkspaceContext` reads that authenticated identity. None of these process-local values automatically crosses HTTP or a worker boundary.

Before the first remote operation, define a transport context that can reproduce the same validated execution scope at the receiving service. Reuse the existing account/session and access owners to validate identity, workspace membership and authority. Authenticate the calling service, bind any delegated context to the intended recipient and request, and reject arbitrary actor, workspace or database headers from public clients.

The receiving boundary must establish context before domain execution and restore or clear it in `finally`, including errors and reused executor threads. Background work must persist enough validated scope to resume correctly and reuse `ScheduledMongoSessionRunner` where it already governs configured databases. Cache keys, Redis channels, idempotency keys and durable job identifiers must retain their existing scope or receive an explicit correction if extraction reveals an omission.

Prove these cases with the same operation through local and remote adapters: base account, workspace profile, another workspace denied, REAL/DEMO separation, missing or tampered context denied, and context cleanup after failure. Preserve the existing special routes for operator, integration, media and demo authentication rather than assuming all incoming requests use one token form.

## Data ownership and background work

Use an isolated MongoDB and Redis environment inside the lab. Services may initially share that infrastructure and the existing logical databases, while only the owning domain accesses its collections. Keep the completed ownership rules and type identities intact. Shared database credentials alone do not prove storage-level isolation; per-service collection permissions can be added as a later verification step.

Preserve the deployment's required Mongo replica-set capabilities for change streams. A single-node replica set supplies those capabilities in the lab without claiming database high availability.

Assign every index initializer, scheduler, worker, change-stream subscriber and bootstrap operation to a deployment owner. A domain's implementation must be registered only by the service that owns it. Configuration must prevent two processes from executing a singleton job accidentally.

Reuse existing durable outboxes, job records, claim/lease mechanisms and Redis infrastructure where their semantics fit. Before enabling multiple replicas, prove that concurrent consumers cannot duplicate effects. Process-local locks and listeners require review when their participants move apart.

Set bounded connection and request timeouts. Retry only operations with established safe semantics. For mutations, handle a committed operation whose response was lost through existing idempotency or a narrowly added owner-controlled operation identity. Do not treat an HTTP timeout as evidence that nothing happened, or claim a distributed transaction where only local transactions exist.

## Local KVM laboratory

The 2026-10-07 host inspection found Ubuntu 22.04.5, an i5-1335U with VT-x, working user access to `/dev/kvm`, roughly 15 GiB usable RAM and 240 GB free disk. QEMU, libvirt and Terraform were not installed. These are a planning snapshot; repeat preflight before installation or startup.

Use KVM/QEMU with libvirt, provisioned by Terraform, and one headless Linux VM running k3s. Terraform owns the VM, its storage and the lab network; cloud-init handles guest bootstrap. Versioned Kubernetes manifests own application deployment. Keep each resource under one lifecycle owner. [Terraform libvirt provider](https://github.com/dmacvicar/terraform-provider-libvirt)

The initial target is 4 vCPU, 8 GiB guest RAM and a sparse disk with a defined maximum size. Increase toward 10 GiB only after measuring available host memory with the dev stack stopped. The user's estimated 12 GB availability is a capacity hypothesis, not a measured VM allocation. K3s documents a 2 GB server minimum, before budgeting MyScoutee, databases and monitoring. [K3s requirements](https://docs.k3s.io/installation/requirements)

Run production-style images with explicit limits and bounded JVM heaps and connection pools. Import the built images into the guest's container runtime; a registry can be added only if the later workflow requires it. An additional Docker daemon in the guest is not required for k3s workloads. Record immutable image identities.

The target VM contains Kubernetes networking, databases, application state and monitoring. Host changes are restricted to virtualization packages, lab resources and local tooling. Keep existing Docker and VMware resources outside the lab lifecycle. This is a developer host: VM, network, pool and newly installed host services must never start at host boot. Explicit scripts start the lab. Account for libvirt sockets and guest save/resume; guest k3s may start when the VM is explicitly started.

Build, deployment and timed tests run in separate serial stages on this machine. Respect the existing hot-deploy owner when it is running; do not start a parallel compiler or build to work around it. Check the current runtime again rather than relying on yesterday's dev/E2E state.

## Production style runtime images

Every service image in this shell uses the canonical `application-prod.yaml` and a runtime-only image. The lab's limited memory budget must be available to the application, its required data services and measured monitoring overhead.

| Component | Lab runtime form |
| --- | --- |
| Independent service groups | Built JARs in runtime-only images, reusing the established production Java image conventions |
| Frontend | Compiled static assets baked into the existing nginx production image |
| MongoDB, Redis and required object storage | One shared MongoDB, one Redis where required, and object storage; lab-owned data and bounded resource settings |
| Seed and fixture preparation | Explicit, versioned one-time initialization or import that exits before the measured workload |
| Monitoring | Only the selected collectors and dashboards, with their resource cost included |

The deployed stack must contain no `mongodb-sync`, `frontend-sync`, Angular development server, frontend watcher, Gradle build daemon, Spring DevTools or hot-reload service. It must not mount the source checkout into runtime containers. Build tools belong to the preceding build stage and must not remain running during capacity or performance measurements.

Reuse existing production artifacts where their pinned source version is appropriate, especially the unchanged frontend. Extend the production packaging inputs to select service JARs and lab configuration; do not derive the lab by launching the development Compose stack and disabling a few services afterward.

Production-style packaging does not select production data or external accounts. Supply isolated lab databases, storage, secrets and test integrations explicitly. Start only dependencies required by the selected full-application flows. Any fixture import process must finish and release its resources before application measurements begin.

## Cleanup as part of the first implementation

Create the lifecycle script before installing or starting lab resources. Use `microservices/tools/lab.sh` with the following planned operations:

| Operation | Required behavior |
| --- | --- |
| `preflight` | Report KVM access, memory, disk, ports, package state and existing resources without mutation |
| `setup` | Record pre-existing host state and install only required dependencies |
| `start` | Apply the pinned configuration and verify guest and service readiness |
| `stop` | Shut down the lab while retaining its data |
| `destroy` | Remove the lab VM, owned disks, network and generated access material |
| `purge-host` | Remove only tracked lab-added host dependencies and restore tracked settings where still safe |

Use one private state directory such as `~/.local/state/myscoutee-microservices/<lab-id>/` for Terraform state, disks, generated credentials, logs and the resource inventory. Keep secret state out of Git. Point kubeconfig and tool caches explicitly at lab paths so normal shell and Kubernetes configuration remain untouched.

Terraform destroy handles its owned resources. The wrapper also accounts for downloads, host packages and generated files that Terraform does not own. Verify names, UUIDs and canonical paths against the inventory before deletion. Do not use global Docker prune, broad process killing, firewall flushing or unqualified package autoremove.

Cleanup must be repeatable after a partial setup or failed destroy. Retain the state required to finish removal until managed resources are confirmed gone. `purge-host` must preserve pre-existing packages and settings and report newly shared dependencies it cannot safely remove. Verify cleanup with a fresh setup, start, stop and destroy cycle on disposable lab state.

## Observability and comparison

Reuse Actuator and the existing `/health` and `/metrics` conventions. Verify the Prometheus registry dependency and scrape authorization: the current metrics route requires authority `A`, so a configured path alone does not prove that a collector can scrape it. Add a narrowly scoped lab monitoring arrangement without making an administrative endpoint public.

Start with Prometheus, Grafana and application/container metrics. Measure request rate, error rate, p50/p95/p99 latency, startup, CPU, container memory, JVM heap and GC, connection pools, remote call counts and background-job lag. Use bounded labels; user and workspace identifiers must not become unbounded metrics dimensions.

Propagate a correlation identifier across remote operations. Add distributed tracing when it helps explain measured latency; keep collector and storage overhead within the same memory budget.

Compare the current monolith and the split deployment using the same backend revision, fixture revision, resource budget and workload. Preserve cold-start and warmed measurements separately. Existing E2E performance results are useful historical controls, not guarantees about untested remote calls or service counts.

## Implementation sequence and acceptance

| Phase | Work | Exit evidence |
| --- | --- | --- |
| 1 | Inventory domain dependencies, shared configuration, resources, callback contracts and background owners; select the smallest useful pilot | Explicit service/domain map and local versus remote bindings, with no hidden full-application dependency |
| 2 | Create configurable deployment groups and one reusable bootstrap; build separate JARs and Dockerfiles directly from canonical sources | Artifact identity and class ownership checks; no copied domain code or monolith dependency |
| 3 | Introduce reusable configuration for the pilot and required infrastructure | Both the current monolith and reduced application context load with one registration per bean/repository |
| 4 | Add one OpenAPI contract and its client/server adapters, including validated execution context | Local/remote parity, real HTTP serialization and negative scope tests |
| 5 | Connect the independently packaged groups; assign public routes, workers and collection ownership on one shared MongoDB | Full application flow crosses process boundaries; foreign implementations remain absent |
| 6 | Implement tracked setup and cleanup; provision the KVM/k3s lab | Reproducible start/stop/destroy cycle with unrelated host resources preserved |
| 7 | Run functional, interruption and resource comparisons with monitoring | Versioned results for behavior, lost responses, restart, memory and latency |
| 8 | Extract further deployment groups and prepare repository separation | Each added boundary meets the same gates; shell works from an explicit external backend checkout |

Choose the pilot from the actual dependency graph, with a useful user-visible or background flow and a manageable contract surface. Do not select a domain solely because its folder is small. A simple read proves initial wiring; a mutation with read-back and a scoped worker proves the more consequential boundary before broader extraction.

Reuse the current JUnit runner serially and the existing HTTP/E2E fixtures and runners. Extend `DomainServiceBoundaryTest` or its established checks for artifact boundaries instead of creating a parallel architecture framework. Run relevant existing suites for shared configuration changes, then the complete backend regression at the integrated milestone. Stop the current application before replacing it with another test deployment under the repository resource rules.

Required acceptance evidence includes:

- Both application forms compile the same canonical business source and preserve persisted type identities.
- Reduced artifacts and contexts contain only their declared implementation owners.
- Runtime inventories contain production-style images and no sync containers, source mounts, build daemons or hot-reload processes.
- Public flows work through the existing entry point with equivalent validation and errors.
- Account, workspace, role and REAL/DEMO boundaries survive remote calls and retries.
- Mutations survive read-back, restart and a lost response without duplicate effects.
- Workers and indexes have explicit ownership, including any replica behavior exercised.
- Timed comparisons use pinned artifacts, equivalent fixtures and recorded resource settings.
- Cleanup restores the managed lab boundary and accounts for remaining host changes.

A booting pod proves startup. Completion of the first usable split requires the relevant existing flow to pass across the remote boundary with the correct scope and durable result. Later production adoption requires its own qualification against the production packaging and operational requirements.

## First implementation deliverable

The first packaging increment is a reproducible `microservices/` shell that independently builds the configured groups from canonical sources, with one shared bootstrap, generated composition classes and separate optimized Dockerfiles. This increment is implemented. It is not a working distributed application yet: cross-service bindings, trusted execution context propagation and public routing remain necessary. A usable runtime milestone requires those pieces and a verified real flow across a process boundary, followed by bounded infrastructure and a tested deployment cleanup path.

Keep `projects/profile` as the source location throughout this milestone. The future submodule conversion changes ownership of the shell files; it does not move or duplicate the backend's domain implementation.

## Implementation ownership and reproducible operations

MSC-121 owns `microservices/`, the service image recipes and this deployment plan. MSC-120 owns backward-compatible changes in canonical backend source needed by either packaging form. The first such change replaces the realtime response's direct `Users.FollowingRecord` dependency with an accounts DTO while preserving its JSON fields and stored representation. The canonical dependency versions and security overrides are now shared Gradle inputs; the monolith still builds without `microservices/`. No issue or commit has been created by this work.

All future KVM/headless installation and configuration must be driven by committed scripts, Terraform and cloud-init templates. No manual command sequence may be the only record of a required machine change. Setup must recognize pre-existing packages/resources, reconcile its owned configuration, and be safe to rerun after partial failure. Cleanup removes only resources recorded as created by this lab. Repeated setup and cleanup must be tested. VM images, private keys, secrets, Terraform state and generated kubeconfig remain in the private state directory and outside Git.

Executable operations include `microservices/tools/lab.sh preflight`, `jars`, `images`, `build`, `render`, the monitoring lifecycle and artifact cleanup. `setup-host.sh` runs the tracked Ubuntu host installation and explicit daemon startup. `vm.py` implements prepare/preflight/start/status/stop/destroy with private state, UUID ownership, subnet/capacity checks and rejection of destructive startup plans. `cleanup-lab.sh --purge-host` composes lab destruction, artifact/tool cleanup and guarded package purge. `terraform.sh validate` remains read-only for VM resources. Full application Kubernetes workloads remain pending.

## Communication findings from the current source

The split is a real deployment experiment; keep the implementation suitable for
long-term use, while qualifying each network boundary before treating it as a
finished distributed application. Do not install a saga framework, broker or
service mesh solely because there are multiple JVMs.

| Existing boundary | Finding and next implementation gate |
| --- | --- |
| `accounts.api.ProfileDirectory` → `WorkspaceProfile` projections | First observed startup gap in affinity. Define explicit wire snapshots and batch endpoints, retaining absence, pagination and workspace authority; do not serialize persistence implementations. |
| `platform.api.FirebaseRuntime` | Returns Firebase SDK objects. It cannot be turned into a JSON proxy; credential/runtime creation remains local to its deployment or is replaced with a capability-level remote operation. |
| `media.api.MediaSessionAccess` | Uses servlet request/response and Spring Authentication. Keep HTTP security at the receiving boundary and propagate verified scope; do not send servlet objects over the network. |
| Scheduled APIs accepting `Runnable` / suppliers and measurement cursors | These express in-process execution and streaming. Separate local execution context from remote data/commands; use bounded pages or explicit job requests where required. |
| `payments.service.PaymentAuthorizationCoordinator` → `events.api.EventCheckout` | Existing compensation is reusable business behavior, but currently any runtime exception during fulfillment can trigger refund. A remote timeout can follow a successfully committed reservation. Before enabling this boundary, persist operation identity/state and reconcile unknown outcomes before compensation. This is a concrete candidate for a small durable saga around the existing owner. |
| `integrations.service.IntegrationEncounterPublisher` and `IntegrationWebhookService` | Existing pending publication, deterministic delivery IDs, insert-with-duplicate handling and acknowledgement after outbox insertion already support retries. Extend and verify that owner across lost replies; do not add another outbox implementation. |

The candidate-reference report is a source inventory, not a count of HTTP
endpoints or completed adapters. For each actual binding classify query versus
command, caller authority, serialization, batch behavior, deadline, retry,
idempotency, compensation and restart recovery. A shared Mongo process does not
make calls between JVMs atomic.

The checked-in monitoring now includes pinned Prometheus and Grafana images,
bounded retention and memory, provisioned datasource/dashboard and generated
per-service targets. Service artifacts include the Prometheus registry and a
separate management port. Add trace propagation alongside the first HTTP adapter,
then operation/outbox lag metrics alongside durable workflows. Never put user,
workspace, session or payment identifiers into metric labels. Provisioning health
and a DOWN application target must remain distinguishable from measured traffic.

`infra/terraform` and `infra/guest` now contain exercised KVM/headless/k3s
definitions. The host packages were installed through the versioned scripts in a
user-authenticated terminal. Boot enablement is disabled. Terraform applied the
guest; cloud-init completed and k3s became ready. Repeated start returned No
changes. Graceful stop/restart preserved UUID, disk and SSH identity. Destroy
removed all seven resources and the owned disk directory; repeating destroy and
stop succeeded. Full host package purge and a physical host reboot have not yet
been tested. AppArmor remains enforcing; no global security policy was disabled.

The first wire contract is `transport/contracts/localization/localization-v1.openapi.json`.
It reuses `TranslationBundles` and `I18nBundleResponseDto` with the canonical
`I18nService`. Generated composition selects the owner endpoint or outside
consumer client. A dedicated read credential protects the mandatory REAL/DEMO
mode, with no delegated user/workspace authority implied. Time, response size
and concurrency are bounded; redirects, retries and local fallbacks are absent.
Ten actual loopback HTTP tests plus two management tests pass, and 13 actual
responses validate against OpenAPI. The repositories in these tests are explicit
fixtures, not evidence of Mongo persistence or full distributed startup.

## Required final deliverables added during implementation

- A production-built frontend and the actual split backend must be usable in the
  browser at one localhost entry point. Forwarding and cleanup must be versioned
  and bind only to loopback. Follow the repository's browser-control rules.
- Reuse the existing `e2e/stress/backend` runner against this deployment. Record
  exact images/fixtures, correctness, latency percentiles, throughput and guest
  resources, with a comparable serial monolith baseline. The existing runner's
  monolith Compose example is not the microservices deployment.
- Maintain the English Microservices PDF in the same manual format, M logo,
  shared CSS and PDF generator as the other official manuals; list it in the
  backend and frontend README documentation tables. The initial 0.1.0 preview
  documents verified infrastructure/transport and names the unfinished gates.
  Update the document with final application and stress results before treating
  it as the completed guide.
- Future backend changes must preserve both deployment forms. The trust kernel
  and routing now load `reviews/microservices-compatibility.md` for domain,
  dependency, configuration, worker, transport and deployment work.
