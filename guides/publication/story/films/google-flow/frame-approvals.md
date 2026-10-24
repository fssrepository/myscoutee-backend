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
- Replacing an accepted frame requires a new approval-history entry and hash,
  but the canonical filename remains `CPxx.png`; the ledger, not filename
  variants, records the change.
- Keep only the normalized `720×1280` production frame under its plain
  checkpoint name (`CP05.png`, not a versioned or `-source` duplicate). Reject
  unsuitable generations instead of accumulating filename variants.

## Explicitly accepted frames

| Part | Frame | Accepted file | SHA-256 | Decision note |
| --- | --- | --- | --- | --- |
| I | CP00 | `guides/publication/story/films/google-flow/the-city-between-us/assets/frames/CP00.png` | `483683caa388459386d5ceec2320c2a4c5d97e681ec95377c1a5f3bc2a863ded` | Accepted for the current production pass; optional improvement deferred |
| I | CP01 | `guides/publication/story/films/google-flow/the-city-between-us/assets/frames/CP01.png` | `1dee72adf67e4b13bab7460b1c0cfdb37fe935e91dfa28467a75763d17931932` | Accepted S01 ending and canonical S02 handoff for the current production pass |
| I | CP02 | `guides/publication/story/films/google-flow/the-city-between-us/assets/frames/CP02.png` | `8920a5a0b4dc09a35c4419500d58d225ae8dc521b556e283d008d68beb686f67` | Accepted S02 ending and canonical S03 handoff for the current production pass |

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
| CP00 | `accepted` | S01 first endpoint: `assets/frames/CP00.png`; optional improvement deferred |
| CP01 | `accepted` | S01 last endpoint and canonical S02 continuity handoff: `assets/frames/CP01.png` |
| CP02 | `accepted` | S02 last endpoint and canonical S03 handoff: `assets/frames/CP02.png` |
| CP03 | `candidate-review` | Soho lunch endpoint: `assets/frames/CP03.png`; SHA-256 `dd035a55e7fc20f7712b1879904ac9188a98ca6c7a93f6bdc3b3a87b9e4e7135` |
| CP04 | `candidate-review` | London culture and Victoria-line endpoint: `assets/frames/CP04.png`; SHA-256 `c9f019cc742b943a58a617fb9865b21feae391007975df3ad45e2a50424c6562` |
| CP05 | `candidate-review` | Corrected interior candidate: exactly ten adults total (Founder plus nine), seven men and three women aged about 23–55: `assets/frames/CP05.png`; SHA-256 `741118b6661e7e2b8efd19ded4ec5e448c741214001de6416b3ee3de726616b8` |
| CP06 | `candidate-review` | Corrected two-zone shared bedroom with Lee Valley canal-and-reeds window view: `assets/frames/CP06.png`; SHA-256 `f903b4a258a60bff075a38f3266142c64c327e5c08dde47cbc6432a5b312114e` |
| CP07 | `candidate-review` | Corrected five-year threshold and London housing stop-loss with Lee Valley water-and-wetland horizon: `assets/frames/CP07.png`; SHA-256 `a5c7939e4e472075a20ca2d85db5876bd1b37f6194933493a000f87cdd4dc842` |
| CP08–CP17 | `provisional-old` | Existing `assets/storyboard-rough/` files are composition studies; regenerate and review individually |
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
| 2026-08-09 | I/CP00 | `CP00.png` | accepted | Current production pass accepted; optional later improvement does not block the chain |
| 2026-08-09 | I/CP01 | `CP01.png` | accepted | Current production pass accepted and inherited by S02 |
| 2026-08-09 | I/CP02 | `CP02.png` | accepted | Current production pass accepted and inherited by S03 |
