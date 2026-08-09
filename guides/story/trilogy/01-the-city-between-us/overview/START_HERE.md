# Start here — complete production route

This is the recommended path to a playable **03:12 English-language product
film** without depending on a supported editing GPU:

> **Closed book and prompts → exact 9:16 endpoint pairs → Veo 3.1 Lite motion generation → time-coded voice-over
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

- exact duration: `03:12.000`;
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
| 1 | locked character and world sheets | still-image credits only | recurring faces, clothes, props and locations approved |
| 2 | next scene's exact two endpoints | approved still route | both frames obey the locked cast and location contract |
| 3 | Veo 3.1 Lite production clip | one eight-second result | endpoints, identity, motion and continuity approved |
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

## 5. Produce exact endpoint pairs

For each interval, read its narration, storyboard and shot prompt. Generate or
approve exactly two 9:16 endpoint images. Preserve every recurring face, age,
body proportion, costume and prop; the product group remains exactly three
women and three men. Never generate typography, UI or a substitute logo.

There is no slideshow, animatic, model comparison or generated midpoint image.

## 6. Generate with Veo 3.1 Lite

For each approved pair:

1. upload the exact first and last PNG in Google Flow;
2. select Veo 3.1 Lite, Frames to Video, 8 seconds, 9:16, one result;
3. paste the continuity prefix, matching Sxx prompt and silent-picture lock;
4. download and inspect the clip before continuing;
5. record the ten-credit charge and any concrete defect;
6. approve or make one controlled repair, then move to the next interval.

## 7. Produce only the motion the story needs

Classify every shot:

- **A — post or inexpensive:** environment, object, travel still, UI, logo,
  restrained pan/zoom;
- **B — normal motion:** one or two people, walking, a simple interaction or
  moderate transition;
- **C — hero/rescue:** identity-critical ensemble or complex endpoint
  transition.

Use stills and CPU post for stable graphics, travel memories, accurate UI,
titles and the brand card. Keep hero generations rare. Do not upscale a broken
face, hand, story or title.

## 8. Audio after picture lock

The audio route is narration without lip sync:

1. generate or record the final English voice in time-coded blocks;
2. normalize every block to `48 kHz` WAV;
3. generate one continuous instrumental score for the entire film from the
   locked emotional time map;
4. mute all accidental clip-level music and generated dialogue;
5. retain clean synchronized ambience only when it can be separated reliably;
6. place doors, keys, steps, trains, paper and keyboard foley on exact frames;
7. overlap ambience across visual transitions by roughly `0.3–0.8 s`.

No character dialogue or lip sync is generated. Jon carries the only spoken
voice; interaction remains nonverbal.

## 9. CPU assembly

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

## 10. Stop-ship check

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
