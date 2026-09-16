/* global ManualQa, process, EJSON */
(() => {
  'use strict';
  const Q = ManualQa;
  const scenario = 'operator-revenue';
  const checkpointId = 'OPERATOR-REVENUE-LIFECYCLE-001';
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const owned = { _id: /^qa-revenue-/ };
  const hash = value => require('crypto').createHash('sha256')
    .update(EJSON.stringify(value)).digest('hex');
  const sources = () => Q.collection('payments').find({}).sort({ _id: 1 }).toArray();
  const day = offset => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== checkpointId) Q.fail('Wrong Revenue checkpoint');

  if (command === 'stage') {
    Q.assertNotStaged(scenario);
    Q.assertNoOtherActiveScenario(scenario);
    if (Q.collection('payments').countDocuments(owned)) Q.fail('Fixture payment IDs already exist');
    if (Q.collection('revenueReportOutbox').countDocuments({})) Q.fail('Expected unused Revenue outbox');
    if (Q.collection('operatorRegistrySettings').countDocuments({})) Q.fail('Reset Registry checkpoint first');
    // Existing fixture payments with other lifecycle labels are not rewritten.
    if (Q.collection('payments').countDocuments({ status: { $in: ['approved', 'partially_refunded', 'refunded'] } })) {
      Q.fail('Existing finalized payments require an expanded independent oracle');
    }
    const now = new Date();
    const period = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0)).toISOString().slice(0, 10);
    const definitions = [
      ['captured-stripe', 'stripe', 'EUR', 'approved', 10, period, 'payment'],
      ['captured-barion', 'barion', 'EUR', 'approved', 20, period, 'payment'],
      ['authorized', 'stripe', 'EUR', 'authorized', 100, period, 'payment'],
      ['released', 'barion', 'EUR', 'released', 200, period, 'payment'],
      ['dummy', 'dummy', 'EUR', 'approved', 300, period, 'payment'],
      ['revision', 'stripe', 'EUR', 'approved', 400, period, 'refund'],
      ['other-currency', 'stripe', 'USD', 'approved', 40, day(-1), 'payment'],
      ['other-period', 'barion', 'EUR', 'approved', 7.5, day(-2), 'payment'],
      ['current-day', 'stripe', 'EUR', 'approved', 11, day(0), 'payment']
    ];
    const event = Q.collection('events').findOne({});
    if (!event) Q.fail('Existing event source required');
    const payments = definitions.map(([key, provider, currency, status, amount, date, auditKind]) => ({
      _id: 'qa-revenue-' + key, version: 0,
      userId: '650000000000000000000061', recipientUserId: event.creatorUserId,
      sourceId: event.sourceId || String(event._id), provider, currency, status, amount, auditKind,
      bookingStatus: status === 'approved' ? 'confirmed' : status,
      checkoutSessionId: 'qa-revenue-checkout-' + key,
      gatewaySessionId: 'qa-revenue-gateway-' + key,
      createdDate: date + 'T12:00:00Z', updatedDate: date + 'T12:00:00Z',
      ...(status === 'approved' ? { capturedAtIso: date + 'T12:00:01Z' } : {})
    }));
    const expected = {
      [period]: { EUR: { capturedMinor: 3000, paymentCount: 2 } },
      [day(-2)]: { EUR: { capturedMinor: 750, paymentCount: 1 } },
      [day(-1)]: { USD: { capturedMinor: 4000, paymentCount: 1 } }
    };
    const state = {
      _id: Q.stateId(scenario), scenario, checkpointId, phase: 'staging', stagedAtIso: Q.nowIso(),
      period, expected, currentDay: day(0),
      snapshots: Q.snapshotSpecs([
        { collection: 'payments', selector: owned },
        ...['operatorRegistrySettings', 'operatorClaimSubmissionSnapshots', 'revenueReportOutbox',
          'qualifiedMauReportOutbox'].map(collection => ({ collection, selector: {} }))
      ])
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    Q.collection('payments').insertMany(payments);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, {
      $set: { phase: 'baseline-ready', sourceHash: hash(sources()) }
    });
  } else if (command === 'verify') {
    const state = Q.activeState(scenario, true);
    if (hash(sources()) !== state.sourceHash) Q.fail('Payment sources or excluded controls changed');
    const settings = Q.collection('operatorRegistrySettings').findOne({ _id: 'deployment-registry' });
    if (!settings?.enrollment) Q.fail('Normal registration prerequisite missing');
    const reports = Q.collection('revenueReportOutbox').find({ deploymentId: settings.enrollment.deploymentCode })
      .sort({ period: 1 }).toArray();
    const periods = new Set();
    for (const r of reports) {
      if (periods.has(r.period) || Number(r.revision) !== 1 || r.status !== 'ACCEPTED') Q.fail('Duplicate, revised or unaccepted report');
      if (r.period >= state.currentDay) Q.fail('Current/incomplete day was reported');
      periods.add(r.period);
      const expected = state.expected[r.period] || {};
      const currencies = r.currencies || [];
      if (currencies.length !== Object.keys(expected).length) Q.fail('Unexpected report currency');
      for (const c of currencies) {
        const e = expected[c.currencyCode];
        if (!e || Number(c.capturedMinor) !== e.capturedMinor || Number(c.paymentCount) !== e.paymentCount
            || Number(c.refundedMinor) !== 0 || Number(c.netMinor) !== e.capturedMinor
            || Number(c.commissionBasisMinor) !== e.capturedMinor
            || Number(c.estimatedCommissionMinor) !== Math.floor(e.capturedMinor * 0.05)) {
          Q.fail('Captured count, amount, refund or currency mismatch');
        }
      }
      if (!r.acceptedResponse?.receipt?.signature || !r.acceptedResponse.batchId
          || !r.acceptedResponse.receipt.entryHash) Q.fail('Missing signed acceptance receipt');
    }
    for (const p of Object.keys(state.expected)) if (!periods.has(p)) Q.fail('Expected period missing');
    const expectedDays = (Date.parse(state.currentDay) - Date.parse(state.period)) / 86400000;
    if (reports.length !== expectedDays) Q.fail('Completed-day report coverage mismatch');
    Q.printObject({ verified: true, sourcesUnchanged: true, reports: reports.map(r => ({
      id: String(r._id), period: r.period, revision: r.revision, status: r.status,
      currencies: r.currencies, batchId: r.acceptedResponse.batchId,
      ledgerIndex: r.acceptedResponse.receipt.ledgerIndex,
      entryHash: r.acceptedResponse.receipt.entryHash,
      signaturePresent: true
    })) });
  } else if (command === 'reset') {
    const state = Q.activeState(scenario, true);
    Q.restoreSnapshots(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
  } else if (command !== 'status') Q.fail('Use stage, verify, status or reset');
  const state = Q.activeState(scenario, false);
  Q.printObject({ scenario, checkpointId, phase: state?.phase || 'not-staged',
    expected: state?.expected || null, ownedPayments: Q.collection('payments').countDocuments(owned),
    reportCount: Q.collection('revenueReportOutbox').countDocuments({}),
    sourceUnchanged: state?.sourceHash ? state.sourceHash === hash(sources()) : null });
})();
