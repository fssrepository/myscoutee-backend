#!/usr/bin/env node
// Operates only the named disposable checkpoint after explicit full-flow delegation.
import {readFile,writeFile} from 'node:fs/promises';
import WebSocket from '../../../../../myscoutee-frontend/node_modules/ws/index.js';
const [actor='0',file,output]=process.argv.slice(2);
let stepExpression;
if(file?.startsWith('@')) {
 const name=file.slice(1);
 const steps=JSON.parse(await readFile(new URL('../../../config/affiliate-invitation-browser-steps.json',import.meta.url),'utf8'));
 if(!steps[name])throw Error('Unknown browser step: '+name);
 let data={};
 if(name==='visit'||name==='claim')data=JSON.parse(await readFile('/tmp/affiliate-invitation-001/'+(name==='visit'?'baseline':'invites')+'.json','utf8'));
 stepExpression='(()=>{const QA_DATA='+JSON.stringify(data)+';return '+steps[name]+'})()';
}

const manifest=JSON.parse(await readFile('/tmp/myscoutee-qa-browser-sessions/AFFILIATE-INVITATION-001.json','utf8'));
const session=manifest.sessions[Number(actor)];
const pages=await fetch(`http://127.0.0.1:${session.devToolsPort}/json/list`).then(r=>r.json());
const page=pages.find(p=>p.type==='page' && /^https?:\/\/localhost/.test(p.url));
if(!page)throw Error('Managed application page missing');
const ws=new WebSocket(page.webSocketDebuggerUrl);
await new Promise((ok,fail)=>{ws.once('open',ok);ws.once('error',fail)});
const timer=setTimeout(()=>{ws.close();throw Error('CDP deadline exceeded')},30000);
try {
 const expression=stepExpression ?? (file?await readFile(file,'utf8'):`JSON.stringify({url:location.href,text:document.body.innerText,inputs:[...document.querySelectorAll('input,textarea,select')].map(e=>({tag:e.tagName,type:e.type,id:e.id,placeholder:e.placeholder,value:e.value})),buttons:[...document.querySelectorAll('button')].filter(e=>e.getBoundingClientRect().height).map(e=>({text:e.innerText,aria:e.getAttribute('aria-label'),disabled:e.disabled}))})`);
 const reply=new Promise((ok,fail)=>ws.on('message',raw=>{const m=JSON.parse(String(raw));if(m.id===1)m.error?fail(Error(m.error.message)):ok(m.result)}));
 ws.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression,awaitPromise:true,returnByValue:true}}));
 const r=await reply;if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);
 const result=typeof r.result.value==='string'?r.result.value:JSON.stringify(r.result.value,null,2);
 if(output){await writeFile(output,result,{mode:0o600});console.log('Saved private CDP result');}else console.log(result);
} finally {clearTimeout(timer);ws.close();}
