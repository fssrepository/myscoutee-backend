/* global ManualQa, process, EJSON */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "content-admin";
  const CHECKPOINT = "CONTENT-ADMIN-LIFECYCLE-001";
  const PREFIX = "manual-qa-checkpoint:v1:content-admin";
  const STATE_ID = Q.stateId(SCENARIO);
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();

  const AVA_ID = "admin-demo-ava";
  const KAI_ID = "7822c5f99eff99d63abe8933";
  const RILEY_ID = "650000000000000000000063";
  const CONSENT_USER_IDS = [AVA_ID, KAI_ID, RILEY_ID];

  const HELP_V1_ID = `${PREFIX}:revision:help:hu:v1`;
  const TERMS_V1_ID = `${PREFIX}:revision:terms:en:v1`;
  const EXPLANATION_V1_ID = `${PREFIX}:revision:explanation:home.game:en:v1`;
  const PRIVACY_V1_ID = `${PREFIX}:revision:privacy:en:v1`;
  const PRIVACY_V2_ID = `${PREFIX}:revision:privacy:en:v2`;
  const STEP_32_HELP_V2_ID = `${PREFIX}:revision:help:hu:v2:step-32`;
  const STEP_32_TERMS_V2_ID = `${PREFIX}:revision:terms:en:v2:step-32`;
  const STEP_32_EXPLANATION_V2_ID = `${PREFIX}:revision:explanation:home.game:en:v2:step-32`;
  const STEP_32_PRIVACY_V3_ID = `${PREFIX}:revision:privacy:en:v3:step-32`;
  const STEP_32_KAI_V3_CONSENT_ID = `${PREFIX}:consent:${KAI_ID}:3:step-32`;
  const BASELINE_REVISION_IDS = [
    HELP_V1_ID,
    TERMS_V1_ID,
    EXPLANATION_V1_ID,
    PRIVACY_V1_ID,
    PRIVACY_V2_ID
  ];

  const ARTICLE_ID = `${PREFIX}:article:lifecycle`;
  const FEATURED_CONTROL_ID = `${PREFIX}:article:featured-control`;
  const ARTICLE_IDS = [ARTICLE_ID, FEATURED_CONTROL_ID];
  const ARTICLE_CONTENT_KEY = "qa-content-admin-lifecycle-001-article";
  const FEATURED_CONTROL_CONTENT_KEY = "qa-content-admin-lifecycle-001-featured-control";
  const STEP_59_EXPLORATORY_ARTICLE_IDS = [
    ARTICLE_ID,
    FEATURED_CONTROL_ID,
    "idea-host-use-case",
    "idea-social-first-dating",
    "idea-why-priority-matching"
  ];
  const ARTICLE_IMAGE_URL = "/media/public?key=images/system/idea-posts/idea-register-value/v1/large.webp";
  const FEATURED_CONTROL_IMAGE_URL = "/media/public?key=images/system/idea-posts/idea-why-priority-matching/v1/large.webp";

  const SCOPES = [
    { key: "helpHu", selector: { documentType: "help", lang: "hu" } },
    { key: "termsEn", selector: { documentType: "terms", lang: "en" } },
    {
      key: "explanationHomeEn",
      selector: { documentType: "explanation", lang: "en", contextKey: "home.game" }
    },
    { key: "privacyEn", selector: { documentType: "privacy", lang: "en" } }
  ];
  const AUDIT_SELECTORS = [
    { documentType: "help", lang: "hu" },
    { documentType: "terms", lang: "en" },
    { documentType: "explanation", lang: "en" },
    { documentType: "privacy", lang: "en" }
  ];

  function config() {
    if (checkpointId !== CHECKPOINT) {
      Q.fail(`${SCENARIO} supports only ${CHECKPOINT}.`);
    }
  }

  function state(required = true) {
    const value = Q.collection(Q.STATE_COLLECTION).findOne({ _id: STATE_ID });
    if (!value && required) Q.fail(`${CHECKPOINT} is not staged.`);
    return value;
  }

  function requirePhase(currentState, expected) {
    const phase = Q.text(currentState && currentState.phase);
    if (phase !== expected) {
      Q.fail(`${CHECKPOINT} requires phase '${expected}', found '${phase || "not-staged"}'.`);
    }
  }

  function clone(value) {
    return EJSON.parse(EJSON.stringify(value));
  }

  function canonicalDomain(value) {
    const plain = JSON.parse(EJSON.stringify(value, null, 0, { relaxed: true }));
    const normalize = current => {
      if (Array.isArray(current)) return current.map(normalize);
      if (!current || typeof current !== "object") return current;
      return Object.fromEntries(Object.keys(current).sort().map(key => [key, normalize(current[key])]));
    };
    return normalize(plain);
  }

  function sameDomain(left, right) {
    return Q.sameJson(canonicalDomain(left), canonicalDomain(right));
  }

  function sorted(values) {
    return [...new Set((values || []).map(Q.text).filter(Boolean))].sort();
  }

  function revisionDocument(options, stagedAtIso) {
    const actorUserId = options.actorUserId || Q.ACTOR;
    return {
      _id: options.id,
      documentType: options.documentType,
      lang: options.lang,
      contextKey: options.contextKey || "",
      languageLabel: options.lang === "hu" ? "Magyar" : "English",
      version: options.version,
      active: options.active,
      title: options.title,
      summary: options.summary,
      description: options.description,
      headerColor: options.headerColor,
      sections: options.sections,
      createdDate: stagedAtIso,
      createdUser: actorUserId,
      updatedDate: stagedAtIso,
      updatedUser: actorUserId
    };
  }

  function section(id, icon, title, contentHtml, optional = false, panelSpan = "span-1") {
    return {
      id,
      icon,
      title,
      blurb: `${CHECKPOINT} controlled section.`,
      contentHtml,
      imageUrls: [],
      panelSpan,
      optional
    };
  }

  function baselineRevisions(stagedAtIso) {
    return [
      revisionDocument({
        id: HELP_V1_ID,
        documentType: "help",
        lang: "hu",
        version: 1,
        active: true,
        title: "QA CONTENT Help HU v1",
        summary: "QA Content súgó alap",
        description: "Controlled active Hungarian Help baseline.",
        headerColor: "amber",
        sections: [section("qa-help-baseline", "help", "QA súgó alap", "<p>QA Help HU v1 baseline.</p>")]
      }, stagedAtIso),
      revisionDocument({
        id: TERMS_V1_ID,
        documentType: "terms",
        lang: "en",
        version: 1,
        active: true,
        title: "QA CONTENT Terms EN v1",
        summary: "QA Content terms baseline",
        description: "Controlled active English Terms baseline.",
        headerColor: "slate",
        sections: [section("qa-terms-baseline", "gavel", "QA terms baseline", "<p>QA Terms EN v1 baseline.</p>")]
      }, stagedAtIso),
      revisionDocument({
        id: EXPLANATION_V1_ID,
        documentType: "explanation",
        lang: "en",
        contextKey: "home.game",
        version: 1,
        active: true,
        title: "QA CONTENT Home cards EN v1",
        summary: "QA Home cards baseline",
        description: "Controlled active Home cards explanation baseline.",
        headerColor: "violet",
        sections: [section("qa-home-baseline", "home", "QA home-card baseline", "<p>QA Home cards EN v1 baseline.</p>")]
      }, stagedAtIso),
      revisionDocument({
        id: PRIVACY_V1_ID,
        documentType: "privacy",
        lang: "en",
        version: 1,
        active: false,
        title: "QA CONTENT Privacy EN v1",
        summary: "QA Privacy historical baseline",
        description: "Controlled inactive historical Privacy baseline.",
        headerColor: "amber",
        sections: [section("qa-privacy-v1-required", "policy", "Required privacy v1", "<p>QA Privacy EN v1 historical baseline.</p>")]
      }, stagedAtIso),
      revisionDocument({
        id: PRIVACY_V2_ID,
        documentType: "privacy",
        lang: "en",
        version: 2,
        active: true,
        title: "QA CONTENT Privacy EN v2",
        summary: "QA Privacy current baseline",
        description: "Controlled active Privacy baseline.",
        headerColor: "amber",
        sections: [
          section("qa-privacy-v2-required", "policy", "Required privacy v2", "<p>QA Privacy EN v2 current baseline.</p>"),
          section("qa-privacy-v2-optional", "science", "Existing research choice", "<p>Optional Privacy v2 choice.</p>", true)
        ]
      }, stagedAtIso)
    ];
  }

  function consentDocument(userId, revisionId, revisionVersion, stagedAtIso) {
    return {
      _id: `${PREFIX}:consent:${userId}:${revisionVersion}`,
      userId,
      revisionId,
      revisionVersion,
      approvedOptionalSectionIds: [],
      acceptedAtIso: stagedAtIso,
      updatedAtIso: stagedAtIso,
      source: "settings"
    };
  }

  function baselineConsents(stagedAtIso) {
    return [
      consentDocument(AVA_ID, PRIVACY_V2_ID, 2, stagedAtIso),
      consentDocument(KAI_ID, PRIVACY_V1_ID, 1, stagedAtIso),
      consentDocument(KAI_ID, PRIVACY_V2_ID, 2, stagedAtIso),
      consentDocument(RILEY_ID, PRIVACY_V1_ID, 1, stagedAtIso),
      consentDocument(RILEY_ID, PRIVACY_V2_ID, 2, stagedAtIso)
    ];
  }

  function auditDocument(id, revision, action, message, createdDate) {
    return {
      _id: id,
      revisionId: Q.text(revision._id),
      documentType: Q.text(revision.documentType),
      lang: Q.text(revision.lang),
      languageLabel: Q.text(revision.languageLabel),
      version: Q.number(revision.version),
      action,
      actorUserId: AVA_ID,
      createdDate,
      message
    };
  }

  function step32DraftRevisions(currentState, restagedAtIso) {
    const baseline = clone(currentState.baselineRevisions || []);
    const privacyV2 = baseline.find(row => Q.text(row._id) === PRIVACY_V2_ID);
    if (!privacyV2) Q.fail("the staged Privacy v2 baseline is unavailable.");
    privacyV2.active = true;
    return [
      ...baseline,
      revisionDocument({
        id: STEP_32_HELP_V2_ID,
        documentType: "help",
        lang: "hu",
        version: 2,
        active: false,
        title: "QA CONTENT Help HU v2",
        summary: "QA Content súgó",
        description: "QA only Help draft",
        headerColor: "amber",
        actorUserId: AVA_ID,
        sections: [section("qa-help-baseline", "help", "QA súgó szakasz", "<p>QA help draft HU.</p>")]
      }, restagedAtIso),
      revisionDocument({
        id: STEP_32_TERMS_V2_ID,
        documentType: "terms",
        lang: "en",
        version: 2,
        active: false,
        title: "QA CONTENT Terms EN v2",
        summary: "QA Content terms",
        description: "QA only Terms draft",
        headerColor: "slate",
        actorUserId: AVA_ID,
        sections: [section("qa-terms-baseline", "gavel", "QA terms section", "<p>QA terms draft EN.</p>")]
      }, restagedAtIso),
      revisionDocument({
        id: STEP_32_EXPLANATION_V2_ID,
        documentType: "explanation",
        lang: "en",
        contextKey: "home.game",
        version: 2,
        active: false,
        title: "QA CONTENT Home cards EN v2",
        summary: "QA Content explanation",
        description: "QA only Home cards draft",
        headerColor: "violet",
        actorUserId: AVA_ID,
        sections: [section(
          "qa-home-baseline",
          "home",
          "QA home-card explanation",
          "<p>QA explanation draft EN.</p>",
          false,
          "span-2"
        )]
      }, restagedAtIso),
      revisionDocument({
        id: STEP_32_PRIVACY_V3_ID,
        documentType: "privacy",
        lang: "en",
        version: 3,
        active: false,
        title: "QA CONTENT Privacy EN v3",
        summary: "QA Content privacy update",
        description: "QA privacy consent boundary",
        headerColor: "blue",
        actorUserId: AVA_ID,
        sections: [
          section("qa-privacy-v2-required", "policy", "Required QA notice", "<p><strong>QA privacy v3</strong></p>"),
          section("qa-privacy-v2-optional", "science", "QA research choice", "<p>Optional QA research consent.</p>", true)
        ]
      }, restagedAtIso)
    ];
  }

  function step32CreateAudits(revisions, restagedAtIso) {
    const byId = new Map(revisions.map(row => [Q.text(row._id), row]));
    const definitions = [
      ["help", STEP_32_HELP_V2_ID, `Created v2 from ${HELP_V1_ID}.`],
      ["terms", STEP_32_TERMS_V2_ID, `Created v2 from ${TERMS_V1_ID}.`],
      ["explanation", STEP_32_EXPLANATION_V2_ID, `Created v2 from ${EXPLANATION_V1_ID}.`],
      ["privacy", STEP_32_PRIVACY_V3_ID, `Created v3 from ${PRIVACY_V2_ID}.`]
    ];
    return definitions.map(([kind, revisionId, message], index) => auditDocument(
      `${PREFIX}:audit:${kind}:create:step-32`,
      byId.get(revisionId),
      "create",
      message,
      new Date(Date.parse(restagedAtIso) + index).toISOString()
    ));
  }

  function restoreDocuments(collection, selector, documents) {
    collection.deleteMany(selector);
    if ((documents || []).length > 0) collection.insertMany(clone(documents));
  }

  function articleDocument(options, stagedAtIso) {
    return {
      _id: options.id,
      submittedAtIso: options.submittedAtIso,
      contentKey: options.contentKey,
      lang: "en",
      languageLabel: "English",
      title: options.title,
      excerpt: options.excerpt,
      contentHtml: `<p>${options.body}</p><figure><img src="${options.imageUrl}" alt="${options.title}"></figure>`,
      imageUrl: options.imageUrl,
      imageUrls: [options.imageUrl],
      featured: options.featured,
      published: true,
      trashed: false,
      trashedAtIso: null,
      trashedByUserId: null,
      createdDate: stagedAtIso,
      createdUser: AVA_ID,
      updatedDate: stagedAtIso,
      updatedUser: AVA_ID
    };
  }

  function baselineArticles(stagedAtIso) {
    return [
      articleDocument({
        id: ARTICLE_ID,
        submittedAtIso: stagedAtIso,
        contentKey: ARTICLE_CONTENT_KEY,
        title: "QA CONTENT-ADMIN-LIFECYCLE-001 Article",
        excerpt: "Controlled published Article lifecycle.",
        body: "QA Content lifecycle article body.",
        imageUrl: ARTICLE_IMAGE_URL,
        featured: false
      }, stagedAtIso),
      articleDocument({
        id: FEATURED_CONTROL_ID,
        submittedAtIso: new Date(Date.parse(stagedAtIso) - 1000).toISOString(),
        contentKey: FEATURED_CONTROL_CONTENT_KEY,
        title: "QA CONTENT-ADMIN-LIFECYCLE-001 Featured Control",
        excerpt: "Immutable featured Article control.",
        body: "This featured Article must remain unchanged.",
        imageUrl: FEATURED_CONTROL_IMAGE_URL,
        featured: true
      }, stagedAtIso)
    ];
  }

  function scopeRows(scope) {
    return Q.collection("helpCenterRevisions")
      .find(scope.selector)
      .sort({ version: 1, _id: 1 })
      .toArray();
  }

  function belongsToControlledScope(row) {
    return SCOPES.some(scope => Object.entries(scope.selector).every(
      ([key, value]) => Q.text(row && row[key]) === Q.text(value)
    ));
  }

  function controlledRevisions() {
    return SCOPES.flatMap(scope => scopeRows(scope));
  }

  function actorConsents() {
    return Q.collection("privacyConsents")
      .find({ userId: { $in: CONSENT_USER_IDS } })
      .sort({ userId: 1, revisionVersion: 1, _id: 1 })
      .toArray();
  }

  function assertBaselineConsentsPreserved(currentState, consents) {
    const baselineIds = sorted((currentState.baselineConsents || []).map(value => value._id));
    const baselineCurrent = consents.filter(value => baselineIds.includes(Q.text(value._id)));
    if (!sameDomain(baselineCurrent, currentState.baselineConsents)) {
      Q.fail("historical/current v1/v2 consents changed.");
    }
    return baselineIds;
  }

  function unexpectedKaiRileyConsents(consents, allowedIds) {
    const allowed = new Set(sorted(allowedIds));
    return consents.filter(value => [KAI_ID, RILEY_ID].includes(Q.text(value.userId))
      && !allowed.has(Q.text(value._id)));
  }

  function controlledArticles() {
    return Q.collection("ideaPosts")
      .find({ _id: { $in: ARTICLE_IDS } })
      .sort({ _id: 1 })
      .toArray();
  }

  function ideaCounts() {
    const base = { lang: "en" };
    return {
      all: Q.collection("ideaPosts").countDocuments({ ...base, trashed: { $ne: true } }),
      featured: Q.collection("ideaPosts").countDocuments({ ...base, trashed: { $ne: true }, featured: true }),
      published: Q.collection("ideaPosts").countDocuments({ ...base, trashed: { $ne: true }, published: { $ne: false } }),
      drafts: Q.collection("ideaPosts").countDocuments({ ...base, trashed: { $ne: true }, published: false }),
      trashed: Q.collection("ideaPosts").countDocuments({ ...base, trashed: true })
    };
  }

  function revisionControlSummary(rows) {
    return (rows || []).map(row => ({
      id: Q.text(row._id),
      documentType: Q.text(row.documentType || "help").toLowerCase(),
      lang: Q.text(row.lang || "en").toLowerCase(),
      contextKey: Q.text(row.contextKey),
      languageLabel: Q.text(row.languageLabel) || (Q.text(row.lang).toLowerCase() === "hu" ? "Magyar" : "English"),
      version: Q.number(row.version),
      active: row.active === true,
      title: Q.text(row.title),
      summary: Q.text(row.summary),
      description: Q.text(row.description),
      headerColor: Q.text(row.headerColor),
      sections: clone(row.sections || []),
      createdDate: Q.text(row.createdDate),
      createdUser: Q.text(row.createdUser),
      updatedDate: Q.text(row.updatedDate),
      updatedUser: Q.text(row.updatedUser)
    })).sort((left, right) => left.id.localeCompare(right.id));
  }

  function normalizeRevisionControlSummary(rows) {
    return (rows || []).map(row => ({
      ...clone(row),
      sections: (row.sections || []).map(value => ({
        ...clone(value),
        imageUrls: clone(value.imageUrls || [])
      }))
    }));
  }

  function newAudits(currentState) {
    return Q.collection("helpCenterAudit")
      .find({ actorUserId: AVA_ID, createdDate: { $gte: Q.text(currentState.stagedAtIso) } })
      .sort({ createdDate: 1, _id: 1 })
      .toArray();
  }

  function auditMatches(audits, revision, action, message) {
    const matches = audits.filter(audit => Q.text(audit.revisionId) === Q.text(revision._id)
      && Q.text(audit.documentType) === Q.text(revision.documentType)
      && Q.text(audit.lang) === Q.text(revision.lang)
      && Q.number(audit.version) === Q.number(revision.version)
      && Q.text(audit.action) === action
      && Q.text(audit.actorUserId) === AVA_ID
      && Q.text(audit.message) === message);
    return matches.length === 1;
  }

  function assertUsers() {
    const ava = Q.ensureUser(AVA_ID, "Content admin");
    const kai = Q.ensureUser(KAI_ID, "retained Content client");
    const riley = Q.ensureUser(RILEY_ID, "fresh Content client");
    if (Q.text(ava.name) !== "Ava Moderation" || Q.text(ava.hostTier).toLowerCase() !== "admin") {
      Q.fail(`'${AVA_ID}' is not the expected Ava Moderation Admin.`);
    }
    if (Q.text(kai.name) !== "Kai Morgan" || Q.text(riley.name) !== "Riley Outside") {
      Q.fail("Kai/Riley controlled Content actors are missing or renamed.");
    }
  }

  function assertControls(currentState) {
    const unrelatedRevisions = Q.collection("helpCenterRevisions")
      .find({})
      .toArray()
      .filter(row => !belongsToControlledScope(row));
    const expectedUnrelatedRevisionSummary = currentState.unrelatedRevisionSummary || [];
    if (!sameDomain(
      normalizeRevisionControlSummary(revisionControlSummary(unrelatedRevisions)),
      normalizeRevisionControlSummary(expectedUnrelatedRevisionSummary)
    )) {
      Q.fail("an unrelated governed-content revision changed.");
    }

    const unrelatedIdeas = Q.collection("ideaPosts")
      .find({ _id: { $nin: ARTICLE_IDS } })
      .sort({ _id: 1 })
      .toArray();
    if (!sameDomain(unrelatedIdeas, currentState.unrelatedIdeas)) {
      Q.fail("an unrelated Article, including any retained ARTICLE-SRC-002 record, changed.");
    }

    const unrelatedConsents = Q.collection("privacyConsents")
      .find({ userId: { $nin: CONSENT_USER_IDS } })
      .sort({ _id: 1 })
      .toArray();
    if (!sameDomain(unrelatedConsents, currentState.unrelatedConsents)) {
      Q.fail("an unrelated user's Privacy consent changed.");
    }
  }

  function assertSoleActives(expected) {
    for (const scope of SCOPES) {
      const activeIds = scopeRows(scope).filter(row => row.active === true).map(row => Q.text(row._id));
      if (!sameDomain(activeIds, [expected[scope.key]])) {
        Q.fail(`${scope.key} active IDs are ${JSON.stringify(activeIds)}; expected only '${expected[scope.key]}'.`);
      }
    }
  }

  function assertBaseline(currentState) {
    const revisions = controlledRevisions();
    const consents = actorConsents();
    const articles = controlledArticles();
    if (!sameDomain(revisions, currentState.baselineRevisions)) {
      Q.fail("controlled governed-content baseline differs from the staged write-side records.");
    }
    if (!sameDomain(consents, currentState.baselineConsents)) {
      Q.fail("controlled Ava/Kai/Riley consent baseline differs from the staged records.");
    }
    if (!sameDomain(articles, currentState.baselineArticles)) {
      Q.fail("controlled Article baseline differs from the staged records.");
    }
    if (!sameDomain(ideaCounts(), currentState.baselineIdeaCounts)) {
      Q.fail("English Article bucket counts differ from the staged baseline.");
    }
    if (newAudits(currentState).length !== 0) {
      Q.fail("the staged baseline unexpectedly contains a fixture-owned Content audit.");
    }
    assertControls(currentState);
    assertSoleActives({
      helpHu: HELP_V1_ID,
      termsEn: TERMS_V1_ID,
      explanationHomeEn: EXPLANATION_V1_ID,
      privacyEn: PRIVACY_V2_ID
    });
  }

  function findVersion(scopeKey, version) {
    const scope = SCOPES.find(value => value.key === scopeKey);
    const matches = scopeRows(scope).filter(row => Q.number(row.version) === version);
    if (matches.length !== 1) {
      Q.fail(`${scopeKey} v${version} count is ${matches.length}; expected one.`);
    }
    return matches[0];
  }

  function assertTextRevision(revision, expected) {
    if (Q.text(revision.title) !== expected.title
        || Q.text(revision.summary) !== expected.summary
        || Q.text(revision.description) !== expected.description
        || Q.text(revision.createdUser) !== AVA_ID
        || Q.text(revision.updatedUser) !== AVA_ID
        || revision.active === true) {
      Q.fail(`${expected.label} has unexpected text, actor or active state.`);
    }
    const first = Array.isArray(revision.sections) ? revision.sections[0] : null;
    if (!first
        || Q.text(first.title) !== expected.sectionTitle
        || Q.text(first.contentHtml) !== expected.sectionHtml
        || (expected.panelSpan && Q.text(first.panelSpan) !== expected.panelSpan)) {
      Q.fail(`${expected.label} has unexpected first-section content or layout.`);
    }
  }

  function assertDraftState(currentState) {
    const helpV2 = findVersion("helpHu", 2);
    const termsV2 = findVersion("termsEn", 2);
    const explanationV2 = findVersion("explanationHomeEn", 2);
    const privacyV3 = findVersion("privacyEn", 3);

    assertTextRevision(helpV2, {
      label: "Help HU v2",
      title: "QA CONTENT Help HU v2",
      summary: "QA Content súgó",
      description: "QA only Help draft",
      sectionTitle: "QA súgó szakasz",
      sectionHtml: "<p>QA help draft HU.</p>"
    });
    assertTextRevision(termsV2, {
      label: "Terms EN v2",
      title: "QA CONTENT Terms EN v2",
      summary: "QA Content terms",
      description: "QA only Terms draft",
      sectionTitle: "QA terms section",
      sectionHtml: "<p>QA terms draft EN.</p>"
    });
    assertTextRevision(explanationV2, {
      label: "Home cards EN v2",
      title: "QA CONTENT Home cards EN v2",
      summary: "QA Content explanation",
      description: "QA only Home cards draft",
      sectionTitle: "QA home-card explanation",
      sectionHtml: "<p>QA explanation draft EN.</p>",
      panelSpan: "span-2"
    });
    if (Q.text(privacyV3.title) !== "QA CONTENT Privacy EN v3"
        || Q.text(privacyV3.summary) !== "QA Content privacy update"
        || Q.text(privacyV3.description) !== "QA privacy consent boundary"
        || Q.text(privacyV3.headerColor) !== "blue"
        || Q.text(privacyV3.createdUser) !== AVA_ID
        || privacyV3.active === true) {
      Q.fail("Privacy EN v3 has unexpected text, color, actor or active state.");
    }
    const privacySections = Array.isArray(privacyV3.sections) ? privacyV3.sections : [];
    if (privacySections.length !== 2
        || Q.text(privacySections[0].title) !== "Required QA notice"
        || privacySections[0].optional === true
        || !Q.text(privacySections[0].contentHtml).includes("QA privacy v3")
        || /<script|onclick\s*=/i.test(Q.text(privacySections[0].contentHtml))
        || Q.text(privacySections[1].title) !== "QA research choice"
        || privacySections[1].optional !== true
        || Q.text(privacySections[1].contentHtml) !== "<p>Optional QA research consent.</p>") {
      Q.fail("Privacy EN v3 sections are not the exact sanitized mandatory/optional pair.");
    }

    assertSoleActives({
      helpHu: HELP_V1_ID,
      termsEn: TERMS_V1_ID,
      explanationHomeEn: EXPLANATION_V1_ID,
      privacyEn: PRIVACY_V2_ID
    });
    if (!sameDomain(actorConsents(), currentState.baselineConsents)) {
      Q.fail("draft saves changed the controlled Privacy consents.");
    }
    if (!sameDomain(controlledArticles(), currentState.baselineArticles)
        || !sameDomain(ideaCounts(), currentState.baselineIdeaCounts)) {
      Q.fail("draft saves changed the controlled Article branch.");
    }
    assertControls({
      ...currentState,
      controlledRevisionIds: [...BASELINE_REVISION_IDS, helpV2._id, termsV2._id, explanationV2._id, privacyV3._id]
    });

    const audits = newAudits(currentState);
    const expectations = [
      [helpV2, `Created v2 from ${HELP_V1_ID}.`],
      [termsV2, `Created v2 from ${TERMS_V1_ID}.`],
      [explanationV2, `Created v2 from ${EXPLANATION_V1_ID}.`],
      [privacyV3, `Created v3 from ${PRIVACY_V2_ID}.`]
    ];
    if (audits.length !== 4 || expectations.some(([revision, message]) => !auditMatches(audits, revision, "create", message))) {
      Q.fail("draft save audits are not the exact four create records with their base revision IDs.");
    }
    return { helpV2, termsV2, explanationV2, privacyV3, audits };
  }

  function assertConsent(consent, userId, revisionId, version) {
    return consent
      && Q.text(consent.userId) === userId
      && Q.text(consent.revisionId) === revisionId
      && Q.number(consent.revisionVersion) === version
      && Q.text(consent.acceptedAtIso)
      && Q.text(consent.updatedAtIso)
      && Q.text(consent.source) === "settings";
  }

  function assertContentAfterFallback(currentState) {
    const helpRows = scopeRows(SCOPES[0]);
    const privacyRows = scopeRows(SCOPES[3]);
    if (helpRows.length !== 1 || Q.text(helpRows[0]._id) !== HELP_V1_ID || helpRows[0].active !== true) {
      Q.fail("Help v2 was not deleted exactly or Help v1 is not active.");
    }
    if (privacyRows.length !== 2
        || privacyRows.some(row => ![PRIVACY_V1_ID, PRIVACY_V2_ID].includes(Q.text(row._id)))
        || findVersion("privacyEn", 2).active !== true
        || findVersion("privacyEn", 1).active === true) {
      Q.fail("Privacy v3 was not deleted exactly or Privacy v2 did not become the sole fallback.");
    }
    const termsV2 = findVersion("termsEn", 2);
    const explanationV2 = findVersion("explanationHomeEn", 2);
    if (Q.text(termsV2._id) !== Q.text(currentState.termsV2Id)
        || Q.text(explanationV2._id) !== Q.text(currentState.explanationV2Id)) {
      Q.fail("Terms/Explanation inactive controls changed during fallback.");
    }
    assertSoleActives({
      helpHu: HELP_V1_ID,
      termsEn: TERMS_V1_ID,
      explanationHomeEn: EXPLANATION_V1_ID,
      privacyEn: PRIVACY_V2_ID
    });
  }

  function assertStableArticleIdentity(current, baseline) {
    const stableFields = [
      "_id", "submittedAtIso", "contentKey", "lang", "languageLabel", "title",
      "excerpt", "contentHtml", "imageUrl", "imageUrls", "createdDate", "createdUser"
    ];
    const currentStable = Object.fromEntries(stableFields.map(field => [field, current && current[field]]));
    const baselineStable = Object.fromEntries(stableFields.map(field => [field, baseline && baseline[field]]));
    if (!sameDomain(currentStable, baselineStable)) {
      Q.fail("the Article identity, content, creator or managed-image references changed.");
    }
  }

  function stage() {
    config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    assertUsers();

    const mediaSources = [ARTICLE_IMAGE_URL, FEATURED_CONTROL_IMAGE_URL].map(imageUrl => (
      Q.collection("ideaPosts").findOne({ imageUrl, published: { $ne: false }, trashed: { $ne: true } })
    ));
    if (mediaSources.some(value => !value) || ARTICLE_IMAGE_URL === FEATURED_CONTROL_IMAGE_URL) {
      Q.fail("the two distinct managed system image controls required by the Content fixture are unavailable.");
    }

    const stagedAtIso = Q.nowIso();
    const originalSnapshots = Q.snapshotSpecs([
      ...SCOPES.map(scope => ({ collection: "helpCenterRevisions", selector: scope.selector })),
      ...AUDIT_SELECTORS.map(selector => ({ collection: "helpCenterAudit", selector })),
      { collection: "privacyConsents", selector: { userId: { $in: CONSENT_USER_IDS } } },
      { collection: "ideaPosts", selector: { _id: { $in: ARTICLE_IDS } } }
    ]);
    const unrelatedRevisionSummary = revisionControlSummary(
      Q.collection("helpCenterRevisions").find({}).toArray().filter(row => !belongsToControlledScope(row))
    );
    const unrelatedIdeas = Q.collection("ideaPosts")
      .find({ _id: { $nin: ARTICLE_IDS } })
      .sort({ _id: 1 })
      .toArray();
    const unrelatedConsents = Q.collection("privacyConsents")
      .find({ userId: { $nin: CONSENT_USER_IDS } })
      .sort({ _id: 1 })
      .toArray();

    for (const scope of SCOPES) Q.collection("helpCenterRevisions").deleteMany(scope.selector);
    Q.collection("helpCenterRevisions").insertMany(baselineRevisions(stagedAtIso));
    Q.collection("privacyConsents").deleteMany({ userId: { $in: CONSENT_USER_IDS } });
    Q.collection("privacyConsents").insertMany(baselineConsents(stagedAtIso));
    Q.collection("ideaPosts").deleteMany({ _id: { $in: ARTICLE_IDS } });
    Q.collection("ideaPosts").insertMany(baselineArticles(stagedAtIso));

    const stagedRevisions = controlledRevisions();
    const stagedConsents = actorConsents();
    const stagedArticles = controlledArticles();
    const baselineIdeaCounts = ideaCounts();
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: STATE_ID,
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline-ready",
      stagedAtIso,
      actorIds: { ava: AVA_ID, kai: KAI_ID, riley: RILEY_ID },
      revisionIds: {
        helpV1: HELP_V1_ID,
        termsV1: TERMS_V1_ID,
        explanationV1: EXPLANATION_V1_ID,
        privacyV1: PRIVACY_V1_ID,
        privacyV2: PRIVACY_V2_ID
      },
      articleIds: { target: ARTICLE_ID, featuredControl: FEATURED_CONTROL_ID },
      managedImageUrls: [ARTICLE_IMAGE_URL, FEATURED_CONTROL_IMAGE_URL],
      originalSnapshots,
      baselineRevisions: stagedRevisions,
      baselineConsents: stagedConsents,
      baselineArticles: stagedArticles,
      baselineIdeaCounts,
      unrelatedRevisionSummary,
      unrelatedIdeas,
      unrelatedConsents,
      controlledRevisionIds: BASELINE_REVISION_IDS
    });

    const stagedState = state();
    assertBaseline(stagedState);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline-ready",
      stagedAtIso,
      actors: stagedState.actorIds,
      revisionIds: stagedState.revisionIds,
      articleIds: stagedState.articleIds,
      ideaCounts: baselineIdeaCounts,
      baselineChecks: {
        exactGovernedScopes: true,
        exactHistoricalAndCurrentConsents: true,
        exactArticlePair: true,
        distinctManagedImages: true,
        unrelatedContentStable: true,
        noFixtureAudit: true
      },
      next: "Open only the configured Ava/Kai/Riley browsers, complete the four inactive drafts, then run verify-drafts-saved."
    });
  }

  function status() {
    config();
    const currentState = state(false);
    if (!currentState) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "not-staged",
        activeScenario: Q.collection(Q.STATE_COLLECTION).findOne({}, { scenario: 1, checkpointId: 1, phase: 1 }),
        next: `After the active checkpoint is reset, run stage ${SCENARIO} ${checkpointId}.`
      });
      return;
    }
    if (Q.text(currentState.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged checkpoint is '${Q.text(currentState.checkpointId)}', not '${checkpointId}'.`);
    }
    if (Q.text(currentState.phase) === "baseline-ready") assertBaseline(currentState);
    else assertControls(currentState);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: Q.text(currentState.phase),
      stagedAtIso: Q.text(currentState.stagedAtIso),
      actors: currentState.actorIds,
      revisionIds: currentState.revisionIds,
      articleIds: currentState.articleIds,
      ideaCounts: ideaCounts(),
      controlledRevisionIds: sorted((currentState.controlledRevisionIds || BASELINE_REVISION_IDS)),
      controlledConsentCount: actorConsents().length,
      newAuditCount: newAudits(currentState).length,
      controlsStable: true
    });
  }

  function verifyDraftsSaved() {
    config();
    const currentState = state();
    requirePhase(currentState, "baseline-ready");
    const verified = assertDraftState(currentState);
    const capturedAtIso = Q.nowIso();
    const controlledRevisionIds = sorted([
      ...BASELINE_REVISION_IDS,
      verified.helpV2._id,
      verified.termsV2._id,
      verified.explanationV2._id,
      verified.privacyV3._id
    ]);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: STATE_ID },
      {
        $set: {
          phase: "drafts-saved",
          draftsSavedAtIso: capturedAtIso,
          helpV2Id: Q.text(verified.helpV2._id),
          termsV2Id: Q.text(verified.termsV2._id),
          explanationV2Id: Q.text(verified.explanationV2._id),
          privacyV3Id: Q.text(verified.privacyV3._id),
          draftsSavedRevisions: [verified.helpV2, verified.termsV2, verified.explanationV2, verified.privacyV3],
          controlledRevisionIds,
          draftAuditIds: sorted(verified.audits.map(audit => audit._id))
        }
      }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "drafts-saved",
      capturedAtIso,
      revisionIds: {
        helpV2: Q.text(verified.helpV2._id),
        termsV2: Q.text(verified.termsV2._id),
        explanationV2: Q.text(verified.explanationV2._id),
        privacyV3: Q.text(verified.privacyV3._id)
      },
      exactCreateAudits: 4,
      sanitizedPrivacyProbe: true,
      publicActivesUnchanged: true,
      consentsUnchanged: true,
      next: "Activate only Privacy v3, approve it only as Kai, then run verify-privacy-active."
    });
  }

  function assertPrivacyActiveState(currentState) {
    const privacyV3 = findVersion("privacyEn", 3);
    if (Q.text(privacyV3._id) !== Q.text(currentState.privacyV3Id) || privacyV3.active !== true) {
      Q.fail("Privacy v3 is not the expected sole active revision.");
    }
    assertSoleActives({
      helpHu: HELP_V1_ID,
      termsEn: TERMS_V1_ID,
      explanationHomeEn: EXPLANATION_V1_ID,
      privacyEn: Q.text(currentState.privacyV3Id)
    });

    const consents = actorConsents();
    const baselineIds = assertBaselineConsentsPreserved(currentState, consents);
    const kaiV3 = consents.filter(value => Q.text(value.userId) === KAI_ID
      && Q.text(value.revisionId) === Q.text(currentState.privacyV3Id));
    const rileyV3 = consents.filter(value => Q.text(value.userId) === RILEY_ID
      && Q.text(value.revisionId) === Q.text(currentState.privacyV3Id));
    if (kaiV3.length !== 1
        || !assertConsent(kaiV3[0], KAI_ID, Q.text(currentState.privacyV3Id), 3)
        || !sameDomain(kaiV3[0].approvedOptionalSectionIds || [], [])
        || rileyV3.length !== 0
        || unexpectedKaiRileyConsents(consents, [...baselineIds, kaiV3[0] && kaiV3[0]._id]).length !== 0) {
      Q.fail("Privacy v3 consent isolation is not exactly one Kai approval and zero Riley approval.");
    }
    if (!sameDomain(controlledArticles(), currentState.baselineArticles)
        || !sameDomain(ideaCounts(), currentState.baselineIdeaCounts)) {
      Q.fail("Privacy activation changed the Article branch.");
    }
    assertControls(currentState);

    const audits = newAudits(currentState);
    if (audits.length !== 5
        || !auditMatches(audits, privacyV3, "activate", "Activated v3.")) {
      Q.fail("Privacy activation did not add exactly one matching audit after the four draft audits.");
    }
    return { privacyV3, kaiV3: kaiV3[0], audits };
  }

  function verifyPrivacyActive() {
    config();
    const currentState = state();
    requirePhase(currentState, "drafts-saved");
    const verified = assertPrivacyActiveState(currentState);
    const capturedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: STATE_ID },
      { $set: { phase: "privacy-active", privacyActiveAtIso: capturedAtIso, kaiV3ConsentId: Q.text(verified.kaiV3._id) } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "privacy-active",
      capturedAtIso,
      activePrivacyRevisionId: Q.text(verified.privacyV3._id),
      kaiV3ConsentId: Q.text(verified.kaiV3._id),
      rileyV3ConsentCount: 0,
      historicalConsentsStable: true,
      exactAuditCount: 5,
      next: "Delete inactive Help v2, then active Privacy v3, reload Kai/Riley and run verify-privacy-fallback."
    });
  }

  function step32StateFields(verifiedDraft, verifiedActive, capturedAtIso) {
    return {
      phase: "privacy-active",
      draftsSavedAtIso: capturedAtIso,
      helpV2Id: Q.text(verifiedDraft.helpV2._id),
      termsV2Id: Q.text(verifiedDraft.termsV2._id),
      explanationV2Id: Q.text(verifiedDraft.explanationV2._id),
      privacyV3Id: Q.text(verifiedDraft.privacyV3._id),
      draftsSavedRevisions: [
        verifiedDraft.helpV2,
        verifiedDraft.termsV2,
        verifiedDraft.explanationV2,
        verifiedDraft.privacyV3
      ],
      controlledRevisionIds: sorted([
        ...BASELINE_REVISION_IDS,
        verifiedDraft.helpV2._id,
        verifiedDraft.termsV2._id,
        verifiedDraft.explanationV2._id,
        verifiedDraft.privacyV3._id
      ]),
      draftAuditIds: sorted(verifiedDraft.audits.map(audit => audit._id)),
      privacyActiveAtIso: capturedAtIso,
      kaiV3ConsentId: Q.text(verifiedActive.kaiV3._id)
    };
  }

  function clearPostStep32State() {
    return {
      privacyFallbackAtIso: "",
      fallbackRevisions: "",
      articleTrashedAtIso: "",
      trashedArticle: "",
      articleRestoredAtIso: "",
      restoredArticle: "",
      verifiedAtIso: "",
      republishedArticle: ""
    };
  }

  function restageStep32Boundary() {
    config();
    const currentState = state();
    assertUsers();
    assertControls(currentState);
    if (!(currentState.originalSnapshots || []).length
        || !(currentState.baselineRevisions || []).length
        || !(currentState.baselineConsents || []).length
        || !(currentState.baselineArticles || []).length) {
      Q.fail("the original staged Content snapshots required for step 32 are unavailable.");
    }

    const restagedAtIso = Q.nowIso();
    const draftRevisions = step32DraftRevisions(currentState, restagedAtIso);
    const createAudits = step32CreateAudits(draftRevisions, restagedAtIso);
    for (const scope of SCOPES) Q.collection("helpCenterRevisions").deleteMany(scope.selector);
    Q.collection("helpCenterRevisions").insertMany(draftRevisions);
    const currentAuditIds = newAudits(currentState).map(row => row._id);
    if (currentAuditIds.length > 0) {
      Q.collection("helpCenterAudit").deleteMany({ _id: { $in: currentAuditIds } });
    }
    Q.collection("helpCenterAudit").insertMany(createAudits);
    restoreDocuments(
      Q.collection("privacyConsents"),
      { userId: { $in: CONSENT_USER_IDS } },
      currentState.baselineConsents
    );
    restoreDocuments(
      Q.collection("ideaPosts"),
      { _id: { $in: ARTICLE_IDS } },
      currentState.baselineArticles
    );

    const verifiedDraft = assertDraftState(currentState);
    Q.collection("helpCenterRevisions").updateOne({ _id: PRIVACY_V2_ID }, { $set: { active: false } });
    Q.collection("helpCenterRevisions").updateOne({ _id: STEP_32_PRIVACY_V3_ID }, { $set: { active: true } });
    const kaiV3Consent = consentDocument(KAI_ID, STEP_32_PRIVACY_V3_ID, 3, restagedAtIso);
    kaiV3Consent._id = STEP_32_KAI_V3_CONSENT_ID;
    Q.collection("privacyConsents").insertOne(kaiV3Consent);
    const activePrivacy = Q.collection("helpCenterRevisions").findOne({ _id: STEP_32_PRIVACY_V3_ID });
    Q.collection("helpCenterAudit").insertOne(auditDocument(
      `${PREFIX}:audit:privacy:activate:step-32`,
      activePrivacy,
      "activate",
      "Activated v3.",
      new Date(Date.parse(restagedAtIso) + createAudits.length).toISOString()
    ));

    const verificationState = {
      ...currentState,
      privacyV3Id: STEP_32_PRIVACY_V3_ID
    };
    const verifiedActive = assertPrivacyActiveState(verificationState);
    const stateFields = step32StateFields(verifiedDraft, verifiedActive, restagedAtIso);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: STATE_ID },
      {
        $set: stateFields,
        $unset: clearPostStep32State()
      }
    );

    const boundary = {
      capturedAtIso: restagedAtIso,
      revisions: controlledRevisions(),
      audits: newAudits(state()),
      consents: actorConsents(),
      articles: controlledArticles(),
      ideaCounts: ideaCounts(),
      stateFields
    };
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: STATE_ID },
      { $set: { step32Boundary: boundary } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "privacy-active",
      replayBoundary: "step-32-ready",
      restagedAtIso,
      controlledRevisionCount: boundary.revisions.length,
      controlledConsentCount: boundary.consents.length,
      exactAuditCount: boundary.audits.length,
      articleStateRestored: true,
      unrelatedControlsStable: true,
      browserAction: "Reload the already-open Ava/Kai/Riley pages once; do not relaunch the browsers.",
      next: "Continue at checklist step 32."
    });
  }

  function rollbackStep32Boundary() {
    config();
    const currentState = state();
    const boundary = currentState.step32Boundary;
    if (!boundary || !(boundary.revisions || []).length || !(boundary.stateFields)) {
      Q.fail("step 32 replay boundary is not staged.");
    }
    assertControls(currentState);

    for (const scope of SCOPES) {
      restoreDocuments(
        Q.collection("helpCenterRevisions"),
        scope.selector,
        (boundary.revisions || []).filter(row => Object.entries(scope.selector).every(
          ([key, value]) => Q.text(row && row[key]) === Q.text(value)
        ))
      );
    }
    const currentAuditIds = newAudits(currentState).map(row => row._id);
    if (currentAuditIds.length > 0) {
      Q.collection("helpCenterAudit").deleteMany({ _id: { $in: currentAuditIds } });
    }
    if ((boundary.audits || []).length > 0) {
      Q.collection("helpCenterAudit").insertMany(clone(boundary.audits));
    }
    restoreDocuments(
      Q.collection("privacyConsents"),
      { userId: { $in: CONSENT_USER_IDS } },
      boundary.consents
    );
    restoreDocuments(
      Q.collection("ideaPosts"),
      { _id: { $in: ARTICLE_IDS } },
      boundary.articles
    );
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: STATE_ID },
      {
        $set: clone(boundary.stateFields),
        $unset: clearPostStep32State()
      }
    );

    const restoredState = state();
    assertPrivacyActiveState(restoredState);
    if (!sameDomain(ideaCounts(), boundary.ideaCounts)) {
      Q.fail("step 32 rollback did not restore the exact Article bucket counts.");
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "privacy-active",
      replayBoundary: "step-32-ready",
      restoredAtIso: Q.nowIso(),
      exactAuditCount: newAudits(restoredState).length,
      exactConsentCount: actorConsents().length,
      exactRevisionCount: controlledRevisions().length,
      articleStateRestored: true,
      unrelatedControlsStable: true,
      next: "Continue at checklist step 32."
    });
  }

  function verifyPrivacyFallback() {
    config();
    const currentState = state();
    requirePhase(currentState, "privacy-active");
    assertContentAfterFallback(currentState);

    const consents = actorConsents();
    const baselineIds = assertBaselineConsentsPreserved(currentState, consents);
    const kaiV3 = consents.find(value => Q.text(value._id) === Q.text(currentState.kaiV3ConsentId));
    if (!assertConsent(kaiV3, KAI_ID, Q.text(currentState.privacyV3Id), 3)
        || unexpectedKaiRileyConsents(consents, [...baselineIds, kaiV3 && kaiV3._id]).length !== 0) {
      Q.fail("fallback rewrote or deleted a controlled historical consent.");
    }
    if (!sameDomain(controlledArticles(), currentState.baselineArticles)
        || !sameDomain(ideaCounts(), currentState.baselineIdeaCounts)) {
      Q.fail("Content revision deletion changed the Article branch.");
    }
    assertControls(currentState);

    const audits = newAudits(currentState);
    const helpV2Snapshot = (currentState.draftsSavedRevisions || []).find(row => Q.text(row._id) === Q.text(currentState.helpV2Id));
    const privacyV3Snapshot = (currentState.draftsSavedRevisions || []).find(row => Q.text(row._id) === Q.text(currentState.privacyV3Id));
    if (audits.length !== 7
        || !auditMatches(audits, helpV2Snapshot, "delete", "Deleted v2.")
        || !auditMatches(audits, privacyV3Snapshot, "delete", "Deleted v3.")) {
      Q.fail("fallback branch does not contain exactly the expected Help v2 and Privacy v3 delete audits.");
    }
    const capturedAtIso = Q.nowIso();
    const fallbackRevisions = controlledRevisions();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: STATE_ID },
      { $set: { phase: "privacy-fallback", privacyFallbackAtIso: capturedAtIso, fallbackRevisions } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "privacy-fallback",
      capturedAtIso,
      activePrivacyRevisionId: PRIVACY_V2_ID,
      deletedRevisionIds: [Q.text(currentState.helpV2Id), Q.text(currentState.privacyV3Id)],
      historicalKaiV3ConsentRetained: true,
      exactAuditCount: 7,
      next: "Move only the controlled published Article to trash, then run verify-article-trashed."
    });
  }

  function assertFallbackBranchStable(currentState) {
    assertContentAfterFallback(currentState);
    if (!sameDomain(controlledRevisions(), currentState.fallbackRevisions)) {
      Q.fail("the verified governed-content fallback branch changed during Article lifecycle actions.");
    }
    const consents = actorConsents();
    const baselineIds = assertBaselineConsentsPreserved(currentState, consents);
    const kaiV3 = consents.find(value => Q.text(value._id) === Q.text(currentState.kaiV3ConsentId));
    if (!assertConsent(kaiV3, KAI_ID, Q.text(currentState.privacyV3Id), 3)
        || unexpectedKaiRileyConsents(consents, [...baselineIds, kaiV3 && kaiV3._id]).length !== 0) {
      Q.fail("the verified consent branch changed during Article lifecycle actions.");
    }
    if (newAudits(currentState).length !== 7) {
      Q.fail("an Article lifecycle action created an unexpected governed-content audit.");
    }
  }

  function verifyArticleTrashed() {
    config();
    const currentState = state();
    requirePhase(currentState, "privacy-fallback");
    assertFallbackBranchStable(currentState);
    const target = Q.collection("ideaPosts").findOne({ _id: ARTICLE_ID });
    const baselineTarget = (currentState.baselineArticles || []).find(value => Q.text(value._id) === ARTICLE_ID);
    const control = Q.collection("ideaPosts").findOne({ _id: FEATURED_CONTROL_ID });
    const baselineControl = (currentState.baselineArticles || []).find(value => Q.text(value._id) === FEATURED_CONTROL_ID);
    assertStableArticleIdentity(target, baselineTarget);
    if (!target || target.trashed !== true || target.published !== false || target.featured !== false
        || !Q.text(target.trashedAtIso) || Q.text(target.trashedByUserId) !== AVA_ID
        || Q.text(target.updatedUser) !== AVA_ID) {
      Q.fail("target Article is not exactly soft-deleted, unpublished and unfeatured by Ava.");
    }
    if (!sameDomain(control, baselineControl)) Q.fail("Featured Control changed during target trash.");
    const expectedCounts = {
      ...currentState.baselineIdeaCounts,
      all: Q.number(currentState.baselineIdeaCounts.all) - 1,
      published: Q.number(currentState.baselineIdeaCounts.published) - 1,
      trashed: Q.number(currentState.baselineIdeaCounts.trashed) + 1
    };
    if (!sameDomain(ideaCounts(), expectedCounts)) Q.fail("Article trash bucket counts did not change exactly once.");
    assertControls(currentState);
    const capturedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: STATE_ID },
      { $set: { phase: "article-trashed", articleTrashedAtIso: capturedAtIso, trashedArticle: target } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "article-trashed",
      capturedAtIso,
      articleId: ARTICLE_ID,
      ideaCounts: expectedCounts,
      stableIdentityContentAndManagedImages: true,
      featuredControlStable: true,
      next: "Restore only the controlled Article as Draft, then run verify-article-restored."
    });
  }

  function verifyArticleRestored() {
    config();
    const currentState = state();
    requirePhase(currentState, "article-trashed");
    assertFallbackBranchStable(currentState);
    const target = Q.collection("ideaPosts").findOne({ _id: ARTICLE_ID });
    const baselineTarget = (currentState.baselineArticles || []).find(value => Q.text(value._id) === ARTICLE_ID);
    const control = Q.collection("ideaPosts").findOne({ _id: FEATURED_CONTROL_ID });
    const baselineControl = (currentState.baselineArticles || []).find(value => Q.text(value._id) === FEATURED_CONTROL_ID);
    assertStableArticleIdentity(target, baselineTarget);
    if (!target || target.trashed !== false || target.published !== false || target.featured !== false
        || Q.text(target.trashedAtIso) || Q.text(target.trashedByUserId)
        || Q.text(target.updatedUser) !== AVA_ID) {
      Q.fail("restored Article is not exactly an untrashed, unpublished and unfeatured Draft.");
    }
    if (!sameDomain(control, baselineControl)) Q.fail("Featured Control changed during target restore.");
    const expectedCounts = {
      ...currentState.baselineIdeaCounts,
      published: Q.number(currentState.baselineIdeaCounts.published) - 1,
      drafts: Q.number(currentState.baselineIdeaCounts.drafts) + 1
    };
    if (!sameDomain(ideaCounts(), expectedCounts)) Q.fail("Article restore bucket counts did not change exactly once.");
    assertControls(currentState);
    const capturedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: STATE_ID },
      { $set: { phase: "article-restored", articleRestoredAtIso: capturedAtIso, restoredArticle: target } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "article-restored",
      capturedAtIso,
      articleId: ARTICLE_ID,
      ideaCounts: expectedCounts,
      publicInclusionExpected: false,
      stableIdentityContentAndManagedImages: true,
      next: "Publish the restored Draft once, then run verify-article-republished."
    });
  }

  function rollbackStep59Boundary() {
    config();
    const currentState = state();
    assertContentAfterFallback(currentState);
    if (!sameDomain(controlledRevisions(), currentState.fallbackRevisions)) {
      Q.fail("the verified governed-content fallback branch changed before the step 59 rollback.");
    }
    const consents = actorConsents();
    const baselineConsentIds = assertBaselineConsentsPreserved(currentState, consents);
    const kaiV3 = consents.find(value => Q.text(value._id) === Q.text(currentState.kaiV3ConsentId));
    if (!assertConsent(kaiV3, KAI_ID, Q.text(currentState.privacyV3Id), 3)
        || unexpectedKaiRileyConsents(consents, [...baselineConsentIds, kaiV3 && kaiV3._id]).length !== 0
        || newAudits(currentState).length !== 7) {
      Q.fail("the verified consent or audit branch changed before the step 59 rollback.");
    }

    const baselineArticles = [
      ...(currentState.unrelatedIdeas || []),
      ...(currentState.baselineArticles || [])
    ];
    const baselineById = new Map(baselineArticles.map(row => [Q.text(row._id), row]));
    const currentArticles = Q.collection("ideaPosts").find({}).sort({ _id: 1 }).toArray();
    const currentIds = sorted(currentArticles.map(row => row._id));
    const baselineIds = sorted(baselineArticles.map(row => row._id));
    if (!sameDomain(currentIds, baselineIds)) {
      Q.fail("step 59 rollback refuses to add or remove Article records.");
    }
    for (const article of currentArticles) {
      const id = Q.text(article._id);
      const baseline = baselineById.get(id);
      if (!STEP_59_EXPLORATORY_ARTICLE_IDS.includes(id) && !sameDomain(article, baseline)) {
        Q.fail(`step 59 rollback found an unexpected changed Article '${id}'.`);
      }
    }
    for (const id of STEP_59_EXPLORATORY_ARTICLE_IDS) {
      if (!baselineById.has(id)) {
        Q.fail(`step 59 rollback baseline is missing Article '${id}'.`);
      }
    }

    const restoredAtIso = Q.nowIso();
    for (const id of STEP_59_EXPLORATORY_ARTICLE_IDS.filter(value => value !== ARTICLE_ID)) {
      Q.collection("ideaPosts").replaceOne({ _id: id }, clone(baselineById.get(id)));
    }
    const restoredDraft = clone(baselineById.get(ARTICLE_ID));
    restoredDraft.published = false;
    restoredDraft.featured = false;
    restoredDraft.trashed = false;
    restoredDraft.trashedAtIso = null;
    restoredDraft.trashedByUserId = null;
    restoredDraft.updatedDate = restoredAtIso;
    restoredDraft.updatedUser = AVA_ID;
    Q.collection("ideaPosts").replaceOne({ _id: ARTICLE_ID }, restoredDraft);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: STATE_ID },
      {
        $set: {
          phase: "article-restored",
          articleRestoredAtIso: restoredAtIso,
          restoredArticle: restoredDraft,
          step59Boundary: {
            capturedAtIso: restoredAtIso,
            article: restoredDraft,
            ideaCounts: {
              ...currentState.baselineIdeaCounts,
              published: Q.number(currentState.baselineIdeaCounts.published) - 1,
              drafts: Q.number(currentState.baselineIdeaCounts.drafts) + 1
            }
          }
        },
        $unset: {
          articleTrashedAtIso: "",
          trashedArticle: "",
          verifiedAtIso: "",
          republishedArticle: ""
        }
      }
    );

    const restoredState = state();
    assertFallbackBranchStable(restoredState);
    const target = Q.collection("ideaPosts").findOne({ _id: ARTICLE_ID });
    const baselineTarget = baselineById.get(ARTICLE_ID);
    assertStableArticleIdentity(target, baselineTarget);
    if (!target || target.trashed !== false || target.published !== false || target.featured !== false
        || Q.text(target.trashedAtIso) || Q.text(target.trashedByUserId)
        || Q.text(target.updatedUser) !== AVA_ID) {
      Q.fail("step 59 rollback did not restore the target as an exact Draft.");
    }
    if (!sameDomain(ideaCounts(), restoredState.step59Boundary.ideaCounts)) {
      Q.fail("step 59 rollback did not restore the exact Draft bucket counts.");
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "article-restored",
      replayBoundary: "step-59-ready",
      restoredAtIso,
      articleId: ARTICLE_ID,
      stableContentKey: Q.text(target.contentKey),
      stableContentHtml: Q.text(target.contentHtml),
      controlsRestored: STEP_59_EXPLORATORY_ARTICLE_IDS.filter(id => id !== ARTICLE_ID),
      ideaCounts: restoredState.step59Boundary.ideaCounts,
      browserAction: "Reload Ava once, then continue at checklist step 59; do not relaunch browsers.",
      next: "Publish only the controlled Draft once, then run verify-article-republished."
    });
  }

  function verifyArticleRepublished() {
    config();
    const currentState = state();
    requirePhase(currentState, "article-restored");
    assertFallbackBranchStable(currentState);
    const target = Q.collection("ideaPosts").findOne({ _id: ARTICLE_ID });
    const baselineTarget = (currentState.baselineArticles || []).find(value => Q.text(value._id) === ARTICLE_ID);
    const control = Q.collection("ideaPosts").findOne({ _id: FEATURED_CONTROL_ID });
    const baselineControl = (currentState.baselineArticles || []).find(value => Q.text(value._id) === FEATURED_CONTROL_ID);
    assertStableArticleIdentity(target, baselineTarget);
    if (!target || target.trashed !== false || target.published !== true || target.featured !== false
        || Q.text(target.trashedAtIso) || Q.text(target.trashedByUserId)
        || Q.text(target.updatedUser) !== AVA_ID) {
      Q.fail("republished Article did not return to its exact published, non-featured lifecycle state.");
    }
    if (!sameDomain(control, baselineControl)) Q.fail("Featured Control changed during target republish.");
    if (!sameDomain(ideaCounts(), currentState.baselineIdeaCounts)) {
      Q.fail("Article bucket counts did not return exactly to the staged baseline.");
    }
    assertControls(currentState);
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: STATE_ID },
      { $set: { phase: "article-republished", verifiedAtIso, republishedArticle: target } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "article-republished",
      verifiedAtIso,
      articleId: ARTICLE_ID,
      ideaCounts: currentState.baselineIdeaCounts,
      exactGovernedContentAudits: 7,
      kaiV3ConsentRetained: true,
      rileyV3ConsentAbsent: true,
      stableIdentityContentAndManagedImages: true,
      allNegativeControlsStable: true,
      next: "Record the manual verdict and evidence, then run reset content-admin CONTENT-ADMIN-LIFECYCLE-001."
    });
  }

  function reset() {
    config();
    const currentState = state();
    const expectedRevisionIds = new Set(sorted(currentState.controlledRevisionIds || BASELINE_REVISION_IDS));
    const unexpectedRevisionIds = controlledRevisions()
      .map(row => Q.text(row._id))
      .filter(id => !expectedRevisionIds.has(id));
    if (unexpectedRevisionIds.length > 0) {
      Q.fail(`refusing reset after unexpected controlled-scope revisions appeared: ${unexpectedRevisionIds.join(", ")}.`);
    }
    const unexpectedConsentIds = actorConsents()
      .filter(row => Q.text(row.userId) !== AVA_ID)
      .map(row => Q.text(row._id))
      .filter(id => !sorted([
        ...(currentState.baselineConsents || []).map(value => value._id),
        currentState.kaiV3ConsentId
      ]).includes(id));
    if (unexpectedConsentIds.length > 0) {
      Q.fail(`refusing reset after unexpected controlled-user consents appeared: ${unexpectedConsentIds.join(", ")}.`);
    }
    const articleRows = controlledArticles();
    if (articleRows.some(row => !ARTICLE_IDS.includes(Q.text(row._id)))) {
      Q.fail("refusing reset after an unexpected controlled Article appeared.");
    }

    Q.restoreSnapshots(currentState.originalSnapshots || []);
    const restoredAtIso = Q.nowIso();
    assertUsers();
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: STATE_ID });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      restoredAtIso,
      restoredScopes: SCOPES.map(scope => scope.key),
      restoredConsentUsers: CONSENT_USER_IDS,
      restoredArticleIds: ARTICLE_IDS,
      retainedFixtureArtifacts: false,
      next: `Run status ${SCENARIO} ${checkpointId}; expected phase is not-staged.`
    });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stage(); break;
    case "status": status(); break;
    case "verify-drafts-saved": verifyDraftsSaved(); break;
    case "verify-privacy-active": verifyPrivacyActive(); break;
    case "restage-step-32-boundary": restageStep32Boundary(); break;
    case "rollback-step-32-boundary": rollbackStep32Boundary(); break;
    case "verify-privacy-fallback": verifyPrivacyFallback(); break;
    case "verify-article-trashed": verifyArticleTrashed(); break;
    case "verify-article-restored": verifyArticleRestored(); break;
    case "rollback-step-59-boundary": rollbackStep59Boundary(); break;
    case "verify-article-republished": verifyArticleRepublished(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
