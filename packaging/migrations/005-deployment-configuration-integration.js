// Schema 5 adds the operator-managed Integration API public URL. Preserve every
// existing field and only provide the empty default when the object is absent.
const collection = db.getCollection('deploymentConfigurations');
const configuration = collection.findOne({ _id: 'deployment-configuration' });
if (configuration && Number(configuration.schemaVersion) === 4) {
  if (configuration.version == null || !Number.isSafeInteger(Number(configuration.version)) || Number(configuration.version) < 0) {
    throw new Error('Deployment configuration migration requires a valid document version.');
  }
  const setFields = { schemaVersion: 5 };
  if (configuration.integration === undefined) {
    setFields.integration = { publicBaseUrl: null };
  }
  const result = collection.updateOne(
    { _id: configuration._id, schemaVersion: 4, version: configuration.version },
    { $set: setFields, $inc: { version: 1 } }
  );
  if (result.modifiedCount !== 1) {
    throw new Error('Deployment configuration changed during migration.');
  }
  print('Applied migration005: deploymentConfigurations schema4 -> 5; operator values retained.');
} else if (configuration && !(Number(configuration.schemaVersion) >= 5)) {
  throw new Error('Unsupported deployment configuration schema; refusing automatic conversion.');
} else {
  print('Migration005 already satisfied or fresh deployment awaits its initial seed.');
}
