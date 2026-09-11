# Film reference audit — current whole-image route, 2026-09-11

The storyboard is now a local ordered scene plan made from existing whole images. No new paid storyboard image, cropped panel, resized grid, local composite or reference re-upload is required. The imported SB containers remain unused; keep them rather than reimporting or deleting them. This supersedes the previous eight generated 3×3 boards and 32-credit allowance.

## Implemented reference selection

216 of 266 canonical library images now appear directly in at least one story-video prompt. The other 50 remain explicitly documented alternatives: 21 additional world angles, 20 object/material studies, two restaurant-detail sheets, six character morphs and one numerical card morph. The exact per-video selections and exclusion reasons are in [VIDEO_ASSET_COVERAGE.csv](VIDEO_ASSET_COVERAGE.csv). This is full accounting of the library, not a claim that all 266 are loaded.

Before this revision, 182/266 were direct inputs and all 75 morph assets plus seven typography images and two restaurant detail sheets were omitted. The new union adds 20 MR transitions, 28 R studies and all seven TY sheets, while selecting nine world views per block instead of all twelve. Additional world views are alternative angles, not proven identical images. Existing memory actions are selected in their relevant portions; the complete set of 63 ordered beat paragraphs is unchanged.

Character-to-character morphs are not added because the current story keeps those people distinct. MR021 changes a numerical score; the scripted gaze changes only card fill, so TY001 is the selected appearance reference. Do not force these studies into the film merely to increase the coverage count.

| Portion | Seconds | Existing whole images | Incoming frame | Total references | Video characters |
|---|---:|---:|---|---:|---:|
| 01 | 30 | 48 | None | 48 | 14831 |
| 02 | 30 | 48 | EF01 | 49 | 14892 |
| 03 | 30 | 34 | EF02 | 35 | 14171 |
| 04 | 30 | 28 | EF03 | 29 | 13496 |
| 05 | 30 | 35 | EF04 | 36 | 14312 |
| 06A | 15 | 36 | EF05 | 37 | 12614 |
| 06B | 15 | 46 | EF06A | 47 | 13216 |
| 07 | 20 | 29 | EF06B | 30 | 13554 |

Counts include the incoming EF where required. All eight story-video prompts are under 15,000 characters and at or below the observed composer's 50-reference counter. These are text/UI checks, not proof of the backend model's image capacity or successful long-clip conditioning. Verify the actual loaded inputs and quote before submission. Future EF images cannot be attached until their preceding videos exist.

## Storyboard files

The existing storyboard.txt files (plus 06/storyboard_b.txt) now contain the whole-image input union, explicit beat-to-reference mapping and the retained detailed scene/camera/material/sound plan. They are local planning documents, not copy/paste image-generation prompts, so their length is not an image-model request limit. Use the adjacent video.txt/video_b.txt for generation. No video references an empty SB Element.

Existing sheets are used intact. Their cells supply different views or material states; they do not prescribe screen grids or additional cuts. Character identity and scripted rating rules take priority over incidental people/numbers in material sheets. Whole-image selection does not itself prove exact camera/motion continuity.

## Visual sample already inspected

Actual MR001, R008 and MW01 images are each 5504 × 3072: respectively a four-state building transformation, a four-state restaurant opening and four restaurant/lunch moments. W01_A_01 is a standalone 2752 × 1536 street composition. TY001 shows rating glyphs/colours; CM002 is actually a horizontal four-panel strip despite its source filename. These examples substantiate reuse; they are not a pixel-quality approval of all 266 images. The creator subsequently required whole-sheet use, so no panel extraction is part of this route.

The abandoned Banana prompts contained 32–47 references and conflicting nine-panel/grid instructions. The earlier 50-reference UI check did not validate Nano Banana Pro. Google documents up to 14 image references for that model; the Higgsfield metadata did not establish handling above that limit. [Google documentation](https://ai.google.dev/gemini-api/docs/generate-content/image-generation)

## Logo and verification boundary

V00 remains four silent seconds using only the existing logo. Its new material-assembly direction brings the emblem's separated coloured forms into alignment around its heart, symbolising fragmented lives and connection, then holds the exact MyScoutee presents lockup. No literal gear motif or new logo image is requested.

No generation, upload, crop, media edit, account mutation or credit debit occurred in this revision. The canonical master, existing library image prompts and all narration texts remain unchanged. Source media availability comes from the earlier read-only MCP inventory (266 canonical Elements with images); project membership, full visual quality and backend interpretation are not newly verified here.
