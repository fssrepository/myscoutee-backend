// Reuse the immutable catalog-refresh policy for the four-language release.
// The ordered runner verifies migration017 before reaching this step; its
// input here is this migration's separately checksummed, pinned JSON snapshot.
const fs = require('fs');
const directory = process.env.MYSCOUTEE_MIGRATION_SEED_DIRECTORY;
const updates = EJSON.parse(fs.readFileSync(directory + '/catalog-updates.json', 'utf8'));
const identities = {
    ideaPosts: ['contentKey', 'lang'],
    emailTemplates: ['baseGroupId', 'templateKey'],
    notificationTemplates: ['baseGroupId', 'templateKey']
};
if (!Array.isArray(updates.addedCatalogs) || updates.addedCatalogs.some(entry =>
    !identities[entry.collection]
    || JSON.stringify(entry.identityFields) !== JSON.stringify(identities[entry.collection])
    || !Array.isArray(entry.rows) || entry.rows.some(row => row._id == null
        || entry.identityFields.some(key => key !== 'baseGroupId' && !row[key])))) {
    throw new Error('Invalid four-language catalog additions');
}
// Use the runner's block/load convention so mongosh also awaits database calls.
// Only package-owned source is read; the runner owns the migration lock.
const refresh = fs.readFileSync(process.env.MYSCOUTEE_MIGRATION_DIRECTORY
    + '/017-release-catalog-refresh.js', 'utf8');
const executionFile = process.env.MYSCOUTEE_MIGRATION_DIRECTORY + '/.running-content-refresh.js';
fs.writeFileSync(executionFile, '{\n' + refresh + '\n}', {mode: 0o600});
try { load(executionFile); }
finally { fs.unlinkSync(executionFile); }

// Editable localized templates/articles are inserted only when neither their
// stored ID nor their existing semantic identity is owned by an operator.
for (const {collection, identityFields, rows} of updates.addedCatalogs) {
    const operations = rows.map(row => ({updateOne: {
        filter: {$or: [{_id: row._id}, Object.fromEntries(identityFields.map(key => [key, row[key] ?? null]))]},
        update: {$setOnInsert: row}, upsert: true
    }}));
    if (operations.length) db.getCollection(collection).bulkWrite(operations, {ordered: true});
}
print('Migration020: four-language help, guides, articles and templates applied; operator choices retained.');
