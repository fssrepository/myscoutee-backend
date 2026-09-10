# Aktuális gyártási költségterv

## 4K képek — a felhasználó által megerősített ár

2026-09-10: **egy elkészült 4K képlap 4 kredit** a felhasználó által választott Higgsfield-műveletnél. Ezt használjuk az összes tervezett 4K lap becsléséhez. A teljes lap egy kép: az 1×3, 2×2 vagy 3×3 celláit nem számoljuk külön generálásnak. Egy promptból több kimeneti változat és minden fizetős újragenerálás külön képnek számít.

A korábbi hétnapos Unlimited-képkeret nem teszi ezeket a kiválasztott 4K generálásokat ingyenessé. A 4 kredites ár forrása a felhasználó mostani felületi visszajelzése, nem általános ár minden modellre. A [Higgsfield kreditútmutatója](https://higgsfield.ai/creator-hub/help-center/credits/how-credits-work) külön kezeli a kredites és jogosult Unlimited-műveleteket. A becslés a ténylegesen kijelzett 4 kredites műveletre vonatkozik.

Minden aktív képprompt 3840×2160 / 4K. Karakterazonosság 1×3; világ/emlék/morph 2×2; a tipográfia rövid ratingmintája 3×3, a többi tipográfia 2×2. A 3×3 lap cellája 1280×720, a 2×2 lapé 1920×1080; a teljes kép ára a megadott beállításnál ettől még 4 kredit.

## Egy első teljes képkör

| Kategória | Képlap | Kredit/kép | Első kör |
|---|---:|---:|---:|
| Karakterazonosságok | 31 | 4 | 124 |
| Jelen-világok | 21 | 4 | 84 |
| Emlék/klinikai/éttermi világok | 30 | 4 | 120 |
| Épület- és térmorphok | 37 | 4 | 148 |
| Tárgy- és anyagmorphok | 32 | 4 | 128 |
| Karaktermorphok | 6 | 4 | 24 |
| Tipográfiai lapok | 7 | 4 | 28 |
| Opcionális térképek | 7 | 4 | 28 |
| **Importálható könyvtár, térképek nélkül** | **164** | **4** | **656** |
| **Minden képprompt, térképekkel együtt** | **171** | **4** | **684** |

A tipográfiai kiegészítő **7 kép / 28 kredit**, már benne van a 656 és 684 összegben. A korábbi, tipográfia nélküli 157 elem első köre 628 kredit lett volna. Az import és a fájlok szerkesztése nem képgenerálás, nem könyvelünk rá terhelést.

Ez bruttó újragyártási becslés: minden felsorolt promptból egy új 4K kép. A korábban megmaradt C01, C02, MR001 és R002 képek miatt nem vonunk le automatikusan négy generálást; csak a jelenlegi szerepre és minőségi célra ténylegesen újrahasznált kész lapot kell levonni. A korábbi R002 nézetlap nem ugyanaz, mint az új buszmorph. Képenkénti újrahasználat esetén a tervezett költség 4 kredittel csökken.

## Újragenerálási forgatókönyvek

A százalékok tervezési forgatókönyvek, nem előrejelzett AI-hibaarányok és nem automatikus generálási felhatalmazások. A tartalék csak a később ténylegesen szükséges plusz képekre szolgál.

| Könyvtár | Első kör | +10% pluszkép, felfelé kerekítve | +20% pluszkép, felfelé kerekítve |
|---|---:|---:|---:|
| 164 importelem | 656 | 17 kép +68 → **724** | 33 kép +132 → **788** |
| 171 kép a térképekkel | 684 | 18 kép +72 → **756** | 35 kép +140 → **824** |

A hét új tipográfiai lap első köre 28 kredit; további két teljes tipográfiai újragenerálás +8 kredit, összesen 36. Ez két plusz lapot jelent, nem két teljes új kört mind a hétből.

## Hatás a korábbi egyenlegre és a videókra

A legutóbb feljegyzett egyenleg **körülbelül 700 kredit** volt; ez nem most ellenőrzött fiókegyenleg. Ha még érvényes, akkor a 164 képes első kör után **44 kredit**, a 171 képes kör után **16 kredit** maradna. A 10%-os képtartalékkal számolt 724/756 kredit már ezt a régi becslést is meghaladja, még videó nélkül.

A korábbi körülbelül 100 kredites további tesztkeret és 700 kredites teljes hátralévő terv így nem tekinthető finanszírozottnak pusztán attól, hogy a képekhez korábban Unlimitedet terveztünk. A képek, tesztvideók, teljes film és befejezés ugyanazt a ténylegesen rendelkezésre álló keretet használják. További videóárak vagy aktuális egyenleg nélkül nem állítjuk, hogy a teljes gyártás belefér.

## A további videóműveletek árai külön tételek

| Művelet | Legutóbbi ismert ár / állapot |
|---|---|
| Részletes 8 s / 480p pilot | Korábbi önálló UI-ár 20 kredit; a mostani teljes bemeneti készlet aktuális ára nincs megerősítve |
| Natív folytatás, +8 s | Aktuális Extend-ár ismeretlen |
| Narrált változat az összefűzött teszthez | Beszéd, mix és esetleges csatlakoztatás/kimenet aktuális ára ismeretlen |
| Teljes film: hat 30 s blokk és egy 20 s befejezés | A választott végleges generálási műveletek aktuális árai ismeretlenek |
| Összeállítás / mix / export | A tényleges Higgsfield-művelet alapján számolandó |

A narrált teszt 16 szavas, körülbelül 7–9 másodperces kivonatát nem kell új jelenetgenerálással vagy új képkörrel helyettesíteni. A meglévő jó képek újrahasználhatók a végső filmben is. A költségbecslés nem módosítja a film hosszát, történetét vagy képtartalmát.

```text
hátralévő új 4K képlapok × 4
+ tényleges plusz képgenerálások × 4
+ további tesztvideók és hangjuk
+ teljes film első generálásai
+ szükséges videóismétlések
+ összeállítás / mix / export
= teljes hátralévő kreditigény
```

A tételes képbecslés: [IMAGE_GENERATION_ESTIMATE.csv](../04_tracking/IMAGE_GENERATION_ESTIMATE.csv). Képlet fájlonként: `(planned_new_images + additional_attempts) × credits_per_image`. Az ottani első kör tervezés, nem rendelés vagy terhelés. A [credit_ledger.csv](../04_tracking/credit_ledger.csv) tényleges költési sorai nem változtak; a korábban rögzített 80 kredites tesztköltést nem vonjuk le újra. Képgenerálás nem indult ebben a munkamenetben.

A régi becslés [archív példánya](../04_tracking/archive/budgets/BUDGET_BEFORE_4K_IMAGE_QUOTE_2026_09_10.md) megőrzi a korábbi Unlimited-feltételezést és teszttervet; előretekintő számolásra ez a friss dokumentum szolgál.
