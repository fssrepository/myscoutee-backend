/* global ManualQa, process, EJSON */
(() => {
  'use strict';
  const Q = ManualQa, scenario = 'mobile-push', checkpoint = 'MOBILE-PUSH-LIFECYCLE-001';
  const prefix = 'manual-qa-checkpoint:v1:mobile-push';
  const actors = ['650000000000000000000061', '650000000000000000000062', '650000000000000000000063'];
  const chatId = `${prefix}:group-chat`, eventId = `${prefix}:event`, groupId = `${prefix}:group`, stageId = `${prefix}:stage`;
  const related = { $or: [{ sourceId: chatId }, { 'payload.chatId': chatId }, { 'payload.eventId': eventId }] };
  const userSelector = { userId: { $in: actors } };
  const specs = [
    { collection: 'users', selector: userSelector },
    { collection: 'chats', selector: { id: chatId } },
    { collection: 'chatMessages', selector: { chatId } },
    { collection: 'activityMembers', selector: { ownerId: { $in: [eventId, groupId] } } },
    { collection: 'notificationOutbox', selector: related },
    { collection: 'userNotifications', selector: related }
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
        unread: u.activities?.notifications || 0 };
    }), firebase: { active: firebase.active, revision: firebase.revision, baselineSource: saved.firebaseBaselineSource },
    messages: messages.map(m => ({ id: m.id, text: m.text, senderUserId: m.senderAvatar?.id })),
    inbox: inbox.map(n => ({ id: n._id, recipientUserId: n.recipientUserId, sourceId: n.sourceId, readAtIso: n.readAtIso })),
    outbox: outbox.map(n => ({ id: n._id, recipientUserId: n.recipientUserId, status: n.status,
      attemptCount: n.attemptCount, successCount: n.successCount, failureCount: n.failureCount })),
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
    if (!/^(baseline|foreground|background|background-settings|background-chrome|cold-start|permission-denied|replacement-token)$/.test(name)) Q.fail('Invalid Push savepoint');
    const riley = Q.ensureUser(actors[2]);
    if (name === 'baseline' && ((riley.devices || []).filter(d => d.firebaseToken).length !== 1
        || Q.collection('chatMessages').countDocuments({ chatId }) !== 0)) Q.fail('Baseline needs one real Riley registration and zero messages');
    if ((saved.savepoints || []).some(p => p.name === name)) Q.fail('Savepoint already exists');
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: saved._id }, { $set: { phase: name }, $push: {
      savepoints: { name, capturedAt: Q.nowIso(), snapshots: Q.snapshotSpecs(specs) }
    } });
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
  function reset() {
    const saved = state();
    if (Q.collection('chatMessages').countDocuments({ chatId, text: { $not: /^MOBILE-PUSH-LIFECYCLE-001 / } })) Q.fail('Unexpected message; review before reset');
    Q.restoreSnapshots(saved.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: saved._id });
    status();
  }
  switch (Q.text(process.env.MANUAL_QA_COMMAND)) {
    case 'stage': stage(); break;
    case 'status': status(); break;
    case 'capture': capture(); break;
    case 'prepare-device-identity': prepareDeviceIdentity(); break;
    case 'reset': reset(); break;
    default: Q.fail('Unsupported Push command');
  }
})();
