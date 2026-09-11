# Current video requests — P01–P12

The accepted 4-second V00 ident is complete. Generate the following 12 story requests in order, using the linked video.txt files. They total 200 seconds. The old 01–07 files remain the unmodified detailed source chapters; do not use their former generation boundaries.

All 63 original beat paragraphs remain verbatim. Only the beat timings and generation boundaries changed. The existing 216 selected library Elements are still used across the film. Repeated chapter-wide reference lists are replaced by the union needed for the assigned beats. No new storyboard images, panel crops, grids or narration generation.

| Request | Story time | Seconds | Source beats | Refs incl. incoming frame | Characters | 1080p credits |
|---|---|---:|---|---:|---:|---:|
| [P01](P01/video.txt) | 0–15 s | 15 | 01.1 → 01.4 | 22 | 11892 | 135 |
| [P02](P02/video.txt) | 15–30 s | 15 | 01.5 → 01.9 | 27 | 11894 | 135 |
| [P03](P03/video.txt) | 30–45 s | 15 | 02.1 → 02.5 | 28 | 12319 | 135 |
| [P04](P04/video.txt) | 45–60 s | 15 | 02.6 → 02.9 | 29 | 11963 | 135 |
| [P05](P05/video.txt) | 60–80 s | 20 | 03.1 → 03.6 | 27 | 13018 | 180 |
| [P06](P06/video.txt) | 80–105 s | 25 | 03.7 → 04.5 | 28 | 14321 | 225 |
| [P07](P07/video.txt) | 105–135 s | 30 | 04.6 → 05.5 | 26 | 14377 | 270 |
| [P08](P08/video.txt) | 135–150 s | 15 | 05.6 → 05.9 | 27 | 12247 | 135 |
| [P09](P09/video.txt) | 150–160 s | 10 | 06.1 → 06.2 | 25 | 11243 | 90 |
| [P10](P10/video.txt) | 160–170 s | 10 | 06.3 → 06.5 | 28 | 12352 | 90 |
| [P11](P11/video.txt) | 170–180 s | 10 | 06.6 → 07.1 | 25 | 13116 | 90 |
| [P12](P12/video.txt) | 180–200 s | 20 | 07.2 → 07.9 | 25 | 13537 | 180 |

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

## Eligibility and spending

C07 failed face/IP eligibility in the UI and needs the already requested replacement original fictional character image, attached to its existing Element. The two MW01_C_03 / MW01_C_04 checks looped; first retry them in the smaller request rather than assume replacement images are needed. Element-level completed status alone is not a passed image eligibility check. P02 uses all three affected Elements.

Reserve 1800 credits for the story and provisionally 40 for necessary replacement images. If 1973 was the balance before the one 36-credit accepted ident and there were no other charges, 1937 remains and 97 is left after both reserves. Actual debits/quotes must be reconciled. The 40 is a spending envelope, not a prediction that ten images are needed. No paid job was launched by this repartition.

[Exact mapping and hashes](plan.json) · [budget](../../00_project/BUDGET.md)
