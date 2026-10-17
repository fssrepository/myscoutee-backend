# MyScoutee Backend

**The platform behind meetings, not swipes.**

MyScoutee Backend supports Dating, Work and Community experiences: mutual
priorities, group and event coordination, work campaigns, service offerings,
community cases, announcements and voting. Ratings remain human decisions;
API/MCP exposes the permitted organizing operations and scoped queries.

Development QA results and deployment qualification are recorded in the
[verification ledger](guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv).
The Java client and MCP adapter provide Blocked / Write / Read / Full access
packs, OAuth Events and scoped administrator/operator statistics.

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
Production installer qualification remains separate from this source snapshot.
[Task usage and restorable Project](guides/project-history/README.md) retain the
measured delivery history. The reusable template and components are delivered.

## Downloads

### Installer

The current installer release is **1.4.1**, with its Debian package, client tools,
checksums, container references and signed metadata available from
[GitHub Releases](https://github.com/fssrepository/myscoutee/releases/tag/v1.4.1).

See the [installation guide](packaging/README.md),
[1.4.1 installer release notes](guides/releases/v1.4.1.md) and
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

The Project records **40,360,397,264 measured tokens** through October 17,
07:51:53 UTC. [Task measurements and method](https://github.com/fssrepository/myscoutee-roadmap/tree/master/guides/project-history/myscoutee)
retain the allocation boundaries; full API valuation is incomplete.

![Daily AI token usage](https://raw.githubusercontent.com/fssrepository/myscoutee-roadmap/master/guides/project-history/media/token-activity.png)

## QA status

The development ledger records **146 complete scenarios out of 146** as of
October 17. Results apply to their recorded scope. The separate
[template regression](../myscoutee-template/guides/qa/evidence/general/MSC115-TEMPLATE-REGRESSION.json)
is **PASS / CLOSED through points 1–32** on October 17, including the call and
notification deltas and fixture/runtime cleanup.

Physical devices, external networks and deployed-provider behavior retain their
[separate qualification record](guides/qualification/MSC117_118_LIVE_CHECKS.md).
