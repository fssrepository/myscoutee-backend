#!/usr/bin/env node
// User-delegated physical-device execution; only the local QA origin is targeted.
import WebSocket from '../../../frontend/node_modules/ws/index.js';
import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { once } from 'node:events';
import { createInterface } from 'node:readline';
const [action, ...args] = process.argv.slice(2);
const port = Number(process.env.QA_PHONE_CDP_PORT || 36087);
const origin = new URL(process.env.QA_PHONE_ORIGIN || 'http://localhost:8080').origin;
if (!['localhost', '127.0.0.1'].includes(new URL(origin).hostname)) throw Error('Phone QA requires an explicitly forwarded loopback origin');
const devicePort = Number(new URL(origin).port || (origin.startsWith('https:') ? 443 : 80));
const hostPort = Number(process.env.QA_PHONE_HOST_PORT || 80);
if (!Number.isInteger(hostPort) || hostPort < 1 || hostPort > 65535) throw Error('Invalid phone transport port');
const deviceMapping = `tcp:${devicePort}`, hostMapping = `tcp:${hostPort}`;
const mappingSuffix = `${deviceMapping} ${hostMapping}`;
const packageName = process.env.QA_PHONE_PACKAGE || 'org.chromium.webapk.af8b7eef107d7742f_v2';
if (!/^org\.chromium\.webapk\.[a-z0-9_]+$/.test(packageName)) throw Error('Invalid QA WebAPK package');
const runtimeDirectory = process.env.QA_PHONE_RUNTIME_DIR || fileURLToPath(new URL('../../../server/docker/.qa-mobile-runtime/', import.meta.url));
mkdirSync(runtimeDirectory, {recursive: true, mode: 0o700});
const transportSnapshot = path.join(runtimeDirectory, 'device-transport.before.json');
const screenSnapshot = path.join(runtimeDirectory, 'device-screen.before.json');
const chromePermissionSnapshot = path.join(runtimeDirectory, 'chrome-notifications.before.json');
if (action === 'snapshot-chrome-notifications' || action === 'restore-chrome-notifications') {
  const serial = execFileSync('adb', ['get-serialno'], { encoding: 'utf8' }).trim();
  if (action === 'snapshot-chrome-notifications') {
    if (existsSync(chromePermissionSnapshot)) throw Error('Chrome notification permission already has a restore point');
    const dump = execFileSync('adb', ['shell', 'dumpsys', 'package', 'com.android.chrome'], { encoding: 'utf8' });
    const permission = dump.match(/android\.permission\.POST_NOTIFICATIONS: granted=(true|false), flags=\[([^\]]*)\]/);
    if (!permission) throw Error('Chrome native notification permission not found');
    writeFileSync(chromePermissionSnapshot, JSON.stringify({ serial, granted: permission[1] === 'true',
      userSet: permission[2].includes('USER_SET'), userFixed: permission[2].includes('USER_FIXED') }), { mode: 0o600 });
    console.log(JSON.stringify({ action, originalGranted: permission[1] === 'true' }));
  } else {
    const saved = JSON.parse(readFileSync(chromePermissionSnapshot, 'utf8'));
    if (saved.serial !== serial) throw Error('Chrome permission snapshot belongs to another phone');
    const permission = 'android.permission.POST_NOTIFICATIONS';
    execFileSync('adb', ['shell', 'pm', saved.granted ? 'grant' : 'revoke', '--user', '0', 'com.android.chrome', permission]);
    execFileSync('adb', ['shell', 'pm', 'clear-permission-flags', '--user', '0', 'com.android.chrome', permission, 'user-set', 'user-fixed']);
    const flags = [saved.userSet && 'user-set', saved.userFixed && 'user-fixed'].filter(Boolean);
    if (flags.length) execFileSync('adb', ['shell', 'pm', 'set-permission-flags', '--user', '0', 'com.android.chrome', permission, ...flags]);
    unlinkSync(chromePermissionSnapshot);
    console.log(JSON.stringify({ action, restoredGranted: saved.granted }));
  }
  process.exit(0);
}
if (action === 'keep-screen-awake' || action === 'restore-screen') {
  const readSetting = (scope, key) => execFileSync('adb', ['shell', 'settings', 'get', scope, key], { encoding: 'utf8' }).trim();
  const serial = execFileSync('adb', ['get-serialno'], { encoding: 'utf8' }).trim();
  if (action === 'keep-screen-awake') {
    if (!existsSync(screenSnapshot)) writeFileSync(screenSnapshot, JSON.stringify({ serial,
      timeout: readSetting('system', 'screen_off_timeout'), stayOn: readSetting('global', 'stay_on_while_plugged_in') }), { mode: 0o600 });
    const saved = JSON.parse(readFileSync(screenSnapshot, 'utf8'));
    if (saved.serial !== serial) throw Error('Screen restore point belongs to another device');
    // USB stay-on prevents sleep, but Android can still dim at the screen timeout.
    // Keep the original value above for restoration after the device checkpoint.
    execFileSync('adb', ['shell', 'settings', 'put', 'system', 'screen_off_timeout', '2147483647']);
    execFileSync('adb', ['shell', 'svc', 'power', 'stayon', 'usb']);
    execFileSync('adb', ['shell', 'input', 'keyevent', 'KEYCODE_WAKEUP']);
  } else {
    const saved = JSON.parse(readFileSync(screenSnapshot, 'utf8'));
    if (saved.serial !== serial) throw Error('Screen restore point belongs to another device');
    for (const [scope, key, value] of [['system', 'screen_off_timeout', saved.timeout], ['global', 'stay_on_while_plugged_in', saved.stayOn]]) {
      if (!/^(null|[0-9]+)$/.test(value)) throw Error('Invalid retained screen setting');
      execFileSync('adb', ['shell', 'settings', value === 'null' ? 'delete' : 'put', scope, key, ...(value === 'null' ? [] : [value])]);
    }
    unlinkSync(screenSnapshot);
  }
  console.log(JSON.stringify({ action, timeout: readSetting('system', 'screen_off_timeout'), stayOn: readSetting('global', 'stay_on_while_plugged_in') }));
  process.exit(0);
}
if (action === 'prepare-transport') {
  if (existsSync(transportSnapshot)) throw Error('Restore the retained offline boundary before preparing transport');
  const mappings = execFileSync('adb', ['reverse', '--list'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  if (mappings.some(line => !line.endsWith(mappingSuffix))) throw Error('Unexpected reverse mapping; preserve existing transport');
  const forwards = execFileSync('adb', ['forward', '--list'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  if (forwards.some(line => line.includes(` tcp:${port} `) && !line.endsWith('localabstract:chrome_devtools_remote'))) {
    throw Error('QA CDP port is owned by another forward');
  }
  execFileSync('adb', ['reverse', deviceMapping, hostMapping]);
  execFileSync('adb', ['forward', `tcp:${port}`, 'localabstract:chrome_devtools_remote']);
  console.log('Prepared the configured QA reverse tunnel and Chrome inspection forward; device data/radios unchanged.');
  process.exit(0);
}
if (action === 'transport-offline') {
  if (existsSync(transportSnapshot)) throw Error('QA transport already has a retained restore point');
  const mappings = execFileSync('adb', ['reverse', '--list'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  if (mappings.length !== 1 || !mappings[0].endsWith('tcp:8080 tcp:80')) throw Error('Expected only the configured QA reverse mapping');
  writeFileSync(transportSnapshot, JSON.stringify({ local: deviceMapping, remote: hostMapping, cdpPort: port }));
  execFileSync('adb', ['reverse', '--remove', deviceMapping]);
  // Close retained HTTP sockets; the phone radios and Chrome data stay intact.
  execFileSync('adb', ['reconnect'], { stdio: 'pipe' });
  execFileSync('adb', ['wait-for-device'], { timeout: 15000 });
  execFileSync('adb', ['forward', `tcp:${port}`, 'localabstract:chrome_devtools_remote']);
  console.log('QA reverse transport disconnected; CDP restored.'); process.exit(0);
}
if (action === 'transport-online') {
  const saved = JSON.parse(readFileSync(transportSnapshot, 'utf8'));
  if (saved.local !== deviceMapping || saved.remote !== hostMapping || saved.cdpPort !== port) throw Error('Unexpected QA restore point');
  execFileSync('adb', ['reverse', saved.local, saved.remote]);
  execFileSync('adb', ['forward', `tcp:${port}`, 'localabstract:chrome_devtools_remote']);
  unlinkSync(transportSnapshot);
  console.log('Restored the recorded QA reverse transport and CDP.'); process.exit(0);
}
if (action === 'launch-browser') {
  const route = args[0] || '/entry';
  if (!route.startsWith('/') || route.startsWith('//')) throw Error('Only QA-relative paths allowed');
  execFileSync('adb', ['shell', 'am', 'start', '-a', 'android.intent.action.VIEW',
    '-d', `${origin}${route}`, 'com.android.chrome'], { stdio: 'pipe' });
  console.log('Opened the local QA origin in Chrome; existing browser storage retained.');
  process.exit(0);
}
if (action === 'launch' || action === 'cold-launch') {
  if (action === 'cold-launch') execFileSync('adb', ['shell', 'am', 'force-stop', packageName]);
  const component = execFileSync('adb', ['shell', 'cmd', 'package', 'resolve-activity', '--brief', packageName], { encoding: 'utf8' }).trim().split('\n').at(-1);
  execFileSync('adb', ['shell', 'am', 'start', '-n', component], { stdio: 'pipe' });
  console.log('Launched the installed local QA PWA.'); process.exit(0);
}
const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then(r => r.json());
const pages = targets.filter(p => p.type === 'page' && p.url.startsWith(`${origin}/`));
const target = args.includes('--target') ? pages.find(p => p.id === args[args.indexOf('--target') + 1]) : pages[0];
if (!target) throw Error('No existing local QA page');
if (action === 'close-qa-page') {
  const response = await fetch(`http://127.0.0.1:${port}/json/close/${encodeURIComponent(target.id)}`);
  if (!response.ok) throw Error('Chrome did not accept closing the selected QA page');
  console.log('Closed the selected localhost QA page; installation and storage retained.');
  process.exit(0);
}
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
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = ++sequence;
  const timer = setTimeout(() => { pending.delete(id); reject(Error(`${method} timed out`)); }, 20000);
  pending.set(id, { resolve, reject, timer }); socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
});
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result?.value;
};
const tap = async (selector, index = 0) => {
  const point = await evaluate(`(()=>{const e=document.querySelectorAll(${JSON.stringify(selector)})[${Number(index)}];if(!e)throw Error('Control missing');const r=e.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;if(e.disabled||!r.width||!r.height||!e.contains(document.elementFromPoint(x,y)))throw Error('Control covered, offscreen or disabled');return{x,y}})()`);
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
};
try {
  if (action === 'trace-entry') {
    // Observe only this origin's entry requests; never log auth headers/tokens.
    socket.on('message', data => {
      const message = JSON.parse(data);
      if (message.method === 'Network.requestWillBeSent') {
        const {request, requestId} = message.params;
        const url = new URL(request.url);
        if (url.origin !== origin || !/^\/api\/(auth\/|.*location.*eligibility)/.test(url.pathname)) return;
        console.log(JSON.stringify({event: 'request', at: new Date().toISOString(), requestId,
          path: url.pathname, method: request.method,
          query: Object.fromEntries([...url.searchParams].filter(([key]) => ['latitude', 'longitude', 'groupId'].includes(key))),
          locationHeaders: Object.keys(request.headers).filter(key => /^x-.*(location|latitude|longitude)/i.test(key))}));
      } else if (message.method === 'Network.responseReceived') {
        const {response, requestId} = message.params;
        const url = new URL(response.url);
        if (url.origin === origin && url.pathname.startsWith('/api/auth/')) {
          console.log(JSON.stringify({event: 'response', at: new Date().toISOString(), requestId,
            path: url.pathname, status: response.status}));
        }
      }
    });
    await send('Network.enable');
    console.log(JSON.stringify({event: 'ready', origin}));
    const input = createInterface({input: process.stdin});
    await new Promise(resolve => {
      process.once('SIGINT', resolve); process.once('SIGTERM', resolve);
      input.on('line', line => {if (line.trim() === 'stop') resolve();});
      input.once('close', resolve);
    });
    input.close();
    await send('Network.disable');
  } else if (action === 'inspect') {
    console.log(JSON.stringify(await evaluate(`(async()=>({
      path:location.pathname,visible:document.visibilityState,standalone:matchMedia('(display-mode: standalone)').matches,
      identity:JSON.parse(localStorage.getItem('myscoutee.http.session.v1')||'null')?.userId||null,
      buildId:document.querySelector('meta[name="myscoutee-build-id"]')?.content||null,
      worker:!!navigator.serviceWorker.controller,cacheNames:await caches.keys(),
      text:document.body.innerText.slice(0,16000),
      controls:[...document.querySelectorAll('button,input,textarea,[role="button"]')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&r.top<innerHeight&&r.bottom>0}).map(e=>({tag:e.tagName,text:(e.innerText||e.getAttribute('aria-label')||'').slice(0,110),aria:e.getAttribute('aria-label'),placeholder:e.getAttribute('placeholder'),class:e.className}))
    }))()`), null, 2));
  } else if (action === 'language') {
    const language = args[0];
    if (!['en', 'hu'].includes(language)) throw Error('Use language en|hu');
    // Browser-level language configuration for this QA target; no injected
    // application state, translation bundles or navigator property replacement.
    const original = await evaluate('({userAgent:navigator.userAgent,platform:navigator.platform,acceptLanguage:navigator.languages.join(",")})');
    const input = createInterface({input: process.stdin});
    try {
      await send('Network.setUserAgentOverride', {...original, acceptLanguage: language === 'en' ? 'en-US,en' : 'hu-HU,hu'});
      await send('Page.reload');
      console.log(JSON.stringify({action, language, restoreOnStop: true}));
      await new Promise(resolve => {
        process.once('SIGINT', resolve); process.once('SIGTERM', resolve);
        input.once('close', resolve);
        input.on('line', line => {if (line.trim() === 'stop') resolve();});
      });
    } finally {
      input.close();
      await send('Network.setUserAgentOverride', original);
      await send('Page.reload');
      console.log('Restored the original browser language and reloaded the QA target.');
    }
  } else if (action === 'permission') {
    const [name, setting] = args;
    if (!['geolocation', 'clipboard-read'].includes(name) || !['granted', 'denied', 'prompt'].includes(setting)) {
      throw Error('Use permission geolocation|clipboard-read granted|denied|prompt');
    }
    const before = await evaluate(`navigator.permissions.query({name:${JSON.stringify(name)}}).then(p=>p.state)`);
    const permission = name === 'clipboard-read' ? { name: 'clipboard-read', allowWithoutSanitization: true } : { name };
    await send('Browser.setPermission', { permission, setting, origin });
    console.log(JSON.stringify({ origin, name, before, setting }));
    console.log('Permission override retained. Send stop to detach and restore the native setting.');
    const input = createInterface({ input: process.stdin });
    await new Promise(resolve => {
      process.once('SIGINT', resolve); process.once('SIGTERM', resolve);
      input.on('line', line => { if (line.trim() === 'stop') resolve(); });
      input.once('close', resolve);
    });
    input.close();
  } else if (action === 'eval') console.log(JSON.stringify(await evaluate(readFileSync(0, 'utf8')), null, 2));
  else if (action === 'click') {
    await tap(args[0], args[1] || 0);
  } else if (action === 'logout-back') {
    // Final device cleanup also exercises native Back while a real confirmation
    // is busy. Hold only this page's logout request, then release it unchanged.
    let held, timer;
    const paused = new Promise((resolve, reject) => {
      timer = setTimeout(() => reject(Error('Logout request was not observed')), 10000);
      socket.on('message', data => {
        const message = JSON.parse(data);
        if (message.method !== 'Fetch.requestPaused') return;
        held = message.params.requestId;
        clearTimeout(timer);
        resolve();
      });
    });
    const state = () => evaluate(`(()=>{const d=document.querySelector('app-dialog');return {path:location.pathname,confirmation:d?.innerText??'',busy:!!d?.querySelector('button:disabled'),workspace:document.querySelector('[aria-label="Munkatér kiválasztása"],[aria-label="Choose workspace"]')?.innerText}})()`);
    await send('Fetch.enable', { patterns: [{ urlPattern: 'http://localhost:8080/api/auth/me/logout', requestStage: 'Request' }] });
    try {
      await tap(args[0]);
      await paused;
      const before = await state();
      const afterBack = [];
      for (let i = 0; i < 2; i++) {
        execFileSync('adb', ['shell', 'input', 'keyevent', 'KEYCODE_BACK']);
        await new Promise(resolve => setTimeout(resolve, 350));
        afterBack.push(await state());
      }
      await send('Fetch.continueRequest', { requestId: held });
      held = null;
      for (let i = 0; i < 80 && await evaluate('location.pathname') !== '/entry'; i++)
        await new Promise(resolve => setTimeout(resolve, 100));
      console.log(JSON.stringify({ before, afterBack, completed: await state() }, null, 2));
    } finally {
      clearTimeout(timer);
      if (held) await send('Fetch.continueRequest', { requestId: held });
      await send('Fetch.disable');
    }
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
  } else if (action === 'backend-offline' || action === 'network-offline') {
    // Fixture-only CDP shaping: keep phone radios/tethering and native caches intact.
    // Include this origin's service worker so its fetches cannot bypass page shaping.
    const origin = new URL(target.url).origin;
    const workers = new Map();
    let offline = true;
    let stopping = false;
    const apply = sessionId => action === 'network-offline'
      ? send('Network.emulateNetworkConditions', { offline, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }, sessionId)
      : send('Network.setBlockedURLs', { urls: offline ? [`${origin}/api/*`] : [] }, sessionId);
    const attachWorker = info => {
      if (stopping || info.type !== 'service_worker' || !info.url.startsWith(`${origin}/`) || workers.has(info.targetId)) return;
      const task = (async () => {
        const { sessionId } = await send('Target.attachToTarget', { targetId: info.targetId, flatten: true });
        await send('Network.enable', {}, sessionId);
        await apply(sessionId);
        return sessionId;
      })();
      workers.set(info.targetId, task);
      task.catch(error => console.error(`QA worker shaping failed: ${error.message}`));
    };
    const onTarget = data => {
      const event = JSON.parse(data);
      if (event.method === 'Target.targetCreated' || event.method === 'Target.targetInfoChanged') attachWorker(event.params.targetInfo);
    };
    const input = createInterface({ input: process.stdin });
    try {
      socket.on('message', onTarget);
      await send('Target.setDiscoverTargets', { discover: true });
      const { targetInfos } = await send('Target.getTargets');
      targetInfos.forEach(attachWorker);
      await send('Network.enable');
      await apply();
      await Promise.all([...workers.values()]);
      console.log(`${action}: QA page and ${workers.size} same-origin workers shaped. Send online/offline or stop. Phone radios unchanged.`);
      await new Promise(resolve => {
        process.once('SIGINT', resolve); process.once('SIGTERM', resolve);
        input.once('close', resolve);
        input.on('line', async line => {
          if (line.trim() === 'stop') { resolve(); return; }
          if (line.startsWith('eval ')) {
            try { console.log(JSON.stringify(await evaluate(line.slice(5)))); }
            catch (error) { console.error(error.message); }
            return;
          }
          if (!['online', 'offline'].includes(line.trim())) return;
          try {
            offline = line.trim() === 'offline';
            if (offline) await apply();
            await Promise.all([...workers.values()].map(async task => apply(await task)));
            // The page's online event can immediately fetch through its worker.
            // Restore worker transport before exposing that event to the app.
            if (!offline) await apply();
            console.log(`QA transport ${line.trim()}; page and workers updated.`);
          } catch (error) { console.error(error.message); resolve(); }
        });
      });
    } finally {
      stopping = true;
      socket.off('message', onTarget);
      input.close();
      offline = false;
      const restoration = await Promise.allSettled([...workers.values()].map(async task => {
        const sessionId = await task;
        try { await apply(sessionId); } finally { await send('Target.detachFromTarget', { sessionId }); }
      }));
      restoration.push(...await Promise.allSettled([apply()]));
      await send('Target.setDiscoverTargets', { discover: false });
      if (restoration.some(result => result.status === 'rejected')) {
        throw Error('Transport restoration needs inspection: a page or worker detached during the test.');
      }
      console.log('Restored QA page and worker transport.');
    }
  } else if (action === 'close-other-qa-tabs') {
    const isPwa = await evaluate(`matchMedia('(display-mode: standalone)').matches`);
    if (!isPwa) throw Error('Launch the QA PWA before closing its browser controls');
    for (const page of pages.filter(p => p.id !== target.id)) await send('Target.closeTarget', { targetId: page.id });
    console.log('Closed only other localhost:8080 QA pages.');
  } else throw Error('Usage: mobile-webview-device.mjs launch|inspect|eval|click|text|navigate|backend-offline|network-offline|drag-notification|close-other-qa-tabs');
} finally {
  try {
    if (action === 'permission') {
      // Remove only debugger overrides; Chrome's native site decisions remain.
      await send('Browser.resetPermissions');
      console.log('Removed QA permission overrides; native site settings restored.');
    }
  } finally { socket.close(); }
}
