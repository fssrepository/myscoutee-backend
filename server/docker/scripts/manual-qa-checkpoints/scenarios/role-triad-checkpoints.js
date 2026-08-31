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
  const SUPPORT_CHAT_IDS = [
    `c-support-admin-${MEMBER_ID}`,
    "c-support-admin-bf057de7c586eede7e84bdc7"
  ];
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
    chats: { id: { $in: SUPPORT_CHAT_IDS } },
    messages: { chatId: { $in: SUPPORT_CHAT_IDS } },
    notifications: { sourceType: "chat", sourceId: { $in: SUPPORT_CHAT_IDS } },
    outbox: { entityType: "chat", entityId: { $in: SUPPORT_CHAT_IDS } },
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
      supportChatCount: Q.collection("chats").countDocuments(selectors.chats),
      supportMessageCount: Q.collection("chatMessages").countDocuments(selectors.messages),
      supportNotificationCount: Q.collection("userNotifications").countDocuments(selectors.notifications),
      supportOutboxCount: Q.collection("notificationOutbox").countDocuments(selectors.outbox),
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
    if (values.supportChatCount !== 0 || values.supportMessageCount !== 0
        || values.supportNotificationCount !== 0 || values.supportOutboxCount !== 0) {
      Q.fail("the controlled support conversation and its notification records must start empty.");
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

  function reset() {
    config();
    const state = requireState();
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
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
