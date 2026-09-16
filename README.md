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

**2026-09-16:** 98/104 passed; QA infrastructure 2/2, Identity & access 8/8, Event 49/49, Tournament 15/15 and Chat 6/6 complete; Notifications 6/6. `UI-POLL-JANK-001` is PASS/CLOSED after user-authorized CDP recordings, two SmartList fixes and session-close attribution; its fixture and managed browsers are cleaned up. `MOBILE-WEBVIEW-LIFECYCLE-001` is PASS/CLOSED: the final desktop allowed-paste and physical-phone fresh native clipboard Allow/paste checks passed, popup layouts remained intact, and the test Asset stayed unchanged. Earlier cache, image, install, local-device, consent and session evidence is retained; fixtures and managed browsers are cleaned up. `MOBILE-PUSH-LIFECYCLE-001` is PASS/CLOSED: physical foreground/background, closed-PWA route/read, denial and replacement-token checks passed; 14 focused queue decision tests passed. User accepted closure with the recorded native re-prompt and stopped-Chrome qualifications. The versioned rollback restored the retained Mongo baseline, removed the owned Firebase identity and restored device settings; its repeated run also passed. `NOTIFICATION-ADMIN-LIFECYCLE-001` is PASS/CLOSED: rule save/reopen/rejection, one scheduled no-Firebase delivery, read, live Monitoring, unchanged second pass and exact reset passed. `JOB-MESSAGES` is PASS/CLOSED: both business branches passed, Job Detail now shows latest task results and next due dates, the focused live/reopen/mobile retest and five service tests passed, and fixture/runtime cleanup is complete. `BELL-RATING-LIFECYCLE-001` is PASS/CLOSED: shared rating4/3, bell/read, Statistics/Monitoring, real graph materialization and feedback worker/read checks passed; exact fixture cleanup completed. `ADMIN-MONITORING-001` is PASS/CLOSED after all20 checks, scoped defect corrections and exact fixture/session cleanup. `ADMIN-AFFINITY-GRAPH-001` is PASS/CLOSED: all23 checks, readable desktop/mobile graph, camera-stable mobile panel overlay, normal materialization and bounded loading, exact Statistics/fixture/session cleanup. `ADMIN-PARAMETERS-001` is PASS/CLOSED: all seven sections, consumer effects, validation/cancellation and exact fixture restoration verified; shared Monitoring History evidence reused. Administration is4/4. Next: `OPERATOR-CONFIGURATION-LIFECYCLE-001`, full-flow execution authorized by the user. Administration and Operator guides are available. Deployment is not a Pair-QA domain; Operator work is consolidated into four screen-level journeys; the [Configuration checklist](guides/qa/checklists/operator/OPERATOR-CONFIGURATION-LIFECYCLE-001.md) now maps C01–C08 and shared WebView evidence, with historical Firebase revision 1 activation evidence and the parent still PARTIAL/OPEN (current Push fixture restores active revision 1 as a prepared prerequisite); real-device push remains in Notifications, and downstream product behavior stays in its owning domain.

| Remaining phase | Scope | Estimate |
|---|---|---:|
| Pair-QA completion | 13 remaining journeys; current complexity range 850/2060 minutes | 1–2 Weeks |
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
