// Uses the checkpoint launcher's isolated profiles. No account or rating submission.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const scenario=process.env.SCENARIO||'consent';
process.env.CHECKPOINT=scenario==='consent'?'EXPLANATION-GUIDE-LANDING-001':scenario==='home'?'EXPLANATION-GUIDE-001':'EXPLANATION-GUIDE-FEEDBACK-001';
const {p,browser,pause,home,menu}=await import('./session.mjs');
const out=new URL('../../evidence/general/EXPLANATION-GUIDE-001-20260930/',import.meta.url).pathname;
const checks=[],errors=[];p.on('pageerror',e=>errors.push(e.message));
async function measure(label,width){
 await pause(450);
 const result=await p.evaluate(()=>{
  const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}};
  const launchers=[...document.querySelectorAll('app-floating-launcher button')].filter(e=>e.getClientRects().length).map(e=>({name:e.getAttribute('aria-label'),...box(e)}));
  const actions=[...document.querySelectorAll('.document-viewer-actions,.rate__commit,.form-flow__save,.shared-card-profile-view-btn')].filter(e=>{const r=e.getBoundingClientRect();if(!r.width||!r.height||r.top<0||r.bottom>innerHeight)return false;const hit=document.elementsFromPoint(r.x+r.width/2,r.y+r.height/2).find(n=>!n.closest('app-floating-launcher'));return hit&&e.contains(hit);}).map(e=>({name:e.getAttribute('aria-label')||e.className,...box(e)}));
  return {launchers,actions};
 });
 if(width>760)assert(await p.locator('app-floating-launcher').evaluateAll(es=>es.every(e=>window.ng.getComponent(e).lift()===0)),'Desktop must not be automatically lifted');
 assert(result.launchers.length>0,`${label}: no launcher`);
 const separated=(a,b)=>a.x+a.w+7.5<=b.x||a.x>=b.x+b.w+7.5||a.y+a.h+7.5<=b.y||a.y>=b.y+b.h+7.5;
 for(const a of result.launchers){
  assert(a.x>=0&&a.y>=0&&a.x+a.w<=width+1,`${label}: launcher outside viewport`);
  if(width<=760)for(const b of result.actions)assert(separated(a,b),`${label}: ${a.name} overlaps ${b.name}: ${JSON.stringify({a,b})}`);
 }
 for(let i=0;i<result.launchers.length;i++)for(let j=i+1;j<result.launchers.length;j++)assert(separated(result.launchers[i],result.launchers[j]),`${label}: launchers overlap`);
 await p.screenshot({path:`/tmp/myscoutee-guide-screenshots/launcher-${scenario}-${label}-${width}.png`});
 checks.push({width,label,...result});return result;
}
async function stationaryPointers(width){
 const locators=[p.locator('.explanation-guide-menu button'),p.locator('.notification-attention-menu button')];
 const same=async(locator,b,label)=>{const a=await locator.boundingBox();assert(['x','y','width','height'].every(k=>Math.abs(a[k]-b[k])<.25),`${label}: ${JSON.stringify({before:b,after:a})}`);};
 for(const locator of locators){
  if(!await locator.count())continue;
  await p.mouse.move(5,5);await pause(200);const b=await locator.boundingBox();
  await p.mouse.move(b.x+b.width/2,b.y+b.height/2);await pause(200);await same(locator,b,'Hover moved launcher');
  await p.mouse.down();await pause(100);await same(locator,b,'Mouse press moved launcher');await pause(350);await same(locator,b,'Stationary long press moved launcher');await p.mouse.up();await pause(200);await same(locator,b,'Mouse release moved launcher');
  if(width<=760){
   const cdp=await p.context().newCDPSession(p);await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
   const point={x:b.x+b.width/2,y:b.y+b.height/2,id:1};
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await pause(100);await same(locator,b,'Touch press moved launcher');await pause(350);await same(locator,b,'Stationary touch hold moved launcher');await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(200);await same(locator,b,'Touch release moved launcher');
   await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:false});await cdp.detach();
  }
 }
 checks.push({width,label:'stationary-input',hover:true,mousePress:true,longPress:true,touchHold:width<=760});
}
async function dragLauncher(locator,dx,dy){
 const b=await locator.boundingBox();await p.mouse.move(b.x+b.width/2,b.y+b.height/2);await p.mouse.down();await pause(420);await p.mouse.move(b.x+b.width/2+dx,b.y+b.height/2+dy,{steps:10});await p.mouse.up();await pause(200);
}
try{
 for(const width of [390,1280]){
  await p.setViewportSize({width,height:width===390?844:900});
  if(scenario==='consent'){
   // Native browser storage deletion, not hand-crafted consent keys or application calls.
   const cdp=await p.context().newCDPSession(p);await cdp.send('Storage.clearDataForOrigin',{origin:'http://localhost',storageTypes:'all'});await p.context().clearCookies();await cdp.detach();
   await p.goto('http://localhost/entry');await p.getByRole('button',{name:'Accept and continue',exact:true}).waitFor();
   const a=await measure('fresh-browser',width);await stationaryPointers(width);assert(a.actions.some(x=>x.name.includes('document-viewer-actions')));
   await p.getByRole('button',{name:'Accept and continue',exact:true}).click();await p.locator('.document-viewer-actions').waitFor({state:'detached'});
   await measure('accepted',width);await p.reload();await p.locator('.explanation-guide-menu button').waitFor();
   assert.equal(await p.getByRole('button',{name:'Accept and continue',exact:true}).count(),0,'Consent reappeared after acceptance/reload');await measure('accepted-reload',width);
  }else{
   if(scenario==='home')await home();else{
    await menu('Open rates');await p.getByRole('button',{name:/^Open activity\.rates\.group\./}).click();await p.locator('[data-guide-item="rate:pair-given"]').click();await p.getByRole('button',{name:'Open rates fullscreen mode',exact:true}).click();
   }
   await p.locator('.rate__commit').waitFor();const a=await measure('fullscreen',width);assert(a.actions.some(x=>['Save','Next','Go'].includes(x.name)));
   assert.equal(a.launchers.length,2,'Guide and notification must both be exercised');assert(a.actions.some(x=>x.name.startsWith('View ')),'Profile eye not exercised');
   const launcher=p.locator('.explanation-guide-menu button');const before=await launcher.boundingBox();await dragLauncher(launcher,-100,-100);const moved=await launcher.boundingBox();assert(Math.abs(moved.x-before.x+100)<2 && Math.abs(moved.y-before.y+100)<2,`Manual drag jumped on release: ${JSON.stringify({width,before,moved})}`);await measure('dragged',width);
   // Restore the visible position via real drag, so the demo is not left displaced.
   await dragLauncher(launcher,100,100);await measure('restored',width);await stationaryPointers(width); // Never submit Save.
  }
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({scenario,status:'PASS',checks}));
}finally{fs.writeFileSync(`${out}/launcher-${scenario}-checks.json`,JSON.stringify({checks,errors},null,2)+'\n');await browser.close();}
