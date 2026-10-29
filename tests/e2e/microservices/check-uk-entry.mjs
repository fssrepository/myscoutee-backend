#!/usr/bin/env node
// Explicitly delegated UK qualification; uses the common versioned launcher.
import { createRequire } from 'node:module';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readManagedBrowserManifest } from '../../qa/node_modules/@fssrepository/myscoutee-qa/browser/managed-browser-manifest.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const require = createRequire(path.join(root, 'myscoutee-frontend/package.json'));
const { chromium } = require('playwright');
const manifest = await readManagedBrowserManifest('MSC121-UK-ENTRY');
if (manifest.checkpointId !== 'MSC121-UK-ENTRY' || manifest.sessions.length !== 1) throw new Error('Use the UK checkpoint launcher');
const browser = await chromium.connectOverCDP(`http://127.0.0.1:${manifest.sessions[0].devToolsPort}`);
const page = browser.contexts()[0].pages()[0];
const output = path.join(root, 'server/build/microservices/reports/browser');
await mkdir(output, {recursive: true});
const report = {startedAt: new Date().toISOString(), passed: false, regions: [], checks: []};
const button = name => page.getByRole('button', {name, exact: true});
async function optionalButton(name) {
  try { await button(name).waitFor({state: 'visible', timeout: 2000}); } catch { return; }
  await button(name).click();
}
try {
  if (!page.url().startsWith('http://localhost:18080/entry')) throw new Error('Launch a fresh anonymous UK checkpoint');
  if (JSON.parse(await page.locator('#myscoutee-runtime-status').textContent()).ready !== true) throw new Error('HTTP backend must be ready');
  const catalogs = await Promise.all(['demo_db','e2e_db','myscoutee_db'].map(async db =>
    JSON.parse(await readFile(path.join(root, `server/docker/conf/mongodb/${db}/countryPartitions.json`), 'utf8')).filter(c => c.countryCode === 'GB')));
  if (catalogs.some(c => c.length !== 1 || JSON.stringify(c) !== JSON.stringify(catalogs[0]))) throw new Error('GB canonical catalog mismatch');
  report.checks.push('Canonical demo/E2E/production GB geometry is identical');
  for (const [name, latitude, longitude, partition] of [
    ['London, England',51.5074,-0.1278,'country:gb'],
    ['Edinburgh, Scotland',55.9533,-3.1883,'country:gb'],
    ['Cardiff, Wales',51.4816,-3.1791,'country:gb'],
    ['Belfast, Northern Ireland',54.5973,-5.9301,'country:gb'],
    ['Dublin, Ireland',53.3498,-6.2603,null]
  ]) {
    const response = await page.request.get(`http://localhost:18080/api/auth/eligibility?latitude=${latitude}&longitude=${longitude}`);
    const value = await response.json();
    report.regions.push({name, latitude, longitude, status: response.status(), ...value});
    if (response.status() !== 200 || value.partitionKey !== partition || value.eligible !== !!partition || value.securityGateEnabled !== true)
      throw new Error('Eligibility/gate mismatch: '+name);
  }
  const response = await page.request.get('http://localhost:18080/api/auth/demo-users');
  const users = await response.json();
  const index = users.findIndex(user => user.name === 'Emma Parker');
  if (response.status() !== 200 || index <= 0) throw new Error('Emma must be an existing non-first demo member');
  const actor = users[index];
  report.actor = {id: actor.id, name: actor.name, selectorIndex: index, coordinates: actor.locationCoordinates};
  const point = actor.locationCoordinates;
  if (!point) throw new Error('Demo actor has no canonical coordinates');
  const eligibility = await (await page.request.get(`http://localhost:18080/api/auth/eligibility?latitude=${point.latitude}&longitude=${point.longitude}`)).json();
  if (eligibility.partitionKey !== 'country:gb' || !eligibility.eligible) throw new Error('Demo actor is not in GB');
  await optionalButton('Done');
  await optionalButton('Accept and continue');
  await button('Start exploring').click();
  const login = page.waitForResponse(r => new URL(r.url()).pathname === '/api/auth/session/login', {timeout: 30000});
  await page.getByText(actor.name, {exact: true}).click();
  const loggedIn = await login;
  const loginBody = await loggedIn.json();
  report.login = {status: loggedIn.status(), accepted: loginBody.accepted, outcome: loginBody.outcome};
  if (loggedIn.status() !== 200 || !loginBody.accepted) throw new Error('Native UK demo login rejected');
  await page.waitForURL('**/game');
  await button('Open user menu').waitFor({state: 'visible'});
  await optionalButton('Done');
  await optionalButton('Approve privacy');
  report.checks.push('Non-first canonical UK demo member enters /game through native HTTP login');
  await page.screenshot({path: path.join(output,'uk-entry.png')});
  await button('Open user menu').click();
  await button('Open settings menu').click();
  await page.getByText('Logout',{exact:true}).click();
  const logout = page.waitForResponse(r => new URL(r.url()).pathname === '/api/auth/me/logout');
  await button('Logout').click();
  if ((await logout).status() !== 200) throw new Error('Native logout failed');
  await page.waitForURL('**/entry**');
  report.checks.push('Test session logged out through the UI');
  report.passed = true;
} catch (error) {
  report.failure = error.message;
  await page.screenshot({path: path.join(output,'uk-entry-failure.png')});
  throw error;
} finally {
  report.finishedAt = new Date().toISOString();
  await writeFile(path.join(output,'uk-entry.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
  await browser.close();
}
