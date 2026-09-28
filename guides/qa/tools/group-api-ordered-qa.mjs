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
if(command==='generate-key'){
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
