/* global ManualQa, process */
(() => {
  'use strict';
  const Q = ManualQa, scenario = 'notification-admin', checkpoint = 'NOTIFICATION-ADMIN-LIFECYCLE-001';
  const actors = ['admin-demo-ava', '650000000000000000000061', '650000000000000000000062'];
  const ruleKey = 'notification-outbox', chatId = 'manual-qa-checkpoint:v1:notification-admin:chat';
  const users = { userId: { $in: actors } };
  const specs = [
    { collection: 'notificationRuleConfigs', selector: { ruleKey } },
    { collection: 'users', selector: users },
    { collection: 'userLoginAudits', selector: users },
    { collection: 'userSessionActions', selector: users },
    { collection: 'userSessionStates', selector: { _id: { $in: actors } } },
    { collection: 'chats', selector: { id: chatId } },
    { collection: 'chatMessages', selector: { chatId } },
    { collection: 'notificationOutbox', selector: { $or: [
      { 'payload.chatId': chatId }, { notificationType: 'security-login', createdUser: { $in: actors } }
    ] } },
    { collection: 'userNotifications', selector: { recipientUserId: { $in: actors } } }
  ];
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== checkpoint) Q.fail('Unsupported notification Admin checkpoint');
  function status() {
    const saved = Q.activeState(scenario);
    if (!saved) return Q.printObject({ scenario, checkpoint, phase: 'not-staged' });
    const rule = Q.requireRule(ruleKey);
    Q.printObject({ scenario, checkpoint, phase: saved.phase, originalTiming: saved.originalTiming,
      originalEnabled: saved.originalEnabled, currentTiming: rule.timing, enabled: rule.enabled,
      lastRunAtIso: rule.runState?.lastRunAtIso, newestRun: [...(rule.runHistory || [])].sort((a, b) => String(b.startedAtIso).localeCompare(String(a.startedAtIso))).slice(0, 1),
      firebaseActive: Q.collection('deploymentConfigurations').findOne({ _id: 'deployment-configuration' })?.firebase?.active === true,
      targetOutboxCount: Q.collection('notificationOutbox').countDocuments({ 'payload.chatId': chatId }),
      targetInboxCount: Q.collection('userNotifications').countDocuments({ sourceId: chatId }),
      actorCounters: actors.map(userId => ({ userId, unread: Q.ensureUser(userId).activities?.notifications || 0 })) });
  }
  switch (Q.text(process.env.MANUAL_QA_COMMAND)) {
    case 'stage': {
      Q.assertNotStaged(scenario); Q.assertNoOtherActiveScenario(scenario);
      if (Q.collection('adminJobFixtureSnapshots').countDocuments({})) Q.fail('Reset existing Admin fixture first');
      actors.forEach(userId => Q.ensureUser(userId));
      const rule = Q.requireRule(ruleKey); Q.assertRuleNotRunning(ruleKey);
      if (Q.collection('chats').countDocuments({ id: chatId })
          || Q.collection('chatMessages').countDocuments({ chatId })
          || Q.collection('notificationOutbox').countDocuments({ status: { $in: ['pending', 'running'] } }))
        Q.fail('Expected an empty controlled chat and no pending/running outbox');
      Q.collection(Q.STATE_COLLECTION).insertOne({ _id: Q.stateId(scenario), scenario, checkpointId: checkpoint,
        phase: 'rule-edit-baseline', stagedAtIso: Q.nowIso(), snapshots: Q.snapshotSpecs(specs),
        originalTiming: rule.timing, originalEnabled: rule.enabled,
        // Read-only controls: unrelated scheduler/Monitoring writes must never be rolled back.
        controlRule: Q.requireRule('scheduled-messages'),
        monitoringBaseline: Q.collection('adminMonitoring').find({}).toArray() });
      status(); break;
    }
    case 'status': status(); break;
    case 'reset': {
      const saved = Q.activeState(scenario, true); Q.assertRuleNotRunning(ruleKey);
      Q.restoreSnapshots(saved.snapshots);
      for (const snapshot of saved.snapshots) {
        const byId = docs => docs.sort((a, b) => String(a._id).localeCompare(String(b._id)));
        if (!Q.sameJson(byId(Q.collection(snapshot.collection).find(snapshot.selector).toArray()), byId(snapshot.documents)))
          Q.fail(`Restored ${snapshot.collection} differs; snapshot retained`);
      }
      Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: saved._id }); status(); break;
    }
    default: Q.fail('Use stage|status|reset notification-admin NOTIFICATION-ADMIN-LIFECYCLE-001');
  }
})();
