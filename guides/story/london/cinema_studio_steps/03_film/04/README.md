# Block 04 — 01:30–02:00

Status: prepared prompt files; existing account media has not been checked. [Start](../../README.md).

Seedance 2.5; 16:9; **30 s, 1080p target**, audio ON, one output.
Duration means NEW added footage. Select the previous accepted video in the actual Forward Extend source field. A filename alone does not establish an extension.

## Sequential preparation

Generate only missing media. Reuse accepted dependencies from prior blocks. Each row lists existing image/audio/video inputs, the complete `.txt` prompt to paste into the appropriate field, and the output name to assign after generation. Output filenames do not imply that local media already exists. One row means one output.

| Prompt | Required accepted references | Output name |
| --- | --- | --- |
| [W04](../../02_library/worlds/W04_MAIN_WORLD.txt) | None | `W04_MAIN_WORLD.png` |
| [C03](../../02_library/characters/C03_POLICEWOMAN.txt) | None | `C03_POLICEWOMAN.png` |
| [C04](../../02_library/characters/C04_APPOINTED_LAWYER.txt) | None | `C04_APPOINTED_LAWYER.png` |
| [C25](../../02_library/characters/C25_SEARCH_OFFICER_MALE.txt) | None | `C25_SEARCH_OFFICER_MALE.png` |
| [C26](../../02_library/characters/C26_DEFENCE_OFFICE_SUBSTITUTE.txt) | None | `C26_DEFENCE_OFFICE_SUBSTITUTE.png` |
| [MW04](../../02_library/memories/MW04_POLICE_DEFENCE.txt) | C01, C03, C04, C25, C26 | `MW04_POLICE_DEFENCE.png` |
| [SB04](storyboard.txt) | W04, MW04, C01, C03, C04, C25, C26 | `SB04_STORYBOARD.png` |
| [A04](narration.txt) | None | `A04_NARRATION.wav` |
| [V04](video.txt) | W04, MW04, C01, C03, C04, C25, C26, SB04, A04, V03 | `V04_CHAIN_TO_0200.mp4` |

## Before video generation

- [narration.txt](narration.txt) contains only spoken words: 61 whitespace-delimited tokens, original target 23–27 s, approximately 136–159 words/minute. Keep the same male voice and exact wording. Follow the [voice plan](../../00_project/VOICE.md); a natural shorter recording is not an automatic failure.
- [storyboard.txt](storyboard.txt) generates one 3×3 image. [video.txt](video.txt) generates one moving sequence. Never paste them together.
- All nine story beats remain. Fast camera movement and architectural transformation are already included.
- Select real media first. Replace every alias below with the actual reference token inserted by the UI. Do not assume an alias resolves automatically.
- Enter the actual quote in the [credit ledger](../../04_tracking/credit_ledger.csv) and leave sufficient funds for the remaining film.

| ID | Actual media to select | Prompt alias to replace |
| --- | --- | --- |
| W04 | `W04_MAIN_WORLD.png` | `@W04_MAIN_WORLD` |
| MW04 | `MW04_POLICE_DEFENCE.png` | `@MW04_POLICE_DEFENCE` |
| C01 | `C01_PROTAGONIST.png` | `@C01_PROTAGONIST` |
| C03 | `C03_POLICEWOMAN.png` | `@C03_POLICEWOMAN` |
| C04 | `C04_APPOINTED_LAWYER.png` | `@C04_APPOINTED_LAWYER` |
| C25 | `C25_SEARCH_OFFICER_MALE.png` | `@C25_SEARCH_OFFICER_MALE` |
| C26 | `C26_DEFENCE_OFFICE_SUBSTITUTE.png` | `@C26_DEFENCE_OFFICE_SUBSTITUTE` |
| SB04 | `SB04_STORYBOARD.png` | `@SB04_STORYBOARD` |
| A04 | `A04_NARRATION.wav` | `@A04_NARRATION` |

## After generation

Watch once with sound. Check all nine beats and their short secondary memories against the [story checklist](../../04_tracking/story_beats.csv). Verify identity, the exterior present, moving memories, correct narration and continuation of the previous camera/sound state where applicable. Keep the first usable take; name any missing story beat before considering a paid repair. Minor coherent generative irregularities are acceptable.

`CHAIN` and `MASTER` names describe intended outputs. Treat an output as a cumulative master only if the actual native export contains all preceding footage and sound. A separate continuation segment is not that master.
