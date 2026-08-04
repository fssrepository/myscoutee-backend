/* global ManualQa, db, process */
(() => {
  "use strict";
  const Q = ManualQa;
  const SCENARIO = "stat-011";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const requestedSenderUserId = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID)
    || "bf057de7c586eede7e84bdc7";
  const requestedChatTitle = Q.text(process.env.MANUAL_QA_CHAT_TITLE) || "Host Circle Ops";

  function oracle(chatId) {
    const stats = Q.collection("adminStats").findOne({ statsKey: "global" }) || {};
    const monitoring = Q.collection("adminMonitoring").findOne({ monitoringKey: "global" }) || {};
    const today = new Date().toISOString().slice(0, 10);
    return {
      chatMessageCount: Q.collection("chatMessages").countDocuments({ chatId }),
      statsMessages: Q.mapNumber(stats.counters, "chat.message.sent"),
      todayMessages: Q.mapNumber(stats.dailyActivity && stats.dailyActivity[today], "messages"),
      monitoringMessages: Q.mapNumber(monitoring.counters, "chat.message.sent")
    };
  }

  function selectChat() {
    const values = Q.collection("chats").find({
      title: requestedChatTitle,
      ownerUserId: requestedSenderUserId,
      memberIds: requestedSenderUserId
    }).limit(2).toArray();
    if (values.length !== 1) {
      Q.fail(`expected one '${requestedChatTitle}' chat owned by sender ${requestedSenderUserId}, found ${values.length}.`);
    }
    return values[0];
  }

  function stage() {
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    Q.ensureUser(requestedSenderUserId, "chat sender");
    const chat = selectChat();
    const chatId = Q.text(chat.id || chat._id);
    const stagedAtIso = Q.nowIso();
    const uniqueMessage = `QA STAT-011 ordinary message ${stagedAtIso}`;
    const baseline = oracle(chatId);
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      database: db.getName(),
      stagedAtIso,
      context: {
        senderUserId: requestedSenderUserId,
        chatId,
        chatTitle: requestedChatTitle,
        uniqueMessage
      },
      baseline
    });
    Q.printObject({
      scenario: SCENARIO,
      phase: "baseline-ready",
      stagedAtIso,
      sender: Q.user(requestedSenderUserId),
      chat: { id: chatId, title: requestedChatTitle },
      uniqueMessage,
      baseline,
      mutation: "Only the manual-QA checkpoint row was created; no chat message was inserted.",
      next: "Paste this exact uniqueMessage once as an ordinary message in the open chat, then run status stat-011."
    });
  }

  function status() {
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({ scenario: SCENARIO, phase: "not-staged", next: "Run stage stat-011." });
      return;
    }
    const context = state.context;
    const rows = Q.collection("chatMessages").find({
      chatId: context.chatId,
      text: context.uniqueMessage,
      messageSenderUserIds: context.senderUserId
    }).toArray();
    const current = oracle(context.chatId);
    const delta = {
      chatMessageCount: current.chatMessageCount - state.baseline.chatMessageCount,
      statsMessages: current.statsMessages - state.baseline.statsMessages,
      todayMessages: current.todayMessages - state.baseline.todayMessages,
      monitoringMessages: current.monitoringMessages - state.baseline.monitoringMessages
    };
    const chatCopies = Q.collection("chats").find({ id: context.chatId }).toArray();
    const validation = {
      exactSinglePersistedMessage: rows.length === 1,
      exactChatCountDelta: delta.chatMessageCount === 1,
      chatProjectionShowsUniqueMessage: chatCopies.length > 0
        && chatCopies.every(chat => chat.lastMessage === context.uniqueMessage),
      statisticsExactDelta: delta.statsMessages === 1 && delta.todayMessages === 1,
      monitoringExactDelta: delta.monitoringMessages === 1
    };
    const complete = Object.values(validation).every(Boolean);
    Q.printObject({
      scenario: SCENARIO,
      phase: complete ? "completed" : rows.length === 1 ? "materializing" : "waiting-for-message",
      sender: Q.user(context.senderUserId),
      chat: { id: context.chatId, title: context.chatTitle },
      uniqueMessage: context.uniqueMessage,
      persistedRows: rows.map(row => ({
        id: row._id,
        sentAtIso: row.sentAtIso,
        text: row.text,
        senderUserIds: row.messageSenderUserIds
      })),
      current,
      delta,
      validation,
      next: complete
        ? "Capture the one bubble plus Statistics and Monitoring; then reset stat-011."
        : "Send only the printed token once, or wait for the Statistics/Monitoring workers and run status again."
    });
  }

  function reset() {
    const state = Q.activeState(SCENARIO, true);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      phase: "reset-complete",
      restored: true,
      detail: "The checkpoint was removed. The ordinary user message and legitimate telemetry remain as dated QA evidence."
    });
  }

  Q.assertDeploymentSafety();
  if (command === "stage") stage();
  else if (command === "status") status();
  else if (command === "reset") reset();
  else Q.fail(`unsupported command '${command}' for ${SCENARIO}.`);
})();
