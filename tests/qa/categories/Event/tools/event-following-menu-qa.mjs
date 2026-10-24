#!/usr/bin/env node
// Explicitly delegated EVENT-FOLLOWING-002 browser actions. No app API substitution.
import { readFile, writeFile } from 'node:fs/promises';
import WebSocket from '../../../../../frontend/node_modules/ws/index.js';
const [command='inspect', value='', actor='0'] = process.argv.slice(2);
const checkpoint='EVENT-FOLLOWING-002';
const manifest=JSON.parse(await readFile(`/tmp/myscoutee-qa-browser-sessions/${checkpoint}.json`,'utf8'));
const port=manifest.sessions[Number(actor)].devToolsPort;
const pages=await fetch(`http://127.0.0.1:${port}/json/list`).then(r=>r.json());
const page=pages.find(p=>p.type==='page' && p.url.startsWith('http://localhost/game'));
if(!page)throw Error('Managed game page missing');
const ws=new WebSocket(page.webSocketDebuggerUrl), pending=new Map(), responses=[], requests=[];
let serial=0; const observed=new Map(), bodyTasks=[];
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
ws.on('message',raw=>{const m=JSON.parse(String(raw)); if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}return;}
 if(m.method==='Network.requestWillBeSent' && m.params.request.url.includes('/activities/'))requests.push({method:m.params.request.method,url:m.params.request.url});
 if(m.method==='Network.responseReceived' && (m.params.response.url.endsWith('/activities/events/following') || m.params.response.url.endsWith('/auth/me/realtime/long-poll')))observed.set(m.params.requestId,{status:m.params.response.status,poll:m.params.response.url.endsWith('/auth/me/realtime/long-poll')});
 if(m.method==='Network.loadingFinished' && observed.has(m.params.requestId))bodyTasks.push(send('Network.getResponseBody',{requestId:m.params.requestId}).then(r=>responses.push({status:observed.get(m.params.requestId).status,body:observed.get(m.params.requestId).poll?{poll:true,following:JSON.parse(r.body).following}:JSON.parse(r.body)})));
});
await new Promise((resolve,reject)=>{ws.once('open',resolve);ws.once('error',reject);});
const deadline=setTimeout(()=>{ws.close();throw Error('QA action deadline');},55000);
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true,userGesture:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||JSON.stringify(r.exceptionDetails));return r.result.value;};
const click=async (label,scope='body')=>evaluate(`(()=>{const root=document.querySelector(${JSON.stringify(scope)});const b=[...(root?.querySelectorAll('button')??[])].find(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&(e.getAttribute('aria-label')===${JSON.stringify(label)}||e.innerText.trim()===${JSON.stringify(label)}||e.innerText.trim().split('\\n').at(-1)===${JSON.stringify(label)});});if(!b)throw Error('Button missing: '+${JSON.stringify(label)});if(b.disabled)throw Error('Button disabled');b.scrollIntoView({block:'nearest'});b.click();return b.innerText;})()`);
const snapshot=()=>evaluate(`(()=>({dialog:document.querySelector('.dialog-panel')?.innerText??null,error:document.querySelector('.dialog-error')?.innerText??null,dialogButtons:[...document.querySelectorAll('.dialog-panel button')].map(b=>({text:b.innerText,disabled:b.disabled})),badge:document.querySelector('.navigator-followed-action')?.innerText,following:ng.getComponent(document.querySelector('app-side-menu'))?.followingStore.state(),members:document.querySelector('app-event-members-popup')?.innerText,cards:[...document.querySelectorAll('app-event-explore-popup app-info-card')].map(e=>e.innerText),buttons:[...document.querySelectorAll('button')].filter(b=>{const r=b.getBoundingClientRect();return r.width&&r.height&&r.right>0&&r.left<innerWidth}).map(b=>({text:b.innerText,aria:b.getAttribute('aria-label')}))}))()`);
let immediate=null, extra=null;
try {
 await send('Network.enable');
 if(command==='prepare'){
  if(await evaluate(`!!document.querySelector('app-setup-popup button[aria-label="Close"]')`))await click('Close','app-setup-popup');
  if(await evaluate(`document.body.innerText.includes('Approve privacy')`))await click('Approve privacy','app-document-viewer');
  await delay(500);
  if(await evaluate(`!!document.querySelector('button[aria-label="Open user menu"]')`))await click('Open user menu');
 } else if(command==='activities') await click('Open invitations');
 else if(command==='menu') await evaluate(`(()=>{const c=[...document.querySelectorAll('app-info-card')].find(e=>e.innerText.includes(${JSON.stringify(value)}));if(!c)throw Error('Card missing');const b=c.querySelector('button[aria-label="Open card actions"]');if(!b)throw Error('Card menu missing');b.scrollIntoView({block:'nearest'});b.click();})()`);
 else if(command==='click')await click(value);
 else if(command==='cancel')await click('Cancel','.dialog-panel');
 else if(command==='confirm'){
  if(value==='delay')await send('Network.emulateNetworkConditions',{offline:false,latency:1500,downloadThroughput:-1,uploadThroughput:-1});
  if(value==='fail')await send('Network.setBlockedURLs',{urls:['*activities/events/following']});
  await evaluate(`(()=>{const b=[...document.querySelectorAll('.dialog-actions button')].filter(b=>!b.innerText.includes('Cancel')).at(-1);if(!b)throw Error('Confirmation missing');b.click();})()`);
  await delay(120);immediate=await snapshot();
  for(let i=0;i<70;i++){const busy=await evaluate(`!![...document.querySelectorAll('.dialog-actions button')].find(b=>b.disabled)`);if(!busy)break;await delay(150);}
 } else if(command==='followed'){
  await evaluate(`document.querySelector('.navigator-followed-action').click()`);
 } else if(command==='reload'){await send('Page.reload',{ignoreCache:true});await delay(1700);}
 else if(command==='repeat'){extra=await evaluate(`(()=>{const c=ng.getComponent(document.querySelector('app-side-menu'));return c.followingStore.service.change(c.userProfileStore.activeUserId(),'6af011000000000000000003',false);})()`);}
 else if(command==='poll'){for(let i=0;i<90&&!responses.some(r=>r.body.poll);i++)await delay(500);if(!responses.some(r=>r.body.poll))throw Error('No ordinary poll observed');}
 else if(command==='external'){
  await click('External info');await delay(500);
  const tabs=await send('Target.getTargets');const tab=tabs.targetInfos.find(t=>t.type==='page'&&t.url==='http://localhost/entry?qa=event-following-menu');
  if(!tab)throw Error('Expected external-link target did not open');extra={externalUrl:tab.url};await send('Target.closeTarget',{targetId:tab.targetId});
 } else if(command==='screenshot'){
  const result=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(value,Buffer.from(result.data,'base64'));extra={screenshot:value};
 } else if(command!=='inspect')throw Error('Unknown command');
 await delay(650);await Promise.all(bodyTasks);
 const result={at:new Date().toISOString(),command,value,actor,immediate,state:await snapshot(),requests,responses,extra};
 const evidence=new URL('../../../../../.e2e-artifacts/qa/EVENT-FOLLOWING-002-20260922-browser.json',import.meta.url);
 let log=[];try{log=JSON.parse(await readFile(evidence,'utf8'));}catch{}
 log.push(result);await writeFile(evidence,JSON.stringify(log,null,2)+'\n');
 console.log(JSON.stringify(result,null,2));
}finally{await send('Network.setBlockedURLs',{urls:[]}).catch(()=>{});await send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1}).catch(()=>{});clearTimeout(deadline);ws.close();}
