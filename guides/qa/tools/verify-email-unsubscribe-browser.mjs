#!/usr/bin/env node
// Explicitly delegated QA: only the anonymous session from the versioned launcher.
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const manifest=JSON.parse(await readFile('/tmp/myscoutee-qa-browser-sessions/EMAIL-UNSUBSCRIBE-001.json','utf8'));
const targets=await fetch(`http://127.0.0.1:${manifest.sessions[0].devToolsPort}/json/list`).then(r=>r.json());
const page=targets.find(t=>t.type==='page'&&new URL(t.url).pathname==='/api/public/email/unsubscribe');
assert.ok(page,'Managed unsubscribe page required');
const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let seq=0;const calls=new Map();
ws.addEventListener('message',async event=>{const m=JSON.parse(event.data);if(m.id){const c=calls.get(m.id);calls.delete(m.id);m.error?c.reject(Error('CDP command failed')):c.resolve(m.result);}else if(m.method==='Fetch.requestPaused'){await send('Fetch.failRequest',{requestId:m.params.requestId,errorReason:'Failed'});}});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;calls.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});assert.ok(!r.exceptionDetails,'Browser evaluation failed');return r.result.value;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function until(predicate){for(let i=0;i<50;i++){if(await evaluate(predicate))return;await wait(100);}throw Error('UI condition timed out');}
async function navigate(url){await send('Page.navigate',{url});await until('document.readyState==="complete" && !!document.getElementById("message")');await until('document.getElementById("confirm").getAttribute("aria-busy")==="false"');}
const base='http://localhost/api/public/email/unsubscribe';
const token=new URLSearchParams(new URL(page.url).hash.slice(1)).get('token');assert.ok(token);
const endpoint=async(path,body)=>fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
const evidence={};const timeout=setTimeout(()=>{ws.close();process.exitCode=1;},30000);
try{
 await send('Page.bringToFront');
 assert.equal((await (await endpoint('/status',{token})).json()).unsubscribed,false);
 evidence.getAndStatusDoNotUnsubscribe=true;
 evidence.page=await evaluate(`({logo:document.querySelector('img').complete&&document.querySelector('img').naturalWidth>0,landing:document.querySelector('a').href,appLoaded:!!document.querySelector('app-root'),resources:performance.getEntriesByType('resource').map(r=>new URL(r.name).pathname)})`);
 assert.equal(evidence.page.logo,true);assert.equal(evidence.page.landing,'https://myscoutee.com/');assert.equal(evidence.page.appLoaded,false);assert.ok(!evidence.page.resources.some(x=>/main.*\.js$/.test(x)));
 await send('Emulation.setDeviceMetricsOverride',{width:360,height:780,deviceScaleFactor:1,mobile:false});
 assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
 const shot=await send('Page.captureScreenshot',{format:'png'});await writeFile('/tmp/qa-unsubscribe-mobile.png',Buffer.from(shot.data,'base64'));await send('Emulation.clearDeviceMetricsOverride');evidence.mobileNoOverflow=true;
 const compact=await evaluate(`(()=>{const b=document.getElementById('confirm').getBoundingClientRect(),m=document.querySelector('main').getBoundingClientRect();return {width:b.width,blockWidth:m.width,centered:Math.abs(b.x+b.width/2-m.x-m.width/2)<1};})()`);assert.ok(compact.width<compact.blockWidth*.6);assert.ok(compact.centered);evidence.compactButton=compact;
 await send('Fetch.enable',{patterns:[{urlPattern:'*/public/email/unsubscribe',requestStage:'Request'}]});
 await evaluate('document.getElementById("confirm").click()');await until('document.getElementById("message").textContent.includes("Please try again")');
 assert.equal(await evaluate('document.getElementById("confirm").disabled'),false);await send('Fetch.disable');evidence.networkFailureRetry=true;
 // Delay only the QA connection so the real pending state is observable.
 await send('Network.enable');await send('Network.emulateNetworkConditions',{offline:false,latency:650,downloadThroughput:-1,uploadThroughput:-1});
 evidence.pending=await evaluate(`(()=>{document.getElementById('confirm').click();const b=document.getElementById('confirm');return{disabled:b.disabled,busy:b.getAttribute('aria-busy')};})()`);
 assert.equal(evidence.pending.disabled,true);assert.equal(evidence.pending.busy,'true');
 await until('document.getElementById("message").textContent.includes("You have unsubscribed")');
 await send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
 assert.equal((await (await endpoint('/status',{token})).json()).unsubscribed,true);
 assert.equal((await endpoint('',{token})).status,200);evidence.confirmAndRepeatedPost=true;
 await navigate(base+'#token='+token);assert.equal(await evaluate('document.getElementById("message").textContent.includes("You have unsubscribed")'),true);evidence.reloadPersisted=true;
 await navigate(base+'?lang=hu#token='+token);assert.equal(await evaluate('document.documentElement.lang'), 'hu');assert.equal(await evaluate('document.getElementById("message").textContent.includes("Sikeresen")'),true);evidence.hungarian=true;
 await navigate(base+'#token='+token.slice(0,40)+'tampered');assert.equal(await evaluate('document.getElementById("message").textContent.includes("invalid")'),true);assert.equal(await evaluate('document.getElementById("confirm").hidden'),true);evidence.tamperedLink=true;
 await navigate(base);assert.equal(await evaluate('document.getElementById("confirm").hidden'),true);evidence.missingLink=true;
 assert.equal((await endpoint('',{token:'invalid'})).status,400);assert.equal((await endpoint('',{token:'x'.repeat(2050)})).status,400);evidence.invalidPostsRejected=true;
 await navigate(base+'?lang=hu#token='+token);
 const done=await send('Page.captureScreenshot',{format:'png'});await writeFile('/tmp/qa-unsubscribe-success.png',Buffer.from(done.data,'base64'));
 evidence.result='PASS';console.log(JSON.stringify(evidence,null,2));await writeFile('/tmp/qa-email-unsubscribe-browser-result.json',JSON.stringify(evidence,null,2));
}finally{clearTimeout(timeout);await send('Fetch.disable').catch(()=>{});await send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1}).catch(()=>{});ws.close();}
