#!/usr/bin/env node
// Delegated EVENT-GALLERY-FEED-001 supplement. Requires staged fixture and managed logins.
// Uses disposable posts owned by the fixture actor; restores moderation settings, retains result evidence.
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const checkpoint = 'EVENT-GALLERY-FEED-001';
const { sessions } = JSON.parse(await readFile(`/tmp/myscoutee-qa-browser-sessions/${checkpoint}.json`, 'utf8'));
const [owner, other, admin] = sessions;
assert.equal(owner.userId, '6a1100000000000000000001');
const base = 'http://localhost/api';
async function request(actor, path, method = 'GET', body, expected = 200) {
  const response = await fetch(base + path, { method, headers: {
    'Content-Type': 'application/json', 'X-App-Session-Kind': 'demo',
    'X-App-Session-Id': actor.sessionId, 'X-Demo-User-Id': actor.userId
  }, ...(body ? { body: JSON.stringify(body) } : {}) });
  assert.equal(response.status, expected, `${method} ${path}`);
  return response.json();
}
const state = () => request(admin, `/admin/content-moderation/state?adminUserId=${admin.userId}`);
const page = (actor, status) => request(actor, `/activities/feed?userId=${actor.userId}&pageSize=50&status=${status}`);
async function settings(value) {
  const snapshot = await state();
  return request(admin, '/admin/content-moderation/settings', 'POST', {
    adminUserId: admin.userId, expectedRevision: snapshot.revision, settings: value
  });
}
const original = (await state()).settings;
const existing = (await page(owner, 'accepted')).items[0];
assert.ok(existing, 'Fixture owner needs a saved photo to reuse');
const option = (await request(owner, `/activities/feed/events?userId=${owner.userId}&pageSize=50`)).items[0].event;
const image = existing.imageUrls[0];
const report = { checkpoint, startedAt: new Date().toISOString(), checks: [] };
const created = [];
const counts = record => Object.fromEntries(['under-review','accepted','rejected','blocked'].map(key => [key, record?.[key] ?? 0]));
try {
  await settings({ enabled: true, autoApprove: false, delayMinutes: 43200, categories: ['feed'] });
  // Idempotent create replay exercises existing durable delivery and hydrates newly introduced owner projection.
  await request(owner, '/activities/feed', 'POST', { userId: owner.userId, id: existing.id, imageUrls: [], imageDetails: {} });
  for (const target of ['under-review', 'accepted', 'rejected', 'blocked']) {
    const before = (await page(owner, target)).context;
    const beforeAdmin = counts((await state()).counts.feed);
    const foreignBefore = (await page(other, target)).context;
    const id = crypto.randomUUID();
    const body = { userId: owner.userId, id, imageUrls: [image], imageDetails: {
      [image]: { caption: `QA remove ${target}`, location: '', event: option }
    } };
    created.push(id);
    const post = await request(owner, '/activities/feed', 'POST', body);
    assert.equal(post.moderationStatus, 'under-review');
    assert.ok(post.feedCounters.revision > before.revision);
    let version = 1;
    for (const status of target === 'blocked' ? ['accepted', 'blocked'] : target === 'under-review' ? [] : [target]) {
      const decision = await request(admin, `/admin/content-moderation/${encodeURIComponent('feed:' + id)}/decision`, 'POST', {
        adminUserId: admin.userId, commandId: crypto.randomUUID(), expectedVersion: version, status, message: ''
      });
      version = decision.item.version;
    }
    const own = await page(owner, target);
    assert.ok(own.items.some(item => item.id === id));
    assert.equal(own.context.counts[target], (before.counts[target] ?? 0) + 1);
    assert.equal(own.total, own.context.counts[target]);
    assert.ok(!(await page(other, target)).items.some(item => item.id === id));
    assert.deepEqual((await page(other, target)).context, foreignBefore);
    assert.equal((await page(other, 'public')).items.some(item => item.id === id), target === 'accepted');
    await request(other, `/activities/feed/${id}?userId=${other.userId}`, 'DELETE', undefined, 403);
    assert.deepEqual((await page(owner, target)).context, own.context);
    const removed = await request(owner, `/activities/feed/${id}?userId=${owner.userId}`, 'DELETE');
    assert.deepEqual(counts(removed.counts), counts(before.counts));
    assert.ok(removed.revision > own.context.revision);
    const retry = await request(owner, `/activities/feed/${id}?userId=${owner.userId}`, 'DELETE');
    assert.deepEqual(retry, removed);
    assert.deepEqual(counts((await state()).counts.feed), beforeAdmin);
    for (const status of ['public','under-review','accepted','rejected','blocked']) {
      assert.ok(!(await page(owner, status)).items.some(item => item.id === id));
    }
    await request(owner, '/activities/feed', 'POST', body, 410);
    await request(admin, `/admin/content-moderation/${encodeURIComponent('feed:' + id)}/decision`, 'POST', {
      adminUserId: admin.userId, commandId: crypto.randomUUID(), expectedVersion: version, status: 'accepted', message: ''
    }, 404);
    report.checks.push({ target, id, result: 'PASS', ownerOnly: true, countersOnce: true, replayCannotResurrect: true });
    console.log(JSON.stringify(report.checks.at(-1)));
  }
  await settings({ ...original, enabled: false });
  const id = crypto.randomUUID(); created.push(id);
  const post = await request(owner, '/activities/feed', 'POST', { userId: owner.userId, id, imageUrls: [image],
    imageDetails: { [image]: { event: option, caption: 'QA remove moderation OFF', location: '' } } });
  assert.equal(post.moderationStatus, 'accepted');
  await request(owner, `/activities/feed/${id}?userId=${owner.userId}`, 'DELETE');
  assert.ok(!(await page(other, 'public')).items.some(item => item.id === id));
  report.checks.push({ target: 'moderation-off', id, result: 'PASS' });
} finally {
  // Normal owner removal only. Never delete unrelated fixtures/users or seed successful decisions.
  for (const id of created) {
    try { await request(owner, `/activities/feed/${id}?userId=${owner.userId}`, 'DELETE'); }
    catch (error) { report.cleanupError = String(error); }
  }
  await settings(original);
  report.finishedAt = new Date().toISOString();
  await writeFile('/tmp/qa-feed-buckets-runtime-result.json', JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ checks: report.checks.length, settingsRestored: true, evidence: '/tmp/qa-feed-buckets-runtime-result.json' }));
