/* global ManualQa, db, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "asset-domain";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const hostUserId = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID)
    || "650000000000000000000061";
  const participantUserId = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID)
    || "650000000000000000000062";
  const thirdUserId = "650000000000000000000063";
  const PREFIX = "manual-qa-checkpoint:v1:asset-domain";
  const PRIMARY_ASSET_ID = `${PREFIX}:asset:primary`;
  const SECONDARY_ASSET_ID = `${PREFIX}:asset:secondary`;
  const TERTIARY_ASSET_ID = `${PREFIX}:asset:tertiary`;
  const PAID_ASSET_ID = `${PREFIX}:asset:paid`;
  const BORROW_PAYMENT_CARD_ID = `${PREFIX}:card:nova-barion-4444`;
  const EVENT_ID = `${PREFIX}:event`;
  const SUB_EVENT_ID = `${EVENT_ID}:sub-event:transport`;
  const GROUP_A_ID = `${SUB_EVENT_ID}:group:1`;
  const GROUP_B_ID = `${SUB_EVENT_ID}:group:2`;
  const GROUP_A_RESOURCE_OWNER_ID = `${EVENT_ID}:${SUB_EVENT_ID}:${GROUP_A_ID}`;
  const GROUP_B_RESOURCE_OWNER_ID = `${EVENT_ID}:${SUB_EVENT_ID}:${GROUP_B_ID}`;
  const ASSET_IDS = [PRIMARY_ASSET_ID, SECONDARY_ASSET_ID, TERTIARY_ASSET_ID, PAID_ASSET_ID];
  const IDS = [...ASSET_IDS, EVENT_ID, SUB_EVENT_ID, GROUP_A_ID, GROUP_B_ID];
  const LIFE_CHECKPOINT = "ASSET-LIFE-001";
  const VISIBILITY_CHECKPOINT = "ASSET-VIS-001";
  const BORROW_CHECKPOINT = "ASSET-BORROW-001";
  const provider = Q.text(process.env.MANUAL_QA_PAYMENT_PROVIDER).toLowerCase();
  const providerConnected = Q.text(process.env.MANUAL_QA_PAYMENT_PROVIDER_CONNECTED) === "true";
  const requires3ds = Q.text(process.env.MANUAL_QA_PAYMENT_REQUIRES_3DS) === "true";
  const VISIBILITY_FRIEND_USER_ID = "178e8d0cbe164fa3fede5884";
  const VISIBILITY_UNRELATED_USER_ID = "2d520f3c98b0440c1556f4af";
  const VISIBILITY_EVENT_ID = `${PREFIX}:visibility:event`;
  const VISIBILITY_SUB_EVENT_ID = `${VISIBILITY_EVENT_ID}:sub-event:transport`;
  const VISIBILITY_EDITED_VISIBILITY = "Invitation only";
  const VISIBILITY_FIXTURE_SCHEMA_VERSION = 2;
  const VISIBILITY_ASSETS = {
    public: {
      assetId: `${PREFIX}:asset:visibility:public`,
      title: "QA ASSET-VIS-001 Public Transport",
      visibility: "Public"
    },
    friends: {
      assetId: `${PREFIX}:asset:visibility:friends`,
      title: "QA ASSET-VIS-001 Friends Transport",
      visibility: "Friends only"
    },
    invitation: {
      assetId: `${PREFIX}:asset:visibility:invitation`,
      title: "QA ASSET-VIS-001 Invitation Transport",
      visibility: "Invitation only"
    }
  };
  const VISIBILITY_ASSET_IDS = Object.values(VISIBILITY_ASSETS).map(value => value.assetId);
  const VISIBILITY_TITLES = Object.values(VISIBILITY_ASSETS).map(value => value.title);
  const LIFE_INITIAL_SUBTITLE = "Initial shared-field value";
  const LIFE_EDITED_SUBTITLE = "Edited shared-field value";
  const LIFE_ASSETS = {
    Transport: {
      title: "QA ASSET-LIFE-001 Transport",
      category: "Sedan",
      capacityTotal: 4,
      quantity: 2,
      details: "Manual QA Transport lifecycle control.",
      sourceLink: "https://example.com/qa/asset-life-001/transport"
    },
    Accommodation: {
      title: "QA ASSET-LIFE-001 Accommodation",
      category: "Apartment",
      capacityTotal: 6,
      quantity: 3,
      details: "Manual QA Accommodation lifecycle control.",
      sourceLink: "https://example.com/qa/asset-life-001/accommodation"
    },
    Supplies: {
      title: "QA ASSET-LIFE-001 Supplies",
      category: "Safety",
      capacityTotal: 12,
      quantity: 8,
      details: "Manual QA Supplies lifecycle control.",
      sourceLink: "https://example.com/qa/asset-life-001/supplies"
    }
  };
  const LIFE_TITLES = Object.values(LIFE_ASSETS).map(value => value.title);

  const CHECKPOINTS = {
    [LIFE_CHECKPOINT]: {
      stage: "lifecycle-empty",
      why: "Prove all three Asset type schemas, managed media, one shared-field edit and terminal Transport deletion in one bounded lifecycle.",
      action: "As Casey, create the three named Asset controls exactly once through the normal Asset editors, then stop at the Create phrase in the checklist.",
      expected: "One active Transport, Accommodation and Supplies record exists with distinct stable IDs and exact type fields; the shared media path is proven on Transport and every supplied image URL is managed; each Save-confirmed type counter increases immediately and exactly once.",
      worker: "MUST NOT use a scheduler. Ordinary direct writes and the existing affinity projection may run; no fixture command may fabricate a lifecycle transition."
    },
    [VISIBILITY_CHECKPOINT]: {
      stage: "visibility-edit",
      why: "Prove owner, deterministic friend and unrelated-user Asset discovery boundaries, category filtering and reload reconstruction after one owner visibility edit.",
      action: "Compare the baseline target sets, exercise the Transport category filter, then change only the Public control to Invitation only as Casey and compare the reloaded three-user matrix.",
      expected: "Baseline: Casey owns all three and explores none, Lina explores Public plus Friends, and Liam explores Public only. After the Public control becomes Invitation only, Lina explores Friends only and Liam explores no target; denied detail reads expose no hidden data.",
      worker: "MUST NOT manually trigger a scheduler. List/detail/filter reads are side-effect free; exactly one normal owner visibility Save and its ordinary Asset affinity-recompute task are allowed. No borrow, member, assignment, outbox or notification write is allowed."
    },
    "ASSET-MEMBER-001": {
      stage: "member-empty",
      why: "Prove that an Asset Members invitation creates one asset-scoped pending identity and never an event membership.",
      action: "As the asset owner, open Manual QA Primary Transport, invite the staged participant once and save once.",
      expected: "One pending asset member and one recipient invitation identify the same asset, owner, inviter and participant; no event member is created.",
      worker: "MUST NOT use a scheduler. A direct notification outbox item is conditional."
    },
    "ASSET-MEMBER-002": {
      stage: "member-two-pending",
      why: "Prove accepted and rejected asset invitations independently while preserving event-role isolation.",
      action: "As the participant, accept the Primary Transport invitation. As the third user, reject the Secondary Transport invitation. Reopen both asset member lists.",
      expected: "Primary has one accepted member; Secondary has no live pending/accepted row for the rejected user; neither user becomes Event Admin.",
      worker: "MUST NOT use a scheduler. Direct membership/outbox effects are conditional and must remain exact-once."
    },
    "ASSET-ASSIGN-001": {
      stage: "assignment-empty",
      why: "Prove that one accepted participant-owned asset can be assigned to exactly one event sub-event with consistent capacity and identity.",
      action: "As event host, open Manual QA Asset Assignment Event, edit the Transport sub-event resources and assign Manual QA Primary Transport once with capacity 4.",
      expected: "Event Resources and the persisted record agree on event, sub-event, asset owner, asset ID and capacity; event and asset membership counts do not duplicate.",
      worker: "MUST NOT use a scheduler unless the UI explicitly reports a named availability consumer; direct resource recompute/outbox effects are conditional."
    },
    [BORROW_CHECKPOINT]: {
      stage: "borrow-empty",
      why: "Prove one-unit free and paid scoped Borrow requests, independent repeated request cards, overlap-aware capacity, and scope-local organizer-only counters.",
      action: "After the managed browser launcher hands off control, use Group A Resource Explore and follow the deduplicated ASSET-BORROW-001 guide with Nova, Riley and Casey.",
      expected: "Group A starts with no Transport assignment. Capacity, Reject and Cancel are free controls; Paid is a 3200 HUF Barion control. Every Borrow quantity is locked to one. Group B retains Lina's accepted two-item Capacity reservation. No request, checkout or payment exists for Group A at baseline.",
      worker: "MUST NOT use a scheduler. Borrow writes one independent request per submission plus its scoped resource, notification and optional payment effects. Organizer-only changes only the selected membership scope."
    }
  };

  function config() {
    const value = CHECKPOINTS[checkpointId];
    if (!value) Q.fail(`unsupported asset-domain checkpoint '${checkpointId}'.`);
    return value;
  }

  function dateIso(offsetMinutes) {
    return new Date(Date.now() + offsetMinutes * 60000).toISOString();
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
      cancellationPolicy: {
        enabled: false,
        rules: []
      },
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

  function paidBorrowPricingDocument() {
    return {
      ...disabledAssetPricingDocument(),
      mode: "fixed",
      basePrice: 3200,
      currency: "HUF",
      taxMode: "included",
      chargeType: "per_attendee",
      enabled: true
    };
  }

  function borrowPaymentCardDocument(stagedAtIso) {
    return {
      _id: BORROW_PAYMENT_CARD_ID,
      version: 0,
      userId: participantUserId,
      provider: "barion",
      providerPaymentMethodRef: "pm_sim_checkout_nova_barion_4444",
      brand: "Mastercard",
      last4: "4444",
      expiryMonth: 9,
      expiryYear: 2029,
      expiryKey: 202909,
      cardholderName: "NOVA SOCIAL",
      artworkKey: "graphite",
      status: "active",
      createdAtIso: stagedAtIso,
      updatedAtIso: stagedAtIso
    };
  }

  function sameRelaxedPlainJson(left, right) {
    const plain = value => JSON.parse(EJSON.stringify(value, null, 0, { relaxed: true }));
    return Q.sameJson(plain(left), plain(right));
  }

  function assetDocument(assetId, ownerUserId, title) {
    const now = Q.nowIso();
    return {
      _id: assetId,
      _class: "com.raxim.myscoutee.profile.data.document.Asset",
      syncKey: assetId,
      assetId,
      ownerUserId,
      type: "Transport",
      title,
      subtitle: "Manual QA controlled transport",
      category: "Transport",
      city: "Austin",
      capacityTotal: 4,
      quantity: 1,
      details: "Controlled manual-QA asset",
      imageUrl: "",
      sourceLink: "",
      routes: ["Austin"],
      policiesEnabled: false,
      policies: [],
      pricing: disabledAssetPricingDocument(),
      requests: [],
      visibility: "Public",
      status: "A",
      createdDate: now,
      createdUser: ownerUserId,
      updatedDate: now,
      updatedUser: ownerUserId
    };
  }

  function visibilityAssetDocument(definition) {
    const document = assetDocument(definition.assetId, hostUserId, definition.title);
    document.subtitle = `${definition.visibility} discovery control`;
    document.category = "Sedan";
    document.city = "";
    document.details = `Manual QA ${definition.visibility} Asset visibility control.`;
    document.routes = [];
    document.sourceLink = `https://example.com/qa/asset-vis-001/${definition.visibility.toLowerCase().replaceAll(" ", "-")}`;
    document.visibility = definition.visibility;
    return document;
  }

  function visibilityEventDocument() {
    const now = Q.nowIso();
    const subEvent = {
      id: VISIBILITY_SUB_EVENT_ID,
      name: "QA Visibility Stage",
      description: "Read-only Transport Explore scaffold",
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: 60,
      optional: false,
      capacityMin: 1,
      capacityMax: 3
    };
    return {
      _id: VISIBILITY_EVENT_ID,
      sourceId: VISIBILITY_EVENT_ID,
      syncKey: VISIBILITY_EVENT_ID,
      title: "QA ASSET-VIS-001 Event",
      subtitle: "Read-only Asset Explore scaffold",
      status: "A",
      published: true,
      isTrashed: false,
      ownerUserId: hostUserId,
      creatorUserId: hostUserId,
      admins: [hostUserId],
      visibility: "public",
      mode: "Casual",
      subEventsEnabled: true,
      subEventDefinitions: [subEvent],
      subEvents: [subEvent],
      capacityTotal: 3,
      acceptedMembers: 3,
      pendingMembers: 0,
      acceptedMemberUserIds: [hostUserId, VISIBILITY_FRIEND_USER_ID, VISIBILITY_UNRELATED_USER_ID],
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      startAtIso: dateIso(180),
      endAtIso: dateIso(300),
      createdDate: now,
      createdUser: hostUserId,
      updatedDate: now,
      updatedUser: hostUserId
    };
  }

  function visibilityEventMemberDocument(userId, role) {
    const document = eventMemberDocument(userId, role);
    document._id = `${PREFIX}:visibility:event-member:${userId}`;
    document.syncKey = document._id;
    document.ownerId = VISIBILITY_EVENT_ID;
    document.metWhere = "QA ASSET-VIS-001 Event";
    return document;
  }

  function memberDocument(assetId, userId, status, invitedByUserId = hostUserId) {
    const now = Q.nowIso();
    const id = `${PREFIX}:member:${assetId.split(":").pop()}:${userId}`;
    return {
      _id: id,
      syncKey: id,
      ownerType: "asset",
      ownerId: assetId,
      userId,
      role: "Member",
      status,
      pendingSource: status === "pending" ? "admin" : null,
      requestKind: status === "pending" ? "invite" : null,
      invitedByUserId: status === "pending" ? invitedByUserId : null,
      metAtIso: now,
      actionAtIso: now,
      metWhere: "Manual QA Asset Members",
      createdDate: now,
      createdUser: hostUserId,
      updatedDate: now,
      updatedUser: hostUserId
    };
  }

  function eventDocument() {
    const now = Q.nowIso();
    const subEvent = {
      id: SUB_EVENT_ID,
      name: "Transport",
      description: "Manual QA transport resource",
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: 60,
      optional: false,
      capacityMin: 1,
      capacityMax: 4
    };
    return {
      _id: EVENT_ID,
      sourceId: EVENT_ID,
      syncKey: EVENT_ID,
      title: "Manual QA Asset Assignment Event",
      subtitle: "Controlled event-resource checkpoint",
      status: "A",
      published: true,
      isTrashed: false,
      ownerUserId: hostUserId,
      creatorUserId: hostUserId,
      admins: [hostUserId],
      visibility: "public",
      mode: "Casual",
      subEventsEnabled: true,
      subEventDefinitions: [subEvent],
      subEvents: [subEvent],
      acceptedMembers: 1,
      pendingMembers: 0,
      acceptedMemberUserIds: [participantUserId],
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      startAtIso: dateIso(180),
      endAtIso: dateIso(300),
      createdDate: now,
      createdUser: hostUserId,
      updatedDate: now,
      updatedUser: hostUserId
    };
  }

  function eventMemberDocument(userId, role) {
    const now = Q.nowIso();
    const id = `${PREFIX}:event-member:${userId}`;
    return {
      _id: id,
      syncKey: id,
      ownerType: "event",
      ownerId: EVENT_ID,
      userId,
      role,
      status: "accepted",
      pendingSource: null,
      requestKind: null,
      invitedByUserId: null,
      organizerOnly: false,
      actionAtIso: now,
      createdDate: now,
      createdUser: hostUserId,
      updatedDate: now,
      updatedUser: hostUserId
    };
  }

  function borrowAssetDocument(assetId, title, quantity, stagedAtIso, requests = [], paid = false) {
    const document = assetDocument(assetId, hostUserId, title);
    return {
      ...document,
      category: "Sedan",
      city: "Austin",
      capacityTotal: 4,
      quantity,
      details: `Controlled ${paid ? "paid" : "free"} Asset borrow lifecycle.`,
      sourceLink: `https://example.com/qa/asset-borrow-001/${assetId.split(":").pop()}`,
      routes: ["Austin"],
      pricing: paid ? paidBorrowPricingDocument() : disabledAssetPricingDocument(),
      requests,
      createdDate: stagedAtIso,
      updatedDate: stagedAtIso
    };
  }

  function borrowBooking(eventId, startAtIso, endAtIso, quantity, timeframe) {
    return {
      eventId,
      eventTitle: "QA ASSET-BORROW-001 Tournament",
      subEventId: SUB_EVENT_ID,
      subEventTitle: "QA Borrow Stage",
      slotKey: SUB_EVENT_ID,
      slotLabel: "QA Borrow Stage",
      timeframe,
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

  function borrowRequestRecord(id, userId, status, eventId, startAtIso, endAtIso, quantity, timeframe) {
    const user = Q.ensureUser(userId, `${BORROW_CHECKPOINT} borrower`);
    return {
      _id: id,
      userId,
      name: Q.text(user.name),
      initials: Q.text(user.initials),
      gender: Q.text(user.gender),
      status,
      note: status === "accepted" ? "Borrow request approved by the owner." : "Awaiting owner confirmation.",
      requestKind: "borrow",
      requestedAtIso: startAtIso,
      booking: borrowBooking(eventId, startAtIso, endAtIso, quantity, timeframe)
    };
  }

  function borrowRequestProjection(assetId, request, stagedAtIso, assetCapacity = 4) {
    const requestId = Q.text(request._id || request.id || request.requestId);
    return {
      _id: `${assetId}:request:${requestId}`,
      requestId,
      assetId,
      ownerUserId: hostUserId,
      ownerKey: `asset:${assetId}`,
      assetCapacity,
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

  function borrowMemberDocument(assetId, userId, stagedAtIso) {
    const id = `${PREFIX}:borrow-member:${assetId.split(":").pop()}:${userId}`;
    return {
      _id: id,
      syncKey: id,
      ownerType: "asset",
      ownerId: assetId,
      userId,
      role: "Member",
      status: "accepted",
      pendingSource: null,
      requestKind: null,
      invitedByUserId: null,
      organizerOnly: false,
      actionAtIso: stagedAtIso,
      metAtIso: stagedAtIso,
      metWhere: "QA ASSET-BORROW-001 Tournament",
      createdDate: stagedAtIso,
      createdUser: hostUserId,
      updatedDate: stagedAtIso,
      updatedUser: hostUserId
    };
  }

  function borrowActivityMemberDocument(ownerType, ownerId, userId, role, stagedAtIso, suffix) {
    const id = `${PREFIX}:borrow-${suffix}:${userId}`;
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
      organizerOnly: false,
      actionAtIso: stagedAtIso,
      metAtIso: stagedAtIso,
      metWhere: "QA ASSET-BORROW-001 Tournament",
      createdDate: stagedAtIso,
      createdUser: hostUserId,
      updatedDate: stagedAtIso,
      updatedUser: hostUserId
    };
  }

  function borrowEventDocument(stagedAtIso, startAtIso, endAtIso) {
    const stage = {
      id: SUB_EVENT_ID,
      name: "QA Borrow Stage",
      description: "Generated-group free Asset borrow lifecycle",
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: Math.max(1, Math.round((new Date(endAtIso).getTime() - new Date(startAtIso).getTime()) / 60000)),
      optional: false,
      capacityMin: 4,
      capacityMax: 4,
      tournamentGroupCapacityMin: 1,
      tournamentGroupCapacityMax: 3,
      tournamentLeaderboardType: "Score",
      tournamentAdvancePerGroup: 1,
      startAt: startAtIso,
      endAt: endAtIso,
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
    const definition = { ...stage };
    for (const key of [
      "stageStatus", "stageStatusReason", "stageStatusUpdatedAt", "membersAccepted", "membersPending",
      "groupsPending", "carsAccepted", "carsPending", "carsCapacityMin", "carsCapacityMax",
      "accommodationAccepted", "accommodationPending", "accommodationCapacityMin", "accommodationCapacityMax",
      "suppliesAccepted", "suppliesPending", "suppliesCapacityMin", "suppliesCapacityMax"
    ]) delete definition[key];
    return {
      _id: EVENT_ID,
      sourceId: EVENT_ID,
      syncKey: EVENT_ID,
      title: "QA ASSET-BORROW-001 Tournament",
      subtitle: "Free Borrow, overlap and Statistics control",
      status: "A",
      published: true,
      expired: false,
      isTrashed: false,
      ownerUserId: hostUserId,
      creatorUserId: hostUserId,
      organizerUserId: hostUserId,
      admins: [hostUserId],
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
      acceptedMemberUserIds: [hostUserId, participantUserId, thirdUserId, VISIBILITY_FRIEND_USER_ID],
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [],
      subEventsEnabled: true,
      subEventDefinitions: [definition],
      subEvents: [stage],
      currentStage: { id: SUB_EVENT_ID, name: stage.name, stageNumber: 1, totalStages: 1, status: "A" },
      eventType: "event",
      topics: ["Manual QA", "Asset", "Borrow"],
      startAtIso,
      endAtIso,
      activity: 0,
      createdDate: stagedAtIso,
      createdUser: hostUserId,
      updatedDate: stagedAtIso,
      updatedUser: hostUserId
    };
  }

  function zeroResourceMetric() {
    return { accepted: 0, pending: 0, capacityMin: 0, capacityMax: 0 };
  }

  function transportResourceMetric(accepted, pending) {
    return { accepted, pending, capacityMin: 0, capacityMax: 4 };
  }

  function borrowGroupBResourceDocument(stagedAtIso) {
    return {
      _id: `${PREFIX}:borrow-resource:group-b:lina`,
      syncKey: `${PREFIX}:borrow-resource:group-b:lina`,
      recordId: `${VISIBILITY_FRIEND_USER_ID}:${GROUP_B_RESOURCE_OWNER_ID}:${SUB_EVENT_ID}`,
      ownerKey: `${VISIBILITY_FRIEND_USER_ID}:${GROUP_B_RESOURCE_OWNER_ID}`,
      status: "A",
      ownerId: GROUP_B_RESOURCE_OWNER_ID,
      subEventId: SUB_EVENT_ID,
      assetOwnerUserId: VISIBILITY_FRIEND_USER_ID,
      assetAssignmentIds: { Transport: [PRIMARY_ASSET_ID] },
      assetSettingsByType: {
        Transport: {
          [PRIMARY_ASSET_ID]: {
            capacityMin: 0,
            capacityMax: 4,
            quantity: 2,
            addedByUserId: VISIBILITY_FRIEND_USER_ID,
            routeEnabled: true,
            routes: ["Austin"]
          }
        }
      },
      supplyContributionEntriesByAssetId: {},
      resourceMetricsByType: {
        Transport: transportResourceMetric(1, 0),
        Accommodation: zeroResourceMetric(),
        Supplies: zeroResourceMetric()
      },
      createdDate: stagedAtIso,
      createdUser: VISIBILITY_FRIEND_USER_ID,
      updatedDate: stagedAtIso,
      updatedUser: VISIBILITY_FRIEND_USER_ID
    };
  }

  function borrowRuntimeDocument(stagedAtIso) {
    return {
      _id: `${PREFIX}:borrow-runtime`,
      syncKey: `${PREFIX}:borrow-runtime`,
      recordId: `${EVENT_ID}:${SUB_EVENT_ID}`,
      status: "A",
      ownerId: EVENT_ID,
      subEventId: SUB_EVENT_ID,
      stageStatus: "A",
      stageStatusReason: "stage-started",
      stageStatusUpdatedAt: stagedAtIso,
      groupsCount: 2,
      groupResourceMetricsByAssetOwnerId: {
        [GROUP_B_ID]: {
          [VISIBILITY_FRIEND_USER_ID]: {
            Transport: transportResourceMetric(1, 0),
            Accommodation: zeroResourceMetric(),
            Supplies: zeroResourceMetric()
          }
        }
      },
      groupResourceReadAtByUserId: {},
      createdDate: stagedAtIso,
      createdUser: hostUserId,
      updatedDate: stagedAtIso,
      updatedUser: hostUserId
    };
  }

  function borrowLeaderboardRows(stagedAtIso) {
    const groupAUsers = [hostUserId, participantUserId, thirdUserId];
    return [
      ...groupAUsers.map((userId, index) => ({
        _id: `${PREFIX}:borrow-score:group-a:${userId}`,
        syncKey: `${PREFIX}:borrow-score:group-a:${userId}`,
        eventId: EVENT_ID,
        subEventId: SUB_EVENT_ID,
        groupId: GROUP_A_ID,
        entryType: "score",
        memberId: userId,
        scoreValue: 3 - index,
        note: `${BORROW_CHECKPOINT} Group A control`,
        createdAtIso: stagedAtIso,
        createdUser: hostUserId,
        updatedDate: stagedAtIso,
        updatedUser: hostUserId
      })),
      {
        _id: `${PREFIX}:borrow-score:group-b:${VISIBILITY_FRIEND_USER_ID}`,
        syncKey: `${PREFIX}:borrow-score:group-b:${VISIBILITY_FRIEND_USER_ID}`,
        eventId: EVENT_ID,
        subEventId: SUB_EVENT_ID,
        groupId: GROUP_B_ID,
        entryType: "score",
        memberId: VISIBILITY_FRIEND_USER_ID,
        scoreValue: 1,
        note: `${BORROW_CHECKPOINT} Group B negative control`,
        createdAtIso: stagedAtIso,
        createdUser: hostUserId,
        updatedDate: stagedAtIso,
        updatedUser: hostUserId
      }
    ];
  }

  function borrowUserActivities(userId) {
    const user = Q.ensureUser(userId, `${BORROW_CHECKPOINT} user`);
    return {
      userId,
      present: Object.prototype.hasOwnProperty.call(user, "activities"),
      value: user.activities || {}
    };
  }

  function restoreBorrowUserActivities(saved) {
    const selector = { $or: [{ _id: saved.userId }, { userId: saved.userId }] };
    if (saved.present) {
      Q.collection("users").updateOne(selector, { $set: { activities: saved.value } });
    } else {
      Q.collection("users").updateOne(selector, { $unset: { activities: "" } });
    }
  }

  function applyBorrowEventCounterDelta(userId, hosting) {
    const increments = hosting
      ? { "activities.hosting": 1, "activities.event.all": 1, "activities.event.hosting": 1 }
      : { "activities.events": 1, "activities.event.all": 1, "activities.event.active": 1 };
    const result = Q.collection("users").updateOne(
      { $or: [{ _id: userId }, { userId }] },
      { $inc: increments }
    );
    if (result.matchedCount !== 1) Q.fail(`${BORROW_CHECKPOINT} counter user '${userId}' disappeared.`);
  }

  function synchronizeBorrowOwnerAssetCounters() {
    const activeAssets = Q.collection("assets").find({ ownerUserId: hostUserId }).toArray();
    const counts = { Transport: 0, Accommodation: 0, Supplies: 0 };
    for (const asset of activeAssets) {
      const type = Q.text(asset.type);
      if (lifecycleStatusCode(asset.status) === "A" && Object.prototype.hasOwnProperty.call(counts, type)) {
        counts[type] += 1;
      }
    }
    const result = Q.collection("users").updateOne(
      { $or: [{ _id: hostUserId }, { userId: hostUserId }] },
      { $set: {
        "activities.cars": counts.Transport,
        "activities.accommodation": counts.Accommodation,
        "activities.supplies": counts.Supplies,
        "activities.asset.cars": counts.Transport,
        "activities.asset.accommodation": counts.Accommodation,
        "activities.asset.supplies": counts.Supplies
      } }
    );
    if (result.matchedCount !== 1) Q.fail(`${BORROW_CHECKPOINT} could not synchronize Casey's Asset counters.`);
  }

  function lifecycleAssetSelector() {
    return {
      ownerUserId: hostUserId,
      title: { $in: LIFE_TITLES }
    };
  }

  function lifecycleDocuments() {
    return Q.collection("assets")
      .find(lifecycleAssetSelector())
      .sort({ type: 1, assetId: 1 })
      .toArray();
  }

  function lifecycleStatusCode(value) {
    const normalized = Q.text(value).toLowerCase();
    switch (normalized) {
      case "active": return "A";
      case "under-review":
      case "under review": return "UR";
      case "blocked": return "B";
      case "deleted": return "D";
      case "inactive": return "I";
      case "trashed":
      case "trash": return "T";
      default: return Q.text(value) || "A";
    }
  }

  function lifecycleAuthoritativeCounts() {
    const counts = { Transport: 0, Accommodation: 0, Supplies: 0, Trash: 0 };
    const suppressed = new Set(["UR", "B", "D", "I", "T"]);
    const assets = Q.collection("assets").find({ ownerUserId: hostUserId }).toArray();
    for (const asset of assets) {
      const status = lifecycleStatusCode(asset.status);
      if (status === "T") counts.Trash += 1;
      if (!suppressed.has(status) && Object.prototype.hasOwnProperty.call(counts, Q.text(asset.type))) {
        counts[Q.text(asset.type)] += 1;
      }
    }
    return counts;
  }

  function lifecycleStoredCounters() {
    const user = Q.ensureUser(hostUserId, "Asset lifecycle owner");
    const activities = user.activities || {};
    const nested = activities.asset || {};
    return {
      legacy: {
        Transport: Q.number(activities.cars),
        Accommodation: Q.number(activities.accommodation),
        Supplies: Q.number(activities.supplies)
      },
      nested: {
        Transport: Q.number(nested.cars),
        Accommodation: Q.number(nested.accommodation),
        Supplies: Q.number(nested.supplies)
      }
    };
  }

  function assertLifecycleCounts(expected, label, options = {}) {
    const authoritative = lifecycleAuthoritativeCounts();
    const stored = lifecycleStoredCounters();
    const allowExternalAssets = options.allowExternalAssets === true;
    for (const type of ["Transport", "Accommodation", "Supplies"]) {
      const authoritativeMismatch = allowExternalAssets
        ? authoritative[type] < expected[type]
        : authoritative[type] !== expected[type];
      if (authoritativeMismatch) {
        const matchingAssets = Q.collection("assets")
          .find({ ownerUserId: hostUserId, type })
          .toArray()
          .map(asset => ({
            assetId: Q.text(asset.assetId),
            title: Q.text(asset.title),
            status: lifecycleStatusCode(asset.status)
        }));
        const expectation = allowExternalAssets ? `at least ${expected[type]}` : `${expected[type]}`;
        Q.fail(`${label}: authoritative ${type} count is ${authoritative[type]}, expected ${expectation}; matching documents=${JSON.stringify(matchingAssets)}.`);
      }
      if (stored.legacy[type] !== authoritative[type] || stored.nested[type] !== authoritative[type]) {
        Q.fail(`${label}: stored ${type} counters are legacy=${stored.legacy[type]}, nested=${stored.nested[type]}, authoritative=${authoritative[type]}.`);
      }
    }
    const trashMismatch = allowExternalAssets
      ? authoritative.Trash < expected.Trash
      : authoritative.Trash !== expected.Trash;
    if (trashMismatch) {
      const expectation = allowExternalAssets ? `at least ${expected.Trash}` : `${expected.Trash}`;
      Q.fail(`${label}: authoritative Trash count is ${authoritative.Trash}, expected ${expectation}.`);
    }
    return { authoritative, stored };
  }

  function lifecycleExpectedCounts(state, phase) {
    const baseline = state.baselineCounts;
    const allActive = phase === "created" || phase === "edited";
    return {
      Transport: baseline.Transport + (allActive ? 1 : 0),
      Accommodation: baseline.Accommodation + (phase === "baseline-ready" ? 0 : 1),
      Supplies: baseline.Supplies + (phase === "baseline-ready" ? 0 : 1),
      Trash: baseline.Trash + (phase === "deleted" ? 1 : 0)
    };
  }

  function isManagedImageUrl(value) {
    const imageUrl = Q.text(value);
    if (!imageUrl.includes("/media/public?key=")) return false;
    try {
      return decodeURIComponent(imageUrl).endsWith("/large.webp");
    } catch (_error) {
      return false;
    }
  }

  function lifecycleAssetMap(expectedCount = 3) {
    const documents = lifecycleDocuments();
    if (documents.length !== expectedCount) {
      Q.fail(`ASSET-LIFE-001 expected ${expectedCount} named Asset documents, found ${documents.length}.`);
    }
    const result = {};
    for (const asset of documents) {
      const type = Q.text(asset.type);
      if (!Object.prototype.hasOwnProperty.call(LIFE_ASSETS, type)) {
        Q.fail(`ASSET-LIFE-001 found unexpected Asset type '${type}'.`);
      }
      if (result[type]) Q.fail(`ASSET-LIFE-001 found duplicate '${type}' controls.`);
      result[type] = asset;
    }
    for (const type of Object.keys(LIFE_ASSETS)) {
      if (!result[type]) Q.fail(`ASSET-LIFE-001 is missing its '${type}' control.`);
    }
    const logicalIds = Object.values(result).map(asset => Q.text(asset.assetId));
    const mongoIds = Object.values(result).map(asset => Q.text(asset._id));
    const syncKeys = Object.values(result).map(asset => Q.text(asset.syncKey));
    for (const [label, values] of [["assetId", logicalIds], ["Mongo _id", mongoIds], ["syncKey", syncKeys]]) {
      if (values.some(value => !value) || new Set(values).size !== 3) {
        Q.fail(`ASSET-LIFE-001 requires three non-empty, distinct ${label} values.`);
      }
    }
    return result;
  }

  function assertLifecycleAsset(asset, type, subtitle, status) {
    const expected = LIFE_ASSETS[type];
    const routes = Array.isArray(asset.routes)
      ? asset.routes.map(value => Q.text(value)).filter(Boolean)
      : [];
    const requests = Array.isArray(asset.requests) ? asset.requests : [];
    const policies = Array.isArray(asset.policies) ? asset.policies : [];
    const topics = Array.isArray(asset.topics) ? asset.topics : [];
    if (Q.text(asset.ownerUserId) !== hostUserId
        || Q.text(asset.type) !== type
        || Q.text(asset.title) !== expected.title
        || Q.text(asset.subtitle) !== subtitle
        || Q.text(asset.category) !== expected.category
        || Q.number(asset.capacityTotal) !== expected.capacityTotal
        || Q.number(asset.quantity) !== expected.quantity
        || Q.text(asset.details) !== expected.details
        || Q.text(asset.sourceLink) !== expected.sourceLink
        || Q.text(asset.visibility) !== "Public"
        || lifecycleStatusCode(asset.status) !== status) {
      Q.fail(`ASSET-LIFE-001 ${type} fields do not match the versioned checklist contract.`);
    }
    if (!Q.text(asset.assetId) || !Q.text(asset._id) || !Q.text(asset.syncKey)
        || !Q.text(asset.createdDate) || !Q.text(asset.createdUser) || !Q.text(asset.updatedDate)
        || Q.text(asset.createdUser) !== hostUserId || Q.text(asset.updatedUser) !== hostUserId) {
      Q.fail(`ASSET-LIFE-001 ${type} identity/audit fields are incomplete.`);
    }
    if (type === "Transport" && !isManagedImageUrl(asset.imageUrl)) {
      Q.fail(`ASSET-LIFE-001 ${type} imageUrl '${Q.text(asset.imageUrl)}' is not a canonical managed large.webp URL.`);
    }
    if (type !== "Transport" && Q.text(asset.imageUrl) && !isManagedImageUrl(asset.imageUrl)) {
      Q.fail(`ASSET-LIFE-001 optional ${type} imageUrl '${Q.text(asset.imageUrl)}' is not a canonical managed large.webp URL.`);
    }
    if (requests.length !== 0 || topics.length !== 0 || asset.policiesEnabled === true || policies.length !== 0) {
      Q.fail(`ASSET-LIFE-001 ${type} unexpectedly contains requests, topics or enabled lending policies.`);
    }
    if (asset.pricing && asset.pricing.enabled === true) {
      Q.fail(`ASSET-LIFE-001 ${type} unexpectedly enabled pricing.`);
    }
    if (type === "Accommodation") {
      if (routes.length !== 1 || !Q.text(asset.city) || Q.text(asset.city) !== routes[0]) {
        Q.fail("ASSET-LIFE-001 Accommodation must persist one required Location identically in city and routes[0].");
      }
    } else if (Q.text(asset.city) || routes.length !== 0) {
      Q.fail(`ASSET-LIFE-001 ${type} must not persist an Accommodation Location.`);
    }
    if (status === "T") {
      if (!Q.text(asset.trashedAtIso) || Q.text(asset.statusBeforeSuppression)) {
        Q.fail("ASSET-LIFE-001 trashed Transport has incomplete or inconsistent suppression markers.");
      }
    } else if (Q.text(asset.trashedAtIso) || Q.text(asset.statusBeforeSuppression)) {
      Q.fail(`ASSET-LIFE-001 active ${type} unexpectedly retains a suppression marker.`);
    }
  }

  function lifecycleStableDomain(asset) {
    return {
      mongoId: Q.text(asset._id),
      syncKey: Q.text(asset.syncKey),
      assetId: Q.text(asset.assetId),
      ownerUserId: Q.text(asset.ownerUserId),
      type: Q.text(asset.type),
      title: Q.text(asset.title),
      subtitle: Q.text(asset.subtitle),
      category: Q.text(asset.category),
      city: Q.text(asset.city),
      capacityTotal: Q.number(asset.capacityTotal),
      quantity: Q.number(asset.quantity),
      details: Q.text(asset.details),
      imageUrl: Q.text(asset.imageUrl),
      sourceLink: Q.text(asset.sourceLink),
      routes: Array.isArray(asset.routes) ? asset.routes.map(value => Q.text(value)).filter(Boolean) : [],
      topics: Array.isArray(asset.topics) ? asset.topics.map(value => Q.text(value)).filter(Boolean) : [],
      policiesEnabled: asset.policiesEnabled === true,
      policies: Array.isArray(asset.policies) ? asset.policies : [],
      pricing: asset.pricing || null,
      requests: Array.isArray(asset.requests) ? asset.requests : [],
      visibility: Q.text(asset.visibility),
      createdDate: Q.text(asset.createdDate),
      createdUser: Q.text(asset.createdUser)
    };
  }

  function assertLifecycleStable(actual, expected, label) {
    if (!Q.sameJson(lifecycleStableDomain(actual), expected)) {
      Q.fail(`ASSET-LIFE-001 ${label} changed outside the permitted lifecycle field.`);
    }
  }

  function assertLifecyclePhase(state, phase) {
    if (Q.text(state.phase) !== phase) {
      Q.fail(`ASSET-LIFE-001 is at phase '${Q.text(state.phase)}', expected '${phase}'.`);
    }
  }

  function assertLifecycleBaseline(state) {
    if (lifecycleDocuments().length !== 0) {
      Q.fail("ASSET-LIFE-001 baseline is not empty; do not delete or overwrite colliding user data.");
    }
    return assertLifecycleCounts(lifecycleExpectedCounts(state, "baseline-ready"), "ASSET-LIFE-001 baseline");
  }

  function assertLifecycleCreated(state, phase = "created", options = {}) {
    const byType = lifecycleAssetMap();
    const transportSubtitle = phase === "created" ? LIFE_INITIAL_SUBTITLE : LIFE_EDITED_SUBTITLE;
    assertLifecycleAsset(byType.Transport, "Transport", transportSubtitle, phase === "deleted" ? "T" : "A");
    assertLifecycleAsset(byType.Accommodation, "Accommodation", LIFE_INITIAL_SUBTITLE, "A");
    assertLifecycleAsset(byType.Supplies, "Supplies", LIFE_INITIAL_SUBTITLE, "A");
    if (state.createdDomains) {
      const expectedTransport = phase === "created"
        ? state.createdDomains.Transport
        : (state.editedTransportDomain || { ...state.createdDomains.Transport, subtitle: LIFE_EDITED_SUBTITLE });
      assertLifecycleStable(byType.Transport, expectedTransport, "Transport identity/schema");
      assertLifecycleStable(byType.Accommodation, state.createdDomains.Accommodation, "Accommodation control");
      assertLifecycleStable(byType.Supplies, state.createdDomains.Supplies, "Supplies control");
    }
    const counts = assertLifecycleCounts(
      lifecycleExpectedCounts(state, phase),
      `ASSET-LIFE-001 ${phase}`,
      options
    );
    return { byType, counts };
  }

  function lifecycleOracle(state) {
    const documents = lifecycleDocuments();
    return {
      checkpointPhase: Q.text(state.phase),
      targetAssets: documents.map(asset => ({
        mongoId: Q.text(asset._id),
        assetId: Q.text(asset.assetId),
        syncKey: Q.text(asset.syncKey),
        type: Q.text(asset.type),
        title: Q.text(asset.title),
        subtitle: Q.text(asset.subtitle),
        category: Q.text(asset.category),
        city: Q.text(asset.city),
        routes: Array.isArray(asset.routes) ? asset.routes.map(value => Q.text(value)).filter(Boolean) : [],
        capacityTotal: Q.number(asset.capacityTotal),
        quantity: Q.number(asset.quantity),
        imageUrl: Q.text(asset.imageUrl),
        status: lifecycleStatusCode(asset.status),
        trashedAtIso: Q.text(asset.trashedAtIso)
      })),
      counts: {
        authoritative: lifecycleAuthoritativeCounts(),
        stored: lifecycleStoredCounters()
      },
      baselineCounts: state.baselineCounts,
      ignoredExternalAssets: Array.isArray(state.ignoredExternalAssets)
        ? state.ignoredExternalAssets
        : []
    };
  }

  function visibilityAssetSelector() {
    return {
      $or: [
        { _id: { $in: VISIBILITY_ASSET_IDS } },
        { assetId: { $in: VISIBILITY_ASSET_IDS } },
        { ownerUserId: hostUserId, title: { $in: VISIBILITY_TITLES } }
      ]
    };
  }

  function visibilityEventSelector() {
    return {
      $or: [
        { _id: VISIBILITY_EVENT_ID },
        { sourceId: VISIBILITY_EVENT_ID },
        { creatorUserId: hostUserId, title: "QA ASSET-VIS-001 Event" }
      ]
    };
  }

  function visibilityDomainSelectors() {
    return [
      { collection: "assets", selector: visibilityAssetSelector() },
      { collection: "events", selector: visibilityEventSelector() },
      { collection: "activityMembers", selector: { ownerId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } } },
      { collection: "assetRequests", selector: { assetId: { $in: VISIBILITY_ASSET_IDS } } },
      { collection: "activityResources", selector: { $or: [
        { ownerId: VISIBILITY_EVENT_ID },
        { "assetAssignmentIds.Transport": { $in: VISIBILITY_ASSET_IDS } }
      ] } },
      { collection: "notificationOutbox", selector: { $or: [
        { entityId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } },
        { "payload.assetId": { $in: VISIBILITY_ASSET_IDS } },
        { "payload.eventId": VISIBILITY_EVENT_ID }
      ] } },
      { collection: "userNotifications", selector: { $or: [
        { sourceId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } },
        { "payload.assetId": { $in: VISIBILITY_ASSET_IDS } },
        { "payload.eventId": VISIBILITY_EVENT_ID }
      ] } },
      { collection: "affinityRecomputeTasks", selector: { targetId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } } }
    ];
  }

  function visibilityRestoreSelectors() {
    return [
      ...visibilityDomainSelectors(),
      { collection: "users", selector: { $or: [
        { _id: { $in: [hostUserId, VISIBILITY_FRIEND_USER_ID, VISIBILITY_UNRELATED_USER_ID] } },
        { userId: { $in: [hostUserId, VISIBILITY_FRIEND_USER_ID, VISIBILITY_UNRELATED_USER_ID] } }
      ] } }
    ];
  }

  function visibilityHashText(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) % 104729;
    }
    return Math.abs(hash);
  }

  function visibilityUsersAreFriends(leftUserId, rightUserId) {
    const firstId = leftUserId.localeCompare(rightUserId) <= 0 ? leftUserId : rightUserId;
    const secondId = leftUserId.localeCompare(rightUserId) <= 0 ? rightUserId : leftUserId;
    return (visibilityHashText(`friend-pair:${firstId}:${secondId}`) % 100) < 32;
  }

  function assertVisibilityActors() {
    const owner = Q.ensureUser(hostUserId, "Asset visibility owner");
    const friend = Q.ensureUser(VISIBILITY_FRIEND_USER_ID, "Asset visibility friend");
    const unrelated = Q.ensureUser(VISIBILITY_UNRELATED_USER_ID, "Asset visibility unrelated control");
    if (!visibilityUsersAreFriends(hostUserId, VISIBILITY_FRIEND_USER_ID)) {
      Q.fail("ASSET-VIS-001 Lina is no longer a deterministic friend of Casey under the product hash contract.");
    }
    if (visibilityUsersAreFriends(hostUserId, VISIBILITY_UNRELATED_USER_ID)) {
      Q.fail("ASSET-VIS-001 Liam is no longer a deterministic non-friend of Casey under the product hash contract.");
    }
    return {
      owner: { userId: hostUserId, name: Q.text(owner.name) },
      friend: { userId: VISIBILITY_FRIEND_USER_ID, name: Q.text(friend.name) },
      unrelated: { userId: VISIBILITY_UNRELATED_USER_ID, name: Q.text(unrelated.name) }
    };
  }

  function visibilityDocuments() {
    return Q.collection("assets")
      .find(visibilityAssetSelector())
      .sort({ assetId: 1 })
      .toArray();
  }

  function visibilityTargetCounters() {
    const user = Q.ensureUser(hostUserId, "Asset visibility owner");
    const activities = user.activities || {};
    const nested = activities.asset || {};
    return {
      legacyTransport: Q.number(activities.cars),
      nestedTransport: Q.number(nested.cars)
    };
  }

  function visibilityExpectedMatrix(phase = "baseline-ready") {
    const publicId = VISIBILITY_ASSETS.public.assetId;
    const friendsId = VISIBILITY_ASSETS.friends.assetId;
    const invitationId = VISIBILITY_ASSETS.invitation.assetId;
    const edited = phase === "visibility-edited";
    return {
      owner: {
        ownedTargetIds: [publicId, friendsId, invitationId],
        exploreTargetIds: [],
        readableDetailIds: [publicId, friendsId, invitationId]
      },
      friend: {
        ownedTargetIds: [],
        exploreTargetIds: edited ? [friendsId] : [publicId, friendsId],
        readableDetailIds: edited ? [friendsId] : [publicId, friendsId],
        deniedDetailIds: edited ? [publicId, invitationId] : [invitationId]
      },
      unrelated: {
        ownedTargetIds: [],
        exploreTargetIds: edited ? [] : [publicId],
        readableDetailIds: edited ? [] : [publicId],
        deniedDetailIds: edited ? [publicId, friendsId, invitationId] : [friendsId, invitationId]
      }
    };
  }

  function assertVisibilityFixture(state, phase = Q.text(state.phase)) {
    const actors = assertVisibilityActors();
    const documents = visibilityDocuments();
    if (documents.length !== 3) {
      Q.fail(`ASSET-VIS-001 expected three target Assets, found ${documents.length}.`);
    }
    const byId = new Map(documents.map(asset => [Q.text(asset.assetId), asset]));
    for (const definition of Object.values(VISIBILITY_ASSETS)) {
      const asset = byId.get(definition.assetId);
      const expectedVisibility = phase === "visibility-edited" && definition.assetId === VISIBILITY_ASSETS.public.assetId
        ? VISIBILITY_EDITED_VISIBILITY
        : definition.visibility;
      if (!asset
          || Q.text(asset._id) !== definition.assetId
          || Q.text(asset.syncKey) !== definition.assetId
          || Q.text(asset.ownerUserId) !== hostUserId
          || Q.text(asset.type) !== "Transport"
          || Q.text(asset.title) !== definition.title
          || Q.text(asset.category) !== "Sedan"
          || Q.text(asset.visibility) !== expectedVisibility
          || lifecycleStatusCode(asset.status) !== "A"
          || Q.number(asset.quantity) !== 1
          || Q.text(asset.city)
          || (Array.isArray(asset.routes) && asset.routes.length !== 0)
          || (Array.isArray(asset.requests) && asset.requests.length !== 0)) {
        Q.fail(`ASSET-VIS-001 '${definition.title}' does not match its '${expectedVisibility}' fixture contract.`);
      }
    }
    const event = Q.collection("events").findOne(visibilityEventSelector());
    if (!event
        || Q.text(event._id) !== VISIBILITY_EVENT_ID
        || Q.text(event.sourceId) !== VISIBILITY_EVENT_ID
        || Q.text(event.title) !== "QA ASSET-VIS-001 Event"
        || Q.text(event.status) !== "A"
        || event.published !== true
        || event.subEventsEnabled !== true
        || !Array.isArray(event.subEventDefinitions)
        || event.subEventDefinitions.length !== 1
        || Q.text(event.subEventDefinitions[0].id) !== VISIBILITY_SUB_EVENT_ID
        || Q.text(event.subEventDefinitions[0].name) !== "QA Visibility Stage") {
      Q.fail("ASSET-VIS-001 Event/Sub-event Explore scaffold is missing or malformed.");
    }
    const members = Q.collection("activityMembers")
      .find({ ownerType: "event", ownerId: VISIBILITY_EVENT_ID })
      .sort({ userId: 1 })
      .toArray();
    const expectedMemberIds = [hostUserId, VISIBILITY_FRIEND_USER_ID, VISIBILITY_UNRELATED_USER_ID].sort();
    const actualMemberIds = members
      .filter(member => Q.text(member.status) === "accepted")
      .map(member => Q.text(member.userId))
      .sort();
    if (members.length !== 3 || !Q.sameJson(actualMemberIds, expectedMemberIds)) {
      Q.fail("ASSET-VIS-001 requires exactly Casey, Lina and Liam as accepted Event scaffold members.");
    }
    const counts = visibilityTargetCounters();
    const expectedTransportCount = Q.number(state.baselineCounts.Transport) + 3;
    const authoritative = lifecycleAuthoritativeCounts();
    if (authoritative.Transport !== expectedTransportCount
        || counts.legacyTransport !== authoritative.Transport
        || counts.nestedTransport !== authoritative.Transport) {
      Q.fail(`ASSET-VIS-001 owner Transport counters are authoritative/legacy/nested ${authoritative.Transport}/${counts.legacyTransport}/${counts.nestedTransport}, expected ${expectedTransportCount}/${expectedTransportCount}/${expectedTransportCount}.`);
    }
    return { actors, documents, event, members, counters: { authoritative, stored: counts } };
  }

  function visibilityDomainSnapshot() {
    const read = (collection, selector) => Q.collection(collection)
      .find(selector)
      .sort({ _id: 1 })
      .toArray();
    const user = Q.ensureUser(hostUserId, "Asset visibility owner");
    const activities = user.activities || {};
    const nested = activities.asset || {};
    return {
      assets: read("assets", visibilityAssetSelector()),
      events: read("events", visibilityEventSelector()),
      members: read("activityMembers", { ownerId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } }),
      requests: read("assetRequests", { assetId: { $in: VISIBILITY_ASSET_IDS } }),
      resources: read("activityResources", { $or: [
        { ownerId: VISIBILITY_EVENT_ID },
        { "assetAssignmentIds.Transport": { $in: VISIBILITY_ASSET_IDS } }
      ] }),
      outbox: read("notificationOutbox", { $or: [
        { entityId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } },
        { "payload.assetId": { $in: VISIBILITY_ASSET_IDS } },
        { "payload.eventId": VISIBILITY_EVENT_ID }
      ] }),
      notifications: read("userNotifications", { $or: [
        { sourceId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } },
        { "payload.assetId": { $in: VISIBILITY_ASSET_IDS } },
        { "payload.eventId": VISIBILITY_EVENT_ID }
      ] }),
      tasks: read("affinityRecomputeTasks", { targetId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } }),
      ownerAssetCounters: [
        ["cars", String(Q.number(activities.cars))],
        ["accommodation", String(Q.number(activities.accommodation))],
        ["supplies", String(Q.number(activities.supplies))],
        ["nestedCars", String(Q.number(nested.cars))],
        ["nestedAccommodation", String(Q.number(nested.accommodation))],
        ["nestedSupplies", String(Q.number(nested.supplies))]
      ]
    };
  }

  function visibilityStableAssetProjection(asset) {
    return {
      _id: Q.text(asset && asset._id),
      syncKey: Q.text(asset && asset.syncKey),
      assetId: Q.text(asset && asset.assetId),
      ownerUserId: Q.text(asset && asset.ownerUserId),
      type: Q.text(asset && asset.type),
      title: Q.text(asset && asset.title),
      subtitle: Q.text(asset && asset.subtitle),
      category: Q.text(asset && asset.category),
      city: Q.text(asset && asset.city),
      capacityTotal: Q.number(asset && asset.capacityTotal),
      quantity: Q.number(asset && asset.quantity),
      details: Q.text(asset && asset.details),
      imageUrl: Q.text(asset && asset.imageUrl),
      sourceLink: Q.text(asset && asset.sourceLink),
      routes: Array.isArray(asset && asset.routes) ? asset.routes.map(Q.text) : [],
      policiesEnabled: asset && asset.policiesEnabled === true,
      policies: Array.isArray(asset && asset.policies) ? asset.policies : [],
      pricing: asset && asset.pricing ? asset.pricing : null,
      requests: Array.isArray(asset && asset.requests) ? asset.requests : [],
      status: lifecycleStatusCode(asset && asset.status),
      createdDate: Q.text(asset && asset.createdDate),
      createdUser: Q.text(asset && asset.createdUser)
    };
  }

  function assertVisibilityEditEffects(state, currentSnapshot) {
    const baseline = state.visibilityReadBaseline;
    const changedKeys = Object.keys(currentSnapshot)
      .filter(key => !Q.sameJson(currentSnapshot[key], baseline && baseline[key]))
      .sort();
    if (!Q.sameJson(changedKeys, ["assets", "tasks"])) {
      Q.fail(`ASSET-VIS-001 visibility Edit changed unexpected persisted domains: ${changedKeys.join(", ") || "none"}.`);
    }
    const byAssetId = values => new Map((values || []).map(asset => [Q.text(asset.assetId), asset]));
    const baselineAssets = byAssetId(baseline.assets);
    const currentAssets = byAssetId(currentSnapshot.assets);
    const publicId = VISIBILITY_ASSETS.public.assetId;
    for (const assetId of VISIBILITY_ASSET_IDS) {
      const before = baselineAssets.get(assetId);
      const after = currentAssets.get(assetId);
      if (!before || !after) {
        Q.fail(`ASSET-VIS-001 visibility Edit lost controlled Asset '${assetId}'.`);
      }
      if (assetId === publicId) {
        const beforeProjection = visibilityStableAssetProjection(before);
        const afterProjection = visibilityStableAssetProjection(after);
        const changedStableFields = Object.keys(afterProjection)
          .filter(key => !Q.sameJson(afterProjection[key], beforeProjection[key]));
        if (changedStableFields.length > 0) {
          Q.fail(`ASSET-VIS-001 Public control changed stable field(s) besides Visibility: ${changedStableFields.join(", ")}.`);
        }
        if (Q.text(after.visibility) !== VISIBILITY_EDITED_VISIBILITY
            || Q.text(after.updatedUser) !== hostUserId
            || Q.text(after.updatedDate) === Q.text(before.updatedDate)) {
          Q.fail("ASSET-VIS-001 Public control did not persist exactly one owner-authored Invitation only visibility update.");
        }
        continue;
      }
      if (!Q.sameJson(after, before)) {
        Q.fail(`ASSET-VIS-001 visibility Edit changed sibling control '${assetId}'.`);
      }
    }
    const tasks = currentSnapshot.tasks || [];
    if (tasks.length !== 1) {
      Q.fail(`ASSET-VIS-001 expected one collapsed affinity task for the edited Asset, found ${tasks.length}.`);
    }
    const task = tasks[0];
    const reasons = Array.isArray(task.reasons) ? task.reasons.map(Q.text) : [];
    const taskStatus = Q.text(task.status).toLowerCase();
    if (Q.text(task.targetType) !== "ASSET"
        || Q.text(task.targetId) !== publicId
        || !reasons.includes("ASSET_CHANGED")
        || !["pending", "running", "done"].includes(taskStatus)
        || Q.text(task.lastError)) {
      Q.fail("ASSET-VIS-001 affinity task does not match the one edited Asset or has failed.");
    }
    return { changedKeys, affinityTaskStatus: taskStatus };
  }

  function visibilityOracle(state) {
    const fixture = assertVisibilityFixture(state);
    const currentSnapshot = visibilityDomainSnapshot();
    const baselineChangedKeys = Object.keys(currentSnapshot)
      .filter(key => !Q.sameJson(currentSnapshot[key], state.visibilityReadBaseline && state.visibilityReadBaseline[key]));
    const edited = Q.text(state.phase) === "visibility-edited";
    return {
      actors: fixture.actors,
      event: {
        eventId: VISIBILITY_EVENT_ID,
        title: Q.text(fixture.event.title),
        subEventId: VISIBILITY_SUB_EVENT_ID,
        subEventTitle: Q.text(fixture.event.subEventDefinitions[0].name)
      },
      assets: fixture.documents.map(asset => ({
        assetId: Q.text(asset.assetId),
        title: Q.text(asset.title),
        visibility: Q.text(asset.visibility),
        ownerUserId: Q.text(asset.ownerUserId),
        status: Q.text(asset.status)
      })),
      targetMatrix: visibilityExpectedMatrix(Q.text(state.phase)),
      counters: fixture.counters,
      baselineComparison: {
        expectedMode: edited ? "single-visibility-edit" : "read-only",
        matchesExpectedMode: edited
          ? Q.sameJson([...baselineChangedKeys].sort(), ["assets", "tasks"])
          : baselineChangedKeys.length === 0,
        changedKeys: baselineChangedKeys
      }
    };
  }

  function selectors() {
    return [
      { collection: "assets", selector: { $or: [{ _id: { $in: ASSET_IDS } }, { assetId: { $in: ASSET_IDS } }] } },
      { collection: "events", selector: { $or: [{ _id: EVENT_ID }, { sourceId: EVENT_ID }] } },
      { collection: "activityMembers", selector: { ownerId: { $in: IDS } } },
      { collection: "assetRequests", selector: { assetId: { $in: ASSET_IDS } } },
      { collection: "activitySubEventStageRuntime", selector: { ownerId: EVENT_ID, subEventId: SUB_EVENT_ID } },
      { collection: "eventLeaderboardEntries", selector: { eventId: EVENT_ID, subEventId: SUB_EVENT_ID } },
      { collection: "activityResources", selector: { $or: [
        { ownerId: { $in: [EVENT_ID, GROUP_A_RESOURCE_OWNER_ID, GROUP_B_RESOURCE_OWNER_ID] } },
        { "assetAssignmentIds.Transport": { $in: ASSET_IDS } }
      ] } },
      { collection: "eventCheckoutBasketItems", selector: { sourceId: { $in: ASSET_IDS } } },
      { collection: "payments", selector: { sourceId: { $in: ASSET_IDS } } },
      { collection: "savedPaymentMethods", selector: { _id: BORROW_PAYMENT_CARD_ID } },
      { collection: "notificationOutbox", selector: { $or: [
        { entityId: { $in: IDS } },
        { "payload.assetId": { $in: ASSET_IDS } },
        { "payload.eventId": EVENT_ID }
      ] } },
      { collection: "userNotifications", selector: { $or: [
        { sourceId: { $in: IDS } },
        { "payload.assetId": { $in: ASSET_IDS } },
        { "payload.eventId": EVENT_ID }
      ] } },
      { collection: "affinityRecomputeTasks", selector: { targetId: { $in: IDS } } }
    ];
  }

  function clearFixture() {
    for (const spec of selectors()) Q.collection(spec.collection).deleteMany(spec.selector);
  }

  function stageData(stageKind, state) {
    if (stageKind === "member-empty") {
      Q.collection("assets").insertOne(assetDocument(
        PRIMARY_ASSET_ID,
        hostUserId,
        "Manual QA Primary Transport"
      ));
      return;
    }
    if (stageKind === "member-two-pending") {
      Q.collection("assets").insertMany([
        assetDocument(PRIMARY_ASSET_ID, hostUserId, "Manual QA Primary Transport"),
        assetDocument(SECONDARY_ASSET_ID, hostUserId, "Manual QA Secondary Transport")
      ]);
      Q.collection("activityMembers").insertMany([
        memberDocument(PRIMARY_ASSET_ID, participantUserId, "pending"),
        memberDocument(SECONDARY_ASSET_ID, thirdUserId, "pending")
      ]);
      return;
    }
    if (stageKind === "assignment-empty") {
      Q.collection("assets").insertOne(assetDocument(
        PRIMARY_ASSET_ID,
        participantUserId,
        "Manual QA Primary Transport"
      ));
      Q.collection("events").insertOne(eventDocument());
      Q.collection("activityMembers").insertMany([
        eventMemberDocument(hostUserId, "Admin"),
        eventMemberDocument(participantUserId, "Member")
      ]);
      return;
    }
    if (stageKind === "borrow-empty") {
      const stagedAtIso = Q.text(state.stagedAtIso);
      const context = state.context || {};
      const controlRequest = borrowRequestRecord(
        `${PREFIX}:borrow-request:group-b:lina`,
        VISIBILITY_FRIEND_USER_ID,
        "accepted",
        GROUP_B_RESOURCE_OWNER_ID,
        Q.text(context.startAtIso),
        Q.text(context.overlapEndAtIso),
        2,
        "Group B overlapping capacity control"
      );
      Q.collection("assets").insertMany([
        borrowAssetDocument(PRIMARY_ASSET_ID, "QA ASSET-BORROW-001 Capacity Transport", 3, stagedAtIso, [controlRequest]),
        borrowAssetDocument(SECONDARY_ASSET_ID, "QA ASSET-BORROW-001 Reject Transport", 2, stagedAtIso),
        borrowAssetDocument(TERTIARY_ASSET_ID, "QA ASSET-BORROW-001 Cancel Transport", 2, stagedAtIso),
        borrowAssetDocument(PAID_ASSET_ID, "QA ASSET-BORROW-001 Paid Transport", 2, stagedAtIso, [], true)
      ]);
      Q.collection("savedPaymentMethods").insertOne(borrowPaymentCardDocument(stagedAtIso));
      Q.collection("assetRequests").insertOne(
        borrowRequestProjection(PRIMARY_ASSET_ID, controlRequest, stagedAtIso)
      );
      Q.collection("events").insertOne(
        borrowEventDocument(stagedAtIso, Q.text(context.startAtIso), Q.text(context.endAtIso))
      );
      Q.collection("activityMembers").insertMany([
        borrowActivityMemberDocument("event", EVENT_ID, hostUserId, "Admin", stagedAtIso, "event"),
        borrowActivityMemberDocument("event", EVENT_ID, participantUserId, "Member", stagedAtIso, "event"),
        borrowActivityMemberDocument("event", EVENT_ID, thirdUserId, "Member", stagedAtIso, "event"),
        borrowActivityMemberDocument("event", EVENT_ID, VISIBILITY_FRIEND_USER_ID, "Member", stagedAtIso, "event"),
        borrowActivityMemberDocument("subEvent", SUB_EVENT_ID, hostUserId, "Admin", stagedAtIso, "stage"),
        borrowActivityMemberDocument("subEvent", SUB_EVENT_ID, participantUserId, "Member", stagedAtIso, "stage"),
        borrowActivityMemberDocument("subEvent", SUB_EVENT_ID, thirdUserId, "Member", stagedAtIso, "stage"),
        borrowActivityMemberDocument("subEvent", SUB_EVENT_ID, VISIBILITY_FRIEND_USER_ID, "Member", stagedAtIso, "stage"),
        borrowActivityMemberDocument("group", GROUP_A_ID, hostUserId, "Member", stagedAtIso, "group-a"),
        borrowActivityMemberDocument("group", GROUP_A_ID, participantUserId, "Member", stagedAtIso, "group-a"),
        borrowActivityMemberDocument("group", GROUP_A_ID, thirdUserId, "Member", stagedAtIso, "group-a"),
        borrowActivityMemberDocument("group", GROUP_B_ID, VISIBILITY_FRIEND_USER_ID, "Member", stagedAtIso, "group-b"),
        borrowMemberDocument(PRIMARY_ASSET_ID, VISIBILITY_FRIEND_USER_ID, stagedAtIso)
      ]);
      Q.collection("eventLeaderboardEntries").insertMany(borrowLeaderboardRows(stagedAtIso));
      Q.collection("activityResources").insertOne(borrowGroupBResourceDocument(stagedAtIso));
      Q.collection("activitySubEventStageRuntime").insertOne(borrowRuntimeDocument(stagedAtIso));
      synchronizeBorrowOwnerAssetCounters();
      applyBorrowEventCounterDelta(hostUserId, true);
      [participantUserId, thirdUserId, VISIBILITY_FRIEND_USER_ID]
        .forEach(userId => applyBorrowEventCounterDelta(userId, false));
    }
  }

  function oracle(state) {
    const assets = Q.collection("assets").find({ assetId: { $in: ASSET_IDS } }).sort({ assetId: 1 }).toArray();
    const assetMembers = Q.collection("activityMembers").find({
      ownerType: "asset",
      ownerId: { $in: ASSET_IDS }
    }).sort({ ownerId: 1, userId: 1 }).toArray();
    const activityMembers = Q.collection("activityMembers")
      .find({ ownerId: { $in: [EVENT_ID, SUB_EVENT_ID, GROUP_A_ID, GROUP_B_ID] } })
      .sort({ ownerType: 1, ownerId: 1, userId: 1 })
      .toArray();
    const requests = Q.collection("assetRequests")
      .find({ assetId: { $in: ASSET_IDS } })
      .sort({ assetId: 1, userId: 1 })
      .toArray();
    const resources = Q.collection("activityResources")
      .find({ ownerId: { $in: [EVENT_ID, GROUP_A_RESOURCE_OWNER_ID, GROUP_B_RESOURCE_OWNER_ID] } })
      .sort({ ownerId: 1, assetOwnerUserId: 1 })
      .toArray();
    const baskets = Q.collection("eventCheckoutBasketItems")
      .find({ sourceId: { $in: ASSET_IDS } })
      .sort({ createdAtIso: 1, _id: 1 })
      .toArray();
    const payments = Q.collection("payments")
      .find({ sourceId: { $in: ASSET_IDS } })
      .sort({ createdDate: 1, _id: 1 })
      .toArray();
    const savedPaymentMethods = Q.collection("savedPaymentMethods")
      .find({ _id: BORROW_PAYMENT_CARD_ID })
      .sort({ _id: 1 })
      .toArray();
    const runtime = Q.collection("activitySubEventStageRuntime")
      .findOne({ ownerId: EVENT_ID, subEventId: SUB_EVENT_ID }) || {};
    const outboxCount = Q.collection("notificationOutbox").countDocuments({
      $and: [
        { $or: [
          { entityId: { $in: IDS } },
          { "payload.assetId": { $in: ASSET_IDS } },
          { "payload.eventId": EVENT_ID }
        ] },
        { createdDate: { $gt: state.stagedAtIso } }
      ]
    });
    return {
      assets: assets.map(asset => ({
        assetId: Q.text(asset.assetId),
        ownerUserId: Q.text(asset.ownerUserId),
        type: Q.text(asset.type),
        title: Q.text(asset.title),
        capacityTotal: asset.capacityTotal,
        quantity: asset.quantity,
        category: Q.text(asset.category),
        visibility: Q.text(asset.visibility),
        pricingEnabled: asset.pricing && asset.pricing.enabled === true,
        basePrice: Q.number(asset.pricing && asset.pricing.basePrice),
        currency: Q.text(asset.pricing && asset.pricing.currency),
        requests: (asset.requests || []).map(request => ({
          id: Q.text(request && (request.id || request._id || request.requestId)),
          userId: Q.text(request && request.userId),
          status: Q.text(request && request.status),
          requestKind: Q.text(request && request.requestKind),
          eventId: Q.text(request && request.booking && request.booking.eventId),
          subEventId: Q.text(request && request.booking && request.booking.subEventId),
          startAtIso: Q.text(request && request.booking && request.booking.startAtIso),
          endAtIso: Q.text(request && request.booking && request.booking.endAtIso),
          quantity: Q.number(request && request.booking && request.booking.quantity),
          totalAmount: Q.number(request && request.booking && request.booking.totalAmount),
          currency: Q.text(request && request.booking && request.booking.currency),
          paymentSessionId: Q.text(request && request.booking && request.booking.paymentSessionId),
          inventoryApplied: request && request.booking && request.booking.inventoryApplied === true
        })),
        status: Q.text(asset.status)
      })),
      assetMembers: assetMembers.map(member => ({
        id: Q.text(member.syncKey || member._id),
        assetId: Q.text(member.ownerId),
        userId: Q.text(member.userId),
        role: Q.text(member.role),
        status: Q.text(member.status),
        requestKind: Q.text(member.requestKind),
        invitedByUserId: Q.text(member.invitedByUserId),
        organizerOnly: member.organizerOnly === true
      })),
      activityMembers: activityMembers.map(member => ({
        id: Q.text(member.syncKey || member._id),
        ownerType: Q.text(member.ownerType),
        ownerId: Q.text(member.ownerId),
        userId: Q.text(member.userId),
        role: Q.text(member.role),
        status: Q.text(member.status),
        organizerOnly: member.organizerOnly === true
      })),
      requestProjections: requests.map(request => ({
        id: Q.text(request._id),
        requestId: Q.text(request.requestId),
        assetId: Q.text(request.assetId),
        ownerUserId: Q.text(request.ownerUserId),
        userId: Q.text(request.userId),
        status: Q.text(request.status),
        requestKind: Q.text(request.requestKind),
        eventId: Q.text(request.booking && request.booking.eventId),
        subEventId: Q.text(request.booking && request.booking.subEventId),
        startAtIso: Q.text(request.booking && request.booking.startAtIso),
        endAtIso: Q.text(request.booking && request.booking.endAtIso),
        quantity: Q.number(request.booking && request.booking.quantity),
        totalAmount: Q.number(request.booking && request.booking.totalAmount),
        currency: Q.text(request.booking && request.booking.currency),
        paymentSessionId: Q.text(request.booking && request.booking.paymentSessionId),
        inventoryApplied: request.booking && request.booking.inventoryApplied === true
      })),
      resources: resources.map(resource => ({
        id: Q.text(resource._id),
        eventId: Q.text(resource.ownerId),
        status: Q.text(resource.status),
        subEventId: Q.text(resource.subEventId),
        assetOwnerUserId: Q.text(resource.assetOwnerUserId),
        transportAssetIds: ((resource.assetAssignmentIds || {}).Transport || []),
        transportSettings: ((resource.assetSettingsByType || {}).Transport || {}),
        transportMetric: ((resource.resourceMetricsByType || {}).Transport || {})
      })),
      runtime: {
        count: Q.collection("activitySubEventStageRuntime").countDocuments({ ownerId: EVENT_ID, subEventId: SUB_EVENT_ID }),
        status: Q.text(runtime.status),
        groupsCount: Q.number(runtime.groupsCount),
        groupResourceMetricsByAssetOwnerId: runtime.groupResourceMetricsByAssetOwnerId || {}
      },
      baskets: baskets.map(item => ({
        id: Q.text(item._id),
        sourceId: Q.text(item.sourceId),
        userId: Q.text(item.userId),
        status: Q.text(item.status),
        resultState: Q.text(item.resultState),
        quantity: Q.number(item.quantity),
        amount: Q.number(item.amount),
        currency: Q.text(item.currency),
        checkoutSessionId: Q.text(item.checkoutSessionId)
      })),
      payments: payments.map(item => ({
        id: Q.text(item._id),
        sourceId: Q.text(item.sourceId),
        userId: Q.text(item.userId),
        recipientUserId: Q.text(item.recipientUserId),
        checkoutSessionId: Q.text(item.checkoutSessionId),
        provider: Q.text(item.provider),
        paymentMethodId: Q.text(item.paymentMethodId),
        status: Q.text(item.status),
        fulfillmentStatus: Q.text(item.fulfillmentStatus),
        bookingStatus: Q.text(item.bookingStatus),
        amount: Q.number(item.amount),
        currency: Q.text(item.currency)
      })),
      savedPaymentMethods: savedPaymentMethods.map(item => ({
        id: Q.text(item._id),
        userId: Q.text(item.userId),
        provider: Q.text(item.provider),
        providerPaymentMethodRef: Q.text(item.providerPaymentMethodRef),
        last4: Q.text(item.last4),
        status: Q.text(item.status)
      })),
      paymentSimulator: { provider, providerConnected, requires3ds },
      checkoutBasketCount: baskets.length,
      paymentCount: payments.length,
      afterStageOutboxCount: outboxCount
    };
  }

  function assertBorrowBaseline(state, current) {
    const byAssetId = new Map(current.assets.map(asset => [asset.assetId, asset]));
    const capacity = byAssetId.get(PRIMARY_ASSET_ID);
    const reject = byAssetId.get(SECONDARY_ASSET_ID);
    const cancel = byAssetId.get(TERTIARY_ASSET_ID);
    const paid = byAssetId.get(PAID_ASSET_ID);
    const expectedEventUsers = [hostUserId, participantUserId, thirdUserId, VISIBILITY_FRIEND_USER_ID].sort();
    const expectedGroupAUsers = [hostUserId, participantUserId, thirdUserId].sort();
    const expectedStageUsers = [hostUserId, participantUserId, thirdUserId, VISIBILITY_FRIEND_USER_ID].sort();
    const eventUsers = current.activityMembers
      .filter(member => member.ownerType === "event" && member.ownerId === EVENT_ID && member.status === "accepted")
      .map(member => member.userId)
      .sort();
    const groupAUsers = current.activityMembers
      .filter(member => member.ownerType === "group" && member.ownerId === GROUP_A_ID && member.status === "accepted")
      .map(member => member.userId)
      .sort();
    const stageUsers = current.activityMembers
      .filter(member => member.ownerType === "subEvent" && member.ownerId === SUB_EVENT_ID && member.status === "accepted")
      .map(member => member.userId)
      .sort();
    const groupBUsers = current.activityMembers
      .filter(member => member.ownerType === "group" && member.ownerId === GROUP_B_ID && member.status === "accepted")
      .map(member => member.userId)
      .sort();
    const control = capacity && capacity.requests[0];
    const projection = current.requestProjections[0];
    const groupBResource = current.resources.find(resource => resource.eventId === GROUP_B_RESOURCE_OWNER_ID);
    const runtimeGroups = current.runtime.groupResourceMetricsByAssetOwnerId || {};
    const groupBMetric = (((runtimeGroups[GROUP_B_ID] || {})[VISIBILITY_FRIEND_USER_ID] || {}).Transport) || {};
    const failures = [];
    if (current.assets.length !== 4
        || !capacity || capacity.title !== "QA ASSET-BORROW-001 Capacity Transport" || capacity.quantity !== 3
        || !reject || reject.title !== "QA ASSET-BORROW-001 Reject Transport" || reject.quantity !== 2
        || !cancel || cancel.title !== "QA ASSET-BORROW-001 Cancel Transport" || cancel.quantity !== 2
        || !paid || paid.title !== "QA ASSET-BORROW-001 Paid Transport" || paid.quantity !== 2
        || paid.pricingEnabled !== true || paid.basePrice !== 3200 || paid.currency !== "HUF"
        || [capacity, reject, cancel].some(asset => asset.pricingEnabled || asset.basePrice !== 0)
        || current.assets.some(asset => asset.ownerUserId !== hostUserId
          || asset.type !== "Transport"
          || asset.category !== "Sedan"
          || asset.visibility !== "Public"
          || lifecycleStatusCode(asset.status) !== "A")) {
      failures.push("exactFourPublicTransportControls");
    }
    if (!control
        || capacity.requests.length !== 1
        || control.userId !== VISIBILITY_FRIEND_USER_ID
        || control.status !== "accepted"
        || control.requestKind !== "borrow"
        || control.eventId !== GROUP_B_RESOURCE_OWNER_ID
        || control.subEventId !== SUB_EVENT_ID
        || control.startAtIso !== Q.text(state.context.startAtIso)
        || control.endAtIso !== Q.text(state.context.overlapEndAtIso)
        || control.quantity !== 2
        || control.inventoryApplied) {
      failures.push("exactOverlappingGroupBControlRequest");
    }
    if (current.requestProjections.length !== 1
        || !projection
        || projection.assetId !== PRIMARY_ASSET_ID
        || projection.userId !== VISIBILITY_FRIEND_USER_ID
        || projection.status !== "accepted"
        || projection.eventId !== GROUP_B_RESOURCE_OWNER_ID
        || projection.quantity !== 2
        || projection.inventoryApplied) {
      failures.push("exactControlRequestProjection");
    }
    if (current.assetMembers.length !== 1
        || current.assetMembers[0].assetId !== PRIMARY_ASSET_ID
        || current.assetMembers[0].userId !== VISIBILITY_FRIEND_USER_ID
        || current.assetMembers[0].status !== "accepted"
        || current.assetMembers[0].organizerOnly) {
      failures.push("exactControlAssetMembership");
    }
    if (!Q.sameJson(eventUsers, expectedEventUsers)
        || !Q.sameJson(stageUsers, expectedStageUsers)
        || !Q.sameJson(groupAUsers, expectedGroupAUsers)
        || !Q.sameJson(groupBUsers, [VISIBILITY_FRIEND_USER_ID])
        || current.activityMembers.some(member => member.organizerOnly)) {
      failures.push("exactEventAndGeneratedGroupRoles");
    }
    if (current.resources.length !== 1
        || !groupBResource
        || groupBResource.status !== "A"
        || !Q.sameJson(groupBResource.transportAssetIds, [PRIMARY_ASSET_ID])
        || Q.number(groupBResource.transportSettings[PRIMARY_ASSET_ID] && groupBResource.transportSettings[PRIMARY_ASSET_ID].quantity) !== 2
        || Q.text(groupBResource.transportSettings[PRIMARY_ASSET_ID] && groupBResource.transportSettings[PRIMARY_ASSET_ID].addedByUserId) !== VISIBILITY_FRIEND_USER_ID
        || Q.number(groupBResource.transportMetric.accepted) !== 1
        || Q.number(groupBResource.transportMetric.pending) !== 0) {
      failures.push("exactGroupBResourceControl");
    }
    if (current.runtime.count !== 1
        || current.runtime.status !== "A"
        || current.runtime.groupsCount !== 2
        || Object.prototype.hasOwnProperty.call(runtimeGroups, GROUP_A_ID)
        || Q.number(groupBMetric.accepted) !== 1
        || Q.number(groupBMetric.pending) !== 0) {
      failures.push("exactGeneratedGroupRuntimeControl");
    }
    if (current.afterStageOutboxCount !== 0) {
      failures.push("noPrematureNotification");
    }
    if (current.checkoutBasketCount !== 0 || current.paymentCount !== 0) {
      failures.push("noCheckoutOrPaymentState");
    }
    if (current.savedPaymentMethods.length !== 1
        || current.savedPaymentMethods[0].userId !== participantUserId
        || current.savedPaymentMethods[0].provider !== "barion"
        || current.savedPaymentMethods[0].providerPaymentMethodRef !== "pm_sim_checkout_nova_barion_4444"
        || current.savedPaymentMethods[0].last4 !== "4444"
        || current.savedPaymentMethods[0].status !== "active") {
      failures.push("exactNovaBarionPaymentMethod");
    }
    if (failures.length > 0) {
      Q.printObject({ scenario: SCENARIO, checkpointId, phase: "baseline-diagnostic", failures, oracle: current });
      Q.fail(`${BORROW_CHECKPOINT} baseline checks failed: ${failures.join(", ")}.`);
    }
    return {
      exactFourPublicTransportControls: true,
      exactOverlappingGroupBControlRequest: true,
      exactControlRequestProjection: true,
      exactControlAssetMembership: true,
      exactEventAndGeneratedGroupRoles: true,
      exactGroupBResourceControl: true,
      exactGeneratedGroupRuntimeControl: true,
      exactNovaBarionPaymentMethod: true,
      noCheckoutOrPaymentState: true,
      noPrematureNotification: true
    };
  }

  function assertBorrowImmutableScope(current, allowPaidEffects = false) {
    const expectedEventUsers = [hostUserId, participantUserId, thirdUserId, VISIBILITY_FRIEND_USER_ID].sort();
    const expectedGroupAUsers = [hostUserId, participantUserId, thirdUserId].sort();
    const expectedStageUsers = [hostUserId, participantUserId, thirdUserId, VISIBILITY_FRIEND_USER_ID].sort();
    const eventUsers = current.activityMembers
      .filter(member => member.ownerType === "event" && member.ownerId === EVENT_ID && member.status === "accepted")
      .map(member => member.userId)
      .sort();
    const groupAUsers = current.activityMembers
      .filter(member => member.ownerType === "group" && member.ownerId === GROUP_A_ID && member.status === "accepted")
      .map(member => member.userId)
      .sort();
    const stageUsers = current.activityMembers
      .filter(member => member.ownerType === "subEvent" && member.ownerId === SUB_EVENT_ID && member.status === "accepted")
      .map(member => member.userId)
      .sort();
    const groupBUsers = current.activityMembers
      .filter(member => member.ownerType === "group" && member.ownerId === GROUP_B_ID && member.status === "accepted")
      .map(member => member.userId)
      .sort();
    const capacity = current.assets.find(asset => asset.assetId === PRIMARY_ASSET_ID);
    const paid = current.assets.find(asset => asset.assetId === PAID_ASSET_ID);
    const control = capacity && capacity.requests.find(request => request.userId === VISIBILITY_FRIEND_USER_ID);
    const groupBResource = current.resources.find(resource => resource.eventId === GROUP_B_RESOURCE_OWNER_ID && resource.status === "A");
    const runtimeGroups = current.runtime.groupResourceMetricsByAssetOwnerId || {};
    const groupBMetric = (((runtimeGroups[GROUP_B_ID] || {})[VISIBILITY_FRIEND_USER_ID] || {}).Transport) || {};
    const nonPaidAssetMembers = current.assetMembers.filter(member => member.assetId !== PAID_ASSET_ID);
    if (current.assets.length !== 4
        || current.assets.some(asset => asset.ownerUserId !== hostUserId || asset.type !== "Transport"
          || asset.visibility !== "Public" || lifecycleStatusCode(asset.status) !== "A")
        || !capacity || capacity.quantity !== 3 || !control
        || !paid || paid.quantity !== 2 || paid.pricingEnabled !== true
        || paid.basePrice !== 3200 || paid.currency !== "HUF"
        || control.status !== "accepted" || control.quantity !== 2
        || control.eventId !== GROUP_B_RESOURCE_OWNER_ID || control.subEventId !== SUB_EVENT_ID
        || control.inventoryApplied
        || !Q.sameJson(eventUsers, expectedEventUsers)
        || !Q.sameJson(stageUsers, expectedStageUsers)
        || !Q.sameJson(groupAUsers, expectedGroupAUsers)
        || !Q.sameJson(groupBUsers, [VISIBILITY_FRIEND_USER_ID])
        || nonPaidAssetMembers.length !== 1
        || nonPaidAssetMembers[0].assetId !== PRIMARY_ASSET_ID
        || nonPaidAssetMembers[0].userId !== VISIBILITY_FRIEND_USER_ID
        || nonPaidAssetMembers[0].status !== "accepted"
        || !groupBResource
        || !Q.sameJson(groupBResource.transportAssetIds, [PRIMARY_ASSET_ID])
        || Q.number(groupBResource.transportSettings[PRIMARY_ASSET_ID] && groupBResource.transportSettings[PRIMARY_ASSET_ID].quantity) !== 2
        || Q.text(groupBResource.transportSettings[PRIMARY_ASSET_ID] && groupBResource.transportSettings[PRIMARY_ASSET_ID].addedByUserId) !== VISIBILITY_FRIEND_USER_ID
        || Q.number(groupBResource.transportMetric.accepted) !== 1
        || Q.number(groupBResource.transportMetric.pending) !== 0
        || current.runtime.count !== 1 || current.runtime.status !== "A" || current.runtime.groupsCount !== 2
        || Q.number(groupBMetric.accepted) !== 1 || Q.number(groupBMetric.pending) !== 0
        || (!allowPaidEffects && paid.requests.length !== 0)
        || (!allowPaidEffects && (current.checkoutBasketCount !== 0 || current.paymentCount !== 0))) {
      Q.fail(`${BORROW_CHECKPOINT} immutable Event/Group B/free-payment scope changed.`);
    }
  }

  function assertBorrowDeletedBranch(current, assetId, userId) {
    const asset = current.assets.find(item => item.assetId === assetId);
    const requests = asset ? asset.requests.filter(item => item.userId === userId) : [];
    const projections = current.requestProjections.filter(item => item.assetId === assetId && item.userId === userId);
    const activeResources = current.resources.filter(resource =>
      resource.status === "A" && resource.transportAssetIds.includes(assetId));
    if (!asset || requests.length !== 1 || lifecycleStatusCode(requests[0].status) !== "D"
        || projections.length !== 1 || lifecycleStatusCode(projections[0].status) !== "D"
        || activeResources.length !== 0) {
      Q.fail(`${BORROW_CHECKPOINT} ${assetId} did not retain exactly one deleted request audit with no active resource.`);
    }
  }

  function borrowNotificationRows(state) {
    return Q.collection("notificationOutbox").find({
      $and: [
        { $or: [
          { entityId: { $in: ASSET_IDS } },
          { "payload.assetId": { $in: ASSET_IDS } },
          { "payload.eventId": EVENT_ID }
        ] },
        { createdDate: { $gt: state.stagedAtIso } }
      ]
    }).sort({ createdDate: 1, _id: 1 }).toArray().map(item => ({
      id: Q.text(item._id),
      type: Q.text(item.notificationType),
      assetId: Q.text(item.entityId || item.payload && item.payload.assetId),
      eventId: Q.text(item.payload && item.payload.eventId),
      subEventId: Q.text(item.payload && item.payload.subEventId),
      memberUserId: Q.text(item.payload && item.payload.memberUserId),
      recipients: (item.recipientUserIds || []).map(Q.text).filter(Boolean).sort()
    }));
  }

  function requireBorrowPhase(expected) {
    const state = requireMatchingState();
    if (Q.text(state.phase) !== expected) {
      Q.fail(`${BORROW_CHECKPOINT} requires phase '${expected}', found '${Q.text(state.phase)}'.`);
    }
    return state;
  }

  function saveBorrowVerification(state, phase, field, current) {
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
      phase,
      [field]: current,
      [`${field}AtIso`]: Q.nowIso()
    } });
  }

  function verifyBorrowCancel() {
    const state = requireBorrowPhase("baseline-ready");
    const current = oracle(state);
    assertBorrowImmutableScope(current);
    assertBorrowDeletedBranch(current, TERTIARY_ASSET_ID, participantUserId);
    const capacity = current.assets.find(asset => asset.assetId === PRIMARY_ASSET_ID);
    const reject = current.assets.find(asset => asset.assetId === SECONDARY_ASSET_ID);
    const runtimeGroups = current.runtime.groupResourceMetricsByAssetOwnerId || {};
    const notifications = borrowNotificationRows(state);
    if (!capacity || capacity.requests.length !== 1 || !reject || reject.requests.length !== 0
        || Object.prototype.hasOwnProperty.call(runtimeGroups, GROUP_A_ID)
        || notifications.length !== 1
        || notifications[0].type !== "asset-admin-join-request"
        || notifications[0].assetId !== TERTIARY_ASSET_ID
        || notifications[0].memberUserId !== participantUserId
        || !Q.sameJson(notifications[0].recipients, [hostUserId])) {
      Q.printObject({ scenario: SCENARIO, checkpointId, phase: "borrow-cancel-diagnostic", oracle: current, notifications });
      Q.fail(`${BORROW_CHECKPOINT} cancel branch did not clear only Nova's free request scope.`);
    }
    saveBorrowVerification(state, "borrow-cancel-verified", "borrowCancelOracle", current);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "borrow-cancel-verified",
      result: "PASS",
      cancelledRequestAudits: 1,
      activeGroupAResources: 0,
      payments: 0,
      next: "Continue at step 14 with Riley's Reject Transport request."
    });
  }

  function verifyBorrowReject() {
    const state = requireBorrowPhase("borrow-cancel-verified");
    const current = oracle(state);
    assertBorrowImmutableScope(current);
    assertBorrowDeletedBranch(current, TERTIARY_ASSET_ID, participantUserId);
    assertBorrowDeletedBranch(current, SECONDARY_ASSET_ID, thirdUserId);
    const capacity = current.assets.find(asset => asset.assetId === PRIMARY_ASSET_ID);
    const runtimeGroups = current.runtime.groupResourceMetricsByAssetOwnerId || {};
    const notifications = borrowNotificationRows(state);
    const requestRows = notifications.filter(item => item.type === "asset-admin-join-request");
    const rejectedRows = notifications.filter(item => item.type === "asset-member-request-declined");
    if (!capacity || capacity.requests.length !== 1
        || Object.prototype.hasOwnProperty.call(runtimeGroups, GROUP_A_ID)
        || notifications.length !== 3 || requestRows.length !== 2 || rejectedRows.length !== 1
        || !rejectedRows[0] || rejectedRows[0].assetId !== SECONDARY_ASSET_ID
        || rejectedRows[0].memberUserId !== thirdUserId
        || !Q.sameJson(rejectedRows[0].recipients, [thirdUserId])) {
      Q.printObject({ scenario: SCENARIO, checkpointId, phase: "borrow-reject-diagnostic", oracle: current, notifications });
      Q.fail(`${BORROW_CHECKPOINT} reject branch did not retire only Riley's request with one rejection notification.`);
    }
    saveBorrowVerification(state, "borrow-reject-verified", "borrowRejectOracle", current);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "borrow-reject-verified",
      result: "PASS",
      deletedCancelAndRejectAudits: 2,
      activeGroupAResources: 0,
      payments: 0,
      next: "Continue at step 21 with Capacity Transport Statistics and Nova's free request."
    });
  }

  function assertBorrowAccepted(state, current, allowPaidEffects = false) {
    assertBorrowImmutableScope(current, allowPaidEffects);
    assertBorrowDeletedBranch(current, TERTIARY_ASSET_ID, participantUserId);
    assertBorrowDeletedBranch(current, SECONDARY_ASSET_ID, thirdUserId);
    const capacity = current.assets.find(asset => asset.assetId === PRIMARY_ASSET_ID);
    const novaRequest = capacity && capacity.requests.find(request => request.userId === participantUserId);
    const novaProjection = current.requestProjections.find(request =>
      request.assetId === PRIMARY_ASSET_ID && request.userId === participantUserId);
    const groupAResource = current.resources.find(resource =>
      resource.eventId === GROUP_A_RESOURCE_OWNER_ID && resource.status === "A"
      && resource.transportAssetIds.includes(PRIMARY_ASSET_ID));
    const runtimeGroups = current.runtime.groupResourceMetricsByAssetOwnerId || {};
    const groupAMetric = (((runtimeGroups[GROUP_A_ID] || {})[participantUserId] || {}).Transport) || {};
    const notifications = borrowNotificationRows(state);
    const requestRows = notifications.filter(item => item.type === "asset-admin-join-request");
    const acceptedRows = notifications.filter(item => item.type === "asset-member-request-accepted");
    const rejectedRows = notifications.filter(item => item.type === "asset-member-request-declined");
    if (!capacity || capacity.requests.length !== 2 || !novaRequest
        || novaRequest.status !== "accepted" || novaRequest.quantity !== 1
        || novaRequest.eventId !== GROUP_A_RESOURCE_OWNER_ID || novaRequest.subEventId !== SUB_EVENT_ID
        || novaRequest.startAtIso !== Q.text(state.context.startAtIso)
        || novaRequest.endAtIso !== Q.text(state.context.overlapEndAtIso)
        || novaRequest.inventoryApplied
        || !novaProjection || novaProjection.status !== "accepted" || novaProjection.quantity !== 1
        || novaProjection.eventId !== GROUP_A_RESOURCE_OWNER_ID || novaProjection.inventoryApplied
        || !groupAResource
        || Q.number(groupAResource.transportSettings[PRIMARY_ASSET_ID] && groupAResource.transportSettings[PRIMARY_ASSET_ID].quantity) !== 1
        || Q.text(groupAResource.transportSettings[PRIMARY_ASSET_ID] && groupAResource.transportSettings[PRIMARY_ASSET_ID].addedByUserId) !== participantUserId
        || Q.number(groupAResource.transportMetric.accepted) !== 1
        || Q.number(groupAResource.transportMetric.pending) !== 0
        || Q.number(groupAMetric.accepted) !== 1 || Q.number(groupAMetric.pending) !== 0
        || notifications.length !== 5 || requestRows.length !== 3
        || acceptedRows.length !== 1 || rejectedRows.length !== 1
        || acceptedRows[0].assetId !== PRIMARY_ASSET_ID
        || acceptedRows[0].memberUserId !== participantUserId
        || !Q.sameJson(acceptedRows[0].recipients, [participantUserId])) {
      Q.printObject({ scenario: SCENARIO, checkpointId, phase: "borrow-accepted-diagnostic", oracle: current, notifications });
      Q.fail(`${BORROW_CHECKPOINT} free acceptance did not produce the exact Group A quantity-one scoped Manager state.`);
    }
    return { current, notifications };
  }

  function verifyBorrowAccepted() {
    const state = requireBorrowPhase("borrow-reject-verified");
    const { current } = assertBorrowAccepted(state, oracle(state));
    saveBorrowVerification(state, "borrow-accepted-verified", "borrowAcceptedOracle", current);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "borrow-accepted-verified",
      result: "PASS",
      groupAQuantity: 1,
      groupBQuantity: 2,
      occupiedQuantity: 3,
      scopedManagerUserId: participantUserId,
      payments: 0,
      next: "Continue with Nova's first Paid Transport Borrow and set Organizer only before Casey approves it."
    });
  }

  function assertBorrowPaymentSimulator(current) {
    if (current.paymentSimulator.provider !== "barion"
        || !current.paymentSimulator.providerConnected
        || current.paymentSimulator.requires3ds) {
      Q.fail(`${BORROW_CHECKPOINT} requires the connected Barion simulator with 3DS off.`);
    }
  }

  function paidBorrowState(current) {
    const asset = current.assets.find(item => item.assetId === PAID_ASSET_ID) || null;
    const requests = asset ? asset.requests.filter(item => item.userId === participantUserId) : [];
    const projections = current.requestProjections.filter(item =>
      item.assetId === PAID_ASSET_ID && item.userId === participantUserId);
    const payments = current.payments.filter(item =>
      item.sourceId === PAID_ASSET_ID && item.userId === participantUserId);
    const member = current.assetMembers.find(item =>
      item.assetId === PAID_ASSET_ID && item.userId === participantUserId) || null;
    const resource = current.resources.find(item =>
      item.eventId === GROUP_A_RESOURCE_OWNER_ID
      && item.status === "A"
      && item.transportAssetIds.includes(PAID_ASSET_ID)) || null;
    return { asset, requests, projections, payments, member, resource };
  }

  function assertPaidRequestAndPayment(request, projections, payments, expectedStatus) {
    const projection = projections.find(item => item.requestId === request.id);
    const payment = payments.find(item => item.checkoutSessionId === request.paymentSessionId);
    const durationMs = Date.parse(request.endAtIso) - Date.parse(request.startAtIso);
    const expectedAmount = 3200 * Math.max(1, Math.ceil(durationMs / 86400000));
    return request.status === expectedStatus
      && Number.isFinite(durationMs) && durationMs > 0
      && request.requestKind === "borrow"
      && request.eventId === GROUP_A_RESOURCE_OWNER_ID
      && request.subEventId === SUB_EVENT_ID
      && request.quantity === 1
      && request.totalAmount === expectedAmount
      && request.currency === "HUF"
      && request.paymentSessionId.length > 0
      && !request.inventoryApplied
      && projection != null
      && projection.status === expectedStatus
      && projection.quantity === 1
      && projection.totalAmount === expectedAmount
      && projection.currency === "HUF"
      && projection.paymentSessionId === request.paymentSessionId
      && payment != null
      && payment.recipientUserId === hostUserId
      && payment.provider === "barion"
      && payment.paymentMethodId === BORROW_PAYMENT_CARD_ID
      && payment.status === "captured"
      && payment.fulfillmentStatus === "succeeded"
      && payment.bookingStatus === "joined"
      && payment.amount === expectedAmount
      && payment.currency === "HUF";
  }

  function verifyBorrowPaidPendingOrganizer() {
    const state = requireBorrowPhase("borrow-accepted-verified");
    const current = oracle(state);
    assertBorrowAccepted(state, current, true);
    assertBorrowPaymentSimulator(current);
    const paid = paidBorrowState(current);
    const requestRows = borrowNotificationRows(state)
      .filter(item => item.type === "asset-admin-join-request" && item.assetId === PAID_ASSET_ID);
    if (!paid.asset || paid.requests.length !== 1 || paid.projections.length !== 1 || paid.payments.length !== 1
        || !assertPaidRequestAndPayment(paid.requests[0], paid.projections, paid.payments, "pending")
        || !paid.member || paid.member.status !== "pending" || !paid.member.organizerOnly
        || !paid.resource
        || Q.number(paid.resource.transportSettings[PAID_ASSET_ID] && paid.resource.transportSettings[PAID_ASSET_ID].quantity) !== 1
        || requestRows.length !== 1) {
      Q.printObject({ scenario: SCENARIO, checkpointId, phase: "borrow-paid-pending-organizer-diagnostic", oracle: current, requestRows });
      Q.fail(`${BORROW_CHECKPOINT} first paid request or pending organizer-only state is not exact.`);
    }
    saveBorrowVerification(state, "borrow-paid-pending-organizer-verified", "borrowPaidPendingOrganizerOracle", current);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "borrow-paid-pending-organizer-verified",
      result: "PASS",
      paidRequests: 1,
      paidAssetItems: 1,
      organizerOnlyBeforeApproval: true,
      next: "Casey approves this exact Paid Transport request; Nova then chooses Count as participant."
    });
  }

  function verifyBorrowPaidAcceptedParticipant() {
    const state = requireBorrowPhase("borrow-paid-pending-organizer-verified");
    const current = oracle(state);
    assertBorrowAccepted(state, current, true);
    assertBorrowPaymentSimulator(current);
    const paid = paidBorrowState(current);
    if (!paid.asset || paid.requests.length !== 1 || paid.projections.length !== 1 || paid.payments.length !== 1
        || !assertPaidRequestAndPayment(paid.requests[0], paid.projections, paid.payments, "accepted")
        || !paid.member || paid.member.status !== "accepted" || paid.member.organizerOnly
        || !paid.resource
        || Q.number(paid.resource.transportSettings[PAID_ASSET_ID] && paid.resource.transportSettings[PAID_ASSET_ID].quantity) !== 1) {
      Q.printObject({ scenario: SCENARIO, checkpointId, phase: "borrow-paid-accepted-participant-diagnostic", oracle: current });
      Q.fail(`${BORROW_CHECKPOINT} paid approval or Count as participant did not persist exactly.`);
    }
    saveBorrowVerification(state, "borrow-paid-accepted-participant-verified", "borrowPaidAcceptedParticipantOracle", current);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "borrow-paid-accepted-participant-verified",
      result: "PASS",
      paidRequests: 1,
      participantAfterApproval: true,
      next: "Nova chooses Organizer only, then submits and pays a second one-unit Paid Transport Borrow; Casey approves only that new request."
    });
  }

  function verifyBorrowTerminal() {
    const state = requireBorrowPhase("borrow-paid-accepted-participant-verified");
    const { current } = assertBorrowAccepted(state, oracle(state), true);
    assertBorrowPaymentSimulator(current);
    const paid = paidBorrowState(current);
    const requestIds = paid.requests.map(item => item.id);
    const paymentSessionIds = paid.requests.map(item => item.paymentSessionId);
    if (!paid.asset || paid.requests.length !== 2 || paid.projections.length !== 2 || paid.payments.length !== 2
        || new Set(requestIds).size !== 2 || new Set(paymentSessionIds).size !== 2
        || paid.requests.some(request => !assertPaidRequestAndPayment(request, paid.projections, paid.payments, "accepted"))
        || !paid.member || paid.member.status !== "accepted" || !paid.member.organizerOnly
        || !paid.resource
        || Q.number(paid.resource.transportSettings[PAID_ASSET_ID] && paid.resource.transportSettings[PAID_ASSET_ID].quantity) !== 2) {
      Q.printObject({ scenario: SCENARIO, checkpointId, phase: "borrow-terminal-paid-diagnostic", oracle: current });
      Q.fail(`${BORROW_CHECKPOINT} did not retain two independent accepted paid requests and payments.`);
    }
    saveBorrowVerification(state, "borrow-verified", "borrowTerminalOracle", current);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "borrow-verified",
      result: "PASS",
      freeCancelRejectAccept: true,
      overlapCapacityAndStatistics: true,
      scopedManagerWithoutEventRole: true,
      oneUnitReadOnlyQuantity: true,
      independentPaidRequestIds: requestIds,
      independentPaymentSessionIds: paymentSessionIds,
      paidAssetItems: 2,
      organizerOnlyAfterApproval: true,
      checkoutBasketCount: current.checkoutBasketCount,
      paymentCount: current.paymentCount
    });
  }

  function stageLifecycle() {
    const selected = config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    Q.ensureUser(hostUserId, "Asset lifecycle owner");
    if (lifecycleDocuments().length !== 0) {
      Q.fail("ASSET-LIFE-001 target titles already exist for Casey; refusing to overwrite or clear them.");
    }
    const baselineCounts = lifecycleAuthoritativeCounts();
    assertLifecycleCounts(baselineCounts, "ASSET-LIFE-001 pre-stage");
    const stagedAtIso = Q.nowIso();
    const state = {
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId,
      database: db.getName(),
      stagedAtIso,
      phase: "baseline-ready",
      baselineCounts,
      context: {
        hostUserId,
        targetTitles: LIFE_TITLES,
        initialSubtitle: LIFE_INITIAL_SUBTITLE,
        editedSubtitle: LIFE_EDITED_SUBTITLE
      },
      snapshots: []
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: state.phase,
      stagedAtIso,
      identities: state.context,
      why: selected.why,
      workerExpectation: selected.worker,
      baseline: lifecycleOracle(state),
      next: selected.action,
      expectedVisibleResult: selected.expected
    });
  }

  function captureLifecycleCreated() {
    if (checkpointId !== LIFE_CHECKPOINT) Q.fail(`capture-lifecycle-created is restricted to ${LIFE_CHECKPOINT}.`);
    const state = requireMatchingState();
    assertLifecyclePhase(state, "baseline-ready");
    const byType = lifecycleAssetMap();
    assertLifecycleAsset(byType.Transport, "Transport", LIFE_INITIAL_SUBTITLE, "A");
    assertLifecycleAsset(byType.Accommodation, "Accommodation", LIFE_INITIAL_SUBTITLE, "A");
    assertLifecycleAsset(byType.Supplies, "Supplies", LIFE_INITIAL_SUBTITLE, "A");
    const imageUrls = Object.values(byType).map(asset => Q.text(asset.imageUrl)).filter(Boolean);
    if (new Set(imageUrls).size !== imageUrls.length) {
      Q.fail("ASSET-LIFE-001 requires distinct managed media identities for every uploaded Asset image.");
    }
    assertLifecycleCounts(lifecycleExpectedCounts(state, "created"), "ASSET-LIFE-001 created");
    const createdDomains = {};
    for (const type of Object.keys(LIFE_ASSETS)) createdDomains[type] = lifecycleStableDomain(byType[type]);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id, phase: "baseline-ready" },
      {
        $set: {
          phase: "created",
          createdAtIso: Q.nowIso(),
          createdDomains,
          "context.assetIds": {
            Transport: Q.text(byType.Transport.assetId),
            Accommodation: Q.text(byType.Accommodation.assetId),
            Supplies: Q.text(byType.Supplies.assetId)
          }
        }
      }
    );
    const current = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: current.phase,
      oracle: lifecycleOracle(current),
      next: `Edit only Subtitle on ${LIFE_ASSETS.Transport.title} to '${LIFE_EDITED_SUBTITLE}', Save once, close/reopen, then report the Edit phrase.`
    });
  }

  function verifyLifecycleEdited() {
    if (checkpointId !== LIFE_CHECKPOINT) Q.fail(`verify-lifecycle-edited is restricted to ${LIFE_CHECKPOINT}.`);
    const state = requireMatchingState();
    assertLifecyclePhase(state, "created");
    const result = assertLifecycleCreated(state, "edited");
    const editedTransportDomain = lifecycleStableDomain(result.byType.Transport);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id, phase: "created" },
      {
        $set: {
          phase: "edited",
          editedAtIso: Q.nowIso(),
          editedTransportDomain
        }
      }
    );
    const current = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: current.phase,
      oracle: lifecycleOracle(current),
      next: `Delete only ${LIFE_ASSETS.Transport.title} once, confirm once, and verify its card and Transport counters disappear without reload before reporting the Delete phrase.`
    });
  }

  function verifyLifecycleDeleted() {
    if (checkpointId !== LIFE_CHECKPOINT) Q.fail(`verify-lifecycle-deleted is restricted to ${LIFE_CHECKPOINT}.`);
    const state = requireMatchingState();
    const previousPhase = Q.text(state.phase);
    if (previousPhase !== "edited" && previousPhase !== "baseline-ready") {
      Q.fail(`ASSET-LIFE-001 is at phase '${previousPhase}', expected 'edited' or a terminal fast-forward from 'baseline-ready'.`);
    }
    const result = assertLifecycleCreated(state, "deleted", {
      allowExternalAssets: previousPhase === "baseline-ready"
    });
    const ignoredExternalAssets = Q.collection("assets")
      .find({
        ownerUserId: hostUserId,
        title: { $nin: LIFE_TITLES }
      })
      .toArray()
      .map(asset => ({
        assetId: Q.text(asset.assetId),
        type: Q.text(asset.type),
        title: Q.text(asset.title),
        status: lifecycleStatusCode(asset.status)
      }));
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id, phase: previousPhase },
      {
        $set: {
          phase: "deleted",
          deletedAtIso: Q.text(result.byType.Transport.trashedAtIso),
          terminalFastForward: previousPhase === "baseline-ready",
          ignoredExternalAssets,
          "context.assetIds": {
            Transport: Q.text(result.byType.Transport.assetId),
            Accommodation: Q.text(result.byType.Accommodation.assetId),
            Supplies: Q.text(result.byType.Supplies.assetId)
          }
        }
      }
    );
    const current = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: current.phase,
      oracle: lifecycleOracle(current),
      next: "After the single final reload UI check, run status for the terminal persisted oracle."
    });
  }

  function statusLifecycle() {
    const selected = config();
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "not-staged",
        why: selected.why,
        next: `Run stage asset-domain ${checkpointId}.`
      });
      return;
    }
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged checkpoint is '${state.checkpointId}', not '${checkpointId}'.`);
    }
    switch (Q.text(state.phase)) {
      case "baseline-ready": assertLifecycleBaseline(state); break;
      case "created": assertLifecycleCreated(state, "created"); break;
      case "edited": assertLifecycleCreated(state, "edited"); break;
      case "deleted": assertLifecycleCreated(state, "deleted", {
        allowExternalAssets: Array.isArray(state.ignoredExternalAssets) && state.ignoredExternalAssets.length > 0
      }); break;
      default: Q.fail(`ASSET-LIFE-001 has unsupported phase '${Q.text(state.phase)}'.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: state.phase,
      why: selected.why,
      workerExpectation: selected.worker,
      oracle: lifecycleOracle(state),
      next: lifecycleNextAction(state.phase)
    });
  }

  function lifecycleNextAction(phase) {
    switch (Q.text(phase)) {
      case "baseline-ready": return config().action;
      case "created": return `Edit only Subtitle on ${LIFE_ASSETS.Transport.title}, then run verify-lifecycle-edited.`;
      case "edited": return `Delete only ${LIFE_ASSETS.Transport.title}, then run verify-lifecycle-deleted.`;
      case "deleted": return "Run the final reload checks, then status for the terminal persisted oracle.";
      default: return "Stop and inspect the checkpoint phase.";
    }
  }

  function resetLifecycle() {
    const state = requireMatchingState();
    const targetAssets = lifecycleDocuments();
    const assetIds = targetAssets.map(asset => Q.text(asset.assetId)).filter(Boolean);
    if (assetIds.length > 0) {
      const resourceResidue = Q.collection("activityResources").countDocuments({
        $or: [
          { "assetAssignmentIds.Transport": { $in: assetIds } },
          { "assetAssignmentIds.Accommodation": { $in: assetIds } },
          { "assetAssignmentIds.Supplies": { $in: assetIds } }
        ]
      });
      if (resourceResidue !== 0) {
        Q.fail("ASSET-LIFE-001 reset found an unexpected Event resource assignment; refusing to delete a containing resource document.");
      }
      const cleanup = [
        { collection: "activityMembers", selector: { ownerType: "asset", ownerId: { $in: assetIds } } },
        { collection: "assetRequests", selector: { assetId: { $in: assetIds } } },
        { collection: "notificationOutbox", selector: { $or: [
          { entityId: { $in: assetIds } },
          { "payload.assetId": { $in: assetIds } }
        ] } },
        { collection: "userNotifications", selector: { $or: [
          { sourceId: { $in: assetIds } },
          { "payload.assetId": { $in: assetIds } }
        ] } },
        { collection: "affinityRecomputeTasks", selector: { targetId: { $in: assetIds } } }
      ];
      for (const spec of cleanup) Q.collection(spec.collection).deleteMany(spec.selector);
    }
    Q.collection("assets").deleteMany(lifecycleAssetSelector());
    const remainingCounts = lifecycleAuthoritativeCounts();
    const update = {
      $set: {
        "activities.cars": remainingCounts.Transport,
        "activities.accommodation": remainingCounts.Accommodation,
        "activities.supplies": remainingCounts.Supplies,
        "activities.asset.cars": remainingCounts.Transport,
        "activities.asset.accommodation": remainingCounts.Accommodation,
        "activities.asset.supplies": remainingCounts.Supplies
      }
    };
    const userReset = Q.collection("users").updateOne(
      { $or: [{ _id: hostUserId }, { userId: hostUserId }] },
      update
    );
    if (userReset.matchedCount !== 1) Q.fail("ASSET-LIFE-001 reset could not restore the owner counters.");
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      restoredAtIso: Q.nowIso(),
      retainedExternalEvidence: "Managed MinIO image objects and operational telemetry are not deleted by the Mongo checkpoint reset.",
      next: `Run status asset-domain ${checkpointId}; expected phase is not-staged.`
    });
  }

  function stageVisibility() {
    const selected = config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    const actors = assertVisibilityActors();
    for (const spec of visibilityDomainSelectors()) {
      const collisionCount = Q.collection(spec.collection).countDocuments(spec.selector);
      if (collisionCount !== 0) {
        Q.fail(`ASSET-VIS-001 found ${collisionCount} stale target document(s) in '${spec.collection}'; refusing to overwrite them without a recoverable checkpoint state.`);
      }
    }
    const baselineCounts = lifecycleAuthoritativeCounts();
    assertLifecycleCounts(baselineCounts, "ASSET-VIS-001 pre-stage");
    const stagedAtIso = Q.nowIso();
    const state = {
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId,
      database: db.getName(),
      stagedAtIso,
      phase: "staging",
      visibilityFixtureSchemaVersion: VISIBILITY_FIXTURE_SCHEMA_VERSION,
      baselineCounts,
      context: {
        hostUserId,
        friendUserId: VISIBILITY_FRIEND_USER_ID,
        unrelatedUserId: VISIBILITY_UNRELATED_USER_ID,
        eventId: VISIBILITY_EVENT_ID,
        subEventId: VISIBILITY_SUB_EVENT_ID,
        assetIds: VISIBILITY_ASSET_IDS
      },
      snapshots: Q.snapshotSpecs(visibilityRestoreSelectors())
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    try {
      Q.collection("assets").insertMany(Object.values(VISIBILITY_ASSETS).map(visibilityAssetDocument));
      Q.collection("events").insertOne(visibilityEventDocument());
      Q.collection("activityMembers").insertMany([
        visibilityEventMemberDocument(hostUserId, "Admin"),
        visibilityEventMemberDocument(VISIBILITY_FRIEND_USER_ID, "Member"),
        visibilityEventMemberDocument(VISIBILITY_UNRELATED_USER_ID, "Member")
      ]);
      const authoritative = lifecycleAuthoritativeCounts();
      const counterUpdate = Q.collection("users").updateOne(
        { $or: [{ _id: hostUserId }, { userId: hostUserId }] },
        { $set: {
          "activities.cars": authoritative.Transport,
          "activities.accommodation": authoritative.Accommodation,
          "activities.supplies": authoritative.Supplies,
          "activities.asset.cars": authoritative.Transport,
          "activities.asset.accommodation": authoritative.Accommodation,
          "activities.asset.supplies": authoritative.Supplies
        } }
      );
      if (counterUpdate.matchedCount !== 1) {
        Q.fail("ASSET-VIS-001 could not synchronize Casey's Asset counters.");
      }
      assertVisibilityFixture(state);
      const visibilityReadBaseline = visibilityDomainSnapshot();
      Q.collection(Q.STATE_COLLECTION).updateOne(
        { _id: state._id, phase: "staging" },
        { $set: { phase: "baseline-ready", visibilityReadBaseline } }
      );
    } catch (error) {
      Q.fail(`ASSET-VIS-001 stage failed after snapshot: ${Q.text(error && error.message)}. Run reset asset-domain ${checkpointId}.`);
    }
    const current = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: current.phase,
      stagedAtIso,
      identities: current.context,
      actors,
      why: selected.why,
      workerExpectation: selected.worker,
      baseline: visibilityOracle(current),
      next: selected.action,
      expectedVisibleResult: selected.expected
    });
  }

  function statusVisibility() {
    const selected = config();
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "not-staged",
        why: selected.why,
        next: `Run stage asset-domain ${checkpointId}.`
      });
      return;
    }
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged checkpoint is '${state.checkpointId}', not '${checkpointId}'.`);
    }
    if (!state.visibilityReadBaseline) {
      Q.fail("ASSET-VIS-001 has no completed read-only baseline; reset the failed stage before continuing.");
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: Q.text(state.phase),
      why: selected.why,
      workerExpectation: selected.worker,
      oracle: visibilityOracle(state),
      expectedVisibleResult: selected.expected,
      next: Q.text(state.phase) === "visibility-edited"
        ? "Record the browser evidence, close ASSET-VIS-001, then reset the fixture."
        : Q.text(state.phase) === "readonly-verified"
          ? "Complete the single Casey visibility Edit and three-client reload branch, run the edited HTTP matrix, then run verify-visibility-edited."
          : "Complete the baseline checklist reads, run the authenticated HTTP matrix, then run verify-visibility-readonly."
    });
  }

  function verifyVisibilityReadonly() {
    if (checkpointId !== VISIBILITY_CHECKPOINT) {
      Q.fail(`verify-visibility-readonly is restricted to ${VISIBILITY_CHECKPOINT}.`);
    }
    const state = requireMatchingState();
    if (!state.visibilityReadBaseline) {
      Q.fail("ASSET-VIS-001 has no read-only baseline to verify.");
    }
    assertVisibilityFixture(state);
    const current = visibilityDomainSnapshot();
    const changedKeys = Object.keys(current)
      .filter(key => !Q.sameJson(current[key], state.visibilityReadBaseline[key]));
    if (changedKeys.length !== 0) {
      Q.fail(`ASSET-VIS-001 list/detail reads changed persisted state in: ${changedKeys.join(", ")}.`);
    }
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      { $set: { phase: "readonly-verified", verifiedAtIso } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "readonly-verified",
      verifiedAtIso,
      changedPersistedCollections: [],
      oracle: visibilityOracle(requireMatchingState()),
      next: "Change only QA ASSET-VIS-001 Public Transport from Public to Invitation only as Casey, reload all three clients and compare the edited matrix."
    });
  }

  function repairVisibilityFixtureSchema() {
    if (checkpointId !== VISIBILITY_CHECKPOINT) {
      Q.fail(`repair-visibility-fixture is restricted to ${VISIBILITY_CHECKPOINT}.`);
    }
    const state = requireMatchingState();
    if (Q.number(state.visibilityFixtureSchemaVersion) >= VISIBILITY_FIXTURE_SCHEMA_VERSION) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: state.phase,
        visibilityFixtureSchemaVersion: state.visibilityFixtureSchemaVersion,
        changedPersistedCollections: [],
        result: "fixture-already-current"
      });
      return;
    }
    if (Q.text(state.phase) !== "readonly-verified" || !state.visibilityReadBaseline) {
      Q.fail(`ASSET-VIS-001 legacy fixture repair requires phase 'readonly-verified', found '${Q.text(state.phase)}'.`);
    }
    const baselineAssets = new Map((state.visibilityReadBaseline.assets || [])
      .map(asset => [Q.text(asset.assetId), asset]));
    const currentAssets = new Map(visibilityDocuments().map(asset => [Q.text(asset.assetId), asset]));
    const expectedPricing = disabledAssetPricingDocument();
    const assetClass = "com.raxim.myscoutee.profile.data.document.Asset";
    for (const assetId of VISIBILITY_ASSET_IDS) {
      const before = baselineAssets.get(assetId);
      const after = currentAssets.get(assetId);
      if (!before || !after) {
        Q.fail(`ASSET-VIS-001 cannot repair missing legacy fixture Asset '${assetId}'.`);
      }
      const conflicts = [];
      if (before.pricing && !sameRelaxedPlainJson(before.pricing, expectedPricing)) conflicts.push("baseline pricing");
      if (after.pricing && !sameRelaxedPlainJson(after.pricing, expectedPricing)) conflicts.push("current pricing");
      if (Q.text(before._class) && Q.text(before._class) !== assetClass) conflicts.push("baseline _class");
      if (Q.text(after._class) && Q.text(after._class) !== assetClass) conflicts.push("current _class");
      if (Q.text(before.imageUrl)) conflicts.push("baseline imageUrl");
      if (Q.text(after.imageUrl)) conflicts.push("current imageUrl");
      if (conflicts.length > 0) {
        Q.fail(`ASSET-VIS-001 legacy fixture '${assetId}' contains non-default schema values in ${conflicts.join(", ")}; refusing repair.`);
      }
    }
    const repairResult = Q.collection("assets").updateMany(
      { assetId: { $in: VISIBILITY_ASSET_IDS } },
      { $set: {
        _class: assetClass,
        imageUrl: "",
        pricing: expectedPricing
      } }
    );
    if (repairResult.matchedCount !== VISIBILITY_ASSET_IDS.length) {
      Q.fail(`ASSET-VIS-001 legacy fixture repair matched ${repairResult.matchedCount} Assets instead of ${VISIBILITY_ASSET_IDS.length}.`);
    }
    const repairedBaseline = {
      ...state.visibilityReadBaseline,
      assets: state.visibilityReadBaseline.assets.map(asset => VISIBILITY_ASSET_IDS.includes(Q.text(asset.assetId))
        ? {
            ...asset,
            _class: assetClass,
            imageUrl: "",
            pricing: disabledAssetPricingDocument()
          }
        : asset)
    };
    const repairedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id, phase: "readonly-verified" },
      { $set: {
        visibilityFixtureSchemaVersion: VISIBILITY_FIXTURE_SCHEMA_VERSION,
        visibilityFixtureRepairedAtIso: repairedAtIso,
        visibilityReadBaseline: repairedBaseline
      } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "readonly-verified",
      repairedAtIso,
      visibilityFixtureSchemaVersion: VISIBILITY_FIXTURE_SCHEMA_VERSION,
      changedPersistedCollections: ["assets", Q.STATE_COLLECTION],
      repair: "Added the normal Asset _class, empty imageUrl and disabled default pricing to the legacy staged controls and their checkpoint baseline.",
      next: `Run verify-visibility-edited asset-domain ${checkpointId}.`
    });
  }

  function verifyVisibilityEdited() {
    if (checkpointId !== VISIBILITY_CHECKPOINT) {
      Q.fail(`verify-visibility-edited is restricted to ${VISIBILITY_CHECKPOINT}.`);
    }
    const state = requireMatchingState();
    if (Q.text(state.phase) !== "readonly-verified") {
      Q.fail(`ASSET-VIS-001 visibility Edit verification requires phase 'readonly-verified', found '${Q.text(state.phase)}'.`);
    }
    const fixture = assertVisibilityFixture(state, "visibility-edited");
    const current = visibilityDomainSnapshot();
    const effects = assertVisibilityEditEffects(state, current);
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id, phase: "readonly-verified" },
      { $set: { phase: "visibility-edited", visibilityEditedVerifiedAtIso: verifiedAtIso } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "visibility-edited",
      verifiedAtIso,
      changedPersistedCollections: effects.changedKeys,
      affinityTaskStatus: effects.affinityTaskStatus,
      counters: fixture.counters,
      targetMatrix: visibilityExpectedMatrix("visibility-edited"),
      next: "Record ASSET-VIS-001 PASS only when the reloaded Casey/Lina/Liam browser sets and edited authenticated HTTP visibility/detail matrix also match."
    });
  }

  function resetVisibility() {
    const state = requireMatchingState();
    Q.restoreSnapshots(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      restoredAtIso: Q.nowIso(),
      next: `Run status asset-domain ${checkpointId}; expected phase is not-staged.`
    });
  }

  function stage() {
    if (checkpointId === LIFE_CHECKPOINT) {
      stageLifecycle();
      return;
    }
    if (checkpointId === VISIBILITY_CHECKPOINT) {
      stageVisibility();
      return;
    }
    const selected = config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    if (hostUserId === participantUserId) Q.fail("host and participant must differ.");
    Q.ensureUser(hostUserId, "asset owner/event host");
    Q.ensureUser(participantUserId, "asset participant");
    if (selected.stage === "member-two-pending") Q.ensureUser(thirdUserId, "asset rejection target");
    if (checkpointId === BORROW_CHECKPOINT) {
      Q.ensureUser(thirdUserId, "Asset Borrow rejection requester");
      Q.ensureUser(VISIBILITY_FRIEND_USER_ID, "Asset Borrow sibling-group capacity control");
    }
    const stagedAtIso = Q.nowIso();
    const borrowWindow = checkpointId === BORROW_CHECKPOINT
      ? {
          startAtIso: dateIso(-60),
          overlapEndAtIso: dateIso(10080),
          nonOverlapStartAtIso: dateIso(11520),
          nonOverlapEndAtIso: dateIso(12960),
          endAtIso: dateIso(43200)
        }
      : {};
    const state = {
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId,
      database: db.getName(),
      phase: "baseline-ready",
      stagedAtIso,
      context: {
        hostUserId,
        participantUserId,
        thirdUserId,
        siblingControlUserId: checkpointId === BORROW_CHECKPOINT ? VISIBILITY_FRIEND_USER_ID : null,
        primaryAssetId: PRIMARY_ASSET_ID,
        secondaryAssetId: SECONDARY_ASSET_ID,
        tertiaryAssetId: checkpointId === BORROW_CHECKPOINT ? TERTIARY_ASSET_ID : null,
        paidAssetId: checkpointId === BORROW_CHECKPOINT ? PAID_ASSET_ID : null,
        borrowPaymentCardId: checkpointId === BORROW_CHECKPOINT ? BORROW_PAYMENT_CARD_ID : null,
        eventId: EVENT_ID,
        subEventId: SUB_EVENT_ID,
        groupAId: checkpointId === BORROW_CHECKPOINT ? GROUP_A_ID : null,
        groupBId: checkpointId === BORROW_CHECKPOINT ? GROUP_B_ID : null,
        groupAResourceOwnerId: checkpointId === BORROW_CHECKPOINT ? GROUP_A_RESOURCE_OWNER_ID : null,
        groupBResourceOwnerId: checkpointId === BORROW_CHECKPOINT ? GROUP_B_RESOURCE_OWNER_ID : null,
        ...borrowWindow
      },
      snapshots: Q.snapshotSpecs(selectors()),
      savedUserActivities: checkpointId === BORROW_CHECKPOINT
        ? [hostUserId, participantUserId, thirdUserId, VISIBILITY_FRIEND_USER_ID].map(borrowUserActivities)
        : []
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    try {
      clearFixture();
      stageData(selected.stage, state);
    } catch (error) {
      Q.fail(`stage failed after snapshot: ${Q.text(error && error.message)}. Run reset asset-domain ${checkpointId}.`);
    }
    const baseline = oracle(state);
    const baselineChecks = checkpointId === BORROW_CHECKPOINT
      ? assertBorrowBaseline(state, baseline)
      : null;
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline-ready",
      stagedAtIso,
      identities: state.context,
      why: selected.why,
      workerExpectation: selected.worker,
      baseline,
      baselineChecks,
      next: selected.action,
      expectedVisibleResult: selected.expected
    });
  }

  function requireMatchingState() {
    const state = Q.activeState(SCENARIO, true);
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged checkpoint is '${state.checkpointId}', not '${checkpointId}'.`);
    }
    return state;
  }

  function next() {
    if (checkpointId === LIFE_CHECKPOINT) {
      const state = requireMatchingState();
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: state.phase,
        why: config().why,
        action: lifecycleNextAction(state.phase),
        workerExpectation: config().worker,
        identities: state.context
      });
      return;
    }
    if (checkpointId === VISIBILITY_CHECKPOINT) {
      const state = requireMatchingState();
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: state.phase,
        why: config().why,
        action: config().action,
        expectedVisibleResult: config().expected,
        workerExpectation: config().worker,
        identities: state.context,
        targetMatrix: visibilityExpectedMatrix(Q.text(state.phase))
      });
      return;
    }
    const selected = config();
    const state = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: Q.text(state.phase) || "awaiting-manual-action",
      why: selected.why,
      action: selected.action,
      expectedVisibleResult: selected.expected,
      workerExpectation: selected.worker,
      identities: state.context
    });
  }

  function status() {
    if (checkpointId === LIFE_CHECKPOINT) {
      statusLifecycle();
      return;
    }
    if (checkpointId === VISIBILITY_CHECKPOINT) {
      statusVisibility();
      return;
    }
    const selected = config();
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "not-staged",
        why: selected.why,
        next: `Run stage asset-domain ${checkpointId}.`
      });
      return;
    }
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged checkpoint is '${state.checkpointId}', not '${checkpointId}'.`);
    }
    const current = oracle(state);
    if (checkpointId === BORROW_CHECKPOINT) {
      assertBorrowPaymentSimulator(current);
    }
    const baselineChecks = checkpointId === BORROW_CHECKPOINT && Q.text(state.phase) === "baseline-ready"
      ? assertBorrowBaseline(state, current)
      : null;
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: Q.text(state.phase) || "inspect-manual-checkpoint",
      why: selected.why,
      workerExpectation: selected.worker,
      identities: state.context,
      oracle: current,
      baselineChecks,
      expectedVisibleResult: selected.expected,
      next: checkpointId === BORROW_CHECKPOINT
        ? "Baseline ready. Launch the configured managed sessions, then the user starts the deduplicated ASSET-BORROW-001 guide; Codex performs no browser checklist action."
        : "Compare the UI screenshot with this identity-level oracle. Record PASS only when asset and event roles remain independently correct."
    });
  }

  function reset() {
    if (checkpointId === LIFE_CHECKPOINT) {
      resetLifecycle();
      return;
    }
    if (checkpointId === VISIBILITY_CHECKPOINT) {
      resetVisibility();
      return;
    }
    config();
    const state = requireMatchingState();
    if (checkpointId === BORROW_CHECKPOINT) {
      const paymentIds = Q.collection("payments")
        .find({ sourceId: { $in: ASSET_IDS } }, { projection: { _id: 1 } })
        .toArray()
        .map(item => Q.text(item._id))
        .filter(Boolean);
      if (paymentIds.length > 0) {
        Q.collection("payment_gateway_operations").deleteMany({ paymentId: { $in: paymentIds } });
      }
    }
    Q.restoreSnapshots(state.snapshots);
    for (const saved of state.savedUserActivities || []) restoreBorrowUserActivities(saved);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      restoredAtIso: Q.nowIso(),
      next: `Run status asset-domain ${checkpointId}; expected phase is not-staged.`
    });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stage(); break;
    case "next": next(); break;
    case "status": status(); break;
    case "capture-lifecycle-created": captureLifecycleCreated(); break;
    case "verify-lifecycle-edited": verifyLifecycleEdited(); break;
    case "verify-lifecycle-deleted": verifyLifecycleDeleted(); break;
    case "verify-visibility-readonly": verifyVisibilityReadonly(); break;
    case "repair-visibility-fixture": repairVisibilityFixtureSchema(); break;
    case "verify-visibility-edited": verifyVisibilityEdited(); break;
    case "verify-borrow-cancel": verifyBorrowCancel(); break;
    case "verify-borrow-reject": verifyBorrowReject(); break;
    case "verify-borrow-accepted": verifyBorrowAccepted(); break;
    case "verify-borrow-paid-pending-organizer": verifyBorrowPaidPendingOrganizer(); break;
    case "verify-borrow-paid-accepted-participant": verifyBorrowPaidAcceptedParticipant(); break;
    case "verify-borrow-terminal": verifyBorrowTerminal(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
