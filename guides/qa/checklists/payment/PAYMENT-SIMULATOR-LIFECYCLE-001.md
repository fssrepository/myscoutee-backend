# PAYMENT-SIMULATOR-LIFECYCLE-001 user test guide

This file is the tester's stable, repeatable guide. It is not an execution
log: do not check off its steps or add current dates, IDs, status or machine
evidence to it.

## What this checkpoint is for

This is an infrastructure/durability checkpoint, not a separate customer
payment experience. Its purpose is to prove that the dev-only Stripe/Barion
simulator keeps provider resources, event order, delivery attempts and
idempotency decisions across a restart without leaking into production.

Opening `Test checkout` or `Barion Smart Gateway simulator` directly proves
almost nothing about MyScoutee. For valid evidence, the provider resource must
first be created by a MyScoutee `Payment` action, and the callback replay must
be compared with MyScoutee's persisted payment/entitlement state.

## Actors and startup

- **Nova** performs one app-created authorization through the provider chosen
  by the checkpoint substage.
- Codex owns simulator status, same-container restart, API/audit checks,
  callback replay, idempotency-conflict probes and production-isolation proof.
- The existing simulator container and its SQLite volume are reused. Codex
  must not start a second simulator, backend, frontend, MongoDB or Compose
  stack.
- The main dev stack is never restarted for this checkpoint. Only the named
  `payment-simulator` owner may restart, and only after the pre-restart state
  is captured.
- Test API keys, webhook secrets, audit tokens and outcome capabilities never
  appear in the browser instructions, logs or process arguments.

To start a complete replay, tell Codex:

`Prepare the PAYMENT-SIMULATOR-LIFECYCLE-001 user test.`

## 1. Create the provider state through MyScoutee

1. Begin only after Codex confirms one clean paid Event checkout, the chosen
   provider, zero target entitlement and a healthy simulator.
2. In Nova, follow the exact staged MyScoutee path
   `Event Explore → Book Event → Join`.
3. Confirm the MyScoutee payment review contains the exact amount/currency and
   no successful membership.
4. Select `Payment` once. Confirm same-tab provider navigation; a separately
   opened direct simulator page is invalid setup.
5. Complete the fixture-named direct or 3DS authorization once.
6. After return to MyScoutee, confirm one accepted destination and one
   read-only Payment summary, still uncaptured.
7. Report:

   `PAYMENT-SIMULATOR-LIFECYCLE-001 authorization ready: app-created provider state and one entitlement`

Wait for Codex to capture provider IDs, callback event order, delivery audit,
internal payment and entitlement fingerprints before the restart.

## 2. Restart durability and callback replay

There is no user click during the restart. Keep Nova's returned MyScoutee page
open and do not reload until Codex says the simulator is healthy again.

8. After Codex restarts only the simulator, reload Nova once.
9. Reopen the target Event and Payment summary.
10. Confirm the same payment, provider and membership are present exactly once;
    the app must not offer a fresh `Payment` for the completed checkout.
11. Report:

    `PAYMENT-SIMULATOR-LIFECYCLE-001 restart visible: same payment and entitlement`

12. Wait while Codex retries the exact provider request, probes changed content
    under the same idempotency identity and replays the retained callback.
13. Reload once more only when instructed. Confirm there is still one Payment
    summary and one entitlement, with no second ticket/counter effect.
14. Report:

    `PAYMENT-SIMULATOR-LIFECYCLE-001 replay visible: no duplicate effect`

## 3. Protected controls and production isolation

These are machine/operations checks; there is no direct browser producer
action.

- simulator outcome controls must require the per-session capability;
- audit/replay must require the configured test audit token;
- missing credentials and every `sk_live_` key must fail closed;
- only explicit dev configuration may use custom provider API bases;
- the simulator service, port, test credentials and SQLite volume must be
  absent from production topology;
- production endpoint resolution must reject simulator/custom API bases.

Do not open a production payment page or enter a real credential merely to
prove absence. Production proof comes from the named disposable qualification
environment and resolved configuration/artifact inspection.

15. After Codex confirms the security and production-isolation gates, report
    the terminal phrase:

    `PAYMENT-SIMULATOR-LIFECYCLE-001 UI complete: restart and replay preserved one app payment`

Wait for the final SQLite identity, event-order, delivery-audit, idempotency,
secret-absence and production-topology oracle.

