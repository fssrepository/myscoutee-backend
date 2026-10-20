// Restore sample-profile locations in the demo database only. Keep activity,
// lifecycle, custom profiles and every real-account document unchanged.
if (db.getName() === 'demo_db' || db.getName() === 'e2e_db') {
    const seeds = EJSON.parse(require('fs').readFileSync(
        process.env.MYSCOUTEE_MIGRATION_SEED_DIRECTORY + '/users.json', 'utf8'));
    if (seeds.length !== 125 || new Set(seeds.map(row => row.userId)).size !== seeds.length
            || seeds.some(row => !row.locationCoordinates || typeof row.partitionKey !== 'string' || !/^country:[a-z]{2}$/.test(row.partitionKey))) {
        throw new Error('Expected the complete canonical demo location projection.');
    }
    const result = db.users.bulkWrite(seeds.map(seed => ({updateOne: {
        filter: {_id: seed._id, userId: seed.userId, name: seed.name},
        update: {$set: {city: seed.city, locationCoordinates: seed.locationCoordinates,
            partitionKey: seed.partitionKey}}
    }})), {ordered: true});
    print('Migration022: restored ' + result.modifiedCount + ' canonical demo locations.');
}
