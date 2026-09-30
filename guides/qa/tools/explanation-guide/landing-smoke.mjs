// Prepared anonymous session only; no account creation, login submission or profile save.
process.env.CHECKPOINT = 'EXPLANATION-GUIDE-LANDING-001';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const width = Number(process.env.WIDTH || 390);
const out = new URL('../../evidence/general/EXPLANATION-GUIDE-001-20260930/', import.meta.url).pathname;
process.env.GUIDE_RESULTS_PATH = `${out}/landing-tours-${width}.jsonl`;
fs.writeFileSync(process.env.GUIDE_RESULTS_PATH,'');
const { p, browser, pause, tour } = await import('./session.mjs');
const evidence = [];
const errors = [];
p.on('pageerror', e => errors.push(e.message));
const mark = async name => {
  await p.getByRole('button', {name:'Explanations', exact:true}).click();
  await p.locator('.explanation-guide-overlay h3').waitFor();
  await pause(300);
  await p.screenshot({path:`/tmp/myscoutee-guide-screenshots/landing-${name}-${width}.png`});
  const result = await tour(`landing-${name}-${width}`, false);
  assert(result.rows.length > 0, name);
  assert(result.rows.every(r => r.focus && r.fits), `${name}: missing target/overflow`);
  evidence.push({name, steps:result.rows.length, long:result.rows.filter(r=>r.lines>5).map(r=>r.stepId), occluded:result.rows.filter(r=>r.occluded).map(r=>r.stepId)});
};
const pageName = () => p.locator('.form-flow__step-badge').innerText();
const form = p.locator('.profile-onboarding-body');
try {
  await p.setViewportSize({width,height:width===390?844:900});
  await p.goto('http://localhost/entry');
  await p.getByRole('button',{name:'Explanations',exact:true}).waitFor();
  await pause(400);
  const version = await p.locator('.entry-version-label').boundingBox();
  const launcher = await p.locator('.explanation-guide-menu button').boundingBox();
  evidence.push({name:'version-clearance',gap:version.y-(launcher.y+launcher.height)});
  assert(version.y > launcher.y+launcher.height,'Launcher overlaps version');
  await mark('home');
  await p.getByRole('button',{name:'Start exploring',exact:true}).click();
  await p.getByRole('button',{name:'Open new demo profile',exact:true}).waitFor();
  await mark('demo');
  await p.getByRole('button',{name:'Open new demo profile',exact:true}).click();
  await p.locator('.app-setup-content').waitFor();
  await mark('setup');
  // Opening the existing help document must not put a second guide on it.
  await p.getByRole('button',{name:'Explanations',exact:true}).click();
  await p.locator('.explanation-guide-overlay h3').waitFor();
  await p.getByRole('button',{name:'Installation and permissions',exact:true}).click();
  await p.locator('.explanation-guide-overlay').waitFor({state:'detached'});
  assert(await p.locator('.app-setup-help').isVisible());
  await p.locator('.app-setup-help').locator('xpath=ancestor::app-popup').getByRole('button',{name:'Close',exact:true}).click();
  await p.locator('.app-setup-content').getByRole('button',{name:'Login',exact:true}).click();
  await form.waitFor();
  await mark('registration-empty');
  await form.locator('[data-control-id="full-name"] input').fill('Landing Guide QA');
  await form.locator('[data-control-id="birthday"] input').fill('1995/05/15');
  await form.locator('[data-control-id="city"] input').fill('Budapest');
  await form.locator('[data-control-id="height"] input').fill('180');
  await form.locator('[data-control-id="physique"] button').first().click();
  await form.locator('[data-control-id="physique"]').getByRole('menuitemradio',{name:/Average/}).click();
  await form.locator('[data-control-id="languages"] button').first().click();
  await form.locator('[data-control-id="languages"] [data-guide-item]').filter({hasText:'English'}).click();
  await p.keyboard.press('Escape'); await pause(200);
  assert((await pageName()).includes('Basics'));
  await form.getByRole('button',{name:'Next step',exact:true}).click(); await pause(600);
  assert((await pageName()).includes('Photos'));
  await mark('registration-photos-empty');
  const files = [
    'server/docker/conf/minio/media/images/demo-profiles/4b5bad1292fb6db05dc0e455/photo-01/large.webp',
    'server/docker/conf/minio/media/images/demo-profiles/4b5bad1292fb6db05dc0e455/photo-02/large.webp',
    'server/docker/conf/minio/media/images/demo-assets/asset-025/v1/large.webp'
  ];
  for (let i=0;i<files.length;i++) {
    await form.locator('input[type=file]').nth(i).setInputFiles(files[i]);
    await p.waitForFunction(() => !Array.from(document.querySelectorAll('app-image-carousel')).some(e=>window.ng?.getComponent(e)?.uploadingSlotIndex!==null));
    await pause(150);
  }
  assert((await pageName()).includes('Photos'), 'Upload changed page');
  await mark('registration-photos-filled');
  assert((await pageName()).includes('Photos'), 'Guide changed page');
  await form.getByRole('button',{name:'Next step',exact:true}).click();await pause(600);
  assert((await pageName()).includes('Lifestyle'));
  await mark('registration-lifestyle');
  assert((await pageName()).includes('Lifestyle'), 'Guide changed page');
  // Valid-page edge: open guide, select the navigation explanation, then use the real arrow.
  await p.getByRole('button',{name:'Explanations',exact:true}).click();
  await p.locator('.explanation-guide-overlay h3').waitFor();
  const picker=p.locator('.explanation-guide-overlay__step-picker');
  await picker.locator('.app-menu__trigger').click();
  await picker.getByRole('menuitemradio',{name:/Move through the form/}).click();await pause(200);
  await p.evaluate(()=>{
    window.__landingGuideMotion=[];const start=performance.now();
    function sample(){const card=document.querySelector('.explanation-guide-overlay__card');const r=card?.getBoundingClientRect();window.__landingGuideMotion.push({t:Math.round(performance.now()-start),x:r?.x,y:r?.y});if(performance.now()-start<500)requestAnimationFrame(sample);}requestAnimationFrame(sample);
  });
  await form.getByRole('button',{name:'Next step',exact:true}).click();await pause(600);
  assert.equal(await p.locator('.explanation-guide-overlay').count(),0);
  assert((await pageName()).includes('Review'));
  evidence.push({name:'guide-slide-exit',frames:await p.evaluate(()=>window.__landingGuideMotion)});
  await mark('registration-review');
  assert(await form.getByRole('button',{name:'Save profile',exact:true}).isEnabled());
  await p.getByRole('button',{name:'Close profile setup',exact:true}).click();
  if(await p.getByRole('button',{name:'Close demo user popup',exact:true}).count()) await p.getByRole('button',{name:'Close demo user popup',exact:true}).click();
  await p.getByRole('button',{name:'Open partner overview',exact:true}).click();
  await p.locator('.entry-partner-operator-access-button').click();
  await p.locator('.firebase-auth-panel').waitFor();await mark('auth-providers');
  await p.getByRole('button',{name:'Continue with email',exact:true}).click();
  await p.getByRole('tab',{name:'Create',exact:true}).click();await mark('auth-create');
  await p.getByRole('button',{name:'Explanations',exact:true}).click();await p.locator('.explanation-guide-overlay h3').waitFor();
  await p.keyboard.press('Escape');await p.locator('.explanation-guide-overlay').waitFor({state:'detached'});
  assert(await p.locator('.firebase-auth-panel').isVisible());
  await p.getByRole('button',{name:'Close login popup',exact:true}).click();
  // Dismiss only this instance. Internal preference remains untouched.
  const button=p.locator('.explanation-guide-menu button'),b=await button.boundingBox();
  await p.mouse.move(b.x+b.width/2,b.y+b.height/2);await p.mouse.down();await pause(450);
  await p.mouse.move(b.x-40,b.y-40,{steps:4});await p.locator('.floating-launcher-dismiss-target').waitFor();
  const target=await p.locator('.floating-launcher-dismiss-target').boundingBox();
  await p.mouse.move(target.x+target.width/2,target.y+target.height/2,{steps:8});await p.mouse.up();
  await p.locator('.explanation-guide-menu').waitFor({state:'detached'});
  evidence.push({name:'escape-preserves-auth-popup-and-drag-dismiss',passed:true});
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({width,status:'PASS',evidence}));
} finally {
  fs.writeFileSync(`${out}/landing-checks-${width}.json`,JSON.stringify({width,evidence,errors},null,2)+'\n');
  await browser.close();
}
