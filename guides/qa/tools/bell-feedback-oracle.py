#!/usr/bin/env python3
"""Read-only evidence for Bell feedback submission and read isolation."""
import json, subprocess, sys
from pathlib import Path
label = sys.argv[1]
if not label.replace('-', '').isalnum(): raise SystemExit('Invalid evidence label')
script = r"""
const f=db.adminJobFixtureSnapshots.findOne({job:'bell-rating-feedback',variation:'feedback'});
if(!f)throw Error('Feedback fixture not prepared');
const c=f.context, ids=[c.actorUserId,...c.targetUserIds];
const byId=rows=>rows.sort((a,b)=>String(a._id).localeCompare(String(b._id)));
const same=(a,b)=>JSON.stringify(byId(a))===JSON.stringify(byId(b));
const rates=f.snapshots.find(s=>s.collection==='userRates');
const wrapper=db.manualQaCheckpointSnapshots.findOne({scenario:'bell-feedback'});
const rateBaseline=wrapper?.ratingBaseline || rates.documents;
const selector={viewerUserId:c.actorUserId,eventId:c.eventId};
print(JSON.stringify({at:new Date().toISOString(),context:c,
 answers:db.eventFeedbackAnswers.find(selector).toArray(),states:db.eventFeedbackStates.find(selector).toArray(),
 ratesUnchanged:same(db.userRates.find(rates.selector).toArray(),rateBaseline),
 ratesBefore:rateBaseline,ratesNow:db.userRates.find(rates.selector).toArray(),
 inbox:db.userNotifications.find({kind:'event-feedback-submitted',sourceId:c.eventId,senderUserId:c.actorUserId}).toArray(),
 outbox:db.notificationOutbox.find({notificationType:'event-feedback-submitted',entityId:c.eventId,'payload.senderUserId':c.actorUserId},{payload:0}).toArray(),
 tasks:db.affinityRecomputeTasks.find({targetId:{$in:ids}},{targetId:1,status:1,pendingCounterTracked:1}).toArray(),
 counters:ids.map(userId=>({userId,stored:Number(db.users.findOne({userId})?.activities?.notifications||0),actual:db.userNotifications.countDocuments({recipientUserId:userId,readAtIso:null})}))
}));
"""
raw=subprocess.check_output(['docker','exec','mongodb','sh','-c','exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"','bell-feedback-oracle',script],text=True)
s=json.loads(raw)
folder=Path('/tmp/myscoutee-qa-browser-sessions/evidence/bell-rating-cdp'); folder.mkdir(parents=True,exist_ok=True)
p=folder/(label+'-oracle.json'); p.write_text(json.dumps(s,indent=2));p.chmod(0o600)
old={str(r['_id']):r for r in s['ratesBefore']}; new={str(r['_id']):r for r in s['ratesNow']}
diff={k:[f for f in set(old.get(k,{}))|set(new.get(k,{})) if old.get(k,{}).get(f)!=new.get(k,{}).get(f)] for k in old.keys()|new.keys() if old.get(k)!=new.get(k)}
print(json.dumps({'changedRateFields':diff},indent=2))
assert old.keys()==new.keys(),'Feedback created or removed a rating'
assert all(set(fields)<= {'affinityScore','evidenceConfidence'} for fields in diff.values()),'Feedback changed rating inputs'
print('Rating inputs unchanged; derived affinity fields reported separately.')
assert all(x['stored']==x['actual'] for x in s['counters']),'Unread projection mismatch'
assert len(s['outbox'])==1 and len(s['inbox'])==3,'Unexpected notification cardinality'
assert set(x['recipientUserId'] for x in s['inbox'])==set(s['context']['targetUserIds']),'Unexpected recipients'
if len(sys.argv)>2:
 before=json.loads((folder/(sys.argv[2]+'-oracle.json')).read_text())
 assert s['answers']==before['answers'] and s['states']==before['states'],'Reading changed feedback'
 maya='1b1c70be2349b3359a8f6f94'
 assert all(x==next(b for b in before['inbox'] if b['_id']==x['_id']) for x in s['inbox'] if x['recipientUserId']!=maya),'Other target changed'
 assert sum(bool(x.get('readAtIso')) for x in s['inbox'])==1,'Expected Maya alone read'
 old=next(x for x in before['inbox'] if x['recipientUserId']==maya)
 if old.get('readAtIso'):
  assert next(x for x in s['inbox'] if x['recipientUserId']==maya)['readAtIso']==old['readAtIso'],'Reopen changed first read timestamp'
print(json.dumps({'evidence':str(p),'ratesUnchanged':s['ratesUnchanged'],'counters':s['counters'],'tasks':s['tasks'],'inbox':[{'id':x['_id'],'recipient':x['recipientUserId'],'readAtIso':x.get('readAtIso')} for x in s['inbox']]},indent=2))
