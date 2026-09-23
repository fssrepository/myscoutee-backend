#!/usr/bin/env node
// Transfer the freshly revealed disposable key directly between managed UIs.
// Keys and control tokens stay in memory; only aggregate assertions are printed.
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

async function attach(checkpoint, actor = 0) {
  const manifest = JSON.parse(await readFile(`/tmp/myscoutee-qa-browser-sessions/${checkpoint}.json`, 'utf8'));
  const session = manifest.sessions[actor];
  const targets = await fetch(`http://127.0.0.1:${session.devToolsPort}/json/list`).then(r => r.json());
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  let serial = 0;
  const pending = new Map();
  ws.addEventListener('message', event => {
    const message = JSON.parse(event.data), task = pending.get(message.id);
    if (!task) return;
    pending.delete(message.id);
    if (message.error || message.result?.exceptionDetails) task.reject(Error('Managed browser action failed'));
    else task.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++serial; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params }));
  });
  return { session, send, close: () => ws.close(), evaluate: async expression =>
    (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value };
}

const application = await attach('ADMIN-CLIENT-API-001');
const monitor = await attach('ADMIN-CLIENT-MONITOR-001');
try {
  const key = await application.evaluate("document.querySelector('.integration-token-secret code')?.textContent.trim()");
  assert.ok(key && key.length > 20, 'Freshly revealed test key required');
  await monitor.send('Page.bringToFront');
  await monitor.evaluate(`(() => {
    if (document.querySelector('#connect').disabled) return;
    document.querySelector('#url').value='http://localhost/api/admin-client/v1';
    document.querySelector('#key').value=${JSON.stringify(key)};
    document.querySelector('#demo').checked=true;
    document.querySelector('#interval').value='10';
    document.querySelector('#connect').click();
  })()`);
  const started = Date.now();
  let state;
  while (Date.now() - started < 20000) {
    state = await monitor.evaluate("({status:document.querySelector('#status').textContent,error:document.querySelector('#error').textContent,keyEmpty:document.querySelector('#key').value==='',active:document.querySelector('#active').textContent})");
    if (state.status === 'Connected') break;
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  assert.equal(state.status, 'Connected');
  assert.equal(state.keyEmpty, true);
  const preview = await monitor.evaluate("document.querySelector('#key').placeholder");
  assert.equal(preview, key.slice(0, 12) + '…');
  const qaRoot = process.env.ADMIN_CLIENT_QA_ROOT || '/tmp/myscoutee-admin-client-qa-20260923';
  const preferences = JSON.parse(await readFile(`${qaRoot}/config/myscoutee-admin/preferences.json`, 'utf8'));
  assert.ok(!JSON.stringify(preferences).includes(key));
  const headers = { Authorization: 'Bearer ' + key, 'X-MyScoutee-Client-Id': preferences.clientId, 'X-App-Session-Kind': 'demo' };
  const response = await fetch('http://localhost/api/admin-client/v1/overview', { headers });
  assert.equal(response.status, 200);
  const overview = await response.json();
  assert.deepEqual(Object.keys(overview).sort(), ['attention', 'statistics']);
  assert.equal(typeof overview.statistics.generatedAtIso, 'string');
  const wrongClient = await fetch('http://localhost/api/admin-client/v1/overview', { headers: { ...headers, 'X-MyScoutee-Client-Id': 'fbefb315-457a-4b77-8e43-bf573f327552' } });
  assert.ok([401, 403].includes(wrongClient.status));
  console.log(JSON.stringify({ connectedViaVisibleUI: true, passwordCleared: true, maskedPreviewMatches: true, keyAbsentFromPreferences: true,
    wrongClientStatus: wrongClient.status, overview }));
} finally {
  application.close();
  monitor.close();
}
