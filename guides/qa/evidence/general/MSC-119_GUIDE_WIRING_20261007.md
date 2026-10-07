# MSC-119 — guide wiring source audit, 2026-10-07

Task: https://github.com/fssrepository/myscoutee-roadmap/issues/157

## Scope and method

Reviewed frontend changes from `3b3624ff5^` (MSC-114) through MSC-118 and the
current MSC-119 working tree. The initial diff contained 381 TypeScript/HTML
paths, including contracts, stores and test sources. Followed UI owners through
context registration, enabled surface catalog, concrete/shared anchors, EN/HU
messages, revision versions and canonical local/Mongo group content. Existing
MSC-118 role popup bindings and system-guide metadata were retained.

No browser was navigated or modified. No functional test suite was run. The
user deferred QA; this is source/build evidence, not a click-through PASS.

## Concrete gaps repaired

- The empty/error message title now shares the close button's header row.
- Work home, Community service home and inline community noticeboards now carry
  the same `data-guide-surface` boundary as the established home implementation.
- Five previously registered contexts were absent from the enabled catalog:
  case board, board task, quotations, quotation editor and service feedback.
- Added independent contexts for MCP authorization, Advanced and client details;
  task quotation/dependency pickers; shared terms list/editor. Popup's existing
  `guideContext` lifecycle handles registration and parent restoration.
- FormFlow's existing `guideFieldId` extension now reaches header controls too.
  Case/member selection and task assignees/quotations/dependencies use it.
- Added descriptions for actual conditional case, task, notice/vote, service,
  quotation and board menus; picker baskets/confirmation and calendar actions.
  No business availability/eligibility rule was changed.
- Corrected Work-specific text copied into service ratings and editing text
  copied into read-only campaign history. Feedback criteria now explain their
  individual meanings and the fixed labelled answers.
- The existing seed generator previously rebuilt only unscoped guide revisions.
  It now uses the same fields, version map and EN/HU messages for canonical Work
  and Community guide revisions before generating all three Mongo seed sets.
  Missing/empty scoped feedback content and stale campaign/event fields are
  covered. No application initializer, repository injection, browser storage
  mutation or live database script was added.

## Inventory

- 118 enabled/cataloged contexts; 1458 conditional fields.
- All catalog fields have an EN and HU label and description.
- Work and Community current guide revisions contain usable sections.
- Role system metadata remains on the existing protected role contexts.
- Local guides use the existing seed builder/repository; HTTP uses the same
  versioned definitions imported by the running seed watcher.

## Remaining verification boundary

The application-wide guide checklist is reopened. Actual visible targets,
menu transitions, read-only/disabled controls, nested popup stacking, guide
placement, mobile layout and upgrade of a retained runtime seed are **NOT RUN**.
Compilation cannot establish those results. Use EXPLANATION-GUIDE-001's MSC-119
section and the existing role pack; preserve previous evidence as historical.
