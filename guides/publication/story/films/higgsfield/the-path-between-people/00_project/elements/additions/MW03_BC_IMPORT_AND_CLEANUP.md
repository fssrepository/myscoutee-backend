# MW03 B/C és MW05 C — tizenkét külön 2K kép

Csak a [tizenkét új Location-definíciót](MW03_BC_MW05_C_SINGLE_VIEWS_IMPORT.md) importáld egyszer. Várt előnézet: 12 Location, 0 Character, 0 Prop. Az új célok élő @neve és UUID-je import után ellenőrizhető; most nincs kitalált élő azonosító.

Mind a nyolc prompt 2K, 16:9, egyetlen teljes képes jelenet. Mindegyik az elfogadott MW03_A-t használja, és csak a saját szereplőit kéri. A nyolc generálás egymástól függetlenül indítható. A B_03 külön nyilvántartást ellenőrző szereplője C22 könyvelő, az eredeti lap javítási jelenetekre vonatkozó identitásszabálya szerint.

## Prompt → cél-Element

| Prompt | Jelenet | Bemeneti referenciák száma | Cél neve az importban |
|---|---|---:|---|
| [11_01_MW03_WORK_RULE_CHANGE_ADMIN_B_VIEW_05.txt](../../../02_library/worlds/memories/11_01_MW03_WORK_RULE_CHANGE_ADMIN_B_VIEW_05.txt) | Szabályváltozás: értesítés, naptár és javítandó nyomtatvány | 2 | `MYS MW03_B_01 Memory View 05` |
| [11_02_MW03_WORK_RULE_CHANGE_ADMIN_B_VIEW_06.txt](../../../02_library/worlds/memories/11_02_MW03_WORK_RULE_CHANGE_ADMIN_B_VIEW_06.txt) | Könyvelői portál és átadott ügyintézés | 3 | `MYS MW03_B_02 Memory View 06` |
| [11_03_MW03_WORK_RULE_CHANGE_ADMIN_B_VIEW_07.txt](../../../02_library/worlds/memories/11_03_MW03_WORK_RULE_CHANGE_ADMIN_B_VIEW_07.txt) | Telefonos egyeztetés, külön nyilvántartás ellenőrzése | 3 | `MYS MW03_B_03 Memory View 07` |
| [11_04_MW03_WORK_RULE_CHANGE_ADMIN_B_VIEW_08.txt](../../../02_library/worlds/memories/11_04_MW03_WORK_RULE_CHANGE_ADMIN_B_VIEW_08.txt) | Három ember külön kommunikációs és munkaállomásai | 4 | `MYS MW03_B_04 Memory View 08` |
| [12_01_MW03_WORK_RULE_CHANGE_ADMIN_C_VIEW_09.txt](../../../02_library/worlds/memories/12_01_MW03_WORK_RULE_CHANGE_ADMIN_C_VIEW_09.txt) | Javított és korábbi nyomtatvány összevetése | 2 | `MYS MW03_C_01 Memory View 09` |
| [12_02_MW03_WORK_RULE_CHANGE_ADMIN_C_VIEW_01.txt](../../../02_library/worlds/memories/12_02_MW03_WORK_RULE_CHANGE_ADMIN_C_VIEW_01.txt) | Nyomtató papírkazettájának feltöltése munka közben | 3 | `MYS MW03_C_02 Memory View 01` |
| [12_03_MW03_WORK_RULE_CHANGE_ADMIN_C_VIEW_07.txt](../../../02_library/worlds/memories/12_03_MW03_WORK_RULE_CHANGE_ADMIN_C_VIEW_07.txt) | Külön iratok keresése a nyitott iratszekrényben | 4 | `MYS MW03_C_03 Memory View 07` |
| [12_04_MW03_WORK_RULE_CHANGE_ADMIN_C_VIEW_08.txt](../../../02_library/worlds/memories/12_04_MW03_WORK_RULE_CHANGE_ADMIN_C_VIEW_08.txt) | Irattálca átadása a külön munkaállomások között | 4 | `MYS MW03_C_04 Memory View 08` |

## Kiváltott régi Elementek

A 2026-09-10-i MCP-adatlapok szerint mindkettő üres (kép és videó nélkül), ezért az új definíciók importja után törölhetők. Külső törlést nem végeztem. Az A oldal marad.

- `@loc_MYS_mys-mw03-b-work-rule-change-admin_s0_v1` — UUID: `84607fe9-ff2d-4f29-b9e8-871ce72041c5`
- `@loc_MYS_mys-mw03-c-work-rule-change-admin_s0_v1` — UUID: `57a942a9-c35f-4a4e-b545-132be45b91e9`

A teljes eredeti promptok archiválva vannak. A nyolc új jelenet szövege megmaradt; csak a négypaneles forma lett egyképes, és a referenciák lettek jelenetenként szűkítve.

## MW05_C — további négy 2K kép

A tárgyaló geometriáját az elfogadott MW05_A, a kartonfigurát és szobáját az elfogadott MW05_B_04 rögzíti. A C27 bíró új képi szereplése nincs hozzárendelve ezekhez a jelenetekhez; a korábbi bírói pillanat megmarad az A lapon.

| Prompt | Jelenet | Bemeneti referenciák száma | Cél neve az importban |
|---|---|---:|---|
| [18_01_MW05_COURT_FILE_C_VIEW_09.txt](../../../02_library/worlds/memories/18_01_MW05_COURT_FILE_C_VIEW_09.txt) | Határozat és fellebbezési iratok | 2 | `MYS MW05_C_01 Memory View 09` |
| [18_02_MW05_COURT_FILE_C_VIEW_01.txt](../../../02_library/worlds/memories/18_02_MW05_COURT_FILE_C_VIEW_01.txt) | Tárgyalási iratok elpakolása az ügyvéddel | 3 | `MYS MW05_C_02 Memory View 01` |
| [18_03_MW05_COURT_FILE_C_VIEW_07.txt](../../../02_library/worlds/memories/18_03_MW05_COURT_FILE_C_VIEW_07.txt) | Abszurd rendőri álláspályázat készítése | 1 | `MYS MW05_C_03 Memory View 07` |
| [18_04_MW05_COURT_FILE_C_VIEW_08.txt](../../../02_library/worlds/memories/18_04_MW05_COURT_FILE_C_VIEW_08.txt) | Menedékkérelem a kartonfigurához | 3 | `MYS MW05_C_04 Memory View 08` |

További kiváltott, MCP-n ellenőrzött üres Element: `@loc_MYS_mys-mw05-c-court-file_s0_v1` — UUID: `4172ffc4-184a-4954-80f4-03ea03ad6418`. Az új definíciók importja után törölhető; külső törlést nem végeztem.
