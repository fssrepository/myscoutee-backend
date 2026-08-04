# The City Between Us — production package

Status: **production concept and generation guide**, not a statement of user
traction, product-market fit, or production readiness.

Research and interface check: **2026-08-04**. OpenArt, Higgsfield, and Google
Flow change quickly. Before spending a large credit batch, generate one low-cost
test shot and confirm that the model/feature combination shown by the current UI
still matches this guide.

## Outcome

This directory specifies a complete 2 minute 48 second MyScoutee hero film:

- working title: **The City Between Us**;
- Hungarian title: **A város közöttünk**;
- master language: English, for an international operator/community audience;
- localized version: Hungarian voice-over and subtitles from the same picture;
- format: mobile-first 9:16 cinematic 2.5D animation with hand-drawn character treatment inside
  dimensional city sets;
- story: unstable work at home leads to months-long assignments across Europe,
  Asia and the Americas, away from family. After an anonymous inspection-day
  breaking point, one person chooses London to earn and save; five years of
  shared rooms, long workdays and careful spending buy back the time to build a
  future. Nearly forty countries still do not cure loneliness, so he comes home
  deliberately to look for a partner. After trying online and
  real-world routes, he recognizes the missing bridge between encounter and a
  meaningful shared meeting, gives that problem his full focus, builds
  MyScoutee, then invites local operators and communities to carry the next
  chapter;
- ending: constructive and confident — the core exists because the founder
  believes in it; a community product deserves more authors, not a lone hero.

The film does **not** claim that every app, class, event, or date fails. It does
not blame women or men. It shows two different scarcity problems: too little
attention and too much unmanageable attention. It presents group-first meetings
as an available, lower-pressure path, not as a guaranteed romantic result.

## Recommended production route

For the best cost/control balance, start with a single generation workspace:

1. Lock the story, voice and timing with [03_SCRIPT_EN_HU.md](03_SCRIPT_EN_HU.md).
2. Build the founder, supporting cast, locations, props and style frames from
   [02_CREATIVE_BIBLE.md](02_CREATIVE_BIBLE.md).
3. Make the full still animatic and the required moving shots in OpenArt from
   [prompts/openart-director-master.txt](prompts/openart-director-master.txt).
4. Assemble at 720×1280, voice, mix, brand, title and subtitle outside the generation tools. The
   master should not depend on generated on-screen text.
5. Buy/use Higgsfield only if an identity- or ensemble-critical OpenArt shot
   still fails after three controlled attempts.
6. Skip Google Flow by default. Use it only as a targeted transition/environment
   rescue when access, credits, watermark and release terms have been checked.

OpenArt-only, Higgsfield-only, and Flow-only variants are also documented. The
same approved assets and shot IDs work in every route. `SHOT_MANIFEST.csv`
contains the cost-recommended OpenArt/Resolve filenames; optional rescue files
may keep their platform name until they replace the matching Sxx shot.

## Files

| File | Use |
| --- | --- |
| [00_START_HERE_BEGINNER.md](00_START_HERE_BEGINNER.md) | One recommended beginner route from an empty folder to a playable, checked master |
| [01_PRODUCT_AND_RESEARCH.md](01_PRODUCT_AND_RESEARCH.md) | What MyScoutee actually does, why common meeting routes lose continuity, London/Budapest research, claim boundaries |
| [02_CREATIVE_BIBLE.md](02_CREATIVE_BIBLE.md) | Theme, audience, world, characters, look, light, camera, acting, recurring motifs |
| [03_SCRIPT_EN_HU.md](03_SCRIPT_EN_HU.md) | Time-coded English and Hungarian voice-over, diegetic dialogue, titles, subtitle rules |
| [04_STORYBOARD.md](04_STORYBOARD.md) | Complete shot-by-shot storyboard with blocking, camera, light, expression, sound and transition |
| [05_PROMPT_PACK.md](05_PROMPT_PACK.md) | Character/world prompts, continuity lock, negative constraints and per-shot prompts |
| [06_OPENART_WORKFLOW.md](06_OPENART_WORKFLOW.md) | Exact OpenArt Director/Storyboard workflow and paste map |
| [07_HIGGSFIELD_WORKFLOW.md](07_HIGGSFIELD_WORKFLOW.md) | Exact Cinema Studio, Elements, Mr. Higgs, model and camera workflow |
| [08_GOOGLE_FLOW_WORKFLOW.md](08_GOOGLE_FLOW_WORKFLOW.md) | Exact Flow asset, Ingredients, Frames, Veo and Scenebuilder workflow |
| [09_AUDIO_EDIT_DELIVERY.md](09_AUDIO_EDIT_DELIVERY.md) | Voice, music, SFX, edit, grade, subtitles, aspect ratios and exports |
| [10_PRODUCTION_CHECKLIST.md](10_PRODUCTION_CHECKLIST.md) | Asset intake, continuity, QA, claims, release and variant checklist |
| [11_COST_AND_MODEL_DECISION.md](11_COST_AND_MODEL_DECISION.md) | Current cost scenarios, exact model choices, purchase gates and the Flow/Higgsfield decision |
| [SOURCES.md](SOURCES.md) | Project evidence and external research/platform sources |
| [SHOT_MANIFEST.csv](SHOT_MANIFEST.csv) | Importable shot tracker with IDs, timings, cost-default platform/model and approved filenames |

The `prompts/` directory contains plain-text copy blocks. Do not edit a master
prompt for an individual shot; add the shot-specific block after the shared
continuity prefix so that global visual rules remain stable.

## The creative sentence

> A city can be full of people and still be missing the path between them.

The autobiographical hinges are:

> **Not for luxury. I was buying back my time.**
>
> **Nem a luxusért. Az időmet vásároltam vissza.**

> **I left home to make a living. I came home to find someone to live it with.**
>
> **Kimentem pénzt keresni. Hazajöttem társat keresni.**

## The product sentence

> MyScoutee turns editable 1–10 priorities and reciprocal/contextual evidence
> into weighted affinity, compatible small groups, and a workflow from chat to a
> shared real-world event and feedback.

## The operator sentence

> The core can be run by independent local operators who understand their own
> city, community, brand and partners; the next chapter needs more authors.

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
- Show the original logo briefly in S01 and fully in S23. Do not keep a permanent
  corner watermark through the emotional middle of the film.

## Master settings

| Setting | Master |
| --- | --- |
| Runtime | 02:48.000 |
| Frame rate | 24 fps constant |
| Raster | **720×1280 primary mobile master**; optional 1080×1920 only after a phone QA failure |
| Aspect | **9:16 portrait**; important faces/text stay clear of the top/bottom platform UI zones |
| Shutter language | natural 180-degree motion; no smeary low-shutter look |
| Dialogue | 48 kHz / 24-bit WAV, mono voice stems |
| Mix | 48 kHz / 24-bit stereo master plus separate M&E and dialogue stems |
| Loudness | platform master around -14 LUFS integrated, true peak ≤ -1 dBTP; keep a -16 LUFS alternate |
| Captions | English and Hungarian SRT plus textless clean master |
| Accessibility | never rely on color alone; captions identify off-screen dialogue and key sound cues |

Cost rule: storyboard stills first, motion draft second, approved 720p final
third. Never render the whole film on all three platforms and never upscale just
because a larger number is available. On the intended phone/platform, 720×1280
is the acceptance target.

## First action

If this is your first AI video, begin with
[00_START_HERE_BEGINNER.md](00_START_HERE_BEGINNER.md), then use
[11_COST_AND_MODEL_DECISION.md](11_COST_AND_MODEL_DECISION.md) before buying a
subscription. Do not generate video first. Record a rough English voice track, place the 23
shot durations from `SHOT_MANIFEST.csv` on a timeline, and use still frames for
an animatic. If the return at **01:06–01:13**, the product turn at
**01:53–02:09**, or the operator invitation at **02:32–02:48** does not land in
the animatic, fix the edit before buying
high-quality generations.
