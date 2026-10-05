# MyScoutee Backend

**The platform behind meetings, not swipes.**

MyScoutee Backend powers group- and event-centred social experiences. It turns
editable 1–10 priorities and mutual affinity into compatible groups, then
supports their journey through chat, events, coordination, and feedback.

Its goal is a **completed, mutually welcomed real-world meeting**—not simply a
match or a message.

## Downloads

### Installer

The next feature release is **1.3.0**, with Git tag `v1.3.0`. See the
[1.3.0 release preparation](guides/releases/v1.3.0.md); it is not published yet.

The **MyScoutee 1.0.2** client tools, partial-update prerequisites, container
references, checksums and signed metadata are available from
[GitHub Releases](https://github.com/fssrepository/myscoutee/releases/tag/v1.0.2).
The signed amd64 Debian installer is built; its upload is handled separately
by the release owner.

See the [installation guide](packaging/README.md) and
[release notes](guides/releases/v1.0.2.md) for the partial-update scope and evidence.

### Documentation PDFs

| Document | Document version | Applies to | PDF |
|---|---:|---:|---|
| Operations Manual | 1.0.0 | MyScoutee 1.0.0 | [PDF](guides/manuals/MyScoutee_Operations_Manual_v1.0.0_EN.pdf) |
| Administrator Manual | 1.0.0 | MyScoutee 1.0.0 | [PDF](guides/manuals/MyScoutee_Administrator_Manual_v1.0.0_EN.pdf) |
| User Manual | 1.0.0 | MyScoutee 1.0.0 | [PDF](guides/manuals/MyScoutee_User_Manual_v1.0.0_EN.pdf) |
| Integration API Guide | 1.0.1 | MyScoutee 1.0.1 | [PDF](guides/manuals/MyScoutee_Integration_API_Guide_v1.0.1_EN.pdf) |

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

The [QA matrix (XLSX)](guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx)
and its [CSV source](guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv)
record test results, evidence and the scope of each case.

The [MyScoutee roadmap](https://github.com/fssrepository/myscoutee-roadmap/tree/master/guides/project-history/myscoutee)
contains the task history, workstream effort and measurement method.

## Manual QA status

As of 2026-10-06, the [canonical QA ledger](guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv)
contains 141 cases: 120 passed and 21 NOT RUN. The existing explanation-guide
case is reopened for the expanded Work/Community scope; its earlier evidence
remains historical. Continue from the [current handoff](guides/qa/handoffs/CURRENT_QA_SESSION.md)
and [MSC-115 checklist and conversation review](guides/qa/checklists/MSC-115_WORK_COMMUNITY_PAIR_QA.md).
