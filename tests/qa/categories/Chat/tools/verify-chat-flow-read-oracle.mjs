#!/usr/bin/env node

import { readFileSync } from 'node:fs';

import WebSocket from '../../../../../myscoutee-frontend/node_modules/ws/index.js';

const args = process.argv.slice(2);
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? `${args[index + 1] ?? ''}`.trim() : '';
};

const manifestPath = option('--manifest');
if (!manifestPath) fail('Usage: verify-chat-flow-read-oracle.mjs --manifest FILE');

const prefix = 'manual-qa-checkpoint:v1:chat-flow';
const actorUserIds = [
  '650000000000000000000061',
  '650000000000000000000062',
  '650000000000000000000063'
];
const expectedDescendingIds = ['group', 'support', 'service', 'event'].map(suffix => `${prefix}:${suffix}`);
const expectedByContext = {
  event: `${prefix}:event`,
  subEvent: null,
  group: `${prefix}:group`,
  service: `${prefix}:service`,
  appSupport: `${prefix}:support`
};
const expectedHistoryIds = Array.from(
  { length: 18 },
  (_value, index) => `${prefix}:history:${String(index + 1).padStart(2, '0')}`
);

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const results = [];
for (const actorUserId of actorUserIds) {
  const session = (manifest.sessions ?? []).find(item => `${item.userId ?? ''}`.trim() === actorUserId);
  const port = Number(session?.devToolsPort);
  if (!Number.isInteger(port) || port <= 0) fail(`No live DevTools session for actor '${actorUserId}'.`);
  const target = await localhostTarget(port);
  const result = await evaluate(target.webSocketDebuggerUrl, actorUserId);
  results.push(result);
}

console.log(JSON.stringify({ checkpoint: 'CHAT-FLOW-001', actors: results }, null, 2));

async function localhostTarget(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/list`);
  if (!response.ok) fail(`Chrome DevTools target list returned HTTP ${response.status}.`);
  const targets = await response.json();
  const target = targets.find(item => item.type === 'page' && /^http:\/\/localhost(?:\/|$)/.test(`${item.url ?? ''}`));
  if (!target?.webSocketDebuggerUrl) fail(`No localhost page target found on DevTools port ${port}.`);
  return target;
}

async function evaluate(webSocketUrl, actorUserId) {
  const expression = [
    '(async () => {',
    `  const actorUserId = ${JSON.stringify(actorUserId)};`,
    `  const expectedDescendingIds = ${JSON.stringify(expectedDescendingIds)};`,
    `  const expectedByContext = ${JSON.stringify(expectedByContext)};`,
    `  const expectedHistoryIds = ${JSON.stringify(expectedHistoryIds)};`,
    "  const stored = JSON.parse(localStorage.getItem('myscoutee.http.session.v1') || 'null');",
    "  if (stored?.kind !== 'demo' || `${stored?.userId ?? ''}`.trim() !== actorUserId) throw new Error('Unexpected authenticated demo actor.');",
    '  const headers = {',
    "    'X-App-Session-Kind': 'demo',",
    "    'X-Demo-User-Id': actorUserId,",
    "    ...(stored.sessionId ? { 'X-App-Session-Id': `${stored.sessionId}` } : {})",
    '  };',
    '  const list = async contextFilter => {',
    "    const search = new URLSearchParams({ userId: actorUserId, limit: '20', contextFilter, sort: 'date', sortDirection: 'desc' });",
    "    const response = await fetch(`/api/activities/chats/page?${search}`, { headers });",
    "    if (!response.ok) throw new Error(`Chat page returned HTTP ${response.status}.`);",
    '    return response.json();',
    '  };',
    "  const messagePage = async cursor => {",
    "    const search = new URLSearchParams({ userId: actorUserId, limit: '15', ...(cursor ? { cursor } : {}) });",
    `    const response = await fetch('/api/activities/chats/${prefix}:group/messages?' + search, { headers });`,
    "    if (!response.ok) throw new Error(`Messages page returned HTTP ${response.status}.`);",
    '    return response.json();',
    '  };',
    "  const all = await list('all');",
    '  const contexts = {};',
    "  for (const key of ['event', 'subEvent', 'group', 'service', 'appSupport']) contexts[key] = await list(key);",
    '  const first = await messagePage(null);',
    '  const second = first.nextCursor ? await messagePage(first.nextCursor) : { items: [], total: first.total, nextCursor: null };',
    '  const ids = page => (page.items || []).map(item => item.id);',
    '  const historyIds = [...ids(first), ...ids(second)];',
    '  const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);',
    '  const checks = {',
    '    exactList: all.total === 4 && same(ids(all), expectedDescendingIds),',
    '    exactContexts: Object.entries(expectedByContext).every(([key, expectedId]) => {',
    '      const page = contexts[key];',
    '      return expectedId === null ? page.total === 0 && ids(page).length === 0 : page.total === 1 && same(ids(page), [expectedId]);',
    '    }),',
    '    zeroUnread: (all.items || []).every(item => item.unread === 0),',
    "    stableHeaders: (all.items || []).every(item => item.ownerStatus === 'A' && item.revision === 1),",
    '    exactHistory: first.total === 18 && second.total === 18 && first.items.length === 15 && second.items.length === 3',
    '      && same([...historyIds].sort(), [...expectedHistoryIds].sort()) && new Set(historyIds).size === 18,',
    '    exactHistoryReaders: [...(first.items || []), ...(second.items || [])].every(message => {',
    "      const senderId = `${message.senderId ?? ''}`.trim();",
    '      const expected = ' + JSON.stringify(actorUserIds) + '.filter(userId => userId !== senderId).sort();',
    "      const actual = (message.readBy || []).map(reader => `${reader.id ?? ''}`.trim()).sort();",
    '      return same(actual, expected);',
    '    })',
    '  };',
    "  if (!Object.values(checks).every(Boolean)) throw new Error(`CHAT-FLOW-001 read mismatch: ${JSON.stringify({ checks, listIds: ids(all), historyIds })}`);",
    '  return { actorUserId, checks, listIds: ids(all), historyCount: historyIds.length, contextTotals: Object.fromEntries(Object.entries(contexts).map(([key, page]) => [key, page.total])) };',
    '})()'
  ].join('\n');
  const result = await cdpCommand(webSocketUrl, 'Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) fail(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text ?? 'Browser read oracle failed.');
  return result.result?.value ?? null;
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
  console.error(`verify-chat-flow-read-oracle: ${message}`);
  process.exit(2);
}
