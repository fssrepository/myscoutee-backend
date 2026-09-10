# Memory reference pages — 4K 2×2

The `01_`–`30_` filename prefixes define generation order: T01, MW01–MW06, MWP01, MWP02, then HRW07; each group stays A, B, C. Every memory-image dependency precedes its dependent prompt. After generating a required source page, bind its actual Element ID before continuing to dependent pages. Already generated pages need no repeat generation. Prefixes change filenames only; prompt text, canonical keys and Element IDs are unchanged.

Each file is one copy-ready image prompt for a 3840×2160 canvas divided into four 1920×1080 cells without gutters. Each original nine-view bank now has three pages, preserving all 81 original views across the nine banks. Every page filename ends in _A.txt, _B.txt or _C.txt so the pages sort together. The canonical Element keys identify these pages; binding an output ID does not by itself verify its attached image.

| Bank | Page A: original 1–4 | Page B: original 5–8 | Page C: original 9, 1, 7, 8 |
| --- | --- | --- | --- |
| MW01 | [A](04_MW01_LONDON_SOCIAL_A.txt) | [B](05_MW01_LONDON_SOCIAL_B.txt) | [C](06_MW01_LONDON_SOCIAL_C.txt) |
| MW02 | [A](07_MW02_GLOBAL_ROUTES_A.txt) | [B](08_MW02_GLOBAL_ROUTES_B.txt) | [C](09_MW02_GLOBAL_ROUTES_C.txt) |
| MW03 | [A](10_MW03_WORK_RULE_CHANGE_ADMIN_A.txt) | [B](11_MW03_WORK_RULE_CHANGE_ADMIN_B.txt) | [C](12_MW03_WORK_RULE_CHANGE_ADMIN_C.txt) |
| MW04 | [A](13_MW04_POLICE_DEFENCE_A.txt) | [B](14_MW04_POLICE_DEFENCE_B.txt) | [C](15_MW04_POLICE_DEFENCE_C.txt) |
| MW05 | [A](16_MW05_COURT_FILE_A.txt) | [B](17_MW05_COURT_FILE_B.txt) | [C](18_MW05_COURT_FILE_C.txt) |
| MW06 | [A](19_MW06_HUMAN_COUNTERMEMORIES_A.txt) | [B](20_MW06_HUMAN_COUNTERMEMORIES_B.txt) | [C](21_MW06_HUMAN_COUNTERMEMORIES_C.txt) |
| MWP01 | [A](22_MWP01_ROUTES_ROOMS_DOCUMENTS_A.txt) | [B](23_MWP01_ROUTES_ROOMS_DOCUMENTS_B.txt) | [C](24_MWP01_ROUTES_ROOMS_DOCUMENTS_C.txt) |
| MWP02 | [A](25_MWP02_SYSTEM_TIME_REVERSALS_A.txt) | [B](26_MWP02_SYSTEM_TIME_REVERSALS_B.txt) | [C](27_MWP02_SYSTEM_TIME_REVERSALS_C.txt) |
| HRW07 | [A](28_HRW07_CLINICAL_REALITY_A.txt) | [B](29_HRW07_CLINICAL_REALITY_B.txt) | [C](30_HRW07_CLINICAL_REALITY_C.txt) |

T01 now follows the same A–B–C organization, with twelve detailed views of the accepted restaurant:

| Bank | Page A | Page B | Page C |
| --- | --- | --- | --- |
| T01 | [Room and encounter](01_T01_SOHO_RESTAURANT_SOURCE_A.txt) | [People and contact details](02_T01_SOHO_RESTAURANT_SOURCE_B.txt) | [Construction and camera clearance](03_T01_SOHO_RESTAURANT_SOURCE_C.txt) |

In the clean restart, T01_A establishes the restaurant from its detailed text and C01/C02 character images. T01_B/C reuse accepted T01_A for consistent layout and furnishings. Output keys are T01_DETAILS (A), T01_DETAILS_B and T01_DETAILS_C. The deleted single-image T01_IMAGE is not recreated as an Element.

## Use several pages per video

Memory pages show literal places, people, gestures and spatial relationships. Their four cells are not necessarily successive material states: that is the role of the [morph sheets](../../morphs/README.md). Do not force different memories into one room, or render four similar wide views when different details are assigned. Multiple pages of the same room retain its identity, layout and wardrobe; different memories preserve their own settings. Additional coverage can be prepared for one place without creating a new story event.

The [present worlds](../real/README.md) use 84 separate 2K full-frame images. Memory sources retain the 30 four-cell 4K pages listed here. Production video/storyboard prompts map these references back to their assigned views. Page changes never trigger video cuts. Reference roles do not guarantee temporal continuity; inspect that in the pilot.

## Inputs, imports and reality boundary

Generate and accept each bank's Page A before its B/C companions. The 20 B/C prompts currently have explicit unbound Page A inputs. Supply the actual Higgsfield Element ID and attach the accepted image before using them. Existing C01–C31 identity mentions are bound.

MW01 also uses the current T01_A restaurant source (`T01_DETAILS`), replacing the legacy pilot restaurant mention. Generate T01_A from C01/C02 first, bind its actual output ID, then generate MW01_A and the relevant companion pages. A missing mention is marked `@UNBOUND_...`; it is not a usable Higgsfield reference.

HRW07_A uses only the bound C01 patient and C05 nurse identities. It can establish the clinical room first; HRW07_B/C subsequently use that accepted room. Its patient gesture is one deep inhalation on returning from anaesthesia, with a wrist cuff and short chain attached to the bed and only the foot supported beneath the heel/ankle.

The repeated original views 1, 7 and 8 on Page C are intentional coverage, not duplicate Element IDs. When a recurring room or object was established on Page B, also retain that accepted B image for visual comparison; Page A alone does not show those subjects.

Clinical HRW07 remains ordinary reality, no cards or morph effects. All three HRW07 pages are restricted to Block 07, its scripted tiny fragments and final explicit hard cut. No nurse, restraint or room reveal is added to Blocks 01–06. Remembered people remain card-free; these files do not remove current-city ratings.

All 30 prompts are below 15,000 characters including spaces and newlines. Each requests one 4K 16:9 output containing four equal 2×2 cells; source identity sheets must not introduce front/back/headshot panels or nested grids. The four detailed cell assignments remain intact. Use the [current pilot queue](../../../01_pilot/PILOT_IMAGE_QUEUE.md) for the pilot subset; this library is not a requirement to generate every memory before the first test.
