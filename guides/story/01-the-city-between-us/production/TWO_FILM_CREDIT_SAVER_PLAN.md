# Two-film credit-saver stress-test and production plan

Status: **current operating plan, 2026-08-07**.

This plan covers two separate `9:16` films of roughly `2:30–3:00` each:

1. the MyScoutee origin and product film;
2. a later personal documentary film with its own evidence package.

The purpose is not to generate every scene on every platform. First, compare
models with one difficult scene that can also become a final shot. Then spend
production credits only on the winning model or the best model for a documented
shot type.

Mandatory order:

> character-model benchmark → lock six identities → regenerate CP18 and CP19 →
> video-model stress test → selective motion production

Do not run a video benchmark with faces that will immediately be replaced.

## 1. Locked technical target

- aspect ratio: `9:16`;
- working raster: `720×1280`;
- constant `24 fps`;
- runtime per film: `150–180 s`;
- total two-film runtime: `300–360 s`;
- default generated motion unit: no more than `8 s`;
- narration: separately generated or recorded time-coded voice-over;
- music: one continuous master score per film;
- trim, subtitles, ducking, mix and export: CPU FFmpeg;
- DaVinci Resolve is excluded because this machine has no supported GPU.

If every second were AI video, the package would need roughly `38–45`
eight-second units. The actual target is lower: stable stills, travel memories,
logos, typography, accurate UI and simple graphics belong in post.

## 2. Subscription boundaries

Prices, model names, credits and usage rights change. The account checkout and
generation screen are authoritative at the moment of purchase. Capture the
price, credit balance, renewal date and displayed generation cost before any
paid batch.

### Google Flow

The selected Google AI Pro monthly plan showed a three-month promotional price
of about `HUF 2,190/month` and `1,000` monthly Flow credits. Create a reminder
before the higher fourth-month price begins.

The account screen observed these non-Ultra costs:

| Model | One 4/6/8-second generation |
| --- | ---: |
| Veo 3.1 Lite | 10 credits |
| Veo 3.1 Fast | 20 credits |
| Veo 3.1 Quality | 100 credits for 8 s |

Monthly credits do not roll over. The earlier daily free allocation is replaced
when the paid plan activates. Reference:
[Google Flow credit management](https://support.google.com/flow/answer/16526234).

Account-specific watermark observation: the visible watermark control was off
by default in the Founder's Hungary-based Flow interface, and the downloaded
control clip contained no visible watermark. Check the control before every
final generation and visually inspect every complete download. Invisible
SynthID may remain. Reopen this decision only if the interface, setting or an
actual new download changes. General reference:
[Google Flow access and watermark](https://support.google.com/flow/answer/16353333).

### OpenArt

The first purchase gate is the **4,000-credit monthly entry plan**, not an annual
plan. Different interfaces may call it Starter or Essential; identify it by the
monthly checkout total and the `4,000` credits.

Observed planning assumptions:

- listed price around `USD 14/month`;
- `4,000` credits per month;
- roughly `50` videos and `13` consistent characters according to the displayed
  plan description;
- access to premium image, video and audio models.

Treat this as a test and character-development package, not automatically as the
full budget for two finished films. If an OpenArt model clearly wins, the
`12,000`-credit Plus/Advanced monthly tier provides a safer retry and production
allowance. Confirm commercial-use wording at checkout before publishing.

OpenArt describes in-place upgrades as immediate and prorated. Capture balance
and billing date immediately before and after a `4k→12k` upgrade because the
displayed treatment of unused base credits may change. Monthly credits do not
roll over; add-on credits have separate conditions. References:
[OpenArt pricing](https://openart.ai/pricing) and
[OpenArt help](https://openart.ai/help).

## 3. One reusable video stress test

Run this only after the character test and approval of CP18 and CP19 rebuilt from
the locked six identities.

### Scene contract

**CP18 → CP19**, exactly `8 s`, `9:16`, first and last frame.

- first image: `assets/storyboard-rough/CP18.png`;
- last image: `assets/storyboard-rough/CP19.png`;
- prompt: `prompts/model-benchmark-cp18-cp19.txt`;
- exactly one result per model in the discovery round;
- no music, dialogue or narration;
- prompt rewrite, automatic polish, Extend and extra references disabled;
- identical PNGs, prompt, runtime, aspect ratio and output count.

The scene exposes:

- retention of exactly three women and three men;
- continuity of six distinct faces, clothes and body proportions;
- transformation from a portrait grid to a real meeting space;
- natural disappearance of thought bubbles;
- hands, eye contact and restrained ensemble acting;
- first- and last-frame fidelity;
- continuous spatial transition without a camera jump;
- painterly cinematic 2.5D style stability.

A successful test can become the final production shot.

### Flow order and hard cap

| Order | Model | Maximum |
| --- | --- | ---: |
| 1 | Veo 3.1 Lite | 10 credits |
| 2 | Veo 3.1 Fast | 20 credits |
| 3 | Veo 3.1 Quality | 100 credits |
| **Total** |  | **130 credits** |

After this comparison, at least `870` of the `1,000` credits must remain. Do not
add a fourth model, audio edition or automatic second variant. If the top two
are nearly tied, only those models may receive one controlled retry from the
separate retry allowance.

Do not include a model that cannot use the same first-plus-last-frame mode;
different input contracts do not make a clean model comparison.

### OpenArt order and hard cap

Only compare models that expose the same `start + end frame`, `8 s`, `9:16`,
`720p`, one-output contract in the live interface. Initial candidates:

1. the available Seedance 2.x model that supports the identical mode;
2. Kling 3.0;
3. Wan 2.7 only when the same mode is available.

Record the live credit price before pressing Generate. Reference:
[OpenArt video models](https://openart.ai/ai-model/?category=video).

Discovery cap:

- target no more than `600` credits from the `4k` entry plan;
- one output per model;
- if three comparable runs exceed the cap, run only Seedance and Kling;
- the third model runs only when the total still fits or an earlier result is
  technically unusable;
- no retry in the discovery round.

### Blind scoring

Score every result from `0–5` on:

1. endpoint fidelity;
2. retention of all six identities;
3. no added, missing, duplicated or merged person;
4. face, hand and body anatomy;
5. transition continuity;
6. natural micro-movement and acting;
7. camera stability;
8. 2.5D style stability;
9. mobile-readable composition;
10. usability without rescue post-production.

Hide model names for the first visual score and record the result in
[MODEL_BENCHMARK_LOG.csv](tracking/MODEL_BENCHMARK_LOG.csv).

## 4. Character test and identity lock

A platform Character feature preserves identity; it does not substitute for an
appealing character design. Character-model testing is separate from video-model
testing.

### Clean first comparison

- prompt:
  `prompts/character-model-benchmark-six-person-ensemble.txt`;
- one `9:16`, `2×3` portrait sheet;
- exactly three women and three men;
- prompt enhancement, automatic polish and style preset disabled;
- exactly one output per model;
- score sheet:
  [CHARACTER_BENCHMARK_LOG.csv](tracking/CHARACTER_BENCHMARK_LOG.csv);
- control image:
  `assets/character-benchmark/character-ensemble-control-codex-v01.png`.

The existing `18` free OpenArt credits are usable only if the live one-image
price beside Generate is `≤18`. Prioritize the strongest currently available
character-design model that fits the real budget. Run the identical prompt on
Flow's least expensive suitable image mode.

The first pass is one ensemble sheet. Do not train a model or generate every
view before a design wins.

### Final reference package

After choosing the winning design:

1. front, three-quarter, profile and full-body sheet;
2. seated and expression sheet;
3. locked face, hair, body proportions, clothing, personal prop and color code;
4. stable textless PNG exports;
5. consistent-character setup only for people returning in at least three
   shots;
6. regenerate CP18 and CP19 from those same six references;
7. begin the video benchmark only after both endpoints pass identity review.

Keep the total recurring trained cast for both films near `10–12`; one-scene
background figures use image references. Character-development cap before the
first approval gate: `250` credits from the entry plan.

## 5. Storyboard and animatic

The existing `56 × 3 s` slideshow is useful for caption and checkpoint review,
but it is not the primary picture animatic.

The production animatic uses:

- one still for each real Sxx scene;
- the true `4–12 s` duration in
  [SHOT_MANIFEST.csv](tracking/SHOT_MANIFEST.csv);
- exact total runtime `02:48.000`;
- no optical flow;
- at most a restrained `1–2%` pan or push;
- one scene caption, not a new card every three seconds.

The later film receives the same scene-hold treatment before any motion spend.
“About eight seconds per image” is a useful estimate; actual scene duration is
the timing authority.

## 6. Motion budget for both films

Classify each shot before generation.

### A — post or inexpensive

- environment, object, slow camera, still, graphic or travel montage;
- Flow Lite, inexpensive winning OpenArt model, or FFmpeg pan/zoom;
- target approximately `80%` of motion units.

### B — normal motion

- one or two people, walking, simple interaction or moderate transition;
- Flow Fast or the winning mid-range OpenArt model;
- target approximately `15%`.

### C — hero/rescue

- six-person ensemble, identity-critical face, complex endpoint transition or
  indispensable short lip sync;
- Flow Quality or the winning premium OpenArt model;
- target no more than `5%`, typically two hero shots across both films.

If all `45` possible units used Flow, the upper planning split would be:

| Type | Units | Credits each | Total |
| --- | ---: | ---: | ---: |
| Lite | 36 | 10 | 360 |
| Fast | 7 | 20 | 140 |
| Quality | 2 | 100 | 200 |
| **Production** | **45** |  | **700** |

Flow allowance:

- model comparison: `130`;
- controlled first production pass: no more than `700`;
- reserve: at least `170`;
- reserve increases when the successful stress-test shot enters the final edit.

The real generated-unit count must stay below `45`. Quality is not a bulk model:
an all-Quality pass would require roughly `3,800–4,500` credits.

The OpenArt `4k` tier can cover comparison, character development and a limited
rough pass but does not provide safe retry space for two finished films. If
OpenArt wins, bulk production begins only after an approved in-place upgrade.

## 7. Retry and stop rules

- one output on the first attempt;
- change only one of model, prompt, endpoint or camera at a time;
- write one concrete fault before retrying;
- no more than two attempts at the same fault on the same model;
- after that, switch model, simplify the shot or solve it in post;
- never use `1080p` or `4K` to repair a broken face, hand or story;
- upscale only an approved final clip;
- no lip sync, music, dialogue or automatic BGM during the visual benchmark;
- assign stable shot/model filenames immediately;
- preserve a test until its score and hash are recorded.

## 8. Narration, music and synchronization without Resolve

### Narration

Default: voice-over rather than lip sync.

- one consistent approved voice and performance direction per film;
- `10–25 s` time-coded blocks;
- `48 kHz` WAV;
- IN, visual HIT and OUT markers for every block;
- align with pauses and block position, not aggressive speech acceleration.

Confirm the live model, language support, terms and pricing before generation.
Do not treat a preview model name as permanently available.

### Lip sync

Use only when one visible short line is indispensable. Maximum one or two hero
shots across the package. Produce the final audio first and supply that exact
file as the selected model's audio reference. All other speech stays off-camera,
under reaction shots or in narration.

### Music

- one continuous instrumental score per film;
- generated only after picture lock;
- prompted with the complete time-coded emotional map;
- all clip-level generated music muted;
- no more than three score candidates per film;
- winning file normalized and trimmed to the exact film length by FFmpeg.

Confirm the current music model, rights and price before production rather than
hard-coding a temporary preview offering into the release decision.

### Diegetic sound

Default video prompt:

```text
Synchronized diegetic ambience and physical sounds only.
No music, dialogue, narration or singing.
```

Mute a native track when unwanted music cannot be isolated. Keep clean doors,
keys, steps, trains, paper or keyboard sound when useful; otherwise place
separate foley on the exact frame. Overlap ambience across scene boundaries by
roughly `0.3–0.8 s`.

### CPU assembly

FFmpeg owns:

1. clip order, trim and frame-accurate repair;
2. constant `24 fps`, `720×1280` normalization;
3. original logo, exact UI plates, titles and subtitles;
4. narration, ambience, foley and score stems;
5. music ducking under narration;
6. approximately `-14 LUFS` integrated and no more than `-1 dBTP`;
7. branded English, English SRT and clean textless export;
8. H.264/AAC `48 kHz` final MP4;
9. full decode and phone QA.

Kdenlive is optional for visual review. Production does not depend on Resolve or
a supported GPU.

## 9. Purchase and production gates

### Gate 0 — character-model test

- confirm the Google AI Pro monthly checkout, `1,000` credits and refill date;
- set a renewal reminder before the promotion ends;
- run the identical one-image character prompt on the eligible control, Flow
  and OpenArt models;
- use an OpenArt free generation only when the displayed cost is `≤18`;
- blind-score the character sheets and shortlist the six identities;
- generate no video before this decision.

### Gate 1 — OpenArt 4k monthly entry plan

- monthly, not annual; identify by `4,000` credits;
- capture price, credit balance and renewal date;
- identical CP18→CP19 comparison, no more than `600` credits;
- character test and first shortlist, no more than `250` credits;
- no full-film generation.

### Gate 2 — model and character lock

- blind score complete;
- recurring characters and world/style references approved;
- CP18 and CP19 rebuilt from the same six characters;
- Flow Lite, Fast and Quality CP18→CP19 runs complete within `130` credits;
- winning model recorded by shot type;
- scene-hold animatic and narration locked for each film;
- every shot assigned to A, B or C.

### Gate 3 — production purchase

- if Flow wins, use the existing Pro allowance for hybrid production;
- verify the visible-watermark control and every complete Flow download;
- if OpenArt wins, approve the in-place `4k→12k` upgrade before bulk production;
- if results are mixed, use Flow for the inexpensive base and OpenArt only for
  documented hero or rescue shots;
- neither platform receives an automatic second pass for every shot.

### Gate 4 — picture lock and audio

- picture duration and edit locked;
- final narration blocks generated or recorded;
- no more than three continuous-score candidates per film;
- FFmpeg mix, subtitle, brand and export complete;
- only shot-level corrections after phone QA.

## 10. Decision summary

- Google AI Pro is a cost-effective `1,000`-credit Flow test and hybrid base,
  but Quality cannot be used for bulk production.
- OpenArt's `4k` monthly entry level is the low-risk comparison and character
  tier. Upgrade only if its comparable video model produces a material visual
  advantage.
- The observed Hungary-based Flow account allowed the visible watermark to stay
  disabled, and the downloaded control clip showed none; verify both facts on
  every future final output.
- Approve characters before videos. Expensive models refine a shortlist rather
  than inventing production identities repeatedly.
- Use a real scene-duration animatic instead of treating the three-second review
  slideshow as the timing master.
- Default audio is voice-over, one continuous score and separate foley, not
  per-clip music or widespread lip sync.
- FFmpeg provides the precise GPU-independent assembly and delivery route.
