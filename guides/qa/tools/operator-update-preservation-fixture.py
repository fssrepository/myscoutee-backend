#!/usr/bin/env python3
"""Retain hashes and QA-owned Mongo/MinIO controls across a VMware update.

This is a preservation oracle, not a database/media backup or proof of the
registration/Event/Asset creation flows. Existing documents are only hashed.
Run as root inside the designated QA guest: stage, verify, then reset.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import uuid

STATE = Path('/var/lib/myscoutee/qa-fixtures/update/preservation.json')
COLLECTION = 'qaOperatorUpdateControls'
COLLECTIONS = ['users', 'events', 'assets', 'deploymentConfigurations', COLLECTION]


def run(*command, data=None):
    return subprocess.check_output(command, input=data)


def mongo(script):
    result = run('docker', 'exec', '-i', 'mongodb', 'sh', '-c',
                 'exec mongosh --quiet --username "$MONGO_INITDB_ROOT_USERNAME" '
                 '--password "$MONGO_INITDB_ROOT_PASSWORD" '
                 '--authenticationDatabase admin "${MONGO_INITDB_DATABASE:?}" --file /dev/stdin',
                 data=script.encode())
    return json.loads(result)


def snapshot():
    return mongo('''
const crypto = require('crypto');
const result = {};
for (const name of %s) {
  const hash = crypto.createHash('sha256');
  let count = 0;
  db.getCollection(name).find().sort({_id: 1}).forEach(doc => {
    hash.update(EJSON.stringify(doc, {relaxed: false}) + '\\n');
    count++;
  });
  result[name] = {count, sha256: hash.digest('hex')};
}
print(JSON.stringify(result));
''' % json.dumps(COLLECTIONS))


def media(action, key, data=None):
    # The existing MinIO seed alias authenticates inside the container.
    return run('docker', 'exec', '-i', 'minio', 'sh', '-c',
               'exec mc "$1" "myscoutee/${MEDIA_BUCKET:-myscoutee-media}/$2"',
               'qa-preservation', action, key, data=data)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['stage', 'verify', 'reset'])
    args = parser.parse_args()
    os.umask(0o077)
    if os.geteuid() != 0 or STATE.is_symlink():
        parser.error('Run as root on the designated QA guest; unsafe state path.')
    version = run('dpkg-query', '-W', '-f=${Version}', 'myscoutee').decode()
    if not re.fullmatch(r'\d+\.\d+\.\d+~qa\.[1-9]\d*', version):
        parser.error('Installed QA prerelease required.')
    if args.action == 'stage':
        if STATE.exists():
            parser.error('Preservation fixture already exists; verify or reset it.')
        if mongo('print(JSON.stringify(db.deploymentConfigurations.countDocuments({})));') != 1:
            parser.error('Expected the actual initialized deployment database; no fixture staged.')
        if mongo(f'print(JSON.stringify(db.getCollectionNames().includes("{COLLECTION}")));'):
            parser.error('Reserved control collection already exists; refusing to replace it.')
        identity = str(uuid.uuid4())
        key = f'qa/operator-update/{identity}/control.svg'
        content = ('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">'
                   '<rect width="64" height="64" fill="#168071"/>'
                   f'<desc>{identity}</desc></svg>').encode()
        record = {'phase': 'preparing', 'id': identity, 'objectKey': key,
                  'objectSha256': hashlib.sha256(content).hexdigest(),
                  'initialVersion': version}
        STATE.parent.mkdir(parents=True, exist_ok=True)
        with STATE.open('x') as output:
            json.dump(record, output, indent=2)
        document = {'_id': identity, 'purpose': 'operator-update-preservation',
                    'objectKey': key, 'nested': {'retained': True}}
        mongo(f'db.{COLLECTION}.insertOne({json.dumps(document)}); print("true");')
        media('pipe', key, content)
        record['collections'] = snapshot()
        record['phase'] = 'staged'
        STATE.write_text(json.dumps(record, indent=2) + '\n')
    else:
        record = json.loads(STATE.read_text())
        identity = str(uuid.UUID(record['id']))
        key = f'qa/operator-update/{identity}/control.svg'
        if record['objectKey'] != key:
            parser.error('Unexpected fixture object path.')
        if args.action == 'verify':
            if record['phase'] != 'staged':
                parser.error('Fixture staging incomplete; no preservation PASS possible.')
            actual = snapshot()
            changed = [name for name in COLLECTIONS if actual[name] != record['collections'][name]]
            media_matches = hashlib.sha256(media('cat', key)).hexdigest() == record['objectSha256']
            print(json.dumps({'version': version, 'collections': actual,
                              'changedCollections': changed, 'mediaMatches': media_matches}))
            if changed or not media_matches:
                raise SystemExit('FAIL: retained data changed; no restore performed.')
        else:
            # Never delete a collection containing anything outside this fixture.
            mongo(f'''if (db.{COLLECTION}.countDocuments({{_id: {{$ne: {json.dumps(identity)}}}}}))
throw Error('Foreign records in reserved fixture collection');
db.{COLLECTION}.deleteOne({{_id: {json.dumps(identity)}}});
db.{COLLECTION}.drop(); print('true');''')
            media('rm', key)
            STATE.unlink()
    print(f'PASS preservation fixture {args.action}; no application data restored')


if __name__ == '__main__':
    main()
