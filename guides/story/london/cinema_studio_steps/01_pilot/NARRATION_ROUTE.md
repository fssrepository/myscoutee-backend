# Narration route — verification on 2026-09-10

Target: add one continuous spoken sentence over the existing 4+4-second video while preserving its frames and native music/effects. This file records capability evidence, not a completed mix.

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

Review the native join without narration first. One later continuous voice track can test the final mix across that join, but cannot prove native generated-voice continuity. Do not hide an original soundtrack discontinuity with narration or a transition.
