# PAYMENT-STRIPE-LIFECYCLE-001 user test guide

This file is the tester's stable, repeatable guide. It is not an execution
log: do not check off its steps or add current dates, IDs, status or machine
evidence to it.

The complete journey is one testcase transaction. The successful 3DS route,
direct authorization, unsuccessful outcomes and callback-security checks are
named branches inside this testcase, not separate matrix rows.

## What this checkpoint is for

This checkpoint proves the complete MyScoutee-to-Stripe boundary. Opening a
simulator page directly is not sufficient: the provider session must be
created by the application's `Payment` action from an exact persisted checkout
basket.

The current application contract uses a **same-tab full-page redirect**, not a
popup window. The MyScoutee checkout first shows the payment review; selecting
`Payment` once shows its busy state and then navigates the current tab to the
Stripe-compatible simulator.

Authorization is a reversible hold. It is not capture and must not be
presented as settled revenue.

## Actors and startup

- **Nova** performs each payer-side checkout and provider interaction.
- **Casey** owns the staged Events and inspects accepted membership only after
  a successful authorization.
- Codex stages independent Events for the success, decline, customer-cancel
  and timeout branches, selects Stripe in the dev payment configuration,
  starts no duplicate stack, opens the isolated actor windows and runs all
  persisted/provider oracles.
- The dev configuration must resolve `payment.enablePay=true`, the Stripe test
  API base to the already-running simulator and test credentials only.
- No raw API key, webhook secret or outcome capability is displayed, copied or
  entered by the tester.
- Stop at the first mismatch. Do not compensate with a second `Payment`, a
  browser Back, an unlisted reload or a direct simulator URL.

To start a complete replay, tell Codex:

`Prepare the PAYMENT-STRIPE-LIFECYCLE-001 user test.`

Begin only after Codex confirms this baseline:

- one direct, published paid Event is visible once to Nova in Explore for the
  active branch;
- the Event has deterministic Slot/policy selections, amount and currency;
- Nova owns no target membership, ticket, payment, basket result, chat or
  counter contribution;
- Stripe is the resolved provider and no Barion resource exists for this
  branch;
- the simulator, backend, frontend and callback route are healthy.

## Branch A — authorize through the visible 3DS challenge

1. In **Nova**, open `Activities → Events → Explore` and find the exact staged
   Stripe Event once.
2. Open its menu and select `Book Event` once.
3. Complete only the fixture-named Slot and required policy selections. Confirm
   the displayed amount and currency match the baseline.
4. Select `Join` once. Confirm this remains the MyScoutee checkout and now
   shows the payment phase with:

   - provider presentation `Gateway`;
   - status `Ready to redirect`;
   - the same immutable basket, amount and currency;
   - `Back`, `Cancel payment` and `Payment`;
   - no accepted membership or payment-success claim.

5. Report and wait:

   `PAYMENT-STRIPE-LIFECYCLE-001 ready: MyScoutee gateway review, no authorization`

6. After Codex confirms the pre-authorization oracle, select `Payment`
   **exactly once**.
7. Confirm the action changes to `Paying...` while the request is active and
   cannot be selected again.
8. Confirm the same browser tab leaves MyScoutee and displays `Test checkout`.
   A second tab, popup or duplicate checkout is a FAIL.
9. Confirm the provider page shows the expected total in minor units, an open
   session and the warning that it is a simulator. Never enter real card data.
10. Select `Continue with bank authentication (3DS)` once.
11. Confirm `Simulated bank / 3DS approval` appears with status
    `requires_action` and the same amount.
12. Select `Approve in banking app` once.
13. Confirm the browser returns to the configured MyScoutee `/game` success
    route in the same tab. Wait for the application shell to finish loading;
    do not repeat the payment while counters converge.
14. Open `Activities → Events → Active Events`. Confirm the target appears
    once with `View Event`, read-only `Payment summary` and `Leave Event`.
15. Open `Payment summary` and confirm the exact basket, amount/currency,
    Stripe provider identity and authorized/recorded result. It must not say
    captured or settled.
16. In **Casey**, open the Event Members surface and confirm Nova appears once
    as accepted. If Ticketing is enabled by the fixture, confirm exactly one
    ticket; otherwise confirm none.
17. Report:

    `PAYMENT-STRIPE-LIFECYCLE-001 3DS authorized: returned once, membership visible, uncaptured`

Wait for Codex to prove the signed callback, one authorization, one
fulfillment and unchanged capture state before continuing.

## Branch B — direct authorization without a visible challenge

18. Continue only after Codex switches to the independent direct-success
    substage. Do not reuse Branch A's Event, basket or provider session.
19. Repeat the staged MyScoutee checkout through `Join → Payment` once.
20. On `Test checkout`, select `Complete checkout` once.
21. Confirm the same-tab return and the same one-membership/read-only-summary
    outcome as Branch A. No bank/3DS page should appear on this branch.
22. Report:

    `PAYMENT-STRIPE-LIFECYCLE-001 direct authorized: one return and one membership`

## Branch C — isolated unsuccessful outcomes

Each outcome starts from a new Codex-confirmed clean substage. Never stack one
failure over another session.

23. **Decline:** reach `Test checkout`, select `Fail checkout`, and confirm the
    app does not show successful participation, ticket or Payment summary.
24. Report:

    `PAYMENT-STRIPE-LIFECYCLE-001 decline: no entitlement`

25. **Customer cancel:** on the next clean session select `Cancel and return`.
    Confirm the same-tab cancel return exposes a resumable/cancellable checkout,
    not an accepted Event.
26. Report:

    `PAYMENT-STRIPE-LIFECYCLE-001 customer cancelled: checkout not fulfilled`

27. **3DS timeout:** on the next clean session select
    `Continue with bank authentication (3DS)`, then
    `Authentication times out`.
28. Confirm no successful membership/ticket appears and the provider session
    cannot be mistaken for a completed authorization.
29. Report:

    `PAYMENT-STRIPE-LIFECYCLE-001 timeout: no entitlement`

30. **Expired checkout:** on the final clean session select `Expire session`.
    Confirm the app does not claim payment success and cannot use the expired
    session for a later Pay retry.
31. Report:

    `PAYMENT-STRIPE-LIFECYCLE-001 expired: old session cannot fulfill`

## Callback security and terminal replay

The invalid-signature, wrong-provider, wrong-amount, wrong-currency,
duplicate-event and out-of-order callback variants are machine-owned checks.
The tester must not manufacture webhooks from the browser.

32. After Codex confirms those checks, reload the successful Nova Event once.
33. Confirm there is still exactly one accepted membership, at most the one
    expected ticket, the same immutable Payment summary and no second counter
    contribution.
34. Report the terminal phrase:

    `PAYMENT-STRIPE-LIFECYCLE-001 UI complete: legal authorization persisted once`

Wait for the final provider, callback, persistence and idempotence oracle.

