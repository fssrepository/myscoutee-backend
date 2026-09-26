/* global ManualQa, process */
(() => {
  "use strict";
  const Q = ManualQa;
  const scenario = "community-group";
  const checkpointId = "GROUP-LIFECYCLE-001";
  Q.assertDeploymentSafety();
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  if (!["status", "verify-lists", "prepare-badges", "prepare-join", "restore-badges",
      "capture", "restore", "verify-savepoint", "prepare-list-pagination", "restore-list-pagination",
      "prepare-member-invitation", "restore-member-invitation", "prepare-admin-lifecycle", "restore-admin-lifecycle",
      "prepare-invitation", "prepare-hidden-invitation", "restore-invitation", "prepare-editor", "restore-editor", "prepare-creation", "restore-creation"].includes(command)
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
  if (command === "prepare-admin-lifecycle") {
    const groupId = "manual-qa-community-admin";
    if (state.adminLifecycleSnapshots || Q.collection("communityGroups").countDocuments({_id: groupId})) Q.fail("Admin lifecycle control already exists.");
    const retained = Q.snapshotSpecs([
      {collection: "communityGroups", selector: {_id: groupId}},
      {collection: "activityMembers", selector: {ownerType: "community", ownerId: groupId}},
      {collection: "users", selector: {$or: [{userId: {$in: actors}}, {workspaceGroupId: groupId}]}},
      {collection: "userNotifications", selector: {sourceType: "community", sourceId: groupId}},
      {collection: "notificationOutbox", selector: {entityType: "community", entityId: groupId}}
    ]);
    const source = Q.collection("communityGroups").findOne({_id: "seed-community-seattle-friends"});
    const memberTemplate = Q.collection("activityMembers").findOne({ownerType: "community", ownerId: source._id, userId: actors[0]});
    const profiles = actors.map((accountId, index) => {
      const base = Q.collection("users").findOne({userId: accountId});
      const id = `f0260926${String(index + 1).padStart(16, "0")}`;
      const personal = Object.fromEntries(["name", "initials", "age", "birthday", "gender", "city", "height", "physique", "languages", "horoscope", "headline", "about", "images", "locationCoordinates", "partitionKey", "profileDetails", "profileStatus", "status", "statusText", "completion", "profileFormVersion"].filter(key => base[key] !== undefined).map(key => [key, base[key]]));
      return {...personal, _id: id, userId: id, syncKey: `manual-qa-admin-profile:${accountId}`,
        accountUserId: accountId, workspaceGroupId: groupId, operator: false};
    });
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {adminLifecycleSnapshots: retained}});
    const now = Q.nowIso();
    Q.collection("communityGroups").insertOne({...source, _id: groupId, name: "QA Admin Transfer", ownerUserId: actors[0],
      visibility: "private", hideMembers: false, lifecycleStatus: "active", ownerReleasedAtIso: null, takeoverCandidates: [],
      pendingMembers: 0, moderationPending: 0, moderationStatus: "accepted", version: 0, createdAtIso: now, updatedAtIso: now});
    Q.collection("activityMembers").insertMany(actors.map((userId, index) => ({...memberTemplate,
      _id: `community:${groupId}:${userId}`, syncKey: `community:${groupId}:${userId}`, ownerId: groupId, userId,
      role: index === 0 ? "Admin" : "Member", status: "accepted", organizerOnly: false,
      managerGrantedByUserId: null, requestKind: null, pendingSource: null, communityUpdates: 0,
      communityAction: null, communityActor: null, actionAtIso: now, updatedDate: now})));
    Q.collection("users").insertMany(profiles);
    Q.printObject({checkpointId, groupId, prepared: true, acceptedMembers: 3, admin: actors[0], rolesTested: false});
    return;
  }
  if (command === "restore-admin-lifecycle") {
    if (!state.adminLifecycleSnapshots) Q.fail("No Admin lifecycle snapshot.");
    Q.restoreSnapshots(state.adminLifecycleSnapshots);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {adminLifecycleSnapshots: ""}});
    Q.printObject({checkpointId, adminLifecycleRestored: true});
    return;
  }
  if (command === "prepare-member-invitation") {
    if (state.memberInvitationSnapshots) Q.fail("Member invitation control already prepared.");
    const groupId = "seed-community-trail-club";
    const rateId = "manual-qa-community-invite-encounter";
    const ratePair = {ownerUserId: actors[1], relatedUserId: actors[0], mode: "single"};
    if (Q.collection("userRates").countDocuments({_id: rateId})
        || Q.collection("activityMembers").countDocuments({ownerType: "community", ownerId: groupId, userId: actors[0]})) {
      Q.fail("Invitation control is not an unrelated actor baseline.");
    }
    const retained = Q.snapshotSpecs([
      {collection: "communityGroups", selector: {_id: groupId}},
      {collection: "activityMembers", selector: {ownerType: "community", ownerId: groupId}},
      {collection: "users", selector: {$or: [{userId: {$in: actors}}, {workspaceGroupId: groupId}]}},
      {collection: "userRates", selector: {$or: [{_id: rateId}, ratePair]}},
      {collection: "userNotifications", selector: {sourceType: "community", sourceId: groupId}},
      {collection: "notificationOutbox", selector: {entityType: "community", entityId: groupId}}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {memberInvitationSnapshots: retained}});
    // A met encounter is the ordinary shared invite-picker prerequisite. The
    // membership and invitation are created only by the subsequent browser flow.
    Q.collection("userRates").updateOne(ratePair, {
      $set: {met: true, eventName: "QA Group invitation prerequisite", createdDate: "2026-09-25T12:00:00Z"},
      $setOnInsert: {_id: rateId, syncKey: rateId}
    }, {upsert: true});
    Q.printObject({checkpointId, groupId, encounterPrepared: true, invitationCreated: false});
    return;
  }
  if (command === "restore-member-invitation") {
    if (!state.memberInvitationSnapshots) Q.fail("No member invitation control snapshot.");
    Q.restoreSnapshots(state.memberInvitationSnapshots);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {memberInvitationSnapshots: ""}});
    Q.printObject({checkpointId, memberInvitationRestored: true});
    return;
  }
  if (command === "prepare-creation") {
    verifyLists();
    if (state.creationSnapshots) Q.fail("Group creation already prepared.");
    if (Q.collection("communityGroups").countDocuments({name: /^QA Group Flow/})) Q.fail("Creation control already exists.");
    const retained = Q.snapshotSpecs([
      {collection: "communityGroups", selector: {ownerUserId: actors[0]}},
      {collection: "activityMembers", selector: {ownerType: "community", userId: actors[0]}},
      {collection: "users", selector: {$or: [{userId: actors[0]}, {accountUserId: actors[0]}]}},
      {collection: "contentModerationItems", selector: {category: "group", ownerUserId: actors[0]}},
      {collection: "contentModerationState", selector: {_id: "global"}}
    ]);
    const unrelatedModeration = Q.collection("contentModerationItems").find({$nor: [{category: "group", ownerUserId: actors[0]}]}).toArray();
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {creationSnapshots: retained, creationUnrelatedModeration: unrelatedModeration}});
    Q.printObject({checkpointId, creationPrepared: true, productWrites: false});
    return;
  }
  if (command === "restore-creation") {
    if (!state.creationSnapshots) Q.fail("No creation snapshot.");
    const prior = state.creationSnapshots.find(s => s.collection === "communityGroups").documents;
    const created = Q.collection("communityGroups").find({ownerUserId: actors[0]}).toArray().filter(g => !prior.some(p => p._id === g._id));
    if (created.some(g => !g.name.startsWith("QA Group Flow"))) Q.fail("Unrelated group created; retain snapshot for review.");
    const ids = created.map(g => g._id);
    if (Q.collection("activityMembers").countDocuments({ownerType: "community", ownerId: {$in: ids}, userId: {$ne: actors[0]}})) Q.fail("Created group has other members; restore their scoped checkpoint first.");
    const unrelated = Q.collection("contentModerationItems").find({$nor: [{category: "group", ownerUserId: actors[0]}]}).toArray();
    if (!Q.sameJson(ordered(unrelated), ordered(state.creationUnrelatedModeration))) Q.fail("Unrelated moderation changed; do not overwrite the global queue snapshot.");
    const globalState = Q.collection("contentModerationState").findOne({_id: "global"});
    if (globalState && globalState.pending && globalState.pending.length) Q.fail("Moderation has pending writes; retain state.");
    Q.restoreSnapshots(state.creationSnapshots);
    Q.restoreSnapshots([
      {collection: "userNotifications", selector: {sourceType: "community", sourceId: {$in: ids}}, documents: []},
      {collection: "notificationOutbox", selector: {entityType: "community", entityId: {$in: ids}}, documents: []},
      {collection: "contentModerationState", selector: {_id: {$in: ids.map(id => "group:" + id)}}, documents: []}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {creationSnapshots: "", creationUnrelatedModeration: ""}});
    verifyLists();
    Q.printObject({checkpointId, creationRestored: true, removedGroupIds: ids});
    return;
  }
  if (command === "prepare-invitation" || command === "prepare-hidden-invitation" || command === "prepare-editor") {
    const snapshotKey = command === "prepare-editor" ? "editorSnapshots" : "invitationSnapshots";
    verifyLists();
    if (state[snapshotKey]) Q.fail("Group mutation regression already prepared.");
    const groupId = command === "prepare-editor" ? "seed-community-design-circle" : "seed-community-game-night";
    const userIds = Q.collection("activityMembers").find({ownerType: "community", ownerId: groupId}).toArray().map(member => member.userId);
    const retained = Q.snapshotSpecs([
      {collection: "communityGroups", selector: {_id: groupId}},
      {collection: "activityMembers", selector: {ownerType: "community", ownerId: groupId}},
      {collection: "users", selector: {$or: [{userId: {$in: userIds}}, {workspaceGroupId: groupId}]}},
      {collection: "userNotifications", selector: {sourceType: "community", sourceId: groupId}},
      {collection: "notificationOutbox", selector: {entityType: "community", entityId: groupId}}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {[snapshotKey]: retained}});
    if (command === "prepare-hidden-invitation") {
      Q.collection("communityGroups").updateOne({_id: groupId}, {$set: {hideMembers: true}});
    }
    Q.printObject({checkpointId, groupId, [snapshotKey]: "prepared", hiddenRoster: command === "prepare-hidden-invitation", productWrites: false});
    return;
  }
  if (command === "restore-invitation" || command === "restore-editor") {
    const snapshotKey = command === "restore-editor" ? "editorSnapshots" : "invitationSnapshots";
    if (!state[snapshotKey]) Q.fail("No group mutation regression snapshot.");
    Q.restoreSnapshots(state[snapshotKey]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {[snapshotKey]: ""}});
    verifyLists();
    Q.printObject({checkpointId, [snapshotKey]: "restored"});
    return;
  }
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
      description: "Temporary block 1 pagination control", version: 0,
      createdAtIso: new Date(Date.UTC(2026, 7, 25 - index)).toISOString(),
      updatedAtIso: new Date(Date.UTC(2026, 8, 1 + index)).toISOString()
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
    const boundaries = {"lists-ready": 1, "block-1-complete": 2, "after-editor-checks": 4, "after-join-approval": 4, "after-invitation-checks": 5};
    if (!Object.hasOwn(boundaries, name)) Q.fail("Unknown Group savepoint boundary.");
    if (state.adminLifecycleSnapshots || state.paginationSnapshots || state.invitationSnapshots || state.memberInvitationSnapshots || state.editorSnapshots || state.creationSnapshots) Q.fail("Restore temporary controls before a savepoint operation.");
    let savepoint = (state.savepoints || []).find(item => item.name === name);
    if (command === "capture") {
      if (savepoint) Q.fail("Savepoint already exists; retained evidence must not be overwritten.");
      if (["after-join-approval", "after-invitation-checks"].includes(name)) {
        const groupId = "seed-community-neighbours";
        const membership = Q.collection("activityMembers").findOne({ownerType: "community", ownerId: groupId, userId: actors[0]});
        const profiles = Q.collection("users").find({accountUserId: actors[0], workspaceGroupId: groupId}).toArray();
        const group = Q.collection("communityGroups").findOne({_id: groupId});
        if (membership?.status !== "accepted" || profiles.length !== 1
            || group?.pendingMembers !== 0
            || Q.collection("activityMembers").countDocuments({ownerType: "community", ownerId: groupId, status: "accepted"}) !== 3) {
          Q.fail("Join approval boundary requires Alex accepted, one workspace profile, three accepted members and no pending request.");
        }
      } else verifyLists();
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
    invitationPrepared: !!state.invitationSnapshots,
    memberInvitationPrepared: !!state.memberInvitationSnapshots,
    editorPrepared: !!state.editorSnapshots,
    creationPrepared: !!state.creationSnapshots,
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
