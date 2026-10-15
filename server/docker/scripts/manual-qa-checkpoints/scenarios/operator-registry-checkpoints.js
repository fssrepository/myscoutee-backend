/* global ManualQa, process */
(() => {
  'use strict';
  const Q = ManualQa;
  const scenario = 'operator-registry';
  const checkpointId = 'OPERATOR-REGISTRY-LIFECYCLE-001';
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const collections = ['operatorRegistrySettings', 'operatorClaimSubmissionSnapshots',
    'revenueReportOutbox', 'qualifiedMauReportOutbox'];

  // Independent source oracle: count each person's actions and distinct UTC days
  // directly, without invoking the Java calculator or writing accepted reports.
  function measurementSources() {
    const now = new Date();
    const periods = Array.from({ length: 6 }, (_, i) => {
      const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
      const start = new Date(end.getTime() - 30 * 86400000);
      const period = new Date(end.getTime() - 86400000).toISOString().slice(0, 7);
      return { period, start: start.toISOString(), end: end.toISOString() };
    }).reverse();
    const eligible = new Set(Q.collection('users').find({
      networkMeasurementExcluded: { $ne: true }, status: { $nin: ['D', 'B', 'I'] },
      profileStatus: { $nin: ['deleted', 'blocked', 'inactive'] },
      hostTier: { $not: /^admin$/i }, statusText: { $not: /^admin workspace$/i }
    }, { userId: 1 }).toArray().map(u => u.userId));
    const actions = [];
    function add(user, type, at, source) {
      if (!eligible.has(user) || !at) return;
      const date = new Date(at);
      if (!Number.isFinite(date.getTime())) Q.fail('Invalid measurement source date');
      const iso = date.toISOString();
      if (iso >= periods[0].start && iso < periods[5].end) {
        actions.push({ user, type, at: iso, source: String(source) });
      }
    }
    Q.collection('userRates').find({ scoreGiven: { $gt: 0 } },
      { ownerUserId: 1, updatedDate: 1, createdDate: 1 }).forEach(d =>
      add(d.ownerUserId, 'rate', d.updatedDate || d.createdDate, d._id));
    const memberships = Q.collection('activityMembers').find({
      ownerType: 'event', status: 'accepted'
    }, { userId: 1, ownerId: 1, actionAtIso: 1 }).toArray();
    const attendance = new Set(memberships.map(d => JSON.stringify([d.ownerId, d.userId])));
    memberships.forEach(d => add(d.userId, 'join', d.actionAtIso, d._id));
    Q.collection('chatMessages').find({ $or: [
      { deletedAtIso: { $exists: false } }, { deletedAtIso: null }, { deletedAtIso: '' }
    ] }, { senderAvatar: 1, sentAtIso: 1, id: 1, chatId: 1 }).forEach(d =>
      add(d.senderAvatar?.id, 'message', d.sentAtIso, `${d.chatId}:${d.id}`));
    Q.collection('events').find({ status: 'A', generated: { $ne: true } },
      { creatorUserId: 1, createdDate: 1, sourceId: 1 }).forEach(d =>
      add(d.creatorUserId, 'host', d.createdDate, d.sourceId || d._id));
    Q.collection('assetRequests').find({ status: 'accepted', booking: { $ne: null } },
      { userId: 1, requestedAtIso: 1 }).forEach(d => add(d.userId, 'book', d.requestedAtIso, d._id));
    Q.collection('feedbackStates').find({ removed: { $ne: true } },
      { viewerUserId: 1, eventId: 1, submittedAtIso: 1 }).forEach(d => {
      if (attendance.has(JSON.stringify([d.eventId, d.viewerUserId]))) {
        add(d.viewerUserId, 'verified-attendance', d.submittedAtIso, d.eventId);
      }
    });
    const expected = periods.map(p => {
      const byUser = new Map();
      actions.filter(a => a.at >= p.start && a.at < p.end).forEach(a => {
        if (!byUser.has(a.user)) byUser.set(a.user, []);
        byUser.get(a.user).push(a);
      });
      let qualifiedMauCount = 0, actionCount = 0;
      const actionCounts = {};
      for (const rows of byUser.values()) {
        if (rows.length < 2 || new Set(rows.map(a => a.at.slice(0, 10))).size < 2) continue;
        qualifiedMauCount++;
        actionCount += rows.length;
        rows.forEach(a => { actionCounts[a.type] = (actionCounts[a.type] || 0) + 1; });
      }
      return { period: p.period, qualifiedMauCount, actionCount, actionCounts };
    });
    const sourceHash = require('crypto').createHash('sha256')
      .update(JSON.stringify(actions.map(a => JSON.stringify(a)).sort())).digest('hex');
    return { expected, sourceHash };
  }
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
  } else if (command === 'prepare-measurement') {
    const state = Q.activeState(scenario, true);
    if (state.measurement) Q.fail('Measurement baseline already retained; use status/verify-measurement');
    if (Q.collection('qualifiedMauReportOutbox').countDocuments({}) !== 0) {
      Q.fail('Expected unused QA measurement outbox before first synchronization');
    }
    const additional = state.snapshots.some(s => s.collection === 'qualifiedMauReportOutbox')
      ? [] : Q.snapshotSpecs([{ collection: 'qualifiedMauReportOutbox', selector: {} }]);
    const measurement = measurementSources();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { snapshots: [...state.snapshots, ...additional], measurement }
    });
    Q.printObject({ prepared: true, ...measurement, sourceMutation: false, reportsWritten: 0 });
  } else if (command === 'verify-measurement') {
    const state = Q.activeState(scenario, true);
    if (!state.measurement) Q.fail('Prepare measurement baseline first');
    const current = measurementSources();
    if (current.sourceHash !== state.measurement.sourceHash) Q.fail('Measurement sources changed');
    const settings = Q.collection('operatorRegistrySettings').findOne({ _id: 'deployment-registry' });
    const reports = Q.collection('qualifiedMauReportOutbox').find({
      deploymentId: settings.enrollment.deploymentCode
    }).toArray();
    if (reports.length !== 6) Q.fail('Expected exactly six completed-period reports');
    for (const expected of state.measurement.expected) {
      const matches = reports.filter(r => r.period === expected.period);
      if (matches.length !== 1) Q.fail(`Duplicate/missing period ${expected.period}`);
      const r = matches[0];
      const receipt = r.acceptedResponse?.receipt;
      if (r.status !== 'ACCEPTED' || !r.acceptedResponse || !r.acceptedAt
        || !receipt?.signature || receipt.period !== expected.period
        || Number(receipt.qualifiedMauCount) !== expected.qualifiedMauCount
        || receipt.commitmentHash !== r.commitmentHash
        || Number(r.qualifiedMauCount) !== expected.qualifiedMauCount
        || Number(r.actionCount) !== expected.actionCount
        || Object.keys({ ...r.actionCounts, ...expected.actionCounts }).some(k =>
          Number(r.actionCounts[k] || 0) !== (expected.actionCounts[k] || 0))) {
        Q.fail(`Accepted measurement mismatch for ${expected.period}`);
      }
    }
    Q.printObject({ verified: true, sourcesUnchanged: true, expected: current.expected,
      reports: reports.map(r => ({ id: String(r._id), period: r.period,
        status: r.status, attempts: r.attemptCount,
        receipt: { ledgerIndex: r.acceptedResponse.receipt.ledgerIndex,
          period: r.acceptedResponse.receipt.period,
          qualifiedMauCount: r.acceptedResponse.receipt.qualifiedMauCount,
          acceptedAt: r.acceptedResponse.receipt.acceptedAt,
          signaturePresent: Boolean(r.acceptedResponse.receipt.signature) } })) });
  } else if (command === 'reset') {
    const state = Q.activeState(scenario, true);
    Q.restoreSnapshots(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
  } else if (command !== 'status') Q.fail('Use stage, prepare-measurement, verify-measurement, status or reset');
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
