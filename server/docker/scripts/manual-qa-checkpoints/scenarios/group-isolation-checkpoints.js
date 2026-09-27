/* global ManualQa, process, db */
(() => {
  'use strict';
  const Q = ManualQa;
  const scenario = 'group-isolation';
  const checkpointId = 'GROUP-ISOLATION-001';
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== checkpointId) Q.fail('Wrong Isolation checkpoint.');
  const id = n => `f0280926${String(n).padStart(16, '0')}`;
  const postId = n => `f0280926-0000-4000-8000-${String(n).padStart(12, '0')}`;
  const actors = [1, 2, 3, 4].map(id);
  const profiles = [11, 12, 21, 22].map(id);
  const controlUserIds = [5, 6, 13, 14, 24].map(id);
  const userIds = [...actors, ...profiles, ...controlUserIds];
  const groups = ['qa-isolation-a', 'qa-isolation-b'];
  // Dedicated identities never overlap retained campaigns. Snapshot/restore is
  // constrained to these owners and their resources; global configuration is read only.
  function specs() {
    const own = { $in: userIds };
    const eventIds = Q.collection('events').distinct('sourceId', { $or: [
      {ownerUserId: own}, {creatorUserId: own}, {organizerUserId: own}, {workspaceGroupId: {$in: groups}}
    ]}).filter(Boolean);
    const chatIds = Q.collection('chats').distinct('id', {$or: [{ownerUserId: own}, {memberIds: own}]}).filter(Boolean);
    const identityKeys = ['userId', 'accountUserId', 'ownerUserId', 'creatorUserId', 'organizerUserId',
      'requesterUserId', 'recipientUserId', 'senderUserId', 'targetUserId', 'fromUserId', 'toUserId',
      'raterUserId', 'ratedUserId', 'relatedUserId', 'leftUserId', 'rightUserId', 'memberIds', 'participantIds'];
    const references = [...groups, ...eventIds, ...chatIds];
    const selector = {$or: [
      ...identityKeys.map(key => ({[key]: own})),
      ...['workspaceGroupId', 'groupId', 'ownerId', 'eventId', 'sourceId', 'chatId'].map(key => ({[key]: {$in: references}})),
      {_id: {$in: [...userIds, ...groups]}}
    ]};
    const collections = ['users', 'communityGroups', 'activityMembers', 'activityEvents', 'chats', 'chatMessages',
      'userRates', 'userFilterPreferences', 'userPageFilterPreferences', 'photoFeedPosts', 'photoFeedViews',
      'userNotifications', 'notificationOutbox', 'userContacts', 'contactChatAccess', 'userSessionStates',
      'userSessionActions', 'contentModerationItems', 'contentModerationState', 'privacyConsents',
      'userLoginAudits', 'navigatorContacts', 'userFriendships', 'userAffinityEdges', 'userExperienceProfiles',
      'events', 'eventTickets', 'eventWatchSubscriptions', 'groupAttention', 'groupInvitations',
      'groupMemberships', 'accessGrants', 'activityEventRuntimeItems', 'activitySubEventGroups',
      'activitySubEventStageRuntime', 'activityResources', 'affinityRecomputeTasks'];
    return collections.map(collection => ({collection, selector}));
  }
  function current() { return Q.snapshotSpecs(specs()); }
  function verify(expected) {
    for (const s of expected) {
      const actual = Q.collection(s.collection).find(s.selector).sort({_id: 1}).toArray();
      const wanted = [...s.documents].sort((a,b) => String(a._id).localeCompare(String(b._id)));
      actual.sort((a,b) => String(a._id).localeCompare(String(b._id)));
      if (!Q.sameJson(actual, wanted)) Q.fail(`Snapshot mismatch: ${s.collection}`);
    }
  }
  function status() {
    const state = Q.activeState(scenario, false);
    Q.printObject({checkpointId, phase: state?.phase ?? 'not-staged', actors,
      profiles: Q.collection('users').find({userId: {$in: userIds}}, {userId:1,name:1,accountUserId:1,workspaceGroupId:1,activeWorkspaceGroupId:1}).toArray(),
      groups: Q.collection('communityGroups').find({_id: {$in: groups}}, {name:1,lifecycleStatus:1}).toArray(),
      memberships: Q.collection('activityMembers').find({ownerType:'community',ownerId:{$in:groups}}, {ownerId:1,userId:1,role:1,status:1}).toArray(),
      savepoints: Object.keys(state?.savepoints ?? {})});
  }
    const fields = ['age','birthday','city','height','physique','languages','horoscope','gender','images',
      'profileDetails','profileStatus','completion','profileFormVersion','locationCoordinates','partitionKey','_class'];
    function profile(source, userId, name, accountUserId, groupId) {
      const personal = Object.fromEntries(fields.filter(k=>source[k]!==undefined).map(k=>[k,source[k]]));
      return {...personal,_id:ObjectId(userId),userId,syncKey:userId,name,initials:name.split(' ').map(x=>x[0]).join(''),
        email:`${userId}@qa.myscoutee.test`,headline:'',about:'',statusText:'',operator:false,
        activities:{game:0,chats:0,invitations:0,events:0,hosting:0},
        ...(accountUserId ? {accountUserId,workspaceGroupId:groupId} : {})};
    }
  if (command === 'status') { status(); return; }
  if (command === 'stage') {
    Q.assertNotStaged(scenario);
    const baseline = current();
    if (baseline.some(s => s.documents.length)) Q.fail('Isolation namespace already contains data; refusing to overwrite.');
    const sourceIds = ['af0436815ab38f4864dd1e24','9f3b3f085e23af6c89dbc432','1b1c70be2349b3359a8f6f94','eb1ca0b761885bb0763e2929'];
    const sources = sourceIds.map(sourceId => Q.ensureUser(sourceId));
    const groupTemplate = Q.collection('communityGroups').findOne({_id:'seed-community-seattle-friends'});
    if (!groupTemplate) Q.fail('Canonical community template missing.');
    Q.collection(Q.STATE_COLLECTION).insertOne({_id:Q.stateId(scenario),scenario,checkpointId,
      phase:'staging',actors,userIds,groups,snapshots:baseline,stagedAtIso:Q.nowIso(),savepoints:{}});
    const names = ['Isolation Alex','Isolation Eszter','Isolation Maya','Isolation Milo'];
    Q.collection('users').insertMany(sources.map((source,i)=>profile(source,actors[i],names[i])));
    const links = [[0,0,11],[1,0,12],[0,1,21],[3,1,22]];
    Q.collection('users').insertMany(links.map(([actor,group,n])=>profile(sources[actor],id(n),names[actor],actors[actor],groups[group])));
    const now=Q.nowIso();
    Q.collection('communityGroups').insertMany(groups.map((groupId,i)=>({...groupTemplate,_id:groupId,
      name:`QA Isolation ${i===0?'A':'B'}`,description:'',visibility:'private',ownerUserId:actors[0],
      hideMembers:false,policy:{workspace:true,enabled:false,requiredFields:[]},pendingMembers:0,
      moderationPending:0,lifecycleStatus:'active',moderationStatus:'accepted',moderationVersion:0,
      version:0,createdAtIso:now,updatedAtIso:now})));
    Q.collection('activityMembers').insertMany(links.map(([actor,group])=>({
      _id:`community:${groups[group]}:${actors[actor]}`,syncKey:`community:${groups[group]}:${actors[actor]}`,
      ownerType:'community',ownerId:groups[group],userId:actors[actor],role:actor===3?'Member':'Admin',
      status:'accepted',requestKind:null,pendingSource:null,invitedByUserId:null,organizerOnly:false,
      metWhere:`QA Isolation ${group===0?'A':'B'}`,metAtIso:now,actionAtIso:now,createdDate:now,updatedDate:now,
      createdUser:actors[0],updatedUser:actors[0]})));
    const staged=current();
    Q.collection(Q.STATE_COLLECTION).updateOne({_id:Q.stateId(scenario)},{$set:{phase:'baseline-ready','savepoints.baseline':staged}});
    verify(staged);status();return;
  }
  const state=Q.activeState(scenario,true);
  if (command === 'prepare-notification-controls') {
    const source=Q.collection('events').findOne({workspaceGroupId:groups[0],ownerUserId:id(11)});
    const notification=Q.collection('userNotifications').findOne({recipientUserId:id(1),kind:'event-invitation-accepted',sourceId:source?.sourceId});
    if (!source || !notification) Q.fail('Own A Event and accepted-invitation notification required.');
    const target='qa-isolation-same-name-b';
    if (Q.collection('events').countDocuments({sourceId:target})) Q.fail('Notification controls already prepared.');
    Q.collection('events').insertOne({...source,_id:ObjectId(id(402)),syncKey:target,sourceId:target,
      workspaceGroupId:groups[1],ownerUserId:id(21),creatorUserId:id(21),admins:[id(21)],
      acceptedMembers:1,acceptedMemberUserIds:[id(21)],createdUser:id(21),updatedUser:id(21)});
    const member=Q.collection('activityMembers').findOne({ownerType:'event',ownerId:source.sourceId,userId:id(11)});
    const memberId=`event:${target}:${id(21)}`;
    Q.collection('activityMembers').insertOne({...member,_id:memberId,syncKey:memberId,ownerId:target,userId:id(21)});
    const now=Q.nowIso(),notificationId=id(502);
    Q.collection('userNotifications').insertOne({...notification,_id:ObjectId(notificationId),syncKey:notificationId,
      outboxId:null,sourceId:target,senderUserId:id(22),actionPath:`/game?workspaceGroupId=${groups[1]}`,
      payload:{...notification.payload,eventId:target,entityId:target,workspaceGroupId:groups[1],
        workspaceGroupName:'QA Isolation B',memberUserId:id(22),memberName:'Isolation Milo',
        url:`/game?workspaceGroupId=${groups[1]}`,tag:`event-invitation-accepted-${target}`},
      readAtIso:null,createdDate:now,updatedDate:now,revision:1});
    Q.collection('users').updateOne({userId:id(1)},{$inc:{'activities.notifications':1}});
    Q.collection('users').updateOne({userId:id(21)},{$inc:{'activities.hosting':1,'activities.event.hosting':1,'activities.event.all':1}});
    Q.printObject({checkpointId,prepared:'same-name-notification-targets',a:source.sourceId,b:target,title:source.title});return;
  }
  if (command === 'reset') {
    // Delete only owned current rows (including IDs created since the snapshot),
    // then restore the exact pre-stage documents.
    Q.restoreSnapshots(current().map(s=>({...s,documents:[]})));
    Q.restoreSnapshots(state.snapshots);verify(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({_id:state._id});
    Q.printObject({checkpointId,phase:'reset-complete',exactRestore:true});return;
  }
  if (command === 'prepare-invite-control') {
    const rateId = ObjectId(id(101));
    if (Q.collection('userRates').countDocuments({_id:rateId})) Q.fail('Invite control already prepared.');
    Q.collection('userRates').insertOne({_id:rateId,syncKey:id(101),mode:'single',ownerUserId:id(11),relatedUserId:id(12),
      scoreGiven:8,scoreReceived:8,met:true,mutuallyRated:true,eventName:'QA Isolation prior meeting',
      affinityScore:0.8,ownerLocation:Q.ensureUser(id(11)).locationCoordinates,
      createdDate:Q.nowIso(),createdUser:id(11),updatedDate:Q.nowIso(),updatedUser:id(11)});
    Q.printObject({checkpointId,inviteControl:rateId,owner:id(11),peer:id(12)});return;
  }
  if (command === 'prepare-home-controls') {
    if (Q.collection('users').countDocuments({userId:{$in:controlUserIds}})) Q.fail('Home controls already staged.');
    // Retained checkpoints predate the fixture ID fix. Users uses the same
    // Spring @Id conversion as UserRate; keep canonical identity fields strings.
    for (const user of Q.collection('users').find({userId:{$in:userIds},_id:{$type:'string'}}).toArray()) {
      Q.collection('users').deleteOne({_id:user._id});
      Q.collection('users').insertOne({...user,_id:ObjectId(user.userId)});
    }
    // Match UserRate's Mongo @Id mapping: 24-hex IDs are BSON ObjectIds.
    const legacyInvite=Q.collection('userRates').findOne({_id:id(101)});
    if (legacyInvite) {
      Q.collection('userRates').deleteOne({_id:id(101)});
      Q.collection('userRates').insertOne({...legacyInvite,_id:ObjectId(id(101))});
    }
    const source=Q.ensureUser(id(12));
    const records=[profile(source,id(5),'Isolation Nia'),profile(source,id(6),'Isolation Lea'),
      profile(source,id(13),'Isolation Nia',id(5),groups[0]),
      profile(source,id(14),'Isolation Lea',id(6),groups[0]),
      profile(source,id(24),'Isolation Lea',id(6),groups[1])];
    Q.collection('users').insertMany(records);
    Q.collection('users').updateMany({userId:{$in:[id(1),id(11),id(21)]}},{$set:{profileStatus:'public'}});
    const now=Q.nowIso();
    Q.collection('activityMembers').insertMany([[5,0],[6,0],[6,1]].map(([actor,g])=>({
      _id:`community:${groups[g]}:${id(actor)}`,syncKey:`community:${groups[g]}:${id(actor)}`,
      ownerType:'community',ownerId:groups[g],userId:id(actor),role:'Member',status:'accepted',
      createdDate:now,updatedDate:now,createdUser:id(1),updatedUser:id(1)})));
    const rate=(n,owner,target,second,context,given,received)=>({_id:ObjectId(id(n)),syncKey:id(n),
      mode:second?'pair':'single',ownerUserId:id(owner),relatedUserId:id(target),
      ...(second?{secondaryRelatedUserId:id(second)}:{}),socialContext:context,
      scoreGiven:given,scoreReceived:received,met:false,mutuallyRated:given>0&&received>0,
      bridgeUserId:id(owner),bridgeCount:1,affinityScore:0.7,eventName:'',
      ownerLocation:Q.ensureUser(id(owner)).locationCoordinates,
      createdDate:now,updatedDate:now,createdUser:id(owner),updatedUser:id(owner)});
    Q.collection('userRates').insertMany([
      rate(201,11,14,null,'friends-in-common',7,0),rate(202,11,12,14,'separated-friends',6,0),
      rate(203,1,3,null,'friends-in-common',5,0),rate(204,21,22,null,'friends-in-common',9,0),
      rate(205,21,22,24,'separated-friends',8,0),rate(206,21,24,null,'friends-in-common',0,6)]);
    const eventTemplate=Q.collection('events').findOne({workspaceGroupId:groups[0],ownerUserId:id(11)});
    if (!eventTemplate) Q.fail('Own completed Event baseline missing.');
    const followEventId='qa-isolation-follow-a';
    Q.collection('events').insertOne({...eventTemplate,_id:ObjectId(id(401)),syncKey:followEventId,sourceId:followEventId,
      ownerUserId:id(12),creatorUserId:id(12),creatorName:source.name,creatorInitials:source.initials,
      creatorGender:source.gender,admins:[id(12)],title:'QA Isolation Following A',visibility:'Public',
      acceptedMembers:1,acceptedMemberUserIds:[id(12)],createdUser:id(12),updatedUser:id(12)});
    const memberTemplate=Q.collection('activityMembers').findOne({ownerType:'event',ownerId:eventTemplate.sourceId,userId:id(11)});
    if (!memberTemplate) Q.fail('Own completed Event creator membership missing.');
    const memberId=`event:${followEventId}:${id(12)}`;
    Q.collection('activityMembers').insertOne({...memberTemplate,_id:memberId,syncKey:memberId,
      ownerId:followEventId,userId:id(12),createdUser:id(12),updatedUser:id(12)});
    Q.collection('users').updateOne({userId:id(12)},{$inc:{'activities.hosting':1,'activities.event.hosting':1,'activities.event.all':1}});
    Q.collection('photoFeedPosts').insertMany([[301,12,groups[0]],[302,22,groups[1]],[303,3,null]].map(([n,creator,group])=>{
      const u=Q.ensureUser(id(creator)),url=u.images[0];
      return {_id:postId(n),creatorUserId:u.userId,creatorName:u.name,creatorAvatarUrl:url,
        createdAtIso:now,imageUrls:[url],imageDetails:n===301?{[url]:{caption:'',location:'',event:{
          id:followEventId,title:'QA Isolation Following A',organizerId:id(12),organizerName:u.name,location:''}}}:{},
        locationGeo:{type:'Point',coordinates:[u.locationCoordinates.longitude,u.locationCoordinates.latitude]},
        moderationStatus:'accepted',workspaceGroupId:group};
    }));
    Q.printObject({checkpointId,prepared:'home-social-feed',homeCandidate:id(13),socialTotals:{base:1,a:2,b:3}});return;
  }
  const name=Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID);
  if (!/^[a-z0-9-]+$/.test(name)) Q.fail('Use a named Isolation savepoint.');
  if (command==='capture') {
    if (state.savepoints?.[name]) Q.fail('Savepoints are immutable; choose another name.');
    Q.collection(Q.STATE_COLLECTION).updateOne({_id:state._id},{$set:{[`savepoints.${name}`]:current()}});
  } else if (command==='restore') {
    if (!state.savepoints?.[name]) Q.fail('Missing own savepoint.');
    Q.restoreSnapshots(current().map(s=>({...s,documents:[]})));
    Q.restoreSnapshots(state.savepoints[name]);verify(state.savepoints[name]);
  } else if (command==='verify-savepoint') {
    if (!state.savepoints?.[name]) Q.fail('Missing own savepoint.');
    verify(state.savepoints[name]);
  } else Q.fail(`Unsupported Isolation command: ${command}`);
  Q.printObject({checkpointId,command,savepoint:name,verified:command!=='capture'});
})();
