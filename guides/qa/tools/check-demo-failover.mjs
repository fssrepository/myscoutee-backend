#!/usr/bin/env node
// Runs the existing watcher's JavaScript output. No Angular build or test compiler.
// node --experimental-vm-modules guides/qa/tools/check-demo-failover.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import vm from 'node:vm';
import path from 'node:path';

const root = path.resolve('server/docker/conf/nginx/app/myscoutee');
const main = readFileSync(path.join(root, 'main.js'), 'utf8');
const entry = /import\s*\{[^}]*prepareDemoFailover[^}]*\}\s*from\s*"([^"]+)"/.exec(main)?.[1];
assert.ok(entry, 'Watcher output must contain the demo failover entry point');
const httpKey = 'myscoutee.http.session.v1';
const localKey = 'myscoutee.demo.session.v1';
const failoverKey = 'myscoutee.demo.failover';
const anna = 'bf057de7c586eede7e84bdc7';

async function fixture({ production = false, session, data = new Map(), reachable = false, status = 200 } = {}) {
  if (session) data.set(httpKey, JSON.stringify(session));
  const state = { calls: 0, reloads: 0, reachable, status, popup: false, interval: null };
  const storage = { getItem: k => data.get(k) ?? null, setItem: (k, v) => data.set(k, String(v)), removeItem: k => data.delete(k) };
  const location = { search: '', hostname: production ? 'app.myscoutee.example' : 'localhost', pathname: '/game', reload: () => state.reloads++ };
  const context = vm.createContext({ console, crypto: webcrypto, TextEncoder, TextDecoder,
    URL, URLSearchParams, AbortSignal, setTimeout, clearTimeout, performance,
    localStorage: storage, location,
    document: { baseURI: 'http://localhost:8080/', visibilityState: 'visible', activeElement: null,
      querySelector: () => state.popup ? {} : null, addEventListener() {} },
    window: { addEventListener() {}, setInterval: callback => { state.interval = callback; } },
    fetch: async () => { state.calls++; if (!state.reachable) throw Error('Disconnected'); return { status: state.status }; }
  });
  const modules = new Map();
  function get(file) {
    if (!modules.has(file)) modules.set(file, new vm.SourceTextModule(readFileSync(file, 'utf8'), { context, identifier: file }));
    return modules.get(file);
  }
  const module = get(path.resolve(root, entry));
  await module.link((specifier, parent) => get(path.resolve(path.dirname(parent.identifier), specifier)));
  await module.evaluate();
  const env = [...modules.values()].find(m => 'environment' in m.namespace).namespace.environment;
  env.production = production;
  await module.namespace.prepareDemoFailover();
  const connectivity = [...modules.values()].find(m => 'backendUnavailable' in m.namespace).namespace;
  return { state, data, env, connectivity, api: module.namespace };
}

for (const options of [
  {},
  { session: { kind: 'firebase', profile: { id: anna } } },
  { session: { kind: 'operator-bootstrap' } },
  { session: { kind: 'demo', userId: anna, supportContext: { kind: 'admin-support' } } },
  { session: { kind: 'demo', userId: '650000000000000000000063' } }
]) {
  const f = await fixture(options);
  assert.equal(f.env.activitiesDataSource, 'http');
  assert.equal(f.state.calls, 0);
}

const denied = await fixture({ session: { kind: 'demo', userId: anna }, reachable: true, status: 401 });
assert.equal(denied.env.activitiesDataSource, 'http', 'Authorization failure must not become a local success');
for (const status of [0, 502, 503, 504, 200, 204, 401, 403, 409, 500]) {
  denied.connectivity.reportBackendStatus(status);
  assert.equal(denied.connectivity.backendUnavailable(), [0, 502, 503, 504].includes(status), 'Connectivity follows transport status, not business success');
}
const live = { kind: 'demo', userId: anna, sessionId: 'opaque-test-session' };
const priorLocal = JSON.stringify({ kind: 'demo', userId: 'u2', sessionId: 'prior-local-session' });
const f = await fixture({ session: live, data: new Map([[localKey, priorLocal]]) });
assert.equal(f.env.activitiesDataSource, 'local');
assert.equal(f.connectivity.backendUnavailable(), true);
assert.equal(f.env.firebaseLoginEnabled, false);
assert.equal(f.env.paymentIntegrationEnabled, false);
assert.equal(JSON.parse(f.data.get(localKey)).userId, 'u1');
assert.equal(f.data.get(httpKey), JSON.stringify(live));

f.api.startDemoFailover();
f.state.reachable = true;
f.state.popup = true;
f.state.interval();
await new Promise(resolve => setTimeout(resolve, 20));
assert.equal(f.state.reloads, 0, 'Open editor must prevent reconnect reload');
assert.equal(f.connectivity.backendUnavailable(), false, 'Online indicator recovers even while the editor is open');
f.state.popup = false;
f.api.trackDemoWrite(true);
f.state.interval();
await new Promise(resolve => setTimeout(resolve, 20));
assert.equal(f.state.reloads, 0, 'In-flight write must prevent reconnect reload');
f.api.trackDemoWrite(false);
f.state.interval();
await new Promise(resolve => setTimeout(resolve, 20));
assert.equal(f.state.reloads, 0, 'Reconnect keeps the local session even at idle');
const httpPage = await fixture({ session: live, reachable: true });
httpPage.api.startDemoFailover();
httpPage.state.reachable = false;
httpPage.api.trackDemoWrite(true);
httpPage.state.interval();
await new Promise(resolve => setTimeout(resolve, 20));
assert.equal(httpPage.state.reloads, 0, 'HTTP write must finish before entering the local demo');
httpPage.api.trackDemoWrite(false);
httpPage.state.interval();
await new Promise(resolve => setTimeout(resolve, 20));
assert.equal(httpPage.state.reloads, 1, 'Idle HTTP demo falls back on outage');
const resumed = await fixture({ data: f.data, reachable: true });
assert.equal(resumed.env.activitiesDataSource, 'http');
assert.equal(resumed.data.get(httpKey), JSON.stringify(live));
assert.equal(resumed.data.get(localKey), priorLocal, 'Restore pre-failover local session');
assert.equal(resumed.data.get(`${failoverKey}.pair`), undefined);
const coldOffline = await fixture({ data: new Map(f.data), reachable: false });
assert.equal(coldOffline.env.activitiesDataSource, 'local', 'Ordinary demo session survives an offline cold start');
const loggedOutData = new Map(coldOffline.data);
loggedOutData.delete(localKey);
const loggedOut = await fixture({ data: loggedOutData });
loggedOut.api.startDemoFailover();
assert.equal(loggedOut.state.interval, null, 'Local logout must not start a reload/relogin loop');
assert.equal(loggedOut.data.get(httpKey), undefined, 'Local logout clears the retained demo login');
const otherIdentity = new Map(coldOffline.data);
const u2 = [...new Uint8Array(await webcrypto.subtle.digest('SHA-1', new TextEncoder().encode('users:u2')))].map(n => n.toString(16).padStart(2, '0')).join('').slice(0, 24);
const switched = await fixture({ data: otherIdentity, session: { kind: 'demo', userId: u2 } });
assert.equal(JSON.parse(switched.data.get(localKey)).userId, 'u2', 'HTTP account switch must not reuse Anna');
const productionDemo = await fixture({ production: true, session: live });
assert.equal(productionDemo.env.activitiesDataSource, 'local', 'Deployed demo uses the same application path without an override');
console.log('PASS: 5 exclusion gates, auth-error handling, mapped fallback, store isolation, editor/write guard, reconnect without reload, cold start, logout and account switch.');
