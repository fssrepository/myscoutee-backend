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
- He arrived during the 2012 Diamond Jubilee and Olympic summer. Soho's
  international colleagues, culture, nightlife and dates keep the first three
  years magical; the Victoria line is only a brief connection, not a long scene.
- Thirteen Hungarian adults — the Founder plus twelve Hungarian flatmates —
  lived in a maintained but crowded Victorian HMO: one full bathroom, one
  separate WC (the “1.5 bathrooms” shorthand), and a shared bedroom. London
  outside the house remains visibly multicultural.
- One flatmate who had lost his gambling money swapped his place with an
  acquaintance; a different snore revealed the unannounced resident change. The
  housing absurdity is the joke, never debt or the person.
- Personal adventure memories include the one-pound overnight coach to
  Edinburgh, Loch Ness, a Glasgow/Clyde powerboat and the exact but exhausting
  London–Manchester–Liverpool–North Wales–Cardiff–London circuit. The wide
  low-tide village is probably Llanfairfechan but is not locked until the Founder
  recognizes it.
- Five years of work and careful saving bought financial independence and time
  for his own work. This is agency, not poverty spectacle.
- Nearly forty countries did not automatically remove solitude. He returned
  home deliberately to look for a partner.
- The six-day Egypt trip happened after the London homecoming. S08 therefore
  folds thematic memory through the notebook; it must not imply false chronology.
  Only the communal Luxor balloon/vegetable-plot landing is selected for the
  main travel burst. The full Cairo–Luxor–Aswan–Abu Simbel account remains in
  `prompts/egypt-six-day-human-network-memory-board.txt`.
- The Cairo airport-taxi encounter with the Sudanese married couple and falling
  roof luggage is the first alternate Egypt frame. Do not add it as a ninth
  travel image; choose between it and the balloon after still testing.
- The India/Taj Mahal, Thailand/Cambodia and Russia arrival memories are now
  archived as human-bridge boards. Only the reciprocal Taj bus conversation and
  a restrained Angkor tuk-tuk handoff enter the current S08 plan. The Russia
  arrival airport and the Thai Phi Phi departure pier remain `CONFIRM`.
  Thailand was a two-and-a-half-to-three-week multi-region journey, not a brief
  stop; Pattaya was a personally neutral/less enjoyable beat, and Phuket is the
  `PROBABLE` large southern island remembered above Phi Phi. Russia was a
  several-day Moscow–Saint Petersburg journey.
- The Italy, Paris, probable Norway in a Nutshell, Rotterdam ferry, Spanish
  hostel, four-day Porto–Lisbon, Istanbul–Dubai and Neuschwanstein memories form
  a candidate pool for the personal film. Do not expand the 2:48 hero cut for
  all of them. Test the empty
  ten-berth ferry cabin and empty beds as a visual alternative to one generic
  landscape plate.
- The flatmates and dates remain individual people, never faceless scenery or
  targets of blame.
- South Tottenham/Stamford Hill Charedi geography may be shown respectfully;
  the Founder's safety perception remains subjective and no religious community
  is credited with, blamed for or used to certify local safety.
- Brexit is temporal/emotional context about work and belonging, not a film
  claim that migrants displaced British workers or caused low wages.

## Product lifecycle lock

The product story must keep this order:

1. a private, editable 1–10 priority for an unknown person or pair;
2. people-in-common or inside/outside-network cues may add grounded context but
   never public ratings, vouching, character references or guarantees;
3. reciprocal choices plus context propose a balanced group of exactly six
   distinct strangers: three women and three men;
4. every invited person may accept or decline;
5. the accepted group receives contextual chat, then introduces itself in
   person and plans/manages its first real event;
6. the event uses four resource buckets — members, transport,
   accommodation/venue and supplies — while ticket, check-in and feedback stay
   separate;
7. after meeting, former strangers are known contacts who may be invited again;
8. when one person lacks time and declines, an open place may be offered through
   the priority plan, but the next invited adult decides independently;
9. repeated meetings may grow a community — community is an outcome, not the
   starting state;
10. relationships can change: lowering a private priority after conflict makes
   another shared path less likely, without public punishment or reputation
   damage.

Do not reduce this to affinity graphics, matching or “community already
exists.” Do not claim measured speed, guaranteed chemistry, superior matching,
traction, revenue or solved loneliness.

The human thesis is **context before verdict**. The network can preserve a
person, place, event or acquaintance in common and make an introduction less
cold. It cannot promise that the person is safe, compatible or good. The same
six identities must visibly progress through the whole path; the old static
four-card tableau is rejected.

## Operator-model lock

Technically capable local operators may run the shared core on independent
servers under their own brands and cultural contexts. They test locally while
cooperating through a voluntary server network/virtual enterprise with real
opt-out. The point is a shared efficient path toward the same unsolved
relationship-to-meeting problem, while preserving local authorship. Present
this as an intended operator model, not a proven live deployment or revenue
claim.

Composite the exact unmodified
`frontend/src/assets/logo/heart.png` at the common MyScoutee Network core in S22
and again in S23. Its helmet-like shelter, star and central heart may suggest
protection, direction and human connection, but are not a safety certification.

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
- The current rendered slideshow predates the new S02–S07 London-density and
  S08 folded-time Egypt beat and S16–S22 human-context/capacity rewrite. Do not
  present it as the updated story; regenerate only the affected checkpoint
  frames after character lock, then rebuild the slideshow once.

## Current production decision

- Google AI Pro and OpenArt Essential are the selected monthly test entry
  points. The binding credit and upgrade gates are in
  `12_TWO_FILM_CREDIT_SAVER_PLAN.md`.
- In the user's Hungarian Flow UI the visible-watermark option can be disabled
  and was off by default; the already reviewed downloaded clip had no visible
  watermark. Flow may therefore supply final shots. Check the option before
  every generation and inspect every full downloaded clip before acceptance.
  Do not reopen this question from generic Google Help alone; check again only
  if the account UI, option state or an actual downloaded output changes.
- Character design now precedes the video benchmark. Run the identical
  reference-free six-person prompt from
  `prompts/character-model-benchmark-six-person-ensemble.txt` in Codex, Flow
  and OpenArt, one output per model. The Codex control is already saved as
  `assets/character-benchmark/character-ensemble-control-codex-v01.png`.
- Use the current 18 free OpenArt credits only when the displayed one-image cost
  is no more than 18. Record the results in `CHARACTER_BENCHMARK_LOG.csv`.
- After choosing and locking all six identities, regenerate CP18 and CP19 from
  those exact character references. Only then run the 8-second Flow Lite, Fast
  and Quality video comparison for 130 credits.
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
