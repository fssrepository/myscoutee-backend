/* global ManualQa, process, ObjectId */
(() => {
  'use strict';
  const Q = ManualQa;
  const scenario = 'integration-api-group';
  const checkpointId = 'INTEGRATION-API-GROUP-001';
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== checkpointId) Q.fail('Wrong Group API checkpoint.');
  const id = n => `f0300926${String(n).padStart(16, '0')}`;
  const actors = [1, 2, 3, 4].map(id);
  const names = ['Group API Alex', 'Group API Maya', 'Group API Milo', 'Group API Nia'];
  const freshNames = ['Group API Fresh Rowan', 'Group API Fresh Event'];
  const groups = ['qa-group-api-a', 'qa-group-api-b'];
  const callbacks = ['http://127.0.0.1:6274/oauth/callback', 'http://localhost:6274/oauth/callback'];
  // Resolve new UI-created accounts/workspace profiles before deletion. Never use
  // the whole demo database or another campaign's actors as a cleanup boundary.
  function current() {
    const fresh = Q.collection('users').find({name: {$in: freshNames}}).toArray().map(u => u.userId);
    const accounts = [...actors, ...fresh];
    const profiles = Q.collection('users').find({accountUserId: {$in: accounts}}).toArray().map(u => u.userId);
    const userIds = [...new Set([...accounts, ...profiles])];
    const own = {$in: userIds};
    const eventIds = Q.collection('events').distinct('sourceId', {$or: [{ownerUserId: own}, {workspaceGroupId: {$in: groups}}]}).filter(Boolean);
    const refs = [...groups, ...eventIds];
    const selector = {$or: [
      ...['userId', 'accountUserId', 'ownerUserId', 'creatorUserId', 'organizerUserId', 'recipientUserId', 'senderUserId',
        'targetUserId', 'requesterUserId', 'claimedUserId', 'memberIds', 'participantIds', 'inviterUserId', 'referrerUserId'].map(k => ({[k]: own})),
      ...['workspaceGroupId', 'groupId', 'ownerId', 'eventId', 'sourceId', 'targetId'].map(k => ({[k]: {$in: refs}})),
      {_id: {$in: [...userIds, ...userIds.filter(x => /^[0-9a-f]{24}$/.test(x)).map(x => ObjectId(x)), ...groups]}}
    ]};
    const paymentIds = Q.collection('payments').find(selector, {_id:1}).toArray().map(p => String(p._id));
    const collections = ['users', 'communityGroups', 'activityMembers', 'activityEvents', 'events', 'eventTickets',
      'eventCheckoutBasketItems', 'payments', 'savedPaymentMethods', 'paymentMethodRegistrations', 'eventTicketAudit', 'scheduledMessageTasks',
      'eventWatchSubscriptions', 'activityEventRuntimeItems', 'activitySubEventGroups', 'activitySubEventStageRuntime',
      'activityResources', 'affiliateLinks', 'affiliateRegistrations', 'affiliatePartners', 'affiliatePaymentContributions',
      'integrationTokens', 'integrationParticipantInvites', 'integrationExternalIds',
      'integrationWebhookSubscriptions', 'integrationWebhookDeliveries', 'mcpAuthorizations', 'userSessionStates',
      'userSessionActions', 'userLoginAudits', 'privacyConsents', 'userNotifications', 'notificationOutbox',
      'userFilterPreferences', 'userPageFilterPreferences', 'userExperienceProfiles', 'affinityRecomputeTasks',
      'groupAttention', 'groupInvitations', 'groupMemberships', 'accessGrants', 'chats', 'chatMessages'];
    return Q.snapshotSpecs([...collections.map(collection => ({collection, selector})),
      {collection: 'payment_gateway_operations', selector: {paymentId: {$in: paymentIds}}},
      {collection: 'mcpOAuthClients', selector: {redirectUris: {$in: callbacks}}}]);
  }
  function status() {
    const state = Q.activeState(scenario, false);
    const participants=[...actors,...Q.collection('users').distinct('userId',{name:{$in:freshNames}})];
    Q.printObject({checkpointId, scenario, phase: state?.phase ?? 'not-staged', actors, groups,
      users: Q.collection('users').find({userId: {$in: actors}}, {userId:1,name:1}).toArray(),
      memberships: Q.collection('activityMembers').find({ownerType:'community',ownerId:{$in:groups}}, {ownerId:1,userId:1,role:1,status:1}).toArray(),
      inviteMappings: Q.collection('integrationParticipantInvites').find({ownerUserId:{$in:actors}}, {participantId:1,claimedUserId:1,ownerType:1,eventId:1,reusable:1}).toArray(),
      externalBindings: Q.collection('integrationExternalIds').find({ownerUserId:{$in:actors},resourceType:'participant'}, {externalId:1,internalId:1}).toArray(),
      events: Q.collection('events').find({ownerUserId:{$in:actors}}, {sourceId:1,title:1,workspaceGroupId:1,pricing:1,approvalRequired:1,status:1}).toArray(),
      eventMembers: Q.collection('activityMembers').find({ownerType:'event',ownerId:{$in:Q.collection('events').distinct('sourceId',{ownerUserId:{$in:actors}})}}, {ownerId:1,userId:1,status:1,role:1,requestKind:1,eventVipInvitation:1}).toArray(),
      checkoutItems: Q.collection('eventCheckoutBasketItems').find({userId:{$in:participants}}, {sourceId:1,userId:1,status:1,resultState:1,amount:1}).toArray(),
      payments: Q.collection('payments').find({userId:{$in:participants}}, {sourceId:1,userId:1,status:1,amount:1,provider:1,auditKind:1,fulfillmentKind:1,affiliateOwnerUserId:1,affiliateRevenuePending:1}).toArray(),
      cards: Q.collection('savedPaymentMethods').find({userId:{$in:participants}}, {userId:1,provider:1,status:1,last4:1}).toArray(),
      cardRegistrations: Q.collection('paymentMethodRegistrations').find({userId:{$in:participants}}, {userId:1,provider:1,status:1}).toArray(),
      affiliatePartners: Q.collection('affiliatePartners').find({_id:{$in:actors}}, {totals:1,purchases:1,eventBookings:1}).toArray(),
      affiliateContributions: Q.collection('affiliatePaymentContributions').find({ownerUserId:{$in:actors}}, {ownerUserId:1,gross:1,refunded:1,purchases:1,bookings:1,currency:1}).toArray(),
      affiliateRegistrations: Q.collection('affiliateRegistrations').find({referrerUserId:{$in:actors}}, {referrerUserId:1,registeredAtIso:1}).toArray(),
      affiliateLinkCount: Q.collection('affiliateLinks').countDocuments({_id:{$in:actors}}),
      workspaceProfiles: Q.collection('users').find({accountUserId:{$in:actors}}, {userId:1,accountUserId:1,workspaceGroupId:1}).toArray(),
      freshUsers: Q.collection('users').find({name:{$in:freshNames}}, {userId:1,name:1,accountUserId:1,workspaceGroupId:1,activeWorkspaceGroupId:1,'affiliateRegistration.referrerUserId':1}).toArray(),
      savepoints: Object.keys(state?.savepoints ?? {})});
  }
  if (command === 'status') {status(); return;}
  if (command === 'stage') {
    Q.assertNotStaged(scenario);
    const snapshots = current();
    if (snapshots.some(s => s.documents.length)) Q.fail('Group API namespace or development callback is already in use.');
    const sources = ['af0436815ab38f4864dd1e24','1b1c70be2349b3359a8f6f94','eb1ca0b761885bb0763e2929','9f3b3f085e23af6c89dbc432'].map(x => Q.ensureUser(x));
    const template = Q.collection('communityGroups').findOne({_id:'seed-community-seattle-friends'});
    if (!template) Q.fail('Canonical community template missing.');
    Q.collection(Q.STATE_COLLECTION).insertOne({_id:Q.stateId(scenario),scenario,checkpointId,phase:'staging',
      actors,groups,freshNames,snapshots,savepoints:{},stagedAtIso:Q.nowIso()});
    const fields = ['age','birthday','city','height','physique','languages','horoscope','gender','images',
      'profileDetails','profileStatus','completion','profileFormVersion','locationCoordinates','partitionKey','_class'];
    Q.collection('users').insertMany(sources.map((source,i) => ({
      ...Object.fromEntries(fields.filter(k=>source[k]!==undefined).map(k=>[k,source[k]])),
      _id:ObjectId(actors[i]),userId:actors[i],syncKey:actors[i],name:names[i],initials:'GA',
      email:`${actors[i]}@qa.myscoutee.test`,headline:'',about:'',statusText:'',operator:false,
      activities:{game:0,chats:0,invitations:0,events:0,hosting:0}
    })));
    const now=Q.nowIso();
    Q.collection('communityGroups').insertMany(groups.map((groupId,i)=>({...template,_id:groupId,name:`QA Group API ${i ? 'B' : 'A'}`,
      description:'',visibility:'private',ownerUserId:actors[0],hideMembers:false,
      policy:{workspace:true,enabled:false,requiredFields:[]},pendingMembers:0,moderationPending:0,
      lifecycleStatus:'active',moderationStatus:'accepted',moderationVersion:0,version:0,createdAtIso:now,updatedAtIso:now})));
    Q.collection('activityMembers').insertMany(groups.map(groupId=>({
      _id:`community:${groupId}:${actors[0]}`,syncKey:`community:${groupId}:${actors[0]}`,
      ownerType:'community',ownerId:groupId,userId:actors[0],role:'Admin',status:'accepted',
      requestKind:null,pendingSource:null,invitedByUserId:null,organizerOnly:false,
      actionAtIso:now,createdDate:now,updatedDate:now,createdUser:actors[0],updatedUser:actors[0]
    })));
    Q.collection(Q.STATE_COLLECTION).updateOne({_id:Q.stateId(scenario)},{$set:{phase:'baseline-ready','savepoints.baseline':current()}});
    status();return;
  }
  const state=Q.activeState(scenario,true);
  if (command === 'media-owners') {
    Q.printObject({users:Q.collection('users').find({name:{$in:freshNames},accountUserId:{$exists:false}}).toArray()
      .map(u=>u.userId).filter(u=>/^demo-profile-[a-f0-9-]{36}$/.test(u))});return;
  }
  if (command === 'prepare-attribution-denials') {
    const owner=Q.collection('users').findOne({name:freshNames[0],workspaceGroupId:groups[0]});
    const template=Q.collection('events').findOne({ownerUserId:actors[0],title:'QA Group API free Event'});
    if (!owner||!template) Q.fail('Own fresh Rowan workspace and API Event required.');
    const sourceId='qa-group-api-attribution-private';
    const existing=Q.collection('events').findOne({sourceId});
    if (existing && (existing.ownerUserId!==owner.userId || Q.collection('activityMembers').countDocuments({ownerType:'event',ownerId:sourceId,userId:{$ne:owner.userId}}))) Q.fail('Denial target has unexpected ownership or participants.');
    const member=Q.collection('activityMembers').findOne({ownerType:'event',ownerId:template.sourceId,userId:actors[0]});
    Q.collection('events').replaceOne({sourceId},{...template,_id:ObjectId(id(503)),sourceId,syncKey:sourceId,workspaceGroupId:groups[0],
      ownerUserId:owner.userId,creatorUserId:owner.userId,admins:[owner.userId],title:'QA Group API attribution private',visibility:'Private',
      acceptedMembers:1,acceptedMemberUserIds:[owner.userId],pendingMembers:0,pendingMemberUserIds:[],invitedMemberUserIds:[],pendingRequestMemberUserIds:[],createdUser:owner.userId,updatedUser:owner.userId},{upsert:true});
    const key=`event:${sourceId}:${owner.userId}`;
    Q.collection('activityMembers').replaceOne({_id:key},{...member,_id:key,syncKey:key,ownerId:sourceId,userId:owner.userId,createdUser:owner.userId,updatedUser:owner.userId},{upsert:true});
    Q.printObject({checkpointId,prepared:command,eventId:sourceId,ownerUserId:owner.userId,fixtureOnly:true});return;
  }
  if (command === 'prepare-private-controls') {
    const template=Q.collection('events').findOne({ownerUserId:actors[0],title:'QA Group API free Event'});
    if (!template) Q.fail('Own API-created free Event missing.');
    const member=Q.collection('activityMembers').findOne({ownerType:'event',ownerId:template.sourceId,userId:actors[0]});
    const controls=groups.map((group,index)=>{
      const owner=Q.collection('users').findOne({accountUserId:actors[2],workspaceGroupId:group});
      if (!owner) Q.fail('Claimed Milo workspace profile missing.');
      return {sourceId:`qa-group-api-private-${index ? 'b' : 'a'}`,group,owner:owner.userId,index};
    });
    if (Q.collection('events').countDocuments({sourceId:{$in:controls.map(c=>c.sourceId)}})) Q.fail('Private controls already staged.');
    controls.forEach(c=>{
      Q.collection('events').insertOne({...template,_id:ObjectId(id(501+c.index)),syncKey:c.sourceId,sourceId:c.sourceId,
        ownerUserId:c.owner,creatorUserId:c.owner,admins:[c.owner],workspaceGroupId:c.group,
        title:`QA Group API private ${c.index ? 'B' : 'A'}`,visibility:'Private',
        acceptedMembers:1,acceptedMemberUserIds:[c.owner],pendingMembers:0,pendingMemberUserIds:[],invitedMemberUserIds:[],pendingRequestMemberUserIds:[],createdUser:c.owner,updatedUser:c.owner});
      const key=`event:${c.sourceId}:${c.owner}`;
      Q.collection('activityMembers').insertOne({...member,_id:key,syncKey:key,ownerId:c.sourceId,userId:c.owner,createdUser:c.owner,updatedUser:c.owner});
    });
    Q.printObject({checkpointId,prepared:command,controls,baseEventId:template.sourceId,fixtureOnly:true});return;
  }
  if (command === 'prepare-paid-event') {
    const event=Q.collection('events').findOne({ownerUserId:actors[0],title:'QA Group API paid Event'});
    if (!event) Q.fail('API-created paid Event control missing.');
    Q.collection('events').updateMany({sourceId:event.sourceId},{$set:{approvalRequired:true,
      pricing:{enabled:true,mode:'fixed',basePrice:10,currency:'EUR',taxMode:'included',chargeType:'per_attendee',
        quantityRulesEnabled:false,quantityRules:[],rounding:'none',demandRulesEnabled:false,demandRules:[],timeRulesEnabled:false,timeRules:[],
        cancellationPolicy:{enabled:false,rules:[]},slotPricingEnabled:false,slotOverrides:[],audience:{enabled:true,memberPrice:10,vipPrice:5,promoCodes:[]}}
    }});
    Q.printObject({checkpointId,prepared:command,eventId:event.sourceId,basePrice:10,vipPrice:5,approvalRequired:true,fixtureOnly:true});return;
  }
  if (command === 'remove-issuer-admin' || command === 'restore-issuer-admin') {
    Q.collection('activityMembers').updateOne({ownerType:'community',ownerId:groups[1],userId:actors[0]},{$set:{role:command==='remove-issuer-admin'?'Member':'Admin'}});
    Q.printObject({checkpointId,prepared:command,group:groups[1],fixtureOnly:true});return;
  }
  if (command === 'restore-maya-location') {
    const original = state.savepoints.baseline.find(s=>s.collection==='users').documents.find(u=>u.userId===actors[1]);
    if (!original?.locationCoordinates) Q.fail('Original Maya location missing.');
    Q.collection('users').updateMany({$or:[{userId:actors[1]},{accountUserId:actors[1]}]},{$set:{locationCoordinates:original.locationCoordinates,partitionKey:original.partitionKey}});
    Q.printObject({checkpointId,restored:'Maya fixture location after stale-directory preparation',fixtureOnly:true});return;
  }
  if (['prepare-entry-missing','prepare-entry-invalid','prepare-entry-valid'].includes(command)) {
    if (Q.collection('activityMembers').countDocuments({ownerType:'community',ownerId:groups[0],userId:actors[3],status:'accepted'})) Q.fail('Entry control must run before Nia claims the invitation.');
    const update = command === 'prepare-entry-missing'
      ? {$unset:{locationCoordinates:'',partitionKey:''}}
      : {$set:{locationCoordinates:command === 'prepare-entry-invalid'
        ? {latitude:999,longitude:999} : {latitude:47.4979,longitude:19.0402}},$unset:{partitionKey:''}};
    Q.collection('users').updateOne({userId:actors[3]},update);
    const now=Q.nowIso();
    Q.collection('activityMembers').updateOne({_id:`community:${groups[0]}:${actors[3]}`},{$setOnInsert:{
      syncKey:`community:${groups[0]}:${actors[3]}`,ownerType:'community',ownerId:groups[0],userId:actors[3],
      role:'Member',status:'pending',requestKind:'join',pendingSource:'member',organizerOnly:false,
      actionAtIso:now,createdDate:now,updatedDate:now,createdUser:actors[3],updatedUser:actors[3]
    }},{upsert:true});
    Q.collection('communityGroups').updateOne({_id:groups[0]},{$set:{pendingMembers:Q.collection('activityMembers').countDocuments({ownerType:'community',ownerId:groups[0],status:'pending'})}});
    Q.printObject({checkpointId,prepared:command,actor:actors[3],fixtureOnly:true});return;
  }
  if (command === 'reset') {
    const owned=current();
    Q.restoreSnapshots(owned.map(s=>({...s,documents:[]})));
    Q.restoreSnapshots(state.snapshots);
    for (const s of state.snapshots) if(!Q.sameJson(Q.collection(s.collection).find(s.selector).toArray(),s.documents)) Q.fail(`Restore mismatch: ${s.collection}`);
    for (const s of owned) if(Q.collection(s.collection).countDocuments(s.selector)) Q.fail(`Owned records remain: ${s.collection}`);
    Q.collection(Q.STATE_COLLECTION).deleteOne({_id:Q.stateId(scenario)});
    Q.printObject({checkpointId,scenario,phase:'reset-complete',exactRestore:true});return;
  }
  Q.fail(`Unsupported Group API command: ${command}`);
})();
