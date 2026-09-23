#!/usr/bin/env python3
"""Test the shared seed migration in an isolated collection of the existing QA DB."""
import json
from pathlib import Path
import subprocess

root = Path(__file__).resolve().parents[2]
seeds = {name: json.loads((root / f'server/docker/conf/mongodb/{name}/deploymentConfigurations.json').read_text())[0]
         for name in ('demo_db', 'e2e_db', 'myscoutee_db')}
demo_url = 'http://payment-simulator:18082/exchange-rates/eurofxref.xml'
real_url = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml'
assert seeds['demo_db']['payment']['exchangeRateUrl'] == seeds['e2e_db']['payment']['exchangeRateUrl'] == demo_url
assert seeds['myscoutee_db']['payment']['exchangeRateUrl'] == real_url
for name in ('server/docker-compose-dev.yml', 'server/docker-compose-prod.yml', 'packaging/compose/docker-compose.production.yml'):
    content = (root / name).read_text()
    assert 'PAYMENT_SIMULATOR_BASE_URL: "http://payment-simulator:18082"' in content, name
    assert '  exchange-rate-simulator:' not in content, name
source = (root / 'server/docker/conf/mongodb/mongo_import.sh').read_text()
source = source.split('migrate_deployment_exchange_rate_source() {', 1)[1].split("--eval '\n", 1)[1].split("\n' >/dev/null", 1)[0]
source = source.replace('const seed = EJSON.parse(require("fs").readFileSync(process.env.MONGO_EXCHANGE_SEED_PATH, "utf8"))[0];', 'const seed = seedValue;')
source = source.replace('db.getCollection("deploymentConfigurations")', 'collection')
script = r'''const collection = db.getCollection('qaExchangeSourceMigration_' + new ObjectId().toHexString());
function check(ok, message) { if (!ok) throw new Error(message); }
function migrate(seedValue) { SOURCE }
function seed(payment) { collection.deleteMany({}); collection.insertOne({_id:'deployment-configuration', version:7,
  payment, branding:{productName:'Retain'}, custom:'retain'}); }
try {
  const real = {payment:{exchangeRateUrl:REAL_URL}}, demo = {payment:{exchangeRateUrl:DEMO_URL}};
  seed({providerId:'custom-provider',credentialEnvelope:{ciphertext:'retained'}});
  migrate(real);
  let row = collection.findOne();
  check(row.payment.exchangeRateUrl === REAL_URL && row.version === 8, 'real missing default');
  check(row.payment.credentialEnvelope.ciphertext === 'retained' && row.branding.productName === 'Retain', 'unrelated fields changed');
  const once = EJSON.stringify(row); migrate(real);
  check(EJSON.stringify(collection.findOne()) === once, 'not idempotent');
  for (const url of ['', 'https://operator.example/rates']) {
    seed({exchangeRateUrl:url}); const before = EJSON.stringify(collection.findOne());
    migrate(real); migrate(demo);
    check(EJSON.stringify(collection.findOne()) === before, 'explicit operator source overwritten');
  }
  seed({exchangeRateUrl:'http://exchange-rate-simulator:18083/eurofxref.xml'});
  migrate(demo); check(collection.findOne().payment.exchangeRateUrl === DEMO_URL, 'retired demo default not migrated');
  const demoOnce = EJSON.stringify(collection.findOne()); migrate(demo);
  check(EJSON.stringify(collection.findOne()) === demoOnce, 'demo migration not idempotent');
  seed({}); migrate(demo); check(collection.findOne().payment.exchangeRateUrl === DEMO_URL, 'missing demo default');
  collection.deleteMany({}); migrate(real); check(collection.countDocuments({}) === 0, 'migration manufactured singleton');
  print('PASS exchange-rate configuration: shared Compose source; real/demo defaults; additive migration; custom/disabled values retained; idempotent.');
} finally { collection.drop(); }
'''.replace('SOURCE', source).replace('REAL_URL', json.dumps(real_url)).replace('DEMO_URL', json.dumps(demo_url))
subprocess.run(['docker','exec','-i','mongodb','sh','-c',
 'exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --file /dev/stdin'],
 input=script, text=True, check=True)
