# Elements — kategóriánkénti teljes import

A felhasználó legújabb kérése szerint újra, kategóriánként importáljuk a teljes aktuális könyvtárat. Ezek a fájlok egymást kiegészítő teljes listák, nem a már bent lévő lista hiányzó elemeinek automatikus merge-jei.

| Importfájl | Tartalom | Elemek |
| --- | --- | ---: |
| [CHARACTERS_IMPORT.md](CHARACTERS_IMPORT.md) | Önálló szereplők | 31 |
| [WORLDS_IMPORT.md](WORLDS_IMPORT.md) | 21 real + 30 memories oldal | 51 |
| [MORPHS_IMPORT.md](MORPHS_IMPORT.md) | 37 buildings + 31 objects + 6 characters morph | 74 |
| **Összesen** | **Átfedés nélkül** | **156** |

A fájlok csak Type, Canonical key, Name, Version és rövid Description mezőket tartalmaznak. Renderbeállítás, kamerautasítás és bemeneti @hivatkozás nincs bennük. A külön TXT-khez a [prompttérkép](FULL_PROJECT_PROMPT_MAP.csv) vezet.

Ezt a három fájlt használd a felhasználó által újra felépített Element-listához. A korábbi FULL_PROJECT_IMPORT.md, 13_ADDITIONAL_OBJECT_REFERENCES.md és 00–12 részlistákat ne importáld melléjük: ugyanazokat a kulcsokat ismételnék. Nem történt távoli törlés, újraimport vagy képgenerálás.

A négy megmaradt kép társítása: C01 főszereplő, C02 Soho nő, MR001 katedrális, R002 londoni busz. A busz meglévő nézetlapja alapreferencia; az új R002-prompt már 2×2 morph. Az új import után a tényleges teljes @azonosítókat kell majd továbbvezetni.

A worlds/maps hét opcionális 4K 2×2 útvonaltervet tartalmaz; ezek nem külön importelemek. A hat konkrét CM-karaktermorph kimeneti definíciója a Morphs listában van, Character típussal; bemeneteik a már meglévő C-karakterek. A [karaktermorph-jegyzék](../../02_library/morphs/characters/README.md) tartalmazza a párokat és a valódi referenciaazonosítók állapotára vonatkozó tudnivalókat.

Felbontási szabály a külön képgeneráló TXT-kben: karakterazonosító 1×3, 2K alap / 4K választható; világ, emlék, morph és opcionális terv 4K 2×2, pontosan 3840×2160-as vászonnal és 1920×1080-as cellákkal. Az importlistákban továbbra sincs generálási utasítás.
