/* global ManualQa, db, EJSON, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "chat-domain";
  const CHECKPOINT = "CHAT-GOVERNANCE-001";
  const COMMAND = Q.text(process.env.MANUAL_QA_COMMAND);
  const REQUESTED_CHECKPOINT = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const PREFIX = "manual-qa-checkpoint:v1:chat-governance";
  const EVENT_ID = `${PREFIX}:event`;
  const STAGE_ID = `${EVENT_ID}:stage`;
  const GROUP_A_ID = `${STAGE_ID}:group-a`;
  const GROUP_B_ID = `${STAGE_ID}:group-b`;
  const EVENT_CHAT_ID = `${PREFIX}:event-chat`;
  const GROUP_A_CHAT_ID = `${PREFIX}:group-a-chat`;
  const GROUP_B_CHAT_ID = `${PREFIX}:group-b-chat`;
  const REPORT_MESSAGE_ID = `${PREFIX}:message:report-target`;
  const REPORT_MESSAGE_TEXT = "QA governance report target";
  const REPORT_REASON = "Harassment";
  const REPORT_DETAILS = "QA governance duplicate report";
  const EVENT_TITLE = "QA Chat Governance Event";
  const CASEY_ID = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID) || "650000000000000000000061";
  const NOVA_ID = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID) || "650000000000000000000062";
  const RILEY_ID = "650000000000000000000063";
  const LINA_ID = "178e8d0cbe164fa3fede5884";
  const SOPHIA_ID = "0216b1ceb256d6f2c89073b8";
  const OLIVIA_ID = "25f4744ead36d038064d62c3";
  const PRIMARY_IDS = [CASEY_ID, NOVA_ID, RILEY_ID];
  const EVENT_ACCEPTED_IDS = [CASEY_ID, NOVA_ID, RILEY_ID, OLIVIA_ID];
  const ALL_USER_IDS = [CASEY_ID, NOVA_ID, RILEY_ID, LINA_ID, SOPHIA_ID, OLIVIA_ID];

  function assertCheckpoint() {
    if (REQUESTED_CHECKPOINT !== CHECKPOINT) {
      Q.fail(`unsupported Chat governance checkpoint '${REQUESTED_CHECKPOINT}'.`);
    }
  }

  function fixtureSpecs() {
    return [
      { collection: "chats", selector: { $or: [
        { _id: { $regex: `^${PREFIX}:` } },
        { id: { $regex: `^${PREFIX}:` } }
      ] } },
      { collection: "chatMessages", selector: { chatId: { $in: [EVENT_CHAT_ID, GROUP_A_CHAT_ID, GROUP_B_CHAT_ID] } } },
      { collection: "activityMembers", selector: { ownerId: { $in: [EVENT_ID, GROUP_A_ID, GROUP_B_ID] } } },
      { collection: "events", selector: { $or: [
        { _id: EVENT_ID },
        { sourceId: EVENT_ID }
      ] } },
      { collection: "userReports", selector: { $or: [
        { targetUserId: RILEY_ID },
        { eventId: EVENT_ID },
        { chatId: GROUP_A_CHAT_ID },
        { messageId: REPORT_MESSAGE_ID }
      ] } },
      { collection: "users", selector: { $or: [
        { _id: { $in: ALL_USER_IDS } },
        { userId: { $in: ALL_USER_IDS } }
      ] } }
    ];
  }

  function clearFixture() {
    for (const spec of fixtureSpecs()) {
      if (spec.collection === "users") continue;
      Q.collection(spec.collection).deleteMany(spec.selector);
    }
  }

  function userRecord(userId) {
    return Q.ensureUser(userId, "CHAT-GOVERNANCE-001 user");
  }

  function userAvatar(userId) {
    const user = userRecord(userId);
    const name = Q.text(user.name) || userId;
    return {
      id: userId,
      initials: Q.text(user.initials) || name.split(/\s+/).map(part => part.charAt(0)).join("").slice(0, 2).toUpperCase(),
      gender: Q.text(user.gender) || "neutral"
    };
  }

  function chatDocument(chatId, ownerUserId, channelType, ownerId, memberIds, title, nowIso, lastSenderId, lastMessage) {
    const isGroup = channelType === "groupSubEvent";
    const startAtIso = new Date(new Date(nowIso).getTime() + 3 * 60 * 60 * 1000).toISOString();
    return {
      _id: `${chatId}:${ownerUserId}`,
      id: chatId,
      ownerUserId,
      avatar: isGroup ? "QG" : "QE",
      title,
      lastMessage,
      lastSenderId,
      memberIds: [...memberIds],
      unread: 0,
      dateIso: nowIso,
      contextStartAtIso: startAtIso,
      contextEndAtIso: new Date(new Date(startAtIso).getTime() + 2 * 60 * 60 * 1000).toISOString(),
      channelType,
      ownerId,
      eventId: EVENT_ID,
      ownerStatus: "A",
      revision: 1,
      subEventId: isGroup ? STAGE_ID : null,
      groupId: isGroup ? ownerId : null
    };
  }

  function memberDocument(ownerType, ownerId, userId, role, status, nowIso) {
    const id = `${PREFIX}:member:${ownerType}:${ownerId}:${userId}`;
    return {
      _id: id,
      syncKey: id,
      ownerType,
      ownerId,
      userId,
      role,
      status,
      pendingSource: status === "pending" ? "invitation" : null,
      requestKind: status === "pending" ? "invite" : null,
      invitedByUserId: status === "pending" ? CASEY_ID : null,
      actionAtIso: nowIso,
      createdDate: nowIso,
      createdUser: CASEY_ID,
      updatedDate: nowIso,
      updatedUser: CASEY_ID
    };
  }

  function messageDocument(id, senderUserId, text, sentAtIso) {
    const sender = userRecord(senderUserId);
    const readers = PRIMARY_IDS.filter(userId => userId !== senderUserId).map(userAvatar);
    return {
      _id: `chat-message:${GROUP_A_CHAT_ID}:${id}`,
      chatId: GROUP_A_CHAT_ID,
      id,
      clientId: `${id}:client`,
      sender: Q.text(sender.name) || senderUserId,
      senderAvatar: userAvatar(senderUserId),
      text,
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

  function eventDocument(nowIso) {
    const startAtIso = new Date(new Date(nowIso).getTime() + 3 * 60 * 60 * 1000).toISOString();
    const endAtIso = new Date(new Date(startAtIso).getTime() + 2 * 60 * 60 * 1000).toISOString();
    const stage = {
      id: STAGE_ID,
      name: "Governance stage",
      description: "Controlled Chat governance membership boundary",
      startAt: startAtIso,
      endAt: endAtIso,
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: 120,
      optional: false,
      capacityMin: 3,
      capacityMax: 5,
      membersAccepted: 4,
      membersPending: 1,
      groups: [
        { id: GROUP_A_ID, label: "Group A", name: "Group A", source: "manual", accepted: 3, pending: 1, capacityMin: 3, capacityMax: 4 },
        { id: GROUP_B_ID, label: "Group B", name: "Group B", source: "manual", accepted: 2, pending: 0, capacityMin: 2, capacityMax: 2 }
      ]
    };
    return {
      _id: EVENT_ID,
      sourceId: EVENT_ID,
      syncKey: EVENT_ID,
      title: EVENT_TITLE,
      subtitle: "Controlled members and report intake",
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
      capacityMin: 4,
      capacityMax: 6,
      capacityTotal: 6,
      acceptedMembers: 4,
      pendingMembers: 1,
      acceptedMemberUserIds: [...EVENT_ACCEPTED_IDS],
      pendingMemberUserIds: [LINA_ID],
      invitedMemberUserIds: [LINA_ID],
      pendingRequestMemberUserIds: [],
      subEventsEnabled: true,
      subEventDefinitions: [stage],
      subEvents: [stage],
      mode: "Casual",
      topics: ["Manual QA", "Chat governance"],
      imageUrl: "",
      startAtIso,
      endAtIso,
      createdDate: nowIso,
      createdUser: CASEY_ID,
      updatedDate: nowIso,
      updatedUser: CASEY_ID
    };
  }

  function fixtureSnapshot() {
    const chats = Q.collection("chats").find({ id: { $in: [EVENT_CHAT_ID, GROUP_A_CHAT_ID, GROUP_B_CHAT_ID] } })
      .sort({ id: 1, ownerUserId: 1, _id: 1 }).toArray();
    const messages = Q.collection("chatMessages").find({ chatId: { $in: [EVENT_CHAT_ID, GROUP_A_CHAT_ID, GROUP_B_CHAT_ID] } })
      .sort({ chatId: 1, sentAtIso: 1, id: 1 }).toArray();
    const members = Q.collection("activityMembers").find({ ownerId: { $in: [EVENT_ID, GROUP_A_ID, GROUP_B_ID] } })
      .sort({ ownerType: 1, ownerId: 1, status: 1, userId: 1 }).toArray();
    const events = Q.collection("events").find({ $or: [{ _id: EVENT_ID }, { sourceId: EVENT_ID }] }).sort({ _id: 1 }).toArray();
    const reports = Q.collection("userReports").find({ targetUserId: RILEY_ID }).sort({ createdDate: 1, _id: 1 }).toArray();
    const users = Q.collection("users").find({ $or: [{ _id: { $in: ALL_USER_IDS } }, { userId: { $in: ALL_USER_IDS } }] })
      .sort({ userId: 1, _id: 1 }).toArray();
    return { chats, messages, members, events, reports, users };
  }

  function memberMatches(member, ownerType, ownerId, userId, role, status) {
    return Q.text(member.ownerType) === ownerType
      && Q.text(member.ownerId) === ownerId
      && Q.text(member.userId) === userId
      && Q.text(member.role) === role
      && Q.text(member.status) === status;
  }

  function baselineValidation(snapshot) {
    const members = snapshot.members || [];
    const expectedMembers = [
      ["event", EVENT_ID, CASEY_ID, "Admin", "accepted"],
      ["event", EVENT_ID, NOVA_ID, "Member", "accepted"],
      ["event", EVENT_ID, RILEY_ID, "Member", "accepted"],
      ["event", EVENT_ID, OLIVIA_ID, "Member", "accepted"],
      ["event", EVENT_ID, LINA_ID, "Member", "pending"],
      ["event", EVENT_ID, SOPHIA_ID, "Member", "left"],
      ["group", GROUP_A_ID, CASEY_ID, "Manager", "accepted"],
      ["group", GROUP_A_ID, NOVA_ID, "Member", "accepted"],
      ["group", GROUP_A_ID, RILEY_ID, "Member", "accepted"],
      ["group", GROUP_A_ID, LINA_ID, "Member", "pending"],
      ["group", GROUP_A_ID, SOPHIA_ID, "Member", "left"],
      ["group", GROUP_B_ID, CASEY_ID, "Manager", "accepted"],
      ["group", GROUP_B_ID, OLIVIA_ID, "Member", "accepted"]
    ];
    const chats = snapshot.chats || [];
    const expectedOwnerCopies = [
      ...EVENT_ACCEPTED_IDS.map(userId => [EVENT_CHAT_ID, userId]),
      ...PRIMARY_IDS.map(userId => [GROUP_A_CHAT_ID, userId]),
      [GROUP_B_CHAT_ID, OLIVIA_ID]
    ];
    const reportTarget = (snapshot.messages || []).find(message => Q.text(message.id) === REPORT_MESSAGE_ID);
    const event = (snapshot.events || [])[0];
    return {
      exactUsers: (snapshot.users || []).length === ALL_USER_IDS.length,
      exactMembers: members.length === expectedMembers.length
        && expectedMembers.every(expected => members.some(member => memberMatches(member, ...expected))),
      exactOwnerCopies: chats.length === expectedOwnerCopies.length
        && expectedOwnerCopies.every(([chatId, ownerUserId]) => chats.some(chat =>
          Q.text(chat.id) === chatId
          && Q.text(chat.ownerUserId) === ownerUserId
          && Q.number(chat.unread) === 0
          && Q.text(chat.ownerStatus) === "A")),
      exactAccessLists: chats.filter(chat => Q.text(chat.id) === EVENT_CHAT_ID).every(chat =>
        Q.sameJson((chat.memberIds || []).map(Q.text), EVENT_ACCEPTED_IDS))
        && chats.filter(chat => Q.text(chat.id) === GROUP_A_CHAT_ID).every(chat =>
          Q.sameJson((chat.memberIds || []).map(Q.text), PRIMARY_IDS))
        && chats.filter(chat => Q.text(chat.id) === GROUP_B_CHAT_ID).every(chat =>
          Q.sameJson((chat.memberIds || []).map(Q.text), [CASEY_ID, OLIVIA_ID])),
      exactMessages: (snapshot.messages || []).length === 3
        && Boolean(reportTarget)
        && Q.text(reportTarget.senderAvatar && reportTarget.senderAvatar.id) === RILEY_ID
        && Q.text(reportTarget.text) === REPORT_MESSAGE_TEXT,
      exactEvent: (snapshot.events || []).length === 1
        && Q.text(event && event.sourceId) === EVENT_ID
        && Q.text(event && event.title) === EVENT_TITLE
        && Q.sameJson((event && event.acceptedMemberUserIds || []).map(Q.text), EVENT_ACCEPTED_IDS)
        && Q.sameJson((event && event.pendingMemberUserIds || []).map(Q.text), [LINA_ID])
        && (event && event.subEvents || []).length === 1
        && (event.subEvents[0].groups || []).length === 2,
      zeroReportsForRiley: (snapshot.reports || []).length === 0
    };
  }

  function unchangedExceptReports(current, baseline) {
    return ["chats", "messages", "members", "events", "users"]
      .every(key => Q.sameJson(current[key] || [], baseline[key] || []));
  }

  function terminalValidation(snapshot, baseline) {
    const report = (snapshot.reports || [])[0];
    return {
      exactlyOneReport: (snapshot.reports || []).length === 1,
      exactReporterAndTarget: Q.text(report && report.userId) === NOVA_ID
        && Q.text(report && report.targetUserId) === RILEY_ID
        && Q.text(report && report.handle) === "Riley Outside",
      exactReasonAndDetails: Q.text(report && report.reason) === REPORT_REASON
        && Q.text(report && report.details) === REPORT_DETAILS,
      exactEventContext: Q.text(report && report.eventId) === EVENT_ID
        && Q.text(report && report.eventTitle) === EVENT_TITLE
        && Q.text(report && report.memberEntryId) === `${PREFIX}:member:event:${EVENT_ID}:${RILEY_ID}`,
      exactChatContext: Q.text(report && report.sourceType).toLowerCase() === "chat"
        && Q.text(report && report.sourceId) === REPORT_MESSAGE_ID
        && Q.text(report && report.sourceText) === REPORT_MESSAGE_TEXT
        && Q.text(report && report.chatId) === GROUP_A_CHAT_ID
        && Q.text(report && report.messageId) === REPORT_MESSAGE_ID,
      unresolvedIntake: !Q.text(report && report.warnedAtIso)
        && !Q.text(report && report.warnedByAdminUserId)
        && !Q.text(report && report.resolvedAtIso)
        && !Q.text(report && report.resolvedByAdminUserId),
      deterministicSyncKey: Q.text(report && report.syncKey).startsWith("user-report:"),
      fixtureReadOnly: unchangedExceptReports(snapshot, baseline)
    };
  }

  function stage() {
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    ALL_USER_IDS.forEach(userRecord);
    const snapshots = Q.snapshotSpecs(fixtureSpecs());
    const stagedAtIso = Q.nowIso();
    const stateId = Q.stateId(SCENARIO);
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: stateId,
      scenario: SCENARIO,
      checkpointId: CHECKPOINT,
      database: db.getName(),
      stagedAtIso,
      phase: "staging",
      snapshots
    });
    try {
      clearFixture();
      const event = eventDocument(stagedAtIso);
      Q.collection("events").insertOne(event);

      const messages = [
        messageDocument(`${PREFIX}:message:casey`, CASEY_ID, "QA governance baseline from Casey", new Date(new Date(stagedAtIso).getTime() - 120000).toISOString()),
        messageDocument(`${PREFIX}:message:nova`, NOVA_ID, "QA governance baseline from Nova", new Date(new Date(stagedAtIso).getTime() - 60000).toISOString()),
        messageDocument(REPORT_MESSAGE_ID, RILEY_ID, REPORT_MESSAGE_TEXT, stagedAtIso)
      ];
      Q.collection("chatMessages").insertMany(messages);

      const rows = [
        ...EVENT_ACCEPTED_IDS.map(userId => chatDocument(
          EVENT_CHAT_ID, userId, "mainEvent", EVENT_ID, EVENT_ACCEPTED_IDS,
          "QA Chat Governance · Event", stagedAtIso, RILEY_ID, REPORT_MESSAGE_TEXT)),
        ...PRIMARY_IDS.map(userId => chatDocument(
          GROUP_A_CHAT_ID, userId, "groupSubEvent", GROUP_A_ID, PRIMARY_IDS,
          "QA Chat Governance · Group A", stagedAtIso, RILEY_ID, REPORT_MESSAGE_TEXT)),
        chatDocument(
          GROUP_B_CHAT_ID, OLIVIA_ID, "groupSubEvent", GROUP_B_ID, [CASEY_ID, OLIVIA_ID],
          "QA Chat Governance · Group B", stagedAtIso, OLIVIA_ID, "Group B control")
      ];
      Q.collection("chats").insertMany(rows);

      Q.collection("activityMembers").insertMany([
        memberDocument("event", EVENT_ID, CASEY_ID, "Admin", "accepted", stagedAtIso),
        memberDocument("event", EVENT_ID, NOVA_ID, "Member", "accepted", stagedAtIso),
        memberDocument("event", EVENT_ID, RILEY_ID, "Member", "accepted", stagedAtIso),
        memberDocument("event", EVENT_ID, OLIVIA_ID, "Member", "accepted", stagedAtIso),
        memberDocument("event", EVENT_ID, LINA_ID, "Member", "pending", stagedAtIso),
        memberDocument("event", EVENT_ID, SOPHIA_ID, "Member", "left", stagedAtIso),
        memberDocument("group", GROUP_A_ID, CASEY_ID, "Manager", "accepted", stagedAtIso),
        memberDocument("group", GROUP_A_ID, NOVA_ID, "Member", "accepted", stagedAtIso),
        memberDocument("group", GROUP_A_ID, RILEY_ID, "Member", "accepted", stagedAtIso),
        memberDocument("group", GROUP_A_ID, LINA_ID, "Member", "pending", stagedAtIso),
        memberDocument("group", GROUP_A_ID, SOPHIA_ID, "Member", "left", stagedAtIso),
        memberDocument("group", GROUP_B_ID, CASEY_ID, "Manager", "accepted", stagedAtIso),
        memberDocument("group", GROUP_B_ID, OLIVIA_ID, "Member", "accepted", stagedAtIso)
      ]);

      for (const userId of PRIMARY_IDS) {
        const set = {
          "activities.chats": 0,
          "activities.chat.all": 0,
          "activities.chat.event": 0,
          "activities.chat.subEvent": 0,
          "activities.chat.group": 0,
          "activities.chat.service": 0,
          "activities.chat.appSupport": 0
        };
        if (userId === CASEY_ID) set.hostTier = "Admin";
        const update = Q.collection("users").updateOne({ $or: [{ _id: userId }, { userId }] }, { $set: set });
        if (update.matchedCount !== 1) Q.fail(`CHAT-GOVERNANCE-001 user '${userId}' could not be staged.`);
      }

      const baseline = fixtureSnapshot();
      const validation = baselineValidation(baseline);
      if (!Object.values(validation).every(Boolean)) {
        Q.fail(`CHAT-GOVERNANCE-001 fixture validation failed: ${JSON.stringify(validation)}.`);
      }
      Q.collection(Q.STATE_COLLECTION).updateOne({ _id: stateId }, { $set: {
        phase: "fixture-ready",
        context: {
          eventId: EVENT_ID,
          eventChatId: EVENT_CHAT_ID,
          groupAId: GROUP_A_ID,
          groupAChatId: GROUP_A_CHAT_ID,
          groupBId: GROUP_B_ID,
          groupBChatId: GROUP_B_CHAT_ID,
          reportMessageId: REPORT_MESSAGE_ID,
          reportMessageText: REPORT_MESSAGE_TEXT,
          reportReason: REPORT_REASON,
          reportDetails: REPORT_DETAILS,
          actors: { casey: CASEY_ID, nova: NOVA_ID, riley: RILEY_ID },
          controls: { pending: LINA_ID, left: SOPHIA_ID, otherGroup: OLIVIA_ID }
        },
        baseline
      } });
      Q.printObject({
        scenario: SCENARIO,
        checkpoint: CHECKPOINT,
        phase: "fixture-ready",
        actors: PRIMARY_IDS.map(Q.user),
        expected: {
          eventAccepted: 4,
          eventPending: 1,
          groupAAccepted: 3,
          groupAPending: 1,
          reportTarget: "Riley Outside",
          reportReason: REPORT_REASON,
          reportDetails: REPORT_DETAILS,
          persistedReportsBeforeJourney: 0
        },
        validation,
        next: "Run the authenticated governance baseline oracle, then open the three managed browsers and execute the single end-to-end member/report journey."
      });
    } catch (error) {
      Q.restoreSnapshots(snapshots);
      Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: stateId });
      throw error;
    }
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
    const current = fixtureSnapshot();
    if ((current.reports || []).length === 0) {
      const validation = baselineValidation(current);
      validation.zeroWriteSnapshot = unchangedExceptReports(current, state.baseline);
      if (!Object.values(validation).every(Boolean)) {
        Q.fail(`CHAT-GOVERNANCE-001 baseline drift detected: ${JSON.stringify(validation)}.`);
      }
      Q.printObject({ scenario: SCENARIO, checkpoint: CHECKPOINT, phase: "fixture-ready", expected: state.context, validation });
      return;
    }
    const validation = terminalValidation(current, state.baseline);
    if (!Object.values(validation).every(Boolean)) {
      Q.fail(`CHAT-GOVERNANCE-001 terminal mismatch: ${JSON.stringify(validation)}.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpoint: CHECKPOINT,
      phase: "terminal-pass",
      expected: state.context,
      validation,
      reportId: current.reports[0]._id,
      next: "Run the authenticated terminal governance oracle, then reset and close the checkpoint."
    });
  }

  function reset() {
    const state = Q.activeState(SCENARIO, true);
    if (Q.text(state.checkpointId) !== CHECKPOINT) {
      Q.fail(`active Chat checkpoint is '${Q.text(state.checkpointId)}', not '${CHECKPOINT}'.`);
    }
    Q.restoreSnapshots(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    const remaining = Q.collection("chats").countDocuments({ id: { $in: [EVENT_CHAT_ID, GROUP_A_CHAT_ID, GROUP_B_CHAT_ID] } })
      + Q.collection("chatMessages").countDocuments({ chatId: { $in: [EVENT_CHAT_ID, GROUP_A_CHAT_ID, GROUP_B_CHAT_ID] } })
      + Q.collection("activityMembers").countDocuments({ ownerId: { $in: [EVENT_ID, GROUP_A_ID, GROUP_B_ID] } })
      + Q.collection("events").countDocuments({ $or: [{ _id: EVENT_ID }, { sourceId: EVENT_ID }] })
      + Q.collection("userReports").countDocuments({ eventId: EVENT_ID });
    if (remaining !== 0) Q.fail(`reset left ${remaining} CHAT-GOVERNANCE-001 fixture rows.`);
    Q.printObject({ scenario: SCENARIO, checkpoint: CHECKPOINT, phase: "reset-complete", restored: true });
  }

  Q.assertDeploymentSafety();
  assertCheckpoint();
  if (COMMAND === "stage") stage();
  else if (COMMAND === "status") status();
  else if (COMMAND === "reset") reset();
  else Q.fail(`unsupported command '${COMMAND}' for ${CHECKPOINT}.`);
})();
