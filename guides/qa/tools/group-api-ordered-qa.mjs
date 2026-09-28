#!/usr/bin/env node
// Explicitly delegated Group API QA. Uses managed browsers and existing product UI.
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';
import {attach} from './admin-client-qa-runtime.mjs';
const checkpoint='INTEGRATION-API-GROUP-001',root='/tmp/myscoutee-group-api-20260928';
await mkdir(root,{recursive:true,mode:0o700});
const [command,actorText='0',itemText='0']=process.argv.slice(2),actor=Number(actorText);
const credentialsPath=`${root}/api-${actor}.json`;
const evidencePath='guides/qa/evidence/INTEGRATION-API-GROUP-001-ordered-20260928.json';
async function evidence(point,result){let records=[];try{records=JSON.parse(await readFile(evidencePath,'utf8'));}catch{}records.push({point,at:new Date().toISOString(),...result});await writeFile(evidencePath,JSON.stringify(records,null,2)+'\n');console.log(JSON.stringify({point,...result}));}
if(command==='revoked-key'){
 const c=JSON.parse(await readFile(credentialsPath,'utf8'));
 const r=await fetch('http://localhost/api/integrations/v1/groups/qa-group-api-a/invites',{method:'POST',
  headers:{'Content-Type':'application/json',Authorization:'Bearer '+c.token,'X-MyScoutee-Client-Id':c.clientId,'X-App-Session-Kind':'demo'},
  body:JSON.stringify({participantIds:['must-not-be-created-revoked-key']})});
 assert.equal(r.status,401);await evidence('5.3.revoked-api-key',{pass:true,status:r.status});
}else if(command==='private-controls'){
 const scope=itemText;assert.ok(['base','a','b'].includes(scope));
 const b=await attach(checkpoint,actor);
 try{
  const state=await b.evaluate(`({session:JSON.parse(localStorage.getItem('myscoutee.http.session.v1')),workspace:document.querySelector('button[aria-label="Choose workspace"]')?.innerText})`);
  assert.equal(state.session.userId,'f03009260000000000000003');
  assert.ok(state.workspace.includes(scope==='base'?'Main profile':'QA Group API '+scope.toUpperCase()));
  const headers={'X-App-Session-Kind':'demo','X-Demo-User-Id':state.session.userId,'X-App-Session-Id':state.session.sessionId};
  const results=[];
  for(const [target,eventId] of [['base','a3d925e9-f74b-404d-872b-a2b970dd43b7'],['a','qa-group-api-private-a'],['b','qa-group-api-private-b']]){
   const r=await fetch(`http://localhost/api/activities/events/detail?userId=${state.session.userId}&eventId=${eventId}`,{headers});
   const payload=await r.json();
   // ActivitiesEventsController deliberately conceals inaccessible details as 404.
   assert.equal(r.status,target===scope?200:404,`${scope} -> ${target}`);
   if(r.ok)assert.ok(JSON.stringify(payload).includes('QA Group API'));
   results.push({target,eventId,status:r.status});
  }
  await evidence('5.2.private-events.'+scope,{pass:true,results});
 }finally{b.close();}
}else if(command==='event-controls'){
 const c=JSON.parse(await readFile(`${root}/api-0.json`,'utf8'));
 const headers={'Content-Type':'application/json',Authorization:'Bearer '+c.token,'X-MyScoutee-Client-Id':c.clientId,'X-App-Session-Kind':'demo'};
 const items=['free','paid','ended'].map((kind,index)=>({id:`f0300926-0000-4000-8000-00000000000${index+1}`,title:'QA Group API '+kind+' Event',subtitle:'Independent event admission control',startAt:kind==='ended'?'2026-09-20T10:00:00Z':'2026-10-05T10:00:00Z',endAt:kind==='ended'?'2026-09-20T12:00:00Z':'2026-10-05T12:00:00Z',location:'Budapest',capacityMin:1,capacityMax:10,visibility:'Private',status:'active',topics:['QA'],mode:'Casual'}));
 const r=await fetch('http://localhost/api/integrations/v1/events',{method:'POST',headers,body:JSON.stringify({items})});assert.equal(r.status,200);const created=await r.json();
 assert.equal(created.items.length,3);assert.ok(created.items.every(i=>i.id&&i.externalId&&!i.error),JSON.stringify(created));
 const controls=[];
 for(const event of created.items){const response=await fetch(`http://localhost/api/integrations/v1/events/${event.externalId}/invites`,{method:'POST',headers,body:JSON.stringify({participantIds:['group-api-milo-b']})});assert.equal(response.status,200);const body=await response.json();controls.push({...event,kind:['free','paid','ended'][created.items.indexOf(event)],inviteUrl:body.items[0].inviteUrl});}
 await writeFile(`${root}/event-controls.json`,JSON.stringify(controls),{mode:0o600});await evidence('5.1.event-controls-issued',{pass:true,events:controls.map(({id,externalId})=>({id,externalId}))});
}else if(command==='open-event'){
 const events=JSON.parse(await readFile(`${root}/event-controls.json`,'utf8'));const event=events.find(e=>e.kind===itemText);assert.ok(event);const b=await attach(checkpoint,actor);
 try{await b.send('Page.navigate',{url:event.inviteUrl});console.log(JSON.stringify({opened:event.externalId,actor}));}finally{b.close();}
}else if(command==='claim-transport-retry'){
 const links=JSON.parse(await readFile(`${root}/links.json`,'utf8'));const b=await attach(checkpoint,1);
 const state=()=>b.evaluate(`({group:document.querySelector('button[aria-label="Choose workspace"]')?.innerText,retained:new URLSearchParams(location.search).has('partnerInvite'),error:document.body.innerText.includes('The invitation could not be opened.')})`);
 try{
  assert.ok((await state()).group?.includes('QA Group API B'));
  await b.send('Network.enable');
  await b.send('Network.setBlockedURLs',{urls:['*auth/me/partner-invite/claim']});
  await b.send('Page.navigate',{url:links.items[4].inviteUrl});
  let failed;
  for(let i=0;i<100;i++){failed=await state();if(failed.error&&failed.group)break;await new Promise(r=>setTimeout(r,100));}
  assert.ok(failed.error,'Expected failed invitation dialog');assert.ok(failed.retained,'Invitation must remain for retry');assert.ok(failed.group?.includes('QA Group API B'),'Prior selected workspace must remain');
  await b.send('Network.setBlockedURLs',{urls:[]});
  await b.send('Page.reload');
  let retried;
  for(let i=0;i<100;i++){retried=await state();if(retried.group?.includes('QA Group API A')&&!retried.retained)break;await new Promise(r=>setTimeout(r,100));}
  assert.ok(retried.group?.includes('QA Group API A')&&!retried.retained);
  await evidence('4.2.claim-transport-retry',{pass:true,failed:{priorWorkspace:'B',invitationRetained:failed.retained,errorShown:failed.error},retry:{selectedWorkspace:'A',invitationConsumed:!retried.retained}});
 }finally{await b.send('Network.setBlockedURLs',{urls:[]});b.close();}
}else if(command==='reject-claims'||command==='revoked-admin-claim'){
 const b=await attach(checkpoint,1);let session;
 try{session=await b.evaluate(`JSON.parse(localStorage.getItem('myscoutee.http.session.v1'))`);}finally{b.close();}
 assert.equal(session?.userId,'f03009260000000000000003');assert.ok(session.sessionId);
 const headers={'Content-Type':'application/json','X-App-Session-Kind':'demo','X-Demo-User-Id':session.userId,'X-App-Session-Id':session.sessionId};
 const claim=async token=>{const r=await fetch('http://localhost/api/auth/me/partner-invite/claim',{method:'POST',headers,body:JSON.stringify({userId:session.userId,token})});return r.status;};
 if(command==='revoked-admin-claim'){
  const link=JSON.parse(await readFile(`${root}/revoked-admin-link.json`,'utf8'));
  const status=await claim(new URL(link.inviteUrl).searchParams.get('partnerInvite'));assert.equal(status,403);await evidence('3.2.revoked-administrator',{pass:true,status});
 }else{
  const first=JSON.parse(await readFile(`${root}/links.json`,'utf8')).items[0];const token=new URL(first.inviteUrl).searchParams.get('partnerInvite');
  const otherAccount=await claim(token);assert.equal(otherAccount,409);
  const altered=await claim((token[0]==='A'?'B':'A')+token.slice(1));assert.equal(altered,404);
  const c=JSON.parse(await readFile(`${root}/api-0.json`,'utf8'));
  const r=await fetch('http://localhost/api/integrations/v1/groups/qa-group-api-b/invites',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+c.token,'X-MyScoutee-Client-Id':c.clientId,'X-App-Session-Kind':'demo'},body:JSON.stringify({participantIds:['group-api-fresh-rowan','group-api-revoked-admin']})});assert.equal(r.status,200);
  const issued=await r.json();const reusedId=await claim(new URL(issued.items[0].inviteUrl).searchParams.get('partnerInvite'));assert.equal(reusedId,409);
  await writeFile(`${root}/revoked-admin-link.json`,JSON.stringify(issued.items[1]),{mode:0o600});
  await evidence('3.2.rejected-claims',{pass:true,otherAccount,alteredToken:altered,reusedExternalId:reusedId});
 }
}else if(command==='refresh-fixture-directory'){
 // Direct fixture changes bypass @CacheEvict. Reuse the existing profile-load
 // operation with the owner's unchanged saved coordinates, then verify the
 // public selector DTO matches the staged control before touching the browser.
 const manifest=JSON.parse(await readFile(`/tmp/myscoutee-qa-browser-sessions/${checkpoint}.json`,'utf8'));
 const owner=manifest.sessions[0];assert.equal(owner.userId,'f03009260000000000000001');
 const headers={'X-App-Session-Kind':'demo','X-Demo-User-Id':owner.userId,'X-App-Session-Id':owner.sessionId};
 const profile=await fetch('http://localhost/api/auth/me',{headers});assert.equal(profile.status,200);
 const dto=await profile.json();const user=dto.user??dto.profile??dto;
 const coordinates=user.locationCoordinates;assert.ok(coordinates);
 const query=new URLSearchParams({userId:owner.userId,latitude:String(coordinates.latitude),longitude:String(coordinates.longitude)});
 const refreshed=await fetch('http://localhost/api/auth/me/profile-ext?'+query,{headers});assert.equal(refreshed.status,200);
 const list=await fetch('http://localhost/api/auth/demo-users?role=member',{headers});assert.equal(list.status,200);
 const users=await list.json();const control=users.find(u=>u.id==='f03009260000000000000004');
 console.log(JSON.stringify({fixtureDirectoryRefreshed:true,control:{id:control.id,locationCoordinates:control.locationCoordinates,locationRequired:control.locationRequired}}));
}else if(command==='workspace-links'){
 const c=JSON.parse(await readFile(`${root}/api-0.json`,'utf8'));
 const links=JSON.parse(await readFile(`${root}/links.json`,'utf8'));
 links.items=links.items.slice(0,3);
 for(const suffix of ['b','a']){
  // A participant has one external ID per integration owner across groups.
  const id='group-api-milo-b';
  const r=await fetch('http://localhost/api/integrations/v1/groups/qa-group-api-'+suffix+'/invites',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+c.token,'X-MyScoutee-Client-Id':c.clientId,'X-App-Session-Kind':'demo'},body:JSON.stringify({participantIds:[id]})});assert.equal(r.status,200);
  const response=await r.json();links.items.push(...response.items);
 }
 await writeFile(`${root}/links.json`,JSON.stringify(links),{mode:0o600});await evidence('4.1.links',{pass:true,issuedGroups:['qa-group-api-b','qa-group-api-a']});
}else if(command==='pending-link'){
 const c=JSON.parse(await readFile(`${root}/api-0.json`,'utf8'));
 const r=await fetch('http://localhost/api/integrations/v1/groups/qa-group-api-a/invites',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+c.token,'X-MyScoutee-Client-Id':c.clientId,'X-App-Session-Kind':'demo'},body:JSON.stringify({participantIds:['group-api-pending-nia']})});
 assert.equal(r.status,200);const response=await r.json();const links=JSON.parse(await readFile(`${root}/links.json`,'utf8'));
 links.items=links.items.filter(i=>i.id!=='group-api-pending-nia').concat(response.items);
 await writeFile(`${root}/links.json`,JSON.stringify(links),{mode:0o600});await evidence('3.1.pending-link',{pass:true,status:r.status});
}else if(command==='generate-key'){
 const b=await attach(checkpoint,actor);
 try{
  await b.evaluate(`(async()=>{const click=async label=>{let button;for(let i=0;i<60;i++){button=[...document.querySelectorAll('button')].find(b=>b.getClientRects().length&&b.getAttribute('aria-label')===label);if(button&&!button.disabled)break;await new Promise(r=>setTimeout(r,100));}if(!button||button.disabled)throw Error('Missing '+label);button.click();await new Promise(r=>setTimeout(r,250));};if(document.querySelector('button[aria-label="Approve privacy"]'))await click('Approve privacy');await click('Open profile editor');await click('Open affiliate settings');await click('Generate API token');await click('Generate');})()`);
  let token;
  for(let i=0;i<50&&!token;i++){token=await b.evaluate(`document.querySelector('app-integration-settings-popup .integration-token-secret code')?.textContent.trim()`);if(!token)await new Promise(r=>setTimeout(r,100));}
  assert.ok(token?.startsWith('msc_'),'UI did not expose a generated key');
  await writeFile(credentialsPath,JSON.stringify({token,clientId:randomUUID()}),{mode:0o600,flag:'wx'});
  await evidence('1.1.key',{pass:true,actor,source:'normal-profile-ui',secretRecorded:false});
 }finally{b.close();}
}else if(command==='links'){
 const c=JSON.parse(await readFile(credentialsPath,'utf8'));
 const headers={'Content-Type':'application/json',Authorization:'Bearer '+c.token,'X-MyScoutee-Client-Id':c.clientId,'X-App-Session-Kind':'demo'};
 const participants=['group-api-fresh-rowan','group-api-existing-maya'];
 const r=await fetch('http://localhost/api/integrations/v1/groups/qa-group-api-a/invites',{method:'POST',headers,body:JSON.stringify({participantIds:participants})});
 const body=await r.json();assert.equal(r.status,200,'Invitation HTTP status '+r.status);
 assert.deepEqual(body.items.map(i=>i.id),participants);assert.ok(body.items.every(i=>i.inviteUrl.startsWith('http://localhost/')));
 await writeFile(`${root}/links.json`,JSON.stringify(body),{mode:0o600});
 await evidence('1.1.links',{pass:true,status:r.status,orderedIds:body.items.map(i=>i.id),count:body.items.length});
}else if(command==='repeat-and-invalid'){
 const c=JSON.parse(await readFile(credentialsPath,'utf8'));const first=JSON.parse(await readFile(`${root}/links.json`,'utf8'));
 const headers={'Content-Type':'application/json',Authorization:'Bearer '+c.token,'X-MyScoutee-Client-Id':c.clientId,'X-App-Session-Kind':'demo'};
 const request=async participantIds=>{const r=await fetch('http://localhost/api/integrations/v1/groups/qa-group-api-a/invites',{method:'POST',headers,body:JSON.stringify({participantIds})});return {status:r.status,body:await r.json()};};
 const again=await request(first.items.map(i=>i.id));assert.equal(again.status,200);assert.deepEqual(again.body,first);
 const invalid=[[''],['duplicate','duplicate'],Array.from({length:1001},(_,i)=>`oversized-${i}`)];const statuses=[];
 for(const input of invalid){const result=await request(input);statuses.push(result.status);assert.equal(result.status,400);}
 await evidence('1.2.repeat-validation',{pass:true,stableUrls:true,blankDuplicateOversizedStatuses:statuses});
}else if(command==='foreign-owner'){
 const c=JSON.parse(await readFile(credentialsPath,'utf8'));
 const r=await fetch('http://localhost/api/integrations/v1/groups/qa-group-api-a/invites',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+c.token,'X-MyScoutee-Client-Id':c.clientId,'X-App-Session-Kind':'demo'},body:JSON.stringify({participantIds:['foreign-owner-denial']})});
 assert.equal(r.status,403);await evidence('1.2.foreign-owner',{pass:true,status:r.status,actor});
}else if(command==='open-link'){
 const links=JSON.parse(await readFile(`${root}/links.json`,'utf8'));const b=await attach(checkpoint,actor);
 try{const item=Number(itemText);assert.ok(links.items[item]);await b.send('Page.navigate',{url:links.items[item].inviteUrl});console.log(JSON.stringify({opened:'invitation',item,actor}));}finally{b.close();}
}else throw Error('Unknown action');
