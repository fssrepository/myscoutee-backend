import {
  APP_STATIC_DATA,
  AssetTicketBuilder,
  LocalHelpCenterMapper,
  LocalUserRatesMapper,
  tournamentCurrentStageFromSubEvents
} from "./chunk-FAW3YKWN.js";
import {
  AppUtils
} from "./chunk-QZPIQIRC.js";
import {
  HELP_CENTER_TABLE_NAME,
  IDEA_POSTS_TABLE_NAME,
  LocalMemoryDb
} from "./chunk-U4O3FETT.js";
import {
  ACCOMMODATION_CATEGORY_APARTMENT,
  ACCOMMODATION_CATEGORY_HOUSE,
  ACCOMMODATION_CATEGORY_ROOM,
  ASSET_TYPE_ACCOMMODATION,
  ASSET_TYPE_SUPPLIES,
  ASSET_TYPE_TRANSPORT,
  ActivityEventDetailDTO,
  SUPPLIES_CATEGORY_AUDIO,
  SUPPLIES_CATEGORY_CAMPING,
  SUPPLIES_CATEGORY_COOKING,
  SUPPLIES_CATEGORY_DECOR,
  SUPPLIES_CATEGORY_GAMES,
  SUPPLIES_CATEGORY_SAFETY,
  SUPPLIES_CATEGORY_SPORTS,
  SUPPLIES_CATEGORY_TECH,
  TRANSPORT_CATEGORY_SEDAN,
  TRANSPORT_CATEGORY_SHUTTLE,
  TRANSPORT_CATEGORY_SUV,
  TRANSPORT_CATEGORY_VAN
} from "./chunk-27OFLLFL.js";
import {
  Injectable,
  __spreadProps,
  __spreadValues,
  environment,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-FMXFYYCS.js";

// src/app/shared/core/local/seed/builders/demo-image-pool.ts
var ASSET_PICSUM_IDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49];
var EVENT_PICSUM_IDS = [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 98, 99, 100, 101, 102, 103, 104, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 139, 140, 141, 142, 143, 144, 145, 146, 147, 149, 151, 152, 153, 154, 155];
var ASSET_SLOTS_BY_TEMPLATE = {
  "asset-sup-1": [
    1,
    2,
    3,
    4
  ],
  "asset-sup-2": [
    9,
    10,
    11,
    12
  ],
  "asset-sup-3": [
    13,
    14,
    15,
    16
  ],
  "asset-sup-4": [
    5,
    6,
    7,
    8
  ],
  "asset-sup-5": [
    1,
    2,
    3,
    4
  ],
  "asset-sup-6": [
    13,
    14,
    15,
    16
  ],
  "asset-sup-7": [
    5,
    6,
    7,
    8
  ],
  "asset-sup-8": [
    13,
    14,
    15,
    16
  ],
  "asset-acc-1": [
    17,
    18,
    19,
    20
  ],
  "asset-acc-2": [
    25,
    26,
    27,
    28
  ],
  "asset-acc-3": [
    21,
    22,
    23,
    24
  ],
  "asset-acc-4": [
    29,
    30,
    31,
    32
  ],
  "asset-transport-1": [
    33,
    34,
    35,
    36
  ],
  "asset-transport-2": [
    37,
    38,
    39,
    46,
    47
  ],
  "asset-transport-3": [
    40,
    41,
    42,
    43,
    44,
    45
  ],
  "asset-transport-4": [
    48,
    49,
    50
  ]
};
var ASSET_DEFINITION_BY_SLOT = {
  "1": {
    "title": "Lakeside Basecamp Bundle",
    "subtitle": "4-person dome + sleep systems + lantern",
    "details": "Packed for a two-night lakeside stay; cookware and lighting are included.",
    "category": "Camping"
  },
  "2": {
    "title": "Desert Trail Hydration Set",
    "subtitle": "Water carriers + sun protection + trekking poles",
    "details": "Heat-ready hiking supplies for a dry exposed route and a managed rest checkpoint.",
    "category": "Hiking"
  },
  "3": {
    "title": "Coastal Kayak Safety Set",
    "subtitle": "PFDs + paddles + dry bags + tow line",
    "details": "Launch-ready water-safety equipment for a small sea-kayak group.",
    "category": "Watersports"
  },
  "4": {
    "title": "Winter Mountaineering Safety Set",
    "subtitle": "Crampons + ice axes + rope + helmets",
    "details": "Cold-weather technical equipment organized for a supervised alpine route.",
    "category": "Mountaineering"
  },
  "5": {
    "title": "Mobile Group Catering Station",
    "subtitle": "Coolers + prep tables + food crates",
    "details": "Group meal station packed for hygienic outdoor preparation and cold storage.",
    "category": "Catering"
  },
  "6": {
    "title": "Group Safety Base",
    "subtitle": "First aid + radios + hi-vis equipment",
    "details": "Central safety point for moving groups, night checks, and incident response.",
    "category": "Safety"
  },
  "7": {
    "title": "Trailside Bicycle Repair Kit",
    "subtitle": "Pumps + patches + spare tubes + tools",
    "details": "Mobile maintenance supplies for punctures and basic repairs during a group ride.",
    "category": "Cycling"
  },
  "8": {
    "title": "Outdoor Event Power Hub",
    "subtitle": "Power stations + charging leads + cable covers",
    "details": "Shared low-voltage charging and equipment-power point for an outdoor gathering.",
    "category": "Event Technology"
  },
  "9": {
    "title": "Travel Social Games Case",
    "subtitle": "Compact boards + cards + dice + score tokens",
    "details": "Portable all-weather social games for four travelers during an evening stop.",
    "category": "Games"
  },
  "10": {
    "title": "Route Navigation Kit",
    "subtitle": "Handheld GPS + compass + waterproof map sleeves",
    "details": "Offline route-finding equipment for a small group traveling beyond reliable mobile coverage.",
    "category": "Navigation"
  },
  "11": {
    "title": "Field Cooking Kit",
    "subtitle": "Twin burner + nesting pots + utensil roll",
    "details": "Compact meal-preparation equipment for four people at an approved outdoor cooking point.",
    "category": "Cooking"
  },
  "12": {
    "title": "Picnic Comfort Set",
    "subtitle": "Folding chairs + blanket + thermos carriers",
    "details": "Packable seating and serving equipment for a relaxed daytime group stop.",
    "category": "Picnic"
  },
  "13": {
    "title": "Portable Audio Rig",
    "subtitle": "Battery speakers + microphones + compact mixer",
    "details": "Cable-managed sound equipment for announcements, music, or a small workshop.",
    "category": "Audio"
  },
  "14": {
    "title": "Rechargeable Area Lighting Kit",
    "subtitle": "Tripod lights + lanterns + safe cable covers",
    "details": "Flexible low-voltage lighting for an evening meeting point or work area.",
    "category": "Lighting"
  },
  "15": {
    "title": "Outdoor Projection Pack",
    "subtitle": "Projector + folding screen + power station",
    "details": "Portable film and presentation setup for a sheltered community gathering.",
    "category": "Projection"
  },
  "16": {
    "title": "Hygiene and Cleanup Station",
    "subtitle": "Water containers + wash basins + sorting bins",
    "details": "Reusable sanitation and cleanup equipment for a shared trip or outdoor event.",
    "category": "Sanitation"
  },
  "17": {
    "title": "Lakeside Timber Cabin",
    "subtitle": "Four beds + wood stove + covered porch",
    "details": "Simple group cabin for a quiet overnight stay beside a lake.",
    "category": "Cabin"
  },
  "18": {
    "title": "Urban Hostel Family Room",
    "subtitle": "Four bunks + lockers + shared table",
    "details": "Private four-person hostel room near public transport and city activities.",
    "category": "Hostel"
  },
  "19": {
    "title": "Riverside Houseboat Berth",
    "subtitle": "Two double berths + compact galley + deck",
    "details": "Moored floating accommodation for a small group on a calm urban river.",
    "category": "Houseboat"
  },
  "20": {
    "title": "Mountain Refuge Room",
    "subtitle": "Four alpine bunks + drying racks + gear shelf",
    "details": "Practical shared room inside a staffed mountain refuge.",
    "category": "Mountain Refuge"
  },
  "21": {
    "title": "Compact Campervan Sleep Setup",
    "subtitle": "Pop-top berths + convertible bench + kitchenette",
    "details": "Four-person mobile sleep setup prepared at a legal overnight stop.",
    "category": "Campervan"
  },
  "22": {
    "title": "Farm Guest Cottage",
    "subtitle": "Two bedrooms + kitchen table + rural courtyard",
    "details": "Independent small cottage for a group visiting a working farm.",
    "category": "Cottage"
  },
  "23": {
    "title": "Desert Adobe Casita",
    "subtitle": "Cool plaster walls + shaded courtyard + sleeps four",
    "details": "Compact heat-conscious guest house with enclosed sleeping rooms and a furnished courtyard.",
    "category": "Casita"
  },
  "24": {
    "title": "Forest Treehouse Lodge",
    "subtitle": "Raised timber room + four beds + woodland deck",
    "details": "Weatherproof elevated lodge reached by a safe fixed stairway.",
    "category": "Treehouse"
  },
  "25": {
    "title": "Historic Townhouse Room",
    "subtitle": "Double bed + reading nook + tall window",
    "details": "Private two-person room in a carefully maintained older city home.",
    "category": "Guest Room"
  },
  "26": {
    "title": "Beach Bungalow Room",
    "subtitle": "Double bed + screened shutters + small veranda",
    "details": "Simple two-person coastal stay designed for airflow and sandy gear.",
    "category": "Bungalow"
  },
  "27": {
    "title": "Accessible Garden Suite",
    "subtitle": "Wide circulation + low storage + roll-in bathroom",
    "details": "Step-free private suite for two guests beside a quiet garden.",
    "category": "Accessible Suite"
  },
  "28": {
    "title": "Urban Micro Studio",
    "subtitle": "Wall bed + kitchenette + compact workspace",
    "details": "Efficient self-contained city stay for one or two travelers.",
    "category": "Studio"
  },
  "29": {
    "title": "Festival Crew Bunk Nook",
    "subtitle": "Two bunks + personal shelves + durable linens",
    "details": "No-frills two-person sleep space for event or volunteer crew.",
    "category": "Bunkhouse"
  },
  "30": {
    "title": "Night Train Sleeper Cabin",
    "subtitle": "Two berths + fold-down table + corridor window",
    "details": "Reserved overnight rail compartment for two travelers.",
    "category": "Sleeper Cabin"
  },
  "31": {
    "title": "Canal View Guest Room",
    "subtitle": "Double bed + balcony door + waterside outlook",
    "details": "Bright private room for two guests beside a quiet canal district.",
    "category": "Guest Room"
  },
  "32": {
    "title": "Remote Work Guest Suite",
    "subtitle": "Double bed + proper desk + acoustic door",
    "details": "Calm two-person suite with a reliable place for focused work.",
    "category": "Guest Suite"
  },
  "33": {
    "title": "Trail Access 4x4",
    "subtitle": "4 seats + high clearance + washable cargo area",
    "details": "Unbranded four-wheel-drive vehicle for rough access roads and trail equipment.",
    "category": "4x4"
  },
  "34": {
    "title": "Kayak Roof-Rack Estate",
    "subtitle": "4 seats + twin kayak rack + wet-gear liner",
    "details": "Long-roof vehicle prepared for a four-person coastal paddling day.",
    "category": "Estate Car"
  },
  "35": {
    "title": "Family Road-Trip Minivan",
    "subtitle": "4 reserved seats + flexible storage + sliding doors",
    "details": "Comfortable unbranded minivan configured for a longer regional journey.",
    "category": "Minivan"
  },
  "36": {
    "title": "Bicycle Shuttle Crossover",
    "subtitle": "4 seats + rear rack + repair tray",
    "details": "Compact crossover carrying two bicycles and group riding equipment.",
    "category": "Crossover"
  },
  "37": {
    "title": "Compact Airport EV",
    "subtitle": "4 seats + electric hatchback + terminal pickup",
    "details": "Small battery-electric car for a coordinated airport transfer.",
    "category": "Electric Car"
  },
  "38": {
    "title": "Accessible Shuttle Van",
    "subtitle": "4 passenger places + ramp + securement points",
    "details": "Step-friendly van configured for an inclusive local transfer.",
    "category": "Accessible Van"
  },
  "39": {
    "title": "Hotel Courtesy Minibus",
    "subtitle": "4 reserved seats + high roof + hotel loop",
    "details": "Small courtesy bus assigned to a four-person late-arrival group.",
    "category": "Minibus"
  },
  "40": {
    "title": "Expo Equipment Cargo Van",
    "subtitle": "4 crew seats + enclosed load bay + tie-downs",
    "details": "Short-wheelbase van for people and protected event equipment.",
    "category": "Cargo Van"
  },
  "41": {
    "title": "Community Equipment Pickup",
    "subtitle": "4 seats + covered utility bed + loading step",
    "details": "Double-cab pickup for bulky community-event supplies.",
    "category": "Pickup Truck"
  },
  "42": {
    "title": "Festival Utility Buggy",
    "subtitle": "4 seats + open cargo deck + venue route",
    "details": "Low-speed electric utility vehicle for an enclosed event site.",
    "category": "Utility Vehicle"
  },
  "43": {
    "title": "Waterfront Passenger Launch",
    "subtitle": "4 passenger seats + rigid cockpit + life jackets",
    "details": "Small licensed motor launch with an enclosed helm for a short sheltered-water transfer.",
    "category": "Passenger Boat"
  },
  "44": {
    "title": "Dinner District Electric Taxi",
    "subtitle": "4 seats + compact EV + city pickup",
    "details": "Quiet unbranded electric taxi reserved for an evening group.",
    "category": "Electric Taxi"
  },
  "45": {
    "title": "Concert Night Shuttle Van",
    "subtitle": "4 reserved seats + illuminated pickup zone",
    "details": "Compact passenger van for a clearly coordinated post-event return.",
    "category": "Shuttle Van"
  },
  "46": {
    "title": "Station Pickup Wagon",
    "subtitle": "4 seats + long cargo floor + rail connection",
    "details": "Unbranded estate wagon for a daytime station pickup.",
    "category": "Estate Car"
  },
  "47": {
    "title": "Historic District Pedicab Pair",
    "subtitle": "4 total seats + two open-air cycle taxis",
    "details": "Two coordinated roofless pedal-powered taxis for a short old-town transfer.",
    "category": "Pedicab"
  },
  "48": {
    "title": "Mountain Cable-Car Cabin",
    "subtitle": "4 reserved places + enclosed gondola + ridge link",
    "details": "Small enclosed cable-car cabin representing an uphill group transfer.",
    "category": "Cable Car"
  },
  "49": {
    "title": "Foothill Sidecar Motorcycle Pair",
    "subtitle": "4 total seats + two touring sidecars",
    "details": "Two coordinated unbranded sidecar motorcycles for a scenic paved route.",
    "category": "Motorcycle"
  },
  "50": {
    "title": "Snow Lodge Tracked Shuttle",
    "subtitle": "4 passenger seats + rubber tracks + heated cab",
    "details": "Compact tracked passenger vehicle for a maintained snowy lodge route.",
    "category": "Snow Shuttle"
  }
};
var ASSET_SLOT_BY_SEED = {
  "u10-asset-sup-1": 1,
  "u1-asset-sup-1": 2,
  "u48-asset-sup-1": 3,
  "u47-asset-sup-1": 4,
  "u6-asset-sup-4": 5,
  "u5-asset-sup-4": 6,
  "u12-asset-sup-4": 7,
  "u3-asset-sup-4": 8,
  "u34-asset-sup-2": 9,
  "u25-asset-sup-2": 10,
  "u48-asset-sup-2": 11,
  "u7-asset-sup-2": 12,
  "u38-asset-sup-3": 13,
  "u29-asset-sup-3": 14,
  "u44-asset-sup-3": 15,
  "u35-asset-sup-3": 16,
  "u2-asset-acc-1": 17,
  "u17-asset-acc-1": 18,
  "u24-asset-acc-1": 19,
  "u39-asset-acc-1": 20,
  "u30-asset-acc-3": 21,
  "u21-asset-acc-3": 22,
  "u28-asset-acc-3": 23,
  "u35-asset-acc-3": 24,
  "u26-asset-acc-2": 25,
  "u17-asset-acc-2": 26,
  "u8-asset-acc-2": 27,
  "u15-asset-acc-2": 28,
  "u30-asset-acc-4": 29,
  "u21-asset-acc-4": 30,
  "u20-asset-acc-4": 31,
  "u35-asset-acc-4": 32,
  "u26-asset-transport-1": 33,
  "u17-asset-transport-1": 34,
  "u4-asset-transport-3": 35,
  "u19-asset-transport-1": 36,
  "u7-asset-transport-2": 37,
  "u3-asset-transport-2": 38,
  "u8-asset-transport-2": 39,
  "u12-asset-transport-3": 40,
  "u44-asset-transport-3": 41,
  "u16-asset-transport-3": 42,
  "u11-asset-transport-3": 43,
  "u43-asset-transport-3": 44,
  "u39-asset-transport-3": 45,
  "u33-asset-transport-2": 46,
  "u37-asset-transport-2": 47,
  "u26-asset-transport-4": 48,
  "u46-asset-transport-4": 49,
  "u42-asset-transport-4": 50
};
var ASSET_TEMPLATE_IDS_BY_OWNER = {
  "u1": [
    "asset-sup-1"
  ],
  "u2": [
    "asset-acc-1"
  ],
  "u3": [
    "asset-sup-4",
    "asset-transport-2"
  ],
  "u4": [
    "asset-transport-3"
  ],
  "u5": [
    "asset-sup-4"
  ],
  "u6": [
    "asset-sup-4"
  ],
  "u7": [
    "asset-sup-2",
    "asset-transport-2"
  ],
  "u8": [
    "asset-acc-2",
    "asset-transport-2"
  ],
  "u9": [],
  "u10": [
    "asset-sup-1"
  ],
  "u11": [
    "asset-transport-3"
  ],
  "u12": [
    "asset-sup-4",
    "asset-transport-3"
  ],
  "u13": [],
  "u14": [],
  "u15": [
    "asset-acc-2"
  ],
  "u16": [
    "asset-transport-3"
  ],
  "u17": [
    "asset-acc-1",
    "asset-acc-2",
    "asset-transport-1"
  ],
  "u18": [],
  "u19": [
    "asset-transport-1"
  ],
  "u20": [
    "asset-acc-4"
  ],
  "u21": [
    "asset-acc-3",
    "asset-acc-4"
  ],
  "u22": [],
  "u23": [],
  "u24": [
    "asset-acc-1"
  ],
  "u25": [
    "asset-sup-2"
  ],
  "u26": [
    "asset-acc-2",
    "asset-transport-1",
    "asset-transport-4"
  ],
  "u27": [],
  "u28": [
    "asset-acc-3"
  ],
  "u29": [
    "asset-sup-3"
  ],
  "u30": [
    "asset-acc-3",
    "asset-acc-4"
  ],
  "u31": [],
  "u32": [],
  "u33": [
    "asset-transport-2"
  ],
  "u34": [
    "asset-sup-2"
  ],
  "u35": [
    "asset-sup-3",
    "asset-acc-3",
    "asset-acc-4"
  ],
  "u36": [],
  "u37": [
    "asset-transport-2"
  ],
  "u38": [
    "asset-sup-3"
  ],
  "u39": [
    "asset-acc-1",
    "asset-transport-3"
  ],
  "u40": [],
  "u41": [],
  "u42": [
    "asset-transport-4"
  ],
  "u43": [
    "asset-transport-3"
  ],
  "u44": [
    "asset-sup-3",
    "asset-transport-3"
  ],
  "u45": [],
  "u46": [
    "asset-transport-4"
  ],
  "u47": [
    "asset-sup-1"
  ],
  "u48": [
    "asset-sup-1",
    "asset-sup-2"
  ],
  "u49": [],
  "u50": []
};
var ASSET_RECORD_BY_SLOT = {
  "1": {
    "visibility": "Friends only",
    "status": "A"
  },
  "2": {
    "visibility": "Friends only",
    "status": "A"
  },
  "3": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "4": {
    "visibility": "Public",
    "status": "A"
  },
  "5": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "6": {
    "visibility": "Public",
    "status": "A"
  },
  "7": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "8": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "9": {
    "visibility": "Friends only",
    "status": "A"
  },
  "10": {
    "visibility": "Friends only",
    "status": "A"
  },
  "11": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "12": {
    "visibility": "Friends only",
    "status": "A"
  },
  "13": {
    "visibility": "Public",
    "status": "A"
  },
  "14": {
    "visibility": "Public",
    "status": "A"
  },
  "15": {
    "visibility": "Public",
    "status": "A"
  },
  "16": {
    "visibility": "Public",
    "status": "A"
  },
  "17": {
    "visibility": "Public",
    "status": "A"
  },
  "18": {
    "visibility": "Public",
    "status": "A"
  },
  "19": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "20": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "21": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "22": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "23": {
    "visibility": "Friends only",
    "status": "A"
  },
  "24": {
    "visibility": "Public",
    "status": "A"
  },
  "25": {
    "visibility": "Public",
    "status": "A"
  },
  "26": {
    "visibility": "Public",
    "status": "A"
  },
  "27": {
    "visibility": "Public",
    "status": "A"
  },
  "28": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "29": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "30": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "31": {
    "visibility": "Public",
    "status": "A"
  },
  "32": {
    "visibility": "Public",
    "status": "A"
  },
  "33": {
    "visibility": "Public",
    "status": "A"
  },
  "34": {
    "visibility": "Public",
    "status": "A"
  },
  "35": {
    "visibility": "Friends only",
    "status": "A"
  },
  "36": {
    "visibility": "Friends only",
    "status": "A"
  },
  "37": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "38": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "39": {
    "visibility": "Public",
    "status": "A"
  },
  "40": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "41": {
    "visibility": "Public",
    "status": "A"
  },
  "42": {
    "visibility": "Public",
    "status": "A"
  },
  "43": {
    "visibility": "Invitation only",
    "status": "A"
  },
  "44": {
    "visibility": "Public",
    "status": "A"
  },
  "45": {
    "visibility": "Public",
    "status": "A"
  },
  "46": {
    "visibility": "Public",
    "status": "A"
  },
  "47": {
    "visibility": "Public",
    "status": "A"
  },
  "48": {
    "visibility": "Public",
    "status": "A"
  },
  "49": {
    "visibility": "Public",
    "status": "A"
  },
  "50": {
    "visibility": "Public",
    "status": "A"
  }
};
var EVENT_DEFINITION_BY_SLOT = {
  "1": {
    "title": "Snowline Shuttle Briefing",
    "subtitle": "A dawn transfer team checks skis, helmets, and warm layers before the road climbs.",
    "location": "Austin \xB7 snowy timber-lodge pickup lane",
    "topics": [
      "#WinterSports",
      "#Outdoors",
      "#Travel"
    ]
  },
  "2": {
    "title": "Alpine Cabin Supper",
    "subtitle": "A small ski group winds down over soup while wet gloves and boots dry by the stove.",
    "location": "Austin \xB7 stone mountain refuge dining room",
    "topics": [
      "#WinterSports",
      "#Outdoors",
      "#Travel"
    ]
  },
  "3": {
    "title": "Glasshouse Padel Ladder",
    "subtitle": "Rotating doubles play short ranking rounds on a bright converted conservatory court.",
    "location": "Austin \xB7 sunlit glass-roof padel court",
    "topics": [
      "#Sports",
      "#Tournament",
      "#HealthyLifestyle"
    ]
  },
  "4": {
    "title": "Sunset Beach Volley Rotation",
    "subtitle": "Casual teams rotate through quick games before sharing fruit at the sideline.",
    "location": "San Diego \xB7 wide public beach volleyball court",
    "topics": [
      "#Sports",
      "#Tournament",
      "#HealthyLifestyle"
    ]
  },
  "5": {
    "title": "Rooftop Padel Open",
    "subtitle": "Open pairs meet for a friendly evening bracket above the city.",
    "location": "New York \xB7 fenced urban rooftop padel court",
    "topics": [
      "#Sports",
      "#Tournament",
      "#HealthyLifestyle"
    ]
  },
  "6": {
    "title": "Riverbridge Cargo-Bike Social",
    "subtitle": "A relaxed ride pauses to compare practical cargo setups before following the riverside trail.",
    "location": "Chicago \xB7 riverside path below a steel bridge",
    "topics": [
      "#Cycling",
      "#Outdoors",
      "#Community"
    ]
  },
  "7": {
    "title": "Sunrise Run and Market Brunch",
    "subtitle": "An easy-pace run finishes beside a breakfast table with fruit, rolls, and coffee flasks.",
    "location": "Chicago \xB7 tree-lined market square at sunrise",
    "topics": [
      "#Running",
      "#Fitness",
      "#HealthyLifestyle"
    ]
  },
  "8": {
    "title": "Riverside Relay Handoff",
    "subtitle": "Small teams practice clean baton exchanges across a long community relay route.",
    "location": "Austin \xB7 curving river trail beside a pedestrian bridge",
    "topics": [
      "#Running",
      "#Fitness",
      "#HealthyLifestyle"
    ]
  },
  "9": {
    "title": "Stadium Stair Pulse",
    "subtitle": "A compact fitness group alternates stair climbs with recovery rounds.",
    "location": "Los Angeles \xB7 open concrete neighborhood stadium",
    "topics": [
      "#Running",
      "#Fitness",
      "#HealthyLifestyle"
    ]
  },
  "10": {
    "title": "Rain-Window Track Intervals",
    "subtitle": "A weatherproof evening session uses short intervals and paired pacing.",
    "location": "Chicago \xB7 indoor oval track beside tall rain-streaked windows",
    "topics": [
      "#Running",
      "#Fitness",
      "#HealthyLifestyle"
    ]
  },
  "11": {
    "title": "Urban Photo Checkpoint Dash",
    "subtitle": "Camera teams move between visual challenges without turning the meetup into a race.",
    "location": "Los Angeles \xB7 geometric downtown pedestrian plaza",
    "topics": [
      "#Running",
      "#Fitness",
      "#HealthyLifestyle"
    ]
  },
  "12": {
    "title": "Underpass Strength Circuit",
    "subtitle": "A coached outdoor circuit combines resistance bands, step boxes, and controlled carries.",
    "location": "San Diego \xB7 clean concrete space beneath a broad overpass",
    "topics": [
      "#Running",
      "#Fitness",
      "#HealthyLifestyle"
    ]
  },
  "13": {
    "title": "Twilight Pacer Drills",
    "subtitle": "Volunteer pacers rehearse starts, regroup points, and steady running formation.",
    "location": "Austin \xB7 community athletics track at blue hour",
    "topics": [
      "#Running",
      "#Fitness",
      "#HealthyLifestyle"
    ]
  },
  "14": {
    "title": "Red Rock Overlook Hike",
    "subtitle": "A measured desert climb ends at a broad overlook with time for water and route checks.",
    "location": "Los Angeles \xB7 rust-colored canyon trail",
    "topics": [
      "#Walking",
      "#Outdoors",
      "#Nature"
    ]
  },
  "15": {
    "title": "Lakeside Walk Lab",
    "subtitle": "Paired conversations alternate with quiet observation stops along the water.",
    "location": "Phoenix \xB7 wooden boardwalk through lakeside reeds",
    "topics": [
      "#Walking",
      "#Outdoors",
      "#Nature"
    ]
  },
  "16": {
    "title": "Conservatory Sunset Stroll",
    "subtitle": "Friends of friends explore outdoor garden rooms before the glasshouse closes.",
    "location": "San Diego \xB7 botanical conservatory garden at sunset",
    "topics": [
      "#Walking",
      "#Outdoors",
      "#Nature"
    ]
  },
  "17": {
    "title": "Saguaro Bloom Trail",
    "subtitle": "A careful morning walk follows seasonal desert flowers without leaving the marked path.",
    "location": "Phoenix \xB7 Sonoran desert footpath after spring rain",
    "topics": [
      "#Walking",
      "#Outdoors",
      "#Nature"
    ]
  },
  "18": {
    "title": "Elevated-Rail Architecture Walk",
    "subtitle": "The group studies steelwork, brick facades, and changing street proportions.",
    "location": "Chicago \xB7 car-free street beneath an elevated railway",
    "topics": [
      "#Walking",
      "#Outdoors",
      "#Nature"
    ]
  },
  "19": {
    "title": "Cedar Mist Forest Loop",
    "subtitle": "A quiet social hike follows a damp cedar path with frequent regroup stops.",
    "location": "Seattle \xB7 misty evergreen forest trail",
    "topics": [
      "#Walking",
      "#Outdoors",
      "#Nature"
    ]
  },
  "20": {
    "title": "Mosaic Stairway City Walk",
    "subtitle": "A hillside route connects colorful public steps, pocket gardens, and neighborhood overlooks.",
    "location": "Los Angeles \xB7 steep urban garden stairway",
    "topics": [
      "#Walking",
      "#Outdoors",
      "#Nature"
    ]
  },
  "21": {
    "title": "Accessible Sunday Park Loop",
    "subtitle": "A step-free loop keeps the pace conversational and the path comfortable for everyone.",
    "location": "Phoenix \xB7 broad level path around a mature city park",
    "topics": [
      "#Walking",
      "#Outdoors",
      "#Nature"
    ]
  },
  "22": {
    "title": "Lantern Bluff Walk",
    "subtitle": "An early-evening coastal walk uses hand lanterns for the return from the overlook.",
    "location": "Los Angeles \xB7 grassy bluff above a rocky coast",
    "topics": [
      "#Walking",
      "#Outdoors",
      "#Nature"
    ]
  },
  "23": {
    "title": "Tidal Marsh Bird Walk",
    "subtitle": "A patient boardwalk outing practices binocular use and quiet group movement.",
    "location": "San Diego \xB7 open salt-marsh observation boardwalk",
    "topics": [
      "#Walking",
      "#Outdoors",
      "#Nature"
    ]
  },
  "24": {
    "title": "Paddleboard Balance Clinic",
    "subtitle": "Beginners rehearse stable stance and safe falls in calm shallow water.",
    "location": "Austin \xB7 sheltered urban lake beach",
    "topics": [
      "#WaterSports",
      "#Outdoors",
      "#Nature"
    ]
  },
  "25": {
    "title": "Canyon Reservoir Kayak Pairing",
    "subtitle": "Paddlers match pace and practice turning before a short red-cliff route.",
    "location": "Phoenix \xB7 calm reservoir below red canyon walls",
    "topics": [
      "#WaterSports",
      "#Outdoors",
      "#Nature"
    ]
  },
  "26": {
    "title": "Lakefront Dinghy Rigging",
    "subtitle": "A small sailing group learns to prepare lines and sails before leaving the harbor.",
    "location": "Chicago \xB7 grassy lakefront sailing dock",
    "topics": [
      "#WaterSports",
      "#Outdoors",
      "#Nature"
    ]
  },
  "27": {
    "title": "Riverside Canoe Picnic Launch",
    "subtitle": "Friends pack a dry lunch and check life jackets before a gentle downstream paddle.",
    "location": "Phoenix \xB7 tree-shaded river launch ramp",
    "topics": [
      "#WaterSports",
      "#Outdoors",
      "#Nature"
    ]
  },
  "28": {
    "title": "Low-Tide Shore Survey",
    "subtitle": "A waterfront meetup observes tide pools and returns every stone carefully.",
    "location": "Seattle \xB7 rocky Pacific shoreline at low tide",
    "topics": [
      "#WaterSports",
      "#Outdoors",
      "#Nature"
    ]
  },
  "29": {
    "title": "Corner Bakery First Batch",
    "subtitle": "Early arrivals share still-warm bread at the working table beside the ovens.",
    "location": "Chicago \xB7 small neighborhood bakery after opening",
    "topics": [
      "#CoffeeMeetup",
      "#Brunch",
      "#Friends"
    ]
  },
  "30": {
    "title": "Greenhouse Brunch Table",
    "subtitle": "A plant-filled brunch pairs seasonal plates with calm one-to-one introductions.",
    "location": "San Diego \xB7 airy greenhouse cafe among hanging plants",
    "topics": [
      "#CoffeeMeetup",
      "#Brunch",
      "#Friends"
    ]
  },
  "31": {
    "title": "Brunch Rotation",
    "subtitle": "Three compact tables rotate guests every twenty minutes using different cup colors as cues.",
    "location": "Chicago \xB7 bright tiled all-day cafe",
    "topics": [
      "#CoffeeMeetup",
      "#Brunch",
      "#Friends"
    ]
  },
  "32": {
    "title": "Pour-Over Roastery Lab",
    "subtitle": "A hands-on coffee session compares grind, timing, and aroma without brand-led presentation.",
    "location": "San Diego \xB7 brick micro-roastery workshop counter",
    "topics": [
      "#CoffeeMeetup",
      "#Brunch",
      "#Friends"
    ]
  },
  "33": {
    "title": "Rooftop Tea and Citrus",
    "subtitle": "A breezy late breakfast combines iced tea, citrus pastries, and a shaded skyline table.",
    "location": "San Diego \xB7 quiet rooftop garden breakfast terrace",
    "topics": [
      "#CoffeeMeetup",
      "#Brunch",
      "#Friends"
    ]
  },
  "34": {
    "title": "Market Hall Breakfast Club",
    "subtitle": "The group assembles a shared breakfast from several small independent counters.",
    "location": "Chicago \xB7 historic indoor food hall in morning light",
    "topics": [
      "#CoffeeMeetup",
      "#Brunch",
      "#Friends"
    ]
  },
  "35": {
    "title": "Night Taco Window Crawl",
    "subtitle": "A three-stop route compares fillings and handmade salsas at open street windows.",
    "location": "Los Angeles \xB7 pedestrian food lane after dark",
    "topics": [
      "#Food",
      "#Cooking",
      "#Friends"
    ]
  },
  "36": {
    "title": "Handmade Pasta Table",
    "subtitle": "Pairs roll dough, shape filled pasta, and share the first cooked batch.",
    "location": "San Diego \xB7 community kitchen with long marble worktop",
    "topics": [
      "#Food",
      "#Cooking",
      "#Friends"
    ]
  },
  "37": {
    "title": "Night Food League",
    "subtitle": "Teams sample three market stalls and compare aroma, texture, and presentation.",
    "location": "Seattle \xB7 covered night market dining aisle",
    "topics": [
      "#Food",
      "#Cooking",
      "#Friends"
    ]
  },
  "38": {
    "title": "Friends Circle Supper",
    "subtitle": "Close connections and plus-ones share a slow seasonal meal at one candlelit table.",
    "location": "Chicago \xB7 converted farmhouse dining room",
    "topics": [
      "#Food",
      "#Cooking",
      "#Friends"
    ]
  },
  "39": {
    "title": "Cocoa and Spice Flight",
    "subtitle": "A guided tasting matches dark cocoa with cinnamon, chile, citrus peel, and toasted nuts.",
    "location": "San Diego \xB7 intimate stone-walled tasting room",
    "topics": [
      "#Food",
      "#Cooking",
      "#Friends"
    ]
  },
  "40": {
    "title": "Desert Porch Folk Session",
    "subtitle": "Acoustic players trade short songs while listeners settle into porch chairs.",
    "location": "Phoenix \xB7 adobe porch facing a desert dusk",
    "topics": [
      "#Music",
      "#GoingOut",
      "#Culture"
    ]
  },
  "41": {
    "title": "Jazz Rooftop Session",
    "subtitle": "A compact trio plays beside low tables as the skyline moves into evening.",
    "location": "Denver \xB7 brick rooftop music terrace",
    "topics": [
      "#Music",
      "#GoingOut",
      "#Culture"
    ]
  },
  "42": {
    "title": "Basement Vinyl Listening Circle",
    "subtitle": "Each guest shares one record side in a focused, low-light listening room.",
    "location": "Chicago \xB7 acoustically treated basement lounge",
    "topics": [
      "#Music",
      "#GoingOut",
      "#Culture"
    ]
  },
  "43": {
    "title": "Harbor Warehouse Percussion Lab",
    "subtitle": "A rhythm workshop builds layered patterns with hand drums and found percussion.",
    "location": "Seattle \xB7 open brick warehouse beside a harbor",
    "topics": [
      "#Music",
      "#GoingOut",
      "#Culture"
    ]
  },
  "44": {
    "title": "Courtyard String Social",
    "subtitle": "A small string quartet performs close to a standing neighborhood audience.",
    "location": "Los Angeles \xB7 leafy old-town courtyard at night",
    "topics": [
      "#Music",
      "#GoingOut",
      "#Culture"
    ]
  },
  "45": {
    "title": "Sunprint Garden Workshop",
    "subtitle": "Participants arrange leaves and small objects for blue botanical contact prints.",
    "location": "Austin \xB7 community garden worktable in clear sun",
    "topics": [
      "#Creativity",
      "#Art",
      "#Culture"
    ]
  },
  "46": {
    "title": "Creative Nights Gesture Circle",
    "subtitle": "A clothed gesture model anchors fast charcoal studies and supportive critique.",
    "location": "Seattle \xB7 high-ceiling neighborhood art studio",
    "topics": [
      "#Creativity",
      "#Art",
      "#Culture"
    ]
  },
  "47": {
    "title": "Wheel-Thrown Pottery Lab",
    "subtitle": "Beginners center clay and compare forms at a row of working wheels.",
    "location": "Nashville \xB7 daylit ceramic workshop",
    "topics": [
      "#Creativity",
      "#Art",
      "#Culture"
    ]
  },
  "48": {
    "title": "Coffee and Book Swap",
    "subtitle": "Readers trade wrapped recommendations and open them over coffee in a small circle.",
    "location": "Austin \xB7 independent cafe reading alcove",
    "topics": [
      "#Creativity",
      "#Art",
      "#Culture"
    ]
  },
  "49": {
    "title": "Risograph Zine Assembly",
    "subtitle": "A print group layers two colors, folds pages, and binds a tiny shared edition.",
    "location": "Austin \xB7 compact community print studio",
    "topics": [
      "#Creativity",
      "#Art",
      "#Culture"
    ]
  },
  "50": {
    "title": "Darkroom Contact Sheet Night",
    "subtitle": "Analog photographers inspect fresh contact sheets under safe red light.",
    "location": "Seattle \xB7 working photographic darkroom",
    "topics": [
      "#Creativity",
      "#Art",
      "#Culture"
    ]
  },
  "51": {
    "title": "Studio Friends Critique Wall",
    "subtitle": "An invite-only group pins works in progress and discusses composition in short rounds.",
    "location": "Seattle \xB7 loft studio with a long white review wall",
    "topics": [
      "#Creativity",
      "#Art",
      "#Culture"
    ]
  },
  "52": {
    "title": "Urban Photo Marathon",
    "subtitle": "Camera teams solve composition challenges across arcades, reflections, and pedestrian bridges.",
    "location": "Los Angeles \xB7 downtown passage with mirrored windows",
    "topics": [
      "#Creativity",
      "#Art",
      "#Culture"
    ]
  },
  "53": {
    "title": "Candlelit Sound Bath",
    "subtitle": "A quiet evening session layers singing bowls and low resonant tones.",
    "location": "Chicago \xB7 warm timber wellness room",
    "topics": [
      "#Wellness",
      "#MentalHealth",
      "#HealthyLifestyle"
    ]
  },
  "54": {
    "title": "Seaside Sunrise Yoga",
    "subtitle": "A gentle standing sequence begins as first light reaches the water.",
    "location": "San Diego \xB7 flat oceanfront deck at sunrise",
    "topics": [
      "#Wellness",
      "#MentalHealth",
      "#HealthyLifestyle"
    ]
  },
  "55": {
    "title": "Community Tai Chi Courtyard",
    "subtitle": "Slow coordinated forms create a calm start in a sheltered civic courtyard.",
    "location": "Seattle \xB7 pale stone courtyard with one mature tree",
    "topics": [
      "#Wellness",
      "#MentalHealth",
      "#HealthyLifestyle"
    ]
  },
  "56": {
    "title": "Desert Breathwork Circle",
    "subtitle": "A guided breathing practice uses upright seating and a quiet sandstone setting.",
    "location": "Phoenix \xB7 shaded desert pavilion",
    "topics": [
      "#Wellness",
      "#MentalHealth",
      "#HealthyLifestyle"
    ]
  },
  "57": {
    "title": "Aromatic Herb Blending Table",
    "subtitle": "Participants combine dried herbs for simple calming sachets and steam bowls.",
    "location": "San Diego \xB7 bright apothecary-style workshop without labels",
    "topics": [
      "#Wellness",
      "#MentalHealth",
      "#HealthyLifestyle"
    ]
  },
  "58": {
    "title": "Mobility Bands Clinic",
    "subtitle": "A practical session explores shoulder, hip, and ankle range with light resistance.",
    "location": "San Diego \xB7 sunlit neighborhood exercise room",
    "topics": [
      "#Wellness",
      "#MentalHealth",
      "#HealthyLifestyle"
    ]
  },
  "59": {
    "title": "Floating Dock Meditation",
    "subtitle": "A short silent practice follows the movement of water beneath a stable dock.",
    "location": "Seattle \xB7 wide wooden dock on a still forest lake",
    "topics": [
      "#Wellness",
      "#MentalHealth",
      "#HealthyLifestyle"
    ]
  },
  "60": {
    "title": "Restorative Stretch Hall",
    "subtitle": "Long supported stretches use bolsters, blocks, and folded blankets.",
    "location": "San Diego \xB7 renovated old gym with tall windows",
    "topics": [
      "#Wellness",
      "#MentalHealth",
      "#HealthyLifestyle"
    ]
  },
  "61": {
    "title": "Park Hammock Pause",
    "subtitle": "A guided rest meetup alternates short journaling with quiet hammock time.",
    "location": "Los Angeles \xB7 shady grove in a spacious public park",
    "topics": [
      "#Wellness",
      "#MentalHealth",
      "#HealthyLifestyle"
    ]
  },
  "62": {
    "title": "Quiet Tea Mindfulness",
    "subtitle": "A small group practices attentive pouring, aroma, and unhurried silence.",
    "location": "Chicago \xB7 minimal tatami-style community room",
    "topics": [
      "#Wellness",
      "#MentalHealth",
      "#HealthyLifestyle"
    ]
  },
  "63": {
    "title": "Repair Cafe Team Challenge",
    "subtitle": "Small volunteer teams diagnose lamps, radios, and household devices in cooperative timed rounds.",
    "location": "library makerspace repair bench",
    "topics": [
      "#Workshop",
      "#Networking",
      "#Technology"
    ]
  },
  "64": {
    "title": "Civic Mapping Team Qualifier",
    "subtitle": "Mapping teams prepare mobility-gap evidence for a friendly multi-round civic challenge.",
    "location": "municipal workshop room with large tables",
    "topics": [
      "#Workshop",
      "#Networking",
      "#Technology"
    ]
  },
  "65": {
    "title": "Cardboard Prototype Sprint",
    "subtitle": "Small teams turn service ideas into testable tabletop models in one afternoon.",
    "location": "Chicago \xB7 bright innovation studio",
    "topics": [
      "#Workshop",
      "#Networking",
      "#Technology"
    ]
  },
  "66": {
    "title": "Library Mentor Office Hours",
    "subtitle": "Founders and career changers rotate through focused twenty-minute coaching tables.",
    "location": "Seattle \xB7 modern public library mezzanine",
    "topics": [
      "#Workshop",
      "#Networking",
      "#Technology"
    ]
  },
  "67": {
    "title": "Little Havana Courtyard Potluck",
    "subtitle": "Neighbors bring family dishes to one shaded courtyard table with open seating.",
    "location": "Seattle \xB7 colorful tropical residential courtyard",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "68": {
    "title": "Library Mentorship Milestone Map",
    "subtitle": "A spring cohort marks completed projects and pairs up for its next shared task.",
    "location": "Miami \xB7 sunlit library project room",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "69": {
    "title": "Spring Festival Build Crew",
    "subtitle": "Volunteers assemble reusable bunting, route arches, and lightweight decorations.",
    "location": "Austin \xB7 covered civic workshop yard",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "70": {
    "title": "Moonlight Beach Cleanup",
    "subtitle": "An evening shoreline crew sorts recovered material under safe portable lights.",
    "location": "Portland \xB7 broad urban beach after sunset",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "71": {
    "title": "Hillside Community Garden Day",
    "subtitle": "Neighbors repair raised beds, turn compost, and plant a shared herb row.",
    "location": "Nashville \xB7 terraced neighborhood garden",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "72": {
    "title": "Donation Bicycle Repair Bench",
    "subtitle": "Volunteer mechanics prepare donated bicycles for new riders.",
    "location": "Boston \xB7 open community cycle workshop",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "73": {
    "title": "Desert Trail Stewardship",
    "subtitle": "A morning crew clears loose branches and refreshes safe route markers.",
    "location": "Chicago \xB7 dry desert trailhead beneath low mountains",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "74": {
    "title": "Winter Coat Sorting Hall",
    "subtitle": "A neighborhood drive organizes warm clothing by size before collection day.",
    "location": "Denver \xB7 plain school assembly hall",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "75": {
    "title": "Mangrove Seedling Crew",
    "subtitle": "A waterfront team pots young mangroves for a supervised restoration site.",
    "location": "Boston \xB7 shaded coastal nursery platform",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "76": {
    "title": "Riverbank Native Planting",
    "subtitle": "Volunteers stabilize a worn river edge with grasses and young shrubs.",
    "location": "Austin \xB7 muddy urban riverbank in daylight",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "77": {
    "title": "Food Rescue Packing Line",
    "subtitle": "A fast volunteer shift turns surplus produce into balanced family boxes.",
    "location": "Miami \xB7 clean warehouse packing room",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "78": {
    "title": "Mobile Library Book Drive",
    "subtitle": "Neighbors sort donated books and load rolling shelves for a weekend pop-up.",
    "location": "Portland \xB7 community-center loading courtyard",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "79": {
    "title": "Porch Concert Setup Crew",
    "subtitle": "A block team lays cables, arranges chairs, and tests a tiny neighborhood stage.",
    "location": "San Diego \xB7 wide residential porch and closed street",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "80": {
    "title": "Public Mural Wall Prep",
    "subtitle": "The crew cleans, primes, and grids a wall before the artists arrive.",
    "location": "Seattle \xB7 sunny pedestrian underpass wall",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "81": {
    "title": "Night Market Stall Build",
    "subtitle": "Vendors and volunteers assemble modular counters before the evening crowd.",
    "location": "Los Angeles \xB7 brick market square at late afternoon",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "82": {
    "title": "Community Kitchen Batch Cook",
    "subtitle": "A shared kitchen prepares soup, bread, and chopped vegetables for neighborhood delivery.",
    "location": "Nashville \xB7 large stainless community kitchen",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "83": {
    "title": "Harbor Lantern Parade Workshop",
    "subtitle": "Families and volunteers build lightweight lantern forms for a waterfront procession.",
    "location": "Boston \xB7 maritime community hall",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "84": {
    "title": "Mountain Gear Swap Hall",
    "subtitle": "Outdoor neighbors inspect, repair, and exchange clean seasonal equipment.",
    "location": "Denver \xB7 timber recreation hall near foothills",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "85": {
    "title": "Ferry Welcome Volunteer Team",
    "subtitle": "A local crew prepares maps, water, and luggage help for arriving visitors.",
    "location": "Chicago \xB7 covered ferry-terminal plaza",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "86": {
    "title": "Inclusive Beach Access Setup",
    "subtitle": "Volunteers install a temporary access mat and prepare adaptive beach equipment.",
    "location": "San Diego \xB7 public beach access point in morning light",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "87": {
    "title": "Rooftop Pollinator Garden Day",
    "subtitle": "Residents refresh planters with herbs and flowers for urban bees and butterflies.",
    "location": "Seattle \xB7 broad apartment rooftop garden",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "88": {
    "title": "Community Makerspace Tool Sort",
    "subtitle": "Members inventory donated hand tools and rebuild clear shared workstations.",
    "location": "Portland \xB7 industrial neighborhood makerspace",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "89": {
    "title": "Desert Water Refill Crew",
    "subtitle": "A trail-support team cleans containers and prepares shaded refill points.",
    "location": "Phoenix \xB7 sunlit desert service yard",
    "topics": [
      "#Community",
      "#Volunteering",
      "#Festival"
    ]
  },
  "90": {
    "title": "Terrace Newcomer Exchange",
    "subtitle": "New arrivals use object-based prompts to start natural small-group conversations.",
    "location": "Austin \xB7 layered city terrace with planted dividers",
    "topics": [
      "#Social",
      "#Friends",
      "#Community"
    ]
  },
  "91": {
    "title": "Neon Bowling Introductions",
    "subtitle": "Pairs change lanes between short games and cheer unfamiliar teammates.",
    "location": "San Diego \xB7 retro bowling hall with abstract neon light",
    "topics": [
      "#Social",
      "#Friends",
      "#Community"
    ]
  },
  "92": {
    "title": "Gallery Courtyard Mixer",
    "subtitle": "A casual opening brings artists, neighbors, and first-time visitors around outdoor sculptures.",
    "location": "Los Angeles \xB7 white-walled gallery courtyard",
    "topics": [
      "#Social",
      "#Friends",
      "#Community"
    ]
  },
  "93": {
    "title": "Desert Patio Language Exchange",
    "subtitle": "Conversation partners switch between short rounds over mint tea.",
    "location": "Phoenix \xB7 shaded adobe patio with woven chairs",
    "topics": [
      "#Social",
      "#Friends",
      "#Community"
    ]
  },
  "94": {
    "title": "Golden Hour Rooftop Meetup",
    "subtitle": "Sunset check-in games lead into relaxed skyline conversations.",
    "location": "Austin \xB7 open rooftop garden during golden hour",
    "topics": [
      "#Social",
      "#Friends",
      "#Community"
    ]
  },
  "95": {
    "title": "Greenhouse Neighbor Tea",
    "subtitle": "Residents from nearby blocks meet among citrus trees and shared tea trays.",
    "location": "Seattle \xB7 community greenhouse in soft rain",
    "topics": [
      "#Social",
      "#Friends",
      "#Community"
    ]
  },
  "96": {
    "title": "Bookshop Speed-Friending",
    "subtitle": "Short paired conversations move through reading nooks instead of one crowded line.",
    "location": "Austin \xB7 independent bookshop after closing",
    "topics": [
      "#Social",
      "#Friends",
      "#Community"
    ]
  },
  "97": {
    "title": "Telescope Lawn Social",
    "subtitle": "A twilight gathering alternates constellation viewing with blanket conversations.",
    "location": "Los Angeles \xB7 open science-center lawn at dusk",
    "topics": [
      "#Social",
      "#Friends",
      "#Community"
    ]
  },
  "98": {
    "title": "Riverside Picnic Pairings",
    "subtitle": "Blanket groups reshuffle after each shared snack course.",
    "location": "Seattle \xB7 grassy riverbank with mature trees",
    "topics": [
      "#Social",
      "#Friends",
      "#Community"
    ]
  },
  "99": {
    "title": "Museum After-Hours Trail",
    "subtitle": "Conversation pairs follow light-and-shadow installations through a quiet museum wing.",
    "location": "Austin \xB7 contemporary museum interior at night",
    "topics": [
      "#Social",
      "#Friends",
      "#Community"
    ]
  },
  "100": {
    "title": "Community Dessert Social",
    "subtitle": "Neighbors decorate small cakes together before sharing a long final table.",
    "location": "Seattle \xB7 warm community kitchen dining room",
    "topics": [
      "#Social",
      "#Friends",
      "#Community"
    ]
  }
};
var EVENT_SLOT_BY_SEED = {
  "demo-event-events:u1:e1": 2,
  "demo-event-events:u1:e10": 94,
  "demo-event-events:u1:e11": 8,
  "demo-event-events:u1:e12": 69,
  "demo-event-events:u1:e7": 48,
  "demo-event-events:u1:e9": 31,
  "demo-event-events:u10:e2": 52,
  "demo-event-events:u12:e8": 15,
  "demo-event-events:u2:checkout-paid-slots": 97,
  "demo-event-events:u2:e13": 38,
  "demo-event-events:u2:e4": 7,
  "demo-event-events:u2:waitlist-full-policy": 34,
  "demo-event-events:u3:active-tournament-slots": 4,
  "demo-event-events:u3:asset-join-demo-nagy-eszter": 67,
  "demo-event-events:u3:checkout-free-slots": 72,
  "demo-event-events:u3:checkout-paid-policy": 75,
  "demo-event-events:u3:e14": 98,
  "demo-event-events:u3:e3": 9,
  "demo-event-events:u3:e5": 47,
  "demo-event-events:u3:feedback-showcase-nagy-eszter-social": 100,
  "demo-event-events:u3:feedback-showcase-nagy-eszter-studio": 51,
  "demo-event-events:u3:waitlist-full-free": 42,
  "demo-event-events:u4:e6": 13,
  "demo-event-hosting:u1:h1": 3,
  "demo-event-hosting:u1:h2": 80,
  "demo-event-hosting:u2:h3": 6,
  "demo-event-hosting:u3:h4": 46,
  "demo-event-invitations:u1:i1": 41,
  "demo-event-invitations:u1:i2": 5,
  "demo-event-invitations:u1:i3": 1,
  "demo-event-invitations:u2:i4": 37,
  "demo-event-invitations:u3:i5": 11
};
function demoAssetPlaceholder(seed) {
  const slot = demoAssetSlot(seed);
  const definition = ASSET_DEFINITION_BY_SLOT[slot] ?? ASSET_DEFINITION_BY_SLOT[1];
  return __spreadProps(__spreadValues({}, definition), {
    slot,
    imageUrl: `https://picsum.photos/id/${ASSET_PICSUM_IDS[slot - 1]}/1200/700`,
    visibility: ASSET_RECORD_BY_SLOT[slot]?.visibility ?? "Public",
    status: ASSET_RECORD_BY_SLOT[slot]?.status ?? "A"
  });
}
function demoAssetPlaceholderUrl(seed) {
  return demoAssetPlaceholder(seed).imageUrl;
}
function demoAssetTemplateIds(ownerUserId) {
  return ASSET_TEMPLATE_IDS_BY_OWNER[ownerUserId.trim().toLowerCase()] ?? [];
}
function demoAssetSlot(seed) {
  const normalized = seed.trim().toLowerCase();
  const exactSlot = ASSET_SLOT_BY_SEED[normalized];
  if (exactSlot)
    return exactSlot;
  const template = Object.keys(ASSET_SLOTS_BY_TEMPLATE).find((key) => normalized.includes(key));
  const candidates = template ? ASSET_SLOTS_BY_TEMPLATE[template] : [1];
  const candidateIndex = stableIndex(normalized, candidates.length);
  return candidates[candidateIndex] ?? 1;
}
function demoEventPlaceholder(seed) {
  const normalized = seed.trim().toLowerCase();
  const slot = EVENT_SLOT_BY_SEED[normalized] ?? stableIndex(normalized, EVENT_PICSUM_IDS.length) + 1;
  const definition = EVENT_DEFINITION_BY_SLOT[slot] ?? EVENT_DEFINITION_BY_SLOT[1];
  return __spreadProps(__spreadValues({}, definition), {
    topics: [...definition.topics],
    slot,
    imageUrl: `https://picsum.photos/id/${EVENT_PICSUM_IDS[slot - 1]}/1200/700`
  });
}
function demoEventPlaceholderUrl(seed) {
  return demoEventPlaceholder(seed).imageUrl;
}
function stableIndex(seed, length) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % Math.max(1, length);
}

// src/app/shared/core/local/seed/builders/admin/admin-help-seed.builder.ts
var AdminHelpSeedBuilder = class {
  static demoAdminHelpTargets() {
    const eventPreviewUrl = demoEventPlaceholderUrl("demo-event-events:u1:e1:alpine-weekend-2.0");
    const assetPreviewUrl = demoAssetPlaceholderUrl("asset-sup-2");
    return [
      {
        key: "current",
        messageId: "m-admin-help-u1",
        attachmentId: "admin-help:u1:current",
        attachmentType: "link",
        attachmentEntityId: "",
        title: "Open shared help view",
        subtitle: "Limited-time support token",
        description: "",
        text: "Please help me, I am sharing my current MyScoutee screen with support.",
        targetUrl: "/game"
      },
      {
        key: "events",
        messageId: "m-admin-help-u1-events",
        attachmentId: "admin-help:u1:events",
        attachmentType: "event",
        attachmentEntityId: "e1",
        title: "Alpine Cabin Supper",
        subtitle: "Feb 27 - Mar 1",
        description: "A small ski group winds down over soup while wet gloves and boots dry by the stove.",
        previewUrl: eventPreviewUrl,
        text: "Please check what I see on this event screen.",
        targetUrl: "/game?supportTarget=event&eventId=e1"
      },
      {
        key: "asset-supplies",
        messageId: "m-admin-help-u1-asset-supplies",
        attachmentId: "admin-help:u1:asset-supplies",
        attachmentType: "asset",
        attachmentEntityId: "asset-sup-2",
        assetType: ASSET_TYPE_SUPPLIES,
        title: "Game Night Box",
        subtitle: `${ASSET_TYPE_SUPPLIES} - Austin`,
        description: "Board games, cards, and speakers ready for the venue.",
        previewUrl: assetPreviewUrl,
        text: "Please check this shared asset screen.",
        targetUrl: `/game?supportTarget=asset&assetFilter=${ASSET_TYPE_SUPPLIES}&assetId=asset-sup-2&assetTitle=Game%20Night%20Box&assetSubtitle=Board%20games%20%2B%20cards%20%2B%20speakers&assetCity=Austin&assetDetails=Board%20games%2C%20cards%2C%20and%20speakers%20ready%20for%20the%20venue.&assetPreview=${encodeURIComponent(assetPreviewUrl)}`
      }
    ];
  }
};

// src/app/shared/core/local/seed/builders/admin/admin-moderation-seed.builder.ts
var AdminModerationSeedBuilder = class {
  static buildSeedDemoModerationStore(context) {
    return {
      seededAtIso: (/* @__PURE__ */ new Date()).toISOString(),
      reports: [
        {
          id: "admin-demo-report-chat-kai-001",
          reporterUserId: "u1",
          reporterName: "Farkas Anna",
          reporterImageUrl: context.userImageUrl("u1"),
          targetUserId: "u5",
          handle: "Lina Park",
          reason: "Harassment",
          details: "The reported chat message made another event member feel unsafe and should be reviewed by moderation.",
          eventId: "a11a802ee0714a21db94ed4e",
          eventTitle: "Alpine Cabin Supper",
          eventStartAtIso: "2026-03-04T09:45:00.000Z",
          sourceType: "chat",
          sourceId: "c1-4",
          sourceText: "I can take one extra seat from downtown pickup.",
          chatId: "c1",
          messageId: "c1-4",
          chatTitle: "Driver Split - Alpine Cabin Supper",
          chatMessages: context.chatMessages("u1", "c1"),
          createdDate: "2026-04-25T11:12:00.000Z"
        },
        {
          id: "admin-demo-report-event-kai-002",
          reporterUserId: "u1",
          reporterName: "Farkas Anna",
          reporterImageUrl: context.userImageUrl("u1"),
          targetUserId: "u5",
          handle: "Lina Park",
          reason: "No-show / unsafe event behavior",
          details: "The user repeatedly joined event plans and disrupted logistics without updating the host.",
          eventId: "a11a802ee0714a21db94ed4e",
          eventTitle: "Alpine Cabin Supper",
          eventStartAtIso: "2026-03-04T09:45:00.000Z",
          sourceType: "event",
          sourceId: "a11a802ee0714a21db94ed4e",
          sourceText: "Host reported repeated logistics disruption before Alpine Cabin Supper.",
          createdDate: "2026-04-26T16:35:00.000Z"
        },
        {
          id: "admin-demo-report-asset-kai-003",
          reporterUserId: "u4",
          reporterName: "Maya Stone",
          reporterImageUrl: context.userImageUrl("u4"),
          targetUserId: "u5",
          handle: "Lina Park",
          reason: "Asset misuse",
          details: "Asset owner asked moderation to review a supplies request before approving future resource sharing.",
          eventId: "indoor-strategy-social-event",
          eventTitle: "Indoor Strategy Social",
          eventStartAtIso: "2026-05-02T17:30:00.000Z",
          sourceType: "asset",
          sourceId: "f7b9be40d648a5448d018308",
          sourceText: "Game Night Box request needs moderation review.",
          assetId: "f7b9be40d648a5448d018308",
          assetType: ASSET_TYPE_SUPPLIES,
          createdDate: "2026-04-27T09:20:00.000Z"
        }
      ],
      feedback: [
        {
          id: "admin-demo-feedback-report-status-001",
          userId: "u1",
          userName: "Farkas Anna",
          category: "UX improvement",
          subject: "Need clearer report status",
          details: "After reporting a user, I would like to see whether moderation has reviewed the report.",
          createdDate: "2026-04-24T13:20:00.000Z"
        },
        {
          id: "admin-demo-feedback-event-warn-002",
          userId: "u5",
          userName: "Lina Park",
          category: "Feature request",
          subject: "Review event behavior faster",
          details: "Hosts need a way to warn members before blocking them from future participation.",
          createdDate: "2026-04-23T18:05:00.000Z"
        }
      ]
    };
  }
};

// src/app/shared/core/local/seed/builders/admin/admin-monitoring-seed.builder.ts
var AdminMonitoringSeedBuilder = class {
  static buildDefaultMonitoringState() {
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const node = (id, labelKey, icon, kind, tone, metrics) => ({ id, labelKey, icon, kind, tone, metrics });
    const edge = (from, to, labelKey, tone, volume) => ({ from, to, labelKey, tone, volume });
    const category = (key, labelKey, summaryKey, icon, tone, health, total, nodes, edges) => ({ key, labelKey, summaryKey, icon, tone, health, total, nodes, edges });
    return {
      generatedAtIso: nowIso,
      source: "demo",
      health: "watch",
      categories: [
        category("users", "admin.monitoring.category.users", "admin.monitoring.category.users.summary", "person", "blue", "watch", 84, [
          node("users.ui", "admin.monitoring.node.profile.ui", "person", "source", "blue", [
            this.monitoringMetric("profile-writes", "admin.monitoring.metric.profile.writes", 84, "blue", "ok")
          ]),
          node("users.model", "admin.monitoring.node.profile.model", "badge", "writeModel", "green", [
            this.monitoringMetric("registered", "admin.monitoring.metric.registered", 29, "green", "ok"),
            this.monitoringMetric("deleted", "admin.monitoring.metric.deleted", 7, "slate", "watch")
          ]),
          node("users.status", "admin.monitoring.node.status.propagation", "rule", "worker", "gold", [
            this.monitoringMetric("status-propagation-signals", "admin.monitoring.metric.status.propagation.signals", 12, "gold", "watch")
          ]),
          node("users.purge", "admin.monitoring.node.account.purge", "delete_sweep", "storage", "slate", [
            this.monitoringMetric("purge-signals", "admin.monitoring.metric.purge.signals", 2, "slate", "ok")
          ])
        ], [
          edge("users.ui", "users.model", "admin.monitoring.edge.write.path", "blue", 84),
          edge("users.model", "users.status", "admin.monitoring.edge.status.propagation", "gold", 12),
          edge("users.status", "users.purge", "admin.monitoring.edge.gdpr.window", "slate", 2)
        ]),
        category("events", "admin.monitoring.category.events", "admin.monitoring.category.events.summary", "event_available", "green", "watch", 91, [
          node("events.ui", "admin.monitoring.node.event.ui", "edit_calendar", "source", "blue", [
            this.monitoringMetric("event-writes", "admin.monitoring.metric.event.writes", 73, "blue", "ok")
          ]),
          node("events.model", "admin.monitoring.node.event.model", "storage", "writeModel", "green", [
            this.monitoringMetric("event-model", "admin.monitoring.metric.persisted.events", 28, "green", "ok")
          ]),
          node("events.recompute", "admin.monitoring.node.recompute.queue", "sync_alt", "queue", "gold", [
            this.monitoringMetric("recompute-pending", "admin.monitoring.metric.recompute.pending", 18, "gold", "watch")
          ]),
          node("events.outbox", "admin.monitoring.node.notification.outbox", "outbox", "outbox", "purple", [
            this.monitoringMetric("outbox-pending", "admin.monitoring.metric.outbox.pending", 36, "purple", "watch")
          ])
        ], [
          edge("events.ui", "events.model", "admin.monitoring.edge.write.path", "blue", 73),
          edge("events.model", "events.recompute", "admin.monitoring.edge.recompute", "gold", 18),
          edge("events.recompute", "events.outbox", "admin.monitoring.edge.visible.changes", "purple", 36)
        ]),
        category("members", "admin.monitoring.category.members", "admin.monitoring.category.members.summary", "groups", "blue", "watch", 54, [
          node("members.ui", "admin.monitoring.node.member.ui", "group_add", "source", "blue", [
            this.monitoringMetric("member-changes", "admin.monitoring.metric.member.changes", 37, "blue", "ok")
          ]),
          node("members.model", "admin.monitoring.node.member.model", "fact_check", "writeModel", "green", [
            this.monitoringMetric("accepted-members", "admin.monitoring.metric.accepted.members", 128, "green", "ok")
          ]),
          node("members.inviter", "admin.monitoring.node.auto.inviter", "person_add", "worker", "gold", [
            this.monitoringMetric("invites", "admin.monitoring.metric.invites", 17, "gold", "ok")
          ]),
          node("members.outbox", "admin.monitoring.node.notification.outbox", "outbox", "outbox", "purple", [
            this.monitoringMetric("pending-notifications", "admin.monitoring.metric.outbox.pending", 36, "purple", "watch")
          ])
        ], [
          edge("members.ui", "members.model", "admin.monitoring.edge.membership.write", "blue", 37),
          edge("members.model", "members.inviter", "admin.monitoring.edge.capacity.gate", "gold", 17),
          edge("members.inviter", "members.outbox", "admin.monitoring.edge.invite.delivery", "purple", 36)
        ]),
        category("assets", "admin.monitoring.category.assets", "admin.monitoring.category.assets.summary", "inventory_2", "gold", "watch", 39, [
          node("assets.ui", "admin.monitoring.node.asset.ui", "inventory_2", "source", "gold", [
            this.monitoringMetric("asset-writes", "admin.monitoring.metric.asset.writes", 28, "gold", "ok")
          ]),
          node("assets.model", "admin.monitoring.node.asset.model", "storage", "writeModel", "green", [
            this.monitoringMetric("requests", "admin.monitoring.metric.asset.requests", 14, "green", "ok")
          ]),
          node("assets.recompute", "admin.monitoring.node.recompute.queue", "sync_alt", "queue", "blue", [
            this.monitoringMetric("recompute-pending", "admin.monitoring.metric.recompute.pending", 18, "blue", "watch")
          ]),
          node("assets.outbox", "admin.monitoring.node.notification.outbox", "outbox", "outbox", "purple", [
            this.monitoringMetric("borrower-updates", "admin.monitoring.metric.borrower.updates", 12, "purple", "watch")
          ])
        ], [
          edge("assets.ui", "assets.model", "admin.monitoring.edge.write.path", "gold", 28),
          edge("assets.model", "assets.recompute", "admin.monitoring.edge.recompute", "blue", 18),
          edge("assets.recompute", "assets.outbox", "admin.monitoring.edge.availability.delivery", "purple", 12)
        ]),
        category("matching", "admin.monitoring.category.matching", "admin.monitoring.category.matching.summary", "hub", "purple", "watch", 342, [
          node("matching.rates", "admin.monitoring.node.rates", "star", "source", "purple", [
            this.monitoringMetric("rates-synced", "admin.monitoring.metric.rates.synced", 342, "purple", "ok")
          ]),
          node("matching.queue", "admin.monitoring.node.recompute.queue", "pending_actions", "queue", "gold", [
            this.monitoringMetric("recompute-pending", "admin.monitoring.metric.recompute.pending", 18, "gold", "watch"),
            this.monitoringMetric("recompute-running", "admin.monitoring.metric.recompute.running", 2, "blue", "ok")
          ]),
          node("matching.worker", "admin.monitoring.node.affinity.worker", "ssid_chart", "worker", "blue", [
            this.monitoringMetric("affinity-updates", "admin.monitoring.metric.affinity.updates", 318, "blue", "ok")
          ]),
          node("matching.read", "admin.monitoring.node.discovery.read.model", "travel_explore", "readModel", "green", [
            this.monitoringMetric("visible-scores", "admin.monitoring.metric.visible.scores", 318, "green", "ok")
          ])
        ], [
          edge("matching.rates", "matching.queue", "admin.monitoring.edge.recompute", "gold", 342),
          edge("matching.queue", "matching.worker", "admin.monitoring.edge.worker.pickup", "blue", 2),
          edge("matching.worker", "matching.read", "admin.monitoring.edge.read.model", "green", 318)
        ]),
        category("chat", "admin.monitoring.category.chat", "admin.monitoring.category.chat.summary", "forum", "blue", "watch", 426, [
          node("chat.ui", "admin.monitoring.node.chat.ui", "chat", "source", "blue", [
            this.monitoringMetric("messages", "admin.monitoring.metric.messages", 417, "blue", "ok")
          ]),
          node("chat.stream", "admin.monitoring.node.chat.stream", "stream", "writeModel", "green", [
            this.monitoringMetric("stream-events", "admin.monitoring.metric.stream.events", 417, "green", "ok")
          ]),
          node("chat.attachments", "admin.monitoring.node.attachment.lifecycle", "attachment", "storage", "gold", [
            this.monitoringMetric("attachment-checks", "admin.monitoring.metric.attachment.checks", 23, "gold", "ok")
          ]),
          node("chat.outbox", "admin.monitoring.node.notification.outbox", "outbox", "outbox", "purple", [
            this.monitoringMetric("push-pending", "admin.monitoring.metric.outbox.pending", 36, "purple", "watch")
          ])
        ], [
          edge("chat.ui", "chat.stream", "admin.monitoring.edge.write.path", "blue", 417),
          edge("chat.stream", "chat.attachments", "admin.monitoring.edge.attachment.lifecycle", "gold", 23),
          edge("chat.stream", "chat.outbox", "admin.monitoring.edge.push.intent", "purple", 36)
        ]),
        category("notifications", "admin.monitoring.category.notifications", "admin.monitoring.category.notifications.summary", "notifications_active", "red", "alert", 87, [
          node("notifications.intent", "admin.monitoring.node.notification.intent", "edit_notifications", "source", "blue", [
            this.monitoringMetric("intents", "admin.monitoring.metric.notification.intents", 87, "blue", "ok")
          ]),
          node("notifications.outbox", "admin.monitoring.node.notification.outbox", "outbox", "outbox", "purple", [
            this.monitoringMetric("outbox-pending", "admin.monitoring.metric.outbox.pending", 36, "purple", "watch"),
            this.monitoringMetric("outbox-failed", "admin.monitoring.metric.outbox.failed", 3, "red", "alert")
          ]),
          node("notifications.firebase", "admin.monitoring.node.firebase", "cloud_upload", "external", "gold", [
            this.monitoringMetric("sent", "admin.monitoring.metric.outbox.sent", 48, "green", "ok")
          ]),
          node("notifications.tokens", "admin.monitoring.node.device.tokens", "phonelink_ring", "storage", "green", [
            this.monitoringMetric("token-cleanup", "admin.monitoring.metric.token.cleanup", 9, "green", "ok")
          ])
        ], [
          edge("notifications.intent", "notifications.outbox", "admin.monitoring.edge.outbox.persist", "purple", 87),
          edge("notifications.outbox", "notifications.firebase", "admin.monitoring.edge.firebase.batch", "gold", 48),
          edge("notifications.firebase", "notifications.tokens", "admin.monitoring.edge.token.cleanup", "green", 9)
        ]),
        category("jobs", "admin.monitoring.category.jobs", "admin.monitoring.category.jobs.summary", "pending_actions", "slate", "ok", 16, [
          node("jobs.admin", "admin.monitoring.node.admin.ui", "admin_panel_settings", "source", "slate", [
            this.monitoringMetric("admin-changes", "admin.monitoring.metric.admin.changes", 16, "slate", "ok")
          ]),
          node("jobs.config", "admin.monitoring.node.job.config", "tune", "writeModel", "blue", [
            this.monitoringMetric("config-changes", "admin.monitoring.metric.config.changes", 7, "blue", "ok")
          ]),
          node("jobs.scheduler", "admin.monitoring.node.scheduler", "schedule", "worker", "gold", [
            this.monitoringMetric("scheduled-triggers", "admin.monitoring.metric.scheduled.triggers", 9, "gold", "ok")
          ]),
          node("jobs.audit", "admin.monitoring.node.audit.trail", "history", "storage", "green", [
            this.monitoringMetric("audit-events", "admin.monitoring.metric.audit.events", 16, "green", "ok")
          ])
        ], [
          edge("jobs.admin", "jobs.config", "admin.monitoring.edge.config.write", "blue", 16),
          edge("jobs.config", "jobs.scheduler", "admin.monitoring.edge.worker.pickup", "gold", 9),
          edge("jobs.scheduler", "jobs.audit", "admin.monitoring.edge.audit", "green", 16)
        ])
      ]
    };
  }
  static monitoringMetric(key, labelKey, value, tone, status) {
    const normalizedValue = Math.max(0, Math.trunc(Number(value) || 0));
    const valueLabel = this.compactNumber(normalizedValue);
    return {
      key,
      labelKey,
      value: normalizedValue,
      valueLabel,
      tone,
      status,
      detailRows: [{
        key: "value",
        labelKey,
        valueLabel,
        tone
      }]
    };
  }
  static compactNumber(value) {
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    }
    if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}k`;
    }
    return String(value);
  }
};

// src/app/shared/core/local/seed/builders/admin/admin-notifications-seed.builder.ts
var ADMIN_NOTIFICATION_INTERVAL_UNIT = {
  seconds: "seconds",
  minutes: "minutes",
  hours: "hours",
  days: "days",
  weeks: "weeks",
  months: "months",
  years: "years"
};
var ADMIN_NOTIFICATION_INTERVAL_SECONDS = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  weeks: 604800,
  months: 2592e3,
  years: 31536e3
};
var AdminNotificationsSeedBuilder = class {
  static buildDefaultNotificationCenter() {
    return {
      rules: [
        this.defaultNotificationRule({
          ruleKey: "event-random-groups",
          label: "admin.jobs.rule.event.random.groups",
          category: "admin.jobs.category.scheduled",
          description: "admin.jobs.rule.event.random.groups.description",
          actionKey: "event.scheduler.random-groups",
          triggerKind: "scheduled_process",
          enabled: true,
          manualRunEnabled: true,
          adminManageable: true,
          priority: 200,
          pushEnabled: false,
          emailEnabled: false,
          timingMode: "interval",
          intervalMinutes: 1440,
          startTime: "09:00",
          parameters: this.notificationRuleParameters("event-random-groups")
        }),
        this.defaultNotificationRule({
          ruleKey: "event-auto-inviter",
          label: "admin.jobs.rule.event.auto.inviter",
          category: "admin.jobs.category.scheduled",
          description: "admin.jobs.rule.event.auto.inviter.description",
          actionKey: "event.scheduler.auto-inviter",
          triggerKind: "scheduled_process",
          enabled: true,
          manualRunEnabled: false,
          adminManageable: true,
          priority: 210,
          pushEnabled: false,
          emailEnabled: false,
          timingMode: "interval",
          intervalMinutes: 120,
          startTime: "00:00",
          parameters: this.notificationRuleParameters("event-auto-inviter")
        }),
        this.defaultNotificationRule({
          ruleKey: "event-tournament-review",
          label: "admin.jobs.rule.event.tournament.review",
          category: "admin.jobs.category.scheduled",
          description: "admin.jobs.rule.event.tournament.review.description",
          actionKey: "event.scheduler.tournament-review",
          triggerKind: "scheduled_process",
          enabled: true,
          manualRunEnabled: false,
          adminManageable: true,
          priority: 220,
          pushEnabled: false,
          emailEnabled: false,
          timingMode: "interval",
          intervalMinutes: 30,
          startTime: "00:00",
          parameters: this.notificationRuleParameters("event-tournament-review")
        }),
        this.defaultNotificationRule({
          ruleKey: "event-counter-expiry",
          label: "admin.jobs.rule.event.counter.expiry",
          category: "admin.jobs.category.scheduled",
          description: "admin.jobs.rule.event.counter.expiry.description",
          actionKey: "event.counter.expiry",
          triggerKind: "scheduled_process",
          enabled: true,
          manualRunEnabled: false,
          adminManageable: true,
          priority: 225,
          pushEnabled: false,
          emailEnabled: false,
          timingMode: "interval",
          intervalMinutes: 5,
          startTime: "00:00"
        }),
        this.defaultNotificationRule({
          ruleKey: "event-checkout-basket-purge",
          label: "admin.jobs.rule.event.checkout.basket.purge",
          category: "admin.jobs.category.scheduled",
          description: "admin.jobs.rule.event.checkout.basket.purge.description",
          actionKey: "event.checkout.basket.purge",
          triggerKind: "scheduled_process",
          enabled: true,
          manualRunEnabled: false,
          adminManageable: true,
          priority: 228,
          pushEnabled: false,
          emailEnabled: false,
          timingMode: "interval",
          intervalMinutes: 1,
          startTime: "00:00"
        }),
        this.defaultNotificationRule({
          ruleKey: "notification-outbox",
          label: "admin.jobs.rule.notification.outbox",
          category: "admin.jobs.category.scheduled",
          description: "admin.jobs.rule.notification.outbox.description",
          actionKey: "notifications.outbox.worker",
          triggerKind: "scheduled_process",
          enabled: true,
          manualRunEnabled: false,
          adminManageable: true,
          priority: 230,
          pushEnabled: false,
          emailEnabled: false,
          timingMode: "interval",
          intervalMinutes: 1,
          startTime: "00:00"
        }),
        this.defaultNotificationRule({
          ruleKey: "payment-method-expiry",
          label: "admin.jobs.rule.payment.method.expiry",
          category: "admin.jobs.category.scheduled",
          description: "admin.jobs.rule.payment.method.expiry.description",
          actionKey: "payment.method.expiry",
          triggerKind: "scheduled_process",
          enabled: true,
          manualRunEnabled: false,
          adminManageable: true,
          priority: 235,
          pushEnabled: false,
          emailEnabled: false,
          timingMode: "interval",
          intervalMinutes: 1440,
          startTime: "02:15"
        }),
        this.defaultNotificationRule({
          ruleKey: "affinity-recompute",
          label: "admin.jobs.rule.affinity.recompute",
          category: "admin.jobs.category.scheduled",
          description: "admin.jobs.rule.affinity.recompute.description",
          actionKey: "affinity.recompute.worker",
          triggerKind: "scheduled_process",
          enabled: true,
          manualRunEnabled: false,
          adminManageable: true,
          priority: 240,
          pushEnabled: false,
          emailEnabled: false,
          timingMode: "interval",
          intervalMinutes: 1,
          startTime: "00:00"
        }),
        this.defaultNotificationRule({
          ruleKey: "affinity-graph-layout",
          label: "admin.jobs.rule.affinity.graph.layout",
          category: "admin.jobs.category.scheduled",
          description: "admin.jobs.rule.affinity.graph.layout.description",
          actionKey: "affinity.graph.layout.rebuild",
          triggerKind: "scheduled_process",
          enabled: true,
          manualRunEnabled: false,
          adminManageable: true,
          priority: 245,
          pushEnabled: false,
          emailEnabled: false,
          timingMode: "interval",
          intervalMinutes: 1440,
          startTime: "00:00"
        }),
        this.defaultNotificationRule({
          ruleKey: "scheduled-messages",
          label: "admin.jobs.rule.scheduled.messages",
          category: "admin.jobs.category.scheduled",
          description: "admin.jobs.rule.scheduled.messages.description",
          actionKey: "scheduled.messages.worker",
          triggerKind: "scheduled_process",
          enabled: true,
          manualRunEnabled: false,
          adminManageable: true,
          priority: 250,
          pushEnabled: false,
          emailEnabled: false,
          timingMode: "interval",
          intervalMinutes: 30,
          startTime: "00:00"
        }),
        this.defaultNotificationRule({
          ruleKey: "account-purge",
          label: "admin.jobs.rule.account.purge",
          category: "admin.jobs.category.scheduled",
          description: "admin.jobs.rule.account.purge.description",
          actionKey: "users.deleted-account-purge",
          triggerKind: "scheduled_process",
          enabled: true,
          manualRunEnabled: false,
          adminManageable: true,
          priority: 260,
          pushEnabled: false,
          emailEnabled: false,
          timingMode: "interval",
          intervalMinutes: 1440,
          startTime: "02:00"
        })
      ],
      emailTemplates: this.defaultNotificationTemplateOptions(),
      updatedDate: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  static notificationRuleParameters(ruleKey) {
    switch (`${ruleKey ?? ""}`.trim()) {
      case "event-random-groups":
        return [
          this.jobNumberParam("jobs.process.randomGroups.minRoomSize", "Min room size", "Matched rooms", 2, ""),
          this.jobNumberParam("jobs.process.randomGroups.maxRoomSize", "Max room size", "Matched rooms", 4, "")
        ];
      case "event-auto-inviter":
        return [
          this.jobNumberParam("jobs.process.autoInviter.batchSize", "Invite batch size", "Auto inviter", 4, ""),
          this.jobNumberParam("jobs.process.autoInviter.responseWindowHours", "Response window", "Auto inviter", 2, "h"),
          this.jobNumberParam("jobs.process.autoInviter.candidateLookahead", "Candidate lookahead", "Auto inviter", 24, "h")
        ];
      case "event-tournament-review":
        return [
          this.jobNumberParam("jobs.process.tournament.adminReminderHours", "Admin reminder", "Tournament", 2, "h"),
          this.jobNumberParam("jobs.process.tournament.scoreReviewHours", "Score review window", "Tournament", 2, "h")
        ];
      default:
        return [];
    }
  }
  static jobNumberParam(key, label, group, numberValue, unit, strategy = "", readOnly = false) {
    return {
      key,
      label,
      labelKey: this.paramFieldLabelKey(key),
      group,
      groupKey: this.paramGroupLabelKey(group),
      valueType: "number",
      numberValue,
      textValue: null,
      unit,
      options: [],
      strategy,
      strategyKey: this.paramStrategyLabelKey(strategy),
      readOnly
    };
  }
  static defaultNotificationRule(options) {
    const interval = this.notificationInterval(options.intervalMinutes ?? 60);
    const startTime = this.normalizeNotificationTime(options.startTime);
    return {
      ruleKey: options.ruleKey,
      label: options.label,
      category: options.category,
      description: options.description,
      actionKey: options.actionKey,
      triggerKind: options.triggerKind,
      enabled: options.enabled,
      manualRunEnabled: options.manualRunEnabled,
      adminManageable: options.adminManageable !== false,
      priority: options.priority,
      channels: {
        pushEnabled: options.pushEnabled,
        emailEnabled: options.emailEnabled,
        inAppEnabled: false,
        supportChatEnabled: false
      },
      timing: {
        mode: options.timingMode,
        delayMinutes: 0,
        intervalMinutes: interval.minutes,
        intervalSeconds: interval.seconds,
        intervalAmount: interval.amount,
        intervalUnit: interval.unit,
        month: options.month ?? 1,
        dayOfMonth: options.dayOfMonth ?? 1,
        time: startTime,
        timezone: "UTC",
        cronExpression: this.intervalExpression(interval.amount, interval.unit, startTime)
      },
      scheduleSlots: options.scheduleSlots ?? [],
      parameters: options.parameters ?? [],
      message: {
        pushTitle: options.emailSubject ?? "",
        pushBody: options.emailBody ?? "",
        emailTemplateKey: "",
        emailSubject: options.emailSubject ?? "",
        emailBody: options.emailBody ?? "",
        ctaPath: "/game"
      },
      runState: {
        currentStatus: options.enabled ? "idle" : "suspended",
        progressPercent: 0,
        progressDetail: "",
        startedAtIso: "",
        finishedAtIso: "",
        durationMillis: 0,
        lastRunAtIso: "",
        nextRunAtIso: "",
        lastRunStatus: "",
        lastRunDetail: "",
        lastRunCount: 0,
        lastRunUser: "",
        pendingCount: 0,
        pendingCountUnit: "",
        pendingCountUpdatedAtIso: ""
      },
      runHistory: [],
      updatedDate: "",
      updatedUser: ""
    };
  }
  static defaultNotificationTemplateOptions() {
    return [
      {
        templateKey: "email-template-promo-profile-completion-v1",
        name: "Profile completion reminder",
        category: "promotional",
        description: "Promotional reminder for incomplete active profiles."
      },
      {
        templateKey: "email-template-promo-first-host-event-v1",
        name: "First host event prompt",
        category: "promotional",
        description: "Promotional reminder for members who have not hosted yet."
      },
      {
        templateKey: "email-template-promo-country-broadcast-v1",
        name: "Country broadcast",
        category: "promotional",
        description: "Reusable country-level promotional email."
      }
    ];
  }
  static notificationInterval(minutesValue) {
    const seconds = Math.max(1, Math.trunc(Number(minutesValue) || 60) * 60);
    const unit = this.fixedNotificationIntervalUnit(seconds);
    return {
      amount: Math.max(1, Math.trunc(seconds / ADMIN_NOTIFICATION_INTERVAL_SECONDS[unit])),
      unit,
      seconds,
      minutes: Math.max(1, Math.ceil(seconds / 60))
    };
  }
  static fixedNotificationIntervalUnit(seconds) {
    const value = Math.max(1, Math.trunc(Number(seconds) || 1));
    if (value % ADMIN_NOTIFICATION_INTERVAL_SECONDS.years === 0) {
      return ADMIN_NOTIFICATION_INTERVAL_UNIT.years;
    }
    if (value % ADMIN_NOTIFICATION_INTERVAL_SECONDS.months === 0) {
      return ADMIN_NOTIFICATION_INTERVAL_UNIT.months;
    }
    if (value % ADMIN_NOTIFICATION_INTERVAL_SECONDS.weeks === 0) {
      return ADMIN_NOTIFICATION_INTERVAL_UNIT.weeks;
    }
    if (value % ADMIN_NOTIFICATION_INTERVAL_SECONDS.days === 0) {
      return ADMIN_NOTIFICATION_INTERVAL_UNIT.days;
    }
    if (value % ADMIN_NOTIFICATION_INTERVAL_SECONDS.hours === 0) {
      return ADMIN_NOTIFICATION_INTERVAL_UNIT.hours;
    }
    if (value % ADMIN_NOTIFICATION_INTERVAL_SECONDS.minutes === 0) {
      return ADMIN_NOTIFICATION_INTERVAL_UNIT.minutes;
    }
    return ADMIN_NOTIFICATION_INTERVAL_UNIT.seconds;
  }
  static intervalExpression(amountValue, unit, time) {
    const amount = Math.max(1, Math.trunc(Number(amountValue) || 1));
    const [hour, minute] = this.normalizeNotificationTime(time).split(":").map((value) => Math.max(0, Math.trunc(Number(value) || 0)));
    if (unit === ADMIN_NOTIFICATION_INTERVAL_UNIT.seconds) {
      return `0/${amount} * * * * ?`;
    }
    if (unit === ADMIN_NOTIFICATION_INTERVAL_UNIT.minutes) {
      return `0 0/${amount} * * * ?`;
    }
    if (unit === ADMIN_NOTIFICATION_INTERVAL_UNIT.hours) {
      return `0 ${minute} 0/${amount} * * ?`;
    }
    if (unit === ADMIN_NOTIFICATION_INTERVAL_UNIT.days) {
      return `0 ${minute} ${hour} 1/${amount} * ?`;
    }
    return `@every ${amount} ${unit} @ ${this.normalizeNotificationTime(time)}`;
  }
  static normalizeNotificationTime(value) {
    const normalized = `${value ?? ""}`.trim();
    return /^\d{2}:\d{2}$/.test(normalized) ? normalized : "09:00";
  }
  static paramFieldLabelKey(fieldKey) {
    const normalized = `${fieldKey ?? ""}`.trim();
    return normalized ? `admin.params.field.${normalized}` : "";
  }
  static paramGroupLabelKey(group) {
    const normalized = this.paramsI18nSegment(group);
    return normalized ? `admin.params.group.${normalized}` : "admin.params.group.general";
  }
  static paramStrategyLabelKey(strategy) {
    const normalized = `${strategy ?? ""}`.trim();
    return normalized ? `admin.params.strategy.${normalized}` : "";
  }
  static paramsI18nSegment(value) {
    return `${value ?? ""}`.trim().replace(/([a-z0-9])([A-Z])/g, "$1.$2").replace(/[^a-zA-Z0-9]+/g, ".").replace(/^\.+|\.+$/g, "").toLocaleLowerCase("en-US");
  }
};

// src/app/shared/core/local/seed/builders/admin/admin-params-seed.builder.ts
var AdminParamsSeedBuilder = class {
  static buildDefaultParamsStore() {
    const changedDate = "2026-05-01T09:00:00.000Z";
    const sections = [
      this.paramSection("matching", "Matching", 3, "2026-05-07T12:30:00.000Z", "admin-demo-ava", "Raised inside-network confidence after graph review.", [
        this.numberParam("rating.singleMutual", "Single mutual", "Ratings", 10, "x"),
        this.numberParam("rating.singleOneSided", "Single one-sided", "Ratings", 2, "x"),
        this.numberParam("rating.pairOutsideNetwork", "Pair outside network", "Ratings", 2, "x"),
        this.numberParam("rating.pairInsideNetwork", "Pair inside network", "Ratings", 5, "x"),
        this.numberParam("evidence.mutualSingle", "Mutual single", "Evidence", 1, "x"),
        this.numberParam("evidence.singleOneSided", "Single one-sided", "Evidence", 0, "x"),
        this.numberParam("evidence.pairOutsideNetwork", "Pair outside network", "Evidence", 0.3, "x"),
        this.numberParam("evidence.pairInsideNetwork", "Pair inside network", "Evidence", 0.7, "x"),
        this.numberParam("evidence.met", "Met in person", "Evidence", 0.5, "x"),
        this.numberParam("ownerContext", "Owner context", "Network", 3, "x")
      ]),
      this.paramSection("profile", "Profile", 2, "2026-05-04T10:10:00.000Z", "admin-demo-noel", "Balanced profile, workplace, school, and trait inputs.", [
        this.numberParam("profileRules.0", "Languages", "Profile fields", 2, "x", "intersection"),
        this.numberParam("profileRules.1", "Physique", "Profile fields", 3, "x", "exact"),
        this.numberParam("profileRules.2", "Interest", "Profile fields", 2, "x", "intersection"),
        this.numberParam("profileRules.3", "Values", "Profile fields", 3, "x", "intersection"),
        this.numberParam("profileRules.4", "Workout", "Profile fields", 2, "x", "exact"),
        this.numberParam("profileRules.5", "Workplace", "Experience", 4, "x", "intersection"),
        this.numberParam("profileRules.6", "Profession", "Experience", 3, "x", "intersection"),
        this.numberParam("profileRules.7", "School", "Experience", 4, "x", "intersection"),
        this.numberParam("impressionRules.0", "Personality traits", "Traits", 4, "x", "trait-vector"),
        this.numberParam("absolute.user.completion", "Completion", "Absolute user", 13, "pts"),
        this.numberParam("absolute.user.impressionAverageRating", "Average rating", "Impressions", 29, "pts")
      ]),
      this.paramSection("events", "Events", 4, "2026-05-08T15:45:00.000Z", "admin-demo-ava", "Adjusted host confidence and open-capacity boost.", [
        this.numberParam("absolute.event.contentTokens", "Content tokens", "Affinity", 89, "pts"),
        this.numberParam("absolute.event.participantAffinity", "Participant affinity", "Affinity", 1, "x"),
        this.numberParam("boost.event.rating", "Rating", "Boost", 29, "pts"),
        this.numberParam("boost.event.acceptedMembers", "Accepted members", "Boost", 19, "pts"),
        this.numberParam("boost.event.pendingMembers", "Pending members", "Boost", 11, "pts"),
        this.numberParam("boost.event.capacityAvailable", "Capacity available", "Boost", 7, "pts"),
        this.numberParam("boost.event.hostConfidence", "Host confidence", "Boost", 0.25, "x")
      ]),
      this.paramSection("assets", "Assets", 2, "2026-05-06T08:15:00.000Z", "admin-demo-noel", "Added owner confidence and request pressure to asset ranking.", [
        this.numberParam("absolute.asset.contentTokens", "Content tokens", "Affinity", 83, "pts"),
        this.numberParam("absolute.asset.ownerAffinity", "Owner affinity", "Affinity", 1, "x"),
        this.numberParam("boost.asset.capacityAvailable", "Capacity available", "Boost", 7, "pts"),
        this.numberParam("boost.asset.quantity", "Quantity", "Boost", 11, "pts"),
        this.numberParam("boost.asset.requestCount", "Request count", "Boost", 13, "pts"),
        this.numberParam("boost.asset.freshness", "Freshness", "Boost", 3, "pts"),
        this.numberParam("boost.asset.ownerConfidence", "Owner confidence", "Boost", 0.25, "x")
      ]),
      this.paramSection("discovery", "Discovery", 1, changedDate, "system", "Initial outside-network and distance balance.", [
        this.numberParam("distance.multiplier", "Distance multiplier", "Distance", 5, "pts"),
        this.numberParam("distance.maxMeters", "Max distance", "Distance", 5e4, "m"),
        this.textParam("distance.strategy", "Distance strategy", "Distance", "linear", "linear")
      ]),
      this.paramSection("notifications", "Notifications", 1, changedDate, "system", "Initial Firebase batching and retry defaults.", [
        this.numberParam("notifications.firebaseWindowStartHour", "Window start", "Firebase", 8, "h"),
        this.numberParam("notifications.firebaseWindowEndHour", "Window end", "Firebase", 22, "h"),
        this.numberParam("notifications.maxWorkers", "Max workers", "Delivery", 4, ""),
        this.numberParam("notifications.maxRetries", "Max retries", "Retry", 5, ""),
        this.numberParam("notifications.initialBackoffSeconds", "Initial backoff", "Retry", 30, "s"),
        this.numberParam("notifications.collapseWindowSeconds", "Collapse window", "Collapse", 300, "s"),
        this.numberParam("notifications.multicastThreshold", "Multicast threshold", "Delivery", 3, ""),
        this.numberParam("notifications.topicThreshold", "Topic threshold", "Delivery", 250, "")
      ]),
      this.paramSection("jobs", "Jobs", 1, changedDate, "system", "Initial recompute worker scheduling defaults.", [
        this.numberParam("jobs.userChangedDebounceSeconds", "User debounce", "Debounce", 300, "s"),
        this.numberParam("jobs.eventChangedDebounceSeconds", "Event debounce", "Debounce", 180, "s"),
        this.numberParam("jobs.eventMembersChangedDebounceSeconds", "Members debounce", "Debounce", 300, "s"),
        this.numberParam("jobs.assetChangedDebounceSeconds", "Asset debounce", "Debounce", 180, "s"),
        this.numberParam("jobs.assetRequestsChangedDebounceSeconds", "Requests debounce", "Debounce", 180, "s"),
        this.numberParam("jobs.configChangedDebounceSeconds", "Config debounce", "Debounce", 900, "s"),
        this.numberParam("jobs.workerPollDelayMs", "Worker poll delay", "Worker", 6e4, "ms"),
        this.numberParam("jobs.batchSize", "Batch size", "Worker", 50, ""),
        this.numberParam("jobs.leaseDurationSeconds", "Lease duration", "Worker", 600, "s"),
        this.numberParam("jobs.process.eventSchedulerPollDelayMs", "Event scheduler poll", "Processes", 18e5, "ms"),
        this.numberParam("jobs.process.autoInviterCadenceMs", "Auto-inviter cadence", "Processes", 72e5, "ms"),
        this.numberParam("jobs.process.notificationOutboxPollDelayMs", "Notification outbox poll", "Processes", 6e4, "ms"),
        this.numberParam("jobs.process.accountPurgeWindowDays", "Account purge window", "Processes", 30, "d"),
        this.textParam("jobs.policy.autoInviterScope", "Auto-inviter scope", "Policy", "Main event before tournament start", "", true),
        this.textParam("jobs.policy.tournamentStart", "Tournament start", "Policy", "Manual admin start from first stage", "", true),
        this.textParam("jobs.policy.stageProgression", "Stage progression", "Policy", "Admin finalizes scores before next stage", "", true)
      ])
    ];
    const historyBySection = sections.reduce((acc, section) => {
      acc[section.key] = [
        {
          configId: `demo-params-${section.key}-v${section.version}`,
          version: section.version,
          changedDate: section.changedDate,
          changedBy: section.changedBy,
          summary: section.summary,
          summaryKey: section.summaryKey,
          active: true,
          fields: section.fields.map((field) => __spreadValues({}, field))
        },
        {
          configId: `demo-params-${section.key}-v1`,
          version: 1,
          changedDate,
          changedBy: "system",
          summary: "Initial parameter seed.",
          summaryKey: this.paramSummaryKey("Initial parameter seed.", section.key),
          active: section.version === 1,
          fields: section.fields.map((field) => __spreadValues({}, field))
        }
      ].filter((item, index, values) => values.findIndex((candidate) => candidate.version === item.version) === index);
      return acc;
    }, {});
    return {
      sections,
      updatedDate: "2026-05-08T15:45:00.000Z",
      historyBySection
    };
  }
  static paramSection(key, label, version, changedDate, changedBy, summary, fields) {
    return {
      key,
      label,
      labelKey: this.paramSectionLabelKey(key),
      version,
      changedDate,
      changedBy,
      summary,
      summaryKey: this.paramSummaryKey(summary, key),
      fields
    };
  }
  static numberParam(key, label, group, numberValue, unit, strategy = "", readOnly = false) {
    return {
      key,
      label,
      labelKey: this.paramFieldLabelKey(key),
      group,
      groupKey: this.paramGroupLabelKey(group),
      valueType: "number",
      numberValue,
      textValue: null,
      unit,
      options: [],
      strategy,
      strategyKey: this.paramStrategyLabelKey(strategy),
      readOnly
    };
  }
  static textParam(key, label, group, textValue, strategy = "", readOnly = false) {
    return {
      key,
      label,
      labelKey: this.paramFieldLabelKey(key),
      group,
      groupKey: this.paramGroupLabelKey(group),
      valueType: "text",
      numberValue: null,
      textValue,
      unit: null,
      options: this.paramOptionsFor(key),
      strategy,
      strategyKey: this.paramStrategyLabelKey(strategy),
      readOnly
    };
  }
  static paramSectionLabelKey(sectionKey) {
    const normalized = `${sectionKey ?? ""}`.trim();
    return normalized ? `admin.params.section.${normalized}` : "admin.params.platform";
  }
  static paramFieldLabelKey(fieldKey) {
    const normalized = `${fieldKey ?? ""}`.trim();
    return normalized ? `admin.params.field.${normalized}` : "";
  }
  static paramGroupLabelKey(group) {
    const normalized = this.paramsI18nSegment(group);
    return normalized ? `admin.params.group.${normalized}` : "admin.params.group.general";
  }
  static paramStrategyLabelKey(strategy) {
    const normalized = `${strategy ?? ""}`.trim();
    return normalized ? `admin.params.strategy.${normalized}` : "";
  }
  static paramOptionsFor(fieldKey) {
    if (`${fieldKey ?? ""}`.trim() !== "distance.strategy") {
      return [];
    }
    return ["linear", "exponential", "bucketed"].map((value) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
      labelKey: this.paramStrategyLabelKey(value)
    }));
  }
  static paramSummaryKey(summary, sectionKey) {
    const normalizedSummary = `${summary ?? ""}`.trim();
    const normalizedSection = `${sectionKey ?? ""}`.trim();
    if (!normalizedSummary || !normalizedSection) {
      return "";
    }
    if (/^Updated\s+.+?\s+parameters\.$/i.test(normalizedSummary)) {
      return `admin.params.summary.updated.${normalizedSection}`;
    }
    return "";
  }
  static paramsI18nSegment(value) {
    return `${value ?? ""}`.trim().replace(/([a-z0-9])([A-Z])/g, "$1.$2").replace(/[^a-zA-Z0-9]+/g, ".").replace(/^\.+|\.+$/g, "").toLocaleLowerCase("en-US");
  }
};

// src/app/shared/core/local/seed/builders/admin/admin-profile-seed.builder.ts
var AdminProfileSeedBuilder = class {
  static buildDemoAdminUser(admin) {
    return {
      id: admin.id,
      name: admin.name,
      age: 0,
      birthday: "",
      city: admin.id.includes("noel") ? "Trust desk" : "Safety desk",
      height: "",
      physique: "",
      languages: ["English"],
      horoscope: "",
      initials: admin.initials,
      gender: admin.id.includes("noel") ? "man" : "woman",
      statusText: "Admin workspace",
      hostTier: "Admin",
      traitLabel: "Safety",
      completion: 100,
      headline: `${admin.headline ?? ""}`.trim() || "Moderation workspace",
      about: `${admin.about ?? ""}`.trim() || "Reviews reports, feedback, and support chats.",
      images: [...admin.images?.length ? admin.images : this.demoAdminImages(admin.id)],
      profileStatus: "public",
      admin: true,
      activities: {
        game: 0,
        chats: 1,
        invitations: 0,
        events: 0,
        hosting: 0,
        cars: 0,
        accommodation: 0,
        supplies: 0,
        tickets: 0,
        contacts: 0,
        feedback: 0,
        chat: {
          all: 1,
          event: 0,
          subEvent: 0,
          group: 0,
          service: 0,
          appSupport: 1
        },
        adminJobs: 0,
        adminMetrics: 0
      }
    };
  }
  static demoAdminImages(adminUserId) {
    return adminUserId.includes("noel") ? ["https://randomuser.me/api/portraits/men/75.jpg"] : ["https://randomuser.me/api/portraits/women/65.jpg"];
  }
  static isLegacyDemoAdminImage(imageUrl) {
    const normalized = `${imageUrl ?? ""}`.trim();
    return normalized.includes("picsum.photos/seed/admin-ava-moderation") || normalized.includes("picsum.photos/seed/admin-noel-safety");
  }
};

// src/app/shared/core/local/seed/builders/admin/admin-stats-seed.builder.ts
var AdminStatsSeedBuilder = class {
  static buildSeedDemoStatsSnapshot() {
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const segment = (key, labelKey, icon, total, healthPercent, items) => ({
      key,
      labelKey,
      icon,
      total,
      healthPercent,
      summaryKey: "stats.segment.summary",
      items
    });
    const item = (key, labelKey, value, total, icon, tone) => ({ key, labelKey, value, total, icon, tone });
    const metric = (key, labelKey, value, valueLabel, icon, tone, percent) => ({ key, labelKey, value, valueLabel, icon, tone, percent });
    const timeline = [
      ["2026-04-28", "Apr 28", 3, 24, 18, 4, 2, 38, 1],
      ["2026-04-29", "Apr 29", 5, 31, 22, 6, 3, 44, 2],
      ["2026-04-30", "Apr 30", 4, 29, 28, 5, 4, 47, 1],
      ["2026-05-01", "May 1", 8, 36, 32, 8, 4, 62, 3],
      ["2026-05-02", "May 2", 6, 42, 38, 7, 5, 71, 2],
      ["2026-05-03", "May 3", 4, 39, 35, 5, 3, 64, 1],
      ["2026-05-04", "May 4", 7, 46, 44, 9, 6, 83, 2],
      ["2026-05-05", "May 5", 9, 51, 49, 8, 5, 94, 4],
      ["2026-05-06", "May 6", 5, 47, 43, 6, 4, 86, 2],
      ["2026-05-07", "May 7", 6, 53, 56, 10, 7, 103, 3],
      ["2026-05-08", "May 8", 4, 49, 48, 7, 5, 91, 2],
      ["2026-05-09", "May 9", 7, 57, 61, 11, 6, 117, 4],
      ["2026-05-10", "May 10", 5, 54, 52, 8, 5, 99, 1],
      ["2026-05-11", "May 11", 6, 42, 36, 5, 3, 72, 2]
    ].map(([dateKey, label, registrations, activeUsers, ratings, events, assets, messages, moderation]) => ({
      dateKey: `${dateKey}`,
      label: `${label}`,
      registrations: Number(registrations),
      activeUsers: Number(activeUsers),
      ratings: Number(ratings),
      events: Number(events),
      assets: Number(assets),
      messages: Number(messages),
      moderation: Number(moderation)
    }));
    return {
      generatedAtIso: nowIso,
      source: "demo",
      healthScore: 84,
      healthLabelKey: "stats.health.good",
      healthSummaryKey: "stats.health.summary",
      kpis: [
        { key: "active-profiles", labelKey: "stats.kpi.active.profiles", value: 112, valueLabel: "112", caption: "Public 58 \xB7 Friends 38 \xB7 Host 16", icon: "groups", tone: "green", percent: 88 },
        { key: "onboarding-users", labelKey: "stats.kpi.onboarding.users", value: 9, valueLabel: "9", icon: "how_to_reg", tone: "gold", percent: 7 },
        { key: "inactive-profiles", labelKey: "stats.kpi.inactive.profiles", value: 7, valueLabel: "7", icon: "visibility_off", tone: "slate", percent: 5 },
        { key: "active-users", labelKey: "stats.kpi.active.users", value: 42, valueLabel: "42", icon: "person", tone: "blue", percent: 33 },
        { key: "returning-users", labelKey: "stats.kpi.returning.users", value: 31, valueLabel: "31", icon: "repeat", tone: "purple", percent: 24 },
        { key: "departed-users", labelKey: "stats.kpi.departed.users", value: 7, valueLabel: "7", icon: "person_remove", tone: "slate", percent: 5 },
        { key: "active-events", labelKey: "stats.kpi.active.events", value: 18, valueLabel: "18", icon: "event_available", tone: "green", percent: 45 },
        { key: "active-assets", labelKey: "stats.kpi.active.assets", value: 27, valueLabel: "27", icon: "inventory_2", tone: "gold", percent: 68 },
        { key: "moderation-pressure", labelKey: "stats.kpi.moderation.pressure", value: 14, valueLabel: "14", icon: "shield", tone: "red", percent: 18 }
      ],
      segments: [
        segment("community", "stats.segment.community", "person", 128, 88, [
          item("profile.registered", "stats.event.profile.registered", 29, 128, "person_add", "green"),
          item("profile.active", "stats.event.profile.active", 112, 128, "groups", "green"),
          item("profile.onboarding", "stats.event.profile.onboarding", 9, 128, "how_to_reg", "gold"),
          item("profile.inactive", "stats.event.profile.inactive", 7, 128, "visibility_off", "slate"),
          item("active-users-7d", "stats.event.active.users.7d", 42, 128, "person", "blue"),
          item("active-users-30d", "stats.event.active.users.30d", 68, 128, "calendar_month", "green"),
          item("returning-users", "stats.event.returning.users", 31, 128, "repeat", "purple"),
          item("profile.deleted", "stats.event.profile.deleted", 7, 135, "person_remove", "slate"),
          item("deleted-median-days", "stats.event.deleted.median.days", 46, 46, "timer", "gold"),
          item("profile-fill-average", "stats.event.profile.fill.average", 74, 100, "fact_check", "gold"),
          item("tried-users", "stats.event.tried.users", 128, 128, "group", "slate")
        ]),
        segment("matching", "stats.segment.matching", "hub", 342, 83, [
          item("rates.synced", "stats.event.rates.synced", 342, 342, "star", "gold")
        ]),
        segment("activities", "stats.segment.activities", "event_available", 91, 76, [
          item("active-events", "stats.event.active.events", 18, 91, "event_available", "green"),
          item("all-events", "stats.event.all.events", 28, 91, "event", "blue"),
          item("active-assets", "stats.event.active.assets", 27, 91, "inventory_2", "gold"),
          item("all-assets", "stats.event.all.assets", 39, 91, "category", "purple"),
          item("event.members.changed", "stats.event.event.members.changed", 37, 91, "groups", "green"),
          item("asset.requests.changed", "stats.event.asset.requests.changed", 14, 91, "handshake", "gold")
        ]),
        segment("communication", "stats.segment.communication", "chat", 426, 81, [
          item("chat.message.sent", "stats.event.chat.message.sent", 417, 426, "forum", "blue"),
          item("admin.user.warned", "stats.event.admin.user.warned", 9, 426, "warning", "gold")
        ]),
        segment("moderation", "stats.segment.moderation", "shield", 14, 62, [
          item("report.submitted", "stats.event.report.submitted", 8, 14, "report", "red"),
          item("feedback.submitted", "stats.event.feedback.submitted", 4, 14, "feedback", "purple"),
          item("admin.user.blocked", "stats.event.admin.user.blocked", 2, 14, "block", "red")
        ])
      ],
      attention: [],
      topCities: [
        { key: "austin", labelKey: "", label: "Austin", value: 34, total: 128, icon: "location_on", tone: "blue" },
        { key: "seattle", labelKey: "", label: "Seattle", value: 29, total: 128, icon: "location_on", tone: "green" },
        { key: "denver", labelKey: "", label: "Denver", value: 23, total: 128, icon: "location_on", tone: "purple" },
        { key: "miami", labelKey: "", label: "Miami", value: 18, total: 128, icon: "location_on", tone: "gold" }
      ],
      topTopics: [
        { key: "outdoors", labelKey: "", label: "Outdoors", value: 38, total: 112, icon: "local_offer", tone: "green" },
        { key: "music", labelKey: "", label: "Music", value: 31, total: 112, icon: "local_offer", tone: "purple" },
        { key: "board-games", labelKey: "", label: "Board games", value: 24, total: 112, icon: "local_offer", tone: "blue" },
        { key: "fitness", labelKey: "", label: "Fitness", value: 19, total: 112, icon: "local_offer", tone: "gold" }
      ],
      timeline,
      eventTypes: [
        { key: "simple", labelKey: "", label: "Simple", value: 14, total: 47, icon: "category", tone: "blue" },
        { key: "organized", labelKey: "", label: "Organized", value: 10, total: 47, icon: "category", tone: "green" },
        { key: "matched-rooms", labelKey: "", label: "Matched rooms", value: 8, total: 47, icon: "hub", tone: "purple" },
        { key: "recurring", labelKey: "", label: "Recurring", value: 6, total: 47, icon: "event_repeat", tone: "gold" },
        { key: "multi-slot", labelKey: "", label: "Multi-slot", value: 5, total: 47, icon: "view_timeline", tone: "green" },
        { key: "tournament", labelKey: "", label: "Tournament", value: 4, total: 47, icon: "emoji_events", tone: "red" }
      ],
      activityMix: [
        item("profiles", "stats.domain.profiles", 128, 1001, "person", "blue"),
        item("matching", "stats.domain.matching", 342, 1001, "hub", "purple"),
        item("events", "stats.domain.events", 73, 1001, "event", "green"),
        item("assets", "stats.domain.assets", 18, 1001, "inventory_2", "gold"),
        item("chats", "stats.domain.chats", 426, 1001, "chat", "blue"),
        item("moderation", "stats.domain.moderation", 14, 1001, "shield", "red")
      ],
      graph: {
        healthScore: 78,
        healthLabelKey: "stats.graph.health.watch",
        insightKey: "stats.graph.insight.healthy",
        metrics: [
          metric("graph-health", "stats.graph.metric.health", 78, "78", "monitoring", "green", 78),
          metric("graph-users", "stats.graph.metric.users", 42, "42", "person", "blue", 100),
          metric("graph-edges", "stats.graph.metric.edges", 116, "116", "share", "purple", 92),
          metric("graph-avg-degree", "stats.graph.metric.avg.degree", 55, "5.5", "hub", "gold", 100),
          metric("graph-communities", "stats.graph.metric.communities", 6, "6", "bubble_chart", "green", 57),
          metric("graph-bridges", "stats.graph.metric.bridges", 8, "8", "conversion_path", "red", 100),
          metric("graph-network-quality", "stats.graph.metric.network.quality", 64, "64%", "ssid_chart", "blue", 64),
          metric("graph-cluster-quality", "stats.graph.metric.cluster.quality", 79, "79%", "bubble_chart", "green", 79),
          metric("gender-female-to-male", "stats.graph.metric.gender.female.to.male", 73, "7.3", "female", "purple", 73),
          metric("gender-male-to-female", "stats.graph.metric.gender.male.to.female", 69, "6.9", "male", "gold", 69)
        ],
        bridgeUsers: [
          { key: "lina-stone", labelKey: "", label: "Lina Stone", value: 96, total: 320, icon: "conversion_path", tone: "red" },
          { key: "luca-hale", labelKey: "", label: "Luca Hale", value: 84, total: 320, icon: "conversion_path", tone: "purple" },
          { key: "ava-baker", labelKey: "", label: "Ava Baker", value: 71, total: 320, icon: "conversion_path", tone: "green" },
          { key: "mason-grant", labelKey: "", label: "Mason Grant", value: 62, total: 320, icon: "conversion_path", tone: "gold" }
        ],
        communities: [
          { key: "community-1", labelKey: "", label: "Austin event circle", value: 14, total: 42, icon: "bubble_chart", tone: "green" },
          { key: "community-2", labelKey: "", label: "Seattle creators", value: 9, total: 42, icon: "bubble_chart", tone: "blue" },
          { key: "community-3", labelKey: "", label: "Denver assets", value: 7, total: 42, icon: "bubble_chart", tone: "gold" },
          { key: "community-4", labelKey: "", label: "Miami mixed", value: 5, total: 42, icon: "bubble_chart", tone: "purple" }
        ],
        signals: [
          item("reachability-2-hop", "stats.graph.signal.reachability", 68, 100, "travel_explore", "blue"),
          item("weak-tie-ratio", "stats.graph.signal.weak.ties", 34, 100, "lan", "purple"),
          item("clustering", "stats.graph.signal.clustering", 42, 100, "bubble_chart", "green"),
          item("recurring-edge-ratio", "stats.graph.signal.recurring", 31, 100, "repeat", "gold"),
          item("bridge-coverage", "stats.graph.signal.bridge.coverage", 19, 100, "conversion_path", "red"),
          item("largest-community", "stats.graph.signal.largest.community", 33, 100, "groups", "slate"),
          item("network-quality", "stats.graph.signal.network.quality", 64, 100, "ssid_chart", "blue"),
          item("cluster-quality", "stats.graph.signal.cluster.quality", 79, 100, "bubble_chart", "green")
        ],
        timeline: [
          ["2026-04-28", "Apr 28", 56, 8, 5, 19, 5, 7, 51, 69],
          ["2026-04-29", "Apr 29", 62, 7, 8, 21, 5, 7, 53, 70],
          ["2026-04-30", "Apr 30", 68, 9, 7, 23, 6, 7, 55, 71],
          ["2026-05-01", "May 1", 74, 10, 9, 25, 6, 7, 57, 72],
          ["2026-05-02", "May 2", 80, 11, 11, 28, 7, 7, 58, 73],
          ["2026-05-03", "May 3", 83, 6, 10, 29, 7, 7, 59, 74],
          ["2026-05-04", "May 4", 88, 12, 13, 31, 7, 6, 60, 75],
          ["2026-05-05", "May 5", 94, 14, 12, 32, 8, 6, 61, 76],
          ["2026-05-06", "May 6", 97, 7, 14, 32, 8, 6, 62, 76],
          ["2026-05-07", "May 7", 103, 13, 16, 35, 8, 6, 63, 77],
          ["2026-05-08", "May 8", 108, 8, 15, 36, 8, 6, 63, 78],
          ["2026-05-09", "May 9", 113, 12, 18, 38, 8, 6, 64, 78],
          ["2026-05-10", "May 10", 116, 9, 17, 39, 8, 6, 64, 79],
          ["2026-05-11", "May 11", 116, 5, 14, 40, 8, 6, 64, 79]
        ].map(([dateKey, label, activeEdges, newEdges, recurringEdges, weakTies, bridgeUsers, communities, networkQuality, clusterQuality]) => ({
          dateKey: `${dateKey}`,
          label: `${label}`,
          activeEdges: Number(activeEdges),
          newEdges: Number(newEdges),
          recurringEdges: Number(recurringEdges),
          weakTies: Number(weakTies),
          bridgeUsers: Number(bridgeUsers),
          communities: Number(communities),
          networkQuality: Number(networkQuality),
          clusterQuality: Number(clusterQuality)
        }))
      }
    };
  }
};

// src/app/shared/core/local/seed/builders/asset-seed.builder.ts
var SeedAssetBuilder = class {
  static createSamplePricingConfig(mode = "hybrid") {
    return {
      enabled: true,
      mode,
      basePrice: 25,
      currency: "USD",
      taxMode: "excluded",
      chargeType: "per_attendee",
      quantityRulesEnabled: false,
      quantityRules: [],
      minPrice: 15,
      maxPrice: 60,
      rounding: "whole",
      demandRulesEnabled: mode === "demand-based" || mode === "hybrid",
      demandRules: [
        {
          id: "demand-rule-1",
          operator: "gte",
          capacityFilledPercent: 50,
          action: {
            kind: "increase_percent",
            value: 10
          },
          appliesTo: "all_slots",
          slotIds: []
        }
      ],
      timeRulesEnabled: mode === "time-based" || mode === "hybrid",
      timeRules: [
        {
          id: "time-rule-1",
          trigger: "days_before_start",
          offsetValue: 7,
          specificDateStart: null,
          specificDateEnd: null,
          action: {
            kind: "decrease_percent",
            value: 5
          },
          appliesTo: "all_slots",
          slotIds: []
        }
      ],
      cancellationPolicy: {
        enabled: true,
        rules: [
          {
            id: "cancellation-rule-1",
            offsetUnit: "days",
            offsetValue: 7,
            refundKind: "percent",
            refundValue: 50
          },
          {
            id: "cancellation-rule-2",
            offsetUnit: "hours",
            offsetValue: 24,
            refundKind: "none",
            refundValue: null
          }
        ]
      },
      slotPricingEnabled: false,
      slotOverrides: [],
      audience: {
        enabled: false,
        memberPrice: 20,
        vipPrice: 15,
        inviteOnlyDiscountPercent: 25,
        promoCodes: [
          {
            id: "promo-code-1",
            code: "EARLY",
            action: {
              kind: "decrease_percent",
              value: 10
            }
          }
        ],
        soldOutLabel: 'Show "Sold Out"'
      }
    };
  }
  static clonePricingConfig(pricing) {
    if (!pricing) {
      return null;
    }
    return __spreadProps(__spreadValues({}, pricing), {
      quantityRules: (pricing.quantityRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), {
        action: __spreadValues({}, rule.action)
      })),
      demandRules: (pricing.demandRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), {
        action: __spreadValues({}, rule.action),
        slotIds: [...rule.slotIds ?? []]
      })),
      timeRules: (pricing.timeRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), {
        action: __spreadValues({}, rule.action),
        slotIds: [...rule.slotIds ?? []]
      })),
      cancellationPolicy: {
        enabled: pricing.cancellationPolicy?.enabled === true,
        rules: (pricing.cancellationPolicy?.rules ?? []).map((rule) => __spreadValues({}, rule))
      },
      slotOverrides: (pricing.slotOverrides ?? []).map((item) => __spreadValues({}, item)),
      audience: __spreadProps(__spreadValues({}, pricing.audience), {
        promoCodes: (pricing.audience?.promoCodes ?? []).map((code) => __spreadProps(__spreadValues({}, code), {
          action: __spreadValues({}, code.action)
        }))
      })
    });
  }
  static defaultAssetImage(type, seed = type.toLowerCase()) {
    return demoAssetPlaceholderUrl(seed || type.toLowerCase());
  }
  static defaultAssetSubtitle(type) {
    if (type === ASSET_TYPE_TRANSPORT) {
      return "Passenger capacity + luggage space";
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return "Rooms + sleeping spots";
    }
    return "Packed items + delivery window";
  }
  static defaultAssetDetails(type) {
    if (type === ASSET_TYPE_TRANSPORT) {
      return "Route, pickup time, and luggage constraints are confirmed.";
    }
    if (type === ASSET_TYPE_ACCOMMODATION) {
      return "Check-in details, room setup, and property notes are confirmed.";
    }
    return "Item condition, handoff location, and timing are confirmed.";
  }
  static buildSampleAssetCards(users) {
    void users;
    const sampleSpecs = [
      {
        id: "asset-transport-1",
        type: ASSET_TYPE_TRANSPORT,
        title: "City-to-Lake SUV",
        subtitle: "Hyundai Tucson \xB7 Automatic",
        category: TRANSPORT_CATEGORY_SUV,
        city: "Austin",
        capacityTotal: 4,
        quantity: 1,
        details: "Pickup from Downtown at 17:30. Luggage: 2 cabin bags.",
        routes: ["Austin Downtown", "Round Rock", "Lake Travis"],
        pricingMode: "hybrid"
      },
      {
        id: "asset-transport-2",
        type: ASSET_TYPE_TRANSPORT,
        title: "Airport Shuttle Hatchback",
        subtitle: "Volkswagen Golf \xB7 Manual",
        category: TRANSPORT_CATEGORY_SHUTTLE,
        city: "Austin",
        capacityTotal: 4,
        quantity: 1,
        details: "Airport run before midnight, fuel split evenly.",
        routes: ["Austin Airport", "Domain Northside"],
        pricingMode: "demand-based"
      },
      {
        id: "asset-transport-3",
        type: ASSET_TYPE_TRANSPORT,
        title: "Volunteer Crew Van",
        subtitle: "Ford Transit \xB7 Automatic",
        category: TRANSPORT_CATEGORY_VAN,
        city: "Austin",
        capacityTotal: 7,
        quantity: 1,
        details: "Best for crew transfers and bulky kit runs.",
        routes: ["Austin Central", "Expo Grounds", "River Park"],
        pricingMode: "time-based"
      },
      {
        id: "asset-transport-4",
        type: ASSET_TYPE_TRANSPORT,
        title: "Summit Transfer Sedan",
        subtitle: "Toyota Corolla \xB7 Hybrid",
        category: TRANSPORT_CATEGORY_SEDAN,
        city: "Austin",
        capacityTotal: 4,
        quantity: 1,
        details: "Quiet ride for speaker pickup and return.",
        routes: ["Austin Station", "Summit Hotel"],
        pricingMode: "fixed"
      },
      {
        id: "asset-acc-1",
        type: ASSET_TYPE_ACCOMMODATION,
        title: "South Congress Loft",
        subtitle: "2 bedrooms \xB7 1 living room",
        category: ACCOMMODATION_CATEGORY_APARTMENT,
        city: "Austin",
        capacityTotal: 4,
        quantity: 1,
        details: "Check-in after 15:00. Quiet building, no smoking.",
        routes: ["101 South Congress Ave, Austin"],
        pricingMode: "time-based"
      },
      {
        id: "asset-acc-2",
        type: ASSET_TYPE_ACCOMMODATION,
        title: "Eastside Guest Room",
        subtitle: "Private room \xB7 Shared bathroom",
        category: ACCOMMODATION_CATEGORY_ROOM,
        city: "Austin",
        capacityTotal: 2,
        quantity: 1,
        details: "Ideal for early risers. Parking available.",
        routes: ["East 6th Street, Austin"],
        pricingMode: "fixed"
      },
      {
        id: "asset-acc-3",
        type: ASSET_TYPE_ACCOMMODATION,
        title: "Harbor View Studio",
        subtitle: "Studio loft \xB7 Self check-in",
        category: ACCOMMODATION_CATEGORY_APARTMENT,
        city: "San Diego",
        capacityTotal: 2,
        quantity: 1,
        details: "Compact overnight stay close to the venue route.",
        routes: ["Harbor Drive, San Diego"],
        pricingMode: "hybrid"
      },
      {
        id: "asset-acc-4",
        type: ASSET_TYPE_ACCOMMODATION,
        title: "Riverside Family Flat",
        subtitle: "3 rooms \xB7 Kitchen access",
        category: ACCOMMODATION_CATEGORY_HOUSE,
        city: "Denver",
        capacityTotal: 5,
        quantity: 1,
        details: "Good for short host-team overnights with gear.",
        routes: ["Riverfront District, Denver"],
        pricingMode: "demand-based"
      },
      {
        id: "asset-sup-1",
        type: ASSET_TYPE_SUPPLIES,
        title: "Camping Gear Kit",
        subtitle: "Tent + lamps + first aid",
        category: SUPPLIES_CATEGORY_CAMPING,
        city: "Austin",
        capacityTotal: 6,
        quantity: 6,
        details: "Packed and ready in the garage. Pickup only.",
        routes: [],
        pricingMode: "fixed"
      },
      {
        id: "asset-sup-2",
        type: ASSET_TYPE_SUPPLIES,
        title: "Game Night Box",
        subtitle: "Board games + cards + speakers",
        category: SUPPLIES_CATEGORY_GAMES,
        city: "Austin",
        capacityTotal: 4,
        quantity: 4,
        details: "Can deliver to venue before 19:00.",
        routes: [],
        pricingMode: "fixed"
      },
      {
        id: "asset-sup-3",
        type: ASSET_TYPE_SUPPLIES,
        title: "Field Kitchen Crate",
        subtitle: "Burners + pots + serving tools",
        category: SUPPLIES_CATEGORY_COOKING,
        city: "Austin",
        capacityTotal: 5,
        quantity: 5,
        details: "Built for fast meal prep at outdoor sub-events.",
        routes: [],
        pricingMode: "time-based"
      },
      {
        id: "asset-sup-4",
        type: ASSET_TYPE_SUPPLIES,
        title: "PA Speaker Pack",
        subtitle: "Mixer + speakers + stands",
        category: SUPPLIES_CATEGORY_AUDIO,
        city: "Austin",
        capacityTotal: 3,
        quantity: 3,
        details: "Venue handoff includes cable bag and quick setup notes.",
        routes: [],
        pricingMode: "hybrid"
      },
      {
        id: "asset-sup-5",
        type: ASSET_TYPE_SUPPLIES,
        title: "Safety Marshal Kit",
        subtitle: "Radios + torches + hi-vis gear",
        category: SUPPLIES_CATEGORY_SAFETY,
        city: "Austin",
        capacityTotal: 8,
        quantity: 8,
        details: "Counted at handoff and best for larger moving groups.",
        routes: [],
        pricingMode: "fixed"
      },
      {
        id: "asset-sup-6",
        type: ASSET_TYPE_SUPPLIES,
        title: "Popup Decor Set",
        subtitle: "Lanterns + signage + table runners",
        category: SUPPLIES_CATEGORY_DECOR,
        city: "Austin",
        capacityTotal: 6,
        quantity: 6,
        details: "Packed by zone so styling the venue stays fast.",
        routes: [],
        pricingMode: "fixed"
      },
      {
        id: "asset-sup-7",
        type: ASSET_TYPE_SUPPLIES,
        title: "Trail Repair Tools",
        subtitle: "Pumps + patches + multi-tools",
        category: SUPPLIES_CATEGORY_SPORTS,
        city: "Austin",
        capacityTotal: 5,
        quantity: 5,
        details: "Best for active-day support and quick fixes on site.",
        routes: [],
        pricingMode: "demand-based"
      },
      {
        id: "asset-sup-8",
        type: ASSET_TYPE_SUPPLIES,
        title: "Charging Station Tote",
        subtitle: "Power banks + strips + cables",
        category: SUPPLIES_CATEGORY_TECH,
        city: "Austin",
        capacityTotal: 7,
        quantity: 7,
        details: "Labelled by connector type for fast check-in and return.",
        routes: [],
        pricingMode: "hybrid"
      }
    ];
    return sampleSpecs.map((spec) => {
      const imageUrl = this.defaultAssetImage(spec.type, spec.id);
      return {
        id: spec.id,
        type: spec.type,
        title: spec.title,
        subtitle: spec.subtitle,
        category: spec.category,
        city: spec.city,
        capacityTotal: spec.capacityTotal,
        quantity: spec.quantity,
        details: spec.details,
        imageUrl,
        sourceLink: "",
        routes: [...spec.routes],
        pricing: this.createSamplePricingConfig(spec.pricingMode),
        requests: []
      };
    });
  }
};

// src/app/shared/core/local/seed/builders/event-seed.builder.ts
var SeedEventBuilder = class {
  static seededTournamentGroupIdForUser(eventId, subEventId, groups, userId) {
    if (groups.length === 0) {
      return "";
    }
    const index = AppUtils.hashText(`group-chat-member:${eventId}:${subEventId}:${userId}`) % groups.length;
    return groups[index]?.id ?? groups[0]?.id ?? "";
  }
  static seededEventMemberIds(eventId, targetCount, users, activeUserId) {
    const normalizedActiveUserId = activeUserId.trim();
    if (!normalizedActiveUserId) {
      return [];
    }
    const seedableUsers = [...users];
    const count = Math.max(4, Math.min(Math.max(4, targetCount), seedableUsers.length));
    const others = seedableUsers.filter((user) => user.id !== normalizedActiveUserId);
    const seeded = [normalizedActiveUserId];
    if (others.length === 0) {
      return seeded;
    }
    const seed = AppUtils.hashText(`event-members:${eventId}`);
    for (let index = 0; index < others.length && seeded.length < count; index += 1) {
      const candidate = others[(seed + index * 3) % others.length];
      if (!seeded.includes(candidate.id)) {
        seeded.push(candidate.id);
      }
    }
    return seeded;
  }
  static seededEventCapacityRange(eventId, activityCapacityById) {
    const source = activityCapacityById[eventId];
    if (source) {
      const parts = source.split("/").map((part) => Number.parseInt(part.trim(), 10));
      if (parts.length >= 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
        const min2 = Math.max(0, Math.min(parts[0], parts[1]));
        const max2 = Math.max(min2, parts[1]);
        return { min: min2, max: max2 };
      }
    }
    const seed = AppUtils.hashText(`event-capacity:${eventId}`);
    const max = 10 + seed % 24;
    const min = Math.max(0, Math.floor(max * 0.45));
    return { min, max };
  }
  static buildSeededSubEventDefinitionsForEvent(source, options) {
    const dateSource = options.activityDateTimeRangeById[source.id];
    const fallbackStartIso = options.isHosting ? options.hostingDatesById[source.id] ?? options.defaultStartIso : options.eventDatesById[source.id] ?? options.defaultStartIso;
    const start = new Date(dateSource?.startIso ?? fallbackStartIso);
    const end = new Date(dateSource?.endIso ?? new Date(start.getTime() + 4 * 60 * 60 * 1e3).toISOString().slice(0, 19));
    const startMs = Number.isNaN(start.getTime()) ? AppUtils.anchorDate(environment.bootstrapOffsetInDays).getTime() : start.getTime();
    const endMs = Number.isNaN(end.getTime()) || end.getTime() <= startMs ? startMs + 4 * 60 * 60 * 1e3 : end.getTime();
    const seed = AppUtils.hashText(`event-subevents:${source.id}:${source.title}:${source.shortDescription}`);
    const tournamentMode = seed % 3 === 0;
    const eventCapacity = options.eventCapacityById[source.id] ?? this.seededEventCapacityRange(source.id, options.activityCapacityById);
    const eventMax = this.normalizedEventCapacityValue(eventCapacity.max) ?? 0;
    if (tournamentMode) {
      return this.buildSeededTournamentSubEventDefinitions(source, startMs, endMs, seed, eventMax);
    }
    return this.buildSeededCasualSubEventDefinitions(source, startMs, endMs, seed, eventMax);
  }
  static inferredEventModeFromDefinitions(items) {
    if (items.some((item) => !item.optional && ((item.tournamentGroupCapacityMin ?? 0) > 0 || (item.tournamentGroupCapacityMax ?? 0) > 0 || item.tournamentLeaderboardType === "Score" || item.tournamentLeaderboardType === "Fifa"))) {
      return "Tournament";
    }
    return "Casual";
  }
  static buildSeededCasualSubEventDefinitions(source, startMs, endMs, seed, eventMax) {
    const count = 2 + seed % 3;
    const totalMs = Math.max(2 * 60 * 60 * 1e3, endMs - startMs);
    const slotMs = Math.max(45 * 60 * 1e3, Math.floor(totalMs / count));
    const names = ["Kickoff", "Main Session", "Side Activity", "Wrap-up"];
    const items = [];
    for (let index = 0; index < count; index += 1) {
      const optional = index > 0 && (seed + index) % 2 === 0;
      const stageStartMs = startMs + index * slotMs;
      const stageEndMs = index === count - 1 ? endMs : Math.min(endMs, stageStartMs + slotMs);
      const slice = 0.45 + (seed + index) % 4 * 0.12;
      const capacityMax = Math.max(0, Math.round(eventMax * slice));
      const capacityMin = optional ? 0 : Math.max(0, Math.min(capacityMax, Math.floor(capacityMax * 0.55)));
      const durationMinutes = Math.max(30, Math.round((Math.max(stageStartMs + 30 * 60 * 1e3, stageEndMs) - stageStartMs) / 6e4));
      items.push({
        id: `seed-${source.id}-casual-${index + 1}`,
        name: `${names[index] ?? `Session ${index + 1}`}`,
        description: `${source.shortDescription} (${index + 1}/${count})`,
        timing: index === 0 ? "During" : "After",
        offsetMinutes: 0,
        durationMinutes,
        optional,
        capacityMin,
        capacityMax,
        icon: null
      });
    }
    return items;
  }
  static buildSeededTournamentSubEventDefinitions(source, startMs, endMs, seed, eventMax) {
    const stageNames = ["Qualifiers", "Semifinals", "Finals"];
    const stageCount = 3;
    const totalMs = Math.max(3 * 60 * 60 * 1e3, endMs - startMs);
    const slotMs = Math.max(60 * 60 * 1e3, Math.floor(totalMs / stageCount));
    const items = [];
    for (let index = 0; index < stageCount; index += 1) {
      const groupCount = Math.max(1, 4 >> index);
      const basePerGroupMax = Math.max(2, Math.ceil(Math.max(2, eventMax) / Math.max(1, groupCount * (index + 1))));
      const groupCapacityMax = basePerGroupMax;
      const groupCapacityMin = Math.max(0, Math.floor(groupCapacityMax * 0.6));
      const capacityMin = groupCount * groupCapacityMin;
      const capacityMax = groupCount * groupCapacityMax;
      const stageStartMs = startMs + index * slotMs;
      const stageEndMs = index === stageCount - 1 ? endMs : Math.min(endMs, stageStartMs + slotMs);
      const durationMinutes = Math.max(45, Math.round((Math.max(stageStartMs + 45 * 60 * 1e3, stageEndMs) - stageStartMs) / 6e4));
      items.push({
        id: `seed-${source.id}-tournament-${index + 1}`,
        name: `${stageNames[index]}`,
        description: `${source.shortDescription} (${stageNames[index]})`,
        timing: index === 0 ? "During" : "After",
        offsetMinutes: 0,
        durationMinutes,
        tournamentGroupCapacityMin: groupCapacityMin,
        tournamentGroupCapacityMax: groupCapacityMax,
        tournamentLeaderboardType: (seed + index) % 2 === 0 ? "Score" : "Fifa",
        tournamentAdvancePerGroup: index === stageCount - 1 ? 0 : Math.max(1, 2 - index),
        optional: false,
        capacityMin,
        capacityMax,
        icon: "emoji_events"
      });
    }
    return items;
  }
  static normalizedEventCapacityValue(value) {
    if (value === null || value === void 0) {
      return null;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    return Math.max(0, Math.trunc(parsed));
  }
};

// src/app/shared/core/local/seed/builders/user-seed.builder.ts
function buildDemoPortraitStack(gender, seedIndex, count = 3) {
  const normalizedCount = Math.max(1, Math.min(3, Math.trunc(count)));
  const folder = gender === "woman" ? "women" : "men";
  const normalizedSeed = (Math.trunc(seedIndex) % 100 + 100) % 100;
  const indexes = [];
  for (let offset = 0; offset < 3 && indexes.length < normalizedCount; offset += 1) {
    const candidate = (normalizedSeed + offset * 17) % 100;
    if (!indexes.includes(candidate)) {
      indexes.push(candidate);
    }
  }
  return indexes.map((index) => `https://randomuser.me/api/portraits/${folder}/${index}.jpg`);
}
var CURRENT_PROFILE_FORM_VERSION = 2;
var BASE_DEMO_USERS = [
  {
    id: "u1",
    name: "Farkas Anna",
    age: 28,
    birthday: "1997-05-12",
    city: "Austin",
    height: "170 cm",
    physique: "Athletic",
    languages: ["English", "Spanish"],
    horoscope: "Taurus",
    initials: "FA",
    gender: "woman",
    statusText: "Recently Active",
    hostTier: "Platinum Host",
    traitLabel: "Empatikus",
    completion: 72,
    headline: "Planning cozy chaos with structure.",
    about: "I host events where social energy stays high, but logistics stay clean and predictable.",
    images: buildDemoPortraitStack("woman", 74),
    profileStatus: "public",
    activities: { game: 9, chats: 8, invitations: 4, events: 6, hosting: 3 }
  },
  {
    id: "u2",
    name: "Kiss Bal\xE1zs",
    age: 31,
    birthday: "1994-09-23",
    city: "Chicago",
    height: "182 cm",
    physique: "Lean",
    languages: ["English", "Hungarian"],
    horoscope: "Libra",
    initials: "KB",
    gender: "man",
    statusText: "Recently Active",
    hostTier: "Gold Host",
    traitLabel: "Megb\xEDzhat\xF3",
    completion: 64,
    headline: "Reliable planning, zero drama.",
    about: "I like compact events with clear timelines and simple role assignment.",
    images: buildDemoPortraitStack("man", 75),
    profileStatus: "public",
    activities: { game: 4, chats: 3, invitations: 1, events: 2, hosting: 1 }
  },
  {
    id: "u3",
    name: "Nagy Eszter",
    age: 30,
    birthday: "1995-07-19",
    city: "Seattle",
    height: "168 cm",
    physique: "Fit",
    languages: ["English", "Hungarian"],
    horoscope: "Cancer",
    initials: "NE",
    gender: "woman",
    statusText: "Recently Active",
    hostTier: "Silver Host",
    traitLabel: "Kreat\xEDv",
    completion: 58,
    headline: "Art nights and adventure mornings.",
    about: "I enjoy cultural events and activity-heavy weekends with small groups.",
    images: buildDemoPortraitStack("woman", 76),
    profileStatus: "public",
    activities: { game: 6, chats: 7, invitations: 3, events: 4, hosting: 2 }
  },
  {
    id: "u4",
    name: "Maya Stone",
    age: 29,
    birthday: "1996-11-04",
    city: "San Diego",
    height: "172 cm",
    physique: "Athletic",
    languages: ["English"],
    horoscope: "Scorpio",
    initials: "MS",
    gender: "woman",
    statusText: "Recently Active",
    hostTier: "Gold Host",
    traitLabel: "Social Charmer",
    completion: 76,
    headline: "Sunset rides and coffee circles.",
    about: "I host social-first events where people who do not know each other can connect fast.",
    images: buildDemoPortraitStack("woman", 77),
    profileStatus: "public",
    activities: { game: 7, chats: 5, invitations: 3, events: 5, hosting: 2 }
  },
  {
    id: "u5",
    name: "Lina Park",
    age: 27,
    birthday: "1998-02-21",
    city: "Denver",
    height: "167 cm",
    physique: "Slim",
    languages: ["English", "Korean"],
    horoscope: "Pisces",
    initials: "LP",
    gender: "woman",
    statusText: "Recently Active",
    hostTier: "Silver Host",
    traitLabel: "Deep Thinker",
    completion: 68,
    headline: "Thoughtful plans, minimal noise.",
    about: "I prefer meaningful conversations and smaller events with quality curation.",
    images: buildDemoPortraitStack("woman", 78),
    profileStatus: "host only",
    activities: { game: 5, chats: 6, invitations: 4, events: 4, hosting: 1 }
  },
  {
    id: "u6",
    name: "Iris Bloom",
    age: 26,
    birthday: "1999-08-14",
    city: "Miami",
    height: "169 cm",
    physique: "Curvy",
    languages: ["English", "Portuguese"],
    horoscope: "Leo",
    initials: "IB",
    gender: "woman",
    statusText: "Recently Active",
    hostTier: "Bronze Host",
    traitLabel: "Adventurer",
    completion: 55,
    headline: "Travel light, host well.",
    about: "I organize active and travel-style events with flexible participant roles.",
    images: buildDemoPortraitStack("woman", 79),
    profileStatus: "public",
    activities: { game: 3, chats: 4, invitations: 2, events: 3, hosting: 1 }
  },
  {
    id: "u7",
    name: "Noah Hart",
    age: 30,
    birthday: "1995-03-07",
    city: "New York",
    height: "184 cm",
    physique: "Athletic",
    languages: ["English"],
    horoscope: "Pisces",
    initials: "NH",
    gender: "man",
    statusText: "Recently Active",
    hostTier: "Gold Host",
    traitLabel: "Playful Spirit",
    completion: 70,
    headline: "Fast pace, good vibes.",
    about: "I host sports and game-heavy events with structured follow-ups.",
    images: buildDemoPortraitStack("man", 80),
    profileStatus: "public",
    activities: { game: 8, chats: 9, invitations: 3, events: 5, hosting: 2 }
  },
  {
    id: "u8",
    name: "Evan Reed",
    age: 32,
    birthday: "1993-12-28",
    city: "Boston",
    height: "180 cm",
    physique: "Average",
    languages: ["English", "French"],
    horoscope: "Capricorn",
    initials: "ER",
    gender: "man",
    statusText: "Recently Active",
    hostTier: "Silver Host",
    traitLabel: "Ambitious Go-Getter",
    completion: 61,
    headline: "Metrics first, then movement.",
    about: "I optimize event outcomes and participant quality through filtered invites.",
    images: buildDemoPortraitStack("man", 81),
    profileStatus: "public",
    activities: { game: 4, chats: 4, invitations: 2, events: 3, hosting: 2 }
  },
  {
    id: "u9",
    name: "Kai Morgan",
    age: 25,
    birthday: "2000-04-18",
    city: "Portland",
    height: "178 cm",
    physique: "Slim",
    languages: ["English"],
    horoscope: "Aries",
    initials: "KM",
    gender: "man",
    statusText: "Recently Active",
    hostTier: "Bronze Host",
    traitLabel: "Creative Soul",
    completion: 53,
    headline: "Design-led hangouts only.",
    about: "I design event atmospheres first and build flow around people and space.",
    images: buildDemoPortraitStack("man", 82),
    profileStatus: "host only",
    activities: { game: 2, chats: 5, invitations: 2, events: 2, hosting: 1 }
  },
  {
    id: "u10",
    name: "Luca Hale",
    age: 29,
    birthday: "1996-01-11",
    city: "Los Angeles",
    height: "183 cm",
    physique: "Fit",
    languages: ["English", "Italian"],
    horoscope: "Capricorn",
    initials: "LH",
    gender: "man",
    statusText: "Recently Active",
    hostTier: "Gold Host",
    traitLabel: "Reliable One",
    completion: 74,
    headline: "Always on time, always clear.",
    about: "I keep the calendar strict and communication transparent for all members.",
    images: buildDemoPortraitStack("man", 10),
    profileStatus: "public",
    activities: { game: 6, chats: 4, invitations: 2, events: 6, hosting: 3 }
  },
  {
    id: "u11",
    name: "Theo Lane",
    age: 33,
    birthday: "1992-10-02",
    city: "Nashville",
    height: "186 cm",
    physique: "Athletic",
    languages: ["English"],
    horoscope: "Libra",
    initials: "TL",
    gender: "man",
    statusText: "Recently Active",
    hostTier: "Silver Host",
    traitLabel: "Deep Thinker",
    completion: 60,
    headline: "Calm planning for complex events.",
    about: "I run long-format events with multiple sub-events and role-based access.",
    images: buildDemoPortraitStack("man", 11),
    profileStatus: "friends only",
    activities: { game: 5, chats: 3, invitations: 2, events: 4, hosting: 2 }
  },
  {
    id: "u12",
    name: "Milo Grant",
    age: 27,
    birthday: "1998-06-27",
    city: "Phoenix",
    height: "176 cm",
    physique: "Average",
    languages: ["English", "Spanish"],
    horoscope: "Cancer",
    initials: "MG",
    gender: "man",
    statusText: "Recently Active",
    hostTier: "Bronze Host",
    traitLabel: "Social Charmer",
    completion: 66,
    headline: "Curated nights, meaningful circles.",
    about: "I host quality-first social events with strong moderation and feedback loops.",
    images: buildDemoPortraitStack("man", 12),
    profileStatus: "public",
    activities: { game: 4, chats: 5, invitations: 3, events: 3, hosting: 1 }
  }
];
var SeedUserBuilder = class {
  static CITY_LOCATION_COORDINATES_BY_NAME = {
    Austin: { latitude: 30.2672, longitude: -97.7431 },
    Seattle: { latitude: 47.6062, longitude: -122.3321 },
    Chicago: { latitude: 41.8781, longitude: -87.6298 },
    Denver: { latitude: 39.7392, longitude: -104.9903 },
    Miami: { latitude: 25.7617, longitude: -80.1918 },
    Boston: { latitude: 42.3601, longitude: -71.0589 },
    Phoenix: { latitude: 33.4484, longitude: -112.074 },
    Nashville: { latitude: 36.1627, longitude: -86.7816 },
    "San Diego": { latitude: 32.7157, longitude: -117.1611 },
    Portland: { latitude: 45.5152, longitude: -122.6784 }
  };
  static buildExpandedDemoUsers(totalCount, baseUsers = BASE_DEMO_USERS) {
    const normalizedBaseUsers = baseUsers.map((user) => this.withStoredChatCounters(this.withResolvedLocationCoordinates(user)));
    if (baseUsers.length >= totalCount) {
      return this.withUniqueDemoPortraitUrls(normalizedBaseUsers.slice(0, totalCount));
    }
    const expanded = [...normalizedBaseUsers];
    const firstNamesWomen = ["Emma", "Sophia", "Olivia", "Mia", "Lina", "Nora", "Chloe", "Ivy", "Ava", "Zoe"];
    const firstNamesMen = ["Liam", "Noah", "Ethan", "Mason", "Lucas", "Owen", "Elijah", "Leo", "Ryan", "Alex"];
    const lastNames = ["Parker", "Reed", "Stone", "Lane", "Baker", "Hale", "Rivera", "Turner", "Brooks", "Grant"];
    const cities = ["Austin", "Seattle", "Chicago", "Denver", "Miami", "Boston", "Phoenix", "Nashville", "San Diego", "Portland"];
    const usedPrimaryPortraitUrls = new Set(expanded.map((user) => user.images?.[0]?.trim() ?? "").filter(Boolean));
    let generatedWomenCount = 0;
    let generatedMenCount = 0;
    for (let index = baseUsers.length; index < totalCount; index += 1) {
      const id = `u${index + 1}`;
      const template = normalizedBaseUsers[index % normalizedBaseUsers.length];
      const gender = index % 2 === 0 ? "woman" : "man";
      const firstNamePool = gender === "woman" ? firstNamesWomen : firstNamesMen;
      const generatedGenderIndex = gender === "woman" ? generatedWomenCount++ : generatedMenCount++;
      const firstName = firstNamePool[generatedGenderIndex % firstNamePool.length];
      const lastName = lastNames[(generatedGenderIndex * 3 + Math.floor(generatedGenderIndex / firstNamePool.length)) % lastNames.length];
      const name = `${firstName} ${lastName}`;
      const initials = `${firstName[0] ?? "U"}${lastName[0] ?? "S"}`.toUpperCase();
      const age = 24 + index % 12;
      const birthday = new Date(1990 + index % 11, index % 12, 1 + index % 27);
      const images = this.buildUniquePrimaryPortraitStack(gender, index * 7 % 100, usedPrimaryPortraitUrls);
      expanded.push(this.withStoredChatCounters(this.withResolvedLocationCoordinates(__spreadValues(__spreadProps(__spreadValues({}, template), {
        id,
        name,
        age,
        birthday: birthday.toISOString().slice(0, 10),
        city: cities[index % cities.length],
        initials,
        gender,
        images
      }), this.demoLifecycleStatusForIndex(index, totalCount)))));
    }
    return this.withUniqueDemoPortraitUrls(expanded);
  }
  static withUniqueDemoPortraitUrls(users) {
    const usersWithGallerySizes = users.map((user, index) => __spreadProps(__spreadValues({}, user), {
      images: (user.images ?? []).slice(0, this.demoPortraitCountForIndex(index))
    }));
    const reservedPortraitUrls = new Set(usersWithGallerySizes.flatMap((user) => (user.images ?? []).map((imageUrl) => imageUrl.trim()).filter(Boolean)));
    const usedPortraitUrls = /* @__PURE__ */ new Set();
    return usersWithGallerySizes.map((user) => __spreadProps(__spreadValues({}, user), {
      images: (user.images ?? []).map((imageUrl) => {
        const normalizedImageUrl = imageUrl.trim();
        if (!normalizedImageUrl || !usedPortraitUrls.has(normalizedImageUrl)) {
          if (normalizedImageUrl) {
            usedPortraitUrls.add(normalizedImageUrl);
          }
          return imageUrl;
        }
        const replacementImageUrl = this.nextAvailableDemoPortraitUrl(user.gender, normalizedImageUrl, reservedPortraitUrls);
        if (!replacementImageUrl) {
          return imageUrl;
        }
        reservedPortraitUrls.add(replacementImageUrl);
        usedPortraitUrls.add(replacementImageUrl);
        return replacementImageUrl;
      })
    }));
  }
  static demoPortraitCountForIndex(index) {
    const positionInDistribution = Math.max(0, Math.trunc(index)) % 5;
    if (positionInDistribution === 0) {
      return 3;
    }
    if (positionInDistribution === 1) {
      return 1;
    }
    return 2;
  }
  static nextAvailableDemoPortraitUrl(gender, imageUrl, reservedPortraitUrls) {
    const indexMatch = imageUrl.match(/\/(\d+)\.jpg$/);
    const initialIndex = Number.parseInt(indexMatch?.[1] ?? "", 10);
    if (!Number.isFinite(initialIndex)) {
      return null;
    }
    const folder = gender === "woman" ? "women" : "men";
    for (let offset = 1; offset <= 100; offset += 1) {
      const candidateIndex = (initialIndex + offset * 9) % 100;
      const candidateUrl = `https://randomuser.me/api/portraits/${folder}/${candidateIndex}.jpg`;
      if (!reservedPortraitUrls.has(candidateUrl)) {
        return candidateUrl;
      }
    }
    return null;
  }
  static buildUniquePrimaryPortraitStack(gender, seedIndex, usedPrimaryPortraitUrls) {
    for (let offset = 0; offset < 100; offset += 1) {
      const images2 = buildDemoPortraitStack(gender, seedIndex + offset);
      const primaryImageUrl2 = images2[0]?.trim() ?? "";
      if (primaryImageUrl2 && !usedPrimaryPortraitUrls.has(primaryImageUrl2)) {
        usedPrimaryPortraitUrls.add(primaryImageUrl2);
        return images2;
      }
    }
    const images = buildDemoPortraitStack(gender, seedIndex);
    const primaryImageUrl = images[0]?.trim() ?? "";
    if (primaryImageUrl) {
      usedPrimaryPortraitUrls.add(primaryImageUrl);
    }
    return images;
  }
  static demoLifecycleStatusForIndex(index, totalCount) {
    if (index === totalCount - 2) {
      return {
        status: "B",
        statusText: "Blocked",
        activities: { game: 0, chats: 1, invitations: 0, events: 0, hosting: 0 }
      };
    }
    if (index === totalCount - 1) {
      return {
        status: "D",
        deletedAtIso: AppUtils.anchorDate(environment.bootstrapOffsetInDays).toISOString(),
        statusText: "Deleted",
        activities: { game: 0, chats: 0, invitations: 0, events: 0, hosting: 0 }
      };
    }
    return {};
  }
  static resolveDemoLocationCoordinates(city, seedKey) {
    const base = this.CITY_LOCATION_COORDINATES_BY_NAME[city] ?? this.CITY_LOCATION_COORDINATES_BY_NAME["Austin"];
    const normalizedSeedKey = seedKey.trim() || city.trim() || "demo-user";
    const seed = AppUtils.hashText(normalizedSeedKey);
    const latitudeOffset = (seed % 29 - 14) * 12e-4;
    const longitudeOffset = (Math.floor(seed / 29) % 29 - 14) * 12e-4;
    return {
      latitude: this.roundCoordinate(base.latitude + latitudeOffset),
      longitude: this.roundCoordinate(base.longitude + longitudeOffset)
    };
  }
  static resolveUserAffinity(user) {
    const tokens = this.uniqueAffinityTokens([
      user.name,
      user.city,
      user.physique,
      ...user.languages ?? [],
      user.horoscope,
      user.gender,
      user.hostTier,
      user.traitLabel
    ]);
    const heightCm = this.parseHeightCm(user.height) ?? 170;
    return this.resolveAffinityTokenScore(tokens, `user:${user.id}`) * 97 + Math.max(18, Math.trunc(Number(user.age) || 30)) * 17 + heightCm * 11 + Math.max(0, Math.trunc(Number(user.completion) || 0)) * 13;
  }
  static withResolvedLocationCoordinates(user) {
    const nextUser = __spreadProps(__spreadValues({}, user), {
      profileFormVersion: this.resolveSeedProfileFormVersion(user.profileFormVersion),
      locationCoordinates: this.cloneLocationCoordinates(user.locationCoordinates) ?? this.resolveDemoLocationCoordinates(user.city, user.id)
    });
    return __spreadProps(__spreadValues({}, nextUser), {
      affinity: Number.isFinite(nextUser.affinity) ? Number(nextUser.affinity) : this.resolveUserAffinity(nextUser)
    });
  }
  static withStoredChatCounters(user) {
    const normalize = (value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? Math.max(0, Math.trunc(parsed)) : 0;
    };
    const chats = normalize(user.activities?.chats);
    return __spreadProps(__spreadValues({}, user), {
      paymentTotals: user.paymentTotals ? {
        outgoing: __spreadValues({}, user.paymentTotals.outgoing),
        incoming: __spreadValues({}, user.paymentTotals.incoming),
        all: __spreadValues({}, user.paymentTotals.all)
      } : {
        outgoing: { HUF: 34800 },
        incoming: { HUF: 14e3 },
        all: { HUF: 48800 }
      },
      activities: __spreadProps(__spreadValues({}, user.activities), {
        chats,
        chat: {
          all: normalize(user.activities?.chat?.all ?? chats),
          event: normalize(user.activities?.chat?.event),
          subEvent: normalize(user.activities?.chat?.subEvent),
          group: normalize(user.activities?.chat?.group),
          service: normalize(user.activities?.chat?.service),
          appSupport: normalize(user.activities?.chat?.appSupport)
        }
      })
    });
  }
  static resolveSeedProfileFormVersion(value) {
    const parsed = Math.trunc(Number(value));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : CURRENT_PROFILE_FORM_VERSION;
  }
  static cloneLocationCoordinates(value) {
    if (!value || !Number.isFinite(value.latitude) || !Number.isFinite(value.longitude)) {
      return null;
    }
    return {
      latitude: this.roundCoordinate(value.latitude),
      longitude: this.roundCoordinate(value.longitude)
    };
  }
  static uniqueAffinityTokens(values) {
    const seen = /* @__PURE__ */ new Set();
    for (const value of values) {
      const normalized = AppUtils.normalizeText(`${value ?? ""}`.replace(/^#+\s*/, "").trim());
      if (normalized) {
        seen.add(normalized);
      }
    }
    return [...seen];
  }
  static resolveAffinityTokenScore(tokens, seedPrefix) {
    return tokens.reduce((total, token) => total + (AppUtils.hashText(`${seedPrefix}:${token}`) % 997 + 1), 0);
  }
  static parseHeightCm(value) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) {
      return null;
    }
    return Math.max(40, Math.min(250, parsed));
  }
  static roundCoordinate(value) {
    return Math.round(value * 1e6) / 1e6;
  }
};

// src/app/shared/core/local/seed/seed-constants.ts
var SEED_SCHEDULE_REFERENCE_DATE = new Date(2026, 1, 18, 0, 0, 0, 0);

// src/app/shared/core/local/seed/builders/chats-seed.builder.ts
var SEED_CHAT_ITEMS_BY_USER = {
  "admin-demo-ava": [
    {
      id: "c-support-admin-u1",
      avatar: "FA",
      title: "MyScoutee Support \xB7 Farkas Anna",
      lastMessage: "Please check this shared asset screen.",
      lastSenderId: "u1",
      memberIds: ["u1", "admin-demo-ava", "admin-demo-noel"],
      unread: 1,
      channelType: "supportCase",
      ownerId: "c-support-admin-u1",
      supportCase: {
        status: "pending",
        assignee: null,
        updatedAtIso: "2026-05-13T01:18:00.000Z"
      }
    },
    {
      id: "c-support-admin-u2",
      avatar: "KB",
      title: "MyScoutee Support \xB7 Kiss Bal\xE1zs",
      lastMessage: "I am looking into the blocked-event report.",
      lastSenderId: "admin-demo-noel",
      memberIds: ["u2", "admin-demo-ava", "admin-demo-noel"],
      unread: 0,
      channelType: "supportCase",
      ownerId: "c-support-admin-u2",
      supportCase: {
        status: "picked",
        assignee: {
          userId: "admin-demo-noel",
          name: "Noel",
          initials: "NO"
        },
        updatedAtIso: "2026-05-13T01:32:00.000Z"
      }
    },
    {
      id: "c-support-admin-u3",
      avatar: "NE",
      title: "MyScoutee Support \xB7 Nagy Eszter",
      lastMessage: "Case closed after moderation review.",
      lastSenderId: "admin-demo-ava",
      memberIds: ["u3", "admin-demo-ava", "admin-demo-noel"],
      unread: 0,
      channelType: "supportCase",
      ownerId: "c-support-admin-u3",
      supportCase: {
        status: "solved",
        assignee: {
          userId: "admin-demo-ava",
          name: "Ava",
          initials: "AV"
        },
        updatedAtIso: "2026-05-13T01:40:00.000Z"
      }
    }
  ],
  "admin-demo-noel": [
    {
      id: "c-support-admin-u1",
      avatar: "FA",
      title: "MyScoutee Support \xB7 Farkas Anna",
      lastMessage: "Please check this shared asset screen.",
      lastSenderId: "u1",
      memberIds: ["u1", "admin-demo-ava", "admin-demo-noel"],
      unread: 1,
      channelType: "supportCase",
      ownerId: "c-support-admin-u1",
      supportCase: {
        status: "pending",
        assignee: null,
        updatedAtIso: "2026-05-13T01:18:00.000Z"
      }
    },
    {
      id: "c-support-admin-u2",
      avatar: "KB",
      title: "MyScoutee Support \xB7 Kiss Bal\xE1zs",
      lastMessage: "I am looking into the blocked-event report.",
      lastSenderId: "admin-demo-noel",
      memberIds: ["u2", "admin-demo-ava", "admin-demo-noel"],
      unread: 0,
      channelType: "supportCase",
      ownerId: "c-support-admin-u2",
      supportCase: {
        status: "picked",
        assignee: {
          userId: "admin-demo-noel",
          name: "Noel",
          initials: "NO"
        },
        updatedAtIso: "2026-05-13T01:32:00.000Z"
      }
    },
    {
      id: "c-support-admin-u3",
      avatar: "NE",
      title: "MyScoutee Support \xB7 Nagy Eszter",
      lastMessage: "Case closed after moderation review.",
      lastSenderId: "admin-demo-ava",
      memberIds: ["u3", "admin-demo-ava", "admin-demo-noel"],
      unread: 0,
      channelType: "supportCase",
      ownerId: "c-support-admin-u3",
      supportCase: {
        status: "solved",
        assignee: {
          userId: "admin-demo-ava",
          name: "Ava",
          initials: "AV"
        },
        updatedAtIso: "2026-05-13T01:40:00.000Z"
      }
    }
  ],
  u1: [
    {
      id: "c-support-admin-u1",
      avatar: "MS",
      title: "MyScoutee Support",
      lastMessage: "Please check this shared asset screen.",
      lastSenderId: "u1",
      memberIds: ["u1", "admin-demo-ava", "admin-demo-noel"],
      unread: 0,
      channelType: "appSupport",
      ownerId: "c-support-admin-u1",
      serviceContext: "notification"
    },
    {
      id: "c1",
      avatar: "MS",
      title: "Driver Split - Alpine Weekend",
      lastMessage: "I can take one extra seat from downtown pickup.",
      lastSenderId: "u5",
      memberIds: ["u5", "u4", "u10", "u7"],
      unread: 5
    },
    {
      id: "c2",
      avatar: "NH",
      title: "Padel Night Pair Room",
      lastMessage: "Pair mode starts in 20 mins.",
      lastSenderId: "u7",
      memberIds: ["u7", "u6", "u10", "u3", "u11"],
      unread: 2
    },
    {
      id: "c3",
      avatar: "LH",
      title: "Host Circle Ops",
      lastMessage: "2 invites timed out. Should we rerun now?",
      lastSenderId: "u10",
      memberIds: ["u10", "u12", "u8"],
      unread: 1
    }
  ],
  u2: [
    {
      id: "c4",
      avatar: "IB",
      title: "City Brunch - Main Room",
      lastMessage: "Table booked for 12:30.",
      lastSenderId: "u6",
      memberIds: ["u6", "u4", "u1"],
      unread: 2
    }
  ],
  u3: [
    {
      id: "c-app-support-u3",
      avatar: "MS",
      title: "MyScoutee Support",
      lastMessage: "Share your workspace here when something looks wrong.",
      lastSenderId: "admin-demo-ava",
      memberIds: ["u3", "admin-demo-ava", "admin-demo-noel"],
      unread: 1,
      channelType: "appSupport",
      ownerId: "c-app-support-u3",
      serviceContext: "notification"
    },
    {
      id: "c5",
      avatar: "LP",
      title: "Trail Group - Transport",
      lastMessage: "Need one more transport seat.",
      lastSenderId: "u5",
      memberIds: ["u5", "u7", "u10", "u1"],
      unread: 4
    }
  ]
};
var SeedChatsBuilder = class _SeedChatsBuilder {
  static DEFAULT_USER_COUNT = 50;
  static FALLBACK_TIME = "2026-02-21T09:00:00";
  static USERS_BY_ID = new Map(SeedUserBuilder.buildExpandedDemoUsers(_SeedChatsBuilder.DEFAULT_USER_COUNT).map((user) => [user.id, user]));
  static ADMIN_USERS_BY_ID = /* @__PURE__ */ new Map([
    ["admin-demo-ava", { id: "admin-demo-ava", name: "Ava", initials: "AV", gender: "woman", images: ["https://randomuser.me/api/portraits/women/65.jpg"] }],
    ["admin-demo-noel", { id: "admin-demo-noel", name: "Noel", initials: "NO", gender: "man", images: ["https://randomuser.me/api/portraits/men/32.jpg"] }]
  ]);
  static buildSeedRecordCollection() {
    return this.buildRecordCollection(Object.fromEntries(Object.entries(SEED_CHAT_ITEMS_BY_USER).map(([ownerUserId, items]) => [
      ownerUserId,
      items.map((item) => __spreadProps(__spreadValues({}, item), {
        memberIds: [...item.memberIds]
      }))
    ])));
  }
  static buildContextualRecordCollectionForUser(ownerUserId, eventRecords) {
    return this.buildRecordCollection({
      [ownerUserId]: this.buildContextualChatItemsForUser(ownerUserId, eventRecords)
    });
  }
  static buildContextualChatItemsForUser(ownerUserId, eventRecords) {
    const normalizedOwnerUserId = ownerUserId.trim();
    if (!normalizedOwnerUserId) {
      return [];
    }
    const records = eventRecords.filter((record) => (record.type === "events" || record.type === "hosting") && record.status !== "T");
    if (records.length === 0) {
      return [];
    }
    const items = [];
    for (const record of records) {
      items.push(this.buildServiceContextChat(normalizedOwnerUserId, record));
      const mainChat = this.buildMainContextChat(normalizedOwnerUserId, record);
      if (mainChat) {
        items.push(mainChat);
      }
      const subEvents = this.sortSubEventsByStartAsc(this.contextSubEvents(record));
      for (const [index, subEvent] of subEvents.entries()) {
        const stageLabel = `Stage ${index + 1}`;
        if (subEvent.optional) {
          const optionalChat = this.buildOptionalContextChat(normalizedOwnerUserId, record, subEvent, stageLabel);
          if (optionalChat) {
            items.push(optionalChat);
          }
        }
        items.push(...this.buildGroupContextChats(normalizedOwnerUserId, record, subEvent, stageLabel));
      }
    }
    return items;
  }
  static buildRecordCollection(itemsByUser) {
    const byId = {};
    const ids = [];
    const messageById = {};
    const messageIds = [];
    const messageIdsByChatKey = {};
    for (const [ownerUserId, items] of Object.entries(itemsByUser)) {
      for (const item of items) {
        const recordKey = this.buildRecordKey(ownerUserId, item.id);
        const dateIso = this.buildDateIso(ownerUserId, item);
        const messageRecords = this.buildMessageRecords(ownerUserId, item, dateIso);
        byId[recordKey] = __spreadProps(__spreadValues({}, item), {
          supportCase: this.rebaseSupportCase(item.supportCase),
          memberIds: [...item.memberIds],
          unread: this.countUnreadMessageRecords(messageRecords, ownerUserId),
          ownerUserId,
          dateIso
        });
        ids.push(recordKey);
        const chatKey = this.buildChatMessageChatKey(ownerUserId, item.id);
        for (const message of messageRecords) {
          messageById[message.recordId] = message;
          messageIds.push(message.recordId);
          messageIdsByChatKey[chatKey] = [...messageIdsByChatKey[chatKey] ?? [], message.recordId];
        }
      }
    }
    return {
      chats: { byId, ids },
      chatMessages: {
        byId: messageById,
        ids: messageIds,
        idsByChatKey: messageIdsByChatKey
      }
    };
  }
  static cloneRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      memberIds: [...record.memberIds],
      supportCase: this.cloneSupportCase(record.supportCase)
    });
  }
  static buildRecordKey(ownerUserId, sourceId) {
    return `${ownerUserId}:${sourceId}`;
  }
  static buildChatMessageChatKey(ownerUserId, chatId) {
    return `${ownerUserId.trim()}:${chatId.trim()}`;
  }
  static buildChatMessageRecordKey(ownerUserId, chatId, messageId) {
    return `${ownerUserId.trim()}:${chatId.trim()}:${messageId.trim()}`;
  }
  static buildMainContextChat(ownerUserId, record) {
    const eventTitle = record.title.trim() || "Event";
    const memberIds = this.acceptedParentMemberIdsForOwner(ownerUserId, record);
    if (memberIds.length === 0) {
      return null;
    }
    return this.createContextChatItem({
      id: `c-context-main-${record.id}`,
      title: `${eventTitle} \xB7 Main Event`,
      lastMessage: `Main event channel for ${eventTitle}.`,
      ownerId: record.id,
      eventId: record.id,
      ownerStatus: record.status,
      channelType: "mainEvent",
      memberIds,
      dateIso: record.startAtIso,
      contextStartAtIso: record.startAtIso,
      contextEndAtIso: record.endAtIso,
      unread: Math.max(0, Math.trunc(Number(record.pendingMembers) || 0))
    }, ownerUserId);
  }
  static buildServiceContextChat(ownerUserId, record) {
    const eventTitle = record.title.trim() || "Event";
    const organizerUserId = `${record.creatorUserId ?? ""}`.trim();
    const memberIds = this.uniqueUserIds([
      ownerUserId,
      organizerUserId,
      ...record.type === "hosting" ? this.seedEventMemberIds(ownerUserId, record, Math.max(record.acceptedMembers + record.pendingMembers, 1)) : []
    ]);
    return __spreadProps(__spreadValues({}, this.createContextChatItem({
      id: `c-service-event-${record.id}-${ownerUserId}`,
      title: `${record.type === "hosting" ? "Notify Participants" : "Contact Organizer"} \xB7 ${eventTitle}`,
      lastMessage: record.type === "hosting" ? "Notification channel for cancellations, postponements, and urgent event updates." : `Service chat with the organizer for ${eventTitle}.`,
      ownerId: record.id,
      eventId: record.id,
      ownerStatus: record.status,
      channelType: "serviceEvent",
      memberIds: memberIds.length > 0 ? memberIds : [ownerUserId],
      dateIso: record.startAtIso,
      contextStartAtIso: record.startAtIso,
      contextEndAtIso: record.endAtIso,
      unread: 0
    }, ownerUserId)), {
      serviceContext: record.type === "hosting" ? "notification" : "event"
    });
  }
  static buildOptionalContextChat(ownerUserId, record, subEvent, stageLabel) {
    const acceptedTarget = this.contextChatMemberTarget(record, subEvent);
    if (acceptedTarget <= 0) {
      return null;
    }
    const eventTitle = record.title.trim() || "Event";
    const memberIds = this.acceptedParentMemberIdsForOwner(ownerUserId, record).slice(0, Math.max(1, acceptedTarget));
    if (memberIds.length === 0) {
      return null;
    }
    return this.createContextChatItem({
      id: `c-context-optional-${record.id}-${subEvent.id}`,
      title: `${subEvent.name || "Optional Sub Event"} \xB7 Optional`,
      lastMessage: `${stageLabel} optional channel in ${eventTitle}.`,
      ownerId: this.subEventOwnerId(record.id, subEvent.id),
      eventId: record.id,
      ownerStatus: record.status,
      channelType: "optionalSubEvent",
      memberIds,
      dateIso: subEvent.startAt || record.startAtIso,
      contextStartAtIso: subEvent.startAt || record.startAtIso,
      contextEndAtIso: subEvent.endAt || record.endAtIso,
      unread: this.sumSubEventPending(subEvent, true)
    }, ownerUserId);
  }
  static buildGroupContextChats(ownerUserId, record, subEvent, stageLabel) {
    if (!this.hasTournamentGroupContext(subEvent)) {
      return [];
    }
    const eventTitle = record.title.trim() || "Event";
    const groupsCount = Math.max(1, this.countValue(subEvent.groupsCount));
    const groupCapacity = Math.max(this.countValue(subEvent.tournamentGroupCapacityMax), this.countValue(subEvent.tournamentGroupCapacityMin), 4);
    const acceptedTarget = Math.max(1, this.contextChatMemberTarget(record, subEvent));
    const parentMemberIds = this.uniqueUserIds([
      ...record.acceptedMemberUserIds ?? [],
      ...record.adminIds ?? []
    ]).slice(0, acceptedTarget);
    if (!parentMemberIds.includes(ownerUserId)) {
      return [];
    }
    return Array.from({ length: groupsCount }, (_, groupIndex) => {
      const memberIds = parentMemberIds.filter((_2, memberIndex) => memberIndex % groupsCount === groupIndex).slice(0, groupCapacity);
      if (!memberIds.includes(ownerUserId)) {
        return null;
      }
      const groupId = `${subEvent.id}-group-${groupIndex + 1}`;
      const groupName = `Group ${String.fromCharCode(65 + groupIndex % 26)}`;
      return this.createContextChatItem({
        id: `c-context-group-${record.id}-${subEvent.id}-${groupId}`,
        title: `${groupName} \xB7 ${subEvent.name || stageLabel}`,
        lastMessage: `${stageLabel} group channel in ${eventTitle}.`,
        ownerId: this.groupOwnerId(record.id, subEvent.id, groupId),
        eventId: record.id,
        ownerStatus: record.status,
        channelType: "groupSubEvent",
        memberIds,
        dateIso: subEvent.startAt || record.startAtIso,
        contextStartAtIso: subEvent.startAt || record.startAtIso,
        contextEndAtIso: subEvent.endAt || record.endAtIso,
        unread: this.sumSubEventPending(subEvent, true)
      }, ownerUserId);
    }).filter((item) => item !== null);
  }
  static createContextChatItem(input, ownerUserId) {
    const memberIds = this.uniqueUserIds(input.memberIds);
    const senderCandidates = memberIds.filter((id) => id !== ownerUserId);
    const lastSenderId = senderCandidates[0] ?? memberIds[0] ?? ownerUserId;
    return {
      id: input.id,
      avatar: AppUtils.initialsFromText(input.title),
      title: input.title,
      lastMessage: input.lastMessage,
      lastSenderId,
      memberIds,
      unread: Math.max(0, Math.trunc(Number(input.unread) || 0)),
      dateIso: input.dateIso,
      contextStartAtIso: input.contextStartAtIso,
      contextEndAtIso: input.contextEndAtIso,
      channelType: input.channelType,
      ownerId: input.ownerId,
      eventId: input.eventId,
      ownerStatus: input.ownerStatus
    };
  }
  static seedEventMemberIds(ownerUserId, record, targetCount) {
    const explicit = this.uniqueUserIds([
      ownerUserId,
      ...record.acceptedMemberUserIds ?? []
    ]);
    if (explicit.length >= Math.max(1, targetCount)) {
      return explicit.slice(0, Math.max(1, targetCount));
    }
    return this.uniqueUserIds([
      ...explicit,
      ...SeedEventBuilder.seededEventMemberIds(record.id, Math.max(Math.max(4, targetCount), explicit.length), [...this.USERS_BY_ID.values()], ownerUserId)
    ]);
  }
  static acceptedParentMemberIdsForOwner(ownerUserId, record) {
    const normalizedOwnerUserId = ownerUserId.trim();
    const acceptedParentMemberIds = this.uniqueUserIds([
      ...record.acceptedMemberUserIds ?? [],
      ...record.adminIds ?? []
    ]);
    if (!normalizedOwnerUserId || !acceptedParentMemberIds.includes(normalizedOwnerUserId)) {
      return [];
    }
    return [
      normalizedOwnerUserId,
      ...acceptedParentMemberIds.filter((userId) => userId !== normalizedOwnerUserId)
    ];
  }
  static sumSubEventPending(subEvent, includeMembers) {
    return (includeMembers ? this.countValue(subEvent.membersPending) : 0) + this.countValue(subEvent.carsPending) + this.countValue(subEvent.accommodationPending) + this.countValue(subEvent.suppliesPending);
  }
  static contextChatMemberTarget(record, subEvent) {
    return Math.max(1, this.countValue(subEvent.membersAccepted), Math.min(Math.max(1, this.countValue(subEvent.capacityMax)), Math.max(1, this.countValue(record.acceptedMembers))));
  }
  static hasTournamentGroupContext(subEvent) {
    return subEvent.optional !== true && (this.countValue(subEvent.tournamentGroupCapacityMin) > 0 || this.countValue(subEvent.tournamentGroupCapacityMax) > 0 || this.countValue(subEvent.groupsCount) > 0);
  }
  static countValue(value) {
    return Math.max(0, Math.trunc(Number(value) || 0));
  }
  static uniqueUserIds(ids) {
    const unique = [];
    for (const id of ids) {
      const normalizedId = `${id ?? ""}`.trim();
      if (!normalizedId || unique.includes(normalizedId)) {
        continue;
      }
      unique.push(normalizedId);
    }
    return unique;
  }
  static contextSubEvents(record) {
    return (record.subEvents ?? []).map((item, index) => ({
      id: `${item.id ?? ""}`.trim() || `subevent-${index + 1}`,
      name: `${item.name ?? ""}`.trim() || `Sub Event ${index + 1}`,
      description: `${item.description ?? ""}`.trim(),
      optional: item.optional === true,
      startAt: `${item.startAt ?? ""}`.trim() || record.startAtIso,
      endAt: `${item.endAt ?? ""}`.trim() || record.endAtIso,
      location: `${item.location ?? ""}`.trim(),
      capacityMin: item.capacityMin ?? null,
      capacityMax: item.capacityMax ?? item.tournamentGroupCapacityMax ?? null,
      groupsCount: item.groupsCount ?? null,
      tournamentGroupCapacityMin: item.tournamentGroupCapacityMin ?? null,
      tournamentGroupCapacityMax: item.tournamentGroupCapacityMax ?? null,
      tournamentLeaderboardType: item.tournamentLeaderboardType ?? null,
      tournamentAdvancePerGroup: item.tournamentAdvancePerGroup ?? null,
      membersAccepted: item.membersAccepted ?? 0,
      membersPending: item.membersPending ?? 0,
      carsPending: item.carsPending ?? 0,
      accommodationPending: item.accommodationPending ?? 0,
      suppliesPending: item.suppliesPending ?? 0
    }));
  }
  static sortSubEventsByStartAsc(items) {
    return [...items].sort((left, right) => AppUtils.toSortableDate(left.startAt) - AppUtils.toSortableDate(right.startAt));
  }
  static buildDateIso(ownerUserId, item) {
    const seed = AppUtils.hashText(`chat-date:${ownerUserId}:${item.id}:${item.title}`);
    const value = AppUtils.shiftDate(new Date(this.FALLBACK_TIME), SEED_SCHEDULE_REFERENCE_DATE, environment.bootstrapOffsetInDays);
    value.setDate(value.getDate() + seed % 9);
    value.setHours(8 + seed % 11, seed % 4 * 15, 0, 0);
    return AppUtils.toIsoDateTime(value);
  }
  static buildMessageRecords(ownerUserId, item, anchorIso) {
    const me = this.resolveUser(ownerUserId);
    if (!me) {
      return [];
    }
    const members = this.resolveMembers(item, me);
    const sender = this.resolveSender(item, members, me);
    const anchor = new Date(anchorIso || this.rebaseDateIso(this.FALLBACK_TIME));
    const at = (minutesBefore) => new Date(anchor.getTime() - minutesBefore * 60 * 1e3);
    const mk = (id, author, text, sentAt, readBy) => ({
      recordId: this.buildChatMessageRecordKey(ownerUserId, item.id, id),
      ownerUserId,
      chatId: item.id,
      messageId: id,
      senderName: author.name,
      senderAvatar: {
        userId: author.id,
        initials: author.initials,
        gender: author.gender,
        imageUrl: this.seedAvatarImageUrl(author)
      },
      bodyText: text,
      timeLabel: sentAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      sentAtIso: AppUtils.toIsoDateTime(sentAt),
      mine: author.id === me.id,
      readBy: readBy.map((user) => ({
        userId: user.id,
        initials: user.initials,
        gender: user.gender,
        imageUrl: this.seedAvatarImageUrl(user)
      })),
      reactions: [],
      attachments: []
    });
    const memberA = members[0] ?? me;
    const memberB = members[1] ?? sender;
    const memberC = members[2] ?? me;
    const chatTopic = item.title.trim() || "Event";
    const lastLine = item.lastMessage.trim() || `Update shared in ${chatTopic}.`;
    if (this.isSupportCaseChat(item)) {
      return this.applySeedUnreadState(item, me, this.buildSupportCaseMessages(item, me, members, sender, anchor, mk));
    }
    const seed = AppUtils.hashText(`${ownerUserId}:${item.id}:${chatTopic}`);
    const olderPool = [
      "Shared updated ETA for everyone.",
      "Pinned the checklist in this room.",
      "Confirmed who can bring supplies.",
      "Noted backup plan if weather changes.",
      "Added the new member to transport.",
      "Assigned table and seat groups.",
      "Synced on arrival windows.",
      "Collected final confirmations."
    ];
    const olderMessages = [];
    const olderCount = 9;
    const olderBaseStart = new Date(anchor.getTime() - (olderCount + 12) * 40 * 60 * 1e3);
    for (let index = olderCount - 1; index >= 0; index -= 1) {
      const senderCycle = index % 3;
      const author = senderCycle === 0 ? memberA : senderCycle === 1 ? me : memberB;
      const baseText = olderPool[(seed + index) % olderPool.length];
      const sequenceFromOldest = olderCount - 1 - index;
      const sentAt = new Date(olderBaseStart.getTime() + sequenceFromOldest * 40 * 60 * 1e3);
      const readers = author.id === me.id ? [memberA, memberB] : [me, memberC];
      olderMessages.push(mk(`${item.id}-older-${index}`, author, baseText, sentAt, readers));
    }
    const recentMessages = [
      mk(`${item.id}-1`, memberA, `Let us align the plan for ${chatTopic}.`, at(180), [memberB, memberC]),
      mk(`${item.id}-2`, memberB, "I can bring two more people.", at(140), [memberA, memberC]),
      mk(`${item.id}-3`, memberC, "Route and timing look good on my side.", at(95), [memberA, memberB]),
      mk(`${item.id}-4`, me, "Perfect, locking this in.", at(48), [memberA, memberB, memberC]),
      mk(`${item.id}-5`, sender, lastLine, at(12), [memberA, memberB])
    ];
    return this.applySeedUnreadState(item, me, [...olderMessages, ...recentMessages].sort((first, second) => AppUtils.toSortableDate(first.sentAtIso) - AppUtils.toSortableDate(second.sentAtIso)));
  }
  static applySeedUnreadState(item, owner, messages) {
    const unreadTarget = this.countValue(item.unread);
    const incomingIndexes = messages.map((message, index) => ({ message, index })).filter((entry) => !entry.message.mine && entry.message.senderAvatar.userId !== owner.id).sort((left, right) => AppUtils.toSortableDate(right.message.sentAtIso) - AppUtils.toSortableDate(left.message.sentAtIso)).map((entry) => entry.index);
    const unreadIndexes = new Set(incomingIndexes.slice(0, unreadTarget));
    return messages.map((message, index) => {
      if (message.mine || message.senderAvatar.userId === owner.id) {
        return message;
      }
      return unreadIndexes.has(index) ? this.withoutMessageReader(message, owner.id) : this.withMessageReader(message, owner);
    });
  }
  static withoutMessageReader(message, userId) {
    const nextReadBy = (message.readBy ?? []).filter((reader) => reader.userId !== userId);
    return nextReadBy.length === message.readBy.length ? message : __spreadProps(__spreadValues({}, message), {
      readBy: nextReadBy
    });
  }
  static withMessageReader(message, user) {
    if ((message.readBy ?? []).some((reader) => reader.userId === user.id)) {
      return message;
    }
    return __spreadProps(__spreadValues({}, message), {
      readBy: [
        ...message.readBy ?? [],
        {
          userId: user.id,
          initials: user.initials,
          gender: user.gender,
          imageUrl: this.seedAvatarImageUrl(user)
        }
      ]
    });
  }
  static countUnreadMessageRecords(messages, ownerUserId) {
    return messages.filter((message) => !message.mine && message.senderAvatar.userId !== ownerUserId && !(message.readBy ?? []).some((reader) => reader.userId === ownerUserId)).length;
  }
  static rebaseOptionalDateIso(value) {
    const normalizedValue = `${value ?? ""}`.trim();
    if (!normalizedValue) {
      return void 0;
    }
    return this.rebaseDateIso(normalizedValue);
  }
  static rebaseDateIso(value) {
    return AppUtils.rebaseDateTime(value, SEED_SCHEDULE_REFERENCE_DATE, environment.bootstrapOffsetInDays) ?? value;
  }
  static rebaseSupportCase(supportCase) {
    if (!supportCase) {
      return supportCase;
    }
    return __spreadProps(__spreadValues({}, supportCase), {
      assignee: supportCase.assignee ? __spreadValues({}, supportCase.assignee) : supportCase.assignee,
      updatedAtIso: this.rebaseOptionalDateIso(supportCase.updatedAtIso)
    });
  }
  static cloneSupportCase(supportCase) {
    if (!supportCase) {
      return supportCase;
    }
    return __spreadProps(__spreadValues({}, supportCase), {
      assignee: supportCase.assignee ? __spreadValues({}, supportCase.assignee) : supportCase.assignee
    });
  }
  static subEventOwnerId(eventId, subEventId) {
    return `${eventId}:${subEventId}`;
  }
  static groupOwnerId(eventId, subEventId, groupId) {
    return `${eventId}:${subEventId}:${groupId}`;
  }
  static buildSupportCaseMessages(item, me, members, sender, anchor, mk) {
    const at = (minutesBefore) => new Date(anchor.getTime() - minutesBefore * 60 * 1e3);
    const requester = members.find((user) => !this.isAdminSeedUser(user.id)) ?? sender;
    const assignedAdmin = this.resolveUser(item.supportCase?.assignee?.userId ?? "") ?? members.find((user) => this.isAdminSeedUser(user.id) && user.id !== requester.id) ?? me;
    const reviewer = members.find((user) => this.isAdminSeedUser(user.id) && user.id !== assignedAdmin.id) ?? assignedAdmin;
    const readByAdmins = this.uniqueSeedUsers([assignedAdmin, reviewer]);
    const readByRequesterAndReviewer = this.uniqueSeedUsers([requester, reviewer]);
    const lastLine = item.lastMessage.trim() || "Please check this support case.";
    const messages = [
      mk(`${item.id}-support-1`, requester, this.supportCaseOpeningLine(item), at(160), readByAdmins),
      mk(`${item.id}-support-2`, assignedAdmin, "Thanks, I can see the case. I am checking the related records now.", at(124), readByRequesterAndReviewer)
    ];
    if (item.supportCase?.status === "picked") {
      messages.push(mk(`${item.id}-support-3`, assignedAdmin, "I picked this up so the rest of the admin team can see it is being handled.", at(82), readByRequesterAndReviewer), mk(`${item.id}-support-4`, assignedAdmin, lastLine, at(42), readByRequesterAndReviewer));
    } else if (item.supportCase?.status === "solved") {
      messages.push(mk(`${item.id}-support-3`, requester, "That explains it, thanks for checking.", at(76), readByAdmins), mk(`${item.id}-support-4`, assignedAdmin, lastLine, at(34), readByRequesterAndReviewer));
    } else if (item.supportCase?.status === "blocked") {
      messages.push(mk(`${item.id}-support-3`, assignedAdmin, "This case is blocked while moderation checks the account and linked content.", at(48), readByRequesterAndReviewer));
    } else {
      messages.push(mk(`${item.id}-support-3`, requester, lastLine, at(44), readByAdmins));
    }
    return messages.sort((first, second) => AppUtils.toSortableDate(first.sentAtIso) - AppUtils.toSortableDate(second.sentAtIso));
  }
  static supportCaseOpeningLine(item) {
    if (item.id === "c-support-admin-u1") {
      return "Hi, I shared an asset screen and something looks wrong with the visible action.";
    }
    if (item.id === "c-support-admin-u2") {
      return "Can you review why my event is blocked? I think the status changed after the report.";
    }
    if (item.id === "c-support-admin-u3") {
      return "Thanks for looking at the moderation review. I just want to know whether anything else is needed.";
    }
    return "Hi, I need help with this support case.";
  }
  static isSupportCaseChat(item) {
    return item.channelType === "supportCase" || `${item.id ?? ""}`.trim().startsWith("c-support-admin-") || Boolean(item.supportCase);
  }
  static uniqueSeedUsers(users) {
    const unique = [];
    for (const user of users) {
      if (!user.id || unique.some((item) => item.id === user.id)) {
        continue;
      }
      unique.push(user);
    }
    return unique;
  }
  static isAdminSeedUser(userId) {
    return this.ADMIN_USERS_BY_ID.has(userId.trim());
  }
  static resolveUser(userId) {
    const normalized = userId.trim();
    return this.USERS_BY_ID.get(normalized) ?? this.ADMIN_USERS_BY_ID.get(normalized) ?? null;
  }
  static resolveMembers(item, fallback) {
    const resolved = (item.memberIds ?? []).map((id) => this.resolveUser(id)).filter((entry) => Boolean(entry));
    if (resolved.length > 0) {
      return resolved;
    }
    return [fallback, ...[...this.USERS_BY_ID.values()].filter((user) => user.id !== fallback.id).slice(0, 2)];
  }
  static resolveSender(item, members, fallback) {
    const explicit = item.lastSenderId ? this.resolveUser(item.lastSenderId) : null;
    if (explicit) {
      return explicit;
    }
    return members[0] ?? fallback;
  }
  static seedAvatarImageUrl(user) {
    return user.images?.map((image) => `${image ?? ""}`.trim()).find(Boolean) ?? null;
  }
};

// src/app/shared/core/local/seed/builders/event-feedback-seed.builder.ts
var SeedEventFeedbackBuilder = class {
  static buildSeededSubmittedState(options) {
    const eventId = options.eventRecord.id?.trim() ?? "";
    if (!eventId) {
      return null;
    }
    const eventCards = this.buildEventFeedbackCards({
      eventRecords: [options.eventRecord],
      users: options.users,
      activeUser: options.activeUser,
      eventFeedbackUnlockDelayMs: options.eventFeedbackUnlockDelayMs,
      eventOverallOptions: options.eventOverallOptions,
      hostImproveOptions: options.hostImproveOptions,
      attendeeCollabOptions: options.attendeeCollabOptions,
      attendeeRejoinOptions: options.attendeeRejoinOptions,
      personalityTraitOptions: options.personalityTraitOptions
    }).filter((card) => !(card.kind === "attendee" && card.attendeeUserId === options.activeUser.id));
    if (eventCards.length === 0) {
      return null;
    }
    const seed = AppUtils.hashText(options.seedKey?.trim() || `feedback-submitted:${options.activeUser.id}:${eventId}`);
    const submittedAtIso = this.seededSubmittedAtIso(options.eventRecord, options.eventFeedbackUnlockDelayMs, seed);
    const answersByCardId = {};
    for (const card of eventCards) {
      const answer = this.seededSubmittedAnswer(card, seed, submittedAtIso);
      answersByCardId[answer.cardId] = answer;
    }
    return {
      id: this.eventFeedbackStateRecordId(options.activeUser.id, eventId),
      userId: options.activeUser.id,
      eventId,
      removed: false,
      submittedAtIso,
      organizerNote: this.seededOrganizerNote(eventCards[0], seed),
      answersByCardId
    };
  }
  static buildSeededPersistedStates(options) {
    const eventRecordsById = new Map(options.eventRecords.map((record) => [record.id?.trim() ?? "", record]).filter(([eventId]) => eventId.length > 0));
    const cardsByEventId = /* @__PURE__ */ new Map();
    for (const card of this.buildEventFeedbackCards(options)) {
      if (card.kind === "attendee" && card.attendeeUserId === options.activeUser.id) {
        continue;
      }
      const eventCards = cardsByEventId.get(card.eventId) ?? [];
      eventCards.push(card);
      cardsByEventId.set(card.eventId, eventCards);
    }
    const orderedEventIds = [...cardsByEventId.keys()].sort((left, right) => {
      const leftStartAtMs = this.eventStartAtMs(eventRecordsById.get(left)) ?? 0;
      const rightStartAtMs = this.eventStartAtMs(eventRecordsById.get(right)) ?? 0;
      return leftStartAtMs - rightStartAtMs || left.localeCompare(right);
    });
    const states = [];
    for (const [index, eventId] of orderedEventIds.entries()) {
      const eventRecord = eventRecordsById.get(eventId);
      const eventCards = cardsByEventId.get(eventId) ?? [];
      if (!eventRecord || eventCards.length === 0) {
        continue;
      }
      const seed = AppUtils.hashText(`feedback-state:${options.activeUser.id}:${eventId}`);
      const recordId = this.eventFeedbackStateRecordId(options.activeUser.id, eventId);
      const variant = index % 3;
      if (variant === 0) {
        continue;
      }
      if (variant === 2) {
        states.push({
          id: recordId,
          userId: options.activeUser.id,
          eventId,
          removed: true,
          submittedAtIso: null,
          organizerNote: "",
          answersByCardId: {}
        });
        continue;
      }
      const submittedAtIso = this.seededSubmittedAtIso(eventRecord, options.eventFeedbackUnlockDelayMs, seed);
      const answersByCardId = {};
      for (const card of eventCards) {
        const answer = this.seededSubmittedAnswer(card, seed, submittedAtIso);
        answersByCardId[answer.cardId] = answer;
      }
      states.push({
        id: recordId,
        userId: options.activeUser.id,
        eventId,
        removed: false,
        submittedAtIso,
        organizerNote: seed % 3 === 0 ? this.seededOrganizerNote(eventCards[0], seed) : "",
        answersByCardId
      });
    }
    return states;
  }
  static buildEventFeedbackCards(options) {
    const nowMs = Date.now();
    const eventCards = [];
    for (const record of options.eventRecords) {
      const eventId = record.id?.trim() ?? "";
      if (!eventId || this.isEventAdminRecord(record, options.activeUser.id)) {
        continue;
      }
      const startMs = this.eventStartAtMs(record);
      if (startMs === null || nowMs < startMs + options.eventFeedbackUnlockDelayMs) {
        continue;
      }
      const host = this.feedbackHostUserForEvent(record, options.users, options.activeUser);
      const attendees = this.feedbackAttendeesForEvent(record, host.id, options.users, options.activeUser.id);
      eventCards.push({
        id: `feedback-event-${eventId}`,
        eventId,
        kind: "event",
        targetUserId: host.id,
        targetRole: "Admin",
        heading: record.title,
        primaryOptions: options.eventOverallOptions,
        secondaryOptions: options.hostImproveOptions,
        traitOptions: options.personalityTraitOptions
      });
      for (const attendee of attendees) {
        const attendeeRole = this.feedbackRoleForAttendee(eventId, attendee.id);
        eventCards.push({
          id: `feedback-attendee-${eventId}-${attendee.id}`,
          eventId,
          kind: "attendee",
          attendeeUserId: attendee.id,
          targetUserId: attendee.id,
          targetRole: attendeeRole,
          heading: `${attendee.name} \xB7 ${record.title}`,
          primaryOptions: options.attendeeCollabOptions,
          secondaryOptions: options.attendeeRejoinOptions,
          traitOptions: options.personalityTraitOptions
        });
      }
    }
    return eventCards;
  }
  static seededSubmittedAnswer(card, seed, submittedAtIso) {
    const primaryOption = this.seededOption(card.primaryOptions, `primary:${seed}:${card.id}`);
    const secondaryOption = this.seededOption(card.secondaryOptions, `secondary:${seed}:${card.id}`);
    const tags = /* @__PURE__ */ new Set();
    if (primaryOption?.impressionTag) {
      tags.add(primaryOption.impressionTag);
    }
    if (secondaryOption?.impressionTag) {
      tags.add(secondaryOption.impressionTag);
    }
    return {
      cardId: card.id,
      eventId: card.eventId,
      kind: card.kind,
      targetUserId: card.targetUserId ?? null,
      targetRole: card.targetRole ?? "Member",
      primaryValue: primaryOption?.value ?? "",
      secondaryValue: secondaryOption?.value ?? "",
      eventComment: card.kind === "event" ? "A welcoming event with a clear shared purpose." : "",
      personalityTraitIds: this.seededTraitIds(card, seed),
      tags: [...tags],
      submittedAtIso
    };
  }
  static seededOption(options, seedKey) {
    if (options.length === 0) {
      return null;
    }
    const index = AppUtils.hashText(seedKey) % options.length;
    return options[index] ?? options[0] ?? null;
  }
  static seededSubmittedAtIso(eventRecord, eventFeedbackUnlockDelayMs, seed) {
    const startMs = this.eventStartAtMs(eventRecord);
    const baseMs = startMs === null ? AppUtils.shiftDate(new Date(Date.UTC(2026, 2, 20, 18, 0, 0, 0)), SEED_SCHEDULE_REFERENCE_DATE, environment.bootstrapOffsetInDays).getTime() : startMs + eventFeedbackUnlockDelayMs;
    const offsetMinutes = 45 + seed % 180;
    return new Date(baseMs + offsetMinutes * 60 * 1e3).toISOString();
  }
  static seededOrganizerNote(card, seed) {
    const noteTemplates = [
      `Strong overall flow for ${card.heading}. I would tighten the timing at the start next round.`,
      `The vibe was good around ${card.heading}. A clearer check-in and role handoff would help next time.`,
      `Good energy on ${card.heading}. I would make the pacing a bit smoother between sections.`
    ];
    return noteTemplates[seed % noteTemplates.length] ?? noteTemplates[0];
  }
  static eventFeedbackStateRecordId(userId, eventId) {
    return `${userId.trim()}::${eventId.trim()}`;
  }
  static seededTraitIds(card, seed) {
    if (!Array.isArray(card.traitOptions) || card.traitOptions.length === 0) {
      return [];
    }
    const total = Math.min(3, card.traitOptions.length);
    const next = /* @__PURE__ */ new Set();
    for (let index = 0; index < total; index += 1) {
      const optionIndex = AppUtils.hashText(`trait:${seed}:${card.id}:${index}`) % card.traitOptions.length;
      const option = card.traitOptions[optionIndex];
      if (option?.id?.trim()) {
        next.add(option.id.trim());
      }
    }
    return [...next];
  }
  static eventStartAtMs(record) {
    const iso = record?.startAtIso?.trim() ?? "";
    if (!iso) {
      return null;
    }
    const value = new Date(iso).getTime();
    return Number.isNaN(value) ? null : value;
  }
  static feedbackHostUserForEvent(record, users, activeUser) {
    const creatorUserId = record.creatorUserId?.trim() ?? "";
    if (creatorUserId) {
      const creator = users.find((user) => user.id === creatorUserId);
      if (creator) {
        return creator;
      }
    }
    const candidates = users.filter((user) => user.id !== activeUser.id);
    if (candidates.length === 0) {
      return activeUser;
    }
    const index = AppUtils.hashText(`feedback-host:${record.id}`) % candidates.length;
    return candidates[index] ?? candidates[0];
  }
  static feedbackAttendeesForEvent(record, hostId, users, activeUserId) {
    const attendeeIds = [...new Set([
      ...record.acceptedMemberUserIds ?? [],
      ...record.pendingMemberUserIds ?? []
    ].map((userId) => `${userId}`.trim()).filter(Boolean))].filter((userId) => userId !== activeUserId && userId !== hostId);
    if (attendeeIds.length > 0) {
      const usersById = new Map(users.map((user) => [user.id, user]));
      const resolved = attendeeIds.map((userId) => usersById.get(userId)).filter((user) => Boolean(user));
      if (resolved.length > 0) {
        return resolved.slice(0, Math.min(5, resolved.length));
      }
    }
    const candidates = users.filter((user) => user.id !== activeUserId && user.id !== hostId);
    if (candidates.length === 0) {
      return [];
    }
    const seed = AppUtils.hashText(`feedback-attendees:${record.id}`);
    const desired = Math.min(candidates.length, 3 + seed % 4);
    const picked = [];
    for (let index = 0; index < candidates.length && picked.length < desired; index += 1) {
      const candidate = candidates[(seed + index * 3) % candidates.length];
      if (!candidate || candidate.id === activeUserId || picked.some((item) => item.id === candidate.id)) {
        continue;
      }
      picked.push(candidate);
    }
    return picked;
  }
  static feedbackRoleForAttendee(eventId, attendeeUserId) {
    const seed = AppUtils.hashText(`feedback-role:${eventId}:${attendeeUserId}`);
    if (seed % 11 === 0) {
      return "Admin";
    }
    if (seed % 4 === 0) {
      return "Manager";
    }
    return "Member";
  }
  static isEventAdminRecord(record, userId) {
    const normalizedUserId = `${userId ?? ""}`.trim();
    if (!normalizedUserId) {
      return false;
    }
    return record.creatorUserId?.trim() === normalizedUserId || (record.adminIds ?? []).some((adminId) => adminId.trim() === normalizedUserId);
  }
};

// src/app/shared/core/local/seed/builders/event-ticket-seed.builder.ts
var SeedEventTicketsBuilder = class {
  static buildRecordCollection(events) {
    const byId = {};
    const ids = [];
    const eventsById = /* @__PURE__ */ new Map();
    for (const event of events) {
      const current = eventsById.get(event.id);
      if (!current || event.userId === event.creatorUserId) {
        eventsById.set(event.id, event);
      }
    }
    for (const event of eventsById.values()) {
      if (`${event.status ?? "A"}`.trim() !== "A" || event.ticketing !== true || event.trashedAtIso) {
        continue;
      }
      const adminIds = new Set([
        event.creatorUserId,
        ...event.adminIds ?? []
      ].map((id) => id.trim()).filter(Boolean));
      const issuedAtIso = this.seedIssuedAtIso(event);
      for (const holderUserId of [...new Set((event.acceptedMemberUserIds ?? []).map((id) => id.trim()).filter(Boolean))]) {
        if (adminIds.has(holderUserId)) {
          continue;
        }
        const idToken = AssetTicketBuilder.createDemoScanCode(`seed:${event.id}`, holderUserId).slice("DEMO-".length);
        const id = `seed-ticket-${idToken}`;
        byId[id] = {
          id,
          code: AssetTicketBuilder.createDemoScanCode(id, holderUserId),
          eventId: event.id,
          holderUserId,
          status: "A",
          issuedAtIso,
          usedAtIso: null,
          usedByUserId: null
        };
        ids.push(id);
      }
    }
    return { byId, ids };
  }
  static seedIssuedAtIso(event) {
    const startAtMs = new Date(event.startAtIso).getTime();
    return Number.isFinite(startAtMs) ? new Date(startAtMs - 24 * 60 * 60 * 1e3).toISOString() : (/* @__PURE__ */ new Date(0)).toISOString();
  }
};

// src/app/shared/core/local/seed/builders/pricing-seed.builder.ts
var SeedPricingBuilder = class {
  static createDefaultPricingConfig(context = "event") {
    return {
      enabled: context === "asset",
      mode: "fixed",
      basePrice: context === "asset" ? 10 : 0,
      currency: "USD",
      taxMode: "excluded",
      chargeType: context === "asset" ? "per_booking" : "per_attendee",
      quantityRulesEnabled: false,
      quantityRules: [],
      minPrice: null,
      maxPrice: null,
      rounding: "none",
      demandRulesEnabled: false,
      demandRules: [],
      timeRulesEnabled: false,
      timeRules: [],
      cancellationPolicy: {
        enabled: false,
        rules: []
      },
      slotPricingEnabled: false,
      slotOverrides: [],
      audience: {
        enabled: false,
        memberPrice: null,
        vipPrice: null,
        inviteOnlyDiscountPercent: null,
        promoCodes: [],
        soldOutLabel: 'Show "Sold Out"'
      }
    };
  }
  static createSamplePricingConfig(mode = "hybrid") {
    return {
      enabled: true,
      mode,
      basePrice: 25,
      currency: "USD",
      taxMode: "excluded",
      chargeType: "per_attendee",
      quantityRulesEnabled: false,
      quantityRules: [],
      minPrice: 15,
      maxPrice: 60,
      rounding: "whole",
      demandRulesEnabled: mode === "demand-based" || mode === "hybrid",
      demandRules: [
        {
          id: "demand-rule-1",
          operator: "gte",
          capacityFilledPercent: 50,
          action: {
            kind: "increase_percent",
            value: 10
          },
          appliesTo: "all_slots",
          slotIds: []
        }
      ],
      timeRulesEnabled: mode === "time-based" || mode === "hybrid",
      timeRules: [
        {
          id: "time-rule-1",
          trigger: "days_before_start",
          offsetValue: 7,
          specificDateStart: null,
          specificDateEnd: null,
          action: {
            kind: "decrease_percent",
            value: 5
          },
          appliesTo: "all_slots",
          slotIds: []
        }
      ],
      cancellationPolicy: {
        enabled: true,
        rules: [
          {
            id: "cancellation-rule-1",
            offsetUnit: "days",
            offsetValue: 7,
            refundKind: "percent",
            refundValue: 50
          },
          {
            id: "cancellation-rule-2",
            offsetUnit: "hours",
            offsetValue: 24,
            refundKind: "none",
            refundValue: null
          }
        ]
      },
      slotPricingEnabled: false,
      slotOverrides: [],
      audience: {
        enabled: false,
        memberPrice: 20,
        vipPrice: 15,
        inviteOnlyDiscountPercent: 25,
        promoCodes: [
          {
            id: "promo-code-1",
            code: "EARLY",
            action: {
              kind: "decrease_percent",
              value: 10
            }
          }
        ],
        soldOutLabel: 'Show "Sold Out"'
      }
    };
  }
  static clonePricingConfig(pricing) {
    const normalized = pricing ?? this.createDefaultPricingConfig();
    return __spreadProps(__spreadValues({}, normalized), {
      quantityRules: (normalized.quantityRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), {
        action: __spreadValues({}, rule.action)
      })),
      demandRules: (normalized.demandRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), {
        action: __spreadValues({}, rule.action),
        slotIds: [...rule.slotIds ?? []]
      })),
      timeRules: (normalized.timeRules ?? []).map((rule) => __spreadProps(__spreadValues({}, rule), {
        action: __spreadValues({}, rule.action),
        slotIds: [...rule.slotIds ?? []]
      })),
      cancellationPolicy: {
        enabled: normalized.cancellationPolicy?.enabled === true,
        rules: (normalized.cancellationPolicy?.rules ?? []).map((rule) => __spreadValues({}, rule))
      },
      slotOverrides: (normalized.slotOverrides ?? []).map((item) => __spreadValues({}, item)),
      audience: __spreadProps(__spreadValues({}, normalized.audience), {
        promoCodes: (normalized.audience?.promoCodes ?? []).map((code) => __spreadProps(__spreadValues({}, code), {
          action: __spreadValues({}, code.action)
        }))
      })
    });
  }
};

// src/app/shared/core/local/seed/builders/events-seed.builder.ts
var DEMO_EVENT_MEMBER_USERS = SeedUserBuilder.buildExpandedDemoUsers(50);
function buildCheckoutDemoPolicies() {
  return [
    {
      id: "policy-checkin-window",
      title: "Check-in window",
      description: "Arrive within the first 15 minutes of the selected slot so the organizer can release late spots.",
      required: true
    },
    {
      id: "policy-cancellation",
      title: "Cancellation",
      description: "Paid extras are refundable only until 24 hours before the selected slot starts.",
      required: true
    },
    {
      id: "policy-media",
      title: "Photos & recap",
      description: "A private recap may be shared with attendees after the event.",
      required: false
    }
  ];
}
function buildCheckoutDemoPricing(basePrice, slotTemplates = []) {
  const pricing = SeedPricingBuilder.createSamplePricingConfig(slotTemplates.length > 0 ? "hybrid" : "fixed");
  pricing.enabled = true;
  pricing.basePrice = basePrice;
  pricing.minPrice = Math.max(0, basePrice - 12);
  pricing.maxPrice = basePrice + 48;
  pricing.currency = "USD";
  pricing.chargeType = "per_attendee";
  pricing.audience.enabled = false;
  pricing.audience.promoCodes = [];
  if (slotTemplates.length > 0) {
    pricing.slotPricingEnabled = true;
    pricing.slotOverrides = slotTemplates.map((slot, index) => ({
      id: `${slot.id}-override`,
      slotId: slot.id,
      label: `Slot ${index + 1}`,
      startAt: slot.startAt,
      endAt: null,
      price: basePrice + index * 6,
      currency: "USD"
    }));
  } else {
    pricing.slotPricingEnabled = false;
    pricing.slotOverrides = [];
  }
  return pricing;
}
var URBAN_PHOTO_SPRINT_PROMO_CODES = [
  "VIPPHOTO20",
  "VIPSPRINT5",
  "LUCAGUEST10"
];
function buildUrbanPhotoSprintPricing() {
  const pricing = buildCheckoutDemoPricing(25);
  pricing.audience.enabled = true;
  pricing.audience.vipPrice = 18;
  pricing.audience.promoCodes = [
    {
      id: "urban-photo-vip-percent",
      code: URBAN_PHOTO_SPRINT_PROMO_CODES[0],
      action: {
        kind: "decrease_percent",
        value: 20
      }
    },
    {
      id: "urban-photo-vip-fixed",
      code: URBAN_PHOTO_SPRINT_PROMO_CODES[1],
      action: {
        kind: "decrease_amount",
        value: 5
      }
    },
    {
      id: "urban-photo-guest-percent",
      code: URBAN_PHOTO_SPRINT_PROMO_CODES[2],
      action: {
        kind: "decrease_percent",
        value: 10
      }
    }
  ];
  return pricing;
}
function buildCheckoutDemoSubEventPricing(basePrice, enabled, chargeType = "per_attendee") {
  const pricing = SeedPricingBuilder.createDefaultPricingConfig("subevent");
  pricing.enabled = enabled;
  pricing.basePrice = enabled ? basePrice : 0;
  pricing.currency = "USD";
  pricing.chargeType = chargeType;
  pricing.minPrice = enabled ? Math.max(0, basePrice - 4) : 0;
  pricing.maxPrice = enabled ? basePrice + 8 : 0;
  return pricing;
}
function buildCheckoutDemoSubEventDefinitions(options) {
  const includedPricing = SeedPricingBuilder.createDefaultPricingConfig("subevent");
  const paidAddOnPricing = buildCheckoutDemoSubEventPricing(16, options.includePaidOptional, "per_booking");
  const transportPricing = buildCheckoutDemoSubEventPricing(8, options.includePaidOptional);
  return [
    {
      id: `${options.sourceId}-main-session`,
      name: "Main Session",
      description: "Included in the base event price and aligned to the selected slot.",
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: 75,
      optional: false,
      capacityMin: 0,
      capacityMax: 24,
      pricing: includedPricing
    },
    {
      id: `${options.sourceId}-vip-lounge`,
      name: options.includePaidOptional ? "VIP Lounge Access" : "Community Lounge Access",
      description: options.includePaidOptional ? "Optional add-on with a separate basket line and accommodation request support." : "Optional free add-on for the slot-based join flow.",
      timing: "During",
      offsetMinutes: 20,
      durationMinutes: 45,
      optional: true,
      capacityMin: 0,
      capacityMax: 10,
      pricing: paidAddOnPricing
    },
    {
      id: `${options.sourceId}-transport-pickup`,
      name: "Transport Pickup",
      description: "Optional transport-style add-on so checkout can show an asset request path too.",
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: 20,
      optional: true,
      capacityMin: 0,
      capacityMax: 12,
      pricing: transportPricing
    }
  ];
}
function buildSunsetBeachVolleySubEventDefinitions() {
  const includedPricing = SeedPricingBuilder.createDefaultPricingConfig("subevent");
  return [
    {
      id: "sunset-beach-volley-main-session",
      name: "Main Session",
      description: "Included beach volley rotation rounds for the selected Sunday slot.",
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: 120,
      optional: false,
      capacityMin: 0,
      capacityMax: 3,
      pricing: includedPricing,
      icon: "sports_volleyball"
    },
    {
      id: "sunset-beach-volley-side-activity",
      name: "Side Activity",
      description: "Casual teams, rotation rounds, and post-game snacks.",
      timing: "After",
      offsetMinutes: 0,
      durationMinutes: 30,
      optional: true,
      capacityMin: 0,
      capacityMax: 8,
      pricing: buildCheckoutDemoSubEventPricing(9, true),
      icon: "local_activity"
    }
  ];
}
function buildTournamentDemoStageDefinition(options) {
  const capacityMin = options.groups.reduce((total, group) => total + Math.max(0, Number(group.min) || 0), 0);
  const capacityMax = options.groups.reduce((total, group) => total + Math.max(0, Number(group.max) || 0), 0);
  const groupCapacityMin = Math.max(0, ...options.groups.map((group) => Number(group.min) || 0));
  const groupCapacityMax = Math.max(groupCapacityMin, ...options.groups.map((group) => Number(group.max) || 0));
  return {
    id: `${options.sourceId}-stage-${options.index + 1}`,
    name: options.name,
    description: options.description,
    timing: options.timing,
    offsetMinutes: options.offsetMinutes,
    durationMinutes: options.durationMinutes,
    location: "Seattle \xB7 Demo Court",
    tournamentGroupCapacityMin: groupCapacityMin,
    tournamentGroupCapacityMax: groupCapacityMax,
    tournamentLeaderboardType: options.leaderboardType,
    tournamentAdvancePerGroup: options.advancePerGroup,
    optional: false,
    capacityMin,
    capacityMax,
    icon: "emoji_events"
  };
}
function buildActiveTournamentDemoSubEventDefinitions(sourceId, timingPreset = "default") {
  const timings = (() => {
    switch (timingPreset) {
      case "stage-one-active":
        return { qualifierMinutes: 90, semifinalOffsetMinutes: 10, semifinalMinutes: 60, finalOffsetMinutes: 10, finalMinutes: 45 };
      case "stage-two-active":
        return { qualifierMinutes: 10, semifinalOffsetMinutes: 5, semifinalMinutes: 75, finalOffsetMinutes: 10, finalMinutes: 45 };
      default:
        return { qualifierMinutes: 50, semifinalOffsetMinutes: 10, semifinalMinutes: 60, finalOffsetMinutes: 10, finalMinutes: 45 };
    }
  })();
  return [
    buildTournamentDemoStageDefinition({
      sourceId,
      index: 0,
      name: "Qualifiers",
      description: "Two balanced groups collect opening-round scores for the slot.",
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: timings.qualifierMinutes,
      groups: [
        { name: "Group A", min: 2, max: 4 },
        { name: "Group B", min: 2, max: 4 }
      ],
      leaderboardType: "Score",
      advancePerGroup: 2
    }),
    buildTournamentDemoStageDefinition({
      sourceId,
      index: 1,
      name: "Semifinals",
      description: "Advancing players split into two shorter knockout groups.",
      timing: "After",
      offsetMinutes: timings.semifinalOffsetMinutes,
      durationMinutes: timings.semifinalMinutes,
      groups: [
        { name: "Court 1", min: 2, max: 3 },
        { name: "Court 2", min: 2, max: 3 }
      ],
      leaderboardType: "Fifa",
      advancePerGroup: 1
    }),
    buildTournamentDemoStageDefinition({
      sourceId,
      index: 2,
      name: "Final",
      description: "The top players finish the slot with a compact final stage.",
      timing: "After",
      offsetMinutes: timings.finalOffsetMinutes,
      durationMinutes: timings.finalMinutes,
      groups: [
        { name: "Final Table", min: 2, max: 4 }
      ],
      leaderboardType: "Score",
      advancePerGroup: 0
    })
  ];
}
var SEED_INVITATIONS_BY_USER = {
  u1: [
    {
      id: "i1",
      avatar: "LP",
      inviter: "Lina",
      description: "Jazz Rooftop Session",
      when: "Sat Feb 21, 8:00 PM",
      unread: 1,
      acceptedMemberUserIds: ["u5", "u18", "u19"],
      pendingMemberUserIds: ["u1", "u20"],
      capacityTotal: 6,
      startAt: "2026-03-10T20:00:00",
      endAt: "2026-03-10T22:00:00"
    },
    {
      id: "i2",
      avatar: "NH",
      inviter: "Noah",
      description: "Open Padel Pairs",
      when: "Sun Feb 22, 3:00 PM",
      unread: 1,
      acceptedMemberUserIds: ["u7", "u21", "u22"],
      pendingMemberUserIds: ["u1", "u23"],
      capacityTotal: 6,
      startAt: "2026-03-11T15:00:00",
      endAt: "2026-03-11T17:30:00"
    },
    {
      id: "i3",
      avatar: "SY",
      inviter: "System",
      description: "Chat: Last-minute Ski Transfer",
      when: "Sat Feb 21, 9:15 AM",
      unread: 2,
      acceptedMemberUserIds: ["u11", "u24"],
      pendingMemberUserIds: ["u1", "u25"],
      capacityTotal: 5,
      startAt: "2026-03-12T09:15:00",
      endAt: "2026-03-12T11:15:00"
    }
  ],
  u2: [{
    id: "i4",
    avatar: "MS",
    inviter: "Maya",
    description: "Foodie Crawl Team",
    when: "Sun Feb 22, 6:30 PM",
    unread: 1,
    acceptedMemberUserIds: ["u4", "u26", "u27"],
    pendingMemberUserIds: ["u2", "u28"],
    capacityTotal: 6,
    startAt: "2026-03-13T18:30:00",
    endAt: "2026-03-13T21:00:00"
  }],
  u3: [{
    id: "i5",
    avatar: "LH",
    inviter: "Luca",
    description: "Urban Photo Sprint",
    when: "Mon Feb 23, 6:00 PM",
    unread: 1,
    acceptedMemberUserIds: ["u10", "u29", "u30"],
    pendingMemberUserIds: ["u3", "u31"],
    capacityTotal: 6,
    startAt: "2026-03-14T18:00:00",
    endAt: "2026-03-14T20:00:00",
    pricing: buildUrbanPhotoSprintPricing()
  }]
};
var SEED_EVENTS_BY_USER = {
  u1: [
    {
      id: "e1",
      avatar: "SY",
      title: "Alpine Cabin Supper",
      shortDescription: "A small ski group winds down over soup while wet gloves and boots dry by the stove.",
      timeframe: "Feb 27 - Mar 1",
      activity: 4,
      isAdmin: true
    },
    {
      id: "e2",
      avatar: "SY",
      title: "Urban Photo Marathon",
      shortDescription: "Creative city walk with checkpoints and mini challenges.",
      timeframe: "Mar 8 \xB7 10:00 AM - 7:00 PM",
      activity: 1,
      isAdmin: false,
      creatorUserId: "u10",
      acceptedMemberUserIds: ["u10", "u14", "u15"],
      pendingMemberUserIds: ["u1", "u16"]
    },
    {
      id: "e3",
      avatar: "SY",
      title: "Night Food League",
      shortDescription: "Three-spot tasting route with ranking and vibe voting.",
      timeframe: "Mar 12 \xB7 7:30 PM - 11:30 PM",
      activity: 3,
      isAdmin: false,
      creatorUserId: "u3",
      startAt: "2026-02-21T19:30:00",
      endAt: "2026-02-21T23:30:00"
    },
    {
      id: "e6",
      avatar: "SY",
      title: "Sunset Beach Volley",
      shortDescription: "Casual teams, rotation rounds, and post-game snacks.",
      timeframe: "Every Sun \xB7 5:00 PM - 8:30 PM",
      activity: 2,
      isAdmin: false,
      creatorUserId: "u4",
      startAt: "2026-02-22T17:00:00",
      endAt: "2026-05-17T20:30:00",
      frequency: "Weekly",
      ticketing: true,
      slotsEnabled: true,
      slotTemplates: [
        {
          id: "sunset-beach-volley-sunday-evening",
          startAt: "2026-02-22T17:00:00"
        }
      ],
      pricing: buildCheckoutDemoPricing(24, [
        {
          id: "sunset-beach-volley-sunday-evening",
          startAt: "2026-02-22T17:00:00"
        }
      ]),
      policiesEnabled: true,
      policies: buildCheckoutDemoPolicies(),
      subEventDefinitions: buildSunsetBeachVolleySubEventDefinitions()
    },
    {
      id: "e7",
      avatar: "SY",
      title: "Coffee and Book Swap",
      shortDescription: "Readers trade wrapped recommendations and open them over coffee in a small circle.",
      timeframe: "Mar 16 \xB7 9:30 AM - 11:30 AM",
      activity: 1,
      isAdmin: true,
      startAt: "2026-02-26T09:30:00",
      endAt: "2026-02-26T11:30:00"
    },
    {
      id: "e8",
      avatar: "SY",
      title: "Lakeside Walk Lab",
      shortDescription: "Guided walk with paired mini-conversations.",
      timeframe: "Feb 27 \xB7 11:15 AM - 1:00 PM",
      activity: 2,
      isAdmin: false,
      creatorUserId: "u12",
      startAt: "2026-02-25T11:15:00",
      endAt: "2026-02-25T13:00:00"
    },
    {
      id: "e9",
      avatar: "SY",
      title: "Brunch Rotation",
      shortDescription: "Table rotations every 20 minutes for fresh intros.",
      timeframe: "Feb 27 \xB7 1:30 PM - 3:30 PM",
      activity: 3,
      isAdmin: false,
      creatorUserId: "u2",
      startAt: "2026-02-27T13:30:00",
      endAt: "2026-02-27T15:30:00"
    },
    {
      id: "e10",
      avatar: "SY",
      title: "Golden Hour Meetup",
      shortDescription: "Sunset meetup with check-in games and soft networking.",
      timeframe: "Mar 14 \xB7 6:15 PM - 8:45 PM",
      activity: 2,
      isAdmin: true
    },
    {
      id: "e11",
      avatar: "SY",
      title: "Cross-Month Community Relay",
      shortDescription: "Long-format challenge with rotating teams across multiple weekends.",
      timeframe: "Mar 28 - May 6",
      activity: 5,
      isAdmin: true
    },
    {
      id: "e12",
      avatar: "SY",
      title: "Spring Cohort Journey",
      shortDescription: "Multi-stage mentorship/event arc with check-ins and shared tasks.",
      timeframe: "Apr 26 - Jun 2",
      activity: 4,
      isAdmin: false,
      creatorUserId: "u6"
    }
  ],
  u2: [
    {
      id: "e4",
      avatar: "SY",
      title: "Sunrise Run + Brunch",
      shortDescription: "Easy pace run and social brunch with optional pair mode.",
      timeframe: "Feb 28 \xB7 8:00 AM - 12:00 PM",
      activity: 2,
      isAdmin: false,
      creatorUserId: "u13",
      startAt: "2026-02-24T08:00:00",
      endAt: "2026-02-24T12:00:00"
    },
    {
      id: "e13",
      avatar: "SY",
      title: "Afterwork Tasting Circle",
      shortDescription: "Host review pending while the guest list settles for tonight.",
      timeframe: "Mar 11 \xB7 6:30 PM - 9:30 PM",
      activity: 2,
      isAdmin: false,
      creatorUserId: "u8",
      acceptedMemberUserIds: ["u8", "u35", "u36"],
      pendingMemberUserIds: ["u2", "u37"]
    },
    {
      id: "waitlist-full-policy",
      avatar: "SY",
      title: "Full House Supper Club",
      shortDescription: "A small paid table that is already full, useful for trying the wait-list flow.",
      timeframe: "Apr 18 \xB7 7:00 PM - 10:00 PM",
      activity: 4,
      isAdmin: true,
      creatorUserId: "u2",
      startAt: "2026-04-18T19:00:00",
      endAt: "2026-04-18T22:00:00",
      frequency: "One-time",
      ticketing: true,
      visibility: "Public",
      blindMode: "Open Event",
      location: "Austin \xB7 Supper Club Kitchen",
      capacityMin: 4,
      capacityMax: 4,
      capacityTotal: 4,
      acceptedMemberUserIds: ["u2", "u20", "u21", "u22"],
      pendingMemberUserIds: [],
      pricing: buildCheckoutDemoPricing(32),
      policiesEnabled: true,
      policies: buildCheckoutDemoPolicies(),
      topics: ["Food", "Small Group", "Waitlist"],
      rating: 9.4,
      boost: 100
    },
    {
      id: "checkout-paid-slots",
      avatar: "SY",
      title: "Checkout Demo \xB7 Paid Multi-Slot",
      shortDescription: "Choose a slot, approve policies, add optional paid extras, and continue to dummy pay.",
      timeframe: "Apr 12 \xB7 multiple slots",
      activity: 3,
      isAdmin: false,
      creatorUserId: "u2",
      startAt: "2026-04-12T18:00:00",
      endAt: "2026-06-14T23:00:00",
      frequency: "Weekly",
      ticketing: true,
      visibility: "Public",
      blindMode: "Open Event",
      location: "Austin \xB7 Checkout Demo Hall",
      capacityMin: 6,
      capacityMax: 18,
      acceptedMemberUserIds: ["u40", "u41"],
      pendingMemberUserIds: ["u42"],
      slotsEnabled: true,
      slotTemplates: [
        {
          id: "checkout-paid-slots-slot-1",
          startAt: "2026-04-12T18:30:00"
        },
        {
          id: "checkout-paid-slots-slot-2",
          startAt: "2026-04-12T20:15:00"
        }
      ],
      pricing: buildCheckoutDemoPricing(38, [
        {
          id: "checkout-paid-slots-slot-1",
          startAt: "2026-04-12T18:30:00"
        },
        {
          id: "checkout-paid-slots-slot-2",
          startAt: "2026-04-12T20:15:00"
        }
      ]),
      policiesEnabled: true,
      policies: buildCheckoutDemoPolicies(),
      subEventDefinitions: buildCheckoutDemoSubEventDefinitions({
        sourceId: "checkout-paid-slots",
        includePaidOptional: true
      }),
      rating: 9.2,
      boost: 99
    }
  ],
  u3: [
    {
      id: "asset-join-demo-nagy-eszter",
      avatar: "NE",
      title: "Asset Join Demo \xB7 Shuttle Seat",
      shortDescription: "Accepted event with a transport assignment that Nagy Eszter can join directly.",
      timeframe: "Jul 18 \xB7 5:30 PM - 8:30 PM",
      activity: 1,
      status: "A",
      isAdmin: false,
      creatorUserId: "u11",
      startAt: "2026-07-18T17:30:00",
      endAt: "2026-07-18T20:30:00",
      generated: true,
      frequency: "One-time",
      ticketing: false,
      visibility: "Public",
      blindMode: "Open Event",
      location: "Seattle \xB7 Demo Pickup Point",
      capacityMin: 2,
      capacityMax: 12,
      acceptedMemberUserIds: ["u3", "u11"],
      pendingMemberUserIds: [],
      subEventsEnabled: true,
      subEventDefinitions: buildCheckoutDemoSubEventDefinitions({
        sourceId: "asset-join-demo-nagy-eszter",
        includePaidOptional: false
      }),
      topics: ["Demo", "Transport", "Asset Join"],
      rating: 9,
      boost: 100
    },
    {
      id: "e5",
      avatar: "SY",
      title: "Wheel-Thrown Pottery Lab",
      shortDescription: "Beginners center clay and compare forms at a row of working wheels.",
      timeframe: "Mar 3 \xB7 6:00 PM - 10:00 PM",
      activity: 2,
      isAdmin: false,
      creatorUserId: "u11",
      startAt: "2026-02-25T18:00:00",
      endAt: "2026-02-25T22:00:00"
    },
    {
      id: "e14",
      avatar: "SY",
      title: "Moonlight Boardwalk Mixer",
      shortDescription: "Approval queue is still open while the organizer finalizes the pair rotations.",
      timeframe: "Mar 13 \xB7 7:15 PM - 10:15 PM",
      activity: 2,
      isAdmin: false,
      creatorUserId: "u7",
      acceptedMemberUserIds: ["u7", "u38", "u39"],
      pendingMemberUserIds: ["u3"]
    },
    {
      id: "waitlist-full-free",
      avatar: "SY",
      title: "Tiny Vinyl Listening Room",
      shortDescription: "Free four-seat listening session with no open spots, seeded for wait-list testing.",
      timeframe: "Apr 19 \xB7 8:00 PM - 10:00 PM",
      activity: 3,
      isAdmin: true,
      creatorUserId: "u3",
      startAt: "2026-04-19T20:00:00",
      endAt: "2026-04-19T22:00:00",
      frequency: "One-time",
      ticketing: false,
      visibility: "Public",
      blindMode: "Open Event",
      location: "Austin \xB7 Eastside Listening Room",
      capacityMin: 4,
      capacityMax: 4,
      capacityTotal: 4,
      acceptedMemberUserIds: ["u3", "u23", "u24", "u25"],
      pendingMemberUserIds: [],
      policiesEnabled: true,
      policies: buildCheckoutDemoPolicies(),
      topics: ["Music", "Culture", "Waitlist"],
      rating: 9,
      boost: 99
    },
    {
      id: "checkout-paid-policy",
      avatar: "SY",
      title: "Checkout Demo \xB7 Paid One-Slot Policy",
      shortDescription: "Paid one-slot join flow, so you can test policies and add-ons with checkout.",
      timeframe: "Apr 13 \xB7 7:00 PM - 10:00 PM",
      activity: 2,
      isAdmin: false,
      creatorUserId: "u3",
      startAt: "2026-04-13T19:00:00",
      endAt: "2026-04-13T22:00:00",
      frequency: "One-time",
      ticketing: true,
      visibility: "Public",
      blindMode: "Open Event",
      location: "Austin \xB7 Policy Demo Studio",
      capacityMin: 4,
      capacityMax: 16,
      acceptedMemberUserIds: ["u43", "u44"],
      pendingMemberUserIds: ["u45"],
      slotsEnabled: true,
      slotTemplates: [
        {
          id: "checkout-paid-policy-slot-1",
          startAt: "2026-04-13T19:00:00"
        }
      ],
      pricing: buildCheckoutDemoPricing(22, [
        {
          id: "checkout-paid-policy-slot-1",
          startAt: "2026-04-13T19:00:00"
        }
      ]),
      policiesEnabled: true,
      policies: buildCheckoutDemoPolicies(),
      subEventDefinitions: buildCheckoutDemoSubEventDefinitions({
        sourceId: "checkout-paid-policy",
        includePaidOptional: true
      }),
      rating: 9.1,
      boost: 98
    },
    {
      id: "checkout-free-slots",
      avatar: "SY",
      title: "Checkout Demo \xB7 Free Multi-Slot",
      shortDescription: "Free recurring event with multiple slots, so you can test slot-only join without payment.",
      timeframe: "Apr 14 \xB7 multiple slots",
      activity: 2,
      isAdmin: false,
      creatorUserId: "u3",
      startAt: "2026-04-14T12:30:00",
      endAt: "2026-05-26T18:00:00",
      frequency: "Weekly",
      ticketing: false,
      visibility: "Public",
      blindMode: "Open Event",
      location: "Austin \xB7 Slot Demo Yard",
      capacityMin: 6,
      capacityMax: 20,
      acceptedMemberUserIds: ["u46", "u47"],
      pendingMemberUserIds: ["u48"],
      slotsEnabled: true,
      slotTemplates: [
        {
          id: "checkout-free-slots-slot-1",
          startAt: "2026-04-14T13:00:00"
        },
        {
          id: "checkout-free-slots-slot-2",
          startAt: "2026-04-14T15:00:00"
        }
      ],
      pricing: SeedPricingBuilder.createDefaultPricingConfig("event"),
      subEventDefinitions: buildCheckoutDemoSubEventDefinitions({
        sourceId: "checkout-free-slots",
        includePaidOptional: false
      }),
      rating: 8.9,
      boost: 97
    },
    {
      id: "active-tournament-slots",
      avatar: "NE",
      title: "Tournament Demo \xB7 Active Slot Cup",
      shortDescription: "Published tournament seed with two playable slots and three staged rounds.",
      timeframe: "Feb 20 \xB7 multiple slots",
      activity: 5,
      status: "A",
      isAdmin: true,
      creatorUserId: "u3",
      startAt: "2026-02-18T04:00:00",
      endAt: "2026-02-18T08:30:00",
      frequency: "One-time",
      ticketing: false,
      visibility: "Public",
      blindMode: "Open Event",
      location: "Seattle \xB7 Tournament Demo Court",
      capacityMin: 4,
      capacityMax: 16,
      capacityTotal: 16,
      acceptedMemberUserIds: ["u3", "u5", "u18", "u19", "u20", "u21", "u22", "u23"],
      pendingMemberUserIds: ["u24", "u25"],
      slotsEnabled: true,
      slotTemplates: [
        {
          id: "active-tournament-slots-evening",
          startAt: "2026-02-18T04:30:00",
          subEventDefinitions: buildActiveTournamentDemoSubEventDefinitions("active-tournament-slots-evening", "stage-one-active")
        },
        {
          id: "active-tournament-slots-late",
          startAt: "2026-02-18T05:00:00",
          subEventDefinitions: buildActiveTournamentDemoSubEventDefinitions("active-tournament-slots-late", "stage-two-active")
        }
      ],
      pricing: SeedPricingBuilder.createDefaultPricingConfig("event"),
      subEventsEnabled: true,
      subEventDefinitions: buildActiveTournamentDemoSubEventDefinitions("active-tournament-slots"),
      mode: "Tournament",
      topics: ["Tournament", "Games", "Competition"],
      rating: 9.6,
      boost: 100
    }
  ]
};
var SEED_EVENT_FEEDBACK_SHOWCASE_EVENTS_BY_USER = {
  u3: [
    {
      id: "feedback-showcase-nagy-eszter-studio",
      avatar: "NE",
      title: "Feedback Demo \xB7 Studio Recap",
      shortDescription: "Past creator meetup seeded so event feedback is always available for carousel testing.",
      timeframe: "Feedback demo",
      activity: 2,
      isAdmin: false,
      creatorUserId: "u11",
      startAt: "2026-01-12T18:00:00",
      endAt: "2026-01-12T21:00:00",
      generated: true,
      visibility: "Public",
      blindMode: "Open Event",
      location: "Seattle \xB7 Demo Studio",
      acceptedMemberUserIds: ["u3", "u4", "u5"],
      pendingMemberUserIds: [],
      topics: ["Feedback", "Creative", "Demo"]
    },
    {
      id: "feedback-showcase-nagy-eszter-social",
      avatar: "NE",
      title: "Feedback Demo \xB7 Social Lab",
      shortDescription: "Second past event for checking multi-card event feedback carousel behavior.",
      timeframe: "Feedback demo",
      activity: 2,
      isAdmin: false,
      creatorUserId: "u7",
      startAt: "2026-01-13T19:00:00",
      endAt: "2026-01-13T22:00:00",
      generated: true,
      visibility: "Public",
      blindMode: "Open Event",
      location: "Seattle \xB7 Demo Lounge",
      acceptedMemberUserIds: ["u3", "u1", "u2"],
      pendingMemberUserIds: [],
      topics: ["Feedback", "Social", "Demo"]
    }
  ]
};
var SEED_HOSTING_BY_USER = {
  u1: [
    {
      id: "h1",
      avatar: "FA",
      title: "Weekly Padel League",
      shortDescription: "Own recurring event with two sub-events and tournament mode.",
      timeframe: "Every Fri \xB7 6:00 PM",
      activity: 3
    },
    {
      id: "h2",
      avatar: "FA",
      title: "Spring City Festival Crew",
      shortDescription: "Own hosted event, pending join requests and role assignments.",
      timeframe: "Apr 4 \xB7 4:00 PM - 11:00 PM",
      activity: 2
    }
  ],
  u2: [
    {
      id: "h3",
      avatar: "KB",
      title: "Sunday Bike Social",
      shortDescription: "Own hosted route event with optional accessories list.",
      timeframe: "Every Sun \xB7 9:30 AM",
      activity: 1
    }
  ],
  u3: [
    {
      id: "h4",
      avatar: "NE",
      title: "Creative Nights Series",
      shortDescription: "Own hosted monthly event, open applications pending.",
      timeframe: "Monthly \xB7 First Thu",
      activity: 1
    }
  ]
};
var SEED_STATUS_BY_ID = {
  e1: "A",
  e4: "A",
  e5: "A",
  e7: "DR",
  e10: "A",
  e11: "DR",
  h1: "A",
  h2: "A",
  h3: "DR",
  h4: "DR"
};
var SEED_EXPLORE_REBALANCE_BY_OWNER_USER = {
  u1: ["e2", "e3", "e6", "e8"]
};
var SeedEventsBuilder = class _SeedEventsBuilder {
  static SLOT_READ_MODEL_USER_ID = "__slot_read_model__";
  static buildSeedInvitationItemsByUser() {
    return Object.fromEntries(Object.entries(SEED_INVITATIONS_BY_USER).map(([userId, items]) => [userId, items.map((item) => {
      const demo = demoEventPlaceholder(`demo-event-invitations:${userId}:${item.id}`);
      return __spreadProps(__spreadValues({}, item), {
        description: demo.title,
        shortDescription: demo.subtitle,
        imageUrl: demo.imageUrl,
        location: demo.location,
        topics: [...demo.topics],
        pricing: item.pricing ? SeedPricingBuilder.clonePricingConfig(item.pricing) : item.pricing,
        acceptedMemberUserIds: item.acceptedMemberUserIds ? [...item.acceptedMemberUserIds] : item.acceptedMemberUserIds,
        pendingMemberUserIds: item.pendingMemberUserIds ? [...item.pendingMemberUserIds] : item.pendingMemberUserIds,
        policiesEnabled: item.policiesEnabled === true,
        policies: item.policies ? item.policies.map((policy) => __spreadValues({}, policy)) : item.policies
      });
    })]));
  }
  static buildSeedEventItemsByUser() {
    const seeded = Object.fromEntries(Object.entries(this.mergeSeedEventItemGroups(SEED_EVENTS_BY_USER, SEED_EVENT_FEEDBACK_SHOWCASE_EVENTS_BY_USER)).map(([userId, items]) => [
      userId,
      items.map((item) => __spreadProps(__spreadValues({}, item), {
        pricing: item.pricing ? SeedPricingBuilder.clonePricingConfig(item.pricing) : item.pricing,
        policiesEnabled: item.policiesEnabled === true,
        policies: item.policies ? item.policies.map((policy) => __spreadValues({}, policy)) : item.policies,
        slotTemplates: this.cloneSlotTemplates(item.slotTemplates) ?? item.slotTemplates,
        subEventsEnabled: item.subEventsEnabled,
        subEventDefinitions: this.cloneSubEventDefinitions(item.subEventDefinitions) ?? item.subEventDefinitions,
        topics: item.topics ? [...item.topics] : item.topics,
        acceptedMemberUserIds: item.acceptedMemberUserIds ? [...item.acceptedMemberUserIds] : item.acceptedMemberUserIds,
        pendingMemberUserIds: item.pendingMemberUserIds ? [...item.pendingMemberUserIds] : item.pendingMemberUserIds
      }))
    ]));
    this.rebalanceSeedExploreItems(seeded);
    for (const [userId, items] of Object.entries(seeded)) {
      seeded[userId] = items.map((item) => {
        const demo = demoEventPlaceholder(`demo-event-events:${userId}:${item.id}`);
        return __spreadProps(__spreadValues({}, item), {
          title: demo.title,
          shortDescription: demo.subtitle,
          imageUrl: demo.imageUrl,
          location: demo.location,
          topics: [...demo.topics]
        });
      });
    }
    return seeded;
  }
  static mergeSeedEventItemGroups(...groups) {
    const merged = {};
    for (const group of groups) {
      for (const [userId, items] of Object.entries(group)) {
        merged[userId] = [...merged[userId] ?? [], ...items];
      }
    }
    return merged;
  }
  static rebalanceSeedExploreItems(seedItemsByUser) {
    for (const [ownerUserId, eventIds] of Object.entries(SEED_EXPLORE_REBALANCE_BY_OWNER_USER)) {
      const ownerItems = seedItemsByUser[ownerUserId];
      if (!ownerItems || ownerItems.length === 0) {
        continue;
      }
      const movedEventIds = new Set(eventIds);
      const itemsToMove = ownerItems.filter((item) => movedEventIds.has(item.id));
      if (itemsToMove.length === 0) {
        continue;
      }
      seedItemsByUser[ownerUserId] = ownerItems.filter((item) => !movedEventIds.has(item.id));
      for (const item of itemsToMove) {
        const creatorUserId = item.creatorUserId?.trim() || ownerUserId;
        const creatorItems = seedItemsByUser[creatorUserId] ?? [];
        if (creatorItems.some((existing) => existing.id === item.id)) {
          continue;
        }
        creatorItems.push(__spreadProps(__spreadValues({}, item), {
          isAdmin: creatorUserId === ownerUserId ? item.isAdmin : true,
          visibility: "Public",
          acceptedMemberUserIds: item.acceptedMemberUserIds ? [...item.acceptedMemberUserIds] : void 0,
          pendingMemberUserIds: item.pendingMemberUserIds ? [...item.pendingMemberUserIds] : void 0,
          subEventsEnabled: item.subEventsEnabled,
          subEventDefinitions: this.cloneSubEventDefinitions(item.subEventDefinitions) ?? item.subEventDefinitions,
          topics: item.topics ? [...item.topics] : item.topics
        }));
        seedItemsByUser[creatorUserId] = creatorItems;
      }
    }
  }
  static buildSeedHostingItemsByUser() {
    return Object.fromEntries(Object.entries(SEED_HOSTING_BY_USER).map(([userId, items]) => [
      userId,
      items.map((item) => {
        const demo = demoEventPlaceholder(`demo-event-hosting:${userId}:${item.id}`);
        return __spreadProps(__spreadValues({}, item), {
          title: demo.title,
          shortDescription: demo.subtitle,
          imageUrl: demo.imageUrl,
          location: demo.location,
          topics: [...demo.topics],
          pricing: item.pricing ? SeedPricingBuilder.clonePricingConfig(item.pricing) : item.pricing,
          policiesEnabled: item.policiesEnabled === true,
          policies: item.policies ? item.policies.map((policy) => __spreadValues({}, policy)) : item.policies,
          slotTemplates: this.cloneSlotTemplates(item.slotTemplates) ?? item.slotTemplates,
          subEventsEnabled: item.subEventsEnabled,
          subEventDefinitions: this.cloneSubEventDefinitions(item.subEventDefinitions) ?? item.subEventDefinitions,
          acceptedMemberUserIds: item.acceptedMemberUserIds ? [...item.acceptedMemberUserIds] : item.acceptedMemberUserIds,
          pendingMemberUserIds: item.pendingMemberUserIds ? [...item.pendingMemberUserIds] : item.pendingMemberUserIds
        });
      })
    ]));
  }
  static buildSeedStatusById() {
    return __spreadValues({}, SEED_STATUS_BY_ID);
  }
  static buildRecordCollection(options) {
    const byId = {};
    const ids = [];
    const creatorUserIdByEventId = this.buildCreatorUserIdByEventId(options);
    for (const [userId, items] of Object.entries(options.invitationsByUser)) {
      for (const item of items) {
        const recordKey = this.buildRecordKey(userId, "invitations", item.id);
        const creatorUserId = this.resolveInvitationCreatorUserId(item, userId, creatorUserIdByEventId);
        byId[recordKey] = this.buildRecord({
          id: item.id,
          userId,
          type: "invitations",
          avatar: item.avatar,
          title: item.description,
          subtitle: item.shortDescription?.trim() || item.inviter,
          timeframe: item.when,
          inviter: item.inviter,
          unread: item.unread,
          activity: 0,
          trashedAtIso: null,
          creatorUserId,
          adminIds: [creatorUserId],
          seed: this.extractSeedOverrides(item)
        });
        ids.push(recordKey);
      }
    }
    for (const [userId, items] of Object.entries(options.eventsByUser)) {
      for (const item of items) {
        const creatorUserId = creatorUserIdByEventId.get(item.id) ?? userId;
        const recordKey = this.buildRecordKey(userId, "events", item.id);
        byId[recordKey] = this.buildRecord({
          id: item.id,
          userId,
          type: "events",
          avatar: item.avatar,
          title: item.title,
          subtitle: item.shortDescription,
          timeframe: item.timeframe,
          inviter: null,
          unread: 0,
          activity: item.activity,
          status: item.status ?? options.statusById?.[item.id] ?? "A",
          trashedAtIso: null,
          creatorUserId,
          adminIds: this.normalizeUserIds([
            ...item.adminIds ?? [],
            creatorUserId,
            ...item.isAdmin || creatorUserId === userId ? [userId] : []
          ]),
          seed: this.extractSeedOverrides(item)
        });
        ids.push(recordKey);
      }
    }
    for (const [userId, items] of Object.entries(options.hostingByUser)) {
      for (const item of items) {
        const recordKey = this.buildRecordKey(userId, "hosting", item.id);
        byId[recordKey] = this.buildRecord({
          id: item.id,
          userId,
          type: "hosting",
          avatar: item.avatar,
          title: item.title,
          subtitle: item.shortDescription,
          timeframe: item.timeframe,
          inviter: null,
          unread: 0,
          activity: item.activity,
          status: item.status ?? options.statusById?.[item.id] ?? "A",
          trashedAtIso: null,
          creatorUserId: creatorUserIdByEventId.get(item.id) ?? userId,
          adminIds: this.normalizeUserIds([
            ...item.adminIds ?? [],
            creatorUserIdByEventId.get(item.id) ?? userId,
            userId
          ]),
          seed: this.extractSeedOverrides(item)
        });
        ids.push(recordKey);
      }
    }
    this.applyLifecycleDemoStatuses(byId);
    return this.materializeSeedSlotRecords(this.rebalanceVisibleActiveEventParticipation({ byId, ids }));
  }
  static applyLifecycleDemoStatuses(byId) {
    const lifecycleSeeds = [
      { sourceId: "h1", status: "UR", statusBeforeSuppression: "A" },
      { sourceId: "e13", status: "B", statusBeforeSuppression: "A" },
      { sourceId: "e2", status: "D", statusBeforeSuppression: "A" },
      { sourceId: "e14", status: "I", statusBeforeSuppression: "A" }
    ];
    for (const seed of lifecycleSeeds) {
      this.applyLifecycleDemoStatusToSource(byId, seed.sourceId, seed.status, seed.statusBeforeSuppression);
    }
  }
  static applyLifecycleDemoStatusToSource(byId, sourceId, status, statusBeforeSuppression) {
    for (const [recordKey, record] of Object.entries(byId)) {
      if (!record || record.id !== sourceId || record.type === "invitations") {
        continue;
      }
      byId[recordKey] = __spreadProps(__spreadValues({}, record), {
        status,
        statusBeforeSuppression,
        trashedAtIso: null
      });
    }
  }
  static rebalanceVisibleActiveEventParticipation(collection) {
    const recordsByEventId = /* @__PURE__ */ new Map();
    for (const id of collection.ids) {
      const record = collection.byId[id];
      if (!record?.id) {
        continue;
      }
      const records = recordsByEventId.get(record.id) ?? [];
      records.push(record);
      recordsByEventId.set(record.id, records);
    }
    const byId = {};
    const ids = [];
    for (const records of recordsByEventId.values()) {
      const canonical = this.buildCanonicalEventRecord(records);
      const recordKey = this.buildRecordKey(canonical.userId, canonical.type, canonical.id);
      byId[recordKey] = canonical;
      ids.push(recordKey);
      for (const record of records) {
        if (record.type !== "events" || this.isRecordAdmin(record) || record.generated !== true || record.userId === canonical.userId) {
          continue;
        }
        const generatedRecordKey = this.buildRecordKey(record.userId, record.type, record.id);
        if (byId[generatedRecordKey]) {
          continue;
        }
        byId[generatedRecordKey] = this.cloneRecord(record);
        ids.push(generatedRecordKey);
      }
    }
    return {
      byId,
      ids
    };
  }
  static materializeSeedSlotRecords(collection) {
    const byId = __spreadValues({}, collection.byId);
    const ids = [...collection.ids];
    const existingIds = new Set(ids);
    const parents = ids.map((id) => byId[id]).filter((record) => this.isSeedSlotParentRecord(record));
    for (const parent of parents) {
      for (const record of this.buildSeedGeneratedSlotRecordsForParent(parent)) {
        const recordKey = this.buildRecordKey(record.userId, record.type, record.id);
        byId[recordKey] = record;
        if (!existingIds.has(recordKey)) {
          ids.push(recordKey);
          existingIds.add(recordKey);
        }
      }
    }
    return { byId, ids };
  }
  static buildSeedGeneratedSlotRecordsForParent(parent) {
    const parentStart = this.parseSeedDateTime(parent.startAtIso);
    const parentEnd = this.parseSeedDateTime(parent.endAtIso);
    if (!parentStart || !parentEnd) {
      return [];
    }
    const records = [];
    const templates = parent.slotTemplates ?? [];
    const overrideDates = new Set(templates.map((template) => this.seedSlotOverrideDateKey(template.overrideDate)).filter((value) => Boolean(value)));
    for (const template of templates) {
      if (this.seedSlotOverrideDateKey(template.overrideDate) || template.closed === true) {
        continue;
      }
      records.push(...this.buildSeedGeneratedSlotRecordsForTemplate(parent, template, parentStart, parentEnd, overrideDates));
    }
    for (const template of templates) {
      if (!this.seedSlotOverrideDateKey(template.overrideDate) || template.closed === true) {
        continue;
      }
      records.push(...this.buildSeedGeneratedSlotRecordsForTemplate(parent, template, parentStart, parentEnd, /* @__PURE__ */ new Set(), true));
    }
    return records;
  }
  static buildSeedGeneratedSlotRecordsForTemplate(parent, template, parentStart, parentEnd, overrideDates, overrideOnly = false) {
    const templateStart = this.parseSeedDateTime(template.startAt);
    if (!templateStart) {
      return [];
    }
    const definitions = this.seedSlotTemplateSubEventDefinitions(parent, template);
    const durationMs = Math.max(0, this.seedSubEventDefinitionsDurationMinutes(definitions)) * 60 * 1e3;
    const starts = overrideOnly ? [new Date(templateStart)] : this.generateSeedSlotOccurrenceStarts(parent.frequency ?? "One-time", templateStart, parentStart, parentEnd);
    return starts.flatMap((startAt) => {
      const occurrenceDateKey = this.seedSlotOccurrenceAnchorDateKey(startAt, templateStart, parentStart);
      if (!overrideOnly && occurrenceDateKey && overrideDates.has(occurrenceDateKey)) {
        return [];
      }
      const endAt = new Date(startAt.getTime() + durationMs);
      if (startAt.getTime() < parentStart.getTime() || endAt.getTime() > parentEnd.getTime()) {
        return [];
      }
      return [this.buildSeedGeneratedSlotRecord(parent, template, startAt, endAt, definitions)];
    });
  }
  static buildSeedGeneratedSlotRecord(parent, template, startAt, endAt, definitions) {
    const sourceId = this.buildGeneratedSlotSourceId(parent.id, template.id, startAt);
    return __spreadProps(__spreadValues({}, this.cloneRecord(parent)), {
      id: sourceId,
      userId: _SeedEventsBuilder.SLOT_READ_MODEL_USER_ID,
      type: "events",
      title: parent.title,
      subtitle: parent.subtitle,
      timeframe: this.buildGeneratedSlotTimeframe(startAt, endAt),
      inviter: null,
      unread: 0,
      activity: 0,
      trashedAtIso: null,
      creatorUserId: _SeedEventsBuilder.SLOT_READ_MODEL_USER_ID,
      startAtIso: startAt.toISOString(),
      endAtIso: endAt.toISOString(),
      slotsEnabled: false,
      slotTemplates: [],
      parentEventId: parent.id,
      slotTemplateId: template.id,
      generated: true,
      eventType: "slot",
      nextSlot: null,
      upcomingSlots: [],
      acceptedMembers: 0,
      pendingMembers: 0,
      acceptedMemberUserIds: [],
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [],
      subEventsEnabled: false,
      subEventDefinitions: ActivityEventDetailDTO.normalizeSubEventDefinitions(definitions),
      subEvents: []
    });
  }
  static seedSubEventDefinitionTimeline(items) {
    const definitions = items ?? [];
    let previousStartOffsetMinutes = 0;
    let previousEndOffsetMinutes = 0;
    let hasPrevious = false;
    return definitions.map((item) => {
      const durationMinutes = Math.max(0, Math.trunc(Number(item.durationMinutes) || 0));
      const offsetMinutes = Math.max(0, Math.trunc(Number(item.offsetMinutes) || 0));
      const timing = ActivityEventDetailDTO.normalizeSubEventDefinitionTiming(item.timing);
      const startOffsetMinutes = !hasPrevious ? offsetMinutes : timing === "During" ? previousStartOffsetMinutes + offsetMinutes : previousEndOffsetMinutes + offsetMinutes;
      previousStartOffsetMinutes = startOffsetMinutes;
      previousEndOffsetMinutes = startOffsetMinutes + durationMinutes;
      hasPrevious = true;
      return { item, startOffsetMinutes, durationMinutes };
    });
  }
  static seedSubEventDefinitionsDurationMinutes(items) {
    return this.seedSubEventDefinitionTimeline(items).reduce((total, entry) => Math.max(total, entry.startOffsetMinutes + entry.durationMinutes), 0);
  }
  static buildSeededSubEventsFromDefinitions(definitions, record) {
    if (definitions.length === 0) {
      return [];
    }
    const slotStartMs = AppUtils.toSortableDate(record.startAtIso);
    const items = this.seedSubEventDefinitionTimeline(definitions).map(({ item, startOffsetMinutes, durationMinutes }, index) => {
      const subEventId = `${item.id ?? ""}`.trim() || `${record.id}-subevent-${index + 1}`;
      const startAt = Number.isFinite(slotStartMs) && slotStartMs > 0 ? AppUtils.toIsoDateTime(new Date(slotStartMs + startOffsetMinutes * 60 * 1e3)) : record.startAtIso;
      const endAt = Number.isFinite(slotStartMs) && slotStartMs > 0 ? AppUtils.toIsoDateTime(new Date(slotStartMs + (startOffsetMinutes + durationMinutes) * 60 * 1e3)) : record.endAtIso;
      const capacityMin = this.normalizeCount(item.capacityMin) ?? 0;
      const capacityMax = Math.max(capacityMin, this.normalizeCount(item.capacityMax) ?? this.normalizeCount(item.tournamentGroupCapacityMax) ?? capacityMin);
      const tournamentGroupCapacityMin = this.normalizeCount(item.tournamentGroupCapacityMin);
      const tournamentGroupCapacityMax = this.normalizeCount(item.tournamentGroupCapacityMax);
      const normalizedTournamentGroupCapacityMax = Math.max(tournamentGroupCapacityMin ?? 0, tournamentGroupCapacityMax ?? tournamentGroupCapacityMin ?? 0);
      const hasTournamentGroups = (tournamentGroupCapacityMin ?? 0) > 0 || (tournamentGroupCapacityMax ?? 0) > 0;
      const incomingGroupCapacity = Math.max(1, record.capacityMax ?? capacityMax);
      const groupsNeededForMaximum = normalizedTournamentGroupCapacityMax > 0 ? Math.ceil(incomingGroupCapacity / normalizedTournamentGroupCapacityMax) : 0;
      const groupsAllowedByMinimum = (tournamentGroupCapacityMin ?? 0) > 0 ? Math.max(1, Math.floor(incomingGroupCapacity / (tournamentGroupCapacityMin ?? 1))) : groupsNeededForMaximum;
      const acceptedSeed = item.optional ? Math.min(Math.max(1, capacityMax || 1), Math.max(1, record.acceptedMembers)) : Math.min(Math.max(0, capacityMax), Math.max(0, record.acceptedMembers));
      const pendingSeed = Math.max(1, Math.min(Math.max(capacityMax, 4), Math.max(1, record.pendingMembers)));
      return {
        id: subEventId,
        name: `${item.name ?? ""}`.trim() || `Sub Event ${index + 1}`,
        description: `${item.description ?? ""}`.trim(),
        startAt,
        endAt,
        location: `${item.location ?? ""}`.trim(),
        createdByUserId: `${record.creatorUserId ?? ""}`.trim() || void 0,
        tournamentGroupCapacityMin: item.tournamentGroupCapacityMin,
        tournamentGroupCapacityMax: item.tournamentGroupCapacityMax,
        tournamentLeaderboardType: item.tournamentLeaderboardType,
        tournamentAdvancePerGroup: item.tournamentAdvancePerGroup,
        groupsCount: hasTournamentGroups && normalizedTournamentGroupCapacityMax > 0 ? Math.min(groupsNeededForMaximum, groupsAllowedByMinimum) : void 0,
        groupsPending: hasTournamentGroups ? 0 : void 0,
        optional: item.optional === true,
        pricing: item.pricing ? SeedPricingBuilder.clonePricingConfig(item.pricing) : item.pricing,
        capacityMin,
        capacityMax,
        membersAccepted: acceptedSeed,
        membersPending: pendingSeed,
        carsPending: index % 2 === 0 ? 1 : 0,
        accommodationPending: item.optional ? 1 : 0,
        suppliesPending: item.optional ? 1 : 2,
        slotStartOffsetMinutes: startOffsetMinutes,
        slotDurationMinutes: durationMinutes,
        stageStatus: hasTournamentGroups ? "RS" : void 0,
        stageStatusReason: hasTournamentGroups ? "awaiting-tournament-start" : void 0
      };
    });
    return ActivityEventDetailDTO.normalizeSubEvents(items);
  }
  static seedSlotTemplateSubEventDefinitions(parent, template) {
    if (parent.subEventsEnabled !== true) {
      return [];
    }
    const overrideDefinitions = ActivityEventDetailDTO.normalizeSubEventDefinitions(template.subEventDefinitions ?? []);
    return overrideDefinitions.length > 0 ? overrideDefinitions : ActivityEventDetailDTO.normalizeSubEventDefinitions(parent.subEventDefinitions ?? []);
  }
  static generateSeedSlotOccurrenceStarts(frequency, templateStart, parentStart, parentEnd) {
    const normalizedFrequency = `${frequency ?? ""}`.trim().toLowerCase();
    if (normalizedFrequency === "one-time" || normalizedFrequency === "custom" || !normalizedFrequency) {
      return templateStart.getTime() >= parentStart.getTime() && templateStart.getTime() <= parentEnd.getTime() ? [new Date(templateStart)] : [];
    }
    const starts = [];
    const cursor = new Date(parentStart);
    cursor.setHours(0, 0, 0, 0);
    const endDate = new Date(parentEnd);
    endDate.setHours(0, 0, 0, 0);
    while (cursor.getTime() <= endDate.getTime()) {
      if (this.matchesSeedSlotFrequency(cursor, templateStart, normalizedFrequency)) {
        const next = new Date(cursor);
        next.setHours(templateStart.getHours(), templateStart.getMinutes(), templateStart.getSeconds(), templateStart.getMilliseconds());
        if (next.getTime() >= parentStart.getTime() && next.getTime() <= parentEnd.getTime()) {
          starts.push(next);
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return starts;
  }
  static matchesSeedSlotFrequency(date, templateStart, frequency) {
    if (frequency === "daily") {
      return true;
    }
    if (frequency === "weekly") {
      return date.getDay() === templateStart.getDay();
    }
    if (frequency === "bi-weekly" || frequency === "biweekly") {
      if (date.getDay() !== templateStart.getDay()) {
        return false;
      }
      const diffDays = Math.floor((date.getTime() - templateStart.getTime()) / (24 * 60 * 60 * 1e3));
      const diffWeeks = Math.floor(diffDays / 7);
      return diffWeeks >= 0 && diffWeeks % 2 === 0;
    }
    if (frequency === "monthly") {
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      return date.getDate() === Math.min(templateStart.getDate(), lastDayOfMonth);
    }
    if (frequency === "yearly" || frequency === "annual" || frequency === "annually") {
      if (date.getMonth() !== templateStart.getMonth()) {
        return false;
      }
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      return date.getDate() === Math.min(templateStart.getDate(), lastDayOfMonth);
    }
    return false;
  }
  static isGeneratedSeedSlotRecord(record) {
    return Boolean(record?.generated) || record?.eventType === "slot" || Boolean(record?.parentEventId);
  }
  static isSeedSlotParentRecord(record) {
    return Boolean(record?.slotsEnabled) && !this.isGeneratedSeedSlotRecord(record) && (record?.slotTemplates?.length ?? 0) > 0;
  }
  static buildGeneratedSlotSourceId(parentEventId, slotTemplateId, startAt) {
    return `${parentEventId}:slot:${slotTemplateId}:${startAt.toISOString()}`;
  }
  static buildGeneratedSlotTimeframe(startAt, endAt) {
    const dateLabel = startAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const startLabel = startAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const endLabel = endAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${dateLabel} \xB7 ${startLabel} - ${endLabel}`;
  }
  static seedSlotOverrideDateKey(value) {
    const parsed = this.parseSeedDateTime(value?.includes("T") ? value : `${value ?? ""}T00:00`);
    if (!parsed) {
      return null;
    }
    const year = parsed.getFullYear();
    const month = `${parsed.getMonth() + 1}`.padStart(2, "0");
    const day = `${parsed.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  static seedSlotOccurrenceAnchorDateKey(occurrenceStart, templateStart, parentStart) {
    const templateOffsetMs = templateStart.getTime() - parentStart.getTime();
    return this.seedSlotOverrideDateKey(new Date(occurrenceStart.getTime() - templateOffsetMs).toISOString());
  }
  static buildCanonicalEventRecord(records) {
    const preferred = records.reduce((current, next) => this.shouldPreferParticipationCanonicalRecord(next, current) ? next : current);
    const creatorUserId = preferred.creatorUserId?.trim() || records.find((record) => record.creatorUserId?.trim())?.creatorUserId?.trim() || preferred.userId.trim();
    const adminIds = this.normalizeUserIds([
      creatorUserId,
      ...records.flatMap((record) => record.adminIds ?? []),
      ...records.filter((record) => this.isRecordAdmin(record) || record.type === "hosting" || record.userId === record.creatorUserId).map((record) => record.userId)
    ]);
    const acceptedMemberUserIds = this.normalizeUserIds([
      ...records.flatMap((record) => record.acceptedMemberUserIds ?? []),
      ...adminIds
    ]);
    const invitedMemberUserIds = this.normalizeUserIds(records.filter((record) => record.type === "invitations").flatMap((record) => [
      record.userId,
      ...record.pendingMemberUserIds ?? []
    ])).filter((userId2) => !acceptedMemberUserIds.includes(userId2));
    const pendingRequestMemberUserIds = this.normalizeUserIds(records.filter((record) => record.type !== "invitations").flatMap((record) => record.pendingMemberUserIds ?? [])).filter((userId2) => !acceptedMemberUserIds.includes(userId2) && !invitedMemberUserIds.includes(userId2));
    const pendingMemberUserIds = this.normalizeUserIds([...invitedMemberUserIds, ...pendingRequestMemberUserIds]);
    const userId = adminIds[0] ?? creatorUserId;
    return __spreadProps(__spreadValues({}, this.cloneRecord(preferred)), {
      userId,
      type: "events",
      adminIds,
      creatorUserId: userId,
      acceptedMembers: acceptedMemberUserIds.length,
      pendingMembers: pendingMemberUserIds.length,
      acceptedMemberUserIds,
      pendingMemberUserIds,
      invitedMemberUserIds,
      pendingRequestMemberUserIds,
      ticketing: records.some((record) => record.ticketing === true),
      capacityTotal: Math.max(preferred.capacityTotal, acceptedMemberUserIds.length)
    });
  }
  static shouldPreferParticipationCanonicalRecord(next, current) {
    if (next.type === "invitations" && current.type !== "invitations") {
      return false;
    }
    if (next.type !== "invitations" && current.type === "invitations") {
      return true;
    }
    if (next.type === "hosting" && current.type !== "hosting") {
      return true;
    }
    if (next.type !== "hosting" && current.type === "hosting") {
      return false;
    }
    const nextAdmin = this.isRecordAdmin(next);
    const currentAdmin = this.isRecordAdmin(current);
    if (nextAdmin !== currentAdmin) {
      return nextAdmin;
    }
    return AppUtils.toSortableDate(next.startAtIso) < AppUtils.toSortableDate(current.startAtIso);
  }
  static isRecordAdmin(record) {
    const userId = record.userId.trim();
    return !!userId && (record.creatorUserId === userId || (record.adminIds ?? []).includes(userId));
  }
  static cloneRecord(record) {
    return __spreadProps(__spreadValues({}, record), {
      adminIds: [...record.adminIds ?? []],
      acceptedMemberUserIds: [...record.acceptedMemberUserIds ?? []],
      pendingMemberUserIds: [...record.pendingMemberUserIds ?? []],
      invitedMemberUserIds: [...record.invitedMemberUserIds ?? []],
      pendingRequestMemberUserIds: [...record.pendingRequestMemberUserIds ?? []],
      locationCoordinates: this.cloneLocationCoordinates(record.locationCoordinates),
      pricing: record.pricing ? SeedPricingBuilder.clonePricingConfig(record.pricing) : void 0,
      approvalRequired: record.approvalRequired === true,
      policiesEnabled: record.policiesEnabled === true,
      policies: (record.policies ?? []).map((item) => __spreadValues({}, item)),
      slotTemplates: this.cloneSlotTemplates(record.slotTemplates) ?? [],
      nextSlot: record.nextSlot ? __spreadValues({}, record.nextSlot) : null,
      upcomingSlots: (record.upcomingSlots ?? []).map((item) => __spreadValues({}, item)),
      checkoutBasket: ActivityEventDetailDTO.cloneCheckoutBasket(record.checkoutBasket),
      topics: [...record.topics ?? []],
      subEventsEnabled: record.subEventsEnabled !== false,
      subEventDefinitions: (record.subEventDefinitions ?? []).map((item) => __spreadProps(__spreadValues({}, item), {
        pricing: item.pricing ? SeedPricingBuilder.clonePricingConfig(item.pricing) : item.pricing
      })),
      subEvents: ActivityEventDetailDTO.normalizeSubEvents(record.subEvents ?? []),
      currentStage: record.currentStage ? __spreadValues({}, record.currentStage) : null
    });
  }
  static buildRecordKey(userId, type, sourceId) {
    return `${userId}:${type}:${sourceId}`;
  }
  static buildCreatorUserIdByEventId(options) {
    const map = /* @__PURE__ */ new Map();
    for (const [userId, items] of Object.entries(options.hostingByUser)) {
      for (const item of items) {
        map.set(item.id, item.creatorUserId?.trim() || userId);
      }
    }
    for (const [userId, items] of Object.entries(options.eventsByUser)) {
      for (const item of items) {
        const explicitCreatorUserId = item.creatorUserId?.trim() || "";
        if (explicitCreatorUserId) {
          map.set(item.id, explicitCreatorUserId);
          continue;
        }
        if (item.isAdmin && !map.has(item.id)) {
          map.set(item.id, userId);
        }
      }
    }
    return map;
  }
  static resolveInvitationCreatorUserId(item, inviteeUserId, creatorUserIdByEventId) {
    const byEventId = creatorUserIdByEventId.get(item.id)?.trim() ?? "";
    if (byEventId) {
      return byEventId;
    }
    const normalizedInviter = AppUtils.normalizeText(item.inviter);
    if (normalizedInviter) {
      const exactMatch = DEMO_EVENT_MEMBER_USERS.find((user) => AppUtils.normalizeText(user.name) === normalizedInviter);
      if (exactMatch) {
        return exactMatch.id;
      }
      const firstNameMatch = DEMO_EVENT_MEMBER_USERS.find((user) => AppUtils.normalizeText(user.name.split(/\s+/)[0] ?? "") === normalizedInviter);
      if (firstNameMatch) {
        return firstNameMatch.id;
      }
    }
    const avatarInitials = item.avatar?.trim() || AppUtils.initialsFromText(item.inviter);
    if (avatarInitials) {
      const initialsMatch = DEMO_EVENT_MEMBER_USERS.find((user) => user.initials === avatarInitials && user.id !== inviteeUserId);
      if (initialsMatch) {
        return initialsMatch.id;
      }
    }
    const fallbackCandidates = DEMO_EVENT_MEMBER_USERS.filter((user) => user.id !== inviteeUserId);
    if (fallbackCandidates.length === 0) {
      return inviteeUserId;
    }
    const fallbackIndex = Math.abs(AppUtils.hashText(`invitation-creator:${inviteeUserId}:${item.id}:${item.inviter}`)) % fallbackCandidates.length;
    return fallbackCandidates[fallbackIndex]?.id ?? inviteeUserId;
  }
  static buildRecord(record) {
    const decorations = this.buildRecordDecorations(record);
    return __spreadProps(__spreadValues(__spreadValues({}, record), decorations), {
      adminIds: this.normalizeUserIds([...record.adminIds ?? [], decorations.creatorUserId]),
      status: this.resolveLifecycleStatus(record),
      statusBeforeSuppression: null,
      timeframe: this.buildSeededTimeframeLabel({
        hint: record.timeframe,
        startAtIso: decorations.startAtIso,
        endAtIso: decorations.endAtIso,
        frequency: decorations.frequency,
        slotTemplates: decorations.slotTemplates
      })
    });
  }
  static resolveLifecycleStatus(record) {
    return record.status ?? "A";
  }
  static buildRecordDecorations(record) {
    const creator = this.resolveCreatorUser(record.creatorUserId, record.title);
    const requestedFrequency = record.seed?.frequency?.trim() || this.parseFrequencyFromTimeframe(record.timeframe ?? "");
    const isGeneratedSeed = record.seed?.generated === true;
    const startAtIso = isGeneratedSeed ? this.normalizeGeneratedSeedDateTime(record.seed?.startAt) || this.resolveStartAtIso(record) : this.rebaseSeedDateTime(record.seed?.startAt) || this.resolveStartAtIso(record);
    const endAtIso = isGeneratedSeed ? this.normalizeGeneratedSeedDateTime(record.seed?.endAt) || this.resolveEndAtIso(record, startAtIso) : this.rebaseSeedDateTime(record.seed?.endAt) || this.resolveEndAtIso(record, startAtIso);
    const distanceKm = Number.isFinite(record.seed?.distanceKm) ? Math.max(0, Number(record.seed?.distanceKm)) : this.resolveDistanceKm(record);
    const visibility = record.seed?.visibility ?? this.resolveVisibility(record);
    const blindMode = record.seed?.blindMode ?? this.resolveBlindMode(record);
    const capacityRange = this.resolveCapacityRange(record);
    const seededMembers = this.buildSeededMemberIds(record, startAtIso, distanceKm, creator);
    const acceptedMemberUserIds = this.normalizeUserIds(record.seed?.acceptedMemberUserIds);
    const pendingMemberUserIds = this.normalizeUserIds(record.seed?.pendingMemberUserIds);
    const rawMembers = this.normalizeDirectEventMembers(record, creator.id, {
      acceptedMemberUserIds: acceptedMemberUserIds.length > 0 ? acceptedMemberUserIds : seededMembers.acceptedMemberUserIds,
      pendingMemberUserIds: pendingMemberUserIds.length > 0 ? pendingMemberUserIds : seededMembers.pendingMemberUserIds
    });
    const compactMemberCounts = this.resolveCompactSeedMemberCounts(record, rawMembers);
    const preserveExplicitAcceptedMembers = acceptedMemberUserIds.length > 0;
    const preserveExplicitPendingMembers = pendingMemberUserIds.length > 0;
    const compactAcceptedMemberUserIds = preserveExplicitAcceptedMembers ? rawMembers.acceptedMemberUserIds : rawMembers.acceptedMemberUserIds.slice(0, compactMemberCounts.acceptedMembers);
    const members = {
      acceptedMemberUserIds: compactAcceptedMemberUserIds,
      pendingMemberUserIds: rawMembers.pendingMemberUserIds.filter((userId) => !compactAcceptedMemberUserIds.includes(userId)).slice(0, preserveExplicitPendingMembers ? rawMembers.pendingMemberUserIds.length : compactMemberCounts.pendingMembers)
    };
    const acceptedMembers = members.acceptedMemberUserIds.length;
    const pendingMembers = members.pendingMemberUserIds.length;
    const capacityMin = this.normalizeCount(record.seed?.capacityMin) ?? this.normalizeCount(capacityRange.min);
    const capacityMax = this.normalizeCount(record.seed?.capacityMax) ?? this.normalizeCount(capacityRange.max);
    const compactCapacityTotal = this.normalizeCount(record.seed?.capacityTotal) == null ? this.resolveCompactSeedCapacityTotal(record, acceptedMembers, pendingMembers) : null;
    const capacityTotal = Math.max(acceptedMembers, this.normalizeCount(record.seed?.capacityTotal) ?? compactCapacityTotal ?? capacityMax ?? acceptedMembers);
    const slotTemplates = this.cloneRebasedSlotTemplates(record.seed?.slotTemplates) ?? [];
    const slotsEnabled = record.seed?.slotsEnabled === true && slotTemplates.length > 0;
    const frequency = slotsEnabled ? requestedFrequency : "One-time";
    const topics = this.normalizeTopics(record.seed?.topics).length > 0 ? this.normalizeTopics(record.seed?.topics) : this.buildSeededTopics(record.id, record.title, record.subtitle);
    const explicitSubEventDefinitions = this.cloneSubEventDefinitions(record.seed?.subEventDefinitions) ?? [];
    const subEventDefinitions = explicitSubEventDefinitions.length > 0 ? explicitSubEventDefinitions : this.buildSeededSubEventDefinitions(record, startAtIso, endAtIso, capacityRange);
    const subEventsEnabled = record.seed?.subEventsEnabled ?? subEventDefinitions.length > 0;
    const subEvents = subEventsEnabled ? this.buildSeededSubEventsFromDefinitions(subEventDefinitions, {
      id: record.id,
      startAtIso,
      endAtIso,
      acceptedMembers,
      pendingMembers,
      capacityMax,
      creatorUserId: creator.id
    }) : [];
    const rating = Number.isFinite(record.seed?.rating) ? Number(record.seed?.rating) : this.buildSeededRating(record.id, record.title, record.type);
    const acceptedUsers = members.acceptedMemberUserIds.map((userId) => DEMO_EVENT_MEMBER_USERS.find((user) => user.id === userId) ?? null).filter((user) => Boolean(user));
    const location = record.seed?.location?.trim() || this.buildSeededLocation(record, creator);
    const ticketing = record.seed?.ticketing ?? this.resolveTicketing(record);
    const approvalRequired = record.seed?.approvalRequired === true;
    return {
      creatorUserId: creator.id,
      creatorName: creator.name,
      creatorInitials: creator.initials,
      creatorGender: creator.gender,
      creatorCity: creator.city,
      visibility,
      blindMode,
      startAtIso,
      endAtIso,
      distanceKm,
      imageUrl: record.seed?.imageUrl?.trim() || this.buildRecordImageUrl(record),
      sourceLink: record.seed?.sourceLink?.trim() || this.buildRecordSourceLink(record),
      location,
      locationCoordinates: this.cloneLocationCoordinates(record.seed?.locationCoordinates) ?? this.cloneLocationCoordinates(creator.locationCoordinates) ?? this.resolveRecordLocationCoordinates(record, creator, location),
      capacityMin,
      capacityMax,
      capacityTotal,
      autoInviter: record.seed?.autoInviter ?? this.resolveAutoInviter(record),
      frequency,
      ticketing,
      approvalRequired,
      pricing: record.seed?.pricing ? this.rebasePricingConfig(record.seed.pricing) : SeedPricingBuilder.createSamplePricingConfig(ticketing ? "hybrid" : "fixed"),
      policiesEnabled: record.seed?.policiesEnabled === true,
      policies: this.clonePolicies(record.seed?.policies) ?? [],
      slotsEnabled,
      slotTemplates,
      parentEventId: null,
      slotTemplateId: null,
      generated: isGeneratedSeed,
      eventType: "main",
      nextSlot: null,
      upcomingSlots: [],
      acceptedMembers,
      pendingMembers,
      acceptedMemberUserIds: [...members.acceptedMemberUserIds],
      pendingMemberUserIds: [...members.pendingMemberUserIds],
      invitedMemberUserIds: record.type === "invitations" ? [...members.pendingMemberUserIds] : [],
      pendingRequestMemberUserIds: record.type === "invitations" ? [] : [...members.pendingMemberUserIds],
      topics,
      subEventsEnabled,
      subEventDefinitions,
      subEvents,
      mode: record.seed?.mode ?? SeedEventBuilder.inferredEventModeFromDefinitions(subEventDefinitions),
      currentStage: tournamentCurrentStageFromSubEvents(subEvents),
      rating,
      boost: Number.isFinite(record.seed?.boost) ? Number(record.seed?.boost) : this.buildSeededBoost(record.id, record.title, record.type),
      affinity: Number.isFinite(record.seed?.affinity) ? Math.max(0, Math.trunc(Number(record.seed?.affinity))) : this.resolveEventAffinity({
        id: record.id,
        title: record.title,
        subtitle: record.subtitle,
        topics,
        visibility,
        blindMode,
        creator,
        acceptedUsers,
        rating,
        acceptedMembers,
        capacityTotal
      })
    };
  }
  static resolveEventAffinity(options) {
    const participantUsers = [options.creator ?? null, ...options.acceptedUsers ?? []].filter((user) => Boolean(user));
    const participantAffinities = participantUsers.filter((user) => typeof user.id === "string" && user.id.trim().length > 0).map((user) => SeedUserBuilder.resolveUserAffinity({
      id: `${user.id}`,
      name: `${user.name ?? "Unknown User"}`,
      age: Math.max(18, Math.trunc(Number(user.age) || 30)),
      city: `${user.city ?? ""}`,
      height: `${user.height ?? "170 cm"}`,
      physique: `${user.physique ?? ""}`,
      languages: [...user.languages ?? []],
      horoscope: `${user.horoscope ?? ""}`,
      gender: user.gender === "woman" ? "woman" : "man",
      hostTier: `${user.hostTier ?? ""}`,
      traitLabel: `${user.traitLabel ?? ""}`,
      completion: Math.max(0, Math.trunc(Number(user.completion) || 0))
    }));
    const averageParticipantAffinity = participantAffinities.length > 0 ? Math.round(participantAffinities.reduce((total, value) => total + value, 0) / participantAffinities.length) : 0;
    const tokens = this.uniqueAffinityTokens([
      options.title,
      options.subtitle ?? "",
      ...options.topics,
      options.visibility,
      options.blindMode,
      ...participantUsers.flatMap((user) => [
        `${user.city ?? ""}`,
        `${user.physique ?? ""}`,
        ...user.languages ?? [],
        `${user.horoscope ?? ""}`,
        `${user.gender ?? ""}`,
        `${user.hostTier ?? ""}`,
        `${user.traitLabel ?? ""}`
      ])
    ]);
    return this.resolveAffinityTokenScore(tokens, `event:${options.id}`) * 89 + averageParticipantAffinity + Math.round(AppUtils.clampNumber(Number(options.rating) || 0, 0, 10) * 100) * 29 + Math.max(0, Math.trunc(Number(options.acceptedMembers) || 0)) * 19 + Math.max(0, Math.trunc(Number(options.capacityTotal) || 0)) * 7;
  }
  static resolveCreatorUser(userId, fallbackTitle) {
    return DEMO_EVENT_MEMBER_USERS.find((user) => user.id === userId) ?? DEMO_EVENT_MEMBER_USERS[0] ?? {
      id: userId,
      name: fallbackTitle || "Unknown Host",
      age: 30,
      birthday: "1996-01-01",
      city: "Austin",
      height: "175 cm",
      physique: "Athletic",
      languages: ["English"],
      horoscope: "Aries",
      initials: AppUtils.initialsFromText(fallbackTitle || "Unknown Host"),
      gender: "man",
      statusText: "Recently Active",
      hostTier: "Host",
      traitLabel: "Reliable",
      completion: 60,
      headline: "",
      about: "",
      profileStatus: "public",
      activities: { game: 0, chats: 0, invitations: 0, events: 0, hosting: 0 }
    };
  }
  static recordSeedKey(record) {
    return `${record.type}:${record.userId}:${record.id}:${record.title}`;
  }
  static resolveStartAtIso(record) {
    const seed = AppUtils.hashText(`event-start:${this.recordSeedKey(record)}`);
    const monthIndex = record.type === "invitations" ? 1 : 2;
    const day = 1 + seed % 28;
    const hourBase = record.type === "hosting" ? 17 : record.type === "invitations" ? 15 : 9;
    const hourSpan = record.type === "hosting" ? 5 : record.type === "invitations" ? 6 : 10;
    const hour = hourBase + (seed >> 3) % hourSpan;
    const minute = (seed >> 7) % 4 * 15;
    return this.rebaseSeedDateTime(new Date(2026, monthIndex, day, hour, minute, 0, 0)) ?? AppUtils.toIsoDateTimeLocal(new Date(2026, monthIndex, day, hour, minute, 0, 0));
  }
  static resolveEndAtIso(record, startAtIso) {
    const startAt = new Date(startAtIso);
    if (Number.isNaN(startAt.getTime())) {
      return AppUtils.toIsoDateTimeLocal(AppUtils.anchorDate(environment.bootstrapOffsetInDays));
    }
    const seed = AppUtils.hashText(`event-duration:${this.recordSeedKey(record)}`);
    const durationMinutes = 90 + seed % 5 * 30;
    return AppUtils.toIsoDateTimeLocal(new Date(startAt.getTime() + durationMinutes * 60 * 1e3));
  }
  static resolveDistanceKm(record) {
    const seed = AppUtils.hashText(`event-distance:${this.recordSeedKey(record)}`);
    const baseDistance = record.type === "hosting" ? 4 : record.type === "invitations" ? 2 : 6;
    const distance = baseDistance + seed % 24 + (seed >> 5) % 10 / 10;
    return Math.round(distance * 10) / 10;
  }
  static resolveVisibility(record) {
    const seed = AppUtils.hashText(`event-visibility:${this.recordSeedKey(record)}`);
    if (record.type === "hosting") {
      return seed % 4 === 0 ? "Friends only" : "Invitation only";
    }
    const variants = ["Public", "Friends only", "Invitation only"];
    return variants[seed % variants.length] ?? "Public";
  }
  static resolveBlindMode(record) {
    const seed = AppUtils.hashText(`event-blind-mode:${this.recordSeedKey(record)}`);
    return seed % 5 === 0 ? "Blind Event" : "Open Event";
  }
  static resolveCapacityRange(record) {
    const seed = AppUtils.hashText(`event-capacity:${this.recordSeedKey(record)}`);
    const maxBase = record.type === "hosting" ? 16 : record.type === "invitations" ? 6 : 10;
    const max = maxBase + seed % 22 + Math.max(0, Math.trunc(Number(record.activity) || 0));
    const minRatio = record.type === "invitations" ? 0.35 + (seed >> 4) % 2 * 0.1 : 0.45 + (seed >> 4) % 3 * 0.08;
    const min = Math.max(0, Math.min(max, Math.floor(max * minRatio)));
    return { min, max };
  }
  static resolveCompactSeedMemberCounts(record, members) {
    const acceptedMax = Math.max(0, members.acceptedMemberUserIds.length);
    const pendingMax = Math.max(0, members.pendingMemberUserIds.length);
    if (acceptedMax === 0 && pendingMax === 0) {
      return {
        acceptedMembers: 0,
        pendingMembers: 0
      };
    }
    const seed = AppUtils.hashText(`compact-member-count:${this.recordSeedKey(record)}:${record.activity}`);
    const invitation = record.type === "invitations";
    const acceptedTarget = invitation ? Math.min(acceptedMax, 1 + seed % 2) : Math.min(acceptedMax, 1 + (seed % 5 === 0 ? 1 : 0));
    const pendingTarget = invitation ? Math.min(pendingMax, 1) : seed % 9 === 0 ? Math.min(pendingMax, 1) : 0;
    return {
      acceptedMembers: acceptedTarget,
      pendingMembers: pendingTarget
    };
  }
  static resolveCompactSeedCapacityTotal(record, acceptedMembers, pendingMembers) {
    const seed = AppUtils.hashText(`compact-capacity:${this.recordSeedKey(record)}:${record.activity}`);
    const invitation = record.type === "invitations";
    const memberFloor = Math.max(acceptedMembers, acceptedMembers + Math.min(pendingMembers, 1), invitation ? 2 : 1);
    if (!invitation && acceptedMembers > 0 && seed % 6 === 0) {
      return acceptedMembers;
    }
    if (invitation) {
      return Math.max(memberFloor, 2 + seed % 3);
    }
    return Math.max(memberFloor, acceptedMembers + 1 + (seed >> 3) % 4);
  }
  static normalizeDirectEventMembers(record, _creatorUserId, members) {
    const ownerUserId = record.userId.trim();
    const normalizedAcceptedMemberUserIds = this.normalizeUserIds(members.acceptedMemberUserIds);
    const normalizedPendingMemberUserIds = this.normalizeUserIds(members.pendingMemberUserIds).filter((userId) => !normalizedAcceptedMemberUserIds.includes(userId));
    if (record.type === "invitations") {
      return {
        acceptedMemberUserIds: normalizedAcceptedMemberUserIds,
        pendingMemberUserIds: normalizedPendingMemberUserIds
      };
    }
    const ownerHasExplicitAcceptedMembership = normalizedAcceptedMemberUserIds.includes(ownerUserId);
    const ownerHasExplicitPendingMembership = !ownerHasExplicitAcceptedMembership && normalizedPendingMemberUserIds.includes(ownerUserId);
    const acceptedMemberUserIds = normalizedAcceptedMemberUserIds.filter((userId) => userId !== ownerUserId);
    const pendingMemberUserIds = normalizedPendingMemberUserIds.filter((userId) => userId !== ownerUserId && !acceptedMemberUserIds.includes(userId));
    if (record.type !== "events" || !ownerUserId) {
      return {
        acceptedMemberUserIds,
        pendingMemberUserIds
      };
    }
    if (ownerHasExplicitPendingMembership) {
      return {
        acceptedMemberUserIds,
        pendingMemberUserIds: [ownerUserId, ...pendingMemberUserIds]
      };
    }
    return {
      acceptedMemberUserIds: [ownerUserId, ...acceptedMemberUserIds],
      pendingMemberUserIds
    };
  }
  static buildRecordImageUrl(record) {
    return demoEventPlaceholderUrl(`demo-event-${record.type}:${record.userId}:${record.id}`);
  }
  static buildRecordSourceLink(record) {
    const typeSegment = record.type === "hosting" ? "hosting" : record.type === "invitations" ? "invitation" : "event";
    return `https://example.com/${typeSegment}/${encodeURIComponent(record.userId)}/${encodeURIComponent(record.id)}`;
  }
  static buildSeededLocation(record, creator) {
    const city = creator.city.trim() || "Austin";
    const title = record.title.trim() || "Event";
    if (record.type === "hosting") {
      return `${city} host venue`;
    }
    if (record.type === "invitations") {
      return `${city} meetup point`;
    }
    return `${title} \xB7 ${city}`;
  }
  static resolveRecordLocationCoordinates(record, creator, location) {
    return SeedUserBuilder.resolveDemoLocationCoordinates(creator.city || "Austin", `event-location:${this.recordSeedKey(record)}:${location}`);
  }
  static resolveAutoInviter(record) {
    const seed = AppUtils.hashText(`event-auto-inviter:${this.recordSeedKey(record)}`);
    return record.type !== "invitations" && seed % 4 === 0;
  }
  static resolveTicketing(record) {
    const seed = AppUtils.hashText(`event-ticketing:${this.recordSeedKey(record)}`);
    if (record.type === "invitations") {
      return false;
    }
    return seed % 3 === 0;
  }
  static buildSeededMemberIds(record, startAtIso, distanceKm, creator) {
    if (record.type === "invitations") {
      const invitee = this.resolveCreatorUser(record.userId, record.title);
      const seed2 = AppUtils.hashText(`invitation-members:${this.recordSeedKey(record)}:${creator.id}:${invitee.id}`);
      const acceptedTarget2 = 1 + seed2 % 3;
      const pendingTarget2 = Math.max(1, 1 + (seed2 >> 3) % 2);
      const orderedCandidates = DEMO_EVENT_MEMBER_USERS.filter((user) => user.id !== invitee.id).sort((left, right) => AppUtils.hashText(`invitation-member:${record.id}:${left.id}`) - AppUtils.hashText(`invitation-member:${record.id}:${right.id}`));
      const acceptedMemberUserIds2 = Array.from(/* @__PURE__ */ new Set([
        creator.id,
        ...orderedCandidates.filter((user) => user.id !== creator.id).slice(0, Math.max(0, acceptedTarget2 - 1)).map((user) => user.id)
      ])).slice(0, acceptedTarget2);
      const pendingMemberUserIds = Array.from(/* @__PURE__ */ new Set([
        invitee.id,
        ...orderedCandidates.filter((user) => user.id !== creator.id && !acceptedMemberUserIds2.includes(user.id)).slice(0, Math.max(0, pendingTarget2 - 1)).map((user) => user.id)
      ])).filter((userId) => !acceptedMemberUserIds2.includes(userId)).slice(0, pendingTarget2);
      return {
        acceptedMemberUserIds: acceptedMemberUserIds2,
        pendingMemberUserIds
      };
    }
    const seed = AppUtils.hashText(`event-members:${this.recordSeedKey(record)}:${startAtIso}:${Math.round(distanceKm)}`);
    const acceptedTarget = 1 + (seed % 5 === 0 ? 1 : 0);
    const pendingTarget = seed % 9 === 0 ? 1 : 0;
    const activeUserId = record.type === "events" ? record.userId || creator.id : creator.id || record.userId;
    const members = SeedEventBuilder.seededEventMemberIds(record.id, Math.max(acceptedTarget + pendingTarget, 1), DEMO_EVENT_MEMBER_USERS, activeUserId);
    const acceptedMemberUserIds = this.normalizeUserIds(members).slice(0, acceptedTarget);
    return {
      acceptedMemberUserIds,
      pendingMemberUserIds: this.normalizeUserIds(members).filter((userId) => !acceptedMemberUserIds.includes(userId)).slice(0, pendingTarget)
    };
  }
  static buildSeededTopics(id, title, subtitle) {
    const pool = Array.from(new Set(APP_STATIC_DATA.interestOptionGroups.flatMap((group) => group.options)));
    if (pool.length === 0) {
      return [];
    }
    const seed = AppUtils.hashText(`${id}:${title}:${subtitle}`);
    const count = 2 + seed % 2;
    const topics = [];
    for (let index = 0; index < pool.length && topics.length < count; index += 1) {
      const candidate = pool[(seed + index * 3) % pool.length];
      if (!topics.includes(candidate)) {
        topics.push(candidate);
      }
    }
    return topics;
  }
  static buildSeededSubEventDefinitions(record, startAtIso, endAtIso, capacityRange) {
    const source = __spreadValues({
      id: record.id,
      avatar: AppUtils.initialsFromText(record.title),
      title: record.title,
      shortDescription: record.subtitle,
      timeframe: record.timeframe ?? startAtIso,
      activity: record.activity
    }, record.type === "events" ? { isAdmin: this.isRecordAdmin(record) } : {});
    return SeedEventBuilder.buildSeededSubEventDefinitionsForEvent(source, {
      isHosting: record.type === "hosting",
      activityDateTimeRangeById: {
        [record.id]: {
          startIso: startAtIso,
          endIso: endAtIso
        }
      },
      hostingDatesById: record.type === "hosting" ? { [record.id]: startAtIso } : {},
      eventDatesById: record.type === "events" ? { [record.id]: startAtIso } : {},
      eventCapacityById: {
        [record.id]: capacityRange
      },
      activityCapacityById: {},
      defaultStartIso: startAtIso
    });
  }
  static buildSeededRating(id, title, type) {
    const seed = AppUtils.hashText(`${type}:${id}:${title}`);
    return 6 + seed % 35 / 10;
  }
  static buildSeededBoost(id, title, type) {
    const seed = AppUtils.hashText(`${type}:${id}:${title}`);
    return 50 + seed % 51;
  }
  static extractSeedOverrides(item) {
    const overrides = {
      startAt: item.startAt,
      endAt: item.endAt,
      distanceKm: item.distanceKm,
      autoInviter: "autoInviter" in item ? item.autoInviter : void 0,
      frequency: "frequency" in item ? item.frequency : void 0,
      ticketing: "ticketing" in item ? item.ticketing : void 0,
      approvalRequired: "approvalRequired" in item ? item.approvalRequired : void 0,
      visibility: "visibility" in item ? item.visibility : void 0,
      blindMode: "blindMode" in item ? item.blindMode : void 0,
      imageUrl: item.imageUrl,
      sourceLink: item.sourceLink,
      location: item.location,
      locationCoordinates: this.cloneLocationCoordinates(item.locationCoordinates) ?? void 0,
      capacityMin: item.capacityMin,
      capacityMax: item.capacityMax,
      capacityTotal: item.capacityTotal,
      acceptedMemberUserIds: item.acceptedMemberUserIds ? [...item.acceptedMemberUserIds] : void 0,
      pendingMemberUserIds: item.pendingMemberUserIds ? [...item.pendingMemberUserIds] : void 0,
      pricing: "pricing" in item && item.pricing ? SeedPricingBuilder.clonePricingConfig(item.pricing) : "pricing" in item ? item.pricing : void 0,
      policiesEnabled: item.policiesEnabled === true,
      policies: this.clonePolicies(item.policies) ?? void 0,
      slotsEnabled: "slotsEnabled" in item ? item.slotsEnabled : void 0,
      slotTemplates: "slotTemplates" in item ? this.cloneSlotTemplates(item.slotTemplates) ?? void 0 : void 0,
      topics: "topics" in item ? item.topics : void 0,
      subEventsEnabled: "subEventsEnabled" in item ? item.subEventsEnabled : void 0,
      subEventDefinitions: "subEventDefinitions" in item ? this.cloneSubEventDefinitions(item.subEventDefinitions) ?? void 0 : void 0,
      mode: "mode" in item ? item.mode : void 0,
      rating: "rating" in item ? item.rating : void 0,
      boost: "boost" in item ? item.boost : void 0,
      affinity: "affinity" in item ? item.affinity : void 0,
      generated: "generated" in item ? item.generated : void 0
    };
    if (Object.values(overrides).every((value) => value === void 0)) {
      return void 0;
    }
    return overrides;
  }
  static normalizeTopics(topics) {
    if (!Array.isArray(topics)) {
      return [];
    }
    return Array.from(new Set(topics.map((topic) => `${topic ?? ""}`.trim()).filter((topic) => topic.length > 0)));
  }
  static normalizeUserIds(userIds) {
    if (!Array.isArray(userIds)) {
      return [];
    }
    return Array.from(new Set(userIds.map((userId) => `${userId ?? ""}`.trim()).filter((userId) => userId.length > 0)));
  }
  static cloneSubEventDefinitions(items) {
    if (!Array.isArray(items)) {
      return void 0;
    }
    return items.map((item) => __spreadProps(__spreadValues({}, item), {
      pricing: item.pricing ? SeedPricingBuilder.clonePricingConfig(item.pricing) : item.pricing
    }));
  }
  static clonePolicies(items) {
    if (!Array.isArray(items)) {
      return void 0;
    }
    return items.map((item) => __spreadProps(__spreadValues({}, item), {
      subEventDefinitions: this.cloneSubEventDefinitions(item.subEventDefinitions) ?? item.subEventDefinitions
    }));
  }
  static rebaseSeedDateTime(value) {
    return AppUtils.rebaseDateTime(value, SEED_SCHEDULE_REFERENCE_DATE, environment.bootstrapOffsetInDays);
  }
  static normalizeGeneratedSeedDateTime(value) {
    const parsed = this.parseSeedDateTime(value);
    if (!parsed) {
      return void 0;
    }
    return AppUtils.toIsoDateTimeLocal(parsed);
  }
  static buildSeededTimeframeLabel(options) {
    const startAt = this.parseSeedDateTime(options.startAtIso);
    const endAt = this.parseSeedDateTime(options.endAtIso);
    if (!startAt || !endAt) {
      return `${options.hint ?? ""}`.trim() || "Date unavailable";
    }
    const frequency = `${options.frequency ?? this.parseFrequencyFromTimeframe(options.hint ?? "")}`.trim();
    const normalizedFrequency = frequency.toLowerCase();
    const hasMultipleSlots = (options.slotTemplates?.length ?? 0) > 1;
    const dateLabel = this.formatSeedMonthDay(startAt);
    const startTimeLabel = this.formatSeedTime(startAt);
    const endTimeLabel = this.formatSeedTime(endAt);
    if (normalizedFrequency === "weekly") {
      const weekdayLabel = startAt.toLocaleDateString("en-US", { weekday: "short" });
      return hasMultipleSlots ? `Every ${weekdayLabel} \xB7 ${this.formatSeedMonthDay(startAt)} - ${this.formatSeedMonthDay(endAt)}` : `Every ${weekdayLabel} \xB7 ${startTimeLabel}`;
    }
    if (normalizedFrequency === "bi-weekly" || normalizedFrequency === "biweekly") {
      const weekdayLabel = startAt.toLocaleDateString("en-US", { weekday: "short" });
      return `Every 2nd ${weekdayLabel} \xB7 ${startTimeLabel}`;
    }
    if (normalizedFrequency === "monthly") {
      return `Monthly \xB7 ${this.describeMonthlyOccurrence(startAt)} \xB7 ${startTimeLabel}`;
    }
    if (normalizedFrequency === "daily") {
      return `Daily \xB7 ${startTimeLabel}`;
    }
    if (normalizedFrequency === "yearly" || normalizedFrequency === "annual") {
      return `Yearly \xB7 ${this.formatSeedMonthDay(startAt)}`;
    }
    if (hasMultipleSlots) {
      return `${dateLabel} \xB7 multiple slots`;
    }
    if (endAt.getTime() - startAt.getTime() >= 24 * 60 * 60 * 1e3) {
      return `${this.formatSeedMonthDay(startAt)} - ${this.formatSeedMonthDay(endAt)}`;
    }
    return `${dateLabel} \xB7 ${startTimeLabel} - ${endTimeLabel}`;
  }
  static cloneRebasedSlotTemplates(items) {
    if (!Array.isArray(items)) {
      return void 0;
    }
    return items.map((item) => __spreadProps(__spreadValues({}, item), {
      startAt: this.rebaseSeedDateTime(item.startAt) ?? item.startAt,
      overrideDate: item.overrideDate ? this.rebaseSeedDateTime(item.overrideDate) ?? item.overrideDate : item.overrideDate,
      subEventDefinitions: this.cloneSubEventDefinitions(item.subEventDefinitions) ?? item.subEventDefinitions
    }));
  }
  static rebasePricingConfig(value) {
    const pricing = SeedPricingBuilder.clonePricingConfig(value);
    pricing.slotOverrides = (pricing.slotOverrides ?? []).map((item) => __spreadProps(__spreadValues({}, item), {
      startAt: this.rebaseSeedDateTime(item.startAt) ?? item.startAt,
      endAt: this.rebaseSeedDateTime(item.endAt) ?? item.endAt
    }));
    return pricing;
  }
  static cloneSlotTemplates(items) {
    if (!Array.isArray(items)) {
      return void 0;
    }
    return items.map((item) => __spreadValues({}, item));
  }
  static normalizeCount(value) {
    if (!Number.isFinite(value)) {
      return null;
    }
    return Math.max(0, Math.trunc(Number(value)));
  }
  static uniqueAffinityTokens(values) {
    const seen = /* @__PURE__ */ new Set();
    for (const value of values) {
      const normalized = AppUtils.normalizeText(`${value ?? ""}`.replace(/^#+\s*/, "").trim());
      if (normalized) {
        seen.add(normalized);
      }
    }
    return [...seen];
  }
  static resolveAffinityTokenScore(tokens, seedPrefix) {
    return tokens.reduce((total, token) => total + (AppUtils.hashText(`${seedPrefix}:${token}`) % 997 + 1), 0);
  }
  static parseFrequencyFromTimeframe(timeframe) {
    const normalized = timeframe.toLowerCase();
    if (normalized.includes("2nd") || normalized.includes("bi-weekly") || normalized.includes("biweekly")) {
      return "Bi-weekly";
    }
    if (normalized.includes("every")) {
      return "Weekly";
    }
    if (normalized.includes("monthly")) {
      return "Monthly";
    }
    if (normalized.includes("yearly") || normalized.includes("annual")) {
      return "Yearly";
    }
    if (normalized.includes("daily")) {
      return "Daily";
    }
    return "One-time";
  }
  static parseSeedDateTime(value) {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : new Date(value);
    }
    if (!value?.trim()) {
      return null;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  static formatSeedMonthDay(value) {
    return value.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  static formatSeedTime(value) {
    return value.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  static describeMonthlyOccurrence(value) {
    const weekday = value.toLocaleDateString("en-US", { weekday: "short" });
    const occurrence = Math.floor((value.getDate() - 1) / 7);
    const labels = ["First", "Second", "Third", "Fourth", "Fifth"];
    return `${labels[occurrence] ?? "Last"} ${weekday}`;
  }
  static cloneLocationCoordinates(value) {
    if (!value || !Number.isFinite(value.latitude) || !Number.isFinite(value.longitude)) {
      return null;
    }
    return {
      latitude: value.latitude,
      longitude: value.longitude
    };
  }
};

// src/app/shared/core/local/seed/builders/help-center-content-seed.builder.ts
var SeedHelpCenterContentBuilder = class {
  static explanationBootstrapContextKeys() {
    return APP_STATIC_DATA.explainableSurfaces.filter((surface) => surface.enabled).map((surface) => this.normalizeContextKey("explanation", surface.key, false)).filter((contextKey) => Boolean(contextKey));
  }
  static defaultRevision(kind, lang = "en", contextKey) {
    const language = this.normalizeLang(lang);
    const revisionsByLang = this.defaultRevisionsByLang(kind, contextKey);
    return this.cloneRevision(language === "hu" ? revisionsByLang.hu : revisionsByLang.en);
  }
  static documentLabel(kind) {
    switch (kind) {
      case "privacy":
        return "Privacy";
      case "terms":
        return "Terms";
      case "explanation":
        return "Explanation";
      default:
        return "Help";
    }
  }
  static defaultRevisionsByLang(kind, contextKey) {
    if (kind === "privacy") {
      return APP_STATIC_DATA.defaultPrivacyCenterRevisionsByLang;
    }
    if (kind === "terms") {
      return APP_STATIC_DATA.defaultTermsCenterRevisionsByLang;
    }
    if (kind === "explanation") {
      const context = this.normalizeContextKey(kind, contextKey, false) ?? "home.game";
      const revisionsByLang = APP_STATIC_DATA.defaultExplanationRevisionsByContext[context];
      if (!revisionsByLang) {
        throw new Error(`No default explanation revision exists for ${context}.`);
      }
      return revisionsByLang;
    }
    return APP_STATIC_DATA.defaultHelpCenterRevisionsByLang;
  }
  static cloneRevision(revision) {
    return __spreadProps(__spreadValues({}, revision), {
      sections: revision.sections.map((section) => __spreadValues({}, section))
    });
  }
  static normalizeContextKey(kind, contextKey, required) {
    if (kind !== "explanation") {
      return null;
    }
    const normalized = `${contextKey ?? ""}`.trim();
    const match = APP_STATIC_DATA.explainableSurfaces.find((surface) => surface.enabled && surface.key === normalized);
    if (match) {
      return match.key;
    }
    if (required) {
      throw new Error("A canonical explanation surface is required.");
    }
    return null;
  }
  static normalizeLang(lang) {
    const normalized = `${lang ?? ""}`.trim().toLowerCase().split("-")[0];
    return normalized === "hu" ? "hu" : "en";
  }
};

// src/app/shared/core/local/seed/builders/idea-posts-seed.builder.ts
var SeedIdeaPostsBuilder = class {
  static buildDefaultPosts() {
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const enPosts = [
      this.defaultPost({
        id: "idea-why-priority-matching",
        lang: "en",
        title: "How the 1\u201310 rating helps",
        excerpt: "A 1\u201310 rating signals interest and, together with other context, can support suggestions, event invitations, and grouping.",
        contentHtml: `
          <p>When you rate someone from 1 to 10, you signal how interested you are in meeting them. It is an early preference, not a promise or an automatic match. Mutual ratings can carry more weight, while profile details, distance, and recent activity can provide additional context.</p>
          <p>These signals can help order profile suggestions. For published events, they can also support invitations to open places or the grouping of accepted participants when those options are enabled. The rating alone does not create an event or a group chat.</p>
          <p>Feedback after taking part in an event is a separate step. It records the real event experience and can contribute to the impressions shown about a host or participant.</p>
        `,
        featured: true,
        submittedAtIso: this.rebaseSeedDateTime("2026-04-29T10:00:00.000Z"),
        nowIso
      }),
      this.defaultPost({
        id: "idea-social-first-dating",
        lang: "en",
        title: "Meet through a shared activity",
        excerpt: "An event or group conversation gives the first message a clear, shared topic.",
        contentHtml: `
          <p>Starting a private conversation with a stranger can feel awkward. An event gives the introduction a real topic, such as a walk, game night, sport session, or another small local activity.</p>
          <p>People can ask about the plan, time, and place instead of starting with an empty chat. When the event settings allow it, they can also see who is taking part before deciding whether to join.</p>
          <figure>
            <img src="@image_url" alt="People talking at a small shared activity">
            <figcaption>A shared plan makes it easier to start a conversation.</figcaption>
          </figure>
        `,
        featured: true,
        submittedAtIso: this.rebaseSeedDateTime("2026-04-24T12:30:00.000Z"),
        nowIso
      }),
      this.defaultPost({
        id: "idea-host-use-case",
        lang: "en",
        title: "Plan a small event in one place",
        excerpt: "Set the event details, capacity, visibility, and approval rules before people join.",
        contentHtml: `
          <p>Create an event with a description, date, place, and participant capacity. You can add topics or optional program parts so people know what is planned before they join.</p>
          <ul>
            <li>Choose public, friends-only, or invitation-only visibility.</li>
            <li>Decide whether joining requests need approval.</li>
            <li>Invite people directly or, when enabled, use automatic invitations for open places.</li>
          </ul>
          <p>The event keeps the main details in one place, so participants can check the same information before requesting a spot or accepting an invitation.</p>
        `,
        featured: true,
        submittedAtIso: this.rebaseSeedDateTime("2026-04-20T09:15:00.000Z"),
        nowIso
      }),
      this.defaultPost({
        id: "idea-trust-context",
        lang: "en",
        title: "More context before you meet",
        excerpt: "Profiles, event roles, related chats, and impressions help people understand who they are meeting.",
        contentHtml: `
          <p>A profile can show details that a person chooses to share. An event adds the plan and each member's role or participation, while its event or group chat keeps the conversation connected to that plan.</p>
          <p>After taking part, hosts and participants can give separate event feedback. It can contribute to the impressions shown about a host or member, providing useful context without guaranteeing how a future meeting will go.</p>
          <p>This information reduces guesswork, but everyone still decides for themselves whom they want to meet.</p>
        `,
        featured: true,
        submittedAtIso: this.rebaseSeedDateTime("2026-04-16T16:45:00.000Z"),
        nowIso
      }),
      this.defaultPost({
        id: "idea-register-value",
        lang: "en",
        title: "What you can do with an account",
        excerpt: "Create a profile, discover people and events, host plans, use chats, and give feedback after participating.",
        contentHtml: `
          <p>After registering, you can create a profile and choose its visibility. A public profile is needed to appear in profile suggestions and use the people-rating features.</p>
          <ul>
            <li>Discover and rate people, and explore available events.</li>
            <li>Request a place, accept invitations, or host and manage an event.</li>
            <li>Use event, group, and support chats, then give feedback after participating.</li>
          </ul>
          <p>Your account keeps your profile and activity available between visits, so you can return to your plans and conversations.</p>
        `,
        featured: false,
        submittedAtIso: this.rebaseSeedDateTime("2026-04-11T13:20:00.000Z"),
        nowIso
      })
    ];
    const huPosts = [
      this.defaultPost({
        id: "idea-why-priority-matching-hu",
        lang: "hu",
        title: "Hogyan seg\xEDt az 1\u201310-es \xE9rt\xE9kel\xE9s?",
        excerpt: "Az 1\u201310-es \xE9rt\xE9kel\xE9s \xE9rdekl\u0151d\xE9st jelez, \xE9s m\xE1s adatokkal egy\xFCtt seg\xEDtheti az aj\xE1nl\xE1st, az esem\xE9nymegh\xEDv\xE1st \xE9s a csoportos\xEDt\xE1st.",
        contentHtml: `
          <p>Amikor 1-t\u0151l 10-ig \xE9rt\xE9kelsz valakit, azt jelzed, mennyire sz\xEDvesen tal\xE1lkozn\xE1l vele. Ez egy el\u0151zetes \xE9rdekl\u0151d\xE9si jel, nem \xEDg\xE9ret \xE9s nem automatikus p\xE1ros\xEDt\xE1s. A k\xF6lcs\xF6n\xF6s \xE9rt\xE9kel\xE9s nagyobb s\xFAlyt kaphat, m\xEDg a profil adatai, a t\xE1vols\xE1g \xE9s a legut\xF3bbi aktivit\xE1s tov\xE1bbi h\xE1tteret adhatnak.</p>
          <p>Ezek a jelek seg\xEDthetik a profilaj\xE1nl\xE1sok sorrendj\xE9t. K\xF6zz\xE9tett esem\xE9nyekn\xE9l, ha a megfelel\u0151 lehet\u0151s\xE9g be van kapcsolva, az \xFCres helyekre sz\xF3l\xF3 megh\xEDv\xE1st vagy az elfogadott r\xE9sztvev\u0151k csoportos\xEDt\xE1s\xE1t is t\xE1mogathatj\xE1k. Az \xE9rt\xE9kel\xE9s \xF6nmag\xE1ban nem hoz l\xE9tre esem\xE9nyt vagy csoportos cseveg\xE9st.</p>
          <p>A t\xE9nyleges esem\xE9nyen val\xF3 r\xE9szv\xE9tel ut\xE1n k\xFCl\xF6n visszajelz\xE9s adhat\xF3. Ez a val\xF3s \xE9lm\xE9nyt r\xF6gz\xEDti, \xE9s hozz\xE1j\xE1rulhat a szervez\u0151r\u0151l vagy r\xE9sztvev\u0151r\u0151l megjelen\u0151 benyom\xE1sokhoz.</p>
        `,
        featured: true,
        submittedAtIso: this.rebaseSeedDateTime("2026-04-29T10:00:00.000Z"),
        nowIso
      }),
      this.defaultPost({
        id: "idea-social-first-dating-hu",
        lang: "hu",
        title: "Tal\xE1lkozzatok k\xF6z\xF6s programon kereszt\xFCl",
        excerpt: "Egy esem\xE9ny vagy csoportos cseveg\xE9s vil\xE1gos, k\xF6z\xF6s t\xE9m\xE1t ad az els\u0151 \xFCzenethez.",
        contentHtml: `
          <p>Egy idegennel neh\xE9z lehet szem\xE9lyes besz\xE9lget\xE9st kezdeni. Egy esem\xE9ny konkr\xE9t t\xE9m\xE1t ad a bemutatkoz\xE1shoz: lehet s\xE9ta, t\xE1rsasj\xE1t\xE9k, sport vagy m\xE1s kisebb helyi program.</p>
          <p>A r\xE9sztvev\u0151k az \xFCres cseveg\u0151ablak helyett a tervr\u0151l, az id\u0151pontr\xF3l \xE9s a helysz\xEDnr\u0151l k\xE9rdezhetnek. Ha az esem\xE9ny be\xE1ll\xEDt\xE1sai engedik, azt is l\xE1thatj\xE1k, kik vesznek r\xE9szt, miel\u0151tt csatlakoznak.</p>
        `,
        featured: true,
        submittedAtIso: this.rebaseSeedDateTime("2026-04-24T12:30:00.000Z"),
        nowIso
      }),
      this.defaultPost({
        id: "idea-host-use-case-hu",
        lang: "hu",
        title: "Szervezz kis esem\xE9nyt egy helyen",
        excerpt: "\xC1ll\xEDtsd be az esem\xE9ny r\xE9szleteit, l\xE9tsz\xE1m\xE1t, l\xE1that\xF3s\xE1g\xE1t \xE9s j\xF3v\xE1hagy\xE1si szab\xE1lyait a csatlakoz\xE1s el\u0151tt.",
        contentHtml: `
          <p>Hozz l\xE9tre esem\xE9nyt le\xEDr\xE1ssal, id\u0151ponttal, helysz\xEDnnel \xE9s l\xE9tsz\xE1mkorl\xE1ttal. T\xE9m\xE1kat vagy v\xE1laszthat\xF3 programelemeket is hozz\xE1adhatsz, hogy mindenki el\u0151re l\xE1ssa a tervet.</p>
          <ul>
            <li>V\xE1lassz nyilv\xE1nos, csak bar\xE1toknak sz\xF3l\xF3 vagy megh\xEDv\xE1sos l\xE1that\xF3s\xE1got.</li>
            <li>D\xF6ntsd el, hogy a jelentkez\xE9seket j\xF3v\xE1 kell-e hagyni.</li>
            <li>H\xEDvj meg embereket k\xF6zvetlen\xFCl, vagy bekapcsolt funkci\xF3 eset\xE9n haszn\xE1lj automatikus megh\xEDv\xE1st az \xFCres helyekre.</li>
          </ul>
          <p>Az esem\xE9ny egy helyen tartja a legfontosabb r\xE9szleteket, \xEDgy a r\xE9sztvev\u0151k ugyanazokat az inform\xE1ci\xF3kat l\xE1tj\xE1k jelentkez\xE9s vagy megh\xEDv\xE1s elfogad\xE1sa el\u0151tt.</p>
        `,
        featured: true,
        submittedAtIso: this.rebaseSeedDateTime("2026-04-20T09:15:00.000Z"),
        nowIso
      }),
      this.defaultPost({
        id: "idea-trust-context-hu",
        lang: "hu",
        title: "T\xF6bb h\xE1tt\xE9r a tal\xE1lkoz\xF3 el\u0151tt",
        excerpt: "A profil, az esem\xE9nyen bet\xF6lt\xF6tt szerep, a kapcsol\xF3d\xF3 cseveg\xE9s \xE9s a benyom\xE1sok seg\xEDtenek meg\xE9rteni, kivel tal\xE1lkozol.",
        contentHtml: `
          <p>A profil megmutathatja azokat az adatokat, amelyeket valaki megoszt mag\xE1r\xF3l. Az esem\xE9ny ehhez hozz\xE1adja a tervet, valamint a tag szerep\xE9t vagy r\xE9szv\xE9tel\xE9t, az esem\xE9ny- \xE9s csoportos cseveg\xE9s pedig a programhoz k\xF6ti a besz\xE9lget\xE9st.</p>
          <p>A t\xE9nyleges r\xE9szv\xE9tel ut\xE1n a szervez\u0151k \xE9s a r\xE9sztvev\u0151k k\xFCl\xF6n esem\xE9ny-visszajelz\xE9st adhatnak. Ez hozz\xE1j\xE1rulhat a szervez\u0151r\u0151l vagy tagr\xF3l megjelen\u0151 benyom\xE1sokhoz, de nem garant\xE1lja, hogyan alakul egy k\xE9s\u0151bbi tal\xE1lkoz\xF3.</p>
          <p>Ez a h\xE1tt\xE9r cs\xF6kkenti a bizonytalans\xE1got, de mindenki maga d\xF6nti el, kivel szeretne tal\xE1lkozni.</p>
        `,
        featured: true,
        submittedAtIso: this.rebaseSeedDateTime("2026-04-16T16:45:00.000Z"),
        nowIso
      }),
      this.defaultPost({
        id: "idea-register-value-hu",
        lang: "hu",
        title: "Mire haszn\xE1lhat\xF3 egy fi\xF3k?",
        excerpt: "Hozz l\xE9tre profilt, fedezz fel embereket \xE9s esem\xE9nyeket, szervezz programot, csevegj \xE9s adj visszajelz\xE9st a r\xE9szv\xE9tel ut\xE1n.",
        contentHtml: `
          <p>Regisztr\xE1ci\xF3 ut\xE1n l\xE9trehozhatod a profilodat, \xE9s be\xE1ll\xEDthatod a l\xE1that\xF3s\xE1g\xE1t. Nyilv\xE1nos profil sz\xFCks\xE9ges ahhoz, hogy megjelenj a profilaj\xE1nl\xE1sokban, \xE9s haszn\xE1ld az emberek \xE9rt\xE9kel\xE9s\xE9re szolg\xE1l\xF3 funkci\xF3kat.</p>
          <ul>
            <li>Fedezz fel \xE9s \xE9rt\xE9kelj embereket, valamint b\xF6ng\xE9ssz az el\xE9rhet\u0151 esem\xE9nyek k\xF6z\xF6tt.</li>
            <li>Jelentkezz esem\xE9nyre, fogadj el megh\xEDv\xE1st, vagy szervezz \xE9s kezelj saj\xE1t esem\xE9nyt.</li>
            <li>Haszn\xE1lj esem\xE9ny-, csoportos \xE9s t\xE1mogat\xE1si cseveg\xE9st, majd adj visszajelz\xE9st a r\xE9szv\xE9tel ut\xE1n.</li>
          </ul>
          <p>A fi\xF3kod meg\u0151rzi a profilodat \xE9s a tev\xE9kenys\xE9geidet, \xEDgy k\xE9s\u0151bb is visszat\xE9rhetsz a terveidhez \xE9s a besz\xE9lget\xE9seidhez.</p>
        `,
        featured: false,
        submittedAtIso: this.rebaseSeedDateTime("2026-04-11T13:20:00.000Z"),
        nowIso
      })
    ];
    return [...enPosts, ...huPosts];
  }
  static defaultPost(options) {
    const imageUrl = this.seedImageUrl(options.id);
    const contentHtml = this.normalizeHtml(options.contentHtml.replaceAll("@image_url", imageUrl));
    return {
      id: options.id,
      contentKey: this.contentKeyFromId(options.id),
      lang: this.normalizeLang(options.lang),
      languageLabel: this.languageLabel(options.lang),
      title: options.title,
      excerpt: options.excerpt,
      contentHtml: this.withPrimaryImage(contentHtml, imageUrl, options.title),
      imageUrl,
      imageUrls: [imageUrl],
      featured: options.featured,
      published: true,
      trashed: false,
      trashedAtIso: "",
      trashedByUserId: "",
      submittedAtIso: options.submittedAtIso,
      createdAtIso: options.nowIso,
      createdByUserId: "system",
      updatedAtIso: options.nowIso,
      updatedByUserId: "system"
    };
  }
  static withPrimaryImage(contentHtml, imageUrl, title) {
    if (contentHtml.includes(imageUrl)) {
      return contentHtml;
    }
    const alt = title.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    return `${contentHtml}
<figure><img src="${imageUrl}" alt="${alt}"></figure>`;
  }
  static rebaseSeedDateTime(value) {
    return AppUtils.rebaseDateTime(value, SEED_SCHEDULE_REFERENCE_DATE, environment.bootstrapOffsetInDays) ?? value;
  }
  static seedImageUrl(postId) {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(this.seedImageSvg(postId))}`;
  }
  static seedImageSvg(postId) {
    const palettes = [
      ["#eff6ff", "#6e8fc1", "#f1b66d", "#173456"],
      ["#f4fbf5", "#6aa98a", "#d9a652", "#1f3d34"],
      ["#fff7f0", "#c98256", "#7aa4c7", "#263b56"],
      ["#f7f2ff", "#8d78b8", "#e7b36d", "#21314c"],
      ["#f3f7f8", "#658aa3", "#d3a871", "#1d3442"]
    ];
    const [paper, cool, warm, ink] = palettes[Math.abs(this.hashText(postId)) % palettes.length];
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" role="img">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${paper}"/>
            <stop offset="0.56" stop-color="#ffffff"/>
            <stop offset="1" stop-color="${cool}"/>
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="24"/>
          </filter>
        </defs>
        <rect width="1200" height="700" fill="url(#sky)"/>
        <g filter="url(#soft)" opacity="0.78">
          <circle cx="240" cy="170" r="132" fill="${warm}"/>
          <circle cx="930" cy="190" r="150" fill="${cool}"/>
          <rect x="615" y="310" width="380" height="210" rx="34" fill="${warm}" opacity="0.45"/>
        </g>
        <rect x="0" y="475" width="1200" height="225" fill="#ffffff" opacity="0.62"/>
        <rect x="105" y="150" width="390" height="285" rx="28" fill="#ffffff" opacity="0.74"/>
        <rect x="145" y="192" width="310" height="22" rx="11" fill="${ink}" opacity="0.22"/>
        <rect x="145" y="238" width="260" height="18" rx="9" fill="${ink}" opacity="0.18"/>
        <rect x="145" y="284" width="185" height="18" rx="9" fill="${ink}" opacity="0.16"/>
        <circle cx="792" cy="285" r="54" fill="${cool}" opacity="0.7"/>
        <circle cx="910" cy="312" r="48" fill="${warm}" opacity="0.52"/>
        <circle cx="690" cy="322" r="42" fill="${ink}" opacity="0.48"/>
        <path d="M640 520c46-85 230-94 320 0" fill="${ink}" opacity="0.22"/>
        <path d="M112 550c145-42 295-44 454-2 162 43 332 42 520-6" fill="none" stroke="${ink}" stroke-width="18" opacity="0.18"/>
        <rect x="0" y="0" width="1200" height="700" fill="#0a1726" opacity="0.02"/>
      </svg>
    `.trim();
  }
  static hashText(value) {
    return value.split("").reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0);
  }
  static normalizeHtml(value) {
    return `${value ?? ""}`.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "").replace(/\s(?:href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\1/gi, "").trim();
  }
  static normalizeLang(lang) {
    const normalized = `${lang ?? ""}`.trim().toLowerCase().split("-")[0];
    return normalized === "hu" ? "hu" : "en";
  }
  static languageLabel(lang) {
    const normalized = this.normalizeLang(lang);
    return APP_STATIC_DATA.contentLanguages.find((language) => this.normalizeLang(language.lang) === normalized)?.label ?? (normalized === "hu" ? "Magyar" : "English");
  }
  static contentKeyFromId(id) {
    const normalized = `${id ?? ""}`.trim();
    return normalized.endsWith("-hu") ? normalized.slice(0, -3) : normalized;
  }
};

// src/app/shared/core/local/seed/builders/notification-seed.builder.ts
var SEED_REFERENCE_TIME_MS = Date.parse("2026-07-27T18:30:00.000Z");
var INVITATION_REFERENCE_TIME_MS = Date.parse("2026-07-30T12:35:00.000Z");
var UNREAD_SEED_COUNT = 24;
var SEED_NOTIFICATION_DEFINITIONS = [
  {
    kind: "contact-requested",
    category: "user",
    title: "New contact request",
    message: (sender) => `${sender} would like to connect with you.`,
    sourceType: "user",
    sourceId: "demo-contact-request",
    sender: true
  },
  {
    kind: "chat-message-received",
    category: "chat",
    title: "New message",
    message: (sender) => `${sender} sent you a message about the upcoming meetup.`,
    sourceType: "chat",
    sourceId: "demo-chat-meetup",
    sender: true
  },
  {
    kind: "event-time-changed",
    category: "event",
    title: "Event time changed",
    message: () => "The organizer moved Sunset Hike to 18:30. Your booking is still active.",
    sourceType: "event",
    sourceId: "demo-event-sunset-hike",
    sender: false
  },
  {
    kind: "event-member-approved",
    category: "event-admin",
    title: "Member approved",
    message: (sender) => `${sender} accepted your request to join Weekend Board Games.`,
    sourceType: "event",
    sourceId: "demo-event-board-games",
    sender: true
  },
  {
    kind: "asset-request-approved",
    category: "asset",
    title: "Transport approved",
    message: () => "Your transport request for Lakeside Picnic was approved.",
    sourceType: "asset",
    sourceId: "demo-asset-transport",
    sender: false
  },
  {
    kind: "random-groups-generated",
    category: "scheduled",
    title: "Random rooms generated",
    message: () => "The scheduled room generator completed and placed every accepted member.",
    sourceType: "event",
    sourceId: "demo-event-random-rooms",
    sender: false
  },
  {
    kind: "profile-review-completed",
    category: "app-admin",
    title: "Profile review completed",
    message: () => "MyScoutee support reviewed your recent profile update.",
    sourceType: "profile",
    sourceId: "recipient",
    sender: false
  },
  {
    kind: "event-reminder",
    category: "scheduled",
    title: "Event starts tomorrow",
    message: () => "Sunset Hike starts tomorrow at 18:30. Remember to check the meeting point.",
    sourceType: "event",
    sourceId: "demo-event-sunset-hike",
    sender: false
  },
  {
    kind: "asset-returned",
    category: "asset",
    title: "Supplies returned",
    message: (sender) => `${sender} marked your borrowed camping supplies as returned.`,
    sourceType: "asset",
    sourceId: "demo-asset-supplies",
    sender: true
  },
  {
    kind: "event-published",
    category: "event-admin",
    title: "Event published",
    message: () => "Your event is now visible to eligible members.",
    sourceType: "event",
    sourceId: "demo-event-published",
    sender: false
  },
  {
    kind: "contact-accepted",
    category: "user",
    title: "Contact accepted",
    message: (sender) => `${sender} accepted your contact request.`,
    sourceType: "user",
    sourceId: "demo-contact-accepted",
    sender: true
  },
  {
    kind: "chat-mentioned",
    category: "chat",
    title: "You were mentioned",
    message: (sender) => `${sender} mentioned you in Weekend Board Games.`,
    sourceType: "chat",
    sourceId: "demo-chat-board-games",
    sender: true
  },
  {
    kind: "scheduled-maintenance",
    category: "app-admin",
    title: "Scheduled maintenance",
    message: () => "A short maintenance window is planned for early tomorrow morning.",
    sourceType: "application",
    sourceId: "maintenance",
    sender: false
  },
  {
    kind: "event-feedback-ready",
    category: "event",
    title: "Feedback is ready",
    message: () => "You can now leave feedback for Lakeside Picnic.",
    sourceType: "event",
    sourceId: "demo-event-lakeside-picnic",
    sender: false
  },
  {
    kind: "event-location-changed",
    category: "event",
    title: "Meeting point updated",
    message: () => "City Photo Walk now meets at the north entrance of the station.",
    sourceType: "event",
    sourceId: "demo-event-photo-walk",
    sender: false
  },
  {
    kind: "asset-requested",
    category: "asset",
    title: "New asset request",
    message: (sender) => `${sender} requested one seat in your car for Alpine Weekend.`,
    sourceType: "asset",
    sourceId: "demo-asset-car",
    sender: true
  },
  {
    kind: "event-member-cancelled",
    category: "event-admin",
    title: "Member cancelled",
    message: (sender) => `${sender} cancelled their place at Creative Coffee Morning.`,
    sourceType: "event",
    sourceId: "demo-event-coffee",
    sender: true
  },
  {
    kind: "chat-reply-received",
    category: "chat",
    title: "New reply",
    message: (sender) => `${sender} replied to your transport question.`,
    sourceType: "chat",
    sourceId: "demo-chat-transport",
    sender: true
  },
  {
    kind: "contact-profile-updated",
    category: "user",
    title: "Contact profile updated",
    message: (sender) => `${sender} added new interests that match yours.`,
    sourceType: "user",
    sourceId: "demo-contact-profile",
    sender: true
  },
  {
    kind: "event-cancelled",
    category: "event",
    title: "Event cancelled",
    message: () => "Sunday Kayaking was cancelled by the organizer.",
    sourceType: "event",
    sourceId: "demo-event-kayaking",
    sender: false
  },
  {
    kind: "asset-request-declined",
    category: "asset",
    title: "Asset request declined",
    message: () => "The tent request for Forest Camp could not be accepted.",
    sourceType: "asset",
    sourceId: "demo-asset-tent",
    sender: false
  },
  {
    kind: "event-capacity-warning",
    category: "event-admin",
    title: "Event is nearly full",
    message: () => "Weekend Board Games has one remaining participant place.",
    sourceType: "event",
    sourceId: "demo-event-board-games",
    sender: false
  },
  {
    kind: "scheduled-event-check-in",
    category: "scheduled",
    title: "Check-in is open",
    message: () => "Check-in for Sunset Hike is now open.",
    sourceType: "event",
    sourceId: "demo-event-sunset-hike",
    sender: false
  },
  {
    kind: "admin-security-notice",
    category: "app-admin",
    title: "Security notice",
    message: () => "A new sign-in was confirmed for your demo account.",
    sourceType: "application",
    sourceId: "security",
    sender: false
  },
  {
    kind: "chat-poll-closed",
    category: "chat",
    title: "Chat poll closed",
    message: () => "The Weekend Board Games time poll has closed.",
    sourceType: "chat",
    sourceId: "demo-chat-board-games",
    sender: false
  },
  {
    kind: "event-waitlist-promoted",
    category: "event",
    title: "You have a place",
    message: () => "A place opened at Rooftop Yoga and your booking is now confirmed.",
    sourceType: "event",
    sourceId: "demo-event-yoga",
    sender: false
  },
  {
    kind: "asset-handover-reminder",
    category: "scheduled",
    title: "Asset handover reminder",
    message: () => "Your camping stove handover is scheduled for tomorrow at 09:00.",
    sourceType: "asset",
    sourceId: "demo-asset-stove",
    sender: false
  },
  {
    kind: "event-cohost-added",
    category: "event-admin",
    title: "Co-host added",
    message: (sender) => `${sender} accepted the co-host role for Creative Coffee Morning.`,
    sourceType: "event",
    sourceId: "demo-event-coffee",
    sender: true
  },
  {
    kind: "contact-birthday",
    category: "user",
    title: "A contact has a birthday",
    message: (sender) => `${sender} has a birthday today.`,
    sourceType: "user",
    sourceId: "demo-contact-birthday",
    sender: true
  },
  {
    kind: "asset-capacity-changed",
    category: "asset",
    title: "Transport capacity changed",
    message: () => "Two more seats are available for Alpine Weekend.",
    sourceType: "asset",
    sourceId: "demo-asset-car",
    sender: false
  },
  {
    kind: "admin-policy-update",
    category: "app-admin",
    title: "Community guidelines updated",
    message: () => "The community guidelines have a short new section about shared assets.",
    sourceType: "application",
    sourceId: "community-guidelines",
    sender: false
  },
  {
    kind: "scheduled-weekly-summary",
    category: "scheduled",
    title: "Your weekly summary",
    message: () => "You joined two events and met four new people this week.",
    sourceType: "profile",
    sourceId: "recipient",
    sender: false
  }
];
var SeedNotificationsBuilder = class {
  static unreadCount = UNREAD_SEED_COUNT;
  static buildForUser(recipientUserId, users) {
    const normalizedRecipientUserId = recipientUserId.trim();
    if (!normalizedRecipientUserId) {
      return [];
    }
    const senders = users.filter((user) => user.id.trim() && user.id !== normalizedRecipientUserId && user.admin !== true);
    const invitations = SeedEventsBuilder.buildSeedInvitationItemsByUser()[normalizedRecipientUserId] ?? [];
    const invitationRecords = invitations.map((invitation, index) => this.buildInvitationNotification(normalizedRecipientUserId, invitation, users, index));
    const generalRecords = SEED_NOTIFICATION_DEFINITIONS.map((definition, index) => {
      const sender = definition.sender && senders.length > 0 ? senders[index % senders.length] : null;
      const senderName = sender?.name?.trim() || "A community member";
      const createdAtMs = SEED_REFERENCE_TIME_MS - index * 27 * 6e4;
      const sourceId = definition.sourceId === "recipient" ? normalizedRecipientUserId : definition.sourceId;
      return {
        id: `${normalizedRecipientUserId}:notification-demo-v2:${String(index + 1).padStart(2, "0")}`,
        recipientUserId: normalizedRecipientUserId,
        kind: definition.kind,
        category: definition.category,
        title: definition.title,
        message: definition.message(senderName),
        createdAtIso: new Date(createdAtMs).toISOString(),
        readAtIso: index < UNREAD_SEED_COUNT ? null : new Date(createdAtMs + 12 * 6e4).toISOString(),
        senderUserId: sender?.id ?? null,
        senderName: sender?.name?.trim() || null,
        senderAvatarUrl: sender?.images?.[0]?.trim() || null,
        actionPath: "/game",
        sourceType: definition.sourceType,
        sourceId,
        payload: {
          demo: "true",
          seedVersion: "2"
        }
      };
    });
    return [...invitationRecords, ...generalRecords];
  }
  static buildInvitationNotification(recipientUserId, invitation, users, index) {
    const inviterName = invitation.inviter.trim() || "An event organizer";
    const sender = this.resolveInvitationSender(invitation, users, recipientUserId);
    const eventTitle = invitation.description.trim() || "Event invitation";
    const createdAtMs = INVITATION_REFERENCE_TIME_MS - index * 15 * 6e4;
    return {
      id: `${recipientUserId}:notification-event-invite:${invitation.id}`,
      recipientUserId,
      kind: "event-invite",
      category: "event",
      title: eventTitle,
      message: "Event invitation",
      createdAtIso: new Date(createdAtMs).toISOString(),
      readAtIso: invitation.unread > 0 ? null : new Date(createdAtMs + 12 * 6e4).toISOString(),
      senderUserId: sender?.id ?? (invitation.creatorUserId?.trim() || null),
      senderName: sender?.name?.trim() || inviterName,
      senderAvatarUrl: sender?.images?.[0]?.trim() || null,
      actionPath: "/game",
      sourceType: "event",
      sourceId: invitation.id,
      payload: __spreadValues({
        demo: "true",
        seedVersion: "3",
        eventId: invitation.id,
        eventTitle,
        eventScope: "invitations"
      }, sender?.id ? { senderUserId: sender.id } : {})
    };
  }
  static resolveInvitationSender(invitation, users, recipientUserId) {
    const explicitCreatorUserId = invitation.creatorUserId?.trim() || "";
    if (explicitCreatorUserId) {
      return users.find((user) => user.id === explicitCreatorUserId) ?? null;
    }
    const normalizedInviter = invitation.inviter.trim().toLocaleLowerCase();
    if (!normalizedInviter) {
      return null;
    }
    return users.find((user) => {
      if (!user.id.trim() || user.id === recipientUserId || user.admin === true) {
        return false;
      }
      const normalizedName = user.name.trim().toLocaleLowerCase();
      const firstName = normalizedName.split(/\s+/)[0] ?? "";
      return normalizedName === normalizedInviter || firstName === normalizedInviter;
    }) ?? null;
  }
};

// src/app/shared/core/local/seed/builders/profile-experience-seed.builder.ts
var ALEX_TURNER_DEMO_USER_ID = "u20";
var ALEX_TURNER_EXPERIENCE_ENTRIES = [
  {
    id: "alex-turner-school-portland-state",
    type: "School",
    title: "BA Community Management",
    org: "Portland State University",
    city: "Portland",
    dateFrom: "2013-09",
    dateTo: "2017-06",
    description: "Studied community programs, group facilitation, and nonprofit operations."
  },
  {
    id: "alex-turner-work-bridge-beam",
    type: "Workspace",
    title: "Event Operations Coordinator",
    org: "Bridge & Beam Studio",
    city: "Portland",
    dateFrom: "2018-01",
    dateTo: "2021-04",
    description: "Coordinated small-format cultural events, vendor timing, and member follow-up."
  },
  {
    id: "alex-turner-project-supper-club",
    type: "Additional Project",
    title: "Neighborhood Supper Club",
    org: "Independent Project",
    city: "Portland",
    dateFrom: "2021-06",
    dateTo: "Present",
    description: "Runs rotating food, books, and theatre meetups with curated guest lists."
  }
];
var SeedProfileExperienceBuilder = class {
  static buildSeededExperiencesByUserId() {
    return {
      [ALEX_TURNER_DEMO_USER_ID]: this.cloneEntries(ALEX_TURNER_EXPERIENCE_ENTRIES)
    };
  }
  static cloneEntries(entries) {
    return entries.map((entry) => __spreadValues({}, entry));
  }
};

// src/app/shared/core/local/seed/builders/user-impressions-seed.builder.ts
var SeedUserImpressionsBuilder = class {
  static personalityTraitCatalog = APP_STATIC_DATA.personalityTraitCatalog;
  static withSeededImpressions(user) {
    if (!this.hasImpressionActivity(user) && !this.hasImpressionsData(user.impressions)) {
      return __spreadProps(__spreadValues({}, user), {
        impressions: void 0
      });
    }
    const defaults = this.buildDefaultImpressions(user);
    const current = user.impressions ?? {};
    return __spreadProps(__spreadValues({}, user), {
      impressions: {
        host: this.mergeImpressionsSection(defaults.host, current.host),
        member: this.mergeImpressionsSection(defaults.member, current.member)
      }
    });
  }
  static hasImpressionsData(impressions) {
    return this.hasImpressionsSectionData(impressions?.host) || this.hasImpressionsSectionData(impressions?.member);
  }
  static hasImpressionActivity(user) {
    const activities = user.activities ?? {};
    return [
      activities.chats,
      activities.invitations,
      activities.events,
      activities.hosting,
      activities.tickets,
      activities.feedback
    ].some((value) => Number.isFinite(value) && Math.trunc(Number(value)) > 0);
  }
  static hasImpressionsSectionData(section) {
    if (!section) {
      return false;
    }
    const hasPositiveMetric = [
      section.averageRating,
      section.peopleMet,
      section.totalEvents,
      section.repeatCount,
      section.noShowCount
    ].some((value) => Number.isFinite(value) && Number(value) > 0);
    const hasBadges = [
      section.vibeBadges,
      section.personalityBadges,
      section.categoryBadges
    ].some((items) => (items ?? []).some((item) => item.trim().length > 0));
    const hasTraits = (section.personalityTraits ?? []).some((trait) => `${trait.id ?? trait.label ?? ""}`.trim().length > 0 && (Number.isFinite(trait.percent) && Number(trait.percent) > 0 || Number.isFinite(trait.evidenceCount) && Number(trait.evidenceCount) > 0));
    return hasPositiveMetric || hasBadges || hasTraits;
  }
  static seededMetric(user, offset, min, max) {
    const source = `${user.id}-${user.name}-${user.city}-${offset}`;
    let hash = 0;
    for (let index = 0; index < source.length; index += 1) {
      hash = hash * 31 + source.charCodeAt(index) >>> 0;
    }
    return min + hash % (max - min + 1);
  }
  static buildDefaultImpressions(user) {
    const hostTotalEvents = this.seededMetric(user, 9, 12, 80);
    const hostAttendanceTotal = hostTotalEvents * this.seededMetric(user, 18, 8, 14);
    const hostAttendanceAttended = Math.floor(hostAttendanceTotal * (this.seededMetric(user, 2, 74, 96) / 100));
    const hostNoShowCount = Math.max(0, hostAttendanceTotal - hostAttendanceAttended);
    const hostPeopleMet = this.seededMetric(user, 32, 90, 520);
    const hostRepeatCount = Math.floor(this.seededMetric(user, 19, 60, 220) * (this.seededMetric(user, 4, 36, 84) / 100));
    const memberTotalEvents = hostTotalEvents;
    const memberPeopleMet = this.seededMetric(user, 24, 80, 460);
    const memberAttendanceTotal = 100;
    const memberAttendanceAttended = this.seededMetric(user, 23, 4, 96);
    const memberNoShowCount = Math.max(0, memberAttendanceTotal - memberAttendanceAttended);
    const memberRepeatCount = Math.floor(memberPeopleMet * (this.seededMetric(user, 33, 18, 72) / 100));
    return {
      host: {
        unreadCount: Math.max(0, Math.trunc((user.activities.hosting + user.activities.events) / 2)),
        averageRating: this.seededMetric(user, 1, 38, 50) / 10,
        peopleMet: hostPeopleMet,
        totalEvents: hostTotalEvents,
        repeatCount: hostRepeatCount,
        noShowCount: hostNoShowCount,
        vibeBadges: [`Music ${this.seededMetric(user, 20, 18, 86)}%`],
        personalityTraits: this.buildSeededTraitList(user, "host"),
        personalityBadges: this.toPersonalityBadges(this.buildSeededTraitList(user, "host")),
        categoryBadges: [
          `Sports ${this.seededMetric(user, 21, 8, 48)}%`,
          `Road Trip ${this.seededMetric(user, 22, 6, 36)}%`
        ]
      },
      member: {
        unreadCount: Math.max(0, Math.trunc((user.activities.game + user.activities.chats + user.activities.invitations) / 3)),
        peopleMet: memberPeopleMet,
        totalEvents: memberTotalEvents,
        repeatCount: memberRepeatCount,
        noShowCount: memberNoShowCount,
        vibeBadges: [
          `Outdoors ${this.seededMetric(user, 29, 40, 95)}%`,
          `Games ${this.seededMetric(user, 30, 35, 95)}%`
        ],
        personalityTraits: this.buildSeededTraitList(user, "member"),
        personalityBadges: this.toPersonalityBadges(this.buildSeededTraitList(user, "member")),
        categoryBadges: [`Culture ${this.seededMetric(user, 31, 25, 90)}%`]
      }
    };
  }
  static mergeImpressionsSection(defaults, incoming) {
    if (!defaults && !incoming) {
      return void 0;
    }
    const next = __spreadValues(__spreadValues({}, defaults ?? {}), incoming ?? {});
    next.vibeBadges = [...incoming?.vibeBadges ?? defaults?.vibeBadges ?? []];
    next.personalityBadges = [...incoming?.personalityBadges ?? defaults?.personalityBadges ?? []];
    next.personalityTraits = (incoming?.personalityTraits ?? defaults?.personalityTraits ?? []).map((trait) => __spreadValues({}, trait));
    next.categoryBadges = [...incoming?.categoryBadges ?? defaults?.categoryBadges ?? []];
    return next;
  }
  static buildSeededTraitList(user, scope) {
    const baseScores = /* @__PURE__ */ new Map();
    for (const trait of this.personalityTraitCatalog) {
      baseScores.set(trait.id, 3);
    }
    const dominantTraitId = this.resolveTraitId(user.traitLabel) ?? this.personalityTraitCatalog[0]?.id ?? "social-charmer";
    const dominantIndex = Math.max(0, this.personalityTraitCatalog.findIndex((trait) => trait.id === dominantTraitId));
    const scopeOffset = scope === "host" ? 37 : 61;
    const secondaryIndex = (dominantIndex + 2 + this.seededMetric(user, scopeOffset, 0, 1)) % this.personalityTraitCatalog.length;
    const tertiaryIndex = (dominantIndex + 5 + this.seededMetric(user, scopeOffset + 1, 0, 2)) % this.personalityTraitCatalog.length;
    baseScores.set(dominantTraitId, (baseScores.get(dominantTraitId) ?? 0) + (scope === "host" ? 34 : 42));
    baseScores.set(this.personalityTraitCatalog[secondaryIndex]?.id ?? dominantTraitId, (baseScores.get(this.personalityTraitCatalog[secondaryIndex]?.id ?? dominantTraitId) ?? 0) + 18);
    baseScores.set(this.personalityTraitCatalog[tertiaryIndex]?.id ?? dominantTraitId, (baseScores.get(this.personalityTraitCatalog[tertiaryIndex]?.id ?? dominantTraitId) ?? 0) + 10);
    return this.toTraitList(user, scope, baseScores);
  }
  static toTraitList(user, scope, scores) {
    const ordered = this.personalityTraitCatalog.map((trait) => ({ trait, score: scores.get(trait.id) ?? 0 })).sort((left, right) => right.score - left.score || left.trait.label.localeCompare(right.trait.label));
    const total = ordered.reduce((sum, entry) => sum + entry.score, 0);
    const percents = ordered.map((entry) => Math.max(1, Math.round(entry.score * 100 / Math.max(1, total))));
    const delta = 100 - percents.reduce((sum, value) => sum + value, 0);
    if (percents.length > 0 && delta !== 0) {
      percents[0] = Math.max(1, percents[0] + delta);
    }
    return ordered.map((entry, index) => ({
      id: entry.trait.id,
      label: entry.trait.label,
      percent: percents[index],
      evidenceCount: this.seededMetric(user, 90 + index + (scope === "host" ? 0 : 13), 2, 12),
      lastRatedAtIso: AppUtils.shiftDate(new Date(Date.UTC(2026, 2, this.seededMetric(user, 120 + index + (scope === "host" ? 0 : 13), 1, 24), 12, 0, 0)), SEED_SCHEDULE_REFERENCE_DATE, environment.bootstrapOffsetInDays).toISOString()
    }));
  }
  static toPersonalityBadges(traits) {
    if (!Array.isArray(traits) || traits.length === 0) {
      return void 0;
    }
    return [...traits].sort((left, right) => (Number(right.percent) || 0) - (Number(left.percent) || 0) || left.label.localeCompare(right.label)).slice(0, 3).map((trait) => `${trait.label} ${Math.max(0, Math.trunc(Number(trait.percent) || 0))}%`);
  }
  static resolveTraitId(label) {
    const normalized = `${label ?? ""}`.trim().toLowerCase();
    if (!normalized) {
      return null;
    }
    const direct = this.personalityTraitCatalog.find((trait) => trait.id === normalized || trait.label.toLowerCase() === normalized || trait.aliases.some((alias) => alias.toLowerCase() === normalized));
    if (direct) {
      return direct.id;
    }
    const byWordTail = this.personalityTraitCatalog.find((trait) => normalized.endsWith(trait.label.toLowerCase()) || trait.aliases.some((alias) => normalized.endsWith(alias.toLowerCase())));
    return byWordTail?.id ?? null;
  }
};

// src/app/shared/core/local/seed/builders/user-rates-seed.builder.ts
var SeedUserRatesBuilder = class _SeedUserRatesBuilder {
  static DEFAULT_EXTRA_SINGLE_GIVEN_COUNT = 0;
  static DEFAULT_USER_COVERAGE_RATIO = 1;
  static buildGeneratedRateItemsForUser(users, activeUserId, options = {}) {
    const otherUsers = users.filter((user) => user.id !== activeUserId).sort((a, b) => a.id.localeCompare(b.id));
    const seededUsers = this.selectSeedUsers(otherUsers, activeUserId, options.userCoverageRatio);
    const seededUserIds = new Set(seededUsers.map((user) => user.id));
    const extraTargetUsers = otherUsers.filter((user) => !seededUserIds.has(user.id)).sort((left, right) => AppUtils.hashText(`rate-extra-seed:${activeUserId}:${left.id}`) - AppUtils.hashText(`rate-extra-seed:${activeUserId}:${right.id}`) || left.id.localeCompare(right.id));
    const extraUsers = extraTargetUsers.length > 0 ? extraTargetUsers : seededUsers;
    const filterLanes = [
      { mode: "individual", direction: "given" },
      { mode: "individual", direction: "received" },
      { mode: "individual", direction: "mutual" },
      { mode: "individual", direction: "met" },
      { mode: "pair", direction: "given" },
      { mode: "pair", direction: "received" }
    ];
    const generated = [];
    seededUsers.forEach((user, userIndex) => {
      const laneIndex = userIndex % filterLanes.length;
      const lane = filterLanes[laneIndex];
      let secondaryUserId;
      if (lane.mode === "pair") {
        secondaryUserId = lane.direction === "received" ? activeUserId : this.selectPairSecondaryUserId(otherUsers, user.id, userIndex, laneIndex);
      }
      generated.push(this.buildGeneratedRateItemForLane(activeUserId, user.id, lane.mode, lane.direction, laneIndex, userIndex, 0, secondaryUserId));
    });
    const extraSingleGivenCount = Math.max(0, Math.trunc(options.extraSingleGivenCount ?? _SeedUserRatesBuilder.DEFAULT_EXTRA_SINGLE_GIVEN_COUNT));
    for (let extraIndex = 0; extraIndex < extraSingleGivenCount; extraIndex += 1) {
      const targetUser = extraUsers[extraIndex % extraUsers.length];
      if (!targetUser) {
        break;
      }
      generated.push(this.buildGeneratedRateItemForLane(activeUserId, targetUser.id, "individual", "given", 0, seededUsers.length + extraIndex, extraIndex + 1));
    }
    const socialTargetUsers = extraUsers.length > 0 ? extraUsers : seededUsers;
    const socialLanes = [
      { direction: "given", variantIndex: 701 },
      { direction: "met", variantIndex: 702 }
    ];
    for (const lane of socialLanes) {
      const targetUser = socialTargetUsers[(lane.variantIndex + socialTargetUsers.length) % socialTargetUsers.length];
      if (!targetUser) {
        continue;
      }
      const bridgeUserId = this.selectSocialBridgeUserId(otherUsers, targetUser.id, lane.variantIndex);
      const item = this.buildGeneratedRateItemForLane(activeUserId, targetUser.id, "individual", lane.direction, lane.direction === "met" ? 3 : 0, seededUsers.length + lane.variantIndex, lane.variantIndex, void 0, "friends-in-common", bridgeUserId, 1 + AppUtils.hashText(`rate-social-bridge-count:${activeUserId}:${targetUser.id}:${lane.direction}`) % 3);
      generated.push(__spreadProps(__spreadValues({}, item), {
        scoreReceived: lane.direction === "given" ? 0 : item.scoreReceived
      }));
    }
    return generated;
  }
  static buildActivityRateSeedRecords(users, options = {}) {
    return users.flatMap((user) => this.buildGeneratedRateItemsForUser(users, user.id, options).map((item) => LocalUserRatesMapper.toRecord(user.id, item)));
  }
  static buildGeneratedRateItemForLane(activeUserId, targetUserId, mode, direction, laneIndex, userIndex, variantIndex = 0, secondaryUserId, socialContextOverride, bridgeUserId, bridgeCount) {
    const seed = AppUtils.hashText(`rate-grid:${activeUserId}:${targetUserId}:${secondaryUserId ?? ""}:${mode}:${direction}:${variantIndex}`);
    const happenedAtDate = AppUtils.shiftDate(/* @__PURE__ */ new Date("2026-03-01T20:00:00"), SEED_SCHEDULE_REFERENCE_DATE, environment.bootstrapOffsetInDays);
    happenedAtDate.setDate(happenedAtDate.getDate() - (laneIndex * 17 + userIndex + 1 + variantIndex * 2));
    const happenedAt = AppUtils.toIsoDateTime(happenedAtDate);
    let scoreGiven = 0;
    let scoreReceived = 0;
    if (direction === "given") {
      scoreGiven = 4 + seed % 7;
      scoreReceived = seed % 2 === 0 ? 4 + (seed + 2) % 7 : 0;
    } else if (direction === "received") {
      scoreGiven = 0;
      scoreReceived = 4 + (seed + 3) % 7;
    } else if (direction === "mutual") {
      scoreGiven = 4 + seed % 7;
      scoreReceived = 4 + (seed + 5) % 7;
    } else if (direction === "met") {
      scoreGiven = 4 + seed % 7;
      scoreReceived = 0;
    }
    const distanceMetersExact = (2 + (seed + laneIndex + userIndex) % 33) * 1e3 + Math.abs(seed % 1e3);
    const socialContext = socialContextOverride ?? (mode === "individual" && direction !== "met" && seed % 4 === 0 ? "friends-in-common" : mode === "pair" && seed % 3 === 0 ? "separated-friends" : void 0);
    return __spreadProps(__spreadValues(__spreadValues(__spreadValues(__spreadProps(__spreadValues({
      id: this.createRateId(),
      userId: targetUserId
    }, secondaryUserId ? { secondaryUserId } : {}), {
      mode,
      direction
    }), socialContext ? { socialContext } : {}), bridgeUserId ? { bridgeUserId } : {}), Number.isFinite(bridgeCount) ? { bridgeCount: Math.max(1, Math.trunc(Number(bridgeCount))) } : {}), {
      scoreGiven,
      scoreReceived,
      eventName: variantIndex > 0 ? `${mode === "pair" ? "Pair" : "Single"} ${direction} ${variantIndex + 1}` : `${mode === "pair" ? "Pair" : "Single"} ${direction}`,
      happenedAt,
      distanceMetersExact
    });
  }
  static createRateId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `rate-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
  static selectPairSecondaryUserId(users, primaryUserId, userIndex, laneIndex) {
    const primaryUser = users.find((user) => user.id === primaryUserId) ?? null;
    const preferredCandidates = users.filter((user) => user.id !== primaryUserId && (!!primaryUser?.gender ? user.gender === this.oppositeGender(primaryUser.gender) : true));
    const fallbackCandidates = users.filter((user) => user.id !== primaryUserId);
    const pool = preferredCandidates.length > 0 ? preferredCandidates : fallbackCandidates;
    if (pool.length === 0) {
      return void 0;
    }
    const index = (userIndex + laneIndex + 1) % pool.length;
    return pool[index]?.id;
  }
  static selectSocialBridgeUserId(users, targetUserId, variantIndex) {
    const candidates = users.filter((user) => user.id !== targetUserId).sort((left, right) => AppUtils.hashText(`rate-social-bridge:${targetUserId}:${variantIndex}:${left.id}`) - AppUtils.hashText(`rate-social-bridge:${targetUserId}:${variantIndex}:${right.id}`) || left.id.localeCompare(right.id));
    return candidates[0]?.id;
  }
  static oppositeGender(gender) {
    return gender === "woman" ? "man" : "woman";
  }
  static selectSeedUsers(users, activeUserId, requestedCoverageRatio) {
    const coverageRatio = this.normalizeCoverageRatio(requestedCoverageRatio);
    if (coverageRatio >= 1 || users.length <= 1) {
      return [...users];
    }
    if (coverageRatio <= 0 || users.length === 0) {
      return [];
    }
    const targetCount = Math.max(1, Math.round(users.length * coverageRatio));
    return [...users].map((user) => ({
      user,
      seed: AppUtils.hashText(`rate-seed-coverage:${activeUserId}:${user.id}`)
    })).sort((left, right) => left.seed - right.seed || left.user.id.localeCompare(right.user.id)).slice(0, targetCount).map((entry) => entry.user).sort((left, right) => left.id.localeCompare(right.id));
  }
  static normalizeCoverageRatio(value) {
    if (!Number.isFinite(value)) {
      return _SeedUserRatesBuilder.DEFAULT_USER_COVERAGE_RATIO;
    }
    return Math.max(0, Math.min(1, Number(value)));
  }
};

// src/app/shared/core/local/seed/repositories/help-center-seed.repository.ts
var SeedHelpCenterRepository = class _SeedHelpCenterRepository {
  memoryDb = inject(LocalMemoryDb);
  async seedDefaults() {
    await this.memoryDb.whenReady();
    let changed = false;
    for (const option of this.availableLanguages()) {
      const language = option.lang;
      changed = this.ensureSeeded("help", language) || changed;
      changed = this.ensureSeeded("privacy", language) || changed;
      changed = this.ensureSeeded("terms", language) || changed;
      for (const contextKey of SeedHelpCenterContentBuilder.explanationBootstrapContextKeys()) {
        changed = this.ensureSeeded("explanation", language, contextKey) || changed;
      }
    }
    if (changed) {
      await this.memoryDb.flushToIndexedDb();
    }
    return changed;
  }
  ensureSeeded(kind, lang = "en", contextKey) {
    const table = this.memoryDb.read()[HELP_CENTER_TABLE_NAME];
    const language = this.normalizeLang(lang);
    const context = this.normalizeContextKey(kind, contextKey);
    const existingRevisions = this.revisionsForKind(table, kind, language, context);
    if (existingRevisions.length > 0) {
      return this.ensureActiveRevision(table, kind, language, context, existingRevisions);
    }
    const revision = this.cloneRevision(SeedHelpCenterContentBuilder.defaultRevision(kind, language, context), kind);
    const revisionContextKey = this.revisionContextKey(revision);
    const audit = this.auditEntry({
      action: "seed",
      actorUserId: "system",
      revision,
      message: `Seeded default ${SeedHelpCenterContentBuilder.documentLabel(kind).toLowerCase()} revision v${revision.version}.`
    });
    this.memoryDb.write((state) => {
      const current = state[HELP_CENTER_TABLE_NAME];
      return __spreadProps(__spreadValues({}, state), {
        [HELP_CENTER_TABLE_NAME]: __spreadProps(__spreadValues({}, current), {
          seeded: current.seeded || kind === "help",
          seededKinds: __spreadProps(__spreadValues({}, current.seededKinds ?? {}), { [kind]: true }),
          activeRevisionId: kind === "help" && language === "en" ? revision.id : current.activeRevisionId,
          activeRevisionIdsByKind: __spreadProps(__spreadValues({}, current.activeRevisionIdsByKind ?? {}), {
            [this.activeRevisionKey(kind, language, revisionContextKey)]: revision.id
          }),
          revisionsById: __spreadProps(__spreadValues({}, this.normalizedRevisionsById(current)), {
            [revision.id]: LocalHelpCenterMapper.toRecord(revision)
          }),
          revisionIds: [...current.revisionIds.filter((id) => id !== revision.id), revision.id],
          auditById: __spreadProps(__spreadValues({}, current.auditById), {
            [audit.id]: LocalHelpCenterMapper.toRecord(audit)
          }),
          auditIds: [...current.auditIds, audit.id]
        })
      });
    });
    return true;
  }
  ensureActiveRevision(table, kind, lang, contextKey, revisions) {
    const activeKey = this.activeRevisionKey(kind, lang, contextKey);
    const activeRevisionId = table.activeRevisionIdsByKind?.[activeKey] ?? null;
    if (activeRevisionId && table.revisionsById[activeRevisionId]) {
      return false;
    }
    const activeRevision = revisions.find((revision) => revision.active) ?? revisions[0] ?? null;
    if (!activeRevision) {
      return false;
    }
    this.memoryDb.write((state) => {
      const current = state[HELP_CENTER_TABLE_NAME];
      return __spreadProps(__spreadValues({}, state), {
        [HELP_CENTER_TABLE_NAME]: __spreadProps(__spreadValues({}, current), {
          seeded: current.seeded || kind === "help",
          seededKinds: __spreadProps(__spreadValues({}, current.seededKinds ?? {}), { [kind]: true }),
          activeRevisionId: kind === "help" && lang === "en" ? activeRevision.id : current.activeRevisionId,
          activeRevisionIdsByKind: __spreadProps(__spreadValues({}, current.activeRevisionIdsByKind ?? {}), {
            [activeKey]: activeRevision.id
          })
        })
      });
    });
    return true;
  }
  revisionsForKind(table, kind, lang = "en", contextKey) {
    const language = this.normalizeLang(lang);
    const context = this.normalizeContextKey(kind, contextKey);
    return table.revisionIds.map((id) => table.revisionsById[id]).filter((revision) => Boolean(revision)).map((revision) => LocalHelpCenterMapper.toDto(revision)).filter((revision) => this.revisionKind(revision) === kind && this.revisionLang(revision) === language).filter((revision) => kind !== "explanation" || !context || this.revisionContextKey(revision) === context);
  }
  normalizedRevisionsById(table) {
    return Object.fromEntries(table.revisionIds.filter((id) => Boolean(table.revisionsById[id])).map((id) => {
      const revision = LocalHelpCenterMapper.toDto(table.revisionsById[id]);
      const lang = this.revisionLang(revision);
      return [id, LocalHelpCenterMapper.toRecord(__spreadProps(__spreadValues({}, revision), {
        documentKind: this.revisionKind(revision),
        contextKey: this.revisionContextKey(revision),
        lang,
        languageLabel: this.languageLabel(lang)
      }))];
    }));
  }
  auditEntry(options) {
    const documentKind = this.revisionKind(options.revision);
    return {
      id: `${documentKind}-audit-${options.revision.id}`,
      documentKind,
      lang: this.revisionLang(options.revision),
      languageLabel: this.languageLabel(this.revisionLang(options.revision)),
      revisionId: options.revision.id,
      version: options.revision.version,
      action: options.action,
      actorUserId: options.actorUserId.trim() || "system",
      createdAtIso: (/* @__PURE__ */ new Date()).toISOString(),
      message: options.message
    };
  }
  cloneRevision(revision, kind = this.revisionKind(revision)) {
    const lang = this.revisionLang(revision);
    return __spreadProps(__spreadValues({}, revision), {
      documentKind: kind,
      contextKey: this.revisionContextKey(revision),
      lang,
      languageLabel: this.languageLabel(lang),
      sections: (revision.sections ?? []).map((section) => __spreadProps(__spreadValues({}, section), {
        imageUrls: [...section.imageUrls ?? []],
        details: [...section.details ?? []],
        points: [...section.points ?? []]
      }))
    });
  }
  revisionKind(revision) {
    const kind = revision?.documentKind;
    if (kind === "privacy" || kind === "terms" || kind === "explanation") {
      return kind;
    }
    return "help";
  }
  revisionLang(revision) {
    return this.normalizeLang(revision?.lang);
  }
  revisionContextKey(revision) {
    return this.normalizeContextKey(this.revisionKind(revision), revision?.contextKey);
  }
  normalizeContextKey(kind, contextKey) {
    if (kind !== "explanation") {
      return null;
    }
    const normalized = `${contextKey ?? ""}`.trim();
    const match = APP_STATIC_DATA.explainableSurfaces.find((surface) => surface.enabled && surface.key === normalized);
    return match?.key ?? null;
  }
  normalizeLang(lang) {
    const normalized = `${lang ?? ""}`.trim().toLowerCase().split("-")[0];
    return normalized === "hu" ? "hu" : "en";
  }
  languageLabel(lang) {
    return this.normalizeLang(lang) === "hu" ? "Magyar" : "English";
  }
  availableLanguages() {
    return APP_STATIC_DATA.contentLanguages.map((language) => ({
      lang: this.normalizeLang(language.lang),
      label: language.label
    }));
  }
  activeRevisionKey(kind, lang, contextKey) {
    const context = this.normalizeContextKey(kind, contextKey);
    return context ? `${kind}:${this.normalizeLang(lang)}:${context}` : `${kind}:${this.normalizeLang(lang)}`;
  }
  static \u0275fac = function SeedHelpCenterRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedHelpCenterRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedHelpCenterRepository, factory: _SeedHelpCenterRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedHelpCenterRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/shared/core/local/seed/repositories/idea-posts-seed.repository.ts
var SeedIdeaPostsRepository = class _SeedIdeaPostsRepository {
  memoryDb = inject(LocalMemoryDb);
  async seedDefaults() {
    await this.memoryDb.whenReady();
    const table = this.memoryDb.read()[IDEA_POSTS_TABLE_NAME];
    const defaultPosts = SeedIdeaPostsBuilder.buildDefaultPosts();
    const missingPosts = defaultPosts.filter((post) => !table.byId[post.id]);
    if (missingPosts.length === 0 && table.seeded === true) {
      return false;
    }
    this.memoryDb.write((state) => __spreadProps(__spreadValues({}, state), {
      [IDEA_POSTS_TABLE_NAME]: {
        seeded: true,
        byId: __spreadValues(__spreadValues({}, state[IDEA_POSTS_TABLE_NAME].byId), Object.fromEntries(missingPosts.map((post) => [post.id, this.clonePost(post)]))),
        ids: [.../* @__PURE__ */ new Set([
          ...state[IDEA_POSTS_TABLE_NAME].ids,
          ...missingPosts.map((post) => post.id)
        ])]
      }
    }));
    await this.memoryDb.flushToIndexedDb();
    return true;
  }
  clonePost(post) {
    return __spreadProps(__spreadValues({}, post), {
      imageUrls: [...post.imageUrls]
    });
  }
  static \u0275fac = function SeedIdeaPostsRepository_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SeedIdeaPostsRepository)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SeedIdeaPostsRepository, factory: _SeedIdeaPostsRepository.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SeedIdeaPostsRepository, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  demoAssetPlaceholder,
  demoAssetTemplateIds,
  AdminHelpSeedBuilder,
  AdminModerationSeedBuilder,
  AdminMonitoringSeedBuilder,
  AdminNotificationsSeedBuilder,
  AdminParamsSeedBuilder,
  AdminProfileSeedBuilder,
  AdminStatsSeedBuilder,
  SeedAssetBuilder,
  SeedEventBuilder,
  SeedUserBuilder,
  SEED_SCHEDULE_REFERENCE_DATE,
  SeedChatsBuilder,
  SeedEventFeedbackBuilder,
  SeedEventTicketsBuilder,
  SeedEventsBuilder,
  SeedNotificationsBuilder,
  SeedProfileExperienceBuilder,
  SeedUserImpressionsBuilder,
  SeedUserRatesBuilder,
  SeedHelpCenterRepository,
  SeedIdeaPostsRepository
};
//# sourceMappingURL=chunk-OATZQ5DM.js.map
