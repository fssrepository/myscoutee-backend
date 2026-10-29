#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import WebSocket from '../../../../../myscoutee-frontend/node_modules/ws/index.js';

const manifestPath = process.argv[process.argv.indexOf('--manifest') + 1];
if (!manifestPath) fail('Usage: verify-chat-actions-oracle.mjs --manifest FILE');

const chatId = 'manual-qa-checkpoint:v1:chat-flow:group';
const raceMessageId = 'manual-qa-checkpoint:v1:chat-flow:history:01';
const caseyId = '650000000000000000000061';
const novaId = '650000000000000000000062';
const rileyId = '650000000000000000000063';
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const actor = userId => {
  const session = (manifest.sessions ?? []).find(item => `${item.userId ?? ''}`.trim() === userId);
  if (!session?.devToolsPort) fail(`No live browser for ${userId}.`);
  return session;
};

await Promise.all([novaId, rileyId].map(userId => sendRead(actor(userId), userId)));
await new Promise(resolve => setTimeout(resolve, 500));

const [casey, nova, riley] = await Promise.all([
  inspect(actor(caseyId), caseyId, false),
  inspect(actor(novaId), novaId, true),
  inspect(actor(rileyId), rileyId, false)
]);

const checks = {
  atomicReadersPersisted: [casey, nova, riley].every(result => same(result.raceReaders, [novaId, rileyId])),
  tombstoneReadersRemainCleared: [casey, nova, riley].every(result => result.tombstoneReaders.length === 0),
  novaEditForbidden: nova.editStatus === 403,
  novaUnsendForbidden: nova.deleteStatus === 403,
  sameTombstoneAfterDenials: nova.tombstoneId && [casey, riley].every(result => result.tombstoneId === nova.tombstoneId)
};
if (!Object.values(checks).every(Boolean)) fail(`CHAT-ACTIONS-001 oracle mismatch: ${JSON.stringify({ checks, casey, nova, riley })}`);
console.log(JSON.stringify({ checkpoint: 'CHAT-ACTIONS-001', checks, actors: { casey, nova, riley } }, null, 2));

async function sendRead(session, userId) {
  const url = `ws://localhost/api/activities/chats/ws?chatId=${encodeURIComponent(chatId)}&userId=${userId}&sessionKind=demo`;
  await new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    const timeout = setTimeout(() => { socket.close(); reject(new Error(`Read socket timed out for ${userId}.`)); }, 5000);
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ type: 'read', messageIds: [raceMessageId] }));
      setTimeout(() => { clearTimeout(timeout); socket.close(); resolve(); }, 250);
    });
    socket.addEventListener('error', () => { clearTimeout(timeout); reject(new Error(`Read socket failed for ${userId}.`)); }, { once: true });
  });
}

async function inspect(session, userId, testDenials) {
  const response = await fetch(`http://127.0.0.1:${session.devToolsPort}/json/list`);
  const targets = await response.json();
  const target = targets.find(item => item.type === 'page' && /^http:\/\/localhost(?:\/|$)/.test(`${item.url ?? ''}`));
  if (!target?.webSocketDebuggerUrl) fail(`No localhost target for ${userId}.`);
  const expression = `(${browserInspect.toString()})(${JSON.stringify({ userId, chatId, raceMessageId, testDenials })})`;
  const evaluated = await cdp(target.webSocketDebuggerUrl, 'Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (evaluated.exceptionDetails) fail(evaluated.exceptionDetails.exception?.description ?? evaluated.exceptionDetails.text);
  return evaluated.result?.value;
}

async function browserInspect({ userId, chatId, raceMessageId, testDenials }) {
  const stored = JSON.parse(localStorage.getItem('myscoutee.http.session.v1') || 'null');
  if (stored?.kind !== 'demo' || `${stored?.userId ?? ''}` !== userId) throw new Error('Unexpected demo actor.');
  const headers = {
    'X-App-Session-Kind': 'demo',
    'X-Demo-User-Id': userId,
    ...(stored.sessionId ? { 'X-App-Session-Id': `${stored.sessionId}` } : {})
  };
  const page = async cursor => {
    const query = new URLSearchParams({ userId, limit: '15', ...(cursor ? { cursor } : {}) });
    const response = await fetch(`/api/activities/chats/${encodeURIComponent(chatId)}/messages?${query}`, { headers });
    if (!response.ok) throw new Error(`Messages returned HTTP ${response.status}.`);
    return response.json();
  };
  const first = await page(null);
  const second = first.nextCursor ? await page(first.nextCursor) : { items: [] };
  const messages = [...(first.items ?? []), ...(second.items ?? [])];
  const race = messages.find(message => message.id === raceMessageId);
  const tombstones = messages.filter(message => message.deletedAtIso);
  if (!race || tombstones.length !== 1) throw new Error('Expected race message or unique tombstone is missing.');
  let editStatus = null;
  let deleteStatus = null;
  if (testDenials) {
    const mutationHeaders = { ...headers, 'Content-Type': 'application/json' };
    editStatus = (await fetch(`/api/activities/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(tombstones[0].id)}/edit?userId=${userId}`, {
      method: 'POST', headers: mutationHeaders, body: JSON.stringify({ text: 'FORBIDDEN NOVA EDIT' })
    })).status;
    deleteStatus = (await fetch(`/api/activities/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(tombstones[0].id)}/delete?userId=${userId}`, {
      method: 'POST', headers: mutationHeaders
    })).status;
  }
  return {
    userId,
    raceReaders: (race.readBy ?? []).map(reader => `${reader.id ?? ''}`).sort(),
    tombstoneId: tombstones[0].id,
    tombstoneReaders: (tombstones[0].readBy ?? []).map(reader => `${reader.id ?? ''}`).sort(),
    editStatus,
    deleteStatus
  };
}

function cdp(url, method, params) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    socket.addEventListener('open', () => socket.send(JSON.stringify({ id: 1, method, params })));
    socket.addEventListener('message', event => {
      const message = JSON.parse(String(event.data));
      if (message.id !== 1) return;
      socket.close();
      message.error ? reject(new Error(message.error.message)) : resolve(message.result);
    });
    socket.addEventListener('error', () => reject(new Error('CDP connection failed.')), { once: true });
  });
}

function fail(message) { console.error(`verify-chat-actions-oracle: ${message}`); process.exit(2); }
