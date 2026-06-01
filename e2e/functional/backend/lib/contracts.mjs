import {
  assert,
  collectStringsByKey,
  expectArray,
  expectBoolean,
  expectImageUrl,
  expectNonEmptyArray,
  expectNumber,
  expectObject,
  expectOptionalBoolean,
  expectOptionalNumber,
  expectOptionalString,
  expectString,
  unique
} from '../../../shared/assertions.mjs';
import { resolveResourceUrl } from '../../../shared/http.mjs';

export function rememberImages(ctx, value) {
  const urls = unique([
    ...collectStringsByKey(value, 'imageUrl'),
    ...collectStringsByKey(value, 'imageUrls'),
    ...(ctx.vars.imageUrls ?? [])
  ]).filter(url => !/^(data:|blob:|indexeddb:)/i.test(url));
  ctx.vars.imageUrls = urls;
  return urls;
}

export function assertDemoUsers(value, ctx) {
  const users = expectNonEmptyArray(value, 'demo users');
  users.forEach((user, index) => assertDemoUserItem(user, `demo users[${index}]`));
  ctx.vars.demoUsers = users;
  const activeUsers = users.filter(user => !user.deletedAtIso && user.profileStatus !== 'deleted');
  const completeUsers = activeUsers.filter(user => `${user.name ?? ''}`.trim() && `${user.id ?? ''}`.trim());
  const first = activeUsers[0] ?? users[0];
  const selected = completeUsers[0] ?? first;
  const second = completeUsers.find(user => user.id !== selected.id)
    ?? activeUsers.find(user => user.id !== selected.id)
    ?? users.find(user => user.id !== selected.id);
  ctx.vars.userId = selected.id;
  ctx.vars.demoUserId = selected.id;
  ctx.vars.secondUserId = second?.id ?? selected.id;
  return users;
}

export function assertDemoUserItem(value, path) {
  const user = expectObject(value, path);
  expectString(user.id, `${path}.id`);
  expectString(user.name, `${path}.name`, { allowEmpty: true });
  expectOptionalString(user.city, `${path}.city`);
  expectString(user.initials, `${path}.initials`);
  expectString(user.gender, `${path}.gender`);
  expectOptionalString(user.statusText, `${path}.statusText`);
  expectOptionalNumber(user.completion, `${path}.completion`);
  expectOptionalNumber(user.profileFormVersion, `${path}.profileFormVersion`);
}

export function assertUser(value, path = 'user') {
  const user = expectObject(value, path);
  expectString(user.id, `${path}.id`);
  expectString(user.name, `${path}.name`);
  expectOptionalNumber(user.age, `${path}.age`);
  expectOptionalString(user.birthday, `${path}.birthday`);
  expectOptionalString(user.city, `${path}.city`);
  expectOptionalString(user.height, `${path}.height`);
  expectOptionalString(user.physique, `${path}.physique`);
  if (user.languages !== null && user.languages !== undefined) {
    expectArray(user.languages, `${path}.languages`);
  }
  expectString(user.initials, `${path}.initials`);
  expectString(user.gender, `${path}.gender`);
  expectOptionalNumber(user.completion, `${path}.completion`);
  if (user.images !== null && user.images !== undefined) {
    expectArray(user.images, `${path}.images`).forEach((url, index) => {
      if (`${url ?? ''}`.trim()) {
        expectImageUrl(url, `${path}.images[${index}]`);
      }
    });
  }
  return user;
}

export function assertAuthMe(value, ctx) {
  const user = assertUser(value, 'auth/me');
  expectOptionalNumber(user.filterCount, 'auth/me.filterCount');
  if (user.filterPreferences !== null && user.filterPreferences !== undefined) {
    expectObject(user.filterPreferences, 'auth/me.filterPreferences');
  }
  ctx.vars.userId = user.id;
  rememberImages(ctx, user);
  return user;
}

export function assertExperiences(value, ctx) {
  const response = expectObject(value, 'experiences');
  expectString(response.userId, 'experiences.userId');
  expectArray(response.entries, 'experiences.entries').forEach((entry, index) => {
    const path = `experiences.entries[${index}]`;
    expectObject(entry, path);
    expectString(entry.id, `${path}.id`);
    expectString(entry.title, `${path}.title`);
  });
  ctx.vars.userId = response.userId;
}

export function assertI18nBundle(value) {
  const bundle = expectObject(value, 'i18n bundle');
  expectString(bundle.lang, 'i18n bundle.lang');
  expectString(bundle.version, 'i18n bundle.version', { allowEmpty: true });
  expectObject(bundle.data, 'i18n bundle.data');
  assert(Object.keys(bundle.data).length > 10, 'i18n bundle should contain translated keys');
}

export function assertLandingContent(value, ctx) {
  const response = expectObject(value, 'landing content');
  assertHelpState(response.privacy, ctx, 'landing content.privacy');
  expectArray(response.ideas, 'landing content.ideas').forEach((idea, index) => assertIdeaPost(idea, `landing content.ideas[${index}]`));
  if (response.loginAvailability !== null && response.loginAvailability !== undefined) {
    assertEligibility(response.loginAvailability, 'landing content.loginAvailability');
  }
  rememberImages(ctx, response);
}

export function assertEligibility(value, path = 'eligibility') {
  const response = expectObject(value, path);
  expectBoolean(response.eligible, `${path}.eligible`);
  expectOptionalString(response.partitionKey, `${path}.partitionKey`);
  expectOptionalString(response.message, `${path}.message`);
  expectBoolean(response.securityGateEnabled, `${path}.securityGateEnabled`);
  expectBoolean(response.locationRequired, `${path}.locationRequired`);
}

export function assertHelpState(value, ctx, path = 'help state') {
  const state = expectObject(value, path);
  if (state.activeRevision !== null && state.activeRevision !== undefined) {
    assertHelpRevision(state.activeRevision, `${path}.activeRevision`);
  }
  expectArray(state.revisions, `${path}.revisions`).forEach((revision, index) => {
    assertHelpRevision(revision, `${path}.revisions[${index}]`);
  });
  if (state.availableLanguages !== null && state.availableLanguages !== undefined) {
    expectArray(state.availableLanguages, `${path}.availableLanguages`);
  }
  rememberImages(ctx, state);
}

export function assertHelpRevision(value, path) {
  const revision = expectObject(value, path);
  expectString(revision.id, `${path}.id`);
  expectString(revision.documentKind, `${path}.documentKind`);
  expectString(revision.lang, `${path}.lang`);
  expectNumber(revision.version, `${path}.version`);
  expectString(revision.title, `${path}.title`);
  expectArray(revision.sections, `${path}.sections`).forEach((section, index) => {
    const sectionPath = `${path}.sections[${index}]`;
    expectObject(section, sectionPath);
    expectString(section.id, `${sectionPath}.id`);
    expectString(section.title, `${sectionPath}.title`);
    expectString(section.contentHtml, `${sectionPath}.contentHtml`);
    if (section.imageUrls !== null && section.imageUrls !== undefined) {
      expectArray(section.imageUrls, `${sectionPath}.imageUrls`).forEach((url, urlIndex) => {
        if (`${url ?? ''}`.trim()) {
          expectImageUrl(url, `${sectionPath}.imageUrls[${urlIndex}]`);
        }
      });
    }
  });
}

export function assertIdeaPost(value, path = 'idea') {
  const idea = expectObject(value, path);
  expectString(idea.id, `${path}.id`);
  expectString(idea.title, `${path}.title`);
  expectOptionalString(idea.excerpt, `${path}.excerpt`);
  expectOptionalString(idea.contentHtml, `${path}.contentHtml`);
  expectOptionalString(idea.imageUrl, `${path}.imageUrl`);
  if (idea.imageUrls !== null && idea.imageUrls !== undefined) {
    expectArray(idea.imageUrls, `${path}.imageUrls`);
  }
}

export function assertGameCards(value, ctx) {
  const response = expectObject(value, 'game cards');
  expectNumber(response.filterCount ?? 0, 'game cards.filterCount');
  expectArray(response.cardUserIds ?? [], 'game cards.cardUserIds');
  expectArray(response.users ?? [], 'game cards.users').forEach((user, index) => assertUser(user, `game cards.users[${index}]`));
  if (response.cardUserIds?.length) {
    ctx.vars.cardUserId = response.cardUserIds[0];
  }
  rememberImages(ctx, response);
}

export function assertEventList(value, ctx, path = 'events') {
  const events = expectArray(value, path);
  events.forEach((event, index) => assertEvent(event, `${path}[${index}]`));
  rememberFirstEvent(ctx, events);
  rememberImages(ctx, events);
  return events;
}

export function assertEventPage(value, ctx, path = 'events page') {
  const page = expectObject(value, path);
  expectArray(page.records, `${path}.records`).forEach((event, index) => assertEvent(event, `${path}.records[${index}]`));
  expectNumber(page.total ?? page.records.length, `${path}.total`);
  expectOptionalString(page.nextCursor, `${path}.nextCursor`);
  rememberFirstEvent(ctx, page.records);
  rememberImages(ctx, page);
}

export function assertEvent(value, path = 'event') {
  const event = expectObject(value, path);
  expectString(event.id, `${path}.id`);
  expectString(event.title, `${path}.title`);
  expectOptionalString(event.userId, `${path}.userId`);
  expectOptionalString(event.type, `${path}.type`);
  expectOptionalString(event.status, `${path}.status`);
  expectOptionalBoolean(event.isInvitation, `${path}.isInvitation`);
  expectOptionalBoolean(event.isHosting, `${path}.isHosting`);
  expectOptionalBoolean(event.ticketing, `${path}.ticketing`);
  if (event.subEvents !== null && event.subEvents !== undefined) {
    expectArray(event.subEvents, `${path}.subEvents`);
  }
  return event;
}

export function rememberFirstEvent(ctx, events) {
  const list = Array.isArray(events) ? events : [];
  const event = list.find(item => Array.isArray(item.subEvents) && item.subEvents.length > 0) ?? list[0];
  if (!event) {
    return null;
  }
  ctx.vars.eventId = event.id;
  ctx.vars.ownerId = event.id;
  const subEvent = Array.isArray(event.subEvents) ? event.subEvents[0] : null;
  if (subEvent?.id) {
    ctx.vars.subEventId = subEvent.id;
  }
  return event;
}

export function assertAssets(value, ctx, path = 'assets') {
  const assets = expectArray(value, path);
  assets.forEach((asset, index) => assertAsset(asset, `${path}[${index}]`));
  const asset = assets[0];
  if (asset) {
    ctx.vars.assetId = asset.id;
    ctx.vars.assetType = asset.type ?? 'place';
    ctx.vars.assetCategory = asset.category ?? '';
  }
  rememberImages(ctx, assets);
}

export function assertAsset(value, path = 'asset') {
  const asset = expectObject(value, path);
  expectString(asset.id, `${path}.id`);
  expectString(asset.type, `${path}.type`);
  expectString(asset.title, `${path}.title`);
  expectOptionalString(asset.subtitle, `${path}.subtitle`);
  expectOptionalString(asset.category, `${path}.category`);
  expectOptionalString(asset.imageUrl, `${path}.imageUrl`);
  if (asset.routes !== null && asset.routes !== undefined) {
    expectArray(asset.routes, `${path}.routes`);
  }
  if (asset.requests !== null && asset.requests !== undefined) {
    expectArray(asset.requests, `${path}.requests`);
  }
}

export function assertTicketsPage(value, ctx) {
  const page = expectObject(value, 'asset tickets');
  expectArray(page.records, 'asset tickets.records').forEach((event, index) => assertEvent(event, `asset tickets.records[${index}]`));
  expectNumber(page.total ?? page.records.length, 'asset tickets.total');
  rememberImages(ctx, page);
}

export function assertChats(value, ctx, path = 'chats') {
  const chats = expectArray(value, path);
  chats.forEach((chat, index) => assertChat(chat, `${path}[${index}]`));
  if (chats[0]?.id) {
    ctx.vars.chatId = chats[0].id;
  }
}

export function assertChatPage(value, ctx) {
  const page = expectObject(value, 'chat page');
  expectArray(page.items, 'chat page.items').forEach((chat, index) => assertChat(chat, `chat page.items[${index}]`));
  expectNumber(page.total ?? page.items.length, 'chat page.total');
  if (page.items[0]?.id) {
    ctx.vars.chatId = page.items[0].id;
  }
}

export function assertChat(value, path = 'chat') {
  const chat = expectObject(value, path);
  expectString(chat.id, `${path}.id`);
  expectString(chat.title, `${path}.title`);
  expectArray(chat.memberIds ?? [], `${path}.memberIds`);
  expectOptionalNumber(chat.unread, `${path}.unread`);
}

export function assertMessages(value, ctx) {
  expectArray(value, 'chat messages').forEach((message, index) => {
    const path = `chat messages[${index}]`;
    expectObject(message, path);
    expectString(message.id, `${path}.id`);
    expectOptionalString(message.text, `${path}.text`);
    expectOptionalString(message.senderId, `${path}.senderId`);
    if (index === 0) {
      ctx.vars.messageId = message.id;
    }
  });
  rememberImages(ctx, value);
}

export function assertRates(value) {
  expectArray(value, 'rates').forEach((rate, index) => {
    const path = `rates[${index}]`;
    expectObject(rate, path);
    expectString(rate.id, `${path}.id`);
    expectString(rate.userId, `${path}.userId`);
  });
}

export function assertRatePage(value) {
  const page = expectObject(value, 'rate page');
  expectArray(page.items, 'rate page.items');
  expectNumber(page.total ?? page.items.length, 'rate page.total');
  if (page.users !== null && page.users !== undefined) {
    expectArray(page.users, 'rate page.users');
  }
}

export function assertActivityMembers(value) {
  expectArray(value, 'activity members').forEach((member, index) => {
    const path = `activity members[${index}]`;
    expectObject(member, path);
    expectString(member.id, `${path}.id`);
    expectString(member.userId, `${path}.userId`);
  });
}

export function assertActivityResourceState(value) {
  const state = expectObject(value, 'activity resource state');
  expectString(state.ownerId, 'activity resource state.ownerId');
  expectString(state.subEventId, 'activity resource state.subEventId');
  expectString(state.assetOwnerUserId, 'activity resource state.assetOwnerUserId');
  expectObject(state.assetAssignmentIds ?? {}, 'activity resource state.assetAssignmentIds');
}

export function assertLeaderboard(value) {
  const state = expectObject(value, 'leaderboard');
  expectString(state.eventId, 'leaderboard.eventId');
  expectString(state.subEventId, 'leaderboard.subEventId');
  expectOptionalString(state.title, 'leaderboard.title');
  expectArray(state.groups ?? [], 'leaderboard.groups');
}

export function assertAdminState(value, ctx, path = 'admin state') {
  expectObject(value, path);
  rememberImages(ctx, value);
}

export function assertAffinityGraphMeta(value, ctx, path = 'admin affinity graph meta') {
  const meta = expectObject(value, path);
  expectString(meta.generatedAtIso, `${path}.generatedAtIso`);
  expectString(meta.source, `${path}.source`);
  rememberAffinityGraphLayout(ctx, meta);
  expectNumber(meta.memberCount, `${path}.memberCount`);
  expectNumber(meta.linkCount, `${path}.linkCount`);
  expectNumber(meta.componentCount, `${path}.componentCount`);
  expectNumber(meta.isolatedCount, `${path}.isolatedCount`);
  expectNumber(meta.maxZoom, `${path}.maxZoom`);
  expectNumber(meta.tileSize, `${path}.tileSize`);
  expectNumber(meta.nodeRenderBudget, `${path}.nodeRenderBudget`);
  expectNumber(meta.edgeRenderBudget, `${path}.edgeRenderBudget`);
  expectBoolean(meta.materialized, `${path}.materialized`);
  return meta;
}

export function assertAffinityGraphForests(value, ctx, path = 'admin affinity graph forests') {
  const response = expectObject(value, path);
  expectString(response.generatedAtIso, `${path}.generatedAtIso`);
  expectString(response.source, `${path}.source`);
  rememberAffinityGraphLayout(ctx, response);
  expectOptionalNumber(response.forestCount, `${path}.forestCount`);
  expectOptionalNumber(response.forestLevel, `${path}.forestLevel`);
  expectOptionalNumber(response.maxForestLevel, `${path}.maxForestLevel`);
  expectOptionalNumber(response.limit, `${path}.limit`);
  expectOptionalNumber(response.offset, `${path}.offset`);
  expectArray(response.forests, `${path}.forests`).forEach((forest, index) => {
    assertAffinityGraphForest(forest, ctx, `${path}.forests[${index}]`);
  });
  return response;
}

export function assertAffinityGraphTile(value, ctx, path = 'admin affinity graph tile') {
  const tile = expectObject(value, path);
  expectString(tile.generatedAtIso, `${path}.generatedAtIso`);
  expectString(tile.source, `${path}.source`);
  rememberAffinityGraphLayout(ctx, tile);
  expectNumber(tile.z, `${path}.z`);
  expectNumber(tile.x, `${path}.x`);
  expectNumber(tile.y, `${path}.y`);
  expectNumber(tile.nodeCount, `${path}.nodeCount`);
  expectNumber(tile.edgeCount, `${path}.edgeCount`);
  expectBoolean(tile.truncated, `${path}.truncated`);
  expectArray(tile.nodes, `${path}.nodes`).forEach((node, index) => {
    assertAffinityGraphNode(node, ctx, `${path}.nodes[${index}]`);
  });
  expectArray(tile.edges, `${path}.edges`).forEach((edge, index) => {
    assertAffinityGraphEdge(edge, `${path}.edges[${index}]`);
  });
  rememberImages(ctx, tile);
  return tile;
}

export function assertAffinityGraphNeighborhood(value, ctx, path = 'admin affinity graph neighborhood') {
  const graph = assertAffinityGraphTile(
    {
      ...value,
      z: value?.z ?? 0,
      x: value?.x ?? 0,
      y: value?.y ?? 0,
      nodeCount: Array.isArray(value?.nodes) ? value.nodes.length : 0,
      edgeCount: Array.isArray(value?.edges) ? value.edges.length : 0,
      truncated: false
    },
    ctx,
    path
  );
  expectString(value.centerUserId, `${path}.centerUserId`);
  expectNumber(value.depth, `${path}.depth`);
  ctx.vars.affinityGraphUserId = value.centerUserId;
  return graph;
}

function assertAffinityGraphForest(value, ctx, path) {
  const forest = expectObject(value, path);
  expectString(forest.componentId, `${path}.componentId`);
  expectString(forest.representativeUserId, `${path}.representativeUserId`);
  expectString(forest.representativeName, `${path}.representativeName`, { allowEmpty: true });
  expectString(forest.representativeInitials, `${path}.representativeInitials`, { allowEmpty: true });
  expectOptionalString(forest.gender, `${path}.gender`);
  expectNumber(forest.memberCount, `${path}.memberCount`);
  expectNumber(forest.edgeCount, `${path}.edgeCount`);
  expectNumber(forest.weightedDegree, `${path}.weightedDegree`);
  expectNumber(forest.x, `${path}.x`);
  expectNumber(forest.y, `${path}.y`);
  expectNumber(forest.z, `${path}.z`);
  expectNumber(forest.radius, `${path}.radius`);
  ctx.vars.affinityGraphComponentId ??= forest.componentId;
  ctx.vars.affinityGraphUserId ??= forest.representativeUserId;
  return forest;
}

function assertAffinityGraphNode(value, ctx, path) {
  const node = expectObject(value, path);
  expectString(node.id, `${path}.id`);
  expectString(node.name, `${path}.name`, { allowEmpty: true });
  expectString(node.initials, `${path}.initials`, { allowEmpty: true });
  expectOptionalString(node.gender, `${path}.gender`);
  expectOptionalString(node.city, `${path}.city`);
  expectOptionalNumber(node.age, `${path}.age`);
  expectOptionalString(node.headline, `${path}.headline`);
  expectOptionalString(node.traitLabel, `${path}.traitLabel`);
  expectOptionalString(node.statusText, `${path}.statusText`);
  expectOptionalString(node.profileStatus, `${path}.profileStatus`);
  expectOptionalString(node.image, `${path}.image`);
  if (node.images !== null && node.images !== undefined) {
    expectArray(node.images, `${path}.images`);
  }
  expectOptionalString(node.componentId, `${path}.componentId`);
  expectOptionalNumber(node.x, `${path}.x`);
  expectOptionalNumber(node.y, `${path}.y`);
  expectOptionalNumber(node.z, `${path}.z`);
  expectOptionalNumber(node.degree, `${path}.degree`);
  expectOptionalNumber(node.weightedDegree, `${path}.weightedDegree`);
  expectOptionalNumber(node.centrality, `${path}.centrality`);
  ctx.vars.affinityGraphUserId ??= node.id;
  if (`${node.componentId ?? ''}`.trim()) {
    ctx.vars.affinityGraphComponentId ??= node.componentId;
  }
  return node;
}

function assertAffinityGraphEdge(value, path) {
  const edge = expectObject(value, path);
  expectString(edge.id, `${path}.id`);
  expectString(edge.source, `${path}.source`);
  expectString(edge.target, `${path}.target`);
  expectNumber(edge.weight, `${path}.weight`);
  expectOptionalNumber(edge.affinityScore, `${path}.affinityScore`);
  expectOptionalString(edge.updatedDate, `${path}.updatedDate`);
  return edge;
}

function rememberAffinityGraphLayout(ctx, value) {
  const layoutVersion = `${value?.layoutVersion ?? ''}`.trim();
  if (layoutVersion) {
    ctx.vars.affinityGraphLayoutVersion = layoutVersion;
  }
}

export async function assertReachableLocalImages(ctx, urls) {
  const localUrls = unique(urls)
    .map(url => resolveResourceUrl(ctx.http.baseUrl, url))
    .filter(Boolean)
    .filter(url => new URL(url).origin === new URL(ctx.http.baseUrl).origin)
    .slice(0, Number(process.env.E2E_MAX_IMAGE_CHECKS ?? 25));
  for (const url of localUrls) {
    const result = await ctx.http.get(url, {
      allowStatuses: [200, 204, 206],
      headers: { Accept: 'image/*,*/*;q=0.8' },
      timeoutMs: Number(process.env.E2E_IMAGE_TIMEOUT_MS ?? 10000)
    });
    const contentType = `${result.headers['content-type'] ?? ''}`.toLowerCase();
    assert(
      contentType.includes('image') || contentType.includes('octet-stream'),
      `Expected image content-type for ${url}`,
      { contentType }
    );
  }
  return localUrls;
}
