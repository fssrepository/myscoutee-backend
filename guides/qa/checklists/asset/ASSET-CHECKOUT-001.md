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
- **Riley** remains an unchanged negative control during the core checkout,
  then performs the paid manager-take-over and refund lifecycle extension by
  reusing Nova's browser after an explicit logout/login identity change.
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
- the configured Casey, Nova and Ava sessions are available. Riley later reuses
  Nova's browser through an explicit logout/login; the user opens
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
  prepare-takeover asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-manager-left asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-takeover asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  stage-takeover-complete asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-refund-requested asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-refunded asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  prepare-last-leave asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-last-leave asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  prepare-last-remove asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-last-remove asset-checkout ASSET-CHECKOUT-001
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
  rollback-manager-left asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  rollback-takeover-complete asset-checkout ASSET-CHECKOUT-001
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
Once `Pay` starts, the server changes the basket to `pay/pending` before
opening provider authorization. That in-flight state is not purgeable, even
when the provider-owned three-minute window crosses the basket's original
10-minute expiry.
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
After a rollback, reopening an unchanged locally confirmed draft through the
orange `Continue borrow` action must reconstruct the payment phase directly;
it must not reopen the editable Borrow review merely because the dialog was
previously left there with `Back`.

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
    continue to render and respond. The returned payment-session identity is
    saved immediately into the same browser-local Borrow draft; it is not
    deferred until the provider outcome.
33. Wait for the normal request to finish. The following are immediate FAIL
    conditions:

    - `Paying...` remains indefinitely with no terminal response;
    - the browser, editor or page stops responding;
    - another payment/editor surface appears;
    - the UI claims success while showing an error or unchanged server state.

34. Confirm MyScoutee keeps its waiting popup open while the provider-owned
    confirmation remains pending. The popup shows a three-minute countdown,
    can always be closed with X, and polls status without reloading the whole
    MyScoutee popup. If the basket's original 10-minute deadline passes during
    this window, the active payment and reserved basket remain intact.
35. In Ava's always-visible `3DS` simulator menu, open the pending list and
    approve Nova's exact transaction once. Confirm the provider view changes
    from waiting to an animated success check, remains visible briefly, and
    closes/returns automatically. The nested bank-auth surface must render in
    the existing confirmation dialog both before and after approval;
    `localhost refused to connect`, `This content is blocked` or any other
    frame-denial page is an immediate FAIL.
36. Confirm the checkout closes once and the stale overlay does not block the
    Resource/Asset Explore surface. Without reloading, confirm the target
    Transport resource card remains at accepted occupancy `0/3` and shows a
    separate red pending counter `1`. Pending demand must not be folded into
    accepted occupancy. Confirm the same pending resource contributes its red
    counter to `QA Borrow Stage` and the main Event aggregate.
37. Do not start another Borrow. Report:

    `ASSET-CHECKOUT-001 paid pending: checkout closed once and UI stayed responsive`

38. Wait for Codex to prove one approved Barion payment, one exact pending
    borrow request/payment-session reference, one quantity reservation and no
    duplicate write.

### 4. Verify where the paid Asset request goes

39. After Codex confirms `paid-pending`, inspect the same target card without
    reloading.
40. Confirm its availability for the exact selected Event/Sub-event date range
    changed `3 → 2` and no duplicate card appeared. This is a dated reservation:
    the Asset's stored physical quantity remains `3`, and a non-overlapping date
    range remains available at `3`.
41. Open its menu. Confirm `Payment summary` is present and another same-scope
    `Pay` action is absent.
42. Open `Payment summary` once. Confirm it is read-only and contains the exact
    Event/Sub-event, timeframe, quantity `1`, required policy, amount/currency
    and recorded Barion/payment-method result.
43. Close and reopen `Payment summary`. The values remain identical and the
    read creates no second request/payment/reservation.
44. Open the exact Event/Sub-event resource view and confirm the paid Transport
    has one pending borrower/resource contribution, not an accepted or global
    assignment under another scope. Open its scoped Members view as Casey.
    Casey is an Event admin but is neither an accepted member nor the Manager
    of this scoped Asset, so Nova's card exposes no `Approve`, `Reject` or other
    Asset-membership management action here. Casey may inspect Nova's
    participation and open Nova's profile with the eye action. The owner
    approval remains exclusively on Casey's own Asset screen in steps 45-50.
45. In **Casey**, confirm exactly one `asset-admin-join-request` notification
    identifies Nova and the paid Asset. Open `My Assets → Transport`. Before
    opening the Asset, confirm the rose/red-counter `Pending` toggle appears
    immediately before `+` and its Transport count is `1`.
46. Select `Pending` once. Confirm only Assets with pending non-manual requests
    remain, then open
    `QA ASSET-CHECKOUT-001 Paid Transport → Members`. Confirm Nova appears
    exactly once with the exact Event/Sub-event timeframe, quantity and payment
    context. Casey is the lender/Asset owner, not a participant in this borrowed
    resource scope, so Casey must not appear in this list. For a directly
    assigned own Asset, its owner remains the accepted resource manager/member.
47. Confirm no Riley row and no request for the sibling Sub-event exists. The
    owner notification and pending count must not be duplicated by reopening
    either surface.
48. Report:

    `ASSET-CHECKOUT-001 request destination ready: Nova pending once, availability 2`

### 5. Accept the paid request once and verify the terminal scope

49. After Codex confirms the pending destination, open Nova's request menu in
    Casey's Asset Members surface.
50. Select `Approve`, then confirm `Approve` exactly once.
51. Without reloading, confirm Nova changes from pending to accepted exactly
    once and is immediately the scoped resource `Manager`. The accepted Borrow
    row and Nova's scoped Members card expose neither `Promote to manager` nor
    `Revoke Manager`. Nova's accepted Members card has a three-dot menu whose
    self-service membership action is `Leave`; it is not a promotion menu. The
    borrowed resource card has the separate convenience action `Remove`, which
    removes this runtime Event/Sub-event association and never deletes Casey's
    global Asset. On the scoped Asset card, the dark accepted-occupancy badge
    changes `0/3 → 1/3`; the separate red pending indicator disappears. Casey's
    Transport `Pending` counter changes immediately from `1` to `0` through the
    same live update. Nova's acceptance notification uses the compact
    `Borrow accepted` title and the Asset title as its body; it must not repeat
    the full request sentence that gets clipped on the notification card.
52. Confirm availability for the exact selected date range remains `2`;
    approval must not reserve the already paid quantity a second time. Confirm
    the stored physical Asset quantity remains `3`, while a non-overlapping date
    range remains available at `3`.
53. In Nova, reopen the exact Event/Sub-event resource view. Confirm the paid
    Transport is accepted/available in that scope and `Payment summary`
    remains read-only with the original payment values.
54. Confirm Nova's Manager role is limited to this exact assigned Asset scope;
    Nova did not gain Event Admin, Tournament-group membership, global Asset
    Manager or ownership of Casey's Asset.
55. Report:

    `ASSET-CHECKOUT-001 accepted: exact scoped resource, availability stays 2`

56. Wait for Codex to capture the `accepted` oracle and exact unchanged sibling
    controls.

### 6. Verify reload reconstruction and the action variants

57. Reload Casey and Nova exactly once each. Confirm Casey's Transport
    `Pending` counter remains `0`, reconstructed from the backend user counter
    and its frontend-local mirror rather than recalculated by the Asset-list
    query.
58. Reopen Casey's Asset Members and Nova's scoped resource/Payment summary.
    Confirm the same request identity, accepted state, payment values and
    selected-range availability `2`, stored physical quantity `3` and
    non-overlapping availability `3` return.
59. In Nova's still-open `QA Borrow Stage → Transport → Explore` list, open
    `QA ASSET-CHECKOUT-001 Free Transport`, then select `Borrow`. Confirm the
    review shows `Send borrow request` and does not show a provider badge,
    `Pay` or `Payment summary`. Close the review without submitting it.
60. Stay in the same Nova `QA Borrow Stage → Transport → Explore` list and look
    for `QA ASSET-CHECKOUT-001 Unavailable Transport`. Use the Event's existing
    selected date range. The availability filter must hide this fully reserved
    Asset; it must not appear as a disabled card. Do not change the dates or
    filters.
61. Open `QA ASSET-CHECKOUT-001 Adjacent Paid Transport`, request quantity `1`,
    review the required policy and select `Confirm borrow` once. On the payment
    screen confirm `Back`, red `Cancel` and `Pay` are present.
62. Select red `Cancel` once. In the opened `Cancel borrow?` confirmation
    dialog, select `Back`; this must close only the confirmation dialog and
    leave the payment screen open with its basket intact. Select red `Cancel`
    again, then select `Cancel borrow` exactly once in that confirmation dialog.
63. Confirm the checkout closes, the Asset action returns to `Borrow`, and its
    Borrow Basket entry is gone. Do not select `Pay`. Report:

    `ASSET-CHECKOUT-001 cancelled control: basket removed before payment`

64. Wait for Codex to verify and save the cancelled state. Do not continue
    until Codex confirms that the adjacent control has one cancelled audit row
    and no active basket, payment, request or resource assignment.
65. Exercise these two controls without changing the already accepted Asset:

    - Start a quantity-`1` checkout for `QA ASSET-CHECKOUT-001 Decline Control`.
      In Ava's 3DS list, decline that request.
    - Start a quantity-`1` checkout for `QA ASSET-CHECKOUT-001 Timeout Control`.
      Leave its 3DS request pending until the three-minute timeout expires.

    In both cases, confirm the waiting text changes to the provider result icon,
    remains visible briefly and then closes automatically. While waiting, the
    popup must remain closable with X. Neither result may create a borrow
    request, inventory change, resource assignment or entitlement.
66. In Ava's 3DS list, confirm each pending transaction has its own row and
    opening a row shows only that transaction. When none remain, the translated
    empty-state text is shown.
67. Confirm the cancelled Adjacent Paid Asset still has quantity `2` and no
    request, payment or assignment. The sibling Sub-event and Riley controls
    remain unchanged.
68. Report the terminal phrase:

    `ASSET-CHECKOUT-001 UI complete: Barion approve, decline and timeout remain isolated`

Wait for Codex to verify the final state. Do not reset or start the next section
until Codex confirms that the lifecycle extension is ready.

### 7. Leave the paid manager role and require a paid Take Over

69. Wait for Codex to verify the core terminal state, roll back to the accepted
    savepoint and prepare the isolated `takeover-ready` extension. Begin only
    after Codex confirms Nova and Riley are the two accepted scoped borrowers,
    Nova is the runtime Manager, Casey remains only the global Asset owner, and
    Riley has no payment yet. This preparation is fixture setup, not a manual
    application action.
70. In Nova, reopen the paid borrowed Transport and its Members list. Confirm
    the dark badge is `2/3`, there is no red pending counter, Casey is absent,
    and Nova and Riley appear exactly once. Nova's own member menu contains
    `Leave`. Because Nova is the runtime Manager, Riley's member menu contains
    `Remove member`; do not select it in this branch. Neither card contains
    Promote/Revoke Manager.
71. Close Members, open the borrowed resource-card menu and confirm it contains
    the separate convenience action `Remove`, plus `Ask Asset Owner`; it must
    not say `Ask Organizer`. Do not select `Remove` yet.
72. Return to Members and select `Leave` from Nova's own member card exactly
    once. Confirm the danger dialog once. The runtime association remains, its
    dark badge changes to `1/3`, and no red pending count appears. Riley is the
    remaining accepted borrower and receives one compact notification whose
    bold title contains `Take Over`. Nova's existing payment is still Captured
    and is not yet refunded merely because Nova left.
73. Report:

    `ASSET-CHECKOUT-001 manager left: Riley must pay before Take Over`

74. After Codex verifies `manager-left`, sign Nova out of that browser and sign
    in as **Riley** in the same browser. Confirm the visible identity is Riley
    before opening any Asset surface; do not create a fourth Google/browser
    session.
75. Open the exact Event/Sub-event, the paid borrowed Transport and its Members
    list. Riley's own member menu now contains `Take Over`. Select it once.
    Confirm this opens the locked replacement-payment review for exactly
    `HUF 3,200`, not a plain confirmation dialog and not a fresh Borrow request.
    In the Lending Policies panel, confirm the required `QA Borrow policy`
    is shown without a checkbox. Only optional policies are selectable.
    Confirm `Continue to payment` is enabled; continuing records the displayed
    required policy ID automatically in the payment audit.
76. Select `Continue to payment` once, select Riley's active Barion `5555` card
    and select `Pay` exactly once. In Ava approve Riley's exact 3DS transaction
    once. The provider result remains inside the existing simulator-owned frame
    and returns automatically.
77. Without reload, confirm Riley becomes the scoped Manager and the badge
    remains `1/3`; Riley's member menu changes on the same signal from `Take Over`
    to `Leave`, and `Take Over` disappears without reopening or reloading.
    Nova does not reappear as an accepted scoped member. Riley's
    Payment history contains one Captured `HUF -3,200` Asset expense linked
    to the exact Event/Sub-event. Casey's gross badges show `HUF -3,200` refunded
    and `HUF +6,400` received, whose net Asset income remains `HUF +3,200`
    because Riley replaced Nova rather than paying in addition to Nova. Sign
    Riley out of the reused browser and sign Nova in there. Confirm Nova has
    exactly one takeover refund-result notification. Nova's Payment history is
    date-descending: the newer, contextually distinct `HUF +3,200` `Refunded`
    write appears above the original `HUF -3,200` Asset expense. Its gross badges
    are `HUF -3,200 / HUF +3,200`, and the original row has no Refund action.
    The notification is from MyScoutee, says the refund happened
    because someone took over the Asset, and does not identify Riley; no generic
    manager-change notification targets Nova. Sign Nova out, sign Riley back in and confirm
    the visible identity is Riley before continuing.
78. Report:

    `ASSET-CHECKOUT-001 paid Take Over complete: Riley manager, Nova refunded`

79. Wait for Codex to prove the linked predecessor/successor payments: Riley's
    payment is Captured/Joined, Nova's predecessor payment remains Captured
    with a separate full-refund transaction, and the write-side finance totals changed payer exactly
    once. Nova receives only the refund-result notification for completion;
    Nova must not receive a generic manager-change notification. Codex then
    captures the guarded `takeover-complete` savepoint. If the server restarts,
    `rollback-takeover-complete` restores this exact pre-step-80 boundary.

### 8. Remove the runtime association, contact the Asset Owner and refund

80. Still in Riley, reopen Members first. Riley is already the last accepted
    member, so Riley's own member menu must contain `Leave`; do not select it in
    this branch. Close Members, open the borrowed resource-card menu and confirm
    `Remove` is present because Riley is the current primary manager after the
    Take Over. A different accepted manager must not receive this action. Select
    `Remove` once and confirm the danger dialog. The backend must accept it only
    for Riley. The runtime Event/Sub-event association and its card disappear.
    Casey's global Asset is not deleted, and both payment histories remain
    available.
81. Open Riley's Payment history and the exact Captured Asset expense row.
    Confirm its menu contains `Ask Asset Owner` and `Request refund`, and does
    not contain `Ask Organizer`. The localized action text must be visible; the
    raw key `payment.history.ask.asset.owner` must never be rendered.
82. Select `Ask Asset Owner`. Confirm Casey is the recipient even though Casey
    was never a scoped borrower. Before sending, confirm the chat header already
    shows Riley's and Casey's two profile-photo avatars (not an initials tile
    for fixture owner Casey), while no empty chat was created. Select the avatar
    stack once and confirm the view-only Chat-channel Members list contains
    exactly Riley and Casey rather than an empty list; close Members. Send this
    exact first message once:

    `QA ASSET-CHECKOUT-001: Riley asks Casey about the paid borrowed Transport.`

83. Confirm the first message creates the Asset service chat and it is now
    visible in the Chat channel. Casey's Chat unread red counter increases once
    and the conversation contains the exact Riley message once. Reopening `Ask
    Asset Owner` opens that same persisted channel and message; it must not
    create another empty or duplicate channel.
84. Return to Riley's same Payment history row and select `Request refund`.
    Before deciding, confirm the dialog shows `HUF +1,600` refundable,
    `HUF −1,600` retained, and the configured 50% / one-day policy basis.
    Confirm exactly once. A separate newer `HUF +1,600` history row appears
    with `Refund requested`; the original Captured payment remains historically
    unchanged and loses the request action. Report:

    `ASSET-CHECKOUT-001 refund requested: runtime removed, owner chat sent once`

85. Wait for Codex to prove the global Asset and both payment records remain,
    the runtime resource is absent, the service chat/message is exact-once,
    Casey's persisted write-side `paymentRefundsPending` changed by `+1`, and
    exactly one refund-request notification targets Casey. The oracle must also
    prove exactly one separate pending refund audit row exists for the original
    Riley payment, with no financial delta yet.
86. In Casey, before opening Payment history, confirm its side-menu Payment red
    counter is `1`. Open Payment history and confirm the filter/dropdown also
    carries `1`; the separate `HUF -1,600` `Refund requested` expense row is
    above the unchanged original `HUF +3,200` income row and exposes `Approve
    refund`. `Payment summary` remains a neutral menu action while `Approve
    refund` has its contextual approval color. Select it and confirm the
    approval dialog shows the same `HUF +1,600` refund, retained amount and
    policy basis as Riley saw.
87. Confirm `Approve refund` exactly once. The pending counter
    changes immediately to `0` through the signal and stays `0` after the next
    user-model poll. Riley's gross badges are `HUF -3,200 / HUF +1,600`;
    Casey's rows retain the corresponding gross receipt and refund while the
    net result is `HUF 1,600` on each side.
88. In both Casey and Riley, confirm the newer `HUF 1,600` refund write appears
    above the original payment with a contextually distinct `Refunded` badge.
    This is the same row that previously showed `Refund requested`, not another
    appended row. The original payment stays Captured and has no further Refund
    action. Open `Payment summary` from the original row on each side and confirm
    the same partial refund result appears there. Reopening is read-only and
    cannot refund twice.
89. Report:

    `ASSET-CHECKOUT-001 refund approved: counters zero, histories refunded`

### 9. Last accepted manager Leave removes only the borrowed runtime

90. Wait for Codex to verify the refund branch. Codex then rolls back to the
    earlier accepted savepoint: this deliberately undoes Nova's Leave and the
    complete Riley Take Over/Remove/refund branch from sections 7-8. After
    `last-leave-ready`, confirm Nova is again the only accepted scoped Manager
    and the paid runtime card is present at `1/3`.
91. In Nova's own Members card, select `Leave` exactly once; do not use the
    resource-card `Remove` action in this branch. Confirm the danger dialog.
92. Confirm the last borrower leaving removes the runtime Event/Sub-event Asset
    association. It does not delete Casey's global Asset and does not erase
    Nova's payment history. With no remaining accepted borrower, no Take Over
    notification is created and no automatic refund occurs; the retained
    Payment-history row continues to provide `Ask Asset Owner` and
    `Request refund`.
93. Report:

    `ASSET-CHECKOUT-001 last manager left: runtime removed, Asset and history retained`

Wait for Codex's `last-leave-verified` persisted oracle.

### 10. Ad-hoc mixed-status resource Remove

94. Wait for Codex to roll back to the accepted savepoint and run the dedicated
    `prepare-last-remove` restage. Reload the open Event once. Confirm the paid
    Transport card is present with Nova as the accepted Manager, Riley as a
    pending scoped member and `1 / 1 - 3` metrics. Casey's Asset pending counter
    is `1`. Nova has the unchanged target `HUF -3,200` Captured
    payment-history row and Casey has its matching `HUF +3,200` Captured row;
    Riley has no target payment row before taking responsibility.
95. In Nova, close Members and select `Remove` from the paid Transport resource
    card exactly once. Confirm the danger dialog. Do not use either member's
    `Leave` action in this branch.
96. Confirm `Remove` exactly once. The paid Transport card disappears on the
    fly. The open Event/Sub-event views, tool menus and pending counters update
    in the same signal transaction: the removed assignment contributes no
    accepted, pending, minimum or maximum Transport metric, and Casey's Asset
    pending counter returns to `0`.
97. Confirm both the accepted Nova request and pending Riley request disappear
    from the scoped Members list. Casey's global Asset remains with quantity
    `3`. Nova's and Casey's payment-history rows, all three actors' gross totals
    and refund-pending counters remain exactly as they were before Remove;
    Riley still has no target payment row, and no refund row or automatic refund
    is created.
98. Report:

    `ASSET-CHECKOUT-001 mixed-status remove: scope retired, all payment histories unchanged`

Wait for Codex's `last-remove-verified` persisted oracle.

These shared paid take-over/refund mechanics are replayed manually only on this
Asset checkpoint; do not repeat the Event checkout testcase for them.
