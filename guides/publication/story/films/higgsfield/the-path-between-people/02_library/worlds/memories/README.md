# Memory references — 4K pages and 2K single views

The `01_`–`30_` filename prefixes define generation order: T01, MW01–MW06, MWP01, MWP02, then HRW07; each group stays A, B, C. Every memory-image dependency precedes its dependent prompt. After generating a required source page, bind its actual Element ID before continuing to dependent pages. A/B/C naming alone does not create a dependency; the scoped input list in each prompt is authoritative. Already generated pages need no repeat generation. The split sets use an extra position prefix, such as `06_01_`, and new canonical keys. See [single-view order and missing inputs](SINGLE_VIEWS.md).

There are 69 active copy-ready memory prompts: 17 retained 4K 2×2 pages and 52 separate full-frame 2K images. The seven former pages numbered 05, 06, 07, 09, 19, 20 and 21 were split into four images each. Each split image preserves its complete original scene assignment and uses only its own references. Original page text is archived for comparison. Binding an output ID does not by itself verify its attached image.

| Bank | Page A: original 1–4 | Page B: original 5–8 | Page C: original 9, 1, 7, 8 |
| --- | --- | --- | --- |
| MW01 | [A](04_MW01_LONDON_SOCIAL_A.txt) | [B](SINGLE_VIEWS.md#mw01-b) | [C](SINGLE_VIEWS.md#mw01-c) |
| MW02 | [A](SINGLE_VIEWS.md#mw02) | [B](08_MW02_GLOBAL_ROUTES_B.txt) | [C](SINGLE_VIEWS.md#mw02-c) |
| MW03 | [A](10_MW03_WORK_RULE_CHANGE_ADMIN_A.txt) | [B](SINGLE_VIEWS.md#mw03-b) | [C](SINGLE_VIEWS.md#mw03-c) |
| MW04 | [A](13_MW04_POLICE_DEFENCE_A.txt) | [B](SINGLE_VIEWS.md#mw04-b) | [C](SINGLE_VIEWS.md#mw04-b) |
| MW05 | [A](16_MW05_COURT_FILE_A.txt) | [B](SINGLE_VIEWS.md#mw04-b) | [C](SINGLE_VIEWS.md#mw05-c) |
| MW06 | [A](SINGLE_VIEWS.md#mw06) | [B](SINGLE_VIEWS.md#mw06-b) | [C](SINGLE_VIEWS.md#mw06-c) |
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

The [present worlds](../real/README.md) use 84 separate 2K full-frame images. Memory sources use the mixed 51-output plan described above. Production video/storyboard prompts map these references back to their assigned views. Page changes never trigger video cuts. Reference roles do not guarantee temporal continuity; inspect that in the pilot.

## Inputs, imports and reality boundary

Use only the input references listed for each page. Sets 05 (MW01_B) and 20 (MW06_B), and pages 08 (MW02_B) and 23 (MWP01_B) depict different subjects from their banks' Page A and no longer require that unrelated page. Retained page or single-image references preserve the specific recurring places or objects. The split-image dependency list is in SINGLE_VIEWS.md. Supply the actual Element ID and attach the accepted image wherever a required input is still unbound. Existing C01–C31 identity mentions are bound.

MW01 also uses the current T01_A restaurant source (`T01_DETAILS`), replacing the legacy pilot restaurant mention. Generate T01_A from C01/C02 first, bind its actual output ID, then generate MW01_A and the relevant companion pages. MW01_B has no Soho restaurant scene and uses neither T01_A nor MW01_A. A missing mention is marked `@UNBOUND_...`; it is not a usable Higgsfield reference.

HRW07_A uses only the bound C01 patient and C05 nurse identities. It can establish the clinical room first; HRW07_B/C subsequently use that accepted room. Its patient gesture is one deep inhalation on returning from anaesthesia, with a wrist cuff and short chain attached to the bed and only the foot supported beneath the heel/ankle.

The repeated original views 1, 7 and 8 on Page C are intentional coverage, not duplicate Element IDs. When a recurring room or object was established on Page B, also retain that accepted B image for visual comparison; Page A alone does not show those subjects.

Clinical HRW07 remains ordinary reality, no cards or morph effects. All three HRW07 pages are restricted to Block 07, its scripted tiny fragments and final explicit hard cut. No nurse, restraint or room reveal is added to Blocks 01–06. Remembered people remain card-free; these files do not remove current-city ratings.

All 69 active prompts are below 15,000 characters including spaces and newlines. Follow each prompt’s own output setting: retained pages are 4K 2×2; the 52 split views are 2K with no panels. Source identity sheets must not introduce front/back/headshot layouts into a scene. All 28 split scene assignment bodies remain verbatim in the new files. Use the [current pilot queue](https://github.com/fssrepository/myscoutee-backend/blob/81ca568c3197f6caa8f8d4522dd58594eb765818/guides/story/london/cinema_studio_steps/01_pilot/PILOT_IMAGE_QUEUE.md) for the pilot subset; this library is not a requirement to generate every memory before the first test.

MW04_B has now also been split: [four 2K prompts and import](SINGLE_VIEWS.md#mw04-b). The active memory bank now contains 69 prompts: 52 single 2K images and 17 four-cell 4K pages.

MW04_C has now also been split: [four 2K prompts and import](SINGLE_VIEWS.md#mw04-b). The active memory bank now contains 69 prompts: 52 single 2K images and 17 four-cell 4K pages.

MW05_B has now also been split: [four 2K prompts and import](SINGLE_VIEWS.md#mw04-b). The active memory bank now contains 69 prompts: 52 single 2K images and 17 four-cell 4K pages.

MW03_B and MW03_C: eight new full-frame 2K prompts; [import and assignment guide](../../../00_project/elements/additions/MW03_BC_IMPORT_AND_CLEANUP.md). All eight retain the accepted Page A input.

MW05_C also uses four complete 2K single views: [prompts](SINGLE_VIEWS.md#mw05-c).
