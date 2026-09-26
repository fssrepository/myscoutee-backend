/* global ManualQa, process */
(() => {
  "use strict";
  const Q = ManualQa;
  const scenario = "community-group";
  const checkpointId = "GROUP-LIFECYCLE-001";
  Q.assertDeploymentSafety();
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  if (!["status", "verify-lists", "prepare-badges", "prepare-join", "restore-badges",
      "capture", "restore", "verify-savepoint", "prepare-list-pagination", "restore-list-pagination"].includes(command)
      || Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== checkpointId) {
    Q.fail("Only the retained Group list baseline status is supported here.");
  }
  const state = Q.activeState(scenario, true);
  if (state.checkpointId !== checkpointId || !["read-only-lists-ready", "badge-writes-ready"].includes(state.phase)) {
    Q.fail("The retained Group list baseline does not match this checkpoint.");
  }
  const actors = [
    "af0436815ab38f4864dd1e24",
    "9f3b3f085e23af6c89dbc432",
    "1b1c70be2349b3359a8f6f94"
  ];
  if (!Q.sameJson(state.actors, actors)) Q.fail("Group baseline actors differ.");
  const ordered = documents => [...documents].sort((a, b) => Q.text(a._id).localeCompare(Q.text(b._id)));
  const snapshots = state.snapshots || [];
  if (snapshots.length !== 2
      || !snapshots.some(s => s.collection === "communityGroups" && s.documents.length === 10)
      || !snapshots.some(s => s.collection === "activityMembers" && s.documents.length === 27)) {
    Q.fail("Expected the retained ten-group, 27-membership baseline.");
  }
  if (state.phase === "read-only-lists-ready") for (const snapshot of snapshots) {
    if (!Q.sameJson(ordered(snapshot.documents), ordered(Q.collection(snapshot.collection).find(snapshot.selector).toArray()))) {
      Q.fail(`${snapshot.collection} differs from the retained baseline; do not reset or relaunch blindly.`);
    }
  }
  function verifyLists() {
    const retainedMembers = snapshots.find(s => s.collection === "activityMembers").documents;
    for (const snapshot of snapshots) {
      const expected = snapshot.collection === "communityGroups" ? snapshot.documents.map(group => ({
        ...group, pendingMembers: group.pendingMembers ?? retainedMembers.filter(member =>
          member.ownerType === "community" && member.ownerId === group._id && member.status === "pending").length
      })) : snapshot.documents;
      const actual = Q.collection(snapshot.collection).find(snapshot.selector).toArray();
      const differences = expected.flatMap(before => {
          const after = actual.find(row => Q.text(row._id) === Q.text(before._id));
          if (!after) return [{id: before._id, missing: true}];
          const fields = [...new Set([...Object.keys(before), ...Object.keys(after)])]
            .filter(key => Object.hasOwn(before, key) !== Object.hasOwn(after, key) || !Q.sameJson(before[key], after[key]));
          return fields.length ? [{id: before._id, fields}] : [];
      });
      const extraIds = actual.filter(row => !expected.some(before => Q.text(before._id) === Q.text(row._id))).map(row => row._id);
      // Compare fields by ID: adding the counter changes BSON field order, not the fixture state.
      if (differences.length || extraIds.length || actual.length !== expected.length) {
        Q.printObject({collection: snapshot.collection, differences, extraIds});
        Q.fail(`${snapshot.collection} differs from block 1; retain state and diagnose before restarting QA.`);
      }
    }
  }
  const paginationIds = Array.from({length: 24}, (_, index) => `manual-qa-community-page-${String(index + 1).padStart(2, "0")}`);
  const paginationOwnerIds = paginationIds.map((_, index) => `f026092600000000000000${String(index + 1).padStart(2, "0")}`);
  const paginationDistances = [0, 3.2, 4.9, 5, 5.1, 9.9, 10, 10.1];
  if (command === "prepare-list-pagination") {
    verifyLists();
    if (state.paginationSnapshots) Q.fail("Pagination fixture already prepared.");
    const specs = [
      {collection: "communityGroups", selector: {_id: {$in: paginationIds}}},
      {collection: "users", selector: {userId: {$in: paginationOwnerIds}}},
      {collection: "activityMembers", selector: {ownerType: "community", ownerId: {$in: paginationIds}}}
    ];
    const retained = Q.snapshotSpecs(specs);
    if (retained.some(snapshot => snapshot.documents.length)) Q.fail("Pagination fixture IDs already exist.");
    const template = Q.collection("communityGroups").findOne({_id: "seed-community-trail-club"});
    const memberTemplate = Q.collection("activityMembers").findOne({ownerType: "community", ownerId: template._id, userId: template.ownerUserId});
    const origin = Q.ensureUser(actors[0]).locationCoordinates;
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {paginationSnapshots: retained}});
    // Distinct fixture-only owners place groups at real coordinates relative to
    // Alex. Do not move the three actors or override a product distance result.
    Q.collection("users").insertMany(paginationOwnerIds.map((userId, index) => ({
      _id: userId, userId, name: `QA owner ${index + 1}`, initials: "QA", city: "Budapest",
      profileStatus: "public", locationCoordinates: {
        latitude: origin.latitude + (paginationDistances[index % paginationDistances.length] / 6371) * 180 / Math.PI,
        longitude: origin.longitude
      }
    })));
    Q.collection("communityGroups").insertMany(paginationIds.map((id, index) => ({...template,
      _id: id, ownerUserId: paginationOwnerIds[index], name: `QA page ${String(index + 1).padStart(2, "0")}`, pendingMembers: 0,
      description: "Temporary block 1 pagination control", version: 0
    })));
    Q.collection("activityMembers").insertMany(paginationIds.map((ownerId, index) => ({...memberTemplate,
      _id: `${ownerId}:owner`, syncKey: `community:${ownerId}:${paginationOwnerIds[index]}`,
      ownerId, userId: paginationOwnerIds[index], communityUpdates: 0
    })));
    Q.printObject({checkpointId, paginationGroups: paginationIds.length, actor: actors[0], expectedExploreTotal: 27,
      distancesKm: paginationDistances, expectedHeaders: ["0 km", "5 km", "10 km"]});
    return;
  }
  if (command === "restore-list-pagination") {
    if (!state.paginationSnapshots) Q.fail("No pagination fixture to restore.");
    Q.restoreSnapshots(state.paginationSnapshots);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {paginationSnapshots: ""}});
    verifyLists();
    Q.printObject({checkpointId, paginationRestored: true});
    return;
  }
  if (["capture", "restore", "verify-savepoint"].includes(command)) {
    const name = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID);
    // Add later boundaries only with their prepared selectors and checklist oracle.
    const boundaries = {"lists-ready": 1, "block-1-complete": 2};
    if (!Object.hasOwn(boundaries, name)) Q.fail("Unknown Group savepoint boundary.");
    if (state.paginationSnapshots) Q.fail("Restore the temporary pagination controls before a savepoint operation.");
    let savepoint = (state.savepoints || []).find(item => item.name === name);
    if (command === "capture") {
      if (savepoint) Q.fail("Savepoint already exists; retained evidence must not be overwritten.");
      verifyLists();
      savepoint = {name, capturedAtIso: Q.nowIso(), adapter: "http", resumeBlock: boundaries[name],
        phase: state.phase, joinPrepared: state.joinPrepared === true,
        snapshots: Q.snapshotSpecs([...snapshots, ...(state.badgeSnapshots || [])]),
        evidence: "guides/qa/evidence/GROUP-LIFECYCLE-001-20260926.md"};
      Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$push: {savepoints: savepoint}});
    } else {
      if (!savepoint) Q.fail("Savepoint has not been captured.");
      if (command === "restore") {
        // Same scoped snapshot/restore mechanism as Asset checkout savepoints.
        // Browser startup must subsequently use the versioned session launcher.
        Q.restoreSnapshots(savepoint.snapshots);
        Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {
          phase: savepoint.phase, joinPrepared: savepoint.joinPrepared,
          resumedFrom: name, resumeBlock: savepoint.resumeBlock, resumedAtIso: Q.nowIso()
        }});
      }
      for (const snapshot of savepoint.snapshots) {
        const current = ordered(Q.collection(snapshot.collection).find(snapshot.selector).toArray());
        if (!Q.sameJson(ordered(snapshot.documents), current)) Q.fail(`${snapshot.collection} differs from savepoint ${name}.`);
      }
    }
    Q.printObject({checkpointId, command, savepoint: name, capturedAtIso: savepoint.capturedAtIso,
      resumeBlock: savepoint.resumeBlock, adapter: savepoint.adapter,
      note: "Saved fixture state is not a QA PASS; UI evidence and mode status remain in the evidence log and ledger."});
    return;
  }
  if (command === "verify-lists") {
    verifyLists();
    Q.printObject({checkpointId, baselineForChecklistBlock: 1, groups: 10, memberships: 27, mutated: false});
    return;
  }
  if (command === "prepare-badges") {
    if (state.phase !== "read-only-lists-ready") Q.fail("Badge writes already prepared; do not overwrite snapshots.");
    const groupId = "seed-community-seattle-friends";
    const additional = Q.snapshotSpecs([
      {collection: "users", selector: {$or: [{userId: {$in: actors}}, {workspaceGroupId: groupId}]}},
      {collection: "userNotifications", selector: {sourceType: "community", sourceId: groupId}},
      {collection: "notificationOutbox", selector: {entityType: "community", entityId: groupId}}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {
      phase: "badge-writes-ready", badgeSnapshots: additional, badgePreparedAtIso: Q.nowIso()
    }});
    for (const group of Q.collection("communityGroups").find({_id: {$in: snapshots.find(s => s.collection === "communityGroups").documents.map(g => g._id)}})) {
      const pendingMembers = Q.collection("activityMembers").countDocuments({ownerType: "community", ownerId: group._id, status: "pending"});
      Q.collection("communityGroups").updateOne({_id: group._id}, {$set: {pendingMembers}});
    }
    Q.printObject({checkpointId, phase: "badge-writes-ready", readyChecklistBlocks: [1, "6.1"], groupId,
      note: "Exact membership/group, actor/profile and community notification snapshots retained before product writes."});
    return;
  }
  if (command === "prepare-join") {
    if (state.phase !== "badge-writes-ready" || state.joinPrepared) Q.fail("Join baseline already prepared or badge baseline missing.");
    const groupId = "seed-community-neighbours";
    const additional = Q.snapshotSpecs([
      {collection: "users", selector: {workspaceGroupId: groupId}},
      {collection: "userNotifications", selector: {sourceType: "community", sourceId: groupId}},
      {collection: "notificationOutbox", selector: {entityType: "community", entityId: groupId}}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$push: {badgeSnapshots: {$each: additional}}, $set: {joinPrepared: true}});
    Q.printObject({checkpointId, groupId, joinPrepared: true}); return;
  }
  if (command === "restore-badges") {
    if (state.phase !== "badge-writes-ready") Q.fail("No badge-write snapshots to restore.");
    Q.restoreSnapshots(state.badgeSnapshots);
    const retainedMembers = snapshots.find(s => s.collection === "activityMembers").documents;
    const restoredSnapshots = snapshots.map(snapshot => snapshot.collection === "communityGroups"
      ? {...snapshot, documents: snapshot.documents.map(group => ({...group,
        pendingMembers: group.pendingMembers ?? retainedMembers.filter(member =>
          member.ownerType === "community" && member.ownerId === group._id && member.status === "pending").length}))}
      : snapshot);
    Q.restoreSnapshots(restoredSnapshots);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {
      phase: "read-only-lists-ready", snapshots: restoredSnapshots,
      preCounterSnapshots: state.preCounterSnapshots || snapshots
    }, $unset: {badgeSnapshots: "", badgePreparedAtIso: "", joinPrepared: ""}});
    Q.printObject({checkpointId, phase: "read-only-lists-ready", restored: true});
    return;
  }
  const actorState = actors.map(id => {
    const user = Q.ensureUser(id);
    const coordinates = user.locationCoordinates;
    if (!coordinates || !Number.isFinite(coordinates.latitude) || !Number.isFinite(coordinates.longitude)) {
      Q.fail(`${id} has no stored coordinates.`);
    }
    const country = Q.collection("countryPartitions").findOne({ geometry: {
      $geoIntersects: { $geometry: { type: "Point", coordinates: [coordinates.longitude, coordinates.latitude] } }
    } }, { partitionKey: 1 });
    if (!country) Q.fail(`${id} has no eligible stored coordinate; fix the baseline before launching.`);
    return { userId: id, name: user.name, coordinates };
  });
  const groups = snapshots.find(s => s.collection === "communityGroups").documents;
  const members = snapshots.find(s => s.collection === "activityMembers").documents;
  Q.printObject({
    checkpointId, phase: state.phase,
    // The earlier marker's [1,2] meant two list steps, now together in block 1.
    readyChecklistBlocks: state.phase === "badge-writes-ready" ? [1, "6.1"] : [1], productWritesPrepared: state.phase === "badge-writes-ready",
    groups: groups.length, memberships: members.length, actors: actorState,
    paginationPrepared: !!state.paginationSnapshots,
    savepoints: (state.savepoints || []).map(({name, capturedAtIso, resumeBlock, adapter}) => ({name, capturedAtIso, resumeBlock, adapter})),
    resumedFrom: state.resumedFrom || null,
    alexBaseline: groups.map(group => {
      const member = members.find(m => m.ownerId === group._id && m.userId === actors[0]);
      return { name: group.name, ownerUserId: group.ownerUserId,
        status: member?.status || null, role: member?.role || null,
        requestKind: member?.requestKind || null, visibility: group.visibility };
    })
  });
})();
