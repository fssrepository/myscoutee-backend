/* global ManualQa, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "event-checkout";
  const CHECKPOINT = "EVENT-CHECKOUT-001";
  const PREFIX = "manual-qa-checkpoint:v1:event-checkout";
  const CASEY_ID = "650000000000000000000061";
  const NOVA_ID = "650000000000000000000062";
  const RILEY_ID = "650000000000000000000063";
  const TARGET_ID = `${PREFIX}:paid`;
  const MORNING_SLOT_ID = `${TARGET_ID}:slot:morning`;
  const EVENING_SLOT_ID = `${TARGET_ID}:slot:evening`;
  const MORNING_TEMPLATE_ID = "qa-morning-slot";
  const EVENING_TEMPLATE_ID = "qa-evening-slot";
  const OPTIONAL_ID = "qa-workshop-addon";
  const POLICY_ID = "qa-attendance-policy";
  const FREE_ID = `${PREFIX}:free`;
  const APPROVAL_ID = `${PREFIX}:approval`;
  const WAITLIST_ID = `${PREFIX}:waitlist`;
  const CASH_ID = `${PREFIX}:cash-only`;
  const ADJACENT_ID = `${PREFIX}:adjacent-paid`;
  const EVENT_IDS = [TARGET_ID, FREE_ID, APPROVAL_ID, WAITLIST_ID, CASH_ID, ADJACENT_ID];
  const ALL_EVENT_IDS = [...EVENT_IDS, MORNING_SLOT_ID, EVENING_SLOT_ID];
  const CARD_IDS = {
    stripe: `${PREFIX}:card:stripe-4242`,
    rileyStripe: `${PREFIX}:card:riley-stripe-4242`,
    barion: `${PREFIX}:card:barion-4444`,
    expired: `${PREFIX}:card:expired-0008`
  };
  const BASKET_RULE = "event-checkout-basket-purge";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const provider = Q.text(process.env.MANUAL_QA_PAYMENT_PROVIDER).toLowerCase();
  const providerConnected = Q.text(process.env.MANUAL_QA_PAYMENT_PROVIDER_CONNECTED) === "true";
  const requires3ds = Q.text(process.env.MANUAL_QA_PAYMENT_REQUIRES_3DS) === "true";

  const userSelector = userId => ({ $or: [{ _id: userId }, { userId }] });
  const eventSelector = { $or: [
    { _id: { $in: ALL_EVENT_IDS } },
    { sourceId: { $in: ALL_EVENT_IDS } },
    { parentEventId: TARGET_ID }
  ] };
  const memberSelector = { ownerType: "event", ownerId: { $in: ALL_EVENT_IDS } };
  const basketSelector = { sourceId: { $in: EVENT_IDS } };
  const paymentSelector = { sourceId: { $in: EVENT_IDS } };
  const cardSelector = { _id: { $in: Object.values(CARD_IDS) } };
  const chatSelector = { $or: [
    { eventId: { $in: ALL_EVENT_IDS } },
    { ownerId: { $in: ALL_EVENT_IDS } },
    { sourceId: { $in: ALL_EVENT_IDS } }
  ] };
  const notificationSelector = { $or: [
    { entityId: { $in: ALL_EVENT_IDS } },
    { sourceId: { $in: ALL_EVENT_IDS } },
    { "payload.eventId": { $in: ALL_EVENT_IDS } },
    { "payload.sourceId": { $in: ALL_EVENT_IDS } },
    { "payload.parentEventId": TARGET_ID }
  ] };

  function config() {
    if (checkpointId !== CHECKPOINT) {
      Q.fail(`event-checkout harness supports only ${CHECKPOINT}.`);
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

  function samePersistedSnapshot(left, right) {
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

  function paymentTotals(document) {
    return {
      spent: { ...(document.paymentSpentTotals || {}) },
      income: { ...(document.paymentIncomeTotals || {}) },
      all: { ...(document.paymentAllTotals || {}) }
    };
  }

  function amountFor(totals, bucket, currency) {
    return Number(totals && totals[bucket] && totals[bucket][currency] || 0);
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
        soldOutLabel: "Sold out"
      },
      enabled
    };
  }

  function eventDocument(id, title, start, end, options = {}) {
    const accepted = sorted(options.acceptedUserIds || [CASEY_ID]);
    const pending = sorted(options.pendingUserIds || []);
    const isSlot = Boolean(options.parentEventId);
    return {
      _id: id,
      syncKey: `${id}:sync`,
      sourceId: id,
      ownerUserId: CASEY_ID,
      organizerUserId: CASEY_ID,
      status: "A",
      isTrashed: false,
      admins: [CASEY_ID],
      avatar: "CB",
      title,
      subtitle: "Stable EVENT-CHECKOUT-001 manual-QA fixture",
      timeframe: displayTimeframe(start, end),
      inviter: null,
      unread: 0,
      activity: 0,
      expired: false,
      feedbackCountersProjected: false,
      feedbackOwnEventCountersProjected: false,
      feedbackOwnEventCounterUserIds: [],
      trashedAtIso: null,
      creatorUserId: CASEY_ID,
      creatorName: "Casey Bridge",
      creatorInitials: "CB",
      creatorGender: "",
      creatorCity: "Austin",
      visibility: "Public",
      blindMode: "Visible Event",
      startAtIso: start.toISOString(),
      endAtIso: end.toISOString(),
      distanceKm: 0,
      imageUrl: "/media/public?key=images/demo-events/event-004/v1/large.webp",
      sourceLink: "",
      location: "Austin · EVENT-CHECKOUT-001 venue",
      locationCoordinates: { latitude: 30.2672, longitude: -97.7431 },
      locationGeo: { type: "Point", coordinates: [-97.7431, 30.2672] },
      capacityMin: 1,
      capacityMax: Number(options.capacity || 6),
      capacityTotal: Number(options.capacity || 6),
      capacityTotalActual: Number(options.capacity || 6),
      full: options.full === true,
      autoInviter: false,
      frequency: "Once",
      ticketing: false,
      approvalRequired: options.approvalRequired === true,
      pricing: pricing(options.paid !== false, Number(options.amount || 3200)),
      policiesEnabled: options.policiesEnabled === true,
      policies: options.policies || [],
      slotsEnabled: options.slotsEnabled === true,
      slotTemplates: options.slotTemplates || [],
      parentEventId: options.parentEventId || null,
      parentSubEventId: null,
      groupId: null,
      slotTemplateId: options.slotTemplateId || null,
      generated: isSlot,
      eventType: isSlot ? "slot" : "main",
      nextSlot: null,
      upcomingSlots: options.upcomingSlots || [],
      acceptedMembers: accepted.length,
      pendingMembers: pending.length,
      acceptedMemberUserIds: accepted,
      pendingMemberUserIds: pending,
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: pending,
      pendingReason: options.pendingReason || null,
      topics: ["#ManualQA", "#Payment"],
      subEventsEnabled: options.subEventsEnabled === true,
      subEventDefinitions: options.subEventDefinitions || [],
      subEvents: [],
      mode: "Casual",
      rating: 0,
      boost: 0,
      affinity: 0,
      paymentSessionId: null,
      createdDate: options.nowIso,
      createdUser: Q.ACTOR,
      updatedDate: options.nowIso,
      updatedUser: Q.ACTOR
    };
  }

  function memberDocument(ownerId, userId, role, status, nowIso, requestKind = null) {
    const id = `${PREFIX}:member:${ownerId.split(":").pop()}:${userId}`;
    return {
      _id: id,
      syncKey: `${id}:sync`,
      ownerType: "event",
      ownerId,
      userId,
      role,
      status,
      pendingSource: status === "pending" ? "member" : null,
      requestKind,
      invitedByUserId: null,
      actionAtIso: nowIso,
      metAtIso: status === "accepted" ? nowIso : null,
      metWhere: status === "accepted" ? "EVENT-CHECKOUT-001" : null,
      createdDate: nowIso,
      createdUser: Q.ACTOR,
      updatedDate: nowIso,
      updatedUser: Q.ACTOR
    };
  }

  function basketDocument(id, sourceId, label, status, now, expires, amount) {
    return {
      _id: id,
      itemId: `event:${sourceId}:main`,
      userId: NOVA_ID,
      sourceId,
      kind: "event",
      slotSourceId: "",
      slotTemplateId: "",
      selectedDateKey: "",
      subEventId: "",
      resourceType: "",
      label,
      detail: "Stable pending control",
      amount,
      currency: "HUF",
      quantity: 1,
      status,
      resultState: "pending",
      reservationActive: true,
      pendingCounterTracked: true,
      pricingSummaryRows: [{
        key: "base",
        label: "pricing.base.price",
        detail: null,
        amount,
        currency: "HUF",
        multiplier: 1
      }],
      appliedPromoCodes: [],
      checkoutSessionId: "",
      createdAtIso: now.toISOString(),
      updatedAtIso: now.toISOString(),
      expiresAtIso: expires.toISOString()
    };
  }

  function cardDocument(id, userId, cardholderName, providerName, token, last4, expiryMonth, expiryYear, artworkKey, status, nowIso) {
    return {
      _id: id,
      version: 0,
      userId,
      provider: providerName,
      providerPaymentMethodRef: token,
      brand: providerName === "barion" ? "Mastercard" : "Visa",
      last4,
      expiryMonth,
      expiryYear,
      expiryKey: expiryYear * 100 + expiryMonth,
      cardholderName,
      artworkKey,
      status,
      createdAtIso: nowIso,
      updatedAtIso: nowIso
    };
  }

  function ensureTwoUserBlock4Fixture() {
    const nowIso = Q.nowIso();
    const slots = Q.collection("events").find({
      _id: { $in: [MORNING_SLOT_ID, EVENING_SLOT_ID] },
      sourceId: { $in: [MORNING_SLOT_ID, EVENING_SLOT_ID] },
      status: "A"
    }).toArray();
    if (slots.length !== 2) {
      Q.fail("the two-user block-4 fixture requires exactly two active stable Slot records.");
    }
    Q.collection("events").updateMany(
      { _id: { $in: [MORNING_SLOT_ID, EVENING_SLOT_ID] }, status: "A" },
      { $set: { capacityMax: 2, capacityTotal: 2, capacityTotalActual: 2, full: false, updatedDate: nowIso } }
    );
    const target = Q.collection("events").findOne({ _id: TARGET_ID, status: "A" });
    if (!target || !Array.isArray(target.upcomingSlots) || target.upcomingSlots.length !== 2) {
      Q.fail("the two-user block-4 fixture requires the stable root with exactly two upcoming Slots.");
    }
    const upcomingSlots = target.upcomingSlots.map(slot => ({ ...slot, capacityTotal: 2 }));
    Q.collection("events").updateOne(
      { _id: TARGET_ID, status: "A" },
      { $set: { upcomingSlots, updatedDate: nowIso } }
    );
    Q.collection("savedPaymentMethods").replaceOne(
      { _id: CARD_IDS.rileyStripe },
      cardDocument(
        CARD_IDS.rileyStripe,
        RILEY_ID,
        "RILEY OUTSIDE",
        "stripe",
        "pm_sim_checkout_riley_stripe_4242",
        "4242",
        12,
        2029,
        "midnight",
        "active",
        nowIso),
      { upsert: true }
    );
  }

  function staticSpecs() {
    return [
      { collection: "events", selector: eventSelector },
      { collection: "activityMembers", selector: memberSelector },
      { collection: "eventCheckoutBasketItems", selector: basketSelector },
      { collection: "payments", selector: paymentSelector },
      { collection: "savedPaymentMethods", selector: cardSelector },
      { collection: "chats", selector: chatSelector },
      { collection: "eventTickets", selector: { eventId: { $in: ALL_EVENT_IDS } } },
      { collection: "eventTicketAudit", selector: { eventId: { $in: ALL_EVENT_IDS } } },
      { collection: "notificationOutbox", selector: notificationSelector },
      { collection: "userNotifications", selector: notificationSelector },
      { collection: "eventWatchSubscriptions", selector: { eventId: { $in: EVENT_IDS } } },
      { collection: "scheduledMessageTasks", selector: { eventId: { $in: ALL_EVENT_IDS } } },
      { collection: "affinityRecomputeTasks", selector: { targetId: { $in: ALL_EVENT_IDS } } },
      { collection: "activityEventRuntimeItems", selector: { $or: [
        { eventId: { $in: ALL_EVENT_IDS } },
        { ownerId: { $in: ALL_EVENT_IDS } }
      ] } }
    ];
  }

  function dynamicArtifacts() {
    const payments = Q.collection("payments").find(paymentSelector).toArray();
    const paymentIds = sorted(payments.map(item => item._id));
    const chats = Q.collection("chats").find(chatSelector).toArray();
    const chatIds = sorted(chats.flatMap(item => [item._id, item.id, item.chatId]));
    return { paymentIds, chatIds };
  }

  function scopedArtifactCount() {
    return staticSpecs().reduce(
      (sum, spec) => sum + Q.collection(spec.collection).countDocuments(spec.selector),
      0
    );
  }

  function clearCurrentEffects() {
    const dynamic = dynamicArtifacts();
    if (dynamic.paymentIds.length > 0) {
      Q.collection("payment_gateway_operations").deleteMany({ paymentId: { $in: dynamic.paymentIds } });
    }
    if (dynamic.chatIds.length > 0) {
      Q.collection("chatMessages").deleteMany({ chatId: { $in: dynamic.chatIds } });
      Q.collection("notificationOutbox").deleteMany({ "payload.chatId": { $in: dynamic.chatIds } });
      Q.collection("userNotifications").deleteMany({ "payload.chatId": { $in: dynamic.chatIds } });
    }
    for (const spec of staticSpecs()) Q.collection(spec.collection).deleteMany(spec.selector);
  }

  function eventFingerprint(id) {
    const event = Q.collection("events").findOne({ sourceId: id });
    const members = Q.collection("activityMembers").find({ ownerType: "event", ownerId: id }).sort({ userId: 1 }).toArray();
    const baskets = Q.collection("eventCheckoutBasketItems").find({ sourceId: id }).sort({ _id: 1 }).toArray();
    return { event, members, baskets };
  }

  function controlFingerprint() {
    return Object.fromEntries(
      [FREE_ID, APPROVAL_ID, WAITLIST_ID, ADJACENT_ID].map(id => [id, eventFingerprint(id)])
    );
  }

  function assertControlsUnchanged(currentState) {
    const current = controlFingerprint();
    if (!Q.sameJson(EJSON.serialize(current), EJSON.serialize(currentState.controlFingerprint))) {
      Q.fail("Free/Approval/Waitlist/Adjacent control records changed.");
    }
  }

  function assertControlContracts() {
    const event = id => Q.collection("events").findOne({ sourceId: id, status: "A" });
    const novaMembers = id => Q.collection("activityMembers")
      .find({ ownerType: "event", ownerId: id, userId: NOVA_ID })
      .toArray();
    const baskets = id => Q.collection("eventCheckoutBasketItems")
      .find({ sourceId: id, userId: NOVA_ID })
      .toArray();
    const payments = id => Q.collection("payments")
      .find({ sourceId: id, userId: NOVA_ID })
      .toArray();

    const free = event(FREE_ID);
    if (!free
        || !free.pricing
        || free.pricing.enabled !== false
        || free.slotsEnabled === true
        || novaMembers(FREE_ID).length !== 0
        || baskets(FREE_ID).length !== 0
        || payments(FREE_ID).length !== 0) {
      Q.fail("Free control is not the untouched no-payment/no-membership fixture.");
    }

    const approval = event(APPROVAL_ID);
    const approvalMembers = novaMembers(APPROVAL_ID);
    const approvalBaskets = baskets(APPROVAL_ID);
    if (!approval
        || approval.approvalRequired !== true
        || !Q.sameJson(sorted(approval.pendingMemberUserIds), [NOVA_ID])
        || approvalMembers.length !== 1
        || Q.text(approvalMembers[0].status) !== "pending"
        || Q.text(approvalMembers[0].requestKind) !== "join"
        || approvalBaskets.length !== 1
        || String(approvalBaskets[0]._id) !== `${PREFIX}:basket:approval`
        || Q.text(approvalBaskets[0].status) !== "approval-pending"
        || approvalBaskets[0].reservationActive !== true
        || payments(APPROVAL_ID).length !== 0) {
      Q.fail("Approval control is not the exact pending-approval fixture.");
    }

    const waitlist = event(WAITLIST_ID);
    const waitlistMembers = novaMembers(WAITLIST_ID);
    if (!waitlist
        || waitlist.full !== true
        || !Q.sameJson(sorted(waitlist.pendingMemberUserIds), [NOVA_ID])
        || waitlistMembers.length !== 1
        || Q.text(waitlistMembers[0].status) !== "pending"
        || Q.text(waitlistMembers[0].requestKind) !== "waitlist"
        || baskets(WAITLIST_ID).length !== 0
        || payments(WAITLIST_ID).length !== 0) {
      Q.fail("Waitlist control is not pending membership without a checkout basket.");
    }

    const cash = event(CASH_ID);
    if (!cash
        || cash.slotsEnabled === true
        || (cash.upcomingSlots || []).length !== 0
        || novaMembers(CASH_ID).length !== 0
        || baskets(CASH_ID).length !== 0
        || payments(CASH_ID).length !== 0) {
      Q.fail("Cash-only control is not the clean plain non-slot checkout fixture.");
    }

    const adjacent = event(ADJACENT_ID);
    if (!adjacent
        || novaMembers(ADJACENT_ID).length !== 0
        || baskets(ADJACENT_ID).length !== 0
        || payments(ADJACENT_ID).length !== 0) {
      Q.fail("Adjacent paid control changed during EVENT-CHECKOUT-001.");
    }
  }

  function assertRileyUnchanged(currentState) {
    const current = Q.ensureUser(RILEY_ID, "Riley control");
    if (!Q.sameJson(current, currentState.rileyFingerprint)) {
      Q.fail("Riley's immutable control record changed.");
    }
  }

  function setEventCounters() {
    const casey = Q.ensureUser(CASEY_ID, "Casey");
    const nova = Q.ensureUser(NOVA_ID, "Nova");
    Q.collection("users").updateOne(userSelector(CASEY_ID), { $set: {
      "activities.hosting": 6,
      "activities.events": 0,
      "activities.invitations": 0,
      "activities.event.all": 6,
      "activities.event.active": 0,
      "activities.event.pending": 0,
      "activities.event.invitations": 0,
      "activities.event.hosting": 6,
      "activities.event.drafts": 0,
      "activities.event.trash": 0,
      paymentSpentTotals: { ...(casey.paymentSpentTotals || {}) },
      paymentIncomeTotals: { ...(casey.paymentIncomeTotals || {}) },
      paymentAllTotals: { ...(casey.paymentAllTotals || {}) }
    } });
    Q.collection("users").updateOne(userSelector(NOVA_ID), { $set: {
      "activities.hosting": 0,
      "activities.events": 0,
      "activities.invitations": 0,
      "activities.event.all": 2,
      "activities.event.active": 0,
      "activities.event.pending": 2,
      "activities.event.invitations": 0,
      "activities.event.hosting": 0,
      "activities.event.drafts": 0,
      "activities.event.trash": 0,
      paymentSpentTotals: { ...(nova.paymentSpentTotals || {}) },
      paymentIncomeTotals: { ...(nova.paymentIncomeTotals || {}) },
      paymentAllTotals: { ...(nova.paymentAllTotals || {}) }
    } });
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
    Q.assertRuleNotRunning(BASKET_RULE);
    if (scopedArtifactCount() !== 0) {
      Q.fail("EVENT-CHECKOUT-001 fixture records exist without an active snapshot; refusing to overwrite them.");
    }

    const rule = Q.requireRule(BASKET_RULE);
    const now = new Date();
    const nowIso = now.toISOString();
    const morningStart = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const morningEnd = new Date(morningStart.getTime() + 2 * 60 * 60 * 1000);
    const eveningStart = new Date(now.getTime() + 54 * 60 * 60 * 1000);
    const eveningEnd = new Date(eveningStart.getTime() + 2 * 60 * 60 * 1000);
    const controlStart = new Date(now.getTime() + 72 * 60 * 60 * 1000);
    const controlEnd = new Date(controlStart.getTime() + 2 * 60 * 60 * 1000);
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dynamicBefore = dynamicArtifacts();
    const snapshots = Q.snapshotSpecs(staticSpecs());
    snapshots.push({
      collection: "payment_gateway_operations",
      selector: { paymentId: { $in: dynamicBefore.paymentIds } },
      documents: dynamicBefore.paymentIds.length === 0 ? [] : Q.collection("payment_gateway_operations")
        .find({ paymentId: { $in: dynamicBefore.paymentIds } }).toArray()
    });
    snapshots.push({
      collection: "chatMessages",
      selector: { chatId: { $in: dynamicBefore.chatIds } },
      documents: dynamicBefore.chatIds.length === 0 ? [] : Q.collection("chatMessages")
        .find({ chatId: { $in: dynamicBefore.chatIds } }).toArray()
    });
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "staging",
      stagedAtIso: nowIso,
      snapshots,
      userFields: [casey, nova, riley].map(userFields),
      baselineTotals: {
        casey: paymentTotals(casey),
        nova: paymentTotals(nova),
        riley: paymentTotals(riley)
      },
      rileyFingerprint: riley,
      basketRuleConfig: Q.ruleConfigSnapshot(rule)
    });

    const attendancePolicy = {
      id: POLICY_ID,
      title: "QA Attendance policy",
      description: "Accept the attendance policy to continue.",
      required: true
    };
    const workshop = {
      id: OPTIONAL_ID,
      name: "QA Workshop Add-on",
      description: "Optional paid EVENT-CHECKOUT-001 workshop.",
      timing: "During",
      offsetMinutes: 30,
      durationMinutes: 60,
      location: "Austin · workshop area",
      optional: true,
      pricing: pricing(true, 1700),
      capacityMin: 0,
      capacityMax: 6,
      icon: "workspaces"
    };
    const morningOccurrence = {
      id: MORNING_SLOT_ID,
      parentEventId: TARGET_ID,
      slotTemplateId: MORNING_TEMPLATE_ID,
      title: "QA Morning Slot",
      timeframe: displayTimeframe(morningStart, morningEnd),
      startAtIso: morningStart.toISOString(),
      endAtIso: morningEnd.toISOString(),
      capacityTotal: 2,
      acceptedMembers: 1,
      pendingMembers: 0
    };
    const eveningOccurrence = {
      id: EVENING_SLOT_ID,
      parentEventId: TARGET_ID,
      slotTemplateId: EVENING_TEMPLATE_ID,
      title: "QA Evening Slot",
      timeframe: displayTimeframe(eveningStart, eveningEnd),
      startAtIso: eveningStart.toISOString(),
      endAtIso: eveningEnd.toISOString(),
      capacityTotal: 2,
      acceptedMembers: 1,
      pendingMembers: 0
    };
    const target = eventDocument(
      TARGET_ID,
      "QA EVENT-CHECKOUT-001 Paid",
      morningStart,
      eveningEnd,
      {
        nowIso,
        slotsEnabled: true,
        slotTemplates: [
          { id: MORNING_TEMPLATE_ID, startAt: morningStart.toISOString(), overrideDate: null, closed: false, subEventDefinitions: [] },
          { id: EVENING_TEMPLATE_ID, startAt: eveningStart.toISOString(), overrideDate: null, closed: false, subEventDefinitions: [] }
        ],
        upcomingSlots: [morningOccurrence, eveningOccurrence],
        policiesEnabled: true,
        policies: [attendancePolicy],
        subEventsEnabled: true,
        subEventDefinitions: [workshop]
      }
    );
    const morningSlot = eventDocument(MORNING_SLOT_ID, "QA Morning Slot", morningStart, morningEnd, {
      nowIso,
      parentEventId: TARGET_ID,
      slotTemplateId: MORNING_TEMPLATE_ID,
      capacity: 2,
      subEventDefinitions: []
    });
    const eveningSlot = eventDocument(EVENING_SLOT_ID, "QA Evening Slot", eveningStart, eveningEnd, {
      nowIso,
      parentEventId: TARGET_ID,
      slotTemplateId: EVENING_TEMPLATE_ID,
      capacity: 2,
      subEventDefinitions: []
    });
    const events = [
      target,
      morningSlot,
      eveningSlot,
      eventDocument(FREE_ID, "QA EVENT-CHECKOUT-001 Free", controlStart, controlEnd, { nowIso, paid: false }),
      eventDocument(APPROVAL_ID, "QA EVENT-CHECKOUT-001 Approval", controlStart, controlEnd, {
        nowIso,
        approvalRequired: true,
        pendingUserIds: [NOVA_ID],
        pendingReason: "approval"
      }),
      eventDocument(WAITLIST_ID, "QA EVENT-CHECKOUT-001 Waitlist", controlStart, controlEnd, {
        nowIso,
        capacity: 1,
        full: true,
        pendingUserIds: [NOVA_ID],
        pendingReason: "waitlist"
      }),
      eventDocument(CASH_ID, "QA EVENT-CHECKOUT-001 Cash only", controlStart, controlEnd, { nowIso }),
      eventDocument(ADJACENT_ID, "QA EVENT-CHECKOUT-001 Adjacent paid", controlStart, controlEnd, { nowIso })
    ];
    Q.collection("events").insertMany(events);
    const members = ALL_EVENT_IDS.map(id => memberDocument(id, CASEY_ID, "Admin", "accepted", nowIso));
    members.push(memberDocument(APPROVAL_ID, NOVA_ID, "Member", "pending", nowIso, "join"));
    members.push(memberDocument(WAITLIST_ID, NOVA_ID, "Member", "pending", nowIso, "waitlist"));
    Q.collection("activityMembers").insertMany(members);
    Q.collection("eventCheckoutBasketItems").insertOne(
      basketDocument(`${PREFIX}:basket:approval`, APPROVAL_ID, "QA EVENT-CHECKOUT-001 Approval", "approval-pending", now, expires, 3200)
    );
    Q.collection("savedPaymentMethods").insertMany([
      cardDocument(CARD_IDS.stripe, NOVA_ID, "NOVA SOCIAL", "stripe", "pm_sim_checkout_nova_stripe_4242", "4242", 12, 2029, "midnight", "active", nowIso),
      cardDocument(CARD_IDS.rileyStripe, RILEY_ID, "RILEY OUTSIDE", "stripe", "pm_sim_checkout_riley_stripe_4242", "4242", 12, 2029, "midnight", "active", nowIso),
      cardDocument(CARD_IDS.barion, NOVA_ID, "NOVA SOCIAL", "barion", "pm_sim_checkout_nova_barion_4444", "4444", 9, 2029, "graphite", "active", nowIso),
      {
        ...cardDocument(CARD_IDS.expired, NOVA_ID, "NOVA SOCIAL", "stripe", "pm_sim_checkout_nova_expired_0008", "0008", 8, 2026, "coral", "expired", nowIso),
        expiredNotifiedAtIso: nowIso
      }
    ]);
    setEventCounters();
    Q.holdRule(BASKET_RULE, 1, `${CHECKPOINT}: one stable approval basket`, 3600);
    const currentState = state();
    const controls = controlFingerprint();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: currentState._id }, { $set: {
      phase: "baseline-ready",
      controlFingerprint: controls,
      targetBaselineFingerprint: eventFingerprint(TARGET_ID)
    } });
    status();
  }

  function baselineSummary() {
    const target = Q.collection("events").findOne({ _id: TARGET_ID, status: "A" });
    const slots = Q.collection("events")
      .find({ _id: { $in: [MORNING_SLOT_ID, EVENING_SLOT_ID] }, status: "A" })
      .sort({ startAtIso: 1 })
      .toArray();
    const cards = Q.collection("savedPaymentMethods").find(cardSelector).sort({ _id: 1 }).toArray();
    return {
      target: target ? {
        id: Q.text(target.sourceId),
        title: Q.text(target.title),
        status: Q.text(target.status),
        ticketing: target.ticketing === true,
        approvalRequired: target.approvalRequired === true,
        capacity: `${Number(target.acceptedMembers || 0)} / ${Number(target.capacityTotal || 0)}`,
        accepted: sorted(target.acceptedMemberUserIds),
        pending: sorted(target.pendingMemberUserIds),
        slots: slots.map(item => Q.text(item.title)),
        policies: (target.policies || []).map(item => ({ id: Q.text(item.id), title: Q.text(item.title), required: item.required === true })),
        optionals: (target.subEventDefinitions || []).map(item => ({ id: Q.text(item.id), name: Q.text(item.name), amount: Number(item.pricing && item.pricing.basePrice || 0) }))
      } : null,
      novaArtifacts: {
        targetMemberships: Q.collection("activityMembers").countDocuments({ ownerId: TARGET_ID, userId: NOVA_ID }),
        targetBaskets: Q.collection("eventCheckoutBasketItems").countDocuments({ sourceId: TARGET_ID, userId: NOVA_ID }),
        targetPayments: Q.collection("payments").countDocuments({ sourceId: TARGET_ID, userId: NOVA_ID }),
        targetTickets: Q.collection("eventTickets").countDocuments({ eventId: TARGET_ID, userId: NOVA_ID })
      },
      rileyArtifacts: {
        targetMemberships: Q.collection("activityMembers").countDocuments({ ownerId: TARGET_ID, userId: RILEY_ID }),
        targetBaskets: Q.collection("eventCheckoutBasketItems").countDocuments({ sourceId: TARGET_ID, userId: RILEY_ID }),
        targetPayments: Q.collection("payments").countDocuments({ sourceId: TARGET_ID, userId: RILEY_ID }),
        targetTickets: Q.collection("eventTickets").countDocuments({ eventId: TARGET_ID, userId: RILEY_ID })
      },
      cards: cards.map(item => ({ id: Q.text(item._id), userId: Q.text(item.userId), provider: Q.text(item.provider), last4: Q.text(item.last4), artworkKey: Q.text(item.artworkKey), status: Q.text(item.status) })),
      controls: {
        free: Boolean(Q.collection("events").findOne({ sourceId: FREE_ID, "pricing.enabled": false })),
        approval: Boolean(Q.collection("events").findOne({ sourceId: APPROVAL_ID, approvalRequired: true, pendingMemberUserIds: NOVA_ID })),
        waitlist: Boolean(Q.collection("events").findOne({ sourceId: WAITLIST_ID, full: true, pendingMemberUserIds: NOVA_ID })),
        cashOnly: Boolean(Q.collection("events").findOne({ sourceId: CASH_ID })),
        adjacentPaid: Boolean(Q.collection("events").findOne({ sourceId: ADJACENT_ID }))
      }
    };
  }

  function assertBaseline() {
    const summary = baselineSummary();
    const target = summary.target;
    if (!target
        || target.title !== "QA EVENT-CHECKOUT-001 Paid"
        || target.status !== "A"
        || target.ticketing
        || target.approvalRequired
        || target.capacity !== "1 / 6"
        || !Q.sameJson(target.accepted, [CASEY_ID])
        || target.pending.length !== 0
        || !Q.sameJson(target.slots, ["QA Morning Slot", "QA Evening Slot"])
        || target.policies.length !== 1
        || target.policies[0].id !== POLICY_ID
        || !target.policies[0].required
        || target.optionals.length !== 1
        || target.optionals[0].id !== OPTIONAL_ID
        || target.optionals[0].amount !== 1700) {
      Q.fail(`target baseline mismatch: ${JSON.stringify(target)}.`);
    }
    if (Object.values(summary.novaArtifacts).some(value => value !== 0)) {
      Q.fail(`Nova already has target artifacts: ${JSON.stringify(summary.novaArtifacts)}.`);
    }
    if (Object.values(summary.rileyArtifacts).some(value => value !== 0)) {
      Q.fail(`Riley already has target artifacts: ${JSON.stringify(summary.rileyArtifacts)}.`);
    }
    if (summary.cards.length !== 4
        || !summary.cards.some(item => item.userId === NOVA_ID && item.provider === "stripe" && item.last4 === "4242" && item.status === "active")
        || !summary.cards.some(item => item.userId === RILEY_ID && item.provider === "stripe" && item.last4 === "4242" && item.status === "active")
        || !summary.cards.some(item => item.provider === "barion" && item.last4 === "4444" && item.status === "active" && item.artworkKey === "graphite")
        || !summary.cards.some(item => item.provider === "stripe" && item.last4 === "0008" && item.status === "expired" && item.artworkKey === "coral")) {
      Q.fail(`participant card baseline mismatch: ${JSON.stringify(summary.cards)}.`);
    }
    if (Object.values(summary.controls).some(value => value !== true)) {
      Q.fail(`control baseline mismatch: ${JSON.stringify(summary.controls)}.`);
    }
    return summary;
  }

  function status() {
    config();
    const currentState = Q.activeState(SCENARIO, false);
    if (!currentState) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId: CHECKPOINT,
        phase: "not-staged",
        simulator: { provider, connected: providerConnected, requires3ds }
      });
      return;
    }
    const summary = Q.text(currentState.phase) === "baseline-ready" ? assertBaseline() : baselineSummary();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: Q.text(currentState.phase),
      stagedAtIso: currentState.stagedAtIso,
      simulator: { provider, connected: providerConnected, requires3ds },
      baseline: summary,
      next: Q.text(currentState.phase) === "baseline-ready"
        ? "Nova starts checklist step 1 with staged Cash only; Ava switches to connected Stripe with 3DS Off only at step 17."
        : "Continue only at the savepoint declared by the stable checklist."
    });
  }

  function repairCardArtwork() {
    config();
    state();
    const result = Q.collection("savedPaymentMethods").updateOne(
      { _id: CARD_IDS.barion, userId: NOVA_ID, provider: "barion", last4: "4444" },
      { $set: { artworkKey: "graphite", updatedAtIso: Q.nowIso() } }
    );
    if (result.matchedCount !== 1) Q.fail("could not repair Nova's Barion 4444 fixture artwork.");
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, repaired: { cardId: CARD_IDS.barion, provider: "barion", last4: "4444", artworkKey: "graphite" } });
  }

  function withoutSeededWaitlistBasket(snapshots) {
    return (snapshots || []).map(snapshot => {
      if (snapshot.collection !== "eventCheckoutBasketItems") return snapshot;
      return {
        ...snapshot,
        documents: (snapshot.documents || []).filter(item =>
          String(item._id) !== `${PREFIX}:basket:waitlist`)
      };
    });
  }

  function repairControlFixtures() {
    config();
    const currentState = state();
    if (Q.text(currentState.phase) !== "paid-verified") {
      Q.fail("control fixture repair is restricted to the paid-verified boundary.");
    }
    const savedUsers = currentState.block5UserFields || [];
    if (!Q.sameJson(sorted(savedUsers.map(item => item.userId)), [CASEY_ID, NOVA_ID, RILEY_ID])) {
      Q.fail("the exact pre-control Casey/Nova/Riley snapshots are unavailable; refusing to repair counters by projection.");
    }

    const cashPaymentIds = Q.collection("payments")
      .find({ sourceId: CASH_ID, userId: NOVA_ID })
      .toArray()
      .map(item => item._id);
    if (cashPaymentIds.length > 0) {
      Q.collection("payment_gateway_operations").deleteMany({ paymentId: { $in: cashPaymentIds } });
    }
    const cashChats = Q.collection("chats").find({ $or: [
      { eventId: CASH_ID },
      { ownerId: CASH_ID },
      { sourceId: CASH_ID }
    ] }).toArray();
    const cashChatIds = cashChats.flatMap(item => [item._id, item.id, item.chatId]).filter(Boolean);
    if (cashChatIds.length > 0) {
      Q.collection("chatMessages").deleteMany({ chatId: { $in: cashChatIds } });
    }
    const cashNotificationSelector = { $or: [
      { entityId: CASH_ID },
      { sourceId: CASH_ID },
      { "payload.eventId": CASH_ID },
      { "payload.sourceId": CASH_ID }
    ] };
    Q.collection("notificationOutbox").deleteMany(cashNotificationSelector);
    Q.collection("userNotifications").deleteMany(cashNotificationSelector);
    Q.collection("chats").deleteMany({ $or: [
      { eventId: CASH_ID },
      { ownerId: CASH_ID },
      { sourceId: CASH_ID }
    ] });
    Q.collection("payments").deleteMany({ sourceId: CASH_ID, userId: NOVA_ID });
    Q.collection("eventCheckoutBasketItems").deleteMany({ sourceId: CASH_ID, userId: NOVA_ID });
    Q.collection("activityMembers").deleteMany({ ownerType: "event", ownerId: CASH_ID, userId: NOVA_ID });
    Q.collection("events").updateOne(
      { sourceId: CASH_ID },
      {
        $set: {
          pendingMembers: 0,
          pendingMemberUserIds: [],
          pendingRequestMemberUserIds: [],
          pendingReason: null,
          paymentSessionId: null,
          updatedDate: Q.nowIso(),
          updatedUser: Q.ACTOR
        }
      }
    );
    Q.collection("eventCheckoutBasketItems").deleteMany({
      _id: `${PREFIX}:basket:waitlist`,
      sourceId: WAITLIST_ID,
      userId: NOVA_ID
    });
    for (const saved of savedUsers) restoreUserFields(saved);
    Q.holdRule(BASKET_RULE, 1, `${CHECKPOINT}: one stable approval basket`, 3600);

    const stateSet = {
      controlFingerprint: controlFingerprint(),
      controlFixturesRepairedAtIso: Q.nowIso()
    };
    for (const key of ["paymentReadySnapshots", "block4Snapshots", "block5Snapshots"]) {
      if (Array.isArray(currentState[key])) {
        stateSet[key] = withoutSeededWaitlistBasket(currentState[key]);
      }
    }
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      { $set: stateSet }
    );

    assertControlContracts();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "paid-verified",
      repaired: {
        waitlist: "pending-membership-without-basket",
        cashOnly: "no-checkout-effects"
      }
    });
  }

  function repairDuplicateSlotOccurrences() {
    config();
    const currentState = state();
    if (!["paid-verified", "destination-verified"].includes(Q.text(currentState.phase))) {
      Q.fail("slot occurrence repair is restricted to the verified paid/destination boundary.");
    }
    const target = Q.collection("events").findOne({ _id: TARGET_ID, status: "A" });
    if (!target) {
      Q.fail("the canonical paid Event is unavailable.");
    }
    const expectedSnapshot = Q.text(currentState.phase) === "destination-verified"
      ? currentState.destinationFingerprint
      : currentState.paidFingerprint;
    const currentSnapshot = paidSnapshot();
    const withoutDerivedSlotFields = snapshot => ({
      ...snapshot,
      event: snapshot && snapshot.event
        ? { ...snapshot.event, upcomingSlots: [], updatedDate: null, updatedUser: null }
        : null
    });
    if (!samePersistedSnapshot(
      withoutDerivedSlotFields(currentSnapshot),
      withoutDerivedSlotFields(expectedSnapshot)
    )) {
      Q.fail("paid Event state changed beyond the duplicate derived Slot occurrence; refusing repair.");
    }
    const expectedIds = [MORNING_SLOT_ID, EVENING_SLOT_ID];
    const uniqueById = new Map();
    for (const slot of target.upcomingSlots || []) {
      const slotId = Q.text(slot && slot.id);
      if (expectedIds.includes(slotId) && !uniqueById.has(slotId)) {
        uniqueById.set(slotId, slot);
      }
    }
    const normalizedSlots = expectedIds.map(id => uniqueById.get(id)).filter(Boolean);
    if (normalizedSlots.length !== expectedIds.length) {
      Q.fail("the canonical paid Event does not contain both expected Slot occurrences.");
    }
    const changed = (target.upcomingSlots || []).length !== normalizedSlots.length;
    if (changed) {
      Q.collection("events").updateOne(
        { _id: TARGET_ID, status: "A" },
        { $set: { upcomingSlots: normalizedSlots, full: true, updatedDate: Q.nowIso(), updatedUser: Q.ACTOR } }
      );
    }

    const normalized = paidSnapshot();
    const stateSet = { paidFingerprint: normalized, slotOccurrencesRepairedAtIso: Q.nowIso() };
    const stateUnset = {};
    if (Q.text(currentState.phase) === "destination-verified") {
      stateSet.destinationFingerprint = normalized;
      stateSet.block6Snapshots = currentScopedSnapshots();
      stateSet.block6UserFields = [CASEY_ID, NOVA_ID, RILEY_ID]
        .map(userId => userFields(Q.ensureUser(userId)));
      stateSet.block6ChatMessageIds = documentIds(eventChatMessages());
      stateSet.block6JoinNotificationIds = documentIds(novaJoinNotifications());
      stateSet.block6JoinOutboxIds = documentIds(novaJoinOutboxItems());
      stateSet.block6CapturedAtIso = Q.nowIso();
      stateUnset.controlsVerifiedAtIso = "";
    }
    const update = { $set: stateSet };
    if (Object.keys(stateUnset).length > 0) update.$unset = stateUnset;
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: currentState._id }, update);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: Q.text(currentState.phase),
      changed,
      upcomingSlotIds: normalizedSlots.map(slot => Q.text(slot.id))
    });
  }

  function activeTargetBaskets(userId = NOVA_ID) {
    return Q.collection("eventCheckoutBasketItems").find({
      sourceId: TARGET_ID,
      userId,
      reservationActive: true,
      resultState: { $in: [null, "", "pending", "active"] }
    }).sort({ createdAtIso: 1, _id: 1 }).toArray();
  }

  function targetNovaMemberships() {
    return Q.collection("activityMembers")
      .find({ ownerType: "event", ownerId: TARGET_ID, userId: NOVA_ID })
      .sort({ _id: 1 })
      .toArray();
  }

  function capturePaymentReady() {
    const currentState = state();
    if (Q.text(currentState.phase) !== "baseline-ready") Q.fail("payment-ready can only be captured from baseline-ready.");
    if (provider !== "stripe" || !providerConnected || requires3ds) {
      Q.fail(`payment-ready simulator state is provider='${provider}', connected=${providerConnected}, requires3ds=${requires3ds}; expected connected Stripe with 3DS Off.`);
    }
    const baskets = activeTargetBaskets();
    const memberships = targetNovaMemberships();
    const kinds = sorted(baskets.map(item => item.kind));
    const total = baskets.reduce((sum, item) => sum + Number(item.amount || 0) * Math.max(1, Number(item.quantity || 1)), 0);
    if (baskets.length !== 2
        || !kinds.includes("event")
        || !baskets.some(item => Q.text(item.subEventId) === OPTIONAL_ID)
        || !baskets.every(item => Q.text(item.slotSourceId) === MORNING_SLOT_ID)
        || !baskets.every(item => Q.text(item.status) === "confirmed")
        || total !== 4900) {
      Q.fail(`payment-ready basket mismatch: ${JSON.stringify(baskets.map(item => ({ kind: item.kind, subEventId: item.subEventId, slotSourceId: item.slotSourceId, status: item.status, amount: item.amount })))}.`);
    }
    if (Q.collection("payments").countDocuments({ sourceId: TARGET_ID, userId: NOVA_ID }) !== 0
        || memberships.length !== 1
        || Q.text(memberships[0].status) !== "pending"
        || Q.text(memberships[0].pendingSource) !== "member"
        || Q.text(memberships[0].requestKind) !== "join") {
      Q.fail(`payment-ready pending membership mismatch: ${JSON.stringify(memberships)}.`);
    }
    const nova = Q.ensureUser(NOVA_ID, "Nova");
    const eventCounters = nova.activities && nova.activities.event || {};
    if (Number(eventCounters.all || 0) !== 3 || Number(eventCounters.pending || 0) !== 3) {
      Q.fail(`payment-ready Event counters mismatch: ${JSON.stringify(eventCounters)}.`);
    }
    assertControlsUnchanged(currentState);
    assertRileyUnchanged(currentState);
    const paymentReadyDynamic = dynamicArtifacts();
    const paymentReadySnapshots = Q.snapshotSpecs(staticSpecs());
    paymentReadySnapshots.push({
      collection: "payment_gateway_operations",
      selector: { paymentId: { $in: paymentReadyDynamic.paymentIds } },
      documents: paymentReadyDynamic.paymentIds.length === 0 ? [] : Q.collection("payment_gateway_operations")
        .find({ paymentId: { $in: paymentReadyDynamic.paymentIds } }).toArray()
    });
    paymentReadySnapshots.push({
      collection: "chatMessages",
      selector: { chatId: { $in: paymentReadyDynamic.chatIds } },
      documents: paymentReadyDynamic.chatIds.length === 0 ? [] : Q.collection("chatMessages")
        .find({ chatId: { $in: paymentReadyDynamic.chatIds } }).toArray()
    });
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: currentState._id }, { $set: {
      phase: "payment-ready",
      paymentReadyAtIso: Q.nowIso(),
      pendingEventVerifiedAtIso: Q.nowIso(),
      paymentReadyBasketIds: baskets.map(item => item._id),
      paymentReadyBaskets: baskets,
      paymentReadySnapshots,
      paymentReadyUserFields: [CASEY_ID, NOVA_ID, RILEY_ID].map(userId => userFields(Q.ensureUser(userId)))
    } });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "payment-ready", basketItems: 2, amount: 4900, currency: "HUF", eventAll: 3, eventPending: 3, paymentCount: 0, membership: "pending" });
  }

  function verifyPendingEvent() {
    const currentState = state();
    if (Q.text(currentState.phase) !== "payment-ready") Q.fail("pending Activity Event verification requires payment-ready.");
    const baskets = activeTargetBaskets();
    const memberships = targetNovaMemberships();
    const nova = Q.ensureUser(NOVA_ID, "Nova");
    const eventCounters = nova.activities && nova.activities.event || {};
    if (!Q.sameJson(EJSON.serialize(baskets), EJSON.serialize(currentState.paymentReadyBaskets))
        || Q.collection("payments").countDocuments({ sourceId: TARGET_ID, userId: NOVA_ID }) !== 0
        || memberships.length !== 1
        || Q.text(memberships[0].status) !== "pending"
        || Q.text(memberships[0].pendingSource) !== "member"
        || Q.text(memberships[0].requestKind) !== "join"
        || Number(eventCounters.all || 0) !== 3
        || Number(eventCounters.pending || 0) !== 3) {
      Q.fail(`the pending Event write-side boundary is invalid: counters=${JSON.stringify(eventCounters)}.`);
    }
    assertControlsUnchanged(currentState);
    assertRileyUnchanged(currentState);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      { $set: { pendingEventVerifiedAtIso: Q.nowIso() } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "payment-ready",
      checkpoint: "pending-activity-event",
      basketItems: baskets.length,
      eventAll: Number(eventCounters.all || 0),
      eventPending: Number(eventCounters.pending || 0),
      paymentCount: 0,
      membership: "pending"
    });
  }

  function rollbackPaymentReady() {
    config();
    const currentState = state();
    if (!Array.isArray(currentState.paymentReadySnapshots) || currentState.paymentReadySnapshots.length === 0) {
      Q.fail("payment-ready rollback checkpoint has not been captured.");
    }
    clearCurrentEffects();
    Q.restoreSnapshots(currentState.paymentReadySnapshots);
    for (const saved of currentState.paymentReadyUserFields || []) restoreUserFields(saved);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      {
        $set: { phase: "payment-ready", paymentReadyRolledBackAtIso: Q.nowIso(), pendingEventVerifiedAtIso: Q.nowIso() },
        $unset: {
          cancelledAtIso: "",
          paidAtIso: "",
          paidFingerprint: "",
          block6Snapshots: "",
          block6UserFields: "",
          block6ChatMessageIds: "",
          block6JoinNotificationIds: "",
          block6JoinOutboxIds: "",
          block6CapturedAtIso: "",
          block6RolledBackAtIso: "",
          destinationAtIso: "",
          destinationFingerprint: "",
          controlsVerifiedAtIso: "",
          leaveRejoinedAtIso: "",
          leaveRejoinedFingerprint: "",
          verifiedAtIso: ""
        }
      }
    );
    const restoredBaskets = activeTargetBaskets();
    const restoredMemberships = targetNovaMemberships();
    if (!Q.sameJson(restoredBaskets, currentState.paymentReadyBaskets)
        || Q.collection("payments").countDocuments({ sourceId: TARGET_ID, userId: NOVA_ID }) !== 0
        || restoredMemberships.length !== 1
        || Q.text(restoredMemberships[0].status) !== "pending") {
      Q.fail("payment-ready rollback did not restore the exact step-22 boundary.");
    }
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "payment-ready", rollback: "step-22", basketItems: restoredBaskets.length, paymentCount: 0, membership: "pending" });
  }

  function currentScopedSnapshots() {
    const dynamic = dynamicArtifacts();
    const snapshots = Q.snapshotSpecs(staticSpecs());
    snapshots.push({
      collection: "payment_gateway_operations",
      selector: { paymentId: { $in: dynamic.paymentIds } },
      documents: dynamic.paymentIds.length === 0 ? [] : Q.collection("payment_gateway_operations")
        .find({ paymentId: { $in: dynamic.paymentIds } }).toArray()
    });
    snapshots.push({
      collection: "chatMessages",
      selector: { chatId: { $in: dynamic.chatIds } },
      documents: dynamic.chatIds.length === 0 ? [] : Q.collection("chatMessages")
        .find({ chatId: { $in: dynamic.chatIds } }).toArray()
    });
    return snapshots;
  }

  function expectedCancelledBasketIds(currentState) {
    const ids = (currentState.paymentReadyBasketIds || []).map(String);
    if (ids.length !== 2 || new Set(ids).size !== 2) {
      Q.fail("the block-4 checkpoint does not identify exactly two original basket items.");
    }
    return new Set(ids);
  }

  function isTargetNovaBasket(item) {
    return Q.text(item && item.sourceId) === TARGET_ID
      && Q.text(item && item.userId) === NOVA_ID;
  }

  function isClosedCancelledBasket(item, expectedIds) {
    return expectedIds.has(String(item._id))
      && item.reservationActive !== true
      && item.pendingCounterTracked !== true
      && Q.text(item.status) === "cancelled"
      && Q.text(item.resultState) === "deleted";
  }

  function block4SnapshotsForOriginalAttempt(currentState, snapshots) {
    const expectedIds = expectedCancelledBasketIds(currentState);
    return snapshots.map(snapshot => {
      if (snapshot.collection !== "eventCheckoutBasketItems") return snapshot;
      return {
        ...snapshot,
        documents: (snapshot.documents || []).filter(item =>
          !isTargetNovaBasket(item) || expectedIds.has(String(item._id)))
      };
    });
  }

  function assertCancelledBasketAudit(currentState, baskets, message) {
    const expectedIds = expectedCancelledBasketIds(currentState);
    if (baskets.length !== 2
        || baskets.some(item => !isClosedCancelledBasket(item, expectedIds))) {
      Q.fail(message);
    }
  }

  function assertBlock4Boundary(currentState) {
    const memberships = Q.collection("activityMembers").find({
      ownerType: "event",
      ownerId: { $in: [TARGET_ID, MORNING_SLOT_ID] },
      userId: NOVA_ID
    }).toArray();
    const target = Q.collection("events").findOne({ _id: TARGET_ID });
    const nova = Q.ensureUser(NOVA_ID, "Nova");
    const eventCounters = nova.activities && nova.activities.event || {};
    const baskets = Q.collection("eventCheckoutBasketItems")
      .find({ sourceId: TARGET_ID, userId: NOVA_ID })
      .toArray();
    assertCancelledBasketAudit(
      currentState,
      baskets,
      "the block-4 rollback did not restore exactly the original two cancelled basket records."
    );
    if (activeTargetBaskets().length !== 0
        || Q.collection("payments").countDocuments({ sourceId: TARGET_ID, userId: NOVA_ID }) !== 0
        || Q.collection("chats").countDocuments(chatSelector) !== 0
        || memberships.length !== 2
        || memberships.some(item => Q.text(item.status) !== "suppressed"
          || Q.text(item.statusBeforeSuppression) !== "pending"
          || Q.text(item.suppressionRootOwnerId) !== TARGET_ID)
        || !target
        || Number(target.acceptedMembers || 0) !== 1
        || Number(target.pendingMembers || 0) !== 0
        || !Q.sameJson(sorted(target.acceptedMemberUserIds), [CASEY_ID])
        || sorted(target.pendingMemberUserIds).length !== 0
        || Number(eventCounters.all || 0) !== 2
        || Number(eventCounters.pending || 0) !== 2
        || Number(eventCounters.active || 0) !== 0) {
      Q.fail("the block-4 rollback did not restore the exact cancelled checkout boundary.");
    }
    assertControlsUnchanged(currentState);
    assertRileyUnchanged(currentState);
  }

  function rollbackBlock4() {
    config();
    const currentState = state();
    if (Q.text(currentState.phase) !== "cancelled-verified") {
      Q.fail("block-4 rollback requires the cancelled-verified testcase phase.");
    }
    if (!Array.isArray(currentState.block4Snapshots)
        || currentState.block4Snapshots.length === 0
        || !Array.isArray(currentState.block4UserFields)
        || currentState.block4UserFields.length === 0) {
      Q.fail("the verified block-4 rollback checkpoint has not been captured.");
    }
    const checkpoint = {
      snapshots: block4SnapshotsForOriginalAttempt(currentState, currentState.block4Snapshots),
      userFields: currentState.block4UserFields
    };
    const checkpointBaskets = checkpoint.snapshots
      .filter(snapshot => snapshot.collection === "eventCheckoutBasketItems")
      .flatMap(snapshot => snapshot.documents || [])
      .filter(isTargetNovaBasket);
    assertCancelledBasketAudit(
      currentState,
      checkpointBaskets,
      "the saved block-4 checkpoint does not contain exactly the original two cancelled basket records."
    );
    clearCurrentEffects();
    Q.restoreSnapshots(checkpoint.snapshots);
    for (const saved of checkpoint.userFields) restoreUserFields(saved);
    ensureTwoUserBlock4Fixture();
    const upgradedSnapshots = currentScopedSnapshots();
    const upgradedUserFields = [CASEY_ID, NOVA_ID, RILEY_ID].map(userId => userFields(Q.ensureUser(userId)));
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      {
        $set: {
          phase: "cancelled-verified",
          block4Snapshots: upgradedSnapshots,
          block4UserFields: upgradedUserFields,
          "baselineTotals.riley": paymentTotals(Q.ensureUser(RILEY_ID, "Riley")),
          block4CapturedAtIso: Q.text(currentState.block4CapturedAtIso) || Q.nowIso(),
          block4RolledBackAtIso: Q.nowIso()
        },
        $unset: {
          paidAtIso: "",
          paidFingerprint: "",
          block6Snapshots: "",
          block6UserFields: "",
          block6ChatMessageIds: "",
          block6JoinNotificationIds: "",
          block6JoinOutboxIds: "",
          block6CapturedAtIso: "",
          block6RolledBackAtIso: "",
          destinationAtIso: "",
          destinationFingerprint: "",
          controlsVerifiedAtIso: "",
          leaveRejoinedAtIso: "",
          leaveRejoinedFingerprint: "",
          verifiedAtIso: ""
        }
      }
    );
    assertBlock4Boundary(currentState);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "cancelled-verified",
      rollback: "block-4",
      activeBasketItems: 0,
      paymentCount: 0,
      membership: "suppressed",
      eventAll: 2,
      eventPending: 2
    });
  }

  function verifyCancelled() {
    const currentState = state();
    if (Q.text(currentState.phase) !== "payment-ready") Q.fail("cancelled can only be verified after payment-ready.");
    if (!Q.text(currentState.pendingEventVerifiedAtIso)) Q.fail("pending Activity Event checkpoint must be verified before cancellation.");
    const all = Q.collection("eventCheckoutBasketItems").find({ sourceId: TARGET_ID, userId: NOVA_ID }).toArray();
    const originals = new Set((currentState.paymentReadyBasketIds || []).map(String));
    const cancelled = all.filter(item => originals.has(String(item._id)));
    if (all.length !== 2 || activeTargetBaskets().length !== 0) {
      Q.fail("the first checkout attempt is not one closed cancelled basket audit.");
    }
    assertCancelledBasketAudit(
      currentState,
      cancelled,
      "the first checkout attempt is not one closed cancelled basket audit."
    );
    const cancelledMemberships = targetNovaMemberships();
    if (Q.collection("payments").countDocuments({ sourceId: TARGET_ID, userId: NOVA_ID }) !== 0
        || cancelledMemberships.length !== 1
        || Q.text(cancelledMemberships[0].status) !== "suppressed"
        || Q.text(cancelledMemberships[0].statusBeforeSuppression) !== "pending"
        || Q.text(cancelledMemberships[0].suppressionRootOwnerId) !== TARGET_ID
        || Q.collection("eventTickets").countDocuments({ eventId: TARGET_ID, userId: NOVA_ID }) !== 0) {
      Q.fail("cancelled checkout did not suppress the pending membership cleanly.");
    }
    const cancelledNova = Q.ensureUser(NOVA_ID, "Nova");
    const cancelledEventCounters = cancelledNova.activities && cancelledNova.activities.event || {};
    if (Number(cancelledEventCounters.all || 0) !== 2
        || Number(cancelledEventCounters.pending || 0) !== 2) {
      Q.fail(`cancelled checkout did not remove the Pending Event counters: ${JSON.stringify(cancelledEventCounters)}.`);
    }
    assertControlsUnchanged(currentState);
    assertRileyUnchanged(currentState);
    const block4Snapshots = currentScopedSnapshots();
    const block4UserFields = [CASEY_ID, NOVA_ID, RILEY_ID].map(userId => userFields(Q.ensureUser(userId)));
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: currentState._id }, { $set: {
      phase: "cancelled-verified",
      cancelledAtIso: Q.nowIso(),
      block4Snapshots,
      block4UserFields,
      block4CapturedAtIso: Q.nowIso()
    } });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "cancelled-verified", closedBasketItems: 2, paymentCount: 0, membership: "suppressed", tickets: 0 });
  }

  function paidSnapshot() {
    const event = Q.collection("events").findOne({ _id: TARGET_ID, status: "A" });
    const slots = Q.collection("events")
      .find({ _id: { $in: [MORNING_SLOT_ID, EVENING_SLOT_ID] }, status: "A" })
      .sort({ startAtIso: 1 })
      .toArray();
    const members = Q.collection("activityMembers").find({ ownerId: TARGET_ID }).sort({ userId: 1 }).toArray();
    const slotMembers = Q.collection("activityMembers")
      .find({ ownerId: { $in: [MORNING_SLOT_ID, EVENING_SLOT_ID] } })
      .sort({ ownerId: 1, userId: 1 })
      .toArray();
    const payments = Q.collection("payments")
      .find({ sourceId: TARGET_ID, userId: { $in: [NOVA_ID, RILEY_ID] } })
      .sort({ createdDate: 1 })
      .toArray();
    const baskets = Q.collection("eventCheckoutBasketItems")
      .find({ sourceId: TARGET_ID, userId: { $in: [NOVA_ID, RILEY_ID] } })
      .sort({ createdAtIso: 1, _id: 1 })
      .toArray();
    const chats = Q.collection("chats").find(chatSelector).toArray().filter(item => {
      const eventId = Q.text(item.eventId || item.ownerId || item.sourceId);
      return eventId === TARGET_ID;
    });
    return { event, slots, members, slotMembers, payments, baskets, chats };
  }

  function verifyPaid() {
    const currentState = state();
    if (Q.text(currentState.phase) !== "cancelled-verified") Q.fail("paid can only be verified after cancelled.");
    const current = paidSnapshot();
    const successfulPayments = current.payments.filter(item =>
      Q.text(item.provider) === "stripe"
      && Q.text(item.status) === "authorized"
      && Q.text(item.bookingStatus) === "joined"
      && Number(item.amount || 0) === 3200
      && Q.text(item.currency) === "HUF"
      && Q.sameJson(sorted(item.optionalSubEventIds), []));
    const novaPayment = successfulPayments.find(item =>
      Q.text(item.userId) === NOVA_ID
      && Q.text(item.slotSourceId) === EVENING_SLOT_ID
      && Q.text(item.paymentMethodId) === CARD_IDS.stripe);
    const rileyPayment = successfulPayments.find(item =>
      Q.text(item.userId) === RILEY_ID
      && Q.text(item.slotSourceId) === MORNING_SLOT_ID
      && Q.text(item.paymentMethodId) === CARD_IDS.rileyStripe);
    const upcomingSlotIds = (current.event && current.event.upcomingSlots || [])
      .map(item => Q.text(item && item.id));
    if (current.payments.length !== 2
        || successfulPayments.length !== 2
        || !novaPayment
        || !rileyPayment
        || !Q.sameJson(upcomingSlotIds, [MORNING_SLOT_ID, EVENING_SLOT_ID])) {
      Q.fail(`expected the exact Nova-Evening and Riley-Morning Stripe payments, found ${JSON.stringify(current.payments.map(item => ({ id: item._id, userId: item.userId, provider: item.provider, status: item.status, bookingStatus: item.bookingStatus, amount: item.amount, slotSourceId: item.slotSourceId, paymentMethodId: item.paymentMethodId })))}.`);
    }
    const succeeded = current.baskets.filter(item =>
      item.reservationActive === false
      && item.pendingCounterTracked === false
      && Q.text(item.resultState) === "succeeded"
      && Q.text(item.kind) === "event"
      && !Q.text(item.subEventId));
    if (succeeded.length !== 2
        || !succeeded.some(item => Q.text(item.userId) === NOVA_ID && Q.text(item.slotSourceId) === EVENING_SLOT_ID)
        || !succeeded.some(item => Q.text(item.userId) === RILEY_ID && Q.text(item.slotSourceId) === MORNING_SLOT_ID)
        || activeTargetBaskets(NOVA_ID).length !== 0
        || activeTargetBaskets(RILEY_ID).length !== 0) {
      Q.fail("paid checkout did not leave the exact two succeeded inactive basket items.");
    }
    const acceptedMembers = current.members.filter(item => Q.text(item.status) === "accepted");
    if (!current.event
        || Number(current.event.acceptedMembers || 0) !== 3
        || !Q.sameJson(sorted(current.event.acceptedMemberUserIds), [CASEY_ID, NOVA_ID, RILEY_ID])
        || acceptedMembers.length !== 3
        || !acceptedMembers.some(item => Q.text(item.userId) === CASEY_ID && Q.text(item.role) === "Admin")
        || !acceptedMembers.some(item => Q.text(item.userId) === NOVA_ID && Q.text(item.role) === "Member")
        || !acceptedMembers.some(item => Q.text(item.userId) === RILEY_ID && Q.text(item.role) === "Member")) {
      Q.fail("paid checkout membership/occupancy projection is not Casey Admin + Nova and Riley Members at 3 / 6.");
    }
    const acceptedSlotMembers = current.slotMembers.filter(item => Q.text(item.status) === "accepted");
    const morningSlot = current.slots.find(item => Q.text(item.sourceId) === MORNING_SLOT_ID);
    const eveningSlot = current.slots.find(item => Q.text(item.sourceId) === EVENING_SLOT_ID);
    if (current.slots.length !== 2
        || !morningSlot
        || Number(morningSlot.acceptedMembers || 0) !== 2
        || Number(morningSlot.capacityTotal || 0) !== 2
        || !Q.sameJson(sorted(morningSlot.acceptedMemberUserIds), [CASEY_ID, RILEY_ID])
        || !eveningSlot
        || Number(eveningSlot.acceptedMembers || 0) !== 2
        || Number(eveningSlot.capacityTotal || 0) !== 2
        || !Q.sameJson(sorted(eveningSlot.acceptedMemberUserIds), [CASEY_ID, NOVA_ID])
        || !acceptedSlotMembers.some(item => Q.text(item.ownerId) === MORNING_SLOT_ID && Q.text(item.userId) === RILEY_ID)
        || !acceptedSlotMembers.some(item => Q.text(item.ownerId) === EVENING_SLOT_ID && Q.text(item.userId) === NOVA_ID)) {
      Q.fail("the Morning and Evening Slot projections are not both full with their assigned participant.");
    }
    if (Q.collection("eventTickets").countDocuments({ eventId: TARGET_ID }) !== 0) {
      Q.fail("Ticketing Off checkout created an EventTicket.");
    }
    const novaUser = Q.ensureUser(NOVA_ID, "Nova");
    const rileyUser = Q.ensureUser(RILEY_ID, "Riley");
    const caseyUser = Q.ensureUser(CASEY_ID, "Casey");
    const novaActivities = novaUser.activities || {};
    const novaEventCounters = novaActivities.event || {};
    const novaChatCounters = novaActivities.chat || {};
    const caseyActivities = caseyUser.activities || {};
    const caseyEventCounters = caseyActivities.event || {};
    const caseyChatCounters = caseyActivities.chat || {};
    const rileyActivities = rileyUser.activities || {};
    const rileyEventCounters = rileyActivities.event || {};
    const rileyChatCounters = rileyActivities.chat || {};
    const block4UserFieldsById = new Map((currentState.block4UserFields || [])
      .map(item => [Q.text(item.userId), item]));
    const block4Activities = userId => {
      const saved = block4UserFieldsById.get(userId);
      return saved && saved.activities && saved.activities.present
        ? (saved.activities.value || {})
        : {};
    };
    const baselineRileyActivities = block4Activities(RILEY_ID);
    const baselineRileyEventCounters = baselineRileyActivities.event || {};
    const storedChatCounters = userId => {
      const ownedChats = Q.collection("chats").find({ ownerUserId: userId }).toArray();
      return ownedChats.reduce((totals, chat) => {
        const unread = Math.max(0, Number(chat.unread || 0));
        totals.all += unread;
        if (Q.text(chat.channelType) === "mainEvent") totals.event += unread;
        return totals;
      }, { all: 0, event: 0 });
    };
    const expectedNovaChatCounters = storedChatCounters(NOVA_ID);
    const expectedRileyChatCounters = storedChatCounters(RILEY_ID);
    const expectedCaseyChatCounters = storedChatCounters(CASEY_ID);
    if (Number(novaActivities.events || 0) !== 1
        || Number(novaEventCounters.all || 0) !== 3
        || Number(novaEventCounters.active || 0) !== 1
        || Number(novaEventCounters.pending || 0) !== 2
        || Number(rileyActivities.events || 0) !== Number(baselineRileyActivities.events || 0) + 1
        || Number(rileyEventCounters.all || 0) !== Number(baselineRileyEventCounters.all || 0) + 1
        || Number(rileyEventCounters.active || 0) !== Number(baselineRileyEventCounters.active || 0) + 1
        || Number(rileyEventCounters.pending || 0) !== Number(baselineRileyEventCounters.pending || 0)
        || Number(caseyActivities.hosting || 0) !== 6
        || Number(caseyEventCounters.all || 0) !== 6
        || Number(caseyEventCounters.hosting || 0) !== 6) {
      Q.fail("accepted Event activity counters are not the exact target delta over the pending controls.");
    }
    const targetChats = current.chats.filter(item =>
      Q.text(item.channelType) === "mainEvent"
      && [CASEY_ID, NOVA_ID, RILEY_ID].includes(Q.text(item.ownerUserId))
      && Q.sameJson(sorted(item.memberIds), [CASEY_ID, NOVA_ID, RILEY_ID]));
    if (targetChats.length !== 3
        || !Q.sameJson(sorted(targetChats.map(item => item.ownerUserId)), [CASEY_ID, NOVA_ID, RILEY_ID])
        || Number(novaActivities.chats || 0) !== expectedNovaChatCounters.all
        || Number(novaChatCounters.all || 0) !== expectedNovaChatCounters.all
        || Number(novaChatCounters.event || 0) !== expectedNovaChatCounters.event
        || Number(rileyActivities.chats || 0) !== expectedRileyChatCounters.all
        || Number(rileyChatCounters.all || 0) !== expectedRileyChatCounters.all
        || Number(rileyChatCounters.event || 0) !== expectedRileyChatCounters.event
        || Number(caseyActivities.chats || 0) !== expectedCaseyChatCounters.all
        || Number(caseyChatCounters.all || 0) !== expectedCaseyChatCounters.all
        || Number(caseyChatCounters.event || 0) !== expectedCaseyChatCounters.event) {
      Q.fail("accepted Event did not create exactly one shared main-Event chat projection for Casey, Nova and Riley.");
    }
    if (generatedSlotJoinNotifications().length !== 0
        || generatedSlotJoinOutboxItems().length !== 0) {
      Q.fail("multi-Slot checkout emitted a duplicate generated-Slot joined notification in addition to the main-Event notification.");
    }
    const novaTotals = paymentTotals(novaUser);
    const rileyTotals = paymentTotals(rileyUser);
    const caseyTotals = paymentTotals(caseyUser);
    const baselineNova = currentState.baselineTotals.nova;
    const baselineRiley = currentState.baselineTotals.riley;
    const baselineCasey = currentState.baselineTotals.casey;
    const accountedAmount = userId => successfulPayments
      .filter(item => Q.text(item.userId) === userId)
      .reduce((sum, item) => sum + Number(item.accountedSpentAmount || 0), 0);
    const novaAccounted = accountedAmount(NOVA_ID);
    const rileyAccounted = accountedAmount(RILEY_ID);
    const caseyAccounted = successfulPayments
      .filter(item => Q.text(item.recipientUserId) === CASEY_ID)
      .reduce((sum, item) => sum + Number(item.accountedSpentAmount || 0), 0);
    if (amountFor(novaTotals, "spent", "HUF") !== amountFor(baselineNova, "spent", "HUF") + novaAccounted
        || amountFor(novaTotals, "all", "HUF") !== amountFor(baselineNova, "all", "HUF") + novaAccounted
        || amountFor(rileyTotals, "spent", "HUF") !== amountFor(baselineRiley, "spent", "HUF") + rileyAccounted
        || amountFor(rileyTotals, "all", "HUF") !== amountFor(baselineRiley, "all", "HUF") + rileyAccounted
        || amountFor(caseyTotals, "income", "HUF") !== amountFor(baselineCasey, "income", "HUF") + caseyAccounted
        || amountFor(caseyTotals, "all", "HUF") !== amountFor(baselineCasey, "all", "HUF") + caseyAccounted) {
      Q.fail("payment total deltas do not match the payment records' accounted amounts.");
    }
    assertControlsUnchanged(currentState);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: currentState._id }, { $set: {
      phase: "paid-verified",
      paidAtIso: Q.nowIso(),
      paidFingerprint: current
    } });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "paid-verified", payments: 2, provider: "stripe", status: "authorized", membership: "3 / 6", slotsFull: 2, tickets: 0 });
  }

  function eventChatMessages() {
    return Q.collection("chatMessages")
      .find({ chatId: TARGET_ID })
      .sort({ _id: 1 })
      .toArray();
  }

  function novaJoinNotifications() {
    return Q.collection("userNotifications")
      .find({
        sourceId: TARGET_ID,
        kind: "event-member-joined",
        "payload.memberUserId": NOVA_ID
      })
      .sort({ _id: 1 })
      .toArray();
  }

  function novaJoinOutboxItems() {
    return Q.collection("notificationOutbox")
      .find({
        "payload.eventId": TARGET_ID,
        "payload.type": "event-member-joined",
        "payload.memberUserId": NOVA_ID
      })
      .sort({ _id: 1 })
      .toArray();
  }

  function generatedSlotJoinNotifications() {
    return Q.collection("userNotifications")
      .find({
        sourceId: { $in: [MORNING_SLOT_ID, EVENING_SLOT_ID] },
        kind: "event-member-joined"
      })
      .toArray();
  }

  function generatedSlotJoinOutboxItems() {
    return Q.collection("notificationOutbox")
      .find({
        "payload.eventId": { $in: [MORNING_SLOT_ID, EVENING_SLOT_ID] },
        "payload.type": "event-member-joined"
      })
      .toArray();
  }

  function documentIds(items) {
    return (items || []).map(item => String(item._id)).sort();
  }

  function targetNotifications() {
    return Q.collection("userNotifications")
      .find({ sourceId: TARGET_ID })
      .sort({ _id: 1 })
      .toArray();
  }

  function targetNotificationOutbox() {
    return Q.collection("notificationOutbox")
      .find({ $or: [{ entityId: TARGET_ID }, { "payload.eventId": TARGET_ID }] })
      .sort({ _id: 1 })
      .toArray();
  }

  function acceptedUserIds(items) {
    return sorted((items || [])
      .filter(item => Q.text(item && item.status) === "accepted")
      .map(item => item.userId));
  }

  function availableSlotCapacity(snapshot) {
    return (snapshot && snapshot.slots || []).reduce((sum, slot) => {
      const capacity = Math.max(0, Number(slot.capacityTotal || 0));
      const accepted = Math.max(0, Number(slot.acceptedMembers || 0));
      return sum + (capacity > 0 ? Math.max(0, capacity - accepted) : 0);
    }, 0);
  }

  function rollbackBlock6() {
    config();
    const currentState = state();
    if (!Array.isArray(currentState.block6Snapshots)
        || currentState.block6Snapshots.length === 0
        || !Array.isArray(currentState.block6UserFields)
        || currentState.block6UserFields.length === 0
        || !currentState.destinationFingerprint) {
      Q.fail("the verified step-66 rollback checkpoint has not been captured.");
    }
    clearCurrentEffects();
    Q.restoreSnapshots(currentState.block6Snapshots);
    for (const saved of currentState.block6UserFields) restoreUserFields(saved);
    const restored = paidSnapshot();
    if (!samePersistedSnapshot(restored, currentState.destinationFingerprint)
        || !Q.sameJson(documentIds(eventChatMessages()), currentState.block6ChatMessageIds || [])
        || !Q.sameJson(documentIds(novaJoinNotifications()), currentState.block6JoinNotificationIds || [])
        || !Q.sameJson(documentIds(novaJoinOutboxItems()), currentState.block6JoinOutboxIds || [])) {
      Q.fail("block-6 rollback did not restore the exact verified step-66 boundary.");
    }
    assertControlsUnchanged(currentState);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      {
        $set: {
          phase: "destination-verified",
          block6RolledBackAtIso: Q.nowIso()
        },
        $unset: {
          controlsVerifiedAtIso: "",
          leaveRejoinedAtIso: "",
          leaveRejoinedFingerprint: "",
          verifiedAtIso: ""
        }
      }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "destination-verified",
      rollback: "block-6-to-step-66",
      payments: 2,
      membership: "3 / 6",
      slotsFull: 2
    });
  }

  function verifyLeaveRejoined() {
    const currentState = state();
    if (Q.text(currentState.phase) !== "destination-verified") {
      Q.fail("leave/rejoin can only be verified from the step-66 destination boundary.");
    }
    const current = paidSnapshot();
    const originalPayments = currentState.destinationFingerprint.payments || [];
    const originalNovaPayment = originalPayments.find(item => Q.text(item.userId) === NOVA_ID);
    const originalRileyPayment = originalPayments.find(item => Q.text(item.userId) === RILEY_ID);
    const currentNovaPayment = current.payments.find(item =>
      originalNovaPayment && String(item._id) === String(originalNovaPayment._id));
    const currentRileyPayment = current.payments.find(item =>
      originalRileyPayment && String(item._id) === String(originalRileyPayment._id));
    if (current.payments.length !== 2
        || !currentNovaPayment
        || Q.text(currentNovaPayment.provider) !== "stripe"
        || Q.text(currentNovaPayment.status) !== "authorized"
        || Q.text(currentNovaPayment.bookingStatus) !== "joined"
        || Q.text(currentNovaPayment.refundStatus) !== "none"
        || Q.text(currentNovaPayment.slotSourceId) !== EVENING_SLOT_ID
        || Q.text(currentNovaPayment.paymentMethodId) !== CARD_IDS.stripe
        || Number(currentNovaPayment.amount || 0) !== 3200
        || Q.text(currentNovaPayment.currency) !== "HUF"
        || !currentRileyPayment
        || Q.text(currentRileyPayment.bookingStatus) !== "joined"
        || Q.text(currentRileyPayment.slotSourceId) !== MORNING_SLOT_ID) {
      Q.fail("leave/rejoin did not preserve Riley and restore Nova through the original open authorization without a duplicate payment write.");
    }
    const originalSucceeded = (currentState.destinationFingerprint.baskets || []).filter(item =>
      item.reservationActive === false
      && item.pendingCounterTracked === false
      && Q.text(item.resultState) === "succeeded"
      && Q.text(item.kind) === "event"
      && !Q.text(item.subEventId));
    const succeeded = current.baskets.filter(item =>
      item.reservationActive === false
      && item.pendingCounterTracked === false
      && Q.text(item.resultState) === "succeeded"
      && Q.text(item.kind) === "event"
      && !Q.text(item.subEventId));
    if (succeeded.length !== originalSucceeded.length + 1
        || succeeded.filter(item => Q.text(item.userId) === NOVA_ID
          && Q.text(item.slotSourceId) === EVENING_SLOT_ID).length
          !== originalSucceeded.filter(item => Q.text(item.userId) === NOVA_ID
            && Q.text(item.slotSourceId) === EVENING_SLOT_ID).length + 1
        || succeeded.filter(item => Q.text(item.userId) === RILEY_ID
          && Q.text(item.slotSourceId) === MORNING_SLOT_ID).length
          !== originalSucceeded.filter(item => Q.text(item.userId) === RILEY_ID
            && Q.text(item.slotSourceId) === MORNING_SLOT_ID).length
        || activeTargetBaskets(NOVA_ID).length !== 0
        || activeTargetBaskets(RILEY_ID).length !== 0) {
      Q.fail("leave/rejoin did not add exactly one succeeded inactive Nova basket audit or left an active basket.");
    }
    const acceptedMembers = current.members.filter(item => Q.text(item.status) === "accepted");
    const acceptedSlotMembers = current.slotMembers.filter(item => Q.text(item.status) === "accepted");
    const morningSlot = current.slots.find(item => Q.text(item.sourceId) === MORNING_SLOT_ID);
    const eveningSlot = current.slots.find(item => Q.text(item.sourceId) === EVENING_SLOT_ID);
    if (!current.event
        || Number(current.event.acceptedMembers || 0) !== 3
        || !Q.sameJson(sorted(current.event.acceptedMemberUserIds), [CASEY_ID, NOVA_ID, RILEY_ID])
        || acceptedMembers.length !== 3
        || acceptedMembers.some(item => Q.text(item.statusBeforeSuppression)
          || Q.text(item.suppressionRootOwnerId))
        || !morningSlot
        || Number(morningSlot.acceptedMembers || 0) !== 2
        || !Q.sameJson(sorted(morningSlot.acceptedMemberUserIds), [CASEY_ID, RILEY_ID])
        || !eveningSlot
        || Number(eveningSlot.acceptedMembers || 0) !== 2
        || !Q.sameJson(sorted(eveningSlot.acceptedMemberUserIds), [CASEY_ID, NOVA_ID])
        || !acceptedSlotMembers.some(item => Q.text(item.ownerId) === MORNING_SLOT_ID && Q.text(item.userId) === RILEY_ID)
        || !acceptedSlotMembers.some(item => Q.text(item.ownerId) === EVENING_SLOT_ID && Q.text(item.userId) === NOVA_ID)) {
      Q.fail("leave/rejoin did not restore Casey, Nova and Riley or the exact full Slot memberships.");
    }
    if (Q.collection("eventTickets").countDocuments({ eventId: TARGET_ID }) !== 0) {
      Q.fail("Ticketing Off leave/rejoin created an EventTicket.");
    }
    const baselineChatIds = new Set(currentState.block6ChatMessageIds || []);
    const newChatMessages = eventChatMessages().filter(item => !baselineChatIds.has(String(item._id)));
    const newLeftMessages = newChatMessages.filter(item =>
      Q.text(item.clientId) === "member-left"
      && Q.text(item.text) === "Nova Social left the event.");
    const newJoinedMessages = newChatMessages.filter(item =>
      Q.text(item.clientId) === "member-joined"
      && Q.text(item.text) === "Nova Social joined the event.");
    if (newChatMessages.length !== 2 || newLeftMessages.length !== 1 || newJoinedMessages.length !== 1) {
      Q.fail("leave/rejoin did not append exactly one Nova left and one Nova joined main-Event chat message.");
    }
    const baselineJoinNotificationIds = new Set(currentState.block6JoinNotificationIds || []);
    const newJoinNotifications = novaJoinNotifications()
      .filter(item => !baselineJoinNotificationIds.has(String(item._id)));
    if (newJoinNotifications.length !== 2
        || !Q.sameJson(sorted(newJoinNotifications.map(item => item.recipientUserId)), [CASEY_ID, RILEY_ID])
        || newJoinNotifications.some(item => Q.text(item.payload && item.payload.membershipAction) !== "joined")) {
      Q.fail("Nova rejoin did not create exactly one joined notification for Casey and Riley, excluding Nova.");
    }
    const baselineJoinOutboxIds = new Set(currentState.block6JoinOutboxIds || []);
    const newJoinOutboxItems = novaJoinOutboxItems()
      .filter(item => !baselineJoinOutboxIds.has(String(item._id)));
    if (newJoinOutboxItems.length !== 1
        || !Q.sameJson(sorted(newJoinOutboxItems[0].recipientUserIds), [CASEY_ID, RILEY_ID])) {
      Q.fail("Nova rejoin did not persist one durable joined-notification intent for Casey and Riley.");
    }
    const baselineUserFields = new Map((currentState.block6UserFields || [])
      .map(item => [Q.text(item.userId), item]));
    const notificationCount = userId => Number((Q.ensureUser(userId).activities || {}).notifications || 0);
    const baselineNotificationCount = userId => {
      const saved = baselineUserFields.get(userId);
      return Number(saved && saved.activities && saved.activities.present
        ? (saved.activities.value || {}).notifications || 0
        : 0);
    };
    if (notificationCount(CASEY_ID) !== baselineNotificationCount(CASEY_ID) + 2
        || notificationCount(RILEY_ID) !== baselineNotificationCount(RILEY_ID) + 2
        || notificationCount(NOVA_ID) !== baselineNotificationCount(NOVA_ID)) {
      Q.fail("leave/rejoin notification counters do not match the one leave plus one join notification delivered to Casey and Riley.");
    }
    assertControlsUnchanged(currentState);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: currentState._id }, { $set: {
      phase: "leave-rejoined-verified",
      leaveRejoinedAtIso: Q.nowIso(),
      leaveRejoinedFingerprint: current
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "leave-rejoined-verified",
      payments: 2,
      novaAuthorization: "reused-without-duplicate-write",
      novaBooking: "joined",
      rileyBooking: "joined",
      membership: "3 / 6",
      slotsFull: 2
    });
  }

  function verifyDestination() {
    const currentState = state();
    if (Q.text(currentState.phase) !== "paid-verified") Q.fail("destination can only be verified after the paid boundary.");
    const current = paidSnapshot();
    if (!samePersistedSnapshot(current, currentState.paidFingerprint)) {
      Q.fail("read-only destination checks changed the paid Event projection.");
    }
    assertControlsUnchanged(currentState);
    const block6Snapshots = currentScopedSnapshots();
    const block6UserFields = [CASEY_ID, NOVA_ID, RILEY_ID]
      .map(userId => userFields(Q.ensureUser(userId)));
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      {
        $set: {
          phase: "destination-verified",
          destinationAtIso: Q.nowIso(),
          destinationFingerprint: current,
          block6Snapshots,
          block6UserFields,
          block6ChatMessageIds: documentIds(eventChatMessages()),
          block6JoinNotificationIds: documentIds(novaJoinNotifications()),
          block6JoinOutboxIds: documentIds(novaJoinOutboxItems()),
          block6CapturedAtIso: Q.nowIso()
        },
        $unset: {
          block5Snapshots: "",
          block5UserFields: "",
          block5CapturedAtIso: "",
          block5RolledBackAtIso: ""
        }
      }
    );
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "destination-verified", checkpoint: "step-66", persistedPayment: true, persistedMembership: true });
  }

  function verifyControls() {
    const currentState = state();
    if (Q.text(currentState.phase) !== "destination-verified") {
      Q.fail("control verification requires the captured step-66 destination boundary.");
    }
    if (provider !== "none" || !providerConnected || requires3ds) {
      Q.fail(`control simulator state is provider='${provider}', connected=${providerConnected}, requires3ds=${requires3ds}; expected connected Cash only with 3DS Off.`);
    }
    const current = paidSnapshot();
    if (!samePersistedSnapshot(current, currentState.destinationFingerprint)) {
      Q.fail("steps 67-74 changed the paid Event write model.");
    }
    assertControlContracts();
    assertControlsUnchanged(currentState);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      { $set: { controlsVerifiedAtIso: Q.nowIso() } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "destination-verified",
      verifiedThroughStep: 74,
      controls: {
        free: "untouched",
        approval: "pending-with-one-basket",
        waitlist: "pending-without-basket",
        cashOnly: "cancelled-without-effects",
        adjacentPaid: "untouched"
      }
    });
  }

  function captureBlock7() {
    config();
    const currentState = state();
    if (Q.text(currentState.phase) !== "destination-verified"
        || !Q.text(currentState.controlsVerifiedAtIso)) {
      Q.fail("block-7 capture requires the verified step-74 destination/control boundary.");
    }
    if (provider !== "none" || !providerConnected || requires3ds) {
      Q.fail(`block-7 simulator state is provider='${provider}', connected=${providerConnected}, requires3ds=${requires3ds}; expected connected Cash only with 3DS Off.`);
    }
    const current = paidSnapshot();
    const morning = current.slots.find(item => Q.text(item.sourceId) === MORNING_SLOT_ID);
    const evening = current.slots.find(item => Q.text(item.sourceId) === EVENING_SLOT_ID);
    if (!current.event
        || current.event.full !== true
        || Number(current.event.acceptedMembers || 0) !== 3
        || !Q.sameJson(sorted(current.event.acceptedMemberUserIds), [CASEY_ID, NOVA_ID, RILEY_ID])
        || !Q.sameJson(acceptedUserIds(current.members), [CASEY_ID, NOVA_ID, RILEY_ID])
        || !morning
        || Number(morning.acceptedMembers || 0) !== 2
        || !Q.sameJson(sorted(morning.acceptedMemberUserIds), [CASEY_ID, RILEY_ID])
        || !evening
        || Number(evening.acceptedMembers || 0) !== 2
        || !Q.sameJson(sorted(evening.acceptedMemberUserIds), [CASEY_ID, NOVA_ID])
        || availableSlotCapacity(current) !== 0
        || activeTargetBaskets(NOVA_ID).length !== 0
        || Q.collection("eventWatchSubscriptions").countDocuments({ eventId: TARGET_ID }) !== 0) {
      Q.fail("block 7 is not at the exact pre-Nova-leave, pre-Watchlist step-74 boundary.");
    }
    if (current.payments.length !== 2) {
      Q.fail("step 75 changed the two persisted paid Event payment records.");
    }
    assertControlContracts();
    assertControlsUnchanged(currentState);
    const block7Snapshots = currentScopedSnapshots();
    const block7UserFields = [CASEY_ID, NOVA_ID, RILEY_ID]
      .map(userId => userFields(Q.ensureUser(userId)));
    const novaFields = block7UserFields.find(item => item.userId === NOVA_ID);
    const novaActivities = novaFields && novaFields.activities && novaFields.activities.present
      ? novaFields.activities.value || {}
      : {};
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      {
        $set: {
          phase: "block7-ready",
          block7Snapshots,
          block7UserFields,
          block7Fingerprint: current,
          block7ScopedFingerprint: block7Snapshots,
          block7NotificationIds: documentIds(targetNotifications()),
          block7OutboxIds: documentIds(targetNotificationOutbox()),
          block7ChatMessageIds: documentIds(eventChatMessages()),
          block7NovaAllCounter: Number(novaActivities.event && novaActivities.event.all || 0),
          block7NovaWatchlistCounter: Number(novaActivities.event && novaActivities.event.watchlist || 0),
          block7CapturedAtIso: Q.nowIso()
        },
        $unset: {
          watchlistVerifiedAtIso: "",
          verifiedAtIso: ""
        }
      }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "block7-ready",
      checkpoint: "pre-Nova-leave-step-74",
      payments: 2,
      membership: "Casey/Nova/Riley accepted",
      availableSlotCapacity: 0,
      watchSubscriptions: 0
    });
  }

  function rollbackBlock7() {
    config();
    const currentState = state();
    if (!Array.isArray(currentState.block7Snapshots)
        || currentState.block7Snapshots.length === 0
        || !Array.isArray(currentState.block7UserFields)
        || currentState.block7UserFields.length === 0
        || !currentState.block7Fingerprint) {
      Q.fail("the pre-Nova-leave block-7 rollback checkpoint has not been captured.");
    }
    clearCurrentEffects();
    Q.restoreSnapshots(currentState.block7Snapshots);
    for (const saved of currentState.block7UserFields) restoreUserFields(saved);
    const restored = paidSnapshot();
    if (!samePersistedSnapshot(restored, currentState.block7Fingerprint)
        || !Q.sameJson(documentIds(targetNotifications()), currentState.block7NotificationIds || [])
        || !Q.sameJson(documentIds(targetNotificationOutbox()), currentState.block7OutboxIds || [])
        || !Q.sameJson(documentIds(eventChatMessages()), currentState.block7ChatMessageIds || [])
        || Q.collection("eventWatchSubscriptions").countDocuments({ eventId: TARGET_ID }) !== 0) {
      Q.fail("block-7 rollback did not restore the exact pre-Nova-leave step-74 boundary.");
    }
    assertControlContracts();
    assertControlsUnchanged(currentState);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      {
        $set: {
          phase: "block7-ready",
          block7RolledBackAtIso: Q.nowIso()
        },
        $unset: {
          watchlistVerifiedAtIso: "",
          verifiedAtIso: ""
        }
      }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "block7-ready",
      rollback: "block-7-to-pre-Nova-leave-step-74",
      availableSlotCapacity: 0,
      watchSubscriptions: 0
    });
  }

  function cleanFinalWatchlistSideEffect() {
    config();
    const currentState = state();
    if (Q.text(currentState.phase) !== "block7-ready") {
      Q.fail("final Watchlist cleanup requires the captured pre-Nova-leave block-7 boundary.");
    }
    const removed = Q.collection("eventWatchSubscriptions").deleteMany({
      eventId: TARGET_ID,
      userId: NOVA_ID
    });
    const nova = Q.ensureUser(NOVA_ID, "Nova");
    const activities = { ...(nova.activities || {}) };
    activities.event = {
      ...(activities.event || {}),
      watchlist: Number(currentState.block7NovaWatchlistCounter || 0)
    };
    Q.collection("users").updateOne(userSelector(NOVA_ID), { $set: { activities } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "block7-ready",
      cleanup: "post-unwatch-watchlist-side-effect",
      removedSubscriptions: Number(removed.deletedCount || 0),
      watchlistCounter: Number(currentState.block7NovaWatchlistCounter || 0)
    });
  }

  function verifyWatchlist() {
    const currentState = state();
    if (Q.text(currentState.phase) !== "block7-ready") {
      Q.fail("Watchlist verification requires the captured pre-Nova-leave block-7 boundary.");
    }
    if (provider !== "none" || !providerConnected || requires3ds) {
      Q.fail(`Watchlist simulator state is provider='${provider}', connected=${providerConnected}, requires3ds=${requires3ds}; expected connected Cash only with 3DS Off.`);
    }
    const current = paidSnapshot();
    const morning = current.slots.find(item => Q.text(item.sourceId) === MORNING_SLOT_ID);
    const evening = current.slots.find(item => Q.text(item.sourceId) === EVENING_SLOT_ID);
    const baselinePaymentIds = documentIds(currentState.block7Fingerprint.payments || []);
    const newNotifications = targetNotifications()
      .filter(item => !(currentState.block7NotificationIds || []).includes(String(item._id)));
    const availabilityNotifications = newNotifications.filter(item =>
      Q.text(item.kind) === "event-watchlist-available"
      && Q.text(item.recipientUserId) === NOVA_ID
      && Q.text(item.payload && item.payload.eventScope) === "watchlist");
    const novaMemberNotifications = newNotifications.filter(item =>
      Q.text(item.recipientUserId) === NOVA_ID
      && Q.text(item.kind) === "event-member-removed"
      && Q.text(item.payload && item.payload.memberUserId) === RILEY_ID);
    const caseyMemberNotifications = newNotifications.filter(item =>
      Q.text(item.recipientUserId) === CASEY_ID
      && Q.text(item.kind) === "event-member-removed"
      && Q.text(item.payload && item.payload.memberUserId) === RILEY_ID);
    const newOutbox = targetNotificationOutbox()
      .filter(item => !(currentState.block7OutboxIds || []).includes(String(item._id)));
    const availabilityOutbox = newOutbox.filter(item =>
      Q.text(item.notificationType) === "event-watchlist-available"
      && Q.sameJson(sorted(item.recipientUserIds), [NOVA_ID]));
    const memberOutbox = newOutbox.filter(item =>
      Q.text(item.notificationType) === "event-member-removed"
      && Q.text(item.payload && item.payload.memberUserId) === RILEY_ID);
    const newChatMessages = eventChatMessages()
      .filter(item => !(currentState.block7ChatMessageIds || []).includes(String(item._id)));
    const rileyLeftMessages = newChatMessages.filter(item =>
      Q.text(item.clientId) === "member-left"
      && Q.text(item.text) === "Riley Outside left the event.");
    const nova = Q.ensureUser(NOVA_ID, "Nova");
    const novaEventCounters = nova.activities && nova.activities.event || {};
    if (!current.event
        || Number(current.event.acceptedMembers || 0) !== 1
        || !Q.sameJson(sorted(current.event.acceptedMemberUserIds), [CASEY_ID])
        || !Q.sameJson(acceptedUserIds(current.members), [CASEY_ID])
        || !morning
        || Number(morning.acceptedMembers || 0) !== 1
        || !Q.sameJson(sorted(morning.acceptedMemberUserIds), [CASEY_ID])
        || !evening
        || Number(evening.acceptedMembers || 0) !== 1
        || !Q.sameJson(sorted(evening.acceptedMemberUserIds), [CASEY_ID])
        || availableSlotCapacity(current) !== 2
        || activeTargetBaskets(NOVA_ID).length !== 0
        || activeTargetBaskets(RILEY_ID).length !== 0
        || !Q.sameJson(documentIds(current.payments), baselinePaymentIds)
        || Q.collection("eventWatchSubscriptions").countDocuments({ eventId: TARGET_ID }) !== 0
        || Number(novaEventCounters.all || 0) !== Math.max(0, Number(currentState.block7NovaAllCounter || 0) - 1)
        || Number(novaEventCounters.watchlist || 0) !== Number(currentState.block7NovaWatchlistCounter || 0)) {
      Q.fail("final Watchlist state changed payment/participation invariants or left a subscription/counter side effect.");
    }
    if (availabilityNotifications.length !== 1
        || novaMemberNotifications.length !== 0
        || caseyMemberNotifications.length !== 1
        || availabilityOutbox.length !== 1
        || memberOutbox.length !== 1
        || !Q.sameJson(sorted(memberOutbox[0].recipientUserIds), [CASEY_ID])
        || newChatMessages.length !== 2
        || rileyLeftMessages.length !== 1
        || newChatMessages.filter(item =>
          Q.text(item.clientId) === "member-left"
          && Q.text(item.text) === "Nova Social left the event.").length !== 1) {
      Q.fail("Watchlist availability and accepted-member Event notifications were not separated exactly once.");
    }
    assertControlContracts();
    assertControlsUnchanged(currentState);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: currentState._id },
      { $set: { phase: "verified", watchlistVerifiedAtIso: Q.nowIso(), verifiedAtIso: Q.nowIso() } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "verified",
      result: "PASS",
      watchlistAvailabilityNotifications: 1,
      novaMemberNotifications: 0,
      caseyMemberNotifications: 1,
      watchSubscriptions: 0,
      availableSlotCapacity: 2,
      payments: 2
    });
  }

  function verifyTerminal() {
    verifyWatchlist();
  }

  function reset() {
    config();
    const currentState = state();
    clearCurrentEffects();
    Q.restoreSnapshots(currentState.snapshots || []);
    for (const saved of currentState.userFields || []) restoreUserFields(saved);
    Q.restoreRuleConfig(currentState.basketRuleConfig);
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
  else if (command === "repair-card-artwork") repairCardArtwork();
  else if (command === "repair-control-fixtures") repairControlFixtures();
  else if (command === "repair-slot-occurrences") repairDuplicateSlotOccurrences();
  else if (command === "capture-payment-ready") capturePaymentReady();
  else if (command === "verify-pending-event") verifyPendingEvent();
  else if (command === "rollback-payment-ready") rollbackPaymentReady();
  else if (command === "verify-cancelled") verifyCancelled();
  else if (command === "rollback-block-4") rollbackBlock4();
  else if (command === "verify-paid") verifyPaid();
  else if (command === "rollback-block-6") rollbackBlock6();
  else if (command === "verify-controls") verifyControls();
  else if (command === "verify-leave-rejoined") verifyLeaveRejoined();
  else if (command === "verify-destination") verifyDestination();
  else if (command === "capture-block-7") captureBlock7();
  else if (command === "rollback-block-7") rollbackBlock7();
  else if (command === "clean-final-watchlist-side-effect") cleanFinalWatchlistSideEffect();
  else if (command === "verify-watchlist") verifyWatchlist();
  else if (command === "verify") verifyTerminal();
  else if (command === "reset") reset();
  else Q.fail(`unsupported event-checkout command '${command}'.`);
})();
