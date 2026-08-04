# Költség- és modelldöntés — mit vegyek meg, mivel kezdjek?

Ellenőrizve: **2026-08-04**. Az árak, kreditek, modellek, vízjelek és régiós
hozzáférések gyorsan változnak. A fizetés előtti utolsó szó mindig a saját
fiókod checkout oldala. Az alábbi összegek USD-ben, helyi áfa, banki
devizaváltás és opcionális zene-/hanglicenc nélkül értendők.

## Rövid, egyértelmű döntés

Ehhez a 02:48-as, 9:16-os, 720×1280-as MyScoutee-filmhez ezt válaszd:

> **DaVinci Resolve Free + egy hónap a 12 000 kredites, kereskedelmi jogot jelölő
> OpenArt csomagból (a felület Advanced vagy Plus néven mutathatja). A Flow-t
> első körben ugord át. Higgsfieldet csak akkor fizess elő, ha az OpenArtban
> ugyanaz az arc-/csoportjelenet három szabályozott próbálkozás után is hibás.**

Ne fizess elő egyszerre három videós szolgáltatásra. Először készítsd el a
hangos still animatikot nulla videógenerálással. Utána az OpenArtban építsd fel
az összes karaktert, világot, állóképet és a szükséges mozgó snitteket. A
Resolve-ban legyen a vágás, a felirat, a valódi UI, a logó és a végleges hang.

### Miért ez a legjobb költség/minőség arány?

- Az OpenArt egy helyen ad Director-, karakter-, kép- és többféle
  videómodellt. Ugyanazokat a referenciákat használhatod, ezért kisebb az
  arc- és stíluseltérés.
- A jelenlegi 12 000 kredites Advanced/Plus kártya kereskedelmi felhasználást
  és vízjelmentes kimenetet jelöl. Ez termékfilmhez fontosabb, mint a
  legolcsóbb tesztár.
- Az OpenArt felületén elérhető lehet Kling, Seedance és Veo is, ezért a Flow
  önálló előfizetése többnyire ugyanannak a képességnek a második megvásárlása.
- A cél 720p mobilvideó. Nem érdemes 1080p/4K kreditet venni addig, amíg a kész
  720×1280 export telefonon nem bukik el.
- A 168 másodpercből több rész Resolve-ban olcsóbban és pontosabban készül:
  évszakmontázs, utazási villanások, prioritásgrafika, affinity-vonalak, UI,
  logó és end card.

## 1. Mennyibe kerüljön?

### Ajánlott költségkeretek

| Forgatókönyv | Mit veszel? | Tervezési keret | Mikor indokolt? |
| --- | --- | ---: | --- |
| **Nulladik próba** | Resolve Free + saját próba-VO + ingyenes/draft lehetőségek | **$0** | időzítés, történet és workflow ellenőrzésére; nem publikálható master ígérete |
| **Ajánlott publikálható alap** | 1 hónap 12k-s OpenArt Advanced/Plus + Resolve Free | **$35–50** | ezt válaszd elsőként; áfa/árfolyam miatt van puffer |
| **Célzott arcmentés** | 12k-s OpenArt + 1 hónap/keret Higgsfield Starter | **$50–75** | csak 3–5 makacs emberes snitt megmentésére |
| **Sok javítás / kényelmi tartalék** | 24k-s OpenArt Infinite/Pro + Higgsfield középső csomag | **$90–130** | ha már az animatik jó, de sok végleges variáns kell |
| **Flow Ultra hozzáadása** | előzőek + magas Flow csomag | **nem ajánlott** | egyetlen 720p termékfilmért aránytalan; csak külön Veo-igény esetén |

Ez nem árajánlat. A végső képlet:

```text
teljes helyi költség = OpenArt checkout
                     + opcionális Higgsfield checkout
                     + opcionális Flow checkout
                     + áfa és devizaváltás
                     + opcionális licencelt zene/hang
```

### OpenArt — melyik csomag?

A [hivatalos OpenArt pricing oldal](https://openart.ai/pricing) az ellenőrzés
napján eltérő név-/árvariánst szolgált ki különböző oldalkérésekre. A 12 000
kredites csomag például **Advanced** vagy **Plus**, $29 vagy $34 listaárral,
$23.20 vagy $27.20 promóciós kijelzéssel jelent meg. Ezért a csomagot ne a név,
hanem a kredit, a kereskedelmi jog, a vízjel és a saját checkout végösszege
alapján azonosítsd.

| Csomag | Oldalon látható lista/promó ár | Kredit | Feltüntetett videóbecslés | Döntés |
| --- | ---: | ---: | ---: | --- |
| Essential / Starter | $14 / $12.60 | 4 000 | legfeljebb kb. 50 | teszthez elég lehet, de a kártyán nem ez a legegyértelműbb kereskedelmi csomag |
| **Advanced / Plus** | **$29–34 / $23.20–27.20** | **12 000** | legfeljebb kb. 150 | **ajánlott egy hónapra**; kereskedelmi jog és vízjelmentes kimenet szerepel |
| Infinite / Pro | $56 / $43.70 | 24 000 | legfeljebb kb. 300 | csak akkor válts rá, ha a 12k csomag várhatóan elfogy |
| Wonder | $240 / $175.20 | 106 000 | nagy volumen | ehhez az egy filmhez túlméretezett |

Az „akár 150 videó” nem 150 Kling/Veo végleges snitt garanciája. A tényleges
kreditár modell-, hossz-, minőség- és kimenetszám-függő. Az OpenArt nem közöl a
pricing kártyán stabil, minden modellre érvényes snittenkénti árat. Ezért minden
**Generate** előtt írd fel a felületen látható költséget.

## 2. Pontosan milyen modelleket használjak?

### Az ajánlott OpenArt modellstack

| Feladat | Modell/funkció | Mire használd? | Mire ne? |
| --- | --- | --- | --- |
| történet és scene card | **OpenArt Director** | 23 kártya, sorrend, karakter- és világkapcsolat | ne kérd meg rögtön a teljes végleges film legenerálására |
| karakter- és világ-still | **Nano Banana 2** vagy a fiók aktuális olcsó, reference-képes képmódja | Founder, mellékszereplők, London/Budapest, travel képek, first frame | ne generáltass vele logót vagy olvasható UI-t |
| olcsó mozgásteszt | **Gemini Omni Flash** vagy az aktuális legolcsóbb gyors videómodell | kompozíció, kameraív, ritmus kipróbálása | ne fogadj el végleges arcot pusztán az alacsony ár miatt |
| ember, mimika, tánc, csoport | **Kling 3.0** | arc- és tárgyreferencia, visszafogott mozgás, ensemble | ne kérj egyszerre sok szereplőt, nagy kameramozgást és hosszú akciót |
| atmoszféra, helyszín, átmenet | **Seedance 2.0** | London, munkakörnyezet, üres termek, rövid hangulati mozgás | a 2.5-re ne építs, amíg a saját model pickerben nem érhető el |
| drága környezetmentés | **Veo 3.1** az OpenArton belül | egy makacs, first/last-frame jellegű városi vagy atmoszférikus snitt | ne ez legyen mind a 23 snitt alapmodellje |
| grafika és márka | **DaVinci Resolve/Fusion** | S07, S08, S16–S18, S20, S23; felirat, UI, logo | ne AI-videóval készíts olvasható termékfelületet |

Az OpenArt nyilvános Seedance 2.5 oldala az ellenőrzéskor **Coming Soon**
állapotot jelzett. Emiatt most **Seedance 2.0** a tervezési alap. Csak akkor
válassz 2.5-öt, ha a saját OpenArt fiókodban valóban aktív, és az első olcsó
teszt sikeres.

### Shot-felosztás az egyplatformos, olcsó verzióhoz

| Shotok | Első megoldás | Véglegesítés |
| --- | --- | --- |
| S01, S03, S05, S11 | OpenArt still + Seedance 2.0/gyors draft | csak jóváhagyott képből finom mozgás |
| S02, S04, S06, S09–S10, S12–S15, S19, S21–S22 | OpenArt karakterreferencia + Kling 3.0 | egy output; újra csak konkrét hibajeggyel |
| S07 | négy jóváhagyott évszak-still | Resolve match cut/parallax |
| S08 | nyolc külön illustrated travel still + egy reflection still | Resolve: 8 × 9 képkocka; nem kell nyolc videó |
| S16 | egy felülnézeti still | Resolve/Fusion hídmotívum |
| S17–S18 | tiszta portré/still plate | Resolve/Fusion prioritás és affinity grafika |
| S20 | tiszta kéz-/asztalplate | a teljes UI és minden felirat Resolve-ban |
| S23 | nincs generálás | eredeti `heart.png` + külön szerkeszthető MyScoutee szöveg |

Az S14–S15 szájmozgása nem kötelező. A legolcsóbb biztonságos megoldás az,
hogy a rövid mondat képen kívül hangzik el, vagy tárgyközelire vágsz. Lip syncet
csak egy már jóváhagyott képen vásárolj.

## 3. Átugorjam a Flow-t?

**Igen, alapértelmezésben ugord át.**

A [Google Flow kredittáblája](https://support.google.com/flow/answer/16526234?hl=en)
az ellenőrzéskor a következő generálási költségeket írta egy kimenetre:

| Flow mód | Kredit/kimenet | 23 snitt egyszer | 23 snitt kétszer | 6 mentősnitt egyszer |
| --- | ---: | ---: | ---: | ---: |
| Veo 3.1 Lite, nem Ultra | 10 | 230 | 460 | 60 |
| Veo 3.1 Fast, nem Ultra | 20 | 460 | 920 | 120 |
| Veo 3.1 Quality | 100 | 2 300 | 4 600 | 600 |

A díj **kimenetenként**, nem feltétlenül kérésenként értendő. Ha egy kérés két
eredményt ad, annak kreditköltsége is többszöröződhet. A Quality 8 másodperces;
a különféle Lite/Fast hosszak és funkciók modellfüggők.

A Flow hivatalos súgója szerint:

- az előfizetés nélküli jogosult fiók napi 50, nem továbbvihető kreditet kaphat;
- AI Plus 200, AI Pro 1 000 havi kreditet jelöl;
- a Free/Plus/Pro Veo-kimeneteknél látható vízjel van;
- minden videó SynthID jelölést kap;
- a hozzáférés fiók- és régiófüggő;
- a feliratkozók 1080p upscale-je lehet 0 kredites, de erre a 720p filmnek nincs
  szüksége.

Az official credit oldal napi 50 kreditet ír a nem előfizetőknek, miközben a
Getting Started oldal a teljes Flow-hozzáférés feltételeként támogatott
előfizetést vagy jogosult Workspace-fiókot is felsorol. A napi keret tehát nem
garantálja, hogy a te régiódban és fiókodban a teljes felület megnyílik.

Ezért a napi 50 kredit jó lehet **vázlatpróbára**, de a látható vízjel miatt ne
építs rá publikálható MyScoutee-mestert. Az Ultra megvásárlása kizárólag egy
720p, 168 másodperces filmért nem költséghatékony, és a látható vízjel helyi
szabálytól ott is függhet.

### Csak akkor nyisd meg a Flow-t, ha mind igaz

1. már van hozzá előfizetésed vagy ingyenes kredited;
2. az OpenArtban ugyanaz az átmenet/környezeti snitt három kontrollált próbán
   át elbukott;
3. a Flow-változat először csak vízjeles draft lesz;
4. előre ellenőrizted a végleges export vízjelét és felhasználási feltételeit;
5. a karakterazonosságot first/last frame vagy referencia ténylegesen tartja.

Flow-jelölt mentőshot legfeljebb: **S01, S05, S08 reflection, S11, S22 city
plate**. Ne töltsd újra oda az egész filmet.

## 4. Mikor érdemes Higgsfieldet venni?

Nem az elején. A [Higgsfield élő pricing oldal](https://higgsfield.ai/pricing)
dinamikus és régiónként változhat. A hivatalos Higgsfield összefoglalók az
ellenőrzéskor eltérő tájékoztató sávokat is közöltek:

- Starter körülbelül **$9–15/hó**, nagyjából 120–270 kredit régiótól és
  számlázástól függően;
- egy másik hivatalos példa éves számlázás mellett **$15 / 200 kredit**
  Startert és **$39 / 1 000 kredit** Plus csomagot írt;
- a példában 200 kredit körülbelül 33 Kling 3.0 kimenet volt, vagyis az adott
  beállítással hozzávetőleg 6 kredit/kimenet. Ez nem állandó ár.

Fizetés előtt a saját checkoutban ellenőrizd: havi vagy éves terhelés, kreditek,
Kling 3.0 elérés, Soul ID, lip sync, vízjel, kereskedelmi jog és lejárat.

### Higgsfield mentési szabály

Csak akkor fizess elő, ha egy fontos emberes shotnál mindezt már megtetted:

1. ugyanaz a jóváhagyott first frame és Founder referencia;
2. csak egy arcreakció és egy kameramozgás;
3. egy olcsó OpenArt draft, majd két konkrétan javított próbálkozás;
4. mindháromnál ugyanaz a felismerhető hiba maradt.

Ekkor vidd át **csak** a hibás shotot Higgsfieldbe. Első prioritás:

- S04 — visszafogott, arcérzékeny töréspont;
- S09 — reményteljes hazatérés;
- S14 — háromszereplős táncterem;
- S19 — stabil ötfős csoport;
- S22 — Founder és helyi szerzők átadása.

Ha az aktuális ár valóban kb. 6 kredit/Kling kimenet, akkor 10 próba kb. 60,
20 próba kb. 120, 25 próba kb. 150 kredit. Soul ID, képgenerálás, lip sync,
hossz és nagyobb minőség ezen felül fogyaszthat. A Starter csak 3–5 célzott
mentőshothoz reális; az egész film újragenerálásához ne használd.

## 5. Kreditkeret a 12 000 kredites OpenArt csomaghoz

Ez nem modellárlista, hanem költési plafon. Ha egy fázis olcsóbb, a maradékot
tedd a végleges emberes shotokhoz; ha drágább, állj meg és számolj újra.

| Fázis | Felső keret | Mit kell belőle elkészíteni? |
| --- | ---: | --- |
| karakter- és look development | 1 800 | Founder sheet, mellékszereplők, 7 világ, maximum 1–2 jó kép beállításonként |
| 23 storyboard still + travel | 1 800 | egy jóváhagyható still/shot, 8 külön travel kép |
| mozgásdraft | 2 400 | csak mozgáskritikus snittek, egy olcsó output |
| végleges videók | 4 800 | jóváhagyott first frame-ekből, főként Kling/Seedance |
| hibajavítási tartalék | 1 200 | kéz, arc, mozgás vagy export mentése |
| **Összesen** | **12 000** | a keret teljes összege, nem kötelező elkölteni |

Minden generálás előtt vezesd ezt az egyszerű sort egy táblázatban:

```text
dátum | shot | modell | mód | hossz | outputok | UI szerinti kredit | eredmény | hiba
```

A következő fázis becslése:

```text
várható végösszeg = eddig elköltött kredit
                  + hátralévő darabszám × ugyanilyen teszt tényleges kreditára
                  + 20% hibajavítási tartalék
```

Ha a várható végösszeg 12 000 fölé megy, ne vegyél rögtön extra kreditet.
Előbb válts still + Resolve megoldásra S07, S08, S16–S18, S20 és S23 esetén,
csökkentsd az outputszámot egyre, és csak utána hasonlítsd össze a Pro upgrade
és az extra kredit checkout árát.

## 6. Pontos munkasorrend és vásárlási kapuk

### 0. kapu — $0, még semmire ne fizess elő

1. Telepítsd a DaVinci Resolve Free-t.
2. Vedd fel telefonra a próba angol és magyar narrációt.
3. Hozd létre a 720×1280, 24 fps timeline-t.
4. Rakd be a 23 üres shotot a `SHOT_MANIFEST.csv` idői alapján.
5. Tedd alá a narrációt, és nézd meg, hogy a történet 02:48 alatt működik-e.
6. Készíts három ingyenes/legolcsóbb tesztet, ha a fiók engedi:
   S05 környezet, S09 Founder-arc, S19 ötfős csoport.

**Csak akkor vásárolj**, ha a hangos üres animatik érthető, a három fordulópont
hatásos, és a fiókban ellenőrizted a checkoutot.

### 1. kapu — vedd meg a 12k-s OpenArt csomag egy hónapját

1. Készíts képernyőképet a checkout árról, számlázási periódusról és jogokról.
2. Ellenőrizd, hogy nincs-e éves elköteleződés a kedvezményes ár mögött.
3. Válaszd azt az Advanced/Plus csomagot, amely 12 000 kreditet, kereskedelmi
   jogot és vízjelmentes kimenetet ír; ne vegyél külön Flow/Higgsfield csomagot.
4. Készítsd el a Founder és a világok approved stilljeit.
5. Készítsd el a 23 storyboard stillt.
6. Tedd őket Resolve-ba és zárd le az animatikot.

**Stop:** ha a still animatik nem érzelmes és érthető, ne generálj videót. A
scriptet, képkivágást vagy időt javítsd.

### 2. kapu — mozgásdraft, még nem final

1. Először csak S05, S09, S12, S19 és S22 kapjon egy-egy olcsó motion draftot.
2. Nézd meg telefonon: felismerhető-e a Founder, működik-e a mimika, nem esik-e
   szét a csoport, nem túl erős-e a kameramozgás.
3. Ha jó, generáld a többi szükséges motion shotot, mindig egy outputtal.
4. A hibát szövegesen nevezd meg; egyszerre csak egy változót módosíts.

**Stop:** ha az öt reprezentatív shotból három rossz, ne válts platformot. Előbb
egyszerűsítsd a promptot, kamerát és szereplőszámot.

### 3. kapu — 720p végleges OpenArt klipek

1. Csak approved first frame és approved draft kaphat drágább final futást.
2. A cél 720p, 9:16. Az ennél nagyobb felbontást ne válaszd automatikusan.
3. Minden klipet azonnal nevezz át és tegyél a Resolve timeline-ba.
4. A teljes 720p exportot nézd meg két valódi telefonon és a célplatform
   tömörítéséhez hasonló exporttal.

### 4. kapu — opcionális mentés

- **Arc/csoport tartósan hibás:** vegyél Higgsfield Startert és csak 3–5 shotot
  vigyél át.
- **Környezeti átmenet tartósan hibás, Flow már jár:** készíts ott vízjeles
  összehasonlító draftot.
- **Flow csak külön előfizetéssel lenne elérhető:** hagyd ki; használj OpenArt
  Veo/Seedance vagy Resolve transition megoldást.
- **720p telefonon tiszta:** ne upscale-elj.

### 5. kapu — lezárás

1. Resolve-ban add hozzá az eredeti `frontend/src/assets/logo/heart.png` fájlt.
2. Külön szövegréteg legyen a `MyScoutee`; sem logót, sem UI-t ne generálj.
3. Készíts EN, HU és textless exportot.
4. Nézd végig mindet, ellenőrizd a vízjelet, a jogokat és a licenceket.
5. Mentsd le a számlát és az aktuális feltételek képernyőképét.
6. Ha nem kell több generálás, kapcsold ki az automatikus megújítást a saját
   fiókodban.

## 7. Fizetés előtti ellenőrzőlap

Mindegyik szolgáltatásnál írd le a választ. Ha bármelyik ismeretlen, még ne
fizess.

```text
Szolgáltatás:
Checkout dátuma:
Havi vagy éves terhelés:
Ma levont összeg:
Helyi adó/áfa:
Kapott kreditek:
Kredit lejárata:
Automatikus megújítás dátuma:
Kiválasztott modell tényleges kreditára:
Hány outputot ad egy kérés:
Sikertelen generálás visszatérítése:
Látható vízjel a végleges fájlban:
Kereskedelmi felhasználás:
Feltöltött saját arc kezelése/törlése:
Lemondás módja:
```

## 8. Végső ajánlás ehhez a filmhez

Az első teljes, kiadható változat reális célja **egy 12 000 kredites OpenArt
Advanced/Plus hónap, $35–50 helyi keret és nulla Flow/Higgsfield költés**. A
film értékét nem az adja, hogy három platform generált-e hozzá képet, hanem hogy
az arc, a fény, a ritmus és a történet ugyanazt az érzelmi ívet tartja.

Ha az OpenArt elkészíti az öt reprezentatív shotot, maradj ott. Ha csak néhány
arc-/csoportshot hibás, vegyél Higgsfieldet kizárólag ezekhez. Flow-t csak már
meglévő jogosultsággal, vízjeles draft vagy egy konkrét átmenet összehasonlítása
miatt nyiss meg. A végleges 720p mastert minden esetben Resolve-ból add ki.

## Hivatalos ár- és funkcióforrások

- [OpenArt Pricing](https://openart.ai/pricing)
- [OpenArt AI Video Generator](https://openart.ai/ai-video-generator/)
- [OpenArt Kling 3.0](https://openart.ai/ai-model/kling-3-motion-control/)
- [OpenArt Seedance 2.5 státusz](https://openart.ai/ai-model/seedance-2-5/)
- [OpenArt Gemini Omni Flash](https://openart.ai/ai-model/gemini-omni-flash/)
- [OpenArt Nano Banana 2](https://openart.ai/ai-model/nano-banana-2/)
- [Higgsfield Pricing](https://higgsfield.ai/pricing)
- [Higgsfield pricing-plan magyarázat](https://geo.higgsfield.ai/task/blog/understanding-higgsfield-ai-pricing-plans)
- [Higgsfield régiós ársávok](https://geo.higgsfield.ai/task/blog/higgsfield-ai-pricing-plans-1)
- [Google Flow kreditek és generálási költségek](https://support.google.com/flow/answer/16526234?hl=en)
- [Google Flow indítás, hozzáférés és vízjel](https://support.google.com/flow/answer/16353333?hl=en)
- [Google Flow modellek és módok](https://support.google.com/flow/answer/16352836?hl=en)
