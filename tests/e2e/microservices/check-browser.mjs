#!/usr/bin/env node
// Explicitly delegated browser qualification only. First use the versioned
// MSC121-QUALIFICATION launcher; never attach to a user's unrelated browser.
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readManagedBrowserManifest } from '../../qa/node_modules/@fssrepository/myscoutee-qa/browser/managed-browser-manifest.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const require = createRequire(path.join(root, 'frontend/package.json'));
const { chromium } = require('playwright');
const manifest = await readManagedBrowserManifest('MSC121-QUALIFICATION');
if (manifest.checkpointId !== 'MSC121-QUALIFICATION' || manifest.sessions.length !== 1) throw new Error('Wrong managed browser checkpoint');
const browser = await chromium.connectOverCDP(`http://127.0.0.1:${manifest.sessions[0].devToolsPort}`);
const page = browser.contexts()[0].pages()[0];
page.setDefaultTimeout(20000);
const foundations = process.argv.includes('--foundations');
const origin = process.env.MYSCOUTEE_QA_ORIGIN || 'http://localhost:18080';
const report = { startedAt: new Date().toISOString(), passed: false, checks: [], responses: [] };
const output = path.join(root, 'server/build/microservices/reports/browser', process.env.MYSCOUTEE_QA_REPORT || 'kvm');
await mkdir(output, { recursive: true });
page.on('response', response => {
  const url = new URL(response.url());
  if (url.origin === origin && url.pathname.startsWith('/api/'))
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
  if (!page.url().startsWith(origin + '/entry')) throw new Error('Launch a fresh anonymous checkpoint first');
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
  if (foundations) {
    await openMenu();
    await button('Open profile editor').click();
    await button('Save profile').waitFor({ state: 'visible' });
    await button('Open image editor').waitFor({ state: 'visible' });
    await page.getByRole('dialog', { name: 'Profile', exact: true }).getByRole('button', { name: 'Close', exact: true }).click();
    checked('Profile editor and image-editor entry load');
    for (const [menu, close, title] of [
      ['Open help', 'Close help popup', 'Help'],
      ['Open privacy', 'Close privacy popup', 'GDPR consent'],
      ['Open terms', 'Close terms popup', 'Terms of service']
    ]) {
      await openMenu();
      await button('Open settings menu').click();
      await page.getByRole('menuitem', { name: menu, exact: true }).click();
      const document = page.getByRole('dialog', { name: title, exact: true });
      await document.getByRole('article').first().waitFor({ state: 'visible' });
      await button(close).click();
      checked(title + ' published document renders');
    }
    // Guides may have several steps. Exercise the rendered navigation, not a fixed step count.
    await button('Explanations').click();
    const guide = page.getByRole('dialog');
    await guide.getByRole('heading').first().waitFor({ state: 'visible' });
    for (let step = 0; step < 20; step++) {
      const action = guide.getByRole('button', { name: /^(Next|Done)$/ });
      const label = await action.getAttribute('aria-label');
      const before = await guide.innerText();
      await action.click();
      if (label === 'Done') { await guide.waitFor({ state: 'hidden' }); break; }
      await page.waitForFunction(previous => {
        const dialog = document.querySelector('[role="dialog"]');
        return !dialog || dialog.innerText !== previous;
      }, before);
      if (!(await guide.isVisible())) break;
      if (step === 19) throw new Error('Guide did not finish within its bounded step limit');
    }
    checked('Context guide opens and completes through its steps');
    await openMenu();
    await page.getByRole('menuitem', { name: 'Open chat', exact: true }).click();
    const chats = page.getByRole('dialog', { name: 'Activities', exact: true });
    await chats.getByRole('button').filter({ hasText: 'Perfect, locking this in.' }).first().click();
    await page.locator('[data-chat-message-id]').first().waitFor({ state: 'visible' });
    await button('Close chat popup').click();
    await button('Close activities').click();
    checked('Native chat list and persisted messages render');
  }

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
  if (foundations) {
    await button('Start exploring').click();
    await button('Filter demo users').click();
    await page.getByRole('menuitemradio', { name: 'Show Operator demo users', exact: true }).click();
    await page.getByText('Demo Operator', { exact: true }).click();
    await page.waitForURL('**/operator');
    await optionalButton('Done');
    const configuration = page.waitForResponse(r => new URL(r.url()).pathname === '/api/operator/configuration' && r.status() === 200);
    await button('Configuration').click();
    await configuration;
    const panel = page.getByRole('dialog', { name: 'Configuration', exact: true });
    await panel.getByRole('textbox', { name: 'Product name', exact: true }).waitFor({ state: 'visible' });
    if (await panel.getByRole('textbox', { name: 'Product name', exact: true }).isDisabled())
      throw new Error('Operator configuration is unavailable/read-only');
    await page.screenshot({ path: path.join(output, 'operator-configuration.png') });
    await button('Close operator window').click();
    checked('Operator configuration loads with editable branding; no configuration saved');
    await openMenu();
    await button('Open operator settings menu').click();
    await page.getByRole('menuitem', { name: 'Logout', exact: true }).click();
    const operatorLogout = page.waitForResponse(r => new URL(r.url()).pathname === '/api/auth/me/logout');
    await button('Logout').click();
    if ((await operatorLogout).status() !== 200) throw new Error('Operator logout failed');
    await page.waitForURL('**/entry**');
    checked('Operator session logged out');
  }

  // The existing SessionService explicitly tolerates an already-revoked session
  // after the user-action logout. Retain that 401 as evidence, not a new failure.
  let revoked = false;
  report.expectedAlreadyRevoked = 0;
  for (const response of report.responses) {
    if (response.path === '/api/auth/me/logout' && response.status === 200) revoked = true;
    if (response.path === '/api/auth/me/logout' && response.status === 401 && revoked) {
      report.expectedAlreadyRevoked += 1;
    } else if (foundations && response.status === 409 && /^\/api\/operator\/(?:leaderboard|claim|announcements|measurements|revenue)(?:\/|$)/.test(response.path)) {
      report.expectedUnregisteredNetwork = (report.expectedUnregisteredNetwork || 0) + 1;
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
