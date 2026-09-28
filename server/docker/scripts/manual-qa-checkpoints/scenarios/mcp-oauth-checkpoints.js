/* global ManualQa, process, ObjectId */
(() => {
  'use strict';
  const Q = ManualQa;
  const scenario = 'mcp-oauth';
  const checkpointId = 'INTEGRATION-API-GROUP-001';
  const actor = 'f02909260000000000000001';
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== checkpointId) Q.fail('Wrong MCP checkpoint.');
  // This development fixture is only block 7, not the full group-invitation baseline.
  const callbacks = ['http://127.0.0.1:6274/oauth/callback', 'http://localhost:6274/oauth/callback'];
  const selector = {$or: [{userId: actor}, {ownerUserId: actor}, {accountUserId: actor},
    {recipientUserId: actor}, {senderUserId: actor}, {_id: actor}, {_id: ObjectId(actor)}]};
  const collections = ['users', 'integrationTokens', 'mcpAuthorizations', 'userSessionStates',
    'userSessionActions', 'userLoginAudits', 'privacyConsents', 'userNotifications',
    'userFilterPreferences', 'userPageFilterPreferences', 'userExperienceProfiles', 'affinityRecomputeTasks'];
  function current() {
    return Q.snapshotSpecs([
      ...collections.map(collection => ({collection, selector})),
      {collection: 'mcpOAuthClients', selector: {redirectUris: {$in: callbacks}}}
    ]);
  }
  const state = Q.activeState(scenario, false);
  if (command === 'status') {
    Q.printObject({checkpointId, scenario, phase: state?.phase ?? 'not-staged', actor}); return;
  }
  if (command === 'stage') {
    Q.assertNotStaged(scenario);
    const snapshots = current();
    if (snapshots.some(s => s.documents.length)) Q.fail('MCP fixture namespace/callback is already in use.');
    const source = Q.ensureUser('af0436815ab38f4864dd1e24');
    const fields = ['age', 'birthday', 'city', 'height', 'physique', 'languages', 'horoscope', 'gender',
      'images', 'profileDetails', 'profileStatus', 'completion', 'profileFormVersion', 'locationCoordinates', 'partitionKey', '_class'];
    const personal = Object.fromEntries(fields.filter(k => source[k] !== undefined).map(k => [k, source[k]]));
    Q.collection(Q.STATE_COLLECTION).insertOne({_id: Q.stateId(scenario), scenario, checkpointId,
      phase: 'staging', snapshots, stagedAtIso: Q.nowIso()});
    Q.collection('users').insertOne({...personal, _id: ObjectId(actor), userId: actor, syncKey: actor,
      name: 'OAuth Demo Alex', initials: 'OA', email: `${actor}@qa.myscoutee.test`,
      headline: '', about: '', statusText: '', operator: false,
      activities: {game: 0, chats: 0, invitations: 0, events: 0, hosting: 0}});
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: Q.stateId(scenario)}, {$set: {phase: 'baseline-ready'}});
    Q.printObject({checkpointId, scenario, phase: 'baseline-ready', actor, credentialsCreated: false}); return;
  }
  if (command === 'reset') {
    if (!state) Q.fail('MCP fixture is not staged.');
    Q.restoreSnapshots(current().map(s => ({...s, documents: []})));
    Q.restoreSnapshots(state.snapshots);
    for (const s of state.snapshots) {
      if (!Q.sameJson(Q.collection(s.collection).find(s.selector).toArray(), s.documents)) Q.fail(`Restore mismatch: ${s.collection}`);
    }
    Q.collection(Q.STATE_COLLECTION).deleteOne({_id: Q.stateId(scenario)});
    Q.printObject({checkpointId, scenario, phase: 'reset-complete', exactRestore: true}); return;
  }
  Q.fail(`Unsupported MCP fixture command: ${command}`);
})();
