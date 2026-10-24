import assert from 'node:assert/strict';
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const engines = fileURLToPath(new URL('../../../config/packaging/seeds/scripts/', import.meta.url));
const project = fileURLToPath(new URL('../../../', import.meta.url));

async function write(root, name, data) {
  const target = path.join(root, name);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, JSON.stringify(data));
}

async function read(root, name) {
  return JSON.parse(await readFile(path.join(root, name), 'utf8'));
}

function run(root, name, ...args) {
  return spawnSync(process.execPath, [path.join(engines, name + '.mjs'), ...args], {
    encoding: 'utf8', env: { ...process.env, MYSCOUTEE_PACKAGING_PROJECT_ROOT: root },
  });
}

test('counter reconciliation uses configured ownership and namespaces without changing unrelated counters', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'seed-counters-'));
  try {
    await write(root, 'config/packaging/seeds/data/group-counters.json', {
      seedRoot: 'fixtures', databases: ['selected'], buckets: ['hosting', 'participation', 'pending', 'invitations', 'trash'],
      counterPrefix: 'selected_', versionPrefix: 'selected-member-', ownerType: 'selected-owner', revision: 1,
    });
    await write(root, 'fixtures/selected/users.json', [{ userId: 'user', menuCounters: { unrelated: 7 } }]);
    await write(root, 'fixtures/selected/activityMembers.json', [
      { _id: 'one', userId: 'user', ownerType: 'selected-owner', status: 'accepted', role: 'Admin' },
      { _id: 'two', userId: 'user', ownerType: 'selected-owner', status: 'pending', requestKind: 'invite' },
      { _id: 'other', ownerType: 'other-owner', status: 'accepted' },
    ]);
    const before = await readFile(path.join(root, 'fixtures/selected/users.json'), 'utf8');
    assert.equal(run(root, 'reconcile-group-menu-counters').status, 0);
    assert.equal(await readFile(path.join(root, 'fixtures/selected/users.json'), 'utf8'), before);
    const result = run(root, 'reconcile-group-menu-counters', '--write');
    assert.equal(result.status, 0, result.stderr);
    const [user] = await read(root, 'fixtures/selected/users.json');
    assert.deepEqual(user.menuCounters, { unrelated: 7, selected_hosting: 1, selected_participation: 0, selected_pending: 0, selected_invitations: 1, selected_trash: 0 });
    assert.equal(Object.keys(user.menuCounterVersions).length, 2);
    assert.ok(Object.keys(user.menuCounterVersions).every(key => key.startsWith('selected-member-')));
    const members = await read(root, 'fixtures/selected/activityMembers.json');
    assert.equal(members[0].groupCounterState.bucket, 'hosting');
    assert.equal(members[1].groupCounterState.bucket, 'invitations');
    assert.equal(members[2].groupCounterState, undefined);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('image synchronization preserves events outside its pool, memberships and counters', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'seed-image-preservation-'));
  try {
    const configuration = await read(project, 'config/packaging/seeds/data/image-pools.json');
    const database = configuration.paths.database;
    for (const directory of [database, 'config/packaging/seeds/data']) {
      await cp(path.join(project, directory), path.join(root, directory), { recursive: true });
    }
    for (const file of [configuration.paths.frontendHelper, configuration.paths.frontendDefinitions]) {
      await mkdir(path.dirname(path.join(root, file)), { recursive: true });
      await cp(path.join(project, file), path.join(root, file));
    }
    const events = await read(root, database + '/events.json');
    const extraEvent = { _id: 'outside-image-pool', title: 'Independent fixture', imageUrl: 'retained.webp' };
    await write(root, database + '/events.json', [...events, extraEvent]);
    const assets = await read(root, database + '/assets.json');
    const extraAsset = { assetId: 'outside-image-pool', title: 'Independent asset', imageUrl: 'retained.webp' };
    await write(root, database + '/assets.json', [...assets, extraAsset]);
    const members = await read(root, database + '/activityMembers.json');
    const users = await read(root, database + '/users.json');
    const extraEvents = [...events, extraEvent].filter(event =>
      !configuration.canonicalEventIdBySlot.includes(typeof event._id === 'object' ? event._id.$oid : event._id));
    assert.ok(extraEvents.length > 1, 'fixture includes the existing non-pool events');
    assert.ok(members.some(member => member.ownerType === 'community'));
    const result = run(root, 'synchronize-demo-image-pools', '--write');
    assert.equal(result.status, 0, result.stderr);
    const actualEvents = await read(root, database + '/events.json');
    for (const event of extraEvents) {
      assert.ok(actualEvents.some(actual => JSON.stringify(actual) === JSON.stringify(event)));
    }
    assert.deepEqual((await read(root, database + '/assets.json')).at(-1), extraAsset);
    assert.deepEqual(await read(root, database + '/activityMembers.json'), members);
    assert.deepEqual(await read(root, database + '/users.json'), users);
    assert.equal(run(root, 'synchronize-demo-image-pools', '--check').status, 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});
