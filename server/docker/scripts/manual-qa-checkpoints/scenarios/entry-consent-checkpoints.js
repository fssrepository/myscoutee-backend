/* global ManualQa, db, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "entry-consent";
  const CHECKPOINT = "ENTRY-CONSENT-001";
  const USER_ID_PREFIX = "demo-profile-";
  const PRIVACY_SELECTOR = { documentType: "privacy", lang: "en" };
  const QA_REVISION_PREFIX = "manual-qa-entry-consent-001-";
  const APPROVED_OPTIONAL_SECTION_ID = "qa-analytics";
  const UNAPPROVED_OPTIONAL_SECTION_ID = "qa-marketing";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();

  function config() {
    if (checkpointId !== CHECKPOINT) {
      Q.fail(`entry-consent currently supports only ${CHECKPOINT}.`);
    }
  }

  function registrationUsers() {
    return Q.collection("users")
      .find({ userId: { $regex: `^${USER_ID_PREFIX}` } })
      .sort({ userId: 1 })
      .toArray();
  }

  function baselineIds(state) {
    return new Set((state.baselineUserIds || []).map(Q.text).filter(Boolean));
  }

  function newRegistrationUsers(state) {
    const baseline = baselineIds(state);
    return registrationUsers().filter(user => !baseline.has(Q.text(user.userId)));
  }

  function activeEnglishPrivacyRevisions() {
    return Q.collection("helpCenterRevisions")
      .find({ ...PRIVACY_SELECTOR, active: true })
      .sort({ version: -1, _id: 1 })
      .toArray();
  }

  function requireState() {
    const state = Q.activeState(SCENARIO, true);
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged consent checkpoint is '${Q.text(state.checkpointId)}', not '${checkpointId}'.`);
    }
    return state;
  }

  function consentSummary(consent) {
    return {
      id: Q.text(consent && consent._id),
      userId: Q.text(consent && consent.userId),
      revisionId: Q.text(consent && consent.revisionId),
      revisionVersion: Q.number(consent && consent.revisionVersion),
      approvedOptionalSectionIds: Array.isArray(consent && consent.approvedOptionalSectionIds)
        ? consent.approvedOptionalSectionIds.map(Q.text).filter(Boolean).sort()
        : [],
      acceptedAtIso: Q.text(consent && consent.acceptedAtIso),
      updatedAtIso: Q.text(consent && consent.updatedAtIso),
      source: Q.text(consent && consent.source)
    };
  }

  function stage() {
    config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);

    const originalPrivacyRevisions = Q.collection("helpCenterRevisions")
      .find(PRIVACY_SELECTOR)
      .sort({ version: 1, _id: 1 })
      .toArray();
    const originalActive = originalPrivacyRevisions.filter(revision => revision.active === true);
    if (originalPrivacyRevisions.length === 0 || originalActive.length !== 1) {
      Q.fail(`expected one active English privacy revision before stage, found ${originalActive.length}.`);
    }

    const highestVersion = originalPrivacyRevisions.reduce(
      (highest, revision) => Math.max(highest, Q.number(revision.version)),
      0
    );
    const revisionVersion = highestVersion + 1;
    const stagedAtIso = Q.nowIso();
    const revisionId = `${QA_REVISION_PREFIX}${stagedAtIso.replace(/[^0-9]/g, "")}`;
    const baselineUsers = registrationUsers();
    const baselineConsents = Q.collection("privacyConsents").find({}).toArray();
    const baselineAnonymousConsentCount = Q.collection("privacyConsents").countDocuments({
      $or: [
        { userId: { $exists: false } },
        { userId: null },
        { userId: "" }
      ]
    });

    Q.collection("helpCenterRevisions").updateMany(
      PRIVACY_SELECTOR,
      {
        $set: {
          active: false,
          updatedDate: stagedAtIso,
          updatedUser: Q.ACTOR
        }
      }
    );
    Q.collection("helpCenterRevisions").insertOne({
      _id: revisionId,
      documentType: "privacy",
      lang: "en",
      contextKey: "",
      languageLabel: "English",
      version: revisionVersion,
      active: true,
      title: "ENTRY-CONSENT-001 controlled privacy revision",
      summary: "Manual QA privacy consent",
      description: "Accept the required section and choose only Optional analytics.",
      headerColor: "amber",
      createdDate: stagedAtIso,
      createdUser: Q.ACTOR,
      updatedDate: stagedAtIso,
      updatedUser: Q.ACTOR,
      sections: [
        {
          id: "qa-required",
          icon: "policy",
          title: "Required QA privacy",
          blurb: "Required processing for this controlled registration checkpoint.",
          contentHtml: "<p>This required section identifies the active manual-QA revision.</p>",
          imageUrls: [],
          panelSpan: "span-1",
          optional: false
        },
        {
          id: APPROVED_OPTIONAL_SECTION_ID,
          icon: "analytics",
          title: "Optional analytics",
          blurb: "Select this optional section for the controlled transfer proof.",
          contentHtml: "<p>This optional choice must be the only approved optional section.</p>",
          imageUrls: [],
          panelSpan: "span-1",
          optional: true
        },
        {
          id: UNAPPROVED_OPTIONAL_SECTION_ID,
          icon: "campaign",
          title: "Optional marketing",
          blurb: "Leave this optional section unselected.",
          contentHtml: "<p>This optional choice must not appear in persisted consent.</p>",
          imageUrls: [],
          panelSpan: "span-1",
          optional: true
        }
      ]
    });

    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline",
      stagedAtIso,
      qaRevisionId: revisionId,
      qaRevisionVersion: revisionVersion,
      approvedOptionalSectionId: APPROVED_OPTIONAL_SECTION_ID,
      unapprovedOptionalSectionId: UNAPPROVED_OPTIONAL_SECTION_ID,
      originalPrivacyRevisions,
      baselineUserIds: baselineUsers.map(user => Q.text(user.userId)),
      baselineRegistrationUserCount: baselineUsers.length,
      baselineConsentIds: baselineConsents.map(consent => Q.text(consent._id)),
      baselineConsentCount: baselineConsents.length,
      baselineAnonymousConsentCount
    });

    const active = activeEnglishPrivacyRevisions();
    if (active.length !== 1 || Q.text(active[0]._id) !== revisionId) {
      Q.fail("controlled privacy revision did not become the sole active English revision.");
    }

    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline",
      stagedAtIso,
      activeRevision: {
        id: revisionId,
        version: revisionVersion,
        approvedOptionalSectionId: APPROVED_OPTIONAL_SECTION_ID,
        unapprovedOptionalSectionId: UNAPPROVED_OPTIONAL_SECTION_ID
      },
      baselineRegistrationUserCount: baselineUsers.length,
      baselineConsentCount: baselineConsents.length,
      baselineAnonymousConsentCount,
      next: "Open the managed anonymous browser without bootstrap consent; select only Optional analytics and accept. Prove browser-local evidence before registration."
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
        activeEnglishPrivacyRevisionIds: activeEnglishPrivacyRevisions().map(revision => Q.text(revision._id)),
        registrationUserCount: registrationUsers().length,
        privacyConsentCount: Q.collection("privacyConsents").countDocuments({}),
        next: `Run stage ${SCENARIO} ${checkpointId}.`
      });
      return;
    }

    const candidates = newRegistrationUsers(state);
    const candidateUserIds = candidates.map(user => Q.text(user.userId));
    const candidateConsents = candidateUserIds.length === 0
      ? []
      : Q.collection("privacyConsents").find({ userId: { $in: candidateUserIds } }).toArray();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: Q.text(state.phase) || "baseline",
      stagedAtIso: state.stagedAtIso,
      activeEnglishPrivacyRevisionIds: activeEnglishPrivacyRevisions().map(revision => Q.text(revision._id)),
      qaRevision: {
        id: Q.text(state.qaRevisionId),
        version: Q.number(state.qaRevisionVersion),
        approvedOptionalSectionId: Q.text(state.approvedOptionalSectionId),
        unapprovedOptionalSectionId: Q.text(state.unapprovedOptionalSectionId)
      },
      newRegistrationUserCount: candidates.length,
      newRegistrationUsers: candidates.map(user => ({
        userId: Q.text(user.userId),
        name: Q.text(user.name),
        profileStatus: Q.text(user.profileStatus),
        profileFormVersion: Q.number(user.profileFormVersion),
        imageCount: Array.isArray(user.images) ? user.images.length : 0
      })),
      candidateConsents: candidateConsents.map(consentSummary),
      privacyConsentCount: Q.collection("privacyConsents").countDocuments({}),
      anonymousServerConsentCount: Q.collection("privacyConsents").countDocuments({
        $or: [
          { userId: { $exists: false } },
          { userId: null },
          { userId: "" }
        ]
      }),
      next: candidates.length === 0
        ? "Prove the anonymous browser evidence, then complete exactly one new profile registration."
        : candidates.length === 1
          ? `Wait for one transferred consent, then run verify ${SCENARIO} ${checkpointId}.`
          : "Stop: more than one registration user appeared after the consent checkpoint baseline."
    });
  }

  function verify() {
    config();
    const state = requireState();
    const active = activeEnglishPrivacyRevisions();
    if (active.length !== 1 || Q.text(active[0]._id) !== Q.text(state.qaRevisionId)) {
      Q.fail("controlled privacy revision is no longer the sole active English revision.");
    }

    const candidates = newRegistrationUsers(state);
    if (candidates.length !== 1) {
      Q.fail(`expected exactly one new ${USER_ID_PREFIX} user, found ${candidates.length}.`);
    }
    const user = candidates[0];
    const userId = Q.text(user.userId);
    if (Q.text(user.profileStatus) !== "public" || Q.text(user.status).toUpperCase() !== "A") {
      Q.fail(`new registration '${userId}' did not finish active/public.`);
    }
    if (Q.number(user.profileFormVersion) !== 2 || !Array.isArray(user.images) || user.images.length < 3) {
      Q.fail(`new registration '${userId}' did not complete the required profile form and images.`);
    }

    const userConsents = Q.collection("privacyConsents").find({ userId }).toArray();
    if (userConsents.length !== 1) {
      Q.fail(`new registration '${userId}' has ${userConsents.length} privacy consents; expected exactly one.`);
    }
    const consent = userConsents[0];
    if (Q.text(consent.revisionId) !== Q.text(state.qaRevisionId)
        || Q.number(consent.revisionVersion) !== Q.number(state.qaRevisionVersion)) {
      Q.fail(`new registration '${userId}' consent does not reference the controlled active revision.`);
    }
    const approvedOptionalSectionIds = Array.isArray(consent.approvedOptionalSectionIds)
      ? consent.approvedOptionalSectionIds.map(Q.text).filter(Boolean).sort()
      : [];
    if (!Q.sameJson(approvedOptionalSectionIds, [APPROVED_OPTIONAL_SECTION_ID])) {
      Q.fail(`persisted optional approvals are ${JSON.stringify(approvedOptionalSectionIds)}; expected only '${APPROVED_OPTIONAL_SECTION_ID}'.`);
    }
    if (Q.text(consent.source) !== "entry" || !Q.text(consent.acceptedAtIso) || !Q.text(consent.updatedAtIso)) {
      Q.fail("transferred consent is missing entry source or immutable acceptance timestamps.");
    }

    const consentCount = Q.collection("privacyConsents").countDocuments({});
    if (consentCount !== Q.number(state.baselineConsentCount) + 1) {
      Q.fail(`privacy consent count is ${consentCount}; expected baseline plus exactly one.`);
    }
    const anonymousServerConsentCount = Q.collection("privacyConsents").countDocuments({
      $or: [
        { userId: { $exists: false } },
        { userId: null },
        { userId: "" }
      ]
    });
    if (anonymousServerConsentCount !== Q.number(state.baselineAnonymousConsentCount)) {
      Q.fail("anonymous browser consent was incorrectly materialized as an ownerless server record.");
    }

    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      { $set: { phase: "verified", verifiedAtIso, registeredUserId: userId, privacyConsentId: Q.text(consent._id) } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "verified",
      verifiedAtIso,
      user: {
        userId,
        name: Q.text(user.name),
        profileStatus: Q.text(user.profileStatus),
        profileFormVersion: Q.number(user.profileFormVersion),
        imageCount: user.images.length
      },
      consent: consentSummary(consent),
      cardinality: {
        newUsersSinceBaseline: candidates.length,
        userConsents: userConsents.length,
        totalConsentDelta: consentCount - Q.number(state.baselineConsentCount),
        anonymousServerConsentDelta: anonymousServerConsentCount - Q.number(state.baselineAnonymousConsentCount)
      },
      unchanged: {
        unapprovedOptionalSectionId: UNAPPROVED_OPTIONAL_SECTION_ID,
        eventFixtures: "not touched",
        paymentRuntime: "not used"
      },
      next: `Record ${checkpointId} PASS/CLOSED, then reset the checkpoint to restore the prior active privacy revision while retaining the inactive QA revision and consent evidence.`
    });
  }

  function reset() {
    config();
    const state = requireState();
    const originalPrivacyRevisions = state.originalPrivacyRevisions || [];
    const expectedIds = new Set([
      ...originalPrivacyRevisions.map(revision => Q.text(revision._id)),
      Q.text(state.qaRevisionId)
    ]);
    const currentIds = Q.collection("helpCenterRevisions")
      .find(PRIVACY_SELECTOR, { _id: 1 })
      .toArray()
      .map(revision => Q.text(revision._id));
    const unexpectedIds = currentIds.filter(id => !expectedIds.has(id));
    if (unexpectedIds.length > 0) {
      Q.fail(`refusing to reset after unexpected English privacy revisions appeared: ${unexpectedIds.join(", ")}.`);
    }

    const resetAtIso = Q.nowIso();
    Q.collection("helpCenterRevisions").updateOne(
      { _id: Q.text(state.qaRevisionId) },
      {
        $set: {
          active: false,
          updatedDate: resetAtIso,
          updatedUser: Q.ACTOR
        }
      }
    );
    for (const revision of originalPrivacyRevisions) {
      Q.collection("helpCenterRevisions").replaceOne({ _id: revision._id }, revision, { upsert: true });
    }

    const restoredActiveIds = activeEnglishPrivacyRevisions().map(revision => Q.text(revision._id));
    const expectedActiveIds = originalPrivacyRevisions
      .filter(revision => revision.active === true)
      .map(revision => Q.text(revision._id));
    if (!Q.sameJson(restoredActiveIds.sort(), expectedActiveIds.sort())) {
      Q.fail("original active English privacy revision was not restored exactly.");
    }

    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      resetAtIso,
      restoredActiveRevisionIds: restoredActiveIds,
      retainedInactiveQaRevisionId: Q.text(state.qaRevisionId),
      retainedDisposableUserId: Q.text(state.registeredUserId),
      retainedPrivacyConsentId: Q.text(state.privacyConsentId),
      domainDeletionPerformed: false,
      next: `Run status ${SCENARIO} ${checkpointId}; expected phase is not-staged.`
    });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stage(); break;
    case "status": status(); break;
    case "verify": verify(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
