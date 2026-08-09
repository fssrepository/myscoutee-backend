# Frame approval ledger

Last updated: **9 August 2026**

This is the single approval record for the mobile-only `9:16` checkpoint frames
used by Parts I and II. The films are expected to regenerate most or all old
composition studies. A generated image is not production canon merely because
it exists in the repository.

## Approval rule

- `accepted` is written only after the Founder explicitly approves that exact
  file.
- `candidate-review` is a newly generated frame awaiting that decision.
- `superseded-test` is a historical model-test frame that must not enter either
  final checkpoint chain.
- `provisional-old` is an earlier composition study and must not be uploaded as
  a final endpoint without a new explicit review.
- `rejected` must not be reused.
- `not-generated` has no current image.
- `canonical-inherited` is a lossless handoff from an already accepted adjacent
  sequence, not a newly approved image in this pass.
- Replacing an accepted file requires a new filename and a new approval entry;
  never silently overwrite the accepted artifact.

## Explicitly accepted frames

| Part | Frame | Accepted file | SHA-256 | Decision note |
| --- | --- | --- | --- | --- |
| I | CP00 | `guides/story/trilogy/01-the-city-between-us/assets/frames/candidates/S01/CP00-v1.png` | `483683caa388459386d5ceec2320c2a4c5d97e681ec95377c1a5f3bc2a863ded` | Accepted for the current production pass; optional improvement deferred |
| I | CP01 | `guides/story/trilogy/01-the-city-between-us/assets/frames/candidates/S01/CP01-v1.png` | `1dee72adf67e4b13bab7460b1c0cfdb37fe935e91dfa28467a75763d17931932` | Accepted S01 ending and canonical S02 handoff for the current production pass |

## Historical model-test candidates

| Part | Frame | Status | Candidate file | SHA-256 | Purpose |
| --- | --- | --- | --- | --- | --- |
| I | CP18 | `superseded-test` | `../benchmarks/assets/video-model-cp18-cp19/CP18-candidate-v01.png` | `c823319bfc71ee92e9b7822d9963feb985863017ff19612b65b35d9d55c3bf62` | Historical first endpoint; regenerate from the closed package |
| I | CP19 | `superseded-test` | `../benchmarks/assets/video-model-cp18-cp19/CP19-candidate-v01.png` | `db08d73bd948cb33aed556df9b01078e315d05f43f953ae3eac92e3c6f569fd9` | Historical last endpoint; regenerate from the closed package |

Both candidates are exactly `720×1280`. Their paired prompt is
`../benchmarks/prompts/model-benchmark-cp18-cp19.txt`.
Their reproducible still-image generation specification is
`../benchmarks/prompts/frame-generation-cp18-cp19-v01.txt`.

## Part I — The City Between Us

| Frame | Current status | Note |
| --- | --- | --- |
| CP00 | `accepted` | S01 first endpoint: `assets/frames/candidates/S01/CP00-v1.png`; optional improvement deferred |
| CP01 | `accepted` | S01 last endpoint and canonical S02 continuity handoff: `assets/frames/candidates/S01/CP01-v1.png` |
| CP02 | `candidate-review` | S02 last endpoint: `assets/frames/candidates/S02/CP02-v1.png`; SHA-256 `8920a5a0b4dc09a35c4419500d58d225ae8dc521b556e283d008d68beb686f67` |
| CP03–CP17 | `provisional-old` | Existing `assets/storyboard-rough/` files are composition studies; regenerate and review individually |
| CP18 | `superseded-test` | Historical benchmark endpoint; regenerate and review |
| CP19 | `superseded-test` | Historical benchmark endpoint; regenerate and review |
| CP20–CP22 | `provisional-old` | Existing studies must be regenerated and reviewed individually |
| E01 | `deterministic-post` | Final brand card belongs to deterministic post-production, not the video model |

## Part II — The System Between Us

| Frame | Current status | Note |
| --- | --- | --- |
| CP00 | `canonical-inherited` | Lossless Part I handoff; verify again when the Part I final chain is locked |
| CP01–CP10 | `provisional-old` | Existing checkpoint files are composition studies only |
| CP11 | `rejected` | Does not yet show the reviewed solitary rehabilitation scene accurately |
| CP12–CP38 | `not-generated` | Generate sequentially for the locked Veo 3.1 Lite route |

## Approval history

| Date | Part/frame | File | Decision | Founder note |
| --- | --- | --- | --- | --- |
| 2026-08-08 | I/CP18 | `CP18-candidate-v01.png` | superseded | Historical model comparison only |
| 2026-08-08 | I/CP19 | `CP19-candidate-v01.png` | superseded | Historical model comparison only |
| 2026-08-09 | I/CP00 | `CP00-v1.png` | accepted | Current production pass accepted; optional later improvement does not block the chain |
| 2026-08-09 | I/CP01 | `CP01-v1.png` | accepted | Current production pass accepted and inherited by S02 |
