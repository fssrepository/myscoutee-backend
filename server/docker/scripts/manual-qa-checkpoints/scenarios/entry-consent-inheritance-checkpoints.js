/* global ManualQa, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "entry-consent";
  const CHECKPOINT = "ENTRY-CONSENT-003";
  const TARGET_USER_ID = "650000000000000000000062";
  const TARGET_USER_NAME = "Nova Social";
  const PRIVACY_LANG = Q.text(process.env.MANUAL_QA_PRIVACY_LANG) || "en";
  const PRIVACY_SELECTOR = { documentType: "privacy", lang: PRIVACY_LANG };
  const SOURCE_REVISION_PREFIX = "manual-qa-entry-consent-002-";
  const SOURCE_EXISTING_SECTION_ID = "qa-current-analytics";
  const SOURCE_UNSELECTED_SECTION_ID = "qa-current-marketing";
  const ADDED_SECTION_ID = "qa-product-research";
  const QA_REVISION_PREFIX = "manual-qa-entry-consent-003-";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();

  function config() {
    if (!["en", "hu"].includes(PRIVACY_LANG)) Q.fail("MANUAL_QA_PRIVACY_LANG must be en or hu.");
    if (checkpointId !== CHECKPOINT) {
      Q.fail(`entry-consent inheritance harness supports only ${CHECKPOINT}.`);
    }
  }

  function requireState() {
    const state = Q.activeState(SCENARIO, true);
    if ((state.privacyLang || "en") !== PRIVACY_LANG) Q.fail("Use the staged MANUAL_QA_PRIVACY_LANG for this checkpoint.");
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

  function sourceCandidates() {
    const revisionIds = new Set(Q.collection("helpCenterRevisions").find(PRIVACY_SELECTOR).toArray().map(revision => Q.text(revision._id)));
    const candidates = targetConsents().filter(consent => {
      const summary = consentSummary(consent);
      return summary.revisionId.startsWith(SOURCE_REVISION_PREFIX)
        && summary.revisionId.endsWith("-current")
        && revisionIds.has(summary.revisionId)
        && summary.source === "settings"
        && Q.sameJson(summary.approvedOptionalSectionIds, [SOURCE_EXISTING_SECTION_ID]);
    });
    const latestVersion = Math.max(0, ...candidates.map(consent => Q.number(consent.revisionVersion)));
    return candidates.filter(consent => Q.number(consent.revisionVersion) === latestVersion);
  }

  function assertSoleActive(revisionId) {
    const active = activeEnglishPrivacyRevisions();
    if (active.length !== 1 || Q.text(active[0]._id) !== Q.text(revisionId)) {
      Q.fail(`expected '${Q.text(revisionId)}' as the sole active selected-language privacy revision.`);
    }
  }

  function assertSourceRevision(revision, consent) {
    if (!revision || Q.number(revision.version) !== Q.number(consent.revisionVersion) || revision.active === true) {
      Q.fail("retained source revision is missing, active or has an unexpected version.");
    }
    const sectionIds = (revision.sections || []).map(section => Q.text(section.id));
    if (!sectionIds.includes(SOURCE_EXISTING_SECTION_ID)
        || !sectionIds.includes(SOURCE_UNSELECTED_SECTION_ID)) {
      Q.fail("retained source revision does not contain the stable optional section IDs required by this checkpoint.");
    }
    const summary = consentSummary(consent);
    if (summary.revisionId !== Q.text(revision._id)
        || !Q.sameJson(summary.approvedOptionalSectionIds, [SOURCE_EXISTING_SECTION_ID])) {
      Q.fail("retained source consent does not match the exact inherited-choice baseline.");
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

    const candidates = sourceCandidates();
    if (candidates.length !== 1) {
      Q.fail(`expected exactly one retained source consent, found ${candidates.length}.`);
    }
    const sourceConsent = candidates[0];
    const sourceRevision = Q.collection("helpCenterRevisions").findOne({
      _id: Q.text(sourceConsent.revisionId),
      ...PRIVACY_SELECTOR
    });
    const sourceConsentSummary = assertSourceRevision(sourceRevision, sourceConsent);

    const originalPrivacyRevisions = Q.collection("helpCenterRevisions")
      .find(PRIVACY_SELECTOR)
      .sort({ version: 1, _id: 1 })
      .toArray();
    const originalActive = originalPrivacyRevisions.filter(revision => revision.active === true);
    if (originalPrivacyRevisions.length === 0 || originalActive.length !== 1) {
      Q.fail(`expected one active selected-language privacy revision before stage, found ${originalActive.length}.`);
    }
    const highestVersion = originalPrivacyRevisions.reduce(
      (highest, revision) => Math.max(highest, Q.number(revision.version)),
      0
    );
    const revisionVersion = highestVersion + 1;
    if (highestVersion !== sourceConsentSummary.revisionVersion) {
      Q.fail("The inherited-choice source must be the latest selected-language revision; complete ENTRY-CONSENT-002 first.");
    }

    const stagedAtIso = Q.nowIso();
    const revisionId = `${QA_REVISION_PREFIX}${stagedAtIso.replace(/[^0-9]/g, "")}`;
    const baselineTargetConsents = targetConsents();
    const baselineTotalConsentCount = Q.collection("privacyConsents").countDocuments({});
    const baselineAnonymousConsentCount = anonymousConsentCount();

    Q.collection("helpCenterRevisions").updateMany(
      { ...PRIVACY_SELECTOR, active: true },
      { $set: { active: false, updatedDate: stagedAtIso, updatedUser: Q.ACTOR } }
    );
    Q.collection("helpCenterRevisions").insertOne({
      _id: revisionId,
      documentType: "privacy",
      lang: PRIVACY_LANG,
      contextKey: "",
      languageLabel: PRIVACY_LANG === "hu" ? "Hungarian" : "English",
      version: revisionVersion,
      active: true,
      title: "ENTRY-CONSENT-003 inherited privacy choices",
      summary: "Manual QA privacy choice inheritance",
      description: "The source analytics choice must remain selected; the new Product research choice starts unselected.",
      headerColor: "amber",
      createdDate: stagedAtIso,
      createdUser: Q.ACTOR,
      updatedDate: stagedAtIso,
      updatedUser: Q.ACTOR,
      sections: [
        {
          id: `qa-required-v${revisionVersion}`,
          icon: "policy",
          title: `Required privacy v${revisionVersion}`,
          blurb: "Required processing for the controlled inherited-choice checkpoint.",
          contentHtml: "<p>This is a new immutable revision record derived from the retained source contract.</p>",
          imageUrls: [],
          panelSpan: "span-1",
          optional: false
        },
        {
          id: SOURCE_EXISTING_SECTION_ID,
          icon: "analytics",
          title: "Current analytics",
          blurb: "This stable existing choice must be preselected from the latest consent.",
          contentHtml: "<p>The existing optional choice keeps its stable section identity across revisions.</p>",
          imageUrls: [],
          panelSpan: "span-1",
          optional: true
        },
        {
          id: SOURCE_UNSELECTED_SECTION_ID,
          icon: "campaign",
          title: "Current marketing",
          blurb: "This previously unselected stable choice must remain unselected.",
          contentHtml: "<p>A prior opt-out must not be broadened during revision migration.</p>",
          imageUrls: [],
          panelSpan: "span-1",
          optional: true
        },
        {
          id: ADDED_SECTION_ID,
          icon: "science",
          title: "Product research",
          blurb: "This rubric is new in this revision and must start unselected.",
          contentHtml: "<p>A newly introduced optional purpose always requires an explicit opt-in.</p>",
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
      targetUserId: TARGET_USER_ID,
      privacyLang: PRIVACY_LANG,
      targetUserName: TARGET_USER_NAME,
      sourceRevisionId: Q.text(sourceRevision._id),
      sourceRevisionVersion: Q.number(sourceRevision.version),
      sourceRevisionSnapshot: sourceRevision,
      sourceConsentId: Q.text(sourceConsent._id),
      sourceConsentSnapshot: sourceConsent,
      inheritedSectionId: SOURCE_EXISTING_SECTION_ID,
      priorUnselectedSectionId: SOURCE_UNSELECTED_SECTION_ID,
      addedSectionId: ADDED_SECTION_ID,
      qaRevisionId: revisionId,
      qaRevisionVersion: revisionVersion,
      originalPrivacyRevisions,
      baselineTargetConsentIds: baselineTargetConsents.map(consent => Q.text(consent._id)),
      baselineTargetConsentCount: baselineTargetConsents.length,
      baselineTotalConsentCount,
      baselineAnonymousConsentCount
    });

    assertSoleActive(revisionId);
    if (Q.collection("privacyConsents").findOne({ userId: TARGET_USER_ID, revisionId })) {
      Q.fail("new inherited revision already has a Nova consent after stage.");
    }

    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline",
      stagedAtIso,
      actor: { userId: TARGET_USER_ID, name: TARGET_USER_NAME },
      sourceV4: {
        revisionId: Q.text(sourceRevision._id),
        consent: sourceConsentSummary
      },
      activeV5: {
        revisionId,
        version: revisionVersion,
        inheritedSelectedSectionId: SOURCE_EXISTING_SECTION_ID,
        priorUnselectedSectionId: SOURCE_UNSELECTED_SECTION_ID,
        newUnselectedSectionId: ADDED_SECTION_ID
      },
      baselineTargetConsentCount: baselineTargetConsents.length,
      baselineTotalConsentCount,
      baselineAnonymousConsentCount,
      next: "Open one fresh Nova managed browser. The mandatory new popup must preload only Current analytics from the source revision; Current marketing and new Product research must both be unselected."
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
        retainedV4SourceCandidates: sourceCandidates().map(consentSummary),
        targetConsentCount: targetConsents().length,
        privacyConsentCount: Q.collection("privacyConsents").countDocuments({}),
        next: `Run stage ${SCENARIO} ${checkpointId}.`
      });
      return;
    }

    const v5Consent = Q.collection("privacyConsents").findOne({
      userId: TARGET_USER_ID,
      revisionId: Q.text(state.qaRevisionId)
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: Q.text(state.phase),
      stagedAtIso: state.stagedAtIso,
      activeEnglishPrivacyRevisionIds: activeEnglishPrivacyRevisions().map(revision => Q.text(revision._id)),
      actor: { userId: TARGET_USER_ID, name: TARGET_USER_NAME },
      sourceV4Consent: consentSummary(Q.collection("privacyConsents").findOne({
        _id: state.sourceConsentSnapshot._id
      })),
      activeV5: {
        revisionId: Q.text(state.qaRevisionId),
        version: Q.number(state.qaRevisionVersion),
        inheritedSectionId: Q.text(state.inheritedSectionId),
        priorUnselectedSectionId: Q.text(state.priorUnselectedSectionId),
        addedSectionId: Q.text(state.addedSectionId),
        consent: consentSummary(v5Consent)
      },
      targetConsentDelta: targetConsents().length - Q.number(state.baselineTargetConsentCount),
      totalConsentDelta: Q.collection("privacyConsents").countDocuments({}) - Q.number(state.baselineTotalConsentCount),
      anonymousServerConsentDelta: anonymousConsentCount() - Q.number(state.baselineAnonymousConsentCount),
      next: v5Consent
        ? `Run verify ${SCENARIO} ${checkpointId}.`
        : "Prove the new popup inherited only Current analytics. Then select Product research as well, leave Current marketing unselected and approve."
    });
  }

  function verify() {
    config();
    const state = requireState();
    assertSoleActive(state.qaRevisionId);

    const currentSourceRevision = Q.collection("helpCenterRevisions").findOne({
      _id: state.sourceRevisionSnapshot._id
    });
    const currentSourceConsent = Q.collection("privacyConsents").findOne({
      _id: state.sourceConsentSnapshot._id
    });
    if (!Q.sameJson(currentSourceRevision, state.sourceRevisionSnapshot)) {
      Q.fail("retained source revision changed during inherited consent.");
    }
    if (!Q.sameJson(currentSourceConsent, state.sourceConsentSnapshot)) {
      Q.fail("retained source consent changed during inherited consent.");
    }

    const v5Consents = Q.collection("privacyConsents").find({
      userId: TARGET_USER_ID,
      revisionId: Q.text(state.qaRevisionId)
    }).toArray();
    if (v5Consents.length !== 1) {
      Q.fail(`expected exactly one inherited consent, found ${v5Consents.length}.`);
    }
    const v5Summary = consentSummary(v5Consents[0]);
    if (v5Summary.revisionVersion !== Q.number(state.qaRevisionVersion)
        || v5Summary.source !== "settings"
        || !v5Summary.acceptedAtIso
        || !v5Summary.updatedAtIso) {
      Q.fail("inherited consent has the wrong revision, source or timestamps.");
    }
    const expectedApprovals = [SOURCE_EXISTING_SECTION_ID, ADDED_SECTION_ID].sort();
    if (!Q.sameJson(v5Summary.approvedOptionalSectionIds, expectedApprovals)) {
      Q.fail(`inherited optional approvals are ${JSON.stringify(v5Summary.approvedOptionalSectionIds)}; expected ${JSON.stringify(expectedApprovals)}.`);
    }

    const targetDelta = targetConsents().length - Q.number(state.baselineTargetConsentCount);
    const totalDelta = Q.collection("privacyConsents").countDocuments({}) - Q.number(state.baselineTotalConsentCount);
    const anonymousDelta = anonymousConsentCount() - Q.number(state.baselineAnonymousConsentCount);
    if (targetDelta !== 1 || totalDelta !== 1 || anonymousDelta !== 0) {
      Q.fail(`consent cardinality mismatch: targetDelta=${targetDelta}, totalDelta=${totalDelta}, anonymousDelta=${anonymousDelta}.`);
    }

    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      { $set: { phase: "verified", verifiedAtIso, v5ConsentId: v5Summary.id } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "verified",
      verifiedAtIso,
      actor: { userId: TARGET_USER_ID, name: TARGET_USER_NAME },
      immutableV4: consentSummary(currentSourceConsent),
      v5Consent: v5Summary,
      cardinality: {
        targetConsentDelta: targetDelta,
        totalConsentDelta: totalDelta,
        anonymousServerConsentDelta: anonymousDelta
      },
      unchanged: {
        priorUnselectedSectionId: SOURCE_UNSELECTED_SECTION_ID,
        v4RevisionAndConsent: true,
        eventFixtures: "not touched",
        paymentRuntime: "not used"
      },
      next: `Record ${checkpointId} PASS/CLOSED, then reset to restore the original active privacy revision while retaining the inactive inherited revision and consent evidence.`
    });
  }

  function repairStage() {
    config();
    const state = requireState();
    assertSoleActive(state.qaRevisionId);

    const originalInactiveRevisions = (state.originalPrivacyRevisions || [])
      .filter(revision => revision.active !== true);
    for (const revision of originalInactiveRevisions) {
      Q.collection("helpCenterRevisions").replaceOne(
        { _id: revision._id },
        revision,
        { upsert: true }
      );
    }

    const repairedSourceRevision = Q.collection("helpCenterRevisions").findOne({
      _id: state.sourceRevisionSnapshot._id
    });
    if (!Q.sameJson(repairedSourceRevision, state.sourceRevisionSnapshot)) {
      Q.fail("retained source revision could not be restored from the stage baseline.");
    }
    assertSoleActive(state.qaRevisionId);

    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: Q.text(state.phase),
      repairedInactiveRevisionCount: originalInactiveRevisions.length,
      immutableV4RevisionId: Q.text(state.sourceRevisionId),
      activeV5RevisionId: Q.text(state.qaRevisionId),
      consentRecordsChanged: false,
      next: `Run verify ${SCENARIO} ${checkpointId}.`
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
      Q.fail(`refusing to reset after unexpected selected-language privacy revisions appeared: ${unexpectedIds.join(", ")}.`);
    }

    const resetAtIso = Q.nowIso();
    Q.collection("helpCenterRevisions").updateOne(
      { _id: Q.text(state.qaRevisionId) },
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
      Q.fail("original active selected-language privacy revision was not restored exactly.");
    }

    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      resetAtIso,
      restoredActiveRevisionIds: restoredActiveIds,
      retainedInactiveV5RevisionId: Q.text(state.qaRevisionId),
      retainedV5ConsentId: Q.text(state.v5ConsentId),
      retainedImmutableV4ConsentId: Q.text(state.sourceConsentId),
      domainDeletionPerformed: false,
      next: `Run status ${SCENARIO} ${checkpointId}; expected phase is not-staged.`
    });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stage(); break;
    case "status": status(); break;
    case "verify": verify(); break;
    case "repair-stage": repairStage(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
