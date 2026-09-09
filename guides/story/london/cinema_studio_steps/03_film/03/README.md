# Block 03 — 01:00–01:30

Status: prepared prompt files; existing account media has not been checked. [Start](../../README.md).

Seedance 2.5; 16:9; **30 s, 1080p target**, audio ON, one output.
Duration means NEW added footage. Select the previous accepted video in the actual Forward Extend source field. A filename alone does not establish an extension.

## Sequential preparation

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
- Select real media first. Replace every alias below with the actual reference token inserted by the UI. Do not assume an alias resolves automatically.
- Enter the actual quote in the [credit ledger](../../04_tracking/credit_ledger.csv) and leave sufficient funds for the remaining film.

| ID | Actual media to select | Prompt alias to replace |
| --- | --- | --- |
| W03 | `W03_MAIN_WORLD.png` | `@W03_MAIN_WORLD` |
| MW03 | `MW03_WORK_RULE_CHANGE_ADMIN.png` | `@MW03_WORK_RULE_CHANGE_ADMIN` |
| MWP01 | `MWP01_ROUTES_ROOMS_DOCUMENTS.png` | `@MWP01_ROUTES_ROOMS_DOCUMENTS` |
| C01 | `C01_PROTAGONIST.png` | `@C01_PROTAGONIST` |
| C22 | `C22_ACCOUNTANT.png` | `@C22_ACCOUNTANT` |
| C23 | `C23_ADMIN_COLLEAGUE_A.png` | `@C23_ADMIN_COLLEAGUE_A` |
| C24 | `C24_ADMIN_COLLEAGUE_B.png` | `@C24_ADMIN_COLLEAGUE_B` |
| SB03 | `SB03_STORYBOARD.png` | `@SB03_STORYBOARD` |
| A03 | `A03_NARRATION.wav` | `@A03_NARRATION` |

## After generation

Watch once with sound. Check all nine beats and their short secondary memories against the [story checklist](../../04_tracking/story_beats.csv). Verify identity, the exterior present, moving memories, correct narration and continuation of the previous camera/sound state where applicable. Keep the first usable take; name any missing story beat before considering a paid repair. Minor coherent generative irregularities are acceptable.

`CHAIN` and `MASTER` names describe intended outputs. Treat an output as a cumulative master only if the actual native export contains all preceding footage and sound. A separate continuation segment is not that master.
