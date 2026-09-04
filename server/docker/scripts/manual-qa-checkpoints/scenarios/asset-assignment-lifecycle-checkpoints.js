/* global ManualQa, db, process, EJSON */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "asset-assignment";
  const CHECKPOINT = "ASSET-ASSIGNMENT-LIFECYCLE-001";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const PREFIX = "manual-qa-checkpoint:v1:asset-assignment";
  const STATE_ID = Q.stateId(SCENARIO);

  const CASEY_ID = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID)
    || "650000000000000000000061";
  const NOVA_ID = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID)
    || "650000000000000000000062";
  const RILEY_ID = "650000000000000000000063";
  const LINA_ID = "178e8d0cbe164fa3fede5884";
  const USERS = [CASEY_ID, NOVA_ID, RILEY_ID, LINA_ID];

  const NORMAL_EVENT_ID = `${PREFIX}:normal:event`;
  const NORMAL_TARGET_ID = `${NORMAL_EVENT_ID}:sub-event:assignment`;
  const NORMAL_CONTROL_ID = `${NORMAL_EVENT_ID}:sub-event:control`;
  const TOURNAMENT_EVENT_ID = `${PREFIX}:tournament:event`;
  const TOURNAMENT_STAGE_ID = `${TOURNAMENT_EVENT_ID}:stage:assignment`;
  const LEGACY_GROUP_A_ID = `${TOURNAMENT_STAGE_ID}:group:a`;
  const LEGACY_GROUP_B_ID = `${TOURNAMENT_STAGE_ID}:group:b`;
  const GROUP_A_ID = `${TOURNAMENT_STAGE_ID}:group:1`;
  const GROUP_B_ID = `${TOURNAMENT_STAGE_ID}:group:2`;
  const ROOM_A_ID = `random-room:${TOURNAMENT_EVENT_ID}:${TOURNAMENT_STAGE_ID}:${GROUP_A_ID}`;
  const ROOM_B_ID = `random-room:${TOURNAMENT_EVENT_ID}:${TOURNAMENT_STAGE_ID}:${GROUP_B_ID}`;
  const LEGACY_ROOM_A_ID = `random-room:${TOURNAMENT_EVENT_ID}:${TOURNAMENT_STAGE_ID}:${LEGACY_GROUP_A_ID}`;
  const LEGACY_ROOM_B_ID = `random-room:${TOURNAMENT_EVENT_ID}:${TOURNAMENT_STAGE_ID}:${LEGACY_GROUP_B_ID}`;
  const GROUP_A_RESOURCE_OWNER_ID = `${TOURNAMENT_EVENT_ID}:${TOURNAMENT_STAGE_ID}:${GROUP_A_ID}`;
  const GROUP_B_RESOURCE_OWNER_ID = `${TOURNAMENT_EVENT_ID}:${TOURNAMENT_STAGE_ID}:${GROUP_B_ID}`;
  const LEGACY_GROUP_A_RESOURCE_OWNER_ID = `${TOURNAMENT_EVENT_ID}:${TOURNAMENT_STAGE_ID}:${LEGACY_GROUP_A_ID}`;
  const LEGACY_GROUP_B_RESOURCE_OWNER_ID = `${TOURNAMENT_EVENT_ID}:${TOURNAMENT_STAGE_ID}:${LEGACY_GROUP_B_ID}`;

  const NORMAL_TRANSPORT_ID = `${PREFIX}:asset:normal:nova-transport`;
  const NORMAL_ACCOMMODATION_ID = `${PREFIX}:asset:normal:nova-accommodation`;
  const NORMAL_SUPPLIES_ID = `${PREFIX}:asset:normal:riley-supplies`;
  const GROUP_A_TRANSPORT_ID = `${PREFIX}:asset:group-a:nova-transport`;
  const GROUP_A_ACCOMMODATION_ID = `${PREFIX}:asset:group-a:riley-accommodation`;
  const GROUP_B_TRANSPORT_ID = `${PREFIX}:asset:group-b:lina-transport`;
  const ASSET_IDS = [
    NORMAL_TRANSPORT_ID,
    NORMAL_ACCOMMODATION_ID,
    NORMAL_SUPPLIES_ID,
    GROUP_A_TRANSPORT_ID,
    GROUP_A_ACCOMMODATION_ID,
    GROUP_B_TRANSPORT_ID
  ];

  const EVENT_IDS = [
    NORMAL_EVENT_ID,
    TOURNAMENT_EVENT_ID,
    ROOM_A_ID,
    ROOM_B_ID,
    LEGACY_ROOM_A_ID,
    LEGACY_ROOM_B_ID
  ];
  const MEMBER_OWNER_IDS = [
    NORMAL_EVENT_ID,
    TOURNAMENT_EVENT_ID,
    ROOM_A_ID,
    ROOM_B_ID,
    LEGACY_ROOM_A_ID,
    LEGACY_ROOM_B_ID,
    NORMAL_SUPPLIES_ID
  ];
  const GROUP_RESOURCE_OWNER_IDS = [GROUP_A_RESOURCE_OWNER_ID, GROUP_B_RESOURCE_OWNER_ID];
  const ALL_GROUP_RESOURCE_OWNER_IDS = [
    ...GROUP_RESOURCE_OWNER_IDS,
    LEGACY_GROUP_A_RESOURCE_OWNER_ID,
    LEGACY_GROUP_B_RESOURCE_OWNER_ID
  ];

  function state(required = true) {
    const value = Q.collection(Q.STATE_COLLECTION).findOne({ _id: STATE_ID });
    if (!value && required) Q.fail(`${CHECKPOINT} is not staged.`);
    return value;
  }

  function requirePhase(currentState, expected) {
    const phase = Q.text(currentState && currentState.phase);
    if (phase !== expected) {
      Q.fail(`${CHECKPOINT} requires phase '${expected}', found '${phase || "not-staged"}'.`);
    }
  }

  function dateIso(offsetMinutes) {
    return new Date(Date.now() + offsetMinutes * 60000).toISOString();
  }

  function clone(value) {
    return EJSON.parse(EJSON.stringify(value));
  }

  function canonicalDomain(value) {
    const plain = JSON.parse(EJSON.stringify(value, null, 0, { relaxed: true }));
    const normalize = current => {
      if (Array.isArray(current)) return current.map(normalize);
      if (!current || typeof current !== "object") return current;
      return Object.fromEntries(Object.keys(current).sort().map(key => [key, normalize(current[key])]));
    };
    return normalize(plain);
  }

  function sameDomain(left, right) {
    return Q.sameJson(canonicalDomain(left), canonicalDomain(right));
  }

  function sorted(values) {
    return [...new Set((values || []).map(Q.text).filter(Boolean))].sort();
  }

  function zeroMetric() {
    return { accepted: 0, pending: 0, capacityMin: 0, capacityMax: 0 };
  }

  function metric(accepted, pending, capacityMax, capacityMin = 0) {
    return { accepted, pending, capacityMin, capacityMax };
  }

  function metrics(transport = zeroMetric(), accommodation = zeroMetric(), supplies = zeroMetric()) {
    return {
      Transport: transport,
      Accommodation: accommodation,
      Supplies: supplies
    };
  }

  function disabledPricing() {
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
      audience: { enabled: false, promoCodes: [], soldOutLabel: "Show \"Sold Out\"" },
      enabled: false
    };
  }

  function booking(ownerId, subEventId, quantity, label, startAtIso, endAtIso) {
    return {
      eventId: ownerId,
      eventTitle: "QA ASSET-ASSIGNMENT-LIFECYCLE-001 Tournament",
      subEventId,
      subEventTitle: "QA Assignment Groups",
      slotKey: subEventId,
      slotLabel: "QA Assignment Groups",
      timeframe: label,
      startAtIso,
      endAtIso,
      quantity,
      totalAmount: 0,
      previousTotalAmount: null,
      currency: "USD",
      acceptedPolicyIds: [],
      paymentSessionId: null,
      inventoryApplied: false
    };
  }

  function request(id, userId, ownerId, subEventId, status, stagedAtIso, startAtIso, endAtIso) {
    const user = Q.ensureUser(userId, `${CHECKPOINT} request user`);
    return {
      _id: id,
      id,
      requestId: id,
      userId,
      name: Q.text(user.name),
      initials: Q.text(user.initials),
      gender: Q.text(user.gender),
      status,
      note: "Controlled generated-group assignment request.",
      requestKind: "borrow",
      requestedAtIso: stagedAtIso,
      booking: booking(ownerId, subEventId, 1, "QA Assignment Groups", startAtIso, endAtIso)
    };
  }

  function assetDocument(definition, stagedAtIso, requests = []) {
    const supplies = definition.type === "Supplies";
    const accommodation = definition.type === "Accommodation";
    return {
      _id: definition.id,
      _class: "com.raxim.myscoutee.profile.data.document.Asset",
      syncKey: definition.id,
      assetId: definition.id,
      ownerUserId: definition.ownerId,
      type: definition.type,
      title: definition.title,
      subtitle: `${CHECKPOINT} controlled ${definition.type.toLowerCase()}`,
      category: definition.type === "Transport" ? "Sedan" : accommodation ? "Apartment" : "Safety",
      city: accommodation ? "Austin" : "",
      capacityTotal: definition.capacity,
      quantity: supplies ? definition.capacity : 1,
      details: "Controlled Asset assignment lifecycle record.",
      imageUrl: "",
      sourceLink: `https://example.com/qa/asset-assignment/${definition.id.split(":").pop()}`,
      routes: definition.type === "Transport" || accommodation ? ["Austin"] : [],
      policiesEnabled: false,
      policies: [],
      pricing: disabledPricing(),
      requests,
      visibility: "Public",
      status: "A",
      createdDate: stagedAtIso,
      createdUser: definition.ownerId,
      updatedDate: stagedAtIso,
      updatedUser: definition.ownerId
    };
  }

  function resourceSettings(capacityMax, addedByUserId, routeEnabled = false) {
    return {
      capacityMin: 0,
      capacityMax,
      quantity: 1,
      addedByUserId,
      routeEnabled,
      routes: routeEnabled ? ["Austin"] : []
    };
  }

  function groupResourceDocument(options, stagedAtIso) {
    const settings = resourceSettings(
      options.capacity,
      options.managerUserId,
      options.type === "Transport"
    );
    return {
      _id: `${PREFIX}:resource:${options.group}:${options.subjectUserId}`,
      syncKey: `${PREFIX}:resource:${options.group}:${options.subjectUserId}`,
      recordId: `${options.subjectUserId}:${options.ownerId}:${TOURNAMENT_STAGE_ID}`,
      ownerKey: `${options.subjectUserId}:${options.ownerId}`,
      status: "A",
      ownerId: options.ownerId,
      subEventId: TOURNAMENT_STAGE_ID,
      assetOwnerUserId: options.subjectUserId,
      assetAssignmentIds: { [options.type]: [options.assetId] },
      assetSettingsByType: { [options.type]: { [options.assetId]: settings } },
      supplyContributionEntriesByAssetId: {},
      resourceMetricsByType: metrics(
        options.type === "Transport" ? metric(options.accepted, options.pending, options.capacity) : zeroMetric(),
        options.type === "Accommodation" ? metric(options.accepted, options.pending, options.capacity) : zeroMetric(),
        zeroMetric()
      ),
      createdDate: stagedAtIso,
      createdUser: options.managerUserId,
      updatedDate: stagedAtIso,
      updatedUser: options.managerUserId
    };
  }

  function subEvent(id, name, optional, stagedAtIso) {
    return {
      id,
      name,
      description: `${CHECKPOINT} controlled Sub-event`,
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: 120,
      startAt: dateIso(60),
      endAt: dateIso(180),
      optional,
      capacityMin: 1,
      capacityMax: 4,
      stageStatus: "A",
      stageStatusReason: "manual-qa-active",
      stageStatusUpdatedAt: stagedAtIso,
      membersAccepted: 0,
      membersPending: 0,
      groupsCount: 0,
      groupsPending: 0,
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

  function definitionFromStage(stage) {
    const definition = clone(stage);
    for (const key of [
      "stageStatus", "stageStatusReason", "stageStatusUpdatedAt", "membersAccepted", "membersPending",
      "groupsCount", "groupsPending", "carsAccepted", "carsPending", "carsCapacityMin", "carsCapacityMax",
      "accommodationAccepted", "accommodationPending", "accommodationCapacityMin", "accommodationCapacityMax",
      "suppliesAccepted", "suppliesPending", "suppliesCapacityMin", "suppliesCapacityMax"
    ]) delete definition[key];
    return definition;
  }

  function normalEventDocuments(stagedAtIso) {
    const target = subEvent(NORMAL_TARGET_ID, "QA Assignment Stage", true, stagedAtIso);
    const control = subEvent(NORMAL_CONTROL_ID, "QA Unchanged Control Stage", true, stagedAtIso);
    const startAtIso = dateIso(30);
    const endAtIso = dateIso(240);
    const common = {
      sourceId: NORMAL_EVENT_ID,
      title: "QA ASSET-ASSIGNMENT-LIFECYCLE-001 Event",
      subtitle: "Normal Sub-event multi-owner assignment",
      status: "A",
      published: true,
      expired: false,
      isTrashed: false,
      creatorUserId: CASEY_ID,
      organizerUserId: CASEY_ID,
      creatorName: "Casey Bridge",
      creatorInitials: "CB",
      creatorCity: "Austin",
      admins: [CASEY_ID],
      visibility: "Invitation only",
      blindMode: "Open Event",
      autoInviter: false,
      ticketing: false,
      approvalRequired: false,
      capacityMin: 3,
      capacityMax: 3,
      capacityTotal: 3,
      full: true,
      acceptedMembers: 3,
      pendingMembers: 0,
      acceptedMemberUserIds: [CASEY_ID, NOVA_ID, RILEY_ID],
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [],
      mode: "Casual",
      subEventsEnabled: true,
      subEventDefinitions: [definitionFromStage(target), definitionFromStage(control)],
      subEvents: [target, control],
      eventType: "event",
      topics: ["Manual QA", "Asset", "Assignment"],
      startAtIso,
      endAtIso,
      activity: 0,
      createdDate: stagedAtIso,
      createdUser: CASEY_ID,
      updatedDate: stagedAtIso,
      updatedUser: CASEY_ID
    };
    return [CASEY_ID, NOVA_ID, RILEY_ID].map(userId => ({
      ...clone(common),
      _id: userId === CASEY_ID ? NORMAL_EVENT_ID : `${NORMAL_EVENT_ID}:overlay:${userId}`,
      syncKey: userId === CASEY_ID ? NORMAL_EVENT_ID : `${NORMAL_EVENT_ID}:overlay:${userId}`,
      ownerUserId: userId
    }));
  }

  function tournamentStage(stagedAtIso, startAtIso, endAtIso) {
    return {
      ...subEvent(TOURNAMENT_STAGE_ID, "QA Assignment Groups", false, stagedAtIso),
      startAt: startAtIso,
      endAt: endAtIso,
      durationMinutes: Math.max(1, Math.round((new Date(endAtIso).getTime() - new Date(startAtIso).getTime()) / 60000)),
      capacityMin: 4,
      capacityMax: 4,
      tournamentGroupCapacityMin: 1,
      tournamentGroupCapacityMax: 3,
      tournamentLeaderboardType: "Score",
      tournamentAdvancePerGroup: 1,
      membersAccepted: 4,
      groupsCount: 2,
      groupsPending: 2
    };
  }

  function tournamentEventDocuments(stagedAtIso, startAtIso, endAtIso) {
    const stage = tournamentStage(stagedAtIso, startAtIso, endAtIso);
    const common = {
      status: "A",
      published: true,
      expired: false,
      isTrashed: false,
      organizerUserId: CASEY_ID,
      visibility: "Invitation only",
      blindMode: "Open Event",
      autoInviter: false,
      ticketing: false,
      approvalRequired: false,
      capacityMin: 4,
      capacityMax: 4,
      capacityTotal: 4,
      full: true,
      pendingMembers: 0,
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [],
      mode: "Tournament",
      startAtIso,
      endAtIso,
      activity: 2,
      createdDate: stagedAtIso,
      createdUser: CASEY_ID,
      updatedDate: stagedAtIso,
      updatedUser: CASEY_ID
    };
    const root = {
      ...common,
      _id: TOURNAMENT_EVENT_ID,
      sourceId: TOURNAMENT_EVENT_ID,
      syncKey: TOURNAMENT_EVENT_ID,
      title: "QA ASSET-ASSIGNMENT-LIFECYCLE-001 Tournament",
      subtitle: "Generated-group mutation and cleanup",
      ownerUserId: CASEY_ID,
      creatorUserId: CASEY_ID,
      creatorName: "Casey Bridge",
      creatorInitials: "CB",
      creatorCity: "Austin",
      admins: [CASEY_ID],
      acceptedMembers: 4,
      acceptedMemberUserIds: USERS,
      subEventsEnabled: true,
      subEventDefinitions: [definitionFromStage(stage)],
      subEvents: [stage],
      currentStage: { id: TOURNAMENT_STAGE_ID, name: stage.name, stageNumber: 1, totalStages: 1, status: "A" },
      eventType: "event",
      topics: ["Manual QA", "Tournament", "Assignment"]
    };
    function room(roomId, groupId, title, memberIds) {
      return {
        ...clone(common),
        _id: roomId,
        sourceId: roomId,
        syncKey: `scheduler:${roomId}`,
        title,
        subtitle: `${CHECKPOINT} generated control room`,
        ownerUserId: null,
        creatorUserId: null,
        admins: [],
        acceptedMembers: memberIds.length,
        acceptedMemberUserIds: memberIds,
        subEventsEnabled: false,
        subEventDefinitions: [],
        subEvents: [],
        parentEventId: TOURNAMENT_EVENT_ID,
        parentSubEventId: TOURNAMENT_STAGE_ID,
        generated: true,
        eventType: "tournament-room",
        groupId,
        imageUrl: "/media/public?key=images/system/tournament-room/v1/large.webp",
        topics: ["Manual QA"]
      };
    }
    return [
      root,
      room(ROOM_A_ID, GROUP_A_ID, "Assignment Group A", [CASEY_ID, NOVA_ID, RILEY_ID]),
      room(ROOM_B_ID, GROUP_B_ID, "Assignment Group B", [LINA_ID])
    ];
  }

  function member(ownerId, userId, role, stagedAtIso, ownerType = "event") {
    const suffix = ownerId.replace(PREFIX, "").replaceAll(":", "-");
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
      metWhere: CHECKPOINT,
      createdDate: stagedAtIso,
      createdUser: CASEY_ID,
      updatedDate: stagedAtIso,
      updatedUser: CASEY_ID
    };
  }

  function requestProjection(asset, embeddedRequest, stagedAtIso) {
    return {
      _id: `${asset.id}:request:${embeddedRequest.requestId}`,
      requestId: embeddedRequest.requestId,
      assetId: asset.id,
      ownerUserId: asset.ownerId,
      ownerKey: `asset:${asset.id}`,
      assetCapacity: asset.capacity,
      userId: embeddedRequest.userId,
      name: embeddedRequest.name,
      initials: embeddedRequest.initials,
      gender: embeddedRequest.gender,
      status: embeddedRequest.status,
      note: embeddedRequest.note,
      requestKind: embeddedRequest.requestKind,
      requestedAtIso: embeddedRequest.requestedAtIso,
      booking: embeddedRequest.booking,
      menuActions: [],
      createdDate: stagedAtIso,
      updatedDate: stagedAtIso
    };
  }

  function runtimeDocument(stagedAtIso) {
    return {
      _id: `${PREFIX}:tournament:runtime`,
      syncKey: `${PREFIX}:tournament:runtime`,
      recordId: `${TOURNAMENT_EVENT_ID}:${TOURNAMENT_STAGE_ID}`,
      status: "A",
      ownerId: TOURNAMENT_EVENT_ID,
      subEventId: TOURNAMENT_STAGE_ID,
      stageStatus: "A",
      stageStatusReason: "stage-started",
      stageStatusUpdatedAt: stagedAtIso,
      groupsCount: 2,
      groupResourceMetricsByAssetOwnerId: {
        [GROUP_A_ID]: {
          [NOVA_ID]: metrics(metric(1, 1, 4), zeroMetric(), zeroMetric()),
          [RILEY_ID]: metrics(zeroMetric(), metric(1, 1, 3), zeroMetric())
        },
        [GROUP_B_ID]: {
          [LINA_ID]: metrics(metric(1, 0, 2), zeroMetric(), zeroMetric())
        }
      },
      groupResourceReadAtByUserId: {},
      createdDate: stagedAtIso,
      createdUser: CASEY_ID,
      updatedDate: stagedAtIso,
      updatedUser: CASEY_ID
    };
  }

  function leaderboardRows(stagedAtIso) {
    const groupA = [CASEY_ID, NOVA_ID, RILEY_ID];
    return [
      ...groupA.map((userId, index) => ({
        _id: `${PREFIX}:score:a:${userId}`,
        syncKey: `${PREFIX}:score:a:${userId}`,
        eventId: TOURNAMENT_EVENT_ID,
        subEventId: TOURNAMENT_STAGE_ID,
        groupId: GROUP_A_ID,
        entryType: "score",
        memberId: userId,
        scoreValue: 3 - index,
        note: `${CHECKPOINT} Group A`,
        createdAtIso: stagedAtIso,
        createdUser: CASEY_ID,
        updatedDate: stagedAtIso,
        updatedUser: CASEY_ID
      })),
      {
        _id: `${PREFIX}:score:b:${LINA_ID}`,
        syncKey: `${PREFIX}:score:b:${LINA_ID}`,
        eventId: TOURNAMENT_EVENT_ID,
        subEventId: TOURNAMENT_STAGE_ID,
        groupId: GROUP_B_ID,
        entryType: "score",
        memberId: LINA_ID,
        scoreValue: 1,
        note: `${CHECKPOINT} Group B control`,
        createdAtIso: stagedAtIso,
        createdUser: CASEY_ID,
        updatedDate: stagedAtIso,
        updatedUser: CASEY_ID
      }
    ];
  }

  function relatedSelector() {
    return { $or: [
      { sourceId: { $in: EVENT_IDS } },
      { parentEventId: TOURNAMENT_EVENT_ID },
      { eventId: { $in: [NORMAL_EVENT_ID, TOURNAMENT_EVENT_ID, ...ALL_GROUP_RESOURCE_OWNER_IDS] } },
      { ownerId: { $in: [...EVENT_IDS, ...MEMBER_OWNER_IDS, ...ALL_GROUP_RESOURCE_OWNER_IDS] } },
      { entityId: { $in: [...EVENT_IDS, ...ASSET_IDS] } },
      { "payload.eventId": { $in: [NORMAL_EVENT_ID, TOURNAMENT_EVENT_ID, ...ALL_GROUP_RESOURCE_OWNER_IDS] } },
      { "payload.assetId": { $in: ASSET_IDS } },
      { ownerId: { $regex: `^${PREFIX}` } },
      { entityId: { $regex: `^${PREFIX}` } }
    ] };
  }

  function selectors() {
    return [
      { collection: "assets", selector: { $or: [{ _id: { $in: ASSET_IDS } }, { assetId: { $in: ASSET_IDS } }] } },
      { collection: "events", selector: { $or: [{ sourceId: { $in: EVENT_IDS } }, { parentEventId: TOURNAMENT_EVENT_ID }] } },
      { collection: "activityMembers", selector: { ownerId: { $in: MEMBER_OWNER_IDS } } },
      { collection: "assetRequests", selector: { assetId: { $in: ASSET_IDS } } },
      { collection: "activityResources", selector: { ownerId: { $in: [NORMAL_EVENT_ID, ...ALL_GROUP_RESOURCE_OWNER_IDS] } } },
      { collection: "activitySubEventStageRuntime", selector: { ownerId: TOURNAMENT_EVENT_ID, subEventId: TOURNAMENT_STAGE_ID } },
      { collection: "eventLeaderboardEntries", selector: { eventId: TOURNAMENT_EVENT_ID } },
      { collection: "notificationOutbox", selector: relatedSelector() },
      { collection: "userNotifications", selector: relatedSelector() },
      { collection: "affinityRecomputeTasks", selector: relatedSelector() }
    ];
  }

  function clearFixture() {
    for (const spec of selectors()) Q.collection(spec.collection).deleteMany(spec.selector);
  }

  function userActivities(userId) {
    const user = Q.ensureUser(userId, `${CHECKPOINT} user`);
    return {
      userId,
      present: Object.prototype.hasOwnProperty.call(user, "activities"),
      value: clone(user.activities || {})
    };
  }

  function restoreUserActivities(saved) {
    const selector = { $or: [{ _id: saved.userId }, { userId: saved.userId }] };
    if (saved.present) Q.collection("users").updateOne(selector, { $set: { activities: saved.value } });
    else Q.collection("users").updateOne(selector, { $unset: { activities: "" } });
  }

  function applyEventCounterDelta(userId, hosting, count) {
    const increments = hosting
      ? { "activities.hosting": count, "activities.event.all": count, "activities.event.hosting": count }
      : { "activities.events": count, "activities.event.all": count, "activities.event.active": count };
    const result = Q.collection("users").updateOne(
      { $or: [{ _id: userId }, { userId }] },
      { $inc: increments }
    );
    if (result.matchedCount !== 1) Q.fail(`${CHECKPOINT} event counter user '${userId}' disappeared.`);
  }

  function synchronizeAssetCounters(userId) {
    const counts = { Transport: 0, Accommodation: 0, Supplies: 0 };
    for (const asset of Q.collection("assets").find({ ownerUserId: userId, status: "A" }).toArray()) {
      const type = Q.text(asset.type);
      if (Object.prototype.hasOwnProperty.call(counts, type)) counts[type] += 1;
    }
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
    if (result.matchedCount !== 1) Q.fail(`${CHECKPOINT} Asset counter user '${userId}' disappeared.`);
  }

  function read(collection, selector, sort = { _id: 1 }) {
    return Q.collection(collection).find(selector).sort(sort).toArray();
  }

  function subEventMetrics(item) {
    return {
      carsAccepted: Q.number(item && item.carsAccepted),
      carsPending: Q.number(item && item.carsPending),
      carsCapacityMin: Q.number(item && item.carsCapacityMin),
      carsCapacityMax: Q.number(item && item.carsCapacityMax),
      accommodationAccepted: Q.number(item && item.accommodationAccepted),
      accommodationPending: Q.number(item && item.accommodationPending),
      accommodationCapacityMin: Q.number(item && item.accommodationCapacityMin),
      accommodationCapacityMax: Q.number(item && item.accommodationCapacityMax),
      suppliesAccepted: Q.number(item && item.suppliesAccepted),
      suppliesPending: Q.number(item && item.suppliesPending),
      suppliesCapacityMin: Q.number(item && item.suppliesCapacityMin),
      suppliesCapacityMax: Q.number(item && item.suppliesCapacityMax),
      groupsPending: Q.number(item && item.groupsPending)
    };
  }

  function normalSnapshot() {
    const events = read("events", { sourceId: NORMAL_EVENT_ID });
    return {
      events: events.map(event => {
        const target = (event.subEvents || []).find(item => Q.text(item && item.id) === NORMAL_TARGET_ID);
        const control = (event.subEvents || []).find(item => Q.text(item && item.id) === NORMAL_CONTROL_ID);
        return {
          ownerUserId: Q.text(event.ownerUserId),
          status: Q.text(event.status),
          activity: Q.number(event.activity),
          target: subEventMetrics(target),
          control: subEventMetrics(control)
        };
      }).sort((left, right) => left.ownerUserId.localeCompare(right.ownerUserId)),
      members: read("activityMembers", { ownerType: "event", ownerId: NORMAL_EVENT_ID }).map(item => ({
        userId: Q.text(item.userId), role: Q.text(item.role), status: Q.text(item.status)
      })),
      assetMembers: read("activityMembers", { ownerType: "asset", ownerId: NORMAL_SUPPLIES_ID }).map(item => ({
        userId: Q.text(item.userId), role: Q.text(item.role), status: Q.text(item.status)
      })),
      resources: read("activityResources", { ownerId: NORMAL_EVENT_ID, subEventId: NORMAL_TARGET_ID }).map(item => ({
        status: Q.text(item.status),
        assetOwnerUserId: Q.text(item.assetOwnerUserId),
        assetAssignmentIds: item.assetAssignmentIds || {},
        assetSettingsByType: item.assetSettingsByType || {},
        supplyContributionEntriesByAssetId: item.supplyContributionEntriesByAssetId || {},
        resourceMetricsByType: item.resourceMetricsByType || {}
      })),
      controlResources: Q.collection("activityResources").countDocuments({ ownerId: NORMAL_EVENT_ID, subEventId: NORMAL_CONTROL_ID })
    };
  }

  function tournamentRoot() {
    return Q.collection("events").findOne({ sourceId: TOURNAMENT_EVENT_ID, eventType: "event" }) || {};
  }

  function runtime() {
    return Q.collection("activitySubEventStageRuntime")
      .findOne({ ownerId: TOURNAMENT_EVENT_ID, subEventId: TOURNAMENT_STAGE_ID }) || {};
  }

  function groupMetric(groupId, userId, type) {
    return (((((runtime().groupResourceMetricsByAssetOwnerId || {})[groupId]) || {})[userId] || {})[type]) || {};
  }

  function normalizedMetric(value) {
    return metric(
      Q.number(value && value.accepted),
      Q.number(value && value.pending),
      Q.number(value && value.capacityMax),
      Q.number(value && value.capacityMin)
    );
  }

  function groupResource(ownerId, userId) {
    return Q.collection("activityResources").findOne({
      ownerId,
      subEventId: TOURNAMENT_STAGE_ID,
      assetOwnerUserId: userId,
      status: { $ne: "D" }
    }) || null;
  }

  function stageCounters() {
    const root = tournamentRoot();
    const stage = (root.subEvents || []).find(item => Q.text(item && item.id) === TOURNAMENT_STAGE_ID) || {};
    return {
      activity: Q.number(root.activity),
      groupsCount: Q.number(runtime().groupsCount),
      groupsPending: Q.number(stage.groupsPending)
    };
  }

  function groupBControlSnapshot() {
    const currentRuntime = runtime();
    const groupBMetrics = ((((currentRuntime.groupResourceMetricsByAssetOwnerId || {})[GROUP_B_ID]) || {})[LINA_ID]) || {};
    return {
      room: read("events", { sourceId: ROOM_B_ID }),
      members: read("activityMembers", { ownerType: "event", ownerId: ROOM_B_ID }),
      resource: read("activityResources", { ownerId: GROUP_B_RESOURCE_OWNER_ID, subEventId: TOURNAMENT_STAGE_ID }),
      runtime: {
        [LINA_ID]: metrics(
          normalizedMetric(groupBMetrics.Transport),
          normalizedMetric(groupBMetrics.Accommodation),
          normalizedMetric(groupBMetrics.Supplies))
      },
      reads: clone(((currentRuntime.groupResourceReadAtByUserId || {})[GROUP_B_ID]) || {}),
      scores: read("eventLeaderboardEntries", { eventId: TOURNAMENT_EVENT_ID, groupId: GROUP_B_ID })
    };
  }

  function groupBranchDocuments() {
    return {
      events: read("events", { $or: [{ sourceId: TOURNAMENT_EVENT_ID }, { sourceId: { $in: [ROOM_A_ID, ROOM_B_ID] } }] }),
      members: read("activityMembers", { ownerId: { $in: [TOURNAMENT_EVENT_ID, ROOM_A_ID, ROOM_B_ID] } }),
      resources: read("activityResources", { ownerId: { $in: GROUP_RESOURCE_OWNER_IDS } }),
      runtime: read("activitySubEventStageRuntime", { ownerId: TOURNAMENT_EVENT_ID, subEventId: TOURNAMENT_STAGE_ID }),
      scores: read("eventLeaderboardEntries", { eventId: TOURNAMENT_EVENT_ID }),
      assets: read("assets", { assetId: { $in: [GROUP_A_TRANSPORT_ID, GROUP_A_ACCOMMODATION_ID, GROUP_B_TRANSPORT_ID] } }),
      requests: read("assetRequests", { assetId: { $in: [GROUP_A_TRANSPORT_ID, GROUP_A_ACCOMMODATION_ID, GROUP_B_TRANSPORT_ID] } })
    };
  }

  function restoreDocuments(collection, selector, documents) {
    Q.collection(collection).deleteMany(selector);
    if ((documents || []).length > 0) Q.collection(collection).insertMany(clone(documents));
  }

  function tournamentMembershipSnapshot() {
    return read("activityMembers", { ownerType: "event", ownerId: { $in: [TOURNAMENT_EVENT_ID, ROOM_A_ID, ROOM_B_ID] } })
      .map(item => ({ ownerId: Q.text(item.ownerId), userId: Q.text(item.userId), role: Q.text(item.role), status: Q.text(item.status) }));
  }

  function notificationCounts() {
    return {
      outbox: Q.collection("notificationOutbox").countDocuments(relatedSelector()),
      inbox: Q.collection("userNotifications").countDocuments(relatedSelector())
    };
  }

  function synchronizeNotificationCounter(userId) {
    const unreadNotifications = Q.collection("userNotifications").countDocuments({
      $and: [
        { $or: [{ recipientUserId: userId }, { userId }] },
        { $or: [{ readAtIso: { $exists: false } }, { readAtIso: null }] }
      ]
    });
    const result = Q.collection("users").updateOne(
      { $or: [{ _id: userId }, { userId }] },
      { $set: { "activities.notifications": unreadNotifications } }
    );
    if (result.matchedCount !== 1) {
      Q.fail(`${CHECKPOINT} notification counter user '${userId}' disappeared.`);
    }
  }

  function expectedNormalContributionRows(currentState) {
    return (((currentState.normalDomainAfterAssignment || {}).resources) || [])
      .flatMap(resource => ((((resource || {}).supplyContributionEntriesByAssetId || {})[NORMAL_SUPPLIES_ID]) || [])
        .map(entry => ({
          id: Q.text(entry && (entry.id || entry._id)),
          userId: Q.text(entry && entry.userId),
          quantity: Q.number(entry && entry.quantity)
        })))
      .filter(entry => entry.id);
  }

  function counterSnapshot() {
    return USERS.map(userId => {
      const activities = (Q.ensureUser(userId, `${CHECKPOINT} counter user`).activities || {});
      return { userId, activities: clone(activities) };
    });
  }

  function countersWithoutNotifications(snapshot) {
    return (snapshot || []).map(item => {
      const activities = clone((item && item.activities) || {});
      delete activities.notifications;
      return { userId: Q.text(item && item.userId), activities };
    });
  }

  function exactActiveMembers(snapshot, ownerId, expected) {
    const actual = snapshot
      .filter(item => item.ownerId === ownerId && item.status === "accepted")
      .map(item => item.userId);
    return Q.sameJson(sorted(actual), sorted(expected));
  }

  function settingsFor(resource, type, assetId) {
    return ((((resource || {}).assetSettingsByType || {})[type]) || {})[assetId] || null;
  }

  function idsFor(resource, type) {
    return sorted((((resource || {}).assetAssignmentIds || {})[type]) || []);
  }

  function contributionTotal(resource, assetId, userId) {
    return (((resource || {}).supplyContributionEntriesByAssetId || {})[assetId] || [])
      .filter(entry => !userId || Q.text(entry && entry.userId) === userId)
      .reduce((total, entry) => total + Q.number(entry && entry.quantity), 0);
  }

  function recordMatches(resource, type, assetId, capacity, managerUserId) {
    const settings = settingsFor(resource, type, assetId);
    return resource
      && Q.text(resource.status) !== "D"
      && Q.sameJson(idsFor(resource, type), [assetId])
      && settings
      && Q.number(settings.capacityMin) === 0
      && Q.number(settings.capacityMax) === capacity
      && Q.number(settings.quantity) === 1
      && Q.text(settings.addedByUserId) === managerUserId;
  }

  function failChecks(label, checks, diagnostic) {
    const failed = Object.entries(checks).filter(([, value]) => !value).map(([key]) => key);
    if (failed.length === 0) return;
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: `${label}-diagnostic`, failed, diagnostic });
    Q.fail(`${CHECKPOINT} ${label} checks failed: ${failed.join(", ")}.`);
  }

  function assertBaseline(currentState) {
    const normal = normalSnapshot();
    const memberships = tournamentMembershipSnapshot();
    const checks = {
      exactNormalOverlays: normal.events.length === 3
        && Q.sameJson(sorted(normal.events.map(item => item.ownerUserId)), sorted([CASEY_ID, NOVA_ID, RILEY_ID])),
      noNormalResources: normal.resources.length === 0 && normal.controlResources === 0,
      zeroNormalMetrics: normal.events.every(item => Q.sameJson(item.target, subEventMetrics({}))
        && Q.sameJson(item.control, subEventMetrics({})) && item.activity === 0),
      normalRoles: exactActiveMembers(normal.members.map(item => ({ ...item, ownerId: NORMAL_EVENT_ID })), NORMAL_EVENT_ID, [CASEY_ID, NOVA_ID, RILEY_ID]),
      suppliesMembershipPreexists: normal.assetMembers.length === 1
        && normal.assetMembers[0].userId === RILEY_ID
        && normal.assetMembers[0].role === "Member"
        && normal.assetMembers[0].status === "accepted",
      tournamentRoles: exactActiveMembers(memberships, TOURNAMENT_EVENT_ID, USERS)
        && exactActiveMembers(memberships, ROOM_A_ID, [CASEY_ID, NOVA_ID, RILEY_ID])
        && exactActiveMembers(memberships, ROOM_B_ID, [LINA_ID]),
      exactStageCounters: Q.sameJson(stageCounters(), { activity: 2, groupsCount: 2, groupsPending: 2 }),
      exactGroupAMetrics: Q.sameJson(normalizedMetric(groupMetric(GROUP_A_ID, NOVA_ID, "Transport")), metric(1, 1, 4))
        && Q.sameJson(normalizedMetric(groupMetric(GROUP_A_ID, RILEY_ID, "Accommodation")), metric(1, 1, 3)),
      exactGroupBMetric: Q.sameJson(normalizedMetric(groupMetric(GROUP_B_ID, LINA_ID, "Transport")), metric(1, 0, 2)),
      groupBStable: sameDomain(groupBControlSnapshot(), currentState.groupBControl),
      noFixtureNotifications: notificationCounts().outbox === Q.number(currentState.baselineNotifications.outbox)
        && notificationCounts().inbox === Q.number(currentState.baselineNotifications.inbox)
    };
    failChecks("baseline", checks, { normal, memberships, stage: stageCounters(), groupB: groupBControlSnapshot() });
    return checks;
  }

  function stageFixture() {
    Q.assertDeploymentSafety();
    if (checkpointId !== CHECKPOINT) Q.fail(`this fixture is restricted to ${CHECKPOINT}.`);
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    USERS.forEach(userId => Q.ensureUser(userId, `${CHECKPOINT} actor`));
    const snapshots = Q.snapshotSpecs(selectors());
    const savedUserActivities = USERS.map(userActivities);
    clearFixture();
    const stagedAtIso = Q.nowIso();
    const tournamentStartAtIso = dateIso(-30);
    const tournamentEndAtIso = dateIso(240);
    const groupATransportRequest = request(
      `${PREFIX}:request:group-a:nova-transport:casey`, CASEY_ID,
      GROUP_A_RESOURCE_OWNER_ID, TOURNAMENT_STAGE_ID, "pending", stagedAtIso,
      tournamentStartAtIso, tournamentEndAtIso);
    const groupAAccommodationRequest = request(
      `${PREFIX}:request:group-a:riley-accommodation:casey`, CASEY_ID,
      GROUP_A_RESOURCE_OWNER_ID, TOURNAMENT_STAGE_ID, "pending", stagedAtIso,
      tournamentStartAtIso, tournamentEndAtIso);
    const assetDefinitions = [
      { id: NORMAL_TRANSPORT_ID, ownerId: NOVA_ID, type: "Transport", capacity: 4, title: "QA Assignment Nova Shuttle" },
      { id: NORMAL_ACCOMMODATION_ID, ownerId: NOVA_ID, type: "Accommodation", capacity: 3, title: "QA Assignment Nova Lodge" },
      { id: NORMAL_SUPPLIES_ID, ownerId: NOVA_ID, type: "Supplies", capacity: 6, title: "QA Assignment Shared Supplies" },
      { id: GROUP_A_TRANSPORT_ID, ownerId: NOVA_ID, type: "Transport", capacity: 4, title: "QA Group A Nova Transport" },
      { id: GROUP_A_ACCOMMODATION_ID, ownerId: RILEY_ID, type: "Accommodation", capacity: 3, title: "QA Group A Riley Accommodation" },
      { id: GROUP_B_TRANSPORT_ID, ownerId: LINA_ID, type: "Transport", capacity: 2, title: "QA Group B Lina Control" }
    ];
    const requestsByAssetId = {
      [GROUP_A_TRANSPORT_ID]: [groupATransportRequest],
      [GROUP_A_ACCOMMODATION_ID]: [groupAAccommodationRequest]
    };
    try {
      Q.collection("assets").insertMany(assetDefinitions.map(definition =>
        assetDocument(definition, stagedAtIso, requestsByAssetId[definition.id] || [])));
      Q.collection("events").insertMany([
        ...normalEventDocuments(stagedAtIso),
        ...tournamentEventDocuments(stagedAtIso, tournamentStartAtIso, tournamentEndAtIso)
      ]);
      Q.collection("activityMembers").insertMany([
        member(NORMAL_EVENT_ID, CASEY_ID, "Admin", stagedAtIso),
        member(NORMAL_EVENT_ID, NOVA_ID, "Member", stagedAtIso),
        member(NORMAL_EVENT_ID, RILEY_ID, "Member", stagedAtIso),
        member(NORMAL_SUPPLIES_ID, RILEY_ID, "Member", stagedAtIso, "asset"),
        member(TOURNAMENT_EVENT_ID, CASEY_ID, "Admin", stagedAtIso),
        member(TOURNAMENT_EVENT_ID, NOVA_ID, "Member", stagedAtIso),
        member(TOURNAMENT_EVENT_ID, RILEY_ID, "Member", stagedAtIso),
        member(TOURNAMENT_EVENT_ID, LINA_ID, "Member", stagedAtIso),
        member(ROOM_A_ID, CASEY_ID, "Member", stagedAtIso),
        member(ROOM_A_ID, NOVA_ID, "Member", stagedAtIso),
        member(ROOM_A_ID, RILEY_ID, "Member", stagedAtIso),
        member(ROOM_B_ID, LINA_ID, "Member", stagedAtIso)
      ]);
      Q.collection("assetRequests").insertMany([
        requestProjection(assetDefinitions[3], groupATransportRequest, stagedAtIso),
        requestProjection(assetDefinitions[4], groupAAccommodationRequest, stagedAtIso)
      ]);
      Q.collection("activityResources").insertMany([
        groupResourceDocument({
          group: "a", ownerId: GROUP_A_RESOURCE_OWNER_ID, subjectUserId: NOVA_ID,
          managerUserId: NOVA_ID, type: "Transport", assetId: GROUP_A_TRANSPORT_ID,
          capacity: 4, accepted: 1, pending: 1
        }, stagedAtIso),
        groupResourceDocument({
          group: "a", ownerId: GROUP_A_RESOURCE_OWNER_ID, subjectUserId: RILEY_ID,
          managerUserId: RILEY_ID, type: "Accommodation", assetId: GROUP_A_ACCOMMODATION_ID,
          capacity: 3, accepted: 1, pending: 1
        }, stagedAtIso),
        groupResourceDocument({
          group: "b", ownerId: GROUP_B_RESOURCE_OWNER_ID, subjectUserId: LINA_ID,
          managerUserId: LINA_ID, type: "Transport", assetId: GROUP_B_TRANSPORT_ID,
          capacity: 2, accepted: 1, pending: 0
        }, stagedAtIso)
      ]);
      Q.collection("activitySubEventStageRuntime").insertOne(runtimeDocument(stagedAtIso));
      Q.collection("eventLeaderboardEntries").insertMany(leaderboardRows(stagedAtIso));
      applyEventCounterDelta(CASEY_ID, true, 2);
      applyEventCounterDelta(NOVA_ID, false, 2);
      applyEventCounterDelta(RILEY_ID, false, 2);
      applyEventCounterDelta(LINA_ID, false, 1);
      [NOVA_ID, RILEY_ID, LINA_ID].forEach(synchronizeAssetCounters);
      const groupBControl = groupBControlSnapshot();
      const groupBranchBaseline = groupBranchDocuments();
      const baselineNotifications = notificationCounts();
      const baselineCounters = counterSnapshot();
      Q.collection(Q.STATE_COLLECTION).insertOne({
        _id: STATE_ID,
        scenario: SCENARIO,
        checkpointId: CHECKPOINT,
        database: db.getName(),
        phase: "baseline-ready",
        stagedAtIso,
        snapshots,
        savedUserActivities,
        baselineNotifications,
        baselineCounters,
        baselineTournamentMemberships: tournamentMembershipSnapshot(),
        groupBControl,
        groupBranchBaseline,
        identities: {
          normalEventId: NORMAL_EVENT_ID,
          normalTargetSubEventId: NORMAL_TARGET_ID,
          normalControlSubEventId: NORMAL_CONTROL_ID,
          tournamentEventId: TOURNAMENT_EVENT_ID,
          tournamentStageId: TOURNAMENT_STAGE_ID,
          groupAId: GROUP_A_ID,
          groupBId: GROUP_B_ID,
          groupAResourceOwnerId: GROUP_A_RESOURCE_OWNER_ID,
          groupBResourceOwnerId: GROUP_B_RESOURCE_OWNER_ID,
          normalTransportId: NORMAL_TRANSPORT_ID,
          normalAccommodationId: NORMAL_ACCOMMODATION_ID,
          normalSuppliesId: NORMAL_SUPPLIES_ID,
          groupATransportId: GROUP_A_TRANSPORT_ID,
          groupAAccommodationId: GROUP_A_ACCOMMODATION_ID,
          groupBTransportId: GROUP_B_TRANSPORT_ID
        }
      });
    } catch (error) {
      Q.fail(`stage failed after snapshot: ${Q.text(error && error.message)}. Run reset asset-assignment ${CHECKPOINT}.`);
    }
    const currentState = state();
    const checks = assertBaseline(currentState);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "baseline-ready",
      stagedAtIso,
      identities: currentState.identities,
      baselineChecks: checks,
      next: "Do not start implicitly. Open the configured Casey/Nova/Riley sessions only when the next QA session explicitly starts this checkpoint."
    });
  }

  function expectedCommonEventMetric() {
    return {
      carsAccepted: 1, carsPending: 0, carsCapacityMin: 0, carsCapacityMax: 4,
      accommodationAccepted: 1, accommodationPending: 0, accommodationCapacityMin: 0, accommodationCapacityMax: 3,
      suppliesAccepted: 5, suppliesPending: 0, suppliesCapacityMin: 0, suppliesCapacityMax: 6,
      groupsPending: 0
    };
  }

  function verifyNormalAssignment() {
    Q.assertDeploymentSafety();
    const currentState = state();
    requirePhase(currentState, "baseline-ready");
    const normal = normalSnapshot();
    const byOwner = Object.fromEntries(normal.resources.map(resource => [resource.assetOwnerUserId, resource]));
    const nova = byOwner[NOVA_ID];
    const riley = byOwner[RILEY_ID];
    const novaMetrics = (nova && nova.resourceMetricsByType) || {};
    const rileyMetrics = (riley && riley.resourceMetricsByType) || {};
    const supplyOpenOutbox = read("notificationOutbox", {
      notificationType: "event-supplies-open",
      entityId: NORMAL_EVENT_ID,
      "payload.assetId": NORMAL_SUPPLIES_ID
    });
    const supplyOpenInbox = read("userNotifications", {
      kind: "event-supplies-open",
      sourceId: NORMAL_EVENT_ID,
      "payload.assetId": NORMAL_SUPPLIES_ID
    });
    const supplyContributionOutbox = read("notificationOutbox", {
      notificationType: "event-supplies-contribution-added",
      entityId: NORMAL_EVENT_ID,
      "payload.assetId": NORMAL_SUPPLIES_ID
    });
    const supplyContributionInbox = read("userNotifications", {
      kind: "event-supplies-contribution-added",
      sourceId: NORMAL_EVENT_ID,
      "payload.assetId": NORMAL_SUPPLIES_ID
    });
    const novaContributionOutbox = supplyContributionOutbox.filter(item =>
      Q.text(item && item.payload && item.payload.contributorUserId) === NOVA_ID);
    const rileyContributionOutbox = supplyContributionOutbox.filter(item =>
      Q.text(item && item.payload && item.payload.contributorUserId) === RILEY_ID);
    const novaContributionInbox = supplyContributionInbox.filter(item =>
      Q.text(item && item.payload && item.payload.contributorUserId) === NOVA_ID);
    const rileyContributionInbox = supplyContributionInbox.filter(item =>
      Q.text(item && item.payload && item.payload.contributorUserId) === RILEY_ID);
    const checks = {
      exactOwnerRecords: normal.resources.length === 2 && !!nova && !!riley,
      novaTransport: recordMatches(nova, "Transport", NORMAL_TRANSPORT_ID, 4, NOVA_ID),
      novaAccommodation: recordMatches(nova, "Accommodation", NORMAL_ACCOMMODATION_ID, 3, NOVA_ID),
      novaSupplies: Q.sameJson(idsFor(nova, "Supplies"), [NORMAL_SUPPLIES_ID])
        && contributionTotal(nova, NORMAL_SUPPLIES_ID, NOVA_ID) === 2,
      rileySupplies: Q.sameJson(idsFor(riley, "Supplies"), [])
        && settingsFor(riley, "Supplies", NORMAL_SUPPLIES_ID) === null
        && contributionTotal(riley, NORMAL_SUPPLIES_ID, RILEY_ID) === 3,
      exactStoredMetrics: Q.sameJson(normalizedMetric(novaMetrics.Transport), metric(1, 0, 4))
        && Q.sameJson(normalizedMetric(novaMetrics.Accommodation), metric(1, 0, 3))
        && Q.sameJson(normalizedMetric(novaMetrics.Supplies), metric(2, 0, 6))
        && Q.sameJson(normalizedMetric(rileyMetrics.Supplies), metric(3, 0, 0)),
      exactCommonMaterialization: normal.events.length === 3
        && normal.events.every(event => Q.sameJson(event.target, expectedCommonEventMetric()))
        && normal.events.every(event => event.activity === 0),
      suppliesOpenNotificationExactOnce: supplyOpenOutbox.length === 1
        && Q.sameJson(sorted(supplyOpenOutbox[0].recipientUserIds), sorted([CASEY_ID, RILEY_ID]))
        && supplyOpenInbox.length === 2
        && Q.sameJson(sorted(supplyOpenInbox.map(recipientId)), sorted([CASEY_ID, RILEY_ID])),
      suppliesContributionNotificationsExactOnce: supplyContributionOutbox.length === 2
        && novaContributionOutbox.length === 1
        && Q.sameJson(sorted(novaContributionOutbox[0].recipientUserIds), sorted([CASEY_ID, RILEY_ID]))
        && Q.number(novaContributionOutbox[0].payload.quantity) === 2
        && rileyContributionOutbox.length === 1
        && Q.sameJson(sorted(rileyContributionOutbox[0].recipientUserIds), sorted([CASEY_ID, NOVA_ID]))
        && Q.number(rileyContributionOutbox[0].payload.quantity) === 3
        && supplyContributionInbox.length === 4
        && novaContributionInbox.length === 2
        && Q.sameJson(sorted(novaContributionInbox.map(recipientId)), sorted([CASEY_ID, RILEY_ID]))
        && rileyContributionInbox.length === 2
        && Q.sameJson(sorted(rileyContributionInbox.map(recipientId)), sorted([CASEY_ID, NOVA_ID]))
        && supplyContributionInbox.every(item => Q.number(item.occurrenceCount) === 1),
      controlSubEventUnchanged: normal.controlResources === 0
        && normal.events.every(event => Q.sameJson(event.control, subEventMetrics({}))),
      membershipIsolation: normal.members.length === 3
        && normal.members.every(member => member.status === "accepted")
        && normal.assetMembers.length === 1
        && normal.assetMembers[0].userId === RILEY_ID
        && normal.assetMembers[0].status === "accepted",
      tournamentUntouched: sameDomain(groupBranchDocuments(), currentState.groupBranchBaseline),
      nonNotificationCountersUntouched: sameDomain(
        countersWithoutNotifications(counterSnapshot()),
        countersWithoutNotifications(currentState.baselineCounters)
      )
    };
    failChecks("normal-assignment", checks, {
      normal,
      supplyOpenOutbox,
      supplyOpenInbox,
      supplyContributionOutbox,
      supplyContributionInbox,
      currentCounters: counterSnapshot(),
      baselineCounters: currentState.baselineCounters
    });
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "normal-verified",
      normalVerifiedAtIso: Q.nowIso(),
      verifiedNormalDomain: normal,
      normalDomainAfterAssignment: {
        events: read("events", { sourceId: NORMAL_EVENT_ID }),
        members: read("activityMembers", { ownerId: { $in: [NORMAL_EVENT_ID, NORMAL_SUPPLIES_ID] } }),
        resources: read("activityResources", { ownerId: NORMAL_EVENT_ID }),
        assets: read("assets", { assetId: { $in: [NORMAL_TRANSPORT_ID, NORMAL_ACCOMMODATION_ID, NORMAL_SUPPLIES_ID] } })
      }
    } });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "normal-verified", checks,
      next: "Edit only QA Group A Nova Transport capacity 4 -> 5 through its normal Asset editor, then reload once." });
  }

  function normalDomainRaw() {
    return {
      events: read("events", { sourceId: NORMAL_EVENT_ID }),
      members: read("activityMembers", { ownerId: { $in: [NORMAL_EVENT_ID, NORMAL_SUPPLIES_ID] } }),
      resources: read("activityResources", { ownerId: NORMAL_EVENT_ID }),
      assets: read("assets", { assetId: { $in: [NORMAL_TRANSPORT_ID, NORMAL_ACCOMMODATION_ID, NORMAL_SUPPLIES_ID] } })
    };
  }

  function verifySupplyContributionDelete() {
    Q.assertDeploymentSafety();
    const currentState = state();
    requirePhase(currentState, "normal-verified");
    const expectedRows = expectedNormalContributionRows(currentState);
    const expectedRileyRows = expectedRows.filter(entry => entry.userId === RILEY_ID);
    if (expectedRileyRows.length !== 1) {
      Q.fail(`${CHECKPOINT} expected one verified Riley Supplies row, found ${expectedRileyRows.length}.`);
    }
    const removedRow = expectedRileyRows[0];
    const normal = normalSnapshot();
    const byOwner = Object.fromEntries(normal.resources.map(resource => [resource.assetOwnerUserId, resource]));
    const nova = byOwner[NOVA_ID];
    const riley = byOwner[RILEY_ID];
    const removedOutbox = read("notificationOutbox", {
      notificationType: "event-supplies-contribution-removed",
      entityId: NORMAL_EVENT_ID,
      "payload.assetId": NORMAL_SUPPLIES_ID,
      "payload.contributionEntryId": removedRow.id
    });
    const removedInbox = read("userNotifications", {
      kind: "event-supplies-contribution-removed",
      sourceId: NORMAL_EVENT_ID,
      "payload.assetId": NORMAL_SUPPLIES_ID,
      "payload.contributionEntryId": removedRow.id
    });
    const expectedAfterDeleteMetric = {
      carsAccepted: 1, carsPending: 0, carsCapacityMin: 0, carsCapacityMax: 4,
      accommodationAccepted: 1, accommodationPending: 0, accommodationCapacityMin: 0, accommodationCapacityMax: 3,
      suppliesAccepted: 2, suppliesPending: 0, suppliesCapacityMin: 0, suppliesCapacityMax: 6,
      groupsPending: 0
    };
    const checks = {
      novaAssignmentAndQuantityRetained: recordMatches(nova, "Transport", NORMAL_TRANSPORT_ID, 4, NOVA_ID)
        && recordMatches(nova, "Accommodation", NORMAL_ACCOMMODATION_ID, 3, NOVA_ID)
        && Q.sameJson(idsFor(nova, "Supplies"), [NORMAL_SUPPLIES_ID])
        && contributionTotal(nova, NORMAL_SUPPLIES_ID, NOVA_ID) === 2,
      onlyRileyContributionRemoved: !!riley
        && Q.sameJson(idsFor(riley, "Supplies"), [])
        && settingsFor(riley, "Supplies", NORMAL_SUPPLIES_ID) === null
        && contributionTotal(riley, NORMAL_SUPPLIES_ID, RILEY_ID) === 0
        && Q.sameJson(normalizedMetric((riley.resourceMetricsByType || {}).Supplies), zeroMetric()),
      exactCommonCounter: normal.events.length === 3
        && normal.events.every(event => Q.sameJson(event.target, expectedAfterDeleteMetric)),
      removedNotificationExactOnce: removedOutbox.length === 1
        && Q.sameJson(sorted(removedOutbox[0].recipientUserIds), sorted([CASEY_ID, NOVA_ID]))
        && Q.text(removedOutbox[0].payload.contributorUserId) === RILEY_ID
        && Q.number(removedOutbox[0].payload.quantity) === removedRow.quantity
        && removedInbox.length === 2
        && Q.sameJson(sorted(removedInbox.map(recipientId)), sorted([CASEY_ID, NOVA_ID]))
        && removedInbox.every(item => Q.number(item.occurrenceCount) === 1),
      controlSubEventUnchanged: normal.controlResources === 0
        && normal.events.every(event => Q.sameJson(event.control, subEventMetrics({}))),
      membershipsUnchanged: normal.members.length === 3
        && normal.members.every(member => member.status === "accepted")
        && normal.assetMembers.length === 1
        && normal.assetMembers[0].userId === RILEY_ID
        && normal.assetMembers[0].status === "accepted",
      tournamentUntouched: sameDomain(groupBranchDocuments(), currentState.groupBranchBaseline),
      nonNotificationCountersUntouched: sameDomain(
        countersWithoutNotifications(counterSnapshot()),
        countersWithoutNotifications(currentState.baselineCounters)
      )
    };
    failChecks("supply-contribution-delete", checks, {
      removedRow, normal, removedOutbox, removedInbox, currentCounters: counterSnapshot()
    });
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "supply-delete-verified",
      supplyDeleteVerifiedAtIso: Q.nowIso()
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "supply-delete-verified",
      checks,
      next: `Run restore-normal-assignment-branch asset-assignment ${CHECKPOINT}; it restores only the verified normal Event branch.`
    });
  }

  function restoreNormalAssignmentBranch() {
    Q.assertDeploymentSafety();
    const currentState = state();
    const currentPhase = Q.text(currentState.phase);
    if (!["normal-verified", "supply-delete-verified"].includes(currentPhase)) {
      Q.fail(`${CHECKPOINT} normal restore requires phase 'normal-verified' or 'supply-delete-verified', found '${currentPhase}'.`);
    }
    const baseline = currentState.normalDomainAfterAssignment || {};
    if (!Array.isArray(baseline.events) || !Array.isArray(baseline.resources)) {
      Q.fail(`${CHECKPOINT} verified normal branch snapshot is missing.`);
    }
    const expectedEntryIds = expectedNormalContributionRows(currentState).map(entry => entry.id);
    restoreDocuments("events", { sourceId: NORMAL_EVENT_ID }, baseline.events);
    restoreDocuments("activityMembers", { ownerId: { $in: [NORMAL_EVENT_ID, NORMAL_SUPPLIES_ID] } }, baseline.members);
    restoreDocuments("activityResources", { ownerId: NORMAL_EVENT_ID }, baseline.resources);
    restoreDocuments("assets", { assetId: { $in: [NORMAL_TRANSPORT_ID, NORMAL_ACCOMMODATION_ID, NORMAL_SUPPLIES_ID] } }, baseline.assets);
    Q.collection("notificationOutbox").deleteMany({
      entityId: NORMAL_EVENT_ID,
      "payload.assetId": NORMAL_SUPPLIES_ID,
      $or: [
        { notificationType: "event-supplies-contribution-removed" },
        {
          notificationType: "event-supplies-contribution-added",
          "payload.contributionEntryId": { $nin: expectedEntryIds }
        }
      ]
    });
    Q.collection("userNotifications").deleteMany({
      sourceId: NORMAL_EVENT_ID,
      "payload.assetId": NORMAL_SUPPLIES_ID,
      $or: [
        { kind: "event-supplies-contribution-removed" },
        {
          kind: "event-supplies-contribution-added",
          "payload.contributionEntryId": { $nin: expectedEntryIds }
        }
      ]
    });
    USERS.forEach(synchronizeNotificationCounter);
    if (!sameDomain(normalDomainRaw(), baseline)) {
      Q.fail(`${CHECKPOINT} verified normal Event branch did not restore exactly.`);
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "normal-verified",
      normalBranchRestoredAtIso: Q.nowIso()
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "normal-verified",
      checks: {
        exactNormalRestore: true,
        tournamentUntouched: sameDomain(groupBranchDocuments(), currentState.groupBranchBaseline),
        notificationCountersReconciled: true
      },
      next: "Continue with the Group A capacity branch; the normal Event is back at Nova 2 plus Riley 3 Supplies."
    });
  }

  function repairTournamentGroupIds() {
    Q.assertDeploymentSafety();
    const currentState = state();
    requirePhase(currentState, "step-10-ready");
    const normalBaseline = currentState.normalDomainAfterAssignment || {};
    if (!Array.isArray(normalBaseline.events) || !Array.isArray(normalBaseline.resources)) {
      Q.fail(`${CHECKPOINT} verified normal branch snapshot is missing.`);
    }
    if (!sameDomain(normalDomainRaw(), normalBaseline)) {
      const expectedEntryIds = expectedNormalContributionRows(currentState).map(entry => entry.id);
      restoreDocuments("events", { sourceId: NORMAL_EVENT_ID }, normalBaseline.events);
      restoreDocuments(
        "activityMembers",
        { ownerId: { $in: [NORMAL_EVENT_ID, NORMAL_SUPPLIES_ID] } },
        normalBaseline.members);
      restoreDocuments("activityResources", { ownerId: NORMAL_EVENT_ID }, normalBaseline.resources);
      restoreDocuments(
        "assets",
        { assetId: { $in: [NORMAL_TRANSPORT_ID, NORMAL_ACCOMMODATION_ID, NORMAL_SUPPLIES_ID] } },
        normalBaseline.assets);
      Q.collection("notificationOutbox").deleteMany({
        entityId: NORMAL_EVENT_ID,
        "payload.assetId": NORMAL_SUPPLIES_ID,
        $or: [
          { notificationType: "event-supplies-contribution-removed" },
          {
            notificationType: "event-supplies-contribution-added",
            "payload.contributionEntryId": { $nin: expectedEntryIds }
          }
        ]
      });
      Q.collection("userNotifications").deleteMany({
        sourceId: NORMAL_EVENT_ID,
        "payload.assetId": NORMAL_SUPPLIES_ID,
        $or: [
          { kind: "event-supplies-contribution-removed" },
          {
            kind: "event-supplies-contribution-added",
            "payload.contributionEntryId": { $nin: expectedEntryIds }
          }
        ]
      });
      USERS.forEach(synchronizeNotificationCounter);
    }
    if (!sameDomain(normalDomainRaw(), normalBaseline)) {
      Q.fail(`${CHECKPOINT} verified normal Event branch did not restore exactly.`);
    }

    const root = tournamentRoot();
    const stagedAtIso = Q.text(currentState.stagedAtIso) || Q.nowIso();
    const startAtIso = Q.text(root.startAtIso);
    const endAtIso = Q.text(root.endAtIso);
    if (!startAtIso || !endAtIso) {
      Q.fail(`${CHECKPOINT} Tournament fixture has no stable time window.`);
    }

    const groupATransportRequest = request(
      `${PREFIX}:request:group-a:nova-transport:casey`, CASEY_ID,
      GROUP_A_RESOURCE_OWNER_ID, TOURNAMENT_STAGE_ID, "pending", stagedAtIso,
      startAtIso, endAtIso);
    const groupAAccommodationRequest = request(
      `${PREFIX}:request:group-a:riley-accommodation:casey`, CASEY_ID,
      GROUP_A_RESOURCE_OWNER_ID, TOURNAMENT_STAGE_ID, "pending", stagedAtIso,
      startAtIso, endAtIso);
    const groupAssetDefinitions = [
      { id: GROUP_A_TRANSPORT_ID, ownerId: NOVA_ID, capacity: 4 },
      { id: GROUP_A_ACCOMMODATION_ID, ownerId: RILEY_ID, capacity: 3 }
    ];

    Q.collection("events").deleteMany({ sourceId: { $in: [
      ROOM_A_ID,
      ROOM_B_ID,
      LEGACY_ROOM_A_ID,
      LEGACY_ROOM_B_ID
    ] } });
    Q.collection("events").insertMany(
      tournamentEventDocuments(stagedAtIso, startAtIso, endAtIso).filter(item => item.sourceId !== TOURNAMENT_EVENT_ID));

    Q.collection("activityMembers").deleteMany({ ownerId: { $in: [
      ROOM_A_ID,
      ROOM_B_ID,
      LEGACY_ROOM_A_ID,
      LEGACY_ROOM_B_ID
    ] } });
    Q.collection("activityMembers").insertMany([
      member(ROOM_A_ID, CASEY_ID, "Member", stagedAtIso),
      member(ROOM_A_ID, NOVA_ID, "Member", stagedAtIso),
      member(ROOM_A_ID, RILEY_ID, "Member", stagedAtIso),
      member(ROOM_B_ID, LINA_ID, "Member", stagedAtIso)
    ]);

    Q.collection("activityResources").deleteMany({ ownerId: { $in: ALL_GROUP_RESOURCE_OWNER_IDS } });
    Q.collection("activityResources").insertMany([
      groupResourceDocument({
        group: "a", ownerId: GROUP_A_RESOURCE_OWNER_ID, subjectUserId: NOVA_ID,
        managerUserId: NOVA_ID, type: "Transport", assetId: GROUP_A_TRANSPORT_ID,
        capacity: 4, accepted: 1, pending: 1
      }, stagedAtIso),
      groupResourceDocument({
        group: "a", ownerId: GROUP_A_RESOURCE_OWNER_ID, subjectUserId: RILEY_ID,
        managerUserId: RILEY_ID, type: "Accommodation", assetId: GROUP_A_ACCOMMODATION_ID,
        capacity: 3, accepted: 1, pending: 1
      }, stagedAtIso),
      groupResourceDocument({
        group: "b", ownerId: GROUP_B_RESOURCE_OWNER_ID, subjectUserId: LINA_ID,
        managerUserId: LINA_ID, type: "Transport", assetId: GROUP_B_TRANSPORT_ID,
        capacity: 2, accepted: 1, pending: 0
      }, stagedAtIso)
    ]);

    Q.collection("assets").updateOne(
      { assetId: GROUP_A_TRANSPORT_ID },
      { $set: { requests: [groupATransportRequest] } });
    Q.collection("assets").updateOne(
      { assetId: GROUP_A_ACCOMMODATION_ID },
      { $set: { requests: [groupAAccommodationRequest] } });
    Q.collection("assetRequests").deleteMany({ assetId: { $in: [
      GROUP_A_TRANSPORT_ID,
      GROUP_A_ACCOMMODATION_ID,
      GROUP_B_TRANSPORT_ID
    ] } });
    Q.collection("assetRequests").insertMany([
      requestProjection(groupAssetDefinitions[0], groupATransportRequest, stagedAtIso),
      requestProjection(groupAssetDefinitions[1], groupAAccommodationRequest, stagedAtIso)
    ]);

    restoreDocuments(
      "activitySubEventStageRuntime",
      { ownerId: TOURNAMENT_EVENT_ID, subEventId: TOURNAMENT_STAGE_ID },
      [runtimeDocument(stagedAtIso)]);
    restoreDocuments(
      "eventLeaderboardEntries",
      { eventId: TOURNAMENT_EVENT_ID },
      leaderboardRows(stagedAtIso));

    const capturedAtIso = Q.nowIso();
    const groupBControl = groupBControlSnapshot();
    const groupBranchBaseline = groupBranchDocuments();
    const step10Boundary = {
      capturedAtIso,
      group: groupBranchBaseline,
      notificationOutbox: read("notificationOutbox", relatedSelector()),
      userNotifications: read("userNotifications", relatedSelector()),
      affinityRecomputeTasks: read("affinityRecomputeTasks", relatedSelector())
    };
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "step-10-ready",
      baselineTournamentMemberships: tournamentMembershipSnapshot(),
      groupBControl,
      groupBranchBaseline,
      step10Boundary,
      "identities.groupAId": GROUP_A_ID,
      "identities.groupBId": GROUP_B_ID,
      "identities.groupAResourceOwnerId": GROUP_A_RESOURCE_OWNER_ID,
      "identities.groupBResourceOwnerId": GROUP_B_RESOURCE_OWNER_ID,
      tournamentGroupIdsRepairedAtIso: capturedAtIso
    } });

    const repairedState = state();
    const memberships = tournamentMembershipSnapshot();
    const checks = {
      exactVerifiedNormalBranch: sameDomain(normalDomainRaw(), repairedState.normalDomainAfterAssignment),
      canonicalTournamentRoles: exactActiveMembers(memberships, TOURNAMENT_EVENT_ID, USERS)
        && exactActiveMembers(memberships, ROOM_A_ID, [CASEY_ID, NOVA_ID, RILEY_ID])
        && exactActiveMembers(memberships, ROOM_B_ID, [LINA_ID]),
      exactStageCounters: Q.sameJson(stageCounters(), { activity: 2, groupsCount: 2, groupsPending: 2 }),
      exactGroupAMetrics: Q.sameJson(normalizedMetric(groupMetric(GROUP_A_ID, NOVA_ID, "Transport")), metric(1, 1, 4))
        && Q.sameJson(normalizedMetric(groupMetric(GROUP_A_ID, RILEY_ID, "Accommodation")), metric(1, 1, 3)),
      exactGroupBMetric: Q.sameJson(normalizedMetric(groupMetric(GROUP_B_ID, LINA_ID, "Transport")), metric(1, 0, 2)),
      noLegacyGroupDocuments: Q.collection("events").countDocuments({ sourceId: { $in: [LEGACY_ROOM_A_ID, LEGACY_ROOM_B_ID] } }) === 0
        && Q.collection("activityMembers").countDocuments({ ownerId: { $in: [LEGACY_ROOM_A_ID, LEGACY_ROOM_B_ID] } }) === 0
        && Q.collection("activityResources").countDocuments({ ownerId: { $in: [
          LEGACY_GROUP_A_RESOURCE_OWNER_ID,
          LEGACY_GROUP_B_RESOURCE_OWNER_ID
        ] } }) === 0,
      canonicalLeaderboardRows: Q.collection("eventLeaderboardEntries").countDocuments({
        eventId: TOURNAMENT_EVENT_ID,
        groupId: { $in: [GROUP_A_ID, GROUP_B_ID] }
      }) === 4,
      step10BoundaryRecaptured: sameDomain(repairedState.step10Boundary.group, groupBranchDocuments())
    };
    failChecks("tournament-group-id-repair", checks, {
      normal: normalSnapshot(),
      memberships,
      stage: stageCounters(),
      groupB: groupBControlSnapshot()
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "step-10-ready",
      repairedAtIso: capturedAtIso,
      groupAId: GROUP_A_ID,
      groupBId: GROUP_B_ID,
      checks,
      next: "Reload the already-open Tournament Groups popup. Group A must show 3 members, Group B 1 member and the stage pending total must remain 2."
    });
  }

  function stageStep10Boundary() {
    Q.assertDeploymentSafety();
    const currentState = state();
    requirePhase(currentState, "normal-verified");
    if (!sameDomain(normalDomainRaw(), currentState.normalDomainAfterAssignment)) {
      Q.fail(`${CHECKPOINT} refuses to stage step 10 because the verified normal Event branch changed.`);
    }
    if (!sameDomain(groupBranchDocuments(), currentState.groupBranchBaseline)) {
      Q.fail(`${CHECKPOINT} refuses to stage step 10 because the Tournament branch is not at its exact baseline.`);
    }
    const capturedAtIso = Q.nowIso();
    const boundary = {
      capturedAtIso,
      group: groupBranchDocuments(),
      notificationOutbox: read("notificationOutbox", relatedSelector()),
      userNotifications: read("userNotifications", relatedSelector()),
      affinityRecomputeTasks: read("affinityRecomputeTasks", relatedSelector())
    };
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "step-10-ready",
      step10Boundary: boundary
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "step-10-ready",
      capturedAtIso,
      checks: {
        exactVerifiedNormalBranch: true,
        exactTournamentBaseline: true,
        notificationBoundaryCaptured: true
      },
      next: "Start checklist step 10. Run rollback-step-10-boundary to replay from this exact boundary without repeating steps 1-9."
    });
  }

  function restoreTournamentDocuments(documents) {
    restoreDocuments("events", { $or: [{ sourceId: TOURNAMENT_EVENT_ID }, { sourceId: { $in: [ROOM_A_ID, ROOM_B_ID] } }] }, documents.events);
    restoreDocuments("activityMembers", { ownerId: { $in: [TOURNAMENT_EVENT_ID, ROOM_A_ID, ROOM_B_ID] } }, documents.members);
    restoreDocuments("activityResources", { ownerId: { $in: GROUP_RESOURCE_OWNER_IDS } }, documents.resources);
    restoreDocuments("activitySubEventStageRuntime", { ownerId: TOURNAMENT_EVENT_ID, subEventId: TOURNAMENT_STAGE_ID }, documents.runtime);
    restoreDocuments("eventLeaderboardEntries", { eventId: TOURNAMENT_EVENT_ID }, documents.scores);
    restoreDocuments("assets", { assetId: { $in: [GROUP_A_TRANSPORT_ID, GROUP_A_ACCOMMODATION_ID, GROUP_B_TRANSPORT_ID] } }, documents.assets);
    restoreDocuments("assetRequests", { assetId: { $in: [GROUP_A_TRANSPORT_ID, GROUP_A_ACCOMMODATION_ID, GROUP_B_TRANSPORT_ID] } }, documents.requests);
  }

  function rollbackStep10Boundary() {
    Q.assertDeploymentSafety();
    const currentState = state();
    const currentPhase = Q.text(currentState.phase);
    const allowedPhases = [
      "step-10-ready",
      "group-capacity-verified",
      "step-16-ready",
      "group-unassign-verified",
      "group-removal-ready",
      "complete"
    ];
    if (!allowedPhases.includes(currentPhase)) {
      Q.fail(`${CHECKPOINT} step 10 rollback is not allowed from phase '${currentPhase || "not-staged"}'.`);
    }
    const boundary = currentState.step10Boundary || {};
    if (!boundary.group || !Array.isArray(boundary.notificationOutbox)
        || !Array.isArray(boundary.userNotifications) || !Array.isArray(boundary.affinityRecomputeTasks)) {
      Q.fail(`${CHECKPOINT} step 10 rollback boundary is missing.`);
    }
    if (!sameDomain(normalDomainRaw(), currentState.normalDomainAfterAssignment)) {
      Q.fail(`${CHECKPOINT} refuses to roll back step 10 because the verified normal Event branch changed.`);
    }
    restoreTournamentDocuments(boundary.group);
    restoreDocuments("notificationOutbox", relatedSelector(), boundary.notificationOutbox);
    restoreDocuments("userNotifications", relatedSelector(), boundary.userNotifications);
    restoreDocuments("affinityRecomputeTasks", relatedSelector(), boundary.affinityRecomputeTasks);
    USERS.forEach(synchronizeNotificationCounter);
    const checks = {
      exactTournamentRestore: sameDomain(groupBranchDocuments(), boundary.group),
      exactNormalBranchPreserved: sameDomain(normalDomainRaw(), currentState.normalDomainAfterAssignment),
      exactOutboxRestore: sameDomain(read("notificationOutbox", relatedSelector()), boundary.notificationOutbox),
      exactInboxRestore: sameDomain(read("userNotifications", relatedSelector()), boundary.userNotifications),
      exactAffinityTaskRestore: sameDomain(read("affinityRecomputeTasks", relatedSelector()), boundary.affinityRecomputeTasks)
    };
    failChecks("step-10-rollback", checks, { currentPhase, boundaryCapturedAtIso: boundary.capturedAtIso });
    const rolledBackAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "step-10-ready",
      step10RolledBackAtIso: rolledBackAtIso
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "step-10-ready",
      rolledBackAtIso,
      checks,
      next: "Replay checklist step 10; steps 1-9 remain preserved."
    });
  }

  function assertGroupControls(currentState) {
    return sameDomain(groupBControlSnapshot(), currentState.groupBControl)
      && sameDomain(normalDomainRaw(), currentState.normalDomainAfterAssignment);
  }

  function verifyGroupCapacityEdit() {
    Q.assertDeploymentSafety();
    const currentState = state();
    requirePhase(currentState, "step-10-ready");
    const asset = Q.collection("assets").findOne({ assetId: GROUP_A_TRANSPORT_ID }) || {};
    const nova = groupResource(GROUP_A_RESOURCE_OWNER_ID, NOVA_ID);
    const riley = groupResource(GROUP_A_RESOURCE_OWNER_ID, RILEY_ID);
    const checks = {
      sourceCapacitySaved: Q.number(asset.capacityTotal) === 5,
      novaAssignmentRetained: recordMatches(nova, "Transport", GROUP_A_TRANSPORT_ID, 4, NOVA_ID),
      novaStoredMetricRefreshed: Q.sameJson(normalizedMetric((nova.resourceMetricsByType || {}).Transport), metric(1, 1, 5)),
      novaRuntimeRefreshed: Q.sameJson(normalizedMetric(groupMetric(GROUP_A_ID, NOVA_ID, "Transport")), metric(1, 1, 5)),
      rileyRuntimeUnchanged: Q.sameJson(normalizedMetric(groupMetric(GROUP_A_ID, RILEY_ID, "Accommodation")), metric(1, 1, 3))
        && recordMatches(riley, "Accommodation", GROUP_A_ACCOMMODATION_ID, 3, RILEY_ID),
      pendingCountersUnchanged: Q.sameJson(stageCounters(), { activity: 2, groupsCount: 2, groupsPending: 2 }),
      unrelatedScopesByteIdentical: assertGroupControls(currentState),
      membershipsUnchanged: sameDomain(tournamentMembershipSnapshot(), currentState.baselineTournamentMemberships)
    };
    failChecks("group-capacity-edit", checks, { asset, nova, riley, stage: stageCounters() });
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "group-capacity-verified",
      groupCapacityVerifiedAtIso: Q.nowIso()
    } });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "group-capacity-verified", checks,
      next: "Unassign only QA Group A Nova Transport from Group A through the resource editor, then close/reopen and reload once." });
  }

  function stageStep16Boundary() {
    Q.assertDeploymentSafety();
    const currentState = state();
    const currentPhase = Q.text(currentState.phase);
    if (!["group-capacity-verified", "step-16-ready"].includes(currentPhase)) {
      Q.fail(`${CHECKPOINT} requires phase 'group-capacity-verified', found '${currentPhase || "not-staged"}'.`);
    }
    const asset = Q.collection("assets").findOne({ assetId: GROUP_A_TRANSPORT_ID }) || {};
    const nova = groupResource(GROUP_A_RESOURCE_OWNER_ID, NOVA_ID);
    const riley = groupResource(GROUP_A_RESOURCE_OWNER_ID, RILEY_ID);
    const checks = {
      capacityBoundaryRetained: Q.number(asset.capacityTotal) === 5
        && recordMatches(nova, "Transport", GROUP_A_TRANSPORT_ID, 4, NOVA_ID)
        && Q.sameJson(normalizedMetric(groupMetric(GROUP_A_ID, NOVA_ID, "Transport")), metric(1, 1, 5)),
      rileyBoundaryRetained: recordMatches(riley, "Accommodation", GROUP_A_ACCOMMODATION_ID, 3, RILEY_ID)
        && Q.sameJson(normalizedMetric(groupMetric(GROUP_A_ID, RILEY_ID, "Accommodation")), metric(1, 1, 3)),
      exactPendingBoundary: Q.sameJson(stageCounters(), { activity: 2, groupsCount: 2, groupsPending: 2 }),
      unrelatedScopesUnchanged: assertGroupControls(currentState),
      membershipsUnchanged: sameDomain(tournamentMembershipSnapshot(), currentState.baselineTournamentMemberships)
    };
    failChecks("step-16-stage", checks, { asset, nova, riley, stage: stageCounters() });
    const capturedAtIso = Q.nowIso();
    const boundary = {
      capturedAtIso,
      group: groupBranchDocuments(),
      notificationOutbox: read("notificationOutbox", relatedSelector()),
      userNotifications: read("userNotifications", relatedSelector()),
      affinityRecomputeTasks: read("affinityRecomputeTasks", relatedSelector())
    };
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "step-16-ready",
      step16Boundary: boundary
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "step-16-ready",
      capturedAtIso,
      checks,
      next: "Start checklist step 16. Run rollback-step-16-boundary to replay from capacity 5 without repeating steps 1-15."
    });
  }

  function rollbackStep16Boundary() {
    Q.assertDeploymentSafety();
    const currentState = state();
    const currentPhase = Q.text(currentState.phase);
    const allowedPhases = ["step-16-ready", "group-unassign-verified", "group-removal-ready", "complete"];
    if (!allowedPhases.includes(currentPhase)) {
      Q.fail(`${CHECKPOINT} step 16 rollback is not allowed from phase '${currentPhase || "not-staged"}'.`);
    }
    const boundary = currentState.step16Boundary || {};
    if (!boundary.group || !Array.isArray(boundary.notificationOutbox)
        || !Array.isArray(boundary.userNotifications) || !Array.isArray(boundary.affinityRecomputeTasks)) {
      Q.fail(`${CHECKPOINT} step 16 rollback boundary is missing.`);
    }
    if (!sameDomain(normalDomainRaw(), currentState.normalDomainAfterAssignment)) {
      Q.fail(`${CHECKPOINT} refuses to roll back step 16 because the verified normal Event branch changed.`);
    }
    restoreTournamentDocuments(boundary.group);
    restoreDocuments("notificationOutbox", relatedSelector(), boundary.notificationOutbox);
    restoreDocuments("userNotifications", relatedSelector(), boundary.userNotifications);
    restoreDocuments("affinityRecomputeTasks", relatedSelector(), boundary.affinityRecomputeTasks);
    USERS.forEach(synchronizeNotificationCounter);
    const checks = {
      exactTournamentRestore: sameDomain(groupBranchDocuments(), boundary.group),
      exactNormalBranchPreserved: sameDomain(normalDomainRaw(), currentState.normalDomainAfterAssignment),
      exactOutboxRestore: sameDomain(read("notificationOutbox", relatedSelector()), boundary.notificationOutbox),
      exactInboxRestore: sameDomain(read("userNotifications", relatedSelector()), boundary.userNotifications),
      exactAffinityTaskRestore: sameDomain(read("affinityRecomputeTasks", relatedSelector()), boundary.affinityRecomputeTasks)
    };
    failChecks("step-16-rollback", checks, { currentPhase, boundaryCapturedAtIso: boundary.capturedAtIso });
    const rolledBackAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "step-16-ready",
      step16RolledBackAtIso: rolledBackAtIso
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "step-16-ready",
      rolledBackAtIso,
      checks,
      next: "Replay checklist step 16; steps 1-15 remain preserved."
    });
  }

  function emptyOrZeroResource(resource, type, assetId) {
    return resource
      && !idsFor(resource, type).includes(assetId)
      && !settingsFor(resource, type, assetId)
      && Q.sameJson(normalizedMetric((resource.resourceMetricsByType || {})[type]), zeroMetric());
  }

  function verifyGroupUnassign() {
    Q.assertDeploymentSafety();
    const currentState = state();
    requirePhase(currentState, "step-16-ready");
    const nova = groupResource(GROUP_A_RESOURCE_OWNER_ID, NOVA_ID);
    const riley = groupResource(GROUP_A_RESOURCE_OWNER_ID, RILEY_ID);
    const sourceAsset = Q.collection("assets").findOne({ assetId: GROUP_A_TRANSPORT_ID }) || {};
    const expectedSourceAsset = (((currentState.step16Boundary || {}).group || {}).assets || [])
      .find(asset => Q.text(asset && asset.assetId) === GROUP_A_TRANSPORT_ID);
    const removedOutbox = read("notificationOutbox", {
      notificationType: "event-asset-assignment-removed",
      entityId: TOURNAMENT_EVENT_ID,
      "payload.ownerId": GROUP_A_RESOURCE_OWNER_ID,
      "payload.subEventId": TOURNAMENT_STAGE_ID,
      "payload.assetId": GROUP_A_TRANSPORT_ID
    });
    const removedInbox = read("userNotifications", {
      kind: "event-asset-assignment-removed",
      sourceId: TOURNAMENT_EVENT_ID,
      "payload.ownerId": GROUP_A_RESOURCE_OWNER_ID,
      "payload.subEventId": TOURNAMENT_STAGE_ID,
      "payload.assetId": GROUP_A_TRANSPORT_ID
    });
    const checks = {
      novaAssignmentCleared: emptyOrZeroResource(nova, "Transport", GROUP_A_TRANSPORT_ID),
      novaRuntimeCleared: Q.sameJson(normalizedMetric(groupMetric(GROUP_A_ID, NOVA_ID, "Transport")), zeroMetric()),
      exactPendingReversal: Q.sameJson(stageCounters(), { activity: 1, groupsCount: 2, groupsPending: 1 }),
      sourceAssetAndMemberRequestsUnchanged: !!expectedSourceAsset && sameDomain(sourceAsset, expectedSourceAsset),
      removalNotificationExactOnce: removedOutbox.length === 1
        && Q.sameJson(sorted(removedOutbox[0].recipientUserIds), sorted([CASEY_ID, RILEY_ID]))
        && Q.text(removedOutbox[0].createdUser) === NOVA_ID
        && Q.text(removedOutbox[0].title) === "Asset assignment removed"
        && Q.text(removedOutbox[0].body) === "Assignment ended · QA Group A Nova Transport"
        && Q.text(removedOutbox[0].payload.resourceType) === "Transport"
        && removedInbox.length === 2
        && Q.sameJson(sorted(removedInbox.map(recipientId)), sorted([CASEY_ID, RILEY_ID]))
        && removedInbox.every(item => Q.number(item.occurrenceCount) === 1),
      rileyResourceUnchanged: recordMatches(riley, "Accommodation", GROUP_A_ACCOMMODATION_ID, 3, RILEY_ID)
        && Q.sameJson(normalizedMetric(groupMetric(GROUP_A_ID, RILEY_ID, "Accommodation")), metric(1, 1, 3)),
      unrelatedScopesByteIdentical: assertGroupControls(currentState),
      membershipsUnchanged: sameDomain(tournamentMembershipSnapshot(), currentState.baselineTournamentMemberships)
    };
    failChecks("group-unassign", checks, {
      nova, riley, sourceAsset, stage: stageCounters(), runtime: runtime(), removedOutbox, removedInbox
    });
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "group-unassign-verified",
      groupUnassignVerifiedAtIso: Q.nowIso()
    } });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "group-unassign-verified", checks,
      next: `Run restore-group-removal-branch asset-assignment ${CHECKPOINT}; this restores only the versioned Tournament branch.` });
  }

  function restoreGroupRemovalBranch() {
    Q.assertDeploymentSafety();
    const currentState = state();
    requirePhase(currentState, "group-unassign-verified");
    if (!sameDomain(normalDomainRaw(), currentState.normalDomainAfterAssignment)) {
      Q.fail(`${CHECKPOINT} refuses to restore the Tournament branch because the verified normal branch changed.`);
    }
    const baseline = currentState.groupBranchBaseline || {};
    restoreTournamentDocuments(baseline);
    if (!sameDomain(groupBranchDocuments(), baseline)) {
      Q.fail(`${CHECKPOINT} Tournament removal branch did not restore exactly.`);
    }
    const removalReadyAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "group-removal-ready",
      removalReadyAtIso,
      removalNotificationBaseline: notificationCounts()
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "group-removal-ready",
      removalReadyAtIso,
      checks: {
        exactTournamentRestore: true,
        normalBranchPreserved: true,
        groupBControlPreserved: sameDomain(groupBControlSnapshot(), currentState.groupBControl)
      },
      next: "As Casey, remove Riley once from the Tournament Event members. Do not remove Riley from the normal Event or edit an Asset membership."
    });
  }

  function recipientId(item) {
    return Q.text(item && (item.userId || item.recipientUserId || item.targetUserId
      || (item.payload && (item.payload.userId || item.payload.recipientUserId || item.payload.targetUserId))));
  }

  function verifyGroupManagerRemoval() {
    Q.assertDeploymentSafety();
    const currentState = state();
    requirePhase(currentState, "group-removal-ready");
    const memberships = tournamentMembershipSnapshot();
    const riley = groupResource(GROUP_A_RESOURCE_OWNER_ID, RILEY_ID);
    const nova = groupResource(GROUP_A_RESOURCE_OWNER_ID, NOVA_ID);
    const newOutbox = read("notificationOutbox", {
      $and: [relatedSelector(), { createdDate: { $gt: currentState.removalReadyAtIso } }]
    });
    const recipients = sorted(newOutbox.map(recipientId));
    const checks = {
      rileyRemovedFromTournamentTree: !exactActiveMembers(memberships, TOURNAMENT_EVENT_ID, USERS)
        && exactActiveMembers(memberships, TOURNAMENT_EVENT_ID, [CASEY_ID, NOVA_ID, LINA_ID])
        && exactActiveMembers(memberships, ROOM_A_ID, [CASEY_ID, NOVA_ID]),
      groupBMembershipUnchanged: exactActiveMembers(memberships, ROOM_B_ID, [LINA_ID]),
      removedManagerAssignmentCleared: emptyOrZeroResource(riley, "Accommodation", GROUP_A_ACCOMMODATION_ID),
      removedManagerRuntimeCleared: Q.sameJson(normalizedMetric(groupMetric(GROUP_A_ID, RILEY_ID, "Accommodation")), zeroMetric()),
      novaResourceUnchanged: recordMatches(nova, "Transport", GROUP_A_TRANSPORT_ID, 4, NOVA_ID)
        && Q.sameJson(normalizedMetric(groupMetric(GROUP_A_ID, NOVA_ID, "Transport")), metric(1, 1, 4)),
      exactPendingReversal: Q.sameJson(stageCounters(), { activity: 1, groupsCount: 2, groupsPending: 1 }),
      groupBByteIdentical: sameDomain(groupBControlSnapshot(), currentState.groupBControl),
      normalBranchByteIdentical: sameDomain(normalDomainRaw(), currentState.normalDomainAfterAssignment),
      sourceAssetRetained: Q.collection("assets").countDocuments({ assetId: GROUP_A_ACCOMMODATION_ID, status: "A" }) === 1,
      noUnrelatedNotificationRecipient: recipients.every(userId => !userId || userId === RILEY_ID)
    };
    failChecks("group-manager-removal", checks, {
      memberships, riley, nova, stage: stageCounters(), recipients, newOutbox
    });
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "complete",
      completedAtIso: Q.nowIso(),
      terminalSnapshot: {
        normal: normalSnapshot(),
        memberships,
        stage: stageCounters(),
        groupB: groupBControlSnapshot(),
        notificationRecipients: recipients
      }
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "complete",
      checks,
      notificationObservation: {
        outboxDelta: newOutbox.length,
        recipients,
        rule: "Riley may receive the documented Event-removal notification; no unrelated Assignment recipient is allowed."
      },
      next: "Reload Casey, Nova and Riley once, confirm the same terminal UI, then report the terminal checklist phrase."
    });
  }

  function status() {
    Q.assertDeploymentSafety();
    const currentState = state(false);
    if (!currentState) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId: CHECKPOINT,
        phase: "not-staged",
        next: `After the active checkpoint is reset, run stage asset-assignment ${CHECKPOINT}.`
      });
      return;
    }
    const baselineChecks = Q.text(currentState.phase) === "baseline-ready"
      ? assertBaseline(currentState)
      : null;
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: currentState.phase,
      identities: currentState.identities,
      baselineChecks,
      normal: normalSnapshot(),
      tournament: {
        stage: stageCounters(),
        memberships: tournamentMembershipSnapshot(),
        groupANovaTransport: normalizedMetric(groupMetric(GROUP_A_ID, NOVA_ID, "Transport")),
        groupARileyAccommodation: normalizedMetric(groupMetric(GROUP_A_ID, RILEY_ID, "Accommodation")),
        groupBLinaTransport: normalizedMetric(groupMetric(GROUP_B_ID, LINA_ID, "Transport")),
        groupBMatchesControl: sameDomain(groupBControlSnapshot(), currentState.groupBControl)
      },
      notifications: notificationCounts(),
      step10Boundary: currentState.step10Boundary ? {
        capturedAtIso: currentState.step10Boundary.capturedAtIso,
        available: true
      } : null,
      step16Boundary: currentState.step16Boundary ? {
        capturedAtIso: currentState.step16Boundary.capturedAtIso,
        available: true
      } : null
    });
  }

  function repairNormalSuppliesOwner() {
    Q.assertDeploymentSafety();
    const currentState = state();
    requirePhase(currentState, "baseline-ready");
    const asset = Q.collection("assets").findOne({ assetId: NORMAL_SUPPLIES_ID });
    if (!asset) Q.fail(`${CHECKPOINT} shared Supplies Asset is missing.`);
    const assignedCount = Q.collection("activityResources").countDocuments({
      ownerId: NORMAL_EVENT_ID,
      subEventId: NORMAL_TARGET_ID,
      "assetAssignmentIds.Supplies": NORMAL_SUPPLIES_ID
    });
    if (assignedCount !== 0) {
      Q.fail(`${CHECKPOINT} shared Supplies owner repair must run before its first assignment.`);
    }
    const existingMembers = read("activityMembers", { ownerType: "asset", ownerId: NORMAL_SUPPLIES_ID });
    const validRepairSource = existingMembers.length === 1
      && [NOVA_ID, RILEY_ID].includes(Q.text(existingMembers[0].userId))
      && Q.text(existingMembers[0].role) === "Member"
      && Q.text(existingMembers[0].status) === "accepted";
    if (!validRepairSource) {
      Q.fail(`${CHECKPOINT} shared Supplies membership is not in a repairable fixture state.`);
    }
    const repairedAtIso = Q.nowIso();
    const assetUpdate = Q.collection("assets").updateOne(
      { assetId: NORMAL_SUPPLIES_ID },
      { $set: {
        ownerUserId: NOVA_ID,
        createdUser: NOVA_ID,
        updatedUser: NOVA_ID,
        updatedDate: repairedAtIso
      } }
    );
    if (assetUpdate.matchedCount !== 1) {
      Q.fail(`${CHECKPOINT} shared Supplies Asset owner repair matched ${assetUpdate.matchedCount} records.`);
    }
    Q.collection("activityMembers").deleteMany({ ownerType: "asset", ownerId: NORMAL_SUPPLIES_ID });
    Q.collection("activityMembers").insertOne(member(
      NORMAL_SUPPLIES_ID,
      RILEY_ID,
      "Member",
      repairedAtIso,
      "asset"
    ));
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: currentState.phase,
      repairedAtIso,
      checks: {
        novaOwnsSharedSupplies: true,
        rileyAcceptedAssetMember: true,
        existingNormalTransportAndAccommodationPreserved: true
      },
      next: "Close and reopen Nova's Supplies Assign popup; QA Assignment Shared Supplies must be listed."
    });
  }

  function reset() {
    Q.assertDeploymentSafety();
    const currentState = state();
    clearFixture();
    Q.restoreSnapshots(currentState.snapshots || []);
    for (const saved of currentState.savedUserActivities || []) restoreUserActivities(saved);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: STATE_ID });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "reset-complete", resetAtIso: Q.nowIso() });
  }

  Q.assertDeploymentSafety();
  if (checkpointId !== CHECKPOINT) Q.fail(`this fixture is restricted to ${CHECKPOINT}.`);
  switch (command) {
    case "stage": stageFixture(); break;
    case "status": status(); break;
    case "repair-normal-supplies-owner": repairNormalSuppliesOwner(); break;
    case "verify-normal-assignment": verifyNormalAssignment(); break;
    case "verify-supply-contribution-delete": verifySupplyContributionDelete(); break;
    case "restore-normal-assignment-branch": restoreNormalAssignmentBranch(); break;
    case "repair-tournament-group-ids": repairTournamentGroupIds(); break;
    case "stage-step-10-boundary": stageStep10Boundary(); break;
    case "rollback-step-10-boundary": rollbackStep10Boundary(); break;
    case "verify-group-capacity-edit": verifyGroupCapacityEdit(); break;
    case "stage-step-16-boundary": stageStep16Boundary(); break;
    case "rollback-step-16-boundary": rollbackStep16Boundary(); break;
    case "verify-group-unassign": verifyGroupUnassign(); break;
    case "restore-group-removal-branch": restoreGroupRemovalBranch(); break;
    case "verify-group-manager-removal": verifyGroupManagerRemoval(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
