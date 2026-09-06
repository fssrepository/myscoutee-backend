# PAYMENT-METHODS-HISTORY-001 user test guide

This is the single side-menu Payment testcase. It covers only the product
surfaces launched from the member side menu plus the demo-Admin configuration
needed to register provider-owned test cards. Checkout authorization remains
inside the three Event/Asset journeys; there is no separate External Payment
matrix row.

The complete journey is one testcase transaction. `stripe-registered`,
`barion-registered`, `replace-verified`, `reconnect-verified`,
`expired-cleaned` and `history-complete` are replay savepoints, not separate
matrix rows.

## Actors and startup

- **Alex Turner** uses Payment history, Cards and the expired-card cleanup.
- **Ava Moderation** changes only the demo Payment simulator configuration.
- Codex stages the versioned `payment-ui` fixture, proves phase
  `baseline-ready`, and later runs the machine-side savepoint oracles and exact
  reset. The user exclusively performs browser navigation and clicks.
- Begin with simulator provider **Cash Only**, 3DS Off, exactly three visible
  Alex cards (`4242`, `1881`, expired `0008`), three expense history rows, one
  income row, and totals `HUF −17,400` / `HUF +8,400`.
- Do not start an Event/Asset checkout, do not create another payment, and do
  not remove either baseline active card.

To prepare this test, tell Codex:

`Prepare PAYMENT-METHODS-HISTORY-001 without opening browsers.`

Codex uses:

```text
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints.sh stage payment-ui PAYMENT-METHODS-HISTORY-001
```

Open the configured Ava/Alex windows only after the read-only status reports
`baseline-ready` and simulator provider `none` (the UI label is `Cash Only`).

## 1. Verify Cash Only and the Payment History baseline

1. In **Ava**, confirm the `Testing` group is the last side-menu group and open
   `Payment simulator`. Confirm the text-only `Cash Only` wordmark is selected,
   is visually similar in size to the Stripe wordmark, and 3DS is disabled.
2. In **Alex**, open `Cards`. Confirm `Add card` is disabled while the simulator
   is `Cash Only`; no provider form opens and no registration is created. Return
   to `Payment history`.
3. Confirm the Payment history header
   shows two compact badges: `HUF −17,400` in red and `HUF +8,400` in green.
4. Open the filter. Confirm its translated title and the translated `All`,
   `Expenses` and `Income` choices; no raw i18n key is visible.
5. With `All`, confirm three expense rows and one income row are grouped by
   day. Expense rows have a red-tinted surface/icon, the income row a
   green-tinted surface/icon, and each `HUF ±amount` remains bold and readable.
6. Select `Expenses`; confirm only the three expense rows remain while both
   header totals stay visible. Select `Income`; confirm only the single income
   row remains and both totals stay visible. Return to `All`.
7. Open the captured event and asset summaries one at a time. Confirm their
   status rectangles are green, the correct provider/payment method is shown,
   and read-only cards retain their original hue while appearing lightly
   faded.
8. Open the captured Cash income row. Confirm its summary opens, has a green
   status rectangle and `Cash only`, and does not manufacture a card selector
   or tokenized-card surface.
9. Open the failed Barion row. Confirm its status rectangle is red and the
   summary shows `Bank confirmation was declined.` rather than a generic
   exception or an empty status detail. Close it with X.

## 2. Register one Stripe card

10. In **Ava**, select `Stripe`, enable 3DS, and select
   `Save test configuration`. Confirm the Save response reports success; saving
   itself generates the test connection, so no separate Generate button or
   persistent connection-status badge is expected.
11. In **Alex**, open `Cards`, then `Add card`. Confirm the embedded page is the
   Stripe payment-simulator registration surface, not a MyScoutee card form.
   Its header shows the Stripe logo instead of a duplicate text provider name.
12. Select the header-level `Generate test card` action exactly once. Confirm
   it fills every field together: the accepted Stripe number, meaningful
   `Stripe Test User 001` cardholder, future month/year and a three-digit CVC.
   Then select `Tokenize and save card` exactly once.
13. Confirm the registration surface changes to a three-minute 3DS wait and no
    card is added yet. In **Ava**, open `3DS`; in the possibly multi-member list,
    locate only Alex's pending Stripe **card registration**, open its confirmation
    surface and approve it. Do not act on another member's pending item.
14. In **Alex**, confirm the waiting text changes to the animated success result,
    remains visible briefly, then the popup returns without a page reload and
    exactly one new active Stripe card appears with artwork, masked number,
    cardholder and expiry.
15. Report and wait for the machine oracle:

    `PAYMENT-METHODS-HISTORY-001 stripe registered: one tokenized provider card`

Codex runs `verify-stripe payment-ui PAYMENT-METHODS-HISTORY-001`.

## 3. Register one Barion card

16. In **Ava**, change the same demo configuration to `Barion`, turn 3DS Off,
    and save. Confirm the Save response reports success.
17. In **Alex**, close and reopen `Cards`. Confirm every still-active
    Stripe-tokenized card now keeps its original artwork under the same strong
    white overlay as an expired card, cannot be selected, and replaces the
    three-dot trigger with the vivid blue `Reconnect >` badge. Open one badge and
    confirm the menu offers exactly `Retokenize card` and `Delete card`; close
    the menu without changing that card. No background configuration poll is
    required: reopening the surface uses the current configuration.
18. Select `Add card`. The backend must use the currently configured provider.
19. Confirm the embedded registration surface shows the Barion logo. Select
    its header-level `Generate test card` action exactly once and confirm all
    fields are filled together with the accepted Barion number, meaningful
    `Barion Test User 001` cardholder, future month/year and a three-digit CVC.
    Select `Tokenize and save card` exactly once.
20. Confirm the provider success result is visible briefly without a 3DS wait,
    then exactly one new active Barion card appears and the earlier cards
    remain unchanged.
21. Report and wait:

    `PAYMENT-METHODS-HISTORY-001 barion registered: one tokenized provider card`

Codex runs `verify-barion payment-ui PAYMENT-METHODS-HISTORY-001`.

## 4. Replace a card without changing provider

22. Keep the simulator on connected `Barion` with 3DS Off. In Alex's Cards
    surface, use the three-dot menu on the Barion card created in step 20.
    Confirm this current-provider card is normal and its menu offers exactly
    `Replace card` and `Delete card`; it must not show `Reconnect`.
23. Select `Replace card`. Confirm the embedded provider surface is Barion and
    no MyScoutee card-data form appears. Generate the Barion test card once,
    then select `Tokenize and save card` once.
24. Confirm the old Barion card is replaced rather than duplicated: the active
    card count is unchanged, the replacement remains Barion, retains the old
    card's artwork, and the other cards and Payment History remain unchanged.
25. Report and wait:

    `PAYMENT-METHODS-HISTORY-001 replace verified: Barion card replaced once`

Codex runs `verify-replace payment-ui PAYMENT-METHODS-HISTORY-001`.

## 5. Reconnect a card after changing provider

26. Still on connected `Barion`, find the Stripe card created in steps 11–14
    (the `Stripe Test User 001` card), not either baseline Stripe card. Confirm
    it has the provider-mismatch overlay and `Reconnect >` instead of a
    three-dot trigger.
27. Open `Reconnect >`, and select `Retokenize card`. Confirm
    the embedded provider surface is Barion. Generate the Barion test card
    once, then select `Tokenize and save card` once.
28. Confirm the original Stripe card is replaced rather than duplicated: its
    Barion replacement retains the original artwork, the active card count is
    unchanged, and the two baseline Stripe cards still show `Reconnect >`.
29. Report and wait:

    `PAYMENT-METHODS-HISTORY-001 reconnect verified: Stripe card retokenized with Barion`

Codex runs `verify-reconnect payment-ui PAYMENT-METHODS-HISTORY-001`.

## 6. Verify and clean up the expired card

30. In Alex's Cards surface, find the expired `0008` card. Confirm its coral
    artwork remains identifiable beneath the stronger white expired overlay
    and it has no three-dot action.
31. Confirm the vivid `Expired/Lejárt >` badge is the only action trigger.
    The overlay must not whiten or disable this badge. Select it once. The
    opened menu must contain only `Delete card`; it must not offer Replace or
    selection.
32. Select `Delete card`, confirm once, and verify the expired card disappears
    without changing active cards or Payment History.
33. Open Alex's notifications and confirm the controlled translated expired
    card notification names card ending `0008`. Reading it may mark that one
    notification read; do not delete or mutate another notification.
34. Report and wait:

    `PAYMENT-METHODS-HISTORY-001 expired cleaned: badge menu removed 0008 once`

Codex runs `verify-expired-cleanup payment-ui PAYMENT-METHODS-HISTORY-001`.

## 7. Terminal reload and read-only proof

35. Reload Alex exactly once. Reopen Payment history and Cards.
36. Confirm the four original history rows, both exact totals, all three
    filters, failure reason and day groups reconstruct unchanged.
37. Confirm the two successful replacement results remain as active Barion
    cards, the transient Stripe and Barion source cards do not return, both
    baseline active Stripe cards remain with `Reconnect >`, and expired `0008`
    does not return.
38. Confirm no payment, membership, Asset request, basket or checkout was
    created merely by filtering history or managing cards.
39. Report the terminal phrase:

    `PAYMENT-METHODS-HISTORY-001 UI complete: history, registrations and expired cleanup persist`

Codex runs `verify payment-ui PAYMENT-METHODS-HISTORY-001`, records the pair-QA
result, then runs the exact reset. Reset restores Alex's original cards,
registrations, payments, notification state and payment totals, and restores
the simulator to `Cash Only`.
