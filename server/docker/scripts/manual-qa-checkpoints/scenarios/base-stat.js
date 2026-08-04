/* global ManualQa, process */
(() => {
  "use strict";
  const Q = ManualQa;
  const SCENARIO = "base-stat";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const visibleCounterKeys = [
    "profile.registered", "profile.deleted", "rates.synced", "event.members.changed",
    "event.member.joined", "event.member.invited", "event.feedback.submitted",
    "asset.requests.changed", "chat.message.sent", "admin.user.warned",
    "feedback.submitted", "report.submitted", "admin.user.blocked", "admin.user.unblocked"
  ];

  function snapshot() {
    const value = Q.collection("adminStats").findOne({ statsKey: "global" });
    if (!value) Q.fail("the global Statistics snapshot is missing.");
    const counters = {};
    for (const key of visibleCounterKeys) counters[key] = Q.mapNumber(value.counters, key);
    return {
      healthScore: value.healthScore,
      healthLabelKey: value.healthLabelKey,
      healthSummaryKey: value.healthSummaryKey,
      counters,
      attention: value.attention || {},
      topCities: value.topCities || {},
      topTopics: value.topTopics || {},
      eventTypes: value.eventTypes || {},
      dailyActivity: value.dailyActivity || {},
      dailyActiveUsers: value.dailyActiveUsers || {},
      activeUsers: value.activeUsers || {},
      userFirstSeen: value.userFirstSeen || {},
      userActivityCounts: value.userActivityCounts || {},
      departedUserDurationsDays: value.departedUserDurationsDays || {},
      profileFillRates: value.profileFillRates || {},
      knownEvents: value.knownEvents || {},
      activeEvents: value.activeEvents || {},
      knownAssets: value.knownAssets || {},
      activeAssets: value.activeAssets || {},
      profileStatusCounts: value.profileStatusCounts || {},
      profileVisibilityCounts: value.profileVisibilityCounts || {},
      activeProfileUsers: value.activeProfileUsers || {},
      graphHealthScore: value.graphHealthScore,
      graphHealthLabelKey: value.graphHealthLabelKey,
      graphInsightKey: value.graphInsightKey,
      graphMetrics: value.graphMetrics || {},
      graphBridgeUsers: value.graphBridgeUsers || {},
      graphCommunities: value.graphCommunities || {},
      graphSignals: value.graphSignals || {},
      dailyGraphActivity: value.dailyGraphActivity || {}
    };
  }

  function stage() {
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    const stagedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      database: db.getName(),
      stagedAtIso,
      baseline: snapshot()
    });
    Q.printObject({
      scenario: SCENARIO,
      phase: "baseline-ready",
      stagedAtIso,
      mutation: "Only the manual-QA checkpoint row was created; product data and schedules were not changed.",
      next: "Capture Statistics, make no causal action, press Refresh once, then run status base-stat."
    });
  }

  function status() {
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({ scenario: SCENARIO, phase: "not-staged", next: "Run stage base-stat." });
      return;
    }
    const current = snapshot();
    const stable = Q.sameJson(state.baseline, current);
    Q.printObject({
      scenario: SCENARIO,
      phase: stable ? "stable" : "changed",
      stagedAtIso: state.stagedAtIso,
      validation: { visibleStatisticsSnapshotStable: stable },
      baseline: state.baseline,
      current,
      next: stable
        ? "Capture the post-Refresh screenshot and reset base-stat."
        : "Treat this as a failure unless a separately evidenced causal background action explains the exact delta."
    });
  }

  function reset() {
    const state = Q.activeState(SCENARIO, true);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({ scenario: SCENARIO, phase: "reset-complete", restored: true });
  }

  Q.assertDeploymentSafety();
  if (command === "stage") stage();
  else if (command === "status") status();
  else if (command === "reset") reset();
  else Q.fail(`unsupported command '${command}' for ${SCENARIO}.`);
})();
