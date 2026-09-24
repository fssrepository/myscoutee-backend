// Runs after schema migrations on every release, even when the chain was a no-op.
const fs = require('fs');
const directory = process.env.MYSCOUTEE_MIGRATION_SEED_DIRECTORY || '/docker-entrypoint-initdb.d/myscoutee_db';
const configuration = db.deploymentConfigurations.findOne({_id:'deployment-configuration'});
if (configuration && Number(configuration.schemaVersion) !== 5) throw new Error('Migrate the configuration before loading seeds.');
for (const name of ['exchangeRates', 'notificationRuleConfigs', 'countryPartitions', 'i18n_messages', 'i18n_bundles']) {
    const rows = EJSON.parse(fs.readFileSync(directory + '/' + name + '.json', 'utf8'));
    if (!Array.isArray(rows) || rows.some(row => row._id == null)) throw new Error('Invalid system seed: ' + name);
    const packageOwned = ['countryPartitions', 'i18n_messages', 'i18n_bundles'].includes(name);
    if (rows.length) db.getCollection(name).bulkWrite(rows.map(row => packageOwned
        ? {replaceOne: {filter: {_id: row._id}, replacement: row, upsert: true}}
        : {updateOne: {filter: {_id: row._id}, update: {$setOnInsert: row}, upsert: true}}), {ordered: true});
    print('Synchronized release seed: ' + name + ' (' + rows.length + ')');
}
