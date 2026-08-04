# Hang, vágás, branding és kiadás — DaVinci Resolve 21

Elsődleges cél: **02:48.000, 720×1280, 9:16, 24 fps, mobilos MP4**. A végső
filmet ne az OpenArt/Higgsfield/Flow belső editorából add ki. A dedikált timeline
biztosítja a pontos időt, eredeti logót, két nyelvet, tiszta feliratot és egységes
hangot.

## 1. Timeline és sávok

Resolve → **Edit** oldal. Készíts vagy nevezd át a sávokat:

```text
V5  TITLES_AND_SUBTITLES
V4  UI_AND_GRAPHICS
V3  ORIGINAL_LOGO
V2  OVERLAYS_TRANSITIONS
V1  APPROVED_PICTURE
A1  VO_EN or VO_HU
A2  DIEGETIC_DIALOGUE
A3  AMBIENCE
A4  FOLEY_AND_EFFECTS
A5  MUSIC
```

Duplikáld a lezárt képtimeline-t:

- `TCBU_MASTER_EN_720x1280`
- `TCBU_MASTER_HU_720x1280`
- `TCBU_CLEAN_TEXTLESS_720x1280`

A képet előbb zárd le; csak utána véglegesítsd a három hang-/szövegváltozatot.

## 2. Végleges narráció

### Saját hang — ajánlott

Az alapító saját hangja hordozza a történet hitelességét. Nem kell reklámhang.

1. Csendes, puha helyiség, telefon repülő üzemmódban.
2. Mikrofon 15–20 cm-re, kissé oldalra; állva vagy egyenes ülésben.
3. Ha van külső felvevő, állítsd `48 kHz / 24-bit WAV / mono` értékre. Ha nincs,
   a jó telefonfelvétel elfogadható; a Resolve-ban alakítsd 48 kHz projektbe.
4. Készíts két teljes angol és két teljes magyar take-et, majd csak a jobb
   mondatokat cseréld. Túl sok apró take hallhatóan darabossá teszi a történetet.
5. Vedd fel külön a biztonságos S04-mondatot és a termékfordulat visszafogott
   alternatíváját is.
6. Fájlnevek:

   ```text
   TCBU_VO_EN_take01_48k.wav
   TCBU_VO_EN_take02_48k.wav
   TCBU_VO_HU_take01_48k.wav
   TCBU_VO_HU_take02_48k.wav
   TCBU_VO_S04_safe_EN_HU_48k.wav
   ```

### Hangtisztítás

Fairlight oldalon, enyhén:

1. 70–80 Hz high-pass filter a mély dübörgés ellen.
2. Enyhe EQ csak a zavaró dobozhangra; ne változzon meg a személy.
3. De-esser csak hallható sziszegésnél.
4. Kompresszor körülbelül 2:1–3:1, 3–6 dB átlagos csökkentéssel.
5. Limiter plafon `-1 dBTP`.

Ne használj agresszív AI voice isolationt, ha fémessé teszi a hangot. Ne klónozz
valós hangot írásos beleegyezés nélkül. A végső VO-szint legyen stabil és
közelinek érződő, de ne „rádióreklám”.

## 3. Zene

Csak saját készítésű vagy dokumentáltan licencelt zenét használj. A TSB-film
zenéjét és dallamát ne másold.

### Zenei brief

- kb. 76–84 BPM érzet;
- felt piano, tompa vonóspad, halk fa/pergamen percusszió;
- S01–S04: kevés hang, ismétlődő munka-pulzus;
- S05–S07: a pulzus sűrűbb, de nem akciózene;
- S08 három másodperce: nyolc rövid, egy családba tartozó ütés;
- S09 hazatérés: először teljes, meleg akkord;
- S10–S15: finom, önironikus ritmus; sem romantikus komédia, sem keserűség;
- S16 „bridge”: percussion teljesen eltűnik fél másodpercre;
- S17–S21: egyre tisztább, összekapcsolódó motívum;
- S22–S23: nyitott, nem grandiózus feloldás és két hangos brand-zárás.

VO alatt a zene tipikusan 6–10 dB-lel legyen halkabb, mint narráció nélküli
pillanatban. A mondatvégeket ne tömje tele.

## 4. Hangeffekt és atmoszféra térkép

| Shot | Kötelező vagy hasznos hang |
| --- | --- |
| S01 | radiátor, ceruza, távoli villamos |
| S02 | állomásmosás, cipzár, videóhívás szobahangja |
| S03 | három eltérő, de nem ország-sztereotip munkahang |
| S04 | ventiláció, távoli lépés; sem sziréna, sem rendőrségi hang |
| S05 | eső, sínillesztés, kulcs |
| S06 | ágynemű, konyhai háttér, ajtó |
| S07 | óra, ételdoboz, billentyű, évszakok halk környezete |
| S08 | 8 rövid match-cut hangsúly, majd szél/vasúti csend |
| S09 | bőrönd megáll, ismerős villamoscsengő |
| S10 | ritka tick kontra tompa értesítésraj; ne legyen márkahang |
| S11 | tapsvég, tányér, filc |
| S12–S14 | cipő, teremreverb, „Párcsere!”, esernyő |
| S15 | kávégőz → mély basszus → terítő/evőeszköz |
| S16 | cursor eltűnik, ceruza kattan |
| S17–S18 | száraz slider/kapcsolódó hang, casino nélkül |
| S19–S20 | lépés, halk decline, üzenetből papír/jegy |
| S21 | belépőhang, szék, térkép, természetes nevetés |
| S22 | jegyzetfüzet zár, különböző helyiségek hangjai összeérnek |
| S23 | két hang, aztán fél másodperc természetes lecsengés |

Ne tartsd meg a generált natív hangot csak azért, mert együtt érkezett a
videóval. Használható atmoszférát külön sávra tegyél, az AI-beszédet némítsd.

## 5. Képvágás és a 9:16 kompozíció

- Timeline: `720×1280`, square pixel, 24 fps, start `00:00:00:00`.
- A szemek általában a felső harmad és a kép közepe közé essenek.
- Fő arc és lényegi kézmozdulat maradjon nagyjából `x=48–672` között.
- Fontos címet ne tegyél a felső 120 vagy alsó 220 pixelbe; a közösségi appok
  UI-ja platformonként változik, ezért mindig készíts célplatform-tesztet.
- Ha egy generált klip 16:9-ben érkezik, először próbálj intelligens újravágást
  keyframe-elt Positionnel; ne nagyíts 150–180%-ra egy 720p képet. Ha az arc már
  lágy, generáld újra natív 9:16-ban.
- Az átmenetek többsége kemény vagy tárgytakarásos vágás. Dissolve csak S08
  végén és indokolt emlékszerű ponton.

### S08 pontosan

`00:01:00:00–00:01:03:00` = 72 frame. Nyolc kép × 9 frame. A 9 frame-es
állóképekre elég 1–2% Position/Zoom változás; ne használj optikai flow-t vagy
frame interpolationt. A gyorsaság a vágásból jön.

## 6. UI és product-mozgógrafika

Az S10/S17–S20 AI-klipje legyen tiszta, üres képernyő/graph plate. A Resolve
Edit vagy Fusion oldalán add hozzá:

- S10: névtelen, olvashatatlan tartalom helyett szándékosan absztrakt
  értesítéskártyák;
- S17: privát 1–10 skála, amely `4 → 8 → 7`; a szám soha nem kerül az emberre;
- S18: amber kétirányú szándék, aqua kontextus, coral közös rendszer;
- S19: semleges Accept és Decline mozdulat, azonos vizuális súllyal;
- S20: dátum, útvonal, akadálymentességi jelzés és jegy, majd fizikai papír.

Ne mutass valótlan működő UI-t, felhasználószámot, sikerarányt, bevételt vagy
„perfect match” üzenetet. Ha valódi appképernyőt használsz, csak tesztadat legyen
rajta, és ellenőrizd, hogy személyes adat nem látszik.

## 7. Eredeti MyScoutee-branding

Importáld közvetlenül:

`frontend/src/assets/logo/heart.png`

Ez a logo source of truth. Ne készíts róla AI-változatot.

### S01 brand cue · 00:00–00:01.2

- V3: `heart.png`, kb. 56 px magas, aspect lock bekapcsolva;
- hely: bal felső **mobil-safe** terület, körülbelül x=48, y=100;
- külön Text+ elem: `MyScoutee`, kb. 36 px, Roboto/Segoe UI fallback;
- 6 frame fade in, 6 frame fade out; nincs glow, tint vagy árnyék.

### S23 end card · 02:44–02:48

- mélykék háttér;
- eredeti `heart.png`, kb. 112 px magas, középen;
- alatta külön `MyScoutee` 64–72 px;
- EN: `DESIGNED FOR THE MEETING.` és `BUILD IT IN YOUR CITY.`;
- HU: `TALÁLKOZÁSRA TERVEZVE.` és `ÉPÍTSD FEL A SAJÁT VÁROSODBAN.`;
- csak az egész csoport opacity/2% scale settle animációja; a logo képpontjai nem
  változnak.

Az érzelmi középrészben ne legyen folyamatos saroklogó. A publikációs oldal
brandingje és az eleje/vége egyértelműen termékfilmmé teszi.

## 8. Címek és feliratok

On-screen title-ok a [03_SCRIPT_EN_HU.md](03_SCRIPT_EN_HU.md) szerint. 720×1280
képen kiindulásként:

- cím: 42–50 px, középre vagy balra zárt, maximum 3 sor;
- subtitle: 34–40 px, maximum 2 sor, 30–34 karakter/sor;
- 80–90% opacitású mélykék háttérdoboz vagy erős outline a változó képek miatt;
- alsó biztonsági határ: legalább 220 px.

Resolve-ban: jobb klikk a timeline track-fejléc környékén → **Add Subtitle
Track**, majd add hozzá kézzel vagy importáld a végső SRT-t. A Resolve hivatalos
leírása szerint az Edit oldal SRT/TTML/XML feliratot tud importálni, stílusozni,
beégetni vagy külön exportálni.

A végső SRT időket a lezárt VO és kép alapján készítsd, ne a tervezési táblázatot
exportáld változtatás nélkül.

## 9. Keverés és mérés

Fairlight oldalon:

- VO mindig érthető telefonhangszórón;
- zene ne fedje a mássalhangzókat;
- ambience adjon teret, ne konstans zajt;
- cél körülbelül `-14 LUFS integrated`, true peak legfeljebb `-1 dBTP`;
- ments egy `-16 LUFS` alternatív mixet is, ha a célplatform beszédközpontú.

Hallgasd meg fejhallgatón, telefonhangszórón és halk szobában. A hangosságmérő
nem helyettesíti az érthetőséget.

## 10. Export — pontos mobilbeállítás

Resolve → **Deliver** → **Custom Export**:

| Mező | Érték |
| --- | --- |
| Render | Single Clip |
| Format | MP4 |
| Codec | H.264 |
| Resolution | 720 × 1280 |
| Frame rate | 24 |
| Quality | kb. 6–10 Mb/s; a target platform tesztje dönt |
| Encoding profile | High, ha elérhető |
| Audio codec | AAC |
| Audio sample rate | 48 kHz |
| Audio bitrate | 256 vagy 320 kb/s |
| Data levels | Auto |
| Filename | `TCBU_master_EN_720x1280_v01.mp4` |

**Add to Render Queue** → **Render All**. Ezután exportáld a magyar timeline-t,
majd a textless mastert. A clean masterből távolíts el minden title/subtitle
sávot, de a végső brandkártyáról készíts külön branded és teljesen textless
változatot is, ha később lokalizálni kell.

## 11. Telefonos QA és az egyetlen upscale-szabály

1. Másold a kész MP4-et a céltelefonra; ne csak a számítógépes viewerben nézd.
2. Nézd meg álló tájolásban, normál fényerőn, egyszer telefonhangszóróval és
   egyszer fejhallgatóval.
3. Tölts fel privát/unlisted tesztet ugyanarra a platformra, ahol megjelenik, ha
   ezt a fiók lehetővé teszi. A platform újratömörítheti a képet.
4. Jegyezd fel shot ID-val a hibát. Csak azt a shotot javítsd.

**1080×1920 újragenerálás csak akkor indokolt**, ha a 720×1280 forrás a platform
utáni telefonos tesztben olvashatatlan arcot, széteső finom vonalat vagy zavaró
tömörítési hibát mutat. A nagyobb felbontás önmagában nem javít arcdriftet, rossz
kezet, történetet vagy hangot.

## 12. Kiadási csomag

- EN branded MP4;
- HU branded MP4;
- textless/no-subtitle mobile master;
- külön EN és HU SRT;
- EN/HU dialogue stem;
- M&E stem;
- eredeti zene/SFX licencek;
- portré- és hangengedélyek;
- végső shot manifest modellel, promptverzióval és forrásfájllal;
- Resolve project archive vagy project backup.
