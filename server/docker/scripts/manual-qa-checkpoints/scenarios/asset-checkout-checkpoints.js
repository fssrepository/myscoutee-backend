/* global ManualQa, EJSON, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "asset-checkout";
  const CHECKPOINT = "ASSET-CHECKOUT-001";
  const PREFIX = "manual-qa-checkpoint:v1:asset-checkout";
  const CASEY_ID = "650000000000000000000061";
  const NOVA_ID = "650000000000000000000062";
  const RILEY_ID = "650000000000000000000063";
  const AVA_ID = "admin-demo-ava";
  const BROWSER_ACTOR_IDS = [CASEY_ID, NOVA_ID, AVA_ID];
  const EVENT_ID = `${PREFIX}:event`;
  const SUB_EVENT_ID = `${PREFIX}:sub-event:borrow`;
  const SIBLING_SUB_EVENT_ID = `${PREFIX}:sub-event:sibling`;
  const PAID_ID = `${PREFIX}:asset:paid`;
  const FREE_ID = `${PREFIX}:asset:free`;
  const UNAVAILABLE_ID = `${PREFIX}:asset:unavailable`;
  const ADJACENT_ID = `${PREFIX}:asset:adjacent-paid`;
  const DECLINE_ID = `${PREFIX}:asset:decline-control`;
  const TIMEOUT_ID = `${PREFIX}:asset:timeout-control`;
  const ASSET_IDS = [PAID_ID, FREE_ID, UNAVAILABLE_ID, ADJACENT_ID, DECLINE_ID, TIMEOUT_ID];
  const IMMUTABLE_CONTROL_IDS = [FREE_ID, UNAVAILABLE_ID, ADJACENT_ID];
  const TERMINAL_CONTROL_IDS = [DECLINE_ID, TIMEOUT_ID];
  const POLICY_ID = "qa-borrow-policy";
  const CARD_IDS = {
    active: `${PREFIX}:card:barion-4444`,
    expired: `${PREFIX}:card:barion-expired-0008`
  };
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const provider = Q.text(process.env.MANUAL_QA_PAYMENT_PROVIDER).toLowerCase();
  const providerConnected = Q.text(process.env.MANUAL_QA_PAYMENT_PROVIDER_CONNECTED) === "true";
  const requires3ds = Q.text(process.env.MANUAL_QA_PAYMENT_REQUIRES_3DS) === "true";

  const userSelector = userId => ({ $or: [{ _id: userId }, { userId }] });
  const assetSelector = { $or: [{ _id: { $in: ASSET_IDS } }, { assetId: { $in: ASSET_IDS } }] };
  const eventSelector = { $or: [{ _id: EVENT_ID }, { sourceId: EVENT_ID }] };
  const memberSelector = { ownerId: { $in: [EVENT_ID, ...ASSET_IDS] } };
  const basketSelector = { sourceId: { $in: ASSET_IDS } };
  const activeBasketSelector = {
    ...basketSelector,
    status: { $in: ["draft", "confirmed", "waiting", "approval-pending", "approved", "pay"] },
    $or: [
      { resultState: { $exists: false } },
      { resultState: { $in: ["pending", "active", "failed", "succeeded"] } }
    ]
  };
  const paymentSelector = { sourceId: { $in: ASSET_IDS } };
  const cardSelector = { _id: { $in: Object.values(CARD_IDS) } };
  const resourceSelector = { $or: [
    { ownerId: EVENT_ID, subEventId: { $in: [SUB_EVENT_ID, SIBLING_SUB_EVENT_ID] } },
    { "assetAssignmentIds.Transport": { $in: ASSET_IDS } }
  ] };
  const notificationSelector = { $or: [
    { entityId: { $in: [EVENT_ID, ...ASSET_IDS] } },
    { sourceId: { $in: [EVENT_ID, ...ASSET_IDS] } },
    { "payload.eventId": EVENT_ID },
    { "payload.assetId": { $in: ASSET_IDS } },
    { "payload.sourceId": { $in: [EVENT_ID, ...ASSET_IDS] } }
  ] };
  const browserSessionSelector = { _id: { $in: BROWSER_ACTOR_IDS } };

  function config() {
    if (checkpointId !== CHECKPOINT) {
      Q.fail(`asset-checkout harness supports only ${CHECKPOINT}.`);
    }
  }

  function state(required = true) {
    const value = Q.activeState(SCENARIO, required);
    if (value && Q.text(value.checkpointId).toUpperCase() !== CHECKPOINT) {
      Q.fail(`staged checkout checkpoint is '${Q.text(value.checkpointId)}', not '${CHECKPOINT}'.`);
    }
    return value;
  }

  function sorted(values) {
    return [...new Set((values || []).map(Q.text).filter(Boolean))].sort();
  }

  function samePersisted(left, right) {
    return Q.sameJson(EJSON.serialize(left), EJSON.serialize(right));
  }

  function optionalField(document, key) {
    return Object.prototype.hasOwnProperty.call(document || {}, key)
      ? { present: true, value: document[key] }
      : { present: false };
  }

  function userFields(document) {
    return {
      userId: Q.text(document && (document.userId || document._id)),
      activities: optionalField(document, "activities"),
      paymentSpentTotals: optionalField(document, "paymentSpentTotals"),
      paymentIncomeTotals: optionalField(document, "paymentIncomeTotals"),
      paymentAllTotals: optionalField(document, "paymentAllTotals")
    };
  }

  function restoreUserFields(saved) {
    const setValues = {};
    const unsetValues = {};
    for (const key of ["activities", "paymentSpentTotals", "paymentIncomeTotals", "paymentAllTotals"]) {
      if (saved[key] && saved[key].present) setValues[key] = saved[key].value;
      else unsetValues[key] = "";
    }
    const update = {};
    if (Object.keys(setValues).length > 0) update.$set = setValues;
    if (Object.keys(unsetValues).length > 0) update.$unset = unsetValues;
    const result = Q.collection("users").updateOne(userSelector(saved.userId), update);
    if (result.matchedCount !== 1) Q.fail(`could not restore user '${saved.userId}'.`);
  }

  function browserSessionSummary() {
    const states = Q.collection("userSessionStates").find(browserSessionSelector).toArray();
    return BROWSER_ACTOR_IDS.map(userId => {
      const value = states.find(item => Q.text(item && (item.userId || item._id)) === userId);
      return {
        userId,
        activeSessionCount: Array.isArray(value && value.activeSessions) ? value.activeSessions.length : 0
      };
    });
  }

  function clearBrowserActorSessions() {
    const currentState = state();
    const before = browserSessionSummary();
    let snapshotsCaptured = false;
    if (!Array.isArray(currentState.browserSessionSnapshots)) {
      const browserSessionSnapshots = Q.snapshotSpecs([{
        collection: "userSessionStates",
        selector: browserSessionSelector
      }]);
      Q.collection(Q.STATE_COLLECTION).updateOne(
        { _id: currentState._id },
        { $set: { browserSessionSnapshots } }
      );
      snapshotsCaptured = true;
    }
    const preparedAtIso = Q.nowIso();
    Q.collection("userSessionStates").updateMany(
      browserSessionSelector,
      { $set: { activeSessions: [], updatedDate: preparedAtIso } }
    );
    const after = browserSessionSummary();
    if (after.some(item => item.activeSessionCount !== 0)) {
      Q.fail("configured Casey/Nova/Ava browser sessions were not cleared exactly.");
    }
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      {
        $set: { browserSessionsPreparedAtIso: preparedAtIso },
        $inc: { browserSessionPreparationCount: 1 }
      }
    );
    return { before, after, snapshotsCaptured, preparedAtIso };
  }

  function prepareBrowserSessions() {
    config();
    const currentState = state();
    if (Q.text(currentState.phase) === "staging") {
      Q.fail("browser sessions cannot be prepared while fixture staging is incomplete.");
    }
    const result = clearBrowserActorSessions();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: Q.text(currentState.phase),
      browserSessionCleanup: result,
      next: "Run the versioned ASSET-CHECKOUT-001 browser launcher now."
    });
  }

  function currencyTotal(document, field) {
    return Number(document && document[field] && document[field].HUF || 0);
  }

  function savedCurrencyTotal(currentState, userId, field) {
    const saved = (currentState.userFields || []).find(item => item.userId === userId);
    const snapshot = saved && saved[field];
    return Number(snapshot && snapshot.present && snapshot.value && snapshot.value.HUF || 0);
  }

  function financeView(userId) {
    const user = Q.ensureUser(userId, `${CHECKPOINT} finance user`);
    return {
      userId,
      spentHuf: currencyTotal(user, "paymentSpentTotals"),
      incomeHuf: currencyTotal(user, "paymentIncomeTotals"),
      allHuf: currencyTotal(user, "paymentAllTotals")
    };
  }

  function assetPendingCounters(userId) {
    const user = Q.ensureUser(userId, `${CHECKPOINT} Asset counter user`);
    const asset = user && user.activities && user.activities.asset || {};
    return {
      carsPending: Number(asset.carsPending || 0),
      accommodationPending: Number(asset.accommodationPending || 0),
      suppliesPending: Number(asset.suppliesPending || 0)
    };
  }

  function scopedJoinRequestNotifications() {
    const outbox = Q.collection("notificationOutbox").find(notificationSelector).sort({ createdDate: 1, _id: 1 }).toArray()
      .filter(item => Q.text(item.notificationType) === "asset-admin-join-request")
      .map(item => ({
        id: Q.text(item._id),
        recipients: sorted(item.recipientUserIds),
        assetId: Q.text(item.entityId || item.payload && item.payload.assetId),
        eventId: Q.text(item.payload && item.payload.eventId),
        subEventId: Q.text(item.payload && item.payload.subEventId),
        memberUserId: Q.text(item.payload && item.payload.memberUserId),
        requestId: Q.text(item.payload && item.payload.requestId)
      }));
    const inbox = Q.collection("userNotifications").find(notificationSelector).sort({ createdDate: 1, _id: 1 }).toArray()
      .filter(item => Q.text(item.kind) === "asset-admin-join-request")
      .map(item => ({
        id: Q.text(item._id),
        recipientUserId: Q.text(item.recipientUserId),
        assetId: Q.text(item.sourceId || item.payload && item.payload.assetId),
        eventId: Q.text(item.payload && item.payload.eventId),
        subEventId: Q.text(item.payload && item.payload.subEventId),
        memberUserId: Q.text(item.payload && item.payload.memberUserId),
        requestId: Q.text(item.payload && item.payload.requestId)
      }));
    return { outbox, inbox };
  }

  function assertPendingOwnerNotification(requestId) {
    const notifications = scopedJoinRequestNotifications();
    const outbox = notifications.outbox[0];
    const inbox = notifications.inbox[0];
    if (notifications.outbox.length !== 1 || notifications.inbox.length !== 1
        || !outbox || !inbox
        || !Q.sameJson(outbox.recipients, [CASEY_ID])
        || inbox.recipientUserId !== CASEY_ID
        || outbox.assetId !== PAID_ID || inbox.assetId !== PAID_ID
        || outbox.eventId !== EVENT_ID || inbox.eventId !== EVENT_ID
        || outbox.subEventId !== SUB_EVENT_ID || inbox.subEventId !== SUB_EVENT_ID
        || outbox.memberUserId !== NOVA_ID || inbox.memberUserId !== NOVA_ID
        || outbox.requestId !== requestId || inbox.requestId !== requestId) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "owner-notification-diagnostic", requestId, notifications });
      Q.fail("paid pending Asset request did not create exactly one scoped Casey notification.");
    }
  }

  function assertFinancialDelta(currentState, approvedAmount) {
    const casey = financeView(CASEY_ID);
    const nova = financeView(NOVA_ID);
    const expectedCaseyIncome = savedCurrencyTotal(currentState, CASEY_ID, "paymentIncomeTotals") + approvedAmount;
    const expectedCaseyAll = savedCurrencyTotal(currentState, CASEY_ID, "paymentAllTotals") + approvedAmount;
    const expectedNovaSpent = savedCurrencyTotal(currentState, NOVA_ID, "paymentSpentTotals") + approvedAmount;
    const expectedNovaAll = savedCurrencyTotal(currentState, NOVA_ID, "paymentAllTotals") + approvedAmount;
    if (casey.spentHuf !== savedCurrencyTotal(currentState, CASEY_ID, "paymentSpentTotals")
        || casey.incomeHuf !== expectedCaseyIncome || casey.allHuf !== expectedCaseyAll
        || nova.spentHuf !== expectedNovaSpent
        || nova.incomeHuf !== savedCurrencyTotal(currentState, NOVA_ID, "paymentIncomeTotals")
        || nova.allHuf !== expectedNovaAll) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "finance-diagnostic", approvedAmount, casey, nova });
      Q.fail("payment total projections do not match the exact authorized Asset amount.");
    }
  }

  function displayTimeframe(start, end) {
    return `${start.toISOString().slice(0, 16).replace("T", " ")} UTC - ${end.toISOString().slice(11, 16)} UTC`;
  }

  function pricing(enabled, amount) {
    return {
      mode: enabled ? "fixed" : "free",
      basePrice: enabled ? amount : 0,
      currency: "HUF",
      taxMode: "included",
      chargeType: "per_attendee",
      quantityRulesEnabled: false,
      quantityRules: [],
      minPrice: null,
      maxPrice: null,
      rounding: "none",
      demandRulesEnabled: false,
      demandRules: [],
      timeRulesEnabled: false,
      timeRules: [],
      cancellationPolicy: { enabled: false, rules: [] },
      slotPricingEnabled: false,
      slotOverrides: [],
      audience: {
        enabled: false,
        memberPrice: null,
        vipPrice: null,
        inviteOnlyDiscountPercent: null,
        promoCodes: [],
        soldOutLabel: "Unavailable"
      },
      enabled
    };
  }

  function assetDocument(id, title, quantity, nowIso, options = {}) {
    const paid = options.paid !== false;
    return {
      _id: id,
      _class: "com.raxim.myscoutee.profile.data.document.Asset",
      syncKey: `${id}:sync`,
      assetId: id,
      ownerUserId: CASEY_ID,
      type: "Transport",
      title,
      subtitle: options.subtitle || "Stable ASSET-CHECKOUT-001 Transport control",
      category: "Sedan",
      city: "Austin",
      capacityTotal: Math.max(1, Number(options.capacityTotal || quantity || 1)),
      quantity,
      details: options.details || "Controlled Asset checkout manual-QA fixture.",
      imageUrl: "/media/public?key=images/demo-events/event-004/v1/large.webp",
      sourceLink: `https://example.com/qa/asset-checkout-001/${id.split(":").pop()}`,
      routes: ["Austin"],
      policiesEnabled: paid && options.policies !== false,
      policies: paid && options.policies !== false ? [{
        id: POLICY_ID,
        title: "QA Borrow policy",
        description: "Accept the lending terms before continuing.",
        required: true
      }] : [],
      pricing: pricing(paid, Number(options.amount || 3200)),
      requests: [],
      visibility: "Public",
      status: "A",
      affinity: 0,
      boost: 0,
      createdDate: nowIso,
      createdUser: CASEY_ID,
      updatedDate: nowIso,
      updatedUser: CASEY_ID
    };
  }

  function subEvent(id, name, start, end) {
    return {
      id,
      name,
      description: `${CHECKPOINT} direct Event resource scope`,
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000)),
      optional: false,
      capacityMin: 1,
      capacityMax: 4,
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      stageStatus: "A",
      stageStatusReason: "stage-started",
      membersAccepted: 2,
      membersPending: 0,
      carsAccepted: 0,
      carsPending: 0,
      carsCapacityMin: 0,
      carsCapacityMax: 0,
      accommodationAccepted: 0,
      accommodationPending: 0,
      accommodationCapacityMin: 0,
      accommodationCapacityMax: 0,
      suppliesAccepted: 0,
      suppliesPending: 0,
      suppliesCapacityMin: 0,
      suppliesCapacityMax: 0
    };
  }

  function eventDocument(nowIso, start, end) {
    const borrow = subEvent(SUB_EVENT_ID, "QA Borrow Stage", start, end);
    const siblingStart = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    const siblingEnd = new Date(end.getTime() + 3 * 60 * 60 * 1000);
    const sibling = subEvent(SIBLING_SUB_EVENT_ID, "QA Sibling Stage", siblingStart, siblingEnd);
    const definition = item => {
      const copy = { ...item };
      for (const key of [
        "stageStatus", "stageStatusReason", "membersAccepted", "membersPending",
        "carsAccepted", "carsPending", "carsCapacityMin", "carsCapacityMax",
        "accommodationAccepted", "accommodationPending", "accommodationCapacityMin", "accommodationCapacityMax",
        "suppliesAccepted", "suppliesPending", "suppliesCapacityMin", "suppliesCapacityMax"
      ]) delete copy[key];
      return copy;
    };
    return {
      _id: EVENT_ID,
      syncKey: `${EVENT_ID}:sync`,
      sourceId: EVENT_ID,
      ownerUserId: CASEY_ID,
      organizerUserId: CASEY_ID,
      creatorUserId: CASEY_ID,
      creatorName: "Casey Bridge",
      creatorInitials: "CB",
      admins: [CASEY_ID],
      title: "QA ASSET-CHECKOUT-001 Event",
      subtitle: "Barion Asset checkout and scoped borrow destination",
      timeframe: displayTimeframe(start, siblingEnd),
      startAtIso: start.toISOString(),
      endAtIso: siblingEnd.toISOString(),
      status: "A",
      published: true,
      expired: false,
      isTrashed: false,
      visibility: "Public",
      blindMode: "Visible Event",
      mode: "Casual",
      frequency: "Once",
      ticketing: false,
      approvalRequired: false,
      autoInviter: false,
      capacityMin: 1,
      capacityMax: 4,
      capacityTotal: 4,
      capacityTotalActual: 4,
      full: false,
      acceptedMembers: 2,
      pendingMembers: 0,
      acceptedMemberUserIds: [CASEY_ID, NOVA_ID],
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [],
      subEventsEnabled: true,
      subEventDefinitions: [definition(borrow), definition(sibling)],
      subEvents: [borrow, sibling],
      pricing: pricing(false, 0),
      policiesEnabled: false,
      policies: [],
      slotsEnabled: false,
      slotTemplates: [],
      upcomingSlots: [],
      topics: ["#ManualQA", "#AssetCheckout"],
      location: "Austin · ASSET-CHECKOUT-001 venue",
      locationCoordinates: { latitude: 30.2672, longitude: -97.7431 },
      locationGeo: { type: "Point", coordinates: [-97.7431, 30.2672] },
      imageUrl: "/media/public?key=images/demo-events/event-004/v1/large.webp",
      affinity: 0,
      boost: 0,
      createdDate: nowIso,
      createdUser: CASEY_ID,
      updatedDate: nowIso,
      updatedUser: CASEY_ID
    };
  }

  function eventMember(userId, role, nowIso) {
    const id = `${PREFIX}:event-member:${userId}`;
    return {
      _id: id,
      syncKey: `${id}:sync`,
      ownerType: "event",
      ownerId: EVENT_ID,
      userId,
      role,
      status: "accepted",
      pendingSource: null,
      requestKind: null,
      invitedByUserId: null,
      actionAtIso: nowIso,
      metAtIso: nowIso,
      metWhere: "QA ASSET-CHECKOUT-001 Event",
      createdDate: nowIso,
      createdUser: CASEY_ID,
      updatedDate: nowIso,
      updatedUser: CASEY_ID
    };
  }

  function cardDocument(id, last4, status, nowIso) {
    return {
      _id: id,
      version: 0,
      userId: NOVA_ID,
      provider: "barion",
      providerPaymentMethodRef: status === "expired"
        ? "pm_sim_asset_checkout_nova_barion_expired_0008"
        : "pm_sim_checkout_nova_barion_4444",
      brand: "Mastercard",
      last4,
      expiryMonth: status === "expired" ? 8 : 9,
      expiryYear: status === "expired" ? 2026 : 2029,
      expiryKey: status === "expired" ? 202608 : 202909,
      cardholderName: "NOVA SOCIAL",
      artworkKey: status === "expired" ? "coral" : "graphite",
      status,
      ...(status === "expired" ? { expiredNotifiedAtIso: nowIso } : {}),
      createdAtIso: nowIso,
      updatedAtIso: nowIso
    };
  }

  function staticSpecs() {
    return [
      { collection: "assets", selector: assetSelector },
      { collection: "events", selector: eventSelector },
      { collection: "activityMembers", selector: memberSelector },
      { collection: "assetRequests", selector: { assetId: { $in: ASSET_IDS } } },
      { collection: "activityResources", selector: resourceSelector },
      { collection: "eventCheckoutBasketItems", selector: basketSelector },
      { collection: "payments", selector: paymentSelector },
      { collection: "savedPaymentMethods", selector: cardSelector },
      { collection: "notificationOutbox", selector: notificationSelector },
      { collection: "userNotifications", selector: notificationSelector },
      { collection: "affinityRecomputeTasks", selector: { targetId: { $in: [EVENT_ID, ...ASSET_IDS] } } },
      { collection: "scheduledMessageTasks", selector: { eventId: EVENT_ID } }
    ];
  }

  function dynamicArtifacts() {
    const paymentIds = sorted(Q.collection("payments").find(paymentSelector).toArray().map(item => item._id));
    return { paymentIds };
  }

  function snapshotSpecs() {
    const snapshots = Q.snapshotSpecs(staticSpecs());
    const dynamic = dynamicArtifacts();
    snapshots.push({
      collection: "payment_gateway_operations",
      selector: { paymentId: { $in: dynamic.paymentIds } },
      documents: dynamic.paymentIds.length === 0
        ? []
        : Q.collection("payment_gateway_operations").find({ paymentId: { $in: dynamic.paymentIds } }).toArray()
    });
    return snapshots;
  }

  function scopedArtifactCount() {
    return staticSpecs().reduce((total, spec) => total + Q.collection(spec.collection).countDocuments(spec.selector), 0);
  }

  function clearCurrentEffects() {
    const dynamic = dynamicArtifacts();
    if (dynamic.paymentIds.length > 0) {
      Q.collection("payment_gateway_operations").deleteMany({ paymentId: { $in: dynamic.paymentIds } });
    }
    for (const spec of staticSpecs()) Q.collection(spec.collection).deleteMany(spec.selector);
  }

  function paymentView(item) {
    return {
      id: Q.text(item._id),
      userId: Q.text(item.userId),
      recipientUserId: Q.text(item.recipientUserId),
      sourceId: Q.text(item.sourceId),
      checkoutSessionId: Q.text(item.checkoutSessionId),
      gatewaySessionId: Q.text(item.gatewaySessionId),
      provider: Q.text(item.provider),
      paymentMethodId: Q.text(item.paymentMethodId),
      status: Q.text(item.status),
      fulfillmentKind: Q.text(item.fulfillmentKind),
      fulfillmentStatus: Q.text(item.fulfillmentStatus),
      bookingStatus: Q.text(item.bookingStatus),
      amount: Number(item.amount || 0),
      currency: Q.text(item.currency),
      acceptedPolicyIds: sorted(item.acceptedPolicyIds),
      bookingStartAtIso: Q.text(item.bookingStartAtIso),
      bookingEndAtIso: Q.text(item.bookingEndAtIso)
    };
  }

  function requestView(request) {
    const booking = request && request.booking || {};
    return {
      id: Q.text(request && (request._id || request.id || request.requestId)),
      assetId: Q.text(request && request.assetId),
      userId: Q.text(request && request.userId),
      status: Q.text(request && request.status),
      requestKind: Q.text(request && request.requestKind),
      eventId: Q.text(booking.eventId),
      subEventId: Q.text(booking.subEventId),
      startAtIso: Q.text(booking.startAtIso),
      endAtIso: Q.text(booking.endAtIso),
      quantity: Number(booking.quantity || 0),
      totalAmount: Number(booking.totalAmount || 0),
      currency: Q.text(booking.currency),
      acceptedPolicyIds: sorted(booking.acceptedPolicyIds),
      paymentSessionId: Q.text(booking.paymentSessionId),
      inventoryApplied: booking.inventoryApplied === true
    };
  }

  function resourceView(resource) {
    const transportIds = resource && resource.assetAssignmentIds && resource.assetAssignmentIds.Transport || [];
    const settings = resource && resource.assetSettingsByType && resource.assetSettingsByType.Transport || {};
    const metrics = resource && resource.resourceMetricsByType && resource.resourceMetricsByType.Transport || {};
    return {
      id: Q.text(resource && resource._id),
      ownerId: Q.text(resource && resource.ownerId),
      subEventId: Q.text(resource && resource.subEventId),
      assetOwnerUserId: Q.text(resource && resource.assetOwnerUserId),
      transportAssetIds: sorted(transportIds),
      targetQuantity: Number(settings[PAID_ID] && settings[PAID_ID].quantity || 0),
      targetAddedByUserId: Q.text(settings[PAID_ID] && settings[PAID_ID].addedByUserId),
      accepted: Number(metrics.accepted || 0),
      pending: Number(metrics.pending || 0),
      status: Q.text(resource && resource.status)
    };
  }

  function oracle() {
    const assets = Q.collection("assets").find({ assetId: { $in: ASSET_IDS } }).sort({ assetId: 1 }).toArray();
    const projections = Q.collection("assetRequests").find({ assetId: { $in: ASSET_IDS } }).sort({ assetId: 1, requestId: 1 }).toArray();
    const resources = Q.collection("activityResources").find(resourceSelector).sort({ subEventId: 1, assetOwnerUserId: 1 }).toArray();
    const payments = Q.collection("payments").find(paymentSelector).sort({ createdDate: 1, _id: 1 }).toArray();
    const event = Q.collection("events").findOne({ sourceId: EVENT_ID });
    const members = Q.collection("activityMembers").find(memberSelector).sort({ ownerType: 1, ownerId: 1, userId: 1 }).toArray();
    return {
      event: event ? {
        title: Q.text(event.title),
        acceptedMembers: Number(event.acceptedMembers || 0),
        acceptedMemberUserIds: sorted(event.acceptedMemberUserIds),
        subEventIds: sorted((event.subEventDefinitions || []).map(item => item && item.id))
      } : null,
      assets: assets.map(asset => ({
        assetId: Q.text(asset.assetId),
        title: Q.text(asset.title),
        ownerUserId: Q.text(asset.ownerUserId),
        quantity: Number(asset.quantity || 0),
        capacityTotal: Number(asset.capacityTotal || 0),
        pricingEnabled: asset.pricing && asset.pricing.enabled === true,
        amount: Number(asset.pricing && asset.pricing.basePrice || 0),
        policies: (asset.policies || []).map(item => ({ id: Q.text(item.id), required: item.required === true })),
        requests: (asset.requests || []).map(requestView)
      })),
      projections: projections.map(requestView),
      resources: resources.map(resourceView),
      payments: payments.map(paymentView),
      baskets: Q.collection("eventCheckoutBasketItems").find(activeBasketSelector).sort({ sourceId: 1, _id: 1 }).toArray().map(basketView),
      basketAudit: Q.collection("eventCheckoutBasketItems").find(basketSelector).sort({ sourceId: 1, _id: 1 }).toArray().map(basketView),
      storedAssetMembers: members.filter(item => Q.text(item.ownerType) === "asset").map(item => ({
        ownerId: Q.text(item.ownerId), userId: Q.text(item.userId), role: Q.text(item.role), status: Q.text(item.status)
      })),
      eventMembers: members.filter(item => Q.text(item.ownerType) === "event").map(item => ({
        ownerId: Q.text(item.ownerId), userId: Q.text(item.userId), role: Q.text(item.role), status: Q.text(item.status)
      })),
      finances: {
        casey: financeView(CASEY_ID),
        nova: financeView(NOVA_ID)
      }
    };
  }

  function basketView(item) {
    return {
      id: Q.text(item._id),
      itemId: Q.text(item.itemId),
      sourceId: Q.text(item.sourceId),
      userId: Q.text(item.userId),
      kind: Q.text(item.kind),
      subEventId: Q.text(item.subEventId),
      resourceType: Q.text(item.resourceType),
      label: Q.text(item.label),
      detail: Q.text(item.detail),
      amount: Number(item.amount || 0),
      currency: Q.text(item.currency),
      quantity: Number(item.quantity || 0),
      status: Q.text(item.status),
      resultState: Q.text(item.resultState),
      reservationActive: item.reservationActive === true,
      pendingCounterTracked: item.pendingCounterTracked === true,
      checkoutSessionId: Q.text(item.checkoutSessionId),
      createdAtIso: Q.text(item.createdAtIso),
      expiresAtIso: Q.text(item.expiresAtIso)
    };
  }

  function hasTenMinuteBasketTtl(basket) {
    const createdAtMs = Date.parse(Q.text(basket && basket.createdAtIso));
    const expiresAtMs = Date.parse(Q.text(basket && basket.expiresAtIso));
    const ttlMs = expiresAtMs - createdAtMs;
    return Number.isFinite(ttlMs) && ttlMs >= 599000 && ttlMs <= 601000;
  }

  function assetById(current, assetId) {
    return current.assets.find(item => item.assetId === assetId);
  }

  function requestReservesWindow(request) {
    return request
      && !request.inventoryApplied
      && (request.status === "accepted"
        || request.requestKind === "manual"
        || (request.status === "pending" && request.requestKind === "borrow"));
  }

  function rangesOverlap(leftStartAtIso, leftEndAtIso, rightStartAtIso, rightEndAtIso) {
    const leftStart = Date.parse(Q.text(leftStartAtIso));
    const leftEnd = Date.parse(Q.text(leftEndAtIso));
    const rightStart = Date.parse(Q.text(rightStartAtIso));
    const rightEnd = Date.parse(Q.text(rightEndAtIso));
    return [leftStart, leftEnd, rightStart, rightEnd].every(Number.isFinite)
      && leftStart < rightEnd
      && rightStart < leftEnd;
  }

  function assetWindowAvailability(asset, startAtIso, endAtIso) {
    if (!asset) return 0;
    const reserved = asset.requests
      .filter(requestReservesWindow)
      .filter(request => rangesOverlap(request.startAtIso, request.endAtIso, startAtIso, endAtIso))
      .reduce((sum, request) => sum + Math.max(1, Number(request.quantity || 0)), 0);
    return Math.max(0, asset.quantity - reserved);
  }

  function targetWindowAvailability(asset) {
    const context = state().context || {};
    return assetWindowAvailability(asset, context.startAtIso, context.endAtIso);
  }

  function nonOverlappingWindowAvailability(asset) {
    const context = state().context || {};
    const start = new Date(Date.parse(Q.text(context.endAtIso)) + 60 * 60 * 1000);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return assetWindowAvailability(asset, start.toISOString(), end.toISOString());
  }

  function assertSimulator(expected3ds) {
    if (provider !== "barion" || !providerConnected || requires3ds !== expected3ds) {
      Q.fail(`simulator is provider='${provider}', connected=${providerConnected}, requires3ds=${requires3ds}; expected connected Barion with 3DS ${expected3ds ? "On" : "Off"}.`);
    }
  }

  function assertScope(current) {
    if (!current.event
        || current.event.title !== "QA ASSET-CHECKOUT-001 Event"
        || current.event.acceptedMembers !== 2
        || !Q.sameJson(current.event.acceptedMemberUserIds, [CASEY_ID, NOVA_ID].sort())
        || !Q.sameJson(current.event.subEventIds, [SIBLING_SUB_EVENT_ID, SUB_EVENT_ID].sort())
        || current.eventMembers.length !== 2
        || !current.eventMembers.some(item => item.userId === CASEY_ID && item.role === "Admin" && item.status === "accepted")
        || !current.eventMembers.some(item => item.userId === NOVA_ID && item.role === "Member" && item.status === "accepted")) {
      Q.fail("Event/Sub-event and Casey/Nova membership scope is not exact.");
    }
    if (current.resources.some(item => item.subEventId === SIBLING_SUB_EVENT_ID)
        || current.storedAssetMembers.some(item => item.userId === NOVA_ID || item.userId === RILEY_ID)) {
      Q.fail("sibling Sub-event or stored Asset-role isolation changed.");
    }
  }

  function immutableControlFingerprint() {
    return {
      assets: Q.collection("assets").find({ assetId: { $in: IMMUTABLE_CONTROL_IDS } }).sort({ assetId: 1 }).toArray(),
      projections: Q.collection("assetRequests").find({ assetId: { $in: IMMUTABLE_CONTROL_IDS } }).sort({ _id: 1 }).toArray(),
      resources: Q.collection("activityResources").find({ "assetAssignmentIds.Transport": { $in: IMMUTABLE_CONTROL_IDS } }).sort({ _id: 1 }).toArray(),
      payments: Q.collection("payments").find({ sourceId: { $in: IMMUTABLE_CONTROL_IDS } }).sort({ _id: 1 }).toArray(),
      baskets: Q.collection("eventCheckoutBasketItems").find({ sourceId: { $in: IMMUTABLE_CONTROL_IDS } }).sort({ _id: 1 }).toArray()
    };
  }

  function assertImmutableControls(currentState) {
    if (!samePersisted(immutableControlFingerprint(), currentState.immutableControlFingerprint)) {
      Q.fail("Free, unavailable or adjacent-paid control changed.");
    }
  }

  function assertBaseline(checkSimulator = true) {
    if (checkSimulator) assertSimulator(false);
    const current = oracle();
    assertScope(current);
    const paid = assetById(current, PAID_ID);
    const free = assetById(current, FREE_ID);
    const unavailable = assetById(current, UNAVAILABLE_ID);
    const adjacent = assetById(current, ADJACENT_ID);
    const decline = assetById(current, DECLINE_ID);
    const timeout = assetById(current, TIMEOUT_ID);
    if (current.assets.length !== ASSET_IDS.length
        || !paid || paid.title !== "QA ASSET-CHECKOUT-001 Paid Transport" || paid.quantity !== 3 || paid.capacityTotal !== 3
        || !paid.pricingEnabled || paid.amount !== 3200 || paid.policies.length !== 1
        || paid.policies[0].id !== POLICY_ID || !paid.policies[0].required
        || !free || free.title !== "QA ASSET-CHECKOUT-001 Free Transport" || free.pricingEnabled || free.quantity !== 2
        || !unavailable || unavailable.quantity !== 0
        || !adjacent || !adjacent.pricingEnabled || adjacent.quantity !== 2
        || !decline || decline.quantity !== 1
        || !timeout || timeout.quantity !== 1
        || current.assets.some(item => item.ownerUserId !== CASEY_ID || item.requests.length !== 0)
        || current.projections.length !== 0
        || current.resources.length !== 0
        || current.payments.length !== 0
        || current.baskets.length !== 0
        || current.basketAudit.length !== 0
        || current.storedAssetMembers.length !== 0) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "baseline-diagnostic", oracle: current });
      Q.fail("fresh paid Asset/control baseline is not exact.");
    }
    const cards = Q.collection("savedPaymentMethods").find(cardSelector).sort({ _id: 1 }).toArray();
    if (cards.length !== 2
        || !cards.some(item => Q.text(item.provider) === "barion" && Q.text(item.last4) === "4444" && Q.text(item.status) === "active")
        || !cards.some(item => Q.text(item.provider) === "barion" && Q.text(item.last4) === "0008" && Q.text(item.status) === "expired")) {
      Q.fail("Nova's active and expired Barion card controls are not exact.");
    }
    assertFinancialDelta(state(), 0);
    return current;
  }

  function synchronizeOwnerAssetCounters() {
    const active = Q.collection("assets").find({ ownerUserId: CASEY_ID, status: { $nin: ["T", "D", "I", "B", "UR"] } }).toArray();
    const counts = { Transport: 0, Accommodation: 0, Supplies: 0 };
    const pending = { Transport: 0, Accommodation: 0, Supplies: 0 };
    for (const asset of active) {
      const type = Q.text(asset.type);
      if (!Object.prototype.hasOwnProperty.call(counts, type)) continue;
      counts[type] += 1;
      pending[type] += (Array.isArray(asset.requests) ? asset.requests : []).filter(request =>
        Q.text(request && request.status).toLowerCase() === "pending"
        && Q.text(request && request.requestKind).toLowerCase() !== "manual"
      ).length;
    }
    const result = Q.collection("users").updateOne(userSelector(CASEY_ID), { $set: {
      "activities.cars": counts.Transport,
      "activities.accommodation": counts.Accommodation,
      "activities.supplies": counts.Supplies,
      "activities.asset.cars": counts.Transport,
      "activities.asset.accommodation": counts.Accommodation,
      "activities.asset.supplies": counts.Supplies,
      "activities.asset.carsPending": pending.Transport,
      "activities.asset.accommodationPending": pending.Accommodation,
      "activities.asset.suppliesPending": pending.Supplies
    } });
    if (result.matchedCount !== 1) Q.fail("could not synchronize Casey's Asset counters.");
  }

  function applyEventCounterDelta(userId, hosting) {
    const increments = hosting
      ? { "activities.hosting": 1, "activities.event.all": 1, "activities.event.hosting": 1 }
      : { "activities.events": 1, "activities.event.all": 1, "activities.event.active": 1 };
    const result = Q.collection("users").updateOne(userSelector(userId), { $inc: increments });
    if (result.matchedCount !== 1) Q.fail(`event counter user '${userId}' disappeared.`);
  }

  function stage() {
    config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    const casey = Q.ensureUser(CASEY_ID, "Casey");
    const nova = Q.ensureUser(NOVA_ID, "Nova");
    const riley = Q.ensureUser(RILEY_ID, "Riley");
    if (Q.text(casey.name) !== "Casey Bridge" || Q.text(nova.name) !== "Nova Social") {
      Q.fail("the configured Casey/Nova browser identities do not match the demo users.");
    }
    if (scopedArtifactCount() !== 0) {
      Q.fail(`${CHECKPOINT} fixture records exist without an active snapshot; refusing to overwrite them.`);
    }
    const now = new Date();
    const nowIso = now.toISOString();
    const start = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "staging",
      stagedAtIso: nowIso,
      snapshots: snapshotSpecs(),
      userFields: [casey, nova, riley].map(userFields),
      context: {
        caseyUserId: CASEY_ID,
        novaUserId: NOVA_ID,
        rileyUserId: RILEY_ID,
        eventId: EVENT_ID,
        subEventId: SUB_EVENT_ID,
        siblingSubEventId: SIBLING_SUB_EVENT_ID,
        paidAssetId: PAID_ID,
        freeAssetId: FREE_ID,
        unavailableAssetId: UNAVAILABLE_ID,
        adjacentPaidAssetId: ADJACENT_ID,
        declineAssetId: DECLINE_ID,
        timeoutAssetId: TIMEOUT_ID,
        policyId: POLICY_ID,
        startAtIso: start.toISOString(),
        endAtIso: end.toISOString()
      }
    });
    try {
      const browserSessionCleanup = clearBrowserActorSessions();
      Q.collection("events").insertOne(eventDocument(nowIso, start, end));
      Q.collection("activityMembers").insertMany([
        eventMember(CASEY_ID, "Admin", nowIso),
        eventMember(NOVA_ID, "Member", nowIso)
      ]);
      Q.collection("assets").insertMany([
        assetDocument(PAID_ID, "QA ASSET-CHECKOUT-001 Paid Transport", 3, nowIso, { capacityTotal: 3 }),
        assetDocument(FREE_ID, "QA ASSET-CHECKOUT-001 Free Transport", 2, nowIso, { paid: false, capacityTotal: 2 }),
        assetDocument(UNAVAILABLE_ID, "QA ASSET-CHECKOUT-001 Unavailable Transport", 0, nowIso, { paid: false, capacityTotal: 1 }),
        assetDocument(ADJACENT_ID, "QA ASSET-CHECKOUT-001 Adjacent Paid Transport", 2, nowIso, { capacityTotal: 2, amount: 4100 }),
        assetDocument(DECLINE_ID, "QA ASSET-CHECKOUT-001 Decline Control", 1, nowIso, { capacityTotal: 1, amount: 2300 }),
        assetDocument(TIMEOUT_ID, "QA ASSET-CHECKOUT-001 Timeout Control", 1, nowIso, { capacityTotal: 1, amount: 2700 })
      ]);
      Q.collection("savedPaymentMethods").insertMany([
        cardDocument(CARD_IDS.active, "4444", "active", nowIso),
        cardDocument(CARD_IDS.expired, "0008", "expired", nowIso)
      ]);
      synchronizeOwnerAssetCounters();
      applyEventCounterDelta(CASEY_ID, true);
      applyEventCounterDelta(NOVA_ID, false);
      const immutable = immutableControlFingerprint();
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: Q.stateId(SCENARIO) }, { $set: {
        phase: "baseline-ready",
        browserSessionCleanup,
        immutableControlFingerprint: immutable,
        baselineOracle: oracle()
      } });
    } catch (error) {
      Q.fail(`stage failed after snapshot: ${Q.text(error && error.message)}. Run reset asset-checkout ${CHECKPOINT}.`);
    }
    const current = assertBaseline(false);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "baseline-ready",
      identities: state().context,
      baseline: current,
      next: "The harness now configures Barion with 3DS Off and proves it through a second status before user control."
    });
  }

  function phaseSummary(currentState) {
    return {
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: Q.text(currentState.phase),
      simulator: { provider, connected: providerConnected, requires3ds },
      browserSessions: browserSessionSummary(),
      browserSessionsPreparedAtIso: Q.text(currentState.browserSessionsPreparedAtIso),
      identities: currentState.context,
      caseyAssetPendingCounters: assetPendingCounters(CASEY_ID),
      scopedJoinRequestNotifications: scopedJoinRequestNotifications(),
      oracle: oracle()
    };
  }

  function status() {
    config();
    const currentState = state(false);
    if (!currentState) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "not-staged", simulator: { provider, connected: providerConnected, requires3ds } });
      return;
    }
    if (Q.text(currentState.phase) === "baseline-ready") assertBaseline();
    Q.printObject(phaseSummary(currentState));
  }

  function captureSavepoint(name, phase) {
    const currentState = state();
    const snapshots = snapshotSpecs();
    const users = [CASEY_ID, NOVA_ID, RILEY_ID].map(userId => userFields(Q.ensureUser(userId, userId)));
    const currentOracle = oracle();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: currentState._id }, { $set: {
      phase,
      [`${name}Snapshots`]: snapshots,
      [`${name}UserFields`]: users,
      [`${name}Oracle`]: currentOracle,
      [`${name}CapturedAtIso`]: Q.nowIso()
    } });
    return currentOracle;
  }

  function targetBasket(current, sourceId = PAID_ID) {
    return current.baskets.find(item => item.sourceId === sourceId && item.userId === NOVA_ID);
  }

  function targetBasketHistory(current, sourceId = PAID_ID) {
    return current.basketAudit
      .filter(item => item.sourceId === sourceId && item.userId === NOVA_ID)
      .sort((left, right) => {
        const createdOrder = left.createdAtIso.localeCompare(right.createdAtIso);
        return createdOrder !== 0 ? createdOrder : left.id.localeCompare(right.id);
      });
  }

  function assertPaymentReadyState(current, expectedAuditCounts) {
    assertScope(current);
    const paid = assetById(current, PAID_ID);
    const basket = targetBasket(current);
    const basketHistory = targetBasketHistory(current);
    const acceptedAuditCounts = Array.isArray(expectedAuditCounts) ? expectedAuditCounts : [expectedAuditCounts];
    const auditCount = current.basketAudit.length;
    const quantityHistory = basketHistory.map(item => item.quantity);
    const selectionHistory = basketHistory.map(item => [
      item.quantity,
      item.detail,
      item.amount,
      item.currency
    ].join("|"));
    const everyGenerationChanged = selectionHistory.every((selection, index) => (
      index === 0 || selection !== selectionHistory[index - 1]
    ));
    const canonicalHistory = auditCount === 3 && Q.sameJson(quantityHistory, [1, 2, 1]);
    const disclosedExploratoryHistory = auditCount === 5
      && Q.sameJson(quantityHistory, [1, 1, 1, 2, 1])
      && everyGenerationChanged;
    if (!paid || paid.quantity !== 3 || paid.requests.length !== 0
        || current.projections.length !== 0 || current.resources.length !== 0
        || current.payments.length !== 0 || current.baskets.length !== 1
        || !basket || basket.kind !== "resource" || basket.subEventId !== SUB_EVENT_ID
        || basket.resourceType !== "Transport" || basket.quantity !== 1
        || basket.amount !== 3200 || basket.currency !== "HUF"
        || basket.status !== "confirmed" || basket.resultState !== "pending"
        || !basket.reservationActive || !basket.pendingCounterTracked
        || basket.checkoutSessionId || !hasTenMinuteBasketTtl(basket)
        || !acceptedAuditCounts.includes(auditCount)
        || current.basketAudit.filter(item => item.resultState === "deleted").length !== auditCount - 1
        || (auditCount === 1 && !Q.sameJson(quantityHistory, [1]))
        || (auditCount > 1 && !canonicalHistory && !disclosedExploratoryHistory)
        || basketHistory.at(-1)?.resultState !== "pending"
        || basketHistory.slice(0, -1).some(item => item.resultState !== "deleted")
        || current.storedAssetMembers.length !== 0) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "payment-ready-diagnostic", expectedAuditCounts: acceptedAuditCounts, oracle: current });
      Q.fail("payment-ready boundary does not contain exactly one confirmed Asset borrow basket and zero premature request/payment/inventory/assignment/role writes.");
    }
  }

  function capturePaymentReady() {
    config();
    const currentState = state();
    if (Q.text(currentState.phase) !== "baseline-ready") Q.fail("payment-ready can only be captured from baseline-ready.");
    assertSimulator(false);
    const current = oracle();
    assertPaymentReadyState(current, 1);
    assertImmutableControls(currentState);
    assertFinancialDelta(currentState, 0);
    captureSavepoint("paymentReady", "payment-ready");
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "payment-ready",
      serverPaymentSessions: 0,
      serverCheckoutBaskets: 1,
      note: "The pre-Pay Borrow Basket is synchronized in the signal, frontend local repository and backend repository; no provider authorization, borrow request or inventory write exists yet.",
      next: "Continue at step 19 and report the revised-payment-ready phrase after step 29."
    });
  }

  function captureRevisedPaymentReady() {
    config();
    const currentState = state();
    const currentPhase = Q.text(currentState.phase);
    if (!["baseline-ready", "payment-ready"].includes(currentPhase)) {
      Q.fail("revised-payment-ready requires baseline-ready or payment-ready.");
    }
    assertSimulator(false);
    const current = oracle();
    assertPaymentReadyState(current, [3, 5]);
    assertImmutableControls(currentState);
    assertFinancialDelta(currentState, 0);
    captureSavepoint("revisedPaymentReady", "revised-payment-ready");
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: currentState._id }, { $set: {
      revisedPaymentReadyAuditCount: current.basketAudit.length
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "revised-payment-ready",
      serverPaymentSessions: 0,
      activeServerCheckoutBaskets: 1,
      checkoutBasketAuditRecords: current.basketAudit.length,
      quantityHistory: targetBasketHistory(current).map(item => item.quantity),
      retrospectivePaymentReadyProof: currentPhase === "baseline-ready",
      rollbackCommand: `rollback-revised-payment-ready asset-checkout ${CHECKPOINT}`,
      next: "Enable Barion 3DS in Ava, Pay once, approve once, then report the paid-pending phrase after step 37."
    });
  }

  function targetRequest(current, status) {
    const paid = assetById(current, PAID_ID);
    return paid && paid.requests.find(item => item.userId === NOVA_ID && item.status === status && item.requestKind === "borrow");
  }

  function assertPaidPending(current) {
    const currentState = state();
    const expectedPaidBasketAuditCount = Math.max(1, Number(currentState.revisedPaymentReadyAuditCount || 3)) + 1;
    assertScope(current);
    const paidAsset = assetById(current, PAID_ID);
    const request = targetRequest(current, "pending");
    const projection = current.projections.find(item => item.userId === NOVA_ID && item.status === "pending" && item.requestKind === "borrow");
    const payment = current.payments.find(item => item.sourceId === PAID_ID && item.userId === NOVA_ID && item.status === "authorized");
    const resource = current.resources.find(item => item.ownerId === EVENT_ID && item.subEventId === SUB_EVENT_ID && item.transportAssetIds.includes(PAID_ID));
    const basket = targetBasket(current);
    if (!paidAsset || paidAsset.quantity !== 3 || paidAsset.requests.length !== 1
        || targetWindowAvailability(paidAsset) !== 2
        || nonOverlappingWindowAvailability(paidAsset) !== 3
        || !request || request.eventId !== EVENT_ID || request.subEventId !== SUB_EVENT_ID
        || request.quantity !== 1 || request.totalAmount !== 3200 || request.currency !== "HUF"
        || !Q.sameJson(request.acceptedPolicyIds, []) || !request.paymentSessionId || request.inventoryApplied
        || current.projections.length !== 1 || !projection || projection.paymentSessionId !== request.paymentSessionId
        || current.payments.length !== 1 || !payment || payment.checkoutSessionId !== request.paymentSessionId
        || payment.provider !== "barion" || payment.paymentMethodId !== CARD_IDS.active
        || payment.recipientUserId !== CASEY_ID || payment.amount !== 3200 || payment.currency !== "HUF"
        || payment.fulfillmentKind !== "client" || payment.fulfillmentStatus !== "succeeded" || payment.bookingStatus !== "joined"
        || !Q.sameJson(payment.acceptedPolicyIds, [])
        || current.resources.length !== 1 || !resource || resource.assetOwnerUserId !== NOVA_ID
        || resource.targetQuantity !== 1 || resource.targetAddedByUserId !== NOVA_ID
        || resource.pending !== 1 || resource.accepted !== 0
        || current.baskets.filter(item => item.sourceId === PAID_ID).length !== 1
        || !basket || basket.status !== "pay" || basket.resultState !== "succeeded"
        || basket.quantity !== 1 || basket.amount !== 3200 || basket.currency !== "HUF"
        || !hasTenMinuteBasketTtl(basket)
        || basket.checkoutSessionId !== request.paymentSessionId
        || basket.reservationActive || basket.pendingCounterTracked
        || current.basketAudit.filter(item => item.sourceId === PAID_ID).length !== expectedPaidBasketAuditCount
        || current.basketAudit.filter(item => item.sourceId === PAID_ID && item.resultState === "deleted").length !== expectedPaidBasketAuditCount - 1
        || current.storedAssetMembers.length !== 0) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "paid-pending-diagnostic", oracle: current });
      Q.fail("paid-pending Asset checkout write model is not exact-once or not scoped correctly.");
    }
    if (!Q.sameJson(assetPendingCounters(CASEY_ID), {
      carsPending: 1,
      accommodationPending: 0,
      suppliesPending: 0
    })) {
      Q.fail("Casey's persisted Asset pending counters are not 1/0/0 after paid borrow materialization.");
    }
    assertPendingOwnerNotification(request.id);
    assertFinancialDelta(currentState, 3200);
    return { payment, request, resource };
  }

  function verifyPaidPending() {
    config();
    const currentState = state();
    if (Q.text(currentState.phase) !== "revised-payment-ready") Q.fail("paid-pending requires revised-payment-ready.");
    assertSimulator(true);
    const current = oracle();
    const result = assertPaidPending(current);
    assertImmutableControls(currentState);
    captureSavepoint("paidPending", "paid-pending");
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "paid-pending",
      paymentSessionId: result.payment.checkoutSessionId,
      storedQuantity: 3,
      selectedWindowAvailability: "3 -> 2",
      nonOverlappingWindowAvailability: 3,
      request: "one pending borrow",
      next: "Continue at step 39 and report the request-destination phrase after step 48."
    });
  }

  function verifyRequestDestination() {
    config();
    const currentState = state();
    if (Q.text(currentState.phase) !== "paid-pending") Q.fail("request-destination requires paid-pending.");
    const current = oracle();
    assertPaidPending(current);
    assertImmutableControls(currentState);
    if (!samePersisted(current, currentState.paidPendingOracle)) {
      Q.fail("read-only Payment summary/resource/member destination checks changed persisted checkout state.");
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: currentState._id }, { $set: {
      phase: "request-destination",
      requestDestinationVerifiedAtIso: Q.nowIso()
    } });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "request-destination", readOnly: true, next: "Approve Nova exactly once, then report the accepted phrase after step 55." });
  }

  function assertAccepted(current) {
    const currentState = state();
    assertScope(current);
    const paidAsset = assetById(current, PAID_ID);
    const request = targetRequest(current, "accepted");
    const projection = current.projections.find(item => item.userId === NOVA_ID && item.status === "accepted");
    const payment = current.payments.find(item => item.sourceId === PAID_ID && item.status === "authorized");
    const resource = current.resources.find(item => item.subEventId === SUB_EVENT_ID && item.transportAssetIds.includes(PAID_ID));
    const basket = targetBasket(current);
    if (!paidAsset || paidAsset.quantity !== 3 || paidAsset.requests.length !== 1
        || targetWindowAvailability(paidAsset) !== 2
        || nonOverlappingWindowAvailability(paidAsset) !== 3
        || !request || request.inventoryApplied || request.quantity !== 1
        || current.projections.length !== 1 || !projection || projection.paymentSessionId !== request.paymentSessionId
        || current.payments.filter(item => item.sourceId === PAID_ID).length !== 1 || !payment || payment.checkoutSessionId !== request.paymentSessionId
        || current.resources.length !== 1 || !resource || resource.accepted !== 1 || resource.pending !== 0
        || current.baskets.filter(item => item.sourceId === PAID_ID).length !== 1
        || !basket || basket.status !== "pay" || basket.resultState !== "succeeded"
        || !hasTenMinuteBasketTtl(basket)
        || basket.checkoutSessionId !== request.paymentSessionId || basket.reservationActive
        || current.storedAssetMembers.length !== 0) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "accepted-diagnostic", oracle: current });
      Q.fail("accepted Asset checkout state duplicated inventory/payment or escaped the exact resource scope.");
    }
    if (!Q.sameJson(assetPendingCounters(CASEY_ID), {
      carsPending: 0,
      accommodationPending: 0,
      suppliesPending: 0
    })) {
      Q.fail("Casey's persisted Asset pending counters did not return to 0/0/0 after approval.");
    }
    assertPendingOwnerNotification(request.id);
    assertFinancialDelta(currentState, 3200);
    return { payment, request, resource };
  }

  function verifyAccepted() {
    config();
    const currentState = state();
    if (Q.text(currentState.phase) !== "request-destination") Q.fail("accepted requires request-destination.");
    assertSimulator(true);
    const current = oracle();
    const result = assertAccepted(current);
    assertImmutableControls(currentState);
    captureSavepoint("accepted", "accepted");
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "accepted",
      paymentSessionId: result.payment.checkoutSessionId,
      storedQuantity: 3,
      selectedWindowAvailability: 2,
      nonOverlappingWindowAvailability: 3,
      resource: "one accepted scoped contribution",
      next: "Continue with reload, then the isolated Cancel, Free, unavailable, decline and timeout controls."
    });
  }

  function assertCancelledControl(current) {
    assertAccepted(current);
    const asset = assetById(current, ADJACENT_ID);
    const history = targetBasketHistory(current, ADJACENT_ID);
    const cancelledBasket = history[0];
    if (!asset || asset.quantity !== 2 || asset.requests.length !== 0
        || current.projections.some(item => item.assetId === ADJACENT_ID)
        || current.payments.some(item => item.sourceId === ADJACENT_ID)
        || current.resources.some(item => item.transportAssetIds.includes(ADJACENT_ID))
        || current.baskets.some(item => item.sourceId === ADJACENT_ID)
        || history.length !== 1
        || !cancelledBasket || cancelledBasket.status !== "cancelled" || cancelledBasket.resultState !== "deleted"
        || cancelledBasket.quantity !== 1 || cancelledBasket.amount !== 4100 || cancelledBasket.currency !== "HUF"
        || cancelledBasket.reservationActive || cancelledBasket.pendingCounterTracked
        || cancelledBasket.checkoutSessionId || !hasTenMinuteBasketTtl(cancelledBasket)) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "cancelled-control-diagnostic", oracle: current });
      Q.fail("the isolated Cancel branch did not delete exactly one pre-payment basket without request, payment, inventory or resource side effects.");
    }
    return cancelledBasket;
  }

  function verifyCancelled() {
    config();
    const currentState = state();
    if (Q.text(currentState.phase) !== "accepted") Q.fail("cancelled-control requires accepted.");
    assertSimulator(true);
    const current = oracle();
    const cancelledBasket = assertCancelledControl(current);
    captureSavepoint("cancelledControl", "cancelled-control");
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "cancelled-control",
      cancelledAssetId: ADJACENT_ID,
      cancelledBasketId: cancelledBasket.id,
      activeCancelBaskets: 0,
      requests: 0,
      payments: 0,
      inventoryDelta: 0,
      rollbackCommand: `rollback-cancelled-control asset-checkout ${CHECKPOINT}`,
      next: "Continue with the decline and timeout controls."
    });
  }

  function verifyTerminal() {
    config();
    const currentState = state();
    if (Q.text(currentState.phase) !== "cancelled-control") Q.fail("terminal verification requires cancelled-control.");
    assertSimulator(true);
    const current = oracle();
    assertCancelledControl(current);
    const declinePayments = current.payments.filter(item => item.sourceId === DECLINE_ID && item.userId === NOVA_ID);
    const timeoutPayments = current.payments.filter(item => item.sourceId === TIMEOUT_ID && item.userId === NOVA_ID);
    const declineAsset = assetById(current, DECLINE_ID);
    const timeoutAsset = assetById(current, TIMEOUT_ID);
    const declineBasket = targetBasket(current, DECLINE_ID);
    const timeoutBasket = targetBasket(current, TIMEOUT_ID);
    const isolated = asset => asset && asset.requests.length === 0 && asset.quantity === 1;
    if (declinePayments.length !== 1 || !["declined", "failed"].includes(declinePayments[0].status)
        || timeoutPayments.length !== 1 || timeoutPayments[0].status !== "expired"
        || !isolated(declineAsset) || !isolated(timeoutAsset)
        || current.projections.some(item => TERMINAL_CONTROL_IDS.includes(item.assetId))
        || current.resources.some(item => item.transportAssetIds.some(id => TERMINAL_CONTROL_IDS.includes(id)))
        || current.baskets.filter(item => TERMINAL_CONTROL_IDS.includes(item.sourceId)).length !== 2
        || !declineBasket || declineBasket.status !== "pay" || declineBasket.resultState !== "failed"
        || !hasTenMinuteBasketTtl(declineBasket)
        || !timeoutBasket || timeoutBasket.status !== "pay" || timeoutBasket.resultState !== "failed"
        || !hasTenMinuteBasketTtl(timeoutBasket)) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "terminal-diagnostic", oracle: current });
      Q.fail("decline/timeout controls were not isolated or did not reach one terminal payment each.");
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: currentState._id }, { $set: {
      phase: "verified",
      verifiedAtIso: Q.nowIso(),
      terminalOracle: current
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "verified",
      result: "PASS",
      approvedPayments: 1,
      declinedPayments: 1,
      expiredPayments: 1,
      cancelledBaskets: 1,
      storedQuantity: 3,
      selectedWindowAvailability: 2,
      siblingAndRileyIsolation: true,
      next: `Run reset asset-checkout ${CHECKPOINT} after evidence is recorded.`
    });
  }

  function rollbackTo(name, phase, allowedPhases) {
    config();
    const currentState = state();
    if (!allowedPhases.includes(Q.text(currentState.phase))) {
      Q.fail(`rollback '${name}' is not valid from phase '${Q.text(currentState.phase)}'.`);
    }
    const snapshots = currentState[`${name}Snapshots`];
    const users = currentState[`${name}UserFields`];
    const expected = currentState[`${name}Oracle`];
    if (!Array.isArray(snapshots) || snapshots.length === 0 || !Array.isArray(users) || !expected) {
      Q.fail(`savepoint '${name}' has not been captured.`);
    }
    clearCurrentEffects();
    Q.restoreSnapshots(snapshots);
    for (const saved of users) restoreUserFields(saved);
    synchronizeOwnerAssetCounters();
    const restored = oracle();
    if (!samePersisted(restored, expected)) {
      Q.fail(`rollback '${name}' did not restore the exact persisted savepoint.`);
    }
    const prePayment = ["payment-ready", "revised-payment-ready"].includes(phase);
    if (prePayment) {
      const createdAtIso = Q.nowIso();
      const expiresAtIso = new Date(Date.parse(createdAtIso) + 10 * 60 * 1000).toISOString();
      const refresh = Q.collection("eventCheckoutBasketItems").updateMany({
        sourceId: PAID_ID,
        userId: NOVA_ID,
        status: "confirmed",
        resultState: "pending"
      }, { $set: { createdAtIso, updatedAtIso: createdAtIso, expiresAtIso } });
      if (refresh.matchedCount !== 1 || refresh.modifiedCount !== 1) {
        Q.fail(`rollback '${name}' could not re-arm exactly one active pre-payment basket.`);
      }
    }
    const finalOracle = oracle();
    if (prePayment) {
      assertPaymentReadyState(finalOracle, phase === "payment-ready" ? 1 : [3, 5]);
    }
    const refreshedSnapshots = prePayment ? snapshotSpecs() : snapshots;
    const refreshedUsers = prePayment
      ? [CASEY_ID, NOVA_ID, RILEY_ID].map(userId => userFields(Q.ensureUser(userId, userId)))
      : users;
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: currentState._id }, { $set: {
      phase,
      [`${name}RolledBackAtIso`]: Q.nowIso(),
      [`${name}Snapshots`]: refreshedSnapshots,
      [`${name}UserFields`]: refreshedUsers,
      [`${name}Oracle`]: finalOracle
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase,
      rollback: name,
      restored: true,
      prePaymentTtlRearmed: prePayment
    });
  }

  function reset() {
    config();
    const currentState = state();
    clearCurrentEffects();
    Q.restoreSnapshots(currentState.snapshots || []);
    for (const saved of currentState.userFields || []) restoreUserFields(saved);
    if (Array.isArray(currentState.browserSessionSnapshots)) {
      Q.restoreSnapshots(currentState.browserSessionSnapshots);
    }
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: currentState._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "reset",
      restored: true,
      remainingScopedArtifacts: scopedArtifactCount()
    });
  }

  Q.assertDeploymentSafety();
  if (command === "stage") stage();
  else if (command === "status") status();
  else if (command === "prepare-browser") prepareBrowserSessions();
  else if (command === "capture-payment-ready") capturePaymentReady();
  else if (command === "capture-revised-payment-ready") captureRevisedPaymentReady();
  else if (command === "verify-paid-pending") verifyPaidPending();
  else if (command === "verify-request-destination") verifyRequestDestination();
  else if (command === "verify-accepted") verifyAccepted();
  else if (command === "verify-cancelled") verifyCancelled();
  else if (command === "verify") verifyTerminal();
  else if (command === "rollback-payment-ready") rollbackTo("paymentReady", "payment-ready", [
    "payment-ready", "revised-payment-ready", "paid-pending", "request-destination", "accepted", "cancelled-control", "verified"
  ]);
  else if (command === "rollback-revised-payment-ready") rollbackTo("revisedPaymentReady", "revised-payment-ready", [
    "revised-payment-ready", "paid-pending", "request-destination", "accepted", "cancelled-control", "verified"
  ]);
  else if (command === "rollback-paid-pending") rollbackTo("paidPending", "paid-pending", [
    "paid-pending", "request-destination", "accepted", "cancelled-control", "verified"
  ]);
  else if (command === "rollback-accepted") rollbackTo("accepted", "accepted", ["accepted", "cancelled-control", "verified"]);
  else if (command === "rollback-cancelled-control") rollbackTo("cancelledControl", "cancelled-control", ["cancelled-control", "verified"]);
  else if (command === "reset") reset();
  else Q.fail(`unsupported asset-checkout command '${command}'.`);
})();
