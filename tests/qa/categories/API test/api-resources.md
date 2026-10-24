# API resources and participant links

Baseline: the previously executed and accepted QA scope. Current status: **PASS / CLOSED**.

## Checklist

1. Create a scoped API key and use the existing client to create image-bearing Event and Asset resources; inspect the same resources through the normal UI.
2. Follow participant links with a new registration and an existing account. Verify claim ownership, workspace selection and the terminal membership decision.
3. Check repeated/conflicting claims and failed requests preserve ownership and do not duplicate membership, payment or counters.
4. Observe the signed callback and its terminal state; revoke access and verify further requests are rejected.

## Recorded result

**PASS / CLOSED.** Consolidated on 2026-10-23 from the completed domain flows. No test was rerun by this documentation change.

Last recorded execution date: 2026-09-28.

Deployment boundaries: Dev: PASS; PASS — 7/7 ordered blocks; HTTP/simulator. Local: PASS — keys, profile isolation and EN/HU help; external OAuth N/A.

[Original accepted results](https://github.com/fssrepository/myscoutee-backend/blob/81ca568c3197f6caa8f8d4522dd58594eb765818/guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv#L6). The Git revision retains the detailed observations, recorded limits and supporting artifacts.
