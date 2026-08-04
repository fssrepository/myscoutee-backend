/* global db, EJSON, print, process */
(() => {
  "use strict";

  const PREFIX = "manual-qa-checkpoint:v1:stat-012";
  const ACTOR = `${PREFIX}:actor`;
  const STATE_ID = `${PREFIX}:state`;
  const STATE_COLLECTION = "manualQaCheckpointSnapshots";
  const EVENT_ID = `${PREFIX}:event`;
  const CREATOR_MEMBER_ID = `${PREFIX}:creator-member`;
  const PRIMARY_RULE = "event-auto-inviter";
  const SECONDARY_RULES = [
    "event-random-groups",
    "event-tournament-review",
    "event-counter-expiry",
    "notification-outbox",
    "affinity-recompute"
  ];
  const HOLD_INTERVAL_SECONDS = 3600;
  const command = text(process.env.MANUAL_QA_COMMAND);
  const requestedDb = text(process.env.MANUAL_QA_DB);
  const requestedDelaySeconds = Number(process.env.MANUAL_QA_DELAY_SECONDS || 30);
  const requestedCreatorUserId = text(process.env.MANUAL_QA_CREATOR_USER_ID);
  const requestedInviteeUserId = text(process.env.MANUAL_QA_INVITEE_USER_ID);

  function fail(message) {
    throw new Error(`[manual-qa-checkpoints] ${message}`);
  }

  function text(value) {
    return value == null ? "" : String(value).trim();
  }

  function printObject(value) {
    print(EJSON.stringify(value, null, 2, { relaxed: true }));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function futureIso(minutes) {
    return new Date(Date.now() + Math.max(1, Number(minutes) || 1) * 60000).toISOString();
  }

  function collection(name) {
    return db.getCollection(name);
  }

  function assertDeploymentSafety() {
    const currentDb = db.getName();
    if (currentDb !== requestedDb) {
      fail(`mongosh selected '${currentDb}', but MANUAL_QA_DB requested '${requestedDb}'.`);
    }
    const expected = {
      demo_db: {
        controller: "MyScoutee Demo Operator",
        email: "privacy@demo.myscoutee.test"
      },
      e2e_db: {
        controller: "MyScoutee E2E Operator",
        email: "privacy@e2e.myscoutee.test"
      }
    }[currentDb];
    if (!expected) {
      fail(`database '${currentDb}' is forbidden; only exact demo_db/e2e_db are accepted.`);
    }
    const marker = collection("deploymentConfigurations").findOne({
      _id: "deployment-configuration",
      schemaVersion: 3
    });
    const contact = marker && marker.privacyContact ? marker.privacyContact : {};
    if (!marker
        || contact.dataControllerName !== expected.controller
        || contact.privacyContactEmail !== expected.email) {
      fail(`deployment marker mismatch for '${currentDb}'; refusing to continue.`);
    }
  }

  function requireRule(ruleKey) {
    const rules = collection("notificationRuleConfigs").find({ ruleKey }).limit(2).toArray();
    if (rules.length !== 1) {
      fail(`expected exactly one notification rule '${ruleKey}', found ${rules.length}.`);
    }
    return rules[0];
  }

  function assertRuleNotRunning(ruleKey) {
    const rule = requireRule(ruleKey);
    if (rule.runState && rule.runState.currentStatus === "running") {
      fail(`rule '${ruleKey}' is running; wait for terminal state and retry.`);
    }
    return rule;
  }

  function activeState(required = false) {
    const state = collection(STATE_COLLECTION).findOne({ _id: STATE_ID });
    if (!state && required) {
      fail("STAT-012 is not staged; run 'stage stat-012' first.");
    }
    return state;
  }

  function optionalField(source, key) {
    return source && Object.prototype.hasOwnProperty.call(source, key)
      ? { present: true, value: source[key] }
      : { present: false, value: null };
  }

  function restoreOptionalFields(ruleKey, saved) {
    const setValues = {};
    const unsetValues = {};
    for (const field of ["pendingCount", "pendingCountUnit", "pendingCountUpdatedAtIso"]) {
      const record = saved[field];
      const path = `runState.${field}`;
      if (record && record.present) {
        setValues[path] = record.value;
      } else {
        unsetValues[path] = "";
      }
    }
    const update = {};
    if (Object.keys(setValues).length > 0) update.$set = setValues;
    if (Object.keys(unsetValues).length > 0) update.$unset = unsetValues;
    collection("notificationRuleConfigs").updateOne({ ruleKey }, update);
  }

  function restoreStatsProjection(saved) {
    if (!saved) return;
    const setValues = {};
    const unsetValues = {};
    for (const mapName of ["knownEvents", "activeEvents"]) {
      const record = saved[mapName];
      const path = `${mapName}.${EVENT_ID}`;
      if (record && record.present) {
        setValues[path] = record.value;
      } else {
        unsetValues[path] = "";
      }
    }
    const update = {};
    if (Object.keys(setValues).length > 0) update.$set = setValues;
    if (Object.keys(unsetValues).length > 0) update.$unset = unsetValues;
    collection("adminStats").updateOne({ _id: saved.documentId }, update);
  }

  function userActivitiesSnapshot(userId) {
    const user = collection("users").findOne({ userId });
    if (!user) {
      fail(`user '${userId}' was not found while activity counters were snapshotted.`);
    }
    return {
      userId,
      activities: optionalField(user, "activities")
    };
  }

  function restoreUserActivities(saved) {
    if (!saved || !text(saved.userId)) return;
    const update = saved.activities && saved.activities.present
      ? { $set: { activities: saved.activities.value } }
      : { $unset: { activities: "" } };
    const result = collection("users").updateOne({ userId: saved.userId }, update);
    if (result.matchedCount !== 1) {
      fail(`user '${saved.userId}' disappeared before activity counters could be restored.`);
    }
  }

  function userIdOf(user) {
    return text(user && (user.userId || user._id));
  }

  function displayUser(userId) {
    const user = collection("users").findOne({
      $or: [{ _id: userId }, { userId }]
    });
    return {
      userId,
      name: text(user && user.name),
      city: text(user && user.city),
      profileStatus: text(user && user.profileStatus)
    };
  }

  function selectCreatorContext() {
    const users = collection("users").find({
      userId: { $exists: true, $nin: ["", null] },
      profileStatus: { $in: ["public", "friends only", "host only"] }
    }).toArray();
    const eligible = new Set(users.map(userIdOf).filter(Boolean));
    if (Boolean(requestedCreatorUserId) !== Boolean(requestedInviteeUserId)) {
      fail("MANUAL_QA_CREATOR_USER_ID and MANUAL_QA_INVITEE_USER_ID must be provided together.");
    }

    let creatorUserId = requestedCreatorUserId;
    let expectedInviteeUserId = requestedInviteeUserId;
    if (creatorUserId) {
      if (creatorUserId === expectedInviteeUserId) {
        fail("creator and invitee must be different users.");
      }
      if (!eligible.has(creatorUserId) || !eligible.has(expectedInviteeUserId)) {
        fail("the requested creator and invitee must both be active seeded users.");
      }
    } else {
      const selected = collection("userAffinityEdges")
        .find({ edgeWeight: { $gt: 0 } })
        .toArray()
        .map(edge => ({
          leftUserId: text(edge.leftUserId),
          rightUserId: text(edge.rightUserId),
          edgeWeight: Number(edge.edgeWeight) || 0
        }))
        .filter(edge => eligible.has(edge.leftUserId)
          && eligible.has(edge.rightUserId)
          && edge.leftUserId !== edge.rightUserId)
        .sort((left, right) => right.edgeWeight - left.edgeWeight
          || left.leftUserId.localeCompare(right.leftUserId)
          || left.rightUserId.localeCompare(right.rightUserId))[0];
      if (!selected) {
        fail("no seeded positive affinity pair is available.");
      }
      creatorUserId = selected.leftUserId;
      expectedInviteeUserId = selected.rightUserId;
    }

    return {
      creatorUserId,
      expectedInviteeUserId,
      eligibleCandidateUserIds: [expectedInviteeUserId]
    };
  }

  function affinitySelector(creatorUserId) {
    return {
      $or: [
        { leftUserId: creatorUserId },
        { rightUserId: creatorUserId },
        { _id: `${PREFIX}:isolated-affinity-edge` }
      ]
    };
  }

  function eventSelectors(isolatedEventIds, isolatedWaitlistMemberIds, creatorUserId) {
    return [
      {
        collection: "events",
        selector: { $or: [{ _id: EVENT_ID }, { _id: { $in: isolatedEventIds } }] }
      },
      {
        collection: "activityMembers",
        selector: {
          $or: [
            { ownerType: "event", ownerId: EVENT_ID },
            { _id: { $in: isolatedWaitlistMemberIds } }
          ]
        }
      },
      { collection: "schedulerPlanMarkers", selector: { ownerId: EVENT_ID } },
      {
        collection: "notificationOutbox",
        selector: { $or: [{ entityId: EVENT_ID }, { "payload.eventId": EVENT_ID }] }
      },
      {
        collection: "userNotifications",
        selector: { $or: [{ sourceId: EVENT_ID }, { "payload.eventId": EVENT_ID }] }
      },
      { collection: "affinityRecomputeTasks", selector: { targetId: EVENT_ID } },
      { collection: "userAffinityEdges", selector: affinitySelector(creatorUserId) },
      { collection: "notificationRuleConfigs", selector: { ruleKey: PRIMARY_RULE } }
    ];
  }

  function snapshotSpecs(specs) {
    return specs.map(spec => ({
      collection: spec.collection,
      selector: spec.selector,
      documents: collection(spec.collection).find(spec.selector).toArray()
    }));
  }

  function holdRule(detail) {
    const now = nowIso();
    const update = collection("notificationRuleConfigs").updateOne(
      { ruleKey: PRIMARY_RULE, "runState.currentStatus": { $ne: "running" } },
      {
        $set: {
          enabled: true,
          manualRunEnabled: false,
          scheduleSlots: [],
          "timing.mode": "interval",
          "timing.intervalAmount": 1,
          "timing.intervalUnit": "hours",
          "timing.intervalSeconds": HOLD_INTERVAL_SECONDS,
          "timing.intervalMinutes": 60,
          "timing.time": "00:00",
          "timing.timezone": "UTC",
          "runState.currentStatus": "idle",
          "runState.progressPercent": 0,
          "runState.progressDetail": detail,
          "runState.lastRunAtIso": now,
          "runState.pendingCount": 1,
          "runState.pendingCountUnit": "admin.jobs.table.affected",
          "runState.pendingCountUpdatedAtIso": now,
          updatedDate: now,
          updatedUser: ACTOR
        },
        $unset: {
          "runState.startedAtIso": "",
          "runState.finishedAtIso": "",
          "runState.lastError": ""
        }
      }
    );
    if (update.matchedCount !== 1) {
      fail("auto-inviter became running while the manual checkpoint was staged.");
    }
  }

  function stage() {
    if (activeState(false)) {
      fail("STAT-012 is already staged; use status or reset first.");
    }
    assertRuleNotRunning(PRIMARY_RULE);
    for (const ruleKey of SECONDARY_RULES) assertRuleNotRunning(ruleKey);

    const context = selectCreatorContext();
    const isolatedEventIds = collection("events")
      .find({ autoInviter: true, _id: { $ne: EVENT_ID } }, { projection: { _id: 1 } })
      .map(event => event._id)
      .toArray();
    const isolatedWaitlistMemberIds = collection("activityMembers")
      .find({
        ownerType: "event",
        status: "pending",
        requestKind: { $in: ["waitlist", "waitlist-invite"] }
      }, { projection: { _id: 1 } })
      .map(member => member._id)
      .toArray();
    const specs = eventSelectors(
      isolatedEventIds,
      isolatedWaitlistMemberIds,
      context.creatorUserId
    );
    const primaryRule = requireRule(PRIMARY_RULE);
    const adminStats = collection("adminStats").findOne({ statsKey: "global" });
    if (!adminStats) {
      fail("the global Statistics snapshot is missing.");
    }
    const secondaryRuleCounters = SECONDARY_RULES.map(ruleKey => {
      const rule = requireRule(ruleKey);
      return {
        ruleKey,
        pendingCount: optionalField(rule.runState, "pendingCount"),
        pendingCountUnit: optionalField(rule.runState, "pendingCountUnit"),
        pendingCountUpdatedAtIso: optionalField(rule.runState, "pendingCountUpdatedAtIso")
      };
    });
    const stagedAtIso = nowIso();
    const state = {
      _id: STATE_ID,
      scenario: "stat-012",
      database: db.getName(),
      stagedAtIso,
      scheduledAtIso: null,
      expectedDueAtIso: null,
      context: {
        ...context,
        isolatedEventIds,
        isolatedWaitlistMemberIds,
        pendingJoinDocument: null
      },
      snapshots: snapshotSpecs(specs),
      primaryRuleId: primaryRule._id,
      statsProjection: {
        documentId: adminStats._id,
        knownEvents: optionalField(adminStats.knownEvents, EVENT_ID),
        activeEvents: optionalField(adminStats.activeEvents, EVENT_ID)
      },
      userActivitySnapshots: [
        userActivitiesSnapshot(context.creatorUserId),
        userActivitiesSnapshot(context.expectedInviteeUserId)
      ],
      secondaryRuleCounters
    };
    collection(STATE_COLLECTION).insertOne(state);

    try {
      if (isolatedEventIds.length > 0) {
        collection("events").updateMany(
          { _id: { $in: isolatedEventIds } },
          { $set: { autoInviter: false, updatedDate: stagedAtIso, updatedUser: ACTOR } }
        );
      }
      if (isolatedWaitlistMemberIds.length > 0) {
        collection("activityMembers").updateMany(
          { _id: { $in: isolatedWaitlistMemberIds } },
          {
            $set: {
              requestKind: "manual-qa-checkpoint-quarantined",
              updatedDate: stagedAtIso,
              updatedUser: ACTOR
            }
          }
        );
      }
      collection("events").deleteMany({ _id: EVENT_ID });
      collection("activityMembers").deleteMany({ ownerType: "event", ownerId: EVENT_ID });
      collection("schedulerPlanMarkers").deleteMany({ ownerId: EVENT_ID });
      collection("notificationOutbox").deleteMany({
        $or: [{ entityId: EVENT_ID }, { "payload.eventId": EVENT_ID }]
      });
      collection("userNotifications").deleteMany({
        $or: [{ sourceId: EVENT_ID }, { "payload.eventId": EVENT_ID }]
      });
      collection("affinityRecomputeTasks").deleteMany({ targetId: EVENT_ID });
      collection("userAffinityEdges").deleteMany(affinitySelector(context.creatorUserId));

      const pair = [context.creatorUserId, context.expectedInviteeUserId].sort();
      collection("userAffinityEdges").insertOne({
        _id: `${PREFIX}:isolated-affinity-edge`,
        pairKey: `${pair[0]}:${pair[1]}`,
        leftUserId: context.creatorUserId,
        rightUserId: context.expectedInviteeUserId,
        affinityScore: 1,
        edgeWeight: 1,
        evidence: {
          mutualSingleCount: 1,
          singleOneSidedCount: 0,
          pairOutsideNetworkCount: 0,
          pairInsideNetworkCount: 0,
          metCount: 0,
          strongestAffinityScore: 1,
          totalMultiplier: 1
        },
        updatedDate: stagedAtIso,
        updatedUser: ACTOR
      });

      collection("events").insertOne({
        _id: EVENT_ID,
        sourceId: EVENT_ID,
        syncKey: EVENT_ID,
        title: "Manual QA STAT-012 scheduled invite",
        status: "A",
        published: true,
        autoInviter: true,
        ownerUserId: context.creatorUserId,
        creatorUserId: context.creatorUserId,
        capacityMin: 1,
        capacityMax: 2,
        capacityTotal: 2,
        acceptedMembers: 1,
        pendingMembers: 0,
        subEvents: [],
        startAtIso: futureIso(180),
        endAtIso: futureIso(360),
        createdDate: stagedAtIso,
        createdUser: ACTOR,
        updatedDate: stagedAtIso,
        updatedUser: ACTOR
      });
      collection("activityMembers").insertOne({
        _id: CREATOR_MEMBER_ID,
        syncKey: CREATOR_MEMBER_ID,
        ownerType: "event",
        ownerId: EVENT_ID,
        userId: context.creatorUserId,
        role: "Admin",
        status: "accepted",
        actionAtIso: stagedAtIso,
        createdDate: stagedAtIso,
        createdUser: ACTOR,
        updatedDate: stagedAtIso,
        updatedUser: ACTOR
      });
      collection("adminStats").updateOne(
        { _id: adminStats._id },
        {
          $set: {
            [`knownEvents.${EVENT_ID}`]: stagedAtIso,
            [`activeEvents.${EVENT_ID}`]: stagedAtIso
          }
        }
      );
      holdRule("Manual QA baseline checkpoint is staged; schedule command has not been issued.");
    } catch (error) {
      fail(`stage failed after snapshot: ${text(error && error.message)}. Run reset stat-012.`);
    }

    printObject({
      scenario: "stat-012",
      phase: "baseline-ready",
      stagedAtIso,
      eventId: EVENT_ID,
      eventTitle: "Manual QA STAT-012 scheduled invite",
      creator: displayUser(context.creatorUserId),
      expectedInvitee: displayUser(context.expectedInviteeUserId),
      eligibleCandidateCount: context.eligibleCandidateUserIds.length,
      schedulerHoldSeconds: HOLD_INTERVAL_SECONDS,
      expectedBeforeSchedule: {
        invitationCount: 0,
        markerCount: 0,
        outboxCount: 0,
        bellCount: 0
      },
      next: "Capture the Statistics, Monitoring, and Admin Job baseline screenshots; then run schedule stat-012."
    });
  }

  function schedule() {
    const state = activeState(true);
    assertRuleNotRunning(PRIMARY_RULE);
    if (!Number.isInteger(requestedDelaySeconds)
        || requestedDelaySeconds < 10
        || requestedDelaySeconds > 120) {
      fail("delay-seconds must be an integer from 10 through 120.");
    }
    const existingInvites = collection("activityMembers").countDocuments({
      ownerType: "event",
      ownerId: EVENT_ID,
      status: "pending",
      requestKind: "invite"
    });
    if (existingInvites !== 0) {
      fail("the scheduler already created an invitation; reset before scheduling another pass.");
    }
    const scheduledAt = new Date();
    const lastRunAt = new Date(
      scheduledAt.getTime() - (HOLD_INTERVAL_SECONDS - requestedDelaySeconds) * 1000
    );
    const dueAt = new Date(lastRunAt.getTime() + HOLD_INTERVAL_SECONDS * 1000);
    const scheduledAtIso = scheduledAt.toISOString();
    const expectedDueAtIso = dueAt.toISOString();
    const update = collection("notificationRuleConfigs").updateOne(
      { ruleKey: PRIMARY_RULE, "runState.currentStatus": { $ne: "running" } },
      {
        $set: {
          enabled: true,
          manualRunEnabled: false,
          scheduleSlots: [],
          "timing.mode": "interval",
          "timing.intervalAmount": 1,
          "timing.intervalUnit": "hours",
          "timing.intervalSeconds": HOLD_INTERVAL_SECONDS,
          "timing.intervalMinutes": 60,
          "timing.time": "00:00",
          "timing.timezone": "UTC",
          "runState.currentStatus": "idle",
          "runState.progressPercent": 0,
          "runState.progressDetail": `Manual QA scheduled: eligible after ${expectedDueAtIso}.`,
          "runState.lastRunAtIso": lastRunAt.toISOString(),
          "runState.pendingCount": 1,
          "runState.pendingCountUnit": "admin.jobs.table.affected",
          "runState.pendingCountUpdatedAtIso": scheduledAtIso,
          updatedDate: scheduledAtIso,
          updatedUser: ACTOR
        },
        $unset: {
          "runState.startedAtIso": "",
          "runState.finishedAtIso": "",
          "runState.lastError": ""
        }
      }
    );
    if (update.matchedCount !== 1) {
      fail("the auto-inviter started while its manual schedule was being saved.");
    }
    collection(STATE_COLLECTION).updateOne(
      { _id: state._id },
      {
        $set: {
          scheduledAtIso,
          scheduledDelaySeconds: requestedDelaySeconds,
          expectedDueAtIso
        }
      }
    );
    printObject({
      scenario: "stat-012",
      phase: "scheduled-waiting",
      scheduledAtIso,
      delaySeconds: requestedDelaySeconds,
      expectedDueAtIso,
      schedulerPollDelaySeconds: 60,
      expectedRunWindow: {
        earliestIso: expectedDueAtIso,
        latestApproxIso: new Date(dueAt.getTime() + 60000).toISOString()
      },
      next: "Capture the scheduled checkpoint, wait for the real scheduler, then run status stat-012."
    });
  }

  function hold() {
    const state = activeState(true);
    assertRuleNotRunning(PRIMARY_RULE);
    if (state.scheduledAtIso) {
      fail("the short scheduler window has already been armed; reset before creating another baseline hold.");
    }
    const artifactCount = collection("activityMembers").countDocuments({
      ownerType: "event",
      ownerId: EVENT_ID,
      status: "pending",
      requestKind: "invite"
    }) + collection("schedulerPlanMarkers").countDocuments({ ownerId: EVENT_ID });
    if (artifactCount !== 0) {
      fail("scheduler artifacts already exist; reset before creating another baseline hold.");
    }
    holdRule("Manual QA baseline checkpoint is held; schedule command has not been issued.");
    const rule = ruleSummary();
    printObject({
      scenario: "stat-012",
      phase: "baseline-ready",
      heldAtIso: rule.lastRunAtIso,
      schedulerHoldSeconds: HOLD_INTERVAL_SECONDS,
      calculatedDueAtIso: rule.calculatedDueAtIso,
      pendingCount: rule.pendingCount,
      next: "Capture all remaining UI baselines, then run schedule stat-012."
    });
  }

  function ruleSummary() {
    const rule = requireRule(PRIMARY_RULE);
    const timing = rule.timing || {};
    const runState = rule.runState || {};
    const intervalSeconds = Number(timing.intervalSeconds || 0);
    const lastRunAt = new Date(text(runState.lastRunAtIso));
    const dueAt = Number.isFinite(lastRunAt.getTime()) && intervalSeconds > 0
      ? new Date(lastRunAt.getTime() + intervalSeconds * 1000)
      : null;
    return {
      ruleKey: rule.ruleKey,
      enabled: rule.enabled,
      manualRunEnabled: rule.manualRunEnabled,
      intervalSeconds,
      currentStatus: runState.currentStatus,
      lastRunAtIso: runState.lastRunAtIso,
      lastRunCount: runState.lastRunCount,
      pendingCount: runState.pendingCount,
      progressDetail: runState.progressDetail,
      calculatedDueAtIso: dueAt && dueAt.toISOString(),
      secondsUntilEligible: dueAt
        ? Math.max(0, Math.ceil((dueAt.getTime() - Date.now()) / 1000))
        : null
    };
  }

  function status() {
    const state = activeState(false);
    if (!state) {
      printObject({
        scenario: "stat-012",
        database: db.getName(),
        phase: "not-staged",
        prepared: false,
        rule: ruleSummary(),
        next: "Run stage stat-012."
      });
      return;
    }
    const members = collection("activityMembers")
      .find({ ownerType: "event", ownerId: EVENT_ID })
      .sort({ userId: 1, _id: 1 })
      .toArray();
    const inviteMembers = members.filter(member =>
      member.status === "pending" && member.requestKind === "invite");
    const markerDocuments = collection("schedulerPlanMarkers")
      .find({ ownerId: EVENT_ID })
      .toArray();
    const outboxDocuments = collection("notificationOutbox")
      .find({
        notificationType: "event-invite",
        $or: [{ entityId: EVENT_ID }, { "payload.eventId": EVENT_ID }]
      })
      .toArray();
    const bellDocuments = collection("userNotifications")
      .find({
        $and: [
          { $or: [{ notificationType: "event-invite" }, { "payload.type": "event-invite" }] },
          { $or: [{ sourceId: EVENT_ID }, { "payload.eventId": EVENT_ID }] }
        ]
      })
      .toArray();
    const invitedUserIds = [...new Set(inviteMembers.map(member => text(member.userId)).filter(Boolean))].sort();
    const markerUserIds = [...new Set(markerDocuments.flatMap(marker => marker.userIds || []).map(text).filter(Boolean))].sort();
    const outboxUserIds = [...new Set(outboxDocuments.flatMap(item => item.recipientUserIds || []).map(text).filter(Boolean))].sort();
    const bellUserIds = [...new Set(bellDocuments.map(item => text(item.recipientUserId)).filter(Boolean))].sort();
    const recipientSetsAgree = JSON.stringify(invitedUserIds) === JSON.stringify(markerUserIds)
      && JSON.stringify(invitedUserIds) === JSON.stringify(outboxUserIds)
      && JSON.stringify(invitedUserIds) === JSON.stringify(bellUserIds);
    const exactOutcome = invitedUserIds.length === 1
      && markerDocuments.length === 1
      && outboxDocuments.length === 1
      && bellDocuments.length === 1
      && recipientSetsAgree
      && invitedUserIds[0] === state.context.expectedInviteeUserId;
    const rule = ruleSummary();
    const phase = rule.currentStatus === "running"
      ? "scheduler-running"
      : exactOutcome
        ? "scheduler-completed"
        : state.scheduledAtIso
          ? "scheduled-waiting"
          : "baseline-ready";
    printObject({
      scenario: "stat-012",
      database: db.getName(),
      prepared: true,
      phase,
      stagedAtIso: state.stagedAtIso,
      scheduledAtIso: state.scheduledAtIso,
      expectedDueAtIso: state.expectedDueAtIso,
      event: {
        id: EVENT_ID,
        title: "Manual QA STAT-012 scheduled invite",
        creator: displayUser(state.context.creatorUserId),
        expectedInvitee: displayUser(state.context.expectedInviteeUserId)
      },
      rule,
      current: {
        memberCount: members.length,
        invitationCount: invitedUserIds.length,
        markerCount: markerDocuments.length,
        outboxCount: outboxDocuments.length,
        bellCount: bellDocuments.length,
        invitedUsers: invitedUserIds.map(displayUser),
        markerUserIds,
        outboxUserIds,
        bellUserIds
      },
      validation: {
        baselineHasZeroArtifacts: !state.scheduledAtIso
          && invitedUserIds.length === 0
          && markerDocuments.length === 0
          && outboxDocuments.length === 0
          && bellDocuments.length === 0,
        exactlyOneInvitation: invitedUserIds.length === 1,
        exactSingleMarker: markerDocuments.length === 1,
        exactSingleOutbox: outboxDocuments.length === 1,
        exactSingleBell: bellDocuments.length === 1,
        invitedUserWasEligible: invitedUserIds.length === 1
          && invitedUserIds[0] === state.context.expectedInviteeUserId,
        recipientSetsAgree,
        exactOutcome
      },
      next: phase === "baseline-ready"
        ? "Capture UI baselines, then run schedule stat-012."
        : phase === "scheduler-completed"
          ? "Capture Monitoring, Statistics, bell, and Admin Job result screenshots, then reset."
          : "Wait for the persisted schedule and the real scheduler poll; run status again."
    });
  }

  function reset() {
    const state = activeState(true);
    assertRuleNotRunning(PRIMARY_RULE);
    for (const ruleKey of SECONDARY_RULES) assertRuleNotRunning(ruleKey);

    for (const snapshot of state.snapshots || []) {
      collection(snapshot.collection).deleteMany(snapshot.selector);
      if (snapshot.documents && snapshot.documents.length > 0) {
        collection(snapshot.collection).insertMany(snapshot.documents);
      }
    }
    for (const saved of state.secondaryRuleCounters || []) {
      restoreOptionalFields(saved.ruleKey, saved);
    }
    restoreStatsProjection(state.statsProjection);
    for (const saved of state.userActivitySnapshots || []) {
      restoreUserActivities(saved);
    }
    collection(STATE_COLLECTION).deleteOne({ _id: state._id });
    printObject({
      scenario: "stat-012",
      phase: "reset-complete",
      restored: true,
      detail: "Manual event data, isolated affinity edges, Statistics inventory fields, participant activity counters, quarantined rows, primary rule, and secondary pending counters were restored. Legitimate scheduler telemetry/history was not rewound."
    });
  }

  assertDeploymentSafety();
  switch (command) {
    case "stage": stage(); break;
    case "hold": hold(); break;
    case "schedule": schedule(); break;
    case "status": status(); break;
    case "reset": reset(); break;
    default: fail(`unsupported command '${command}'.`);
  }
})();
