# Ticket issue, attendance and offline controls

Baseline: the previously executed and accepted QA scope. Current status: **PASS / CLOSED**.

## Checklist

1. Enable ticketing, publish and compare accepted and pending membership: only the terminal accepted participant receives one usable physical credential.
2. Verify join/cancel/reload and later Admin approval, including an ordinary member invitation and a second similar Event isolation control.
3. Use the recorded physical-phone Admin scanner flow for first check-in; compare exact-once use, actor replay denials and counted holder warnings.
4. Unpublish/republish and cross the end-time boundary; inspect the preserved active/disabled audit history and Upcoming/Past classification.
5. Present the warmed cached QR while only the holder is offline; an online authorized scanner still owns check-in.
6. Inspect the first check-in in Event Members; reject the saved QR while the Event is unpublished without changing membership acceptance.

## Recorded result

**PASS / CLOSED.** Consolidated on 2026-10-23 from the completed domain flows. No test was rerun by this documentation change.

Last recorded execution date: 2026-08-13.

[Original accepted results](https://github.com/fssrepository/myscoutee-backend/blob/81ca568c3197f6caa8f8d4522dd58594eb765818/guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv#L60). The Git revision retains the detailed observations, recorded limits and supporting artifacts.
