// Prepared anonymous landing session. Dismissal lasts only for this landing visit.
process.env.CHECKPOINT='EXPLANATION-GUIDE-LANDING-001';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const {p,browser,pause}=await import('./session.mjs');
const out=new URL('../../evidence/general/EXPLANATION-GUIDE-001-20260930/',import.meta.url).pathname;
const checks=[];
try{
 for(const width of [390,1280]){
  await p.setViewportSize({width,height:width===390?844:900});await p.goto('http://localhost/entry');
  const launcher=p.locator('.explanation-guide-menu');await launcher.waitFor();
  const storedBefore=await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.includes('guide.enabled'))));
  const b=await launcher.locator('button').boundingBox();await p.mouse.move(b.x+b.width/2,b.y+b.height/2);await p.mouse.down();await pause(450);await p.mouse.move(b.x-40,b.y-40,{steps:4});await p.locator('.floating-launcher-dismiss-target').waitFor();const t=await p.locator('.floating-launcher-dismiss-target').boundingBox();await p.mouse.move(t.x+t.width/2,t.y+t.height/2,{steps:8});await p.mouse.up();await launcher.waitFor({state:'detached'});
  await p.getByRole('button',{name:'Start exploring',exact:true}).click();await p.getByRole('button',{name:'Open new demo profile',exact:true}).waitFor();assert.equal(await launcher.count(),0,'Dismissed launcher returned in demo popup');
  await p.getByRole('button',{name:'Open new demo profile',exact:true}).click();await p.locator('.app-setup-content').waitFor();assert.equal(await launcher.count(),0,'Dismissed launcher returned in setup');
  await p.locator('.app-setup-content').locator('xpath=ancestor::app-popup').getByRole('button',{name:'Close',exact:true}).click();await p.getByRole('button',{name:'Close demo user popup',exact:true}).click();assert.equal(await launcher.count(),0,'Dismissed launcher returned on same landing');
  assert.deepEqual(await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.includes('guide.enabled')))),storedBefore,'Drag wrote persistent preference');
  await p.reload();await launcher.waitFor();checks.push({width,visibleOnArrival:true,hiddenAcrossPopups:true,noPersistentWrite:true,visibleOnReload:true});
 }
 console.log(JSON.stringify({status:'PASS',checks}));
}finally{fs.writeFileSync(`${out}/landing-visibility-checks.json`,JSON.stringify({checks},null,2)+'\n');await browser.close();}
