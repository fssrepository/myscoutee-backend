# Frame approval ledger

Last updated: **8 August 2026**

This is the single approval record for the mobile-only `9:16` checkpoint frames
used by Parts I and II. The films are expected to regenerate most or all old
composition studies. A generated image is not production canon merely because
it exists in the repository.

## Approval rule

- `accepted` is written only after the Founder explicitly approves that exact
  file.
- `candidate-review` is a newly generated frame awaiting that decision.
- `provisional-old` is an earlier composition study and must not be uploaded as
  a final endpoint without a new explicit review.
- `rejected` must not be reused.
- `not-generated` has no current image.
- `canonical-inherited` is a lossless handoff from an already accepted adjacent
  sequence, not a newly approved image in this pass.
- Replacing an accepted file requires a new filename and a new approval entry;
  never silently overwrite the accepted artifact.

## Explicitly accepted frames

**None in the new regeneration pass yet.**

## Current candidates awaiting Founder review

| Part | Frame | Status | Candidate file | SHA-256 | Purpose |
| --- | --- | --- | --- | --- | --- |
| I | CP18 | `candidate-review` | `../benchmarks/assets/video-model-cp18-cp19/CP18-candidate-v01.png` | `c823319bfc71ee92e9b7822d9963feb985863017ff19612b65b35d9d55c3bf62` | Exact first endpoint for the six-person model benchmark |
| I | CP19 | `candidate-review` | `../benchmarks/assets/video-model-cp18-cp19/CP19-candidate-v01.png` | `db08d73bd948cb33aed556df9b01078e315d05f43f953ae3eac92e3c6f569fd9` | Exact last endpoint for the six-person model benchmark |

Both candidates are exactly `720×1280`. Their paired prompt is
`../benchmarks/prompts/model-benchmark-cp18-cp19.txt`.

## Part I — The City Between Us

| Frame | Current status | Note |
| --- | --- | --- |
| CP00–CP17 | `provisional-old` | Existing `assets/storyboard-rough/` files are composition studies; regenerate and review individually |
| CP18 | `candidate-review` | New benchmark first endpoint v01; not accepted yet |
| CP19 | `candidate-review` | New benchmark last endpoint v01; not accepted yet |
| CP20–CP22 | `provisional-old` | Existing studies must be regenerated and reviewed individually |
| CP23 | `deterministic-post` | Final brand card belongs to deterministic post-production, not the video-model frame benchmark |

## Part II — The System Between Us

| Frame | Current status | Note |
| --- | --- | --- |
| CP00 | `canonical-inherited` | Lossless Part I handoff; verify again when the Part I final chain is locked |
| CP01–CP10 | `provisional-old` | Existing checkpoint files are composition studies only |
| CP11 | `rejected` | Does not yet show the reviewed solitary rehabilitation scene accurately |
| CP12–CP22 | `not-generated` | Generate only after the benchmark model and visual route are selected |

## Approval history

| Date | Part/frame | File | Decision | Founder note |
| --- | --- | --- | --- | --- |
| 2026-08-08 | I/CP18 | `CP18-candidate-v01.png` | pending | Awaiting review |
| 2026-08-08 | I/CP19 | `CP19-candidate-v01.png` | pending | Awaiting review |
