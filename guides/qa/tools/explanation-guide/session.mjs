// Attach only after the versioned checkpoint launcher has verified and prepared the fixture.
import {createRequire} from 'node:module';
import fs from 'node:fs';
// Screenshots are local diagnostics, never repository evidence.
fs.mkdirSync('/tmp/myscoutee-guide-screenshots',{recursive:true});
const require=createRequire(new URL('../../../../frontend/package.json', import.meta.url));
const {chromium}=require('playwright');
const m=JSON.parse(fs.readFileSync(`/tmp/myscoutee-qa-browser-sessions/${process.env.CHECKPOINT||'EXPLANATION-GUIDE-001'}.json`));
export const browser=await chromium.connectOverCDP(`http://127.0.0.1:${m.sessions[Number(process.env.ACTOR||0)].devToolsPort}`);
export const p=browser.contexts().flatMap(c=>c.pages()).find(p=>p.url().startsWith('http://localhost'));
p.setDefaultTimeout(5000);
await p.setViewportSize(process.env.MOBILE ? {width:390,height:844} : {width:1280,height:900});
export const pause=ms=>new Promise(r=>setTimeout(r,ms));
export async function snap(){return p.evaluate(()=>({text:document.body.innerText.slice(-9000),buttons:[...document.querySelectorAll('button')].filter(e=>e.getClientRects().length).map(e=>({t:e.innerText,a:e.getAttribute('aria-label'),g:e.getAttribute('data-guide-field')}))}));}
export async function click(a){await p.getByRole('button',{name:a,exact:true}).last().click();await pause(250);}
export async function tour(label,open=true){
 const fs=await import('node:fs');
 if(open) await p.getByRole('button',{name:'Explanations',exact:true}).first().click();
 const o=p.locator('.explanation-guide-overlay');
 await o.locator('h3').waitFor();
 const rows=[];
 for(let i=0;i<120;i++){
  await pause(230);
  if(!await o.count())break;
  await o.getByRole('button',{name:/^(Next|Done)$/}).waitFor({state:'visible'});
  const row=await o.evaluate(o=>{
   const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}};
   const card=o.querySelector('section'), b=card?.querySelector('.explanation-guide-overlay__body')||card?.querySelector('p');
   const c=rect(card),f=rect(o.querySelector('.explanation-guide-overlay__focus'));
   const component=window.ng?.getComponent(o.closest('app-explanation-guide-overlay'));
   const field=component?.currentStep(), root=component?.surfaceRoot();
   const target=field&&root?component.resolveTarget(field,root):null;
   const visible=target?component.visibleTargetRect(target.element):null;
   const hit=visible&&visible.width>0&&visible.height>0?document.elementsFromPoint(visible.x+visible.width/2,visible.y+visible.height/2).find(e=>!e.closest('.explanation-guide-overlay__shade,.explanation-guide-overlay__focus')):null;
   const occluded=!!target&&!!hit&&!target.element.contains(hit)&&!hit.contains(target.element);
   const menuId=field&&root?component.menuIdForField(field,root):null;
   const panel=menuId&&root?component.menuPanel(menuId,root):null;
   const inventory=panel?[...panel.querySelectorAll('[data-guide-item]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-guide-item')):[];
   const available=component?.guide.visibleGuideFields()??[];
   const missingMenu=inventory.filter(id=>!available.some(f=>f.id===id||f.id===menuId+':'+id));
   return {occluded,hit:hit?.className,visible:visible?{x:visible.x,y:visible.y,w:visible.width,h:visible.height}:null,menuId,missingMenu,target:rect(target?.element),scroll:root?[...root.querySelectorAll('*')].filter(e=>e.scrollTop>0).map(e=>({c:e.className,top:e.scrollTop})):[],context:component?.guide.currentContextKey(),stepId:component?.currentStep()?.id,progress:o.querySelector('.explanation-guide-overlay__progress')?.textContent,title:o.querySelector('h3')?.textContent,body:b?.textContent,lines:b?Math.round(b.scrollHeight/parseFloat(getComputedStyle(b).lineHeight)):0,focus:f,card:c,fits:!!c&&c.x>=0&&c.y>=0&&c.x+c.w<=innerWidth+1&&c.y+c.h<=innerHeight+1};
  }); rows.push(row);
  const next=o.getByRole('button',{name:'Next',exact:true});
  if(await next.count())await next.click();else {await o.getByRole('button',{name:'Done',exact:true}).click();await o.waitFor({state:'detached'});await pause(250);break;}
 }
 const result={label,at:new Date().toISOString(),viewport:await p.evaluate(()=>({w:innerWidth,h:innerHeight})),rows};
 fs.appendFileSync(process.env.GUIDE_RESULTS_PATH || '/tmp/guide-results.jsonl',JSON.stringify(result)+'\n');
 console.log(JSON.stringify({label,steps:rows.length,occluded:rows.filter(r=>r.occluded).map(r=>r.stepId),missingMenus:[...new Set(rows.flatMap(r=>r.missingMenu))],missing:rows.filter(r=>!r.focus||!r.visible||r.visible.w<1||r.visible.h<1).map(r=>r.title),overflow:rows.filter(r=>!r.fits).map(r=>r.title),long:rows.filter(r=>r.lines>5).map(r=>({t:r.title,l:r.lines}))}));
 return result;
}
export async function home(){await p.goto('http://localhost/game');await p.getByRole('button',{name:'Open user menu',exact:true}).waitFor();await p.waitForFunction(()=>window.ng?.getComponent(document.querySelector('app-side-menu'))?.activeUserLoadState().status === 'success');await pause(800);}
export async function menu(name){await home();await click('Open user menu');await p.getByRole('menuitem',{name,exact:true}).click();await pause(400);}
