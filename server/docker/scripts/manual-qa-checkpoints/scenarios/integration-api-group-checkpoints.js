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
        'targetUserId', 'requesterUserId', 'claimedUserId', 'memberIds', 'participantIds', 'inviterUserId'].map(k => ({[k]: own})),
      ...['workspaceGroupId', 'groupId', 'ownerId', 'eventId', 'sourceId'].map(k => ({[k]: {$in: refs}})),
      {_id: {$in: [...userIds, ...userIds.filter(x => /^[0-9a-f]{24}$/.test(x)).map(x => ObjectId(x)), ...groups]}}
    ]};
    const collections = ['users', 'communityGroups', 'activityMembers', 'activityEvents', 'events', 'eventTickets',
      'eventWatchSubscriptions', 'activityEventRuntimeItems', 'activitySubEventGroups', 'activitySubEventStageRuntime',
      'activityResources', 'integrationTokens', 'integrationParticipantInvites', 'integrationExternalIds',
      'integrationWebhookSubscriptions', 'integrationWebhookDeliveries', 'mcpAuthorizations', 'userSessionStates',
      'userSessionActions', 'userLoginAudits', 'privacyConsents', 'userNotifications', 'notificationOutbox',
      'userFilterPreferences', 'userPageFilterPreferences', 'userExperienceProfiles', 'affinityRecomputeTasks',
      'groupAttention', 'groupInvitations', 'groupMemberships', 'accessGrants', 'chats', 'chatMessages'];
    return Q.snapshotSpecs([...collections.map(collection => ({collection, selector})),
      {collection: 'mcpOAuthClients', selector: {redirectUris: {$in: callbacks}}}]);
  }
  function status() {
    const state = Q.activeState(scenario, false);
    Q.printObject({checkpointId, scenario, phase: state?.phase ?? 'not-staged', actors, groups,
      users: Q.collection('users').find({userId: {$in: actors}}, {userId:1,name:1}).toArray(),
      memberships: Q.collection('activityMembers').find({ownerType:'community',ownerId:{$in:groups}}, {ownerId:1,userId:1,role:1,status:1}).toArray(),
      inviteMappings: Q.collection('integrationParticipantInvites').find({ownerUserId:{$in:actors}}, {participantId:1,claimedUserId:1,ownerType:1,eventId:1}).toArray(),
      workspaceProfiles: Q.collection('users').find({accountUserId:{$in:actors}}, {userId:1,accountUserId:1,workspaceGroupId:1}).toArray(),
      freshUsers: Q.collection('users').find({name:{$in:freshNames}}, {userId:1,name:1,accountUserId:1,workspaceGroupId:1,activeWorkspaceGroupId:1,affiliateReferrerUserId:1}).toArray(),
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
  if (['prepare-entry-missing','prepare-entry-invalid','prepare-entry-valid'].includes(command)) {
    if (Q.collection('activityMembers').countDocuments({ownerType:'community',ownerId:groups[0],userId:actors[1]})) Q.fail('Entry control must run before Maya claims the invitation.');
    const update = command === 'prepare-entry-missing'
      ? {$unset:{locationCoordinates:'',partitionKey:''}}
      : {$set:{locationCoordinates:command === 'prepare-entry-invalid'
        ? {latitude:999,longitude:999} : {latitude:47.4979,longitude:19.0402}},$unset:{partitionKey:''}};
    Q.collection('users').updateOne({userId:actors[1]},update);
    Q.printObject({checkpointId,prepared:command,actor:actors[1],fixtureOnly:true});return;
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
