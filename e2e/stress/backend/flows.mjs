#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createHttpClient } from '../../shared/http.mjs';
import { parseCommonArgs, runCollection } from '../../shared/collection-runner.mjs';
import { resetE2eDatabase } from '../../functional/backend/hooks/e2e-db.mjs';
import { assertChats, assertDemoUsers } from '../../functional/backend/lib/contracts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..', '..');
const functionalBackendRoot = path.join(repoRoot, 'e2e', 'functional', 'backend');
const baseUrl = process.env.E2E_SERVER_BASE_URL ?? 'http://localhost';
const loops = Math.max(1, Number(process.env.E2E_STRESS_LOOPS ?? 3));
const concurrency = Math.max(1, Number(process.env.E2E_STRESS_CONCURRENCY ?? 1));
const args = {
  ...parseCommonArgs(process.argv.slice(2)),
  includeMutations: true,
  group: parseCommonArgs(process.argv.slice(2)).group || 'flows'
};

const rootCtx = createCtx('stress-root');
if (args.listOnly) {
  await runCollection({
    rootDir: functionalBackendRoot,
    ctx: rootCtx,
    ...args,
    record: false,
    artifactsDir: path.join(repoRoot, '.e2e-artifacts', 'stress', 'backend-flows')
  });
  process.exit(0);
}
if (!args.listOnly && shouldResetE2eDatabase()) {
  await resetE2eDatabase(rootCtx);
}

function shouldResetE2eDatabase() {
  return process.env.E2E_SKIP_E2E_RESET !== 'true';
}

let failed = 0;
let completed = 0;
const workers = Array.from({ length: concurrency }, async (_item, workerIndex) => {
  while (completed < loops) {
    const iteration = completed + 1;
    completed += 1;
    const ctx = createCtx(`stress-w${workerIndex + 1}-i${iteration}-${Date.now()}`);
    const summary = await runCollection({
      rootDir: functionalBackendRoot,
      ctx,
      ...args,
      record: false,
      artifactsDir: path.join(repoRoot, '.e2e-artifacts', 'stress', 'backend-flows')
    });
    failed += summary.failed;
    console.log(`stress iteration ${iteration}/${loops}: ${summary.passed} passed, ${summary.failed} failed`);
  }
});

await Promise.all(workers);
process.exitCode = failed > 0 ? 1 : 0;

function createCtx(runId) {
  const ctx = {
    mode: 'stress',
    http: createHttpClient({
      baseUrl,
      timeoutMs: Number(process.env.E2E_HTTP_TIMEOUT_MS ?? 15000)
    }),
    vars: {
      adminUserId: process.env.E2E_ADMIN_USER_ID ?? 'myscoutee@gmail.com',
      e2eUserId: `${process.env.E2E_USER_ID ?? 'e2e-host'}-${runId}`,
      e2eSecondUserId: `${process.env.E2E_SECOND_USER_ID ?? 'e2e-member'}-${runId}`,
      runId
    },
    defaultMaxMs: Number(process.env.E2E_DEFAULT_MAX_MS ?? 2500)
  };
  ctx.resolveRequirement = requirement => resolveFlowRequirement(ctx, requirement);
  return ctx;
}

async function resolveFlowRequirement(ctx, requirement) {
  if (requirement !== 'chat') {
    throw new Error(`Unsupported stress flow requirement: ${requirement}`);
  }
  if (!Array.isArray(ctx.vars.demoUsers)) {
    const demoUsers = await ctx.http.get('/api/auth/demo-users', {
      params: { limit: 64 },
      headers: demoHeaders()
    });
    assertDemoUsers(demoUsers.data, ctx);
  }
  const candidateIds = [
    ctx.vars.userId,
    ...(ctx.vars.demoUsers ?? [])
      .filter(user => !user.deletedAtIso && user.profileStatus !== 'deleted')
      .map(user => user.id)
  ].map(value => `${value ?? ''}`.trim()).filter((value, index, values) => value && values.indexOf(value) === index);
  for (const userId of candidateIds) {
    delete ctx.vars.chatId;
    const chats = await ctx.http.get('/api/activities/chats', {
      params: { userId },
      headers: demoHeaders()
    });
    assertChats(chats.data, ctx, 'stress flow chat requirement');
    if (ctx.vars.chatId) {
      ctx.vars.userId = userId;
      return;
    }
  }
  throw new Error('No chat was available for stress flow chat requirement');
}

function demoHeaders() {
  return { 'X-App-Session-Kind': 'demo' };
}
