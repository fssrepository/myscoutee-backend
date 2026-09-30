// Uses the prepared pending-feedback actor. Answers remain unsent.
process.env.CHECKPOINT='EXPLANATION-GUIDE-FEEDBACK-001';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const width=Number(process.env.WIDTH||390);
const out=new URL('../../evidence/general/EXPLANATION-GUIDE-001-20260930/',import.meta.url).pathname;
process.env.GUIDE_RESULTS_PATH=`${out}/feedback-tours-${width}.jsonl`;
fs.writeFileSync(process.env.GUIDE_RESULTS_PATH,'');
const {p,browser,menu,pause,tour}=await import('./session.mjs');
const checks=[],errors=[];p.on('pageerror',e=>errors.push(e.message));
const form=p.locator('.event-feedback-form-flow');
const active=()=>form.locator('.form-flow__slide.is-active');
async function mark(name,expected){
 const before=await active().getAttribute('data-step-id');
 await p.getByRole('button',{name:'Explanations',exact:true}).click();await p.locator('.explanation-guide-overlay h3').waitFor();await pause(250);
 await p.screenshot({path:`/tmp/myscoutee-guide-screenshots/feedback-${name}-${width}.png`});
 const result=await tour(`feedback-${name}-${width}`,false), ids=result.rows.map(r=>r.stepId);
 for(const id of expected)assert(ids.includes(id),`${name}: missing ${id}`);
 assert(result.rows.every(r=>r.focus&&r.fits&&!r.occluded&&r.lines<=5),`${name}: guide layout`);
 assert.equal(await active().getAttribute('data-step-id'),before,'Guide changed form card');
 checks.push({name,steps:ids});
}
try {
 await menu('Open feedback');await p.setViewportSize({width,height:width===390?844:900});
 await p.getByRole('button',{name:'Start event feedback',exact:true}).first().click();await form.waitFor();await pause(400);
 await mark('event-empty',['feedback-primary','feedback-secondary','feedback-traits','feedback-comment','form-progress','form-navigation']);
 assert(await form.getByRole('button',{name:'Complete required fields before continuing',exact:true}).isDisabled());
 for(let i=0;i<5;i++){
  for(const field of ['feedback-primary','feedback-secondary','feedback-traits'])await active().locator(`[data-guide-field="${field}"] button`).first().click();
  if(i===0)await active().locator('textarea').fill('Guide QA: unsent feedback form.');
  if(i===0){
   await p.getByRole('button',{name:'Explanations',exact:true}).click();await p.locator('.explanation-guide-overlay h3').waitFor();
   const picker=p.locator('.explanation-guide-overlay__step-picker');await picker.locator('.app-menu__trigger').click();await picker.getByRole('menuitemradio',{name:/Continue without submitting/}).click();await pause(250);
   await p.evaluate(()=>{window.__feedbackMotion=[];const start=performance.now();function sample(){const r=document.querySelector('.explanation-guide-overlay__card')?.getBoundingClientRect();window.__feedbackMotion.push({t:Math.round(performance.now()-start),x:r?.x,y:r?.y});if(performance.now()-start<600)requestAnimationFrame(sample);}requestAnimationFrame(sample);});
  }
  await form.getByRole('button',{name:'Next step',exact:true}).click();await pause(700);
  assert.equal(await p.locator('.explanation-guide-overlay').count(),0);
  if(i===0){
   const frames=await p.evaluate(()=>window.__feedbackMotion);const positions=frames.filter(f=>f.x!==undefined);
   assert(positions.every(f=>Math.abs(f.x-positions[0].x)<2&&Math.abs(f.y-positions[0].y)<2),'Guide moved before closing');
   checks.push({name:'valid-card-slide-closes-guide-without-jump',frames});
  }
  if(i<4)await mark(`participant-${i+1}`,['feedback-primary','feedback-secondary','feedback-traits','form-progress','form-navigation']);
 }
 await mark('overview',['form-save','form-progress']);
 assert(await form.getByRole('button',{name:'Submit event feedback',exact:true}).isEnabled());
 checks.push({name:'all-five-cards-filled-overview-submit-enabled-not-clicked',passed:true});
 await form.locator('xpath=ancestor::app-popup').getByRole('button',{name:'Close',exact:true}).click();
 assert.deepEqual(errors,[]);console.log(JSON.stringify({width,status:'PASS',checks}));
}finally{fs.writeFileSync(`${out}/feedback-checks-${width}.json`,JSON.stringify({width,checks,errors},null,2)+'\n');await browser.close();}
