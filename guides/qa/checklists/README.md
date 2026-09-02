# User-facing QA checklists

This directory contains stable, repeatable manual test guides for the person
operating the application UI.

Each checklist contains:

- the fixture and browser setup to request;
- the actor or window to use;
- exact navigation, clicks, and entered values;
- visible expected results;
- stop phrases after which Codex runs an independent machine-side oracle.

A checklist does not contain live execution status, pre-checked steps, dated
evidence, Mongo/API details, or a Codex work log. It does not change because a
test run advanced or completed. Edit it only when the tested user contract or
click path itself changes.

The live resume point belongs in `handoffs/CURRENT_QA_SESSION.md`. PASS/FAIL
and machine evidence belong in the QA pack and CSV/XLSX ledger. Those records
must never overwrite the user-facing checklist.

## Available user guides

- [`EVENT-EDIT-RUNTIME-001.md`](EVENT-EDIT-RUNTIME-001.md) — active Event edit,
  MAIN_EVENT resource, pending invite, and Delete reversal journey.
- [`EVENT-SCHEDULERS-001.md`](EVENT-SCHEDULERS-001.md) — bounded Event scheduler
  and Admin Jobs/Monitoring journey.
- [`ROLE-TRIAD-CORE-001.md`](ROLE-TRIAD-CORE-001.md) — member/admin/operator
  authorization, moderation, support, block/unblock, and branding journey.
- [`JOB-PURGE.md`](JOB-PURGE.md) — scheduled deleted-account finalization
  journey.
