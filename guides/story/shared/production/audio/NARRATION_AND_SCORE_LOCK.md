# Parts I–II narration and score lock

Date: **9 August 2026**  
Delivery: two English `03:00.000` films, 9:16, 720×1280, constant 24 fps.

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
name/version and visible settings from the UI into this file. The display name
and inferred filename values are not enough to reproduce the voice later.

## Credit-safe narration workflow

1. Generate one continuous clean read of the locked script for each part. Do
   not generate music or effects in the speech request.
2. Align the continuous read to the twenty-two eight-second windows by editing
   pauses and breaths first. Preserve natural phrasing across visual cuts.
3. If one sentence cannot fit its window naturally, regenerate only that
   sentence with the same voice and settings. Do not regenerate the full film.
4. Avoid audible time-stretch. A final transparent adjustment must remain
   within approximately `±2%`; a larger mismatch requires a line retake.
5. The narrator reads the opening threshold and the spoken MyScoutee invitation.
   `CONTINUED IN PART II · THE SYSTEM BETWEEN US` and `TO BE CONTINUED IN PART
   III` are silent end-card typography.

## One continuous score per film

The score is composed and mixed after narration timing is known. It is not a
collection of twenty-two clip soundtracks.

- start at `00:00.000` and end exactly at `03:00.000`;
- follow the narration's phrases, pauses and withheld breaths as dramatic
  punctuation;
- duck beneath Jon rather than competing with him;
- carry harmonic or ambient material across every eight-second picture cut;
- never restart the style, key, ambience or beat at a generated-clip boundary;
- let the opening title breathe without a trailer hit;
- leave the final continuation card harmonically open rather than resolving it
  like a finished victory.

Working mix behaviour:

- narration remains the centre and is kept consistently intelligible;
- music normally sits roughly `4–7 dB` below the voice band and ducks a further
  `2–4 dB` under dense phrases;
- allow short rises only in genuine narration gaps;
- ambience and foley remain subordinate to both narration and music;
- preserve a clean narration stem, clean score stem, ambience/foley stem and
  final mix.

Part I arc: earth and Budapest warmth → London wonder → hidden austerity →
global movement → loneliness and failed beginnings → human/product lift → open
continuation into Part II.

Part II arc: inherit Part I's last harmonic note → low system pulse → compressed
administrative rhythm → near-silence around the operated body → fingerprint and
paper pulse → brown-stone court weight → wider uncaged creative movement →
ambiguous constitutional colour → open continuation into Part III.

The approved 40-second experiment is a tonal and ducking reference, not a
three-minute music master:

`/home/raxim/Downloads/MyScoutee_40s_Part_I_Jon_Between_Rooms_stronger_score_mix_EN.mp4`

Its underlying score source is:

`/home/raxim/Downloads/MyScoutee_Between_Rooms_original_score_v1.wav`

## Captions and deliverables

- create English SRT and WebVTT sidecars from the final narration timing;
- do not burn subtitles into the clean master;
- preserve textless and music-free masters for later localization;
- generated Flow/OpenArt clip audio is discarded before assembly.
