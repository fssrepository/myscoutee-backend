import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DEMO_DB = path.join(ROOT, 'server/docker/conf/mongodb/demo_db');
const ASSETS_PATH = path.join(DEMO_DB, 'assets.json');
const EVENTS_PATH = path.join(DEMO_DB, 'events.json');
const USERS_PATH = path.join(DEMO_DB, 'users.json');
const CONTACTS_PATH = path.join(DEMO_DB, 'navigatorContacts.json');
const ACTIVITY_MEMBERS_PATH = path.join(DEMO_DB, 'activityMembers.json');
const ACTIVITY_RESOURCES_PATH = path.join(DEMO_DB, 'activityResources.json');
const ACTIVITY_STAGE_RUNTIME_PATH = path.join(DEMO_DB, 'activitySubEventStageRuntime.json');
const ASSET_REQUESTS_PATH = path.join(DEMO_DB, 'assetRequests.json');
const CHATS_PATH = path.join(DEMO_DB, 'chats.json');
const CHAT_MESSAGES_PATH = path.join(DEMO_DB, 'chatMessages.json');
const FEEDBACK_ANSWERS_PATH = path.join(DEMO_DB, 'feedbackAnswers.json');
const FEEDBACK_STATES_PATH = path.join(DEMO_DB, 'feedbackStates.json');
const USER_NOTIFICATIONS_PATH = path.join(DEMO_DB, 'userNotifications.json');
const USER_REPORTS_PATH = path.join(DEMO_DB, 'userReports.json');
const FRONTEND_HELPER_PATH = path.join(
  ROOT,
  'frontend/src/app/shared/core/local/seed/builders/media/demo-image-pool.ts'
);
const MANIFEST_PATH = path.join(ROOT, 'tools/seeds/demo-image-pool-manifest.json');

const args = new Set(process.argv.slice(2));
const writeMode = args.has('--write');
const checkMode = args.has('--check');
const missingMode = args.has('--print-missing-prompts');
const countersOnlyMode = args.has('--refresh-event-counters');
if ([writeMode, checkMode, missingMode, countersOnlyMode].filter(Boolean).length !== 1) {
  throw new Error('Use exactly one of --write, --check, --print-missing-prompts, or --refresh-event-counters.');
}

// Reuse the canonical counter projection without rewriting image/content fixtures.
if (countersOnlyMode) {
  const [users, events, members] = await Promise.all(
    [USERS_PATH, EVENTS_PATH, ACTIVITY_MEMBERS_PATH].map(async file => JSON.parse(await readFile(file, 'utf8')))
  );
  refreshUserEventCounters(users, events, members);
  await writeFile(USERS_PATH, `${JSON.stringify(users, null, 2)}\n`);
  console.log(`Refreshed Event counters for ${users.length} demo users.`);
  process.exit(0);
}

const ASSET_PICSUM_IDS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
  38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49
];
const EVENT_PICSUM_IDS = [
  50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67,
  68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
  87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 98, 99, 100, 101, 102, 103, 104,
  106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
  120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133,
  134, 135, 136, 137, 139, 140, 141, 142, 143, 144, 145, 146, 147, 149,
  151, 152, 153, 154, 155
];

// Exactly one existing Mongo record owns each generated asset image slot. Keeping
// this explicit makes the owner/count distribution stable across regenerations.
const CANONICAL_ASSET_ID_BY_SLOT = [
  '6c8ac25e7a63755e53c46093', '18b8428be616a060f4637bb8', 'df5d7fb9f3a6a22cdd64e5eb',
  '11eb582dc0bcc7581ac991e7', 'd20175905f5ca8bcd645e84d', '93530c3d5db41f141f534de8',
  '9b5052d214d52a95aac425dd', '6662c393d5bdcde662c6130f', '95d49c15fb42a208c729a382',
  '0e34ae88cf81e01a304d4b58', '98ace41a8993907087124578', '16efec65153f9804ef9de2c3',
  '2d86c6a3285d01ac096bd755', '30b3000c189953476fd4225a', 'f26cbd1becbfe2a33ff3035c',
  '4420be96abbbb3a0f755a73b', '729fb7c46ed75e57dcc62d33', '2f77e1a609f5742bfafd66ed',
  '0af73c6b08e4f19a8b23a95d', '17cd70ddc97c5b8ebc49d218', 'de2a18556c6a34010c44130b',
  'eb812a0e245572085510263d', '37b5d81c6c71c50123d6ef98', '6b2ce9e74332b0ce85b81626',
  '927f526e284f30e62786768c', 'bd3ba65d1c046cbf5da9f56e', 'dcfbb22cacc9455f510a421b',
  '12d8697105a365dd17acecdf', 'd55dff56923730ebf46c8197', 'c04250512fe3a60ed6b7752d',
  '8cb5eb0eda1d2964c0920000', '8f42dd53af3a8653e2e879ea', '15d3049967690e9c3abcf0df',
  '127cf3c309c4bd841053a4e8', '2366ebc6a0765906e2434089', '400e8fbb289200aded77ca48',
  '3d1068c9689a192374ab0f9b', '11fc507bd2a049c3a297da19', 'c136079d46f9e4ee2c8f325c',
  '11d65abc7188bfcd778b546b', '72782ab8fc8635ee622b00be', '5539911338c3a6a07f594417',
  'b25dee76250d78b0057e8c69', 'd1344cc795e50601c2a3441a', '91364d2cf1337e36879248a3',
  '34071caa96bd00042e32e1c7', '73e996e26e42311c4efbe92f', '55eee2af2e3a84d9355842e2',
  '9ea23c395c80321c0298280f', '6d0dfc06cab190e33bfb4d87'
];

// One Mongo event owns each generated event image. Fixture-sensitive records
// are deliberately retained in this list; only their display data changes.
const CANONICAL_EVENT_ID_BY_SLOT = [
  '21746c9aacc985817e31cf9f', 'a11a802ee0714a21db94ed4e', '3efb1b25ad4bd346c9bf0a72',
  'fc7345ce1a673d775e0f11bd', 'b425a4db77762da8d46a4c27', '8654bafcac1efb4bdc204385',
  '09d00e5b8349770d4bf4ee40', '50ebe8c0e820dfd6e5cdcf8b', '14f3cb8f61fe8508fa5ffec8',
  'b020670ad3b6597a393418b4', '5aad13ceadb5e69ed56a65f5', 'b76dab063ba86c2573e222f8',
  '209aafe2076a041f55597ebd', '0107df8b8686b8b986b6df51', '4f86abc69e14e4f826eeefad',
  '2be241d997eb2deaf03f7253', '07773bfc84d68a08e66efc1e', '34a70db00fdb17d4f104ee98',
  'b7a12682d128d8796b37e819', '6f1a1e1dd1d79cf39741bade', '4223aeec3f1b39d3a76ab3eb',
  'b82aa80d4a6761590762dbfb', 'd098654a2c917954137ec8f3', '1ad90dc8cb1fe3abdef4e409',
  '68c686d33510afdae064d8f5', 'd4d6e9158de813e31aa2dbcd', '845052d5058691e8e54e1359',
  '52fe6150386c6e8efa61290d', '04734e210225001d020ca583', 'cb6dd99e6d26cf0df772a5ea',
  '7321b58bbba5045a3163cdbc', '261512e744c1837cd7ba85f2', '0aba1afccab1d088fb4d517d',
  '49a97da4f9764ad63c2450d6', '09421edf5287f29df0b6939e', 'c66972829391ece30a38e9be',
  '9018da9f33929fec90a0df70', '4f115bb6be32bf0838efb3b7', '852539c51c59a0f9b587c51c',
  '06b17361f07de1f83082b2a4', 'f011bc534644ddacd0c28bcb', 'e511c1b71cdef1a523094105',
  'af3000000000000000000002', 'f5892afbe74005754a9b27dc', '0f1c8d357ea837c97b714eaf',
  '5c7627e3b9ff113010d00ad8', 'ceaae76e8afd0975e1087cc8', '99fc3b45fb145f50d4026729',
  '6b0040b2f8535de24ea3e71e', '23099224f1bc48899659ecd2', '89342ebb90e2dadc8e5b7a20',
  '161ed933af0d3d822afb6e8e', '048cc01cd2e1257bc0118c2b', '3e00c976ccedc31049214e8c',
  '663e0915ea551ca165487ee7', 'b647a3d709ad8d80ccaf2c5b', '4da716b41a61824673a3de6b',
  '644b7500b1c1e6eeb303f45d', '6874712cbfa8cac47084d875', 'c0175dddc71e8d3862fab588',
  '775d34ce5e1c0e707d43d5ad', '3a4193a4d07c42e734f290ee', 'demo-tournament-results',
  'demo-tournament-start-review', 'f557e743053605a8177c6fbd', '297c8f62d403c999e6aba00c',
  'f260f450643e752d226b4253', 'a09e9b9a7cd69a4f2727e08b', 'fa17271c5b6090f31f02aad8',
  '2a6977798a4b6c3ef708a616', 'c19a9b3baf9e6b7e19fdcbb1', '858bae8114f76bfecea7ea2a',
  '141f6f9ca589a4fecd5881a4', '14d2afd839a096acce18db7c', '17a704fd94f4a356a154361d',
  '2fe18816d7152f393b55d973', '311a4988b2f1516db46f96d8', '44627b437c4eb852e5405967',
  '44db7ec86ba3df4d0dc54fc2', '49a90c78693a3c3b2d7efbad', '1a3e19a819b09e6bd9bd0a2c',
  '0fe7821a10e273d40bb2e88f', '1f73c75edf8c6246a5ef2eaa', '1fb14e059cd3300d9fbdefc4',
  '60cd64b444e23989dd8c4692', '9cff773a194eced322ce2f76', 'c2b9bb630a300a1da4d999a2',
  '58aa9a000b4fe45f868f1cd5', '6c9db589cceea886017ca9c9', '0454c0ca2f6a4663401d76c6',
  'c19cdabbe2394454a065b137', '503e132b0b5debce2c20e463', 'a094f562922c5d15873bf6f1',
  'fca394637db8afa4d522a396', '9e5a5b0c84e154e6e71b2d41', '9295b8c477d5d8beaf3db781',
  '51dd1b1c94a1835ce1060dd0', 'fdff37b9113cc968272678d0', '91cfc506748b20f6e63a7c63',
  '3c7ea5ad3636d8b00fb878cd'
];

if (CANONICAL_EVENT_ID_BY_SLOT.length !== 100 || new Set(CANONICAL_EVENT_ID_BY_SLOT).size !== 100) {
  throw new Error('Canonical event slots must contain exactly 100 unique event IDs.');
}

const QA_RELATION_USER_IDS = new Set([
  '650000000000000000000061', // Casey Bridge
  '650000000000000000000062', // Nova Social
  '650000000000000000000063'  // Riley Outside
]);

const ASSET_SLOT_GROUPS = [
  { title: 'Camping Gear Kit', slots: range(1, 8) },
  { title: 'Game Night Box', slots: range(9, 16) },
  { title: 'South Congress Loft', slots: range(17, 24) },
  { title: 'Eastside Guest Room', slots: range(25, 32) },
  { title: 'City-to-Lake SUV', slots: range(33, 36) },
  { title: 'Airport Shuttle Hatchback', slots: range(37, 39) },
  { title: 'City Event Sedan', slots: range(40, 42) },
  { title: 'Evening Transfer Sedan', slots: range(43, 45) },
  { title: 'Station Pickup Sedan', slots: range(46, 47) },
  { title: 'Summit Transfer Sedan', slots: range(48, 50) }
];

const ASSET_SEED_DEFINITION_BY_SLOT = {
  1: assetDefinition('Lakeside Basecamp Bundle', '4-person dome + sleep systems + lantern', 'Packed for a two-night lakeside stay; cookware and lighting are included.', 'Camping'),
  2: assetDefinition('Desert Trail Hydration Set', 'Water carriers + sun protection + trekking poles', 'Heat-ready hiking supplies for a dry exposed route and a managed rest checkpoint.', 'Hiking'),
  3: assetDefinition('Coastal Kayak Safety Set', 'PFDs + paddles + dry bags + tow line', 'Launch-ready water-safety equipment for a small sea-kayak group.', 'Watersports'),
  4: assetDefinition('Winter Mountaineering Safety Set', 'Crampons + ice axes + rope + helmets', 'Cold-weather technical equipment organized for a supervised alpine route.', 'Mountaineering'),
  5: assetDefinition('Mobile Group Catering Station', 'Coolers + prep tables + food crates', 'Group meal station packed for hygienic outdoor preparation and cold storage.', 'Catering'),
  6: assetDefinition('Group Safety Base', 'First aid + radios + hi-vis equipment', 'Central safety point for moving groups, night checks, and incident response.', 'Safety'),
  7: assetDefinition('Trailside Bicycle Repair Kit', 'Pumps + patches + spare tubes + tools', 'Mobile maintenance supplies for punctures and basic repairs during a group ride.', 'Cycling'),
  8: assetDefinition('Outdoor Event Power Hub', 'Power stations + charging leads + cable covers', 'Shared low-voltage charging and equipment-power point for an outdoor gathering.', 'Event Technology'),
  9: assetDefinition('Travel Social Games Case', 'Compact boards + cards + dice + score tokens', 'Portable all-weather social games for four travelers during an evening stop.', 'Games'),
  10: assetDefinition('Route Navigation Kit', 'Handheld GPS + compass + waterproof map sleeves', 'Offline route-finding equipment for a small group traveling beyond reliable mobile coverage.', 'Navigation'),
  11: assetDefinition('Field Cooking Kit', 'Twin burner + nesting pots + utensil roll', 'Compact meal-preparation equipment for four people at an approved outdoor cooking point.', 'Cooking'),
  12: assetDefinition('Picnic Comfort Set', 'Folding chairs + blanket + thermos carriers', 'Packable seating and serving equipment for a relaxed daytime group stop.', 'Picnic'),
  13: assetDefinition('Portable Audio Rig', 'Battery speakers + microphones + compact mixer', 'Cable-managed sound equipment for announcements, music, or a small workshop.', 'Audio'),
  14: assetDefinition('Rechargeable Area Lighting Kit', 'Tripod lights + lanterns + safe cable covers', 'Flexible low-voltage lighting for an evening meeting point or work area.', 'Lighting'),
  15: assetDefinition('Outdoor Projection Pack', 'Projector + folding screen + power station', 'Portable film and presentation setup for a sheltered community gathering.', 'Projection'),
  16: assetDefinition('Hygiene and Cleanup Station', 'Water containers + wash basins + sorting bins', 'Reusable sanitation and cleanup equipment for a shared trip or outdoor event.', 'Sanitation'),
  17: assetDefinition('Lakeside Timber Cabin', 'Four beds + wood stove + covered porch', 'Simple group cabin for a quiet overnight stay beside a lake.', 'Cabin'),
  18: assetDefinition('Urban Hostel Family Room', 'Four bunks + lockers + shared table', 'Private four-person hostel room near public transport and city activities.', 'Hostel'),
  19: assetDefinition('Riverside Houseboat Berth', 'Two double berths + compact galley + deck', 'Moored floating accommodation for a small group on a calm urban river.', 'Houseboat'),
  20: assetDefinition('Mountain Refuge Room', 'Four alpine bunks + drying racks + gear shelf', 'Practical shared room inside a staffed mountain refuge.', 'Mountain Refuge'),
  21: assetDefinition('Compact Campervan Sleep Setup', 'Pop-top berths + convertible bench + kitchenette', 'Four-person mobile sleep setup prepared at a legal overnight stop.', 'Campervan'),
  22: assetDefinition('Farm Guest Cottage', 'Two bedrooms + kitchen table + rural courtyard', 'Independent small cottage for a group visiting a working farm.', 'Cottage'),
  23: assetDefinition('Desert Adobe Casita', 'Cool plaster walls + shaded courtyard + sleeps four', 'Compact heat-conscious guest house with enclosed sleeping rooms and a furnished courtyard.', 'Casita'),
  24: assetDefinition('Forest Treehouse Lodge', 'Raised timber room + four beds + woodland deck', 'Weatherproof elevated lodge reached by a safe fixed stairway.', 'Treehouse'),
  25: assetDefinition('Historic Townhouse Room', 'Double bed + reading nook + tall window', 'Private two-person room in a carefully maintained older city home.', 'Guest Room'),
  26: assetDefinition('Beach Bungalow Room', 'Double bed + screened shutters + small veranda', 'Simple two-person coastal stay designed for airflow and sandy gear.', 'Bungalow'),
  27: assetDefinition('Accessible Garden Suite', 'Wide circulation + low storage + roll-in bathroom', 'Step-free private suite for two guests beside a quiet garden.', 'Accessible Suite'),
  28: assetDefinition('Urban Micro Studio', 'Wall bed + kitchenette + compact workspace', 'Efficient self-contained city stay for one or two travelers.', 'Studio'),
  29: assetDefinition('Festival Crew Bunk Nook', 'Two bunks + personal shelves + durable linens', 'No-frills two-person sleep space for event or volunteer crew.', 'Bunkhouse'),
  30: assetDefinition('Night Train Sleeper Cabin', 'Two berths + fold-down table + corridor window', 'Reserved overnight rail compartment for two travelers.', 'Sleeper Cabin'),
  31: assetDefinition('Canal View Guest Room', 'Double bed + balcony door + waterside outlook', 'Bright private room for two guests beside a quiet canal district.', 'Guest Room'),
  32: assetDefinition('Remote Work Guest Suite', 'Double bed + proper desk + acoustic door', 'Calm two-person suite with a reliable place for focused work.', 'Guest Suite'),
  33: assetDefinition('Trail Access 4x4', '4 seats + high clearance + washable cargo area', 'Unbranded four-wheel-drive vehicle for rough access roads and trail equipment.', '4x4'),
  34: assetDefinition('Kayak Roof-Rack Estate', '4 seats + twin kayak rack + wet-gear liner', 'Long-roof vehicle prepared for a four-person coastal paddling day.', 'Estate Car'),
  35: assetDefinition('Family Road-Trip Minivan', '4 reserved seats + flexible storage + sliding doors', 'Comfortable unbranded minivan configured for a longer regional journey.', 'Minivan'),
  36: assetDefinition('Bicycle Shuttle Crossover', '4 seats + rear rack + repair tray', 'Compact crossover carrying two bicycles and group riding equipment.', 'Crossover'),
  37: assetDefinition('Compact Airport EV', '4 seats + electric hatchback + terminal pickup', 'Small battery-electric car for a coordinated airport transfer.', 'Electric Car'),
  38: assetDefinition('Accessible Shuttle Van', '4 passenger places + ramp + securement points', 'Step-friendly van configured for an inclusive local transfer.', 'Accessible Van'),
  39: assetDefinition('Hotel Courtesy Minibus', '4 reserved seats + high roof + hotel loop', 'Small courtesy bus assigned to a four-person late-arrival group.', 'Minibus'),
  40: assetDefinition('Expo Equipment Cargo Van', '4 crew seats + enclosed load bay + tie-downs', 'Short-wheelbase van for people and protected event equipment.', 'Cargo Van'),
  41: assetDefinition('Community Equipment Pickup', '4 seats + covered utility bed + loading step', 'Double-cab pickup for bulky community-event supplies.', 'Pickup Truck'),
  42: assetDefinition('Festival Utility Buggy', '4 seats + open cargo deck + venue route', 'Low-speed electric utility vehicle for an enclosed event site.', 'Utility Vehicle'),
  43: assetDefinition('Waterfront Passenger Launch', '4 passenger seats + rigid cockpit + life jackets', 'Small licensed motor launch with an enclosed helm for a short sheltered-water transfer.', 'Passenger Boat'),
  44: assetDefinition('Dinner District Electric Taxi', '4 seats + compact EV + city pickup', 'Quiet unbranded electric taxi reserved for an evening group.', 'Electric Taxi'),
  45: assetDefinition('Concert Night Shuttle Van', '4 reserved seats + illuminated pickup zone', 'Compact passenger van for a clearly coordinated post-event return.', 'Shuttle Van'),
  46: assetDefinition('Station Pickup Wagon', '4 seats + long cargo floor + rail connection', 'Unbranded estate wagon for a daytime station pickup.', 'Estate Car'),
  47: assetDefinition('Historic District Pedicab Pair', '4 total seats + two open-air cycle taxis', 'Two coordinated roofless pedal-powered taxis for a short old-town transfer.', 'Pedicab'),
  48: assetDefinition('Mountain Cable-Car Cabin', '4 reserved places + enclosed gondola + ridge link', 'Small enclosed cable-car cabin representing an uphill group transfer.', 'Cable Car'),
  49: assetDefinition('Foothill Sidecar Motorcycle Pair', '4 total seats + two touring sidecars', 'Two coordinated unbranded sidecar motorcycles for a scenic paved route.', 'Motorcycle'),
  50: assetDefinition('Snow Lodge Tracked Shuttle', '4 passenger seats + rubber tracks + heated cab', 'Compact tracked passenger vehicle for a maintained snowy lodge route.', 'Snow Shuttle')
};

const ASSET_SCENE_BY_SLOT = {
  1: 'a complete lakeside forest campsite with one dome tent, sleeping bags, backpacks, a lantern and compact cookware',
  2: 'a desert hiking rest checkpoint with large water carriers, trekking poles, sun hats, neck shades and hydration packs arranged beside a trail marker without readable text',
  3: 'a rocky coastal kayak launch with two sea kayaks, personal flotation vests, paddles, bright dry bags and a coiled tow line',
  4: 'a winter mountain equipment bench outside a small stone refuge, with crampons, ice axes, climbing rope, helmets and avalanche safety tools',
  5: 'a mobile group catering setup beside a public picnic pavilion, with large coolers, stainless preparation tables, insulated food carriers and washable crates',
  6: 'an organized group safety desk in a community venue entrance, with plain unmarked first-aid cases, handheld radios, high-visibility vests, lanterns and incident supplies',
  7: 'a trailside bicycle repair station with a work stand, floor pump, patch kits, multi-tools, spare tubes and open bikepacking tool rolls',
  8: 'an outdoor event power point beside a solid concrete amphitheater service wall, built around portable battery stations, color-organized charging leads, weatherproof cable covers and a compact distribution table',
  9: 'a compact travel game collection opened on a weathered hostel common-room table, with small boards, cards, dice and score tokens',
  10: 'a route-navigation set arranged on a rocky overlook, with a handheld GPS, compass, blank waterproof map sleeves and a power bank',
  11: 'a field-cooking station on a designated gravel pad, with a twin burner, nesting pots, utensil roll and stable preparation board',
  12: 'a picnic comfort set in a green city park, with four distinct folding chairs, a patterned blanket, thermos carriers and reusable cups',
  13: 'a portable audio system prepared on a small community stage, with two plain unmarked battery speakers, plain microphones, stands and a compact unmarked mixer',
  14: 'a rechargeable area-lighting kit tested in an open warehouse, with plain unmarked tripod work lights, plain lanterns and low-profile cable covers',
  15: 'an outdoor projection setup beneath a solid pavilion roof, with a folding screen, compact projector, power station and four chairs',
  16: 'a reusable hygiene and cleanup station beside a solid brick community service building, with water containers, wash basins, sorting bins and cleaning tools',
  17: 'the closed exterior of a rustic lakeside timber cabin with solid walls, visible windows, a covered porch and a compact chimney, with no beds or interior cutaway visible',
  18: 'a clean urban hostel family room with two sturdy bunk beds, four lockers and a shared central table',
  19: 'the bright interior and small deck of a moored houseboat, with two double berths, compact galley and calm river outside',
  20: 'a practical mountain-refuge room with four alpine bunks, boot-drying racks, stone walls and organized gear shelves',
  21: 'the open pop-top interior of a compact campervan at an official motorhome stop, showing four converted sleeping places and kitchenette',
  22: 'a small stone farm guest cottage with two simple bedrooms, a wooden kitchen table and a sunny rural courtyard',
  23: 'the closed exterior of a compact desert adobe guest house with rounded plaster walls, solid doors and windows, and a deeply shaded enclosed courtyard furnished only with a table and chairs; sleeping rooms remain enclosed and no beds are visible outdoors',
  24: 'a weatherproof timber treehouse lodge on strong stilts, with safe stairs, four beds and a leafy woodland deck',
  25: 'a historic townhouse guest room with one double bed, a reading nook, tall sash window and restrained period details',
  26: 'an airy beach bungalow room with one double bed, screened shutters, natural fiber furniture and a small veranda',
  27: 'a modern accessible garden suite with one double bed, wide circulation, low storage and a visible step-free bathroom entrance',
  28: 'a highly efficient urban micro-studio with a folded-down wall bed, tiny kitchenette and compact work surface',
  29: 'a tidy two-person festival crew bunk nook with one bunk bed, personal shelves, durable linens and equipment hooks',
  30: 'a realistic night-train sleeper compartment with two berths, fold-down table, corridor door and dark landscape beyond the window',
  31: 'a bright canal-view guest room with one double bed, balcony doors and water reflected on nearby buildings',
  32: 'a quiet remote-work guest suite with one double bed, ergonomic desk, acoustic door and soft daylight',
  33: 'a rugged unbranded four-wheel-drive vehicle on a rocky trail access road, with high clearance and muddy washable cargo area',
  34: 'an unbranded long-roof estate car at a coastal launch, carrying two sea kayaks securely on its roof rack',
  35: 'an unbranded modern minivan at an open-road rest area, with sliding doors and a flexible four-passenger layout',
  36: 'an unbranded crossover at a forest bicycle trailhead, carrying two bicycles on a rear rack and an open repair tray',
  37: 'a compact unbranded electric hatchback connected to an airport charging bay at dawn',
  38: 'an unbranded accessible passenger van at a civic-center curb, with side ramp deployed and clear securement space',
  39: 'a small unbranded high-roof courtesy minibus waiting beneath a solid masonry hotel porte-cochere built into the entrance at night',
  40: 'an unbranded short-wheelbase cargo van at an expo loading dock, with side door open to a neatly secured equipment bay',
  41: 'an unbranded double-cab pickup truck beside a community hall, with a covered utility bed and portable tables being loaded',
  42: 'a four-seat electric utility buggy on a colorful closed festival service lane with an open rear cargo deck',
  43: 'a small four-passenger motor launch with a rigid enclosed cockpit, life jackets and a calm waterfront terminal behind it',
  44: 'a compact unbranded electric city taxi outside a lively restaurant district after sunset',
  45: 'an unbranded passenger shuttle van in a clearly lit concert pickup zone at night',
  46: 'an unbranded long-roof station wagon beneath a solid steel-and-glass railway-station overhang in daylight',
  47: 'two roofless open-air cycle pedicabs with passenger benches waiting together on a car-free cobbled old-town square',
  48: 'a small enclosed four-person cable-car gondola traveling above a green mountain valley toward a ridge station',
  49: 'two unbranded classic touring motorcycles with sidecars parked at a sunny foothill overlook',
  50: 'a compact tracked passenger snow shuttle with heated cab arriving at a snowy lodge entrance'
};

const LOCAL_ASSET_SLOTS_BY_TEMPLATE = {
  'asset-sup-1': range(1, 4),
  'asset-sup-2': range(9, 12),
  'asset-sup-3': range(13, 16),
  'asset-sup-4': range(5, 8),
  'asset-sup-5': range(1, 4),
  'asset-sup-6': range(13, 16),
  'asset-sup-7': range(5, 8),
  'asset-sup-8': range(13, 16),
  'asset-acc-1': range(17, 20),
  'asset-acc-2': range(25, 28),
  'asset-acc-3': range(21, 24),
  'asset-acc-4': range(29, 32),
  'asset-transport-1': range(33, 36),
  'asset-transport-2': [37, 38, 39, 46, 47],
  'asset-transport-3': [40, 41, 42, 43, 44, 45],
  'asset-transport-4': range(48, 50)
};

const LOCAL_EVENT_SEEDS = [
  'demo-event-events:u1:e1:alpine-weekend-2.0',
  'demo-event-events:u1:e10:golden-hour-meetup',
  'demo-event-events:u1:e11:cross-month-community-relay',
  'demo-event-events:u1:e12:spring-cohort-journey',
  'demo-event-events:u1:e7:coffee-+-book-swap',
  'demo-event-events:u1:e9:brunch-rotation',
  'demo-event-events:u10:e2:urban-photo-marathon',
  'demo-event-events:u12:e8:lakeside-walk-lab',
  'demo-event-events:u2:checkout-paid-slots:checkout-demo-·-paid-multi-slot',
  'demo-event-events:u2:e13:afterwork-tasting-circle',
  'demo-event-events:u2:e4:sunrise-run-+-brunch',
  'demo-event-events:u2:waitlist-full-policy:full-house-supper-club',
  'demo-event-events:u3:active-tournament-slots:tournament-demo-·-active-slot-cup',
  'demo-event-events:u3:asset-join-demo-nagy-eszter:asset-join-demo-·-shuttle-seat',
  'demo-event-events:u3:checkout-free-slots:checkout-demo-·-free-multi-slot',
  'demo-event-events:u3:checkout-paid-policy:checkout-demo-·-paid-one-slot-policy',
  'demo-event-events:u3:e14:moonlight-boardwalk-mixer',
  'demo-event-events:u3:e3:night-food-league',
  'demo-event-events:u3:e5:creative-studio-meetup',
  'demo-event-events:u3:feedback-showcase-nagy-eszter-social:feedback-demo-·-social-lab',
  'demo-event-events:u3:feedback-showcase-nagy-eszter-studio:feedback-demo-·-studio-recap',
  'demo-event-events:u3:waitlist-full-free:tiny-vinyl-listening-room',
  'demo-event-events:u4:e6:sunset-beach-volley',
  'demo-event-hosting:u1:h1:weekly-padel-league',
  'demo-event-hosting:u1:h2:spring-city-festival-crew',
  'demo-event-hosting:u2:h3:sunday-bike-social',
  'demo-event-hosting:u3:h4:creative-nights-series',
  'demo-event-invitations:u1:i1:jazz-rooftop-session',
  'demo-event-invitations:u1:i2:open-padel-pairs',
  'demo-event-invitations:u1:i3:chat:-last-minute-ski-transfer',
  'demo-event-invitations:u2:i4:foodie-crawl-team',
  'demo-event-invitations:u3:i5:urban-photo-sprint'
];

const LOCAL_EVENT_CANONICAL_ID_BY_KEY = {
  'demo-event-events:u1:e1': 'a11a802ee0714a21db94ed4e',
  'demo-event-events:u1:e7': '99fc3b45fb145f50d4026729',
  'demo-event-events:u3:e5': 'ceaae76e8afd0975e1087cc8'
};

const EVENT_CATEGORIES = [
  category('winter-mountain', ['ski', 'alpine', 'snow', 'winter', 'mountain', 'summit']),
  category('court-sports', ['padel', 'tennis', 'volley', 'court', 'league', 'tournament', 'cup', 'competition']),
  category('cycling', ['bike', 'bicycle', 'cycling', 'cycle']),
  category('running-fitness', ['run', 'running', 'sprint', 'fitness', 'gym', 'workout', 'relay']),
  category('walking-outdoors', ['walk', 'walking', 'trail', 'hike', 'hiking', 'lake', 'lakeside', 'wildflower', 'outdoor', 'outside', 'park']),
  category('beach-water', ['beach', 'boardwalk', 'harbor', 'boat', 'kayak', 'water', 'coast', 'seaside']),
  category('coffee-brunch', ['coffee', 'brunch', 'breakfast', 'cafe', 'bakery']),
  category('dining-tasting', ['food', 'foodie', 'dinner', 'supper', 'dining', 'tasting', 'wine', 'beer', 'cocktail', 'cooking', 'kitchen', 'restaurant']),
  category('music-nightlife', ['music', 'jazz', 'vinyl', 'concert', 'dance', 'night', 'rooftop', 'karaoke', 'club']),
  category('creative-culture', ['creative', 'studio', 'photo', 'photography', 'book', 'art', 'theatre', 'film', 'movie', 'anime', 'craft', 'museum']),
  category('wellness', ['wellness', 'yoga', 'meditation', 'mindful', 'mental', 'spiritual', 'healthy']),
  category('professional-tech', ['network', 'career', 'business', 'entrepreneur', 'tech', 'mentor', 'workshop', 'ideas', 'checkout', 'demo', 'policy']),
  category('festival-community', ['festival', 'volunteer', 'community', 'crew', 'cohort', 'friends', 'social lab']),
  category('games', ['game', 'gaming', 'board game', 'challenge', 'rank', 'table']),
  category('social-mixer', [])
];

const RELATED_EVENT_CATEGORIES = {
  'winter-mountain': ['walking-outdoors', 'running-fitness'],
  'court-sports': ['running-fitness', 'games'],
  cycling: ['walking-outdoors', 'running-fitness'],
  'running-fitness': ['walking-outdoors', 'court-sports', 'wellness'],
  'walking-outdoors': ['wellness', 'running-fitness', 'beach-water'],
  'beach-water': ['walking-outdoors', 'social-mixer'],
  'coffee-brunch': ['dining-tasting', 'social-mixer'],
  'dining-tasting': ['coffee-brunch', 'social-mixer'],
  'music-nightlife': ['creative-culture', 'social-mixer'],
  'creative-culture': ['festival-community', 'social-mixer'],
  wellness: ['walking-outdoors', 'social-mixer'],
  'professional-tech': ['festival-community', 'social-mixer'],
  'festival-community': ['creative-culture', 'social-mixer'],
  games: ['court-sports', 'social-mixer'],
  'social-mixer': ['festival-community', 'coffee-brunch', 'creative-culture']
};

// Stable, intentionally distinct briefs for the 100 generated event covers.
// These are image concepts, not replacements for the underlying event fixtures:
// several real demo events can continue to share the matching canonical cover.
const EVENT_IMAGE_DEFINITIONS = [
  eventImageDefinition('winter-mountain', 'Snowline Shuttle Briefing', 'A dawn transfer team checks skis, helmets, and warm layers before the road climbs.', 'snowy timber-lodge pickup lane', 'three friends loading skis into an unbranded minibus while a fourth checks boot buckles beside blue snowbanks'),
  eventImageDefinition('winter-mountain', 'Alpine Cabin Supper', 'A small ski group winds down over soup while wet gloves and boots dry by the stove.', 'stone mountain refuge dining room', 'four tired skiers around a rough wooden table, steaming bowls in front of them and snow visible through one window'),
  eventImageDefinition('court-sports', 'Glasshouse Padel Ladder', 'Rotating doubles play short ranking rounds on a bright converted conservatory court.', 'sunlit glass-roof padel court', 'four adults mid-rally with the ball above the net and two waiting players beside plain gear bags'),
  eventImageDefinition('court-sports', 'Sunset Beach Volley Rotation', 'Casual teams rotate through quick games before sharing fruit at the sideline.', 'wide public beach volleyball court', 'two players jumping at the net as teammates reset in the sand with the ocean horizon behind them'),
  eventImageDefinition('court-sports', 'Rooftop Padel Open', 'Open pairs meet for a friendly evening bracket above the city.', 'fenced urban rooftop padel court', 'a mixed doubles point in progress beneath amber sky with plain wind screens and city buildings beyond'),
  eventImageDefinition('cycling', 'Riverbridge Cargo-Bike Social', 'A relaxed ride pauses to compare practical cargo setups before following the riverside trail.', 'riverside path below a steel bridge', 'five cyclists standing beside city bikes and one front-loader cargo bike while adjusting helmets and panniers'),
  eventImageDefinition('running-fitness', 'Sunrise Run and Market Brunch', 'An easy-pace run finishes beside a breakfast table with fruit, rolls, and coffee flasks.', 'tree-lined market square at sunrise', 'runners cooling down beside a folding breakfast table while one person pours coffee into reusable cups'),
  eventImageDefinition('running-fitness', 'Riverside Relay Handoff', 'Small teams practice clean baton exchanges across a long community relay route.', 'curving river trail beside a pedestrian bridge', 'one runner passing a plain baton to a teammate while the remaining team cheers from a safe trail edge'),
  eventImageDefinition('running-fitness', 'Stadium Stair Pulse', 'A compact fitness group alternates stair climbs with recovery rounds.', 'open concrete neighborhood stadium', 'five adults moving at different levels on broad stadium steps with water bottles aligned at the bottom'),
  eventImageDefinition('running-fitness', 'Rain-Window Track Intervals', 'A weatherproof evening session uses short intervals and paired pacing.', 'indoor oval track beside tall rain-streaked windows', 'two runners rounding the bend as a coach times another pair with an unmarked stopwatch'),
  eventImageDefinition('running-fitness', 'Urban Photo Checkpoint Dash', 'Camera teams move between visual challenges without turning the meetup into a race.', 'geometric downtown pedestrian plaza', 'four participants jogging lightly across paving with compact cameras secured by straps and one framing a shot'),
  eventImageDefinition('running-fitness', 'Underpass Strength Circuit', 'A coached outdoor circuit combines resistance bands, step boxes, and controlled carries.', 'clean concrete space beneath a broad overpass', 'six adults at separate exercise stations using plain bands, kettlebells, and low wooden boxes'),
  eventImageDefinition('running-fitness', 'Twilight Pacer Drills', 'Volunteer pacers rehearse starts, regroup points, and steady running formation.', 'community athletics track at blue hour', 'a line of runners following evenly spaced cones while two pacers demonstrate shoulder-to-shoulder rhythm'),
  eventImageDefinition('walking-outdoors', 'Red Rock Overlook Hike', 'A measured desert climb ends at a broad overlook with time for water and route checks.', 'rust-colored canyon trail', 'five hikers arriving at a rocky viewpoint with trekking poles lowered and hydration packs visible'),
  eventImageDefinition('walking-outdoors', 'Lakeside Walk Lab', 'Paired conversations alternate with quiet observation stops along the water.', 'wooden boardwalk through lakeside reeds', 'three walking pairs spaced along the boardwalk while the leading pair pauses to watch ripples near the reeds'),
  eventImageDefinition('walking-outdoors', 'Conservatory Sunset Stroll', 'Friends of friends explore outdoor garden rooms before the glasshouse closes.', 'botanical conservatory garden at sunset', 'a small group walking between tall tropical planters and the glowing glass facade'),
  eventImageDefinition('walking-outdoors', 'Saguaro Bloom Trail', 'A careful morning walk follows seasonal desert flowers without leaving the marked path.', 'Sonoran desert footpath after spring rain', 'four walkers passing flowering cactus and low wildflowers with a guide pointing from the center of the trail'),
  eventImageDefinition('walking-outdoors', 'Elevated-Rail Architecture Walk', 'The group studies steelwork, brick facades, and changing street proportions.', 'car-free street beneath an elevated railway', 'five adults looking upward at riveted beams while one sketches shapes in a small blank notebook'),
  eventImageDefinition('walking-outdoors', 'Cedar Mist Forest Loop', 'A quiet social hike follows a damp cedar path with frequent regroup stops.', 'misty evergreen forest trail', 'four walkers crossing a narrow timber footbridge surrounded by ferns and wet cedar trunks'),
  eventImageDefinition('walking-outdoors', 'Mosaic Stairway City Walk', 'A hillside route connects colorful public steps, pocket gardens, and neighborhood overlooks.', 'steep urban garden stairway', 'a social group climbing patterned tile steps between dense plants and simple stucco walls'),
  eventImageDefinition('walking-outdoors', 'Accessible Sunday Park Loop', 'A step-free loop keeps the pace conversational and the path comfortable for everyone.', 'broad level path around a mature city park', 'two walkers beside a wheelchair user and two more friends under large shade trees with generous space around them'),
  eventImageDefinition('walking-outdoors', 'Lantern Bluff Walk', 'An early-evening coastal walk uses hand lanterns for the return from the overlook.', 'grassy bluff above a rocky coast', 'five adults following a safe inland path with small warm lanterns as the sea darkens behind them'),
  eventImageDefinition('walking-outdoors', 'Tidal Marsh Bird Walk', 'A patient boardwalk outing practices binocular use and quiet group movement.', 'open salt-marsh observation boardwalk', 'four birdwatchers with binoculars facing different parts of the marsh while a guide points toward distant reeds'),
  eventImageDefinition('beach-water', 'Paddleboard Balance Clinic', 'Beginners rehearse stable stance and safe falls in calm shallow water.', 'sheltered urban lake beach', 'three adults kneeling on paddleboards near an instructor standing waist-deep beside a line of bright unbranded boards'),
  eventImageDefinition('beach-water', 'Canyon Reservoir Kayak Pairing', 'Paddlers match pace and practice turning before a short red-cliff route.', 'calm reservoir below red canyon walls', 'two tandem kayaks making a wide synchronized turn while a third waits near a floating marker'),
  eventImageDefinition('beach-water', 'Lakefront Dinghy Rigging', 'A small sailing group learns to prepare lines and sails before leaving the harbor.', 'grassy lakefront sailing dock', 'four adults rigging a compact white dinghy with one holding the mast and another sorting plain rope'),
  eventImageDefinition('beach-water', 'Riverside Canoe Picnic Launch', 'Friends pack a dry lunch and check life jackets before a gentle downstream paddle.', 'tree-shaded river launch ramp', 'five participants loading dry bags and a picnic basket into two open canoes beside calm water'),
  eventImageDefinition('beach-water', 'Low-Tide Shore Survey', 'A waterfront meetup observes tide pools and returns every stone carefully.', 'rocky Pacific shoreline at low tide', 'four adults crouched around separate tide pools with one using a small viewing tray and waves far behind'),
  eventImageDefinition('coffee-brunch', 'Corner Bakery First Batch', 'Early arrivals share still-warm bread at the working table beside the ovens.', 'small neighborhood bakery after opening', 'five guests around a worn wooden table with torn bread, butter dishes, ceramic mugs, and cooling racks behind them'),
  eventImageDefinition('coffee-brunch', 'Greenhouse Brunch Table', 'A plant-filled brunch pairs seasonal plates with calm one-to-one introductions.', 'airy greenhouse cafe among hanging plants', 'six adults seated around a round table with colorful breakfast plates under diffuse glass-roof light'),
  eventImageDefinition('coffee-brunch', 'Brunch Rotation', 'Three compact tables rotate guests every twenty minutes using different cup colors as cues.', 'bright tiled all-day cafe', 'three visible cafe tables mid-rotation as guests stand, smile, and carry differently colored ceramic cups'),
  eventImageDefinition('coffee-brunch', 'Pour-Over Roastery Lab', 'A hands-on coffee session compares grind, timing, and aroma without brand-led presentation.', 'brick micro-roastery workshop counter', 'four participants pouring through glass brewers while a fifth smells freshly ground coffee from a small bowl'),
  eventImageDefinition('coffee-brunch', 'Rooftop Tea and Citrus', 'A breezy late breakfast combines iced tea, citrus pastries, and a shaded skyline table.', 'quiet rooftop garden breakfast terrace', 'five friends passing a citrus tart around a linen-covered table with glass tea pitchers and potted herbs'),
  eventImageDefinition('coffee-brunch', 'Market Hall Breakfast Club', 'The group assembles a shared breakfast from several small independent counters.', 'historic indoor food hall in morning light', 'six adults standing at a tall communal table with oatmeal, fruit, savory buns, and plain takeaway cups'),
  eventImageDefinition('dining-tasting', 'Night Taco Window Crawl', 'A three-stop route compares fillings and handmade salsas at open street windows.', 'pedestrian food lane after dark', 'five diners standing around a narrow steel counter with small tacos and colorful salsa bowls under warm bulbs'),
  eventImageDefinition('dining-tasting', 'Handmade Pasta Table', 'Pairs roll dough, shape filled pasta, and share the first cooked batch.', 'community kitchen with long marble worktop', 'six adults flouring pasta sheets with rolling pins while finished shapes rest on wooden trays'),
  eventImageDefinition('dining-tasting', 'Night Food League', 'Teams sample three market stalls and compare aroma, texture, and presentation.', 'covered night market dining aisle', 'three pairs gathered around a standing table holding different tasting bowls with active open kitchens behind'),
  eventImageDefinition('dining-tasting', 'Friends Circle Supper', 'Close connections and plus-ones share a slow seasonal meal at one candlelit table.', 'converted farmhouse dining room', 'eight adults passing roasted vegetables along a long timber table lit by mismatched candles'),
  eventImageDefinition('dining-tasting', 'Cocoa and Spice Flight', 'A guided tasting matches dark cocoa with cinnamon, chile, citrus peel, and toasted nuts.', 'intimate stone-walled tasting room', 'five guests comparing small ceramic cups and spice dishes arranged in a precise arc on a dark table'),
  eventImageDefinition('music-nightlife', 'Desert Porch Folk Session', 'Acoustic players trade short songs while listeners settle into porch chairs.', 'adobe porch facing a desert dusk', 'three musicians with unbranded acoustic instruments and five listeners seated close under simple string bulbs'),
  eventImageDefinition('music-nightlife', 'Jazz Rooftop Session', 'A compact trio plays beside low tables as the skyline moves into evening.', 'brick rooftop music terrace', 'saxophone, upright bass, and small drum kit in performance with a relaxed seated audience in the foreground'),
  eventImageDefinition('music-nightlife', 'Basement Vinyl Listening Circle', 'Each guest shares one record side in a focused, low-light listening room.', 'acoustically treated basement lounge', 'six listeners facing a plain turntable cabinet while one person carefully lowers a record onto the platter'),
  eventImageDefinition('music-nightlife', 'Harbor Warehouse Percussion Lab', 'A rhythm workshop builds layered patterns with hand drums and found percussion.', 'open brick warehouse beside a harbor', 'seven adults in a wide circle playing hand drums, shakers, and wooden blocks with large doors open to water'),
  eventImageDefinition('music-nightlife', 'Courtyard String Social', 'A small string quartet performs close to a standing neighborhood audience.', 'leafy old-town courtyard at night', 'four seated string players beneath warm wall lamps with listeners gathered informally around the stone paving'),
  eventImageDefinition('creative-culture', 'Sunprint Garden Workshop', 'Participants arrange leaves and small objects for blue botanical contact prints.', 'community garden worktable in clear sun', 'five adults placing ferns and flowers onto deep-blue sunprint sheets with water trays at one end'),
  eventImageDefinition('creative-culture', 'Creative Nights Gesture Circle', 'A clothed gesture model anchors fast charcoal studies and supportive critique.', 'high-ceiling neighborhood art studio', 'six easels forming a semicircle around a fully clothed seated model with charcoal drawings visible but no text'),
  eventImageDefinition('creative-culture', 'Wheel-Thrown Pottery Lab', 'Beginners center clay and compare forms at a row of working wheels.', 'daylit ceramic workshop', 'four adults at pottery wheels with wet clay on their hands and shelves of unglazed bowls behind them'),
  eventImageDefinition('creative-culture', 'Coffee and Book Swap', 'Readers trade wrapped recommendations and open them over coffee in a small circle.', 'independent cafe reading alcove', 'six people passing paper-wrapped books around a low table with mugs and an overflowing plain book crate'),
  eventImageDefinition('creative-culture', 'Risograph Zine Assembly', 'A print group layers two colors, folds pages, and binds a tiny shared edition.', 'compact community print studio', 'five adults handling vivid two-color prints beside an unbranded duplicator, bone folders, and stacks of blank covers'),
  eventImageDefinition('creative-culture', 'Darkroom Contact Sheet Night', 'Analog photographers inspect fresh contact sheets under safe red light.', 'working photographic darkroom', 'four adults around a wet-process bench with film strips, tongs, trays, and abstract contact sheets without readable text'),
  eventImageDefinition('creative-culture', 'Studio Friends Critique Wall', 'An invite-only group pins works in progress and discusses composition in short rounds.', 'loft studio with a long white review wall', 'six friends facing varied abstract studies pinned in a grid while one gestures with a pencil'),
  eventImageDefinition('creative-culture', 'Urban Photo Marathon', 'Camera teams solve composition challenges across arcades, reflections, and pedestrian bridges.', 'downtown passage with mirrored windows', 'five photographers working at visibly different angles around one reflective architectural scene'),
  eventImageDefinition('wellness', 'Candlelit Sound Bath', 'A quiet evening session layers singing bowls and low resonant tones.', 'warm timber wellness room', 'six adults resting on floor mats while a facilitator sits among metal bowls and soft indirect candles'),
  eventImageDefinition('wellness', 'Seaside Sunrise Yoga', 'A gentle standing sequence begins as first light reaches the water.', 'flat oceanfront deck at sunrise', 'seven adults in a balanced standing pose on evenly spaced mats facing the horizon'),
  eventImageDefinition('wellness', 'Community Tai Chi Courtyard', 'Slow coordinated forms create a calm start in a sheltered civic courtyard.', 'pale stone courtyard with one mature tree', 'eight adults moving through the same open-arm tai chi posture with generous spacing'),
  eventImageDefinition('wellness', 'Desert Breathwork Circle', 'A guided breathing practice uses upright seating and a quiet sandstone setting.', 'shaded desert pavilion', 'six adults seated on round cushions in a broad circle while a facilitator demonstrates hands resting on ribs'),
  eventImageDefinition('wellness', 'Aromatic Herb Blending Table', 'Participants combine dried herbs for simple calming sachets and steam bowls.', 'bright apothecary-style workshop without labels', 'five adults measuring dried lavender, mint, and citrus peel into small ceramic bowls at a clean table'),
  eventImageDefinition('wellness', 'Mobility Bands Clinic', 'A practical session explores shoulder, hip, and ankle range with light resistance.', 'sunlit neighborhood exercise room', 'six adults using different plain resistance bands while an instructor demonstrates a controlled shoulder movement'),
  eventImageDefinition('wellness', 'Floating Dock Meditation', 'A short silent practice follows the movement of water beneath a stable dock.', 'wide wooden dock on a still forest lake', 'five seated participants facing open water with shoes aligned behind their cushions'),
  eventImageDefinition('wellness', 'Restorative Stretch Hall', 'Long supported stretches use bolsters, blocks, and folded blankets.', 'renovated old gym with tall windows', 'six adults in different floor stretches supported by plain bolsters under soft window light'),
  eventImageDefinition('wellness', 'Park Hammock Pause', 'A guided rest meetup alternates short journaling with quiet hammock time.', 'shady grove in a spacious public park', 'four fabric hammocks hung safely between trees with participants resting and two friends writing in blank notebooks nearby'),
  eventImageDefinition('wellness', 'Quiet Tea Mindfulness', 'A small group practices attentive pouring, aroma, and unhurried silence.', 'minimal tatami-style community room', 'five adults kneeling around a low table as one pours tea from a plain clay pot into small cups'),
  eventImageDefinition('professional-tech', 'Repair Cafe Team Challenge', 'Small volunteer teams diagnose lamps, radios, and household devices in cooperative timed rounds.', 'library makerspace repair bench', 'two teams of three adults using screwdrivers and multimeters on different unbranded appliances as a facilitator starts the round'),
  eventImageDefinition('professional-tech', 'Civic Mapping Team Qualifier', 'Mapping teams prepare mobility-gap evidence for a friendly multi-round civic challenge.', 'municipal workshop room with large tables', 'two teams leaning over separate map-like sheets with colored dots and tracing paper while a facilitator signals the start, no readable labels'),
  eventImageDefinition('professional-tech', 'Cardboard Prototype Sprint', 'Small teams turn service ideas into testable tabletop models in one afternoon.', 'bright innovation studio', 'six adults cutting corrugated card, taping movable pieces, and testing a waist-high physical prototype'),
  eventImageDefinition('professional-tech', 'Library Mentor Office Hours', 'Founders and career changers rotate through focused twenty-minute coaching tables.', 'modern public library mezzanine', 'four mentor pairs in separate quiet conversations with laptops closed and blank sketch pads open'),
  eventImageDefinition('festival-community', 'Little Havana Courtyard Potluck', 'Neighbors bring family dishes to one shaded courtyard table with open seating.', 'colorful tropical residential courtyard', 'a diverse group setting down casserole dishes and fruit platters around a long table beneath palms'),
  eventImageDefinition('festival-community', 'Library Mentorship Milestone Map', 'A spring cohort marks completed projects and pairs up for its next shared task.', 'sunlit library project room', 'eight adults arranging colored cards and thread on a large wall map with no readable writing'),
  eventImageDefinition('festival-community', 'Spring Festival Build Crew', 'Volunteers assemble reusable bunting, route arches, and lightweight decorations.', 'covered civic workshop yard', 'ten adults tying fabric pennants and fitting painted wooden frames on trestle tables'),
  eventImageDefinition('festival-community', 'Moonlight Beach Cleanup', 'An evening shoreline crew sorts recovered material under safe portable lights.', 'broad urban beach after sunset', 'eight adults carrying buckets and separating collected litter into plain reusable bins beside tripod lights'),
  eventImageDefinition('festival-community', 'Hillside Community Garden Day', 'Neighbors repair raised beds, turn compost, and plant a shared herb row.', 'terraced neighborhood garden', 'nine adults working across timber beds with wheelbarrows, seedlings, and hand tools'),
  eventImageDefinition('festival-community', 'Donation Bicycle Repair Bench', 'Volunteer mechanics prepare donated bicycles for new riders.', 'open community cycle workshop', 'seven adults adjusting brakes, patching tubes, and checking wheels on several unbranded bicycles'),
  eventImageDefinition('festival-community', 'Desert Trail Stewardship', 'A morning crew clears loose branches and refreshes safe route markers.', 'dry desert trailhead beneath low mountains', 'six adults with rakes and work gloves securing blank wooden trail markers beside the path'),
  eventImageDefinition('festival-community', 'Winter Coat Sorting Hall', 'A neighborhood drive organizes warm clothing by size before collection day.', 'plain school assembly hall', 'ten volunteers folding coats and scarves onto long labeled-by-color tables with no readable text'),
  eventImageDefinition('festival-community', 'Mangrove Seedling Crew', 'A waterfront team pots young mangroves for a supervised restoration site.', 'shaded coastal nursery platform', 'eight adults filling small pots around rows of bright mangrove seedlings with tidal water behind'),
  eventImageDefinition('festival-community', 'Riverbank Native Planting', 'Volunteers stabilize a worn river edge with grasses and young shrubs.', 'muddy urban riverbank in daylight', 'nine adults kneeling along a curved planting line with trays of native grasses and buckets of mulch'),
  eventImageDefinition('festival-community', 'Food Rescue Packing Line', 'A fast volunteer shift turns surplus produce into balanced family boxes.', 'clean warehouse packing room', 'twelve adults passing vegetables, bread, and fruit along tables into plain reusable crates'),
  eventImageDefinition('festival-community', 'Mobile Library Book Drive', 'Neighbors sort donated books and load rolling shelves for a weekend pop-up.', 'community-center loading courtyard', 'eight volunteers carrying colorful books between open boxes and an unbranded compact library van'),
  eventImageDefinition('festival-community', 'Porch Concert Setup Crew', 'A block team lays cables, arranges chairs, and tests a tiny neighborhood stage.', 'wide residential porch and closed street', 'nine adults positioning folding chairs and plain speakers around a low wooden performance platform'),
  eventImageDefinition('festival-community', 'Public Mural Wall Prep', 'The crew cleans, primes, and grids a wall before the artists arrive.', 'sunny pedestrian underpass wall', 'seven adults rolling white primer and snapping pale guide lines across a large blank concrete surface'),
  eventImageDefinition('festival-community', 'Night Market Stall Build', 'Vendors and volunteers assemble modular counters before the evening crowd.', 'brick market square at late afternoon', 'ten adults unfolding timber stalls, hanging plain warm bulbs, and stacking empty produce crates'),
  eventImageDefinition('festival-community', 'Community Kitchen Batch Cook', 'A shared kitchen prepares soup, bread, and chopped vegetables for neighborhood delivery.', 'large stainless community kitchen', 'twelve adults working at separate prep stations around oversized pots and sheet pans'),
  eventImageDefinition('festival-community', 'Harbor Lantern Parade Workshop', 'Families and volunteers build lightweight lantern forms for a waterfront procession.', 'maritime community hall', 'nine adults shaping translucent paper around willow frames with completed blank lanterns hanging overhead'),
  eventImageDefinition('festival-community', 'Mountain Gear Swap Hall', 'Outdoor neighbors inspect, repair, and exchange clean seasonal equipment.', 'timber recreation hall near foothills', 'eight adults comparing backpacks, snowshoes, trekking poles, and folded jackets on organized tables'),
  eventImageDefinition('festival-community', 'Ferry Welcome Volunteer Team', 'A local crew prepares maps, water, and luggage help for arriving visitors.', 'covered ferry-terminal plaza', 'seven volunteers arranging plain tote bags and water bottles while a ferry docks in the background'),
  eventImageDefinition('festival-community', 'Inclusive Beach Access Setup', 'Volunteers install a temporary access mat and prepare adaptive beach equipment.', 'public beach access point in morning light', 'eight adults unrolling a wide blue access mat toward the sand beside an all-terrain beach wheelchair'),
  eventImageDefinition('festival-community', 'Rooftop Pollinator Garden Day', 'Residents refresh planters with herbs and flowers for urban bees and butterflies.', 'broad apartment rooftop garden', 'nine adults planting lavender and native flowers into large raised boxes with watering cans'),
  eventImageDefinition('festival-community', 'Community Makerspace Tool Sort', 'Members inventory donated hand tools and rebuild clear shared workstations.', 'industrial neighborhood makerspace', 'eight adults sorting clamps, hammers, saws, and safety glasses onto pegboards and benches'),
  eventImageDefinition('festival-community', 'Desert Water Refill Crew', 'A trail-support team cleans containers and prepares shaded refill points.', 'sunlit desert service yard', 'seven adults washing large plain water containers and loading them beneath a solid shade roof'),
  eventImageDefinition('social-mixer', 'Terrace Newcomer Exchange', 'New arrivals use object-based prompts to start natural small-group conversations.', 'layered city terrace with planted dividers', 'three distinct conversation clusters passing small everyday objects between them instead of posing for camera'),
  eventImageDefinition('social-mixer', 'Neon Bowling Introductions', 'Pairs change lanes between short games and cheer unfamiliar teammates.', 'retro bowling hall with abstract neon light', 'six adults celebrating a rolling ball across two lanes with multicolored rental shoes and no visible scoring text'),
  eventImageDefinition('social-mixer', 'Gallery Courtyard Mixer', 'A casual opening brings artists, neighbors, and first-time visitors around outdoor sculptures.', 'white-walled gallery courtyard', 'seven adults talking in pairs around large abstract sculptures with drinks on a side table'),
  eventImageDefinition('social-mixer', 'Desert Patio Language Exchange', 'Conversation partners switch between short rounds over mint tea.', 'shaded adobe patio with woven chairs', 'four pairs in animated conversation around separate small tables beneath patterned shade cloth'),
  eventImageDefinition('social-mixer', 'Golden Hour Rooftop Meetup', 'Sunset check-in games lead into relaxed skyline conversations.', 'open rooftop garden during golden hour', 'eight adults forming a loose semicircle around a low table of blank prompt cards and sparkling water'),
  eventImageDefinition('social-mixer', 'Greenhouse Neighbor Tea', 'Residents from nearby blocks meet among citrus trees and shared tea trays.', 'community greenhouse in soft rain', 'six neighbors holding warm cups between dense planters with raindrops visible on the glass roof'),
  eventImageDefinition('social-mixer', 'Bookshop Speed-Friending', 'Short paired conversations move through reading nooks instead of one crowded line.', 'independent bookshop after closing', 'five visible pairs seated in separate alcoves with bookshelves creating intimate partitions'),
  eventImageDefinition('social-mixer', 'Telescope Lawn Social', 'A twilight gathering alternates constellation viewing with blanket conversations.', 'open science-center lawn at dusk', 'three small groups around unbranded telescopes while others sit on blankets beneath the first visible stars'),
  eventImageDefinition('social-mixer', 'Riverside Picnic Pairings', 'Blanket groups reshuffle after each shared snack course.', 'grassy riverbank with mature trees', 'four colorful picnic blankets holding different small groups while two people carry a basket between them'),
  eventImageDefinition('social-mixer', 'Museum After-Hours Trail', 'Conversation pairs follow light-and-shadow installations through a quiet museum wing.', 'contemporary museum interior at night', 'six adults moving in pairs between large abstract light installations with no signage or readable labels'),
  eventImageDefinition('social-mixer', 'Community Dessert Social', 'Neighbors decorate small cakes together before sharing a long final table.', 'warm community kitchen dining room', 'eight adults adding fruit and icing to individual cakes around a central worktable, laughing naturally')
];

if (EVENT_IMAGE_DEFINITIONS.length !== 100) {
  throw new Error(`Expected 100 event image definitions, got ${EVENT_IMAGE_DEFINITIONS.length}`);
}
assertUniqueEventImageDefinitions(EVENT_IMAGE_DEFINITIONS);

const PROFILE_PROMPTS = [
  profilePrompt('650000000000000000000061', 'Casey Bridge', '32-year-old man', 'Austin', 'quiet, reliable small-group connector', 'leafy Austin neighborhood park', 'photo-01'),
  profilePrompt('650000000000000000000061', 'Casey Bridge', '32-year-old man', 'Austin', 'quiet, reliable small-group connector', 'casual coffee-shop terrace', 'photo-02'),
  profilePrompt('650000000000000000000062', 'Nova Social', '27-year-old woman', 'Austin', 'warm, sociable and approachable', 'bright neighborhood café terrace', 'photo-01'),
  profilePrompt('650000000000000000000062', 'Nova Social', '27-year-old woman', 'Austin', 'warm, sociable and approachable', 'lively outdoor community market', 'photo-02'),
  profilePrompt('650000000000000000000063', 'Riley Outside', '29-year-old man', 'Austin', 'adventurous, relaxed and outdoors-oriented', 'green lakeside urban trail', 'photo-01'),
  profilePrompt('650000000000000000000063', 'Riley Outside', '29-year-old man', 'Austin', 'adventurous, relaxed and outdoors-oriented', 'Austin greenbelt hiking trail', 'photo-02'),
  profilePrompt('admin-demo-ava', 'Ava Moderation', 'adult woman', 'the Safety desk', 'calm, fair and attentive moderator', 'stylized trust-and-safety operations workspace', 'photo-01', 'stylized editorial avatar'),
  profilePrompt('admin-demo-noel', 'Noel Safety', 'adult man', 'the Trust desk', 'steady, discreet and reassuring safety specialist', 'stylized trust-and-safety review workspace', 'photo-01', 'stylized editorial avatar'),
  profilePrompt('operator@myscoutee.local', 'Demo Operator', 'adult woman', 'a deployment sandbox', 'precise, capable infrastructure operator', 'stylized local deployment operations workspace', 'photo-01', 'stylized editorial avatar')
];

let assets = JSON.parse(await readFile(ASSETS_PATH, 'utf8'));
let events = JSON.parse(await readFile(EVENTS_PATH, 'utf8'));
const users = JSON.parse(await readFile(USERS_PATH, 'utf8'));
const contacts = JSON.parse(await readFile(CONTACTS_PATH, 'utf8'));
let activityMembers = JSON.parse(await readFile(ACTIVITY_MEMBERS_PATH, 'utf8'));
let activityResources = JSON.parse(await readFile(ACTIVITY_RESOURCES_PATH, 'utf8'));
let activityStageRuntime = JSON.parse(await readFile(ACTIVITY_STAGE_RUNTIME_PATH, 'utf8'));
let assetRequests = JSON.parse(await readFile(ASSET_REQUESTS_PATH, 'utf8'));
let chats = JSON.parse(await readFile(CHATS_PATH, 'utf8'));
let chatMessages = JSON.parse(await readFile(CHAT_MESSAGES_PATH, 'utf8'));
let feedbackAnswers = JSON.parse(await readFile(FEEDBACK_ANSWERS_PATH, 'utf8'));
let feedbackStates = JSON.parse(await readFile(FEEDBACK_STATES_PATH, 'utf8'));
let userNotifications = JSON.parse(await readFile(USER_NOTIFICATIONS_PATH, 'utf8'));
let userReports = JSON.parse(await readFile(USER_REPORTS_PATH, 'utf8'));

const originalEvents = [...events];
const oldEventTitleById = new Map(originalEvents.map(event => [eventKey(event), event.title]));
const qaUserRelatedStaticEventIds = collectQaUserRelatedStaticEventIds({ events, activityMembers });
const fixtureProtectedEventIds = collectFixtureProtectedEventIds({
  events,
  activityMembers,
  activityStageRuntime,
  feedbackAnswers,
  feedbackStates,
  userReports
});
const canonicalEventIds = new Set(CANONICAL_EVENT_ID_BY_SLOT);
const missingProtectedEventIds = [...fixtureProtectedEventIds].filter(eventId => !canonicalEventIds.has(eventId));
if (missingProtectedEventIds.length) {
  throw new Error(`Fixture-protected events are missing from the canonical 100: ${missingProtectedEventIds.join(', ')}`);
}
const protectedRelationshipSnapshot = eventRelationshipSnapshot({
  eventIds: fixtureProtectedEventIds,
  events,
  activityMembers,
  activityResources,
  chats
});

const assetById = new Map(assets.map(asset => [asset.assetId, asset]));
const missingCanonicalAssetIds = CANONICAL_ASSET_ID_BY_SLOT.filter(assetId => !assetById.has(assetId));
if (missingCanonicalAssetIds.length) {
  throw new Error(`Missing canonical Mongo assets: ${missingCanonicalAssetIds.join(', ')}`);
}
assets = CANONICAL_ASSET_ID_BY_SLOT.map(assetId => assetById.get(assetId));
const canonicalAssetIds = new Set(CANONICAL_ASSET_ID_BY_SLOT);
assetRequests = assetRequests.filter(request => canonicalAssetIds.has(request.assetId));
activityMembers = activityMembers.filter(member => member.ownerType !== 'asset' || canonicalAssetIds.has(member.ownerId));
userReports = userReports.filter(report => report.sourceType !== 'asset' || canonicalAssetIds.has(report.assetId));
for (const resource of activityResources) pruneActivityResourceAssets(resource, canonicalAssetIds);

const demoAssetOwnerIds = new Set(users.slice(0, 50).map(user => user.userId));
const assetCountByOwnerAndType = countAssetsByOwnerAndType(assets);
for (const user of users) {
  if (!demoAssetOwnerIds.has(user.userId)) continue;
  const counts = assetCountByOwnerAndType.get(user.userId) ?? { Transport: 0, Accommodation: 0, Supplies: 0 };
  user.activities.cars = counts.Transport;
  user.activities.accommodation = counts.Accommodation;
  user.activities.supplies = counts.Supplies;
  user.activities.asset.cars = counts.Transport;
  user.activities.asset.accommodation = counts.Accommodation;
  user.activities.asset.supplies = counts.Supplies;
}

const assetSlots = buildAssetSlots(assets);
const { slots: eventSlots, slotByEventKey } = buildEventSlots(events);
const allEventIds = new Set(originalEvents.map(eventKey));
const removedEventIds = new Set([...allEventIds].filter(eventId => !canonicalEventIds.has(eventId)));
events = CANONICAL_EVENT_ID_BY_SLOT.map(eventId => {
  const event = originalEvents.find(item => eventKey(item) === eventId);
  if (!event) throw new Error(`Missing canonical Mongo event ${eventId}`);
  return event;
});
({
  activityMembers,
  activityResources,
  activityStageRuntime,
  chats,
  chatMessages,
  feedbackAnswers,
  feedbackStates,
  userNotifications,
  userReports
} = pruneEventGraph({
  originalEvents,
  keptEvents: events,
  removedEventIds,
  activityMembers,
  activityResources,
  activityStageRuntime,
  chats,
  chatMessages,
  feedbackAnswers,
  feedbackStates,
  userNotifications,
  userReports,
  oldEventTitleById
}));
assertRelationshipSnapshotUnchanged(protectedRelationshipSnapshot, eventRelationshipSnapshot({
  eventIds: fixtureProtectedEventIds,
  events,
  activityMembers,
  activityResources,
  chats
}));
refreshUserEventCounters(users, events, activityMembers);
refreshUserNotificationCounters(users, userNotifications);
const localEventSlotBySeed = buildLocalEventSlotMap(eventSlots, slotByEventKey, events);
const { localAssetSlotBySeed, localAssetTemplateIdsByOwner } = buildLocalAssetSeedMaps(assetSlots, users);

for (const asset of assets) {
  const slot = assetSlots.find(item => item.mongoAssetIds.includes(asset.assetId));
  if (!slot) throw new Error(`No image slot for asset ${asset.assetId}`);
  asset.imageUrl = mediaUrl(slot.minioKey);
  if (`${asset.sourceLink ?? ''}`.includes('picsum.photos/')) asset.sourceLink = '';
}
const assetTitleById = new Map(assets.map(asset => [asset.assetId, asset.title]));
for (const member of activityMembers) {
  if (member.ownerType !== 'asset') continue;
  const title = assetTitleById.get(member.ownerId);
  if (title) member.metWhere = title;
}
for (const report of userReports) {
  if (report.sourceType !== 'asset') continue;
  const title = assetTitleById.get(report.assetId);
  if (title) report.sourceText = `${title} request needs moderation review.`;
}
for (const event of events) {
  const slotNumber = slotByEventKey.get(eventKey(event));
  if (!slotNumber) throw new Error(`No image slot for event ${eventKey(event)}`);
  event.imageUrl = mediaUrl(eventMinioKey(slotNumber));
}
const profileImagesByUserId = new Map();
for (const profile of PROFILE_PROMPTS) {
  const profiles = profileImagesByUserId.get(profile.userId) ?? [];
  profiles.push(profile);
  profileImagesByUserId.set(profile.userId, profiles);
}
for (const [userId, profiles] of profileImagesByUserId) {
  const user = users.find(item => item.userId === userId);
  if (!user) throw new Error(`Missing profile user ${userId}`);
  user.images = profiles.map(profile => mediaUrl(profile.minioKey));
}
for (const record of contacts) {
  for (const contact of record.contacts ?? []) {
    if (`${contact.avatarUrl ?? ''}`.startsWith('http')) {
      contact.avatarUrl = mediaUrl(`images/demo-profiles/${contact.userId}/photo-01/large.webp`);
    }
  }
}

const manifest = {
  version: 3,
  purpose: 'One-to-one canonical, context-aware demo image pools for the standalone HTTP deployment.',
  generatedImages: {
    assetCount: assetSlots.length,
    eventCount: eventSlots.length,
    additionalProfileCount: PROFILE_PROMPTS.length,
    totalNewLargeImages: assetSlots.length + eventSlots.length + PROFILE_PROMPTS.length
  },
  landscapeVariants: {
    large: { width: 1280, height: 720 },
    medium: { width: 640, height: 360 },
    small: { width: 128, height: 72 }
  },
  profileVariants: {
    large: { width: 960, height: 1280 },
    medium: { width: 480, height: 640 },
    small: { width: 96, height: 128 }
  },
  assets: assetSlots,
  events: eventSlots,
  additionalProfiles: PROFILE_PROMPTS,
  reusedNavigatorProfileImages: contacts.flatMap(record => (record.contacts ?? []).map(contact => ({
    userId: contact.userId,
    name: contact.name,
    avatarUrl: contact.avatarUrl
  })))
};
const frontendHelper = buildFrontendHelper(
  eventSlots,
  localEventSlotBySeed,
  localAssetSlotBySeed,
  localAssetTemplateIdsByOwner
);

if (missingMode) {
  const prompts = [
    ...assetSlots.map(slot => ({ kind: 'asset', key: slot.key, minioKey: slot.minioKey, prompt: slot.prompt })),
    ...eventSlots.map(slot => ({ kind: 'event', key: slot.key, minioKey: slot.minioKey, prompt: slot.prompt })),
    ...PROFILE_PROMPTS.map(profile => ({ kind: 'profile', key: profile.userId, minioKey: profile.minioKey, prompt: profile.prompt }))
  ];
  const missing = [];
  for (const item of prompts) {
    const filePath = path.join(ROOT, 'server/docker/conf/minio/media', item.minioKey);
    try {
      await access(filePath);
    } catch {
      missing.push(item);
    }
  }
  process.stdout.write(`${JSON.stringify(missing)}\n`);
  process.exit(0);
}

const expected = new Map([
  [ASSETS_PATH, `${JSON.stringify(assets, null, 2)}\n`],
  [EVENTS_PATH, `${JSON.stringify(events, null, 2)}\n`],
  [USERS_PATH, `${JSON.stringify(users, null, 2)}\n`],
  [CONTACTS_PATH, `${JSON.stringify(contacts, null, 2)}\n`],
  [ACTIVITY_MEMBERS_PATH, `${JSON.stringify(activityMembers, null, 2)}\n`],
  [ACTIVITY_RESOURCES_PATH, `${JSON.stringify(activityResources, null, 2)}\n`],
  [ACTIVITY_STAGE_RUNTIME_PATH, `${JSON.stringify(activityStageRuntime, null, 2)}\n`],
  [ASSET_REQUESTS_PATH, `${JSON.stringify(assetRequests, null, 2)}\n`],
  [CHATS_PATH, `${JSON.stringify(chats, null, 2)}\n`],
  [CHAT_MESSAGES_PATH, `${JSON.stringify(chatMessages, null, 2)}\n`],
  [FEEDBACK_ANSWERS_PATH, `${JSON.stringify(feedbackAnswers, null, 2)}\n`],
  [FEEDBACK_STATES_PATH, `${JSON.stringify(feedbackStates, null, 2)}\n`],
  [USER_NOTIFICATIONS_PATH, `${JSON.stringify(userNotifications, null, 2)}\n`],
  [USER_REPORTS_PATH, `${JSON.stringify(userReports, null, 2)}\n`],
  [FRONTEND_HELPER_PATH, frontendHelper],
  [MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`]
]);

if (writeMode) {
  for (const [filePath, contents] of expected) await writeFile(filePath, contents);
  console.log(JSON.stringify(summary(manifest, localEventSlotBySeed, localAssetTemplateIdsByOwner), null, 2));
} else {
  const mismatches = [];
  for (const [filePath, contents] of expected) {
    let actual = '';
    try { actual = await readFile(filePath, 'utf8'); } catch { /* reported below */ }
    if (actual !== contents) mismatches.push(path.relative(ROOT, filePath));
  }
  if (mismatches.length) throw new Error(`Demo image pool is out of sync: ${mismatches.join(', ')}`);
  console.log(JSON.stringify(summary(manifest, localEventSlotBySeed, localAssetTemplateIdsByOwner), null, 2));
}

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function assetDefinition(title, subtitle, details, category = null) {
  return { title, subtitle, details, category };
}

function eventImageDefinition(category, title, subtitle, location, visual) {
  return { category, title, subtitle, location, visual };
}

function assertUniqueEventImageDefinitions(definitions) {
  for (const field of ['title', 'subtitle', 'location', 'visual']) {
    const values = definitions.map(definition => normalize(definition[field]));
    const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
    if (duplicates.length) {
      throw new Error(`Event image definitions must have unique ${field} values: ${[...new Set(duplicates)].join(', ')}`);
    }
  }
}

function category(key, keywords) {
  return { key, keywords };
}

function mediaUrl(key) {
  return `/media/public?key=${key}`;
}

function assetMinioKey(slot) {
  return `images/demo-assets/asset-${pad(slot)}/v1/large.webp`;
}

function eventMinioKey(slot) {
  return `images/demo-events/event-${pad(slot)}/v1/large.webp`;
}

function pad(value) {
  return `${value}`.padStart(3, '0');
}

function normalize(value) {
  return `${value ?? ''}`
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function eventKey(event) {
  return `${event.sourceId ?? event._id?.$oid ?? event.syncKey}`;
}

function featureTokens(event) {
  const weighted = [
    ...normalize(event.title).split(' ').flatMap(token => [token, token, token]),
    ...normalize(event.subtitle).split(' ').flatMap(token => [token, token]),
    ...(event.topics ?? []).flatMap(topic => normalize(topic).split(' ')),
    ...normalize(event.mode).split(' ')
  ];
  const ignored = new Set(['a', 'an', 'and', 'at', 'demo', 'event', 'for', 'in', 'of', 'the', 'to', 'with']);
  return new Set(weighted.map(stem).filter(token => token.length > 1 && !ignored.has(token)));
}

function stem(token) {
  const synonyms = {
    cycling: 'bike', bicycle: 'bike', bikes: 'bike',
    photography: 'photo', photographer: 'photo', photos: 'photo',
    running: 'run', runners: 'run',
    dining: 'food', foodie: 'food', dinner: 'food', supper: 'food',
    meetup: 'social', mixer: 'social', gathering: 'social', exchange: 'social', session: 'social',
    games: 'game', gaming: 'game',
    creative: 'create', creativity: 'create', creators: 'create'
  };
  return synonyms[token] ?? token.replace(/(ing|ers|ies|s)$/u, '');
}

function similarity(left, right) {
  const a = featureTokens(left);
  const b = featureTokens(right);
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection += 1;
  const union = new Set([...a, ...b]).size || 1;
  const titleBonus = normalize(left.title) === normalize(right.title) ? 2 : 0;
  return titleBonus + (intersection / union);
}

function classifyEvent(event) {
  const title = ` ${normalize(event.title)} `;
  const subtitle = ` ${normalize(event.subtitle)} `;
  const topics = ` ${normalize((event.topics ?? []).join(' '))} `;
  let best = EVENT_CATEGORIES.at(-1);
  let bestScore = 0;
  for (const item of EVENT_CATEGORIES.slice(0, -1)) {
    let score = 0;
    for (const keyword of item.keywords) {
      const normalized = normalize(keyword);
      if (title.includes(` ${normalized} `)) score += 7;
      if (subtitle.includes(` ${normalized} `)) score += 3;
      if (topics.includes(` ${normalized} `)) score += 1;
    }
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  }
  return best.key;
}

function pruneActivityResourceAssets(resource, allowedAssetIds) {
  for (const [type, assetIds] of Object.entries(resource.assetAssignmentIds ?? {})) {
    resource.assetAssignmentIds[type] = (assetIds ?? []).filter(assetId => allowedAssetIds.has(assetId));
  }
  for (const [type, settingsByAssetId] of Object.entries(resource.assetSettingsByType ?? {})) {
    resource.assetSettingsByType[type] = Object.fromEntries(
      Object.entries(settingsByAssetId ?? {}).filter(([assetId]) => allowedAssetIds.has(assetId))
    );
  }
  resource.supplyContributionEntriesByAssetId = Object.fromEntries(
    Object.entries(resource.supplyContributionEntriesByAssetId ?? {})
      .filter(([assetId]) => allowedAssetIds.has(assetId))
  );
}

function countAssetsByOwnerAndType(records) {
  const result = new Map();
  for (const asset of records) {
    const counts = result.get(asset.ownerUserId) ?? { Transport: 0, Accommodation: 0, Supplies: 0 };
    if (!(asset.type in counts)) throw new Error(`Unsupported asset type ${asset.type}`);
    counts[asset.type] += 1;
    result.set(asset.ownerUserId, counts);
  }
  return result;
}

function buildLocalAssetSeedMaps(assetSlots, mongoUsers) {
  const localUserIdByMongoUserId = new Map(
    mongoUsers.slice(0, 50).map((user, index) => [user.userId, `u${index + 1}`])
  );
  const localAssetSlotBySeed = {};
  const localAssetTemplateIdsByOwner = Object.fromEntries(
    mongoUsers.slice(0, 50).map((_, index) => [`u${index + 1}`, []])
  );

  for (const slot of assetSlots) {
    if (slot.mongoRecords.length !== 1) {
      throw new Error(`Asset slot ${slot.slot} must have exactly one Mongo record`);
    }
    const record = slot.mongoRecords[0];
    const localOwnerUserId = localUserIdByMongoUserId.get(record.ownerUserId);
    if (!localOwnerUserId) throw new Error(`No frontend-local user for Mongo owner ${record.ownerUserId}`);
    const templateId = localAssetTemplateId(slot.slot, localOwnerUserId);
    const seed = `${localOwnerUserId}-${templateId}`;
    if (localAssetSlotBySeed[seed]) throw new Error(`Duplicate frontend-local asset seed ${seed}`);
    localAssetSlotBySeed[seed] = slot.slot;
    localAssetTemplateIdsByOwner[localOwnerUserId].push(templateId);
  }

  return { localAssetSlotBySeed, localAssetTemplateIdsByOwner };
}

function localAssetTemplateId(slot, localOwnerUserId) {
  // Keep the explicit asset-manager showcase connected while preserving the
  // canonical Mongo owner for slot 35.
  if (slot === 35 && localOwnerUserId === 'u4') return 'asset-transport-3';
  if (slot <= 4) return 'asset-sup-1';
  if (slot <= 8) return 'asset-sup-4';
  if (slot <= 12) return 'asset-sup-2';
  if (slot <= 16) return 'asset-sup-3';
  if (slot <= 20) return 'asset-acc-1';
  if (slot <= 24) return 'asset-acc-3';
  if (slot <= 28) return 'asset-acc-2';
  if (slot <= 32) return 'asset-acc-4';
  if (slot <= 36) return 'asset-transport-1';
  if (slot <= 39 || (slot >= 46 && slot <= 47)) return 'asset-transport-2';
  if (slot <= 45) return 'asset-transport-3';
  return 'asset-transport-4';
}

function buildAssetSlots(records) {
  const variations = [
    'soft morning light and a slightly elevated three-quarter view',
    'clear midday light and a clean eye-level documentary view',
    'warm late-afternoon light with natural real-world texture',
    'soft overcast light with a practical catalog-like composition',
    'golden-hour light with the subject centered and fully readable',
    'bright shade with subtle environmental context and realistic wear',
    'calm early-evening light with a balanced three-quarter composition',
    'natural window or ambient light with an uncluttered background'
  ];
  const slotByAssetId = new Map();
  const newSlotByTitle = new Map(
    Object.entries(ASSET_SEED_DEFINITION_BY_SLOT).map(([slot, definition]) => [definition.title, Number(slot)])
  );

  for (const asset of records) {
    const imageSlot = parseAssetSlot(asset.imageUrl);
    const titleSlot = newSlotByTitle.get(asset.title);
    const slot = imageSlot ?? titleSlot;
    if (slot) slotByAssetId.set(asset.assetId, slot);
  }

  for (const group of ASSET_SLOT_GROUPS) {
    const unresolved = records.filter(asset => !slotByAssetId.has(asset.assetId) && asset.title === group.title);
    for (const [index, asset] of unresolved.entries()) {
      slotByAssetId.set(asset.assetId, group.slots[index % group.slots.length]);
    }
  }

  const unassigned = records.filter(asset => !slotByAssetId.has(asset.assetId));
  if (unassigned.length) {
    throw new Error(`No stable image slot for assets: ${unassigned.map(asset => asset.assetId).join(', ')}`);
  }

  for (const asset of records) {
    const slot = slotByAssetId.get(asset.assetId);
    const definition = ASSET_SEED_DEFINITION_BY_SLOT[slot];
    if (!definition) throw new Error(`Missing seed definition for asset slot ${slot}`);
    asset.title = definition.title;
    asset.subtitle = definition.subtitle;
    asset.details = definition.details;
    if (definition.category) asset.category = definition.category;
  }

  const slots = range(1, 50).map(slotNumber => {
    const assigned = records.filter(asset => slotByAssetId.get(asset.assetId) === slotNumber);
    if (!assigned.length) throw new Error(`Asset slot ${slotNumber} has no Mongo records`);
    const definition = ASSET_SEED_DEFINITION_BY_SLOT[slotNumber];
    const slotVisual = ASSET_SCENE_BY_SLOT[slotNumber];
    if (!slotVisual) throw new Error(`Missing unique visual specification for asset slot ${slotNumber}`);
    return {
      slot: slotNumber,
      key: `asset-${pad(slotNumber)}`,
      minioKey: assetMinioKey(slotNumber),
      frontendPlaceholderUrl: `https://picsum.photos/id/${ASSET_PICSUM_IDS[slotNumber - 1]}/1200/700`,
      context: {
        type: assigned[0].type,
        category: assigned[0].category,
        title: definition.title,
        subtitle: definition.subtitle,
        details: definition.details,
        visual: slotVisual
      },
      prompt: assetPrompt(definition, variations[(slotNumber - 1) % variations.length], slotNumber, slotVisual),
      mongoAssetIds: assigned.map(asset => asset.assetId),
      mongoRecords: assigned.map(asset => ({
        assetId: asset.assetId,
        ownerUserId: asset.ownerUserId,
        title: asset.title,
        subtitle: asset.subtitle,
        details: asset.details,
        category: asset.category,
        visibility: asset.visibility,
        status: asset.status
      }))
    };
  });
  return slots;
}

function parseAssetSlot(imageUrl) {
  const match = `${imageUrl ?? ''}`.match(/images\/demo-assets\/asset-(\d{3})\/v1\/large\.webp/);
  if (!match) return null;
  const slot = Number(match[1]);
  return slot >= 1 && slot <= 50 ? slot : null;
}

function assetPrompt(definition, variation, slotNumber, slotVisual) {
  return [
    'Use case: product-mockup',
    'Asset type: mobile-first asset card cover for a social event application',
    `Primary request: create a believable photorealistic image of ${slotVisual}.`,
    `Seed asset: "${definition.title}" — ${definition.subtitle}. ${definition.details}`,
    `Scene/backdrop: follow this slot-specific environment exactly; visual identity ${pad(slotNumber)} must have a clearly different setting, object arrangement and silhouette from neighboring pool images.`,
    `Composition/framing: landscape 16:9, ${variation}; keep the main asset centered and recognizable even as a small thumbnail.`,
    'Lighting/mood: natural, friendly, practical and not luxury-advertising polished.',
    'Constraints: entirely fictional generated scene; no identifiable real person; no logos, brand marks, badges, license plates, labels, captions, UI, text or watermark; every equipment surface must be blank and unmarked, and every image corner must be clear; no protected medical emblems such as the Red Cross, Red Crescent or Star of Life; render the exact slot-specific equipment instead of substituting a generic outdoor or equipment-kit subject.',
    slotNumber === 1
      ? 'Camping exception: this is the only asset slot allowed to contain a tent.'
      : 'Hard exclusion: no tent, fabric canopy, tarp shelter, bivouac, glamping structure or tent-like object anywhere in the foreground or background.',
    'Avoid: unrelated objects, surreal details, excessive clutter, distorted vehicles, impossible rooms, stock-photo collage aesthetics.'
  ].join('\n');
}

function buildEventSlots(records) {
  const eventById = new Map(records.map(event => [eventKey(event), event]));
  const slots = CANONICAL_EVENT_ID_BY_SLOT.map((eventId, index) => {
    const slotNumber = index + 1;
    const event = eventById.get(eventId);
    if (!event) throw new Error(`Missing canonical Mongo event ${eventId} for slot ${pad(slotNumber)}`);
    const imageConcept = EVENT_IMAGE_DEFINITIONS[index];
    applyEventImageDefinition(event, imageConcept);
    const sourceRepresentative = eventSummary(event);
    return {
      slot: slotNumber,
      key: `event-${pad(slotNumber)}`,
      category: imageConcept.category,
      minioKey: eventMinioKey(slotNumber),
      frontendPlaceholderUrl: `https://picsum.photos/id/${EVENT_PICSUM_IDS[index]}/1200/700`,
      representative: eventSummary(event),
      sourceRepresentative,
      imageConcept,
      prompt: eventPrompt(imageConcept, slotNumber),
      mongoEventIds: [eventId],
      mongoRecords: [eventSummary(event)]
    };
  });
  const slotByEventKey = new Map(slots.map(slot => [slot.mongoEventIds[0], slot.slot]));
  return { slots, slotByEventKey };
}

function buildListWindowConflicts(events, windowSize) {
  const conflicts = new Map(events.map(event => [eventKey(event), new Set()]));
  const originalIndex = new Map(events.map((event, index) => [eventKey(event), index]));
  const orders = [
    [...events].sort((left, right) => `${right.startAtIso ?? ''}`.localeCompare(`${left.startAtIso ?? ''}`) || eventKey(left).localeCompare(eventKey(right))),
    [...events].sort((left, right) => `${right.updatedDate ?? ''}`.localeCompare(`${left.updatedDate ?? ''}`) || eventKey(left).localeCompare(eventKey(right))),
    [...events].sort((left, right) => (Number(right.affinity) || 0) - (Number(left.affinity) || 0) || eventKey(left).localeCompare(eventKey(right))),
    [...events].sort((left, right) => (Number(right.affinity) || 0) - (Number(left.affinity) || 0) || originalIndex.get(eventKey(left)) - originalIndex.get(eventKey(right))),
    [...events].sort((left, right) => (Number(right.boost) || 0) - (Number(left.boost) || 0) || eventKey(left).localeCompare(eventKey(right))),
    [...events].sort((left, right) => (Number(right.boost) || 0) - (Number(left.boost) || 0) || originalIndex.get(eventKey(left)) - originalIndex.get(eventKey(right)))
  ];
  for (const ordered of orders) {
    for (let leftIndex = 0; leftIndex < ordered.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < Math.min(ordered.length, leftIndex + windowSize); rightIndex += 1) {
        const leftKey = eventKey(ordered[leftIndex]);
        const rightKey = eventKey(ordered[rightIndex]);
        conflicts.get(leftKey).add(rightKey);
        conflicts.get(rightKey).add(leftKey);
      }
    }
  }
  return conflicts;
}

function allocateEventSlots(byCategory, total) {
  const active = EVENT_CATEGORIES.filter(item => (byCategory.get(item.key) ?? []).length > 0);
  const allocation = new Map(active.map(item => [item.key, Math.min(5, byCategory.get(item.key).length)]));
  let remaining = total - [...allocation.values()].reduce((sum, value) => sum + value, 0);
  while (remaining > 0) {
    const selected = active
      .filter(item => allocation.get(item.key) < byCategory.get(item.key).length)
      .sort((left, right) => {
        const leftScore = byCategory.get(left.key).length / (allocation.get(left.key) + 1);
        const rightScore = byCategory.get(right.key).length / (allocation.get(right.key) + 1);
        return rightScore - leftScore || left.key.localeCompare(right.key);
      })[0];
    if (!selected) throw new Error('Cannot allocate all event image slots.');
    allocation.set(selected.key, allocation.get(selected.key) + 1);
    remaining -= 1;
  }
  return allocation;
}

function chooseDiverseEvents(events, count) {
  const unique = [];
  const seen = new Set();
  for (const event of [...events].sort((left, right) => eventKey(left).localeCompare(eventKey(right)))) {
    const signature = `${normalize(event.title)}|${normalize(event.subtitle)}`;
    if (seen.has(signature)) continue;
    seen.add(signature);
    unique.push(event);
  }
  const candidates = unique.length >= count ? unique : [...unique, ...events.filter(event => !unique.includes(event))];
  const selected = [candidates[0]];
  while (selected.length < count) {
    const next = candidates
      .filter(candidate => !selected.includes(candidate))
      .map(candidate => ({ candidate, nearest: Math.max(...selected.map(item => similarity(candidate, item))) }))
      .sort((left, right) => left.nearest - right.nearest || eventKey(left.candidate).localeCompare(eventKey(right.candidate)))[0]?.candidate;
    if (!next) throw new Error(`Cannot select ${count} diverse events from ${events.length} records.`);
    selected.push(next);
  }
  return selected;
}

function eventSummary(event) {
  return {
    sourceId: eventKey(event),
    title: event.title,
    subtitle: event.subtitle,
    topics: event.topics ?? [],
    mode: event.mode ?? 'Casual',
    location: event.location ?? '',
    startAtIso: event.startAtIso ?? ''
  };
}

function applyEventImageDefinition(event, definition) {
  const city = `${event.creatorCity ?? ''}`.trim();
  event.title = definition.title;
  event.subtitle = definition.subtitle;
  event.location = city ? `${city} · ${definition.location}` : definition.location;
  event.topics = eventTopics(definition.category);
  const childCollections = [event.subEventDefinitions, event.subEvents].filter(Array.isArray);
  for (const children of childCollections) {
    for (const [index, child] of children.entries()) {
      if (child && typeof child === 'object' && 'description' in child) {
        child.description = `${definition.subtitle} (${index + 1}/${children.length})`;
      }
    }
  }
}

function eventTopics(categoryKey) {
  const values = {
    'winter-mountain': ['#WinterSports', '#Outdoors', '#Travel'],
    'court-sports': ['#Sports', '#Tournament', '#HealthyLifestyle'],
    cycling: ['#Cycling', '#Outdoors', '#Community'],
    'running-fitness': ['#Running', '#Fitness', '#HealthyLifestyle'],
    'walking-outdoors': ['#Walking', '#Outdoors', '#Nature'],
    'beach-water': ['#WaterSports', '#Outdoors', '#Nature'],
    'coffee-brunch': ['#CoffeeMeetup', '#Brunch', '#Friends'],
    'dining-tasting': ['#Food', '#Cooking', '#Friends'],
    'music-nightlife': ['#Music', '#GoingOut', '#Culture'],
    'creative-culture': ['#Creativity', '#Art', '#Culture'],
    wellness: ['#Wellness', '#MentalHealth', '#HealthyLifestyle'],
    'professional-tech': ['#Workshop', '#Networking', '#Technology'],
    'festival-community': ['#Community', '#Volunteering', '#Festival'],
    games: ['#Games', '#Friends', '#Competition'],
    'social-mixer': ['#Social', '#Friends', '#Community']
  };
  return values[categoryKey] ?? ['#Social', '#Community'];
}

function collectFixtureProtectedEventIds({
  events,
  activityMembers,
  activityStageRuntime,
  feedbackAnswers,
  feedbackStates,
  userReports
}) {
  const eventIds = new Set(events.map(eventKey));
  const protectedIds = new Set(
    events
      .filter(event => eventKey(event).startsWith('demo-tournament-'))
      .map(eventKey)
  );
  for (const eventId of collectQaUserRelatedStaticEventIds({ events, activityMembers })) protectedIds.add(eventId);
  for (const record of [
    ...activityStageRuntime,
    ...feedbackAnswers,
    ...feedbackStates,
    ...userReports.filter(report => report.sourceType === 'event')
  ]) {
    for (const candidate of [record.eventId, record.sourceId, record.ownerId]) {
      const scopedEventId = parentEventId(candidate, eventIds);
      if (scopedEventId) protectedIds.add(scopedEventId);
    }
  }
  return protectedIds;
}

function collectQaUserRelatedStaticEventIds({ events, activityMembers }) {
  const eventIds = new Set(events.map(eventKey));
  const relatedEventIds = new Set();
  for (const event of events) {
    const relatedUserIds = [
      event.ownerUserId,
      event.creatorUserId,
      ...(event.admins ?? []),
      ...(event.acceptedMemberUserIds ?? []),
      ...(event.pendingMemberUserIds ?? []),
      ...(event.pendingRequestMemberUserIds ?? []),
      ...(event.invitedMemberUserIds ?? [])
    ];
    if (relatedUserIds.some(userId => QA_RELATION_USER_IDS.has(userId))) relatedEventIds.add(eventKey(event));
  }
  for (const member of activityMembers) {
    if (member.ownerType === 'event' && QA_RELATION_USER_IDS.has(member.userId) && eventIds.has(member.ownerId)) {
      relatedEventIds.add(member.ownerId);
    }
  }
  return relatedEventIds;
}

function eventRelationshipSnapshot({ eventIds, events, activityMembers, activityResources, chats }) {
  const protectedEvents = events.filter(event => eventIds.has(eventKey(event)));
  return JSON.stringify({
    events: protectedEvents.map(event => ({
      id: eventKey(event),
      ownerUserId: event.ownerUserId,
      creatorUserId: event.creatorUserId,
      admins: sortedStrings(event.admins),
      acceptedMemberUserIds: sortedStrings(event.acceptedMemberUserIds),
      pendingMemberUserIds: sortedStrings(event.pendingMemberUserIds),
      pendingRequestMemberUserIds: sortedStrings(event.pendingRequestMemberUserIds),
      invitedMemberUserIds: sortedStrings(event.invitedMemberUserIds),
      childIds: [...collectEventChildIds([event])].sort()
    })).sort((left, right) => left.id.localeCompare(right.id)),
    members: activityMembers
      .filter(member => parentEventId(member.ownerId, eventIds))
      .map(member => ({
        ownerType: member.ownerType,
        ownerId: member.ownerId,
        userId: member.userId,
        role: member.role,
        status: member.status,
        requestKind: member.requestKind,
        pendingSource: member.pendingSource,
        invitedByUserId: member.invitedByUserId
      }))
      .sort(compareJson),
    resources: activityResources
      .filter(resource => parentEventId(resource.ownerId, eventIds))
      .map(resource => ({
        ownerId: resource.ownerId,
        subEventId: resource.subEventId,
        assetOwnerUserId: resource.assetOwnerUserId
      }))
      .sort(compareJson),
    chats: chats
      .filter(chat => eventIds.has(chat.eventId))
      .map(chat => ({
        id: chat.id,
        eventId: chat.eventId,
        subEventId: chat.subEventId,
        groupId: chat.groupId,
        ownerUserId: chat.ownerUserId,
        memberIds: sortedStrings(chat.memberIds)
      }))
      .sort(compareJson)
  });
}

function assertRelationshipSnapshotUnchanged(before, after) {
  if (before !== after) throw new Error('Fixture-protected event relationship graph changed during synchronization.');
}

function pruneEventGraph({
  originalEvents,
  keptEvents,
  removedEventIds,
  activityMembers,
  activityResources,
  activityStageRuntime,
  chats,
  chatMessages,
  feedbackAnswers,
  feedbackStates,
  userNotifications,
  userReports,
  oldEventTitleById
}) {
  const keptEventIds = new Set(keptEvents.map(eventKey));
  const keptChats = chats.filter(chat => !chat.eventId || keptEventIds.has(chat.eventId));
  const keptChatIds = new Set(keptChats.flatMap(chat => [chat.id, chat._id]).filter(Boolean));

  activityResources = activityResources.filter(resource => {
    return Boolean(parentEventId(resource.ownerId, keptEventIds));
  });
  activityStageRuntime = activityStageRuntime.filter(runtime => {
    return Boolean(parentEventId(runtime.ownerId, keptEventIds));
  });
  activityMembers = activityMembers.filter(member => {
    if (member.ownerType === 'asset') return true;
    return Boolean(parentEventId(member.ownerId, keptEventIds));
  });
  chatMessages = chatMessages.filter(message => keptChatIds.has(message.chatId));
  feedbackAnswers = feedbackAnswers.filter(answer => !removedEventIds.has(answer.eventId));
  feedbackStates = feedbackStates.filter(state => !removedEventIds.has(state.eventId));
  userNotifications = userNotifications.filter(notification => !referencesAnyId(notification, removedEventIds));
  userReports = userReports.filter(report => !referencesAnyId(report, removedEventIds));

  const newEventTitleById = new Map(keptEvents.map(event => [eventKey(event), event.title]));
  for (const member of activityMembers) {
    if (member.ownerType !== 'event' || !keptEventIds.has(member.ownerId)) continue;
    replaceEventTitleReferences(member, member.ownerId, oldEventTitleById, newEventTitleById);
    member.metWhere = newEventTitleById.get(member.ownerId);
  }
  for (const chat of keptChats) {
    if (!keptEventIds.has(chat.eventId)) continue;
    replaceEventTitleReferences(chat, chat.eventId, oldEventTitleById, newEventTitleById);
    if (chat.channelType === 'mainEvent') chat.title = newEventTitleById.get(chat.eventId);
  }
  for (const collection of [userNotifications, userReports]) {
    for (const record of collection) {
      for (const eventId of referencedIds(record, keptEventIds)) {
        replaceEventTitleReferences(record, eventId, oldEventTitleById, newEventTitleById);
      }
    }
  }

  return {
    activityMembers,
    activityResources,
    activityStageRuntime,
    chats: keptChats,
    chatMessages,
    feedbackAnswers,
    feedbackStates,
    userNotifications,
    userReports
  };
}

function collectEventChildIds(events) {
  const result = new Set();
  const visit = value => {
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (!value || typeof value !== 'object') return;
    if (typeof value.id === 'string' && value.id.trim()) result.add(value.id);
    for (const [key, item] of Object.entries(value)) {
      if (key !== 'id') visit(item);
    }
  };
  for (const event of events) {
    visit(event.subEvents ?? []);
    visit(event.subEventDefinitions ?? []);
  }
  return result;
}

function parentEventId(ownerId, eventIds) {
  const normalized = `${ownerId ?? ''}`.trim();
  if (!normalized) return null;
  if (eventIds.has(normalized)) return normalized;
  return [...eventIds]
    .filter(eventId => normalized.startsWith(`${eventId}:`))
    .sort((left, right) => right.length - left.length)[0] ?? null;
}

function referencesAnyId(value, ids) {
  if (typeof value === 'string') return ids.has(value);
  if (Array.isArray(value)) return value.some(item => referencesAnyId(item, ids));
  if (!value || typeof value !== 'object') return false;
  return Object.values(value).some(item => referencesAnyId(item, ids));
}

function referencedIds(value, ids, result = new Set()) {
  if (typeof value === 'string') {
    if (ids.has(value)) result.add(value);
    return result;
  }
  if (Array.isArray(value)) {
    for (const item of value) referencedIds(item, ids, result);
    return result;
  }
  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) referencedIds(item, ids, result);
  }
  return result;
}

function replaceEventTitleReferences(value, eventId, oldEventTitleById, newEventTitleById) {
  const oldTitle = `${oldEventTitleById.get(eventId) ?? ''}`.trim();
  const newTitle = `${newEventTitleById.get(eventId) ?? ''}`.trim();
  if (!oldTitle || !newTitle || oldTitle === newTitle) return;
  replaceTextDeep(value, oldTitle, newTitle);
}

function replaceTextDeep(value, oldText, newText) {
  if (Array.isArray(value)) {
    for (const item of value) replaceTextDeep(item, oldText, newText);
    return;
  }
  if (!value || typeof value !== 'object') return;
  for (const [key, item] of Object.entries(value)) {
    if (typeof item === 'string') value[key] = item.split(oldText).join(newText);
    else replaceTextDeep(item, oldText, newText);
  }
}

function refreshUserEventCounters(users, events, activityMembers) {
  const now = Date.now();
  const membershipsByEventAndUser = new Map(
    activityMembers
      .filter(member => member.ownerType === 'event')
      .map(member => [`${member.ownerId}\u0000${member.userId}`, member])
  );
  for (const user of users) {
    const userId = user.userId;
    const counters = { active: 0, pending: 0, invitations: 0, hosting: 0, drafts: 0, trash: 0 };
    const allSources = new Set();
    for (const event of events) {
      const eventId = eventKey(event);
      const member = membershipsByEventAndUser.get(`${eventId}\u0000${userId}`);
      const hosting = event.ownerUserId === userId || event.creatorUserId === userId || (event.admins ?? []).includes(userId);
      const invited = (event.invitedMemberUserIds ?? []).includes(userId)
        || (member?.status === 'pending' && member?.requestKind === 'invite');
      const pendingRequest = (event.pendingRequestMemberUserIds ?? []).includes(userId)
        || (member?.status === 'pending' && member?.requestKind !== 'invite');
      const accepted = (event.acceptedMemberUserIds ?? []).includes(userId) || member?.status === 'accepted';
      const deleted = ['deleted', 'd'].includes(`${member?.status ?? ''}`.trim().toLowerCase());
      if (!hosting && !invited && !pendingRequest && !accepted && !deleted) continue;
      const status = `${event.status ?? ''}`.trim().toUpperCase();
      if (status === 'T' || event.isTrashed === true || deleted) {
        counters.trash += 1;
        continue;
      }
      const end = Date.parse(event.endAtIso || event.startAtIso || '');
      if (Number.isFinite(end) && end <= now) continue;
      if (invited) {
        counters.invitations += 1;
      } else if (hosting) {
        counters.hosting += 1;
        if (status === 'D' || event.published === false) counters.drafts += 1;
        if (status === 'UR' || status === 'B') counters.pending += 1;
      } else if (pendingRequest || status === 'UR' || status === 'B') {
        counters.pending += 1;
      } else if (accepted || status === 'A' || !status) {
        counters.active += 1;
      } else {
        continue;
      }
      allSources.add(eventId);
    }
    const all = allSources.size;
    user.activities ??= {};
    user.activities.event ??= {};
    user.activities.events = counters.active;
    user.activities.invitations = counters.invitations;
    user.activities.hosting = counters.hosting;
    Object.assign(user.activities.event, { all, ...counters });
  }
}

function refreshUserNotificationCounters(users, notifications) {
  const unreadByUserId = new Map();
  for (const notification of notifications) {
    if (notification.readAtIso) continue;
    unreadByUserId.set(notification.recipientUserId, (unreadByUserId.get(notification.recipientUserId) ?? 0) + 1);
  }
  for (const user of users) {
    user.activities ??= {};
    user.activities.notifications = unreadByUserId.get(user.userId) ?? 0;
  }
}

function sortedStrings(values) {
  return [...new Set((values ?? []).filter(value => typeof value === 'string'))].sort();
}

function compareJson(left, right) {
  return JSON.stringify(left).localeCompare(JSON.stringify(right));
}

function eventPrompt(definition, slotNumber) {
  const compositions = [
    'wide establishing view from slightly above the activity',
    'eye-level medium-wide view from the edge of the group',
    'low three-quarter view with the action crossing the frame diagonally',
    'documentary side view with one foreground object adding depth',
    'symmetrical frontal view centered on the shared activity',
    'over-the-shoulder view that reveals the other participants and venue',
    'long-lens candid view with layered foreground and background participants',
    'close environmental view where hands, equipment, and faces all support the story',
    'corner-to-corner composition with generous negative space on one side',
    'ground-level environmental view emphasizing the venue and group silhouette'
  ];
  const lighting = [
    'cool dawn with soft directional light',
    'bright overcast daylight with gentle shadows',
    'clear midday light with crisp natural color',
    'warm late-afternoon side light',
    'golden-hour backlight with controlled highlights',
    'blue-hour ambient light with practical lamps',
    'soft window light with realistic interior falloff',
    'warm evening practical light with natural background darkness',
    'fresh post-rain daylight with subtle reflections',
    'high open shade with calm, even skin tones'
  ];
  const composition = compositions[(slotNumber - 1) % compositions.length];
  const light = lighting[(Math.floor((slotNumber - 1) / compositions.length) + slotNumber - 1) % lighting.length];
  return [
    'Use case: photorealistic-natural',
    'Asset type: mobile-first event card cover',
    `Primary request: create an entirely fictional candid event photograph for "${definition.title}". ${definition.subtitle}`,
    `Scene/backdrop: ${definition.location}. Preserve this venue type and its defining environmental features rather than replacing it with a generic park, cafe, office, or conversation circle.`,
    `Subject/action: ${definition.visual}. Show the described action already in progress; the fictional adult participants should look like everyday local attendees, not celebrities or fashion models.`,
    `Composition/framing: landscape 16:9, ${composition}; keep the defining action and venue readable in a small list-card crop; visual identity ${pad(slotNumber)}.`,
    `Lighting/mood: ${light}; natural, welcoming, socially believable, and lightly imperfect.`,
    `Distinctness: event slot ${pad(slotNumber)} must preserve this exact venue, action, equipment, and group arrangement so it cannot collapse into another pool image.`,
    'Constraints: photorealistic natural photography; entirely fictional generated people and place; age-appropriate adult social activity; realistic anatomy and equipment; no logos, captions, readable signs, UI, watermark, branded products, famous landmarks, or identifiable real people.',
    'Avoid: unrelated activities, empty generic landscapes, generic groups merely posing or talking to camera, staged corporate stock-photo aesthetics, duplicate faces, extra limbs, distorted hands, illegible text, collage or split-screen layouts.'
  ].join('\n');
}

function buildLocalEventSlotMap(eventSlots, slotByEventKey, mongoEvents) {
  const result = {};
  const usedSlots = new Set();
  for (const seed of LOCAL_EVENT_SEEDS) {
    const key = localEventSeedKey(seed);
    const slug = seed.slice(key.length + 1).replace(/-/g, ' ');
    const pinnedEventId = LOCAL_EVENT_CANONICAL_ID_BY_KEY[key];
    const pinnedSlot = pinnedEventId ? slotByEventKey.get(pinnedEventId) : null;
    if (pinnedEventId && !pinnedSlot) {
      throw new Error(`Frontend-local event ${key} points to missing canonical event ${pinnedEventId}`);
    }
    const exact = mongoEvents.find(event => normalize(event.title) === normalize(slug) && slotByEventKey.has(eventKey(event)));
    const pseudo = { title: slug, subtitle: '', topics: [], mode: 'Casual' };
    const categoryKey = classifyEvent(pseudo);
    const exactSlot = exact ? slotByEventKey.get(eventKey(exact)) : null;
    const candidates = eventSlots
      .filter(slot => slot.category === categoryKey || (RELATED_EVENT_CATEGORIES[categoryKey] ?? []).includes(slot.category))
      .sort((left, right) => {
        if (left.slot === exactSlot) return -1;
        if (right.slot === exactSlot) return 1;
        return similarity(pseudo, right.representative) - similarity(pseudo, left.representative) || left.slot - right.slot;
      });
    const selected = (pinnedSlot ? eventSlots.find(slot => slot.slot === pinnedSlot) : null)
      ?? candidates.find(slot => !usedSlots.has(slot.slot))
      ?? eventSlots.find(slot => !usedSlots.has(slot.slot));
    if (!selected || usedSlots.has(selected.slot)) {
      throw new Error(`Cannot assign a unique canonical event slot to frontend-local event ${key}`);
    }
    result[key] = selected.slot;
    usedSlots.add(selected.slot);
  }
  return result;
}

function localEventSeedKey(seed) {
  const match = seed.match(/^(demo-event-(?:events|hosting|invitations):[^:]+:[^:]+)/);
  if (!match) throw new Error(`Invalid frontend-local event seed: ${seed}`);
  return match[1];
}

function buildFrontendHelper(eventSlots, localEventSlotBySeed, localAssetSlotBySeed, localAssetTemplateIdsByOwner) {
  const eventDefinitionBySlot = Object.fromEntries(eventSlots.map(slot => [slot.slot, {
    title: slot.representative.title,
    subtitle: slot.representative.subtitle,
    location: slot.representative.location,
    topics: slot.representative.topics
  }]));
  return `// Generated by tools/seeds/synchronize-demo-image-pools.mjs.\n` +
    `// Frontend-local keeps remote placeholders; the standalone HTTP demo uses the same logical slots from MinIO.\n` +
    `export interface DemoAssetPlaceholder {\n` +
    `  slot: number;\n` +
    `  imageUrl: string;\n` +
    `  title: string;\n` +
    `  subtitle: string;\n` +
    `  details: string;\n` +
    `  category: string;\n` +
    `  visibility: 'Public' | 'Friends only' | 'Invitation only';\n` +
    `  status: string;\n` +
    `}\n\n` +
    `export interface DemoEventPlaceholder {\n` +
    `  slot: number;\n` +
    `  imageUrl: string;\n` +
    `  title: string;\n` +
    `  subtitle: string;\n` +
    `  location: string;\n` +
    `  topics: readonly string[];\n` +
    `}\n\n` +
    `type DemoAssetDefinition = Omit<DemoAssetPlaceholder, 'slot' | 'imageUrl' | 'visibility' | 'status'>;\n\n` +
    `type DemoEventDefinition = Omit<DemoEventPlaceholder, 'slot' | 'imageUrl'>;\n\n` +
    `const ASSET_PICSUM_IDS = ${JSON.stringify(ASSET_PICSUM_IDS)} as const;\n` +
    `const EVENT_PICSUM_IDS = ${JSON.stringify(EVENT_PICSUM_IDS)} as const;\n\n` +
    `const ASSET_SLOTS_BY_TEMPLATE: Readonly<Record<string, readonly number[]>> = ${JSON.stringify(LOCAL_ASSET_SLOTS_BY_TEMPLATE, null, 2)};\n\n` +
    `const ASSET_DEFINITION_BY_SLOT: Readonly<Record<number, DemoAssetDefinition>> = ${JSON.stringify(ASSET_SEED_DEFINITION_BY_SLOT, null, 2)};\n\n` +
    `const ASSET_SLOT_BY_SEED: Readonly<Record<string, number>> = ${JSON.stringify(localAssetSlotBySeed, null, 2)};\n\n` +
    `const ASSET_TEMPLATE_IDS_BY_OWNER: Readonly<Record<string, readonly string[]>> = ${JSON.stringify(localAssetTemplateIdsByOwner, null, 2)};\n\n` +
    `const ASSET_RECORD_BY_SLOT: Readonly<Record<number, { visibility: DemoAssetPlaceholder['visibility']; status: string }>> = ${JSON.stringify(Object.fromEntries(assetSlots.map(slot => [slot.slot, { visibility: slot.mongoRecords[0].visibility, status: slot.mongoRecords[0].status }])), null, 2)};\n\n` +
    `const EVENT_DEFINITION_BY_SLOT: Readonly<Record<number, DemoEventDefinition>> = ${JSON.stringify(eventDefinitionBySlot, null, 2)};\n\n` +
    `const EVENT_SLOT_BY_SEED: Readonly<Record<string, number>> = ${JSON.stringify(localEventSlotBySeed, null, 2)};\n\n` +
    `export function demoAssetPlaceholder(seed: string): DemoAssetPlaceholder {\n` +
    `  const slot = demoAssetSlot(seed);\n` +
    `  const definition = ASSET_DEFINITION_BY_SLOT[slot] ?? ASSET_DEFINITION_BY_SLOT[1];\n` +
    `  return {\n` +
    `    ...definition,\n` +
    `    slot,\n` +
    `    imageUrl: \`https://picsum.photos/id/\${ASSET_PICSUM_IDS[slot - 1]}/1200/700\`,\n` +
    `    visibility: ASSET_RECORD_BY_SLOT[slot]?.visibility ?? 'Public',\n` +
    `    status: ASSET_RECORD_BY_SLOT[slot]?.status ?? 'A'\n` +
    `  };\n` +
    `}\n\n` +
    `export function demoAssetPlaceholderUrl(seed: string): string {\n` +
    `  return demoAssetPlaceholder(seed).imageUrl;\n` +
    `}\n\n` +
    `export function demoAssetTemplateIds(ownerUserId: string): readonly string[] {\n` +
    `  return ASSET_TEMPLATE_IDS_BY_OWNER[ownerUserId.trim().toLowerCase()] ?? [];\n` +
    `}\n\n` +
    `function demoAssetSlot(seed: string): number {\n` +
    `  const normalized = seed.trim().toLowerCase();\n` +
    `  const exactSlot = ASSET_SLOT_BY_SEED[normalized];\n` +
    `  if (exactSlot) return exactSlot;\n` +
    `  const template = Object.keys(ASSET_SLOTS_BY_TEMPLATE).find(key => normalized.includes(key));\n` +
    `  const candidates = template ? ASSET_SLOTS_BY_TEMPLATE[template] : [1];\n` +
    `  const candidateIndex = stableIndex(normalized, candidates.length);\n` +
    `  return candidates[candidateIndex] ?? 1;\n` +
    `}\n\n` +
    `export function demoEventPlaceholder(seed: string): DemoEventPlaceholder {\n` +
    `  const normalized = seed.trim().toLowerCase();\n` +
    `  const slot = EVENT_SLOT_BY_SEED[normalized] ?? (stableIndex(normalized, EVENT_PICSUM_IDS.length) + 1);\n` +
    `  const definition = EVENT_DEFINITION_BY_SLOT[slot] ?? EVENT_DEFINITION_BY_SLOT[1];\n` +
    `  return {\n` +
    `    ...definition,\n` +
    `    topics: [...definition.topics],\n` +
    `    slot,\n` +
    `    imageUrl: \`https://picsum.photos/id/\${EVENT_PICSUM_IDS[slot - 1]}/1200/700\`\n` +
    `  };\n` +
    `}\n\n` +
    `export function demoEventPlaceholderUrl(seed: string): string {\n` +
    `  return demoEventPlaceholder(seed).imageUrl;\n` +
    `}\n\n` +
    `function stableIndex(seed: string, length: number): number {\n` +
    `  let hash = 2166136261;\n` +
    `  for (let index = 0; index < seed.length; index += 1) {\n` +
    `    hash ^= seed.charCodeAt(index);\n` +
    `    hash = Math.imul(hash, 16777619);\n` +
    `  }\n` +
    `  return (hash >>> 0) % Math.max(1, length);\n` +
    `}\n`;
}

function profilePrompt(userId, name, ageAndGender, city, personality, backdrop, photoId, style = 'natural editorial lifestyle photography') {
  const minioKey = `images/demo-profiles/${userId}/${photoId}/large.webp`;
  return {
    userId,
    name,
    minioKey,
    prompt: [
      'Use case: photorealistic-natural',
      `Asset type: mobile-first profile portrait in ${style}`,
      `Primary request: create a fully fictional, non-famous ${ageAndGender} from ${city}, with a ${personality} presence.`,
      `Scene/backdrop: ${backdrop}, softly out of focus.`,
      'Subject: one person only, natural face and skin texture, relaxed authentic expression, contemporary casual clothing, believable age.',
      'Composition/framing: vertical 3:4 portrait, waist-up, face centered with safe crop room for mobile and desktop cards.',
      'Lighting/mood: soft natural light, approachable and candid rather than studio-glamorous.',
      'Constraints: entirely AI-generated fictional person; must not resemble a celebrity or known person; no logos, text, watermark, beauty-filter look or identifying documents.',
      'Avoid: age mismatch, plastic skin, distorted hands, duplicate people, exaggerated fashion editorial styling.'
    ].join('\n')
  };
}

function summary(manifest, localEventSlotBySeed, localAssetTemplateIdsByOwner) {
  const frontendAssetCounts = Object.values(localAssetTemplateIdsByOwner).map(templateIds => templateIds.length);
  return {
    mongoAssets: assets.length,
    mongoAssetImageSlots: manifest.assets.length,
    frontendLocalAssets: frontendAssetCounts.reduce((total, count) => total + count, 0),
    frontendLocalAssetOwnersByCount: Object.fromEntries(
      range(0, 3).map(count => [count, frontendAssetCounts.filter(value => value === count).length])
    ),
    mongoEventsWithImages: events.filter(event => `${event.imageUrl ?? ''}`.trim()).length,
    mongoEventImageSlots: manifest.events.length,
    staticSeedFixtureProtectedEvents: fixtureProtectedEventIds.size,
    qaUserRelatedStaticSeedEvents: qaUserRelatedStaticEventIds.size,
    frontendLocalEventSeedKeys: Object.keys(localEventSlotBySeed).length,
    additionalProfiles: manifest.additionalProfiles.length,
    totalNewLargeImages: manifest.generatedImages.totalNewLargeImages
  };
}
