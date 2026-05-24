#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { assert, expectDuration } from '../shared/assertions.mjs';
import { discoverCollection, parseCommonArgs } from '../shared/collection-runner.mjs';
import { launchChromeBrowser } from './lib/chrome-cdp.mjs';
import { assertBrowserExpectations, performDemoLogin } from './lib/ui-contracts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = parseCommonArgs(process.argv.slice(2));
const baseUrl = process.env.E2E_UI_BASE_URL ?? 'http://localhost';
const artifactsDir = path.join(__dirname, '..', '..', '.e2e-artifacts', 'ui');

const ctx = {
  mode: process.env.E2E_UI_MODE ?? 'full',
  baseUrl,
  vars: {},
  defaultMaxMs: Number(process.env.E2E_UI_DEFAULT_MAX_MS ?? 20000),
  viewport: {
    width: Number(process.env.E2E_UI_VIEWPORT_WIDTH ?? 1440),
    height: Number(process.env.E2E_UI_VIEWPORT_HEIGHT ?? 950)
  }
};
const DEFAULT_UI_USER_ID = 'bf057de7c586eede7e84bdc7';

const summary = await runUiCollection({
  rootDir: __dirname,
  ctx,
  ...args,
  artifactsDir
});

console.log(`\nui e2e: ${summary.passed} passed, ${summary.failed} failed, ${summary.skipped} skipped, ${summary.total} selected`);
process.exitCode = summary.failed > 0 ? 1 : 0;

async function runUiCollection(options) {
  const cases = await discoverCollection(options.rootDir);
  const selected = cases.filter(testCase => matchesFilter(testCase, options));
  for (const testCase of selected) {
    testCase.response = await readJsonOptional(testCase.dir, 'response.json');
  }
  if (options.listOnly) {
    for (const testCase of selected) {
      console.log(`${testCase.id} ${testCase.request.name ?? ''}`.trim());
    }
    return { passed: 0, failed: 0, skipped: 0, total: selected.length };
  }

  const browser = await launchChromeBrowser({
    baseUrl: options.ctx.baseUrl,
    viewport: options.ctx.viewport
  });
  const summary = { passed: 0, failed: 0, skipped: 0, total: selected.length, results: [] };
  try {
    if (selected.some(testCase => testCase.request.suiteDemoLogin === true)) {
      const setupTestCase = {
        id: '_suite/demo-login',
        request: {
          name: 'suite demo login setup',
          group: 'suite',
          route: '/',
          script: 'performDemoLogin',
          fullStackOnly: true
        },
        response: {
          urlPath: '/game',
          selectors: ['app-entry-shell', '.demo-login-overlay', '.game-page'],
          network: ['/api/auth/eligibility', '/api/auth/demo-users', '/api/auth/me']
        }
      };
      const setupPage = await browser.newPage({ viewport: options.ctx.viewport });
      try {
        if (options.record) {
          attachStepRecorder(setupPage, options.artifactsDir, setupTestCase);
        }
        const setupStarted = performance.now();
        options.ctx.suiteDemoStorage = await performDemoLogin(setupPage, {
          geolocation: defaultGeolocation(),
          userId: process.env.E2E_UI_USER_ID ?? DEFAULT_UI_USER_ID,
          timeoutMs: Number(process.env.E2E_UI_LOGIN_MAX_MS ?? 60000)
        });
        await setupPage.resetPermissions();
        if (options.record) {
          await recordUiCase(options.artifactsDir, setupTestCase, setupPage, {
            status: 'browser',
            durationMs: performance.now() - setupStarted,
            url: await setupPage.evaluate(() => window.location.href)
          });
          summary.results.push(resultSummaryFor(setupTestCase, {
            status: 'passed',
            durationMs: performance.now() - setupStarted,
            steps: setupPage.recordedSteps ?? [],
            record: options.record,
            artifactsDir: options.artifactsDir
          }));
        }
        console.log('- PASS suite demo login browser setup');
      } finally {
        await setupPage.close();
      }
    }
    for (const testCase of selected) {
      const label = `${testCase.id} ${testCase.request.name ?? ''}`.trim();
      let page = null;
      try {
        const skipReason = skipReasonFor(testCase, options.ctx);
        if (skipReason) {
          summary.skipped += 1;
          summary.results.push(resultSummaryFor(testCase, {
            status: 'skipped',
            skipReason,
            record: options.record,
            artifactsDir: options.artifactsDir
          }));
          console.log(`- SKIP ${label} (${skipReason})`);
          continue;
        }
        page = await browser.newPage({ viewport: testCase.request.viewport ?? options.ctx.viewport });
        if (options.record) {
          attachStepRecorder(page, options.artifactsDir, testCase);
        }
        const result = await runUiCase({ page, testCase, ctx: options.ctx, record: options.record, artifactsDir: options.artifactsDir });
        summary.passed += 1;
        summary.results.push(resultSummaryFor(testCase, {
          status: 'passed',
          durationMs: result.durationMs,
          steps: page.recordedSteps ?? [],
          record: options.record,
          artifactsDir: options.artifactsDir
        }));
        console.log(`- PASS ${label} browser ${Math.round(result.durationMs)}ms`);
      } catch (error) {
        summary.failed += 1;
        console.error(`- FAIL ${label}`);
        console.error(`  ${error.message}`);
        if (error.details) {
          console.error(`  details: ${JSON.stringify(error.details).slice(0, 1200)}`);
        }
        if (page && options.record) {
          await recordUiCase(options.artifactsDir, testCase, page, { error: error.message });
        }
        summary.results.push(resultSummaryFor(testCase, {
          status: 'failed',
          error: error.message,
          steps: page?.recordedSteps ?? [],
          record: options.record,
          artifactsDir: options.artifactsDir
        }));
        if (options.failFast) {
          break;
        }
      } finally {
        await page?.close();
      }
    }
  } finally {
    await browser.close();
  }
  if (options.record) {
    await writeUiArtifactIndex(options.artifactsDir, summary, options.ctx);
  }
  return summary;
}

async function runUiCase({ page, testCase, ctx, record, artifactsDir }) {
  const started = performance.now();
  const expected = await readJsonOptional(testCase.dir, 'response.json');
  const scriptName = testCase.request.script ?? 'assert.mjs';
  const script = await import(pathToFileURL(path.join(testCase.dir, scriptName)).href);
  const request = materializeRequest(testCase.request, ctx);
  if (request.geolocation) {
    await page.setGeolocation(request.geolocation);
  }
  const storage = {
    localStorage: {
      ...(request.suiteDemoLogin ? ctx.suiteDemoStorage?.localStorage ?? {} : {}),
      ...(request.localStorage ?? request.storage ?? {})
    },
    sessionStorage: request.sessionStorage ?? {}
  };
  if (request.suiteDemoLogin) {
    assert(ctx.suiteDemoStorage?.localStorage?.['app-session'], 'suiteDemoLogin requires a completed suite demo login');
  }

  await page.primeOrigin(storage);
  await page.navigate(request.route ?? request.path ?? '/', {
    loadTimeoutMs: request.loadTimeoutMs ?? ctx.defaultMaxMs
  });
  await page.recordStep('01-route-loaded');
  if (expected?.urlPath) {
    await page.waitForUrlPath(expected.urlPath, request.waitTimeoutMs ?? ctx.defaultMaxMs);
  }
  await assertBrowserExpectations(page, expected?.initial ?? {});
  if (script?.assertUi) {
    await script.assertUi({ page, ctx, request, expected, testCase });
  }
  await assertBrowserExpectations(page, expected ?? {});
  const durationMs = performance.now() - started;
  const result = {
    status: 'browser',
    durationMs,
    url: await page.evaluate(() => window.location.href),
    network: page.network,
    failedNetwork: page.failedNetwork,
    pageErrors: page.pageErrors
  };
  expectDuration(result, Number(request.maxMs ?? expected?.maxMs ?? ctx.defaultMaxMs), testCase.id);
  if (record) {
    await recordUiCase(artifactsDir, testCase, page, result);
  }
  return result;
}

function materializeRequest(request, ctx) {
  const userId = process.env.E2E_UI_USER_ID ?? DEFAULT_UI_USER_ID;
  const adminUserId = process.env.E2E_UI_ADMIN_USER_ID ?? process.env.E2E_ADMIN_USER_ID ?? 'admin-demo-ava';
  const vars = {
    ...ctx.vars,
    userId,
    adminUserId,
    appSession: JSON.stringify({ kind: 'demo', userId }),
    adminAppSession: JSON.stringify({ kind: 'demo', userId: adminUserId }),
    adminSession: JSON.stringify({ adminUserId })
  };
  return interpolate(request, vars);
}

function defaultGeolocation() {
  return {
    latitude: Number(process.env.E2E_UI_GEO_LATITUDE ?? 47.5004928),
    longitude: Number(process.env.E2E_UI_GEO_LONGITUDE ?? 19.0742528),
    accuracy: Number(process.env.E2E_UI_GEO_ACCURACY ?? 20),
    grant: false
  };
}

function interpolate(value, vars) {
  if (typeof value === 'string') {
    return value.replace(/\{\{([^}]+)}}/g, (_match, key) => `${vars[key.trim()] ?? ''}`);
  }
  if (Array.isArray(value)) {
    return value.map(item => interpolate(item, vars));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, interpolate(item, vars)]));
  }
  return value;
}

function matchesFilter(testCase, options) {
  const request = testCase.request;
  if (request.mutation && !options.includeMutations) {
    return false;
  }
  if (options.group && request.group !== options.group && !testCase.id.startsWith(`${options.group}/`)) {
    return false;
  }
  if (!options.filter) {
    return true;
  }
  const needle = options.filter.toLowerCase();
  return testCase.id.toLowerCase().includes(needle)
    || `${request.name ?? ''}`.toLowerCase().includes(needle)
    || (request.tags ?? []).some(tag => `${tag}`.toLowerCase().includes(needle));
}

function skipReasonFor(testCase, ctx) {
  if (testCase.request.skip) {
    return testCase.request.skip === true ? 'marked skipped' : testCase.request.skip;
  }
  if (testCase.request.fullStackOnly && ctx.baseUrl.includes(':4200')) {
    return 'requires nginx/backend full stack on port 80';
  }
  return '';
}

async function readJsonOptional(dir, filename) {
  try {
    return JSON.parse(await readFile(path.join(dir, filename), 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

async function recordUiCase(artifactsDir, testCase, page, result) {
  const caseDir = path.join(artifactsDir, testCase.id);
  await mkdir(caseDir, { recursive: true });
  const screenshot = await page.screenshot().catch(() => null);
  if (screenshot) {
    await writeFile(path.join(caseDir, 'screenshot.png'), screenshot);
  }
  await writeFile(path.join(caseDir, 'result.json'), JSON.stringify({
    ...result,
    network: page.network,
    failedNetwork: page.failedNetwork,
    consoleMessages: page.consoleMessages,
    pageErrors: page.pageErrors
  }, null, 2));
}

function attachStepRecorder(page, artifactsDir, testCase) {
  let index = 0;
  page.recordedSteps = [];
  page.stepRecorder = async (name, currentPage) => {
    index += 1;
    const normalizedName = slugifyStepName(name || `step-${index}`);
    const filename = `${String(index).padStart(2, '0')}-${normalizedName}.png`;
    const caseDir = path.join(artifactsDir, testCase.id, 'steps');
    await mkdir(caseDir, { recursive: true });
    const screenshot = await currentPage.screenshot();
    await writeFile(path.join(caseDir, filename), screenshot);
    const relativePath = `.e2e-artifacts/ui/${testCase.id}/steps/${filename}`;
    page.recordedSteps.push({
      name,
      path: relativePath
    });
    return relativePath;
  };
}

function resultSummaryFor(testCase, result = {}) {
  const artifactPath = `.e2e-artifacts/ui/${testCase.id}`;
  const response = testCase.response ?? {};
  return {
    id: testCase.id,
    name: testCase.request.name ?? testCase.id,
    group: testCase.request.group ?? testCase.id.split('/')[0],
    route: testCase.request.route ?? testCase.request.path ?? '/',
    status: result.status,
    durationMs: result.durationMs ?? null,
    error: result.error ?? null,
    skipReason: result.skipReason ?? null,
    fullStackOnly: testCase.request.fullStackOnly === true,
    suiteDemoLogin: testCase.request.suiteDemoLogin === true,
    script: testCase.request.script ?? 'assert.mjs',
    screenshot: result.record ? `${artifactPath}/screenshot.png` : null,
    resultJson: result.record ? `${artifactPath}/result.json` : null,
    steps: result.steps ?? [],
    expected: collectBrowserExpectations(response)
  };
}

function collectBrowserExpectations(response = {}) {
  return {
    urlPath: response.urlPath ?? null,
    selectors: [
      ...new Set([
        ...(response.initial?.selectors ?? []),
        ...(response.selectors ?? [])
      ])
    ],
    text: [
      ...new Set([
        ...(response.initial?.text ?? []),
        ...(response.text ?? [])
      ])
    ],
    network: [
      ...new Set([
        ...(response.initial?.network ?? []),
        ...(response.network ?? [])
      ])
    ]
  };
}

async function writeUiArtifactIndex(artifactsDir, summary, ctx) {
  await mkdir(artifactsDir, { recursive: true });
  const generatedAt = new Date().toISOString();
  const json = {
    generatedAt,
    baseUrl: ctx.baseUrl,
    summary: {
      passed: summary.passed,
      failed: summary.failed,
      skipped: summary.skipped,
      total: summary.total
    },
    results: summary.results
  };
  await writeFile(path.join(artifactsDir, 'index.json'), JSON.stringify(json, null, 2));
  await writeFile(path.join(artifactsDir, 'index.md'), renderUiArtifactIndex(json));
}

function renderUiArtifactIndex(report) {
  const lines = [
    '# UI E2E Artifact Index',
    '',
    `Generated: ${report.generatedAt}`,
    `Base URL: ${report.baseUrl}`,
    `Summary: ${report.summary.passed} passed, ${report.summary.failed} failed, ${report.summary.skipped} skipped, ${report.summary.total} selected`,
    ''
  ];

  for (const result of report.results) {
    lines.push(`## ${statusLabel(result.status)} ${result.id}`);
    lines.push('');
    lines.push(`Name: ${result.name}`);
    lines.push(`Route: \`${result.route}\``);
    lines.push(`Group: \`${result.group}\``);
    if (result.fullStackOnly) {
      lines.push('Mode: full stack on nginx/backend, not Angular dev server');
    }
    if (result.suiteDemoLogin) {
      lines.push('Session: reuses the suite demo-login browser session');
    }
    if (result.durationMs !== null) {
      lines.push(`Duration: ${Math.round(result.durationMs)}ms`);
    }
    if (result.error) {
      lines.push(`Error: ${result.error}`);
    }
    if (result.skipReason) {
      lines.push(`Skipped: ${result.skipReason}`);
    }
    lines.push(`Script: \`${result.script}\``);
    if (result.screenshot) {
      lines.push(`Screenshot: [open](${relativeArtifactLink(result.screenshot)})`);
    }
    if (result.steps.length > 0) {
      lines.push('Step screenshots:');
      for (const step of result.steps) {
        lines.push(`- ${step.name}: [open](${relativeArtifactLink(step.path)})`);
      }
    }
    if (result.resultJson) {
      lines.push(`Network/result: [open](${relativeArtifactLink(result.resultJson)})`);
    }
    appendExpectationLines(lines, result.expected);
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

function appendExpectationLines(lines, expected) {
  const selectors = expected.selectors ?? [];
  const text = expected.text ?? [];
  const network = expected.network ?? [];
  if (expected.urlPath) {
    lines.push(`Expected path: \`${expected.urlPath}\``);
  }
  if (selectors.length > 0) {
    lines.push(`Expected selectors: ${selectors.map(item => `\`${item}\``).join(', ')}`);
  }
  if (text.length > 0) {
    lines.push(`Expected text: ${text.map(item => `\`${item}\``).join(', ')}`);
  }
  if (network.length > 0) {
    lines.push(`Expected backend calls: ${network.map(item => `\`${item}\``).join(', ')}`);
  }
}

function relativeArtifactLink(artifactPath) {
  return artifactPath.replace(/^\.e2e-artifacts\/ui\//, './');
}

function slugifyStepName(value) {
  return `${value ?? 'step'}`
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'step';
}

function statusLabel(status) {
  if (status === 'passed') {
    return 'PASS';
  }
  if (status === 'failed') {
    return 'FAIL';
  }
  return 'SKIP';
}
