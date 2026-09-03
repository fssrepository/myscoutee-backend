# MyScoutee Backend

**The platform behind meetings, not swipes.**

MyScoutee Backend powers group- and event-centred social experiences. It turns
editable 1–10 priorities and mutual affinity into compatible groups, then
supports their journey through chat, events, coordination, and feedback.

Its goal is a **completed, mutually welcomed real-world meeting**—not simply a
match or a message.

## Downloads

### Prerelease installer

A QA prerelease Debian installer, client tools, and their SHA-256 checksum
files are available from [GitHub Releases](https://github.com/fssrepository/myscoutee/releases).
These builds are intended for installation and integration testing while the
remaining qualification work is completed.

### Manual QA status and estimate

**2026-09-03:** 84/118 passed — core 84/98, external/optional 0/20; QA infrastructure 2/2, Identity & access 8/8, Tournament 15/15 and Chat 6/6 complete; `ASSET-LIFE-001`, `ASSET-VIS-001` and the consolidated `ASSET-MEMBER-LIFECYCLE-001` are PASS/CLOSED; `ASSET-ASSIGNMENT-LIFECYCLE-001` is the staged next checkpoint, while Borrow is deferred and not staged during the payment-interface rewrite; the new Core `EVENT-CHECKOUT-DUMMY-001` and `ASSET-CHECKOUT-DUMMY-001` rows capture the complete manual dummy-payment/button-state journeys as NOT RUN; `EVENT-SCHEDULERS-001`, `EVENT-SLOT-TOURNAMENT-001`, `EVENT-EDIT-RUNTIME-001` and `JOB-PURGE` are PASS/CLOSED; verified Firebase, messaging and deployment-state journeys are consolidated under the external `DEPLOY-FIREBASE-LIFECYCLE-001` production-like VMware/Firebase run.

| Remaining phase | Scope | Estimate |
|---|---|---:|
| Hard multi-model QA | Approximately 30–35 high-complexity cases | 1 Week |
| Core completion | Remaining core cases | 1 Week |
| External/optional QA | Remaining external/optional cases | 1 Week |
| Provider-dependent integrations | Locally executable cases requiring an external provider, merchant account, or domain | 1 Week |
| **Cumulative** | **All remaining QA phases** | **1 Month** |

### Documentation PDFs

| Document | Document version | Applies to | PDF |
|---|---:|---:|---|
| Operations Manual | 1.0.0 | MyScoutee 1.0.0 | [PDF](guides/manuals/MyScoutee_Operations_Manual_v1.0.0_EN.pdf) |
| Administrator Manual | 1.0.0 | MyScoutee 1.0.0 | [PDF](guides/manuals/MyScoutee_Administrator_Manual_v1.0.0_EN.pdf) |
| User Manual | 1.0.0 | MyScoutee 1.0.0 | [PDF](guides/manuals/MyScoutee_User_Manual_v1.0.0_EN.pdf) |
| Local VM QA Test Guide & Pair-QA Handover | 1.0.0 | MyScoutee 1.0.0 QA campaign | [PDF](guides/qa/manuals/MyScoutee_Local_VM_QA_Test_Guide_v1.0.0_EN.pdf) |

Editable manual sources and PDF build instructions are in
[`guides/manuals`](guides/manuals/README.md).

### Presentations

| Presentation | Version | PDF | PowerPoint |
|---|---:|---|---|
| MyScoutee Network | 1.0.0 | [PDF](guides/pitches/network-output/MyScoutee_Network_Pitch_v1.0.0_EN.pdf) | [PPTX](guides/pitches/network-output/MyScoutee_Network_Pitch_v1.0.0_EN.pptx) |
| MyScoutee Product | 1.0.0 | [PDF](guides/pitches/product-output/MyScoutee_Product_Pitch_v1.0.0_EN.pdf) | [PPTX](guides/pitches/product-output/MyScoutee_Product_Pitch_v1.0.0_EN.pptx) |
