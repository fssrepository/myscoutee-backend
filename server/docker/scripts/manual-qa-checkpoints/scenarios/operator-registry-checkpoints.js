/* global ManualQa, process */
(() => {
  'use strict';
  const Q = ManualQa;
  const scenario = 'operator-registry';
  const checkpointId = 'OPERATOR-REGISTRY-LIFECYCLE-001';
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const collections = ['operatorRegistrySettings', 'operatorClaimSubmissionSnapshots',
    'revenueReportOutbox'];
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== checkpointId) Q.fail('Wrong Registry checkpoint');
  if (command === 'stage') {
    Q.assertNotStaged(scenario);
    Q.assertNoOtherActiveScenario(scenario);
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: Q.stateId(scenario), scenario, checkpointId,
      stagedAtIso: Q.nowIso(), phase: 'baseline-ready',
      snapshots: Q.snapshotSpecs(collections.map(collection => ({ collection, selector: {} })))
    });
  } else if (command === 'reset') {
    const state = Q.activeState(scenario, true);
    Q.restoreSnapshots(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
  } else if (command !== 'status') Q.fail('Use stage, status or reset');
  const state = Q.activeState(scenario, false);
  Q.printObject({ scenario, checkpointId, phase: state ? state.phase : 'not-staged',
    counts: Object.fromEntries(collections.map(name => [name, Q.collection(name).countDocuments({})])),
    settings: Q.collection('operatorRegistrySettings').find({}, {
      _id: 1, version: 1, lifecycle: 1, enabled: 1,
      'selection.registryScope': 1, 'enrollment.deploymentCode': 1,
      'enrollment.installationTestLedgerIndex': 1, 'nodeIdentity.initializedAt': 1
    }).toArray(),
    externalState: 'Use operator-registry-fixture.py for the paired Go database and Java key/state snapshot.'
  });
})();
