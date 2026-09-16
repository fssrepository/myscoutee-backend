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

**2026-09-16:** 101/104 passed; QA infrastructure 2/2, Identity & access 8/8, Event 49/49, Tournament 15/15 and Chat 6/6 complete; Notifications 6/6. `UI-POLL-JANK-001` is PASS/CLOSED after user-authorized CDP recordings, two SmartList fixes and session-close attribution; its fixture and managed browsers are cleaned up. `MOBILE-WEBVIEW-LIFECYCLE-001` is PASS/CLOSED: the final desktop allowed-paste and physical-phone fresh native clipboard Allow/paste checks passed, popup layouts remained intact, and the test Asset stayed unchanged. Earlier cache, image, install, local-device, consent and session evidence is retained; fixtures and managed browsers are cleaned up. `MOBILE-PUSH-LIFECYCLE-001` is PASS/CLOSED: physical foreground/background, closed-PWA route/read, denial and replacement-token checks passed; 14 focused queue decision tests passed. User accepted closure with the recorded native re-prompt and stopped-Chrome qualifications. The versioned rollback restored the retained Mongo baseline, removed the owned Firebase identity and restored device settings; its repeated run also passed. `NOTIFICATION-ADMIN-LIFECYCLE-001` is PASS/CLOSED: rule save/reopen/rejection, one scheduled no-Firebase delivery, read, live Monitoring, unchanged second pass and exact reset passed. `JOB-MESSAGES` is PASS/CLOSED: both business branches passed, Job Detail now shows latest task results and next due dates, the focused live/reopen/mobile retest and five service tests passed, and fixture/runtime cleanup is complete. `BELL-RATING-LIFECYCLE-001` is PASS/CLOSED: shared rating4/3, bell/read, Statistics/Monitoring, real graph materialization and feedback worker/read checks passed; exact fixture cleanup completed. `ADMIN-MONITORING-001` is PASS/CLOSED after all20 checks, scoped defect corrections and exact fixture/session cleanup. `ADMIN-AFFINITY-GRAPH-001` is PASS/CLOSED: all23 checks, readable desktop/mobile graph, camera-stable mobile panel overlay, normal materialization and bounded loading, exact Statistics/fixture/session cleanup. `ADMIN-PARAMETERS-001` is PASS/CLOSED: all seven sections, consumer effects, validation/cancellation and exact fixture restoration verified; shared Monitoring History evidence reused. Administration is4/4. Operator is3/4: Registry and Revenue are PASS/CLOSED; Configuration is now PASS/CLOSED after changed Firebase Save, masked reopen, successful Auth/Message tests, activation/entry-mode verification and exact fixture/runtime restoration. Actual Firebase sign-in/logout/re-login reuses the physical WebView evidence from September14; it was not rerun. The [Configuration checklist](guides/qa/checklists/operator/OPERATOR-CONFIGURATION-LIFECYCLE-001.md) has C01–C03. Update remains IN PROGRESS on VMware with dev stopped. A real UI Apply from full current-source QA1 r2 installed signed QA2 successfully; retained Mongo/MinIO/configuration controls match. The current-source local signed-release replay reached100% in the original popup without reload, and reopened QA2 exposes its exact QA1 recovery action. The independent host reader is now live-qualified: the original popup reached100% through API downtime, exact QA2 image health and retained data checks passed. Reopening does not discover releases; explicit Check does. The success-path Rollback control and duplicate success notice are corrected (76 focused tests); voluntary UI rollback, controlled failure/retry and managed HTTPS remain incomplete. Deployment UI smoke, security and measured infrastructure efficiency remain separately tracked in the [deployment qualification table](guides/releases/PRERELEASE_DEPLOYMENT_QUALIFICATION.md).

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
