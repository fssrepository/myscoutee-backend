// Real filter save/reload, retaining and restoring the prepared actor's selection.
import assert from 'node:assert/strict';
import fs from 'node:fs';
process.env.ACTOR='0';
const {p,browser,home,pause}=await import('./session.mjs');
const checks=[];let toggled=false, optionId;
const snapshot=()=>p.locator('app-home').evaluate(e=>{const c=window.ng.getComponent(e);return {gender:c.activeUser.gender,filter:c.gameFilter,badge:c.filterBadgeCount,remaining:c.remainingCandidateCount,history:c.historyBadgeCount};});
async function toggle(){
 await p.locator('[data-guide-item="home-filter"]').click();
 const control=p.locator('[data-guide-control="home-filter-genders"]');await control.locator('button.app-menu__trigger').click();
 if(!optionId)optionId=await control.locator('[role="menuitemcheckbox"]').first().getAttribute('data-guide-item');
 await control.locator(`[data-guide-item="${optionId}"]`).click();if(await control.locator('button.app-menu__trigger').getAttribute('aria-expanded')==='true')await control.locator('button.app-menu__trigger').click();
 await p.locator('[data-guide-item="game-filter-apply"]').click();await p.locator('app-home-game-filter-popup').waitFor({state:'detached'});
}
try {
 await home();const before=await snapshot();checks.push({before});
 const count=f=>Object.values(f).filter(Array.isArray).reduce((n,x)=>n+x.length,0)+Number(f.ageMin!==18||f.ageMax!==120)+Number(f.heightMinCm!==40||f.heightMaxCm!==250);
 assert.equal(before.badge,count(before.filter));assert.deepEqual(before.filter.genders,before.gender==='woman'?['man']:['woman']);
 await toggle();toggled=true;await home();const saved=await snapshot();assert.equal(saved.badge,count(saved.filter));assert.equal(Math.abs(saved.badge-before.badge),1);assert.equal(saved.history,before.history);checks.push({saved});
 await toggle();toggled=false;await home();const restored=await snapshot();assert.deepEqual(restored.filter,before.filter);assert.equal(restored.badge,before.badge);checks.push({restored});
 console.log(JSON.stringify({status:'PASS',checks}));
}finally{if(toggled){await home();await toggle();await home();}fs.writeFileSync(new URL('../../evidence/general/EXPLANATION-GUIDE-001-20260930/filter-badge-checks.json',import.meta.url),JSON.stringify({checks},null,2)+'\n');await browser.close();}
