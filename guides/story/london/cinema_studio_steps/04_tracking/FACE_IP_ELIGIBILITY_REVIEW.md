# Face/IP eligibility — affected images

Date: 2026-09-11. Source: statuses observed by the user in Cinema Studio.

**10 unique Elements in total: 7 blocked, 3 slow checks.** Repeated reports of the same Element are counted once. These are Face/IP eligibility cases, separate from the earlier R010 statue NSFW cases. A slow or repeated check does not by itself mean rejection.

| Group | ID | Element | Source prompt |
| --- | --- | --- | --- |
| Initial 3 | C07 | `@char_MYS_mys-c07-fx-mortgage-housemate_s0_v1` | [Housemate character sheet](../02_library/characters/C07_FX_MORTGAGE_HOUSEMATE.txt) |
| Initial 3 | MW01_C_03 | `@loc_MYS_mys-mw01-c-03-memory-view-07_s0_v1` | [Family video call](../02_library/worlds/memories/06_03_MW01_LONDON_SOCIAL_C_VIEW_07.txt) |
| Initial 3 | MW01_C_04 | `@loc_MYS_mys-mw01-c-04-memory-view-08_s0_v1` | [Leaving the cafe](../02_library/worlds/memories/06_04_MW01_LONDON_SOCIAL_C_VIEW_08.txt) |
| Additional 2 | MW02_A_02 | `@loc_MYS_mys-mw02-a-02-memory-view-02_s0_v1` | [Agra bus memory](../02_library/worlds/memories/07_02_MW02_GLOBAL_ROUTES_A_VIEW_02.txt) |
| Additional 2 | MW02_C_02 | `@loc_MYS_mys-mw02-c-02-memory-view-01_s0_v1` | [Continuing into the metro station](../02_library/worlds/memories/09_02_MW02_GLOBAL_ROUTES_C_VIEW_01.txt) |
| P06, P10 | MW04_C_01 | `@loc_MYS_mys-mw04-c-01-memory-view-09_s0_v1` | [Police-defence memory, view 09](../02_library/worlds/memories/15_01_MW04_POLICE_DEFENCE_C_VIEW_09.txt) |
| P06 | W04_A_03 | `@loc_MYS_mys-w04-a-03-world-view-03_s0_v1` | [Main world W04, view 03](../02_library/worlds/real/W04_A_03_MAIN_WORLD_VIEW_03.txt) |
| P08 | MW05_B_03 | `@loc_MYS_mys-mw05-b-03-memory-view-07_s0_v1` | [Handmade satirical wanted-page memory](../02_library/worlds/memories/17_03_MW05_COURT_FILE_B_VIEW_07.txt) |
| P09 | MW06_A_02 | `@loc_MYS_mys-mw06-a-02-memory-view-02_s0_v1` | [Human counter-memory, view 02](../02_library/worlds/memories/19_02_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_02.txt) |
| P10 | MW06_B_03 | `@loc_MYS_mys-mw06-b-03-memory-view-07_s0_v1` | [Human counter-memory, view 07](../02_library/worlds/memories/20_03_MW06_HUMAN_COUNTERMEMORIES_B_VIEW_07.txt) |

## Recorded observations

- The user previously reported a Face/IP error for C07.
- The user reported slow, repeated eligibility checks for MW01_C_03 and MW01_C_04.
- **MW02_A_02: blocked by the Face/IP eligibility check**, explicitly confirmed by the user.
- The user also reported a problem with MW02_C_02; no separate rejection message is recorded.
- **MW04_C_01 and W04_A_03: blocked by the Face/IP eligibility check**, explicitly reported by the user while reviewing P06.
- **MW05_B_03: blocked by the Face/IP eligibility check**, reported by the user while reviewing P08. The user confirms that this Element contains only one image. Its source prompt names C01 as its only character reference and also includes a printed portrait of the same protagonist on a handmade satirical page.
- **MW06_A_02: blocked by the Face/IP eligibility check**, explicitly reported by the user while reviewing P09.
- **MW04_C_01: Face/IP block reported again while reviewing P10.** This is the same Element previously reported in P06, not an additional unique image.
- **MW06_B_03: blocked by the Face/IP eligibility check**, explicitly reported by the user while reviewing P10.
- The initial five Elements comprised **2 blocked and 3 slow** checks. The two new P06 blocks, one P08 block, one P09 block and one new P10 block bring the total to **7 blocked and 3 slow** checks across ten unique Elements. The observations above record user reports; no screenshots of the rejection messages are attached to this note.

## Next steps

The user requested regeneration of the first three images; the seven subsequently reported unique images were added to this same tracking list. Acceptance of the replacement images and their attachment to the Elements have not yet been confirmed in this note.

Keep the existing Element names when replacing images. This list does not remove references from the production prompts. The user suspects the protagonist's face. MW05_B_03 strengthens this working hypothesis because the source prompt uses only C01 as a character reference and the user reports just one image attached. This identifies a relevant image and character, but does not establish which visible face instance or other image content caused the Face/IP result. C01's use in the accepted P01 does not rule out a problem with a particular depiction in another image. C07 and the family video-call image involve a different character and should be tracked separately from the C01 hypothesis. An API Element status of `completed` does not by itself confirm the image-level Face/IP eligibility result in Cinema Studio.
