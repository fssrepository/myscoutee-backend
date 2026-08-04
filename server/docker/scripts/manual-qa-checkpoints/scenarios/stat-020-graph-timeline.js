/* global ManualQa, db, process */
(() => {
  "use strict";
  const Q = ManualQa;
  const SCENARIO = "stat-020";
  const RULE_KEY = "affinity-recompute";
  const TASK_ID = "manual-qa-checkpoint:v1:stat-020:task";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const requestedEventId = Q.text(process.env.MANUAL_QA_EVENT_ID);
  const delaySeconds = Number(process.env.MANUAL_QA_DELAY_SECONDS || 30);

  function graphSnapshot() {
    const stats = Q.collection("adminStats").findOne({ statsKey: "global" });
    if (!stats) Q.fail("the global Statistics snapshot is missing.");
    const today = new Date().toISOString().slice(0, 10);
    const timeline = stats.dailyGraphActivity || {};
    const historical = {};
    for (const key of Object.keys(timeline).sort()) {
      if (key < today) historical[key] = timeline[key];
    }
    return {
      generatedAtIso: stats.generatedAtIso,
      today,
      historical,
      todayPoint: timeline[today] || {},
      graphHealthScore: stats.graphHealthScore,
      graphMetrics: stats.graphMetrics || {},
      graphSignals: stats.graphSignals || {},
      graphBridgeUsers: stats.graphBridgeUsers || {},
      graphCommunities: stats.graphCommunities || {}
    };
  }

  function selectEvent() {
    const selector = requestedEventId
      ? { $or: [{ _id: requestedEventId }, { sourceId: requestedEventId }] }
      : {
          sourceId: { $exists: true, $nin: ["", null] },
          status: { $in: ["A", "active"] },
          createdUser: { $ne: Q.ACTOR }
        };
    const event = Q.collection("events").find(selector).sort({ sourceId: 1 }).limit(1).toArray()[0];
    if (!event) Q.fail("no stable active event is available for the controlled recompute task.");
    return event;
  }

  function stage() {
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    const rule = Q.assertRuleNotRunning(RULE_KEY);
    const activeWork = Q.collection("affinityRecomputeTasks").countDocuments({
      status: { $in: ["pending", "running"] }
    });
    if (activeWork !== 0) {
      Q.fail(`affinity recompute has ${activeWork} pending/running task(s); wait for a clean queue.`);
    }
    const event = selectEvent();
    const eventSourceId = Q.text(event.sourceId || event._id);
    const taskKey = `EVENT:${eventSourceId}`;
    const specs = [
      {
        collection: "affinityRecomputeTasks",
        selector: { $or: [{ _id: TASK_ID }, { taskKey }] }
      },
      {
        collection: "events",
        selector: { $or: [{ _id: event._id }, { sourceId: eventSourceId }] }
      }
    ];
    const stagedAtIso = Q.nowIso();
    const baseline = graphSnapshot();
    const state = {
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      database: db.getName(),
      stagedAtIso,
      scheduledAtIso: null,
      context: { eventSourceId, eventTitle: event.title, taskKey },
      baseline,
      originalRule: Q.ruleConfigSnapshot(rule),
      snapshots: Q.snapshotSpecs(specs)
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    try {
      Q.holdRule(
        RULE_KEY,
        1,
        "Manual QA graph baseline staged; the recompute task is held in the future."
      );
      Q.collection("affinityRecomputeTasks").deleteMany({
        $or: [{ _id: TASK_ID }, { taskKey }]
      });
      Q.collection("affinityRecomputeTasks").insertOne({
        _id: TASK_ID,
        version: 0,
        taskKey,
        targetType: "EVENT",
        targetId: eventSourceId,
        reasons: ["EVENT_CHANGED"],
        status: "pending",
        pendingCounterTracked: true,
        availableAtIso: "2099-01-01T00:00:00.000Z",
        rerunRequested: false,
        attemptCount: 0,
        createdDate: stagedAtIso,
        updatedDate: stagedAtIso,
        updatedUser: Q.ACTOR
      });
    } catch (error) {
      Q.fail(`stage failed after snapshot: ${Q.text(error && error.message)}. Run reset stat-020.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      phase: "baseline-ready",
      stagedAtIso,
      event: { sourceId: eventSourceId, title: event.title },
      historicalPointCount: Object.keys(baseline.historical).length,
      selectedHistoricalPoint: Object.keys(baseline.historical).sort()[0] || null,
      schedulerHoldSeconds: 3600,
      next: "Capture/export all graph points and one historical UI point. Open Admin Job and Statistics before schedule stat-020."
    });
  }

  function schedule() {
    const state = Q.activeState(SCENARIO, true);
    Q.assertRuleNotRunning(RULE_KEY);
    const task = Q.collection("affinityRecomputeTasks").findOne({ _id: TASK_ID });
    if (!task || task.status !== "pending" || Q.number(task.attemptCount) !== 0) {
      Q.fail("the controlled graph task is no longer in its untouched held state.");
    }
    const timing = Q.scheduleRule(RULE_KEY, delaySeconds);
    Q.collection("affinityRecomputeTasks").updateOne(
      { _id: TASK_ID, status: "pending", attemptCount: 0 },
      {
        $set: {
          availableAtIso: timing.expectedDueAtIso,
          updatedDate: timing.scheduledAtIso,
          updatedUser: Q.ACTOR
        }
      }
    );
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      { $set: { ...timing } }
    );
    Q.printObject({
      scenario: SCENARIO,
      phase: "scheduled-waiting",
      ...timing,
      note: "The persisted Admin Job and the normal affinity worker wake-up are both observable; status reports the actual trigger evidence rather than assuming attribution.",
      next: "Capture the Admin Job scheduled checkpoint, wait for automatic processing, Refresh Statistics, then run status stat-020."
    });
  }

  function status() {
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({ scenario: SCENARIO, phase: "not-staged", next: "Run stage stat-020." });
      return;
    }
    const task = Q.collection("affinityRecomputeTasks").findOne({ _id: TASK_ID });
    const current = graphSnapshot();
    const historicalUnchanged = Q.sameJson(state.baseline.historical, current.historical);
    const generatedAfterStage = Q.text(current.generatedAtIso) > Q.text(state.stagedAtIso);
    const taskCompleted = Boolean(task)
      && task.status === "done"
      && Q.number(task.attemptCount) === 1
      && task.pendingCounterTracked === false;
    const rule = Q.ruleSummary(RULE_KEY);
    const scheduledRuleObserved = Boolean(state.scheduledAtIso)
      && Q.text(rule.lastRunAtIso) >= Q.text(state.scheduledAtIso);
    const validation = {
      everyHistoricalPointUnchanged: historicalUnchanged,
      automaticTaskCompletedExactlyOnce: taskCompleted,
      statisticsRefreshedAfterStage: generatedAfterStage,
      persistedScheduledRuleObserved: scheduledRuleObserved
    };
    const complete = Object.values(validation).every(Boolean);
    Q.printObject({
      scenario: SCENARIO,
      phase: complete ? "completed" : taskCompleted ? "awaiting-statistics-refresh" : state.scheduledAtIso ? "scheduled-waiting" : "baseline-ready",
      event: state.context,
      task: task && {
        status: task.status,
        attemptCount: task.attemptCount,
        availableAtIso: task.availableAtIso,
        completedAtIso: task.completedAtIso,
        updatedUser: task.updatedUser,
        lastError: task.lastError
      },
      rule,
      validation,
      baselineGraph: state.baseline,
      currentGraph: current,
      next: complete
        ? "Reselect the saved historical UI point, capture it plus Admin Job, then reset stat-020."
        : "Wait for automatic completion or press only the Statistics Refresh button, then run status again."
    });
  }

  function reset() {
    const state = Q.activeState(SCENARIO, true);
    Q.assertRuleNotRunning(RULE_KEY);
    const task = Q.collection("affinityRecomputeTasks").findOne({ _id: TASK_ID });
    if (task && task.status === "running") Q.fail("controlled recompute task is running; retry reset after terminal state.");
    Q.restoreSnapshots(state.snapshots);
    Q.restoreRuleConfig(state.originalRule);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      phase: "reset-complete",
      restored: true,
      detail: "The selected event/task and original scheduler configuration were restored. Run history and the graph evidence captured by Statistics were not rewound."
    });
  }

  Q.assertDeploymentSafety();
  if (command === "stage") stage();
  else if (command === "schedule") schedule();
  else if (command === "status") status();
  else if (command === "reset") reset();
  else Q.fail(`unsupported command '${command}' for ${SCENARIO}.`);
})();
