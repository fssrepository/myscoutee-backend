# Block 02 — 00:30–01:00

Status: prepared prompt files; existing account media has not been checked. [Start](../../README.md).

Seedance 2.5; 16:9; **30 s, 1080p target**, audio ON, one output.
Duration means NEW added footage. Select the previous accepted video in the actual Forward Extend source field. A filename alone does not establish an extension. After V02, check the 60-second native result AND whether it can continue/export while retaining earlier picture and sound. The documented 30-second upload-source limit makes this a separate capability gate.

## Sequential preparation

Image setup: Nano Banana Pro, 4K, 16:9, one output at the creator-reported 4 credits per image. Keep each prompt's current grid and all four morph states together. No image or video regeneration is allowed. Apply the [reference procedure](../../00_project/REFERENCES.md#remaining-binding-work-at-the-point-of-use) as each asset is accepted; dependent prompts require actual bound mentions.

Generate only missing media. Reuse accepted dependencies from prior blocks. Each row lists existing image/audio/video inputs, the complete `.txt` prompt to paste into the appropriate field, and the output name to assign after generation. Output filenames do not imply that local media already exists. One row means one output.

| Prompt | Required accepted references | Output name |
| --- | --- | --- |
| [W02](../../02_library/worlds/real/W02_MAIN_WORLD_A.txt) | None | `W02_MAIN_WORLD.png` |
| [C11](../../02_library/characters/C11_RUSSIAN_TRANSIT_PASSENGER.txt) | None | `C11_RUSSIAN_TRANSIT_PASSENGER.png` |
| [C12](../../02_library/characters/C12_AGRA_BUS_WOMAN.txt) | None | `C12_AGRA_BUS_WOMAN.png` |
| [C13](../../02_library/characters/C13_SUDANESE_TRAVELER_MAN.txt) | None | `C13_SUDANESE_TRAVELER_MAN.png` |
| [C14](../../02_library/characters/C14_SUDANESE_TRAVELER_WOMAN.txt) | None | `C14_SUDANESE_TRAVELER_WOMAN.png` |
| [C15](../../02_library/characters/C15_CAIRO_TAXI_DRIVER.txt) | None | `C15_CAIRO_TAXI_DRIVER.png` |
| [C16](../../02_library/characters/C16_BALLOON_LOCAL_HELPER_MAN.txt) | None | `C16_BALLOON_LOCAL_HELPER_MAN.png` |
| [C17](../../02_library/characters/C17_BALLOON_LOCAL_HELPER_WOMAN.txt) | None | `C17_BALLOON_LOCAL_HELPER_WOMAN.png` |
| [C18](../../02_library/characters/C18_BARMOUTH_ROAD_TRIP_DRIVER_COMPANION.txt) | None | `C18_BARMOUTH_ROAD_TRIP_DRIVER_COMPANION.png` |
| [C19](../../02_library/characters/C19_BARMOUTH_ROAD_TRIP_COMPANION_A.txt) | None | `C19_BARMOUTH_ROAD_TRIP_COMPANION_A.png` |
| [C20](../../02_library/characters/C20_BARMOUTH_ROAD_TRIP_COMPANION_B.txt) | None | `C20_BARMOUTH_ROAD_TRIP_COMPANION_B.png` |
| [C21](../../02_library/characters/C21_BARMOUTH_ROAD_TRIP_COMPANION_C.txt) | None | `C21_BARMOUTH_ROAD_TRIP_COMPANION_C.png` |
| [MW02](../../02_library/worlds/memories/MW02_GLOBAL_ROUTES_A.txt) | C01, C11, C12, C13, C14, C15, C16, C17, C18, C19, C20, C21 | `MW02_GLOBAL_ROUTES.png` |
| [SB02](storyboard.txt) | W02, MW02, MW01, MWP01, C01, C10, C11, C12, C13, C14, C15, C16, C17, C18, C19, C20, C21 | `SB02_STORYBOARD.png` |
| [A02](narration.txt) | None | `A02_NARRATION.wav` |
| [V02](video.txt) | W02, MW02, MW01, MWP01, C01, C10, C11, C12, C13, C14, C15, C16, C17, C18, C19, C20, C21, SB02, A02, V01 | `V02_CHAIN_TO_0100.mp4` |

## Before video generation

- [narration.txt](narration.txt) contains only spoken words: 45 whitespace-delimited tokens, original target 23–27 s, approximately 100–117 words/minute. Keep the same male voice and exact wording. Follow the [voice plan](../../00_project/VOICE.md); a natural shorter recording is not an automatic failure.
- [storyboard.txt](storyboard.txt) generates one 3×3 image. [video.txt](video.txt) generates one moving sequence. Never paste them together.
- All nine story beats remain. Fast camera movement and architectural transformation are already included.
- Paste the complete prompt after its reference setup notice has cleared. Verified Element mentions autoload. Missing IDs are bound once for the entire pack by the assistant; do not rewrite individual prompts. See [reference binding](../../00_project/REFERENCES.md).
- Enter the actual quote in the [credit ledger](../../04_tracking/credit_ledger.csv) and leave sufficient funds for the remaining film.

| ID | Required media | Reference mention (UNBOUND means missing ID) |
| --- | --- | --- |
| W02 | `W02_MAIN_WORLD.png` | `@UNBOUND_W02` |
| MW02 | `MW02_GLOBAL_ROUTES.png` | `@UNBOUND_MW02` |
| MW01 | `MW01_LONDON_SOCIAL.png` | `@UNBOUND_MW01` |
| MWP01 | `MWP01_ROUTES_ROOMS_DOCUMENTS.png` | `@UNBOUND_MWP01` |
| C01 | `C01_PROTAGONIST.png` | `@char_mys_protagonist_s1_v1` |
| C10 | `C10_BEGINNER_DANCE_WOMAN.png` | `@char_mys_beginner-dance-woman_s1_v1` |
| C11 | `C11_RUSSIAN_TRANSIT_PASSENGER.png` | `@UNBOUND_C11` |
| C12 | `C12_AGRA_BUS_WOMAN.png` | `@char_mys_agra-bus-woman_s2_v1` |
| C13 | `C13_SUDANESE_TRAVELER_MAN.png` | `@char_mys_sudanese-traveler-man_s2_v1` |
| C14 | `C14_SUDANESE_TRAVELER_WOMAN.png` | `@char_mys_sudanese-traveler-woman_s2_v1` |
| C15 | `C15_CAIRO_TAXI_DRIVER.png` | `@char_mys_cairo-taxi-driver_s2_v1` |
| C16 | `C16_BALLOON_LOCAL_HELPER_MAN.png` | `@UNBOUND_C16` |
| C17 | `C17_BALLOON_LOCAL_HELPER_WOMAN.png` | `@UNBOUND_C17` |
| C18 | `C18_BARMOUTH_ROAD_TRIP_DRIVER_COMPANION.png` | `@UNBOUND_C18` |
| C19 | `C19_BARMOUTH_ROAD_TRIP_COMPANION_A.png` | `@UNBOUND_C19` |
| C20 | `C20_BARMOUTH_ROAD_TRIP_COMPANION_B.png` | `@UNBOUND_C20` |
| C21 | `C21_BARMOUTH_ROAD_TRIP_COMPANION_C.png` | `@UNBOUND_C21` |
| SB02 | `SB02_STORYBOARD.png` | `@UNBOUND_SB02` |
| A02 | `A02_NARRATION.wav` | `@UNBOUND_A02` |

## After generation

Watch once with sound. Check all nine beats and their short secondary memories against the [story checklist](../../04_tracking/story_beats.csv). Verify identity, the exterior present, moving memories, correct narration and continuation of the previous camera/sound state where applicable. Keep the first usable take; name any missing story beat before considering a paid repair. Minor coherent generative irregularities are acceptable.

`CHAIN` and `MASTER` names describe intended outputs. Treat an output as a cumulative master only if the actual native export contains all preceding footage and sound. A separate continuation segment is not that master.

## World pages for this block

Use [W02 Page A](../../02_library/worlds/real/W02_MAIN_WORLD_A.txt), [Page B](../../02_library/worlds/real/W02_MAIN_WORLD_B.txt) and [Page C](../../02_library/worlds/real/W02_MAIN_WORLD_C.txt), each rendered as one 4K 2×2 image. Together they preserve all nine original view descriptions; the [world index](../../02_library/worlds/real/README.md) maps the repeated anchors. These are three inputs for this same film block, not three extra video jobs.

The B/C Element definitions are in the [new-only companion import](../../00_project/elements/archive/batches/10_world_reference_pages.md); they have not been imported or rendered. Obtain their full actual IDs, check the accepted page images and replace the pending references before generating this block. The existing W02 Element still points to its previously associated image until Page A is accepted and associated. Do not use an old nine-cell image while telling the video that it is new Page A. Keep existing accepted media available and do not repeat earlier imports.
