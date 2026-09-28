/* global ManualQa, process */
(() => {
  const Q = ManualQa;
  const scenario = 'deploy-external-config';
  const checkpointId = 'DEPLOY-EXTERNAL-CONFIG-001';
  Q.assertDeploymentSafety();
  if (process.env.MANUAL_QA_CHECKPOINT_ID !== checkpointId) Q.fail('Wrong configured-deployment checkpoint.');
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const stableId = email => {
    const bytes = require('crypto').createHash('md5').update(email).digest();
    bytes[6] = (bytes[6] & 15) | 48; bytes[8] = (bytes[8] & 63) | 128;
    const hex = bytes.toString('hex');
    return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-');
  };
  const actors = ['no', 'yes', 'private', 'outsider'].map(key => {
    const email = `deploy-external-${key}@qa.myscoutee.test`;
    return {key, email, userId: stableId(email), uid: `deploy-external-${key}-v1`, name: `QA Deploy ${key}`};
  });
  const accountIds = actors.map(actor => actor.userId);
  const collections = ['users', 'userFilterPreferences', 'userPageFilterPreferences',
    'userSessionStates', 'userSessionActions', 'userLoginAudits', 'privacyConsents',
    'userNotifications', 'notificationOutbox', 'userExperienceProfiles', 'userAffinityEdges',
    'affinityRecomputeTasks', 'integrationTokens', 'mcpAuthorizations', 'deviceRegistrations'];
  const profileIds = () => [...new Set([...accountIds, ...Q.collection('users').find({
    $or: [{userId: {$in: accountIds}}, {accountUserId: {$in: accountIds}}, {email: {$in: actors.map(a => a.email)}}]
  }).toArray().flatMap(row => [row.userId, row._id]).filter(Boolean)])];
  const current = () => {
    const ids = profileIds();
    const selector = {$or: ['_id', 'userId', 'accountUserId', 'ownerUserId', 'recipientUserId', 'senderUserId']
      .map(field => ({[field]: {$in: ids}}))};
    return Q.snapshotSpecs(collections.map(collection => ({collection, selector})));
  };
  const config = () => Q.collection('deploymentConfigurations').findOne({_id: 'deployment-configuration'});
  const state = Q.activeState(scenario, false);
  const status = () => ({checkpointId, scenario, phase: Q.activeState(scenario, false)?.phase ?? 'not-staged',
    checkedAt: Q.nowIso(), actors, firebaseActive: config()?.firebase?.active === true,
    accounts: actors.map(actor => ({key: actor.key,
      present: Q.collection('users').countDocuments({userId: actor.userId}) > 0}))});
  if (command === 'status') { Q.printObject(status()); return; }
  if (command === 'stage') {
    Q.assertNotStaged(scenario);
    const snapshots = current();
    if (snapshots.some(snapshot => snapshot.documents.length)) Q.fail('Deployment actor namespace already in use.');
    Q.collection(Q.STATE_COLLECTION).insertOne({_id: Q.stateId(scenario), scenario, checkpointId,
      phase: 'baseline-ready', stagedAtIso: Q.nowIso(), actors, snapshots,
      configurationBefore: config(), captures: []});
    Q.printObject(status()); return;
  }
  if (!state) Q.fail('Stage the independent deployment checkpoint first.');
  if (command === 'capture-api-key') {
    const id = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID);
    const token = Q.collection('integrationTokens').findOne({_id: id});
    if (state.apiKey || !token || token.name !== 'DEPLOY-EXTERNAL-CONFIG-001 logout control'
        || new Date(token.createdAtIso) < new Date(state.stagedAtIso)) Q.fail('Expected this run\'s new logout control key.');
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {apiKey: {id, owner: token.ownerUserId}}});
    Q.printObject({checkpointId, phase: 'api-key-captured'}); return;
  }
  if (command === 'restore-api-key') {
    if (!state.apiKey) Q.fail('No retained API key.');
    const selector = {_id: state.apiKey.id, ownerUserId: state.apiKey.owner};
    const token = Q.collection('integrationTokens').findOne(selector);
    if (token && !token.revokedAtIso) Q.fail('Revoke the API key normally first.');
    Q.collection('integrationTokens').deleteOne(selector);
    if (Q.collection('integrationTokens').countDocuments(selector)) Q.fail('API key cleanup incomplete.');
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {apiKey: ''}});
    Q.printObject({checkpointId, phase: 'api-key-restored'}); return;
  }
  if (command === 'expire-oauth-code') {
    const hash = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID);
    const ids = (state.oauthClients || (state.oauthClient ? [state.oauthClient] : [])).map(row => row.id);
    if (!/^[A-Za-z0-9_-]{43}$/.test(hash) || !ids.length) Q.fail('A captured client and exact code digest are required.');
    const result = Q.collection('mcpAuthorizations').updateOne({_id: hash, kind: 'code', clientId: {$in: ids}},
      {$set: {expiresAt: new Date(Date.now() - 1000)}});
    if (result.matchedCount !== 1) Q.fail('Owned authorization code missing.');
    Q.printObject({checkpointId, phase: 'owned-code-expired', preparationOnly: true}); return;
  }
  if (command === 'capture-oauth-client') {
    const id = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID);
    const client = Q.collection('mcpOAuthClients').findOne({_id: id});
    const retained = state.oauthClients || (state.oauthClient ? [state.oauthClient] : []);
    if (!client || client.name !== 'MCP Inspector' || retained.some(row => row.id === id)
        || new Date(client.createdAt) < new Date(state.stagedAtIso)) {
      Q.fail('Provide this run\'s newly registered Inspector client.');
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {
      $set: {oauthClients: [...retained, {id, client}]}, $unset: {oauthClient: ''}});
    Q.printObject({checkpointId, phase: 'oauth-client-captured', clientId: id}); return;
  }
  if (command === 'restore-oauth-client') {
    const ids = (state.oauthClients || (state.oauthClient ? [state.oauthClient] : [])).map(row => row.id);
    if (!ids.length) Q.fail('No retained Inspector client.');
    if (Q.collection('integrationTokens').countDocuments({oauthClientId: {$in: ids},
      $or: [{revokedAtIso: null}, {revokedAtIso: ''}]})) Q.fail('Revoke this run\'s OAuth permission through the application first.');
    const specs = [{collection: 'mcpOAuthClients', selector: {_id: {$in: ids}}},
      {collection: 'mcpAuthorizations', selector: {clientId: {$in: ids}}},
      {collection: 'integrationTokens', selector: {oauthClientId: {$in: ids}}}];
    Q.restoreSnapshots(specs.map(spec => ({...spec, documents: []})));
    if (specs.some(spec => Q.collection(spec.collection).countDocuments(spec.selector))) Q.fail('OAuth cleanup incomplete.');
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {oauthClient: '', oauthClients: ''}});
    Q.printObject({checkpointId, phase: 'oauth-client-restored', exactScope: true}); return;
  }
  const privateEventId = 'qa-deploy-private-invitation-v1';
  const privateOwner = actors.find(actor => actor.key === 'private').userId;
  const privateSpecs = () => [
    {collection: 'users', selector: {userId: privateOwner}},
    ...['events', 'activityMembers', 'chats', 'chatMessages', 'activityResources',
      'eventTickets', 'userNotifications', 'notificationOutbox', 'accessGrants'].map(collection => ({collection,
      selector: {$or: ['sourceId', 'ownerId', 'eventId', 'chatId', 'id', '_id']
        .map(key => ({[key]: privateEventId}))}}))
  ];
  if (command === 'prepare-private-invitation') {
    if (state.privateInvitation) Q.fail('Restore the retained private invitation first.');
    const ids = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID).split(',');
    if (ids.length !== 2 || ids[0] === ids[1]) Q.fail('Provide pending recipient,unrelated account IDs.');
    const accounts = ids.map(userId => Q.collection('users').findOne({userId}));
    if (accounts.some(user => !user?.firebaseUid || user.accountUserId || user.workspaceGroupId)) {
      Q.fail('Two existing Firebase base profiles are required.');
    }
    const before = Q.snapshotSpecs(privateSpecs());
    if (before.some(row => row.documents.length)) Q.fail('Private invitation namespace occupied.');
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {
      privateInvitation: {before, recipient: ids[0], outsider: ids[1], eventId: privateEventId}
    }});
    const now = Q.nowIso();
    Q.collection('users').insertOne({_id: privateOwner, userId: privateOwner, syncKey: privateOwner,
      name: 'QA private invitation owner', initials: 'QA', profileStatus: 'public',
      email: 'deploy-external-private@qa.myscoutee.test', operator: false});
    Q.collection('events').insertOne({_id: privateEventId, sourceId: privateEventId, syncKey: privateEventId,
      ownerUserId: privateOwner, creatorUserId: privateOwner, admins: [privateOwner],
      status: 'A', visibility: 'Invitation only', title: 'QA deployment private invitation',
      description: 'QA_DEPLOY_PRIVATE_CONTENT', startAtIso: '2027-02-11T17:15:00.000Z',
      endAtIso: '2027-02-11T20:15:00.000Z', eventType: 'main', mode: 'Casual',
      acceptedMembers: 1, pendingMembers: 1, acceptedMemberUserIds: [privateOwner],
      pendingMemberUserIds: [ids[0]], invitedMemberUserIds: [ids[0]], pendingRequestMemberUserIds: [],
      capacityMin: 1, capacityMax: 5, capacityTotal: 5, autoInviter: false,
      ticketing: false, slotsEnabled: false, createdDate: now, updatedDate: now,
      createdUser: privateOwner, updatedUser: privateOwner});
    Q.collection('activityMembers').insertMany([privateOwner, ids[0]].map((userId, index) => ({
      _id: `event:${privateEventId}:${userId}`, syncKey: `event:${privateEventId}:${userId}`,
      ownerType: 'event', ownerId: privateEventId, userId,
      role: index === 0 ? 'Admin' : 'Member', status: index === 0 ? 'accepted' : 'pending',
      requestKind: index === 0 ? null : 'invite', invitedByUserId: index === 0 ? null : privateOwner,
      organizerOnly: false, createdDate: now, updatedDate: now, createdUser: privateOwner, updatedUser: privateOwner
    })));
    Q.collection('chats').insertOne({_id: `chat-owner-copy:${privateEventId}`, id: privateEventId,
      channelType: 'event', ownerId: privateEventId, eventId: privateEventId,
      ownerUserId: privateOwner, memberIds: [privateOwner], title: 'QA private chat',
      lastMessage: 'QA_DEPLOY_PRIVATE_CONTENT', lastSenderId: privateOwner,
      dateIso: now, unread: 0, revision: NumberLong('1')});
    Q.collection('chatMessages').insertOne({_id: `chat-message:${privateEventId}:control`,
      id: 'control', chatId: privateEventId, sender: 'QA owner',
      senderAvatar: {id: privateOwner, initials: 'QA'}, text: 'QA_DEPLOY_PRIVATE_CONTENT',
      sentAtIso: now, messageSenderUserIds: [privateOwner], messageReadByUserIds: [privateOwner],
      readBy: [], reactions: [], attachments: []});
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {
      'privateInvitation.staged': Q.snapshotSpecs(privateSpecs())
    }});
    Q.printObject({checkpointId, phase: 'private-invitation-ready', eventId: privateEventId,
      recipient: ids[0], outsider: ids[1], ownerIsFixtureOnly: true}); return;
  }
  if (command === 'verify-private-invitation' || command === 'restore-private-invitation') {
    const saved = state.privateInvitation;
    if (!saved) Q.fail('Private invitation not staged.');
    if (command === 'restore-private-invitation') Q.restoreSnapshots(saved.before);
    const expected = command === 'restore-private-invitation' ? saved.before : saved.staged;
    for (const snapshot of expected) {
      const actual = Q.collection(snapshot.collection).find(snapshot.selector).toArray();
      const order = rows => rows.sort((a,b) => String(a._id).localeCompare(String(b._id)));
      if (!Q.sameJson(order(actual), order(snapshot.documents))) Q.fail(`Private invitation changed: ${snapshot.collection}`);
    }
    if (command === 'restore-private-invitation') {
      Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {privateInvitation: ''}});
    }
    Q.printObject({checkpointId, phase: command, exactMatch: true}); return;
  }
  if (command === 'prepare-children-control') {
    const userId = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID);
    if (!/^[a-f0-9]{8}-[a-f0-9-]{27}$/.test(userId) || state.childrenControl) Q.fail('Provide one new Children profile control.');
    const user = Q.collection('users').findOne({userId});
    const rows = (user?.profileDetails || []).flatMap(section => section?.rows || [])
      .filter(row => row?.labelKey === 'profile.details.children');
    if (!user?.firebaseUid || user.accountUserId || user.workspaceGroupId || rows.length !== 1) Q.fail('One existing Firebase base-profile Children row is required.');
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {childrenControl: {
      userId, firebaseUid: user.firebaseUid, rowBefore: rows[0], preparedAt: Q.nowIso()
    }}});
    Q.printObject({checkpointId, phase: 'children-snapshotted', originalRetained: true}); return;
  }
  if (command === 'set-children-control' || command === 'restore-children-control') {
    const saved = state.childrenControl;
    if (!saved) Q.fail('Snapshot the Children control first.');
    const user = Q.collection('users').findOne({userId: saved.userId, firebaseUid: saved.firebaseUid});
    const matches = (user?.profileDetails || []).flatMap(section => section?.rows || [])
      .filter(row => row?.labelKey === 'profile.details.children');
    if (!user || matches.length !== 1) Q.fail('The original Children control is missing or ambiguous.');
    const values = {no: 'No', yes: 'Yes', private: 'Prefer not to say'};
    const key = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID);
    const restoring = command === 'restore-children-control';
    if (!restoring && !Object.hasOwn(values, key)) Q.fail('Use no, yes or private.');
    const row = restoring ? saved.rowBefore : {...saved.rowBefore, value: values[key], privacy: 'Public'};
    Q.collection('users').updateOne({_id: user._id}, {$set: {
      'profileDetails.$[].rows.$[row]': row
    }}, {arrayFilters: [{'row.labelKey': 'profile.details.children'}]});
    const actual = Q.collection('users').findOne({_id: user._id}).profileDetails
      .flatMap(section => section?.rows || []).find(item => item?.labelKey === 'profile.details.children');
    // Rows constructed in the scenario and returned by mongosh can have different
    // object realms; compare sorted entries without relying on constructor identity.
    const entries = value => Object.keys(value).sort().map(key => [key, value[key]]);
    if (!Q.sameJson(entries(actual), entries(row))) Q.fail('Children control write/read mismatch.');
    if (restoring) Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {childrenControl: ''}});
    Q.printObject({checkpointId, phase: restoring ? 'children-restored' : 'children-staged', value: row.value,
      privacy: row.privacy, fixturePreparationOnly: !restoring}); return;
  }
  if (command === 'prepare-location-control') {
    const userId = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID);
    if (!/^[a-f0-9]{8}-[a-f0-9-]{27}$/.test(userId) || state.locationControl) Q.fail('Provide one new existing-account location control.');
    const user = Q.collection('users').findOne({userId});
    if (!user?.firebaseUid || user.accountUserId || user.workspaceGroupId
        || !Number.isFinite(user.locationCoordinates?.latitude)
        || !Number.isFinite(user.locationCoordinates?.longitude)) Q.fail('A located Firebase account profile is required.');
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {locationControl: {
      userId, firebaseUid: user.firebaseUid, coordinatesBefore: user.locationCoordinates,
      preparedAt: Q.nowIso()
    }}});
    Q.collection('users').updateOne({_id: user._id, firebaseUid: user.firebaseUid}, {$unset: {locationCoordinates: ''}});
    if (Q.collection('users').findOne({_id: user._id})?.locationCoordinates) Q.fail('Location control preparation failed.');
    Q.printObject({checkpointId, userId, phase: 'missing-location', originalLocationRetained: true}); return;
  }
  if (command === 'restore-location-control') {
    const saved = state.locationControl;
    if (!saved) Q.fail('No location control to restore.');
    const user = Q.collection('users').findOne({userId: saved.userId, firebaseUid: saved.firebaseUid});
    if (!user) Q.fail('The original location-control account is missing.');
    Q.collection('users').updateOne({_id: user._id}, {$set: {locationCoordinates: saved.coordinatesBefore}});
    if (!Q.sameJson(Q.collection('users').findOne({_id: user._id}).locationCoordinates, saved.coordinatesBefore)) Q.fail('Location restore mismatch.');
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {locationControl: ''}});
    Q.printObject({checkpointId, userId: saved.userId, phase: 'location-restored'}); return;
  }
  if (command === 'capture') {
    const name = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID);
    if (!/^[a-z0-9-]{1,60}$/.test(name) || state.captures.some(capture => capture.name === name)) {
      Q.fail('A new, named entry checkpoint is required.');
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$push: {captures: {
      name, capturedAt: Q.nowIso(), snapshots: current(), configuration: config()}}});
    Q.printObject({checkpointId, captured: name}); return;
  }
  if (command === 'reset') {
    if (state.apiKey) Q.fail('Restore API key before cleanup.');
    if (state.oauthClient || state.oauthClients?.length) Q.fail('Restore Inspector clients before cleanup.');
    if (state.privateInvitation) Q.fail('Restore private invitation before cleanup.');
    if (state.childrenControl) Q.fail('Restore the Children profile control before cleanup.');
    if (state.locationControl) Q.fail('Restore the existing-account location control before cleanup.');
    if (!Q.sameJson(config(), state.configurationBefore)) Q.fail('Deployment configuration changed; restore its owned changes before actor cleanup.');
    const ids = profileIds();
    for (const name of ['events', 'assets', 'communityGroups']) {
      if (Q.collection(name).countDocuments({$or: ['userId', 'ownerUserId', 'creatorUserId', 'createdUser']
        .map(field => ({[field]: {$in: ids}}))})) Q.fail(`Restore the owned ${name} branch before entry cleanup.`);
    }
    Q.restoreSnapshots(current().map(snapshot => ({...snapshot, documents: []})));
    Q.restoreSnapshots(state.snapshots);
    for (const snapshot of state.snapshots) {
      if (!Q.sameJson(Q.collection(snapshot.collection).find(snapshot.selector).toArray(), snapshot.documents)) Q.fail('Entry restore mismatch.');
    }
    Q.collection(Q.STATE_COLLECTION).deleteOne({_id: state._id});
    Q.printObject({checkpointId, phase: 'reset-complete', exactRestore: true}); return;
  }
  Q.fail('Unsupported configured-deployment command.');
})();
