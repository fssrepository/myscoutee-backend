#!/usr/bin/env node

import { readFileSync } from 'node:fs';

import WebSocket from '../../../../../myscoutee-frontend/node_modules/ws/index.js';

const args = process.argv.slice(2);
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? `${args[index + 1] ?? ''}`.trim() : '';
};

const manifestPath = option('--manifest');
const phase = option('--phase') || 'terminal';
if (!manifestPath || !['baseline', 'terminal'].includes(phase)) {
  fail('Usage: verify-chat-content-oracle.mjs --manifest FILE [--phase baseline|terminal]');
}

const prefix = 'manual-qa-checkpoint:v1:chat-flow';
const chatId = `${prefix}:group`;
const unavailableMessageId = `${prefix}:content:unavailable`;
const eventId = `${prefix}:content:event`;
const assetId = `${prefix}:content:asset`;
const removedAssetId = `${prefix}:content:asset:removed`;
const pollQuestion = 'QA CHAT CONTENT 001 · Which route?';
const actorUserIds = [
  '650000000000000000000061',
  '650000000000000000000062',
  '650000000000000000000063'
];
const expectedContentTypes = ['image', 'voice', 'poll', 'event', 'asset'];

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const results = [];
for (const actorUserId of actorUserIds) {
  const session = (manifest.sessions ?? []).find(item => `${item.userId ?? ''}`.trim() === actorUserId);
  const port = Number(session?.devToolsPort);
  if (!Number.isInteger(port) || port <= 0) fail(`No live DevTools session for actor '${actorUserId}'.`);
  const target = await localhostTarget(port);
  results.push(await evaluate(target.webSocketDebuggerUrl, actorUserId, phase));
}

if (phase === 'baseline') {
  const checks = {
    exactAllActors: results.length === actorUserIds.length,
    exactLists: results.every(result => result.exactList),
    exactBaselineHistory: results.every(result => result.exactBaselineHistory),
    exactUnavailableControl: results.every(result => result.unavailableControl),
    zeroCounters: results.every(result => result.chatUnread === 0 && result.chats === 0 && result.groupChats === 0)
  };
  if (!Object.values(checks).every(Boolean)) {
    fail(`CHAT-CONTENT-001 baseline browser oracle mismatch: ${JSON.stringify({ checks, results })}`);
  }
  console.log(JSON.stringify({ checkpoint: 'CHAT-CONTENT-001', phase, checks, actors: results }, null, 2));
  process.exit(0);
}

const canonical = results[0]?.canonicalContent;
const checks = {
  exactAllActors: results.length === actorUserIds.length,
  identicalPersistedContent: results.every(result => JSON.stringify(result.canonicalContent) === JSON.stringify(canonical)),
  exactMediaPayloads: results.every(result => result.media.image.ok
    && result.media.imagePreview.ok
    && result.media.voice.ok),
  exactPollVoterImages: results.every(result => result.pollVoterImages.length === 2
    && result.pollVoterImages.every(image => image.ok)),
  exactAssetCategoryFiltering: results.every(result => result.wholeTransportContainsFixture
    && result.sedanTransportContainsFixture
    && result.suvExcludesFixture),
  exactUnavailableControl: results.every(result => result.unavailableControl),
  exactCountersAfterRead: results.every(result => result.chatUnread === 0 && result.chats === 0 && result.groupChats === 0)
};
if (!Object.values(checks).every(Boolean)) {
  fail(`CHAT-CONTENT-001 browser oracle mismatch: ${JSON.stringify({ checks, results })}`);
}
console.log(JSON.stringify({ checkpoint: 'CHAT-CONTENT-001', checks, actors: results }, null, 2));

async function localhostTarget(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/list`);
  if (!response.ok) fail(`Chrome DevTools target list returned HTTP ${response.status}.`);
  const targets = await response.json();
  const target = targets.find(item => item.type === 'page' && /^http:\/\/localhost(?:\/|$)/.test(`${item.url ?? ''}`));
  if (!target?.webSocketDebuggerUrl) fail(`No localhost page target found on DevTools port ${port}.`);
  return target;
}

async function evaluate(webSocketUrl, actorUserId, requestedPhase) {
  const oracle = requestedPhase === 'baseline' ? browserBaselineOracle : browserOracle;
  const expression = `(${oracle.toString()})(${JSON.stringify({
    actorUserId,
    actorUserIds,
    chatId,
    unavailableMessageId,
    eventId,
    assetId,
    removedAssetId,
    pollQuestion,
    expectedContentTypes
  })})`;
  const result = await cdpCommand(webSocketUrl, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  if (result.exceptionDetails) {
    fail(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text ?? 'Browser content oracle failed.');
  }
  return result.result?.value ?? null;
}

async function browserBaselineOracle({ actorUserId, chatId, unavailableMessageId, removedAssetId }) {
  const stored = JSON.parse(localStorage.getItem('myscoutee.http.session.v1') || 'null');
  if (stored?.kind !== 'demo' || `${stored?.userId ?? ''}`.trim() !== actorUserId) {
    throw new Error('Unexpected authenticated demo actor.');
  }
  const headers = {
    'X-App-Session-Kind': 'demo',
    'X-Demo-User-Id': actorUserId,
    ...(stored.sessionId ? { 'X-App-Session-Id': `${stored.sessionId}` } : {})
  };
  const chatSearch = new URLSearchParams({ userId: actorUserId, limit: '20', contextFilter: 'all', sort: 'date', sortDirection: 'desc' });
  const chatResponse = await fetch(`/api/activities/chats/page?${chatSearch}`, { headers });
  if (!chatResponse.ok) throw new Error(`Chat list returned HTTP ${chatResponse.status}.`);
  const chatPage = await chatResponse.json();
  const messages = [];
  let cursor = '';
  do {
    const search = new URLSearchParams({ userId: actorUserId, limit: '15', ...(cursor ? { cursor } : {}) });
    const response = await fetch(`/api/activities/chats/${encodeURIComponent(chatId)}/messages?${search}`, { headers });
    if (!response.ok) throw new Error(`Messages returned HTTP ${response.status}.`);
    const page = await response.json();
    messages.push(...(page.items ?? []));
    cursor = `${page.nextCursor ?? ''}`;
  } while (cursor);
  const group = (chatPage.items ?? []).find(item => item.id === chatId);
  const unavailable = messages.find(message => message.id === unavailableMessageId)?.attachments?.[0];
  return {
    actorUserId,
    exactList: chatPage.total === 4 && (chatPage.items ?? []).length === 4,
    exactBaselineHistory: messages.length === 19 && new Set(messages.map(message => message.id)).size === 19,
    unavailableControl: unavailable?.type === 'asset'
      && unavailable.entityId === removedAssetId
      && unavailable.status === 'unavailable'
      && unavailable.unavailableReason === 'deleted',
    chatUnread: Number(group?.unread ?? -1),
    chats: Number(chatPage.chats ?? -1),
    groupChats: Number(chatPage.chatCounters?.group ?? -1)
  };
}

async function browserOracle({
  actorUserId,
  actorUserIds,
  chatId,
  unavailableMessageId,
  eventId,
  assetId,
  removedAssetId,
  pollQuestion,
  expectedContentTypes
}) {
  const stored = JSON.parse(localStorage.getItem('myscoutee.http.session.v1') || 'null');
  if (stored?.kind !== 'demo' || `${stored?.userId ?? ''}`.trim() !== actorUserId) {
    throw new Error('Unexpected authenticated demo actor.');
  }
  const headers = {
    'X-App-Session-Kind': 'demo',
    'X-Demo-User-Id': actorUserId,
    ...(stored.sessionId ? { 'X-App-Session-Id': `${stored.sessionId}` } : {})
  };
  const messages = [];
  let cursor = '';
  do {
    const search = new URLSearchParams({ userId: actorUserId, limit: '15', ...(cursor ? { cursor } : {}) });
    const response = await fetch(`/api/activities/chats/${encodeURIComponent(chatId)}/messages?${search}`, { headers });
    if (!response.ok) throw new Error(`Messages returned HTTP ${response.status}.`);
    const page = await response.json();
    messages.push(...(page.items ?? []));
    cursor = `${page.nextCursor ?? ''}`;
  } while (cursor);

  const chronological = [...messages].sort((left, right) => `${left.sentAtIso ?? ''}`.localeCompare(`${right.sentAtIso ?? ''}`));
  const content = chronological.filter(message => (message.attachments ?? []).some(attachment => expectedContentTypes.includes(attachment.type)));
  const unavailable = chronological.find(message => message.id === unavailableMessageId);
  const availableContent = content.filter(message => message.id !== unavailableMessageId);
  const types = availableContent.map(message => message.attachments?.[0]?.type ?? '');
  if (messages.length !== 24 || JSON.stringify(types) !== JSON.stringify(expectedContentTypes)) {
    throw new Error(`Expected 24 messages and ${expectedContentTypes.join(',')} content, received ${messages.length} and ${types.join(',')}.`);
  }
  const byType = Object.fromEntries(availableContent.map(message => [message.attachments[0].type, message]));
  const poll = JSON.parse(`${byType.poll.attachments[0].description ?? '{}'}`);
  const north = (poll.options ?? []).find(option => option.text === 'North');
  const south = (poll.options ?? []).find(option => option.text === 'South');
  const southVoters = (south?.votes ?? []).map(vote => `${vote.userId ?? ''}`).sort();
  if (poll.question !== pollQuestion
    || (north?.votes ?? []).length !== 0
    || JSON.stringify(southVoters) !== JSON.stringify([...actorUserIds.slice(1)].sort())) {
    throw new Error(`Unexpected persisted poll state: ${JSON.stringify(poll)}.`);
  }
  if (byType.event.attachments[0].entityId !== eventId || byType.event.attachments[0].status !== 'available') {
    throw new Error('Available Event attachment target is incorrect.');
  }
  if (byType.asset.attachments[0].entityId !== assetId || byType.asset.attachments[0].status !== 'available') {
    throw new Error('Available Asset attachment target is incorrect.');
  }
  const expectedReaders = [...actorUserIds.slice(1)].sort();
  for (const message of availableContent) {
    const readers = (message.readBy ?? []).map(reader => `${reader.id ?? ''}`).sort();
    if (`${message.senderId ?? ''}` !== actorUserIds[0]
      || JSON.stringify(readers) !== JSON.stringify(expectedReaders)) {
      throw new Error(`Sender/read state mismatch for ${message.id}.`);
    }
  }
  const readMedia = async (url, expectedPrefix) => {
    const response = await fetch(`${url ?? ''}`, { headers });
    const contentType = `${response.headers.get('content-type') ?? ''}`.toLowerCase();
    const bytes = response.ok ? (await response.arrayBuffer()).byteLength : 0;
    return { ok: response.ok && contentType.startsWith(expectedPrefix) && bytes > 0, status: response.status, contentType, bytes };
  };
  const media = {
    image: await readMedia(byType.image.attachments[0].url, 'image/'),
    imagePreview: await readMedia(byType.image.attachments[0].previewUrl, 'image/'),
    voice: await readMedia(byType.voice.attachments[0].url, 'audio/')
  };
  const pollVoterImages = await Promise.all((south?.votes ?? []).map(vote => readMedia(vote.imageUrl, 'image/')));
  const chatSearch = new URLSearchParams({ userId: actorUserId, limit: '20', contextFilter: 'all', sort: 'date', sortDirection: 'desc' });
  const chatResponse = await fetch(`/api/activities/chats/page?${chatSearch}`, { headers });
  if (!chatResponse.ok) throw new Error(`Chat list returned HTTP ${chatResponse.status}.`);
  const chatPage = await chatResponse.json();
  const group = (chatPage.items ?? []).find(item => item.id === chatId);
  const assetExplore = async category => {
    const search = new URLSearchParams({
      userId: actorUserId,
      type: 'Transport',
      category,
      startAtIso: `${group?.contextStartAtIso ?? ''}`,
      endAtIso: `${group?.contextEndAtIso ?? ''}`,
      page: '0',
      pageSize: '100',
      order: 'availability'
    });
    const response = await fetch(`/api/assets/explore?${search}`, { headers });
    if (!response.ok) throw new Error(`Asset Explore returned HTTP ${response.status}.`);
    return response.json();
  };
  const wholeTransport = await assetExplore('');
  const sedanTransport = await assetExplore('Sedan');
  const suvTransport = await assetExplore('SUV');
  const unavailableAttachment = unavailable?.attachments?.[0];
  return {
    actorUserId,
    canonicalContent: availableContent.map(message => ({
      id: message.id,
      type: message.attachments[0].type,
      title: message.attachments[0].title,
      entityId: message.attachments[0].entityId ?? null,
      description: message.attachments[0].description ?? null,
      url: message.attachments[0].url ?? null,
      previewUrl: message.attachments[0].previewUrl ?? null,
      mimeType: message.attachments[0].mimeType ?? null,
      sizeBytes: message.attachments[0].sizeBytes ?? null,
      readers: (message.readBy ?? []).map(reader => `${reader.id ?? ''}`).sort()
    })),
    media,
    pollVoterImages,
    unavailableControl: unavailableAttachment?.type === 'asset'
      && unavailableAttachment.entityId === removedAssetId
      && unavailableAttachment.status === 'unavailable'
      && unavailableAttachment.unavailableReason === 'deleted',
    wholeTransportContainsFixture: (wholeTransport.items ?? []).some(item => item.id === assetId),
    sedanTransportContainsFixture: (sedanTransport.items ?? []).some(item => item.id === assetId),
    suvExcludesFixture: !(suvTransport.items ?? []).some(item => item.id === assetId),
    chatUnread: Number(group?.unread ?? -1),
    chats: Number(chatPage.chats ?? -1),
    groupChats: Number(chatPage.chatCounters?.group ?? -1)
  };
}

function cdpCommand(webSocketUrl, method, params) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketUrl);
    const id = 1;
    const timeout = setTimeout(() => {
      socket.close();
      reject(new Error(`Chrome ${method} timed out.`));
    }, 15000);
    socket.addEventListener('open', () => socket.send(JSON.stringify({ id, method, params })));
    socket.addEventListener('message', event => {
      const message = JSON.parse(String(event.data));
      if (message.id !== id) return;
      clearTimeout(timeout);
      socket.close();
      if (message.error) reject(new Error(message.error.message ?? JSON.stringify(message.error)));
      else resolve(message.result);
    });
    socket.addEventListener('error', () => {
      clearTimeout(timeout);
      reject(new Error('Unable to connect to Chrome DevTools.'));
    }, { once: true });
  });
}

function fail(message) {
  console.error(`verify-chat-content-oracle: ${message}`);
  process.exit(2);
}
