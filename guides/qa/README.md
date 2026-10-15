# MyScoutee QA documentation

This directory keeps QA execution material separate from project plans.

WebRTC: [CHAT-CALL-001](checklists/general/CHAT-CALL-001.md) — 29 ordered remaining
development steps. October12 shared two-party/repeated/KVM call evidence is
credited; group media, paging/RTP, remaining controls and call guides remain.
Physical audio and external-network checks belong to
[live qualification](../qualification/MSC117_118_LIVE_CHECKS.md).
Indexed in the Chat functional coverage of the
[domain QA pack](manuals/DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md#chat-call-001--direct-audiovideo-group-calls)
and the existing CSV/XLSX ledger row; execution results remain separate.

In-app Help steps: [EXPLANATION-GUIDE-001](checklists/general/EXPLANATION-GUIDE-001.md)
is closed with its original checklist preserved. Its first-visit introduction
remainder is embedded directly, without a separate testcase or ledger row, in the
[MSC-116 consolidated checklist](checklists/api/MSC-116_AUTOMATIC_QA.md), steps 75–81.
There is no standalone MSC-119 QA: all remaining monolith/local guide checks
precede one KVM sample. Accepted MSC-115 evidence and existing API/MCP/Feedback
coverage are retained without replay. Call/volume guides remain
in CHAT-CALL-001, and role guides in
[MSC-118](checklists/general/ROLE-GUIDES-NOTIFICATIONS-001.md), with39 ordered steps.
No overlapping guide tour is executed twice.
During any UI case, record guide/notification launcher overlap when observed;
both buttons must remain separately identifiable and usable. Preserve the existing
desktop/mobile placement and menu visibility rules. Link the defect to this guide
case as well as the scenario where it was found.

Event-format follow-up: [EVENT-MODE-REGRESSION-001](checklists/event/EVENT-MODE-REGRESSION-001.md).
MSC-116 follow-up: [INTEGRATION-ACCESS-001](checklists/api/INTEGRATION-ACCESS-001.md) and [FEEDBACK-UI-001](checklists/general/FEEDBACK-UI-001.md).

Partner invitation/encounter extension: [INTEGRATION-API-001](checklists/api/INTEGRATION-API-001.md).
Both support explicitly delegated CDP execution using the versioned managed
browser launcher; their dated results remain separate from the stable guides.

| Directory | Content |
|---|---|
| [`checklists`](checklists/) | Stable user-facing click guides; never execution logs or machine-evidence files |
| [`matrices`](matrices/) | Canonical CSV ledger and its reviewable XLSX workbook |
| [`manuals`](manuals/) | Manual QA contracts and checkpoint procedures |
| [`handoffs`](handoffs/) | Minimal resumable session state for an active QA chain |
| [`diagnostics`](diagnostics/) | Focused defect investigations and pending measurements |
| [`reference`](reference/) | Shared QA policy and prioritization rules |
| [`tools`](tools/) | QA document generation and synchronization utilities |
| [`e2e`](e2e/) | Incremental PASS-branch audit checkpoint and links to executable E2E coverage |

Resume an active session from the
[current compact handoff](handoffs/CURRENT_QA_SESSION.md). Open the
[reviewable XLSX ledger](matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx), the
[manual QA plan](manuals/ADMIN_DYNAMIC_SURFACES_QA_PLAN.md), or the
[domain lifecycle checkpoint pack](manuals/DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md)
only when the active handoff links to the required detail.
The [checklist policy](checklists/README.md) keeps tester click guides stable
and separate from status and machine evidence.
The upload/rendition contract is isolated in the
[media image variants case](manuals/MEDIA_IMAGE_VARIANTS_MANUAL_QA.md), and the
bounded-session working correction is recorded in the
[Codex compaction diagnosis](diagnostics/CODEX_SESSION_COMPACTION_DIAGNOSIS.md).
Detailed publish/accept/chat history remains in the
[event handoff](handoffs/EVENT_PUBLISH_CHAT_HANDOFF.md).

The canonical execution ledger is
[`ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv`](matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv).
Regenerate the XLSX after changing it with:

```bash
python3 guides/qa/tools/sync-qa-matrix-xlsx.py
```

The generated workbook colors complete rows green, partial/open rows amber,
failed or clean-retest-required rows red, and not-run rows gray. Legend rows
retain their own contextual colors. Merged `LEGEND` and `QA TEST CASES`
section headers keep the reading guide visually separate from executable rows.
Every unfinished row also carries a `MIN/MAX` wall-clock estimate in
`Remaining QA complexity (min/max)`; completed rows keep that cell blank. The
domain overview aggregates both bounds of only this unfinished effort next to
progress. The
[complexity model](reference/MANUAL_QA_COMPLEXITY_MODEL.md) is independent of
the risk-based [priority model](reference/MANUAL_QA_PRIORITY_MODEL.md).
