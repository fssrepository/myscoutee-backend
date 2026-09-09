# Block 03 — 01:00–01:30

Status: prepared prompt files; existing account media has not been checked. [Start](../../README.md).

Seedance 2.5; 16:9; **30 s, 1080p target**, audio ON, one output.
Duration means NEW added footage. Select the previous accepted video in the actual Forward Extend source field. A filename alone does not establish an extension.

## Sequential preparation

Image setup: Nano Banana Pro, 16:9, one output; characters and single-scene stills at 2K, worlds at 4K, and nine-cell memory/storyboard sheets at 4K when Unlimited covers the actual operation. Set the separate Unlimited switch ON and verify coverage at the selected resolution. Apply the [reference procedure](../../00_project/REFERENCES.md#remaining-binding-work-at-the-point-of-use) as each asset is accepted; the next dependent prompt must have all actual mentions bound.

Generate only missing media. Reuse accepted dependencies from prior blocks. Each row lists existing image/audio/video inputs, the complete `.txt` prompt to paste into the appropriate field, and the output name to assign after generation. Output filenames do not imply that local media already exists. One row means one output.

| Prompt | Required accepted references | Output name |
| --- | --- | --- |
| [W03](../../02_library/worlds/W03_MAIN_WORLD.txt) | None | `W03_MAIN_WORLD.png` |
| [C22](../../02_library/characters/C22_ACCOUNTANT.txt) | None | `C22_ACCOUNTANT.png` |
| [C23](../../02_library/characters/C23_ADMIN_COLLEAGUE_A.txt) | None | `C23_ADMIN_COLLEAGUE_A.png` |
| [C24](../../02_library/characters/C24_ADMIN_COLLEAGUE_B.txt) | None | `C24_ADMIN_COLLEAGUE_B.png` |
| [MW03](../../02_library/memories/MW03_WORK_RULE_CHANGE_ADMIN.txt) | C01, C22, C23, C24 | `MW03_WORK_RULE_CHANGE_ADMIN.png` |
| [SB03](storyboard.txt) | W03, MW03, MWP01, C01, C22, C23, C24 | `SB03_STORYBOARD.png` |
| [A03](narration.txt) | None | `A03_NARRATION.wav` |
| [V03](video.txt) | W03, MW03, MWP01, C01, C22, C23, C24, SB03, A03, V02 | `V03_CHAIN_TO_0130.mp4` |

## Before video generation

- [narration.txt](narration.txt) contains only spoken words: 46 whitespace-delimited tokens, original target 23–27 s, approximately 102–120 words/minute. Keep the same male voice and exact wording. Follow the [voice plan](../../00_project/VOICE.md); a natural shorter recording is not an automatic failure.
- [storyboard.txt](storyboard.txt) generates one 3×3 image. [video.txt](video.txt) generates one moving sequence. Never paste them together.
- All nine story beats remain. Fast camera movement and architectural transformation are already included.
- Paste the complete prompt after its reference setup notice has cleared. Verified Element mentions autoload. Missing IDs are bound once for the entire pack by the assistant; do not rewrite individual prompts. See [reference binding](../../00_project/REFERENCES.md).
- Enter the actual quote in the [credit ledger](../../04_tracking/credit_ledger.csv) and leave sufficient funds for the remaining film.

| ID | Required media | Reference mention (UNBOUND means missing ID) |
| --- | --- | --- |
| W03 | `W03_MAIN_WORLD.png` | `@UNBOUND_W03` |
| MW03 | `MW03_WORK_RULE_CHANGE_ADMIN.png` | `@UNBOUND_MW03` |
| MWP01 | `MWP01_ROUTES_ROOMS_DOCUMENTS.png` | `@UNBOUND_MWP01` |
| C01 | `C01_PROTAGONIST.png` | `@char_mys_protagonist_s1_v1` |
| C22 | `C22_ACCOUNTANT.png` | `@UNBOUND_C22` |
| C23 | `C23_ADMIN_COLLEAGUE_A.png` | `@char_mys_admin-colleague-a_s3_v1` |
| C24 | `C24_ADMIN_COLLEAGUE_B.png` | `@char_mys_admin-colleague-b_s3_v1` |
| SB03 | `SB03_STORYBOARD.png` | `@UNBOUND_SB03` |
| A03 | `A03_NARRATION.wav` | `@UNBOUND_A03` |

## After generation

Watch once with sound. Check all nine beats and their short secondary memories against the [story checklist](../../04_tracking/story_beats.csv). Verify identity, the exterior present, moving memories, correct narration and continuation of the previous camera/sound state where applicable. Keep the first usable take; name any missing story beat before considering a paid repair. Minor coherent generative irregularities are acceptable.

`CHAIN` and `MASTER` names describe intended outputs. Treat an output as a cumulative master only if the actual native export contains all preceding footage and sound. A separate continuation segment is not that master.
