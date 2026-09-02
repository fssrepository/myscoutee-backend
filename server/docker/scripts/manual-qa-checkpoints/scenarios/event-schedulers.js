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
  const RANDOM_UI_USER_ID = "0216b1ceb256d6f2c89073b8";
  const RANDOM_EVENT_ID = `${PREFIX}:random-groups:event`;
  const RANDOM_STAGE_ID = `${PREFIX}:random-groups:stage`;
  const RANDOM_GROUP_IDS = [1, 2].map(index => `${RANDOM_STAGE_ID}:group:${index}`);
  const RANDOM_GROUP_OWNER_IDS = RANDOM_GROUP_IDS.map(
    groupId => `random-room:${RANDOM_EVENT_ID}:${RANDOM_STAGE_ID}:${groupId}`
  );
  const COUNTER_BRANCH = "counter-expiry";
  const COUNTER_RULE = "event-counter-expiry";
  const COUNTER_EVENT_ID = `${PREFIX}:counter-expiry:event`;
  const COUNTER_USER_ID = `${PREFIX}:counter-expiry:user`;
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

  function pastIso(minutes) {
    return new Date(Date.now() - Math.max(1, Number(minutes) || 1) * 60000).toISOString();
  }

  function dueBoundary(boundaryIso) {
    return {
      $or: [
        { endAtIso: { $lte: boundaryIso } },
        {
          $and: [
            { $or: [{ endAtIso: { $exists: false } }, { endAtIso: null }, { endAtIso: "" }] },
            { startAtIso: { $lte: boundaryIso } }
          ]
        }
      ]
    };
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

  function scheduledRulesToIsolate(targetRuleKey) {
    return Q.collection("notificationRuleConfigs")
      .find({
        ruleKey: { $ne: targetRuleKey },
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

  function randomGraphUsers(count, preferredUserId = "") {
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
    const preferred = Q.text(preferredUserId);
    const preferredNeighbours = adjacency.get(preferred);
    const center = preferred && preferredNeighbours && preferredNeighbours.size >= count - 1
      ? [preferred, preferredNeighbours]
      : [...adjacency.entries()]
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
          collection: "activityEventRuntimeItems",
          selector: {
            eventId: { $in: RANDOM_GROUP_OWNER_IDS },
            runtimeKind: "MAIN_EVENT"
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

    const isolatedRules = scheduledRulesToIsolate(RANDOM_RULE);
    for (const rule of isolatedRules) {
      if (rule.runState && rule.runState.currentStatus === "running") {
        fail(`rule '${Q.text(rule.ruleKey)}' is running; wait for a terminal state and retry.`);
      }
    }

    const userIds = randomGraphUsers(6, RANDOM_UI_USER_ID);
    if (userIds[0] !== RANDOM_UI_USER_ID) {
      fail(`the required participant UI user '${RANDOM_UI_USER_ID}' is not a valid six-user graph anchor.`);
    }
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
        uiUserId: RANDOM_UI_USER_ID,
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
        generatedRoomCount: 0,
        participantUserId: RANDOM_UI_USER_ID
      },
      isolatedScheduledRuleCount: isolatedRules.length,
      metricsExpectation: "After scheduling, the branch-specific primary and required reactive rule set must each run exactly once; random-groups therefore changes both Metrics counters by +2 and then remains stable.",
      next: "Record Job Detail and Metrics baselines; then run schedule event-schedulers EVENT-SCHEDULERS-001 30."
    });
  }

  function counterQuarantineEventIds() {
    const horizonIso = futureIso(60);
    const feedbackCutoffIso = pastIso(60);
    return Q.collection("events")
      .find({
        _id: { $ne: COUNTER_EVENT_ID },
        $or: [
          {
            $and: [
              { expired: { $ne: true } },
              { sourceId: { $exists: true, $nin: ["", null] } },
              { status: "A" },
              dueBoundary(horizonIso)
            ]
          },
          {
            $and: [
              { expired: { $ne: true } },
              { ticketing: true },
              { sourceId: { $exists: true, $nin: ["", null] } },
              { status: { $ne: "T" } },
              dueBoundary(horizonIso)
            ]
          },
          {
            $and: [
              { feedbackCountersProjected: { $ne: true } },
              { generated: { $ne: true } },
              { sourceId: { $exists: true, $nin: ["", null] } },
              { status: { $ne: "T" } },
              { endAtIso: { $lte: feedbackCutoffIso } }
            ]
          }
        ]
      }, { _id: 1 })
      .map(event => event._id)
      .toArray();
  }

  function counterSelectors(quarantineEventIds) {
    return [
      {
        collection: "events",
        selector: { _id: { $in: [COUNTER_EVENT_ID, ...(quarantineEventIds || [])] } }
      },
      {
        collection: "users",
        selector: {
          $or: [{ _id: COUNTER_USER_ID }, { userId: COUNTER_USER_ID }]
        }
      }
    ];
  }

  function stageCounterExpiry() {
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    Q.assertRuleNotRunning(COUNTER_RULE);

    const isolatedRules = scheduledRulesToIsolate(COUNTER_RULE);
    for (const rule of isolatedRules) {
      if (rule.runState && rule.runState.currentStatus === "running") {
        fail(`rule '${Q.text(rule.ruleKey)}' is running; wait for a terminal state and retry.`);
      }
    }
    const quarantineEventIds = counterQuarantineEventIds();
    const selectors = counterSelectors(quarantineEventIds);
    const snapshots = Q.snapshotSpecs(selectors);
    const stagedAtIso = Q.nowIso();
    const primaryRule = Q.requireRule(COUNTER_RULE);
    const state = {
      _id: STATE_ID,
      scenario: SCENARIO,
      checkpointId: CHECKPOINT_ID,
      branch: COUNTER_BRANCH,
      database: db.getName(),
      stagedAtIso,
      scheduledAtIso: null,
      expectedDueAtIso: null,
      scheduleCount: 0,
      context: {
        eventId: COUNTER_EVENT_ID,
        userId: COUNTER_USER_ID,
        quarantineEventIds
      },
      snapshots,
      primaryRuleConfig: primaryRuleConfigSnapshot(primaryRule),
      isolatedRuleConfigs: isolatedRules.map(schedulerRuleControlSnapshot),
      secondaryRuleCounters: []
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);

    try {
      holdScheduledRules(isolatedRules, stagedAtIso);
      Q.holdRule(
        COUNTER_RULE,
        1,
        "EVENT-SCHEDULERS-001 counter-expiry baseline is held; schedule has not been issued.",
        HOLD_SECONDS
      );
      Q.collection("notificationRuleConfigs").updateOne(
        { ruleKey: COUNTER_RULE },
        {
          $set: {
            "runState.pendingCountUnit": "admin.jobs.table.affected",
            updatedDate: stagedAtIso,
            updatedUser: Q.ACTOR
          }
        }
      );
      if (quarantineEventIds.length > 0) {
        Q.collection("events").updateMany(
          { _id: { $in: quarantineEventIds } },
          {
            $set: {
              expired: true,
              feedbackCountersProjected: true,
              updatedDate: stagedAtIso,
              updatedUser: Q.ACTOR
            }
          }
        );
      }
      Q.collection("events").deleteOne({ _id: COUNTER_EVENT_ID });
      Q.collection("users").deleteMany({
        $or: [{ _id: COUNTER_USER_ID }, { userId: COUNTER_USER_ID }]
      });
      Q.collection("users").insertOne({
        _id: COUNTER_USER_ID,
        userId: COUNTER_USER_ID,
        syncKey: COUNTER_USER_ID,
        name: "Manual QA counter owner",
        initials: "CQ",
        status: "A",
        profileStatus: "public",
        activities: {
          invitations: 0,
          events: 99,
          hosting: 99,
          event: {
            all: 99,
            active: 99,
            pending: 0,
            invitations: 0,
            hosting: 99,
            drafts: 0,
            trash: 0
          }
        },
        createdDate: stagedAtIso,
        createdUser: Q.ACTOR,
        updatedDate: stagedAtIso,
        updatedUser: Q.ACTOR
      });
      Q.collection("events").insertOne({
        _id: COUNTER_EVENT_ID,
        sourceId: COUNTER_EVENT_ID,
        syncKey: COUNTER_EVENT_ID,
        title: "Manual QA expired active Event",
        status: "A",
        published: true,
        ticketing: false,
        generated: false,
        feedbackCountersProjected: true,
        expired: false,
        ownerUserId: COUNTER_USER_ID,
        creatorUserId: COUNTER_USER_ID,
        startAtIso: pastIso(120),
        endAtIso: pastIso(60),
        createdDate: stagedAtIso,
        createdUser: Q.ACTOR,
        updatedDate: stagedAtIso,
        updatedUser: Q.ACTOR
      });
    } catch (error) {
      fail(`counter-expiry stage failed after snapshot: ${Q.text(error && error.message)}. Run reset.`);
    }

    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT_ID,
      branch: COUNTER_BRANCH,
      phase: "baseline-ready",
      stagedAtIso,
      isolatedScheduledRuleCount: isolatedRules.length,
      quarantinedPotentiallyDueEventCount: quarantineEventIds.length,
      expectedVisibleBaseline: {
        eligibleBeforeNextRun: 1,
        currentStatus: "idle"
      },
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
    const mainEventRuntimes = Q.collection("activityEventRuntimeItems")
      .find({
        eventId: { $in: context.groupOwnerIds || RANDOM_GROUP_OWNER_IDS },
        runtimeKind: "MAIN_EVENT",
        status: { $ne: "D" }
      })
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
    const mainEventRuntimeValid = mainEventRuntimes.length === 2
      && mainEventRuntimes.every(runtime => Q.text(runtime.ownerId) === Q.text(runtime.eventId)
        && Q.text(runtime.recordId) === `main-event:${Q.text(runtime.eventId)}`);
    const exactOutcome = assignmentValid
      && mainEventRuntimeValid
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
        mainEventRuntimeCount: mainEventRuntimes.length,
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
          && mainEventRuntimes.length === 0
          && messages.length === 0
          && markers.length === 0
          && outbox.length === 0
          && bells.length === 0,
        runObservedAfterSchedule,
        assignmentValid,
        mainEventRuntimeValid,
        duplicateUserIds,
        missingUserIds,
        unexpectedUserIds,
        exactOutcome
      }
    };
  }

  function counterOwnerCounters(user) {
    const activities = user && user.activities || {};
    const event = activities.event || {};
    return {
      invitations: Number(activities.invitations) || 0,
      events: Number(activities.events) || 0,
      hosting: Number(activities.hosting) || 0,
      event: {
        all: Number(event.all) || 0,
        active: Number(event.active) || 0,
        pending: Number(event.pending) || 0,
        invitations: Number(event.invitations) || 0,
        hosting: Number(event.hosting) || 0,
        drafts: Number(event.drafts) || 0,
        trash: Number(event.trash) || 0
      }
    };
  }

  function counterDomainFingerprint(event, user) {
    return {
      event: event && {
        id: event._id,
        status: event.status,
        expired: event.expired,
        updatedDate: event.updatedDate,
        updatedUser: event.updatedUser
      },
      ownerCounters: counterOwnerCounters(user)
    };
  }

  function counterStatus(state) {
    const event = Q.collection("events").findOne({ _id: COUNTER_EVENT_ID });
    const user = Q.collection("users").findOne({
      $or: [{ _id: COUNTER_USER_ID }, { userId: COUNTER_USER_ID }]
    });
    const ownerCounters = counterOwnerCounters(user);
    const domainFingerprint = counterDomainFingerprint(event, user);
    const rule = Q.ruleSummary(COUNTER_RULE);
    const schedulerIsolation = isolatedRulesStatus(state);
    const metrics = monitoringCounters();
    const metricsBaseline = state.metricsBaseline || null;
    const metricsDelta = metricsBaseline ? {
      scheduledTriggers: metrics.scheduledTriggers - Number(metricsBaseline.scheduledTriggers || 0),
      auditEvents: metrics.auditEvents - Number(metricsBaseline.auditEvents || 0)
    } : null;
    const observedSchedulerRuns = schedulerRunsSince(state.scheduledAtIso);
    const expectedRunsExactOnce = observedSchedulerRuns.length === 1
      && observedSchedulerRuns[0].ruleKey === COUNTER_RULE
      && observedSchedulerRuns[0].status === "completed";
    const metricsExactOnce = Boolean(metricsDelta
      && metricsDelta.scheduledTriggers === 1
      && metricsDelta.auditEvents === 1
      && expectedRunsExactOnce);
    const runObservedAfterSchedule = Boolean(
      state.scheduledAtIso
      && Number.isFinite(Date.parse(Q.text(rule.lastRunAtIso)))
      && Date.parse(rule.lastRunAtIso) >= Date.parse(state.scheduledAtIso)
    );
    const ownerCountersValid = ownerCounters.invitations === 0
      && ownerCounters.events === 0
      && ownerCounters.hosting === 0
      && Object.values(ownerCounters.event).every(value => value === 0);
    const expectedRunCount = Number(state.scheduleCount) === 2 ? 0 : 1;
    const zeroWorkDetailValid = Number(state.scheduleCount) !== 2
      || Q.text(rule.progressDetail).includes("No expired event counters");
    const domainUnchangedAfterFirstPass = Number(state.scheduleCount) !== 2
      || Q.sameJson(domainFingerprint, state.firstPassFingerprint);
    const domainOutcomeValid = Boolean(event && event.expired === true)
      && ownerCountersValid
      && domainUnchangedAfterFirstPass;
    const exactOutcome = Number(state.scheduleCount) > 0
      && schedulerIsolation.active
      && runObservedAfterSchedule
      && rule.currentStatus === "completed"
      && rule.lastRunCount === expectedRunCount
      && rule.pendingCount === 0
      && domainOutcomeValid
      && zeroWorkDetailValid
      && metricsExactOnce;
    const baselineReady = Number(state.scheduleCount) === 0
      && schedulerIsolation.active
      && Boolean(event && event.expired === false)
      && rule.currentStatus === "idle"
      && rule.pendingCount === 1
      && ownerCounters.events === 99
      && ownerCounters.hosting === 99
      && ownerCounters.event.all === 99;
    const phase = Number(state.scheduleCount) === 0
      ? "baseline-ready"
      : rule.currentStatus === "running"
        ? "scheduler-running"
        : exactOutcome && Number(state.scheduleCount) === 1
          ? "first-pass-completed"
          : exactOutcome && Number(state.scheduleCount) === 2
            ? "scheduler-completed"
            : "scheduled-waiting";
    return {
      phase,
      pass: Number(state.scheduleCount),
      rule,
      schedulerIsolation,
      metrics: {
        baseline: metricsBaseline,
        current: metrics,
        delta: metricsDelta,
        expectedDelta: metricsBaseline ? { scheduledTriggers: 1, auditEvents: 1 } : null,
        observedSchedulerRuns,
        expectedRunsExactOnce,
        exactOnce: metricsExactOnce
      },
      current: {
        event: event && {
          id: event._id,
          status: event.status,
          expired: event.expired,
          updatedUser: event.updatedUser
        },
        ownerCounters,
        quarantinedPotentiallyDueEventCount: (state.context.quarantineEventIds || []).length
      },
      validation: {
        baselineReady,
        runObservedAfterSchedule,
        expectedRunCount,
        ownerCountersValid,
        domainOutcomeValid,
        domainUnchangedAfterFirstPass,
        zeroWorkDetailValid,
        exactOutcome
      },
      domainFingerprint
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
        next: `Run stage ${SCENARIO} ${CHECKPOINT_ID} <${RANDOM_BRANCH}|${COUNTER_BRANCH}>.`
      });
      return;
    }
    const result = state.branch === RANDOM_BRANCH
      ? randomStatus(state)
      : state.branch === COUNTER_BRANCH
        ? counterStatus(state)
        : fail(`unsupported active branch '${state.branch}'.`);
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
        : result.phase === "first-pass-completed"
          ? "Complete the first-pass user-visible checks, then schedule the zero-work pass."
        : result.phase === "scheduler-completed"
          ? "Complete the user-visible result checks, then reset."
          : "Wait for the real scheduler and run status again."
    });
  }

  function scheduleRandomGroups() {
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

  function scheduleCounterExpiry() {
    const state = Q.activeState(SCENARIO, true);
    if (state.branch !== COUNTER_BRANCH) fail(`unsupported active branch '${state.branch}'.`);
    Q.assertRuleNotRunning(COUNTER_RULE);
    const current = counterStatus(state);
    const scheduleCount = Number(state.scheduleCount) || 0;
    if (scheduleCount === 0 && !current.validation.baselineReady) {
      fail("the counter-expiry baseline is not clean; reset first.");
    }
    if (scheduleCount === 1 && !current.validation.exactOutcome) {
      fail("the first counter-expiry pass is not exact; do not arm the zero-work pass.");
    }
    if (scheduleCount >= 2) {
      fail("both counter-expiry passes were already scheduled; reset before replaying.");
    }
    if (!current.schedulerIsolation.active) {
      fail("one or more unrelated scheduler timing holds are no longer active.");
    }
    const metricsBaseline = monitoringCounters();
    if (metricsBaseline.scheduledTriggers !== metricsBaseline.auditEvents) {
      fail(`Metrics is not settled (${metricsBaseline.scheduledTriggers}/${metricsBaseline.auditEvents}); wait for ingestion and retry.`);
    }
    const scheduleResult = Q.scheduleRule(COUNTER_RULE, requestedDelaySeconds, HOLD_SECONDS);
    const nextScheduleCount = scheduleCount + 1;
    const setValues = {
      scheduledAtIso: scheduleResult.scheduledAtIso,
      expectedDueAtIso: scheduleResult.expectedDueAtIso,
      scheduledDelaySeconds: scheduleResult.delaySeconds,
      scheduleCount: nextScheduleCount,
      metricsBaseline
    };
    if (scheduleCount === 1) {
      setValues.firstPassFingerprint = current.domainFingerprint;
      setValues.firstPassEvidence = {
        completedAtIso: current.rule.lastRunAtIso,
        processedCount: current.rule.lastRunCount,
        metrics: current.metrics,
        domainFingerprint: current.domainFingerprint
      };
    }
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: STATE_ID },
      { $set: setValues }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: CHECKPOINT_ID,
      branch: state.branch,
      pass: nextScheduleCount === 1 ? "first" : "zero-work",
      phase: "scheduled-waiting",
      ...scheduleResult,
      metricsBaseline,
      next: "Leave Job Detail open; wait for the existing scheduler's normal poll."
    });
  }

  function schedule() {
    const state = Q.activeState(SCENARIO, true);
    if (state.branch === RANDOM_BRANCH) return scheduleRandomGroups();
    if (state.branch === COUNTER_BRANCH) return scheduleCounterExpiry();
    fail(`unsupported active branch '${state.branch}'.`);
  }

  function reset() {
    const state = Q.activeState(SCENARIO, true);
    const targetRule = state.branch === RANDOM_BRANCH
      ? RANDOM_RULE
      : state.branch === COUNTER_BRANCH
        ? COUNTER_RULE
        : fail(`unsupported active branch '${state.branch}'.`);
    Q.assertRuleNotRunning(targetRule);
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
      detail: state.branch === RANDOM_BRANCH
        ? "The source Event, rooms, memberships, chats, messages, notifications, selected user counters and held affinity tasks were restored. The target rule's original configuration was restored while its legitimate run history was retained; every isolated rule's original scheduling control was restored exactly."
        : "The expiry Event, synthetic owner and quarantined due-record fields were restored exactly. The target rule's original configuration was restored while its legitimate two-pass run history was retained; every isolated rule's original scheduling control was restored exactly."
    });
  }

  Q.assertDeploymentSafety();
  if (requestedCheckpointId && requestedCheckpointId !== CHECKPOINT_ID) {
    fail(`checkpoint '${requestedCheckpointId}' is not supported.`);
  }
  switch (command) {
    case "stage":
      if (requestedBranch === RANDOM_BRANCH) stageRandomGroups();
      else if (requestedBranch === COUNTER_BRANCH) stageCounterExpiry();
      else fail(`stage requires '${RANDOM_BRANCH}' or '${COUNTER_BRANCH}'.`);
      break;
    case "status": status(); break;
    case "schedule": schedule(); break;
    case "reset": reset(); break;
    default: fail(`unsupported command '${command}'.`);
  }
})();
