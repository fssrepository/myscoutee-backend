# The City Between Us — production package

Series position: **MyScoutee — The Story · Part I**. This entire directory is
the independent book, video, storyboard, prompt, asset and render package for
the trilogy's first part. The [series hub](../../../README.md) is at the story
package root.

Status: **production concept and generation guide**, not a statement of user
traction, product-market fit, or production readiness.

Research and interface check: **2026-08-07**. OpenArt, Higgsfield, and Google
Flow change quickly. Before spending a large credit batch, generate one low-cost
test shot and confirm that the model/feature combination shown by the current UI
still matches this guide.

## Outcome

This directory specifies a complete 3 minute MyScoutee hero film:

- working title: **The City Between Us**;
- master language: English, for an international operator/community audience;
- format: mobile-first 9:16 cinematic 2.5D animation with hand-drawn character treatment inside
  dimensional city sets;
- story: a Founder with rural small-producer roots finishes university in 2004
  after studies joining economics, programming and mathematics. A delayed
  dissertation makes 2005 the earliest possible diploma year, while one missing
  language certificate delays actual receipt considerably longer. He reaches
  beautiful Budapest.
  Even professional work leads through a workers' hostel and unstable rooms before
  his parents help him secure a flat and avoid the foreign-currency-mortgage
  route. After the American work-pressure and health threshold, he goes to
  London in 2011, receives medical care, and finds work within two weeks despite weak English,
  works as a programmer in a multicultural Soho office and hides hunger and
  isolation behind a competent public self. He briefly takes the Victoria line home to a converted
  Victorian HMO in Tottenham. The Founder and twelve other Hungarian adults
  share one full bathroom and a separate WC; he also shares his bedroom. London
  outside the house remains culturally expansive. The rent saved by sharing
  pays for low-cost journeys and builds savings. By December 2015, the savings
  mean financial independence in lower-cost Budapest, where the flat his parents
  helped provide has stood empty through the London years, but never in London.
  Normal London housing would erode that position; permanent room-sharing is no
  longer viable, so housing becomes his stop-loss.
  Nearly forty countries still do not cure
  loneliness, so he comes home
  deliberately to look for a partner. After trying online and
  real-world routes, he recognizes the missing bridge between encounter and a
  meaningful shared meeting. He sees that screens encourage verdicts before
  people gain common human context. Budapest-cost financial independence gives
  him sustained work periods that ordinary employment would not have left; later
  AI assistance accelerates implementation. He gives the problem his full focus
  and builds MyScoutee as a full relationship-lifecycle and event system. Technically
  capable local operators can test the shared core under their own brands and
  cultural contexts while cooperating through a voluntary server network;
- ending: constructive and accountable — the product follows strangers from
  editable priority through group, chat and a first event; after meeting they
  can be invited again, repeated events can form community, and later priority
  changes alter the chance of meeting again. The core then passes through one
  verified technical handoff rather than indiscriminate distribution.

The film does **not** claim that every app, class, event, or date fails. It does
not blame women or men. It shows two different scarcity problems: too little
attention and too much unmanageable attention. It presents group-first meetings
as an available, lower-pressure path, not as a guaranteed romantic result.

## Public story book

The English-first memoir and product-origin companion is **MyScoutee — The
Story**, Part **I** of the planned trilogy, with **The City Between Us** as its
literary subtitle. The current artifact is **Public edition v1.0.0**, published
7 August 2026 and still editable until the Founder explicitly locks it. Its cover uses
the same wordmark contract as the official manuals: the original mark replaces
the initial `M`, followed only by `yScoutee`. It never displays the mark beside
the complete word and never duplicates the `M`.

- [English manuscript](../book/THE_CITY_BETWEEN_US_PUBLIC_EDITION_EN.md)
- [book build and illustration contract](../book/README.md)
- [book version source](../book/version.json)
- [book document metadata](../book/metadata.json)
- [book changelog](../book/CHANGELOG.md)
- [browser edition](../book/MYSCOUTEE_THE_STORY_PUBLIC_EDITION_EN.html)
- [current editable v1.0.0 PDF](../book/draft/MyScoutee_The_Story_Part_I_The_City_Between_Us_v1.0.0_EN.pdf)
- [flat published-artifact contract](../published/README.md) — no sealed PDF
  exists until the Founder explicitly locks an edition

The public edition is complete without generated imagery. Optional side-column
portraits, portrait grids and wide character montages are already wired into
the build and appear after the character benchmark locks the identities. The
montage and separate portraits must come from the same character references.

## Recommended production route

For the best cost/control balance, use the benchmark-first hybrid route:

1. Lock the story, voice and timing with [SCRIPT.md](../film/SCRIPT.md).
2. Follow the purchase gates and credit limits in
   [TWO_FILM_CREDIT_SAVER_PLAN.md](../../../shared/production/planning/TWO_FILM_CREDIT_SAVER_PLAN.md).
3. Run the identical six-person character benchmark first and record every
   result in [the character benchmark log](../../../shared/benchmarks/tracking/CHARACTER_BENCHMARK_LOG.csv).
4. Lock the six identities, then compare Flow and OpenArt on the regenerated
   CP18→CP19 stress shot and record every result in
   [the model benchmark log](../../../shared/benchmarks/tracking/MODEL_BENCHMARK_LOG.csv).
5. Build and approve the founder, supporting cast, locations, props and style frames from
   [the creative bible](../film/CREATIVE_BIBLE.md).
6. Make one scene-duration animatic, then generate each required moving shot
   only on its selected model.
7. Assemble at 720×1280 with CPU FFmpeg: picture, voice, one continuous score,
   foley, brand, title and subtitles. The
   master should not depend on generated on-screen text.
8. Buy/use Higgsfield only if an identity- or ensemble-critical winning-platform shot
   still fails after three controlled attempts.

OpenArt-only, Higgsfield-only, and Flow-only variants are also documented. The
same approved assets and shot IDs work in every route. `SHOT_MANIFEST.csv`
contains the cost-recommended source filenames; optional rescue files
may keep their platform name until they replace the matching Sxx shot.

## Files

| File | Use |
| --- | --- |
| [START_HERE.md](START_HERE.md) | One recommended route from an empty folder to a playable, checked master |
| [PRODUCT_AND_RESEARCH.md](../../../shared/research/PRODUCT_AND_RESEARCH.md) | Shared product truth, meeting-path context, research and claim boundaries |
| [CREATIVE_BIBLE.md](../film/CREATIVE_BIBLE.md) | Theme, audience, world, characters, look, light, camera, acting and motifs |
| [SCRIPT.md](../film/SCRIPT.md) | Time-coded English narration, dialogue, titles and subtitle rules |
| [STORYBOARD.md](../storyboard/STORYBOARD.md) | Shot-by-shot blocking, camera, light, expression, sound and transition |
| [PROMPT_PACK.md](../prompts/PROMPT_PACK.md) | Character/world prompts, continuity lock, negative constraints and shot prompts |
| [OPENART.md](../../../shared/production/workflows/OPENART.md) | Shared OpenArt Director/Storyboard workflow and Part I paste map |
| [HIGGSFIELD.md](../../../shared/production/workflows/HIGGSFIELD.md) | Shared Cinema Studio, Elements, Mr. Higgs, model and camera workflow |
| [GOOGLE_FLOW.md](../../../shared/production/workflows/GOOGLE_FLOW.md) | Shared Flow asset, Ingredients, Frames, Veo and Scenebuilder workflow |
| [AUDIO_EDIT_DELIVERY.md](../film/AUDIO_EDIT_DELIVERY.md) | Current CPU audio, edit, brand, subtitle and delivery specification |
| [PRODUCTION_CHECKLIST.md](../production/PRODUCTION_CHECKLIST.md) | Asset, continuity, claim, release and mobile-QA checks |
| [COST_AND_MODEL_DECISION.md](../../../shared/production/planning/COST_AND_MODEL_DECISION.md) | Shared historical cost scenarios, model choices and purchase gates |
| [TWO_FILM_CREDIT_SAVER_PLAN.md](../../../shared/production/planning/TWO_FILM_CREDIT_SAVER_PLAN.md) | Shared two-film benchmark, credit, character, audio and CPU-post plan |
| [STANDALONE_FILM_AND_SEQUEL_BRIDGE.md](../film/STANDALONE_FILM_AND_SEQUEL_BRIDGE.md) | Film 1 boundary and future Film 2 handoff |
| [STORY_AND_PROMPT_COVERAGE.md](../production/STORY_AND_PROMPT_COVERAGE.md) | Canonical coverage map across book, film, prompts, evidence and future work |
| [TODO.md](../production/TODO.md) | Narrative-first approval gate and all deferred generation work |
| [THE_CITY_BETWEEN_US_PUBLIC_EDITION_EN.md](../book/THE_CITY_BETWEEN_US_PUBLIC_EDITION_EN.md) | English first-person public book |
| [book build contract](../book/README.md) | Reproducible PDF build, wordmark and optional illustration contract |
| [character benchmark log](../../../shared/benchmarks/tracking/CHARACTER_BENCHMARK_LOG.csv) | Comparable character-model cost and visual scoring |
| [model benchmark log](../../../shared/benchmarks/tracking/MODEL_BENCHMARK_LOG.csv) | Comparable model settings, charged credits and blind scores |
| [SOURCES.md](../research/SOURCES.md) | Project evidence and external research/platform sources |
| [SHOT_MANIFEST.csv](../production/tracking/SHOT_MANIFEST.csv) | Importable shot tracker with IDs, timings and approved filenames |

Planned static review animatic after narrative approval:

- `storyboard/animatics/myscoutee-storyboard-v01-checkpoint-hold-720x1280.mp4`
  uses only the
  24 true CP00–CP23 generation boundaries. Each interior checkpoint combines
  half of the preceding shot and half of the following shot, so most frames hold
  for roughly seven to eight seconds while the complete film remains exactly
  03:00. The build script is ready, but the render remains deliberately deferred
  until the Founder has reviewed and approved the book and synchronized prompts.

The `prompts/` directory contains plain-text copy blocks. Do not edit a master
prompt for an individual shot; add the shot-specific block after the shared
continuity prefix so that global visual rules remain stable.

Current standalone planning prompts:

- [six-person character model benchmark](../../../shared/benchmarks/prompts/character-model-benchmark-six-person-ensemble.txt);
- [Hungarian origin, workers'-hostel and Budapest housing memory board](../prompts/hungarian-origin-rural-budapest-memory-board.txt);
- [first Budapest attempt and reimbursed interview journeys memory board](../prompts/budapest-first-attempt-and-interview-journeys-memory-board.txt);
- [cornfield-to-Trivandrum first assignment and practical-English memory board](../prompts/cornfield-to-trivandrum-first-assignment-memory-board.txt);
- [pre-London work breakdown, unemployment and rapid London entry memory board](../prompts/pre-london-work-breakdown-and-exit-memory-board.txt);
- [United States assignment, borrowed-home and work-pressure memory board](../prompts/united-states-assignment-dream-and-pressure-memory-board.txt);
- [Budapest relationships before and during London, plus acceptance memory board](../prompts/budapest-before-london-relationship-memory-board.txt);
- [2017 photograph, date and unfinished-return memory board](../prompts/budapest-2017-photo-match-and-unfinished-return-memory-board.txt);
- [twelve-flatmate Hungarian HMO character board](../prompts/london-hmo-residents-character-board.txt);
- [dense five-year London sequence](../prompts/london-five-year-dense-sequence.txt);
- [UK adventure and availability memory board](../prompts/uk-adventure-availability-memory-board.txt);
- [six-day Egypt human-network memory board](../prompts/egypt-six-day-human-network-memory-board.txt);
- [India 2016 human-bridge memory board](../prompts/india-2016-human-bridge-memory-board.txt);
- [Thailand/Cambodia human-bridge memory board](../prompts/thailand-cambodia-human-bridge-memory-board.txt);
- [Russia arrival human-bridge memory board](../prompts/russia-arrival-human-bridge-memory-board.txt);
- [European wonder and empty-capacity memory board](../prompts/europe-wonder-empty-capacity-memory-board.txt);
- [Central-European one-day bus and localization memory board](../prompts/central-europe-one-day-bus-localization-memory-board.txt);
- [Istanbul–Dubai hospitality memory board](../prompts/istanbul-dubai-hospitality-memory-board.txt);
- [human-bridge product lifecycle](../prompts/product-human-bridge-lifecycle-sequence.txt).

## The creative sentence

> A city can be full of people and still be missing the path between them.

The autobiographical hinges are:

> **The shared room paid for journeys and a Budapest exit. The hunger stayed hidden.**

> **I went out to make a living. I came home to find a partner.**

## The product sentence

> MyScoutee turns private editable 1–10 priorities and reciprocal/contextual
> evidence — including real people, places or events in common — into balanced
> groups of strangers, carries them through chat and a managed real-world event,
> then lets the resulting contacts meet again and evolve. Shared context is not
> a public rating, endorsement or guarantee.

## The operator sentence

> Technically capable operators can run the shared core on independent local
> servers under their own brands, test it across different communities and
> cultures, and cooperate through a voluntary network/virtual enterprise with
> opt-out — addressing the same unsolved relationship-to-meeting problem without
> rebuilding the whole path alone.

Use “designed to,” “can,” and “operator model” where the result is a product
intent rather than established market evidence. Never say that MyScoutee has
proven superior matching, solved loneliness, produced revenue, or guaranteed a
safe or successful meeting.

## Non-negotiable creative boundaries

- The protagonist is persistent, observant and capable — never a defeated or
  resentful figure.
- Women and men are not opposing teams. Overload, scarcity, safety, time and
  ambiguity affect people differently.
- The dance scene is a personal memory: a busy beginner floor, a thin advanced
  class, and a boundary becoming clear when a partner arrives. No narrator
  universalizes this into a claim about women.
- Bad dates fail because the setting and format create friction: noise,
  performance pressure, travel, weather, cost or lack of an easy exit. The other
  person is never the punchline.
- A 1–10 priority is not a public human score. It is an editable, contextual
  signal of the user's own attention and intent.
- The group is a lower-pressure first context and a path to shared activity. It
  is not a compulsory group date and does not manufacture chemistry.
- Product UI shown in generated plates must be abstract. Capture the real UI or
  rebuild clean motion graphics in post; do not publish AI-generated gibberish.
- Use the unmodified original `frontend/src/assets/logo/heart.png`. It is the
  repository's high-resolution logo asset. Do not recolor, redraw, crop, glow or
  AI-regenerate it. Keep **MyScoutee** as separate editable text in post rather
  than creating a new combined bitmap.
- Show the original logo briefly in S01, at the common MyScoutee Network core in
  S22 and fully in S23. Do not keep a permanent corner watermark through the
  emotional middle of the film. The helmet–star–heart reading is visual intent,
  not a safety certification.

## Master settings

| Setting | Master |
| --- | --- |
| Runtime | 03:00.000 |
| Frame rate | 24 fps constant |
| Raster | **720×1280 primary mobile master**; optional 1080×1920 only after a phone QA failure |
| Aspect | **9:16 portrait**; important faces/text stay clear of the top/bottom platform UI zones |
| Shutter language | natural 180-degree motion; no smeary low-shutter look |
| Dialogue | 48 kHz / 24-bit WAV, mono voice stems |
| Mix | 48 kHz / 24-bit stereo master plus separate M&E and dialogue stems |
| Loudness | platform master around -14 LUFS integrated, true peak ≤ -1 dBTP; keep a -16 LUFS alternate |
| Captions | English SRT plus textless clean master |
| Accessibility | never rely on color alone; captions identify off-screen dialogue and key sound cues |

Cost rule: storyboard stills first, motion draft second, approved 720p final
third. Never render the whole film on all three platforms and never upscale just
because a larger number is available. On the intended phone/platform, 720×1280
is the acceptance target.

## First action

Open [TWO_FILM_CREDIT_SAVER_PLAN.md](../../../shared/production/planning/TWO_FILM_CREDIT_SAVER_PLAN.md), then
run the identical reference-free six-person prompt in Codex, Flow and any
OpenArt image model whose displayed one-image cost fits the remaining free
credits. Lock the six identities before regenerating CP18/CP19 or spending video
benchmark credits. After character and model lock, place the 23 actual shot
durations from `SHOT_MANIFEST.csv` on the scene-hold animatic and fix story
timing before bulk motion generation.
