# P09 content-rejection investigation — 2026-09-12

Status: the creator reports that P09 completed after restarting generation. The initial rejection and subsequent completion made the workflow unpredictable and delayed production. The exact moderation cause and provider stage remain unconfirmed; the successful retry's payload and output have not yet been independently reviewed. No production prompt rewrite or retry was performed by the assistant as part of this investigation.

## Observed incident

The user identifies the failed generation as P09. The screenshot taken at 10:39:36 local time shows an NSFW badge, a credit-refund badge, and an output-sensitive-content message. The earlier 10:25 screenshots show a prepared Cinema Studio 4.0 request with 25 references, 10 seconds, 1080p, 16:9, audio on and one output, quoted at 90 credits. These timestamps bracket the observed workflow; they are not backend submission/completion timestamps. The refunded amount is not independently verified.

The screenshot does not expose the full submitted prompt, request ID, upstream error code, elapsed processing time, or rejected output. The MCP completed-history listing returns P08 as the latest completed production clip and does not return this rejected P09. The empty composer after submission does not prove loss of the request or failure of its reference bindings.

## Review scope and reproducibility

- Read the current complete production P09 prompt: 11,379 characters, 25 unique Element handles, SHA-256 `ef4f43d377b70608d9bf416aabca5884a55635a3fbbe419d5dcf4480425374ea`.
- Reviewed all 25 current attached reference images visually, including all panels of the supplied sheets. Enlarged the balloon-helper scene, balloon/source page, rope-construction sheet, Soho source page and London Eye morph sheet for closer inspection.
- Fresh MCP individual Element reads: 25 returned, all completed, exactly one image and zero videos each. The images match the reviewed media IDs. No duplicate old replacement attachment was found.
- Read all 24 corresponding current image-source prompts, including their shared instructions and unique scene assignments. The remaining reference is the extracted P08 final frame, not a generated image prompt.
- Reviewed all 25 live Element descriptions. The new MW06_A_02 handle is `@loc_MYS_mw06-a-02-memory-view-02_s0_v1`, attached to image `ba339d6a-36d4-41f6-b368-f725695cb55e`.
- Compared exact Element/media IDs with the reviewed completed production history: 14 images have a prior completed-clip match; 11 do not. “No match” is not a moderation finding.
- The current local image-source prompts are provenance and creative-intent evidence. This does not prove those exact revisions generated every current image, or that their text was submitted with P09. Live Element descriptions and image attachments are separate inputs; hidden provider prompt transformations are unavailable.

## What the official sources establish

Higgsfield documents both platform/provider filtering and false positives, including combined image/text interpretations. Its support instructions say a flagged asset may have no asset-page ID; approximate time, selected model and prompt can be sufficient for a support lookup. An ID should therefore not be demanded as the only next step. [Higgsfield NSFW troubleshooting](https://higgsfield.ai/creator-hub/help-center/troubleshooting/content-flagged-as-nsfw)

BytePlus explicitly distinguishes input filtering from the model's output moderation. The user's report that this failed during generation, together with the output-oriented UI message, is consistent with output moderation. It does not establish the actual stage without the backend error. [BytePlus rejection FAQ](https://ai.byteplus.com/en/help/article/why-was-my-request-rejected-for-sensitive-or-non-compliant-content-and-how-do-i-reduce-false-rejections)

The reviewed restrictions cover more than sexual content: threats, harassment, hate, deception, rights/privacy violations, harm to minors and self-harm also appear. A UI badge is not a precise classification of which restriction was triggered. [Higgsfield Terms, sections 5–6](https://higgsfield.ai/terms-of-use-agreement)

A readable BytePlus GenAI policy copy dated February 24, 2026 also addresses harmful profiling, discrimination, unauthorized likeness use, violence and self-harm. Treat this as dated category context, not a current classifier specification or proof of the contract used by Higgsfield. The current documentation page exposes a later update date but its policy body was not available through the web reader. [Dated BytePlus policy PDF](https://d7umqicpi7263.cloudfront.net/eula/72yVqLIXhwoKOk0EpZOK8ClTNs-mRbZh40CNk0X7Hb8), [current policy location](https://docs.byteplus.com/en/docs/legal/acceptable_use_policy_byteplus_genai)

The Cinema Studio help page describes version 4.0 as running on Seedance 2.5. That supports investigating the provider as well as Higgsfield; it does not identify which filter rejected this request. [Cinema Studio help](https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-cinema-studio)

## Content assessment

These are human observations and hypotheses, not reverse-engineered moderation rules.

| Area | Actual P09 evidence | Assessment |
| --- | --- | --- |
| Sexual content, nudity, minors | Adults in ordinary coats/trousers; ordinary restaurant, metro and outdoor cooperation. No sexual act, nudity or child-focused scene found. | No obvious matching requested content. Output unavailable. |
| Political content / public figures | Russian transit setting, Hungarian and London buildings, national-geographic descriptions. No named politician, party, campaign instruction, political speech or propaganda found in the P09 assets. | No evidence that the nationality or Parliament is the trigger. Do not replace the geography on speculation. |
| Rating / discriminatory profiling | Fictional decimal cards over current pedestrians, alongside ordinary character identity descriptions. The prompt prohibits demographic colour assignment. | A classifier could misread the combined scene as rating real people; this is unproven. It is an artistic depiction, not an operational system making decisions about people. The same rating instructions and typography occur in successful earlier clips. |
| Injury / self-harm / threatening ropes | MW06_A_03 shows three people freeing a loose rope near a basket and crops. R046 has suspended rope loops and knots; MR015 has hanging rigging. No person is tied, suspended or harmed in the inspected inputs. | Rope shapes and human proximity are concrete visual ambiguity to keep under review, not evidence of an intended harmful scene. R046 and MR015 were already used successfully in P04. |
| Architecture / body confusion during morphs | Stone/glass/wood change near people; wording asks to reveal a hand/face and then a body. Roof members and bridge parts are displaced above inhabited ground. | An unseen generated intermediate could distort a person or imply an accident. No rejected frames are available to confirm this. Source instructions preserve bodily support and assign deformation to materials. |
| Metro access / personal data | A passenger uses a monthly pass to help another through a gate; the replacement shows the wallet/pass put-away action. There is no technical bypass instruction or legible personal record. | A broad filter might misread the context, but the original metro image, C11 and gate studies already occur in completed P03. The replacement has no visible Element-level rejection. |
| Soho / privacy / humiliation | Source page includes a closed restroom-door mix-up and a modest lunch scene; P09 scripts the woman's smile beside her cup. The other Soho view shows her moving a bag to clear an aisle. | No intimate interior, sexual action, humiliation or harassment found. The source page and C02 already occur in completed P01. |
| Medical context | Generic continuity text mentions a later clinical threshold while this clip explicitly excludes clinical imagery and sound. No actual medical scene is attached. | Irrelevant inherited context can be made more precise, but it is not a proven trigger and also appears in successful P07/P08. |
| Sound / music | Original instrumental fiddle, tekerő and clarinet; no named song, artist imitation, lyrics, political speech or narrator requested. Audio generation is on. | The missing output also prevents assessment of accidentally generated speech or music. The same music direction occurs in completed P07/P08. Do not attribute this failure to audio without an audio-related error. |

The most defensible diagnosis is a content-moderation rejection of a submitted request, with output moderation plausible. There is no justified diagnosis of a broken handle, forbidden Russian setting, forbidden Parliament image, or a newly proven Face/IP failure.

## Narrow next steps

1. Seek the original backend moderation category/stage through support using the timestamp window and prompt. Ask whether text, a particular input media ID, output video or output audio triggered it; request the exact provider code if available. Support may not have classifier internals.
2. Preserve the original prompt and all images as evidence. Do not regenerate the entire library, mark a suspected image rejected, or count this job as a new unique Face/IP failure.
3. If preparing a clarification revision, preserve all 25 handles, story beats, timing, identities, geography, rating rules and sound. The following are proposed wording improvements only, not an accepted fix or an already-applied production edit:
   - Describe the cast as the established fully clothed adults, and explicitly keep their anatomy unchanged while architecture and equipment reshape.
   - Replace “before exposing their body” with “before the moving camera reveals the same fully clothed person, their grounded feet and surrounding room.”
   - Clarify the balloon action from its source: the basket is on the soil; the helpers hold equipment ropes clear of their bodies while freeing the line from crop leaves.
   - Keep the clinical exclusion local to P09 rather than explaining a different, later scene inside its material-action paragraph.
4. The creator subsequently reported a successful restart. No paid retry, upload, deletion or external message was performed by the assistant in this review. Review the completed P09 and extract its actual final frame before using it for P10 continuity.

## Exact image reuse comparison

All rows below were completed with one image at the time of this review. Prior completion is evidence of earlier use, not permanent eligibility.

| Live Element handle | Current image/media ID | Prior completed production clip(s) with the same Element and image |
| --- | --- | --- |
| `@loc_MYS_mw06-a-02-memory-view-02_s0_v1` | `ba339d6a-36d4-41f6-b368-f725695cb55e` | Not found in reviewed completed history |
| `@loc_MYS_mys-film-p08-end-frame_s0_v1` | `ad4d6d6d-58d6-4ef4-822f-5273887c1ea9` | Not found in reviewed completed history |
| `@loc_MYS_mys-mw06-c-02-memory-view-01_s0_v1` | `6c313d22-76d6-4bea-9b49-b858547af669` | Not found in reviewed completed history |
| `@loc_MYS_mys-mw06-a-03-memory-view-03_s0_v1` | `e1186fea-d5d6-4951-87ff-81f81fc00902` | Not found in reviewed completed history |
| `@loc_MYS_mys-mw06-a-01-memory-view-01_s0_v1` | `9d30fd00-4cdc-43cf-8312-f9b76d510c8a` | Not found in reviewed completed history |
| `@loc_MYS_mys-mw02-a-01-memory-view-01_s0_v1` | `3986b83c-7ad5-416b-bf93-ea4a4177345d` | P03 |
| `@loc_MYS_mys-reference-38-balna-curved-glass-target-volume_s0_v1` | `e968c3f1-1699-4689-a0f2-90653473873d` | Not found in reviewed completed history |
| `@loc_MYS_mys-reference-37-great-market-hall-roof-and-brick-source-volume_s0_v1` | `626ef7f4-2881-47a7-9d01-cf7d551e34bb` | Not found in reviewed completed history |
| `@loc_MYS_mys-reference-36-london-eye-and-connected-south-bank-depth_s0_v1` | `95298ad4-a5ef-45ac-bbbd-de5b8cf28717` | Not found in reviewed completed history |
| `@loc_MYS_mys-r008-cafe-to-occupied-restaurant_s0_v1` | `4279299a-05c2-410b-aa69-64f40750e32f` | P01 |
| `@loc_MYS_mys-mw02-b-global-routes_s0_v1` | `97c2dd95-0aff-4a15-8436-7f652324555a` | P04 |
| `@loc_MYS_mys-mw01-a-london-social_s0_v1` | `d51fba67-da5e-4770-b33d-161cfa256d5f` | P01 |
| `@loc_MYS_mys-w06-a-03-world-view-03_s0_v1` | `0c3952b2-24a7-4159-8519-7a33cd49797a` | Not found in reviewed completed history |
| `@loc_MYS_mys-w06-a-02-world-view-02_s0_v1` | `2ff2b344-a570-4f47-a55e-4b7e4b1649eb` | Not found in reviewed completed history |
| `@loc_MYS_mys-w06-a-01-world-view-01_s0_v1` | `181b9293-2711-4b57-801b-03a32952f22b` | Not found in reviewed completed history |
| `@prop_MYS_mys-ty001-decimal-rating-glyphs-and-tints_s0_v1` | `41f533ae-777d-4873-a434-627177e2d8e3` | P08, P07, P06, P05, P04, P03, P02, P01 |
| `@prop_MYS_mys-reference-46-canopy-and-balloon-envelope-rigging-and-basket-interfaces_s0_v1` | `6789039b-227e-4bcc-8c4d-28f6d3fe742a` | P04 |
| `@prop_MYS_mys-reference-43-london-entrance-rail-and-remembered-transit-gate_s0_v1` | `3ddd7fbe-1da4-4bf2-8c09-d40317a47d47` | P03 |
| `@prop_MYS_mys-mr015-canopy-to-balloon-envelope_s0_v1` | `0ba3f435-b86f-4b5a-af88-6e8e0b10bb71` | P04 |
| `@prop_MYS_mys-mr013-entrance-rail-to-transit-gate_s0_v1` | `a271cf32-2b3d-4892-b83f-f28ecc2aa2d3` | P03 |
| `@char_MYS_mys-c17-balloon-local-helper-woman_s0_v1` | `369f5469-e8c4-4c09-afe9-4e07c3764e8d` | P04 |
| `@char_MYS_mys-c16-balloon-local-helper-man_s0_v1` | `1f8ae540-1435-4169-8abe-9a18f04d1bae` | P04 |
| `@char_MYS_mys-c11-russian-transit-passenger_s0_v1` | `904bb713-b13a-4160-9bb7-d5cb3765bcb3` | P03 |
| `@char_MYS_mys-c02-soho-woman_s0_v1` | `6ffc98d6-a777-41d2-b49b-fdd1d918bf8f` | P01 |
| `@char_MYS_mys-c01-protagonist_s0_v1` | `0bd3ca76-6f75-4d36-9d47-9bf177669302` | P08, P07, P06, P05, P04, P03, P02, P01 |

## Support draft — not sent

Subject: Cinema Studio 4.0 P09 rejected as sensitive content after submission — request moderation stage

On September 12, 2026, I submitted the MyScoutee production P09 request in Cinema Studio 4.0: 10 seconds, 1080p, 16:9, audio on, one output and 25 Element references. The prepared request is shown at approximately 10:25 local time (Europe/Bratislava, UTC+02:00); the failed result is shown at 10:39. This is approximately 08:25–08:39 UTC, not an exact backend timestamp.

The result displays NSFW and a sensitive-output message, with a credit-refund badge. The exact provider error and rejected output are not exposed. The reviewed scene contains clothed adults, architectural transformations, a restaurant smile, a metro-gate courtesy and people handling balloon equipment on the ground.

A fresh Element read finds all 25 Elements completed with one image each and no duplicate old replacement. Fourteen exact current image IDs also occur in earlier completed production jobs. This does not rule out a combined input or generated-output issue.

Please locate the failed request using the time window and attached prompt/screenshot, and clarify whether the rejection was:
- a Higgsfield input/reference check;
- a provider input check;
- output-video moderation; or
- output-audio moderation.

Please provide the exact provider error code/category and implicated input media ID, if one is available. If the output was flagged, please confirm that stage and advise which aspect can be clarified while preserving this benign scene. I am requesting diagnosis of a possible false positive, not a filter override.

For comparison, the preceding completed P08 job is 2496f919-c04a-48a0-8604-39d26f21dcf4. This is a comparison job, not the failed P09 ID.


## Current source-prompt inventory

These are the 24 local source prompts read in full, with exact repeated paragraphs reviewed once. They are current source files, not an assertion about the failed job payload.

- [C01_PROTAGONIST.txt](../02_library/characters/C01_PROTAGONIST.txt); SHA-256 `22d8170fe31ac7872d41782050ccb48067c9f7695ae2bef7522e04336f0fdfa1`
- [C02_SOHO_WOMAN.txt](../02_library/characters/C02_SOHO_WOMAN.txt); SHA-256 `e8afe1cec379ec394f9fe1445b2832a7e85dd058bf836f69711b33b9fb262a58`
- [C11_RUSSIAN_TRANSIT_PASSENGER.txt](../02_library/characters/C11_RUSSIAN_TRANSIT_PASSENGER.txt); SHA-256 `5718baf0bbdb5657cd3b2d277531dc0a402581ec7b833b2b526900a5c1247ffd`
- [C16_BALLOON_LOCAL_HELPER_MAN.txt](../02_library/characters/C16_BALLOON_LOCAL_HELPER_MAN.txt); SHA-256 `af5fcd2c309d6ca50c43568ceae8df24d903c3eabe244fb44be8c9e03665b75b`
- [C17_BALLOON_LOCAL_HELPER_WOMAN.txt](../02_library/characters/C17_BALLOON_LOCAL_HELPER_WOMAN.txt); SHA-256 `6863b8c5ce671552e575b6db26e14ba7042800dca2abae4531933dc6cad12d0c`
- [R008_CAFE_OPENING_AND_FURNITURE_CONSTRUCTION_DETAILS.txt](../02_library/morphs/buildings/R008_CAFE_OPENING_AND_FURNITURE_CONSTRUCTION_DETAILS.txt); SHA-256 `ae3a1684d5caf0a4b6ca18e559de4f8359f533542c55c47d3ba3560a7b3c7fad`
- [R036_LONDON_EYE_AND_CONNECTED_SOUTH_BANK_DEPTH.txt](../02_library/morphs/buildings/R036_LONDON_EYE_AND_CONNECTED_SOUTH_BANK_DEPTH.txt); SHA-256 `262224e1c248402a4f5c82fe44578a762bd4b3c20e1cfc0e8f63ba83d1c2a43b`
- [R037_GREAT_MARKET_HALL_ROOF_AND_BRICK_SOURCE_VOLUME.txt](../02_library/morphs/buildings/R037_GREAT_MARKET_HALL_ROOF_AND_BRICK_SOURCE_VOLUME.txt); SHA-256 `4455a4de07241627b99d7243f5dc657b670f2ca1cca7e33b62948a1b8e5602d2`
- [R038_BALNA_CURVED_GLASS_TARGET_VOLUME.txt](../02_library/morphs/buildings/R038_BALNA_CURVED_GLASS_TARGET_VOLUME.txt); SHA-256 `102ae41efe787e4f67fe5fc2fc655eaa62ea5862073113af780514750cf8e7b3`
- [MR013_ENTRANCE_RAIL_TO_TRANSIT_GATE_2X2.txt](../02_library/morphs/objects/MR013_ENTRANCE_RAIL_TO_TRANSIT_GATE_2X2.txt); SHA-256 `23f541a7731b8ed19a5f1b92cd5a64195eda66f93af8e62203666949df78cfea`
- [MR015_CANOPY_TO_BALLOON_ENVELOPE_2X2.txt](../02_library/morphs/objects/MR015_CANOPY_TO_BALLOON_ENVELOPE_2X2.txt); SHA-256 `b8d5753c9ffea81b4b62ed9f779122ae548f075707ddede6159a3e49f77f0e1f`
- [R043_LONDON_ENTRANCE_RAIL_AND_REMEMBERED_TRANSIT_GATE.txt](../02_library/morphs/objects/R043_LONDON_ENTRANCE_RAIL_AND_REMEMBERED_TRANSIT_GATE.txt); SHA-256 `156c5bcea31f5e5777309e211189725b63e9478424f400e910609774ad9e96f9`
- [R046_CANOPY_AND_BALLOON_ENVELOPE_RIGGING_AND_BASKET_INTERFACES.txt](../02_library/morphs/objects/R046_CANOPY_AND_BALLOON_ENVELOPE_RIGGING_AND_BASKET_INTERFACES.txt); SHA-256 `db7aa9d71785fa621fc0cfa0eec4b0c9fa591c548587ff4b87469faac2f9e689`
- [TY001_DECIMAL_RATING_GLYPHS_AND_TINTS_3X3.txt](../02_library/typography/TY001_DECIMAL_RATING_GLYPHS_AND_TINTS_3X3.txt); SHA-256 `9f693ddcf4a91a46b9a3e9e8267e5c6fe944c81ac2c57ad826794cb87620581e`
- [04_MW01_LONDON_SOCIAL_A.txt](../02_library/worlds/memories/04_MW01_LONDON_SOCIAL_A.txt); SHA-256 `a49c2ac3bc83152ac3897453afb292433955bf5506e16caca0d638bd2dc16dab`
- [07_01_MW02_GLOBAL_ROUTES_A_VIEW_01.txt](../02_library/worlds/memories/07_01_MW02_GLOBAL_ROUTES_A_VIEW_01.txt); SHA-256 `292baa83d937697a0df5b30df0470762efc490ba17b4068bf0805a89bbc0d8b7`
- [08_MW02_GLOBAL_ROUTES_B.txt](../02_library/worlds/memories/08_MW02_GLOBAL_ROUTES_B.txt); SHA-256 `0fe5a4a88e96fe7dac0ca1306ca84de6e7fe088dec141fffc42a7bf67130939e`
- [19_01_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_01.txt](../02_library/worlds/memories/19_01_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_01.txt); SHA-256 `1d7629cc7695a9ede87d119f77621ac13681581e0cb199e0216a09698dc6acbd`
- [19_02_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_02.txt](../02_library/worlds/memories/19_02_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_02.txt); SHA-256 `eeecc25ff716719b799ade84c5a290e3b54643a8d112f94dd4b2a8ef68b750fa`
- [19_03_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_03.txt](../02_library/worlds/memories/19_03_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_03.txt); SHA-256 `66f717b93b60f2878d9d841d411e6f63fa135d1830fb9074a2ae87e8de96b397`
- [21_02_MW06_HUMAN_COUNTERMEMORIES_C_VIEW_01.txt](../02_library/worlds/memories/21_02_MW06_HUMAN_COUNTERMEMORIES_C_VIEW_01.txt); SHA-256 `df8353540229f3ad863bbd6c13926af5bfb51bea696049d6f113f18b8938a39e`
- [W06_A_01_MAIN_WORLD_VIEW_01.txt](../02_library/worlds/real/W06_A_01_MAIN_WORLD_VIEW_01.txt); SHA-256 `28b37564c6a9532012c4c064d074247ab33e9e60a95c29c1b2b8faf3d7cc856d`
- [W06_A_02_MAIN_WORLD_VIEW_02.txt](../02_library/worlds/real/W06_A_02_MAIN_WORLD_VIEW_02.txt); SHA-256 `805844440c1252e311698d813b6d991f89dffe3c897493a51d8e86084250aa04`
- [W06_A_03_MAIN_WORLD_VIEW_03.txt](../02_library/worlds/real/W06_A_03_MAIN_WORLD_VIEW_03.txt); SHA-256 `5d2208119232bc5cfda7d667c19d6529f9002d67bfed809ce4309aeb4db2ddac`
