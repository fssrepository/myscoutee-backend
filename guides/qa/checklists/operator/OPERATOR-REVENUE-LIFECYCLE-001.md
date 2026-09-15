# OPERATOR-REVENUE-LIFECYCLE-001 — Revenue aggregation, report and settlement

## Purpose

Synchronize one prepared payment dataset and compare exact revenue totals,
the report revision, synchronization job, reconciliation and one settlement.
**Actor:** Operator on the designated QA deployment.

## Fixture prerequisites

Codex names the provider, currency, period, expected captured count/amount and
payment/booking IDs. Include authorized-only, released and dummy controls,
plus data outside the selected provider/currency/period. Record source records,
existing report revision, job and settlement state before synchronization.

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
   synchronization job and outcome; an accepted request is not completed reporting.
5. Correlate exactly one report revision and its reconciliation result with
   the one synchronization. Displayed success must match the durable result.
6. Compare displayed and stored captured amount/count with the expected source
   total. Each eligible payment contributes once to the selected aggregation.
7. Verify the authorized-only, released and dummy controls are excluded.
   Other providers, currencies and periods do not leak into the selected total;
   the excluded source records remain unchanged.

Report: `OPERATOR-REVENUE-LIFECYCLE-001 block 2 done`.

## 3. Settlement, reopening and cleanup

8. Open the named **settlement**. Provider, payment operation, payment ID,
   booking ID, currency and amount match the selected source records.
9. Codex correlates that settlement with the synchronized report/reconciliation;
   matching amounts alone are insufficient if the underlying identities differ.
10. Close and reopen Revenue. The period totals, report revision and selected
    settlement remain the same. Reading creates no duplicate report or sync job.
11. Codex compares source inclusion/exclusion, exact totals, report/job outcome,
    settlement identity and unaffected controls, then restores the QA baseline.

Report: `OPERATOR-REVENUE-LIFECYCLE-001 done`.

## Original matrix coverage

| Source requirement | Owning checks |
| --- | --- |
| Exact provider/period/currency totals | Baseline and steps 5–7 |
| Captured payments counted once | Step 6 |
| Authorized, released and dummy controls excluded | Step 7 |
| One report revision, reconciliation and synchronization job | Steps 3–5 |
| Settlement/payment/booking/provider/currency identity | Steps 8–9 |
| Persisted reopen result and unchanged controls | Steps 10–11 |

## Execution boundary

Dedicated fixtures and browser startup are prepared when this test starts.
The listed normal-path exclusions remain mandatory here. Broader exclusion
combinations, injected reporting failure, retry/requeue and recovery matrices
remain automated coverage; no second manual payment lifecycle is added.
