# Narration — one voice, measured duration

The seven `narration.txt` files preserve the master's **exact wording**, including the AI-survival acknowledgement in A04. They contain spoken words only. Never paste voice instructions into the TTS text field.

## Delivery without local editing

The creator cannot edit or render the film locally. The planned route generates each narration in Higgsfield Audio first, then supplies that accepted audio to Cinema Studio before video generation. A01–A07 are generation inputs, not instructions to lay WAV files under silent footage in a desktop editor. The returned video must already contain the inner monologue, native music, ambience and effects.

Cinema Studio documents native speech, music and effects in the video pass, and Higgsfield documents generating speech first and using it as a Cinema Studio audio reference. These support the planned route, but do not guarantee verbatim speech, unchanged voice or a correct mix in our particular shot. [Cinema Studio help](https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-cinema-studio), [Higgsfield Audio workflow](https://higgsfield.ai/blog/higgsfield-audio)

The joined 8+8-second pilot receives its short narration afterward, following the current [pilot sequence](../01_pilot/README.md). Review that complete picture/music/SFX/voice result before full-film production. This does not itself verify A01–A07 as generation inputs. Keep the spoken line intelligible, preserve the music across the seam and prevent visible lip-sync. If the voice is missing or materially wrong, the narration path has not passed; do not proceed on an assumption that the creator can repair it locally. Native assembly and export of the complete 3:20 film remain a separate requirement in [SETUP.md](SETUP.md#continuation-and-complete-export).

Use Higgsfield Audio / Seed Audio 1.0 if available for the project. Select one English-speaking adult male voice: approximately forty, low-to-mid register, intelligent, intimate, slightly tired and restrained; at most a light Central-European accent. Record the actual voice ID or preset in the [asset registry](../04_tracking/assets.csv) and retain it. Do not browse new voices per block.

Request clean speech only in these audio jobs: no music, rain, transformation effects or added room ambience. Those layers belong to the audio-ON video generation. The earlier 250-credit narration allowance is superseded by the creator’s latest estimate of approximately 700 credits remaining for all unfinished work. Price A01–A07 and TA01 within that total before generation; no separate funded audio allowance is established. See [BUDGET.md](BUDGET.md).

## Seven recordings, one continuing speaker

The current plan has seven separate narration recordings, one per video block; this is a production choice to fit the existing block inputs, not a claim that Higgsfield requires seven files. Each recording is the next passage of the same inner monologue. Keep the actual audio model, voice ID/preset, accent, pitch, recording character and available voice settings fixed. Adjust phrasing to fit the script without selecting a different voice. A text description such as "the same male voice" alone is insufficient evidence of a stable voice.

Compare A01 to the accepted TA01 voice and each subsequent recording to A01 and the preceding passage. Listen for changes in timbre, accent, apparent age, loudness and room sound. Each passage should finish its sentence within its own block, with a natural breath before the next passage. Do not split a word at a boundary or replay the preceding line. No extra calibration recordings are added.

V02–V07 are planned as native Forward Extend operations from the preceding accepted video. Keep its last pose, stride, camera movement, exposure and overcast weather state; preserve the sound bed and musical phrase through the boundary. New narration belongs only to the new portion. Native continuation and a fixed voice preset reduce sources of discontinuity but do not guarantee an invisible seam or unchanged audio-reference timbre. The 8+8 s pilot checks the initial picture/music seam, and the joined narrated version checks the intended final mix; A01→A02 is the first check of continuity between two full narration passages. The complete hosted export remains a separate verification in SETUP.md.

## The protagonist's inner voice

The narration is the audible inner monologue of this exact walking protagonist: his own thoughts and recollections in an intimate, natural English male voice, approximately forty, restrained and slightly tired. He does not address another person or the audience, and nobody answers him. Keep his lips naturally at rest except for breathing; no visible speech or lip-sync. Keep the voice close and consistent in level as the camera moves, without street-distance filtering. Let thoughts breathe with natural pauses rather than filling every second. Preserve the supplied wording and established voice throughout the film; music and transformation sounds stay underneath it.

All seven narration texts have been checked: they are a single personal recollection, not dialogue. The voice belongs to C01 even when a memory contains other people. Background human sounds may be wordless, but there is no second intelligible speaker. The initial 8-second pilot intentionally has no narration; the joined visual test receives the short inner-monologue line afterward. This does not add a new job or alter the seven scripts.

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

[TA01 text and preparation](../01_pilot/test_narrated_video.txt) is a 16-word verbatim Block 01 excerpt, naturally about 7–9 s, added to the joined visual test after assembly. It checks delivery and picture/music/SFX balance; it does not verify imported audio in video generation or the timing of A04–A06.

Audio-reference input does not prove an unchanged soundtrack. Compare the source recording with the video output during the pilot and V01. Generate the remaining narrations as their blocks become necessary, so an early audio problem does not invalidate seven prepaid recordings.

## Music and transformation foley

MUSICAL IDENTITY — HUNGARIAN MEMORY, CLEARLY AUDIBLE
Compose an original, strongly recognisable Hungarian folk-rooted melody with a Southern Great Plain instrumental core. Lead with one close, raw acoustic fiddle: audible bow grain, short grace-note turns, a held upper note and a falling pentatonic answer. Support it with the distinct rasping string drone and rhythmic buzzing bridge of a Hungarian tekerő, not a synthesizer pad. A woody clarinet answers the end of the fiddle phrase with a short ornamented response rather than sustaining a smooth ambient wash. Keep these three acoustic voices distinct. The musical feeling is inherited memory, longing, grief and stubborn life; it should be possible to hum the theme after hearing it.
Use a short recurring minor-pentatonic phrase: a rising call, a held peak and a descending answer to its home note. Begin with the expressive elasticity of an unaccompanied lament, then bring in an unevenly accented two-beat pulse as the city starts changing. Give the fiddle strong articulated attacks and human changes in bow pressure. Carry the same melodic identity through the film, increasingly urgent and ornamented during overload, bare and tender at a human memory. This is our dramatic folk arrangement, not a claim to reproduce a specific collected Orosháza tune. No generic cinematic pad, piano arpeggio, orchestral trailer swell, pop drum loop or sung lyrics.
The tune must be plainly audible, not buried under street ambience. In narration gaps bring the fiddle and the transformation's material sounds forward; when the supplied inner monologue speaks, lower their level enough to preserve every word without removing the musical phrase. The initial eight-second pilot has no voiceover, so music and transformation sounds can occupy the foreground.

MATERIAL SOUND AND SYNCHRONISATION
Give each main transformation three audible stages: contact at its first movement, a sustained material strain while it changes, and a definite settling or reversing accent at the end. Heavy stone produces a low grinding body plus a dry granular scrape; iron bends with a stressed creak and a short ringing release; opening glass carries a taut high vibration; emerging wood has a close dry joint creak. These must be clearly distinguishable from the continuous wet tyre hiss and traffic. Place each sound at the visible object, moving with it across the sound field. Let the musical phrase's attack initiate the large movement, its held or rising note carry the strain, and its falling answer coincide with the landing or reversal. For an emerging memory, its sound gains nearby depth as the object crosses into the street. Leave a brief pocket of space for the human gesture, then resume the ongoing pulse. Use physical resonance with dramatic scale instead of a generic transition whoosh. Stop the score and all city/transformation sounds at the final clinical cut.

The creator identifies Orosháza / Viharsarok paprika and corn fields as childhood roots. The score carries that personal association through the film; the existing rural memory fragments retain it visually. No new scene, character or generation job is added.

### Regional evidence and the film arrangement

The Táncház Association places Orosháza in its Dél-Tiszántúl overview and describes the wider southern plain's dance traditions, including ugrós/oláhos and slow/fast csárdás. That establishes regional context, not one uniquely Orosháza-specific melody. [Dél-Tiszántúl](https://tudasbazis.tanchaz.hu/index.php/nagyalfold/del-tiszantul)

Szerényi Béla's notes for the Téka Foundation's *Padkaporos bál* document older Dél-Alföld instrumentation including tekerő, clarinet and bagpipe, and ornamented playing. Its named source communities are Szentes, Tápé and Tiszaalpár. We use this as a regional instrumental reference, not as evidence of an exact Orosháza village style. [Album notes reproduced by Folkrádió](https://folkradio.hu/mediatar/albumok/446/padkaporos-bal-del-alfoldi-tancmuzsika)

The Hungarian House of Music also identifies the Hungarian tekerő with the Dél-Alföld tradition. [Szerényi family programme](https://zenehaza.hu/esemeny/burdon-szerenyi-bela-es-fiai)

The added lead fiddle, descending pentatonic phrase, dramatic two-beat articulation and phrase-to-building synchronization are our film composition choices. The tekerő and clarinet preserve the documented wider Dél-Alföld instrumental reference; the three-voice arrangement is not presented as an exact Orosháza ensemble reconstruction. They are not a transcription of a collected Orosháza tune, and historical dance music is not uniformly melancholy. No archival recording is copied into the film.

### One-take production contract

Each existing video job requests this fiddle-led theme, native ambience and prominent material foley together. The revised pilot's main architectural cue runs at 1–2 seconds; the street becomes the restaurant at 2–5.5 seconds and continues into an arcade at 5.5–6.5 seconds. A tram sound accompanies the independently travelling camera orbit, and the opposite facade moves with the returning theme in the wide 6.5–8-second landing. The extension inherits the accepted theme and sound phase rather than introducing another tune. No separate music job or archival audio import is added. The creator reported that the first output did not sound like Hungarian folk music and lacked dramatic effects; its soundtrack has not been independently auditioned here. The rewritten audio direction is untested. Check that the theme is hummable, the acoustic bow/buzz/reed characters are distinct, and at least the main stone, iron and wood events are audible and synchronized. Stop the city sound and score at the clinical cut.

The [Hungarian House of Music's Szerényi programme](https://zenehaza.hu/esemeny/burdon-szerenyi-bela-es-fiai) supports the tekerő's Dél-Alföld connection. This supports the regional core, not a guarantee that a text-to-video model will reproduce the style. The fiddle-led lament is a deliberate film interpretation of the creator's roots, not an invented archival attribution.

## Dramatic meaning and delivery

Keep the personal restraint, but give the exact words weight: a glance becoming a verdict, the process forgetting the person, and the refusal to make room for repair must land as lived experience. Use deliberate consonants and brief pauses at the script’s sentence boundaries, with pressure building across the institutional passages and warmth returning at concrete acts of help. Keep the AI acknowledgement and the final uncertainty intact. Do not smooth these passages into a reassuring promotional read or add new spoken explanations.
