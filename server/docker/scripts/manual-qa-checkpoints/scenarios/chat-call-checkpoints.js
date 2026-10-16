/* global ManualQa, db, process */
(() => {
  "use strict";
  const Q = ManualQa;
  const SCENARIO = "chat-call", CHECKPOINT = "CHAT-CALL-001";
  const CHAT = "manual-qa-checkpoint:v1:chat-call:room";
  const EVENT = "manual-qa-chat-call-event";
  const ACTORS = [
    { id: "6500000000000000000000c1", name: "WebRTC Alice", initials: "WA" },
    { id: "6500000000000000000000c2", name: "WebRTC Bob", initials: "WB" },
    { id: "6500000000000000000000c3", name: "WebRTC Carol", initials: "WC" },
    { id: "6500000000000000000000c4", name: "WebRTC David", initials: "WD" },
    { id: "6500000000000000000000c5", name: "WebRTC Emma", initials: "WE" },
    { id: "6500000000000000000000c6", name: "WebRTC Frank", initials: "WF" },
    { id: "6500000000000000000000c7", name: "WebRTC Grace", initials: "WG" }
  ];
  const ids = ACTORS.map(actor => actor.id);
  const userSelector = { $or: [{ _id: { $in: ids } }, { userId: { $in: ids } }] };
  const chatSelector = { id: CHAT };
  function status() {
    Q.activeState(SCENARIO, true);
    const rows = Q.collection("chats").find(chatSelector).toArray();
    const valid = rows.length === ACTORS.length && rows.every(row => row.title === "WebRTC test chat"
      && Q.sameJson(row.memberIds, ids)) && Q.collection("users").countDocuments(userSelector) === ACTORS.length
      && Q.collection("activityMembers").countDocuments({ ownerType: "event", ownerId: EVENT,
        userId: ids[0], role: "Admin", status: "accepted" }) === 1
      && Q.collection("users").countDocuments({ userId: { $in: ids }, accountUserId: { $ne: null } }) === 0;
    if (!valid) Q.fail("WebRTC fixture baseline is inconsistent.");
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "fixture-ready", chatId: CHAT,
      chatTitle: "WebRTC test chat", eventId: EVENT, moderatorAuthority: "event-admin", actors: ACTORS,
      persistedChatMessages: Q.collection("chatMessages").countDocuments({ chatId: CHAT }) });
  }
  function stage() {
    Q.assertNotStaged(SCENARIO);
    // Dedicated actors and chat namespace leave parked QA fixtures and their users intact.
    if (Q.collection("users").countDocuments(userSelector) || Q.collection("chats").countDocuments(chatSelector)
      || Q.collection("events").countDocuments({ sourceId: EVENT })
      || Q.collection("activityMembers").countDocuments({ ownerId: EVENT })) {
      Q.fail("WebRTC fixture namespace is occupied; refusing to replace it.");
    }
    const source = Q.ensureUser("bf057de7c586eede7e84bdc7", "demo profile template");
    const snapshots = Q.snapshotSpecs([
      { collection: "users", selector: userSelector }, { collection: "chats", selector: chatSelector },
      { collection: "chatMessages", selector: { chatId: CHAT } },
      { collection: "privacyConsents", selector: { userId: { $in: ids } } },
      { collection: "events", selector: { sourceId: EVENT } },
      { collection: "activityMembers", selector: { ownerId: EVENT } },
      { collection: "userSessionStates", selector: { _id: { $in: ids } } },
      { collection: "userSessionActions", selector: { userId: { $in: ids } } },
      { collection: "userPageFilterPreferences", selector: { userId: { $in: ids } } }
    ]);
    Q.collection(Q.STATE_COLLECTION).insertOne({ _id: Q.stateId(SCENARIO), scenario: SCENARIO,
      checkpointId: CHECKPOINT, database: db.getName(), stagedAtIso: Q.nowIso(), phase: "staging", snapshots });
    try {
      Q.collection("users").insertMany(ACTORS.map(actor => {
        const profile = { ...source, _id: actor.id, userId: actor.id,
          name: actor.name, initials: actor.initials, email: `webrtc-${actor.initials.toLowerCase()}@demo.myscoutee.test`,
          syncKey: actor.id, images: [], hostTier: "Member", statusText: "Member",
          activities: { chats: 1, chat: { all: 1, events: 1 } } };
        delete profile.firebaseUid; delete profile.workspaceGroupId; delete profile.accountUserId;
        return profile;
      }));
      const now = Q.nowIso();
      const startAtIso = new Date(Date.now() + 86400000).toISOString();
      const endAtIso = new Date(Date.now() + 90000000).toISOString();
      Q.collection("events").insertOne({ _id: EVENT, sourceId: EVENT, syncKey: EVENT,
        ownerUserId: ids[0], creatorUserId: ids[0], creatorName: ACTORS[0].name,
        creatorInitials: ACTORS[0].initials, admins: [ids[0]], title: "WebRTC test event",
        subtitle: "Isolated call authority fixture", status: "A", published: true,
        mode: "Casual", eventType: "main", visibility: "Invitation only", blindMode: "Open Event",
        startAtIso, endAtIso, capacityMin: 2, capacityMax: ids.length, capacityTotal: ids.length,
        full: true, acceptedMembers: ids.length, pendingMembers: 0, acceptedMemberUserIds: ids,
        pendingMemberUserIds: [], invitedMemberUserIds: [], pendingRequestMemberUserIds: [],
        autoInviter: false, ticketing: false, approvalRequired: false, topics: [],
        location: source.city, locationCoordinates: source.locationCoordinates,
        expired: false, subEventsEnabled: false, subEvents: [], subEventDefinitions: [],
        createdDate: now, createdUser: Q.ACTOR, updatedDate: now, updatedUser: Q.ACTOR });
      Q.collection("activityMembers").insertMany(ACTORS.map((actor, index) => ({
        _id: `${EVENT}:${actor.id}`, syncKey: `${EVENT}:${actor.id}`, ownerType: "event", ownerId: EVENT,
        userId: actor.id, role: index === 0 ? "Admin" : "Member", status: "accepted", organizerOnly: false,
        actionAtIso: now, createdDate: now, createdUser: Q.ACTOR, updatedDate: now, updatedUser: Q.ACTOR })));
      Q.collection("chats").insertMany(ACTORS.map(actor => ({ _id: `${CHAT}:${actor.id}`, id: CHAT,
        ownerUserId: actor.id, memberIds: ids, channelType: "mainEvent", ownerId: EVENT, eventId: EVENT,
        avatar: "WC", title: "WebRTC test chat",
        lastMessage: "WebRTC call fixture", lastSenderId: ids[0], unread: 0, dateIso: Q.nowIso(), revision: 1 })));
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: Q.stateId(SCENARIO) }, { $set: { phase: "fixture-ready" } });
      status();
    } catch (error) {
      Q.restoreSnapshots(snapshots); Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: Q.stateId(SCENARIO) }); throw error;
    }
  }
  function reset() {
    const state = Q.activeState(SCENARIO, true);
    Q.restoreSnapshots(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "reset-complete", restored: true });
  }
  Q.assertDeploymentSafety();
  if (Q.text(process.env.MANUAL_QA_CHECKPOINT_ID) !== CHECKPOINT) Q.fail("Wrong WebRTC checkpoint.");
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  if (command === "stage") stage();
  else if (["status", "ready"].includes(command)) status();
  else if (command === "reset") reset();
  else Q.fail("Unsupported WebRTC fixture command.");
})();
