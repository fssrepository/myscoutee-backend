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

**2026-09-08:** 89/104 passed; QA infrastructure 2/2, Identity & access 8/8, Event 49/49, Tournament 15/15 and Chat 6/6 complete. `ASSET-CHECKOUT-001` is PASS/CLOSED through its full user journey and guarded terminal oracles. The active `ASSET-BORROW-001` one-unit free/paid and exact-scope Organizer-only fixture is staged at `baseline-ready`; its managed browser sessions still need one standard relaunch before step 1. Deployment is not a Pair-QA domain; Operator work is consolidated into four screen-level journeys, real-device push remains in Notifications, and downstream product behavior stays in its owning domain.

| Remaining phase | Scope | Estimate |
|---|---|---:|
| Pair-QA completion | 15 remaining journeys; current complexity range 1005/2435 minutes | 1–2 Weeks |
| **Cumulative** | **The single remaining Pair-QA queue** | **1–2 Weeks** |

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
