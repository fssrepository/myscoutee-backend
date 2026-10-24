// Helpers recovered from the delegated MSC-116 run. See INTEGRATION-ACCESS-TOOLS.md.
// All mutations use real application endpoints; faults are explicitly scoped transport faults.
import assert from 'node:assert/strict';
import {randomBytes, createHash} from 'node:crypto';
import {createMcpHttp} from './mcp-qa-client.mjs';

// Private snapshot for the existing disposable local-mode browser. This only
// retains/restores prerequisites; all feedback answers must use the real UI.
export async function localFeedbackFixture(page, snapshot) {
  const origin = new URL(page.url()).origin;
  const fixtureUrl = origin + '/__msc116_feedback_restore__';
  const quietPage = route => route.fulfill({contentType: 'text/html', body: '<title>Restoring local QA fixture</title>'});
  let network;
  try {
  if (snapshot) {
    assert.ok(['http://localhost', 'http://127.0.0.1'].includes(origin), 'Disposable local origin required');
    // Stop application writers before restoring IndexedDB; retain this window
    // and origin, without another browser or server.
    network = await page.context().newCDPSession(page);
    await network.send('Network.enable');
    await network.send('Network.setBypassServiceWorker', {bypass: true});
    await page.route(fixtureUrl, quietPage);
    await page.goto(fixtureUrl);
    assert.equal(await page.title(), 'Restoring local QA fixture', 'Application writers must be stopped before restore');
  }
  return await page.evaluate(async retained => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('myscoutee_demo_db');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const keys = ['users', 'serviceCases', 'feedbackEvaluations', 'feedbackStates', 'notifications'];
    try {
      if (retained) {
        if (Object.keys(retained).sort().join() !== [...keys].sort().join()) throw Error('Wrong local feedback boundary');
        await new Promise((resolve, reject) => {
          const transaction = db.transaction('tables', 'readwrite');
          for (const key of keys) {
            if (retained[key] === null) transaction.objectStore('tables').delete(key);
            else transaction.objectStore('tables').put(retained[key], key);
          }
          transaction.oncomplete = resolve;
          transaction.onerror = () => reject(transaction.error);
        });
        return { restored: keys };
      }
      const result = {};
      for (const key of keys) result[key] = await new Promise((resolve, reject) => {
        const request = db.transaction('tables').objectStore('tables').get(key);
        request.onsuccess = () => resolve(request.result ?? null);
        request.onerror = () => reject(request.error);
      });
      // The shared schema initializes empty Feedback tables in memory; the
      // normal persistence policy omits empty table entries. Retain their absence so cleanup restores the exact baseline.
      if (['users', 'serviceCases', 'notifications'].some(key => !result[key])) throw Error('Local demo baseline is not ready');
      return result;
    } finally { db.close(); }
  }, snapshot ?? null); }
  finally {
    if (snapshot) {
      await page.unroute(fixtureUrl, quietPage);
      if (network) {
        await network.send('Network.setBypassServiceWorker', {bypass: false});
        await network.detach();
      }
      await page.goto(origin + '/entry');
    }
  }
}

export async function openUserMenu(page) {
  if (!await page.locator('.user-menu-panel.open').count())
    await page.getByRole('button', {name: 'Open user menu', exact: true}).click();
  await page.locator('.user-menu-panel.open').waitFor({state: 'visible'});
}

// Read-only oracle for MSC-116's isolated first-visit introduction.
export async function guideIntroductionSnapshot(page) {
  return page.evaluate(() => {
    const overlay = document.querySelector('.explanation-guide-overlay');
    const card = overlay?.querySelector('section');
    const body = card?.querySelector('.explanation-guide-overlay__body') ?? card?.querySelector('p');
    const focus = overlay?.querySelector('.explanation-guide-overlay__focus');
    const rect = element => {
      const r = element?.getBoundingClientRect();
      return r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null;
    };
    const box = rect(card);
    return {
      title: overlay?.querySelector('h3')?.textContent?.trim() ?? null,
      text: body?.textContent?.trim() ?? null,
      progress: overlay?.querySelector('.explanation-guide-overlay__progress')?.textContent?.trim() ?? null,
      lines: body ? Math.round(body.scrollHeight / parseFloat(getComputedStyle(body).lineHeight)) : 0,
      card: box, focus: rect(focus),
      fits: Boolean(box && box.x >= 0 && box.y >= 0 && box.x + box.width <= innerWidth + 1 && box.y + box.height <= innerHeight + 1),
      viewport: { width: innerWidth, height: innerHeight },
      consent: localStorage.getItem('myscoutee.http.entry.gdpr-consent.v1'),
      consentAudit: localStorage.getItem('myscoutee.http.entry.gdpr-consent-audit.v1'),
      introductionSeen: localStorage.getItem('myscoutee.http.explanation-guide.introduction-seen.v1')
    };
  });
}

export function integrationApi({page, browserHeaders, origin = 'http://localhost', settingsPath = '/integrations/settings'}) {
  const browser = (path, options = {}) => page.request.fetch(origin + '/api' + path, {
    ...options, headers: {...browserHeaders, ...options.headers}});
  const privateRequest = (token, path, options = {}) => page.request.fetch(origin + '/api/integrations/v1' + path, {
    ...options, headers: {Authorization: 'Bearer ' + token, ...options.headers}});
  const settings = async () => {
    const response = await browser(settingsPath);
    assert.equal(response.status(), 200, 'Settings load failed');
    return response.json();
  };
  const save = async (main, changes = {}) => {
    const current = await settings();
    const tokens = [...current.tokens, ...current.mcp.clients.map(c => c.token)];
    for (const id of Object.keys(changes)) assert.ok(tokens.some(t => t.id === id), 'Credential belongs to another active profile');
    const response = await browser(settingsPath, {method: 'PUT', data: {
      accessRevision: current.accessRevision, mcpAccess: main ?? current.mcp.accessMode,
      clients: tokens.map(t => ({id: t.id, accessMode: changes[t.id] ?? t.accessMode}))}});
    assert.equal(response.status(), 200, 'Revision-checked settings save failed');
    return response.json();
  };
  return {browser, privateRequest, settings, save};
}

// Read-only packaging/performance sample. Reuse an already authorized real
// OAuth client; this neither creates credentials nor alters subscriptions.
export async function measureMcpEventsCatalog(client, {warmup = 3, samples = 20} = {}) {
  assert.ok(Number.isInteger(warmup) && warmup >= 0 && warmup <= 10);
  assert.ok(Number.isInteger(samples) && samples > 0 && samples <= 100);
  const durations = [];
  let catalog;
  for (let index = 0; index < warmup + samples; index++) {
    const started = performance.now();
    const response = await client('events/list', {});
    const elapsed = performance.now() - started;
    assert.equal(response.status, 200, 'Events catalog HTTP status');
    assert.ok(response.data?.result && !response.data.error, 'Events catalog RPC result');
    const names = response.data.result.events.map(event => event.name).sort();
    assert.ok(names.length, 'Authorized Events catalog must not be empty');
    if (catalog) assert.deepEqual(names, catalog, 'Events catalog changed during the sample');
    else catalog = names;
    if (index >= warmup) durations.push(elapsed);
  }
  const sorted = [...durations].sort((a, b) => a - b);
  return {method: 'events/list', concurrency: 1, warmup, samples,
    requestCount: warmup + samples, errors: 0, catalog,
    meanMs: durations.reduce((sum, value) => sum + value, 0) / samples,
    medianMs: sorted[Math.ceil(samples * 0.5) - 1],
    p95Ms: sorted[Math.ceil(samples * 0.95) - 1], maxMs: sorted.at(-1)};
}

export async function authorizeUi({page, clientId, clientSecret, origin = 'http://localhost',
  redirectUri = 'http://127.0.0.1:6274/oauth/callback'}) {
  const verifier = randomBytes(48).toString('base64url'), state = randomBytes(18).toString('base64url');
  const resource = origin + '/mcp/private';
  const query = new URLSearchParams({client_id: clientId, redirect_uri: redirectUri, resource,
    scope: 'myscoutee:api', response_type: 'code', code_challenge_method: 'S256', state,
    code_challenge: createHash('sha256').update(verifier).digest('base64url')});
  await page.goto(origin + '/mcp/authorize?' + query);
  await page.getByRole('button', {name: 'Allow access', exact: true}).waitFor();
  const consentText = await page.getByRole('dialog').innerText();
  await page.getByRole('button', {name: 'Allow access', exact: true}).click();
  await page.waitForURL(url => url.origin + url.pathname === redirectUri);
  // Read the actual navigation. A separate REPL cell's mutable callback variable is not reliable.
  const callback = new URL(page.url());
  assert.equal(callback.searchParams.get('state'), state, 'OAuth state mismatch');
  assert.equal(callback.searchParams.get('iss'), origin, 'OAuth issuer mismatch');
  assert.ok(callback.searchParams.get('code'), 'OAuth authorization code missing');
  const exchange = {grant_type: 'authorization_code', client_id: clientId,
    code: callback.searchParams.get('code'), code_verifier: verifier, redirect_uri: redirectUri, resource,
    ...(clientSecret ? {client_secret: clientSecret} : {})};
  const response = await page.request.post(origin + '/api/mcp/oauth/token', {form: exchange});
  assert.equal(response.status(), 200, 'OAuth code exchange failed');
  const tokens = await response.json();
  await page.goto(origin + '/game');
  return {tokens, exchange, consentText}; // Sensitive result: memory/private temp files only.
}

export async function manualAccessMatrix({page, browserHeaders, manual, apiKey, origin = 'http://localhost'}) {
  const api = integrationApi({page, browserHeaders, origin});
  const initial = await api.settings();
  const original = Object.fromEntries([...initial.tokens, ...initial.mcp.clients.map(c => c.token)].map(t => [t.id, t.accessMode]));
  assert.ok(manual.tokenId in original && apiKey.tokenId in original, 'Select the issuing profile first');
  const rpc = createMcpHttp({request: page.request, origin, token: manual.accessToken});
  const packs = ['blocked', 'write', 'read', 'full'], rows = [];
  try {
    for (const main of packs) for (const client of packs) {
      await api.save(main, {[manual.tokenId]: client, [apiKey.tokenId]: 'read'});
      const expected = packs[Math.min(packs.indexOf(main), packs.indexOf(client))];
      const connection = await api.privateRequest(manual.accessToken, '/connect', {method: 'POST', data: {}});
      const body = connection.status() === 200 ? await connection.json() : {};
      const discovery = await rpc('tools/list');
      const tools = discovery.data?.result?.tools?.map(t => t.name) ?? [];
      const read = await api.privateRequest(manual.accessToken, '/events?limit=1');
      const control = await api.privateRequest(apiKey.value, '/connect', {method: 'POST', data: {},
        headers: {'X-MyScoutee-Client-Id': apiKey.clientId}});
      const controlBody = control.status() === 200 ? await control.json() : {};
      const allowed = expected === 'blocked'
        ? connection.status() === 401 && discovery.status === 401 && read.status() === 401
        : body.accessMode === expected && discovery.status === 200 && tools.includes('createEvents')
          && read.status() === (expected === 'write' ? 403 : 200);
      rows.push({main, client, effective: body.accessMode ?? 'denied', connect: connection.status(),
        discovery: discovery.status, toolCount: tools.length, read: read.status(),
        apiIndependent: controlBody.accessMode, pass: allowed && control.status() === 200 && controlBody.accessMode === 'read'});
    }
  } finally {
    await api.save(initial.mcp.accessMode, {[manual.tokenId]: original[manual.tokenId], [apiKey.tokenId]: original[apiKey.tokenId]});
  }
  return rows; // Secret-free assertion evidence, not raw responses.
}

// Uses a separate real grant: refresh replay intentionally revokes that grant.
export async function oauthProtocolChecks({page, browserHeaders, clientId, profileId,
  origin = 'http://localhost', redirectUri = 'http://127.0.0.1:6274/oauth/callback'}) {
  const api = integrationApi({page, browserHeaders, origin});
  const verifier = randomBytes(48).toString('base64url');
  const resource = origin + '/mcp/private', rows = [];
  const authorization = {clientId, redirectUri, resource, scope: 'myscoutee:api', responseType: 'code',
    codeChallenge: createHash('sha256').update(verifier).digest('base64url'), codeChallengeMethod: 'S256',
    state: randomBytes(18).toString('base64url')};
  const check = async (name, response, expected) => {
    const status = response.status(); rows.push({name, status, pass: status === expected});
    assert.equal(status, expected, name);
    return response;
  };
  const exchange = form => page.request.post(origin + '/api/mcp/oauth/token', {
    form: {client_id: clientId, resource, ...form}});
  for (const [name, change] of [
    ['wrong-redirect', {redirectUri: 'https://example.invalid/callback'}],
    ['wrong-resource', {resource: origin + '/wrong-resource'}],
    ['wrong-scope', {scope: 'unsupported'}],
    ['plain-PKCE', {codeChallengeMethod: 'plain'}],
    ['unknown-client', {clientId: 'mcp_nonexistent'}]
  ]) await check(name, await api.browser('/integrations/mcp/authorization', {method: 'POST',
    data: {...authorization, ...change}}), 400);
  const code = async () => {
    const response = await api.browser('/integrations/mcp/consent', {method: 'POST',
      data: {authorization, approve: true, profileId}});
    assert.equal(response.status(), 200, 'Protocol-test consent failed');
    return new URL((await response.json()).url).searchParams.get('code');
  };
  const values = {grant_type: 'authorization_code', code: await code(), redirect_uri: redirectUri, code_verifier: verifier};
  await check('wrong-verifier', await exchange({...values, code_verifier: 'A'.repeat(64)}), 400);
  await check('wrong-token-resource', await exchange({...values, resource: origin + '/wrong-resource'}), 400);
  const grant = await (await check('code-exchange', await exchange(values), 200)).json();
  await check('code-reuse', await exchange(values), 400);
  const rotated = await (await check('refresh-rotation', await exchange({grant_type: 'refresh_token', refresh_token: grant.refresh_token}), 200)).json();
  await check('rotated-access', await api.privateRequest(rotated.access_token, '/connect', {method: 'POST', data: {}}), 200);
  await check('refresh-replay', await exchange({grant_type: 'refresh_token', refresh_token: grant.refresh_token}), 400);
  await check('replay-revoked-access', await api.privateRequest(rotated.access_token, '/connect', {method: 'POST', data: {}}), 401);
  await check('replay-revoked-refresh', await exchange({grant_type: 'refresh_token', refresh_token: rotated.refresh_token}), 400);
  // Retain one unconsumed real code privately for a natural five-minute expiry check.
  const expiryExchange = {...values, code: await code()};
  const createdAt = Date.now(), expiresAfter = createdAt + 301000;
  return {rows, expiry: {createdAt, expiresAfter, check: async () => {
    assert.ok(Date.now() >= expiresAfter, 'Wait for the real authorization code lifetime');
    return check('expired-code', await exchange(expiryExchange), 400);
  }}};
}

export async function setBrowserLocale(page, locale, existingSession) {
  assert.ok(['en-US', 'hu-HU'].includes(locale));
  const session = existingSession ?? await page.context().newCDPSession(page);
  const userAgent = await page.evaluate(() => navigator.userAgent);
  await session.send('Emulation.setLocaleOverride', {locale});
  // CDP expects a language list, not a weighted HTTP Accept-Language header.
  await session.send('Emulation.setUserAgentOverride', {userAgent, acceptLanguage: locale + ',' + locale.slice(0, 2)});
  await page.reload();
  return session;
}

export async function withFailedSettingsSave(page, action) {
  const pattern = '**/api/integrations/settings';
  const handler = route => route.request().method() === 'PUT' ? route.abort('failed') : route.continue();
  await page.route(pattern, handler);
  try { return await action(); } finally { await page.unroute(pattern, handler); }
}

export async function holdSettingsResponse(page) {
  return holdGetResponse(page, '**/api/integrations/settings');
}

export async function holdGuideIntroductionResponse(page) {
  return holdGetResponse(page, '**/api/landing/explanation?*', request =>
    new URL(request.url()).searchParams.get('contextKey') === 'landing.guide');
}

async function holdGetResponse(page, pattern, matches = () => true) {
  let release, observed;
  const gate = new Promise(resolve => { release = resolve; });
  const started = new Promise(resolve => { observed = resolve; });
  const inFlight = new Set();
  const handler = route => {
    if (route.request().method() !== 'GET' || !matches(route.request())) return route.continue();
    const task = (async () => {
      const response = await route.fetch();
      observed(); await gate;
      await route.fulfill({response}); // Actual upstream payload, unchanged.
    })();
    inFlight.add(task);
    task.finally(() => inFlight.delete(task)).catch(() => {});
    return task;
  };
  await page.route(pattern, handler);
  return {started, release, close: async () => {
    release();
    await Promise.allSettled([...inFlight]);
    await page.unroute(pattern, handler);
  }};
}

// Read-only frame sampling distinguishes real loading from focus positioning.
// Records only state changes and numeric guide progress, never page content.
export async function observeGuideFrames(page, action) {
  const key = '__msc116GuideFrames';
  await page.evaluate(key => {
    if (window[key]) throw Error('Guide frame observer already active');
    const state = { rows: [], frame: 0, previous: '', start: performance.now() };
    window[key] = state;
    const visible = selector => [...document.querySelectorAll(selector)].some(element => {
      const style = getComputedStyle(element);
      return element.getClientRects().length && style.visibility !== 'hidden' && style.display !== 'none';
    });
    const sample = () => {
      const row = {
        ring: visible('.explanation-guide-loading'),
        card: visible('.explanation-guide-overlay__card'),
        focus: visible('.explanation-guide-overlay__focus'),
        progress: document.querySelector('.explanation-guide-overlay__progress')?.textContent.trim() ?? null
      };
      const signature = JSON.stringify(row);
      if (signature !== state.previous && state.rows.length < 1000) {
        state.rows.push({ ms: Math.round(performance.now() - state.start), ...row });
        state.previous = signature;
      }
      state.frame = requestAnimationFrame(sample);
    };
    sample();
  }, key);
  let rows;
  try { await action(); }
  finally {
    rows = await page.evaluate(key => {
      const state = window[key];
      cancelAnimationFrame(state.frame);
      delete window[key];
      return state.rows;
    }, key);
  }
  return rows;
}

export async function walkGuide(page, label, { stepDelayMs = 0 } = {}) {
  const overlay = page.locator('.explanation-guide-overlay'), steps = [];
  for (let i = 0; i < 60; i++) {
    await overlay.locator('.explanation-guide-overlay__card').waitFor({state: 'visible'});
    const row = await overlay.evaluate(element => {
      const c = element.querySelector('.explanation-guide-overlay__card').getBoundingClientRect();
      const f = element.querySelector('.explanation-guide-overlay__focus')?.getBoundingClientRect();
      return {progress: element.querySelector('.explanation-guide-overlay__progress')?.textContent.trim(),
        title: element.querySelector('h3')?.textContent.trim(),
        cardFits: c.x >= 0 && c.y >= 0 && c.right <= innerWidth + 1 && c.bottom <= innerHeight + 1,
        focusVisible: !!f && f.width > 0 && f.height > 0, viewport: [innerWidth, innerHeight]};
    });
    steps.push(row);
    if (stepDelayMs > 0) await page.waitForTimeout(stepDelayMs);
    const next = overlay.getByRole('button', {name: /^(Next|Tovább)$/});
    if (await next.count()) {
      await next.click();
      await page.waitForFunction(old => document.querySelector('.explanation-guide-overlay__progress')?.textContent.trim() !== old, row.progress);
    } else {
      await overlay.getByRole('button', {name: /^(Done|Kész|Befejezés)$/}).click();
      await overlay.waitFor({state: 'hidden'});
      return {label, steps};
    }
  }
  throw Error('Guide did not finish within 60 steps');
}

export async function integrationGuideSet(page, label, skipParent = false) {
  const parent = page.getByRole('dialog', {name: /^(Open affiliate settings|Affiliate beállítások megnyitása|API)$/});
  const selector = page.locator('section.ui-popup__panel').filter({has: page.getByRole('slider')}).last();
  const results = [];
  const tour = async suffix => {
    await page.locator('.explanation-guide-menu').getByRole('button').click();
    results.push(await walkGuide(page, label + ' ' + suffix));
  };
  if (!skipParent) await tour('parent');
  await parent.locator('[data-guide-field="mcp-main-access"]').getByRole('button').click();
  const slider = selector.getByRole('slider');
  await slider.press(await slider.inputValue() === '4' ? 'ArrowLeft' : 'ArrowRight');
  await selector.getByRole('button').filter({hasText: /^check$/}).waitFor({state: 'visible'});
  await tour('selector');
  await selector.getByRole('button', {name: /^(Close|Bezárás)$/}).click();
  await parent.getByRole('button', {name: /^(Open API documentation help|API-dokumentációs súgó megnyitása)$/}).click();
  await page.locator('[data-guide-field="integration-help-setup"]').waitFor({state: 'visible'});
  await tour('help');
  await page.getByRole('dialog', {name: /^(Open API documentation help|API-dokumentációs súgó megnyitása)$/})
    .getByRole('button', {name: /^(Close|Bezárás)$/}).click();
  return results;
}
