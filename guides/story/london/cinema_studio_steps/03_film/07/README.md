# Block 07 — 03:00–03:20

Status: prepared prompt files; existing account media has not been checked. [Start](../../README.md).

Seedance 2.5; 16:9; **20 s, 1080p target**, audio ON, one output.
Duration means NEW added footage. Select the previous accepted video in the actual Forward Extend source field. A filename alone does not establish an extension. HRW07 and C05 enter video references only here. At the clinical cut the man comes round from anaesthesia with one full, deep inhalation that feels like a first breath at rebirth, then briefly shakes the wrist handcuff chained to the bed frame. Only the foot is propped up beneath the heel/ankle; the rest of the leg rests on the mattress. He settles and looks toward the nurse before the title. All dream transformation stops at the clinical cut.

## Sequential preparation

Image setup: Nano Banana Pro, 16:9, one output. Present-world single views use 2K; other reference sheets retain 4K at the reported 4 credits per image. Eligible 2K Unlimited generations are planned at zero credits only while the offer is active. Keep each prompt's current grid and all four morph states together. No image or video regeneration is allowed. Apply the [reference procedure](../../00_project/REFERENCES.md#remaining-binding-work-at-the-point-of-use) as each asset is accepted; dependent prompts require actual bound mentions.

Generate only missing media. Reuse accepted dependencies from prior blocks. Each row lists existing image/audio/video inputs, the complete `.txt` prompt to paste into the appropriate field, and the output name to assign after generation. Output filenames do not imply that local media already exists. One row means one output.

| Prompt | Required accepted references | Output name |
| --- | --- | --- |
| [W07_A_01](../../02_library/worlds/real/W07_A_01_MAIN_WORLD_VIEW_01.txt) | None; compatible accepted companion view if available | `W07_A_01_MAIN_WORLD_VIEW_01.png` |
| [W07_A_02](../../02_library/worlds/real/W07_A_02_MAIN_WORLD_VIEW_02.txt) | None; compatible accepted companion view if available | `W07_A_02_MAIN_WORLD_VIEW_02.png` |
| [W07_A_03](../../02_library/worlds/real/W07_A_03_MAIN_WORLD_VIEW_03.txt) | None; compatible accepted companion view if available | `W07_A_03_MAIN_WORLD_VIEW_03.png` |
| [W07_A_04](../../02_library/worlds/real/W07_A_04_MAIN_WORLD_VIEW_04.txt) | None; compatible accepted companion view if available | `W07_A_04_MAIN_WORLD_VIEW_04.png` |
| [W07_B_01](../../02_library/worlds/real/W07_B_01_MAIN_WORLD_VIEW_05.txt) | None; compatible accepted companion view if available | `W07_B_01_MAIN_WORLD_VIEW_05.png` |
| [W07_B_02](../../02_library/worlds/real/W07_B_02_MAIN_WORLD_VIEW_06.txt) | None; compatible accepted companion view if available | `W07_B_02_MAIN_WORLD_VIEW_06.png` |
| [W07_B_03](../../02_library/worlds/real/W07_B_03_MAIN_WORLD_VIEW_07.txt) | None; compatible accepted companion view if available | `W07_B_03_MAIN_WORLD_VIEW_07.png` |
| [W07_B_04](../../02_library/worlds/real/W07_B_04_MAIN_WORLD_VIEW_08.txt) | None; compatible accepted companion view if available | `W07_B_04_MAIN_WORLD_VIEW_08.png` |
| [W07_C_01](../../02_library/worlds/real/W07_C_01_MAIN_WORLD_VIEW_09.txt) | None; compatible accepted companion view if available | `W07_C_01_MAIN_WORLD_VIEW_09.png` |
| [W07_C_02](../../02_library/worlds/real/W07_C_02_MAIN_WORLD_VIEW_01.txt) | None; compatible accepted companion view if available | `W07_C_02_MAIN_WORLD_VIEW_01.png` |
| [W07_C_03](../../02_library/worlds/real/W07_C_03_MAIN_WORLD_VIEW_07.txt) | None; compatible accepted companion view if available | `W07_C_03_MAIN_WORLD_VIEW_07.png` |
| [W07_C_04](../../02_library/worlds/real/W07_C_04_MAIN_WORLD_VIEW_08.txt) | None; compatible accepted companion view if available | `W07_C_04_MAIN_WORLD_VIEW_08.png` |
| [C05](../../02_library/characters/C05_FINAL_NURSE.txt) | None | `C05_FINAL_NURSE.png` |
| [HRW07](../../02_library/worlds/memories/28_HRW07_CLINICAL_REALITY_A.txt) | C01, C05 | `HRW07_CLINICAL_REALITY.png` |
| [SB07](storyboard.txt) | W07, HRW07, MWP01, MW01, MW02, C01, C05, C06, C16, C17 | `SB07_STORYBOARD.png` |
| [A07](narration.txt) | None | `A07_NARRATION.wav` |
| [V07](video.txt) | W07, HRW07, MWP01, MW01, MW02, C01, C05, C06, C16, C17, SB07, A07, V06 | `V07_MASTER_0320.mp4` |

## Before video generation

- [narration.txt](narration.txt) contains only spoken words: 33 whitespace-delimited tokens, original target 15–19 s, approximately 104–132 words/minute. Keep the same male voice and exact wording. Follow the [voice plan](../../00_project/VOICE.md); a natural shorter recording is not an automatic failure.
- [storyboard.txt](storyboard.txt) generates one 3×3 image. [video.txt](video.txt) generates one moving sequence. Never paste them together.
- All nine story beats remain. Fast camera movement and architectural transformation are already included.
- Paste the complete prompt after its reference setup notice has cleared. Verified Element mentions autoload. Missing IDs are bound once for the entire pack by the assistant; do not rewrite individual prompts. See [reference binding](../../00_project/REFERENCES.md).
- Enter the actual quote in the [credit ledger](../../04_tracking/credit_ledger.csv) and leave sufficient funds for the remaining film.

| ID | Required media | Reference mention (UNBOUND means missing ID) |
| --- | --- | --- |
| W07 | `W07_MAIN_WORLD.png` | `@UNBOUND_W07` |
| HRW07 | `HRW07_CLINICAL_REALITY.png` | `@loc_MYS_mys-hrw07-a-clinical-reality_s0_v1` |
| MWP01 | `MWP01_ROUTES_ROOMS_DOCUMENTS.png` | `@UNBOUND_MWP01` |
| MW01 | `MW01_LONDON_SOCIAL.png` | `@loc_MYS_mys-mw01-a-london-social_s0_v1` |
| MW02 | `MW02_GLOBAL_ROUTES.png` | `@UNBOUND_MW02_A_01, @UNBOUND_MW02_A_02, @UNBOUND_MW02_A_03, @UNBOUND_MW02_A_04` |
| C01 | `C01_PROTAGONIST.png` | `@char_MYS_mys-c01-protagonist_s0_v1` |
| C05 | `C05_FINAL_NURSE.png` | `@char_MYS_mys-c05-final-nurse_s0_v1` |
| C06 | `C06_SHARED_HOUSE_SUBSTITUTE_SNORING_HOUSEMATE.png` | `@char_MYS_mys-c06-shared-house-substitute-snoring-housemate_s0_v1` |
| C16 | `C16_BALLOON_LOCAL_HELPER_MAN.png` | `@char_MYS_mys-c16-balloon-local-helper-man_s0_v1` |
| C17 | `C17_BALLOON_LOCAL_HELPER_WOMAN.png` | `@char_MYS_mys-c17-balloon-local-helper-woman_s0_v1` |
| SB07 | `SB07_STORYBOARD.png` | `@UNBOUND_SB07` |
| A07 | `A07_NARRATION.wav` | `@UNBOUND_A07` |

## After generation

Watch once with sound. Check all nine beats and their short secondary memories against the [story checklist](../../04_tracking/story_beats.csv). Verify identity, the exterior present, moving memories, correct narration and continuation of the previous camera/sound state where applicable. Keep the first usable take; name any missing story beat before considering a paid repair. Minor coherent generative irregularities are acceptable.

`CHAIN` and `MASTER` names describe intended outputs. Treat an output as a cumulative master only if the actual native export contains all preceding footage and sound. A separate continuation segment is not that master.

## World pages for this block

| [W07_A_01](../../02_library/worlds/real/W07_A_01_MAIN_WORLD_VIEW_01.txt) | None; compatible accepted companion view if available | `W07_A_01_MAIN_WORLD_VIEW_01.png` |
| [W07_A_02](../../02_library/worlds/real/W07_A_02_MAIN_WORLD_VIEW_02.txt) | None; compatible accepted companion view if available | `W07_A_02_MAIN_WORLD_VIEW_02.png` |
| [W07_A_03](../../02_library/worlds/real/W07_A_03_MAIN_WORLD_VIEW_03.txt) | None; compatible accepted companion view if available | `W07_A_03_MAIN_WORLD_VIEW_03.png` |
| [W07_A_04](../../02_library/worlds/real/W07_A_04_MAIN_WORLD_VIEW_04.txt) | None; compatible accepted companion view if available | `W07_A_04_MAIN_WORLD_VIEW_04.png` |
| [W07_B_01](../../02_library/worlds/real/W07_B_01_MAIN_WORLD_VIEW_05.txt) | None; compatible accepted companion view if available | `W07_B_01_MAIN_WORLD_VIEW_05.png` |
| [W07_B_02](../../02_library/worlds/real/W07_B_02_MAIN_WORLD_VIEW_06.txt) | None; compatible accepted companion view if available | `W07_B_02_MAIN_WORLD_VIEW_06.png` |
| [W07_B_03](../../02_library/worlds/real/W07_B_03_MAIN_WORLD_VIEW_07.txt) | None; compatible accepted companion view if available | `W07_B_03_MAIN_WORLD_VIEW_07.png` |
| [W07_B_04](../../02_library/worlds/real/W07_B_04_MAIN_WORLD_VIEW_08.txt) | None; compatible accepted companion view if available | `W07_B_04_MAIN_WORLD_VIEW_08.png` |
| [W07_C_01](../../02_library/worlds/real/W07_C_01_MAIN_WORLD_VIEW_09.txt) | None; compatible accepted companion view if available | `W07_C_01_MAIN_WORLD_VIEW_09.png` |
| [W07_C_02](../../02_library/worlds/real/W07_C_02_MAIN_WORLD_VIEW_01.txt) | None; compatible accepted companion view if available | `W07_C_02_MAIN_WORLD_VIEW_01.png` |
| [W07_C_03](../../02_library/worlds/real/W07_C_03_MAIN_WORLD_VIEW_07.txt) | None; compatible accepted companion view if available | `W07_C_03_MAIN_WORLD_VIEW_07.png` |
| [W07_C_04](../../02_library/worlds/real/W07_C_04_MAIN_WORLD_VIEW_08.txt) | None; compatible accepted companion view if available | `W07_C_04_MAIN_WORLD_VIEW_08.png` |

The B/C Element definitions are in the [new-only companion import](../../00_project/elements/archive/batches/10_world_reference_pages.md); they have not been imported or rendered. Obtain their full actual IDs, check the accepted page images and replace the pending references before generating this block. The existing W07 Element still points to its previously associated image until Page A is accepted and associated. Do not use an old nine-cell image while telling the video that it is new Page A. Keep existing accepted media available and do not repeat earlier imports.
