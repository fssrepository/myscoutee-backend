# OPERATOR-UPDATE-LIFECYCLE-001 — Egy előkészített frissítés

## Miről szól?

Az Updates felületen egy érvényes, kompatibilis QA-kiadást alkalmazunk.
A felületi folyamatjelzőt, a tartós feladateredményt és a ténylegesen
telepített verziót vetjük össze, majd újranyitjuk az Operatort.

**Szereplő:** a kijelölt, eldobható frissítési QA-célpont Operatora.
Codex előre megadja az induló és célverziót, a csomagot és a helyreállítási
alapot. Ez a teszt nem az aktív fejlesztői checkouton fut.

## 1. Kiinduló és célverzió

1. A kijelölt Operatorban nyisd meg az **Updates** felületet. Ellenőrizd a
   telepítés nevét és az aktuális verziót.
2. A **Refresh** művelettel kérd le az elérhető kiadást. Az ajánlott
   célverzió és kompatibilitás egyezzen az előkészített csomaggal.
3. Olvasd el a frissítéshez megjelenő információkat. Codex ellenőrzi, hogy
   a kijelölt QA-csomag és a felületen kiválasztott kiadás azonos.

Jelzés: `OPERATOR-UPDATE-LIFECYCLE-001 1. blokk kész`.

## 2. Alkalmazás és folyamatjelzés

4. Válaszd egyszer az **Apply update** műveletet.
5. Kövesd a megjelenő fázisokat. A felület nem jelezhet kész állapotot,
   amíg a tényleges frissítési feladat nem fejeződött be.
6. Várd meg a végső eredményt. Codex összeveti a feladat azonosítóját,
   kezdési/befejezési idejét, állapotát és célverzióját a kijelölt QA-célponttal.

Jelzés: `OPERATOR-UPDATE-LIFECYCLE-001 2. blokk kész`.

## 3. Frissítés utáni Operator

7. Nyisd újra az Operator felületét a frissített QA-célponton. A normál
   hozzáférés használható, és a ténylegesen telepített célverzió látszik.
8. Nyisd meg újra az Updates nézetet. A befejezett eredmény megmarad;
   ugyanaz a kiadás már az aktuális verzióként jelenik meg.
9. Codex menti a képernyős és tartós bizonyítékot, majd a kijelölt QA-célpontot
   a tesztalap szerint rendezi. A frissítés eredményét és a fixture
   visszaállítását külön rögzíti.

Jelzés: `OPERATOR-UPDATE-LIFECYCLE-001 kész`.

## Futtatási határ

Most ez a lépéssor készül el. A kiadás/célpont fixture külön előkészítés.
Sérült csomag, hibás aláírás, downgrade, megszakítás és rollback
hibainjektálás a csomagolási/frissítési automatizált tesztekhez tartozik.
