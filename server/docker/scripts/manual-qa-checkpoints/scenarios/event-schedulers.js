/* global ManualQa, db, EJSON, print, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "event-schedulers";
  const CHECKPOINT_ID = "EVENT-SCHEDULERS-001";
  const PREFIX = "manual-qa-checkpoint:v1:event-schedulers";
  const STATE_ID = Q.stateId(SCENARIO);
  const HOLD_SECONDS = 3600;
  const ISOLATED_RULE_HOLD_SECONDS = 7 * 24 * 60 * 60;
  const RANDOM_BRANCH = "random-groups";
  const RANDOM_RULE = "event-random-groups";
  const RANDOM_EVENT_ID = `${PREFIX}:random-groups:event`;
  const RANDOM_STAGE_ID = `${PREFIX}:random-groups:stage`;
  const RANDOM_GROUP_IDS = [1, 2].map(index => `${RANDOM_STAGE_ID}:group:${index}`);
  const RANDOM_GROUP_OWNER_IDS = RANDOM_GROUP_IDS.map(
    groupId => `random-room:${RANDOM_EVENT_ID}:${RANDOM_STAGE_ID}:${groupId}`
  );
  const SECONDARY_RULES = ["notification-outbox", "affinity-recompute"];
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const requestedCheckpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID);
  const requestedBranch = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID);
  const requestedDelaySeconds = Number(process.env.MANUAL_QA_DELAY_SECONDS || 30);

  function fail(message) {
    Q.fail(`${CHECKPOINT_ID}: ${message}`);
  }

  function futureIso(minutes) {
    return new Date(Date.now() + Math.max(1, Number(minutes) || 1) * 60000).toISOString();
  }

  function optionalField(source, key) {
    return source && Object.prototype.hasOwnProperty.call(source, key)
      ? { present: true, value: source[key] }
      : { present: false, value: null };
  }

  function secondaryRuleCounterSnapshots() {
    return SECONDARY_RULES.map(ruleKey => {
      const rule = Q.requireRule(ruleKey);
      const runState = rule.runState || {};
      return {
        ruleKey,
        pendingCount: optionalField(runState, "pendingCount"),
        pendingCountUnit: optionalField(runState, "pendingCountUnit"),
        pendingCountUpdatedAtIso: optionalField(runState, "pendingCountUpdatedAtIso")
      };
    });
  }

  function schedulerRuleControlSnapshot(rule) {
    const runState = rule.runState || {};
    return {
      ruleId: rule._id,
      ruleKey: Q.text(rule.ruleKey),
      timing: optionalField(rule, "timing"),
      scheduleSlots: optionalField(rule, "scheduleSlots"),
      lastRunAtIso: optionalField(runState, "lastRunAtIso"),
      updatedDate: optionalField(rule, "updatedDate"),
      updatedUser: optionalField(rule, "updatedUser")
    };
  }

  function scheduledRulesToIsolate() {
    return Q.collection("notificationRuleConfigs")
      .find({
        ruleKey: { $ne: RANDOM_RULE },
        enabled: true,
        triggerKind: { $in: ["scheduled_process", "timed"] }
      })
      .sort({ ruleKey: 1 })
      .toArray();
  }

  function holdScheduledRules(rules, heldAtIso) {
    for (const rule of rules || []) {
      const result = Q.collection("notificationRuleConfigs").updateOne(
        { _id: rule._id, "runState.currentStatus": { $ne: "running" } },
        {
          $set: {
            scheduleSlots: [],
            "timing.mode": "interval",
            "timing.intervalAmount": 7,
            "timing.intervalUnit": "days",
            "timing.intervalSeconds": ISOLATED_RULE_HOLD_SECONDS,
            "timing.intervalMinutes": ISOLATED_RULE_HOLD_SECONDS / 60,
            "timing.time": "00:00",
            "timing.timezone": "UTC",
            "runState.lastRunAtIso": heldAtIso,
            updatedDate: heldAtIso,
            updatedUser: Q.ACTOR
          }
        }
      );
      if (result.matchedCount !== 1) {
        fail(`rule '${Q.text(rule.ruleKey)}' became running while isolating schedulers.`);
      }
    }
  }

  function restoreScheduledRules(savedRules) {
    for (const saved of savedRules || []) {
      const setValues = {};
      const unsetValues = {};
      for (const field of ["timing", "scheduleSlots", "updatedDate", "updatedUser"]) {
        const record = saved[field];
        if (record && record.present) setValues[field] = record.value;
        else unsetValues[field] = "";
      }
      if (saved.lastRunAtIso && saved.lastRunAtIso.present) {
        setValues["runState.lastRunAtIso"] = saved.lastRunAtIso.value;
      } else {
        unsetValues["runState.lastRunAtIso"] = "";
      }
      const update = {};
      if (Object.keys(setValues).length > 0) update.$set = setValues;
      if (Object.keys(unsetValues).length > 0) update.$unset = unsetValues;
      Q.collection("notificationRuleConfigs").updateOne({ _id: saved.ruleId }, update);
    }
  }

  function primaryRuleConfigSnapshot(rule) {
    return {
      ...Q.ruleConfigSnapshot(rule),
      parameters: optionalField(rule, "parameters")
    };
  }

  function restorePrimaryRuleConfig(saved) {
    Q.restoreRuleConfig(saved);
    const update = saved.parameters && saved.parameters.present
      ? { $set: { parameters: saved.parameters.value } }
      : { $unset: { parameters: "" } };
    Q.collection("notificationRuleConfigs").updateOne({ _id: saved.ruleId }, update);
  }

  function monitoringCounters() {
    const snapshot = Q.collection("adminMonitoring").findOne({ monitoringKey: "global" }) || {};
    const counters = snapshot.counters || {};
    return {
      scheduledTriggers: Number(counters["jobs.run.started"]) || 0,
      auditEvents: ["jobs.run.completed", "jobs.run.failed", "jobs.run.skipped"]
        .reduce((total, key) => total + (Number(counters[key]) || 0), 0),
      generatedAtIso: Q.text(snapshot.generatedAtIso)
    };
  }

  function isolatedRulesStatus(state) {
    const invalidRuleKeys = [];
    for (const saved of state.isolatedRuleConfigs || []) {
      const rule = Q.collection("notificationRuleConfigs").findOne({ _id: saved.ruleId }) || {};
      const timing = rule.timing || {};
      const runState = rule.runState || {};
      if ((rule.runState && rule.runState.currentStatus === "running")
          || Number(timing.intervalSeconds) !== ISOLATED_RULE_HOLD_SECONDS
          || (rule.scheduleSlots || []).length !== 0
          || Date.parse(Q.text(runState.lastRunAtIso)) < Date.parse(state.stagedAtIso)) {
        invalidRuleKeys.push(saved.ruleKey);
      }
    }
    return {
      isolatedRuleCount: (state.isolatedRuleConfigs || []).length,
      active: invalidRuleKeys.length === 0,
      invalidRuleKeys
    };
  }

  function schedulerRunsSince(sinceIso) {
    const sinceMillis = Date.parse(Q.text(sinceIso));
    if (!Number.isFinite(sinceMillis)) return [];
    return Q.collection("notificationRuleConfigs")
      .find({}, { ruleKey: 1, runHistory: 1 })
      .toArray()
      .flatMap(rule => (rule.runHistory || [])
        .filter(entry => {
          const observedAt = Date.parse(Q.text(entry.finishedAtIso || entry.startedAtIso));
          return Number.isFinite(observedAt) && observedAt >= sinceMillis;
        })
        .map(entry => ({
          ruleKey: Q.text(rule.ruleKey),
          trigger: Q.text(entry.trigger),
          runnerUser: Q.text(entry.runnerUser),
          startedAtIso: Q.text(entry.startedAtIso),
          finishedAtIso: Q.text(entry.finishedAtIso),
          processedCount: Number(entry.processedCount) || 0,
          status: Q.text(entry.status),
          detail: Q.text(entry.detail)
        })))
      .sort((left, right) => left.startedAtIso.localeCompare(right.startedAtIso));
  }

  function restoreSecondaryRuleCounters(savedRules) {
    for (const saved of savedRules || []) {
      const setValues = {};
      const unsetValues = {};
      for (const field of ["pendingCount", "pendingCountUnit", "pendingCountUpdatedAtIso"]) {
        const record = saved[field];
        const path = `runState.${field}`;
        if (record && record.present) setValues[path] = record.value;
        else unsetValues[path] = "";
      }
      const update = {};
      if (Object.keys(setValues).length > 0) update.$set = setValues;
      if (Object.keys(unsetValues).length > 0) update.$unset = unsetValues;
      Q.collection("notificationRuleConfigs").updateOne({ ruleKey: saved.ruleKey }, update);
    }
  }

  function randomGraphUsers(count) {
    const existingUsers = new Set(
      Q.collection("users")
        .find(
          { userId: { $exists: true, $nin: ["", null] }, profileStatus: "public" },
          { projection: { userId: 1 } }
        )
        .map(user => Q.userIdOf(user))
        .toArray()
    );
    const adjacency = new Map();
    Q.collection("userAffinityEdges").find({ edgeWeight: { $gt: 0 } }).forEach(edge => {
      const left = Q.text(edge.leftUserId);
      const right = Q.text(edge.rightUserId);
      if (!existingUsers.has(left) || !existingUsers.has(right) || left === right) return;
      if (!adjacency.has(left)) adjacency.set(left, new Set());
      if (!adjacency.has(right)) adjacency.set(right, new Set());
      adjacency.get(left).add(right);
      adjacency.get(right).add(left);
    });
    const center = [...adjacency.entries()]
      .filter(([, neighbours]) => neighbours.size >= count - 1)
      .sort((left, right) => right[1].size - left[1].size)[0];
    if (!center) fail(`the demo affinity graph has no public node with ${count - 1} neighbours.`);
    return [center[0], ...[...center[1]].sort().slice(0, count - 1)];
  }

  function randomSelectors(userIds) {
    const memberIds = userIds.map((_, index) => `${PREFIX}:random-groups:member:${index + 1}`);
    const taskKeys = userIds.map(userId => `USER:${userId}`);
    return {
      memberIds,
      taskKeys,
      specs: [
        {
          collection: "events",
          selector: {
            $or: [
              { _id: RANDOM_EVENT_ID },
              { sourceId: { $in: RANDOM_GROUP_OWNER_IDS } }
            ]
          }
        },
        {
          collection: "users",
          selector: { $or: [{ _id: { $in: userIds } }, { userId: { $in: userIds } }] }
        },
        {
          collection: "activityMembers",
          selector: {
            $or: [
              { _id: { $in: memberIds } },
              { ownerType: "event", ownerId: RANDOM_EVENT_ID },
              { ownerType: "event", ownerId: { $in: RANDOM_GROUP_OWNER_IDS } }
            ]
          }
        },
        { collection: "chats", selector: { id: { $in: RANDOM_GROUP_OWNER_IDS } } },
        { collection: "chatMessages", selector: { chatId: { $in: RANDOM_GROUP_OWNER_IDS } } },
        {
          collection: "schedulerPlanMarkers",
          selector: {
            $or: [
              { ownerId: { $in: RANDOM_GROUP_OWNER_IDS } },
              { scopeId: { $regex: RANDOM_EVENT_ID.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") } }
            ]
          }
        },
        {
          collection: "notificationOutbox",
          selector: {
            $or: [
              { entityId: { $in: RANDOM_GROUP_OWNER_IDS } },
              { "payload.eventId": { $in: RANDOM_GROUP_OWNER_IDS } },
              { "payload.parentEventId": RANDOM_EVENT_ID }
            ]
          }
        },
        {
          collection: "userNotifications",
          selector: {
            $or: [
              { sourceId: { $in: RANDOM_GROUP_OWNER_IDS } },
              { "payload.eventId": { $in: RANDOM_GROUP_OWNER_IDS } },
              { "payload.parentEventId": RANDOM_EVENT_ID }
            ]
          }
        },
        {
          collection: "affinityRecomputeTasks",
          selector: {
            $or: [
              { targetId: RANDOM_EVENT_ID },
              { taskKey: { $in: taskKeys } }
            ]
          }
        }
      ]
    };
  }

  function deleteRandomArtifacts(selectors) {
    for (const spec of selectors.specs) {
      if (["users", "notificationRuleConfigs"].includes(spec.collection)) continue;
      Q.collection(spec.collection).deleteMany(spec.selector);
    }
  }

  function stageRandomGroups() {
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    Q.assertRuleNotRunning(RANDOM_RULE);
    for (const ruleKey of SECONDARY_RULES) Q.assertRuleNotRunning(ruleKey);

    const isolatedRules = scheduledRulesToIsolate();
    for (const rule of isolatedRules) {
      if (rule.runState && rule.runState.currentStatus === "running") {
        fail(`rule '${Q.text(rule.ruleKey)}' is running; wait for a terminal state and retry.`);
      }
    }

    const userIds = randomGraphUsers(6);
    const selectors = randomSelectors(userIds);
    const snapshots = Q.snapshotSpecs(selectors.specs);
    const stagedAtIso = Q.nowIso();
    const primaryRule = Q.requireRule(RANDOM_RULE);
    const state = {
      _id: STATE_ID,
      scenario: SCENARIO,
      checkpointId: CHECKPOINT_ID,
      branch: RANDOM_BRANCH,
      database: db.getName(),
      stagedAtIso,
      scheduledAtIso: null,
      expectedDueAtIso: null,
      scheduleCount: 0,
      context: {
        userIds,
        memberIds: selectors.memberIds,
        taskKeys: selectors.taskKeys,
        eventId: RANDOM_EVENT_ID,
        stageId: RANDOM_STAGE_ID,
        groupIds: RANDOM_GROUP_IDS,
        groupOwnerIds: RANDOM_GROUP_OWNER_IDS
      },
      snapshots,
      primaryRuleConfig: primaryRuleConfigSnapshot(primaryRule),
      isolatedRuleConfigs: isolatedRules.map(schedulerRuleControlSnapshot),
      secondaryRuleCounters: secondaryRuleCounterSnapshots()
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);

    try {
      deleteRandomArtifacts(selectors);
      holdScheduledRules(isolatedRules, stagedAtIso);
      const rule = primaryRule;
      const scopeParameter = {
        key: "jobs.process.randomGroups.sourceEventIds",
        label: "Manual QA event scope",
        labelKey: "",
        group: "Manual QA",
        groupKey: "",
        valueType: "text",
        numberValue: null,
        textValue: RANDOM_EVENT_ID,
        unit: "",
        options: [],
        strategy: "",
        strategyKey: "",
        readOnly: true
      };
      Q.holdRule(
        RANDOM_RULE,
        6,
        "EVENT-SCHEDULERS-001 baseline is held; schedule has not been issued.",
        HOLD_SECONDS
      );
      Q.collection("notificationRuleConfigs").updateOne(
        { ruleKey: RANDOM_RULE },
        {
          $set: {
            manualRunEnabled: true,
            parameters: [
              ...(rule.parameters || []).filter(
                parameter => parameter.key !== scopeParameter.key
              ),
              scopeParameter
            ],
            "runState.pendingCountUnit": "admin.jobs.table.users",
            updatedDate: stagedAtIso,
            updatedUser: Q.ACTOR
          }
        }
      );
      Q.collection("events").insertOne({
        _id: RANDOM_EVENT_ID,
        sourceId: RANDOM_EVENT_ID,
        syncKey: RANDOM_EVENT_ID,
        title: "Manual QA Event scheduler rooms",
        subtitle: "Six accepted participants await affinity room assignment.",
        status: "A",
        ownerUserId: userIds[0],
        creatorUserId: userIds[0],
        admins: [userIds[0]],
        avatar: "SQ",
        creatorName: "Manual QA scheduler host",
        creatorInitials: "SQ",
        creatorCity: "Fixture graph",
        visibility: "Public",
        blindMode: "Open Event",
        imageUrl: "/media/public?key=images/system/random-room-default.png",
        location: "Fixture graph rooms",
        capacityMin: 6,
        capacityMax: 6,
        capacityTotal: 6,
        full: true,
        autoInviter: false,
        frequency: "One-time",
        ticketing: false,
        approvalRequired: false,
        policiesEnabled: false,
        slotsEnabled: false,
        generated: false,
        eventType: "main",
        acceptedMembers: 6,
        pendingMembers: 0,
        acceptedMemberUserIds: [...userIds],
        pendingMemberUserIds: [],
        invitedMemberUserIds: [],
        pendingRequestMemberUserIds: [],
        topics: ["#Fixture", "#Rooms"],
        subEventsEnabled: true,
        subEventDefinitions: [],
        mode: "Casual",
        rating: 0,
        boost: 0,
        affinity: 0,
        startAtIso: futureIso(180),
        endAtIso: futureIso(360),
        subEvents: [{
          id: RANDOM_STAGE_ID,
          name: "Manual QA grouping stage",
          createdByUserId: userIds[0],
          tournamentGroupCapacityMin: 3,
          tournamentGroupCapacityMax: 3,
          capacityMin: 6,
          capacityMax: 6,
          membersAccepted: 6,
          membersPending: 0,
          stageStatus: "A",
          groups: []
        }],
        createdDate: stagedAtIso,
        createdUser: Q.ACTOR,
        updatedDate: stagedAtIso,
        updatedUser: Q.ACTOR
      });
      Q.collection("activityMembers").insertMany(userIds.map((userId, index) => ({
        _id: selectors.memberIds[index],
        syncKey: selectors.memberIds[index],
        ownerType: "event",
        ownerId: RANDOM_EVENT_ID,
        userId,
        role: index === 0 ? "Admin" : "Member",
        status: "accepted",
        actionAtIso: stagedAtIso,
        createdDate: stagedAtIso,
        createdUser: Q.ACTOR,
        updatedDate: stagedAtIso,
        updatedUser: Q.ACTOR
      })));
      Q.collection("affinityRecomputeTasks").insertMany(userIds.map((userId, index) => ({
        _id: `${PREFIX}:random-groups:affinity-task:${index + 1}`,
        version: 0,
        taskKey: `USER:${userId}`,
        targetType: "USER",
        targetId: userId,
        reasons: ["USER_CHANGED"],
        status: "pending",
        pendingCounterTracked: true,
        availableAtIso: "2099-01-01T00:00:00.000Z",
        rerunRequested: false,
        attemptCount: 0,
        createdDate: stagedAtIso,
        updatedDate: stagedAtIso,
        updatedUser: Q.ACTOR
      })));
    } catch (error) {
      fail(`stage failed after snapshot: ${Q.text(error && error.message)}. Run reset.`);
    }

    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT_ID,
      branch: RANDOM_BRANCH,
      phase: "baseline-ready",
      stagedAtIso,
      schedulerHoldSeconds: HOLD_SECONDS,
      expectedVisibleBaseline: {
        eligibleBeforeNextRun: 6,
        currentStatus: "idle",
        generatedRoomCount: 0
      },
      isolatedScheduledRuleCount: isolatedRules.length,
      metricsExpectation: "After scheduling, the branch-specific primary and required reactive rule set must each run exactly once; random-groups therefore changes both Metrics counters by +2 and then remains stable.",
      next: "Record Job Detail and Metrics baselines; then run schedule event-schedulers EVENT-SCHEDULERS-001 30."
    });
  }

  function counterAt(user, path) {
    let value = user;
    for (const key of path.split(".")) value = value && value[key];
    return Number(value) || 0;
  }

  function randomStatus(state) {
    const context = state.context || {};
    const groups = (context.groupOwnerIds || RANDOM_GROUP_OWNER_IDS).map(ownerId => ({
      ownerId,
      event: Q.collection("events").findOne({ sourceId: ownerId }),
      acceptedUserIds: Q.collection("activityMembers")
        .find({ ownerType: "event", ownerId, status: "accepted" })
        .sort({ userId: 1 })
        .map(member => Q.text(member.userId))
        .toArray(),
      chatOwnerUserIds: Q.collection("chats")
        .find({ id: ownerId })
        .sort({ ownerUserId: 1 })
        .map(chat => Q.text(chat.ownerUserId))
        .toArray()
    }));
    const assignedUserIds = groups.flatMap(group => group.acceptedUserIds);
    const assignedCounts = new Map();
    for (const userId of assignedUserIds) {
      assignedCounts.set(userId, (assignedCounts.get(userId) || 0) + 1);
    }
    const expectedUserIds = context.userIds || [];
    const roomSizes = groups.map(group => group.acceptedUserIds.length);
    const duplicateUserIds = [...assignedCounts]
      .filter(([, count]) => count > 1)
      .map(([userId]) => userId)
      .sort();
    const missingUserIds = expectedUserIds.filter(userId => !assignedCounts.has(userId)).sort();
    const unexpectedUserIds = [...assignedCounts.keys()]
      .filter(userId => !expectedUserIds.includes(userId))
      .sort();
    const messages = Q.collection("chatMessages")
      .find({ chatId: { $in: context.groupOwnerIds || RANDOM_GROUP_OWNER_IDS } })
      .toArray();
    const markers = Q.collection("schedulerPlanMarkers")
      .find({ ownerId: { $in: context.groupOwnerIds || RANDOM_GROUP_OWNER_IDS } })
      .toArray();
    const outbox = Q.collection("notificationOutbox").find({
      $or: [
        { entityId: { $in: context.groupOwnerIds || RANDOM_GROUP_OWNER_IDS } },
        { "payload.eventId": { $in: context.groupOwnerIds || RANDOM_GROUP_OWNER_IDS } },
        { "payload.parentEventId": RANDOM_EVENT_ID }
      ]
    }).toArray();
    const bells = Q.collection("userNotifications").find({
      $or: [
        { sourceId: { $in: context.groupOwnerIds || RANDOM_GROUP_OWNER_IDS } },
        { "payload.eventId": { $in: context.groupOwnerIds || RANDOM_GROUP_OWNER_IDS } },
        { "payload.parentEventId": RANDOM_EVENT_ID }
      ]
    }).toArray();
    const userSnapshot = (state.snapshots || []).find(snapshot => snapshot.collection === "users");
    const baselineUsers = new Map(((userSnapshot && userSnapshot.documents) || []).map(
      user => [Q.userIdOf(user), user]
    ));
    const currentUsers = new Map(Q.collection("users")
      .find({ userId: { $in: expectedUserIds } })
      .map(user => [Q.userIdOf(user), user])
      .toArray());
    const chatCounterDeltas = expectedUserIds.map(userId => {
      const before = baselineUsers.get(userId);
      const after = currentUsers.get(userId);
      return {
        userId,
        chats: counterAt(after, "activities.chats") - counterAt(before, "activities.chats"),
        all: counterAt(after, "activities.chat.all") - counterAt(before, "activities.chat.all"),
        event: counterAt(after, "activities.chat.event") - counterAt(before, "activities.chat.event")
      };
    });
    const rule = Q.ruleSummary(RANDOM_RULE);
    const schedulerIsolation = isolatedRulesStatus(state);
    const metrics = monitoringCounters();
    const metricsBaseline = state.metricsBaseline || null;
    const metricsDelta = metricsBaseline ? {
      scheduledTriggers: metrics.scheduledTriggers - Number(metricsBaseline.scheduledTriggers || 0),
      auditEvents: metrics.auditEvents - Number(metricsBaseline.auditEvents || 0)
    } : null;
    const observedSchedulerRuns = schedulerRunsSince(state.scheduledAtIso);
    const observedRunKeys = observedSchedulerRuns.map(run => run.ruleKey);
    const expectedRunKeys = [RANDOM_RULE, "notification-outbox"];
    const expectedRunsExactOnce = observedSchedulerRuns.length === 2
      && expectedRunKeys.every(ruleKey => observedRunKeys.filter(key => key === ruleKey).length === 1)
      && observedSchedulerRuns.every(run => run.status === "completed");
    const metricsExactOnce = Boolean(metricsDelta
      && metricsDelta.scheduledTriggers === expectedRunKeys.length
      && metricsDelta.auditEvents === expectedRunKeys.length
      && expectedRunsExactOnce);
    const runObservedAfterSchedule = Boolean(
      state.scheduledAtIso
      && Number.isFinite(Date.parse(Q.text(rule.lastRunAtIso)))
      && Date.parse(rule.lastRunAtIso) >= Date.parse(state.scheduledAtIso)
    );
    const assignmentValid = roomSizes.length === 2
      && roomSizes.every(size => size === 3)
      && assignedCounts.size === 6
      && duplicateUserIds.length === 0
      && missingUserIds.length === 0
      && unexpectedUserIds.length === 0
      && groups.every(group => group.event && group.chatOwnerUserIds.length === 3);
    const exactOutcome = assignmentValid
      && schedulerIsolation.active
      && runObservedAfterSchedule
      && rule.currentStatus === "completed"
      && rule.lastRunCount === 6
      && rule.pendingCount === 0
      && messages.length === 2
      && markers.length === 2
      && outbox.length === 2
      && bells.length === 6
      && metricsExactOnce
      && chatCounterDeltas.every(delta => delta.chats === 1 && delta.all === 1 && delta.event === 1);
    const phase = !state.scheduledAtIso
      ? "baseline-ready"
      : rule.currentStatus === "running"
        ? "scheduler-running"
        : exactOutcome
          ? "scheduler-completed"
          : "scheduled-waiting";
    return {
      phase,
      rule,
      schedulerIsolation,
      metrics: {
        baseline: metricsBaseline,
        current: metrics,
        delta: metricsDelta,
        expectedDelta: {
          scheduledTriggers: expectedRunKeys.length,
          auditEvents: expectedRunKeys.length
        },
        observedSchedulerRuns,
        expectedRunsExactOnce,
        exactOnce: metricsExactOnce
      },
      current: {
        assignedUserCount: assignedCounts.size,
        roomSizes,
        generatedRoomCount: groups.filter(group => group.event).length,
        messageCount: messages.length,
        markerCount: markers.length,
        outboxCount: outbox.length,
        bellCount: bells.length,
        chatCounterDeltas
      },
      validation: {
        baselineHasZeroArtifacts: !state.scheduledAtIso
          && schedulerIsolation.active
          && assignedCounts.size === 0
          && messages.length === 0
          && markers.length === 0
          && outbox.length === 0
          && bells.length === 0,
        runObservedAfterSchedule,
        assignmentValid,
        duplicateUserIds,
        missingUserIds,
        unexpectedUserIds,
        exactOutcome
      }
    };
  }

  function status() {
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId: CHECKPOINT_ID,
        phase: "not-staged",
        prepared: false,
        next: `Run stage ${SCENARIO} ${CHECKPOINT_ID} ${RANDOM_BRANCH}.`
      });
      return;
    }
    if (state.branch !== RANDOM_BRANCH) fail(`unsupported active branch '${state.branch}'.`);
    const result = randomStatus(state);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT_ID,
      branch: state.branch,
      prepared: true,
      stagedAtIso: state.stagedAtIso,
      scheduledAtIso: state.scheduledAtIso,
      expectedDueAtIso: state.expectedDueAtIso,
      ...result,
      next: result.phase === "baseline-ready"
        ? "Record the Job Detail and Metrics baselines, then schedule."
        : result.phase === "scheduler-completed"
          ? "Complete the user-visible result checks, then reset."
          : "Wait for the real scheduler and run status again."
    });
  }

  function schedule() {
    const state = Q.activeState(SCENARIO, true);
    if (state.branch !== RANDOM_BRANCH) fail(`unsupported active branch '${state.branch}'.`);
    Q.assertRuleNotRunning(RANDOM_RULE);
    const current = randomStatus(state);
    if (state.scheduledAtIso
        || !current.validation.baselineHasZeroArtifacts
        || !current.schedulerIsolation.active) {
      fail("the random-groups baseline is no longer clean or was already scheduled; reset first.");
    }
    const metricsBaseline = monitoringCounters();
    if (metricsBaseline.scheduledTriggers !== metricsBaseline.auditEvents) {
      fail(`Metrics is not settled (${metricsBaseline.scheduledTriggers}/${metricsBaseline.auditEvents}); wait for ingestion and retry.`);
    }
    const scheduleResult = Q.scheduleRule(RANDOM_RULE, requestedDelaySeconds, HOLD_SECONDS);
    Q.collection("notificationRuleConfigs").updateOne(
      { ruleKey: RANDOM_RULE },
      { $set: { manualRunEnabled: true } }
    );
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: STATE_ID },
      {
        $set: {
          scheduledAtIso: scheduleResult.scheduledAtIso,
          expectedDueAtIso: scheduleResult.expectedDueAtIso,
          scheduledDelaySeconds: scheduleResult.delaySeconds,
          scheduleCount: 1,
          metricsBaseline
        }
      }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT_ID,
      branch: state.branch,
      phase: "scheduled-waiting",
      ...scheduleResult,
      metricsBaseline,
      next: "Leave Job Detail open; wait for the existing scheduler's normal poll."
    });
  }

  function reset() {
    const state = Q.activeState(SCENARIO, true);
    Q.assertRuleNotRunning(RANDOM_RULE);
    for (const saved of state.isolatedRuleConfigs || []) Q.assertRuleNotRunning(saved.ruleKey);
    Q.restoreSnapshots(state.snapshots);
    restorePrimaryRuleConfig(state.primaryRuleConfig);
    restoreSecondaryRuleCounters(state.secondaryRuleCounters);
    restoreScheduledRules(state.isolatedRuleConfigs);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: STATE_ID });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT_ID,
      branch: state.branch,
      phase: "reset-complete",
      restored: true,
      detail: "The source Event, rooms, memberships, chats, messages, notifications, selected user counters and held affinity tasks were restored. The target rule's original configuration was restored while its legitimate run history was retained; every isolated rule's original scheduling control was restored exactly."
    });
  }

  Q.assertDeploymentSafety();
  if (requestedCheckpointId && requestedCheckpointId !== CHECKPOINT_ID) {
    fail(`checkpoint '${requestedCheckpointId}' is not supported.`);
  }
  switch (command) {
    case "stage":
      if (requestedBranch !== RANDOM_BRANCH) fail(`stage currently requires branch '${RANDOM_BRANCH}'.`);
      stageRandomGroups();
      break;
    case "status": status(); break;
    case "schedule": schedule(); break;
    case "reset": reset(); break;
    default: fail(`unsupported command '${command}'.`);
  }
})();
