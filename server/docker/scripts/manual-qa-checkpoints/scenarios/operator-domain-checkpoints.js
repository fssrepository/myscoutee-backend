/* global ManualQa, db, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "operator-domain";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const CONFIG_ID = "deployment-configuration";

  const CHECKPOINTS = {
    "OPERATOR-FIREBASE-001": {
      why: "Prove that only a tested Firebase revision can become active, that entry authentication follows the active capability, and that rollback restores the prior login mode.",
      action: "Using disposable Firebase credentials, save the configuration, test Authentication and Messaging, activate the verified revision, then open a completely fresh browser session. Capture the Firebase login surface. After evidence, run reset and verify the original entry login mode.",
      expected: "Failed or untested activation preserves the old mode; verified activation exposes Firebase login in a fresh session; reset restores the exact prior revision and mode. Evidence contains no credential values.",
      worker: "MUST NOT use a scheduler. Notification delivery becomes conditional only after verified Firebase capability activation."
    }
  };

  function config() {
    const value = CHECKPOINTS[checkpointId];
    if (!value) Q.fail(`unsupported operator-domain checkpoint '${checkpointId}'.`);
    return value;
  }

  function present(value) {
    return Q.text(value).length > 0;
  }

  function maskedFirebaseSummary() {
    const deployment = Q.collection("deploymentConfigurations").findOne({ _id: CONFIG_ID });
    if (!deployment) Q.fail(`deployment configuration '${CONFIG_ID}' was not found.`);
    const firebase = deployment.firebase || {};
    const client = firebase.publicClient || {};
    return {
      schemaVersion: deployment.schemaVersion,
      revision: firebase.revision,
      active: firebase.active === true,
      projectIdPresent: present(firebase.projectId),
      authenticationTestedRevision: firebase.authenticationTestedRevision,
      authenticationTestedAtPresent: present(firebase.authenticationTestedAt),
      messagingTestedRevision: firebase.messagingTestedRevision,
      messagingTestedAtPresent: present(firebase.messagingTestedAt),
      activatedAtPresent: present(firebase.activatedAt),
      publicClientPresence: {
        apiKey: present(client.apiKey),
        authDomain: present(client.authDomain),
        storageBucket: present(client.storageBucket),
        messagingSenderId: present(client.messagingSenderId),
        appId: present(client.appId),
        measurementId: present(client.measurementId),
        vapidKey: present(client.vapidKey)
      },
      authenticationCredentialPresent: firebase.authenticationCredentialEnvelope != null,
      messagingCredentialPresent: firebase.messagingCredentialEnvelope != null
    };
  }

  function stage() {
    const selected = config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    const deployment = Q.collection("deploymentConfigurations").findOne({ _id: CONFIG_ID });
    if (!deployment) Q.fail(`deployment configuration '${CONFIG_ID}' was not found.`);
    const stagedAtIso = Q.nowIso();
    const state = {
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId,
      database: db.getName(),
      stagedAtIso,
      snapshots: Q.snapshotSpecs([
        { collection: "deploymentConfigurations", selector: { _id: CONFIG_ID } }
      ])
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline-ready",
      stagedAtIso,
      why: selected.why,
      workerExpectation: selected.worker,
      maskedBaseline: maskedFirebaseSummary(),
      next: selected.action,
      expectedVisibleResult: selected.expected,
      credentialEvidenceRule: "Record only presence booleans, revision numbers and masked UI values. Never paste credentials into screenshots, logs or this helper."
    });
  }

  function requireMatchingState() {
    const state = Q.activeState(SCENARIO, true);
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged checkpoint is '${state.checkpointId}', not '${checkpointId}'.`);
    }
    return state;
  }

  function next() {
    const selected = config();
    requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "awaiting-manual-action",
      why: selected.why,
      action: selected.action,
      expectedVisibleResult: selected.expected,
      workerExpectation: selected.worker,
      credentialEvidenceRule: "Never print or capture raw Firebase client or service-account values."
    });
  }

  function status() {
    const selected = config();
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "not-staged",
        why: selected.why,
        next: `Run stage operator-domain ${checkpointId}.`
      });
      return;
    }
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged checkpoint is '${state.checkpointId}', not '${checkpointId}'.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "inspect-manual-checkpoint",
      why: selected.why,
      workerExpectation: selected.worker,
      maskedOracle: maskedFirebaseSummary(),
      expectedVisibleResult: selected.expected,
      next: "Match the tested and active revision numbers with the fresh-session login mode. Run reset immediately after screenshots, then verify the original mode."
    });
  }

  function reset() {
    config();
    const state = requireMatchingState();
    Q.restoreSnapshots(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      restoredAtIso: Q.nowIso(),
      maskedRestoredConfiguration: maskedFirebaseSummary(),
      next: `Run status operator-domain ${checkpointId}; expected phase is not-staged. Open one fresh browser session and verify the original entry login mode.`
    });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stage(); break;
    case "next": next(); break;
    case "status": status(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
