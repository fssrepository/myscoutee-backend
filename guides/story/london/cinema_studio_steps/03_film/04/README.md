# Block 04 — 01:30–02:00

Status: prepared prompt files; existing account media has not been checked. [Start](../../README.md).

Seedance 2.5; 16:9; **30 s, 1080p target**, audio ON, one output.
Duration means NEW added footage. Select the previous accepted video in the actual Forward Extend source field. A filename alone does not establish an extension.

## Sequential preparation

Image setup: Nano Banana Pro, 16:9, one output; characters and single-scene stills at 2K, worlds at 4K, and nine-cell memory/storyboard sheets at 4K when Unlimited covers the actual operation. Set the separate Unlimited switch ON and verify coverage at the selected resolution. Apply the [reference procedure](../../00_project/REFERENCES.md#remaining-binding-work-at-the-point-of-use) as each asset is accepted; the next dependent prompt must have all actual mentions bound.

Generate only missing media. Reuse accepted dependencies from prior blocks. Each row lists existing image/audio/video inputs, the complete `.txt` prompt to paste into the appropriate field, and the output name to assign after generation. Output filenames do not imply that local media already exists. One row means one output.

| Prompt | Required accepted references | Output name |
| --- | --- | --- |
| [W04](../../02_library/worlds/real/W04_MAIN_WORLD_A.txt) | None | `W04_MAIN_WORLD.png` |
| [C03](../../02_library/characters/C03_POLICEWOMAN.txt) | None | `C03_POLICEWOMAN.png` |
| [C04](../../02_library/characters/C04_APPOINTED_LAWYER.txt) | None | `C04_APPOINTED_LAWYER.png` |
| [C25](../../02_library/characters/C25_SEARCH_OFFICER_MALE.txt) | None | `C25_SEARCH_OFFICER_MALE.png` |
| [C26](../../02_library/characters/C26_DEFENCE_OFFICE_SUBSTITUTE.txt) | None | `C26_DEFENCE_OFFICE_SUBSTITUTE.png` |
| [MW04](../../02_library/worlds/memories/MW04_POLICE_DEFENCE_A.txt) | C01, C03, C04, C25, C26 | `MW04_POLICE_DEFENCE.png` |
| [SB04](storyboard.txt) | W04, MW04, C01, C03, C04, C25, C26 | `SB04_STORYBOARD.png` |
| [A04](narration.txt) | None | `A04_NARRATION.wav` |
| [V04](video.txt) | W04, MW04, C01, C03, C04, C25, C26, SB04, A04, V03 | `V04_CHAIN_TO_0200.mp4` |

## Before video generation

- [narration.txt](narration.txt) contains only spoken words: 61 whitespace-delimited tokens, original target 23–27 s, approximately 136–159 words/minute. Keep the same male voice and exact wording. Follow the [voice plan](../../00_project/VOICE.md); a natural shorter recording is not an automatic failure.
- [storyboard.txt](storyboard.txt) generates one 3×3 image. [video.txt](video.txt) generates one moving sequence. Never paste them together.
- All nine story beats remain. Fast camera movement and architectural transformation are already included.
- Paste the complete prompt after its reference setup notice has cleared. Verified Element mentions autoload. Missing IDs are bound once for the entire pack by the assistant; do not rewrite individual prompts. See [reference binding](../../00_project/REFERENCES.md).
- Enter the actual quote in the [credit ledger](../../04_tracking/credit_ledger.csv) and leave sufficient funds for the remaining film.

| ID | Required media | Reference mention (UNBOUND means missing ID) |
| --- | --- | --- |
| W04 | `W04_MAIN_WORLD.png` | `@UNBOUND_W04` |
| MW04 | `MW04_POLICE_DEFENCE.png` | `@UNBOUND_MW04` |
| C01 | `C01_PROTAGONIST.png` | `@char_mys_protagonist_s1_v1` |
| C03 | `C03_POLICEWOMAN.png` | `@UNBOUND_C03` |
| C04 | `C04_APPOINTED_LAWYER.png` | `@UNBOUND_C04` |
| C25 | `C25_SEARCH_OFFICER_MALE.png` | `@char_mys_search-officer-male_s4_v1` |
| C26 | `C26_DEFENCE_OFFICE_SUBSTITUTE.png` | `@UNBOUND_C26` |
| SB04 | `SB04_STORYBOARD.png` | `@UNBOUND_SB04` |
| A04 | `A04_NARRATION.wav` | `@UNBOUND_A04` |

## After generation

Watch once with sound. Check all nine beats and their short secondary memories against the [story checklist](../../04_tracking/story_beats.csv). Verify identity, the exterior present, moving memories, correct narration and continuation of the previous camera/sound state where applicable. Keep the first usable take; name any missing story beat before considering a paid repair. Minor coherent generative irregularities are acceptable.

`CHAIN` and `MASTER` names describe intended outputs. Treat an output as a cumulative master only if the actual native export contains all preceding footage and sound. A separate continuation segment is not that master.

## World pages for this block

Use [W04 Page A](../../02_library/worlds/real/W04_MAIN_WORLD_A.txt), [Page B](../../02_library/worlds/real/W04_MAIN_WORLD_B.txt) and [Page C](../../02_library/worlds/real/W04_MAIN_WORLD_C.txt), each rendered as one 4K 2×2 image. Together they preserve all nine original view descriptions; the [world index](../../02_library/worlds/real/README.md) maps the repeated anchors. These are three inputs for this same film block, not three extra video jobs.

The B/C Element definitions are in the [new-only companion import](../../00_project/elements/archive/batches/10_world_reference_pages.md); they have not been imported or rendered. Obtain their full actual IDs, check the accepted page images and replace the pending references before generating this block. The existing W04 Element still points to its previously associated image until Page A is accepted and associated. Do not use an old nine-cell image while telling the video that it is new Page A. Keep existing accepted media available and do not repeat earlier imports.
