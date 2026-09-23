#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {attach,qaRoot,monitorRequest} from './admin-client-qa-runtime.mjs';
const browser=await attach('ADMIN-CLIENT-API-001');
const actors=JSON.parse(await readFile('/tmp/myscoutee-qa-browser-sessions/ADMIN-CLIENT-API-001.json','utf8')).sessions;
const actorHeaders=a=>({'X-App-Session-Kind':'demo','X-App-Session-Id':a.sessionId,'X-Demo-User-Id':a.userId,'Content-Type':'application/json'});
try{
 const key=await browser.evaluate("document.querySelector('.integration-token-secret code')?.textContent.trim()");assert.ok(key?.length>20);
 const prefs=JSON.parse(await readFile(qaRoot+'/config/myscoutee-admin/preferences.json','utf8'));
 const headers={Authorization:'Bearer '+key,'X-MyScoutee-Client-Id':prefs.clientId,'X-App-Session-Kind':'demo'};
 const statuses=[];
 for(const [method,path,body] of [['GET','/admin/client-api/settings'],['POST','/admin/client-api/tokens',{name:'forbidden-qa'}],['DELETE','/admin/client-api/tokens/000000000000000000000000']]){
  const r=await fetch('http://localhost/api'+path,{method,headers:actorHeaders(actors[1]),...(body?{body:JSON.stringify(body)}:{})});assert.equal(r.status,403);statuses.push(r.status);
 }
 let r=await fetch('http://localhost/api/admin/client-api/tokens/000000000000000000000000',{method:'DELETE',headers:actorHeaders(actors[0])});assert.ok([403,404].includes(r.status));
 const guessedRevoke=r.status;
 r=await fetch('http://localhost/api/admin-client/v1/overview');assert.equal(r.status,401);
 r=await fetch('http://localhost/api/integrations/v1/connect',{method:'POST',headers});assert.equal(r.status,401);
 // Disposable affiliate token created through the public owner's actual API; revoke in finally.
 const created=await fetch('http://localhost/api/integrations/tokens',{method:'POST',headers:actorHeaders(actors[1]),body:JSON.stringify({name:'QA scope isolation',expiresInDays:1})}).then(r=>r.json());assert.ok(created.value);
 try{r=await fetch('http://localhost/api/admin-client/v1/overview',{headers:{...headers,Authorization:'Bearer '+created.value,'X-MyScoutee-Client-Id':'aaed12c0-c41b-40aa-8efe-3f2e3a8e9e07'}});assert.equal(r.status,401);}finally{const revoked=await fetch('http://localhost/api/integrations/tokens/'+created.token.id,{method:'DELETE',headers:actorHeaders(actors[1])});assert.ok(revoked.ok);}
 const overview=await fetch('http://localhost/api/admin-client/v1/overview',{headers}).then(r=>r.json());
 const query="const s=db.adminStats.findOne({_id:'admin-stats-global'});print(JSON.stringify({genders:Object.fromEntries(Object.entries(s.activeProfileGenders).map(([k,v])=>[k,Number(v)])),daily:s.dailyActivity}));";
 const stored=JSON.parse(execFileSync('docker',['exec','mongodb','sh','-c','exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"','admin-stats-read',query],{encoding:'utf8'}));
 const count=days=>{let total=0;for(let i=0;i<days;i++){let d=new Date();d.setUTCDate(d.getUTCDate()-i);total+=Number(stored.daily?.[d.toISOString().slice(0,10)]?.registrations||0);}return total;};
 assert.deepEqual(overview.statistics.genders,stored.genders);assert.equal(overview.statistics.registrations7Days,count(7));assert.equal(overview.statistics.registrations30Days,count(30));
 for(const interval of [4,3601])assert.equal((await monitorRequest('/interval',{interval})).status,400);
 assert.equal((await monitorRequest('/state',undefined,{'X-Monitor-Control':'invalid'})).status,403);
 assert.equal((await monitorRequest('/disconnect',{}, {Origin:'https://untrusted.example'})).status,403);
 assert.equal((await monitorRequest('/connect',{url:'http://remote.example/api',key:'synthetic-qa',interval:10})).status,400);
 assert.equal((await monitorRequest('/connect',{url:'https://user:pass@example.test/api',key:'synthetic-qa',interval:10})).status,400);
 console.log(JSON.stringify({result:'PASS',normalSettingsCreateRevoke:statuses,guessedRevoke,missingAndWrongScopes:401,statistics:overview.statistics,intervalAndUrlValidation:true,localControlAndOrigin:true}));
}finally{browser.close();}
