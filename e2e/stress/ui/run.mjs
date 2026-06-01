#!/usr/bin/env node
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { launchChromeBrowser } from '../../functional/ui/lib/chrome-cdp.mjs';
import {
  acceptEntryPrivacyIfPresent,
  assertBrowserExpectations,
  clickDemoUser,
  performDemoLogin,
  settleFirstRunOverlays,
  waitForLoginDialogOrDemoSelector
} from '../../functional/ui/lib/ui-contracts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..', '..');
const functionalUiRoot = path.join(repoRoot, 'e2e', 'functional', 'ui');
const DEFAULT_UI_USER_ID = 'bf057de7c586eede7e84bdc7';
const NETWORK_PROFILES = {
  none: {},
  'normal-4g': {
    latencyMs: 100,
    downloadKbps: 4000,
    uploadKbps: 1500,
    connectionType: 'cellular4g'
  },
  'slow-4g': {
    latencyMs: 250,
    downloadKbps: 1600,
    uploadKbps: 750,
    connectionType: 'cellular4g'
  },
  'bad-mobile': {
    latencyMs: 400,
    downloadKbps: 750,
    uploadKbps: 250,
    connectionType: 'cellular3g'
  }
};
const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}
if (args.list) {
  await listScenarios();
  process.exit(0);
}

const scenario = await loadScenario(args.scenario);
applyScenarioOverrides(scenario, args);

const baseUrl = process.env.E2E_UI_STRESS_BASE_URL
  ?? process.env.E2E_UI_BASE_URL
  ?? scenario.baseUrl
  ?? 'http://localhost';
const startedAtIso = new Date().toISOString();
const startedAt = performance.now();
const artifactDir = args.record
  ? await prepareArtifactDir({ artifactsDir: args.artifactsDir, scenario, startedAtIso })
  : '';
const metrics = [];
let runError = null;

try {
  await Promise.all(Array.from({ length: scenario.users ?? 1 }, async (_item, index) => {
    const vu = index + 1;
    await sleep(rampDelay(index, scenario.users ?? 1, scenario.rampUpMs ?? 0));
    await runVirtualUser({ scenario, baseUrl, metrics, vu, startedAt, artifactDir });
  }));
} catch (error) {
  runError = error;
}

const endedAtIso = new Date().toISOString();
const summary = summarize(metrics);
if (artifactDir) {
  await writeArtifacts({
    artifactDir,
    scenario,
    baseUrl,
    startedAtIso,
    endedAtIso,
    summary,
    metrics,
    runError
  });
}

printSummary(scenario, summary, { artifactDir });
if (runError) {
  console.error(`ui stress runner error: ${runError.stack ?? runError.message}`);
}
const failed = Boolean(runError) || evaluateThresholds(summary, scenario.thresholds ?? {});
process.exitCode = failed ? 1 : 0;

async function runVirtualUser({ scenario, baseUrl, metrics, vu, startedAt, artifactDir }) {
  const durationMs = Number(scenario.durationMs ?? 0);
  const iterations = Math.max(1, Number(scenario.iterations ?? 1));
  let iteration = 0;
  while (true) {
    iteration += 1;
    if (durationMs > 0 && performance.now() - startedAt >= durationMs) {
      return;
    }
    if (durationMs <= 0 && iteration > iterations) {
      return;
    }

    const metric = await measureFlow({
      scenario,
      baseUrl,
      vu,
      iteration,
      startedAt,
      artifactDir
    });
    metrics.push(metric);
    if (!metric.ok && scenario.failFast) {
      return;
    }
    await sleep(jitter(scenario.thinkTimeMs ?? 0, scenario.thinkTimeJitterMs ?? 0));
  }
}

async function measureFlow({ scenario, baseUrl, vu, iteration, startedAt, artifactDir }) {
  const started = performance.now();
  let result = {};
  try {
    const runner = flowRunner(scenario.flow ?? 'demoBootstrap');
    result = await runner({
      scenario,
      baseUrl,
      vu,
      iteration,
      artifactDir
    });
    const ended = performance.now();
    return {
      step: scenario.flow ?? 'demoBootstrap',
      vu,
      iteration,
      ok: true,
      status: 200,
      startedAtMs: started - startedAt,
      endedAtMs: ended - startedAt,
      durationMs: ended - started,
      timings: result.timings,
      performance: result.performance,
      resourceSummary: result.resourceSummary,
      network: result.network,
      failedNetwork: result.failedNetwork,
      consoleErrors: result.consoleErrors,
      pageErrors: result.pageErrors,
      screenshot: result.screenshot ?? '',
      error: ''
    };
  } catch (error) {
    const ended = performance.now();
    const failure = error.result ?? result ?? {};
    return {
      step: scenario.flow ?? 'demoBootstrap',
      vu,
      iteration,
      ok: false,
      status: 0,
      startedAtMs: started - startedAt,
      endedAtMs: ended - startedAt,
      durationMs: ended - started,
      timings: failure.timings ?? {},
      performance: failure.performance ?? {},
      resourceSummary: failure.resourceSummary ?? {},
      network: failure.network ?? [],
      failedNetwork: failure.failedNetwork ?? [],
      consoleErrors: failure.consoleErrors ?? [],
      pageErrors: failure.pageErrors ?? [],
      screenshot: failure.screenshot ?? '',
      error: error.message
    };
  }
}

function flowRunner(flow) {
  if (flow === 'demoBootstrap') {
    return runDemoBootstrap;
  }
  if (flow === 'functionalCase') {
    return runFunctionalCase;
  }
  throw new Error(`Unknown UI stress flow: ${flow}`);
}

async function runDemoBootstrap({ scenario, baseUrl, vu, iteration, artifactDir }) {
  const timeoutMs = Number(scenario.timeoutMs ?? 90000);
  const browser = await launchChromeBrowser({
    baseUrl,
    viewport: scenario.viewport ?? { width: 390, height: 844 }
  });
  const page = await browser.newPage({ viewport: scenario.viewport });
  const timings = {};
  let screenshot = '';
  try {
    await configurePageForStress(page, scenario);
    const started = performance.now();
    mark(timings, 'start', started, started);

    await page.navigate(scenario.route ?? '/', { loadTimeoutMs: timeoutMs });
    mark(timings, 'documentLoadMs', started);
    await page.waitForSelector('app-entry-shell', { timeoutMs });
    mark(timings, 'entryShellMs', started);

    await acceptEntryPrivacyIfPresent(page, timeoutMs);
    mark(timings, 'privacyReadyMs', started);
    await page.click('.entry-cta-primary', { timeoutMs });
    mark(timings, 'loginClickedMs', started);

    await waitForLoginDialogOrDemoSelector(page, timeoutMs);
    mark(timings, 'loginGateMs', started);
    if (await page.isSelectorVisible('.confirmation-dialog')) {
      await page.grantGeolocationPermission();
      await page.click('.confirmation-dialog-confirm-btn', { timeoutMs });
      mark(timings, 'locationAcceptedMs', started);
    }

    await page.waitForSelector('.demo-login-overlay', { timeoutMs });
    await page.waitForSelector('.demo-user-item', { timeoutMs });
    await page.waitForNetwork('/api/auth/demo-users', { timeoutMs }).catch(() => undefined);
    mark(timings, 'demoSelectorMs', started);

    await clickDemoUser(page, scenario.userId ?? process.env.E2E_UI_USER_ID ?? '', timeoutMs);
    mark(timings, 'demoUserSelectedMs', started);

    await page.waitForUrlPath('/game', timeoutMs);
    await page.waitForSelector('.game-page', { timeoutMs });
    await settleFirstRunOverlays(page, { timeoutMs });
    mark(timings, 'gameReadyMs', started);

    const performanceSnapshot = await collectPerformanceSnapshot(page);
    const network = sanitizeNetwork(page.network);
    const failedNetwork = page.failedNetwork ?? [];
    const consoleErrors = (page.consoleMessages ?? []).filter(entry => entry.type === 'error');
    const pageErrors = page.pageErrors ?? [];
    screenshot = await recordScreenshot(page, artifactDir, `vu-${vu}-i-${iteration}-game-ready.png`);
    return {
      timings,
      performance: performanceSnapshot,
      resourceSummary: summarizeResources(performanceSnapshot.resources ?? []),
      network,
      failedNetwork,
      consoleErrors,
      pageErrors,
      screenshot
    };
  } catch (error) {
    const performanceSnapshot = await collectPerformanceSnapshot(page).catch(() => ({}));
    screenshot = await recordScreenshot(page, artifactDir, `vu-${vu}-i-${iteration}-error.png`).catch(() => '');
    error.result = {
      timings,
      performance: performanceSnapshot,
      resourceSummary: summarizeResources(performanceSnapshot.resources ?? []),
      network: sanitizeNetwork(page.network ?? []),
      failedNetwork: page.failedNetwork ?? [],
      consoleErrors: (page.consoleMessages ?? []).filter(entry => entry.type === 'error'),
      pageErrors: page.pageErrors ?? [],
      screenshot
    };
    throw error;
  } finally {
    await page.close().catch(() => undefined);
    await browser.close();
  }
}

async function runFunctionalCase({ scenario, baseUrl, vu, iteration, artifactDir }) {
  const timeoutMs = Number(scenario.timeoutMs ?? 90000);
  const testCase = await loadFunctionalUiCase(scenario.functionalCase ?? scenario.case);
  const expected = await readJsonOptional(testCase.dir, 'response.json');
  const rawRequest = testCase.request;
  const request = materializeFunctionalRequest(rawRequest, scenario);
  const browser = await launchChromeBrowser({
    baseUrl,
    viewport: scenario.viewport ?? request.viewport ?? { width: 390, height: 844 }
  });
  const page = await browser.newPage({ viewport: request.viewport ?? scenario.viewport });
  const auxiliaryPages = [];
  const auxiliaryBrowsers = [];
  const timings = {};
  let screenshot = '';
  try {
    let suiteDemoStorage = null;
    if (rawRequest.suiteDemoLogin === true && scenario.preLogin !== false) {
      const setupPage = await browser.newPage({ viewport: request.viewport ?? scenario.viewport });
      auxiliaryPages.push(setupPage);
      await configurePageForStress(setupPage, scenario);
      suiteDemoStorage = await performDemoLogin(setupPage, {
        geolocation: scenario.geolocation ?? defaultGeolocation(),
        userId: scenario.userId ?? process.env.E2E_UI_USER_ID ?? DEFAULT_UI_USER_ID,
        timeoutMs
      });
    }

    await configurePageForStress(page, scenario);
    if (request.geolocation) {
      await page.setGeolocation(request.geolocation);
    }
    await page.primeOrigin({
      localStorage: {
        ...(rawRequest.suiteDemoLogin === true ? suiteDemoStorage?.localStorage ?? {} : {}),
        ...(request.localStorage ?? request.storage ?? {})
      },
      sessionStorage: request.sessionStorage ?? {}
    });
    await resetPageStressBuffers(page);

    const started = performance.now();
    mark(timings, 'start', started, started);

    await page.navigate(request.route ?? request.path ?? '/', {
      loadTimeoutMs: request.loadTimeoutMs ?? timeoutMs
    });
    mark(timings, 'routeLoadedMs', started);
    if (expected?.urlPath) {
      await page.waitForUrlPath(expected.urlPath, request.waitTimeoutMs ?? timeoutMs);
      mark(timings, 'urlReadyMs', started);
    }
    await assertBrowserExpectations(page, expected?.initial ?? {});
    mark(timings, 'initialReadyMs', started);

    const scriptName = request.script ?? 'assert.mjs';
    const script = await import(pathToFileURL(path.join(testCase.dir, scriptName)).href);
    if (script?.assertUi) {
      await script.assertUi({
        page,
        browser,
        ctx: {
          mode: 'ui-stress',
          baseUrl,
          vars: {},
          defaultMaxMs: timeoutMs,
          viewport: scenario.viewport
        },
        request,
        expected,
        testCase,
        newRecordedPage: async (_name, options = {}) => {
          const childPage = await browser.newPage({
            viewport: options.viewport ?? page.viewport ?? scenario.viewport
          });
          auxiliaryPages.push(childPage);
          await configurePageForStress(childPage, scenario);
          return childPage;
        },
        newIsolatedRecordedPage: async (_name, options = {}) => {
          const childBrowser = await launchChromeBrowser({
            baseUrl: options.baseUrl ?? baseUrl,
            viewport: options.viewport ?? page.viewport ?? scenario.viewport
          });
          auxiliaryBrowsers.push(childBrowser);
          const childPage = await childBrowser.newPage({
            viewport: options.viewport ?? page.viewport ?? scenario.viewport
          });
          auxiliaryPages.push(childPage);
          await configurePageForStress(childPage, scenario);
          return childPage;
        }
      });
    }
    mark(timings, 'scriptReadyMs', started);
    await assertBrowserExpectations(page, expected ?? {});
    mark(timings, 'caseReadyMs', started);

    const performanceSnapshot = await collectPerformanceSnapshot(page);
    screenshot = await recordScreenshot(page, artifactDir, `vu-${vu}-i-${iteration}-${safeName(testCase.id)}.png`);
    return {
      timings,
      performance: performanceSnapshot,
      resourceSummary: summarizeResources(performanceSnapshot.resources ?? []),
      network: sanitizeNetwork(page.network),
      failedNetwork: page.failedNetwork ?? [],
      consoleErrors: (page.consoleMessages ?? []).filter(entry => entry.type === 'error'),
      pageErrors: page.pageErrors ?? [],
      screenshot
    };
  } catch (error) {
    const performanceSnapshot = await collectPerformanceSnapshot(page).catch(() => ({}));
    screenshot = await recordScreenshot(page, artifactDir, `vu-${vu}-i-${iteration}-${safeName(testCase.id)}-error.png`).catch(() => '');
    error.result = {
      timings,
      performance: performanceSnapshot,
      resourceSummary: summarizeResources(performanceSnapshot.resources ?? []),
      network: sanitizeNetwork(page.network ?? []),
      failedNetwork: page.failedNetwork ?? [],
      consoleErrors: (page.consoleMessages ?? []).filter(entry => entry.type === 'error'),
      pageErrors: page.pageErrors ?? [],
      screenshot
    };
    throw error;
  } finally {
    for (const childPage of auxiliaryPages) {
      await childPage.close().catch(() => undefined);
    }
    for (const childBrowser of auxiliaryBrowsers) {
      await childBrowser.close().catch(() => undefined);
    }
    await page.close().catch(() => undefined);
    await browser.close();
  }
}

async function configurePageForStress(page, scenario) {
  const network = resolveNetwork(scenario);
  await page.setCpuThrottlingRate(scenario.cpuThrottleRate ?? 1);
  await page.emulateNetworkConditions(network);
  if (scenario.cacheDisabled !== false) {
    await page.setCacheDisabled(true);
  }
  if (scenario.clearCache !== false) {
    await page.clearBrowserCache();
  }
  if (scenario.geolocation) {
    await page.setGeolocation(scenario.geolocation);
  }
  await page.addInitScript(`
    window.__e2eLongTasks = [];
    window.__e2eLayoutShifts = [];
    try {
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          window.__e2eLongTasks.push({
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration
          });
        }
      }).observe({ type: 'longtask', buffered: true });
    } catch (error) {}
    try {
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__e2eLayoutShifts.push({
              startTime: entry.startTime,
              value: entry.value
            });
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (error) {}
  `);
}

async function resetPageStressBuffers(page) {
  page.clearNetworkLog();
  await page.evaluate(() => {
    performance.clearMarks();
    performance.clearMeasures();
    performance.clearResourceTimings();
    window.__e2eLongTasks = [];
    window.__e2eLayoutShifts = [];
  }).catch(() => undefined);
}

async function collectPerformanceSnapshot(page) {
  const browserSnapshot = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource').map(entry => ({
      name: entry.name,
      initiatorType: entry.initiatorType,
      startTime: entry.startTime,
      duration: entry.duration,
      transferSize: entry.transferSize ?? 0,
      encodedBodySize: entry.encodedBodySize ?? 0,
      decodedBodySize: entry.decodedBodySize ?? 0,
      responseEnd: entry.responseEnd ?? 0
    }));
    return {
      navigation: navigation ? {
        name: navigation.name,
        startTime: navigation.startTime,
        duration: navigation.duration,
        domContentLoadedEventEnd: navigation.domContentLoadedEventEnd,
        loadEventEnd: navigation.loadEventEnd,
        responseEnd: navigation.responseEnd,
        transferSize: navigation.transferSize ?? 0,
        encodedBodySize: navigation.encodedBodySize ?? 0,
        decodedBodySize: navigation.decodedBodySize ?? 0
      } : null,
      resources,
      longTasks: window.__e2eLongTasks ?? [],
      layoutShifts: window.__e2eLayoutShifts ?? []
    };
  });
  return {
    ...browserSnapshot,
    cdpMetrics: await page.performanceMetrics()
  };
}

function summarize(metrics) {
  const durations = metrics.map(item => item.durationMs).sort((left, right) => left - right);
  const failed = metrics.filter(item => !item.ok).length;
  const total = metrics.length;
  const elapsedMs = elapsedFor(metrics);
  const longTasks = metrics.flatMap(item => item.performance?.longTasks ?? []);
  return {
    total,
    failed,
    passed: total - failed,
    errorRate: total === 0 ? 0 : failed / total,
    elapsedMs,
    runsPerSec: perSecond(total, elapsedMs),
    minMs: durations[0] ?? 0,
    maxMs: durations[durations.length - 1] ?? 0,
    avgMs: average(durations),
    p50Ms: percentile(durations, 0.50),
    p90Ms: percentile(durations, 0.90),
    p95Ms: percentile(durations, 0.95),
    p99Ms: percentile(durations, 0.99),
    maxLongTaskMs: Math.max(0, ...longTasks.map(item => Number(item.duration ?? 0))),
    longTaskCount: longTasks.length,
    longTaskTotalMs: longTasks.reduce((sum, item) => sum + Number(item.duration ?? 0), 0),
    byMilestone: summarizeTimings(metrics),
    resourceSummary: summarizeResourceSummaries(metrics.map(item => item.resourceSummary ?? {})),
    failedNetworkCount: metrics.reduce((sum, item) => sum + (item.failedNetwork?.length ?? 0), 0),
    consoleErrorCount: metrics.reduce((sum, item) => sum + (item.consoleErrors?.length ?? 0), 0),
    pageErrorCount: metrics.reduce((sum, item) => sum + (item.pageErrors?.length ?? 0), 0)
  };
}

function summarizeTimings(metrics) {
  const keys = [...new Set(metrics.flatMap(item => Object.keys(item.timings ?? {})))]
    .filter(key => key.endsWith('Ms'));
  return keys.map(key => {
    const values = metrics
      .map(item => Number(item.timings?.[key]))
      .filter(Number.isFinite)
      .sort((left, right) => left - right);
    return {
      milestone: key,
      avgMs: average(values),
      p50Ms: percentile(values, 0.50),
      p95Ms: percentile(values, 0.95),
      p99Ms: percentile(values, 0.99),
      maxMs: values[values.length - 1] ?? 0
    };
  }).sort((left, right) => right.p95Ms - left.p95Ms);
}

function summarizeResources(resources) {
  const scripts = resources.filter(item => item.initiatorType === 'script' || /\.m?js($|\?)/i.test(item.name));
  const styles = resources.filter(item => item.initiatorType === 'link' || /\.css($|\?)/i.test(item.name));
  const images = resources.filter(item => item.initiatorType === 'img' || /\.(png|jpe?g|webp|gif|avif|svg)($|\?)/i.test(item.name));
  const api = resources.filter(item => item.name.includes('/api/'));
  return {
    totalCount: resources.length,
    totalTransferBytes: sumTransfer(resources),
    scriptCount: scripts.length,
    scriptTransferBytes: sumTransfer(scripts),
    styleCount: styles.length,
    styleTransferBytes: sumTransfer(styles),
    imageCount: images.length,
    imageTransferBytes: sumTransfer(images),
    apiCount: api.length,
    apiTransferBytes: sumTransfer(api),
    largestScripts: scripts
      .slice()
      .sort((left, right) => transferSize(right) - transferSize(left))
      .slice(0, 8)
      .map(item => ({
        url: compactUrl(item.name),
        transferBytes: transferSize(item),
        durationMs: Math.round(Number(item.duration ?? 0))
      }))
  };
}

function summarizeResourceSummaries(items) {
  return {
    totalTransferBytes: items.reduce((sum, item) => sum + Number(item.totalTransferBytes ?? 0), 0),
    scriptTransferBytes: items.reduce((sum, item) => sum + Number(item.scriptTransferBytes ?? 0), 0),
    styleTransferBytes: items.reduce((sum, item) => sum + Number(item.styleTransferBytes ?? 0), 0),
    imageTransferBytes: items.reduce((sum, item) => sum + Number(item.imageTransferBytes ?? 0), 0),
    apiTransferBytes: items.reduce((sum, item) => sum + Number(item.apiTransferBytes ?? 0), 0)
  };
}

async function prepareArtifactDir({ artifactsDir, scenario, startedAtIso }) {
  const rootDir = artifactsDir
    ? path.resolve(artifactsDir)
    : path.join(repoRoot, '.e2e-artifacts', 'stress', 'ui');
  const runDir = path.join(rootDir, `${safeName(scenario.id ?? 'scenario')}-${startedAtIso.replace(/[:.]/g, '-')}`);
  await mkdir(runDir, { recursive: true });
  await mkdir(path.join(runDir, 'screenshots'), { recursive: true });
  return runDir;
}

async function writeArtifacts({ artifactDir, scenario, baseUrl, startedAtIso, endedAtIso, summary, metrics, runError }) {
  const payload = {
    scenario: {
      id: scenario.id,
      name: scenario.name,
      flow: scenario.flow ?? 'demoBootstrap',
      functionalCase: scenario.functionalCase ?? scenario.case ?? null,
      baseUrl,
      users: scenario.users ?? 1,
      iterations: scenario.iterations ?? null,
      durationMs: scenario.durationMs ?? 0,
      viewport: scenario.viewport,
      cpuThrottleRate: scenario.cpuThrottleRate ?? 1,
      network: resolveNetwork(scenario),
      thresholds: scenario.thresholds ?? {}
    },
    startedAtIso,
    endedAtIso,
    summary,
    runError: runError ? { message: runError.message, stack: runError.stack } : null
  };
  await writeFile(path.join(artifactDir, 'summary.json'), `${JSON.stringify(payload, null, 2)}\n`);
  await writeFile(path.join(artifactDir, 'metrics.json'), `${JSON.stringify(metrics, null, 2)}\n`);
  await writeFile(path.join(artifactDir, 'network.json'), `${JSON.stringify(metrics.map(item => ({
    vu: item.vu,
    iteration: item.iteration,
    network: item.network,
    failedNetwork: item.failedNetwork
  })), null, 2)}\n`);
  await writeFile(path.join(artifactDir, 'index.md'), renderArtifactIndex(payload, metrics));
}

function renderArtifactIndex(payload, metrics) {
  const lines = [
    `# ${payload.scenario.name ?? payload.scenario.id}`,
    '',
    `- Scenario: \`${payload.scenario.id}\``,
    `- Flow/base URL: \`${payload.scenario.flow}\` at \`${payload.scenario.baseUrl}\``,
    payload.scenario.functionalCase ? `- Functional case: \`${payload.scenario.functionalCase}\`` : null,
    `- Viewport: ${payload.scenario.viewport?.width ?? '-'}x${payload.scenario.viewport?.height ?? '-'}`,
    `- CPU/network: ${payload.scenario.cpuThrottleRate}x, \`${payload.scenario.network.profile ?? 'custom'}\``,
    `- Started: ${payload.startedAtIso}`,
    `- Ended: ${payload.endedAtIso}`,
    `- Runs: ${payload.summary.total} total, ${payload.summary.passed} passed, ${payload.summary.failed} failed`,
    `- Error rate: ${(payload.summary.errorRate * 100).toFixed(2)}%`,
    `- Duration: avg ${ms(payload.summary.avgMs)}, p95 ${ms(payload.summary.p95Ms)}, p99 ${ms(payload.summary.p99Ms)}, max ${ms(payload.summary.maxMs)}`,
    `- Long tasks: ${payload.summary.longTaskCount}, max ${ms(payload.summary.maxLongTaskMs)}, total ${ms(payload.summary.longTaskTotalMs)}`,
    `- Transfer: total ${formatBytes(payload.summary.resourceSummary.totalTransferBytes)}, JS ${formatBytes(payload.summary.resourceSummary.scriptTransferBytes)}, CSS ${formatBytes(payload.summary.resourceSummary.styleTransferBytes)}, API ${formatBytes(payload.summary.resourceSummary.apiTransferBytes)}`,
    `- Runtime errors: failed network ${payload.summary.failedNetworkCount}, console errors ${payload.summary.consoleErrorCount}, page errors ${payload.summary.pageErrorCount}`,
    '',
    '## Milestones',
    '',
    '| Milestone | Avg | p50 | p95 | p99 | Max |',
    '| --- | ---: | ---: | ---: | ---: | ---: |',
    ...payload.summary.byMilestone.map(item => `| ${item.milestone} | ${ms(item.avgMs)} | ${ms(item.p50Ms)} | ${ms(item.p95Ms)} | ${ms(item.p99Ms)} | ${ms(item.maxMs)} |`),
    '',
    '## Runs',
    '',
    '| VU | Iteration | Status | Duration | Ready | JS Transfer | Long Tasks | Screenshot | Error |',
    '| ---: | ---: | --- | ---: | ---: | ---: | ---: | --- | --- |',
    ...metrics.map(item => `| ${item.vu} | ${item.iteration} | ${item.ok ? 'pass' : 'fail'} | ${ms(item.durationMs)} | ${ms(item.timings?.caseReadyMs ?? item.timings?.gameReadyMs)} | ${formatBytes(item.resourceSummary?.scriptTransferBytes)} | ${item.performance?.longTasks?.length ?? 0} | ${item.screenshot ? `[open](${relativeArtifactLink(item.screenshot)})` : '-'} | ${escapeTable(item.error || '')} |`),
    ''
  ];
  if (payload.runError) {
    lines.push('## Runner Error', '', '```', payload.runError.stack ?? payload.runError.message, '```', '');
  }
  lines.push('Raw files: `summary.json`, `metrics.json`, `network.json`.', '');
  return `${lines.join('\n')}\n`;
}

function printSummary(scenario, summary, options = {}) {
  console.log(`\nui stress scenario: ${scenario.name ?? scenario.id}`);
  console.log(`runs: ${summary.total}, passed: ${summary.passed}, failed: ${summary.failed}, errorRate: ${(summary.errorRate * 100).toFixed(2)}%`);
  console.log(`duration ms: avg=${Math.round(summary.avgMs)} p50=${Math.round(summary.p50Ms)} p95=${Math.round(summary.p95Ms)} p99=${Math.round(summary.p99Ms)} max=${Math.round(summary.maxMs)}`);
  console.log(`long tasks: count=${summary.longTaskCount} max=${Math.round(summary.maxLongTaskMs)}ms total=${Math.round(summary.longTaskTotalMs)}ms`);
  console.log(`transfer: total=${formatBytes(summary.resourceSummary.totalTransferBytes)} js=${formatBytes(summary.resourceSummary.scriptTransferBytes)} api=${formatBytes(summary.resourceSummary.apiTransferBytes)}`);
  for (const item of summary.byMilestone) {
    console.log(`- ${item.milestone}: p50=${Math.round(item.p50Ms)}ms p95=${Math.round(item.p95Ms)}ms p99=${Math.round(item.p99Ms)}ms max=${Math.round(item.maxMs)}ms`);
  }
  if (options.artifactDir) {
    console.log(`artifacts: ${options.artifactDir}`);
  }
}

function evaluateThresholds(summary, thresholds) {
  let failed = false;
  if (Number.isFinite(Number(thresholds.errorRate)) && summary.errorRate > Number(thresholds.errorRate)) {
    failed = true;
  }
  if (Number.isFinite(Number(thresholds.p95Ms)) && summary.p95Ms > Number(thresholds.p95Ms)) {
    failed = true;
  }
  if (Number.isFinite(Number(thresholds.maxLongTaskMs)) && summary.maxLongTaskMs > Number(thresholds.maxLongTaskMs)) {
    failed = true;
  }
  const milestoneThresholds = thresholds.milestones ?? {};
  const milestones = new Map(summary.byMilestone.map(item => [item.milestone, item]));
  for (const [milestone, limit] of Object.entries(milestoneThresholds)) {
    if (Number.isFinite(Number(limit)) && Number(milestones.get(milestone)?.p95Ms ?? 0) > Number(limit)) {
      failed = true;
    }
  }
  return failed;
}

async function recordScreenshot(page, artifactDir, filename) {
  if (!artifactDir) {
    return '';
  }
  const relative = path.join('screenshots', filename);
  const target = path.join(artifactDir, relative);
  await writeFile(target, await page.screenshot());
  return `./${relative.replaceAll(path.sep, '/')}`;
}

function sanitizeNetwork(network) {
  return (network ?? []).map(entry => ({
    url: entry.url,
    status: entry.status,
    type: entry.type,
    mimeType: entry.mimeType,
    fromDiskCache: entry.fromDiskCache,
    encodedDataLength: entry.encodedDataLength
  }));
}

function mark(timings, name, started, value = performance.now()) {
  timings[name] = value - started;
}

function resolveNetwork(scenario) {
  const profile = typeof scenario.network === 'string'
    ? scenario.network
    : scenario.network?.profile ?? 'none';
  const base = NETWORK_PROFILES[profile] ?? {};
  const custom = typeof scenario.network === 'object' && scenario.network ? scenario.network : {};
  return {
    profile,
    ...base,
    ...custom
  };
}

async function loadScenario(name) {
  const scenarioName = name || process.env.E2E_UI_STRESS_SCENARIO || 'demo-bootstrap';
  const scenarioPath = path.join(__dirname, 'scenarios', `${scenarioName}.json`);
  const scenario = JSON.parse(await readFile(scenarioPath, 'utf8'));
  scenario.id ??= scenarioName;
  return scenario;
}

async function loadFunctionalUiCase(caseId) {
  const normalized = `${caseId ?? ''}`.replace(/^\/+|\/+$/g, '');
  if (!normalized) {
    throw new Error('functionalCase flow requires "functionalCase" in the scenario JSON');
  }
  const dir = path.join(functionalUiRoot, normalized);
  const requestPath = path.join(dir, 'request.json');
  const request = JSON.parse(await readFile(requestPath, 'utf8'));
  return {
    id: normalized,
    dir,
    requestPath,
    request
  };
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

function materializeFunctionalRequest(request, scenario) {
  const userId = scenario.userId ?? process.env.E2E_UI_USER_ID ?? DEFAULT_UI_USER_ID;
  const adminUserId = scenario.adminUserId
    ?? process.env.E2E_UI_ADMIN_USER_ID
    ?? process.env.E2E_ADMIN_USER_ID
    ?? 'admin-demo-ava';
  return interpolate(request, {
    userId,
    adminUserId,
    appSession: JSON.stringify({ kind: 'demo', userId }),
    adminAppSession: JSON.stringify({ kind: 'demo', userId: adminUserId }),
    adminSession: JSON.stringify({ adminUserId })
  });
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

function defaultGeolocation() {
  return {
    latitude: Number(process.env.E2E_UI_GEO_LATITUDE ?? 47.5004928),
    longitude: Number(process.env.E2E_UI_GEO_LONGITUDE ?? 19.0742528),
    accuracy: Number(process.env.E2E_UI_GEO_ACCURACY ?? 20),
    grant: false
  };
}

async function listScenarios() {
  const files = (await readdir(path.join(__dirname, 'scenarios')))
    .filter(file => file.endsWith('.json'))
    .sort();
  for (const file of files) {
    const scenario = JSON.parse(await readFile(path.join(__dirname, 'scenarios', file), 'utf8'));
    console.log(`${file.replace(/\.json$/, '')} [${scenario.flow ?? 'demoBootstrap'}] users=${scenario.users ?? 1} iterations=${scenario.iterations ?? '-'} durationMs=${scenario.durationMs ?? '-'} - ${scenario.name ?? ''}`);
  }
}

function applyScenarioOverrides(scenario, parsed) {
  applyNumberOverride(scenario, 'users', parsed.users);
  applyNumberOverride(scenario, 'iterations', parsed.iterations);
  applyNumberOverride(scenario, 'durationMs', parsed.durationMs);
  applyNumberOverride(scenario, 'rampUpMs', parsed.rampUpMs);
  applyNumberOverride(scenario, 'thinkTimeMs', parsed.thinkTimeMs);
  applyNumberOverride(scenario, 'thinkTimeJitterMs', parsed.thinkTimeJitterMs);
  applyNumberOverride(scenario, 'timeoutMs', parsed.timeoutMs);
  applyNumberOverride(scenario, 'cpuThrottleRate', parsed.cpuThrottleRate);
  if (parsed.network) {
    scenario.network = parsed.network;
  }
  if (parsed.latencyMs || parsed.downloadKbps || parsed.uploadKbps) {
    const networkOverrides = {};
    if (parsed.latencyMs) {
      networkOverrides.latencyMs = numberOrUndefined(parsed.latencyMs);
    }
    if (parsed.downloadKbps) {
      networkOverrides.downloadKbps = numberOrUndefined(parsed.downloadKbps);
    }
    if (parsed.uploadKbps) {
      networkOverrides.uploadKbps = numberOrUndefined(parsed.uploadKbps);
    }
    scenario.network = {
      ...(typeof scenario.network === 'object' ? scenario.network : { profile: scenario.network || 'custom' }),
      ...networkOverrides
    };
  }
  if (parsed.viewport) {
    const [width, height] = parsed.viewport.split('x').map(value => Number(value));
    if (Number.isFinite(width) && Number.isFinite(height)) {
      scenario.viewport = { width, height };
    }
  }
  if (parsed.baseUrl) {
    scenario.baseUrl = parsed.baseUrl;
  }
}

function applyNumberOverride(target, key, value) {
  if (value === undefined || value === '') {
    return;
  }
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    target[key] = parsed;
  }
}

function parseArgs(argv) {
  const parsed = { list: false, help: false, record: false, scenario: '', artifactsDir: '' };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg === '--list') {
      parsed.list = true;
    } else if (arg === '--record') {
      parsed.record = true;
    } else if (arg === '--scenario') {
      parsed.scenario = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--scenario=')) {
      parsed.scenario = arg.slice('--scenario='.length);
    } else if (arg === '--artifacts-dir') {
      parsed.artifactsDir = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--artifacts-dir=')) {
      parsed.artifactsDir = arg.slice('--artifacts-dir='.length);
    } else if (arg === '--base-url') {
      parsed.baseUrl = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--base-url=')) {
      parsed.baseUrl = arg.slice('--base-url='.length);
    } else if (arg === '--users') {
      parsed.users = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--users=')) {
      parsed.users = arg.slice('--users='.length);
    } else if (arg === '--iterations') {
      parsed.iterations = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--iterations=')) {
      parsed.iterations = arg.slice('--iterations='.length);
    } else if (arg === '--duration-ms') {
      parsed.durationMs = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--duration-ms=')) {
      parsed.durationMs = arg.slice('--duration-ms='.length);
    } else if (arg === '--ramp-up-ms') {
      parsed.rampUpMs = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--ramp-up-ms=')) {
      parsed.rampUpMs = arg.slice('--ramp-up-ms='.length);
    } else if (arg === '--think-time-ms') {
      parsed.thinkTimeMs = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--think-time-ms=')) {
      parsed.thinkTimeMs = arg.slice('--think-time-ms='.length);
    } else if (arg === '--think-time-jitter-ms') {
      parsed.thinkTimeJitterMs = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--think-time-jitter-ms=')) {
      parsed.thinkTimeJitterMs = arg.slice('--think-time-jitter-ms='.length);
    } else if (arg === '--timeout-ms') {
      parsed.timeoutMs = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--timeout-ms=')) {
      parsed.timeoutMs = arg.slice('--timeout-ms='.length);
    } else if (arg === '--cpu-throttle') {
      parsed.cpuThrottleRate = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--cpu-throttle=')) {
      parsed.cpuThrottleRate = arg.slice('--cpu-throttle='.length);
    } else if (arg === '--network') {
      parsed.network = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--network=')) {
      parsed.network = arg.slice('--network='.length);
    } else if (arg === '--latency-ms') {
      parsed.latencyMs = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--latency-ms=')) {
      parsed.latencyMs = arg.slice('--latency-ms='.length);
    } else if (arg === '--download-kbps') {
      parsed.downloadKbps = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--download-kbps=')) {
      parsed.downloadKbps = arg.slice('--download-kbps='.length);
    } else if (arg === '--upload-kbps') {
      parsed.uploadKbps = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--upload-kbps=')) {
      parsed.uploadKbps = arg.slice('--upload-kbps='.length);
    } else if (arg === '--viewport') {
      parsed.viewport = argv[index + 1] ?? '';
      index += 1;
    } else if (arg.startsWith('--viewport=')) {
      parsed.viewport = arg.slice('--viewport='.length);
    } else if (!arg.startsWith('-') && !parsed.scenario) {
      parsed.scenario = arg;
    }
  }
  return parsed;
}

function printHelp() {
  console.log(`Usage:
  node e2e/stress/ui/run.mjs --scenario demo-bootstrap --record
  node e2e/stress/ui/run.mjs --scenario app-profile-editor-open --record

Options:
  --cpu-throttle 4
  --network slow-4g
  --viewport 390x844
  --users 1 --iterations 3
  --latency-ms 250 --download-kbps 1600 --upload-kbps 750`);
}

function rampDelay(index, total, rampUpMs) {
  const totalMs = Number(rampUpMs ?? 0);
  if (total <= 1 || totalMs <= 0) {
    return 0;
  }
  return Math.round((totalMs / Math.max(1, total - 1)) * index);
}

function jitter(base, amount) {
  const baseValue = Number(base ?? 0);
  const jitterValue = Number(amount ?? 0);
  if (!Number.isFinite(baseValue) || baseValue <= 0) {
    return 0;
  }
  if (!Number.isFinite(jitterValue) || jitterValue <= 0) {
    return baseValue;
  }
  return Math.max(0, baseValue + (Math.random() * jitterValue * 2) - jitterValue);
}

function elapsedFor(metrics) {
  if (metrics.length === 0) {
    return 0;
  }
  const started = Math.min(...metrics.map(item => item.startedAtMs));
  const ended = Math.max(...metrics.map(item => item.endedAtMs));
  return Math.max(0, ended - started);
}

function percentile(sortedValues, pct) {
  if (!sortedValues.length) {
    return 0;
  }
  const index = Math.ceil(sortedValues.length * pct) - 1;
  return sortedValues[Math.max(0, Math.min(sortedValues.length - 1, index))];
}

function average(values) {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function perSecond(count, elapsedMs) {
  return elapsedMs > 0 ? count / (elapsedMs / 1000) : 0;
}

function sumTransfer(items) {
  return items.reduce((sum, item) => sum + transferSize(item), 0);
}

function transferSize(item) {
  return Number(item.transferSize ?? item.encodedBodySize ?? 0) || 0;
}

function compactUrl(value) {
  try {
    const url = new URL(value);
    return `${url.pathname}${url.search}`.slice(0, 180);
  } catch {
    return `${value ?? ''}`.slice(0, 180);
  }
}

function safeName(value) {
  return `${value ?? 'scenario'}`.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '') || 'scenario';
}

function numberOrUndefined(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function ms(value) {
  return Number.isFinite(Number(value)) ? `${Math.round(Number(value))}ms` : '-';
}

function formatBytes(bytes) {
  if (!Number.isFinite(Number(bytes)) || Number(bytes) <= 0) {
    return '0 B';
  }
  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  let value = Number(bytes);
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function escapeTable(value) {
  return `${value ?? ''}`.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function relativeArtifactLink(value) {
  return `${value ?? ''}`.replace(/^\.\//, './');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, Math.max(0, Number(ms) || 0)));
}
