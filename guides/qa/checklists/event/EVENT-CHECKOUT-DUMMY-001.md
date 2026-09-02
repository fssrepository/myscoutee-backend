# EVENT-CHECKOUT-DUMMY-001 user test guide

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
- Codex stages all Events, checkout controls and sessions, opens the isolated
  Casey/Nova windows and runs the independent machine oracles. Do not create a
  replacement Event, user, payment or browser profile.
- The dev environment must resolve the in-product demo payment mode. No
  Stripe, Barion, simulator control or real provider credential is used by
  this Core Event checkpoint.
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
  read-only states and the adjacent paid Event is unchanged;
- isolated Casey and Nova windows are open and identity-verified.

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

    - provider/status panel `Demo payment`;
    - the same Slot, add-on, policy, total and currency;
    - disabled demo-card fields;
    - `Back`, `Cancel payment` and `Payment` actions;
    - no accepted-membership or success message yet.

15. Confirm that the primary action is enabled once and does not flicker or
    multiply.
16. Report this phrase and wait for Codex to capture the basket/session and
    zero-membership boundary:

    `EVENT-CHECKOUT-DUMMY-001 payment ready: demo Payment visible, no membership yet`

### 2. Resume the payment phase, then cancel it

17. After Codex confirms `payment-ready`, close the checkout with its normal
    close control. Do not select Back, Cancel or Payment.
18. In the still-open Event Explore surface, confirm the target card remains
    visible and its menu now shows `Continue booking` instead of `Book Event`.
19. Confirm the checkout/basket affordance reports exactly one target item.
20. Select `Continue booking` and confirm the same payment phase returns with
    the same Slot, add-on, policy, amount and currency.
21. Close it again, then reload Nova exactly once.
22. Reopen Event Explore. Confirm the same card still exposes
    `Continue booking`, then open it once.
23. Confirm the payment phase reconstructs the same selections and does not
    create a second basket/session, accepted membership or payment.
24. Select `Cancel payment`, then confirm `Cancel payment` exactly once in the
    confirmation dialog.
25. Confirm the checkout closes, the basket item disappears and the target
    card menu returns to `Book Event` without reloading.
26. Confirm the target is absent from Nova's `Active Events` and `All Events`.
27. Report this phrase and wait for Codex to prove one closed basket audit and
    zero successful payment/membership effects:

    `EVENT-CHECKOUT-DUMMY-001 cancelled: Book Event restored, no participation`

### 3. Complete one fresh dummy payment and prove there is no freeze

28. After Codex confirms `cancelled`, return to Event Explore and open the
    target's `Book Event` action once.
29. Select `QA Evening Slot`, accept `QA Attendance policy`, and keep
    `QA Workshop Add-on` unselected. Do not change another field.
30. Confirm the displayed total differs from the cancelled attempt exactly as
    expected for the selected Slot/add-on combination.
31. Select `Join` exactly once to enter the payment phase.
32. Confirm `Demo payment`, the Evening Slot and the new exact total are shown.
33. Select `Payment` **exactly once**.
34. While the request is active, confirm the action changes to `Paying...` and
    cannot be selected again. The page must remain responsive: scrolling and
    the loading indication continue to render.
35. Wait for the normal request to finish. The following are immediate FAIL
    conditions:

    - `Paying...` remains indefinitely with no terminal response;
    - the browser, popup or page stops responding;
    - a second checkout/payment popup appears;
    - an error is hidden while the UI claims success.

36. Confirm the checkout closes once on success and no stale overlay blocks
    the application.
37. Do not click another target action. Report:

    `EVENT-CHECKOUT-DUMMY-001 paid: checkout closed once and UI stayed responsive`

38. Wait for Codex to prove exactly one approved dummy payment, one succeeded
    inactive basket, one accepted Nova membership and no duplicate write.

### 4. Verify where the successful Event checkout goes

39. After Codex confirms `paid`, open `Activities → Events → Active Events`.
40. Confirm `QA EVENT-CHECKOUT-DUMMY-001 Paid` appears exactly once.
41. Open its menu and confirm these actions are present:

    - `View Event`;
    - `Payment summary`;
    - `Leave Event`.

42. Confirm `Book Event`, `Continue booking` and another `Payment` action are
    absent.
43. Open `Payment summary` once. Confirm it is read-only and shows the exact
    Evening Slot, accepted policy, no Workshop add-on, final amount/currency,
    demo provider and paid/recorded result.
44. Close and reopen `Payment summary`. It must show the same values and no
    loading loop, editable payment field or Pay button.
45. Open `All Events` and confirm the same Event appears exactly once there.
46. Return to Event Explore and confirm the target is not presented as a fresh
    payment candidate for Nova.
47. In **Casey**, open the target through `My Events → Event Members`.
48. Confirm Casey appears once as Admin, Nova once as accepted Member, no
    pending target row exists, and occupancy is `2 / 6`.
49. Confirm no target Ticket action/counter exists for Nova because Ticketing
    is Off.
50. Report:

    `EVENT-CHECKOUT-DUMMY-001 destination ready: Active/All, Payment summary and 2/6 membership`

### 5. Verify reload reconstruction and the action variants

51. After Codex confirms the destination boundary, reload Nova exactly once.
52. Reopen `Active Events`, `All Events` and `Payment summary`. Confirm the
    same one-card, same-action and same immutable-summary state returns.
53. Open the staged **Free** control from Event Explore. Confirm its checkout
    offers `Join Event`/`Join` and never opens a demo-payment phase. Close it
    without joining.
54. Open the staged **Approval** control. Confirm it shows the pending approval
    state with `Waiting for approval`/`Cancel request` and no enabled `Payment`
    before Admin approval. Close without changing it.
55. Open the staged **Waitlist** control. Confirm it shows `Waiting List` and
    `Leave waitlist`, with payment locked while no place exists. Close without
    changing it.
56. Confirm the adjacent paid Event and every Riley control remain unchanged.
57. Report the terminal phrase:

    `EVENT-CHECKOUT-DUMMY-001 UI complete: paid flow persisted and all button variants match`

Wait for Codex's final persisted/idempotence oracle. Do not reset or continue
to another testcase until Codex records the result and restores the fixture.
