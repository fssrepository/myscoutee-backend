# Narration — one voice, measured duration

The seven `narration.txt` files preserve the master's **exact wording**, including the AI-survival acknowledgement in A04. They contain spoken words only. Never paste voice instructions into the TTS text field.

Use Higgsfield Audio / Seed Audio 1.0 if available for the project. Select one English-speaking adult male voice: approximately forty, low-to-mid register, intelligent, intimate, slightly tired and restrained; at most a light Central-European accent. Record the actual voice ID or preset in the [asset registry](../04_tracking/assets.csv) and retain it. Do not browse new voices per block.

## Timing conflict in the master

The first three scripts contain 45–46 whitespace-delimited tokens; the next three contain 61–66. The same rate and pause pattern cannot reliably fit all six into a narrow 23–27 s window. Fast camera movement does not shorten speech.

| Audio | Token count* | Original target | Approximate words/minute required |
| --- | --- | --- | --- |
| A01 | 46 | 23–27 s | 102–120 |
| A02 | 45 | 23–27 s | 100–117 |
| A03 | 46 | 23–27 s | 102–120 |
| A04 | 61 | 23–27 s | 136–159 |
| A05 | 63 | 23–27 s | 140–164 |
| A06 | 66 | 23–27 s | 147–172 |
| A07 | 33 | 15–19 s | 104–132 |

*Simple whitespace counting includes isolated dashes. These are planning approximations, not audio measurements.*

Before the first generation, choose delivery appropriate to the script length while keeping voice, pitch and character consistent. A01–03 can breathe more; A04–06 need more continuous phrasing without a long pause after every short clause. Speech must remain understandable and human against the intense visuals.

The original duration window is a target. The technical requirement is complete intelligible speech that fits the block with visual breathing room. **Do not regenerate a natural A01 solely because it is shorter than 23 s**; city ambience can fill the remainder. This is an explicit cost-saving correction to the old rigid lower bound. Overlong or rushed narration is not an accepted reference.

Use any available pre-generation duration estimate, then measure or inspect the actual recording. Do not ask the video model to compress, re-voice or repair an overlong recording. No narration text has been shortened in this edition; a paid re-recording is a specific repair, not an automatic loop.

## Pilot versus full narration

[TA01](../01_pilot/test_narration.txt) is a five-word sentence, ideally about 2–3 s for the 4 s extension. It tests the voice/reference route quickly; it does not validate the timing of A04–A06.

Audio-reference input does not prove an unchanged soundtrack. Compare the source recording with the video output during the pilot and V01. Generate the remaining narrations as their blocks become necessary, so an early audio problem does not invalidate seven prepaid recordings.
