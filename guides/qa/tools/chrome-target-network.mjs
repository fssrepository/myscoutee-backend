#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import WebSocket from '../../../frontend/node_modules/ws/index.js';

const args = process.argv.slice(2);
const command = args[0] ?? 'list';
const option = name => {
  const index = args.indexOf(name);
  return index >= 0 ? `${args[index + 1] ?? ''}`.trim() : '';
};
const hasFlag = name => args.includes(name);

let socket = null;

if (!['list', 'inspect', 'online', 'offline', 'open-demo', 'close'].includes(command)) {
  fail([
    'Usage:',
    '  chrome-target-network.mjs list [--port PORT | --endpoint-file FILE]',
    '  chrome-target-network.mjs inspect --user-id ID [--port PORT | --endpoint-file FILE]',
    '  chrome-target-network.mjs online|offline [--user-id ID | --target ID] [--reload | --hard-reload | --navigate-root]',
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
            '(() => {',
            "  const text = value => `${value ?? ''}`.replace(/\\s+/g, ' ').trim();",
            "  const elements = [...document.querySelectorAll('button, [role=button], a, input, select, textarea')];",
            '  return {',
            '    title: document.title,',
            '    url: location.href,',
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
          returnByValue: true
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

    const selected = selectPage(pages);
    if (command === 'close') {
      await send('Target.closeTarget', { targetId: selected.targetId });
      console.log(JSON.stringify({ targetId: selected.targetId, action: 'closed' }));
      socket.close();
      return;
    }
    const { sessionId } = await send('Target.attachToTarget', {
      targetId: selected.targetId,
      flatten: true
    });
    try {
      await send('Network.enable', {}, sessionId);
      const offline = command === 'offline';
      await send('Network.emulateNetworkConditions', {
        offline,
        latency: 0,
        downloadThroughput: offline ? 0 : -1,
        uploadThroughput: offline ? 0 : -1,
        connectionType: offline ? 'none' : 'wifi'
      }, sessionId);

      if (hasFlag('--hard-reload')) {
        await send('Network.setBypassServiceWorker', { bypass: true }, sessionId);
        await send('Page.reload', { ignoreCache: true }, sessionId);
      } else if (hasFlag('--navigate-root')) {
        const pageUrl = new URL(selected.url);
        await send('Page.navigate', { url: `${pageUrl.origin}/` }, sessionId);
      } else if (hasFlag('--reload')) {
        await send('Page.reload', { ignoreCache: false }, sessionId);
      }

      console.log(JSON.stringify({
        targetId: selected.targetId,
        userId: selected.userId,
        previousUrl: selected.url,
        network: command,
        action: hasFlag('--hard-reload')
          ? 'hard-reload'
          : hasFlag('--navigate-root')
            ? 'navigate-root'
            : hasFlag('--reload')
              ? 'reload'
              : 'none'
      }));
    } finally {
      await send('Target.detachFromTarget', { sessionId }).catch(() => undefined);
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

function fail(message) {
  console.error(message);
  process.exitCode = 1;
  if (socket?.readyState === WebSocket.OPEN) {
    socket.close();
  }
}

setTimeout(() => {
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    fail('Chrome DevTools command timed out.');
    socket.terminate();
  }
}, 15_000).unref();
