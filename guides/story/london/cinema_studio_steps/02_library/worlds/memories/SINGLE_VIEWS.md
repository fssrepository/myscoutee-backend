# Memory single views — generation order

Seven former 4K grids are now 28 separate full-frame 16:9 images. Select **2K** and generate one image per prompt. Other memory prompts keep their specified 4K grid format. The 28 scene assignment bodies were copied verbatim; only layout instructions, per-view references and the permitted optional cast selection changed.

Use the filename order. A missing Element ID is an actual dependency: wait for the earlier output and bind its ID before pasting that prompt. Do not paste an `@UNBOUND_...` placeholder into generation. Readiness below reflects the currently saved bindings.

Import the [28 Location additions](../../../00_project/elements/additions/MEMORY_SINGLE_VIEWS_IMPORT.md) once for the new images. Original grid definitions may remain in the external library; the active prompts use the new single-view keys. No existing external media is deleted.

At the creator-reported rates, these 28 images cost 56 credits for one attempt each; the former seven 4K grids cost 28 credits. Difference: **+28 credits**, excluding retries. This is a planning comparison, not a charge or current account balance.

## MW01_B

| Prompt | Original view | Character inputs | Missing Element IDs |
| --- | ---: | ---: | --- |
| [05_01_MW01_LONDON_SOCIAL_B_VIEW_05.txt](05_01_MW01_LONDON_SOCIAL_B_VIEW_05.txt) | 05 | 0 | **Ready** |
| [05_02_MW01_LONDON_SOCIAL_B_VIEW_06.txt](05_02_MW01_LONDON_SOCIAL_B_VIEW_06.txt) | 06 | 1 | MW01_B_01 |
| [05_03_MW01_LONDON_SOCIAL_B_VIEW_07.txt](05_03_MW01_LONDON_SOCIAL_B_VIEW_07.txt) | 07 | 3 | MW01_B_02 |
| [05_04_MW01_LONDON_SOCIAL_B_VIEW_08.txt](05_04_MW01_LONDON_SOCIAL_B_VIEW_08.txt) | 08 | 1 | **Ready** |

Original text: [archived MW01_B](../../../04_tracking/archive/memory_grids_before_single_views/05_MW01_LONDON_SOCIAL_B.md).

## MW01_C

| Prompt | Original view | Character inputs | Missing Element IDs |
| --- | ---: | ---: | --- |
| [06_01_MW01_LONDON_SOCIAL_C_VIEW_09.txt](06_01_MW01_LONDON_SOCIAL_C_VIEW_09.txt) | 09 | 2 | **Ready** |
| [06_02_MW01_LONDON_SOCIAL_C_VIEW_01.txt](06_02_MW01_LONDON_SOCIAL_C_VIEW_01.txt) | 01 | 2 | **Ready** |
| [06_03_MW01_LONDON_SOCIAL_C_VIEW_07.txt](06_03_MW01_LONDON_SOCIAL_C_VIEW_07.txt) | 07 | 3 | MW01_B_03 |
| [06_04_MW01_LONDON_SOCIAL_C_VIEW_08.txt](06_04_MW01_LONDON_SOCIAL_C_VIEW_08.txt) | 08 | 1 | MW01_B_04 |

Original text: [archived MW01_C](../../../04_tracking/archive/memory_grids_before_single_views/06_MW01_LONDON_SOCIAL_C.md).

## MW02

| Prompt | Original view | Character inputs | Missing Element IDs |
| --- | ---: | ---: | --- |
| [07_01_MW02_GLOBAL_ROUTES_A_VIEW_01.txt](07_01_MW02_GLOBAL_ROUTES_A_VIEW_01.txt) | 01 | 2 | **Ready** |
| [07_02_MW02_GLOBAL_ROUTES_A_VIEW_02.txt](07_02_MW02_GLOBAL_ROUTES_A_VIEW_02.txt) | 02 | 2 | **Ready** |
| [07_03_MW02_GLOBAL_ROUTES_A_VIEW_03.txt](07_03_MW02_GLOBAL_ROUTES_A_VIEW_03.txt) | 03 | 4 | **Ready** |
| [07_04_MW02_GLOBAL_ROUTES_A_VIEW_04.txt](07_04_MW02_GLOBAL_ROUTES_A_VIEW_04.txt) | 04 | 2 | MW02_A_03 |

Original text: [archived MW02](../../../04_tracking/archive/memory_grids_before_single_views/07_MW02_GLOBAL_ROUTES_A.md).

## MW02_C

| Prompt | Original view | Character inputs | Missing Element IDs |
| --- | ---: | ---: | --- |
| [09_01_MW02_GLOBAL_ROUTES_C_VIEW_09.txt](09_01_MW02_GLOBAL_ROUTES_C_VIEW_09.txt) | 09 | 5 | **Ready** |
| [09_02_MW02_GLOBAL_ROUTES_C_VIEW_01.txt](09_02_MW02_GLOBAL_ROUTES_C_VIEW_01.txt) | 01 | 2 | MW02_A_01 |
| [09_03_MW02_GLOBAL_ROUTES_C_VIEW_07.txt](09_03_MW02_GLOBAL_ROUTES_C_VIEW_07.txt) | 07 | 0 | MW02_B |
| [09_04_MW02_GLOBAL_ROUTES_C_VIEW_08.txt](09_04_MW02_GLOBAL_ROUTES_C_VIEW_08.txt) | 08 | 0 | MW02_B |

Original text: [archived MW02_C](../../../04_tracking/archive/memory_grids_before_single_views/09_MW02_GLOBAL_ROUTES_C.md).

## MW06

| Prompt | Original view | Character inputs | Missing Element IDs |
| --- | ---: | ---: | --- |
| [19_01_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_01.txt](19_01_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_01.txt) | 01 | 2 | **Ready** |
| [19_02_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_02.txt](19_02_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_02.txt) | 02 | 2 | MW02_A_01 |
| [19_03_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_03.txt](19_03_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_03.txt) | 03 | 3 | MW02_B |
| [19_04_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_04.txt](19_04_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_04.txt) | 04 | 2 | MW04_C |

Original text: [archived MW06](../../../04_tracking/archive/memory_grids_before_single_views/19_MW06_HUMAN_COUNTERMEMORIES_A.md).

## MW06_B

| Prompt | Original view | Character inputs | Missing Element IDs |
| --- | ---: | ---: | --- |
| [20_01_MW06_HUMAN_COUNTERMEMORIES_B_VIEW_05.txt](20_01_MW06_HUMAN_COUNTERMEMORIES_B_VIEW_05.txt) | 05 | 2 | **Ready** |
| [20_02_MW06_HUMAN_COUNTERMEMORIES_B_VIEW_06.txt](20_02_MW06_HUMAN_COUNTERMEMORIES_B_VIEW_06.txt) | 06 | 2 | MW05 |
| [20_03_MW06_HUMAN_COUNTERMEMORIES_B_VIEW_07.txt](20_03_MW06_HUMAN_COUNTERMEMORIES_B_VIEW_07.txt) | 07 | 2 | MW01_C_01 |
| [20_04_MW06_HUMAN_COUNTERMEMORIES_B_VIEW_08.txt](20_04_MW06_HUMAN_COUNTERMEMORIES_B_VIEW_08.txt) | 08 | 1 | **Ready** |

Original text: [archived MW06_B](../../../04_tracking/archive/memory_grids_before_single_views/20_MW06_HUMAN_COUNTERMEMORIES_B.md).

## MW06_C

| Prompt | Original view | Character inputs | Missing Element IDs |
| --- | ---: | ---: | --- |
| [21_01_MW06_HUMAN_COUNTERMEMORIES_C_VIEW_09.txt](21_01_MW06_HUMAN_COUNTERMEMORIES_C_VIEW_09.txt) | 09 | 3 | **Ready** |
| [21_02_MW06_HUMAN_COUNTERMEMORIES_C_VIEW_01.txt](21_02_MW06_HUMAN_COUNTERMEMORIES_C_VIEW_01.txt) | 01 | 2 | MW06_A_01 |
| [21_03_MW06_HUMAN_COUNTERMEMORIES_C_VIEW_07.txt](21_03_MW06_HUMAN_COUNTERMEMORIES_C_VIEW_07.txt) | 07 | 2 | MW06_B_03 |
| [21_04_MW06_HUMAN_COUNTERMEMORIES_C_VIEW_08.txt](21_04_MW06_HUMAN_COUNTERMEMORIES_C_VIEW_08.txt) | 08 | 1 | MW06_B_04 |

Original text: [archived MW06_C](../../../04_tracking/archive/memory_grids_before_single_views/21_MW06_HUMAN_COUNTERMEMORIES_C.md).

