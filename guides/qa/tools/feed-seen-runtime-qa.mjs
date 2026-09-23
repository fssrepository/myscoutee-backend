#!/usr/bin/env node
// Delegated viewport/outbox QA. Existing managed fixture session only; no new login.
import {readFile,writeFile} from 'node:fs/promises';import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const {sessions}=JSON.parse(await readFile('/tmp/myscoutee-qa-browser-sessions/EVENT-GALLERY-FEED-001.json','utf8'));const owner=sessions[0],actor=sessions[1],other=sessions[0];
const targets=await fetch(`http://127.0.0.1:${actor.devToolsPort}/json/list`).then(r=>r.json());const page=targets.find(t=>t.type==='page'&&new URL(t.url).hostname==='localhost');const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let serial=0;const tasks=new Map();let failed=0;let lostPageResponses=0;const pageSyncRequests=[];
ws.addEventListener('message',async event=>{const m=JSON.parse(event.data);if(m.id){const task=tasks.get(m.id);tasks.delete(m.id);if(m.error||m.result?.exceptionDetails)task.reject(Error(JSON.stringify(m.error||m.result.exceptionDetails)));else task.resolve(m.result);return;}if(m.method==='Network.requestWillBeSent'&&m.params.request.url.endsWith('/activities/feed/page'))pageSyncRequests.push(JSON.parse(m.params.request.postData));if(m.method==='Fetch.requestPaused'){if(m.params.request.url.endsWith('/activities/feed/page'))lostPageResponses++;else failed++;await send('Fetch.failRequest',{requestId:m.params.requestId,errorReason:'Failed'});}});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial;tasks.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});const evaluate=async expression=>(await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true})).result.value;const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const api=async (who,status)=>{const r=await fetch(`http://localhost/api/activities/feed?userId=${who.userId}&pageSize=50&status=${status}`,{headers:{'X-App-Session-Kind':'demo','X-App-Session-Id':who.sessionId,'X-Demo-User-Id':who.userId}});assert.equal(r.status,200);return r.json();};
const open="(async()=>{const wait=ms=>new Promise(r=>setTimeout(r,ms));let root=document.querySelector('app-photo-feed-popup');if(!root){let b=document.querySelector('.navigator-feed-action');if(!b){document.querySelector('[aria-label=\"Open user menu\"]').click();await wait(200);b=document.querySelector('.navigator-feed-action');}b.click();await wait(700);root=document.querySelector('app-photo-feed-popup');}return {text:root.innerText.slice(0,650),header:[...root.querySelectorAll('header button')].map(e=>({text:e.innerText,aria:e.getAttribute('aria-label')})),badge:document.querySelector('.navigator-feed-action')?.innerText};})()\n";const read="(async()=>{const root=document.querySelector('app-photo-feed-popup');const cards=[...root?.querySelectorAll('.ui-info-card')??[]];let scroll=cards[0];while(scroll&&!(scroll.scrollHeight>scroll.clientHeight+30&&/auto|scroll/.test(getComputedStyle(scroll).overflowY)))scroll=scroll.parentElement;const clip=scroll?.getBoundingClientRect();const out=cards.map(c=>{const r=c.getBoundingClientRect();return {id:c.dataset.infoCardId,top:r.top,bottom:r.bottom,visible:!!clip&&r.bottom>clip.top&&r.top<clip.bottom&&r.bottom>0&&r.top<innerHeight};});const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('myscoutee_http_db');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});const tx=db.transaction('tables','readonly'),store=tx.objectStore('tables');const entries=await new Promise(resolve=>{const r=store.get('photoFeedSeenOutbox:6a1100000000000000000002');r.onsuccess=()=>resolve(r.result??[]);});db.close();return {visibility:document.visibilityState,rows:out,clip:clip&&{top:clip.top,bottom:clip.bottom},scroll:scroll?.className,queued:entries,header:root?.querySelector('header')?.innerText};})()\n";const report={startedAt:new Date().toISOString()};
const created=[];
async function write(actor,path,body,method='POST'){const r=await fetch('http://localhost/api'+path,{method,headers:{'Content-Type':'application/json','X-App-Session-Kind':'demo','X-App-Session-Id':actor.sessionId,'X-Demo-User-Id':actor.userId},...(body?{body:JSON.stringify(body)}:{})});assert.equal(r.status,200,path);return r.json();}
try{
 await send('Network.enable');
 const source=(await api(owner,'accepted')).items[0];assert.ok(source);
 const options=await fetch(`http://localhost/api/activities/feed/events?userId=${owner.userId}&pageSize=50`,{headers:{'X-App-Session-Kind':'demo','X-App-Session-Id':owner.sessionId,'X-Demo-User-Id':owner.userId}}).then(r=>r.json());
 const image=source.imageUrls[0],event=options.items[0].event;
 for(let i=0;i<12;i++){const id=crypto.randomUUID();created.push(id);const post=await write(owner,'/activities/feed',{userId:owner.userId,id,imageUrls:[image],imageDetails:{[image]:{event,caption:`QA Seen viewport ${i}`,location:''}}});if(post.moderationStatus!=='accepted')await write(sessions[2],`/admin/content-moderation/${encodeURIComponent('feed:'+id)}/decision`,{adminUserId:sessions[2].userId,commandId:crypto.randomUUID(),expectedVersion:1,status:'accepted',message:''});}
 report.created=created;
 await send('Fetch.enable',{patterns:[{urlPattern:'*/api/activities/feed/seen',requestStage:'Request'}]});
 await send('Page.reload');await sleep(1600);await send('Page.bringToFront');await evaluate(open);await sleep(600);
 for(let attempt=0;attempt<20;attempt++){if(await evaluate("document.querySelectorAll('app-photo-feed-popup .ui-info-card').length>0"))break;await sleep(200);}
 report.before=await evaluate(read);const visible=report.before.rows.filter(r=>r.visible).map(r=>r.id);
 assert.ok(visible.length>0);assert.ok(visible.length<report.before.rows.length,'Offscreen prefetched rows exist');
 assert.deepEqual([...report.before.queued].sort(),visible.sort(),'Only exposed rows persisted');
 const foreignBefore=(await api(other,'seen')).items.map(p=>p.id).sort();
 await evaluate(`(()=>{window.__feedFrames=[];window.__feedLongTasks=[];let last=performance.now();window.__feedRecording=true;const frame=now=>{window.__feedFrames.push(now-last);last=now;if(window.__feedRecording)requestAnimationFrame(frame);};requestAnimationFrame(frame);window.__feedObserver=new PerformanceObserver(list=>window.__feedLongTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration}))));window.__feedObserver.observe({type:'longtask'});return true;})()`);
 await evaluate(`(()=>{let s=document.querySelector('app-photo-feed-popup .ui-info-card');while(s&&!(s.scrollHeight>s.clientHeight+30&&/auto|scroll/.test(getComputedStyle(s).overflowY)))s=s.parentElement;s.scrollBy({top:s.clientHeight*.85,behavior:'smooth'});return true;})()`);
 await sleep(1600);report.afterScroll=await evaluate(read);assert.ok(report.afterScroll.queued.length>report.before.queued.length,'Scrolled rows queued');
 report.performance=await evaluate(`(()=>{window.__feedRecording=false;window.__feedObserver.disconnect();const a=window.__feedFrames.sort((a,b)=>a-b);return {frames:a.length,p95Ms:a[Math.floor(a.length*.95)],maxMs:a.at(-1),longTasks:window.__feedLongTasks};})()`);
 await sleep(4200);assert.ok(failed>0,'Background request deliberately failed');report.failedUploads=failed;
 report.retained=await evaluate(read);assert.ok(report.retained.queued.length>=report.afterScroll.queued.length);
 const old=report.retained.queued;
 await evaluate(`document.querySelector('app-photo-feed-popup header [aria-label="Close"]').click()`);
 // Drop the first sync+page response after the server saved it: the outbox must
 // remain retryable, and retrying the initial lazy load must not duplicate views.
 await send('Fetch.enable',{patterns:[{urlPattern:'*/api/activities/feed/seen',requestStage:'Request'},{urlPattern:'*/api/activities/feed/page',requestStage:'Response'}]});
 await send('Page.reload');await sleep(1400);await evaluate(open);await sleep(400);
 report.lostResponse=await evaluate(read);
 assert.ok(lostPageResponses>0,'Combined response deliberately lost');
 assert.ok(old.every(id=>report.lostResponse.queued.includes(id)),'Unacknowledged IDs retained after lost response');
 assert.ok(old.every(id=>(pageSyncRequests[0]?.seenPostIds??[]).includes(id)),'First opening request includes IndexedDB outbox');
 const savedBeforeRetry=(await api(actor,'seen')).items.map(post=>post.id);
 assert.ok(old.every(id=>savedBeforeRetry.includes(id)),'Server persisted receipts before sending first page');
 await send('Fetch.enable',{patterns:[{urlPattern:'*/api/activities/feed/seen',requestStage:'Request'}]});
 await evaluate(`document.querySelector('app-photo-feed-popup header [aria-label="Close"]').click()`);
 const requestsBeforeRetry=pageSyncRequests.length;
 await evaluate(open);await sleep(700);report.reloaded=await evaluate(read);
 assert.equal(pageSyncRequests.length-requestsBeforeRetry,1,'One combined opening request, no sync then reload');
 assert.ok(!report.reloaded.rows.some(row=>old.includes(row.id)),'First response excludes retained views');
 assert.ok(report.reloaded.rows.some(row=>created.includes(row.id)&&!old.includes(row.id)), 'Remaining unseen posts returned on opening');
 assert.ok(old.every(id=>!report.reloaded.queued.includes(id)),'Successful page response acknowledges sent IDs');
 report.openingSync={lostResponses:lostPageResponses,retryRequests:pageSyncRequests.length-requestsBeforeRetry,sent:pageSyncRequests.at(-1).seenPostIds.length};
 await send('Fetch.disable');await sleep(5800);
 report.synced=await evaluate(read);assert.equal(report.synced.queued.length,0,'Acknowledged outbox drained');
 const seen=(await api(actor,'seen')).items.map(p=>p.id);assert.ok(old.every(id=>seen.includes(id)));
 assert.deepEqual((await api(other,'seen')).items.map(p=>p.id).sort(),foreignBefore,'Viewer isolation');
 assert.ok(!(await api(actor,'public')).items.some(p=>old.includes(p.id)),'Server Public feed excludes receipts');
 await evaluate(`(async()=>{document.querySelector('app-photo-feed-popup header app-menu button').click();await new Promise(r=>setTimeout(r,100));const item=[...document.querySelectorAll('.app-menu__item')].find(e=>e.innerText.includes('Seen'));if(!item)throw Error('Seen menu absent');item.click();return true;})()`);await sleep(500);
 report.seenUi=await evaluate(read);assert.ok(report.seenUi.rows.some(p=>old.includes(p.id)));
 for(const who of [owner,actor])for(const bucket of ['public','seen'])assert.ok(!(await api(who,bucket)).items.some(p=>p.creatorUserId===who.userId),'Own posts absent from discovery');
 await write(owner,'/activities/feed/seen',{userId:owner.userId,postIds:created});
 await write(actor,'/activities/feed/seen',{userId:actor.userId,postIds:old});
 const receiptQuery=`print(JSON.stringify({own:db.photoFeedViews.countDocuments({userId:${JSON.stringify(owner.userId)},postId:{$in:${JSON.stringify(created)}}}),other:db.photoFeedViews.countDocuments({userId:${JSON.stringify(actor.userId)},postId:{$in:${JSON.stringify(old)}}})}));`;
 report.receipts=JSON.parse(execFileSync('docker',['exec','mongodb','sh','-c','exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"','seen-receipts',receiptQuery],{encoding:'utf8'}));
 assert.equal(report.receipts.own,0,'Own IDs must not create receipts');
 assert.equal(report.receipts.other,old.length,'Repeated views create one receipt per post');
 await write(sessions[2],`/admin/content-moderation/${encodeURIComponent('feed:'+old[0])}/decision`,{adminUserId:sessions[2].userId,commandId:crypto.randomUUID(),expectedVersion:2,status:'blocked',message:''});
 await write(owner,`/activities/feed/${old[1]}?userId=${owner.userId}`,undefined,'DELETE');
 assert.ok(!(await api(actor,'seen')).items.some(post=>post.id===old[0]||post.id===old[1]),'Blocked/deleted posts disappear from Seen');
 report.blockedAndRemovedExcluded=true;
 report.result='PASS';
 console.log(JSON.stringify({result:report.result,initialFetched:report.before.rows.length,initialSeen:visible.length,afterScroll:report.afterScroll.queued.length,failedUploads:failed,reloadRetained:true,synced:true,openingSync:report.openingSync,performance:report.performance}));
}finally{await send('Fetch.disable');ws.close();for(const id of created){try{await write(owner,`/activities/feed/${id}?userId=${owner.userId}`,undefined,'DELETE');}catch(error){(report.cleanupErrors??=[]).push(String(error));}}await writeFile('/tmp/qa-feed-seen-runtime-result.json',JSON.stringify(report,null,2));}
