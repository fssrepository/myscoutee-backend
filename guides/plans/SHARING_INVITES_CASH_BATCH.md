# Meghívás, megosztás és cash — közös fejlesztési terv

Dátum: 2026-09-25.
Állapot: a batch megvalósítása és a célzott automatikus ellenőrzések elkészültek.
A kézi local/dev QA továbbra is NOT RUN.
Forrás: az „ezek jutottak meg eszembe osszegezd, hogy mit ertettel meg
beloluk” kezdetű felhasználói üzenet, az abban idézett levelek és minden
utána következő pontosítás együttesen.

Ez egy fejlesztési batch. A scope nem csak a chat basket vagy a kijelölőgomb
áthelyezése: az alábbi meghívási, affiliate-, cash- és chatfunkciók együtt
tartoznak bele.

## 1. Külső meghívólinkek és affiliate

- Az affiliate jellegű külső meghívólink külön popupban jelenik meg,
  eseményhez és csoporthoz kapcsolódva is.
- A kártyák egyetlen megosztási menüpontja a külső link popupját nyitja.
  Külön régi tokenmásolós menüpont vagy ablak nem marad.
- A meglévő Share asset / Copy token mögötti mechanika a chatben automatikus:
  a kártyakijelölés és a pipa használja, kézi másolás nélkül.
- A link megőrzi a meghívó személyét az affiliate-hozzárendeléshez.
- A regisztráció nem pusztán ezt a hozzárendelést rögzíti: a meghívott
  automatikusan csatlakozik a linkhez tartozó eseményhez vagy csoporthoz is.
- Csoportmeghívásos regisztráció után a meghívott csoport legyen az aktív
  csoport, a meglévő szerveroldali csoportválasztási folyamaton keresztül.
- Az API-felhasználón keresztül behozott/meghívott felhasználók is ugyanebben
  az affiliate-hozzárendelésben vesznek részt.
- A meglévő meghívási és affiliate-folyamatot kell kiegészíteni; nem készül
  mellette külön, eltérően működő link- vagy regisztrációs rendszer.

## 2. Cash a fizetési előzményekben

- Beérkezett készpénz kézzel rögzíthető a payment historyban.
- Tagválasztóval megadható, kitől érkezett, és szöveges megjegyzés írható hozzá.
- A rögzítéshez értesítés kapcsolódik az érintett fél számára.
- A cash nem része az affiliate bevételnek, és nem képez jutalékalapot.
  Ez az elszámolás és az összesítések szabálya is, nem csak egy UI-szűrés.

## 3. Megosztás a nyitott chatbe

- A chat Share event / Share asset művelete a megfelelő választóablakot nyitja.
- A választóban a meglévő basket/kijelölési működést kell használni, az
  eseményeknél bevált mintával.
- A kártyákon lehet kijelölni és a kijelölést visszavonni.
- Az X mellett van a jóváhagyó pipa; mellette a kijelöltek számát mutató gomb.
  A darabszámos gomb megnyitja a kiválasztott tételek listáját menüben.
- A jóváhagyó pipa a kijelölés változásait store signalon keresztül átadja
  a mögötte nyitott chatnek. Az új tételeket a meglévő token-/attachment-
  mechanikával automatikusan elküldi; nincs kézi másolás, beillesztés
  vagy további küldési lépés. A választó UI új, a megosztási mechanika marad.
- Több új kijelölés külön chatüzeneteket hoz létre. Ugyanaz a jóváhagyás
  az új megosztásokat és a korábbiak visszavonását együtt kezeli.
- Újranyitáskor a már elküldött, visszavonható megosztások kijelölése is látszik.
- Korábbi megosztás kijelölésének megszüntetése és jóváhagyása az eredeti
  chatüzenetet törölt üzenetté alakítja a meglévő törlési működés szerint.
- A visszavonás régi, egyik résztvevőnél éppen be sem töltött üzenetnél is
  működik. Nem alapulhat csak a chat első oldalán vagy a böngészőben betöltött
  üzeneteken.
- Az üzenetváltozások a meglévő chat/store szinkronizáción keresztül jelennek
  meg; teljes listaújratöltés helyett a meglévő helyben frissítést kell használni.

## 4. Kártyák és közös megjelenés

- Végleges elhelyezés: a kijelölőgomb a kártya hárompontos menügombja alatt van.
  Ez felülírja a kép jobb vagy bal alsó sarkára tett korábbi javaslatokat.
- Az esemény jobb felső taglétszám-badge-e és a státuszbadge-ek a helyükön
  maradnak; a kijelölő nem fedheti őket.
- A kör alakú „+”/kijelölőgomb különböző kártya- és képarányoknál sem nyúlhat
  el. A közös méretezési hibát az azt birtokló komponensben kell javítani.
- A basket darabszámos menüje, pipája és kijelölési viselkedése a meglévő
  megoldást használja; nem készül egyedi utánzat.
- Minden új felirat, hiba és értesítés a meglévő magyar/angol i18n útvonalat
  használja.
- A kártyák megosztási menüpontjának egységes `share` ikonja és a többi
  művelettől elkülönülő türkiz alapszíne van.

## 5. Következő lépés: közvetlen chat a kontaktokkal

Az előző részek befejezése után:

- A kontaktként felvett MyScoutee-tag elérhetőségei között az első elem a
  MyScoutee-emblémás belső chat, a telefon és a többi elérhetőség mintájára.
- Ez az elem közvetlen beszélgetést nyit a kontakt taggal; a tag is tud írni.
- Ugyanaz a meglévő chat popup nyílik meg a nyitva maradó kontaktlista fölött,
  az `openStackedEventChat` útvonalon. Bezáráskor a kontaktlista keresése és
  betöltött elemei megmaradnak. A chat tag- és megosztásválasztója fölé kerül.
- A chatlistában külön kapcsolati szűrővel elérhetők ezek a beszélgetések.
- Az esemény nélküli chat avatarpilljéből nyíló tagablakban is elérhető
  meghívás a meglévő tagválasztóval, a chat saját tagságát kezelve.
  A többi tagművelet megtekintési módban marad; a chat saját taglistája
  változik, esemény vagy alesemény létrehozása nélkül.
- A közvetlen chatbe kizárólag a meghívó saját kontaktlistájából lehet tagot
  hozzáadni. A választó csak ezeket mutatja, a már bent lévők nélkül. Üres
  kontaktlistánál nincs általános tagkeresési visszaesés; a backend és a
  local repository ugyanígy elutasítja a nem kontakt és más workspace-beli tagot.
- Meghívás után a meglévő tagablak SmartListje a visszakapott tagokból frissül,
  újranyitás és listaújratöltés nélkül.
- Ez a kiegészítés is meglévő NOT RUN QA-eset mikrolépéseibe kerül, új
  QA-azonosító és PASS-módosítás nélkül.

## Megvalósítási sorrend

1. Meglévő meghívó-, affiliate-, cash-, chat- és basket-utak felmérése;
   hiányzó működés és már meglévő működés elkülönítése.
2. Szerveroldali és frontend-local szerződés: meghívás és affiliate,
   cash-elszámolás, tartósan azonosítható chatmegosztások és visszavonás.
3. A közös basket bekötése a chat választóiba, kártyakijelölés és elhelyezés.
4. Cash-rögzítő UI, értesítések és i18n bekötése.
5. Célzott regressziók, majd a meglévő NOT RUN QA-esetek leírásának és
   táblázatsorainak bővítése a batch mikrolépéseivel. Új QA-azonosító/eset
   nem készül; a PASS eseteket nem módosítjuk. A hozzáadott kézi lépések
   tényleges végrehajtásukig NOT RUN állapotúak maradnak.

## Ellenőrzési pontok

| Terület | Ellenőrzés |
| --- | --- |
| Meghívólink | Esemény- és csoportlink, regisztráció, automatikus tagság, helyes meghívó; ismételt megnyitás nem duplikálja a hozzárendelést. |
| Aktív csoport | Csoportmeghívás után a szerver mentett csoportja és a betöltött profil összhangban van. |
| API affiliate | API-val behozott felhasználó megfelelő meghívóhoz tartozik, a normál affiliate-folyamat szerint. |
| Cash | Tag, összeg és megjegyzés mentése/visszaolvasása; értesítés; cash kizárása az affiliate bevételből és jutalékból. |
| Basket | Kijelölés, darabszám, lenyíló tétellista, jóváhagyás, bezárás jóváhagyás nélkül, újranyitás. |
| Chat | Több tétel elküldése, ismételt jóváhagyás, visszavonás; eredeti üzenet törölt állapota mindkét fél számára. |
| Régi megosztás | Az érintett üzenet nincs a másik fél első/betöltött oldalán; későbbi betöltéskor is törölt. |
| Jogosultság és csoport | Meglévő hozzáférési és meghívási szabályok megmaradnak; más csoport tartalma nem szivárog át. |
| UI-paritás | Mobil/desktop, eltérő képarányok, kör alakú gomb, ütközésmentes badge-ek; HU/EN szövegek. |
| Adapterek | Azonos viselkedés HTTP/server és frontend-local módban. |

A kézi QA végrehajtását ez a terv nem jelöli teljesítettnek, és nem indít
böngészőben automatikus tesztfolyamatot.

## Kiegészítő regresszió — feltárt meglévő működés

A felhasználó 2026-09-25-i pontosítása alapján a meglévő app support és csoport
support esemény nélküli chatje is újratesztelendő, a fejlesztési batchen felül.
A GROUP-ISOLATION-001 NOT RUN leírás tartalmazza a résztvevő-, tagablak-,
jogosultság-, üzenet-, számláló- és csoportváltási mikrolépéseket. Ez nem
módosít PASS esetet, és nem jelent elvégzett kézi tesztet.

## Felhasznált meglévő megoldások és ellenőrzés

- Chat: `EventChatPopupComponent`, `ActivitiesPopupStore.openStackedEventChat`;
  a fizetési előzményekből nyitott chat azonos megnyitási útvonala.
- Meghívó/tagválasztó: `AssetMemberPickerPopupComponent` és
  `ActivityInvitePopupStore`; a meglévő callback és jelöltlista bemenet.
- Basket: meglévő AppMenu ág, darabszám, eltávolítható tételek és pipa;
  a `ChatShareStore` a chat saját mentett kijelölését és annak változásait kezeli.
- Taglista: `MemberMenuStore` signal → a meglévő `applyCommittedMembers` és
  `SmartList.replaceVisibleItems`; a lapozási ablak és szűrő megőrzésével.
- Külső link: az Affiliate felületen is használt `CopyLinkComponent`;
  cash űrlap: meglévő FormFlow és ugyanaz a tagválasztó.

2026-09-25-i célzott ellenőrzés:

| Ellenőrzés | Eredmény |
| --- | --- |
| ChatService, IntegrationParticipantInvite, CashReceipt, AffiliateRevenue, SavedPaymentMethods | 60/60 sikeres Java teszt, Java 25 |
| Local chat repository, chat-share store, tagablak helyben frissítése | 24/24 sikeres frontendteszt |
| Local integration/cash repository | 10/10 sikeres frontendteszt |
| Angular típus-/sablonfordítás | Sikeres |
| i18n audit | 2 nyelv, 7678 üzenet, 3 Mongo-seed egyezik |
| QA CSV/XLSX | 122 változatlan azonosító; meglévő NOT RUN mikrolépések bővítve |

A tesztek szolgáltatás/repository/store szintű ellenőrzések. A valódi HTTP–Mongo
folyamat, a két felhasználó közötti böngészős működés és a mobil/desktop
megjelenés nincs ezekből PASS-nak tekintve; a stabil QA-leírás szerint kézzel
újratesztelendő. A futásnaplók: `frontend/.agent/logs/sharing-final-backend-tests.log`,
`chat-sharing-final-tests.log`, `cash-invites-final-tests.log` és
`sharing-final-typecheck.log` ugyanebben a könyvtárban.
