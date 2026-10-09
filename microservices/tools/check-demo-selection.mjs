#!/usr/bin/env node
// Diagnose the explicitly delegated frontend-local selection flow using only
// a browser prepared by the repository's managed launcher.
import { createRequire } from 'node:module';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(path.join(root, 'frontend/package.json'));
const { chromium } = require('playwright');
const manifest = JSON.parse(await readFile('/tmp/myscoutee-qa-browser-sessions/MSC120-LOCAL-SELECTION.json', 'utf8'));
if (manifest.checkpointId !== 'MSC120-LOCAL-SELECTION' || manifest.sessions.length !== 1) throw new Error('Wrong checkpoint');
const label = process.argv.includes('--verify') ? 'verified' : 'baseline';
const browser = await chromium.connectOverCDP(`http://127.0.0.1:${manifest.sessions[0].devToolsPort}`);
const page = browser.contexts()[0].pages()[0];
const output = path.join(root, 'microservices/build/reports/browser');
await mkdir(output, { recursive: true });
const report = { label, startedAt: new Date().toISOString(), passed: false };
const responses = [];
page.on('response', response => {
  const url = new URL(response.url());
  if (url.origin === 'http://localhost:18080' && url.pathname.startsWith('/api/'))
    responses.push({ path: url.pathname, status: response.status() });
});
async function optionalButton(name, timeout = 1500) {
  const button = page.getByRole('button', { name, exact: true });
  try { await button.waitFor({ state: 'visible', timeout }); } catch { return; }
  await button.click();
}
try {
  if (!page.url().startsWith('http://localhost:18080/entry')) throw new Error('Launch anonymous entry first');
  if (JSON.parse(await page.locator('#myscoutee-runtime-status').textContent()).ready !== false)
    throw new Error('This check requires frontend running with backends stopped');
  await optionalButton('Done', 15000);
  await optionalButton('Accept and continue');
  await page.getByRole('button', { name: 'Start exploring', exact: true }).click();
  const actor = page.getByText('Alex Turner', { exact: true });
  await actor.waitFor({ state: 'visible', timeout: 120000 });
  await page.evaluate(() => {
    const started = performance.now();
    const states = [], longTasks = [];
    const ringIds = new WeakMap();
    let nextRingId = 0;
    let previous = '';
    const sample = () => {
      const selector = document.querySelector('app-demo-bootstrap-selector');
      const selected = selector?.querySelector('.demo-user-item-selected');
      const state = {
        path: location.pathname,
        popup: !!selector?.querySelector('.demo-user-stage'),
        preparing: !!selector?.querySelector('.demo-user-grid-loading'),
        selectedDisabled: !!selected?.disabled,
        selectedRing: !!selected?.querySelector('app-indicator'),
        avatarRing: !!document.querySelector('.app-menu__button-row-ring'),
        loadingLabel: selector?.querySelector('.demo-user-loading-copy')?.textContent?.trim() ?? '',
        rings: [...document.querySelectorAll('app-indicator:has(.is-state-loading)')].map(node => {
          if (!ringIds.has(node)) ringIds.set(node, ++nextRingId);
          return { id: ringIds.get(node), kind: node.className, duration: node.style.getPropertyValue('--app-indicator-duration') };
        })
      };
      const serialized = JSON.stringify(state);
      if (serialized !== previous) { states.push({ ms: performance.now() - started, ...state }); previous = serialized; }
    };
    const observer = new MutationObserver(sample);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
    const tasks = new PerformanceObserver(list => longTasks.push(...list.getEntries().map(e => ({ ms: e.startTime - started, duration: e.duration }))));
    tasks.observe({ type: 'longtask' });
    sample();
    window.__mscSelectionMeasurement = { started, states, longTasks, observer, tasks };
  });
  const profiler = await page.context().newCDPSession(page);
  await profiler.send('Profiler.enable');
  await profiler.send('Profiler.start');
  await actor.click();
  await page.waitForURL('**/game', { timeout: 120000 });
  report.navigationMs = await page.evaluate(() => performance.now() - window.__mscSelectionMeasurement.started);
  if (label === 'verified') {
    await page.locator('app-demo-bootstrap-selector .demo-user-stage').waitFor({ state: 'hidden' });
    await page.locator('.app-menu__button-row-ring').first().waitFor({ state: 'visible' });
    // Screenshot capture can stall rendering; keep it outside the timing window.
    await page.getByRole('button', { name: 'Open user menu', exact: true }).waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForTimeout(4000);
  }
  const { profile } = await profiler.send('Profiler.stop');
  await writeFile(path.join(output, `demo-selection-${label}.cpuprofile`), JSON.stringify(profile));
  await profiler.detach();
  report.measurement = await page.evaluate(() => {
    const m = window.__mscSelectionMeasurement;
    m.observer.disconnect(); m.tasks.disconnect();
    const result = { elapsedMs: performance.now() - m.started, states: m.states, longTasks: m.longTasks,
      resources: performance.getEntriesByType('resource').filter(e => e.startTime >= m.started)
        .map(e => ({ path: new URL(e.name).pathname, ms: e.startTime - m.started, duration: e.duration })) };
    delete window.__mscSelectionMeasurement;
    return result;
  });
  if (responses.some(r => r.path === '/api/auth/session/login')) throw new Error('Unexpected HTTP login; not a local-adapter run');
  if (label === 'verified') {
    if (!report.measurement.states.some(s => s.path === '/game' && !s.popup && s.avatarRing))
      throw new Error('The internal avatar must own loading after the selector closes');
  }
  await page.screenshot({ path: path.join(output, `demo-selection-${label}.png`) });
  report.passed = true;
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  report.failure = error.message;
  await page.screenshot({ path: path.join(output, `demo-selection-${label}-failure.png`) });
  throw error;
} finally {
  report.responses = responses;
  await writeFile(path.join(output, `demo-selection-${label}.json`), JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
