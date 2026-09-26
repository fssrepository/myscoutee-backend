/* global ManualQa, process */
(() => {
  "use strict";
  const Q = ManualQa;
  const scenario = "community-group";
  const checkpointId = "GROUP-LIFECYCLE-001";
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_COMMAND) !== "status"
      || Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== checkpointId) {
    Q.fail("Only the retained Group list baseline status is supported here.");
  }
  const state = Q.activeState(scenario, true);
  if (state.checkpointId !== checkpointId || state.phase !== "read-only-lists-ready") {
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
  for (const snapshot of snapshots) {
    if (!Q.sameJson(ordered(snapshot.documents), ordered(Q.collection(snapshot.collection).find(snapshot.selector).toArray()))) {
      Q.fail(`${snapshot.collection} differs from the retained baseline; do not reset or relaunch blindly.`);
    }
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
    readyChecklistBlocks: [1], productWritesPrepared: false,
    groups: groups.length, memberships: members.length, actors: actorState,
    alexBaseline: groups.map(group => {
      const member = members.find(m => m.ownerId === group._id && m.userId === actors[0]);
      return { name: group.name, ownerUserId: group.ownerUserId,
        status: member?.status || null, role: member?.role || null,
        requestKind: member?.requestKind || null, visibility: group.visibility };
    })
  });
})();
