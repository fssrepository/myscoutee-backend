#!/usr/bin/env python3
"""Disposable demo baseline for AFFILIATE-INVITATION-001; never seeds outcomes."""
import json, os, re, shlex, subprocess, sys
from pathlib import Path
OWNER = '6aff10000000000000000001'
STATE = 'AFFILIATE-INVITATION-001'
def mongo(code):
    # collMod faults need the dev container's existing admin credential; ordinary
    # fixture operations retain the application account. Never print either secret.
    admin = len(sys.argv) > 1 and sys.argv[1] in ('arm-revenue-fault', 'disarm-revenue-fault')
    admin_env_file = os.environ.get('QA_MONGO_ADMIN_ENV_FILE')
    if admin and admin_env_file:
        credentials = {}
        for line in Path(admin_env_file).read_text().splitlines():
            if '=' not in line or line.lstrip().startswith('#'):
                continue
            key, value = line.split('=', 1)
            if key.strip() in ('MONGO_INITDB_ROOT_USERNAME', 'MONGO_INITDB_ROOT_PASSWORD'):
                parsed = shlex.split(value)
                credentials[key.strip()] = parsed[0] if parsed else ''
        user, password = (credentials.get(key) for key in ('MONGO_INITDB_ROOT_USERNAME', 'MONGO_INITDB_ROOT_PASSWORD'))
        if not user or not password:
            raise SystemExit('Configured QA admin credential is incomplete')
        # Credentials go through stdin, never process arguments or evidence output.
        auth = 'if(!db.getSiblingDB("admin").auth(' + json.dumps(user) + ',' + json.dumps(password) + ').ok)throw Error("QA admin authentication failed");db=db.getSiblingDB("demo_db");'
        return subprocess.check_output(['docker', 'exec', '-i', 'mongodb', 'mongosh', '--quiet', '--file', '/dev/stdin'],
                                       input=auth + code, text=True)
    shell = ('exec mongosh --quiet --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin demo_db --eval "$1"'
             if admin else 'exec mongosh --quiet --username "$MONGO_APP_USERNAME" --password "$MONGO_APP_PASSWORD" --authenticationDatabase demo_db demo_db --eval "$1"')
    return subprocess.check_output(['docker','exec','mongodb','sh','-c',shell,
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
elif command=='stage-callback-control':
    code='''const state=states.findOne({_id:key});
    if(state?.phase!=='revenue-ready')throw Error('Revenue prerequisite required');
    const id='6aff20000000000000000006';
    if(db.events.countDocuments({sourceId:id}))throw Error('Callback control already staged');
    const template=db.events.findOne({sourceId:state.revenueEventIds[0],ownerUserId:owner});
    const now=new Date().toISOString(), start=new Date(Date.now()+48*3600000).toISOString(), end=new Date(Date.parse(start)+3600000).toISOString();
    db.events.insertOne({...template,_id:ObjectId(id),sourceId:id,syncKey:id,title:'QA Affiliate Callback Control',
      startAtIso:start,endAtIso:end,timeframe:start+' – '+end,approvalRequired:false,paymentDeadlineEnabled:true,paymentDeadlineHours:4,
      acceptedMembers:1,pendingMembers:0,acceptedMemberUserIds:[owner],pendingMemberUserIds:[],invitedMemberUserIds:[],pendingRequestMemberUserIds:[],activity:0,unread:0,
      pricing:{...template.pricing,basePrice:10,currency:'EUR',cancellationPolicy:{enabled:false,rules:[]}},createdDate:now,updatedDate:now});
    db.activityMembers.insertOne({_id:'qa-affiliate-callback-admin',ownerType:'event',ownerId:id,userId:owner,role:'Admin',status:'accepted',actionAtIso:now});
    states.updateOne({_id:key},{$set:{callbackControlId:id}});
    print(JSON.stringify({eventId:id,seededCheckoutOutcomes:false}));'''
elif command=='stage-revenue-asset':
    code='''const state=states.findOne({_id:key});
    if(state?.phase!=='revenue-ready')throw Error('Revenue prerequisite required');
    const payer=state.users.find(x=>x!==owner), eventId='6aff20000000000000000007', assetId='6aff30000000000000000001', stageId='qa-affiliate-borrow-stage';
    if(db.events.countDocuments({sourceId:eventId}) || db.assets.countDocuments({assetId}))throw Error('Asset control already staged');
    const template=db.events.findOne({sourceId:state.revenueEventIds[0],ownerUserId:owner});
    if(!template)throw Error('Fixture template missing');
    const now=new Date().toISOString(), start=new Date(Date.now()+48*3600000).toISOString(), end=new Date(Date.parse(start)+2*3600000).toISOString();
    const stage={id:stageId,name:'QA Revenue Borrow Stage',description:'Isolated affiliate non-event purchase scope',timing:'During',offsetMinutes:0,durationMinutes:120,optional:false,capacityMin:1,capacityMax:4,startAt:start,endAt:end,stageStatus:'A',stageStatusReason:'stage-started',membersAccepted:2,membersPending:0,carsAccepted:0,carsPending:0,carsCapacityMin:0,carsCapacityMax:0};
    const definition={...stage};for(const k of ['stageStatus','stageStatusReason','membersAccepted','membersPending','carsAccepted','carsPending','carsCapacityMin','carsCapacityMax'])delete definition[k];
    db.events.insertOne({...template,_id:ObjectId(eventId),sourceId:eventId,syncKey:eventId,title:'QA Affiliate Asset Context',
      subtitle:'Disposable accepted event prerequisite for non-event purchase',startAtIso:start,endAtIso:end,timeframe:start+' – '+end,
      approvalRequired:false,paymentDeadlineEnabled:false,acceptedMembers:2,pendingMembers:0,acceptedMemberUserIds:[owner,payer],
      pendingMemberUserIds:[],invitedMemberUserIds:[],pendingRequestMemberUserIds:[],activity:0,unread:0,
      subEventsEnabled:true,subEventDefinitions:[definition],subEvents:[stage],
      pricing:{...template.pricing,enabled:false,mode:'free',basePrice:0,cancellationPolicy:{enabled:false,rules:[]}},createdDate:now,updatedDate:now});
    for(const user of [owner,payer]) db.activityMembers.insertOne({_id:'qa-affiliate-asset-member-'+user,ownerType:'event',ownerId:eventId,userId:user,role:user===owner?'Admin':'Member',status:'accepted',actionAtIso:now});
    db.assets.insertOne({_id:ObjectId(assetId),assetId,syncKey:assetId,ownerUserId:owner,type:'Transport',title:'QA Affiliate Paid Transport',
      subtitle:'Disposable non-event purchase control',category:'Sedan',city:'Austin',capacityTotal:3,quantity:3,
      details:'Affiliate purchase and event-booking counter distinction',imageUrl:template.imageUrl,routes:['Austin'],
      policiesEnabled:false,policies:[],pricing:{...template.pricing,enabled:true,basePrice:20,currency:'EUR',cancellationPolicy:{enabled:false,rules:[]}},
      requests:[],visibility:'Public',status:'A',affinity:0,boost:0,createdDate:now,createdUser:owner,updatedDate:now,updatedUser:owner});
    states.updateOne({_id:key},{$set:{revenueAssetControl:{eventId,stageId,assetId}}});
    print(JSON.stringify({eventId,stageId,assetId,seededBorrowOrPayment:false}));'''
elif command=='repair-revenue-asset-id':
    code='''const state=states.findOne({_id:key});
    const id=state?.revenueAssetControl?.assetId;
    if(!id)throw Error('Asset prerequisite missing');
    const asset=db.assets.findOne({_id:id,ownerUserId:owner,assetId:id});
    if(!asset || asset.requests?.length || db.assets.findOne({_id:ObjectId(id)}))throw Error('Untouched malformed fixture asset required');
    states.updateOne({_id:key},{$set:{assetIdTypeRepairOriginal:asset}});
    db.assets.deleteOne({_id:id,ownerUserId:owner,assetId:id});
    db.assets.insertOne({...asset,_id:ObjectId(id)});
    print(JSON.stringify({assetId:id,idType:'ObjectId',changedBusinessFields:false}));'''
elif command=='prepare-exchange-browser':
    code='''if(!states.findOne({_id:key}) || !db.users.findOne({userId:'admin-demo-ava'}))throw Error('FX QA prerequisites missing');
    const checkpointId='AFFILIATE-EXCHANGE-RATES-001';
    states.updateOne({_id:checkpointId},{$setOnInsert:{checkpointId,scenario:'affiliate-exchange-rates',phase:'ready',parentCheckpoint:key,stagedAtIso:new Date().toISOString()}},{upsert:true});
    print(JSON.stringify({checkpointId,prerequisitesVerified:true}));'''
elif command=='prepare-exchange-operator-browser':
    code='''if(!states.findOne({_id:key}) || !db.users.findOne({userId:'operator@myscoutee.local'}))throw Error('FX operator prerequisites missing');
    const checkpointId='AFFILIATE-EXCHANGE-OPERATOR-001';
    states.updateOne({_id:checkpointId},{$setOnInsert:{checkpointId,scenario:'affiliate-exchange-operator',phase:'ready',parentCheckpoint:key,stagedAtIso:new Date().toISOString()}},{upsert:true});
    print(JSON.stringify({checkpointId,prerequisitesVerified:true}));'''
elif command=='stage-exchange-source':
    code='''const state=states.findOne({_id:key}); if(!state)throw Error('Not staged');
    const config=db.deploymentConfigurations.findOne({_id:'deployment-configuration'});
    if(!state.exchangeSourceBaseline) states.updateOne({_id:key},{$set:{exchangeSourceBaseline:{present:Object.prototype.hasOwnProperty.call(config.payment,'exchangeRateUrl'),value:config.payment.exchangeRateUrl??null}}});
    db.deploymentConfigurations.updateOne({_id:config._id},{$set:{'payment.exchangeRateUrl':'http://exchange-rate-simulator:18083/eurofxref.xml'},$inc:{version:NumberLong("1")}});
    print(JSON.stringify({source:'local exchange-rate simulator',seededPaymentOutcomes:false}));'''
elif command=='stage-revenue-concurrency':
    code='''const state=states.findOne({_id:key});
    if(state?.phase!=='revenue-ready'||state.concurrencyControl)throw Error('Unstaged concurrency baseline required');
    const first=state.users.find(x=>x!==owner), second='6aff10000000000000000002', eventId='6aff20000000000000000012';
    const source=db.users.findOne({userId:first}), registration=db.affiliateRegistrations.findOne({_id:first});
    const method=db.savedPaymentMethods.findOne({userId:first,last4:'4444',status:'active'});
    if(!source||!registration||!method||db.users.findOne({userId:second})||db.events.findOne({sourceId:eventId}))throw Error('Isolated prerequisite missing/collision');
    const now=new Date().toISOString(), start=new Date(Date.now()+48*3600000).toISOString(), end=new Date(Date.parse(start)+3600000).toISOString();
    const user={_id:ObjectId(second),userId:second,syncKey:second,name:'Affiliate QA Second',initials:'AS',email:'affiliate-second@example.invalid',
      profileStatus:'public',activities:{},devices:[],about:'Disposable concurrency prerequisite',headline:'Affiliate QA'};
    for(const field of ['age','birthday','city','height','physique','languages','horoscope','gender','hostTier','completion','profileFormVersion','locationCoordinates','partitionKey','images','profileDetails'])
      if(source[field]!==undefined)user[field]=source[field];
    db.users.insertOne(user);
    db.affiliateRegistrations.insertOne({...registration,_id:ObjectId(second),registeredAtIso:now});
    db.savedPaymentMethods.insertOne({...method,_id:ObjectId('6aff40000000000000000002'),version:NumberLong("0"),userId:second,registrationId:'qa-concurrency-prerequisite',createdAtIso:now,updatedAtIso:now});
    const template=db.events.findOne({sourceId:state.callbackControlId,ownerUserId:owner});
    db.events.insertOne({...template,_id:ObjectId(eventId),sourceId:eventId,syncKey:eventId,title:'QA Affiliate Concurrent Purchases',
      startAtIso:start,endAtIso:end,timeframe:start+' – '+end,acceptedMembers:1,pendingMembers:0,acceptedMemberUserIds:[owner],pendingMemberUserIds:[],
      invitedMemberUserIds:[],pendingRequestMemberUserIds:[],activity:0,unread:0,paymentSessionId:null,
      pricing:{...template.pricing,basePrice:7,cancellationPolicy:{enabled:true,rules:[{id:'qa-full-refund',offsetUnit:'days',offsetValue:0,refundKind:'full',refundValue:100}]}},createdDate:now,updatedDate:now});
    db.activityMembers.insertOne({_id:'qa-concurrent-admin',ownerType:'event',ownerId:eventId,userId:owner,role:'Admin',status:'accepted',actionAtIso:now});
    states.updateOne({_id:key},{$addToSet:{users:second},$set:{concurrencyControl:{first,second,eventId,baseline:db.affiliatePartners.findOne({_id:owner})}}});
    print(JSON.stringify({second,eventId,amountPerPurchase:7,seededPayments:0,seededRevenue:0,preparedReferralAndSimulatorMethod:true}));'''
elif command=='repair-concurrency-registration':
    code='''const state=states.findOne({_id:key}), control=state?.concurrencyControl;
    if(!control || control.replayEventId)throw Error('Unrepaired concurrency prerequisite required');
    const registration=db.affiliateRegistrations.findOne({_id:control.second,referrerUserId:owner});
    const eventId='6aff20000000000000000013';
    if(!registration || db.affiliateRegistrations.findOne({_id:ObjectId(control.second)}) || db.events.findOne({sourceId:eventId}))throw Error('Malformed isolated registration required');
    const template=db.events.findOne({sourceId:control.eventId,ownerUserId:owner});
    const now=new Date().toISOString(), start=new Date(Date.now()+48*3600000).toISOString(), end=new Date(Date.parse(start)+3600000).toISOString();
    states.updateOne({_id:key},{$set:{'concurrencyControl.originalRegistration':registration,'concurrencyControl.replayBaseline':db.affiliatePartners.findOne({_id:owner}),'concurrencyControl.replayEventId':eventId}});
    db.affiliateRegistrations.deleteOne({_id:control.second,referrerUserId:owner});
    db.affiliateRegistrations.insertOne({...registration,_id:ObjectId(control.second)});
    db.events.insertOne({...template,_id:ObjectId(eventId),sourceId:eventId,syncKey:eventId,title:'QA Affiliate Concurrent Replay',
      startAtIso:start,endAtIso:end,timeframe:start+' – '+end,acceptedMembers:1,pendingMembers:0,acceptedMemberUserIds:[owner],pendingMemberUserIds:[],
      invitedMemberUserIds:[],pendingRequestMemberUserIds:[],activity:0,unread:0,paymentSessionId:null,createdDate:now,updatedDate:now});
    db.activityMembers.insertOne({_id:'qa-concurrent-replay-admin',ownerType:'event',ownerId:eventId,userId:owner,role:'Admin',status:'accepted',actionAtIso:now});
    print(JSON.stringify({eventId,repairedRegistrationIdType:'ObjectId',changedPaymentOutcomes:false}));'''
elif command=='stage-concurrency-retest':
    code='''const state=states.findOne({_id:key}), control=state?.concurrencyControl;
    if(!control?.replayEventId || control.retestEventId || !db.affiliateRegistrations.findOne({_id:ObjectId(control.second),referrerUserId:owner}))throw Error('Corrected attribution prerequisite required');
    const eventId='6aff20000000000000000014';
    if(db.events.findOne({sourceId:eventId}))throw Error('Retest already staged');
    const template=db.events.findOne({sourceId:control.replayEventId,ownerUserId:owner});
    const now=new Date().toISOString(), start=new Date(Date.now()+48*3600000).toISOString(), end=new Date(Date.parse(start)+3600000).toISOString();
    db.events.insertOne({...template,_id:ObjectId(eventId),sourceId:eventId,syncKey:eventId,title:'QA Affiliate Concurrent Verified',
      startAtIso:start,endAtIso:end,timeframe:start+' – '+end,acceptedMembers:1,pendingMembers:0,acceptedMemberUserIds:[owner],pendingMemberUserIds:[],
      invitedMemberUserIds:[],pendingRequestMemberUserIds:[],activity:0,unread:0,paymentSessionId:null,createdDate:now,updatedDate:now});
    db.activityMembers.insertOne({_id:'qa-concurrent-retest-admin',ownerType:'event',ownerId:eventId,userId:owner,role:'Admin',status:'accepted',actionAtIso:now});
    states.updateOne({_id:key},{$set:{'concurrencyControl.retestEventId':eventId,'concurrencyControl.retestBaseline':db.affiliatePartners.findOne({_id:owner})}});
    print(JSON.stringify({eventId,seededPayments:0,seededRevenue:0}));'''
elif command=='prepare-refund-concurrency-browser':
    code='''const state=states.findOne({_id:key}), eventId=state?.concurrencyControl?.retestEventId;
    if(!eventId || db.payments.countDocuments({sourceId:eventId,auditKind:'refund',refundRequestStatus:'pending'})!==2 || db.payments.countDocuments({sourceId:eventId,auditKind:'payment',affiliateOwnerUserId:owner})!==2)throw Error('Two real pending attributed refund requests required');
    const checkpointId='AFFILIATE-REFUND-CONCURRENCY-001';
    states.updateOne({_id:checkpointId},{$setOnInsert:{checkpointId,scenario:'affiliate-refund-concurrency',phase:'ready',parentCheckpoint:key,stagedAtIso:new Date().toISOString()}},{upsert:true});
    print(JSON.stringify({checkpointId,pendingRequestsVerified:true}));'''
elif command=='prepare-concurrency-browser':
    code='''const state=states.findOne({_id:key}), checkpointId='AFFILIATE-REVENUE-CONCURRENCY-001';
    if(!state?.concurrencyControl)throw Error('Concurrency prerequisite missing');
    states.updateOne({_id:checkpointId},{$setOnInsert:{checkpointId,scenario:'affiliate-revenue-concurrency',phase:'ready',parentCheckpoint:key,stagedAtIso:new Date().toISOString()}},{upsert:true});
    print(JSON.stringify({checkpointId,prerequisitesVerified:true}));'''
elif command=='stage-revenue-recovery':
    code='''const state=states.findOne({_id:key});
    if(state?.phase!=='revenue-ready' || state.recoveryControls)throw Error('Unstaged recovery controls required');
    const template=db.events.findOne({sourceId:state.callbackControlId,ownerUserId:owner});
    if(!template)throw Error('Callback control prerequisite missing');
    const now=new Date().toISOString(), start=new Date(Date.now()+48*3600000).toISOString(), end=new Date(Date.parse(start)+3600000).toISOString();
    const controls=['intent','ledger','commit','ack'].map((mode,i)=>({mode,eventId:'6aff200000000000000000'+String(i+8).padStart(2,'0'),amount:i+2}));
    for(const c of controls) {
      if(db.events.findOne({sourceId:c.eventId}))throw Error('Control collision');
      db.events.insertOne({...template,_id:ObjectId(c.eventId),sourceId:c.eventId,syncKey:c.eventId,title:'QA Revenue Recovery '+c.mode,
        startAtIso:start,endAtIso:end,timeframe:start+' – '+end,acceptedMembers:1,pendingMembers:0,acceptedMemberUserIds:[owner],pendingMemberUserIds:[],
        invitedMemberUserIds:[],pendingRequestMemberUserIds:[],activity:0,unread:0,paymentSessionId:null,
        pricing:{...template.pricing,basePrice:c.amount,cancellationPolicy:{enabled:true,rules:[{id:'qa-full-refund',offsetUnit:'days',offsetValue:0,refundKind:'full',refundValue:100}]}},createdDate:now,updatedDate:now});
      db.activityMembers.insertOne({_id:'qa-recovery-admin-'+c.mode,ownerType:'event',ownerId:c.eventId,userId:owner,role:'Admin',status:'accepted',actionAtIso:now});
    }
    states.updateOne({_id:key},{$set:{recoveryControls:controls}});
    print(JSON.stringify({controls,seededOutcomes:false}));'''
elif command=='arm-revenue-fault':
    mode=sys.argv[2] if len(sys.argv)>2 else ''
    if mode not in ('intent','ledger','commit','ack'):raise SystemExit('Use intent, ledger, commit, or ack')
    code='''const state=states.findOne({_id:key}), mode=MODE;
    if(state?.activeRevenueFault)throw Error('Restore existing fault first');
    const control=(state.recoveryControls || []).find(x=>x.mode===mode);
    if(!control)throw Error('Recovery prerequisite required');
    const partner=db.affiliatePartners.findOne({_id:owner});
    if(partner?.pending)throw Error('Pending partner operation must finish first');
    let name, guard;
    if(mode==='intent') {name='affiliatePartners';guard={$or:[{_id:{$ne:owner}},{'pending.next.gross':{$ne:control.amount*100}}]};}
    if(mode==='ledger') {name='affiliatePaymentContributions';guard={$or:[{ownerUserId:{$ne:owner}},{gross:{$ne:control.amount*100}}]};}
    if(mode==='commit') {name='affiliatePartners';guard={$or:[{_id:{$ne:owner}},{pending:{$exists:true}},{'totals.EUR.grossMinor':{$lte:partner.totals.EUR.grossMinor}}]};}
    if(mode==='ack') {name='payments';guard={$or:[{sourceId:{$ne:control.eventId}},{affiliateRevenuePending:{$ne:false}},{status:{$ne:'captured'}}]};}
    const original=db.getCollectionInfos({name})[0].options;
    const validator=Object.keys(original.validator??{}).length?{$and:[original.validator,guard]}:guard;
    states.updateOne({_id:key},{$set:{activeRevenueFault:{mode,name,original,control,baseline:partner,armedAtIso:new Date().toISOString()}}});
    const result=db.runCommand({collMod:name,validator,validationLevel:'strict',validationAction:'error'});
    if(!result.ok)throw Error(JSON.stringify(result));
    print(JSON.stringify({mode,collection:name,scope:'disposable affiliate only',eventId:control.eventId}));'''.replace('MODE',json.dumps(mode))
elif command=='clear-unarmed-revenue-fault':
    code='''const state=states.findOne({_id:key}), fault=state?.activeRevenueFault;
    if(!fault)throw Error('No recorded fault');
    const current=db.getCollectionInfos({name:fault.name})[0].options;
    if(JSON.stringify(current.validator??{})!==JSON.stringify(fault.original.validator??{}))throw Error('Validator differs: use disarm with authorized admin');
    states.updateOne({_id:key},{$push:{revenueFaultHistory:{...fault,status:'NOT ARMED',reason:'collMod access unavailable'}},$unset:{activeRevenueFault:''}});
    print(JSON.stringify({mode:fault.mode,validatorUnchanged:true,status:'NOT ARMED'}));'''
elif command=='disarm-revenue-fault':
    code='''const state=states.findOne({_id:key}), fault=state?.activeRevenueFault;
    if(!fault)throw Error('No armed fault');
    const original=fault.original;
    const result=db.runCommand({collMod:fault.name,validator:original.validator??{},validationLevel:original.validationLevel??'strict',validationAction:original.validationAction??'error'});
    if(!result.ok)throw Error(JSON.stringify(result));
    states.updateOne({_id:key},{$push:{revenueFaultHistory:{...fault,restoredAtIso:new Date().toISOString()}},$unset:{activeRevenueFault:''}});
    print(JSON.stringify({restored:fault.name,mode:fault.mode}));'''
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
    if state.get('activeRevenueFault'):raise SystemExit('Run disarm-revenue-fault before reset')
    for user in state['users']:
        if user==OWNER or user==state.get('concurrencyControl',{}).get('second'):continue
        if not re.fullmatch(r'demo-profile-[a-f0-9-]{36}',user):raise SystemExit('Invalid tracked media owner')
        subprocess.run(['docker','exec','minio','sh','-c',
          'export MC_HOST_qa="http://${MINIO_ROOT_USER}:${MINIO_ROOT_PASSWORD}@localhost:9000"; mc rm --recursive --force "qa/myscoutee-media/public/demo/images/$1/"',
          'affiliate-media-reset',user],check=True,stdout=subprocess.DEVNULL)
    subprocess.run(['bash','server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh','restore','browser-sessions',STATE],check=True)
    if state.get('exchangeSourceBaseline'):
        subprocess.run(['bash','server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh','restore','browser-sessions','AFFILIATE-EXCHANGE-RATES-001'],check=True)
        subprocess.run(['bash','server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh','restore','browser-sessions','AFFILIATE-EXCHANGE-OPERATOR-001'],check=True)
    if state.get('concurrencyControl'):
        subprocess.run(['bash','server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh','restore','browser-sessions','AFFILIATE-REVENUE-CONCURRENCY-001'],check=True)
        subprocess.run(['bash','server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh','restore','browser-sessions','AFFILIATE-REFUND-CONCURRENCY-001'],check=True)
    code='''const state=states.findOne({_id:key}); if(!state)throw Error('Not staged');
    if(state.exchangeSourceBaseline) {
      const baseline=state.exchangeSourceBaseline;
      db.deploymentConfigurations.updateOne({_id:'deployment-configuration'},baseline.present?{$set:{'payment.exchangeRateUrl':baseline.value},$inc:{version:NumberLong("1")}}:{$unset:{'payment.exchangeRateUrl':''},$inc:{version:NumberLong("1")}});
    }
    const ids=state.users, events=[...new Set(db.events.find({ownerUserId:owner},{_id:1,sourceId:1}).toArray().flatMap(x=>[String(x._id),x.sourceId]).filter(Boolean))];
    const assets=db.assets.find({ownerUserId:owner},{assetId:1}).toArray().map(x=>x.assetId);
    if(state.locationPushBaseline?.outboxId)db.notificationOutbox.deleteOne({_id:state.locationPushBaseline.outboxId});
    for(const name of db.getCollectionNames()) {
      if(name==='manualQaCheckpointSnapshots')continue;
      db.getCollection(name).deleteMany({$or:[{_id:{$in:ids}},{userId:{$in:ids}},{ownerUserId:{$in:ids}}, {referrerUserId:owner},
        {recipientUserId:{$in:ids}},{actorUserId:{$in:ids}}, {relatedUserId:{$in:ids}}, {leftUserId:{$in:ids}}, {rightUserId:{$in:ids}},
        {eventId:{$in:events}},{ownerId:{$in:[...events,...assets]}},{assetId:{$in:assets}}, {targetId:{$in:ids}}]});
    }
    db.affiliateLinks.deleteMany({_id:{$in:ids}}); db.affiliateRegistrations.deleteMany({_id:{$in:ids}});
    states.deleteMany({$or:[{_id:key},{parentCheckpoint:key}]}); print(JSON.stringify({phase:'reset',users:ids.length,events:events.length}));'''
else:
    code='''const state=states.findOne({_id:key}); print(JSON.stringify({state,
      users:state?db.users.find({userId:{$in:state.users}},{userId:1,name:1,profileStatus:1,affiliateRegistration:1}).toArray():[],
      referrals:db.affiliateRegistrations.countDocuments({referrerUserId:owner}),
      imports:db.integrationParticipantInvites.find({ownerUserId:owner},{participantId:1,claimedUserId:1}).toArray(),
      mappings:db.integrationExternalIds.find({ownerUserId:owner,resourceType:'participant'},{externalId:1,internalId:1}).toArray(),
      tokens:db.integrationTokens.countDocuments({ownerUserId:owner,revokedAtIso:{$exists:false}})}));'''
print(mongo(base+code).strip())
