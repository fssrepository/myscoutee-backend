#!/usr/bin/env python3
"""Exercise the current Jobs version's real no-op revert with the managed Ava session."""
import json
from pathlib import Path
import subprocess
import urllib.request

checkpoint = 'ADMIN-MONITORING-001'
manifest = json.loads((Path('/tmp/myscoutee-qa-browser-sessions') / (checkpoint + '.json')).read_text())
assert manifest['checkpointId'] == checkpoint
actor = next(s for s in manifest['sessions'] if s['actor'] == 'Ava')

def mongo(script):
    return json.loads(subprocess.check_output(['docker', 'exec', 'mongodb', 'sh', '-c',
        'exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"',
        'admin-monitoring-noop', script], text=True))

snapshot = '''const s=db.manualQaCheckpointSnapshots.findOne({scenario:'admin-monitoring'});
if(!s)throw Error('Monitoring fixture required');
print(JSON.stringify({
config:db.affinityConfigs.findOne({active:true}),
versions:db.affinityConfigs.countDocuments({}),
tasks:db.affinityRecomputeTasks.find({targetType:'CONFIG'}).sort({_id:1}).toArray(),
outbox:db.notificationOutbox.find({notificationType:'admin-params-changed',createdDate:{$gte:s.stagedAtIso}}).sort({_id:1}).toArray()
}));'''
before = mongo(snapshot)
if any(t['status'] in ['pending', 'running'] for t in before['tasks']):
    raise SystemExit('Wait for real CONFIG work to settle before the no-op oracle')
if any(o['status'] in ['pending', 'running'] for o in before['outbox']):
    raise SystemExit('Wait for parameter outbox delivery before the no-op oracle')
assert before['config']['changedSection'] == 'jobs'
headers = {'X-App-Session-Kind':'demo', 'X-Demo-User-Id':actor['userId'],
           'X-App-Session-Id':actor['sessionId'], 'Content-Type':'application/json'}
body = {'adminUserId':actor['userId'], 'version':before['config']['version']}
with urllib.request.urlopen(urllib.request.Request('http://localhost/api/admin/params/jobs/revert',
        headers=headers, data=json.dumps(body).encode()), timeout=30) as response:
    status = response.status
    response.read()
after = mongo(snapshot)
checks = {key:before[key] == after[key] for key in before}
print(json.dumps({'status':status, 'selectedVersion':body['version'], 'activeVersionAfter':after['config']['version'],
                  'unchanged':checks}, indent=2))
if status != 200 or not all(checks.values()):
    raise SystemExit('No-op revert produced side effects')
