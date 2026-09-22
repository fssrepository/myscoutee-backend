/* global ManualQa, process */
(() => {
  "use strict";
  const Q = ManualQa;
  const scenario = "event-mode-regression";
  const ruleKey = "event-tournament-review";
  const states = Q.collection("manualQaCheckpointSnapshots");
  const rules = Q.collection("notificationRuleConfigs");
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const fields = ["timing", "scheduleSlots", "updatedDate", "updatedUser"];
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== "EVENT-MODE-REGRESSION-001") {
    Q.fail("Unexpected event mode checkpoint.");
  }

  // Only participant inputs are staged here. Rounds, assignments and feedback
  // must be produced by the application after this preparation.
  if (["stage-feedback-peers", "reset-feedback-peers"].includes(command)) {
    const eventId = Q.text(process.env.MANUAL_QA_EVENT_ID);
    const stateId = `${Q.stateId(scenario)}:peers:${eventId}`;
    if (!eventId) Q.fail("MANUAL_QA_EVENT_ID is required.");
    if (Q.collection("activityMingleSessions").countDocuments({eventId})
        || Q.collection("activityMingleRounds").countDocuments({eventId})) {
      Q.fail("Peer preparation/reset is only allowed before runtime starts; clean up a used event through the application.");
    }
    if (command === "reset-feedback-peers") {
      const saved = states.findOne({_id: stateId});
      if (!saved) Q.fail("Peer inputs are not staged.");
      Q.restoreSnapshots(saved.snapshots);
      states.deleteOne({_id: stateId});
      Q.printObject({eventId, peerInputsStaged: false});
      return;
    }
    const host = "650000000000000000000061";
    const viewer = "650000000000000000000062";
    const outsider = "650000000000000000000063";
    const peers = ["0216b1ceb256d6f2c89073b8", "0b8e5df4ec85d858c304a350",
      "0c3ab5da9af33d4e688e809c", "0cc9990d08304ab26ee67784",
      "0f9350e50f1ffc3cf002b7ed", "178e8d0cbe164fa3fede5884"];
    const accepted = [host, viewer, ...peers];
    for (const userId of [...accepted, outsider]) Q.ensureUser(userId);
    const event = Q.collection("events").findOne({sourceId: eventId, creatorUserId: host,
      title: {$regex: "^QA MODE "}, mode: "Mingle"});
    if (!event || event.mingleConfiguration?.groupSize !== 8 || event.capacityMax < 9) {
      Q.fail("Use a fresh Casey-owned QA MODE Mingle event with group size 8 and capacity at least 9.");
    }
    if (states.findOne({_id: stateId}) || Q.collection("activityMembers").countDocuments({
      ownerType: "event", ownerId: eventId, userId: {$ne: host}})) {
      Q.fail("Peer inputs require a fresh event with only its organizer membership.");
    }
    const snapshots = Q.snapshotSpecs([
      {collection: "events", selector: {sourceId: eventId}},
      {collection: "activityMembers", selector: {ownerType: "event", ownerId: eventId}}
    ]);
    states.insertOne({_id: stateId, scenario, eventId, scope: "participant-inputs",
      stagedAtIso: Q.nowIso(), snapshots});
    const now = Q.nowIso();
    Q.collection("activityMembers").insertMany([viewer, ...peers, outsider].map(userId => ({
      syncKey: `${stateId}:${userId}`, ownerType: "event", ownerId: eventId,
      userId, role: "Member", status: userId === outsider ? "pending" : "accepted",
      pendingSource: userId === outsider ? "admin" : null,
      requestKind: userId === outsider ? "invite" : null,
      organizerOnly: false, actionAtIso: now,
      createdDate: now, createdUser: Q.ACTOR, updatedDate: now, updatedUser: Q.ACTOR
    })));
    Q.collection("events").updateOne({_id: event._id}, {$set: {
      acceptedMemberUserIds: accepted, acceptedMembers: accepted.length,
      pendingMemberUserIds: [outsider], pendingMembers: 1,
      invitedMemberUserIds: [outsider], pendingRequestMemberUserIds: [], full: false
    }});
    Q.printObject({eventId, peerInputsStaged: true, accepted, pendingOutsider: outsider,
      expectedAttendeePeersForNova: peers, roundsSeeded: 0, feedbackSeeded: 0});
    return;
  }

  function runtimeCheckpoint() {
    const label = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID);
    if (!/^[a-z0-9-]{1,64}$/.test(label)) Q.fail("A lowercase checkpoint label is required.");
    const id = `${Q.stateId(scenario)}:runtime:${label}`;
    if (command === "capture-runtime-checkpoint") {
      if (states.findOne({_id: id})) Q.fail("Checkpoint already exists; use a new label to preserve its evidence.");
      const eventId = Q.text(process.env.MANUAL_QA_EVENT_ID);
      const event = Q.collection("events").findOne({sourceId: eventId,
        creatorUserId: "650000000000000000000061", title: {$regex: "^QA MODE "}});
      if (!eventId || !event) Q.fail("Only an explicit Casey-owned QA MODE event may be captured.");
      const session = Q.collection("activityMingleSessions").findOne({eventId});
      if (session && session.status !== "COMPLETED") Q.fail("Capture meeting history only after completion.");
      const stages = Q.collection("activitySubEventStageRuntime").find({ownerId: eventId}).toArray();
      if (event.mode === "Tournament" && (!stages.length || stages.some(stage => stage.stageStatus !== "SR"))) {
        Q.fail("Capture Tournament at score review, before scoring or finalization.");
      }
      Q.assertRuleNotRunning(ruleKey);
      const prefix = eventId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const owned = {$regex: `^${prefix}(?::|$)`};
      const room = {$regex: `^random-room:${prefix}:`};
      const specs = [
        {collection: "events", selector: {$or: [{sourceId: eventId}, {parentEventId: eventId}, {sourceId: room}]}},
        {collection: "activityMembers", selector: {$or: [{ownerId: owned}, {ownerId: room}]}},
        {collection: "activityEventRuntimeItems", selector: {$or: [{eventId}, {ownerId: owned}]}},
        {collection: "activityResources", selector: {ownerId: owned}},
        {collection: "activitySubEventGroups", selector: {ownerId: owned}},
        {collection: "activitySubEventStageRuntime", selector: {ownerId: owned}},
        {collection: "eventLeaderboardEntries", selector: {eventId}},
        {collection: "activityMingleSessions", selector: {eventId}},
        {collection: "activityMingleRounds", selector: {eventId}}
      ];
      states.insertOne({_id: id, scenario, label, eventId, mode: event.mode,
        capturedAtIso: Q.nowIso(), scope: "event-runtime-and-scores", snapshots: Q.snapshotSpecs(specs)});
    } else {
      const saved = states.findOne({_id: id});
      if (!saved) Q.fail("Runtime checkpoint does not exist.");
      Q.assertRuleNotRunning(ruleKey);
      const current = Q.collection("activityMingleSessions").findOne({eventId: saved.eventId});
      if (current && ["ROUND", "BREAK"].includes(current.status)) Q.fail("Finish or pause the live meeting before restore.");
      // This boundary restores runtime/score work only. External deliveries and
      // account/session/preferences/feedback state are intentionally not rewound.
      Q.restoreSnapshots(saved.snapshots);
      for (const snapshot of saved.snapshots) {
        const actual = Q.collection(snapshot.collection).find(snapshot.selector).toArray();
        const byId = values => values.sort((a, b) => String(a._id).localeCompare(String(b._id)));
        if (!Q.sameJson(byId(actual), byId(snapshot.documents))) Q.fail(`Restore mismatch: ${snapshot.collection}`);
      }
      states.updateOne({_id: id}, {$set: {restoredAtIso: Q.nowIso()}});
    }
    const saved = states.findOne({_id: id});
    Q.printObject({scenario, label, eventId: saved.eventId, scope: saved.scope,
      capturedAtIso: saved.capturedAtIso, restoredAtIso: saved.restoredAtIso ?? null,
      collections: saved.snapshots.map(s => ({name: s.collection, count: s.documents.length}))});
  }

  if (["capture-runtime-checkpoint", "restore-runtime-checkpoint"].includes(command)) {
    runtimeCheckpoint();
    return;
  }
  if (command === "arm-tournament-review") {
    Q.assertNotStaged(scenario);
    const rule = Q.assertRuleNotRunning(ruleKey);
    if (rule.enabled !== true) Q.fail("The existing tournament review job must be enabled.");
    states.insertOne({
      _id: Q.stateId(scenario), scenario, armedAtIso: Q.nowIso(), ruleId: rule._id,
      fields: fields.map(key => ({key, present: Object.prototype.hasOwnProperty.call(rule, key), value: rule[key]})),
      previousLastRunAtIso: rule.runState?.lastRunAtIso ?? null
    });
    const result = rules.updateOne({_id: rule._id, "runState.currentStatus": {$ne: "running"}}, {$set: {
      timing: {...rule.timing, mode: "interval", intervalAmount: 1, intervalUnit: "minutes",
        intervalSeconds: 60, intervalMinutes: 1},
      scheduleSlots: [], updatedDate: Q.nowIso(), updatedUser: Q.ACTOR
    }});
    if (result.matchedCount !== 1) Q.fail("Job began running; restore this fixture before retrying.");
  } else if (command === "reset") {
    const saved = Q.activeState(scenario, true);
    Q.assertRuleNotRunning(ruleKey);
    const set = {}, unset = {};
    for (const field of saved.fields) {
      if (field.present) set[field.key] = field.value;
      else unset[field.key] = "";
    }
    const update = {$set: set};
    if (Object.keys(unset).length) update.$unset = unset;
    const result = rules.updateOne({_id: saved.ruleId, "runState.currentStatus": {$ne: "running"}}, update);
    if (result.matchedCount !== 1) Q.fail("Job began running; retry reset after it finishes.");
    states.deleteOne({_id: saved._id});
  } else if (command !== "status") {
    Q.fail("Use arm-tournament-review, status, reset or a runtime checkpoint command.");
  }
  const rule = Q.requireRule(ruleKey);
  const saved = Q.activeState(scenario, false);
  Q.printObject({scenario, staged: !!saved, intervalSeconds: rule.timing?.intervalSeconds,
    armedAtIso: saved?.armedAtIso ?? null, previousLastRunAtIso: saved?.previousLastRunAtIso ?? null,
    runState: rule.runState});
})();
