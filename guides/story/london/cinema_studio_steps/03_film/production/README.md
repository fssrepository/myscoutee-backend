# Current video requests — P01–P12

The accepted 4-second V00 ident is complete. Generate the following 12 story requests in order, using the linked video.txt files. They total 200 seconds. The old 01–07 files remain the unmodified detailed source chapters; do not use their former generation boundaries.

All 63 original story beats remain. 62 beat paragraphs remain verbatim; in 06.4 only obsolete last-frame/next-clip wording now describes the internal transition at 6 seconds. Musical cues and rating rules are scoped to the actual production request. The existing 216 selected library Elements are still used across the film. Repeated chapter-wide reference lists are replaced by the union needed for the assigned beats. No new storyboard images, panel crops, grids or narration generation.

| Request | Story time | Seconds | Source beats | Refs incl. incoming frame | Characters | 1080p credits |
|---|---|---:|---|---:|---:|---:|
| [P01](P01/video.txt) | 0–15 s | 15 | 01.1 → 01.4 | 22 | 12232 | 135 |
| [P02](P02/video.txt) | 15–30 s | 15 | 01.5 → 01.9 | 27 | 12140 | 135 |
| [P03](P03/video.txt) | 30–45 s | 15 | 02.1 → 02.5 | 28 | 12504 | 135 |
| [P04](P04/video.txt) | 45–60 s | 15 | 02.6 → 02.9 | 29 | 12174 | 135 |
| [P05](P05/video.txt) | 60–80 s | 20 | 03.1 → 03.6 | 27 | 13157 | 180 |
| [P06](P06/video.txt) | 80–105 s | 25 | 03.7 → 04.5 | 28 | 14413 | 225 |
| [P07](P07/video.txt) | 105–135 s | 30 | 04.6 → 05.5 | 26 | 14515 | 270 |
| [P08](P08/video.txt) | 135–150 s | 15 | 05.6 → 05.9 | 27 | 12476 | 135 |
| [P09](P09/video.txt) | 150–160 s | 10 | 06.1 → 06.2 | 25 | 11360 | 90 |
| [P10](P10/video.txt) | 160–170 s | 10 | 06.3 → 06.5 | 28 | 12500 | 90 |
| [P11](P11/video.txt) | 170–180 s | 10 | 06.6 → 07.1 | 25 | 13134 | 90 |
| [P12](P12/video.txt) | 180–200 s | 20 | 07.2 → 07.9 | 25 | 14151 | 180 |

The story clock starts after the ident; add 4 seconds for the full-film clock. At the creator-reported 9 credits/second, these requests cost 1800 in total. Splitting adds no footage seconds. Read the actual UI quote before each paid request.

## What moved

P06 joins the end of original 03 to the start of 04. P07 joins the rest of 04 to the beginning of 05. P11 includes the first Westminster beat of 07. Original 06 therefore runs across P09–P11, with the quiet approach carried forward into the same final part. The 06 three-helpful-gestures passage retains its explicit six seconds. The clinical cut remains at story second 195 and the final title at 198. Other beat intervals are proportionally retimed within their new requests; no beat is dropped. Narration wording and recording stay unchanged; complete sentences will be placed during local assembly.

The 12-request count is the minimum for the recorded complete-beat/reference map even when adjacent original chapters may be combined and the old duration boundaries are ignored. The chosen prompts also fit under 15000 characters and reserve at least one of the observed 30 slots. This does not guarantee model output quality. Counts are unique Element handles: an Element can contain multiple attached images, and the count does not certify eligibility.

## Continuation frames

Reuse the seven existing frame Elements in the order below. Their old Vxx names are container names; their new contents must be extracted from the indicated accepted Pxx video. Never reuse a frame from an unrelated earlier test.

| After accepted request | Frame container for the next request | Status |
|---|---|---|
| P01 | EF01 — `@loc_MYS_mys-film-v01-end-frame_s0_v1` | Existing container; attach locally extracted final frame |
| P02 | EF02 — `@loc_MYS_mys-film-v02-end-frame_s0_v1` | Existing container; attach locally extracted final frame |
| P03 | EF03 — `@loc_MYS_mys-film-v03-end-frame_s0_v1` | Existing container; attach locally extracted final frame |
| P04 | EF04 — `@loc_MYS_mys-film-v04-end-frame_s0_v1` | Existing container; attach locally extracted final frame |
| P05 | EF05 — `@loc_MYS_mys-film-v05-end-frame_s0_v1` | Existing container; attach locally extracted final frame |
| P06 | EF06A — `@loc_MYS_mys-film-v06a-end-frame_s0_v1` | Existing container; attach locally extracted final frame |
| P07 | EF06B — `@loc_MYS_mys-film-v06b-end-frame_s0_v1` | Existing container; attach locally extracted final frame |
| P08 | EFP08 — `@UNBOUND_EFP08` | New definition; import and retrieve actual MCP handle |
| P09 | EFP09 — `@UNBOUND_EFP09` | New definition; import and retrieve actual MCP handle |
| P10 | EFP10 — `@UNBOUND_EFP10` | New definition; import and retrieve actual MCP handle |
| P11 | EFP11 — `@UNBOUND_EFP11` | New definition; import and retrieve actual MCP handle |

[Import the four additional final-frame definitions](../../00_project/elements/additions/PRODUCTION_REPARTITION_FRAMES_IMPORT.md). This is metadata only, not image generation. P09–P12 deliberately contain UNBOUND placeholders until these definitions have been imported and their actual handles queried. Do not paste those four prompts before binding. P02–P08 also need their accepted predecessor frames attached before use. P01 needs no incoming frame.

For every boundary, extract and verify the true last decoded frame locally. Review the outgoing camera direction, gesture and objects before the next generation; adjust only the continuation instructions to the actual accepted result. Do not use the known early Higgsfield end-frame export. Final-frame extraction has zero generative credit cost.

## Local assembly and transition record — 2026-09-11

Build every new preview and the final film from the original downloaded clips, in production order. Do not use a previously concatenated or re-encoded preview as a source for the next assembly. Keep the originals unchanged. The intended final order is the accepted P00 ident followed by P01–P12, with the existing narration added as a separate audio track during finishing. The two previews below contain only P01 and P02 and their generated background audio; neither includes P00 or narration.

### Original sources and extracted frames

Current local media directory: `/home/raxim/Downloads/`.

| Source | Verified video | Verified audio | Extracted final frame |
|---|---|---|---|
| `p01.mp4` | 1920×1080, 24 fps, 361 frames, 15.041667 s, HEVC 10-bit | AAC stereo, 32 kHz, 15.050000 s | `p01_last_frame.png` |
| `p02.mp4` | 1920×1080, 24 fps, 361 frames, 15.041667 s, HEVC 10-bit | AAC stereo, 32 kHz, 15.050000 s | `p02_last_frame.png` |

Both final-frame PNGs were extracted from decoded frame index 360 (zero-based). Extract continuation frames from each original clip, never from an assembly with transitions. Determine the actual last decoded frame for each future clip rather than assuming every clip has 361 frames.

### P01 → P02 join

P01 ends outside the Dog & Duck with the protagonist in front of the restaurant window. P02 starts in a different brick courtyard beneath a glass canopy. Although the P01 final-frame reference was visible in the submitted composer, P02 did not preserve that opening composition.

The initial `p01_p02_preview.mp4` used a direct cut at approximately 15.05 s. Video packets were copied without re-encoding; audio was re-encoded with asynchronous resampling to handle the AAC timestamp overlap at the join.

The revised `p01_p02_preview_dissolve.mp4` uses a short cross-dissolve, following the creator's reference to the transition into the statue view around 3–4 s in P01. This is a local blend between the two moving clips, not a newly generated architectural morph.

| Join setting | Value |
|---|---|
| Picture transition | Linear cross-dissolve, FFmpeg `xfade=transition=fade` |
| Requested overlap | 0.333333333 s, approximately 8 frames at 24 fps |
| Transition start | 14.708333333 s into P01 |
| Picture transition interval | Approximately 14.71–15.04 s on the preview timeline |
| Audio transition | Same overlap, triangular/linear fade-out and fade-in |
| Audio source trim | Each source trimmed to 15.041666667 s before mixing |
| Preview encoding | H.264, CRF 18, preset fast, 8-bit yuv420p; AAC 192 kb/s; faststart |

The rendered revised preview measures 715 video frames / 29.791667 s and 29.749969 s of audio. These measured values include frame/sample rounding; do not derive the final narration timeline from the nominal 30-second prompt total. The picture was re-encoded for this dissolve preview; the original 10-bit files remain the final assembly sources. Final master encoding is not selected yet.

### Reproduce the dissolve preview from originals

Run from the media directory. `-n` prevents overwriting an existing preview; use a fresh output name for another revision.

```bash
ffmpeg -v warning \
  -threads 2 -i p01.mp4 \
  -threads 2 -i p02.mp4 \
  -filter_complex_threads 2 \
  -filter_complex "[0:v]settb=AVTB,setpts=PTS-STARTPTS,format=yuv420p[v0];[1:v]settb=AVTB,setpts=PTS-STARTPTS,format=yuv420p[v1];[v0][v1]xfade=transition=fade:duration=0.333333333:offset=14.708333333[v];[0:a]atrim=duration=15.041666667,asetpts=PTS-STARTPTS[a0];[1:a]atrim=duration=15.041666667,asetpts=PTS-STARTPTS[a1];[a0][a1]acrossfade=d=0.333333333:c1=tri:c2=tri[a]" \
  -map "[v]" -map "[a]" \
  -c:v libx264 -threads 2 -preset fast -crf 18 \
  -c:a aac -b:a 192k -movflags +faststart \
  -n p01_p02_preview_dissolve.mp4
```

For each later join, review the actual outgoing and incoming footage and record the chosen transition and overlap here. The P01–P02 dissolve is the current review version, not a blanket instruction to dissolve every boundary. Account for overlaps when placing narration and the final title; keep whole narration sentences and check the rendered picture/audio timing. Rebuild from originals for each revision so encoding loss and prior transitions do not accumulate.

## Eligibility and spending

C07 failed face/IP eligibility in the UI and needs the already requested replacement original fictional character image, attached to its existing Element. The two MW01_C_03 / MW01_C_04 checks looped; first retry them in the smaller request rather than assume replacement images are needed. Element-level completed status alone is not a passed image eligibility check. P02 uses all three affected Elements.

The creator now reports 1937 credits. Reserve 1800 for the story and the remaining 137 for eligibility-related image replacements or necessary repairs. Skip the separate 480p trial; P01 is intended as the final 15-second 1080p request. Actual per-job quotes and subsequent debits still need tracking. No paid job was launched by this repartition.

[Exact mapping and hashes](plan.json) · [budget](../../00_project/BUDGET.md)
