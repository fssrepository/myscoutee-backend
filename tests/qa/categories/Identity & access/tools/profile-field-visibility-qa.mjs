#!/usr/bin/env node
// Profile side regression during the delegated ADMIN-CLIENT-API-001 checkpoint.
// The owner sets Workplace through the UI first. Prepare only a disposable
// friendship precondition, then restore it; do not modify profile values here.
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const expected = process.argv[2];
assert.ok(['Private', 'Friends', 'Public'].includes(expected));
const {sessions} = JSON.parse(await readFile('/tmp/myscoutee-qa-browser-sessions/ADMIN-CLIENT-API-001.json', 'utf8'));
const [viewer, owner] = sessions;
const pair = [viewer.userId, owner.userId].sort();
const pairId = pair[0].length + ':' + pair.join('');
function mongo(code) {
  return JSON.parse(execFileSync('docker', ['exec', 'mongodb', 'sh', '-c',
    'exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"',
    'profile-visibility-qa', code], {encoding:'utf8'}).trim());
}
async function profile(actor) {
  const r = await fetch('http://localhost/api/navigator/contacts/' + owner.userId + '/profile', {headers:{
    'X-App-Session-Kind':'demo', 'X-App-Session-Id':actor.sessionId, 'X-Demo-User-Id':actor.userId
  }});
  assert.equal(r.status, 200);
  return r.json();
}
const saved = mongo(`const s=db.manualQaCheckpointSnapshots.findOne({_id:'ADMIN-CLIENT-API-001'});if(!s || !Array.isArray(s.users) || s.users.indexOf(${JSON.stringify(owner.userId)}) < 0)throw Error('Disposable fixture missing');const prior=db.getCollection('userFriendships').findOne({_id:${JSON.stringify(pairId)}});if(prior)throw Error('Pre-existing relationship; refusing to replace it');print(JSON.stringify({ready:true}));`);
assert.ok(saved.ready);
const own = await profile(owner);
assert.ok(own.experiences.some(e => e.org === 'QA Private workplace'));
assert.equal(own.user.profileDetails.flatMap(g=>g.rows).find(r=>r.labelKey==='profile.experience.workplace')?.privacy, expected);
const before = await profile(viewer);
assert.equal(before.experiences.some(e=>e.org==='QA Private workplace'), expected==='Public');
try {
  mongo(`db.getCollection('userFriendships').insertOne({_id:${JSON.stringify(pairId)},leftUserId:${JSON.stringify(pair[0])},rightUserId:${JSON.stringify(pair[1])},friendsSince:new Date(),lastMetAt:new Date(),firstEventId:'qa-profile-visibility',lastEventId:'qa-profile-visibility',lastEventName:'QA precondition'});print(JSON.stringify({prepared:true}));`);
  const friend = await profile(viewer);
  assert.equal(friend.experiences.some(e=>e.org==='QA Private workplace'), expected!=='Private');
  assert.equal(friend.hiddenFields.includes('profile.experience.workplace'), expected==='Private');
} finally {
  mongo(`db.getCollection('userFriendships').deleteOne({_id:${JSON.stringify(pairId)},firstEventId:'qa-profile-visibility'});print(JSON.stringify({restored:true}));`);
}
const after = await profile(viewer);
assert.equal(after.experiences.some(e=>e.org==='QA Private workplace'), expected==='Public');
console.log(JSON.stringify({workplacePrivacy:expected,ownerRetainsExperience:true,nonFriendChecked:true,friendChecked:true,relationshipRestored:true}));
