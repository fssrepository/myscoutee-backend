# Block 06 — 02:30–03:00

Status: prepared prompt files; existing account media has not been checked. [Start](../../README.md).

Seedance 2.5; 16:9; **30 s, 1080p target**, audio ON, one output.
Duration means NEW added footage. Select the previous accepted video in the actual Forward Extend source field. A filename alone does not establish an extension. MW01–05 are additional references for beat 6; the old list omitted sources for its recurring work/file/police/shared-house memories. Reuse these already-produced banks.

## Sequential preparation

Image setup: Nano Banana Pro, 4K, 16:9, one output at the creator-reported 4 credits per image. Keep each prompt's current grid and all four morph states together. No image or video regeneration is allowed. Apply the [reference procedure](../../00_project/REFERENCES.md#remaining-binding-work-at-the-point-of-use) as each asset is accepted; dependent prompts require actual bound mentions.

Generate only missing media. Reuse accepted dependencies from prior blocks. Each row lists existing image/audio/video inputs, the complete `.txt` prompt to paste into the appropriate field, and the output name to assign after generation. Output filenames do not imply that local media already exists. One row means one output.

| Prompt | Required accepted references | Output name |
| --- | --- | --- |
| [W06](../../02_library/worlds/real/W06_MAIN_WORLD_A.txt) | None | `W06_MAIN_WORLD.png` |
| [MW06](../../02_library/worlds/memories/MW06_HUMAN_COUNTERMEMORIES_A.txt) | C01, C02, C03, C04, C10, C11, C16, C17, C27, C28, C29 | `MW06_HUMAN_COUNTERMEMORIES.png` |
| [SB06](storyboard.txt) | W06, MW06, MWP02, MW01, MW02, MW03, MW04, MW05, C01, C02, C03, C04, C10, C11, C16, C17, C27, C28, C29 | `SB06_STORYBOARD.png` |
| [A06](narration.txt) | None | `A06_NARRATION.wav` |
| [V06](video.txt) | W06, MW06, MWP02, MW01, MW02, MW03, MW04, MW05, C01, C02, C03, C04, C10, C11, C16, C17, C27, C28, C29, SB06, A06, V05 | `V06_CHAIN_TO_0300.mp4` |

## Before video generation

- [narration.txt](narration.txt) contains only spoken words: 66 whitespace-delimited tokens, original target 23–27 s, approximately 147–172 words/minute. Keep the same male voice and exact wording. Follow the [voice plan](../../00_project/VOICE.md); a natural shorter recording is not an automatic failure.
- [storyboard.txt](storyboard.txt) generates one 3×3 image. [video.txt](video.txt) generates one moving sequence. Never paste them together.
- All nine story beats remain. Fast camera movement and architectural transformation are already included.
- Paste the complete prompt after its reference setup notice has cleared. Verified Element mentions autoload. Missing IDs are bound once for the entire pack by the assistant; do not rewrite individual prompts. See [reference binding](../../00_project/REFERENCES.md).
- Enter the actual quote in the [credit ledger](../../04_tracking/credit_ledger.csv) and leave sufficient funds for the remaining film.

| ID | Required media | Reference mention (UNBOUND means missing ID) |
| --- | --- | --- |
| W06 | `W06_MAIN_WORLD.png` | `@UNBOUND_W06` |
| MW06 | `MW06_HUMAN_COUNTERMEMORIES.png` | `@UNBOUND_MW06` |
| MWP02 | `MWP02_SYSTEM_TIME_REVERSALS.png` | `@UNBOUND_MWP02` |
| MW01 | `MW01_LONDON_SOCIAL.png` | `@UNBOUND_MW01` |
| MW02 | `MW02_GLOBAL_ROUTES.png` | `@UNBOUND_MW02` |
| MW03 | `MW03_WORK_RULE_CHANGE_ADMIN.png` | `@UNBOUND_MW03` |
| MW04 | `MW04_POLICE_DEFENCE.png` | `@UNBOUND_MW04` |
| MW05 | `MW05_COURT_FILE.png` | `@UNBOUND_MW05` |
| C01 | `C01_PROTAGONIST.png` | `@char_mys_protagonist_s1_v1` |
| C02 | `C02_SOHO_WOMAN.png` | `@char_mys_soho-woman_s1_v1` |
| C03 | `C03_POLICEWOMAN.png` | `@UNBOUND_C03` |
| C04 | `C04_APPOINTED_LAWYER.png` | `@UNBOUND_C04` |
| C10 | `C10_BEGINNER_DANCE_WOMAN.png` | `@char_mys_beginner-dance-woman_s1_v1` |
| C11 | `C11_RUSSIAN_TRANSIT_PASSENGER.png` | `@UNBOUND_C11` |
| C16 | `C16_BALLOON_LOCAL_HELPER_MAN.png` | `@UNBOUND_C16` |
| C17 | `C17_BALLOON_LOCAL_HELPER_WOMAN.png` | `@UNBOUND_C17` |
| C27 | `C27_JUDGE.png` | `@UNBOUND_C27` |
| C28 | `C28_FORENSIC_EXPERT_A.png` | `@char_mys_forensic-expert-a_s5_v1` |
| C29 | `C29_FORENSIC_EXPERT_B.png` | `@char_mys_forensic-expert-b_s5_v1` |
| SB06 | `SB06_STORYBOARD.png` | `@UNBOUND_SB06` |
| A06 | `A06_NARRATION.wav` | `@UNBOUND_A06` |

## After generation

Watch once with sound. Check all nine beats and their short secondary memories against the [story checklist](../../04_tracking/story_beats.csv). Verify identity, the exterior present, moving memories, correct narration and continuation of the previous camera/sound state where applicable. Keep the first usable take; name any missing story beat before considering a paid repair. Minor coherent generative irregularities are acceptable.

`CHAIN` and `MASTER` names describe intended outputs. Treat an output as a cumulative master only if the actual native export contains all preceding footage and sound. A separate continuation segment is not that master.

## World pages for this block

Use [W06 Page A](../../02_library/worlds/real/W06_MAIN_WORLD_A.txt), [Page B](../../02_library/worlds/real/W06_MAIN_WORLD_B.txt) and [Page C](../../02_library/worlds/real/W06_MAIN_WORLD_C.txt), each rendered as one 4K 2×2 image. Together they preserve all nine original view descriptions; the [world index](../../02_library/worlds/real/README.md) maps the repeated anchors. These are three inputs for this same film block, not three extra video jobs.

The B/C Element definitions are in the [new-only companion import](../../00_project/elements/archive/batches/10_world_reference_pages.md); they have not been imported or rendered. Obtain their full actual IDs, check the accepted page images and replace the pending references before generating this block. The existing W06 Element still points to its previously associated image until Page A is accepted and associated. Do not use an old nine-cell image while telling the video that it is new Page A. Keep existing accepted media available and do not repeat earlier imports.
