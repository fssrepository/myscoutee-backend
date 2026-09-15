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
  function capture() {
    const saved = Q.activeState(scenario, true), name = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID);
    const rule = Q.requireRule(ruleKey), now = Q.nowIso();
    Q.assertRuleNotRunning(ruleKey);
    if (name === 'producer-ready') {
      if (saved.phase !== 'rule-edit-baseline' || rule.timing.intervalSeconds !== 120
          || Q.collection('chatMessages').countDocuments({ chatId })) Q.fail('Expected the saved two-minute baseline');
      const memberOwner = `${chatId}:group`;
      const additional = Q.snapshotSpecs([{ collection: 'activityMembers', selector: { ownerId: memberOwner } }]);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: saved._id }, { $push: { snapshots: { $each: additional } } });
      const memberIds = actors.slice(1);
      Q.collection('activityMembers').insertMany(memberIds.map((userId, i) => ({
        _id: `${memberOwner}:${userId}`, syncKey: `${memberOwner}:${userId}`, ownerType: 'group', ownerId: memberOwner,
        userId, role: i ? 'Member' : 'Manager', status: 'accepted', actionAtIso: now, createdDate: now, updatedDate: now
      })));
      Q.collection('chats').insertMany(memberIds.map(userId => ({
        _id: `${chatId}:${userId}`, id: chatId, ownerUserId: userId, memberIds,
        title: 'QA Notification Admin', avatar: 'QA', lastMessage: '', lastSenderId: '', unread: 0,
        dateIso: now, channelType: 'groupSubEvent', ownerId: memberOwner,
        eventId: `${chatId}:event`, subEventId: `${chatId}:stage`, groupId: memberOwner,
        ownerStatus: 'A', contextStartAtIso: new Date(Date.now()+3600000).toISOString(),
        contextEndAtIso: new Date(Date.now()+7200000).toISOString()
      })));
      Q.collection('notificationRuleConfigs').updateOne({ ruleKey, 'runState.currentStatus': { $ne: 'running' } }, { $set: { enabled: false } });
    } else if (name === 'arm-first' || name === 'arm-second') {
      if (name === 'arm-first' && saved.phase !== 'producer-ready'
          || name === 'arm-second' && saved.phase !== 'read') Q.fail('Unexpected scheduler boundary');
      const outboxes = Q.collection('notificationOutbox').find({ 'payload.chatId': chatId }).toArray();
      if (outboxes.length !== 1 || outboxes[0].firebaseDeliveryRequested !== false
          || outboxes[0].recipientUserIds.join() !== actors[2]) Q.fail('Expected one exact no-Firebase Nova item');
      const due = Math.ceil((Date.now()+30000)/60000)*60000;
      Q.collection('notificationRuleConfigs').updateOne({ ruleKey, 'runState.currentStatus': { $ne: 'running' } }, {
        $set: { enabled: saved.originalEnabled, 'runState.lastRunAtIso': new Date(due-120000).toISOString() }
      });
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: saved._id }, { $set: {
        armedAt: now, expectedDueAt: new Date(due).toISOString(), runIdsBefore: (rule.runHistory || []).map(r => r.id || r._id)
      } });
      Q.printObject({ expectedDueAt: new Date(due).toISOString(), outboxId: outboxes[0]._id });
    } else if (['delivery','read','dedupe'].includes(name)) {
      const outboxes = Q.collection('notificationOutbox').find({ 'payload.chatId': chatId }).toArray();
      const inbox = Q.collection('userNotifications').find({ sourceId: chatId }).toArray();
      if (outboxes.length !== 1 || inbox.length !== 1 || inbox[0].recipientUserId !== actors[2]
          || outboxes[0].status !== 'sent' || outboxes[0].firebaseDeliveryRequested !== false
          || outboxes[0].tokenSuccessCount !== 0 || outboxes[0].tokenFailureCount !== 0
          || outboxes[0].retryCount !== 0) Q.fail('Delivery identity/count mismatch');
      const read = Boolean(inbox[0].readAtIso);
      if (read !== (name !== 'delivery') || Q.ensureUser(actors[2]).activities.notifications !== (read ? 0 : 1)
          || Q.ensureUser(actors[1]).activities.notifications !== 0) Q.fail('Inbox read/counter mismatch');
      const novaChat = Q.collection('chats').findOne({ id: chatId, ownerUserId: actors[2] });
      if (novaChat.unread !== 1) Q.fail('Notification action changed source chat read state');
      const newRuns = (rule.runHistory || []).filter(r => !(saved.runIdsBefore || []).includes(r.id || r._id));
      if (name !== 'read' && (newRuns.length !== 1 || newRuns[0].status !== 'completed'
          || newRuns[0].processedCount !== (name === 'delivery' ? 1 : 0))) Q.fail('Expected one attributed scheduler completion');
      if (name === 'dedupe' && (!Q.sameJson(saved.readEvidence.outbox, outboxes[0])
          || !Q.sameJson(saved.readEvidence.inbox, inbox[0]))) Q.fail('Second pass changed message evidence');
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: saved._id }, { $set: {
        [name + 'Evidence']: { outbox: outboxes[0], inbox: inbox[0] }
      } });
      Q.printObject({ oracle: name, outboxId: outboxes[0]._id, inboxId: inbox[0]._id, readAtIso: inbox[0].readAtIso || null, newRuns });
    } else if (name === 'restored') {
      // Interval edits normalize unused calendar fields; verify the editable interval contract.
      const intervalFields = ['mode', 'intervalMinutes', 'intervalSeconds', 'intervalAmount',
        'intervalUnit', 'time', 'timezone', 'cronExpression'];
      if (saved.phase !== 'dedupe' || intervalFields.some(key => rule.timing[key] !== saved.originalTiming[key])
          || rule.enabled !== saved.originalEnabled) Q.fail('Original timing/enabled state not restored');
    } else Q.fail('Unsupported Notification Admin savepoint');
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: saved._id }, { $set: { phase: name } });
    status();
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
    case 'capture': capture(); break;
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
