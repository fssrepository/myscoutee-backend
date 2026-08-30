/* global ManualQa, db, EJSON, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "chat-domain";
  const CHECKPOINT = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const COMMAND = Q.text(process.env.MANUAL_QA_COMMAND);
  const LIST_CHECKPOINT = "CHAT-LIST-001";
  const FLOW_CHECKPOINT = "CHAT-FLOW-001";
  const ACTIONS_CHECKPOINT = "CHAT-ACTIONS-001";
  const CONTENT_CHECKPOINT = "CHAT-CONTENT-001";
  const PREFIX = "manual-qa-checkpoint:v1:chat-list";
  const FLOW_PREFIX = "manual-qa-checkpoint:v1:chat-flow";
  const CASEY_ID = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID) || "650000000000000000000061";
  const NOVA_ID = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID) || "650000000000000000000062";
  const RILEY_ID = "650000000000000000000063";
  const CONTENT_OWNER_ID = "178e8d0cbe164fa3fede5884";
  const FLOW_ACTOR_IDS = [CASEY_ID, NOVA_ID, RILEY_ID];
  const FLOW_EVENT_ID = `${FLOW_PREFIX}:event`;
  const FLOW_STAGE_ID = `${FLOW_EVENT_ID}:stage`;
  const FLOW_GROUP_ID = `${FLOW_STAGE_ID}:group`;
  const FLOW_FIRST_MESSAGE = "QA CHAT FLOW 001 · Casey live message";
  const FLOW_LIST_POLL_MESSAGE = "QA CHAT FLOW 001 · Casey list poll message";
  const ACTIONS_SOURCE_ID = `${FLOW_PREFIX}:history:02`;
  const ACTIONS_REPLY_TEXT = "QA CHAT ACTIONS 001 · Casey reply";
  const ACTIONS_EDITED_TEXT = "QA CHAT ACTIONS 001 · Casey edited reply";
  const ACTIONS_READ_RACE_TEXT = "QA CHAT ACTIONS 001 · read race retest";
  const CONTENT_EVENT_ID = `${FLOW_PREFIX}:content:event`;
  const CONTENT_ASSET_ID = `${FLOW_PREFIX}:content:asset`;
  const CONTENT_REMOVED_ASSET_ID = `${FLOW_PREFIX}:content:asset:removed`;
  const CONTENT_UNAVAILABLE_MESSAGE_ID = `${FLOW_PREFIX}:content:unavailable`;
  const CONTENT_EVENT_TITLE = "QA Chat Content Event";
  const CONTENT_PARENT_EVENT_TITLE = "QA Chat Content Parent Event";
  const CONTENT_ASSET_TITLE = "QA Chat Content Transport";
  const CONTENT_POLL_QUESTION = "QA CHAT CONTENT 001 · Which route?";
  const CONTENT_POLL_OPTIONS = ["North", "South"];
  const CONTEXTS = [
    { key: "event", channelType: "mainEvent", suffix: "event", title: "QA Chat · Main event", avatar: "QE" },
    { key: "group", channelType: "groupSubEvent", suffix: "group", title: "QA Chat · Group", avatar: "QG" },
    { key: "service", channelType: "serviceEvent", suffix: "service", title: "QA Chat · Service", avatar: "QS" },
    { key: "appSupport", channelType: "appSupport", suffix: "support", title: "QA Chat · App Support", avatar: "QA" }
  ];

  function assertCheckpoint() {
    if (![LIST_CHECKPOINT, FLOW_CHECKPOINT, ACTIONS_CHECKPOINT, CONTENT_CHECKPOINT].includes(CHECKPOINT)) {
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
      { collection: "events", selector: { $or: [
        { _id: { $in: [FLOW_EVENT_ID, CONTENT_EVENT_ID] } },
        { sourceId: { $in: [FLOW_EVENT_ID, CONTENT_EVENT_ID] } }
      ] } },
      { collection: "assets", selector: { $or: [{ _id: CONTENT_ASSET_ID }, { assetId: CONTENT_ASSET_ID }] } },
      { collection: "shareTokens", selector: { entityId: { $in: [CONTENT_EVENT_ID, CONTENT_ASSET_ID] } } },
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

  function flowChat(item, ownerUserId, dateIso, lastMessage, lastSenderId, contextAnchorIso) {
    const id = flowChatId(item);
    const isGroup = item.key === "group";
    const hasEventContext = item.channelType !== "appSupport";
    const contextStartAtIso = hasEventContext
      ? new Date(new Date(contextAnchorIso).getTime() + 3 * 60 * 60 * 1000).toISOString()
      : null;
    const contextEndAtIso = hasEventContext
      ? new Date(new Date(contextStartAtIso).getTime() + (isGroup ? 90 : 120) * 60 * 1000).toISOString()
      : null;
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
      contextStartAtIso,
      contextEndAtIso,
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

  function contentUnavailableMessage(sentAtIso) {
    const sender = flowUserRecord(CASEY_ID);
    const readers = [NOVA_ID, RILEY_ID].map(flowAvatar);
    return {
      _id: `chat-message:${flowChatId(CONTEXTS[1])}:${CONTENT_UNAVAILABLE_MESSAGE_ID}`,
      chatId: flowChatId(CONTEXTS[1]),
      id: CONTENT_UNAVAILABLE_MESSAGE_ID,
      clientId: `${CONTENT_UNAVAILABLE_MESSAGE_ID}:client`,
      sender: Q.text(sender.name) || CASEY_ID,
      senderAvatar: flowAvatar(CASEY_ID),
      text: "",
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
      attachments: [{
        id: `${CONTENT_UNAVAILABLE_MESSAGE_ID}:attachment`,
        type: "asset",
        title: "Removed QA Chat Asset",
        entityId: CONTENT_REMOVED_ASSET_ID,
        assetType: "Transport",
        ownerUserId: CASEY_ID,
        status: "unavailable",
        unavailableReason: "deleted",
        subtitle: "Transport - Austin",
        description: "",
        url: "",
        previewUrl: "",
        mimeType: "",
        sizeBytes: null
      }],
      messageSenderUserIds: [CASEY_ID],
      messageReadByUserIds: readers.map(reader => reader.id),
      messageReactionUserIds: [],
      messageAttachmentKeys: [`asset:${CONTENT_REMOVED_ASSET_ID}`],
      pollVoterUserIds: []
    };
  }

  function contentEventDocument(nowIso) {
    const eventStartAtIso = new Date(new Date(nowIso).getTime() + 3 * 60 * 60 * 1000).toISOString();
    const eventEndAtIso = new Date(new Date(nowIso).getTime() + 5 * 60 * 60 * 1000).toISOString();
    const stageEndAtIso = new Date(new Date(eventStartAtIso).getTime() + 90 * 60 * 1000).toISOString();
    const stage = {
      id: FLOW_STAGE_ID,
      name: "QA Chat Content Stage",
      description: "Controlled rich-content Chat group",
      startAt: eventStartAtIso,
      endAt: stageEndAtIso,
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: 90,
      optional: false,
      capacityMin: 3,
      capacityMax: 3,
      membersAccepted: 3,
      membersPending: 0,
      groups: [{
        id: FLOW_GROUP_ID,
        label: "Group A",
        name: "Group A",
        source: "manual",
        accepted: 3,
        pending: 0,
        capacityMin: 3,
        capacityMax: 3
      }]
    };
    return {
      _id: FLOW_EVENT_ID,
      sourceId: FLOW_EVENT_ID,
      syncKey: FLOW_EVENT_ID,
      title: CONTENT_PARENT_EVENT_TITLE,
      subtitle: "Controlled rich-content Chat event",
      status: "A",
      published: true,
      isTrashed: false,
      ownerUserId: CASEY_ID,
      creatorUserId: CASEY_ID,
      admins: [CASEY_ID],
      visibility: "public",
      blindMode: "Open Event",
      autoInviter: false,
      ticketing: false,
      approvalRequired: false,
      capacityMin: 3,
      capacityMax: 3,
      capacityTotal: 3,
      acceptedMembers: 3,
      pendingMembers: 0,
      acceptedMemberUserIds: [...FLOW_ACTOR_IDS],
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [],
      subEventsEnabled: true,
      subEventDefinitions: [stage],
      subEvents: [stage],
      mode: "Casual",
      topics: ["Manual QA", "Chat"],
      imageUrl: "",
      startAtIso: eventStartAtIso,
      endAtIso: eventEndAtIso,
      createdDate: nowIso,
      createdUser: CASEY_ID,
      updatedDate: nowIso,
      updatedUser: CASEY_ID
    };
  }

  function contentSharedEventDocument(nowIso) {
    const owner = flowUserRecord(CONTENT_OWNER_ID);
    return {
      _id: CONTENT_EVENT_ID,
      sourceId: CONTENT_EVENT_ID,
      syncKey: CONTENT_EVENT_ID,
      title: CONTENT_EVENT_TITLE,
      subtitle: "Public share-card target for CHAT-CONTENT-001",
      status: "A",
      published: true,
      isTrashed: false,
      generated: false,
      ownerUserId: CONTENT_OWNER_ID,
      creatorUserId: CONTENT_OWNER_ID,
      creatorName: Q.text(owner.name) || "Lina Park",
      admins: [CONTENT_OWNER_ID],
      visibility: "public",
      blindMode: "Open Event",
      autoInviter: false,
      ticketing: false,
      approvalRequired: false,
      capacityMin: 1,
      capacityMax: 8,
      capacityTotal: 8,
      acceptedMembers: 1,
      pendingMembers: 0,
      acceptedMemberUserIds: [CONTENT_OWNER_ID],
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      pendingRequestMemberUserIds: [],
      subEventsEnabled: false,
      subEventDefinitions: [],
      subEvents: [],
      mode: "Casual",
      topics: ["Manual QA", "Chat"],
      imageUrl: "",
      startAtIso: new Date(new Date(nowIso).getTime() + 24 * 60 * 60 * 1000).toISOString(),
      endAtIso: new Date(new Date(nowIso).getTime() + 26 * 60 * 60 * 1000).toISOString(),
      createdDate: nowIso,
      createdUser: CONTENT_OWNER_ID,
      updatedDate: nowIso,
      updatedUser: CONTENT_OWNER_ID
    };
  }

  function contentAssetDocument(nowIso) {
    return {
      _id: CONTENT_ASSET_ID,
      syncKey: CONTENT_ASSET_ID,
      assetId: CONTENT_ASSET_ID,
      ownerUserId: CONTENT_OWNER_ID,
      type: "Transport",
      title: CONTENT_ASSET_TITLE,
      subtitle: "Controlled rich-content Chat asset",
      category: "Sedan",
      city: "Austin",
      capacityTotal: 4,
      quantity: 1,
      details: "Controlled share-card target for CHAT-CONTENT-001",
      routes: ["Austin"],
      policiesEnabled: false,
      policies: [],
      requests: [],
      visibility: "Public",
      status: "A",
      imageUrl: "",
      sourceLink: "",
      createdDate: nowIso,
      createdUser: CONTENT_OWNER_ID,
      updatedDate: nowIso,
      updatedUser: CONTENT_OWNER_ID
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
    const events = Q.collection("events")
      .find({ $or: [
        { _id: { $in: [FLOW_EVENT_ID, CONTENT_EVENT_ID] } },
        { sourceId: { $in: [FLOW_EVENT_ID, CONTENT_EVENT_ID] } }
      ] })
      .sort({ _id: 1 })
      .toArray();
    const assets = Q.collection("assets")
      .find({ $or: [{ _id: CONTENT_ASSET_ID }, { assetId: CONTENT_ASSET_ID }] })
      .sort({ _id: 1 })
      .toArray();
    const shareTokens = Q.collection("shareTokens")
      .find({ entityId: { $in: [CONTENT_EVENT_ID, CONTENT_ASSET_ID] } })
      .sort({ createdAtIso: 1, _id: 1 })
      .toArray();
    return { chats, messages, members, users, outbox, notifications, events, assets, shareTokens };
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
    const ordinaryHistory = history.filter(message => Q.text(message.id) !== CONTENT_UNAVAILABLE_MESSAGE_ID);
    const unavailableMessage = history.find(message => Q.text(message.id) === CONTENT_UNAVAILABLE_MESSAGE_ID);
    const contentFixture = CHECKPOINT === CONTENT_CHECKPOINT;
    return {
      exactOwnerCopies: (snapshot.chats || []).length === FLOW_ACTOR_IDS.length * CONTEXTS.length
        && FLOW_ACTOR_IDS.every(userId => expectedChatIds.every(id => (snapshot.chats || []).some(chat =>
          Q.text(chat.ownerUserId) === userId
          && Q.text(chat.id) === id
          && Q.number(chat.unread) === 0
          && Q.text(chat.ownerStatus) === "A"
          && Q.number(chat.revision) === 1))),
      exactPersistedContextWindows: (snapshot.chats || []).every(chat =>
        Q.text(chat.channelType) === "appSupport"
          ? !Q.text(chat.contextStartAtIso) && !Q.text(chat.contextEndAtIso)
          : Q.text(chat.contextStartAtIso)
            && Q.text(chat.contextEndAtIso)
            && new Date(chat.contextStartAtIso).getTime() < new Date(chat.contextEndAtIso).getTime()),
      exactAcceptedMembership: (snapshot.members || []).length === FLOW_ACTOR_IDS.length * 2
        && (snapshot.members || []).every(member => Q.text(member.status) === "accepted"),
      exactHistory: history.length === (contentFixture ? 19 : 18)
        && ordinaryHistory.length === 18
        && ordinaryHistory.every((message, index) => Q.text(message.id) === `${FLOW_PREFIX}:history:${String(index + 1).padStart(2, "0")}`),
      exactReadHistory: history.every(message => {
        const senderId = Q.text(message.senderAvatar && message.senderAvatar.id);
        const expectedReaders = FLOW_ACTOR_IDS.filter(userId => userId !== senderId).sort();
        const actualReaders = (message.messageReadByUserIds || []).map(Q.text).sort();
        return Q.sameJson(actualReaders, expectedReaders);
      }),
      zeroCounters: (snapshot.users || []).length === FLOW_ACTOR_IDS.length && (snapshot.users || []).every(flowCounterZero),
      zeroNotifications: (snapshot.outbox || []).length === 0 && (snapshot.notifications || []).length === 0,
      exactContentSources: contentFixture
        ? (snapshot.events || []).length === 2
          && (snapshot.events || []).some(event => Q.text(event.sourceId) === FLOW_EVENT_ID
            && Q.text(event.title) === CONTENT_PARENT_EVENT_TITLE)
          && (snapshot.events || []).some(event => Q.text(event.sourceId) === CONTENT_EVENT_ID
            && Q.text(event.title) === CONTENT_EVENT_TITLE
            && Q.text(event.creatorUserId) === CONTENT_OWNER_ID)
          && (snapshot.assets || []).length === 1
          && Q.text(snapshot.assets[0].assetId) === CONTENT_ASSET_ID
          && Q.text(snapshot.assets[0].title) === CONTENT_ASSET_TITLE
          && Q.text(snapshot.assets[0].ownerUserId) === CONTENT_OWNER_ID
        : (snapshot.events || []).length === 0 && (snapshot.assets || []).length === 0,
      exactUnavailableControl: contentFixture
        ? Boolean(unavailableMessage)
          && (unavailableMessage.attachments || []).length === 1
          && Q.text(unavailableMessage.attachments[0].type) === "asset"
          && Q.text(unavailableMessage.attachments[0].entityId) === CONTENT_REMOVED_ASSET_ID
          && Q.text(unavailableMessage.attachments[0].status) === "unavailable"
          && Q.text(unavailableMessage.attachments[0].unavailableReason) === "deleted"
        : !unavailableMessage,
      zeroShareTokens: (snapshot.shareTokens || []).length === 0
    };
  }

  function flowTerminalValidation(snapshot, baseline) {
    const expectedMessageTexts = [FLOW_FIRST_MESSAGE, FLOW_LIST_POLL_MESSAGE];
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
      exactTwentyMessages: (snapshot.messages || []).length === 20,
      exactNewMessages,
      exactFinalSummaries: Boolean(latest) && groupCopies.length === FLOW_ACTOR_IDS.length
        && groupCopies.every(chat => Q.text(chat.lastMessage) === FLOW_LIST_POLL_MESSAGE
          && Q.text(chat.lastSenderId) === CASEY_ID
          && Q.text(chat.dateIso) === Q.text(latest.sentAtIso)
          && Q.number(chat.unread) === 0
          && Q.number(chat.revision) > 1),
      allCountersCleared: (snapshot.users || []).every(flowCounterZero),
      exactOutbox: outbox.length === 2 && outbox.every(row =>
        Q.text(row.notificationType) === "chat-message"
        && Q.text(row.entityType) === "chat"
        && Q.text(row.entityId) === groupId
        && Q.sameJson((row.recipientUserIds || []).map(Q.text).sort(), [RILEY_ID])),
      exactInbox: notifications.length === 2
        && notifications.every(row => Q.text(row.recipientUserId) === RILEY_ID)
        && notifications.every(row => Q.text(row.sourceType) === "chat" && Q.text(row.sourceId) === groupId),
      exactNotificationCounters: notificationCounter(currentUsers[CASEY_ID]) === notificationCounter(baselineUsers[CASEY_ID])
        && notificationCounter(currentUsers[NOVA_ID]) === notificationCounter(baselineUsers[NOVA_ID])
        && notificationCounter(currentUsers[RILEY_ID]) === notificationCounter(baselineUsers[RILEY_ID]) + 2,
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
      if (CHECKPOINT === CONTENT_CHECKPOINT) {
        history.push(contentUnavailableMessage(new Date(firstDay + 24 * 60 * 60 * 1000 + 70 * 60 * 1000).toISOString()));
      }
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
          item.key === "group" ? Q.text(latest.senderAvatar.id) : NOVA_ID,
          stagedAtIso
        )));
      }
      flowInsertMany("chats", rows, "CHAT-FLOW-001 owner copies");
      flowInsertMany("activityMembers", [
        ...FLOW_ACTOR_IDS.map((userId, index) => flowMember("event", FLOW_EVENT_ID, userId, index === 0 ? "Admin" : "Member", stagedAtIso)),
        ...FLOW_ACTOR_IDS.map((userId, index) => flowMember("group", FLOW_GROUP_ID, userId, index === 0 ? "Manager" : "Member", stagedAtIso))
      ], "CHAT-FLOW-001 memberships");
      if (CHECKPOINT === CONTENT_CHECKPOINT) {
        Q.collection("events").insertMany([
          contentEventDocument(stagedAtIso),
          contentSharedEventDocument(stagedAtIso)
        ]);
        Q.collection("assets").insertOne(contentAssetDocument(stagedAtIso));
      }
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
        listPollMessage: FLOW_LIST_POLL_MESSAGE,
        expectedContextIds: Object.fromEntries(CONTEXTS.map(item => [item.key, flowChatId(item)])),
        historyIds: history.map(message => message.id),
        content: CHECKPOINT === CONTENT_CHECKPOINT ? {
          eventId: CONTENT_EVENT_ID,
          eventTitle: CONTENT_EVENT_TITLE,
          assetId: CONTENT_ASSET_ID,
          assetTitle: CONTENT_ASSET_TITLE,
          unavailableMessageId: CONTENT_UNAVAILABLE_MESSAGE_ID,
          pollQuestion: CONTENT_POLL_QUESTION,
          pollOptions: [...CONTENT_POLL_OPTIONS]
        } : null
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
          groupHistory: CHECKPOINT === CONTENT_CHECKPOINT ? 19 : 18,
          unreadPerActor: 0,
          firstMessage: FLOW_FIRST_MESSAGE,
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
    const expected = { ...(state.context || {}), listPollMessage: FLOW_LIST_POLL_MESSAGE };
    delete expected.secondMessage;
    const newMessageCount = current.messages.filter(message =>
      [FLOW_FIRST_MESSAGE, FLOW_LIST_POLL_MESSAGE].includes(Q.text(message.text))).length;
    if (newMessageCount === 0) {
      const validation = flowBaselineValidation(current);
      validation.zeroWriteSnapshot = sameNormalizedSnapshot(current, state.baseline);
      if (!Object.values(validation).every(Boolean)) Q.fail(`CHAT-FLOW-001 baseline drift detected: ${JSON.stringify(validation)}.`);
      Q.printObject({ scenario: SCENARIO, checkpoint: CHECKPOINT, phase: "fixture-ready", expected, validation });
      return;
    }
    const validation = flowTerminalValidation(current, state.baseline);
    if (!Object.values(validation).every(Boolean)) Q.fail(`CHAT-FLOW-001 terminal mismatch: ${JSON.stringify(validation)}.`);
    Q.printObject({ scenario: SCENARIO, checkpoint: CHECKPOINT, phase: "terminal-pass", expected, validation });
  }

  function actionsStatus() {
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({ scenario: SCENARIO, checkpoint: CHECKPOINT, phase: "not-staged", next: `Run stage chat-domain ${CHECKPOINT}.` });
      return;
    }
    if (Q.text(state.checkpointId) !== CHECKPOINT) Q.fail(`active Chat checkpoint is '${Q.text(state.checkpointId)}', not '${CHECKPOINT}'.`);
    const current = flowSnapshot();
    const baselineValidation = flowBaselineValidation(current);
    const actionMessages = (current.messages || []).filter(message =>
      Q.text(message.sentAtIso).localeCompare(Q.text(state.stagedAtIso)) > 0
      && Q.text(message.senderAvatar && message.senderAvatar.id) === CASEY_ID);
    if (actionMessages.length === 0) {
      baselineValidation.zeroWriteSnapshot = sameNormalizedSnapshot(current, state.baseline);
      if (!Object.values(baselineValidation).every(Boolean)) {
        Q.fail(`CHAT-ACTIONS-001 baseline drift detected: ${JSON.stringify(baselineValidation)}.`);
      }
      Q.printObject({
        scenario: SCENARIO,
        checkpoint: CHECKPOINT,
        phase: "fixture-ready",
        expected: {
          groupChatId: flowChatId(CONTEXTS[1]),
          sourceMessageId: ACTIONS_SOURCE_ID,
          sourceMessageText: "QA history 02",
          replyText: ACTIONS_REPLY_TEXT,
          editedText: ACTIONS_EDITED_TEXT
        },
        validation: baselineValidation
      });
      return;
    }

    const target = actionMessages.length === 1 ? actionMessages[0] : null;
    const baselineById = Object.fromEntries((state.baseline.messages || []).map(message => [Q.text(message.id), message]));
    const comparableMessage = message => {
      const copy = EJSON.parse(EJSON.stringify(message, null, 0, { relaxed: false }));
      copy.readBy = (copy.readBy || []).sort((left, right) => Q.text(left && left.id).localeCompare(Q.text(right && right.id)));
      copy.messageReadByUserIds = (copy.messageReadByUserIds || []).map(Q.text).sort();
      return copy;
    };
    const unchangedHistory = (current.messages || [])
      .filter(message => Object.prototype.hasOwnProperty.call(baselineById, Q.text(message.id)))
      .every(message => sameNormalizedSnapshot(comparableMessage(message), comparableMessage(baselineById[Q.text(message.id)])));
    if (target && Q.text(target.text) === ACTIONS_READ_RACE_TEXT && !Q.text(target.deletedAtIso)) {
      const readers = (target.readBy || []).map(reader => Q.text(reader && reader.id)).sort();
      const readerSearchIds = (target.messageReadByUserIds || []).map(Q.text).sort();
      const groupCopies = (current.chats || []).filter(chat => Q.text(chat.id) === flowChatId(CONTEXTS[1]));
      const validation = {
        oneNormalActionMessage: actionMessages.length === 1,
        exactPersistedReaders: Q.sameJson(readers, [NOVA_ID, RILEY_ID].sort()),
        exactReaderSearchIds: Q.sameJson(readerSearchIds, [NOVA_ID, RILEY_ID].sort()),
        normalMessageStillIntact: target.replyTo == null
          && target.editedAtIso == null
          && target.pinnedAtIso == null
          && (target.reactions || []).length === 0
          && (target.attachments || []).length === 0,
        exactHistoryCardinality: (current.messages || []).length === (state.baseline.messages || []).length + 1,
        surroundingHistoryUnchanged: unchangedHistory,
        allGroupCopiesRead: groupCopies.length === FLOW_ACTOR_IDS.length
          && groupCopies.every(chat => Q.number(chat.unread) === 0),
        allChatCountersCleared: (current.users || []).every(flowCounterZero)
      };
      if (!Object.values(validation).every(Boolean)) {
        Q.fail(`CHAT-ACTIONS-001 normal-message read-race retest mismatch: ${JSON.stringify(validation)}.`);
      }
      Q.printObject({
        scenario: SCENARIO,
        checkpoint: CHECKPOINT,
        phase: "read-race-ui-pass",
        targetMessageId: target.id,
        readers,
        validation
      });
      return;
    }
    const validation = {
      oneActionMessage: actionMessages.length === 1,
      sameMessageBecameTombstone: Boolean(target)
        && Q.text(target.deletedAtIso)
        && Q.text(target.deletedByUserId) === CASEY_ID
        && !Q.text(target.text)
        && target.replyTo == null
        && target.editedAtIso == null
        && target.pinnedAtIso == null
        && target.pinnedByUserId == null
        && (target.reactions || []).length === 0
        && (target.readBy || []).length === 0
        && (target.attachments || []).length === 0,
      tombstoneSearchFieldsCleared: Boolean(target)
        && Q.sameJson((target.messageSenderUserIds || []).map(Q.text), [CASEY_ID])
        && (target.messageReadByUserIds || []).length === 0
        && (target.messageReactionUserIds || []).length === 0
        && (target.messageAttachmentKeys || []).length === 0
        && (target.pollVoterUserIds || []).length === 0,
      immutableSourceIntact: Boolean(baselineById[ACTIONS_SOURCE_ID])
        && unchangedHistory
        && Q.text(baselineById[ACTIONS_SOURCE_ID].text) === "QA history 02",
      exactHistoryCardinality: (current.messages || []).length === (state.baseline.messages || []).length + 1,
      unchangedFixtureMembership: (current.members || []).length === FLOW_ACTOR_IDS.length * 2
        && (current.members || []).every(member => Q.text(member.status) === "accepted")
    };
    if (!Object.values(validation).every(Boolean)) {
      Q.fail(`CHAT-ACTIONS-001 terminal mismatch: ${JSON.stringify(validation)}.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpoint: CHECKPOINT,
      phase: "terminal-pass",
      targetMessageId: target.id,
      validation,
      note: "The persisted final document proves identity-preserving unsend. Reply, reaction, pin and edit transitions remain visual/manual evidence because this domain has no separate mutation-audit collection."
    });
  }

  function contentPollState(message) {
    const attachment = message && (message.attachments || []).find(item => Q.text(item.type) === "poll");
    if (!attachment) return null;
    try {
      return JSON.parse(Q.text(attachment.description));
    } catch (_error) {
      return null;
    }
  }

  function contentStatus() {
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({ scenario: SCENARIO, checkpoint: CHECKPOINT, phase: "not-staged", next: `Run stage chat-domain ${CHECKPOINT}.` });
      return;
    }
    if (Q.text(state.checkpointId) !== CONTENT_CHECKPOINT) {
      Q.fail(`active Chat checkpoint is '${Q.text(state.checkpointId)}', not '${CONTENT_CHECKPOINT}'.`);
    }
    const current = flowSnapshot();
    const newMessages = (current.messages || [])
      .filter(message => Q.text(message.sentAtIso).localeCompare(Q.text(state.stagedAtIso)) > 0)
      .sort((left, right) => Q.text(left.sentAtIso).localeCompare(Q.text(right.sentAtIso)) || Q.text(left.id).localeCompare(Q.text(right.id)));
    if (newMessages.length === 0) {
      const validation = flowBaselineValidation(current);
      validation.zeroWriteSnapshot = sameNormalizedSnapshot(current, state.baseline);
      if (!Object.values(validation).every(Boolean)) {
        Q.fail(`CHAT-CONTENT-001 baseline drift detected: ${JSON.stringify(validation)}.`);
      }
      Q.printObject({
        scenario: SCENARIO,
        checkpoint: CHECKPOINT,
        phase: "fixture-ready",
        expected: state.context,
        validation
      });
      return;
    }

    const typeSequence = newMessages.map(message => Q.text(message.attachments && message.attachments[0] && message.attachments[0].type));
    const byType = Object.fromEntries(newMessages
      .filter(message => (message.attachments || []).length === 1)
      .map(message => [Q.text(message.attachments[0].type), message]));
    const image = byType.image;
    const voice = byType.voice;
    const poll = byType.poll;
    const eventCard = byType.event;
    const assetCard = byType.asset;
    const pollState = contentPollState(poll);
    const pollOptions = Array.isArray(pollState && pollState.options) ? pollState.options : [];
    const north = pollOptions.find(option => Q.text(option && option.text) === CONTENT_POLL_OPTIONS[0]);
    const south = pollOptions.find(option => Q.text(option && option.text) === CONTENT_POLL_OPTIONS[1]);
    const southVoters = (south && south.votes || []).map(vote => Q.text(vote && vote.userId)).sort();
    const baselineById = Object.fromEntries((state.baseline.messages || []).map(message => [Q.text(message.id), message]));
    const baselineMessagesUnchanged = (current.messages || [])
      .filter(message => Object.prototype.hasOwnProperty.call(baselineById, Q.text(message.id)))
      .every(message => sameNormalizedSnapshot(message, baselineById[Q.text(message.id)]));
    const exactReaders = message => {
      const readers = (message && message.messageReadByUserIds || []).map(Q.text).sort();
      return Q.sameJson(readers, [NOVA_ID, RILEY_ID].sort());
    };
    const exactMessageShape = message => Boolean(message)
      && Q.text(message.senderAvatar && message.senderAvatar.id) === CASEY_ID
      && Q.text(message.clientId)
      && !Q.text(message.text)
      && !Q.text(message.deletedAtIso)
      && (message.attachments || []).length === 1
      && exactReaders(message);
    const groupId = flowChatId(CONTEXTS[1]);
    const groupCopies = (current.chats || []).filter(chat => Q.text(chat.id) === groupId);
    const baselineUsers = Object.fromEntries((state.baseline.users || []).map(user => [Q.text(user.userId), user]));
    const currentUsers = Object.fromEntries((current.users || []).map(user => [Q.text(user.userId), user]));
    const notificationCounter = user => Q.number(user && user.activities && user.activities.notifications);
    const validation = {
      exactFiveContentMessages: newMessages.length === 5
        && Q.sameJson(typeSequence, ["image", "voice", "poll", "event", "asset"])
        && newMessages.every(exactMessageShape),
      exactImageAttachment: Boolean(image)
        && Q.text(image.attachments[0].url).startsWith("/media/public?key=images%2F")
        && Q.text(image.attachments[0].previewUrl).startsWith("/media/public?key=images%2F")
        && Q.text(image.attachments[0].mimeType).startsWith("image/")
        && Q.number(image.attachments[0].sizeBytes) > 0,
      exactVoiceAttachment: Boolean(voice)
        && Q.text(voice.attachments[0].url).startsWith("/media/public?key=audio%2F")
        && Q.text(voice.attachments[0].mimeType).startsWith("audio/")
        && Q.number(voice.attachments[0].sizeBytes) > 0,
      exactFinalPoll: Boolean(poll)
        && Q.text(pollState && pollState.question) === CONTENT_POLL_QUESTION
        && Q.sameJson(pollOptions.map(option => Q.text(option && option.text)), CONTENT_POLL_OPTIONS)
        && (north && north.votes || []).length === 0
        && Q.sameJson(southVoters, [NOVA_ID, RILEY_ID].sort())
        && Q.sameJson((poll.pollVoterUserIds || []).map(Q.text).sort(), [NOVA_ID, RILEY_ID].sort()),
      exactEventCard: Boolean(eventCard)
        && Q.text(eventCard.attachments[0].entityId) === CONTENT_EVENT_ID
        && Q.text(eventCard.attachments[0].title) === CONTENT_EVENT_TITLE
        && Q.text(eventCard.attachments[0].status) === "available"
        && Q.sameJson((eventCard.messageAttachmentKeys || []).map(Q.text), [`event:${CONTENT_EVENT_ID}`]),
      exactAssetCard: Boolean(assetCard)
        && Q.text(assetCard.attachments[0].entityId) === CONTENT_ASSET_ID
        && Q.text(assetCard.attachments[0].title) === CONTENT_ASSET_TITLE
        && Q.text(assetCard.attachments[0].assetType) === "Transport"
        && Q.text(assetCard.attachments[0].ownerUserId) === CONTENT_OWNER_ID
        && Q.text(assetCard.attachments[0].status) === "available"
        && Q.sameJson((assetCard.messageAttachmentKeys || []).map(Q.text), [`asset:${CONTENT_ASSET_ID}`]),
      exactCanonicalHistory: (current.messages || []).length === 24 && baselineMessagesUnchanged,
      exactUnreadAndSummaries: groupCopies.length === FLOW_ACTOR_IDS.length
        && groupCopies.every(chat => Q.number(chat.unread) === 0
          && Q.text(chat.lastSenderId) === CASEY_ID
          && Q.text(chat.lastMessage) === "Shared an asset"
          && Q.number(chat.revision) > 1)
        && (current.users || []).every(flowCounterZero),
      exactRecipientNotifications: (current.outbox || []).length === 5
        && (current.outbox || []).every(row => Q.text(row.notificationType) === "chat-message"
          && Q.text(row.entityType) === "chat"
          && Q.text(row.entityId) === groupId
          && Q.sameJson((row.recipientUserIds || []).map(Q.text), [RILEY_ID]))
        && (current.notifications || []).length === 5
        && (current.notifications || []).every(row => Q.text(row.recipientUserId) === RILEY_ID
          && Q.text(row.sourceType) === "chat"
          && Q.text(row.sourceId) === groupId),
      exactNotificationCounters: notificationCounter(currentUsers[CASEY_ID]) === notificationCounter(baselineUsers[CASEY_ID])
        && notificationCounter(currentUsers[NOVA_ID]) === notificationCounter(baselineUsers[NOVA_ID])
        && notificationCounter(currentUsers[RILEY_ID]) === notificationCounter(baselineUsers[RILEY_ID]) + 5,
      exactShareTokens: (current.shareTokens || []).length === 2
        && Q.sameJson((current.shareTokens || []).map(token => Q.text(token.entityId)).sort(), [CONTENT_EVENT_ID, CONTENT_ASSET_ID].sort()),
      contentSourcesIntact: (current.events || []).length === 2
        && (current.events || []).some(event => Q.text(event.sourceId) === CONTENT_EVENT_ID
          && Q.text(event.title) === CONTENT_EVENT_TITLE)
        && (current.assets || []).length === 1
        && Q.text(current.assets[0].title) === CONTENT_ASSET_TITLE
        && Q.text(current.assets[0].ownerUserId) === CONTENT_OWNER_ID
    };
    if (!Object.values(validation).every(Boolean)) {
      Q.fail(`CHAT-CONTENT-001 terminal mismatch: ${JSON.stringify(validation)}.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpoint: CHECKPOINT,
      phase: "terminal-pass",
      contentMessageIds: Object.fromEntries(Object.entries(byType).map(([type, message]) => [type, message.id])),
      mediaUrls: {
        image: image.attachments[0].url,
        imagePreview: image.attachments[0].previewUrl,
        voice: voice.attachments[0].url
      },
      validation,
      next: "Run the authenticated browser media/reopen oracle, remove only the emitted CHAT-CONTENT-001 media keys, then reset the fixture."
    });
  }

  function prepareActionsReadRaceRetest() {
    const state = Q.activeState(SCENARIO, true);
    if (CHECKPOINT !== ACTIONS_CHECKPOINT || Q.text(state.checkpointId) !== ACTIONS_CHECKPOINT) {
      Q.fail("prepare-actions-read-race-retest requires the active CHAT-ACTIONS-001 fixture.");
    }
    const current = flowSnapshot();
    const target = (current.messages || []).find(message =>
      Q.text(message.sentAtIso).localeCompare(Q.text(state.stagedAtIso)) > 0
      && Q.text(message.senderAvatar && message.senderAvatar.id) === CASEY_ID
      && Q.text(message.deletedAtIso));
    if (!target) Q.fail("CHAT-ACTIONS-001 has no unique deleted Casey target for the read regression.");
    const tombstoneUpdate = Q.collection("chatMessages").updateOne(
      { chatId: flowChatId(CONTEXTS[1]), id: target.id, deletedAtIso: { $nin: [null, ""] } },
      { $set: { readBy: [], messageReadByUserIds: [] } }
    );
    const raceUpdate = Q.collection("chatMessages").updateOne(
      { chatId: flowChatId(CONTEXTS[1]), id: `${FLOW_PREFIX}:history:01`, "senderAvatar.id": CASEY_ID },
      { $set: { readBy: [], messageReadByUserIds: [] } }
    );
    if (tombstoneUpdate.matchedCount !== 1 || raceUpdate.matchedCount !== 1) {
      Q.fail("CHAT-ACTIONS-001 read-race retest preparation did not match both guarded messages.");
    }
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
      phase: "read-race-retest-ready",
      "context.actionTargetMessageId": target.id,
      "context.readRaceMessageId": `${FLOW_PREFIX}:history:01`
    } });
    Q.printObject({
      scenario: SCENARIO,
      checkpoint: CHECKPOINT,
      phase: "read-race-retest-ready",
      targetMessageId: target.id,
      readRaceMessageId: `${FLOW_PREFIX}:history:01`,
      next: "Send simultaneous Nova/Riley websocket read receipts, reopen through HTTP, run both forbidden non-owner mutations, then run status."
    });
  }

  function repairContentShareSources() {
    const state = Q.activeState(SCENARIO, true);
    if (CHECKPOINT !== CONTENT_CHECKPOINT || Q.text(state.checkpointId) !== CONTENT_CHECKPOINT) {
      Q.fail("repair-content-share-sources requires the active CHAT-CONTENT-001 fixture.");
    }
    const contentEventSelector = { $or: [{ _id: CONTENT_EVENT_ID }, { sourceId: CONTENT_EVENT_ID }] };
    const snapshots = Array.isArray(state.snapshots) ? [...state.snapshots] : [];
    const contentEventAlreadySnapshotted = snapshots.some(snapshot =>
      Q.text(snapshot && snapshot.collection) === "events"
      && JSON.stringify(snapshot.selector || {}).includes(CONTENT_EVENT_ID));
    if (!contentEventAlreadySnapshotted) {
      snapshots.push({
        collection: "events",
        selector: contentEventSelector,
        documents: Q.collection("events").find(contentEventSelector).toArray()
      });
    }

    const repairedAtIso = Q.nowIso();
    const parent = contentEventDocument(repairedAtIso);
    const sharedEvent = contentSharedEventDocument(repairedAtIso);
    const sharedAsset = contentAssetDocument(repairedAtIso);
    const parentReplace = Q.collection("events").replaceOne({ _id: FLOW_EVENT_ID }, parent);
    if (parentReplace.matchedCount !== 1) Q.fail("CHAT-CONTENT-001 parent Event repair did not match the fixture source.");
    const stage = Array.isArray(parent.subEvents) ? parent.subEvents.find(item => Q.text(item.id) === FLOW_STAGE_ID) : null;
    const chatContextUpdate = Q.collection("chats").updateMany(
      { id: { $regex: `^${FLOW_PREFIX}:` } },
      [{ $set: {
        contextStartAtIso: {
          $cond: [{ $eq: ["$subEventId", FLOW_STAGE_ID] }, Q.text(stage && stage.startAt), parent.startAtIso]
        },
        contextEndAtIso: {
          $cond: [{ $eq: ["$subEventId", FLOW_STAGE_ID] }, Q.text(stage && stage.endAt), parent.endAtIso]
        }
      } }]
    );
    if (chatContextUpdate.matchedCount !== FLOW_ACTOR_IDS.length * CONTEXTS.length) {
      Q.fail(`CHAT-CONTENT-001 chat context repair matched ${chatContextUpdate.matchedCount} rows instead of ${FLOW_ACTOR_IDS.length * CONTEXTS.length}.`);
    }
    Q.collection("chats").updateMany(
      { id: flowChatId(CONTEXTS.find(item => item.channelType === "appSupport")) },
      { $unset: { contextStartAtIso: "", contextEndAtIso: "" } }
    );
    Q.collection("events").deleteMany(contentEventSelector);
    Q.collection("events").insertOne(sharedEvent);
    const assetReplace = Q.collection("assets").replaceOne({ _id: CONTENT_ASSET_ID }, sharedAsset);
    if (assetReplace.matchedCount !== 1) Q.fail("CHAT-CONTENT-001 Asset repair did not match the fixture source.");

    const current = flowSnapshot();
    const baseline = {
      ...(state.baseline || {}),
      chats: current.chats,
      events: current.events,
      assets: current.assets
    };
    const context = { ...(state.context || {}) };
    context.content = {
      ...(context.content || {}),
      eventId: CONTENT_EVENT_ID,
      eventTitle: CONTENT_EVENT_TITLE,
      assetId: CONTENT_ASSET_ID,
      assetTitle: CONTENT_ASSET_TITLE
    };
    Q.collection(Q.STATE_COLLECTION).updateOne({ _id: state._id }, { $set: {
      snapshots,
      baseline,
      context,
      repairedContentShareSourcesAtIso: repairedAtIso
    } });
    const sourcesValid = (current.events || []).length === 2
      && (current.events || []).some(event => Q.text(event.sourceId) === CONTENT_EVENT_ID
        && Q.text(event.creatorUserId) === CONTENT_OWNER_ID)
      && (current.assets || []).length === 1
      && Q.text(current.assets[0].ownerUserId) === CONTENT_OWNER_ID
      && Q.text(current.assets[0].category) === "Sedan";
    if (!sourcesValid) Q.fail("CHAT-CONTENT-001 repaired share sources failed their write-side oracle.");
    Q.printObject({
      scenario: SCENARIO,
      checkpoint: CHECKPOINT,
      phase: "share-sources-repaired",
      preservedMessageCount: (current.messages || []).length,
      event: { id: CONTENT_EVENT_ID, title: CONTENT_EVENT_TITLE, creatorUserId: CONTENT_OWNER_ID },
      asset: { id: CONTENT_ASSET_ID, title: CONTENT_ASSET_TITLE, ownerUserId: CONTENT_OWNER_ID },
      next: "Close the stale Explore popup, reopen Share event/Share asset from Casey's Group chat, and use the repaired exact cards."
    });
  }

  function flowReset() {
    const state = Q.activeState(SCENARIO, true);
    if (Q.text(state.checkpointId) !== CHECKPOINT) Q.fail(`active Chat checkpoint is '${Q.text(state.checkpointId)}', not '${CHECKPOINT}'.`);
    Q.restoreSnapshots(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    const remaining = Q.collection("chats").countDocuments({ id: { $regex: `^${FLOW_PREFIX}:` } })
      + Q.collection("chatMessages").countDocuments({ chatId: { $regex: `^${FLOW_PREFIX}:` } })
      + Q.collection("activityMembers").countDocuments({ ownerId: { $in: [FLOW_EVENT_ID, FLOW_GROUP_ID] } })
      + Q.collection("events").countDocuments({ $or: [
        { _id: { $in: [FLOW_EVENT_ID, CONTENT_EVENT_ID] } },
        { sourceId: { $in: [FLOW_EVENT_ID, CONTENT_EVENT_ID] } }
      ] })
      + Q.collection("assets").countDocuments({ $or: [{ _id: CONTENT_ASSET_ID }, { assetId: CONTENT_ASSET_ID }] })
      + Q.collection("shareTokens").countDocuments({ entityId: { $in: [CONTENT_EVENT_ID, CONTENT_ASSET_ID] } });
    if (remaining !== 0) Q.fail(`reset left ${remaining} CHAT-FLOW-001 fixture rows.`);
    Q.printObject({ scenario: SCENARIO, checkpoint: CHECKPOINT, phase: "reset-complete", restored: true });
  }

  Q.assertDeploymentSafety();
  assertCheckpoint();
  if (COMMAND === "prepare-actions-read-race-retest") prepareActionsReadRaceRetest();
  else if (COMMAND === "repair-content-share-sources") repairContentShareSources();
  else if (COMMAND === "stage") (CHECKPOINT === LIST_CHECKPOINT ? listStage : flowStage)();
  else if (COMMAND === "status") (
    CHECKPOINT === CONTENT_CHECKPOINT
      ? contentStatus
      : CHECKPOINT === ACTIONS_CHECKPOINT
        ? actionsStatus
        : CHECKPOINT === FLOW_CHECKPOINT
          ? flowStatus
          : listStatus
  )();
  else if (COMMAND === "reset") (CHECKPOINT === LIST_CHECKPOINT ? listReset : flowReset)();
  else Q.fail(`unsupported command '${COMMAND}' for ${SCENARIO}.`);
})();
