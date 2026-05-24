#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { assertDemoUsers, assertAuthMe, assertAssets, assertChats, assertEventList, assertEventPage } from '../server/lib/contracts.mjs';
import { resetPlaygroundDatabase } from '../server/hooks/playground-db.mjs';
import { discoverCollection, runCase } from '../shared/collection-runner.mjs';
import { createHttpClient } from '../shared/http.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const serverRoot = path.join(repoRoot, 'e2e/server');
const args = parseArgs(process.argv.slice(2));

if (args.list) {
  await listScenarios();
  process.exit(0);
}

const scenario = await loadScenario(args.scenario);
const serverCases = new Map((await discoverCollection(serverRoot)).map(testCase => [testCase.id, testCase]));
const baseUrl = process.env.E2E_STRESS_BASE_URL ?? process.env.E2E_SERVER_BASE_URL ?? scenario.baseUrl ?? 'http://localhost';
const mode = process.env.E2E_STRESS_MODE ?? scenario.mode ?? 'contract';

if ((mode === 'playground' || mode === 'stress') && scenario.resetPlayground !== false && process.env.E2E_SKIP_PLAYGROUND_RESET !== 'true') {
  await resetPlaygroundDatabase(createContext({ baseUrl, mode, runId: 'stress-reset', vu: 0 }));
}

const metrics = [];
const startedAt = performance.now();
await Promise.all(Array.from({ length: scenario.users ?? 1 }, async (_item, index) => {
  const vu = index + 1;
  const rampDelayMs = rampDelay(index, scenario.users ?? 1, scenario.rampUpMs ?? 0);
  await sleep(rampDelayMs);
  await runVirtualUser({ scenario, serverCases, metrics, baseUrl, mode, vu, startedAt });
}));

const summary = summarize(metrics);
printSummary(scenario, summary);
const failed = evaluateThresholds(summary, scenario.thresholds ?? {});
process.exitCode = failed ? 1 : 0;

async function runVirtualUser({ scenario, serverCases, metrics, baseUrl, mode, vu, startedAt }) {
  const durationMs = Number(scenario.durationMs ?? 0);
  const iterations = Number(scenario.iterations ?? 1);
  let iteration = 0;
  while (true) {
    iteration += 1;
    if (durationMs > 0 && performance.now() - startedAt >= durationMs) {
      return;
    }
    if (durationMs <= 0 && iteration > iterations) {
      return;
    }
    for (const [stepIndex, step] of scenario.steps.entries()) {
      const runId = `${scenario.id ?? 'scenario'}-vu${vu}-i${iteration}-s${stepIndex + 1}-${Date.now()}`;
      const ctx = createContext({ baseUrl, mode, runId, vu });
      const started = performance.now();
      let ok = true;
      let status = 0;
      let error = '';
      try {
        const result = await runStep(step, ctx, serverCases);
        status = result?.status ?? 0;
      } catch (err) {
        ok = false;
        status = err.result?.status ?? 0;
        error = err.message;
      }
      const duration = performance.now() - started;
      metrics.push({
        step: step.name ?? step.collectionCase ?? `${step.method ?? 'GET'} ${step.path}`,
        vu,
        iteration,
        ok,
        status,
        durationMs: duration,
        error
      });
      if (!ok && scenario.failFast) {
        return;
      }
      await sleep(jitter(scenario.thinkTimeMs ?? 0, scenario.thinkTimeJitterMs ?? 0));
    }
  }
}

async function runStep(step, ctx, serverCases) {
  if (step.collectionCase) {
    const testCase = serverCases.get(step.collectionCase);
    if (!testCase) {
      throw new Error(`Unknown collection case ${step.collectionCase}`);
    }
    if (testCase.request.playgroundOnly && ctx.mode !== 'playground' && ctx.mode !== 'stress') {
      throw new Error(`${step.collectionCase} requires playground/stress mode`);
    }
    return runCase(testCase, ctx);
  }
  const request = interpolate(step, ctx.vars);
  return ctx.http.request(request.method ?? 'GET', request.path, {
    params: request.params,
    headers: request.headers,
    json: request.body,
    expectedStatus: request.expectedStatus,
    allowStatuses: request.allowStatuses,
    timeoutMs: request.timeoutMs
  });
}

function createContext({ baseUrl, mode, runId, vu }) {
  const ctx = {
    mode,
    http: createHttpClient({
      baseUrl,
      timeoutMs: Number(process.env.E2E_STRESS_HTTP_TIMEOUT_MS ?? process.env.E2E_HTTP_TIMEOUT_MS ?? 15000)
    }),
    defaultMaxMs: Number(process.env.E2E_STRESS_DEFAULT_MAX_MS ?? process.env.E2E_DEFAULT_MAX_MS ?? 5000),
    vars: {
      adminUserId: process.env.E2E_ADMIN_USER_ID ?? 'myscoutee@gmail.com',
      playgroundUserId: `${process.env.E2E_PLAYGROUND_USER_ID ?? 'e2e-host'}-${runId}`,
      playgroundSecondUserId: `${process.env.E2E_PLAYGROUND_SECOND_USER_ID ?? 'e2e-member'}-${runId}`,
      runId,
      vu: String(vu)
    }
  };
  ctx.resolveRequirement = requirement => resolveRequirement(ctx, requirement);
  return ctx;
}

async function resolveRequirement(ctx, requirement) {
  if (requirement === 'demoUser') {
    if (!ctx.vars.userId) {
      const result = await ctx.http.get('/api/auth/demo-users', { headers: demoHeaders() });
      assertDemoUsers(result.data, ctx);
    }
    return;
  }
  if (requirement === 'userProfile') {
    await resolveRequirement(ctx, 'demoUser');
    const result = await ctx.http.get('/api/auth/me', {
      params: { userId: ctx.vars.userId },
      headers: demoHeaders()
    });
    assertAuthMe(result.data, ctx);
    return;
  }
  if (requirement === 'event' || requirement === 'subEvent') {
    await resolveRequirement(ctx, 'demoUser');
    const result = await ctx.http.post('/api/activities/events/explore', {
      headers: demoHeaders(),
      json: { userId: ctx.vars.userId, limit: 25 }
    });
    if (Array.isArray(result.data)) {
      assertEventList(result.data, ctx, 'stress event requirement');
    } else {
      assertEventPage(result.data, ctx, 'stress event requirement');
    }
    if (requirement === 'subEvent' && !ctx.vars.subEventId) {
      throw new Error('No subEvent available for stress requirement');
    }
    return;
  }
  if (requirement === 'asset') {
    await resolveRequirement(ctx, 'demoUser');
    const result = await ctx.http.get('/api/assets', {
      params: { userId: ctx.vars.userId },
      headers: demoHeaders()
    });
    assertAssets(result.data, ctx, 'stress asset requirement');
    return;
  }
  if (requirement === 'chat') {
    await resolveRequirement(ctx, 'demoUser');
    for (const userId of candidateDemoUserIds(ctx)) {
      delete ctx.vars.chatId;
      const result = await ctx.http.get('/api/activities/chats', {
        params: { userId },
        headers: demoHeaders()
      });
      assertChats(result.data, ctx, 'stress chat requirement');
      if (ctx.vars.chatId) {
        ctx.vars.userId = userId;
        return;
      }
    }
    throw new Error('No chat was available for stress chat requirement');
  }
  throw new Error(`Unknown stress requirement: ${requirement}`);
}

function candidateDemoUserIds(ctx) {
  const users = Array.isArray(ctx.vars.demoUsers) ? ctx.vars.demoUsers : [];
  const envPreferred = `${process.env.E2E_DEMO_USER_ID ?? ''}`.trim();
  return [
    envPreferred,
    ctx.vars.userId,
    ...users
      .filter(user => !user.deletedAtIso && user.profileStatus !== 'deleted')
      .map(user => user.id)
  ].map(value => `${value ?? ''}`.trim()).filter((value, index, values) => value && values.indexOf(value) === index);
}

async function loadScenario(name) {
  const scenarioName = name || process.env.E2E_STRESS_SCENARIO || 'server-contract-smoke';
  const scenarioPath = path.join(__dirname, 'scenarios', `${scenarioName}.json`);
  const scenario = JSON.parse(await import('node:fs/promises').then(fs => fs.readFile(scenarioPath, 'utf8')));
  scenario.id ??= scenarioName;
  return scenario;
}

async function listScenarios() {
  const { readdir, readFile } = await import('node:fs/promises');
  const files = (await readdir(path.join(__dirname, 'scenarios'))).filter(file => file.endsWith('.json')).sort();
  for (const file of files) {
    const scenario = JSON.parse(await readFile(path.join(__dirname, 'scenarios', file), 'utf8'));
    console.log(`${file.replace(/\.json$/, '')} [${scenario.mode ?? 'contract'}] users=${scenario.users ?? 1} iterations=${scenario.iterations ?? '-'} durationMs=${scenario.durationMs ?? '-'} - ${scenario.name ?? ''}`);
  }
}

function summarize(metrics) {
  const durations = metrics.map(item => item.durationMs).sort((a, b) => a - b);
  const failed = metrics.filter(item => !item.ok).length;
  const total = metrics.length;
  return {
    total,
    failed,
    passed: total - failed,
    errorRate: total === 0 ? 0 : failed / total,
    minMs: durations[0] ?? 0,
    maxMs: durations[durations.length - 1] ?? 0,
    avgMs: durations.reduce((sum, value) => sum + value, 0) / Math.max(1, durations.length),
    p50Ms: percentile(durations, 0.50),
    p90Ms: percentile(durations, 0.90),
    p95Ms: percentile(durations, 0.95),
    p99Ms: percentile(durations, 0.99),
    byStep: summarizeByStep(metrics)
  };
}

function summarizeByStep(metrics) {
  const groups = new Map();
  for (const item of metrics) {
    const list = groups.get(item.step) ?? [];
    list.push(item);
    groups.set(item.step, list);
  }
  return [...groups.entries()].map(([step, items]) => ({
    step,
    total: items.length,
    failed: items.filter(item => !item.ok).length,
    p95Ms: percentile(items.map(item => item.durationMs).sort((a, b) => a - b), 0.95),
    maxMs: Math.max(...items.map(item => item.durationMs))
  }));
}

function printSummary(scenario, summary) {
  console.log(`\nstress scenario: ${scenario.name ?? scenario.id}`);
  console.log(`requests: ${summary.total}, passed: ${summary.passed}, failed: ${summary.failed}, errorRate: ${(summary.errorRate * 100).toFixed(2)}%`);
  console.log(`latency ms: avg=${Math.round(summary.avgMs)} p50=${Math.round(summary.p50Ms)} p90=${Math.round(summary.p90Ms)} p95=${Math.round(summary.p95Ms)} p99=${Math.round(summary.p99Ms)} max=${Math.round(summary.maxMs)}`);
  for (const item of summary.byStep) {
    console.log(`- ${item.step}: total=${item.total} failed=${item.failed} p95=${Math.round(item.p95Ms)}ms max=${Math.round(item.maxMs)}ms`);
  }
}

function evaluateThresholds(summary, thresholds) {
  let failed = false;
  const checks = [
    ['errorRate', summary.errorRate, thresholds.errorRate],
    ['p95Ms', summary.p95Ms, thresholds.p95Ms],
    ['p99Ms', summary.p99Ms, thresholds.p99Ms],
    ['maxMs', summary.maxMs, thresholds.maxMs]
  ];
  for (const [name, actual, expected] of checks) {
    if (expected === undefined) {
      continue;
    }
    if (actual > Number(expected)) {
      failed = true;
      console.error(`threshold failed: ${name} actual=${actual} expected<=${expected}`);
    }
  }
  return failed;
}

function percentile(values, ratio) {
  if (values.length === 0) {
    return 0;
  }
  const index = Math.min(values.length - 1, Math.ceil(values.length * ratio) - 1);
  return values[index];
}

function rampDelay(index, users, rampUpMs) {
  if (users <= 1 || rampUpMs <= 0) {
    return 0;
  }
  return Math.round((rampUpMs / users) * index);
}

function jitter(baseMs, jitterMs) {
  const base = Number(baseMs) || 0;
  const jitter = Number(jitterMs) || 0;
  return Math.max(0, base + (Math.random() * jitter * 2) - jitter);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
}

function parseArgs(argv) {
  const args = { list: false, scenario: '' };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--list') {
      args.list = true;
    } else if (arg === '--scenario') {
      args.scenario = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--scenario=')) {
      args.scenario = arg.slice('--scenario='.length);
    } else if (!arg.startsWith('-') && !args.scenario) {
      args.scenario = arg;
    }
  }
  return args;
}

function interpolate(value, vars) {
  if (typeof value === 'string') {
    return value.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_match, key) => vars[key] ?? '');
  }
  if (Array.isArray(value)) {
    return value.map(item => interpolate(item, vars));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, interpolate(entry, vars)]));
  }
  return value;
}

function demoHeaders() {
  return { 'X-App-Session-Kind': 'demo' };
}
