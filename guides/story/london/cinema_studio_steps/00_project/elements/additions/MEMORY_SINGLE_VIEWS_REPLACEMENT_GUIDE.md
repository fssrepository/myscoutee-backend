# Memory Elementek cseréje — 28 külön 2K-s kép

## Importálandó fájl

[MEMORY_SINGLE_VIEWS_IMPORT.md](MEMORY_SINGLE_VIEWS_IMPORT.md) — 28 új Location Element, a hét régi grid helyett. Csak ezt az importot használd ehhez a cseréhez; a teljes projektet és a WORLDS_IMPORT-ot nem kell újraimportálni.

Ha az első 24 új Elementet már importáltad, csak a [négy 05-ös kiegészítést](MEMORY_05_SINGLE_VIEWS_IMPORT.md) importáld. A két fájlt ne importáld egymás után, mert a 28-as már tartalmazza a négy 05-öst.

## Törlendő régi grid Elementek

Az új Elementek importja után ezt a hét régi, négyképes Location Elementet törölheted az Elements könyvtárból. A teljes régi nevet vagy a canonical key mezőt egyeztesd; az új `_01`–`_04` végű Elementeket tartsd meg. Régebbi importban a B/C nevek `Reference Page` végűek is lehetnek; a canonical key ugyanaz.

| Régi Element neve | Régi canonical key | Helyette az új Elementek |
| --- | --- | --- |
| MYS MW01_B London Social | `MW01_B` | `MW01_B_01`, `MW01_B_02`, `MW01_B_03`, `MW01_B_04` |
| MYS MW01_C London Social | `MW01_C` | `MW01_C_01`, `MW01_C_02`, `MW01_C_03`, `MW01_C_04` |
| MYS MW02_A Global Routes | `MW02` | `MW02_A_01`, `MW02_A_02`, `MW02_A_03`, `MW02_A_04` |
| MYS MW02_C Global Routes | `MW02_C` | `MW02_C_01`, `MW02_C_02`, `MW02_C_03`, `MW02_C_04` |
| MYS MW06_A Human Countermemories | `MW06` | `MW06_A_01`, `MW06_A_02`, `MW06_A_03`, `MW06_A_04` |
| MYS MW06_B Human Countermemories | `MW06_B` | `MW06_B_01`, `MW06_B_02`, `MW06_B_03`, `MW06_B_04` |
| MYS MW06_C Human Countermemories | `MW06_C` | `MW06_C_01`, `MW06_C_02`, `MW06_C_03`, `MW06_C_04` |

Ez a lista az Element-bejegyzések cseréjéről szól, nem a letöltött képfájlok vagy a generálási előzmények törléséről. A hét régi gridhez nincs mentett, felhasználó által megadott végleges Element ID. A külső könyvtár aktuális tartalmát ez az ellenőrzés nem látta.

## Megtartandó Elementek

- `MYS MW01_A London Social`: az elkészült 04-es lap, mentett ID: `loc_MYS_mys-mw01-a-london-social_s0_v1`.
- `MW02_B`: a 08-as, továbbra is 4K-s lap.
- Minden MW03, MW04, MW05, MWP01 és MWP02 lap.
- Mindhárom T01 étteremlap és mindhárom HRW07 klinikai lap.
- Az összes real world, karakter, karakter-morph, egyéb morph és typography Element.

A csere után a memory terv 51 Element: 23 megtartott 4K-s lap és 28 külön 2K-s kép. Ez terv szerinti darabszám, nem a felület jelenlegi darabszámának igazolása.

## Generálási sorrend

A promptkönyvtár számozását kövesd. [Részletes sorrend és hiányzó bemenetek](../../../02_library/worlds/memories/SINGLE_VIEWS.md). A hiányzó hivatkozást a prompt eleji `REFERENCE SETUP INCOMPLETE` sor is jelzi.

- `05_01`: indítható, nincs képreferencia.
- `05_02`: indítható; az `05_01` képének Element ID-ja be van kötve.
- `05_03`: indítható; az `05_02` képének Element ID-ja be van kötve.
- `05_04`: indítható, a főhős referenciája már be van kötve.

Az új Elementek tényleges Higgsfield ID-jait a létrehozás után kell bemásolni és bekötni; az importnév és a canonical key nem kitalált működő @-azonosító.
