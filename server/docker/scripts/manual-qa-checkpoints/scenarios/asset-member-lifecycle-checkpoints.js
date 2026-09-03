/* global ManualQa, db, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "asset-member-lifecycle";
  const CHECKPOINT = "ASSET-MEMBER-001";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const PREFIX = "manual-qa-checkpoint:v1:asset-member-lifecycle";
  const STATE_ID = Q.stateId(SCENARIO);
  const EVENT_ID = `${PREFIX}:event`;
  const STAGE_ID = `${EVENT_ID}:stage:membership`;
  const GROUP_A_ID = `${STAGE_ID}:group:1`;
  const GROUP_B_ID = `${STAGE_ID}:group:2`;
  const RESOURCE_OWNER_ID = `${EVENT_ID}:${STAGE_ID}:${GROUP_A_ID}`;
  const ASSET_ID = `${PREFIX}:asset:transport`;
  const MANUAL_REQUEST_ID = `${PREFIX}:request:manual-assignment`;
  const CASEY_ID = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID)
    || "650000000000000000000061";
  const NOVA_ID = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID)
    || "650000000000000000000062";
  const RILEY_ID = "650000000000000000000063";
  const LINA_ID = "178e8d0cbe164fa3fede5884";
  const USERS = [CASEY_ID, NOVA_ID, RILEY_ID, LINA_ID];
  const EVENT_TITLE = "QA ASSET-MEMBER-001 Tournament";
  const STAGE_TITLE = "QA Membership Stage";
  const ASSET_TITLE = "QA ASSET-MEMBER-001 Group Transport";
  const SERVICE_CHAT_ID = `c-service-asset-${ASSET_ID}-${STAGE_ID}-${RILEY_ID}`;
  const CONTROLLED_CHAT_MESSAGE = "QA ASSET-MEMBER-001: Riley asks Casey about the assigned Transport.";
  const NOTIFICATION_TYPES = [
    "asset-member-invite",
    "asset-admin-join-request",
    "asset-invitation-accepted",
    "asset-member-request-accepted",
    "asset-member-removed",
    "asset-manager-promoted"
  ];

  function state(required = true) {
    const value = Q.collection(Q.STATE_COLLECTION).findOne({ _id: STATE_ID });
    if (!value && required) Q.fail(`${CHECKPOINT} is not staged.`);
    return value;
  }

  function dateIso(offsetMinutes) {
    return new Date(Date.now() + offsetMinutes * 60000).toISOString();
  }

  function sorted(values) {
    return [...new Set((values || []).map(Q.text).filter(Boolean))].sort();
  }

  function compareText(left, right) {
    const normalizedLeft = Q.text(left);
    const normalizedRight = Q.text(right);
    return normalizedLeft < normalizedRight ? -1 : normalizedLeft > normalizedRight ? 1 : 0;
  }

  function compareMembershipRows(left, right) {
    return compareText(left.ownerType, right.ownerType)
      || compareText(left.ownerId, right.ownerId)
      || compareText(left.userId, right.userId);
  }

  function disabledAssetPricingDocument() {
    return {
      mode: "fixed",
      basePrice: 0,
      currency: "USD",
      taxMode: "excluded",
      chargeType: "per_attendee",
      quantityRulesEnabled: false,
      quantityRules: [],
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
        promoCodes: [],
        soldOutLabel: "Show \"Sold Out\""
      },
      enabled: false
    };
  }

  function userActivities(userId) {
    const user = Q.ensureUser(userId, `${CHECKPOINT} user`);
    return {
      userId,
      present: Object.prototype.hasOwnProperty.call(user, "activities"),
      value: user.activities || {}
    };
  }

  function restoreUserActivities(saved) {
    const selector = { $or: [{ _id: saved.userId }, { userId: saved.userId }] };
    if (saved.present) {
      Q.collection("users").updateOne(selector, { $set: { activities: saved.value } });
    } else {
      Q.collection("users").updateOne(selector, { $unset: { activities: "" } });
    }
  }

  function applyEventCounterDelta(userId, hosting) {
    const increments = hosting
      ? { "activities.hosting": 1, "activities.event.all": 1, "activities.event.hosting": 1 }
      : { "activities.events": 1, "activities.event.all": 1, "activities.event.active": 1 };
    const result = Q.collection("users").updateOne(
      { $or: [{ _id: userId }, { userId }] },
      { $inc: increments }
    );
    if (result.matchedCount !== 1) Q.fail(`${CHECKPOINT} counter user '${userId}' disappeared.`);
  }

  function statusCode(value) {
    switch (Q.text(value).toLowerCase()) {
      case "active": return "A";
      case "trashed": return "T";
      case "deleted": return "D";
      case "inactive": return "I";
      default: return Q.text(value) || "A";
    }
  }

  function authoritativeAssetCounters(userId) {
    const counts = { Transport: 0, Accommodation: 0, Supplies: 0 };
    Q.collection("assets").find({ ownerUserId: userId }).forEach(asset => {
      const type = Q.text(asset.type);
      if (statusCode(asset.status) === "A" && Object.prototype.hasOwnProperty.call(counts, type)) {
        counts[type] += 1;
      }
    });
    return counts;
  }

  function synchronizeAssetCounters(userId) {
    const counts = authoritativeAssetCounters(userId);
    const result = Q.collection("users").updateOne(
      { $or: [{ _id: userId }, { userId }] },
      { $set: {
        "activities.cars": counts.Transport,
        "activities.accommodation": counts.Accommodation,
        "activities.supplies": counts.Supplies,
        "activities.asset.cars": counts.Transport,
        "activities.asset.accommodation": counts.Accommodation,
        "activities.asset.supplies": counts.Supplies
      } }
    );
    if (result.matchedCount !== 1) Q.fail(`${CHECKPOINT} could not synchronize Casey's Asset counters.`);
  }

  function eventMember(ownerType, ownerId, userId, role, stagedAtIso, suffix) {
    const id = `${PREFIX}:member:${suffix}:${userId}`;
    return {
      _id: id,
      syncKey: id,
      ownerType,
      ownerId,
      userId,
      role,
      status: "accepted",
      pendingSource: null,
      requestKind: null,
      invitedByUserId: null,
      actionAtIso: stagedAtIso,
      metAtIso: stagedAtIso,
      metWhere: EVENT_TITLE,
      createdDate: stagedAtIso,
      createdUser: CASEY_ID,
      updatedDate: stagedAtIso,
      updatedUser: CASEY_ID
    };
  }

  function stageDefinition(stagedAtIso, startAtIso, endAtIso) {
    return {
      id: STAGE_ID,
      name: STAGE_TITLE,
      description: "Generated-group Asset member lifecycle checkpoint",
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: 300,
      startAt: startAtIso,
      endAt: endAtIso,
      optional: false,
      capacityMin: 4,
      capacityMax: 4,
      tournamentGroupCapacityMin: 1,
      tournamentGroupCapacityMax: 3,
      tournamentLeaderboardType: "Score",
      tournamentAdvancePerGroup: 1,
      stageStatus: "A",
      stageStatusReason: "stage-started",
      stageStatusUpdatedAt: stagedAtIso,
      membersAccepted: 4,
      membersPending: 0,
      groupsPending: 0,
      carsAccepted: 1,
      carsPending: 0,
      carsCapacityMin: 0,
      carsCapacityMax: 4,
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

  function eventDocument(stagedAtIso, startAtIso, endAtIso) {
    const stage = stageDefinition(stagedAtIso, startAtIso, endAtIso);
    const definition = { ...stage };
    for (const key of [
      "stageStatus", "stageStatusReason", "stageStatusUpdatedAt", "membersAccepted", "membersPending",
      "groupsCount", "groupsPending", "carsAccepted", "carsPending", "carsCapacityMin", "carsCapacityMax",
      "accommodationAccepted", "accommodationPending", "accommodationCapacityMin", "accommodationCapacityMax",
      "suppliesAccepted", "suppliesPending", "suppliesCapacityMin", "suppliesCapacityMax"
    ]) delete definition[key];
    return {
      _id: EVENT_ID,
      sourceId: EVENT_ID,
      syncKey: EVENT_ID,
      title: EVENT_TITLE,
      subtitle: "Generated-group Asset membership lifecycle",
      status: "A",
      published: true,
      isTrashed: false,
      ownerUserId: CASEY_ID,
      creatorUserId: CASEY_ID,
      creatorName: Q.text(Q.ensureUser(CASEY_ID, "Casey").name),
      creatorInitials: Q.text(Q.ensureUser(CASEY_ID, "Casey").initials),
      organizerUserId: CASEY_ID,
      admins: [CASEY_ID],
      visibility: "Invitation only",
      blindMode: "Open Event",
      autoInviter: false,
      ticketing: false,
      approvalRequired: false,
      mode: "Tournament",
      capacityMin: 4,
      capacityMax: 4,
      capacityTotal: 4,
      full: true,
      acceptedMembers: 4,
      pendingMembers: 0,
      acceptedMemberUserIds: USERS,
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [],
      subEventsEnabled: true,
      subEventDefinitions: [definition],
      subEvents: [stage],
      currentStage: { id: STAGE_ID, name: STAGE_TITLE, stageNumber: 1, totalStages: 1, status: "A" },
      eventType: "event",
      topics: ["Manual QA", "Asset", "Membership"],
      startAtIso,
      endAtIso,
      activity: 0,
      createdDate: stagedAtIso,
      createdUser: CASEY_ID,
      updatedDate: stagedAtIso,
      updatedUser: CASEY_ID
    };
  }

  function booking(startAtIso, endAtIso) {
    return {
      eventId: RESOURCE_OWNER_ID,
      eventTitle: EVENT_TITLE,
      subEventId: STAGE_ID,
      subEventTitle: STAGE_TITLE,
      slotKey: STAGE_ID,
      slotLabel: STAGE_TITLE,
      timeframe: "Generated Group A active window",
      startAtIso,
      endAtIso,
      quantity: 1,
      totalAmount: null,
      previousTotalAmount: null,
      currency: null,
      acceptedPolicyIds: [],
      paymentSessionId: null,
      inventoryApplied: null
    };
  }

  function requestRecord(id, userId, status, requestKind, note, requestedAtIso, startAtIso, endAtIso) {
    const user = Q.ensureUser(userId, `${CHECKPOINT} request user`);
    return {
      _id: id,
      userId,
      name: Q.text(user.name),
      initials: Q.text(user.initials),
      gender: Q.text(user.gender),
      status,
      note,
      requestKind,
      requestedAtIso,
      booking: booking(startAtIso, endAtIso)
    };
  }

  function assetDocument(stagedAtIso, startAtIso, endAtIso) {
    return {
      _id: ASSET_ID,
      _class: "com.raxim.myscoutee.profile.data.document.Asset",
      syncKey: ASSET_ID,
      assetId: ASSET_ID,
      ownerUserId: CASEY_ID,
      type: "Transport",
      title: ASSET_TITLE,
      subtitle: "One generated-group Invite and Join control",
      category: "Van",
      city: "Austin",
      capacityTotal: 4,
      quantity: 1,
      details: "Controlled generated-group Asset member lifecycle.",
      imageUrl: "",
      sourceLink: "https://example.com/qa/asset-member-001/transport",
      routes: ["Austin"],
      policiesEnabled: false,
      policies: [],
      pricing: disabledAssetPricingDocument(),
      requests: [requestRecord(
        MANUAL_REQUEST_ID,
        CASEY_ID,
        "accepted",
        "manual",
        "Reserved and assigned by the owner.",
        stagedAtIso,
        startAtIso,
        endAtIso
      )],
      visibility: "Public",
      status: "A",
      createdDate: stagedAtIso,
      createdUser: CASEY_ID,
      updatedDate: stagedAtIso,
      updatedUser: CASEY_ID
    };
  }

  function requestProjection(request, stagedAtIso) {
    const requestId = Q.text(request._id || request.id);
    return {
      _id: `${ASSET_ID}:request:${requestId}`,
      requestId,
      assetId: ASSET_ID,
      ownerUserId: CASEY_ID,
      ownerKey: `asset:${ASSET_ID}`,
      assetCapacity: 4,
      userId: request.userId,
      name: request.name,
      initials: request.initials,
      gender: request.gender,
      status: request.status,
      note: request.note,
      requestKind: request.requestKind,
      requestedAtIso: request.requestedAtIso,
      booking: request.booking,
      menuActions: [],
      createdDate: stagedAtIso,
      updatedDate: stagedAtIso
    };
  }

  function zeroMetric() {
    return { accepted: 0, pending: 0, capacityMin: 0, capacityMax: 0 };
  }

  function resourceMetric(accepted, pending) {
    return { accepted, pending, capacityMin: 0, capacityMax: 4 };
  }

  function resourceDocument(stagedAtIso, accepted = 1, pending = 0) {
    return {
      _id: `${PREFIX}:resource:casey`,
      syncKey: `${PREFIX}:resource:casey`,
      recordId: `${CASEY_ID}:${RESOURCE_OWNER_ID}:${STAGE_ID}`,
      ownerKey: `${CASEY_ID}:${RESOURCE_OWNER_ID}`,
      status: "A",
      ownerId: RESOURCE_OWNER_ID,
      subEventId: STAGE_ID,
      assetOwnerUserId: CASEY_ID,
      assetAssignmentIds: { Transport: [ASSET_ID] },
      assetSettingsByType: {
        Transport: {
          [ASSET_ID]: {
            capacityMin: 0,
            capacityMax: 4,
            quantity: 1,
            addedByUserId: CASEY_ID,
            routeEnabled: true,
            routes: ["Austin"]
          }
        }
      },
      supplyContributionEntriesByAssetId: {},
      resourceMetricsByType: {
        Transport: resourceMetric(accepted, pending),
        Accommodation: zeroMetric(),
        Supplies: zeroMetric()
      },
      createdDate: stagedAtIso,
      createdUser: CASEY_ID,
      updatedDate: stagedAtIso,
      updatedUser: CASEY_ID
    };
  }

  function runtimeDocument(stagedAtIso) {
    return {
      _id: `${PREFIX}:runtime`,
      syncKey: `${PREFIX}:runtime`,
      recordId: `${EVENT_ID}:${STAGE_ID}`,
      status: "A",
      ownerId: EVENT_ID,
      subEventId: STAGE_ID,
      stageStatus: "A",
      stageStatusReason: "stage-started",
      stageStatusUpdatedAt: stagedAtIso,
      groupsCount: 2,
      groupResourceMetricsByAssetOwnerId: {
        [GROUP_A_ID]: {
          [CASEY_ID]: {
            Transport: resourceMetric(1, 0),
            Accommodation: zeroMetric(),
            Supplies: zeroMetric()
          }
        }
      },
      groupResourceReadAtByUserId: {},
      createdDate: stagedAtIso,
      createdUser: CASEY_ID,
      updatedDate: stagedAtIso,
      updatedUser: CASEY_ID
    };
  }

  function relatedSelector() {
    return { $or: [
      { entityId: { $in: [ASSET_ID, EVENT_ID] } },
      { sourceId: { $in: [ASSET_ID, EVENT_ID] } },
      { "payload.assetId": ASSET_ID },
      { "payload.eventId": { $in: [EVENT_ID, RESOURCE_OWNER_ID] } },
      { targetId: { $in: [ASSET_ID, EVENT_ID] } },
      { ownerId: { $regex: `^${PREFIX}` } }
    ] };
  }

  function selectors() {
    return [
      { collection: "events", selector: { $or: [{ _id: EVENT_ID }, { sourceId: EVENT_ID }] } },
      { collection: "activityMembers", selector: { ownerId: { $in: [EVENT_ID, GROUP_A_ID, GROUP_B_ID, ASSET_ID] } } },
      { collection: "activitySubEventGroups", selector: { ownerId: { $regex: `^${PREFIX}` } } },
      { collection: "activitySubEventStageRuntime", selector: { ownerId: EVENT_ID, subEventId: STAGE_ID } },
      { collection: "eventLeaderboardEntries", selector: { eventId: EVENT_ID } },
      { collection: "activityResources", selector: { $or: [
        { ownerId: RESOURCE_OWNER_ID },
        { "assetAssignmentIds.Transport": ASSET_ID }
      ] } },
      { collection: "assets", selector: { $or: [{ _id: ASSET_ID }, { assetId: ASSET_ID }] } },
      { collection: "assetRequests", selector: { assetId: ASSET_ID } },
      { collection: "chats", selector: { id: SERVICE_CHAT_ID } },
      { collection: "chatMessages", selector: { chatId: SERVICE_CHAT_ID } },
      { collection: "notificationOutbox", selector: relatedSelector() },
      { collection: "userNotifications", selector: relatedSelector() },
      { collection: "affinityRecomputeTasks", selector: { targetId: { $in: [ASSET_ID, EVENT_ID] } } }
    ];
  }

  function collisionSummary() {
    return selectors().map(spec => ({
      collection: spec.collection,
      count: Q.collection(spec.collection).countDocuments(spec.selector)
    })).filter(item => item.count > 0);
  }

  function clearFixture() {
    for (const spec of selectors()) Q.collection(spec.collection).deleteMany(spec.selector);
  }

  function normalizedMembershipDocuments() {
    return Q.collection("activityMembers").find({
      ownerId: { $in: [EVENT_ID, GROUP_A_ID, GROUP_B_ID] }
    }).toArray().map(member => ({
      id: Q.text(member._id),
      syncKey: Q.text(member.syncKey),
      ownerType: Q.text(member.ownerType),
      ownerId: Q.text(member.ownerId),
      userId: Q.text(member.userId),
      role: Q.text(member.role),
      status: Q.text(member.status),
      pendingSource: member.pendingSource == null ? null : Q.text(member.pendingSource),
      requestKind: member.requestKind == null ? null : Q.text(member.requestKind),
      invitedByUserId: member.invitedByUserId == null ? null : Q.text(member.invitedByUserId),
      actionAtIso: Q.text(member.actionAtIso),
      metAtIso: Q.text(member.metAtIso),
      metWhere: Q.text(member.metWhere),
      createdDate: Q.text(member.createdDate),
      createdUser: Q.text(member.createdUser),
      updatedDate: Q.text(member.updatedDate),
      updatedUser: Q.text(member.updatedUser)
    })).sort(compareMembershipRows);
  }

  function eventRoleRows() {
    return normalizedMembershipDocuments().map(member => ({
      ownerType: member.ownerType,
      ownerId: member.ownerId,
      userId: member.userId,
      role: member.role,
      status: member.status
    }));
  }

  function membershipFingerprints() {
    return normalizedMembershipDocuments().map(member => JSON.stringify(member));
  }

  function expectedRoleRows() {
    return [
      ...USERS.map(userId => ({
        ownerType: "event",
        ownerId: EVENT_ID,
        userId,
        role: userId === CASEY_ID ? "Admin" : "Member",
        status: "accepted"
      })),
      ...[CASEY_ID, NOVA_ID, RILEY_ID].map(userId => ({
        ownerType: "group",
        ownerId: GROUP_A_ID,
        userId,
        role: "Member",
        status: "accepted"
      })),
      {
        ownerType: "group",
        ownerId: GROUP_B_ID,
        userId: LINA_ID,
        role: "Member",
        status: "accepted"
      }
    ].sort(compareMembershipRows);
  }

  function requestRows() {
    const asset = Q.collection("assets").findOne({ assetId: ASSET_ID }) || {};
    return (asset.requests || []).map(request => ({
      id: Q.text(request.id || request._id || request.requestId),
      userId: Q.text(request.userId),
      name: Q.text(request.name),
      status: Q.text(request.status),
      note: Q.text(request.note),
      requestKind: Q.text(request.requestKind),
      requestedAtIso: Q.text(request.requestedAtIso),
      booking: {
        eventId: Q.text(request.booking && request.booking.eventId),
        eventTitle: Q.text(request.booking && request.booking.eventTitle),
        subEventId: Q.text(request.booking && request.booking.subEventId),
        subEventTitle: Q.text(request.booking && request.booking.subEventTitle),
        slotKey: Q.text(request.booking && request.booking.slotKey),
        slotLabel: Q.text(request.booking && request.booking.slotLabel),
        timeframe: Q.text(request.booking && request.booking.timeframe),
        startAtIso: Q.text(request.booking && request.booking.startAtIso),
        endAtIso: Q.text(request.booking && request.booking.endAtIso),
        quantity: Q.number(request.booking && request.booking.quantity),
        inventoryApplied: request.booking && request.booking.inventoryApplied === true
      }
    })).sort((left, right) => left.userId.localeCompare(right.userId));
  }

  function projectionRows() {
    return Q.collection("assetRequests").find({ assetId: ASSET_ID })
      .sort({ userId: 1 }).toArray().map(request => ({
        id: Q.text(request._id),
        requestId: Q.text(request.requestId),
        assetId: Q.text(request.assetId),
        ownerUserId: Q.text(request.ownerUserId),
        ownerKey: Q.text(request.ownerKey),
        assetCapacity: Q.number(request.assetCapacity),
        userId: Q.text(request.userId),
        name: Q.text(request.name),
        status: Q.text(request.status),
        note: Q.text(request.note),
        requestKind: Q.text(request.requestKind),
        bookingEventId: Q.text(request.booking && request.booking.eventId),
        bookingSubEventId: Q.text(request.booking && request.booking.subEventId),
        bookingSlotKey: Q.text(request.booking && request.booking.slotKey),
        menuActions: sorted(request.menuActions || [])
      }));
  }

  function metric(value) {
    return {
      accepted: Q.number(value && value.accepted),
      pending: Q.number(value && value.pending),
      capacityMin: Q.number(value && value.capacityMin),
      capacityMax: Q.number(value && value.capacityMax)
    };
  }

  function resourceSnapshot() {
    const records = Q.collection("activityResources").find({ ownerId: RESOURCE_OWNER_ID, subEventId: STAGE_ID }).toArray();
    const record = records[0] || {};
    const settings = (((record.assetSettingsByType || {}).Transport || {})[ASSET_ID]) || {};
    return {
      count: records.length,
      ownerId: Q.text(record.ownerId),
      subEventId: Q.text(record.subEventId),
      assetOwnerUserId: Q.text(record.assetOwnerUserId),
      assignedTransportIds: sorted(((record.assetAssignmentIds || {}).Transport) || []),
      settings: {
        capacityMin: Q.number(settings.capacityMin),
        capacityMax: Q.number(settings.capacityMax),
        quantity: Q.number(settings.quantity),
        addedByUserId: Q.text(settings.addedByUserId)
      },
      transport: metric((record.resourceMetricsByType || {}).Transport),
      accommodation: metric((record.resourceMetricsByType || {}).Accommodation),
      supplies: metric((record.resourceMetricsByType || {}).Supplies)
    };
  }

  function runtimeSnapshot() {
    const runtime = Q.collection("activitySubEventStageRuntime").findOne({ ownerId: EVENT_ID, subEventId: STAGE_ID }) || {};
    const groupMetrics = runtime.groupResourceMetricsByAssetOwnerId || {};
    const groupAOwners = groupMetrics[GROUP_A_ID] || {};
    const caseyMetrics = groupAOwners[CASEY_ID] || {};
    return {
      count: Q.collection("activitySubEventStageRuntime").countDocuments({ ownerId: EVENT_ID, subEventId: STAGE_ID }),
      groupsCount: Q.number(runtime.groupsCount),
      groupIds: sorted(Object.keys(groupMetrics)),
      groupAAssetOwnerIds: sorted(Object.keys(groupAOwners)),
      groupATransport: metric(caseyMetrics.Transport),
      groupBMetrics: groupMetrics[GROUP_B_ID] || {},
      readAtByGroup: runtime.groupResourceReadAtByUserId || {}
    };
  }

  function eventSnapshot() {
    const event = Q.collection("events").findOne({ sourceId: EVENT_ID }) || {};
    const stage = (event.subEvents || []).find(item => Q.text(item && item.id) === STAGE_ID) || {};
    return {
      count: Q.collection("events").countDocuments({ sourceId: EVENT_ID }),
      title: Q.text(event.title),
      status: Q.text(event.status),
      mode: Q.text(event.mode),
      activity: Q.number(event.activity),
      acceptedMembers: Q.number(event.acceptedMembers),
      pendingMembers: Q.number(event.pendingMembers),
      acceptedMemberUserIds: sorted(event.acceptedMemberUserIds || []),
      admins: sorted(event.admins || []),
      stage: {
        id: Q.text(stage.id),
        title: Q.text(stage.name),
        stageStatus: Q.text(stage.stageStatus),
        groupsCount: Q.number(stage.groupsCount),
        groupsPending: Q.number(stage.groupsPending)
      }
    };
  }

  function assetMemberRows() {
    return Q.collection("activityMembers").find({ ownerType: "asset", ownerId: ASSET_ID })
      .sort({ userId: 1 }).toArray().map(member => ({
        id: Q.text(member._id),
        userId: Q.text(member.userId),
        role: Q.text(member.role),
        status: Q.text(member.status),
        pendingSource: member.pendingSource == null ? null : Q.text(member.pendingSource),
        requestKind: member.requestKind == null ? null : Q.text(member.requestKind),
        invitedByUserId: member.invitedByUserId == null ? null : Q.text(member.invitedByUserId),
        createdUser: Q.text(member.createdUser),
        updatedUser: Q.text(member.updatedUser)
      }));
  }

  function outboxRows() {
    return Q.collection("notificationOutbox").find({
      notificationType: { $in: NOTIFICATION_TYPES },
      entityId: ASSET_ID
    }).sort({ createdDate: 1 }).toArray().map(item => ({
      id: Q.text(item._id),
      notificationType: Q.text(item.notificationType),
      entityType: Q.text(item.entityType),
      entityId: Q.text(item.entityId),
      recipients: sorted(item.recipientUserIds || []),
      status: Q.text(item.status),
      tag: Q.text(item.tag),
      actorUserId: Q.text(item.payload && item.payload.actorUserId),
      senderUserId: Q.text(item.payload && item.payload.senderUserId),
      targetUserId: Q.text(item.payload && item.payload.targetUserId),
      memberUserId: Q.text(item.payload && item.payload.memberUserId),
      requestId: Q.text(item.payload && item.payload.requestId),
      requestKind: Q.text(item.payload && item.payload.requestKind),
      eventId: Q.text(item.payload && item.payload.eventId),
      subEventId: Q.text(item.payload && item.payload.subEventId),
      assetId: Q.text(item.payload && item.payload.assetId),
      membershipAction: Q.text(item.payload && item.payload.membershipAction),
      createdUser: Q.text(item.createdUser)
    }));
  }

  function inboxRows() {
    return Q.collection("userNotifications").find({
      kind: { $in: NOTIFICATION_TYPES },
      sourceId: ASSET_ID
    }).sort({ createdDate: 1 }).toArray().map(item => ({
      id: Q.text(item._id),
      recipientUserId: Q.text(item.recipientUserId),
      kind: Q.text(item.kind),
      sourceType: Q.text(item.sourceType),
      sourceId: Q.text(item.sourceId),
      senderUserId: Q.text(item.senderUserId),
      actorUserId: Q.text(item.payload && item.payload.actorUserId),
      targetUserId: Q.text(item.payload && item.payload.targetUserId),
      memberUserId: Q.text(item.payload && item.payload.memberUserId),
      requestId: Q.text(item.payload && item.payload.requestId),
      requestKind: Q.text(item.payload && item.payload.requestKind),
      eventId: Q.text(item.payload && item.payload.eventId),
      subEventId: Q.text(item.payload && item.payload.subEventId),
      assetId: Q.text(item.payload && item.payload.assetId),
      membershipAction: Q.text(item.payload && item.payload.membershipAction),
      occurrenceCount: Q.number(item.occurrenceCount)
    }));
  }

  function serviceChatSnapshot() {
    const rows = Q.collection("chats").find({ id: SERVICE_CHAT_ID })
      .sort({ ownerUserId: 1 }).toArray().map(item => ({
        id: Q.text(item.id),
        ownerUserId: Q.text(item.ownerUserId),
        title: Q.text(item.title),
        channelType: Q.text(item.channelType),
        ownerId: Q.text(item.ownerId),
        eventId: Q.text(item.eventId),
        subEventId: Q.text(item.subEventId),
        memberIds: sorted(item.memberIds || [])
      }));
    const controlledMessages = Q.collection("chatMessages").find({
      chatId: SERVICE_CHAT_ID,
      text: CONTROLLED_CHAT_MESSAGE
    }).sort({ sentAtIso: 1 }).toArray().map(item => ({
      id: Q.text(item.id),
      clientId: Q.text(item.clientId),
      chatId: Q.text(item.chatId),
      senderUserId: Q.text(item.senderAvatar && item.senderAvatar.id),
      text: Q.text(item.text),
      attachmentCount: (item.attachments || []).length
    }));
    return { rows, controlledMessages };
  }

  function taskRows() {
    return Q.collection("affinityRecomputeTasks").find({ targetId: ASSET_ID })
      .sort({ createdDate: 1 }).toArray().map(item => ({
        id: Q.text(item._id),
        taskKey: Q.text(item.taskKey),
        targetType: Q.text(item.targetType),
        targetId: Q.text(item.targetId),
        reasons: sorted(item.reasons || []),
        status: Q.text(item.status).toLowerCase(),
        lastError: Q.text(item.lastError)
      }));
  }

  function oracle() {
    const asset = Q.collection("assets").findOne({ assetId: ASSET_ID }) || {};
    return {
      actors: USERS.map(userId => Q.user(userId)),
      event: eventSnapshot(),
      roles: eventRoleRows(),
      asset: {
        count: Q.collection("assets").countDocuments({ assetId: ASSET_ID }),
        assetId: Q.text(asset.assetId),
        ownerUserId: Q.text(asset.ownerUserId),
        type: Q.text(asset.type),
        title: Q.text(asset.title),
        category: Q.text(asset.category),
        capacityTotal: Q.number(asset.capacityTotal),
        quantity: Q.number(asset.quantity),
        status: Q.text(asset.status),
        requestRows: requestRows()
      },
      requestProjections: projectionRows(),
      assetMembers: assetMemberRows(),
      resource: resourceSnapshot(),
      runtime: runtimeSnapshot(),
      serviceChat: serviceChatSnapshot(),
      outbox: outboxRows(),
      inbox: inboxRows(),
      affinityTasks: taskRows()
    };
  }

  function expectedMetric(accepted, pending) {
    return { accepted, pending, capacityMin: 0, capacityMax: 4 };
  }

  function exactBookingScope(row, currentState) {
    return row
      && row.booking.eventId === RESOURCE_OWNER_ID
      && row.booking.eventTitle === EVENT_TITLE
      && row.booking.subEventId === STAGE_ID
      && row.booking.subEventTitle === STAGE_TITLE
      && row.booking.slotKey === STAGE_ID
      && row.booking.slotLabel === STAGE_TITLE
      && row.booking.startAtIso === Q.text(currentState.context.startAtIso)
      && row.booking.endAtIso === Q.text(currentState.context.endAtIso)
      && row.booking.quantity === 1
      && row.booking.inventoryApplied === false;
  }

  function exactProjection(request, projection) {
    return request && projection
      && projection.id === `${ASSET_ID}:request:${request.id}`
      && projection.requestId === request.id
      && projection.assetId === ASSET_ID
      && projection.ownerUserId === CASEY_ID
      && projection.ownerKey === `asset:${ASSET_ID}`
      && projection.assetCapacity === 4
      && projection.userId === request.userId
      && projection.name === request.name
      && projection.status === request.status
      && projection.note === request.note
      && projection.requestKind === request.requestKind
      && projection.bookingEventId === RESOURCE_OWNER_ID
      && projection.bookingSubEventId === STAGE_ID
      && projection.bookingSlotKey === STAGE_ID;
  }

  function exactControlledServiceChat(current) {
    const chatRows = current.serviceChat.rows;
    const controlled = current.serviceChat.controlledMessages;
    return chatRows.length === 2
      && Q.sameJson(chatRows.map(row => row.ownerUserId), sorted([CASEY_ID, RILEY_ID]))
      && chatRows.every(row => row.id === SERVICE_CHAT_ID
        && row.title === `Asset Service · ${ASSET_TITLE}`
        && row.channelType === "serviceEvent"
        && row.ownerId === EVENT_ID
        && row.eventId === EVENT_ID
        && row.subEventId === STAGE_ID
        && Q.sameJson(row.memberIds, sorted([CASEY_ID, RILEY_ID])))
      && controlled.length === 1
      && controlled[0].chatId === SERVICE_CHAT_ID
      && controlled[0].senderUserId === RILEY_ID
      && controlled[0].text === CONTROLLED_CHAT_MESSAGE
      && controlled[0].attachmentCount === 0;
  }

  function commonChecks(currentState, current, accepted, pending) {
    const expectedRoles = expectedRoleRows();
    return {
      exactRootEvent: current.event.count === 1
        && current.event.title === EVENT_TITLE
        && current.event.status === "A"
        && current.event.mode === "Tournament"
        && current.event.acceptedMembers === 4
        && current.event.pendingMembers === 0
        && Q.sameJson(current.event.acceptedMemberUserIds, sorted(USERS))
        && Q.sameJson(current.event.admins, [CASEY_ID])
        && current.event.stage.id === STAGE_ID
        && current.event.stage.title === STAGE_TITLE
        && current.event.stage.stageStatus === "A",
      exactExpectedEventAndGroupRoles: Q.sameJson(current.roles, expectedRoles),
      byteIdenticalEventAndGroupMemberships: Q.sameJson(
        membershipFingerprints(),
        currentState.baselineMembershipFingerprints
      ),
      exactAssetIdentity: current.asset.count === 1
        && current.asset.assetId === ASSET_ID
        && current.asset.ownerUserId === CASEY_ID
        && current.asset.type === "Transport"
        && current.asset.title === ASSET_TITLE
        && current.asset.category === "Van"
        && current.asset.capacityTotal === 4
        && current.asset.quantity === 1
        && current.asset.status === "A",
      exactAssignedResource: current.resource.count === 1
        && current.resource.ownerId === RESOURCE_OWNER_ID
        && current.resource.subEventId === STAGE_ID
        && current.resource.assetOwnerUserId === CASEY_ID
        && Q.sameJson(current.resource.assignedTransportIds, [ASSET_ID])
        && current.resource.settings.capacityMin === 0
        && current.resource.settings.capacityMax === 4
        && current.resource.settings.quantity === 1
        && current.resource.settings.addedByUserId === CASEY_ID
        && Q.sameJson(current.resource.transport, expectedMetric(accepted, pending))
        && Q.sameJson(current.resource.accommodation, zeroMetric())
        && Q.sameJson(current.resource.supplies, zeroMetric()),
      exactGeneratedGroupRuntime: current.runtime.count === 1
        && current.runtime.groupsCount === 2
        && Q.sameJson(current.runtime.groupIds, [GROUP_A_ID])
        && Q.sameJson(current.runtime.groupAAssetOwnerIds, [CASEY_ID])
        && Q.sameJson(current.runtime.groupATransport, expectedMetric(accepted, pending))
        && Object.keys(current.runtime.groupBMetrics).length === 0,
      exactRootPendingProjection: current.event.activity === pending
        && current.event.stage.groupsPending === pending
    };
  }

  function verifyChecks(label, checks, current) {
    const failed = Object.entries(checks).filter(([, value]) => !value).map(([key]) => key);
    if (failed.length > 0) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId: CHECKPOINT,
        phase: `${label}-diagnostic`,
        failed,
        oracle: current
      });
      Q.fail(`${CHECKPOINT} ${label} checks failed: ${failed.join(", ")}.`);
    }
    return checks;
  }

  function baselineChecks(currentState, current) {
    const common = commonChecks(currentState, current, 1, 0);
    const manual = current.asset.requestRows[0] || null;
    const projection = current.requestProjections[0] || null;
    return {
      ...common,
      exactManualAssignment: current.asset.requestRows.length === 1
        && manual.userId === CASEY_ID
        && manual.status === "accepted"
        && manual.requestKind === "manual"
        && exactBookingScope(manual, currentState),
      exactManualProjection: current.requestProjections.length === 1
        && exactProjection(manual, projection),
      noAssetManagerYet: current.assetMembers.length === 0,
      noPrematureServiceChat: current.serviceChat.rows.length === 0
        && current.serviceChat.controlledMessages.length === 0,
      noPrematureNotifications: current.outbox.length === 0 && current.inbox.length === 0,
      noPrematureAffinityTask: current.affinityTasks.length === 0
    };
  }

  function pendingChecks(currentState, current) {
    const common = commonChecks(currentState, current, 1, 2);
    const requestsByUser = new Map(current.asset.requestRows.map(row => [row.userId, row]));
    const projectionsByUser = new Map(current.requestProjections.map(row => [row.userId, row]));
    const manual = requestsByUser.get(CASEY_ID);
    const invite = requestsByUser.get(NOVA_ID);
    const join = requestsByUser.get(RILEY_ID);
    const task = current.affinityTasks[0] || null;
    const inviteOutbox = current.outbox.find(row => row.notificationType === "asset-member-invite") || null;
    const joinOutbox = current.outbox.find(row => row.notificationType === "asset-admin-join-request") || null;
    const inviteInbox = current.inbox.find(row => row.kind === "asset-member-invite") || null;
    const joinInbox = current.inbox.find(row => row.kind === "asset-admin-join-request") || null;
    return {
      ...common,
      exactThreeScopedRequests: current.asset.requestRows.length === 3
        && manual?.status === "accepted"
        && manual?.requestKind === "manual"
        && invite?.status === "pending"
        && invite?.requestKind === "invite"
        && join?.status === "pending"
        && join?.requestKind === "borrow"
        && invite.id !== join.id
        && exactBookingScope(manual, currentState)
        && exactBookingScope(invite, currentState)
        && exactBookingScope(join, currentState),
      exactActorNames: invite?.name === Q.text(Q.ensureUser(NOVA_ID, "Nova").name)
        && join?.name === Q.text(Q.ensureUser(RILEY_ID, "Riley").name),
      exactThreeRequestProjections: current.requestProjections.length === 3
        && exactProjection(manual, projectionsByUser.get(CASEY_ID))
        && exactProjection(invite, projectionsByUser.get(NOVA_ID))
        && exactProjection(join, projectionsByUser.get(RILEY_ID)),
      exactControlledServiceChat: exactControlledServiceChat(current),
      noPhysicalAssetMemberBeforePromotion: current.assetMembers.length === 0,
      exactScopedPendingNotifications: current.outbox.length === 2
        && inviteOutbox?.entityType === "asset"
        && inviteOutbox?.entityId === ASSET_ID
        && Q.sameJson(inviteOutbox?.recipients, [NOVA_ID])
        && inviteOutbox?.senderUserId === CASEY_ID
        && inviteOutbox?.memberUserId === NOVA_ID
        && inviteOutbox?.requestId === invite?.id
        && inviteOutbox?.requestKind === "invite"
        && inviteOutbox?.eventId === RESOURCE_OWNER_ID
        && inviteOutbox?.subEventId === STAGE_ID
        && inviteOutbox?.createdUser === CASEY_ID
        && joinOutbox?.entityType === "asset"
        && joinOutbox?.entityId === ASSET_ID
        && Q.sameJson(joinOutbox?.recipients, [CASEY_ID])
        && joinOutbox?.senderUserId === RILEY_ID
        && joinOutbox?.memberUserId === RILEY_ID
        && joinOutbox?.requestId === join?.id
        && joinOutbox?.requestKind === "borrow"
        && joinOutbox?.eventId === RESOURCE_OWNER_ID
        && joinOutbox?.subEventId === STAGE_ID
        && joinOutbox?.createdUser === RILEY_ID,
      exactScopedPendingInboxes: current.inbox.length === 2
        && inviteInbox?.recipientUserId === NOVA_ID
        && inviteInbox?.sourceType === "asset"
        && inviteInbox?.sourceId === ASSET_ID
        && inviteInbox?.senderUserId === CASEY_ID
        && inviteInbox?.memberUserId === NOVA_ID
        && inviteInbox?.requestId === invite?.id
        && inviteInbox?.occurrenceCount === 1
        && joinInbox?.recipientUserId === CASEY_ID
        && joinInbox?.sourceType === "asset"
        && joinInbox?.sourceId === ASSET_ID
        && joinInbox?.senderUserId === RILEY_ID
        && joinInbox?.memberUserId === RILEY_ID
        && joinInbox?.requestId === join?.id
        && joinInbox?.occurrenceCount === 1,
      oneCollapsedRequestTask: current.affinityTasks.length === 1
        && task.targetType === "ASSET"
        && task.targetId === ASSET_ID
        && task.reasons.includes("ASSET_REQUESTS_CHANGED")
        && ["pending", "running", "done"].includes(task.status)
        && !task.lastError
    };
  }

  function terminalChecks(currentState, current) {
    const common = commonChecks(currentState, current, 2, 0);
    const requestsByUser = new Map(current.asset.requestRows.map(row => [row.userId, row]));
    const projectionsByUser = new Map(current.requestProjections.map(row => [row.userId, row]));
    const manual = requestsByUser.get(CASEY_ID);
    const acceptedInvite = requestsByUser.get(NOVA_ID);
    const manager = current.assetMembers[0] || null;
    const task = current.affinityTasks[0] || null;
    const acceptedOutbox = current.outbox.find(row => row.notificationType === "asset-invitation-accepted") || null;
    const acceptedInbox = current.inbox.find(row => row.kind === "asset-invitation-accepted") || null;
    const requestAcceptedOutbox = current.outbox.find(row => row.notificationType === "asset-member-request-accepted") || null;
    const requestAcceptedInbox = current.inbox.find(row => row.kind === "asset-member-request-accepted") || null;
    const removedOutbox = current.outbox.find(row => row.notificationType === "asset-member-removed") || null;
    const removedInbox = current.inbox.find(row => row.kind === "asset-member-removed") || null;
    const outbox = current.outbox.find(row => row.notificationType === "asset-manager-promoted") || null;
    const inbox = current.inbox.find(row => row.kind === "asset-manager-promoted") || null;
    const inviteOutboxes = current.outbox.filter(row => row.notificationType === "asset-member-invite");
    const joinOutboxes = current.outbox.filter(row => row.notificationType === "asset-admin-join-request");
    const inviteInboxes = current.inbox.filter(row => row.kind === "asset-member-invite");
    const joinInboxes = current.inbox.filter(row => row.kind === "asset-admin-join-request");
    return {
      ...common,
      acceptedInviteAndRemovedJoinAreIndependent: current.asset.requestRows.length === 2
        && manual?.status === "accepted"
        && manual?.requestKind === "manual"
        && acceptedInvite?.status === "accepted"
        && acceptedInvite?.requestKind === "invite"
        && acceptedInvite?.note === "Promoted to asset manager."
        && !requestsByUser.has(RILEY_ID)
        && exactBookingScope(manual, currentState)
        && exactBookingScope(acceptedInvite, currentState),
      exactTerminalRequestProjections: current.requestProjections.length === 2
        && exactProjection(manual, projectionsByUser.get(CASEY_ID))
        && exactProjection(acceptedInvite, projectionsByUser.get(NOVA_ID))
        && !projectionsByUser.has(RILEY_ID),
      exactControlledServiceChat: exactControlledServiceChat(current),
      exactAssetManagerOnly: current.assetMembers.length === 1
        && manager.userId === NOVA_ID
        && manager.role === "Manager"
        && manager.status === "accepted"
        && manager.pendingSource === null
        && manager.requestKind === null
        && manager.invitedByUserId === null
        && manager.createdUser === CASEY_ID
        && manager.updatedUser === CASEY_ID,
      pendingNotificationsRemainSingleOccurrences: inviteOutboxes.length === 1
        && joinOutboxes.length === 1
        && inviteInboxes.length === 1
        && joinInboxes.length === 1
        && Q.sameJson(inviteOutboxes[0].recipients, [NOVA_ID])
        && Q.sameJson(joinOutboxes[0].recipients, [CASEY_ID])
        && inviteInboxes[0].recipientUserId === NOVA_ID
        && joinInboxes[0].recipientUserId === CASEY_ID
        && inviteInboxes[0].occurrenceCount === 1
        && joinInboxes[0].occurrenceCount === 1,
      exactInviteAcceptedOutbox: current.outbox.length === 6
        && acceptedOutbox?.entityType === "asset"
        && acceptedOutbox?.entityId === ASSET_ID
        && Q.sameJson(acceptedOutbox?.recipients, [CASEY_ID])
        && acceptedOutbox?.senderUserId === NOVA_ID
        && acceptedOutbox?.memberUserId === NOVA_ID
        && acceptedOutbox?.requestId === acceptedInvite?.id
        && acceptedOutbox?.requestKind === "invite"
        && acceptedOutbox?.membershipAction === "accepted"
        && acceptedOutbox?.eventId === RESOURCE_OWNER_ID
        && acceptedOutbox?.subEventId === STAGE_ID
        && acceptedOutbox?.createdUser === NOVA_ID,
      exactInviteAcceptedInbox: current.inbox.length === 6
        && acceptedInbox?.recipientUserId === CASEY_ID
        && acceptedInbox?.sourceType === "asset"
        && acceptedInbox?.sourceId === ASSET_ID
        && acceptedInbox?.senderUserId === NOVA_ID
        && acceptedInbox?.memberUserId === NOVA_ID
        && acceptedInbox?.requestId === acceptedInvite?.id
        && acceptedInbox?.requestKind === "invite"
        && acceptedInbox?.membershipAction === "accepted"
        && acceptedInbox?.eventId === RESOURCE_OWNER_ID
        && acceptedInbox?.subEventId === STAGE_ID
        && acceptedInbox?.occurrenceCount === 1,
      exactRileyAcceptedNotification: requestAcceptedOutbox?.entityType === "asset"
        && requestAcceptedOutbox?.entityId === ASSET_ID
        && Q.sameJson(requestAcceptedOutbox?.recipients, [RILEY_ID])
        && requestAcceptedOutbox?.senderUserId === CASEY_ID
        && requestAcceptedOutbox?.memberUserId === RILEY_ID
        && requestAcceptedOutbox?.requestKind === "borrow"
        && requestAcceptedOutbox?.eventId === RESOURCE_OWNER_ID
        && requestAcceptedOutbox?.subEventId === STAGE_ID
        && requestAcceptedOutbox?.membershipAction === "accepted"
        && requestAcceptedOutbox?.createdUser === CASEY_ID
        && requestAcceptedInbox?.recipientUserId === RILEY_ID
        && requestAcceptedInbox?.sourceType === "asset"
        && requestAcceptedInbox?.sourceId === ASSET_ID
        && requestAcceptedInbox?.senderUserId === CASEY_ID
        && requestAcceptedInbox?.memberUserId === RILEY_ID
        && requestAcceptedInbox?.requestId === requestAcceptedOutbox?.requestId
        && requestAcceptedInbox?.membershipAction === "accepted"
        && requestAcceptedInbox?.occurrenceCount === 1,
      exactRileyRemovedNotification: removedOutbox?.entityType === "asset"
        && removedOutbox?.entityId === ASSET_ID
        && Q.sameJson(removedOutbox?.recipients, [RILEY_ID])
        && removedOutbox?.senderUserId === CASEY_ID
        && removedOutbox?.memberUserId === RILEY_ID
        && removedOutbox?.requestId === requestAcceptedOutbox?.requestId
        && removedOutbox?.requestKind === "borrow"
        && removedOutbox?.eventId === RESOURCE_OWNER_ID
        && removedOutbox?.subEventId === STAGE_ID
        && removedOutbox?.membershipAction === "removed"
        && removedOutbox?.createdUser === CASEY_ID
        && removedInbox?.recipientUserId === RILEY_ID
        && removedInbox?.sourceType === "asset"
        && removedInbox?.sourceId === ASSET_ID
        && removedInbox?.senderUserId === CASEY_ID
        && removedInbox?.memberUserId === RILEY_ID
        && removedInbox?.requestId === removedOutbox?.requestId
        && removedInbox?.membershipAction === "removed"
        && removedInbox?.occurrenceCount === 1,
      oneCollapsedLifecycleTask: current.affinityTasks.length === 1
        && task.targetType === "ASSET"
        && task.targetId === ASSET_ID
        && task.reasons.includes("ASSET_REQUESTS_CHANGED")
        && task.reasons.includes("ASSET_CHANGED")
        && ["pending", "running", "done"].includes(task.status)
        && !task.lastError,
      exactManagerPromotionOutbox: current.outbox.length === 6
        && outbox.notificationType === "asset-manager-promoted"
        && outbox.entityType === "asset"
        && outbox.entityId === ASSET_ID
        && Q.sameJson(outbox.recipients, [NOVA_ID])
        && ["pending", "running", "sent"].includes(outbox.status)
        && outbox.tag === `asset-manager-promoted-${ASSET_ID}`
        && outbox.actorUserId === CASEY_ID
        && outbox.targetUserId === NOVA_ID
        && outbox.memberUserId === NOVA_ID
        && outbox.assetId === ASSET_ID
        && outbox.createdUser === CASEY_ID,
      exactManagerPromotionInbox: current.inbox.length === 6
        && inbox.recipientUserId === NOVA_ID
        && inbox.kind === "asset-manager-promoted"
        && inbox.sourceType === "asset"
        && inbox.sourceId === ASSET_ID
        && inbox.senderUserId === CASEY_ID
        && inbox.actorUserId === CASEY_ID
        && inbox.targetUserId === NOVA_ID
        && inbox.memberUserId === NOVA_ID
        && inbox.assetId === ASSET_ID
        && inbox.occurrenceCount === 1
    };
  }

  function stageFixture() {
    Q.assertDeploymentSafety();
    if (checkpointId !== CHECKPOINT) Q.fail(`this fixture is restricted to ${CHECKPOINT}.`);
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    USERS.forEach(userId => Q.ensureUser(userId, `${CHECKPOINT} actor`));
    const collisions = collisionSummary();
    if (collisions.length > 0) {
      Q.fail(`${CHECKPOINT} found stale target documents without a recoverable state: ${JSON.stringify(collisions)}.`);
    }

    const stagedAtIso = Q.nowIso();
    const startAtIso = dateIso(-60);
    const endAtIso = dateIso(240);
    const snapshots = Q.snapshotSpecs(selectors());
    const savedUserActivities = USERS.map(userActivities);
    const pendingState = {
      _id: STATE_ID,
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      database: db.getName(),
      phase: "staging",
      stagedAtIso,
      snapshots,
      savedUserActivities,
      context: {
        caseyUserId: CASEY_ID,
        novaUserId: NOVA_ID,
        rileyUserId: RILEY_ID,
        linaUserId: LINA_ID,
        eventId: EVENT_ID,
        stageId: STAGE_ID,
        groupAId: GROUP_A_ID,
        groupBId: GROUP_B_ID,
        resourceOwnerId: RESOURCE_OWNER_ID,
        assetId: ASSET_ID,
        manualRequestId: MANUAL_REQUEST_ID,
        startAtIso,
        endAtIso
      }
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(pendingState);

    try {
      const manualRequest = assetDocument(stagedAtIso, startAtIso, endAtIso).requests[0];
      Q.collection("events").insertOne(eventDocument(stagedAtIso, startAtIso, endAtIso));
      Q.collection("activityMembers").insertMany([
        ...USERS.map(userId => eventMember("event", EVENT_ID, userId, userId === CASEY_ID ? "Admin" : "Member", stagedAtIso, "root")),
        ...[CASEY_ID, NOVA_ID, RILEY_ID].map(userId => eventMember("group", GROUP_A_ID, userId, "Member", stagedAtIso, "group-a")),
        eventMember("group", GROUP_B_ID, LINA_ID, "Member", stagedAtIso, "group-b")
      ]);
      Q.collection("eventLeaderboardEntries").insertMany([
        ...[CASEY_ID, NOVA_ID, RILEY_ID].map((userId, index) => ({
          _id: `${PREFIX}:score:group-a:${userId}`,
          syncKey: `${PREFIX}:score:group-a:${userId}`,
          eventId: EVENT_ID,
          subEventId: STAGE_ID,
          groupId: GROUP_A_ID,
          entryType: "score",
          memberId: userId,
          scoreValue: 3 - index,
          note: `${CHECKPOINT} Group A control`,
          createdAtIso: stagedAtIso,
          createdUser: CASEY_ID,
          updatedDate: stagedAtIso,
          updatedUser: CASEY_ID
        })),
        {
          _id: `${PREFIX}:score:group-b:${LINA_ID}`,
          syncKey: `${PREFIX}:score:group-b:${LINA_ID}`,
          eventId: EVENT_ID,
          subEventId: STAGE_ID,
          groupId: GROUP_B_ID,
          entryType: "score",
          memberId: LINA_ID,
          scoreValue: 1,
          note: `${CHECKPOINT} Group B negative control`,
          createdAtIso: stagedAtIso,
          createdUser: CASEY_ID,
          updatedDate: stagedAtIso,
          updatedUser: CASEY_ID
        }
      ]);
      Q.collection("activitySubEventStageRuntime").insertOne(runtimeDocument(stagedAtIso));
      Q.collection("assets").insertOne(assetDocument(stagedAtIso, startAtIso, endAtIso));
      Q.collection("assetRequests").insertOne(requestProjection(manualRequest, stagedAtIso));
      Q.collection("activityResources").insertOne(resourceDocument(stagedAtIso));
      synchronizeAssetCounters(CASEY_ID);
      applyEventCounterDelta(CASEY_ID, true);
      [NOVA_ID, RILEY_ID, LINA_ID].forEach(userId => applyEventCounterDelta(userId, false));

      const baselineMembershipDocuments = normalizedMembershipDocuments();
      const baselineMembershipFingerprints = baselineMembershipDocuments.map(member => JSON.stringify(member));
      Q.collection(Q.STATE_COLLECTION).updateOne(
        { _id: STATE_ID, phase: "staging" },
        { $set: { phase: "baseline-ready", baselineMembershipDocuments, baselineMembershipFingerprints } }
      );
    } catch (error) {
      Q.fail(`${CHECKPOINT} stage failed after snapshot: ${Q.text(error && error.message)}. Run reset asset-domain ${CHECKPOINT}.`);
    }

    const currentState = state();
    const current = oracle();
    const checks = verifyChecks("baseline", baselineChecks(currentState, current), current);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: currentState.phase,
      identities: currentState.context,
      checks,
      oracle: current,
      next: "Open the managed Casey, Nova and Riley sessions. In Group A only, Casey creates one Invite for Nova and Riley creates one Join request."
    });
  }

  function status() {
    Q.assertDeploymentSafety();
    if (checkpointId !== CHECKPOINT) Q.fail(`this fixture is restricted to ${CHECKPOINT}.`);
    const currentState = state(false);
    if (!currentState) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId: CHECKPOINT,
        phase: "not-staged",
        next: `Run stage asset-domain ${CHECKPOINT}.`
      });
      return;
    }
    const current = oracle();
    let checks = null;
    if (currentState.phase === "baseline-ready") {
      checks = verifyChecks("baseline", baselineChecks(currentState, current), current);
    } else if (currentState.phase === "pending-verified") {
      checks = verifyChecks("pending", pendingChecks(currentState, current), current);
    } else if (currentState.phase === "terminal-verified") {
      checks = verifyChecks("terminal", terminalChecks(currentState, current), current);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: currentState.phase,
      identities: currentState.context,
      checks,
      oracle: current,
      next: nextAction(currentState.phase)
    });
  }

  function nextAction(phase) {
    if (phase === "baseline-ready") {
      return "Group A: Casey invites Nova once; Riley submits Join once; then report the pending savepoint phrase.";
    }
    if (phase === "pending-verified") {
      return "Accept Nova's Invite, then Casey accepts and removes Riley before promoting Nova to Asset Manager. Verify the recipient notifications, zero pending counters and role-gated member menus; reload the three actors once and report the terminal phrase.";
    }
    if (phase === "terminal-verified") {
      return "The consolidated ASSET-MEMBER-001/002 transaction is terminally verified and ready to record/reset.";
    }
    return `Unexpected phase '${Q.text(phase)}'; inspect status and do not continue in the UI.`;
  }

  function next() {
    Q.assertDeploymentSafety();
    const currentState = state();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: currentState.phase,
      identities: currentState.context,
      action: nextAction(currentState.phase)
    });
  }

  function verifyPending() {
    Q.assertDeploymentSafety();
    const currentState = state();
    if (currentState.phase !== "baseline-ready") {
      Q.fail(`${CHECKPOINT} pending verification requires phase 'baseline-ready', found '${Q.text(currentState.phase)}'.`);
    }
    const current = oracle();
    const checks = verifyChecks("pending", pendingChecks(currentState, current), current);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: STATE_ID, phase: "baseline-ready" },
      { $set: { phase: "pending-verified", pendingVerifiedAtIso: Q.nowIso(), pendingOracle: current } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "pending-verified",
      checks,
      oracle: current,
      next: nextAction("pending-verified")
    });
  }

  function verifyTerminal() {
    Q.assertDeploymentSafety();
    const currentState = state();
    if (currentState.phase !== "pending-verified") {
      Q.fail(`${CHECKPOINT} terminal verification requires phase 'pending-verified', found '${Q.text(currentState.phase)}'.`);
    }
    const current = oracle();
    const checks = verifyChecks("terminal", terminalChecks(currentState, current), current);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: STATE_ID, phase: "pending-verified" },
      { $set: { phase: "terminal-verified", terminalVerifiedAtIso: Q.nowIso(), terminalOracle: current } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "terminal-verified",
      checks,
      oracle: current,
      next: nextAction("terminal-verified")
    });
  }

  function reset() {
    Q.assertDeploymentSafety();
    const currentState = state();
    clearFixture();
    Q.restoreSnapshots(currentState.snapshots || []);
    for (const saved of currentState.savedUserActivities || []) restoreUserActivities(saved);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: STATE_ID });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "reset-complete",
      resetAtIso: Q.nowIso(),
      next: `Run status asset-domain ${CHECKPOINT}; expected phase is not-staged.`
    });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stageFixture(); break;
    case "status": status(); break;
    case "next": next(); break;
    case "verify-asset-member-pending": verifyPending(); break;
    case "verify-asset-member-terminal": verifyTerminal(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
