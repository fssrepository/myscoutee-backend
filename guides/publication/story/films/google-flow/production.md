# Google Flow workflow — locked Veo 3.1 Lite route

Scope: active motion-production playbook for Parts I and II. The books, scripts,
storyboards and shot prompts remain the story authority.

Production lock, 9 August 2026:

- model: **Veo 3.1 Lite**;
- mode: **Frames to Video with exact first and last frames**;
- duration: **8 seconds**;
- aspect and delivery: **9:16**, conformed to `720×1280`, constant `24 fps`;
- output count: **one result per approved attempt**;
- spoken voice: **Jon — Warm & Grounded Storyteller**, added later in post;
- no benchmark, Fast/Quality comparison, Extend, slideshow, animatic, lip sync
  or clip-level score.

The live Flow panel is authoritative only for whether the locked setting remains
available and what it charges. A UI change does not authorize a model switch.

## 1. Projects and collections

Use separate Flow projects for the two parts:

```text
TCBU_Part_I_9x16_720p
TSBU_Part_II_9x16_720p
```

Suggested collections:

- `01_Characters`
- `02_Worlds`
- `03_Approved_Frames`
- `04_Approved_Video`

Save only approved references with stable role or checkpoint names. Do not
upload raw tax, police, court, health-related or private correspondence.

## 2. Input authority

For every interval read exactly four local sources:

1. the matching time window in the part's `film/SCRIPT.md`;
2. the matching Sxx section in `storyboard/STORYBOARD.md`;
3. the part's `prompts/continuity-prefix.txt`;
4. the matching block in `prompts/shot-prompts.txt`.

The numbered frames are the visual authority. Generated words, UI, dates,
logos and legal pages are never authoritative and are replaced with editable
post graphics.

## 3. Exact copy/paste operation

For one approved interval:

1. Open **Video → Frames**.
2. Select **Veo 3.1 Lite**.
3. Upload the exact `CPxx.png` start image and exact `CPyy.png` end image.
4. Select `8 seconds`, `9:16` and one result.
5. Paste the complete continuity prefix.
6. Add one blank line and paste only the matching Sxx block.
7. End with the part prompt pack's `VEO AUDIO HARD LOCK` block.
8. Confirm that the final model label still says Veo 3.1 Lite, then generate.
9. Download the result and record the charged credits before another attempt.

Part I uses `S01 = CP00→CP01` through `S22 = CP21→CP22`.
Part II uses `S01 = CP00→CP01` through `S38 = CP37→CP38`.
P00 and E01 are deterministic post cards and never enter Flow.

## 4. Review gate

Inspect every result before continuing:

- the first and last frames retain crop, colour, identities and objects;
- recurring faces, age, clothing, notebook and room geometry remain stable;
- no duplicate person, merged participant, malformed hand or camera jump;
- one restrained camera move and physically legible motion;
- no visible speech, lip sync, nonsense words, invented brand or official seal;
- no false chronology, completed legal outcome or identifiable private person.

Record one concrete defect. Change only one input category on a retry. After two
repetitions, simplify the physical action or reserve the exact graphic detail for
post rather than burning credits on the same failure.

## 5. Audio rule

Discard the complete native audio track from every Veo clip, even when it sounds
usable. Independent clips do not maintain a reliable key, tempo, motif, voice or
ambient bed.

After picture lock:

1. generate one continuous clean Jon narration master per part;
2. produce one continuous instrumental score against the exact full runtime;
3. add synchronized ambience and foley in post;
4. duck music beneath Jon and master the complete film;
5. create separate SRT and WebVTT captions without burning them into the clean
   master.

## 6. Credit boundary

| Part | Generated intervals | Lite base cost |
| --- | ---: | ---: |
| I | 22 × 8 s | 220 credits |
| II | 38 × 8 s | 380 credits |
| Total | 60 clips | 600 credits |

The observed balance was `970`, leaving `370` credits after one complete Lite
pass. Preserve that reserve for concrete endpoint, identity or motion failures.
Do not spend it on a model or character benchmark.

## 7. Scenebuilder and local assembly

Scenebuilder may hold the review order, but it is not the final editor. Arrange
Part I S01–S22 or Part II S01–S38 between the locally built P00 and E01 cards.
Download individual approved clips. CPU FFmpeg owns final ordering, frame-rate
normalization, post typography, original MyScoutee mark, narration, continuous
score, ambience, foley, captions and decode verification.

Use the locked filenames in each part's `production/tracking/SHOT_MANIFEST.csv`.

## 8. Release check

Immediately before generation, verify that the account still exposes Veo 3.1
Lite with first and last frames, eight seconds, 9:16 and the expected charge.
Immediately before publication, verify commercial-use terms and the account's
visible-watermark setting. Preserve invisible provenance and disclose synthetic
illustrations where required.
