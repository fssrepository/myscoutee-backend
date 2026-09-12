# Current video requests — P01–P12

The accepted 4-second V00 ident is complete. Generate the following 12 story requests in order, using the linked video.txt files. They total 200 seconds. The old 01–07 files remain the unmodified detailed source chapters; do not use their former generation boundaries.

All 63 original story beats remain. At initial repartition, 62 beat paragraphs remained verbatim and only 06.4 changed its boundary wording. Later continuity and staging revisions are recorded below and in the linked tracking reports; the current prompts include those revisions. Musical cues and rating rules are scoped to the actual production request. The existing 216 selected library Elements are still used across the film. Repeated chapter-wide reference lists are replaced by the union needed for the assigned beats. No new storyboard images, panel crops, grids or narration generation.

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
| [P10](P10/video.txt) | 160–170 s | 10 | 06.3 → 06.5 | 28 | 14934 | 90 |
| [P11](P11/video.txt) | 170–180 s | 10 | 06.6 → 07.1 | 25 | 14542 | 90 |
| [P12](P12/video.txt) | 180–200 s | 20 | 07.2 → 07.9 | 25 | 14938 | 180 |

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

## Remaining production order and credit allocation — 2026-09-12

Creator pacing assessment: with more credits, the dense clips would have received longer durations to let camera travel and gestures read. Treat duration/event density as a production constraint in later model evaluation. Improvement from longer takes is untested, and this note does not change the current clip durations or the P11 → P12 → optional P10 priority.

P11 preparation was checked against the 12:03 composer screenshots and all 25 live Element attachments; see [P11_PRE_GENERATION_CHECK.md](../../04_tracking/P11_PRE_GENERATION_CHECK.md) for exact bindings, image-review scope and the incoming-frame pixel comparison. No prompt change or generation followed that check.

Live balance checked at 361.2 credits. Prioritise P11 (10 s / last observed 90 credits), then extract and attach its verified final frame for P12 (20 s / 180). This leaves an estimated 91.2 credits for the creator's optional later P10 retry (10 s / 90), with 1.2 left afterward. Confirm the actual composer quote; no retry is included automatically. P12's incoming P11-frame Element is currently empty. P11 and P12 must therefore proceed sequentially.

The P10 retry prompt is prepared; the successful earlier P10 prompt is archived in [P10_COMPLETED_RETRY_PROMPT.txt](../../04_tracking/P10_COMPLETED_RETRY_PROMPT.txt). P10 now uses one curved desk-to-lawyer-to-table route, P11 strengthens the rise and descent through occupied levels, and P12 preserves its scripted withdrawal into stillness. See the [remaining-credit review](../../04_tracking/P10_PRE_GENERATION_CHECK.md) for validation, P06 sampling and current character counts. A P10 retry made after P11 must match the completed P11 opening as well as the P09 ending before replacing the original; retain the original and its frame until both joins have been reviewed. No new output is claimed by these prompt edits.

## Generated spatial-transition defect and P11–P12 revision — 2026-09-12

P11 has since completed with a confirmed hard scene change at frame 208 (8.666667 s) into the Westminster panorama. Regeneration is ruled out. [Local repair and P12 correction](../../04_tracking/P11_WESTMINSTER_TRANSITION_REVIEW.md) records the completed `/home/raxim/Downloads/p11_fixed.mp4`: four moving blended frames (206–209), original duration and AAC unchanged. Frames 0–141 are copied; frames 142–240 are encoded losslessly because of HEVC dependencies. All 237 unaffected decoded frames, audio payloads/timestamps and the final frame match the original. The 178,400,996-byte output preserves 1080p/24 fps/10-bit BT.709; only HEVC compatibility headers are normalized. Reproduce with `tools/p11_transition.py --media-dir /home/raxim/Downloads` (refuses to overwrite). The creator accepted the repair and noted its larger lossless file size. P12 now descends from the actual elevated endpoint and retains the skyline.

Creator-selected camera reference: P06 has the most spectacular camera movement in the current film; use its actual footage as the comparison reference for later motion reviews. This records the creator’s preference, not a new frame-by-frame comparative analysis. Before transferring a specific move to another prompt, check its path, speed changes, parallax and available space against that clip’s incoming frame and story actions.

P10's completed retry has repeated vertical scene wipes, uneven movement and partial transparent overlap; the creator rejects the page-turning effect and reports much better earlier clips and other camera movements. This is an output-quality/instruction-following bug, separate from P10's generic generation failure. See [the P10 motion review and follow-up](../../04_tracking/P10_PRE_GENERATION_CHECK.md#completed-retry-motion-and-transition-review) for source provenance, observed intervals and limits of the diagnosis. “Seedance 2.5” is the creator's version attribution; the recorded job identifies Cinema Studio 4.0, not an independently verified underlying version.

P11 and P12 now use continuous visible floors/supports and multiple occupied spaces in depth, with a specific smooth camera curve rather than successive full-frame room reveals behind moving edges. P11 starts at the actual P10 six-person table, pulls back and rises, then descends toward the separate public walker. P12 advances diagonally along the bed spaces and local foot/rope details before approaching the glass. Local material folds remain; whole-scene page turns and lateral wipes are prohibited. All events, reference handles, beat times and sound sections are retained, including P12's deliberate clinical/title cuts. Both prompts fit the 15,000-character limit. These revisions have not yet been validated in generated output.

This changes instructions for internal generated transitions only. The recorded short inter-clip assembly dissolve remains a separate editing decision.

## Local assembly and transition record — 2026-09-11

Build every new preview and the final film from the original downloaded clips, in production order. Do not use a previously concatenated or re-encoded preview as a source for the next assembly. Keep the originals unchanged. The intended final order is the accepted P00 ident followed by P01–P12, with the existing narration added as a separate audio track during finishing. The two previews below contain only P01 and P02 and their generated background audio; neither includes P00 or narration.

### Original sources and extracted frames

Current local media directory: `/home/raxim/Downloads/`.

| Source | Verified video | Verified audio | Extracted final frame |
|---|---|---|---|
| `p01.mp4` | 1920×1080, 24 fps, 361 frames, 15.041667 s, HEVC 10-bit | AAC stereo, 32 kHz, 15.050000 s | `p01_last_frame.png` |
| `p02.mp4` | 1920×1080, 24 fps, 361 frames, 15.041667 s, HEVC 10-bit | AAC stereo, 32 kHz, 15.050000 s | `p02_last_frame.png` |

Both final-frame PNGs were extracted from decoded frame index 360 (zero-based). Extract continuation frames from each original clip, never from an assembly with transitions. Determine the actual last decoded frame for each future clip rather than assuming every clip has 361 frames.

### P01 → P02 proposed memory crossing — 2026-09-12

**Current status: paused; crop-release preview rejected.** The creator says the local zoom/cross-dissolve experiment does not reproduce the statue’s dreamlike change. Do not reuse that preview or continue it. The latest direction is to reuse the actual P01 statue transition and the existing Python recipe, without inventing another effect.

The creator requests the feeling of a person stepping from one memory into another, taking the near-successful statue change around seconds 3–4 of P01 as the visual reference. This is a design proposal, not a rendered or accepted replacement for the current four-frame assembly transition.

Source inspection for this proposal sampled P01 seconds 13–15 and P02 seconds 0–2 at 4 fps, and the P01 statue transition around seconds 3–4 at 12 fps. P01 ends with a near, front-facing man outside the Dog & Duck window; P02 begins with a more distant figure walking across a brick courtyard. These samples do not establish a matching stride, identity or camera velocity at the boundary. No full audio review was performed.

Proposed action: retain the departing memory behind the crossing person; show the destination beyond a physical edge before crossing. Carry one foot's swing, torso rotation and grounded landing continuously into the new space. Let the landing coincide with a brief approximately four-frame environment transition, retaining one opaque, anatomically consistent person and continuous contact shadows. Use the window jamb/brick pier and paving seams as spatial anchors. The source's frontal close scale must ease into the destination's wider side view through camera travel rather than an instant size change. No duplicated transparent body, frozen pose, full-frame blackout or rubber-like architectural warp. The short statue-style transition supplies the pace; it does not by itself create this missing action.

A provisional 0.5–0.8 s connecting action would provide room for the step, with the actual environmental change concentrated around the foot plant. Duration is a design estimate, not a tested fit. A literal continuous crossing needs newly authored connecting footage because a matching step is not established in the inspected endpoints. A local four-frame blend alone can suggest an associative memory change, but should not be described as a physically continuous step. Do not identify P02's score-bearing figure as P01's protagonist or transfer the visible score to him without resolving identity against the actual footage. Preserve the originals and the existing assembly; no additional generation, retiming or transition render has been performed for this proposal.

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

### P02 → P03 alignment revision

The creator observed a backward jump and upward displacement at this join. P03 starts in the expected canopy-and-tram scene, but its opening geometry is slightly smaller and displaced relative to P02's final image. A background-feature fit on the upper architecture was used to separate this framing mismatch from independently moving pedestrians and vehicles.

Current review output: `p01_p03_preview_aligned.mp4`. It retains the existing P01–P02 dissolve and replaces the direct P02–P03 join with the following trimmed and aligned entrance. Visual acceptance of this revision remains pending.

| Edit | Exact preview setting |
|---|---|
| P03 source | Original `p03.mp4`, 1920×1080, 24 fps, 361 frames |
| Removed frames | Source indices 0 and 1 (zero-based), 2/24 s |
| First retained frame | Source index 2; 359 P03 frames remain |
| Spatial target | Original P02 final frame, index 360 |
| Initial transform | Source-to-output affine matrix below, in full-resolution pixels |
| Correction duration | First 30 retained P03 frames, indices 0–29 of the trimmed clip |
| Correction decay | `t = n / 29; w = 1 - (3*t*t - 2*t*t*t); A(n) = I + w*(M-I)` |
| After retained frame 29 | Identity transform; no continuing crop, zoom or translation |
| Resampling in preview | OpenCV `INTER_CUBIC`, `BORDER_REFLECT_101` for small exposed edges |
| P03 audio | Trim original audio from 0.083333333 s to 15.041666667 s, reset timestamps |
| P02–P03 transition | Direct join of corrected frames; no added picture dissolve or sound effect |
| Existing preview audio | Pad to its video duration, then trim at 29.791666667 s before appending P03 audio |

```text
M = [[1.0116949679854472, -0.0019158942211959815, 5.572761497034969],
     [0.0019158942211959815, 1.0116949679854472, 2.698868875843136]]
I = [[1, 0, 0],
     [0, 1, 0]]
```

The matrix maps source pixel coordinates to corrected output coordinates. Apply it before any preview scaling. The first corrected frame aligns the incoming architecture to the preceding ending; the smooth decay releases the correction over approximately 1.25 s. This does not claim pixel-perfect continuity of independently moving people or objects.

For this quick review only, the existing `p01_p02_preview_dissolve.mp4` was reused and the corrected P03 was appended. Preview processing uses 8-bit BGR / yuv420p, H.264 CRF 18 and AAC 192 kb/s. These settings are not the final-quality workflow.

### P02 → P03 revision 2: contrast match and short dissolve

The creator still observed a small jump and a washed-out P03 entrance in the first alignment preview. Revision 2, `p01_p03_preview_aligned_color_v2.mp4`, supersedes that direct-join review version. It retains the two-frame P03 trim and the 30-frame spatial correction above, then adds the following processing. Acceptance remains pending creator review.

Static upper-architecture samples showed elevated shadow levels and reduced contrast in the incoming image. After spatial alignment, apply `corrected = input * gain + offset` independently to B, G and R channels. Coefficients below use decoded preview code values in the 0–255 range:

```text
B: gain 1.080217758202677,  offset -11.16006403170023
G: gain 1.0804238251311418, offset -13.325359396944952
R: gain 1.0563823762283022, offset -10.879140492164233
```

For retained P03 frame `n` from 0 through 47, use `t=n/47` and `w=1-(3*t*t-2*t*t*t)`. Effective gain is `1+w*(gain-1)` and effective offset is `w*offset`. Clip the preview result to 0–255. From frame 48 onward, apply no colour correction. This releases the match smoothly over approximately two seconds. The coefficients describe encoded RGB sample values, not linear-light values; final replay must account for sample range and colour conversion. For an equivalent normalized RGB implementation, divide offsets by 255 and retain the gains. Do not reduce the final processing precision to 8-bit to reuse these coefficients.

At the P02–P03 join, apply a linear picture cross-dissolve of 0.25 s (approximately six frames), beginning at 29.541666667 s in the current P01–P02 preview. Apply a matching 0.25 s triangular audio crossfade. This replaces the direct join in revision 1; the P01–P02 transition remains unchanged. Recalculate this offset from original-source rendered frame counts during final assembly, including the earlier overlap. This short blend softens residual differences in independently generated motion; it is not a guarantee of exact motion continuity.

### P02 → P03 revision 3: four motion-interpolated bridge frames

The creator confirmed the colour was now satisfactory but identified a remaining motion jump resembling missing frames, requesting additional frames rather than further trimming. Review candidate `p01_p03_preview_bridge4_v3.mp4` retains revision 2's spatial and colour corrections and the existing two-frame P03 source trim. It replaces the P02–P03 six-frame overlap with four newly interpolated frames inserted between the complete P01–P02 preview and corrected P03. This is a four-frame trial, not a confirmed optimum or recovered original footage. The P01–P02 dissolve remains unchanged.

Bridge endpoints: A is frame 714 of `p01_p02_preview_dissolve.mp4` (its last frame); B is frame 0 of the spatially and colour-corrected P03 segment (original source index 2). The four intermediate times are `t = 1/5, 2/5, 3/5, 4/5`. Insert them at 24 fps, adding 4/24 s without overlapping either endpoint clip. In this preview, the bridge starts at 29.791666667 s and the retained P03 segment starts at 29.958333333 s.

Preview interpolation uses OpenCV DIS optical flow, `DISOPTICAL_FLOW_PRESET_MEDIUM`, computed in both directions on grayscale 960×540 endpoint images. Resize each flow field to 1920×1080 and multiply displacement vectors by two. With forward flow F (A→B), backward flow R (B→A), and output coordinate grid X, calculate `warpA = remap(A, X-t*F)` and `warpB = remap(B, X-(1-t)*R)`, using cubic interpolation and reflected borders. The output is `(1-t)*warpA + t*warpB`. Check the walking limbs, tram edges and occlusions for interpolation artefacts before accepting this candidate.

For the inserted audio interval, take the last 1/6 s of the padded P01–P02 audio and the first 1/6 s of trimmed P03 audio. Crossfade these excerpts with triangular curves over 1/6 s to make a bridge, and insert it between the full adjacent audio segments. This repeats small ambient excerpts; review the join by ear before final acceptance. No narration or newly generated audio is added.

Final replay must compute the corrected endpoint images from originals at high precision. Low-resolution grayscale flow estimation is only a motion-analysis proxy; remap and blend the original-resolution, at-least-10-bit images in a high-precision pipeline. Never reuse these 8-bit interpolated preview frames for the final master.

### P02 → P03 revision 4: hold opening geometry

The creator described a spring-like movement and differing endpoint geometry. The earlier 30-frame release of the affine correction could introduce an opposing scale/position movement during the opening camera travel. Review candidate `p01_p03_preview_bridge4_v4.mp4` therefore retains the same affine matrix throughout the opening street section. It keeps revision 3's four interpolated bridge frames, source trim and audio bridge, and revision 2's colour correction unchanged.

For retained P03 frames 0–164, apply the full matrix M. Release it only during the later rapid scene transition: for retained frame `n=164..175`, set `t=(n-164)/11`, `w=1-(3*t*t-2*t*t*t)`, and `A=I+w*(M-I)`. From frame 176 onward use the identity transform. The release corresponds to original P03 source frames 166–177 (approximately 6.92–7.38 s). This replaces the 30-frame spatial decay in all earlier recipes; do not apply both decays. Colour still releases over the original 48 retained frames. Review acceptance and any remaining generated motion mismatch are pending.

### Revision 4 rejected — motion and audio diagnosis

The creator rejected the spring-like geometry and reported an audio jump. Revisions 3 and 4 are experimental, not accepted final edit recipes. Do not automatically replay their optical-flow bridge or repeated audio excerpts into the final master. The colour match was separately reported satisfactory.

Frame comparison found no geometric edit introduced at preview seconds 26–29 relative to the earlier P01–P02 preview; mean absolute decoded 8-bit differences were approximately 0.9–1.5 levels from additional encoding. The P02–P03 bridge begins at 29.791667 s. A perceived event around 27 s must therefore also be checked against the original P02 internal transition. All inspected video streams are 1920×1080 at 24 fps; the fitted geometry correction uses uniform scale and rotation, not separate horizontal/vertical stretching.

Background feature measurements against P02 frame 360 show differing source camera scale trajectories: the correction scale for P02 frame 344 is about 0.98994 and approaches 1.0 by frame 360; P03 frame 0 requires about 1.01425, decreasing to about 0.96352 by frame 48. Thus the originals themselves reverse their apparent scale movement across the join, with additional small P03 fluctuations. The early affine decay and local optical-flow interpolation can add further apparent elasticity. More interpolated frames alone do not establish continuous camera movement.

Next correction must address the measured camera trajectory as a whole, retain the accepted colour, and avoid locally deforming static architecture. Rework the audio join without replaying boundary snippets; revision 3/4's repeated excerpts are a potential audible discontinuity. No corrected successor to revision 4 has yet been accepted.

### P02 → P03 original-quality comparison: constant alignment

The creator requested a fresh comparison from original `p02.mp4` and `p03.mp4`, preserving quality, then identified a remaining leftward jump. This candidate supersedes the experimental preview recipes for the current review; it is not yet visually accepted. It contains P02 and P03 only. The preceding uncorrected comparison is `p02_p03_original_quality.mp4`, whose video and AAC packet payloads match the two originals in order.

Corrected outputs in the local Downloads directory: `p02_p03_spatial_aligned_lossless.mkv` (FFV1 master) and `p02_p03_spatial_aligned_lossless.mp4` (lossless HEVC copy for upload testing). Higgsfield acceptance of these exports has not been verified. MP4 uses the originals' HEVC / 10-bit format family, with the `hvc1` tag.

Retain all 361 frames of each original: 722 frames at 24 fps, 1920×1080, with P03 beginning at frame 361 / 15.041667 s. P02 decoded pixels remain unchanged. Apply the following constant source-to-output matrix to every P03 frame, including its ending. There is no animated release, frame removal, inserted bridge, dissolve or colour correction in this comparison.

```text
Y plane matrix M:
[[1.014711517037021, -0.001650698165160679, 2.7279979513516137],
 [0.001650698165160679, 1.014711517037021, 1.6022900500953343]]

U and V plane matrix C:
[[1.014711517037021, -0.001650698165160679, 1.367264180393772],
 [0.001650698165160679, 1.014711517037021, 0.8052355788482126]]
```

Decode directly to planar `yuv420p10le`: Y is 1920×1080, U and V are 960×540, each stored as unsigned 16-bit samples. Warp each plane separately with OpenCV `warpAffine`, `INTER_CUBIC`, `BORDER_REFLECT_101`, using M for Y and C for chroma. C uses `C.translation = (M.translation + M.linear*[0.5,0.5] - [0.5,0.5])/2`. Limit cubic overshoot to the 0–1023 sample domain and retain 10-bit output precision. Preserve limited-range BT.709 tags. This geometric resampling changes P03 pixels and slightly crops/enlarges the view; lossless encoding preserves the resulting samples without further compression loss. No separate horizontal/vertical scale adjustment is applied.

Encode the master with FFV1 level 3, coder 1, context 1, slice CRC enabled and `yuv420p10le`. Copy the AAC stream from the original stream-copy comparison, without re-encoding or repeated boundary excerpts. That comparison required a roughly 22 ms AAC timestamp adjustment at the join; original compressed audio payloads are preserved, but this does not establish perceptually continuous sound.

Create the MP4 from the lossless master with:

```bash
ffmpeg -i p02_p03_spatial_aligned_lossless.mkv \
  -map 0:v:0 -map 0:a:0 \
  -c:v libx265 -preset fast \
  -x265-params 'lossless=1:pools=2:frame-threads=2' \
  -pix_fmt yuv420p10le -tag:v hvc1 -vsync cfr -r 24 \
  -c:a copy -movflags +faststart \
  -n p02_p03_spatial_aligned_lossless.mp4
```

Validation of the FFV1 master found 722 decoded frames matching the encoder-input SHA-256 hashes per clip. P02's decoded samples are unchanged, and all 944 original AAC packet payloads are retained in order. The master is 796,212,755 bytes; lossless compression is substantially larger than the approximately 106 MiB original stream-copy join. Changing the container to MP4 does not itself reduce size. The creator questioned this size; encoding a smaller delivery copy awaits clarification of the earlier no-quality-reduction requirement.

The creator also reported a residual saturation/colour difference. A robust fit on aligned static architecture in the original 10-bit planes found a larger luminance/contrast difference than chroma difference. Trial code-value mappings are Y `1.0501197581387722*x - 41.15201880260138`, U `1.0179209131189408*x - 6.4400212624719915`, V `1.0302460501176716*x - 16.614469773527233`. On the selected samples, median absolute Y error falls from 23.29 to 13.40 levels; U from 4.61 to 3.25 and V from 3.67 to 2.94. These are measured candidate coefficients, not an accepted grade, and are not applied to the constant-alignment exports above. A frame-pair fit does not establish the correct grade for all later P03 scenes.

The uncorrected `p03_last_frame.png` remains the original P04 reference. Because this candidate also transforms P03's ending, later final assembly must explicitly reconcile that geometry with P04; do not silently replace the original reference or assume the correction ends before the boundary.

### Earlier P02 → P03 review: original-bitrate MP4 with entrance colour match

The creator reported the constant spatial alignment approximately satisfactory, but still saw a colour/saturation difference and rejected the excessive lossless export size. The following review copy implements that correction at the original combined video bitrate. This supersedes the pending size clarification above: the latest instruction permits an original-bitrate delivery encode, while keeping resolution, frame rate and 10-bit precision. Lossless files are not required as the review deliverable.

Output: `p02_p03_aligned_color.mp4` in Downloads. Render from the original stream-copy `p02_p03_original_quality.mp4`, whose encoded video payloads are unchanged from P02 followed by P03. Retain all 722 frames. Apply the exact constant M/C plane transforms recorded above to P03 only. Do not introduce another spatial correction, animated geometry, optical-flow bridge, trim or dissolve.

Apply the measured Y/U/V colour mappings above after spatial resampling, only during P03 frames 0–47 (zero-based). With `t=n/47` and `w=1-(3*t*t-2*t*t*t)`, use effective gain `1+w*(gain-1)` and offset `w*offset`. At frame 47 the grade reaches identity, and later frames remain ungraded. Process unsigned 10-bit planes through float64 arithmetic, round to nearest integer and constrain to 0–1023. This two-second release limits a boundary colour fit to the entrance rather than grading unrelated later memories.

Encode HEVC Main10 with libx265 preset `fast`, `pools=2:frame-threads=2`, video bitrate `29120847` bits/s (measured from the original combined stream), `yuv420p10le`, `hvc1`, limited-range BT.709, 1920×1080 at 24 fps, and MP4 faststart. Copy the original AAC packets. This is a lossy delivery encode at the source's average bitrate, not pixel-identical or lossless; retain the originals and exact edit settings for final assembly. The target is approximately the original combined file size, rather than the 0.8–1+ GB lossless experiments. Perceptual acceptance of the colour correction remains pending.

Validation: the completed colour-matched MP4 is 115,784,444 bytes (115.8 MB / 110.4 MiB), compared with the original join's 110,596,623 bytes. Actual average video bitrate is 30,508,731 bits/s after single-pass rate control. Full decoding confirms 722 frames, 1920×1080, 24 fps, `yuv420p10le`, limited-range BT.709, and all 944 original AAC packet payloads unchanged. The corrected boundary image pair was inspected; creator playback acceptance remains pending. The exact spatial and colour settings are recorded above for reproduction from the originals.

### P02 → P03 smoothing recipe for later assembly: short picture and sound overlap

The creator still observed an abrupt picture change and a small sound jump in `p02_p03_aligned_color.mp4`, then reported softer detail. A combined candidate was started as `p02_p03_aligned_color_smooth.mp4`, but the creator clarified that the deliverable must be a standalone corrected P03 for Higgsfield upload. The combined render was stopped and its incomplete output moved out of Downloads. The overlap settings below are a proposed later-assembly recipe, not a completed or accepted deliverable. Apply them to original P02 and the standalone corrected P03 described below; do not apply P03's spatial/colour correction twice.

Picture: overlap P02 source frames 353–360 with corrected P03 source frames 0–7. For overlap index `j=0..7`, blend 10-bit planes in float64 with `t=(j+1)/9`, output `(1-t)*P02[353+j] + t*corrected_P03[j]`, rounded and constrained to the 10-bit domain. Retain P02 frames 0–352 beforehand and corrected P03 frames 8–360 afterward. This yields 714 output frames / 29.75 s at 24 fps. The eight-frame overlap starts at output frame 353 / 14.708333 s and ends before frame 361 / 15.041667 s. No optical-flow deformation, animated alignment release or additional synthetic bridge frames are used. Blended moving edges can soften temporarily during the 0.333333 s transition; review the actual playback before acceptance.

Sound: measured half-second windows around the previous direct join differed by approximately 5.8 dB RMS. Trim each original 32 kHz stereo audio stream to 481333 samples, reset timestamps, then apply `acrossfade=ns=10667:c1=qsin:c2=qsin`. This overlaps the original audio in place, with no repeated boundary excerpts. The resulting 951999 samples span 29.74996875 s. Intermediate sound is floating-point PCM; the delivery MP4 encodes AAC at 288 kb/s. Audio is necessarily re-encoded for this edit, unlike the preceding direct-join export.

Detail: two static-architecture crops of the preceding MP4 had approximately 3–5% lower Laplacian variance than its pre-encode colour-corrected image; this is a local metric, not a perceptual sharpness percentage. The inspected opening pair had approximately 46.2 dB RGB PSNR. The smoothing revision changes the encoder from x265 `fast` to `medium`, with `sao=0:strong-intra-smoothing=0`, retaining the 29,120,847 bits/s target, HEVC Main10, 1920×1080, 24 fps and BT.709. No sharpening filter is added. The final bitrate and size depend on single-pass rate control; visual and sound acceptance remain pending creator review.

### Current deliverable: standalone P03 for Higgsfield upload

The creator explicitly requires corrections in the individual P03 clip, followed by assembly later. Deliver `p03_fixed.mp4` from original `p03.mp4` only. Preserve all 361 source frames, their order, 1920×1080, 24 fps, 10-bit limited-range BT.709 and the original AAC packet content. No P02 frames, picture overlap, audio crossfade, source trim or extra padding are baked into this file.

Apply constant geometry M/C to all P03 frames and the recorded colour match with the 48-frame release. Encode once from the original with HEVC Main10 / `hvc1`, x265 preset `medium`, `pools=2:frame-threads=2:sao=0:strong-intra-smoothing=0`, and target bitrate `30342392` bits/s, measured from original P03. Copy audio without re-encoding. No sharpening filter is added. The higher-quality encoder settings address the small encoding-related detail loss without changing resolution or deliberately increasing file size to a lossless master.

The short picture and sound overlap above belongs to subsequent assembly. Uploading this corrected clip alone does not apply or validate that boundary transition. Keep original `p03.mp4` unchanged and preserve this recipe for final reproduction. The final frame of the corrected clip has different geometry from the original; provide `p03_fixed_last_frame.png` as a separate continuation reference without overwriting the original `p03_last_frame.png`.

Completed validation: `p03_fixed.mp4` is 52,326,264 bytes (52.3 MB), duration 15.05 s including audio. Full decoding confirms all 361 video frames, HEVC Main10, 1920×1080, 24 fps. All 471 original AAC packet payloads match the source. Single-pass video rate control produced an actual average of 27,546,825 bits/s against the 30,342,392 bits/s target; this is a lossy delivery encode, not a lossless master. `p03_fixed_last_frame.png` was extracted from this completed file's final decoded frame as 1920×1080 RGB48 PNG. Neither file has been uploaded or attached to a Higgsfield Element by this edit.

The creator requested completion of this version and continuation with the remaining clips, accepting that the join may remain imperfect. Treat this as the current working P03, without claiming the proposed later-assembly transition has already been rendered or approved.

### Direct-copy baseline: P02 + fixed P03 without encoding

The creator requested a simple copy join first, explicitly excluding further whole-video encoding or transitions. Current output: `p02_p03_fixed_joined.mp4`, assembled from original `p02.mp4` and completed `p03_fixed.mp4`. The attempted full combined transition render was stopped. Neither input is overwritten. There is no new spatial/colour processing, trim, frame overlap or audio crossfade in this assembly.

Direct MP4 concatenation initially exposed differing track timescales and HEVC parameter sets. Correct the packaging without re-encoding: remux each input to MPEG-TS with `-c copy -bsf:v hevc_mp4toannexb`, concatenate those two TS files with the concat demuxer, then remux to MP4 with `-c copy -bsf:a aac_adtstoasc -tag:v hev1 -movflags +faststart`. Retaining each segment's in-band HEVC parameter sets is necessary; equal packet payloads alone did not prove a valid direct MP4 join. Validate decoded frames across both complete clips, not only packet counts.

Completed validation: all 722 decoded output frame hashes match the input frames in order, with no decoder errors. All 944 AAC packet payloads match the inputs. The MP4 is 105,359,877 bytes (105.4 MB), with 30.144 s container duration, 1920×1080 and 10-bit HEVC. Container timestamps were remuxed; no image or audio encoding occurred in this final assembly.

If the creator rejects this direct join, edit only the necessary boundary sections and copy all other encoded footage unchanged. Determine safe decoder/keyframe boundaries before cutting HEVC; do not promise an arbitrary few-frame smart render without checking prediction dependencies. No further full-video re-encode is authorized merely to adjust a short transition. The original `p02.mp4` and `p03.mp4` remain the recovery sources; `p03_fixed.mp4` is a separate corrected derivative.

### Rejected local P02 → P03 trial — retain the bounded-edit method

The creator initially reported that this local approach looked good on 2026-09-11, then explicitly rejected the result and stopped further work. `p02_p03_local_join_fix.mp4` is not accepted and must not be used as the final assembly recipe. The last technical revision was not fully validated before the stop. Retain the bounded-edit methodology below, but do not automatically replay this transition. Keep original sources and the direct-copy baseline.

**Default for future repairs: inspect the join, identify the smallest safe editable interval, render only that interval, and stream-copy everything else. Do not re-encode the whole film to fix a short boundary.** Establish the actual HEVC prediction dependencies before choosing cuts; a visible eight-frame transition can require a longer encoded segment. Use the completed individual corrected clip for upload, and a separate assembled file for review.

| Section | Source frames, zero-based | Handling |
|---|---|---|
| Prefix | P02 0–349 | Copy all 350 original encoded video packets |
| Local replacement | P02 350–360 plus fixed P03 0–167 | Encode 171 output frames, including the eight-frame overlap |
| Suffix | Fixed P03 168–360 | Copy all 193 original encoded video packets |

P02's first 350 coded packets cover exactly presentation frames 0–349, without omitted references needed for that prefix. P03's frame 168 at 7 s is the first usable random-access boundary after the entrance. These checks permit 543 output frames (22.625 s) to remain unchanged. Only the 171-frame local block (7.125 s) is re-encoded. Do not expand the edit back to P02's previous keyframe unnecessarily.

Within the local block, retain P02 350–352, then blend P02 353–360 with fixed P03 0–7. For `j=0..7`, use `t=(j+1)/9` and `(1-t)*P02[353+j] + t*P03_fixed[j]` on decoded 10-bit Y/U/V planes in float64, rounding and clipping to 0–1023. Append fixed P03 8–167. There is no extra zoom, alignment release, local optical-flow warp or sharpening. The result has 714 frames / 29.75 s; the visible transition occupies 14.708333–15.041667 s.

Encode only that local block at 1920×1080, 24 fps, HEVC Main10 / limited-range BT.709, target 30,342,392 bits/s, x265 `medium`, with `pools=2:frame-threads=2:sao=0:strong-intra-smoothing=0:open-gop=0:keyint=120:min-keyint=120:scenecut=0`. The closed 120-frame GOP resets the local picture-order numbering before appending the copied P03 CRA segment; the first local attempt without this reset produced duplicate-POC decoder errors and is not the deliverable.

Audio is also repaired locally. At 32 kHz, use a 10,240-sample (0.32 s) quarter-sine crossfade after trimming each source to 481,280 samples (15.04 s). The 0.32 s overlap aligns to ten AAC frames. Copy the first 450 P02 AAC packets (including its priming packet); replace only 31 AAC packets; then copy fixed P03 packets 21–470 inclusive. For the replacement, extract mixed PCM samples 455680–495615 (four AAC frames of preroll, 31 replacement frames, four postroll frames), encode AAC at 288 kb/s, and retain encoded ADTS frames 5–35 inclusive, discarding the priming/preroll and postroll. Concatenate the resulting 931 ADTS packets and mux with audio timestamp offset `-0.032` to account for the retained source priming packet. This preserves 900 original compressed audio packets and changes 31 packets / 0.992 s. Audio duration is 29.76 s; its P03 offset differs from the picture overlap by about 12 ms. Do not re-encode the complete soundtrack or repeat boundary excerpts.

Remux the three video sections to MPEG-TS using `-c:v copy -bsf:v hevc_mp4toannexb`. In the concat manifest, explicitly specify section durations `14.583333333`, `7.125` and `8.041666667`; inferred TS durations caused timestamp discontinuities. Mux the concatenated video and repaired AAC to MP4 using stream copy, `aac_adtstoasc`, `hev1` and faststart. Preserve each section's HEVC parameter sets. Verify complete decoding, continuous 24 fps presentation timestamps, unchanged decoded frame hashes for prefix/suffix, and unchanged AAC payload hashes outside the repaired packets before delivery.

### Original-source comparison: P00–P03 copied together

At the creator's request, assemble original `p00.mp4`, `p01.mp4`, `p02.mp4` and `p03.mp4` in that order as `p00_p03_originals_joined.mp4`. Do not use `p03_fixed.mp4` or any earlier combined preview. Use the MPEG-TS / Annex-B stream-copy route described above to retain each clip's HEVC parameters, then remux to MP4. No encoding, correction, trimming or transition is applied. Container timestamps may be adjusted while compressed picture and audio content are preserved.

Deferred P01–P02 follow-up: if the earlier join masks a defect that belongs to an individual clip, fix that standalone clip before final assembly and keep its corrected uploadable version. Do not solve it only inside the assembled preview. The creator explicitly deferred this work; record it here without editing P01 or P02 now.

### Current review: P00–P02 plus fixed P03, copy only

The creator subsequently requested the same direct assembly using `p03_fixed.mp4`. Output: `p00_p03_fixed_joined.mp4`, containing original `p00.mp4`, `p01.mp4`, `p02.mp4`, then `p03_fixed.mp4`, in that order. Use the same MPEG-TS / Annex-B stream-copy remux route. No new encoding, transition, trimming or correction is applied during this assembly. The prior `p00_p03_originals_joined.mp4` remains available for comparison; neither it nor the individual inputs is overwritten. The existing corrections and compression in `p03_fixed.mp4` are preserved as supplied.

### Final-quality replay requirements

The recorded operations are now available in [`tools/p03_edit.py`](tools/p03_edit.py). Run from the repository root:

```bash
python3 guides/story/london/cinema_studio_steps/03_film/production/tools/p03_edit.py fix --media-dir /home/raxim/Downloads
python3 guides/story/london/cinema_studio_steps/03_film/production/tools/p03_edit.py join --media-dir /home/raxim/Downloads
```

`fix` requires original `p03.mp4` and the existing `p03_fixed.mp4`, whose unchanged suffix it preserves. It encodes only the opening seven seconds from the original, then replaces `p03_fixed.mp4` after verification. Do not delete the existing fixed clip before running this command; replacement is automatic. `join` copies P00, P01, P02 and the completed fixed P03 into `p00_p03_fixed_joined.mp4` without encoding. Run `join` alone when only assembly is required. Both commands verify decoded frame hashes and audio packet hashes before publishing their outputs. Verification decodes footage but does not encode it. Source files `p00.mp4`–`p03.mp4` are never overwritten; temporary work is cleaned up after each command. Dependencies: Python 3, FFmpeg and ffprobe; `fix` also needs NumPy and OpenCV.

Latest P03 opening revision: the creator identified a remaining glass-canopy vertical bob and requested a standalone correction followed by a copy-only P00–P03 assembly. Keep the filename `p03_fixed.mp4` (no `fixed2` filename), and update `p00_p03_fixed_joined.mp4` only by remuxing the completed individual clips. The previously rendered large assembly is never the processing input.

Roof-feature measurements against P02 frame 360 found a roughly 2-pixel downward change between fixed P03 frames 0 and 1. No missing-frame-sized timestamp gap was found at the assembled boundary. Add only the following vertical output translations to the existing geometry matrix for P03 frames 0–12, in full-resolution pixels:

```text
[1.481895685, -0.130573865, 0.519374825, 2.075102453,
 1.150093254, 1.276978378, 1.383933208, 2.046457979,
 0.673420906, 0.607318391, 0.058070323, 0.138346587, 0.0]
```

These offsets fit a smooth roof trajectory at image coordinate (800,250): start at the P02 ending with vertical velocity 0.605 pixels/frame, then join P03's measured frame-12 position and velocity using a cubic Hermite curve. The endpoint is −5.506411641 pixels relative to the reference, with velocity −0.338460449 pixels/frame. Subtract each measured source roof position from the target curve to obtain the offsets above. This adds no scale or rotation. Add the full offset to the Y-plane matrix translation and half to the chroma-plane translation before the single existing resampling operation. From frame 13 onward the additional translation is zero; keep the existing entrance colour correction unchanged.

Render P03 frames 0–167 directly from original `p03.mp4`, applying the existing M/C matrices, this opening correction and the recorded colour grade. Use the same 10-bit HEVC settings and source-bitrate target, with a closed 120-frame GOP. Only this initial 7 s must be encoded because the unchanged suffix starts at random-access frame 168. Copy the previous fixed clip's frames 168–360 and all original P03 AAC packets. No picture/audio transition is baked into the standalone clip or the large copy-only assembly. Preserve 361 frames, 1080p, 24 fps and 10-bit precision. Creator acceptance of this new opening adjustment remains pending.

Completed outputs for this revision: `p03_fixed.mp4` is 52,638,885 bytes; its full decode matches the new head plus the unchanged 193-frame suffix, and all original AAC payloads match. Running the versioned script's `join` command produced `p00_p03_fixed_joined.mp4` at 167,178,090 bytes, with all input frame and audio payload hashes verified. The script's `--help` and actual copy-only join were exercised; the bounded head render was executed by the preceding equivalent recorded command, without repeating the encoder solely to test the CLI wrapper.

Reapply the recorded trims, overlaps and affine correction directly to the original downloaded clips. Retain their original 1920×1080 resolution, 24 fps and at least 10-bit image precision throughout processing and output. Do not use the 8-bit preview intermediates, OpenCV's default 8-bit video decoding path, or the preview CRF/bitrate settings for the master. No bitrate reduction is authorized for final assembly. Render changed frames through a high-precision pipeline into a lossless master/intermediate; preserve audio without further lossy generations. Transition blending and geometric resampling change pixels, but their outputs must not incur an additional lossy encoding step in that master. Any separate delivery compression requires its own agreed settings.

Replay and inspect every corrected join on the original sources. Use measured rendered frame/sample counts for narration placement; the existing preview has rounding and padding that must not silently become final timing decisions. Keep the final ident and title placement consistent with the resulting timeline.

### P02 → P03 short dissolve from original sources

The creator rejected the remaining canopy bob in the fixed version and requested a short transition like the street-to-statue change around 3–4 s in original P01. Frame inspection shows approximately four blended frames there. This revision uses original `p02.mp4` and `p03.mp4`; the deleted fixed derivative is not reconstructed. The earlier opening correction above is historical, not an accepted repair.

Reproduce the new review with:

```bash
python3 guides/story/london/cinema_studio_steps/03_film/production/tools/p03_transition.py --media-dir /home/raxim/Downloads
```

Output: `p00_p03_transition.mp4`, original P00–P03 in order with only the P02/P03 boundary changed. P00/P01 and P01/P02 retain plain joins. Originals are never overwritten. This is an assembly transition, not a new standalone fixed P03 upload. Creator acceptance remains pending.

- Copy P02 frames 0–353. Encode a 179-frame boundary block: P02 354–356, four blends of P02 357–360 with P03 0–3 using incoming weights 1/5, 2/5, 3/5, 4/5, then P03 4–175. Copy original P03 176–360 from its 7.333333 s random-access point.
- Blend in 10-bit YUV; keep 1920×1080, 24 fps, original geometry and colour. Encode only that block using the recorded 30,342,392 bit/s HEVC target and closed 120-frame GOP. The rest of the assembly is stream-copied: 997 of 1176 output frames. The visible dissolve is four frames / 0.166667 s; HEVC dependencies require encoding 179 frames / 7.458333 s. This is a lossy local delivery encode, not a lossless master or whole-film encode.
- Audio uses a 5120-sample / 0.16 s quarter-sine overlap at 32 kHz. Copy P02 AAC packets 0–449 and P03 packets 21–470. Replace only 36 packets / 1.152 s. Encode mixed samples 455680–500735 with four packets of preroll and postroll; keep encoded ADTS packets 5–40. Trim each source audio to 481280 samples before mixing; mux with −0.032 s priming offset. The joined audio lasts 29.92 s versus 29.916667 s of picture; P03 audio placement differs by approximately 5 ms.
- Use the MPEG-TS/Annex-B copy route with explicit video section durations 97/24, 361/24, 14.75, 7.458333333 and 7.708333333 s for P00, P01, P02 prefix, bridge and P03 suffix respectively. Concatenate these five video TS segments directly. Do not remux the mixed-parameter boundary MP4 back through `hevc_mp4toannexb`: reinjecting its first SPS/PPS at later IDRs caused decoder errors. Concatenate audio separately from P00, P01 and the audio-only boundary TS, then mux both tracks by copy. The full picture is 1176 frames / 49 s; the dissolve starts at 33.958333 s.
- Before publishing, validate complete decoding, unchanged copied frame hashes, copied AAC payload hashes, 1080p/24 fps/10-bit format and continuous presentation timestamps. Verification decodes the untouched footage without re-encoding it.

The command retains unpublished work if verification fails and prints its private directory. `--resume-work DIRECTORY` reuses the rendered boundary for a remux/validation retry; use it only with the same original inputs and transition recipe. A successful fresh run cleans up its temporary work. A resumed directory is retained for explicit inspection.

Completed validation: `p00_p03_transition.mp4` is 166,500,073 bytes, with 1176 picture frames / 49.000 s and 1536 AAC packets / approximately 49.035 s including container padding. All 997 copied picture frames match their original decoded hashes; the complete decode matches the copied sections plus the rendered block. All assembled AAC payloads match the prepared audio sections, including the 900 preserved P02/P03 packets. Every successive picture timestamp differs by 1/24 s within TS timestamp rounding. Keep every video concat input video-only and every audio concat input audio-only; mixed stream layouts initially omitted boundary audio and introduced a 32 ms picture timestamp discontinuity. Both were corrected by remuxing the existing rendered block, without another picture encode.

Planning lesson from the creator: ending a scene near each generation boundary would make assembly easier than requiring exact continuation of a fast camera move. A prompt cannot establish that the generated clip actually ends the scene; review the generated ending before preparing its continuation. No regeneration or prompt rewrite is requested for this assembly.

### Current assembly rule: the same short transition at every P00–P12 clip boundary

The creator requested one repeatable assembly method for the remaining film rather than individual editing experiments: use the approximately four-frame photographic dissolve seen at P01's 3–4 s statue change at every inter-clip boundary, with the same short audio crossfade. This is a 0.166667 s transition at 24 fps, not a 3–4 second dissolve. Use the original downloaded clips; keep their internal generated transitions untouched. The full P00–P12 assembly follows this rule as the remaining source clips become available.

For the currently available P00–P03 clips:

```bash
python3 guides/story/london/cinema_studio_steps/03_film/production/tools/p03_transition.py --media-dir /home/raxim/Downloads --all-joins
```

This supersedes the earlier P00/P01 and P01/P02 plain joins. Output remains `p00_p03_transition.mp4`. Blend the outgoing last four moving frames with incoming frames 0–3, using incoming weights 1/5, 2/5, 3/5, 4/5. No frame hold, optical-flow warp or new spatial/colour adjustment is added. The completed P02/P03 bridge can be reused in a matching retained work directory as `bridge2.mp4`; it already came from the originals, so reusing it avoids another picture encode. Resume only with the same original inputs and recipe.

| Video section | Source frames, zero-based | Handling |
|---|---|---|
| P00 prefix | P00 0–91 | Copy 92 frames |
| First boundary | P00 92, then P00 93–96 blended with P01 0–3, then P01 4–249 | Render 251 frames from originals |
| P01 middle | P01 250–353 | Copy 104 frames |
| Second boundary | P01 354–356, then P01 357–360 blended with P02 0–3, then P02 4–249 | Render 253 frames from originals |
| P02 middle | P02 250–353 | Copy 104 frames |
| Third boundary | Existing original-source P02/P03 bridge | Reuse 179 rendered frames |
| P03 suffix | P03 176–360 | Copy 185 frames |

The first usable incoming random-access point in original P01 and P02 is frame 250 / 10.416667 s, so their initial prediction-dependent blocks must be rendered when modifying their opening frames. Preserve the remainder by copy; never re-encode the full assembly. Target each incoming original's reported video bitrate, retaining 1080p, 24 fps and 10-bit precision. At the P01/P02 copied CRA starts, remove the four preceding RASL pictures with `filter_units=remove_types=8|9`; verify decoded equality to frames 250–353 before assembly. Normalize the final HEVC headers as described below so VLC does not restart its decoder at these joins.

The assembled picture has 1168 frames / 48.666667 s. Dissolves start at 3.875, 18.75 and 33.625 s. Each overlap removes four frames from the combined duration; use this revised timeline for later narration placement.

For audio, use 126 complete post-priming AAC frames from P00 and 470 from each later original. At each boundary apply the existing five-AAC-frame / 0.16 s quarter-sine overlap, encoding only a 36-packet / 1.152 s replacement window with four packets of preroll and postroll. The compressed assembly order is P00 packets 0–105; replacement 01; P01 packets 21–449; replacement 12; P02 packets 21–449; replacement 23; P03 packets 21–470. This yields 1522 AAC packets including one initial priming packet, with 1414 copied and 108 newly encoded. Mux with −0.032 s priming offset. Decoded duration is approximately 48.672 s, within 6 ms of picture duration. Keep audio and video as separate streams until final copy muxing.

Completed P00–P03 all-boundary output: `p00_p03_transition.mp4`, 158,497,905 bytes, 48.672 s container duration, 1168 picture frames. Complete decoding and picture/audio hash checks passed, with continuous 24 fps picture timestamps. VLC command-line playback around each of the three boundaries reported no profile-level mismatch or missing-reference error; the full audio stream decoded successfully. The source clips are unchanged. Final visual acceptance remains with the creator.

### VLC pause before the dissolve — header-only compatibility correction

The creator accepted the dissolve's character but reported a freeze immediately before it in VLC. Software decoding and VAAPI hardware decoding yielded identical moving frames; frame hashes alone did not detect the playback problem. VLC 3.0.20 logging reproduced `mismatched profile level 2/123 was 2/120`, followed by decoder teardown/recreation. Original clips declare HEVC level 4 (120), while the locally encoded bridge declares level 4.1 (123).

Normalize HEVC metadata consistently to level 4.1, explicit chroma sample location 0 and access-unit delimiters. Preserve encoded picture content and AAC with `-c copy -bsf:v hevc_metadata=level=4.1:chroma_sample_loc_type=0:aud=insert -tag:v hev1 -movflags +faststart`. Do not lower the bridge's declared level or re-encode the picture to address this mismatch. The assembly command now applies this filter during final muxing. Repair an existing assembly independently with:

```bash
python3 guides/story/london/cinema_studio_steps/03_film/production/tools/p03_transition.py --media-dir /home/raxim/Downloads --normalize-only
```

The header-only remux preserved all 1176 decoded picture hashes and all AAC packet hashes. The VLC comparison no longer reported the profile-level mismatch. This validates the identified decoder reconfiguration problem; final visual playback acceptance remains with the creator. The dissolve, timing, geometry, colour and encoded image quality are unchanged.

### P04–P12 prompt restoration after the overly broad opening rewrite

The creator rejected the broader permission to choose a fresh composition and camera path. Commit `c7a075dc` had changed seven lines in each P04–P12 prompt, including opening, timing, reference-role and material/camera wording. All nine local prompts are restored byte-for-byte to `c7a075dc^`, the version immediately before that rewrite. Their original opening-continuation wording is restored; P03's extra absolute-priority block is not propagated into them. Story beats, durations, references and sound instructions are unchanged by this restoration.

The short assembly dissolve remains an editing decision. It does not authorize loosening the generation prompts. P04 was already generated with the broader wording before this restoration; restoring the local file does not change that downloaded clip or the historical submitted request. P03 and earlier prompt files are unchanged.

### P03 final frame for P04

`p03_last_frame.png` is extracted from original `p03.mp4`, decoded frame index 360 (the 361st frame), at 1920×1080. It is not extracted from the corrected or compressed preview. The P04 reference container is `@loc_MYS_mys-film-v03-end-frame_s0_v1`; extraction alone does not attach the PNG to that Element.

## Eligibility and spending

C07 failed face/IP eligibility in the UI and needs the already requested replacement original fictional character image, attached to its existing Element. The two MW01_C_03 / MW01_C_04 checks looped; first retry them in the smaller request rather than assume replacement images are needed. Element-level completed status alone is not a passed image eligibility check. P02 uses all three affected Elements.

The creator now reports 1937 credits. Reserve 1800 for the story and the remaining 137 for eligibility-related image replacements or necessary repairs. Skip the separate 480p trial; P01 is intended as the final 15-second 1080p request. Actual per-job quotes and subsequent debits still need tracking. No paid job was launched by this repartition.

[Exact mapping and hashes](plan.json) · [budget](../../00_project/BUDGET.md)

### P11 original final frame for P12

At the creator’s explicit correction, `/home/raxim/Downloads/p11_last_frame.png` was extracted directly from original `p11.mp4`, not the fixed derivative: zero-based frame 240 (241st frame), PTS 10.000000 s, 1920×1080, 16-bit RGB PNG. The original and fixed last decoded 10-bit YUV frames have identical SHA-256 `32eda199f75f0476680bd30caac442aa7246eabcf20cb01ef82bb5a63ed6d539`. P12’s local opening matches the elevated skyline and gradual descent; 14938 characters, 25 unique references. Preparation may proceed with this image for `@loc_MYS_mys-film-p11-end-frame_s0_v1`. Extraction does not upload or attach it, and this local check does not verify the live composer.

### P12 composer double check

The 12:45 composer screenshots and all 25 live attachments were checked; see [P12_PRE_GENERATION_CHECK.md](../../04_tracking/P12_PRE_GENERATION_CHECK.md). The P11 end-frame Element is now populated. Settings match 20 s, 1080p, 16:9, audio On, 180 credits. No visible warning or missing reference was found. Uploaded scene/crop matches the original P11 endpoint, with a documented RGB-value difference. No prompt edit or generation was performed; output continuity and provider acceptance remain unproven.
