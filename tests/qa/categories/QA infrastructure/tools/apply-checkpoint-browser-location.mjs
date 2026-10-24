#!/usr/bin/env node

import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const holderPath = createRequire(new URL('../../../package.json', import.meta.url)).resolve('@fssrepository/myscoutee-qa/browser/geolocation');

const args = process.argv.slice(2);
const checkpointId = `${args[0] ?? ''}`.trim();
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? `${args[index + 1] ?? ''}`.trim() : '';
};
const actorName = option('--actor');
const requestedPermission = option('--permission').toLowerCase();
const requestedLatitude = option('--latitude');
const requestedLongitude = option('--longitude');
const reload = args.includes('--reload');
const noReload = args.includes('--no-reload');

if (!checkpointId || !actorName) {
  throw new Error(
    'Usage: apply-checkpoint-browser-location.mjs CHECKPOINT_ID --actor NAME '
    + '[--permission granted|denied|prompt] [--latitude LAT --longitude LON] [--reload|--no-reload]'
  );
}
if (reload && noReload) throw new Error('Choose --reload or --no-reload.');
if (requestedPermission && !['granted', 'denied', 'prompt'].includes(requestedPermission)) {
  throw new Error(`Unsupported geolocation permission '${requestedPermission}'.`);
}
if ((requestedLatitude === '') !== (requestedLongitude === '')
  || (requestedLatitude !== '' && (
    !Number.isFinite(Number(requestedLatitude))
    || !Number.isFinite(Number(requestedLongitude))
    || Math.abs(Number(requestedLatitude)) > 90
    || Math.abs(Number(requestedLongitude)) > 180
  ))) {
  throw new Error('Provide a valid latitude and longitude together.');
}

const safeCheckpointId = checkpointId.replace(/[^A-Za-z0-9_.-]+/g, '-');
const manifestPath = path.join(
  os.tmpdir(),
  'myscoutee-qa-browser-sessions',
  `${safeCheckpointId}.json`
);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const matches = (manifest.sessions ?? []).filter(session =>
  `${session.actor ?? ''}`.toLowerCase() === actorName.toLowerCase()
);
if (matches.length !== 1) {
  throw new Error(`Expected one '${actorName}' session, found ${matches.length}.`);
}

const session = matches[0];
const port = Number(session.devToolsPort);
const permission = requestedPermission
  || `${session.activeGeolocationPermission ?? session.geolocationPermission ?? 'granted'}`;
const geolocation = requestedLatitude !== '' ? {
  latitude: Number(requestedLatitude),
  longitude: Number(requestedLongitude),
  accuracy: Number(session.geolocation?.accuracy ?? 10)
} : session.activeGeolocation ?? session.geolocation;
const pageUrl = await currentPage(port);
await stopExistingHolder(session, port);

const readyFile = path.join(
  session.userDataDirectory,
  `GeolocationHolderReady-${Date.now()}.json`
);
const holder = spawn(process.execPath, [
  holderPath,
  '--port', `${port}`,
  '--latitude', `${Number(geolocation?.latitude)}`,
  '--longitude', `${Number(geolocation?.longitude)}`,
  '--accuracy', `${Number(geolocation?.accuracy ?? 10)}`,
  '--permission', permission,
  ...(noReload ? ['--no-reload'] : []),
  '--url', pageUrl.url,
  '--ready-file', readyFile
], {
  detached: true,
  stdio: 'ignore'
});
holder.unref();

let holderState = null;
await waitUntil(async () => {
  try {
    holderState = JSON.parse(await readFile(readyFile, 'utf8'));
    return holderState?.status === 'ready' || holderState?.status === 'error';
  } catch {
    return false;
  }
}, 10000);
if (holderState?.status !== 'ready') {
  throw new Error(holderState?.message || `Chrome geolocation holder failed on port ${port}.`);
}

session.geolocationHolderPid = holder.pid;
session.activeGeolocationPermission = permission;
session.activeGeolocation = geolocation;
session.locationAppliedAtIso = new Date().toISOString();
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
await delay(reload ? 1200 : 700);

const activePage = await currentPage(port);
const observed = await cdpEvaluate(activePage.webSocketDebuggerUrl, `(() => new Promise(resolve => {
  navigator.geolocation.getCurrentPosition(
    position => resolve({
      ok: true,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy
    }),
    error => resolve({ ok: false, code: error.code, message: error.message }),
    { maximumAge: 0, timeout: 5000, enableHighAccuracy: false }
  );
}))()`);

process.stdout.write(`${JSON.stringify({
  checkpointId,
  actor: session.actor,
  permission,
  configuredGeolocation: session.geolocation ?? null,
  activeGeolocation: geolocation ?? null,
  observed,
  reloaded: !noReload
}, null, 2)}\n`);

async function stopExistingHolder(activeSession, activePort) {
  const holderPid = Number(activeSession.geolocationHolderPid);
  if (!Number.isInteger(holderPid) || holderPid <= 1) {
    return;
  }
  if (!processExists(holderPid)) {
    return;
  }
  const commandLine = await readFile(`/proc/${holderPid}/cmdline`, 'utf8').catch(() => '');
  if (!commandLine.includes(holderPath) || !commandLine.includes(`${activePort}`)) {
    throw new Error(`Refusing to stop unowned geolocation holder PID ${holderPid}.`);
  }
  try {
    process.kill(holderPid, 'SIGTERM');
  } catch (error) {
    if (error?.code !== 'ESRCH') {
      throw error;
    }
  }
  await waitUntil(() => !processExists(holderPid), 5000);
}

async function currentPage(port) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const targets = await jsonRequest(`http://127.0.0.1:${port}/json/list`);
    const page = targets.find(target =>
      target.type === 'page'
      && target.webSocketDebuggerUrl
      && /^https?:\/\/(localhost|127\.0\.0\.1)(?::[0-9]+)?\//.test(`${target.url ?? ''}`)
    );
    if (page) {
      return page;
    }
    await delay(100);
  }
  throw new Error(`No MyScoutee page target found on DevTools port ${port}.`);
}

async function jsonRequest(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }
  return await response.json();
}

async function cdpEvaluate(webSocketUrl, expression) {
  const response = await cdpCommand(webSocketUrl, 'Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  return response.result?.result?.value;
}

async function cdpCommand(webSocketUrl, method, params = {}) {
  return await new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketUrl);
    const timeout = setTimeout(() => {
      socket.close();
      reject(new Error(`${method} timed out.`));
    }, 7000);
    socket.addEventListener('open', () => socket.send(JSON.stringify({
      id: 1,
      method,
      params
    })));
    socket.addEventListener('message', event => {
      const response = JSON.parse(`${event.data}`);
      if (response.id !== 1) {
        return;
      }
      clearTimeout(timeout);
      socket.close();
      if (response.error || response.result?.exceptionDetails) {
        reject(new Error(
          response.error?.message
          || response.result?.exceptionDetails?.text
          || `${method} failed.`
        ));
        return;
      }
      resolve(response);
    });
    socket.addEventListener('error', () => {
      clearTimeout(timeout);
      reject(new Error(`Unable to connect to Chrome DevTools for ${method}.`));
    });
  });
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function processExists(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function waitUntil(predicate, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) {
      return;
    }
    await delay(100);
  }
  throw new Error(`Timed out after ${timeoutMs} ms.`);
}
