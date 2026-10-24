# Notification rules, delivery and inbox

Baseline: the previously executed and accepted QA scope. Current status: **PASS / CLOSED**.

## Checklist

1. Use the already-produced domain event or the prepared message-rule fixture; let the real rule/run/outbox path deliver its output.
2. Compare recipient New/All buckets, counters and the correct destination, including rating/feedback and Administrator consumers.
3. Read/mute/reopen/reload the inbox and inspect persisted state, duplicate-delivery controls and unaffected users.
4. Observe the same producer once across inbox, statistics and monitoring instead of recreating it for each observer.

## Recorded result

**PASS / CLOSED.** Consolidated on 2026-10-23 from the completed domain flows. No test was rerun by this documentation change.

Last recorded execution date: 2026-09-15.

[Original accepted results](https://github.com/fssrepository/myscoutee-backend/blob/81ca568c3197f6caa8f8d4522dd58594eb765818/guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv#L133). The Git revision retains the detailed observations, recorded limits and supporting artifacts.
