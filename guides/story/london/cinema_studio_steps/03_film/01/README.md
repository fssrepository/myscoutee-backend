# Block 01 — 00:00–00:30

Status: prepared prompt files; existing account media has not been checked. [Start](../../README.md).

Seedance 2.5; 16:9; **30 s, 1080p target**, audio ON, one output.
Complete the pilot, the requested W01_4K replacement on the same Element, and the full-budget/hosted-delivery check first. Reuse C01/C02 at 2K and the accepted W01 at 4K. Accepted V01 becomes the final opening.

## Sequential preparation

Image setup: Nano Banana Pro, 16:9, one output; characters and single-scene stills at 2K, worlds at 4K, and nine-cell memory/storyboard sheets at 4K when Unlimited covers the actual operation. Set the separate Unlimited switch ON and verify coverage at the selected resolution. Apply the [reference procedure](../../00_project/REFERENCES.md#remaining-binding-work-at-the-point-of-use) as each asset is accepted; the next dependent prompt must have all actual mentions bound.

Generate only missing media. Reuse accepted dependencies from prior blocks. Each row lists existing image/audio/video inputs, the complete `.txt` prompt to paste into the appropriate field, and the output name to assign after generation. Output filenames do not imply that local media already exists. One row means one output.

| Prompt | Required accepted references | Output name |
| --- | --- | --- |
| [W01](../../02_library/worlds/real/W01_MAIN_WORLD_A.txt) | None | `W01_MAIN_WORLD.png` |
| [C01](../../02_library/characters/C01_PROTAGONIST.txt) | None | `C01_PROTAGONIST.png` |
| [C02](../../02_library/characters/C02_SOHO_WOMAN.txt) | None | `C02_SOHO_WOMAN.png` |
| [C06](../../02_library/characters/C06_SHARED_HOUSE_SUBSTITUTE_SNORING_HOUSEMATE.txt) | None | `C06_SHARED_HOUSE_SUBSTITUTE_SNORING_HOUSEMATE.png` |
| [C07](../../02_library/characters/C07_FX_MORTGAGE_HOUSEMATE.txt) | None | `C07_FX_MORTGAGE_HOUSEMATE.png` |
| [C08](../../02_library/characters/C08_FX_MORTGAGE_SPOUSE.txt) | None | `C08_FX_MORTGAGE_SPOUSE.png` |
| [C09](../../02_library/characters/C09_FX_MORTGAGE_CHILD.txt) | None | `C09_FX_MORTGAGE_CHILD.png` |
| [C10](../../02_library/characters/C10_BEGINNER_DANCE_WOMAN.txt) | None | `C10_BEGINNER_DANCE_WOMAN.png` |
| [MW01](../../02_library/worlds/memories/MW01_LONDON_SOCIAL_A.txt) | C01, C02, C06, C07, C08, C09, C10 | `MW01_LONDON_SOCIAL.png` |
| [MWP01](../../02_library/worlds/memories/MWP01_ROUTES_ROOMS_DOCUMENTS_A.txt) | C01 | `MWP01_ROUTES_ROOMS_DOCUMENTS.png` |
| [SB01](storyboard.txt) | W01, MW01, MWP01, C01, C02, C06, C07, C08, C09 | `SB01_STORYBOARD.png` |
| [A01](narration.txt) | None | `A01_NARRATION.wav` |
| [V01](video.txt) | W01, MW01, MWP01, C01, C02, C06, C07, C08, C09, SB01, A01 | `V01_CITY_JUDGES_FIRST.mp4` |

## Before video generation

- [narration.txt](narration.txt) contains only spoken words: 46 whitespace-delimited tokens, original target 23–27 s, approximately 102–120 words/minute. Keep the same male voice and exact wording. Follow the [voice plan](../../00_project/VOICE.md); a natural shorter recording is not an automatic failure.
- [storyboard.txt](storyboard.txt) generates one 3×3 image. [video.txt](video.txt) generates one moving sequence. Never paste them together.
- All nine story beats remain. Fast camera movement and architectural transformation are already included.
- Paste the complete prompt after its reference setup notice has cleared. Verified Element mentions autoload. Missing IDs are bound once for the entire pack by the assistant; do not rewrite individual prompts. See [reference binding](../../00_project/REFERENCES.md).
- Enter the actual quote in the [credit ledger](../../04_tracking/credit_ledger.csv) and leave sufficient funds for the remaining film.

| ID | Required media | Reference mention (UNBOUND means missing ID) |
| --- | --- | --- |
| W01 | `W01_MAIN_WORLD.png` | `@loc_mys_world-01-the-city-judges-first-soho-piccadilly-leicester_s1_v1` |
| MW01 | `MW01_LONDON_SOCIAL.png` | `@UNBOUND_MW01` |
| MWP01 | `MWP01_ROUTES_ROOMS_DOCUMENTS.png` | `@UNBOUND_MWP01` |
| C01 | `C01_PROTAGONIST.png` | `@char_mys_protagonist_s1_v1` |
| C02 | `C02_SOHO_WOMAN.png` | `@char_mys_soho-woman_s1_v1` |
| C06 | `C06_SHARED_HOUSE_SUBSTITUTE_SNORING_HOUSEMATE.png` | `@UNBOUND_C06` |
| C07 | `C07_FX_MORTGAGE_HOUSEMATE.png` | `@UNBOUND_C07` |
| C08 | `C08_FX_MORTGAGE_SPOUSE.png` | `@UNBOUND_C08` |
| C09 | `C09_FX_MORTGAGE_CHILD.png` | `@char_mys_fx-mortgage-child_s1_v1` |
| SB01 | `SB01_STORYBOARD.png` | `@UNBOUND_SB01` |
| A01 | `A01_NARRATION.wav` | `@UNBOUND_A01` |

## After generation

Watch once with sound. Check all nine beats and their short secondary memories against the [story checklist](../../04_tracking/story_beats.csv). Verify identity, the exterior present, moving memories, correct narration and continuation of the previous camera/sound state where applicable. Keep the first usable take; name any missing story beat before considering a paid repair. Minor coherent generative irregularities are acceptable.

`CHAIN` and `MASTER` names describe intended outputs. Treat an output as a cumulative master only if the actual native export contains all preceding footage and sound. A separate continuation segment is not that master.

## World pages for this block

Use [W01 Page A](../../02_library/worlds/real/W01_MAIN_WORLD_A.txt), [Page B](../../02_library/worlds/real/W01_MAIN_WORLD_B.txt) and [Page C](../../02_library/worlds/real/W01_MAIN_WORLD_C.txt), each rendered as one 4K 2×2 image. Together they preserve all nine original view descriptions; the [world index](../../02_library/worlds/real/README.md) maps the repeated anchors. These are three inputs for this same film block, not three extra video jobs.

The B/C Element definitions are in the [new-only companion import](../../00_project/elements/archive/batches/10_world_reference_pages.md); they have not been imported or rendered. Obtain their full actual IDs, check the accepted page images and replace the pending references before generating this block. The existing W01 Element still points to its previously associated image until Page A is accepted and associated. Do not use an old nine-cell image while telling the video that it is new Page A. Keep existing accepted media available and do not repeat earlier imports.
