#!/usr/bin/env node
// Final zero-minute and suspended-due branches in the retained Gallery fixture.
import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const {sessions}=JSON.parse(await readFile('/tmp/myscoutee-qa-browser-sessions/EVENT-GALLERY-FEED-001.json','utf8'));
const [owner,viewer,admin]=sessions;
async function api(actor,path,body){const r=await fetch('http://localhost/api'+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json','X-App-Session-Kind':'demo','X-App-Session-Id':actor.sessionId,'X-Demo-User-Id':actor.userId},...(body?{body:JSON.stringify(body)}:{})});assert.equal(r.status,200,path);return r.json();}
const state=()=>api(admin,`/admin/content-moderation/state?adminUserId=${admin.userId}`);
const original=(await state()).settings;
const rule=await api(admin,`/admin/notifications/content-auto-approve/runtime?adminUserId=${admin.userId}`);
const settings=async value=>api(admin,'/admin/content-moderation/settings',{adminUserId:admin.userId,expectedRevision:(await state()).revision,settings:value});
const job=enabled=>api(admin,'/admin/notifications',{adminUserId:admin.userId,rules:[{...rule,enabled}]});
const readItem=async(category,id)=>{const s=await api(admin,`/admin/content-moderation?adminUserId=${admin.userId}&category=${category}&status=accepted&pageSize=100`);return s.items.find(i=>i.sourceId===id);};
const report={created:[],startedAt:new Date().toISOString()};
const id='h'+Date.now(),assetId='asset-'+Date.now();
try{
 await job(false);await settings({enabled:true,autoApprove:true,delayMinutes:0,categories:['asset','event','feed']});
 const event=await api(owner,`/activities/events/detail?userId=${owner.userId}&eventId=h1790168393598`);
 const payload={...event,id,syncKey:id,userId:owner.userId,status:'DR',title:'QA zero-minute Event',acceptedMembers:0,pendingMembers:0,acceptedMemberUserIds:[],pendingMemberUserIds:[],invitedMemberUserIds:[],pendingRequestMemberUserIds:[]};
 const draft=await api(owner,'/activities/events/sync',payload);report.created.push({category:'event',id});assert.equal(draft.status,'DR');
 const before=(await state()).pendingCount;
 await api(owner,'/activities/events/publish',{userId:owner.userId,sourceId:id});
 const eventItem=await readItem('event',id);assert.ok(eventItem);assert.equal(eventItem.status,'accepted');
 const asset=await api(owner,`/assets/asset-1790166983930?userId=${owner.userId}`);
 const savedAsset=await api(owner,'/assets/upsert',{userId:owner.userId,asset:{...asset,id:assetId,title:'QA zero-minute Asset',requests:[],status:'A',moderationStatus:null}});report.created.push({category:'asset',id:assetId});
 assert.equal(savedAsset.moderationStatus,'accepted');assert.ok(await readItem('asset',assetId));
 assert.equal((await state()).pendingCount,before);
 assert.equal((await api(viewer,`/activities/events/detail?userId=${viewer.userId}&eventId=${id}`)).status,'A');
 assert.equal((await api(viewer,`/assets/${assetId}?userId=${viewer.userId}`)).status,'A');
 report.zeroMinutes='PASS';console.log(JSON.stringify({zeroMinutes:'PASS',created:report.created,jobSuspended:true,pendingUnchanged:true}));
 await settings({enabled:true,autoApprove:true,delayMinutes:43200,categories:['feed']});
 const source=(await api(owner,`/activities/feed?userId=${owner.userId}&status=accepted&pageSize=50`)).items[0];
 const linked=(await api(owner,`/activities/feed/events?userId=${owner.userId}&pageSize=50`)).items[0].event;
 const feedId=crypto.randomUUID(),image=source.imageUrls[0];report.created.push({category:'feed',id:feedId});
 const feed=await api(owner,'/activities/feed',{userId:owner.userId,id:feedId,imageUrls:[image],imageDetails:{[image]:{caption:'QA suspended due feed',location:'',event:linked}}});assert.equal(feed.moderationStatus,'under-review');
 report.due=JSON.parse(execFileSync('python3',['tests/qa/categories/Event/tools/gallery-moderation-fixture.py','due'],{encoding:'utf8'}));
 const pending=async()=> (await api(owner,`/activities/feed?userId=${owner.userId}&status=under-review&pageSize=50`)).items.some(p=>p.id===feedId);
 const suspendedAt=Date.now();
 for(let i=0;i<7;i++){await new Promise(r=>setTimeout(r,10000));assert.ok(await pending());}
 report.suspended={elapsedMs:Date.now()-suspendedAt,remainedPending:true};console.log(JSON.stringify({suspended:'PASS',...report.suspended}));
 await job(true);
 for(let i=0;i<18&&await pending();i++)await new Promise(r=>setTimeout(r,5000));
 assert.ok(!await pending(),'Scheduled resumed Job accepts due Feed');assert.ok(await readItem('feed',feedId));
 const runtime=await api(admin,`/admin/notifications/content-auto-approve/runtime?adminUserId=${admin.userId}`);
 report.resumed={status:runtime.runState.lastRunStatus,count:runtime.runState.lastRunCount};assert.ok(report.resumed.count>0);
 report.result='PASS';console.log(JSON.stringify({result:report.result,resumed:report.resumed}));
}finally{await settings(original);await job(rule.enabled);await writeFile('/tmp/qa-moderation-final-result.json',JSON.stringify(report,null,2));}
