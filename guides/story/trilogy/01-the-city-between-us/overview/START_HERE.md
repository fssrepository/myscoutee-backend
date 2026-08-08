# Start here — complete production route

This is the recommended path to a playable **03:00 English-language product
film** without depending on a supported editing GPU:

> **Closed book and prompts → one difficult scene → two exact 9:16 endpoints →
> identical cross-model stress test → selective motion generation → time-coded voice-over
> and one continuous score → CPU FFmpeg assembly and mobile QA.**

Do not generate the whole film on every platform. Spend credits only after the
current approval gate has passed.

## 1. Final delivery target

```text
DELIVERY/
  TCBU_master_EN_720x1280.mp4
  TCBU_clean_textless_720x1280.mp4
  TCBU_EN.srt
  TCBU_dialogue_EN.wav
  TCBU_music_and_effects.wav
  assembly-manifest.json
```

Required technical properties:

- exact duration: `03:00.000`;
- raster and aspect ratio: `720×1280`, `9:16`;
- constant `24 fps`;
- H.264 video, AAC audio at `48 kHz`;
- picture and sound begin immediately;
- no generated typography, unreadable UI, redraw of the brand mark or accidental
  clip-by-clip music;
- the exported file plays from beginning to end on the target phone.

## 2. Read these sources first

1. [Part overview](README.md)
2. [Locked English script](../film/SCRIPT.md)
3. [Storyboard](../storyboard/STORYBOARD.md)
4. [Shared two-film credit-saver plan](../../../shared/production/planning/TWO_FILM_CREDIT_SAVER_PLAN.md)
5. [Production checklist](../production/PRODUCTION_CHECKLIST.md)

Use [the current handoff](../production/handoff/CURRENT.md) when resuming an
active production session. The handoff routes to the smallest additional file
set needed for the current task.

## 3. Credit and approval ladder

| Gate | Output | Spend rule | Approval condition |
| --- | --- | --- | --- |
| 0 | published book, script and prompt closure | no video credits | written package is synchronized |
| 1 | six-person character benchmark | one image per eligible model | exactly three women and three men; six distinct, appealing identities |
| 2 | locked character and world sheets | still-image credits only | recurring faces, clothes, props and locations approved |
| 3 | regenerated CP18 and CP19 | cheapest approved still route | both frames use the same six locked identities |
| 4 | CP18→CP19 video benchmark | one result per comparable model | blind score recorded; winning model chosen by shot type |
| 5 | selective motion production | one result on first attempt | only motion-critical scenes are generated |
| 6 | picture lock and audio | no speculative video retries | timing, narration and score approved |
| 7 | final CPU assembly | local processing | desktop and phone QA pass |

Never change model, prompt, reference frame and camera instruction in the same
retry. Record one concrete fault first. After two repetitions of the same fault,
simplify the shot, change model or solve it in post.

## 4. Working directory

Keep production media outside the source repository when it becomes large:

```text
TCBU_PRODUCTION/
  01_SCRIPT_AND_TIMING/
  02_CHARACTER_TESTS/
  03_LOCKED_REFERENCES/
  04_SCENE_STILLS/
  05_VIDEO_TESTS/
  06_APPROVED_MOTION/
  07_VOICE/
  08_SCORE_AND_SOUND/
  09_ASSEMBLY/
  10_EXPORTS/
  11_LICENSES_AND_CONSENT/
```

Use stable filenames containing the shot, platform, model and version. Do not
delete a generated test before its cost, settings, score and hash have been
recorded.

The only approved brand source is
`frontend/src/assets/logo/heart.png`. Keep it unmodified and add `MyScoutee` as
separate editable text in post.

## 5. Select the first model benchmark

1. Read the closed English narration, storyboard and prompt pack.
2. Select one interval whose people, staging, transformation and endpoint
   continuity will expose meaningful model differences.
3. Generate exactly its two 9:16 endpoint frames.
4. Use those same frames, the same prompt and the same eight-second duration in
   Google Flow and OpenArt.
5. Record model, settings, credits and visible failure modes before choosing a
   production route.

There is no slideshow or animatic stage and no generated midpoint image.

## 6. Character benchmark before video

Use exactly the same prompt and one output per eligible image model:

- prompt:
  [character-model-benchmark-six-person-ensemble.txt](../../../shared/benchmarks/prompts/character-model-benchmark-six-person-ensemble.txt);
- format: one `9:16` image in a `2×3` portrait layout;
- cast: exactly three women and three men;
- no prompt enhancement, automatic polish or added style preset;
- score sheet:
  [CHARACTER_BENCHMARK_LOG.csv](../../../shared/benchmarks/tracking/CHARACTER_BENCHMARK_LOG.csv).

Score distinct identity, warmth, agency, age and cultural variety, facial and
hand anatomy, clothing individuality, balanced visual weight and compatibility
with the painterly cinematic 2.5D world. Hide model names during the first visual
score.

Only after the winning design is chosen should recurring characters receive
front, three-quarter, profile, full-body, seated and expression references. Do
not consume trained-character slots on one-scene background figures.

## 7. Regenerate the benchmark endpoints

Rebuild `CP18.png` and `CP19.png` from the same six locked character references.
The two frames must preserve:

- the same six faces, ages, body proportions, clothing and personal props;
- exactly three women and three men;
- the painterly cinematic 2.5D treatment;
- a readable transition from separate inner expectations to a real shared
  meeting;
- no logo, generated UI text or disability pictogram used as generic diversity.

Do not begin the video-model comparison with identities that will later be
replaced.

## 8. Run one reusable video stress test

Test `CP18 → CP19`, exactly eight seconds, `9:16`, one output per model. Use
[the locked benchmark prompt](../../../shared/benchmarks/prompts/model-benchmark-cp18-cp19.txt).

Keep these conditions identical:

- exact first and last PNG;
- duration, aspect ratio and resolution;
- prompt and output count;
- no prompt rewriting, Extend, extra reference or automatic background music;
- audio excluded from the visual score.

The test must expose identity retention, six-person counting, face and hand
anatomy, natural eye contact, micro-acting, spatial continuity, endpoint fidelity
and style stability. Record results in
[MODEL_BENCHMARK_LOG.csv](../../../shared/benchmarks/tracking/MODEL_BENCHMARK_LOG.csv).

A successful benchmark result is a candidate final shot, not disposable test
material.

## 9. Produce only the motion the story needs

Classify every shot:

- **A — post or inexpensive:** environment, object, travel still, UI, logo,
  restrained pan/zoom;
- **B — normal motion:** one or two people, walking, a simple interaction or
  moderate transition;
- **C — hero/rescue:** identity-critical ensemble, complex endpoint transition
  or one indispensable visible spoken line.

Use stills and CPU post for stable graphics, travel memories, accurate UI,
titles and the brand card. Keep hero generations rare. Do not upscale a broken
face, hand, story or title.

## 10. Audio after picture lock

The default is narration, not lip sync:

1. generate or record the final English voice in time-coded blocks;
2. normalize every block to `48 kHz` WAV;
3. generate one continuous instrumental score for the entire film from the
   locked emotional time map;
4. mute all accidental clip-level music and generated dialogue;
5. retain clean synchronized ambience only when it can be separated reliably;
6. place doors, keys, steps, trains, paper and keyboard foley on exact frames;
7. overlap ambience across visual transitions by roughly `0.3–0.8 s`.

Lip sync is reserved for at most one or two short hero moments. Generate the
final spoken audio first and supply that exact file to the selected model.

## 11. CPU assembly

The FFmpeg assembly owns:

- source ordering and frame-accurate trims;
- `720×1280`, constant `24 fps` normalization;
- original logo, exact UI plates, title and subtitles;
- narration, ambience, foley and score stems;
- music ducking beneath narration;
- approximately `-14 LUFS` integrated loudness and no more than `-1 dBTP`;
- H.264/AAC export plus a clean textless master;
- full decode verification.

Kdenlive may be used as an optional visual interface with 720p proxies, but the
pipeline must not depend on DaVinci Resolve or a supported GPU.

## 12. Stop-ship check

Do not publish if any of these remain:

- a face swap, merged person, disappearing participant or severe anatomy fault;
- false chronology, unconfirmed destination or identifiable private address;
- a gender-blaming, age-erasing or nationality-stereotyping frame;
- generated nonsense text or an altered MyScoutee mark;
- a public human score, guaranteed match, guaranteed safety, traction, revenue
  or proven-outcome claim;
- clipped or unsynchronized narration, score changes at every edit, or silence
  caused by a missing audio block;
- unreadable mobile composition or subtitles hidden by platform UI;
- an MP4 that does not decode and play completely on both desktop and target
  phone.

Return to the earliest failed approval gate and correct only the affected asset
or shot.
