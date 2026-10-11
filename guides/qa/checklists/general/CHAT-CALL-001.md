# CHAT-CALL-001 — közvetlen WebRTC hang- és videóhívás

Külön teszteset az [MSC-117 WebRTC Project-feladathoz](https://github.com/fssrepository/myscoutee-roadmap/issues/155). Az eredmények és a dátumozott
bizonyítékok a QA-mátrixba és az evidence könyvtárba kerülnek; ez stabil
ellenőrzőlista. A böngészőket a verziózott launcher készíti elő, utána a tesztelő
végzi a kattintásokat. A megnyitás önmagában nem PASS. Alice a dedikált fixture adminja; Bob és Carol normál tagok.

## Template regression and fix propagation — MSC-122

Assess shared chat, WebSocket/signaling and retained call-backend corrections
against the template, and run the applicable backend/transport and personal-chat
regressions there. The current minimal template chat has no call controls:
source call-window steps are N/A for that UI. Do not add controls or claim
physical audio/video or cross-network evidence from a backend test.

Follow the [shared template regression requirements](../README.md#template-regression-and-fix-propagation--msc-122).
Record template impact, propagated revisions and its own targeted result for
each defect; source PASS alone does not close the template follow-up.

## Előkészítés

A meglévő dev stack és a `myscoutee-stun` konténer fusson. A fixture saját
WebRTC Alice, WebRTC Bob és WebRTC Carol profilokat, valamint egy „WebRTC test
chat” beszélgetést hoz létre, a másik QA fixture érintése nélkül.

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints.sh stage chat-call CHAT-CALL-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints.sh ready chat-call CHAT-CALL-001
node guides/qa/tools/open-checkpoint-browser-sessions.mjs CHAT-CALL-001
```

A `stage` egyszer szükséges; már előkészített fixture-nél a `ready` után lehet
indítani. Dev-újraindítás és a szándékos demóreset után mindig ellenőrizd újra
a baseline-t; a korábbi `fixture-ready` eredmény nem bizonyítja a jelenlegi
állapotot. Az itt felsorolt parancsok az előkészítéshez tartoznak, nem maguk
a böngészős tesztlépések. A két Chrome-profil külön bejelentkezést és teszt hang-/videóforrást
kap, így ugyanazon a gépen nem versenyeznek a fizikai kameráért. A szintetikus
kép/hang csak a helyi kapcsolatot igazolja. Fizikai eszközökkel és eltérő
hálózatok között külön kell ellenőrizni a minőséget és a NAT-átjárhatóságot.

## Két résztvevő

1. Mindkét profilban nyisd meg: Aktivitások → Csevegések → „WebRTC test chat”.
2. A második fejlécsorban, közvetlenül az avatarlista előtt zöld telefonikon
   látszik. Az első sorban a bezárás mellett nincs hívásikon.
3. Alice-nél kattints a telefonra. A lazy betöltött Hívás ablak rögtön hanghívást
   indít; nincs köztes indítógomb, videó/hang választó vagy STUN-konfiguráció.
4. Az ablak szélessége és magassága megegyezik az alatta lévő chattel. A saját
   videóhely már engedélykérés közben is látszik. A csempék száma a csatlakozott
   résztvevők számát követi, nincs plusz üres résztvevő; a vezérlők alul vannak. Külön állapotsor nem vesz el videóterületet,
   a fejlécben nincs várakozási badge vagy hívásazonosító-gomb. Nézd meg kisebb képernyőn is.
5. Bob ugyanebben a chatben bejövő hívást kap. Fogadd; mindkét oldalon megjelenik
   a közvetlen kapcsolat állapota. A kezdeti hívás nem kér kameraengedélyt.
6. Kapcsold be Alice kameráját a hívás gombjával. Bob látja a tesztképet; kapcsold
   be Bob kameráját is. Kikapcsoláskor az adott videó helyére avatar kerül, a
   helyi kamera track leáll; a bal felső mikrofonikon alatt piros áthúzott
   kameraikon látszik. Újbóli bekapcsolás után ismét megjelenik a kép, a piros
   kameraikon normál állapotra vált. A két sarokjelzés mindig ugyanott van és kattintható.
   A saját csempe mikrofon- és kameraikonja ugyanazt kapcsolja, mint az alsó
   gombsor; az „Én” blokk kameraikonja is ezekkel szinkronban van.
   Adminnémítás alatt a saját mikrofon egyik helyről sem kapcsolható vissza.
7. Némítsd, majd kapcsold vissza a mikrofont mindkét oldalon. A másik résztvevő
   hangja ennek megfelelően megszűnik/visszatér. A hangszóró némítása csak a
   helyi lejátszást állítja le; a másik fél tovább hallja a mikrofont.
   A hangerőgomb fölé nyílik a kompakt `app-popup` panel, a videórács nem ugrik
   feljebb. A cím és a keretes vezérlők között nincs nagy üres tér; sok
   résztvevőnél a panel tartalma görgethető marad. A halvány alapszínű keretes blokkok címkéje „Én”, illetve a résztvevő
   teljes neve; a címke a keret tetején, a csúszka, százalék és némítógomb
   alatta egy sorban van. Desktopon két oszlopba férnek, mobilon egybe.
   Az „Én” csúszka ennek a böngészőnek a közös lejátszási hangereje, a többi
   az egyes résztvevőké. Állíts be eltérő hangerőket, némíts és oldd fel a
   némítást: a százalék végig megmarad, a hang ugyanarra a szintre tér vissza.
   Egy résztvevő helyi némítása csak őt hallgattatja el ezen a gépen.
   Közös némításkor a panelen kívüli hangerőgomb háttere is piros, feloldáskor
   visszaáll. A saját mikrofon némításakor a saját csempe, egy résztvevő helyi
   vagy adminnémításakor az érintett csempe piros keretet kap a zöld beszédkeret
   stílusában; a bal felső sarokban piros áthúzott mikrofon látszik. Beszédnél
   zöld mikrofon jelenik meg ugyanott, feloldás után ismét a beszédjelzés dönti
   el a zöld keretet. Nagyítva is megmaradnak a jelzések.
   A név szerinti blokk kameraikonja és a másik résztvevő csempéjének
   kameraikonja ugyanannak a résztvevőnek a videófogadását kapcsolja.
   A másik csempe mikrofonikonja ugyanazt a helyi némítást vezérli, mint a
   név szerinti blokk némítógombja. Nincs „Összes videó” gomb. Az „Én” kameraikon
   a saját kamera küldését kapcsolja, ugyanúgy, mint az alsó kameragomb.
   A hang tovább szól, a küldő saját előnézete és más résztvevők videója megmarad.
   Visszakapcsoláskor visszatér a kép; saját kamerakapcsolgatás sem kerüli meg
   a másik fél fogadási tiltását. A kézi tiltás lapozás vagy beszélőkövetés
   után is megmarad; a rejtett résztvevő videójának visszaengedése csak akkor
   indít újra továbbítást, amikor a csempéje láthatóvá válik.
   WebRTC-statisztikában a célzott videó bejövő RTP byte-/frame-számlálója a
   puffer kiürülése után érdemben nem nő, az audio számlálója tovább nő.
   Három résztvevővel ellenőrizd, hogy a harmadik tovább kap videót. Próbáld
   új résztvevő csatlakozásával és kameraki/be kapcsolásával is.
8. Ha a böngésző blokkolja a lejátszást, a hang engedélyezése gomb után elindul.
9. A fejlécben a bezárás mellett a közös app-menu „Beszélők követése”
   kapcsolója van: ikon + felirat + switch. Bekapcsolva hover nélkül is telt
   kék, nincs egyedi státuszpaletta. Bekapcsolva az aktuális beszélő és a
   legutóbb beszélők kerülnek előre és a látható lapra; beszédszünetben a
   legutóbbi sorrend megmarad. Kikapcsolva visszaáll a résztvevői sorrend.
   A csempe `fullscreen` ikonjával nagyíts egy résztvevőt: egy nagy csempe marad,
   a többiek hangja tovább szól. A `fullscreen_exit` visszaállítja a rácsot.
   A gomb világos háttere és sötét ikonja állandó, nagyítva sem válik pirossá.
   Fizikai mikrofonnal beszéljetek felváltva: a beszélő kap keretet és a csempe
   alján tényleges FFT spektrumot (48 sáv, 40 px magas kijelzés). Csendben eltűnik; mikrofon- és adminnémításkor
   nincs jelzés. A szintetikus tesztforrás folyamatos hangja folyamatos jelzést
   adhat, ezért beszédszünetet és halk/zajos mikrofont fizikailag is ellenőrizz.
10. Tedd le Alice-nél: a hívásablak bezárul, a helyi mikrofon/kamera felszabadul.
    Bob is tegye le. A chat és az üzenetküldés működik, új hívás indítható.
11. Ismételd meg az elutasítást Bobnál: kamera/mikrofon nem indul el, Alice
    értesül az elutasításról. A chatből a telefonikon később újra használható.
12. Ellenőrizd angolul és magyarul: nincsenek `chat.call.*` nyers kulcsok.
    Mikrofonengedély elutasításakor érthető hiba és a videóhelyek látszanak;
    bezárás és engedély megadása után a telefon újra indítja a hívást.

## Három résztvevő és koordinátorcsere

```bash
node guides/qa/tools/open-checkpoint-browser-sessions.mjs CHAT-CALL-001-GROUP
```

13. Mindhárom profil nyissa meg ugyanazt a chatet. Alice indít, Bob és Carol
    fogad. Mindenki látja/hallja a másik két résztvevőt. Pontosan három
    csempe van; nagyítás/visszaállítás működik,
    nagyított résztvevő kilépése visszaállítja a rácsot.
    Alice adminnémítással némítsa Bobot: mindenkinél elhallgat Bob, Bob mikrofonja
    letiltott és „Admin által némítva” látszik. Kilépés/visszacsatlakozás ugyanabba
    a hívásba nem kerüli meg a némítást. Feloldáskor a mikrofon nem kapcsol be
    magától; Bob kapcsolja vissza. Bob/Carol nem kap adminnémítási gombot.
    A legkorábban csatlakozott résztvevő a koordinátor; koordinátorcsere önmagában
    nem ad adminjogot.
14. Alice tegye le, majd külön ismétlésben zárd be Alice böngészőjét. A bent
    maradó Bob veszi át a koordinátor szerepét; Bob és Carol hívása működik
    tovább. Bob csempéjén megjelenik a koordinátorjelzés, de nem kap
    adminnémítási jogot. A fejlécben továbbra sincs ellenőrzőkód-gomb.
15. Alice nyissa meg újra a chatet, a telefonnal csatlakozzon a még aktív
    híváshoz. Mindhárom oldalon ismét három résztvevő és működő kapcsolat
    látszik; nincs duplikált csempe vagy megkettőzött hang. A tagságváltozás
    kulcsváltásának bizonyítékát külön jelzésrétegbeli ellenőrzés adja,
    nem egy eltávolított felületi kód összehasonlítása.
16. Zárd be a hívást engedélykérés/kapcsolódás közben is. Későn visszatérő
    engedély vagy esemény nem nyitja újra az ablakot és nem tart aktív tracket.

## Saját STUN, WebSocket és közvetlen média

17. Hívás nélkül állítsd le csak a saját STUN-konténert:
    `docker stop myscoutee-stun`. A nyitott chat telefonja a következő
    állapotjelzéskor piros, áthúzott és letiltott lesz; a kagyló iránya a zöldével
    megegyezik, az áthúzott ikon vízszintesen tükrözött.
18. `docker start myscoutee-stun`: a telefon újratöltés nélkül visszavált zöldre
    és használható. Már létrejött közvetlen hívás a STUN kiesésétől önmagában
    nem szakad meg. A végén mindig fusson újra a konténer.
19. A WebSocket kapcsolat megszakításakor a helyi hívás és a trackek lezárulnak;
    a többi résztvevő rosteréből eltűnik a kieső fél. Újracsatlakozás után az
    állapot frissül, új hívás indítható.
20. A böngésző WebRTC diagnosztikájában a kiválasztott ICE-pár `host`, `srflx`
    vagy `prflx`; nem `relay`. A STUN a saját alkalmazáshost 3478-as portja.
    Nincs külső Google STUN, TURN, SFU vagy szerveres médiatovábbítás.
21. Eltérő hálózatokon is próbáld ki. Ha közvetlen ICE-kapcsolat nem építhető,
    a hívás hibát mutat; nem vált relére és nem állít sikeres kapcsolódást.
22. A fixture `status` eredményében a hívások után is nulla a mentett
    chatüzenetek száma; a hívásjelzések nem lesznek chatüzenetek.

## Látható videók és SmartList-lapozás

A meglévő launcher legfeljebb három különböző szereplőt készít elő. A teljes
mobil 2×2 rácshoz négy, a mobil túllapozáshoz legalább öt, a laptop 3×2
rácsához és következő lapjához legalább hét különböző, jogosult résztvevővel
előre elkészített hívás kell. Ezt a nagyobb baseline-t a háromszereplős
fixture nem helyettesíti; hiányában a teljes rácsos lépések nem igazolhatók.
A teszteléshez ne indíts több azonos identitású ablakot plusz résztvevő helyett.

23. A háromszereplős hívásban kapcsold ki a beszélőkövetést. Asztali nézetben
    csökkentsd a hívásnak jutó szélességet/magasságot úgy, hogy két résztvevő
    férjen egy lapra. A közös SmartList lapozójával menj oda-vissza: az összes
    résztvevő elérhető, nincs összecsuklott, néhány pixel széles videóoszlop.
24. A nagyobb baseline-nal mobilon négy résztvevő 2×2 rácsban jelenjen meg;
    az ötödik a következő lapra kerüljön. A natív vízszintes swipe előre és
    vissza működik. Laptopon elegendő hely mellett hat csempe 3×2 rácsot alkot,
    a hetedik következő lapra kerül. Az utolsó részleges lapon nincs kitalált
    üres résztvevő; átméretezés után is mindenki elérhető marad.
25. Rögzítsd egy távoli résztvevő bejövő videó- és audio-RTP számlálóit.
    Lapozd teljesen képernyőn kívülre: a videó byte-/frame-számlálója a puffer
    kiürülése után érdemben nem nő, az audio tovább nő és hallható. Visszalapozva
    a kép és a videószámláló is újraindul. A swipe közben részlegesen látható
    két lap videói átmenetileg egyszerre mehetnek.
26. Nagyíts ki egy résztvevőt. Csak ő látszik, a többi résztvevő videóforgalma
    ugyanúgy szünetel, hangjuk tovább hallható. Állítsd vissza a rácsot, majd
    méretezd át az ablakot: az újonnan látható videók visszatérnek, a hang nem
    szakad meg. A nagyításikon végig jól látható és azonos színű marad.
27. Tiltsd le Bob videójának fogadását a hangerőpanel Bob blokkjában, majd
    lapozz el és vissza. A tiltás és a piros kameraikon megmarad; Carol képe
    változatlanul fogadható. Bob csempéjén engedélyezd újra: a panel ikonja is
    átáll. Rejtett csempe esetén az engedély önmagában még nem indít videóforgalmat.
28. Kapcsold be a fejlécben a „Beszélők követése” kapcsolót. Egy másik lapon
    lévő résztvevő beszéljen: a látható oldalra kerül. Ezután beszéljetek
    felváltva; egyetlen aktív beszélő mellett a legutóbb beszélők töltsék ki
    a többi helyet. Beszédszünetben ne ugráljon vissza a sorrend. A kézi
    videótiltást a követés nem oldhatja fel. Kikapcsolva visszaáll a normál
    résztvevői sorrend, és kézzel ismét lapozható.
29. Másik lapon lévő résztvevő hangerejét és némítását is állítsd a név szerinti
    hangerőpanelről. A beállítás azonnal hallható, visszalapozva a csempe
    jelzése egyezik vele. Az egyik résztvevő némítása nem némítja a többieket;
    feloldás után a korábban beállított százalék marad.

## Saját hang, fizikai eszközök és nyelv

30. Fizikai mikrofonnal, egyedül a hívásban beszélj a mikrofonba. A saját
    beszédjelző és spektrum reagál, de az alkalmazás nem játssza vissza a
    saját mikrofonodat. Kamera bekapcsolása sem ad saját hangot az előnézethez.
31. Ugyanazon gép két böngészője ugyanazt a fizikai mikrofont is felveheti:
    ilyenkor a másik kliens felől visszaérkező hang nem saját előnézeti lejátszás.
    Egygépes fizikai próbán a második kliens mikrofonját és lejátszását némítsd;
    a valódi kétirányú hangot két külön eszközön, fejhallgatóval ellenőrizd.
    Beszéljetek normál és halk hangon, majd tartsatok szünetet: a beszédjelzés
    kövesse a tényleges hangot. Jegyezd fel a késést, visszhangot vagy torzítást;
    a szintetikus tesztforrás nem igazolja a fizikai hangminőséget.
32. Ismételd meg a fejléc, beszélőkövetés, némítás, videótiltás, adminnémítás,
    hangerőpanel és hibaállapotok megtekintését HU és EN nyelven, desktopon és
    mobilon. A teljes nevek, százalékok és gombfeliratok olvashatók; nincs
    nyers fordításkulcs, egymásra csúszó fejléc vagy levágott vezérlő.

## Kapcsolódó chat-visszaellenőrzések

33. Az Aktivitások → Csevegések típusmenüjét nézd meg a meglévő Dating, Work
    és Community QA-környezetekben. Csak az adott munkatérben engedélyezett
    funkciókhoz tartozó kategóriák látszódjanak. A pusztán üres lista nem
    azonos a letiltott funkcióval; ne vezess be új elrejtési szabályt.
34. Ügyhöz tartozó chatben hajtsd végre a
    [MSC115-CASE-CHAT 4–6. lépését](../MSC-115_WORK_COMMUNITY_PAIR_QA.md#msc115-case-chat--shared-case-channel-and-permission-changes):
    a „Feladatok” közvetlenül a feladattáblát nyitja meg, alatta nem nyílik új
    ügylista és nem indul annak extra lista-/számlálóbetöltése. Ez külön,
    létező ügyes baseline-t használ; a WebRTC Alice/Bob/Carol általános
    tesztchatjében nincs ügyhöz kötött „Feladatok” gomb.

## Technikai ellenőrzési határ

A csoport médiája mesh kapcsolat: minden résztvevő közvetlenül kapcsolódik
minden másikhoz. A koordinátor MLS-tagságot kezel, nem továbbít videót.
A résztvevők feltöltési igénye nő a létszámmal; a jelzésréteg legfeljebb
16 résztvevőt enged. Az MLS védi a jelzéseket és kulcsváltásokat, a közvetlen
médiát a WebRTC DTLS-SRTP védi. A koordinátorcsere nem master/child
médiatovábbítás, és a nagyobb hívás méretezhetőségét önmagában nem bizonyítja.

A 16., 22., 25–29. lépés után az ellenőrző személy rögzítse az érintett
résztvevőket, a látható lapot, a video/audio RTP előtte-utána adatokat, valamint
a hívás lezárásakor a felszabadult trackeket és a fixture üzenetszámát.
A felületi kép eltűnése önmagában nem igazolja a hálózati videóforgalom leállását.
A kézi eredmény és a gépi bizonyíték a meglévő CSV/XLSX-mátrixba és az evidence
könyvtárba kerüljön, nem ebbe a stabil lépéssorba.

## Visszaállítás

A teszt végén zárd be a dedikált ablakokat, majd csak ezt a fixture-t állítsd
vissza. A korábbi QA kampány állapota és profiljai megmaradnak. A STUN-konténer
a kiesési próba után ismét fusson. A kapcsolódó ügyes vagy nagyobb csoportos
baseline-t a saját előkészítési/visszaállítási eljárása kezeli.

```bash
node guides/qa/tools/open-checkpoint-browser-sessions.mjs CHAT-CALL-001 --close-only
node guides/qa/tools/open-checkpoint-browser-sessions.mjs CHAT-CALL-001-GROUP --close-only
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints.sh reset chat-call CHAT-CALL-001
```
