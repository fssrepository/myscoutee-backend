/* global ManualQa, db, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "event-domain-tournament-admission";
  const CHECKPOINT = "TOURNAMENT-ADMISSION-001";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const PREFIX = "manual-qa-checkpoint:v1:tournament-admission";
  const STATE_ID = `${PREFIX}:state`;
  const EVENT_ID = `${PREFIX}:event`;
  const QUALIFIER_ID = "qualifiers";
  const GROUP_ID = `${QUALIFIER_ID}:group:1`;
  const HOST_ID = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID) || "650000000000000000000061";
  const ACCEPTED_ID = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID) || "650000000000000000000062";
  const CANDIDATE_ID = "650000000000000000000063";

  function dateIso(minutesFromNow) {
    return new Date(Date.now() + minutesFromNow * 60 * 1000).toISOString();
  }

  function activitySnapshot(userId) {
    const user = Q.ensureUser(userId, "tournament-admission user");
    const activities = user.activities || {};
    const event = activities.event || {};
    return {
      userId,
      events: Q.number(activities.events),
      invitations: Q.number(activities.invitations),
      notifications: Q.number(activities.notifications),
      hosting: Q.number(activities.hosting),
      event: {
        all: Q.number(event.all),
        active: Q.number(event.active),
        pending: Q.number(event.pending),
        invitations: Q.number(event.invitations),
        hosting: Q.number(event.hosting),
        drafts: Q.number(event.drafts),
        trash: Q.number(event.trash)
      }
    };
  }

  function selectors() {
    const relatedEvent = {
      $or: [
        { sourceId: EVENT_ID }, { eventId: EVENT_ID }, { ownerId: EVENT_ID },
        { entityId: EVENT_ID }, { targetId: EVENT_ID }, { "payload.eventId": EVENT_ID },
        { ownerId: { $regex: `^${QUALIFIER_ID}:group:` } }
      ]
    };
    return [
      { collection: "events", selector: { $or: [{ sourceId: EVENT_ID }, { parentEventId: EVENT_ID }] } },
      { collection: "activityMembers", selector: relatedEvent },
      { collection: "activitySubEventStageRuntime", selector: { ownerId: EVENT_ID } },
      { collection: "eventLeaderboardEntries", selector: { eventId: EVENT_ID } },
      { collection: "chats", selector: relatedEvent },
      { collection: "chatMessages", selector: { chatId: { $regex: `^${EVENT_ID}` } } },
      { collection: "eventCheckoutBasketItems", selector: { sourceId: EVENT_ID } },
      { collection: "payments", selector: { $or: [{ sourceId: EVENT_ID }, { eventId: EVENT_ID }] } },
      { collection: "eventTickets", selector: { eventId: EVENT_ID } },
      { collection: "notificationOutbox", selector: relatedEvent },
      { collection: "userNotifications", selector: relatedEvent },
      { collection: "affinityRecomputeTasks", selector: relatedEvent },
      { collection: "scheduledMessageTasks", selector: relatedEvent }
    ];
  }

  function member(id, ownerType, ownerId, userId, role, status, stagedAtIso, options = {}) {
    return {
      _id: `${PREFIX}:member:${id}`,
      syncKey: `${PREFIX}:member:${ownerId}:${userId}`,
      ownerType,
      ownerId,
      userId,
      role,
      status,
      pendingSource: status === "pending" ? (options.pendingSource || "member") : null,
      requestKind: status === "pending" ? (options.requestKind || "approval") : null,
      invitedByUserId: status === "pending" && options.pendingSource === "admin" ? HOST_ID : null,
      actionAtIso: stagedAtIso,
      createdDate: stagedAtIso,
      createdUser: Q.ACTOR,
      updatedDate: stagedAtIso,
      updatedUser: Q.ACTOR
    };
  }

  function rootEvent(stagedAtIso) {
    const qualifierStart = dateIso(-10);
    const qualifierEnd = dateIso(720);
    const qualifier = {
      id: QUALIFIER_ID,
      name: "Qualifiers",
      description: "Admission is frozen after this stage starts",
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: 730,
      startAt: qualifierStart,
      endAt: qualifierEnd,
      optional: false,
      capacityMin: 1,
      capacityMax: 8,
      tournamentGroupCapacityMin: 1,
      tournamentGroupCapacityMax: 8,
      tournamentLeaderboardType: "Score",
      tournamentAdvancePerGroup: 1,
      stageStatus: "A",
      stageStatusReason: "stage-started",
      stageStatusUpdatedAt: stagedAtIso,
      membersAccepted: 2,
      membersPending: 0,
      groupsCount: 1,
      groupsPending: 0
    };
    return {
      _id: EVENT_ID,
      sourceId: EVENT_ID,
      syncKey: EVENT_ID,
      ownerUserId: HOST_ID,
      creatorUserId: HOST_ID,
      organizerUserId: HOST_ID,
      admins: [HOST_ID],
      status: "A",
      published: true,
      title: "QA TOURNAMENT-ADMISSION-001",
      subtitle: "First-stage admission lock QA checkpoint",
      creatorName: "Casey Bridge",
      creatorInitials: "CB",
      creatorCity: "Austin",
      visibility: "Invitation only",
      blindMode: "Open Event",
      startAtIso: qualifierStart,
      endAtIso: qualifierEnd,
      capacityMin: 1,
      capacityMax: 8,
      capacityTotal: 8,
      full: false,
      autoInviter: false,
      ticketing: false,
      approvalRequired: false,
      policiesEnabled: false,
      slotsEnabled: false,
      acceptedMembers: 2,
      pendingMembers: 0,
      acceptedMemberUserIds: [HOST_ID, ACCEPTED_ID],
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [],
      topics: ["#Tournament", "#Admission"],
      subEventsEnabled: true,
      subEventDefinitions: [qualifier],
      subEvents: [qualifier],
      currentStage: { id: QUALIFIER_ID, name: "Qualifiers", stageNumber: 1, totalStages: 1, status: "A" },
      mode: "Tournament",
      eventType: "event",
      createdDate: stagedAtIso,
      createdUser: Q.ACTOR,
      updatedDate: stagedAtIso,
      updatedUser: Q.ACTOR
    };
  }

  function canonicalDocuments(collection, selector) {
    return Q.collection(collection).find(selector).sort({ _id: 1 }).toArray();
  }

  function oracle() {
    const managed = {};
    for (const spec of selectors()) {
      managed[spec.collection] = canonicalDocuments(spec.collection, spec.selector);
    }
    managed.userActivities = [HOST_ID, ACCEPTED_ID, CANDIDATE_ID].map(activitySnapshot);
    return managed;
  }

  function conciseOracle(snapshot) {
    const event = (snapshot.events || [])[0] || null;
    return {
      branch: Q.text((state(false) || {}).branch),
      event: event ? {
        sourceId: Q.text(event.sourceId),
        acceptedMemberUserIds: event.acceptedMemberUserIds || [],
        pendingMemberUserIds: event.pendingMemberUserIds || [],
        invitedMemberUserIds: event.invitedMemberUserIds || [],
        pendingRequestMemberUserIds: event.pendingRequestMemberUserIds || [],
        visibility: Q.text(event.visibility),
        currentStage: event.currentStage || null
      } : null,
      memberRows: (snapshot.activityMembers || []).map(value => ({
        ownerType: Q.text(value.ownerType), ownerId: Q.text(value.ownerId),
        userId: Q.text(value.userId), status: Q.text(value.status),
        pendingSource: Q.text(value.pendingSource), requestKind: Q.text(value.requestKind)
      })),
      counts: Object.fromEntries(Object.entries(snapshot)
        .filter(([key]) => key !== "userActivities")
        .map(([key, values]) => [key, values.length]))
    };
  }

  function state(required = true) {
    const value = Q.collection(Q.STATE_COLLECTION).findOne({ _id: STATE_ID });
    if (!value && required) Q.fail(`${CHECKPOINT} is not staged.`);
    return value;
  }

  function assertUnchanged(saved, current, label) {
    if (!sameOracle(saved, current)) {
      Q.fail(`${CHECKPOINT} ${label} changed persisted membership/capacity/chat/leaderboard/counter/checkout state.`);
    }
  }

  function sameCounters(left, right) {
    return JSON.stringify(left || []) === JSON.stringify(right || []);
  }

  function sameOracle(left, right) {
    const leftDomain = { ...(left || {}) };
    const rightDomain = { ...(right || {}) };
    delete leftDomain.userActivities;
    delete rightDomain.userActivities;
    return Q.sameJson(leftDomain, rightDomain)
      && sameCounters(left && left.userActivities, right && right.userActivities);
  }

  function stage() {
    Q.assertDeploymentSafety();
    if (checkpointId !== CHECKPOINT) Q.fail(`stage is restricted to ${CHECKPOINT}.`);
    if (state(false)) Q.fail(`${CHECKPOINT} is already staged; use status or reset.`);
    const retained = Q.activeState("event-domain", false);
    if (retained && Q.text(retained.checkpointId).toUpperCase() !== "TOURNAMENT-004") {
      Q.fail(`unclosed event-domain checkpoint '${Q.text(retained.checkpointId)}' is active.`);
    }
    const other = Q.collection(Q.STATE_COLLECTION).findOne({
      _id: { $nin: [Q.stateId("event-domain"), STATE_ID] }
    });
    if (other) Q.fail(`another manual scenario '${Q.text(other.scenario)}' is staged.`);
    [HOST_ID, ACCEPTED_ID, CANDIDATE_ID].forEach((userId, index) =>
      Q.ensureUser(userId, ["Casey", "Nova", "Riley"][index]));
    for (const spec of selectors()) {
      if (Q.collection(spec.collection).countDocuments(spec.selector) !== 0) {
        Q.fail(`stale ${CHECKPOINT} data exists in '${spec.collection}'; do not overwrite it.`);
      }
    }
    const stagedAtIso = Q.nowIso();
    const snapshots = Q.snapshotSpecs(selectors());
    Q.collection("events").insertOne(rootEvent(stagedAtIso));
    Q.collection("activityMembers").insertMany([
      member("parent-casey", "event", EVENT_ID, HOST_ID, "Admin", "accepted", stagedAtIso),
      member("parent-nova", "event", EVENT_ID, ACCEPTED_ID, "Member", "accepted", stagedAtIso),
      member("group-casey", "group", GROUP_ID, HOST_ID, "Member", "accepted", stagedAtIso),
      member("group-nova", "group", GROUP_ID, ACCEPTED_ID, "Member", "accepted", stagedAtIso)
    ]);
    Q.collection("activitySubEventStageRuntime").insertOne({
      _id: `${PREFIX}:runtime:${QUALIFIER_ID}`,
      syncKey: `${PREFIX}:runtime:${QUALIFIER_ID}`,
      recordId: `${EVENT_ID}:${QUALIFIER_ID}`,
      ownerId: EVENT_ID,
      subEventId: QUALIFIER_ID,
      status: "A",
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
    Q.collection("eventLeaderboardEntries").insertMany([
      ["casey", HOST_ID, 9], ["nova", ACCEPTED_ID, 5]
    ].map(([key, memberId, scoreValue]) => ({
      _id: `${PREFIX}:score:${key}`,
      syncKey: `${PREFIX}:score:${key}`,
      eventId: EVENT_ID,
      subEventId: QUALIFIER_ID,
      groupId: GROUP_ID,
      entryType: "score",
      memberId,
      scoreValue,
      note: `${CHECKPOINT} unchanged baseline`,
      createdAtIso: stagedAtIso,
      createdUser: HOST_ID,
      updatedDate: stagedAtIso,
      updatedUser: HOST_ID
    })));
    const rootProjectionBase = materializeRootProjection();
    const baseline = oracle();
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: STATE_ID,
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      branch: "join",
      stagedAtIso,
      snapshots,
      baseline,
      rootProjectionBase,
      verifiedBranches: []
    });
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "join-baseline",
      stagedAtIso, oracle: conciseOracle(baseline),
      next: "Riley opens Explore after Qualifiers already started; this tournament must not be listed."
    });
  }

  function restoreJoinBranch(currentState) {
    const event = rootEvent(currentState.stagedAtIso);
    Q.collection("events").replaceOne({ sourceId: EVENT_ID }, event);
    Q.collection("activityMembers").deleteMany({ ownerType: "event", ownerId: EVENT_ID, userId: CANDIDATE_ID });
    Q.collection("notificationOutbox").deleteMany({ _id: `${PREFIX}:outbox:invite-riley` });
    Q.collection("userNotifications").deleteMany({ _id: `${PREFIX}:notification:invite-riley` });
    Q.collection("notificationOutbox").deleteMany({ _id: `${PREFIX}:outbox:approval-riley` });
    Q.collection("userNotifications").deleteMany({ _id: `${PREFIX}:notification:approval-riley` });
    restoreProjectionCounters(currentState);
  }

  function restoreUserProjection(snapshot) {
    if (!snapshot || !snapshot.userId) return;
    Q.collection("users").updateOne({
      $or: [{ _id: snapshot.userId }, { userId: snapshot.userId }]
    }, { $set: {
      "activities.invitations": Q.number(snapshot.invitations),
      "activities.notifications": Q.number(snapshot.notifications),
      "activities.event.all": Q.number(snapshot.event && snapshot.event.all),
      "activities.event.pending": Q.number(snapshot.event && snapshot.event.pending),
      "activities.event.invitations": Q.number(snapshot.event && snapshot.event.invitations)
    } });
  }

  function restoreProjectionCounters(currentState) {
    restoreUserProjection(currentState && currentState.invitationProjectionBase);
    const approvalBase = currentState && currentState.approvalProjectionBase;
    restoreUserProjection(approvalBase && approvalBase.host);
    restoreUserProjection(approvalBase && approvalBase.candidate);
  }

  function restoreRootProjectionCounters(currentState) {
    const rootBase = currentState && currentState.rootProjectionBase;
    if (rootBase && rootBase.host) {
      Q.collection("users").updateOne({
        $or: [{ _id: HOST_ID }, { userId: HOST_ID }]
      }, { $set: {
        "activities.hosting": Q.number(rootBase.host.hosting),
        "activities.event.all": Q.number(rootBase.host.event && rootBase.host.event.all),
        "activities.event.hosting": Q.number(rootBase.host.event && rootBase.host.event.hosting)
      } });
    }
    if (rootBase && rootBase.accepted) {
      Q.collection("users").updateOne({
        $or: [{ _id: ACCEPTED_ID }, { userId: ACCEPTED_ID }]
      }, { $set: {
        "activities.events": Q.number(rootBase.accepted.events),
        "activities.event.all": Q.number(rootBase.accepted.event && rootBase.accepted.event.all),
        "activities.event.active": Q.number(rootBase.accepted.event && rootBase.accepted.event.active)
      } });
    }
  }

  function materializeRootProjection() {
    const rootBase = {
      host: activitySnapshot(HOST_ID),
      accepted: activitySnapshot(ACCEPTED_ID)
    };
    Q.collection("users").updateOne({
      $or: [{ _id: HOST_ID }, { userId: HOST_ID }]
    }, { $inc: {
      "activities.hosting": 1,
      "activities.event.all": 1,
      "activities.event.hosting": 1
    } });
    Q.collection("users").updateOne({
      $or: [{ _id: ACCEPTED_ID }, { userId: ACCEPTED_ID }]
    }, { $inc: {
      "activities.events": 1,
      "activities.event.all": 1,
      "activities.event.active": 1
    } });
    return rootBase;
  }

  function inviteOutbox(preparedAtIso) {
    const occurrenceId = `${PREFIX}:invitation-occurrence:riley`;
    return {
      _id: `${PREFIX}:outbox:invite-riley`,
      syncKey: `${PREFIX}:outbox:invite-riley`,
      notificationType: "event-invite",
      entityType: "event",
      entityId: EVENT_ID,
      recipientScope: "invitees",
      recipientUserIds: [CANDIDATE_ID],
      deliveryStrategy: "direct",
      title: "QA TOURNAMENT-ADMISSION-001",
      body: "You were invited to QA TOURNAMENT-ADMISSION-001.",
      clickUrl: "/game",
      iconUrl: "/assets/logo/heart.webp",
      badgeUrl: "/assets/logo/heart.webp",
      tag: `event-invite-${EVENT_ID}`,
      payload: {
        eventId: EVENT_ID,
        eventTitle: "QA TOURNAMENT-ADMISSION-001",
        location: "",
        startAtIso: Q.text((Q.collection("events").findOne({ sourceId: EVENT_ID }) || {}).startAtIso),
        eventScope: "invitations",
        invitationOccurrenceId: occurrenceId,
        senderUserId: HOST_ID,
        timestampMillis: String(new Date(preparedAtIso).getTime())
      },
      status: "sent",
      pendingCounterTracked: false,
      retryCount: 0,
      sentDate: preparedAtIso,
      createdDate: preparedAtIso,
      createdUser: HOST_ID,
      updatedDate: preparedAtIso,
      updatedUser: HOST_ID
    };
  }

  function inviteNotification(preparedAtIso) {
    return {
      _id: `${PREFIX}:notification:invite-riley`,
      syncKey: `${PREFIX}:outbox:invite-riley:${CANDIDATE_ID}`,
      outboxId: `${PREFIX}:outbox:invite-riley`,
      recipientUserId: CANDIDATE_ID,
      kind: "event-invite",
      category: "event",
      title: "QA TOURNAMENT-ADMISSION-001",
      message: "You were invited to QA TOURNAMENT-ADMISSION-001.",
      senderUserId: HOST_ID,
      actionPath: "/game",
      sourceType: "event",
      sourceId: EVENT_ID,
      payload: inviteOutbox(preparedAtIso).payload,
      occurrenceCount: 1,
      revision: NumberLong("1"),
      readAtIso: null,
      createdDate: preparedAtIso,
      createdUser: HOST_ID,
      updatedDate: preparedAtIso,
      updatedUser: HOST_ID
    };
  }

  function approvalOutbox(preparedAtIso) {
    const occurrenceId = `${PREFIX}:join-request-occurrence:riley`;
    return {
      _id: `${PREFIX}:outbox:approval-riley`,
      syncKey: `${PREFIX}:outbox:approval-riley`,
      notificationType: "event-admin-join-request",
      entityType: "event",
      entityId: EVENT_ID,
      recipientScope: "event-admins",
      recipientUserIds: [HOST_ID],
      deliveryStrategy: "direct",
      title: "QA TOURNAMENT-ADMISSION-001",
      body: "Join request received.",
      clickUrl: "/game",
      iconUrl: "/assets/logo/heart.webp",
      badgeUrl: "/assets/logo/heart.webp",
      tag: `event-admin-join-request-${EVENT_ID}-${CANDIDATE_ID}`,
      payload: {
        eventId: EVENT_ID,
        eventTitle: "QA TOURNAMENT-ADMISSION-001",
        eventScope: "members",
        memberUserId: CANDIDATE_ID,
        memberName: "Riley Outside",
        membershipAction: "requested",
        senderUserId: CANDIDATE_ID,
        notification_tone: "accent",
        notification_message_key: "notification.event.join.requested.message",
        notification_status_badge_key: "notification.event.join.pending.badge",
        notification_status_badge_fallback: "Pending",
        notification_status_badge_tone: "accent",
        joinRequestOccurrenceId: occurrenceId,
        requestedAtIso: preparedAtIso
      },
      status: "sent",
      pendingCounterTracked: false,
      retryCount: 0,
      sentDate: preparedAtIso,
      createdDate: preparedAtIso,
      createdUser: CANDIDATE_ID,
      updatedDate: preparedAtIso,
      updatedUser: CANDIDATE_ID
    };
  }

  function approvalNotification(preparedAtIso) {
    return {
      _id: `${PREFIX}:notification:approval-riley`,
      syncKey: `${PREFIX}:outbox:approval-riley:${HOST_ID}`,
      outboxId: `${PREFIX}:outbox:approval-riley`,
      recipientUserId: HOST_ID,
      kind: "event-admin-join-request",
      category: "event-admin",
      title: "QA TOURNAMENT-ADMISSION-001",
      message: "Join request received.",
      senderUserId: CANDIDATE_ID,
      actionPath: "/game",
      sourceType: "event",
      sourceId: EVENT_ID,
      payload: approvalOutbox(preparedAtIso).payload,
      occurrenceCount: 1,
      revision: NumberLong("1"),
      readAtIso: null,
      createdDate: preparedAtIso,
      createdUser: CANDIDATE_ID,
      updatedDate: preparedAtIso,
      updatedUser: CANDIDATE_ID
    };
  }

  function materializeInvitationProjection(preparedAtIso) {
    const candidateBase = activitySnapshot(CANDIDATE_ID);
    Q.collection("users").updateOne({
      $or: [{ _id: CANDIDATE_ID }, { userId: CANDIDATE_ID }]
    }, { $inc: {
      "activities.invitations": 1,
      "activities.notifications": 1,
      "activities.event.all": 1,
      "activities.event.invitations": 1
    } });
    Q.collection("notificationOutbox").insertOne(inviteOutbox(preparedAtIso));
    Q.collection("userNotifications").insertOne(inviteNotification(preparedAtIso));
    return candidateBase;
  }

  function materializeApprovalProjection(preparedAtIso) {
    const hostBase = activitySnapshot(HOST_ID);
    const candidateBase = activitySnapshot(CANDIDATE_ID);
    Q.collection("users").updateOne({
      $or: [{ _id: CANDIDATE_ID }, { userId: CANDIDATE_ID }]
    }, { $inc: {
      "activities.event.all": 1,
      "activities.event.pending": 1
    } });
    Q.collection("users").updateOne({
      $or: [{ _id: HOST_ID }, { userId: HOST_ID }]
    }, { $inc: { "activities.notifications": 1 } });
    Q.collection("notificationOutbox").insertOne(approvalOutbox(preparedAtIso));
    Q.collection("userNotifications").insertOne(approvalNotification(preparedAtIso));
    return { host: hostBase, candidate: candidateBase };
  }

  function assertLegacyActivityBaseline(savedActivities, currentActivities) {
    const currentByUserId = new Map((currentActivities || []).map(value => [value.userId, value]));
    for (const saved of savedActivities || []) {
      const current = currentByUserId.get(saved.userId);
      if (!current) Q.fail(`${CHECKPOINT} user activity projection disappeared for ${saved.userId}.`);
      const savedEvent = saved.event || {};
      const currentEvent = current.event || {};
      if (Q.number(saved.events) !== Q.number(current.events)
          || Q.number(saved.invitations) !== Q.number(current.invitations)
          || Q.number(saved.hosting) !== Q.number(current.hosting)
          || Q.number(savedEvent.all) !== Q.number(currentEvent.all)
          || Q.number(savedEvent.active) !== Q.number(currentEvent.active)
          || Q.number(savedEvent.pending) !== Q.number(currentEvent.pending)
          || Q.number(savedEvent.invitations) !== Q.number(currentEvent.invitations)
          || Q.number(savedEvent.hosting) !== Q.number(currentEvent.hosting)
          || Q.number(savedEvent.drafts) !== Q.number(currentEvent.drafts)
          || Q.number(savedEvent.trash) !== Q.number(currentEvent.trash)) {
        Q.fail(`${CHECKPOINT} stored activity counters changed before invitation projection repair.`);
      }
    }
  }

  function repairInvitationProjection() {
    Q.assertDeploymentSafety();
    const currentState = state();
    if (currentState.branch !== "invitation") {
      Q.fail(`${CHECKPOINT} invitation projection repair requires the staged invitation branch.`);
    }
    const current = oracle();
    const savedDomain = { ...currentState.baseline };
    const currentDomain = { ...current };
    delete savedDomain.userActivities;
    delete currentDomain.userActivities;
    if (!Q.sameJson(savedDomain, currentDomain)) {
      Q.fail(`${CHECKPOINT} domain data changed; refusing invitation projection repair.`);
    }
    assertLegacyActivityBaseline(currentState.baseline.userActivities, current.userActivities);
    if (Q.collection("notificationOutbox").countDocuments({ _id: `${PREFIX}:outbox:invite-riley` }) !== 0
        || Q.collection("userNotifications").countDocuments({ _id: `${PREFIX}:notification:invite-riley` }) !== 0) {
      Q.fail(`${CHECKPOINT} invitation notification artifacts already exist; refusing duplicate repair.`);
    }
    const candidateBefore = activitySnapshot(CANDIDATE_ID);
    const repairedAtIso = Q.nowIso();
    const activityUpdate = Q.collection("users").updateOne({
      $or: [{ _id: CANDIDATE_ID }, { userId: CANDIDATE_ID }]
    }, { $inc: {
      "activities.invitations": 1,
      "activities.notifications": 1,
      "activities.event.all": 1,
      "activities.event.invitations": 1
    } });
    if (activityUpdate.matchedCount !== 1) {
      Q.fail(`${CHECKPOINT} Riley activity projection disappeared during invitation repair.`);
    }
    Q.collection("notificationOutbox").insertOne(inviteOutbox(repairedAtIso));
    Q.collection("userNotifications").insertOne(inviteNotification(repairedAtIso));
    const baseline = oracle();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      baseline,
      invitationProjectionBase: candidateBefore,
      invitationProjectionRepairedAtIso: repairedAtIso
    } });
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT,
      phase: "invitation-projection-repaired", repairedAtIso,
      oracle: conciseOracle(baseline),
      next: "Reload Riley once; Invitations and Notifications must each show one new item before Accept is attempted."
    });
  }

  function repairRootProjection() {
    Q.assertDeploymentSafety();
    const currentState = state();
    assertUnchanged(currentState.baseline, oracle(), `${currentState.branch} branch`);
    if (currentState.rootProjectionBase) {
      Q.fail(`${CHECKPOINT} root activity projection is already materialized.`);
    }
    const rootProjectionBase = {
      host: currentState.approvalProjectionBase && currentState.approvalProjectionBase.host
        ? currentState.approvalProjectionBase.host
        : activitySnapshot(HOST_ID),
      accepted: activitySnapshot(ACCEPTED_ID)
    };
    Q.collection("users").updateOne({
      $or: [{ _id: HOST_ID }, { userId: HOST_ID }]
    }, { $inc: {
      "activities.hosting": 1,
      "activities.event.all": 1,
      "activities.event.hosting": 1
    } });
    Q.collection("users").updateOne({
      $or: [{ _id: ACCEPTED_ID }, { userId: ACCEPTED_ID }]
    }, { $inc: {
      "activities.events": 1,
      "activities.event.all": 1,
      "activities.event.active": 1
    } });
    const repairedApprovalBase = currentState.approvalProjectionBase
      ? { ...currentState.approvalProjectionBase, host: {
          ...activitySnapshot(HOST_ID),
          notifications: Q.number(currentState.approvalProjectionBase.host.notifications)
        } }
      : null;
    const baseline = oracle();
    const repairedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      baseline,
      rootProjectionBase,
      rootProjectionRepairedAtIso: repairedAtIso,
      ...(repairedApprovalBase ? { approvalProjectionBase: repairedApprovalBase } : {})
    } });
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT,
      phase: "root-activity-projection-repaired", repairedAtIso,
      oracle: conciseOracle(baseline),
      next: "Reload Casey once; My Events must show red counter 1 before approval."
    });
  }

  function prepare(branch) {
    Q.assertDeploymentSafety();
    const currentState = state();
    assertUnchanged(currentState.baseline, oracle(), `${currentState.branch} branch`);
    restoreJoinBranch(currentState);
    const preparedAtIso = Q.nowIso();
    let invitationProjectionBase = null;
    let approvalProjectionBase = null;
    if (branch === "invitation") {
      Q.collection("events").updateOne({ sourceId: EVENT_ID }, { $set: {
        pendingMembers: 1,
        pendingMemberUserIds: [CANDIDATE_ID],
        invitedMemberUserIds: [CANDIDATE_ID],
        pendingRequestMemberUserIds: [],
        updatedDate: preparedAtIso,
        updatedUser: Q.ACTOR
      } });
      Q.collection("activityMembers").insertOne(member(
        "parent-riley", "event", EVENT_ID, CANDIDATE_ID, "Member", "pending", preparedAtIso,
        { pendingSource: "admin", requestKind: "invite" }
      ));
      invitationProjectionBase = materializeInvitationProjection(preparedAtIso);
    } else if (branch === "approval") {
      Q.collection("events").updateOne({ sourceId: EVENT_ID }, { $set: {
        pendingMembers: 1,
        pendingMemberUserIds: [CANDIDATE_ID],
        invitedMemberUserIds: [],
        pendingRequestMemberUserIds: [CANDIDATE_ID],
        updatedDate: preparedAtIso,
        updatedUser: Q.ACTOR
      } });
      Q.collection("activityMembers").insertOne(member(
        "parent-riley", "event", EVENT_ID, CANDIDATE_ID, "Member", "pending", preparedAtIso,
        { pendingSource: "member", requestKind: "approval" }
      ));
      approvalProjectionBase = materializeApprovalProjection(preparedAtIso);
    } else {
      Q.fail(`unsupported admission branch '${branch}'.`);
    }
    const baseline = oracle();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      branch,
      preparedAtIso,
      baseline,
      ...(invitationProjectionBase ? { invitationProjectionBase } : {}),
      ...(approvalProjectionBase ? { approvalProjectionBase } : {})
    }, $unset: branch === "invitation"
      ? { approvalProjectionBase: "" }
      : { invitationProjectionBase: "" } });
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT, phase: `${branch}-baseline`,
      preparedAtIso, oracle: conciseOracle(baseline),
      next: branch === "invitation"
        ? "Riley accepts the existing invitation once; Registration closed must appear and the invitation must remain pending."
        : "Casey accepts Riley's pending join request once; Registration closed must appear and Riley must remain pending."
    });
  }

  function verify() {
    Q.assertDeploymentSafety();
    const currentState = state();
    const current = oracle();
    assertUnchanged(currentState.baseline, current, `${currentState.branch} rejection`);
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, {
      $set: { lastVerifiedAtIso: verifiedAtIso },
      $addToSet: { verifiedBranches: currentState.branch }
    });
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT,
      phase: `${currentState.branch}-rejection-verified`, verifiedAtIso,
      oracle: conciseOracle(current),
      next: currentState.branch === "join"
        ? `Run prepare-tournament-admission-invitation event-domain ${CHECKPOINT}.`
        : currentState.branch === "invitation"
          ? `Run prepare-tournament-admission-approval event-domain ${CHECKPOINT}.`
          : "Replay the three branches in frontend-local mode, then close only if all three show the same localized rejection without mutation."
    });
  }

  function repairOracle() {
    Q.assertDeploymentSafety();
    const currentState = state();
    const current = oracle();
    const savedDomain = { ...currentState.baseline };
    const currentDomain = { ...current };
    delete savedDomain.userActivities;
    delete currentDomain.userActivities;
    if (!Q.sameJson(savedDomain, currentDomain)) {
      Q.fail(`${CHECKPOINT} domain data changed; refusing to repair the oracle.`);
    }
    const repairedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, {
      $set: {
        "baseline.userActivities": current.userActivities,
        oracleRepairedAtIso: repairedAtIso
      },
      $unset: { userActivitySnapshots: "" }
    });
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT,
      phase: "counter-oracle-repaired", repairedAtIso,
      preservedDomainData: true,
      next: `Run status event-domain ${CHECKPOINT}.`
    });
  }

  function repairVisibility() {
    Q.assertDeploymentSafety();
    const currentState = state();
    assertUnchanged(currentState.baseline, oracle(), `${currentState.branch} branch`);
    if (currentState.branch !== "join") {
      Q.fail(`${CHECKPOINT} visibility repair is restricted to the join branch.`);
    }
    Q.collection("events").updateOne(
      { sourceId: EVENT_ID },
      { $set: { visibility: "Invitation only" } }
    );
    const baseline = oracle();
    const repairedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      baseline,
      visibilityRepairedAtIso: repairedAtIso
    } });
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT,
      phase: "join-visibility-repaired", repairedAtIso,
      oracle: conciseOracle(baseline),
      next: "Reload Riley Explore once; QA TOURNAMENT-ADMISSION-001 must not be listed."
    });
  }

  function status() {
    Q.assertDeploymentSafety();
    const currentState = state(false);
    if (!currentState) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "not-staged", next: `Run stage event-domain ${CHECKPOINT}.` });
      return;
    }
    const current = oracle();
    const equalityBySection = Object.fromEntries(Object.keys(current)
      .map(key => [key, key === "userActivities"
        ? sameCounters(currentState.baseline[key], current[key])
        : Q.sameJson(currentState.baseline[key], current[key])]));
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT,
      phase: `${currentState.branch}-staged`, stagedAtIso: currentState.stagedAtIso,
      verifiedBranches: currentState.verifiedBranches || [],
      unchangedFromBranchBaseline: sameOracle(currentState.baseline, current),
      equalityBySection,
      activityCounterComparison: equalityBySection.userActivities
        ? { equal: true }
        : { equal: false, baseline: currentState.baseline.userActivities, current: current.userActivities },
      oracle: conciseOracle(current)
    });
  }

  function reset() {
    Q.assertDeploymentSafety();
    const currentState = state();
    restoreProjectionCounters(currentState);
    restoreRootProjectionCounters(currentState);
    Q.restoreSnapshots(currentState.snapshots || []);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: STATE_ID });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "reset-complete", resetAtIso: Q.nowIso() });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stage(); break;
    case "status": status(); break;
    case "prepare-tournament-admission-invitation": prepare("invitation"); break;
    case "prepare-tournament-admission-approval": prepare("approval"); break;
    case "verify-tournament-admission-rejection": verify(); break;
    case "repair-tournament-admission-oracle": repairOracle(); break;
    case "repair-tournament-admission-visibility": repairVisibility(); break;
    case "repair-tournament-admission-invitation-projection": repairInvitationProjection(); break;
    case "repair-tournament-admission-root-projection": repairRootProjection(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
