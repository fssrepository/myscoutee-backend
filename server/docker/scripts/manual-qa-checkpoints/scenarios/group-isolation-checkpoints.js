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
  const actors = [1, 2, 3, 4].map(id);
  const profiles = [11, 12, 21, 22].map(id);
  const userIds = [...actors, ...profiles];
  const groups = ['qa-isolation-a', 'qa-isolation-b'];
  // Dedicated identities never overlap retained campaigns. Snapshot/restore is
  // constrained to these owners and their resources; global configuration is read only.
  function specs() {
    const own = { $in: userIds };
    const eventIds = Q.collection('activityEvents').distinct('sourceId', { $or: [
      {ownerUserId: own}, {creatorUserId: own}, {organizerUserId: own}, {workspaceGroupId: {$in: groups}}
    ]}).filter(Boolean);
    const chatIds = Q.collection('chats').distinct('id', {$or: [{ownerUserId: own}, {memberIds: own}]}).filter(Boolean);
    const identityKeys = ['userId', 'accountUserId', 'ownerUserId', 'creatorUserId', 'organizerUserId',
      'requesterUserId', 'recipientUserId', 'senderUserId', 'targetUserId', 'fromUserId', 'toUserId',
      'raterUserId', 'ratedUserId', 'memberIds', 'participantIds'];
    const references = [...groups, ...eventIds, ...chatIds];
    const selector = {$or: [
      ...identityKeys.map(key => ({[key]: own})),
      ...['workspaceGroupId', 'groupId', 'ownerId', 'eventId', 'sourceId', 'chatId'].map(key => ({[key]: {$in: references}})),
      {_id: {$in: [...userIds, ...groups]}}
    ]};
    const collections = ['users', 'communityGroups', 'activityMembers', 'activityEvents', 'chats', 'chatMessages',
      'userRates', 'userFilterPreferences', 'userPageFilterPreferences', 'photoFeedPosts', 'photoFeedViews',
      'userNotifications', 'notificationOutbox', 'userContacts', 'contactChatAccess', 'userSessionStates',
      'userSessionActions', 'contentModerationItems', 'contentModerationState'];
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
    const fields = ['age','birthday','city','height','physique','languages','horoscope','gender','images',
      'profileDetails','profileStatus','completion','profileFormVersion','locationCoordinates','partitionKey','_class'];
    const names = ['Isolation Alex','Isolation Eszter','Isolation Maya','Isolation Milo'];
    function profile(source, userId, name, accountUserId, groupId) {
      const personal = Object.fromEntries(fields.filter(k=>source[k]!==undefined).map(k=>[k,source[k]]));
      return {...personal,_id:userId,userId,syncKey:userId,name,initials:name.split(' ').map(x=>x[0]).join(''),
        email:`${userId}@qa.myscoutee.test`,headline:'',about:'',statusText:'',operator:false,
        activities:{game:0,chats:0,invitations:0,events:0,hosting:0},
        ...(accountUserId ? {accountUserId,workspaceGroupId:groupId} : {})};
    }
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
  if (command === 'reset') {
    // Delete only owned current rows (including IDs created since the snapshot),
    // then restore the exact pre-stage documents.
    Q.restoreSnapshots(current().map(s=>({...s,documents:[]})));
    Q.restoreSnapshots(state.snapshots);verify(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({_id:state._id});
    Q.printObject({checkpointId,phase:'reset-complete',exactRestore:true});return;
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
