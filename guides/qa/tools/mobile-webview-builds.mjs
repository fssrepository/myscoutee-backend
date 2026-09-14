#!/usr/bin/env node
// Routes only the phone's localhost:8080 Host header through two retained builds.
// Uses the existing nginx container; never builds or starts a server.
import { readFileSync, writeFileSync, existsSync, symlinkSync, renameSync, unlinkSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const runtime = path.join(repository, 'server/docker/conf/nginx/app/myscoutee/.qa-mobile-runtime');
const config = path.join(repository, 'server/docker/conf/nginx/conf/http/spring.conf');
const savedConfig = path.join(runtime, 'spring.conf.before');
const command = process.argv[2];
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
    + '    "localhost:8080" /usr/share/nginx/html/.qa-mobile-runtime/active;\n}\n\n'
    + original.replace(token, 'root   $qa_mobile_document_root;');
}
function validateAndReload() {
  execFileSync('docker', ['exec', 'nginx', 'nginx', '-t'], { stdio: 'pipe' });
  execFileSync('docker', ['exec', 'nginx', 'nginx', '-s', 'reload'], { stdio: 'pipe' });
}
if (command === 'status') {
  console.log(JSON.stringify({ old: build('old'), candidate: build('candidate'),
    phoneRouteActive: readFileSync(config, 'utf8').startsWith('# MOBILE-WEBVIEW-LIFECYCLE-001') }, null, 2));
} else if (command === 'serve-old' || command === 'promote') {
  const old = build('old'), candidate = build('candidate');
  if (old.buildId === candidate.buildId) throw Error('Old and candidate must be distinct');
  const original = readFileSync(savedConfig, 'utf8');
  const current = readFileSync(config, 'utf8');
  if (current !== original && current !== patched(original)) throw Error('nginx configuration changed outside this fixture');
  const temporary = path.join(runtime, 'active.next');
  if (existsSync(temporary)) throw Error('Pending promotion already exists');
  symlinkSync(command === 'serve-old' ? 'old' : 'candidate', temporary);
  renameSync(temporary, path.join(runtime, 'active'));
  writeFileSync(config, patched(original));
  try { validateAndReload(); } catch (error) { writeFileSync(config, original); validateAndReload(); throw error; }
  console.log(JSON.stringify({ phase: command, build: command === 'serve-old' ? old : candidate }));
} else if (command === 'restore') {
  const original = readFileSync(savedConfig, 'utf8');
  const current = readFileSync(config, 'utf8');
  if (current !== patched(original) && current !== original) throw Error('nginx configuration changed outside this fixture');
  writeFileSync(config, original); validateAndReload();
  if (existsSync(path.join(runtime, 'active'))) unlinkSync(path.join(runtime, 'active'));
  console.log('Restored the original nginx route; retained build evidence.');
} else throw Error('Usage: mobile-webview-builds.mjs status|serve-old|promote|restore');
