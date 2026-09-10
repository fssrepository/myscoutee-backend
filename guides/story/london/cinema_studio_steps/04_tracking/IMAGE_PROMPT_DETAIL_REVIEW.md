# Teljes képprompt-részletellenőrzés — 2026-09-10

164 aktív képprompt: 31 karakter, 21 jelen-világ, 30 emlék/klinikai/éttermi világ, 7 opcionális térkép és 75 morph. **80 prompt bővült vagy kapott célzott javítást; 84 meglévő részletes prompt tartalma megmaradt.** Ez a szövegek ellenőrzése, nem a generált képek elfogadása.

## Konkrét változások

- A világok mind a 63 eredeti nézete saját térbeli és anyagleírást kapott: sarkok, küszöbök, támaszok, üvegkeretek, járművek külön mélysége és tiszta útvonalak. Az A/B/C lapon ismételt nézetek szövege egyezik.
- Kilenc emlékcsalád 81 eredeti nézete részletesebb lett: szereplők helye, ülés- és talajkontaktus, kéz–tárgy kapcsolat, ajtók, bútorok és valós helyen lévő dokumentumok. A T01 étterem tizenkét külön részletnézete már részletes volt, megmaradt.
- Mind a 31 karakter külön ruha-/haj-/arcrészletet kapott, pontos front/hát/portré feladatokkal. Megszűnt a nulla hézag mellett kért elválasztóvonal, és tisztázódott, hogy egy identitás három nézete jelenik meg.
- Javítva: profilkor-váltás egyetlen állóképen két időpont helyett egy konkrét szerkesztett állapot; hálószobai egymásra úsztatott lakók helyett egy jelen lévő személy; tárgyalt ingatlanok lebegő képinzertje helyett valódi papír/fotó az asztalon.
- A világok általános morphutasításai csak a cellába ténylegesen kért átalakulásra vonatkoznak. Az ép kiinduló és kész célállapotot nem írja felül a globális köztesállapot-kérés. A W01 célbejárat leírása a mély központi boltívet és oldaltámaszokat pontosítja.
- CM001: a térd alá komponált képen nem egy képen kívüli cipő lett az ellenőrizendő horgony; látható polcsarok és ajtófélfa kapcsolja a négy állapotot.

## Morphok és képformátum

A 75 morph négy konkrét állapota és anyagprofilja a [morph-állapotellenőrzéssel](MORPH_FOUR_STATE_REVIEW.md) együtt szerepel a gépi jegyzékben. Megmaradtak az erősen eltérő sziluettek, nyitott köztes térfogatok, részletes anyagátalakulások és a tényleges videó saját mozgó kamerája. A világ/emléklapok külön lefedési nézetek; a morphlapok egymást követő anyagállapotok. A hét térkép továbbra is opcionális szerkezeti terv.

Minden lap 3840×2160. Karakter: 1×3, cellánként 1280×2160. Világ/emlék/morph/térkép: 2×2, cellánként 1920×1080. Minden promptban explicit esernyőtilalom. A jelen-városi emberek már a képen tizedes ratingkártyát kapnak; a stúdió-, emlék- és klinikai kivételek megmaradtak.

## Import és következő használat

A teljes import 157 egyedi kulcsot és nevet tartalmaz, pontosan a három részimport tartalmával. A promptok részletei nem kerültek az importfájlokba. A felület 54-es importszáma alapján nem készült pótlóimport: a felhasználó jelezte, hogy a korábbi elemek törlése nem volt teljes, és kérte a névsor figyelmen kívül hagyását.

Generálás a Higgsfield felületén történik. A `REFERENCE SETUP INCOMPLETE` / `@UNBOUND_…` jelzésű promptokhoz továbbra is a megfelelő tényleges Element-hivatkozás szükséges. Új import után a régi @nevek érvényességét nem igazolja a helyi szövegellenőrzés. A jelen ellenőrzés nem indított képet vagy videót.

## Fájlonkénti ellenőrzés

| Prompt | Eredmény | Szavak |
|---|---|---|
| [C01_PROTAGONIST.txt](../02_library/characters/C01_PROTAGONIST.txt) | Bővítve / javítva | 807 |
| [C02_SOHO_WOMAN.txt](../02_library/characters/C02_SOHO_WOMAN.txt) | Bővítve / javítva | 787 |
| [C03_POLICEWOMAN.txt](../02_library/characters/C03_POLICEWOMAN.txt) | Bővítve / javítva | 781 |
| [C04_APPOINTED_LAWYER.txt](../02_library/characters/C04_APPOINTED_LAWYER.txt) | Bővítve / javítva | 764 |
| [C05_FINAL_NURSE.txt](../02_library/characters/C05_FINAL_NURSE.txt) | Bővítve / javítva | 791 |
| [C06_SHARED_HOUSE_SUBSTITUTE_SNORING_HOUSEMATE.txt](../02_library/characters/C06_SHARED_HOUSE_SUBSTITUTE_SNORING_HOUSEMATE.txt) | Bővítve / javítva | 818 |
| [C07_FX_MORTGAGE_HOUSEMATE.txt](../02_library/characters/C07_FX_MORTGAGE_HOUSEMATE.txt) | Bővítve / javítva | 805 |
| [C08_FX_MORTGAGE_SPOUSE.txt](../02_library/characters/C08_FX_MORTGAGE_SPOUSE.txt) | Bővítve / javítva | 795 |
| [C09_FX_MORTGAGE_CHILD.txt](../02_library/characters/C09_FX_MORTGAGE_CHILD.txt) | Bővítve / javítva | 785 |
| [C10_BEGINNER_DANCE_WOMAN.txt](../02_library/characters/C10_BEGINNER_DANCE_WOMAN.txt) | Bővítve / javítva | 808 |
| [C11_RUSSIAN_TRANSIT_PASSENGER.txt](../02_library/characters/C11_RUSSIAN_TRANSIT_PASSENGER.txt) | Bővítve / javítva | 799 |
| [C12_AGRA_BUS_WOMAN.txt](../02_library/characters/C12_AGRA_BUS_WOMAN.txt) | Bővítve / javítva | 803 |
| [C13_SUDANESE_TRAVELER_MAN.txt](../02_library/characters/C13_SUDANESE_TRAVELER_MAN.txt) | Bővítve / javítva | 806 |
| [C14_SUDANESE_TRAVELER_WOMAN.txt](../02_library/characters/C14_SUDANESE_TRAVELER_WOMAN.txt) | Bővítve / javítva | 794 |
| [C15_CAIRO_TAXI_DRIVER.txt](../02_library/characters/C15_CAIRO_TAXI_DRIVER.txt) | Bővítve / javítva | 799 |
| [C16_BALLOON_LOCAL_HELPER_MAN.txt](../02_library/characters/C16_BALLOON_LOCAL_HELPER_MAN.txt) | Bővítve / javítva | 789 |
| [C17_BALLOON_LOCAL_HELPER_WOMAN.txt](../02_library/characters/C17_BALLOON_LOCAL_HELPER_WOMAN.txt) | Bővítve / javítva | 794 |
| [C18_BARMOUTH_ROAD_TRIP_DRIVER_COMPANION.txt](../02_library/characters/C18_BARMOUTH_ROAD_TRIP_DRIVER_COMPANION.txt) | Bővítve / javítva | 779 |
| [C19_BARMOUTH_ROAD_TRIP_COMPANION_A.txt](../02_library/characters/C19_BARMOUTH_ROAD_TRIP_COMPANION_A.txt) | Bővítve / javítva | 772 |
| [C20_BARMOUTH_ROAD_TRIP_COMPANION_B.txt](../02_library/characters/C20_BARMOUTH_ROAD_TRIP_COMPANION_B.txt) | Bővítve / javítva | 771 |
| [C21_BARMOUTH_ROAD_TRIP_COMPANION_C.txt](../02_library/characters/C21_BARMOUTH_ROAD_TRIP_COMPANION_C.txt) | Bővítve / javítva | 769 |
| [C22_ACCOUNTANT.txt](../02_library/characters/C22_ACCOUNTANT.txt) | Bővítve / javítva | 791 |
| [C23_ADMIN_COLLEAGUE_A.txt](../02_library/characters/C23_ADMIN_COLLEAGUE_A.txt) | Bővítve / javítva | 767 |
| [C24_ADMIN_COLLEAGUE_B.txt](../02_library/characters/C24_ADMIN_COLLEAGUE_B.txt) | Bővítve / javítva | 775 |
| [C25_SEARCH_OFFICER_MALE.txt](../02_library/characters/C25_SEARCH_OFFICER_MALE.txt) | Bővítve / javítva | 793 |
| [C26_DEFENCE_OFFICE_SUBSTITUTE.txt](../02_library/characters/C26_DEFENCE_OFFICE_SUBSTITUTE.txt) | Bővítve / javítva | 798 |
| [C27_JUDGE.txt](../02_library/characters/C27_JUDGE.txt) | Bővítve / javítva | 808 |
| [C28_FORENSIC_EXPERT_A.txt](../02_library/characters/C28_FORENSIC_EXPERT_A.txt) | Bővítve / javítva | 780 |
| [C29_FORENSIC_EXPERT_B.txt](../02_library/characters/C29_FORENSIC_EXPERT_B.txt) | Bővítve / javítva | 793 |
| [C30_COURT_CLERK.txt](../02_library/characters/C30_COURT_CLERK.txt) | Bővítve / javítva | 781 |
| [C31_ANONYMOUS_FICTIONAL_POLITICAL_FIGURE.txt](../02_library/characters/C31_ANONYMOUS_FICTIONAL_POLITICAL_FIGURE.txt) | Bővítve / javítva | 835 |
| [MR001_ST_PAULS_TO_ST_STEPHENS_2X2.txt](../02_library/morphs/buildings/MR001_ST_PAULS_TO_ST_STEPHENS_2X2.txt) | Részletek ellenőrizve, megtartva | 2885 |
| [MR002_FACADE_RELIEF_TO_SCULPTED_SUPPORT_2X2.txt](../02_library/morphs/buildings/MR002_FACADE_RELIEF_TO_SCULPTED_SUPPORT_2X2.txt) | Részletek ellenőrizve, megtartva | 2146 |
| [MR003_FACADE_WINDOW_CAPITAL_AND_CORNICE_2X2.txt](../02_library/morphs/buildings/MR003_FACADE_WINDOW_CAPITAL_AND_CORNICE_2X2.txt) | Részletek ellenőrizve, megtartva | 2254 |
| [MR005_BRICK_COURSES_TO_CARVED_ARCH_2X2.txt](../02_library/morphs/buildings/MR005_BRICK_COURSES_TO_CARVED_ARCH_2X2.txt) | Részletek ellenőrizve, megtartva | 1832 |
| [MR006_STONE_THRESHOLD_TO_SUPPORTED_TIMBER_FLOOR_2X2.txt](../02_library/morphs/buildings/MR006_STONE_THRESHOLD_TO_SUPPORTED_TIMBER_FLOOR_2X2.txt) | Részletek ellenőrizve, megtartva | 1923 |
| [MR009_BALCONY_SCROLL_TO_SIDEWAYS_STAIR_2X2.txt](../02_library/morphs/buildings/MR009_BALCONY_SCROLL_TO_SIDEWAYS_STAIR_2X2.txt) | Részletek ellenőrizve, megtartva | 1800 |
| [MR011_SLATE_ROOF_TO_CURVED_GLAZING_2X2.txt](../02_library/morphs/buildings/MR011_SLATE_ROOF_TO_CURVED_GLAZING_2X2.txt) | Részletek ellenőrizve, megtartva | 2020 |
| [MR012_CHIMNEY_SHAFTS_TO_SPIRAL_CROWNS_2X2.txt](../02_library/morphs/buildings/MR012_CHIMNEY_SHAFTS_TO_SPIRAL_CROWNS_2X2.txt) | Részletek ellenőrizve, megtartva | 1803 |
| [MR019_PAVING_AND_GUTTER_TO_STREET_TERRACE_2X2.txt](../02_library/morphs/buildings/MR019_PAVING_AND_GUTTER_TO_STREET_TERRACE_2X2.txt) | Részletek ellenőrizve, megtartva | 1931 |
| [R005_ST_PAULS_COMPLETE_SOURCE_BUILDING.txt](../02_library/morphs/buildings/R005_ST_PAULS_COMPLETE_SOURCE_BUILDING.txt) | Részletek ellenőrizve, megtartva | 1964 |
| [R006_ST_STEPHENS_COMPLETE_DESTINATION_BUILDING.txt](../02_library/morphs/buildings/R006_ST_STEPHENS_COMPLETE_DESTINATION_BUILDING.txt) | Részletek ellenőrizve, megtartva | 2037 |
| [R008_CAFE_OPENING_AND_FURNITURE_CONSTRUCTION_DETAILS.txt](../02_library/morphs/buildings/R008_CAFE_OPENING_AND_FURNITURE_CONSTRUCTION_DETAILS.txt) | Részletek ellenőrizve, megtartva | 2680 |
| [R009_FANLIGHT_TO_CANOPY_JOINT_STUDY_FOR_THE_EXTEND.txt](../02_library/morphs/buildings/R009_FANLIGHT_TO_CANOPY_JOINT_STUDY_FOR_THE_EXTEND.txt) | Részletek ellenőrizve, megtartva | 2025 |
| [R014_ORIGINAL_LONDON_CAFE_WINDOW_BEFORE_FRACTURE.txt](../02_library/morphs/buildings/R014_ORIGINAL_LONDON_CAFE_WINDOW_BEFORE_FRACTURE.txt) | Részletek ellenőrizve, megtartva | 2893 |
| [R016_SOLID_LONDON_BRICK_AND_PEST_CARVED_STONE_CORRESPONDENCE.txt](../02_library/morphs/buildings/R016_SOLID_LONDON_BRICK_AND_PEST_CARVED_STONE_CORRESPONDENCE.txt) | Részletek ellenőrizve, megtartva | 2047 |
| [R017_STONE_SILL_WET_PAVING_AND_SUPPORTED_TIMBER_THRESHOLD.txt](../02_library/morphs/buildings/R017_STONE_SILL_WET_PAVING_AND_SUPPORTED_TIMBER_THRESHOLD.txt) | Részletek ellenőrizve, megtartva | 2138 |
| [R021_RESTAURANT_REAR_DOORS_AND_DEPTH_RELATIONSHIPS.txt](../02_library/morphs/buildings/R021_RESTAURANT_REAR_DOORS_AND_DEPTH_RELATIONSHIPS.txt) | Részletek ellenőrizve, megtartva | 2108 |
| [R025_ORIGINAL_LONDON_ROOF_AND_CHIMNEY_VOLUMES.txt](../02_library/morphs/buildings/R025_ORIGINAL_LONDON_ROOF_AND_CHIMNEY_VOLUMES.txt) | Részletek ellenőrizve, megtartva | 2233 |
| [R026_TARGET_ROOF_GLAZING_STONE_CORBELS_AND_CHIMNEY_CROWNS.txt](../02_library/morphs/buildings/R026_TARGET_ROOF_GLAZING_STONE_CORBELS_AND_CHIMNEY_CROWNS.txt) | Részletek ellenőrizve, megtartva | 2085 |
| [R028_ORIGINAL_ARCADE_ARCH_AND_FANLIGHT.txt](../02_library/morphs/buildings/R028_ORIGINAL_ARCADE_ARCH_AND_FANLIGHT.txt) | Részletek ellenőrizve, megtartva | 2237 |
| [R029_FULL_SUPPORTED_CANOPY_DESTINATION.txt](../02_library/morphs/buildings/R029_FULL_SUPPORTED_CANOPY_DESTINATION.txt) | Részletek ellenőrizve, megtartva | 2095 |
| [R030_DEEP_GALLERY_THROUGH_THE_UNCHANGED_THRESHOLD.txt](../02_library/morphs/buildings/R030_DEEP_GALLERY_THROUGH_THE_UNCHANGED_THRESHOLD.txt) | Részletek ellenőrizve, megtartva | 1943 |
| [R031_LONDON_STATION_SOURCE_EXTERIOR_AND_IRON_STRUCTURE.txt](../02_library/morphs/buildings/R031_LONDON_STATION_SOURCE_EXTERIOR_AND_IRON_STRUCTURE.txt) | Részletek ellenőrizve, megtartva | 2101 |
| [R032_NYUGATI_STATION_DESTINATION_AND_ROOF_JOINTS.txt](../02_library/morphs/buildings/R032_NYUGATI_STATION_DESTINATION_AND_ROOF_JOINTS.txt) | Részletek ellenőrizve, megtartva | 2074 |
| [R033_HUNGARIAN_STATE_OPERA_TARGET_FACADE_AND_ENTRY_DEPTH.txt](../02_library/morphs/buildings/R033_HUNGARIAN_STATE_OPERA_TARGET_FACADE_AND_ENTRY_DEPTH.txt) | Részletek ellenőrizve, megtartva | 1994 |
| [R034_TOWER_BRIDGE_SOURCE_STRUCTURE.txt](../02_library/morphs/buildings/R034_TOWER_BRIDGE_SOURCE_STRUCTURE.txt) | Részletek ellenőrizve, megtartva | 2001 |
| [R035_SZECHENYI_CHAIN_BRIDGE_DESTINATION_STRUCTURE.txt](../02_library/morphs/buildings/R035_SZECHENYI_CHAIN_BRIDGE_DESTINATION_STRUCTURE.txt) | Részletek ellenőrizve, megtartva | 1983 |
| [R036_LONDON_EYE_AND_CONNECTED_SOUTH_BANK_DEPTH.txt](../02_library/morphs/buildings/R036_LONDON_EYE_AND_CONNECTED_SOUTH_BANK_DEPTH.txt) | Részletek ellenőrizve, megtartva | 2096 |
| [R037_GREAT_MARKET_HALL_ROOF_AND_BRICK_SOURCE_VOLUME.txt](../02_library/morphs/buildings/R037_GREAT_MARKET_HALL_ROOF_AND_BRICK_SOURCE_VOLUME.txt) | Részletek ellenőrizve, megtartva | 2097 |
| [R038_BALNA_CURVED_GLASS_TARGET_VOLUME.txt](../02_library/morphs/buildings/R038_BALNA_CURVED_GLASS_TARGET_VOLUME.txt) | Részletek ellenőrizve, megtartva | 2084 |
| [R039_WESTMINSTER_AND_PARLIAMENT_SQUARE_LONDON_SOURCE.txt](../02_library/morphs/buildings/R039_WESTMINSTER_AND_PARLIAMENT_SQUARE_LONDON_SOURCE.txt) | Részletek ellenőrizve, megtartva | 2022 |
| [R040_HUNGARIAN_PARLIAMENT_COMPLETE_DESTINATION_SILHOUETTE.txt](../02_library/morphs/buildings/R040_HUNGARIAN_PARLIAMENT_COMPLETE_DESTINATION_SILHOUETTE.txt) | Részletek ellenőrizve, megtartva | 1977 |
| [R041_GRESHAM_PALACE_FRONTAGE_AND_DEEP_STONE_DETAILS.txt](../02_library/morphs/buildings/R041_GRESHAM_PALACE_FRONTAGE_AND_DEEP_STONE_DETAILS.txt) | Részletek ellenőrizve, megtartva | 2078 |
| [R042_NEW_YORK_PALACE_HISTORIC_EXTERIOR_WITH_OCCUPIED_BAY_DEPTH.txt](../02_library/morphs/buildings/R042_NEW_YORK_PALACE_HISTORIC_EXTERIOR_WITH_OCCUPIED_BAY_DEPTH.txt) | Részletek ellenőrizve, megtartva | 1983 |
| [R054_BIG_BEN_ELIZABETH_TOWER_LONDON_SOURCE.txt](../02_library/morphs/buildings/R054_BIG_BEN_ELIZABETH_TOWER_LONDON_SOURCE.txt) | Részletek ellenőrizve, megtartva | 2009 |
| [R055_WESTMINSTER_ABBEY_LONDON_SOURCE.txt](../02_library/morphs/buildings/R055_WESTMINSTER_ABBEY_LONDON_SOURCE.txt) | Részletek ellenőrizve, megtartva | 2010 |
| [R056_FISHERMANS_BASTION_DESTINATION.txt](../02_library/morphs/buildings/R056_FISHERMANS_BASTION_DESTINATION.txt) | Részletek ellenőrizve, megtartva | 1916 |
| [CM001_APPOINTED_LAWYER_TO_OFFICE_SUBSTITUTE_2X2.txt](../02_library/morphs/characters/CM001_APPOINTED_LAWYER_TO_OFFICE_SUBSTITUTE_2X2.txt) | Bővítve / javítva | 1680 |
| [CM002_SOHO_WOMAN_TO_BEGINNER_DANCE_WOMAN_2X2.txt](../02_library/morphs/characters/CM002_SOHO_WOMAN_TO_BEGINNER_DANCE_WOMAN_2X2.txt) | Részletek ellenőrizve, megtartva | 1577 |
| [CM003_SNORING_HOUSEMATE_TO_MORTGAGE_HOUSEMATE_2X2.txt](../02_library/morphs/characters/CM003_SNORING_HOUSEMATE_TO_MORTGAGE_HOUSEMATE_2X2.txt) | Részletek ellenőrizve, megtartva | 1543 |
| [CM004_TRANSIT_HELPER_TO_CAIRO_TRAVELER_2X2.txt](../02_library/morphs/characters/CM004_TRANSIT_HELPER_TO_CAIRO_TRAVELER_2X2.txt) | Részletek ellenőrizve, megtartva | 1589 |
| [CM005_ADMIN_COLLEAGUE_A_TO_B_2X2.txt](../02_library/morphs/characters/CM005_ADMIN_COLLEAGUE_A_TO_B_2X2.txt) | Részletek ellenőrizve, megtartva | 1584 |
| [CM006_FORENSIC_EXPERT_A_TO_B_2X2.txt](../02_library/morphs/characters/CM006_FORENSIC_EXPERT_A_TO_B_2X2.txt) | Részletek ellenőrizve, megtartva | 1523 |
| [MR004_WINDOW_GLASS_TO_PENDANT_SHADE_2X2.txt](../02_library/morphs/objects/MR004_WINDOW_GLASS_TO_PENDANT_SHADE_2X2.txt) | Részletek ellenőrizve, megtartva | 1971 |
| [MR007_BENCH_TO_CURVED_FLOOR_BORDER_2X2.txt](../02_library/morphs/objects/MR007_BENCH_TO_CURVED_FLOOR_BORDER_2X2.txt) | Részletek ellenőrizve, megtartva | 1897 |
| [MR008_WINDOW_FITTINGS_TO_PENDANT_STEM_2X2.txt](../02_library/morphs/objects/MR008_WINDOW_FITTINGS_TO_PENDANT_STEM_2X2.txt) | Részletek ellenőrizve, megtartva | 1829 |
| [MR010_ENGLISH_SIGN_TO_KAVE_LETTERING_2X2.txt](../02_library/morphs/objects/MR010_ENGLISH_SIGN_TO_KAVE_LETTERING_2X2.txt) | Részletek ellenőrizve, megtartva | 1872 |
| [MR013_ENTRANCE_RAIL_TO_TRANSIT_GATE_2X2.txt](../02_library/morphs/objects/MR013_ENTRANCE_RAIL_TO_TRANSIT_GATE_2X2.txt) | Részletek ellenőrizve, megtartva | 1828 |
| [MR014_BENCH_AND_CANOPY_TO_BUS_SEATING_2X2.txt](../02_library/morphs/objects/MR014_BENCH_AND_CANOPY_TO_BUS_SEATING_2X2.txt) | Részletek ellenőrizve, megtartva | 1992 |
| [MR015_CANOPY_TO_BALLOON_ENVELOPE_2X2.txt](../02_library/morphs/objects/MR015_CANOPY_TO_BALLOON_ENVELOPE_2X2.txt) | Részletek ellenőrizve, megtartva | 2019 |
| [MR016_CROP_STALKS_TO_RAIL_SLEEPERS_2X2.txt](../02_library/morphs/objects/MR016_CROP_STALKS_TO_RAIL_SLEEPERS_2X2.txt) | Részletek ellenőrizve, megtartva | 1875 |
| [MR017_CABINET_TO_DESK_AND_CHAIR_2X2.txt](../02_library/morphs/objects/MR017_CABINET_TO_DESK_AND_CHAIR_2X2.txt) | Részletek ellenőrizve, megtartva | 1959 |
| [MR018_HEARING_BENCH_TO_DOCUMENT_SHELVING_2X2.txt](../02_library/morphs/objects/MR018_HEARING_BENCH_TO_DOCUMENT_SHELVING_2X2.txt) | Részletek ellenőrizve, megtartva | 1808 |
| [MR020_ROPE_FIBRES_TO_SHEET_HEM_2X2.txt](../02_library/morphs/objects/MR020_ROPE_FIBRES_TO_SHEET_HEM_2X2.txt) | Részletek ellenőrizve, megtartva | 1840 |
| [MR021_RATING_CARD_6_2_TO_9_2_MATERIAL_MORPH_2X2.txt](../02_library/morphs/objects/MR021_RATING_CARD_6_2_TO_9_2_MATERIAL_MORPH_2X2.txt) | Részletek ellenőrizve, megtartva | 1713 |
| [R002_THE_SAME_RED_LONDON_BUS_FROM_USEFUL_ANGLES.txt](../02_library/morphs/objects/R002_THE_SAME_RED_LONDON_BUS_FROM_USEFUL_ANGLES.txt) | Részletek ellenőrizve, megtartva | 2081 |
| [R003_BLACK_LONDON_TAXI.txt](../02_library/morphs/objects/R003_BLACK_LONDON_TAXI.txt) | Részletek ellenőrizve, megtartva | 1984 |
| [R004_YELLOW_BUDAPEST_TRAM.txt](../02_library/morphs/objects/R004_YELLOW_BUDAPEST_TRAM.txt) | Részletek ellenőrizve, megtartva | 2067 |
| [R010_WINGED_STATUE_PLINTH_AND_CONTACT_DETAIL.txt](../02_library/morphs/objects/R010_WINGED_STATUE_PLINTH_AND_CONTACT_DETAIL.txt) | Részletek ellenőrizve, megtartva | 2066 |
| [R013_RED_BUS_LOWER_DECK_PASSAGE_AND_OPEN_DOOR_GEOMETRY.txt](../02_library/morphs/objects/R013_RED_BUS_LOWER_DECK_PASSAGE_AND_OPEN_DOOR_GEOMETRY.txt) | Részletek ellenőrizve, megtartva | 2130 |
| [R015_GLASS_SOURCE_THICKNESS_AND_DESTINATION_PENDANT_SHADES.txt](../02_library/morphs/objects/R015_GLASS_SOURCE_THICKNESS_AND_DESTINATION_PENDANT_SHADES.txt) | Részletek ellenőrizve, megtartva | 2185 |
| [R018_LONDON_TIMBER_BENCH_AND_CURVED_FLOOR_BORDER.txt](../02_library/morphs/objects/R018_LONDON_TIMBER_BENCH_AND_CURVED_FLOOR_BORDER.txt) | Részletek ellenőrizve, megtartva | 2111 |
| [R019_ACCEPTED_RESTAURANT_TABLE_AND_CHAIR_FROM_OUTSIDE.txt](../02_library/morphs/objects/R019_ACCEPTED_RESTAURANT_TABLE_AND_CHAIR_FROM_OUTSIDE.txt) | Részletek ellenőrizve, megtartva | 1917 |
| [R020_CUP_HAND_CONTACT_AND_TABLETOP_DEPTH.txt](../02_library/morphs/objects/R020_CUP_HAND_CONTACT_AND_TABLETOP_DEPTH.txt) | Részletek ellenőrizve, megtartva | 1970 |
| [R022_STREET_LIGHT_FITTINGS_AND_RESTAURANT_PENDANT_CONNECTIONS.txt](../02_library/morphs/objects/R022_STREET_LIGHT_FITTINGS_AND_RESTAURANT_PENDANT_CONNECTIONS.txt) | Részletek ellenőrizve, megtartva | 2043 |
| [R023_BALCONY_SCROLL_AND_SIDEWAYS_STAIR_STRUCTURAL_PARTS.txt](../02_library/morphs/objects/R023_BALCONY_SCROLL_AND_SIDEWAYS_STAIR_STRUCTURAL_PARTS.txt) | Részletek ellenőrizve, megtartva | 2014 |
| [R024_MOUNTED_ENGLISH_CAFE_SIGN_AND_HUNGARIAN_DESTINATION_SIGN.txt](../02_library/morphs/objects/R024_MOUNTED_ENGLISH_CAFE_SIGN_AND_HUNGARIAN_DESTINATION_SIGN.txt) | Részletek ellenőrizve, megtartva | 2087 |
| [R043_LONDON_ENTRANCE_RAIL_AND_REMEMBERED_TRANSIT_GATE.txt](../02_library/morphs/objects/R043_LONDON_ENTRANCE_RAIL_AND_REMEMBERED_TRANSIT_GATE.txt) | Részletek ellenőrizve, megtartva | 2042 |
| [R044_REMEMBERED_BUS_SEATS_AISLE_AND_CANOPY_POST_CORRESPONDENCE.txt](../02_library/morphs/objects/R044_REMEMBERED_BUS_SEATS_AISLE_AND_CANOPY_POST_CORRESPONDENCE.txt) | Részletek ellenőrizve, megtartva | 2207 |
| [R045_CAIRO_TAXI_CABIN_REAR_BENCH_AND_LUGGAGE_CONTACT.txt](../02_library/morphs/objects/R045_CAIRO_TAXI_CABIN_REAR_BENCH_AND_LUGGAGE_CONTACT.txt) | Részletek ellenőrizve, megtartva | 2066 |
| [R046_CANOPY_AND_BALLOON_ENVELOPE_RIGGING_AND_BASKET_INTERFACES.txt](../02_library/morphs/objects/R046_CANOPY_AND_BALLOON_ENVELOPE_RIGGING_AND_BASKET_INTERFACES.txt) | Részletek ellenőrizve, megtartva | 2043 |
| [R047_PAVING_SOIL_PAPRIKA_CORN_ROOTS_AND_RAIL_SLEEPERS.txt](../02_library/morphs/objects/R047_PAVING_SOIL_PAPRIKA_CORN_ROOTS_AND_RAIL_SLEEPERS.txt) | Részletek ellenőrizve, megtartva | 2090 |
| [R048_ADMINISTRATIVE_DESK_ACTUAL_DOCUMENTS_AND_DEVICE_GEOMETRY.txt](../02_library/morphs/objects/R048_ADMINISTRATIVE_DESK_ACTUAL_DOCUMENTS_AND_DEVICE_GEOMETRY.txt) | Részletek ellenőrizve, megtartva | 1988 |
| [R049_CABINET_FINGERPRINT_DESK_AND_CHAIR_CONSTRUCTION.txt](../02_library/morphs/objects/R049_CABINET_FINGERPRINT_DESK_AND_CHAIR_CONSTRUCTION.txt) | Részletek ellenőrizve, megtartva | 2172 |
| [R050_COURT_FILE_COMPARTMENTS_AND_RETAINED_DEVICE_SUPPORTS.txt](../02_library/morphs/objects/R050_COURT_FILE_COMPARTMENTS_AND_RETAINED_DEVICE_SUPPORTS.txt) | Részletek ellenőrizve, megtartva | 2022 |
| [MAP01_WALK_PLAN.txt](../02_library/worlds/maps/MAP01_WALK_PLAN.txt) | Részletek ellenőrizve, megtartva | 1091 |
| [MAP02_WALK_PLAN.txt](../02_library/worlds/maps/MAP02_WALK_PLAN.txt) | Részletek ellenőrizve, megtartva | 1071 |
| [MAP03_WALK_PLAN.txt](../02_library/worlds/maps/MAP03_WALK_PLAN.txt) | Részletek ellenőrizve, megtartva | 1033 |
| [MAP04_WALK_PLAN.txt](../02_library/worlds/maps/MAP04_WALK_PLAN.txt) | Részletek ellenőrizve, megtartva | 1041 |
| [MAP05_WALK_PLAN.txt](../02_library/worlds/maps/MAP05_WALK_PLAN.txt) | Részletek ellenőrizve, megtartva | 1058 |
| [MAP06_WALK_PLAN.txt](../02_library/worlds/maps/MAP06_WALK_PLAN.txt) | Részletek ellenőrizve, megtartva | 1062 |
| [MAP07_WALK_PLAN.txt](../02_library/worlds/maps/MAP07_WALK_PLAN.txt) | Részletek ellenőrizve, megtartva | 1075 |
| [HRW07_CLINICAL_REALITY_A.txt](../02_library/worlds/memories/HRW07_CLINICAL_REALITY_A.txt) | Bővítve / javítva | 1118 |
| [HRW07_CLINICAL_REALITY_B.txt](../02_library/worlds/memories/HRW07_CLINICAL_REALITY_B.txt) | Bővítve / javítva | 1175 |
| [HRW07_CLINICAL_REALITY_C.txt](../02_library/worlds/memories/HRW07_CLINICAL_REALITY_C.txt) | Bővítve / javítva | 1202 |
| [MW01_LONDON_SOCIAL_A.txt](../02_library/worlds/memories/MW01_LONDON_SOCIAL_A.txt) | Bővítve / javítva | 1657 |
| [MW01_LONDON_SOCIAL_B.txt](../02_library/worlds/memories/MW01_LONDON_SOCIAL_B.txt) | Bővítve / javítva | 1738 |
| [MW01_LONDON_SOCIAL_C.txt](../02_library/worlds/memories/MW01_LONDON_SOCIAL_C.txt) | Bővítve / javítva | 1735 |
| [MW02_GLOBAL_ROUTES_A.txt](../02_library/worlds/memories/MW02_GLOBAL_ROUTES_A.txt) | Bővítve / javítva | 1746 |
| [MW02_GLOBAL_ROUTES_B.txt](../02_library/worlds/memories/MW02_GLOBAL_ROUTES_B.txt) | Bővítve / javítva | 1784 |
| [MW02_GLOBAL_ROUTES_C.txt](../02_library/worlds/memories/MW02_GLOBAL_ROUTES_C.txt) | Bővítve / javítva | 1771 |
| [MW03_WORK_RULE_CHANGE_ADMIN_A.txt](../02_library/worlds/memories/MW03_WORK_RULE_CHANGE_ADMIN_A.txt) | Bővítve / javítva | 1518 |
| [MW03_WORK_RULE_CHANGE_ADMIN_B.txt](../02_library/worlds/memories/MW03_WORK_RULE_CHANGE_ADMIN_B.txt) | Bővítve / javítva | 1540 |
| [MW03_WORK_RULE_CHANGE_ADMIN_C.txt](../02_library/worlds/memories/MW03_WORK_RULE_CHANGE_ADMIN_C.txt) | Bővítve / javítva | 1540 |
| [MW04_POLICE_DEFENCE_A.txt](../02_library/worlds/memories/MW04_POLICE_DEFENCE_A.txt) | Bővítve / javítva | 1533 |
| [MW04_POLICE_DEFENCE_B.txt](../02_library/worlds/memories/MW04_POLICE_DEFENCE_B.txt) | Bővítve / javítva | 1564 |
| [MW04_POLICE_DEFENCE_C.txt](../02_library/worlds/memories/MW04_POLICE_DEFENCE_C.txt) | Bővítve / javítva | 1584 |
| [MW05_COURT_FILE_A.txt](../02_library/worlds/memories/MW05_COURT_FILE_A.txt) | Bővítve / javítva | 1591 |
| [MW05_COURT_FILE_B.txt](../02_library/worlds/memories/MW05_COURT_FILE_B.txt) | Bővítve / javítva | 1652 |
| [MW05_COURT_FILE_C.txt](../02_library/worlds/memories/MW05_COURT_FILE_C.txt) | Bővítve / javítva | 1656 |
| [MW06_HUMAN_COUNTERMEMORIES_A.txt](../02_library/worlds/memories/MW06_HUMAN_COUNTERMEMORIES_A.txt) | Bővítve / javítva | 1644 |
| [MW06_HUMAN_COUNTERMEMORIES_B.txt](../02_library/worlds/memories/MW06_HUMAN_COUNTERMEMORIES_B.txt) | Bővítve / javítva | 1711 |
| [MW06_HUMAN_COUNTERMEMORIES_C.txt](../02_library/worlds/memories/MW06_HUMAN_COUNTERMEMORIES_C.txt) | Bővítve / javítva | 1721 |
| [MWP01_ROUTES_ROOMS_DOCUMENTS_A.txt](../02_library/worlds/memories/MWP01_ROUTES_ROOMS_DOCUMENTS_A.txt) | Bővítve / javítva | 1389 |
| [MWP01_ROUTES_ROOMS_DOCUMENTS_B.txt](../02_library/worlds/memories/MWP01_ROUTES_ROOMS_DOCUMENTS_B.txt) | Bővítve / javítva | 1420 |
| [MWP01_ROUTES_ROOMS_DOCUMENTS_C.txt](../02_library/worlds/memories/MWP01_ROUTES_ROOMS_DOCUMENTS_C.txt) | Bővítve / javítva | 1430 |
| [MWP02_SYSTEM_TIME_REVERSALS_A.txt](../02_library/worlds/memories/MWP02_SYSTEM_TIME_REVERSALS_A.txt) | Bővítve / javítva | 1470 |
| [MWP02_SYSTEM_TIME_REVERSALS_B.txt](../02_library/worlds/memories/MWP02_SYSTEM_TIME_REVERSALS_B.txt) | Bővítve / javítva | 1554 |
| [MWP02_SYSTEM_TIME_REVERSALS_C.txt](../02_library/worlds/memories/MWP02_SYSTEM_TIME_REVERSALS_C.txt) | Bővítve / javítva | 1564 |
| [T01_SOHO_RESTAURANT_SOURCE_A.txt](../02_library/worlds/memories/T01_SOHO_RESTAURANT_SOURCE_A.txt) | Részletek ellenőrizve, megtartva | 1215 |
| [T01_SOHO_RESTAURANT_SOURCE_B.txt](../02_library/worlds/memories/T01_SOHO_RESTAURANT_SOURCE_B.txt) | Részletek ellenőrizve, megtartva | 1166 |
| [T01_SOHO_RESTAURANT_SOURCE_C.txt](../02_library/worlds/memories/T01_SOHO_RESTAURANT_SOURCE_C.txt) | Részletek ellenőrizve, megtartva | 1183 |
| [W01_MAIN_WORLD_A.txt](../02_library/worlds/real/W01_MAIN_WORLD_A.txt) | Bővítve / javítva | 4697 |
| [W01_MAIN_WORLD_B.txt](../02_library/worlds/real/W01_MAIN_WORLD_B.txt) | Bővítve / javítva | 4370 |
| [W01_MAIN_WORLD_C.txt](../02_library/worlds/real/W01_MAIN_WORLD_C.txt) | Bővítve / javítva | 4467 |
| [W02_MAIN_WORLD_A.txt](../02_library/worlds/real/W02_MAIN_WORLD_A.txt) | Bővítve / javítva | 4123 |
| [W02_MAIN_WORLD_B.txt](../02_library/worlds/real/W02_MAIN_WORLD_B.txt) | Bővítve / javítva | 4115 |
| [W02_MAIN_WORLD_C.txt](../02_library/worlds/real/W02_MAIN_WORLD_C.txt) | Bővítve / javítva | 4125 |
| [W03_MAIN_WORLD_A.txt](../02_library/worlds/real/W03_MAIN_WORLD_A.txt) | Bővítve / javítva | 4094 |
| [W03_MAIN_WORLD_B.txt](../02_library/worlds/real/W03_MAIN_WORLD_B.txt) | Bővítve / javítva | 4117 |
| [W03_MAIN_WORLD_C.txt](../02_library/worlds/real/W03_MAIN_WORLD_C.txt) | Bővítve / javítva | 4136 |
| [W04_MAIN_WORLD_A.txt](../02_library/worlds/real/W04_MAIN_WORLD_A.txt) | Bővítve / javítva | 4091 |
| [W04_MAIN_WORLD_B.txt](../02_library/worlds/real/W04_MAIN_WORLD_B.txt) | Bővítve / javítva | 4073 |
| [W04_MAIN_WORLD_C.txt](../02_library/worlds/real/W04_MAIN_WORLD_C.txt) | Bővítve / javítva | 4099 |
| [W05_MAIN_WORLD_A.txt](../02_library/worlds/real/W05_MAIN_WORLD_A.txt) | Bővítve / javítva | 4104 |
| [W05_MAIN_WORLD_B.txt](../02_library/worlds/real/W05_MAIN_WORLD_B.txt) | Bővítve / javítva | 4080 |
| [W05_MAIN_WORLD_C.txt](../02_library/worlds/real/W05_MAIN_WORLD_C.txt) | Bővítve / javítva | 4086 |
| [W06_MAIN_WORLD_A.txt](../02_library/worlds/real/W06_MAIN_WORLD_A.txt) | Bővítve / javítva | 4088 |
| [W06_MAIN_WORLD_B.txt](../02_library/worlds/real/W06_MAIN_WORLD_B.txt) | Bővítve / javítva | 4100 |
| [W06_MAIN_WORLD_C.txt](../02_library/worlds/real/W06_MAIN_WORLD_C.txt) | Bővítve / javítva | 4118 |
| [W07_MAIN_WORLD_A.txt](../02_library/worlds/real/W07_MAIN_WORLD_A.txt) | Bővítve / javítva | 3811 |
| [W07_MAIN_WORLD_B.txt](../02_library/worlds/real/W07_MAIN_WORLD_B.txt) | Bővítve / javítva | 3787 |
| [W07_MAIN_WORLD_C.txt](../02_library/worlds/real/W07_MAIN_WORLD_C.txt) | Bővítve / javítva | 3803 |

## Kiegészítés — hét új tipográfiai prompt

Az eredeti 164 képprompt ellenőrzése után TY001–TY007 hozzáadásával **171 aktív képprompt és 164 importelem** van. A hét új prompt pontos szó-/számjegy-, ékezet-, cellakiosztás- és videószerep-ellenőrzése is elkészült. A gépi jegyzék a hét új sort tartalmazza. A 4K 3×3 rövid számlap TY001 az egyetlen háromszor hármas kivétel; minden más új tipográfia 2×2. [Tipográfiai promptok](../02_library/typography/README.md).

A 4 kredit / Nano Banana Pro 4K kép árat a felhasználó megerősítette. A felvetett 2K-s kétcellás alternatíva külön költségváltozat; a promptokat ez még nem alakította át. [Költségterv](../00_project/BUDGET.md).
