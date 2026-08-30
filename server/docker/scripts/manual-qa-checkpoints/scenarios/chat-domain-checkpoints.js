/* global ManualQa, db, EJSON, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "chat-domain";
  const CHECKPOINT = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const COMMAND = Q.text(process.env.MANUAL_QA_COMMAND);
  const LIST_CHECKPOINT = "CHAT-LIST-001";
  const FLOW_CHECKPOINT = "CHAT-FLOW-001";
  const PREFIX = "manual-qa-checkpoint:v1:chat-list";
  const FLOW_PREFIX = "manual-qa-checkpoint:v1:chat-flow";
  const CASEY_ID = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID) || "650000000000000000000061";
  const NOVA_ID = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID) || "650000000000000000000062";
  const RILEY_ID = "650000000000000000000063";
  const FLOW_ACTOR_IDS = [CASEY_ID, NOVA_ID, RILEY_ID];
  const FLOW_EVENT_ID = `${FLOW_PREFIX}:event`;
  const FLOW_STAGE_ID = `${FLOW_EVENT_ID}:stage`;
  const FLOW_GROUP_ID = `${FLOW_STAGE_ID}:group`;
  const FLOW_FIRST_MESSAGE = "QA CHAT FLOW 001 · Casey live message";
  const FLOW_SECOND_MESSAGE = "QA CHAT FLOW 001 · Casey recovery message";
  const FLOW_LIST_POLL_MESSAGE = "QA CHAT FLOW 001 · Casey list poll message";
  const CONTEXTS = [
    { key: "event", channelType: "mainEvent", suffix: "event", title: "QA Chat · Main event", avatar: "QE" },
    { key: "group", channelType: "groupSubEvent", suffix: "group", title: "QA Chat · Group", avatar: "QG" },
    { key: "service", channelType: "serviceEvent", suffix: "service", title: "QA Chat · Service", avatar: "QS" },
    { key: "appSupport", channelType: "appSupport", suffix: "support", title: "QA Chat · App Support", avatar: "QA" }
  ];

  function assertCheckpoint() {
    if (![LIST_CHECKPOINT, FLOW_CHECKPOINT].includes(CHECKPOINT)) {
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

  function listStage() {
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

  function listStatus() {
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

  function listReset() {
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

  function flowChatId(item) {
    return `${FLOW_PREFIX}:${item.suffix}`;
  }

  function flowRelatedSelector() {
    return { $or: [
      { entityId: { $regex: `^${FLOW_PREFIX}:` } },
      { sourceId: { $regex: `^${FLOW_PREFIX}:` } },
      { "payload.chatId": { $regex: `^${FLOW_PREFIX}:` } },
      { "payload.eventId": FLOW_EVENT_ID }
    ] };
  }

  function flowSnapshotSpecs() {
    return [
      { collection: "chats", selector: { $or: [
        { ownerUserId: { $in: FLOW_ACTOR_IDS } },
        { id: { $regex: `^${FLOW_PREFIX}:` } }
      ] } },
      { collection: "chatMessages", selector: { chatId: { $regex: `^${FLOW_PREFIX}:` } } },
      { collection: "activityMembers", selector: { ownerId: { $in: [FLOW_EVENT_ID, FLOW_GROUP_ID] } } },
      { collection: "users", selector: { $or: [
        { _id: { $in: FLOW_ACTOR_IDS } },
        { userId: { $in: FLOW_ACTOR_IDS } }
      ] } },
      { collection: "notificationOutbox", selector: flowRelatedSelector() },
      { collection: "userNotifications", selector: flowRelatedSelector() }
    ];
  }

  function flowUserRecord(userId) {
    return Q.ensureUser(userId, "CHAT-FLOW-001 actor");
  }

  function flowAvatar(userId) {
    const user = flowUserRecord(userId);
    return {
      id: userId,
      initials: Q.text(user.initials) || Q.text(user.name).split(/\s+/).map(part => part.charAt(0)).join("").slice(0, 2).toUpperCase(),
      gender: Q.text(user.gender) || "neutral"
    };
  }

  function flowChat(item, ownerUserId, dateIso, lastMessage, lastSenderId) {
    const id = flowChatId(item);
    const isGroup = item.key === "group";
    return {
      _id: `${id}:${ownerUserId}`,
      id,
      ownerUserId,
      avatar: item.avatar,
      title: item.title,
      lastMessage,
      lastSenderId,
      memberIds: [...FLOW_ACTOR_IDS],
      unread: 0,
      dateIso,
      channelType: item.channelType,
      ownerId: isGroup ? FLOW_GROUP_ID : FLOW_EVENT_ID,
      eventId: FLOW_EVENT_ID,
      ownerStatus: "A",
      revision: 1,
      subEventId: isGroup ? FLOW_STAGE_ID : null,
      groupId: isGroup ? FLOW_GROUP_ID : null
    };
  }

  function flowMember(ownerType, ownerId, userId, role, nowIso) {
    return {
      _id: `${FLOW_PREFIX}:member:${ownerType}:${ownerId}:${userId}`,
      syncKey: `${FLOW_PREFIX}:member:${ownerType}:${ownerId}:${userId}`,
      ownerType,
      ownerId,
      userId,
      role,
      status: "accepted",
      pendingSource: null,
      requestKind: null,
      invitedByUserId: null,
      actionAtIso: nowIso,
      createdDate: nowIso,
      createdUser: CASEY_ID,
      updatedDate: nowIso,
      updatedUser: CASEY_ID
    };
  }

  function flowMessage(index, sentAtIso) {
    const senderUserId = FLOW_ACTOR_IDS[index % FLOW_ACTOR_IDS.length];
    const sender = flowUserRecord(senderUserId);
    const readers = FLOW_ACTOR_IDS.filter(userId => userId !== senderUserId).map(flowAvatar);
    const id = `${FLOW_PREFIX}:history:${String(index + 1).padStart(2, "0")}`;
    return {
      _id: `chat-message:${flowChatId(CONTEXTS[1])}:${id}`,
      chatId: flowChatId(CONTEXTS[1]),
      id,
      clientId: `${id}:client`,
      sender: Q.text(sender.name) || senderUserId,
      senderAvatar: flowAvatar(senderUserId),
      text: `QA history ${String(index + 1).padStart(2, "0")}`,
      time: new Date(sentAtIso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
      sentAtIso,
      mine: false,
      readBy: readers,
      deletedAtIso: null,
      deletedByUserId: null,
      deletedByName: null,
      editedAtIso: null,
      pinnedAtIso: null,
      pinnedByUserId: null,
      replyTo: null,
      reactions: [],
      attachments: [],
      messageSenderUserIds: [senderUserId],
      messageReadByUserIds: readers.map(reader => reader.id),
      messageReactionUserIds: [],
      messageAttachmentKeys: [],
      pollVoterUserIds: []
    };
  }

  function flowSnapshot() {
    const chats = Q.collection("chats")
      .find({ $or: [{ ownerUserId: { $in: FLOW_ACTOR_IDS } }, { id: { $regex: `^${FLOW_PREFIX}:` } }] })
      .sort({ ownerUserId: 1, id: 1, _id: 1 })
      .toArray();
    const messages = Q.collection("chatMessages")
      .find({ chatId: { $regex: `^${FLOW_PREFIX}:` } })
      .sort({ sentAtIso: 1, id: 1 })
      .toArray();
    const members = Q.collection("activityMembers")
      .find({ ownerId: { $in: [FLOW_EVENT_ID, FLOW_GROUP_ID] } })
      .sort({ ownerType: 1, ownerId: 1, userId: 1 })
      .toArray();
    const users = FLOW_ACTOR_IDS.map(userId => {
      const user = Q.collection("users").findOne({ $or: [{ _id: userId }, { userId }] }) || {};
      return { userId, activities: user.activities || null };
    });
    const outbox = Q.collection("notificationOutbox").find(flowRelatedSelector()).sort({ createdDate: 1, _id: 1 }).toArray();
    const notifications = Q.collection("userNotifications").find(flowRelatedSelector()).sort({ createdDate: 1, _id: 1 }).toArray();
    return { chats, messages, members, users, outbox, notifications };
  }

  function flowCounterZero(user) {
    const activities = user.activities || {};
    const chat = activities.chat || {};
    return Q.number(activities.chats) === 0
      && Q.number(chat.all) === 0
      && Q.number(chat.event) === 0
      && Q.number(chat.subEvent) === 0
      && Q.number(chat.group) === 0
      && Q.number(chat.service) === 0
      && Q.number(chat.appSupport) === 0;
  }

  function flowBaselineValidation(snapshot) {
    const expectedChatIds = CONTEXTS.map(flowChatId);
    const history = snapshot.messages || [];
    return {
      exactOwnerCopies: (snapshot.chats || []).length === FLOW_ACTOR_IDS.length * CONTEXTS.length
        && FLOW_ACTOR_IDS.every(userId => expectedChatIds.every(id => (snapshot.chats || []).some(chat =>
          Q.text(chat.ownerUserId) === userId
          && Q.text(chat.id) === id
          && Q.number(chat.unread) === 0
          && Q.text(chat.ownerStatus) === "A"
          && Q.number(chat.revision) === 1))),
      exactAcceptedMembership: (snapshot.members || []).length === FLOW_ACTOR_IDS.length * 2
        && (snapshot.members || []).every(member => Q.text(member.status) === "accepted"),
      exactHistory: history.length === 18
        && history.every((message, index) => Q.text(message.id) === `${FLOW_PREFIX}:history:${String(index + 1).padStart(2, "0")}`),
      exactReadHistory: history.every(message => {
        const senderId = Q.text(message.senderAvatar && message.senderAvatar.id);
        const expectedReaders = FLOW_ACTOR_IDS.filter(userId => userId !== senderId).sort();
        const actualReaders = (message.messageReadByUserIds || []).map(Q.text).sort();
        return Q.sameJson(actualReaders, expectedReaders);
      }),
      zeroCounters: (snapshot.users || []).length === FLOW_ACTOR_IDS.length && (snapshot.users || []).every(flowCounterZero),
      zeroNotifications: (snapshot.outbox || []).length === 0 && (snapshot.notifications || []).length === 0
    };
  }

  function flowTerminalValidation(snapshot, baseline) {
    const expectedMessageTexts = [FLOW_FIRST_MESSAGE, FLOW_SECOND_MESSAGE, FLOW_LIST_POLL_MESSAGE];
    const newMessages = (snapshot.messages || []).filter(message => expectedMessageTexts.includes(Q.text(message.text)));
    const byText = Object.fromEntries(newMessages.map(message => [Q.text(message.text), message]));
    const exactNewMessages = newMessages.length === expectedMessageTexts.length
      && expectedMessageTexts.every(text => {
        const message = byText[text];
        const readers = (message && message.messageReadByUserIds || []).map(Q.text).sort();
        return message
          && Q.text(message.senderAvatar && message.senderAvatar.id) === CASEY_ID
          && Q.text(message.clientId)
          && Q.sameJson(readers, [NOVA_ID, RILEY_ID].sort());
      });
    const latest = byText[FLOW_LIST_POLL_MESSAGE];
    const groupId = flowChatId(CONTEXTS[1]);
    const groupCopies = (snapshot.chats || []).filter(chat => Q.text(chat.id) === groupId);
    const outbox = snapshot.outbox || [];
    const notifications = snapshot.notifications || [];
    const baselineUsers = Object.fromEntries((baseline && baseline.users || []).map(user => [Q.text(user.userId), user]));
    const currentUsers = Object.fromEntries((snapshot.users || []).map(user => [Q.text(user.userId), user]));
    const notificationCounter = user => Q.number(user && user.activities && user.activities.notifications);
    return {
      exactTwentyOneMessages: (snapshot.messages || []).length === 21,
      exactNewMessages,
      exactFinalSummaries: Boolean(latest) && groupCopies.length === FLOW_ACTOR_IDS.length
        && groupCopies.every(chat => Q.text(chat.lastMessage) === FLOW_LIST_POLL_MESSAGE
          && Q.text(chat.lastSenderId) === CASEY_ID
          && Q.text(chat.dateIso) === Q.text(latest.sentAtIso)
          && Q.number(chat.unread) === 0
          && Q.number(chat.revision) > 1),
      allCountersCleared: (snapshot.users || []).every(flowCounterZero),
      exactOutbox: outbox.length === 3 && outbox.every(row =>
        Q.text(row.notificationType) === "chat-message"
        && Q.text(row.entityType) === "chat"
        && Q.text(row.entityId) === groupId
        && Q.sameJson((row.recipientUserIds || []).map(Q.text).sort(), [RILEY_ID])),
      exactInbox: notifications.length === 3
        && notifications.every(row => Q.text(row.recipientUserId) === RILEY_ID)
        && notifications.every(row => Q.text(row.sourceType) === "chat" && Q.text(row.sourceId) === groupId),
      exactNotificationCounters: notificationCounter(currentUsers[CASEY_ID]) === notificationCounter(baselineUsers[CASEY_ID])
        && notificationCounter(currentUsers[NOVA_ID]) === notificationCounter(baselineUsers[NOVA_ID])
        && notificationCounter(currentUsers[RILEY_ID]) === notificationCounter(baselineUsers[RILEY_ID]) + 3,
      unchangedFixtureMembership: (snapshot.members || []).length === FLOW_ACTOR_IDS.length * 2
        && (snapshot.members || []).every(member => Q.text(member.status) === "accepted")
    };
  }

  function clearFlowFixture() {
    for (const spec of flowSnapshotSpecs()) {
      if (spec.collection === "users") continue;
      Q.collection(spec.collection).deleteMany(spec.selector);
    }
  }

  function flowInsertMany(collectionName, documents, label) {
    if (!Array.isArray(documents)) Q.fail(`${label} is not an array.`);
    if (documents.length === 0) Q.fail(`${label} is unexpectedly empty.`);
    const plainDocuments = documents.map(value => EJSON.parse(EJSON.stringify(value, null, 0, { relaxed: false })));
    try {
      const result = db.runCommand({ insert: collectionName, documents: plainDocuments, ordered: true });
      if (!result || result.ok !== 1 || Q.number(result.n) !== plainDocuments.length) {
        Q.fail(`${label} inserted ${Q.number(result && result.n)} of ${plainDocuments.length} documents.`);
      }
    } catch (error) {
      Q.fail(`${label} insert failed: ${Q.text(error && error.message) || Q.text(error)}.`);
    }
  }

  function flowStage() {
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    FLOW_ACTOR_IDS.forEach(flowUserRecord);
    const snapshots = Q.snapshotSpecs(flowSnapshotSpecs());
    const stagedAtIso = Q.nowIso();
    const stateId = Q.stateId(SCENARIO);
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      database: db.getName(),
      stagedAtIso,
      phase: "staging",
      snapshots
    });
    try {
      clearFlowFixture();

      const firstDay = new Date(new Date(stagedAtIso).getTime() - 28 * 60 * 60 * 1000).getTime();
      const history = Array.from({ length: 18 }, (_value, index) => {
        const dayOffset = index < 9 ? 0 : 24 * 60 * 60 * 1000;
        const minuteOffset = (index % 9) * 7 * 60 * 1000;
        return flowMessage(index, new Date(firstDay + dayOffset + minuteOffset).toISOString());
      });
      flowInsertMany("chatMessages", history, "CHAT-FLOW-001 history");
      const latest = history[history.length - 1];
      const rowBase = new Date(latest.sentAtIso).getTime() - 3 * 60000;
      const rows = [];
      for (const ownerUserId of FLOW_ACTOR_IDS) {
        CONTEXTS.forEach((item, index) => rows.push(flowChat(
          item,
          ownerUserId,
          item.key === "group" ? latest.sentAtIso : new Date(rowBase + index * 30000).toISOString(),
          item.key === "group" ? latest.text : `${item.title} controlled context row.`,
          item.key === "group" ? Q.text(latest.senderAvatar.id) : NOVA_ID
        )));
      }
      flowInsertMany("chats", rows, "CHAT-FLOW-001 owner copies");
      flowInsertMany("activityMembers", [
        ...FLOW_ACTOR_IDS.map((userId, index) => flowMember("event", FLOW_EVENT_ID, userId, index === 0 ? "Admin" : "Member", stagedAtIso)),
        ...FLOW_ACTOR_IDS.map((userId, index) => flowMember("group", FLOW_GROUP_ID, userId, index === 0 ? "Manager" : "Member", stagedAtIso))
      ], "CHAT-FLOW-001 memberships");
      for (const userId of FLOW_ACTOR_IDS) {
        const update = Q.collection("users").updateOne(
          { $or: [{ _id: userId }, { userId }] },
          { $set: {
            "activities.chats": 0,
            "activities.chat.all": 0,
            "activities.chat.event": 0,
            "activities.chat.subEvent": 0,
            "activities.chat.group": 0,
            "activities.chat.service": 0,
            "activities.chat.appSupport": 0
          } }
        );
        if (update.matchedCount !== 1) Q.fail(`CHAT-FLOW-001 user '${userId}' could not be staged.`);
      }
      const baseline = flowSnapshot();
      const validation = flowBaselineValidation(baseline);
      if (!Object.values(validation).every(Boolean)) Q.fail(`CHAT-FLOW-001 fixture validation failed: ${JSON.stringify(validation)}.`);
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: stateId }, { $set: {
        phase: "fixture-ready",
      context: {
        actorUserIds: FLOW_ACTOR_IDS,
        groupChatId: flowChatId(CONTEXTS[1]),
        firstMessage: FLOW_FIRST_MESSAGE,
        secondMessage: FLOW_SECOND_MESSAGE,
        listPollMessage: FLOW_LIST_POLL_MESSAGE,
        expectedContextIds: Object.fromEntries(CONTEXTS.map(item => [item.key, flowChatId(item)])),
        historyIds: history.map(message => message.id)
      },
      baseline
      } });
      Q.printObject({
        scenario: SCENARIO,
        checkpoint: CHECKPOINT,
        phase: "fixture-ready",
        actors: FLOW_ACTOR_IDS.map(Q.user),
        expected: {
          contextsPerActor: 4,
          groupHistory: 18,
          unreadPerActor: 0,
          firstMessage: FLOW_FIRST_MESSAGE,
          secondMessage: FLOW_SECOND_MESSAGE,
          listPollMessage: FLOW_LIST_POLL_MESSAGE
        },
        validation,
        next: "Open the three managed browser sessions, run the authenticated read oracle, then repeat this status command before manual execution."
      });
    } catch (error) {
      Q.restoreSnapshots(snapshots);
      Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: stateId });
      throw error;
    }
  }

  function flowStatus() {
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({ scenario: SCENARIO, checkpoint: CHECKPOINT, phase: "not-staged", next: `Run stage chat-domain ${CHECKPOINT}.` });
      return;
    }
    if (Q.text(state.checkpointId) !== CHECKPOINT) Q.fail(`active Chat checkpoint is '${Q.text(state.checkpointId)}', not '${CHECKPOINT}'.`);
    const current = flowSnapshot();
    const newMessageCount = current.messages.filter(message =>
      [FLOW_FIRST_MESSAGE, FLOW_SECOND_MESSAGE, FLOW_LIST_POLL_MESSAGE].includes(Q.text(message.text))).length;
    if (newMessageCount === 0) {
      const validation = flowBaselineValidation(current);
      validation.zeroWriteSnapshot = sameNormalizedSnapshot(current, state.baseline);
      if (!Object.values(validation).every(Boolean)) Q.fail(`CHAT-FLOW-001 baseline drift detected: ${JSON.stringify(validation)}.`);
      Q.printObject({ scenario: SCENARIO, checkpoint: CHECKPOINT, phase: "fixture-ready", expected: state.context, validation });
      return;
    }
    const validation = flowTerminalValidation(current, state.baseline);
    if (!Object.values(validation).every(Boolean)) Q.fail(`CHAT-FLOW-001 terminal mismatch: ${JSON.stringify(validation)}.`);
    Q.printObject({ scenario: SCENARIO, checkpoint: CHECKPOINT, phase: "terminal-pass", expected: state.context, validation });
  }

  function flowReset() {
    const state = Q.activeState(SCENARIO, true);
    if (Q.text(state.checkpointId) !== CHECKPOINT) Q.fail(`active Chat checkpoint is '${Q.text(state.checkpointId)}', not '${CHECKPOINT}'.`);
    Q.restoreSnapshots(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    const remaining = Q.collection("chats").countDocuments({ id: { $regex: `^${FLOW_PREFIX}:` } })
      + Q.collection("chatMessages").countDocuments({ chatId: { $regex: `^${FLOW_PREFIX}:` } })
      + Q.collection("activityMembers").countDocuments({ ownerId: { $in: [FLOW_EVENT_ID, FLOW_GROUP_ID] } });
    if (remaining !== 0) Q.fail(`reset left ${remaining} CHAT-FLOW-001 fixture rows.`);
    Q.printObject({ scenario: SCENARIO, checkpoint: CHECKPOINT, phase: "reset-complete", restored: true });
  }

  Q.assertDeploymentSafety();
  assertCheckpoint();
  if (COMMAND === "stage") (CHECKPOINT === FLOW_CHECKPOINT ? flowStage : listStage)();
  else if (COMMAND === "status") (CHECKPOINT === FLOW_CHECKPOINT ? flowStatus : listStatus)();
  else if (COMMAND === "reset") (CHECKPOINT === FLOW_CHECKPOINT ? flowReset : listReset)();
  else Q.fail(`unsupported command '${COMMAND}' for ${SCENARIO}.`);
})();
