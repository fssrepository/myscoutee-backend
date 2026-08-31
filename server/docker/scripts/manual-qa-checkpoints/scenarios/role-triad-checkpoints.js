/* global ManualQa, db, process, ObjectId */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "role-triad";
  const CHECKPOINT = "ROLE-TRIAD-CORE-001";
  const MEMBER_ID = "7822c5f99eff99d63abe8933";
  const ADMIN_ID = "admin-demo-ava";
  const OPERATOR_ID = "operator@myscoutee.local";
  const REPORT_IDS = [
    ObjectId("690000000000000000000101"),
    ObjectId("690000000000000000000102")
  ];
  const FEEDBACK_ID = ObjectId("690000000000000000000202");
  const FEEDBACK_ID_TEXT = FEEDBACK_ID.toHexString();
  const MODERATION_CHAT_IDS = [
    `c-support-admin-${MEMBER_ID}`,
    "c-support-admin-bf057de7c586eede7e84bdc7"
  ];
  const LEGACY_FEEDBACK_CHAT_IDS = [`c-feedback-admin-${MEMBER_ID}`];
  const OWNED_CHAT_IDS = [...MODERATION_CHAT_IDS, ...LEGACY_FEEDBACK_CHAT_IDS];
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();

  const selectors = {
    users: {
      $or: [
        { _id: { $in: [MEMBER_ID, ADMIN_ID, OPERATOR_ID] } },
        { userId: { $in: [MEMBER_ID, ADMIN_ID, OPERATOR_ID] } }
      ]
    },
    reports: { _id: { $in: REPORT_IDS } },
    feedback: { _id: FEEDBACK_ID },
    configuration: { _id: "deployment-configuration" },
    chats: { id: { $in: OWNED_CHAT_IDS } },
    messages: { chatId: { $in: OWNED_CHAT_IDS } },
    notifications: {
      $or: [
        { sourceType: "chat", sourceId: { $in: OWNED_CHAT_IDS } },
        { sourceType: "feedback", sourceId: FEEDBACK_ID_TEXT }
      ]
    },
    outbox: {
      $or: [
        { entityType: "chat", entityId: { $in: OWNED_CHAT_IDS } },
        { entityType: "feedback", entityId: FEEDBACK_ID_TEXT }
      ]
    },
    shareTokens: { kind: "adminHelp" },
    affinityTask: { taskKey: `USER:${MEMBER_ID}` }
  };

  function config() {
    if (checkpointId !== CHECKPOINT) {
      Q.fail(`role-triad supports only ${CHECKPOINT}.`);
    }
  }

  function user(userId) {
    return Q.collection("users").findOne({ $or: [{ _id: userId }, { userId }] });
  }

  function report(id) {
    return Q.collection("userReports").findOne({ _id: id });
  }

  function feedback() {
    return Q.collection("userFeedback").findOne(selectors.feedback);
  }

  function configuration() {
    return Q.collection("deploymentConfigurations").findOne(selectors.configuration);
  }

  function unreadNotificationCount(userId) {
    return Q.collection("userNotifications").countDocuments({
      recipientUserId: userId,
      $or: [{ readAtIso: { $exists: false } }, { readAtIso: null }]
    });
  }

  function synchronizeNotificationCounters() {
    for (const userId of [MEMBER_ID, ADMIN_ID, OPERATOR_ID]) {
      const unreadCount = unreadNotificationCount(userId);
      const result = Q.collection("users").updateOne(
        { $or: [{ _id: userId }, { userId }] },
        { $set: { "activities.notifications": unreadCount } }
      );
      if (result.matchedCount !== 1) {
        Q.fail(`notification counter target '${userId}' disappeared.`);
      }
    }
  }

  function synchronizeNotificationCounter(userId) {
    const unreadCount = unreadNotificationCount(userId);
    const result = Q.collection("users").updateOne(
      { $or: [{ _id: userId }, { userId }] },
      { $set: { "activities.notifications": unreadCount } }
    );
    if (result.matchedCount !== 1) {
      Q.fail(`notification counter target '${userId}' disappeared.`);
    }
    return unreadCount;
  }

  function removeTrackedPendingOutboxDelta(selector, label) {
    const trackedCount = Q.collection("notificationOutbox").countDocuments({
      $and: [selector, { pendingCounterTracked: true }]
    });
    if (trackedCount === 0) {
      return 0;
    }
    const rule = Q.assertRuleNotRunning("notification-outbox");
    const pendingBefore = Q.number(rule.runState && rule.runState.pendingCount);
    if (trackedCount > pendingBefore) {
      Q.fail(`notification-outbox pendingCount is smaller than the ${label} delta.`);
    }
    const result = Q.collection("notificationRuleConfigs").updateOne(
      {
        _id: rule._id,
        "runState.currentStatus": { $ne: "running" },
        "runState.pendingCount": { $gte: trackedCount }
      },
      {
        $inc: { "runState.pendingCount": -trackedCount },
        $set: {
          "runState.pendingCountUnit": "admin.jobs.rule.notification.outbox",
          "runState.pendingCountUpdatedAtIso": Q.nowIso()
        }
      }
    );
    if (result.modifiedCount !== 1) {
      Q.fail(`failed to remove the ${label} notification-outbox pending delta.`);
    }
    return trackedCount;
  }

  function brandingSummary(document) {
    const branding = document && document.branding ? document.branding : {};
    return {
      productName: Q.text(branding.productName),
      homeLabel: Q.text(branding.homeLabel),
      logoUrl: Q.text(branding.logoUrl),
      themePreset: Q.text(branding.themePreset),
      revision: Q.number(branding.revision)
    };
  }

  function userSummary(document) {
    return {
      userId: Q.userIdOf(document),
      name: Q.text(document && document.name),
      email: Q.text(document && document.email),
      status: Q.text(document && document.status),
      profileStatus: Q.text(document && document.profileStatus),
      previousProfileStatus: document && document.previousProfileStatus,
      hostTier: Q.text(document && document.hostTier),
      operator: document && document.operator === true,
      activities: document && document.activities
    };
  }

  function reportSummary(document) {
    return {
      id: Q.text(document && document._id),
      targetUserId: Q.text(document && document.targetUserId),
      reporterUserId: Q.text(document && document.userId),
      reason: Q.text(document && document.reason),
      warnedAtIso: document && document.warnedAtIso,
      warnedByAdminUserId: document && document.warnedByAdminUserId,
      resolvedAtIso: document && document.resolvedAtIso,
      resolvedByAdminUserId: document && document.resolvedByAdminUserId,
      updatedDate: document && document.updatedDate,
      updatedUser: document && document.updatedUser
    };
  }

  function feedbackSummary(document) {
    return {
      id: Q.text(document && document._id),
      userId: Q.text(document && document.userId),
      subject: Q.text(document && document.subject),
      resolvedAtIso: document && document.resolvedAtIso,
      resolvedByAdminUserId: document && document.resolvedByAdminUserId,
      updatedDate: document && document.updatedDate,
      updatedUser: document && document.updatedUser
    };
  }

  function chatBoundarySummary(chatIds) {
    return {
      chatCount: Q.collection("chats").countDocuments({ id: { $in: chatIds } }),
      messageCount: Q.collection("chatMessages").countDocuments({ chatId: { $in: chatIds } }),
      notificationCount: Q.collection("userNotifications").countDocuments({
        sourceType: "chat",
        sourceId: { $in: chatIds }
      }),
      outboxCount: Q.collection("notificationOutbox").countDocuments({
        entityType: "chat",
        entityId: { $in: chatIds }
      }),
      supportCaseDocumentCount: Q.collection("chats").countDocuments({
        id: { $in: chatIds },
        "supportCase.status": { $exists: true }
      }),
      feedbackResolvedMessageCount: Q.collection("chatMessages").countDocuments({
        chatId: { $in: chatIds },
        text: /^Your feedback /
      })
    };
  }

  function feedbackNotificationSummary(feedbackId, recipientUserId) {
    return {
      notificationCount: Q.collection("userNotifications").countDocuments({
        kind: "feedback-resolved",
        sourceType: "feedback",
        sourceId: feedbackId,
        recipientUserId
      }),
      outboxCount: Q.collection("notificationOutbox").countDocuments({
        notificationType: "feedback-resolved",
        entityType: "feedback",
        entityId: feedbackId
      })
    };
  }

  function observed() {
    const reports = REPORT_IDS.map(report);
    const feedbackDocument = feedback();
    const member = user(MEMBER_ID);
    const admin = user(ADMIN_ID);
    const operator = user(OPERATOR_ID);
    const configDocument = configuration();
    return {
      member: userSummary(member),
      admin: userSummary(admin),
      operator: userSummary(operator),
      reports: reports.map(reportSummary),
      feedback: feedbackSummary(feedbackDocument),
      branding: brandingSummary(configDocument),
      moderationChats: chatBoundarySummary(MODERATION_CHAT_IDS),
      legacyFeedbackChat: chatBoundarySummary(LEGACY_FEEDBACK_CHAT_IDS),
      feedbackNotification: feedbackNotificationSummary(FEEDBACK_ID_TEXT, MEMBER_ID),
      affinityTaskCount: Q.collection("affinityRecomputeTasks").countDocuments(selectors.affinityTask)
    };
  }

  function assertBaseline(values) {
    if (!values.member.userId || !values.admin.userId || !values.operator.userId) {
      Q.fail("member, admin and operator must all exist before staging.");
    }
    if (values.member.profileStatus === "blocked" || values.member.previousProfileStatus != null) {
      Q.fail("Kai must start unblocked with no previous profile status.");
    }
    if (values.admin.status !== "A" || values.operator.status !== "A" || values.operator.operator !== true) {
      Q.fail("Ava admin and the demo operator must both start active with the operator flag intact.");
    }
    if (values.reports.length !== 2 || values.reports.some(item => !item.id || item.resolvedAtIso || item.warnedAtIso)) {
      Q.fail("the two controlled Kai reports must start unresolved and unwarned.");
    }
    if (!values.feedback.id || values.feedback.resolvedAtIso) {
      Q.fail("the controlled Kai feedback must start unresolved.");
    }
    if (values.moderationChats.chatCount !== 0 || values.moderationChats.messageCount !== 0
        || values.moderationChats.notificationCount !== 0 || values.moderationChats.outboxCount !== 0
        || values.legacyFeedbackChat.chatCount !== 0 || values.legacyFeedbackChat.messageCount !== 0
        || values.legacyFeedbackChat.notificationCount !== 0 || values.legacyFeedbackChat.outboxCount !== 0
        || values.feedbackNotification.notificationCount !== 0
        || values.feedbackNotification.outboxCount !== 0) {
      Q.fail("the controlled moderation chats, legacy feedback chat, and feedback notification records must start empty.");
    }
    if (!values.branding.productName || !values.branding.themePreset) {
      Q.fail("deployment branding baseline is incomplete.");
    }
  }

  function requireState() {
    const state = Q.activeState(SCENARIO, true);
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged role-triad checkpoint is '${Q.text(state.checkpointId)}', not '${checkpointId}'.`);
    }
    return state;
  }

  function stage() {
    config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    synchronizeNotificationCounters();
    const values = observed();
    assertBaseline(values);
    const stagedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId,
      database: db.getName(),
      phase: "baseline-ready",
      stagedAtIso,
      expectedProductName: "MyScoutee Role QA",
      baselineBranding: values.branding,
      baselineMember: values.member,
      baselineAdmin: values.admin,
      baselineOperator: values.operator,
      controlReport: values.reports[0],
      snapshots: Q.snapshotSpecs([
        { collection: "users", selector: selectors.users },
        { collection: "userReports", selector: selectors.reports },
        { collection: "userFeedback", selector: selectors.feedback },
        { collection: "deploymentConfigurations", selector: selectors.configuration },
        { collection: "chats", selector: selectors.chats },
        { collection: "chatMessages", selector: selectors.messages },
        { collection: "userNotifications", selector: selectors.notifications },
        { collection: "notificationOutbox", selector: selectors.outbox },
        { collection: "shareTokens", selector: selectors.shareTokens },
        { collection: "affinityRecomputeTasks", selector: selectors.affinityTask }
      ])
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline-ready",
      stagedAtIso,
      actors: {
        member: values.member,
        admin: values.admin,
        operator: values.operator
      },
      controls: {
        reports: values.reports,
        feedback: values.feedback,
        branding: values.branding,
        temporaryProductName: "MyScoutee Role QA"
      },
      next: `Open the three managed browser sessions with guides/qa/tools/open-checkpoint-browser-sessions.sh ${CHECKPOINT}.`
    });
  }

  function status() {
    config();
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "not-staged",
        next: `Run stage role-triad ${CHECKPOINT}.`
      });
      return;
    }
    requireState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: Q.text(state.phase) || "active-manual-journey",
      stagedAtIso: state.stagedAtIso,
      expectedProductName: state.expectedProductName,
      baselineBranding: state.baselineBranding,
      observed: observed(),
      next: "Continue the single three-role journey. Do not restage while it is active."
    });
  }

  function rearmFeedbackResolution() {
    config();
    const state = requireState();
    const feedbackDocument = feedback();
    if (!feedbackDocument) {
      Q.fail(`controlled Kai feedback '${FEEDBACK_ID_TEXT}' was not found.`);
    }
    const notificationSelector = {
      sourceType: "feedback",
      sourceId: FEEDBACK_ID_TEXT
    };
    const outboxSelector = {
      entityType: "feedback",
      entityId: FEEDBACK_ID_TEXT
    };
    removeTrackedPendingOutboxDelta(outboxSelector, "controlled feedback retest");

    const removedNotifications = Q.collection("userNotifications").deleteMany(notificationSelector);
    const removedOutboxes = Q.collection("notificationOutbox").deleteMany(outboxSelector);
    const nowIso = Q.nowIso();
    const feedbackUpdate = Q.collection("userFeedback").updateOne(
      { _id: FEEDBACK_ID },
      {
        $unset: {
          resolvedAtIso: "",
          resolvedByAdminUserId: ""
        },
        $set: {
          updatedDate: nowIso,
          updatedUser: "manual-qa-checkpoint:v1:role-triad:kai-feedback-retest"
        }
      }
    );
    if (feedbackUpdate.matchedCount !== 1) {
      Q.fail("failed to rearm the exact feedback-resolution retest record.");
    }
    const unreadCount = synchronizeNotificationCounter(MEMBER_ID);
    const rearmed = feedbackSummary(feedback());
    const notificationState = feedbackNotificationSummary(
      FEEDBACK_ID_TEXT,
      MEMBER_ID);
    if (rearmed.resolvedAtIso
        || notificationState.notificationCount !== 0
        || notificationState.outboxCount !== 0) {
      Q.fail("feedback-resolution retest did not reach a clean unresolved boundary.");
    }
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      {
        $set: {
          phase: "feedback-resolution-retest-ready",
          feedbackResolutionRetestReadyAtIso: nowIso,
          feedbackResolutionRetestTarget: "kai-controlled-feedback"
        },
        $inc: { feedbackResolutionRetestRearmCount: 1 }
      }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "feedback-resolution-retest-ready",
      feedback: rearmed,
      removedNotifications: removedNotifications.deletedCount,
      removedOutboxes: removedOutboxes.deletedCount,
      recipientUnreadNotificationCount: unreadCount,
      notificationState,
      next: "Keep Kai and Ava open; resolve Review event behavior faster once and observe Kai's normal notification poll."
    });
  }

  function reset() {
    config();
    const state = requireState();
    removeTrackedPendingOutboxDelta(selectors.outbox, "owned role-triad reset");
    Q.restoreSnapshots(state.snapshots);
    synchronizeNotificationCounters();
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    const values = observed();
    assertBaseline(values);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      restoredAtIso: Q.nowIso(),
      restored: values,
      next: `Run status role-triad ${CHECKPOINT}; expected phase is not-staged.`
    });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stage(); break;
    case "status": status(); break;
    case "rearm-feedback-resolution": rearmFeedbackResolution(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
