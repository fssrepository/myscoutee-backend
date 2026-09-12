# Narration — one continuous recording, separate until the final mix

Latest editorial draft: [narration_directors_cut_v3.txt](../03_film/narration_directors_cut_v3.txt), 320 words. The creator found the recorded v2 better aligned but weaker in meaning. V3 restores the original’s institutional critique, limits of the record and unresolved humanity; see the [comparison](../04_tracking/DIRECTORS_CUT_NARRATION_V3_REVIEW.md). V3 is not recorded or mixed; the existing v2 files remain unchanged.

Recorded v2 text: [narration_directors_cut.txt](../03_film/narration_directors_cut.txt), a 323-word rewrite for the actual 202.541667-second picture. The creator rejected the old recording’s content alignment as well as its timing. See the [picture-based placement draft](../04_tracking/DIRECTORS_CUT_NARRATION_REWRITE.md). The creator supplied `narration_new.mp3`; it is now placed in the v2 viewing and editable movies. See [measured placement](../04_tracking/DIRECTORS_CUT_AUDIO_VALIDATION_V2.json). Keep Grady and the existing voice controls. The AI assistance acknowledgement and uncertain ending remain.

The original [narration.txt](../03_film/narration.txt) and A01–A07 are retained as provenance for the existing MP3. They concatenate seven passages verbatim; do not use that old block schedule for the rewrite. The historical timing section below describes that recording, not the new draft. The Script field always contains spoken words only.

## Locked working voice and controls

The creator selected **Grady**, using **MiniMax Speech 2.8 HD**, during the pilot. Keep that preset and model; do not browse replacements or regenerate calibration clips. The completed recording’s job reports voice ID `e2a2d2e6-9ed2-59cd-82af-feaa27f8a678` (job `627d5d9b-4dc2-4d8a-82ea-b53a24eb0021`, model `text2speech_v2`, engine parameter `minimax`). This recovers the selected voice ID; the API metadata does not independently confirm the UI’s version label. Use Neutral, speed 1.0x, pitch 0 and volume 100% as the baseline. The creator reported that CD quality did not increase the quote; retain that setting if available at the same displayed price. Keep text normalization off for the already written-out prose. Save settings is a convenience, not proof of a locked voice ID. One output.

The Script field contains spoken words only. Do not paste timing tables, instructions or section headings into it. Request clean narration without music or ambience using a separate direction field only if the UI actually offers one. The performance is intimate, restrained, slightly tired inner monologue; no trailer delivery, reassuring advertising cadence or audible block announcements.

## Original recording: historical timing and local placement

The full source contains 360 whitespace-delimited tokens (isolated dashes are included); 200 seconds implies approximately 108 tokens/minute including pauses. This is a planning ratio, not a generated duration.

| Passage | Story window | Tokens |
|---|---|---:|
| A01 | 0–30 s | 46 |
| A02 | 30–60 s | 45 |
| A03 | 60–90 s | 46 |
| A04 | 90–120 s | 61 |
| A05 | 120–150 s | 63 |
| A06 | 150–180 s | 66 |
| A07 | 180–200 s | 33 |

Generate one natural reading, then measure its actual length and sentence boundaries before final assembly. Do not demand 200 seconds of uninterrupted speech or encode timestamps in the spoken text. If it finishes early, place complete thoughts at their story windows by preserving or extending clean pauses locally; retain voice, pitch and natural speech speed. The denser A04–A06 passages may need more of their windows. The continuous source file remains intact. If a passage does not fit, identify that specific timing conflict before any paid repair; do not cut words or speed up speech automatically.

Narration starts with the story after the separate four-second silent ident. Leave space around the final clinical inhalation and cuff sound; retain the prescribed final words and two-second title. Measure these alignments against the actual accepted clips, including any later seam trims.

The pilot's narration was mixed into a single stereo soundtrack and the removal attempt damaged the background. Therefore all full-film video prompts generate only instrumental music, ambience and effects. No Axx audio is attached to them. FFmpeg joins compatible video streams with stream copy where possible and adds the accepted narration locally. Any frame repair requiring resampling/re-encoding is explicit and goes to a new output. Keep narration and native background source files separate until the delivery mix.

## Music across independently generated clips

Keep the raw fiddle / tekerő / clarinet theme and the block-specific tension directions already embedded in each video prompt. A still end-frame reference cannot carry the previous notes, reverberation or ambient phase; asking for a similar theme is not proof of an exact musical continuation. Inspect and mix the actual native beds locally. Smooth audio level or join timing only where needed, keeping material foley synchronized; do not apply a visual dissolve to conceal an audio seam. A separate full-length score is not part of this budget or generation plan.

## Regional context retained from the earlier plan

### Regional evidence and the film arrangement

The Táncház Association places Orosháza in its Dél-Tiszántúl overview and describes the wider southern plain's dance traditions, including ugrós/oláhos and slow/fast csárdás. That establishes regional context, not one uniquely Orosháza-specific melody. [Dél-Tiszántúl](https://tudasbazis.tanchaz.hu/index.php/nagyalfold/del-tiszantul)

Szerényi Béla's notes for the Téka Foundation's *Padkaporos bál* document older Dél-Alföld instrumentation including tekerő, clarinet and bagpipe, and ornamented playing. Its named source communities are Szentes, Tápé and Tiszaalpár. We use this as a regional instrumental reference, not as evidence of an exact Orosháza village style. [Album notes reproduced by Folkrádió](https://folkradio.hu/mediatar/albumok/446/padkaporos-bal-del-alfoldi-tancmuzsika)

The Hungarian House of Music also identifies the Hungarian tekerő with the Dél-Alföld tradition. [Szerényi family programme](https://zenehaza.hu/esemeny/burdon-szerenyi-bela-es-fiai)

The added lead fiddle, descending pentatonic phrase, dramatic two-beat articulation and phrase-to-building synchronization are our film composition choices. The tekerő and clarinet preserve the documented wider Dél-Alföld instrumental reference; the three-voice arrangement is not presented as an exact Orosháza ensemble reconstruction. They are not a transcription of a collected Orosháza tune, and historical dance music is not uniformly melancholy. No archival recording is copied into the film.


The shared music language is a film composition choice; the full narration remains a separate clean recording.
