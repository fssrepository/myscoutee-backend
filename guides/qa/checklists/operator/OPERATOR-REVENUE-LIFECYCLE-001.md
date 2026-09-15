# OPERATOR-REVENUE-LIFECYCLE-001 — Bevételi összesítés és elszámolás

## Miről szól?

Egy előkészített fizetési adathalmazból nézzük meg a Revenue összesítőjét,
egyszer szinkronizálunk, majd megnyitunk egy elszámolást. A megjelenő
összegek, deviza, időszak és fizetési azonosítók a tényleges forrásadatokhoz
tartozzanak, és újranyitás után is ugyanaz az eredmény maradjon meg.

**Szereplő:** a kijelölt QA-telepítés Operatora. Codex előre kiírja a
szolgáltatót, devizát, időszakot, a sikeresen terhelt (captured) fizetéseket,
a feloldott (released) kontrollt és a várt összeget. A fizetések előkészítése
fixture; itt nem ismételjük meg a checkoutot.

## 1. Revenue alapállapot

1. Nyisd meg az Operator **Revenue** felületét. Ellenőrizd a kijelölt
   telepítést és a megjelenő időszakot/devizát.
2. Jegyezd fel az összesítő számait és az előkészített időszak pontját.
   Codex elmenti a hozzájuk tartozó forrás-fizetési adatokat.

Jelzés: `OPERATOR-REVENUE-LIFECYCLE-001 1. blokk kész`.

## 2. Szinkronizálás és összesítők

3. Indíts egyszer szinkronizálást a Revenue normál műveletével.
4. Várd meg a megjelenő végső eredményt. A sikeres állapot a ténylegesen
   elkészült jelentéshez tartozzon; Codex azonosítja a tartós eredményt.
5. Hasonlítsd össze az előkészítésben kiírt összeggel és darabszámmal.
   A feloldott kontroll nem növeli a terhelt bevételt. Eltérő szolgáltató,
   deviza vagy időszak adatai nem keveredhetnek a kijelölt összesítésbe.

Jelzés: `OPERATOR-REVENUE-LIFECYCLE-001 2. blokk kész`.

## 3. Egy elszámolás és újranyitás

6. Nyisd meg a megnevezett **settlement / elszámolás** részleteit. A
   szolgáltató, fizetési művelet, fizetés/foglalás azonosítója, deviza és
   összeg egyezzen a kijelölt forrással.
7. Zárd be és nyisd meg újra a Revenue nézetet. A szinkronizált eredmény és
   az ellenőrzött elszámolás tartósan ugyanaz maradjon.
8. Codex összeveti a forrásadatokat, a jelentést, az elszámolást és a
   változatlan kontrollt, majd visszaállítja a QA-adathalmazt.

Jelzés: `OPERATOR-REVENUE-LIFECYCLE-001 kész`.

## Futtatási határ

Ez a konszolidált Revenue sor normál felületi útvonala. A külön fixture és
böngészőindítás későbbi előkészítés. Jelentési hiba, újraküldés, teljes
idempotencia- és kizárásimátrix automatizált teszt, nem új kézi tesztsor.
