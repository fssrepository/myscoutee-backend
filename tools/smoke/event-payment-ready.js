/* global db, EJSON, print, process */
(() => {
  "use strict";

  const PREFIX = "smoke-fixture:v1:event-payment-ready";
  const SNAPSHOT_COLLECTION = "smokeFixtureSnapshots";
  const SNAPSHOT_ID = `${PREFIX}:snapshot`;
  const EVENT_ID = `${PREFIX}:event`;
  const HOST_MEMBER_ID = `${PREFIX}:member:host`;
  const BASKET_ID = `${PREFIX}:basket`;
  const TITLE = "SMOKE · Event payment ready";
  const PRICE = 4900;
  const CURRENCY = "HUF";

  const command = text(process.env.SMOKE_COMMAND);
  const requestedDb = text(process.env.SMOKE_DB);
  const targetUserId = text(process.env.SMOKE_USER_ID);
  const hostUserId = text(process.env.SMOKE_HOST_ID);
  const displayTimeZone = text(process.env.SMOKE_TIME_ZONE) || "Europe/Bratislava";

  function text(value) {
    return value == null ? "" : String(value).trim();
  }

  function fail(message) {
    throw new Error(`[event-payment-ready] ${message}`);
  }

  function collection(name) {
    return db.getCollection(name);
  }

  function printObject(value) {
    print(EJSON.stringify(value, null, 2, { relaxed: true }));
  }

  function displayTimeframe(start, end) {
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: displayTimeZone
    });
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: displayTimeZone
    });
    const startDate = dateFormatter.format(start);
    const endDate = dateFormatter.format(end);
    const startTime = timeFormatter.format(start);
    const endTime = timeFormatter.format(end);
    return startDate === endDate
      ? `${startDate} · ${startTime} - ${endTime}`
      : `${startDate} · ${startTime} - ${endDate} · ${endTime}`;
  }

  function assertDeploymentSafety() {
    const currentDb = db.getName();
    if (currentDb !== requestedDb) {
      fail(`mongosh selected '${currentDb}', but SMOKE_DB requested '${requestedDb}'.`);
    }
    const expected = {
      demo_db: {
        controller: "MyScoutee Demo Operator",
        email: "privacy@demo.myscoutee.test"
      },
      e2e_db: {
        controller: "MyScoutee E2E Operator",
        email: "privacy@e2e.myscoutee.test"
      }
    }[currentDb];
    if (!expected) {
      fail(`database '${currentDb}' is forbidden; only exact demo_db/e2e_db are accepted.`);
    }
    const marker = collection("deploymentConfigurations").findOne({
      _id: "deployment-configuration",
      schemaVersion: 4
    });
    const privacy = marker && marker.privacyContact ? marker.privacyContact : {};
    if (!marker
        || privacy.dataControllerName !== expected.controller
        || privacy.privacyContactEmail !== expected.email) {
      fail(`deployment marker mismatch for '${currentDb}'; refusing to continue.`);
    }
  }

  function userById(userId, label) {
    const user = collection("users").findOne({ $or: [{ _id: userId }, { userId }] });
    if (!user) {
      fail(`${label} '${userId}' does not exist in '${db.getName()}'.`);
    }
    if (["deleted", "onboarding"].includes(text(user.profileStatus).toLowerCase())) {
      fail(`${label} '${userId}' is not an active demo profile.`);
    }
    return user;
  }

  function snapshotField(document, key) {
    return Object.prototype.hasOwnProperty.call(document || {}, key)
      ? { present: true, value: document[key] }
      : { present: false };
  }

  function restoreField(userId, key, saved) {
    const selector = { $or: [{ _id: userId }, { userId }] };
    const update = saved && saved.present
      ? { $set: { [key]: saved.value } }
      : { $unset: { [key]: "" } };
    const result = collection("users").updateOne(selector, update);
    if (result.matchedCount !== 1) {
      fail(`could not restore '${key}' for user '${userId}'.`);
    }
  }

  function scopedSpecs() {
    return [
      { collection: "events", selector: { $or: [{ _id: EVENT_ID }, { sourceId: EVENT_ID }] } },
      { collection: "activityMembers", selector: { ownerType: "event", ownerId: EVENT_ID } },
      { collection: "eventCheckoutBasketItems", selector: { sourceId: EVENT_ID } },
      { collection: "payments", selector: { sourceId: EVENT_ID } },
      { collection: "eventTickets", selector: { eventId: EVENT_ID } },
      { collection: "eventTicketAudit", selector: { eventId: EVENT_ID } }
    ];
  }

  function scopedArtifactCount() {
    return scopedSpecs().reduce(
      (sum, spec) => sum + collection(spec.collection).countDocuments(spec.selector),
      0
    );
  }

  function beginSnapshot(targetUser, hostUser) {
    if (collection(SNAPSHOT_COLLECTION).findOne({ _id: SNAPSHOT_ID })) {
      fail("fixture is already prepared; use 'replay' to restore and prepare it again.");
    }
    if (scopedArtifactCount() !== 0) {
      fail("fixture-scoped records exist without an active snapshot; refusing to overwrite them.");
    }
    const snapshots = scopedSpecs().map(spec => ({
      collection: spec.collection,
      selector: spec.selector,
      documents: collection(spec.collection).find(spec.selector).toArray()
    }));
    collection(SNAPSHOT_COLLECTION).insertOne({
      _id: SNAPSHOT_ID,
      fixture: PREFIX,
      database: db.getName(),
      targetUserId,
      hostUserId,
      preparedAtIso: new Date().toISOString(),
      userFields: [targetUser, hostUser].map(user => ({
        userId: text(user.userId || user._id),
        activities: snapshotField(user, "activities"),
        paymentSpentTotals: snapshotField(user, "paymentSpentTotals")
      })),
      snapshots
    });
  }

  function chatSelector() {
    return { $or: [{ eventId: EVENT_ID }, { ownerId: EVENT_ID }] };
  }

  function notificationSelector(ids) {
    return { $or: [
      { entityId: { $in: ids } },
      { sourceId: { $in: ids } },
      { "payload.eventId": EVENT_ID },
      { "payload.sourceId": EVENT_ID },
      { "payload.parentEventId": EVENT_ID },
      { "payload.chatId": { $in: ids } }
    ] };
  }

  function removeCurrentEffects() {
    const paymentIds = collection("payments")
      .find({ sourceId: EVENT_ID }, { projection: { _id: 1 } })
      .map(item => text(item._id))
      .toArray()
      .filter(Boolean);
    const chats = collection("chats").find(chatSelector()).toArray();
    const chatIds = [...new Set(chats.flatMap(chat => [
      text(chat._id),
      text(chat.id),
      text(chat.chatId)
    ]).filter(Boolean))];
    const notificationIds = [...new Set([EVENT_ID, ...chatIds])];

    if (paymentIds.length > 0) {
      collection("payment_gateway_operations").deleteMany({ paymentId: { $in: paymentIds } });
    }
    if (chatIds.length > 0) {
      collection("chatMessages").deleteMany({ chatId: { $in: chatIds } });
    }
    collection("notificationOutbox").deleteMany(notificationSelector(notificationIds));
    collection("userNotifications").deleteMany(notificationSelector(notificationIds));
    collection("chats").deleteMany(chatSelector());

    for (const spec of scopedSpecs()) {
      collection(spec.collection).deleteMany(spec.selector);
    }
  }

  function restoreSnapshot(snapshot) {
    removeCurrentEffects();
    for (const saved of snapshot.snapshots || []) {
      const target = collection(saved.collection);
      target.deleteMany(saved.selector);
      if ((saved.documents || []).length > 0) {
        target.insertMany(saved.documents);
      }
    }
    for (const user of snapshot.userFields || []) {
      restoreField(text(user.userId), "activities", user.activities);
      restoreField(text(user.userId), "paymentSpentTotals", user.paymentSpentTotals);
    }
    // A notification worker may have consumed an event-scoped outbox row while
    // reset was running. Re-apply the exact fixture boundary once after restore.
    const chatIds = [EVENT_ID];
    collection("notificationOutbox").deleteMany(notificationSelector(chatIds));
    collection("userNotifications").deleteMany(notificationSelector(chatIds));
    collection(SNAPSHOT_COLLECTION).deleteOne({ _id: SNAPSHOT_ID });
  }

  function activePaymentMethods() {
    return collection("savedPaymentMethods").find({
      userId: targetUserId,
      status: "active",
      providerPaymentMethodRef: { $exists: true, $nin: [null, ""] }
    }).sort({ _id: 1 }).toArray();
  }

  function prepare() {
    const targetUser = userById(targetUserId, "smoke user");
    const hostUser = userById(hostUserId, "event host");
    if (targetUserId === hostUserId) {
      fail("smoke user and event host must be different users.");
    }
    const methods = activePaymentMethods();
    if (methods.length === 0) {
      fail(`smoke user '${targetUserId}' has no active tokenized payment method.`);
    }
    beginSnapshot(targetUser, hostUser);

    const now = new Date();
    const start = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const expires = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    const nowIso = now.toISOString();
    const timeframe = displayTimeframe(start, end);
    const hostName = text(hostUser.name) || hostUserId;
    const hostInitials = text(hostUser.initials)
      || hostName.split(/\s+/).slice(0, 2).map(part => part.slice(0, 1)).join("").toUpperCase();
    const targetCoordinates = targetUser.locationCoordinates || {};
    const latitude = Number.isFinite(Number(targetCoordinates.latitude))
      ? Number(targetCoordinates.latitude)
      : 47.6062;
    const longitude = Number.isFinite(Number(targetCoordinates.longitude))
      ? Number(targetCoordinates.longitude)
      : -122.3321;
    const targetCity = text(targetUser.city) || "Smoke venue";

    collection("events").insertOne({
      _id: EVENT_ID,
      syncKey: `${PREFIX}:event-sync`,
      sourceId: EVENT_ID,
      ownerUserId: hostUserId,
      status: "A",
      admins: [hostUserId],
      avatar: hostInitials,
      title: TITLE,
      subtitle: "Replayable smoke record prepared directly at payment assignment.",
      timeframe,
      inviter: null,
      unread: 0,
      activity: 0,
      expired: false,
      feedbackCountersProjected: false,
      feedbackOwnEventCountersProjected: false,
      feedbackOwnEventCounterUserIds: [],
      trashedAtIso: null,
      creatorUserId: hostUserId,
      creatorName: hostName,
      creatorInitials: hostInitials,
      creatorGender: text(hostUser.gender),
      creatorCity: text(hostUser.city),
      organizerUserId: hostUserId,
      visibility: "Public",
      blindMode: "Visible Event",
      startAtIso: start.toISOString(),
      endAtIso: end.toISOString(),
      distanceKm: 0,
      imageUrl: "/media/public?key=images/demo-events/event-004/v1/large.webp",
      sourceLink: `https://example.com/smoke/${encodeURIComponent(EVENT_ID)}`,
      location: `${targetCity} · payment smoke venue`,
      locationCoordinates: { latitude, longitude },
      locationGeo: { type: "Point", coordinates: [longitude, latitude] },
      capacityMin: 1,
      capacityMax: 8,
      capacityTotal: 8,
      full: false,
      autoInviter: false,
      frequency: "Once",
      ticketing: true,
      approvalRequired: false,
      pricing: {
        mode: "fixed",
        basePrice: PRICE,
        currency: CURRENCY,
        taxMode: "excluded",
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
        enabled: true
      },
      policiesEnabled: false,
      policies: [],
      slotsEnabled: false,
      slotTemplates: [],
      parentEventId: null,
      parentSubEventId: null,
      groupId: null,
      slotTemplateId: null,
      generated: false,
      eventType: "main",
      upcomingSlots: [],
      acceptedMembers: 1,
      pendingMembers: 0,
      acceptedMemberUserIds: [hostUserId],
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [],
      topics: ["#SmokeTest", "#Payment"],
      subEventsEnabled: false,
      subEventDefinitions: [],
      subEvents: [],
      mode: "Casual",
      rating: 0,
      boost: 0,
      affinity: 0,
      createdDate: nowIso,
      createdUser: PREFIX,
      updatedDate: nowIso,
      updatedUser: PREFIX
    });

    collection("activityMembers").insertOne({
      _id: HOST_MEMBER_ID,
      syncKey: `${PREFIX}:member-host-sync`,
      ownerType: "event",
      ownerId: EVENT_ID,
      userId: hostUserId,
      role: "Admin",
      status: "accepted",
      pendingSource: null,
      requestKind: null,
      invitedByUserId: null,
      metAtIso: nowIso,
      actionAtIso: nowIso,
      metWhere: TITLE,
      createdDate: nowIso,
      createdUser: PREFIX,
      updatedDate: nowIso,
      updatedUser: PREFIX
    });

    collection("eventCheckoutBasketItems").insertOne({
      _id: BASKET_ID,
      itemId: `event:${EVENT_ID}:main`,
      userId: targetUserId,
      sourceId: EVENT_ID,
      kind: "event",
      slotSourceId: "",
      slotTemplateId: "",
      selectedDateKey: "",
      subEventId: "",
      resourceType: "",
      label: TITLE,
      detail: timeframe,
      amount: PRICE,
      currency: CURRENCY,
      quantity: 1,
      status: "confirmed",
      resultState: "pending",
      reservationActive: true,
      // This is inserted after the normal selection phase, so it intentionally
      // does not alter the global expiry-job pending counter.
      pendingCounterTracked: false,
      pricingSummaryRows: [{
        key: "base",
        label: "pricing.base.price",
        detail: null,
        amount: PRICE,
        currency: CURRENCY,
        multiplier: 1
      }],
      appliedPromoCodes: [],
      checkoutSessionId: "",
      createdAtIso: nowIso,
      updatedAtIso: nowIso,
      expiresAtIso: expires.toISOString()
    });

    printObject({
      smoke: PREFIX,
      phase: "payment-ready",
      database: db.getName(),
      event: { id: EVENT_ID, title: TITLE, amount: PRICE, currency: CURRENCY },
      user: { id: targetUserId, name: text(targetUser.name), activePaymentMethods: methods.length },
      host: { id: hostUserId, name: hostName },
      expiresAtIso: expires.toISOString(),
      next: "As Alex Turner, open Event Explore, find 'SMOKE · Event payment ready', then Continue booking. Select a card; Payment stays disabled until assignment."
    });
  }

  function status() {
    const event = collection("events").findOne({ sourceId: EVENT_ID, ownerUserId: hostUserId });
    const basket = collection("eventCheckoutBasketItems")
      .find({ sourceId: EVENT_ID, userId: targetUserId })
      .sort({ createdAtIso: 1 })
      .toArray();
    const payments = collection("payments")
      .find({ sourceId: EVENT_ID, userId: targetUserId })
      .sort({ createdDate: 1 })
      .toArray();
    const membership = collection("activityMembers").findOne({
      ownerType: "event",
      ownerId: EVENT_ID,
      userId: targetUserId
    });
    printObject({
      smoke: PREFIX,
      snapshotActive: Boolean(collection(SNAPSHOT_COLLECTION).findOne({ _id: SNAPSHOT_ID })),
      event: event ? {
        id: text(event.sourceId),
        title: text(event.title),
        status: text(event.status),
        acceptedMembers: Number(event.acceptedMembers || 0)
      } : null,
      basket: basket.map(item => ({
        id: text(item._id),
        status: text(item.status),
        resultState: text(item.resultState),
        amount: Number(item.amount || 0),
        currency: text(item.currency),
        checkoutSessionId: text(item.checkoutSessionId),
        expiresAtIso: text(item.expiresAtIso)
      })),
      payment: payments.map(item => ({
        id: text(item._id),
        checkoutSessionId: text(item.checkoutSessionId),
        paymentMethodId: text(item.paymentMethodId),
        provider: text(item.provider),
        status: text(item.status),
        fulfillmentStatus: text(item.fulfillmentStatus),
        amount: Number(item.amount || 0),
        currency: text(item.currency)
      })),
      membership: membership ? {
        id: text(membership._id),
        status: text(membership.status),
        role: text(membership.role)
      } : null,
      assigned: payments.some(item => Boolean(text(item.paymentMethodId))),
      paid: payments.some(item => ["captured", "approved"].includes(text(item.status))),
      activePaymentMethods: activePaymentMethods().map(item => ({
        id: text(item._id),
        provider: text(item.provider),
        last4: text(item.last4)
      }))
    });
  }

  function refreshDisplay() {
    const event = collection("events").findOne({ sourceId: EVENT_ID, ownerUserId: hostUserId });
    if (!event) {
      fail("fixture event does not exist; run 'prepare' first.");
    }
    const start = new Date(text(event.startAtIso));
    const end = new Date(text(event.endAtIso));
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      fail("fixture event start/end timestamps are invalid.");
    }
    const timeframe = displayTimeframe(start, end);
    collection("events").updateOne(
      { sourceId: EVENT_ID, ownerUserId: hostUserId },
      { $set: { timeframe, updatedDate: new Date().toISOString(), updatedUser: PREFIX } }
    );
    const basketUpdate = collection("eventCheckoutBasketItems").updateMany(
      { sourceId: EVENT_ID, userId: targetUserId },
      { $set: { detail: timeframe } }
    );
    printObject({
      smoke: PREFIX,
      phase: "display-refreshed",
      database: db.getName(),
      timeframe,
      basketItemsUpdated: basketUpdate.modifiedCount
    });
  }

  function reset() {
    const snapshot = collection(SNAPSHOT_COLLECTION).findOne({ _id: SNAPSHOT_ID });
    if (!snapshot) {
      fail("no active snapshot exists; refusing an unsnapshotted reset.");
    }
    restoreSnapshot(snapshot);
    printObject({
      smoke: PREFIX,
      phase: "reset",
      database: db.getName(),
      restored: true,
      remainingScopedArtifacts: scopedArtifactCount()
    });
  }

  assertDeploymentSafety();
  if (!targetUserId || !hostUserId) {
    fail("both SMOKE_USER_ID and SMOKE_HOST_ID are required.");
  }
  if (command === "prepare") {
    prepare();
  } else if (command === "status") {
    status();
  } else if (command === "refresh-display") {
    refreshDisplay();
  } else if (command === "reset") {
    reset();
  } else if (command === "replay") {
    const snapshot = collection(SNAPSHOT_COLLECTION).findOne({ _id: SNAPSHOT_ID });
    if (snapshot) {
      restoreSnapshot(snapshot);
    } else if (scopedArtifactCount() !== 0) {
      fail("fixture artifacts exist without a snapshot; refusing destructive replay.");
    }
    prepare();
  } else {
    fail(`unsupported command '${command}'.`);
  }
})();
