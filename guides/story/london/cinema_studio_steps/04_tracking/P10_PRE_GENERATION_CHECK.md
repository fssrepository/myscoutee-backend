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
