#!/usr/bin/env node

import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import {
  readFile,
  rename,
  unlink,
  writeFile
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const holderPath = createRequire(new URL('../../../package.json', import.meta.url)).resolve('@fssrepository/myscoutee-qa/browser/geolocation');

const args = process.argv.slice(2);
const checkpointId = `${args[0] ?? ''}`.trim();
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? `${args[index + 1] ?? ''}`.trim() : '';
};
const actor = option('--actor');
const permission = option('--permission').toLowerCase();
const chromeBinary = process.env.CHROME_BIN || '/opt/google/chrome/chrome';

if (!checkpointId || !actor || !['granted', 'denied', 'prompt'].includes(permission)) {
  throw new Error(
    'Usage: restart-checkpoint-browser-permission.mjs CHECKPOINT_ID '
    + '--actor NAME --permission granted|denied|prompt'
  );
}

const safeCheckpointId = checkpointId.replace(/[^A-Za-z0-9_.-]+/g, '-');
const manifestPath = path.join(
  os.tmpdir(),
  'myscoutee-qa-browser-sessions',
  `${safeCheckpointId}.json`
);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const matches = (manifest.sessions ?? []).filter(session =>
  `${session.actor ?? ''}`.trim().toLowerCase() === actor.toLowerCase()
);
if (matches.length !== 1) {
  throw new Error(`Expected one '${actor}' session, found ${matches.length}.`);
}

const session = matches[0];
const browserPid = Number(session.pid);
const profileDirectory = `${session.userDataDirectory ?? ''}`;
const runtimeRoot = path.join(os.tmpdir(), 'myscoutee-qa-browser-sessions');
if (
  !Number.isInteger(browserPid)
  || browserPid <= 1
  || !profileDirectory.startsWith(`${runtimeRoot}${path.sep}`)
) {
  throw new Error('Managed Chrome ownership metadata is incomplete.');
}

const browserCommandLine = await readFile(`/proc/${browserPid}/cmdline`, 'utf8').catch(() => '');
if (!browserCommandLine.includes(`--user-data-dir=${profileDirectory}`)) {
  throw new Error(`Refusing to stop unowned Chrome PID ${browserPid}.`);
}

const holderPid = Number(session.geolocationHolderPid);
if (Number.isInteger(holderPid) && holderPid > 1 && processExists(holderPid)) {
  const holderCommandLine = await readFile(`/proc/${holderPid}/cmdline`, 'utf8').catch(() => '');
  if (!holderCommandLine.split('\0').includes(holderPath)) {
    throw new Error(`Refusing to stop unowned holder PID ${holderPid}.`);
  }
  process.kill(holderPid, 'SIGTERM');
  await waitUntil(() => !processExists(holderPid), 5000);
}

process.kill(browserPid, 'SIGTERM');
await waitUntil(() => !processExists(browserPid), 10000);

const preferencesPath = path.join(profileDirectory, 'Default', 'Preferences');
const preferences = JSON.parse(await readFile(preferencesPath, 'utf8'));
preferences.profile ??= {};
preferences.profile.exit_type = 'Normal';
preferences.profile.exited_cleanly = true;
preferences.profile.default_content_setting_values ??= {};
if (permission === 'prompt') {
  delete preferences.profile.default_content_setting_values.geolocation;
} else {
  preferences.profile.default_content_setting_values.geolocation = permission === 'granted' ? 1 : 2;
}
preferences.profile.content_settings ??= {};
preferences.profile.content_settings.exceptions ??= {};
preferences.profile.content_settings.exceptions.geolocation = {};
preferences.profile.content_settings.exceptions.geolocation_with_options = {};

const nextPreferencesPath = `${preferencesPath}.qa-next`;
await writeFile(nextPreferencesPath, `${JSON.stringify(preferences)}\n`);
await rename(nextPreferencesPath, preferencesPath);
await unlink(path.join(profileDirectory, 'DevToolsActivePort')).catch(error => {
  if (error?.code !== 'ENOENT') {
    throw error;
  }
});

const position = session.position ?? {};
const browser = spawn(chromeBinary, [
  `--user-data-dir=${profileDirectory}`,
  '--remote-debugging-port=0',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-session-crashed-bubble',
  '--hide-crash-restore-bubble',
  '--ignore-certificate-errors',
  '--ozone-platform=x11',
  `--window-position=${Number(position.x ?? 0)},${Number(position.y ?? 0)}`,
  `--window-size=${Number(position.width ?? 640)},${Number(position.height ?? 1000)}`,
  'about:blank'
], {
  detached: true,
  stdio: 'ignore'
});
browser.unref();

const devToolsPortPath = path.join(profileDirectory, 'DevToolsActivePort');
let devToolsPort = 0;
await waitUntil(async () => {
  try {
    const raw = await readFile(devToolsPortPath, 'utf8');
    devToolsPort = Number.parseInt(raw.split(/\r?\n/, 1)[0], 10);
    return Number.isInteger(devToolsPort) && devToolsPort > 0;
  } catch {
    return false;
  }
}, 20000);

session.pid = browser.pid;
session.devToolsPort = devToolsPort;
session.geolocationHolderPid = null;
session.geolocationPermission = permission;
session.activeGeolocationPermission = null;
session.permissionProfileRestartedAtIso = new Date().toISOString();
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

process.stdout.write(`${JSON.stringify({
  checkpointId,
  actor: session.actor,
  permission,
  pid: browser.pid,
  devToolsPort,
  userDataDirectory: profileDirectory
}, null, 2)}\n`);

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
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out after ${timeoutMs} ms.`);
}
