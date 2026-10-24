# Group audio/video calls

Baseline: the previously executed and accepted QA scope. Current status: **PASS / CLOSED**.

## Checklist

1. Open the call through the chat phone control and check microphone permission, decline/denial/retry and teardown of pending media.
2. Verify synchronized microphone/camera/tile/volume/fullscreen controls and the recorded translated error presentation.
3. Use the recorded three-party real RTP flow for Admin mute, release/rejoin and oldest-surviving coordinator behavior.
4. Inspect the seven-participant paging/follow controls and actual per-viewer video suppression while audio continues.
5. Check the recorded signaling/STUN recovery, repeated-call cleanup and EN/HU guide coverage. Physical audio and external-network quality are not inferred from synthetic media.

## Recorded result

**PASS / CLOSED.** Consolidated on 2026-10-23 from the completed domain flows. No test was rerun by this documentation change.

Last recorded execution date: 2026-10-16.

Deployment boundaries: Dev: PASS — recorded scope. Local: N/A (no call transport).

[Original accepted results](https://github.com/fssrepository/myscoutee-backend/blob/81ca568c3197f6caa8f8d4522dd58594eb765818/guides/qa/matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv#L109). The Git revision retains the detailed observations, recorded limits and supporting artifacts.
