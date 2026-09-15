#!/usr/bin/env python3
"""Read-only persisted evidence for the delegated rating/bell checkpoint."""
import json
import subprocess
import sys
from pathlib import Path

label = sys.argv[1] if len(sys.argv) > 1 else 'current'
if not label.replace('-', '').isalnum():
    raise SystemExit('Use an alphanumeric evidence label')
script = r'''
const s=db.manualQaCheckpointSnapshots.findOne({scenario:'graph-rating',checkpointId:'BELL-RATING-LIFECYCLE-001'});
if(!s)throw Error('Consolidated rating fixture not staged');
const a=s.context.actorUserId,b=s.context.targetUserId,ids=[a,b];
const pair={$or:[{ownerUserId:a,relatedUserId:b},{ownerUserId:b,relatedUserId:a}],mode:'single'};
const inbox={kind:'user-rated',$or:[{senderUserId:a,recipientUserId:b},{senderUserId:b,recipientUserId:a}]};
const outbox={notificationType:'user-rated',$or:[{'payload.senderUserId':a,recipientUserIds:b},{'payload.senderUserId':b,recipientUserIds:a}]};
const n=v=>typeof v==='object'&&v!==null&&'low'in v ? (v.low>>>0)+(v.high||0)*4294967296 : Number(v||0);
const stats=db.adminStats.findOne({statsKey:'global'})||{},base=s.bellBaseline.stats||{};
const today=new Date().toISOString().slice(0,10);
const counts=x=>Object.fromEntries(Object.entries(x.counters||{}).map(([k,v])=>[k,n(v)]));
const daily=x=>n(x.dailyActivity?.[today]?.ratings);
const currentCounts=counts(stats),baselineCounts=counts(base);
const control=s.bellBaseline.controlEdge;
print(JSON.stringify({at:new Date().toISOString(),stagedAt:s.stagedAtIso,actor:a,target:b,
 rates:db.userRates.find(pair).toArray(),
 inbox:db.userNotifications.find(inbox).toArray(),
 outbox:db.notificationOutbox.find(outbox,{payload:0}).toArray(),
 selfInbox:db.userNotifications.countDocuments({kind:'user-rated',senderUserId:{$in:ids},$expr:{$eq:['$senderUserId','$recipientUserId']},createdDate:{$gt:s.stagedAtIso}}),
 counters:ids.map(userId=>({userId,stored:n(db.users.findOne({userId})?.activities?.notifications),actual:db.userNotifications.countDocuments({recipientUserId:userId,readAtIso:null})})),
 stats:{today,ratingsBefore:daily(base),ratingsNow:daily(stats),baselineCounts,currentCounts,delta:Object.fromEntries(Object.entries(currentCounts).map(([k,v])=>[k,v-(baselineCounts[k]||0)])),generatedAtIso:stats.generatedAtIso},
 edge:db.userAffinityEdges.findOne({pairKey:s.context.pairKey}),
 tasks:db.affinityRecomputeTasks.find({targetId:{$in:ids}}).toArray(),
 controlUnchanged:!!control&&JSON.stringify(control)===JSON.stringify(db.userAffinityEdges.findOne({_id:control._id})),
 oldLayoutsUnchanged:(s.bellBaseline.timelines||[]).every(row=>JSON.stringify(row)===JSON.stringify(db.adminAffinityGraphLayouts.findOne({_id:row._id})))
}));
'''
raw = subprocess.check_output(['docker', 'exec', 'mongodb', 'sh', '-c',
    'exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"',
    'bell-rating-oracle', script], text=True)
state = json.loads(raw)
folder = Path('/tmp/myscoutee-qa-browser-sessions/evidence/bell-rating-cdp')
folder.mkdir(parents=True, exist_ok=True)
p = folder / (label + '-oracle.json')
p.write_text(json.dumps(state, indent=2)); p.chmod(0o600)
summary = {**state, 'rates': [{k:r.get(k) for k in ['_id','ownerUserId','relatedUserId','scoreGiven','scoreReceived','mutuallyRated','met']} for r in state['rates']],
 'inbox':[{k:r.get(k) for k in ['_id','title','body','senderUserId','recipientUserId','readAtIso','sourceId']} for r in state['inbox']],
 'outbox':[{k:r.get(k) for k in ['_id','status','entityId','recipientUserIds','firebaseDeliveryRequested','pendingCounterTracked']} for r in state['outbox']]}
print(json.dumps(summary, indent=2))
print('Evidence:', p)
assert all(c['stored']==c['actual'] for c in state['counters']), 'Unread projection mismatch'
assert state['selfInbox']==0, 'Unexpected self notification'
if label == 'score-four-not-saved':
    assert len(state['rates'])==1 and state['rates'][0]['scoreGiven']==0
    assert not state['inbox'] and not state['outbox'], 'Selection unexpectedly persisted'
    print('Selection without Save: PASS')
