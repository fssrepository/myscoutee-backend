# Narration — one voice, measured duration

The seven `narration.txt` files preserve the master's **exact wording**, including the AI-survival acknowledgement in A04. They contain spoken words only. Never paste voice instructions into the TTS text field.

Use Higgsfield Audio / Seed Audio 1.0 if available for the project. Select one English-speaking adult male voice: approximately forty, low-to-mid register, intelligent, intimate, slightly tired and restrained; at most a light Central-European accent. Record the actual voice ID or preset in the [asset registry](../04_tracking/assets.csv) and retain it. Do not browse new voices per block.

## The protagonist's inner voice

The narration is the audible inner monologue of this exact walking protagonist: his own thoughts and recollections in an intimate, natural English male voice, approximately forty, restrained and slightly tired. He does not address another person or the audience, and nobody answers him. Keep his lips naturally at rest except for breathing; no visible speech or lip-sync. Keep the voice close and consistent in level as the camera moves, without street-distance filtering. Let thoughts breathe with natural pauses rather than filling every second. Preserve the supplied wording and established voice throughout the film; music and transformation sounds stay underneath it.

All seven narration texts have been checked: they are a single personal recollection, not dialogue. The voice belongs to C01 even when a memory contains other people. Background human sounds may be wordless, but there is no second intelligible speaker. The initial 8-second pilot intentionally has no narration; the existing 4-second extension tests the short inner-monologue line. This does not add a new job or alter the seven scripts.

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

## Music and transformation foley

Use one original Hungarian Southern Great Plain (Dél-Alföld) folk-inspired instrumental motif: a warm, slightly breathy clarinet melody over the low continuous drone and dry rhythmic buzz of a Hungarian tekerő (hurdy-gurdy). Keep just these two musical voices, a short recurring phrase and a gentle two-beat pulse. Intimate longing for home becomes quietly unsettled as the city transforms. Keep the same motif and timbres across continuations; develop its density without adding instruments or a new tune. No singing, existing song quotation, festive show-band arrangement or heroic orchestra. Keep music and foley below the narration, leaving its words clearly intelligible.

Tie each main architectural transformation to one musical phrase: its first clear accent starts the masonry moving, the melodic rise accompanies the unfolding facade, and the phrase's final accent coincides with the new form settling. Synchronize one weighted stone scrape through the movement and a brief metal/glass rattle at the landing. Keep the transformation visibly in frame; this is a material change coordinated with melody, not a cut hiding a new building. Use only these broad start-and-landing accents, with natural movement between them; avoid requiring a separate beat for every window. No explosion, trailer boom or magical whoosh. Keep the protagonist walking normally, without making the crowd dance.

The creator identifies Orosháza / Viharsarok paprika and corn fields as childhood roots. The score carries that personal association through the film; the existing rural memory fragments retain it visually. No new scene, character or generation job is added.

### Regional evidence and the film arrangement

The Táncház Association places Orosháza in its Dél-Tiszántúl overview and describes the wider southern plain's dance traditions, including ugrós/oláhos and slow/fast csárdás. That establishes regional context, not one uniquely Orosháza-specific melody. [Dél-Tiszántúl](https://tudasbazis.tanchaz.hu/index.php/nagyalfold/del-tiszantul)

Szerényi Béla's notes for the Téka Foundation's *Padkaporos bál* document older Dél-Alföld instrumentation including tekerő, clarinet and bagpipe, and ornamented playing. Its named source communities are Szentes, Tápé and Tiszaalpár. We use this as a regional instrumental reference, not as evidence of an exact Orosháza village style. [Album notes reproduced by Folkrádió](https://folkradio.hu/mediatar/albumok/446/padkaporos-bal-del-alfoldi-tancmuzsika)

The Hungarian House of Music also identifies the Hungarian tekerő with the Dél-Alföld tradition. [Szerényi family programme](https://zenehaza.hu/esemeny/burdon-szerenyi-bela-es-fiai)

The two-instrument arrangement, restrained two-beat pulse, melancholy and phrase-to-building synchronization are our film composition choices. They are not a transcription of a collected Orosháza tune, and historical dance music is not uniformly melancholy. No archival recording is copied into the film.

### One-take production contract

Each existing video job requests its music, ambience and material foley together. Keep one motif, two instruments and one main musical start/landing gesture per transformation. The pilot has one such gesture at 2–4.5 seconds; the extension tests continuity and narration without another transformation. There is no additional paid music job, comparison batch or automatic reroll. Detailed instrumental authenticity, phrase continuity and exact synchronization are not proven until the output is heard; a small timbral or timing difference alone does not justify spending on another take. Preserve intelligible narration, visible transformation, living memory and above-head cards as the main story requirements. Stop all city sound and score at the clinical cut.
