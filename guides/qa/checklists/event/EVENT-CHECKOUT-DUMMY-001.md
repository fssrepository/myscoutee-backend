# EVENT-CHECKOUT-DUMMY-001 user test guide

The ID is retained for ledger stability, but this is no longer a dummy-only
checkout. This Event-owned journey carries the Stripe direct-payment branch,
the saved-card assignment/expired-card guard, and a separate Cash-only
negative control. There is no separate External Payment row.

This file is the tester's stable, repeatable click-by-click guide. It is not an
execution log: do not check off its steps or add current dates, IDs, status or
machine evidence to it.

The complete journey is one testcase transaction. `payment-ready`,
`cancelled` and `paid` are replay savepoints inside this testcase, not separate
matrix rows.

## Actors and startup

- **Nova** performs the Event Explore checkout and every participant-side
  observation.
- **Casey** owns the Events and performs only the final Event Members check.
- **Ava** selects the demo provider branch before each declared control.
- Codex stages all Events, checkout controls and sessions and runs the
  independent machine oracles. The user exclusively opens and controls the
  configured Casey/Nova/Ava browser sessions. Do not create a replacement
  Event, user, payment or browser profile.
- Ava first selects connected **Stripe** with 3DS Off. Saving the simulator
  configuration generates the test connection automatically. Before the
  declared Cash-only control, Ava selects **Cash only**. No real provider
  credential or card data is used.
- Stop at the first mismatch. Do not compensate with a second click, another
  checkout attempt, an unlisted reload or an API/Mongo action.

To start a complete replay, tell Codex:

`Prepare the EVENT-CHECKOUT-DUMMY-001 user test.`

Begin only after Codex confirms this exact baseline:

- `QA EVENT-CHECKOUT-DUMMY-001 Paid` is Public, published, Ticketing Off,
  directly joinable and visible once to Nova in Event Explore;
- it has two named Slots, one paid optional item, one required policy and
  capacity `1 / 6`, with Casey as the sole accepted Admin;
- Nova has no target membership, Activity Events row, basket, payment, chat or
  Event/Ticket counter contribution;
- the Free, Approval and Waitlist controls are present in their declared
  baseline states;
- a separate paid Cash-only Event control is present for the final negative
  branch;
- isolated Casey, Nova and Ava windows are open and identity-verified.

## Complete test journey

### 1. Verify the fresh paid action and review gates

1. In **Nova**, open `Activities → Events → Explore`.
2. Find `QA EVENT-CHECKOUT-DUMMY-001 Paid` exactly once.
3. Open its menu. Confirm `Book Event` is present and that `Continue booking`
   and `Payment summary` are absent.
4. Select `Book Event` once.
5. Confirm the checkout title is `Review Booking & Pay` and no payment success
   is claimed.
6. Before selecting a Slot, confirm the forward action is disabled. Do not try
   to bypass it with Enter or a double click.
7. Select `QA Morning Slot` only.
8. Leave the required `QA Attendance policy` unaccepted and confirm the
   checkout cannot advance.
9. Accept `QA Attendance policy` once.
10. Add `QA Workshop Add-on` once. Confirm it appears once in the basket and
    increases the displayed total once.
11. Record the visible Slot, add-on, policy, total and currency. Do not enter or
    alter the disabled demo card fields.
12. Confirm the forward action is now `Join`; `Payment summary` is still
    absent.
13. Select `Join` exactly once.
14. Confirm the same checkout changes to the payment phase and shows all of
    the following:

    - a contextual Stripe provider badge that does not depend on card
      selection;
    - the same Slot, add-on, policy, total and currency;
    - a card picker with active cards and the expired-card guard;
    - `Back`, `Cancel payment` and `Payment` actions;
    - no accepted-membership or success message yet.

15. Confirm that the primary action is enabled once and does not flicker or
    multiply.
16. Open the card picker. Confirm expired `0008` keeps its artwork, shows the
    red Expired badge, has no hover/press selection state and cannot be
    selected. Select one active Stripe card and confirm the blue selection
    outline does not widen or clip the card; the checkmark is sufficient.
17. Report this phrase and wait for Codex to capture the basket/session and
    zero-membership boundary:

    `EVENT-CHECKOUT-DUMMY-001 payment ready: Stripe card assigned, expired blocked, no membership yet`

### 2. Resume the payment phase, then cancel it

18. After Codex confirms `payment-ready`, close the checkout with its normal
    close control. Do not select Back, Cancel or Payment.
19. In the still-open Event Explore surface, confirm the target card remains
    visible and its menu now shows `Continue booking` instead of `Book Event`.
20. Confirm the checkout/basket affordance reports exactly one target item.
21. Select `Continue booking` and confirm the same payment phase returns with
    the same Slot, add-on, policy, amount and currency.
22. Close it again, then reload Nova exactly once.
23. Reopen Event Explore. Confirm the same card still exposes
    `Continue booking`, then open it once.
24. Confirm the payment phase reconstructs the same selections and does not
    create a second basket/session, accepted membership or payment.
25. Select `Cancel payment`, then confirm `Cancel payment` exactly once in the
    confirmation dialog.
26. Confirm the checkout closes, the basket item disappears and the target
    card menu returns to `Book Event` without reloading.
27. Confirm the target is absent from Nova's `Active Events` and `All Events`.
28. Report this phrase and wait for Codex to prove one closed basket audit and
    zero successful payment/membership effects:

    `EVENT-CHECKOUT-DUMMY-001 cancelled: Book Event restored, no participation`

### 3. Complete one fresh dummy payment and prove there is no freeze

29. After Codex confirms `cancelled`, return to Event Explore and open the
    target's `Book Event` action once.
30. Select `QA Evening Slot`, accept `QA Attendance policy`, and keep
    `QA Workshop Add-on` unselected. Do not change another field.
31. Confirm the displayed total differs from the cancelled attempt exactly as
    expected for the selected Slot/add-on combination.
32. Select `Join` exactly once to enter the payment phase.
33. Confirm the Stripe badge, selected active card, Evening Slot and the new
    exact total are shown.
34. Select `Payment` **exactly once**.
35. While the request is active, confirm the action changes to `Paying...` and
    cannot be selected again. The page must remain responsive: scrolling and
    the loading indication continue to render.
36. Wait for the normal request to finish. The following are immediate FAIL
    conditions:

    - `Paying...` remains indefinitely with no terminal response;
    - the browser, popup or page stops responding;
    - a second checkout/payment popup appears;
    - an error is hidden while the UI claims success.

37. Confirm the checkout closes once on success and no stale overlay blocks
    the application.
38. Do not click another target action. Report:

    `EVENT-CHECKOUT-DUMMY-001 paid: checkout closed once and UI stayed responsive`

39. Wait for Codex to prove exactly one approved Stripe payment, one succeeded
    inactive basket, one accepted Nova membership and no duplicate write.

### 4. Verify where the successful Event checkout goes

40. After Codex confirms `paid`, open `Activities → Events → Active Events`.
41. Confirm `QA EVENT-CHECKOUT-DUMMY-001 Paid` appears exactly once.
42. Open its menu and confirm these actions are present:

    - `View Event`;
    - `Payment summary`;
    - `Leave Event`.

43. Confirm `Book Event`, `Continue booking` and another `Payment` action are
    absent.
44. Open `Payment summary` once. Confirm it is read-only and shows the exact
    Evening Slot, accepted policy, no Workshop add-on, final amount/currency,
    Stripe provider, selected payment method and paid/recorded result.
45. Close and reopen `Payment summary`. It must show the same values and no
    loading loop, editable payment field or Pay button.
46. Open `All Events` and confirm the same Event appears exactly once there.
47. Return to Event Explore and confirm the target is not presented as a fresh
    payment candidate for Nova.
48. In **Casey**, open the target through `My Events → Event Members`.
49. Confirm Casey appears once as Admin, Nova once as accepted Member, no
    pending target row exists, and occupancy is `2 / 6`.
50. Confirm no target Ticket action/counter exists for Nova because Ticketing
    is Off.
51. Report:

    `EVENT-CHECKOUT-DUMMY-001 destination ready: Active/All, Payment summary and 2/6 membership`

### 5. Verify reload reconstruction and the action variants

52. After Codex confirms the destination boundary, reload Nova exactly once.
53. Reopen `Active Events`, `All Events` and `Payment summary`. Confirm the
    same one-card, same-action and same immutable-summary state returns.
54. Open the staged **Free** control from Event Explore. Confirm its checkout
    offers `Join Event`/`Join` and never opens a payment phase. Close it
    without joining.
55. Open the staged **Approval** control. Confirm it shows the pending approval
    state with `Waiting for approval`/`Cancel request` and no enabled `Payment`
    before Admin approval. Close without changing it.
56. Open the staged **Waitlist** control. Confirm it shows `Waiting List` and
    `Leave waitlist`, with payment locked while no place exists. Close without
    changing it.
57. In **Ava**, select `Cash only`, save, and return to Nova's separate paid
    Cash-only control. Advance it to payment review. Confirm the provider badge
    says translated `Cash only`, the status says translated `Pay in cash`, and
    there is no card selector. Cancel that checkout without recording payment.
58. Confirm the adjacent paid Event and every Riley control remain unchanged.
59. Report the terminal phrase:

    `EVENT-CHECKOUT-DUMMY-001 UI complete: Stripe persisted, Cash only has no card selector, all controls match`

Wait for Codex's final persisted/idempotence oracle. Do not reset or continue
to another testcase until Codex records the result and restores the fixture.
