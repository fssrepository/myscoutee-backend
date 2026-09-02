# ASSET-CHECKOUT-DUMMY-001 user test guide

This file is the tester's stable, repeatable click-by-click guide. It is not an
execution log: do not check off its steps or add current dates, IDs, status or
machine evidence to it.

The complete journey is one testcase transaction. `payment-ready`,
`paid-pending` and `accepted` are replay savepoints inside this testcase, not
separate matrix rows.

## Actors and startup

- **Nova** performs the Resource/Asset Explore borrow checkout and every
  borrower-side observation.
- **Casey** owns the paid Asset and performs only the owner request decision.
- Codex stages the exact Event/Sub-event resource scope, Assets, actors,
  checkout controls and browser sessions, then runs the independent machine
  oracles. Do not create replacement data or browser profiles.
- This Core Asset checkpoint uses the in-product dummy payment path only. It
  does not start Stripe, Barion, a payment simulator or another runtime.
- Stop at the first mismatch. Do not compensate with another Pay, Confirm,
  Approve, reload or an API/Mongo action.

To start a complete replay, tell Codex:

`Prepare the ASSET-CHECKOUT-DUMMY-001 user test.`

Begin only after Codex confirms this exact baseline:

- Nova is an accepted Event participant with access to
  `QA ASSET-CHECKOUT-DUMMY-001 Event → QA Borrow Stage`;
- Resource/Asset Explore shows one Public paid Transport named
  `QA ASSET-CHECKOUT-DUMMY-001 Paid Transport`, owned by Casey, with quantity
  `3`, deterministic unit price and one required policy;
- Nova has no target borrow request, payment/session, basket draft,
  reservation, resource assignment, Asset activity contribution or Asset
  role;
- the Free, unavailable and adjacent paid controls are staged, and the sibling
  Sub-event plus Riley are unchanged negative controls;
- isolated Casey and Nova windows are open and identity-verified.

## Complete test journey

### 1. Verify the fresh paid Asset and input gates

1. In **Nova**, open:

   `Activities → Events → Active Events → QA ASSET-CHECKOUT-DUMMY-001 Event → View Event → QA Borrow Stage → Transport → Explore`

2. Find `QA ASSET-CHECKOUT-DUMMY-001 Paid Transport` exactly once with
   availability `3`.
3. Open its menu. Confirm `Borrow` is present and `Payment summary` is absent.
4. Select `Borrow` once.
5. Confirm the borrow review shows the exact Asset, Event/Sub-event context,
   timeframe, quantity, price and required `QA Borrow policy`.
6. Make the timeframe invalid by setting End before or equal to Start. Confirm
   the forward action is disabled or shows a clear inline error and no request
   is sent.
7. Restore the fixture-provided valid timeframe.
8. Attempt to enter a quantity above the displayed availability. Confirm it is
   rejected or clamped to the maximum and cannot be submitted as an
   over-capacity request.
9. Set quantity to `1`.
10. Leave `QA Borrow policy` unaccepted. Confirm the checkout cannot advance.
11. Accept `QA Borrow policy` once.
12. Record the exact timeframe, quantity `1`, total and currency.
13. Confirm the primary action is `Confirm borrow`; `Pay` and
    `Payment summary` are still absent.
14. Select `Confirm borrow` exactly once.
15. Confirm the checkout changes to a locked payment phase with all of the
    following:

    - `Dummy pay` and `Ready to pay` presentation;
    - the same timeframe, quantity, required policy, total and currency;
    - `Back` and `Pay` actions;
    - no pending/accepted borrower success yet.

16. Confirm that the timeframe, quantity, policy and price controls are locked
    in the payment phase.
17. Report this phrase and wait for Codex to capture exactly one active dummy
    session and zero request/assignment effects:

    `ASSET-CHECKOUT-DUMMY-001 payment ready: Dummy pay visible, no borrow request yet`

### 2. Resume the same payment state and invalidate it through Back

18. After Codex confirms `payment-ready`, close the checkout with its normal
    close control. Do not select Back or Pay.
19. In the still-open Asset Explore surface, confirm the Borrow Basket shows
    exactly one target item with `Continue request`.
20. Open `Continue request`. Confirm the same payment phase returns with the
    same session-owned timeframe, quantity, policy and total.
21. Close it again and reload Nova exactly once.
22. Return to the same Resource/Asset Explore scope. Confirm the Borrow Basket
    still contains exactly one target item and `Continue request` reconstructs
    the same payment-ready state.

If the draft disappears, restarts at an empty review, changes amount, or
creates another session merely because of reload, stop here. Report the exact
mismatch; do not build a new attempt over the orphaned state.

23. Select `Back` once.
24. Confirm the editable review returns and `Pay` disappears.
25. Change quantity from `1` to `2`, confirm the total changes, then change it
    back to `1`. Keep the same valid timeframe and policy.
26. Select `Confirm borrow` exactly once.
27. Confirm `Dummy pay` returns with the final quantity `1` and original exact
    total. The superseded session must not remain selectable.
28. Report:

    `ASSET-CHECKOUT-DUMMY-001 revised payment ready: one final session owns quantity 1`

29. Wait for Codex to prove that changed content did not reuse the old active
    session and that no request, reservation or assignment exists yet.

### 3. Pay once and prove the Asset UI does not freeze

30. Select `Pay` **exactly once**.
31. While the request is active, confirm the action changes to `Paying...` and
    cannot be selected again. The loading indication and surrounding page
    continue to render and respond.
32. Wait for the normal request to finish. The following are immediate FAIL
    conditions:

    - `Paying...` remains indefinitely with no terminal response;
    - the browser, editor or page stops responding;
    - another payment/editor surface appears;
    - the UI claims success while showing an error or unchanged server state.

33. Confirm the checkout closes once and the stale overlay does not block the
    Resource/Asset Explore surface.
34. Do not start another Borrow. Report:

    `ASSET-CHECKOUT-DUMMY-001 paid pending: checkout closed once and UI stayed responsive`

35. Wait for Codex to prove one approved dummy payment, one exact pending
    borrow request/payment-session reference, one quantity reservation and no
    duplicate write.

### 4. Verify where the paid Asset request goes

36. After Codex confirms `paid-pending`, inspect the same target card without
    reloading.
37. Confirm its availability changed exactly `3 → 2` and no duplicate card
    appeared.
38. Open its menu. Confirm `Payment summary` is present and another same-scope
    `Pay` action is absent.
39. Open `Payment summary` once. Confirm it is read-only and contains the exact
    Event/Sub-event, timeframe, quantity `1`, required policy, amount/currency
    and recorded dummy-payment result.
40. Close and reopen `Payment summary`. The values remain identical and the
    read creates no second request/payment/reservation.
41. Open the exact Event/Sub-event resource view and confirm the paid Transport
    has one pending borrower/resource contribution, not an accepted or global
    assignment under another scope.
42. In **Casey**, open
    `My Assets → Transport → QA ASSET-CHECKOUT-DUMMY-001 Paid Transport → Members`.
43. Confirm Nova appears exactly once as a pending borrow request with the
    exact Event/Sub-event timeframe, quantity and payment context.
44. Confirm no Riley row and no request for the sibling Sub-event exists.
45. Report:

    `ASSET-CHECKOUT-DUMMY-001 request destination ready: Nova pending once, availability 2`

### 5. Accept the paid request once and verify the terminal scope

46. After Codex confirms the pending destination, open Nova's request menu in
    Casey's Asset Members surface.
47. Select `Approve`, then confirm `Approve` exactly once.
48. Without reloading, confirm Nova changes from pending to accepted exactly
    once and the pending indicator disappears.
49. Confirm the Asset availability remains `2`; approval must not reserve the
    already paid quantity a second time.
50. In Nova, reopen the exact Event/Sub-event resource view. Confirm the paid
    Transport is accepted/available in that scope and `Payment summary`
    remains read-only with the original payment values.
51. Confirm Nova did not gain Event Admin, Tournament-group membership, global
    Asset Manager or ownership of Casey's Asset.
52. Report:

    `ASSET-CHECKOUT-DUMMY-001 accepted: exact scoped resource, availability stays 2`

53. Wait for Codex to capture the `accepted` oracle and exact unchanged sibling
    controls.

### 6. Verify reload reconstruction and the action variants

54. Reload Casey and Nova exactly once each.
55. Reopen Casey's Asset Members and Nova's scoped resource/Payment summary.
    Confirm the same request identity, accepted state, payment values and
    availability `2` return.
56. Inspect the staged **Free** Asset. Confirm `Borrow` opens a review whose
    forward action is `Send borrow request` and no `Dummy pay`, `Pay`, session
    or payment summary is presented. Close without submitting.
57. Inspect the unavailable control. Confirm it has no enabled `Borrow` action
    for the selected window, or is absent from the availability-filtered
    Explore list. Do not change filters or dates to make it eligible.
58. Confirm the adjacent paid Asset, sibling Sub-event and every Riley control
    remain unchanged and own no target session/payment identity.
59. Report the terminal phrase:

    `ASSET-CHECKOUT-DUMMY-001 UI complete: payment, request, acceptance and button variants persist`

Wait for Codex's final persisted/idempotence oracle. Do not reset or continue
to another testcase until Codex records the result and restores the fixture.
