// Repeated targets are grouped only inside the active pair card, never across list rows.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const scenario=process.env.SCENARIO||'rates';
process.env.CHECKPOINT=scenario==='home'?'EXPLANATION-GUIDE-001':'EXPLANATION-GUIDE-FEEDBACK-001';
const {p,browser,menu,home,pause}=await import('./session.mjs');
const out=new URL('../../../../../.e2e-artifacts/qa/general/EXPLANATION-GUIDE-001-20260930/',import.meta.url).pathname;
const checks=[],errors=[];p.on('pageerror',e=>errors.push(e.message));
async function selectGuide(id,label,width){
 await p.getByRole('button',{name:'Explanations',exact:true}).first().click();await p.locator('.explanation-guide-overlay h3').waitFor();await pause(200);
 const picker=p.locator('.explanation-guide-overlay__step-picker');await picker.locator('.app-menu__trigger').click();await picker.getByRole('tab',{name:/Card/}).click();
 await picker.getByRole('menuitemradio',{name:label}).click();await pause(350);
 const result=await p.locator('app-explanation-guide-overlay').evaluate(host=>{
  const c=window.ng.getComponent(host),step=c.currentStep(),target=c.resolveTarget(step,c.surfaceRoot());
  const targets=target.repeatedElements??[target.element];
  const fullscreen=!!c.surfaceRoot().querySelector('.smart-list__fullscreen-card--active');
  const boxes=[...host.querySelectorAll('.explanation-guide-overlay__focus')].map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};});
  const card=host.querySelector('section').getBoundingClientRect(),body=host.querySelector('.explanation-guide-overlay__body');
  return {step:step.id,boxes,card:{x:card.x,y:card.y,w:card.width,h:card.height},lines:Math.round(body.scrollHeight/parseFloat(getComputedStyle(body).lineHeight)),targets:targets.map(e=>{const r=c.visibleTargetRect(e),hit=document.elementsFromPoint(r.x+r.width/2,r.y+r.height/2).find(el=>!el.closest('.explanation-guide-overlay__focus'));return {aria:e.getAttribute('aria-label'),visible:r.width>0&&r.height>0,covered:getComputedStyle(e).pointerEvents!=='none'&&!!hit&&!e.contains(hit)&&!hit.contains(e),active:!fullscreen||!!e.closest('.smart-list__fullscreen-card--active'),pane:e.closest('.activities-rate-pair-inline-card')?.className};})};
 });
 assert.equal(result.step,id);assert(result.lines<=5);assert(result.targets.every(t=>t.visible&&!t.covered&&t.active));assert.equal(result.boxes.length,result.targets.length);
 if(id==='pair-profiles')assert.equal(result.boxes.length,2);
 if(id==='pair-images'){
  const lengths=await p.locator('.smart-list__fullscreen-card--active app-pair-card').evaluate(e=>window.ng.getComponent(e).card.slots.map(s=>s.slides.length));
  assert.equal(result.boxes.length,lengths.filter(n=>n>1).length);result.photoCounts=lengths;
  const panes=await p.locator('.smart-list__fullscreen-card--active .activities-rate-pair-inline-card').evaluateAll(es=>es.map(e=>e.querySelector('.image-stack-hit-area')?.getBoundingClientRect().width??0));
  let j=0;for(let i=0;i<lengths.length;i++)if(lengths[i]>1){assert(Math.abs((result.boxes[j++].w-10)-panes[i]/lengths[i])<3,'Wrong first photo segment width');}
 }
 await p.screenshot({path:`/tmp/myscoutee-guide-screenshots/pair-${scenario}-${id}-${width}.png`});await p.keyboard.press('Escape');checks.push({width,...result});return result;
}
try{
 for(const width of [390,1280]){
  if(scenario==='home'){
   await home();await p.setViewportSize({width,height:width===390?844:900});await p.getByRole('button',{name:'Select game mode',exact:true}).click();await p.getByRole('menuitemradio',{name:/Outside Network/}).click();
  }else{
   await menu('Open rates');await p.setViewportSize({width,height:width===390?844:900});await p.getByRole('button',{name:/^Open activity\.rates\.group\./}).click();await p.locator('[data-guide-item="rate:pair-received"]').click();await p.getByRole('button',{name:'Open rates fullscreen mode',exact:true}).click();
  }
  await pause(650);
  await selectGuide('pair-images',/Each side has its own photos/,width);
  await selectGuide('pair-profiles',/Open either person’s profile/,width);
  if(width===390){
   await selectGuide('pair-resize',/Resize pair cards/,width);
   const pair=p.locator('.smart-list__fullscreen-card--active app-pair-card');
   const handle=pair.getByRole('button',{name:'Resize pair cards',exact:true});const b=await handle.boundingBox();
   const before=await pair.evaluate(e=>window.ng.getComponent(e).splitPercent);
   await p.mouse.move(b.x+b.width/2,b.y+b.height/2);await p.mouse.down();await p.mouse.move(b.x+b.width/2+35,b.y+b.height/2,{steps:8});await p.mouse.up();
   const after=await pair.evaluate(e=>window.ng.getComponent(e).splitPercent);assert(after>before+1,'Drag did not resize panes');
   const moved=await handle.boundingBox();await p.mouse.move(moved.x+moved.width/2,moved.y+moved.height/2);await p.mouse.down();await p.mouse.move(moved.x+moved.width/2-35,moved.y+moved.height/2,{steps:8});await p.mouse.up();
   checks.push({width,dividerDrag:{before,after}});
  }
  if(scenario==='rates'){
   await selectGuide('pair-score-received',/A received pair score/,width);
   // The editable pair bucket must explain its central badge separately.
   await p.getByRole('button',{name:/^Open activity\.rates\.group\./}).click();await p.locator('[data-guide-item="rate:pair-given"]').click();await pause(500);
   await selectGuide('pair-score-summary',/Your current pair rating/,width);
   await p.getByRole('button',{name:'Exit rates fullscreen mode',exact:true}).click();await pause(300);
   await selectGuide('score',/Edit this rating/,width);
   await p.locator('[data-card-presentation="list"] [data-guide-field="score"]').first().click();await pause(300);
   assert(await p.locator('.app-menu__panel [data-guide-field="rating-input"]').isVisible(),'Editable badge did not open slider');
   assert(await p.locator('.app-menu__panel [data-guide-field="rating-save"]').isVisible(),'Editable badge did not expose Save');
   await p.keyboard.press('Escape');checks.push({width,editableBadgeOpened:true,ratingSaved:false});
  }
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({scenario,status:'PASS',checks}));
}finally{fs.writeFileSync(`${out}/pair-${scenario}-checks.json`,JSON.stringify({checks,errors},null,2)+'\n');await browser.close();}
