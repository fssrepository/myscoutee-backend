// Refresh package-owned rating guide fields. Revisions, custom field IDs and
// user preferences remain untouched; i18n uses the shared release seed sync.
const fs = require('fs');
const directory = process.env.MYSCOUTEE_MIGRATION_SEED_DIRECTORY
    || '/docker-entrypoint-initdb.d/myscoutee_db';
const screens = ['home.game', 'activities.rates'];
const fields = EJSON.parse(fs.readFileSync(directory + '/helpCenterGuideFields.json', 'utf8'))
    .filter(row => screens.includes(row.screenKey));
if (fields.some(row => !row._id || !row.id || !Number.isInteger(row.order))
        || screens.some(screen => !fields.some(row => row.screenKey === screen && row.id === 'rating-details'))) {
    throw new Error('Invalid granular-rating guide seeds.');
}
db.helpCenterGuideFields.bulkWrite(fields.map(row => ({replaceOne: {
    filter: {_id: row._id}, replacement: row, upsert: true
}})), {ordered: true});
print('Migration011: refreshed ' + fields.length + ' rating guide fields; user data and revisions unchanged.');
