#!/usr/bin/env node
// Routes only the phone's localhost:8080 Host header through two retained builds.
// Uses the existing nginx container; never builds or starts a server.
import { readFileSync, writeFileSync, existsSync, symlinkSync, renameSync, unlinkSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
const runtime = path.join(repository, 'server/docker/.qa-mobile-runtime');
const config = '/etc/nginx/conf.d/spring.conf';
const savedConfig = path.join(runtime, 'spring.dev.conf.before');
const command = process.argv[2];
// Refuse production, E2E and legacy shared-config mounts before any mutation.
function requireDevRuntime() {
  const [container] = JSON.parse(execFileSync('docker', ['inspect', 'nginx'], { encoding: 'utf8' }));
  const files = (container.Config.Labels?.['com.docker.compose.project.config_files'] || '').split(',');
  const mounts = container.Mounts || [];
  if (!container.State.Running || files.length !== 1
      || files[0] !== path.join(repository, 'server/docker-compose-dev.yml')
      || !mounts.some(m => m.Destination === '/etc/nginx/dev-templates' && !m.RW)
      || !mounts.some(m => m.Destination === '/var/lib/myscoutee-qa' && m.Source === runtime && !m.RW)
      || mounts.some(m => config === m.Destination || config.startsWith(m.Destination.replace(/\/$/, '') + '/'))) {
    throw Error('Mobile build routing requires the isolated dev nginx runtime; production/E2E and shared mounts are forbidden');
  }
}
function readConfig() {
  return execFileSync('docker', ['exec', 'nginx', 'cat', config], { encoding: 'utf8' });
}
function writeConfig(value) {
  execFileSync('docker', ['exec', '-i', 'nginx', 'sh', '-c', 'cat > /etc/nginx/conf.d/spring.conf'], { input: value });
}
requireDevRuntime();
const hash = value => createHash('sha256').update(value).digest('hex');
function build(label) {
  const root = path.join(runtime, label);
  const version = JSON.parse(readFileSync(path.join(root, 'app-version.json'), 'utf8'));
  const index = readFileSync(path.join(root, 'index.html'), 'utf8');
  const worker = readFileSync(path.join(root, 'app-sw.js'), 'utf8');
  const precache = JSON.parse(/const PRECACHE_BUILD_URLS = (\[[\s\S]*?\]);/.exec(worker)?.[1] || '[]');
  if (!version.buildId || !index.includes(version.buildId) || !worker.includes(version.buildId)
      || !precache.length || precache.some(name => !existsSync(path.join(root, name)))) {
    throw Error(`${label} is not a complete stamped frontend build`);
  }
  return { label, ...version, indexSha256: hash(index), workerSha256: hash(worker),
    precacheAssets: precache.length, scriptCount: readdirSync(root).filter(n => n.endsWith('.js')).length };
}
function patched(original) {
  const token = 'root   /usr/share/nginx/html;';
  if (!original.includes(token)) throw Error('Unexpected existing nginx root');
  return '# MOBILE-WEBVIEW-LIFECYCLE-001 temporary phone-only build route\n'
    + 'map $http_host $qa_mobile_document_root {\n'
    + '    default /usr/share/nginx/html;\n'
    + '    "localhost:8080" /var/lib/myscoutee-qa/active;\n}\n\n'
    + original.replace(token, 'root   $qa_mobile_document_root;');
}
function validateAndReload() {
  execFileSync('docker', ['exec', 'nginx', 'nginx', '-t'], { stdio: 'pipe' });
  execFileSync('docker', ['exec', 'nginx', 'nginx', '-s', 'reload'], { stdio: 'pipe' });
}
if (command === 'snapshot-dev') {
  const source = process.argv[3] || '';
  if (!/^\/tmp\/myscoutee-frontend-sync\.[^/]+\/dev$/.test(source)) throw Error('Use the existing watcher output directory');
  const label = process.argv[4] || 'lifecycle';
  if (!/^lifecycle(?:-[0-9]+)?$/.test(label)) throw Error('Invalid lifecycle snapshot label');
  const destination = path.join(runtime, label);
  if (existsSync(destination)) throw Error('Retained lifecycle snapshot already exists');
  execFileSync('docker', ['cp', `frontend-sync:${source}`, destination], { stdio: 'pipe' });
  execFileSync('node', [path.join(repository, 'myscoutee-frontend/scripts/stamp-prod-build.js')], {
    env: { ...process.env, FRONTEND_BUILD_OUTPUT_DIR: destination, MYSCOUTEE_UI_BUILD_ID: `mobile-webview-lifecycle-${Date.now()}` },
    stdio: 'pipe'
  });
  console.log(JSON.stringify(build(label)));
} else if (command === 'status') {
  console.log(JSON.stringify({ old: build('old'), candidate: build('candidate'),
    lifecycle: existsSync(path.join(runtime, 'lifecycle')) ? build('lifecycle') : null,
    phoneRouteActive: readConfig().startsWith('# MOBILE-WEBVIEW-LIFECYCLE-001') }, null, 2));
} else if (command === 'serve-old' || command === 'promote' || command === 'serve-lifecycle') {
  const old = build('old'), candidate = build('candidate');
  if (old.buildId === candidate.buildId) throw Error('Old and candidate must be distinct');
  const current = readConfig();
  if (!existsSync(savedConfig)) writeFileSync(savedConfig, current);
  const original = readFileSync(savedConfig, 'utf8');
  if (current !== original && current !== patched(original)) throw Error('nginx configuration changed outside this fixture');
  const temporary = path.join(runtime, 'active.next');
  if (existsSync(temporary)) throw Error('Pending promotion already exists');
  const label = command === 'serve-old' ? 'old' : command === 'serve-lifecycle' ? (process.argv[3] || 'lifecycle') : 'candidate';
  if (!/^(old|candidate|lifecycle(?:-[0-9]+)?)$/.test(label)) throw Error('Invalid build label');
  const selected = build(label);
  symlinkSync(label, temporary);
  renameSync(temporary, path.join(runtime, 'active'));
  writeConfig(patched(original));
  try { validateAndReload(); } catch (error) { writeConfig(original); validateAndReload(); throw error; }
  console.log(JSON.stringify({ phase: command, build: selected }));
} else if (command === 'restore') {
  const original = readFileSync(savedConfig, 'utf8');
  const current = readConfig();
  if (current !== patched(original) && current !== original) throw Error('nginx configuration changed outside this fixture');
  writeConfig(original); validateAndReload();
  if (existsSync(path.join(runtime, 'active'))) unlinkSync(path.join(runtime, 'active'));
  unlinkSync(savedConfig);
  console.log('Restored the original nginx route; retained build evidence.');
} else throw Error('Usage: mobile-webview-builds.mjs status|snapshot-dev <watcher-output>|serve-old|promote|serve-lifecycle|restore');
