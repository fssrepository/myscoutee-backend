import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../../', import.meta.url);
const read = name => JSON.parse(fs.readFileSync(new URL(name, root), 'utf8'));
function contains(ring, x, y) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [a, b] = ring[i], [c, d] = ring[j];
    if ((b > y) !== (d > y) && x < (c - a) * (y - b) / (d - b) + a) inside = !inside;
  }
  return inside;
}
const pinned = read('packaging/migrations/seeds/022-demo-profile-locations/users.json');
for (const database of ['demo_db', 'e2e_db']) {
  const users = read(`server/docker/conf/mongodb/${database}/users.json`);
  const partitions = read(`server/docker/conf/mongodb/${database}/countryPartitions.json`);
  assert.equal(users.length, pinned.length);
  for (const user of users) {
    const point = user.locationCoordinates;
    assert.ok(Number.isFinite(point?.latitude) && Number.isFinite(point?.longitude), user.userId);
    const partition = partitions.find(row => row.partitionKey === user.partitionKey);
    assert.ok(partition, user.userId);
    const polygons = partition.geometry.type === 'MultiPolygon'
      ? partition.geometry.coordinates : [partition.geometry.coordinates];
    assert.ok(polygons.some(rings => contains(rings[0], point.longitude, point.latitude)
      && !rings.slice(1).some(hole => contains(hole, point.longitude, point.latitude))), user.userId);
    assert.deepEqual(pinned.find(row => row.userId === user.userId),
      Object.fromEntries(['_id', 'userId', 'name', 'city', 'locationCoordinates', 'partitionKey'].map(key => [key, user[key]])));
  }
}

const migration = fs.readFileSync(new URL('packaging/migrations/022-demo-profile-locations.js', root), 'utf8');
for (const database of ['production_db', 'demo_db', 'e2e_db']) {
  const seed = read('server/docker/conf/mongodb/demo_db/users.json')[0];
  const stored = {...seed, locationCoordinates: null, partitionKey: null,
    activities: {retained: 17}, profileStatus: 'blocked'};
  const custom = {_id: 'custom-demo', userId: 'custom-demo', name: 'Custom', locationCoordinates: null};
  const records = [stored, custom];
  let writes = 0;
  const execute = () => vm.runInNewContext(migration, {
    db: {getName: () => database, users: {bulkWrite(operations) {
      writes++;
      for (const {updateOne: {filter, update}} of operations) {
        const row = records.find(row => JSON.stringify(row._id) === JSON.stringify(filter._id)
          && row.userId === filter.userId && row.name === filter.name);
        if (row) Object.assign(row, structuredClone(update.$set));
      }
      return {modifiedCount: 1};
    }}},
    require: () => ({readFileSync: () => JSON.stringify(pinned)}),
    EJSON: JSON, process: {env: {MYSCOUTEE_MIGRATION_SEED_DIRECTORY: '/pinned'}}, print() {}
  });
  execute();
  if (database === 'production_db') {
    assert.equal(writes, 0);
    assert.equal(stored.locationCoordinates, null);
  } else {
    assert.deepEqual(stored.locationCoordinates, seed.locationCoordinates);
    assert.equal(stored.partitionKey, seed.partitionKey);
    assert.deepEqual(stored.activities, {retained: 17});
    assert.equal(stored.profileStatus, 'blocked');
    assert.equal(custom.locationCoordinates, null);
    const before = JSON.stringify(records);
    execute();
    assert.equal(JSON.stringify(records), before);
  }
}
console.log('PASS: all 125 demo/e2e profiles have supported country geometry; migration022 retains real accounts, activity, lifecycle and custom profiles and is idempotent.');
