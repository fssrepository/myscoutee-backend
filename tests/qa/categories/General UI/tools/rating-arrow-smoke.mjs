// Received pair suggestions use read-only pagination, never rating submission.
process.env.CHECKPOINT='EXPLANATION-GUIDE-FEEDBACK-001';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const out=new URL('../../../../../.e2e-artifacts/qa/general/EXPLANATION-GUIDE-001-20260930/',import.meta.url).pathname;
const {p,browser,menu,pause}=await import('./session.mjs');
const checks=[],errors=[];p.on('pageerror',e=>errors.push(e.message));
async function arrowGuide(width,name){
 await p.getByRole('button',{name:'Explanations',exact:true}).click();await p.locator('.explanation-guide-overlay h3').waitFor();
 const picker=p.locator('.explanation-guide-overlay__step-picker');await picker.locator('.app-menu__trigger').click();await picker.getByRole('tab',{name:/Card/}).click();await picker.getByRole('menuitemradio',{name:/Next cards/}).click();await pause(250);
 const sample=await p.locator('app-explanation-guide-overlay').evaluate(host=>{const c=window.ng.getComponent(host),s=c.currentStep(),t=c.resolveTarget(s,c.surfaceRoot()),r=host.querySelector('section').getBoundingClientRect();return {id:s.id,target:t?.element.getAttribute('aria-label'),body:host.querySelector('.explanation-guide-overlay__body')?.textContent,fits:r.x>=0&&r.y>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1};});
 assert.equal(sample.id,'pagination-next');assert.equal(sample.target,'Next item');assert(sample.fits);
 await p.screenshot({path:`/tmp/myscoutee-guide-screenshots/rating-arrow-${name}-${width}.png`});return sample;
}
try{
 for(const width of [390,1280]){
  await menu('Open rates');await p.setViewportSize({width,height:width===390?844:900});
  await p.getByRole('button',{name:/^Open activity\.rates\.group\./}).click();
  await p.locator('[data-guide-item="rate:pair-received"]').click();
  await p.getByRole('button',{name:'Open rates fullscreen mode',exact:true}).click();await pause(600);
  const card=p.locator('.smart-list__fullscreen-card--active');await card.waitFor();const before=await card.innerText();
  assert.equal(await p.locator('.rate__commit:visible').count(),0);
  const guide=await arrowGuide(width,'before');
  await p.evaluate(()=>{window.__ratingMotion=[];const start=performance.now();function sample(){const r=document.querySelector('.explanation-guide-overlay__card')?.getBoundingClientRect();window.__ratingMotion.push({t:Math.round(performance.now()-start),x:r?.x,y:r?.y});if(performance.now()-start<600)requestAnimationFrame(sample);}requestAnimationFrame(sample);});
  await p.getByRole('button',{name:'Next item',exact:true}).click();await pause(700);
  assert.equal(await p.locator('.explanation-guide-overlay').count(),0);assert.notEqual(await card.innerText(),before);
  const frames=await p.evaluate(()=>window.__ratingMotion),positions=frames.filter(f=>f.x!==undefined);assert(positions.every(f=>Math.abs(f.x-positions[0].x)<2&&Math.abs(f.y-positions[0].y)<2));
  const reopened=await arrowGuide(width,'reopened');await p.keyboard.press('Escape');
  checks.push({width,bucket:'pair-received',guide,reopened,frames,cardAdvanced:true,ratingSubmitted:false});
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({status:'PASS',checks}));
}finally{fs.writeFileSync(`${out}/rating-arrow-checks.json`,JSON.stringify({checks,errors},null,2)+'\n');await browser.close();}
