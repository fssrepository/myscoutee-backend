#!/usr/bin/env node
// Explicitly delegated QA only (Group campaign delegated 2026-09-26).
// Attaches to versioned-launcher sessions; never creates logins.
import { readFile, writeFile } from 'node:fs/promises';
const [checkpoint, actor = '0', command = 'inspect', input = '', output = ''] = process.argv.slice(2);
if (!['ROLE-GUIDES-NOTIFICATIONS-001', 'MSC115-UI-REGRESSION', 'GROUP-LIFECYCLE-001-PENDING-BLOCK19', 'GROUP-LIFECYCLE-001-ENTRY-BLOCK19', 'GROUP-LIFECYCLE-001-MCP', 'GROUP-LIFECYCLE-001-CONTACT-INVITEES', 'GROUP-LIFECYCLE-001-CONTACTS', 'GROUP-LIFECYCLE-001-CASH', 'GROUP-LIFECYCLE-001-ENTRY', 'GROUP-LIFECYCLE-001-APP-ADMIN', 'GROUP-LIFECYCLE-001', 'GROUP-ISOLATION-001', 'GROUP-ISOLATION-001-OUTSIDER', 'INTEGRATION-API-GROUP-001', 'EVENT-GALLERY-FEED-001', 'OPERATOR-EMAIL-WARNING-001', 'ADMIN-CLIENT-API-001', 'ADMIN-CLIENT-MONITOR-001', 'AFFILIATE-INVITATION-001', 'EMAIL-UNSUBSCRIBE-001'].includes(checkpoint)) throw Error('Unsupported checkpoint');
const manifest = JSON.parse(await readFile(`/tmp/myscoutee-qa-browser-sessions/${checkpoint}.json`, 'utf8'));
const session = manifest.sessions[Number(actor)];
const targets = await fetch(`http://127.0.0.1:${session.devToolsPort}/json/list`).then(r => r.json());
const page = targets.find(t => t.type === 'page' && ['localhost', '127.0.0.1'].includes(new URL(t.url).hostname));
if (!page) throw Error('Managed page missing');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
let serial = 0;
const pending = new Map();
ws.addEventListener('message', event => {
  const value = JSON.parse(event.data);
  if (!value.id) return;
  const request = pending.get(value.id); if (!request) return;
  pending.delete(value.id);
  if (value.error || value.result?.exceptionDetails) request.reject(Error(JSON.stringify(value.error || value.result.exceptionDetails)));
  else request.resolve(value.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++serial; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params }));
});
const timeout = setTimeout(() => { ws.close(); process.exitCode = 1; for (const task of pending.values()) task.reject(Error('CDP timeout')); }, 30_000);
try {
  let result;
  if (['eval', 'upload', 'screenshot', 'viewport', 'viewport-eval', 'fail-request', 'delay-response', 'pointer-check', 'download-click'].includes(command)) await send('Page.bringToFront');
  if (command === 'close-window') {
    await send('Browser.close');
    result = { closed: true, actor: session.actor };
  } else if (command === 'type-text') {
    const { selector, text, characterByCharacter = false } = JSON.parse(await readFile(input, 'utf8'));
    await send('Page.bringToFront');
    await send('Runtime.evaluate', { expression: `(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Input missing');e.focus();e.select();})()` });
    const steps = [];
    for (const value of characterByCharacter ? [...text] : [text]) {
      await send('Input.insertText', { text: value });
      steps.push((await send('Runtime.evaluate', { expression: `(()=>{const e=document.querySelector(${JSON.stringify(selector)});return {value:e.value,caret:e.selectionStart,invalid:e.getAttribute('aria-invalid')};})()`, returnByValue: true })).result.value);
    }
    result = { steps };
  } else if (command === 'download-click') {
    const { selector, downloadPath, inspectScript } = JSON.parse(await readFile(input, 'utf8'));
    const downloads = [];
    const listener = event => {
      const message = JSON.parse(event.data);
      if (message.method === 'Browser.downloadWillBegin' || message.method === 'Browser.downloadProgress')
        downloads.push({ event: message.method, ...message.params });
    };
    ws.addEventListener('message', listener);
    await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath, eventsEnabled: true });
    try {
      await send('Runtime.evaluate', { expression: `document.querySelector(${JSON.stringify(selector)}).click()` });
      await new Promise(resolve => setTimeout(resolve, 1500));
      const state = inspectScript ? (await send('Runtime.evaluate', {
        expression: await readFile(inspectScript, 'utf8'), awaitPromise: true, returnByValue: true
      })).result.value : null;
      result = { downloads, state };
    } finally {
      ws.removeEventListener('message', listener);
      await send('Browser.setDownloadBehavior', { behavior: 'default', eventsEnabled: false });
    }
  } else if (command === 'pointer-check') {
    const expression = `(()=>{const e=document.querySelector(${JSON.stringify(input)});if(!e)throw Error('Card missing');const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {x:r.x+r.width/2,y:r.y+Math.min(r.height/2,70),transform:s.transform,filter:s.filter,shadow:s.boxShadow,after:getComputedStyle(e,'::after').animationName,image:e.querySelector('.ui-info-card__media')?.style.backgroundImage};})()`;
    const state = async () => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value;
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1 });
    await new Promise(resolve => setTimeout(resolve, 220));
    const before = await state();
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: before.x, y: before.y });
    await new Promise(resolve => setTimeout(resolve, 220));
    const hover = await state();
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: before.x, y: before.y, button: 'left', clickCount: 1 });
    await new Promise(resolve => setTimeout(resolve, 220));
    const pressed = await state();
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: before.x, y: before.y, button: 'left', clickCount: 1 });
    await new Promise(resolve => setTimeout(resolve, 250));
    result = { before, hover, pressed, after: await state() };
  } else if (command === 'delay-response') {
    const { urlPattern, clickSelector, delayMs = 3500, afterTimeoutScript, inspectScript } = JSON.parse(await readFile(input, 'utf8'));
    let held;
    const paused = new Promise(resolve => {
      ws.addEventListener('message', async event => {
        const message = JSON.parse(event.data);
        if (message.method !== 'Fetch.requestPaused') return;
        if (!held) { held = message.params; resolve(held); }
        else await send('Fetch.continueRequest', { requestId: message.params.requestId });
      });
    });
    const inspectExpression = inspectScript ? await readFile(inspectScript, 'utf8') : `({selected:document.querySelector('[aria-label="Choose workspace"]')?.innerText,disabled:document.querySelector('[aria-label="Choose workspace"]')?.disabled,alerts:[...document.querySelectorAll('[role="alert"]')].map(e=>e.innerText),body:document.body.innerText.slice(0,300)})`;
    const inspect = async () => (await send('Runtime.evaluate', { expression: inspectExpression, returnByValue: true })).result.value;
    await send('Fetch.enable', { patterns: [{ urlPattern, requestStage: 'Response' }] });
    try {
      if (clickSelector) await send('Runtime.evaluate', { expression: `document.querySelector(${JSON.stringify(clickSelector)}).click()` });
      const request = await paused;
      await new Promise(resolve => setTimeout(resolve, 150));
      const during = await inspect();
      await new Promise(resolve => setTimeout(resolve, delayMs));
      const timedOut = await inspect();
      const retry = afterTimeoutScript ? (await send('Runtime.evaluate', { expression: await readFile(afterTimeoutScript, 'utf8'), awaitPromise: true, returnByValue: true })).result.value : null;
      let release;
      try { await send('Fetch.continueRequest', { requestId: request.requestId }); release = 'released'; }
      catch (error) { release = String(error.message); }
      await new Promise(resolve => setTimeout(resolve, 250));
      result = { url: request.request.url, during, timedOut, retry, release, after: await inspect() };
    } finally { await send('Fetch.disable'); }
  } else if (command === 'fail-request') {
    const { urlPattern, clickSelector, upload, requestStage = 'Request' } = JSON.parse(await readFile(input, 'utf8'));
    const intercepted = new Promise((resolve, reject) => {
      const listener = async event => {
        const message = JSON.parse(event.data);
        if (message.method !== 'Fetch.requestPaused') return;
        ws.removeEventListener('message', listener);
        try {
          const request = message.params.request;
          await send('Fetch.failRequest', { requestId: message.params.requestId, errorReason: 'Failed' });
          resolve({ failedUrl: request.url, method: request.method, requestStage, responseStatus: message.params.responseStatusCode ?? null });
        } catch (error) { reject(error); }
      };
      ws.addEventListener('message', listener);
    });
    await send('Fetch.enable', { patterns: [{ urlPattern, requestStage }] });
    try {
      if (upload) {
        const tree = await send('DOM.getDocument');
        const { nodeId } = await send('DOM.querySelector', { nodeId: tree.root.nodeId, selector: upload.selector });
        if (!nodeId) throw Error('Upload input missing');
        await send('DOM.setFileInputFiles', { nodeId, files: upload.files });
      } else {
        await send('Runtime.evaluate', { expression: `document.querySelector(${JSON.stringify(clickSelector)}).click()` });
      }
      result = await intercepted;
    } finally { await send('Fetch.disable'); }
  } else if (command === 'screenshot') {
    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    await writeFile(input, Buffer.from(shot.data, 'base64')); result = { screenshot: input };
  } else if (command === 'upload') {
    const { selector, files } = JSON.parse(await readFile(input, 'utf8'));
    const tree = await send('DOM.getDocument');
    const { nodeId } = await send('DOM.querySelector', { nodeId: tree.root.nodeId, selector });
    if (!nodeId) throw Error('Upload input missing');
    await send('DOM.setFileInputFiles', { nodeId, files }); result = { uploaded: files.length };
  } else if (command === 'frame-eval') {
    const { pathname, pathnamePrefix, script } = JSON.parse(await readFile(input, 'utf8'));
    if (!pathname && pathnamePrefix !== '/register/') throw Error('A specific frame path is required');
    const tree = await send('Page.getFrameTree');
    const findFrame = node => (pathname ? new URL(node.frame.url).pathname === pathname
      : new URL(node.frame.url).pathname.startsWith(pathnamePrefix))
      ? node.frame : (node.childFrames ?? []).map(findFrame).find(Boolean);
    const frame = findFrame(tree.frameTree);
    if (!frame) throw Error('Requested managed-page frame is not open');
    const { executionContextId } = await send('Page.createIsolatedWorld', { frameId: frame.id, worldName: 'manual-qa-dom' });
    result = (await send('Runtime.evaluate', { contextId: executionContextId,
      expression: await readFile(script, 'utf8'), awaitPromise: true, returnByValue: true })).result.value;
  } else if (command === 'language-eval') {
    const { language, script, width, height, restore = true } = JSON.parse(await readFile(input, 'utf8'));
    if (!['en-US', 'hu-HU'].includes(language)) throw Error('Unsupported QA browser language');
    const browser = (await send('Runtime.evaluate', { expression: '({userAgent:navigator.userAgent,languages:navigator.languages})', returnByValue: true })).result.value;
    try {
      if (width && height) await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
      await send('Emulation.setLocaleOverride', { locale: language });
      await send('Network.setUserAgentOverride', { userAgent: browser.userAgent, acceptLanguage: `${language},${language.slice(0, 2)}` });
      await send('Page.reload');
      await new Promise(resolve => setTimeout(resolve, 1500));
      result = (await send('Runtime.evaluate', { expression: await readFile(script, 'utf8'), awaitPromise: true, returnByValue: true })).result.value;
    } finally {
      if (width && height) await send('Emulation.clearDeviceMetricsOverride');
      if (restore) {
        await send('Emulation.setLocaleOverride', { locale: '' });
        await send('Network.setUserAgentOverride', { userAgent: browser.userAgent, acceptLanguage: browser.languages.join(',') });
        await send('Page.reload');
      }
    }
  } else if (command === 'viewport-eval') {
    const { width, height, script, swipe } = JSON.parse(await readFile(input, 'utf8'));
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    try {
      if (swipe) {
        await send('Emulation.setTouchEmulationEnabled', { enabled: true });
        await new Promise(resolve => setTimeout(resolve, 150));
        const expression = `(()=>{const e=document.querySelector(${JSON.stringify(swipe.selector)});if(!e)throw Error('Swipe surface missing');const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+Math.min(r.height/2,120),left:e.scrollLeft};})()`;
        const positions = [];
        for (const distance of swipe.distances) {
          const before = (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value;
          await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: before.x, y: before.y }] });
          for (let step = 1; step <= 12; step++) {
            await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: before.x + distance * step / 12, y: before.y }] });
            await new Promise(resolve => setTimeout(resolve, 16));
          }
          await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
          await new Promise(resolve => setTimeout(resolve, 200));
          const after = (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value;
          positions.push({ distance, before: before.left, after: after.left });
        }
        console.log(JSON.stringify({ nativeTouchSwipes: positions }));
      }
      result = (await send('Runtime.evaluate', { expression: await readFile(script, 'utf8'), awaitPromise: true, returnByValue: true })).result.value;
    } finally {
      if (swipe) await send('Emulation.setTouchEmulationEnabled', { enabled: false });
      await send('Emulation.clearDeviceMetricsOverride');
    }
  } else if (command === 'viewport') {
    const size = JSON.parse(input);
    result = size ? await send('Emulation.setDeviceMetricsOverride', { ...size, deviceScaleFactor: 1, mobile: false })
      : await send('Emulation.clearDeviceMetricsOverride');
  } else if (command === 'bounds') {
    const info = await send('Browser.getWindowForTarget');
    await send('Browser.setWindowBounds', { windowId: info.windowId, bounds: { windowState: 'normal' } });
    const { x: left, y: top, width, height } = session.position;
    await send('Browser.setWindowBounds', { windowId: info.windowId, bounds: { left, top, width, height } });
    result = await send('Browser.getWindowBounds', { windowId: info.windowId });
  } else {
    const expression = command === 'eval' ? await readFile(input, 'utf8') : command === 'inspect' ? `({url:location.origin+location.pathname,text:document.body.innerText,buttons:[...document.querySelectorAll('button')].filter(e=>e.getBoundingClientRect().height>0).map(e=>({text:e.innerText,aria:e.getAttribute('aria-label'),disabled:e.disabled})),inputs:[...document.querySelectorAll('input,textarea')].map(e=>({type:e.type,placeholder:e.placeholder,aria:e.getAttribute('aria-label')}))})` : null;
    if (!expression) throw Error('Unsupported command');
    result = (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value;
  }
  const serialized = JSON.stringify(result, null, 2);
  if (output) await writeFile(output, serialized + '\n');
  console.log(serialized);
} finally { clearTimeout(timeout); ws.close(); }
