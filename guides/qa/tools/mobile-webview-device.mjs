#!/usr/bin/env node
// User-delegated physical-device execution; only the local QA origin is targeted.
import WebSocket from '../../../frontend/node_modules/ws/index.js';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { createInterface } from 'node:readline';
const [action, ...args] = process.argv.slice(2);
const port = Number(process.env.QA_PHONE_CDP_PORT || 36087);
const packageName = process.env.QA_PHONE_PACKAGE || 'org.chromium.webapk.af8b7eef107d7742f_v2';
if (!/^org\.chromium\.webapk\.[a-z0-9_]+$/.test(packageName)) throw Error('Invalid QA WebAPK package');
const transportSnapshot = fileURLToPath(new URL('../../../server/docker/.qa-mobile-runtime/device-transport.before.json', import.meta.url));
if (action === 'transport-offline') {
  if (existsSync(transportSnapshot)) throw Error('QA transport already has a retained restore point');
  const mappings = execFileSync('adb', ['reverse', '--list'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  if (mappings.length !== 1 || !mappings[0].endsWith('tcp:8080 tcp:80')) throw Error('Expected only the configured QA reverse mapping');
  writeFileSync(transportSnapshot, JSON.stringify({ local: 'tcp:8080', remote: 'tcp:80', cdpPort: port }));
  execFileSync('adb', ['reverse', '--remove', 'tcp:8080']);
  // Close retained HTTP sockets; the phone radios and Chrome data stay intact.
  execFileSync('adb', ['reconnect'], { stdio: 'pipe' });
  execFileSync('adb', ['wait-for-device'], { timeout: 15000 });
  execFileSync('adb', ['forward', `tcp:${port}`, 'localabstract:chrome_devtools_remote']);
  console.log('QA reverse transport disconnected; CDP restored.'); process.exit(0);
}
if (action === 'transport-online') {
  const saved = JSON.parse(readFileSync(transportSnapshot, 'utf8'));
  if (saved.local !== 'tcp:8080' || saved.remote !== 'tcp:80' || saved.cdpPort !== port) throw Error('Unexpected QA restore point');
  execFileSync('adb', ['reverse', saved.local, saved.remote]);
  execFileSync('adb', ['forward', `tcp:${port}`, 'localabstract:chrome_devtools_remote']);
  unlinkSync(transportSnapshot);
  console.log('Restored the recorded QA reverse transport and CDP.'); process.exit(0);
}
if (action === 'launch' || action === 'cold-launch') {
  if (action === 'cold-launch') execFileSync('adb', ['shell', 'am', 'force-stop', packageName]);
  const component = execFileSync('adb', ['shell', 'cmd', 'package', 'resolve-activity', '--brief', packageName], { encoding: 'utf8' }).trim().split('\n').at(-1);
  execFileSync('adb', ['shell', 'am', 'start', '-n', component], { stdio: 'pipe' });
  console.log('Launched the installed local QA PWA.'); process.exit(0);
}
const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json());
const pages = targets.filter(p => p.type === 'page' && p.url.startsWith('http://localhost:8080/'));
const target = args.includes('--target') ? pages.find(p => p.id === args[args.indexOf('--target') + 1]) : pages[0];
if (!target) throw Error('No existing local QA page');
const socket = new WebSocket(target.webSocketDebuggerUrl);
let sequence = 0;
const pending = new Map();
socket.on('message', data => {
  const message = JSON.parse(data), request = pending.get(message.id);
  if (!request) return;
  clearTimeout(request.timer); pending.delete(message.id);
  message.error ? request.reject(Error(message.error.message)) : request.resolve(message.result);
});
await once(socket, 'open');
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  const timer = setTimeout(() => { pending.delete(id); reject(Error(`${method} timed out`)); }, 20000);
  pending.set(id, { resolve, reject, timer }); socket.send(JSON.stringify({ id, method, params }));
});
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result?.value;
};
try {
  if (action === 'inspect') {
    console.log(JSON.stringify(await evaluate(`(async()=>({
      path:location.pathname,visible:document.visibilityState,standalone:matchMedia('(display-mode: standalone)').matches,
      identity:JSON.parse(localStorage.getItem('myscoutee.http.session.v1')||'null')?.userId||null,
      buildId:document.querySelector('meta[name="myscoutee-build-id"]')?.content||null,
      worker:!!navigator.serviceWorker.controller,cacheNames:await caches.keys(),
      text:document.body.innerText.slice(0,16000),
      controls:[...document.querySelectorAll('button,input,textarea,[role="button"]')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&r.top<innerHeight&&r.bottom>0}).map(e=>({tag:e.tagName,text:(e.innerText||e.getAttribute('aria-label')||'').slice(0,110),aria:e.getAttribute('aria-label'),placeholder:e.getAttribute('placeholder'),class:e.className}))
    }))()`), null, 2));
  } else if (action === 'eval') console.log(JSON.stringify(await evaluate(readFileSync(0, 'utf8')), null, 2));
  else if (action === 'click') {
    const point = await evaluate(`(()=>{const e=document.querySelectorAll(${JSON.stringify(args[0])})[${Number(args[1] || 0)}];if(!e)throw Error('Control missing');e.scrollIntoView({block:'nearest'});const r=e.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;if(!e.contains(document.elementFromPoint(x,y)))throw Error('Control covered');return{x,y}})()`);
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else if (action === 'drag-notification') {
    const start = await evaluate(`(()=>{const r=document.querySelector('.notification-attention-menu button')?.getBoundingClientRect();if(!r)throw Error('Notification control missing');return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] });
    await new Promise(resolve => setTimeout(resolve, 450));
    let end = { x: start.x - 90, y: start.y - 100 };
    if (args[0] === 'dismiss') {
      // The existing menu exposes its dismiss target after drag activation.
      await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x - 8, y: start.y - 8 }] });
      await new Promise(resolve => setTimeout(resolve, 200));
      end = await evaluate(`(()=>{const r=document.querySelector('.notification-attention-dismiss-target')?.getBoundingClientRect();if(!r)throw Error('Dismiss target missing');return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);
    }
    for (let step = 1; step <= 10; step++) {
      await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x + (end.x - start.x) * step / 10, y: start.y + (end.y - start.y) * step / 10 }] });
      await new Promise(resolve => setTimeout(resolve, 35));
    }
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    console.log(args[0] === 'dismiss' ? 'Dragged the QA notification into its dismiss target.' : 'Moved the QA notification.');
  } else if (action === 'text') await send('Input.insertText', { text: args[0] });
  else if (action === 'navigate') {
    if (!args[0]?.startsWith('/') || args[0].startsWith('//')) throw Error('Only QA-relative paths allowed');
    await send('Page.navigate', { url: `http://localhost:8080${args[0]}` });
  } else if (action === 'login') {
    const userId = { Riley: '650000000000000000000063', Nova: '650000000000000000000062', Anna: 'bf057de7c586eede7e84bdc7' }[args[0]];
    if (!userId) throw Error('Unknown configured actor');
    console.log(JSON.stringify(await evaluate(`(async()=>{const userId=${JSON.stringify(userId)},sessionId='session:'+crypto.randomUUID();
      const r=await fetch('/api/auth/session/login',{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json','X-App-Session-Id':sessionId,'X-App-Session-Kind':'demo','X-Demo-User-Id':userId},body:JSON.stringify({attemptId:'attempt:'+crypto.randomUUID(),provider:'demo'})});
      const body=await r.json();if(!r.ok||!body.accepted)throw Error('QA login rejected: '+body.outcome);
      localStorage.setItem('myscoutee.http.session.v1',JSON.stringify({kind:'demo',userId,sessionId}));
      localStorage.setItem('myscoutee.http.demo.active-user.v1',userId);return{accepted:true,userId};})()`)));
  } else if (action === 'backend-offline' || action === 'network-offline') {
    await send('Network.enable');
    const setTransport = offline => action === 'network-offline'
      ? send('Network.emulateNetworkConditions', { offline, latency: 0, downloadThroughput: -1, uploadThroughput: -1 })
      : send('Network.setBlockedURLs', { urls: offline ? ['http://localhost:8080/api/*'] : [] });
    await setTransport(true);
    console.log(`${action}: QA target offline. Send online/offline, or stop to restore and detach.`);
    const input = createInterface({ input: process.stdin });
    await new Promise(resolve => {
      process.once('SIGINT', resolve); process.once('SIGTERM', resolve);
      input.on('line', async line => {
        if (line.trim() === 'stop') { resolve(); return; }
        if (!['online', 'offline'].includes(line.trim())) return;
        try {
          await setTransport(line.trim() === 'offline');
          console.log(`QA API ${line.trim()}; CDP attachment retained.`);
        } catch (error) { console.error(error.message); resolve(); }
      });
    });
    input.close();
    await setTransport(false);
    console.log('Restored QA transport.');
  } else if (action === 'close-other-qa-tabs') {
    const isPwa = await evaluate(`matchMedia('(display-mode: standalone)').matches`);
    if (!isPwa) throw Error('Launch the QA PWA before closing its browser controls');
    for (const page of pages.filter(p => p.id !== target.id)) await send('Target.closeTarget', { targetId: page.id });
    console.log('Closed only other localhost:8080 QA pages.');
  } else throw Error('Usage: mobile-webview-device.mjs launch|inspect|eval|click|text|navigate|login|backend-offline|network-offline|drag-notification|close-other-qa-tabs');
} finally { socket.close(); }
