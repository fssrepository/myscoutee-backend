/* global ManualQa, db, EJSON, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "chat-domain";
  const CHECKPOINT = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const COMMAND = Q.text(process.env.MANUAL_QA_COMMAND);
  const LIST_CHECKPOINT = "CHAT-LIST-001";
  const PREFIX = "manual-qa-checkpoint:v1:chat-list";
  const CASEY_ID = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID) || "650000000000000000000061";
  const NOVA_ID = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID) || "650000000000000000000062";
  const CONTEXTS = [
    { key: "event", channelType: "mainEvent", suffix: "event", title: "QA Chat · Main event", avatar: "QE" },
    { key: "group", channelType: "groupSubEvent", suffix: "group", title: "QA Chat · Group", avatar: "QG" },
    { key: "service", channelType: "serviceEvent", suffix: "service", title: "QA Chat · Service", avatar: "QS" },
    { key: "appSupport", channelType: "appSupport", suffix: "support", title: "QA Chat · App Support", avatar: "QA" }
  ];

  function assertCheckpoint() {
    if (CHECKPOINT !== LIST_CHECKPOINT) {
      Q.fail(`unsupported Chat checkpoint '${CHECKPOINT}'.`);
    }
  }

  function chatId(item) {
    return `${PREFIX}:${item.suffix}`;
  }

  function fixtureSelector() {
    return { $or: [{ ownerUserId: CASEY_ID }, { id: { $regex: `^${PREFIX}:` } }] };
  }

  function snapshotSpecs() {
    return [
      { collection: "chats", selector: fixtureSelector() },
      { collection: "chatMessages", selector: { chatId: { $regex: `^${PREFIX}:` } } },
      { collection: "users", selector: { $or: [{ _id: CASEY_ID }, { userId: CASEY_ID }] } }
    ];
  }

  function listSnapshot() {
    const chats = Q.collection("chats").find(fixtureSelector()).sort({ id: 1, _id: 1 }).toArray();
    const messages = Q.collection("chatMessages")
      .find({ chatId: { $regex: `^${PREFIX}:` } })
      .sort({ chatId: 1, sentAtIso: 1, _id: 1 })
      .toArray();
    const user = Q.collection("users").findOne({ $or: [{ _id: CASEY_ID }, { userId: CASEY_ID }] }) || {};
    return {
      chats,
      messages,
      activities: user.activities || null
    };
  }

  function sameNormalizedSnapshot(left, right) {
    const asPlainExtendedJson = value => JSON.parse(EJSON.stringify(value, null, 0, { relaxed: false }));
    return Q.sameJson(asPlainExtendedJson(left), asPlainExtendedJson(right));
  }

  function expectedSummary(snapshot) {
    const chats = snapshot.chats || [];
    const byType = Object.fromEntries(chats.map(item => [Q.text(item.channelType), item]));
    const descendingIds = [...chats]
      .sort((left, right) => Q.text(right.dateIso).localeCompare(Q.text(left.dateIso))
        || Q.text(left.id).localeCompare(Q.text(right.id)))
      .map(item => Q.text(item.id));
    const expectedDescendingIds = [...CONTEXTS].reverse().map(chatId);
    const activities = snapshot.activities || {};
    const activityChat = activities.chat || {};
    return {
      exactRows: chats.length === CONTEXTS.length
        && CONTEXTS.every(item => {
          const row = byType[item.channelType];
          return row
            && Q.text(row.id) === chatId(item)
            && Q.text(row.ownerUserId) === CASEY_ID
            && Q.text(row.title) === item.title
            && Q.number(row.unread) === 1;
        }),
      exactDateDescendingOrder: Q.sameJson(descendingIds, expectedDescendingIds),
      zeroMessages: (snapshot.messages || []).length === 0,
      exactCounters: Q.number(activities.chats) === 4
        && Q.number(activityChat.all) === 4
        && Q.number(activityChat.event) === 1
        && Q.number(activityChat.subEvent) === 0
        && Q.number(activityChat.group) === 1
        && Q.number(activityChat.service) === 1
        && Q.number(activityChat.appSupport) === 1
    };
  }

  function fixtureChat(item, dateIso) {
    const id = chatId(item);
    const eventId = `${PREFIX}:event`;
    const subEventId = item.key === "group" ? `${eventId}:stage` : null;
    const groupId = item.key === "group" ? `${subEventId}:group` : null;
    return {
      _id: `${id}:${CASEY_ID}`,
      id,
      ownerUserId: CASEY_ID,
      avatar: item.avatar,
      title: item.title,
      lastMessage: `${item.title} controlled list row.`,
      lastSenderId: NOVA_ID,
      memberIds: [CASEY_ID, NOVA_ID],
      unread: 1,
      dateIso,
      channelType: item.channelType,
      ownerId: groupId || eventId,
      eventId,
      ownerStatus: "A",
      revision: 1,
      subEventId,
      groupId
    };
  }

  function stage() {
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    Q.ensureUser(CASEY_ID, "Casey chat-list actor");
    Q.ensureUser(NOVA_ID, "Nova chat-list counterpart");
    const snapshots = Q.snapshotSpecs(snapshotSpecs());
    const stagedAtIso = Q.nowIso();
    const baseTime = new Date(stagedAtIso).getTime() - 5 * 60000;

    Q.collection("chats").deleteMany(fixtureSelector());
    Q.collection("chatMessages").deleteMany({ chatId: { $regex: `^${PREFIX}:` } });
    Q.collection("chats").insertMany(CONTEXTS.map((item, index) =>
      fixtureChat(item, new Date(baseTime + index * 60000).toISOString())));
    const userUpdate = Q.collection("users").updateOne(
      { $or: [{ _id: CASEY_ID }, { userId: CASEY_ID }] },
      { $set: {
        "activities.chats": 4,
        "activities.chat.all": 4,
        "activities.chat.event": 1,
        "activities.chat.subEvent": 0,
        "activities.chat.group": 1,
        "activities.chat.service": 1,
        "activities.chat.appSupport": 1
      } }
    );
    if (userUpdate.matchedCount !== 1) Q.fail("Casey's Chat activity projection could not be staged.");

    const baseline = listSnapshot();
    const validation = expectedSummary(baseline);
    if (!Object.values(validation).every(Boolean)) {
      Q.restoreSnapshots(snapshots);
      Q.fail(`CHAT-LIST-001 fixture validation failed: ${JSON.stringify(validation)}.`);
    }
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      database: db.getName(),
      stagedAtIso,
      context: {
        actorUserId: CASEY_ID,
        expectedDescendingIds: [...CONTEXTS].reverse().map(chatId),
        expectedAscendingIds: CONTEXTS.map(chatId),
        contextIds: Object.fromEntries(CONTEXTS.map(item => [item.key, chatId(item)]))
      },
      snapshots,
      baseline
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpoint: CHECKPOINT,
      phase: "fixture-ready",
      actor: Q.user(CASEY_ID),
      expected: {
        all: 4,
        event: 1,
        subEvent: 0,
        group: 1,
        service: 1,
        appSupport: 1,
        descendingIds: [...CONTEXTS].reverse().map(chatId)
      },
      validation,
      mutation: "Only the replayable Chat list fixture, Casey's matching activity counters and the checkpoint snapshot were written.",
      next: "Run the authenticated Java read oracle, then the same status command before opening the managed Casey browser."
    });
  }

  function status() {
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({ scenario: SCENARIO, checkpoint: CHECKPOINT, phase: "not-staged", next: `Run stage chat-domain ${CHECKPOINT}.` });
      return;
    }
    if (Q.text(state.checkpointId) !== CHECKPOINT) {
      Q.fail(`active Chat checkpoint is '${Q.text(state.checkpointId)}', not '${CHECKPOINT}'.`);
    }
    const current = listSnapshot();
    const validation = expectedSummary(current);
    validation.zeroWriteSnapshot = sameNormalizedSnapshot(current, state.baseline);
    if (!Object.values(validation).every(Boolean)) {
      Q.fail(`CHAT-LIST-001 fixture/read drift detected: ${JSON.stringify(validation)}.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpoint: CHECKPOINT,
      phase: "fixture-ready",
      actor: Q.user(CASEY_ID),
      expected: state.context,
      validation,
      next: "If the authenticated Java oracle also passed, the managed Casey browser may execute the short context-switch and reopen check."
    });
  }

  function reset() {
    const state = Q.activeState(SCENARIO, true);
    if (Q.text(state.checkpointId) !== CHECKPOINT) {
      Q.fail(`active Chat checkpoint is '${Q.text(state.checkpointId)}', not '${CHECKPOINT}'.`);
    }
    Q.restoreSnapshots(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    const remaining = Q.collection("chats").countDocuments({ id: { $regex: `^${PREFIX}:` } })
      + Q.collection("chatMessages").countDocuments({ chatId: { $regex: `^${PREFIX}:` } });
    if (remaining !== 0) Q.fail(`reset left ${remaining} CHAT-LIST-001 fixture rows.`);
    Q.printObject({
      scenario: SCENARIO,
      checkpoint: CHECKPOINT,
      phase: "reset-complete",
      restored: true,
      detail: "The exact pre-fixture Casey chat rows and user activity projection were restored."
    });
  }

  Q.assertDeploymentSafety();
  assertCheckpoint();
  if (COMMAND === "stage") stage();
  else if (COMMAND === "status") status();
  else if (COMMAND === "reset") reset();
  else Q.fail(`unsupported command '${COMMAND}' for ${SCENARIO}.`);
})();
