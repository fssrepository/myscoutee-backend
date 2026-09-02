# PAYMENT-PROVIDER-ROUTING-001 user test guide

This file is the tester's stable, repeatable guide. It is not an execution
log: do not check off its steps or add current dates, IDs, status or machine
evidence to it.

The Stripe/Barion comparison and the future provider-replacement saga are two
branches of one consolidated testcase.

## What this checkpoint is for

The payer-facing MyScoutee checkout is intentionally provider-neutral. The
operator-selected provider changes the external authorization implementation,
not the Event, basket, amount, currency or entitlement semantics.

The user does not select Stripe or Barion inside checkout. Codex stages the
active dev provider revision before each clean branch. `Payment` then performs
a same-tab redirect to the provider selected for that new internal payment.

## Actors and startup

- **Nova** performs two equivalent clean checkouts.
- **Casey** owns the equivalent staged Events and checks final capacity/member
  state.
- Codex stages byte-equivalent basket/price controls, selects Stripe for the
  first branch and Barion for the second, and proves each branch starts with no
  provider or entitlement identity.
- Do not save or rotate payment credentials in this guide. Operator credential
  lifecycle belongs to `OPERATOR-PAYMENT-CONFIG-001`.
- Never reuse a provider page, authorization ID or browser Back history from
  the other branch.

To start a complete replay, tell Codex:

`Prepare the PAYMENT-PROVIDER-ROUTING-001 user test.`

## Branch A — equivalent checkout through Stripe

1. Begin only after Codex confirms Stripe is the active provider for a fresh
   internal payment.
2. In Nova, open the exact Event and proceed through
   `Book Event → Join` to the payment phase.
3. Confirm MyScoutee shows the provider-neutral labels `Gateway` and
   `Ready to redirect`, with the exact named basket, amount and currency.
   `Stripe` does not need to be exposed as a chooser here.
4. Select `Payment` once and confirm the same tab opens `Test checkout`.
5. Complete the fixture-named direct or 3DS authorization exactly once and
   confirm return to MyScoutee.
6. Confirm one accepted destination and read-only Payment summary.
7. Report:

   `PAYMENT-PROVIDER-ROUTING-001 Stripe complete: provider-neutral checkout, one entitlement`

## Branch B — equivalent checkout through Barion

8. Continue only after Codex switches to an independent equivalent Event and
   confirms Barion as the active provider for the new internal payment.
9. Repeat `Book Event → Join` and compare the MyScoutee payment review with
   Branch A. Basket fields, amount/currency, labels and loading behavior must
   match.
10. Select `Payment` once and confirm the same tab now opens
    `Barion Smart Gateway simulator`, not the earlier Stripe session.
11. Complete the fixture-named authorization exactly once and confirm return
    to MyScoutee.
12. Confirm one equivalent accepted destination and Payment summary.
13. In Casey, compare the two Events: each has exactly one Nova entitlement
    and its own unchanged capacity calculation.
14. Report:

    `PAYMENT-PROVIDER-ROUTING-001 Barion complete: equivalent UX, isolated provider identity`

## Provider isolation after reload

15. Reload Nova once and reopen both Payment summaries.
16. Confirm the Stripe branch remains Stripe, the Barion branch remains
    Barion, and neither summary contains the other provider's checkout or
    authorization identity.
17. Confirm repeated reads create no new payment, membership, ticket or
    counter effect.
18. Report:

    `PAYMENT-PROVIDER-ROUTING-001 routing persisted: providers isolated after reload`

## Replacement-saga gate

The planned predecessor/successor seat-transfer branch is **not implemented**.
There is currently no product writer that authorizes a successor with the
other provider, transfers exactly one seat and then durably releases the
predecessor.

Do not approximate this branch by editing provider fields, creating two
memberships, manually freeing capacity or calling release directly. It remains
a recorded design gap and cannot be marked as a manual PASS.

19. Report the terminal phrase after Codex records the implemented routing
    comparison and the separate blocked replacement branch:

    `PAYMENT-PROVIDER-ROUTING-001 UI complete: equivalent routes proven, replacement remains blocked`

Wait for the final provider-revision, internal/provider identity, capacity and
no-double-entitlement oracle.

