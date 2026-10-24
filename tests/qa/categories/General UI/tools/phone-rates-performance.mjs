// Native switch regression on the retained Android QA session. No rating writes.
// Default: current prepared Rates surface. --reload: reload and open Rates/pair-given.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const require=createRequire(new URL('../../../../../frontend/package.json', import.meta.url));
const b=await require('playwright').chromium.connectOverCDP('http://127.0.0.1:36087');
const p=b.contexts().flatMap(c=>c.pages()).find(p=>p.url().startsWith('http://localhost:8080/'));
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const adb=(...args)=>execFileSync('adb',[...(process.env.ANDROID_SERIAL?['-s',process.env.ANDROID_SERIAL]:[]),...args],{encoding:'utf8',timeout:15000});
try {
 if(process.argv.includes('--reload')) {
  await p.reload(); await p.getByRole('button',{name:'Open user menu',exact:true}).click({timeout:10000});
  await p.locator('.user-menu-panel.open [data-guide-item="rates"]').click({timeout:10000});
  await p.locator('app-activities-popup .shared-card-profile-view-btn').first().waitFor({timeout:10000});
  const group=p.getByRole('button',{name:/^Open activity\.rates\.group\./}); await group.click({timeout:10000});
  await p.locator('[data-guide-item="rate:pair-given"]').click({timeout:10000}); await pause(1200);
 }
 await p.evaluate(()=>{
  const el=document.querySelector('app-activities-rate-template'); const proto=Object.getPrototypeOf(ng.getComponent(el));
  const i18n=ng.getComponent(document.querySelector('app-activities-popup')).i18nService;
  window.__switchCheck={rebuilds:[],old:proto.rebuildCards,proto,samples:[],scans:[],i18n,oldScan:i18n.scanDom};
  i18n.scanDom=function(...args){const t=performance.now();const result=window.__switchCheck.oldScan.apply(this,args);window.__switchCheck.scans.push({ms:performance.now()-t,full:args[0]===undefined,roots:args[0]?.length??null});return result;};
  proto.rebuildCards=function(...args){window.__switchCheck.rebuilds.push({id:this.row?.id,presentation:this.presentation});return window.__switchCheck.old.apply(this,args)};
  window.__qaMobilePerformance?.stop();window.__qaPairJumpProbe?.stop();
 });
 adb('shell','uiautomator','dump','/sdcard/guide-window.xml');
 const bounds=adb('shell','cat','/sdcard/guide-window.xml').match(/<node[^>]*resource-id="com.android.chrome:id\/coordinator"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);assert(bounds);
 for(let i=0;i<6;i++) {
  const q=await p.evaluate(bottom=>{
   const root=document.querySelector('app-activities-popup'),c=ng.getComponent(root);
   const rect=root.querySelector('[data-guide-field="fullscreen"]').getBoundingClientRect();
   const s=window.__switchCheck;s.rebuilds=[];s.scans=[];
   const fullscreen=root.querySelector('.activities-popup').classList.contains('activities-popup-rates-fullscreen');
   s.beforeNodes=[...root.querySelectorAll('app-activities-rate-template, .smart-list__rating-outlet .rate')];
   s.listScroll=root.querySelector('.smart-list--list')?.scrollTop;
   s.pending={direction:fullscreen?'list':'fullscreen',selectedBefore:c.selectedActivityRateId};
   s.listener=function start(e){
    if(!e.target.closest('app-activities-popup [data-guide-field="fullscreen"]'))return;
    document.removeEventListener('click',start,true); const t=performance.now();let frame=0;
    const read=()=>{
     if(s.stopped) return;
     const active=root.querySelector('.smart-list__fullscreen-card--active');const bar=root.querySelector('.app-menu-outlet--fixed .rate');const panel=bar?.closest('.app-menu__panel');
     if(s.pending.cardMs==null && root.querySelector('.activities-popup').classList.contains('activities-popup-rates-fullscreen')!==fullscreen){s.pending.cardMs=performance.now()-t;s.pending.affinityReady=!!panel&&getComputedStyle(panel).opacity==='1'&&getComputedStyle(panel).visibility==='visible';}
     if(++frame<2)requestAnimationFrame(read);else {s.pending.upperBoundMs=performance.now()-t;s.pending.selectedAfter=c.selectedActivityRateId;s.pending.retainedNodes=s.beforeNodes.every(n=>n.isConnected);s.pending.layers=[...root.querySelectorAll('.smart-list__stage-list-shell,.smart-list__stage-overlay')].map(el=>{const style=getComputedStyle(el);return {z:style.zIndex,visibility:style.visibility,opacity:style.opacity,width:el.clientWidth,height:el.clientHeight};});s.pending.listScrollDelta=(root.querySelector('.smart-list--list')?.scrollTop??0)-(s.listScroll??0);s.pending.rebuilds=s.rebuilds;s.pending.scans=s.scans;s.samples.push(s.pending);s.pending=null;}
    };requestAnimationFrame(read);
   };document.addEventListener('click',s.listener,true);
   return{x:Math.round((rect.x+rect.width/2)*devicePixelRatio),y:Math.round(bottom-visualViewport.height*devicePixelRatio+(rect.y+rect.height/2)*devicePixelRatio)};
  },Number(bounds[4]));
  adb('shell','input','touchscreen','tap',String(q.x),String(q.y));
  await p.waitForFunction(()=>window.__switchCheck.pending===null,{},{timeout:5000});await pause(600);
 }
 const result=await p.evaluate(()=>({samples:window.__switchCheck.samples,source:ng.getComponent(document.querySelector('app-activities-popup')).activitiesRates.setSelectedRateId.toString()}));
 result.note = 'Physical Android Chrome, native ADB taps, running dev build. Two RAF callbacks are a paint upper-bound proxy, not hardware display timestamps. No CPU profiler or HUD. Rebuild instrumentation delegates unchanged to the original method.';
 for (const sample of result.samples) {
  assert(sample.cardMs !== undefined, 'Presentation did not switch');
  assert(sample.retainedNodes, 'Switch destroyed a retained card or rating bar');
  assert(sample.layers.every(layer=>layer.visibility==='visible'&&layer.opacity==='1'),'Switch hid a retained layer');
  assert.equal(sample.layers[1].z,sample.direction==='fullscreen'?'4':'0');
  assert(Math.abs(sample.listScrollDelta)<1, 'Switch moved the background list');
  if (sample.direction === 'fullscreen') assert(sample.affinityReady, 'Affinity did not appear with the card');
  if (sample.selectedBefore) assert.equal(sample.selectedAfter, sample.selectedBefore, 'Switch changed selected rating');
  assert(sample.rebuilds.filter(r => r.presentation === 'list').length <= 2, 'Switch rebuilt unrelated list cards');
 }
 delete result.source;
 fs.writeFileSync(new URL('../../../../../.e2e-artifacts/qa/general/EXPLANATION-GUIDE-001-20260930/phone-rates-performance.json', import.meta.url),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify(result.samples.map(s=>({...s,rebuilds:s.rebuilds.length,listRebuilds:s.rebuilds.filter(r=>r.presentation==='list').length}))));
}finally{await p.evaluate(()=>{if(window.__switchCheck){const s=window.__switchCheck;s.stopped=true;document.removeEventListener('click',s.listener,true);s.proto.rebuildCards=s.old;s.i18n.scanDom=s.oldScan;}}).catch(()=>{});await b.close();}
