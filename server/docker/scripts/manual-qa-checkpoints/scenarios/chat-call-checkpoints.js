/* global ManualQa, db, process */
(() => {
  "use strict";
  const Q = ManualQa;
  const SCENARIO = "chat-call", CHECKPOINT = "CHAT-CALL-001";
  const CHAT = "manual-qa-checkpoint:v1:chat-call:room";
  const ACTORS = [
    { id: "6500000000000000000000c1", name: "WebRTC Alice", initials: "WA" },
    { id: "6500000000000000000000c2", name: "WebRTC Bob", initials: "WB" },
    { id: "6500000000000000000000c3", name: "WebRTC Carol", initials: "WC" }
  ];
  const ids = ACTORS.map(actor => actor.id);
  const userSelector = { $or: [{ _id: { $in: ids } }, { userId: { $in: ids } }] };
  const chatSelector = { id: CHAT };
  function status() {
    Q.activeState(SCENARIO, true);
    const rows = Q.collection("chats").find(chatSelector).toArray();
    const valid = rows.length === 3 && rows.every(row => row.title === "WebRTC test chat"
      && Q.sameJson(row.memberIds, ids)) && Q.collection("users").countDocuments(userSelector) === 3
      && Q.collection("users").countDocuments({ userId: ids[0], hostTier: "Admin" }) === 1;
    if (!valid) Q.fail("WebRTC fixture baseline is inconsistent.");
    Q.printObject({ scenario: SCENARIO, checkpointId: CHECKPOINT, phase: "fixture-ready", chatId: CHAT,
      chatTitle: "WebRTC test chat", actors: ACTORS,
      persistedChatMessages: Q.collection("chatMessages").countDocuments({ chatId: CHAT }) });
  }
  function stage() {
    Q.assertNotStaged(SCENARIO);
    // Dedicated actors and chat namespace leave parked QA fixtures and their users intact.
    if (Q.collection("users").countDocuments(userSelector) || Q.collection("chats").countDocuments(chatSelector)) {
      Q.fail("WebRTC fixture namespace is occupied; refusing to replace it.");
    }
    const source = Q.ensureUser("bf057de7c586eede7e84bdc7", "demo profile template");
    const snapshots = Q.snapshotSpecs([
      { collection: "users", selector: userSelector }, { collection: "chats", selector: chatSelector },
      { collection: "chatMessages", selector: { chatId: CHAT } }
    ]);
    Q.collection(Q.STATE_COLLECTION).insertOne({ _id: Q.stateId(SCENARIO), scenario: SCENARIO,
      checkpointId: CHECKPOINT, database: db.getName(), stagedAtIso: Q.nowIso(), phase: "staging", snapshots });
    try {
      Q.collection("users").insertMany(ACTORS.map(actor => {
        const profile = { ...source, _id: actor.id, userId: actor.id, accountUserId: actor.id,
          name: actor.name, initials: actor.initials, email: `webrtc-${actor.initials.toLowerCase()}@demo.myscoutee.test`,
          syncKey: actor.id, images: [], hostTier: actor.id === ids[0] ? "Admin" : "Member",
          statusText: actor.id === ids[0] ? "Admin workspace" : "Member",
          activities: { chats: 1, chat: { all: 1, contacts: 1 } } };
        delete profile.firebaseUid; delete profile.workspaceGroupId;
        return profile;
      }));
      Q.collection("chats").insertMany(ACTORS.map(actor => ({ _id: `${CHAT}:${actor.id}`, id: CHAT,
        ownerUserId: actor.id, memberIds: ids, channelType: "general", avatar: "WC", title: "WebRTC test chat",
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
