// Add only missing release-owned defaults. Never replace operator configuration,
// job overrides, historical observations or user-authored content.
const seedDirectory = process.env.MYSCOUTEE_MIGRATION_SEED_DIRECTORY
    || '/docker-entrypoint-initdb.d/myscoutee_db';
const readSeed = name => EJSON.parse(require('fs').readFileSync(seedDirectory + '/' + name + '.json', 'utf8'));
const configurationSeed = readSeed('deploymentConfigurations')
    .find(row => row._id === 'deployment-configuration');
const rateUrl = configurationSeed?.payment?.exchangeRateUrl;
if (typeof rateUrl !== 'string' || !rateUrl) throw new Error('Missing packaged exchange-rate source.');
const configuration = db.deploymentConfigurations.findOne({_id: 'deployment-configuration'});
if (configuration) {
    if (Number(configuration.schemaVersion) !== 5 || !configuration.payment
            || !Number.isSafeInteger(Number(configuration.version))) {
        throw new Error('Migration006 requires the complete schema5 configuration.');
    }
    if (!Object.prototype.hasOwnProperty.call(configuration.payment, 'exchangeRateUrl')) {
        const result = db.deploymentConfigurations.updateOne(
            {_id: configuration._id, version: configuration.version, 'payment.exchangeRateUrl': {$exists: false}},
            {$set: {'payment.exchangeRateUrl': rateUrl}, $inc: {version: 1}});
        if (result.modifiedCount !== 1) throw new Error('Configuration changed during migration006.');
    }
}
print('Migration006: missing FX source default added; existing configuration retained.');
