/* global ManualQa, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "event-domain-tournament-member-notification";
  const CHECKPOINT = "TOURNAMENT-MEMBER-003";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const PREFIX = "manual-qa-checkpoint:v1:tournament-member-notification";
  const STATE_ID = Q.stateId(SCENARIO);
  const EVENT_ID = `${PREFIX}:event`;
  const STAGE_ID = `${EVENT_ID}:stage:qualifiers`;
  const GROUP_ID = `${STAGE_ID}:group:1`;
  const ROOM_ID = `random-room:${EVENT_ID}:${STAGE_ID}:${GROUP_ID}`;
  const HOST_ID = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID) || "650000000000000000000061";
  const NOVA_ID = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID) || "650000000000000000000062";
  const RILEY_ID = "650000000000000000000063";
  const LINA_ID = "178e8d0cbe164fa3fede5884";
  const ALL_USERS = [HOST_ID, NOVA_ID, RILEY_ID, LINA_ID];
  const EXPECTED_ACTIVE_AFTER_REMOVE = [HOST_ID, RILEY_ID, LINA_ID].sort();
  const SCORE_BY_USER_ID = {
    [HOST_ID]: 1,
    [NOVA_ID]: 7,
    [RILEY_ID]: 9,
    [LINA_ID]: 5
  };

  function sorted(values) {
    return [...new Set((values || []).map(Q.text).filter(Boolean))].sort();
  }

  function state(required = true) {
    const value = Q.collection(Q.STATE_COLLECTION).findOne({ _id: STATE_ID });
    if (!value && required) Q.fail(`${CHECKPOINT} is not staged.`);
    return value;
  }

  function relatedSelector() {
    return {
      $or: [
        { sourceId: EVENT_ID },
        { parentEventId: EVENT_ID },
        { eventId: EVENT_ID },
        { ownerId: EVENT_ID },
        { ownerId: ROOM_ID },
        { entityId: EVENT_ID },
        { entityId: ROOM_ID },
        { sourceId: ROOM_ID },
        { "payload.eventId": EVENT_ID },
        { "payload.eventId": ROOM_ID },
        { "payload.parentEventId": EVENT_ID }
      ]
    };
  }

  function selectors() {
    return [
      { collection: "events", selector: { $or: [{ sourceId: EVENT_ID }, { parentEventId: EVENT_ID }] } },
      { collection: "activityMembers", selector: relatedSelector() },
      { collection: "activitySubEventStageRuntime", selector: { ownerId: EVENT_ID } },
      { collection: "eventLeaderboardEntries", selector: { eventId: EVENT_ID } },
      { collection: "chats", selector: relatedSelector() },
      { collection: "chatMessages", selector: relatedSelector() },
      { collection: "notificationOutbox", selector: relatedSelector() },
      { collection: "userNotifications", selector: relatedSelector() },
      { collection: "affinityRecomputeTasks", selector: relatedSelector() }
    ];
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

  function applyEventCounterDelta(userId, delta, hosting = false) {
    const increments = hosting
      ? {
          "activities.hosting": delta,
          "activities.event.all": delta,
          "activities.event.hosting": delta
        }
      : {
          "activities.events": delta,
          "activities.event.all": delta,
          "activities.event.active": delta
        };
    const result = Q.collection("users").updateOne(
      { $or: [{ _id: userId }, { userId }] },
      { $inc: increments }
    );
    if (result.matchedCount !== 1) Q.fail(`user '${userId}' disappeared while ${CHECKPOINT} was staged.`);
  }

  function member(ownerId, userId, role, status, atIso) {
    return {
      _id: `${PREFIX}:member:${ownerId === EVENT_ID ? "parent" : "room"}:${userId}`,
      syncKey: `${PREFIX}:member:${ownerId}:${userId}`,
      ownerType: "event",
      ownerId,
      userId,
      role,
      status,
      statusBeforeSuppression: null,
      suppressionRootOwnerId: null,
      suppressedAtIso: null,
      pendingSource: null,
      requestKind: null,
      invitedByUserId: null,
      actionAtIso: atIso,
      createdDate: atIso,
      createdUser: Q.ACTOR,
      updatedDate: atIso,
      updatedUser: Q.ACTOR
    };
  }

  function stageDefinition(stagedAtIso) {
    return {
      id: STAGE_ID,
      name: "Qualifiers",
      description: "Four-member removal and notification boundary",
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: 60,
      startAt: new Date(Date.now() - 30 * 60000).toISOString(),
      endAt: new Date(Date.now() + 30 * 60000).toISOString(),
      optional: false,
      capacityMin: 4,
      capacityMax: 4,
      tournamentGroupCapacityMin: 4,
      tournamentGroupCapacityMax: 4,
      tournamentLeaderboardType: "Score",
      tournamentAdvancePerGroup: 2,
      stageStatus: "A",
      stageStatusReason: "stage-started",
      stageStatusUpdatedAt: stagedAtIso,
      membersAccepted: 4,
      membersPending: 0,
      groupsCount: 1,
      groupsPending: 0
    };
  }

  function stageDefinitionDocument(stage) {
    const definition = { ...stage };
    delete definition.stageStatus;
    delete definition.stageStatusReason;
    delete definition.stageStatusUpdatedAt;
    delete definition.membersAccepted;
    delete definition.membersPending;
    delete definition.groupsCount;
    delete definition.groupsPending;
    return definition;
  }

  function rootEvent(stagedAtIso, stage) {
    return {
      _id: EVENT_ID,
      sourceId: EVENT_ID,
      syncKey: EVENT_ID,
      title: "QA TOURNAMENT-MEMBER-003",
      subtitle: "Four-person room removal notification checkpoint",
      status: "A",
      published: true,
      isTrashed: false,
      ownerUserId: HOST_ID,
      creatorUserId: HOST_ID,
      organizerUserId: HOST_ID,
      creatorName: "Casey Bridge",
      creatorInitials: "CB",
      creatorCity: "Austin",
      admins: [HOST_ID],
      visibility: "Invitation only",
      blindMode: "Open Event",
      autoInviter: false,
      ticketing: false,
      approvalRequired: false,
      capacityMin: 4,
      capacityMax: 4,
      capacityTotal: 4,
      full: true,
      acceptedMembers: 4,
      pendingMembers: 0,
      acceptedMemberUserIds: ALL_USERS,
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [],
      subEventsEnabled: true,
      subEventDefinitions: [stageDefinitionDocument(stage)],
      subEvents: [stage],
      currentStage: { id: STAGE_ID, name: "Qualifiers", stageNumber: 1, totalStages: 1, status: "A" },
      mode: "Tournament",
      eventType: "event",
      topics: ["Manual QA", "Tournament"],
      imageUrl: "",
      startAtIso: stage.startAt,
      endAtIso: stage.endAt,
      createdDate: stagedAtIso,
      createdUser: Q.ACTOR,
      updatedDate: stagedAtIso,
      updatedUser: Q.ACTOR
    };
  }

  function roomEvent(stagedAtIso, stage) {
    return {
      _id: ROOM_ID,
      sourceId: ROOM_ID,
      syncKey: `scheduler:${ROOM_ID}`,
      title: "Tournament Group A",
      subtitle: "Tournament group for QA TOURNAMENT-MEMBER-003.",
      status: "A",
      published: true,
      ownerUserId: null,
      creatorUserId: null,
      organizerUserId: HOST_ID,
      admins: [],
      visibility: "Invitation only",
      blindMode: "Open Event",
      autoInviter: false,
      ticketing: false,
      approvalRequired: false,
      capacityMin: 4,
      capacityMax: 4,
      capacityTotal: 4,
      full: true,
      acceptedMembers: 4,
      pendingMembers: 0,
      acceptedMemberUserIds: ALL_USERS,
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [],
      subEvents: [],
      subEventsEnabled: false,
      subEventDefinitions: [],
      mode: "Tournament",
      topics: ["Manual QA"],
      imageUrl: "/media/public?key=images/system/tournament-room/v1/large.webp",
      startAtIso: stage.startAt,
      endAtIso: stage.endAt,
      parentEventId: EVENT_ID,
      parentSubEventId: STAGE_ID,
      generated: true,
      eventType: "tournament-room",
      groupId: GROUP_ID,
      createdDate: stagedAtIso,
      createdUser: Q.ACTOR,
      updatedDate: stagedAtIso,
      updatedUser: Q.ACTOR
    };
  }

  function roomChat(userId, stagedAtIso) {
    return {
      _id: `${PREFIX}:chat:${userId}`,
      id: ROOM_ID,
      ownerUserId: userId,
      avatar: "/media/public?key=images/system/tournament-room/v1/large.webp",
      title: "Tournament Group A",
      lastMessage: "",
      lastSenderId: null,
      memberIds: sorted(ALL_USERS),
      unread: 0,
      dateIso: stagedAtIso,
      channelType: "mainEvent",
      ownerId: ROOM_ID,
      eventId: ROOM_ID,
      ownerStatus: "A",
      revision: 1,
      subEventId: null,
      groupId: null
    };
  }

  function stageFixture() {
    Q.assertDeploymentSafety();
    if (checkpointId !== CHECKPOINT) Q.fail(`this fixture is restricted to ${CHECKPOINT}.`);
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    ALL_USERS.forEach(userId => Q.ensureUser(userId, `${CHECKPOINT} user`));
    const snapshots = Q.snapshotSpecs(selectors());
    const savedUserActivities = ALL_USERS.map(userActivities);
    selectors().forEach(spec => Q.collection(spec.collection).deleteMany(spec.selector));
    const stagedAtIso = Q.nowIso();
    const stage = stageDefinition(stagedAtIso);
    Q.collection("events").insertMany([rootEvent(stagedAtIso, stage), roomEvent(stagedAtIso, stage)]);
    Q.collection("activityMembers").insertMany([
      ...ALL_USERS.map(userId => member(EVENT_ID, userId, userId === HOST_ID ? "Admin" : "Member", "accepted", stagedAtIso)),
      ...ALL_USERS.map(userId => member(ROOM_ID, userId, "Member", "accepted", stagedAtIso))
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
    Q.collection("eventLeaderboardEntries").insertMany(ALL_USERS.map(userId => ({
      _id: `${PREFIX}:score:${userId}`,
      syncKey: `${PREFIX}:score:${userId}`,
      eventId: EVENT_ID,
      subEventId: STAGE_ID,
      groupId: GROUP_ID,
      entryType: "score",
      memberId: userId,
      scoreValue: SCORE_BY_USER_ID[userId],
      note: `${CHECKPOINT} controlled score`,
      createdAtIso: stagedAtIso,
      createdUser: HOST_ID,
      updatedDate: stagedAtIso,
      updatedUser: HOST_ID
    })));
    Q.collection("chats").insertMany(ALL_USERS.map(userId => roomChat(userId, stagedAtIso)));
    applyEventCounterDelta(HOST_ID, 1, true);
    applyEventCounterDelta(NOVA_ID, 1);
    applyEventCounterDelta(RILEY_ID, 1);
    applyEventCounterDelta(LINA_ID, 1);
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: STATE_ID,
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "staged-four-member-room",
      stagedAtIso,
      snapshots,
      savedUserActivities,
      actionBaselineCounters: counters()
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "staged-four-member-room",
      eventId: EVENT_ID,
      groupId: GROUP_ID,
      roomId: ROOM_ID,
      members: ALL_USERS.map(Q.user),
      scores: scoreSnapshot(),
      next: "Open the three configured sessions. As Casey remove Nova exactly once from the parent Members action; Riley is the visible participant-recipient control and Lina is verified by the persisted oracle. Do not use DQ, a scheduler or fixture repair."
    });
  }

  function storedStatus(ownerId, userId) {
    const record = Q.collection("activityMembers").findOne({ ownerType: "event", ownerId, userId });
    return Q.text(record && record.status);
  }

  function scoreSnapshot() {
    return Q.collection("eventLeaderboardEntries").find({ eventId: EVENT_ID }).sort({ memberId: 1 }).toArray().map(entry => ({
      memberId: Q.text(entry.memberId),
      scoreValue: Q.number(entry.scoreValue),
      groupId: Q.text(entry.groupId)
    }));
  }

  function counter(userId) {
    const user = Q.ensureUser(userId, `${CHECKPOINT} counter user`);
    const activities = user.activities || {};
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

  function counters() {
    return ALL_USERS.map(counter);
  }

  function notificationSnapshot() {
    const outbox = Q.collection("notificationOutbox").find({ "payload.parentEventId": EVENT_ID }).toArray();
    const inbox = Q.collection("userNotifications").find({ "payload.parentEventId": EVENT_ID }).toArray();
    return {
      outbox: outbox.map(item => ({
        scope: Q.text(item.recipientScope),
        recipients: sorted(item.recipientUserIds),
        role: Q.text(item.payload && item.payload.recipientRole),
        memberName: Q.text(item.payload && item.payload.memberName)
      })).sort((left, right) => left.scope.localeCompare(right.scope)),
      inbox: inbox.map(item => ({
        recipientUserId: Q.text(item.recipientUserId),
        role: Q.text(item.payload && item.payload.recipientRole),
        memberName: Q.text(item.payload && item.payload.memberName),
        body: Q.text(item.body || item.message)
      })).sort((left, right) => left.recipientUserId.localeCompare(right.recipientUserId))
    };
  }

  function snapshot() {
    const parent = Q.collection("events").findOne({ sourceId: EVENT_ID });
    const room = Q.collection("events").findOne({ sourceId: ROOM_ID });
    const roomChats = Q.collection("chats").find({ $or: [{ ownerId: ROOM_ID }, { eventId: ROOM_ID }] }).toArray();
    return {
      parent: {
        acceptedUserIds: sorted(parent && parent.acceptedMemberUserIds),
        novaStatus: storedStatus(EVENT_ID, NOVA_ID)
      },
      room: {
        acceptedUserIds: sorted(room && room.acceptedMemberUserIds),
        novaStatus: storedStatus(ROOM_ID, NOVA_ID)
      },
      roomChats: roomChats.map(chat => ({
        ownerUserId: Q.text(chat.ownerUserId),
        memberIds: sorted(chat.memberIds)
      })).sort((left, right) => left.ownerUserId.localeCompare(right.ownerUserId)),
      scores: scoreSnapshot(),
      notifications: notificationSnapshot(),
      counters: counters()
    };
  }

  function status() {
    Q.assertDeploymentSafety();
    const currentState = state(false);
    if (!currentState) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "not-staged",
        next: `After resetting the active checkpoint, run stage event-domain ${CHECKPOINT}.` });
      return;
    }
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: currentState.phase, oracle: snapshot() });
  }

  function verify() {
    Q.assertDeploymentSafety();
    const currentState = state();
    const current = snapshot();
    const expectedScores = ALL_USERS.map(userId => ({
      memberId: userId,
      scoreValue: SCORE_BY_USER_ID[userId],
      groupId: GROUP_ID
    })).sort((left, right) => left.memberId.localeCompare(right.memberId));
    const outbox = current.notifications.outbox;
    const inbox = current.notifications.inbox;
    const targetOutbox = outbox.find(item => item.role === "removed-member");
    const participantOutbox = outbox.find(item => item.role === "event-participant");
    const baselineByUser = new Map((currentState.actionBaselineCounters || []).map(item => [Q.text(item.userId), item]));
    const currentByUser = new Map(current.counters.map(item => [item.userId, item]));
    const unchangedUsers = [HOST_ID, RILEY_ID, LINA_ID].every(userId =>
      Q.sameJson(currentByUser.get(userId), baselineByUser.get(userId)));
    const novaBefore = baselineByUser.get(NOVA_ID);
    const novaAfter = currentByUser.get(NOVA_ID);
    const novaCounterRemoved = novaBefore && novaAfter
      && novaAfter.events === Math.max(0, Q.number(novaBefore.events) - 1)
      && novaAfter.eventAll === Math.max(0, Q.number(novaBefore.eventAll) - 1)
      && novaAfter.eventActive === Math.max(0, Q.number(novaBefore.eventActive) - 1);
    if (current.parent.novaStatus !== "deleted"
        || current.parent.acceptedUserIds.includes(NOVA_ID)
        || current.room.novaStatus !== "removed"
        || !Q.sameJson(current.room.acceptedUserIds, EXPECTED_ACTIVE_AFTER_REMOVE)
        || !Q.sameJson(current.scores, expectedScores)
        || current.roomChats.some(chat => chat.ownerUserId === NOVA_ID || chat.memberIds.includes(NOVA_ID))
        || outbox.length !== 2
        || !targetOutbox || !Q.sameJson(targetOutbox.recipients, [NOVA_ID])
        || !participantOutbox
        || participantOutbox.scope !== "event-participants"
        || !Q.sameJson(participantOutbox.recipients, [RILEY_ID, LINA_ID].sort())
        || outbox.some(item => item.recipients.includes(HOST_ID))
        || outbox.some(item => item.memberName !== "Nova Social")
        || inbox.length !== 3
        || !Q.sameJson(sorted(inbox.map(item => item.recipientUserId)), [NOVA_ID, RILEY_ID, LINA_ID].sort())
        || inbox.some(item => item.recipientUserId === HOST_ID)
        || inbox.some(item => item.memberName !== "Nova Social")
        || !unchangedUsers
        || !novaCounterRemoved) {
      Q.fail(`${CHECKPOINT} did not preserve the four-person room removal, leaderboard identity, exact event-participant recipients and actor exclusion boundary.`);
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "application-write-verified",
      verifiedAtIso: Q.nowIso()
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "application-write-verified",
      oracle: current,
      visualPass: "In Group A Standings the order is Riley 9, Lina 5, Casey 1, then R / Nova Social / 7, then V / ----- for the vacant slot in the existing # column. Nova sees the self-removal notification; Riley and Lina see the event-participant notification; Casey sees none."
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
    case "verify-tournament-member-notification": verify(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
