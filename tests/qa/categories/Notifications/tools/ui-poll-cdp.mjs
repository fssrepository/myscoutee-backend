#!/usr/bin/env node
// Explicitly user-authorized CDP execution of UI-POLL-JANK-001. Never launches a browser.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { EventEmitter, once } from 'node:events';
import path from 'node:path';
import os from 'node:os';
import WebSocket from '../../../../../frontend/node_modules/ws/index.js';

const [action, actor = 'Ava', ...args] = process.argv.slice(2);
const root = path.join(os.tmpdir(), 'myscoutee-qa-browser-sessions');
const manifest = JSON.parse(readFileSync(path.join(root, 'UI-POLL-JANK-001.json'), 'utf8'));
const session = manifest.sessions.find(item => item.actor === actor);
if (!session || manifest.checkpointId !== 'UI-POLL-JANK-001') throw new Error('Missing managed checkpoint actor.');
const evidence = path.join(root, 'evidence', 'ui-poll-cdp');
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
  } else if (action === 'reload') {
    await page.send('Page.reload'); await delay(1500); console.log('Reloaded the existing page after hot-deploy.');
  } else if (action === 'text') {
    await page.send('Input.insertText', { text: args[0] }); console.log('Text inserted.');
  } else if (action === 'shot') {
    const result = await page.send('Page.captureScreenshot', {format:'png'});
    const file=path.join(evidence, `${args[0] || actor.replaceAll(' ','-')}.png`);
    writeFileSync(file,Buffer.from(result.data,'base64'),{mode:0o600}); console.log(file);
  } else if (action === 'trace') {
    const [name, secondsText='30', scrollSelector=''] = args;
    if (!/^[a-z-]+$/.test(name)) throw new Error('Trace name must be a simple label.');
    const seconds=Number(secondsText); if(seconds<20 || seconds>60) throw new Error('Trace duration must be 20–60 seconds.');
    await page.send('Page.bringToFront');
    const viewport = await page.evaluate('({width:innerWidth,height:innerHeight})');
    await page.evaluate(`(() => {
      window.__qaPoll = {start:performance.now(), frames:[], longTasks:[], mutations:[], scrolls:[],ruleSamples:[]};
      const state=window.__qaPoll; let last=performance.now();
      const tick=t=>{state.frames.push({t,dt:t-last});last=t;state.raf=requestAnimationFrame(tick)}; state.raf=requestAnimationFrame(tick);
      state.longObserver=new PerformanceObserver(list=>{for(const e of list.getEntries()) state.longTasks.push({t:e.startTime,duration:e.duration,name:e.name})});state.longObserver.observe({type:'longtask',buffered:false});
      state.domObserver=new MutationObserver(list=>{const t=performance.now();for(const m of list){const e=m.target.nodeType===1?m.target:m.target.parentElement;const row=e?.closest('[data-smart-list-anchor]');state.mutations.push({t,type:m.type,tag:e?.tagName,class:e?.className||'',detail:Boolean(e?.closest('.process-detail-scroll')),row:row?.getAttribute('data-smart-list-anchor')||'',text:(e?.textContent||'').slice(0,100)})}});
      state.domObserver.observe(document.body,{childList:true,subtree:true,characterData:true});
      const componentElement=document.querySelector('app-admin-notifications-popup');
      const component=window.ng&&componentElement?ng.getComponent(componentElement):null;
      if(component?.state){
        const refs=new WeakMap();let sequence=0;const ref=o=>{if(!o)return null;if(!refs.has(o))refs.set(o,++sequence);return refs.get(o)};
        let previous=new Map();
        const sample=()=>{const rules=component.state()?.rules||[];const changed=[];
          for(const r of rules){const serialized=JSON.stringify(r);const old=previous.get(r.ruleKey);if(old&&old.serialized!==serialized)changed.push(r.ruleKey);previous.set(r.ruleKey,{serialized,ref:ref(r)})}
          const dom=[...componentElement.querySelectorAll('[data-smart-list-anchor]')].map(e=>({key:e.getAttribute('data-smart-list-anchor'),ref:ref(e)}));
          state.ruleSamples.push({t:performance.now(),changed,rows:rules.map(r=>({key:r.ruleKey,ref:ref(r)})),detailRef:ref(component.detailRule()),selectedKey:component.selectedRuleKey(),detailOpen:component.detailOpen(),dom});};
        sample();state.sampleTimer=setInterval(sample,250);
      }

      return {start:state.start};
    })()`);
    const network=[];const requests=new Map();const responses=[];
    page.on('Network.requestWillBeSent', event=>{
      const url=new URL(event.request.url);if(url.origin!=='http://localhost')return;
      const item={id:event.requestId,t:event.timestamp,path:url.pathname,method:event.request.method};requests.set(event.requestId,item);network.push({...item,type:'request'});
    });
    page.on('Network.responseReceived', event=>{
      const item=requests.get(event.requestId);if(item){item.status=event.response.status;network.push({id:item.id,t:event.timestamp,path:item.path,status:item.status,type:'response'});}
    });
    page.on('Network.webSocketFrameReceived', event=>network.push({type:'websocket-received',t:event.timestamp,length:event.response.payloadData.length}));
    page.on('Network.loadingFinished', event=>{
      const item=requests.get(event.requestId);if(!item || !item.path.startsWith('/api/admin/notifications'))return;
      responses.push(page.send('Network.getResponseBody',{requestId:event.requestId}).then(result=>{
        const body=JSON.parse(result.body);const rules=body.rules||body.items||[];
        network.push({type:'center-body',t:event.timestamp,path:item.path,bodyHash:digest(body),keys:Object.keys(body),
          rules:rules.map(rule=>({key:rule.ruleKey||rule.id,hash:digest(rule)}))});
      }).catch(()=>{}));
    });
    await page.send('Network.enable');
    await page.send('Tracing.start',{categories:'devtools.timeline,blink.user_timing,loading,latencyInfo,toplevel,disabled-by-default-devtools.timeline',transferMode:'ReturnAsStream'});
    let sender=null;let sent=false;let typed=0;const probe='UI-POLL-JANK-001 typing probe';
    if(name==='chat') {
      const senderSession=manifest.sessions.find(item=>item.actor==='Ava');
      const senderTargets=await fetch(`http://127.0.0.1:${senderSession.devToolsPort}/json/list`).then(r=>r.json());
      const senderTarget=senderTargets.find(item=>item.type==='page'&&item.url.startsWith('http://localhost/game'));
      sender=await new CDP(senderTarget.webSocketDebuggerUrl).ready();
      const ready=await sender.evaluate(`JSON.parse(localStorage.getItem('myscoutee.http.session.v1')||'null')?.userId==='650000000000000000000062'&&document.querySelector('textarea')?.value==='UI-POLL-JANK-001 live message'`);
      if(!ready)throw new Error('Nova producer identity or exact draft is not ready.');
    }
    const started=Date.now();let tick=0;
    while(Date.now()-started < seconds*1000) {
      const elapsed=(Date.now()-started)/1000;
      const x=viewport.width/2+Math.cos(elapsed*2)*100,y=180+Math.sin(elapsed*2)*65;
      await page.send('Input.dispatchMouseEvent',{type:'mouseMoved',x,y});
      if(name==='chat'&&elapsed>=5&&typed<probe.length&&tick%2===0){await page.send('Input.insertText',{text:probe[typed++]});}
      if(sender&&!sent&&elapsed>=seconds/2){
        const box=await sender.evaluate(`(()=>{const e=document.querySelector('button[aria-label="Send message"]');if(!e||e.disabled)throw Error('Send is not ready');const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);
        await sender.send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...box});
        await sender.send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...box});sent=true;
        network.push({type:'producer-message-click',elapsedSeconds:elapsed});
      }

      if(scrollSelector && tick%10===0 && (!name.includes('detail') || elapsed>=seconds/2)) {
        const point=await page.evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(scrollSelector)});if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,top:e.scrollTop}})()`);
        if(point){await page.evaluate(`window.__qaPoll.scrolls.push({t:performance.now(),top:${point.top}})`);await page.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:point.x,y:point.y,deltaX:0,deltaY:(elapsed<seconds*(name.includes('detail')?.75:.5)?30:-30)*(name==='chat'?-1:1)});}
      }
      tick++;await delay(50);
    }
    sender?.close();
    const completed=once(page,'Tracing.tracingComplete');await page.send('Tracing.end');const [complete]=await completed;
    let trace='';for(;;){const chunk=await page.send('IO.read',{handle:complete.stream,size:1048576});trace+=chunk.base64Encoded?Buffer.from(chunk.data,'base64').toString():chunk.data;if(chunk.eof)break;}await page.send('IO.close',{handle:complete.stream});
    const observation=await page.evaluate(`(()=>{const s=window.__qaPoll;cancelAnimationFrame(s.raf);clearInterval(s.sampleTimer);s.longObserver.disconnect();s.domObserver.disconnect();return {start:s.start,end:performance.now(),frames:s.frames,longTasks:s.longTasks,mutations:s.mutations,ruleSamples:s.ruleSamples,scrolls:s.scrolls,draft:document.querySelector('textarea')?.value,liveMessageBubbleCount:[...document.querySelectorAll('.chat-thread-list [data-smart-list-anchor]')].filter(e=>e.textContent.includes('UI-POLL-JANK-001 live message')).length,text:document.body.innerText.slice(0,20000)}})()`);
    await Promise.allSettled(responses);await page.send('Network.disable');
    for(const item of manifest.sessions) if(item.sessionId)trace=trace.replaceAll(item.sessionId,'[REDACTED-SESSION]');
    const traceFile=path.join(evidence,`${name}.trace.json`);writeFileSync(traceFile,trace,{mode:0o600});
    writeFileSync(path.join(evidence,`${name}.observations.json`),JSON.stringify({seconds,actor,observation,network},null,2),{mode:0o600});
    console.log(JSON.stringify({name,seconds,traceFile,frames:observation.frames.length,longTasks:observation.longTasks,mutations:observation.mutations.length,networkResponses:network.filter(e=>e.type==='response').map(e=>({path:e.path,status:e.status}))},null,2));
  } else throw new Error('Unknown action.');
} finally {page.close();}
