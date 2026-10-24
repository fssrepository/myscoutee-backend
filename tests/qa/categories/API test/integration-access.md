# API/MCP permissions, OAuth and Events

Baseline: the previously executed and accepted QA scope. Current status: **PASS / CLOSED**.

## Checklist

1. Open integration settings; check the combined read, four access choices, one-time secrets and masked reopen.
2. Change a child selection, discard its parent and reopen; save through the parent and verify persisted permissions in HTTP and applicable local mode.
3. Follow OAuth approval/cancel/login return, PKCE, single-use authorization and revocation with the prepared callback.
4. Create the permitted signed Events subscription; verify challenge, role/node filtering, delivery, retry, idempotence and bounded failure handling.
5. Downgrade or revoke the grant; verify subscription/read/write access changes and personal decisions remain with the user.

## Recorded result

**PASS / CLOSED.** Consolidated on 2026-10-23 from the completed domain flows. No test was rerun by this documentation change.

Last recorded execution date: 2026-10-15.

Deployment boundaries: Dev: PASS. Local: PASS; N/A — external callbacks require backend.

[Original accepted results](https://github.com/fssrepository/myscoutee-backend/blob/81ca568c3197f6caa8f8d4522dd58594eb765818/guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv#L12). The Git revision retains the detailed observations, recorded limits and supporting artifacts.
