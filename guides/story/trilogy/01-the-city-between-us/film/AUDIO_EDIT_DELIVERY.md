# Audio, edit, branding and delivery

Current machine route, checked **2026-08-07**: DaVinci Resolve is not usable on
this computer because its GPU is unsupported. The production master therefore
uses CPU-based FFmpeg assembly. Kdenlive is optional for visual review with
720p proxies; it is not a delivery dependency.

Primary target: **03:12.000, 720×1280, 9:16, constant 24 fps, English-language
mobile MP4**.

## 1. Audio architecture

```text
A1  ENGLISH_NARRATION
A2  AMBIENCE
A3  FOLEY_AND_EFFECTS
A4  CONTINUOUS_SCORE
```

The picture locks before final narration and music are generated. Generated
clip-level background music, dialogue and singing never enter the master.

## 2. Narration

The film uses intimate first-person voice-over with no character dialogue or
lip sync. The locked
synthetic narrator for Parts I and II is the approved ElevenLabs **Jon — Warm &
Grounded Storyteller** voice.
Archive a clean reference WAV plus the exact voice identifier, model version
and generation settings; the display name alone is not a reproducible lock.

Recording or generation rules:

- work from the time windows in [SCRIPT.md](SCRIPT.md);
- create two complete natural takes or two controlled TTS passes;
- use `10–25 s` blocks with IN, visual HIT and OUT markers;
- preserve natural pauses instead of forcing the voice with heavy time stretch;
- normalize final files to mono or clean stereo `48 kHz` WAV;
- keep a separate restrained alternate for any legally sensitive line;
- never clone another real person's voice without written permission.

Suggested filenames:

```text
TCBU_VO_EN_take01_48k.wav
TCBU_VO_EN_take02_48k.wav
TCBU_VO_EN_S04_safe_48k.wav
```

Voice processing must stay light: high-pass only where needed, restrained EQ,
de-essing only for audible sibilance, gentle `2:1–3:1` compression and a
`-1 dBTP` ceiling. Avoid metallic AI isolation.

## 3. One continuous score

Generate music only after picture lock. Use a single instrumental score whose
internal development follows the whole film:

- `00:00–00:08`: near-still title breath and one restrained motif;
- `00:08–00:56`: sparse and personal; rural origin, Budapest, departure,
  Tottenham, Soho and daily routine;
- `00:56–01:36`: a subtle pulse through work, saving, travel and homecoming;
- `01:36–02:08`: warmer social motion for events, dancing and imperfect dates;
- `02:08–02:16`: remove most rhythm and leave an unresolved pause;
- `02:16–02:24`: introduce one clear musical idea with the product insight;
- `02:24–02:40`: separate musical voices gradually connect as six strangers
  form a group and introduce themselves;
- `02:40–02:56`: warm collaborative lift through the first managed event and
  continuing relationship lifecycle;
- `02:56–03:04`: simplify into a precise, quietly technical texture;
- `03:04–03:12`: short, confident and restrained resolution under the book-availability card.

The score starts at `00:00.000` and ends exactly on the final frame. Under
narration it should generally sit `6–10 dB` below its open level. Do not fill
every phrase ending with a musical accent.

## 4. Synchronized ambience and foley

Default video-generation audio instruction:

```text
Generate silent production picture only. No ambience, sound effects, music,
dialogue, narration or singing. Final sound is built after picture assembly.
```

Discard every native generated clip track. Build synchronized ambience and
foley locally so sound continuity does not restart at eight-second boundaries.

| Shot | Sound anchors |
| --- | --- |
| S01 | radiator, pencil, distant tram |
| S02 | station wash, suitcase zip, restrained room tone |
| S03 | three distinct work textures without national stereotypes |
| S04 | ventilation and distant step; no siren or police cue |
| S05 | rain, rail seam, key and door |
| S06 | bedding, shared kitchen, door and human room tone |
| S07 | clock, food container, keyboard and subtle seasonal change |
| S08 | eight related match-cut accents, then wind or rail quiet |
| S09 | suitcase stop and familiar tram bell |
| S10 | sparse tick against an abstract notification wash |
| S11 | applause tail, plate and marker |
| S12–S14 | shoes, room reverb and umbrella; no speech |
| S15 | café steam, low bar wash, tablecloth and cutlery |
| S16 | cursor disappears, pencil click, half-second rhythmic void |
| S17–S18 | dry slider and reciprocal connection tones; no casino sound |
| S19–S20 | steps, restrained decline, message becoming paper or ticket |
| S21 | entrance, chair, map, introductions and natural laughter |
| S22 | notebook close as several local room tones converge |
| P00 | restrained title motif and a deliberate breath after `A true story` |
| E01 | two restrained brand notes; leave the harmonic sentence open under the silent Part II continuation line |

Carry room tone across visual cuts with `0.3–0.8 s` overlaps where continuity
benefits. Key clicks may transform into keyboard clicks across the Tottenham to
Soho transition, but music must not restart at that edit.

## 5. Picture assembly

- normalize every source to `720×1280`, square pixels and constant `24 fps`;
- preserve the exact scene boundaries in
  [SHOT_MANIFEST.csv](../production/tracking/SHOT_MANIFEST.csv);
- repair a small temporal jump by removing only the proven frozen/duplicate
  frames and re-timing the local audio, not by morphing a long region;
- place important faces and hand actions between approximately `x=48–672`;
- keep essential text outside the top `120 px` and bottom `220 px` until target
  platform UI has been tested;
- use hard cuts or motivated object wipes by default; reserve dissolves for
  explicit memory transitions;
- never use optical flow on the fast travel still montage.

The S08 three-second burst is `72` frames: eight approved memories at exactly
nine frames each. Geography must not be merged inside one synthetic panorama.

## 6. Exact UI and branding in post

AI video plates for S10 and S17–S20 remain textless. Add accurate graphics in
post:

- S17: private editable `1–10` priority, never displayed as human worth;
- S18: reciprocal intent plus contextual affinity;
- S19: Accept and Decline with equal visual weight;
- S20: people, transport, place/accommodation and supplies as the four event
  resource families; ticket, check-in and feedback remain separate steps.

Do not display invented user counts, revenue, success rates, safety guarantees
or a “perfect match” message.

The brand source of truth is:

`frontend/src/assets/logo/heart.png`

Use the original file without recoloring, redraw, crop, glow, tint or AI
enhancement. Add `MyScoutee` as separate editable text. Show a brief cue in S01,
the common network core in S22 and the complete brand card in E01; do not place
a permanent corner watermark through the emotional middle.

Final E01 text:

```text
MyScoutee
BOOK AVAILABLE
TO BE CONTINUED
```

## 7. Subtitles

- derive the English SRT from the locked picture and final voice, not planning
  timecodes;
- maximum two lines and approximately `30–34` characters per line in `9:16`;
- target roughly `12–17` characters per second;
- break at natural phrases;
- identify meaningful nonverbal sound where necessary; there is no character
  dialogue or lip sync;
- preserve a clean textless master for later localization.

## 8. Mix and measurement

- narration remains intelligible on a phone speaker;
- score never masks consonants;
- ambience gives space without becoming constant noise;
- target approximately `-14 LUFS` integrated;
- true peak does not exceed `-1 dBTP`;
- also archive the separate narration and music-and-effects stems.

Listen on headphones, the target phone speaker and in a quiet room. Metering does
not replace intelligibility.

## 9. Export package

```text
TCBU_master_EN_720x1280.mp4
TCBU_clean_textless_720x1280.mp4
TCBU_EN.srt
TCBU_narration_EN.wav
TCBU_music_and_effects.wav
assembly-manifest.json
```

Master encoding:

| Field | Value |
| --- | --- |
| Container | MP4 |
| Video | H.264 High profile where available |
| Raster | 720 × 1280 |
| Frame rate | constant 24 fps |
| Video rate | approximately 6–10 Mb/s; target-platform test decides |
| Audio | AAC, 48 kHz, 256 or 320 kb/s |

Archive the final source list, prompts, model/version metadata, licences,
consents, audio stems and exact FFmpeg command or assembly manifest.

## 10. Phone QA and upscale rule

1. Decode and watch the complete exported file on the computer.
2. Copy it to the target phone and watch once on the speaker and once on
   headphones.
3. If possible, upload a private test to the intended distribution platform and
   inspect its recompression.
4. Record any fault by shot ID and correct only that shot.

Regenerate or upscale to `1080×1920` only when the approved `720×1280` source
shows a documented resolution or compression failure after the real phone test.
Higher resolution does not repair identity drift, anatomy, false text, story or
sound synchronization.
