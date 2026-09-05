# Local smoke fixtures

These helpers create short-lived, replayable records in an already-running
local demo or E2E database. They are deliberately separate from the versioned
manual-QA checkpoint harness and from canonical seed generation.

## Event payment ready

`event-payment-ready.sh` prepares one public Event Explore record for Alex
Turner with an already-confirmed HUF 4,900 basket and no payment session or
assigned payment method. Opening the record therefore exercises only the saved
card assignment and payment boundary.

Manual smoke sequence:

1. Enter the demo workspace as Alex Turner.
2. Open Event Explore and choose `SMOKE · Event payment ready`.
3. Continue the existing booking. The checkout opens directly on payment.
4. Select a saved card, then submit the payment.
5. Run `status` to inspect the recorded `paymentMethodId`, payment result and
   membership assignment.

```bash
bash tools/smoke/event-payment-ready.sh prepare
bash tools/smoke/event-payment-ready.sh status
bash tools/smoke/event-payment-ready.sh refresh-display
bash tools/smoke/event-payment-ready.sh replay
bash tools/smoke/event-payment-ready.sh reset
```

- `prepare` snapshots the fixture scope and the two affected users' activity
  and spending fields, then inserts the payment-ready event and basket.
- `status` is read-only and shows the selected `paymentMethodId`, payment state,
  basket state and resulting membership after the manual click sequence.
- `refresh-display` updates only the fixture event and basket display timeframe;
  it preserves the current payment, basket state and failure evidence.
- `replay` restores the snapshot, removes only event-scoped side effects, and
  prepares a fresh six-hour basket.
- `reset` restores the snapshot and removes the smoke fixture.

The helper verifies the deployment marker, accepts only `demo_db` or `e2e_db`,
requires an already-running MongoDB container, and never starts or restarts the
application, MongoDB, a watcher or a build.
