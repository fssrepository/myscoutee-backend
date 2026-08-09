# Two-film credit-saver benchmark and production plan

Status: **current operating plan, 9 August 2026**.

The goal is two mobile-first English films from one locked written package. Do
not spend credits on every model or on disposable storyboard media. Compare one
difficult final-usable interval, choose a route, then generate the films.

## 1. Locked delivery

| Part | Structure | Runtime | Generated clips |
| --- | --- | ---: | ---: |
| I — The City Between Us | P00 + S01–S22 + E01 | `03:12` | 22 |
| II — The System Between Us | P00 + S01–S38 + E01 | `05:20` | 38 |
| **Total** |  | **`08:32`** | **60** |

- aspect ratio: `9:16`;
- working and delivery raster: `720×1280`;
- constant `24 fps`;
- every generated unit: exactly `8 s`;
- P00/E01: deterministic post graphics, not generated motion;
- narration: separately generated, continuous and time-aligned;
- music: one continuous score per film;
- ambience, foley, captions, typography, trim, ducking and export: CPU post;
- no lip sync, visible generated speech or retained clip audio;
- no slideshow, animatic, midpoint frame or four-second generation unit.

## 2. Current Flow budget

Observed working balance: **970 credits**.

| Use | Units | Lite price | Credits |
| --- | ---: | ---: | ---: |
| Part I first pass | 22 | 10 | 220 |
| Part II first pass | 38 | 10 | 380 |
| **Base production** | **60** |  | **600** |
| **Reserve after base** |  |  | **370** |

The reserve pays for the controlled benchmark and selected failures, not a
second complete pass. Record the live price beside Generate because model names,
prices and subscription terms can change.

Account-specific watermark observation: the Hungary-based Flow control was off
by default and the inspected download had no visible watermark. Recheck the
control and every final download. Invisible provenance marking may remain.

## 3. Benchmark before bulk generation

The first benchmark must be a deliberately difficult eight-second interval that
can remain in the final film. Select it only after the written audit closes.

### Fixed comparison contract

- generate the interval's exact two numbered `9:16` endpoints once;
- use the identical lossless PNG pair in every tested model;
- use the identical prompt, `8 s`, `9:16`, `720p` and one-result setting;
- disable prompt rewrite, automatic polish, Extend and additional references;
- no dialogue, narration, music or requested clip audio;
- do not compare a model that cannot use both exact endpoints;
- do not regenerate characters merely to make one model look better.

### Flow discovery order

The live interface is authoritative. The previously observed prices were:

| Model | One 8-second result | Role |
| --- | ---: | --- |
| Veo 3.1 Lite | 10 | production baseline |
| Veo 3.1 Fast | 20 | optional middle comparison if exposed |
| Veo 3.1 Quality | 100 | one difficult-scene comparison only |

The earlier Lite/Quality test showed only a modest improvement for the current
painterly material. Default bulk production therefore remains Lite unless the
new controlled benchmark produces a clear, final-visible advantage.

### OpenArt comparison

Only test Seedance or Kling variants that expose the same start+end-frame,
eight-second, 9:16 contract. Record the live credit price before generating.
Do not subscribe or upgrade merely to add a non-comparable model. If OpenArt
wins clearly, calculate its complete 60-clip cost and retry allowance before
bulk production.

## 4. Evaluation sheet

Score blind where practical:

1. first-frame fidelity;
2. last-frame fidelity;
3. exact person count;
4. identity, clothing and prop continuity;
5. face, hand and body anatomy;
6. transition continuity;
7. natural micro-movement and acting;
8. camera stability;
9. style and mobile composition;
10. usability without rescue work.

Record results in
[`MODEL_BENCHMARK_LOG.csv`](../../benchmarks/tracking/MODEL_BENCHMARK_LOG.csv).

## 5. Character and world policy

- Character tools preserve an approved design; they do not automatically make
  characters more appealing.
- Use the existing book/character maps as the design source. A recurring role
  needs a stable reference; one-scene background adults may use an image
  reference only.
- Do not spend credits training every minor role.
- Flow has no required separate World object for this package. Location and
  style continuity live in the endpoint frames and prompt contract.
- Keep the same Founder identity across both parts.
- The six-person product group remains exactly three women and three men, each
  visually distinct and treated with equal agency.

## 6. Production sequence

1. close the books, scripts, storyboards and prompt audit;
2. select the hardest final-usable interval;
3. generate and approve its exact two endpoint frames;
4. run one result per comparable model;
5. choose the production route and write the decision to the log;
6. generate S01–S22 and S01–S38 in small reviewable batches;
7. download and verify every source file before the next batch;
8. discard all generated audio;
9. assemble P00, generated clips and E01;
10. generate Jon's clean reads, align narration, then compose/mix one continuous
    score per part;
11. deliver clean master, narration/score/foley stems, SRT and WebVTT.

## 7. Stop rules

- Stop if the charged credit price differs from the recorded assumption.
- Stop after two failures with the same apparent cause; fix the endpoint or
  prompt before another generation.
- Stop if a model changes a locked identity, person count or endpoint.
- Do not use Quality as a bulk model unless the remaining-balance calculation
  is rewritten and explicitly accepted.
- Do not publish externally from this workflow. The Founder performs or
  explicitly authorizes the upload.

## 8. Subscription notes

Prices, credits, commercial rights, watermark controls and rollover policies
are temporally unstable. The account screen and checkout at purchase time are
authoritative. Capture plan name, price, renewal date, credit balance,
commercial-use wording and per-generation charge before any paid batch.
