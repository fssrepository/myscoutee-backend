#!/usr/bin/env node

import { readFileSync } from 'node:fs';

import WebSocket from '../../../frontend/node_modules/ws/index.js';

const args = process.argv.slice(2);
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? `${args[index + 1] ?? ''}`.trim() : '';
};

const manifestPath = option('--manifest');
const actorUserId = option('--actor-user-id');
if (!manifestPath || !actorUserId) {
  fail('Usage: verify-chat-list-read-oracle.mjs --manifest FILE --actor-user-id ID');
}

const prefix = 'manual-qa-checkpoint:v1:chat-list';
const expectedAscendingIds = ['event', 'group', 'service', 'support'].map(suffix => `${prefix}:${suffix}`);
const expectedDescendingIds = [...expectedAscendingIds].reverse();
const expectedByContext = {
  event: `${prefix}:event`,
  subEvent: null,
  group: `${prefix}:group`,
  service: `${prefix}:service`,
  appSupport: `${prefix}:support`
};

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const session = (manifest.sessions ?? []).find(item => `${item.userId ?? ''}`.trim() === actorUserId);
const port = Number(session?.devToolsPort);
if (!Number.isInteger(port) || port <= 0) {
  fail(`No live DevTools session for actor '${actorUserId}' in ${manifestPath}.`);
}

const targetsResponse = await fetch(`http://127.0.0.1:${port}/json/list`);
if (!targetsResponse.ok) fail(`Chrome DevTools target list returned HTTP ${targetsResponse.status}.`);
const targets = await targetsResponse.json();
const target = targets.find(item => item.type === 'page' && /^http:\/\/localhost(?:\/|$)/.test(`${item.url ?? ''}`));
if (!target?.webSocketDebuggerUrl) fail(`No localhost page target found on DevTools port ${port}.`);

const expression = [
  '(async () => {',
  `  const actorUserId = ${JSON.stringify(actorUserId)};`,
  `  const expectedAscendingIds = ${JSON.stringify(expectedAscendingIds)};`,
  `  const expectedDescendingIds = ${JSON.stringify(expectedDescendingIds)};`,
  `  const expectedByContext = ${JSON.stringify(expectedByContext)};`,
  "  const stored = JSON.parse(localStorage.getItem('myscoutee.http.session.v1') || 'null');",
  "  if (stored?.kind !== 'demo' || `${stored?.userId ?? ''}`.trim() !== actorUserId) throw new Error('Unexpected authenticated demo actor.');",
  '  const headers = {',
  "    'X-App-Session-Kind': 'demo',",
  "    'X-Demo-User-Id': actorUserId,",
  "    ...(stored.sessionId ? { 'X-App-Session-Id': `${stored.sessionId}` } : {})",
  '  };',
  '  const query = async params => {',
  "    const search = new URLSearchParams({ userId: actorUserId, limit: '20', ...params });",
  "    const response = await fetch(`/api/activities/chats/page?${search}`, { headers });",
  "    if (!response.ok) throw new Error(`Chat page returned HTTP ${response.status}.`);",
  '    return response.json();',
  '  };',
  "  const descending = await query({ contextFilter: 'all', sort: 'date', sortDirection: 'desc' });",
  "  const ascending = await query({ contextFilter: 'all', sort: 'date', sortDirection: 'asc' });",
  '  const contexts = {};',
  "  for (const key of ['event', 'subEvent', 'group', 'service', 'appSupport']) contexts[key] = await query({ contextFilter: key, sort: 'date', sortDirection: 'desc' });",
  '  const ids = page => (page.items || []).map(item => item.id);',
  '  const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);',
  '  const checks = {',
  '    descendingOrder: descending.total === 4 && same(ids(descending), expectedDescendingIds),',
  '    ascendingOrder: ascending.total === 4 && same(ids(ascending), expectedAscendingIds),',
  '    exactContexts: Object.entries(expectedByContext).every(([key, expectedId]) => {',
  '      const page = contexts[key];',
  '      return expectedId === null ? page.total === 0 && ids(page).length === 0 : page.total === 1 && same(ids(page), [expectedId]);',
  '    }),',
  "    exactUnread: [...(descending.items || [])].every(item => item.unread === 1),",
  "    stableHeaders: [...(descending.items || [])].every(item => item.ownerStatus === 'A' && item.revision === 1)",
  '  };',
  "  if (!Object.values(checks).every(Boolean)) throw new Error(`Chat read oracle mismatch: ${JSON.stringify({ checks, descending: ids(descending), ascending: ids(ascending) })}`);",
  '  return { actor: { kind: stored.kind, userId: stored.userId }, checks, descendingIds: ids(descending), ascendingIds: ids(ascending), contextTotals: Object.fromEntries(Object.entries(contexts).map(([key, page]) => [key, page.total])) };',
  '})()'
].join('\n');

const result = await cdpCommand(target.webSocketDebuggerUrl, 'Runtime.evaluate', {
  expression,
  returnByValue: true,
  awaitPromise: true
});
if (result.exceptionDetails) {
  fail(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text ?? 'Browser read oracle failed.');
}
console.log(JSON.stringify(result.result?.value ?? null, null, 2));

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
  console.error(`verify-chat-list-read-oracle: ${message}`);
  process.exit(2);
}
