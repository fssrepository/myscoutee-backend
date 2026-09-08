/* global ManualQa, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "browser-sessions";
  const SNAPSHOT_COLLECTION = "manualQaBrowserSessionSnapshots";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const sourceScenario = Q.text(process.env.MANUAL_QA_BROWSER_SOURCE_SCENARIO);
  const browserUserIds = [...new Set(
    Q.text(process.env.MANUAL_QA_BROWSER_USER_IDS)
      .split(",")
      .map(Q.text)
      .filter(Boolean)
  )];

  function snapshotId(scenario) {
    return `manual-qa-checkpoint:v1:browser-sessions:${scenario}`;
  }

  function sessionSelector(userIds) {
    return { _id: { $in: userIds } };
  }

  function sessionSummary(userIds) {
    const states = Q.collection("userSessionStates")
      .find(sessionSelector(userIds))
      .toArray();
    return userIds.map(userId => {
      const state = states.find(item => Q.text(item && (item.userId || item._id)) === userId);
      return {
        userId,
        activeSessionCount: Array.isArray(state && state.activeSessions)
          ? state.activeSessions.length
          : 0
      };
    });
  }

  function activeFixtureState() {
    const states = Q.collection(Q.STATE_COLLECTION).find({}).toArray();
    const matches = states.filter(item =>
      Q.text(item && item.checkpointId).toUpperCase() === checkpointId
    );
    if (matches.length !== 1) {
      Q.fail(`browser preparation requires exactly one active '${checkpointId}' fixture state; found ${matches.length}.`);
    }
    const state = matches[0];
    if (Q.text(state.phase).toLowerCase() === "staging") {
      Q.fail(`browser preparation is forbidden while '${checkpointId}' is staging.`);
    }
    if (!Q.text(state.scenario)) {
      Q.fail(`active '${checkpointId}' fixture state has no scenario identity.`);
    }
    return state;
  }

  function prepare() {
    if (!checkpointId) Q.fail("browser preparation requires a checkpoint ID.");
    if (browserUserIds.length === 0) {
      Q.fail("browser preparation requires at least one configured demo user ID.");
    }
    const state = activeFixtureState();
    const fixtureScenario = Q.text(state.scenario);
    const id = snapshotId(fixtureScenario);
    const retained = Q.collection(SNAPSHOT_COLLECTION).findOne({ _id: id });
    if (retained) {
      if (Q.text(retained.checkpointId).toUpperCase() !== checkpointId
          || Q.text(retained.fixtureStateId) !== Q.text(state._id)
          || !Q.sameJson(retained.browserUserIds || [], browserUserIds)) {
        Q.fail(`a different browser-session snapshot is already retained for scenario '${fixtureScenario}'; reset it first.`);
      }
    } else {
      Q.collection(SNAPSHOT_COLLECTION).insertOne({
        _id: id,
        scenario: SCENARIO,
        fixtureScenario,
        fixtureStateId: Q.text(state._id),
        checkpointId,
        stagedAtIso: Q.text(state.stagedAtIso),
        preparedAtIso: Q.nowIso(),
        browserUserIds,
        snapshots: Q.snapshotSpecs([{
          collection: "userSessionStates",
          selector: sessionSelector(browserUserIds)
        }])
      });
    }

    const before = sessionSummary(browserUserIds);
    const preparedAtIso = Q.nowIso();
    Q.collection("userSessionStates").updateMany(
      sessionSelector(browserUserIds),
      { $set: { activeSessions: [], updatedDate: preparedAtIso } }
    );
    const after = sessionSummary(browserUserIds);
    if (after.some(item => item.activeSessionCount !== 0)) {
      Q.fail(`configured '${checkpointId}' browser sessions were not cleared exactly.`);
    }
    Q.collection(SNAPSHOT_COLLECTION).updateOne(
      { _id: id },
      {
        $set: { lastPreparedAtIso: preparedAtIso, lastBefore: before, lastAfter: after },
        $inc: { preparationCount: 1 }
      }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      fixtureScenario,
      phase: "prepared",
      before,
      after,
      snapshotRetained: true
    });
  }

  function restore() {
    if (!sourceScenario) return;
    const id = snapshotId(sourceScenario);
    const retained = Q.collection(SNAPSHOT_COLLECTION).findOne({ _id: id });
    if (!retained) return;
    Q.restoreSnapshots(retained.snapshots || []);
    Q.collection(SNAPSHOT_COLLECTION).deleteOne({ _id: id });
    Q.printObject({
      scenario: SCENARIO,
      fixtureScenario: sourceScenario,
      checkpointId: Q.text(retained.checkpointId),
      phase: "restored-before-fixture-reset",
      browserUserIds: retained.browserUserIds || []
    });
  }

  Q.assertDeploymentSafety();
  if (command === "prepare") prepare();
  else if (command === "restore") restore();
  else Q.fail(`unsupported browser-session command '${command}'.`);
})();
