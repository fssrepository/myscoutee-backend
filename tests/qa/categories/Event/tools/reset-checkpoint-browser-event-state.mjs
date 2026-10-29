#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import WebSocket from '../../../../../myscoutee-frontend/node_modules/ws/index.js';

const [, , checkpointId = '', actor = '', sourceId = ''] = process.argv;
if (!checkpointId.trim() || !actor.trim() || !sourceId.trim()) {
  fail('Usage: reset-checkpoint-browser-event-state.mjs CHECKPOINT_ID ACTOR SOURCE_ID');
}

const manifestPath = path.join(
  os.tmpdir(),
  'myscoutee-qa-browser-sessions',
  `${checkpointId.replace(/[^A-Za-z0-9_.-]+/g, '-')}.json`
);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const session = (manifest.sessions ?? []).find(candidate =>
  `${candidate.actor ?? ''}`.trim().toLowerCase() === actor.trim().toLowerCase()
);
if (!session?.devToolsPort) {
  fail(`No active ${actor} browser session exists for ${checkpointId}.`);
}

const targets = await jsonRequest(`http://127.0.0.1:${session.devToolsPort}/json/list`);
const page = targets.find(target =>
  target.type === 'page'
  && target.webSocketDebuggerUrl
  && /^https?:\/\/(localhost|127\.0\.0\.1)(?::[0-9]+)?\//.test(`${target.url ?? ''}`)
);
if (!page) {
  fail(`No MyScoutee page is open for ${actor}.`);
}

const storageKey = 'myscoutee.http.event.checkout.drafts.v1';
const result = await evaluate(page.webSocketDebuggerUrl, `(() => {
  const storageKey = ${JSON.stringify(storageKey)};
  const sourceId = ${JSON.stringify(sourceId.trim())};
  const raw = localStorage.getItem(storageKey);
  const drafts = raw ? JSON.parse(raw) : {};
  const removedKeys = Object.keys(drafts).filter(key =>
    key.endsWith('::' + sourceId) || drafts[key]?.sourceId === sourceId
  );
  for (const key of removedKeys) delete drafts[key];
  if (Object.keys(drafts).length > 0) {
    localStorage.setItem(storageKey, JSON.stringify(drafts));
  } else {
    localStorage.removeItem(storageKey);
  }
  return { removedKeys, pathname: location.pathname };
})()`);

await command(page.webSocketDebuggerUrl, 'Page.reload', { ignoreCache: false });
process.stdout.write(`${JSON.stringify({
  checkpointId,
  actor: session.actor,
  userId: session.userId,
  sourceId,
  removedDraftKeys: result?.removedKeys ?? [],
  reloaded: true
})}\n`);

async function evaluate(webSocketUrl, expression) {
  const response = await command(webSocketUrl, 'Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  return response.result?.result?.value;
}

async function command(webSocketUrl, method, params = {}) {
  return await new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketUrl);
    const timeout = setTimeout(() => {
      socket.close();
      reject(new Error(`${method} timed out.`));
    }, 5000);
    socket.on('open', () => socket.send(JSON.stringify({ id: 1, method, params })));
    socket.on('message', data => {
      const message = JSON.parse(String(data));
      if (message.id !== 1) return;
      clearTimeout(timeout);
      socket.close();
      if (message.error || message.result?.exceptionDetails) {
        reject(new Error(message.error?.message || `${method} failed.`));
        return;
      }
      resolve(message);
    });
    socket.on('error', error => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

async function jsonRequest(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}.`);
  return await response.json();
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
