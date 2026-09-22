#!/usr/bin/env python3
"""Disposable demo baseline for AFFILIATE-INVITATION-001; never seeds outcomes."""
import json, re, subprocess, sys
OWNER = '6aff10000000000000000001'
STATE = 'AFFILIATE-INVITATION-001'
def mongo(code):
    return subprocess.check_output(['docker','exec','mongodb','sh','-c',
        'exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"',
        'affiliate-fixture',code], text=True)
base = f'const owner={json.dumps(OWNER)}, key={json.dumps(STATE)}, states=db.manualQaCheckpointSnapshots; '
command=sys.argv[1] if len(sys.argv)>1 else 'status'
if command=='stage':
    code='''if(states.findOne({_id:key}) || db.users.findOne({userId:owner})) throw Error('Already staged; inspect/reset first');
    const source=db.users.findOne({userId:'650000000000000000000061'}); if(!source)throw Error('Demo source missing');
    const user={_id:ObjectId(owner),userId:owner,syncKey:owner,name:'Affiliate QA Owner',initials:'AQ',
      email:'affiliate-owner@example.invalid',profileStatus:'public',activities:{},devices:[],about:'Disposable affiliate QA',headline:'Affiliate QA'};
    for(const field of ['age','birthday','city','height','physique','languages','horoscope','gender','hostTier','completion','profileFormVersion','locationCoordinates','partitionKey','images','profileDetails'])
      if(source[field]!==undefined)user[field]=source[field];
    states.insertOne({_id:key,checkpointId:key,scenario:'affiliate-invitation',phase:'ready',owner,users:[owner],stagedAtIso:new Date().toISOString()});
    db.users.insertOne(user); print(JSON.stringify({phase:'ready',owner,seededOutcomes:false}));'''
elif command=='track':
    user=sys.argv[2]
    if not re.fullmatch(r'demo-profile-[a-f0-9-]{36}',user):raise SystemExit('Only new demo-profile UUID identities can be tracked')
    code=f'if(!states.findOne({{_id:key}}))throw Error("Not staged"); if(db.users.findOne({{userId:{json.dumps(user)}}}))throw Error("Track BEFORE submitting new profile"); states.updateOne({{_id:key}},{{$addToSet:{{users:{json.dumps(user)}}}}}); print("Tracked new QA identity");'
elif command=='reset':
    state=json.loads(mongo(base+'print(JSON.stringify(states.findOne({_id:key})));'))
    if not state:raise SystemExit('Not staged')
    for user in state['users']:
        if user==OWNER:continue
        if not re.fullmatch(r'demo-profile-[a-f0-9-]{36}',user):raise SystemExit('Invalid tracked media owner')
        subprocess.run(['docker','exec','minio','sh','-c',
          'export MC_HOST_qa="http://${MINIO_ROOT_USER}:${MINIO_ROOT_PASSWORD}@localhost:9000"; mc rm --recursive --force "qa/myscoutee-media/public/demo/images/$1/"',
          'affiliate-media-reset',user],check=True,stdout=subprocess.DEVNULL)
    subprocess.run(['bash','server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh','restore','browser-sessions',STATE],check=True)
    code='''const state=states.findOne({_id:key}); if(!state)throw Error('Not staged');
    const ids=state.users, events=[...new Set(db.events.find({ownerUserId:owner},{_id:1,sourceId:1}).toArray().flatMap(x=>[String(x._id),x.sourceId]).filter(Boolean))];
    for(const name of db.getCollectionNames()) {
      if(name==='manualQaCheckpointSnapshots')continue;
      db.getCollection(name).deleteMany({$or:[{_id:{$in:ids}},{userId:{$in:ids}},{ownerUserId:{$in:ids}}, {referrerUserId:owner},
        {recipientUserId:{$in:ids}},{actorUserId:{$in:ids}}, {relatedUserId:{$in:ids}}, {leftUserId:{$in:ids}}, {rightUserId:{$in:ids}},
        {eventId:{$in:events}},{ownerId:{$in:events}}, {targetId:{$in:ids}}]});
    }
    db.affiliateLinks.deleteMany({_id:{$in:ids}}); db.affiliateRegistrations.deleteMany({_id:{$in:ids}});
    states.deleteOne({_id:key}); print(JSON.stringify({phase:'reset',users:ids.length,events:events.length}));'''
else:
    code='''const state=states.findOne({_id:key}); print(JSON.stringify({state,
      users:state?db.users.find({userId:{$in:state.users}},{userId:1,name:1,profileStatus:1,affiliateRegistration:1}).toArray():[],
      referrals:db.affiliateRegistrations.countDocuments({referrerUserId:owner}),
      imports:db.integrationParticipantInvites.find({ownerUserId:owner},{participantId:1,claimedUserId:1}).toArray(),
      mappings:db.integrationExternalIds.find({ownerUserId:owner,resourceType:'participant'},{externalId:1,internalId:1}).toArray(),
      tokens:db.integrationTokens.countDocuments({ownerUserId:owner,revokedAtIso:{$exists:false}})}));'''
print(mongo(base+code).strip())
