# Two-film Veo Lite production and credit plan

Status: **locked operating plan, 9 August 2026**.

The model and narrator are decided: **Google Flow Veo 3.1 Lite** for motion and
**Jon — Warm & Grounded Storyteller** for both English narrations. There is no
further model or character benchmark in this production pass.

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
- mode: Frames to Video with exact first and last frame;
- model: Veo 3.1 Lite;
- result count: one;
- P00/E01: deterministic post graphics, no video-generation credits;
- narration: Jon, separately generated and continuously aligned;
- music: one continuous score per film;
- ambience, foley, captions, typography, trim, ducking and export: CPU post;
- no lip sync, visible generated speech or retained clip audio;
- no slideshow, animatic, midpoint frame, Extend or four-second unit.

## 2. Credit budget

Observed working balance: **970 credits**.

| Use | Units | Lite price | Credits |
| --- | ---: | ---: | ---: |
| Part I first pass | 22 | 10 | 220 |
| Part II first pass | 38 | 10 | 380 |
| **Base production** | **60** |  | **600** |
| **Repair reserve** |  |  | **370** |

The live Flow interface is authoritative if the displayed price changes. At ten
credits per interval, the reserve allows at most 37 retries, but it is not a
target. Preserve it for concrete endpoint, identity or motion failures.

## 3. Character and world policy

- Use the existing book and character maps as the design source.
- Keep the same Founder identity across both parts.
- A recurring role receives a stable reference. One-scene background adults may
  use their approved endpoint appearance without consuming a trained slot.
- The first MyScoutee group remains exactly three women and three men, each
  distinct and carrying equal visual agency.
- Flow does not require a separate World object. Location, light, style and
  continuity are locked in the endpoint frames and prompt.
- Do not redesign existing book characters during motion production merely to
  make them more conventionally attractive.

## 4. Per-interval workflow

1. Read the locked Sxx narration, storyboard block and shot prompt.
2. Generate or approve the exact 9:16 first and last endpoint images.
3. Give the Founder their absolute paths and the exact copy/paste prompt.
4. In Flow choose Veo 3.1 Lite, Frames to Video, first + last frame, 8 seconds,
   9:16 and exactly one result.
5. Download the result before starting the next interval.
6. Record charged credits, file path and any concrete defect.
7. Approve it or make one controlled repair. Do not change model, endpoints,
   prompt and camera simultaneously.
8. Continue in small sequential batches so continuity errors are caught early.

## 5. Approval criteria

For every clip check:

1. exact first-frame fidelity;
2. exact last-frame fidelity;
3. correct person count;
4. identity, clothing and prop continuity;
5. face, hand and body anatomy;
6. transition continuity;
7. natural restrained micro-movement;
8. camera and 2.5D style stability;
9. mobile-readable composition;
10. no visible speech, invented words, logo or UI.

## 6. Audio and assembly

1. Assemble P00, S clips and E01 at the locked timings.
2. Discard every generated clip-audio track.
3. Generate one clean Jon read per part with the locked voice ID, model and
   settings; retake only an individual line when needed.
4. Align narration without audible time-stretch.
5. Compose and mix one score across the whole film; it must not restart at clip
   boundaries.
6. Add restrained ambience and foley under narration and music.
7. Export the clean master, narration/score/foley stems, English SRT and WebVTT.

## 7. Stop rules

- Stop if the displayed generation price is not ten credits.
- Stop after two failures with the same cause; repair the endpoint or simplify
  the motion before spending again.
- Stop if a frame changes a locked identity, cast count, room geometry or truth
  boundary.
- Do not switch to Fast, Quality, OpenArt or another model in this pass without
  an explicit new Founder decision.
- Do not upload raw legal, tax, police, health-related or private email records
  to Flow.
- Do not publish externally from this workflow. The Founder performs or
  explicitly authorizes the upload.

## 8. Account note

The Hungary-based Flow interface previously showed the visible-watermark control
off by default, and the inspected download had no visible watermark. Recheck the
control and every final file. Invisible provenance marking may remain. Plan
terms, rights, prices and credit rules can change, so capture the account screen
before the production batch.
