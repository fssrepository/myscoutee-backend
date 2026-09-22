#!/usr/bin/env node
// Only run after explicit full-flow delegation and versioned fixture/launcher preparation.
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const require = createRequire(path.join(root, 'frontend/package.json'));
const { chromium } = require('playwright');
const format = process.argv[2];
if (!['before-meeting', 'speed-meeting'].includes(format) || !process.argv.includes('--delegated')) {
  throw new Error('Usage after explicit authorization: node guides/qa/tools/run-event-activity-rating.mjs before-meeting|speed-meeting --delegated');
}
const runDate = new Date().toISOString().slice(0,10);
const output = path.join(root, `guides/qa/evidence/EVENT-ACTIVITY-RATING-001-auto-${format}-${runDate}.json`);
const report = { format, startedAt: new Date().toISOString(), status: 'RUNNING', checks: [] };
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const snapshot = () => JSON.parse(execFileSync('bash', ['server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh', 'status', 'event-rating', 'EVENT-ACTIVITY-RATING-001'], { cwd: root, encoding: 'utf8' }));
const record = async (name, detail) => { report.checks.push({name, detail}); await fs.writeFile(output, JSON.stringify(report,null,2)+'\n'); console.log(`PASS ${name}`); };
const actors = [];
const directionLabel = {given:'Given',received:'Received',mutual:'Mutual',met:'Met'};
async function dismissGuide(p) {
  const gotIt=p.locator('app-explanation-popup button[aria-label="Got it"]:visible');
  if (await gotIt.count()) await gotIt.click();
}
async function openRates(p) {
  await p.bringToFront();
  await dismissGuide(p);
  if (await p.locator('button[aria-label="Close activities"]:visible').count()) return;
  const close = p.getByRole('button',{name:'Close',exact:true});
  if (await close.count() && await close.last().isVisible()) await close.last().click();
  const openMenu=p.getByRole('button',{name:'Open user menu',exact:true});
  if (await openMenu.count()) await openMenu.click();
  assert.match(await p.locator('button[aria-label="Open rates"]:visible').first().innerText(), /\b1\b/);
  await p.locator('button[aria-label="Open rates"]:visible').first().click();
  await p.locator('button[aria-label="Close activities"]:visible').waitFor();
  await dismissGuide(p);
}
async function selectBucket(p,direction) {
  await p.bringToFront();
  await dismissGuide(p);
  const toggle=p.locator('button[aria-label*="activity.rates.group."]:visible');
  if ((await toggle.getAttribute('aria-label')).startsWith('Open ')) await toggle.click();
  await p.locator('button:not([aria-label]):visible').filter({hasText:new RegExp(directionLabel[direction])}).first().click();
  await p.waitForFunction(label => [...document.querySelectorAll('button')].some(e => (e.getAttribute('aria-label')||'').startsWith('Open activity.rates.group.') && (e.getAttribute('aria-label')||'').endsWith(label)),directionLabel[direction]);
}
async function checkBuckets(actor,expected,label) {
  const p=actor.page;const counts={};
  for (const direction of ['met','given','received','mutual']) {
    await selectBucket(p,direction);
    const target=direction===expected?1:0;
    await p.waitForFunction(count => [...document.querySelectorAll('app-activities-rate-template button[aria-label^="View "]')].filter(e=>e.getClientRects().length).length===count,target,{timeout:12000});
    // Allow the newly selected list to finish rendering before recording its content.
    await pause(300);
    counts[direction]=await p.locator('app-activities-rate-template button[aria-label^="View "]:visible').count();
    assert.equal(counts[direction],target);
  }
  const badge=await p.locator('button[aria-label="Open rates"]:visible').first().innerText();
  assert.match(badge,/\b1\b/);
  await record(`${label}: ${actor.name} buckets and side-menu badge`,{counts,badge});
}
async function giveRating(actor,direction,value) {
  const p=actor.page;
  await selectBucket(p,direction);
  await p.locator('button[aria-label="Edit your rating"]:visible, button[aria-label="Add your rating"]:visible').click();
  const slider=p.locator('input[type="range"]:visible');
  await slider.press('Home');
  const min=Number(await slider.inputValue());
  for(let i=min;i<value;i++) await slider.press('ArrowRight');
  assert.equal(Number(await slider.inputValue()),value);
  await p.getByRole('button',{name:'Save',exact:true}).click();
  console.log(`Saved ${actor.name}: ${value}`);
}
async function awaitScores(casey,nova,met) {
  const deadline=Date.now()+55000;
  while(Date.now()<deadline){
    const s=snapshot(),r=s.rates[0];
    const caseyOwns=r?.ownerUserId==='6a00000000000000000000a1';
    if(s.rates.length===1 && (caseyOwns?r.scoreGiven:r.scoreReceived)===casey && (caseyOwns?r.scoreReceived:r.scoreGiven)===nova && r.met===met){
      assert.equal(s.feedbackAnswers,0);
      assert.ok(s.rateCounters.every(u=>u.activities.game===1));
      await record(`persisted Casey${casey}/Nova${nova}, Met=${met}`,s);return;
    }
    await pause(1500);
  }
  throw new Error('Saved rating did not reach the expected persisted state within55s');
}
try {
  const baseline=snapshot();assert.equal(baseline.selectedFormat,format);assert.equal(baseline.phase,'ready-for-manual-rating');
  assert.equal(baseline.rates.length,1);assert.equal(baseline.rates[0].scoreReceived,0);
  assert.equal(baseline.rates[0].scoreGiven,format==='before-meeting'?9:0);
  assert.equal(baseline.rates[0].met,format==='speed-meeting');
  await record('fixture baseline',baseline);
  const m=JSON.parse(await fs.readFile('/tmp/myscoutee-qa-browser-sessions/EVENT-ACTIVITY-RATING-001.json','utf8'));
  for(const session of m.sessions){
    const browser=await chromium.connectOverCDP(`http://127.0.0.1:${session.devToolsPort}`);
    const page=browser.contexts().flatMap(c=>c.pages()).find(p=>p.url().startsWith('http://localhost'));
    assert.ok(page);page.setDefaultTimeout(12000);
    const guideButton=page.locator('app-explanation-popup button[aria-label="Got it"]:visible');
    await page.addLocatorHandler(guideButton, async () => { await guideButton.click(); });
    actors.push({name:session.expectedName,page});await openRates(page);
  }
  await checkBuckets(actors[0],format==='before-meeting'?'given':'met','initial');
  await checkBuckets(actors[1],format==='before-meeting'?'received':'met','initial');
  if(format==='speed-meeting'){
    await giveRating(actors[0],'met',9);await awaitScores(9,0,true);
    await checkBuckets(actors[0],'given','one-sided');await checkBuckets(actors[1],'received','one-sided');
  }
  await giveRating(actors[1],'received',6);await awaitScores(9,6,format==='speed-meeting');
  const finalDirection=format==='before-meeting'?'mutual':'met';
  await checkBuckets(actors[0],finalDirection,'reciprocal');await checkBuckets(actors[1],finalDirection,'reciprocal');
  for(const actor of actors) await selectBucket(actor.page,finalDirection);
  report.status='PASS';report.finishedAt=new Date().toISOString();
} catch(error){report.status='FAIL';report.error=String(error.stack||error);console.error(report.error);}
await fs.writeFile(output,JSON.stringify(report,null,2)+'\n');
// Disconnect CDP without closing the user-visible managed browser sessions.
process.exit(report.status==='PASS'?0:1);
