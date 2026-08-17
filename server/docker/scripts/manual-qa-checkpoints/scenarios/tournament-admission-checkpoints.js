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
    const baseline = oracle();
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: STATE_ID,
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      branch: "join",
      stagedAtIso,
      snapshots,
      baseline,
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
  }

  function prepare(branch) {
    Q.assertDeploymentSafety();
    const currentState = state();
    assertUnchanged(currentState.baseline, oracle(), `${currentState.branch} branch`);
    restoreJoinBranch(currentState);
    const preparedAtIso = Q.nowIso();
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
    } else {
      Q.fail(`unsupported admission branch '${branch}'.`);
    }
    const baseline = oracle();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      branch,
      preparedAtIso,
      baseline
    } });
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
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
