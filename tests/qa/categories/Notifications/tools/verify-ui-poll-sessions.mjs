#!/usr/bin/env node
// Startup preflight, then opt-in read-only diagnosis at the guide's stop points.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import WebSocket from '../../../../../myscoutee-frontend/node_modules/ws/index.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const checkpoint = 'UI-POLL-JANK-001';
const mode = process.argv[2];
if (!['preflight', 'baseline', 'observer', 'closed'].includes(mode)) {
  throw new Error('Usage: verify-ui-poll-sessions.mjs preflight|baseline|observer|closed [manifest]');
}
const manifestPath = process.argv[3] || path.join(os.tmpdir(), 'myscoutee-qa-browser-sessions', `${checkpoint}.json`);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.checkpointId !== checkpoint || manifest.sessions.length !== 3) throw new Error('Expected three configured sessions.');
const hash = value => createHash('sha256').update(String(value)).digest('hex');
const serverSnapshot = () => JSON.parse(execFileSync('bash', [
  path.resolve(directory, '../../../../../server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh'),
  'session-status', 'ui-poll', checkpoint
], { encoding: 'utf8', timeout: 20000, maxBuffer: 1024 * 1024 }));
const before = serverSnapshot();
const actors = [];
for (const session of manifest.sessions) {
  const headers = { 'X-App-Session-Kind': 'demo', 'X-Demo-User-Id': session.userId, 'X-App-Session-Id': session.sessionId };
  let ownsProcess = false;
  try { ownsProcess = readFileSync(`/proc/${session.pid}/cmdline`, 'utf8').split('\0').includes(`--user-data-dir=${session.userDataDirectory}`); } catch {}
  const result = { actor: session.actor, userId: session.userId, pid: session.pid,
    profileHash: hash(session.userDataDirectory), ownsProcess, manifestSessionHash: hash(session.sessionId) };
  const response = await fetch(`http://localhost/api/auth/me?userId=${encodeURIComponent(session.userId)}`, { headers, signal: AbortSignal.timeout(10000) });
  const body = await response.json().catch(() => null);
  result.authentication = { status: response.status, identityMatches: body?.id === session.userId };
  if (mode === 'preflight') {
    if (!ownsProcess || response.status !== 200 || !result.authentication.identityMatches) throw new Error(`${session.actor}: startup identity failed.`);
    if (session.actor !== 'Ava') {
      const query = new URLSearchParams({ userId: session.userId, limit: '100', contextFilter: 'group', sort: 'date', sortDirection: 'desc' });
      const list = await fetch(`http://localhost/api/activities/chats/page?${query}`, { headers, signal: AbortSignal.timeout(10000) });
      const page = await list.json();
      const group = (page.items || []).find(item => item.id === 'manual-qa-checkpoint:v1:ui-poll:group');
      const history = await fetch(`http://localhost/api/activities/chats/manual-qa-checkpoint:v1:ui-poll:group/messages?userId=${session.userId}&limit=20`, { headers, signal: AbortSignal.timeout(10000) });
      const messages = await history.json();
      result.chat = { listStatus: list.status, historyStatus: history.status, visible: Boolean(group), historyCount: messages.total };
      if (!group || list.status !== 200 || history.status !== 200 || messages.total !== 18) throw new Error(`${session.actor}: controlled Group Chat preflight failed.`);
    }
  } else if (ownsProcess && session.actor.startsWith('Casey')) {
    const targets = await fetch(`http://127.0.0.1:${session.devToolsPort}/json/list`, { signal: AbortSignal.timeout(5000) }).then(value => value.json());
    result.pageTargetHashes = targets.filter(item => item.type === 'page').map(item => hash(item.id)).sort();
    const browser = await fetch(`http://127.0.0.1:${session.devToolsPort}/json/version`, { signal: AbortSignal.timeout(5000) }).then(value => value.json());
    result.contextHashes = (await command(browser.webSocketDebuggerUrl, 'Target.getBrowserContexts')).browserContextIds.map(hash).sort();
    const target = targets.find(item => item.type === 'page' && /^http:\/\/localhost(?:\/|$)/.test(item.url));
    if (!target) throw new Error(`${session.actor}: existing app target missing.`);
    const expression = `(async () => {
      const raw = localStorage.getItem('myscoutee.http.session.v1');
      const stored = raw ? JSON.parse(raw) : null;
      const headers = { 'X-App-Session-Kind': 'demo', 'X-Demo-User-Id': stored?.userId || '', 'X-App-Session-Id': stored?.sessionId || '' };
      const response = await fetch('/api/auth/me?userId=' + encodeURIComponent(stored?.userId || ''), { headers });
      const body = await response.json().catch(() => null);
      return { localSessionPresent: Boolean(raw), sessionIdPresent: Boolean(stored?.sessionId),
        expectedSessionMatches: stored?.sessionId === ${JSON.stringify(session.sessionId)},
        cookiePresent: Boolean(document.cookie), authenticationStatus: response.status,
        identityMatches: body?.id === ${JSON.stringify(session.userId)} };
    })()`;
    const evaluation = await command(target.webSocketDebuggerUrl, 'Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (evaluation.exceptionDetails) throw new Error(`${session.actor}: carrier observation failed.`);
    result.browser = evaluation.result?.value;
    if (mode === 'observer' && session.actor === 'Casey B') {
      // A separate attachment to the same existing target, without enable/create/navigation commands.
      await command(target.webSocketDebuggerUrl, 'Runtime.evaluate', { expression: '({ existingPage: true })', returnByValue: true });
      const afterTargets = await fetch(`http://127.0.0.1:${session.devToolsPort}/json/list`).then(value => value.json());
      result.afterObserverPageTargetHashes = afterTargets.filter(item => item.type === 'page').map(item => hash(item.id)).sort();
      result.afterObserverContextHashes = (await command(browser.webSocketDebuggerUrl, 'Target.getBrowserContexts')).browserContextIds.map(hash).sort();
    }
  }
  actors.push(result);
}
const after = serverSnapshot();
const casey = actors.filter(item => item.userId === '650000000000000000000061');
const serverCasey = after.actors.find(item => item.userId === '650000000000000000000061');
const checks = {
  twoDistinctCaseyProfiles: casey.length === 2 && new Set(casey.map(item => item.profileHash)).size === 2,
  exactTwoCaseySessions: serverCasey.activeSessionHashes.length === 2 && casey.every(item => serverCasey.activeSessionHashes.includes(item.manifestSessionHash)),
  sessionAndAuditSetsUnchangedDuringObservation: JSON.stringify(before.actors) === JSON.stringify(after.actors)
};
const output = { checkpoint, mode, capturedAt: new Date().toISOString(), before, actors, after, checks };
const evidenceDirectory = path.join(path.dirname(manifestPath), 'evidence');
mkdirSync(evidenceDirectory, { recursive: true, mode: 0o700 });
writeFileSync(path.join(evidenceDirectory, `${checkpoint}-${mode}-snapshot.safe.json`), JSON.stringify(output, null, 2) + '\n', { mode: 0o600 });
console.log(JSON.stringify(output, null, 2));
if (mode === 'preflight' && !Object.values(checks).every(Boolean)) throw new Error('Session preflight failed.');

function command(url, method, params = {}) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    const timer = setTimeout(() => { socket.close(); reject(new Error(`Read-only ${method} timed out.`)); }, 15000);
    socket.on('open', () => socket.send(JSON.stringify({ id: 1, method, params })));
    socket.on('message', bytes => {
      const message = JSON.parse(String(bytes));
      if (message.id !== 1) return;
      clearTimeout(timer); socket.close();
      if (message.error) reject(new Error(`Read-only ${method} failed.`)); else resolve(message.result);
    });
    socket.on('error', () => { clearTimeout(timer); reject(new Error(`Read-only ${method} connection failed.`)); });
  });
}
