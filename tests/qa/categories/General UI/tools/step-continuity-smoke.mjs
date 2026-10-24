// Verify that normal guide navigation repositions the same mounted popup.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const {p,browser,home,pause}=await import('./session.mjs');
const checks=[];
try {
 for (const width of [390,1280]) {
  await p.setViewportSize({width,height:width===390?844:900});await home();
  await p.getByRole('button',{name:'Select game mode',exact:true}).click();
  await p.locator('[data-guide-item="home-mode:outside-network"]').click();
  await p.locator('.explanation-guide-menu button').click();
  const card=p.locator('.explanation-guide-overlay__card');await card.waitFor();await pause(350);
  await card.evaluate(e=>{window.__guideOriginalCard=e;window.__guideCardRemovals=0;window.__guideContinuityObserver=new MutationObserver(rs=>{for(const r of rs)for(const n of r.removedNodes)if(n===e||(n instanceof Element&&n.contains(e)))window.__guideCardRemovals++;});window.__guideContinuityObserver.observe(document.body,{subtree:true,childList:true});});
  const steps=[];
  for(let i=0;i<100;i++) {
   await pause(220);
   const state=await card.evaluate(e=>{const r=e.getBoundingClientRect();return {title:e.querySelector('h3')?.textContent,progress:e.querySelector('.explanation-guide-overlay__progress')?.textContent,same:e===window.__guideOriginalCard,launcherVisible:getComputedStyle(document.querySelector('.explanation-guide-menu')).visibility==='visible',removals:window.__guideCardRemovals,fits:r.x>=0&&r.y>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1};});
   assert(state.launcherVisible,JSON.stringify(state));assert(state.same&&state.removals===0,JSON.stringify(state));assert(state.fits,JSON.stringify(state));steps.push(state);
   const next=card.getByRole('button',{name:'Next',exact:true});if(!await next.count())break;await next.click();
  }
  assert(steps.length>5);await p.evaluate(()=>window.__guideContinuityObserver.disconnect());
  await card.getByRole('button',{name:'Done',exact:true}).click();checks.push({width,steps});
 }
 console.log(JSON.stringify({status:'PASS',checks:checks.map(c=>({width:c.width,steps:c.steps.length,removedCards:0}))}));
}finally{fs.writeFileSync(new URL('../../../../../.e2e-artifacts/qa/general/EXPLANATION-GUIDE-001-20260930/step-continuity-checks.json',import.meta.url),JSON.stringify({checks},null,2)+'\n');await browser.close();}
