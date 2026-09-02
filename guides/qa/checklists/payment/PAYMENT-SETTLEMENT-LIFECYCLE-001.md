# PAYMENT-SETTLEMENT-LIFECYCLE-001 user test guide

This file is the tester's stable, repeatable guide. It is not an execution
log: do not check off its steps or add current dates, IDs, status or machine
evidence to it.

This testcase begins after provider authorization. It tests what happens to a
reversible hold later; it does not repeat the Stripe/Barion checkout UI merely
to prove that those pages render.

## What this checkpoint is for

The checkpoint distinguishes five materially different outcomes:

- capture after the paid booking is fulfilled and becomes settleable;
- release after a joined booking is cancelled before capture;
- compensation when authorization succeeds but fulfillment cannot complete;
- partial capture and invalid over-capture protection;
- authorization lifetime/reauthorization behavior.

Capture, release and refund are not interchangeable. A released hold must
never be reported as charged revenue or as a refund of captured money.

## Actors and startup

- **Nova** owns the authorized participant booking inspected in the UI.
- **Casey** owns the staged Event and performs only the named cancellation or
  capacity action when a branch requires it.
- Codex creates an independent authorized-but-uncaptured payment for each
  branch, records exact amounts/currency/provider IDs, stages the event-time
  boundary and lets the real existing settlement/operation worker run.
- The user never clicks an Admin `Run` control, edits timestamps, captures via
  a provider console or repeats an already-authorized checkout.
- Stop at the first mismatch. Do not use a different payment as a substitute.

To start a complete replay, tell Codex:

`Prepare the PAYMENT-SETTLEMENT-LIFECYCLE-001 user test.`

## Branch A — exact-once capture after fulfillment

1. Begin only after Codex confirms one accepted Nova booking with one
   authorized, uncaptured hold and an Event that is not yet settleable.
2. In **Nova**, open the Event's read-only `Payment summary`. Confirm the exact
   authorized amount/currency and that the UI does not claim capture or final
   settlement.
3. Report:

   `PAYMENT-SETTLEMENT-LIFECYCLE-001 capture baseline: authorized and uncaptured`

4. After Codex starts the fixture-owned time boundary, do not click `Payment`,
   capture or Admin `Run`. Wait for the normal worker.
5. When Codex confirms worker completion, reopen `Payment summary` and the
   relevant Monitoring/Job Detail surface.
6. Confirm the payment is captured for the exact authorized amount once and
   the operation is terminal rather than continuously running.
7. Report:

   `PAYMENT-SETTLEMENT-LIFECYCLE-001 captured: exact amount and one terminal operation`

## Branch B — cancellation releases an uncaptured hold

8. Continue only after Codex prepares a different joined,
   authorized-but-uncaptured booking.
9. In Nova's Event menu select `Leave Event`, then confirm `Leave Event` once.
10. Confirm Nova leaves the participant destination immediately and the UI
    does not label the hold as captured or refunded.
11. Report:

    `PAYMENT-SETTLEMENT-LIFECYCLE-001 cancelled: left before capture`

12. After the normal release operation completes, inspect the retained
    read-only payment/audit presentation named by Codex.
13. Confirm the booking is cancelled and the authorization is released once;
    there is no captured amount and no fake refund claim.
14. Report:

    `PAYMENT-SETTLEMENT-LIFECYCLE-001 released: uncaptured hold closed once`

## Branch C — authorization succeeds but fulfillment fails

15. Begin only after Codex confirms a new clean payment whose last place can
    be consumed at the controlled boundary before fulfillment.
16. Follow the ordinary provider authorization instruction for that branch
    exactly once.
17. After same-tab return, confirm Nova does **not** appear as an accepted
    member and owns no ticket or duplicate checkout success.
18. Report:

    `PAYMENT-SETTLEMENT-LIFECYCLE-001 compensation: authorization without entitlement`

19. Wait for Codex to confirm the durable release. Reload once and confirm the
    failed fulfillment has still not become membership/ticket success.

## Branch D — partial capture and invalid amount controls

This branch has no browser producer action. Codex invokes the versioned
provider-operation harness against an independent authorized payment; the
tester observes only the resulting read-only state.

20. Inspect the Payment summary and Monitoring detail after Codex confirms a
    valid partial capture.
21. Confirm the captured amount is the named smaller amount in the same
    currency and is not displayed as the full authorization.
22. After Codex retries the exact operation and probes zero, negative,
    over-authorized and currency-mismatched variants, reload once.
23. Confirm the valid captured amount is unchanged and there is no second
    entitlement or revenue entry.
24. Report:

    `PAYMENT-SETTLEMENT-LIFECYCLE-001 partial capture: valid amount persisted, invalid probes unchanged`

## Branch E — hold expiry gate

This branch is **not executable yet**. Setup/reauthorization scheduling beyond
the provider hold window is a recorded product design gap. Do not simulate a
PASS by editing an expiry timestamp, keeping an indefinite authorization or
capturing an expired hold.

When the product implements this contract, the guide must be extended with a
new user-visible fresh-authorization/setup action before this branch can run.

25. Report the terminal phrase only after Codex records Branch E as an honest
    blocked design gap rather than a manual failure:

    `PAYMENT-SETTLEMENT-LIFECYCLE-001 UI complete: capture, release, compensation and partial state agree`

Wait for the final exact-amount, operation-key, retry and provider-state
oracle. This testcase cannot be called fully implemented while Branch E
remains a design gap.

