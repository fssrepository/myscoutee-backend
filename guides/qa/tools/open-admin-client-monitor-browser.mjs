#!/usr/bin/env node
// Launch the extracted monitor UI through the common managed-session launcher.
// The private loopback control token is read locally and never printed.
import { readFile, writeFile, chmod } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsDirectory = path.dirname(fileURLToPath(import.meta.url));
const qaRoot = process.env.ADMIN_CLIENT_QA_ROOT || '/tmp/myscoutee-admin-client-qa-20260923';
const instance = JSON.parse(await readFile(path.join(qaRoot, 'runtime/myscoutee-admin/instance.json'), 'utf8'));
if (!Number.isInteger(instance.port) || instance.port < 1 || instance.port > 65535 || !instance.control) {
  throw Error('Missing isolated monitor instance');
}
const url = `http://127.0.0.1:${instance.port}/#control=${encodeURIComponent(instance.control)}`;
const config = {
  schemaVersion: 1,
  checkpoints: {
    'ADMIN-CLIENT-MONITOR-001': {
      preserveOtherSessions: true,
      bootstrapEntryConsent: false,
      layout: { columns: 1, appWindows: true },
      sessions: [{ actor: 'Admin monitor', expectedName: 'MyScoutee Admin', sessionKind: 'anonymous',
        entryUrl: url, targetUrl: url, autoDismissExplanationGuide: false,
        window: { x: 1040, y: 70, width: 740, height: 880 } }]
    }
  }
};
const configPath = path.join(qaRoot, 'monitor-browser.private.json');
await writeFile(configPath, JSON.stringify(config), { mode: 0o600 });
await chmod(configPath, 0o600);
const child = spawn(process.execPath, [path.join(toolsDirectory, 'open-checkpoint-browser-sessions.mjs'),
  'ADMIN-CLIENT-MONITOR-001', ...process.argv.slice(2)], {
  stdio: 'inherit', env: { ...process.env, QA_BROWSER_SESSION_CONFIG: configPath }
});
child.on('exit', code => { process.exitCode = code ?? 1; });
