# Narration against the locked v3 picture

The creator retains the v3 picture edit and closes video generation. The requested opening-title repair is incorporated in `myscoutee_directors_cut_v3_retimed_title.mp4`; use that picture for the next narration. The plain-transition comparison is set aside. Finish narration before making a smaller whole-film export; do not recompress working parts. Reported remaining narration budget: 80 credits. No paid job was submitted.

## Timing comparison using the existing recording

`myscoutee_directors_cut_v3_retimed.mp4` keeps the exact v3 picture and original background, with 18 passage placements adjusted. The recorded words and all original voice samples remain; speed, pitch, timbre and intonation are unchanged. Its separate narration stem is `myscoutee_directors_cut_narration_v3_retimed.wav`. This comparison does **not** contain the new v4 wording.

| Picture evidence | Change from v3 |
| --- | --- |
| Café reveal around 12–18 s | Room passage starts 10.00 instead of 9.25 s; “smile” lands around 18.1 s. |
| Dance around 54–56 s | Help passage moves 1.3 s earlier, bringing “helped me” closer to the dance. |
| Paperwork around 67–72 s | Work passage moves 0.8 s later; form/rule/deadline words follow the office reveal more closely. |
| Laptop room around 88–90 s; exterior orbit afterward | AI passage starts 87.4 s; leave 93.21–100.3 s without narration for the following camera movement. |
| Door/search/fingerprint sequence around 102–108 s | System passage moves from 95.5 to 100.3 s; human/process passage starts 104.9 s. |
| Photographs around 128 s, possessions box around 134 s | File passage starts 127.0 s; repair/refusal moves onto the later desk scenes, leaving the bridge travel unvoiced. |
| Water glass at 167–168.5 s; actual cup/table at about 171.5–172.5 s | Keep “hand” at 167.3 s; move “cup” from 168.5 to 171.1 s. “Place at the table” follows at 172.1 s and runs into the next café view. The compressed table window still motivates rewriting this list. |

End narration remains 196.165 s, before the recorded 197.042 s clinical boundary. The retained v3 ending still uses reordered sentences to place “glass” on the glass; v4 replaces that compromise with a continuous closing thought.

Evidence: the delivered v3 picture was sampled every 2 s across the full film, with additional 0.5 s sequences at 100–110, 166–175 and 190–198 s. Recording word-time estimates and measured quiet cut positions support placement. This is not a complete real-time audiovisual listening review or a claim that delivery/intonation has been improved. See [placements](DIRECTORS_CUT_NARRATION_PLACEMENT_V3_RETIMED.json), [audio validation](DIRECTORS_CUT_AUDIO_VALIDATION_V3_RETIMED.json) and [delivery validation](DIRECTORS_CUT_DELIVERY_VALIDATION_V3_RETIMED.json).

## Latest feedback: replace the recording, not more word-by-word edits

The creator still hears local picture/voice offsets, notably the cup and fingerprint, and audible joins in the edited v3 performance. A roughly 0.3 s earlier middle section is a listening hypothesis, not a measured global offset. The existing source word-time estimate places “fingerprint” around 129.5 s in the retimed film, while the police fingerprint scene is around 105–108 s: that mismatch needs a change in narrative placement, not merely a 0.3 s shift. The later photograph/file scene remains a different cue.

Prepare a fresh continuous v4 performance in picture order, using the same voice and saved settings. Keep each thought intact, including its natural breaths and delivery; place complete paragraphs at clean pauses rather than splitting lists into separate words or reversing closing sentences. Do not alter pitch, speed, timbre or intonation. A new recording will still need measured placement against the film; regenerated speech alone does not guarantee synchronisation. Apply a small anticipatory offset only where listening to the new take supports it. The v3 recordings and current movie remain intact; no further v3 audio edit is requested by this feedback.

At the creator's reported approximately 5.2 credits per recording, the 80-credit budget allows room for iterations. This is a user-provided estimate, not a checked provider quote. The creator operates generation; no paid take has been launched here.

## V4 wording — ready for a new recording

[Spoken-only v4](../03_film/narration_directors_cut_v4.txt): 335 words, versus v3’s 320. The opening is already ordered for the picture. Keep the same voice and settings; measure the new performance before placement. Source duration is not established until that recording exists.

Two dry lines grow from the images: “My fingerprints were more convincing than my explanation” belongs to the police fingerprint scene; “Even the buildings were making more progress” belongs to moving architecture and institutional delay. The later file passage retains the direct “It cannot hold what you gave up.” AI assistance, refusal, sacrifice and the limits of the record remain. The short cup/table window is covered by “There was room for me,” without forcing individual object names onto separate frames. Leave the clinical awakening to its native sound.

| Target window | Spoken thought / anchor |
| --- | --- |
| 4.4–18.8 s | Straight line; street/room/window; finish “smile” on the café expression. |
| 21–31.2 s | Memory and judgment; “verdict” on the phone/profile view. |
| 32–60.8 s | Routes, strangers, human encounters and help; retain gaps for travel and roof movement. |
| 63.5–93.3 s | Work, ordinary procedural harm, repair, AI support; place AI beside the laptop room. |
| 99.8–113.5 s | System enters; land “fingerprints” around 105–106 s; retain the distinction between people and process. |
| 113.5–123.0 s | Institutions versus the waiting file; building-progress line on the inhabited architectural movement and stairs. |
| 124.6–148.5 s | Being heard, photograph, possessions box, sacrifice and refusal. |
| 154–161.7 s | Café smile and the turnstile stranger; no claim that the café is a police room. |
| 161.8–165.5 s | “People helped with what was in front of them” on the balloon helpers. |
| 166.8–171.2 s | Person before case, across the offered water and practical help. |
| 171.3–174.0 s | “There was room for me” on the shared table and receding café. |
| 174.3–184.2 s | System resumes; number readable above C01. |
| 184.5–196.5 s | Cities, returning rooms, unresolved answer; “At the glass” around 193.5 s, then the person beyond the record. Clinical breathing and title remain unvoiced. |

These are placement targets, not proof that an unrecorded take fits. In particular, measure the new fingerprint/process passage, the 171–174 s table thought and the closing window after TTS. If a complete thought does not fit, revise and re-record its wording rather than fragmenting the performance or speeding up the voice.

Reproduce the timing comparison with `tools/directors_cut_audio.py --placement-file guides/story/london/cinema_studio_steps/04_tracking/DIRECTORS_CUT_NARRATION_PLACEMENT_V3_RETIMED.json --source narration_v3.mp3 --suffix _v3_retimed`, then mux `mix_v3_retimed.wav` with the retained v3 MP4 using video stream copy and AAC 384 kbit/s. Keep the original v3 MP4, original clip sources/approved fixes, `narration_v3.mp3` and `.full-film-dream`. Earlier delivered MP4/MOV files and their old standalone narration WAV exports are not dependencies of this revision.
