# Parts I–II narration and score lock

Date: **9 August 2026**  
Delivery: English Part I `03:12.000` and Part II `05:20.000`, 9:16,
720×1280, constant 24 fps.

## Narrator

Use the same narrator for both parts:

- ElevenLabs display name: **Jon — Warm & Grounded Storyteller**;
- approved local reference:
  `/home/raxim/Downloads/ElevenLabs_2026-08-08T20_13_35_Jon - Warm & Grounded Storyteller_pvc_sp97_s62_sb55_se20_m2.mp3`;
- preserve one clean, effects-free narration master for each film;
- no character dialogue, generated crowd speech, singing or lip sync.

The filename appears to encode the following settings, but this is an
**inference**, not a reproducible voice lock:

| Setting | Working value |
| --- | --- |
| speed | `0.97` |
| stability | `62` |
| similarity boost | `55` |
| style exaggeration | `20` |
| model | `Multilingual v2` (`m2`) |
| voice type | professional voice clone (`pvc`) |

Before the paid full reads, copy the exact ElevenLabs voice ID, current model
name/version and visible settings into this file. The display name and inferred
filename values alone do not create a reproducible lock.

## Credit-safe narration workflow

1. Generate one continuous clean read of the locked script for each part. Do
   not request music or effects with speech.
2. Part I has P00 + 22 eight-second story windows + E01. Part II has P00 + 38
   eight-second story windows + E01. Edit pauses and breaths before changing
   words; preserve natural phrasing across visual cuts.
3. If one sentence cannot fit naturally, regenerate only that sentence with the
   same voice and settings. Do not regenerate the full film.
4. Avoid audible time-stretch. A transparent final adjustment stays within
   approximately `±2%`; a larger mismatch requires a line retake.
5. Jon reads the opening threshold and spoken invitation. Continuation language
   may remain silent typography where the locked script specifies it.

## One continuous score per film

The score is mixed after narration timing is known. It is not a collection of
clip soundtracks.

- Part I starts at `00:00.000` and ends at `03:12.000`.
- Part II starts at `00:00.000` and ends at `05:20.000`.
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

Part II arc: inherit Part I's last harmonic note → low system pulse → compressed
administrative rhythm → near-silence around the operated body → fingerprint and
paper pulse → brown-stone court weight → wider uncaged creative movement →
ambiguous constitutional colour → open continuation into Part III.

The approved 40-second experiment is a tonal and ducking reference, not a full
score master:

`/home/raxim/Downloads/MyScoutee_40s_Part_I_Jon_Between_Rooms_stronger_score_mix_EN.mp4`

Its underlying score source is:

`/home/raxim/Downloads/MyScoutee_Between_Rooms_original_score_v1.wav`

## Captions and deliverables

- create English SRT and WebVTT sidecars from final narration timing;
- do not burn subtitles into the clean master;
- preserve textless and music-free masters for later localization;
- discard every generated Flow/OpenArt clip-audio track before assembly.
