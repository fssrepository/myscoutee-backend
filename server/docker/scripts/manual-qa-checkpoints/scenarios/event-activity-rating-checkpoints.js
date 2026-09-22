/* global ManualQa, process, ObjectId */
(() => {
  "use strict";
  const Q = ManualQa;
  const scenario = "event-rating";
  const checkpointId = "EVENT-ACTIVITY-RATING-001";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const selected = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID) || "all";
  const users = ["6a00000000000000000000a1", "6a00000000000000000000a2"];
  const formats = ["standard", "tournament", "speed-meeting"];
  const eventIds = formats.map(format => `qa-rating-001-${format}`);
  const states = Q.collection(Q.STATE_COLLECTION);
  const inUsers = {$in: users};
  const inEvents = {$in: eventIds};
  const pairSelector = {$or: [{ownerUserId: inUsers}, {relatedUserId: inUsers}, {secondaryRelatedUserId: inUsers}]};
  const specs = [
    {collection: "users", selector: {userId: inUsers}},
    {collection: "events", selector: {sourceId: inEvents}},
    {collection: "activityMembers", selector: {ownerId: inEvents}},
    {collection: "activityMingleSessions", selector: {eventId: inEvents}},
    {collection: "activityMingleRounds", selector: {eventId: inEvents}},
    {collection: "activitySubEventStageRuntime", selector: {ownerId: inEvents}},
    {collection: "eventFeedbackStates", selector: {eventId: inEvents}},
    {collection: "eventFeedbackAnswers", selector: {eventId: inEvents}},
    {collection: "userRates", selector: pairSelector},
    {collection: "userFriendships", selector: {$or: [{leftUserId: inUsers}, {rightUserId: inUsers}]}},
    {collection: "userAffinityEdges", selector: {$or: [{leftUserId: inUsers}, {rightUserId: inUsers}]}},
    {collection: "affinityRecomputeTasks", selector: {targetId: inUsers}},
    {collection: "userNotifications", selector: {$or: [{recipientUserId: inUsers}, {senderUserId: inUsers}]}},
    {collection: "notificationOutbox", selector: {$or: [{recipientUserId: inUsers}, {"payload.senderUserId": inUsers}]}},
    {collection: "userSessionStates", selector: {_id: inUsers}},
    {collection: "userSessionActions", selector: {userId: inUsers}},
    {collection: "userPageFilterPreferences", selector: {userId: inUsers}}
  ];
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== checkpointId) Q.fail("Wrong checkpoint.");

  function restoreTiming(state) {
    if (!state.timingRestored) {
      Q.collection("notificationRuleConfigs").updateOne({_id: state.ruleId}, {$set: state.ruleFields});
      states.updateOne({_id: state._id}, {$set: {timingRestored: true}});
    }
  }
  function status() {
    const state = Q.activeState(scenario);
    if (!state) return Q.printObject({checkpointId, phase: "not-staged"});
    Q.printObject({checkpointId, phase: state.phase, selectedFormat: state.selectedFormat,
      users: users.map(id => Q.user(id)), priorRate: state.priorRate || null,
      events: Q.collection("events").find({sourceId: inEvents}, {_id: 0, sourceId: 1, title: 1, mode: 1, friendshipsProjected: 1, endAtIso: 1}).toArray(),
      rounds: Q.collection("activityMingleRounds").find({eventId: inEvents}, {_id: 0, roundNumber: 1, status: 1, meetingsProjected: 1}).toArray(),
      rates: Q.collection("userRates").find(pairSelector, {_id: 1, syncKey: 1, createdDate: 1, ownerUserId: 1, relatedUserId: 1, met: 1, metEventId: 1, eventName: 1, scoreGiven: 1, scoreReceived: 1}).toArray(),
      friendships: Q.collection("userFriendships").countDocuments(specs.find(s => s.collection === "userFriendships").selector),
      feedbackAnswers: Q.collection("eventFeedbackAnswers").countDocuments({eventId: inEvents}),
      timingRestored: state.timingRestored === true, baselineCaptured: !!state.baseline});
  }
  function stage() {
    if (!(["all", ...formats].includes(selected))) Q.fail("Use all, standard, tournament or speed-meeting.");
    Q.assertNotStaged(scenario);
    const snapshots = Q.snapshotSpecs(specs);
    if (snapshots.some(s => s.documents.length)) Q.fail("Reserved fixture identities already exist; refusing to overwrite them.");
    const rule = Q.assertRuleNotRunning("event-counter-expiry");
    if (!rule.enabled) Q.fail("Existing event-counter-expiry worker must be enabled.");
    const state = {_id: Q.stateId(scenario), scenario, checkpointId, selectedFormat: selected,
      phase: "staging", stagedAtIso: Q.nowIso(), snapshots, ruleId: rule._id,
      ruleFields: {timing: rule.timing, scheduleSlots: rule.scheduleSlots, updatedDate: rule.updatedDate, updatedUser: rule.updatedUser}};
    states.insertOne(state);
    try {
      const profileFields = ["age", "birthday", "city", "height", "physique", "languages", "horoscope", "gender", "hostTier", "completion", "profileFormVersion", "locationCoordinates", "partitionKey", "images", "profileDetails"];
      users.forEach((userId, index) => {
        const source = Q.ensureUser(index === 0 ? "650000000000000000000061" : "650000000000000000000062");
        const user = {_id: ObjectId(userId), userId, syncKey: `a7000000-0000-4000-8000-00000000000${index + 1}`,
          name: index === 0 ? "Casey Rating QA" : "Nova Rating QA", email: `rating-qa-${index}@demo.myscoutee.test`,
          initials: index === 0 ? "CQ" : "NQ", profileStatus: "friends only", activities: {}, devices: [],
          homeGameRatedUserIds: [], homeGameRatedPairKeys: [], homeGameRateProjectionVersion: 1,
          about: "Isolated two-person Event activity rating fixture.", headline: "Event rating QA"};
        for (const field of profileFields) if (source[field] !== undefined) user[field] = source[field];
        Q.collection("users").insertOne(user);
      });
      const now = Date.now();
      const stamp = hours => new Date(now + hours * 3600000).toISOString();
      // Standard/Tournament participants already have a rating relationship.
      // Seed only that prior input; the real worker must preserve it and add Met.
      if (selected !== "speed-meeting") {
        const priorRate = {_id: "qa-rating-001-existing-rate", syncKey: "qa-rating-001-existing-rate",
          mode: "single", ownerUserId: users[0], relatedUserId: users[1],
          scoreGiven: 9, scoreReceived: 4, mutuallyRated: true, met: false,
          createdDate: stamp(-24), updatedDate: stamp(-24), createdUser: Q.ACTOR, updatedUser: Q.ACTOR};
        Q.collection("userRates").insertOne(priorRate);
        states.updateOne({_id: state._id}, {$set: {priorRate}});
      }
      formats.forEach((format, index) => {
        const active = selected === "all" || selected === format;
        const startAtIso = active ? stamp(-6 + index / 3) : stamp(48);
        const endAtIso = active ? stamp(-5 + index / 3) : stamp(49);
        const id = eventIds[index];
        const stageId = "qa-rating-score-stage";
        Q.collection("events").insertOne({_id: id, syncKey: id, sourceId: id, ownerUserId: users[0],
          creatorUserId: users[0], creatorName: "Casey Rating QA", creatorInitials: "CQ", admins: [users[0]],
          title: `QA RATING · ${format === "speed-meeting" ? "Speed meeting" : format === "tournament" ? "Tournament" : "Standard"}`,
          subtitle: "Two-person reciprocal rating fixture", status: "A", published: true,
          mode: ["Casual", "Tournament", "Mingle"][index], eventType: "main", visibility: "Invitation only", blindMode: "Open Event",
          startAtIso, endAtIso, capacityMin: 2, capacityMax: 2, capacityTotal: 2, full: true,
          acceptedMembers: 2, pendingMembers: 0, acceptedMemberUserIds: users, pendingMemberUserIds: [],
          invitedMemberUserIds: [], pendingRequestMemberUserIds: [], autoInviter: false, ticketing: false,
          approvalRequired: false, topics: [], location: "Austin", locationCoordinates: {latitude: 30.2672, longitude: -97.7431},
          expired: false, friendshipsProjected: false, feedbackCountersProjected: false,
          subEventsEnabled: index === 1, subEvents: [], subEventDefinitions: index === 1 ? [{id: stageId, name: "Rating QA stage", timing: "After", offsetMinutes: 0, durationMinutes: 60, tournamentGroupCapacityMin: 2, tournamentGroupCapacityMax: 2, tournamentLeaderboardType: "Score", tournamentAdvancePerGroup: 1}] : [],
          mingleConfiguration: index === 2 ? {groupSize: 2, plannedRounds: 2, roundDurationMinutes: 10, breakDurationMinutes: 1, requireGenderBalance: false} : null,
          createdDate: startAtIso, createdUser: Q.ACTOR, updatedDate: startAtIso, updatedUser: Q.ACTOR});
        users.forEach((userId, memberIndex) => Q.collection("activityMembers").insertOne({
          _id: `${id}:${userId}`, syncKey: `${id}:${userId}`, ownerType: "event", ownerId: id, userId,
          role: memberIndex === 0 ? "Admin" : "Member", status: "accepted", organizerOnly: false,
          actionAtIso: startAtIso, createdDate: startAtIso, createdUser: Q.ACTOR, updatedDate: startAtIso, updatedUser: Q.ACTOR}));
        if (index === 1) Q.collection("activitySubEventStageRuntime").insertOne({
          _id: `${id}:${stageId}`, syncKey: `${id}:${stageId}`, recordId: `${id}:${stageId}`, ownerId: id,
          subEventId: stageId, status: "A", stageStatus: active ? "F" : "RS", groupsCount: 0,
          stageFinalizedAt: active ? endAtIso : null, stageFinalizedByUserId: active ? users[0] : null,
          stageStatusReason: "fixture-history", createdDate: startAtIso, createdUser: Q.ACTOR});
        if (index === 2 && active) {
          Q.collection("activityMingleSessions").insertOne({_id: id, eventId: id, status: "COMPLETED", currentRoundNumber: 2,
            revision: 4, documentVersion: 0, phaseStartedAtIso: endAtIso, createdAtIso: startAtIso, updatedAtIso: endAtIso,
            createdByUserId: users[0], updatedByUserId: users[0]});
          for (const roundNumber of [1, 2]) Q.collection("activityMingleRounds").insertOne({
            _id: `${id}:round:${roundNumber}`, eventId: id, roundNumber, status: "COMPLETED",
            tables: [{tableNumber: 1, memberUserIds: users}], assignmentCreatedAtIso: startAtIso,
            startedAtIso: startAtIso, completedAtIso: endAtIso, createdByUserId: users[0], meetingsProjected: false});
        }
      });
      // Shorten only the existing worker's schedule; no Met/Friend outcome is seeded.
      Q.collection("notificationRuleConfigs").updateOne({_id: rule._id}, {$set: {
        timing: {...rule.timing, mode: "interval", intervalSeconds: 10, intervalMinutes: null, intervalAmount: 10, intervalUnit: "seconds"}, scheduleSlots: []}});
      states.updateOne({_id: state._id}, {$set: {phase: "awaiting-real-projection"}});
    } catch (error) { Q.restoreSnapshots(snapshots); restoreTiming(state); states.deleteOne({_id: state._id}); throw error; }
    status();
  }
  if (command === "stage") return stage();
  if (command === "status") return status();
  const state = Q.activeState(scenario, true);
  if (command === "ready") {
    const expectedOrdinary = state.selectedFormat === "all" ? 2 : state.selectedFormat === "speed-meeting" ? 0 : 1;
    const expectedRounds = ["all", "speed-meeting"].includes(state.selectedFormat) ? 2 : 0;
    const rates = Q.collection("userRates").find(pairSelector).toArray();
    const prior = state.priorRate;
    const expectedGiven = prior ? prior.scoreGiven : 0;
    const expectedReceived = prior ? prior.scoreReceived : 0;
    const preserved = !prior || (rates.length === 1
        && ["_id", "syncKey", "createdDate", "ownerUserId", "relatedUserId"].every(key => rates[0][key] === prior[key]));
    if (Q.collection("events").countDocuments({sourceId: inEvents, mode: {$ne: "Mingle"}, friendshipsProjected: true}) !== expectedOrdinary
        || Q.collection("activityMingleRounds").countDocuments({eventId: inEvents, meetingsProjected: true}) !== expectedRounds
        || rates.length !== 1 || rates[0].met !== true || Number(rates[0].scoreGiven) !== expectedGiven
        || Number(rates[0].scoreReceived) !== expectedReceived || !preserved
        || Q.collection("userFriendships").countDocuments(specs.find(s => s.collection === "userFriendships").selector) !== (prior ? 1 : 0)) {
      Q.fail("Real meeting projection is not ready or changed the prior rating; inspect status and the existing worker.");
    }
    restoreTiming(state);
    if (!state.baseline) {
      const baselineSpecs = specs.filter(s => !["users", "userSessionStates", "userSessionActions"].includes(s.collection));
      states.updateOne({_id: state._id}, {$set: {phase: "ready-for-manual-rating", baseline: Q.snapshotSpecs(baselineSpecs), readyAtIso: Q.nowIso()}});
    }
    return status();
  }
  if (command === "reset") {
    restoreTiming(state); Q.restoreSnapshots(state.snapshots); states.deleteOne({_id: state._id});
    return status();
  }
  Q.fail(`Unsupported command '${command}'.`);
})();
