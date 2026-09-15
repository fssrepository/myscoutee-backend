# OPERATOR-REVENUE-LIFECYCLE-001 — Revenue totals and settlement

## Purpose

Inspect Revenue from a prepared payment dataset, synchronize once and open
one settlement. Amounts, currency, period and payment identifiers must match
source records and remain consistent after reopening.

**Actor:** Operator on the designated QA deployment. Codex names the provider,
currency, period, captured payments, released control and expected total.
Payments are fixture prerequisites; do not repeat checkout here.

## 1. Revenue baseline

1. Open **Revenue** in Operator. Check the deployment and displayed period/currency.
2. Record totals and the prepared period’s point. Codex retains the underlying
   source payment records.

Report: `OPERATOR-REVENUE-LIFECYCLE-001 block 1 done`.

## 2. Synchronization and totals

3. Start one synchronization through the normal Revenue action.
4. Wait for its final result. Success corresponds to an actually completed
   report; Codex identifies the durable result.
5. Compare with the prepared amount and count. The released control does not
   increase captured revenue. Other providers, currencies or periods must
   not be mixed into the selected total.

Report: `OPERATOR-REVENUE-LIFECYCLE-001 block 2 done`.

## 3. Settlement and reopening

6. Open the named **settlement**. Provider, payment operation, payment/booking
   identifier, currency and amount match the selected source.
7. Close and reopen Revenue. The synchronized result and checked settlement persist.
8. Codex compares source records, report, settlement and unchanged control,
   then restores the QA dataset.

Report: `OPERATOR-REVENUE-LIFECYCLE-001 done`.

## Execution boundary

Dedicated fixtures and browser startup are prepared when this test starts.
Reporting failures, retries and the full idempotence/exclusion matrix belong
to automated coverage, not extra manual blocks in this journey.
