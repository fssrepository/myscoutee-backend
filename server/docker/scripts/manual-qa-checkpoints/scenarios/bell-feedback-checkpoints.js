/* global ManualQa, process */
(() => {
  const Q = ManualQa, scenario = 'bell-feedback', checkpointId = 'BELL-RATING-FEEDBACK-001';
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const fixture = () => Q.collection('adminJobFixtureSnapshots').findOne({ job: 'bell-rating-feedback' });
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== checkpointId) Q.fail('Expected the Bell feedback browser checkpoint');
  if (command === 'stage') {
    Q.assertNotStaged(scenario); Q.assertNoOtherActiveScenario(scenario);
    const f = fixture();
    if (f?.variation !== 'feedback') Q.fail('Prepare bell-rating-feedback feedback first');
    const actors = [f.context.actorUserId, ...f.context.targetUserIds];
    if (f.context.actorUserId !== '23820c1e76d3bd843f61c799' || !actors.includes('1b1c70be2349b3359a8f6f94'))
      Q.fail('Prepared actors differ from the versioned Lucas/Maya browser configuration');
    const specs = [
      ...['userLoginAudits', 'userSessionActions', 'userSessionStates'].map(collection => ({
        collection, selector: { $or: [{ userId: { $in: actors } }, { _id: { $in: actors } }] }
      })),
      { collection: 'userNotifications', selector: { kind: 'security-login', recipientUserId: { $in: actors } } },
      { collection: 'notificationOutbox', selector: { notificationType: 'security-login', createdUser: { $in: actors } } }
    ];
    Q.collection(Q.STATE_COLLECTION).insertOne({ _id: Q.stateId(scenario), scenario, checkpointId,
      phase: 'feedback-ready', stagedAtIso: Q.nowIso(), context: f.context,
      snapshots: Q.snapshotSpecs(specs), fixtureSnapshots: f.snapshots });
  } else if (command === 'verify-reset-ready') {
    const saved = Q.activeState(scenario, true), c = saved.context;
    const ids = [c.actorUserId, ...c.targetUserIds];
    if (Q.collection('affinityRecomputeTasks').countDocuments({ targetId: { $in: ids }, status: { $in: ['pending','running'] } }))
      Q.fail('Wait for the feedback affinity tasks before resetting');
    if (Q.collection('notificationOutbox').countDocuments({ entityId: c.eventId, 'payload.senderUserId': c.actorUserId, pendingCounterTracked: true }))
      Q.fail('Wait for the feedback outbox before resetting');
  } else if (command === 'reset') {
    if (fixture()) Q.fail('Reset the bell-rating-feedback Admin fixture first');
    const saved = Q.activeState(scenario, true);
    Q.restoreSnapshots(saved.snapshots);
    const byId = docs => docs.sort((a,b) => String(a._id).localeCompare(String(b._id)));
    for (const snapshot of [...saved.snapshots, ...saved.fixtureSnapshots]) {
      if (!Q.sameJson(byId(Q.collection(snapshot.collection).find(snapshot.selector).toArray()), byId(snapshot.documents)))
        Q.fail(`Restored ${snapshot.collection} differs; snapshot retained`);
    }
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: saved._id });
  } else if (command !== 'status') Q.fail('Use stage|status|verify-reset-ready|reset bell-feedback BELL-RATING-FEEDBACK-001');
  const saved = Q.activeState(scenario);
  Q.printObject({ checkpointId, phase: saved?.phase || 'not-staged', context: saved?.context });
})();
