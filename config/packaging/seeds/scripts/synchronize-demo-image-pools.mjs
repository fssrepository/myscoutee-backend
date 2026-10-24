import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.MYSCOUTEE_PACKAGING_PROJECT_ROOT || fileURLToPath(new URL('../../../../', import.meta.url));
const config = JSON.parse(await readFile(path.join(ROOT, 'config/packaging/seeds/data/image-pools.json'), 'utf8'));
const DEMO_DB = path.join(ROOT, config.paths.database);
const ASSETS_PATH = path.join(DEMO_DB, config.collections.assets);
const EVENTS_PATH = path.join(DEMO_DB, config.collections.events);
const USERS_PATH = path.join(DEMO_DB, config.collections.users);
const CONTACTS_PATH = path.join(DEMO_DB, config.collections.contacts);
const ACTIVITY_MEMBERS_PATH = path.join(DEMO_DB, config.collections.activity_members);
const ACTIVITY_RESOURCES_PATH = path.join(DEMO_DB, config.collections.activity_resources);
const ACTIVITY_STAGE_RUNTIME_PATH = path.join(DEMO_DB, config.collections.activity_stage_runtime);
const ASSET_REQUESTS_PATH = path.join(DEMO_DB, config.collections.asset_requests);
const CHATS_PATH = path.join(DEMO_DB, config.collections.chats);
const CHAT_MESSAGES_PATH = path.join(DEMO_DB, config.collections.chat_messages);
const FEEDBACK_ANSWERS_PATH = path.join(DEMO_DB, config.collections.feedback_answers);
const FEEDBACK_STATES_PATH = path.join(DEMO_DB, config.collections.feedback_states);
const USER_NOTIFICATIONS_PATH = path.join(DEMO_DB, config.collections.user_notifications);
const USER_REPORTS_PATH = path.join(DEMO_DB, config.collections.user_reports);
const FRONTEND_HELPER_PATH = path.join(ROOT, config.paths.frontendHelper);
const FRONTEND_DEFINITIONS_PATH = path.join(ROOT, config.paths.frontendDefinitions);
const MANIFEST_PATH = path.join(ROOT, config.paths.manifest);

const args = new Set(process.argv.slice(2));
const writeMode = args.has('--write');
const frontendOnlyMode = args.has('--frontend-only');
const checkMode = args.has('--check');
const missingMode = args.has('--print-missing-prompts');
const countersOnlyMode = args.has('--refresh-event-counters');
if (frontendOnlyMode && !writeMode && !checkMode) {
  throw new Error('--frontend-only requires --write or --check.');
}
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

const ASSET_PICSUM_IDS = config.assetPicsumIds;
const EVENT_PICSUM_IDS = config.eventPicsumIds;

// Exactly one existing Mongo record owns each generated asset image slot. Keeping
// this explicit makes the owner/count distribution stable across regenerations.
const CANONICAL_ASSET_ID_BY_SLOT = config.canonicalAssetIdBySlot;

// One Mongo event owns each generated event image. Fixture-sensitive records
// are deliberately retained in this list; only their display data changes.
const CANONICAL_EVENT_ID_BY_SLOT = config.canonicalEventIdBySlot;

if (CANONICAL_EVENT_ID_BY_SLOT.length !== config.eventCount || new Set(CANONICAL_EVENT_ID_BY_SLOT).size !== config.eventCount) {
  throw new Error(`Canonical event slots must contain exactly ${config.eventCount} unique event IDs.`);
}

const QA_RELATION_USER_IDS = new Set(config.qaRelationUserIds);

const ASSET_SLOT_GROUPS = config.assetSlotGroups;

const ASSET_SEED_DEFINITION_BY_SLOT = config.assetSeedDefinitionBySlot;

const ASSET_SCENE_BY_SLOT = config.assetSceneBySlot;

const LOCAL_ASSET_SLOTS_BY_TEMPLATE = config.localAssetSlotsByTemplate;

const LOCAL_EVENT_SEEDS = config.localEventSeeds;

const LOCAL_EVENT_CANONICAL_ID_BY_KEY = config.localEventCanonicalIdByKey;

const EVENT_CATEGORIES = config.eventCategories;

const RELATED_EVENT_CATEGORIES = config.relatedEventCategories;

// Stable, intentionally distinct briefs for the 100 generated event covers.
// These are image concepts, not replacements for the underlying event fixtures:
// several real demo events can continue to share the matching canonical cover.
const EVENT_IMAGE_DEFINITIONS = config.eventImageDefinitions;

if (EVENT_IMAGE_DEFINITIONS.length !== config.eventCount) {
  throw new Error(`Expected ${config.eventCount} event image definitions, got ${EVENT_IMAGE_DEFINITIONS.length}`);
}
assertUniqueEventImageDefinitions(EVENT_IMAGE_DEFINITIONS);

const PROFILE_PROMPTS = config.profilePrompts;

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
const canonicalAssetIds = new Set(CANONICAL_ASSET_ID_BY_SLOT);
const assetSlots = buildAssetSlots(assets.filter(asset => canonicalAssetIds.has(asset.assetId)));
const { slots: eventSlots, slotByEventKey } = buildEventSlots(events);
// Image synchronization owns the configured pool records. Other event fixtures,
// memberships and runtime counters retain their own seed owners.
const localEventSlotBySeed = buildLocalEventSlotMap(eventSlots, slotByEventKey, events);
const { localAssetSlotBySeed, localAssetTemplateIdsByOwner } = buildLocalAssetSeedMaps(assetSlots, users);

for (const asset of assets.filter(asset => canonicalAssetIds.has(asset.assetId))) {
  const slot = assetSlots.find(item => item.mongoAssetIds.includes(asset.assetId));
  if (!slot) throw new Error(`No image slot for asset ${asset.assetId}`);
  asset.imageUrl = mediaUrl(slot.minioKey);
  if (`${asset.sourceLink ?? ''}`.includes(config.placeholderSourceMarker)) asset.sourceLink = '';
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
for (const event of events.filter(event => canonicalEventIds.has(eventKey(event)))) {
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

assertRelationshipSnapshotUnchanged(protectedRelationshipSnapshot, eventRelationshipSnapshot({
  eventIds: fixtureProtectedEventIds,
  events,
  activityMembers,
  activityResources,
  chats
}));

const manifest = {
  version: 3,
  purpose: 'One-to-one canonical, context-aware demo image pools for the standalone HTTP deployment.',
  generatedImages: {
    assetCount: assetSlots.length,
    eventCount: eventSlots.length,
    additionalProfileCount: PROFILE_PROMPTS.length,
    totalNewLargeImages: assetSlots.length + eventSlots.length + PROFILE_PROMPTS.length
  },
  landscapeVariants: config.landscapeVariants,
  profileVariants: config.profileVariants,
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
    const filePath = path.join(ROOT, config.paths.media, item.minioKey);
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
  [FRONTEND_HELPER_PATH, frontendHelper.source],
  [FRONTEND_DEFINITIONS_PATH, frontendHelper.definitions],
  [MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`]
]);

if (frontendOnlyMode) {
  for (const filePath of expected.keys()) {
    if (![FRONTEND_HELPER_PATH, FRONTEND_DEFINITIONS_PATH].includes(filePath)) expected.delete(filePath);
  }
}

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

function assertUniqueEventImageDefinitions(definitions) {
  for (const field of ['title', 'subtitle', 'location', 'visual']) {
    const values = definitions.map(definition => normalize(definition[field]));
    const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
    if (duplicates.length) {
      throw new Error(`Event image definitions must have unique ${field} values: ${[...new Set(duplicates)].join(', ')}`);
    }
  }
}

function mediaUrl(key) {
  return `${config.publicMediaPrefix}${key}`;
}

function assetMinioKey(slot) {
  return config.assetMediaKey.replace('{slot}', pad(slot));
}

function eventMinioKey(slot) {
  return config.eventMediaKey.replace('{slot}', pad(slot));
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
  const ignored = new Set(config.ignoredTokens);
  return new Set(weighted.map(stem).filter(token => token.length > 1 && !ignored.has(token)));
}

function stem(token) {
  const synonyms = config.synonyms;
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

function buildLocalAssetSeedMaps(assetSlots, mongoUsers) {
  const localUserIdByMongoUserId = new Map(
    mongoUsers.slice(0, config.ownerCount).map((user, index) => [user.userId, `u${index + 1}`])
  );
  const localAssetSlotBySeed = {};
  const localAssetTemplateIdsByOwner = Object.fromEntries(
    mongoUsers.slice(0, config.ownerCount).map((_, index) => [`u${index + 1}`, []])
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
  const variations = config.assetVariations;
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

  const slots = range(1, config.assetCount).map(slotNumber => {
    const assigned = records.filter(asset => slotByAssetId.get(asset.assetId) === slotNumber);
    if (!assigned.length) throw new Error(`Asset slot ${slotNumber} has no Mongo records`);
    const definition = ASSET_SEED_DEFINITION_BY_SLOT[slotNumber];
    const slotVisual = ASSET_SCENE_BY_SLOT[slotNumber];
    if (!slotVisual) throw new Error(`Missing unique visual specification for asset slot ${slotNumber}`);
    return {
      slot: slotNumber,
      key: `asset-${pad(slotNumber)}`,
      minioKey: assetMinioKey(slotNumber),
      frontendPlaceholderUrl: `${config.placeholderBase}${ASSET_PICSUM_IDS[slotNumber - 1]}${config.placeholderSize}`,
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
  return slot >= 1 && slot <= config.assetCount ? slot : null;
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
      frontendPlaceholderUrl: `${config.placeholderBase}${EVENT_PICSUM_IDS[index]}${config.placeholderSize}`,
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
  const values = config.eventTopics;
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

function sortedStrings(values) {
  return [...new Set((values ?? []).filter(value => typeof value === 'string'))].sort();
}

function compareJson(left, right) {
  return JSON.stringify(left).localeCompare(JSON.stringify(right));
}

function eventPrompt(definition, slotNumber) {
  const compositions = config.eventCompositions;
  const lighting = config.eventLighting;
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
  return {
    definitions: `${JSON.stringify({
      assets: ASSET_SEED_DEFINITION_BY_SLOT,
      events: eventDefinitionBySlot,
      assetSlotsByTemplate: LOCAL_ASSET_SLOTS_BY_TEMPLATE,
      assetSlotBySeed: localAssetSlotBySeed,
      assetTemplateIdsByOwner: localAssetTemplateIdsByOwner,
      assetRecordsBySlot: Object.fromEntries(assetSlots.map(slot => [slot.slot, { visibility: slot.mongoRecords[0].visibility, status: slot.mongoRecords[0].status }])),
      eventSlotBySeed: localEventSlotBySeed
    }, null, 2)}\n`,
    source: `// Generated by config/packaging/seeds/scripts/synchronize-demo-image-pools.mjs.\n` +
    `// Frontend-local keeps remote placeholders; the standalone HTTP demo uses the same logical slots from MinIO.\n` +
    `import imagePoolDefinitions from './${path.basename(FRONTEND_DEFINITIONS_PATH)}';\n\n` +
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
    `const ASSET_SLOTS_BY_TEMPLATE: Readonly<Record<string, readonly number[]>> = imagePoolDefinitions.assetSlotsByTemplate;\n\n` +
    `const ASSET_DEFINITION_BY_SLOT: Readonly<Record<number, DemoAssetDefinition>> = imagePoolDefinitions.assets;\n\n` +
    `const ASSET_SLOT_BY_SEED: Readonly<Record<string, number>> = imagePoolDefinitions.assetSlotBySeed;\n\n` +
    `const ASSET_TEMPLATE_IDS_BY_OWNER: Readonly<Record<string, readonly string[]>> = imagePoolDefinitions.assetTemplateIdsByOwner;\n\n` +
    `const ASSET_RECORD_BY_SLOT: Readonly<Record<number, { visibility: DemoAssetPlaceholder['visibility']; status: string }>> = imagePoolDefinitions.assetRecordsBySlot as Readonly<Record<number, { visibility: DemoAssetPlaceholder['visibility']; status: string }>>;\n\n` +
    `const EVENT_DEFINITION_BY_SLOT: Readonly<Record<number, DemoEventDefinition>> = imagePoolDefinitions.events;\n\n` +
    `const EVENT_SLOT_BY_SEED: Readonly<Record<string, number>> = imagePoolDefinitions.eventSlotBySeed;\n\n` +
    `export function demoAssetPlaceholder(seed: string): DemoAssetPlaceholder {\n` +
    `  const slot = demoAssetSlot(seed);\n` +
    `  const definition = ASSET_DEFINITION_BY_SLOT[slot] ?? ASSET_DEFINITION_BY_SLOT[1];\n` +
    `  return {\n` +
    `    ...definition,\n` +
    `    slot,\n` +
    `    imageUrl: \`${config.placeholderBase}\${ASSET_PICSUM_IDS[slot - 1]}${config.placeholderSize}\`,\n` +
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
    `    imageUrl: \`${config.placeholderBase}\${EVENT_PICSUM_IDS[slot - 1]}${config.placeholderSize}\`\n` +
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
    `}\n`
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
