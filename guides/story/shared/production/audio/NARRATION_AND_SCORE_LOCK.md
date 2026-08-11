# Parts I–II narration and score lock

Updated: **12 August 2026**

Current picture-locked delivery:

- Part I production cut: `03:04.667`, 9:16, 720×1280, constant 24 fps;
- Part II policy-shortened alternative cut: `02:17.209`, 9:16, 720×1280,
  constant 24 fps.

The written `05:28` canonical Part II package remains preserved separately. The
short Part II narration is explicitly an alternative-cut script and does not
replace the canonical full-film narration.

## Narrator

Use the same narrator for both parts:

- ElevenLabs display name: **Jon — Warm & Grounded Storyteller**;
- approved local reference:
  `/home/raxim/Downloads/ElevenLabs_2026-08-08T20_13_35_Jon - Warm & Grounded Storyteller_pvc_sp97_s62_sb55_se20_m2.mp3`;
- preserve one clean, effects-free narration master for each film;
- no character dialogue, generated crowd speech, singing or lip sync.

Use the same Jon voice in two deliberately different performances. These values
were recovered from the approved 8 August voice-test session:

| Setting | Part I production | Part II alternative |
| --- | ---: | ---: |
| model | `Multilingual v2` | `Multilingual v2` |
| speed | `0.97` | `0.94` |
| stability | `62` | `58` |
| similarity boost | `55` | `55` |
| style exaggeration | `20` | `32` |
| speaker boost | `Off` | `Off` |

Part I is warm, direct and curious. Part II is the same person speaking more
slowly, tiredly and with restrained tension. Do not change settings between
chunks within one film.

Before the paid full reads, copy the exact ElevenLabs voice ID, current model
name/version and visible settings into this file. The display name and inferred
filename values alone do not create a reproducible lock.

## Credit-safe narration workflow

1. Use the blocks in the picture-locked narration documents. Generate each
   approximately 20–31 second block separately, with no music or effects.
2. Prefer 48 kHz WAV. A high-quality MP3 is acceptable when WAV export is not
   available; it is decoded once to PCM and encoded only once in the final mix.
3. Preserve the exact export filenames specified in the narration documents.
   If a generation fails, repeat only that block.
4. Join blocks at breaths or silence with very short transparent fades. This
   does not change Jon's timbre and avoids an audible hard edit.
5. Edit pauses and breaths before changing words. Avoid audible time-stretch;
   a transparent final adjustment stays within approximately `±2%`.
6. The Part II policy card remains silent long enough to read. Jon does not
   speak the policy text aloud.

## One continuous score per film

The score is mixed after narration timing is known. It is not a collection of
clip soundtracks.

- Part I starts at `00:00.000` and ends at `03:04.667`.
- Part II alternative starts at `00:00.000` and ends at `02:17.209`.
- Follow phrases, pauses and withheld breaths as dramatic punctuation.
- Duck beneath Jon rather than competing with him.
- Carry harmonic and ambient material across every eight-second picture cut.
- Never restart style, key, ambience or beat at a generated-clip boundary.
- Let each title breathe without a trailer hit.
- Leave each continuation card harmonically open rather than resolving it as a
  finished victory.

Working mix behaviour:

- narration remains the centre and consistently intelligible;
- music normally sits roughly `4–7 dB` below the voice band and ducks another
  `2–4 dB` under dense phrases;
- short rises occur only in genuine narration gaps;
- ambience and foley remain subordinate to narration and music;
- preserve clean narration, clean score, ambience/foley and final-mix stems.

Part I arc: earth and Budapest warmth → London wonder → hidden austerity →
global movement → loneliness and failed beginnings → human/product lift → open
continuation into Part II.

Part II alternative arc: inherit Part I's last harmonic note → low system pulse
→ compressed administrative rhythm → the operated body → persistent doorbell →
policy interruption and book handoff.

For these current cuts, keep the existing film music, ambience and effects.
Duck them under Jon and preserve the doorbell and the alternative closing's
suspense. Do not replace the source soundtracks during the narration pass.

The approved 40-second experiment is a tonal and ducking reference, not a full
score master:

`/home/raxim/Downloads/MyScoutee_40s_Part_I_Jon_Between_Rooms_stronger_score_mix_EN.mp4`

Its underlying score source is:

`/home/raxim/Downloads/MyScoutee_Between_Rooms_original_score_v1.wav`

## Captions and deliverables

- create English SRT and WebVTT sidecars from final narration timing;
- do not burn subtitles into the clean master;
- preserve textless and music-free masters for later localization;
- discard every generated Veo clip-audio track before assembly.
