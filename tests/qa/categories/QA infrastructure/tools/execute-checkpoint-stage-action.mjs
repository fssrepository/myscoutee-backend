#!/usr/bin/env node

import { readFileSync } from 'node:fs';

import WebSocket from '../../../../../myscoutee-frontend/node_modules/ws/index.js';

const args = process.argv.slice(2);
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? `${args[index + 1] ?? ''}`.trim() : '';
};

const manifestPath = option('--manifest');
const actorUserId = option('--actor-user-id');
const sourceId = option('--source-id');
const subEventId = option('--sub-event-id');
const action = option('--action');
const subEventIndex = Number(option('--sub-event-index'));

if (!manifestPath
    || !actorUserId
    || !sourceId
    || !subEventId
    || !action
    || !Number.isInteger(subEventIndex)
    || subEventIndex < 0) {
  fail('Usage: execute-checkpoint-stage-action.mjs --manifest FILE --actor-user-id ID --source-id ID --sub-event-id ID --sub-event-index N --action ACTION');
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const session = (manifest.sessions ?? []).find(item => `${item.userId ?? ''}`.trim() === actorUserId);
const port = Number(session?.devToolsPort);
if (!Number.isInteger(port) || port <= 0) {
  fail(`No live DevTools session for actor '${actorUserId}' in ${manifestPath}.`);
}

const targetsResponse = await fetch(`http://127.0.0.1:${port}/json/list`);
if (!targetsResponse.ok) {
  fail(`Chrome DevTools target list returned HTTP ${targetsResponse.status}.`);
}
const targets = await targetsResponse.json();
const target = targets.find(item => item.type === 'page' && /^http:\/\/localhost(?:\/|$)/.test(`${item.url ?? ''}`));
if (!target?.webSocketDebuggerUrl) {
  fail(`No localhost page target found on DevTools port ${port}.`);
}

const request = {
  userId: actorUserId,
  sourceId,
  slotSourceId: null,
  subEventId,
  subEventIndex,
  action,
  reason: null
};
const expression = [
  '(async () => {',
  `  const expectedUserId = ${JSON.stringify(actorUserId)};`,
  `  const request = ${JSON.stringify(request)};`,
  "  const stored = JSON.parse(localStorage.getItem('myscoutee.http.session.v1') || 'null');",
  "  if (stored?.kind !== 'demo' || `${stored?.userId ?? ''}`.trim() !== expectedUserId) {",
  "    throw new Error('The selected browser is not the expected authenticated demo actor.');",
  '  }',
  '  const headers = {',
  "    'Content-Type': 'application/json',",
  "    'X-App-Session-Kind': 'demo',",
  "    'X-Demo-User-Id': expectedUserId,",
  "    ...(stored.sessionId ? { 'X-App-Session-Id': `${stored.sessionId}` } : {})",
  '  };',
  "  const response = await fetch('/api/activities/events/stage-action', {",
  "    method: 'POST',",
  '    headers,',
  '    body: JSON.stringify(request)',
  '  });',
  '  const text = await response.text();',
  '  let body = null;',
  '  try { body = text ? JSON.parse(text) : null; } catch { body = text; }',
  '  return {',
  '    request,',
  '    response: { status: response.status, ok: response.ok, body },',
  "    authenticatedActor: { kind: stored.kind, userId: stored.userId, hasSessionId: Boolean(stored.sessionId) }",
  '  };',
  '})()'
].join('\n');

const result = await cdpCommand(target.webSocketDebuggerUrl, 'Runtime.evaluate', {
  expression,
  returnByValue: true,
  awaitPromise: true
});
if (result.exceptionDetails) {
  fail(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text ?? 'Browser request failed.');
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
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ id, method, params }));
    });
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
  console.error(`execute-checkpoint-stage-action: ${message}`);
  process.exit(2);
}
