import assert from 'node:assert/strict';import fs from 'node:fs';
const {p,browser,home,pause}=await import('./session.mjs');const checks=[];
try{for(const width of [390,1280]){
 await p.setViewportSize({width,height:width===390?844:900});await home();
 const header=await p.locator('app-home-header').evaluate(e=>{const brand=e.querySelector('.game-brand').getBoundingClientRect(),actions=e.querySelector('.game-actions').getBoundingClientRect();return {brand:brand.toJSON(),actions:actions.toJSON()};});
 if(width>760){assert(header.actions.x-header.brand.right<16);assert(Math.abs(header.actions.y+header.actions.height/2-header.brand.y-header.brand.height/2)<1);}else assert(header.actions.y>=header.brand.bottom);
 await p.getByRole('button',{name:'Select game mode',exact:true}).click();await pause(150);
 const hidden=await p.locator('.explanation-guide-menu').evaluate(e=>getComputedStyle(e).visibility);assert.equal(hidden,'hidden');
 await p.getByRole('button',{name:'Select game mode',exact:true}).click();await pause(150);assert.equal(await p.locator('.explanation-guide-menu').evaluate(e=>getComputedStyle(e).visibility),'visible');checks.push({width,header,normalMenuGuideHidden:true});
}console.log(JSON.stringify({status:'PASS',checks}));}finally{fs.writeFileSync(new URL('../../evidence/general/EXPLANATION-GUIDE-001-20260930/header-menu-checks.json',import.meta.url),JSON.stringify({checks},null,2)+'\n');await browser.close();}
