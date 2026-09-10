# Új Elementek importja — 2026-09-10

A Higgsfield MCP teljes Element-listájában a 12 új cél még nem szerepelt. Csak ezt a fájlt importáld egyszer:
[MW04_BC_MW05_B_MISSING_ONLY_IMPORT.md](MW04_BC_MW05_B_MISSING_ONLY_IMPORT.md).
A három csoport külön importfájlját ugyanakkor már ne importáld újra.

## Törölhető régi Elementek

Ezeket a három szétbontott 4K lap helyett a 12 külön 2K kép váltja ki. A teljes Element-adatlapokban sem kép, sem videó nincs hozzárendelve. Ez az Elementek listája; a generált képeket nem kell törölni.

| Régi Element pontos neve | UUID | Új célok |
|---|---|---|
| `@loc_MYS_mys-mw04-b-police-defence_s0_v1` | `24d551f4-3f6d-4f93-ad02-d2a2122467f4` | MW04_B_01–04 |
| `@loc_MYS_mys-mw04-c-police-defence_s0_v1` | `8e7c58c1-509c-4080-ba8a-a7bc7d5e0009` | MW04_C_01–04 |
| `@loc_MYS_mys-mw05-b-court-file_s0_v1` | `bb196dee-004a-470f-9423-b5a5001eefec` | MW05_B_01–04 |

Az MW04_A és MW05_A megmarad: ezek elfogadott referenciaoldalak.

## Kész kép → új cél-Element

Az alábbi nevek az importdefiníciók nevei. Az import után kapott tényleges @nevet és UUID-t még le kell kérdezni; nincs kitalált élő azonosító. Mindegyik cél egy külön 2K, 16:9 képet kap.

| Promptfájl | Egyedi kulcs | Cél neve az importban |
|---|---|---|
| [14_01_MW04_POLICE_DEFENCE_B_VIEW_05.txt](../../../02_library/worlds/memories/14_01_MW04_POLICE_DEFENCE_B_VIEW_05.txt) | `MW04_B_01` | `MYS MW04_B_01 Memory View 05` |
| [14_02_MW04_POLICE_DEFENCE_B_VIEW_06.txt](../../../02_library/worlds/memories/14_02_MW04_POLICE_DEFENCE_B_VIEW_06.txt) | `MW04_B_02` | `MYS MW04_B_02 Memory View 06` |
| [14_03_MW04_POLICE_DEFENCE_B_VIEW_07.txt](../../../02_library/worlds/memories/14_03_MW04_POLICE_DEFENCE_B_VIEW_07.txt) | `MW04_B_03` | `MYS MW04_B_03 Memory View 07` |
| [14_04_MW04_POLICE_DEFENCE_B_VIEW_08.txt](../../../02_library/worlds/memories/14_04_MW04_POLICE_DEFENCE_B_VIEW_08.txt) | `MW04_B_04` | `MYS MW04_B_04 Memory View 08` |
| [15_01_MW04_POLICE_DEFENCE_C_VIEW_09.txt](../../../02_library/worlds/memories/15_01_MW04_POLICE_DEFENCE_C_VIEW_09.txt) | `MW04_C_01` | `MYS MW04_C_01 Memory View 09` |
| [15_02_MW04_POLICE_DEFENCE_C_VIEW_01.txt](../../../02_library/worlds/memories/15_02_MW04_POLICE_DEFENCE_C_VIEW_01.txt) | `MW04_C_02` | `MYS MW04_C_02 Memory View 01` |
| [15_03_MW04_POLICE_DEFENCE_C_VIEW_07.txt](../../../02_library/worlds/memories/15_03_MW04_POLICE_DEFENCE_C_VIEW_07.txt) | `MW04_C_03` | `MYS MW04_C_03 Memory View 07` |
| [15_04_MW04_POLICE_DEFENCE_C_VIEW_08.txt](../../../02_library/worlds/memories/15_04_MW04_POLICE_DEFENCE_C_VIEW_08.txt) | `MW04_C_04` | `MYS MW04_C_04 Memory View 08` |
| [17_01_MW05_COURT_FILE_B_VIEW_05.txt](../../../02_library/worlds/memories/17_01_MW05_COURT_FILE_B_VIEW_05.txt) | `MW05_B_01` | `MYS MW05_B_01 Memory View 05` |
| [17_02_MW05_COURT_FILE_B_VIEW_06.txt](../../../02_library/worlds/memories/17_02_MW05_COURT_FILE_B_VIEW_06.txt) | `MW05_B_02` | `MYS MW05_B_02 Memory View 06` |
| [17_03_MW05_COURT_FILE_B_VIEW_07.txt](../../../02_library/worlds/memories/17_03_MW05_COURT_FILE_B_VIEW_07.txt) | `MW05_B_03` | `MYS MW05_B_03 Memory View 07` |
| [17_04_MW05_COURT_FILE_B_VIEW_08.txt](../../../02_library/worlds/memories/17_04_MW05_COURT_FILE_B_VIEW_08.txt) | `MW05_B_04` | `MYS MW05_B_04 Memory View 08` |
