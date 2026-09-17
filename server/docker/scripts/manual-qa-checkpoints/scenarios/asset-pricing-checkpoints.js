/* global ManualQa, EJSON, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "asset-pricing";
  const CHECKPOINT = "ASSET-PRICING-001";
  const PREFIX = "manual-qa-checkpoint:v1:asset-pricing";
  const CASEY_ID = "650000000000000000000061";
  const NOVA_ID = "650000000000000000000062";
  const RILEY_ID = "650000000000000000000063";
  const EVENT_ID = `${PREFIX}:event`;
  const VARIABLE_SUB_EVENT_ID = `${PREFIX}:sub-event:variable`;
  const NO_POLICY_SUB_EVENT_ID = `${PREFIX}:sub-event:no-policy`;
  const CUTOFF_SUB_EVENT_ID = `${PREFIX}:sub-event:cutoff`;
  const ASSET_ID = `${PREFIX}:asset:interactive`;
  const CARD_IDS = {
    nova: `${PREFIX}:card:nova-barion-4444`,
    riley: `${PREFIX}:card:riley-barion-5555`
  };
  const ACTIVE_PAYMENT_AMOUNT = 2300;
  const NO_POLICY_PAYMENT_AMOUNT = 800;
  const CUTOFF_PAYMENT_AMOUNT = 900;
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const provider = Q.text(process.env.MANUAL_QA_PAYMENT_PROVIDER).toLowerCase();
  const providerConnected = Q.text(process.env.MANUAL_QA_PAYMENT_PROVIDER_CONNECTED) === "true";
  const requires3ds = Q.text(process.env.MANUAL_QA_PAYMENT_REQUIRES_3DS) === "true";

  const userSelector = userId => ({ $or: [{ _id: userId }, { userId }] });
  const assetSelector = { $or: [{ _id: ASSET_ID }, { assetId: ASSET_ID }] };
  const eventSelector = { $or: [{ _id: EVENT_ID }, { sourceId: EVENT_ID }] };
  const memberSelector = { ownerId: { $in: [EVENT_ID, ASSET_ID] } };
  const requestSelector = { assetId: ASSET_ID };
  const resourceSelector = { $or: [
    { ownerId: EVENT_ID },
    { "assetAssignmentIds.Transport": ASSET_ID }
  ] };
  const basketSelector = { sourceId: ASSET_ID };
  const paymentSelector = { sourceId: ASSET_ID };
  const cardSelector = { _id: { $in: Object.values(CARD_IDS) } };
  const notificationSelector = { $or: [
    { entityId: { $in: [EVENT_ID, ASSET_ID] } },
    { sourceId: { $in: [EVENT_ID, ASSET_ID] } },
    { "payload.eventId": EVENT_ID },
    { "payload.assetId": ASSET_ID },
    { "payload.sourceId": { $in: [EVENT_ID, ASSET_ID] } }
  ] };

  function config() {
    if (checkpointId !== CHECKPOINT) {
      Q.fail(`asset-pricing harness supports only ${CHECKPOINT}.`);
    }
  }

  function state(required = true) {
    const value = Q.activeState(SCENARIO, required);
    if (value && Q.text(value.checkpointId).toUpperCase() !== CHECKPOINT) {
      Q.fail(`staged pricing checkpoint is '${Q.text(value.checkpointId)}', not '${CHECKPOINT}'.`);
    }
    return value;
  }

  function sorted(values) {
    return [...new Set((values || []).map(value => Q.text(value)).filter(Boolean))].sort();
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
      paymentAllTotals: optionalField(document, "paymentAllTotals"),
      paymentRefundsPending: optionalField(document, "paymentRefundsPending")
    };
  }

  function restoreUserFields(saved) {
    const setValues = {};
    const unsetValues = {};
    for (const key of [
      "activities", "paymentSpentTotals", "paymentIncomeTotals",
      "paymentAllTotals", "paymentRefundsPending"
    ]) {
      if (saved[key] && saved[key].present) setValues[key] = saved[key].value;
      else unsetValues[key] = "";
    }
    const update = {};
    if (Object.keys(setValues).length > 0) update.$set = setValues;
    if (Object.keys(unsetValues).length > 0) update.$unset = unsetValues;
    const result = Q.collection("users").updateOne(userSelector(saved.userId), update);
    if (result.matchedCount !== 1) Q.fail(`could not restore user '${saved.userId}'.`);
  }

  function noPolicy() {
    return { enabled: false, rules: [] };
  }

  function activePolicy() {
    return {
      enabled: true,
      rules: [{
        id: "qa-pricing-refund-one-day-50",
        offsetUnit: "days",
        offsetValue: 1,
        refundKind: "percent",
        refundValue: 50
      }]
    };
  }

  function emptyAudience() {
    return {
      enabled: false,
      memberPrice: null,
      vipPrice: null,
      inviteOnlyDiscountPercent: null,
      promoCodes: [],
      soldOutLabel: "Unavailable"
    };
  }

  function pricingOff() {
    return {
      enabled: false,
      mode: "fixed",
      basePrice: 0,
      currency: "HUF",
      taxMode: "included",
      chargeType: "per_booking",
      quantityRulesEnabled: false,
      quantityRules: [],
      minPrice: null,
      maxPrice: null,
      rounding: "none",
      demandRulesEnabled: false,
      demandRules: [],
      timeRulesEnabled: false,
      timeRules: [],
      cancellationPolicy: noPolicy(),
      slotPricingEnabled: false,
      slotOverrides: [],
      audience: emptyAudience()
    };
  }

  function fixedPricing(amount, cancellationPolicy = noPolicy()) {
    return {
      ...pricingOff(),
      enabled: true,
      basePrice: amount,
      cancellationPolicy
    };
  }

  function hybridPricing(audience = emptyAudience(), cancellationPolicy = noPolicy()) {
    return {
      enabled: true,
      mode: "hybrid",
      basePrice: 999,
      currency: "HUF",
      taxMode: "included",
      chargeType: "per_attendee",
      quantityRulesEnabled: true,
      quantityRules: [{
        id: "qa-pricing-quantity-one",
        minQuantity: 1,
        action: { kind: "decrease_amount", value: 49 }
      }],
      minPrice: 900,
      maxPrice: 1200,
      rounding: "whole",
      demandRulesEnabled: true,
      demandRules: [{
        id: "qa-pricing-demand-33",
        operator: "gte",
        capacityFilledPercent: 33,
        action: { kind: "increase_percent", value: 10 },
        appliesTo: "all_slots",
        slotIds: []
      }],
      timeRulesEnabled: true,
      timeRules: [{
        id: "qa-pricing-time-96-hours",
        trigger: "hours_before_start",
        offsetValue: 96,
        specificDateStart: null,
        specificDateEnd: null,
        action: { kind: "increase_percent", value: 10 },
        appliesTo: "all_slots",
        slotIds: []
      }],
      cancellationPolicy,
      slotPricingEnabled: false,
      slotOverrides: [],
      audience
    };
  }

  function normalizedRules(items, mapper) {
    return (items || []).map(mapper);
  }

  function policyView(value) {
    return {
      enabled: value && value.enabled === true,
      rules: normalizedRules(value && value.enabled === true ? value.rules : [], item => ({
        offsetUnit: Q.text(item && item.offsetUnit),
        offsetValue: Number(item && item.offsetValue),
        refundKind: Q.text(item && item.refundKind),
        refundValue: Number(item && item.refundValue)
      }))
    };
  }

  function pricingView(value) {
    const pricing = value || {};
    const audience = pricing.audience || {};
    return {
      enabled: pricing.enabled === true,
      mode: Q.text(pricing.mode),
      basePrice: Number(pricing.basePrice || 0),
      currency: Q.text(pricing.currency),
      taxMode: Q.text(pricing.taxMode),
      chargeType: Q.text(pricing.chargeType),
      quantityRulesEnabled: pricing.quantityRulesEnabled === true,
      quantityRules: normalizedRules(pricing.quantityRulesEnabled === true ? pricing.quantityRules : [], item => ({
        minQuantity: Number(item && item.minQuantity),
        action: {
          kind: Q.text(item && item.action && item.action.kind),
          value: Number(item && item.action && item.action.value)
        }
      })),
      minPrice: pricing.minPrice == null ? null : Number(pricing.minPrice),
      maxPrice: pricing.maxPrice == null ? null : Number(pricing.maxPrice),
      rounding: Q.text(pricing.rounding),
      demandRulesEnabled: pricing.demandRulesEnabled === true,
      demandRules: normalizedRules(pricing.demandRulesEnabled === true ? pricing.demandRules : [], item => ({
        operator: Q.text(item && item.operator),
        capacityFilledPercent: Number(item && item.capacityFilledPercent),
        action: {
          kind: Q.text(item && item.action && item.action.kind),
          value: Number(item && item.action && item.action.value)
        },
        appliesTo: Q.text(item && item.appliesTo),
        slotIds: sorted(item && item.slotIds)
      })),
      timeRulesEnabled: pricing.timeRulesEnabled === true,
      timeRules: normalizedRules(pricing.timeRulesEnabled === true ? pricing.timeRules : [], item => ({
        trigger: Q.text(item && item.trigger),
        offsetValue: Number(item && item.offsetValue),
        action: {
          kind: Q.text(item && item.action && item.action.kind),
          value: Number(item && item.action && item.action.value)
        },
        appliesTo: Q.text(item && item.appliesTo),
        slotIds: sorted(item && item.slotIds)
      })),
      cancellationPolicy: policyView(pricing.cancellationPolicy),
      slotPricingEnabled: pricing.slotPricingEnabled === true,
      slotOverrides: normalizedRules(pricing.slotPricingEnabled === true ? pricing.slotOverrides : [], item => item),
      audience: {
        enabled: audience.enabled === true,
        memberPrice: audience.memberPrice == null ? null : Number(audience.memberPrice),
        vipPrice: audience.vipPrice == null ? null : Number(audience.vipPrice),
        inviteOnlyDiscountPercent: audience.inviteOnlyDiscountPercent == null
          ? null
          : Number(audience.inviteOnlyDiscountPercent),
        promoCodes: normalizedRules(audience.promoCodes, item => ({
          code: Q.text(item && item.code).toUpperCase(),
          action: {
            kind: Q.text(item && item.action && item.action.kind),
            value: Number(item && item.action && item.action.value)
          }
        }))
      }
    };
  }

  function expectedPricingView(value) {
    return pricingView(value);
  }

  function assetDocument(nowIso) {
    return {
      _id: ASSET_ID,
      _class: "com.raxim.myscoutee.profile.data.document.Asset",
      syncKey: `${ASSET_ID}:sync`,
      assetId: ASSET_ID,
      ownerUserId: CASEY_ID,
      type: "Transport",
      title: "QA ASSET-PRICING-001 Interactive Transport",
      subtitle: "Edit one Asset pricing configuration and observe every projection",
      category: "Sedan",
      city: "Austin",
      capacityTotal: 3,
      quantity: 3,
      details: "Controlled interactive Asset-pricing manual-QA fixture.",
      imageUrl: "/media/public?key=images/demo-events/event-004/v1/large.webp",
      sourceLink: "https://example.com/qa/asset-pricing-001",
      routes: ["Austin"],
      policiesEnabled: false,
      policies: [],
      pricing: pricingOff(),
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
      description: `${CHECKPOINT} interactive pricing scope`,
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000)),
      optional: false,
      capacityMin: 1,
      capacityMax: 6,
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

  function subEventDefinition(item) {
    const copy = { ...item };
    for (const key of [
      "stageStatus", "stageStatusReason", "membersAccepted", "membersPending",
      "carsAccepted", "carsPending", "carsCapacityMin", "carsCapacityMax",
      "accommodationAccepted", "accommodationPending", "accommodationCapacityMin", "accommodationCapacityMax",
      "suppliesAccepted", "suppliesPending", "suppliesCapacityMin", "suppliesCapacityMax"
    ]) delete copy[key];
    return copy;
  }

  function stageDefinitions(stages, eventStart) {
    let previousStart = new Date(eventStart).getTime();
    return [...stages].sort((a, b) => new Date(a.startAt) - new Date(b.startAt)).map(stage => {
      const start = new Date(stage.startAt).getTime();
      const definition = subEventDefinition(stage);
      definition.timing = "During";
      definition.offsetMinutes = (start - previousStart) / 60000;
      definition.durationMinutes = (new Date(stage.endAt).getTime() - start) / 60000;
      previousStart = start;
      return definition;
    });
  }

  function assertStageTiming(event) {
    const stages = event && event.subEvents || [];
    const definitions = event && event.subEventDefinitions || [];
    if (stages.length !== 3 || definitions.length !== 3
        || !Q.sameJson(sorted(stages.map(item => item.id)), sorted(definitions.map(item => item.id)))) {
      Q.fail("Pricing stage definitions and runtime stages do not match.");
    }
    let start = new Date(event.startAtIso).getTime();
    for (const definition of definitions) {
      if (definition.timing !== "During" || !Number.isInteger(definition.offsetMinutes)
          || definition.offsetMinutes < 0 || !Number.isInteger(definition.durationMinutes)
          || definition.durationMinutes <= 0) Q.fail("Invalid Pricing stage timing definition.");
      start += definition.offsetMinutes * 60000;
      const end = start + definition.durationMinutes * 60000;
      const stage = stages.find(item => item.id === definition.id);
      if (start !== new Date(stage.startAt).getTime() || end !== new Date(stage.endAt).getTime()
          || end > new Date(event.endAtIso).getTime()) {
        Q.fail(`Pricing stage '${definition.name}' definition disagrees with its Borrow window.`);
      }
    }
  }

  function eventDocument(nowIso, windows) {
    const variable = subEvent(
      VARIABLE_SUB_EVENT_ID,
      "QA Pricing Variable Stage",
      windows.variable.start,
      windows.variable.end
    );
    const noPolicy = subEvent(
      NO_POLICY_SUB_EVENT_ID,
      "QA Pricing No Policy Stage",
      windows.noPolicy.start,
      windows.noPolicy.end
    );
    const cutoff = subEvent(
      CUTOFF_SUB_EVENT_ID,
      "QA Pricing Cutoff Stage",
      windows.cutoff.start,
      windows.cutoff.end
    );
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
      title: "QA ASSET-PRICING-001 Event",
      subtitle: "Interactive Asset pricing and payment snapshot stages",
      timeframe: `${windows.cutoff.start.toISOString()} - ${windows.noPolicy.end.toISOString()}`,
      startAtIso: windows.cutoff.start.toISOString(),
      endAtIso: windows.noPolicy.end.toISOString(),
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
      capacityMax: 6,
      capacityTotal: 6,
      capacityTotalActual: 6,
      full: false,
      acceptedMembers: 2,
      pendingMembers: 0,
      acceptedMemberUserIds: [CASEY_ID, NOVA_ID],
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [],
      subEventsEnabled: true,
      subEventDefinitions: stageDefinitions([variable, noPolicy, cutoff], windows.cutoff.start),
      subEvents: [variable, noPolicy, cutoff],
      pricing: pricingOff(),
      policiesEnabled: false,
      policies: [],
      slotsEnabled: false,
      slotTemplates: [],
      upcomingSlots: [],
      topics: ["#ManualQA", "#AssetPricing"],
      location: "Austin · ASSET-PRICING-001 venue",
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
      actionAtIso: nowIso,
      metAtIso: nowIso,
      metWhere: "QA ASSET-PRICING-001 Event",
      createdDate: nowIso,
      createdUser: CASEY_ID,
      updatedDate: nowIso,
      updatedUser: CASEY_ID
    };
  }

  function cardDocument(id, userId, last4, providerPaymentMethodRef, nowIso) {
    return {
      _id: id,
      version: 0,
      userId,
      provider: "barion",
      providerPaymentMethodRef,
      brand: "Mastercard",
      last4,
      expiryMonth: 9,
      expiryYear: 2029,
      expiryKey: 202909,
      cardholderName: userId === NOVA_ID ? "NOVA SOCIAL" : "RILEY OUTSIDE",
      artworkKey: "graphite",
      status: "active",
      createdAtIso: nowIso,
      updatedAtIso: nowIso
    };
  }

  function staticSpecs() {
    return [
      { collection: "assets", selector: assetSelector },
      { collection: "events", selector: eventSelector },
      { collection: "activityMembers", selector: memberSelector },
      { collection: "assetRequests", selector: requestSelector },
      { collection: "activityResources", selector: resourceSelector },
      { collection: "eventCheckoutBasketItems", selector: basketSelector },
      { collection: "payments", selector: paymentSelector },
      { collection: "savedPaymentMethods", selector: cardSelector },
      { collection: "notificationOutbox", selector: notificationSelector },
      { collection: "userNotifications", selector: notificationSelector },
      { collection: "affinityRecomputeTasks", selector: { targetId: { $in: [EVENT_ID, ASSET_ID] } } },
      { collection: "scheduledMessageTasks", selector: { eventId: EVENT_ID } }
    ];
  }

  function snapshotSpecs() {
    const snapshots = Q.snapshotSpecs(staticSpecs());
    const paymentIds = Q.collection("payments").find(paymentSelector).toArray().map(item => item._id);
    snapshots.push({
      collection: "payment_gateway_operations",
      selector: { paymentId: { $in: paymentIds } },
      documents: paymentIds.length === 0
        ? []
        : Q.collection("payment_gateway_operations").find({ paymentId: { $in: paymentIds } }).toArray()
    });
    return snapshots;
  }

  function scopedArtifactCount() {
    return staticSpecs().reduce(
      (total, spec) => total + Q.collection(spec.collection).countDocuments(spec.selector),
      0
    );
  }

  function clearCurrentEffects() {
    const paymentIds = Q.collection("payments").find(paymentSelector).toArray().map(item => item._id);
    if (paymentIds.length > 0) {
      Q.collection("payment_gateway_operations").deleteMany({ paymentId: { $in: paymentIds } });
    }
    for (const spec of staticSpecs()) Q.collection(spec.collection).deleteMany(spec.selector);
  }

  function primaryPayments() {
    return Q.collection("payments").find(paymentSelector).sort({ createdDate: 1, _id: 1 }).toArray()
      .filter(item => ["", "payment"].includes(Q.text(item.auditKind)));
  }

  function rowView(rows) {
    return (rows || []).map(item => ({
      key: normalizedPricingRowKey(item && item.key),
      amount: Number(item && item.amount || 0),
      multiplier: item && item.multiplier == null ? null : Number(item.multiplier)
    }));
  }

  function normalizedPricingRowKey(value) {
    const key = Q.text(value);
    if (key.startsWith("quantity-rule:")) return "quantity-rule";
    if (key.startsWith("demand:")) return "demand";
    if (key.startsWith("time:")) return "time";
    return key;
  }

  function paymentView(item) {
    return {
      id: Q.text(item && item._id),
      userId: Q.text(item && item.userId),
      recipientUserId: Q.text(item && item.recipientUserId),
      sourceId: Q.text(item && item.sourceId),
      status: Q.text(item && item.status),
      provider: Q.text(item && item.provider),
      amount: Number(item && item.amount || 0),
      currency: Q.text(item && item.currency),
      bookingQuantity: Number(item && item.bookingQuantity || 0),
      bookingStartAtIso: Q.text(item && item.bookingStartAtIso),
      bookingEndAtIso: Q.text(item && item.bookingEndAtIso),
      contextEventId: Q.text(item && item.contextEventId),
      contextSubEventId: Q.text(item && item.contextSubEventId),
      bookingStatus: Q.text(item && item.bookingStatus),
      fulfillmentStatus: Q.text(item && item.fulfillmentStatus),
      refundStatus: Q.text(item && item.refundStatus),
      refundRequestStatus: Q.text(item && item.refundRequestStatus),
      cancellationPolicy: policyView(item && item.cancellationPolicy),
      rows: rowView(item && item.pricingSummaryRows)
    };
  }

  function oracle() {
    const asset = Q.collection("assets").findOne(assetSelector);
    const event = Q.collection("events").findOne(eventSelector);
    return {
      asset: asset && {
        assetId: Q.text(asset.assetId || asset._id),
        ownerUserId: Q.text(asset.ownerUserId),
        title: Q.text(asset.title),
        quantity: Number(asset.quantity || 0),
        capacityTotal: Number(asset.capacityTotal || 0),
        visibility: Q.text(asset.visibility),
        status: Q.text(asset.status),
        pricing: pricingView(asset.pricing),
        requestCount: Array.isArray(asset.requests) ? asset.requests.length : 0
      },
      event: event && {
        sourceId: Q.text(event.sourceId || event._id),
        title: Q.text(event.title),
        acceptedMemberUserIds: sorted(event.acceptedMemberUserIds),
        subEventIds: sorted((event.subEvents || []).map(item => item && item.id))
      },
      activityMembers: Q.collection("activityMembers").find(memberSelector).sort({ ownerId: 1, userId: 1 }).toArray()
        .map(item => ({
          ownerType: Q.text(item.ownerType),
          ownerId: Q.text(item.ownerId),
          userId: Q.text(item.userId),
          role: Q.text(item.role),
          status: Q.text(item.status)
        })),
      payments: primaryPayments().map(paymentView),
      paymentDocumentCount: Q.collection("payments").countDocuments(paymentSelector),
      basketCount: Q.collection("eventCheckoutBasketItems").countDocuments(basketSelector),
      requestProjectionCount: Q.collection("assetRequests").countDocuments(requestSelector),
      resourceCount: Q.collection("activityResources").countDocuments(resourceSelector)
    };
  }

  function assertSimulator() {
    if (!providerConnected || provider !== "barion" || requires3ds) {
      Q.fail("ASSET-PRICING-001 requires the connected Barion simulator with 3DS Off.");
    }
  }

  function assertNoPayments() {
    if (Q.collection("payments").countDocuments(paymentSelector) !== 0
        || Q.collection("eventCheckoutBasketItems").countDocuments(basketSelector) !== 0
        || Q.collection("assetRequests").countDocuments(requestSelector) !== 0
        || Q.collection("activityResources").countDocuments(resourceSelector) !== 0) {
      Q.fail("pricing-only phase unexpectedly contains a request, resource, basket or payment.");
    }
  }

  function currentAsset() {
    const asset = Q.collection("assets").findOne(assetSelector);
    if (!asset) Q.fail("interactive pricing Asset was not found.");
    return asset;
  }

  function assertPricing(expected, label) {
    const actual = pricingView(currentAsset().pricing);
    const wanted = expectedPricingView(expected);
    if (!Q.sameJson(actual, wanted)) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: `${label}-diagnostic`, expected: wanted, actual });
      Q.fail(`${label} pricing configuration is not exact.`);
    }
    return actual;
  }

  function assertBaseline(checkSimulator = true) {
    if (checkSimulator) assertSimulator();
    assertStageTiming(Q.collection("events").findOne(eventSelector));
    const current = oracle();
    if (!current.asset
        || current.asset.assetId !== ASSET_ID
        || current.asset.ownerUserId !== CASEY_ID
        || current.asset.title !== "QA ASSET-PRICING-001 Interactive Transport"
        || current.asset.quantity !== 3
        || current.asset.capacityTotal !== 3
        || current.asset.visibility !== "Public"
        || current.asset.status !== "A"
        || !Q.sameJson(current.asset.pricing, expectedPricingView(pricingOff()))
        || !current.event
        || current.event.sourceId !== EVENT_ID
        || !Q.sameJson(current.event.acceptedMemberUserIds, [CASEY_ID, NOVA_ID])
        || !Q.sameJson(current.event.subEventIds, sorted([
          VARIABLE_SUB_EVENT_ID, NO_POLICY_SUB_EVENT_ID, CUTOFF_SUB_EVENT_ID
        ]))
        || current.activityMembers.length !== 2
        || current.activityMembers.some(item => item.ownerId !== EVENT_ID || item.status !== "accepted")
        || current.paymentDocumentCount !== 0
        || current.basketCount !== 0
        || current.requestProjectionCount !== 0
        || current.resourceCount !== 0) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "baseline-diagnostic", oracle: current });
      Q.fail("interactive Asset-pricing baseline is not exact.");
    }
    const cards = Q.collection("savedPaymentMethods").find(cardSelector).toArray();
    if (cards.length !== 2
        || !cards.some(item => Q.text(item.userId) === NOVA_ID && Q.text(item.last4) === "4444" && Q.text(item.status) === "active")
        || !cards.some(item => Q.text(item.userId) === RILEY_ID && Q.text(item.last4) === "5555" && Q.text(item.status) === "active")) {
      Q.fail("Nova/Riley active Barion card controls are not exact.");
    }
    return current;
  }

  function updatePhase(nextPhase, extra = {}) {
    const currentState = state();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      { $set: { phase: nextPhase, phaseUpdatedAtIso: Q.nowIso(), ...extra } }
    );
  }

  function phaseIs(...allowed) {
    const current = state();
    const phase = Q.text(current.phase);
    if (!allowed.includes(phase)) {
      Q.fail(`command requires phase ${allowed.join(" or ")}; current phase is '${phase}'.`);
    }
    return current;
  }

  function sameInstant(left, right, toleranceMs = 60000) {
    const leftMs = Date.parse(Q.text(left));
    const rightMs = Date.parse(Q.text(right));
    return Number.isFinite(leftMs) && Number.isFinite(rightMs) && Math.abs(leftMs - rightMs) <= toleranceMs;
  }

  function assertPayment(item, expected) {
    const view = paymentView(item);
    if (!item
        || view.userId !== expected.userId
        || view.recipientUserId !== CASEY_ID
        || view.sourceId !== ASSET_ID
        || view.status !== "captured"
        || view.provider !== "barion"
        || view.amount !== expected.amount
        || view.currency !== "HUF"
        || view.bookingQuantity !== expected.quantity
        || !sameInstant(view.bookingStartAtIso, expected.startAtIso)
        || !sameInstant(view.bookingEndAtIso, expected.endAtIso)
        || (view.contextEventId && view.contextEventId !== EVENT_ID)
        || (view.contextSubEventId && view.contextSubEventId !== expected.subEventId)
        || !["", "joined"].includes(view.bookingStatus)
        || !["", "succeeded"].includes(view.fulfillmentStatus)
        || !["", "none"].includes(view.refundStatus)
        || !["", "none"].includes(view.refundRequestStatus)
        || !Q.sameJson(view.cancellationPolicy, policyView(expected.policy))
        || !Q.sameJson(view.rows, expected.rows)) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "payment-diagnostic", expected, actual: view });
      Q.fail(`${expected.label} payment snapshot is not exact.`);
    }
    return view;
  }

  function expectedRows(kind) {
    if (kind === "active") {
      return [
        { key: "base", amount: 999, multiplier: 1 },
        { key: "quantity-rule", amount: -49, multiplier: 1 },
        { key: "demand", amount: 95, multiplier: 1 },
        { key: "time", amount: 104.5, multiplier: 1 },
        { key: "rounding", amount: 0.5, multiplier: 1 },
        { key: "duration", amount: 1150, multiplier: 2 }
      ];
    }
    return [{ key: "base", amount: kind === "no-policy" ? 800 : 900, multiplier: 1 }];
  }

  function paymentBy(userId, amount) {
    const matches = primaryPayments().filter(item =>
      Q.text(item.userId) === userId && Number(item.amount || 0) === amount
    );
    if (matches.length !== 1) {
      Q.fail(`expected exactly one ${userId}/${amount} primary payment, found ${matches.length}.`);
    }
    return matches[0];
  }

  function unchangedPayment(snapshot, current) {
    return snapshot && current && samePersisted(snapshot, current);
  }

  function synchronizeOwnerAssetCounters() {
    const active = Q.collection("assets").find({ ownerUserId: CASEY_ID, status: { $nin: ["T", "D", "I", "B", "UR"] } }).toArray();
    const transportCount = active.filter(item => Q.text(item.type) === "Transport").length;
    const pendingCount = active
      .filter(item => Q.text(item.type) === "Transport")
      .flatMap(item => Array.isArray(item.requests) ? item.requests : [])
      .filter(item => Q.text(item && item.status).toLowerCase() === "pending"
        && Q.text(item && item.requestKind).toLowerCase() !== "manual")
      .length;
    const result = Q.collection("users").updateOne(userSelector(CASEY_ID), { $set: {
      "activities.cars": transportCount,
      "activities.asset.cars": transportCount,
      "activities.asset.carsPending": pendingCount
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
    if (Q.text(casey.name) !== "Casey Bridge"
        || Q.text(nova.name) !== "Nova Social"
        || Q.text(riley.name) !== "Riley Outside") {
      Q.fail("configured Casey/Nova/Riley identities do not match the demo users.");
    }
    if (scopedArtifactCount() !== 0) {
      Q.fail(`${CHECKPOINT} fixture records exist without an active snapshot; refusing to overwrite them.`);
    }
    const now = new Date();
    const nowIso = now.toISOString();
    const windows = {
      cutoff: {
        start: new Date(now.getTime() + 12 * 60 * 60 * 1000),
        end: new Date(now.getTime() + 14 * 60 * 60 * 1000)
      },
      variable: {
        start: new Date(now.getTime() + 72 * 60 * 60 * 1000),
        end: new Date(now.getTime() + 98 * 60 * 60 * 1000)
      },
      noPolicy: {
        start: new Date(now.getTime() + 120 * 60 * 60 * 1000),
        end: new Date(now.getTime() + 122 * 60 * 60 * 1000)
      }
    };
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
        assetId: ASSET_ID,
        variableSubEventId: VARIABLE_SUB_EVENT_ID,
        variableStartAtIso: windows.variable.start.toISOString(),
        variableEndAtIso: windows.variable.end.toISOString(),
        noPolicySubEventId: NO_POLICY_SUB_EVENT_ID,
        noPolicyStartAtIso: windows.noPolicy.start.toISOString(),
        noPolicyEndAtIso: windows.noPolicy.end.toISOString(),
        cutoffSubEventId: CUTOFF_SUB_EVENT_ID,
        cutoffStartAtIso: windows.cutoff.start.toISOString(),
        cutoffEndAtIso: windows.cutoff.end.toISOString()
      }
    });
    try {
      Q.collection("events").insertOne(eventDocument(nowIso, windows));
      Q.collection("activityMembers").insertMany([
        eventMember(CASEY_ID, "Admin", nowIso),
        eventMember(NOVA_ID, "Member", nowIso)
      ]);
      Q.collection("assets").insertOne(assetDocument(nowIso));
      Q.collection("savedPaymentMethods").insertMany([
        cardDocument(CARD_IDS.nova, NOVA_ID, "4444", "pm_sim_checkout_nova_barion_4444", nowIso),
        cardDocument(CARD_IDS.riley, RILEY_ID, "5555", "pm_sim_checkout_riley_barion_5555", nowIso)
      ]);
      synchronizeOwnerAssetCounters();
      applyEventCounterDelta(CASEY_ID, true);
      applyEventCounterDelta(NOVA_ID, false);
      Q.collection(Q.STATE_COLLECTION).updateOne(
        { _id: Q.stateId(SCENARIO) },
        { $set: { phase: "baseline-ready", baselineOracle: oracle() } }
      );
    } catch (error) {
      Q.fail(`stage failed after snapshot: ${Q.text(error && error.message)}. Run reset asset-pricing ${CHECKPOINT}.`);
    }
    const current = assertBaseline(false);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "baseline-ready",
      identities: state().context,
      baseline: current,
      next: "The wrapper now configures Barion with 3DS Off and proves it through a second status."
    });
  }

  function status() {
    config();
    const currentState = state(false);
    if (!currentState) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId: CHECKPOINT,
        phase: "not-staged",
        simulator: { provider, connected: providerConnected, requires3ds }
      });
      return;
    }
    assertStageTiming(Q.collection("events").findOne(eventSelector));
    if (Q.text(currentState.phase) === "baseline-ready") assertBaseline();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: Q.text(currentState.phase),
      simulator: { provider, connected: providerConnected, requires3ds },
      identities: currentState.context,
      oracle: oracle()
    });
  }

  function verifyFixed() {
    config();
    phaseIs("baseline-ready");
    assertNoPayments();
    const pricing = assertPricing(fixedPricing(1000), "fixed");
    updatePhase("fixed-verified");
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "fixed-verified", pricing, next: "Continue with the Hybrid pricing edit." });
  }

  function verifyVariable() {
    config();
    phaseIs("fixed-verified");
    assertNoPayments();
    const pricing = assertPricing(hybridPricing(), "variable");
    updatePhase("variable-verified");
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "variable-verified", pricing, expectedOneItemTotal: ACTIVE_PAYMENT_AMOUNT, next: "Check Nova's one-item price and Riley's missing internal stage menu." });
  }

  function verifyAudience() {
    config();
    phaseIs("variable-verified");
    assertNoPayments();
    const pricing = assertPricing(hybridPricing(), "same-public-asset-price");
    updatePhase("audience-observed");
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "audience-observed",
      pricing,
      scope: "Asset has no VIP or audience form. The user checks Nova's price and that non-member Riley has no internal stage menu; this read only verifies the saved pricing configuration.",
      next: "Enable the one-day/50% policy and capture Nova's HUF 2,300 payment."
    });
  }

  function verifyActivePayment() {
    config();
    const currentState = phaseIs("audience-observed");
    assertPricing(hybridPricing(emptyAudience(), activePolicy()), "active-policy");
    const payments = primaryPayments();
    if (payments.length !== 1 || Q.collection("payments").countDocuments(paymentSelector) !== 1) {
      Q.fail(`active-policy phase requires exactly one primary/payment document, found ${payments.length}.`);
    }
    const payment = paymentBy(NOVA_ID, ACTIVE_PAYMENT_AMOUNT);
    const view = assertPayment(payment, {
      label: "active-policy",
      userId: NOVA_ID,
      amount: ACTIVE_PAYMENT_AMOUNT,
      quantity: 1,
      startAtIso: currentState.context.variableStartAtIso,
      endAtIso: currentState.context.variableEndAtIso,
      subEventId: VARIABLE_SUB_EVENT_ID,
      policy: activePolicy(),
      rows: expectedRows("active")
    });
    updatePhase("active-payment-verified", {
      activePaymentId: payment._id,
      activePaymentSnapshot: payment
    });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "active-payment-verified", payment: view, next: "Set fixed HUF 800 with no policy, then Nova pays for the No policy stage." });
  }

  function verifyNoPolicyPayment() {
    config();
    const currentState = phaseIs("active-payment-verified");
    assertPricing(fixedPricing(NO_POLICY_PAYMENT_AMOUNT), "no-policy");
    const payments = primaryPayments();
    if (payments.length !== 2 || Q.collection("payments").countDocuments(paymentSelector) !== 2) {
      Q.fail(`no-policy phase requires exactly two primary/payment documents, found ${payments.length}.`);
    }
    const active = paymentBy(NOVA_ID, ACTIVE_PAYMENT_AMOUNT);
    if (!unchangedPayment(currentState.activePaymentSnapshot, active)) {
      Q.fail("the active-policy payment changed after the live Asset pricing edit.");
    }
    const payment = paymentBy(NOVA_ID, NO_POLICY_PAYMENT_AMOUNT);
    const view = assertPayment(payment, {
      label: "no-policy",
      userId: NOVA_ID,
      amount: NO_POLICY_PAYMENT_AMOUNT,
      quantity: 1,
      startAtIso: currentState.context.noPolicyStartAtIso,
      endAtIso: currentState.context.noPolicyEndAtIso,
      subEventId: NO_POLICY_SUB_EVENT_ID,
      policy: noPolicy(),
      rows: expectedRows("no-policy")
    });
    updatePhase("no-policy-payment-verified", {
      noPolicyPaymentId: payment._id,
      noPolicyPaymentSnapshot: payment
    });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "no-policy-payment-verified", payment: view, next: "Set fixed HUF 900 with the one-day/50% policy, then Nova pays for the Cutoff stage." });
  }

  function verifyCutoffPayment() {
    config();
    const currentState = phaseIs("no-policy-payment-verified");
    assertPricing(fixedPricing(CUTOFF_PAYMENT_AMOUNT, activePolicy()), "cutoff");
    const payments = primaryPayments();
    if (payments.length !== 3 || Q.collection("payments").countDocuments(paymentSelector) !== 3) {
      Q.fail(`cutoff phase requires exactly three primary/payment documents, found ${payments.length}.`);
    }
    const active = paymentBy(NOVA_ID, ACTIVE_PAYMENT_AMOUNT);
    const noPolicyPayment = paymentBy(NOVA_ID, NO_POLICY_PAYMENT_AMOUNT);
    if (!unchangedPayment(currentState.activePaymentSnapshot, active)
        || !unchangedPayment(currentState.noPolicyPaymentSnapshot, noPolicyPayment)) {
      Q.fail("an earlier payment changed after the final live Asset pricing edit.");
    }
    const payment = paymentBy(NOVA_ID, CUTOFF_PAYMENT_AMOUNT);
    const view = assertPayment(payment, {
      label: "cutoff",
      userId: NOVA_ID,
      amount: CUTOFF_PAYMENT_AMOUNT,
      quantity: 1,
      startAtIso: currentState.context.cutoffStartAtIso,
      endAtIso: currentState.context.cutoffEndAtIso,
      subEventId: CUTOFF_SUB_EVENT_ID,
      policy: activePolicy(),
      rows: expectedRows("cutoff")
    });
    const cutoffMs = Date.parse(view.bookingStartAtIso) - Date.now();
    if (!Number.isFinite(cutoffMs) || cutoffMs >= 24 * 60 * 60 * 1000) {
      Q.fail("cutoff payment is not inside the staged one-day refund cutoff.");
    }
    updatePhase("cutoff-payment-verified", {
      cutoffPaymentId: payment._id,
      cutoffPaymentSnapshot: payment
    });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "cutoff-payment-verified", payment: view, next: "Inspect and reopen all three Payment summaries, then run the final oracle." });
  }

  function verify() {
    config();
    const currentState = phaseIs("cutoff-payment-verified");
    assertPricing(fixedPricing(CUTOFF_PAYMENT_AMOUNT, activePolicy()), "terminal");
    const payments = primaryPayments();
    if (payments.length !== 3 || Q.collection("payments").countDocuments(paymentSelector) !== 3) {
      Q.fail("terminal pricing oracle requires exactly three primary captured payments and no revisions.");
    }
    const active = paymentBy(NOVA_ID, ACTIVE_PAYMENT_AMOUNT);
    const noPolicyPayment = paymentBy(NOVA_ID, NO_POLICY_PAYMENT_AMOUNT);
    const cutoff = paymentBy(NOVA_ID, CUTOFF_PAYMENT_AMOUNT);
    if (!unchangedPayment(currentState.activePaymentSnapshot, active)
        || !unchangedPayment(currentState.noPolicyPaymentSnapshot, noPolicyPayment)
        || !unchangedPayment(currentState.cutoffPaymentSnapshot, cutoff)) {
      Q.fail("opening Payment history changed a captured payment snapshot.");
    }
    for (const payment of payments) {
      if (!["", "none"].includes(Q.text(payment.refundStatus))
          || !["", "none"].includes(Q.text(payment.refundRequestStatus))
          || Number(payment.refundedAmount || 0) !== 0) {
        Q.fail("ASSET-PRICING-001 must not submit or complete a refund.");
      }
    }
    updatePhase("verified", { verifiedAtIso: Q.nowIso() });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "verified",
      result: "PASS",
      payments: payments.map(paymentView),
      livePricing: pricingView(currentAsset().pricing)
    });
  }

  function reset() {
    config();
    const currentState = state();
    clearCurrentEffects();
    Q.restoreSnapshots(currentState.snapshots || []);
    for (const saved of currentState.userFields || []) restoreUserFields(saved);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: currentState._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "reset",
      restored: true,
      remainingScopedArtifacts: scopedArtifactCount()
    });
  }

  function repairStageTiming() {
    config();
    const currentState = state();
    const event = Q.collection("events").findOne(eventSelector);
    const context = currentState.context;
    const expectedWindows = [
      [CUTOFF_SUB_EVENT_ID, context.cutoffStartAtIso, context.cutoffEndAtIso],
      [VARIABLE_SUB_EVENT_ID, context.variableStartAtIso, context.variableEndAtIso],
      [NO_POLICY_SUB_EVENT_ID, context.noPolicyStartAtIso, context.noPolicyEndAtIso]
    ];
    if (!event || event.ownerUserId !== CASEY_ID || event.startAtIso !== context.cutoffStartAtIso
        || event.endAtIso !== context.noPolicyEndAtIso || event.subEvents?.length !== 3
        || event.subEventDefinitions?.length !== 3
        || expectedWindows.some(([id, start, end]) => !event.subEvents.some(stage =>
          stage.id === id && stage.startAt === start && stage.endAt === end))) {
      Q.fail("Stage timing repair requires the original checkpoint-owned runtime windows.");
    }
    const ordered = stageDefinitions(event.subEvents, event.startAtIso);
    const definitions = ordered.map(stage => {
      const original = event.subEventDefinitions.find(item => item.id === stage.id);
      if (!original || original.timing !== "During" || original.durationMinutes !== stage.durationMinutes
          || ![0, stage.offsetMinutes].includes(original.offsetMinutes)) {
        Q.fail("Stage timing repair found an unexpected definition; no writes performed.");
      }
      return { ...original, offsetMinutes: stage.offsetMinutes };
    });
    const corrected = { ...event, subEventDefinitions: definitions };
    assertStageTiming(corrected);
    const protectedSpecs = staticSpecs().filter(spec =>
      ["assets", "activityMembers", "assetRequests", "activityResources", "eventCheckoutBasketItems", "payments", "savedPaymentMethods"].includes(spec.collection));
    const before = Q.snapshotSpecs(protectedSpecs);
    const result = Q.collection("events").updateOne(
      { _id: event._id, subEventDefinitions: event.subEventDefinitions, subEvents: event.subEvents },
      { $set: { subEventDefinitions: definitions } }
    );
    if (result.matchedCount !== 1) Q.fail("Event changed during stage timing repair.");
    const after = Q.collection("events").findOne({ _id: event._id });
    assertStageTiming(after);
    if (!samePersisted(after, corrected) || !samePersisted(before, Q.snapshotSpecs(protectedSpecs))) {
      Q.fail("State changed during stage timing repair; inspect before continuing.");
    }
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "stage-timing-repaired",
      stageTimingVerified: true, pricingAndTransactionsUnchanged: true,
      stages: after.subEvents.map(item => ({ id: item.id, startAt: item.startAt, endAt: item.endAt })),
      next: "User reloads once to replace the old stage dates, then reopens Variable-stage Explore and Borrow." });
  }

  Q.assertDeploymentSafety();
  if (command === "stage") stage();
  else if (command === "status") status();
  else if (command === "verify-fixed") verifyFixed();
  else if (command === "verify-variable") verifyVariable();
  else if (command === "verify-audience") verifyAudience();
  else if (command === "verify-active-payment") verifyActivePayment();
  else if (command === "verify-no-policy-payment") verifyNoPolicyPayment();
  else if (command === "verify-cutoff-payment") verifyCutoffPayment();
  else if (command === "verify") verify();
  else if (command === "reset") reset();
  else if (command === "repair-stage-timing") repairStageTiming();
  else Q.fail(`unsupported asset-pricing command '${command}'.`);
})();
