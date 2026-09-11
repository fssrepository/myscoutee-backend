# Face/IP eligibility — image checklist

Updated: 2026-09-11.

**10 affected Elements: 7 Face/IP blocks, 3 slow or pending checks.** These are the reported problem states; replacement images are not marked as passed until their eligibility result is confirmed. Slow checks are not confirmed rejections.

## Reported status

| ID | Status | Element | Source prompt |
| --- | --- | --- | --- |
| C07 | Face/IP blocked | `@char_MYS_mys-c07-fx-mortgage-housemate_s0_v1` | [Housemate character sheet](../02_library/characters/C07_FX_MORTGAGE_HOUSEMATE.txt) |
| MW01_C_03 | Slow / pending | `@loc_MYS_mys-mw01-c-03-memory-view-07_s0_v1` | [Family video call](../02_library/worlds/memories/06_03_MW01_LONDON_SOCIAL_C_VIEW_07.txt) |
| MW01_C_04 | Slow / pending | `@loc_MYS_mys-mw01-c-04-memory-view-08_s0_v1` | [Leaving the cafe](../02_library/worlds/memories/06_04_MW01_LONDON_SOCIAL_C_VIEW_08.txt) |
| MW02_A_02 | Face/IP blocked | `@loc_MYS_mys-mw02-a-02-memory-view-02_s0_v1` | [Agra bus memory](../02_library/worlds/memories/07_02_MW02_GLOBAL_ROUTES_A_VIEW_02.txt) |
| MW02_C_02 | Slow / pending | `@loc_MYS_mys-mw02-c-02-memory-view-01_s0_v1` | [Continuing into the metro station](../02_library/worlds/memories/09_02_MW02_GLOBAL_ROUTES_C_VIEW_01.txt) |
| MW04_C_01 | Face/IP blocked | `@loc_MYS_mys-mw04-c-01-memory-view-09_s0_v1` | [Police-defence memory, view 09](../02_library/worlds/memories/15_01_MW04_POLICE_DEFENCE_C_VIEW_09.txt) |
| W04_A_03 | Face/IP blocked | `@loc_MYS_mys-w04-a-03-world-view-03_s0_v1` | [Main world W04, view 03](../02_library/worlds/real/W04_A_03_MAIN_WORLD_VIEW_03.txt) |
| MW05_B_03 | Face/IP blocked | `@loc_MYS_mys-mw05-b-03-memory-view-07_s0_v1` | [Handmade satirical wanted-page memory](../02_library/worlds/memories/17_03_MW05_COURT_FILE_B_VIEW_07.txt) |
| MW06_A_02 | Face/IP blocked | `@loc_MYS_mys-mw06-a-02-memory-view-02_s0_v1` | [Human counter-memory, view 02](../02_library/worlds/memories/19_02_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_02.txt) |
| MW06_B_03 | Face/IP blocked | `@loc_MYS_mys-mw06-b-03-memory-view-07_s0_v1` | [Human counter-memory, view 07](../02_library/worlds/memories/20_03_MW06_HUMAN_COUNTERMEMORIES_B_VIEW_07.txt) |

MW04_C_01 failed in both P06 and P10; it is counted once. MW02_C_02 remains in the slow/pending group from the reported three-item total; no explicit rejection was recorded for it.

## Current regeneration work

1. **C07:** replacement character prompt and [Element import file](../00_project/elements/additions/C07_HOUSEMATE_REPLACEMENT_IMPORT.md) are ready. Use the new short, slim housemate. Confirm that the intended image is the only attachment before checking eligibility.
2. **MW01_B_03:** regenerate the [seated family-photograph scene](../02_library/worlds/memories/05_03_MW01_LONDON_SOCIAL_B_VIEW_07.txt) with the new C07. This is a continuity update, not an additional reported Face/IP failure, so it is outside the ten-item total.
3. **MW01_C_03:** regenerate the phone-call scene using the new C07 and the accepted replacement MW01_B_03 room image.

Both housemate memory prompts are updated and specify 2K, 16:9. Their replacement results are pending. C07 retains its 4K prompt specification; the current trial resolution is selected as 2K in the generation controls.

## Diagnostic notes

- The recreated C07 Element was observed with both the old jacket-and-shirt portrait sheet and the new olive-jacket portrait sheet attached. Both are C07 variants; the two attachments do not represent two separate Elements.
- MW05_B_03 was reported blocked with only one image attached. Its only named character reference is C01, whose portrait also appears on the handmade page. C01's depiction is a suspected factor, not a confirmed cause. C07 is a separate character.
- The API's `completed` Element status does not confirm the separate Cinema Studio Face/IP eligibility result. Element state or metadata causing a block remains an unconfirmed explanation.
- Keep the existing Element names and production references when replacing images. If an Element is recreated, select its new binding in the composer.

## Current P02 binding audit — 2026-09-11

The replacement imports received different handles. Production P02, prerelease P02 and the C_03 source prompt now use the observed replacement handles. Historical problem rows above retain the old handles.

| Role | Current handle | Element UUID | Attached image job | API status |
| --- | --- | --- | --- | --- |
| New C07 | `@char_MYS_mys-c07-fx-mortgage-housemate_s0_v1` | `03707746-3d9b-46ed-8c39-53e805142c56` | `167e10f9-cd36-4ef9-9026-2ec6ed1af0a1` | completed |
| New seated scene | `@loc_MYS_mys-mw01-b-03-memory-view-07_s1_v1` | `6119baef-469a-4e82-891f-e9e11005d031` | `1e325537-3fb4-4fa9-84f3-a46350cf9b3b` | completed |
| New phone-call scene | `@loc_MYS_mys-mw01-c-03-memory-view-07_s2_v1` | `83296cbc-cfd9-498e-ba45-5cd83fc3f42f` | `daa6c21c-5447-496b-b762-d53fba4487b4` | completed |

Each replacement has exactly one attached image. Both new scene images were visually checked: B_03 shows the olive-jacket housemate seated beside the photograph; C_03 shows him standing with the shirt and phone. They are assigned to the intended scene Elements. This is a binding check, not full visual acceptance or a Face/IP pass confirmation.

The old C_03 (`62d04035-4aa6-4a76-a6cf-1358c2ff34f0`, `s0_v1`) appeared as ip_checking in the list, then could not be fetched individually during the audit; deletion is not confirmed. The old B_03 (`11b92bb5-3b4e-49a6-b2b3-93991a3ece86`, `s0_v1`) appeared as completed.

C_04 (`560a9880-116f-4865-8ac6-1b852d82dab9`) remains a separate unresolved profile/cafe Element: ip_checking, with image jobs `8d1a8d2b-d225-4e70-a501-d823dcaab241` and `a42d3540-8e06-4a6b-875e-df0026b18850`. It is not replaced by either housemate image. All other fetched P02 Elements had one attached image and completed API status. No remote Elements or media were deleted: the available MCP tool exposes list/get/create only.
