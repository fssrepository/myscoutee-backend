#!/usr/bin/env python3
"""Exercise the real help migration in a disposable DB on an existing QA Mongo."""
import json
import subprocess
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = (root / 'migrations/008-default-help-v3.js').read_text()
seeds = json.loads((root.parent / 'server/docker/conf/mongodb/myscoutee_db/helpCenterRevisions.json').read_text())
script = 'const packagedHelpSeeds=' + json.dumps(seeds) + ';\n' + r'''
const testDb = db.getSiblingDB('qa_help_upgrade_' + new ObjectId().toHexString());
function check(value, message) { if (!value) throw Error(message); }
function migrate(db) {
    const require = () => ({readFileSync: () => JSON.stringify(packagedHelpSeeds)});
    SOURCE
}
const old = packagedHelpSeeds.filter(row => row.documentType === 'help' && row.version === 1)
    .map(row => ({...row, active: true}));
const latest = packagedHelpSeeds.filter(row => row.documentType === 'help' && row.version === 3);
function baseline() {
    testDb.helpCenterRevisions.deleteMany({});
    testDb.helpCenterRevisions.insertMany(old);
    testDb.helpCenterRevisions.insertOne({_id: 'private-policy', documentType: 'privacy', active: true, text: 'retain'});
}
try {
    testDb.helpCenterRevisions.createIndex({documentType: 1, lang: 1, contextKey: 1, version: -1}, {unique: true});
    testDb.users.insertOne({_id: 'retained-user', name: 'retain'});
    baseline(); migrate(testDb);
    check(testDb.helpCenterRevisions.countDocuments({documentType: 'help', version: 3, active: true}) === 2, 'HU/EN v3 not activated');
    check(testDb.helpCenterRevisions.countDocuments({documentType: 'help', version: 1, active: true}) === 0, 'old defaults still active');
    const before = EJSON.stringify(testDb.helpCenterRevisions.find().sort({_id: 1}).toArray());
    migrate(testDb);
    check(EJSON.stringify(testDb.helpCenterRevisions.find().sort({_id: 1}).toArray()) === before, 'repeat changed help');

    baseline(); testDb.helpCenterRevisions.updateOne({_id: old[0]._id}, {$set: {title: 'Operator custom help'}});
    migrate(testDb);
    check(testDb.helpCenterRevisions.findOne({_id: old[0]._id}).active === true, 'custom help deactivated');
    check(testDb.helpCenterRevisions.findOne({_id: latest.find(row => row.lang === old[0].lang)._id}).active === false, 'custom selection replaced');

    baseline(); testDb.helpCenterRevisions.updateMany({documentType: 'help'}, {$set: {active: false}});
    migrate(testDb);
    check(testDb.helpCenterRevisions.countDocuments({documentType: 'help', active: true}) === 0, 'deliberately disabled help reactivated');

    baseline(); const custom = {...latest[0], _id: 'operator-v3', title: 'Retained v3'};
    testDb.helpCenterRevisions.insertOne(custom); migrate(testDb);
    check(testDb.helpCenterRevisions.findOne({_id: custom._id}).title === custom.title, 'version collision replaced operator content');
    check(!testDb.helpCenterRevisions.findOne({_id: latest[0]._id}), 'colliding package version inserted');

    baseline(); testDb.helpCenterRevisions.insertMany(latest); migrate(testDb);
    check(testDb.helpCenterRevisions.countDocuments({documentType: 'help', version: 1, active: true}) === 0, 'interrupted migration did not finish');
    testDb.helpCenterRevisions.updateOne({_id: latest[0]._id}, {$set: {active: false}}); migrate(testDb);
    check(testDb.helpCenterRevisions.findOne({_id: latest[0]._id}).active === false, 'existing v3 selection overwritten');
    check(testDb.helpCenterRevisions.findOne({_id: 'private-policy'}).text === 'retain', 'privacy changed');
    check(testDb.users.findOne().name === 'retain', 'user changed');

    testDb.helpCenterRevisions.deleteMany({}); migrate(testDb);
    check(testDb.helpCenterRevisions.countDocuments({version: 3, active: true}) === 2, 'fresh help missing');
    print('PASS help migration: HU/EN upgrade, fresh state, repeat, interrupted retry, custom/disabled help, version conflict, retained privacy/users');
} finally { testDb.dropDatabase(); }
'''.replace('SOURCE', source)
if '--print-script' in sys.argv:
    print(script)
else:
    subprocess.run(['docker', 'exec', '-i', 'mongodb', 'sh', '-c',
        'exec mongosh --quiet --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" '
        '--authenticationDatabase admin production_db --file /dev/stdin'], input=script, text=True, check=True)
