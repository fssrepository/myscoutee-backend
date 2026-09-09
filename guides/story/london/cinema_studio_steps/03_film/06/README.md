# Block 06 — 02:30–03:00

Status: prepared prompt files; existing account media has not been checked. [Start](../../README.md).

Seedance 2.5; 16:9; **30 s, 1080p target**, audio ON, one output.
Duration means NEW added footage. Select the previous accepted video in the actual Forward Extend source field. A filename alone does not establish an extension. MW01–05 are additional references for beat 6; the old list omitted sources for its recurring work/file/police/shared-house memories. Reuse these already-produced banks.

## Sequential preparation

Generate only missing media. Reuse accepted dependencies from prior blocks. Each row lists existing image/audio/video inputs, the complete `.txt` prompt to paste into the appropriate field, and the output name to assign after generation. Output filenames do not imply that local media already exists. One row means one output.

| Prompt | Required accepted references | Output name |
| --- | --- | --- |
| [W06](../../02_library/worlds/W06_MAIN_WORLD.txt) | None | `W06_MAIN_WORLD.png` |
| [MW06](../../02_library/memories/MW06_HUMAN_COUNTERMEMORIES.txt) | C01, C02, C03, C04, C10, C11, C16, C17, C27, C28, C29 | `MW06_HUMAN_COUNTERMEMORIES.png` |
| [SB06](storyboard.txt) | W06, MW06, MWP02, MW01, MW02, MW03, MW04, MW05, C01, C02, C03, C04, C10, C11, C16, C17, C27, C28, C29 | `SB06_STORYBOARD.png` |
| [A06](narration.txt) | None | `A06_NARRATION.wav` |
| [V06](video.txt) | W06, MW06, MWP02, MW01, MW02, MW03, MW04, MW05, C01, C02, C03, C04, C10, C11, C16, C17, C27, C28, C29, SB06, A06, V05 | `V06_CHAIN_TO_0300.mp4` |

## Before video generation

- [narration.txt](narration.txt) contains only spoken words: 66 whitespace-delimited tokens, original target 23–27 s, approximately 147–172 words/minute. Keep the same male voice and exact wording. Follow the [voice plan](../../00_project/VOICE.md); a natural shorter recording is not an automatic failure.
- [storyboard.txt](storyboard.txt) generates one 3×3 image. [video.txt](video.txt) generates one moving sequence. Never paste them together.
- All nine story beats remain. Fast camera movement and architectural transformation are already included.
- Select real media first. Replace every alias below with the actual reference token inserted by the UI. Do not assume an alias resolves automatically.
- Enter the actual quote in the [credit ledger](../../04_tracking/credit_ledger.csv) and leave sufficient funds for the remaining film.

| ID | Actual media to select | Prompt alias to replace |
| --- | --- | --- |
| W06 | `W06_MAIN_WORLD.png` | `@W06_MAIN_WORLD` |
| MW06 | `MW06_HUMAN_COUNTERMEMORIES.png` | `@MW06_HUMAN_COUNTERMEMORIES` |
| MWP02 | `MWP02_SYSTEM_TIME_REVERSALS.png` | `@MWP02_SYSTEM_TIME_REVERSALS` |
| MW01 | `MW01_LONDON_SOCIAL.png` | `@MW01_LONDON_SOCIAL` |
| MW02 | `MW02_GLOBAL_ROUTES.png` | `@MW02_GLOBAL_ROUTES` |
| MW03 | `MW03_WORK_RULE_CHANGE_ADMIN.png` | `@MW03_WORK_RULE_CHANGE_ADMIN` |
| MW04 | `MW04_POLICE_DEFENCE.png` | `@MW04_POLICE_DEFENCE` |
| MW05 | `MW05_COURT_FILE.png` | `@MW05_COURT_FILE` |
| C01 | `C01_PROTAGONIST.png` | `@C01_PROTAGONIST` |
| C02 | `C02_SOHO_WOMAN.png` | `@C02_SOHO_WOMAN` |
| C03 | `C03_POLICEWOMAN.png` | `@C03_POLICEWOMAN` |
| C04 | `C04_APPOINTED_LAWYER.png` | `@C04_APPOINTED_LAWYER` |
| C10 | `C10_BEGINNER_DANCE_WOMAN.png` | `@C10_BEGINNER_DANCE_WOMAN` |
| C11 | `C11_RUSSIAN_TRANSIT_PASSENGER.png` | `@C11_RUSSIAN_TRANSIT_PASSENGER` |
| C16 | `C16_BALLOON_LOCAL_HELPER_MAN.png` | `@C16_BALLOON_LOCAL_HELPER_MAN` |
| C17 | `C17_BALLOON_LOCAL_HELPER_WOMAN.png` | `@C17_BALLOON_LOCAL_HELPER_WOMAN` |
| C27 | `C27_JUDGE.png` | `@C27_JUDGE` |
| C28 | `C28_FORENSIC_EXPERT_A.png` | `@C28_FORENSIC_EXPERT_A` |
| C29 | `C29_FORENSIC_EXPERT_B.png` | `@C29_FORENSIC_EXPERT_B` |
| SB06 | `SB06_STORYBOARD.png` | `@SB06_STORYBOARD` |
| A06 | `A06_NARRATION.wav` | `@A06_NARRATION` |

## After generation

Watch once with sound. Check all nine beats and their short secondary memories against the [story checklist](../../04_tracking/story_beats.csv). Verify identity, the exterior present, moving memories, correct narration and continuation of the previous camera/sound state where applicable. Keep the first usable take; name any missing story beat before considering a paid repair. Minor coherent generative irregularities are acceptable.

`CHAIN` and `MASTER` names describe intended outputs. Treat an output as a cumulative master only if the actual native export contains all preceding footage and sound. A separate continuation segment is not that master.
