import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DEMO_DB = path.join(ROOT, 'server/docker/conf/mongodb/demo_db');
const ASSETS_PATH = path.join(DEMO_DB, 'assets.json');
const EVENTS_PATH = path.join(DEMO_DB, 'events.json');
const USERS_PATH = path.join(DEMO_DB, 'users.json');
const CONTACTS_PATH = path.join(DEMO_DB, 'navigatorContacts.json');
const ACTIVITY_MEMBERS_PATH = path.join(DEMO_DB, 'activityMembers.json');
const USER_REPORTS_PATH = path.join(DEMO_DB, 'userReports.json');
const FRONTEND_HELPER_PATH = path.join(
  ROOT,
  'frontend/src/app/shared/core/local/seed/builders/demo-image-pool.ts'
);
const MANIFEST_PATH = path.join(ROOT, 'tools/seeds/demo-image-pool-manifest.json');

const args = new Set(process.argv.slice(2));
const writeMode = args.has('--write');
const checkMode = args.has('--check');
const missingMode = args.has('--print-missing-prompts');
if ([writeMode, checkMode, missingMode].filter(Boolean).length !== 1) {
  throw new Error('Use exactly one of --write, --check, or --print-missing-prompts.');
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

const PUBLIC_LOCAL_USER_IDS = [
  'u1', 'u2', 'u3', 'u4', 'u6', 'u7', 'u8', 'u10', 'u12', 'u13', 'u14', 'u15',
  'u16', 'u18', 'u19', 'u20', 'u22', 'u24', 'u25', 'u26', 'u27', 'u28', 'u30',
  'u31', 'u32', 'u34', 'u36', 'u37', 'u38', 'u39', 'u40', 'u42', 'u43', 'u44',
  'u46', 'u48'
];

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
  23: assetDefinition('Desert Adobe Casita', 'Cool plaster walls + shaded patio + four beds', 'Compact heat-conscious guest house arranged around a shaded courtyard.', 'Casita'),
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
  43: assetDefinition('Waterfront Passenger Launch', '4 passenger seats + covered cockpit + life jackets', 'Small licensed motor launch for a short sheltered-water transfer.', 'Passenger Boat'),
  44: assetDefinition('Dinner District Electric Taxi', '4 seats + compact EV + city pickup', 'Quiet unbranded electric taxi reserved for an evening group.', 'Electric Taxi'),
  45: assetDefinition('Concert Night Shuttle Van', '4 reserved seats + illuminated pickup zone', 'Compact passenger van for a clearly coordinated post-event return.', 'Shuttle Van'),
  46: assetDefinition('Station Pickup Wagon', '4 seats + long cargo floor + rail connection', 'Unbranded estate wagon for a daytime station pickup.', 'Estate Car'),
  47: assetDefinition('Historic District Pedicab Pair', '4 total seats + two covered cycle taxis', 'Two coordinated pedal-powered taxis for a short old-town transfer.', 'Pedicab'),
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
  8: 'an outdoor event power point built around portable battery stations, color-organized charging leads, weatherproof cable covers and a compact distribution table',
  9: 'a compact travel game collection opened on a weathered hostel common-room table, with small boards, cards, dice and score tokens',
  10: 'a route-navigation set arranged on a rocky overlook, with a handheld GPS, compass, blank waterproof map sleeves and a power bank',
  11: 'a field-cooking station on a designated gravel pad, with a twin burner, nesting pots, utensil roll and stable preparation board',
  12: 'a picnic comfort set in a green city park, with four distinct folding chairs, a patterned blanket, thermos carriers and reusable cups',
  13: 'a portable audio system prepared on a small community stage, with two plain unmarked battery speakers, plain microphones, stands and a compact unmarked mixer',
  14: 'a rechargeable area-lighting kit tested in an open warehouse, with plain unmarked tripod work lights, plain lanterns and low-profile cable covers',
  15: 'an outdoor projection setup beneath a solid pavilion roof, with a folding screen, compact projector, power station and four chairs',
  16: 'a reusable hygiene and cleanup station beside an event service area, with water containers, wash basins, sorting bins and cleaning tools',
  17: 'a rustic lakeside timber cabin with a covered porch, four prepared beds and a compact wood stove',
  18: 'a clean urban hostel family room with two sturdy bunk beds, four lockers and a shared central table',
  19: 'the bright interior and small deck of a moored houseboat, with two double berths, compact galley and calm river outside',
  20: 'a practical mountain-refuge room with four alpine bunks, boot-drying racks, stone walls and organized gear shelves',
  21: 'the open pop-top interior of a compact campervan at an official motorhome stop, showing four converted sleeping places and kitchenette',
  22: 'a small stone farm guest cottage with two simple bedrooms, a wooden kitchen table and a sunny rural courtyard',
  23: 'a cool desert adobe guest house with rounded plaster walls, four low beds and a deeply shaded patio',
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
  39: 'a small unbranded high-roof courtesy minibus waiting beneath a hotel entrance canopy at night',
  40: 'an unbranded short-wheelbase cargo van at an expo loading dock, with side door open to a neatly secured equipment bay',
  41: 'an unbranded double-cab pickup truck beside a community hall, with a covered utility bed and portable tables being loaded',
  42: 'a four-seat electric utility buggy on a colorful closed festival service lane with an open rear cargo deck',
  43: 'a small four-passenger motor launch with covered cockpit, life jackets and calm waterfront terminal behind it',
  44: 'a compact unbranded electric city taxi outside a lively restaurant district after sunset',
  45: 'an unbranded passenger shuttle van in a clearly lit concert pickup zone at night',
  46: 'an unbranded long-roof station wagon beneath a contemporary railway-station canopy in daylight',
  47: 'two covered cycle pedicabs waiting together on a car-free cobbled old-town square',
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

const PROFILE_PROMPTS = [
  profilePrompt('650000000000000000000061', 'Casey Bridge', '32-year-old man', 'Austin', 'quiet, reliable small-group connector', 'casual coffee-shop terrace'),
  profilePrompt('650000000000000000000062', 'Nova Social', '27-year-old woman', 'Austin', 'warm, sociable and approachable', 'bright neighborhood art courtyard'),
  profilePrompt('650000000000000000000063', 'Riley Outside', '29-year-old man', 'Austin', 'adventurous, relaxed and outdoors-oriented', 'green urban trailhead')
];

const assets = JSON.parse(await readFile(ASSETS_PATH, 'utf8'));
const events = JSON.parse(await readFile(EVENTS_PATH, 'utf8'));
const users = JSON.parse(await readFile(USERS_PATH, 'utf8'));
const contacts = JSON.parse(await readFile(CONTACTS_PATH, 'utf8'));
const activityMembers = JSON.parse(await readFile(ACTIVITY_MEMBERS_PATH, 'utf8'));
const userReports = JSON.parse(await readFile(USER_REPORTS_PATH, 'utf8'));

const assetSlots = buildAssetSlots(assets);
const { slots: eventSlots, slotByEventKey } = buildEventSlots(events);
const localEventSlotBySeed = buildLocalEventSlotMap(eventSlots, slotByEventKey, events);

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
  if (!`${event.imageUrl ?? ''}`.trim()) continue;
  const slotNumber = slotByEventKey.get(eventKey(event));
  if (!slotNumber) throw new Error(`No image slot for event ${eventKey(event)}`);
  event.imageUrl = mediaUrl(eventMinioKey(slotNumber));
}
for (const profile of PROFILE_PROMPTS) {
  const user = users.find(item => item.userId === profile.userId);
  if (!user) throw new Error(`Missing profile user ${profile.userId}`);
  user.images = [mediaUrl(profile.minioKey)];
}
for (const record of contacts) {
  for (const contact of record.contacts ?? []) {
    if (`${contact.avatarUrl ?? ''}`.startsWith('http')) {
      contact.avatarUrl = mediaUrl(`images/demo-profiles/${contact.userId}/photo-01/large.webp`);
    }
  }
}

const manifest = {
  version: 1,
  purpose: 'Canonical, context-aware demo image pools for the standalone HTTP deployment.',
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
const frontendHelper = buildFrontendHelper(localEventSlotBySeed);

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
  [USER_REPORTS_PATH, `${JSON.stringify(userReports, null, 2)}\n`],
  [FRONTEND_HELPER_PATH, frontendHelper],
  [MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`]
]);

if (writeMode) {
  for (const [filePath, contents] of expected) await writeFile(filePath, contents);
  console.log(JSON.stringify(summary(manifest, localEventSlotBySeed), null, 2));
} else {
  const mismatches = [];
  for (const [filePath, contents] of expected) {
    let actual = '';
    try { actual = await readFile(filePath, 'utf8'); } catch { /* reported below */ }
    if (actual !== contents) mismatches.push(path.relative(ROOT, filePath));
  }
  if (mismatches.length) throw new Error(`Demo image pool is out of sync: ${mismatches.join(', ')}`);
  console.log(JSON.stringify(summary(manifest, localEventSlotBySeed), null, 2));
}

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function assetDefinition(title, subtitle, details, category = null) {
  return { title, subtitle, details, category };
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
      mongoRecords: assigned.map(asset => ({ assetId: asset.assetId, ownerUserId: asset.ownerUserId, title: asset.title, subtitle: asset.subtitle, category: asset.category }))
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
    'Avoid: unrelated objects, surreal details, excessive clutter, distorted vehicles, impossible rooms, stock-photo collage aesthetics.'
  ].join('\n');
}

function buildEventSlots(records) {
  const eligible = records.filter(event => `${event.imageUrl ?? ''}`.trim());
  const byCategory = new Map();
  for (const event of eligible) {
    const key = classifyEvent(event);
    const bucket = byCategory.get(key) ?? [];
    bucket.push(event);
    byCategory.set(key, bucket);
  }
  const allocations = allocateEventSlots(byCategory, 100);
  const slots = [];
  let slotCursor = 1;
  for (const categoryDefinition of EVENT_CATEGORIES) {
    const items = byCategory.get(categoryDefinition.key) ?? [];
    const count = allocations.get(categoryDefinition.key) ?? 0;
    if (!count) continue;
    for (const medoid of chooseDiverseEvents(items, count)) {
      slots.push({
        slot: slotCursor,
        key: `event-${pad(slotCursor)}`,
        category: categoryDefinition.key,
        minioKey: eventMinioKey(slotCursor),
        frontendPlaceholderUrl: `https://picsum.photos/id/${EVENT_PICSUM_IDS[slotCursor - 1]}/1200/700`,
        representative: eventSummary(medoid),
        prompt: eventPrompt(categoryDefinition.key, medoid, slotCursor),
        mongoEventIds: [],
        mongoRecords: []
      });
      slotCursor += 1;
    }
  }
  if (slots.length !== 100) throw new Error(`Expected 100 event slots, got ${slots.length}`);

  const slotByEventKey = new Map();
  const conflicts = buildListWindowConflicts(eligible, 10);
  const ordered = [...eligible].sort((left, right) =>
    (conflicts.get(eventKey(right))?.size ?? 0) - (conflicts.get(eventKey(left))?.size ?? 0)
      || eventKey(left).localeCompare(eventKey(right))
  );
  for (const event of ordered) {
    const categoryKey = classifyEvent(event);
    const blockedSlots = new Set(
      [...(conflicts.get(eventKey(event)) ?? [])]
        .map(key => slotByEventKey.get(key))
        .filter(Boolean)
    );
    const primaryCandidates = slots
      .filter(slot => slot.category === categoryKey)
      .sort((left, right) => similarity(event, right.representative) - similarity(event, left.representative) || left.slot - right.slot);
    const availablePrimary = primaryCandidates.filter(slot => !blockedSlots.has(slot.slot));
    const relatedCandidates = slots
      .filter(slot => (RELATED_EVENT_CATEGORIES[categoryKey] ?? []).includes(slot.category) && !blockedSlots.has(slot.slot))
      .sort((left, right) => similarity(event, right.representative) - similarity(event, left.representative) || left.slot - right.slot);
    const compatibleCategories = new Set([categoryKey, ...(RELATED_EVENT_CATEGORIES[categoryKey] ?? [])]);
    const emergencyCandidates = slots.filter(slot => compatibleCategories.has(slot.category) && !blockedSlots.has(slot.slot));
    const selected = availablePrimary.find(slot => slot.mongoEventIds.length === 0)
      ?? availablePrimary[0]
      ?? relatedCandidates.find(slot => slot.mongoEventIds.length === 0)
      ?? relatedCandidates[0]
      ?? emergencyCandidates[0]
      ?? primaryCandidates[0];
    if (!selected) throw new Error(`No event slot candidate for ${eventKey(event)}`);
    selected.mongoEventIds.push(eventKey(event));
    selected.mongoRecords.push(eventSummary(event));
    slotByEventKey.set(eventKey(event), selected.slot);
  }
  const unused = slots.filter(slot => slot.mongoEventIds.length === 0);
  if (unused.length) throw new Error(`Unused event slots: ${unused.map(slot => slot.key).join(', ')}`);
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

function eventPrompt(categoryKey, event, slotNumber) {
  const sceneByCategory = {
    'winter-mountain': 'a believable small-group winter or mountain activity',
    'court-sports': 'adults actively participating in a friendly court-sport or tournament meetup',
    cycling: 'a relaxed small-group bicycle meetup with safe practical gear',
    'running-fitness': 'a friendly recreational run or fitness meetup in progress',
    'walking-outdoors': 'a small social group walking or gathering in a natural outdoor setting',
    'beach-water': 'a casual group activity near a beach, harbor or waterfront',
    'coffee-brunch': 'a relaxed small-group coffee or brunch gathering around a real table',
    'dining-tasting': 'a warm small-group food or tasting experience with believable table details',
    'music-nightlife': 'a friendly live-music, listening-room or evening social atmosphere',
    'creative-culture': 'a hands-on creative, photography, book or cultural meetup',
    wellness: 'a calm inclusive wellness, yoga or mindful group activity',
    'professional-tech': 'an informal workshop, mentorship or ideas exchange among adults',
    'festival-community': 'a lively but believable community, volunteer or festival gathering',
    games: 'a friendly tabletop, social game or competition activity',
    'social-mixer': 'a relaxed small-group social meetup with natural conversation'
  };
  const lighting = ['soft morning light', 'clear daylight', 'warm late-afternoon light', 'golden-hour light', 'natural early-evening light'][slotNumber % 5];
  return [
    'Use case: photorealistic-natural',
    'Asset type: mobile-first event card cover',
    `Primary request: create a believable candid photograph representing "${event.title}" — ${event.subtitle}`,
    `Scene/backdrop: ${sceneByCategory[categoryKey]}; use the seeded location only as broad context: ${event.location || 'a plausible local venue'}.`,
    `Subject: ${sceneByCategory[categoryKey]}; adults should look like fictional everyday participants, not celebrities or models.`,
    `Composition/framing: landscape 16:9, ${lighting}, documentary eye-level framing; keep the main action centered and readable in a small list-card crop; visual variation ${pad(slotNumber)}.`,
    'Lighting/mood: natural, welcoming, socially believable and lightly imperfect.',
    'Constraints: entirely fictional generated people and place; context must match the event description; no logos, captions, signs with readable text, UI, watermark or branded products.',
    'Avoid: unrelated activities, empty generic landscapes, staged corporate stock-photo poses, duplicate faces, extra limbs, distorted hands, illegible text.'
  ].join('\n');
}

function buildLocalEventSlotMap(eventSlots, slotByEventKey, mongoEvents) {
  const result = {};
  const usedSlots = new Set();
  for (const seed of LOCAL_EVENT_SEEDS) {
    const slug = seed.split(':').at(-1).replace(/-/g, ' ');
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
    const selected = candidates.find(slot => !usedSlots.has(slot.slot))
      ?? eventSlots.find(slot => !usedSlots.has(slot.slot));
    result[seed] = selected?.slot ?? 1;
    usedSlots.add(result[seed]);
  }
  return result;
}

function buildFrontendHelper(localEventSlotBySeed) {
  return `// Generated by tools/seeds/synchronize-demo-image-pools.mjs.\n` +
    `// Frontend-local keeps remote placeholders; the standalone HTTP demo uses the same logical slots from MinIO.\n` +
    `export interface DemoAssetPlaceholder {\n` +
    `  slot: number;\n` +
    `  imageUrl: string;\n` +
    `  title: string;\n` +
    `  subtitle: string;\n` +
    `  details: string;\n` +
    `  category: string;\n` +
    `}\n\n` +
    `type DemoAssetDefinition = Omit<DemoAssetPlaceholder, 'slot' | 'imageUrl'>;\n\n` +
    `const ASSET_PICSUM_IDS = ${JSON.stringify(ASSET_PICSUM_IDS)} as const;\n` +
    `const EVENT_PICSUM_IDS = ${JSON.stringify(EVENT_PICSUM_IDS)} as const;\n\n` +
    `const PUBLIC_LOCAL_USER_IDS = ${JSON.stringify(PUBLIC_LOCAL_USER_IDS)} as const;\n\n` +
    `const ASSET_SLOTS_BY_TEMPLATE: Readonly<Record<string, readonly number[]>> = ${JSON.stringify(LOCAL_ASSET_SLOTS_BY_TEMPLATE, null, 2)};\n\n` +
    `const ASSET_DEFINITION_BY_SLOT: Readonly<Record<number, DemoAssetDefinition>> = ${JSON.stringify(ASSET_SEED_DEFINITION_BY_SLOT, null, 2)};\n\n` +
    `const EVENT_SLOT_BY_SEED: Readonly<Record<string, number>> = ${JSON.stringify(localEventSlotBySeed, null, 2)};\n\n` +
    `export function demoAssetPlaceholder(seed: string): DemoAssetPlaceholder {\n` +
    `  const slot = demoAssetSlot(seed);\n` +
    `  const definition = ASSET_DEFINITION_BY_SLOT[slot] ?? ASSET_DEFINITION_BY_SLOT[1];\n` +
    `  return {\n` +
    `    ...definition,\n` +
    `    slot,\n` +
    `    imageUrl: \`https://picsum.photos/id/\${ASSET_PICSUM_IDS[slot - 1]}/1200/700\`\n` +
    `  };\n` +
    `}\n\n` +
    `export function demoAssetPlaceholderUrl(seed: string): string {\n` +
    `  return demoAssetPlaceholder(seed).imageUrl;\n` +
    `}\n\n` +
    `function demoAssetSlot(seed: string): number {\n` +
    `  const normalized = seed.trim().toLowerCase();\n` +
    `  const template = Object.keys(ASSET_SLOTS_BY_TEMPLATE).find(key => normalized.includes(key));\n` +
    `  const candidates = template ? ASSET_SLOTS_BY_TEMPLATE[template] : [1];\n` +
    `  const ownerId = normalized.match(/(u\\d+)-asset-/)?.[1] ?? '';\n` +
    `  const publicOwnerIndex = PUBLIC_LOCAL_USER_IDS.indexOf(ownerId as typeof PUBLIC_LOCAL_USER_IDS[number]);\n` +
    `  const candidateIndex = publicOwnerIndex >= 0\n` +
    `    ? publicOwnerIndex % candidates.length\n` +
    `    : stableIndex(normalized, candidates.length);\n` +
    `  return candidates[candidateIndex] ?? 1;\n` +
    `}\n\n` +
    `export function demoEventPlaceholderUrl(seed: string): string {\n` +
    `  const normalized = seed.trim().toLowerCase();\n` +
    `  const slot = EVENT_SLOT_BY_SEED[normalized] ?? (stableIndex(normalized, EVENT_PICSUM_IDS.length) + 1);\n` +
    `  return \`https://picsum.photos/id/\${EVENT_PICSUM_IDS[slot - 1]}/1200/700\`;\n` +
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

function profilePrompt(userId, name, ageAndGender, city, personality, backdrop) {
  const minioKey = `images/demo-profiles/${userId}/photo-01/large.webp`;
  return {
    userId,
    name,
    minioKey,
    prompt: [
      'Use case: photorealistic-natural',
      'Asset type: mobile-first dating/social profile portrait',
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

function summary(manifest, localEventSlotBySeed) {
  return {
    mongoAssets: assets.length,
    mongoAssetImageSlots: manifest.assets.length,
    mongoEventsWithImages: events.filter(event => `${event.imageUrl ?? ''}`.trim()).length,
    mongoEventImageSlots: manifest.events.length,
    frontendLocalEventSeedKeys: Object.keys(localEventSlotBySeed).length,
    additionalProfiles: manifest.additionalProfiles.length,
    totalNewLargeImages: manifest.generatedImages.totalNewLargeImages
  };
}
