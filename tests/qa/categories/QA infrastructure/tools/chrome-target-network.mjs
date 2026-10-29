#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import WebSocket from '../../../../../myscoutee-frontend/node_modules/ws/index.js';

const args = process.argv.slice(2);
const command = args[0] ?? 'list';
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? `${args[index + 1] ?? ''}`.trim() : '';
};
const hasFlag = name => args.includes(name);

let socket = null;

if (!['list', 'inspect', 'activate-worker', 'online', 'offline', 'open-demo', 'close'].includes(command)) {
  fail([
    'Usage:',
    '  chrome-target-network.mjs list [--port PORT | --endpoint-file FILE]',
    '  chrome-target-network.mjs inspect --user-id ID [--port PORT | --endpoint-file FILE]',
    '  chrome-target-network.mjs activate-worker --user-id ID [--port PORT | --endpoint-file FILE]',
    '  chrome-target-network.mjs online|offline [--user-id ID | --target ID] [--reload | --hard-reload | --navigate-root | --navigate-url URL] [--hold]',
    '  chrome-target-network.mjs open-demo --url ORIGIN --user-id ID [--port PORT | --endpoint-file FILE]',
    '  chrome-target-network.mjs close --target ID [--port PORT | --endpoint-file FILE]'
  ].join('\n'));
}

const { port, browserPath } = await resolveEndpoint();

socket = new WebSocket(`ws://localhost:${port}${browserPath}`);
let requestId = 0;
const pending = new Map();

socket.on('message', data => {
  const message = JSON.parse(String(data));
  const request = pending.get(message.id);
  if (!request) {
    return;
  }
  pending.delete(message.id);
  if (message.error) {
    request.reject(new Error(message.error.message ?? JSON.stringify(message.error)));
    return;
  }
  request.resolve(message.result);
});

socket.on('error', error => {
  fail(`Chrome DevTools connection failed: ${error.message}`);
});

socket.on('open', async () => {
  try {
    if (command === 'open-demo') {
      await openDemoPage();
      socket.close();
      return;
    }

    const pages = await listPages();
    if (command === 'list') {
      for (const page of pages) {
        console.log(JSON.stringify(page));
      }
      socket.close();
      return;
    }

    if (command === 'inspect') {
      const selected = selectPage(pages);
      const { sessionId } = await send('Target.attachToTarget', {
        targetId: selected.targetId,
        flatten: true
      });
      try {
        const { result } = await send('Runtime.evaluate', {
          expression: [
            '(async () => {',
            "  const text = value => `${value ?? ''}`.replace(/\\s+/g, ' ').trim();",
            "  const elements = [...document.querySelectorAll('button, [role=button], a, input, select, textarea')];",
            "  const registrations = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistrations() : [];",
            '  return {',
            '    title: document.title,',
            '    url: location.href,',
            '    online: navigator.onLine,',
            '    serviceWorker: {',
            '      controlled: Boolean(navigator.serviceWorker?.controller),',
            '      registrations: registrations.map(registration => ({',
            '        scope: registration.scope,',
            '        active: registration.active?.state ?? null,',
            '        waiting: registration.waiting?.state ?? null,',
            '        installing: registration.installing?.state ?? null',
            '      }))',
            '    },',
            "    resources: performance.getEntriesByType('resource').map(entry => entry.name).filter(name => /\\.js(?:\\?|$)/.test(name)).slice(-80),",
            '    gamePage: (() => {',
            "      const element = document.querySelector('.game-page');",
            '      return element ? {',
            '        className: element.className,',
            '        background: getComputedStyle(element).backgroundImage,',
            "        offlineStatus: text(element.querySelector('.game-offline-status')?.textContent)",
            '      } : null;',
            '    })(),',
            '    sideMenu: (() => {',
            "      const panel = document.querySelector('.user-menu-panel');",
            "      const header = panel?.querySelector('.header-card');",
            '      return panel ? {',
            '        className: panel.className,',
            '        background: getComputedStyle(panel).backgroundImage,',
            '        headerBackground: header ? getComputedStyle(header).backgroundImage : null,',
            "        offlineBadge: text(panel.querySelector('.navigator-offline-badge')?.textContent),",
            "        notificationAttentionVisible: Boolean(document.querySelector('.notification-attention-launcher'))",
            '      } : null;',
            '    })(),',
            '    offlineTicketCache: (() => {',
            "      const marker = '.offline.v1:tickets:';",
            '      return Object.keys(localStorage)',
            '        .filter(key => key.includes(marker))',
            '        .sort()',
            '        .map(key => {',
            '          try {',
            "            const value = JSON.parse(localStorage.getItem(key) || 'null');",
            '            return {',
            '              key,',
            '              total: Number(value?.total ?? 0),',
            '              updatedAtIso: value?.updatedAtIso ?? null,',
            '              items: Array.isArray(value?.items)',
            '                ? value.items.map(item => ({',
            '                    id: item?.id ?? null,',
            '                    title: item?.title ?? null,',
            '                    usedAtIso: item?.usedAtIso ?? null,',
            "                    hasScanCode: Boolean(`${item?.scanCode ?? ''}`.trim())",
            '                  }))',
            '                : []',
            '            };',
            '          } catch {',
            '            return { key, invalid: true };',
            '          }',
            '        });',
            '    })(),',
            '    visualAssets: await (async () => {',
            '      const candidates = new Map();',
            '      const add = (url, kind, element) => {',
            '        if (!url || !/^https?:/.test(url)) return;',
            '        const row = candidates.get(url) ?? { url, kinds: [], contexts: [] };',
            '        if (!row.kinds.includes(kind)) row.kinds.push(kind);',
            "        const context = text(element?.closest('article, li, [role=listitem], .card, .smart-list-item')?.textContent).slice(0, 240);",
            '        if (context && !row.contexts.includes(context)) row.contexts.push(context);',
            '        candidates.set(url, row);',
            '      };',
            '      for (const element of document.images) {',
            "        add(element.currentSrc || element.src, 'img', element);",
            '      }',
            "      for (const element of document.querySelectorAll('body *')) {",
            '        const background = getComputedStyle(element).backgroundImage;',
            "        for (const match of background.matchAll(/url\\([\"']?([^\"')]+)[\"']?\\)/g)) {",
            "          try { add(new URL(match[1], location.href).toString(), 'background', element); } catch {}",
            '        }',
            '      }',
            '      return await Promise.all([...candidates.values()].map(async row => ({',
            '        ...row,',
            '        cacheHit: Boolean(await caches.match(row.url))',
            '      })));',
            '    })(),',
            "    bodyText: `${document.body?.innerText ?? ''}`.slice(0, 20000),",
            "    dialogs: [...document.querySelectorAll('[role=dialog], dialog, .cdk-overlay-pane')].map(element => text(element.innerText)).filter(Boolean).slice(0, 20),",
            '    interactive: elements.map(element => ({',
            '      tag: element.tagName.toLowerCase(),',
            "      text: text(element.innerText || element.value),",
            "      ariaLabel: text(element.getAttribute('aria-label')),",
            "      title: text(element.getAttribute('title')),",
            "      disabled: element.matches(':disabled') || element.getAttribute('aria-disabled') === 'true'",
            '    })).filter(item => item.text || item.ariaLabel || item.title).slice(0, 300)',
            '  };',
            '})()'
          ].join('\n'),
          returnByValue: true,
          awaitPromise: true
        }, sessionId);
        console.log(JSON.stringify({
          targetId: selected.targetId,
          userId: selected.userId,
          ...result.value
        }));
      } finally {
        await send('Target.detachFromTarget', { sessionId }).catch(() => undefined);
        socket.close();
      }
      return;
    }

    if (command === 'activate-worker') {
      const selected = selectPage(pages);
      const { sessionId } = await send('Target.attachToTarget', {
        targetId: selected.targetId,
        flatten: true
      });
      try {
        const { result } = await send('Runtime.evaluate', {
          expression: [
            '(async () => {',
            '  const registration = await navigator.serviceWorker.getRegistration();',
            '  if (!registration?.waiting) {',
            "    return { activated: false, reason: 'no-waiting-worker' };",
            '  }',
            '  const controllerChanged = new Promise(resolve => {',
            '    let settled = false;',
            '    const finish = changed => {',
            '      if (settled) return;',
            '      settled = true;',
            '      clearTimeout(timeoutId);',
            "      navigator.serviceWorker.removeEventListener('controllerchange', onChange);",
            '      resolve(changed);',
            '    };',
            '    const onChange = () => finish(true);',
            '    const timeoutId = setTimeout(() => finish(false), 5000);',
            "    navigator.serviceWorker.addEventListener('controllerchange', onChange);",
            '  });',
            "  registration.waiting.postMessage({ type: 'SKIP_WAITING' });",
            '  const changed = await controllerChanged;',
            '  return { activated: changed, reason: changed ? null : \'controllerchange-timeout\' };',
            '})()'
          ].join('\n'),
          returnByValue: true,
          awaitPromise: true
        }, sessionId);
        if (!result.value?.activated) {
          throw new Error(`Service worker activation failed: ${result.value?.reason ?? 'unknown'}`);
        }
        await send('Page.reload', { ignoreCache: false }, sessionId);
        console.log(JSON.stringify({
          targetId: selected.targetId,
          userId: selected.userId,
          serviceWorker: 'activated',
          action: 'reload'
        }));
      } finally {
        await send('Target.detachFromTarget', { sessionId }).catch(() => undefined);
        socket.close();
      }
      return;
    }

    const selected = selectPage(pages);
    if (command === 'close') {
      await send('Target.closeTarget', { targetId: selected.targetId });
      console.log(JSON.stringify({ targetId: selected.targetId, action: 'closed' }));
      socket.close();
      return;
    }
    const targetConnection = await openTargetConnection(port, selected.targetId);
    const holdNetwork = command === 'offline' && hasFlag('--hold');
    let navigatorOverrideId = null;
    let networkReleased = false;
    try {
      const offline = command === 'offline';
      await applyNetworkConditions(targetConnection, offline);
      if (holdNetwork) {
        navigatorOverrideId = await installNavigatorOffline(targetConnection);
      }

      if (hasFlag('--hard-reload')) {
        await targetConnection.send('Network.setBypassServiceWorker', { bypass: true });
        await targetConnection.send('Page.reload', { ignoreCache: true });
      } else if (hasFlag('--navigate-root')) {
        const pageUrl = new URL(selected.url);
        await targetConnection.send('Page.navigate', { url: `${pageUrl.origin}/` });
      } else if (option('--navigate-url')) {
        const destinationUrl = normalizeLocalUrl(option('--navigate-url'));
        if (!destinationUrl) {
          throw new Error('--navigate-url requires an http(s) localhost URL.');
        }
        await targetConnection.send('Page.navigate', { url: destinationUrl });
      } else if (hasFlag('--reload')) {
        await targetConnection.send('Page.reload', { ignoreCache: false });
      }

      const pageOnline = await readTargetOnlineState(targetConnection, !offline);

      console.log(JSON.stringify({
        targetId: selected.targetId,
        userId: selected.userId,
        previousUrl: selected.url,
        network: command,
        action: hasFlag('--hard-reload')
          ? 'hard-reload'
          : hasFlag('--navigate-root')
            ? 'navigate-root'
            : option('--navigate-url')
              ? 'navigate-url'
            : hasFlag('--reload')
              ? 'reload'
              : 'none',
        held: holdNetwork,
        pageOnline
      }));

      if (holdNetwork) {
        const releaseReason = await waitForNetworkRelease(targetConnection);
        if (targetConnection.isOpen()) {
          await applyNetworkConditions(targetConnection, false);
          await releaseNavigatorOffline(targetConnection, navigatorOverrideId);
          networkReleased = true;
          console.log(JSON.stringify({
            targetId: selected.targetId,
            userId: selected.userId,
            network: 'online',
            action: 'released',
            releaseReason
          }));
        }
      }
    } finally {
      if (holdNetwork && !networkReleased && targetConnection.isOpen()) {
        await applyNetworkConditions(targetConnection, false).catch(() => undefined);
        await releaseNavigatorOffline(targetConnection, navigatorOverrideId).catch(() => undefined);
      }
      targetConnection.close();
      socket.close();
    }
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
});

async function resolveEndpoint() {
  const explicitPort = Number(option('--port'));
  if (Number.isInteger(explicitPort) && explicitPort > 0) {
    const response = await fetch(`http://localhost:${explicitPort}/json/version`);
    if (!response.ok) {
      fail(`Chrome DevTools endpoint returned HTTP ${response.status} on port ${explicitPort}.`);
    }
    const version = await response.json();
    const debuggerUrl = `${version?.webSocketDebuggerUrl ?? ''}`.trim();
    const parsed = new URL(debuggerUrl);
    return {
      port: explicitPort,
      browserPath: `${parsed.pathname}${parsed.search}`
    };
  }

  const endpointFile = option('--endpoint-file')
    || join(homedir(), '.config/google-chrome/DevToolsActivePort');
  const [portLine, browserPath] = readFileSync(endpointFile, 'utf8')
    .split(/\r?\n/)
    .map(value => value.trim());
  const port = Number(portLine);
  if (!Number.isInteger(port) || port <= 0 || !browserPath) {
    fail(`Invalid Chrome DevTools endpoint file: ${endpointFile}`);
  }
  return { port, browserPath };
}

async function openDemoPage() {
  const pageOrigin = normalizeLocalOrigin(option('--url'));
  const userId = option('--user-id');
  if (!pageOrigin || !userId) {
    throw new Error('open-demo requires a localhost --url origin and a non-empty --user-id.');
  }

  if (pageOrigin.startsWith('https://')) {
    await send('Security.setIgnoreCertificateErrors', { ignore: true });
  }
  const { targetId } = await send('Target.createTarget', { url: `${pageOrigin}/` });
  const { sessionId } = await send('Target.attachToTarget', {
    targetId,
    flatten: true
  });
  try {
    await send('Page.enable', {}, sessionId);
    await waitForOrigin(pageOrigin, sessionId);
    await send('Runtime.evaluate', {
      expression: [
        '(() => {',
        `  const userId = ${JSON.stringify(userId)};`,
        "  localStorage.setItem('myscoutee.http.session.v1', JSON.stringify({ kind: 'demo', userId }));",
        "  localStorage.setItem('myscoutee.http.demo.active-user.v1', userId);",
        '  return true;',
        '})()'
      ].join('\n'),
      returnByValue: true
    }, sessionId);
    await send('Page.navigate', { url: `${pageOrigin}/` }, sessionId);
    console.log(JSON.stringify({ targetId, userId, origin: pageOrigin, network: 'online' }));
  } finally {
    await send('Target.detachFromTarget', { sessionId }).catch(() => undefined);
  }
}

async function waitForOrigin(expectedOrigin, sessionId) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const { result } = await send('Runtime.evaluate', {
      expression: 'location.origin',
      returnByValue: true
    }, sessionId).catch(() => ({ result: {} }));
    if (result?.value === expectedOrigin) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Chrome page did not reach ${expectedOrigin}.`);
}

function normalizeLocalOrigin(value) {
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.hostname !== 'localhost') {
      return '';
    }
    return parsed.origin;
  } catch {
    return '';
  }
}

function normalizeLocalUrl(value) {
  try {
    const parsed = new URL(value);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.hostname !== 'localhost') {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

async function applyNetworkConditions(connection, offline) {
  await connection.send('Network.enable');
  const conditions = {
    offline,
    latency: 0,
    downloadThroughput: offline ? 0 : -1,
    uploadThroughput: offline ? 0 : -1,
    connectionType: offline ? 'none' : 'wifi'
  };
  try {
    await connection.send('Network.overrideNetworkState', conditions);
    await connection.send('Network.emulateNetworkConditionsByRule', {
      matchedNetworkConditions: offline
        ? [{ urlPattern: '', ...conditions }]
        : []
    });
  } catch {
    await connection.send('Network.emulateNetworkConditions', conditions);
  }
}

async function installNavigatorOffline(connection) {
  await connection.send('Page.enable');
  const source = [
    '(() => {',
    "  const marker = '__myscouteeQaOffline';",
    '  if (window[marker]) return;',
    "  Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => false });",
    '  window[marker] = true;',
    "  const announceOffline = () => window.dispatchEvent(new Event('offline'));",
    '  announceOffline();',
    '  queueMicrotask(announceOffline);',
    '  setTimeout(announceOffline, 250);',
    '})()'
  ].join('\n');
  const { identifier } = await connection.send('Page.addScriptToEvaluateOnNewDocument', {
    source
  });
  await connection.send('Runtime.evaluate', { expression: source });
  return identifier;
}

async function releaseNavigatorOffline(connection, identifier) {
  if (identifier) {
    await connection.send('Page.removeScriptToEvaluateOnNewDocument', { identifier });
  }
  await connection.send('Runtime.evaluate', {
    expression: [
      '(() => {',
      "  delete navigator.onLine;",
      "  delete window.__myscouteeQaOffline;",
      "  window.dispatchEvent(new Event('online'));",
      '})()'
    ].join('\n')
  });
}

async function readTargetOnlineState(connection, expectedOnline) {
  let lastValue = null;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const response = await connection.send('Runtime.evaluate', {
      expression: 'navigator.onLine',
      returnByValue: true
    }).catch(() => null);
    if (typeof response?.result?.value === 'boolean') {
      lastValue = response.result.value;
      if (lastValue === expectedOnline) {
        return lastValue;
      }
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return lastValue;
}

async function openTargetConnection(port, targetId) {
  const targetSocket = new WebSocket(`ws://localhost:${port}/devtools/page/${targetId}`);
  let targetRequestId = 0;
  const targetPending = new Map();

  targetSocket.on('message', data => {
    const message = JSON.parse(String(data));
    const request = targetPending.get(message.id);
    if (!request) {
      return;
    }
    targetPending.delete(message.id);
    if (message.error) {
      request.reject(new Error(message.error.message ?? JSON.stringify(message.error)));
      return;
    }
    request.resolve(message.result);
  });
  targetSocket.on('close', () => {
    for (const request of targetPending.values()) {
      request.reject(new Error('Chrome page target connection closed.'));
    }
    targetPending.clear();
  });
  await new Promise((resolve, reject) => {
    targetSocket.once('open', resolve);
    targetSocket.once('error', reject);
  });

  return {
    send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = ++targetRequestId;
        targetPending.set(id, { resolve, reject });
        targetSocket.send(JSON.stringify({ id, method, params }));
      });
    },
    isOpen: () => targetSocket.readyState === WebSocket.OPEN,
    onClose: listener => targetSocket.once('close', listener),
    offClose: listener => targetSocket.off('close', listener),
    close: () => {
      if (targetSocket.readyState === WebSocket.OPEN) {
        targetSocket.close();
      }
    }
  };
}

async function listPages() {
  const { targetInfos } = await send('Target.getTargets');
  const pages = [];
  for (const target of targetInfos.filter(candidate =>
    candidate.type === 'page' && /^https?:\/\/localhost(?::\d+)?\//.test(candidate.url)
  )) {
    const { sessionId } = await send('Target.attachToTarget', {
      targetId: target.targetId,
      flatten: true
    });
    try {
      const { result } = await send('Runtime.evaluate', {
        expression: [
          '(() => {',
          "  const keys = ['myscoutee.http.session.v1', 'myscoutee.demo.session.v1'];",
          '  let session = null;',
          '  for (const key of keys) {',
          '    try { session = JSON.parse(localStorage.getItem(key) || "null"); } catch {}',
          '    if (session) break;',
          '  }',
          '  return {',
          '    online: navigator.onLine,',
          '    kind: session?.kind || null,',
          "    userId: session?.kind === 'demo' ? session.userId : (session?.profile?.id || null)",
          '  };',
          '})()'
        ].join('\n'),
        returnByValue: true
      }, sessionId);
      pages.push({
        targetId: target.targetId,
        title: target.title,
        url: target.url,
        online: result.value?.online === true,
        kind: result.value?.kind ?? null,
        userId: result.value?.userId ?? null
      });
    } finally {
      await send('Target.detachFromTarget', { sessionId }).catch(() => undefined);
    }
  }
  return pages;
}

function selectPage(pages) {
  const targetId = option('--target');
  const userId = option('--user-id');
  const matches = pages.filter(page =>
    targetId ? page.targetId === targetId : userId ? page.userId === userId : false
  );
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one matching Chrome page, found ${matches.length}. Run the list command first.`);
  }
  return matches[0];
}

function send(method, params = {}, sessionId = '') {
  return new Promise((resolve, reject) => {
    const id = ++requestId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({
      id,
      method,
      params,
      ...(sessionId ? { sessionId } : {})
    }));
  });
}

function waitForNetworkRelease(connection) {
  return new Promise(resolve => {
    let settled = false;
    const finish = reason => {
      if (settled) {
        return;
      }
      settled = true;
      process.off('SIGINT', onSigint);
      process.off('SIGTERM', onSigterm);
      connection.offClose(onSocketClose);
      resolve(reason);
    };
    const onSigint = () => finish('SIGINT');
    const onSigterm = () => finish('SIGTERM');
    const onSocketClose = () => finish('socket-close');
    process.once('SIGINT', onSigint);
    process.once('SIGTERM', onSigterm);
    connection.onClose(onSocketClose);
  });
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
  if (socket?.readyState === WebSocket.OPEN) {
    socket.close();
  }
}

if (!(command === 'offline' && hasFlag('--hold'))) {
  setTimeout(() => {
    if (socket && socket.readyState !== WebSocket.CLOSED) {
      fail('Chrome DevTools command timed out.');
      socket.terminate();
    }
  }, 15_000).unref();
}
