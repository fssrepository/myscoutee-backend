# OPERATOR-REGISTRY-LIFECYCLE-001 — Registry és közösségi kapcsolat

## Miről szól?

Egy elkülönített QA-telepítést kapcsolunk a Registryhez, végigmegyünk egy
claim/link folyamaton, és megnézzük a közösségi és ranglistás eredményt.
Egy mérési időszak szinkronizálása után a kapcsolat deaktiválását és
helyreállítását is ellenőrizzük. Ez egyetlen konszolidált teszt.

**Szereplők:** az előkészített Operator, a claimhez megnevezett identitás,
valamint a hozzáférési ellenőrzéshez kijelölt tag/Admin. Codex megadja a
QA Registry címét, a telepítést és a visszaállítási alapot. A fejlesztői
telepítés valódi kapcsolatát nem használjuk eldobható tesztkapcsolatként.

## 1. Kapcsolat létrehozása

1. Az Operator felületén nyisd meg a **Registration / Registry** panelt.
   A megjelenő cím és kezdőállapot egyezzen az előkészített QA-célponttal.
2. A normál regisztrációs művelettel regisztráld az előkészített telepítést
   egyszer. Figyeld az átmeneti és a végső állapotot.
3. Zárd be és nyisd meg újra a panelt. Ugyanaz a regisztrált kapcsolat
   maradjon meg; Codex ellenőrzi a helyi és Registry oldali azonosítókat.

Jelzés: `OPERATOR-REGISTRY-LIFECYCLE-001 1. blokk kész`.

## 2. Claim/link, ranglista és közösség

4. Nyisd meg a **Claim** műveletet. Az előkészítésben megnevezett identitással
   és telepítéssel végezd el egyszer a kijelölt claim/link útvonalat.
5. A felület a tényleges állapotot mutassa: a benyújtott/függő állapot még
   nem végleges jóváhagyás. A szükséges normál jóváhagyást a kijelölt
   jogosult szereplő végzi, majd ellenőrizzük a végső kapcsolatot.
6. Nyisd meg a **Leaderboard** megfelelő csoportját/telepítését és a
   **Community** megjelenést. A név, tagság, telepítésszám és jogosult
   megjelenés egyezzen a létrehozott kapcsolattal.
7. Nyisd újra a nézeteket. A kapcsolat nem duplázódhat meg; Codex ugyanazt
   a bindingot, claimet és csoporttagságot azonosítja a tárolt adatokban.

Jelzés: `OPERATOR-REGISTRY-LIFECYCLE-001 2. blokk kész`.

## 3. Egy mérési időszak

8. A Registry panel mérési részén nézd meg a Codex által előkészített
   időszakot és kiinduló darabszámokat. Indíts egy normál szinkronizálást.
9. A megjelenő eredményben a létrehozott, elküldött, elfogadott és függő
   jelentések száma a tényleges állapotot kövesse. Codex ellenőrzi az
   időszakot, a forrásadatokat és a hozzá tartozó Registry nyugtát.
10. Újranyitáskor a tartós eredmény látszik. A kapcsolódó ranglista/közösségi
    megjelenés ugyanannak az elfogadott mérésnek az adatait használja.

Jelzés: `OPERATOR-REGISTRY-LIFECYCLE-001 3. blokk kész`.

## 4. Deaktiválás és helyreállítás

11. A megnevezett kapcsolat normál életciklus-vezérlőjével deaktiváld azt.
    A tag/Admin hozzáférése a meghatározott inaktív szabály szerint záródik;
    az Operator helyreállító hozzáférése használható marad.
12. Aktiváld újra ugyanazt a kapcsolatot. A megengedett hozzáférés visszatér,
    új binding vagy duplikált tagság nélkül.
13. Codex összeveti a teljes kapcsolat- és mérési bizonyítékot, majd
    visszaállítja a helyi és Registry oldali QA-alapot.

Jelzés: `OPERATOR-REGISTRY-LIFECYCLE-001 kész`.

## Futtatási határ

A dedikált fixture és kezelt böngészők ennek a tesztnek a későbbi indulásakor
készülnek el. Protokoll-visszaélések, hibainjektálás, retry-vihar és
announcement fan-out az automatizált lefedettség része, nem további kézi blokk.
