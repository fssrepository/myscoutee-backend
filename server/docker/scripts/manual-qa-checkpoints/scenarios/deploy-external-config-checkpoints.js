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
