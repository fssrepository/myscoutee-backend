# Narration route — verification on 2026-09-10

Target: add one continuous spoken sentence over the existing 4+4-second video while preserving its frames and native music/effects. This file records capability evidence, not a completed mix.

## Verified exported audio streams — 2026-09-11

Downloaded the original MP4 exports for the two narrated test jobs and inspected them with `ffprobe -v error -show_streams -show_format -of json`:

- `dc0fdaab-8c79-4bab-b846-f40a84080a7e`: first narrated result.
- `dcddbd34-80a3-469f-b85f-dba1303539a4`: next-four-seconds reference trial using TEST_V01 and the second Grady recording.

Both exports contain exactly one H.264 video stream (854x480, 24 fps, 97 frames, 4.041667 seconds) and one AAC-LC stereo audio stream (32 kHz, 3.968 seconds). Neither contains a separate narration stream. Stereo channels are not separate named narration/background tracks. FFmpeg can extract/remove/replace the whole audio stream; stream selection alone cannot remove only the narrator while retaining other sound mixed into it. This check establishes stream structure, not perceptual sound quality or successful source separation. Downloads are retained under `/tmp/myscoutee-audio-inspection/`, named by job UUID.

Generation metadata also resolves the earlier duration uncertainty: both jobs requested `duration: 4` and `extension_mode: null`, including the first narrated job whose written prompt requested eight seconds. Its four-second export therefore does not show that an eight-second UI setting was ignored. The latest job metadata includes TEST_V01's video media and the separate new audio input; this does not establish how the backend conditions the model internally.

## Active user-selected reference trial — 2026-09-11

Current steering supersedes the video-only trial below: use the already narrated restaurant video as preceding context and attach a NEW Grady recording for only the next four seconds. The new sentence is "For a moment, that was enough." Generate that short audio with the retained Grady/MiniMax settings and check its actual duration fits four seconds before using it. `test_extend_4s.txt` has been updated in place to request only the new four-second segment with that new recording, without replaying the source narration. The user reports the full earlier sentence fitted within the first four seconds; its timing has not been independently measured. The new audio and video jobs are not yet verified as generated. Evaluate picture, background sound and narrator timbre across the eventual join separately; a reused voice preset does not establish identical delivery across takes.

Latest correction: the user intends to generate ONLY the next four seconds using the source video as preceding context, rather than reproduce the original four seconds inside an eight-second output. `test_extend_4s.txt` implements this request with explicit onward action. Use a 4-second output and the source video attachment; reserve the separate Grady narration for the final assembled sequence. This remains an ordinary reference-generation trial, without a claim of native extension or a proven seamless join. The two extra trial prompt files were removed at the user’s request; update the existing prompt files in place from now on. The user reported that the original version modified/improved the picture and added narration but did not extend the action; output duration was not confirmed.

The user chose to test a new 8-second Cinema Studio generation using the existing 4-second video plus the generated Grady narration as references. Both attachments are reported added by the user. That earlier eight-second trial is superseded by the next-four-seconds request above. Grady was selected with MiniMax Speech 2.8 HD, Neutral, speed 1x, pitch 0, volume 100%, CD quality and text normalization; displayed speech quote was 0.3 credits. The recording's exact duration has not been measured here.

This is a reference-driven generation experiment, not a verified lossless extension or audio mix. Inspect whether the first four seconds are reproduced or changed, whether the full supplied voice performance is used once, and whether motion and background sound continue across four seconds. No success or exact frame/audio preservation is assumed from prompt instructions. The resulting video job has not yet been verified as submitted. The native extension and conventional finishing routes remain available; the user has not requested another paid comparison run.

## Confirmed inside Higgsfield

Audio → Text to Speech produces the narration recording. Use one output with this exact text:

> Sometimes the only thing that survives the cut is a smile.

Use the retained project voice or one selected male preset, normal speed. Aim for a natural 5–6-second delivery and measure the output before placing it. The old full A01 audition is not needed for this small test. A voice-generation quote is not a quote for video mixing.

## Adding it to the existing footage

The official help page documents Text to Speech, Voice Change and Translate. Voice Change replaces an existing speaker; it does not establish a way to add this new sentence to a clip with only music and ambience. Lipsync Studio changes mouth motion and does not satisfy the unchanged-picture requirement.

The available MCP tools expose speech generation and voice replacement, but no verified existing-video + separate-audio overlay/mixing operation. Model searches for audio mix and voiceover did not establish one. The official all-in-one workflow builds video around audio first, and distinguishes traditional timeline/compositing work as editor work. It therefore does not verify the requested post-generation overlay either.

**Unresolved:** the exact web UI operation that can accept the finished video plus a new recording, retain its background track, and export unchanged pictures. Do not spend credits on Voice Change, lip sync or a generative video edit as if these were a verified mixer.

If no such web operation exists, the concrete alternative is Higgsfield TTS followed by a conventional audio mix onto the downloaded cumulative video with its video stream copied unchanged. That finishing step is outside the Higgsfield web interface and has not been selected or executed. The user need not manually edit a timeline if this alternative is later chosen.

## Evidence

- [Higgsfield help: voice and audio modes](https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-use-lipsync-voiceover-and-aspect-ratios)
- [Higgsfield workflow: audio first, generation, then editing](https://higgsfield.ai/blog/generate-voice-edit-ai-video-one-place)
- Live MCP schemas: generate_audio generates speech; voice_change accepts a source video and replacement voice ID, without an overlay text/audio input.

## Test boundary

## Assembly research — 2026-09-11

The official documentary workflow explicitly describes generating separate scene clips and assembling the full film in a standard editing program (Step 5: Extend and assemble): https://higgsfield.ai/blog/ai-documentary-videos-2026 . The official all-in-one workflow also leaves traditional timeline editing and compositing to an editor such as DaVinci Resolve or After Effects. The Supercomputer guide explicitly distinguishes its generation workflow from frame-level timing/compositing: https://higgsfield.ai/blog/higgsfield-supercomputer-guide . These establish a documented external finishing route, not proof that every web project lacks assembly controls.

The user's screenshots establish a separate Cinema Studio Extend panel with Prequel/Sequel, a 4-second duration, and a displayed 26-credit quote before submitting a prompt. This operation generates additional footage; it is not evidence of a multi-clip assembly or narration-mixing interface. The original 4-second clip is generated, as confirmed by the user and its player. The extension has not yet been verified as generated.

The project's visible Project preview entry has not been inspected. Its ordering, audio, upload and Publish controls remain unverified. Before claiming a complete in-browser assembly/publishing route, inspect that actual screen. Do not substitute another paid generative edit for joining existing clips or mixing narration. The 4+4 extension test remains useful for continuity, independently of the final assembly route.

## Join evaluation

Review the native join without narration first. One later continuous voice track can test the final mix across that join, but cannot prove native generated-voice continuity. Do not hide an original soundtrack discontinuity with narration or a transition.
