#!/usr/bin/env node
import assert from 'node:assert/strict';
import {attach,monitorState} from './admin-client-qa-runtime.mjs';
const admin=await attach('ADMIN-CLIENT-API-001'),user=await attach('ADMIN-CLIENT-API-001',1),monitor=await attach('ADMIN-CLIENT-MONITOR-001');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function until(check){for(let i=0;i<110;i++){if(await check())return;await wait(250);}throw Error('Support poll timed out');}
try{
 const before=await monitorState();assert.equal(before.data.attention.unreadMessages,1);
 await monitor.evaluate("document.getElementById('interval').value='20';document.getElementById('apply').click()");await until(async()=>(await monitorState()).lastSuccess>before.lastSuccess);
 const baseline=await monitorState();
 await admin.send('Page.bringToFront');await admin.evaluate("[...document.querySelectorAll('button')].find(b=>b.innerText.includes('Got it')&&b.getBoundingClientRect().height)?.click();document.querySelector('[data-single-row-id=\"c-support-admin-6ac102000000000000000001\"]').click()");await wait(900);
 await admin.evaluate("document.querySelector('button[aria-label=\"Close chat popup\"]').click()");await wait(100);
 await user.send('Page.bringToFront');const sent=await user.evaluate("(async()=>{const e=document.querySelector('textarea[placeholder=\"Write message\"]');e.value='QA admin monitor: support reply '+new Date().toISOString();e.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(r=>setTimeout(r,100));const b=[...document.querySelectorAll('button')].find(b=>b.getBoundingClientRect().height>0&&(b.getAttribute('aria-label')==='Send message'||b.innerText.trim()==='send'));if(!b)throw Error('Send button missing');b.click();await new Promise(r=>setTimeout(r,300));return {sent:e.value==='',buttons:[...document.querySelectorAll('app-event-chat-popup button')].filter(b=>b.getBoundingClientRect().height>0).map(b=>b.getAttribute('aria-label')).filter(Boolean).slice(-12)};})()");assert.equal(sent.sent,true);
 await until(async()=>(await monitorState()).lastSuccess>baseline.lastSuccess);
 const after=await monitorState();assert.equal(after.data.attention.unreadMessages,1);assert.ok(after.data.attention.unreadVersion>baseline.data.attention.unreadVersion);assert.equal(after.alertSequence,baseline.alertSequence+1);
 // Read and keep the thread open; decreasing unread must not produce another alert.
 await admin.send('Page.bringToFront');await admin.evaluate("document.querySelector('[data-single-row-id=\"c-support-admin-6ac102000000000000000001\"]').click()");await wait(800);
 await monitor.evaluate("document.getElementById('interval').value='5';document.getElementById('apply').click()");await until(async()=>(await monitorState()).lastSuccess>after.lastSuccess);
 const read=await monitorState();assert.equal(read.data.attention.unreadMessages,0);assert.equal(read.alertSequence,after.alertSequence);
 await monitor.evaluate("document.getElementById('interval').value='10';document.getElementById('apply').click()");
 console.log(JSON.stringify({result:'PASS',sameUnreadCount:1,newUnreadVersion:true,nativeAlertSequenceDelta:1,readingDecreasesWithoutAlert:true}));
}finally{admin.close();user.close();monitor.close();}
