# MyScoutee Backend

**The platform behind meetings, not swipes.**

MyScoutee Backend supports Dating, Work and Community experiences: mutual
priorities, group and event coordination, work campaigns, service offerings,
community cases, announcements and voting. Ratings remain human decisions;
API/MCP exposes the permitted organizing operations and scoped queries.

MSC-115 through MSC-119 development is consolidated on **master**.
The Java client and MCP adapter are **1.6.0** on their master branches,
with Blocked / Write / Read / Full access packs, OAuth Events and read-only
administrator/operator statistics. Execution QA for the extensions remains pending.

See the [consolidation and recovery record](guides/plans/MSC-119_BRANCH_CONSOLIDATION.md)
and the MCP repository's
[publication handoff](https://github.com/fssrepository/myscoutee-mcp/blob/master/plugins/PUBLICATION_HANDOFF.md).

Its goal is a **completed, mutually welcomed real-world meeting**—not simply a
match or a message.

## Microservices playground

[MSC-121](https://github.com/fssrepository/myscoutee-roadmap/issues/159) is closed
for developer-playground delivery. The final verified lab is Helm **123**, with
six backends, Mongo StatefulSet **2/2**, shared change streams/cache invalidation,
Kubernetes status/SSE and a bounded blocking Redis telemetry reader. Infrastructure
and operations are versioned in [microservices](microservices/README.md).
[Delivery and test evidence](microservices/PROGRESS.md) ·
[CPU attribution](microservices/IDLE_CPU_PROFILE_2026-10-09.md) ·
[Polling/freshness audit](microservices/DATABASE_POLLING_AUDIT.md).

The latest reader passed **28 focused tests** and live durable-cursor checks.
Broad feature QA and production qualification remain separate. This closeout
does not merge the development branch or publish a new installer.
[Task usage and restorable Project](guides/project-history/README.md) are refreshed
through the October-9 implementation cutoff; MSC-122 extraction remains Todo.

## Downloads

### Installer

The latest tagged application source is **1.3.3**. The latest complete installer
release remains **1.3.0**, with its Debian package, client tools, checksums,
container references and release metadata available from
[GitHub Releases](https://github.com/fssrepository/myscoutee/releases/tag/v1.3.0).

See the [installation guide](packaging/README.md),
[1.3.0 installer release notes](guides/releases/v1.3.0.md) and
[1.3.3 application update notes](guides/releases/v1.3.3.md).
The later application updates do not replace the full installer release.

### Documentation PDFs

| Document | Document version | Applies to | PDF |
|---|---:|---:|---|
| Operations Manual | 1.0.0 | MyScoutee 1.0.0 | [PDF](guides/manuals/MyScoutee_Operations_Manual_v1.0.0_EN.pdf) |
| Administrator Manual | 1.0.0 | MyScoutee 1.0.0 | [PDF](guides/manuals/MyScoutee_Administrator_Manual_v1.0.0_EN.pdf) |
| User Manual | 1.0.0 | MyScoutee 1.0.0 | [PDF](guides/manuals/MyScoutee_User_Manual_v1.0.0_EN.pdf) |
| Integration API Guide | 1.0.1 | 1.0.1 + MSC-119 source extensions | [PDF](guides/manuals/MyScoutee_Integration_API_Guide_v1.0.1_EN.pdf) |
| MCP User Guide | 1.0.0 | MCP / client 1.6.0 · MSC-119 | [PDF](guides/manuals/MyScoutee_MCP_User_Guide_v1.0.0_EN.pdf) |
| Microservices Guide | 0.1.1 | MSC-121; KVM/Helm, replica set, operations and monolith comparison | [HTML source](guides/manuals/myscoutee-microservices-guide-en.html) · [PDF](guides/manuals/MyScoutee_Microservices_Guide_EN.pdf) |

Document versions are independent of software versions. The MCP guide documents
MSC-119 source behavior, including its pending live-host QA.

Editable manual sources and PDF build instructions are in
[`guides/manuals`](guides/manuals/README.md).

### Presentations

| Presentation | Version | PDF | PowerPoint |
|---|---:|---|---|
| MyScoutee Network | 1.0.0 | [PDF](guides/pitches/network-output/MyScoutee_Network_Pitch_v1.0.0_EN.pdf) | [PPTX](guides/pitches/network-output/MyScoutee_Network_Pitch_v1.0.0_EN.pptx) |
| MyScoutee Product | 1.0.0 | [PDF](guides/pitches/product-output/MyScoutee_Product_Pitch_v1.0.0_EN.pdf) | [PPTX](guides/pitches/product-output/MyScoutee_Product_Pitch_v1.0.0_EN.pptx) |


## Registry and MCP Compose environments

The backend starts its own Registry and MCP services in the selected stack;
the sibling repositories' standalone `compose.yaml` files are not launched
implicitly. Select exactly one backend model for an invocation:

| Mode | Compose file | Registry / MCP image suffix | Automatic restart |
| --- | --- | --- | --- |
| Dev | `server/docker-compose-dev.yml` | `-dev` | Disabled |
| E2E | `server/docker-compose.e2e.yml` | `-e2e` | Disabled |
| Prod | `server/docker-compose-prod.yml` | `-prod` | `unless-stopped` |

Dev MCP uses `MCP_DEV_IMAGE`, E2E uses `MCP_E2E_IMAGE`, and production retains
`MCP_IMAGE` for the release tooling. Registry uses `LOCAL_REGISTRY_IMAGE`,
`REGISTRY_E2E_IMAGE`, and `REGISTRY_DEMO_IMAGE`, respectively. These independent
selectors prevent an exported production image setting from changing the dev
or E2E service. MCP always connects to `profilemanagement` on its own stack's
network. Registry data volumes and deployment-client key/state paths are
separate across the three environments.

The source production model uses the `myscoutee-prod` project; dev retains
`server` and E2E uses `myscoutee-e2e`. Registry container names are `registry`,
`registry-e2e`, and `registry-demo`; MCP names are `mcp-dev`, `mcp-e2e`, and `mcp`.
Use Compose service names (`docker compose -f ... logs mcp`, for example) for
mode-specific lifecycle commands. Changes to existing container names take
effect on the next explicit Compose recreation.

The production application's Registry serves its isolated Explore/demo data
using a production image. The independent central Registry uses the sibling
repository's production model with demo seeding disabled. Installed backend
releases continue to use `packaging/compose/docker-compose.production.yml`
and their existing deployment tooling. Other legacy backend services still
have fixed container names and shared published ports; this separation does
not make whole dev/E2E/prod stacks concurrently runnable on one Docker host.

## Development release source

The dev Compose stack includes a local HTTPS `release-simulator` for release
discovery and actual package downloads. Existing configuration selects it in
development; production keeps GitHub. See the [local release fixture guide](guides/qa/tools/OPERATOR-UPDATE-LOCAL-RELEASE.md#persistent-dev-compose-service)
for adding signed local packages and simulating interrupted downloads.

## Verification and project history

The [development QA matrix (XLSX)](guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx)
and its [CSV source](guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv)
record test results, evidence and the scope of each case.

The [MyScoutee roadmap](https://github.com/fssrepository/myscoutee-roadmap/tree/master/guides/project-history/myscoutee)
contains the task history, workstream effort and measurement method.

## Manual QA status

As of **2026-10-15**, the [development QA ledger](guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv)
contains **146 scenarios**, excluding four legend rows: **143 complete,
2 partial/in progress and1 not started**. Results apply only to their recorded
scope. The19 MSC-115 rows represent its accepted, closed119-step development
campaign; they are not additional pending runs.

The live Project has one open task: **MSC-117**.
MSC-116 is closed for its consolidated development scope: access, Events,
central Feedback and the remaining MSC-119 guide introduction. Its existing
[checklist](guides/qa/checklists/api/MSC-116_AUTOMATIC_QA.md) records results through
step85. MSC-119 remains closed; no separate QA run or testcase was added.
Template runtime and real external-host/publication qualification retain their
separate records. KVM and the monolith are stopped at the user's request.

MSC-117 credits October12 shared two-party/repeated/KVM browser call evidence;
its remaining group-media, paging/RTP, controls and call guides have an ordered
[29-step checklist](guides/qa/checklists/general/CHAT-CALL-001.md).
The closed MSC-118 implementation has user-requested remaining role QA in an
ordered [39-step checklist](guides/qa/checklists/general/ROLE-GUIDES-NOTIFICATIONS-001.md),
crediting today's MSC-115 common-guide/admin evidence.

The sixth open ledger row is the separate existing
[template regression queue](guides/qa/checklists/general/MSC115-TEMPLATE-REGRESSION.md),
not another open product task. Template execution stays there. Physical devices,
external networks and provider/deployed behavior stay in the
[live qualification points](guides/qualification/MSC117_118_LIVE_CHECKS.md)
and the existing MSC-115 live-deployment record, outside development acceptance.

The [dated reconciliation](guides/qa/evidence/general/MSC117_118_QA_RECONCILIATION_20261015.json)
records evidence, ownership and precise unproven boundaries. The active execution
session owns its current step and final results; this reconciliation did not run
new application tests or alter its handoff.
