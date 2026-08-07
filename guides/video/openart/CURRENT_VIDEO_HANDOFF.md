# MyScoutee video — compact session handoff

Updated: 2026-08-07

This is the resume point for a fresh **MyScoutee video-only** session. It is
self-contained enough to avoid replaying the long chat. Load detailed files
only through the routes below.

## Scope

- Work only inside this video directory unless the user explicitly expands the
  task.
- Do not edit repository-level `AGENTS.md`, application code, QA handoffs,
  pitches or unrelated documentation.
- Preserve all pre-existing worktree changes. In particular, the current
  script, F45 review frame, slideshow render and slideshow build script already
  contain user-directed edits and must not be reset or overwritten blindly.

## Current film

- Working title: **The City Between Us / A város közöttünk**.
- Runtime: exactly 02:48.000; 720×1280, 9:16, constant 24 fps.
- Master language: English; Hungarian localization uses the same picture.
- Style: continuous mobile-first cinematic 2.5D journey, not a collection of
  unrelated scenes.
- `CP00` is the opening reference frame and `CP23` the deterministic branded end
  frame. Each interior checkpoint is both one interval's end and the next one's
  start, so a changed checkpoint normally requires only two adjacent motion
  intervals to be regenerated.
- The current review animatic is
  `renders/myscoutee-storyboard-v01-3s-720x1280.mp4`: 56 captioned slides ×
  3 seconds = 168 seconds. It is 720×1280 at 24 fps and has been rebuilt after
  the latest CP18–CP20 and product-caption changes.
- `assets/storyboard-rough/CP00.png`–`CP23.png` are planning checkpoints.
  CP00–CP22 use fictional identity placeholders; CP23 uses the real brand asset
  deterministically. `assets/storyboard-3s/F00.jpg`–`F55.jpg` are review frames,
  not additional generation checkpoints.

## Autobiographical truth lock

- The Founder already had a home. London saving was not for another home.
- Several kinds of instability pushed him out of his country; do not invent a
  named employer, raid, factory or generic worksite.
- He worked as a programmer in Soho and took the Victoria line home to
  Tottenham.
- Thirteen adults lived in a maintained but crowded Victorian HMO: one full
  bathroom, one separate WC (the “1.5 bathrooms” shorthand), and a shared
  bedroom.
- Five years of work and careful saving bought financial independence and time
  for his own work. This is agency, not poverty spectacle.
- Nearly forty countries did not automatically remove solitude. He returned
  home deliberately to look for a partner.
- The flatmates and dates remain individual people, never faceless scenery or
  targets of blame.

## Product lifecycle lock

The product story must keep this order:

1. a private, editable 1–10 priority for an unknown person or pair;
2. reciprocal choices plus context propose a balanced group of exactly six
   distinct strangers: three women and three men;
3. every invited person may accept or decline;
4. the accepted group receives contextual chat, then introduces itself in
   person and plans/manages its first real event;
5. the event uses four resource buckets — members, transport,
   accommodation/venue and supplies — while ticket, check-in and feedback stay
   separate;
6. after meeting, former strangers are known contacts who may be invited again;
7. open places may later be filled according to the priority plan;
8. repeated meetings may grow a community — community is an outcome, not the
   starting state;
9. relationships can change: lowering a private priority after conflict makes
   another shared path less likely, without public punishment or reputation
   damage.

Do not reduce this to affinity graphics, matching or “community already
exists.” Do not claim measured speed, guaranteed chemistry, superior matching,
traction, revenue or solved loneliness.

## Operator-model lock

Technically capable local operators may run the shared core on independent
servers under their own brands and cultural contexts. They test locally while
cooperating through a voluntary server network/virtual enterprise with real
opt-out. The point is a shared efficient path toward the same unsolved
relationship-to-meeting problem, while preserving local authorship. Present
this as an intended operator model, not a proven live deployment or revenue
claim.

## Current editorial checkpoint

- `03_SCRIPT_EN_HU.md` is the working narrative lock for this animatic, not a
  final picture/release lock.
- The latest product passage says the app follows a relationship through its
  whole life; priority/context form strangers into a group; they accept, chat
  and manage the first event; later invitations and repetition can grow a
  community; changed priority affects future meeting chance.
- CP18–CP20 and F44–F50 now show exactly six distinct adults, three women and
  three men, moving from separate expectations through first introductions to
  a shared event plan.
- The captions now distinguish the four event resources — members, transport,
  accommodation/venue and supplies — from ticket, check-in and feedback.
- The current review should be judged for clarity and pacing before replacing
  more images. Do not regenerate the whole storyboard. If a story point fails,
  identify the smallest checkpoint and its two adjacent intervals.

## Current production decision

- Google AI Pro and OpenArt Essential are the selected monthly test entry
  points. The binding credit and upgrade gates are in
  `12_TWO_FILM_CREDIT_SAVER_PLAN.md`.
- The controlled model comparison is CP18→CP19, 8 seconds, 9:16, exact first
  and last frame. Its immutable prompt is
  `prompts/model-benchmark-cp18-cp19.txt`.
- In Flow, run exactly one Veo 3.1 Lite, one Fast and one Quality result: 130
  credits total. Do not generate anything else before blind scoring.
- Record visible and charged cost plus the ten visual scores in
  `MODEL_BENCHMARK_LOG.csv`.
- Final narration, one continuous score per film, foley, captions and export use
  the CPU FFmpeg route. Resolve is not required on this machine.

## Minimal context routing

Do not preload the full 2,500-line production pack.

- To review the present story and wording: read `03_SCRIPT_EN_HU.md`, then only
  the relevant Sxx section in `04_STORYBOARD.md`.
- To verify product truth: read sections 1–2 of `01_PRODUCT_AND_RESEARCH.md`.
- To change a checkpoint: read `CHECKPOINT_CHAIN.md`, the relevant storyboard
  section and `assets/storyboard-rough/README.md`.
- To change review captions or rebuild the slideshow: read only
  `scripts/build_checkpoint_slideshow.sh`.
- To prepare generator prompts after story approval: read the matching shot in
  `05_PROMPT_PACK.md` plus the selected platform workflow.

## Media and cleanup rule

Keep CP00–CP23, F00–F55 and the single selected 02:48 review MP4. Do not commit
discarded image variants, rejected renders, duplicate exports or backup videos.
Keep filenames stable when regenerating a checkpoint. Do not delete the current
selected asset before its replacement has been reviewed.

## Working behavior for a fresh session

- First report the loaded checkpoint briefly; do not bluff from general app
  knowledge.
- Before a long render or image generation, tell the user what is starting and
  report back regularly.
- Generate/edit checkpoint-sized units, not a large image pack.
- Do not run the slideshow builder unless content actually changed and the user
  wants a rebuilt review export.
- Do not buy/use a platform or generate production motion before the animatic
  story and identity references are approved.

## Next decision

After the Google AI Pro checkout, capture the displayed 1,000-credit balance
and refill date. Upload CP18 as first frame and CP19 as last frame, paste the
benchmark prompt unchanged, and run Lite, Fast and Quality in that order. Stop
at 130 charged credits, download all three results with model-specific names,
then score them before any further generation.
