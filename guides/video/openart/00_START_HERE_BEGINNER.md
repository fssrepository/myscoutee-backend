# Innen indulj — teljes kezdő munkafolyamat

Ez az egyetlen ajánlott út egy **02:48 hosszú, lejátszható, angol és magyar
változatban is kiadható filmhez**:

> **Nulla költségű hangos animatik → egy hónap a 12 000 kredites OpenArt
> Advanced/Plus csomagból a teljes képes tervhez és a szükséges mozgáshoz →
> DaVinci Resolve 21 a pontos vágáshoz,
> hanghoz, logóhoz, felirathoz és exporthoz. Higgsfield csak hibás
> arc-/csoportshot mentésére; Google Flow alapból kimarad.**

Az AI-videó nem egyetlen gombnyomás. Egy első generálás eredménye nem garantált,
de az alábbi ellenőrzési kapukon és javítási körökön végigmenve létrejön a
lejátszható videó. Mindig csak az aktuális kapuig költs végleges minőségű
kreditet.

## 0. Mit kell a végén megtalálnod?

Legalább ezek a fájlok legyenek meg:

```text
DELIVERY/
  TCBU_master_EN_720x1280.mp4
  TCBU_master_HU_720x1280.mp4
  TCBU_clean_textless_720x1280.mp4
  TCBU_EN.srt
  TCBU_HU.srt
  TCBU_dialogue_EN.wav
  TCBU_dialogue_HU.wav
  TCBU_music_and_effects.wav
```

Az MP4-nél nem elég, hogy „elkészült”: dupla kattintással végig kell játszania,
02:48.000 hosszúnak kell lennie, képnek és hangnak azonnal indulnia kell, a logó
helyesen íródik, és nincs benne AI-halandzsa.

## 1. Fiókok, program és egy olcsó próba

1. Hozz létre vagy ellenőrizz egy OpenArt-fiókot. Higgsfield- és Flow-fiók még
   nem szükséges.
2. Olvasd el a [költség- és modelldöntést](11_COST_AND_MODEL_DECISION.md), majd
   az OpenArt felületén nézd meg a krediteket, a számlázási periódust, a
   kereskedelmi felhasználást, a vízjelet és az adatvédelmet. Ezek csomagonként
   és régiónként változhatnak.
3. Telepítsd a **DaVinci Resolve 21 ingyenes változatát** a Blackmagic Design
   hivatalos oldaláról. Ez egy programban kezeli a vágást, feliratot, hangot és
   exportot. Ehhez a projekthez nem kell Studio vagy 4K: az elsődleges master
   720×1280, 9:16 mobilvideó.
4. Mielőtt csomagot vásárolsz, az OpenArtban készíts egyetlen 5–8 másodperces,
   legalacsonyabb költségű próbát, ha az ingyenes keret ezt engedi. A cél most
   csak az, hogy a letöltés működik-e, van-e látható vízjel, és a fájlt be
   tudja-e olvasni a Resolve.

**Kapunyitás:** csak akkor folytasd, ha a próba-MP4 lejátszható és importálható.

### Kreditlétra — mindig ezen a sorrenden menj végig

| Kör | Mit készítesz | Minőség/variáns | Mikor léphetsz tovább? |
| --- | --- | --- | --- |
| 0 | script, időzítés, üres animatik | nincs AI-videó-költés | a történet hanggal működik |
| 1 | karakter- és világlapok | legolcsóbb still, először 1 eredmény | az arcok/helyek jóváhagyva |
| 2 | 23 storyboard still | draft, 1 kép/shot | a teljes képes animatik működik |
| 3 | csak a mozgáskritikus shotok | legolcsóbb videódraft, 1 variáns | arc, kéz, kamera és ritmus jó |
| 4 | csak a jóváhagyott klipek | 720p 9:16 final | a 720×1280 timeline kész |
| 5 | telefonos exportteszt | platformhoz hasonló tömörítés | csak látható hiba esetén javíts/upscale-elj |

Ne generáld le ugyanazt a 23 shotot OpenArtban, Higgsfieldben és Flow-ban is.
Alapértelmezett, költséghatékony felosztás:

- **OpenArt:** történetterv, összes still, valamint minden szükséges mozgó
  rough/final; Kling 3.0 az emberes, Seedance 2.0 az atmoszférikus shotokra;
- **Higgsfield:** csak S04, S09, S14, S19 vagy S22 mentése, ha ugyanaz a hiba
  három kontrollált OpenArt-próba után is megmarad;
- **Flow:** alapból kimarad; legfeljebb S01, S05, S08 reflection, S11 vagy S22
  környezeti mentésére használd, ha már van hozzáférésed és a vízjelet
  ellenőrizted;
- **Resolve-animáció:** S07 évszakok, S08 kilenc frame-es stillök, S16–S18
  grafika, S20 UI, S23 brandkártya.

Egy shot első variánsát értékeld ki. Másodikat csak konkrét hibajeggyel kérj
(például: `same frame and identity; reduce the arc to 10 degrees`). A 720p
nem „draft” ebben a mobilprojektben: ha telefonon tiszta, ez a végleges kép.

## 2. Helyi munkamappa

Hozd létre kézzel ezt a mappaszerkezetet egy olyan meghajtón, ahol legalább
100–200 GB szabad hely van:

```text
TCBU_VIDEO/
  01_SCRIPT/
  02_VOICE_ROUGH/
  03_REFERENCES/
    founder/
    characters/
    worlds/
    travel_illustrated/
    logo/
  04_STILLS/
  05_OPENART_DRAFT/
  06_OPENART_FINALS/
  07_OPTIONAL_HIGGSFIELD_RESCUE/
  08_OPTIONAL_FLOW_TESTS/
  09_AUDIO/
    voice_en/
    voice_hu/
    music/
    sfx/
  10_RESOLVE_PROJECT/
  11_EXPORTS/
  12_LICENSES_AND_CONSENT/
```

Másold az `01_SCRIPT` mappába ezt a teljes dokumentumcsomagot. A repóból másold
a `logo` mappába a valódi, nagyobb felbontású márkaelemet:
`frontend/src/assets/logo/heart.png`. Ne rajzold újra, ne színezd át, ne vágd
körbe másként és ne generáld AI-val. A videóban ez marad külön képfájl; a
`MyScoutee` nevet külön, szerkeszthető szövegként tedd mellé vagy alá. Ne ments
belőlük új, átrajzolt „logót”.

## 3. Amit még a generálás előtt el kell dönteni

- Válassz nyolc éles, jelenlegi alapítófotót: szemből, két háromnegyed,
  profilok, egész alak, semleges és enyhén mosolygó arc. Higgsfield Soul ID-hoz
  később körülbelül húsz vagy több változatos, engedélyezett kép az ideális.
- Minden valós emberhez legyen írásos engedély, vagy használj teljesen fiktív
  mellékszereplőt.
- Nincsenek meg az utazási fotók. Ezért minden travel kép fájlnevében szerepeljen
  `_ILLUSTRATED`, és a film ne nevezze archív felvételnek.
- A három másodperces montázs nyolc jóváhagyott emléke legyen: Tátra,
  Schönbrunn, Neuschwanstein, Angkor Wat, az indiai Arany Háromszög egy konkrét
  városa/nézete, Norvégia, egy konkrét mediterrán emlék és egy konkrét amerikai
  vízparti emlék. Ne keverd össze egy képen Delhi–Agra–Jaipur vagy
  Chesapeake–Niagara földrajzát.
- Az ellenőrzéses mondatnál tartsd meg a [biztonságos alternatívát](03_SCRIPT_EN_HU.md).
  Név, céges ruha, ország, dokumentum és jogi minősítés nem kerülhet a képbe.
- A film nem beszél a felhasználó által csak háttérként megosztott későbbi jogi
  helyzetről.

**Kapunyitás:** a forgatókönyv minden mondata vállalható; az utazási helyek
valóban meglátogatott helyek; minden portréhoz van jog.

## 4. Próbanarráció — előbb a hang, aztán a kép

1. Nyisd meg a telefon hangrögzítőjét egy puha bútorokkal teli, csendes szobában.
2. Tedd a telefont 15–20 cm-re, kissé a szád mellé, ne közvetlenül elé.
3. Olvasd fel a [03_SCRIPT_EN_HU.md](03_SCRIPT_EN_HU.md) angol szövegét időablakonként.
   Két teljes felvételt készíts, ne mondatonként húszat.
4. Ugyanezt vedd fel magyarul. Ez még próbahang; a hitelesség és ritmus fontosabb
   a stúdióminőségnél.
5. Mentsd `TCBU_VO_EN_rough_v01.wav` és `TCBU_VO_HU_rough_v01.wav` néven. Ha a
   telefon csak M4A-t ad, a Resolve beolvassa; a végső felvételt majd WAV-ban
   készítsd.

Hallgasd vissza fejhallgatón. A mondatvégek ne legyenek levágva, ne zúgjon gép,
és az angol változat férjen el a megadott ablakokban hadarás nélkül.

## 5. DaVinci-projekt és üres 23 snittes animatik

1. Indítsd el a Resolve-ot → **New Project** → név:
   `TCBU_Master_9x16_720p_24fps` → **Create**.
2. Jobb alsó fogaskerék → **Master Settings**:

   - Timeline resolution: `720 × 1280`;
   - Timeline frame rate: `24`;
   - Playback frame rate: `24`;
   - Audio sample rate: `48 kHz`;
   - Timeline start timecode: `00:00:00:00`;
   - Pixel aspect ratio: square.

3. **Save**. A frame rate-et az első média behúzása előtt állítsd be.
4. **Media** oldalon készíts bin-eket: `STILLS`, `OPENART`, `HIGGSFIELD`, `FLOW`,
   `VOICE`, `MUSIC`, `SFX`, `LOGO`, `EXPORTS`.
5. Importáld a próbanarrációt. Ha a program a klipekhez igazítaná a frame rate-et,
   válaszd a **Don't Change** lehetőséget.
6. **Edit** oldal → új timeline `TCBU_ANIMATIC_EN`.
7. A [SHOT_MANIFEST.csv](SHOT_MANIFEST.csv) `start` és `end` értékei alapján
   helyezz el 23 egyszerű Color Generator klipet vagy bármilyen ideiglenes
   állóképet. Írd rájuk S01–S23-at. Az utolsó klip vége pontosan 02:48:00 legyen.
8. Tedd a próba-VO-t A1-re. Az üres képek időtartamát igazítsd a beszédhez, de a
   teljes hossz ne változzon.

**Kapunyitás A — történet:** hang nélkül is érthető a „munka → idővásárlás →
világ → hazatérés → próbálkozások → híd → termék → operátor” ív; hanggal nincs
hadarás; a hazatérés és a vég reményt ad.

## 6. OpenArt — a teljes képes terv

### 6.1 Karakterek és világok

1. OpenArt → **Character Builder / Create Character**.
2. Töltsd fel az engedélyezett alapítóképeket.
3. A leírás/prompt mezőbe másold a [05_PROMPT_PACK.md](05_PROMPT_PACK.md)
   **Founder identity sheet** blokkját.
4. Mentsd pontosan `Founder` néven. Ugyanígy hozd létre a mellékszereplőket.
5. Az image generatorban egyenként készítsd el a Budapest-, London-, Worksite-,
   SharedRoom-, DanceStudio-, EventVenue- és Notebook-lapokat. A prompt helye és
   a bemásolandó blokk a [06_OPENART_WORKFLOW.md](06_OPENART_WORKFLOW.md) fájlban
   szerepel.
6. Készíts nyolc külön Travel stillt az illustrated-memory prompttal. Csak egy
   hely legyen egy képen.

### 6.2 Director

1. **Director → New project → Describe your idea**.
2. A nagy promptmezőbe másold be változtatás nélkül a
   [prompts/openart-director-master.txt](prompts/openart-director-master.txt)
   teljes tartalmát.
3. Az assetcsatolóban válaszd ki a mentett karaktereket és világokat, valamint a
   próba angol VO-t. A travel lapokat nem kell mind a főpromptba tenni; S08-nál
   csatold őket.
4. Az első válasz után az Ori/Director chatbe másold:

   ```text
   Use the supplied narration verbatim. Show exactly 23 scene cards named
   S01–S23 with the locked timings before generating motion. Do not add claims.
   ```

5. Ha pontosan 23 kártyát kaptál, generálj **egy draft állóképet kártyánként**.
   Még ne indíts teljes videót.
6. Töltsd le és nevezd át őket `TCBU_S01_openart_still_v01.png` …
   `TCBU_S23_openart_still_v01.png` formában.
7. Cseréld le velük a Resolve üres klipjeit, a hosszakat változatlanul hagyva.

**Kapunyitás B — karakter és világ:** a Founder ugyanaz az ember minden képen;
S04 névtelen; S06 tisztességes megosztott szoba; S08 illusztráció; S12–S14
ugyanaz a táncterem; a nők és férfiak nem ellenfelek; S23 üres logómező.

### 6.3 OpenArt mozgó rough cut

Csak B kapu után kérj mozgást. Egy problémás snittnél a fő prompt helyett ezt
illeszd össze a shot prompt mezőben:

1. [prompts/continuity-prefix.txt](prompts/continuity-prefix.txt) teljes szövege;
2. egy üres sor;
3. a megfelelő `SHOT Sxx` blokk a
   [prompts/shot-prompts.txt](prompts/shot-prompts.txt) fájlból.

Draft, 9:16, először egy variáns. Töltsd le külön a klipeket. A Director teljes
rough cutja csak összehasonlítás; a Resolve timeline marad az igazság.

## 7. Higgsfield — opcionális arc-/csoportmentés

**Alapból hagyd ki ezt a fejezetet.** Csak akkor használd, ha egy fontos
OpenArt-shot ugyanazzal a jóváhagyott first frame-mel, egyszerűsített mozgással
és három kontrollált próbálkozással is ugyanúgy hibás. Előfizetés előtt kövesd a
[költségdöntés mentési szabályát](11_COST_AND_MODEL_DECISION.md#4-mikor-érdemes-higgsfieldet-venni).

1. **Cinema Studio 3.5 → New project** → `TCBU_Master_9x16_720p_24fps`.
2. **Elements** alatt hozd létre a [07_HIGGSFIELD_WORKFLOW.md](07_HIGGSFIELD_WORKFLOW.md)
   névlistáját. Ha Soul ID-t használsz, csak saját, engedélyezett képekkel taníts.
3. A **Mr. Higgs / project chat** mezőbe másold a
   [prompts/higgsfield-mr-higgs-master.txt](prompts/higgsfield-mr-higgs-master.txt)
   teljes tartalmát, majd írd:

   ```text
   Use the locked 23-row manifest. Return the setup table only. Do not generate
   and do not change narration.
   ```

4. Csak az elbukott shotot vidd át. Első mentőjelölt S04, S09, S14, S19 vagy
   S22; ne generáld újra az egész filmet és ne töltsd fel az összes jelenetet.
5. Minden shot Prompt mezőjébe: continuity prefix + egyetlen Sxx blokk.
6. **Camera Controls** alatt csak a workflow táblázatában megadott egyetlen
   mozgást válaszd. Először a legolcsóbb draft, `9:16`, audio off, 1 variáns.
7. A jó kompozíciót ugyanazzal a prompttal és beállítással generáld újra
   `720p 9:16` final minőségben. 1080p-re csak akkor menj, ha a kész 720×1280
   export a céltelefonon ténylegesen hibás. Ne módosíts egyszerre modellt,
   promptot és kamerát.
8. S14/S15 párbeszédét csak akkor készítsd LipSync Studio-ban, ha a szereplő
   szája valóban látszik. Az olcsóbb alapváltozatban vágj az
   esernyőre/pohárra, és maradjon a mondat képen kívül.

**Kapunyitás C — arc és mozgás:** egyetlen arc sem változik; kéz és láb ép; az
érzelmek visszafogottak; nincs generált szöveg; a kamera nem öncélú; a
csoporttagok száma és ruhája nem változik.

## 8. Google Flow — opcionális, alapból átugrandó

**Alapból hagyd ki ezt a fejezetet.** A Free/Plus/Pro Veo-kimenet látható
vízjele miatt publikálható termékfilmhez nem ez az első választás. Csak akkor
nyisd meg, ha már van hozzáférésed, egy konkrét OpenArt-átmenet elbukott, és
előre ellenőrizted a végleges vízjelet/jogokat a
[költségdöntés szerint](11_COST_AND_MODEL_DECISION.md#3-átugorjam-a-flow-t).

1. Flow → **New project** → `TCBU_Master_9x16_720p`.
2. Töltsd fel és nevezd el az engedélyezett karakter-, világ- és travel asseteket.
3. **Agent** bekapcsolva: másold a fő promptmezőbe a
   [prompts/flow-agent-master.txt](prompts/flow-agent-master.txt) teljes tartalmát.
4. Következő üzenet:

   ```text
   Return the 23-shot plan only. Preserve IDs, timings and narration. Do not
   generate yet.
   ```

5. Legfeljebb S01, S05, S08 reflection, S11 vagy S22 egyetlen mentőváltozatánál
   válaszd a **Video → Frames** vagy **Ingredients/References** módot a
   [08_GOOGLE_FLOW_WORKFLOW.md](08_GOOGLE_FLOW_WORKFLOW.md) szerint.
6. A promptmezőbe itt is continuity prefix + egy Sxx blokk kerül. Az `@` jellel
   válaszd ki csak az adott shothoz szükséges asseteket.
7. S08-nál ne kérj egyetlen világkörüli videót. Készíts nyolc külön jóváhagyott
   állóképet, majd mindegyikből legfeljebb finom környezeti mozgást.

### A három másodperces montázs pontos vágása

1. Resolve Edit oldalon a montázs kezdete `00:01:00:00`, vége `00:01:03:00`.
2. Ez 24 fps mellett **72 képkocka**.
3. Helyezz egymás után 8 állóképet, egyenként pontosan **9 képkocka** hosszan.
4. Sorrend: Tátra → Schönbrunn → Neuschwanstein → Angkor Wat → kiválasztott
   Golden Triangle nézet → Norvégia → kiválasztott mediterrán hely →
   kiválasztott amerikai vízpart.
5. Vágj formára vagy mozgásirányra. Ne használj nyolc látványos átmenetet; a
   kemény match cut adja a meglepetést.
6. Az utolsó vízfelületet egy 4–6 képkockás, visszafogott dissolve kötheti az
   egyedül ülő Founder tükröződéséhez.

## 9. Végleges kép, hang és felirat

Kövesd a [09_AUDIO_EDIT_DELIVERY.md](09_AUDIO_EDIT_DELIVERY.md) részletes
lépéseit. Röviden:

1. cseréld ki a timeline draftjait az approved klipekre úgy, hogy a 23 időhatár
   nem mozdul;
2. vedd fel a végleges saját VO-t 48 kHz WAV-ban;
3. add hozzá a halk zenét és a shotonkénti környezeti hangot;
4. a logót és minden feliratot a Resolve-ban készítsd;
5. készíts külön angol és magyar timeline-verziót;
6. exportáld, majd az exportált fájlt elejétől végéig nézd meg.

### Eredeti logó — pontos használat

Az AI-eszközökbe ne töltsd fel azzal az utasítással, hogy „rajzoljanak logót”.
A Resolve **Media** oldalán importáld közvetlenül ezt a fájlt:
`frontend/src/assets/logo/heart.png`.

- **S01, 00:00–00:01.2:** tedd V3 sávra a bal felső mobil-safe területre,
  körülbelül 56 px magasra; mellé egy külön Text+ elemben `MyScoutee`, 34–38 px.
  A teljes csoport csak opacityvel jelenjen meg és tűnjön el.
- **S23, 02:44–02:48:** tedd középre az eredeti logót körülbelül 112 px
  magassággal. Alá külön Text+ elemben `MyScoutee`, majd a tagline és CTA. A
  logó aspect ratio-ja maradjon zárt.
- Ne használj Colorize/Tint/Glow/Drop Shadow/AI Enhance effektet a logón. Ne
  vágj bele és ne készíts belőle új SVG-t vagy generált változatot.
- Mivel a terjesztési oldal várhatóan eleve MyScoutee-brandelt, a középső 162
  másodpercben nincs állandó sarokvízjel. Ettől az end card nagyobb érzelmi súlyt
  kap.

## 10. Ha valami nem működik

| Hiba | Ne ezt próbáld újra | Javítás |
| --- | --- | --- |
| változik az arc | több érzelmet és több kameramozgást kérni | azonos reference/Element, statikusabb kamera, egyetlen arcreakció, új első frame |
| rossz kéz | ugyanazt a hosszú ensemble promptot futtatni | vágj közelebbi arcra vagy tárgydetailra; a kézmozdulat legyen külön clip |
| S08 földrajzi káosz | minden országot egy promptba írni | egy hely = egy still; 9 frame/db a Resolve-ban |
| túl nyomorúságos London | „sad, poor, desperate” erősítése | használd a `maintained, intentional saving, quiet agency` megkötést |
| vádoló S04 | rendőrt, rajtaütést, céget kérni | névtelen kézjel + frosted partition; használd a biztonságos VO-t |
| táncjelenet nőellenes | a partner érkezését konfliktusként mutatni | nyitott testtartás, barátságos köszönés, Founder apró megértő bólintása |
| AI-halandzsa | újrageneráltatni a feliratot | teljesen textless plate; szöveg és UI a Resolve-ban |
| nem fér a VO | videót felgyorsítani | új, természetesebb hangfelvétel vagy rövidített alternatív mondat |
| gyenge befejezés | könyörgő CTA vagy crowdfunding kép | nyugodt szemkontaktus, kész mag, kompetens helyi operátorok |

## 11. Végső ellenőrző kapu

Csak akkor tekintsd késznek, ha minden válasz **igen**:

- A 02:48-as film végig lejátszik és 24 fps marad?
- A történet időrendje pontos, London előtt vannak a kiküldetések?
- A londoni megosztott szoba tudatos idővásárlás, nem kudarc?
- Az utazási rész pontosan 3 másodperc és illusztrált emléknek látszik?
- A hazatérés pozitív, a Founder cselekvőképes?
- Az app-probléma kétoldalú, nem nő–férfi vád?
- A prioritás privát és módosítható, nem emberérték?
- A csoport választható, a kémia nincs garantálva?
- Az operátor helyi szerző, és nincs bevétel-/traction-állítás?
- Minden szöveg helyes, valódi logóból és utómunkából származik?
- Angol és magyar felirat olvasható, a hang nem torzít?
- Megvan a textless master, a license/consent mappa és a projektmentés?

Ha bármelyik nem, a filmet ne töltsd fel: menj vissza ahhoz a kapuhoz, ahol a
hiba először látható volt. Ez olcsóbb és gyorsabb, mint a végén újragenerálni az
egész filmet.
