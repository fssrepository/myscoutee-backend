#!/usr/bin/env node
// Authorized Feed UI supplement. Attaches only to retained versioned-launcher sessions.
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const {sessions} = JSON.parse(await readFile('/tmp/myscoutee-qa-browser-sessions/EVENT-GALLERY-FEED-001.json','utf8'));
const [owner,other,admin] = sessions;
assert.equal(owner.userId,'6a1100000000000000000001');
async function api(actor,path,method='GET',body){const r=await fetch('http://localhost/api'+path,{method,headers:{'Content-Type':'application/json','X-App-Session-Kind':'demo','X-App-Session-Id':actor.sessionId,'X-Demo-User-Id':actor.userId},...(body?{body:JSON.stringify(body)}:{})});assert.equal(r.status,200,path);return r.json();}
async function connect(actor){const targets=await fetch(`http://127.0.0.1:${actor.devToolsPort}/json/list`).then(r=>r.json());const page=targets.find(t=>t.type==='page'&&new URL(t.url).hostname==='localhost');assert.ok(page);const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let serial=0;const pending=new Map();ws.addEventListener('message',event=>{const m=JSON.parse(event.data);if(!m.id)return;const p=pending.get(m.id);pending.delete(m.id);if(m.error||m.result?.exceptionDetails)p.reject(Error(JSON.stringify(m.error||m.result.exceptionDetails)));else p.resolve(m.result);});const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});return {ws,send,eval:async source=>(await send('Runtime.evaluate',{expression:source,awaitPromise:true,returnByValue:true})).result.value};}
const browser=await connect(owner),viewer=await connect(other);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const open=`(async()=>{const wait=ms=>new Promise(r=>setTimeout(r,ms));if(!document.querySelector('app-photo-feed-popup')){if(!document.querySelector('.navigator-feed-action')){document.querySelector('[aria-label="Open user menu"]').click();await wait(200);}document.querySelector('.navigator-feed-action').click();await wait(700);}return true;})()`;
const report=[];const created=[];
const snapshot=()=>api(admin,`/admin/content-moderation/state?adminUserId=${admin.userId}`);
const original=(await snapshot()).settings;
async function setSettings(settings){const s=await snapshot();await api(admin,'/admin/content-moderation/settings','POST',{adminUserId:admin.userId,expectedRevision:s.revision,settings});}
try{
 await setSettings({enabled:true,autoApprove:false,delayMinutes:43200,categories:['feed']});
 for(const b of [browser,viewer]){await b.send('Page.reload');}
 await sleep(1500);await browser.eval(open);await viewer.eval(open);
 const existing=(await api(owner,`/activities/feed?userId=${owner.userId}&status=accepted&pageSize=50`)).items[0];
 const event=(await api(owner,`/activities/feed/events?userId=${owner.userId}&pageSize=50`)).items[0].event;
 const image=existing.imageUrls[0];
 // Viewer projection is initialized through an idempotent publication retry, not a read-side count repair.
 const viewerPost=(await api(other,`/activities/feed?userId=${other.userId}&status=accepted&pageSize=50`)).items[0];
 if(viewerPost)await api(other,'/activities/feed','POST',{userId:other.userId,id:viewerPost.id,imageUrls:[],imageDetails:{}});
 for(const bucket of ['under-review','accepted','rejected','blocked']){
  const id=crypto.randomUUID();created.push(id);
  await api(owner,'/activities/feed','POST',{userId:owner.userId,id,imageUrls:[image],imageDetails:{[image]:{event,caption:`QA UI remove ${bucket}`,location:''}}});
  let version=1;
  const transitions=bucket==='blocked'?['accepted','blocked']:bucket==='under-review'?[]:[bucket==='public'?'accepted':bucket];
  for(const status of transitions){const result=await api(admin,`/admin/content-moderation/${encodeURIComponent('feed:'+id)}/decision`,'POST',{adminUserId:admin.userId,commandId:crypto.randomUUID(),expectedVersion:version,status,message:''});version=result.item.version;}
  const label={'public':'Public feed','under-review':'Under moderation','accepted':'Accepted','rejected':'Rejected','blocked':'Blocked'}[bucket];
  await browser.eval(`(async()=>{const root=document.querySelector('app-photo-feed-popup');root.querySelector('header app-menu button').click();await new Promise(r=>setTimeout(r,100));const item=[...document.querySelectorAll('.app-menu__item')].find(e=>e.getBoundingClientRect().width>0&&e.innerText.includes(${JSON.stringify(label)}));if(!item)throw Error('Bucket menu missing');item.click();return true;})()`);
  let visible=false;
  for(let attempt=0;attempt<25;attempt++){visible=await browser.eval(`!!document.querySelector('[data-info-card-id="${id}"]')`);if(visible)break;await sleep(500);}
  assert.ok(visible,`${bucket} row loaded`);
  const rowState=await browser.eval(`(()=>{const root=document.querySelector('app-photo-feed-popup'),card=document.querySelector('[data-info-card-id="${id}"]'),badge=card.querySelector('.ui-info-card__overlay-action--bottom-end');return {header:root.querySelector('header').innerText,side:document.querySelector('.navigator-feed-action').innerText,badge:badge?{text:badge.innerText,color:getComputedStyle(badge).color,background:getComputedStyle(badge).background}:null};})()`);
  if(bucket==='rejected')assert.equal(rowState.badge.color,'rgb(95, 61, 152)');
  if(bucket==='blocked')assert.equal(rowState.badge.color,'rgb(164, 60, 69)');
  if(bucket==='accepted'){
   // Reopen Public feed in the second session; discovery rows stay stable while viewed.
   await viewer.send('Page.reload');await sleep(1300);await viewer.eval(open);
   let seen=false;for(let i=0;i<25;i++){seen=await viewer.eval(`!!document.querySelector('[data-info-card-id="${id}"]')`);if(seen)break;await sleep(500);}assert.ok(seen);
   const foreign=await viewer.eval(`(async()=>{const c=document.querySelector('[data-info-card-id="${id}"]'),b=c.querySelector('.ui-info-card__menu-trigger');if(!b)return [];b.click();await new Promise(r=>setTimeout(r,100));return [...document.querySelectorAll('.app-menu__item')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.innerText);})()`);
   assert.ok(!foreign.some(text=>text.includes('Remove')),'Remove absent for nonowner');
  }
  const openRemove=`(async()=>{const card=document.querySelector('[data-info-card-id="${id}"]');card.querySelector('.ui-info-card__menu-trigger').click();await new Promise(r=>setTimeout(r,100));const item=[...document.querySelectorAll('.app-menu__item')].find(e=>e.getBoundingClientRect().width>0&&e.innerText.includes('Remove'));if(!item)throw Error('Owner Remove missing');const palette=item.className;item.click();await new Promise(r=>setTimeout(r,100));return {palette,dialog:document.querySelector('app-dialog').innerText};})()`;
  const menu=await browser.eval(openRemove);assert.match(menu.palette,/palette--danger/);assert.match(menu.dialog,/Remove this photo post/);
  await browser.eval(`[...document.querySelectorAll('app-dialog button')].find(e=>e.innerText==='Cancel').click()`);
  assert.ok(await browser.eval(`!!document.querySelector('[data-info-card-id="${id}"]')`));
  await browser.eval(openRemove);
  if(bucket==='under-review'){
   const paused=new Promise(resolve=>{const listener=async event=>{const m=JSON.parse(event.data);if(m.method!=='Fetch.requestPaused')return;browser.ws.removeEventListener('message',listener);await browser.send('Fetch.failRequest',{requestId:m.params.requestId,errorReason:'Failed'});resolve();};browser.ws.addEventListener('message',listener);});
   await browser.send('Fetch.enable',{patterns:[{urlPattern:`*/api/activities/feed/${id}?*`,requestStage:'Request'}]});
   await browser.eval(`document.querySelector('app-dialog .dialog-actions button:last-child').click()`);await paused;await browser.send('Fetch.disable');await sleep(250);
   const failed=await browser.eval(`({dialog:document.querySelector('app-dialog').innerText,exists:!!document.querySelector('[data-info-card-id="${id}"]'),side:document.querySelector('.navigator-feed-action').innerText})`);
   assert.match(failed.dialog,/Unable to remove/);assert.ok(failed.exists);assert.equal(failed.side,rowState.side);
  }
  await browser.eval(`document.querySelector('app-dialog .dialog-actions button:last-child').click()`);
  let removed=false;for(let i=0;i<20;i++){removed=await browser.eval(`!document.querySelector('[data-info-card-id="${id}"]')`);if(removed)break;await sleep(100);}assert.ok(removed);
  const after=await browser.eval(`({dialog:document.querySelector('app-dialog').innerText,side:document.querySelector('.navigator-feed-action').innerText,header:document.querySelector('app-photo-feed-popup header').innerText})`);
  assert.equal(after.dialog,'');
  report.push({bucket,id,result:'PASS',menu,rowState,after,cancelPreserved:true,failureRetried:bucket==='under-review'});
  console.log(JSON.stringify({bucket,id,result:'PASS',sideBefore:rowState.side,sideAfter:after.side}));
 }
}finally{
 for(const id of created){try{await api(owner,`/activities/feed/${id}?userId=${owner.userId}`,'DELETE');}catch{}}
 await setSettings(original);browser.ws.close();viewer.ws.close();
 await writeFile('/tmp/qa-feed-owner-menu-result.json',JSON.stringify(report,null,2));
}
