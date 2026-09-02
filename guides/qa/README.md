# MyScoutee QA documentation

This directory keeps QA execution material separate from project plans.

| Directory | Content |
|---|---|
| [`checklists`](checklists/) | Stable user-facing click guides; never execution logs or machine-evidence files |
| [`matrices`](matrices/) | Canonical CSV ledger and its reviewable XLSX workbook |
| [`manuals`](manuals/) | Manual QA contracts and checkpoint procedures |
| [`handoffs`](handoffs/) | Minimal resumable session state for an active QA chain |
| [`diagnostics`](diagnostics/) | Focused defect investigations and pending measurements |
| [`reference`](reference/) | Shared QA policy and prioritization rules |
| [`tools`](tools/) | QA document generation and synchronization utilities |

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
