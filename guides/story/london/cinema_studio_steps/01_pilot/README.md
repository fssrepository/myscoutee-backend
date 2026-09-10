# Small continuity test — 4 seconds + 4 seconds

Current scope, 2026-09-10: two video generations total, the second a native forward extension of the first. Approximately 8 seconds joined, followed by one continuous narration overlay. The creator reports **2036 credits remaining**. No generation or debit occurred during this preparation. Actual 4-second generation, Extend and audio-finishing quotes are not yet verified; do not halve an old 8-second quote and present it as a current price.

The subject is a simple restaurant moment. Spectacle, landmark morphs and full-film coverage are not requirements for this test. Earlier complex 8+8-second prompts and instructions are archived in `../04_tracking/archive/pilot_before_4s_smoke_test/`.

| Step | Prompt | Settings |
|---|---|---|
| 1 | [First video](test_video_4s.txt) | 4 s, 16:9, 480p if offered, audio ON, one output |
| 2 | [Native continuation](test_extend_4s.txt) | Select the actual first result; native Forward Extend, 4 added seconds, same resolution/FPS/audio |
| 3 | [Narrated result](test_narrated_video.txt) | One continuous sentence over the complete approximately 8-second source; preserve picture and native bed |

Use the existing selected Cinema Studio/native Extend workflow if it offers these settings. The read-only MCP model search did not expose a native Extend model. A written duration does not change UI controls; if the selected operation lacks a 4-second option, report that constraint before spending or substituting another duration/model. The two visual jobs are sequential because Extend requires the first result.

## Three existing references

All three Elements were verified to contain an image in the current workspace:

- `@char_MYS_mys-c01-protagonist_s0_v1` — protagonist.
- `@char_MYS_mys-c02-soho-woman_s0_v1` — seated woman.
- `@loc_MYS_mys-mw01-a-london-social_s0_v1` — restaurant/table/chair/door layout; use only its relevant restaurant views.

No new still generation or full Element reimport is needed. Check the two faces, wardrobe and room details against these inputs. This is a reference-fidelity check; with no matched reference-free control it cannot quantify how much references improve the model.

## Native join and narration

Use the native cumulative result if it contains the complete first clip and added portion. Measure actual duration and boundary. Do not append the first part again to an already cumulative output. If only the added portion is returned, retain both original parts for assembly without duplicated or dropped boundary frames.

Review around the actual seam at normal speed and frame by frame: walking phase, camera motion, faces, hands, table/cup/door geometry, light and object positions. Listen for room-tone changes, repeated musical attacks, gaps and clicks before adding voice. No visual dissolve or audio repair should conceal a native seam failure in this test.

Narration: “Sometimes the only thing that survives the cut is a smile.” One natural 5–6-second take, roughly 1–7 seconds of the whole result, with voiced words crossing the seam. Keep an unnarrated original to compare.

**The Higgsfield TTS route is confirmed; the web UI post-generation mixing route remains unverified.** See [narration route and evidence](NARRATION_ROUTE.md). Do not treat a narration prompt as proof that an overlay tool exists. [Full A01 voice audition](test_narration_audio.md) remains deferred and is outside this small test.

Record actual model/settings, input Elements, source and Extend IDs, measured duration, seam location, audio route and actual charges. No automatic extra attempts, A/B renders, upscale or full-film generation are scheduled.
