/* global ManualQa, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "payment-ui";
  const CHECKPOINT = "PAYMENT-METHODS-HISTORY-001";
  const PREFIX = "manual-qa-checkpoint:v1:payment-ui";
  const TARGET_USER_ID = "af0436815ab38f4864dd1e24";
  const TARGET_USER_NAME = "Alex Turner";
  const BASELINE_CARD_IDS = [
    "pm_demo_alex_visa_4242",
    "pm_demo_alex_visa_1881",
    "pm_demo_alex_expired_0008"
  ];
  const EXPIRED_CARD_ID = "pm_demo_alex_expired_0008";
  const BASELINE_PAYMENT_IDS = [
    "payment-demo-alex-event",
    "payment-demo-alex-asset",
    "payment-demo-alex-income",
    "payment-demo-alex-failed"
  ];
  const NOTIFICATION_ID = `${PREFIX}:expired-notification`;
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const provider = Q.text(process.env.MANUAL_QA_PAYMENT_PROVIDER).toLowerCase();
  const providerConnected = Q.text(process.env.MANUAL_QA_PAYMENT_PROVIDER_CONNECTED) === "true";
  const requires3ds = Q.text(process.env.MANUAL_QA_PAYMENT_REQUIRES_3DS) === "true";

  const cardSelector = { userId: TARGET_USER_ID };
  const registrationSelector = { userId: TARGET_USER_ID };
  const paymentSelector = {
    $or: [{ userId: TARGET_USER_ID }, { recipientUserId: TARGET_USER_ID }]
  };
  const notificationSelector = { recipientUserId: TARGET_USER_ID };
  const userSelector = { $or: [{ _id: TARGET_USER_ID }, { userId: TARGET_USER_ID }] };

  function config() {
    if (checkpointId !== CHECKPOINT) {
      Q.fail(`payment-ui harness supports only ${CHECKPOINT}.`);
    }
  }

  function state(required = true) {
    const value = Q.activeState(SCENARIO, required);
    if (value && Q.text(value.checkpointId).toUpperCase() !== CHECKPOINT) {
      Q.fail(`staged payment checkpoint is '${Q.text(value.checkpointId)}', not '${CHECKPOINT}'.`);
    }
    return value;
  }

  function snapshotField(document, key) {
    return Object.prototype.hasOwnProperty.call(document || {}, key)
      ? { present: true, value: document[key] }
      : { present: false };
  }

  function restoreField(key, saved) {
    const update = saved && saved.present
      ? { $set: { [key]: saved.value } }
      : { $unset: { [key]: "" } };
    const result = Q.collection("users").updateOne(userSelector, update);
    if (result.matchedCount !== 1) Q.fail(`could not restore Alex user field '${key}'.`);
  }

  function byIds(collectionName, ids) {
    return Q.collection(collectionName).find({ _id: { $in: ids } }).sort({ _id: 1 }).toArray();
  }

  function ids(documents) {
    return (documents || []).map(document => Q.text(document && document._id)).sort();
  }

  function assertCanonicalIds(documents, expectedIds, label) {
    const actual = ids(documents);
    const expected = [...expectedIds].sort();
    if (!Q.sameJson(actual, expected)) {
      Q.fail(`${label} IDs are ${JSON.stringify(actual)}; expected ${JSON.stringify(expected)}.`);
    }
  }

  function userTotals(user) {
    return {
      spending: { ...(user.paymentSpentTotals || {}) },
      income: { ...(user.paymentIncomeTotals || {}) },
      all: { ...(user.paymentAllTotals || {}) }
    };
  }

  function assertControlledTotals() {
    const user = Q.ensureUser(TARGET_USER_ID, "payment UI member");
    const totals = userTotals(user);
    const expected = {
      spending: { HUF: 17400 },
      income: { HUF: 8400 },
      all: { HUF: 25800 }
    };
    if (!Q.sameJson(totals, expected)) {
      Q.fail(`payment totals are ${JSON.stringify(totals)}; expected ${JSON.stringify(expected)}.`);
    }
    return totals;
  }

  function paymentSummary() {
    const payments = Q.collection("payments").find(paymentSelector).sort({ createdDate: -1, _id: 1 }).toArray();
    return {
      ids: ids(payments),
      expenseCount: payments.filter(payment => Q.text(payment.userId) === TARGET_USER_ID).length,
      incomeCount: payments.filter(payment => Q.text(payment.recipientUserId) === TARGET_USER_ID
        && Q.text(payment.userId) !== TARGET_USER_ID).length,
      failed: payments.filter(payment => Q.text(payment.status) === "failed").map(payment => ({
        id: Q.text(payment._id),
        provider: Q.text(payment.provider),
        reason: Q.text(payment.lastGatewayError)
      }))
    };
  }

  function cardSummary() {
    return Q.collection("savedPaymentMethods").find(cardSelector).sort({ createdAtIso: 1, _id: 1 }).toArray().map(card => ({
      id: Q.text(card._id),
      provider: Q.text(card.provider),
      last4: Q.text(card.last4),
      artworkKey: Q.text(card.artworkKey),
      status: Q.text(card.status),
      registrationId: Q.text(card.registrationId)
    }));
  }

  function registrationMethods(selectedProvider) {
    return Q.collection("savedPaymentMethods").find({
      userId: TARGET_USER_ID,
      status: "active",
      provider: selectedProvider,
      registrationId: { $exists: true, $nin: [null, ""] },
      _id: { $nin: BASELINE_CARD_IDS }
    }).sort({ createdAtIso: 1, _id: 1 }).toArray();
  }

  function assertProvider(expected) {
    if (provider !== expected || !providerConnected) {
      Q.fail(`payment simulator is provider='${provider || "unknown"}', connected=${providerConnected}; expected connected ${expected}.`);
    }
  }

  function assertPaymentsUnchanged(currentState) {
    const current = Q.collection("payments").find(paymentSelector).sort({ _id: 1 }).toArray();
    const expected = [...(currentState.controlledPayments || [])].sort((left, right) => Q.text(left._id).localeCompare(Q.text(right._id)));
    if (!Q.sameJson(current, expected)) {
      Q.fail("Payment History reads changed the controlled payment documents.");
    }
  }

  function stage() {
    config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    const user = Q.ensureUser(TARGET_USER_ID, "payment UI member");
    if (Q.text(user.name) !== TARGET_USER_NAME) {
      Q.fail(`controlled payment member '${TARGET_USER_ID}' is not ${TARGET_USER_NAME}.`);
    }

    const canonicalCards = byIds("savedPaymentMethods", BASELINE_CARD_IDS);
    const canonicalPayments = byIds("payments", BASELINE_PAYMENT_IDS);
    assertCanonicalIds(canonicalCards, BASELINE_CARD_IDS, "canonical payment card");
    assertCanonicalIds(canonicalPayments, BASELINE_PAYMENT_IDS, "canonical Payment History");

    const snapshots = Q.snapshotSpecs([
      { collection: "savedPaymentMethods", selector: cardSelector },
      { collection: "paymentMethodRegistrations", selector: registrationSelector },
      { collection: "payments", selector: paymentSelector },
      { collection: "userNotifications", selector: notificationSelector }
    ]);
    const stagedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "staging",
      stagedAtIso,
      targetUserId: TARGET_USER_ID,
      snapshots,
      userFields: {
        paymentSpentTotals: snapshotField(user, "paymentSpentTotals"),
        paymentIncomeTotals: snapshotField(user, "paymentIncomeTotals"),
        paymentAllTotals: snapshotField(user, "paymentAllTotals")
      },
      controlledPayments: canonicalPayments
    });

    Q.collection("savedPaymentMethods").deleteMany(cardSelector);
    Q.collection("paymentMethodRegistrations").deleteMany(registrationSelector);
    Q.collection("payments").deleteMany(paymentSelector);
    Q.collection("userNotifications").deleteMany(notificationSelector);
    Q.collection("savedPaymentMethods").insertMany(canonicalCards);
    Q.collection("payments").insertMany(canonicalPayments);
    Q.collection("users").updateOne(userSelector, { $set: {
      paymentSpentTotals: { HUF: 17400 },
      paymentIncomeTotals: { HUF: 8400 },
      paymentAllTotals: { HUF: 25800 }
    } });
    Q.collection("userNotifications").insertOne({
      _id: NOTIFICATION_ID,
      syncKey: NOTIFICATION_ID,
      aggregationKey: `${PREFIX}:expired-card`,
      recipientUserId: TARGET_USER_ID,
      kind: "payment-card-expired",
      category: "payment",
      title: "Payment card expired",
      message: "Your saved card ending in 0008 has expired.",
      actionPath: "/home",
      sourceType: "payment-method",
      sourceId: EXPIRED_CARD_ID,
      payload: {
        paymentMethodId: EXPIRED_CARD_ID,
        provider: "stripe",
        last4: "0008",
        notification_title_key: "notification.payment.card.expired.title",
        notification_message_key: "notification.payment.card.expired.message",
        notification_tone: "warning",
        notification_avatar_icon: "credit_card_off"
      },
      occurrenceCount: 1,
      revision: 1,
      createdDate: stagedAtIso,
      createdUser: Q.ACTOR,
      updatedDate: stagedAtIso,
      updatedUser: Q.ACTOR
    });
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: Q.stateId(SCENARIO) },
      { $set: { phase: "baseline-ready" } }
    );

    const expired = Q.collection("savedPaymentMethods").findOne({ _id: EXPIRED_CARD_ID });
    if (!expired || Q.text(expired.status) !== "expired" || Q.text(expired.artworkKey) !== "coral") {
      Q.fail("expired card baseline is not the expected coral/expired record.");
    }
    assertControlledTotals();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "baseline-ready",
      actor: { userId: TARGET_USER_ID, name: TARGET_USER_NAME },
      simulator: { provider, connected: providerConnected, requires3ds },
      cards: cardSummary(),
      history: paymentSummary(),
      totals: assertControlledTotals(),
      expiryNotificationCount: Q.collection("userNotifications").countDocuments({ _id: NOTIFICATION_ID }),
      next: "The shell now restores Cash only and prints a fresh status. Do not open browsers until that status succeeds."
    });
  }

  function stageDecline() {
    config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    const user = Q.ensureUser(TARGET_USER_ID, "payment UI member");
    const declineBaselineCards = Q.collection("savedPaymentMethods")
      .find(cardSelector).sort({ _id: 1 }).toArray();
    const declineBaselineRegistrations = Q.collection("paymentMethodRegistrations")
      .find(registrationSelector).sort({ _id: 1 }).toArray();
    const declineBaselinePayments = Q.collection("payments")
      .find(paymentSelector).sort({ _id: 1 }).toArray();
    const stagedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "decline-ready",
      branch: "stripe-3ds-decline",
      stagedAtIso,
      targetUserId: TARGET_USER_ID,
      snapshots: Q.snapshotSpecs([
        { collection: "savedPaymentMethods", selector: cardSelector },
        { collection: "paymentMethodRegistrations", selector: registrationSelector },
        { collection: "payments", selector: paymentSelector }
      ]),
      userFields: {
        paymentSpentTotals: snapshotField(user, "paymentSpentTotals"),
        paymentIncomeTotals: snapshotField(user, "paymentIncomeTotals"),
        paymentAllTotals: snapshotField(user, "paymentAllTotals")
      },
      controlledPayments: declineBaselinePayments,
      declineBaselineCards,
      declineBaselineRegistrationIds: ids(declineBaselineRegistrations),
      declineBaselineTotals: userTotals(user)
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "decline-ready",
      branch: "stripe-3ds-decline",
      baseline: {
        cards: declineBaselineCards.length,
        registrations: declineBaselineRegistrations.length,
        payments: declineBaselinePayments.length
      },
      next: "Configure connected Stripe with 3DS On, start one Add card registration, generate once, submit once, then decline that pending card registration."
    });
  }

  function status() {
    config();
    const currentState = state(false);
    if (!currentState) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "not-staged", simulator: { provider, connected: providerConnected, requires3ds } });
      return;
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: Q.text(currentState.phase),
      actor: { userId: TARGET_USER_ID, name: TARGET_USER_NAME },
      simulator: { provider, connected: providerConnected, requires3ds },
      cards: cardSummary(),
      registrations: Q.collection("paymentMethodRegistrations").find(registrationSelector).sort({ createdAtIso: 1 }).toArray().map(value => ({
        id: Q.text(value._id), provider: Q.text(value.provider), status: Q.text(value.status), completedPaymentMethodId: Q.text(value.completedPaymentMethodId)
      })),
      history: paymentSummary(),
      totals: userTotals(Q.ensureUser(TARGET_USER_ID, "payment UI member")),
      expiryNotification: Q.collection("userNotifications").findOne({ _id: NOTIFICATION_ID }, { readAtIso: 1, revision: 1 }) || null,
      evidence: currentState.evidence || {},
      next: ["verified", "decline-verified"].includes(Q.text(currentState.phase))
        ? `Run reset ${SCENARIO} ${CHECKPOINT}.`
        : "Continue only from the matching stable checklist savepoint."
    });
  }

  function verifyProviderRegistration(expectedProvider) {
    config();
    const currentState = state(true);
    assertProvider(expectedProvider);
    const methods = registrationMethods(expectedProvider);
    if (methods.length !== 1) {
      Q.fail(`expected exactly one new active ${expectedProvider} card, found ${methods.length}.`);
    }
    const method = methods[0];
    const registration = Q.collection("paymentMethodRegistrations").findOne({
      _id: Q.text(method.registrationId),
      userId: TARGET_USER_ID,
      provider: expectedProvider,
      status: "completed",
      completedPaymentMethodId: Q.text(method._id)
    });
    if (!registration) Q.fail(`completed ${expectedProvider} registration does not own the new card.`);
    assertPaymentsUnchanged(currentState);
    assertControlledTotals();
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      { $set: {
        [`evidence.${expectedProvider}Registration`]: true,
        [`evidence.${expectedProvider}CardId`]: Q.text(method._id),
        [`evidence.${expectedProvider}VerifiedAtIso`]: verifiedAtIso
      } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: Q.text(currentState.phase),
      verified: `${expectedProvider}-registration`,
      card: { id: Q.text(method._id), last4: Q.text(method.last4), artworkKey: Q.text(method.artworkKey) },
      historyUnchanged: true,
      totalsUnchanged: true,
      next: expectedProvider === "stripe"
        ? "Switch the demo Admin simulator to connected Barion, then register one Barion card."
        : "Continue with the separate same-provider Replace block."
    });
  }

  function verifyDecline() {
    config();
    const currentState = state(true);
    if (Q.text(currentState.branch) !== "stripe-3ds-decline") {
      Q.fail("the staged payment checkpoint is not the standalone Stripe 3DS decline branch.");
    }
    assertProvider("stripe");
    if (!requires3ds) Q.fail("payment simulator has 3DS disabled; expected Stripe with 3DS enabled.");

    const currentCards = Q.collection("savedPaymentMethods")
      .find(cardSelector).sort({ _id: 1 }).toArray();
    if (!Q.sameJson(currentCards, currentState.declineBaselineCards || [])) {
      Q.fail("declined Stripe registration changed the saved-card list.");
    }
    const baselineRegistrationIds = currentState.declineBaselineRegistrationIds || [];
    const newRegistrations = Q.collection("paymentMethodRegistrations").find({
      userId: TARGET_USER_ID,
      _id: { $nin: baselineRegistrationIds }
    }).toArray();
    if (newRegistrations.length !== 1) {
      Q.fail(`expected exactly one standalone decline registration, found ${newRegistrations.length}.`);
    }
    const registration = newRegistrations[0];
    if (Q.text(registration.provider) !== "stripe" || Q.text(registration.status) !== "failed" ||
        Q.text(registration.completedPaymentMethodId)) {
      Q.fail(`decline registration is not terminal Stripe/failed without a saved card: ${JSON.stringify(registration)}.`);
    }
    assertPaymentsUnchanged(currentState);
    const totals = userTotals(Q.ensureUser(TARGET_USER_ID, "payment UI member"));
    if (!Q.sameJson(totals, currentState.declineBaselineTotals || {})) {
      Q.fail("declined Stripe registration changed payment totals.");
    }
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      { $set: {
        phase: "decline-verified",
        verifiedAtIso,
        "evidence.stripe3dsDeclined": true,
        "evidence.stripe3dsDeclinedRegistrationId": Q.text(registration._id)
      } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "decline-verified",
      verifiedAtIso,
      registration: { id: Q.text(registration._id), provider: "stripe", status: "failed" },
      unchanged: { savedCards: true, payments: true, paymentTotals: true },
      next: `Run reset ${SCENARIO} ${CHECKPOINT}; the completed 39-step run does not need to be repeated.`
    });
  }

  function verifyReplacement(kind) {
    config();
    const currentState = state(true);
    assertProvider("barion");
    const evidence = currentState.evidence || {};
    const sourceEvidenceKey = kind === "replace" ? "barionCardId" : null;
    let sourceId = sourceEvidenceKey ? Q.text(evidence[sourceEvidenceKey]) : "";
    if (kind === "reconnect") {
      const candidates = Q.collection("savedPaymentMethods").find({
        userId: TARGET_USER_ID,
        provider: "stripe",
        status: "replaced",
        replacedByPaymentMethodId: { $exists: true, $nin: [null, ""] }
      }).toArray();
      if (candidates.length !== 1) {
        Q.fail(`expected exactly one reconnected Stripe source card, found ${candidates.length}.`);
      }
      sourceId = Q.text(candidates[0]._id);
    }
    if (!sourceId) Q.fail(`missing '${sourceEvidenceKey || "Stripe reconnect source"}' savepoint evidence.`);
    const source = Q.collection("savedPaymentMethods").findOne({ _id: sourceId, userId: TARGET_USER_ID });
    if (!source || Q.text(source.status) !== "replaced" || !Q.text(source.replacedByPaymentMethodId)) {
      Q.fail(`${kind} source card '${sourceId}' was not replaced exactly once.`);
    }
    const replacementId = Q.text(source.replacedByPaymentMethodId);
    const replacement = Q.collection("savedPaymentMethods").findOne({
      _id: replacementId,
      userId: TARGET_USER_ID,
      provider: "barion",
      status: "active",
      replacesPaymentMethodId: sourceId
    });
    if (!replacement || !Q.text(replacement.registrationId)) {
      Q.fail(`${kind} did not create the expected active Barion replacement card.`);
    }
    const registration = Q.collection("paymentMethodRegistrations").findOne({
      _id: Q.text(replacement.registrationId),
      userId: TARGET_USER_ID,
      provider: "barion",
      status: "completed",
      completedPaymentMethodId: replacementId,
      replacesPaymentMethodId: sourceId
    });
    if (!registration) Q.fail(`${kind} replacement is not owned by a completed Barion registration.`);
    if (Q.text(replacement.artworkKey) !== Q.text(source.artworkKey)) {
      Q.fail(`${kind} replacement did not retain the source card artwork.`);
    }
    assertPaymentsUnchanged(currentState);
    assertControlledTotals();
    const verifiedAtIso = Q.nowIso();
    const evidencePrefix = kind === "replace" ? "replace" : "reconnect";
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      { $set: {
        [`evidence.${evidencePrefix}Verified`]: true,
        [`evidence.${evidencePrefix}SourceCardId`]: sourceId,
        [`evidence.${evidencePrefix}ReplacementCardId`]: replacementId,
        [`evidence.${evidencePrefix}VerifiedAtIso`]: verifiedAtIso
      } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: Q.text(currentState.phase),
      verified: `${kind}-registration`,
      sourceCard: { id: sourceId, provider: Q.text(source.provider), status: Q.text(source.status) },
      replacementCard: { id: replacementId, provider: Q.text(replacement.provider), status: Q.text(replacement.status) },
      artworkRetained: true,
      historyUnchanged: true,
      totalsUnchanged: true,
      next: kind === "replace"
        ? "Run the separate Reconnect block on any one active Stripe card."
        : "Continue with the expired-card badge cleanup."
    });
  }

  function verifyExpiredCleanup() {
    config();
    const currentState = state(true);
    const expired = Q.collection("savedPaymentMethods").findOne({ _id: EXPIRED_CARD_ID, userId: TARGET_USER_ID });
    if (!expired || Q.text(expired.status) !== "deleted") {
      Q.fail("expired card was not changed to deleted by the badge > Remove cleanup action.");
    }
    assertPaymentsUnchanged(currentState);
    assertControlledTotals();
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      { $set: { "evidence.expiredCleanup": true, "evidence.expiredCleanupVerifiedAtIso": verifiedAtIso } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: Q.text(currentState.phase),
      verified: "expired-card-cleanup",
      expiredCard: { id: EXPIRED_CARD_ID, status: Q.text(expired.status) },
      historyUnchanged: true,
      totalsUnchanged: true,
      next: "Verify All / Payments / Income filters and both header totals, then report the terminal phrase."
    });
  }

  function verify() {
    config();
    const currentState = state(true);
    const evidence = currentState.evidence || {};
    for (const key of ["stripeRegistration", "barionRegistration", "replaceVerified", "reconnectVerified", "expiredCleanup"]) {
      if (evidence[key] !== true) Q.fail(`missing '${key}' savepoint evidence.`);
    }
    const replacementIds = [
      Q.text(evidence.replaceReplacementCardId),
      Q.text(evidence.reconnectReplacementCardId)
    ].sort();
    if (replacementIds.some(id => !id)) Q.fail("replacement savepoint IDs are incomplete.");
    const activeReplacementIds = registrationMethods("barion").map(card => Q.text(card._id)).sort();
    if (!Q.sameJson(activeReplacementIds, replacementIds)) {
      Q.fail(`active Barion replacement cards are ${JSON.stringify(activeReplacementIds)}; expected ${JSON.stringify(replacementIds)}.`);
    }
    const activeStripe = Q.collection("savedPaymentMethods").find({
      userId: TARGET_USER_ID,
      provider: "stripe",
      status: "active"
    }).toArray();
    if (activeStripe.length !== 2) {
      Q.fail(`expected two remaining active Stripe cards after Reconnect, found ${activeStripe.length}.`);
    }
    assertPaymentsUnchanged(currentState);
    const summary = paymentSummary();
    assertCanonicalIds(Q.collection("payments").find(paymentSelector).toArray(), BASELINE_PAYMENT_IDS, "controlled Payment History");
    if (summary.expenseCount !== 3 || summary.incomeCount !== 1
        || summary.failed.length !== 1 || !summary.failed[0].reason) {
      Q.fail(`Payment History oracle is incomplete: ${JSON.stringify(summary)}.`);
    }
    const totals = assertControlledTotals();
    const notification = Q.collection("userNotifications").findOne({ _id: NOTIFICATION_ID });
    if (!notification || Q.text(notification.sourceId) !== EXPIRED_CARD_ID) {
      Q.fail("controlled expired-card notification disappeared.");
    }
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      { $set: { phase: "verified", verifiedAtIso, "evidence.historyReadOnly": true } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "verified",
      verifiedAtIso,
      registeredCards: {
        stripe: registrationMethods("stripe").map(card => Q.text(card._id)),
        barion: registrationMethods("barion").map(card => Q.text(card._id))
      },
      expiredCleanup: true,
      history: summary,
      totals,
      expiryNotificationPresent: true,
      unchanged: { paymentDocuments: true, paymentTotals: true },
      next: `Record the pair-QA result, then run reset ${SCENARIO} ${CHECKPOINT}; reset also restores simulator Cash only.`
    });
  }

  function reset() {
    config();
    const currentState = state(true);
    Q.restoreSnapshots(currentState.snapshots || []);
    const fields = currentState.userFields || {};
    restoreField("paymentSpentTotals", fields.paymentSpentTotals);
    restoreField("paymentIncomeTotals", fields.paymentIncomeTotals);
    restoreField("paymentAllTotals", fields.paymentAllTotals);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: currentState._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "reset-complete",
      restored: {
        savedPaymentMethods: (currentState.snapshots || []).find(value => value.collection === "savedPaymentMethods")?.documents?.length || 0,
        paymentMethodRegistrations: (currentState.snapshots || []).find(value => value.collection === "paymentMethodRegistrations")?.documents?.length || 0,
        payments: (currentState.snapshots || []).find(value => value.collection === "payments")?.documents?.length || 0,
        userNotifications: (currentState.snapshots || []).find(value => value.collection === "userNotifications")?.documents?.length || 0,
        userPaymentTotals: true
      },
      next: "The shell now restores simulator Cash only. Run status; expected phase is not-staged and provider is none."
    });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stage(); break;
    case "stage-decline": stageDecline(); break;
    case "status": status(); break;
    case "verify-decline": verifyDecline(); break;
    case "verify-stripe": verifyProviderRegistration("stripe"); break;
    case "verify-barion": verifyProviderRegistration("barion"); break;
    case "verify-replace": verifyReplacement("replace"); break;
    case "verify-reconnect": verifyReplacement("reconnect"); break;
    case "verify-expired-cleanup": verifyExpiredCleanup(); break;
    case "verify": verify(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
