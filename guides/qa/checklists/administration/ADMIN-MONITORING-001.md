# ADMIN-MONITORING-001 — Monitoring, queues and Jobs

## Miről szól?

Ez az Admin domain második tesztje, a már lezárt BASE-STAT után. Azt
ellenőrizzük, hogy a Monitoring szűrői és számai a tényleges feldolgozást
mutatják: egy feladat várakozik, lefut, majd lezárul; a Jobs részletei és az
adatbázis ugyanazt az eredményt mutatják. Egy paraméter mentése és
visszaállítása külön-külön egyszer jelenik meg a konfigurációs számlálóban.

**Szereplő:** Ava Moderation. A teszt a meglévő alkalmazásban fut.
Az előkészítés csak belépteti Avát az Admin kezdőoldalra. Az alábbi első
kattintás már a teszt része; a felhasználó indítja.

## 1. Monitoring alapállapot és szűrők

1. Ava menüjében nyisd meg a **Metrics** felületet. Az **All** nézetben
   olvasd el a kategóriákat és az állapotjelzőket. Codex rögzíti a hozzájuk
   tartozó kiinduló adatokat.
2. A fejléc szűrőjében válaszd sorban a **Watch**, **Domains**, **Delivery**
   és **Workers** nézetet. A szűrő száma a hozzá tartozó kategóriák száma;
   a Watch üres lehet, ha minden kategória egészséges.
3. Térj vissza az **All** nézetre. A szűrőváltás nem hoz létre feladatot és
   nem növeli a feldolgozási számlálókat. Az időközben valóban lefutott
   háttérmunkát Codex külön azonosítja.

Jelzés: `ADMIN-MONITORING-001 1. blokk kész`.

## 2. Egy feladat útja a Monitoring és Jobs felületén

4. Maradj a **Domains / Matching** résznél. Codex előkészíti az egyetlen,
   megnevezett újraszámítási feladatot a meglévő `affinity-recompute /
   isolated-user` fixture-rel. Csak ennek az állapotát követjük.
5. Figyeld a függő és futó munkát, majd a befejeződést. A terminális állapotban
   a tesztfeladat már nem függő és nem futó; nincs megmagyarázatlan hibás
   tétel. A rövid futó állapotot a megőrzött futástörténet is bizonyíthatja.
6. Nyisd meg a **Jobs → Refresh affinities → View process** részleteit.
   Egyezzen a feladat neve, futási ideje, feldolgozott eredménye és állapota
   a Monitoringgal és Codex független ellenőrzésével.
7. Térj vissza a Monitoringra. A függő darabszám kiürül, a kumulált
   feldolgozási előzmény megmarad. A kontrollkategóriákban csak külön
   azonosított valódi háttérművelet okozhat eltérést.

Jelzés: `ADMIN-MONITORING-001 2. blokk kész`.

## 3. Paramétermentés és visszaállítás nyoma

8. Codex visszaállítja az előző fixture-t, majd rögzíti a paraméterág
   kiinduló verzióját, értékeit, feladatait és értesítéseit. Nyisd meg a
   **Params → Jobs** szekciót; jegyezd fel a **User debounce** értékét.
9. Az **Edit** gombbal emeld ezt az értéket egy másodperccel, és ments egyszer.
   Például `300 s → 301 s`; a tényleges induló értéket az előkészítés írja ki.
10. Zárd be és nyisd meg újra a Params felületet, majd a Jobs **History**
    nézetét. Az új értékhez egy új verzió, helyes szerző és időpont tartozik.
11. A Monitoring **Workers / Jobs** részén egy konfigurációváltozás legyen
    kimutatható. Codex ugyanahhoz a mentéshez kapcsolja az újraszámítási
    feladatot és az Admin értesítés küldési tételét; a futásokat külön követi.
12. A History nézetben állítsd vissza a feljegyzett induló verzió értékeit.
    Újranyitás után az induló érték látszik; a visszaállítás új, megőrzött
    történeti bejegyzés, és egy további konfigurációváltozás tartozik hozzá.
13. A már aktív verzió ismételt visszaállítása nem hoz létre újabb változást.
    A kapcsolódó feladatok befejeződése után a függő számlálók rendeződnek.

Jelzés: `ADMIN-MONITORING-001 3. blokk kész`.

## 4. Lezárás

14. Codex összeveti a mentés/visszaállítás pontos darabszámait, a Jobs
    futástörténetét és a megnevezett kontrollokat, majd visszaállítja a
    fixture-t. PASS csak ezek és az előző három blokk bizonyítékaival adható.

## Előkészítő parancsok

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh stage admin-monitoring ADMIN-MONITORING-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh status admin-monitoring ADMIN-MONITORING-001
node guides/qa/tools/open-checkpoint-browser-sessions.mjs ADMIN-MONITORING-001
```

A kezdőállapot nem élesít feladatot és nem ment paramétert. A további fixture
műveleteket a [Monitoring futtatási script](../../../../server/docker/scripts/manual-qa-checkpoints/scenarios/admin-monitoring-checkpoints.js)
és a közös Admin-job harness végzi a megfelelő blokk megkezdésekor.

A 2. blokkban a meglévő job-fixture parancsai:

```bash
bash server/docker/scripts/admin-job-fixtures/admin-job-fixtures.sh prepare affinity-recompute isolated-user
bash server/docker/scripts/admin-job-fixtures/admin-job-fixtures.sh status affinity-recompute
# Csak a feladat befejezése és a bizonyíték mentése után:
bash server/docker/scripts/admin-job-fixtures/admin-job-fixtures.sh reset affinity-recompute
```

A 3. blokk bizonyítékpontjai a közös Docker harnessben:
`capture-before-params`, `capture-after-save`, `capture-after-revert`
az `admin-monitoring ADMIN-MONITORING-001` argumentumokkal. A felületi
mentést és visszaállítást nem ezek a parancsok végzik. A lezáró `reset`
ellenőrzi az induló Jobs-értékeket és a befejezett munkát, majd helyreállítja
a böngészőindítás mentett állapotát. A tényleges paraméterverziók,
futástörténet és audit megmaradnak bizonyítékként.
