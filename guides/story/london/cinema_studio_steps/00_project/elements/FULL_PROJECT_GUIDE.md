# Teljes újraimport — jelenlegi könyvtár

Importálandó fájl: [FULL_PROJECT_IMPORT.md](FULL_PROJECT_IMPORT.md). Ez az egyetlen teljes aktuális lista; a régi 00–12 részlistákat ne importáld mellé. A fájl csak rövid Element-definíciókat tartalmaz. A részletes generálópromptok külön TXT fájlokban maradnak, a [prompttérkép](FULL_PROJECT_PROMPT_MAP.csv) minden elemhez megadja a pontos fájlt.

| Csoport | Elemek |
| --- | ---: |
| Karakterek C01–C31 | 31 |
| World A–B–C oldalak | 21 |
| Memory/klinikai és T01 A–B–C oldalak | 30 |
| Morph-gridek MR001–MR020, R008, R009 | 22 |
| Megmaradt piros busz R002 | 1 |
| **Összesen** | **105** |

Ez a teljes film könyvtára, nem 105 azonnali generálás vagy egy videó bemenete. A korábbi egyedi kártya-, London-, Bazilika-, tárgy- és részletlapok nem kapnak újabb üres konténert, amikor szerepüket az aktuális world-, memory- vagy morph-oldalak lefedik. Az opcionális térképek és a később elkészülő videó-, storyboard- és hangkimenetek sem Character/Location/Prop importelemek.

## Négy megmaradt kép társítása

A legutóbbi screenshot és a törlési beszélgetés alapján a négy megmaradt kép:

| Kép | Új listában keresendő név |
| --- | --- |
| Férfi karakterlap | MYS C01 Protagonist |
| Nő karakterlap | MYS C02 Soho Woman |
| Katedrális 2×2 morph | MYS MR001 St Pauls To St Stephens |
| Piros busz nézetei | MYS R002 Red London Bus |

A négy kép pontos megmaradását a felületen nem ellenőriztük; ez a beszélgetésből következő társítás, nem új generálási kérés. Az import nem helyez képet az elemekbe: a megmaradt képeket az új konténerekhez kell társítani.

## Újraindítás és hivatkozások

A teljes lista a felhasználó által kért tiszta újraimporthoz készült. Higgsfield nem mergeli a régi és új listát: ezt a teljes fájlt az üresre rendezett Element-listába vagy tiszta projektbe importáld, ne a régi részlistákkal együtt. Az asszisztens nem törölt távoli elemet, képet vagy projektet, és nem hajtott végre importot.

Az A oldalak neve most kifejezetten A-ra végződik a felületen is. A belső kulcsok megmaradtak (például W01 = W01_A; MW01 = MW01_A; T01_DETAILS = T01_A), így nincs külön régi és új A konténer. R008 és R009 a jelenlegi 2×2-es morph-lap; a régi háromnézetes változat nem szerepel külön.

Az új import új teljes @azonosítókat adhat. A korábban rögzített azonosítók történeti adatok, az új importban nem tekinthetők automatikusan érvényesnek. Az aktuálisan szükséges új azonosítókat egyszer kell rögzíteni, majd a promptokban továbbvezetni. A morph-gridek önálló szöveges promptok, hozzájuk nincs bemeneti Element-kötés.

A T01 étterem egyképes forrása a mostani listából kimarad. Az új T01_A a két karakterlapból és a részletes étteremleírásból indul; T01_B/C és a kapcsolódó éttermi emlékek az elfogadott új T01_A-t használják. A korábbi T01_IMAGE-, W01- és R001/R006/R011-képekre mutató videóhivatkozásokat az új kiválasztott gridekhez kell átvezetni az új azonosítók rögzítésekor, nem az egész régi képkönyvtár visszahozásával.
