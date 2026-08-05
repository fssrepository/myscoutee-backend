# Gyártási és kiadási ellenőrzőlista

Jelöld `[x]`-szel, amit ténylegesen ellenőriztél. A lista célja, hogy ne egy
drága final renderben derüljön ki egy történeti, arculati vagy technikai hiba.

## A. Történet és személyes tények

- [ ] A sorrend: itthoni munkakilátás → London → Soho-programozói munka →
  Victoria line → tottenhami HMO → öt év shared room/spórolás → világ → hazatérés →
  ismerkedés → MyScoutee → operátor.
- [ ] Nincs gyár, generikus worksite vagy ellenőrzési jelenet a londoni munka
  helyén; az alapító Sohóban programozó.
- [ ] A „közel negyven ország” az alapító állítása, nem pontos statisztikai
  felirat.
- [ ] Csak valóban meglátogatott hely kerül a travel-listába.
- [ ] Nincs megmaradt utazási fotó, ezért a kép illusztrált emléknek látszik,
  nem fake home video vagy archive.
- [ ] A három másodperces travel burst pontosan 72 frame.
- [ ] Tátra, Schönbrunn, Neuschwanstein, Angkor Wat, Golden Triangle, Norvégia,
  mediterrán és amerikai emlék nincs földrajzilag összeolvasztva.
- [ ] Tottenham, a Victoria line és a viktoriánus ház felismerhető, de nincs
  beazonosítható lakcím vagy munkáltató.
- [ ] Pontosan tizenhárom lakó, egy teljes fürdő, egy külön vécé és megosztott
  hálószoba szerepel; az „1,5 fürdő” ezt jelenti.
- [ ] A londoni ház fenntartott, zsúfolt és személyes; a lakótársak nem díszletek.
- [ ] Az ételen spórolás nem éhezésként vagy nyomorpornóként jelenik meg.
- [ ] „Az időmet vásároltam vissza” cselekvőképességet, nem sajnálatot közvetít.
- [ ] A hazatérés pozitív, célzott döntés.

## B. Ismerkedési állítások

- [ ] A film nem mondja, hogy minden app/esemény/tánc/randi sikertelen.
- [ ] Az appjelenet egyszerre mutat kevés és kezelhetetlenül sok figyelmet.
- [ ] Nem szerepel a nem igazolt „a férfiak 90%-a egy match-et sem kap” állítás.
- [ ] Maya ember és döntéshozó, nem „jobb csaj” vagy jutalom.
- [ ] A táncórán való részvétel nem romantikus beleegyezés.
- [ ] A kezdő/haladó létszám személyes megfigyelésként, nem nőkről szóló
  általánosításként jelenik meg.
- [ ] A táncos partnere barátságos, nem féltékeny ellenfél.
- [ ] A rossz randikban a zaj, akusztika és formális tér a probléma.
- [ ] A partnerek nem telefonoznak megvetően, nem külső alapján lesznek poén.
- [ ] A kis csoport választható út; az igen és a nem egyformán látható.
- [ ] A film nem ígér garantált kémiát, kapcsolatot vagy biztonságot.

## C. MyScoutee termékhűség

- [ ] A 1–10 skála privát, módosítható prioritás, nem emberérték.
- [ ] A reciprocitás két irányt mutat.
- [ ] Az affinitásnál legalább egy kontextus (aktivitás/távolság/idő) megjelenik.
- [ ] A csoport nem automatikus kényszerpárosítás.
- [ ] A chatből konkrét dátum/útvonal/akadálymentesség/jegy lesz.
- [ ] A történet eljut a valódi, nyilvános találkozásig és megmutatja a hostot.
- [ ] Nincs soulmate-, perfect-match-, sikerarány- vagy „megoldottuk a magányt”
  állítás.
- [ ] A generált UI absztrakt vagy utómunkában pontos; nincs AI-halandzsa.
- [ ] A film nem állít jelenlegi tractiont, bevételt vagy bizonyított fölényt.
- [ ] A local operator saját várost, partnereket, közösséget és brandet alakító
  szerzőként jelenik meg, nem franchise-alkalmazottként.
- [ ] A „megépítettem a magját, mert hiszek benne” magabiztos, nem könyörgő.

## D. Eredeti arculat

- [ ] A logo source pontosan `frontend/src/assets/logo/heart.png`.
- [ ] A képfájlt nem színezték át, rajzolták újra, vágták meg vagy generálták.
- [ ] S01-ben 00:00–00:01.2 között látszik a logo és külön a terméknév.
- [ ] A középső történetben nincs állandó vízjel.
- [ ] S23-ban az eredeti logo, külön MyScoutee név, tagline és CTA van.
- [ ] A product line coral színe nem lett összekeverve a sokszínű eredeti
  logóval.
- [ ] A generátorok S23-hoz csak tiszta háttérlemezt adtak.

## E. Karakter és vizuális kontinuitás

- [ ] Founder arca, életkora, testaránya minden jóváhagyott shotban azonos.
- [ ] Navy coat, charcoal knit, rust scarf és cognac notebook csak indokoltan
  változik/kerül le.
- [ ] Maya ugyanaz S10/S18/S19/S21 között.
- [ ] Dance Student, Dance Partner és a terem S12–S14 között azonos.
- [ ] Az első csoport pontosan öt, azonos felnőttből áll S19–S21-ben.
- [ ] Operator nem változik Founder-ré és nem corporate CEO-karikatúra.
- [ ] Kéz, ujj, kar, láb, pohár, esernyő, szék és jegy fizikailag vállalható.
- [ ] Nincs face morph, clone, eltűnő szereplő, lebegő tárgy vagy flicker.
- [ ] Minden alapvető képi információ olvasható álló mobilképen.
- [ ] Kulturális helyeknél nincs zászló-/jelmez-sztereotípia.

## F. Kredit- és modellfegyelem

- [ ] A 23 still animatik jóváhagyva, mielőtt bármely final motion elkészült.
- [ ] Egy platform felel egy shot végleges változatáért; nincs automatikus
  tripla render.
- [ ] Első próbán egy variáns készült.
- [ ] Újragenerálásnak egyetlen leírt oka van.
- [ ] Prompt/model/kamera/felbontás közül egyszerre csak egy változott.
- [ ] S07, S08, S15 és grafikai shotok editorban vannak összerakva, ahol ez
  olcsóbb és stabilabb.
- [ ] 720×1280 telefonos teszt megtörtént.
- [ ] 1080×1920 csak dokumentált 720p-hiba miatt készült — vagy nem készült.
- [ ] Nincs értelmetlen AI-upscale textre, logóra vagy hibás arcra.
- [ ] Az összes jóváhagyott prompt/model/verzió bekerült a manifestbe.

## G. Hang és nyelv

- [ ] EN és HU végleges VO 48 kHz projektben van.
- [ ] A saját hang természetes, nem túlprocesszált.
- [ ] Az S04 safe alternate külön megvan.
- [ ] S14/S15 szájmozgása hiteles, vagy cutaway alatt szól a mondat.
- [ ] A zene saját/licencelt és nem TSB-másolat.
- [ ] Minden SFX licenc vagy saját felvétel dokumentált.
- [ ] VO mindig érthető telefonhangszórón.
- [ ] Integrated loudness körülbelül -14 LUFS, true peak legfeljebb -1 dBTP.
- [ ] EN/HU SRT a végleges editből készült.
- [ ] Felirat maximum két sor, 9:16-ban olvasható és platform-UI felett marad.

## H. Export és telefonos QA

- [ ] Timeline és export 720×1280, 9:16, square pixel, constant 24 fps.
- [ ] A film hossza pontosan 02:48.000.
- [ ] H.264 MP4 és AAC 48 kHz lejátszható.
- [ ] Az első frame nem fekete, az utolsó zenei lecsengés nem vágott.
- [ ] Export elejétől végéig meg lett nézve számítógépen.
- [ ] Export elejétől végéig meg lett nézve céltelefonon.
- [ ] Privát célplatform-tömörítés tesztelve, ha lehetséges.
- [ ] Top/bottom kezelőfelület nem takarja a címet, feliratot vagy arcot.
- [ ] EN, HU, clean/textless és külön SRT fájlok megvannak.
- [ ] Resolve project backup megvan.
- [ ] Licencek, consentek és AI-platform metaadatok archiválva.

## Stop-ship hibák

A film nem publikálható, ha bármelyik fennáll:

- azonosítható vagy bizonyítatlan munkáltatói vád;
- rossz vagy átrajzolt MyScoutee-logo;
- generált halandzsaszöveg;
- arcváltás vagy súlyos anatómiai hiba;
- nőket/férfiakat általánosító, sértett narratíva;
- valótlan product/traction/safety/revenue állítás;
- nem meglátogatott hely személyes emlékként;
- olvashatatlan mobile caption;
- torz/clippelő hang;
- nem végig lejátszható export.
