# Aktuális importútmutató

**A már importált 157 elemhez most a [TYPOGRAPHY_IMPORT.md](../categories/TYPOGRAPHY_IMPORT.md) hét új elemét add hozzá.** A teljes könyvtár ezzel 164 elem.

Új, üres projekt esetén a [FULL_PROJECT_IMPORT.md](../full/FULL_PROJECT_IMPORT.md) tartalmaz mindent. Alternatívája a négy külön [kategóriaimport](../categories/README.md): 31 karakterazonosság, 51 világ-/emlékoldal, 75 morph és 7 tipográfiai elem. A teljes fájl és a részek definíciói megegyeznek; ugyanazt a készletet egyszer importáld.

A rövid Type, Canonical key, Name, Version és Description mezők az Element létrehozásához valók. A részletes generálási leírás a [prompttérképben](FULL_PROJECT_PROMPT_MAP.csv) hivatkozott TXT fájl. Az import nem helyettesíti a képgenerálási promptot. A CSV `prompt_file` és `import_batch` útvonala a cinema_studio_steps projektgyökeréhez viszonyított.

Minden új kép 4K 3840×2160. Az azonosító karakterlap 1×3 (1280×2160/panel), a világ/emlék/morph 2×2 (1920×1080/cella). A tipográfia TY001 rövid számjegylapja 3×3 (1280×720/cella); a többi tipográfia 2×2. Ezek a renderparaméterek nem kerülnek az importdefiníciókba.

A négy korábban megmaradt kép kulcsa C01, C02, MR001, R002. A busz korábbi nézetlapja alapreferencia, nem már legenerált buszmorph. A felhasználó végzi a Higgsfield importot, generálást és képtársítást. A tényleges új @azonosítókat a képgeneráló- és videópromptokhoz kell kötni; a régi nevek érvényességét egy új import után nem feltételezzük.

A korábbi pilot/film/batch listák az [archive](../archive/README.md) könyvtárban vannak. Az [MR021 egyszeri kiegészítő](../additions/MR021_RATING_CARD_ONLY_IMPORT.md) csak a régi, MR021 nélküli állapothoz kell, nem az aktuális Full vagy Morphs lista mellé.

Az eredeti 164 képprompt részletellenőrzése a [jegyzőkönyvben](../../../04_tracking/IMAGE_PROMPT_DETAIL_REVIEW.md) található. Ehhez most hét új tipográfiai lap társult, tehát 171 aktív képprompt van a hét opcionális térképpel együtt. A [tipográfiai jegyzék](../../../02_library/typography/README.md) megadja a feliratokat és használati helyüket. Az új képek csak a Higgsfield felületén készülnek.
