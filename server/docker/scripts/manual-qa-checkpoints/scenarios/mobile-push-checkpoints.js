/* global ManualQa, process, EJSON */
(() => {
  'use strict';
  const Q = ManualQa, scenario = 'mobile-push', checkpoint = 'MOBILE-PUSH-LIFECYCLE-001';
  const prefix = 'manual-qa-checkpoint:v1:mobile-push';
  const actors = ['650000000000000000000061', '650000000000000000000062', '650000000000000000000063'];
  const chatId = `${prefix}:group-chat`, eventId = `${prefix}:event`, groupId = `${prefix}:group`, stageId = `${prefix}:stage`;
  const related = { $or: [{ sourceId: chatId }, { 'payload.chatId': chatId }, { 'payload.eventId': eventId }] };
  const userSelector = { userId: { $in: actors } };
  const securityOutbox = { notificationType: 'security-login', createdUser: { $in: actors } };
  const securityInbox = { kind: 'security-login', recipientUserId: { $in: actors } };
  const specs = [
    { collection: 'userLoginAudits', selector: userSelector },
    { collection: 'userSessionActions', selector: userSelector },
    { collection: 'userSessionStates', selector: { _id: { $in: actors } } },
    { collection: 'users', selector: userSelector },
    { collection: 'chats', selector: { id: chatId } },
    { collection: 'chatMessages', selector: { chatId } },
    { collection: 'activityMembers', selector: { ownerId: { $in: [eventId, groupId] } } },
    { collection: 'notificationOutbox', selector: { $or: [related, securityOutbox] } },
    { collection: 'userNotifications', selector: { $or: [related, securityInbox] } }
  ];
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== checkpoint) Q.fail('Unsupported Push checkpoint');
  function state() { return Q.activeState(scenario, true); }
  function status() {
    const saved = Q.activeState(scenario);
    if (!saved) return Q.printObject({ scenario, checkpoint, phase: 'not-staged' });
    const messages = Q.collection('chatMessages').find({ chatId }).sort({ sentAtIso: 1 }).toArray();
    const inbox = Q.collection('userNotifications').find(related).toArray();
    const outbox = Q.collection('notificationOutbox').find(related).toArray();
    const firebase = Q.collection('deploymentConfigurations').findOne({ _id: 'deployment-configuration' }).firebase;
    Q.printObject({ scenario, checkpoint, phase: saved.phase, chatId, actors: actors.map(userId => {
      const u = Q.ensureUser(userId);
      return { userId, deviceCount: (u.devices || []).length,
        providerRegistrations: (u.devices || []).filter(d => d.firebaseToken).map(d => ({ deviceId: d.deviceId, platform: d.platform, notificationsEnabled: d.notificationsEnabled })),
        muted: u.notificationPreferences?.muted === true, unread: u.activities?.notifications || 0 };
    }), firebase: { active: firebase.active, revision: firebase.revision, baselineSource: saved.firebaseBaselineSource },
    messages: messages.map(m => ({ id: m.id, text: m.text, senderUserId: m.senderAvatar?.id })),
    inbox: inbox.map(n => ({ id: n._id, recipientUserId: n.recipientUserId, sourceId: n.sourceId, readAtIso: n.readAtIso })),
    outbox: outbox.map(n => ({ id: n._id, recipientUserIds: n.recipientUserIds, status: n.status,
      firebaseDeliveryRequested: n.firebaseDeliveryRequested,
      firebaseDevices: n.firebaseDevices == null ? null : Object.fromEntries(Object.entries(n.firebaseDevices).map(([userId, devices]) => [userId, Object.keys(devices || {})])),
      retryCount: n.retryCount, nextRetryAt: n.nextRetryAt, tokenSuccessCount: n.tokenSuccessCount,
      tokenFailureCount: n.tokenFailureCount, sentDate: n.sentDate,
      messageId: n.payload?.messageId })),
    savepoints: (saved.savepoints || []).map(p => ({ name: p.name, capturedAt: p.capturedAt })) });
  }
  function stage() {
    Q.assertNotStaged(scenario);
    const retained = Q.activeState('operator-domain', true);
    if (retained.checkpointId !== 'OPERATOR-FIREBASE-001' || retained.snapshots.length !== 1
        || retained.snapshots[0].collection !== 'deploymentConfigurations'
        || Q.collection(Q.STATE_COLLECTION).countDocuments({}) !== 1) Q.fail('Expected only the retained local Firebase configuration snapshot');
    actors.forEach(id => { if ((Q.ensureUser(id).devices || []).length) Q.fail('Actor already has devices; inspect before staging'); });
    if (Q.collection('chats').countDocuments({ id: chatId }) || Q.collection('chatMessages').countDocuments({ chatId })) Q.fail('Unexpected existing Push data');
    const config = Q.collection('deploymentConfigurations').findOne({ _id: 'deployment-configuration' });
    const f = config.firebase, c = f.publicClient || {};
    if (Q.number(f.revision) !== 1 || f.active || !f.authenticationCredentialEnvelope || !f.messagingCredentialEnvelope
        || ['apiKey','authDomain','appId','messagingSenderId','vapidKey'].some(k => !c[k])) Q.fail('Load the local revision 1 Firebase fixture first');
    const now = Q.nowIso();
    const saved = { _id: Q.stateId(scenario), scenario, checkpointId: checkpoint, phase: 'staging', stagedAtIso: now,
      snapshots: [...retained.snapshots, ...Q.snapshotSpecs(specs)],
      firebaseBaselineSource: 'Prepared prerequisite from retained 2026-09-14 Shared Firebase revision and entry repairs evidence; capability markers are fixture state, not newly observed Operator results.', savepoints: [] };
    Q.collection(Q.STATE_COLLECTION).insertOne(saved);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: retained._id });
    // Restore the already-proven capability prerequisite. Deliberately leave
    // observed-test timestamps null; no new provider/Operator PASS is asserted.
    Q.collection('deploymentConfigurations').updateOne({ _id: config._id, version: config.version }, { $set: {
      'firebase.active': true, 'firebase.authenticationTestedRevision': f.revision,
      'firebase.messagingTestedRevision': f.revision, 'firebase.authenticationTestedAt': null,
      'firebase.messagingTestedAt': null, 'firebase.activatedAt': null
    }, $inc: { version: 1 } });
    Q.collection('chats').insertMany(actors.map(userId => ({
      _id: `${chatId}:${userId}`, id: chatId, ownerUserId: userId, avatar: 'QP', title: 'QA Mobile Push Group',
      lastMessage: '', lastSenderId: '', memberIds: actors, unread: 0, dateIso: now,
      contextStartAtIso: new Date(Date.now() + 3 * 3600000).toISOString(),
      contextEndAtIso: new Date(Date.now() + 5 * 3600000).toISOString(),
      channelType: 'groupSubEvent', ownerId: groupId, eventId, ownerStatus: 'A', revision: 1, subEventId: stageId, groupId
    })));
    Q.collection('activityMembers').insertMany(['event','group'].flatMap(ownerType => actors.map((userId, i) => ({
      _id: `${prefix}:member:${ownerType}:${userId}`, syncKey: `${prefix}:member:${ownerType}:${userId}`,
      ownerType, ownerId: ownerType === 'event' ? eventId : groupId, userId,
      role: i === 0 ? (ownerType === 'event' ? 'Admin' : 'Manager') : 'Member', status: 'accepted',
      pendingSource: null, requestKind: null, invitedByUserId: null,
      actionAtIso: now, createdDate: now, updatedDate: now, createdUser: actors[0], updatedUser: actors[0]
    }))));
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: saved._id }, { $set: { phase: 'awaiting-device-registration' } });
    status();
  }
  function capture() {
    const saved = state(), name = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID);
    if (name === 'old-registration') return captureOldRegistration();
    if (name === 'replacement-registration') return captureReplacementRegistration();
    if (!/^(baseline|foreground|foreground-replay|background|background-settings|background-chrome|background-chrome-replay|cold-start|cold-start-replay|permission-denied|replacement-token)$/.test(name)) Q.fail('Invalid Push savepoint');
    const phase = name === 'foreground-replay' ? 'foreground' : name === 'background-chrome-replay' ? 'background-chrome' : name === 'cold-start-replay' ? 'cold-start' : name;
    const riley = Q.ensureUser(actors[2]);
    if (name === 'baseline' && ((riley.devices || []).filter(d => d.firebaseToken).length !== 1
        || Q.collection('chatMessages').countDocuments({ chatId }) !== 0)) Q.fail('Baseline needs one real Riley registration and zero messages');
    if ((saved.savepoints || []).some(p => p.name === name)) Q.fail('Savepoint already exists');
    const order = ['baseline','foreground','background','background-settings','background-chrome','cold-start','permission-denied','replacement-token'];
    if (name !== 'baseline') {
      if (saved.phase !== (name === 'foreground-replay' ? 'foreground' : order[order.indexOf(phase) - 1])) Q.fail('Capture phases in checklist order');
      // Capture validates persisted delivery; native UI observations remain
      // separately recorded evidence and are never inferred from this oracle.
      const messages = Q.collection('chatMessages').find({ chatId }).toArray();
      const expectedText = `${checkpoint} ${name === 'foreground-replay' ? 'foreground' : name}`;
      const current = name === 'foreground'
        ? messages.filter(m => (saved.foregroundMessageIds || []).includes(m.id))
        : messages.filter(m => m.text === expectedText);
      if (!current.length || (name !== 'foreground' && current.length !== 1)) Q.fail('Expected phase message is absent or duplicated');
      for (const m of current) {
        if (m.senderAvatar?.id !== actors[0]) Q.fail('Unexpected message sender');
        const outbox = Q.collection('notificationOutbox').find({ ...related, 'payload.messageId': m.id }).toArray();
        const inbox = Q.collection('userNotifications').find({ ...related, 'payload.messageId': m.id }).toArray();
        if (outbox.length !== 1 || inbox.length !== 2
            || actors.slice(1).some(id => inbox.filter(n => n.recipientUserId === id).length !== 1)) Q.fail('Message audience or dedupe oracle failed');
        if (name === 'permission-denied' && (outbox[0].firebaseDeliveryRequested !== true
            || !outbox[0].firebaseDevices || actors.slice(1).some(id => !Object.hasOwn(outbox[0].firebaseDevices, id)
              || Object.keys(outbox[0].firebaseDevices[id]).length !== 0)
            || outbox[0].status !== 'sent' || outbox[0].retryCount !== 0
            || outbox[0].tokenSuccessCount !== 0 || outbox[0].tokenFailureCount !== 0)) Q.fail('Denied/no-device saved decision must complete without a provider attempt');
        if (name === 'replacement-token') {
          const devices = Q.ensureUser(actors[2]).devices || [];
          if (!saved.oldRegistration || devices.length !== 1 || !devices[0].firebaseToken
              || devices[0].notificationsEnabled !== true) Q.fail('Expected one replacement provider registration');
          const fingerprint = require('crypto').createHash('sha256').update(devices[0].firebaseToken.trim()).digest('hex');
          if (fingerprint === saved.oldRegistration.tokenFingerprint || outbox[0].firebaseDeliveryRequested !== true
              || Object.keys(outbox[0].firebaseDevices?.[actors[2]] || {}).length !== 1
              || outbox[0].firebaseDevices[actors[2]][devices[0].deviceId] !== fingerprint
              || Object.keys(outbox[0].firebaseDevices?.[actors[1]] || {}).length) Q.fail('Replacement outbox must target only the new provider registration');
        }
        if (name !== 'permission-denied' && (outbox[0].status !== 'sent'
            || outbox[0].tokenSuccessCount !== 1 || outbox[0].tokenFailureCount !== 0)) Q.fail('One successful provider-token delivery is not proven');
      }
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: saved._id }, { $set: { phase }, $push: {
      savepoints: { name, capturedAt: Q.nowIso(), snapshots: Q.snapshotSpecs(specs) }
    } });
    status();
  }
  function adoptForeground() {
    const saved = state();
    if (saved.phase !== 'baseline' || saved.foregroundMessageIds?.length) Q.fail('Foreground adoption requires the unrecorded baseline phase');
    const messages = Q.collection('chatMessages').find({ chatId }).toArray();
    if (!messages.length || messages.some(m => m.senderAvatar?.id !== actors[0]
        || m.sentAtIso < saved.stagedAtIso)) Q.fail('Only current fixture sender messages can be adopted');
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: saved._id }, { $set: { foregroundMessageIds: messages.map(m => m.id) } });
    status();
  }
  function recoverForegroundWorker() {
    const saved = state();
    if (saved.phase !== 'baseline' || !saved.foregroundMessageIds?.length || saved.workerRecovery) Q.fail('Recovery is limited to the recorded foreground failure');
    const owned = Q.collection('notificationOutbox').find({ ...related, 'payload.messageId': { $in: saved.foregroundMessageIds } }).toArray();
    const running = owned.filter(n => n.status === 'running');
    const rule = Q.collection('notificationRuleConfigs').findOne({ ruleKey: 'notification-outbox' });
    if (running.length !== 1 || rule?.runState?.currentStatus !== 'running'
        || owned.some(n => n.tokenSuccessCount || n.tokenFailureCount)
        || Q.collection('notificationOutbox').countDocuments({ status: { $in: ['pending','running'] }, _id: { $nin: owned.map(n => n._id) } })) Q.fail('Worker state is not isolated to the failed foreground sends');
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: saved._id }, { $set: { workerRecovery: {
      capturedAt: Q.nowIso(), reason: 'Old backend stopped after SDK classpath NoSuchMethodError; replacement started with upgraded dependency.',
      outbox: owned, rule
    } } });
    Q.collection('notificationOutbox').updateOne({ _id: running[0]._id, status: 'running', lockedUntil: running[0].lockedUntil }, {
      $set: { status: 'pending', nextRetryAt: Q.nowIso() }, $unset: { lockedUntil: '' }
    });
    Q.collection('notificationRuleConfigs').updateOne({ _id: rule._id, 'runState.startedAtIso': rule.runState.startedAtIso }, {
      $set: { 'runState.currentStatus': 'failed', 'runState.finishedAtIso': Q.nowIso(),
        'runState.progressDetail': 'QA fixture released the stopped pre-upgrade worker; same outbox will retry.' }
    });
    status();
  }
  function prepareDeviceIdentity() {
    const saved = state();
    if (saved.phase !== 'awaiting-device-registration' || Q.collection('chatMessages').countDocuments({ chatId })) Q.fail('Identity preparation is limited to the initial baseline');
    const email = 'mobile-push-riley@qa.myscoutee.test';
    if (Q.collection('users').countDocuments({ email, userId: { $ne: actors[2] } })) Q.fail('Fixture identity email is already used');
    Q.collection('users').updateOne({ userId: actors[2] }, { $set: { email } });
    Q.printObject({ scenario, phase: saved.phase, physicalActor: actors[2], providerIdentityPrepared: true });
  }
  function captureOldRegistration() {
    const saved = state(), devices = Q.ensureUser(actors[2]).devices || [];
    if (saved.phase !== 'permission-denied' || saved.oldRegistration || devices.length !== 1
        || !devices[0].firebaseToken || devices[0].notificationsEnabled !== false) Q.fail('Expected one denied registration before supported revoke');
    const tokenFingerprint = require('crypto').createHash('sha256').update(devices[0].firebaseToken.trim()).digest('hex');
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: saved._id }, { $set: {
      oldRegistration: { deviceId: devices[0].deviceId, tokenFingerprint, capturedAt: Q.nowIso() }
    } });
    Q.printObject({ scenario, oldDeviceId: devices[0].deviceId, registrationFingerprintCaptured: true });
  }
  function captureReplacementRegistration() {
    const saved = state(), devices = Q.ensureUser(actors[2]).devices || [];
    if (saved.phase !== 'permission-denied' || !saved.oldRegistration || devices.length !== 1
        || !devices[0].firebaseToken || devices[0].notificationsEnabled !== true) Q.fail('Expected one enabled replacement registration');
    const fingerprint = require('crypto').createHash('sha256').update(devices[0].firebaseToken.trim()).digest('hex');
    if (fingerprint === saved.oldRegistration.tokenFingerprint) Q.fail('Provider token has not changed');
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: saved._id }, { $set: {
      replacementRegistration: { deviceId: devices[0].deviceId, tokenFingerprint: fingerprint, capturedAt: Q.nowIso() }
    } });
    Q.printObject({ scenario, deviceId: devices[0].deviceId, currentRegistrations: 1, providerTokenChanged: true });
  }
  function reset() {
    const saved = state();
    if (Q.collection('chatMessages').countDocuments({ chatId, text: { $not: /^MOBILE-PUSH-LIFECYCLE-001 / },
        id: { $nin: saved.foregroundMessageIds || [] } })) Q.fail('Unexpected message; review before reset');
    // The retained September 15 baseline predates login snapshots. Only remove
    // this run's exact actor/attempt identities; never replace historical sessions.
    if (!saved.snapshots.some(s => s.collection === 'userLoginAudits')) {
      const audits = Q.collection('userLoginAudits').find({ ...userSelector,
        attemptedAtIso: { $gte: saved.stagedAtIso } }).toArray();
      for (const audit of audits) {
        if (!audit.attemptId || !audit.sessionId || !['demo', 'firebase'].includes(audit.provider))
          Q.fail('Unexpected login ownership; preserve retained rollback state');
      }
      const attempts = audits.map(a => a.attemptId);
      Q.collection('notificationOutbox').deleteMany({ ...securityOutbox, entityId: { $in: attempts } });
      Q.collection('userNotifications').deleteMany({ ...securityInbox, sourceId: { $in: attempts } });
      for (const userId of actors) {
        const sessions = audits.filter(a => a.userId === userId).map(a => a.sessionId);
        Q.collection('userSessionStates').updateOne({ _id: userId }, {
          $pull: { activeSessions: { sessionId: { $in: sessions } } }
        });
      }
      Q.collection('userSessionActions').deleteMany({ ...userSelector, createdDate: { $gte: saved.stagedAtIso } });
      Q.collection('userLoginAudits').deleteMany({ _id: { $in: audits.map(a => a._id) } });
    }
    Q.restoreSnapshots(saved.snapshots);
    const canonical = docs => docs.map(d => EJSON.stringify(d)).sort();
    for (const snapshot of saved.snapshots) {
      const actual = Q.collection(snapshot.collection).find(snapshot.selector).toArray();
      if (JSON.stringify(canonical(actual)) !== JSON.stringify(canonical(snapshot.documents || [])))
        Q.fail(`Restored baseline differs in ${snapshot.collection}; snapshot retained`);
    }
    Q.printObject({ restoredCollections: saved.snapshots.length, baselineVerified: true });
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: saved._id });
    status();
  }
  function popupRegistration(enabled) {
    const saved = state(), user = Q.ensureUser(actors[2]), devices = user.devices || [];
    if (saved.phase !== 'background-settings' || devices.length !== 1 || !devices[0].firebaseToken) Q.fail('Popup oracle requires the retained single-device Chrome boundary');
    if (!enabled) {
      if (saved.popupRegistrationSnapshot || devices[0].notificationsEnabled !== true) Q.fail('Popup oracle already prepared or registration disabled');
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: saved._id }, { $set: { popupRegistrationSnapshot: devices[0] } });
    } else {
      const before = saved.popupRegistrationSnapshot;
      if (!before || saved.popupRegistrationRestoredAt || before.deviceId !== devices[0].deviceId
          || before.firebaseToken !== devices[0].firebaseToken || devices[0].notificationsEnabled !== false) Q.fail('Registration identity changed during popup oracle');
    }
    Q.collection('users').updateOne({ userId: actors[2], 'devices.0.deviceId': devices[0].deviceId }, {
      $set: { 'devices.0.notificationsEnabled': enabled }
    });
    if (enabled) Q.collection(Q.STATE_COLLECTION).updateOne({ _id: saved._id }, { $set: { popupRegistrationRestoredAt: Q.nowIso() } });
    Q.printObject({ scenario, phase: saved.phase, notificationsEnabled: enabled, tokenAndDevicePreserved: true });
  }
  switch (Q.text(process.env.MANUAL_QA_COMMAND)) {
    case 'stage': stage(); break;
    case 'status': status(); break;
    case 'capture': capture(); break;
    case 'adopt-foreground': adoptForeground(); break;
    case 'recover-foreground-worker': recoverForegroundWorker(); break;
    case 'popup-registration-off': popupRegistration(false); break;
    case 'popup-registration-restore': popupRegistration(true); break;
    case 'prepare-device-identity': prepareDeviceIdentity(); break;
    case 'reset': reset(); break;
    default: Q.fail('Unsupported Push command');
  }
})();
