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


## Development release source

The dev Compose stack includes a local HTTPS `release-simulator` for release
discovery and actual package downloads. Existing configuration selects it in
development; production keeps GitHub. See the [local release fixture guide](guides/qa/tools/OPERATOR-UPDATE-LOCAL-RELEASE.md#persistent-dev-compose-service)
for adding signed local packages and simulating interrupted downloads.

## QA status

Group lifecycle QA is **IN PROGRESS**: HTTP **13/29** lifecycle blocks closed, **13/48** across the three Group journeys; current **block 14**, with completed desktop checks from blocks 15–16 retained. Local remains NOT RUN; the other two group journeys remain **NOT RUN**: [group lifecycle](guides/qa/checklists/group/GROUP-LIFECYCLE-001.md),
[workspace isolation samples](guides/qa/checklists/group/GROUP-ISOLATION-001.md)
and [shared participant-link API](guides/qa/checklists/integration/INTEGRATION-API-GROUP-001.md).
See the [current matrix](guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx) for case totals and execution states. Group follows Asset in
domain order; participant-link coverage belongs to API test. Existing PASS
evidence does not cover these new journeys.

The five new delegated cases are tracked in the matrix. [Gallery/Feed/Moderation](guides/qa/evidence/EVENT-GALLERY-FEED-001-20260923-progress.md) is PASS on the user-started dev stack (2026-09-23), with fixture reset complete. [Email QA](guides/qa/evidence/OPERATOR-EMAIL-WARNING-001-20260923-progress.md), including durable retries and the [public unsubscribe/branding supplement](guides/qa/evidence/EMAIL-UNSUBSCRIBE-001-20260923.md), is PASS on the dev stack with cleanup complete. [Admin client QA](guides/qa/evidence/ADMIN-CLIENT-API-001-20260923-progress.md) is PASS in the recorded dev scope, with platform boundaries explicitly NOT RUN and fixture reset. [Affiliate revenue](guides/qa/evidence/AFFILIATE-REVENUE-001-20260923-progress.md) is PASS in the recorded dev HTTP/simulator and frontend-local scope (2026-09-24); production-installation and provider hold-only UI boundaries remain explicit in the evidence. [Calendar export QA](guides/qa/evidence/EVENT-CALENDAR-EXPORT-001-20260924.md) is PASS/CLOSED (2026-09-24), including One-time/Daily/Weekly occurrences, physical imports and an offline native reminder. Importer update/deletion/alarm limitations are recorded; fixture cleanup is complete. Earlier closed cases remain unchanged.

The delegated [Event Mode regression](guides/qa/checklists/event/EVENT-MODE-REGRESSION-001-20260921-progress.md)
and [Integration API extension](guides/qa/checklists/integration/INTEGRATION-API-001.md#extension-result--2026-09-22)
are closed on 2026-09-22, with evidence boundaries recorded in their results.
The separate [activity-rating comparison](guides/qa/checklists/event/EVENT-ACTIVITY-RATING-001.md)
is also closed on 2026-09-22: corrected numbered expectations, retained user observations, automatic continuation through save/reload and feedback checks, and scoped cleanup. The [QA matrix](guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx)
and its [CSV source](guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv) own current status.

[Followed organizers QA](guides/qa/evidence/EVENT-FOLLOWING-001-20260922-progress.md)
is closed on 2026-09-22 in the dev HTTP scope: follow/unfollow, independent
counters, filters, lifecycle/expiry, and compact desktop layout verified;
fixture and managed windows cleaned. Platform limits are recorded in the evidence.

The separate [following menu and confirmation QA](guides/qa/evidence/EVENT-FOLLOWING-002-20260922-progress.md)
is closed on 2026-09-22: all 8 numbered dev HTTP checks passed, including
committed deltas, failed-save retry, immediate list removal and stored-state poll.
Its isolated fixture and browser sessions are cleaned.
