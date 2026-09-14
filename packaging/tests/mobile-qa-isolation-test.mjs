#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fixture = mkdtempSync(path.join(tmpdir(), 'myscoutee-qa-isolation-'));
const read = name => readFileSync(path.join(root, name), 'utf8');
try {
  // Exercise the real launcher's gate with container metadata, without Docker mutation.
  writeFileSync(path.join(fixture, 'docker'), `#!${process.execPath}\n
const fs = require('node:fs');
fs.appendFileSync(process.env.QA_TEST_CALLS, JSON.stringify(process.argv.slice(2)) + '\\n');
if (process.argv[2] !== 'inspect') process.exit(91);
process.stdout.write(process.env.QA_TEST_CONTAINER);
`, { mode: 0o755 });
  const dev = {
    State: { Running: true },
    Config: { Labels: { 'com.docker.compose.project.config_files': path.join(root, 'server/docker-compose-dev.yml') } },
    Mounts: [
      { Destination: '/etc/nginx/dev-templates', RW: false },
      { Destination: '/var/lib/myscoutee-qa', Source: path.join(root, 'server/docker/.qa-mobile-runtime'), RW: false }
    ]
  };
  const cases = [
    ['dev', dev, true],
    ['production', { ...dev, Config: { Labels: { 'com.docker.compose.project.config_files': path.join(root, 'server/docker-compose-prod.yml') } } }, false],
    ['e2e', { ...dev, Config: { Labels: { 'com.docker.compose.project.config_files': path.join(root, 'server/docker-compose.e2e.yml') } } }, false],
    ['shared config directory', { ...dev, Mounts: [...dev.Mounts, { Destination: '/etc/nginx/conf.d', RW: true }] }, false],
    ['shared config file', { ...dev, Mounts: [...dev.Mounts, { Destination: '/etc/nginx/conf.d/spring.conf', RW: true }] }, false],
    ['missing QA mount', { ...dev, Mounts: dev.Mounts.slice(0, 1) }, false],
    ['stopped', { ...dev, State: { Running: false } }, false]
  ];
  for (const [name, metadata, allowed] of cases) {
    const calls = path.join(fixture, 'calls');
    writeFileSync(calls, '');
    const result = spawnSync(process.execPath, [path.join(root, 'guides/qa/tools/mobile-webview-builds.mjs'), 'invalid-test-command'], {
      encoding: 'utf8', env: { ...process.env, PATH: `${fixture}:${process.env.PATH}`, QA_TEST_CALLS: calls, QA_TEST_CONTAINER: JSON.stringify([metadata]) }
    });
    assert.equal(result.status, 1, name);
    assert.match(result.stderr, allowed ? /Usage: mobile-webview-builds/ : /requires the isolated dev nginx runtime/, name);
    assert.deepEqual(readFileSync(calls, 'utf8').trim().split('\n').map(JSON.parse), [['inspect', 'nginx']], name);
  }
  for (const file of ['server/docker/conf/nginx/conf/http/spring.conf', 'server/docker/conf/nginx/nginx.conf',
    'server/docker/images/nginx/prod/Dockerfile', 'server/docker-compose-prod.yml', 'packaging/compose/docker-compose.production.yml']) {
    assert.doesNotMatch(read(file), /qa_mobile|qa-mobile|MOBILE-WEBVIEW|dev-templates/, file);
  }
  for (const [file, entry] of [['server/.dockerignore', 'docker/.qa-mobile-runtime/'],
    ['server/docker/.dockerignore', '.qa-mobile-runtime/']]) assert.ok(read(file).split('\n').includes(entry), file);
  // Run the package script's actual selection expression; no package/build process.
  const selection = read('packaging/release/package-production.sh').match(/find "\$\{SERVER_DIR\}\/docker\/scripts"[\s\S]*?\| sort/)[0];
  const selected = spawnSync('bash', ['-c', selection], { encoding: 'utf8', env: { ...process.env, SERVER_DIR: path.join(root, 'server') } });
  assert.equal(selected.status, 0);
  assert.doesNotMatch(selected.stdout, /manual-qa-checkpoints|admin-job-fixtures|start_profilemanagement_dev|frontend_auto_watch/);
  assert.match(selected.stdout, /bootstrap_mongodb_seed\.sh/);
  console.log('PASS: 7 dev runtime gate cases; production config, build-context and package helper isolation.');
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
