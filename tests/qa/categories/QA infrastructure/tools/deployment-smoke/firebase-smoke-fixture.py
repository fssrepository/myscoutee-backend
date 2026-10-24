#!/usr/bin/env python3
"""QA guest-only active Firebase prerequisite for USER-operated registration smoke.

Credentials must first be saved/encrypted through the authenticated Operator API.
This fixture stages the readiness revisions required by the existing runtime;
those seeded revisions are NOT evidence of browser Message Test execution.
It never ships in production seeds and does not change application activation rules.
"""
import argparse
import json
import os
import subprocess
from pathlib import Path

STATE = Path('/var/lib/myscoutee/qa-fixtures/firebase-smoke')
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('action', choices=['stage', 'status', 'reset'])
a = parser.parse_args()
os.umask(0o077)
if os.geteuid() != 0 or STATE.is_symlink():
    parser.error('Run as root on the QA guest with a regular fixture directory')
version = subprocess.check_output(['dpkg-query', '-W', '-f=${Version}', 'myscoutee'], text=True)
if '~qa.' not in version:
    parser.error('Fixture forbidden outside a QA package installation')

def mongo(js):
    return subprocess.check_output([
        'docker', 'exec', '-i', 'mongodb', 'sh', '-c',
        'test "$MONGO_APP_DATABASE" = production_db && exec mongosh --quiet '
        '--username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" '
        '--authenticationDatabase admin production_db --file /dev/stdin'
    ], input=js, text=True)

read = 'const c=db.deploymentConfigurations.findOne({_id:"deployment-configuration"});if(!c)throw Error("Configuration missing");'
if a.action == 'stage':
    before = mongo(read + 'print(EJSON.stringify(c,{relaxed:false}));').strip()
    if STATE.exists():
        if (STATE/'staged.ejson').exists() or (STATE/'before.ejson').read_text().strip() != before:
            parser.error('Existing fixture or changed configuration; refusing to replace its snapshot')
    else:
        STATE.mkdir(parents=True, mode=0o700)
        (STATE/'before.ejson').write_text(before+'\n')
    # Record provenance BEFORE the mutation. No credential values leave this file.
    (STATE/'manifest.json').write_text(json.dumps({
        'packageVersion': version, 'purpose': 'Firebase activation is a smoke prerequisite',
        'messagingVerdict': 'NOT RUN: readiness is fixture state, not test evidence',
    }, indent=2)+'\n')
    result = mongo(read + '''
const f=c.firebase; const p=f?.publicClient;
if(!f?.projectId||!f.authenticationCredentialEnvelope||!f.messagingCredentialEnvelope
 ||!p?.apiKey||!p.authDomain||!p.messagingSenderId||!p.appId||!p.vapidKey)
 throw Error('Save complete encrypted Firebase configuration through Operator API first');
if(f.authenticationTestedRevision==null||Number(f.authenticationTestedRevision)!==Number(f.revision))throw Error('Run the real Auth Test first');
const result=db.deploymentConfigurations.updateOne({_id:c._id,version:c.version},
 {$set:{'firebase.active':true,'firebase.activatedAt':new Date().toISOString(),
        'firebase.messagingTestedRevision':f.revision},$inc:{version:1}});
if(result.modifiedCount!==1)throw Error('Configuration changed concurrently');
print(JSON.stringify({fixtureActive:true,messagingTest:'NOT RUN (fixture prerequisite)'}));
''')
    (STATE/'staged.ejson').write_text(mongo(read+'print(EJSON.stringify(c,{relaxed:false}));').strip()+'\n')
    print(result.strip())
elif a.action == 'reset':
    before = (STATE/'before.ejson').read_text().strip()
    staged = (STATE/'staged.ejson').read_text().strip()
    print(mongo(read + 'const before=EJSON.parse('+json.dumps(before)+');const staged=EJSON.parse('+json.dumps(staged)+');'+'''
if(EJSON.stringify(c.firebase)!==EJSON.stringify(staged.firebase))throw Error('Firebase changed since fixture; refusing overwrite');
const r=db.deploymentConfigurations.updateOne({_id:c._id,version:c.version},{$set:{firebase:before.firebase},$inc:{version:1}});
if(r.modifiedCount!==1)throw Error('Concurrent configuration change');
print('Firebase prerequisite reset; other configuration retained.');
''').strip())
else:
    print(mongo(read+'''print(JSON.stringify({active:c.firebase?.active===true,
 credentialsConfigured:!!c.firebase?.authenticationCredentialEnvelope&&!!c.firebase?.messagingCredentialEnvelope,
 messagingTest:'NOT RUN by fixture'}));''').strip())
