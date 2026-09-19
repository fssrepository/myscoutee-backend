/* global ManualQa, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "integration-api";
  const CHECKPOINT = "INTEGRATION-API-001";
  const STATE_ID = "manual-qa-checkpoint:v1:integration-api";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();

  function requireCheckpoint() {
    if (checkpointId !== CHECKPOINT) {
      Q.fail(`${SCENARIO} is restricted to ${CHECKPOINT}.`);
    }
  }

  function stage() {
    requireCheckpoint();
    const existing = Q.collection(Q.STATE_COLLECTION).findOne({ _id: STATE_ID });
    if (existing) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: existing.phase, reused: true });
      return;
    }
    const stagedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: STATE_ID,
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "baseline-ready",
      stagedAtIso,
      tokenSource: "normal-profile-ui",
      resourceSource: "normal-integration-api",
      snapshots: []
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "baseline-ready",
      stagedAtIso,
      tokenFixtureCreated: false,
      next: "Launch the managed Casey/Nova sessions and generate the test API key through Casey's Profile UI."
    });
  }

  function status() {
    requireCheckpoint();
    const state = Q.collection(Q.STATE_COLLECTION).findOne({ _id: STATE_ID });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: state ? state.phase : "not-staged",
      tokenSource: state && state.tokenSource,
      resourceSource: state && state.resourceSource
    });
  }

  function reset() {
    requireCheckpoint();
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: STATE_ID });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "reset-complete" });
  }

  Q.assertDeploymentSafety();
  if (command === "stage") stage();
  else if (command === "status") status();
  else if (command === "reset") reset();
  else Q.fail(`unsupported ${SCENARIO} command '${command}'.`);
})();
