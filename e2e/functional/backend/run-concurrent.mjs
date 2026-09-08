#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { resetE2eDatabase } from './hooks/e2e-db.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const runScript = path.join(__dirname, 'run.mjs');
const baseEnv = {
  ...process.env,
  E2E_SERVER_MODE: 'e2e',
  E2E_SKIP_E2E_RESET: 'true'
};
const forwardedArgs = process.argv.slice(2).filter(arg => arg !== '--include-mutations');

await resetE2eDatabase({ vars: {} });

const results = await Promise.all([
  runChild('backend-safe', forwardedArgs),
  runChild('backend-mutations', [...forwardedArgs, '--include-mutations'])
]);

const failed = results.filter(result => result.code !== 0);
if (failed.length > 0) {
  console.error(`\nbackend concurrent e2e: ${failed.length} runner(s) failed`);
  process.exitCode = 1;
} else {
  console.log('\nbackend concurrent e2e: all runners passed');
}

function runChild(label, args) {
  return new Promise(resolve => {
    const child = spawn(process.execPath, [runScript, ...args], {
      cwd: path.resolve(__dirname, '../../..'),
      env: {
        ...baseEnv,
        E2E_RUN_ID: `${process.env.E2E_RUN_ID ?? `run-${Date.now()}`}-${label}`
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    child.stdout.on('data', chunk => writePrefixed(process.stdout, label, chunk));
    child.stderr.on('data', chunk => writePrefixed(process.stderr, label, chunk));
    child.on('close', code => resolve({ label, code: code ?? 1 }));
  });
}

function writePrefixed(stream, label, chunk) {
  const text = chunk.toString();
  for (const line of text.split(/\r?\n/)) {
    if (line.length > 0) {
      stream.write(`[${label}] ${line}\n`);
    }
  }
}
