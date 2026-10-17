#!/usr/bin/env python3
"""Run the existing catalog oracle on one already-running Mongo container.

Read large pinned JSON inputs as data, without embedding them in JavaScript ASTs.
Never start an application, database, VM or build owner.
"""
import os
from pathlib import Path
import subprocess
import sys
import uuid
from mongo_test_runtime import run_mongo

ROOT = Path(__file__).resolve().parents[2]
CONTAINER = os.environ.get('MYSCOUTEE_TEST_MONGO_CONTAINER', 'mongodb')
DIRECTORY = '/tmp/qa-release-catalogs-' + uuid.uuid4().hex
HEAP_MIB = 384
if os.environ.get('MYSCOUTEE_TEST_MONGO_TARGET', 'monolith') != 'monolith':
    raise ValueError('This file-backed test requires the selected local Mongo container')

def run(*command):
    return subprocess.run(command, cwd=ROOT, check=True)

run('docker', 'exec', CONTAINER, 'mkdir', '-m', '700', DIRECTORY)
try:
    copies = [
        ('packaging/migrations/seeds/016-release-catalog-parity', DIRECTORY + '/016'),
        ('packaging/migrations/seeds/017-release-catalog-refresh/catalog-updates.json', DIRECTORY + '/catalog-updates.json'),
        *[(f'server/docker/conf/mongodb/myscoutee_db/{name}.json', DIRECTORY + '/current-' + name + '.json')
          for name in ('helpCenterRevisions', 'helpCenterGuideFields')]
    ]
    for source, target in copies:
        run('docker', 'cp', source, CONTAINER + ':' + target)
    result = subprocess.run(['node', '--max-old-space-size=' + str(HEAP_MIB),
                             'packaging/tests/release-catalog-parity-test.mjs', '--print-script',
                             '--input-directory=' + DIRECTORY, *(['--refresh-only'] if '--refresh-only' in sys.argv else [])], cwd=ROOT, capture_output=True, text=True, check=True)
    run_mongo(result.stdout, node_heap_mib=HEAP_MIB)
finally:
    run('docker', 'exec', CONTAINER, 'rm', '-rf', '--', DIRECTORY)
