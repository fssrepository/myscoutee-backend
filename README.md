# MyScoutee Backend

**The platform behind meetings, not swipes.**

MyScoutee Backend powers group- and event-centred social experiences. It turns
editable 1–10 priorities and mutual affinity into compatible groups, then
supports their journey through chat, events, coordination, and feedback.

Its goal is a **completed, mutually welcomed real-world meeting**—not simply a
match or a message.

## Downloads

### Installer

The **MyScoutee 1.0.1** Debian installer for **amd64**, client tools,
SHA-256 checksums, and signed release metadata are available from
[GitHub Releases](https://github.com/fssrepository/myscoutee/releases/tag/v1.0.1).

See the [installation guide](packaging/README.md) for deployment instructions
and the [release notes](guides/releases/v1.0.1.md) for changes and compatibility.

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


## QA status

The delegated [Event Mode regression](guides/qa/checklists/event/EVENT-MODE-REGRESSION-001-20260921-progress.md)
and [Integration API extension](guides/qa/checklists/integration/INTEGRATION-API-001.md#extension-result--2026-09-22)
are closed on 2026-09-22, with evidence boundaries recorded in their results.
The separate [activity-rating comparison](guides/qa/checklists/event/EVENT-ACTIVITY-RATING-001.md)
is queued only. The [QA matrix](guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx)
and its [CSV source](guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv) own current status.
