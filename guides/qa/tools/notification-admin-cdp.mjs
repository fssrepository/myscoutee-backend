#!/usr/bin/env node
// Explicitly user-authorized CDP execution of NOTIFICATION-ADMIN-LIFECYCLE-001. Never launches a browser.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { EventEmitter, once } from 'node:events';
import path from 'node:path';
import os from 'node:os';
import WebSocket from '../../../frontend/node_modules/ws/index.js';

const [action, actor = 'Ava', ...args] = process.argv.slice(2);
const checkpointId = process.env.QA_CHECKPOINT || 'NOTIFICATION-ADMIN-LIFECYCLE-001';
if (!['NOTIFICATION-ADMIN-LIFECYCLE-001', 'JOB-MESSAGES', 'BELL-RATING-LIFECYCLE-001', 'BELL-RATING-FEEDBACK-001', 'ADMIN-MONITORING-001', 'ADMIN-AFFINITY-GRAPH-001', 'ADMIN-PARAMETERS-001', 'OPERATOR-FIREBASE-001', 'OPERATOR-REGISTRY-LIFECYCLE-001', 'OPERATOR-REVENUE-LIFECYCLE-001', 'OPERATOR-UPDATE-LIFECYCLE-001'].includes(checkpointId)) throw new Error('Unsupported delegated checkpoint');
const root = path.join(os.tmpdir(), 'myscoutee-qa-browser-sessions');
const manifest = JSON.parse(readFileSync(path.join(root, checkpointId + '.json'), 'utf8'));
const session = manifest.sessions.find(item => item.actor === actor);
if (!session || manifest.checkpointId !== checkpointId) throw new Error('Missing managed checkpoint actor.');
const evidence = path.join(root, 'evidence', checkpointId === 'OPERATOR-UPDATE-LIFECYCLE-001' ? 'operator-update-cdp' : checkpointId === 'OPERATOR-REVENUE-LIFECYCLE-001' ? 'operator-revenue-cdp' : checkpointId === 'OPERATOR-REGISTRY-LIFECYCLE-001' ? 'operator-registry-cdp' : checkpointId === 'OPERATOR-FIREBASE-001' ? 'operator-configuration-cdp' : checkpointId === 'ADMIN-PARAMETERS-001' ? 'admin-parameters-cdp' : checkpointId === 'ADMIN-AFFINITY-GRAPH-001' ? 'admin-affinity-graph-cdp' : checkpointId === 'ADMIN-MONITORING-001' ? 'admin-monitoring-cdp' : checkpointId === 'JOB-MESSAGES' ? 'job-messages-cdp' : checkpointId.startsWith('BELL-RATING-') ? 'bell-rating-cdp' : 'notification-admin-cdp');
mkdirSync(evidence, { recursive: true, mode: 0o700 });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
class CDP extends EventEmitter {
  constructor(url) {
    super(); this.id = 0; this.pending = new Map(); this.socket = new WebSocket(url);
    this.socket.on('message', data => {
      const message = JSON.parse(String(data));
      if (message.id) {
        const pending = this.pending.get(message.id); if (!pending) return;
        clearTimeout(pending.timer); this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message)); else pending.resolve(message.result);
      } else this.emit(message.method, message.params);
    });
    this.socket.on('error', () => {});
  }
  async ready() { if (this.socket.readyState !== WebSocket.OPEN) await once(this.socket, 'open'); return this; }
  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`${method} timed out`)); }, 20000);
      this.pending.set(id, {resolve, reject, timer}); this.socket.send(JSON.stringify({id, method, params}));
    });
  }
  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result?.value;
  }
  close() { this.socket.close(); }
}
const targets = await fetch(`http://127.0.0.1:${session.devToolsPort}/json/list`).then(r => r.json());
const target = targets.find(item => item.type === 'page' && (checkpointId === 'OPERATOR-UPDATE-LIFECYCLE-001' ? /^https:\/\/localhost(?:\/|$)/ : /^http:\/\/localhost(?:\/|$)/).test(item.url));
if (!target) throw new Error('Existing localhost page missing.');
const page = await new CDP(target.webSocketDebuggerUrl).ready();
try {
  if (action === 'inspect') {
    console.log(JSON.stringify(await page.evaluate(`({url: location.origin + location.pathname, text: document.body.innerText.slice(0,22000),
      controls: [...document.querySelectorAll('button,a,input,textarea,[role="button"]')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&r.left<innerWidth&&r.right>0&&r.top<innerHeight&&r.bottom>0})
        .map(e=>({tag:e.tagName,text:(e.innerText||e.getAttribute('aria-label')||e.getAttribute('placeholder')||'').slice(0,110),aria:e.getAttribute('aria-label'),title:e.getAttribute('title'),class:e.className}))})`),null,2));
  } else if (action === 'eval') {
    console.log(JSON.stringify(await page.evaluate(readFileSync(0,'utf8')),null,2));
  } else if (action === 'frame-click' || action === 'frame-range') {
    const selector = JSON.stringify(args[0]);
    const box = await page.evaluate(`(() => {const f=document.querySelector('iframe'),e=f?.contentDocument?.querySelector(${selector});if(!e)throw Error('Frame control missing');const r=e.getBoundingClientRect(),b=f.getBoundingClientRect();if(!r.width||!r.height)throw Error('Frame control hidden');const offset=${action === 'frame-range' ? 'true' : 'false'} ? 9+(r.width-18)*(Number(e.value)-Number(e.min))/(Number(e.max)-Number(e.min)) : r.width/2;return {x:b.x+r.x+offset,y:b.y+r.y+r.height/2};})()`);
    await page.send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...box});
    await page.send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...box});
    if(action === 'frame-range') {
      const range=await page.evaluate(`(()=>{const e=document.querySelector('iframe').contentDocument.querySelector(${selector});return {min:Number(e.min),max:Number(e.max),step:Number(e.step||1)}})()`);
      const count=Math.round((Number(args[1])-range.min)/range.step);
      if(count<0||count>100||Number(args[1])>range.max)throw Error('Range value invalid');
      for(const key of ['Home',...Array(count).fill('ArrowRight')]){const code=key==='Home'?36:39;for(const type of ['keyDown','keyUp'])await page.send('Input.dispatchKeyEvent',{type,key,code:key,windowsVirtualKeyCode:code});}
    }
    await delay(700);console.log('Native input sent to existing frame control.');
  } else if (action === 'drag') {
    const [x,y,endX,endY]=args.slice(0,4).map(Number),button=args[4]||'left';
    if(![x,y,endX,endY].every(Number.isFinite)||!['left','right'].includes(button))throw Error('Invalid drag');
    await page.send('Input.dispatchMouseEvent',{type:'mousePressed',button,buttons:button==='left'?1:2,clickCount:1,x,y});
    for(let i=1;i<=12;i++)await page.send('Input.dispatchMouseEvent',{type:'mouseMoved',button,buttons:button==='left'?1:2,x:x+(endX-x)*i/12,y:y+(endY-y)*i/12});
    await page.send('Input.dispatchMouseEvent',{type:'mouseReleased',button,clickCount:1,x:endX,y:endY});
    await delay(700);console.log('Native canvas drag completed.');
  } else if (action === 'click') {
    const box = await page.evaluate(`(() => { const e = document.querySelectorAll(${JSON.stringify(args[0])})[${Number(args[1]||0)}]; if(!e) throw Error('Click target missing'); e.scrollIntoView({block:'nearest'}); const r=e.getBoundingClientRect(); const x=r.x+r.width/2,y=r.y+r.height/2; if(x<0||x>innerWidth||y<0||y>innerHeight||!e.contains(document.elementFromPoint(x,y)))throw Error('Control is offscreen or covered');return {x,y}; })()`);
    await page.send('Input.dispatchMouseEvent', {type:'mousePressed',button:'left',clickCount:1,...box});
    await page.send('Input.dispatchMouseEvent', {type:'mouseReleased',button:'left',clickCount:1,...box});
    await delay(600); console.log('Clicked configured existing-page control.');
  } else if (action === 'graph-click-trace') {
    if(checkpointId !== 'ADMIN-AFFINITY-GRAPH-001')throw Error('Graph checkpoint required');
    const read = `(()=>{const w=document.querySelector('iframe').contentWindow,p=w.affinityGraphPreview;return {t:performance.now(),selected:p.selected,mode:p.viewMode,camera:p.cameraState(),positions:p.visibleNodeIds.map(id=>({id,...p.screenPositionForNode(id)}))}})()`;
    const samples=[await page.evaluate(read)];
    const x=Number(args[0]),y=Number(args[1]);
    await page.send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,x,y});
    await page.send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,x,y});
    for(let i=0;i<65;i++){samples.push(await page.evaluate(read));await delay(16);}
    const file=path.join(evidence,`${args[2]||'graph-click-trace'}.json`);
    writeFileSync(file,JSON.stringify(samples,null,2),{mode:0o600});
    console.log(JSON.stringify({file,selected:samples.at(-1).selected,minOnscreen:Math.min(...samples.filter(s=>s.selected).map(s=>s.positions.filter(p=>p.x>=0&&p.x<1017&&p.y>=0&&p.y<813&&p.z>=-1&&p.z<=1).length))}));
  } else if (action === 'point') {
    const x = Number(args[0]), y = Number(args[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !await page.evaluate(`(${x}>=0&&${y}>=0&&${x}<innerWidth&&${y}<innerHeight)`)) throw new Error('Point outside current viewport');
    await page.send('Input.dispatchMouseEvent', {type:'mousePressed',button:'left',clickCount:1,x,y});
    await page.send('Input.dispatchMouseEvent', {type:'mouseReleased',button:'left',clickCount:1,x,y});
    await delay(600); console.log('Clicked point from the inspected current screenshot.');
  } else if (action === 'wheel') {
    const x = Number(args[0]), y = Number(args[1]), deltaY = Number(args[2]);
    if (![x,y,deltaY].every(Number.isFinite) || Math.abs(deltaY)>1200 || !await page.evaluate(`(${x}>=0&&${y}>=0&&${x}<innerWidth&&${y}<innerHeight)`)) throw new Error('Invalid wheel input');
    await page.send('Input.dispatchMouseEvent', {type:'mouseWheel',x,y,deltaX:0,deltaY});
    await delay(1000); console.log('Scrolled the inspected existing viewport.');
  } else if (action === 'range') {
    const range = await page.evaluate(`(() => { const e=document.querySelector(${JSON.stringify(args[0])}); if(!e || e.type!=='range')throw Error('Range input missing');e.focus();return {min:Number(e.min),max:Number(e.max),step:Number(e.step||1)};})()`);
    const count = (Number(args[1]) - range.min) / range.step;
    if (!Number.isInteger(count) || count < 0 || count > 20 || Number(args[1]) > range.max) throw new Error('Unsupported range value');
    for (const key of ['Home', ...Array(count).fill('ArrowRight')]) {
      const code = key === 'Home' ? 36 : 39;
      await page.send('Input.dispatchKeyEvent', {type:'keyDown',key,code:key,windowsVirtualKeyCode:code});
      await page.send('Input.dispatchKeyEvent', {type:'keyUp',key,code:key,windowsVirtualKeyCode:code});
    }
    console.log('Selected range value through keyboard input; no Save invoked.');
  } else if (action === 'clear-draft') {
    await page.send('Page.bringToFront');
    await page.evaluate(`(()=>{const e=document.querySelector('textarea');e.focus();e.select()})()`);
    await page.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Backspace',code:'Backspace',windowsVirtualKeyCode:8});
    await page.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Backspace',code:'Backspace',windowsVirtualKeyCode:8});
    console.log(JSON.stringify({draftCleared:await page.evaluate(`document.querySelector('textarea')?.value===''`)}));
  } else if (action === 'close-window') {
    const network=[];await page.send('Network.enable');
    page.on('Network.requestWillBeSent',event=>{const u=new URL(event.request.url);if(u.origin==='http://localhost')network.push({path:u.pathname,method:event.request.method,t:event.timestamp})});
    const browserInfo=await fetch(`http://127.0.0.1:${session.devToolsPort}/json/version`).then(r=>r.json());
    const browser=await new CDP(browserInfo.webSocketDebuggerUrl).ready();
    await browser.send('Browser.close');await delay(1000);browser.close();
    writeFileSync(path.join(evidence,'casey-b-close-network.json'),JSON.stringify({actor,closedAt:new Date().toISOString(),network},null,2),{mode:0o600});
    console.log('Gracefully closed the existing managed browser; no logout or launcher cleanup invoked.');
  } else if (action === 'viewport') {
    if (args[0] === 'reset') {
      await page.send('Emulation.setDeviceMetricsOverride', {width:Number(args[1] || 596),height:813,deviceScaleFactor:1,mobile:false});
      await page.send('Emulation.clearDeviceMetricsOverride');
    }
    else await page.send('Emulation.setDeviceMetricsOverride', {width:Number(args[0]),height:Number(args[1] || 800),deviceScaleFactor:1,mobile:false});
    await delay(400); console.log('Updated the existing QA page viewport.');
  } else if (action === 'navigate') {
    const url = new URL(args[0], 'http://localhost');
    if (url.origin !== 'http://localhost') throw new Error('Only existing local QA application navigation is allowed');
    await page.send('Page.navigate', {url: url.href});
    await delay(1500); console.log('Navigated existing managed QA page.');
  } else if (action === 'reload') {
    await page.send('Page.reload'); await delay(1500); console.log('Reloaded the existing page after hot-deploy.');
  } else if (action === 'key') {
    const codes = {ArrowUp:38,ArrowDown:40,Tab:9,Enter:13,Escape:27};
    const key = args[0], code = codes[key];
    if (!code) throw new Error('Unsupported key');
    await page.send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:code});
    await page.send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key,windowsVirtualKeyCode:code});
    console.log('Key sent to focused control.');
  } else if (action === 'fill') {
    const box = await page.evaluate(`(()=>{const e=document.querySelectorAll(${JSON.stringify(args[0])})[${Number(args[2]||0)}];if(!e||e.disabled)throw Error('Editable input missing');e.scrollIntoView({block:'nearest'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
    for(const type of ['mousePressed','mouseReleased']) await page.send('Input.dispatchMouseEvent',{type,button:'left',clickCount:1,...box});
    for(const type of ['keyDown','keyUp']) await page.send('Input.dispatchKeyEvent',{type,key:'a',code:'KeyA',windowsVirtualKeyCode:65,modifiers:2});
    await page.send('Input.insertText',{text:args[1]});
    console.log('Replaced focused input through native keyboard input; no Save invoked.');
  } else if (action === 'text') {
    await page.send('Input.insertText', { text: args[0] }); console.log('Text inserted.');
  } else if (action === 'shot') {
    const result = await page.send('Page.captureScreenshot', {format:'png'});
    const file=path.join(evidence, `${args[0] || actor.replaceAll(' ','-')}.png`);
    writeFileSync(file,Buffer.from(result.data,'base64'),{mode:0o600}); console.log(file);
  } else { throw new Error('Unsupported notification Admin action'); }
} finally { page.close(); }
