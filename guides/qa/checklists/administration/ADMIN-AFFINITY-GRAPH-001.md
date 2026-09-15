# ADMIN-AFFINITY-GRAPH-001 — Gráf bejárása és frissítése

## Miről szól?

A hálózati gráfban a csoportoktól egy kiválasztott ember kapcsolataiig jutunk
el. Ellenőrizzük a kapcsolati mélységet, az erősségszűrést, a mozgatást és
nagyítást, majd a valódi gráffrissítő feladat eredményét és a korábbi
időpontok megőrzését. Ez a felület felhasználói kapcsolatokat mutat.

**Szereplő:** Ava Moderation. Codex a blokk előtt megnevezi a kontrollpárt,
az elkülönült tagot és a kiinduló gráfverziót. A részben már bizonyított
statisztikai előzményeket a QA-napló alapján használjuk fel.

## 1. Áttekintés és egy tag kiválasztása

1. Nyisd meg az Admin menü **Graph** felületét. Jegyezd fel a Members,
   Links, Components és Isolated összesítőket.
2. Kattints a megnevezett csoportra. A csoporthoz tartozó tagok jelennek meg;
   a látható és összecsukott tagok száma értelmezhető és egyezik az adatokkal.
3. Nagyítással bontsd ki a szükséges tagokat, majd válaszd ki a megnevezett
   személyt. A részletekben a megfelelő név, profil és kapcsolatok látszanak.
4. Állítsd a **Link depth** értéket **Direct / 1** szintre. Csak a kiválasztott
   tag közvetlen kapcsolatai tartoznak ebbe a nézetbe. Codex összeveti az
   azonosítókat és a kijelzett, kerekített súlyokat a tárolt értékekkel.

Jelzés: `ADMIN-AFFINITY-GRAPH-001 1. blokk kész`.

## 2. Mélység, erősség és nézetvezérlés

5. Emeld a kapcsolati mélységet a következő támogatott szintre, majd vissza
   egyre. A hozzáadott és eltűnő tagok a megfelelő szomszédsági körből jönnek.
6. A **Link range** alsó és felső határát állítsd a megnevezett kontrollél
   két oldalára. Az él a beállított tartomány szerint jelenjen meg vagy
   tűnjön el; a látható kapcsolatok száma kövesse ezt.
7. Állítsd vissza a tartományt. Mozgasd a gráfot, forgass és nagyíts az
   útmutatóban jelzett egér-/érintésvezérléssel. A kiválasztás és a
   szűrőértékek maradjanak követhetők.
8. Használd a **Reset** vezérlőt, majd az **Expand / Collapse** panelgombot.
   A gráf és a részletek elférnek az ablakban; a vezérlők kattinthatók.
9. Keresd meg a megnevezett elkülönült tagot. Kapcsolat nélküli tag is
   elérhető marad, saját profilja és nulla kapcsolata helyesen látszik.

Jelzés: `ADMIN-AFFINITY-GRAPH-001 2. blokk kész`.

## 3. Nagyobb gráf és betöltés

10. Codex előkészíti a meghatározott nagyobb, több összefüggő részből álló
    gráfot. Ismételd meg rajta az áttekintés → csoport → tag útvonalat.
11. Nagyításkor a további tagok fokozatosan jelenjenek meg; a nézet
    kezelhető maradjon. Codex ellenőrzi a betöltési korlátokat és azt, hogy
    nincs vég nélküli ismételt kérés.

Jelzés: `ADMIN-AFFINITY-GRAPH-001 3. blokk kész`.

## 4. Friss gráf és megőrzött előzmények

12. Codex elmenti a régi elrendezést és a kontrollokat, majd előkészít egy
    megnevezett kapcsolati változást. A már igazolt rating-lépéseket csak
    akkor kell megismételni, ha a változás bizonyításához szükséges.
13. A tényleges újraszámítás befejezése után nézd meg a **Jobs → Rebuild
    affinity graph layout** részleteit. Codex a meglévő fixture-rel teszi
    esedékessé a mentett ütemezést; a rendes scheduler futtatja a feladatot.
14. Befejezés után zárd be és nyisd meg újra a Graph felületét. Az új
    elrendezés tag-/él-/csoportszámai és a megváltozott kontrollpár egyeznek
    a befejezett futás eredményével.
15. A **Stats** gráf-idősorában nézd meg a megnevezett korábbi időpontot és
    a mait. A mai változás nem írhatja át a korábbi rögzített időpontot.
    Codex ellenőrzi a tárolt történeti adatokat is.
16. Codex menti az eredményt és pontosan visszaállítja a fixture-t.

Jelzés: `ADMIN-AFFINITY-GRAPH-001 kész`.

## Futtatási határ

Ez a leírás a meglévő konszolidált Graph tesztet bontja olvasható lépésekre.
A külön fixture-összeállítás és a böngészőindítás ennek a tesztnek a későbbi
előkészítéséhez tartozik. A Monitoring előkészítése nem indítja el ezt a tesztet.
