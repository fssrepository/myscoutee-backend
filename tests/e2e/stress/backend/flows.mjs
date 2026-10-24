#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createHttpClient } from '@fssrepository/myscoutee-e2e/shared/http.mjs';
import {
  discoverCollection,
  parseCommonArgs,
  qaBranchIds,
  runCollection
} from '@fssrepository/myscoutee-e2e/shared/collection-runner.mjs';
import { resetE2eDatabase } from '../../functional/backend/hooks/e2e-db.mjs';
import { assertChats, assertDemoUsers } from '../../functional/backend/lib/contracts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');
const functionalBackendRoot = path.join(repoRoot, 'tests/e2e', 'functional', 'backend');
const baseUrl = process.env.E2E_SERVER_BASE_URL ?? 'https://127.0.0.1';
const loops = Math.max(1, Number(process.env.E2E_STRESS_LOOPS ?? 3));
const concurrency = Math.max(1, Number(process.env.E2E_STRESS_CONCURRENCY ?? 1));
const commonArgs = parseCommonArgs(process.argv.slice(2));
const args = {
  ...commonArgs,
  includeMutations: true,
  group: commonArgs.group || 'flows'
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

const selectedFlowCases = (await discoverCollection(functionalBackendRoot))
  .filter(testCase => matchesRequestedFlow(testCase, args));
const globalFlowCaseIds = selectedFlowCases
  .filter(testCase => testCase.id.startsWith('flows/operator/'))
  .map(testCase => testCase.id);
const repeatableFlowCaseIds = selectedFlowCases
  .filter(testCase => !testCase.id.startsWith('flows/operator/'))
  .map(testCase => testCase.id);

let failed = 0;
if (globalFlowCaseIds.length > 0) {
  const globalSummary = await runFlowCases(rootCtx, globalFlowCaseIds);
  failed += globalSummary.failed;
  console.log(
    `stress global operator flows: ${globalSummary.passed} passed, `
    + `${globalSummary.failed} failed, ${globalSummary.skipped} skipped`
  );
}

let completed = 0;
const workers = Array.from({ length: concurrency }, async (_item, workerIndex) => {
  while (completed < loops) {
    const iteration = completed + 1;
    completed += 1;
    const ctx = createCtx(`stress-w${workerIndex + 1}-i${iteration}-${Date.now()}`);
    const summary = await runFlowCases(ctx, repeatableFlowCaseIds);
    failed += summary.failed;
    console.log(
      `stress iteration ${iteration}/${loops}: ${summary.passed} passed, `
      + `${summary.failed} failed, ${summary.skipped} skipped`
    );
  }
});

await Promise.all(workers);
process.exitCode = failed > 0 ? 1 : 0;

async function runFlowCases(ctx, caseIds) {
  const summary = { passed: 0, failed: 0, skipped: 0, total: 0 };
  for (const caseId of caseIds) {
    const caseSummary = await runCollection({
      rootDir: functionalBackendRoot,
      ctx,
      ...args,
      filter: caseId,
      group: '',
      record: false,
      artifactsDir: path.join(repoRoot, '.e2e-artifacts', 'stress', 'backend-flows')
    });
    summary.passed += caseSummary.passed;
    summary.failed += caseSummary.failed;
    summary.skipped += caseSummary.skipped;
    summary.total += caseSummary.total;
  }
  return summary;
}

function matchesRequestedFlow(testCase, options) {
  if (testCase.request.mutation !== true) {
    return false;
  }
  if (
    options.group
    && testCase.request.group !== options.group
    && !testCase.id.startsWith(`${options.group}/`)
  ) {
    return false;
  }
  if (!options.filter) {
    return !options.qaCase || qaBranchIds(testCase.request).includes(options.qaCase);
  }
  const normalizedFilter = options.filter.toLowerCase();
  return (!options.qaCase || qaBranchIds(testCase.request).includes(options.qaCase)) && (testCase.id.includes(options.filter)
    || `${testCase.request.name ?? ''}`.toLowerCase().includes(normalizedFilter)
    || (testCase.request.tags ?? []).some(tag => `${tag}`.includes(options.filter)));
}

function createCtx(runId) {
  const ctx = {
    mode: 'stress',
    http: createHttpClient({
      baseUrl,
      timeoutMs: Number(process.env.E2E_HTTP_TIMEOUT_MS ?? 15000)
    }),
    vars: {
      adminUserId: process.env.E2E_ADMIN_USER_ID ?? 'admin-demo-ava',
      operatorUserId: process.env.E2E_OPERATOR_USER_ID ?? 'operator@myscoutee.local',
      nonOperatorUserId: process.env.E2E_NON_OPERATOR_USER_ID ?? 'bf057de7c586eede7e84bdc7',
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
