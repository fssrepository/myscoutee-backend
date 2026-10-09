#!/usr/bin/env node
// Explicitly delegated browser qualification only. First use the versioned
// MSC121-QUALIFICATION launcher; never attach to a user's unrelated browser.
import { createRequire } from 'node:module';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(path.join(root, 'frontend/package.json'));
const { chromium } = require('playwright');
const manifest = JSON.parse(await readFile('/tmp/myscoutee-qa-browser-sessions/MSC121-QUALIFICATION.json', 'utf8'));
if (manifest.checkpointId !== 'MSC121-QUALIFICATION' || manifest.sessions.length !== 1) throw new Error('Wrong managed browser checkpoint');
const browser = await chromium.connectOverCDP(`http://127.0.0.1:${manifest.sessions[0].devToolsPort}`);
const page = browser.contexts()[0].pages()[0];
const report = { startedAt: new Date().toISOString(), passed: false, checks: [], responses: [] };
const output = path.join(root, 'microservices/build/reports/browser');
await mkdir(output, { recursive: true });
page.on('response', response => {
  const url = new URL(response.url());
  if (url.origin === 'http://localhost:18080' && url.pathname.startsWith('/api/'))
    report.responses.push({ path: url.pathname, status: response.status() });
});
const button = name => page.getByRole('button', { name, exact: true });
async function optionalButton(name) {
  try { await button(name).waitFor({ state: 'visible', timeout: 2000 }); }
  catch { return; }
  await button(name).click();
}
function checked(name) { report.checks.push(name); console.log('PASS: ' + name); }
async function openMenu() {
  const toggle = page.getByRole('button', { name: /^(Open|Close) user menu$/ });
  await toggle.waitFor({ state: 'visible' });
  if (await toggle.getAttribute('aria-label') === 'Open user menu') await toggle.click();
}
try {
  if (!page.url().startsWith('http://localhost:18080/entry')) throw new Error('Launch a fresh anonymous checkpoint first');
  const initial = await page.locator('#myscoutee-runtime-status').textContent();
  if (JSON.parse(initial).ready !== true) throw new Error('Backend not ready; refuse a local-adapter qualification');
  await optionalButton('Done');
  await optionalButton('Accept and continue');
  await button('Next item').click();
  checked('HTTP landing, consent and carousel navigation');
  await button('Start exploring').click();
  const login = page.waitForResponse(r => new URL(r.url()).pathname === '/api/auth/session/login', { timeout: 30000 });
  await page.getByText('Alex Turner', { exact: true }).click();
  const loginResponse = await login;
  if (loginResponse.status() !== 200 || !(await loginResponse.json()).accepted) throw new Error('Native DEMO login failed');
  await page.waitForURL('**/game');
  await button('Open user menu').waitFor({ state: 'visible' });
  await optionalButton('Done');
  await optionalButton('Approve privacy');
  checked('Native HTTP DEMO login and game route');
  await openMenu();
  await page.getByText('Events', { exact: true }).click();
  await button('Open event explore').click();
  await button('Close event explore').waitFor({ state: 'visible' });
  await page.screenshot({ path: path.join(output, 'events.png') });
  await button('Close event explore').click();
  await button('Close activities').click();
  checked('Event activity and explore popups');
  await openMenu();
  await button('Choose workspace').click();
  await page.screenshot({ path: path.join(output, 'workspaces.png') });
  checked('Workspace selector opens');
  for (const workspace of ['Work', 'Dating']) {
    await page.getByRole('menuitemradio').filter({ has: page.getByText(workspace, { exact: true }) }).click();
    await openMenu();
    await button('Choose workspace').filter({ hasText: workspace }).waitFor({ state: 'visible' });
    checked('Native workspace switch: ' + workspace);
    if (workspace === 'Work') await button('Choose workspace').click();
  }
  await button('Open settings menu').click();
  await page.getByText('Logout', { exact: true }).click();
  const logout = page.waitForResponse(r => new URL(r.url()).pathname === '/api/auth/me/logout');
  await button('Logout').click();
  if ((await logout).status() !== 200) throw new Error('Native logout failed');
  await page.waitForURL('**/entry**');
  checked('Native session logout');
  // The existing SessionService explicitly tolerates an already-revoked session
  // after the user-action logout. Retain that 401 as evidence, not a new failure.
  let revoked = false;
  report.expectedAlreadyRevoked = 0;
  for (const response of report.responses) {
    if (response.path === '/api/auth/me/logout' && response.status === 200) revoked = true;
    if (response.path === '/api/auth/me/logout' && response.status === 401 && revoked) {
      report.expectedAlreadyRevoked += 1;
    } else if (response.status >= 400) throw new Error('Browser observed a failed application request: ' + response.path);
  }
  report.passed = true;
} catch (error) {
  report.failure = error.message;
  await page.screenshot({ path: path.join(output, 'failure.png') });
  throw error;
} finally {
  report.finishedAt = new Date().toISOString();
  await writeFile(path.join(output, 'qualification.json'), JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
