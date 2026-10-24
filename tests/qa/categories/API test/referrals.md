# Referral invitation, turnover and refunds

Baseline: the previously executed and accepted QA scope. Current status: **PASS / CLOSED**.

## Checklist

1. Register through a personal referral link, import participants and claim one through the normal account flow.
2. Repeat and reload; inspect stable referral/import counters and verify revocation does not erase recorded attribution.
3. Complete the recorded EUR/HUF purchase and checkout flows, refund them and replay provider callbacks.
4. Check durable turnover/refund counters, interrupted-write recovery and the Revenue popup at desktop/mobile sizes.

## Recorded result

**PASS / CLOSED.** Consolidated on 2026-10-23 from the completed domain flows. No test was rerun by this documentation change.

Last recorded execution date: 2026-09-24.

Deployment boundaries: Dev: PASS. Local: previously accepted samples; unexecuted constituent boundaries are historical limits, not open work.

[Original accepted results](https://github.com/fssrepository/myscoutee-backend/blob/81ca568c3197f6caa8f8d4522dd58594eb765818/guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv#L7). The Git revision retains the detailed observations, recorded limits and supporting artifacts.
