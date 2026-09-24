// Schema 4 is the version declaration introduced with the current configuration
// contract. The persisted schema-3 fields already have the same representation.
// Preserve all operator-managed values; never replace this document with a seed.
const collection = db.getCollection('deploymentConfigurations');
const configuration = collection.findOne({ _id: 'deployment-configuration' });
if (configuration && Number(configuration.schemaVersion) === 3) {
  if (configuration.version == null || !Number.isSafeInteger(Number(configuration.version)) || Number(configuration.version) < 0) {
    throw new Error('Deployment configuration migration requires a valid document version.');
  }
  const result = collection.updateOne(
    { _id: configuration._id, schemaVersion: 3, version: configuration.version },
    { $set: { schemaVersion: 4 }, $inc: { version: 1 } }
  );
  if (result.modifiedCount !== 1) {
    throw new Error('Deployment configuration changed during migration.');
  }
  print('Applied migration004: deploymentConfigurations schema3 -> 4; operator values retained.');
} else if (configuration && !(Number(configuration.schemaVersion) >= 4)) {
  throw new Error('Unsupported deployment configuration schema; refusing automatic conversion.');
} else {
  print('Migration004 already satisfied or fresh deployment awaits its initial seed.');
}
