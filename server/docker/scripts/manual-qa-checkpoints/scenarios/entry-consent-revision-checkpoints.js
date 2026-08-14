/* global ManualQa, db, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "entry-consent";
  const CHECKPOINT = "ENTRY-CONSENT-002";
  const TARGET_USER_ID = "650000000000000000000062";
  const TARGET_USER_NAME = "Nova Social";
  const PRIVACY_SELECTOR = { documentType: "privacy", lang: "en" };
  const QA_REVISION_PREFIX = "manual-qa-entry-consent-002-";
  const OLD_OPTIONAL_SECTION_ID = "qa-previous-analytics";
  const NEW_OPTIONAL_SECTION_ID = "qa-current-analytics";
  const NEW_UNAPPROVED_SECTION_ID = "qa-current-marketing";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();

  function config() {
    if (checkpointId !== CHECKPOINT) {
      Q.fail(`entry-consent revision harness supports only ${CHECKPOINT}.`);
    }
  }

  function requireState() {
    const state = Q.activeState(SCENARIO, true);
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged consent checkpoint is '${Q.text(state.checkpointId)}', not '${checkpointId}'.`);
    }
    return state;
  }

  function activeEnglishPrivacyRevisions() {
    return Q.collection("helpCenterRevisions")
      .find({ ...PRIVACY_SELECTOR, active: true })
      .sort({ version: -1, _id: 1 })
      .toArray();
  }

  function targetConsents() {
    return Q.collection("privacyConsents")
      .find({ userId: TARGET_USER_ID })
      .sort({ acceptedAtIso: 1, _id: 1 })
      .toArray();
  }

  function baselineConsentIds(state) {
    return new Set((state.baselineConsentIds || []).map(Q.text).filter(Boolean));
  }

  function addedConsents(state) {
    const baseline = baselineConsentIds(state);
    return targetConsents().filter(consent => !baseline.has(Q.text(consent._id)));
  }

  function consentForRevision(revisionId) {
    return Q.collection("privacyConsents").findOne({
      userId: TARGET_USER_ID,
      revisionId: Q.text(revisionId)
    });
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

  function anonymousConsentCount() {
    return Q.collection("privacyConsents").countDocuments({
      $or: [
        { userId: { $exists: false } },
        { userId: null },
        { userId: "" }
      ]
    });
  }

  function revisionDocument(id, version, active, title, optionalSections, nowIso) {
    return {
      _id: id,
      documentType: "privacy",
      lang: "en",
      contextKey: "",
      languageLabel: "English",
      version,
      active,
      title,
      summary: "Manual QA privacy revision transition",
      description: active
        ? "Reject this revision first. On the second opening, approve only Previous analytics."
        : "Approve only Current analytics; the earlier consent and audit must remain unchanged.",
      headerColor: "amber",
      createdDate: nowIso,
      createdUser: Q.ACTOR,
      updatedDate: nowIso,
      updatedUser: Q.ACTOR,
      sections: [
        {
          id: `qa-required-v${version}`,
          icon: "policy",
          title: `Required privacy v${version}`,
          blurb: "Required processing for the controlled revision checkpoint.",
          contentHtml: `<p>This required section identifies controlled privacy revision v${version}.</p>`,
          imageUrls: [],
          panelSpan: "span-1",
          optional: false
        },
        ...optionalSections.map(section => ({
          id: section.id,
          icon: section.icon,
          title: section.title,
          blurb: section.blurb,
          contentHtml: `<p>${section.content}</p>`,
          imageUrls: [],
          panelSpan: "span-1",
          optional: true
        }))
      ]
    };
  }

  function assertSoleActive(revisionId) {
    const active = activeEnglishPrivacyRevisions();
    if (active.length !== 1 || Q.text(active[0]._id) !== Q.text(revisionId)) {
      Q.fail(`expected '${Q.text(revisionId)}' as the sole active English privacy revision.`);
    }
  }

  function assertConsentShape(consent, revisionId, revisionVersion, optionalSectionId, source) {
    if (!consent) {
      Q.fail(`privacy consent for revision '${revisionId}' was not found.`);
    }
    const summary = consentSummary(consent);
    if (summary.userId !== TARGET_USER_ID
        || summary.revisionId !== revisionId
        || summary.revisionVersion !== Q.number(revisionVersion)) {
      Q.fail(`privacy consent '${summary.id}' does not match the controlled user/revision/version.`);
    }
    if (!Q.sameJson(summary.approvedOptionalSectionIds, [optionalSectionId])) {
      Q.fail(`privacy consent '${summary.id}' optional IDs are ${JSON.stringify(summary.approvedOptionalSectionIds)}; expected only '${optionalSectionId}'.`);
    }
    if (summary.source !== source || !summary.acceptedAtIso || !summary.updatedAtIso) {
      Q.fail(`privacy consent '${summary.id}' is missing expected source or acceptance timestamps.`);
    }
    return summary;
  }

  function stage() {
    config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);

    const target = Q.ensureUser(TARGET_USER_ID, "controlled consent member");
    if (Q.text(target.name) !== TARGET_USER_NAME
        || Q.text(target.profileStatus) !== "public"
        || target.admin === true
        || target.operator === true
        || Q.text(target.hostTier).toLowerCase() === "admin") {
      Q.fail(`controlled consent member '${TARGET_USER_ID}' is not a selectable public ${TARGET_USER_NAME} member.`);
    }

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
    const previousVersion = highestVersion + 1;
    const currentVersion = highestVersion + 2;
    const stagedAtIso = Q.nowIso();
    const suffix = stagedAtIso.replace(/[^0-9]/g, "");
    const previousRevisionId = `${QA_REVISION_PREFIX}${suffix}-previous`;
    const currentRevisionId = `${QA_REVISION_PREFIX}${suffix}-current`;
    const baselineConsents = targetConsents();

    Q.collection("helpCenterRevisions").updateMany(
      PRIVACY_SELECTOR,
      { $set: { active: false, updatedDate: stagedAtIso, updatedUser: Q.ACTOR } }
    );
    Q.collection("helpCenterRevisions").insertMany([
      revisionDocument(
        previousRevisionId,
        previousVersion,
        true,
        "ENTRY-CONSENT-002 previous privacy revision",
        [
          {
            id: OLD_OPTIONAL_SECTION_ID,
            icon: "analytics",
            title: "Previous analytics",
            blurb: "Select this only after the controlled rejection.",
            content: "This choice belongs only to the previous revision."
          }
        ],
        stagedAtIso
      ),
      revisionDocument(
        currentRevisionId,
        currentVersion,
        false,
        "ENTRY-CONSENT-002 newer privacy revision",
        [
          {
            id: NEW_OPTIONAL_SECTION_ID,
            icon: "analytics",
            title: "Current analytics",
            blurb: "Select this option for the newer revision.",
            content: "This is the only optional choice expected on the newer consent."
          },
          {
            id: NEW_UNAPPROVED_SECTION_ID,
            icon: "campaign",
            title: "Current marketing",
            blurb: "Leave this option unselected.",
            content: "This choice must remain absent from the newer consent."
          }
        ],
        stagedAtIso
      )
    ]);

    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId,
      phase: "previous-active",
      stagedAtIso,
      targetUserId: TARGET_USER_ID,
      targetUserName: TARGET_USER_NAME,
      previousRevisionId,
      previousRevisionVersion: previousVersion,
      currentRevisionId,
      currentRevisionVersion: currentVersion,
      previousOptionalSectionId: OLD_OPTIONAL_SECTION_ID,
      currentOptionalSectionId: NEW_OPTIONAL_SECTION_ID,
      currentUnapprovedSectionId: NEW_UNAPPROVED_SECTION_ID,
      originalPrivacyRevisions,
      baselineConsentIds: baselineConsents.map(consent => Q.text(consent._id)),
      baselineTargetConsents: baselineConsents,
      baselineTargetConsentCount: baselineConsents.length,
      baselineTotalConsentCount: Q.collection("privacyConsents").countDocuments({}),
      baselineAnonymousConsentCount: anonymousConsentCount()
    });

    assertSoleActive(previousRevisionId);
    if (consentForRevision(previousRevisionId) || consentForRevision(currentRevisionId)) {
      Q.fail("controlled consent revisions already have a target-user consent after stage.");
    }

    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "previous-active",
      stagedAtIso,
      actor: { userId: TARGET_USER_ID, name: TARGET_USER_NAME },
      previousRevision: {
        id: previousRevisionId,
        version: previousVersion,
        selectAfterRejection: OLD_OPTIONAL_SECTION_ID
      },
      currentRevision: {
        id: currentRevisionId,
        version: currentVersion,
        active: false,
        selectLater: NEW_OPTIONAL_SECTION_ID,
        leaveUnselected: NEW_UNAPPROVED_SECTION_ID
      },
      baselineTargetConsentCount: baselineConsents.length,
      baselineTotalConsentCount: Q.collection("privacyConsents").countDocuments({}),
      baselineAnonymousConsentCount: anonymousConsentCount(),
      next: "Open the anonymous managed browser. Reject the previous revision once; prove no session/consent. Then accept only Previous analytics, sign in as Nova Social, and wait for the previous-revision server consent before activate-newer."
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
        targetUser: Q.user(TARGET_USER_ID),
        targetConsentCount: targetConsents().length,
        privacyConsentCount: Q.collection("privacyConsents").countDocuments({}),
        next: `Run stage ${SCENARIO} ${checkpointId}.`
      });
      return;
    }

    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: Q.text(state.phase),
      stagedAtIso: state.stagedAtIso,
      newerActivatedAtIso: state.newerActivatedAtIso || null,
      activeEnglishPrivacyRevisionIds: activeEnglishPrivacyRevisions().map(revision => Q.text(revision._id)),
      actor: { userId: TARGET_USER_ID, name: TARGET_USER_NAME },
      previousRevision: {
        id: Q.text(state.previousRevisionId),
        version: Q.number(state.previousRevisionVersion),
        consent: consentSummary(consentForRevision(state.previousRevisionId))
      },
      currentRevision: {
        id: Q.text(state.currentRevisionId),
        version: Q.number(state.currentRevisionVersion),
        consent: consentSummary(consentForRevision(state.currentRevisionId))
      },
      addedTargetConsents: addedConsents(state).map(consentSummary),
      targetConsentDelta: targetConsents().length - Q.number(state.baselineTargetConsentCount),
      totalConsentDelta: Q.collection("privacyConsents").countDocuments({}) - Q.number(state.baselineTotalConsentCount),
      anonymousServerConsentDelta: anonymousConsentCount() - Q.number(state.baselineAnonymousConsentCount),
      next: Q.text(state.phase) === "previous-active"
        ? `After browser rejection/no-session proof and the Nova previous-revision consent, run activate-newer ${SCENARIO} ${checkpointId}.`
        : `Reload the same authenticated browser; the newer revision must force the privacy popup. Approve only ${NEW_OPTIONAL_SECTION_ID}, then run verify.`
    });
  }

  function activateNewer() {
    config();
    const state = requireState();
    if (Q.text(state.phase) !== "previous-active") {
      Q.fail(`activate-newer requires phase previous-active, found '${Q.text(state.phase)}'.`);
    }
    assertSoleActive(state.previousRevisionId);

    const previousConsent = consentForRevision(state.previousRevisionId);
    const previousSummary = assertConsentShape(
      previousConsent,
      Q.text(state.previousRevisionId),
      Q.number(state.previousRevisionVersion),
      OLD_OPTIONAL_SECTION_ID,
      "entry"
    );
    if (consentForRevision(state.currentRevisionId)) {
      Q.fail("newer revision already has a consent before activation.");
    }
    if (addedConsents(state).length !== 1
        || Q.collection("privacyConsents").countDocuments({}) !== Q.number(state.baselineTotalConsentCount) + 1
        || anonymousConsentCount() !== Q.number(state.baselineAnonymousConsentCount)) {
      Q.fail("previous-revision consent cardinality is not the exact baseline plus one owned consent.");
    }

    const newerActivatedAtIso = Q.nowIso();
    Q.collection("helpCenterRevisions").updateMany(
      PRIVACY_SELECTOR,
      { $set: { active: false, updatedDate: newerActivatedAtIso, updatedUser: Q.ACTOR } }
    );
    Q.collection("helpCenterRevisions").updateOne(
      { _id: Q.text(state.currentRevisionId) },
      { $set: { active: true, updatedDate: newerActivatedAtIso, updatedUser: Q.ACTOR } }
    );
    assertSoleActive(state.currentRevisionId);

    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      {
        $set: {
          phase: "current-active",
          newerActivatedAtIso,
          previousConsentSnapshot: previousConsent,
          previousConsentSummary: previousSummary
        }
      }
    );

    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "current-active",
      newerActivatedAtIso,
      previousConsent: previousSummary,
      currentRevision: {
        id: Q.text(state.currentRevisionId),
        version: Q.number(state.currentRevisionVersion),
        selectOnly: NEW_OPTIONAL_SECTION_ID,
        leaveUnselected: NEW_UNAPPROVED_SECTION_ID
      },
      cardinality: {
        targetConsentDelta: 1,
        totalConsentDelta: 1,
        anonymousServerConsentDelta: 0
      },
      next: "Reload the same authenticated Nova browser. The newer revision must force a non-dismissible privacy popup even though the previous revision was accepted. Select only Current analytics and approve it."
    });
  }

  function verify() {
    config();
    const state = requireState();
    if (Q.text(state.phase) !== "current-active") {
      Q.fail(`verify requires phase current-active, found '${Q.text(state.phase)}'.`);
    }
    assertSoleActive(state.currentRevisionId);

    const previousConsent = consentForRevision(state.previousRevisionId);
    if (!previousConsent || !Q.sameJson(previousConsent, state.previousConsentSnapshot)) {
      Q.fail("previous-revision consent changed after newer-revision acceptance.");
    }
    const previousSummary = assertConsentShape(
      previousConsent,
      Q.text(state.previousRevisionId),
      Q.number(state.previousRevisionVersion),
      OLD_OPTIONAL_SECTION_ID,
      "entry"
    );
    const currentConsent = consentForRevision(state.currentRevisionId);
    const currentSummary = assertConsentShape(
      currentConsent,
      Q.text(state.currentRevisionId),
      Q.number(state.currentRevisionVersion),
      NEW_OPTIONAL_SECTION_ID,
      "settings"
    );

    const added = addedConsents(state);
    const targetDelta = targetConsents().length - Q.number(state.baselineTargetConsentCount);
    const totalDelta = Q.collection("privacyConsents").countDocuments({}) - Q.number(state.baselineTotalConsentCount);
    const anonymousDelta = anonymousConsentCount() - Q.number(state.baselineAnonymousConsentCount);
    if (added.length !== 2 || targetDelta !== 2 || totalDelta !== 2 || anonymousDelta !== 0) {
      Q.fail(`consent cardinality mismatch: added=${added.length}, targetDelta=${targetDelta}, totalDelta=${totalDelta}, anonymousDelta=${anonymousDelta}.`);
    }

    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      {
        $set: {
          phase: "verified",
          verifiedAtIso,
          previousConsentId: previousSummary.id,
          currentConsentId: currentSummary.id
        }
      }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "verified",
      verifiedAtIso,
      actor: { userId: TARGET_USER_ID, name: TARGET_USER_NAME },
      previousConsent: previousSummary,
      currentConsent: currentSummary,
      cardinality: {
        newTargetConsents: added.length,
        targetConsentDelta: targetDelta,
        totalConsentDelta: totalDelta,
        anonymousServerConsentDelta: anonymousDelta
      },
      unchanged: {
        previousConsent: true,
        unapprovedCurrentOptionalSectionId: NEW_UNAPPROVED_SECTION_ID,
        eventFixtures: "not touched",
        paymentRuntime: "not used"
      },
      next: `Record ${checkpointId} PASS/CLOSED, then reset to restore the original active privacy revision while retaining both inactive QA revisions and both consent records.`
    });
  }

  function previewV5() {
    config();
    const state = requireState();
    if (Q.text(state.phase) !== "verified") {
      Q.fail(`preview-v5 requires phase verified, found '${Q.text(state.phase)}'.`);
    }
    assertSoleActive(state.currentRevisionId);
    const revision = Q.collection("helpCenterRevisions").findOne({
      _id: Q.text(state.currentRevisionId)
    });
    if (!revision || Q.number(revision.version) !== Q.number(state.currentRevisionVersion)) {
      Q.fail("current controlled revision no longer matches the verified v4 snapshot.");
    }
    if (!consentForRevision(state.currentRevisionId)
        || !Q.sameJson(consentForRevision(state.previousRevisionId), state.previousConsentSnapshot)) {
      Q.fail("verified v3/v4 consent evidence changed before the visual version preview.");
    }

    const previewVersion = Q.number(state.currentRevisionVersion) + 1;
    if (previewVersion !== 5) {
      Q.fail(`preview-v5 expected the next controlled version to be 5, found ${previewVersion}.`);
    }
    const previewAtIso = Q.nowIso();
    const previewRevision = { ...revision };
    previewRevision.version = previewVersion;
    previewRevision.updatedDate = previewAtIso;
    previewRevision.updatedUser = Q.ACTOR;
    previewRevision.sections = (revision.sections || []).map(section => {
      if (Q.text(section.id) !== `qa-required-v${Q.number(state.currentRevisionVersion)}`) {
        return section;
      }
      return {
        ...section,
        id: `qa-required-v${previewVersion}`,
        title: `Required privacy v${previewVersion}`,
        contentHtml: `<p>This required section is the visual header preview for privacy revision v${previewVersion}.</p>`
      };
    });
    Q.collection("helpCenterRevisions").replaceOne(
      { _id: revision._id },
      previewRevision
    );
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      {
        $set: {
          phase: "verified-preview-v5",
          previewAtIso,
          previewVersion,
          currentRevisionBeforePreview: revision
        }
      }
    );

    const active = activeEnglishPrivacyRevisions();
    if (active.length !== 1
        || Q.text(active[0]._id) !== Q.text(state.currentRevisionId)
        || Q.number(active[0].version) !== previewVersion) {
      Q.fail("visual v5 preview did not become the sole active English privacy revision.");
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "verified-preview-v5",
      previewAtIso,
      previewRevision: {
        id: Q.text(state.currentRevisionId),
        version: previewVersion,
        active: true
      },
      retainedVerifiedConsents: {
        previousConsentId: Q.text(state.previousConsentId),
        currentConsentId: Q.text(state.currentConsentId)
      },
      next: "Reload the same Nova browser only to view the v5 header badge. Do not approve the preview; reset will restore the retained QA revision to verified v4 before deactivating it."
    });
  }

  function reset() {
    config();
    const state = requireState();
    const originalPrivacyRevisions = state.originalPrivacyRevisions || [];
    const expectedIds = new Set([
      ...originalPrivacyRevisions.map(revision => Q.text(revision._id)),
      Q.text(state.previousRevisionId),
      Q.text(state.currentRevisionId)
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
    if (state.currentRevisionBeforePreview) {
      Q.collection("helpCenterRevisions").replaceOne(
        { _id: Q.text(state.currentRevisionId) },
        state.currentRevisionBeforePreview,
        { upsert: true }
      );
    }
    Q.collection("helpCenterRevisions").updateMany(
      { _id: { $in: [Q.text(state.previousRevisionId), Q.text(state.currentRevisionId)] } },
      { $set: { active: false, updatedDate: resetAtIso, updatedUser: Q.ACTOR } }
    );
    for (const revision of originalPrivacyRevisions) {
      Q.collection("helpCenterRevisions").replaceOne({ _id: revision._id }, revision, { upsert: true });
    }

    const restoredActiveIds = activeEnglishPrivacyRevisions().map(revision => Q.text(revision._id)).sort();
    const expectedActiveIds = originalPrivacyRevisions
      .filter(revision => revision.active === true)
      .map(revision => Q.text(revision._id))
      .sort();
    if (!Q.sameJson(restoredActiveIds, expectedActiveIds)) {
      Q.fail("original active English privacy revision was not restored exactly.");
    }

    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      resetAtIso,
      restoredActiveRevisionIds: restoredActiveIds,
      retainedInactiveQaRevisionIds: [Q.text(state.previousRevisionId), Q.text(state.currentRevisionId)],
      retainedConsentIds: [Q.text(state.previousConsentId), Q.text(state.currentConsentId)].filter(Boolean),
      targetUser: { userId: TARGET_USER_ID, name: TARGET_USER_NAME },
      domainDeletionPerformed: false,
      next: `Run status ${SCENARIO} ${checkpointId}; expected phase is not-staged.`
    });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stage(); break;
    case "status": status(); break;
    case "activate-newer": activateNewer(); break;
    case "verify": verify(); break;
    case "preview-v5": previewV5(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
