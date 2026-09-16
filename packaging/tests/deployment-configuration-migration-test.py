#!/usr/bin/env python3
"""Exercise packaged migration against an isolated DB in an existing QA Mongo container."""
import json
from pathlib import Path
import subprocess

source = (Path(__file__).resolve().parents[1] / 'migrations/004-deployment-configuration.js').read_text()
script = '''
const testName = 'qa_migration_004_' + new ObjectId().toHexString();
const testDb = db.getSiblingDB(testName);
function check(condition, message) { if (!condition) throw new Error(message); }
try {
  const original = {_id:'deployment-configuration', schemaVersion:3, version:NumberLong('7'),
    branding:{productName:'Custom operator name',logoCharacterIndex:2},
    firebase:{active:true, authenticationCredentialEnvelope:{ciphertext:'opaque-retained'}},
    payment:{credentialEnvelope:{ciphertext:'opaque-payment'}}, customField:'retain me'};
  testDb.deploymentConfigurations.insertOne(original);
  { SOURCE }
  const changed = testDb.deploymentConfigurations.findOne();
  check(Number(changed.schemaVersion) === 4 && Number(changed.version) === 8, 'version not migrated');
  changed.schemaVersion=3; changed.version=NumberLong('7');
  check(EJSON.stringify(changed) === EJSON.stringify(original), 'operator values changed');
  const once=EJSON.stringify(testDb.deploymentConfigurations.findOne());
  { SOURCE }
  check(EJSON.stringify(testDb.deploymentConfigurations.findOne()) === once, 'not idempotent');
  testDb.deploymentConfigurations.updateOne({_id:original._id},{$set:{schemaVersion:2}});
  let rejected=false;
  try { { SOURCE } } catch (error) { rejected=true; }
  check(rejected && Number(testDb.deploymentConfigurations.findOne().schemaVersion) === 2,'unsupported schema mutated');
  testDb.deploymentConfigurations.deleteMany({});
  { SOURCE }
  check(testDb.deploymentConfigurations.countDocuments({})===0,'fresh database seeded by migration');
  print('PASS migration004: retained fields/secrets, optimistic version, repeat execution, unsupported schema, fresh database');
} finally { testDb.dropDatabase(); }
'''.replace('SOURCE', source.replace("db.getCollection(", "testDb.getCollection("))
subprocess.run(['docker','exec','-i','mongodb','sh','-c',
 'exec mongosh --quiet --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin production_db --file /dev/stdin'],input=script,text=True,check=True)
