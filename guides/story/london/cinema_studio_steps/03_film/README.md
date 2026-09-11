# Film production — current route, 2026-09-11

Seven story blocks, eight video portions: 01–05 at 30 seconds, 06A/06B at 15 seconds each, 07 at 20 seconds. The story remains 200 seconds. Separate [00 MyScoutee presents](00/README.md) adds four silent seconds before it. The creator selects pilot version 10 for delivery; the additional version 11 trim was rejected. Update project film and watermarking were reported working; the embedded subtitle was not displayed.

## 3. Import the production containers

Use **[FILM_PRODUCTION_IMPORT.md](../00_project/elements/additions/FILM_PRODUCTION_IMPORT.md)** once: 25 definitions = 1 existing-logo container + 9 video containers + 8 storyboards + 7 final frames. This supplements the accepted library; do not reimport it. No audio Elements. Assign the existing uploaded logo to LOGO_MYS.

After the creator confirms import, read-only MCP lookup of the actual Names/keys/handles is authorized, followed by local prompt updates. Do not guess a handle from a Name. Registering an Element does not attach media; verify each required image is present before its dependent generation. This authorization does not include upload, generation, moving or deleting assets, or publication through MCP.

## 4–5. Storyboards, references and video prompts

Generate in the order below. Prepare each continuation storyboard only after the preceding video and its exact final frame are available. Eight 4K nine-cell boards cost an estimated 32 credits at the earlier 4-credit rate. Their role is to preview the timed people, material actions and route, not to supply real video history. The existing library is reused; no missing library pass is scheduled.

| Portion | Story window | Duration | Library images | Video refs including SB + EF | Prompt | Incoming frame |
|---|---|---:|---:|---:|---|---|
| 01 | 0–30 s | 30 s | 32 | 33 | [01](01/video.txt) | None |
| 02 | 30–60 s | 30 s | 46 | 48 | [02](02/video.txt) | EF01 |
| 03 | 60–90 s | 30 s | 28 | 30 | [03](03/video.txt) | EF02 |
| 04 | 90–120 s | 30 s | 26 | 28 | [04](04/video.txt) | EF03 |
| 05 | 120–150 s | 30 s | 31 | 33 | [05](05/video.txt) | EF04 |
| 06A | 150–165 s | 15 s | 46 | 48 | [06A](06/video.txt) | EF05 |
| 06B | 165–180 s | 15 s | 44 | 46 | [06B](06/video_b.txt) | EF06A |
| 07 | 180–200 s | 20 s | 41 | 43 | [07](07/video.txt) | EF06B |

06A uses original beats 1–4; 06B uses 5–9. All 83 prior Block 06 library references remain represented across the two requests. Shared references are repeated only where the new portion needs them. Each full video and storyboard prompt is below the observed 15,000-character limit, with headroom for real imported handles. Recount after binding. The existing `06/video.txt` and `06/storyboard.txt` are part A; only part B adds `video_b.txt` and `storyboard_b.txt`. There is no unsplit 30-second request hidden in these files.

Each continuation has a planned level forward-right boundary pass, but the predecessor's actual ending governs. Review its final frames and motion and update the next prompt before generation if the result differs. The exact extracted frame supplies the opening crop and positions; character references still supply identity. Use a dedicated first-frame role if the UI actually offers one. Generic reference loading has not been proven to lock the frame. The native Extend temporal contract is not assumed.

All 63 story beats, assigned memory events, rating reveal, material action paths and final clinical/title cuts remain in the compact prompts. Repeated global paragraphs were consolidated. A block's nine beats are moments within a continuous shot, not nine cuts; 06's extra boundary preserves the seven-block narrative structure. Keep the first usable take and identify a concrete defect before any proposed paid retry. Prompt wording cannot guarantee continuity.

## 6. Narration and assembly

Generate [the complete narration](narration.txt) once with MiniMax Speech 2.8 HD / Grady, according to [VOICE.md](../00_project/VOICE.md). The seven passage files remain unchanged. No narration input to video generation; native music/ambience/foley only. Keep clean narration separate, measure its actual duration, and place complete sentences with natural pauses against the assembled picture. No speech acceleration or automatic regeneration.

Download and preserve originals. FFmpeg can copy compatible video streams for a straight join; frame edits and spatial repairs require an explicit new render. There is no universal seven-frame trim. Inspect each actual visual and audio join, retain the source narration/background separately, then create the final delivery file. The creator performs upload and Update project film in the UI. Do not assume a soft-subtitle label will be displayed: it was absent in the test.

[Budget: 1979 available, 1882 planned, 97 reserve](../00_project/BUDGET.md) · [reference audit](../04_tracking/FILM_REFERENCE_AUDIT.md) · [pilot evidence](../01_pilot/README.md)

End-frame export finding: the tested Higgsfield JPG matched source frame 94 rather than final frame 96. Extract the actual final decoded frame locally and compare it to the source before assigning an EF Element. The subsequent generated opening also differed from the exported image; extraction alone does not solve that separate pipeline mismatch.


## Final-frame extraction responsibility — agreed 2026-09-11

The creator downloads each accepted original video. Astra uses FFmpeg locally to extract its actual last decoded frame into a new lossless PNG at source resolution, verifies it against the source, and records the source filename and frame index. Preserve the original clip. The creator uploads that PNG and assigns it to the matching EF Element; do not rely on Higgsfield's exported last-frame selection for this production. After import/attachment confirmation, use the authorized read-only MCP lookup to verify the real Element handle and update dependent local prompts. No upload or generation through MCP is implied. Correct extraction addresses the observed early-frame selection, not the separate generated-opening alignment problem.
