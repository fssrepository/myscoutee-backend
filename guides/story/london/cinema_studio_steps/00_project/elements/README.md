# Elements — teljes vagy kategóriánkénti import

A teljes újrakezdéshez a [FULL_PROJECT_IMPORT.md](FULL_PROJECT_IMPORT.md) egy fájlban tartalmazza mind a **157 elemet**. Importáld ezt az egy fájlt.

Alternatívaként ugyanez a készlet az alábbi három, egymást kiegészítő kategóriafájlból is importálható. A teljes fájlt és a részfájlokat ne importáld együtt: ugyanazokat az elemeket tartalmazzák.

| Importfájl | Tartalom | Elemek |
| --- | --- | ---: |
| [CHARACTERS_IMPORT.md](CHARACTERS_IMPORT.md) | Önálló szereplők | 31 |
| [WORLDS_IMPORT.md](WORLDS_IMPORT.md) | 21 real + 30 memories oldal | 51 |
| [MORPHS_IMPORT.md](MORPHS_IMPORT.md) | 37 buildings + 32 objects + 6 characters morph | 75 |
| **Összesen** | **Átfedés nélkül** | **157** |

A fájlok csak Type, Canonical key, Name, Version és rövid Description mezőket tartalmaznak. Renderbeállítás, kamerautasítás és bemeneti @hivatkozás nincs bennük. A külön TXT-khez a [prompttérkép](FULL_PROJECT_PROMPT_MAP.csv) vezet.

A FULL_PROJECT_IMPORT.md pontosan a három aktuális kategóriafájl egyesítése. A régi 105-ös lista archívba került. A 00–13 korábbi részlisták nem részei az aktuális újraimportnak. Nem történt távoli törlés, újraimport vagy képgenerálás.

A négy megmaradt kép társítása: C01 főszereplő, C02 Soho nő, MR001 katedrális, R002 londoni busz. A busz meglévő nézetlapja alapreferencia; az új R002-prompt már 2×2 morph. Az új import után a tényleges teljes @azonosítókat kell majd továbbvezetni.

A worlds/maps hét opcionális 4K 2×2 útvonaltervet tartalmaz; ezek nem külön importelemek. A hat konkrét CM-karaktermorph kimeneti definíciója a Morphs listában van, Character típussal; bemeneteik a már meglévő C-karakterek. A [karaktermorph-jegyzék](../../02_library/morphs/characters/README.md) tartalmazza a párokat és a valódi referenciaazonosítók állapotára vonatkozó tudnivalókat.

Felbontási szabály a külön képgeneráló TXT-kben: karakterazonosító 1×3, 4K, panelenként 1280×2160; világ, emlék, morph és opcionális terv 4K 2×2, pontosan 3840×2160-as vászonnal és 1920×1080-as cellákkal. Az importlistákban továbbra sincs generálási utasítás.

Az újraimport előtti ellenőrzés kész: 157 egyedi kulcs, minden kulcshoz létező TXT, a mappával egyező Character / Location / Prop típus. A Morphs listában az aktuális forrás → cél kapcsolat szerepel. A listák elkészítése nem jelenti a platformimport megtörténtét.

Az új MR021 ratingkártya Prop elem a 157-es teljes import és a 75-ös Morphs lista része. Ha a korábbi 156 elem már bent van, csak az [egyelemű kiegészítőt](MR021_RATING_CARD_ONLY_IMPORT.md) importáld. Ha a friss teljes listát importálod, a kiegészítőt ne add hozzá még egyszer.
