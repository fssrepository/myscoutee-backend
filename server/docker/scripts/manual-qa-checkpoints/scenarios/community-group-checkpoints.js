/* global ManualQa, process */
(() => {
  "use strict";
  const Q = ManualQa;
  const scenario = "community-group";
  const checkpointId = "GROUP-LIFECYCLE-001";
  Q.assertDeploymentSafety();
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  if (!["status", "prepare-tools", "prepare-tools-explore", "inspect-tools", "restore-tools", "verify-lists", "inspect-location-control", "prepare-location-control", "prepare-tracking-control", "prepare-location-invitation", "set-location-control-invalid", "restore-location-control", "prepare-badges", "prepare-join", "restore-badges", "prepare-contact-request-pages",
      "capture", "restore", "verify-savepoint", "prepare-contacts", "prepare-contact-invitees", "restore-contacts", "prepare-chat-sharing", "prepare-chat-sharing-context", "restore-chat-sharing", "prepare-cash-history", "prepare-cash-checkout", "prepare-cash-payment-methods", "restore-cash-history", "prepare-sharing", "prepare-menu-checkout", "prepare-group-asset-payment", "inspect-group-asset-payment", "prepare-sharing-group-event", "repair-sharing-identifiers", "reset-sharing-failed-event-claim", "prepare-sharing-attribution", "track-sharing-registration", "sharing-registrants", "restore-sharing", "prepare-list-pagination", "restore-list-pagination",
      "prepare-member-invitation", "restore-member-invitation", "prepare-admin-lifecycle", "prepare-admin-moderation", "prepare-admin-feed-event", "prepare-admin-previews", "prepare-admin-base-chat-read", "prepare-admin-base-chat-message", "prepare-admin-base-feed", "restore-admin-lifecycle",
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
  if (["inspect-location-control", "prepare-location-control", "prepare-tracking-control", "prepare-location-invitation", "set-location-control-invalid", "restore-location-control"].includes(command)) {
    const userId = "b0971e779dbdb71f9327eabb";
    const groupId = "seed-community-design-circle";
    const participantId = "qa-group-entry-19-zoe";
    const keyName = "Client 3"; // The English UI names the next key after the two retained keys.
    const users = Q.collection("users");
    const control = users.findOne({userId});
    if (!control || control.name !== "Zoe Turner" || control.accountUserId || control.workspaceGroupId) {
      Q.fail("The isolated seeded location control differs.");
    }
    if (command === "inspect-location-control") {
      Q.printObject({checkpointId, userId, name: control.name,
        coordinates: control.locationCoordinates ?? null,
        partitionKey: control.partitionKey ?? null,
        activeSessions: control.activeSessions?.length ?? 0,
        prepared: Boolean(state.locationControlSnapshot),
        invitation: state.locationInvitationSnapshots ? {
          groupId, participantId,
          claimed: Q.collection("integrationParticipantInvites").findOne({ownerUserId: actors[0], eventId: groupId, participantId})?.claimedUserId ?? null,
          mappings: Q.collection("integrationExternalIds").countDocuments({ownerUserId: actors[0], resourceType: "participant", externalId: participantId}),
          memberships: Q.collection("activityMembers").find({ownerType: "community", ownerId: groupId, userId}).toArray().map(m => ({status: m.status, role: m.role})),
          profiles: users.find({workspaceGroupId: groupId, accountUserId: userId}).toArray().map(p => ({userId: p.userId, coordinates: p.locationCoordinates ?? null})),
          activeWorkspaceGroupId: control.activeWorkspaceGroupId ?? null
        } : null});
      return;
    }
    if (["prepare-location-control", "prepare-tracking-control"].includes(command)) {
      if (state.locationControlSnapshot || (control.activeSessions?.length ?? 0) !== 0
          || !Number.isFinite(control.locationCoordinates?.latitude)
          || !Number.isFinite(control.locationCoordinates?.longitude)) {
        Q.fail("Location control is not at its unused, eligible baseline.");
      }
      const snapshot = Q.snapshotSpecs([{collection: "users", selector: {userId}}]);
      Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {
        locationControlSnapshot: snapshot, locationControlPhase: command === "prepare-tracking-control" ? "tracking" : "missing", resumeBlock: command === "prepare-tracking-control" ? 20 : 19
      }});
      if (command === "prepare-location-control") users.updateOne({userId}, {$unset: {locationCoordinates: ""}});
      Q.printObject({checkpointId, userId, phase: command === "prepare-tracking-control" ? "tracking" : "missing", snapshotCount: snapshot[0].documents.length});
      return;
    }
    if (!state.locationControlSnapshot?.length) Q.fail("No location-control snapshot is retained.");
    if (command === "prepare-location-invitation") {
      const group = Q.collection("communityGroups").findOne({_id: groupId});
      const memberSelector = {ownerType: "community", ownerId: groupId};
      const members = Q.collection("activityMembers").find(memberSelector).toArray();
      if (state.locationInvitationSnapshots || state.locationControlPhase !== "missing" || control.locationCoordinates
          || group?.visibility !== "invitation" || group.ownerUserId !== actors[0]
          || !members.some(m => m.userId === actors[0] && m.role === "Admin" && m.status === "accepted")
          || members.some(m => m.userId === userId)
          || users.countDocuments({workspaceGroupId: groupId, accountUserId: userId})
          || Q.collection("integrationTokens").countDocuments({ownerUserId: actors[0], name: keyName})
          || Q.collection("integrationParticipantInvites").countDocuments({ownerUserId: actors[0], eventId: groupId, participantId})
          || Q.collection("integrationExternalIds").countDocuments({ownerUserId: actors[0], resourceType: "participant", externalId: participantId})) {
        Q.fail("The isolated missing-location invitation baseline differs.");
      }
      const memberIds = [...new Set(members.map(m => m.userId))];
      const snapshots = Q.snapshotSpecs([
        {collection: "users", selector: {$or: [{userId: {$in: memberIds}}, {workspaceGroupId: groupId}]}},
        {collection: "communityGroups", selector: {_id: groupId}},
        {collection: "activityMembers", selector: memberSelector},
        {collection: "integrationTokens", selector: {ownerUserId: actors[0], name: keyName}},
        {collection: "integrationParticipantInvites", selector: {ownerUserId: actors[0], eventId: groupId, participantId}},
        {collection: "integrationExternalIds", selector: {ownerUserId: actors[0], resourceType: "participant", externalId: participantId}},
        {collection: "userNotifications", selector: {sourceId: groupId}},
        {collection: "notificationOutbox", selector: {entityId: groupId}}
      ]);
      Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {locationInvitationSnapshots: snapshots}});
      Q.printObject({checkpointId, groupId, userId, participantId, keyName, prepared: true, claimOrMembershipSeeded: false});
      return;
    }
    if (command === "set-location-control-invalid") {
      if (state.locationControlPhase !== "missing"
          || control.locationCoordinates?.latitude !== 47.4979
          || control.locationCoordinates?.longitude !== 19.0402) {
        Q.fail("Complete the missing-coordinate accepted retry before the invalid control.");
      }
      users.updateOne({userId}, {$set: {locationCoordinates: {latitude: 999, longitude: 999}}});
      Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {locationControlPhase: "invalid"}});
      Q.printObject({checkpointId, userId, phase: "invalid"});
      return;
    }
    if (state.locationInvitationSnapshots) {
      Q.restoreSnapshots(state.locationInvitationSnapshots);
      const ordered = rows => [...rows].sort((a, b) => Q.text(a._id).localeCompare(Q.text(b._id)));
      for (const snapshot of state.locationInvitationSnapshots) {
        if (!Q.sameJson(ordered(snapshot.documents), ordered(Q.collection(snapshot.collection).find(snapshot.selector).toArray()))) {
          Q.fail(`${snapshot.collection} location invitation restoration differs; retain snapshots.`);
        }
      }
    }
    Q.restoreSnapshots(state.locationControlSnapshot);
    const restored = users.findOne({userId});
    if (!Q.sameJson(state.locationControlSnapshot[0].documents[0], restored)) {
      Q.fail("Location control differs from its retained snapshot after restore.");
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {
      locationControlSnapshot: "", locationControlPhase: "", locationInvitationSnapshots: ""
    }});
    Q.printObject({checkpointId, userId, restored: true});
    return;
  }
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
  function verifyLists(baseline = snapshots) {
    const retainedMembers = baseline.find(s => s.collection === "activityMembers").documents;
    for (const snapshot of baseline) {
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
        Q.fail(`${snapshot.collection} differs from the selected retained list boundary; retain state and diagnose before restarting QA.`);
      }
    }
  }
  const sharingEventId = "f02709270000000000000081";
  const sharingAssetId = "f02709270000000000000082";
  const sharingGroupId = "seed-community-design-circle";
  if (command === "prepare-chat-sharing") {
    if (state.sharingSnapshots || state.chatSharingSnapshots) Q.fail("Restore prior sharing controls before preparing the chat boundary.");
    const chatId = "1ba26e819a02104398ea0799";
    const owners = Q.collection("chats").distinct("ownerUserId", {id: chatId});
    if (!owners.includes(actors[0]) || !owners.includes(actors[2])) Q.fail("Both existing chat actors are required.");
    const related = {$or: [{sourceId: chatId}, {entityId: chatId}, {"payload.chatId": chatId}]};
    const retained = Q.snapshotSpecs([
      {collection: "chats", selector: {id: chatId}},
      {collection: "chatMessages", selector: {chatId}},
      {collection: "users", selector: {userId: {$in: owners}}},
      {collection: "userNotifications", selector: related},
      {collection: "notificationOutbox", selector: related},
      {collection: "shareTokens", selector: {ownerUserId: {$in: [actors[0], actors[2]]}}}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {
      chatSharingSnapshots: retained, chatSharingChatId: chatId, resumeBlock: 9
    }});
    Q.printObject({checkpointId, chatId, prepared: true, productWrites: false});
    return;
  }
  if (command === "prepare-chat-sharing-context") {
    if (!state.chatSharingSnapshots) Q.fail("Prepare the chat-sharing boundary first.");
    const chatId = "f6fb610ec35ba384162acc98";
    const existingUserIds = state.chatSharingSnapshots.filter(snapshot => snapshot.collection === "users")
      .flatMap(snapshot => snapshot.documents.map(user => user.userId));
    const profileIds = Q.collection("users").distinct("userId", {
      accountUserId: {$in: [actors[0], actors[2]]}, userId: {$nin: existingUserIds}
    });
    if (profileIds.length) {
      const profiles = Q.snapshotSpecs([{collection: "users", selector: {userId: {$in: profileIds}}}]);
      Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$push: {chatSharingSnapshots: {$each: profiles}}});
    }
    if (state.chatSharingSnapshots.some(snapshot => snapshot.collection === "chats" && snapshot.selector.id === chatId)) {
      Q.printObject({checkpointId, chatId, alreadyCaptured: true, productWrites: false});
      return;
    }
    const owners = Q.collection("chats").distinct("ownerUserId", {id: chatId});
    if (!owners.includes(actors[0])) Q.fail("The alternate chat must already belong to the producer.");
    const capturedUsers = new Set(state.chatSharingSnapshots.filter(snapshot => snapshot.collection === "users")
      .flatMap(snapshot => snapshot.documents.map(user => user.userId)));
    const related = {$or: [{sourceId: chatId}, {entityId: chatId}, {"payload.chatId": chatId}]};
    const retained = Q.snapshotSpecs([
      {collection: "chats", selector: {id: chatId}},
      {collection: "chatMessages", selector: {chatId}},
      {collection: "users", selector: {userId: {$in: owners.filter(owner => !capturedUsers.has(owner))}}},
      {collection: "userNotifications", selector: related},
      {collection: "notificationOutbox", selector: related}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$push: {chatSharingSnapshots: {$each: retained}}});
    Q.printObject({checkpointId, chatId, captured: true, productWrites: false});
    return;
  }
  if (command === "restore-chat-sharing") {
    if (!state.chatSharingSnapshots) Q.fail("No chat sharing boundary to restore.");
    // Asset share tokens carry the asset owner, not necessarily either chat actor.
    // Recover only tokens proven to belong to a newly persisted share command;
    // retained baseline messages/tokens are never part of this derived cleanup.
    const retained = [...state.chatSharingSnapshots];
    const messagesSnapshot = retained.find(snapshot => snapshot.collection === "chatMessages"
      && snapshot.selector.chatId === state.chatSharingChatId);
    if (!messagesSnapshot) Q.fail("Missing original chat-message baseline.");
    const originalMessageIds = new Set(messagesSnapshot.documents.map(message => Q.text(message._id)));
    const tokenSnapshots = retained.filter(snapshot => snapshot.collection === "shareTokens");
    const capturedTokenOwners = new Set(tokenSnapshots.flatMap(snapshot => snapshot.selector.ownerUserId?.$in || []));
    const cleanupTokenIds = [];
    for (const message of Q.collection("chatMessages").find({chatId: state.chatSharingChatId}).toArray()) {
      if (originalMessageIds.has(Q.text(message._id))) continue;
      const match = /^share:[^:]+:(event|asset):([^:]+)$/.exec(Q.text(message.clientId));
      if (!match) continue;
      if (!actors.includes(message.senderAvatar?.id)) Q.fail("Unexpected share author at cleanup boundary.");
      const sentAt = Date.parse(message.sentAtIso);
      if (!Number.isFinite(sentAt)) Q.fail("Missing share send time at cleanup boundary.");
      const tokens = Q.collection("shareTokens").find({kind: match[1], entityId: match[2]}).toArray()
        .filter(token => !capturedTokenOwners.has(token.ownerUserId)
          && Date.parse(token.createdAtIso) <= sentAt
          && Date.parse(token.createdAtIso) >= sentAt - 5000);
      if (!tokens.length) continue; // Already covered by the original token-owner snapshot.
      if (tokens.length !== 1) Q.fail("Ambiguous generated share token; retain the chat boundary.");
      cleanupTokenIds.push(tokens[0]._id);
    }
    if (cleanupTokenIds.length) retained.push({collection: "shareTokens",
      selector: {_id: {$in: cleanupTokenIds}}, documents: []});
    Q.restoreSnapshots(retained);
    for (const snapshot of retained) {
      if (!Q.sameJson(ordered(snapshot.documents), ordered(Q.collection(snapshot.collection).find(snapshot.selector).toArray()))) {
        Q.fail(`${snapshot.collection} chat restoration differs; retain snapshots.`);
      }
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {chatSharingSnapshots: "", chatSharingChatId: ""}});
    Q.printObject({checkpointId, chatSharingRestored: true, generatedAssetTokensRemoved: cleanupTokenIds.length, verifiedScopes: retained.length});
    return;
  }
  if (command === "prepare-contacts") {
    if (state.contactSnapshots || state.cashHistorySnapshots || state.chatSharingSnapshots || state.sharingSnapshots)
      Q.fail("Restore previous temporary controls before contacts preparation.");
    if (!(state.savepoints || []).some(point => point.name === "after-cash-history"))
      Q.fail("The closed cash boundary is required.");
    const participantIds = [actors[0], "eb1ca0b761885bb0763e2929", actors[1], actors[2]];
    const users = Q.collection("users").find({userId: {$in: participantIds}}).toArray();
    if (users.length !== 4 || users.some(user => user.workspaceGroupId
        || !Number.isFinite(user.locationCoordinates?.latitude) || !Number.isFinite(user.locationCoordinates?.longitude)))
      Q.fail("Four existing Main profiles with stored locations are required.");
    const chatId = "c-contact-" + Buffer.from([actors[0], participantIds[1]].sort().join("\n")).toString("base64url");
    const related = {$or: [{sourceId: chatId}, {entityId: chatId}, {"payload.chatId": chatId},
      {recipientUserId: {$in: participantIds}, kind: {$regex: "^contact-chat-"}}]};
    const retained = Q.snapshotSpecs([
      {collection: "users", selector: {userId: {$in: participantIds}}},
      {collection: "navigatorContacts", selector: {userId: {$in: participantIds}}},
      {collection: "contactChatAccess", selector: {leftUserId: {$in: participantIds}, rightUserId: {$in: participantIds}}},
      {collection: "privacyConsents", selector: {userId: {$in: participantIds}}},
      {collection: "chats", selector: {id: chatId}},
      {collection: "chatMessages", selector: {chatId}},
      {collection: "userNotifications", selector: related},
      {collection: "notificationOutbox", selector: related},
      {collection: "shareTokens", selector: {ownerUserId: {$in: participantIds}}}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {
      contactSnapshots: retained, contactChatId: chatId, contactActorIds: participantIds, resumeBlock: 11
    }});
    Q.printObject({checkpointId, chatId, prepared: true, productWrites: false, actors: participantIds});
    return;
  }
  if (command === "prepare-contact-invitees") {
    if (!state.contactSnapshots || state.contactInviteesPrepared) Q.fail("Prepare contact baseline once before invitees.");
    // Existing contacts shown by the normal member picker; snapshot only, no contact outcome seeded.
    const ids = ["f6f22ba0a6f14cfcf4585d47", "9184901a15076d32ea8b626f"];
    const users = Q.collection("users").find({userId: {$in: ids}}).toArray();
    if (users.length !== 2 || users.some(u => !Number.isFinite(u.locationCoordinates?.latitude)
        || !Number.isFinite(u.locationCoordinates?.longitude))) Q.fail("Existing located invitees required.");
    const retained = Q.snapshotSpecs([
      {collection: "users", selector: {userId: {$in: ids}}},
      {collection: "navigatorContacts", selector: {userId: {$in: ids}}},
      {collection: "privacyConsents", selector: {userId: {$in: ids}}},
      {collection: "contactChatAccess", selector: {$or: [{leftUserId: {$in: ids}}, {rightUserId: {$in: ids}}]}},
      {collection: "userNotifications", selector: {recipientUserId: {$in: ids}, kind: {$regex: "^contact-chat-"}}},
      {collection: "notificationOutbox", selector: {recipientUserId: {$in: ids}, kind: {$regex: "^contact-chat-"}}}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$push: {
      contactSnapshots: {$each: retained}, contactActorIds: {$each: ids}
    }, $set: {contactInviteesPrepared: true}});
    Q.printObject({checkpointId, prepared: true, invitees: ids, productWrites: false});
    return;
  }
  if (command === "prepare-contact-request-pages") {
    if (!state.contactSnapshots || state.contactRequestPageIds
        || !(state.savepoints || []).some(point => point.name === "after-contacts"))
      Q.fail("Block12 contact snapshot and closed block11 boundary required, once only.");
    const recipient = actors[0];
    const existing = new Set(Q.collection("contactChatAccess")
      .find({$or: [{leftUserId: recipient}, {rightUserId: recipient}]}).toArray()
      .flatMap(record => [record.leftUserId, record.rightUserId]));
    const candidates = Q.collection("users").find({workspaceGroupId: null, deletedAtIso: null,
      profileStatus: {$ne: "deleted"}, userId: {$nin: state.contactActorIds}}).sort({userId: 1}).toArray()
      .filter(user => /^[a-f0-9]{24}$/.test(user.userId) && !existing.has(user.userId)
        && Number.isFinite(user.locationCoordinates?.latitude)
        && Number.isFinite(user.locationCoordinates?.longitude)).slice(0, 11);
    if (candidates.length !== 11) Q.fail("Eleven existing eligible Main profiles are required.");
    const ids = candidates.map(user => user.userId);
    const pairs = ids.map(id => { const pair = [id, recipient].sort(); return `${pair[0].length}:${pair.join("")}`; });
    const retained = Q.snapshotSpecs([
      {collection: "users", selector: {userId: {$in: ids}}},
      {collection: "navigatorContacts", selector: {userId: {$in: ids}}},
      {collection: "contactChatAccess", selector: {_id: {$in: pairs}}},
      {collection: "userNotifications", selector: {sourceId: {$in: pairs}}},
      {collection: "notificationOutbox", selector: {sourceId: {$in: pairs}}}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$push: {
      contactSnapshots: {$each: retained}, contactActorIds: {$each: ids}
    }, $set: {contactRequestPageIds: pairs}});
    const owner = Q.collection("users").findOne({userId: recipient});
    const now = Date.now();
    candidates.forEach((user, index) => {
      const requestedAtIso = new Date(now - (candidates.length - index) * 60000).toISOString();
      const saved = Q.collection("navigatorContacts").findOne({userId: user.userId});
      const contacts = [...(saved?.contacts || [])];
      if (!contacts.some(contact => contact.userId === recipient)) contacts.push({
        id: recipient, userId: recipient, name: owner.name, initials: owner.initials, gender: owner.gender,
        city: owner.city, avatarUrl: owner.images?.[0] || "", headline: "", methods: [],
        createdAtIso: requestedAtIso, updatedAtIso: requestedAtIso
      });
      Q.collection("navigatorContacts").updateOne({userId: user.userId}, {$set: {contacts}}, {upsert: true});
      Q.collection("users").updateOne({userId: user.userId}, {$set: {contacts: contacts.length}});
      const [leftUserId, rightUserId] = [user.userId, recipient].sort();
      Q.collection("contactChatAccess").insertOne({_id: pairs[index], leftUserId, rightUserId,
        requestedBy: user.userId, status: "pending", requestedAtIso, decidedAtIso: null, version: NumberLong("0")});
    });
    Q.collection("users").updateOne({userId: recipient}, {$inc: {contactRequestsPending: ids.length}});
    Q.printObject({checkpointId, prepared: true, purpose: "Block12 pagination prerequisites only; no request/decision/notification PASS",
      expectedNewestFirst: [...candidates].reverse().map(user => ({userId: user.userId, name: user.name})), count: ids.length});
    return;
  }
  if (command === "restore-contacts") {
    if (!state.contactSnapshots) Q.fail("No contacts boundary to restore.");
    const retained = [...state.contactSnapshots];
    const oldChatScope = retained.find(snapshot => snapshot.collection === "chats" && snapshot.selector.chatId === state.contactChatId);
    if (oldChatScope) {
      // Early block-11 capture used the Java property rather than Mongo's mapped `id`.
      // Only remove the exact UI-created QA conversation; preserve unfamiliar state.
      const copies = Q.collection("chats").find({id: state.contactChatId}).toArray();
      const messages = Q.collection("chatMessages").find({chatId: state.contactChatId}).toArray();
      const knownTexts = ["QA block 11 hello from Alex", "QA block 11 reply from Milo"];
      if (oldChatScope.documents.length || copies.length !== 4 || messages.length !== 2
          || copies.some(copy => copy.channelType !== "contact" || !state.contactActorIds.includes(copy.ownerUserId))
          || messages.some(message => !knownTexts.includes(message.text)))
        Q.fail("Legacy contacts cleanup differs from the recorded UI-only conversation; retain state.");
      retained.push({collection: "chats", selector: {id: state.contactChatId}, documents: []});
    }
    Q.restoreSnapshots(retained);
    for (const snapshot of retained) {
      if (!Q.sameJson(ordered(snapshot.documents), ordered(Q.collection(snapshot.collection).find(snapshot.selector).toArray())))
        Q.fail(`${snapshot.collection} contact restoration differs; retain snapshots.`);
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {
      contactSnapshots: "", contactChatId: "", contactActorIds: "", contactInviteesPrepared: "", contactRequestPageIds: ""
    }});
    Q.printObject({checkpointId, contactsRestored: true});
    return;
  }
  if (command === "prepare-cash-history") {
    if (state.cashHistorySnapshots || state.sharingSnapshots || state.chatSharingSnapshots)
      Q.fail("Restore prior temporary controls before cash history preparation.");
    if (!(state.savepoints || []).some(point => point.name === "after-chat-sharing"))
      Q.fail("The closed chat-sharing boundary is required.");
    // Milo is an existing eligible payer in Alex's normal member picker.
    const payerId = "eb1ca0b761885bb0763e2929";
    const participantIds = [actors[0], payerId];
    const users = Q.collection("users").find({userId: {$in: participantIds}}).toArray();
    if (users.length !== 2 || users.some(user => user.workspaceGroupId
        || !Number.isFinite(user.locationCoordinates?.latitude) || !Number.isFinite(user.locationCoordinates?.longitude)))
      Q.fail("Existing Main-profile actors with valid stored locations are required.");
    const referralSelector = {_id: {$in: [payerId, ObjectId(payerId)]}};
    const existingReferral = Q.collection("affiliateRegistrations").findOne(referralSelector);
    if (existingReferral && existingReferral.referrerUserId !== actors[0])
      Q.fail("Retain existing attribution; this control requires the configured referrer.");
    const paymentSelector = {$or: [{userId: {$in: participantIds}}, {recipientUserId: {$in: participantIds}}]};
    const receiptId = {$regex: "^cash:" + actors[0] + ":"};
    const related = {$or: [{sourceId: receiptId}, {entityId: receiptId}, {"payload.paymentId": receiptId}]};
    const retained = Q.snapshotSpecs([
      {collection: "users", selector: {userId: {$in: participantIds}}},
      {collection: "payments", selector: paymentSelector},
      {collection: "affiliateRegistrations", selector: referralSelector},
      {collection: "affiliatePartners", selector: {_id: actors[0]}},
      {collection: "affiliatePaymentContributions", selector: {ownerUserId: actors[0]}},
      {collection: "userNotifications", selector: related},
      {collection: "notificationOutbox", selector: related}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {
      cashHistorySnapshots: retained, cashHistoryPreparedAtIso: Q.nowIso(), resumeBlock: 10
    }});
    // Existing referral is a precondition for a meaningful cash-exclusion check.
    // No payment, totals, contribution or notification result is seeded.
    if (!existingReferral) Q.collection("affiliateRegistrations").insertOne({
      _id: ObjectId(payerId), referrerUserId: actors[0], code: "qa-group-cash-attribution",
      registeredAtIso: "2026-09-01T12:00:00Z"
    });
    Q.printObject({checkpointId, recipient: actors[0], payer: payerId, prepared: true,
      seededPayments: 0, seededRevenue: 0, actorLocationsChanged: false});
    return;
  }
  if (command === "prepare-cash-checkout") {
    if (!state.cashHistorySnapshots) Q.fail("Cash history boundary required.");
    if (state.cashCheckoutIds) {
      if (Q.collection("payments").countDocuments({sourceId: {$in: state.cashCheckoutIds}})
          || Q.collection("eventCheckoutBasketItems").countDocuments({sourceId: {$in: state.cashCheckoutIds}}))
        Q.fail("Retain the active checkout outcomes.");
      for (const event of Q.collection("events").find({sourceId: {$in: state.cashCheckoutIds}}).toArray())
        Q.collection("events").updateOne({_id: event._id}, {$set: {timeframe: event.startAtIso + " – " + event.endAtIso}});
      Q.printObject({checkpointId, checkoutDisplayPrepared: true, outcomesChanged: false});
      return;
    }
    const owner = Q.collection("users").findOne({userId: actors[0]});
    const template = Q.collection("events").findOne({status: "A", eventType: "main", workspaceGroupId: {$in: [null, ""]}, parentEventId: {$in: [null, ""]}});
    const ids = ["f02709270000000000000101", "f02709270000000000000102"];
    if (!template || ids.some(id => Q.collection("events").countDocuments({sourceId: id}))) Q.fail("Checkout template absent or fixture IDs occupied.");
    const related = {$or: [{sourceId: {$in: ids}}, {entityId: {$in: ids}}, {"payload.sourceId": {$in: ids}}]};
    const retained = Q.snapshotSpecs([
      {collection: "events", selector: {sourceId: {$in: ids}}},
      {collection: "activityMembers", selector: {ownerId: {$in: ids}}},
      {collection: "eventCheckoutBasketItems", selector: {sourceId: {$in: ids}}},
      {collection: "eventTickets", selector: {eventId: {$in: ids}}},
      {collection: "chats", selector: {eventId: {$in: ids}}},
      {collection: "chatMessages", selector: {chatId: {$in: ids}}},
      {collection: "userNotifications", selector: related},
      {collection: "notificationOutbox", selector: related}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {
      cashHistorySnapshots: [...state.cashHistorySnapshots, ...retained], cashCheckoutIds: ids
    }});
    const now = Q.nowIso(), start = new Date(Date.now() + 7 * 86400000).toISOString(), end = new Date(Date.now() + 7 * 86400000 + 3600000).toISOString();
    ids.forEach((id, index) => {
      Q.collection("events").insertOne({...template, _id: ObjectId(id), sourceId: id, syncKey: id,
        ownerUserId: actors[0], organizerUserId: actors[0], creatorUserId: actors[0], creatorName: owner.name,
        creatorInitials: owner.initials, admins: [actors[0]], workspaceGroupId: null, status: "A", moderationStatus: "approved",
        title: index === 0 ? "QA Group Cash Checkout" : "QA Group Card Checkout", subtitle: "Block 10 cash exclusion control",
        visibility: "Public", blindMode: "Visible Event", isTrashed: false, trashedAtIso: null, expired: false,
        startAtIso: start, endAtIso: end, timeframe: start + " – " + end, createdDate: now, updatedDate: now, sourceLink: "",
        location: "QA checkout", locationCoordinates: owner.locationCoordinates,
        locationGeo: {type: "Point", coordinates: [owner.locationCoordinates.longitude, owner.locationCoordinates.latitude]},
        mode: "Casual", frequency: "Once", ticketing: false, approvalRequired: false, autoInviter: false,
        capacityMin: 1, capacityMax: 10, capacityTotal: 10, capacityTotalActual: 10, full: false,
        acceptedMembers: 1, pendingMembers: 0, acceptedMemberUserIds: [actors[0]], pendingMemberUserIds: [], invitedMemberUserIds: [], pendingRequestMemberUserIds: [],
        slotsEnabled: false, slotTemplates: [], parentEventId: null, parentSubEventId: null, groupId: null, generated: false,
        upcomingSlots: [], nextSlot: null, subEventsEnabled: false, subEventDefinitions: [], subEvents: [], policiesEnabled: false, policies: [],
        unread: 0, activity: 0, paymentSessionId: null, feedbackOwnEventCounterUserIds: [],
        pricing: {enabled: true, mode: "fixed", basePrice: 10, currency: "EUR", taxMode: "included", chargeType: "per_attendee",
          quantityRulesEnabled: false, quantityRules: [], rounding: "none", demandRulesEnabled: false, demandRules: [], timeRulesEnabled: false, timeRules: [],
          cancellationPolicy: {enabled: true, rules: [{id: "qa-full-refund", offsetUnit: "days", offsetValue: 0, refundKind: "full", refundValue: 100}]},
          slotPricingEnabled: false, slotOverrides: [], audience: {enabled: false, promoCodes: []}}});
      Q.collection("activityMembers").insertOne({_id: `event:${id}:${actors[0]}`, ownerType: "event", ownerId: id,
        userId: actors[0], role: "Admin", status: "accepted", actionAtIso: now});
    });
    Q.printObject({checkpointId, events: ids, prepared: true, seededPayments: 0, seededRevenue: 0});
    return;
  }
  if (command === "prepare-cash-payment-methods") {
    if (!state.cashHistorySnapshots || state.cashPaymentMethodsPrepared)
      Q.fail("Require the cash boundary without an existing card snapshot.");
    const retained = Q.snapshotSpecs([
      {collection: "savedPaymentMethods", selector: {userId: "eb1ca0b761885bb0763e2929"}},
      {collection: "paymentMethodRegistrations", selector: {userId: "eb1ca0b761885bb0763e2929"}}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {
      cashHistorySnapshots: [...state.cashHistorySnapshots, ...retained], cashPaymentMethodsPrepared: true
    }});
    Q.printObject({checkpointId, paymentMethodsSnapshotted: true, productWrites: 0});
    return;
  }
  if (command === "restore-cash-history") {
    if (!state.cashHistorySnapshots) Q.fail("No cash history boundary to restore.");
    const paymentSnapshot = state.cashHistorySnapshots.find(s => s.collection === "payments");
    const retainedPaymentIds = new Set(paymentSnapshot.documents.map(p => Q.text(p._id)));
    const newPayments = Q.collection("payments").find(paymentSnapshot.selector).toArray()
      .filter(p => !retainedPaymentIds.has(Q.text(p._id)));
    if (newPayments.some(p => !Q.text(p.sourceId).startsWith("cash:" + actors[0] + ":")
        && !(state.cashCheckoutIds || []).includes(p.sourceId)))
      Q.fail("An unrelated payment appeared during cash QA; retain all snapshots.");
    const generatedPaymentIds = newPayments.map(p => Q.text(p._id));
    // Checkout IDs are allocated by the product. Their gateway operations and
    // notifications had no pre-fixture counterpart; derive exact cleanup IDs
    // from the guarded payment lineage, never from an unbounded time range.
    const generatedScopes = [
      {collection: "payment_gateway_operations", selector: {paymentId: {$in: generatedPaymentIds}}, documents: []},
      ...["userNotifications", "notificationOutbox"].map(collection => ({collection, documents: [], selector: {$or: [
        {sourceId: {$in: generatedPaymentIds}}, {entityId: {$in: generatedPaymentIds}},
        {"payload.paymentId": {$in: generatedPaymentIds}}
      ]}}))
    ];
    Q.restoreSnapshots(generatedScopes);
    Q.restoreSnapshots(state.cashHistorySnapshots);
    for (const snapshot of state.cashHistorySnapshots) {
      if (!Q.sameJson(ordered(snapshot.documents), ordered(Q.collection(snapshot.collection).find(snapshot.selector).toArray())))
        Q.fail(`${snapshot.collection} cash restoration differs; retain snapshots.`);
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {
      cashHistorySnapshots: "", cashHistoryPreparedAtIso: "", cashCheckoutIds: "", cashPaymentMethodsPrepared: ""
    }});
    Q.printObject({checkpointId, cashHistoryRestored: true});
    return;
  }
  if (["prepare-tools", "prepare-tools-explore", "inspect-tools", "restore-tools"].includes(command)) {
    const profiles = Q.collection("users").find({$or: [{userId: actors[0]}, {accountUserId: actors[0]}]}).toArray();
    const ownerIds = profiles.map(p => p.userId);
    const owned = {ownerUserId: {$in: ownerIds}};
    if (command === "prepare-tools") {
      if (state.toolsSnapshots) Q.fail("Tools checkpoint already retained.");
      const retained = Q.snapshotSpecs([
        {collection: "assets", selector: owned},
        {collection: "users", selector: {userId: {$in: ownerIds}}}
      ]);
      Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {toolsSnapshots: retained}});
    } else if (command === "prepare-tools-explore") {
      const ids = ["f02709270000000000000091", "f02709270000000000000092", "f02709270000000000000093", "f02709270000000000000094"];
      const eventId = "f02709270000000000000095", groupId = "seed-community-language-lab";
      const source = Q.collection("assets").findOne({assetId: "6c8ac25e7a63755e53c46093", status: "A"});
      const groupOwner = Q.collection("users").findOne({accountUserId: actors[2], workspaceGroupId: groupId});
      const friendIds = Q.collection("userFriendships").find({$or: [{leftUserId: actors[0]}, {rightUserId: actors[0]}]}).toArray().flatMap(p => [p.leftUserId, p.rightUserId]);
      const foreignOwner = Q.collection("users").findOne({userId: {$nin: [...friendIds, ...ownerIds]}, accountUserId: null, workspaceGroupId: null});
      if (!state.toolsSnapshots || state.toolsExplorePrepared || !source || !groupOwner || !foreignOwner
          || Q.collection("assets").countDocuments({assetId: {$in: ids}}) || Q.collection("events").countDocuments({sourceId: eventId})
          || Q.collection("activityMembers").countDocuments({ownerType: "community", ownerId: groupId, userId: actors[0]}))
        Q.fail("Tools Explore prerequisite differs.");
      const retained = Q.snapshotSpecs([
        {collection: "assets", selector: {assetId: {$in: ids}}},
        {collection: "events", selector: {sourceId: eventId}},
        {collection: "assetRequests", selector: {assetId: {$in: ids}}}
      ]);
      Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$push: {toolsSnapshots: {$each: retained}}, $set: {toolsExplorePrepared: true}});
      const start = new Date(Date.now() + 86400000).toISOString(), end = new Date(Date.now() + 90000000).toISOString();
      Q.collection("events").insertOne({_id: ObjectId(eventId), sourceId: eventId, syncKey: eventId,
        ownerUserId: groupOwner.userId, creatorUserId: groupOwner.userId, workspaceGroupId: groupId,
        title: "QA 22 Foreign Group Event", type: "main", eventType: "main", visibility: "Invitation only", status: "active",
        moderationStatus: "approved", startAtIso: start, endAtIso: end, admins: [groupOwner.userId], acceptedMembers: 1});
      const booking = {eventId, eventTitle: "QA 22 Foreign Group Event", subEventId: "qa22-slot", subEventTitle: "QA22", startAtIso: start, endAtIso: end, quantity: 1};
      const request = {_id: "qa22-booking", userId: groupOwner.userId, name: groupOwner.name, status: "accepted", requestKind: "borrow", booking};
      ["Public", "Friends only", "Invitation only", "Public"].forEach((visibility, index) => {
        const assetId = ids[index], ownerUserId = index === 3 ? actors[0] : foreignOwner.userId;
        Q.collection("assets").insertOne({...source, _id: ObjectId(assetId), assetId, syncKey: assetId, ownerUserId,
          title: "QA 22 Explore " + ["Public", "Friends", "Private", "Own"][index], visibility, status: "A", moderationStatus: "approved",
          requests: index === 0 ? [request] : [], createdDate: Q.nowIso(), updatedDate: Q.nowIso()});
      });
      Q.collection("assetRequests").insertOne({_id: ids[0] + ":request:qa22-booking", assetId: ids[0], ownerUserId: foreignOwner.userId,
        userId: groupOwner.userId, requestId: "qa22-booking", status: "accepted", requestKind: "borrow", booking});
      Q.printObject({checkpointId, ids, eventId, groupId, foreignOwnerId: foreignOwner.userId, groupOwnerId: groupOwner.userId,
        noViewerFriendship: true, noViewerGroupMembership: true, preparationOnly: true});
      return;
    } else if (command === "restore-tools") {
      if (!state.toolsSnapshots) Q.fail("Tools checkpoint missing.");
      const original = new Set(state.toolsSnapshots.filter(s => s.collection === "assets").flatMap(s => s.documents.map(a => a.assetId)));
      const created = Q.collection("assets").find(owned).toArray().filter(a => !original.has(a.assetId) && /^QA (Group )?22 /.test(a.title)).map(a => a.assetId);
      for (const [collection, field] of [["affinityRecomputeTasks", "targetId"], ["assetRequests", "assetId"], ["activityMembers", "ownerId"], ["userNotifications", "sourceId"], ["notificationOutbox", "entityId"]])
        Q.collection(collection).deleteMany({[field]: {$in: created}});
      Q.restoreSnapshots(state.toolsSnapshots);
      for (const snapshot of state.toolsSnapshots) {
        if (!Q.sameJson(ordered(snapshot.documents), ordered(Q.collection(snapshot.collection).find(snapshot.selector).toArray())))
          Q.fail("Tools checkpoint exact restoration differs.");
      }
      Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {toolsSnapshots: "", toolsExplorePrepared: ""}});
      Q.printObject({checkpointId, toolsRestored: true});
      return;
    }
    Q.printObject({checkpointId, prepared: command === "prepare-tools" || Boolean(state.toolsSnapshots),
      profiles: profiles.map(p => ({userId: p.userId, accountUserId: p.accountUserId, workspaceGroupId: p.workspaceGroupId, activities: p.activities})),
      assets: Q.collection("assets").find(owned).toArray().map(a => ({id: a.assetId, ownerUserId: a.ownerUserId, title: a.title, type: a.type, status: a.status, visibility: a.visibility})),
      foreignProfiles: Q.collection("users").find({accountUserId: {$in: actors.slice(1)}}).toArray().map(p => ({userId: p.userId, workspaceGroupId: p.workspaceGroupId})),
      foreignPublic: Q.collection("assets").find({ownerUserId: {$nin: ownerIds}, visibility: "Public"}).limit(4).toArray().map(a => ({id: a.assetId, ownerUserId: a.ownerUserId, title: a.title, type: a.type, requests: a.requests}))});
    return;
  }
  if (command === "prepare-sharing") {
    if (state.sharingSnapshots) Q.fail("Sharing prerequisites already prepared; retain their snapshots.");
    if (!(state.savepoints || []).some(point => point.name === "after-membership-trash")) Q.fail("Block 7 boundary required.");
    const owner = Q.collection("users").findOne({userId: actors[0]});
    const group = Q.collection("communityGroups").findOne({_id: sharingGroupId});
    const asset = Q.collection("assets").findOne({assetId: "6c8ac25e7a63755e53c46093", status: "A"});
    if (!owner || !group || !asset || Q.collection("events").countDocuments({sourceId: sharingEventId}) || Q.collection("assets").countDocuments({assetId: sharingAssetId})) Q.fail("Sharing baseline missing or fixed QA IDs occupied.");
    const members = Q.collection("activityMembers").find({ownerType: "community", ownerId: sharingGroupId}).toArray();
    const affected = [...new Set([...actors, ...members.map(member => member.userId)])];
    const affiliateOwners = [actors[0], ...Q.collection("users").find({
      accountUserId: actors[0], workspaceGroupId: sharingGroupId
    }).toArray().map(profile => profile.userId)];
    const retained = Q.snapshotSpecs([
      {collection: "users", selector: {$or: [{userId: {$in: affected}}, {workspaceGroupId: sharingGroupId}]}},
      {collection: "communityGroups", selector: {_id: sharingGroupId}},
      {collection: "events", selector: {sourceId: sharingEventId}},
      {collection: "chats", selector: {eventId: sharingEventId}},
      {collection: "chatMessages", selector: {chatId: sharingEventId}},
      {collection: "assets", selector: {assetId: sharingAssetId}},
      {collection: "activityMembers", selector: {ownerId: {$in: [sharingGroupId, sharingEventId, sharingAssetId]}}},
      {collection: "integrationParticipantInvites", selector: {ownerUserId: actors[0], eventId: {$in: [sharingGroupId, sharingEventId]}}},
      {collection: "integrationParticipantMappings", selector: {ownerUserId: actors[0]}},
      {collection: "shareTokens", selector: {ownerUserId: actors[0], entityId: sharingAssetId}},
      ...["affiliateLinks", "affiliatePartners"].map(collection => ({collection, selector: {_id: {$in: affiliateOwners}}})),
      {collection: "affiliateRegistrations", selector: {referrerUserId: actors[0]}},
      {collection: "userNotifications", selector: {$or: [{sourceId: {$in: [sharingGroupId, sharingEventId, sharingAssetId]}}, {recipientUserId: {$in: affected}, senderUserId: actors[0]}]}},
      {collection: "notificationOutbox", selector: {entityId: {$in: [sharingGroupId, sharingEventId, sharingAssetId]}}}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {sharingSnapshots: retained, sharingRegistrants: [], sharingPreparedAtIso: Q.nowIso()}});
    const now = Q.nowIso(), start = new Date(Date.now() + 86400000).toISOString(), end = new Date(Date.now() + 90000000).toISOString();
    Q.collection("events").insertOne({_id: ObjectId(sharingEventId), sourceId: sharingEventId, syncKey: sharingEventId,
      ownerUserId: actors[0], creatorUserId: actors[0], creatorName: owner.name, creatorInitials: owner.initials,
      admins: [actors[0]], status: "A", eventType: "main", mode: "Casual", workspaceGroupId: null,
      title: "QA Group Link Event", subtitle: "External sharing prerequisite", visibility: "Public", blindMode: "Open Event",
      imageUrl: group.imageUrl, imageUrls: [group.imageUrl], location: "Seattle", locationCoordinates: owner.locationCoordinates,
      locationGeo: {type: "Point", coordinates: [owner.locationCoordinates.longitude, owner.locationCoordinates.latitude]},
      startAtIso: start, endAtIso: end, createdDate: now, updatedDate: now, createdUser: actors[0], updatedUser: actors[0],
      acceptedMembers: 1, pendingMembers: 0, acceptedMemberUserIds: [actors[0]], pendingMemberUserIds: [],
      capacityMin: 1, capacityMax: 10, capacityTotal: 10, activity: 0, unread: 0,
      ticketing: false, slotsEnabled: false, subEventsEnabled: false, policiesEnabled: false});
    const member = members.find(member => member.userId === actors[0]);
    Q.collection("activityMembers").insertOne({...member, _id: `event:${sharingEventId}:${actors[0]}`, syncKey: `event:${sharingEventId}:${actors[0]}`,
      ownerType: "event", ownerId: sharingEventId, role: "Admin", status: "accepted", communityUpdates: 0, actionAtIso: now, updatedDate: now});
    Q.collection("assets").insertOne({...asset, _id: ObjectId(sharingAssetId), assetId: sharingAssetId, syncKey: sharingAssetId,
      ownerUserId: actors[0], title: "QA Group Link Supplies", requests: [], createdDate: now, updatedDate: now,
      createdUser: actors[0], updatedUser: actors[0]});
    Q.printObject({checkpointId, prepared: true, sharingGroupId, sharingEventId, sharingAssetId, outcomesSeeded: false});
    return;
  }
  if (["prepare-group-asset-payment", "inspect-group-asset-payment"].includes(command)) {
    const eventId = "f02709270000000000000083", stageId = "qa-group23-borrow", cardId = "qa-group23-barion";
    const payer = Q.collection("users").findOne({accountUserId: actors[0], workspaceGroupId: sharingGroupId});
    const event = Q.collection("events").findOne({sourceId: eventId});
    const asset = Q.collection("assets").findOne({assetId: sharingAssetId});
    if (!state.sharingSnapshots || !payer || !event || !asset) Q.fail("Own sharing/group-event prerequisite required.");
    if (command === "prepare-group-asset-payment") {
      if (state.groupAssetPaymentPrepared || Q.collection("savedPaymentMethods").countDocuments({_id: cardId}))
        Q.fail("Group Asset payment baseline already occupied.");
      const serviceChat = `c-service-asset-${sharingAssetId}-${stageId}-${payer.userId}`;
      const retained = Q.snapshotSpecs([
        {collection: "payments", selector: {sourceId: sharingAssetId}},
        {collection: "savedPaymentMethods", selector: {_id: cardId}},
        {collection: "eventCheckoutBasketItems", selector: {sourceId: sharingAssetId}},
        {collection: "assetRequests", selector: {assetId: sharingAssetId}},
        {collection: "activityResources", selector: {ownerId: eventId}},
        {collection: "activitySubEventStageRuntime", selector: {ownerId: eventId}},
        {collection: "affinityRecomputeTasks", selector: {targetId: {$in: [eventId, sharingAssetId]}}},
        {collection: "chats", selector: {id: serviceChat}},
        {collection: "chatMessages", selector: {chatId: serviceChat}}
      ]);
      Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$push: {sharingSnapshots: {$each: retained}}, $set: {groupAssetPaymentPrepared: true}});
      const stage = {id: stageId, name: "QA Group Asset Borrow", description: "Group payer / Base Asset recipient",
        timing: "During", offsetMinutes: 0, durationMinutes: 60, optional: false, capacityMin: 1, capacityMax: 10,
        startAt: event.startAtIso, endAt: event.endAtIso};
      Q.collection("events").updateOne({_id: event._id}, {$set: {title: "QA Group Asset Payment", subEventsEnabled: true,
        subEventDefinitions: [stage], subEvents: [{...stage, stageStatus: "A", membersAccepted: 1, membersPending: 0,
          carsAccepted: 0, carsPending: 0, suppliesAccepted: 0, suppliesPending: 0, accommodationAccepted: 0, accommodationPending: 0}],
        timeframe: event.startAtIso + " – " + event.endAtIso, approvalRequired: false}});
      Q.collection("assets").updateOne({_id: asset._id}, {$set: {ownerUserId: actors[2], title: "QA Group Paid Supplies", visibility: "Public",
        requests: [], policiesEnabled: false, policies: [], capacityTotal: 6, quantity: 6,
        pricing: {enabled: true, mode: "fixed", basePrice: 3200, currency: "HUF", taxMode: "included", chargeType: "per_attendee",
          rounding: "none", quantityRulesEnabled: false, quantityRules: [], demandRulesEnabled: false, demandRules: [],
          timeRulesEnabled: false, timeRules: [], slotPricingEnabled: false, slotOverrides: [], audience: {enabled: false, promoCodes: []},
          cancellationPolicy: {enabled: true, rules: [{id: "qa-group-full-refund", offsetUnit: "days", offsetValue: 0, refundKind: "full", refundValue: 100}]}}}});
      Q.collection("savedPaymentMethods").insertOne({_id: cardId, version: 0, userId: payer.userId, provider: "barion",
        providerPaymentMethodRef: "pm_sim_group23_alex_barion_4444", brand: "Mastercard", last4: "4444", expiryMonth: 9,
        expiryYear: 2029, expiryKey: 202909, cardholderName: "ALEX TURNER", artworkKey: "graphite", status: "active",
        createdAtIso: Q.nowIso(), updatedAtIso: Q.nowIso()});
    }
    const users = Q.collection("users").find({$or: [{userId: {$in: [actors[0], actors[2]]}}, {accountUserId: {$in: [actors[0], actors[2]]}}]}).toArray();
    Q.printObject({checkpointId, eventId, stageId, assetId: sharingAssetId, payerId: payer.userId, recipientId: actors[2],
      prepared: true, paymentOutcomeSeeded: false,
      payments: Q.collection("payments").find({sourceId: sharingAssetId}).toArray().map(p => ({id: p._id, userId: p.userId,
        recipientUserId: p.recipientUserId, sourceId: p.sourceId, sourceType: p.sourceType, status: p.status, amount: p.amount,
        currency: p.currency, refundedAmount: p.refundedAmount})),
      profiles: users.map(u => ({userId: u.userId, spent: u.paymentSpentTotals, income: u.paymentIncomeTotals, all: u.paymentAllTotals})),
      requests: Q.collection("assetRequests").find({assetId: sharingAssetId}).toArray().map(r => ({id: r._id, userId: r.userId, ownerUserId: r.ownerUserId, status: r.status, booking: r.booking}))});
    return;
  }
  if (command === "prepare-menu-checkout") {
    // Block 21 presentation prerequisite only; no basket/booking/payment outcome.
    const slotId = "f02709270000000000000085";
    const parent = Q.collection("events").findOne({sourceId: sharingEventId});
    const owner = Q.collection("users").findOne({userId: actors[1]});
    if (!state.sharingSnapshots || !parent || !owner || Q.collection("events").countDocuments({sourceId: slotId}))
      Q.fail("Fresh sharing checkpoint required for the menu slot prerequisite.");
    const ids = [sharingEventId, slotId];
    const retained = Q.snapshotSpecs([
      {collection: "events", selector: {sourceId: slotId}},
      {collection: "activityMembers", selector: {ownerId: slotId}},
      {collection: "eventCheckoutBasketItems", selector: {sourceId: {$in: ids}}},
      {collection: "userNotifications", selector: {sourceId: slotId}},
      {collection: "notificationOutbox", selector: {entityId: slotId}}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$push: {sharingSnapshots: {$each: retained}}});
    const start = new Date(Date.now() + 86400000).toISOString(), end = new Date(Date.now() + 90000000).toISOString();
    const definitions = [{id: "qa-menu-optional", name: "QA optional activity", description: "Menu-only checkout control",
      timing: "With", offsetMinutes: 0, durationMinutes: 30, optional: true, capacityMin: 0, capacityMax: 8, groups: []}];
    const occurrence = {id: slotId, parentEventId: sharingEventId, slotTemplateId: "qa-menu-slot",
      title: "QA Menu Checkout", timeframe: start + " – " + end, startAtIso: start, endAtIso: end,
      capacityTotal: 8, acceptedMembers: 1, pendingMembers: 0};
    const fields = {ownerUserId: actors[1], creatorUserId: actors[1], creatorName: owner.name, creatorInitials: owner.initials,
      admins: [actors[1]], title: "QA Menu Checkout", startAtIso: start, endAtIso: end, timeframe: start + " – " + end,
      slotsEnabled: true, slotTemplates: [{id: "qa-menu-slot", startAt: start, closed: false, subEventDefinitions: definitions}],
      upcomingSlots: [occurrence], nextSlot: occurrence,
      subEventsEnabled: true, subEventDefinitions: definitions, frequency: "Once", moderationStatus: "approved",
      acceptedMembers: 1, acceptedMemberUserIds: [actors[1]], pendingMembers: 1, pendingMemberUserIds: [actors[0]],
      invitedMemberUserIds: [actors[0]], generated: false, pricing: {enabled: false}, ticketing: false};
    Q.collection("events").updateOne({_id: parent._id}, {$set: fields});
    Q.collection("activityMembers").updateOne({ownerType: "event", ownerId: sharingEventId, userId: actors[0]},
      {$set: {role: "Member", status: "pending", requestKind: "invitation"}});
    Q.collection("events").insertOne({...parent, ...fields, _id: ObjectId(slotId), sourceId: slotId, syncKey: slotId,
      eventType: "slot", generated: true, parentEventId: sharingEventId, slotTemplateId: "qa-menu-slot", slotsEnabled: false,
      slotTemplates: [], upcomingSlots: [], nextSlot: null, pendingMembers: 0, pendingMemberUserIds: [], invitedMemberUserIds: []});
    Q.printObject({checkpointId, parentId: sharingEventId, slotId, startAtIso: start, outcomesSeeded: false});
    return;
  }
  if (command === "prepare-sharing-group-event") {
    if (!state.sharingSnapshots || state.sharingGroupEventPrepared) Q.fail("Sharing baseline required; group event must only be prepared once.");
    const eventId = "f02709270000000000000083";
    const owner = Q.collection("users").findOne({workspaceGroupId: sharingGroupId, accountUserId: actors[0]});
    const source = Q.collection("events").findOne({sourceId: sharingEventId, ownerUserId: actors[0]});
    const member = Q.collection("activityMembers").findOne({ownerType: "event", ownerId: sharingEventId, userId: actors[0]});
    if (!owner || !source || !member || Q.collection("events").countDocuments({sourceId: eventId})) Q.fail("Group-event prerequisite missing or occupied.");
    const retained = Q.snapshotSpecs([
      {collection: "events", selector: {sourceId: eventId}},
      {collection: "chats", selector: {eventId}},
      {collection: "chatMessages", selector: {chatId: eventId}},
      {collection: "activityMembers", selector: {ownerType: "event", ownerId: eventId}},
      {collection: "integrationParticipantInvites", selector: {eventId}},
      {collection: "userNotifications", selector: {sourceId: eventId}},
      {collection: "notificationOutbox", selector: {entityId: eventId}}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$push: {sharingSnapshots: {$each: retained}}, $set: {sharingGroupEventPrepared: true}});
    const now = Q.nowIso();
    Q.collection("events").insertOne({...source, _id: ObjectId(eventId), sourceId: eventId, syncKey: eventId,
      ownerUserId: owner.userId, creatorUserId: owner.userId, admins: [owner.userId], workspaceGroupId: sharingGroupId,
      title: "QA Workspace Link Event", isAdmin: true, acceptedMembers: 1, pendingMembers: 0,
      acceptedMemberUserIds: [owner.userId], pendingMemberUserIds: [], activity: 0, unread: 0,
      createdDate: now, updatedDate: now, createdUser: owner.userId, updatedUser: owner.userId});
    Q.collection("activityMembers").insertOne({...member, _id: `event:${eventId}:${owner.userId}`, syncKey: `event:${eventId}:${owner.userId}`,
      ownerId: eventId, userId: owner.userId, actionAtIso: now, updatedDate: now});
    Q.printObject({checkpointId, groupId: sharingGroupId, eventId, prepared: true, recipientMembershipSeeded: false});
    return;
  }
  if (command === "reset-sharing-failed-event-claim") {
    if (!state.sharingSnapshots) Q.fail("Sharing baseline required.");
    const event = Q.collection("events").findOne({sourceId: sharingEventId});
    const selector = {ownerType: "event", ownerId: sharingEventId, userId: actors[2]};
    const member = Q.collection("activityMembers").findOne(selector);
    if (!event || typeof event._id === "string" || Number(event.pendingMembers) !== 0
      || (event.pendingMemberUserIds || []).length || !member || member.status !== "pending"
      || member.requestKind !== "invite" || member.invitedByUserId !== actors[0]) Q.fail("Expected the isolated pre-aggregate failed invitation only.");
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {sharingFailedClaimEvidence: member}});
    Q.collection("activityMembers").deleteOne({_id: member._id});
    Q.printObject({checkpointId, failedFixtureAttemptCleared: true, eventId: sharingEventId, userId: actors[2]});
    return;
  }
  if (command === "repair-sharing-identifiers") {
    if (!state.sharingSnapshots) Q.fail("Sharing baseline required.");
    for (const [collection, id, key] of [["events", sharingEventId, "sourceId"], ["assets", sharingAssetId, "assetId"]]) {
      const rows = Q.collection(collection).find({[key]: id}).toArray();
      if (rows.length !== 1) Q.fail("Expected exactly one isolated sharing prerequisite.");
      const row = rows[0];
      if (typeof row._id === "string") {
        if (row._id !== id || Q.collection(collection).findOne({_id: ObjectId(id)})) Q.fail("Unexpected sharing identifier boundary.");
        Q.collection(collection).deleteOne({_id: id});
        try { Q.collection(collection).insertOne({...row, _id: ObjectId(id)}); }
        catch (error) { Q.collection(collection).insertOne(row); throw error; }
      }
    }
    Q.printObject({checkpointId, identifiersRepaired: true, membershipStateRetained: true});
    return;
  }
  if (command === "prepare-sharing-attribution") {
    if (!state.sharingSnapshots || state.sharingExistingAttributionPrepared) Q.fail("Sharing baseline required; attribution control already prepared or unavailable.");
    const selector = {_id: actors[2]};
    const retained = Q.snapshotSpecs([{collection: "affiliateRegistrations", selector}]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$push: {sharingSnapshots: {$each: retained}}, $set: {sharingExistingAttributionPrepared: true}});
    // Historical attribution is a prerequisite, not the result of opening the
    // new link. Preserve a real existing record when one is already present.
    Q.collection("affiliateRegistrations").updateOne(selector, {$setOnInsert: {
      referrerUserId: actors[1], code: "qa-group-existing-attribution",
      registeredAtIso: "2026-09-01T12:00:00Z"
    }}, {upsert: true});
    Q.printObject({checkpointId, existingUserId: actors[2], attribution: Q.collection("affiliateRegistrations").findOne(selector), membershipChanged: false});
    return;
  }
  if (command === "track-sharing-registration") {
    const userId = Q.text(process.env.MANUAL_QA_SOURCE_CHECKPOINT_ID);
    if (!state.sharingSnapshots || !/^demo-profile-[a-f0-9-]{36}$/.test(userId) || Q.collection("users").countDocuments({userId})) Q.fail("Track a fresh UI-generated identity before submitting registration.");
    if ((state.sharingRegistrants || []).includes(userId)) Q.fail("Registration identity already tracked.");
    const fields = ["_id", "userId", "ownerUserId", "accountUserId", "recipientUserId", "actorUserId", "relatedUserId", "leftUserId", "rightUserId", "targetId", "referrerUserId", "internalId"];
    const retained = Q.snapshotSpecs(db.getCollectionNames().filter(collection => collection !== Q.STATE_COLLECTION).map(collection => ({collection, selector: {$or: fields.map(field => ({[field]: userId}))}})));
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$push: {sharingRegistrants: userId, sharingSnapshots: {$each: retained}}});
    Q.printObject({checkpointId, tracked: userId, registrationCreated: false});
    return;
  }
  function sharingRestoreBoundary() {
    if (!state.sharingSnapshots) Q.fail("No sharing snapshot to restore.");
    const retained = state.sharingSnapshots.map(snapshot => {
      if (!["affiliateLinks", "affiliatePartners"].includes(snapshot.collection) || !snapshot.selector.userId) return snapshot;
      // Older sharing captures used userId, but these collections are keyed by
      // profile _id. Only remove a link demonstrably created inside this run.
      const ownerId = snapshot.selector.userId;
      const owner = state.sharingSnapshots.flatMap(s => s.collection === "users" ? s.documents : [])
        .find(profile => profile.userId === ownerId && profile.accountUserId === actors[0] && profile.workspaceGroupId === sharingGroupId);
      const current = Q.collection(snapshot.collection).findOne({_id: ownerId});
      if (!owner || snapshot.documents.length || (current &&
        !(Date.parse(current.createdAtIso) >= Date.parse(state.sharingPreparedAtIso)))) {
        Q.fail("Cannot establish the original group-owner Affiliate boundary; retain the sharing snapshot.");
      }
      return {...snapshot, selector: {_id: ownerId}};
    });
    // The reserved prerequisite Events did not exist before preparation.
    // Their generated owner-chat projections/messages belong to that same
    // disposable scope, including runs captured before those scopes were added.
    for (const eventId of [sharingEventId, "f02709270000000000000083"]) {
      const event = retained.find(s => s.collection === "events" && s.selector.sourceId === eventId);
      if (!event) continue;
      if (event.documents.length) Q.fail("Sharing prerequisite Event baseline must be empty.");
      for (const [collection, field] of [["chats", "eventId"], ["chatMessages", "chatId"]]) {
        if (!retained.some(s => s.collection === collection && s.selector[field] === eventId)) {
          retained.push({collection, selector: {[field]: eventId}, documents: []});
        }
      }
    }
    return retained;
  }
  if (command === "sharing-registrants") {
    if (!state.sharingSnapshots) Q.fail("No sharing snapshot to restore.");
    sharingRestoreBoundary(); // Validate before the shell removes tracked media.
    const users = state.sharingRegistrants || [];
    if (users.some(id => !/^demo-profile-[a-f0-9-]{36}$/.test(id))) Q.fail("Invalid tracked registration identity.");
    Q.printObject({users});
    return;
  }
  if (command === "restore-sharing") {
    const retained = sharingRestoreBoundary();
    if (state.groupAssetPaymentPrepared) {
      const paymentIds = Q.collection("payments").distinct("_id", {sourceId: sharingAssetId}).map(Q.text);
      retained.push({collection: "payment_gateway_operations", selector: {paymentId: {$in: paymentIds}}, documents: []});
      for (const collection of ["userNotifications", "notificationOutbox"]) retained.push({collection, documents: [], selector: {$or: [
        {sourceId: {$in: paymentIds}}, {entityId: {$in: paymentIds}}, {"payload.paymentId": {$in: paymentIds}}
      ]}});
    }
    Q.restoreSnapshots(retained);
    for (const snapshot of retained) {
      if (!Q.sameJson(ordered(snapshot.documents), ordered(Q.collection(snapshot.collection).find(snapshot.selector).toArray()))) {
        Q.fail(`${snapshot.collection} sharing restoration differs; retained snapshots were not discarded.`);
      }
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {sharingSnapshots: "", sharingRegistrants: "", sharingPreparedAtIso: "", sharingExistingAttributionPrepared: "", sharingFailedClaimEvidence: "", sharingGroupEventPrepared: "", groupAssetPaymentPrepared: ""}});
    Q.printObject({checkpointId, sharingRestored: true});
    return;
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
      {collection: "notificationOutbox", selector: {entityType: "community", entityId: groupId}},
      {collection: "contentModerationState", selector: {_id: `group:${groupId}`}},
      {collection: "contentModerationItems", selector: {workspaceGroupId: groupId}},
      {collection: "photoFeedPosts", selector: {workspaceGroupId: groupId}},
      {collection: "chats", selector: {id: /^c-moderation-group-f0260926/}},
      {collection: "chatMessages", selector: {chatId: /^c-moderation-group-f0260926/}},
      {collection: "userNotifications", selector: {sourceType: "chat", sourceId: /^c-moderation-group-f0260926/}},
      {collection: "notificationOutbox", selector: {entityType: "chat", entityId: /^c-moderation-group-f0260926/}}
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
  if (command === "prepare-admin-moderation") {
    const groupId = "manual-qa-community-admin";
    if (!state.adminLifecycleSnapshots || !state.adminLifecycleSnapshots.some(s => s.collection === "contentModerationState")
        || !Q.collection("communityGroups").countDocuments({_id: groupId})
        || Q.collection("contentModerationItems").countDocuments({workspaceGroupId: groupId})) {
      Q.fail("Prepare a fresh Admin lifecycle control with moderation snapshots first.");
    }
    const profile = Q.collection("users").findOne({accountUserId: actors[1], workspaceGroupId: groupId});
    const imageUrl = Q.collection("communityGroups").findOne({_id: groupId}).imageUrl;
    const now = Q.nowIso();
    Q.collection("contentModerationState").replaceOne({_id: `group:${groupId}`}, {
      _id: `group:${groupId}`, revision: 1,
      settings: {enabled: true, autoApprove: false, delayMinutes: 0, categories: ["asset", "event", "feed"]},
      counts: {feed: {"under-review": 2}}, pending: []
    }, {upsert: true});
    for (const suffix of ["approval", "rejection"]) {
      const sourceId = `${groupId}-${suffix}`;
      Q.collection("photoFeedPosts").insertOne({_id: sourceId, creatorUserId: profile.userId,
        creatorName: profile.name, createdAtIso: now, imageUrls: imageUrl ? [imageUrl] : [],
        imageDetails: {}, moderationStatus: "under-review", moderationVersion: 1, workspaceGroupId: groupId});
      Q.collection("contentModerationItems").insertOne({_id: `feed:${sourceId}`, category: "feed", sourceId,
        ownerUserId: profile.userId, title: `QA moderation ${suffix}`, imageUrl: imageUrl || "", submittedAtIso: now,
        status: "under-review", version: 1, commandId: `submit:feed:${sourceId}`, reviewedBy: "", reviewedAtIso: "",
        publiclyVisibleOnce: false, deleted: false, workspaceGroupId: groupId});
    }
    Q.collection("communityGroups").updateOne({_id: groupId}, {$set: {moderationPending: 2, moderationQueueRevision: 1}});
    Q.printObject({checkpointId, groupId, preparedPendingItems: 2, publicationFlowTested: false});
    return;
  }
  if (command === "prepare-admin-feed-event") {
    const groupId = "manual-qa-community-admin";
    const eventId = "f02609260000000000000101";
    const owner = Q.collection("users").findOne({accountUserId: actors[0], workspaceGroupId: groupId});
    if (!state.adminLifecycleSnapshots || !owner
        || Q.collection("events").countDocuments({sourceId: eventId})) {
      Q.fail("A live Admin control without its Feed event prerequisite is required.");
    }
    const snapshots = Q.snapshotSpecs([
      {collection: "events", selector: {sourceId: eventId}},
      {collection: "activityMembers", selector: {ownerType: "event", ownerId: eventId}}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {
      $set: {adminLifecycleSnapshots: state.adminLifecycleSnapshots.concat(snapshots)}
    });
    const now = Q.nowIso();
    const imageUrl = Q.collection("communityGroups").findOne({_id: groupId}).imageUrl;
    Q.collection("events").insertOne({_id: eventId, syncKey: `manual-qa-group-feed:${eventId}`,
      sourceId: eventId, ownerUserId: owner.userId, creatorUserId: owner.userId,
      creatorName: owner.name, creatorInitials: owner.initials, admins: [owner.userId],
      workspaceGroupId: groupId, status: "A", eventType: "main", mode: "Casual",
      title: "QA Group Photo Session", subtitle: "Photo publication prerequisite; creation is not under test.",
      visibility: "Public", blindMode: "Open Event", imageUrl, imageUrls: imageUrl ? [imageUrl] : [],
      location: "Seattle", locationCoordinates: owner.locationCoordinates,
      locationGeo: {type: "Point", coordinates: [owner.locationCoordinates.longitude, owner.locationCoordinates.latitude]},
      startAtIso: now, endAtIso: new Date(Date.now() + 3600000).toISOString(),
      createdDate: now, updatedDate: now, createdUser: owner.userId, updatedUser: owner.userId,
      acceptedMembers: 1, pendingMembers: 0, acceptedMemberUserIds: [owner.userId], pendingMemberUserIds: [],
      capacityMin: 1, capacityMax: 10, capacityTotal: 10, activity: 0, unread: 0,
      ticketing: false, slotsEnabled: false, subEventsEnabled: false, policiesEnabled: false});
    const template = Q.collection("activityMembers").findOne({ownerType: "community", ownerId: groupId, userId: actors[0]});
    Q.collection("activityMembers").insertOne({...template, _id: `event:${eventId}:${owner.userId}`,
      syncKey: `event:${eventId}:${owner.userId}`, ownerType: "event", ownerId: eventId, userId: owner.userId,
      role: "Admin", status: "accepted", actionAtIso: now, updatedDate: now});
    Q.printObject({checkpointId, groupId, eventId, prepared: true, publicationFlowTested: false});
    return;
  }
  if (command === "prepare-admin-previews") {
    const groupId = "manual-qa-community-admin";
    const event = Q.collection("events").findOne({sourceId: "f02609260000000000000101", workspaceGroupId: groupId});
    const asset = Q.collection("assets").findOne({assetId: "6c8ac25e7a63755e53c46093", status: "A"});
    const moderation = Q.collection("contentModerationState").findOne({_id: `group:${groupId}`});
    if (!state.adminLifecycleSnapshots || !event || !asset || !moderation || moderation.pending?.length) {
      Q.fail("Retained Admin snapshots, Feed event and existing preview Asset are required, with no pending writes.");
    }
    const sources = [{category: "event", sourceId: event.sourceId, record: event},
      {category: "asset", sourceId: asset.assetId, record: asset}];
    if (sources.some(source => Q.collection("contentModerationItems").countDocuments({_id: `${source.category}:${source.sourceId}`}))) {
      Q.fail("Preview entries already exist; do not replace moderation records.");
    }
    // Read-only preview prerequisites only. Existing resource documents stay
    // untouched; the retained group-scope moderation snapshots own these rows.
    const now = Q.nowIso();
    Q.collection("contentModerationItems").insertMany(sources.map(({category, sourceId, record}) => ({
      _id: `${category}:${sourceId}`, category, sourceId, ownerUserId: record.ownerUserId,
      title: record.title, imageUrl: record.imageUrl || "", submittedAtIso: now,
      status: "accepted", version: 1, commandId: `manual-qa-preview:${sourceId}`,
      reviewedBy: "", reviewedAtIso: "", publiclyVisibleOnce: true, deleted: false, workspaceGroupId: groupId
    })));
    Q.collection("contentModerationState").updateOne({_id: moderation._id}, {$inc: {
      revision: 1, "counts.event.accepted": 1, "counts.asset.accepted": 1
    }});
    const revision = Q.collection("contentModerationState").findOne({_id: moderation._id}).revision;
    Q.collection("communityGroups").updateOne({_id: groupId}, {$set: {moderationQueueRevision: revision}});
    Q.printObject({checkpointId, groupId, previewIds: sources.map(source => `${source.category}:${source.sourceId}`),
      prepared: true, resourceWrites: false, publicationFlowTested: false});
    return;
  }
  if (command === "prepare-admin-base-chat-read") {
    const chatId = "1ba26e819a02104398ea0799";
    if (!state.adminLifecycleSnapshots || state.adminBaseChatReadPrepared
        || !Q.collection("chats").countDocuments({id: chatId, ownerUserId: actors[0], unread: {$gt: 0}})) {
      Q.fail("A live Admin control and unread Base chat are required; do not recapture this boundary.");
    }
    const retained = Q.snapshotSpecs([
      {collection: "chats", selector: {id: chatId}},
      {collection: "chatMessages", selector: {chatId}}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {
      adminLifecycleSnapshots: state.adminLifecycleSnapshots.concat(retained), adminBaseChatReadPrepared: true
    }});
    Q.printObject({checkpointId, chatId, prepared: true, productWrites: false});
    return;
  }
  if (command === "prepare-admin-base-chat-message") {
    const chatId = "1ba26e819a02104398ea0799";
    if (!state.adminLifecycleSnapshots || !state.adminBaseChatReadPrepared || state.adminBaseChatMessagePrepared) {
      Q.fail("Retain the Base chat snapshot first; do not recapture a message boundary.");
    }
    const owners = Q.collection("chats").distinct("ownerUserId", {id: chatId});
    if (!owners.includes(actors[0]) || !owners.includes(actors[2])) Q.fail("Expected Base chat actors are missing.");
    const retained = Q.snapshotSpecs([
      {collection: "users", selector: {userId: {$in: owners.filter(id => !actors.includes(id))}}},
      {collection: "userNotifications", selector: {sourceType: "chat", sourceId: chatId}},
      {collection: "notificationOutbox", selector: {entityType: "chat", entityId: chatId}}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {
      adminLifecycleSnapshots: state.adminLifecycleSnapshots.concat(retained), adminBaseChatMessagePrepared: true
    }});
    Q.printObject({checkpointId, chatId, prepared: true, productWrites: false});
    return;
  }
  if (command === "prepare-admin-base-feed") {
    if (!state.adminLifecycleSnapshots || state.adminBaseFeedUnrelatedItems) {
      Q.fail("A live Admin control without a prepared base Feed branch is required.");
    }
    const selector = {category: "feed", ownerUserId: actors[2], workspaceGroupId: null};
    const snapshots = Q.snapshotSpecs([
      {collection: "photoFeedPosts", selector: {creatorUserId: actors[2], workspaceGroupId: null}},
      {collection: "contentModerationItems", selector},
      {collection: "contentModerationState", selector: {_id: "global"}}
    ]);
    const unrelated = Q.collection("contentModerationItems").find({workspaceGroupId: null, $nor: [selector]}).toArray();
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {
      adminLifecycleSnapshots: state.adminLifecycleSnapshots.concat(snapshots),
      adminBaseFeedUnrelatedItems: unrelated
    }});
    Q.printObject({checkpointId, baseFeedPrepared: true, userId: actors[2], productWrites: false});
    return;
  }
  if (command === "restore-admin-lifecycle") {
    if (!state.adminLifecycleSnapshots) Q.fail("No Admin lifecycle snapshot.");
    if (state.adminBaseFeedUnrelatedItems) {
      const unrelated = Q.collection("contentModerationItems").find({workspaceGroupId: null,
        $nor: [{category: "feed", ownerUserId: actors[2], workspaceGroupId: null}]}).toArray();
      if (!Q.sameJson(ordered(unrelated), ordered(state.adminBaseFeedUnrelatedItems))) {
        Q.fail("Unrelated app moderation changed; restore its scoped control before the Admin fixture.");
      }
      const global = Q.collection("contentModerationState").findOne({_id: "global"});
      if (global && global.pending && global.pending.length) Q.fail("App moderation still has pending writes.");
    }
    // Chat maps its Java chatId field to Mongo "id". Normalize the retained
    // selector from the first moderation control prepared before this correction.
    Q.restoreSnapshots(state.adminLifecycleSnapshots.map(snapshot =>
      snapshot.collection === "chats" && snapshot.selector.chatId
        ? {...snapshot, selector: {id: snapshot.selector.chatId}} : snapshot));
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {adminLifecycleSnapshots: "", adminBaseFeedUnrelatedItems: "", adminBaseChatReadPrepared: "", adminBaseChatMessagePrepared: ""}});
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
    const boundary = (state.savepoints || []).find(item => item.name === "after-workspace-selection");
    const creationListBaseline = boundary ? boundary.snapshots.slice(0, 2) : snapshots;
    verifyLists(creationListBaseline);
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
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$set: {creationSnapshots: retained, creationListBaseline, creationUnrelatedModeration: unrelatedModeration}});
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
      {collection: "userReports", selector: {sourceType: "community", sourceId: {$in: ids}}, documents: []},
      {collection: "contentModerationState", selector: {_id: {$in: ids.map(id => "group:" + id)}}, documents: []}
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne({_id: state._id}, {$unset: {creationSnapshots: "", creationListBaseline: "", creationUnrelatedModeration: ""}});
    verifyLists(state.creationListBaseline || snapshots);
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
    const boundaries = {"lists-ready": 1, "block-1-complete": 2, "after-editor-checks": 4, "after-join-approval": 4, "after-invitation-checks": 5, "after-workspace-selection": 5, "after-moderation-checks": 7, "after-membership-trash": 8, "after-chat-sharing": 10, "after-cash-history": 11, "after-contacts": 12, "after-contact-controls": 13};
    if (!Object.hasOwn(boundaries, name)) Q.fail("Unknown Group savepoint boundary.");
    if (state.locationControlSnapshot || state.locationInvitationSnapshots || state.contactSnapshots || state.sharingSnapshots || state.chatSharingSnapshots || state.cashHistorySnapshots || state.adminLifecycleSnapshots || state.paginationSnapshots || state.invitationSnapshots || state.memberInvitationSnapshots || state.editorSnapshots || state.creationSnapshots) Q.fail("Restore temporary controls before a savepoint operation.");
    let savepoint = (state.savepoints || []).find(item => item.name === name);
    if (command === "capture") {
      if (savepoint) Q.fail("Savepoint already exists; retained evidence must not be overwritten.");
      if (["after-join-approval", "after-invitation-checks", "after-workspace-selection", "after-moderation-checks", "after-membership-trash", "after-chat-sharing", "after-cash-history", "after-contacts", "after-contact-controls"].includes(name)) {
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
      if (name === "after-workspace-selection" && Q.collection("users").findOne({userId: actors[0]})?.activeWorkspaceGroupId !== "seed-community-design-circle")
        Q.fail("Workspace boundary requires Alex's persisted Design Circle selection after timeout/retry checks.");
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
    adminLifecyclePrepared: !!state.adminLifecycleSnapshots,
    editorPrepared: !!state.editorSnapshots,
    creationPrepared: !!state.creationSnapshots,
    retainedTemporaryControls: Object.keys(state).filter(key => /Snapshots?$/.test(key) && state[key]),
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
