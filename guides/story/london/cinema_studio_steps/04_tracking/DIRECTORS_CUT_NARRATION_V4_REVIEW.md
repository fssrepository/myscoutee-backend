# Narration against the locked v3 picture

The creator retains `myscoutee_directors_cut_v3.mp4` as the picture edit and closes video generation. The plain-transition comparison is set aside. Finish narration before making a smaller whole-film export; do not recompress working parts. Reported remaining narration budget: 80 credits. No paid job was submitted.

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

## V4 wording — ready for a new recording

[Spoken-only v4](../03_film/narration_directors_cut_v4.txt): 330 words, versus v3’s 320. The opening is already ordered for the picture. Keep the same voice and settings; measure the new performance before placement. Source duration is not established until that recording exists.

Two dry lines grow from the images: “Even the buildings were making more progress” over moving architecture and institutional delay; “There is no box for what you gave up” near the possessions box. They preserve the personal argument rather than turning the clinical ending into a punchline. AI assistance, refusal, sacrifice and the limits of the record remain.

| Target window | Spoken thought / anchor |
| --- | --- |
| 4.4–18.8 s | Straight line; street/room/window; finish “smile” on the café expression. |
| 21–31.2 s | Memory and judgment; “verdict” on the phone/profile view. |
| 32–60.8 s | Routes, strangers, human encounters and help; retain gaps for travel and roof movement. |
| 63.5–93.3 s | Work, ordinary procedural harm, repair, AI support; place AI beside the laptop room. |
| 100.3–118.5 s | System/process; institutions versus the waiting file; building-progress line on the inhabited architectural movement. |
| 124.6–148.5 s | Being heard, photograph, possessions box, sacrifice and refusal. |
| 154–161.7 s | Café smile and the turnstile stranger; no claim that the café is a police room. |
| 161.8–165.5 s | “People helped with what was in front of them” on the balloon helpers. |
| 166.8–171.2 s | Person before case, across the offered water and practical help. |
| 171.3–174.0 s | “There was room for me” on the shared table and receding café. |
| 174.3–184.2 s | System resumes; number readable above C01. |
| 184.5–196.5 s | Cities, returning rooms, unresolved answer; “At the glass” around 193.5 s, then the person beyond the record. Clinical breathing and title remain unvoiced. |

These are placement targets, not proof that an unrecorded take fits. The 171–174 s and closing windows need measured checks after TTS; shorten wording if needed rather than speeding up the voice.

Reproduce the timing comparison with `tools/directors_cut_audio.py --placement-file guides/story/london/cinema_studio_steps/04_tracking/DIRECTORS_CUT_NARRATION_PLACEMENT_V3_RETIMED.json --source narration_v3.mp3 --suffix _v3_retimed`, then mux `mix_v3_retimed.wav` with the retained v3 MP4 using video stream copy and AAC 384 kbit/s. Keep the original v3 MP4, original clip sources/approved fixes, `narration_v3.mp3` and `.full-film-dream`. Earlier delivered MP4/MOV files and their old standalone narration WAV exports are not dependencies of this revision.
