#!/usr/bin/env python3
"""Test the shared seed migration in an isolated collection of the existing QA DB."""
import json
from pathlib import Path
from mongo_test_runtime import run_mongo

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
source = (root / 'server/docker/conf/mongodb/mongo-seed-policy.inc').read_text()
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
run_mongo(script, demo=True)

# Exercise the actual insert-only default import against an isolated collection.
rate_seeds = [json.loads((root / f'server/docker/conf/mongodb/{mode}/exchangeRates.json').read_text())
              for mode in ('demo_db', 'e2e_db', 'myscoutee_db')]
assert rate_seeds[0] == rate_seeds[1] == rate_seeds[2]
for config in ('packaging/templates/myscoutee.env', 'server/.env'):
    allow_line = next(line for line in (root / config).read_text().splitlines()
                      if line.startswith('MONGO_IMPORT_ALLOWED_COLLECTIONS_BY_DB='))
    production_rule = next(rule for rule in allow_line.split('=', 1)[1].split(';')
                           if rule.startswith('production_db:'))
    assert 'exchangeRates' in production_rule.split(':', 1)[1].split(',')
postinst = (root / 'packaging/debian/postinst').read_text()
assert 'deploymentConfigurations,exchangeRates' in postinst
importer = (root / 'server/docker/conf/mongodb/mongo-seed-policy.inc').read_text()
source = importer.split('import_exchange_rate_seed() {', 1)[1].split("--eval '\n", 1)[1].split("\n' >/dev/null", 1)[0]
source = source.replace('const seeds = EJSON.parse(require("fs").readFileSync(process.env.MONGO_EXCHANGE_SEED_PATH, "utf8"));', 'const seeds = seedValue;')
source = source.replace('db.getCollection("exchangeRates")', 'collection')
script = r'''const collection = db.getCollection('qaExchangeDefaults_' + new ObjectId().toHexString());
function check(ok, message) { if (!ok) throw new Error(message); }
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(
    Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  return value;
}
function migrate(seedValue) { SOURCE }
try {
  const seeds = SEEDS;
  migrate(seeds);
  check(collection.countDocuments({}) === seeds.length, 'fresh defaults absent');
  for (const seed of seeds) {
    const actual = collection.findOne({_id:seed._id});
    check(actual && EJSON.stringify(canonical(actual)) === EJSON.stringify(canonical(seed)), 'wrong default basis: ' + seed._id);
  }
  const original = EJSON.stringify(collection.find().sort({_id:1}).toArray());
  migrate(seeds);
  check(EJSON.stringify(collection.find().sort({_id:1}).toArray()) === original, 'not idempotent');
  collection.insertOne({_id:'2026-09-24', source:'daily', rates:{EUR:'1',HUF:'401'}});
  const existing = EJSON.stringify(collection.find().sort({_id:1}).toArray());
  const edited = JSON.parse(JSON.stringify(seeds));
  for (const seed of edited) seed.rates.HUF = '999';
  migrate(edited);
  check(EJSON.stringify(collection.find().sort({_id:1}).toArray()) === existing, 'import rewrote immutable basis/daily rates');
  print('PASS default FX seed: all three seeds identical; production install/upgrade allow-list; fresh import; repeated import; immutable default and daily rows retained.');
} finally { collection.drop(); }
'''.replace('SOURCE', source).replace('SEEDS', json.dumps(rate_seeds[0]))
run_mongo(script, demo=True)
