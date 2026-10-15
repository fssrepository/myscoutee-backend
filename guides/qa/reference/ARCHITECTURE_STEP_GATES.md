# Kötelező architekturális ellenőrzések minden QA-lépéshez

Hatály: minden végrehajtott QA-lépés és az abból következő javítás. Rögzítve a
felhasználó 2026-10-13-i utasítására. Ez a meglévő trust-minták végrehajtási
kapuja, nem új alkalmazásarchitektúra. Az üzleti elvárást a stabil checklist adja.

## Lépésenkénti eljárás

Minden lépés előtt azonosítsd az aktort, munkateret, local/HTTP módot, kiinduló
adatot, érintett komponenst/store-t/service-t és a várt kéréseket. Ezután hajtsd
végre a valódi UI-műveletet a látható CDP-s böngészőben. A lépés lezárása előtt
rögzítsd az alábbi A01–A12 kapuk eredményét: PASS, FAIL, NOT PROVEN vagy indokolt
N/A. Egy olvasási lépésnél a mentés N/A lehet; az értékelés nem maradhat el.
Korábbi forrásvizsgálat újrahasználható azonos revízió/útvonal esetén, de a
lépés aktuális futási bizonyítékát külön kell rögzíteni. Nincs automatikus PASS.

| Kapu | Ellenőrzés és elvárt bizonyíték |
| --- | --- |
| A01 — Felelősségek | A komponens megjelenítést és UI-eseményeket kezel. Nincs benne repository, HTTP/IndexedDB-hozzáférés, üzleti szolgáltatás, retry/cache/delay szabály. A meglévő contract → base service → local/HTTP adapter → mapper/repository → signal store → UI felelősségi út marad. Ne hozz létre párhuzamos megoldást. |
| A02 — Route delay | Localon egy összetartozó szolgáltatásművelet egyszer kapja a meglévő 1500 ms késleltetést. Az adat-előkészítés ezzel párhuzamosan fut. Összetett művelet nem hív egymás után két késleltetett publikus service-belépőt: a tulajdonos service a meglévő késleltetés nélküli belső műveleteket fogja össze. HTTP-re nem kerül mesterséges local delay. Rögzíts időzítést és hívásszámot. |
| A03 — Ring/vonal loader | A meglévő route/request loading állapot, ring és SmartList headerProgress/vonal indikátor szolgálja ki a műveletet a jelenlegi 3000 ms-os ablak/timeout szerződésével. Nincs második spinner, komponens-timer vagy animációval elfedett soros I/O. A ring a valós betöltést követi mindkét módban: gyors HTTP-válasznál röviden megjelenhet vagy észrevehetetlen maradhat; nincs mesterséges minimumidő. Hiba, üres állapot, mentés és háttérfrissítés különbözik. |
| A04 — Lazy popup | A megnyitott popup váza és bezárása elérhető, miközben a saját adatai töltődnek. A szülő nem vár feleslegesen a gyermek teljes adatára. Lazy import marad lazy; nincs eager import vagy seed-bootstrap a megjelenítés gyorsításának álcázva. Mérd a kattintás → popup → adat sorrendet. |
| A05 — Signal store | Megosztott állapot, busy/error, aktor/query-generáció és invalidálás a meglévő store/service tulajdona. Computed/signal olvasás nem indít új kérést, nem alkot effect-kört, nem készít minden olvasáskor új query/model identitást. Profilváltás/bezárás után a késői válasz nem ír másik munkatérbe és nem nyit vissza popupot. |
| A06 — Mentés utáni kártya | Sikeres mentés után a kanonikus eredmény a store signalján át frissíti az alatta nyitott kártyát/listát. Használd a meglévő SmartList patchVisibleItem, patchConvertedVisibleItem, upsertConvertedVisibleItem, reinsertVisibleItem vagy removeVisibleItemByIdentity műveletét. Görgetés, lap, kijelölés megmarad. Nincs automatikus teljes listareload. Hiba esetén nincs hamis siker vagy elmentettnek mutatott adat. |
| A07 — Piros badge-ek | Az elem-, státusz-, pending- és unread-számlálók saját jelentése és tulajdonosa marad. Mentés/signal, normál poll és reload ugyanarra a hiteles állapotra jut; nullára is frissül. Régi poll nem írja felül az új mentést. Retry nem növel kétszer, részleges válasz nem töröl más domain számlálót. A lista, fejléc, menü és munkatér összesítő egyezését bizonyítsd. |
| A08 — Kérések és költség | Rögzítsd a művelet által okozott kéréseket külön a meglévő háttérpolltól. Nincs dupla GET/PUT, elkerülhető második service delay, elemkénti N+1, új cache/poller. Meglévő adatot és a mentés eredményét használd; indokolt több hívás esetén nevezd meg az eltérő szükséges adatot. |
| A09 — SmartList életciklus | Meglévő pollIntervalMs/UiTaskScheduler, stabil identity, aktuális query-ablak és syncVisibleItems. Nincs átfedő poll, elölről lapozás, eldobott használható adat. Bezárás/queryváltás megszakítja az elavult munkát. Új pollingot nem vezetünk be csak a QA kedvéért. Teljes reload csak konkrét query/cursor/rendezési invalidálás miatt, dokumentáltan. |
| A10 — Tartósság és jogosultság | Create/edit/clear/reopen/reload eredményét az érintett local és HTTP útvonalon ellenőrizd. A látható kártya önmagában nem tartóssági bizonyíték. Más aktor/tiltott művelet nem írhat adatot vagy számlálót. EN/HU, desktop/mobil, hiba/üres/readonly állapotok az adott checklist szerint. |
| A11 — Template | Minden hibánál rögzítsd, érinti-e a template megtartott közös funkcióját, konkrét indokkal. Érintettségnél kanonikus javítás, szükséges átvitel és saját template local/HTTP ellenőrzés kell. A kihagyott Work/Community üzleti domain indokolt N/A, nem új template-feature. |
| A12 — Futási fegyelem | Egy aktív stack és fordítási tulajdonos. A watcher végzi a buildet; saját naplóját ellenőrizd. Backend javítási csomag után soros monolith/KVM runtime gate; arányos JUnit a meglévő runnerrel. Rögzíts CPU/egészség/válaszidő bizonyítékot; stressz csak összefüggő változáscsomagnál vagy konkrét problémánál. |

## Bizonyíték formátuma

Az aktuális kampány evidence fájlja tárolja az adatokat, a stabil checklist nem:

```text
step: <sorszám és stabil testcase ID>
actor / workspace / mode / viewport / language:
source revisions / runtime:
action / expected / observed:
requests and service-delay count / timings:
store and SmartList operation / persisted-state oracle / counters:
A01..A12: <egyenként eredmény; N/A-hoz indok; bizonyíték vagy változatlan forrásreferencia>
defect / fix revisions / retest / template impact:
result: PASS | FAIL | NOT PROVEN
```

FAIL vagy NOT PROVEN kaput nem lehet egy UI PASS mögé rejteni. A hibát a
legelső bizonyított rossz rétegben javítsd; ne lazítsd az elvárást és ne tegyél
tesztágat az alkalmazásba. A függő lépés nem zárható le a hiba újramérése előtt.
Az architekturális ellenőrzés lépésenként kötelező, de nem jelent lépésenkénti
buildet vagy deployt. A felhasználó pontosítása szerint az összetartozó
módosításokat nagyobb blokkokban ellenőrizzük és teszteljük újra; addig a
hibától független QA-műveletekkel folytatjuk. A meglévő watcher marad a build
egyetlen tulajdonosa, külön deploy vagy újraindítás csak indokolt blokkhatáron.

Teljesítményvizsgálat: a felhasználó 2026-10-13-i pontosítása szerint csak a
kirívó CPU-/memóriaterhelésre, beragadó oldalra/gombra és érzékelhető UX-romlásra
fordíts külön diagnosztikai időt. Rövid egészség-/terhelésminta és a művelet
kérésszáma elég a rendes lépésekhez; nincs folyamatos profiler vagy minden
lépés után új benchmark. Mobil és desktop ellenőrzés egyaránt kötelező.

## Meglévő tulajdonosok és trust-források

- [Frontend review](../../../.agents/trust/reviews/frontend.md)
- [Felelősségi rétegek](../../../.agents/trust/patterns/frontend-vertical-slice.md)
- [SmartList live surface](../../../.agents/trust/patterns/smart-list-live-surface.md)
- [Derived state](../../../.agents/trust/reviews/derived-state.md)
- [Efficiency](../../../.agents/trust/habits/efficiency-scan.md)
- Route konfiguráció: `frontend/src/app/shared/core/base/config.ts`;
  base/local `services/platform/route-delay.service.ts`.
- Kampány és ügy store: `frontend/src/app/shared/ui/context/stores/activity/campaigns.store.ts`,
  `frontend/src/app/shared/ui/context/stores/community/community-cases.store.ts`.
- Közös SmartList és scheduler: `frontend/components/src/lib/ui/components/core/smart-list/`,
  `frontend/components/src/lib/ui/scheduler/ui-task-scheduler.ts` a components submodule-ban.
  Szerkesztés előtt ellenőrizd a tényleges submodule-útvonalat és exportot.

## MSC-115 KVM lezárási kapu

A felhasználó külön előírta a KVM-szúrópróbát akkor is, ha nem változik backend
kód. A fő monolith/local kör után, azonos jelölt revízióval, egy aktív stackkel
ellenőrizendő: Work campaign mentés/publikálás/visszaolvasás; Community feladat
módosítás és jogosultsági tiltás; helyben frissülő kártyák és piros badge-ek
signal/poll/reload után; egy esedékes worker és ismétlésének idempotenciája.
A futási bizonyíték külön jelölje a KVM-mintát; nem jelent teljes KVM-kampányt.
