/* global ManualQa, process, NumberLong */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "event-domain-tournament-score-reopen";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const BASE_CHECKPOINT = "TOURNAMENT-SCORE-REOPEN-001";
  const LATE_GUARD_CHECKPOINT = "TOURNAMENT-SCORE-REOPEN-002";
  const CHECKPOINT = checkpointId === LATE_GUARD_CHECKPOINT ? LATE_GUARD_CHECKPOINT : BASE_CHECKPOINT;
  const PREFIX = "manual-qa-checkpoint:v1:tournament-score-reopen";
  const STATE_ID = Q.stateId(SCENARIO);
  const EVENT_ID = `${PREFIX}:event`;
  const QUALIFIER_ID = `${EVENT_ID}:stage:qualifiers`;
  const FINAL_ID = `${EVENT_ID}:stage:final`;
  const QUALIFIER_GROUP_A = `${QUALIFIER_ID}:group:1`;
  const QUALIFIER_GROUP_B = `${QUALIFIER_ID}:group:2`;
  const FINAL_GROUP = `${FINAL_ID}:group:1`;
  const FINAL_REMINDER_RULE_KEY = `event-stage-reminder:${EVENT_ID}:${FINAL_ID}`;
  const RULE_KEY = "event-tournament-review";
  const HOST_ID = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID) || "650000000000000000000061";
  const NOVA_ID = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID) || "650000000000000000000062";
  const RILEY_ID = "650000000000000000000063";
  const ALL_USERS = [HOST_ID, NOVA_ID, RILEY_ID];
  const INITIAL_ADVANCERS = [HOST_ID, RILEY_ID].sort();
  const CORRECTED_ADVANCERS = [NOVA_ID, RILEY_ID].sort();
  const RESULT_FINGERPRINT = "dc91868958c8bc3d57002fc1a1961bdcb3ca8ab155abd76d68100d9e4911be73";
  const INITIAL_FINAL_GROUP_FINGERPRINT = "20609d255ecbc4bcbbc76d17e742c81c513bf21ae4c10e0034b8e8bc702957b5";

  function dateIso(minutesFromNow) {
    return new Date(Date.now() + minutesFromNow * 60000).toISOString();
  }

  function sorted(values) {
    return [...new Set((values || []).map(Q.text).filter(Boolean))].sort();
  }

  function state(required = true) {
    const value = Q.collection(Q.STATE_COLLECTION).findOne({ _id: STATE_ID });
    if (!value && required) Q.fail(`${CHECKPOINT} is not staged.`);
    return value;
  }

  function selectors() {
    const related = {
      $or: [
        { sourceId: EVENT_ID }, { eventId: EVENT_ID }, { ownerId: EVENT_ID },
        { entityId: EVENT_ID }, { targetId: EVENT_ID }, { "payload.eventId": EVENT_ID },
        { ownerId: { $regex: `^${EVENT_ID}:` } }, { scopeId: { $regex: `^${EVENT_ID}:` } }
      ]
    };
    return [
      { collection: "events", selector: { $or: [{ sourceId: EVENT_ID }, { parentEventId: EVENT_ID }] } },
      { collection: "activityMembers", selector: related },
      { collection: "activitySubEventStageRuntime", selector: { ownerId: EVENT_ID } },
      { collection: "eventLeaderboardEntries", selector: { eventId: EVENT_ID } },
      { collection: "activitySubEventGroups", selector: { ownerId: { $regex: `^${EVENT_ID}:` } } },
      { collection: "chats", selector: related },
      { collection: "chatMessages", selector: related },
      { collection: "notificationOutbox", selector: related },
      { collection: "userNotifications", selector: related },
      { collection: "schedulerPlanMarkers", selector: related },
      { collection: "affinityRecomputeTasks", selector: related },
      { collection: "scheduledMessageTasks", selector: related },
      { collection: "scheduledMessageRuns", selector: { ruleKey: FINAL_REMINDER_RULE_KEY } },
      { collection: "scheduledMessageDeliveries", selector: { ruleKey: FINAL_REMINDER_RULE_KEY } },
      { collection: "notificationRuleConfigs", selector: { ruleKey: RULE_KEY } }
    ];
  }

  function userActivities(userId) {
    const user = Q.ensureUser(userId, "tournament score-reopen user");
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

  function applyActivityProjection(userId, increments) {
    const values = {};
    for (const [path, amount] of Object.entries(increments)) values[`activities.${path}`] = amount;
    const result = Q.collection("users").updateOne(
      { $or: [{ _id: userId }, { userId }] },
      { $inc: values }
    );
    if (result.matchedCount !== 1) Q.fail(`user '${userId}' disappeared while the fixture projection was staged.`);
  }

  function member(id, ownerType, ownerId, userId, role, status, atIso) {
    return {
      _id: `${PREFIX}:member:${id}`,
      syncKey: `${PREFIX}:member:${ownerId}:${userId}`,
      ownerType, ownerId, userId, role, status,
      pendingSource: null, requestKind: null, invitedByUserId: null,
      actionAtIso: atIso,
      createdDate: atIso, createdUser: Q.ACTOR,
      updatedDate: atIso, updatedUser: Q.ACTOR
    };
  }

  function qualifierStage(finalizedAtIso) {
    return {
      id: QUALIFIER_ID,
      name: "Qualifiers",
      description: "Corrected-score revision baseline",
      timing: "During", offsetMinutes: 0, durationMinutes: 60,
      startAt: dateIso(-150), endAt: dateIso(-90), optional: false,
      capacityMin: 2, capacityMax: 4,
      tournamentGroupCapacityMin: 1, tournamentGroupCapacityMax: 2,
      tournamentLeaderboardType: "Score", tournamentAdvancePerGroup: 1,
      stageStatus: "F", stageStatusReason: "stage-finalized",
      stageStatusUpdatedAt: finalizedAtIso,
      stageFinalizedAt: finalizedAtIso,
      stageFinalizedByUserId: HOST_ID,
      stageResultRevision: 1,
      membersAccepted: 3, membersPending: 0,
      groupsCount: 2, groupsPending: 0
    };
  }

  function finalStage() {
    return {
      id: FINAL_ID,
      name: "Final",
      description: "Dependent stage remains unstarted during score correction",
      timing: "After", offsetMinutes: 0, durationMinutes: 45,
      startAt: dateIso(120), endAt: dateIso(165), optional: false,
      capacityMin: 1, capacityMax: 2,
      tournamentGroupCapacityMin: 1, tournamentGroupCapacityMax: 2,
      tournamentLeaderboardType: "Score", tournamentAdvancePerGroup: 0,
      stageStatus: "RS", stageStatusReason: "awaiting-prior-stage",
      stageStatusUpdatedAt: null,
      stageFinalizedAt: null,
      stageFinalizedByUserId: null,
      stageResultRevision: 0,
      membersAccepted: 2, membersPending: 0,
      groupsCount: 1, groupsPending: 0
    };
  }

  function rootEvent(stagedAtIso, finalizedAtIso) {
    const qualifier = qualifierStage(finalizedAtIso);
    const final = finalStage();
    return {
      _id: EVENT_ID, sourceId: EVENT_ID, syncKey: EVENT_ID,
      title: "QA TOURNAMENT-SCORE-REOPEN-001",
      subtitle: "Corrected scores and durable result revision",
      status: "A", published: true, isTrashed: false,
      ownerUserId: HOST_ID, creatorUserId: HOST_ID, organizerUserId: HOST_ID,
      creatorName: "Casey Bridge", creatorInitials: "CB", creatorCity: "Austin",
      admins: [HOST_ID], visibility: "Invitation only", blindMode: "Open Event",
      autoInviter: false, ticketing: false, approvalRequired: false,
      capacityMin: 1, capacityMax: 8, capacityTotal: 8, full: false,
      acceptedMembers: 3, pendingMembers: 0,
      acceptedMemberUserIds: ALL_USERS,
      pendingMemberUserIds: [], invitedMemberUserIds: [], pendingRequestMemberUserIds: [],
      subEventsEnabled: true, subEventDefinitions: [qualifier, final], subEvents: [qualifier, final],
      currentStage: { id: FINAL_ID, name: "Final", stageNumber: 2, totalStages: 2, status: "RS" },
      mode: "Tournament", eventType: "event", topics: ["#Tournament", "#ScoreCorrection"],
      startAtIso: qualifier.startAt, endAtIso: final.endAt,
      createdDate: stagedAtIso, createdUser: Q.ACTOR,
      updatedDate: stagedAtIso, updatedUser: Q.ACTOR
    };
  }

  function runtime(id, stage, groupsCount, atIso) {
    return {
      _id: `${PREFIX}:runtime:${id}`,
      syncKey: `${PREFIX}:runtime:${id}`,
      recordId: `${EVENT_ID}:${stage.id}`,
      status: "A", ownerId: EVENT_ID, subEventId: stage.id,
      stageStatus: stage.stageStatus,
      stageStatusReason: stage.stageStatusReason,
      stageStatusUpdatedAt: stage.stageStatusUpdatedAt,
      stageFinalizedAt: stage.stageFinalizedAt,
      stageFinalizedByUserId: stage.stageFinalizedByUserId,
      stageResultRevision: stage.stageResultRevision,
      groupsCount, groupResourceMetricsByAssetOwnerId: {},
      createdDate: atIso, createdUser: Q.ACTOR,
      updatedDate: atIso, updatedUser: Q.ACTOR
    };
  }

  function score(id, groupId, memberId, value, note, atIso) {
    return {
      _id: `${PREFIX}:score:${id}`,
      syncKey: `${PREFIX}:score:${id}`,
      eventId: EVENT_ID, subEventId: QUALIFIER_ID, groupId,
      entryType: "score", memberId, scoreValue: value, note,
      createdAtIso: atIso, createdUser: HOST_ID,
      updatedDate: atIso, updatedUser: HOST_ID
    };
  }

  function notificationPayload(kind) {
    const base = {
      eventId: EVENT_ID,
      eventTitle: "QA TOURNAMENT-SCORE-REOPEN-001",
      eventScope: kind === "finalized" ? "tournament-stage" : "tournament-advancement",
      stageTitle: "Qualifiers",
      nextStageTitle: "Final",
      stageIndex: kind === "not-advanced" ? "1" : "2",
      stageTotal: "2"
    };
    if (kind === "finalized") return {
      ...base,
      notification_title_key: "notification.event.stage.finalized.title",
      notification_message_key: "notification.event.stage.finalized.message",
      notification_tone: "info"
    };
    return {
      ...base,
      senderName: "MyScoutee System",
      notification_title_key: kind === "advanced"
        ? "notification.event.stage.advanced.title"
        : "notification.event.stage.not-advanced.title",
      notification_message_key: kind === "advanced"
        ? "notification.event.stage.advanced.message"
        : "notification.event.stage.not-advanced.message",
      notification_tone: kind === "advanced" ? "success" : "warning",
      notification_avatar_tone: "stage",
      notification_avatar_icon: "emoji_events"
    };
  }

  function initialOutbox(id, type, recipients, title, body, payload, atIso, actor) {
    return {
      _id: `${PREFIX}:outbox:${id}`,
      syncKey: `${PREFIX}:outbox:${id}`,
      notificationType: type,
      entityType: "event", entityId: EVENT_ID,
      recipientScope: type === "event-stage-finalized" ? "event-stage-participants" : "event-stage-outcomes",
      recipientUserIds: recipients, deliveryStrategy: "direct",
      title, body, clickUrl: "/game",
      iconUrl: "/assets/logo/heart.webp", badgeUrl: "/assets/logo/heart.webp",
      tag: `${type}-${EVENT_ID}-${QUALIFIER_ID}`,
      payload, status: "sent", pendingCounterTracked: false, retryCount: 0,
      sentDate: atIso,
      createdDate: atIso, createdUser: actor,
      updatedDate: atIso, updatedUser: actor
    };
  }

  function initialInbox(id, outboxId, recipientUserId, type, title, message, payload, atIso, actor) {
    return {
      _id: `${PREFIX}:notification:${id}`,
      syncKey: `${PREFIX}:outbox:${outboxId}:${recipientUserId}`,
      outboxId: `${PREFIX}:outbox:${outboxId}`,
      recipientUserId, kind: type, category: "event",
      title, message,
      senderUserId: actor === "scheduler" ? null : actor,
      actionPath: "/game", sourceType: "event", sourceId: EVENT_ID,
      payload, occurrenceCount: 1, revision: NumberLong("1"), readAtIso: null,
      createdDate: atIso, createdUser: actor,
      updatedDate: atIso, updatedUser: actor
    };
  }

  function insertInitialNotificationEvidence(finalizedAtIso, outcomeAtIso) {
    const finalizedPayload = notificationPayload("finalized");
    const advancedPayload = notificationPayload("advanced");
    const notAdvancedPayload = notificationPayload("not-advanced");
    const outboxes = [
      initialOutbox("finalized-r1", "event-stage-finalized", [NOVA_ID, RILEY_ID],
        "Qualifiers finalized", "Qualifiers has been finalized.", finalizedPayload, finalizedAtIso, HOST_ID),
      initialOutbox("advanced-r1", "event-stage-advanced", INITIAL_ADVANCERS,
        "Advanced to Final", "You advanced from Qualifiers to Final.", advancedPayload, outcomeAtIso, "scheduler"),
      initialOutbox("not-advanced-r1", "event-stage-not-advanced", [NOVA_ID],
        "Did not advance from Qualifiers", "You did not advance from Qualifiers to Final.",
        notAdvancedPayload, outcomeAtIso, "scheduler")
    ];
    Q.collection("notificationOutbox").insertMany(outboxes);
    Q.collection("userNotifications").insertMany([
      initialInbox("finalized-r1-nova", "finalized-r1", NOVA_ID, "event-stage-finalized",
        outboxes[0].title, outboxes[0].body, finalizedPayload, finalizedAtIso, HOST_ID),
      initialInbox("finalized-r1-riley", "finalized-r1", RILEY_ID, "event-stage-finalized",
        outboxes[0].title, outboxes[0].body, finalizedPayload, finalizedAtIso, HOST_ID),
      initialInbox("advanced-r1-casey", "advanced-r1", HOST_ID, "event-stage-advanced",
        outboxes[1].title, outboxes[1].body, advancedPayload, outcomeAtIso, "scheduler"),
      initialInbox("advanced-r1-riley", "advanced-r1", RILEY_ID, "event-stage-advanced",
        outboxes[1].title, outboxes[1].body, advancedPayload, outcomeAtIso, "scheduler"),
      initialInbox("not-advanced-r1-nova", "not-advanced-r1", NOVA_ID, "event-stage-not-advanced",
        outboxes[2].title, outboxes[2].body, notAdvancedPayload, outcomeAtIso, "scheduler")
    ]);
  }

  function initialMarkers(atIso) {
    const groupContext = `score:${EVENT_ID}:${QUALIFIER_ID}->${FINAL_ID}`;
    return [
      {
        _id: `${PREFIX}:marker:final-group`,
        syncKey: `scheduler:score:group-members:${FINAL_GROUP}:${groupContext}`,
        wrapperType: "score", actionType: "group-members",
        ownerId: FINAL_GROUP, scopeId: groupContext,
        fingerprint: INITIAL_FINAL_GROUP_FINGERPRINT, userIds: INITIAL_ADVANCERS,
        createdDate: atIso, createdUser: "scheduler", updatedDate: atIso, updatedUser: "scheduler"
      },
      {
        _id: `${PREFIX}:marker:result-r1`,
        syncKey: `scheduler:score:score-outcome:${EVENT_ID}:${QUALIFIER_ID}:result-revision:1`,
        wrapperType: "score", actionType: "score-outcome",
        ownerId: EVENT_ID, scopeId: `${QUALIFIER_ID}:result-revision:1`,
        fingerprint: RESULT_FINGERPRINT, userIds: [...ALL_USERS].sort(),
        createdDate: atIso, createdUser: "scheduler", updatedDate: atIso, updatedUser: "scheduler"
      }
    ];
  }

  function canonical(collection, selector) {
    return Q.collection(collection).find(selector).sort({ _id: 1 }).toArray();
  }

  function event() {
    return Q.collection("events").findOne({ sourceId: EVENT_ID });
  }

  function stageById(stageId) {
    return ((event() || {}).subEvents || []).find(item => Q.text(item.id) === stageId) || null;
  }

  function acceptedGroupUsers(ownerId) {
    return sorted(Q.collection("activityMembers").find({
      ownerType: "group", ownerId, status: { $regex: "^accepted$", $options: "i" }
    }).toArray().map(item => item.userId));
  }

  function scoreTotals() {
    const totals = Object.fromEntries(ALL_USERS.map(userId => [userId, 0]));
    for (const entry of canonical("eventLeaderboardEntries", { eventId: EVENT_ID, subEventId: QUALIFIER_ID })) {
      const userId = Q.text(entry.memberId);
      if (Object.prototype.hasOwnProperty.call(totals, userId)) totals[userId] += Q.number(entry.scoreValue);
    }
    return totals;
  }

  function oldEvidence() {
    return {
      outbox: canonical("notificationOutbox", { _id: { $regex: `^${PREFIX}:outbox:.*-r1$` } }),
      inbox: canonical("userNotifications", { _id: { $regex: `^${PREFIX}:notification:.*-r1-` } }),
      resultMarker: canonical("schedulerPlanMarkers", { _id: `${PREFIX}:marker:result-r1` })
    };
  }

  function oldEvidenceUnchanged(saved, current = oldEvidence()) {
    return Q.sameJson(saved.outbox, current.outbox)
      && Q.sameJson(saved.inbox, current.inbox)
      && Q.sameJson(saved.resultMarker, current.resultMarker);
  }

  function reopenEvidence() {
    const selector = {
      "payload.eventId": EVENT_ID,
      "payload.stageAction": "reopen-scores"
    };
    return {
      outbox: canonical("notificationOutbox", selector),
      inbox: canonical("userNotifications", selector)
    };
  }

  function assertReopenEvidence() {
    const evidence = reopenEvidence();
    if (evidence.outbox.length !== 1) {
      Q.fail(`${CHECKPOINT} expected exactly one Reopen scores notification outbox record.`);
    }
    const outbox = evidence.outbox[0];
    const payload = outbox.payload || {};
    if (Q.text(outbox.notificationType) !== "event-stage-scores-under-review"
        || !Q.sameJson(sorted(outbox.recipientUserIds), [NOVA_ID, RILEY_ID].sort())
        || Q.text(outbox.createdUser) !== HOST_ID
        || Q.text(outbox.title) !== "Qualifiers scores under review"
        || Q.text(outbox.body) !== "Qualifiers scores were reopened and are under review."
        || Q.text(payload.notification_title_key) !== "notification.event.stage.scores-under-review.title"
        || Q.text(payload.notification_message_key) !== "notification.event.stage.scores-under-review.message"
        || Q.text(payload.notification_tone) !== "info"
        || Q.text(payload.stageIndex) !== "1"
        || Q.text(payload.stageTotal) !== "2"
        || Q.text(payload.notification_avatar_tone)
        || Q.text(payload.notification_avatar_icon)) {
      Q.fail(`${CHECKPOINT} Reopen scores outbox does not match the separate Casey-authored under-review contract.`);
    }
    if (evidence.inbox.length !== 2
        || !Q.sameJson(sorted(evidence.inbox.map(item => item.recipientUserId)), [NOVA_ID, RILEY_ID].sort())
        || evidence.inbox.some(item => Q.text(item.recipientUserId) === HOST_ID
          || Q.text(item.kind) !== "event-stage-scores-under-review"
          || Q.text(item.senderUserId) !== HOST_ID
          || Q.text(item.title) !== outbox.title
          || Q.text(item.message) !== outbox.body
          || Q.text((item.payload || {}).notification_title_key) !== payload.notification_title_key
          || Q.text((item.payload || {}).notification_message_key) !== payload.notification_message_key
          || Q.text((item.payload || {}).notification_tone) !== "info"
          || Q.text((item.payload || {}).notification_avatar_tone)
          || Q.text((item.payload || {}).notification_avatar_icon))) {
      Q.fail(`${CHECKPOINT} Reopen scores inbox is not exactly Nova+Riley with Casey as the human sender.`);
    }
    return evidence;
  }

  function resultSnapshot() {
    return {
      qualifier: stageById(QUALIFIER_ID),
      final: stageById(FINAL_ID),
      qualifierGroupA: acceptedGroupUsers(QUALIFIER_GROUP_A),
      qualifierGroupB: acceptedGroupUsers(QUALIFIER_GROUP_B),
      finalGroup: acceptedGroupUsers(FINAL_GROUP),
      scores: scoreTotals(),
      markers: canonical("schedulerPlanMarkers", {
        $or: [{ ownerId: EVENT_ID }, { ownerId: FINAL_GROUP }]
      }).map(item => ({
        syncKey: Q.text(item.syncKey), actionType: Q.text(item.actionType),
        ownerId: Q.text(item.ownerId), scopeId: Q.text(item.scopeId),
        fingerprint: Q.text(item.fingerprint), userIds: sorted(item.userIds)
      })),
      revision2Outbox: canonical("notificationOutbox", {
        "payload.eventId": EVENT_ID, "payload.stageResultRevision": "2"
      }).map(item => ({
        notificationType: Q.text(item.notificationType),
        recipientUserIds: sorted(item.recipientUserIds),
        title: Q.text(item.title), body: Q.text(item.body), payload: item.payload || {}
      })),
      revision2Inbox: canonical("userNotifications", {
        "payload.eventId": EVENT_ID, "payload.stageResultRevision": "2"
      }).map(item => ({
        recipientUserId: Q.text(item.recipientUserId), kind: Q.text(item.kind),
        title: Q.text(item.title), message: Q.text(item.message), payload: item.payload || {}
      }))
    };
  }

  function lateGuardSnapshot() {
    const collections = {};
    for (const spec of selectors().filter(item => item.collection !== "notificationRuleConfigs")) {
      collections[spec.collection] = canonical(spec.collection, spec.selector);
    }
    return {
      collections,
      userActivities: ALL_USERS.map(userActivities)
    };
  }

  function normalizeSnapshot(value) {
    if (Array.isArray(value)) return value.map(normalizeSnapshot);
    if (value instanceof Date) return value.toISOString();
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.keys(value).sort().map(key => [key, normalizeSnapshot(value[key])]));
    }
    return value;
  }

  function differencePaths(left, right, path = "") {
    if (Q.sameJson(left, right)) return [];
    if (Array.isArray(left) || Array.isArray(right)) {
      const leftArray = Array.isArray(left) ? left : [];
      const rightArray = Array.isArray(right) ? right : [];
      const result = [];
      for (let index = 0; index < Math.max(leftArray.length, rightArray.length); index += 1) {
        result.push(...differencePaths(leftArray[index], rightArray[index], `${path}[${index}]`));
      }
      return result;
    }
    if (left && right && typeof left === "object" && typeof right === "object") {
      const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])].sort();
      if (keys.length > 0) {
        return keys.flatMap(key => differencePaths(left[key], right[key], path ? `${path}.${key}` : key));
      }
    }
    return [path || "<root>"];
  }

  function assertOldEvidence(currentState) {
    if (!oldEvidenceUnchanged(currentState.oldEvidence)) {
      Q.fail(`${CHECKPOINT} revision 1 audit/outcome evidence was changed or overwritten.`);
    }
  }

  function assertInitialFinalGroup() {
    if (!Q.sameJson(acceptedGroupUsers(FINAL_GROUP), INITIAL_ADVANCERS)) {
      Q.fail(`${CHECKPOINT} initial Final membership is no longer Casey+Riley.`);
    }
  }

  function stage() {
    Q.assertDeploymentSafety();
    if (checkpointId !== BASE_CHECKPOINT) Q.fail(`stage is restricted to ${BASE_CHECKPOINT}.`);
    if (state(false)) Q.fail(`${CHECKPOINT} is already staged; use status or reset.`);
    Q.assertNoOtherActiveScenario(SCENARIO);
    ALL_USERS.forEach((userId, index) => Q.ensureUser(userId, ["Casey", "Nova", "Riley"][index]));
    Q.assertRuleNotRunning(RULE_KEY);
    for (const spec of selectors().filter(item => item.collection !== "notificationRuleConfigs")) {
      if (Q.collection(spec.collection).countDocuments(spec.selector) !== 0) {
        Q.fail(`stale ${CHECKPOINT} data exists in '${spec.collection}'; refusing to overwrite it.`);
      }
    }

    const snapshots = Q.snapshotSpecs(selectors());
    const savedUserActivities = ALL_USERS.map(userActivities);
    const stagedAtIso = Q.nowIso();
    const finalizedAtIso = dateIso(-35);
    const outcomeAtIso = dateIso(-34);
    const qualifier = qualifierStage(finalizedAtIso);
    const final = finalStage();

    Q.collection("events").insertOne(rootEvent(stagedAtIso, finalizedAtIso));
    Q.collection("activityMembers").insertMany([
      member("root-casey", "event", EVENT_ID, HOST_ID, "Admin", "accepted", stagedAtIso),
      member("root-nova", "event", EVENT_ID, NOVA_ID, "Member", "accepted", stagedAtIso),
      member("root-riley", "event", EVENT_ID, RILEY_ID, "Member", "accepted", stagedAtIso),
      member("qa-casey", "group", QUALIFIER_GROUP_A, HOST_ID, "Member", "accepted", stagedAtIso),
      member("qa-nova", "group", QUALIFIER_GROUP_A, NOVA_ID, "Member", "accepted", stagedAtIso),
      member("qb-riley", "group", QUALIFIER_GROUP_B, RILEY_ID, "Member", "accepted", stagedAtIso),
      member("final-casey", "group", FINAL_GROUP, HOST_ID, "Member", "accepted", stagedAtIso),
      member("final-riley", "group", FINAL_GROUP, RILEY_ID, "Member", "accepted", stagedAtIso)
    ]);
    Q.collection("activitySubEventStageRuntime").insertMany([
      runtime("qualifiers", qualifier, 2, stagedAtIso),
      runtime("final", final, 1, stagedAtIso)
    ]);
    Q.collection("eventLeaderboardEntries").insertMany([
      score("casey", QUALIFIER_GROUP_A, HOST_ID, 9, "Initial deterministic winner", finalizedAtIso),
      score("nova", QUALIFIER_GROUP_A, NOVA_ID, 4, "Correction target", finalizedAtIso),
      score("riley", QUALIFIER_GROUP_B, RILEY_ID, 7, "Stable winner control", finalizedAtIso)
    ]);
    Q.collection("schedulerPlanMarkers").insertMany(initialMarkers(outcomeAtIso));
    insertInitialNotificationEvidence(finalizedAtIso, outcomeAtIso);

    applyActivityProjection(HOST_ID, {
      hosting: 1, "event.all": 1, "event.hosting": 1, notifications: 1
    });
    applyActivityProjection(NOVA_ID, {
      events: 1, "event.all": 1, "event.active": 1, notifications: 2
    });
    applyActivityProjection(RILEY_ID, {
      events: 1, "event.all": 1, "event.active": 1, notifications: 2
    });
    Q.holdRule(RULE_KEY, 1, `${CHECKPOINT} holds revision 1 until the controlled corrected Finalize.`);

    const stagedOldEvidence = oldEvidence();
    const baseline = resultSnapshot();
    if (!Q.sameJson(baseline.finalGroup, INITIAL_ADVANCERS)
        || Q.number(baseline.qualifier && baseline.qualifier.stageResultRevision) !== 1
        || Q.text(baseline.qualifier && baseline.qualifier.stageStatus).toUpperCase() !== "F"
        || Q.text(baseline.final && baseline.final.stageStatus).toUpperCase() !== "RS"
        || stagedOldEvidence.outbox.length !== 3
        || stagedOldEvidence.inbox.length !== 5
        || stagedOldEvidence.resultMarker.length !== 1) {
      Q.fail(`${CHECKPOINT} could not establish its exact revision 1 boundary.`);
    }
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: STATE_ID, scenario: SCENARIO, checkpointId: CHECKPOINT,
      phase: "staged", stagedAtIso, snapshots, savedUserActivities,
      oldEvidence: stagedOldEvidence, baseline
    });
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "staged",
      eventId: EVENT_ID, qualifierRevision: 1,
      initialScores: baseline.scores, initialFinalGroup: baseline.finalGroup,
      oldEvidence: { outbox: 3, inbox: 5, resultMarkers: 1 },
      next: "Reload Casey once, open My Events > QA TOURNAMENT-SCORE-REOPEN-001 > View > Qualifiers, and stop before Reopen Scores."
    });
  }

  function verifyReopen() {
    Q.assertDeploymentSafety();
    const currentState = state();
    if (currentState.phase !== "staged") Q.fail(`${CHECKPOINT} Reopen verification requires the staged boundary.`);
    const qualifier = stageById(QUALIFIER_ID);
    const scores = scoreTotals();
    if (Q.text(qualifier && qualifier.stageStatus).toUpperCase() !== "SR"
        || Q.number(qualifier && qualifier.stageResultRevision) !== 1
        || Q.text(qualifier && qualifier.stageFinalizedAt)
        || !Q.sameJson(scores, currentState.baseline.scores)) {
      Q.fail(`${CHECKPOINT} Reopen did not produce Score review revision 1 with unchanged scores.`);
    }
    assertInitialFinalGroup();
    assertOldEvidence(currentState);
    const evidence = assertReopenEvidence();
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "reopened", reopenVerifiedAtIso: verifiedAtIso
    } });
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "reopened",
      qualifierStatus: "SR", qualifierRevision: 1,
      unchangedScores: scores, unchangedFinalGroup: acceptedGroupUsers(FINAL_GROUP),
      underReviewNotification: {
        outbox: evidence.outbox.length,
        inbox: evidence.inbox.length,
        recipients: [NOVA_ID, RILEY_ID].sort(),
        actorExcluded: true
      },
      oldRevisionEvidenceUnchanged: true,
      next: "In Qualifiers > Group A, add exactly +10 score to Nova once; do not finalize yet."
    });
  }

  function rearmReopen() {
    Q.assertDeploymentSafety();
    const currentState = state();
    if (currentState.phase !== "staged") {
      Q.fail(`${CHECKPOINT} Reopen rearm is restricted to the unverified staged boundary.`);
    }
    const qualifier = stageById(QUALIFIER_ID);
    if (Q.text(qualifier && qualifier.stageStatus).toUpperCase() !== "SR"
        || Q.number(qualifier && qualifier.stageResultRevision) !== 1
        || !Q.sameJson(scoreTotals(), currentState.baseline.scores)) {
      Q.fail(`${CHECKPOINT} Reopen rearm requires the unchanged Score review revision 1 boundary.`);
    }
    assertInitialFinalGroup();
    assertOldEvidence(currentState);

    const legacyEvidence = reopenEvidence();
    const legacyOutboxTypes = sorted(legacyEvidence.outbox.map(item => item.notificationType));
    const legacyInboxTypes = sorted(legacyEvidence.inbox.map(item => item.kind));
    if (legacyEvidence.outbox.length !== 2
        || legacyEvidence.inbox.length !== 4
        || !Q.sameJson(legacyOutboxTypes, ["event-stage-closed", "event-stage-review"])
        || !Q.sameJson(legacyInboxTypes, ["event-stage-closed", "event-stage-review"])) {
      Q.fail(`${CHECKPOINT} refuses to rearm because the obsolete Reopen evidence is not the exact known 2-outbox/4-inbox shape.`);
    }

    const rearmedAtIso = Q.nowIso();
    const baselineQualifier = {
      ...currentState.baseline.qualifier,
      startAt: dateIso(-150),
      endAt: dateIso(-90)
    };
    const baselineFinal = {
      ...currentState.baseline.final,
      startAt: dateIso(120),
      endAt: dateIso(165)
    };
    const eventUpdate = Q.collection("events").updateOne(
      { sourceId: EVENT_ID },
      { $set: {
        subEvents: [baselineQualifier, baselineFinal],
        currentStage: {
          id: FINAL_ID,
          name: "Final",
          stageNumber: 2,
          totalStages: 2,
          status: "RS"
        },
        startAtIso: baselineQualifier.startAt,
        endAtIso: baselineFinal.endAt,
        updatedDate: rearmedAtIso,
        updatedUser: Q.ACTOR
      } }
    );
    if (eventUpdate.matchedCount !== 1) Q.fail(`${CHECKPOINT} event disappeared during Reopen rearm.`);
    const runtimeUpdate = Q.collection("activitySubEventStageRuntime").updateOne(
      { ownerId: EVENT_ID, subEventId: QUALIFIER_ID },
      { $set: {
        stageStatus: baselineQualifier.stageStatus,
        stageStatusReason: baselineQualifier.stageStatusReason,
        stageStatusUpdatedAt: baselineQualifier.stageStatusUpdatedAt,
        stageFinalizedAt: baselineQualifier.stageFinalizedAt,
        stageFinalizedByUserId: baselineQualifier.stageFinalizedByUserId,
        stageResultRevision: baselineQualifier.stageResultRevision,
        updatedDate: rearmedAtIso,
        updatedUser: Q.ACTOR
      } }
    );
    if (runtimeUpdate.matchedCount !== 1) Q.fail(`${CHECKPOINT} qualifier runtime disappeared during Reopen rearm.`);

    Q.collection("notificationOutbox").deleteMany({
      _id: { $in: legacyEvidence.outbox.map(item => item._id) }
    });
    Q.collection("userNotifications").deleteMany({
      _id: { $in: legacyEvidence.inbox.map(item => item._id) }
    });
    const baselineNotificationIncrements = new Map([
      [HOST_ID, 1],
      [NOVA_ID, 2],
      [RILEY_ID, 2]
    ]);
    for (const saved of currentState.savedUserActivities || []) {
      const notificationCount = Q.number((saved.value || {}).notifications)
        + (baselineNotificationIncrements.get(saved.userId) || 0);
      Q.collection("users").updateOne(
        { $or: [{ _id: saved.userId }, { userId: saved.userId }] },
        { $set: { "activities.notifications": notificationCount } }
      );
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "staged",
      rearmedAtIso,
      "baseline.qualifier": baselineQualifier,
      "baseline.final": baselineFinal
    } });
    assertOldEvidence(currentState);
    if (reopenEvidence().outbox.length !== 0 || reopenEvidence().inbox.length !== 0) {
      Q.fail(`${CHECKPOINT} obsolete Reopen evidence survived the guarded rearm.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "staged",
      rearmedAtIso,
      qualifierStatus: "F",
      qualifierRevision: 1,
      finalStatus: "RS",
      finalStartAtIso: baselineFinal.startAt,
      removedObsoleteReopenEvidence: { outbox: 2, inbox: 4 },
      oldRevisionEvidenceUnchanged: true,
      next: "Close and reopen only the current event view, then execute Reopen Scores once with the hot-deployed code."
    });
  }

  function verifyCorrection() {
    Q.assertDeploymentSafety();
    const currentState = state();
    if (currentState.phase !== "reopened") Q.fail(`${CHECKPOINT} score verification requires the reopened boundary.`);
    const qualifier = stageById(QUALIFIER_ID);
    const scores = scoreTotals();
    if (Q.text(qualifier && qualifier.stageStatus).toUpperCase() !== "SR"
        || Q.number(qualifier && qualifier.stageResultRevision) !== 1
        || Q.number(scores[NOVA_ID]) !== 14
        || Q.number(scores[HOST_ID]) !== 9
        || Q.number(scores[RILEY_ID]) !== 7) {
      Q.fail(`${CHECKPOINT} expected exact corrected totals Casey=9, Nova=14, Riley=7 in Score review revision 1.`);
    }
    assertInitialFinalGroup();
    assertOldEvidence(currentState);
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "corrected", correctionVerifiedAtIso: verifiedAtIso, correctedScores: scores
    } });
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "corrected",
      correctedScores: scores, oldRevisionEvidenceUnchanged: true,
      next: "Casey chooses Finalize Stage once for Qualifiers; do not wait for the tournament-review worker until the harness arms it."
    });
  }

  function cleanTournamentStageReminders() {
    Q.assertDeploymentSafety();
    const currentState = state();
    if (currentState.phase !== "corrected") {
      Q.fail(`${CHECKPOINT} tournament reminder cleanup requires the verified corrected-score boundary.`);
    }
    const qualifier = stageById(QUALIFIER_ID);
    const scores = scoreTotals();
    if (Q.text(qualifier && qualifier.stageStatus).toUpperCase() !== "SR"
        || Q.number(qualifier && qualifier.stageResultRevision) !== 1
        || Q.number(scores[NOVA_ID]) !== 14
        || Q.number(scores[HOST_ID]) !== 9
        || Q.number(scores[RILEY_ID]) !== 7) {
      Q.fail(`${CHECKPOINT} tournament reminder cleanup refused a changed score-review boundary.`);
    }
    assertInitialFinalGroup();
    assertOldEvidence(currentState);

    const taskSelector = { taskKey: FINAL_REMINDER_RULE_KEY, eventId: EVENT_ID, subEventId: FINAL_ID };
    const outboxSelector = {
      notificationType: "scheduled-template",
      entityId: "event-stage-reminder-v1",
      title: "Final starts soon",
      "payload.ruleKey": FINAL_REMINDER_RULE_KEY
    };
    const inboxSelector = {
      kind: "scheduled-template",
      sourceId: "event-stage-reminder-v1",
      title: "Final starts soon",
      "payload.ruleKey": FINAL_REMINDER_RULE_KEY
    };
    const taskRows = Q.collection("scheduledMessageTasks").find(taskSelector).toArray();
    const runRows = Q.collection("scheduledMessageRuns").find({ ruleKey: FINAL_REMINDER_RULE_KEY }).toArray();
    const deliveryRows = Q.collection("scheduledMessageDeliveries").find({ ruleKey: FINAL_REMINDER_RULE_KEY }).toArray();
    const outboxRows = Q.collection("notificationOutbox").find(outboxSelector).toArray();
    const inboxRows = Q.collection("userNotifications").find(inboxSelector).toArray();
    const expectedRecipients = [HOST_ID, HOST_ID, NOVA_ID, NOVA_ID, RILEY_ID, RILEY_ID].sort();
    if (taskRows.length !== 1
        || runRows.length !== 2
        || deliveryRows.length !== 6
        || outboxRows.length !== 6
        || inboxRows.length !== 6
        || !Q.sameJson(sorted(deliveryRows.map(item => item.userId)), [HOST_ID, NOVA_ID, RILEY_ID].sort())
        || !Q.sameJson(inboxRows.map(item => Q.text(item.recipientUserId)).sort(), expectedRecipients)
        || outboxRows.some(item => Q.text(item.body) !== `QA ${CHECKPOINT} is coming up. Open the event before the stage starts.`)) {
      Q.fail(`${CHECKPOINT} generic Final reminder evidence no longer matches the exact two-run defect shape.`);
    }

    for (const userId of ALL_USERS) {
      const unreadWrongRows = inboxRows.filter(item => Q.text(item.recipientUserId) === userId && !Q.text(item.readAtIso)).length;
      if (unreadWrongRows > 0) {
        Q.collection("users").updateOne(
          { $or: [{ _id: userId }, { userId }] },
          { $inc: { "activities.notifications": -unreadWrongRows } }
        );
      }
    }
    Q.collection("notificationOutbox").deleteMany(outboxSelector);
    Q.collection("userNotifications").deleteMany(inboxSelector);
    Q.collection("scheduledMessageDeliveries").deleteMany({ ruleKey: FINAL_REMINDER_RULE_KEY });
    Q.collection("scheduledMessageRuns").deleteMany({ ruleKey: FINAL_REMINDER_RULE_KEY });
    Q.collection("scheduledMessageTasks").deleteMany(taskSelector);

    if (Q.collection("scheduledMessageTasks").countDocuments(taskSelector) !== 0
        || Q.collection("scheduledMessageRuns").countDocuments({ ruleKey: FINAL_REMINDER_RULE_KEY }) !== 0
        || Q.collection("scheduledMessageDeliveries").countDocuments({ ruleKey: FINAL_REMINDER_RULE_KEY }) !== 0
        || Q.collection("notificationOutbox").countDocuments(outboxSelector) !== 0
        || Q.collection("userNotifications").countDocuments(inboxSelector) !== 0) {
      Q.fail(`${CHECKPOINT} generic Final reminder cleanup was incomplete.`);
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      genericTournamentReminderCleanedAtIso: Q.nowIso()
    } });
    assertOldEvidence(currentState);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      phase: "corrected",
      removedGenericTournamentReminder: {
        tasks: 1, runs: 2, deliveries: 6, outbox: 6, inbox: 6
      },
      correctedScores: scores,
      oldRevisionEvidenceUnchanged: true,
      next: "Casey chooses Finalize Stage once for Qualifiers."
    });
  }

  function armReview() {
    Q.assertDeploymentSafety();
    const currentState = state();
    if (currentState.phase !== "corrected") Q.fail(`${CHECKPOINT} worker arm requires the verified corrected-score boundary.`);
    Q.assertRuleNotRunning(RULE_KEY);
    const qualifier = stageById(QUALIFIER_ID);
    if (Q.text(qualifier && qualifier.stageStatus).toUpperCase() !== "F"
        || Q.number(qualifier && qualifier.stageResultRevision) !== 2
        || Q.text(qualifier && qualifier.stageFinalizedByUserId) !== HOST_ID) {
      Q.fail(`${CHECKPOINT} corrected Finalize did not persist finalized revision 2 by Casey.`);
    }
    assertInitialFinalGroup();
    assertOldEvidence(currentState);
    const reopenEvidenceRows = assertReopenEvidence();
    const genericReminderCounts = {
      tasks: Q.collection("scheduledMessageTasks").countDocuments({ taskKey: FINAL_REMINDER_RULE_KEY }),
      runs: Q.collection("scheduledMessageRuns").countDocuments({ ruleKey: FINAL_REMINDER_RULE_KEY }),
      deliveries: Q.collection("scheduledMessageDeliveries").countDocuments({ ruleKey: FINAL_REMINDER_RULE_KEY }),
      outbox: Q.collection("notificationOutbox").countDocuments({ "payload.ruleKey": FINAL_REMINDER_RULE_KEY }),
      inbox: Q.collection("userNotifications").countDocuments({ "payload.ruleKey": FINAL_REMINDER_RULE_KEY })
    };
    if (Object.values(genericReminderCounts).some(count => Q.number(count) !== 0)) {
      Q.fail(`${CHECKPOINT} generic Final reminder evidence returned before corrected result processing.`);
    }
    const finalizedRows = canonical("notificationOutbox", {
      notificationType: "event-stage-finalized", "payload.eventId": EVENT_ID
    });
    const revisionTwo = finalizedRows.filter(item => Q.text(item.payload && item.payload.stageResultRevision) === "2");
    if (finalizedRows.length !== 2
        || revisionTwo.length !== 1
        || !Q.sameJson(sorted(revisionTwo[0].recipientUserIds), [NOVA_ID, RILEY_ID].sort())) {
      Q.fail(`${CHECKPOINT} corrected Finalize did not create one separate revision 2 human audit for Nova+Riley.`);
    }
    const ruleBefore = Q.requireRule(RULE_KEY);
    const historyLength = Array.isArray(ruleBefore.runHistory) ? ruleBefore.runHistory.length : 0;
    const delaySeconds = Q.number(process.env.MANUAL_QA_DELAY_SECONDS) || 15;
    const schedule = Q.scheduleRule(RULE_KEY, delaySeconds);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "review-armed", reviewArmedAtIso: Q.nowIso(),
      ruleHistoryLengthBeforeReview: historyLength,
      revisionTwoFinalizeOutboxId: revisionTwo[0]._id
    } });
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "review-armed",
      qualifierRevision: 2, separateHumanFinalizeAudits: 2,
      underReviewNotification: {
        outbox: reopenEvidenceRows.outbox.length,
        inbox: reopenEvidenceRows.inbox.length,
        actorExcluded: true
      },
      genericTournamentReminderCounts: genericReminderCounts,
      oldFinalGroupBeforeWorker: acceptedGroupUsers(FINAL_GROUP),
      schedule,
      next: "Wait for the existing event-tournament-review worker, then run status."
    });
  }

  function assertCorrectedResult(currentState, requireInbox) {
    const qualifier = stageById(QUALIFIER_ID);
    if (Q.text(qualifier && qualifier.stageStatus).toUpperCase() !== "F"
        || Q.number(qualifier && qualifier.stageResultRevision) !== 2) {
      Q.fail(`${CHECKPOINT} lost finalized revision 2.`);
    }
    if (!Q.sameJson(acceptedGroupUsers(FINAL_GROUP), CORRECTED_ADVANCERS)) {
      Q.fail(`${CHECKPOINT} Final membership is not exactly corrected Nova+Riley.`);
    }
    assertOldEvidence(currentState);
    const advanced = canonical("notificationOutbox", {
      notificationType: "event-stage-advanced", "payload.eventId": EVENT_ID,
      "payload.stageResultRevision": "2"
    });
    const rejected = canonical("notificationOutbox", {
      notificationType: "event-stage-not-advanced", "payload.eventId": EVENT_ID,
      "payload.stageResultRevision": "2"
    });
    if (advanced.length !== 1 || rejected.length !== 1
        || !Q.sameJson(sorted(advanced[0].recipientUserIds), CORRECTED_ADVANCERS)
        || !Q.sameJson(sorted(rejected[0].recipientUserIds), [HOST_ID])) {
      Q.fail(`${CHECKPOINT} revision 2 automatic outcomes are not Nova+Riley advanced and Casey not advanced.`);
    }
    const marker = Q.collection("schedulerPlanMarkers").findOne({
      wrapperType: "score", actionType: "score-outcome", ownerId: EVENT_ID,
      scopeId: `${QUALIFIER_ID}:result-revision:2`
    });
    if (!marker || Q.text(marker.fingerprint) !== RESULT_FINGERPRINT
        || !Q.sameJson(sorted(marker.userIds), [...ALL_USERS].sort())) {
      Q.fail(`${CHECKPOINT} revision 2 result marker is missing or incomplete.`);
    }
    if (requireInbox) {
      const inbox = canonical("userNotifications", {
        "payload.eventId": EVENT_ID, "payload.stageResultRevision": "2",
        kind: { $in: ["event-stage-advanced", "event-stage-not-advanced"] }
      });
      if (inbox.length !== 3) Q.fail(`${CHECKPOINT} revision 2 automatic outcomes have not delivered to all three users yet.`);
    }
  }

  function verifyResult() {
    Q.assertDeploymentSafety();
    const currentState = state();
    if (currentState.phase !== "review-armed") Q.fail(`${CHECKPOINT} result verification requires the armed worker boundary.`);
    const rule = Q.requireRule(RULE_KEY);
    const historyLength = Array.isArray(rule.runHistory) ? rule.runHistory.length : 0;
    if (Q.text(rule.runState && rule.runState.currentStatus) !== "completed"
        || historyLength <= Q.number(currentState.ruleHistoryLengthBeforeReview)) {
      Q.fail(`${CHECKPOINT} tournament-review worker has not completed after the arm boundary.`);
    }
    assertCorrectedResult(currentState, true);
    const snapshot = normalizeSnapshot(resultSnapshot());
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "result-verified", resultVerifiedAtIso: Q.nowIso(),
      correctedResultSnapshot: snapshot,
      ruleHistoryLengthAfterReview: historyLength
    } });
    Q.holdRule(RULE_KEY, 0, `${CHECKPOINT} corrected revision verified; waiting for no-op arm.`);
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "result-verified",
      correctedFinalGroup: snapshot.finalGroup,
      revisionTwoOutcomeOutbox: snapshot.revision2Outbox.length,
      revisionTwoOutcomeInbox: snapshot.revision2Inbox.filter(item =>
        ["event-stage-advanced", "event-stage-not-advanced"].includes(item.kind)).length,
      oldRevisionEvidenceUnchanged: true,
      next: "Inspect the separate revision 1 and revision 2 result rows in all three Notifications windows; do not mark them read yet."
    });
  }

  function armNoop() {
    Q.assertDeploymentSafety();
    const currentState = state();
    if (currentState.phase !== "result-verified") Q.fail(`${CHECKPOINT} no-op arm requires the verified corrected result.`);
    assertCorrectedResult(currentState, true);
    const ruleBefore = Q.requireRule(RULE_KEY);
    const delaySeconds = Q.number(process.env.MANUAL_QA_DELAY_SECONDS) || 15;
    const schedule = Q.scheduleRule(RULE_KEY, delaySeconds);
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "noop-armed", noopArmedAtIso: Q.nowIso(),
      ruleLastRunAtBeforeNoop: Q.text(ruleBefore.runState && ruleBefore.runState.lastRunAtIso)
    } });
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "noop-armed", schedule,
      next: "Wait for the unchanged worker pass, then run verify-score-reopen-noop."
    });
  }

  function verifyNoop() {
    Q.assertDeploymentSafety();
    const currentState = state();
    if (currentState.phase !== "noop-armed") Q.fail(`${CHECKPOINT} no-op verification requires the armed no-op boundary.`);
    const rule = Q.requireRule(RULE_KEY);
    const lastRunAtIso = Q.text(rule.runState && rule.runState.lastRunAtIso);
    const beforeIso = Q.text(currentState.ruleLastRunAtBeforeNoop || currentState.noopArmedAtIso);
    if (Q.text(rule.runState && rule.runState.currentStatus) !== "completed"
        || Q.number(rule.runState && rule.runState.lastRunCount) !== 0
        || !lastRunAtIso
        || !beforeIso
        || new Date(lastRunAtIso).getTime() <= new Date(beforeIso).getTime()) {
      Q.fail(`${CHECKPOINT} unchanged tournament-review pass has not completed.`);
    }
    assertCorrectedResult(currentState, true);
    const saved = normalizeSnapshot(currentState.correctedResultSnapshot);
    const current = normalizeSnapshot(resultSnapshot());
    if (!Q.sameJson(saved, current)) {
      const changedPaths = differencePaths(saved, current).slice(0, 30);
      Q.fail(`${CHECKPOINT} unchanged worker replay changed snapshot paths: ${changedPaths.join(", ") || "unknown"}.`);
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "noop-verified", noopVerifiedAtIso: Q.nowIso()
    } });
    Q.holdRule(RULE_KEY, 0, `${CHECKPOINT} exact-once no-op verified.`);
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "noop-verified",
      exactOnce: true, correctedFinalGroup: current.finalGroup,
      oldRevisionEvidenceUnchanged: true,
      next: "Verify the already-finalized Qualifiers menu exposes no second Finalize action; then close the checkpoint."
    });
  }

  function prepareLateReopenGuard() {
    Q.assertDeploymentSafety();
    if (checkpointId !== LATE_GUARD_CHECKPOINT) {
      Q.fail(`late Reopen preparation is restricted to ${LATE_GUARD_CHECKPOINT}.`);
    }
    const currentState = state();
    if (currentState.phase !== "noop-verified") {
      Q.fail(`${LATE_GUARD_CHECKPOINT} preparation requires the closed ${BASE_CHECKPOINT} noop-verified boundary.`);
    }
    assertCorrectedResult(currentState, true);
    const savedResult = normalizeSnapshot(currentState.correctedResultSnapshot);
    const currentResult = normalizeSnapshot(resultSnapshot());
    if (!Q.sameJson(savedResult, currentResult)) {
      const changedPaths = differencePaths(savedResult, currentResult).slice(0, 30);
      Q.fail(`${LATE_GUARD_CHECKPOINT} predecessor evidence changed before preparation: ${changedPaths.join(", ") || "unknown"}.`);
    }

    const root = event();
    const stages = (root && root.subEvents) || [];
    const finalIndex = stages.findIndex(item => Q.text(item && item.id) === FINAL_ID);
    const final = finalIndex >= 0 ? stages[finalIndex] : null;
    const finalRuntime = Q.collection("activitySubEventStageRuntime").findOne({
      ownerId: EVENT_ID,
      subEventId: FINAL_ID
    });
    if (!root
        || Q.collection("events").countDocuments({ sourceId: EVENT_ID }) !== 1
        || finalIndex < 0
        || Q.text(final && final.stageStatus).toUpperCase() !== "RS"
        || Q.text(final && final.stageStatusUpdatedAt)
        || Q.text(final && final.stageFinalizedAt)
        || !finalRuntime
        || Q.text(finalRuntime.stageStatus).toUpperCase() !== "RS"
        || Q.text(finalRuntime.stageStatusUpdatedAt)
        || Q.text(finalRuntime.stageFinalizedAt)) {
      Q.fail(`${LATE_GUARD_CHECKPOINT} requires one pristine waiting Final stage in both event and runtime records.`);
    }

    const activatedAtIso = Q.nowIso();
    const activeFinal = {
      ...final,
      stageStatus: "A",
      stageStatusReason: "tournament-started",
      stageStatusUpdatedAt: activatedAtIso,
      stageFinalizedAt: null,
      stageFinalizedByUserId: null
    };
    const nextStages = [...stages];
    nextStages[finalIndex] = activeFinal;
    const eventUpdate = Q.collection("events").updateOne(
      {
        sourceId: EVENT_ID,
        subEvents: {
          $elemMatch: {
            id: FINAL_ID,
            stageStatus: "RS",
            stageStatusUpdatedAt: null,
            stageFinalizedAt: null
          }
        }
      },
      {
        $set: {
          subEvents: nextStages,
          currentStage: {
            id: FINAL_ID,
            name: Q.text(activeFinal.name) || "Final",
            stageNumber: 2,
            totalStages: 2,
            status: "A"
          },
          updatedDate: activatedAtIso,
          updatedUser: Q.ACTOR
        }
      }
    );
    if (eventUpdate.matchedCount !== 1 || eventUpdate.modifiedCount !== 1) {
      Q.fail(`${LATE_GUARD_CHECKPOINT} could not activate the dependent Final event state exactly once.`);
    }
    const runtimeUpdate = Q.collection("activitySubEventStageRuntime").updateOne(
      {
        ownerId: EVENT_ID,
        subEventId: FINAL_ID,
        stageStatus: "RS",
        stageStatusUpdatedAt: null,
        stageFinalizedAt: null
      },
      {
        $set: {
          stageStatus: "A",
          stageStatusReason: "tournament-started",
          stageStatusUpdatedAt: activatedAtIso,
          stageFinalizedAt: null,
          stageFinalizedByUserId: null,
          updatedDate: activatedAtIso,
          updatedUser: Q.ACTOR
        }
      }
    );
    if (runtimeUpdate.matchedCount !== 1 || runtimeUpdate.modifiedCount !== 1) {
      Q.fail(`${LATE_GUARD_CHECKPOINT} could not activate the dependent Final runtime exactly once.`);
    }

    const preparedEvent = event();
    const preparedFinal = stageById(FINAL_ID);
    const preparedRuntime = Q.collection("activitySubEventStageRuntime").findOne({
      ownerId: EVENT_ID,
      subEventId: FINAL_ID
    });
    if (Q.text(preparedFinal && preparedFinal.stageStatus).toUpperCase() !== "A"
        || Q.text(preparedFinal && preparedFinal.stageStatusUpdatedAt) !== activatedAtIso
        || Q.text(preparedRuntime && preparedRuntime.stageStatus).toUpperCase() !== "A"
        || Q.text(preparedRuntime && preparedRuntime.stageStatusUpdatedAt) !== activatedAtIso
        || Q.text(preparedEvent && preparedEvent.currentStage && preparedEvent.currentStage.id) !== FINAL_ID
        || Q.text(preparedEvent && preparedEvent.currentStage && preparedEvent.currentStage.status).toUpperCase() !== "A") {
      Q.fail(`${LATE_GUARD_CHECKPOINT} dependent Final activation did not converge across event, runtime and current-stage state.`);
    }
    assertCorrectedResult(currentState, true);
    const snapshot = normalizeSnapshot(lateGuardSnapshot());
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "late-guard-prepared",
      activeCheckpointId: LATE_GUARD_CHECKPOINT,
      lateGuardPreparedAtIso: activatedAtIso,
      lateGuardSnapshot: snapshot
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: LATE_GUARD_CHECKPOINT,
      phase: "late-guard-prepared",
      eventId: EVENT_ID,
      qualifiers: { status: "F", revision: 2, scores: scoreTotals() },
      dependentFinal: { status: "A", stageStatusUpdatedAt: activatedAtIso },
      finalAcceptedUserIds: acceptedGroupUsers(FINAL_GROUP),
      replayedLifecycleProducers: 0,
      predecessorEvidenceUnchanged: true,
      next: "Reload Casey once, open Qualifiers actions, and verify Reopen Scores is absent."
    });
  }

  function verifyLateReopenGuard() {
    Q.assertDeploymentSafety();
    if (checkpointId !== LATE_GUARD_CHECKPOINT) {
      Q.fail(`late Reopen verification is restricted to ${LATE_GUARD_CHECKPOINT}.`);
    }
    const currentState = state();
    if (currentState.phase !== "late-guard-prepared") {
      Q.fail(`${LATE_GUARD_CHECKPOINT} verification requires the prepared dependent-stage boundary.`);
    }
    assertCorrectedResult(currentState, true);
    const final = stageById(FINAL_ID);
    const root = event();
    const runtime = Q.collection("activitySubEventStageRuntime").findOne({
      ownerId: EVENT_ID,
      subEventId: FINAL_ID
    });
    if (Q.text(final && final.stageStatus).toUpperCase() !== "A"
        || !Q.text(final && final.stageStatusUpdatedAt)
        || Q.text(runtime && runtime.stageStatus).toUpperCase() !== "A"
        || Q.text(runtime && runtime.stageStatusUpdatedAt) !== Q.text(final && final.stageStatusUpdatedAt)
        || Q.text(root && root.currentStage && root.currentStage.id) !== FINAL_ID
        || Q.text(root && root.currentStage && root.currentStage.status).toUpperCase() !== "A") {
      Q.fail(`${LATE_GUARD_CHECKPOINT} lost its active dependent Final boundary.`);
    }
    const saved = normalizeSnapshot(currentState.lateGuardSnapshot);
    const current = normalizeSnapshot(lateGuardSnapshot());
    if (!Q.sameJson(saved, current)) {
      const changedPaths = differencePaths(saved, current).slice(0, 40);
      Q.fail(`${LATE_GUARD_CHECKPOINT} rejected late Reopen changed snapshot paths: ${changedPaths.join(", ") || "unknown"}.`);
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: STATE_ID }, { $set: {
      phase: "late-guard-verified",
      lateGuardVerifiedAtIso: Q.nowIso()
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: LATE_GUARD_CHECKPOINT,
      phase: "late-guard-verified",
      rejectedLateReopenWasAtomic: true,
      qualifiers: { status: "F", revision: 2, scores: scoreTotals() },
      dependentFinalStatus: "A",
      finalAcceptedUserIds: acceptedGroupUsers(FINAL_GROUP),
      predecessorEvidenceUnchanged: true,
      relatedCollectionsAndCountersByteIdentical: true
    });
  }

  function status() {
    Q.assertDeploymentSafety();
    const currentState = state(false);
    if (!currentState) {
      Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "not-staged",
        next: `Run stage event-domain ${CHECKPOINT}.` });
      return;
    }
    const qualifier = stageById(QUALIFIER_ID);
    const final = stageById(FINAL_ID);
    const rule = Q.requireRule(RULE_KEY);
    const currentOldEvidence = oldEvidence();
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT, phase: currentState.phase,
      eventId: EVENT_ID,
      stages: {
        qualifiers: {
          status: Q.text(qualifier && qualifier.stageStatus),
          revision: Q.number(qualifier && qualifier.stageResultRevision),
          finalizedAtIso: Q.text(qualifier && qualifier.stageFinalizedAt)
        },
        final: { status: Q.text(final && final.stageStatus) }
      },
      scores: scoreTotals(),
      finalAcceptedUserIds: acceptedGroupUsers(FINAL_GROUP),
      oldRevisionEvidenceUnchanged: oldEvidenceUnchanged(currentState.oldEvidence, currentOldEvidence),
      oldRevisionEvidenceChecks: {
        outbox: Q.sameJson(currentState.oldEvidence.outbox, currentOldEvidence.outbox),
        inbox: Q.sameJson(currentState.oldEvidence.inbox, currentOldEvidence.inbox),
        resultMarker: Q.sameJson(currentState.oldEvidence.resultMarker, currentOldEvidence.resultMarker)
      },
      revisionTwo: {
        outbox: Q.collection("notificationOutbox").countDocuments({
          "payload.eventId": EVENT_ID, "payload.stageResultRevision": "2"
        }),
        inbox: Q.collection("userNotifications").countDocuments({
          "payload.eventId": EVENT_ID, "payload.stageResultRevision": "2"
        })
      },
      rule: {
        currentStatus: Q.text(rule.runState && rule.runState.currentStatus),
        lastRunAtIso: Q.text(rule.runState && rule.runState.lastRunAtIso),
        lastRunCount: Q.number(rule.runState && rule.runState.lastRunCount),
        historyLength: Array.isArray(rule.runHistory) ? rule.runHistory.length : 0
      }
    });
  }

  function reset() {
    Q.assertDeploymentSafety();
    const currentState = state();
    Q.assertRuleNotRunning(RULE_KEY);
    Q.restoreSnapshots(currentState.snapshots || []);
    for (const saved of currentState.savedUserActivities || []) restoreUserActivities(saved);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: STATE_ID });
    Q.printObject({
      scenario: SCENARIO, checkpointId: CHECKPOINT,
      phase: "reset-complete", resetAtIso: Q.nowIso()
    });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stage(); break;
    case "status": status(); break;
    case "rearm-score-reopen": rearmReopen(); break;
    case "verify-score-reopen": verifyReopen(); break;
    case "verify-score-correction": verifyCorrection(); break;
    case "clean-score-reopen-reminders": cleanTournamentStageReminders(); break;
    case "arm-score-reopen-review": armReview(); break;
    case "verify-score-reopen-result": verifyResult(); break;
    case "arm-score-reopen-noop": armNoop(); break;
    case "verify-score-reopen-noop": verifyNoop(); break;
    case "prepare-score-reopen-late-guard": prepareLateReopenGuard(); break;
    case "verify-score-reopen-late-guard": verifyLateReopenGuard(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
