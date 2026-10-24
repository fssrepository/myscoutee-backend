// Focused addendum to the closed guide pass; use the prepared versioned launcher session.
process.env.CHECKPOINT = 'EXPLANATION-GUIDE-FEEDBACK-001';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const {p, browser, home, menu, pause} = await import('./session.mjs');
const checks = [], errors = [];
const output = new URL('../../../../../.e2e-artifacts/qa/general/EXPLANATION-GUIDE-001-20260930/granular-rating-checks.json', import.meta.url);
p.on('pageerror', error => errors.push(error.message));
p.on('console', message => { if (message.type() === 'error' && message.text().startsWith('ERROR')) errors.push(message.text()); });
async function range(locator, value) {
  await locator.evaluate((input, next) => { input.value = String(next); input.dispatchEvent(new Event('input', {bubbles: true})); }, value);
}
async function editorFor(id) {
  await p.waitForFunction(id => [...document.querySelectorAll('app-menu-rate')].some(el =>
    window.ng.getComponent(el).config?.subjectKey===id && el.querySelector('.rate__details')?.getClientRects().length),id);
  const index=await p.locator('app-menu-rate').evaluateAll((els,id)=>els.findIndex(el=>
    window.ng.getComponent(el).config?.subjectKey===id && el.querySelector('.rate__details')?.getClientRects().length),id);
  return p.locator('app-menu-rate').nth(index);
}
async function layout(bar, name, width) {
  await bar.locator('.rate__details').waitFor({state:'visible'});
  const before = await bar.evaluate(el => ({html: el.innerHTML, rect: el.getBoundingClientRect().toJSON()}));
  await bar.locator('.rate__details').click();
  const panel = p.locator('.ui-popup--nonmodal');
  await panel.waitFor();
  await p.mouse.move(0, 0);
  await pause(250);
  const sample = await bar.evaluate(el => {
    const rect = e => e.getBoundingClientRect().toJSON();
    const popup = document.querySelector('.ui-popup--nonmodal');
    const details = rect(el.querySelector('.rate__details')), save = rect(el.querySelector('.rate__commit'));
    const parent = rect(el.closest('.app-menu__panel') ?? el);
    const expanded = rect(popup.querySelector('section'));
    const base = el.querySelector('.rate__slider-shell');
    const granular = popup.querySelector('.rate__slider-shell');
    const launchers = [...document.querySelectorAll('app-floating-launcher')];
    return { details, save, parent, expanded, backdrop: !!popup.querySelector('.ui-popup__backdrop'),
      ariaModal: popup.querySelector('section').getAttribute('aria-modal'),
      mainVisible: getComputedStyle(el).visibility,
      launchersHidden: launchers.every(el => getComputedStyle(el).visibility === 'hidden'),
      sameTrack: getComputedStyle(base.querySelector('.rate__track-fill')).backgroundImage === getComputedStyle(granular.querySelector('.rate__track-fill')).backgroundImage,
      extraAverage: /Average:|Átlag:/.test(popup.textContent), criteria: popup.querySelectorAll('input[type="range"]').length };
  });
  assert.equal(sample.details.height, sample.save.height);
  assert.equal(sample.details.y, sample.save.y);
  assert(sample.details.right < sample.save.x);
  assert(Math.abs(sample.parent.width - sample.expanded.width) < 1, JSON.stringify(sample));
  assert(sample.expanded.bottom < before.rect.y);
  assert(sample.expanded.x >= 0 && sample.expanded.right <= width);
  assert.equal(sample.backdrop, false); assert.equal(sample.ariaModal, null);
  assert.equal(sample.mainVisible, 'visible'); assert.equal(sample.launchersHidden, width <= 760); assert(sample.sameTrack);
  assert.equal(sample.extraAverage, false); assert.equal(sample.criteria, 4);
  const inputs = panel.locator('input[type="range"]');
  assert.equal(await bar.locator('.rate__slider').getAttribute('step'), '0.25');
  assert.deepEqual(await inputs.evaluateAll(es => es.map(e => e.step)), ['1','1','1','1']);
  for (const [index, value] of [2,4,6,8].entries()) await range(inputs.nth(index), value);
  assert.equal((await bar.locator('.rate__details .rate__value').innerText()).trim(), '5');
  await range(bar.locator('.rate__slider'), 6);
  assert.deepEqual(await inputs.evaluateAll(es => es.map(e => Number(e.value))), [3,5,7,9]);
  await range(bar.locator('.rate__slider'), 6.25);
  assert.deepEqual(await inputs.evaluateAll(es => es.map(e => Number(e.value))), [4,5,7,9]);
  const badge=await bar.locator('.rate__details .rate__value').evaluate(el=>({text:el.textContent,width:el.clientWidth,scroll:el.scrollWidth}));
  assert.equal(badge.text.trim(),'6.25');assert(badge.scroll<=badge.width);
  await range(bar.locator('.rate__slider'), 7);
  assert.deepEqual(await inputs.evaluateAll(es => es.map(e => Number(e.value))), [4,6,8,10]);
  await range(bar.locator('.rate__slider'), 10);
  assert.deepEqual(await inputs.evaluateAll(es => es.map(e => Number(e.value))), [10,10,10,10]);
  await range(bar.locator('.rate__slider'), 1);
  assert.deepEqual(await inputs.evaluateAll(es => es.map(e => Number(e.value))), [1,1,1,1]);
  await p.screenshot({path: `/tmp/myscoutee-guide-screenshots/granular-${name}-${width}.png`});
  await panel.getByRole('button', {name: 'Close', exact: true}).click();
  await panel.waitFor({state: 'detached'});
  assert.equal(await p.locator('app-floating-launcher').first().evaluate(el => getComputedStyle(el).visibility), 'visible');
  checks.push({surface:name, width, ...sample, coupledShift:true, minMax:true, launchersRestored:true});
  console.log(`PASS ${name} ${width}`);
}
async function guide() {
  await p.getByRole('button', {name:'Explanations', exact:true}).first().click();
  const overlay = p.locator('.explanation-guide-overlay');
  await overlay.locator('h3').waitFor();
  const picker = overlay.locator('.explanation-guide-overlay__step-picker');
  await picker.locator('.app-menu__trigger').click();
  await picker.getByRole('tab', {name:'Ratings', exact:true}).click();
  await picker.getByRole('menuitemradio', {name:/Fine-tune the rating/}).click();
  assert.match(await overlay.innerText(), /main slider moves them together/);
  checks.push({guideStep:'rating-details',targetVisible:true});
  await p.keyboard.press('Escape');
}
try {
  if (process.env.RATING_PERSISTENCE_ONLY) {
    checks.push(...JSON.parse(fs.readFileSync(output)).checks.filter(check => check.surface || check.guideStep));
  }
  for (const width of process.env.RATING_PERSISTENCE_ONLY ? [] : [1280,390]) {
    await p.setViewportSize({width,height:width===390?844:900});
    await home();
    await layout(p.locator('app-home app-menu-rate').first(), 'home', width);
    if (width===1280) await guide();
    await menu('Open rates');
    await p.getByRole('button',{name:'Edit your rating',exact:true}).nth(2).click();
    await layout(p.locator('app-menu-rate').last(), 'activity-list', width);
    // Closing the row editor preserves the underlying Activity list/fullscreen state.
    await p.getByRole('button',{name:'Open rates fullscreen mode',exact:true}).click();
    await pause(300);
    await layout(p.locator('app-activities-popup app-menu-rate').first(), 'activity-fullscreen', width);
  }
  await p.setViewportSize({width:1280,height:900});
  await menu('Open rates');
  // Use Alex's own canonical record. The seed also has a separate reciprocal row for this pair.
  const targetId = 'a6430f06-53c3-584b-9b76-4d679558e314';
  const targetIndex = await p.locator('app-activities-popup').evaluate((el,id) =>
    window.ng.getComponent(el).activitiesRates.deps.getFilteredActivityRows().findIndex(row => row.id===id),targetId);
  assert(targetIndex >= 0);
  await p.getByRole('button',{name:'Edit your rating',exact:true}).nth(targetIndex).click();
  let bar = await editorFor(targetId);
  await bar.locator('.rate__details').waitFor({state:'visible'});
  const original = await bar.evaluate(el => {
    const config = window.ng.getComponent(el).config;
    return {id:config.subjectKey, score:config.value, snapshot:config.ratingSnapshot};
  });
  assert(original.id && Number.isFinite(original.score));
  fs.writeFileSync('/tmp/granular-rating-original.json', JSON.stringify(original));
  console.log('Rating before save', original);
  await bar.locator('.rate__details').click();
  let panel = p.locator('.ui-popup--nonmodal');
  await panel.waitFor();
  for (const [index, value] of [3,8,8,8].entries()) await range(panel.locator('input[type="range"]').nth(index), value);
  await panel.getByRole('button',{name:'Close',exact:true}).click();
  const responsePromise = p.waitForResponse(response => response.url().endsWith('/user-rates/sync'), {timeout:45000});
  await bar.locator('.rate__commit').click();
  const response = await responsePromise;
  const sync = await response.json();
  const submitted = response.request().postDataJSON().rates.find(rate => rate.id===original.id);
  assert(submitted, 'Saved request must use the selected rating identity');
  const headers = await response.request().allHeaders();
  const url = response.url();
  try {
    assert(sync.syncedRateIds.includes(original.id));
    assert.equal(submitted.rate, 6.75); assert.equal(submitted.scoreGiven, 6.75);
    assert.equal(submitted.ratingSnapshot.average,6.75);
    console.log('PASS server snapshot write');
    await menu('Open rates');
    // Identify the same card after server reload, independent of ordering.
    const index = await p.locator('app-activities-popup').evaluate((el,id) => {
      const c=window.ng.getComponent(el);
      return c.activitiesRates.deps.getFilteredActivityRows().findIndex(row => row.id===id);
    },original.id);
    assert(index>=0);
    const cardBadge=p.getByRole('button',{name:'Edit your rating',exact:true}).nth(index);
    assert.match(await cardBadge.innerText(), /6\.75/);
    assert(await cardBadge.evaluate(el=>el.scrollWidth<=el.clientWidth));
    await cardBadge.click();
    bar=await editorFor(original.id);
    await bar.locator('.rate__details').waitFor({state:'visible'});
    const persisted=await bar.evaluate(el=>window.ng.getComponent(el).config.ratingSnapshot);
    assert.deepEqual(persisted,submitted.ratingSnapshot);
    assert.equal((await bar.locator('.rate__value').innerText()).trim(),'6.75');
    await bar.locator('.rate__details').click();
    panel=p.locator('.ui-popup--nonmodal');await panel.waitFor();
    assert.deepEqual(await panel.locator('input[type="range"]').evaluateAll(es=>es.map(e=>Number(e.value))),[3,8,8,8]);
    await panel.getByRole('button',{name:'Close',exact:true}).click();
    const invalid={...submitted,ratingSnapshot:{...submitted.ratingSnapshot,average:9}};
    const rejected=await (await p.request.post(url,{headers,data:{rates:[invalid]}})).json();
    assert(rejected.failedRateIds.includes(original.id));assert(!rejected.syncedRateIds.includes(original.id));
    checks.push({serverSaveReload:true, scalar:6.75, average:6.75, criteria:[3,8,8,8], invalidAverageRejected:true, fractionalListBadgeFits:true});
    console.log('PASS server reload and invalid snapshot rejection');
  } finally {
    const restored={...submitted,rate:original.score,scoreGiven:original.score};
    if(original.snapshot)restored.ratingSnapshot=original.snapshot;else delete restored.ratingSnapshot;
    const result=await (await p.request.post(url,{headers,data:{rates:[restored]}})).json();
    assert(result.syncedRateIds.includes(original.id));
    await menu('Open rates');
    const restoredItem=await p.locator('app-activities-popup').evaluate((el,id)=>
      window.ng.getComponent(el).activitiesRates.deps.getRateItems().find(item=>item.id===id),original.id);
    assert.equal(restoredItem.scoreGiven,original.score);
    assert.deepEqual(restoredItem.ratingSnapshot??null,original.snapshot??null);
    checks.push({originalRatingRestored:true,score:original.score,originalSnapshotRestored:true,restoredReadBack:true});
  }
  assert.deepEqual(errors, []);
} finally {
  fs.writeFileSync(output, JSON.stringify({at:new Date().toISOString(), checks, errors}, null, 2)+'\n');
  await browser.close();
}
