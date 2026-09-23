#!/usr/bin/env node
import assert from 'node:assert/strict';
import {attach,monitorState} from './admin-client-qa-runtime.mjs';
const browser=await attach('ADMIN-CLIENT-MONITOR-001');const evidence=[];
try{
 await browser.send('Page.bringToFront');
 for(const interval of [5,20]){
  await browser.evaluate(`(()=>{document.getElementById('interval').value='${interval}';document.getElementById('apply').click();})()`);
  const initial=await monitorState(),times=[];let previous=initial.lastSuccess;
  const until=Date.now()+interval*3000+6000;
  while(Date.now()<until&&times.length<3){await new Promise(r=>setTimeout(r,250));const state=await monitorState();if(state.lastSuccess!==previous){times.push(state.lastSuccess);previous=state.lastSuccess;}}
  assert.equal(times.length,3);const gaps=times.slice(1).map((time,i)=>time-times[i]);assert.ok(gaps.every(g=>g>=interval-.3&&g<interval+3));
  assert.equal((await monitorState()).alertSequence,initial.alertSequence);evidence.push({interval,gaps,noDuplicateAlert:true});
 }
 await browser.evaluate("document.getElementById('interval').value='10';document.getElementById('apply').click()");
 console.log(JSON.stringify({result:'PASS',evidence}));
}finally{browser.close();}
