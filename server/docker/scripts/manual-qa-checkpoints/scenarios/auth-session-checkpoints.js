/* global ManualQa, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "auth-session";
  const CHECKPOINT = "AUTH-SESSION-001";
  const NOTIFICATION_RULE = "notification-outbox";
  const USER_ID = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID)
    || "650000000000000000000062";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();

  const selectors = {
    sessions: { _id: USER_ID },
    audits: { userId: USER_ID },
    notifications: { recipientUserId: USER_ID, kind: "security-login" },
    outbox: { notificationType: "security-login", recipientUserIds: USER_ID }
  };

  function config() {
    if (checkpointId !== CHECKPOINT) {
      Q.fail(`auth-session currently supports only ${CHECKPOINT}.`);
    }
    Q.ensureUser(USER_ID, "controlled session user");
  }

  function requireState() {
    const state = Q.activeState(SCENARIO, true);
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged auth checkpoint is '${Q.text(state.checkpointId)}', not '${checkpointId}'.`);
    }
    return state;
  }

  function documents() {
    const state = Q.collection("userSessionStates").findOne(selectors.sessions);
    const audits = Q.collection("userLoginAudits")
      .find(selectors.audits)
      .sort({ attemptedAtIso: 1, _id: 1 })
      .toArray();
    const notifications = Q.collection("userNotifications")
      .find(selectors.notifications)
      .sort({ createdDate: 1, _id: 1 })
      .toArray();
    const outbox = Q.collection("notificationOutbox")
      .find(selectors.outbox)
      .sort({ createdDate: 1, _id: 1 })
      .toArray();
    return { state, audits, notifications, outbox };
  }

  function activeSessions(state) {
    return Array.isArray(state && state.activeSessions)
      ? state.activeSessions.slice().sort((left, right) =>
          Q.text(left.createdAtIso).localeCompare(Q.text(right.createdAtIso)))
      : [];
  }

  function expectedOutcomes(checkpointState) {
    return checkpointState && checkpointState.blockedReplayRequired
      ? ["ACCEPTED", "ACCEPTED", "BLOCKED_LIMIT", "BLOCKED_LIMIT", "ACCEPTED"]
      : ["ACCEPTED", "ACCEPTED", "BLOCKED_LIMIT", "ACCEPTED"];
  }

  function assertCurrentInvariants(values, checkpointState) {
    const sessions = activeSessions(values.state);
    if (sessions.length > 2) Q.fail(`found ${sessions.length} active sessions; maximum is 2.`);
    const sessionIds = sessions.map(item => Q.text(item.sessionId));
    if (sessionIds.some(value => !value) || new Set(sessionIds).size !== sessionIds.length) {
      Q.fail("active session identifiers are blank or duplicated.");
    }
    const attemptIds = values.audits.map(item => Q.text(item.attemptId));
    if (attemptIds.some(value => !value) || new Set(attemptIds).size !== attemptIds.length) {
      Q.fail("login audit attempt identifiers are blank or duplicated.");
    }
    const outcomes = values.audits.map(item => Q.text(item.outcome));
    const expectedPrefix = expectedOutcomes(checkpointState);
    outcomes.forEach((value, index) => {
      if (value !== expectedPrefix[index]) {
        Q.fail(`audit ${index + 1} has outcome '${value}', expected '${expectedPrefix[index]}'.`);
      }
    });
    if (values.audits.length > expectedPrefix.length) {
      Q.fail(`found ${values.audits.length} login audits; expected at most ${expectedPrefix.length}.`);
    }
    for (const audit of values.audits) {
      const label = Q.text(audit.clientLabel);
      if (!label || Q.text(audit.userAgent) || Q.text(audit.token) || Q.text(audit.credential)) {
        Q.fail("audit metadata is missing its normalized client label or contains forbidden credential fields.");
      }
      if (!/^[0-9a-f]{64}$/.test(Q.text(audit.userAgentHash))) {
        Q.fail("audit user-agent metadata is not stored as a SHA-256 hash.");
      }
    }
    const expectedWarnings = Math.max(0, values.audits.length - 1);
    if (values.notifications.length !== expectedWarnings) {
      Q.fail(`found ${values.notifications.length} security notifications; expected ${expectedWarnings}.`);
    }
    if (values.outbox.length !== expectedWarnings) {
      Q.fail(`found ${values.outbox.length} security outbox rows; expected ${expectedWarnings}.`);
    }
    for (const notification of values.notifications) {
      const payload = notification.payload || {};
      const serialized = JSON.stringify({
        title: notification.title,
        message: notification.message,
        payload
      });
      if (!Q.text(payload.clientLabel)
          || Q.text(payload.sourceAddress)
          || Q.text(payload.userAgent)
          || Q.text(payload.token)
          || /Bearer\s|Mozilla\//i.test(serialized)) {
        Q.fail("a security notification exposes raw source, token or user-agent data.");
      }
    }
    return { sessions, expectedWarnings };
  }

  function nextInstruction(auditCount, sessionCount, reloadAProven, blockedReplayRequired) {
    if (auditCount === 0) return "In client A choose Member and sign in as Nova Social once.";
    if (auditCount === 1 && !reloadAProven) return "Reload client A once, prove it stays usable, then run capture-reload before signing in B.";
    if (auditCount === 1) return "In client B choose Member and sign in as Nova Social once; A must receive one normalized security warning.";
    if (auditCount === 2) return "In client C choose Member and attempt Nova Social once; it must remain on Entry with the two-session warning.";
    if (auditCount === 3 && sessionCount === 2 && blockedReplayRequired) return "Reload client C onto the repaired frontend and repeat the blocked Nova Social attempt once.";
    if (auditCount === 3 && sessionCount === 2) return "Explicitly log out client A once, then run status before retrying C.";
    if (auditCount === 3 && sessionCount === 1) return "Retry Nova Social once in client C; it must now enter as the second active session.";
    if (auditCount === 4 && sessionCount === 2 && blockedReplayRequired) return "Explicitly log out client A once, then run status before retrying C.";
    if (auditCount === 4 && sessionCount === 1 && blockedReplayRequired) return "Retry Nova Social once in client C; it must now enter as the second active session.";
    if (auditCount === 4 && sessionCount === 2) return "Capture A/B/C UI evidence and record AUTH-SESSION-001 PASS/CLOSED.";
    if (auditCount === 5 && sessionCount === 2 && blockedReplayRequired) return "Capture A/B/C UI evidence and record AUTH-SESSION-001 PASS/CLOSED with the preserved blocked UI repair replay.";
    return "Stop: the persisted session boundary does not match an expected AUTH-SESSION-001 phase.";
  }

  function stage() {
    config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    const notificationRule = Q.assertRuleNotRunning(NOTIFICATION_RULE);
    const before = documents();
    if (before.state || before.audits.length || before.notifications.length || before.outbox.length) {
      Q.fail("controlled AUTH baseline is not clean; use the guarded reset path instead of deleting session evidence ad hoc.");
    }
    const stagedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline",
      stagedAtIso,
      controlledUserId: USER_ID,
      reloadAProvenAtIso: null,
      originalNotificationRule: Q.ruleConfigSnapshot(notificationRule),
      snapshots: Q.snapshotSpecs([
        { collection: "userSessionStates", selector: selectors.sessions },
        { collection: "userLoginAudits", selector: selectors.audits },
        { collection: "userNotifications", selector: selectors.notifications },
        { collection: "notificationOutbox", selector: selectors.outbox }
      ])
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline",
      stagedAtIso,
      controlledUser: Q.user(USER_ID),
      activeSessionCount: 0,
      auditCount: 0,
      securityNotificationCount: 0,
      artificialWaitSeconds: 0,
      next: "Replace the old role windows with the three managed anonymous AUTH clients A/B/C. Then sign in only client A as Nova Social."
    });
  }

  function captureReload() {
    config();
    const checkpointState = requireState();
    const values = documents();
    const checked = assertCurrentInvariants(values, checkpointState);
    if (values.audits.length !== 1 || checked.sessions.length !== 1
        || values.notifications.length !== 0 || values.outbox.length !== 0) {
      Q.fail("client A reload proof requires exactly one audit, one active session and no security warning.");
    }
    const capturedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: checkpointState._id },
      { $set: { reloadAProvenAtIso: capturedAtIso } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "client-a-reload-proven",
      capturedAtIso,
      activeSessionCount: 1,
      auditCount: 1,
      securityNotificationCount: 0,
      next: "In client B choose Member and sign in as Nova Social once."
    });
  }

  function armBlockedReplay() {
    config();
    const checkpointState = requireState();
    const values = documents();
    const checked = assertCurrentInvariants(values, checkpointState);
    if (values.audits.length !== 3 || checked.sessions.length !== 2
        || values.notifications.length !== 2 || values.outbox.length !== 2) {
      Q.fail("blocked UI replay can be armed only after the first exact BLOCKED_LIMIT boundary.");
    }
    const armedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: checkpointState._id },
      { $set: { blockedReplayRequired: true, blockedReplayArmedAtIso: armedAtIso } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "blocked-ui-replay-armed",
      armedAtIso,
      preservedAuditCount: 3,
      next: "Reload client C onto the repaired frontend and repeat the blocked Nova Social attempt once."
    });
  }

  function status() {
    config();
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      const current = documents();
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "not-staged",
        residue: {
          sessionState: Boolean(current.state),
          audits: current.audits.length,
          notifications: current.notifications.length,
          outbox: current.outbox.length
        },
        next: `Run stage auth-session ${checkpointId}.`
      });
      return;
    }
    const values = documents();
    const checked = assertCurrentInvariants(values, state);
    const terminalAuditCount = state.blockedReplayRequired ? 5 : 4;
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: values.audits.length === terminalAuditCount && checked.sessions.length === 2 ? "complete" : "active",
      stagedAtIso: state.stagedAtIso,
      reloadAProvenAtIso: state.reloadAProvenAtIso || null,
      blockedReplayRequired: Boolean(state.blockedReplayRequired),
      blockedReplayArmedAtIso: state.blockedReplayArmedAtIso || null,
      activeSessionCount: checked.sessions.length,
      activeSessions: checked.sessions.map(item => ({
        sessionId: Q.text(item.sessionId),
        clientLabel: Q.text(item.clientLabel),
        provider: Q.text(item.provider),
        createdAtIso: item.createdAtIso,
        lastSeenAtIso: item.lastSeenAtIso
      })),
      auditCount: values.audits.length,
      audits: values.audits.map(item => ({
        attemptId: Q.text(item.attemptId),
        sessionId: Q.text(item.sessionId),
        clientLabel: Q.text(item.clientLabel),
        provider: Q.text(item.provider),
        outcome: Q.text(item.outcome),
        attemptedAtIso: item.attemptedAtIso,
        sourceAddressStoredServerSide: Boolean(Q.text(item.sourceAddress)),
        userAgentHash: Q.text(item.userAgentHash)
      })),
      securityNotificationCount: values.notifications.length,
      securityNotifications: values.notifications.map(item => ({
        notificationId: Q.text(item.notificationId || item._id),
        readAtIso: item.readAtIso || null,
        titleKey: Q.text(item.payload && item.payload.notification_title_key),
        messageKey: Q.text(item.payload && item.payload.notification_message_key),
        clientLabel: Q.text(item.payload && item.payload.clientLabel),
        loginOutcome: Q.text(item.payload && item.payload.loginOutcome)
      })),
      securityOutboxCount: values.outbox.length,
      expectedWarningCount: checked.expectedWarnings,
      next: nextInstruction(
        values.audits.length,
        checked.sessions.length,
        Boolean(state.reloadAProvenAtIso),
        Boolean(state.blockedReplayRequired)
      )
    });
  }

  function reset() {
    config();
    const state = requireState();
    Q.collection("userSessionStates").deleteMany(selectors.sessions);
    Q.collection("userLoginAudits").deleteMany(selectors.audits);
    Q.collection("userNotifications").deleteMany(selectors.notifications);
    Q.collection("notificationOutbox").deleteMany(selectors.outbox);
    Q.restoreSnapshots(state.snapshots || []);
    Q.restoreRuleConfig(state.originalNotificationRule);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      resetAtIso: Q.nowIso(),
      restoredSnapshots: (state.snapshots || []).length,
      next: `Run status auth-session ${checkpointId}; expected phase is not-staged with zero residue.`
    });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stage(); break;
    case "status": status(); break;
    case "capture-reload": captureReload(); break;
    case "arm-blocked-replay": armBlockedReplay(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
