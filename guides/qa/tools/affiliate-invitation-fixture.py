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
    const organizer=db.users.findOne({userId:owner});
    const now=new Date(), start=new Date(now.getTime()+2*86400000), end=new Date(start.getTime()+3600000);
    for(const [index,id] of ids.entries()) {
      const event={...template,_id:ObjectId(id),sourceId:id,syncKey:id,ownerUserId:owner,organizerUserId:owner,
        creatorUserId:owner,creatorName:'Affiliate QA Owner',admins:[owner],status:'A',moderationStatus:'approved',
        title:'QA Affiliate '+(index===0?'EUR 100':'HUF 5000'),subtitle:'Disposable revenue prerequisite',
        creatorInitials:organizer.initials,creatorGender:organizer.gender,creatorCity:organizer.city,avatar:organizer.images?.[0]??'',
        timeframe:start.toISOString()+' – '+end.toISOString(),unread:0,feedbackOwnEventCounterUserIds:[],
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
elif command=='stage-huf-approval':
    code='''const state=states.findOne({_id:key});
    if(state?.phase!=='revenue-ready')throw Error('Revenue baseline required');
    const id=state.revenueEventIds[1], payer=state.users.find(id=>id!==owner);
    if(db.payments.countDocuments({userId:payer,eventId:id}) ||
       db.eventCheckoutBasketItems.countDocuments({sourceId:id,reservationActive:true}) ||
       db.activityMembers.countDocuments({ownerId:id,userId:payer,status:{$in:['accepted','pending']}}))
      throw Error('Remove the unpaid expired trial through the UI before staging');
    db.events.updateMany({sourceId:id},{$set:{approvalRequired:true}});
    states.updateOne({_id:key},{$set:{hufApprovalControl:true}});
    print(JSON.stringify({eventId:id,approvalRequired:true,seededOutcomes:false}));'''
elif command=='stage-grace-cases':
    code='''const state=states.findOne({_id:key});
    if(state?.phase!=='revenue-ready' || state.graceEventIds)throw Error('Unstaged grace cases on retained revenue baseline required');
    const template=db.events.findOne({sourceId:state.revenueEventIds[0],ownerUserId:owner});
    if(!template)throw Error('Owned event prerequisite missing');
    const ids=['6aff20000000000000000003','6aff20000000000000000004'];
    if(db.events.countDocuments({sourceId:{$in:ids}}))throw Error('Grace event IDs already exist');
    const now=new Date().toISOString(), start=new Date(Date.now()+4.5*3600000).toISOString(), end=new Date(Date.parse(start)+3600000).toISOString();
    for(const [index,id] of ids.entries()) {
      const event={...template,_id:ObjectId(id),sourceId:id,syncKey:id,
        title:index===0?'QA Grace Manual':'QA Grace Auto',subtitle:'Disposable unpaid payment deadline control',
        startAtIso:start,endAtIso:end,timeframe:start+' – '+end,
        approvalRequired:index===0,paymentDeadlineEnabled:true,paymentDeadlineHours:4,
        acceptedMembers:1,pendingMembers:0,acceptedMemberUserIds:[owner],pendingMemberUserIds:[],
        invitedMemberUserIds:[],pendingRequestMemberUserIds:[],activity:0,unread:0,paymentSessionId:null,
        createdDate:now,updatedDate:now,
        pricing:{...template.pricing,basePrice:10,currency:'EUR',cancellationPolicy:{enabled:false,rules:[]}}};
      db.events.insertOne(event);
      db.activityMembers.insertOne({_id:'qa-affiliate-member-'+id,ownerType:'event',ownerId:id,userId:owner,role:'Admin',status:'accepted',actionAtIso:now});
    }
    states.updateOne({_id:key},{$set:{graceEventIds:ids}});
    print(JSON.stringify({events:ids,deadline:new Date(Date.parse(start)-4*3600000).toISOString(),seededCheckoutOutcomes:false}));'''
elif command=='stage-grace-off':
    code='''const state=states.findOne({_id:key});
    if(state?.phase!=='revenue-ready')throw Error('Revenue prerequisite required');
    const id='6aff20000000000000000005';
    if(db.events.countDocuments({sourceId:id}))throw Error('Grace OFF control already staged');
    const template=db.events.findOne({sourceId:'6aff20000000000000000001',ownerUserId:owner});
    if(!template)throw Error('Fixture event template missing');
    const now=new Date().toISOString(), start=new Date(Date.now()+2*3600000).toISOString(), end=new Date(Date.parse(start)+3600000).toISOString();
    db.events.insertOne({...template,_id:ObjectId(id),sourceId:id,syncKey:id,title:'QA Grace Off',
      subtitle:'Disposable disabled payment deadline control',startAtIso:start,endAtIso:end,timeframe:start+' – '+end,
      approvalRequired:false,paymentDeadlineEnabled:false,paymentDeadlineHours:4,
      acceptedMembers:1,pendingMembers:0,acceptedMemberUserIds:[owner],pendingMemberUserIds:[],
      invitedMemberUserIds:[],pendingRequestMemberUserIds:[],activity:0,unread:0,paymentSessionId:null,
      createdDate:now,updatedDate:now,
      pricing:{...template.pricing,basePrice:10,currency:'EUR',cancellationPolicy:{enabled:false,rules:[]}}});
    db.activityMembers.insertOne({_id:'qa-affiliate-member-'+id,ownerType:'event',ownerId:id,userId:owner,role:'Admin',status:'accepted',actionAtIso:now});
    states.updateOne({_id:key},{$set:{graceOffEventId:id}});
    print(JSON.stringify({eventId:id,startAtIso:start,seededCheckoutOutcomes:false}));'''
elif command in ('expire-grace-case','reopen-grace-case'):
    mode=sys.argv[2] if len(sys.argv)>2 else ''
    if mode not in ('manual','auto'):raise SystemExit('Specify manual or auto')
    code='''const state=states.findOne({_id:key});
    if(!state?.graceEventIds)throw Error('Grace cases not staged');
    const id=state.graceEventIds[MODE], payer=state.users.find(x=>x!==owner);
    if(db.payments.countDocuments({userId:payer,sourceId:id}))throw Error('Unpaid-only control: payment found');
    const member=db.activityMembers.findOne({ownerType:'event',ownerId:id,userId:payer});
    const active=db.eventCheckoutBasketItems.find({userId:payer,sourceId:id,reservationActive:true}).toArray();
    if(EXPIRE && (member?.status!=='pending' || !active.length || active.some(x=>x.checkoutSessionId || x.status==='pay')))
      throw Error('Normal pending unpaid join must precede timing change');
    if(!EXPIRE && (member?.status!=='deleted' || active.length))throw Error('Real scheduled expiry must finish before reopening eligibility');
    const deadline=new Date(Date.now()+(EXPIRE?-60000:1800000)).toISOString();
    const start=new Date(Date.parse(deadline)+4*3600000).toISOString(), end=new Date(Date.parse(start)+3600000).toISOString();
    db.events.updateMany({sourceId:id},{$set:{startAtIso:start,endAtIso:end,timeframe:start+' – '+end}});
    if(EXPIRE)db.eventCheckoutBasketItems.updateMany({_id:{$in:active.map(x=>x._id)}},{$set:{expiresAtIso:deadline}});
    print(JSON.stringify({eventId:id,deadline,timingOnly:true,paymentCount:0}));'''.replace('MODE','0' if mode=='manual' else '1').replace('EXPIRE','true' if command=='expire-grace-case' else 'false')
elif command=='refresh-revenue-labels':
    code='''const state=states.findOne({_id:key});
    if(state?.phase!=='revenue-ready'||db.payments.countDocuments({userId:{$in:state.users}}))throw Error('Unpaid fixture required');
    if(db.eventCheckoutBasketItems.countDocuments({userId:{$in:state.users},reservationActive:true}))throw Error('Cancel the request through UI first');
    const organizer=db.users.findOne({userId:owner});
    for(const id of state.revenueEventIds){const event=db.events.findOne({sourceId:id,ownerUserId:owner});
      db.events.updateOne({_id:event._id},{$set:{creatorInitials:organizer.initials,creatorGender:organizer.gender,creatorCity:organizer.city,
        avatar:organizer.images?.[0]??'',timeframe:event.startAtIso+' – '+event.endAtIso,unread:0,feedbackOwnEventCounterUserIds:[]}});}
    print(JSON.stringify({fixtureLabels:'corrected',financialOutcomes:0}));'''
elif command=='stage-refund-policy':
    code='''const state=states.findOne({_id:key});
    if(state?.phase!=='revenue-ready')throw Error('Revenue prerequisites required');
    if(db.payments.countDocuments({userId:{$in:state.users}}))throw Error('Configure refund prerequisite before payments');
    const result=db.events.updateOne({sourceId:state.revenueEventIds[0],ownerUserId:owner},
      {$set:{'pricing.cancellationPolicy':{enabled:true,rules:[{id:'qa-refund-25',offsetUnit:'days',offsetValue:0,refundKind:'percent',refundValue:25}]}}});
    if(result.matchedCount!==1)throw Error('Scoped event missing');
    print(JSON.stringify({refundPolicy:25,seededOutcomes:false}));'''
elif command=='stage-location-gap':
    code='''const state=states.findOne({_id:key});
    if(!state || state.users.length!==2 || state.locationGapBaseline)throw Error('Exactly one registered invitee and no active location gap required');
    const payer=state.users.find(id=>id!==owner), user=db.users.findOne({userId:payer});
    if(!user)throw Error('Invitee missing');
    states.updateOne({_id:key},{$set:{locationGapBaseline:{userId:payer,locationCoordinates:user.locationCoordinates??null}}});
    db.users.updateOne({userId:payer},{$set:{locationCoordinates:null}});
    print(JSON.stringify({userId:payer,locationCoordinates:null,purpose:'User-requested missing-location UI branch prerequisite'}));'''
elif command=='stage-location-push':
    code='''const state=states.findOne({_id:key});
    if(!state?.locationGapBaseline || state.locationPushBaseline)throw Error('Active location gap required');
    const id=state.locationGapBaseline.userId, user=db.users.findOne({userId:id});
    if(user.locationCoordinates!=null)throw Error('Missing-location recipient required');
    const item='qa-affiliate-location-push', token='qa-invalid-location-token', now=new Date().toISOString();
    if(db.notificationOutbox.findOne({_id:item}))throw Error('Existing delivery evidence must be inspected');
    states.updateOne({_id:key},{$set:{locationPushBaseline:{userId:id,devices:user.devices??[],outboxId:item}}});
    db.users.updateOne({userId:id},{$set:{devices:[{deviceId:'qa-location-device',firebaseToken:token,notificationsEnabled:true}]}});
    db.notificationOutbox.insertOne({_id:item,syncKey:item,notificationType:'chat-message',entityType:'qa',entityId:item,
      recipientScope:'users',recipientUserIds:[id],firebaseDeliveryRequested:true,
      firebaseDevices:{[id]:{'qa-location-device':require('crypto').createHash('sha256').update(token).digest('hex')}},
      deliveryStrategy:'direct',status:'pending',pendingCounterTracked:false,retryCount:0,nextRetryAt:now,
      createdDate:now,updatedDate:now,title:'QA missing-location guard',body:'Controlled queued delivery',payload:{}});
    print(JSON.stringify({queued:item,location:null,realProviderToken:false}));'''
elif command=='finish-location-gap':
    code='''const state=states.findOne({_id:key});
    if(!state?.locationPushBaseline)throw Error('Missing queued-delivery test');
    const baseline=state.locationPushBaseline, item=db.notificationOutbox.findOne({_id:baseline.outboxId});
    if(item?.status!=='sent'||item.tokenSuccessCount!==0||item.tokenFailureCount!==0||item.retryCount!==0)
      throw Error('Missing-location delivery guard has not passed');
    const coordinates=db.users.findOne({userId:owner})?.locationCoordinates;
    if(!Number.isFinite(coordinates?.latitude)||!Number.isFinite(coordinates?.longitude))throw Error('Fixture source location missing');
    db.users.updateOne({userId:baseline.userId},{$set:{devices:baseline.devices,locationCoordinates:coordinates}});
    states.updateOne({_id:key},{$set:{locationGuardEvidence:{status:item.status,tokenSuccessCount:0,tokenFailureCount:0,retryCount:0},locationGapCompleted:true}});
    db.notificationOutbox.deleteOne({_id:baseline.outboxId});
    print(JSON.stringify({locationGuard:'PASS',fixtureCoordinatesRestored:true,providerSends:0}));'''
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
    if(state.locationPushBaseline?.outboxId)db.notificationOutbox.deleteOne({_id:state.locationPushBaseline.outboxId});
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
