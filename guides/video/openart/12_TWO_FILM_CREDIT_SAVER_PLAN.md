# Kétfilmes kreditkímélő stresszteszt- és gyártási terv

Állapot: **aktuális operatív terv, 2026-08-07**.

Ez a dokumentum két külön, egyenként körülbelül 2:30–3:00 hosszú, 9:16-os
filmre tervez:

1. a MyScoutee-filmre;
2. egy hasonló hosszúságú személyes történetre.

A cél nem az, hogy minden jelenetet minden platformon legeneráljunk. Először
ugyanazzal az egy nehéz, később ténylegesen is felhasználható jelenettel
választunk modellt. Ezután csak a nyertes vagy a konkrét shothoz legjobb modell
kap gyártási kreditet.

## 1. Rögzített technikai cél

- végleges képarány: 9:16;
- munkafelbontás: 720×1280;
- időalap: constant 24 fps;
- egy film hossza: 150–180 másodperc;
- két film együtt: 300–360 másodperc;
- egy generált mozgó egység alapértelmezésben legfeljebb 8 másodperc;
- narráció: külön generált, timecode-os voice-over;
- zene: filmenként egyetlen folytonos mestersáv;
- vágás, felirat, ducking, hangkeverés és export: CPU-s FFmpeg;
- DaVinci Resolve nem része az aktuális útvonalnak, mert ezen a gépen nincs
  támogatott GPU.

Ha minden másodperc AI-videó lenne, a két film 38–45 darab nyolcmásodperces
klipet igényelne. A valódi cél ennél kevesebb drága mozgó klip: a stabil
állóképes, grafikai, utazási, logo- és UI-részeket FFmpeg/post állítja össze.

## 2. Előfizetési döntés

### Google Flow

A felhasználó 2026-08-07-én a Google AI Pro havi csomagot választja a checkouton
látható, első három hónapra szóló körülbelül 2 190 Ft/hó promócióval. A képernyőn
látható negyedik havi normál árat külön naptár-emlékeztetővel kell kezelni.

A Pro-csomag havi 1 000 Flow kreditet ad. A Google jelenlegi hivatalos
kreditárai nem-Ultra felhasználóknál:

| Modell | 4/6/8 s generálás |
| --- | ---: |
| Veo 3.1 Lite | 10 kredit |
| Veo 3.1 Fast | 20 kredit |
| Veo 3.1 Quality | 100 kredit, 8 s |

Az ingyenes napi 50 kredit a fizetős csomagra váltáskor elveszik és a havi
keret váltja fel. A havi kreditek nem görgethetők tovább. Forrás:
[Google Flow kreditkezelés](https://support.google.com/flow/answer/16526234).

### OpenArt

Az első OpenArt-vásárlás **Essential havi**, nem éves:

- listaár jelenleg 14 USD/hó;
- 4 000 kredit/hó;
- körülbelül 50 videó;
- körülbelül 13 consistent character;
- prémium kép-, videó- és hangmodellek elérése.

Az Essential teszt- és karakterfejlesztési csomag, nem automatikusan a két film
teljes gyártási kerete. Ha az OpenArt egyik modellje nyer, az Advanced havi
csomag 12 000 kreditje és körülbelül 150 videója alkalmasabb a két filmre és az
újrapróbálásokra.

Az OpenArt szerint az upgrade azonnali, a magasabb csomag kreditjeit azonnal
megadja, és csak az időarányos árkülönbözetet számlázza. Tehát az
Essential→Advanced váltás normál fiókbeállításból elvégezhető; nem kell
lemondani és újra előfizetni. Upgrade előtt és után képernyőképen rögzíteni kell
a kreditmérleget és a következő számlázási dátumot, mert a help nem írja le
egyértelműen, hogy a még megmaradt Essential-alapkeret hogyan jelenik meg az új
egyenlegben.

A havi OpenArt-kreditek nem görgethetők tovább. Az add-on kreditek görgethetők,
de add-ont csak aktív, arra jogosult csomag mellett érdemes venni. Források:
[OpenArt pricing](https://openart.ai/pricing),
[OpenArt help](https://openart.ai/help).

## 3. Egyetlen újrafelhasználható stresszteszt

### Jelenet

**CP18 → CP19**, pontosan 8 másodperc, 9:16, first + last frame.

- első kép: `assets/storyboard-rough/CP18.png`;
- utolsó kép: `assets/storyboard-rough/CP19.png`;
- prompt: `prompts/model-benchmark-cp18-cp19.txt`;
- minden modell pontosan egy eredményt készít első körben;
- hangot nem pontozunk; zene és dialógus tilos;
- Auto Polish, prompt rewrite, Extend és extra reference kikapcsolva;
- ugyanaz a két PNG, prompt, hossz, képarány és outputszám marad.

Ez a jelenet egyszerre teszteli:

- hat ember és a pontos 3 nő + 3 férfi megtartását;
- hat külön arc, ruha és testarány kontinuitását;
- a portrérács valós találkozási térré alakítását;
- gondolatbuborékok természetes eltűnését;
- kézmozdulatot, szemkontaktust és visszafogott színészi játékot;
- first/last frame hűséget;
- vágás nélküli térbeli átmenetet.

Minden sikeres teszteredmény használható végleges shotként is. Teszt kedvéért
nem választunk kidobandó jelenetet.

### Flow-sorrend és kemény keret

| Sorrend | Modell | Maximum |
| --- | --- | ---: |
| 1 | Veo 3.1 Lite | 10 kredit |
| 2 | Veo 3.1 Fast | 20 kredit |
| 3 | Veo 3.1 Quality | 100 kredit |
| **Összesen** |  | **130 kredit** |

Az 1 000 kreditből a stresszteszt után **870 kreditnek kell maradnia**. Nincs
negyedik modell, audio-edition vagy automatikus második variáns. Ha az első két
helyezett közel azonos, csak azok kapnak egy-egy ismétlést, és ezt már a retry
keretből kell levonni.

A Gemini Omni Flash nem része ennek a first+last összehasonlításnak, amíg a
Flow ugyanazt a módot nem biztosítja hozzá. Eltérő inputmóddal nem lenne tiszta
modellteszt.

### OpenArt-sorrend és kemény keret

Csak olyan modellek vehetnek részt, amelyek az aktuális UI-ban ugyanazt tudják:
start + end frame, 8 s, 9:16, 720p, egy output. Első jelöltek:

1. Seedance 2.5 vagy Seedance 2.0 — az, amelyik azonos módban elérhető;
2. Kling 3.0;
3. Wan 2.7, csak ha ugyanazt az inputmódot kínálja.

Az OpenArt a jelenlegi videómodell-listán ezeket is kínálja, de a modellenkénti
kreditár beállítástól függ, ezért a Generate előtt mindig a UI-ban látható árat
kell feljegyezni. Forrás: [OpenArt video models](https://openart.ai/ai-model/?category=video).

OpenArt stresszteszt-korlát:

- cél: legfeljebb 600 Essential kredit;
- egy output modellenként;
- ha három azonos módú modell együtt túllépné a 600 kreditet, csak Seedance és
  Kling fut;
- a harmadik modell csak akkor fut, ha valamelyik első eredmény technikailag
  használhatatlan vagy a három együtt belefér a keretbe;
- nincs retry a felfedező körben.

### Pontozás

Minden videó 0–5 pontot kap:

1. első és utolsó frame hűsége;
2. mind a hat identitás megtartása;
3. nincs plusz, eltűnő, duplikált vagy összeolvadt ember;
4. arc, kéz és test anatómia;
5. átmenet folytonossága;
6. természetes mikromozgás és színészi játék;
7. kamera stabilitása;
8. 2.5D stílus megtartása;
9. mobilképen olvasható kompozíció;
10. felhasználhatóság utómunka nélkül.

A modellneveket az első vizuális pontozásnál elrejtjük. A pontszámok a
`MODEL_BENCHMARK_LOG.csv` fájlba kerülnek.

## 4. Karakterteszt és karakterlock

A Character funkció identitást tart meg; szerethető karaktert először jó
karaktertervvel kell létrehozni. A karaktertesztet nem szabad összekeverni a
videómodell-teszttel.

### Olcsó karakterteszt

Ugyanaz a karakterprompt, egy eredmény modellenként:

- Flow: Nano Banana 2 Lite → Nano Banana 2 → Nano Banana Pro, ha elérhető;
- OpenArt: Nano Banana 2 → Seedream 5.0 Pro → GPT Image 2.0, ha az aktuális
  kreditár belefér;
- kontroll: `assets/storyboard-rough/supporting-cast-placeholder.png`.

Az első kör egy négyszereplős supporting-cast lap. Nem készül modelltraining és
nem generálunk minden nézetből több változatot.

### Végleges karakterek

Csak a nyertes karakterterv után:

1. egy front/three-quarter/profile/full-body reference sheet;
2. egy ülő- és expression sheet;
3. azonos haj, arc, testarány, ruha, saját kellék és színkód;
4. stabil, szöveg nélküli PNG export;
5. Character/Consistent Character létrehozása csak a legalább három shotban
   visszatérő szereplőkhöz.

Az Essential körülbelül 13 karakterhelyét nem töltjük fel egyszer szereplő
statisztákkal. A két film visszatérő karaktereinek összesített célja legfeljebb
10–12 trained character; minden más szereplő kép-referenciát kap.

Karakterfejlesztési keret az Essentialben: legfeljebb 250 kredit az első
jóváhagyási kapuig. Drága video generation nem indul lezáratlan arccal.

## 5. Storyboard és animatik

A jelenlegi 56 × 3 másodperces slideshow szöveg- és caption-review célra jó,
de nem ez lesz az elsődleges képi animatik.

Az új animatik szabálya:

- egy állókép minden valódi Sxx jelenethez;
- nem egységesen 8 másodperc, hanem a `SHOT_MANIFEST.csv` tényleges 4–12
  másodperces hossza;
- a teljes MyScoutee-animatik így továbbra is pontosan 02:48.000;
- egy lassú 1–2%-os push/pan legfeljebb, optikai flow nélkül;
- egy caption jelenetenként, nem három másodpercenként új kártya;
- a második film is ugyanilyen scene-hold animatikot kap motion generation előtt.

Ez adja meg a narráció és a zene valódi időzítését. Az „egy kép körülbelül nyolc
másodpercig” jó közelítés, de a pontos scene duration jobb, és nem nyújtja meg
feleslegesen a filmet.

## 6. A két film motion-budgetje

Minden shot A/B/C kategóriát kap.

### A — olcsó vagy post

- környezet, tárgy, lassú kamera, állókép, grafika, utazási montázs;
- Flow Lite, olcsó OpenArt modell vagy FFmpeg pan/zoom;
- cél: a motion shotok körülbelül 80%-a.

### B — közepes

- egy-két ember, járás, egyszerű interakció, mérsékelt átmenet;
- Flow Fast vagy a stresszteszt nyertes középkategóriás OpenArt modell;
- cél: körülbelül 15%.

### C — hero/rescue

- hatfős jelenet, identitáskritikus arc, összetett first/last átmenet, esetleges
  lip-sync;
- Flow Quality vagy a stresszteszt nyertes prémium OpenArt modell;
- cél: legfeljebb 5%, tipikusan két hero shot a két filmben.

Ha mind a 45 lehetséges nyolcmásodperces egység AI-motion lenne, a Flow
80/15/5 felosztás felső becslése:

| Típus | Darab | Kredit/darab | Összesen |
| --- | ---: | ---: | ---: |
| Lite | 36 | 10 | 360 |
| Fast | 7 | 20 | 140 |
| Quality | 2 | 100 | 200 |
| **Gyártás** | **45** |  | **700** |

Flow-keret:

- modellteszt: 130;
- kontrollált első gyártási passz: legfeljebb 700;
- tartalék: legalább 170;
- sikeres stresszteszt shot újrafelhasználásával a tényleges tartalék nő.

A postban megoldható jelenetek miatt a valós motion-darabszámnak 45 alatt kell
maradnia. Quality nem használható tömeggyártásra: 38–45 shot egyetlen Quality
passza önmagában 3 800–4 500 kredit lenne.

OpenArt esetén az Essential körülbelül 50 videója elegendő a stressztesztre,
karakterfejlesztésre és egy korlátozott rough passra, de két kész filmhez nem ad
biztonságos retry-keretet. Ha OpenArt nyer, a tömeggyártás csak az
Essential→Advanced upgrade után indul.

## 7. Retry- és stop-szabályok

- első próbán mindig egy output;
- egyszerre csak egy dolog változhat: modell, prompt, inputframe vagy kamera;
- a retry előtt egyetlen, konkrét hibát kell felírni;
- ugyanazzal a hibával ugyanazon a modellen legfeljebb két próbálkozás;
- a harmadik vak retry helyett modellváltás, postmegoldás vagy shot-egyszerűsítés;
- sem 1080p, sem 4K nem készül hibás arc, kéz vagy történet javítására;
- upscale csak jóváhagyott final clipre;
- a modellteszt alatt nincs lipsync, zene, beszéd vagy automatikus BGM;
- minden letöltés azonnal stabil shot/model fájlnevet kap;
- generált tesztet nem törlünk a pontozás és hash rögzítése előtt.

## 8. Narráció, zene és szinkron Resolve nélkül

### Narráció

Alapértelmezés: voice-over, nem lipsync. Ez olcsóbb, hitelesebb a filmes
esszéhez, és nem kényszeríti a vizuális modellt pontos szájmozgásra.

- modell: Gemini 3.1 Flash TTS Preview;
- nyelv: magyar támogatott;
- ugyanaz a voice és style instruction filmenként;
- 10–25 másodperces, timecode-os mondatblokkok;
- WAV export, majd 48 kHz-re egységesítés;
- minden blokkhoz IN, vizuális kulcsszó/HIT és OUT marker;
- a képhez igazítás szünettel és blokkpozícióval történik, nem durva
  beszédgyorsítással.

A Google díjszabása szerint a TTS audio 25 token/másodperc. Hat perc végleges
narráció körülbelül 9 000 audio token; a jelenlegi 20 USD/millió fizetős áron ez
körülbelül 0,18 USD egy teljes kétfilmes take. A free tier is elérhető. Forrás:
[Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing),
[Gemini TTS](https://ai.google.dev/gemini-api/docs/speech-generation).

### Lipsync

Csak akkor használjuk, ha egy látható, rövid mondat dramaturgiailag nélkülözhetetlen.
Maximum egy-két hero shot az egész kétfilmes csomagban. Előbb elkészül a végleges
hangfájl, és azt kapja audio reference-ként a kiválasztott modell. A többi beszéd
off-camera, reakcióképen vagy narrációként szól.

### Filmzene

- filmenként egyetlen, folytonos instrumentális score;
- csak picture lock után készül;
- modell: Lyria 3 Pro;
- a teljes videó timecode-os érzelmi térképét kapja;
- a generált klipenkénti Flow/OpenArt zenét teljesen némítjuk;
- három zenei jelölt filmenként bőven elegendő;
- a nyertes sávot FFmpeg illeszti pontos hosszra és 48 kHz-re.

A Google jelenlegi API-ára Lyria 3 Pro esetén körülbelül 0,08 USD teljes számként;
két film három-három jelöltje körülbelül 0,48 USD. Forrás:
[Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing),
[Lyria 3](https://ai.google.dev/gemini-api/docs/generate-content/music-generation).

### Szinkron-effekt és atmoszféra

Video prompt alapértelmezése:

```text
Synchronized diegetic ambience and physical sounds only.
No music, dialogue, narration or singing.
```

Ha a natív kliphangba rossz BGM keveredik, az egész hangsáv némul. Csak tisztán
kinyerhető ajtó, kulcs, lépés, metró, papír vagy billentyű effekt maradhat;
egyébként külön foley kerül a pontos képkockára. Az atmoszféra jelenethatáron
0,3–0,8 másodperces átfedést kap.

### CPU-s végső összeállítás

Az FFmpeg pipeline feladata:

1. clipsorrend, trim és képkocka-pontos hibajavítás;
2. constant 24 fps és 720×1280 normalizálás;
3. logo, pontos UI-PNG, cím és felirat;
4. narráció, ambience, foley és zene sávonkénti keverése;
5. zene ducking narráció alatt;
6. körülbelül -14 LUFS integrated, maximum -1 dBTP;
7. külön HU/EN/SRT/textless export;
8. H.264 + AAC, 48 kHz végső MP4;
9. teljes dekódolási és telefonos QA.

Kdenlive csak opcionális vizuális ellenőrző felület 720p proxykkal. A gyártás
nem függ tőle és nem igényel Resolve-ot vagy támogatott GPU-t.

## 9. Vásárlási és gyártási kapuk

### Gate 0 — most

- Google AI Pro havi előfizetés ellenőrzött checkouttal;
- képernyőkép az 1 000 kredites egyenlegről és refill dátumról;
- automatikus megújítás emlékeztető a promóció vége elé;
- CP18→CP19 Flow Lite, Fast, Quality: összesen 130 kredit;
- semmi más Flow-generálás a pontozás előtt.

### Gate 1 — OpenArt Essential

- havi Essential, nem éves;
- képernyőkép az ár, 4 000 kredit és renewal dátum állapotáról;
- azonos CP18→CP19 stresszteszt, legfeljebb 600 kredit;
- karaktermodell-teszt és első shortlist, legfeljebb 250 kredit;
- nincs full-film generation.

### Gate 2 — modell- és karakterlock

- vak pontozás kész;
- nyertes modellenkénti shot-típus rögzítve;
- végleges visszatérő karakterek és world/style references elfogadva;
- scene-hold animatik és narrációszöveg mindkét filmhez lezárva;
- minden shot A/B/C kategóriában.

### Gate 3 — production purchase

- ha Flow nyer: a már megvett Pro 1 000 kredites keretből hibrid gyártás;
- ha OpenArt nyer: Essential→Advanced in-place upgrade, utána tömeggyártás;
- ha vegyes eredmény: Flow az olcsó alap és az OpenArt csak a dokumentált hero
  vagy rescue shotokra;
- egyik platform sem kap automatikusan minden shotból teljes második passzt.

### Gate 4 — picture lock és audio

- képhossz és vágás lezárva;
- végleges TTS blokk-generálás;
- filmenként három Lyria-jelölt;
- FFmpeg mix, subtitle, brand és export;
- telefonos QA után csak shot-szintű javítás.

## 10. Rövid döntési összefoglaló

- A 2 190 Ft-os Google AI Pro a jelenlegi promócióban jó ár az 1 000 Flow
  kreditért, de a keretet nem szabad Quality-tömeggyártásra használni.
- Az OpenArt Essential jó és kockázatszegény tesztbelépő. Ha Seedance/Kling/Wan
  érdemben jobb, az Advancedre váltás az OpenArt szerint azonnali és prorated.
- Karaktereket a videók előtt kell jóváhagyni; a drága modell csak a shortlistet
  finomítja.
- A 3 másodperces review slideshow helyett az elsődleges animatik jelenetenként
  egy állóképet használ a valódi jelenethosszal.
- Az alapértelmezett hang voice-over + egyetlen folytonos score + külön foley;
  nem klipenként generált zene és nem tömeges lipsync.
- Resolve helyett FFmpeg végzi a pontos, GPU-független összeállítást.

