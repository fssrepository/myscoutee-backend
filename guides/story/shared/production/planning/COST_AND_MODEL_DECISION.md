# Current cost and model decision

Date: **9 August 2026**  
Status: **credit-safe decision locked for the first production attempt**.

The detailed operating budget is maintained in
[`TWO_FILM_CREDIT_SAVER_PLAN.md`](TWO_FILM_CREDIT_SAVER_PLAN.md). This file keeps
only the model decision so an obsolete 23-shot or editor workflow cannot be
mistaken for the current plan.

## Decision

- Baseline motion model: **Google Flow Veo 3.1 Lite**, exact first + last frame,
  `8 s`, `9:16`, one result.
- No further model benchmark. Veo 3.1 Lite is the production model.
- Part I: 22 generated intervals = 220 Lite credits.
- Part II: 38 generated intervals = 380 Lite credits.
- Total base pass: 60 intervals = 600 credits.
- Observed balance: 970; planned reserve after base: 370.
- P00/E01 are deterministic post graphics and use no generation credits.
- No slideshow, animatic, midpoint frames, Extend chain, generated typography,
  lip sync or retained clip audio.
- Final conform, captions, continuous narration/score, ambience, foley and
  export use the CPU post workflow; DaVinci Resolve is not required.

## Purchase boundary

Do not buy or upgrade OpenArt for this production pass. Revisit it only for a
future remaster explicitly requested after these two films are complete.

Plan names, prices, credits, rights and watermark rules can change. Capture the
checkout and generation screens before spending.
