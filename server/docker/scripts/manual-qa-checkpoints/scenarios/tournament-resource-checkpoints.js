/* global ManualQa, db, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "event-domain-tournament-resource";
  const CHECKPOINT = "TOURNAMENT-RESOURCE-001";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const PREFIX = "manual-qa-checkpoint:v1:tournament-resource";
  const STATE_ID = Q.stateId(SCENARIO);
  const EVENT_ID = `${PREFIX}:event`;
  const STAGE_ID = `${EVENT_ID}:stage:qualifiers`;
  const GROUP_ID = `${STAGE_ID}:group:1`;
  const ROOM_ID = `random-room:${EVENT_ID}:${STAGE_ID}:${GROUP_ID}`;
  const RESOURCE_OWNER_ID = `${EVENT_ID}:${STAGE_ID}:${GROUP_ID}`;
  const CASEY_ID = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID) || "650000000000000000000061";
  const NOVA_ID = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID) || "650000000000000000000062";
  const RILEY_ID = "650000000000000000000063";
  const USERS = [CASEY_ID, NOVA_ID, RILEY_ID];
  const TRANSPORT_ID = `${PREFIX}:asset:casey-transport`;
  const ACCOMMODATION_ID = `${PREFIX}:asset:nova-accommodation`;
  const SUPPLIES_ID = `${PREFIX}:asset:riley-supplies`;
  const ASSET_IDS = [TRANSPORT_ID, ACCOMMODATION_ID, SUPPLIES_ID];
  const REQUEST_IDS = [
    `${PREFIX}:request:nova-transport`,
    `${PREFIX}:request:riley-accommodation`
  ];

  function sorted(values) {
    return [...new Set((values || []).map(Q.text).filter(Boolean))].sort();
  }

  function state(required = true) {
    const value = Q.collection(Q.STATE_COLLECTION).findOne({ _id: STATE_ID });
    if (!value && required) Q.fail(`${CHECKPOINT} is not staged.`);
    return value;
  }

  function dateIso(offsetMinutes) {
    return new Date(Date.now() + offsetMinutes * 60000).toISOString();
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
    if (saved.present) Q.collection("users").updateOne(selector, { $set: { activities: saved.value } });
    else Q.collection("users").updateOne(selector, { $unset: { activities: "" } });
  }

  function applyCounterDelta(userId, delta, hosting = false) {
    const increments = hosting
      ? { "activities.hosting": delta, "activities.event.all": delta, "activities.event.hosting": delta }
      : { "activities.events": delta, "activities.event.all": delta, "activities.event.active": delta };
    const result = Q.collection("users").updateOne(
      { $or: [{ _id: userId }, { userId }] },
      { $inc: increments }
    );
    if (result.matchedCount !== 1) Q.fail(`${CHECKPOINT} counter user '${userId}' disappeared.`);
  }

  function relatedSelector() {
    return { $or: [
      { sourceId: EVENT_ID },
      { sourceId: ROOM_ID },
      { parentEventId: EVENT_ID },
      { eventId: EVENT_ID },
      { eventId: RESOURCE_OWNER_ID },
      { ownerId: EVENT_ID },
      { ownerId: ROOM_ID },
      { ownerId: RESOURCE_OWNER_ID },
      { entityId: EVENT_ID },
      { "payload.eventId": EVENT_ID },
      { ownerId: { $regex: `^${PREFIX}` } },
      { entityId: { $regex: `^${PREFIX}` } }
    ] };
  }

  function selectors() {
    return [
      { collection: "events", selector: { $or: [{ sourceId: EVENT_ID }, { sourceId: ROOM_ID }] } },
      { collection: "activityMembers", selector: relatedSelector() },
      { collection: "activitySubEventGroups", selector: { ownerId: { $regex: `^${PREFIX}` } } },
      { collection: "activitySubEventStageRuntime", selector: { ownerId: EVENT_ID, subEventId: STAGE_ID } },
      { collection: "eventLeaderboardEntries", selector: { eventId: EVENT_ID } },
      { collection: "activityResources", selector: { $or: [
        { ownerId: RESOURCE_OWNER_ID },
        { assetOwnerUserId: { $in: USERS }, "assetAssignmentIds.Transport": TRANSPORT_ID },
        { assetOwnerUserId: { $in: USERS }, "assetAssignmentIds.Accommodation": ACCOMMODATION_ID },
        { assetOwnerUserId: { $in: USERS }, "assetAssignmentIds.Supplies": SUPPLIES_ID }
      ] } },
      { collection: "assets", selector: { $or: [{ _id: { $in: ASSET_IDS } }, { assetId: { $in: ASSET_IDS } }] } },
      { collection: "assetRequests", selector: { $or: [{ _id: { $in: REQUEST_IDS } }, { requestId: { $in: REQUEST_IDS } }, { assetId: { $in: ASSET_IDS } }] } },
      { collection: "notificationOutbox", selector: relatedSelector() },
      { collection: "userNotifications", selector: relatedSelector() },
      { collection: "affinityRecomputeTasks", selector: relatedSelector() }
    ];
  }

  function clearFixture() {
    for (const spec of selectors()) Q.collection(spec.collection).deleteMany(spec.selector);
  }

  function member(ownerId, userId, role, stagedAtIso) {
    const scope = ownerId === EVENT_ID ? "parent" : "room";
    return {
      _id: `${PREFIX}:member:${scope}:${userId}`,
      syncKey: `${PREFIX}:member:${ownerId}:${userId}`,
      ownerType: "event",
      ownerId,
      userId,
      role,
      status: "accepted",
      pendingSource: null,
      requestKind: null,
      invitedByUserId: null,
      actionAtIso: stagedAtIso,
      createdDate: stagedAtIso,
      createdUser: Q.ACTOR,
      updatedDate: stagedAtIso,
      updatedUser: Q.ACTOR
    };
  }

  function stageDefinition(stagedAtIso) {
    return {
      id: STAGE_ID,
      name: "Qualifiers",
      description: "Generated-group multi-owner resource aggregation checkpoint",
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: 180,
      startAt: dateIso(-30),
      endAt: dateIso(150),
      optional: false,
      capacityMin: 3,
      capacityMax: 3,
      tournamentGroupCapacityMin: 3,
      tournamentGroupCapacityMax: 3,
      tournamentLeaderboardType: "Score",
      tournamentAdvancePerGroup: 1,
      stageStatus: "A",
      stageStatusReason: "stage-started",
      stageStatusUpdatedAt: stagedAtIso,
      membersAccepted: 3,
      membersPending: 0,
      groupsCount: 1,
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

  function eventDocuments(stagedAtIso) {
    const stage = stageDefinition(stagedAtIso);
    const definition = { ...stage };
    for (const key of [
      "stageStatus", "stageStatusReason", "stageStatusUpdatedAt", "membersAccepted", "membersPending",
      "groupsCount", "groupsPending", "carsAccepted", "carsPending", "carsCapacityMin", "carsCapacityMax",
      "accommodationAccepted", "accommodationPending", "accommodationCapacityMin", "accommodationCapacityMax",
      "suppliesAccepted", "suppliesPending", "suppliesCapacityMin", "suppliesCapacityMax"
    ]) delete definition[key];
    const common = {
      status: "A",
      published: true,
      isTrashed: false,
      organizerUserId: CASEY_ID,
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
      acceptedMemberUserIds: USERS,
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [],
      mode: "Tournament",
      startAtIso: stage.startAt,
      endAtIso: stage.endAt,
      activity: 0,
      createdDate: stagedAtIso,
      createdUser: Q.ACTOR,
      updatedDate: stagedAtIso,
      updatedUser: Q.ACTOR
    };
    return [
      {
        ...common,
        _id: EVENT_ID,
        sourceId: EVENT_ID,
        syncKey: EVENT_ID,
        title: "QA TOURNAMENT-RESOURCE-001",
        subtitle: "Generated-group multi-owner resource aggregation",
        ownerUserId: CASEY_ID,
        creatorUserId: CASEY_ID,
        creatorName: "Casey Bridge",
        creatorInitials: "CB",
        creatorCity: "Austin",
        admins: [CASEY_ID],
        subEventsEnabled: true,
        subEventDefinitions: [definition],
        subEvents: [stage],
        currentStage: { id: STAGE_ID, name: "Qualifiers", stageNumber: 1, totalStages: 1, status: "A" },
        eventType: "event",
        topics: ["Manual QA", "Tournament", "Resources"]
      },
      {
        ...common,
        _id: ROOM_ID,
        sourceId: ROOM_ID,
        syncKey: `scheduler:${ROOM_ID}`,
        title: "Tournament Group A",
        subtitle: "Generated room for QA TOURNAMENT-RESOURCE-001.",
        ownerUserId: null,
        creatorUserId: null,
        admins: [],
        subEventsEnabled: false,
        subEventDefinitions: [],
        subEvents: [],
        parentEventId: EVENT_ID,
        parentSubEventId: STAGE_ID,
        generated: true,
        eventType: "tournament-room",
        groupId: GROUP_ID,
        imageUrl: "/media/public?key=images/system/tournament-room/v1/large.webp",
        topics: ["Manual QA"]
      }
    ];
  }

  function borrowRequest(requestId, userId, status, stagedAtIso) {
    const profile = Q.user(userId);
    const name = profile.name || userId;
    const initials = name.split(/\s+/).filter(Boolean).map(part => part[0]).join("").slice(0, 2).toUpperCase();
    return {
      id: requestId,
      userId,
      name,
      initials,
      gender: "",
      status,
      note: "Controlled pending group-resource request.",
      requestKind: "borrow",
      requestedAtIso: stagedAtIso,
      booking: {
        eventId: RESOURCE_OWNER_ID,
        eventTitle: "QA TOURNAMENT-RESOURCE-001 - Qualifiers - Group A",
        subEventId: STAGE_ID,
        subEventTitle: "Qualifiers",
        slotKey: "",
        slotLabel: "Group A",
        timeframe: "Tournament Qualifiers",
        startAtIso: dateIso(-30),
        endAtIso: dateIso(150),
        quantity: 1,
        totalAmount: 0,
        previousTotalAmount: null,
        currency: "USD",
        acceptedPolicyIds: [],
        paymentSessionId: null,
        inventoryApplied: false
      }
    };
  }

  function assetDocument(assetId, ownerUserId, type, title, capacityTotal, requests, stagedAtIso) {
    return {
      _id: assetId,
      syncKey: assetId,
      assetId,
      ownerUserId,
      type,
      title,
      subtitle: `${CHECKPOINT} controlled ${type.toLowerCase()}`,
      category: type === "Transport" ? "Car" : type === "Accommodation" ? "Hotel" : "Cooking",
      city: "Austin",
      capacityTotal,
      quantity: type === "Supplies" ? capacityTotal : 1,
      details: "Controlled Tournament resource aggregation asset.",
      routes: type === "Transport" ? ["Austin"] : [],
      policiesEnabled: false,
      policies: [],
      requests,
      visibility: "Public",
      status: "A",
      createdDate: stagedAtIso,
      createdUser: ownerUserId,
      updatedDate: stagedAtIso,
      updatedUser: ownerUserId
    };
  }

  function assetRequestDocument(asset, request, stagedAtIso) {
    return {
      _id: request.id,
      requestId: request.id,
      assetId: asset.assetId,
      ownerUserId: asset.ownerUserId,
      ownerKey: `${asset.ownerUserId}:${asset.assetId}`,
      assetCapacity: asset.capacityTotal,
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

  function counter(userId) {
    const activities = Q.ensureUser(userId, `${CHECKPOINT} counter user`).activities || {};
    const event = activities.event || {};
    return {
      userId,
      events: Q.number(activities.events),
      hosting: Q.number(activities.hosting),
      eventAll: Q.number(event.all),
      eventActive: Q.number(event.active),
      eventHosting: Q.number(event.hosting)
    };
  }

  function roleSnapshot() {
    return Q.collection("activityMembers").find({
      ownerType: "event",
      ownerId: { $in: [EVENT_ID, ROOM_ID] }
    }).sort({ ownerId: 1, userId: 1 }).toArray().map(item => ({
      ownerId: Q.text(item.ownerId),
      userId: Q.text(item.userId),
      role: Q.text(item.role),
      status: Q.text(item.status)
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
    return Q.collection("activityResources").find({ ownerId: RESOURCE_OWNER_ID, subEventId: STAGE_ID })
      .sort({ assetOwnerUserId: 1 }).toArray().map(item => ({
        ownerId: Q.text(item.ownerId),
        subEventId: Q.text(item.subEventId),
        assetOwnerUserId: Q.text(item.assetOwnerUserId),
        assetAssignmentIds: item.assetAssignmentIds || {},
        assetSettingsByType: item.assetSettingsByType || {},
        supplyContributionEntriesByAssetId: item.supplyContributionEntriesByAssetId || {}
      }));
  }

  function runtimeSnapshot() {
    const runtime = Q.collection("activitySubEventStageRuntime").findOne({ ownerId: EVENT_ID, subEventId: STAGE_ID }) || {};
    const byOwner = (((runtime.groupResourceMetricsByAssetOwnerId || {})[GROUP_ID]) || {});
    const normalized = {};
    for (const ownerId of Object.keys(byOwner).sort()) {
      normalized[ownerId] = {};
      for (const type of ["Transport", "Accommodation", "Supplies"]) {
        normalized[ownerId][type] = metric((byOwner[ownerId] || {})[type]);
      }
    }
    return {
      ownerId: Q.text(runtime.ownerId),
      subEventId: Q.text(runtime.subEventId),
      groupsCount: Q.number(runtime.groupsCount),
      byAssetOwner: normalized
    };
  }

  function eventSnapshot() {
    const root = Q.collection("events").findOne({ sourceId: EVENT_ID, eventType: "event" }) || {};
    const stage = (root.subEvents || []).find(item => Q.text(item && item.id) === STAGE_ID) || {};
    return {
      rootCount: Q.collection("events").countDocuments({ sourceId: EVENT_ID, eventType: "event" }),
      roomCount: Q.collection("events").countDocuments({ sourceId: ROOM_ID, generated: true, eventType: "tournament-room" }),
      leakedGeneratedRootCount: Q.collection("events").countDocuments({ sourceId: EVENT_ID, generated: true }),
      activity: Q.number(root.activity),
      groupsCount: Q.number(stage.groupsCount),
      groupsPending: Q.number(stage.groupsPending),
      stageStatus: Q.text(stage.stageStatus)
    };
  }

  function snapshot() {
    return {
      event: eventSnapshot(),
      roles: roleSnapshot(),
      resources: resourceSnapshot(),
      runtime: runtimeSnapshot(),
      counters: USERS.map(counter),
      notificationOutboxCount: Q.collection("notificationOutbox").countDocuments(relatedSelector()),
      userNotificationCount: Q.collection("userNotifications").countDocuments(relatedSelector())
    };
  }

  function exactRoles(value) {
    const expected = [
      ...USERS.map(userId => ({ ownerId: EVENT_ID, userId, role: userId === CASEY_ID ? "Admin" : "Member", status: "accepted" })),
      ...USERS.map(userId => ({ ownerId: ROOM_ID, userId, role: "Member", status: "accepted" }))
    ].sort((left, right) => left.ownerId.localeCompare(right.ownerId) || left.userId.localeCompare(right.userId));
    return value.length === expected.length && value.every((item, index) => (
      Q.text(item.ownerId) === expected[index].ownerId
      && Q.text(item.userId) === expected[index].userId
      && Q.text(item.role) === expected[index].role
      && Q.text(item.status) === expected[index].status
    ));
  }

  function countersMatch(left, right) {
    const leftByUser = new Map((left || []).map(item => [Q.text(item.userId), item]));
    return (right || []).length === leftByUser.size && (right || []).every(item => {
      const prior = leftByUser.get(Q.text(item.userId));
      return prior
        && Q.number(prior.events) === Q.number(item.events)
        && Q.number(prior.hosting) === Q.number(item.hosting)
        && Q.number(prior.eventAll) === Q.number(item.eventAll)
        && Q.number(prior.eventActive) === Q.number(item.eventActive)
        && Q.number(prior.eventHosting) === Q.number(item.eventHosting);
    });
  }

  function rolesMatch(left, right) {
    if ((left || []).length !== (right || []).length) return false;
    return (left || []).every((item, index) => {
      const prior = (right || [])[index] || {};
      return Q.text(item.ownerId) === Q.text(prior.ownerId)
        && Q.text(item.userId) === Q.text(prior.userId)
        && Q.text(item.role) === Q.text(prior.role)
        && Q.text(item.status) === Q.text(prior.status);
    });
  }

  function typeIds(record, type) {
    return sorted(((record.assetAssignmentIds || {})[type]) || []);
  }

  function typeSettings(record, type, assetId) {
    return (((record.assetSettingsByType || {})[type]) || {})[assetId] || null;
  }

  function exactRecord(record, ownerId, type, assetId, capacityMax) {
    if (!record || record.assetOwnerUserId !== ownerId || record.ownerId !== RESOURCE_OWNER_ID || record.subEventId !== STAGE_ID) return false;
    const otherTypes = ["Transport", "Accommodation", "Supplies"].filter(value => value !== type);
    const settings = typeSettings(record, type, assetId);
    return Q.sameJson(typeIds(record, type), [assetId])
      && otherTypes.every(value => typeIds(record, value).length === 0)
      && settings
      && Q.number(settings.capacityMin) === 0
      && Q.number(settings.capacityMax) === capacityMax
      && Q.number(settings.quantity) === 1
      && Q.text(settings.addedByUserId) === ownerId
      && Object.keys(record.supplyContributionEntriesByAssetId || {}).length === 0;
  }

  function expectedOwnerMetrics(ownerId, type) {
    const zero = { accepted: 0, pending: 0, capacityMin: 0, capacityMax: 0 };
    const result = { Transport: zero, Accommodation: zero, Supplies: zero };
    if (ownerId === CASEY_ID && type === "Transport") result.Transport = { accepted: 1, pending: 1, capacityMin: 0, capacityMax: 4 };
    if (ownerId === NOVA_ID && type === "Accommodation") result.Accommodation = { accepted: 1, pending: 1, capacityMin: 0, capacityMax: 3 };
    if (ownerId === RILEY_ID && type === "Supplies") result.Supplies = { accepted: 0, pending: 0, capacityMin: 0, capacityMax: 6 };
    return result;
  }

  function stageFixture() {
    Q.assertDeploymentSafety();
    if (checkpointId !== CHECKPOINT) Q.fail(`this fixture is restricted to ${CHECKPOINT}.`);
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    USERS.forEach(userId => Q.ensureUser(userId, `${CHECKPOINT} user`));
    const snapshots = Q.snapshotSpecs(selectors());
    const savedUserActivities = USERS.map(userActivities);
    clearFixture();
    const stagedAtIso = Q.nowIso();
    const transportRequest = borrowRequest(REQUEST_IDS[0], NOVA_ID, "pending", stagedAtIso);
    const accommodationRequest = borrowRequest(REQUEST_IDS[1], RILEY_ID, "pending", stagedAtIso);
    const assets = [
      assetDocument(TRANSPORT_ID, CASEY_ID, "Transport", "Casey Group Shuttle", 4, [transportRequest], stagedAtIso),
      assetDocument(ACCOMMODATION_ID, NOVA_ID, "Accommodation", "Nova Group Lodge", 3, [accommodationRequest], stagedAtIso),
      assetDocument(SUPPLIES_ID, RILEY_ID, "Supplies", "Riley Group Supplies", 6, [], stagedAtIso)
    ];
    try {
      Q.collection("events").insertMany(eventDocuments(stagedAtIso));
      Q.collection("activityMembers").insertMany([
        ...USERS.map(userId => member(EVENT_ID, userId, userId === CASEY_ID ? "Admin" : "Member", stagedAtIso)),
        ...USERS.map(userId => member(ROOM_ID, userId, "Member", stagedAtIso))
      ]);
      Q.collection("activitySubEventStageRuntime").insertOne({
        _id: `${PREFIX}:runtime`,
        syncKey: `${PREFIX}:runtime`,
        recordId: `${EVENT_ID}:${STAGE_ID}`,
        status: "A",
        ownerId: EVENT_ID,
        subEventId: STAGE_ID,
        stageStatus: "A",
        stageStatusReason: "stage-started",
        stageStatusUpdatedAt: stagedAtIso,
        groupsCount: 1,
        groupResourceMetricsByAssetOwnerId: {},
        createdDate: stagedAtIso,
        createdUser: Q.ACTOR,
        updatedDate: stagedAtIso,
        updatedUser: Q.ACTOR
      });
      Q.collection("eventLeaderboardEntries").insertMany(USERS.map((userId, index) => ({
        _id: `${PREFIX}:score:${userId}`,
        syncKey: `${PREFIX}:score:${userId}`,
        eventId: EVENT_ID,
        subEventId: STAGE_ID,
        groupId: GROUP_ID,
        entryType: "score",
        memberId: userId,
        scoreValue: 3 - index,
        note: `${CHECKPOINT} controlled group materialization`,
        createdAtIso: stagedAtIso,
        createdUser: CASEY_ID,
        updatedDate: stagedAtIso,
        updatedUser: CASEY_ID
      })));
      Q.collection("assets").insertMany(assets);
      Q.collection("assetRequests").insertMany([
        assetRequestDocument(assets[0], transportRequest, stagedAtIso),
        assetRequestDocument(assets[1], accommodationRequest, stagedAtIso)
      ]);
      applyCounterDelta(CASEY_ID, 1, true);
      [NOVA_ID, RILEY_ID].forEach(userId => applyCounterDelta(userId, 1));
      const baseline = snapshot();
      Q.collection(Q.STATE_COLLECTION).insertOne({
        _id: STATE_ID,
        scenario: SCENARIO,
        checkpointId: CHECKPOINT,
        phase: "baseline-ready",
        stagedAtIso,
        snapshots,
        savedUserActivities,
        baselineRoles: baseline.roles,
        baselineCounters: baseline.counters,
        baselineNotifications: {
          outbox: baseline.notificationOutboxCount,
          inbox: baseline.userNotificationCount
        }
      });
    } catch (error) {
      Q.fail(`stage failed after snapshot: ${Q.text(error && error.message)}. Run reset event-domain ${CHECKPOINT}.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "baseline-ready",
      identities: {
        eventId: EVENT_ID,
        stageId: STAGE_ID,
        groupId: GROUP_ID,
        roomId: ROOM_ID,
        resourceOwnerId: RESOURCE_OWNER_ID,
        caseyTransportId: TRANSPORT_ID,
        novaAccommodationId: ACCOMMODATION_ID,
        rileySuppliesId: SUPPLIES_ID
      },
      baseline: snapshot(),
      next: "Open the three managed sessions and execute the complete TOURNAMENT-RESOURCE-001 click/check sequence."
    });
  }

  function verifyBaseline(currentState, current) {
    const checks = {
      exactRootAndRoom: current.event.rootCount === 1 && current.event.roomCount === 1 && current.event.leakedGeneratedRootCount === 0,
      activeStartedStage: current.event.groupsCount === 1 && current.event.groupsPending === 0 && current.event.activity === 0 && current.event.stageStatus === "A",
      exactMembershipRoles: exactRoles(current.roles) && rolesMatch(current.roles, currentState.baselineRoles),
      noResourceWrites: current.resources.length === 0 && Object.keys(current.runtime.byAssetOwner).length === 0,
      countersStable: countersMatch(current.counters, currentState.baselineCounters),
      noResourceNotifications: current.notificationOutboxCount === Q.number(currentState.baselineNotifications.outbox)
        && current.userNotificationCount === Q.number(currentState.baselineNotifications.inbox)
    };
    const failed = Object.entries(checks).filter(([, value]) => !value).map(([key]) => key);
    if (failed.length > 0) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId: CHECKPOINT,
        phase: "baseline-diagnostic",
        failed,
        expectedRoles: currentState.baselineRoles,
        actualRoles: current.roles,
        expectedCounters: currentState.baselineCounters,
        actualCounters: current.counters
      });
      Q.fail(`${CHECKPOINT} baseline checks failed: ${failed.join(", ")}.`);
    }
    return checks;
  }

  function status() {
    Q.assertDeploymentSafety();
    const currentState = state(false);
    if (!currentState) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "not-staged" });
      return;
    }
    const current = snapshot();
    const baselineChecks = currentState.phase === "baseline-ready" ? verifyBaseline(currentState, current) : null;
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: currentState.phase,
      baselineChecks,
      oracle: current
    });
  }

  function verifyAssignments() {
    Q.assertDeploymentSafety();
    const currentState = state();
    if (currentState.phase !== "baseline-ready") {
      Q.fail(`${CHECKPOINT} assignment verification requires phase 'baseline-ready', found '${Q.text(currentState.phase)}'.`);
    }
    const current = snapshot();
    const byOwner = Object.fromEntries(current.resources.map(record => [record.assetOwnerUserId, record]));
    const runtimeOwners = current.runtime.byAssetOwner;
    const checks = {
      exactThreeOwnerWrites: current.resources.length === 3
        && exactRecord(byOwner[CASEY_ID], CASEY_ID, "Transport", TRANSPORT_ID, 4)
        && exactRecord(byOwner[NOVA_ID], NOVA_ID, "Accommodation", ACCOMMODATION_ID, 3)
        && exactRecord(byOwner[RILEY_ID], RILEY_ID, "Supplies", SUPPLIES_ID, 6),
      exactRuntimeOwnerSet: Q.sameJson(sorted(Object.keys(runtimeOwners)), sorted(USERS)),
      exactCaseyMetrics: Q.sameJson(runtimeOwners[CASEY_ID], expectedOwnerMetrics(CASEY_ID, "Transport")),
      exactNovaMetrics: Q.sameJson(runtimeOwners[NOVA_ID], expectedOwnerMetrics(NOVA_ID, "Accommodation")),
      exactRileyMetrics: Q.sameJson(runtimeOwners[RILEY_ID], expectedOwnerMetrics(RILEY_ID, "Supplies")),
      exactCounterPropagation: current.event.groupsCount === 1 && current.event.groupsPending === 2 && current.event.activity === 2,
      exactRootAndRoom: current.event.rootCount === 1 && current.event.roomCount === 1 && current.event.leakedGeneratedRootCount === 0,
      unchangedMembershipRoles: exactRoles(current.roles) && rolesMatch(current.roles, currentState.baselineRoles),
      unchangedUserCounters: countersMatch(current.counters, currentState.baselineCounters),
      noUndocumentedNotifications: current.notificationOutboxCount === Q.number(currentState.baselineNotifications.outbox)
        && current.userNotificationCount === Q.number(currentState.baselineNotifications.inbox)
    };
    const failed = Object.entries(checks).filter(([, value]) => !value).map(([key]) => key);
    if (failed.length > 0) Q.fail(`${CHECKPOINT} assignment checks failed: ${failed.join(", ")}.`);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "assignments-verified",
      assignmentsVerifiedAtIso: Q.nowIso(),
      verifiedSnapshot: current
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "assignments-verified",
      checks,
      oracle: current,
      next: "The persisted owner/type/group scope, counters, role isolation and notification no-op all passed."
    });
  }

  function reset() {
    Q.assertDeploymentSafety();
    const currentState = state();
    Q.restoreSnapshots(currentState.snapshots || []);
    for (const saved of currentState.savedUserActivities || []) restoreUserActivities(saved);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: STATE_ID });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "reset-complete", resetAtIso: Q.nowIso() });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stageFixture(); break;
    case "status": status(); break;
    case "verify-tournament-resource": verifyAssignments(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
