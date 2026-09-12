# Face/IP — teljes kép- és teendőlista

Frissítve: **2026-09-12**. Az alábbi táblázat az aktuális nyilvántartás; új eredménynél a megfelelő sort és az összesítést kell frissíteni, nem újabb státuszbekezdést hozzáfűzni.

**10 eredetileg problémás elem: 2 lezárt, 8 nyitott.** A nyitott nyolcból **3-hoz még új kép kell**, **5-nél a csere már csatolva van, az elfogadás visszaigazolása hiányzik**. Ez nem nyolc újragenerálást jelent.

Ezen felül **1 kapcsolódó folytonossági csere (MW01_B_03)** már csatolva van, végső elfogadása nincs rögzítve. A teljes munkalista így **11 tétel: 2 lezárt és 9 adminisztratívan nyitott**.

| Állapot | Tételek | Darab |
| --- | --- | ---: |
| Lezárt | MW02_A_02, MW02_C_02 | 2 |
| Csere még előkészítendő | MW05_B_03, MW06_A_02, MW06_B_03 | 3 |
| Csere csatolva; eligibility-visszaigazolás hiányzik | C07, MW01_C_03, MW01_C_04, MW04_C_01, W04_A_03 | 5 |
| Kapcsolódó csere csatolva; végső elfogadás hiányzik | MW01_B_03 | 1 |

Az eredeti hibastatisztika továbbra is **7 Face/IP-blokk + 3 lassú/függő ellenőrzés**. A függő ellenőrzés nem igazolt elutasítás. MW04_C_01 P06/P10 előfordulása egyetlen tétel. MW01_B_03 nem önálló Face/IP-hiba. Az API `completed` állapota önmagában nem igazolja a Cinema Studio eligibility eredményét; a hiányzó visszaigazolás miatt nem kell automatikusan újragenerálni a már lecserélt képet.

## Teljes munkalista

Az azonosítóra kattintva a képprompt nyílik meg. A handle az utoljára igazolt aktuális kötés; az újonnan generálandó elemeknél még a lecserélendő régi kötést jelöli.

| Kép / prompt | Eredeti ok | Aktuális állapot | Hátralévő teendő / lezárás | Aktuális Element-hivatkozás |
| --- | --- | --- | --- | --- |
| [C07](../02_library/characters/C07_FX_MORTGAGE_HOUSEMATE.txt) | Face/IP-blokk | **CSERE FELTÖLTVE** | Új kép és egyetlen csatolmány igazolva; az eligibility eredményét rögzíteni kell. | `@char_MYS_mys-c07-fx-mortgage-housemate_s0_v1` |
| [MW01_B_03](../02_library/worlds/memories/05_03_MW01_LONDON_SOCIAL_B_VIEW_07.txt) | Kapcsolódó folytonossági csere | **CSERE FELTÖLTVE** | Az új C07-tel készült ülő jelenet csatolva, képi ellenőrzése megtörtént; végső elfogadás nincs rögzítve. | `@loc_MYS_mys-mw01-b-03-memory-view-07_s1_v1` |
| [MW01_C_03](../02_library/worlds/memories/06_03_MW01_LONDON_SOCIAL_C_VIEW_07.txt) | Lassú / függő ellenőrzés | **CSERE FELTÖLTVE** | Új telefonos jelenet csatolva; az eligibility eredményét rögzíteni kell. | `@loc_MYS_mys-mw01-c-03-memory-view-07_s2_v1` |
| [MW01_C_04](../02_library/worlds/memories/06_04_MW01_LONDON_SOCIAL_C_VIEW_08.txt) | Lassú / függő ellenőrzés | **CSERE FELTÖLTVE** | Új kép csatolva; az eligibility eredményét rögzíteni kell. | `@loc_MYS_mw01-c-04-memory-view-08_s0_v1` |
| [MW02_A_02](../02_library/worlds/memories/07_02_MW02_GLOBAL_ROUTES_A_VIEW_02.txt) | Face/IP-blokk | **LEZÁRT** | A csere elfogadását a készítő 2026-09-11-én megerősítette. | `@loc_MYS_mys-mw02-a-02-memory-view-02_s0_v1` |
| [MW02_C_02](../02_library/worlds/memories/09_02_MW02_GLOBAL_ROUTES_C_VIEW_01.txt) | Lassú / függő ellenőrzés | **LEZÁRT** | A csere elfogadását a készítő 2026-09-11-én megerősítette. | `@loc_MYS_mys-mw02-c-02-memory-view-01_s0_v1` |
| [MW04_C_01](../02_library/worlds/memories/15_01_MW04_POLICE_DEFENCE_C_VIEW_09.txt) | Face/IP-blokk | **CSERE FELTÖLTVE ÉS BEFŰZVE** | 2026-09-12 MCP: új elem `677bae2a-0620-4b61-ad82-3735b3196cce`, egy új kép csatolva. P06-befűzés a készítő által megerősítve; eligibility-eredmény még nincs rögzítve. | `@loc_MYS_mys-mw04-c-01-memory-view-09_s0_v1` |
| [W04_A_03](../02_library/worlds/real/W04_A_03_MAIN_WORLD_VIEW_03.txt) | Face/IP-blokk | **CSERE FELTÖLTVE ÉS BEFŰZVE** | 2026-09-12 MCP: új elem `3870047d-f72c-4f4d-894b-bf13dd20c89a`, egy új kép csatolva. P06-befűzés a készítő által megerősítve; eligibility-eredmény még nincs rögzítve. | `@loc_MYS_mys-w04-a-03-world-view-03_s0_v1` |
| [MW05_B_03](../02_library/worlds/memories/17_03_MW05_COURT_FILE_B_VIEW_07.txt) | Face/IP-blokk | **CSERE ELŐKÉSZÍTENDŐ** | Csereprompt, új kép, csatolás és eligibility még hátravan. | `@loc_MYS_mys-mw05-b-03-memory-view-07_s0_v1` |
| [MW06_A_02](../02_library/worlds/memories/19_02_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_02.txt) | Face/IP-blokk | **CSERE ELŐKÉSZÍTENDŐ** | Csereprompt, új kép, csatolás és eligibility még hátravan. | `@loc_MYS_mys-mw06-a-02-memory-view-02_s0_v1` |
| [MW06_B_03](../02_library/worlds/memories/20_03_MW06_HUMAN_COUNTERMEMORIES_B_VIEW_07.txt) | Face/IP-blokk | **CSERE ELŐKÉSZÍTENDŐ** | Csereprompt, új kép, csatolás és eligibility még hátravan. | `@loc_MYS_mys-mw06-b-03-memory-view-07_s0_v1` |

Importok: [P06 — MW04_C_01 és W04_A_03](../00_project/elements/additions/P06_TWO_ELEMENTS_IMPORT.md), [C07](../00_project/elements/additions/C07_HOUSEMATE_REPLACEMENT_IMPORT.md), [P03 utazási emlékek](../00_project/elements/additions/P03_TRAVEL_MEMORIES_REPLACEMENT_IMPORT.md).

A `p_eligibility` felületi mappatagságot az Element API nem mutatja; ez a lista a dokumentált problémás képek munkalistája. NSFW- és általános Failed-generálások külön kategóriák, a [projektbrief](../00_project/project_brief.txt) statisztikájában szerepelnek.

<details>
<summary>Korábbi ellenőrzések és technikai azonosítók — archív bizonyíték, nem aktuális teendőlista</summary>

A következő szöveg a rendezés előtti ellenőrzési napló. Régi és később felülírt státuszokat is tartalmaz; a fenti munkalista az irányadó. Megőrzi a csere-UUID-kat, képazonosítókat és a korábbi megfigyelések részleteit.

# Face/IP eligibility — image checklist

Updated: 2026-09-11.

**10 affected Elements: 7 Face/IP blocks, 3 slow or pending checks.** These are the reported problem states; replacement images are not marked as passed until their eligibility result is confirmed. Slow checks are not confirmed rejections.

## Reported status and replacement results

| ID | Status | Element | Source prompt |
| --- | --- | --- | --- |
| C07 | Face/IP blocked | `@char_MYS_mys-c07-fx-mortgage-housemate_s0_v1` | [Housemate character sheet](../02_library/characters/C07_FX_MORTGAGE_HOUSEMATE.txt) |
| MW01_C_03 | Slow / pending | `@loc_MYS_mys-mw01-c-03-memory-view-07_s0_v1` | [Family video call](../02_library/worlds/memories/06_03_MW01_LONDON_SOCIAL_C_VIEW_07.txt) |
| MW01_C_04 | Slow / pending | `@loc_MYS_mys-mw01-c-04-memory-view-08_s0_v1` | [Leaving the cafe](../02_library/worlds/memories/06_04_MW01_LONDON_SOCIAL_C_VIEW_08.txt) |
| MW02_A_02 | Replacement accepted; original Face/IP blocked | `@loc_MYS_mys-mw02-a-02-memory-view-02_s0_v1` | [Agra bus memory](../02_library/worlds/memories/07_02_MW02_GLOBAL_ROUTES_A_VIEW_02.txt) |
| MW02_C_02 | Replacement accepted; original check slow / pending | `@loc_MYS_mys-mw02-c-02-memory-view-01_s0_v1` | [Continuing into the metro station](../02_library/worlds/memories/09_02_MW02_GLOBAL_ROUTES_C_VIEW_01.txt) |
| MW04_C_01 | Face/IP blocked | `@loc_MYS_mys-mw04-c-01-memory-view-09_s0_v1` | [Police-defence memory, view 09](../02_library/worlds/memories/15_01_MW04_POLICE_DEFENCE_C_VIEW_09.txt) |
| W04_A_03 | Face/IP blocked | `@loc_MYS_mys-w04-a-03-world-view-03_s0_v1` | [Main world W04, view 03](../02_library/worlds/real/W04_A_03_MAIN_WORLD_VIEW_03.txt) |
| MW05_B_03 | Face/IP blocked | `@loc_MYS_mys-mw05-b-03-memory-view-07_s0_v1` | [Handmade satirical wanted-page memory](../02_library/worlds/memories/17_03_MW05_COURT_FILE_B_VIEW_07.txt) |
| MW06_A_02 | Face/IP blocked | `@loc_MYS_mys-mw06-a-02-memory-view-02_s0_v1` | [Human counter-memory, view 02](../02_library/worlds/memories/19_02_MW06_HUMAN_COUNTERMEMORIES_A_VIEW_02.txt) |
| MW06_B_03 | Face/IP blocked | `@loc_MYS_mys-mw06-b-03-memory-view-07_s0_v1` | [Human counter-memory, view 07](../02_library/worlds/memories/20_03_MW06_HUMAN_COUNTERMEMORIES_B_VIEW_07.txt) |

MW04_C_01 failed in both P06 and P10; it is counted once. MW02_C_02 belongs to the historical slow/pending group; no explicit rejection was recorded for its original image. Both MW02 replacement images were confirmed accepted on 2026-09-11.

## Current regeneration work

**Next replacements requested on 2026-09-11:** MW04_C_01 and W04_A_03. Both are already included in the seven historical Face/IP blocks above; do not count them again. No replacement is generated or marked accepted by this entry. Individual API reads confirmed the following current bindings, each with one image and `completed` Element status (not a separate eligibility pass):

| Key | Element UUID | Current image job | Production use |
| --- | --- | --- | --- |
| MW04_C_01 | `b0619552-033e-4a72-a222-357881e95419` | `7ae043af-44de-444d-bfe1-a932f7e3f999` | P06, P10 |
| W04_A_03 | `c53dab8a-f35f-4575-b788-6d03d0fda348` | `0a776a51-5f42-4ff2-9ead-6e6fd06b0bf5` | P06 |

The `p_eligibility` folder membership is not exposed by this Element API; inclusion above refers to this versioned problem-image checklist.

2026-09-12: Both linked image prompts have been revised and the [two-Element replacement import](../00_project/elements/additions/P06_REFERENCE_REPLACEMENT_IMPORT.md) is ready. MW04_C_01 now specifies the formal fingerprinting desk, two seated named participants and their restrained smile, using C01/C03 character inputs only. The old output visibly placed the encounter in an apartment with an extra searching officer. W04_A_03 retains its assigned Palace of Justice street role with incidental adult pedestrians and correctly sized rectangular score cards; its old output had oversized speech-bubble cards. These are visible composition corrections, not established causes of the reported Face/IP blocks. Image generation, attachment and eligibility remain pending; production P06/P10 mentions remain unchanged until replacement bindings are observed.

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

### MW01_C_04 replacement binding — 2026-09-11

Current handle: `@loc_MYS_mw01-c-04-memory-view-08_s0_v1` (the second `mys-` prefix is absent). Element UUID: `38847058-729c-40cf-9d3d-17f616f29704`. One attached image: `f52dc2ed-a78d-408a-89b8-5a80bf827292`. API status: completed; separate Face/IP eligibility not confirmed. This supersedes the old C_04 attachment observation above. Production P02, prerelease P02 and the current reference binding now use this handle.
## P03 replacement binding verification — 2026-09-11

MW02_A_02 and MW02_C_02 have been recreated with the rewritten descriptions. Their visible handles are unchanged, so the existing P03 prompt references already match the replacements. Each replacement has exactly one attached image and API status `completed`. The creator subsequently confirmed that both replacement images passed the eligibility check for P03 on 2026-09-11. This resolves these two reference-image issues; it does not record a completed P03 video generation.

| Key | New Element UUID | Attached image job |
|---|---|---|
| MW02_A_02 | `5ac3c0ae-f8fc-46dd-a04b-bde4b67353ef` | `e566a2c7-bbb6-46cc-9db6-a009f2981dc4` |
| MW02_C_02 | `62978407-701a-44fc-80bb-80e971175911` | `5c6fa164-a2e7-4780-a505-517563544f5d` |

</details>
