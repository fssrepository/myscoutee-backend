## Latest creator decision — 2026-09-11

Version 10 (`10_TEST_PUBLICATION_soft_subtitles.mp4`) is selected for the test; version 11's additional two-frame cut was rejected. Version 10 keeps version 08's picture/audio and embeds a separate default subtitle track. The creator reports the uploaded subtitle was not visible, chose not to burn it in, and completed the UI route through Update project film with watermark added. The upload/publication checkpoint is creator-reported complete; no published URL or independent playback inspection has been recorded here. Further pilot repair/generation is not scheduled. Continue with [main-film preparation](../03_film/README.md). Earlier pending/review-candidate statements below are historical.

# Small continuity test — 4 seconds + 4 seconds

## Current checkpoint — 2026-09-11

The two clips have been downloaded and assembled locally with FFmpeg. The narrated first clip is followed by the unnarrated continuation, with the second Grady recording added over the continuation. The combined result is approximately 8.08 seconds. Upload, Publish and review of published playback are still pending; the end-to-end test is not complete.

The creator will commit these notes. This document is the continuation record for the assistant as well as the creator: retain the observations below when resuming instead of reconstructing a different test plan.

## Goal and working constraints

- Preserve the original Seedance picture without another lossy encode. The test measures the model's continuity, not an editor's ability to conceal the seam.
- Keep downloaded source videos and narration files unchanged. Create separate output files for assembly and removal experiments.
- Do not spend more credits retrying this pilot. Continue toward upload and Publish with the existing result.
- Use local FFmpeg for assembly. The creator operates the Higgsfield UI; do not upload or start generation through MCP without explicit authorization for that action.
- Update existing prompt files in place. Do not create another prompt variant for each revision.

## Inputs used in the assembled result

All four files were supplied in `/home/raxim/Downloads/`:

| Role | File |
|---|---|
| Narrated first clip | `hf_20260911_045948_dc0fdaab-8c79-4bab-b846-f40a84080a7e.mp4` |
| Unnarrated continuation | `hf_20260911_070152_727a9946-0720-476c-a100-0be18752e94c.mp4` |
| First standalone Grady narration | `hf_20260911_045642_dcc227fb-2bc3-4079-a0f5-6da4bbc492de.mp3` |
| Second standalone Grady narration | `hf_20260911_051710_b6811498-7508-4e47-bb4f-1ea6589d1c65.mp3` |

The first standalone recording says “Sometimes the only thing that survives the cut is a smile.” The second says “For a moment, that was enough.” Their container durations are approximately 4.31 and 2.64 seconds respectively. The first sentence is already mixed into the first video's soundtrack, so it was not added a second time to the main assembled output.

The supplied end-frame image was `d0be92b5-32ed-4c57-8c55-78db5b922caa.jpg`, assigned by the creator to `@loc_MYS_mys-test-v01-end-frame_s0_v1`.

## Picture continuity: measured result and limitations

Both videos are H.264, 854 × 480, 24 fps, with 97 frames and a video duration of 4.041667 seconds each. The combined video contains all 194 frames in order. FFmpeg copied the encoded video streams; decoded frame hashes were verified against the concatenated source frame hashes. No frames were removed, duplicated or changed by the assembly, and no visual transition was added. The join is at approximately 4.041667 seconds.

Frame-by-frame visual comparison shows a discontinuity: the continuation starts with different framing and different screen positions for the woman and table. It does not precisely retain the supplied reference composition. The supplied reference also differs from the first clip's literal final frame, so the source-to-reference mismatch and the reference-to-generated-opening mismatch must not be conflated. The comparison image preserves all three views.

**Google Flow / Veo comparison — creator-reported prior experience:** In an earlier Google Flow Veo test, the continuation jumped backward, and removing seven frames at the join made it continuous. That older footage has not been inspected in this test. Do not assume the same seven-frame correction applies to Seedance: the current Seedance evidence shows a framing discontinuity, not a verified seven-frame replay. We have not established that trimming alone would fix it.

The purpose of this trial is to establish whether Seedance can supply a usable join while retaining its original picture quality. It has not demonstrated a seamless join in this particular Element-reference trial. This does not establish the behavior of every Seedance mode or the native Extend implementation. Frame-accurate trimming is a separate operation; arbitrary cuts in compressed video are not automatically possible with stream copy because of keyframe dependencies.

## Reference coverage and prompt state

The first restaurant prompt, [test_video_4s.txt](test_video_4s.txt), uses the protagonist, Soho woman and restaurant Elements.

The completed continuation was generated from the end-frame Element alone. The creator reported that it did not retain the intended character well enough. After generation, [test_extend_4s.txt](test_extend_4s.txt) was corrected to include both:

- `@loc_MYS_mys-test-v01-end-frame_s0_v1` — opening composition and spatial state;
- `@char_MYS_mys-c02-soho-woman_s0_v1` — the seated woman's identity.

**The revised two-reference prompt has not been generated or validated.** Do not describe the existing result as a test of that revision. No new paid retry is authorized.

For the seven main film blocks, retain their assigned character, location and object references and add the preceding final frame where continuation requires it. The frame counts toward the observed 50-reference limit. The pilot's minimal reference set is not a replacement for the main film's reference coverage. The main seven video prompts were not changed during this documentation update.

## Local outputs and audio observations

Outputs are in `/home/raxim/Downloads/MyScoutee_test_assembly/`. They are local artifacts outside this repository and will not be included in a normal repository commit.

| Output | Contents |
|---|---|
| `01_joined_narrated_test.mp4` | 8.08-second main result: narrated first clip, continuation, second narration starting at 4.5 seconds. |
| `02_narration_removal_trial.mp4` | Separate four-second experiment on the first clip using left-minus-right channel subtraction; unchanged picture. |
| `03_narration_only.wav` | Both original Grady recordings in order, second starting at 4.5 seconds; padded to the combined duration without speech time stretching. |
| `04_frame_join_comparison.jpg` | First clip's final frame, supplied image reference and continuation's opening frame. |

The main assembly preserves the first clip's existing narration and soundtrack. The continuation's background was reduced to 65% amplitude, and the second narration was added at approximately 32.8% of its original amplitude. Source audio was resampled and mixed, then encoded as stereo AAC at 48 kHz / 192 kbps. The no-recompression result applies to the **video**, not to this new audio mix. The decoded final audio peak was approximately −5.9 dBFS, with no measured sample clipping. Subjective listening and the published sound still need review.

Both source videos contain one stereo AAC audio stream, not separately selectable voice and background stems. The first clip's channels correlate at approximately 0.996. Channel subtraction lowered overall RMS from approximately −25.4 to −46.4 dBFS, about 21 dB. This removes shared background content as well as centered voice: it is an experiment, **not a verified clean narration removal**. Do not claim that ordinary FFmpeg track removal can isolate speech from this mixed stream.

The hashes of all four downloaded source files were unchanged after processing. The removal trial's video frames also match the original first clip exactly.

For the full film, the preferred route remains a continuous separately generated narration, retained separately from the background until the final mix. See [test_narrated_video.txt](test_narrated_video.txt) and [narration route](NARRATION_ROUTE.md) for the related preparation; the measured results and current checkpoint in this README supersede older pilot assumptions about duration, references and native assembly.

## Next: upload, Publish and playback

Use the existing main assembled output for the remaining technical checkpoint. The creator uploads it through the project UI. Inspect the actual publishing destination, accepted duration/resolution and any automatically applied branding. Do not silently replace the main film submission or assume that a short technical test meets the festival's entry requirements.

After publication, retain the URL and review the beginning, the join and the ending. Compare picture continuity, full duration, narration timing and background audio against the local assembled file. Check whether platform processing introduces additional changes. Publication may re-encode the upload; preservation by local FFmpeg does not prove that the published version remains unchanged.

Do not mark the test complete until the published result has been reviewed. No new generation, frame trimming, seam repair or upload was performed by this documentation update.

## Follow-up: rejected approaches and trim-only repair

The creator rejected both the narration-removal result and the dissolve approach. For the main film, generate narration as one complete recording and add it after assembling the 3:20 picture. Do not generate narration into the scene clips. Keep music and ambience as the video background and retain the separate narration source until mixing.

`05_joined_softened_seam.mp4` is a rejected dissolve experiment, not the selected result. An optical-flow alignment was inspected on still frames, but was not applied to the trim-only output.

`06_joined_trim_only.mp4` tests removal of the first clip's last three frames and the second clip's first eight frames. It contains 183 frames, lasts 7.625 seconds and has no dissolve, warp or interpolated frames. The native background audio was cut with the picture; the new narration begins at 4.375 seconds. This is a candidate join for playback review, not a claim that the framing difference has disappeared.

Each source contains only one keyframe at its beginning, so these arbitrary frame cuts were encoded with lossless H.264 (`libx264 -crf 0`). This is re-encoding, not stream copy; it avoids further lossy video compression. The retained decoded frames are checked against the exact retained source-frame sequence. All earlier media files remain unchanged.

## Current repair candidate: spatial alignment and two-frame trim

The creator reported that `06_joined_trim_only.mp4` still jumped and that the dissolve was also unacceptable. The trim-only output was no longer present in the output directory at the next inspection; do not claim that this follow-up re-opened that file. The original files and the other retained outputs were available.

Inspection found a spatial discontinuity as well as timing differences: optical flow between first-clip frame 95 and continuation frame 0 had median displacement approximately 11 pixels left and 7 pixels up. This is a local displacement estimate, not proof of a single rigid camera translation. The first clip's frame 96 also had a larger change than its preceding adjacent frames.

`07_joined_spatial_alignment.mp4` omits first-clip frame 96 and aligns the continuation's opening to first-clip frame 95. Dense optical-flow remapping is gradually reduced over the continuation's first 30 frames, returning to its own original framing. It uses no dissolve. It has 193 frames / approximately 8.04 seconds. The other 163 decoded frames match their retained source frames exactly. The altered frames necessarily contain resampled picture content; lossless H.264 encoding avoids additional quantization but does not make the spatial edit an unchanged-source operation. Boundary grayscale mean absolute difference at 214 × 120 dropped from approximately 18.35 in the raw assembly to 2.66 after alignment. This supports reduced discontinuity but is not a perceptual pass by itself.

The creator described version 07 as almost right, with a brief freeze/pause remaining. `08_joined_continuous_test.mp4` therefore removes zero-based frames 96 and 97 from version 07 (the continuation's first two frames), and removes the corresponding 4.000–4.083333-second audio interval. No other picture processing is added. Its 191 retained frames are checked pixel-for-pixel against version 07; duration is approximately 7.96 seconds. The first sentence remains from the narrated source and the second narration is shifted with the audio cut.

**Version 08 was followed by the all-frames comparison below; no final publication choice has been confirmed.** Keep all original media and the raw version 01 for comparison. Do not publish the rejected dissolve or trim-only experiments. These repairs do not demonstrate native Seedance continuity and do not satisfy the original no-video-reencoding goal. Publication and review of the published result remain pending.


## Follow-up: all-frames comparison and confirmed workflow failure

The creator requested a spatial-only version to see whether removing frames actually helped. `09_joined_spatial_only_all_frames.mp4` retains all 194 original frame positions (approximately 8.08 seconds), with no frame removal or duplication. Its first 30 continuation frames are spatially remapped; the other 164 decoded frames match the sources exactly. The audio stream is copied from the raw version 01 assembly.

The creator still saw the join in version 09 and also heard an audio jump. This version has not passed playback review. The audio observation is creator-reported; the assistant has not independently listened to it or established whether the discontinuity comes from the source soundtracks, their local join or the narration mix.

### What actually changed between versions

| Version | Frame handling | Spatial processing | Audio handling |
|---|---|---|---|
| 07 | Remove first clip frame 96; retain 193 frames. | Dense optical-flow remapping of the continuation's first 30 frames toward first clip frame 95, gradually reducing the correction. | Align the background join and second narration to the shorter picture; encode the resulting audio mix. |
| 08 | Additionally remove version 07 frames 96 and 97; retain 191 frames. | Keep version 07's retained picture exactly; no further warping. | Remove the matching 4.000–4.083333-second interval from version 07 audio. |
| 09 | Retain all 194 source frame positions. | Recompute the 30-frame correction toward first clip frame 96 instead of frame 95. | Copy version 01's audio stream, rather than restoring only the removed interval in version 07. |

**Version 07 was not a simple pixel translation or a single-frame trim.** The spatial operation locally warps and resamples picture content over 30 frames (1.25 seconds). Its lossless H.264 encode avoids further quantization loss but does not preserve those altered source pixels. Versions 07 and 09 also differ in alignment target and audio treatment, so they are not a controlled comparison of frame removal alone. The assistant should have disclosed these differences before presenting version 09 as the requested comparison. Do not attribute their entire perceptual difference to one omitted frame.

**Production finding:** This end-frame Element trial exposed two distinct issues: unavailable temporal context and a spatial alignment defect. Local repair was substantially more involved than concatenation or removing a repeated frame: it required spatial warping, trimming and audio timing work. The creator considers this a significant generation failure for the intended continuous-shot film. The visible improvement after repair is an editing result, not proof that Seedance generated a seamless continuation. The supplied-reference mismatch documented above remains a separate contributing factor; this trial does not establish that every Seedance mode or native Extend behaves identically.

Retain the originals and all existing comparison outputs. No new generation or publication is authorized by this finding. The main seven video prompts remain unchanged; the full narration will still be generated separately and added after picture assembly.


### Required continuity support and value concern

The creator expects continuation to use the preceding video's temporal context as well as its last-frame composition. A still frame alone does not specify movement direction, speed or the sound already underway. This is a requirement for the workflow, not a claim that attaching a video in the current composer has been proven to provide that context; the earlier video-reference attempt did not establish reliable continuation either.

The creator considers the need for local spatial warping a serious shortcoming at this generation price. Matching the supplied opening composition should not require manually deforming 30 generated frames afterwards; this spatial defect is separate from the missing temporal context. Document this as a substantial continuity and production-cost problem, rather than routine clip assembly.


### Clarification: temporal context gap versus frame alignment bug

Keep these findings separate in future summaries:

- **Gap — preceding video context:** A single last frame does not establish how the camera or people were moving, or what sound was playing. This workflow did not demonstrate that the continuation model could inspect the preceding video. Do not blame the model for failing to recover motion history that the still image did not supply. The creator notes that this limitation also occurs on other platforms.
- **Bug — spatial alignment:** The generated opening shifted upward and changed positions relative to the supplied reference composition. The still image does contain that spatial information. The observed mismatch is an alignment defect in this trial, independent of the missing motion history. Local warping of 30 frames was a workaround for this defect, not a substitute for video context.

The source-to-reference mismatch remains separately documented; it must not be attributed to generation. The audio jump is also a separate creator observation whose source-versus-assembly cause is unresolved. The public brief now uses separate CONTINUATION CONTEXT GAP and FRAME ALIGNMENT BUG entries.


## Export diagnosis — two distinct mismatches, 2026-09-11

Compared the downloaded `d0be92b5-32ed-4c57-8c55-78db5b922caa.jpg` against every decoded frame of `hf_20260911_045948_dc0fdaab-8c79-4bab-b846-f40a84080a7e.mp4`, then against the opening of `hf_20260911_070152_727a9946-0720-476c-a100-0be18752e94c.mp4`. All are 854 × 480. Frame numbers below are zero-based; the source has 97 frames at 24 fps.

| Comparison | Result |
|---|---|
| Source frame 94 → exported JPG | Closest of all 97 frames: grayscale MAE 1.47/255, 410/413 robust feature matches, scale 1.00004 and fitted translation about −0.006/−0.022 px. No meaningful spatial shift. JPEG differences prevent byte/pixel identity. |
| Source frame 95 → exported JPG | MAE 5.27/255; less similar than frame 94. |
| Source frame 96 (actual final frame) → exported JPG | MAE 10.68/255. The export corresponds to two frame positions earlier, approximately 83 ms before the final source frame. |
| Exported JPG → continuation frame 0 | MAE 15.21/255; dense optical-flow median about 8.1 px left / 7.7 px up. A fitted similarity transform also shows a scale difference (~0.987), so this is not solely a rigid vertical offset. |

**Attribution correction:** the export selected an earlier frame; it did not spatially shift that selected frame. The generated continuation then diverged spatially from the exported reference itself. Both contribute to the source-to-continuation join. It was too strong to assign the whole defect to Seedance: these files do not isolate the model from Higgsfield's reference processing, and the test used an Element reference rather than a verified locked first-frame input. Earlier generic Seedance-bug wording is superseded by this decomposition.

For main-film preparation, extract and verify the actual final decoded frame locally from the accepted original clip before assigning its EF Element. Do not trust a downloaded last-frame label without matching it to the source. This avoids the demonstrated export selection error; it does not guarantee that the next generation will honour the image exactly. The selected delivery remains version 10; no further pilot render was made for this diagnosis. The creator-reported audio jump remains a separate unisolated observation.


## Final-frame extraction responsibility — agreed 2026-09-11

The creator downloads each accepted original video. Astra uses FFmpeg locally to extract its actual last decoded frame into a new lossless PNG at source resolution, verifies it against the source, and records the source filename and frame index. Preserve the original clip. The creator uploads that PNG and assigns it to the matching EF Element; do not rely on Higgsfield's exported last-frame selection for this production. After import/attachment confirmation, use the authorized read-only MCP lookup to verify the real Element handle and update dependent local prompts. No upload or generation through MCP is implied. Correct extraction addresses the observed early-frame selection, not the separate generated-opening alignment problem.
