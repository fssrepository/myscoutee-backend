// Prepared no-event actor; preserve its original browser preference after checking persistence.
process.env.CHECKPOINT='EXPLANATION-GUIDE-001';process.env.ACTOR='1';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const {p,browser,home,pause}=await import('./session.mjs');
const key='myscoutee.http.explanation-guide.enabled.v1';
const out=new URL('../../../../../.e2e-artifacts/qa/general/EXPLANATION-GUIDE-001-20260930/',import.meta.url).pathname;
const checks=[];let previous;
try{
 await home();previous=await p.evaluate(k=>localStorage.getItem(k),key);
 assert.equal(previous,null,'Use the fresh prepared actor for default-state proof');
 assert(await p.getByRole('button',{name:'Explanations',exact:true}).isVisible());checks.push({defaultWithNoSavedChoice:'ON'});
 await p.getByRole('button',{name:'Open user menu',exact:true}).click();await p.getByRole('button',{name:'Turn explanations off',exact:true}).click();
 const saved=await p.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.includes('explanation-guide.enabled'))));assert.equal(saved[key],'false');
 await home();assert.equal(await p.getByRole('button',{name:'Explanations',exact:true}).count(),0);checks.push({savedOffAfterReload:'OFF'});
 await p.goto('http://localhost/entry');await p.getByRole('button',{name:'Explanations',exact:true}).waitFor();assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),'false');checks.push({landingVisibleDespiteInternalOff:true,internalChoicePreserved:true});
 await home();assert.equal(await p.getByRole('button',{name:'Explanations',exact:true}).count(),0);
 await p.getByRole('button',{name:'Open user menu',exact:true}).click();await p.getByRole('button',{name:'Turn explanations on',exact:true}).click();await home();assert(await p.getByRole('button',{name:'Explanations',exact:true}).isVisible());checks.push({savedOnAfterReload:'ON'});
 console.log(JSON.stringify({status:'PASS',checks}));
}finally{
 if(previous!==undefined){await p.evaluate(({key,previous})=>{if(previous===null)localStorage.removeItem(key);else localStorage.setItem(key,previous);},{key,previous});await home();}
 fs.writeFileSync(`${out}/guide-preference-checks.json`,JSON.stringify({checks},null,2)+'\n');await browser.close();
}
