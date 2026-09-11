# Prerelease — teljes kérés előszűrési tesztje

A production struktúrájának másolata, P00–P12. A kiinduló video.txt fájlok bájtról bájtra azonosak a másoláskor meglévő production fájlokkal: minden jelenet, időzítés, referencia és hangutasítás megmarad.

**A felületen: 480p · 4 másodperc · 16:9 · hang ON · 1 kimenet.** A prompt eredeti hosszát és belső időzítéseit ehhez nem írjuk át.

Az első teszt a teljes kérésből indul. Utána itt, a prerelease-ben változtatunk egyszerre egy dolgon: például egy referencia eltávolításán vagy egy szövegrész módosításán. A production marad az összehasonlítási alap. Minden próbánál jegyezzük fel az egyetlen változtatást, az eredményt és a tényleges kreditváltozást.

Ez előszűrési diagnózis. A hibaüzenet önmagában nem bizonyítja, hogy a kérés eljutott a generáló modellig. Az átengedett kérés elindíthat fizetős videógenerálást; a 480p / 4 mp tényleges ára még nincs ellenőrizve. A mappa létrehozása nem indít generálást vagy teljes sorozatot.

A meglévő last-frame hivatkozások és UNBOUND helyőrzők is változatlanok. A P00 a teljes struktúra része; az elfogadott logó újragenerálása nincs előírva.

| Prompt | Sor | Karakter | Referencia | UI-beállítás |
|---|---:|---:|---:|---|
| [P00](P00/video.txt) | 34 | 5670 | 1 | 4 mp / 480p |
| [P01](P01/video.txt) | 68 | 12154 | 21 | 4 mp / 480p |
| [P02](P02/video.txt) | 77 | 12140 | 27 | 4 mp / 480p |
| [P03](P03/video.txt) | 76 | 12504 | 28 | 4 mp / 480p |
| [P04](P04/video.txt) | 77 | 12174 | 29 | 4 mp / 480p |
| [P05](P05/video.txt) | 77 | 13157 | 27 | 4 mp / 480p |
| [P06](P06/video.txt) | 88 | 14413 | 28 | 4 mp / 480p |
| [P07](P07/video.txt) | 88 | 14515 | 26 | 4 mp / 480p |
| [P08](P08/video.txt) | 75 | 12476 | 27 | 4 mp / 480p |
| [P09](P09/video.txt) | 67 | 11360 | 25 | 4 mp / 480p |
| [P10](P10/video.txt) | 78 | 12500 | 28 | 4 mp / 480p |
| [P11](P11/video.txt) | 77 | 13134 | 25 | 4 mp / 480p |
| [P12](P12/video.txt) | 78 | 14151 | 25 | 4 mp / 480p |

## Aktuális P01 próba

Csak az R010 képreferencia eltávolítva; a jelenetszöveg és a többi 21 referencia változatlan. Beállítás: 4 mp / 480p. Állapot: a felhasználó szerint az R010 nélküli kérés túljutott a processing szakaszon, de kész videó még nincs; a végső eredmény nincs megerősítve. A felületi árajánlat 10 kredit volt; a tényleges levonás nincs ellenőrizve. Az R010 helyettesítő képének promptja előkészítve; új képgenerálást az asszisztens nem indított.

Problémás jelenetnél 4 mp / 480p tesztet használunk a teljes prompttal. A P01-nél látott 10 kredites tesztár a felhasználónak elfogadható; ez nem automatikus teljes sorozat indítása.
