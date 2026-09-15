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
    const expectedTargets = ['1b1c70be2349b3359a8f6f94','9f3b3f085e23af6c89dbc432','b29df68956f3fe15e04558de'];
    if (f.context.actorUserId !== '23820c1e76d3bd843f61c799' || !Q.sameJson([...f.context.targetUserIds].sort(),expectedTargets.sort()))
      Q.fail('Prepared actors differ from the versioned feedback browser configuration');
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
  } else if (command === 'prepare-rating-baseline') {
    const saved = Q.activeState(scenario, true), f = fixture();
    if (!f || saved.ratingBaselinePreparedAtIso) Q.fail('Rating baseline preparation already started or fixture missing');
    if (Q.collection('eventFeedbackAnswers').countDocuments({viewerUserId:saved.context.actorUserId,eventId:saved.context.eventId})) Q.fail('Prepare the rating baseline before feedback submission');
    if (Q.collection('affinityRecomputeTasks').countDocuments({targetId:{$in:saved.context.targetUserIds},status:{$in:['pending','running']}})) Q.fail('Target work already pending');
    const now=Q.nowIso();
    for (const userId of saved.context.targetUserIds) {
      Q.collection('affinityRecomputeTasks').updateOne({taskKey:`USER:${userId}`},{$set:{targetType:'USER',targetId:userId,reasons:['USER_CHANGED'],status:'pending',pendingCounterTracked:false,availableAtIso:now,rerunRequested:false,attemptCount:0,updatedDate:now,updatedUser:'manual-qa'},$setOnInsert:{version:0,createdDate:now}},{upsert:true});
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({_id:saved._id},{$set:{ratingBaselinePreparedAtIso:now}});
  } else if (command === 'capture-rating-baseline') {
    const saved = Q.activeState(scenario, true), f = fixture();
    if (!saved.ratingBaselinePreparedAtIso || !f) Q.fail('Prepare the normal-worker baseline first');
    if (saved.ratingBaseline) Q.fail('Rating baseline already captured');
    const tasks=Q.collection('affinityRecomputeTasks').find({targetId:{$in:saved.context.targetUserIds}}).toArray();
    if(tasks.length!==saved.context.targetUserIds.length || tasks.some(t=>t.status!=='done')) Q.fail('Wait for all baseline tasks to finish');
    if(Q.collection('eventFeedbackAnswers').countDocuments({viewerUserId:saved.context.actorUserId,eventId:saved.context.eventId})) Q.fail('Capture before submission');
    const snapshot=f.snapshots.find(s=>s.collection==='userRates');
    Q.collection(Q.STATE_COLLECTION).updateOne({_id:saved._id},{$set:{ratingBaseline:Q.collection('userRates').find(snapshot.selector).toArray(),ratingBaselineCapturedAtIso:Q.nowIso()}});
  } else if (command === 'make-recompute-due') {
    const saved = Q.activeState(scenario, true), f = fixture();
    if (!f || f.variation !== 'feedback') Q.fail('Active feedback fixture required');
    const selector = { targetId: { $in: saved.context.targetUserIds }, status: 'pending', updatedDate: { $gte: f.preparedAtIso } };
    const result = Q.collection('affinityRecomputeTasks').updateMany(selector, { $set: { availableAtIso: Q.nowIso() } });
    Q.printObject({ madeDue: result.modifiedCount, detail: 'Only this feedback fixture’s pending tasks are due; the normal worker processes them.' });
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
  } else if (command !== 'status') Q.fail('Use stage|status|make-recompute-due|verify-reset-ready|reset bell-feedback BELL-RATING-FEEDBACK-001');
  const saved = Q.activeState(scenario);
  Q.printObject({ checkpointId, phase: saved?.phase || 'not-staged', context: saved?.context });
})();
