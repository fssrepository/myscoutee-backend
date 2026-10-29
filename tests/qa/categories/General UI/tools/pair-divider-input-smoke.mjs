// Hover/press/touch and drag on the existing pair-card divider. Never saves ratings.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const phone=process.env.PHONE==='1',scenario=process.env.SCENARIO||'rates';
let p,browser;
const pause=ms=>new Promise(r=>setTimeout(r,ms));
if(phone){const require=createRequire(new URL('../../../../../myscoutee-frontend/package.json',import.meta.url));browser=await require('playwright').chromium.connectOverCDP('http://127.0.0.1:36087');p=browser.contexts().flatMap(c=>c.pages()).find(p=>p.url().startsWith('http://localhost:8080/'));}
else{process.env.MOBILE='1';process.env.CHECKPOINT=scenario==='home'?'EXPLANATION-GUIDE-001':'EXPLANATION-GUIDE-FEEDBACK-001';const s=await import('./session.mjs');({p,browser}=s);if(scenario==='home'){await s.home();await p.getByRole('button',{name:'Select game mode',exact:true}).click();await p.getByRole('menuitemradio',{name:/Outside Network/}).click();}else{await s.menu('Open rates');await p.getByRole('button',{name:/^Open activity\.rates\.group\./}).click();await p.locator('[data-guide-item="rate:pair-given"]').click();await p.getByRole('button',{name:'Open rates fullscreen mode',exact:true}).click();}}
const checks=[];
const pair=p.locator('.smart-list__fullscreen-card--active app-pair-card'),handle=pair.locator('[data-guide-field="pair-resize"]');
const sample=()=>handle.evaluate(e=>{const r=e.getBoundingClientRect(),c=window.ng.getComponent(e.closest('app-pair-card'));return{x:r.x,y:r.y,w:r.width,h:r.height,percent:c.splitPercent,resizing:c.isResizing,motion:e.getAttribute('data-motion'),launchers:[...document.querySelectorAll('app-floating-launcher app-menu')].map(n=>{const r=n.getBoundingClientRect();return {y:r.y,bottom:r.bottom,visible:getComputedStyle(n).visibility!=='hidden'};}),eyes:[...e.closest('app-pair-card').querySelectorAll('.shared-card-profile-view-btn')].map(n=>n.getBoundingClientRect().top),photos:[...e.closest('app-pair-card').querySelectorAll('.activities-rate-pair-inline-layer')].map(layer=>{const image=getComputedStyle(layer,'::before');return {width:parseFloat(image.width),height:parseFloat(image.height),fit:image.backgroundSize,image:image.backgroundImage!== 'none',content:image.content,paneWidth:layer.getBoundingClientRect().width};})};});
const stableLaunchers=(a,b)=>{assert.equal(a.launchers.length,2);assert(a.launchers.every(l=>l.visible) && b.launchers.every(l=>l.visible),'Floating launchers disappeared');assert.deepEqual(b.launchers,a.launchers,'Divider moved floating buttons');assert(a.launchers[0].bottom+7.5<=a.launchers[1].y,'Guide overlaps notification');assert(a.launchers[1].bottom+7.5<=Math.min(...a.eyes),'Notification must be above eyes');};
const same=(a,b,label)=>assert(['x','y','w','h','percent'].every(k=>Math.abs(a[k]-b[k])<.1),`${label}: ${JSON.stringify({a,b})}`);
try{
 await handle.waitFor();await pause(500);let before=await sample();assert.equal(before.motion,'none','Latest divider fix not loaded');assert(before.photos.every(image=>image.fit==='contain'),'Mobile pair photos must use the same contain fit on Home and Rates');await p.screenshot({path:`/tmp/myscoutee-guide-screenshots/pair-fixed-${scenario}-${phone?'phone':'browser'}.png`});
 if(!phone){
  await p.mouse.move(5,5);before=await sample();await p.mouse.move(before.x+before.w/2,before.y+before.h/2);await pause(250);same(await sample(),before,'Hover changed divider');await p.mouse.down();await pause(200);same(await sample(),before,'Mouse press changed divider');await p.mouse.up();await pause(250);same(await sample(),before,'Mouse release changed divider');checks.push({kind:'mouse-hover-press',before,after:await sample()});
 }
 const cdp=await p.context().newCDPSession(p);if(!phone)await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
 const touch=(type,point)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:point?[{...point,id:1}]:[]});
 before=await sample();let point={x:before.x+before.w/2,y:before.y+before.h/2};
 await touch('touchStart',point);await pause(100);same(await sample(),before,'Tap-down changed divider');await touch('touchEnd');await pause(250);same(await sample(),before,'Tap changed divider');assert.equal((await sample()).resizing,false);checks.push({kind:'touch-tap',before,after:await sample()});
 await touch('touchStart',point);await pause(500);same(await sample(),before,'Stationary finger changed divider');
 const drag=[];for(let dx=5;dx<=35;dx+=5){await touch('touchMove',{x:point.x+dx,y:point.y});await pause(40);const state=await sample();stableLaunchers(before,state);assert(Math.abs(state.x+state.w/2-point.x-dx)<2,'Divider left the finger');drag.push({dx,...state});}
 const held=await sample();assert(held.photos.every((image,i)=>image.image&&Math.abs(image.width-before.photos[i].width)<.1&&Math.abs(image.height-before.photos[i].height)<.1),'Dragging rescaled the photos');await touch('touchEnd');await pause(250);same(await sample(),held,'Touch release jumped');assert.equal((await sample()).resizing,false);assert(held.percent>before.percent+1);checks.push({kind:'touch-hold-drag-release',before,drag,after:await sample()});
 // Restore the original ratio by a real reverse drag.
 point={x:held.x+held.w/2,y:held.y+held.h/2};await touch('touchStart',point);await touch('touchMove',{x:point.x-35,y:point.y});await touch('touchEnd');await pause(250);same(await sample(),before,'Reverse drag did not restore ratio');
 // Reveal either whole pane using the actual touch handle, with a fixed image canvas.
 for(const edge of [0,1]){
  const original=await sample();let start={x:original.x+original.w/2,y:original.y+original.h/2};const vw=await p.evaluate(()=>innerWidth);
  await touch('touchStart',start);await touch('touchMove',{x:edge?vw-1:1,y:start.y});await touch('touchEnd');await pause(150);const full=await sample();stableLaunchers(original,full);assert.equal(full.percent,edge?100:0);assert(full.photos.every((image,i)=>Math.abs(image.width-original.photos[i].width)<.1&&Math.abs(image.height-original.photos[i].height)<.1),'Fully opening pane rescaled image');
  const grip=await handle.evaluate(e=>{const r=e.getBoundingClientRect(),clip=e.closest('.activities-rate-profile-stack').getBoundingClientRect();return {x:(Math.max(r.left,clip.left)+Math.min(r.right,clip.right))/2,y:r.y+r.height/2,gridWidth:e.closest('.activities-rate-pair-fullscreen-grid').getBoundingClientRect().width};});
  await touch('touchStart',{x:grip.x,y:grip.y});await touch('touchMove',{x:grip.x+(original.percent-full.percent)/100*grip.gridWidth,y:grip.y});await touch('touchEnd');await pause(150);same(await sample(),original,'Full-open reverse drag did not restore ratio');checks.push({kind:'full-pane-fixed-photo',edge,before:original,full});
 }
 if(phone){
  const adb=(...args)=>execFileSync('adb',args,{encoding:'utf8',timeout:15000});
  adb('shell','uiautomator','dump','/sdcard/guide-window.xml');const xml=adb('shell','cat','/sdcard/guide-window.xml');
  const bounds=xml.match(/<node[^>]*resource-id="com.android.chrome:id\/coordinator"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);assert(bounds,'Native Chrome bounds missing');
  const viewport=await p.evaluate(()=>({dpr:devicePixelRatio,h:visualViewport.height}));
  const physical=state=>({x:Math.round((state.x+state.w/2)*viewport.dpr),y:Math.round(Number(bounds[4])-viewport.h*viewport.dpr+(state.y+state.h/2)*viewport.dpr)});
  before=await sample();let q=physical(before);
  await handle.evaluate(e=>{window.__nativeDividerTouches=[];e.addEventListener('pointerdown',ev=>window.__nativeDividerTouches.push({type:ev.pointerType,x:ev.clientX,y:ev.clientY}),{once:true});});
  adb('shell','input','touchscreen','tap',String(q.x),String(q.y));await pause(150);same(await sample(),before,'ADB tap changed divider');assert((await p.evaluate(()=>window.__nativeDividerTouches)).some(e=>e.type==='touch'),'ADB tap missed divider');
  adb('shell','input','touchscreen','swipe',String(q.x),String(q.y),String(q.x),String(q.y),'650');await pause(150);same(await sample(),before,'ADB hold changed divider');
  await cdp.send('Profiler.enable');await cdp.send('Profiler.start');
  await p.evaluate(()=>{window.__dragTasks=[];window.__dragObserver=new PerformanceObserver(l=>window.__dragTasks.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration}))));window.__dragObserver.observe({type:'longtask'});window.__dragStart=performance.now();});
  adb('shell','input','touchscreen','draganddrop',String(q.x),String(q.y),String(q.x+50),String(q.y),'600');await pause(150);const moved=await sample();assert(Math.abs(moved.x-before.x-50/viewport.dpr)<2,`ADB drag did not follow finger: ${JSON.stringify({before:before.x,after:moved.x,q,viewport})}`);assert.equal(moved.resizing,false);
  q=physical(moved);adb('shell','input','touchscreen','draganddrop',String(q.x),String(q.y),String(q.x-50),String(q.y),'600');await pause(150);const restored=await sample();assert(Math.abs(restored.x-before.x)<=1/viewport.dpr+.02 && Math.abs(restored.percent-before.percent)<.2,'ADB reverse drag exceeded physical-pixel rounding');fs.writeFileSync('/tmp/pair-drag-phone-profile.json',JSON.stringify(await cdp.send('Profiler.stop')));
  const performance=await p.evaluate(()=>{window.__dragObserver.disconnect();return {elapsedMs:window.performance.now()-window.__dragStart,longTasks:window.__dragTasks};});checks.push({kind:'native-adb-tap-hold-drag',before,moved,restored:await sample(),performance});
 }
 if(!phone){await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:false});await p.setViewportSize({width:1280,height:900});await pause(250);assert.equal(await handle.count(),0,'Desktop unexpectedly exposes mobile divider');assert(await pair.locator('.activities-rate-pair-inline-layer').evaluateAll(es=>es.every(e=>getComputedStyle(e,'::before').content==='none')),'Desktop photo sizing changed');}
 await cdp.detach();console.log(JSON.stringify({scenario,phone,status:'PASS',checks:checks.map(c=>c.kind)}));
}finally{fs.writeFileSync(new URL(`../../evidence/general/EXPLANATION-GUIDE-001-20260930/pair-divider-${scenario}${phone?'-phone':''}-checks.json`,import.meta.url),JSON.stringify({checks},null,2)+'\n');await browser.close();}
