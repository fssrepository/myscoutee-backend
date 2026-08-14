#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { readFile, writeFile, mkdir, mkdtemp, rm, readdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const geolocationHolderPath = path.join(scriptDirectory, 'hold-chrome-geolocation.mjs');
const configurationPath = process.env.QA_BROWSER_SESSION_CONFIG
  || path.join(scriptDirectory, 'browser-session-checkpoints.json');
const chromeBinary = process.env.CHROME_BIN || '/opt/google/chrome/chrome';
const argumentsList = process.argv.slice(2);
const dismissGuidesOnly = argumentsList.includes('--dismiss-guides');
const checkpointId = `${argumentsList.find(argument => !argument.startsWith('--')) || process.env.QA_CHECKPOINT || ''}`.trim();
const runtimeRoot = path.join(os.tmpdir(), 'myscoutee-qa-browser-sessions');

if (!checkpointId) {
  fail('Usage: open-checkpoint-browser-sessions.mjs CHECKPOINT_ID');
}
if (!existsSync(chromeBinary)) {
  fail(`Chrome is not executable at ${chromeBinary}`);
}

const configuration = JSON.parse(await readFile(configurationPath, 'utf8'));
const checkpoint = configuration.checkpoints?.[checkpointId];
if (!checkpoint || !Array.isArray(checkpoint.sessions) || checkpoint.sessions.length === 0) {
  fail(`No browser-session configuration exists for ${checkpointId}`);
}

const defaults = configuration.defaults ?? {};
const targetUrl = `${checkpoint.targetUrl || defaults.targetUrl || 'http://localhost/game'}`;
const entryUrl = `${checkpoint.entryUrl || defaults.entryUrl || 'http://localhost/entry?redirect=%2Fgame'}`;
const storageScope = `${checkpoint.storageScope || defaults.storageScope || 'http'}`.trim();
const bootstrapEntryConsent = checkpoint.bootstrapEntryConsent
  ?? defaults.bootstrapEntryConsent
  ?? true;
const defaultGeolocation = checkpoint.geolocation ?? defaults.geolocation ?? {
  latitude: 30.2672,
  longitude: -97.7431,
  accuracy: 10
};
const screenWidth = positiveInteger(process.env.QA_SCREEN_WIDTH, defaults.screenWidth ?? 1920);
const screenHeight = positiveInteger(process.env.QA_SCREEN_HEIGHT, defaults.screenHeight ?? 1000);
const columns = Math.min(
  checkpoint.sessions.length,
  positiveInteger(process.env.QA_BROWSER_COLUMNS, checkpoint.layout?.columns ?? checkpoint.sessions.length)
);
const rows = Math.ceil(checkpoint.sessions.length / columns);
const windowWidth = Math.floor(screenWidth / columns);
const windowHeight = Math.floor(screenHeight / rows);
const safeCheckpointId = checkpointId.replace(/[^A-Za-z0-9_.-]+/g, '-');
const manifestPath = path.join(runtimeRoot, `${safeCheckpointId}.json`);

await mkdir(runtimeRoot, { recursive: true });
if (dismissGuidesOnly) {
  const existing = JSON.parse(await readFile(manifestPath, 'utf8'));
  for (const session of existing.sessions ?? []) {
    await dismissExplanationGuide(Number(session.devToolsPort), storageScope);
    process.stdout.write(`${session.actor}: explanation guide dismissed.\n`);
  }
  process.exit(0);
}
await closeOtherManagedCheckpointSessions(manifestPath);
await closePreviousCheckpointSessions(manifestPath);

const manifest = {
  checkpointId,
  createdAt: new Date().toISOString(),
  sessions: []
};

try {
  for (const [index, session] of checkpoint.sessions.entries()) {
    validateSession(session);
    const sessionKind = `${session.sessionKind ?? 'demo'}`.trim().toLowerCase();
    const actorSlug = `${session.actor}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const userDataDirectory = await mkdtemp(
      path.join(runtimeRoot, `${safeCheckpointId}-${index + 1}-${actorSlug}-`)
    );
    const geolocation = session.geolocation ?? defaultGeolocation;
    const geolocationPermission = normalizeGeolocationPermission(
      session.geolocationPermission ?? checkpoint.geolocationPermission ?? 'granted'
    );
    await prepareChromeProfilePreferences(userDataDirectory, geolocationPermission);
    const column = index % columns;
    const row = Math.floor(index / columns);
    const position = {
      x: column * windowWidth,
      y: row * windowHeight,
      width: windowWidth,
      height: windowHeight
    };

    const browser = spawn(chromeBinary, [
      `--user-data-dir=${userDataDirectory}`,
      '--remote-debugging-port=0',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-session-crashed-bubble',
      '--hide-crash-restore-bubble',
      '--ignore-certificate-errors',
      '--ozone-platform=x11',
      `--window-position=${position.x},${position.y}`,
      `--window-size=${position.width},${position.height}`,
      'about:blank'
    ], {
      detached: true,
      stdio: 'ignore'
    });
    browser.unref();

    const runtimeSession = {
      actor: session.actor,
      expectedName: session.expectedName,
      sessionKind,
      userId: session.userId,
      geolocation,
      geolocationPermission,
      pid: browser.pid,
      userDataDirectory,
      position
    };
    manifest.sessions.push(runtimeSession);
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    const port = await waitForDevToolsPort(userDataDirectory);
    runtimeSession.devToolsPort = port;
    runtimeSession.geolocationHolderPid = await prepareBrowserLocation(
      port,
      entryUrl,
      geolocation,
      geolocationPermission,
      userDataDirectory
    );
    if (sessionKind === 'anonymous') {
      await clearManagedSession(port, storageScope);
      if (bootstrapEntryConsent) {
        await acceptEntryConsentOnCurrentEntry(port, storageScope);
      }
      await waitForAnonymousEntry(port, storageScope, entryUrl);
    } else {
      await installDemoSession(port, storageScope, session.userId, targetUrl);
      if (bootstrapEntryConsent) {
        await acceptEntryConsent(port, storageScope, targetUrl);
      }
      await waitForConfiguredSession(port, storageScope, session.userId, targetUrl);
      await dismissExplanationGuide(port, storageScope);
    }
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    process.stdout.write(`${session.actor}: ${session.expectedName} ready.\n`);
  }
} catch (error) {
  await closePreviousCheckpointSessions(manifestPath);
  fail(error instanceof Error ? error.message : `${error}`);
}

process.stdout.write(`${checkpointId}: ${manifest.sessions.length} isolated browser sessions ready.\n`);

function positiveInteger(raw, fallback) {
  const value = Number.parseInt(`${raw ?? ''}`, 10);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function normalizeGeolocationPermission(raw) {
  const value = `${raw ?? ''}`.trim().toLowerCase();
  if (value === 'granted' || value === 'denied' || value === 'prompt') {
    return value;
  }
  throw new Error(`Invalid geolocation permission '${value}' in ${checkpointId}`);
}

function validateSession(session) {
  const sessionKind = `${session?.sessionKind ?? 'demo'}`.trim().toLowerCase();
  const validKind = sessionKind === 'demo' || sessionKind === 'anonymous';
  const hasRequiredIdentity = sessionKind === 'anonymous'
    || Boolean(`${session?.userId ?? ''}`.trim());
  if (!session || !`${session.actor ?? ''}`.trim() || !validKind || !hasRequiredIdentity) {
    throw new Error(`Invalid browser-session entry in ${checkpointId}`);
  }
}

async function prepareChromeProfilePreferences(userDataDirectory, geolocationPermission) {
  const defaultProfileDirectory = path.join(userDataDirectory, 'Default');
  await mkdir(defaultProfileDirectory, { recursive: true });
  const defaultContentSettings = geolocationPermission === 'prompt'
    ? {}
    : { geolocation: geolocationPermission === 'granted' ? 1 : 2 };
  await writeFile(path.join(defaultProfileDirectory, 'Preferences'), `${JSON.stringify({
    profile: {
      exit_type: 'Normal',
      exited_cleanly: true,
      default_content_setting_values: defaultContentSettings
    }
  })}\n`);
}

async function closePreviousCheckpointSessions(filePath) {
  if (!existsSync(filePath)) {
    return;
  }
  let previous;
  try {
    previous = JSON.parse(await readFile(filePath, 'utf8'));
  } catch {
    return;
  }
  for (const session of previous.sessions ?? []) {
    const holderPid = Number(session.geolocationHolderPid);
    if (Number.isInteger(holderPid) && holderPid > 1 && ownsGeolocationHolder(holderPid)) {
      try {
        process.kill(holderPid, 'SIGTERM');
      } catch (error) {
        if (error?.code !== 'ESRCH') {
          throw error;
        }
      }
    }
    const pid = Number(session.pid);
    const userDataDirectory = `${session.userDataDirectory ?? ''}`;
    if (Number.isInteger(pid) && pid > 1 && ownsRuntimeDirectory(pid, userDataDirectory)) {
      try {
        process.kill(pid, 'SIGTERM');
      } catch (error) {
        if (error?.code !== 'ESRCH') {
          throw error;
        }
      }
    }
  }
  await waitUntil(() => (previous.sessions ?? []).every(session => !processExists(Number(session.pid))), 5000);
  for (const session of previous.sessions ?? []) {
    const directory = `${session.userDataDirectory ?? ''}`;
    if (directory.startsWith(`${runtimeRoot}${path.sep}`)) {
      await rm(directory, { recursive: true, force: true });
    }
  }
  await rm(filePath, { force: true });
}

async function closeOtherManagedCheckpointSessions(currentManifestPath) {
  const entries = await readdir(runtimeRoot, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) {
      continue;
    }
    const filePath = path.join(runtimeRoot, entry.name);
    if (filePath !== currentManifestPath) {
      await closePreviousCheckpointSessions(filePath);
    }
  }
}

function ownsRuntimeDirectory(pid, directory) {
  if (!directory.startsWith(`${runtimeRoot}${path.sep}`)) {
    return false;
  }
  try {
    return readFileSync(`/proc/${pid}/cmdline`, 'utf8').includes(`--user-data-dir=${directory}`);
  } catch {
    return false;
  }
}

function ownsGeolocationHolder(pid) {
  try {
    return readFileSync(`/proc/${pid}/cmdline`, 'utf8').includes(geolocationHolderPath);
  } catch {
    return false;
  }
}

function processExists(pid) {
  if (!Number.isInteger(pid) || pid < 2) {
    return false;
  }
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function waitForDevToolsPort(userDataDirectory) {
  const activePortPath = path.join(userDataDirectory, 'DevToolsActivePort');
  let raw = '';
  await waitUntil(() => {
    try {
      raw = readFileSync(activePortPath, 'utf8');
      return raw.trim().length > 0;
    } catch {
      return false;
    }
  }, 20000, `Chrome DevTools port file ${activePortPath}`);
  const port = Number.parseInt(raw.split(/\r?\n/, 1)[0], 10);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Chrome did not expose a DevTools port for ${userDataDirectory}`);
  }
  return port;
}

async function installDemoSession(port, scope, userId, destinationUrl) {
  const sessionKey = `myscoutee.${scope}.session.v1`;
  const activeUserKey = `myscoutee.${scope}.demo.active-user.v1`;
  const sessionValue = JSON.stringify({ kind: 'demo', userId });
  const expression = `(() => {
    localStorage.setItem(${JSON.stringify(sessionKey)}, ${JSON.stringify(sessionValue)});
    localStorage.setItem(${JSON.stringify(activeUserKey)}, ${JSON.stringify(userId)});
    window.location.replace(${JSON.stringify(destinationUrl)});
    return true;
  })()`;
  await evaluateInOnlyPage(port, expression, true);
}

async function clearManagedSession(port, scope) {
  const sessionKey = `myscoutee.${scope}.session.v1`;
  const activeUserKey = `myscoutee.${scope}.demo.active-user.v1`;
  await evaluateInOnlyPage(port, `(() => {
    localStorage.removeItem(${JSON.stringify(sessionKey)});
    localStorage.removeItem(${JSON.stringify(activeUserKey)});
    return true;
  })()`);
}

async function prepareBrowserLocation(port, entryPageUrl, location, permission, userDataDirectory) {
  const origin = new URL(entryPageUrl).origin;
  const browser = await jsonRequest(`http://127.0.0.1:${port}/json/version`);
  if (browser.webSocketDebuggerUrl) {
    for (const allowedOrigin of new Set([origin, origin.replace('http:', 'https:')])) {
      if (permission === 'granted') {
        await cdpCommand(browser.webSocketDebuggerUrl, 'Browser.grantPermissions', {
          origin: allowedOrigin,
          permissions: ['geolocation']
        });
      } else {
        await cdpCommand(browser.webSocketDebuggerUrl, 'Browser.setPermission', {
          origin: allowedOrigin,
          permission: { name: 'geolocation' },
          setting: permission
        });
      }
    }
  }
  if (!location) {
    const initialPage = await waitForAnyPageTarget(port);
    await cdpCommand(initialPage.webSocketDebuggerUrl, 'Page.navigate', { url: entryPageUrl });
    await waitForAppPageTarget(port);
    return null;
  }

  // Geolocation emulation is scoped to the CDP session. A one-shot command is
  // reverted when that DevTools connection closes, so a tiny holder keeps the
  // target session alive for exactly as long as this managed Chrome process.
  const readyFile = path.join(userDataDirectory, 'GeolocationHolderReady.json');
  const holder = spawn(process.execPath, [
    geolocationHolderPath,
    '--port', `${port}`,
    '--latitude', `${Number(location.latitude)}`,
    '--longitude', `${Number(location.longitude)}`,
    '--accuracy', `${Number(location.accuracy ?? 10)}`,
    '--permission', permission,
    '--url', entryPageUrl,
    '--ready-file', readyFile
  ], {
    detached: true,
    stdio: 'ignore'
  });
  holder.unref();

  let holderState = null;
  await waitUntil(() => {
    try {
      holderState = JSON.parse(readFileSync(readyFile, 'utf8'));
      return holderState?.status === 'ready' || holderState?.status === 'error';
    } catch {
      return false;
    }
  }, 10000, `Chrome geolocation holder on DevTools port ${port}`);
  if (holderState?.status !== 'ready') {
    throw new Error(holderState?.message || `Chrome geolocation holder failed on port ${port}.`);
  }
  await waitForAppPageTarget(port);
  return holder.pid;
}

async function acceptEntryConsent(port, scope, destinationUrl) {
  const consentKey = `myscoutee.${scope}.entry.gdpr-consent.v1`;
  const destinationPath = new URL(destinationUrl).pathname;
  await waitUntil(async () => {
    try {
      return await evaluateInOnlyPage(port, `(() => {
        if (window.location.pathname === ${JSON.stringify(destinationPath)}) return true;
        const raw = localStorage.getItem(${JSON.stringify(consentKey)});
        const consent = raw ? JSON.parse(raw) : null;
        if (consent?.accepted === true) return true;
        const footer = document.querySelector('.document-viewer-actions');
        if (!footer) return false;
        const buttons = Array.from(footer.querySelectorAll('button:not([disabled])'));
        const accept = buttons.at(-1);
        if (!accept) return false;
        accept.click();
        return true;
      })()`);
    } catch {
      return false;
    }
  }, 30000, `entry consent action on DevTools port ${port}`);
  const alreadyAtDestination = await evaluateInOnlyPage(
    port,
    `window.location.pathname === ${JSON.stringify(destinationPath)}`
  );
  if (alreadyAtDestination) {
    return;
  }
  await waitUntil(async () => {
    try {
      return await evaluateInOnlyPage(port, `(() => {
        const raw = localStorage.getItem(${JSON.stringify(consentKey)});
        const consent = raw ? JSON.parse(raw) : null;
        return consent?.accepted === true;
      })()`);
    } catch {
      return false;
    }
  }, 10000, `persisted entry consent on DevTools port ${port}`);
  await evaluateInOnlyPage(
    port,
    `window.location.replace(${JSON.stringify(destinationUrl)})`,
    true
  );
}

async function acceptEntryConsentOnCurrentEntry(port, scope) {
  const consentKey = `myscoutee.${scope}.entry.gdpr-consent.v1`;
  await waitUntil(async () => {
    try {
      return await evaluateInOnlyPage(port, `(() => {
        const raw = localStorage.getItem(${JSON.stringify(consentKey)});
        const consent = raw ? JSON.parse(raw) : null;
        if (consent?.accepted === true) return true;
        const footer = document.querySelector('.document-viewer-actions');
        if (!footer) return false;
        const buttons = Array.from(footer.querySelectorAll('button:not([disabled])'));
        const accept = buttons.at(-1);
        if (!accept) return false;
        accept.click();
        return false;
      })()`);
    } catch {
      return false;
    }
  }, 30000, `persisted entry consent on DevTools port ${port}`);
}

async function dismissExplanationGuide(port, scope) {
  const dismissedContextsKey = `myscoutee.${scope}.explanation-guide.dismissed-contexts.v1`;
  await waitUntil(async () => {
    try {
      return await evaluateInOnlyPage(port, `(() => {
        const raw = localStorage.getItem(${JSON.stringify(dismissedContextsKey)});
        const dismissed = raw ? JSON.parse(raw) : [];
        if (Array.isArray(dismissed) && dismissed.includes('home.game')) return true;
        const guide = document.querySelector('app-explanation-popup');
        if (!guide) return false;
        const button = Array.from(guide.querySelectorAll('button:not([disabled])')).at(-1);
        if (!button) return false;
        button.click();
        return false;
      })()`);
    } catch {
      return false;
    }
  }, 15000, `explanation guide dismissal on DevTools port ${port}`);
}

async function waitForConfiguredSession(port, scope, userId, destinationUrl) {
  const sessionKey = `myscoutee.${scope}.session.v1`;
  const expectedPath = new URL(destinationUrl).pathname;
  await waitUntil(async () => {
    try {
      const value = await evaluateInOnlyPage(port, `(() => {
        const raw = localStorage.getItem(${JSON.stringify(sessionKey)});
        const session = raw ? JSON.parse(raw) : null;
        return {
          userId: session?.kind === 'demo' ? session.userId : '',
          pathname: window.location.pathname
        };
      })()`);
      return value?.userId === userId && value?.pathname === expectedPath;
    } catch {
      return false;
    }
  }, 30000, `MyScoutee session ${userId} on DevTools port ${port}`);
}

async function waitForAnonymousEntry(port, scope, entryPageUrl) {
  const sessionKey = `myscoutee.${scope}.session.v1`;
  const expectedPath = new URL(entryPageUrl).pathname;
  await waitUntil(async () => {
    try {
      const value = await evaluateInOnlyPage(port, `({
        hasSession: Boolean(localStorage.getItem(${JSON.stringify(sessionKey)})),
        pathname: window.location.pathname
      })`);
      return value?.hasSession === false && value?.pathname === expectedPath;
    } catch {
      return false;
    }
  }, 30000, `anonymous MyScoutee entry on DevTools port ${port}`);
}

async function evaluateInOnlyPage(port, expression, tolerateNavigation = false) {
  const page = await waitForAppPageTarget(port);
  try {
    return await cdpEvaluate(page.webSocketDebuggerUrl, expression);
  } catch (error) {
    if (tolerateNavigation) {
      return undefined;
    }
    throw error;
  }
}

async function waitForAppPageTarget(port) {
  let page;
  await waitUntil(async () => {
    try {
      const targets = await jsonRequest(`http://127.0.0.1:${port}/json/list`);
      page = targets.find(target =>
        target.type === 'page'
        && target.webSocketDebuggerUrl
        && /^https?:\/\/(localhost|127\.0\.0\.1)(?::[0-9]+)?\//.test(`${target.url ?? ''}`)
      );
      return Boolean(page);
    } catch {
      return false;
    }
  }, 20000, `MyScoutee page target on DevTools port ${port}`);
  return page;
}

async function waitForAnyPageTarget(port) {
  let page;
  await waitUntil(async () => {
    try {
      const targets = await jsonRequest(`http://127.0.0.1:${port}/json/list`);
      page = targets.find(target => target.type === 'page' && target.webSocketDebuggerUrl);
      return Boolean(page);
    } catch {
      return false;
    }
  }, 20000, `page target on DevTools port ${port}`);
  return page;
}

async function cdpEvaluate(webSocketUrl, expression) {
  const message = await cdpCommand(webSocketUrl, 'Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  return message.result?.result?.value;
}

async function cdpCommand(webSocketUrl, method, params = {}) {
  return await new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketUrl);
    const requestId = 1;
    const timeout = setTimeout(() => {
      socket.close();
      reject(new Error('Chrome Runtime.evaluate timed out'));
    }, 5000);
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({
        id: requestId,
        method,
        params
      }));
    });
    socket.addEventListener('message', event => {
      const message = JSON.parse(`${event.data}`);
      if (message.id !== requestId) {
        return;
      }
      clearTimeout(timeout);
      socket.close();
      if (message.error || message.result?.exceptionDetails) {
        reject(new Error(message.error?.message || 'Chrome Runtime.evaluate failed'));
        return;
      }
      resolve(message);
    });
    socket.addEventListener('error', () => {
      clearTimeout(timeout);
      reject(new Error('Unable to connect to Chrome DevTools'));
    });
  });
}

async function jsonRequest(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }
  return await response.json();
}

async function waitUntil(predicate, timeoutMs, description = 'condition') {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for ${description} after ${timeoutMs} ms`);
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
