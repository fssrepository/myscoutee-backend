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
if (!['NOTIFICATION-ADMIN-LIFECYCLE-001', 'JOB-MESSAGES', 'BELL-RATING-LIFECYCLE-001', 'BELL-RATING-FEEDBACK-001', 'ADMIN-MONITORING-001'].includes(checkpointId)) throw new Error('Unsupported delegated checkpoint');
const root = path.join(os.tmpdir(), 'myscoutee-qa-browser-sessions');
const manifest = JSON.parse(readFileSync(path.join(root, checkpointId + '.json'), 'utf8'));
const session = manifest.sessions.find(item => item.actor === actor);
if (!session || manifest.checkpointId !== checkpointId) throw new Error('Missing managed checkpoint actor.');
const evidence = path.join(root, 'evidence', checkpointId === 'ADMIN-MONITORING-001' ? 'admin-monitoring-cdp' : checkpointId === 'JOB-MESSAGES' ? 'job-messages-cdp' : checkpointId.startsWith('BELL-RATING-') ? 'bell-rating-cdp' : 'notification-admin-cdp');
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
const target = targets.find(item => item.type === 'page' && /^http:\/\/localhost(?:\/|$)/.test(item.url));
if (!target) throw new Error('Existing localhost page missing.');
const page = await new CDP(target.webSocketDebuggerUrl).ready();
try {
  if (action === 'inspect') {
    console.log(JSON.stringify(await page.evaluate(`({url: location.origin + location.pathname, text: document.body.innerText.slice(0,22000),
      controls: [...document.querySelectorAll('button,a,input,textarea,[role="button"]')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&r.left<innerWidth&&r.right>0&&r.top<innerHeight&&r.bottom>0})
        .map(e=>({tag:e.tagName,text:(e.innerText||e.getAttribute('aria-label')||e.getAttribute('placeholder')||'').slice(0,110),aria:e.getAttribute('aria-label'),title:e.getAttribute('title'),class:e.className}))})`),null,2));
  } else if (action === 'eval') {
    console.log(JSON.stringify(await page.evaluate(readFileSync(0,'utf8')),null,2));
  } else if (action === 'click') {
    const box = await page.evaluate(`(() => { const e = document.querySelectorAll(${JSON.stringify(args[0])})[${Number(args[1]||0)}]; if(!e) throw Error('Click target missing'); e.scrollIntoView({block:'nearest'}); const r=e.getBoundingClientRect(); const x=r.x+r.width/2,y=r.y+r.height/2; if(x<0||x>innerWidth||y<0||y>innerHeight||!e.contains(document.elementFromPoint(x,y)))throw Error('Control is offscreen or covered');return {x,y}; })()`);
    await page.send('Input.dispatchMouseEvent', {type:'mousePressed',button:'left',clickCount:1,...box});
    await page.send('Input.dispatchMouseEvent', {type:'mouseReleased',button:'left',clickCount:1,...box});
    await delay(600); console.log('Clicked configured existing-page control.');
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
    else await page.send('Emulation.setDeviceMetricsOverride', {width:Number(args[0]),height:800,deviceScaleFactor:1,mobile:false});
    await delay(400); console.log('Updated the existing QA page viewport.');
  } else if (action === 'reload') {
    await page.send('Page.reload'); await delay(1500); console.log('Reloaded the existing page after hot-deploy.');
  } else if (action === 'key') {
    const codes = {ArrowUp:38,ArrowDown:40,Tab:9,Enter:13,Escape:27};
    const key = args[0], code = codes[key];
    if (!code) throw new Error('Unsupported key');
    await page.send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:code});
    await page.send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key,windowsVirtualKeyCode:code});
    console.log('Key sent to focused control.');
  } else if (action === 'text') {
    await page.send('Input.insertText', { text: args[0] }); console.log('Text inserted.');
  } else if (action === 'shot') {
    const result = await page.send('Page.captureScreenshot', {format:'png'});
    const file=path.join(evidence, `${args[0] || actor.replaceAll(' ','-')}.png`);
    writeFileSync(file,Buffer.from(result.data,'base64'),{mode:0o600}); console.log(file);
  } else { throw new Error('Unsupported notification Admin action'); }
} finally { page.close(); }
