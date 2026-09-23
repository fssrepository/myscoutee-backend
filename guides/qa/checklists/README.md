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

## Domain directories

- [`event`](event/) — Event lifecycle and scheduler guides.
- [`asset`](asset/) — Asset lifecycle, borrowing and checkout guides.
- [`content`](content/) — governed Content and Article lifecycle guides.
- [`identity-access`](identity-access/) — identity, authorization and account
  lifecycle guides.
- [`notifications`](notifications/) — notification delivery, realtime and UI
  performance guides.
- [`administration`](administration/) — Monitoring, Affinity Graph and Parameters.
- [`operator`](operator/README.md) — Configuration, Registry, Updates and Revenue.

## Available user guides

- [`EVENT-EDIT-RUNTIME-001.md`](event/EVENT-EDIT-RUNTIME-001.md) — active Event edit,
  MAIN_EVENT resource, pending invite, and Delete reversal journey.
- [`EVENT-CHECKOUT-001.md`](event/EVENT-CHECKOUT-001.md) — direct paid Event
  Explore Stripe journey, Cash-only control and button-state coverage.
- [`EVENT-SCHEDULERS-001.md`](event/EVENT-SCHEDULERS-001.md) — bounded Event scheduler
  and Admin Jobs/Monitoring journey.
- [`ASSET-LIFE-001.md`](asset/ASSET-LIFE-001.md) — shared Asset type-schema and
  create/edit/delete lifecycle.
- [`ASSET-VIS-001.md`](asset/ASSET-VIS-001.md) — owner, friend and unrelated
  Asset discovery/detail visibility, owner profile, category filter and
  single-Edit reload boundary.
- [`ASSET-CHECKOUT-001.md`](asset/ASSET-CHECKOUT-001.md) — scoped
  Resource/Asset Explore Barion/3DS payment, request and acceptance journey.
- [`ASSET-PRICING-001.md`](asset/ASSET-PRICING-001.md) — interactive Asset
  pricing edits after the required audience/VIP/promo and refund-disclosure
  implementation gate, through immutable payment-time price/refund snapshots.
- [`CONTENT-ADMIN-LIFECYCLE-001.md`](content/CONTENT-ADMIN-LIFECYCLE-001.md) —
  governed revisions, Privacy consent/fallback and Article trash/restore/
  republish journey.
- [`ROLE-TRIAD-CORE-001.md`](identity-access/ROLE-TRIAD-CORE-001.md) — member/admin/operator
  authorization, moderation, support, block/unblock, and branding journey.
- [`JOB-PURGE.md`](identity-access/JOB-PURGE.md) — scheduled deleted-account finalization
  journey.
- [`PAYMENT-METHODS-HISTORY-001.md`](event/PAYMENT-METHODS-HISTORY-001.md) —
  one side-menu journey covering Payment History filters/summaries, Stripe and
  Barion card registration, and expired-card notification/cleanup.
- [`UI-POLL-JANK-001.md`](notifications/UI-POLL-JANK-001.md) — four bounded
  Admin/Chat performance traces plus two-session CDP/browser-close attribution.
- [`BELL-RATING-LIFECYCLE-001.md`](notifications/BELL-RATING-LIFECYCLE-001.md) —
  rating/feedback producers through target bell/read, Statistics and affinity.
- [`JOB-MESSAGES.md`](notifications/JOB-MESSAGES.md) — real scheduled-message
  inactive-user and recent-user/reschedule branches.
- [`NOTIFICATION-ADMIN-LIFECYCLE-001.md`](notifications/NOTIFICATION-ADMIN-LIFECYCLE-001.md) —
  Admin rule save/validation, one target outbox lifecycle, dedupe and restore.
- [`MOBILE-PUSH-LIFECYCLE-001.md`](notifications/MOBILE-PUSH-LIFECYCLE-001.md) —
  physical-device foreground/background/cold-start delivery and token rotation.
- [`MOBILE-WEBVIEW-LIFECYCLE-001.md`](notifications/MOBILE-WEBVIEW-LIFECYCLE-001.md) —
  Android cache upgrade, resume, account isolation and offline recovery.

## Administration sequence

`BASE-STAT` is already closed. The remaining guides follow the existing ledger:

1. [ADMIN-MONITORING-001](administration/ADMIN-MONITORING-001.md) — filters, one
   recompute task, Jobs evidence and one parameter save/revert; startup harness available.
2. [ADMIN-AFFINITY-GRAPH-001](administration/ADMIN-AFFINITY-GRAPH-001.md) — graph
   depth/weight filters, viewport controls and scale; shared materialization evidence reused.
3. [ADMIN-PARAMETERS-001](administration/ADMIN-PARAMETERS-001.md) — seven sections,
   section-specific consumer effects, validation and cancellation; shared history/revert tested once.

The latter two currently provide the user-facing sequence; their dedicated
fixture orchestration is prepared when their own checkpoint is requested.

## New feature cases (runtime NOT RUN)

- [EVENT-GALLERY-FEED-001](event/EVENT-GALLERY-FEED-001.md): shared galleries, Feed, profile info scrolling and content moderation.
- [OPERATOR-EMAIL-WARNING-001](operator/OPERATOR-EMAIL-WARNING-001.md): operator email provider and fixed five-day warning Job, using a non-delivering stub.

- [ADMIN-CLIENT-API-001](api/ADMIN-CLIENT-API-001.md): private admin API and Linux monitor, v1.0.2; runtime pending.

- [AFFILIATE-REVENUE-001](api/AFFILIATE-REVENUE-001.md): per-currency referral turnover/refunds, mutation-time counters and mobile header controls.

- [EVENT-CALENDAR-EXPORT-001](event/EVENT-CALENDAR-EXPORT-001.md): manual ICS download, physical Android import window, repeated/changed imports and offline calendar reminders.

All five cases are listed in the canonical [CSV ledger](../matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv)
and generated [XLSX workbook](../matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx).
Focused implementation checks are recorded separately from their unexecuted runtime QA.
