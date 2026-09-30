// Use the prepared secondary actor; keep the user's populated mobile sample visible.
process.env.ACTOR ??= '1';
const {p,browser,home,pause} = await import('./session.mjs');
import fs from 'node:fs';
const out = new URL('../../evidence/general/EXPLANATION-GUIDE-001-20260930', import.meta.url).pathname;
const results=[];
for(const width of [390,1280]){
 await p.setViewportSize({width,height:width===390?844:900});
 for(const context of ['home','events']){
  await home();
  if(context==='events'){
   if(!await p.locator('.user-menu-panel.open').count())await p.getByRole('button',{name:'Open user menu',exact:true}).click();
   await pause(450);await p.locator('.user-menu-panel.open').getByRole('menuitem',{name:'Open events',exact:true}).click();await pause(450);
  }
  await p.locator('.explanation-guide-menu button').click();
  const picker=p.locator('.explanation-guide-overlay__step-picker');
  await picker.locator('button.app-menu__trigger').click();await pause(450);
  results.push(await picker.evaluate((e,{width,context})=>{
   const panel=e.querySelector('.app-menu__panel'),trigger=e.querySelector('.app-menu__trigger');
   const r=panel.getBoundingClientRect(),t=trigger.getBoundingClientRect();
   const hit=document.elementFromPoint(r.x+r.width/2,r.y+Math.min(30,r.height/2));
   return {width,context,panel:r.toJSON(),trigger:t.toJSON(),position:getComputedStyle(panel).position,insideViewport:r.x>=0&&r.y>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1,hitIsPanel:panel.contains(hit),title:panel.querySelector('.app-menu__title')?.textContent.trim(),text:panel.innerText.slice(0,120)};
  },{width,context}));
  await p.screenshot({path:`/tmp/myscoutee-guide-screenshots/step-picker-${context}-${width}.png`});
 }
 await home();await p.locator('.explanation-guide-menu button').click();
 const button=p.locator('.explanation-guide-menu button');const b=await button.boundingBox();
 await p.mouse.move(b.x+b.width/2,b.y+b.height/2);await p.mouse.down();await pause(900);
 await p.mouse.move(b.x-60,b.y-80,{steps:8});await pause(250);
 results.push(await p.evaluate(()=>{
  const x=document.querySelector('.floating-launcher-dismiss-target'),rail=document.querySelector('.floating-launcher-rail');
  if(!x)return {dragTarget:false};
  const r=x.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
  return {width:innerWidth,dragTarget:true,x:r.toJSON(),z:getComputedStyle(x).zIndex,railZ:getComputedStyle(rail).zIndex,color:getComputedStyle(x).color,background:getComputedStyle(x).backgroundImage,hit:hit?.className};
 }));
 await p.screenshot({path:`/tmp/myscoutee-guide-screenshots/drag-dismiss-${width}.png`});await p.mouse.up();
}
fs.writeFileSync(`${out}/overlay-followup.json`,JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results));
await browser.close();
