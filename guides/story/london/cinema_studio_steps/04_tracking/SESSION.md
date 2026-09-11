# Current checkpoint — whole-image reference union, 2026-09-11

Latest decision: no arbitrary 30-reference cap and no reference thinning solely to reduce the count. Keep the current requests within the observed 50-reference / 15,000-character limits. Preserve animation detail; V01 now restores its omitted stair, drum, staggered-tower and portico details at 14960 characters. No further generated storyboard image is required for this film plan. If a concrete capacity problem requires restructuring, examine a 15-second split before simplifying the story.

Implemented: eight local storyboard plans and eight corresponding story-video prompts now use the selected existing whole images. No generated SB dependency remains. 216/266 canonical images are direct references; all 50 alternatives have explicit reasons in VIDEO_ASSET_COVERAGE.csv. All 63 beat paragraphs remain verbatim. Prompt counts are 48/49/35/29/36/37/47/30; each video text is under 15,000 characters. These are composer-level checks, not backend-quality guarantees.

Creator constraints: no panel cutting, no resized/composite grids, no bulk image generation or replacement uploads. Preserve the main-film budget and consider only one or two focused 480p tests from confirmed surplus. Existing imported SB Elements stay unused. Existing source images, the canonical master and narration texts are unchanged.

V00 now specifies a four-second symbolic material assembly: separated paths/coloured logo sections converge around the white heart, settle into the exact logo and hold MyScoutee presents. No literal gears. One existing logo reference, material sounds and a short acoustic signature with Audio ON; no additional image or audio-reference job.

Narration already downloaded: hf_20260911_092854_627d5d9b-4dc2-4d8a-82ea-b53a24eb0021.mp3, previously measured 150.334694 seconds; creator-reported quote 6.15. Do not regenerate. Last reported pre-narration balance 1979. Remaining footage/ident planning reserve 1836; arithmetic surplus 136.85 only if no other debit. See BUDGET.md for uncertainty.

Next: review the intended request's existing inputs and UI quote before video generation. Each later continuation requires the accepted predecessor's actual final decoded frame, extracted/verified locally by Astra and assigned by the creator to its existing EF Element. No paid job or upload was performed in this revision. The user operates Higgsfield generation/upload/publication.

Earlier entries below are historical and may describe superseded paid boards, pending narration or full-library binding. Follow 03_film/README.md and FILM_REFERENCE_AUDIT.md for current state.

## Active small-test checkpoint — 2026-09-11

The creator is starting the 4+4-second test and explicitly requires the workflow to continue through Publish and published playback. Current first step: prepare 01_pilot/test_video_4s.txt in the existing project with C01, C02 and MW01 Page A image references; 4 s, 16:9, audio ON, one output, 480p if offered; inspect actual model/settings and quote. Continue through native Extend, real narration mixing, publishing preview/submission and playback at the returned published URL. No first clip or published test is yet verified. See [the full current test sequence](../01_pilot/README.md). This is the Higgsfield creative test workflow, not the repository's fixture-backed manual QA campaign.

## Budget reconciliation — current 2036-credit balance

Compared with the 2860 reported baseline, net balance reduction is 824: +140 against the original 684-credit image allocation, or +84 against the revised 740 allocation. Current 266-image scope is a hypothetical 792-credit clean pass, already attached and not payable again. Remaining scenario: film 1800 + seven 4K storyboards 28 + narration 14 = 1842, leaving 194 for the small pilot, logo and finishing. A combined 100-credit planning envelope for those leaves 94. Actual Extend/mix/logo quotes remain pending; this is not an itemized spend record. See [current budget](../00_project/BUDGET.md).

## Opening logo segment — identified and prompted

The creator clarified the full-screen MyScoutee presents ident, using the existing repository/profile M-logo (creator-reported GPT Image 2 provenance). The old 4-second title-card video is not an input. [00/video.txt](../03_film/00/video.txt) describes a new restrained 4-second ident with only the logo image as reference. The latest instruction is prompt preparation; no upload or generation was performed. Model and price remain unselected. No Higgsfield/festival branding is requested inside the ident. The seven story blocks and the 4+4-second test are unchanged.

# Current override — small continuity test, 2026-09-10

Latest user scope supersedes earlier eight-second pilot decisions: [4-second first clip](../01_pilot/test_video_4s.txt) + [4-second native Extend](../01_pilot/test_extend_4s.txt), approximately 8 seconds joined, simple restaurant with three existing references. Narration crosses the seam as one later track. Balance: user-reported 2036. Native picture/background continuity is reviewed before adding narration. See [current instructions](../01_pilot/README.md) and [unresolved Higgsfield audio-overlay route](../01_pilot/NARRATION_ROUTE.md). No generation executed. Earlier session entries below remain historical.

A felhasználó külön megerősítette: a hétnapos Unlimited felirat valóban 2K képekre vonatkozik. A 2K-bontási költségváltozat ennek aktív időablakára számol 0 képkreditet. Az egész könyvtár átállítása továbbra sincs elrendelve; a 4K promptok megmaradtak.

## 2026-09-10 — Képmodell és felvetett 2K alternatíva

A felhasználó pontosította: Nano Banana Pro, 4 kredit / 4K kép. Felvetette a 2K-s kétcellás bontást, de még nem rendelte el az átállítást; az aktív 171 képprompt továbbra is 4K. A BUDGET.md-ben összehasonlítás szerepel: 2048×2048 négyzeten két egymás alatti 2048×1024 cella, két lap az eredeti négy nézethez/állapothoz. 126 világ/emlék/morph lap bontása 252 2K kimenet lenne, 31 karakter + 7 tipográfia 4K mellett feltételesen 152 kredit, ha a 2K valóban 0 kredites Unlimited. Nem történt újrabontás, újraimport vagy render. A 4K/UHD kért pixelgeometria és a modell tényleges kimeneti mérete nem azonosnak tekintendő mérés nélkül.

## 2026-09-10 — Tipográfia, rendezett importmappák, 4K képköltség

- Hét új TY001–TY007 Prop: rating-számjegyek/színek, COFFEE→KÁVÉ betűanyag, kulturális/munkahelyi/közlekedési feliratok, 37→33 profilmező és a pontos zárócím. [Promptok](../02_library/typography/README.md). TY001 3×3, a többi 2×2; minden lap 4K. A zárócím továbbra is a forgatókönyvi hard cut után jelenik meg, nem új cím-animáció.
- Most külön importálandó: [TYPOGRAPHY_IMPORT.md](../00_project/elements/categories/TYPOGRAPHY_IMPORT.md), csak hét új elem. A [Full](../00_project/elements/full/FULL_PROJECT_IMPORT.md) 164 elemet tartalmaz, a négy kategóriafájl pontos egyesítése. Az Elements gyökérben csak README és full/categories/additions/index/archive mappák maradtak. A korábbi listák megőrzöttek az archive alatt; a hivatkozások átvezetve.
- Összesen 171 aktív képprompt van a 7 opcionális térképpel együtt. Az eredeti 164 prompt ellenőrzése történeti pillanatkép a tipográfia hozzáadása előtt. Az új tipográfiai lapok szövegei külön ellenőrizve; képgenerálás nem történt.
- A felhasználó megerősítette: **4 kredit egy 4K kép**. Első kör: 164 importelem × 4 = **656**; 171 kép térképekkel = **684**; a tipográfia hét lapja ebből **28**. +20% pluszképpel 788 / 824. A korábbi ~700-as egyenleg nincs újra ellenőrizve; ha érvényes, az első kör után csak 44 / 16 maradna videók előtt. [Költségterv](../00_project/BUDGET.md), [tételes tervezés](IMAGE_GENERATION_ESTIMATE.csv). Nincs bejegyzett új tényleges terhelés.

## 2026-09-10 — Teljes képprompt-részletellenőrzés, lineáris képelőkészítés

164 aktív képprompt ellenőrizve; 80 bővítve/javítva, 84 meglévő részletes prompt megtartva. A világok 63 és a kilenc rövidebb emlékcsalád 81 eredeti nézete konkrét térbeli/anyag-/szereplő-részletekkel bővült; 31 karakter saját ruha- és arcrészleteket kapott. A morphok négy eltérő anyagállapota megmaradt. Fájlonkénti ellenőrzés.

A FULL_PROJECT_IMPORT.md valóban 157 egyedi elemet tartalmaz. A felhasználó az 54-es UI-importot a korábbi elemek nem teljes törlésével magyarázta, és kérte az importált névsor figyelmen kívül hagyását. Emiatt nincs új pótlóimport és nincs távoli importálás. A részletjavítás nem változtatott Element-nevet vagy kulcsot. Következő lépés a felhasználó Higgsfield-képgenerálása, az új tényleges @hivatkozások kötésével ahol szükséges; csak ezt követik a tesztvideók. A képek pixeleit és az animáció folytonosságát ez a szöveges ellenőrzés nem igazolja.

## Current category import request — 2026-09-10

## 2026-09-10 — MR021 a rendes importok sorrendjében

Az MR021 Prop definíció a MORPHS_IMPORT.md-ben és a FULL_PROJECT_IMPORT.md-ben az MR020 után szerepel, nem a karakter-morphok után hozzáfűzve. A tárgymorph-jegyzék és a CSV sorrendje egyezik. A teljes fájl továbbra is 157 egyedi elem; rendes import mellett nem kell a külön MR021-kiegészítőt is importálni.


## 2026-09-10 — Teljes képelőkészítés: ratingkártyák, esernyőtilalom, MR021

- 164 aktív képprompt explicit esernyőtilalommal. A 21 jelen-világ lapon és a 68 korábbi épület/tárgymorphban a jelen-városi emberek kártyája már az állóképen szerepel; a későbbi videóra halasztó ellentmondó mondat javítva. Stúdióazonosító, emlék és klinikai kép kártya nélkül, az eddigi szereposztás szerint.
- Tizedes értékek (6.2, 7.4, 9.2), olvasható sötét számok, a tört pontszámot követő világos vörös/borostyán/zöld szín. A rejtett főszereplőpont színben sem szivárog ki; puszta rátekintés nem változtat értéket.
- MR021: külön 4K 2×2 kártyamorph 6.2→9.2, Prop típus, morphs/objects. Teljes import 157, Morphs 75; egyetlen MR021-kiegészítő is készült, kizárólag ha a korábbi 156 már importálva lett. Nincs távoli import-visszaigazolás.
- Kártyaellenőrzés, morph-állapotok. Szöveges ellenőrzés történt, új kép/hang/videó generálása nem. A képek tényleges olvashatóságát a generált eredményen kell majd ellenőrizni.


## 2026-09-10 — Fejlődő zenei téma, eseményekkel épülő feszültség

- A felhasználó a jelenlegi zene karakterét jónak tartja; változatosságot és fokozódó feszültséget kért. A VOICE.md, mind a hét video.txt és a pilot két vizuális promptja konkrét dallam-, ritmus-, regiszter- és hangszerelési fejlődést kapott.
- Az ismételt teljes bevezetés helyett blokkon átnyúló zenei mondatok; emberi pillanatoknál ritkítás és részleges feloldás, intézményi szakaszokban késleltetett lezárás, 06-ban dinamikus csúcs, 07-ben leépülés és változatlan klinikai hard cut.
- A narrációs TXT-k, a narrált pilot forráshang-megőrzése, a kép/időzítés és az importfájlok nem változtak. Nincs új hanggenerálás vagy meghallgatással igazolt eredmény.


## 2026-09-10 — A teljes import is elkészült a részfájlok mellett

A felhasználó kérésére a FULL_PROJECT_IMPORT.md ismét valódi importfájl, a jelenlegi 156 elemmel. Pontosan a Characters (31), Worlds (51), Morphs (74) fájlok egyesítése. Az előző bejegyzésben említett útmutató-helyettesítés már nem aktuális. Teljes újrakezdéshez most ez az egy fájl a következő import; a három kategóriafájl alternatíva, nem további importfeladat. A 105-ös történeti archív másolat megmaradt. Távoli import még nincs visszaigazolva.


## 2026-09-10 — Egységes 4K az összes referenciához

A felhasználó az 1×3 karakterazonosító lapokat is 4K-ra kérte. Mind a 31 prompt és az aktív felbontási útmutató frissült: 3840×2160, három 1280×2160-as panel. A világok és morphok 4K 2×2-esek maradnak, cellánként 1920×1080. A 156 elem definíciója és a három importfájl tartalma ettől nem változik; renderparaméter továbbra sincs az importokban. Ez a legfrissebb felbontási szabály, felülírja a korábbi 2K-alapot.


## 2026-09-10 — Aktuális kategóriaimportok átadásra készen

- A felhasználó az újraimport megkezdését jelezte; a három kategóriafájl újra összeellenőrizve a 156 soros prompttérképpel és a tényleges TXT-kkel.
- Characters 31, Worlds 51, Morphs 74. A morph-leírások az aktuális konkrét forrás/cél kapcsolatot nevezik meg, generálási paraméterek nélkül. Kulcsok és Element-nevek változatlanok.
- A régi 105-ös FULL_PROJECT_IMPORT.md pontos másolata: (historical file removed). Korábbi helyén a három aktuális importhoz vezető útmutató van.
- Státusz: READY_FOR_CREATOR_REIMPORT_NOT_YET_CONFIRMED. Nem történt távoli import/törlés vagy generálás. Az új platformazonosítók az import után köthetők be; a régi megemlítések nem bizonyítják az új Element létét.


## 2026-09-10 — Konkrét karaktermorphok és teljes anyag/forma-ellenőrzés

- A generikus CM001 sablon helyett CM001–CM006 konkrét párok: C04→C26, C02→C10, C06→C07, C11→C13, C23→C24, C28→C29. A külön szereplőazonosságok megmaradnak; ezek vizuális emlékkapcsolat-javaslatok, nem automatikus videóátírások.
- Mind a 74 aktív morph szövege ellenőrizve. Részletek: tételes audit. A kő, fém, üveg, fa, kerámia, szövet, rost, növényi anyag és rugalmas emberi felület külön deformációs leírást kapott. Nincs új képes vagy videós minősítés.
- A három aktuális kategóriaimport 156 egyedi elem: 31 Character-azonosító, 51 World-oldal, 74 Morph. A 6 CM-kimenet a Morphs importban Character típusú. A régi teljes/inkrementális importok történeti fájlok.
- Karakterazonosító: 1×3, 2K alap / 4K választható. Minden más referencia, a hét opcionális tervlap is: 4K 2×2, 1920×1080-as cellák. A tervek nem importelemek.
- A C04/C26, C06/C07 és C11 tényleges @ID-k még hiányoznak; a korábban ismert többi karakter-ID az új kategóriaimport után visszaellenőrizendő. Hat új CM-kimenethez nincs még generált kép. A generálások kizárólag a felhasználó Higgsfield felületén történnek.
- Következő: a felhasználó által importált aktuális párok valódi azonosítóinak kötése, majd a kész kép négy cellájának ellenőrzése; fizetős videó előtt a kiválasztott új anyagmechanizmusok és a videóprompt régi fix-alkatrész előírásainak összehangolása. Kép- vagy videógenerálás, távoli import nem történt.


Latest user asks to reimport by Characters / Worlds / Morphs categories. Created three metadata-only, mutually disjoint complete lists: 31 characters, 51 worlds, 68 morphs = 150. This supersedes the immediate 45-only import instruction; neither old full nor supplemental batches should be imported alongside the new category lists. User controls remote reset/import. No such remote action performed here. Maps stay optional planning assets; character-morph template is not imported without selected endpoints.

## Current structured library — 2026-09-10

Moved active material studies into morphs/buildings and morphs/objects; created morphs/characters with a detailed two-endpoint character transformation template, pending source/target selection. Worlds now use worlds/real, worlds/memories and worlds/maps. All tracked file paths and relative documentation links migrated. Legacy superseded image prompts moved to a historical archive subsequently removed. Existing 105 import and separate 45-entry supplement unchanged; no new platform operation. Added approximately one-second close slow-orbit attention guidance to the 68 active building/object morphs, with fast approach/departure and continuous geometry. Character morphs require chosen existing identities; none guessed or imported.

## All active objects now morph — 2026-09-10

Latest creator instruction explicitly requires every object to use detailed 2x2 morph images, including the London bus, and ambitious material action supporting fast/slow/orbit camera travel. Converted all 46 active R-object/architectural prompts to four-state text-only material studies. Preserved existing detailed MR processes where the relationship matches; wrote individual source/intermediate/intermediate/target processes for the remaining objects and landmarks. Some newly selected morphs are creative library options rather than mandatory new events in existing video beats. Total image morph prompts: 68 including the previous 22. The 105 existing Elements remain unchanged; 45-entry supplement only, no R002 duplication. No generation/import performed.

## Current import boundary — 2026-09-10

Creator confirms the existing full import must stay; no repeat with the bus. Restored FULL_PROJECT_IMPORT.md to its exact 105-entry committed baseline. Prepared separate 13_ADDITIONAL_OBJECT_REFERENCES.md with 45 disjoint new object/architecture entries. Baseline plus supplement = 150, but only the supplement is the next import. Existing platform names/types retained; object morphs remain valid 2x2 object references, ordinary object studies use 1x3. Layout is in detailed TXT, not render instructions in the import. No remote mutation performed.

## Dedicated object references restored — 2026-09-10

Creator confirms separate object sheets improve geometric/material guidance and wants 1x3 sheets like character turnarounds. Restored 45 dedicated object/architecture entries beside existing R002: 46 total, full import now 150 entries. Props are separate from Characters; built structures remain Locations. Updated object prompts to one 4K sheet with three horizontal cells, preserving detailed subject construction. Source/destination pairs remain complete endpoint studies plus a detail, distinct from the 2x2 morph sheets. No import or render performed; four retained images remain reusable. This supersedes the earlier 105-entry reduction.

## Current full Element restart — 2026-09-10

User explicitly requests the entire Element list including characters be reimported to remove accumulated clutter; only four images remain. Created FULL_PROJECT_IMPORT.md with 105 unique entries: 31 characters, 21 world pages, 30 memory pages, 22 morph sheets, one red bus. All older incremental imports are superseded for this restart. Four retained images inferred as C01/C02/MR001/R002 from the screenshot discussion; exact remaining UI media not inspected. Full import and prompt map prepared; no remote mutation. Old platform IDs are historical until new actual handles are supplied. T01_A now bootstraps the described restaurant from character refs; T01_B/C use the new A and no longer require deleted T01_IMAGE. Consumers of legacy world/restaurant/detail images still require migration to accepted new grids when new bindings arrive; do not treat old video prompts as render-ready for this restarted library.

## T01 restaurant coverage — 2026-09-10

Expanded T01 into detailed A/B/C 4K 2×2 pages, twelve assigned views. Existing four coverage subjects remain in A; B adds human/contact details and C construction/camera-clearance views. All pages use the accepted original room and bound C01/C02 inputs directly. T01_DETAILS remains Page A output key; B/C output keys are new and unbound. Prepared memory import 12 now contains 21 new containers; no import or render performed. Accepted T01_IMAGE and video references remain unchanged.

## Current morph input policy — 2026-09-10

The creator removed input-reference requirements from morph image generation. All 22 four-state prompts (MR001–MR020, R008 and R009 studies) are now self-contained text-only jobs: no @ mentions, missing-input gates or source-image prerequisites. Four distinct cells remain: source, first intermediate, second intermediate, destination. The detailed radical geometry is retained. Generated sheets can later serve as video inputs; output binding is a separate step. The café sheet describes occupancy and construction but does not claim exact cast identity from text alone. No generation occurred. This supersedes the older image-input requirements in the history below.

# Guided production session

## Current all-morph revision — 2026-09-10

The creator rejects mild variations and repeated near-finished targets and prioritizes detailed, ambitious material motion. All 22 four-state image prompts have now been revised with individually specified large intermediate configurations. MR001 explicitly expands into separated dome sectors, tower bands and splayed portico sections, then converges into an open arch, helical tower stack and unclosed roof before resolving the Basilica. The other 21 studies now have similarly distinct object-specific intermediate geometry. Removed conventional-engineering limits on unoccupied moving components; preserve material substance, part destinations and occupied floor/furniture contact. No new image/video was generated and the revision has no visual acceptance yet.

Before another paid pilot, align any selected and accepted morph path with its video beat; older attached-only cathedral instructions must not override the new path. No reduced ambition or extra per-effect video test is assumed. References preserve a selected accepted design; named buildings can also be generated from text, and reference images do not supply missing motion instructions.

## Latest cathedral comparison — 2026-09-10

The creator prefers the previous cathedral result. Compared the latest downloads `hf_20260910_040957_bb7741e2-e1b8-41af-87aa-4fac4592d5f6.png` and `hf_20260909_195819_8c30af4b-1501-4ee3-b8cb-36e5e94906ff.png`. The earlier view has substantially stronger London street context; the newer view isolates the building, includes a stray dome fragment and repeats almost-finished lower states. MR001 now explicitly retains London surroundings in all four cells, limits R006 to target-building geometry and strengthens the broad unfinished third state. Exact submitted prompt/model provenance is unverified. No further render launched, no credit charge inferred, and no complete morph image accepted yet.

## Current reference expansion

Prepared 22 four-state morph studies (MR001–MR020 plus R008/R009), including 17 new object-focused sheets. Intermediate states now require large unfinished supported volumes that differ at whole-sheet scale. Existing generated images remain unchanged; new/revised outputs require visual review. The prior MR001 output remains rejected.

Normal worlds retain 21 prepared 4K 2×2 pages. Memory/clinical banks now have 27 pages preserving all 81 original views, plus a T01 restaurant detail page with four spatial views. Production video/storyboard prompts map memory B/C references; missing actual handles remain visibly blocked. Clinical sources remain Block 07 only. The current pilot’s five-subject scope, three video tests and recorded spend are unchanged.

New-only imports: `11_morph_reference_sheets.md` (20 MR outputs) and `12_memory_reference_pages.md` (18 memory companions + T01_DETAILS). Both are prepared, NOT imported. Do not repeat old R/world/memory imports. All actual media creation remains in the creator’s Higgsfield UI. Next rendering choice should use one selected ready-bound prompt, not the entire prepared catalogue.

## Current MR001 image review

The downloaded `hf_20260909_194343_c663f27c-24ac-4db1-b610-1de68b585d30.png` is rejected as a morph reference: the first three cells nearly repeat St Paul’s and the last retains source massing as a hybrid. MR001 now releases the source footprint/proportions while retaining the site and camera, and specifies substantial unfinished masonry, facade carving and roof geometry in both intermediate cells. The revised prompt has not been rendered or visually validated. Existing R006 remains the destination input. No video generation or new credit debit occurred.

Current step: **6 / 77 — pilot visual review failed; revise wording before deciding on another generation**.
Completed: **5**. Remaining including current step: **72**; after this step: **71**.
Pilot: **step 6 / 8**. T01_IMAGE is visually accepted from the 14:39:25 result in MyScoutee. W01 is accepted and the creator explicitly confirmed completion after the Save instruction. C01 and C02 are visually accepted. The 14:19:35 screenshot confirms both saved image attachments in the MyScoutee Elements list. Their original generation history remains unresolved; this is distinct from the now-confirmed saved Element associations. Selected image controls and Unlimited are verified; actual charges and subscription expiry are not.

## Interaction contract

- The creator cannot edit, mix or render locally. For the pilot, generate the two visual portions with native music/SFX, join them, then execute the separate narrated-output test while preserving picture and sound. Full-film narration-as-generation-input support remains a separate unverified capability; and full hosted assembly/export must be verified before committing the full production budget. No local-editor fallback or extra generation job is assumed.
- Give one concrete operator step at a time in Hungarian chat; all repository text remains English.
- Keep tracking brief: accepted assets, actual credit charges/quotes and the next action. Do not append a click-by-click narrative. The creator requires copy-ready image dependencies as real autoloading @ references, including W01 and the T01 memory image; obtain missing actual UI IDs before claiming the prompt is ready.
- The creator confirms that pasted @ Element identifiers automatically load the corresponding Elements in the composer. Treat this as established operator-reported behavior: use verified full IDs in copy-ready prompts and do not ask for redundant manual reference selection, duplicate uploads or screenshots solely to prove autoload. Revisit binding only if a specific missing/wrong-reference symptom appears. Continue checking image-to-Element mapping whenever the creator supplies an Element screenshot.
- For every Element screenshot, verify that the attached image belongs to the current intended asset. Compare the visible image, Category, Name, Version, Element ID and visible Description with the matching prompt and import record. Explicitly report whether the association matches or identify the mismatch before advancing. Do not treat truncated/off-screen fields as checked, infer identity from grid position, or treat an open editor as proof that Save persisted.
- Before every generation, give the complete configuration together in chat: target project, image/video mode, model, aspect ratio, resolution, output count, references, prompt file, Unlimited toggle or actual credit quote, and any applicable duration/audio/extension settings. Do not make the creator ask for each setting separately. Model-menu Unlimited badges alone do not enable Unlimited; check the separate switch.
- Before opening the exact matching prompt in VS Code for copying, run its reference check. Ask for missing identifiers first, identifying the actual scene/person and known source in plain Hungarian rather than presenting UNBOUND keys. Resolve the current prompt's inputs before collecting unrelated future IDs. Synchronize and recheck; open the file for copying only when its references are ready. A prompt left open from earlier work does not count as ready.
- Always state the current step, total, and number remaining after the current step. While in the pilot, also show the pilot count.
- A step is an accepted asset or a defined production checkpoint, not each individual click or screenshot. Do not advance on a file-open command or an instruction alone; require the actual result or creator confirmation.
- The original baseline has 72 distinct media tasks plus four setup/budget/continuation/delivery checkpoints. The creator-requested W01 replacement at 4K adds one media task before FULL_BUDGET, giving 77 total; the accepted 2K W01 remains complete for the pilot. Optional maps, retries and public posting/submission are outside this film-delivery count. Final delivery includes review, title, official watermark/packshot and native export.
- This is a provisional no-retry baseline. Mark a reused accepted asset complete without regenerating it. If an unexpected required operation changes the count, explain the change and update the list; do not silently keep a false total.
- Use the existing MyScoutee project and imported Elements. Use the creator-reported approximately 700-credit remaining estimate for all unfinished work; 80 credits have already been spent on tests. The previous 2200/800 allocation is superseded. No additional funding is assumed.

## Current handoff

Pilot consistency pass completed: encounter 2–4.8 s, physical arcade passage 4.8–5.5 s, then a single rising 5.5–8 s city arc. The close bus runs concurrently at 5.5–7 s and the corresponding historic cathedral materials change in that SAME view. Intro, action headings, SFX and ending now agree that the occupied café remains solid at exit. The earlier generic folding block and mandatory café exit-morph are superseded. No separate final target shot, dissolve or frame jump is requested. Extend inherits actual geometry and soundtrack; narration uses the joined approximately 16-second source. No paid job launched or newly charged amount inferred.


Latest transition choice: matching forms use traceable solid material transformation; dissimilar spaces connect through a fast continuous camera passage with its destination already visible. Do not force every room into a morph. Prioritize recognisable historic landmarks for whole-building spectacle, especially St Paul’s → St Stephen’s; office memories retain their human content, but an anonymous office block is not an equivalent visual centre. Keep the close bus pass and camera speed variation. This supersedes the earlier requirement to mutate a room merely to leave it. No new generation or charge recorded.


Latest visual rule: no crossfade or replacement composition anywhere in an architectural/memory transition. All seven film video/storyboard pairs now specify scene-local solid material paths; both moving pilots and world/memory/map sources carry the same rule. First partial glimpse and full remembered encounter remain at the same developing opening. The background near 6–7 s is a solid bay-folding correction, distinct from the linked café-window opening. Original spoken scripts, character identity sources and clinical image remain unchanged; the final clinical/title hard cuts remain. No generation launched.


Latest duration correction: the native continuation now adds EIGHT seconds, not four. Use `test_extend_8s.txt`; join 8+8 into approximately 16 seconds. Allow 0–1.5 s to carry the source and reveal the next arch, 1.5–4.5 s for the canopy growth, 4.5–6.5 s for the deep passage/reversal, and 6.5–8 s to travel through the result and read the cards. Three tests remain; quote the actual eight-second Extend, not a four-second estimate. The creator prioritizes a meaningful test over saving these four seconds.

Three-test review: keep detailed first-scene imagery, use one single timed Extend sequence from the actual endpoint, and evaluate a 16-word verbatim Block 01 excerpt across the joined picture (about 2.5–10.5 s), including the source/extension seam. Cathedral motion starts visibly at about 5.5 s, resolves by 7 s and holds through 8 s. Latest creator estimate is approximately 700 credits remaining, with about 100 potentially spent on the remaining tests and headroom needed for one or two 30-second retries. This supersedes earlier 720/old-pilot-ceiling notes for current planning, without inventing a new charge. See the pilot README coverage table and BUDGET.md scenario formulas. Actual reference versions and hosted joining/mixing controls/prices still need verification before the corresponding paid operations.

Latest creator direction supersedes earlier audio-first/combined-first-scene proposals: keep the full detailed 8-second first video; make its native 8-second VISUAL continuation with new action; join the two as one 480p result, then add the short narration and assess the complete music/SFX/voice dynamics. This approved test becomes the practical visual/audio reference before 1080p. Two active pilot video TXT files remain. The narrated test now has its own `01_pilot/test_narrated_video.txt`, including exact speech and mix direction; its actual execution and any separate speech preparation both require quotes and consume credits. The pilot README links this file; the completed restaurant image source is now `02_library/worlds/memories/01_T01_SOHO_RESTAURANT_SOURCE_A.txt`, and its metadata remains in `00_project/elements/archive/pilot/00_pilot_test_assets.md`. No separate test-generation campaign per feature. Hosted joining/mixing operation and prices are not yet verified; do not regenerate accepted picture just to add speech. Seven film blocks, their exact monologues and necessary production scope remain.

The visual revision now covers all seven world sheets, seven video/storyboard pairs and non-clinical memory source geometry: explicit source-to-target materials, full-depth human encounters, continuous camera height/angle changes and block-specific impossible scale. Twenty-nine story beats received concrete material-path corrections. First pilot text, character sheets and clinical source are preserved. Existing rendered references are not automatically updated by editing these prompts; no media generation was performed here.

Current prompt: [8-second pilot](../01_pilot/test_video_8s.txt), step 6/77; 71 steps follow it. Four image mentions remain bound. The latest reviewed download `hf_20260909_152344_9053464e-3bd6-4c67-a242-8b4f6ae4926d.mp4` has promising architectural movement and readable transport, but the memory stays behind glass, cards do not read and the ending changes compositions. Current ungenerated revision removes the glass mechanism entirely: London paving becomes restaurant flooring, a bench unfolds into furniture, and turning wall sections reveal the complete embodied memory. The woman smiles in the open street; the room then continues becoming an arcade as the camera passes. The latest camera revision uses one high oblique discovery, fast physical descent, low lateral memory pass and outward rising arc, revealing both street sides. Surface-matched material changes replace walls lifting away to expose a ready-made cafe. London is the base; St Paul's Cathedral becomes St Stephen's Basilica. Whole rooms hinge outward, stairs thread sideways and walls bend with partial reversals. The creator now permits freely rearranged landmark geography; MAP01 is an optional association plan, not a locked route. The pilot joins Soho/Piccadilly and St Paul's in one impossible connected view. Recognisable landmarks are distributed across all seven blocks and matching world/map prompts. No rendered map or map Element binding was verified in this review; no extra reference has been added. Existing four source images remain reusable. Use 8 s / 480p / 16:9 / audio ON / one output, Single Shot. Last observed quote 20 credits. The creator now reports 80 credits spent on testing in total; 20 remain within the 100-credit total pilot allowance, including pending speech/continuation. No new retry is queued. The creator later clarified a maximum of 720 credits remaining for all future work; the old full-film allocation is superseded. No generation launched here. Audio not independently auditioned; image/video Move success is creator-reported.

Current creative direction is synchronized across all seven video/storyboard pairs, world/memory/map source preparation and the project look: London continuously becomes embodied memory, with impossible architecture and an independently travelling camera. Ordinary memory projections are removed; the scripted final clinical reflection, hard cut and stillness remain. Source people, story events, exact narration and card rules remain. Character and clinical source images are intentionally ordinary identity/reality references. The original master is archival; the cinema_studio_steps pack is the current production text. The newest reviewed download hf_20260909_154333_2820088b-1960-4974-a15a-d3fb6e8bbc50.mp4 shows recognisable restaurant content and a useful widening street view, but the memory remains glass-bound, numerical ratings are unreadable and the Basilica transformation is missing. This is not an accepted complete pilot. The creator clarified decimal ratings, approximately 1–9 with 9.2 as an example; the card design now makes the number dominant. No Cosmo definition was found in the project text. The 80-credit user-reported total is recorded once in credit_ledger.csv. Finish prompt consistency review before any next operator generation; no new paid job is authorized by this edit.

The supplied 2026-09-09 13:52:52 screenshot confirms the existing Protagonist Element in MyScoutee. Its displayed Element ID is `char_mys_protagonist_s1_v1` (a UI identifier, not a verified backend UUID). The Edit element modal has an empty image/video upload area, Description and metadata fields, and Save/Cancel. No image-generation model selector or generation prompt field is visible in this modal. Do not paste the character generation prompt into Description.

The next screenshot, 2026-09-09 13:54:14, shows the shared Cinema Studio Home page. Nano Banana Pro has an UNLIMITED badge in the model dropdown. The selected model is still Soul 2.0, the aspect ratio is 3:4, resolution is 2k, and Generate shows 0.125. That displayed quote belongs to the current setup, not a verified Nano Banana Pro request. The badge is observed; actual coverage, activation/expiry and generation inside the festival project remain unverified. The creator mentioned a $119 versus $520 bundle offer, but its contents are not shown; no additional purchase is part of this plan.

The creator confirms that all Elements were previously imported together from one file. Reuse those existing records; do not repeat the import. Inspect individual metadata only when needed for the current asset. The 13:59:13 screenshot shows an empty Canvas beside Elements; directing the creator there was an unverified detour, not a required character-generation step.

The 14:00:45 screenshot returns to the Home image generator, with Soul 2.0 still selected and Unlimited badges on both Nano Banana Pro and GPT Image 2. Nano Banana Pro is the initial workflow choice for C01, without a claimed measured advantage over GPT Image 2.

Latest evidence, 2026-09-09 14:07:12: C01 is generated. The visible configuration is Image / Nano Banana Pro / 16:9 / 2K / output control 1/4; the separate Unlimited switch is green and the generation button reads UNLIMITED. The creator confirms that the switch must be enabled separately. No reference input is visible for this initial identity sheet. The screenshot supports a usable three-panel identity sheet: full front and back including shoes, consistent navy jacket and dark clothing, clear natural headshot, neutral grey background. Retain this result; no visual issue currently justifies a reroll. This is screenshot review, not inspection of the original downloaded file.

The current project label is New project, folder Getting Started, rather than the previously confirmed MyScoutee festival project. Target-project association, generation history, and attachment to the existing Protagonist Element are not yet verified. Preserve the existing C01 result and its source history. Do not assume that renaming a normal project or attaching a finished image alone satisfies the festival requirement for generation inside the dedicated submission project.

Latest evidence, 2026-09-09 14:10:52: MyScoutee / All assets displays the festival welcome screen and the image composer together. Image / Nano Banana Pro / 16:9 / 2K / output control 1/4 and Unlimited ON are visible; the generation button reads UNLIMITED. Step 1 is complete. The following screenshot supersedes the proposed reference-selection and project-native regeneration route; do not require another C01 generation merely to complete the Element attachment.

Latest evidence, 2026-09-09 14:11:33: inside MyScoutee / Elements, the Edit element modal for Character / Protagonist / v1 / `char_mys_protagonist_s1_v1` visibly contains the accepted C01 triptych. The visible beginning of Description agrees with the intended character; the full off-screen text has not been checked. Save is available. The image is attached in the editor, but persistence after Save is not yet confirmed. The instruction at that checkpoint was Save. Retain this image as the protagonist reference. The source generation was previously shown under New project; attachment does not by itself prove festival-compliant generation history. Keep that provenance question open for verification before committing paid film production, without conflating it with the correctly configured Element or ordering a speculative reroll. All subsequent generations use the verified MyScoutee / All assets composer. The creator subsequently requested the next step; proceed to C02 with that continuation treated as implicit Save confirmation.

Latest C02 evidence, 2026-09-09 14:17:50 and 14:18:19: the first screenshot shows a usable Soho Woman triptych in New project / Getting Started, with Image / Nano Banana Pro / 16:9 / 2K / output control 1/4 / Unlimited ON. Natural warm expression, brown shoulder-length hair, dark navy coat, dark trousers and ankle boots fit C02. The front view includes the ordinary shoulder bag. The second screenshot shows this same image in My elements / All, in Character / Soho Woman / v1 / `char_mys_soho-woman_s1_v1`, Scene 1, Spec Apparent age 32-38. These visible fields and the beginning of Description match the C02 prompt and imported definition. The image-to-Element association is correct; Save is still available, so persistence is not independently confirmed. This screenshot does not establish the Element's saved visibility inside MyScoutee.

Latest evidence, 2026-09-09 14:19:35: MyScoutee / Elements visibly contains the woman triptych on the Soho Woman card (`char_mys_soho-woman_s1_v1`) and the man triptych on the Protagonist card (full ID verified in the earlier editor). Both editor dialogs are closed. This establishes saved attachments and correct image-to-Element mapping inside MyScoutee. C01 no longer relies on inferred Save confirmation, and C02 is complete. The screenshot does not answer where their original generations were launched; preserve that separate question in FULL_BUDGET without blocking preparation of an independent W01 asset.

Latest evidence, 2026-09-09 14:24:18: the W01 generated sheet is visible in MyScoutee / All assets. The composer shows Image / Nano Banana Pro / 16:9 / 2K / output control 1/4 and Unlimited ON with an UNLIMITED button. The nine-cell sheet has a coherent rainy city look, pedestrians, red double-decker, yellow tram, black taxi, substantial vehicle side windows and street-facing glass. It is usable as the pilot location reference. Small signage and exact named architectural fidelity are not fully verifiable from this screenshot; do not claim all prompt details or future motion are proven. No visual reroll is requested. W01 project placement is confirmed; the earlier C01/C02 source-history question remains separate.

2026-09-09 14:27:01 screenshot: accepted W01 nine-cell city sheet is attached in the editor for Location / World 01 - The City Judges First - Soho... / v1 / Scene 1. Full visible Description matches the opening London-Budapest walk. Element ID begins loc_mys_world-01-the-city-judges-fi; the remaining ID and name suffix are clipped and must not be invented. Correct association verified; awaiting Save.

The creator explicitly confirmed completion after the W01 Save instruction. Step 4 is complete.

The creator confirms that pasted @ identifiers automatically load their Elements. No further reference-binding screenshot or manual @ selection is required for T01.

2026-09-09 14:33:10 screenshot independently confirms the creator-reported autoload: both character IDs are highlighted and both correct reference thumbnails are attached.

2026-09-09 14:39:25 screenshot shows the completed T01 restaurant still in MyScoutee / All assets. Both characters are recognizable; the woman's clear face and small smile support the planned memory animation, the man is beside the restroom doors, and other diners are out of focus. This is one full-frame scene. Accept it as the pilot memory source; no extra canonical Element or reroll is needed.

Resolution decision: W01 is currently accepted at 2K for the 480p pilot. The creator requested one 4K W01 replacement before final-film production and 4K for subsequent worlds; characters remain 2K. This adds W01_4K after the pilot, making 77 tasks. Check Unlimited at the actual 4K setting, accept the replacement on the same World 01 Element and retain the earlier image. The original master used a 3x3 grid. A 3840x2160 grid provides about 1280x720 per cell, not nine 1080p images; native final video remains a separate 1080p setting and is not a planned upscale job. Critical fine-detail fidelity remains unproven. See SETUP.md for the complete resolution policy.

Next action: the current café-emergence pilot is ready for prompt/reference review. The original rejected video is not an Extend source. Do not launch a retry automatically; the creator controls generation. Evaluate the revised output for visible transformation, contextual memory, unobstructed cards and the new audible folk/SFX direction.

Pending checks are attached to their existing production rows: T01_VIDEO handles current binding and native music/SFX; TA01/T01_EXTEND handle the voice input and first seam; W01_4K handles the replacement; FULL_BUDGET handles complete costs and hosted delivery; each A/V row handles retained voice and output review; NATIVE_CHAIN handles continuation beyond 60 seconds; FINAL_DELIVERY handles the actual complete export. Prepared prompts do not establish passed checks. No extra media task was added; total remains 77.

Latest binding evidence: supplied 15:31 screenshots confirm thirteen additional complete character IDs, now propagated through the pack, but those image slots are empty. C01/C02 images remain on the correct named cards, and the accepted city sheet remains on World 01. The creator subsequently supplied the complete World 01 ID as text; it is now bound across the pack. Other clipped IDs remain unresolved. Capture each long ID as a separate metadata task at its point of use, using copied text rather than repeated zoomed list screenshots. The fully visible Score Cards prop ID is retained separately as metadata, without adding an empty reference to video prompts.

Authoritative step list: [production_steps.csv](production_steps.csv). Record accepted media in [assets.csv](assets.csv) and actual charges in [credit_ledger.csv](credit_ledger.csv).

Narrative audit: all seven current narration.txt texts occur verbatim in the original canonical prompt pack. Their spoken wording was not changed by the visual revisions. Each film video/storyboard pair now explicitly ties its transformations and human gestures to its existing monologue and MyScoutee’s person-versus-judgment theme. This verifies text preservation, not recorded delivery or final audio inclusion.


Latest downloaded visual review — 2026-09-09: `hf_20260909_180148_ab877873-a211-4eb7-8cea-8f0f1ab6e265.mp4`, 8.05 s, 854×480, 24 fps, audio stream present. Sampled the full clip at 3 fps and the 6.5–8 s ending at 12 fps. The café approach and close bus exit provide useful moving views; the restaurant is exposed through the opening, but its occupied furniture is not clearly carried outside the original facade as requested. Umbrellas are plainly present at the opening and no legible numerical rating cards are visible in the reviewed street frames. Around 7.1 s the close bus/intersection view jumps to a different statue-square composition; this does not prove a continuous cathedral material transformation. Do not classify the clip as passing ratings, umbrella removal or uninterrupted ending. Exact submitted prompt/settings are not independently known, and no new credit debit is inferred from this download. Audio content was not auditioned in this review.

Reference preparation clarification: the creator confirms covered web image generation is free within the seven-day Unlimited window. Use images to clarify objects/materials/cards; stills cannot validate morph continuity. Consolidated image prompts are in `02_library/morphs/objects/README.md`. Paper keeps its narrative function as human-scale documents; world and film prompts now explicitly require solid architecture, with W03 and Block 03 paper-building wording corrected.

## World-page conversion prepared

All W01–W07 world prompts now use 4K 2×2 pages A/B/C; all 63 original view descriptions remain. Fourteen companion-image tasks and a separate new-only 14-entry metadata import are prepared. Existing accepted media have not changed and no new import or generation was executed. Full-film video/storyboard prompts now declare the three relevant world inputs, with B/C IDs pending. Current active pilot preparation still uses the five selected subjects and the requested detailed morph sheets; it does not wait for the full world library.

## 2026-09-10 — Confirmed balance and no-regeneration constraint

The creator reports 2860 credits currently available and a maximum further purchase of 500 credits. No top-up is recorded as purchased. All 171 image prompts remain 4K with their existing detailed content and grid layouts. At 4 credits per image, the full first pass costs 684 credits and leaves 2176; the conditional remainder after the maximum top-up would be 2676. Images and videos must not be regenerated under the current instruction. Previous percentage retry allowances and additional video-attempt reserves are superseded. The remaining video/audio/finishing costs are not yet verified. BUDGET.md and source_manifest.json carry these current limits; the actual spending ledger is unchanged.

## 2026-09-10 — Observed festival 1080p quote

Creator screenshot at 09:08:13 shows Cinema Studio 4.0, 30 seconds, 1080p, 16:9, audio On, empty prompt, 0/50 references and output control 1/4. Generate displays 270 credits with 480 struck through. This is a quote only, recorded without a charge. It supersedes the earlier 720p-based working video allowance. Six 30-second blocks at 270 plus a proportional 180-credit 20-second ending estimate yield 1800 for the final film; total planned production becomes 3084. Against 2860 this needs 224 extra, within the 500-credit top-up limit; a full 500 top-up would leave 276. Complete-input/Extend/20s quotes and ancillary costs remain unverified. All images stay 4K and no regeneration is allowed.

### Block 07 price confirmation

The creator confirms that the 20-second Block 07 costs 180 credits. It is now a creator-reported quote rather than a proportional estimate. The final film remains 1800 credits and the complete working allocation 3084, including 600 in unquoted pilot/narration/finishing allowances. The gap against 2860 is 224; the maximum 500-credit top-up would leave 276. No charge was recorded.

## 2026-09-10 — Five budget lines; unsupported finishing allowance removed

Current plan: all 171 Nano Banana Pro 4K images 684; final-film footage 1800; provisional final narration/integration 200; separately adjustable pilot 100; separate assembly/export 0 allocated. The previous 300-credit finishing allowance had no established paid operation behind it and is removed. A cumulative Extend result, if delivered with the intended soundtrack, needs no separately budgeted assembly render; download is the delivery step. This is not a verified zero-cost tariff or a completed workflow test. Total 2784 leaves 76 from the creator-reported 2860; optional maximum top-up 500 would leave 576. No regeneration, purchase or new debit recorded.
