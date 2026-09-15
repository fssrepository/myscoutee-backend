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

**2026-09-15:** 91/104 passed; QA infrastructure 2/2, Identity & access 8/8, Event 49/49, Tournament 15/15 and Chat 6/6 complete; Notifications 2/6. `UI-POLL-JANK-001` is PASS/CLOSED after user-authorized CDP recordings, two SmartList fixes and session-close attribution; its fixture and managed browsers are cleaned up. `MOBILE-WEBVIEW-LIFECYCLE-001` is PASS/CLOSED: the final desktop allowed-paste and physical-phone fresh native clipboard Allow/paste checks passed, popup layouts remained intact, and the test Asset stayed unchanged. Earlier cache, image, install, local-device, consent and session evidence is retained; fixtures and managed browsers are cleaned up. `MOBILE-PUSH-LIFECYCLE-001` is IN PROGRESS: foreground delivery now passes on the physical phone after Firebase SDK and worker fixes (one real FCM delivery, correct inbox/counters, no system duplicate). Home, Settings and Chrome background variants also pass. Shared popup users-poll signal and native permission state were verified; the user authorized temporary Chrome app-level notification permission for the successful focused replay, with original-state restoration retained. Section2 steps12–13 now pass on lifecycle43: exact Chat/message route, target-only read, stable Back/relaunch. Closed QA PWA delivery passed; the earlier stopped-Chrome-host LOW_MEMORY failure remains separately recorded. The user requested saved Firebase/device delivery decisions within the existing queue; that focused implementation is being verified before permission/token lifecycle continues. Full Push execution is delegated to Codex with user click assistance; completed WebView evidence is retained. Deployment is not a Pair-QA domain; Operator work is consolidated into four screen-level journeys; the [Configuration checklist](guides/qa/checklists/operator/OPERATOR-CONFIGURATION-LIFECYCLE-001.md) now maps C01–C08 and shared WebView evidence, with historical Firebase revision 1 activation evidence and the parent still PARTIAL/OPEN (current Push fixture restores active revision 1 as a prepared prerequisite); real-device push remains in Notifications, and downstream product behavior stays in its owning domain.

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
