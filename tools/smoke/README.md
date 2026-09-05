# Local smoke fixtures

These helpers create short-lived, replayable records in an already-running
local demo or E2E database. They are deliberately separate from the versioned
manual-QA checkpoint harness and from canonical seed generation.

## Event payment ready

`event-payment-ready.sh` prepares one public Event Explore record for Alex
Turner with an already-confirmed HUF 4,900 basket and no payment session or
assigned payment method. Opening the record therefore exercises only the saved
card assignment and payment boundary.

```bash
bash tools/smoke/event-payment-ready.sh prepare
bash tools/smoke/event-payment-ready.sh status
bash tools/smoke/event-payment-ready.sh replay
bash tools/smoke/event-payment-ready.sh reset
```

- `prepare` snapshots the fixture scope and the two affected users' activity
  and spending fields, then inserts the payment-ready event and basket.
- `status` is read-only and shows the selected `paymentMethodId`, payment state,
  basket state and resulting membership after the manual click sequence.
- `replay` restores the snapshot, removes only event-scoped side effects, and
  prepares a fresh six-hour basket.
- `reset` restores the snapshot and removes the smoke fixture.

The helper verifies the deployment marker, accepts only `demo_db` or `e2e_db`,
requires an already-running MongoDB container, and never starts or restarts the
application, MongoDB, a watcher or a build.
