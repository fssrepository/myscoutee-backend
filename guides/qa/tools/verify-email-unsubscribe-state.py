#!/usr/bin/env python3
"""Read-only proof for the isolated unsubscribe supplement. Never prints capabilities."""
import json, subprocess
from pathlib import Path
records=[json.loads(line) for line in Path('/tmp/myscoutee-email-qa-unsubscribe.jsonl').read_text().splitlines()]
assert len(records)==2, 'Expected only one provider request per fixture recipient'
for row in records:
 payload=row['payload']; bodies={v['type']:v['value'] for v in payload['content']}
 assert '<img ' in bodies['text/html'] and '/assets/logo/heart.webp' in bodies['text/html']
 assert 'MyScoutee QA' in bodies['text/html'] and 'qa-sender@example.invalid' in bodies['text/html']
 for body in bodies.values():
  assert '/api/public/email/unsubscribe#token=' in body
  assert 'https://myscoutee.com' in body
code="""
const key='OPERATOR-EMAIL-WARNING-001';const state=db.manualQaCheckpointSnapshots.findOne({_id:key});if(!state)throw Error('Fixture missing');
const claims=db.accountDeletionWarnings.find({userId:state.users[0]},{status:1,attemptCount:1,nextAttemptAtIso:1}).toArray();
const hashes=state.recipientHashes.slice(0,2);
print(JSON.stringify({claims,suppressed:db.emailUnsubscriptions.countDocuments({_id:{$in:hashes}}),detachedOwnerAbsent:!db.users.findOne({userId:state.users[1]})}));
"""
result=json.loads(subprocess.check_output(['docker','exec','mongodb','sh','-c','exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"','unsubscribe-proof',code],text=True))
assert len(result['claims'])==2
assert all(c['status']=='unsubscribed' and 'nextAttemptAtIso' not in c for c in result['claims'])
assert sorted(c['attemptCount'] for c in result['claims'])==[1,2]
assert result['suppressed']==2 and result['detachedOwnerAbsent']
print(json.dumps({'result':'PASS','providerRequests':2,'brandedHtmlAndText':True,'retrySuppressed':True,'newEpisodeNormalizedRecipientSuppressed':True,'unsubscribedWithoutAccount':True,'separateDatabaseIsolation':'NOT RUN: dev REAL and DEMO both use demo_db'}))
