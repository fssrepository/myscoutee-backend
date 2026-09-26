#!/usr/bin/env node
// Read-only Group block-1 oracle. Uses the versioned launcher's existing logins.
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const checkpoint = 'GROUP-LIFECYCLE-001';
const manifest = JSON.parse(await readFile(`/tmp/myscoutee-qa-browser-sessions/${checkpoint}.json`, 'utf8'));
const evidence = { checkpoint, adapter: 'http', checkedAt: new Date().toISOString(), actors: [] };
for (const session of manifest.sessions) {
  const headers = { 'X-App-Session-Kind': 'demo', 'X-Demo-User-Id': session.userId,
    'X-App-Session-Id': session.sessionId, 'Content-Type': 'application/json' };
  async function request(path, body) {
    const response = await fetch(`http://localhost/api${path}`, { headers,
      ...(body ? { method: 'POST', body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(10000) });
    assert.equal(response.status, 200, `${session.actor}: ${path.split('?')[0]} returned ${response.status}`);
    return response.json();
  }
  const actor = { actor: session.actor, checks: [] };
  for (const bucket of ['explore', 'hosting', 'participation']) {
    for (const sort of ['distance', 'updated']) {
      for (const category of bucket === 'explore' ? ['', 'friends', 'work', 'sport', 'learning', 'hobbies', 'neighbourhood'] : ['']) {
        const rows = []; let cursor = null; let total; let pages = 0;
        do {
          assert.ok(++pages <= 100, 'Pagination did not terminate');
          const query = new URLSearchParams({ userId: session.userId, bucket, sort, category, pageSize: '1', ...(cursor ? { cursor } : {}) });
          const page = await request(`/groups?${query}`);
          total = page.total; rows.push(...page.items); cursor = page.nextCursor;
        } while (cursor);
        assert.equal(rows.length, total, 'Missing page rows');
        assert.equal(new Set(rows.map(row => row.id)).size, total, 'Duplicate page rows');
        if (bucket === 'explore') assert.ok(rows.every(row => row.visibility !== 'invitation'), 'Invite-only discovery leak');
        const expected = [...rows].sort((a, b) => (sort === 'distance'
          ? (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)
          : b.updatedAtIso.localeCompare(a.updatedAtIso)) || a.id.localeCompare(b.id));
        assert.deepEqual(rows.map(row => row.id), expected.map(row => row.id), 'Wrong persisted page order');
        const sync = await request('/groups/sync', { userId: session.userId, bucket, category, sort, limit: 50,
          knownItems: bucket === 'explore' ? [{ id: 'seed-community-book-circle', revision: 'stale-control' }] : [], tailId: null });
        assert.deepEqual(sync.upserts.map(row => row.id), rows.map(row => row.id), 'Page/sync order mismatch');
        if (bucket === 'explore') assert.ok(sync.removedIds.includes('seed-community-book-circle'), 'Stale invite-only card not removed');
        actor.checks.push({ bucket, sort, category: category || 'all', total, pages, ids: rows.map(row => row.id) });
      }
    }
  }
  if (session.userId === 'af0436815ab38f4864dd1e24') {
    const denied = await fetch(`http://localhost/api/groups/seed-community-book-circle?userId=${session.userId}`, { headers, signal: AbortSignal.timeout(10000) });
    assert.equal(denied.status, 404, 'Unrelated actor obtained invite-only details');
    actor.inviteOnlyDetailStatus = denied.status;
  }
  evidence.actors.push(actor);
  console.log(`${session.actor}: ${actor.checks.length} list/sync combinations passed.`);
}
if (process.argv[2]) await writeFile(process.argv[2], `${JSON.stringify(evidence, null, 2)}\n`);
