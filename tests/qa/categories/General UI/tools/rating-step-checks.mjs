// Focused component step getter, variable-profile-count math and adapter checks; no submission.
process.env.CHECKPOINT = 'EXPLANATION-GUIDE-FEEDBACK-001';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ratingAverage, shiftRatingCriteria} from '../../../../../frontend/src/app/shared/core/contracts/affinity/rating-snapshot.ts';
import {activityRateRelevanceScore} from '../../../../../frontend/src/app/shared/core/base/activity-rate-order.ts';
import {BaseUserRatesMapper as Mapper} from '../../../../../frontend/src/app/shared/core/base/mappers/affinity/rate.mapper.ts';
const {p, browser, home} = await import('./session.mjs');
const checks = [];
try {
  await home();
  const bar = p.locator('app-home app-menu-rate').first();
  for (const count of [1,2,3,4,5,6,7,10]) {
    const step = await bar.evaluate((el,count) => {
      const c = window.ng.getComponent(el), original = c.config;
      try {
        c.config = {...original, criteriaDefinition:{profileType:`qa-count-${count}`,criteria:
          Array.from({length:count},(_,i)=>({...original.criteriaDefinition.criteria[i%4],id:`criterion-${i}`}))}};
        return c.baseStep;
      } finally {c.config=original;}
    },count);
    assert.equal(step,1/count);
    checks.push({criteria:count,step,verification:'live component getter'});
  }
  let cases=0;
  for (const count of [1,2,3,4,5,6,7,10]) for(let i=0;i<1000;i++) {
    const values=Array.from({length:count},(_,j)=>1+((i*13+j*7)%10)), target=1+9*i/999;
    const next=shiftRatingCriteria(values,target);
    assert(next.every(v=>Number.isInteger(v)&&v>=1&&v<=10));
    assert(Math.abs(ratingAverage(next)-Math.round(target*count)/count)<1e-10);cases++;
  }
  const snapshot={version:1,profileType:'dating',criteria:{attraction:3,personality:8,interests:8,values:8},average:6.75};
  for (const input of [
    {kind:'game-card',raterUserId:'a',ratedUserId:'b'},
    {kind:'game-card-pair',raterUserId:'a',firstRatedUserId:'b',secondRatedUserId:'c'},
    {kind:'activity-rate',ownerUserId:'a',item:{id:'test',userId:'b',mode:'individual',direction:'given',scoreGiven:5,scoreReceived:4.25}}
  ]) {
    const record=Mapper.toRecord({...input,rating:6.75,ratingSnapshot:snapshot}), payload=Mapper.toSyncPayload(record);
    assert.equal(record.rate,6.75);assert.equal(payload.rate,6.75);assert.equal(payload.scoreGiven,6.75);
    assert.deepEqual(payload.ratingSnapshot,snapshot);
  }
  assert.equal(activityRateRelevanceScore({direction:'given',scoreGiven:6.75,scoreReceived:0}),6.75);
  assert.equal(activityRateRelevanceScore({direction:'mutual',scoreGiven:6.75,scoreReceived:8.25}),2*6.75*8.25/15);
  fs.writeFileSync(new URL('../../../../../.e2e-artifacts/qa/general/EXPLANATION-GUIDE-001-20260930/rating-step-checks.json',import.meta.url),
    JSON.stringify({at:new Date().toISOString(),checks,shiftCases:cases,mapperPaths:['home-single','home-pair','activity'],saved:false},null,2)+'\n');
  console.log(`PASS live component step getter for variable criterion counts + ${cases} bounded integer shifts + fractional mapper/outbox paths`);
} finally {await browser.close();}
