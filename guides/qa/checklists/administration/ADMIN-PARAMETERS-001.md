# ADMIN-PARAMETERS-001 — Paraméterek teljes életciklusa

## Miről szól?

Mind a hét Params szekcióban egy biztonságos módosítást mentünk, újranyitjuk,
megnézzük a történetét, és visszaállítjuk. Ahol a paraméter működést
befolyásol, előkészített adatokon azt is megnézzük. A hibás értékek és a
mentés nélküli bezárás nem okozhatnak részleges módosítást.

**Szereplő:** Ava Moderation; a hatásellenőrzéshez szükséges tagablakokat és
adatokat Codex az adott blokk előtt nevezi meg és készíti elő.

## 1. Közös mentés, történet és visszaállítás

1. Nyisd meg az Admin menü **Params** felületét. A hét szekció: **Matching,
   Profile, Events, Assets, Discovery, Notifications, Jobs**.
2. Az adott szekcióban jegyezd fel a kiinduló verziót és a lent megnevezett
   mező értékét. Codex kiírja a konkrét régi → tesztérték változást és az
   előre várt hatást, majd elmenti a visszaállítási alapot.
3. Az **Edit** gombbal módosítsd az egyetlen mezőt; ments egyszer. Zárd be
   és nyisd meg újra a Params felületet: az új érték látszik.
4. Nyisd meg a szekció **History** nézetét. Egy új verzió jelenik meg a
   megfelelő értékkel, szerzővel, időponttal és összefoglalóval.
5. Végezd el az adott szekció alábbi hatásellenőrzését. A mentett érték
   önmagában nem bizonyítja a működés változását.
6. A Historyból állítsd vissza a kiinduló értékeket. Újranyitás után azok
   érvényesek, az új és a visszaállított verzió története is megmarad.
   Codex ellenőrzi a kapcsolódó feladatokat és értesítéseket, majd lezárja
   az adott szekció fixture-jét, mielőtt a következőre térünk.

## 2. Matching és Profile

7. **Matching:** egy rating/evidence szorzón hajtsd végre a 2–6. lépést.
   Codex két olyan profilt készít elő, ahol a kijelölt jel hatása elkülöníthető.
   Az újraszámított kapcsolat súlya az előre leírt módon változik; a friss
   Graph és a Stats gráfadatai ugyanazt az eredményt mutatják.
8. **Profile:** egy profil-/trait szabályon vagy abszolút profilszorzón
   végezd el ugyanezt. A megnevezett profilpontszám vagy sorrend változik;
   a kontrollprofil eltérését a változtatott mező alapján értelmezzük.

Jelzés: `ADMIN-PARAMETERS-001 2. blokk kész`.

## 3. Events és Assets

9. **Events:** egy tartalom- vagy boost-szorzón végezd el a 2–6. lépést.
   A két előkészített esemény pontszáma vagy ajánlási sorrendje a várt
   irányban változik. Ezt az eseményfelületen és a tárolt pontszámban nézzük.
10. **Assets:** egy erőforrás-tartalom, kapacitás, mennyiség vagy boost mezőn
    ismételd meg. Az előkészített erőforrások pontszáma/sorrendje egyezzen a
    várakozással. Az Events és Assets hatását nem a felhasználói gráf méri.

Jelzés: `ADMIN-PARAMETERS-001 3. blokk kész`.

## 4. Discovery, Notifications és Jobs

11. **Discovery:** a távolsági szorzó/határ/stratégia egy mezőjével végezd el
    a 2–6. lépést. Codex a határ két oldalára helyezett profilokat készít elő;
    az eredmény és a pontos határérték viselkedése egyezzen a szabállyal.
12. **Notifications:** a **Multicast threshold** értékén végezd el a 2–6.
    lépést, ismert számú tesztcímzettel. A közvetlen és a multicast küldési
    mód közötti váltást Codex a valódi küldési tételeken ellenőrzi.
13. **Jobs:** egy debounce/batch/lease értéken végezd el a 2–6. lépést.
    Egy izolált feladatnál a munkafolyamat a mentett beállítást használja;
    a konkrét mezőhöz tartozó várakozás/darabszám/lease az ellenőrzés tárgya.

Jelzés: `ADMIN-PARAMETERS-001 4. blokk kész`.

## 5. Hibás értékek, megszakítás és lezárás

14. Az előkészítésben kijelölt számmezőn próbálj a megengedett alsó, majd
    felső határon túli értéket. A felület és a szerver a mező dokumentált
    validációját/normalizálását követi; elutasított mentés nem lehet részleges.
15. A támogatott választási/stratégia mezőn ellenőrizd a megengedett értékeket.
    Codex külön ellenőrzi az érvénytelen szerveroldali érték elutasítását;
    a választómezőbe nem kell nem létező opciót begépelni.
16. Módosíts egy értéket, majd zárd be mentés nélkül. Újranyitáskor az eredeti
    érték látszik; nincs új verzió, feladat vagy értesítés.
17. Nézd meg újra a hét szekciót. Codex ellenőrzi az induló értékeket,
    a mentés/visszaállítás történetét, a befejezett munkát és a kontrollokat,
    majd visszaállítja a teljes tesztalapot.

Jelzés: `ADMIN-PARAMETERS-001 kész`.

## Futtatási határ

A konkrét értékpárok és hatásadatok az adott szekció fixture-jéből jönnek;
nem szabad találomra éles beállításokat változtatni. A külön fixture-script
és böngészőindítás ennek a tesztnek a későbbi előkészítéséhez tartozik.
