/* global ManualQa, process */
(() => {
  "use strict";
  const Q = ManualQa;
  const scenario = "community-group";
  const checkpointId = "GROUP-LIFECYCLE-001";
  Q.assertDeploymentSafety();
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  if (!["status", "verify-lists", "prepare-badges", "prepare-join", "restore-badges"].includes(command)
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
  if (command === "verify-lists") {
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
    Q.printObject({checkpointId, verifiedChecklistBlock: 1, groups: 10, memberships: 27, mutated: false});
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
    alexBaseline: groups.map(group => {
      const member = members.find(m => m.ownerId === group._id && m.userId === actors[0]);
      return { name: group.name, ownerUserId: group.ownerUserId,
        status: member?.status || null, role: member?.role || null,
        requestKind: member?.requestKind || null, visibility: group.visibility };
    })
  });
})();
