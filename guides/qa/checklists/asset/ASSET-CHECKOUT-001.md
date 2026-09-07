# ASSET-CHECKOUT-001 user test guide

This Asset-owned journey carries the Barion switch plus 3DS approve, decline
and timeout branches. The provider lifecycle is not a separate External
Payment row.

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
- **Ava** selects connected Barion and the requested 3DS branch in the demo
  Payment simulator.
- Codex stages the exact Event/Sub-event resource scope, Assets, actors and
  checkout controls, then runs the independent machine oracles. Immediately
  before every launch or relaunch, Codex runs the fixture-owned
  `prepare-browser` session cleanup and the versioned launcher. After that
  handoff, the user exclusively controls the configured Casey/Nova/Ava browser
  sessions. Do not create replacement data or browser profiles.
- This Core Asset checkpoint uses connected **Barion**. Its provider-owned 3DS
  presentation is driven by the already-running payment simulator; no real
  provider credential or card data is used.
- Stop at the first mismatch. Do not compensate with another Pay, Confirm,
  Approve, reload or an API/Mongo action.

To start a complete replay, tell Codex:

`Prepare the ASSET-CHECKOUT-001 user test.`

Begin only after Codex confirms this exact baseline:

- Nova is an accepted Event participant with access to
  `QA ASSET-CHECKOUT-001 Event → QA Borrow Stage`;
- Resource/Asset Explore shows one Public paid Transport named
  `QA ASSET-CHECKOUT-001 Paid Transport`, owned by Casey, with quantity
  `3`, deterministic unit price and one required policy;
- Nova has no target borrow request, payment/session, basket draft,
  reservation, resource assignment, Asset activity contribution or Asset
  role;
- the Free, unavailable, adjacent paid, Decline and Timeout controls are
  staged, and the sibling Sub-event plus Riley are unchanged negative
  controls;
- the configured Casey, Nova and Ava identities are available; the user opens
  and identity-checks any browser windows used for the manual steps.

Codex checkpoint commands for this testcase use the existing MongoDB and
payment-simulator containers; they do not start or restart the development
stack:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  stage asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  status asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  prepare-browser asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  capture-payment-ready asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  capture-revised-payment-ready asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-paid-pending asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-request-destination asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-accepted asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-cancelled asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  rollback-payment-ready asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  rollback-revised-payment-ready asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  rollback-paid-pending asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  rollback-accepted asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  rollback-cancelled-control asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  reset asset-checkout ASSET-CHECKOUT-001
```

The rollback commands restore the exact server-persisted state. The pre-Pay
Borrow Basket is synchronized through the live Angular signal, the scoped
browser-local `AssetBorrowDraftStore` and the shared checkout repository
(`IndexedDB` locally, MongoDB through HTTP). The local draft is keyed by user,
Sub-event and Asset and is expected to survive a clean reload. Every newly
saved Event or Asset checkout basket has the same **10-minute** expiry window;
20 minutes is not an accepted value. After the server basket is absent, or its
10-minute expiry has been processed, the next successful Explore load removes
the matching browser-local draft instead of exposing a local-only
`Continue borrow` action.
`rollback-payment-ready` cannot manufacture that browser-local entry if it was
already cleared: after such a rollback the user repeats steps 1-18 once while
Codex keeps the already captured server boundary at `payment-ready`.
Immediately before step 31, `capture-revised-payment-ready` proves the exact
`1 → 2 → 1` basket-generation history and saves the resulting server state.
If any later payment or request step fails, Codex runs
`rollback-revised-payment-ready` to return to that boundary without replaying
steps 1-30. Because this is a live ten-minute basket, that rollback preserves
the exact business payload and audit identity while re-arming the one restored
active basket to a fresh exact ten-minute TTL. The later isolated Cancel branch
has its own `cancelled-control` capture and rollback.

## Complete test journey

### 1. Verify the fresh paid Asset and input gates

1. In **Nova**, open:

   `Activities → Events → Active Events → QA ASSET-CHECKOUT-001 Event → View Event → QA Borrow Stage → Transport → Explore`

2. Find `QA ASSET-CHECKOUT-001 Paid Transport` exactly once with
   availability `3`.
3. Open its menu. Confirm `Borrow` is present and `Payment summary` is absent.
4. Select `Borrow` once.
5. Confirm the borrow review shows the exact Asset, Event/Sub-event context,
   timeframe, quantity, price and required `QA Borrow policy`. The lazy-loaded
   Asset detail response is the authoritative source of the parent Event/Sub-event
   start and end bounds; the form remains gated until those bounds arrive.
6. Attempt to set End before or equal to Start, then attempt to move either
   endpoint outside the parent Event/Sub-event window. Confirm the date control
   immediately normalizes each input back into the valid parent range, so an
   invalid or out-of-parent value cannot remain in the form and no request is
   sent.
7. Restore the fixture-provided valid timeframe.
8. Attempt to enter a quantity above the displayed availability. Confirm it is
   rejected or clamped to the maximum and cannot be submitted as an
   over-capacity request.
9. Set quantity to `1`.
10. Confirm `QA Borrow policy` is mandatory/read-only and does not expose an
    optional acceptance checkbox.
11. Confirm the mandatory policy is included by definition and does not block
    the forward action as an unaccepted optional policy.
12. Record the exact timeframe, quantity `1`, total and currency.
13. Confirm the primary action is `Confirm borrow`, the secondary `Cancel`
    action is red, and `Pay` and `Payment summary` are still absent.
14. Select `Confirm borrow` exactly once.
15. Confirm the checkout changes to a locked payment phase with all of the
    following:

    - the contextual Barion provider badge and `Ready to redirect` status;
    - the same timeframe, quantity, required policy, total and currency;
    - active-card selection, neutral `Back`, red `Cancel` and `Pay` actions;
    - no pending/accepted borrower success yet.

16. Confirm that the timeframe, quantity, policy and price controls are locked
    in the payment phase.
17. Select one active Barion card. Confirm an expired card cannot be selected.
18. Report this phrase and wait for Codex to prove that this pre-Pay state owns
    exactly one matching confirmed Borrow Basket in the Angular signal,
    browser-local repository and backend repository, with an expiry exactly 10
    minutes after basket creation. There is still no server payment/provider
    session, borrow request, inventory delta or assignment.

    `ASSET-CHECKOUT-001 payment ready: Barion card assigned, no borrow request yet`

### 2. Resume the same payment state and invalidate it through Back

19. After Codex confirms `payment-ready`, close the checkout with its normal
    close control. Do not select Back, Cancel or Pay.
20. In the still-open Asset Explore surface, confirm both the target card menu
    and the Borrow Basket show the same orange `Continue borrow` state exactly
    once.
21. Open `Continue borrow`. Confirm the same payment phase returns with the
    same draft-owned timeframe, quantity, policy and total.
22. Close it again and reload Nova exactly once.
23. Return to the same Resource/Asset Explore scope. Confirm the target card
    menu and Borrow Basket still contain exactly one orange `Continue borrow`
    action and it reconstructs the same payment-ready state.

If the draft disappears, restarts at an empty review, changes amount, or
creates any server payment/session merely because of reload, stop here. Report
the exact mismatch; do not build a new attempt over the inconsistent state.

24. Select `Back` once.
25. Confirm the editable review returns, `Pay` disappears and the unchanged
    primary action is green `Continue borrow`.
26. Select `Continue borrow` once. Confirm the same payment phase returns
    without creating a new backend basket generation, then select `Back` once.
27. Change quantity from `1` to `2`. Confirm the total changes and the primary
    action becomes orange `Update borrow`. Select `Update borrow` once and
    confirm the payment phase owns quantity `2`; then select `Back` once.
28. Change quantity back to `1`. Confirm `Update borrow` remains orange, select
    it once, and confirm Barion returns with final quantity `1` and the original
    exact total. The earlier quantity-`2` values must not remain in the payment
    phase.
29. Report:

    `ASSET-CHECKOUT-001 revised payment ready: final draft owns quantity 1`

30. Wait for Codex to prove the canonical three pre-Pay basket audit
    generations (initial Confirm plus two Updates), one active final confirmed
    basket and no payment/session, borrow request, inventory delta or
    assignment. If the user explicitly tried additional back-and-forth Update
    values, the fixture may retain those generations only when every adjacent
    saved selection is materially different and the final state is still the
    required quantity `1`; the unchanged Continue action must not create a
    generation.

### 3. Pay once and prove the Asset UI does not freeze

31. In Ava, enable 3DS for Barion and save. In Nova, select `Pay` **exactly
    once**.
32. While the request is active, confirm the action changes to `Paying...` and
    cannot be selected again. The loading indication and surrounding page
    continue to render and respond.
33. Wait for the normal request to finish. The following are immediate FAIL
    conditions:

    - `Paying...` remains indefinitely with no terminal response;
    - the browser, editor or page stops responding;
    - another payment/editor surface appears;
    - the UI claims success while showing an error or unchanged server state.

34. Confirm MyScoutee keeps its waiting popup open while the provider-owned
    confirmation remains pending. The popup shows a three-minute countdown,
    can always be closed with X, and polls status without reloading the whole
    MyScoutee popup.
35. In Ava's always-visible `3DS` simulator menu, open the pending list and
    approve Nova's exact transaction once. Confirm the provider view changes
    from waiting to an animated success check, remains visible briefly, and
    closes/returns automatically.
36. Confirm the checkout closes once and the stale overlay does not block the
    Resource/Asset Explore surface.
37. Do not start another Borrow. Report:

    `ASSET-CHECKOUT-001 paid pending: checkout closed once and UI stayed responsive`

38. Wait for Codex to prove one approved Barion payment, one exact pending
    borrow request/payment-session reference, one quantity reservation and no
    duplicate write.

### 4. Verify where the paid Asset request goes

39. After Codex confirms `paid-pending`, inspect the same target card without
    reloading.
40. Confirm its availability changed exactly `3 → 2` and no duplicate card
    appeared.
41. Open its menu. Confirm `Payment summary` is present and another same-scope
    `Pay` action is absent.
42. Open `Payment summary` once. Confirm it is read-only and contains the exact
    Event/Sub-event, timeframe, quantity `1`, required policy, amount/currency
    and recorded Barion/payment-method result.
43. Close and reopen `Payment summary`. The values remain identical and the
    read creates no second request/payment/reservation.
44. Open the exact Event/Sub-event resource view and confirm the paid Transport
    has one pending borrower/resource contribution, not an accepted or global
    assignment under another scope.
45. In **Casey**, open
    `My Assets → Transport → QA ASSET-CHECKOUT-001 Paid Transport → Members`.
46. Confirm Nova appears exactly once as a pending borrow request with the
    exact Event/Sub-event timeframe, quantity and payment context.
47. Confirm no Riley row and no request for the sibling Sub-event exists.
48. Report:

    `ASSET-CHECKOUT-001 request destination ready: Nova pending once, availability 2`

### 5. Accept the paid request once and verify the terminal scope

49. After Codex confirms the pending destination, open Nova's request menu in
    Casey's Asset Members surface.
50. Select `Approve`, then confirm `Approve` exactly once.
51. Without reloading, confirm Nova changes from pending to accepted exactly
    once and the pending indicator disappears.
52. Confirm the Asset availability remains `2`; approval must not reserve the
    already paid quantity a second time.
53. In Nova, reopen the exact Event/Sub-event resource view. Confirm the paid
    Transport is accepted/available in that scope and `Payment summary`
    remains read-only with the original payment values.
54. Confirm Nova did not gain Event Admin, Tournament-group membership, global
    Asset Manager or ownership of Casey's Asset.
55. Report:

    `ASSET-CHECKOUT-001 accepted: exact scoped resource, availability stays 2`

56. Wait for Codex to capture the `accepted` oracle and exact unchanged sibling
    controls.

### 6. Verify reload reconstruction and the action variants

57. Reload Casey and Nova exactly once each.
58. Reopen Casey's Asset Members and Nova's scoped resource/Payment summary.
    Confirm the same request identity, accepted state, payment values and
    availability `2` return.
59. Inspect the staged **Free** Asset. Confirm `Borrow` opens a review whose
    forward action is `Send borrow request` and no provider badge, `Pay`, session
    or payment summary is presented. Close without submitting.
    The same paid flow must use `Confirm cash payment` instead of `Pay` when no
    provider is configured; this Barion checkpoint does not change Ava's
    provider configuration to exercise that separate runtime variant.
60. Inspect the unavailable control. Confirm it has no enabled `Borrow` action
    for the selected window, or is absent from the availability-filtered
    Explore list. Do not change filters or dates to make it eligible.
61. Use `QA ASSET-CHECKOUT-001 Adjacent Paid Transport` for an isolated
    quantity-`1` Cancel branch. Accept the required policy and select
    `Confirm borrow` once. In the payment phase confirm that neutral `Back`,
    red `Cancel` and `Pay` are all present.
62. Select red `Cancel` once. Confirm a blocking danger confirmation appears;
    select its `Back` action and verify the same payment-ready state remains.
    Select red `Cancel` again and confirm `Cancel borrow` exactly once.
63. Confirm the checkout closes, the card menu returns to `Borrow`, and no
    matching Borrow Basket entry remains locally. Do not Pay. Report:

    `ASSET-CHECKOUT-001 cancelled control: basket removed before payment`

64. Wait for Codex to prove one `cancelled/deleted` ten-minute basket audit
    record and zero active basket, payment/session, borrow request, inventory
    delta or resource assignment for the adjacent control. Codex captures this
    savepoint; a later control failure rolls back with
    `rollback-cancelled-control` instead of repeating the Cancel branch.
65. Use `QA ASSET-CHECKOUT-001 Decline Control` for one new quantity-`1`
    checkout and decline its 3DS request. Then use
    `QA ASSET-CHECKOUT-001 Timeout Control` for one new quantity-`1` checkout
    and leave its 3DS request pending for the three-minute timeout. Do not
    reuse or change the accepted paid target. In each control the waiting text
    must change to the provider-owned animated X or timeout icon, remain
    visible briefly, then close automatically; no borrow request, inventory
    delta, resource assignment or entitlement may be created. The waiting
    popup remains closable with X.
66. Confirm Ava's 3DS list shows all concurrently pending member transactions
    separately, or translated `nothing pending` when empty; selecting one row
    opens only that user's confirmation surface.
67. Confirm the cancelled adjacent Asset retains quantity `2` and has no
    request, payment or assignment; the sibling Sub-event and every Riley
    control remain unchanged and own no target session/payment identity.
68. Report the terminal phrase:

    `ASSET-CHECKOUT-001 UI complete: Barion approve, decline and timeout remain isolated`

Wait for Codex's final persisted/idempotence oracle. Do not reset or continue
to another testcase until Codex records the result and restores the fixture.
