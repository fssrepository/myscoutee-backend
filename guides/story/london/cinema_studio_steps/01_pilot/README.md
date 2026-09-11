# Small continuity test — 4 seconds + 4 seconds

Current scope, updated 2026-09-11: generate only the next four seconds from the existing video as a reference. The active prompt is `test_extend_4s.txt`; it now describes the ordinary References-mode continuation trial. Keep updating these three prompt files in place; do not create a new file for each revision. The first clip is generated. The earlier video-plus-narration trial reportedly changed the picture and added speech but did not continue the action. Native Extend remains an alternative, not the current selected trial. Approximately 8 seconds joined, followed by one continuous narration overlay. The creator extended the test on 2026-09-11 to include the actual Publish workflow and playback of the published result. Completion requires that published playback, not only a local or generation preview. The creator reports **2036 credits remaining**. No generation or debit occurred during this preparation. Actual 4-second generation, Extend and audio-finishing quotes are not yet verified; do not halve an old 8-second quote and present it as a current price.

The subject is a simple restaurant moment. Spectacle, landmark morphs and full-film coverage are not requirements for this test. Earlier complex 8+8-second prompts and instructions are archived in `../04_tracking/archive/pilot_before_4s_smoke_test/`.

| Step | Prompt | Settings |
|---|---|---|
| 1 | [First video](test_video_4s.txt) | 4 s, 16:9, 480p if offered, audio ON, one output |
| 2 | [Next four seconds](test_extend_4s.txt) | Attach the source video in References mode; output 4 s, audio ON; leave separate narration out |
| 3 | [Narrated result](test_narrated_video.txt) | One continuous sentence over the complete approximately 8-second source; preserve picture and native bed |
| 4 | Publish the completed technical test | Inspect the actual publishing preview, submit the test, and retain its published URL |
| 5 | Review published playback | Check full duration, image seam, narration, retained native background sound and any publication-applied branding |

Use Cinema Studio References mode for the current trial; the word “extend” in the filename or prompt does not select native Extend. The read-only MCP model search did not expose a native Extend model. A written duration does not change UI controls; if the selected operation lacks a 4-second option, report that constraint before spending or substituting another duration/model. The continuation uses the completed first result as its preceding context.

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

## End-to-end test — current checkpoint, 2026-09-11

The first 4-second clip has already been generated. Prepare `test_extend_4s.txt` with that clip as the source reference, 4-second output, 16:9, native audio enabled, one output and 480p if offered. Record the visible model, duration controls and complete-input quote. If a requested setting is unavailable, resolve that actual constraint before substituting a model or duration. The narration specification is used after the native extension, not as this first video prompt.

Then proceed sequentially through existing first clip → next-four-seconds reference trial → inspect the unmodified join → add one narration track → inspect the finished output → Publish → playback on the published page. Narration mixing remains a capability question described in NARRATION_ROUTE.md; it must actually be performed before the narrated publishing check is marked complete. No additional logo render is required to start this 4+4-second technical test.

At Publish, inspect the actual fields, target, accepted duration/resolution and preview rather than assuming these match generation settings. Use a clearly identified technical-test publication; do not silently replace the existing film submission. If the chosen publishing route rejects this short test, record that exact restriction and identify the supported route without turning it into a longer paid film automatically. Do not insert or modify festival branding based on assumptions; inspect whatever the publication process actually applies.

After publication, retain the URL and replay from the beginning, across the roughly 4-second seam, and to the end. Verify that no segment was duplicated/dropped, the picture and soundtrack remain synchronized, the narration is complete, the native audio has no new gap/click/restart, and platform processing has not introduced a different cut or level change. Compare with the finished pre-publish result. Record any failure at the stage where it appears. The test is not complete while only the generation preview has been reviewed.

Current execution status: first clip generated and Grady narration prepared, as reported by the user; the earlier combined trial added narration and changed the image without continuing the action. The current next-four-seconds trial, final assembly and published test URL are not yet verified. Last creator-reported balance is 2036; not a new live balance reading. No generation or publication was executed by this documentation update.
