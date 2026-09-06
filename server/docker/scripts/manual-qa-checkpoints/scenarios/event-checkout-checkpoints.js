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
  const cardSelector = { userId: NOVA_ID };
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

  function cardDocument(id, providerName, token, last4, expiryMonth, expiryYear, artworkKey, status, nowIso) {
    return {
      _id: id,
      version: 0,
      userId: NOVA_ID,
      provider: providerName,
      providerPaymentMethodRef: token,
      brand: providerName === "barion" ? "Mastercard" : "Visa",
      last4,
      expiryMonth,
      expiryYear,
      expiryKey: expiryYear * 100 + expiryMonth,
      cardholderName: "NOVA SOCIAL",
      artworkKey,
      status,
      createdAtIso: nowIso,
      updatedAtIso: nowIso
    };
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
    if (!Q.sameJson(current, currentState.controlFingerprint)) {
      Q.fail("Free/Approval/Waitlist/Adjacent control records changed.");
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
        nova: paymentTotals(nova)
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
      capacityTotal: 6,
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
      capacityTotal: 6,
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
      subEventDefinitions: []
    });
    const eveningSlot = eventDocument(EVENING_SLOT_ID, "QA Evening Slot", eveningStart, eveningEnd, {
      nowIso,
      parentEventId: TARGET_ID,
      slotTemplateId: EVENING_TEMPLATE_ID,
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
    Q.collection("eventCheckoutBasketItems").insertMany([
      basketDocument(`${PREFIX}:basket:approval`, APPROVAL_ID, "QA EVENT-CHECKOUT-001 Approval", "approval-pending", now, expires, 3200),
      basketDocument(`${PREFIX}:basket:waitlist`, WAITLIST_ID, "QA EVENT-CHECKOUT-001 Waitlist", "waiting", now, expires, 3200)
    ]);
    Q.collection("savedPaymentMethods").insertMany([
      cardDocument(CARD_IDS.stripe, "stripe", "pm_sim_checkout_nova_stripe_4242", "4242", 12, 2029, "midnight", "active", nowIso),
      cardDocument(CARD_IDS.barion, "barion", "pm_sim_checkout_nova_barion_4444", "4444", 9, 2029, "graphite", "active", nowIso),
      {
        ...cardDocument(CARD_IDS.expired, "stripe", "pm_sim_checkout_nova_expired_0008", "0008", 8, 2026, "coral", "expired", nowIso),
        expiredNotifiedAtIso: nowIso
      }
    ]);
    setEventCounters();
    Q.holdRule(BASKET_RULE, 2, `${CHECKPOINT}: two stable pending controls`, 3600);
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
    const target = Q.collection("events").findOne({ sourceId: TARGET_ID });
    const slots = Q.collection("events").find({ parentEventId: TARGET_ID }).sort({ startAtIso: 1 }).toArray();
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
      cards: cards.map(item => ({ id: Q.text(item._id), provider: Q.text(item.provider), last4: Q.text(item.last4), artworkKey: Q.text(item.artworkKey), status: Q.text(item.status) })),
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
    if (summary.cards.length !== 3
        || !summary.cards.some(item => item.provider === "stripe" && item.last4 === "4242" && item.status === "active")
        || !summary.cards.some(item => item.provider === "barion" && item.last4 === "4444" && item.status === "active" && item.artworkKey === "graphite")
        || !summary.cards.some(item => item.provider === "stripe" && item.last4 === "0008" && item.status === "expired" && item.artworkKey === "coral")) {
      Q.fail(`Nova card baseline mismatch: ${JSON.stringify(summary.cards)}.`);
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

  function activeTargetBaskets() {
    return Q.collection("eventCheckoutBasketItems").find({
      sourceId: TARGET_ID,
      userId: NOVA_ID,
      reservationActive: true,
      resultState: { $in: [null, "", "pending", "active"] }
    }).sort({ createdAtIso: 1, _id: 1 }).toArray();
  }

  function capturePaymentReady() {
    const currentState = state();
    if (Q.text(currentState.phase) !== "baseline-ready") Q.fail("payment-ready can only be captured from baseline-ready.");
    if (provider !== "stripe" || !providerConnected || requires3ds) {
      Q.fail(`payment-ready simulator state is provider='${provider}', connected=${providerConnected}, requires3ds=${requires3ds}; expected connected Stripe with 3DS Off.`);
    }
    const baskets = activeTargetBaskets();
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
        || Q.collection("activityMembers").countDocuments({ ownerId: TARGET_ID, userId: NOVA_ID }) !== 0) {
      Q.fail("payment-ready already created a payment or Nova membership.");
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
      paymentReadyBasketIds: baskets.map(item => item._id),
      paymentReadyBaskets: baskets,
      paymentReadySnapshots,
      paymentReadyUserFields: [CASEY_ID, NOVA_ID, RILEY_ID].map(userId => userFields(Q.ensureUser(userId)))
    } });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "payment-ready", basketItems: 2, amount: 4900, currency: "HUF", paymentCount: 0, membershipCount: 0 });
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
        $set: { phase: "payment-ready", paymentReadyRolledBackAtIso: Q.nowIso() },
        $unset: { cancelledAtIso: "", paidAtIso: "", paidFingerprint: "", destinationAtIso: "", verifiedAtIso: "" }
      }
    );
    const restoredBaskets = activeTargetBaskets();
    if (!Q.sameJson(restoredBaskets, currentState.paymentReadyBaskets)
        || Q.collection("payments").countDocuments({ sourceId: TARGET_ID, userId: NOVA_ID }) !== 0
        || Q.collection("activityMembers").countDocuments({ ownerId: TARGET_ID, userId: NOVA_ID }) !== 0) {
      Q.fail("payment-ready rollback did not restore the exact step-22 boundary.");
    }
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "payment-ready", rollback: "step-22", basketItems: restoredBaskets.length, paymentCount: 0, membershipCount: 0 });
  }

  function verifyCancelled() {
    const currentState = state();
    if (Q.text(currentState.phase) !== "payment-ready") Q.fail("cancelled can only be verified after payment-ready.");
    const all = Q.collection("eventCheckoutBasketItems").find({ sourceId: TARGET_ID, userId: NOVA_ID }).toArray();
    const originals = new Set((currentState.paymentReadyBasketIds || []).map(String));
    const cancelled = all.filter(item => originals.has(String(item._id)));
    if (cancelled.length !== 2
        || cancelled.some(item => item.reservationActive === true || item.pendingCounterTracked === true)
        || cancelled.some(item => Q.text(item.status) !== "cancelled" || Q.text(item.resultState) !== "deleted")
        || activeTargetBaskets().length !== 0) {
      Q.fail("the first checkout attempt is not one closed cancelled basket audit.");
    }
    if (Q.collection("payments").countDocuments({ sourceId: TARGET_ID, userId: NOVA_ID }) !== 0
        || Q.collection("activityMembers").countDocuments({ ownerId: TARGET_ID, userId: NOVA_ID }) !== 0
        || Q.collection("eventTickets").countDocuments({ eventId: TARGET_ID, userId: NOVA_ID }) !== 0) {
      Q.fail("cancelled checkout produced a payment, membership or ticket.");
    }
    assertControlsUnchanged(currentState);
    assertRileyUnchanged(currentState);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: currentState._id }, { $set: { phase: "cancelled-verified", cancelledAtIso: Q.nowIso() } });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "cancelled-verified", closedBasketItems: 2, paymentCount: 0, membershipCount: 0 });
  }

  function paidSnapshot() {
    const event = Q.collection("events").findOne({ sourceId: TARGET_ID });
    const members = Q.collection("activityMembers").find({ ownerId: TARGET_ID }).sort({ userId: 1 }).toArray();
    const payments = Q.collection("payments").find({ sourceId: TARGET_ID, userId: NOVA_ID }).sort({ createdDate: 1 }).toArray();
    const baskets = Q.collection("eventCheckoutBasketItems").find({ sourceId: TARGET_ID, userId: NOVA_ID }).sort({ createdAtIso: 1, _id: 1 }).toArray();
    const chats = Q.collection("chats").find(chatSelector).toArray().filter(item => {
      const eventId = Q.text(item.eventId || item.ownerId || item.sourceId);
      return eventId === TARGET_ID;
    });
    return { event, members, payments, baskets, chats };
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
      && Q.text(item.slotSourceId) === EVENING_SLOT_ID
      && Q.sameJson(sorted(item.optionalSubEventIds), [])
      && Q.sameJson(sorted(item.acceptedPolicyIds), [POLICY_ID])
      && Q.text(item.paymentMethodId) === CARD_IDS.stripe);
    if (current.payments.length !== 1 || successfulPayments.length !== 1) {
      Q.fail(`expected one authorized joined Stripe payment, found ${JSON.stringify(current.payments.map(item => ({ id: item._id, provider: item.provider, status: item.status, bookingStatus: item.bookingStatus, amount: item.amount, slotSourceId: item.slotSourceId, paymentMethodId: item.paymentMethodId })))}.`);
    }
    const succeeded = current.baskets.filter(item =>
      item.reservationActive === false
      && item.pendingCounterTracked === false
      && Q.text(item.status) === "approved"
      && Q.text(item.resultState) === "succeeded"
      && Q.text(item.kind) === "event"
      && Q.text(item.slotSourceId) === EVENING_SLOT_ID
      && !Q.text(item.subEventId));
    if (succeeded.length !== 1 || activeTargetBaskets().length !== 0) {
      Q.fail("paid checkout did not leave exactly one succeeded inactive basket item.");
    }
    const acceptedMembers = current.members.filter(item => Q.text(item.status) === "accepted");
    if (!current.event
        || Number(current.event.acceptedMembers || 0) !== 2
        || !Q.sameJson(sorted(current.event.acceptedMemberUserIds), [CASEY_ID, NOVA_ID])
        || acceptedMembers.length !== 2
        || !acceptedMembers.some(item => Q.text(item.userId) === CASEY_ID && Q.text(item.role) === "Admin")
        || !acceptedMembers.some(item => Q.text(item.userId) === NOVA_ID && Q.text(item.role) === "Member")) {
      Q.fail("paid checkout membership/occupancy projection is not Casey Admin + Nova Member at 2 / 6.");
    }
    if (Q.collection("eventTickets").countDocuments({ eventId: TARGET_ID }) !== 0) {
      Q.fail("Ticketing Off checkout created an EventTicket.");
    }
    const novaUser = Q.ensureUser(NOVA_ID, "Nova");
    const caseyUser = Q.ensureUser(CASEY_ID, "Casey");
    const novaActivities = novaUser.activities || {};
    const novaEventCounters = novaActivities.event || {};
    const novaChatCounters = novaActivities.chat || {};
    const caseyActivities = caseyUser.activities || {};
    const caseyEventCounters = caseyActivities.event || {};
    const caseyChatCounters = caseyActivities.chat || {};
    if (Number(novaActivities.events || 0) !== 1
        || Number(novaEventCounters.all || 0) !== 3
        || Number(novaEventCounters.active || 0) !== 1
        || Number(novaEventCounters.pending || 0) !== 2
        || Number(caseyActivities.hosting || 0) !== 6
        || Number(caseyEventCounters.all || 0) !== 6
        || Number(caseyEventCounters.hosting || 0) !== 6) {
      Q.fail("accepted Event activity counters are not the exact target delta over the pending controls.");
    }
    const targetChats = current.chats.filter(item =>
      Q.text(item.channelType) === "mainEvent"
      && [CASEY_ID, NOVA_ID].includes(Q.text(item.ownerUserId))
      && Q.sameJson(sorted(item.memberIds), [CASEY_ID, NOVA_ID]));
    if (targetChats.length !== 2
        || sorted(targetChats.map(item => item.ownerUserId)).length !== 2
        || Number(novaActivities.chats || 0) !== 1
        || Number(novaChatCounters.all || 0) !== 1
        || Number(novaChatCounters.event || 0) !== 1
        || Number(caseyActivities.chats || 0) !== 1
        || Number(caseyChatCounters.all || 0) !== 1
        || Number(caseyChatCounters.event || 0) !== 1) {
      Q.fail("accepted Event did not create exactly one shared main-Event chat projection for Casey and Nova.");
    }
    const novaTotals = paymentTotals(novaUser);
    const caseyTotals = paymentTotals(caseyUser);
    const baselineNova = currentState.baselineTotals.nova;
    const baselineCasey = currentState.baselineTotals.casey;
    if (amountFor(novaTotals, "spent", "HUF") !== amountFor(baselineNova, "spent", "HUF") + 3200
        || amountFor(novaTotals, "all", "HUF") !== amountFor(baselineNova, "all", "HUF") + 3200
        || amountFor(caseyTotals, "income", "HUF") !== amountFor(baselineCasey, "income", "HUF") + 3200
        || amountFor(caseyTotals, "all", "HUF") !== amountFor(baselineCasey, "all", "HUF") + 3200) {
      Q.fail("payment total deltas are not exactly HUF 3,200 for Nova/Casey.");
    }
    assertControlsUnchanged(currentState);
    assertRileyUnchanged(currentState);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: currentState._id }, { $set: {
      phase: "paid-verified",
      paidAtIso: Q.nowIso(),
      paidFingerprint: current
    } });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "paid-verified", payments: 1, provider: "stripe", status: "authorized", membership: "2 / 6", tickets: 0 });
  }

  function verifyDestination() {
    const currentState = state();
    if (Q.text(currentState.phase) !== "paid-verified") Q.fail("destination can only be verified after paid.");
    const current = paidSnapshot();
    if (!Q.sameJson(current, currentState.paidFingerprint)) {
      Q.fail("read-only destination checks changed the paid Event projection.");
    }
    assertControlsUnchanged(currentState);
    assertRileyUnchanged(currentState);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: currentState._id }, { $set: { phase: "destination-verified", destinationAtIso: Q.nowIso() } });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "destination-verified", persistedPayment: true, persistedMembership: true });
  }

  function verifyTerminal() {
    const currentState = state();
    if (Q.text(currentState.phase) !== "destination-verified") Q.fail("terminal verification requires destination-verified.");
    if (provider !== "none" || !providerConnected || requires3ds) {
      Q.fail(`terminal simulator state is provider='${provider}', connected=${providerConnected}, requires3ds=${requires3ds}; expected connected Cash only with 3DS Off.`);
    }
    const current = paidSnapshot();
    if (!Q.sameJson(current, currentState.paidFingerprint)) {
      Q.fail("reload/control reads changed the paid Event projection.");
    }
    const cashEffects = {
      memberships: Q.collection("activityMembers").countDocuments({ ownerId: CASH_ID, userId: NOVA_ID }),
      payments: Q.collection("payments").countDocuments({ sourceId: CASH_ID, userId: NOVA_ID }),
      activeBaskets: Q.collection("eventCheckoutBasketItems").countDocuments({ sourceId: CASH_ID, userId: NOVA_ID, reservationActive: true })
    };
    if (cashEffects.memberships !== 0 || cashEffects.payments !== 0 || cashEffects.activeBaskets !== 0) {
      Q.fail(`cancelled Cash-only control left effects: ${JSON.stringify(cashEffects)}.`);
    }
    assertControlsUnchanged(currentState);
    assertRileyUnchanged(currentState);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: currentState._id }, { $set: { phase: "verified", verifiedAtIso: Q.nowIso() } });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "verified", result: "PASS", paymentCount: 1, membership: "2 / 6", tickets: 0, cashOnlyEffects: cashEffects });
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
  else if (command === "capture-payment-ready") capturePaymentReady();
  else if (command === "rollback-payment-ready") rollbackPaymentReady();
  else if (command === "verify-cancelled") verifyCancelled();
  else if (command === "verify-paid") verifyPaid();
  else if (command === "verify-destination") verifyDestination();
  else if (command === "verify") verifyTerminal();
  else if (command === "reset") reset();
  else Q.fail(`unsupported event-checkout command '${command}'.`);
})();
