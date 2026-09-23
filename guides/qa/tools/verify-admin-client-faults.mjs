#!/usr/bin/env node
import assert from 'node:assert/strict';
import {attach,monitorState} from './admin-client-qa-runtime.mjs';
const browser=await attach('ADMIN-CLIENT-MONITOR-001');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function until(check,ms=25000){const end=Date.now()+ms;while(Date.now()<end){if(await check())return;await wait(150);}throw Error('Monitor condition timed out');}
const configure=body=>fetch('http://127.0.0.1:18992/configure',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
const stubState=()=>fetch('http://127.0.0.1:18992/state').then(r=>r.json());
const apply=()=>browser.evaluate("document.getElementById('interval').value='5';document.getElementById('apply').click()");
async function connect(){await browser.evaluate("document.getElementById('url').value='http://127.0.0.1:18992/api';document.getElementById('key').value='qa-synthetic-stub-key';document.getElementById('interval').value='5';document.getElementById('connect').click()");}
async function disconnect(){await browser.evaluate("document.getElementById('disconnect').click()");await until(async()=>!(await monitorState()).connected);await wait(1100);}
async function pollPatch(patch){const before=(await monitorState()).lastSuccess;await configure(patch);await apply();await until(async()=>(await monitorState()).lastSuccess>before);return monitorState();}
const evidence={};
try{
 await browser.send('Page.bringToFront');await disconnect();await connect();await until(async()=>!!(await monitorState()).lastSuccess);
 let s=await pollPatch({unread:1,version:'2026-09-23T16:00:01Z'});assert.equal(s.alertSequence,1);
 s=await pollPatch({unread:1,version:'2026-09-23T16:00:01Z'});assert.equal(s.alertSequence,1);
 s=await pollPatch({unread:1,version:'2026-09-23T16:00:02Z'});assert.equal(s.alertSequence,2);
 s=await pollPatch({unread:0,version:'2026-09-23T16:00:03Z'});assert.equal(s.alertSequence,2);evidence.sameCountNewVersionAndNoRepeatOrDecrease=true;
 const last=s.lastSuccess;await configure({delay:18});await apply();await until(async()=>(await stubState()).active===1);
 await until(async()=>(await monitorState()).error==='connection_failed');s=await monitorState();assert.ok(s.connected);assert.equal(s.lastSuccess,last);assert.ok(s.data);evidence.timeoutRetainsStaleSnapshot=true;
 await configure({delay:0});await until(async()=>(await monitorState()).lastSuccess>last);assert.equal((await stubState()).maxActive,1);evidence.recoveryWithoutOverlap=true;console.log(JSON.stringify({phase:'timeout and notification checks PASS'}));
 await configure({delay:4});await apply();await until(async()=>(await stubState()).active===1);await disconnect();await wait(4500);s=await monitorState();assert.equal(s.data,null);assert.equal(s.keyPreview,'');assert.equal(s.alertSequence,0);evidence.disconnectDropsLateResponse=true;
 await configure({delay:0,redirect:true});await connect();await until(async()=>(await monitorState()).error==='connection_failed');assert.equal((await stubState()).trapRequests,0);evidence.redirectNeverForwardsCredential=true;
 await disconnect();await configure({redirect:false});
 await browser.evaluate("document.getElementById('language').value='hu';document.getElementById('language').dispatchEvent(new Event('change'));document.getElementById('apply').click()");
 await wait(300);assert.equal(await browser.evaluate("document.getElementById('connect').textContent"),'Kapcsolódás');evidence.hungarian=true;
 await browser.evaluate("document.getElementById('language').value='en';document.getElementById('language').dispatchEvent(new Event('change'));document.getElementById('apply').click()");
 console.log(JSON.stringify({result:'PASS',evidence}));
}finally{browser.close();}
