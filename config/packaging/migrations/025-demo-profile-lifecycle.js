// Match only the two unchanged legacy demo records. Live accounts and an
// operator's later lifecycle changes must not be overwritten by seed parity.
if (db.getName() === 'demo_db' || db.getName() === 'e2e_db') {
    const seeds = EJSON.parse(require('fs').readFileSync(
        process.env.MYSCOUTEE_MIGRATION_SEED_DIRECTORY + '/users.json', 'utf8'));
    if (seeds.length !== 2 || seeds.some(seed =>
        !seed._id || !seed.userId || !seed.name
        || !((seed.status === 'B' && seed.from === 'public' && seed.to === 'blocked')
          || (seed.status === 'D' && seed.from === 'friends only' && seed.to === 'deleted')))) {
        throw new Error('Expected the two pinned demo lifecycle corrections.');
    }
    const result = db.users.bulkWrite(seeds.map(seed => ({ updateOne: {
        filter: { _id: seed._id, userId: seed.userId, name: seed.name,
            workspaceGroupId: null, status: seed.status, profileStatus: seed.from },
        update: { $set: { profileStatus: seed.to } }
    }})), { ordered: true });
    print('Migration025: aligned ' + result.modifiedCount + ' unchanged demo profile states.');
}
