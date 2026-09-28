// Materialize the canonical demo-only profile data. Real accounts are never targets.
if (db.getName() === 'demo_db') {
    const seeds = EJSON.parse(require('fs').readFileSync(
        '/docker-entrypoint-initdb.d/demo_db/users.json', 'utf8'));
    const profiles = seeds.filter(row => Array.isArray(row.profileDetails) && row.profileDetails.length > 0
        && !row.accountUserId && !row.workspaceGroupId && !row.operator);
    if (profiles.length !== 50) throw new Error('Expected 50 canonical demo profile-detail seeds.');
    let updated = 0;
    for (const seed of profiles) {
        const result = db.users.updateOne({
            _id: seed._id, userId: seed.userId, name: seed.name,
            accountUserId: {$exists: false}, workspaceGroupId: {$exists: false},
            profileDetails: {$exists: false}
        }, {$set: {profileDetails: seed.profileDetails}});
        updated += result.modifiedCount;
    }
    print('Migration009: initialized ' + updated + ' missing canonical demo profile details.');
}
