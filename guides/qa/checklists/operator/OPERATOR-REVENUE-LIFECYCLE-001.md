# OPERATOR-REVENUE-LIFECYCLE-001 — Revenue aggregation, report and settlement

## Purpose

Synchronize one prepared payment dataset and compare exact revenue totals,
the daily report revisions, durable delivery results and one monthly settlement.
**Actor:** Operator on the designated QA deployment.

## Fixture prerequisites

Codex names the source providers, currencies, periods, expected captured
counts/amounts and local payment/activity IDs. Include authorized-only, released,
dummy and non-payment audit controls, plus other-currency and other-period data.
The Revenue overview combines eligible providers by currency; completed daily
reports separate periods. Record source records, existing report revisions,
delivery state and settlement state before synchronization.

Payments and bookings come from fixtures; do not repeat checkout or payment
creation. The actual Revenue synchronization must produce the report/result,
not fixture-written totals. Existing payment proofs do not prove aggregation.

## 1. Revenue baseline

1. Open **Revenue**. Confirm deployment identity and the selected period/currency.
2. Record the summary, period point and existing report state. Codex independently
   computes the expected eligible captured total from the declared source set.

Report: `OPERATOR-REVENUE-LIFECYCLE-001 block 1 done`.

## 2. One synchronization and exact totals

3. Start synchronization once through the normal Revenue action.
4. Observe pending/progress/final result. Codex identifies the corresponding
   durable outbox deliveries and signed acceptance receipts; an accepted request
   is not completed reporting. This action does not create an Admin Jobs row.
5. Correlate one report revision per completed day and its acceptance result with
   the one synchronization. Empty intervening days can have empty reports.
   Displayed success must match the durable result.
6. Compare displayed and stored captured amount/count with the expected source
   total. Each eligible payment contributes once to the selected aggregation.
7. Verify the authorized-only, released and dummy controls are excluded.
   Eligible providers contribute to their currency total, currencies remain
   separate, and each daily report contains only its own completed UTC day.
   The current incomplete day stays in the overview but is not delivered yet.
   The excluded source records remain unchanged.

Report: `OPERATOR-REVENUE-LIFECYCLE-001 block 2 done`.

## 3. Settlement, reopening and cleanup

8. Open the named **monthly network settlement**. Deployment, period, currency,
   revision, network-pool amount and contribution/share match its signed records.
9. Codex correlates that settlement with the synchronized daily revenue reports
   and their local source payments/activity references. Individual payment and
   booking identities remain local; they are not fields of the network settlement.
10. Close and reopen Revenue. The period totals, report revision and selected
    settlement remain the same. Reading creates no duplicate report or delivery.
11. Codex compares source inclusion/exclusion, exact totals, delivery outcome,
    settlement identity and unaffected controls, then restores the QA baseline.

Report: `OPERATOR-REVENUE-LIFECYCLE-001 done`.

## Original matrix coverage

| Source requirement | Owning checks |
| --- | --- |
| Exact aggregation of eligible providers by period/currency | Baseline and steps 5–7 |
| Captured payments counted once | Step 6 |
| Authorized, released and dummy controls excluded | Step 7 |
| Daily report revisions and durable signed delivery results | Steps 3–5 |
| Signed monthly settlement and local source-payment/report correlation | Steps 8–9 |
| Persisted reopen result and unchanged controls | Steps 10–11 |

## Execution boundary

Dedicated fixtures and browser startup are prepared when this test starts.
Use `operator-registry-fixture.py --checkpoint revenue` for paired stage/reset,
and the `operator-revenue` Mongo oracle for read-only verification. After the
Revenue synchronization, `prepare-operator-revenue-settlement.mjs` prepares the
already-tested claim/measurement prerequisite through normal backend APIs and
the Go review CLI, then calculates the monthly settlement through the Registry
CLI. This is setup for steps 8–9, not a repeated Registry lifecycle test or a
fixture-written successful settlement. The paired reset owns all these changes.
The listed normal-path exclusions remain mandatory here. Broader exclusion
combinations, injected reporting failure, retry/requeue and recovery matrices
remain automated coverage; no second manual payment lifecycle is added.
