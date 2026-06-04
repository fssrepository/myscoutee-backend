#!/usr/bin/env node
// UI checks require the full stack through nginx, usually e2e compose, before this script starts.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { assert, expectDuration } from '../../shared/assertions.mjs';
import { discoverCollection, parseCommonArgs } from '../../shared/collection-runner.mjs';
import { launchChromeBrowser } from './lib/chrome-cdp.mjs';
import { assertBrowserExpectations, performDemoLogin } from './lib/ui-contracts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rawArgs = process.argv.slice(2);
const args = parseCommonArgs(stripUiArgs(rawArgs));
const uiArgs = parseUiArgs(rawArgs);
const baseUrl = process.env.E2E_UI_BASE_URL ?? 'http://localhost';
const artifactsDir = process.env.E2E_UI_ARTIFACTS_DIR
  ? path.resolve(process.env.E2E_UI_ARTIFACTS_DIR)
  : path.join(__dirname, '..', '..', '..', '.e2e-artifacts', 'functional', uiArgs.artifactName);

const ctx = {
  mode: process.env.E2E_UI_MODE ?? 'full',
  baseUrl,
  vars: {},
  defaultMaxMs: Number(process.env.E2E_UI_DEFAULT_MAX_MS ?? 20000),
  viewport: uiArgs.viewport
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
          await attachStepRecorder(setupPage, options.artifactsDir, setupTestCase);
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
          await attachStepRecorder(page, options.artifactsDir, testCase);
        }
        const result = await runUiCase({
          browser,
          page,
          testCase,
          ctx: options.ctx,
          record: options.record,
          artifactsDir: options.artifactsDir
        });
        summary.passed += 1;
        summary.results.push(resultSummaryFor(testCase, {
          status: 'passed',
          durationMs: result.durationMs,
          steps: [
            ...(page.recordedSteps ?? []),
            ...(result.auxiliarySteps ?? [])
          ],
          uiFindings: page.uiFindings ?? [],
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
        if (page) {
          await recordRuntimeFindings(page).catch(() => undefined);
        }
        if (page && options.record) {
          await recordUiCase(options.artifactsDir, testCase, page, { error: error.message });
        }
        summary.results.push(resultSummaryFor(testCase, {
          status: 'failed',
          error: error.message,
          steps: page?.recordedSteps ?? [],
          uiFindings: page?.uiFindings ?? [],
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

async function runUiCase({ browser, page, testCase, ctx, record, artifactsDir }) {
  const started = performance.now();
  const auxiliaryPages = [];
  const auxiliarySteps = [];
  const expected = await readJsonOptional(testCase.dir, 'response.json');
  const scriptName = testCase.request.script ?? 'assert.mjs';
  const script = await import(pathToFileURL(path.join(testCase.dir, scriptName)).href);
  const request = materializeRequest(testCase.request, ctx);
  const auxiliaryBrowsers = [];
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
    assert(hasStoredDemoSession(ctx.suiteDemoStorage?.localStorage), 'suiteDemoLogin requires a completed suite demo login');
  }

  try {
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
      await script.assertUi({
        page,
        browser,
        ctx,
        request,
        expected,
        testCase,
        newRecordedPage: async (name, options = {}) => {
          const childPage = await browser.newPage({
            viewport: options.viewport ?? page.viewport ?? ctx.viewport
          });
          auxiliaryPages.push(childPage);
          if (record) {
            await attachStepRecorder(childPage, artifactsDir, {
              ...testCase,
              id: `${testCase.id}/${slugifyStepName(name)}`
            });
          }
          return childPage;
        },
        newIsolatedRecordedPage: async (name, options = {}) => {
          const childBrowser = await launchChromeBrowser({
            baseUrl: options.baseUrl ?? ctx.baseUrl,
            viewport: options.viewport ?? page.viewport ?? ctx.viewport
          });
          auxiliaryBrowsers.push(childBrowser);
          const childPage = await childBrowser.newPage({
            viewport: options.viewport ?? page.viewport ?? ctx.viewport
          });
          auxiliaryPages.push(childPage);
          if (record) {
            await attachStepRecorder(childPage, artifactsDir, {
              ...testCase,
              id: `${testCase.id}/${slugifyStepName(name)}`
            });
          }
          return childPage;
        }
      });
    }
    await recordRuntimeFindings(page);
    await assertBrowserExpectations(page, expected ?? {});
    const durationMs = performance.now() - started;
    const result = {
      status: 'browser',
      durationMs,
      url: await page.evaluate(() => window.location.href),
      network: page.network,
      failedNetwork: page.failedNetwork,
      pageErrors: page.pageErrors,
      uiFindings: page.uiFindings ?? [],
      auxiliarySteps
    };
    expectDuration(result, Number(request.maxMs ?? expected?.maxMs ?? ctx.defaultMaxMs), testCase.id);
    if (record) {
      await recordUiCase(artifactsDir, testCase, page, result);
    }
    return result;
  } finally {
    for (const childPage of auxiliaryPages) {
      auxiliarySteps.push(...(childPage.recordedSteps ?? []));
      await childPage.close().catch(() => undefined);
    }
    for (const childBrowser of auxiliaryBrowsers) {
      await childBrowser.close().catch(() => undefined);
    }
  }
}

async function recordRuntimeFindings(page) {
  if (!page || page.runtimeFindingsRecorded) {
    return;
  }
  page.runtimeFindingsRecorded = true;

  const consoleErrors = (page.consoleMessages ?? []).filter(entry => entry.type === 'error');
  if (consoleErrors.length > 0) {
    await page.recordStep('runtime-console-errors');
    page.recordFinding?.({
      severity: 'warning',
      title: 'Browser console logged errors',
      details: {
        count: consoleErrors.length,
        errors: consoleErrors.slice(0, 10)
      }
    });
  }

  const pageErrors = page.pageErrors ?? [];
  if (pageErrors.length > 0) {
    await page.recordStep('runtime-page-errors');
    page.recordFinding?.({
      severity: 'fatal',
      title: 'Browser runtime exceptions were thrown',
      details: {
        count: pageErrors.length,
        errors: pageErrors.slice(0, 10)
      }
    });
  }

  const failedApiResponses = (page.network ?? []).filter(entry => entry.url.includes('/api/') && entry.status >= 400);
  if (failedApiResponses.length > 0) {
    await page.recordStep('runtime-failed-api-responses');
    page.recordFinding?.({
      severity: 'fatal',
      title: 'Backend API returned failed responses during UI flow',
      details: {
        count: failedApiResponses.length,
        responses: failedApiResponses.slice(0, 20)
      }
    });
  }

  const failedNetwork = (page.failedNetwork ?? []).filter(entry => {
    const url = `${entry.url ?? ''}`;
    return /^https?:\/\//i.test(url) && entry.errorText !== 'net::ERR_ABORTED';
  });
  if (failedNetwork.length > 0) {
    await page.recordStep('runtime-failed-network-loads');
    page.recordFinding?.({
      severity: 'warning',
      title: 'Browser reported failed network loads',
      details: {
        count: failedNetwork.length,
        requests: failedNetwork.slice(0, 20)
      }
    });
  }

  const popupOverflow = await page.evaluate(() => {
    const selectors = [
      '.confirmation-dialog',
      '.explanation-popup',
      '.navigator-settings-popup-shell',
      '.app-install-prompt',
      '[class*="popup-panel-"]',
      '.cdk-overlay-pane'
    ];
    const visible = element => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0
        && rect.height > 0
        && style.visibility !== 'hidden'
        && style.display !== 'none'
        && style.opacity !== '0';
    };
    const tolerance = 4;
    return Array.from(document.querySelectorAll(selectors.join(',')))
      .filter(visible)
      .map(element => {
        const rect = element.getBoundingClientRect();
        return {
          selector: selectors.find(selector => element.matches(selector)) ?? element.tagName.toLowerCase(),
          className: `${element.className ?? ''}`.trim(),
          left: rect.left,
          right: rect.right,
          width: rect.width,
          viewportWidth: window.innerWidth,
          overflowsLeft: rect.left < -tolerance,
          overflowsRight: rect.right > window.innerWidth + tolerance
        };
      })
      .filter(item => item.overflowsLeft || item.overflowsRight)
      .slice(0, 20);
  });
  if (popupOverflow.length > 0) {
    await page.recordStep('runtime-popup-horizontal-overflow');
    page.recordFinding?.({
      severity: 'warning',
      title: 'Visible popup extends past the viewport horizontally',
      details: {
        count: popupOverflow.length,
        popups: popupOverflow
      }
    });
  }
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

function hasStoredDemoSession(localStorageSnapshot = {}) {
  return Object.entries(localStorageSnapshot).some(([key, rawValue]) => {
    if (typeof rawValue !== 'string' || !key.endsWith('session.v1')) {
      return false;
    }
    try {
      return JSON.parse(rawValue)?.kind === 'demo';
    } catch {
      return false;
    }
  });
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
    pageErrors: page.pageErrors,
    uiFindings: page.uiFindings ?? []
  }, null, 2));
}

async function attachStepRecorder(page, artifactsDir, testCase) {
  let index = 0;
  const caseDir = path.join(artifactsDir, testCase.id);
  await rm(caseDir, { recursive: true, force: true });
  page.recordedSteps = [];
  page.stepRecorder = async (name, currentPage) => {
    index += 1;
    const normalizedName = slugifyStepName(name || `step-${index}`);
    const filename = `${String(index).padStart(2, '0')}-${normalizedName}.png`;
    const stepsDir = path.join(caseDir, 'steps');
    await mkdir(stepsDir, { recursive: true });
    const screenshot = await currentPage.screenshot();
    await writeFile(path.join(stepsDir, filename), screenshot);
    const relativePath = `./${testCase.id}/steps/${filename}`;
    page.recordedSteps.push({
      name,
      path: relativePath
    });
    return relativePath;
  };
}

function resultSummaryFor(testCase, result = {}) {
  const artifactPath = `./${testCase.id}`;
  const response = testCase.response ?? {};
  const steps = result.steps ?? [];
  const lastStep = steps.length > 0 ? steps[steps.length - 1] : null;
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
    lastStepScreenshot: lastStep?.path ?? null,
    steps,
    uiFindings: result.uiFindings ?? [],
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
    ],
    absentSelectors: [
      ...new Set([
        ...(response.initial?.absentSelectors ?? []),
        ...(response.absentSelectors ?? [])
      ])
    ],
    minVisible: [
      ...(response.initial?.minVisible ?? []),
      ...(response.minVisible ?? [])
    ],
    guardrails: [
      response.noCrashText === true ? 'no crash text' : null,
      response.noBrokenImages === true ? 'no broken visible images' : null,
      response.noConsoleErrors === true ? 'no console errors' : null,
      response.noFailedNetwork === true ? 'no failed network loads' : null
    ].filter(Boolean)
  };
}

async function writeUiArtifactIndex(artifactsDir, summary, ctx) {
  await mkdir(artifactsDir, { recursive: true });
  const generatedAt = new Date().toISOString();
  const json = {
    generatedAt,
    baseUrl: ctx.baseUrl,
    viewport: ctx.viewport,
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
  if (hasUiReportFindings(json)) {
    await writeFile(path.join(artifactsDir, 'findings.md'), renderUiFindings(json));
  } else {
    await rm(path.join(artifactsDir, 'findings.md'), { force: true });
  }
}

function renderUiArtifactIndex(report) {
  const reportableResults = report.results.filter(hasReportableUiIssue);
  const lines = [
    '# UI E2E Artifact Index',
    '',
    `Generated: ${report.generatedAt}`,
    `Base URL: ${report.baseUrl}`,
    `Viewport: ${report.viewport.width}x${report.viewport.height}`,
    `Summary: ${report.summary.passed} passed, ${report.summary.failed} failed, ${report.summary.skipped} skipped, ${report.summary.total} selected`,
    `Full machine-readable report: [index.json](./index.json)`,
    ''
  ];

  if (reportableResults.length === 0) {
    lines.push('No failures or UI findings recorded.');
    return `${lines.join('\n')}\n`;
  }

  lines.push('Only failures and UI findings are listed below.');
  lines.push('');

  for (const result of reportableResults) {
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
    if ((result.uiFindings ?? []).length > 0) {
      lines.push('UI findings:');
      for (const finding of result.uiFindings) {
        lines.push(`- ${finding.severity ?? 'info'}: ${finding.title ?? 'UI finding'}`);
        const relevantScreenshot = finding.screenshot ?? result.lastStepScreenshot;
        if (relevantScreenshot) {
          lines.push(`  Relevant screenshot: [open](${relativeArtifactLink(relevantScreenshot)})`);
        }
      }
    }
    appendExpectationLines(lines, result.expected);
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

function hasUiReportFindings(report) {
  return report.results.some(hasReportableUiIssue);
}

function hasReportableUiIssue(result) {
  return result.status === 'failed' || (result.uiFindings ?? []).length > 0;
}

function renderUiFindings(report) {
  const lines = [
    '# UI E2E Findings',
    '',
    `Generated: ${report.generatedAt}`,
    `Base URL: ${report.baseUrl}`,
    `Viewport: ${report.viewport.width}x${report.viewport.height}`,
    ''
  ];
  const failed = report.results.filter(result => result.status === 'failed');
  const weird = report.results.flatMap(result => (result.uiFindings ?? []).map(finding => ({ result, finding })));
  if (failed.length === 0 && weird.length === 0) {
    lines.push('No fatal failures or recorded visual findings.');
    return `${lines.join('\n')}\n`;
  }
  if (failed.length > 0) {
    lines.push('## Fatal Failures');
    lines.push('');
    for (const result of failed) {
      lines.push(`- ${result.id}: ${result.error ?? 'failed'}`);
      if (result.screenshot) {
        lines.push(`  Final screenshot: ${relativeArtifactLink(result.screenshot)}`);
      }
      if (result.lastStepScreenshot) {
        lines.push(`  Relevant step screenshot: ${relativeArtifactLink(result.lastStepScreenshot)}`);
      }
    }
    lines.push('');
  }
  if (weird.length > 0) {
    lines.push('## Weird Or Visual Findings');
    lines.push('');
    for (const { result, finding } of weird) {
      lines.push(`- ${result.id}: ${finding.severity ?? 'info'} - ${finding.title ?? 'UI finding'}`);
      const relevantScreenshot = finding.screenshot ?? result.lastStepScreenshot;
      if (relevantScreenshot) {
        lines.push(`  Relevant screenshot: ${relativeArtifactLink(relevantScreenshot)}`);
      }
      if (result.screenshot && result.screenshot !== relevantScreenshot) {
        lines.push(`  Final screenshot: ${relativeArtifactLink(result.screenshot)}`);
      }
      if (finding.details) {
        lines.push(`  Details: \`${JSON.stringify(finding.details).slice(0, 1200)}\``);
      }
    }
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

function appendExpectationLines(lines, expected) {
  const selectors = expected.selectors ?? [];
  const absentSelectors = expected.absentSelectors ?? [];
  const minVisible = expected.minVisible ?? [];
  const text = expected.text ?? [];
  const network = expected.network ?? [];
  const guardrails = expected.guardrails ?? [];
  if (expected.urlPath) {
    lines.push(`Expected path: \`${expected.urlPath}\``);
  }
  if (selectors.length > 0) {
    lines.push(`Expected selectors: ${selectors.map(item => `\`${item}\``).join(', ')}`);
  }
  if (text.length > 0) {
    lines.push(`Expected text: ${text.map(item => `\`${item}\``).join(', ')}`);
  }
  if (absentSelectors.length > 0) {
    lines.push(`Expected absent selectors: ${absentSelectors.map(item => `\`${item}\``).join(', ')}`);
  }
  if (minVisible.length > 0) {
    lines.push(`Expected minimum visible: ${minVisible.map(item => `\`${typeof item === 'string' ? item : `${item.selector} >= ${item.min ?? 1}`}\``).join(', ')}`);
  }
  if (network.length > 0) {
    lines.push(`Expected backend calls: ${network.map(item => `\`${item}\``).join(', ')}`);
  }
  if (guardrails.length > 0) {
    lines.push(`Guardrails: ${guardrails.map(item => `\`${item}\``).join(', ')}`);
  }
}

function relativeArtifactLink(artifactPath) {
  if (artifactPath.startsWith('./') || artifactPath.startsWith('../')) {
    return artifactPath;
  }
  return artifactPath.replace(/^\.e2e-artifacts\/[^/]+\//, './');
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

function parseUiArgs(argv) {
  const envViewport = {
    width: Number(process.env.E2E_UI_VIEWPORT_WIDTH ?? 1440),
    height: Number(process.env.E2E_UI_VIEWPORT_HEIGHT ?? 950)
  };
  let viewport = envViewport;
  let artifactName = 'ui';

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--mobile') {
      viewport = { width: 390, height: 844 };
      artifactName = 'ui-mobile';
    } else if (arg === '--desktop') {
      viewport = { width: 1440, height: 950 };
      artifactName = 'ui';
    } else if (arg === '--viewport') {
      const parsed = parseViewport(argv[index + 1]);
      if (parsed) {
        viewport = parsed;
        artifactName = `ui-${parsed.width}x${parsed.height}`;
      }
      index += 1;
    } else if (arg.startsWith('--viewport=')) {
      const parsed = parseViewport(arg.slice('--viewport='.length));
      if (parsed) {
        viewport = parsed;
        artifactName = `ui-${parsed.width}x${parsed.height}`;
      }
    }
  }

  if (process.env.E2E_UI_VIEWPORT_WIDTH || process.env.E2E_UI_VIEWPORT_HEIGHT) {
    artifactName = process.env.E2E_UI_ARTIFACTS_NAME ?? artifactName;
  }

  return { viewport, artifactName };
}

function stripUiArgs(argv) {
  const stripped = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--mobile' || arg === '--desktop' || arg.startsWith('--viewport=')) {
      continue;
    }
    if (arg === '--viewport') {
      index += 1;
      continue;
    }
    stripped.push(arg);
  }
  return stripped;
}

function parseViewport(value) {
  const match = `${value ?? ''}`.trim().match(/^(\d{3,5})x(\d{3,5})$/i);
  if (!match) {
    return null;
  }
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }
  return { width, height };
}
