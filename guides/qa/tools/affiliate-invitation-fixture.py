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
elif command=='stage-revenue':
    code='''const state=states.findOne({_id:key});
    if(!state || state.users.length!==2)throw Error('Register one tracked invitee first');
    const payer=state.users.find(id=>id!==owner);
    if(!db.affiliateRegistrations.findOne({_id:payer,referrerUserId:owner}))throw Error('Normal referral registration missing');
    const ids=['6aff20000000000000000001','6aff20000000000000000002'];
    if(db.events.countDocuments({sourceId:{$in:ids}}))throw Error('Revenue prerequisites already staged');
    const template=db.events.findOne({status:'A',eventType:'main'});if(!template)throw Error('Event template missing');
    const now=new Date(), start=new Date(now.getTime()+2*86400000), end=new Date(start.getTime()+3600000);
    for(const [index,id] of ids.entries()) {
      const event={...template,_id:ObjectId(id),sourceId:id,syncKey:id,ownerUserId:owner,organizerUserId:owner,
        creatorUserId:owner,creatorName:'Affiliate QA Owner',admins:[owner],status:'A',moderationStatus:'approved',
        title:'QA Affiliate '+(index===0?'EUR 100':'HUF 5000'),subtitle:'Disposable revenue prerequisite',
        visibility:'Public',blindMode:'Visible Event',isTrashed:false,trashedAtIso:null,expired:false,
        startAtIso:start.toISOString(),endAtIso:end.toISOString(),location:'Austin · QA revenue',sourceLink:'',
        locationCoordinates:{latitude:30.2672,longitude:-97.7431},locationGeo:{type:'Point',coordinates:[-97.7431,30.2672]},
        mode:'Casual',frequency:'Once',ticketing:false,approvalRequired:index===0,autoInviter:false,
        capacityMin:1,capacityMax:10,capacityTotal:10,capacityTotalActual:10,full:false,
        acceptedMembers:1,pendingMembers:0,acceptedMemberUserIds:[owner],pendingMemberUserIds:[],invitedMemberUserIds:[],pendingRequestMemberUserIds:[],
        slotsEnabled:false,slotTemplates:[],parentEventId:null,parentSubEventId:null,groupId:null,generated:false,eventType:'main',
        upcomingSlots:[],nextSlot:null,subEventsEnabled:false,subEventDefinitions:[],subEvents:[],policiesEnabled:false,policies:[],
        paymentSessionId:null,createdDate:now.toISOString(),updatedDate:now.toISOString(),
        pricing:{enabled:true,mode:'fixed',basePrice:index===0?100:5000,currency:index===0?'EUR':'HUF',taxMode:'included',chargeType:'per_attendee',
          quantityRulesEnabled:false,quantityRules:[],rounding:'none',demandRulesEnabled:false,demandRules:[],timeRulesEnabled:false,timeRules:[],
          cancellationPolicy:{enabled:false,rules:[]},slotPricingEnabled:false,slotOverrides:[],audience:{enabled:false,promoCodes:[]}}};
      db.events.insertOne(event);
      db.activityMembers.insertOne({_id:'qa-affiliate-member-'+id,ownerType:'event',ownerId:id,userId:owner,role:'Admin',status:'accepted',actionAtIso:now.toISOString()});
    }
    states.updateOne({_id:key},{$set:{revenueEventIds:ids,phase:'revenue-ready'}});
    print(JSON.stringify({events:ids,payer,seededPayments:0,seededRevenue:0}));'''
elif command=='stage-location-gap':
    code='''const state=states.findOne({_id:key});
    if(!state || state.users.length!==2 || state.locationGapBaseline)throw Error('Exactly one registered invitee and no active location gap required');
    const payer=state.users.find(id=>id!==owner), user=db.users.findOne({userId:payer});
    if(!user)throw Error('Invitee missing');
    states.updateOne({_id:key},{$set:{locationGapBaseline:{userId:payer,locationCoordinates:user.locationCoordinates??null}}});
    db.users.updateOne({userId:payer},{$set:{locationCoordinates:null}});
    print(JSON.stringify({userId:payer,locationCoordinates:null,purpose:'User-requested missing-location UI branch prerequisite'}));'''
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
