AKTUÁLIS TÁRGYSZABÁLY: mind a 46 R-tárgy/építészeti lap 4K 2×2 anyag-morph, a buszt is beleértve. Az 1×3-as nézetlapokat a legújabb kérés felülírta. A 105 meglévő importelem változatlan; csak a 45-ös kiegészítő importálandó.

# Teljes újraimport — jelenlegi könyvtár

A 105-ös alaplista már importálva van, változatlanul marad. **Most kizárólag a [45 új tárgy-/építészeti elem kiegészítőjét](13_ADDITIONAL_OBJECT_REFERENCES.md) importáld.** A busz és minden meglévő karakter/world/memory/morph kimarad ebből. A [teljes prompttérkép](FULL_PROJECT_PROMPT_MAP.csv) a két import együttes könyvtárát mutatja.

| Csoport | Elemek |
| --- | ---: |
| Karakterek C01–C31 | 31 |
| World A–B–C oldalak | 21 |
| Memory/klinikai és T01 A–B–C oldalak | 30 |
| Morph-gridek MR001–MR020, R008, R009 | 22 |
| Önálló tárgy- és építészeti referenciák, köztük R002 busz | 46 |
| **Összesen** | **150** |

Ez a teljes film könyvtára, nem 150 azonnali generálás vagy egy videó bemenete. A tárgyak és építészeti részletek külön 2×2-as referencialapokat kapnak: ezek a háromdimenziós alakot és anyagrészleteket mutatják, a worldök a környezetet, a 2×2-es morphok az átalakulást. A régi külön kártyás/nyitóutcai képek és a kiváltott egynézetes morphok továbbra sem külön importelemek. Az opcionális térképek és a később elkészülő videó-, storyboard- és hangkimenetek sem Character/Location/Prop importelemek.

## Négy megmaradt kép társítása

A legutóbbi screenshot és a törlési beszélgetés alapján a négy megmaradt kép:

| Kép | Új listában keresendő név |
| --- | --- |
| Férfi karakterlap | MYS C01 Protagonist |
| Nő karakterlap | MYS C02 Soho Woman |
| Katedrális 2×2 morph | MYS MR001 St Pauls To St Stephens |
| Piros busz nézetei | MYS Reference 02 The same red London bus from useful angles |

A négy kép pontos megmaradását a felületen nem ellenőriztük; ez a beszélgetésből következő társítás, nem új generálási kérés. Az import nem helyez képet az elemekbe: a megmaradt képeket az új konténerekhez kell társítani.

## Újraindítás és hivatkozások

A teljes alaplista importja megtörtént a felhasználó visszajelzése szerint. Higgsfield nem mergel: a meglévő listához csak a diszjunkt 45-ös kiegészítőt add hozzá; ne ürítsd és ne importáld újra az alaplistát. Az asszisztens nem törölt távoli elemet, képet vagy projektet, és nem hajtott végre importot.

Az A oldalak neve most kifejezetten A-ra végződik a felületen is. A belső kulcsok megmaradtak (például W01 = W01_A; MW01 = MW01_A; T01_DETAILS = T01_A), így nincs külön régi és új A konténer. R008 és R009 a jelenlegi 2×2-es morph-lap; a régi háromnézetes változat nem szerepel külön.

Az új import új teljes @azonosítókat adhat. A korábban rögzített azonosítók történeti adatok, az új importban nem tekinthetők automatikusan érvényesnek. Az aktuálisan szükséges új azonosítókat egyszer kell rögzíteni, majd a promptokban továbbvezetni. A morph-gridek önálló szöveges promptok, hozzájuk nincs bemeneti Element-kötés.

A T01 étterem egyképes forrása a mostani listából kimarad. Az új T01_A a két karakterlapból és a részletes étteremleírásból indul; T01_B/C és a kapcsolódó éttermi emlékek az elfogadott új T01_A-t használják. A korábbi T01_IMAGE-, W01- és R001/R006/R011-képekre mutató videóhivatkozásokat az új kiválasztott gridekhez kell átvezetni az új azonosítók rögzítésekor, nem az egész régi képkönyvtár visszahozásával.
