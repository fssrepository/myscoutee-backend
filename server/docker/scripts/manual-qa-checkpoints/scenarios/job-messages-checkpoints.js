/* global ManualQa, process */
(() => {
  const Q = ManualQa, scenario = 'job-messages', checkpointId = 'JOB-MESSAGES';
  const userId = 'admin-job-fixture:v1:scheduled-messages:user';
  const actors = ['admin-demo-ava', userId];
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== checkpointId) Q.fail('Expected JOB-MESSAGES');
  const fixture = () => Q.collection('adminJobFixtureSnapshots').findOne({ job: 'scheduled-messages' });
  if (command === 'stage') {
    Q.assertNotStaged(scenario); Q.assertNoOtherActiveScenario(scenario);
    if (Q.collection('adminJobFixtureSnapshots').countDocuments({})) Q.fail('Reset the previous Admin job fixture first');
    const specs = [
      { collection: 'users', selector: { userId: actors[0] } },
      ...['userLoginAudits', 'userSessionActions', 'userSessionStates'].map(collection => ({
        collection, selector: { $or: [{ userId: { $in: actors } }, { _id: { $in: actors } }] }
      })),
      { collection: 'userNotifications', selector: { recipientUserId: { $in: actors } } },
      { collection: 'notificationOutbox', selector: { notificationType: 'security-login', createdUser: { $in: actors } } }
    ];
    Q.collection(Q.STATE_COLLECTION).insertOne({ _id: Q.stateId(scenario), scenario, checkpointId,
      phase: 'staging', stagedAtIso: Q.nowIso(), snapshots: Q.snapshotSpecs(specs),
      monitoringBaseline: Q.collection('adminMonitoring').find({}).toArray() });
  } else if (command === 'ready') {
    const saved = Q.activeState(scenario, true), f = fixture();
    if (!['staging', 'held'].includes(saved.phase) || !f) Q.fail('Prepare the existing scheduled-messages fixture first');
    const task = Q.collection('scheduledMessageTasks').findOne({ _id: f.context.taskId });
    if (task?.status !== 'scheduled' || Q.ensureUser(userId).status !== 'A') Q.fail('Baseline already changed');
    // This checkpoint observes an existing profile; onboarding is a separate journey.
    Q.collection('users').updateOne({ _id: userId }, { $set: { profileFormVersion: 2 } });
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: saved._id }, { $set: { phase: 'held', variation: f.variation } });
  } else if (command === 'arm') {
    const saved = Q.activeState(scenario, true), f = fixture();
    if (saved.phase !== 'held' || !f) Q.fail('Expected the held baseline');
    Q.assertRuleNotRunning('scheduled-messages');
    // Browser startup is a prerequisite, not recent activity in the inactive-user scenario.
    if (f.variation === 'inactive-user') {
      const old = new Date(Date.now() - 40 * 86400000).toISOString();
      const user = Q.ensureUser(userId);
      Q.collection('users').updateOne({ _id: user._id }, { $set: {
        devices: (user.devices || []).map(d => ({ ...d, lastSeenAtIso: old, lastRegisteredAtIso: old }))
      } });
      Q.collection('userSessionActions').updateMany({ userId }, { $set: { createdDate: old } });
    }
    const rule = Q.requireRule('scheduled-messages');
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: saved._id }, { $set: {
      phase: 'armed', armedAtIso: Q.nowIso(), runIdsBefore: (rule.runHistory || []).map(r => r.id || r._id)
    } });
    Q.collection('notificationRuleConfigs').updateOne({ ruleKey: 'scheduled-messages' }, {
      $unset: { 'runState.lastRunAtIso': '' }
    });
  } else if (command === 'reset') {
    if (fixture()) Q.fail('Reset the scheduled-messages Admin fixture first');
    const saved = Q.activeState(scenario, true);
    Q.restoreSnapshots(saved.snapshots);
    for (const snapshot of saved.snapshots) {
      const byId = docs => docs.sort((a, b) => String(a._id).localeCompare(String(b._id)));
      if (!Q.sameJson(byId(Q.collection(snapshot.collection).find(snapshot.selector).toArray()), byId(snapshot.documents)))
        Q.fail(`Restored ${snapshot.collection} differs; snapshot retained`);
    }
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: saved._id });
  } else if (command !== 'status') Q.fail('Use stage|ready|arm|status|reset job-messages JOB-MESSAGES');
  const saved = Q.activeState(scenario), f = fixture();
  Q.printObject({ checkpointId, phase: saved?.phase || 'not-staged', variation: f?.variation,
    userId, task: f && Q.collection('scheduledMessageTasks').findOne({ _id: f.context.taskId }),
    ruleEnabled: Q.requireRule('scheduled-messages').enabled });
})();
