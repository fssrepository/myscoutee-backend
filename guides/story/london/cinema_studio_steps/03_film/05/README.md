# Block 05 — 02:00–02:30

Status: prepared prompt files; existing account media has not been checked. [Start](../../README.md).

Seedance 2.5; 16:9; **30 s, 1080p target**, audio ON, one output.
Duration means NEW added footage. Select the previous accepted video in the actual Forward Extend source field. A filename alone does not establish an extension.

## Sequential preparation

Generate only missing media. Reuse accepted dependencies from prior blocks. Each row lists existing image/audio/video inputs, the complete `.txt` prompt to paste into the appropriate field, and the output name to assign after generation. Output filenames do not imply that local media already exists. One row means one output.

| Prompt | Required accepted references | Output name |
| --- | --- | --- |
| [W05](../../02_library/worlds/W05_MAIN_WORLD.txt) | None | `W05_MAIN_WORLD.png` |
| [C27](../../02_library/characters/C27_JUDGE.txt) | None | `C27_JUDGE.png` |
| [C28](../../02_library/characters/C28_FORENSIC_EXPERT_A.txt) | None | `C28_FORENSIC_EXPERT_A.png` |
| [C29](../../02_library/characters/C29_FORENSIC_EXPERT_B.txt) | None | `C29_FORENSIC_EXPERT_B.png` |
| [C30](../../02_library/characters/C30_COURT_CLERK.txt) | None | `C30_COURT_CLERK.png` |
| [C31](../../02_library/characters/C31_ANONYMOUS_FICTIONAL_POLITICAL_FIGURE.txt) | None | `C31_ANONYMOUS_FICTIONAL_POLITICAL_FIGURE.png` |
| [MW05](../../02_library/memories/MW05_COURT_FILE.txt) | C01, C04, C27, C28, C29, C30, C31 | `MW05_COURT_FILE.png` |
| [MWP02](../../02_library/memories/MWP02_SYSTEM_TIME_REVERSALS.txt) | C01 | `MWP02_SYSTEM_TIME_REVERSALS.png` |
| [SB05](storyboard.txt) | W05, MW05, MWP02, C01, C04, C27, C28, C29, C30, C31 | `SB05_STORYBOARD.png` |
| [A05](narration.txt) | None | `A05_NARRATION.wav` |
| [V05](video.txt) | W05, MW05, MWP02, C01, C04, C27, C28, C29, C30, C31, SB05, A05, V04 | `V05_CHAIN_TO_0230.mp4` |

## Before video generation

- [narration.txt](narration.txt) contains only spoken words: 63 whitespace-delimited tokens, original target 23–27 s, approximately 140–164 words/minute. Keep the same male voice and exact wording. Follow the [voice plan](../../00_project/VOICE.md); a natural shorter recording is not an automatic failure.
- [storyboard.txt](storyboard.txt) generates one 3×3 image. [video.txt](video.txt) generates one moving sequence. Never paste them together.
- All nine story beats remain. Fast camera movement and architectural transformation are already included.
- Select real media first. Replace every alias below with the actual reference token inserted by the UI. Do not assume an alias resolves automatically.
- Enter the actual quote in the [credit ledger](../../04_tracking/credit_ledger.csv) and leave sufficient funds for the remaining film.

| ID | Actual media to select | Prompt alias to replace |
| --- | --- | --- |
| W05 | `W05_MAIN_WORLD.png` | `@W05_MAIN_WORLD` |
| MW05 | `MW05_COURT_FILE.png` | `@MW05_COURT_FILE` |
| MWP02 | `MWP02_SYSTEM_TIME_REVERSALS.png` | `@MWP02_SYSTEM_TIME_REVERSALS` |
| C01 | `C01_PROTAGONIST.png` | `@C01_PROTAGONIST` |
| C04 | `C04_APPOINTED_LAWYER.png` | `@C04_APPOINTED_LAWYER` |
| C27 | `C27_JUDGE.png` | `@C27_JUDGE` |
| C28 | `C28_FORENSIC_EXPERT_A.png` | `@C28_FORENSIC_EXPERT_A` |
| C29 | `C29_FORENSIC_EXPERT_B.png` | `@C29_FORENSIC_EXPERT_B` |
| C30 | `C30_COURT_CLERK.png` | `@C30_COURT_CLERK` |
| C31 | `C31_ANONYMOUS_FICTIONAL_POLITICAL_FIGURE.png` | `@C31_ANONYMOUS_FICTIONAL_POLITICAL_FIGURE` |
| SB05 | `SB05_STORYBOARD.png` | `@SB05_STORYBOARD` |
| A05 | `A05_NARRATION.wav` | `@A05_NARRATION` |

## After generation

Watch once with sound. Check all nine beats and their short secondary memories against the [story checklist](../../04_tracking/story_beats.csv). Verify identity, the exterior present, moving memories, correct narration and continuation of the previous camera/sound state where applicable. Keep the first usable take; name any missing story beat before considering a paid repair. Minor coherent generative irregularities are acceptable.

`CHAIN` and `MASTER` names describe intended outputs. Treat an output as a cumulative master only if the actual native export contains all preceding footage and sound. A separate continuation segment is not that master.
