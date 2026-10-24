# Event checkout, payment history and cards

Baseline: the previously executed and accepted QA scope. Current status: **PASS / CLOSED**.

## Checklist

1. From Explore inspect paid review and a resumable basket; cancel, reopen and complete the recorded Stripe checkout through the normal provider flow.
2. Compare free, approval-required, waitlist and Cash-only behavior, including terminal participation and the read-only payment summary.
3. Register/reopen Stripe and Barion cards; inspect 3DS/reconnect/retokenization and expired-card controls without creating entitlement on failure.
4. Check member-scoped history, filters/totals, cash/transfer receipts, retry/refund and workspace isolation.

## Recorded result

**PASS / CLOSED.** Consolidated on 2026-10-23 from the completed domain flows. No test was rerun by this documentation change.

Last recorded execution date: 2026-10-15.

Deployment boundaries: Dev: PASS; PASS — recorded scope. Local: NOT RUN.

[Original accepted results](https://github.com/fssrepository/myscoutee-backend/blob/81ca568c3197f6caa8f8d4522dd58594eb765818/guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv#L59). The Git revision retains the detailed observations, recorded limits and supporting artifacts.
