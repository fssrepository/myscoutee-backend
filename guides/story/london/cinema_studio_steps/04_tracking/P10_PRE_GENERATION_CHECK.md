# P10 pre-generation double check — 2026-09-12

Scope: production P10, with the supplied 11:13:58 and 11:14:05 composer screenshots. The broader image-model instruction-following assessment is deferred at the creator's request.

## Configuration and bindings

- Screenshots: Cinema Studio 4.0, 1080p, 16:9, 10 seconds, audio on, output control 1/4, 28/50 references; Film setup, Camera, Color palette and Lighting are Auto. Generate quotes 90 credits.
- Local prompt: 12,519 characters, 28 distinct handles. Every handle resolves uniquely in the fresh MCP library. Individual reads confirm every Element is completed, with exactly one image and no video attachments.
- All 28 image previews and live descriptions were visually/textually reviewed alongside the complete production prompt. No obvious sensitive requested content was identified. No Face/IP, NSFW, pending-check or “Check eligibility required” warning is visible in the supplied screenshots. These observations do not expose a separate backend eligibility verdict or guarantee output acceptance.
- MW06_B_03 correctly uses the replacement handle without the second mys- prefix; its sole image is the dance-room replacement. MW04_C_01 has the replacement processing-office image, with no old attachment alongside it.
- The screenshots show the beginning of the prompt, not its entire composer contents. Complete equality with the local file is therefore unverified.

## Incoming frame and continuity findings

P09 completed job: d428eb2e-4717-4559-84f4-0274cb615da3. The local p09.mp4 matches the MCP original by SHA-256. Its actual final decoded frame is index 240 of 241, timestamp 10.000000 s, 1920×1080. The local p09_last_frame.png was checked against that frame as RGB48 decoded pixels.

P10's incoming Element contains image b44df1c7-7cbd-4930-a697-15c228aa477b, a 1920×1080 RGB24 PNG. It depicts the same balloon-helper ending, but is not byte- or pixel-identical to the RGB48 local extraction. At full resolution, Pillow RGB comparisons give mean absolute channel differences of approximately 7.52/7.30/6.50 on a 0–255 scale. A 480×270 comparison against all 241 source frames, both raw and channel-mean-centered, finds frame 240 as the closest match. This supports the correct endpoint, but does not establish the upload conversion's exact cause or perfect geometry preservation.

The actual final composition shows the remembered protagonist crouching with two helpers beside a balloon basket in a field, with no visible current street walker. P10's opening still requests current C01 walking onward, continued London exterior evening exposure, and a pavement-to-procedural-desk first beat. That is a continuity conflict with the visible predecessor ending, not an Element-binding or moderation finding. The last three seconds were inspected at two sampled frames per second, plus the true final frame; no complete motion or audio review is claimed.

No prompt rewrite, image replacement, upload or generation was performed during the initial check.

## Follow-up opening repair

At the creator's request, production P10 now begins from the occupied balloon field, keeps the crouching remembered protagonist and helpers in their own space, and reveals an adjoining paved public route through camera travel beside the dry-stone boundary. The desk/rail transformation and policewoman's restrained smile remain within beat 06.3 (0–3 s), overlapping the field exit. The current walker and the separate seated memory protagonist are revealed in their own spaces. Incoming field light is retained before the adjoining dusk city is revealed.

Validation: 14,204 characters (796 below the 15,000 limit); all 28 reference handles and their order are unchanged. The rating rule and all text from beat 06.4 through the end, including the six-person table, cup handover and complete sound instructions, remain verbatim. The prompt changes preserve the requested events and add the missing opening connection. They have not been submitted to the composer or tested in a new generation; the incoming uploaded PNG's colour difference remains unchanged.

## Subsequent generation failure — observed at 11:27:03

The creator reported an error in the P10 attempt. The local screenshot `/home/raxim/Pictures/Screenshots/Screenshot from 2026-09-12 11-27-03.png` shows a new card labelled **Failed** and **Credits refunded**, with the message: “Something went wrong. Please try again, or change your input files or prompt.” It does not show an NSFW or Face/IP label, a job ID, a provider error code or the full submitted payload. Record this as one generic failed-generation incident, separately from P09's sensitive-content rejection. The refund badge is observed; its amount has not been checked against account usage.

The preceding 11:23:40 and 11:23:49 screenshots show the repaired opening text in the composer, highlighted visible Element handles, 28 references, Cinema Studio 4.0, 1080p, 16:9, 10 seconds, audio on and a 90-credit quote. Only the visible portions of the composer text are verified. The later empty composer (0/50) does not establish that the submitted request lost its prompt or references.

A fresh MCP completed-video history read still returns P09 (`d428eb2e-4717-4559-84f4-0274cb615da3`) as the latest completed video. This endpoint lists completed jobs and does not expose the failed P10's backend cause. No attribution to Higgsfield versus Seedance, moderation, the opening repair or a specific image is supported by this evidence. The prepared-input check did not guarantee generation success. No additional prompt edit, image replacement or paid retry was performed during this incident review.

## Completed retry: motion and transition review

The completed P10 retry is job `62c8be6c-929e-43d1-b22b-878645e4180f`. Its submitted 14,204-character prompt matched the repaired local prompt at review time (ignoring terminal whitespace); that version is now preserved in [P10_COMPLETED_RETRY_PROMPT.txt](P10_COMPLETED_RETRY_PROMPT.txt), because the production prompt was subsequently revised. The downloaded original `/home/raxim/Downloads/p10.mp4` has SHA-256 `0bef65b3e06f98d533ee4a677c519bbada555b4b431f20d037f988fab189fad3`. Completion does not establish visual acceptance: the creator reports stuttering and page-like transitions.

Inspection covered all picture timestamps and software decoding; visual review sampled the whole ten seconds at 6 fps, plus consecutive-frame windows at 0.833–1.125, 1.833–2.125, 3.833–4.125, 5.833–6.125 and 8.833–9.125 s, and the extracted final frame. Audio and the creator's player were not reviewed in this pass. There are 241 frames at 24 fps with timestamp steps of 0.041666–0.041667 s. No identical adjacent frames were found in the 480×270 decoded comparison. These checks do not rule out an additional player issue.

Visible findings:

- Around 1.3–2.8 s the field is replaced by the city along a vertical foreground edge, with the basket/field becoming partially transparent during the overlap. This reads as a moving wipe/overlay rather than the requested connected field exit and solid material transformation.
- Around 4.0–4.8 s another vertical edge reveals the seated official and glass-of-water encounter; around 5.8–6.6 s the same device replaces it with the standing lawyer/doorway encounter. Around 8.3–9.0 s it repeats for the table room. The repeated mechanism produces the page-turning impression described by the creator.
- The policewoman's assigned 0–3 s scene is not identifiable in the sampled sequence; the city passage occupies that interval instead. The table only fills the composition around 9 s, leaving about one second of unobstructed group interaction instead of the intended 6–10 s interval. The separate expert reactions and complete supported cup handover are not established in this review.
- Current C01's card is already readable as 6.2 in the city portion, contrary to P10's rule postponing readability until P11.
- The adjacent-frame image changes peak at 1.0, 2.0, 4.0, 6.0 and 9.0 s. At 480-pixel width, whole-frame phase-correlation estimates around 6 s change from about 12 pixels/frame to 26 pixels for one interval; around 9 s from about 5 to 10 pixels. These are approximate screen-displacement estimates with moderate correlation, not calibrated camera velocity. Together with the consecutive-frame views, they support uneven motion within the generated footage rather than an explanation based only on missing container timestamps.

Prompt contribution: the repair added 1,685 characters, changing the opening, lighting/identity context, initial memory/camera handling and beat 06.3; it kept all references and everything from beat 06.4 onward. Adding the field exit, city reveal, separate walker, desk construction, separate seated memory and policewoman's gesture inside the existing first three seconds made an already dense request harder to stage. Repeated instructions to reveal adjoining spaces beyond edges may have reinforced the wipe-like treatment; this is a plausible contribution, not proven model causation. The repair explicitly prohibited transparent overlays and required solid supports, which the output did not reliably follow. Preserving written detail and checking bindings did not validate achievable pacing or visual quality.

Improvement direction for a future revision: keep one camera path and a shared visible floor/support through the encounters; reveal the next action at depth rather than introducing every room as a new full-frame composition behind a vertical wipe. Keep the street as background during the first procedural gesture, stage the official/expert reactions in adjacent occupied alcoves, and make the table visible by its assigned 6 s onset so the handover has time to read. If all specified events cannot be staged clearly within ten seconds, timing must be reconsidered explicitly rather than silently dropping details. For the existing file, limited timing/transition edits might soften jolts, but cannot recover missing gestures or genuine geometric connections; a blanket optical-flow interpolation is not an established fix. No new prompt revision, local video edit or paid generation was performed in this review.

## Follow-up: P11–P12 transition correction — 2026-09-12

The creator explicitly rejects carrying P10's page-turning transitions into P11–P12 and reports substantially better earlier clips with different camera movements. Track this as an observed generated-motion/spatial-continuity bug, distinct from the earlier failed job. The creator calls the model Seedance 2.5; the completed job exposes `cinematic_studio_video_4_0`, so the record does not independently establish an underlying model version or a version-wide regression. Earlier-clip superiority is the creator's comparative observation, not a scored cross-model test. The creator subsequently singled out P06 as the most spectacular camera-movement result and the comparison reference for the remaining clips; no new comparative footage analysis was performed for this note.

P11 now continues from the actual occupied P10 table, retaining the seated people and bright room light, then pulls back and rises along connected floor plates before descending toward the current street walker. Its simultaneous occupied levels replace a serial tour of rooms behind vertical edges. P12 follows an oblique curved path along a shared pavement, retaining preceding bed spaces at depth and keeping the foot panel/rope pocket local in the composition. Both prompts prohibit a whole scene sliding or turning like a page, while retaining physical local object hinges. The P12 clinical cut at 15 s and title transition at 18 s remain intentional.

All Element handles and their order, beat headings/times, and complete sound sections are unchanged. P12 from beat 07.6 onward is unchanged. Full-file lengths, including terminal newline: P11 14,333 and P12 14,847 characters, both below 15,000. This is a prompt correction preserving the story events, not evidence that the next outputs will execute the motion. No movie was altered or generation submitted.

## Remaining-credit review and P10–P12 prompt preparation — 2026-09-12

The creator prioritises P11, then P12, with a possible P10 retry only afterward. Live MCP balance: **361.2 credits**. Using the last observed Cinema Studio 1080p price of 9 credits/second, P11 (10 s) is 90 and P12 (20 s) is 180, leaving **91.2**. A later P10 retry (10 s, 90) would leave **1.2**. These are budget calculations from observed composer prices, not new quotes or a guarantee against price changes. No paid generation or retry was submitted in this review.

P06 comparison: the local `/home/raxim/Downloads/p06.mp4` was sampled at 2 fps across its 25-second duration. The views show a street-corner turn, approach to projecting occupied rooms, an elevated balcony/roof view and lower close views of the procedural hands. This supports borrowing changes of height, side angle and subject distance, rather than treating every scene as a frontal room replacement. It is not a frame-complete smoothness or audio assessment, and does not certify all P06 transitions as continuous.

Current prompt revisions:

- **P10 — 14,934 characters, 28 unique references:** field-boundary construction leads directly to the first procedural desk, with the street in the background instead of a separate establishing pass. The camera arcs beside the desk, rises across the lawyer's room and descends toward the table. The door remains a local hinged object. Expert reactions occupy separate rooms in the same depth view while the table develops; the six people should be established around 7.5 s, leaving the final interval for the supported cup handover and response. The outgoing room retains the current P10 ending's six-person table, central remembered C01, left window, rear kitchen and right bookcase to support the already planned P11 opening. This is a compositional target, not guaranteed pixel or motion matching.
- **P11 — 14,542 characters, 25 references:** retains the actual occupied P10 table opening; the retreating curve now rises toward the first landing, showing the floor underside, then descends toward the public walker. Foreground/background parallax and smoothly varying pace are explicit. It does not add a new flight or replay earlier events.
- **P12 — 14,957 characters, 25 references:** retains its connected-pavement arc. The global material-motion instruction now tapers from local changes at 0–9 s into the quiet glass approach at 9–15 s, instead of demanding continuing fast activity during the scripted withdrawal. The clinical and title sequence from beat 07.6 onward and the sound text are unchanged.

All three retain the prior Element handles and order, beat headings/timing and complete sound sections. Compression in P10 removes repeated general instructions, preserving concrete events, identities and material details. All remain below 15,000 characters. These are prepared prompts; generated adherence remains unverified.

Live boundary check: P11's incoming Element `316e9cda-ca80-48db-9fbf-cfeeed60c662` contains image `d4e14a7a-49b3-4e43-8fdd-9ca05abd86c1`. P12's incoming Element `5e82d91b-189c-4c12-b27f-7b0eeba53493` currently has no image or video. Generate/review P11 first, extract its actual last decoded frame, attach it and reconcile P12's opening with that result before submitting P12. This targeted check is not a fresh review of every library image or the live composer.

If P10 is retried after P11 and P12, keep the existing original P10 and its boundary frame available. Review both P09→replacement-P10 and replacement-P10→completed-P11 before substituting the retry; an improved internal camera move alone does not establish a usable ending. The original P10's early readable 6.2 card remains an observed story-adherence defect until an accepted replacement resolves it. Do not assume another paid repair is affordable within the remaining 1.2-credit reserve.

## Exact checked attachments

| Prompt handle | Element ID | Image ID |
| --- | --- | --- |
| @loc_MYS_mys-film-p09-end-frame_s0_v1 | 67c728e8-585a-46bd-8def-f0db3dafa796 | b44df1c7-7cbd-4930-a697-15c228aa477b |
| @char_MYS_mys-c01-protagonist_s0_v1 | 774b8a46-1402-4342-9e10-403848e8f53e | 0bd3ca76-6f75-4d36-9d47-9bf177669302 |
| @char_MYS_mys-c03-policewoman_s0_v1 | 805c625d-34c3-4b70-8983-7db8dbc945c5 | 0f839597-2688-4451-85ad-cc726a9a77ba |
| @char_MYS_mys-c04-appointed-lawyer_s0_v1 | 66c84208-f1c4-453e-adbe-29262121e032 | dc3c09a6-7cb7-4918-9d7a-35d0e399b522 |
| @char_MYS_mys-c10-beginner-dance-woman_s0_v1 | 2cfe201b-ad86-4569-a60e-2bd96b9806a8 | cff1962e-048a-49a1-8baa-59ff37735f61 |
| @char_MYS_mys-c27-judge_s0_v1 | 72c67cd0-9fea-4933-a0e0-906553f8188d | 404554fa-5fa0-445a-8a4e-d65a32400bdd |
| @char_MYS_mys-c28-forensic-expert-a_s0_v1 | b6968acf-d381-4dd8-b594-e0500b878b52 | 846241ac-ab52-4113-bd7e-736106bfccdf |
| @char_MYS_mys-c29-forensic-expert-b_s0_v1 | 5553a26d-dcff-489c-a548-e6afada33b3b | 4eda3123-a11f-40b1-8d11-cfdbdb2ab66d |
| @prop_MYS_mys-mr017-cabinet-to-desk-and-chair_s0_v1 | 4be852b8-b586-4dca-a693-c793516d223f | 734b93a2-3efd-4b82-a58f-0daea4ea2004 |
| @loc_MYS_mys-mw04-a-police-defence_s0_v1 | eaeb6b48-886c-407a-bcbe-eaaf844135aa | af6cf3ea-e07e-4eb4-8848-1a99c5c5c44b |
| @loc_MYS_mys-mw04-b-02-memory-view-06_s0_v1 | 3bd5ae16-91a1-439f-a217-0aa52ea1e600 | fa59e70f-67c7-42f9-a6a5-ac53664fca30 |
| @loc_MYS_mys-mw04-c-01-memory-view-09_s0_v1 | 677bae2a-0620-4b61-ad82-3735b3196cce | 44e1d229-8150-4120-9520-c65e405b0da5 |
| @loc_MYS_mys-mw05-b-01-memory-view-05_s0_v1 | 3c96713f-5a46-4ed5-85d1-ca06daa97036 | 5d40419c-f655-458a-a374-7080ae2ed069 |
| @loc_MYS_mys-mw06-a-04-memory-view-04_s0_v1 | c1044064-3353-4c29-b8e2-8f6cf10aae19 | ccb7099b-acb7-42d9-a767-f6e456b9498a |
| @loc_MYS_mys-mw06-b-01-memory-view-05_s0_v1 | ff6e7f35-cec5-4713-89ba-8cda9689f9ce | 42ad6933-7020-4466-89fb-5f96bcc2fee9 |
| @loc_MYS_mys-mw06-b-02-memory-view-06_s0_v1 | 050fe7d4-47c7-4554-b5c3-1fd49f973321 | 3ea507a9-cdaf-4a12-b092-04ee5ea7b0c7 |
| @loc_MYS_mw06-b-03-memory-view-07_s0_v1 | 8d3c8452-3af4-484e-a7a7-2e4c9a2e3db7 | 0da9c576-3ed5-4269-8b30-810dc4544e04 |
| @loc_MYS_mys-mw06-b-04-memory-view-08_s0_v1 | 4abc9dc8-519d-468b-a3e1-a87718db010a | 34a87642-e59c-4141-8d00-db1c78f2d041 |
| @loc_MYS_mys-mw06-c-01-memory-view-09_s0_v1 | 92c4944c-dfbf-4061-9736-9bdd6be86660 | 1e693557-1d2c-4d68-b692-d63665027944 |
| @loc_MYS_mys-mw06-c-03-memory-view-07_s0_v1 | 4671d717-e674-4ca7-ab6e-749d4a2adff0 | 1259cece-f3a1-47de-95c8-76cd8865a410 |
| @loc_MYS_mys-mw06-c-04-memory-view-08_s0_v1 | 4f706a30-b0f9-448f-97b5-f2542de6d962 | 0086287e-f5a8-4404-a340-04e88c8f00dd |
| @prop_MYS_mys-reference-49-cabinet-fingerprint-desk-and-chair-construction_s0_v1 | 57b11be5-666c-432b-bd10-419401bb051e | 7d1e94ea-d38c-48a5-80b9-cce8a32902d7 |
| @prop_MYS_mys-ty001-decimal-rating-glyphs-and-tints_s0_v1 | 4df5d85c-db91-43db-8569-fbcb705e89fe | 41f533ae-777d-4873-a434-627177e2d8e3 |
| @loc_MYS_mys-w06-a-01-world-view-01_s0_v1 | f3aba0d1-f066-4ea8-9aeb-0bde576939b5 | 181b9293-2711-4b57-801b-03a32952f22b |
| @loc_MYS_mys-w06-a-03-world-view-03_s0_v1 | b1846379-33c8-46bf-bb7b-004588efff90 | 0c3952b2-24a7-4159-8519-7a33cd49797a |
| @loc_MYS_mys-w06-a-04-world-view-04_s0_v1 | da152c5b-5dcf-43a9-83c6-7b09c00746dc | ec34a3fd-d35d-4695-870b-233bd0e2e61a |
| @loc_MYS_mys-w06-b-01-world-view-05_s0_v1 | 4ebe10f6-d4fc-4dcc-b6e0-08ed05337f03 | d6048c38-211f-479f-b974-d14114cc20ce |
| @loc_MYS_mys-w06-b-02-world-view-06_s0_v1 | f55acb20-55c2-431a-bd29-03de2b982e58 | b63d8d5c-a1a3-4ffd-b647-d7d9a7ac4954 |
