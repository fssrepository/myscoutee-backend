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
- [`payment`](payment/) — external provider authorization, settlement, routing
  and simulator-durability guides.

## Available user guides

- [`EVENT-EDIT-RUNTIME-001.md`](event/EVENT-EDIT-RUNTIME-001.md) — active Event edit,
  MAIN_EVENT resource, pending invite, and Delete reversal journey.
- [`EVENT-CHECKOUT-DUMMY-001.md`](event/EVENT-CHECKOUT-DUMMY-001.md) — direct paid
  Event Explore dummy-payment journey and button-state controls.
- [`EVENT-SCHEDULERS-001.md`](event/EVENT-SCHEDULERS-001.md) — bounded Event scheduler
  and Admin Jobs/Monitoring journey.
- [`ASSET-LIFE-001.md`](asset/ASSET-LIFE-001.md) — shared Asset type-schema and
  create/edit/delete lifecycle.
- [`ASSET-VIS-001.md`](asset/ASSET-VIS-001.md) — owner, friend and unrelated
  Asset discovery/detail visibility boundary.
- [`ASSET-CHECKOUT-DUMMY-001.md`](asset/ASSET-CHECKOUT-DUMMY-001.md) — scoped
  Resource/Asset Explore dummy-payment, request and acceptance journey.
- [`CONTENT-ADMIN-LIFECYCLE-001.md`](content/CONTENT-ADMIN-LIFECYCLE-001.md) —
  governed revisions, Privacy consent/fallback and Article trash/restore/
  republish journey.
- [`ROLE-TRIAD-CORE-001.md`](identity-access/ROLE-TRIAD-CORE-001.md) — member/admin/operator
  authorization, moderation, support, block/unblock, and branding journey.
- [`JOB-PURGE.md`](identity-access/JOB-PURGE.md) — scheduled deleted-account finalization
  journey.
- [`PAYMENT-STRIPE-LIFECYCLE-001.md`](payment/PAYMENT-STRIPE-LIFECYCLE-001.md) —
  app-created Stripe redirect, direct/3DS authorization, failures and callback
  replay journey.
- [`PAYMENT-BARION-LIFECYCLE-001.md`](payment/PAYMENT-BARION-LIFECYCLE-001.md) —
  app-created Barion DelayedCapture, direct/3DS authorization, failures and
  callback identity journey.
- [`PAYMENT-SETTLEMENT-LIFECYCLE-001.md`](payment/PAYMENT-SETTLEMENT-LIFECYCLE-001.md) —
  capture, release, compensation, partial amount and hold-lifetime journey.
- [`PAYMENT-PROVIDER-ROUTING-001.md`](payment/PAYMENT-PROVIDER-ROUTING-001.md) —
  provider-neutral Stripe/Barion comparison and replacement design-gap gate.
- [`PAYMENT-SIMULATOR-LIFECYCLE-001.md`](payment/PAYMENT-SIMULATOR-LIFECYCLE-001.md) —
  app-created simulator state, same-container restart, replay and production
  isolation journey.
