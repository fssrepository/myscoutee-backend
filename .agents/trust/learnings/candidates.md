# Candidate learnings

Candidates affect review questions but are not universal hard rules until
promoted.

## C001 — Prefer established interaction grammar for analogous flows

Observation: asset borrow repeatedly needed the same two-phase checkout,
summary, policy, payment, audit, and status grammar as event checkout.

Candidate habit: when the user says a flow should be similar to an existing
flow, inventory and reuse its behavior/component/store contracts before
creating a parallel implementation.

Promotion evidence needed: successful reuse across another independent flow
without forcing domain differences into a premature abstraction.

## C002 — Current rules may favor mutation-time derived parent state

Observation: repeated MyScoutee tasks favored updating compact parent counters
on mutation over expensive query projections.

Candidate limit: apply only to hot, well-owned read state with complete
transition, transaction, idempotency, cleanup, and reconciliation design.

Promotion evidence needed: identify a stable canonical pattern and tests across
multiple domains.

## C003 — Manual runtime constraints should persist within the task

Observation: commands such as “do not build” or “use the running dev stack”
were sometimes lost after context switched to another defect.

Candidate habit: record runtime constraints in the task ledger and recheck them
before every process-changing command.

Promotion evidence needed: validate that this does not retain obsolete
constraints across clearly new tasks.

## C004 — Preserve underlying surfaces when stacking popups

Observation: repeated user corrections reject hiding the avatar or a parent
popup when another popup opens. Keep the underlying surface mounted and visible;
reuse the shared popup layers and translucent backdrop for coverage and pointer
blocking. Do not add popup-specific opacity, visibility or parent-close rules.

Promotion evidence needed: verify nested popup state and backdrop behavior across
additional independent flows.

## C005 — Opening a popup must not wait for data it can load inside

Observation: setup waited for browser permissions and forcibly reloaded deployment
configuration before becoming visible. Reuse already loaded shared state, open
synchronously and show pending state only on controls requiring asynchronous data.

Promotion evidence needed: apply and verify the same boundary in another popup.
