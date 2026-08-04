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
  const EVENT_ID = `${PREFIX}:event`;
  const SUB_EVENT_ID = `${EVENT_ID}:sub-event:transport`;
  const IDS = [PRIMARY_ASSET_ID, SECONDARY_ASSET_ID, EVENT_ID];

  const CHECKPOINTS = {
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

  function assetDocument(assetId, ownerUserId, title) {
    const now = Q.nowIso();
    return {
      _id: assetId,
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
      routes: ["Austin"],
      policiesEnabled: false,
      policies: [],
      requests: [],
      visibility: "Public",
      status: "A",
      createdDate: now,
      createdUser: ownerUserId,
      updatedDate: now,
      updatedUser: ownerUserId
    };
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
      actionAtIso: now,
      createdDate: now,
      createdUser: hostUserId,
      updatedDate: now,
      updatedUser: hostUserId
    };
  }

  function selectors() {
    return [
      { collection: "assets", selector: { $or: [{ _id: { $in: IDS } }, { assetId: { $in: IDS } }] } },
      { collection: "events", selector: { $or: [{ _id: EVENT_ID }, { sourceId: EVENT_ID }] } },
      { collection: "activityMembers", selector: { ownerId: { $in: IDS } } },
      { collection: "assetRequests", selector: { assetId: { $in: IDS } } },
      { collection: "activityResources", selector: { $or: [{ ownerId: EVENT_ID }, { "assetAssignmentIds.Transport": { $in: [PRIMARY_ASSET_ID, SECONDARY_ASSET_ID] } }] } },
      { collection: "notificationOutbox", selector: { $or: [
        { entityId: { $in: IDS } },
        { "payload.assetId": { $in: [PRIMARY_ASSET_ID, SECONDARY_ASSET_ID] } },
        { "payload.eventId": EVENT_ID }
      ] } },
      { collection: "userNotifications", selector: { $or: [
        { sourceId: { $in: IDS } },
        { "payload.assetId": { $in: [PRIMARY_ASSET_ID, SECONDARY_ASSET_ID] } },
        { "payload.eventId": EVENT_ID }
      ] } },
      { collection: "affinityRecomputeTasks", selector: { targetId: { $in: IDS } } }
    ];
  }

  function clearFixture() {
    for (const spec of selectors()) Q.collection(spec.collection).deleteMany(spec.selector);
  }

  function stageData(stageKind) {
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
    }
  }

  function oracle(state) {
    const assets = Q.collection("assets").find({ assetId: { $in: [PRIMARY_ASSET_ID, SECONDARY_ASSET_ID] } }).toArray();
    const assetMembers = Q.collection("activityMembers").find({
      ownerType: "asset",
      ownerId: { $in: [PRIMARY_ASSET_ID, SECONDARY_ASSET_ID] }
    }).toArray();
    const eventMembers = Q.collection("activityMembers").find({ ownerType: "event", ownerId: EVENT_ID }).toArray();
    const resources = Q.collection("activityResources").find({ ownerId: EVENT_ID }).toArray();
    const outboxCount = Q.collection("notificationOutbox").countDocuments({
      $and: [
        { $or: [
          { entityId: { $in: IDS } },
          { "payload.assetId": { $in: [PRIMARY_ASSET_ID, SECONDARY_ASSET_ID] } },
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
        status: Q.text(asset.status)
      })),
      assetMembers: assetMembers.map(member => ({
        assetId: Q.text(member.ownerId),
        userId: Q.text(member.userId),
        role: Q.text(member.role),
        status: Q.text(member.status),
        requestKind: Q.text(member.requestKind),
        invitedByUserId: Q.text(member.invitedByUserId)
      })),
      eventMembers: eventMembers.map(member => ({
        eventId: Q.text(member.ownerId),
        userId: Q.text(member.userId),
        role: Q.text(member.role),
        status: Q.text(member.status)
      })),
      resources: resources.map(resource => ({
        eventId: Q.text(resource.ownerId),
        subEventId: Q.text(resource.subEventId),
        assetOwnerUserId: Q.text(resource.assetOwnerUserId),
        transportAssetIds: ((resource.assetAssignmentIds || {}).Transport || []),
        transportSettings: ((resource.assetSettingsByType || {}).Transport || {})
      })),
      afterStageOutboxCount: outboxCount
    };
  }

  function stage() {
    const selected = config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    if (hostUserId === participantUserId) Q.fail("host and participant must differ.");
    Q.ensureUser(hostUserId, "asset owner/event host");
    Q.ensureUser(participantUserId, "asset participant");
    if (selected.stage === "member-two-pending") Q.ensureUser(thirdUserId, "asset rejection target");
    const stagedAtIso = Q.nowIso();
    const state = {
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId,
      database: db.getName(),
      stagedAtIso,
      context: {
        hostUserId,
        participantUserId,
        thirdUserId,
        primaryAssetId: PRIMARY_ASSET_ID,
        secondaryAssetId: SECONDARY_ASSET_ID,
        eventId: EVENT_ID,
        subEventId: SUB_EVENT_ID
      },
      snapshots: Q.snapshotSpecs(selectors())
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    try {
      clearFixture();
      stageData(selected.stage);
    } catch (error) {
      Q.fail(`stage failed after snapshot: ${Q.text(error && error.message)}. Run reset asset-domain ${checkpointId}.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline-ready",
      stagedAtIso,
      identities: state.context,
      why: selected.why,
      workerExpectation: selected.worker,
      baseline: oracle(state),
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
    const selected = config();
    const state = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "awaiting-manual-action",
      why: selected.why,
      action: selected.action,
      expectedVisibleResult: selected.expected,
      workerExpectation: selected.worker,
      identities: state.context
    });
  }

  function status() {
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
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "inspect-manual-checkpoint",
      why: selected.why,
      workerExpectation: selected.worker,
      oracle: oracle(state),
      expectedVisibleResult: selected.expected,
      next: "Compare the UI screenshot with this identity-level oracle. Record PASS only when asset and event roles remain independently correct."
    });
  }

  function reset() {
    config();
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

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stage(); break;
    case "next": next(); break;
    case "status": status(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
