# Képreferencia-könyvtár

- [characters](characters): az önálló karakterazonosságok.
- [morphs/buildings](morphs/buildings): épület-, homlokzat-, nyílás- és térátalakulások.
- [morphs/objects](morphs/objects): járművek, bútorok, kellékek és anyagok átalakulásai.
- [morphs/characters](morphs/characters): kiválasztott szereplők közötti folyamatos alakváltozás.
- [worlds/real](worlds/real): a jelen városának A–B–C környezeti lapjai.
- [worlds/memories](worlds/memories): emlékek, T01 étterem és a végső klinikai valóság A–B–C lapjai.
- [typography](typography): olvasható ratingek, utcai feliratok, helyi betűváltozások és a zárócím.

A real elnevezés a jelen városi rétegét jelöli; ez továbbra is a történet lehetetlenül változó Londonja. A HRW07 klinikai lapok a forgatókönyvi szerepük miatt a memories ágon maradnak, kizárólag a végső blokkhoz.

A [teljes prompttérkép](../00_project/elements/index/FULL_PROJECT_PROMPT_MAP.csv) az aktuális importelemeket a pontos TXT fájlokhoz rendeli. Mappaváltás miatt nem kell Elementet újraimportálni. A legújabb kérés szerinti kategóriaimportokat az elements/README ismerteti; mappaváltás önmagában nem hoz létre új elemet.

## Képlapok formátuma

| Könyvtár | Elrendezés | Teljes képfelbontás |
| --- | --- | --- |
| characters | 1×3: elöl, hátul, arc | 3840×2160 (4K), panelenként 1280×2160 |
| morphs/buildings, objects, characters | 2×2: négy különböző anyagállapot | 3840×2160 (4K) |
| worlds/real, memories | 2×2: négy részletes környezeti nézet | 3840×2160 (4K) |
| typography | TY001: 3×3 rövid ratingminták; TY002–TY007: 2×2 felirat/részlet | 3840×2160 (4K) |

A 4K 2×2 lapon nulla margóval és köztes hézag nélkül egy cella 1920×1080 pixel. A felület felbontásválasztóját is ennek megfelelően kell beállítani. A világ külön nézetei nem morph-fázisok; a morph-lap négy cellája ugyanannak az anyagfolyamatnak négy különböző térbeli állapota. A tipográfia TY001 lapja az egyetlen 3×3-as kivétel: cellánként 1280×720 pixel. Minden teljes kép továbbra is 4K.

Current-city people carry decimal rating cards tinted by score. Memory, clinical and studio identity exceptions remain as specified in each prompt. Umbrellas are forbidden in every active image prompt.

A felhasználó által megerősített ár **4 kredit / 4K képlap**. A 164 importelem első képköre 656 kredit, a hét opcionális térképpel együtt 684. Részletek és újragenerálási tartalék: [BUDGET.md](../00_project/BUDGET.md).
