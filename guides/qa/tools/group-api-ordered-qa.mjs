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
if(command==='reject-claims'||command==='revoked-admin-claim'){
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
