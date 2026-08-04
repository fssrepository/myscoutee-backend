/* global ManualQa, db, process */
(() => {
  "use strict";
  const Q = ManualQa;
  const SCENARIO = "stat-010";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const actorUserId = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID)
    || "650000000000000000000061";
  const targetUserId = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID)
    || "650000000000000000000062";

  function logicalNotificationSelector(rateId, senderUserId = actorUserId) {
    return {
      kind: "user-rated",
      sourceType: "user-rate",
      sourceId: Q.text(rateId),
      senderUserId
    };
  }

  function logicalOutboxSelector(rateId, senderUserId = actorUserId) {
    return {
      notificationType: "user-rated",
      entityType: "user-rate",
      entityId: Q.text(rateId),
      "payload.senderUserId": senderUserId
    };
  }

  function selectedRate() {
    const rows = Q.collection("userRates").find({
      mode: "single",
      ownerUserId: actorUserId,
      relatedUserId: targetUserId
    }).limit(2).toArray();
    if (rows.length !== 1) {
      Q.fail(`expected exactly one single rating row for ${actorUserId} -> ${targetUserId}, found ${rows.length}.`);
    }
    return rows[0];
  }

  function unreadProjection(userId) {
    const user = Q.ensureUser(userId, "rating user");
    const activities = user.activities || {};
    return {
      present: Object.prototype.hasOwnProperty.call(activities, "notifications"),
      value: activities.notifications,
      actualUnread: Q.collection("userNotifications").countDocuments({
        recipientUserId: userId,
        readAtIso: null
      })
    };
  }

  function reconcileUnread(userId) {
    const count = Q.collection("userNotifications").countDocuments({
      recipientUserId: userId,
      readAtIso: null
    });
    Q.collection("users").updateOne(
      { userId },
      {
        $set: { "activities.notifications": count }
      }
    );
  }

  function restoreProjection(userId, saved) {
    const update = saved && saved.present
      ? { $set: { "activities.notifications": saved.value } }
      : { $unset: { "activities.notifications": "" } };
    Q.collection("users").updateOne({ userId }, update);
  }

  function statsOracle() {
    const stats = Q.collection("adminStats").findOne({ statsKey: "global" }) || {};
    const monitoring = Q.collection("adminMonitoring").findOne({ monitoringKey: "global" }) || {};
    const today = new Date().toISOString().slice(0, 10);
    return {
      statsRatesSynced: Q.mapNumber(stats.counters, "rates.synced"),
      todayRatings: Q.mapNumber(stats.dailyActivity && stats.dailyActivity[today], "ratings"),
      monitoringRatesSynced: Q.mapNumber(monitoring.counters, "rates.synced")
    };
  }

  function stage() {
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    if (actorUserId === targetUserId) Q.fail("rating actor and target must differ.");
    Q.ensureUser(actorUserId, "rating actor");
    Q.ensureUser(targetUserId, "rating target");
    const rate = selectedRate();
    const rateId = Q.text(rate._id);
    const outboxSelector = logicalOutboxSelector(rateId);
    if (Q.collection("notificationOutbox").countDocuments({
      $and: [outboxSelector, { pendingCounterTracked: true }]
    }) > 0) {
      Q.fail("the selected rating still has tracked outbox work; wait for the real worker and retry.");
    }
    const notificationSelector = logicalNotificationSelector(rateId);
    const specs = [
      {
        collection: "userRates",
        selector: {
          $or: [
            { _id: rate._id },
            { ownerUserId: actorUserId, relatedUserId: targetUserId },
            { ownerUserId: targetUserId, relatedUserId: actorUserId }
          ]
        }
      },
      { collection: "notificationOutbox", selector: outboxSelector },
      {
        collection: "userNotifications",
        selector: {
          $and: [notificationSelector, { recipientUserId: { $in: [actorUserId, targetUserId] } }]
        }
      },
      {
        collection: "affinityRecomputeTasks",
        selector: { targetId: { $in: [actorUserId, targetUserId] } }
      },
      {
        collection: "userAffinityEdges",
        selector: {
          $or: [
            { leftUserId: { $in: [actorUserId, targetUserId] } },
            { rightUserId: { $in: [actorUserId, targetUserId] } }
          ]
        }
      }
    ];
    const stagedAtIso = Q.nowIso();
    const state = {
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      database: db.getName(),
      stagedAtIso,
      context: { actorUserId, targetUserId, rateId },
      baseline: statsOracle(),
      unreadProjection: {
        actor: unreadProjection(actorUserId),
        target: unreadProjection(targetUserId)
      },
      snapshots: Q.snapshotSpecs(specs)
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    try {
      Q.collection("userNotifications").deleteMany({
        $and: [notificationSelector, { recipientUserId: { $in: [actorUserId, targetUserId] } }]
      });
      Q.collection("notificationOutbox").deleteMany(outboxSelector);
      Q.collection("affinityRecomputeTasks").deleteMany({
        targetId: { $in: [actorUserId, targetUserId] }
      });
      Q.collection("userRates").updateOne(
        { _id: rate._id },
        {
          $set: {
            scoreGiven: 0,
            mutuallyRated: false,
            updatedDate: stagedAtIso,
            updatedUser: Q.ACTOR
          },
          $unset: { personalityTraitIds: "", selectedTraitIds: "" }
        }
      );
      reconcileUnread(actorUserId);
      reconcileUnread(targetUserId);
    } catch (error) {
      Q.fail(`stage failed after snapshot: ${Q.text(error && error.message)}. Run reset stat-010.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      phase: "baseline-ready",
      stagedAtIso,
      actor: Q.user(actorUserId),
      target: Q.user(targetUserId),
      rateId,
      baseline: state.baseline,
      expectedBeforeSave: { scoreGiven: 0, logicalOutbox: 0, targetBell: 0 },
      next: "Use a fresh isolated actor session. Select 4, verify selection is local, press Save once, and wait for the real frontend batch before status stat-010."
    });
  }

  function status() {
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({ scenario: SCENARIO, phase: "not-staged", next: "Run stage stat-010." });
      return;
    }
    const stagedActorUserId = state.context.actorUserId;
    const stagedTargetUserId = state.context.targetUserId;
    const rate = Q.collection("userRates").findOne({
      mode: "single",
      ownerUserId: stagedActorUserId,
      relatedUserId: stagedTargetUserId
    });
    const notificationSelector = logicalNotificationSelector(
      state.context.rateId,
      stagedActorUserId
    );
    const outboxSelector = logicalOutboxSelector(state.context.rateId, stagedActorUserId);
    const outboxes = Q.collection("notificationOutbox").find({
      $and: [outboxSelector, { createdDate: { $gt: state.stagedAtIso } }]
    }).toArray();
    const bells = Q.collection("userNotifications").find({
      $and: [notificationSelector, { createdDate: { $gt: state.stagedAtIso } }]
    }).toArray();
    const targetBells = bells.filter(item => Q.text(item.recipientUserId) === stagedTargetUserId);
    const actorBells = bells.filter(item => Q.text(item.recipientUserId) === stagedActorUserId);
    const targetProjection = unreadProjection(stagedTargetUserId);
    const current = statsOracle();
    const delta = {
      statsRatesSynced: current.statsRatesSynced - state.baseline.statsRatesSynced,
      todayRatings: current.todayRatings - state.baseline.todayRatings,
      monitoringRatesSynced: current.monitoringRatesSynced - state.baseline.monitoringRatesSynced
    };
    const exactOutbox = outboxes.length === 1
      && (outboxes[0].recipientUserIds || []).length === 1
      && outboxes[0].recipientUserIds[0] === stagedTargetUserId;
    const exactBell = targetBells.length === 1
      && targetBells[0].readAtIso == null
      && Q.text(targetBells[0].sourceId) === state.context.rateId;
    const validation = {
      scoreSavedAsFour: Q.number(rate && rate.scoreGiven) === 4,
      exactSingleOutbox: exactOutbox,
      exactSingleUnreadTargetBell: exactBell,
      actorExcluded: actorBells.length === 0,
      unreadProjectionMatches: targetProjection.actualUnread === Q.number(targetProjection.value),
      statisticsExactDelta: delta.statsRatesSynced === 1 && delta.todayRatings === 1,
      monitoringExactDelta: delta.monitoringRatesSynced === 1
    };
    const complete = Object.values(validation).every(Boolean);
    Q.printObject({
      scenario: SCENARIO,
      phase: complete ? "completed" : Q.number(rate && rate.scoreGiven) > 0 ? "materializing" : "waiting-for-save",
      actor: Q.user(stagedActorUserId),
      target: Q.user(stagedTargetUserId),
      rate: rate && { id: rate._id, scoreGiven: rate.scoreGiven, updatedDate: rate.updatedDate },
      current,
      delta,
      outboxCount: outboxes.length,
      targetBellCount: targetBells.length,
      actorBellCount: actorBells.length,
      validation,
      next: complete
        ? "Capture the card, target bell, Statistics, and Monitoring; then reset stat-010."
        : "If Save was pressed, wait for the frontend batch and Statistics/Monitoring workers, then run status again."
    });
  }

  function reset() {
    const state = Q.activeState(SCENARIO, true);
    const tracked = Q.collection("notificationOutbox").countDocuments({
      $and: [
        logicalOutboxSelector(state.context.rateId, state.context.actorUserId),
        { pendingCounterTracked: true }
      ]
    });
    if (tracked > 0) Q.fail("rating outbox is still tracked by the worker; wait before reset.");
    Q.restoreSnapshots(state.snapshots);
    restoreProjection(state.context.actorUserId, state.unreadProjection.actor);
    restoreProjection(state.context.targetUserId, state.unreadProjection.target);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      phase: "reset-complete",
      restored: true,
      detail: "Selected rating/domain rows, logical notifications, affinity rows/tasks, and unread projections were restored; telemetry history was retained."
    });
  }

  Q.assertDeploymentSafety();
  if (command === "stage") stage();
  else if (command === "status") status();
  else if (command === "reset") reset();
  else Q.fail(`unsupported command '${command}' for ${SCENARIO}.`);
})();
