#!/usr/bin/env node
// Explicitly delegated 2026-09-23 QA only. Attaches to versioned-launcher sessions; never creates logins.
import { readFile, writeFile } from 'node:fs/promises';
const [checkpoint, actor = '0', command = 'inspect', input = '', output = ''] = process.argv.slice(2);
if (!['EVENT-GALLERY-FEED-001', 'OPERATOR-EMAIL-WARNING-001', 'ADMIN-CLIENT-API-001', 'ADMIN-CLIENT-MONITOR-001', 'AFFILIATE-INVITATION-001', 'EMAIL-UNSUBSCRIBE-001'].includes(checkpoint)) throw Error('Unsupported checkpoint');
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
  if (['eval', 'upload', 'screenshot', 'viewport', 'viewport-eval', 'fail-request', 'pointer-check'].includes(command)) await send('Page.bringToFront');
  if (command === 'pointer-check') {
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
  } else if (command === 'fail-request') {
    const { urlPattern, clickSelector, upload } = JSON.parse(await readFile(input, 'utf8'));
    const intercepted = new Promise((resolve, reject) => {
      const listener = async event => {
        const message = JSON.parse(event.data);
        if (message.method !== 'Fetch.requestPaused') return;
        ws.removeEventListener('message', listener);
        try {
          const request = message.params.request;
          await send('Fetch.failRequest', { requestId: message.params.requestId, errorReason: 'Failed' });
          resolve({ failedUrl: request.url, method: request.method });
        } catch (error) { reject(error); }
      };
      ws.addEventListener('message', listener);
    });
    await send('Fetch.enable', { patterns: [{ urlPattern, requestStage: 'Request' }] });
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
  } else if (command === 'viewport-eval') {
    const { width, height, script } = JSON.parse(await readFile(input, 'utf8'));
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    try {
      result = (await send('Runtime.evaluate', { expression: await readFile(script, 'utf8'), awaitPromise: true, returnByValue: true })).result.value;
    } finally { await send('Emulation.clearDeviceMetricsOverride'); }
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
