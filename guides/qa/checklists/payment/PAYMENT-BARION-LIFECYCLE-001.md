# PAYMENT-BARION-LIFECYCLE-001 user test guide

This file is the tester's stable, repeatable guide. It is not an execution
log: do not check off its steps or add current dates, IDs, status or machine
evidence to it.

The direct authorization, visible bank challenge, unsuccessful outcomes and
callback validation are branches of one Barion lifecycle testcase.

## What this checkpoint is for

This checkpoint proves that a MyScoutee checkout creates a real Barion-shaped
`DelayedCapture` payment, redirects to the provider surface and accepts only a
verified callback/PaymentState result.

The current UI uses a **same-tab full-page redirect**, not a popup. A direct
simulator page opened outside a MyScoutee checkout is not evidence for this
checkpoint.

## Actors and startup

- **Nova** performs the payer-side checkout and provider interactions.
- **Casey** owns the staged Events and inspects successful membership.
- Codex prepares a separate clean Event/payment transaction for every branch,
  selects Barion in the dev payment configuration and proves that no Stripe
  session or ID belongs to the branch.
- Test POS credentials and callback capabilities stay server-side. Never enter
  or copy a real card, wallet, POS key or callback URL.
- Stop at the first mismatch. Do not repeat `Payment`, reuse an old provider
  page or navigate directly to a saved simulator URL.

To start a complete replay, tell Codex:

`Prepare the PAYMENT-BARION-LIFECYCLE-001 user test.`

Begin only after Codex confirms one paid, directly joinable Event, exact
amount/currency, zero Nova target entitlement/payment and Barion as the sole
resolved provider.

## Branch A — direct DelayedCapture authorization

1. In **Nova**, open the staged Event from
   `Activities → Events → Explore → Book Event`.
2. Complete only the fixture-named Slot and required policy, then select
   `Join` once.
3. Confirm the MyScoutee payment phase shows `Gateway`, `Ready to redirect`,
   the exact amount/currency and no successful membership.
4. Report and wait:

   `PAYMENT-BARION-LIFECYCLE-001 ready: MyScoutee gateway review, no authorization`

5. Select `Payment` exactly once. Confirm `Paying...` disables the action and
   the same tab navigates away from MyScoutee.
6. Confirm `Barion Smart Gateway simulator` appears with:

   - the expected amount and currency;
   - type `DelayedCapture`;
   - status `Prepared`;
   - the explicit QA-only warning.

7. Select `Authorize without visible challenge` once.
8. Confirm the same tab returns to the configured MyScoutee `/game` route.
9. Open `Active Events` and the read-only `Payment summary`. Confirm one target
   Event, exact Barion provider identity and an authorized/recorded result,
   never captured/settled.
10. In **Casey**, confirm Nova is accepted once and no duplicate ticket or
    membership exists.
11. Report:

    `PAYMENT-BARION-LIFECYCLE-001 direct authorized: one return and one membership`

## Branch B — visible bank/3DS challenge

12. Continue only after Codex prepares a different clean Event/session.
13. Repeat the MyScoutee checkout and select `Payment` once.
14. On `Barion Smart Gateway simulator`, select
    `Continue with bank authentication (3DS)`.
15. Confirm `Simulated bank / 3DS approval` appears with status `InProgress`
    and the same amount.
16. Select `Approve in banking app` once.
17. Confirm same-tab return, one accepted membership and one immutable Payment
    summary exactly as in Branch A.
18. Report:

    `PAYMENT-BARION-LIFECYCLE-001 3DS authorized: PaymentState fulfilled once`

## Branch C — isolated unsuccessful outcomes

Each outcome uses a new Codex-confirmed transaction.

19. **Bank decline:** enter the 3DS page, select
    `Bank declines authentication`, and confirm no accepted membership, ticket
    or paid summary appears.
20. Report:

    `PAYMENT-BARION-LIFECYCLE-001 decline: no entitlement`

21. **Bank cancel:** on a new session select
    `Customer cancels authentication`. Confirm the checkout remains
    unsuccessful and no provider success is inferred from returning to the
    application.
22. Report:

    `PAYMENT-BARION-LIFECYCLE-001 bank cancelled: no entitlement`

23. **Bank timeout:** on a new session select `Authentication times out`.
    Confirm no accepted Event/ticket appears.
24. Report:

    `PAYMENT-BARION-LIFECYCLE-001 timeout: no entitlement`

25. **Gateway cancel:** on a new `Prepared` gateway select `Cancel payment`.
    Confirm no fulfillment and no successful Payment summary.
26. **Expiry:** on the final clean gateway select `Expire payment`. Confirm the
    expired Payment cannot later fulfill the checkout.
27. Report:

    `PAYMENT-BARION-LIFECYCLE-001 cancel and expiry: no entitlement`

## Callback identity and replay

Malformed `PaymentId`, provider-ID mixing and callback replay are Codex-owned
machine checks. The browser must not call callback endpoints directly.

28. After Codex confirms callback validation/replay, reload the successful
    Event and Payment summary once.
29. Confirm the same Barion payment and membership appear exactly once and no
    Stripe ID or second entitlement is visible.
30. Report the terminal phrase:

    `PAYMENT-BARION-LIFECYCLE-001 UI complete: Barion authorization persisted once`

Wait for the final PaymentState, callback, persistence and idempotence oracle.

