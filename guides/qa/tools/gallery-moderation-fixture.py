#!/usr/bin/env python3
"""Disposable gallery/feed actors; preserves unrelated moderation counters on reset. Never starts Docker."""
import json
import subprocess
import sys

KEY = 'EVENT-GALLERY-FEED-001'
IDS = ['6a1100000000000000000001', '6a1100000000000000000002']
command = sys.argv[1] if len(sys.argv) > 1 else 'status'
if command not in ('stage', 'status', 'reset', 'due'):
    raise SystemExit('Use stage, status, due or reset')
base = 'const key=' + json.dumps(KEY) + ',ids=' + json.dumps(IDS) + ';'
code = {
'stage': '''
if(db.getName()!=='demo_db')throw Error('Only demo_db is allowed');
if(db.manualQaCheckpointSnapshots.findOne({_id:key}) || db.users.findOne({userId:{$in:ids}}))throw Error('Already staged');
const source=db.users.findOne({userId:'650000000000000000000061'});if(!source)throw Error('Demo source missing');
const moderation=db.contentModerationState.findOne({_id:'global'});
if(moderation?.pending?.length)throw Error('Wait for outstanding moderation writes');
db.manualQaCheckpointSnapshots.insertOne({_id:key,checkpointId:key,phase:'staging',scenario:'gallery-feed',users:ids,approvalJob:db.notificationRuleConfigs.findOne({ruleKey:'content-auto-approve'}),settings:moderation?.settings??{enabled:false,autoApprove:false,delayMinutes:0,categories:['asset','event','feed']},stagedAtIso:new Date().toISOString()});
for(let i=0;i<ids.length;i++) {
 const id=ids[i],user={_id:ObjectId(id),userId:id,syncKey:id,name:i?'Gallery QA Viewer':'Gallery QA Creator',initials:'GQ',email:'gallery-qa-'+i+'@example.invalid',profileStatus:'public',activities:{},devices:[],about:'Disposable gallery/feed QA',headline:'Gallery QA'};
 for(const field of ['age','birthday','city','height','physique','languages','horoscope','gender','hostTier','completion','profileFormVersion','locationCoordinates','partitionKey','images','profileDetails'])if(source[field]!==undefined)user[field]=source[field];
 db.users.insertOne(user);
}
db.contentModerationState.updateOne({_id:'global'},{$inc:{revision:1},$set:{settings:{enabled:true,autoApprove:false,delayMinutes:0,categories:['asset','event','feed']}},$setOnInsert:{counts:{},pending:[]}},{upsert:true});
db.manualQaCheckpointSnapshots.updateOne({_id:key},{$set:{phase:'ready'}});
print(JSON.stringify({phase:'ready',actors:ids,moderation:'manual',publishedItems:0}));
''',
'due': '''
if(!db.manualQaCheckpointSnapshots.findOne({_id:key}))throw Error('Not staged');
const delayMinutes=Number(db.contentModerationState.findOne({_id:'global'})?.settings?.delayMinutes??0);
const before=new Date(Date.now()-(Math.max(10,delayMinutes+1))*60*1000).toISOString();
const result=db.contentModerationItems.updateMany({ownerUserId:{$in:ids},status:'under-review'},{$set:{submittedAtIso:before}});
print(JSON.stringify({shortenedFixtureItems:result.modifiedCount,approvalWritten:false}));
''',
'reset': '''
const snapshot=db.manualQaCheckpointSnapshots.findOne({_id:key});if(!snapshot)throw Error('Not staged');
if(snapshot.approvalJob)db.notificationRuleConfigs.replaceOne({_id:snapshot.approvalJob._id},snapshot.approvalJob);
const items=db.contentModerationItems.find({ownerUserId:{$in:ids}}).toArray();
const increments={revision:1};for(const item of items){const field='counts.'+item.category+'.'+item.status;increments[field]=(increments[field]||0)-1;}
db.contentModerationState.updateOne({_id:'global'},{$inc:increments,$set:{settings:snapshot.settings},$pull:{pending:{'item.ownerUserId':{$in:ids}}}});
const events=db.events.distinct('sourceId',{creatorUserId:{$in:ids}}),assets=db.assets.distinct('assetId',{ownerUserId:{$in:ids}});
db.contentModerationItems.deleteMany({ownerUserId:{$in:ids}});db.photoFeedPosts.deleteMany({creatorUserId:{$in:ids}});
db.events.deleteMany({sourceId:{$in:events}});db.assets.deleteMany({ownerUserId:{$in:ids}});
for(const collection of ['activityMingleSessions','activityMingleRounds','eventWatchSubscriptions'])db.getCollection(collection).deleteMany({$or:[{userId:{$in:ids}},{sourceId:{$in:events}},{ownerId:{$in:events}},{eventId:{$in:events}}]});
db.activityMembers.deleteMany({$or:[{userId:{$in:ids}},{ownerId:{$in:[...events,...assets]}}]});
for(const collection of ['privacyConsents','userSessionStates','userPageFilterPreferences','userLoginSessions','userLoginAudits','userSessionActions'])db.getCollection(collection).deleteMany({userId:{$in:ids}});
db.users.deleteMany({userId:{$in:ids}});db.manualQaCheckpointSnapshots.deleteOne({_id:key});print(JSON.stringify({reset:true,unrelatedCountersPreserved:true}));
''',
'status': '''print(JSON.stringify({checkpoint:db.manualQaCheckpointSnapshots.findOne({_id:key}),items:db.contentModerationItems.find({ownerUserId:{$in:ids}}).toArray(),state:db.contentModerationState.findOne({_id:'global'})}));'''
}[command]
if command == 'reset':
    subprocess.run(['bash', 'server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh', 'restore', 'browser-sessions', KEY], check=True)
result = subprocess.check_output(['docker','exec','mongodb','sh','-c',
    'exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"',
    'gallery-moderation-fixture', base + code], text=True)
print(result.strip())
