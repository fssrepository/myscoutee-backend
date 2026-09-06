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

- **Nova** performs the Event Explore checkout and every participant-side
  observation.
- **Casey** owns the Events and performs only the final Event Members check.
- **Ava** selects the demo provider branch before each declared control.
- Codex stages all Events, checkout controls and sessions and runs the
  independent machine oracles. The user exclusively opens and controls the
  configured Casey/Nova/Ava browser sessions. Do not create a replacement
  Event, user, payment or browser profile.
- Ava controls the demo provider from the Admin payment simulator. No real
  provider credential or card data is used.
- The saved-card fixture includes one active card tokenized for the other
  provider solely to prove the assign-screen recovery menu. It is never used
  to start the controlled Stripe payment.
- Stop at the first mismatch. Do not compensate with a second click, another
  checkout attempt, an unlisted reload or an API/Mongo action.

To start a complete replay, tell Codex:

`Prepare the EVENT-CHECKOUT-001 user test.`

Begin only after Codex confirms this exact baseline:

- `QA EVENT-CHECKOUT-001 Paid` is Public, published, Ticketing Off,
  directly joinable and visible once to Nova in Event Explore;
- it has two named Slots, one paid optional item, one required policy and
  capacity `1 / 6`, with Casey as the sole accepted Admin;
- Nova has no target membership, Activity Events row, basket, payment, chat or
  Event/Ticket counter contribution;
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
21. Report this phrase and wait for Codex to capture the basket/session and
    pending-membership boundary:

    `EVENT-CHECKOUT-001 payment ready: Stripe card assigned, expired blocked, membership pending`

### 3. Resume the payment phase, then cancel it

22. After Codex confirms `payment-ready`, close the checkout with its normal
    close control. Do not select Back, Cancel or Payment.
23. Open `Activities → Events → Pending` and confirm the target Event appears
    exactly once.
24. Open its menu and confirm it shows `Continue booking` instead of `Book
    Event`. Report this phrase and wait for Codex to verify the persisted
    Pending counter, captured basket, pending membership and zero-payment
    boundary:

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

### 4. Complete one fresh Stripe payment and prove there is no freeze

33. After Codex confirms `cancelled`, return to Event Explore and open the
    target's `Book Event` action once.
34. Select `QA Evening Slot`, accept `QA Attendance policy`, and keep
    `QA Workshop Add-on` unselected. Do not change another field.
35. Confirm the displayed total differs from the cancelled attempt exactly as
    expected for the selected Slot/add-on combination.
36. Select `Join` exactly once to enter the payment phase.
37. Confirm the Stripe badge, selected active card, Evening Slot and the new
    exact total are shown.
38. Select `Payment` **exactly once**.
39. While the request is active, confirm the action changes to `Paying...` and
    cannot be selected again. The page must remain responsive: scrolling and
    the loading indication continue to render.
40. Wait for the normal request to finish. The following are immediate FAIL
    conditions:

    - `Paying...` remains indefinitely with no terminal response;
    - the browser, popup or page stops responding;
    - a second checkout/payment popup appears;
    - an error is hidden while the UI claims success.

    The provider is authoritative only when this new payment starts. A known
    payment/3DS session already returned by the provider remains pinned to that
    provider and may finish even if the operator changes the provider used by
    later payments. A later new or periodic payment must reject the old token
    with the short provider-specific message, for example `Payment provider
    changed to Barion. Reconnect your card.`; Cash-only instead reports
    `Payment provider changed to Cash only. Start payment again.` The same
    response carries the current provider id and updates the shared provider
    badge directly, without a second configuration request or a background
    poll. The selected card remains visible with a static blue `Update needed`
    badge; the badge itself is not clickable, while the card still opens the
    picker. The UI must not silently clear the selection, and Payment remains
    unavailable until a provider-compatible card is selected. In Cards/assign,
    `Reconnect >` opens exactly `Retokenize card` and `Delete card`.

41. Confirm the checkout closes once on success and no stale overlay blocks
    the application.
42. Do not click another target action. Report:

    `EVENT-CHECKOUT-001 paid: checkout closed once and UI stayed responsive`

43. Wait for Codex to prove exactly one approved Stripe payment, one succeeded
    inactive basket, one accepted Nova membership and no duplicate write.

### 5. Verify where the successful Event checkout goes

44. After Codex confirms `paid`, open `Activities → Events → Active Events`.
45. Confirm `QA EVENT-CHECKOUT-001 Paid` appears exactly once.
46. Open its menu and confirm these actions are present:

    - `View Event`;
    - `Payment summary`;
    - `Leave Event`.

47. Confirm `Book Event`, `Continue booking` and another `Payment` action are
    absent.
48. Open `Payment summary` once. Confirm it is read-only and shows the exact
    Evening Slot, accepted policy, no Workshop add-on, final amount/currency,
    Stripe provider, selected payment method and paid/recorded result.
49. Close and reopen `Payment summary`. It must show the same values and no
    loading loop, editable payment field or Pay button.
50. Open `All Events` and confirm the same Event appears exactly once there.
51. Return to Event Explore and confirm the target is not presented as a fresh
    payment candidate for Nova.
52. In **Casey**, open the target through `My Events → Event Members`.
53. Confirm Casey appears once as Admin, Nova once as accepted Member, no
    pending target row exists, and occupancy is `2 / 6`.
54. Confirm no target Ticket action/counter exists for Nova because Ticketing
    is Off.
55. Report:

    `EVENT-CHECKOUT-001 destination ready: Active/All, Payment summary and 2/6 membership`

### 6. Verify reload reconstruction and the action variants

56. After Codex confirms the destination boundary, reload Nova exactly once.
57. Reopen `Active Events`, `All Events` and `Payment summary`. Confirm the
    same one-card, same-action and same immutable-summary state returns.
58. Open the staged **Free** control from Event Explore. Confirm its checkout
    offers `Join Event`/`Join` and never opens a payment phase. Close it
    without joining.
59. Open the staged **Approval** control. Confirm it shows the pending approval
    state with `Waiting for approval`/`Cancel request` and no enabled `Payment`
    before Admin approval. Close without changing it.
60. Open the staged **Waitlist** control. Confirm it shows `Waiting List` and
    `Leave waitlist`, with payment locked while no place exists. Close without
    changing it.
61. In **Ava**, select `Cash only`, save, and return to Nova's separate paid
    Cash-only control. Advance it to payment review. Confirm the provider badge
    says translated `Cash only`, the status says translated `Pay in cash`, and
    there is no card selector. Cancel that checkout without recording payment.
62. Confirm the adjacent paid Event and every Riley control remain unchanged.
63. Report the terminal phrase:

    `EVENT-CHECKOUT-001 UI complete: Stripe persisted, Cash only has no card selector, all controls match`

Wait for Codex's final persisted/idempotence oracle. Do not reset or continue
to another testcase until Codex records the result and restores the fixture.
