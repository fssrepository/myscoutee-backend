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
