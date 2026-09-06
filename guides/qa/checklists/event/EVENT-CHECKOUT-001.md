# EVENT-CHECKOUT-001 user test guide

This Event-owned journey carries the Stripe direct-payment branch, the
saved-card assignment/expired-card guard, and a separate Cash-only negative
control. There is no separate External Payment row.

This file is the tester's stable, repeatable click-by-click guide. It is not an
execution log: do not check off its steps or add current dates, IDs, status or
machine evidence to it.

The complete journey is one testcase transaction. `payment-ready`,
`cancelled` and `paid` are replay savepoints inside this testcase, not separate
matrix rows.

## Actors and startup

- **Nova** pays the Evening Slot and performs the primary participant-side
  observations.
- **Riley** pays the remaining Morning Slot in the former Casey browser during
  block 4.
- **Casey** owns the Events. After Nova's payment, sign out of Casey and use
  that same browser for Riley; sign back in as Casey only for the final Event
  Members check.
- **Ava** selects the demo provider branch before each declared control.
- Codex stages all Events, checkout controls and sessions and runs the
  independent machine oracles. The user exclusively opens and controls the
  configured Casey/Nova/Ava browser sessions. Riley reuses Casey's browser;
  do not create a replacement Event, user, payment or browser profile.
- Ava controls the demo provider from the Admin payment simulator. No real
  provider credential or card data is used.
- The saved-card fixture includes one active card tokenized for the other
  provider solely to prove the assign-screen recovery menu. It is never used
  to start the controlled Stripe payment.
- Riley has one separate active Stripe fixture card for the Morning payment.
- Stop at the first mismatch. Do not compensate with a second click, another
  checkout attempt, an unlisted reload or an API/Mongo action.

To start a complete replay, tell Codex:

`Prepare the EVENT-CHECKOUT-001 user test.`

Begin only after Codex confirms this exact baseline:

- `QA EVENT-CHECKOUT-001 Paid` is Public, published, Ticketing Off,
  directly joinable and visible once to Nova in Event Explore;
- it has two named Slots with one participant place each in addition to Casey,
  one paid optional item, one required policy and root capacity `1 / 6`, with
  Casey as the sole accepted Admin;
- Nova and Riley have no target membership, Activity Events row, basket,
  payment, chat or Event/Ticket counter contribution;
- the Free, Approval and Waitlist controls are present in their declared
  baseline states;
- a separate paid Cash-only Event control is present for the final negative
  branch;
- the simulator is deliberately staged on **Cash only** so the first checkout
  can prove the provider-change guard before continuing as the Stripe journey;
- isolated Casey, Nova and Ava windows are open and identity-verified.

## Complete test journey

### 1. Build the fresh paid checkout under Cash only

1. In **Ava**, open the Admin payment simulator and confirm the staged provider
   is **Cash only**. Do not select Stripe yet.
2. In **Nova**, open `Activities → Events → Explore`.
3. Find `QA EVENT-CHECKOUT-001 Paid` exactly once.
4. Open its menu. Confirm `Book Event` is present and that `Continue booking`
   and `Payment summary` are absent.
5. Select `Book Event` once.
6. Confirm the checkout title is `Review Booking & Pay` and no payment success
   is claimed.
7. Before selecting a Slot, confirm the forward action is disabled. Do not try
   to bypass it with Enter or a double click.
8. Select `QA Morning Slot` only.
9. Leave the required `QA Attendance policy` unaccepted and confirm the
   checkout cannot advance.
10. Accept `QA Attendance policy` once.
11. Add `QA Workshop Add-on` once. Confirm it appears once in the basket and
    increases the displayed total once.
12. Record the visible Slot, add-on, policy, total and currency. Do not enter or
    alter the disabled demo card fields.
13. Confirm the forward action is now `Join`; `Payment summary` is still
    absent.
14. Select `Join` exactly once.
15. Confirm the same checkout changes to the payment phase and shows all of
    the following:

    - the translated `Cash only` provider badge and `Pay in cash` status;
    - the same Slot, add-on, policy, total and currency;
    - no card selector;
    - `Back`, `Cancel payment` and `Confirm cash payment` actions;
    - no accepted-membership or success message yet.
16. Select `Confirm cash payment` once to open its confirmation dialog. Do not
    select the dialog's confirmation action yet, and leave both dialogs open.

### 2. Reject the stale Cash-only confirmation and continue with Stripe

17. In **Ava**, select connected **Stripe** with 3DS Off and save. Saving
    generates the demo connection automatically. Return to Nova only after the
    configuration is visibly saved.
18. In **Nova**, select `Confirm cash payment` exactly once in the still-open
    confirmation dialog.
19. Confirm the request is rejected with `Payment provider changed to Stripe.
    Select a compatible card and confirm again.` The confirmation dialog must
    remain open and must not claim success or create membership/payment. Close
    that dialog normally, then confirm the existing payment screen has updated
    through the returned provider signal without a reload or separate
    configuration request. It must now show:

    - a contextual Stripe provider badge that does not depend on card
      selection;
    - the same Slot, add-on, policy, total and currency;
    - a card picker with active cards and the expired-card guard;
    - `Back`, `Cancel payment` and `Payment` actions;
    - no accepted-membership or success message.

20. Open the card picker. Confirm expired `0008` keeps its artwork, shows the
    red Expired badge, has no hover/press selection state and cannot be
    selected. Confirm the provider-mismatched active card has the same white
    overlay, cannot be selected, and exposes `Retokenize >` instead of a
    three-dot trigger. Open that badge once and confirm `Retokenize card` and
    `Delete card` are available without closing or resetting the checkout;
    close its menu without mutating the card. Select one active Stripe card and
    confirm the blue selection outline does not widen or clip the card; the
    checkmark is sufficient. Confirm the primary action becomes enabled once
    and does not flicker or multiply.
21. Report this phrase so Codex can capture the basket/session and
    pending-membership boundary. After the capture is confirmed, continue
    through step 32 without another machine-oracle stop:

    `EVENT-CHECKOUT-001 payment ready: Stripe card assigned, expired blocked, membership pending`

### 3. Resume the payment phase, then cancel it

22. After Codex confirms `payment-ready`, close the checkout with its normal
    close control. Do not select Back, Cancel or Payment.
23. Open `Activities → Events → Pending` and confirm the target Event appears
    exactly once.
24. Open its menu and confirm it shows `Continue booking` instead of `Book
    Event`. Record this phrase as the UI checkpoint; do not stop for a separate
    machine oracle because the step-21 capture preserves the persisted Pending
    counter, basket, membership and zero-payment boundary:

    `EVENT-CHECKOUT-001 pending Activity Event: one card, Continue booking`
25. Select `Continue booking` and confirm the same payment phase returns with
    the same Slot, add-on, policy, amount and currency.
26. Close it again, then reload Nova exactly once.
27. Reopen `Activities → Events → Pending`. Confirm the same card still exposes
    `Continue booking`, then open it once.
28. Confirm the payment phase reconstructs the same selections and does not
    create a second basket/session, accepted membership or payment.
29. Select `Cancel payment`, then confirm `Cancel payment` exactly once in the
    confirmation dialog.
30. Confirm the checkout closes, the basket item disappears and the target
    card menu returns to `Book Event` without reloading.
31. Confirm the target is absent from Nova's `Pending`, `Active Events` and
    `All Events`.
32. Report this phrase and wait for Codex to prove one closed basket audit and
    zero successful payment/membership effects:

    `EVENT-CHECKOUT-001 cancelled: Book Event restored, no participation`

### 4. Complete both Slots with two users and prove there is no freeze

33. After Codex confirms `cancelled`, return to Event Explore and open the
    target's `Book Event` action once.
34. Select `QA Evening Slot`, accept `QA Attendance policy`, and keep
    `QA Workshop Add-on` unselected. Do not change another field.
35. Confirm the displayed total differs from the cancelled attempt exactly as
    expected for the selected Slot/add-on combination.
36. Select `Join` exactly once to enter the payment phase.
37. Confirm the Stripe badge, selected active card, Evening Slot and the new
    exact total are shown. In the card selector, selectable cards come first,
    followed by `Reconnect` cards and then `Expired` cards.
38. Select `Payment` **exactly once**.
39. While the request is active, confirm the action changes to `Paying...` and
    cannot be selected again. The page must remain responsive: scrolling and
    the loading indication continue to render.
40. Wait for the result. Stop and report if an error appears, `Paying...` does
    not finish, the UI freezes or a second popup opens. Do not select `Payment`
    again.

41. Confirm the checkout closes once on success and no stale overlay blocks
    the application.
42. Do not start another checkout yet. Report:

    `EVENT-CHECKOUT-001 Nova paid: checkout closed once and UI stayed responsive`

43. In Nova, reopen the target menu and confirm `Continue booking` is present.
    This is correct because the Morning Slot still has one participant place;
    do not treat it as a stale basket or defect.
44. In the existing **Casey** browser, sign out and sign in as **Riley**. Do not
    open a fourth browser.
45. In Riley, open Event Explore, find the target exactly once and select `Book
    Event`.
46. Select `QA Morning Slot`, accept `QA Attendance policy`, leave `QA Workshop
    Add-on` unselected, then select `Join` once.
47. Confirm the payment phase shows Stripe, the Morning Slot, HUF 3,200 and
    Riley's active compatible card. Select that card if it is not preselected.
48. Select `Payment` exactly once. Confirm the action cannot be submitted again
    while active and the UI remains responsive.
49. Confirm Riley's checkout closes once on success.
50. In both Nova and Riley, reopen Event Explore. The target must remain exactly
    once and both Slots must be full. The payment response must update the card
    immediately: `Book Event`, `Continue booking`, `Join waiting list`, a new
    payment action and a paid basket entry must all be absent. `Add to
    Watchlist` remains available as the Event-level notification action.
51. In both users' Active Event menus, confirm `Continue booking`, `Book Event`
    and another `Payment` action are absent. A stale action for either user is
    a failure.
52. Report:

    `EVENT-CHECKOUT-001 both slots paid: Evening by Nova, Morning by Riley`

53. Wait for Codex to prove exactly two approved Stripe payments, two succeeded
    inactive baskets, accepted Nova and Riley memberships, both Slots full and
    no duplicate write.

    This run also covered Nova leaving and rejoining the Evening Slot several
    times while Riley's paid Morning booking remained unchanged. Treat that as
    completed exploratory coverage inside this block; do not replay it as a
    separate later block. The background audit must distinguish the extra
    closed basket history from an active duplicate.

### 5. Verify where the successful Event checkout goes

54. After Codex confirms `paid`, in Nova open `Activities → Events → Active
    Events`.
55. Confirm `QA EVENT-CHECKOUT-001 Paid` appears exactly once.
56. Open its menu and confirm these actions are present:

    - `View Event`;
    - `Payment summary`;
    - `Leave Event`.

57. Confirm `Book Event`, `Continue booking` and another `Payment` action are
    absent.
58. Open `Payment summary` once. Confirm it is read-only and shows the exact
    Evening Slot, accepted policy, no Workshop add-on, final amount/currency,
    Stripe provider, selected payment method and paid/recorded result. The
    Stripe provider badge stays in the Payment block's top-right corner.
59. Close and reopen `Payment summary`. It must show the same values and no
    loading loop, editable payment field or Pay button.
60. In Riley, open the same read-only `Payment summary` and confirm it shows
    Riley's Morning Slot payment, not Nova's Evening payment.
61. Open `All Events` for both users and confirm the Event appears exactly once
    for each.
62. Return to Event Explore and reconfirm the target remains exactly once with
    `Add to Watchlist`, but without `Continue booking`, `Join waiting list`, a
    fresh payment action or a basket candidate for either user. This later read
    must converge to the same state already signalled by the final payment.
63. Sign Riley out of the reused browser, sign back in as **Casey**, then open
    the target through `My Events → Event Members`.
64. Confirm Casey appears once as Admin, Nova and Riley once each as accepted
    Members, no pending target row exists, and occupancy is `3 / 6`.
65. Confirm no target Ticket action/counter exists for Nova or Riley because
    Ticketing is Off.
66. Report:

    `EVENT-CHECKOUT-001 destination ready: Active/All, two Payment summaries and 3/6 membership`

    Wait for Codex to verify the persisted destination and capture the exact
    step-66 rollback checkpoint.

### 6. Verify reload reconstruction and the action variants

67. After Codex confirms the destination boundary, reload Nova exactly once.
68. Reopen `Active Events`, `All Events` and `Payment summary`. Confirm the
    same one-card, same-action and same immutable-summary state returns.
69. Open the staged **Free** control from Event Explore. Confirm its checkout
    offers `Join Event`/`Join` and never opens a payment phase. Close it
    without joining.
70. Open the staged **Approval** control. Confirm it shows the pending approval
    state with `Waiting for approval`/`Cancel request` and no enabled `Payment`
    before Admin approval. Close without changing it.
71. Open the staged **Waitlist** control. Confirm it shows `Waiting List` and
    `Leave waitlist`, with payment locked while no place exists. `Continue
    booking` and an active basket must be absent. Close without changing it.
72. In **Ava**, select `Cash only`, save, and return to Nova's separate paid
    Cash-only control. Because this is a plain non-slot Event, confirm its
    checkout has no Basket/slot-selection panel. Advance it to payment review.
    Confirm the provider badge says translated `Cash only`, the status says
    translated `Pay in cash`, and there is no card selector. Select `Cancel
    payment` and confirm it once; closing the popup alone is not cancellation.
73. Confirm the adjacent paid Event and all Free/Approval/Waitlist controls
    remain unchanged.
74. Report the control phrase:

    `EVENT-CHECKOUT-001 UI complete: Stripe persisted, Cash only has no card selector, all controls match`

Before step 75, an optional short visual regression glance is enough; it is
not another checkpoint. Reload Event Explore once so the repaired server
fixture can reconcile any stale browser draft, then check only these three:

- `QA EVENT-CHECKOUT-001 Waitlist`: its menu has no `Continue booking`;
- `QA EVENT-CHECKOUT-001 Cash only`: `Book Event` opens without a Basket/Slot
  panel;
- `QA EVENT-CHECKOUT-001 Paid` in Active Events: `Payment summary` still shows
  its selected Slot/basket item.

### 7. Verify the Event Watchlist without changing All

75. In Nova, find the fully booked target in Event Explore and select `Add to
    Watchlist` exactly once. Confirm its menu changes to `Remove from Watchlist`
    without reloading and no basket or membership is created.
76. Immediately open `Activities → Events → Watchlist`. Confirm the dropdown
    label is `Watchlist`, its own red counter increased once, and the target
    appears exactly once. The toolbar must show only the existing Event Explore
    icon: the `+` quick-action button must be absent. Confirm the `All` list and
    `All` counter did not change because Watchlist is a separate bucket.
77. Reload Nova once, reopen `Watchlist`, and confirm the same one subscription,
    one row and own counter return from the user-model poll. `All` must remain
    unchanged.
78. In Riley, leave the target Event once so at least one Slot becomes open.
    Do not make a new booking. After the Watchlist availability check runs,
    confirm Nova receives exactly one notification that a place is available.
    The notification must not reserve a Slot, create a basket or create pending
    membership.
79. Open the notification and confirm it only opens the Event. Any later Slot
    choice must still go through the normal booking flow.
80. In Nova, select `Remove from Watchlist` once. Confirm the Watchlist row and
    its own counter update immediately; after the next user-model poll they must
    not return, and `All` must still be unchanged. Report:

    `EVENT-CHECKOUT-001 Watchlist complete: separate counter, one availability notification, no reservation`

Wait for Codex's final persisted/idempotence oracle. Do not reset or continue
to another testcase until Codex records the result and restores the fixture.
