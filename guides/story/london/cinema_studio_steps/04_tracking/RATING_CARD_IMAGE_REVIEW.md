# Ratingkártyák és esernyők — képpromptok ellenőrzése

2026-09-10. **164 aktív képprompt** ellenőrzése; ez a szövegek állapota, nem legenerált képek vizuális jóváhagyása. A tételes fájllista a [JSON-jegyzékben](RATING_CARD_IMAGE_REVIEW.json) van.

- Mind a 164 képprompt kifejezetten tiltja az esernyőt minden cellában: nyitva, összecsukva, hordva, tárolva és asztal fölé szerelve is.
- Mind a 21 jelen-világ lap minden, aktuális városi embert mutató cellájában már a képen kell szerepelnie a fejek fölötti kártyáknak. A „later video cards” ellentmondó mondata megszűnt.
- A 68 korábbi épület/tárgymorph ugyanazt a szabályt kapta, ha jelen-városi járókelő látszik. Tárgyközelibe emiatt nem kell új embert kitalálni.
- A 30 emlék/klinikai környezeti lap és 6 emlékszereplő-morph emberei a történet szerint kártya nélkül maradnak. A 31 stúdió-karakterazonosító lap szintén kártya nélküli; a jelen-városi képprompt adja a szereplőhöz tartozó kártyát. A 7 grafikus útvonalterv nem emberábrázolás.
- A szám egy tizedesjegyű, például 6.2, 7.4, 9.2; nincs egészre kerekítés, százalék vagy számot helyettesítő sáv. A világos kártya pontszámfüggő színe vörösestől borostyánon át zöldig változik, a tört értékek között folytonosan. A szám sötét és domináns marad.
- A főszereplő rejtett pontját a szín sem árulhatja el a 06-os felfedés előtt. A rátekintés a fényerőt változtatja, nem a számot/színt. A klinikai vágás után nincs kártya.
- MR021 az új, kifejezetten megírt 6.2 → 9.2 kivétel: ugyanannak a járókelőnek a száma, kártyateste és színe fizikailag formálódik át. 4K 2×2, Prop elem az objects morphkönyvtárban.

A képek megérkezésekor a ténylegesen olvasható tizedespontot, a szám/ember kapcsolatát, a cellaszéli levágást és a takarást képenként kell megnézni. A promptellenőrzés önmagában nem bizonyítja, hogy a generátor minden kártyát jól rajzolt meg. Megfelelő, már elfogadott kép újragenerálását a szöveges pontosítás nem teszi automatikusan szükségessé.
