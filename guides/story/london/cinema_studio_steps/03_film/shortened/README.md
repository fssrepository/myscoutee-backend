# Shortened — P00–P05, a látott eredmény alapján

A letöltött videók látható jeleneteit rövidebb promptokba írtuk vissza. A hat teljes prompt összesen **68 912 → 19 994 karakter: 71% rövidülés**, az összes eredeti referenciahandle megtartásával. Ez az elkészült képsor tömörebb leírása, nem bizonyíték arra, hogy a rövidebb prompt ugyanilyen videót generálna.

| Változat | Karakter: production → shortened | Referencia-Element |
| --- | ---: | ---: |
| [P00](P00/video.txt) | 5 670 → 906 | 1 |
| [P01](P01/video.txt) | 12 232 → 3 255 | 22 |
| [P02](P02/video.txt) | 12 136 → 3 726 | 27 |
| [P03](P03/video.txt) | 13 543 → 3 944 | 28 |
| [P04](P04/video.txt) | 12 174 → 4 168 | 29 |
| [P05](P05/video.txt) | 13 157 → 3 995 | 27 |

A rövid, publikálható táblázat: [STATISTICS.md](STATISTICS.md). Ugyanez a szakasz bekerült a [projektbriefbe](../../00_project/project_brief.txt). A `draft`, `prerelease` és `production` promptokhoz ez a kísérlet nem nyúlt. A draft 01–07 fejezetei más időfelosztást követnek, ezért a számszerű összehasonlítás alapja a videókhoz tartozó production P00–P05, nem a draft mappák sorszáma.

## Mit jelentenek a százalékok?

- **Shorter text:** az új teljes fájl karakterhosszának csökkenése a production fájlhoz képest; szóközök, sortörések és referenciahandle-ek is beleszámítanak.
- **Story match:** a külön felsorolt történeti események vizuális teljesülése. A felismerhető esemény 1 pont, a leegyszerűsített vagy részben hibás megvalósulás 0,5, a nem azonosítható esemény 0.
- **Detail loss:** 100% mínusz a külön pontozott kivitelezési részletek megtartása. Ide tartozik a megszakítatlan kameraút, az anyagfolytonosság, a párhuzamos morphok, a jelen/emlék elkülönítése és a kártyaszabályok. Az egyszerűsítés, a kihagyás és a más megoldással helyettesítés együtt szerepel; nem kizárólag szándékos modell-egyszerűsítés.
- **Reference match:** felismerhető képi megfelelés Elementenként: jellegzetes egyezés 1, részleges vagy más referenciákkal összemosódó egyezés 0,5, nem azonosítható egyezés 0. Ez nem a modell belső referenciahasználatának mérése. Egy részben átvett négypaneles lap is hordozhat felismerhető megfelelést; ettől a többi panel még hiányozhat.

A szemrevételezéses mutatók 5 százalékpontra kerekített, szubjektív becslések. A kiválasztott szempontok egyenlő súlyúak, nem fedik le a prompt minden mondatát; ezért a történet- és részletmutató nem egyetlen univerzális „promptkövetési pontszám”. A nem eldönthető részlet üres pontértéket kapott, és kimaradt a nevezőből. A nem felismerhető referencia nem bizonyítottan fel nem használt referencia. Egy jelenet és egy szereplő több referencia között is átfedhet.

## Bizonyíték és korlát

A `/home/raxim/Downloads/p00.mp4`–`p05.mp4` önálló letöltéseit vizsgáltuk, nem az összeillesztett vagy térben javított preview-kat. P00 már a korábban javított feliratú ident; a helyes címet ezért nem tulajdonítjuk kizárólag a nyers generálásnak. P04 a nyitókép-szabály később visszavont, megengedőbb változatával készült; a jelenlegi szigorúbb nyitóutasítás teljesülését nem pontoztuk visszamenőleg P04-re.

Módszer: a teljes időtartamokon 2 kép/s mintavétel, a gyors változások egy részén 6 kép/s; a P02 telefonszámai és a végképek teljes felbontású ellenőrzése. Ez képsor-alapú vizuális elemzés, nem minden képkockát vagy minden hangot minősítő audit. A zenét és a hanghatásokat nem pontoztuk. A shortened promptok rövid hangbekezdése az eredeti alkotói szándékot őrzi, nem egy meghallgatással igazolt hangsáv-leirat.

Az Elementek aktuális képeit is megvizsgáltuk: 134 klipenkénti hivatkozást. A több klipben ismételt Element minden klipnél külön sor; az R010 két csatolt képe egy Elementnek számít. A jelenlegi csatolmányok nem bizonyítják a korábbi generálás pontos bemeneti állapotát. A pontozás időpontjához tartozó Element- és médiaváltozatok az alábbi CSV-ben szerepelnek.

- [assessment.csv](assessment.csv): 92 történeti és kivitelezési szempont, pontszámmal, helyi idővel és indoklással.
- [reference_assessment.csv](reference_assessment.csv): minden klip minden referenciahandle-je, képi megfelelés, időpont és az ellenőrzött csatolmány azonosítója.
- [metrics.csv](metrics.csv): pontos karakterszámok, pontösszegek, nevezők és a kerekítetlen százalékok.
- [source_manifest.json](source_manifest.json): a vizsgált forrásvideók és promptok SHA-256 lenyomata, felbontás és időtartam.

## A rövidítés lényegi változásai

P01 megtartja az utcát, szobrot, kávézó-nyílást és mosolyt, de nem írja vissza teljesült eseményként a külön üres ebédhelyet vagy a COFFEE–KÁVÉ morphot. P02-ben az életkor-változás látszik, de a videó **47-ről 33-ra** vált a kért 37 helyett. A shortened csak a látható 33-as célértéket írja elő; a hibát a pontozás külön rögzíti.

P03 kb. hét másodpercet fordít az utcára és állomásra; a kapu, busz, taxi és hotel később, összesűrítve következik. P04 a legtöbb nagy emlékképet megmutatja, de többnyire külön nézetekként; a folyamatos növény–talpfa és tárgy–tárgy átalakulás nem olvasható végig.

P05-ben az irodák felismerhetők, viszont a három egymással összeegyeztethetetlen rekord, a külön biztosítási probléma és a záró delegálás kevéssé vagy egyáltalán nem olvasható. A MWP01_C lap folyosós és diplomás paneljei felismerhetően bekerültek, bár ezeket a P05 jelenetleírása nem kérte. Emiatt a referencia-megfelelés lehet magasabb, mint a történetkövetés: egy referencia látványos átvétele nem feltétlenül a megfelelő esemény teljesítése.

## Kevesebb referencia: elkülönített próba

A shortened fájlok ugyanazokat a handle-eket tartják meg, hogy először csak a szöveg rövidítését lehessen kipróbálni. Egy második próba változatlan shortened szöveggel hagyhatná el a `reference_assessment.csv` 0 pontos sorait. Ez P00-nál nem csökkentene; a többi klipnél a megtartott lista a CSV-ből egyértelműen kiválasztható. A 0,5 pontos, átfedő karakter- és helyszínlapok eltávolítása már külön kísérlet lenne.

Ez csak vizsgálati javaslat, nem kipróbált jobb konfiguráció; nem töröltünk Elementet és nem indítottunk új generálást. Az eredeti történet újragenerálásánál a most kihagyott eseményhez tartozó kép eltávolítása nem lenne indokolt pusztán attól, hogy az előző videóban nem jelent meg. A közös lapok nem kért paneljeihez célzottabb referencia szükségességét P05 különösen jól mutatja.

## P05 utolsó képkocka P06-hoz

Kimenet: `/home/raxim/Downloads/p05_last_frame.png`, **1920×1080**. Forrás: eredeti `p05.mp4`, 481 dekódolt képkocka, az utolsó indexe **480**, időpontja **20.000 s** (24 fps). A PNG az eredeti végképből készült, átméretezés és az MP4 módosítása nélkül. A kimentés nem csatolja automatikusan a képet Higgsfield Elementhez.

Az alkalmazott kiválasztás:

```bash
ffmpeg -i /home/raxim/Downloads/p05.mp4 -vf 'select=eq(n\,480)' -frames:v 1 /home/raxim/Downloads/p05_last_frame.png
```
