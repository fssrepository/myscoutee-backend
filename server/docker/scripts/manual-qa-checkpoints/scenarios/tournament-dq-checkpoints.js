/* global ManualQa, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "event-domain-tournament-dq";
  const CHECKPOINT = "TOURNAMENT-DQ-001";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const PREFIX = "manual-qa-checkpoint:v1:tournament-dq";
  const STATE_ID = Q.stateId(SCENARIO);
  const EVENT_ID = `${PREFIX}:event`;
  const STAGE_ID = `${EVENT_ID}:stage:qualifiers`;
  const GROUP_ID = `${STAGE_ID}:group:1`;
  const ROOM_ID = `random-room:${EVENT_ID}:${STAGE_ID}:${GROUP_ID}`;
  const CASEY_ID = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID) || "650000000000000000000061";
  const NOVA_ID = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID) || "650000000000000000000062";
  const RILEY_ID = "650000000000000000000063";
  const LINA_ID = "178e8d0cbe164fa3fede5884";
  const ALL_USERS = [CASEY_ID, NOVA_ID, RILEY_ID, LINA_ID];
  const SCORE_BY_USER_ID = {
    [CASEY_ID]: 1,
    [NOVA_ID]: 10,
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
    return { $or: [
      { sourceId: EVENT_ID },
      { sourceId: ROOM_ID },
      { parentEventId: EVENT_ID },
      { eventId: EVENT_ID },
      { eventId: ROOM_ID },
      { ownerId: EVENT_ID },
      { ownerId: ROOM_ID },
      { chatId: EVENT_ID },
      { chatId: ROOM_ID },
      { entityId: EVENT_ID },
      { entityId: ROOM_ID },
      { "payload.eventId": EVENT_ID },
      { "payload.eventId": ROOM_ID },
      { "payload.parentEventId": EVENT_ID }
    ] };
  }

  function selectors() {
    return [
      { collection: "events", selector: { $or: [{ sourceId: EVENT_ID }, { sourceId: ROOM_ID }] } },
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
    return { userId, present: Object.prototype.hasOwnProperty.call(user, "activities"), value: user.activities || {} };
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

  function member(ownerId, userId, role, stagedAtIso) {
    return {
      _id: `${PREFIX}:member:${ownerId === EVENT_ID ? "parent" : "room"}:${userId}`,
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
      description: "Four-person DQ and Reinstate checkpoint",
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

  function eventDocuments(stagedAtIso) {
    const stage = stageDefinition(stagedAtIso);
    const definition = { ...stage };
    for (const key of ["stageStatus", "stageStatusReason", "stageStatusUpdatedAt", "membersAccepted", "membersPending", "groupsCount", "groupsPending"]) {
      delete definition[key];
    }
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
      mode: "Tournament",
      startAtIso: stage.startAt,
      endAtIso: stage.endAt,
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
        title: "QA TOURNAMENT-DQ-001",
        subtitle: "Four-person DQ and Reinstate checkpoint",
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
        topics: ["Manual QA", "Tournament"]
      },
      {
        ...common,
        _id: ROOM_ID,
        sourceId: ROOM_ID,
        syncKey: `scheduler:${ROOM_ID}`,
        title: "Tournament Group A",
        subtitle: "Tournament group for QA TOURNAMENT-DQ-001.",
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

  function chat(chatId, title, userId, stagedAtIso) {
    return {
      _id: `${PREFIX}:chat:${chatId === EVENT_ID ? "parent" : "room"}:${userId}`,
      id: chatId,
      ownerUserId: userId,
      title,
      avatar: chatId === ROOM_ID ? "/media/public?key=images/system/tournament-room/v1/large.webp" : "",
      lastMessage: "",
      lastSenderId: null,
      memberIds: sorted(ALL_USERS),
      unread: 0,
      dateIso: stagedAtIso,
      channelType: "mainEvent",
      ownerId: chatId,
      eventId: chatId,
      ownerStatus: "A",
      revision: 1,
      subEventId: null,
      groupId: null
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

  function scores() {
    return Q.collection("eventLeaderboardEntries").find({ eventId: EVENT_ID }).sort({ memberId: 1 }).toArray().map(entry => ({
      memberId: Q.text(entry.memberId),
      scoreValue: Q.number(entry.scoreValue),
      groupId: Q.text(entry.groupId)
    }));
  }

  function storedStatus(ownerId, userId) {
    const record = Q.collection("activityMembers").findOne({ ownerType: "event", ownerId, userId });
    return Q.text(record && record.status).toLowerCase();
  }

  function chatSnapshot(chatId) {
    return {
      copies: Q.collection("chats").find({ $or: [{ id: chatId }, { ownerId: chatId }, { eventId: chatId }] })
        .toArray().map(item => ({
          ownerUserId: Q.text(item.ownerUserId),
          memberIds: sorted(item.memberIds),
          unread: Q.number(item.unread),
          lastMessage: Q.text(item.lastMessage)
        })).sort((left, right) => left.ownerUserId.localeCompare(right.ownerUserId)),
      messages: Q.collection("chatMessages").find({ chatId }).sort({ sentAtIso: 1, id: 1 }).toArray().map(item => ({
        clientId: Q.text(item.clientId),
        text: Q.text(item.text)
      }))
    };
  }

  function notificationSnapshot() {
    const map = item => ({
      action: Q.text(item.payload && item.payload.membershipAction),
      role: Q.text(item.payload && item.payload.recipientRole),
      recipients: sorted(item.recipientUserIds || [item.recipientUserId]),
      recipientUserId: Q.text(item.recipientUserId),
      memberName: Q.text(item.payload && item.payload.memberName),
      body: Q.text(item.body || item.message)
    });
    return {
      outbox: Q.collection("notificationOutbox").find({ "payload.parentEventId": EVENT_ID }).toArray()
        .map(map).sort((left, right) => `${left.action}:${left.role}`.localeCompare(`${right.action}:${right.role}`)),
      inbox: Q.collection("userNotifications").find({ "payload.parentEventId": EVENT_ID }).toArray()
        .map(map).sort((left, right) => `${left.action}:${left.recipientUserId}`.localeCompare(`${right.action}:${right.recipientUserId}`))
    };
  }

  function impressionEvidenceSnapshot() {
    const riley = Q.ensureUser(RILEY_ID, `${CHECKPOINT} Riley impression evidence user`);
    const eventFeedback = (riley.activities && riley.activities.eventFeedback) || {};
    return {
      rileyStoredImpressions: riley.impressions || null,
      rileyEventFeedback: {
        ownEvents: Q.number(eventFeedback.ownEvents),
        pending: Q.number(eventFeedback.pending),
        feedbacked: Q.number(eventFeedback.feedbacked),
        removed: Q.number(eventFeedback.removed)
      },
      fixtureFeedbackStates: Q.collection("eventFeedbackStates").countDocuments({ eventId: EVENT_ID }),
      fixtureFeedbackAnswers: Q.collection("eventFeedbackAnswers").countDocuments({ eventId: EVENT_ID }),
      fixtureAffinityTasks: Q.collection("affinityRecomputeTasks").countDocuments(relatedSelector())
    };
  }

  function snapshot() {
    const parent = Q.collection("events").findOne({ sourceId: EVENT_ID }) || {};
    const room = Q.collection("events").findOne({ sourceId: ROOM_ID }) || {};
    return {
      parentAcceptedUserIds: sorted(parent.acceptedMemberUserIds),
      roomAcceptedUserIds: sorted(room.acceptedMemberUserIds),
      parentNovaStatus: storedStatus(EVENT_ID, NOVA_ID),
      roomNovaStatus: storedStatus(ROOM_ID, NOVA_ID),
      parentNovaRows: Q.collection("activityMembers").countDocuments({ ownerType: "event", ownerId: EVENT_ID, userId: NOVA_ID }),
      roomNovaRows: Q.collection("activityMembers").countDocuments({ ownerType: "event", ownerId: ROOM_ID, userId: NOVA_ID }),
      scores: scores(),
      parentChat: chatSnapshot(EVENT_ID),
      groupChat: chatSnapshot(ROOM_ID),
      counters: ALL_USERS.map(counter),
      impressionEvidence: impressionEvidenceSnapshot(),
      notifications: notificationSnapshot()
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
    Q.collection("events").insertMany(eventDocuments(stagedAtIso));
    Q.collection("activityMembers").insertMany([
      ...ALL_USERS.map(userId => member(EVENT_ID, userId, userId === CASEY_ID ? "Admin" : "Member", stagedAtIso)),
      ...ALL_USERS.map(userId => member(ROOM_ID, userId, "Member", stagedAtIso))
    ]);
    Q.collection("activitySubEventStageRuntime").insertOne({
      _id: `${PREFIX}:runtime`, syncKey: `${PREFIX}:runtime`, recordId: `${EVENT_ID}:${STAGE_ID}`,
      status: "A", ownerId: EVENT_ID, subEventId: STAGE_ID, stageStatus: "A",
      stageStatusReason: "stage-started", stageStatusUpdatedAt: stagedAtIso, groupsCount: 1,
      groupResourceMetricsByAssetOwnerId: {}, createdDate: stagedAtIso, createdUser: Q.ACTOR,
      updatedDate: stagedAtIso, updatedUser: Q.ACTOR
    });
    Q.collection("eventLeaderboardEntries").insertMany(ALL_USERS.map(userId => ({
      _id: `${PREFIX}:score:${userId}`, syncKey: `${PREFIX}:score:${userId}`,
      eventId: EVENT_ID, subEventId: STAGE_ID, groupId: GROUP_ID, entryType: "score",
      memberId: userId, scoreValue: SCORE_BY_USER_ID[userId], note: `${CHECKPOINT} controlled score`,
      createdAtIso: stagedAtIso, createdUser: CASEY_ID, updatedDate: stagedAtIso, updatedUser: CASEY_ID
    })));
    Q.collection("chats").insertMany([
      ...ALL_USERS.map(userId => chat(EVENT_ID, "QA TOURNAMENT-DQ-001", userId, stagedAtIso)),
      ...ALL_USERS.map(userId => chat(ROOM_ID, "Tournament Group A", userId, stagedAtIso))
    ]);
    applyCounterDelta(CASEY_ID, 1, true);
    [NOVA_ID, RILEY_ID, LINA_ID].forEach(userId => applyCounterDelta(userId, 1));
    const baselineCounters = ALL_USERS.map(counter);
    const baselineImpressionEvidence = impressionEvidenceSnapshot();
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: STATE_ID, scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "baseline-ready",
      stagedAtIso, snapshots, savedUserActivities, baselineCounters, baselineImpressionEvidence
    });
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "baseline-ready",
      eventId: EVENT_ID, roomId: ROOM_ID, groupId: GROUP_ID,
      scores: scores(),
      next: "Open the three managed sessions. Casey disqualifies Nova once from the parent Members popup, inspects Group A, then pauses before Reinstate so the DQ oracle can be captured."
    });
  }

  function status() {
    Q.assertDeploymentSafety();
    const currentState = state(false);
    if (!currentState) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "not-staged" });
      return;
    }
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: currentState.phase, oracle: snapshot() });
  }

  function exactCopies(channel) {
    return channel.copies.length === ALL_USERS.length
      && Q.sameJson(sorted(channel.copies.map(copy => copy.ownerUserId)), sorted(ALL_USERS))
      && channel.copies.every(copy => Q.sameJson(copy.memberIds, sorted(ALL_USERS)));
  }

  function exactScores(currentScores) {
    const expected = ALL_USERS.map(userId => ({ memberId: userId, scoreValue: SCORE_BY_USER_ID[userId], groupId: GROUP_ID }))
      .sort((left, right) => left.memberId.localeCompare(right.memberId));
    return Q.sameJson(currentScores, expected);
  }

  function countersMatch(left, right) {
    const leftByUser = new Map((left || []).map(item => [Q.text(item.userId), item]));
    return (right || []).every(item => {
      const prior = leftByUser.get(Q.text(item.userId));
      return prior
        && Q.number(prior.events) === item.events
        && Q.number(prior.hosting) === item.hosting
        && Q.number(prior.eventAll) === item.eventAll
        && Q.number(prior.eventActive) === item.eventActive
        && Q.number(prior.eventHosting) === item.eventHosting;
    });
  }

  function impressionEvidenceUnchanged(currentState, current) {
    if (currentState.baselineImpressionEvidence) {
      return Q.sameJson(currentState.baselineImpressionEvidence, current.impressionEvidence);
    }
    const evidence = current.impressionEvidence;
    return evidence.rileyStoredImpressions === null
      && Q.sameJson(evidence.rileyEventFeedback, { ownEvents: 0, pending: 0, feedbacked: 0, removed: 0 })
      && evidence.fixtureFeedbackStates === 0
      && evidence.fixtureFeedbackAnswers === 0
      && evidence.fixtureAffinityTasks === 0;
  }

  function exactActionNotifications(notifications, action, occurrenceCount) {
    const actionText = action === "disqualified" ? "disqualified from" : "reinstated to";
    const outbox = notifications.outbox.filter(item => item.action === action);
    const inbox = notifications.inbox.filter(item => item.action === action);
    const affected = outbox.filter(item => item.role === "affected-member");
    const participants = outbox.filter(item => item.role === "event-participant");
    return occurrenceCount > 0
      && outbox.length === occurrenceCount * 2
      && affected.length === occurrenceCount
      && affected.every(item => Q.sameJson(item.recipients, [NOVA_ID]))
      && participants.length === occurrenceCount
      && participants.every(item => Q.sameJson(item.recipients, sorted([RILEY_ID, LINA_ID])))
      && inbox.length === occurrenceCount * 3
      && [NOVA_ID, RILEY_ID, LINA_ID].every(userId =>
        inbox.filter(item => item.recipientUserId === userId).length === occurrenceCount)
      && inbox.every(item => item.memberName === "Nova Social")
      && inbox.filter(item => item.recipientUserId === NOVA_ID)
        .every(item => item.body === `You were ${actionText} QA TOURNAMENT-DQ-001.`)
      && inbox.filter(item => item.recipientUserId !== NOVA_ID)
        .every(item => item.body === `Nova Social was ${actionText} QA TOURNAMENT-DQ-001.`);
  }

  function exactMessageCycles(parentMessages, groupMessages) {
    if (parentMessages.length < 2 || parentMessages.length % 2 !== 0 || groupMessages.length !== parentMessages.length) {
      return 0;
    }
    for (let index = 0; index < parentMessages.length; index += 2) {
      const expectedParent = [
        { clientId: "member-disqualify", text: "Nova Social was disqualified from the event." },
        { clientId: "member-reinstate", text: "Nova Social was reinstated to the event." }
      ];
      const expectedGroup = [
        { clientId: "member-disqualify", text: "Nova Social was disqualified from the tournament group." },
        { clientId: "member-reinstate", text: "Nova Social was reinstated to the tournament group." }
      ];
      if (!Q.sameJson(parentMessages.slice(index, index + 2), expectedParent)
          || !Q.sameJson(groupMessages.slice(index, index + 2), expectedGroup)) {
        return 0;
      }
    }
    return parentMessages.length / 2;
  }

  function verifyDq() {
    Q.assertDeploymentSafety();
    const currentState = state();
    const current = snapshot();
    const activeIds = [CASEY_ID, RILEY_ID, LINA_ID].sort();
    const checks = {
      parentStatus: current.parentNovaStatus === "disqualified" && Q.sameJson(current.parentAcceptedUserIds, activeIds),
      roomStatus: current.roomNovaStatus === "disqualified" && Q.sameJson(current.roomAcceptedUserIds, activeIds),
      noDuplicateRows: current.parentNovaRows === 1 && current.roomNovaRows === 1,
      immutableScores: exactScores(current.scores),
      retainedChats: exactCopies(current.parentChat) && exactCopies(current.groupChat),
      parentMessage: Q.sameJson(current.parentChat.messages, [{
        clientId: "member-disqualify", text: "Nova Social was disqualified from the event."
      }]),
      groupMessage: Q.sameJson(current.groupChat.messages, [{
        clientId: "member-disqualify", text: "Nova Social was disqualified from the tournament group."
      }]),
      noImpressionEvidenceMutation: impressionEvidenceUnchanged(currentState, current),
      exactNotifications: exactActionNotifications(current.notifications, "disqualified", 1)
        && current.notifications.outbox.length === 2
        && current.notifications.inbox.length === 3
    };
    const failed = Object.entries(checks).filter(([, value]) => !value).map(([key]) => key);
    if (failed.length > 0) Q.fail(`${CHECKPOINT} DQ checks failed: ${failed.join(", ")}.`);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: { phase: "dq-verified", dqVerifiedAtIso: Q.nowIso() } });
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "dq-verified", oracle: current,
      next: "Casey now uses Reinstate on Nova from the same parent Members popup. Then verify active score order Nova 10, Riley 9, Lina 5, Casey 1 and both Reinstate chat messages."
    });
  }

  function verifyReinstate() {
    Q.assertDeploymentSafety();
    const currentState = state();
    const current = snapshot();
    const completedCycles = exactMessageCycles(current.parentChat.messages, current.groupChat.messages);
    const checks = {
      parentRestored: current.parentNovaStatus === "accepted" && Q.sameJson(current.parentAcceptedUserIds, sorted(ALL_USERS)),
      roomRestored: current.roomNovaStatus === "accepted" && Q.sameJson(current.roomAcceptedUserIds, sorted(ALL_USERS)),
      noDuplicateRows: current.parentNovaRows === 1 && current.roomNovaRows === 1,
      immutableScores: exactScores(current.scores),
      retainedChats: exactCopies(current.parentChat) && exactCopies(current.groupChat),
      completeAtomicCycles: completedCycles > 0,
      countersRestored: countersMatch(currentState.baselineCounters, current.counters),
      noImpressionEvidenceMutation: impressionEvidenceUnchanged(currentState, current),
      exactNotifications: exactActionNotifications(current.notifications, "disqualified", completedCycles)
        && exactActionNotifications(current.notifications, "reinstated", completedCycles)
        && current.notifications.outbox.length === completedCycles * 4
        && current.notifications.inbox.length === completedCycles * 6
    };
    const failed = Object.entries(checks).filter(([, value]) => !value).map(([key]) => key);
    if (failed.length > 0) Q.fail(`${CHECKPOINT} Reinstate checks failed: ${failed.join(", ")}.`);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "reinstate-verified", reinstateVerifiedAtIso: Q.nowIso(), completedCycles
    } });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "reinstate-verified", completedCycles, oracle: current });
  }

  function reset() {
    Q.assertDeploymentSafety();
    const currentState = state();
    Q.restoreSnapshots(currentState.snapshots || []);
    Q.collection("chatMessages").deleteMany({ chatId: { $in: [EVENT_ID, ROOM_ID] } });
    for (const saved of currentState.savedUserActivities || []) restoreUserActivities(saved);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: STATE_ID });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "reset-complete", resetAtIso: Q.nowIso() });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stageFixture(); break;
    case "status": status(); break;
    case "verify-tournament-dq": verifyDq(); break;
    case "verify-tournament-reinstate": verifyReinstate(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
