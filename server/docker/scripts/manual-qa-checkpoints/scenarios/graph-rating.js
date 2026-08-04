/* global ManualQa, db, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "graph-rating";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const actorUserId = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID)
    || "650000000000000000000061";
  const targetUserId = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID)
    || "650000000000000000000062";
  const pairUserIds = [actorUserId, targetUserId].sort();
  const pairKey = pairUserIds.join(":");

  function pairRateSelector() {
    return {
      mode: "single",
      $or: [
        { ownerUserId: actorUserId, relatedUserId: targetUserId },
        { ownerUserId: targetUserId, relatedUserId: actorUserId }
      ]
    };
  }

  function pairOutboxSelector() {
    return {
      notificationType: "user-rated",
      $or: [
        { "payload.senderUserId": actorUserId, recipientUserIds: targetUserId },
        { "payload.senderUserId": targetUserId, recipientUserIds: actorUserId }
      ]
    };
  }

  function pairNotificationSelector() {
    return {
      kind: "user-rated",
      $or: [
        { senderUserId: actorUserId, recipientUserId: targetUserId },
        { senderUserId: targetUserId, recipientUserId: actorUserId }
      ]
    };
  }

  function pairLayoutEdgeSelector(layoutVersion) {
    return {
      layoutVersion,
      $or: [
        { sourceUserId: pairUserIds[0], targetUserId: pairUserIds[1] },
        { sourceUserId: pairUserIds[1], targetUserId: pairUserIds[0] }
      ]
    };
  }

  function optionalField(source, key) {
    return source && Object.prototype.hasOwnProperty.call(source, key)
      ? { present: true, value: source[key] }
      : { present: false, value: null };
  }

  function activitySnapshot(userId) {
    const user = Q.ensureUser(userId, "graph-rating user");
    return { userId, activities: optionalField(user, "activities") };
  }

  function restoreActivities(saved) {
    if (!saved || !Q.text(saved.userId)) return;
    const update = saved.activities && saved.activities.present
      ? { $set: { activities: saved.activities.value } }
      : { $unset: { activities: "" } };
    const result = Q.collection("users").updateOne({ userId: saved.userId }, update);
    if (result.matchedCount !== 1) Q.fail(`user '${saved.userId}' disappeared before reset.`);
  }

  function reconcileUnread(userId) {
    const count = Q.collection("userNotifications").countDocuments({
      recipientUserId: userId,
      readAtIso: null
    });
    Q.collection("users").updateOne(
      { userId },
      { $set: { "activities.notifications": count } }
    );
  }

  function activeConfigSummary() {
    const config = Q.collection("affinityConfigs").find({ active: true })
      .sort({ version: -1 }).limit(1).toArray()[0] || {};
    return {
      version: config.version,
      ratingSingleMutual: Q.number(config.rating && config.rating.singleMutual
        && config.rating.singleMutual.multiplier),
      ratingSingleOneSided: Q.number(config.rating && config.rating.singleOneSided
        && config.rating.singleOneSided.multiplier),
      evidenceMutualSingle: Q.number(config.evidence && config.evidence.mutualSingle
        && config.evidence.mutualSingle.multiplier),
      evidenceSingleOneSided: Q.number(config.evidence && config.evidence.singleOneSided
        && config.evidence.singleOneSided.multiplier),
      evidenceMet: Q.number(config.evidence && config.evidence.met
        && config.evidence.met.multiplier)
    };
  }

  function rateSummary() {
    return Q.collection("userRates").find(pairRateSelector()).sort({ ownerUserId: 1 }).toArray()
      .map(rate => ({
        id: Q.text(rate._id),
        ownerUserId: Q.text(rate.ownerUserId),
        relatedUserId: Q.text(rate.relatedUserId),
        scoreGiven: Q.number(rate.scoreGiven),
        scoreReceived: Q.number(rate.scoreReceived),
        mutuallyRated: rate.mutuallyRated === true,
        met: rate.met === true,
        affinityScore: Q.number(rate.affinityScore),
        evidenceConfidence: Q.number(rate.evidenceConfidence),
        updatedDate: rate.updatedDate
      }));
  }

  function latestLayoutSummary() {
    const layout = Q.collection("adminAffinityGraphLayouts").find({})
      .sort({ generatedAtIso: -1 }).limit(1).toArray()[0] || null;
    if (!layout) {
      return {
        source: "live-user-affinity-edges",
        layoutVersion: null,
        generatedAtIso: null,
        pairEdge: null
      };
    }
    const edge = Q.collection("adminAffinityGraphEdges")
      .findOne(pairLayoutEdgeSelector(Q.text(layout.layoutVersion)));
    return {
      source: "materialized-layout",
      layoutVersion: Q.text(layout.layoutVersion),
      generatedAtIso: layout.generatedAtIso,
      pairEdge: edge && {
        sourceUserId: Q.text(edge.sourceUserId),
        targetUserId: Q.text(edge.targetUserId),
        weight: Q.number(edge.weight),
        affinityScore: Q.number(edge.affinityScore)
      }
    };
  }

  function directEdgeSummary() {
    const edge = Q.collection("userAffinityEdges").findOne({ pairKey });
    return edge && {
      pairKey: Q.text(edge.pairKey),
      leftUserId: Q.text(edge.leftUserId),
      rightUserId: Q.text(edge.rightUserId),
      affinityScore: Q.number(edge.affinityScore),
      edgeWeight: Q.number(edge.edgeWeight),
      evidence: {
        mutualSingleCount: Q.number(edge.evidence && edge.evidence.mutualSingleCount),
        singleOneSidedCount: Q.number(edge.evidence && edge.evidence.singleOneSidedCount),
        metCount: Q.number(edge.evidence && edge.evidence.metCount),
        strongestAffinityScore: Q.number(edge.evidence && edge.evidence.strongestAffinityScore),
        totalMultiplier: Q.number(edge.evidence && edge.evidence.totalMultiplier)
      },
      updatedDate: edge.updatedDate
    };
  }

  function stage() {
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    if (actorUserId === targetUserId) Q.fail("rating users must differ.");
    Q.ensureUser(actorUserId, "first rating user");
    Q.ensureUser(targetUserId, "reciprocal rating user");
    const forwardRows = Q.collection("userRates").find({
      mode: "single",
      ownerUserId: actorUserId,
      relatedUserId: targetUserId
    }).limit(2).toArray();
    if (forwardRows.length !== 1) {
      Q.fail(`expected one controlled forward rating row, found ${forwardRows.length}.`);
    }
    const stagedAtIso = Q.nowIso();
    const state = {
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      database: db.getName(),
      stagedAtIso,
      context: {
        actorUserId,
        targetUserId,
        pairKey,
        forwardRateId: forwardRows[0]._id
      },
      config: activeConfigSummary(),
      activities: [activitySnapshot(actorUserId), activitySnapshot(targetUserId)],
      snapshots: Q.snapshotSpecs([
        { collection: "userRates", selector: pairRateSelector() },
        { collection: "notificationOutbox", selector: pairOutboxSelector() },
        { collection: "userNotifications", selector: pairNotificationSelector() },
        { collection: "affinityRecomputeTasks", selector: { targetId: { $in: pairUserIds } } },
        { collection: "userAffinityEdges", selector: { pairKey } }
      ])
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    try {
      Q.collection("notificationOutbox").deleteMany(pairOutboxSelector());
      Q.collection("userNotifications").deleteMany(pairNotificationSelector());
      Q.collection("affinityRecomputeTasks").deleteMany({ targetId: { $in: pairUserIds } });
      Q.collection("userAffinityEdges").deleteMany({ pairKey });
      Q.collection("userRates").deleteMany({
        mode: "single",
        ownerUserId: targetUserId,
        relatedUserId: actorUserId
      });
      Q.collection("userRates").updateOne(
        { _id: forwardRows[0]._id },
        {
          $set: {
            scoreGiven: 0,
            scoreReceived: 0,
            mutuallyRated: false,
            updatedDate: stagedAtIso,
            updatedUser: Q.ACTOR
          }
        }
      );
      reconcileUnread(actorUserId);
      reconcileUnread(targetUserId);
    } catch (error) {
      Q.fail(`stage failed after snapshot: ${Q.text(error && error.message)}. Run reset graph-rating.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: "GRAPH-RATING-001",
      phase: "baseline-ready",
      stagedAtIso,
      firstUser: Q.user(actorUserId),
      reciprocalUser: Q.user(targetUserId),
      pairKey,
      activeMultipliers: state.config,
      baseline: {
        rates: rateSummary(),
        directEdge: directEdgeSummary(),
        graphLayout: latestLayoutSummary()
      },
      why: "Prove the two-browser reciprocal-rating path, mutual affinity evidence, and Admin Affinity Graph projection without assuming that reciprocity is the pair's only evidence.",
      next: "In the firstUser session select rating 4 for reciprocalUser and Save once. Wait for the real frontend batch, then run status graph-rating before rating back."
    });
  }

  function status() {
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId: "GRAPH-RATING-001",
        phase: "not-staged",
        next: "Run stage graph-rating only when no other manual checkpoint is active."
      });
      return;
    }
    const rates = rateSummary();
    const forward = rates.find(rate => rate.ownerUserId === state.context.actorUserId) || null;
    const reverse = rates.find(rate => rate.ownerUserId === state.context.targetUserId) || null;
    const forwardSaved = Q.number(forward && forward.scoreGiven) > 0;
    const reverseSaved = Q.number(reverse && reverse.scoreGiven) > 0;
    const reciprocalSaved = forwardSaved && reverseSaved;
    const directEdge = directEdgeSummary();
    const graphLayout = latestLayoutSummary();
    const materializedAfterStage = graphLayout.source === "materialized-layout"
      && Q.text(graphLayout.generatedAtIso) > Q.text(state.stagedAtIso);
    const validation = {
      forwardSaved,
      reverseSaved,
      reciprocalRowMarkedMutual: reciprocalSaved && rates.some(rate => rate.mutuallyRated),
      directEdgeExists: Boolean(directEdge && directEdge.edgeWeight > 0),
      mutualEvidencePresent: Boolean(directEdge && directEdge.evidence.mutualSingleCount > 0),
      materializedUiReady: graphLayout.source === "live-user-affinity-edges"
        || (materializedAfterStage && Boolean(graphLayout.pairEdge))
    };
    const phase = !forwardSaved
      ? "waiting-for-first-save"
      : !reverseSaved
        ? "one-way-rating-saved"
        : validation.reciprocalRowMarkedMutual
          && validation.directEdgeExists
          && validation.mutualEvidencePresent
          ? "reciprocal-affinity-ready"
          : "reciprocal-rating-materializing";
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: "GRAPH-RATING-001",
      phase,
      firstUser: Q.user(state.context.actorUserId),
      reciprocalUser: Q.user(state.context.targetUserId),
      pairKey: state.context.pairKey,
      activeMultipliers: state.config,
      rates,
      directEdge,
      graphLayout,
      recomputeTasks: Q.collection("affinityRecomputeTasks").find({
        targetId: { $in: pairUserIds },
        updatedDate: { $gt: state.stagedAtIso }
      }).toArray().map(task => ({
        targetId: Q.text(task.targetId),
        status: Q.text(task.status),
        reason: Q.text(task.reason),
        updatedDate: task.updatedDate
      })),
      pairOutboxCount: Q.collection("notificationOutbox").countDocuments({
        $and: [pairOutboxSelector(), { createdDate: { $gt: state.stagedAtIso } }]
      }),
      pairBellCount: Q.collection("userNotifications").countDocuments({
        $and: [pairNotificationSelector(), { createdDate: { $gt: state.stagedAtIso } }]
      }),
      validation,
      interpretation: {
        metEvidenceCanCreateAnEdgeBeforeReciprocity: rates.some(rate => rate.met)
          && Q.number(state.config.evidenceMet) > 0,
        oneSidedEvidenceCreatesAnEdge: Q.number(state.config.evidenceSingleOneSided) > 0,
        oldMaterializedLayoutNeedsRebuild: graphLayout.source === "materialized-layout"
          && !materializedAfterStage
      },
      next: phase === "one-way-rating-saved"
        ? "Capture this one-way oracle. In reciprocalUser's session open the received rating, select a non-zero rating for firstUser, Save once, wait for the real frontend batch, then run status again."
        : phase === "reciprocal-affinity-ready"
          ? "Reopen Admin Affinity Graph. Select the pair at depth 1 and compare the visible link with directEdge. If an old materialized layout is reported, record the stale checkpoint separately instead of blaming rating persistence."
          : "Wait for the relevant frontend batch or recompute worker and run status again."
    });
  }

  function reset() {
    const state = Q.activeState(SCENARIO, true);
    const tracked = Q.collection("notificationOutbox").countDocuments({
      $and: [pairOutboxSelector(), { pendingCounterTracked: true }]
    });
    if (tracked > 0) Q.fail("pair rating outbox is still tracked by the worker; wait before reset.");
    Q.restoreSnapshots(state.snapshots);
    for (const saved of state.activities || []) restoreActivities(saved);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: "GRAPH-RATING-001",
      phase: "reset-complete",
      restored: true,
      detail: "Both directional ratings, pair notifications/outbox, recompute tasks, direct affinity edge, and both activity projections were restored. Graph materializations were read-only in this scenario."
    });
  }

  Q.assertDeploymentSafety();
  if (command === "stage") stage();
  else if (command === "status") status();
  else if (command === "reset") reset();
  else Q.fail(`unsupported command '${command}' for ${SCENARIO}.`);
})();
