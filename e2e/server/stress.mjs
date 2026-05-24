#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createHttpClient } from '../shared/http.mjs';
import { parseCommonArgs, runCollection } from '../shared/collection-runner.mjs';
import { resetPlaygroundDatabase } from './hooks/playground-db.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = process.env.E2E_SERVER_BASE_URL ?? 'http://localhost';
const loops = Math.max(1, Number(process.env.E2E_STRESS_LOOPS ?? 3));
const concurrency = Math.max(1, Number(process.env.E2E_STRESS_CONCURRENCY ?? 1));
const args = {
  ...parseCommonArgs(process.argv.slice(2)),
  includeMutations: true,
  group: parseCommonArgs(process.argv.slice(2)).group || 'flows'
};

const rootCtx = createCtx('stress-root');
if (process.env.E2E_SKIP_PLAYGROUND_RESET !== 'true') {
  await resetPlaygroundDatabase(rootCtx);
}

let failed = 0;
let completed = 0;
const workers = Array.from({ length: concurrency }, async (_item, workerIndex) => {
  while (completed < loops) {
    const iteration = completed + 1;
    completed += 1;
    const ctx = createCtx(`stress-w${workerIndex + 1}-i${iteration}-${Date.now()}`);
    const summary = await runCollection({
      rootDir: __dirname,
      ctx,
      ...args,
      record: false,
      artifactsDir: path.join(__dirname, '..', '..', '.e2e-artifacts', 'server-stress')
    });
    failed += summary.failed;
    console.log(`stress iteration ${iteration}/${loops}: ${summary.passed} passed, ${summary.failed} failed`);
  }
});

await Promise.all(workers);
process.exitCode = failed > 0 ? 1 : 0;

function createCtx(runId) {
  return {
    mode: 'stress',
    http: createHttpClient({
      baseUrl,
      timeoutMs: Number(process.env.E2E_HTTP_TIMEOUT_MS ?? 15000)
    }),
    vars: {
      adminUserId: process.env.E2E_ADMIN_USER_ID ?? 'myscoutee@gmail.com',
      playgroundUserId: `${process.env.E2E_PLAYGROUND_USER_ID ?? 'e2e-host'}-${runId}`,
      playgroundSecondUserId: `${process.env.E2E_PLAYGROUND_SECOND_USER_ID ?? 'e2e-member'}-${runId}`,
      runId
    },
    defaultMaxMs: Number(process.env.E2E_DEFAULT_MAX_MS ?? 2500),
    resolveRequirement: async () => {
      throw new Error('stress flow cases should seed their own playground data');
    }
  };
}
