/* global ManualQa, db, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "asset-domain";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();
  const hostUserId = Q.text(process.env.MANUAL_QA_CREATOR_USER_ID)
    || "650000000000000000000061";
  const participantUserId = Q.text(process.env.MANUAL_QA_INVITEE_USER_ID)
    || "650000000000000000000062";
  const thirdUserId = "650000000000000000000063";
  const PREFIX = "manual-qa-checkpoint:v1:asset-domain";
  const PRIMARY_ASSET_ID = `${PREFIX}:asset:primary`;
  const SECONDARY_ASSET_ID = `${PREFIX}:asset:secondary`;
  const EVENT_ID = `${PREFIX}:event`;
  const SUB_EVENT_ID = `${EVENT_ID}:sub-event:transport`;
  const IDS = [PRIMARY_ASSET_ID, SECONDARY_ASSET_ID, EVENT_ID];
  const LIFE_CHECKPOINT = "ASSET-LIFE-001";
  const VISIBILITY_CHECKPOINT = "ASSET-VIS-001";
  const VISIBILITY_FRIEND_USER_ID = "178e8d0cbe164fa3fede5884";
  const VISIBILITY_UNRELATED_USER_ID = "2d520f3c98b0440c1556f4af";
  const VISIBILITY_EVENT_ID = `${PREFIX}:visibility:event`;
  const VISIBILITY_SUB_EVENT_ID = `${VISIBILITY_EVENT_ID}:sub-event:transport`;
  const VISIBILITY_EDITED_VISIBILITY = "Invitation only";
  const VISIBILITY_FIXTURE_SCHEMA_VERSION = 2;
  const VISIBILITY_ASSETS = {
    public: {
      assetId: `${PREFIX}:asset:visibility:public`,
      title: "QA ASSET-VIS-001 Public Transport",
      visibility: "Public"
    },
    friends: {
      assetId: `${PREFIX}:asset:visibility:friends`,
      title: "QA ASSET-VIS-001 Friends Transport",
      visibility: "Friends only"
    },
    invitation: {
      assetId: `${PREFIX}:asset:visibility:invitation`,
      title: "QA ASSET-VIS-001 Invitation Transport",
      visibility: "Invitation only"
    }
  };
  const VISIBILITY_ASSET_IDS = Object.values(VISIBILITY_ASSETS).map(value => value.assetId);
  const VISIBILITY_TITLES = Object.values(VISIBILITY_ASSETS).map(value => value.title);
  const LIFE_INITIAL_SUBTITLE = "Initial shared-field value";
  const LIFE_EDITED_SUBTITLE = "Edited shared-field value";
  const LIFE_ASSETS = {
    Transport: {
      title: "QA ASSET-LIFE-001 Transport",
      category: "Sedan",
      capacityTotal: 4,
      quantity: 2,
      details: "Manual QA Transport lifecycle control.",
      sourceLink: "https://example.com/qa/asset-life-001/transport"
    },
    Accommodation: {
      title: "QA ASSET-LIFE-001 Accommodation",
      category: "Apartment",
      capacityTotal: 6,
      quantity: 3,
      details: "Manual QA Accommodation lifecycle control.",
      sourceLink: "https://example.com/qa/asset-life-001/accommodation"
    },
    Supplies: {
      title: "QA ASSET-LIFE-001 Supplies",
      category: "Safety",
      capacityTotal: 12,
      quantity: 8,
      details: "Manual QA Supplies lifecycle control.",
      sourceLink: "https://example.com/qa/asset-life-001/supplies"
    }
  };
  const LIFE_TITLES = Object.values(LIFE_ASSETS).map(value => value.title);

  const CHECKPOINTS = {
    [LIFE_CHECKPOINT]: {
      stage: "lifecycle-empty",
      why: "Prove all three Asset type schemas, managed media, one shared-field edit and terminal Transport deletion in one bounded lifecycle.",
      action: "As Casey, create the three named Asset controls exactly once through the normal Asset editors, then stop at the Create phrase in the checklist.",
      expected: "One active Transport, Accommodation and Supplies record exists with distinct stable IDs and exact type fields; the shared media path is proven on Transport and every supplied image URL is managed; each Save-confirmed type counter increases immediately and exactly once.",
      worker: "MUST NOT use a scheduler. Ordinary direct writes and the existing affinity projection may run; no fixture command may fabricate a lifecycle transition."
    },
    [VISIBILITY_CHECKPOINT]: {
      stage: "visibility-edit",
      why: "Prove owner, deterministic friend and unrelated-user Asset discovery boundaries, category filtering and reload reconstruction after one owner visibility edit.",
      action: "Compare the baseline target sets, exercise the Transport category filter, then change only the Public control to Invitation only as Casey and compare the reloaded three-user matrix.",
      expected: "Baseline: Casey owns all three and explores none, Lina explores Public plus Friends, and Liam explores Public only. After the Public control becomes Invitation only, Lina explores Friends only and Liam explores no target; denied detail reads expose no hidden data.",
      worker: "MUST NOT manually trigger a scheduler. List/detail/filter reads are side-effect free; exactly one normal owner visibility Save and its ordinary Asset affinity-recompute task are allowed. No borrow, member, assignment, outbox or notification write is allowed."
    },
    "ASSET-MEMBER-001": {
      stage: "member-empty",
      why: "Prove that an Asset Members invitation creates one asset-scoped pending identity and never an event membership.",
      action: "As the asset owner, open Manual QA Primary Transport, invite the staged participant once and save once.",
      expected: "One pending asset member and one recipient invitation identify the same asset, owner, inviter and participant; no event member is created.",
      worker: "MUST NOT use a scheduler. A direct notification outbox item is conditional."
    },
    "ASSET-MEMBER-002": {
      stage: "member-two-pending",
      why: "Prove accepted and rejected asset invitations independently while preserving event-role isolation.",
      action: "As the participant, accept the Primary Transport invitation. As the third user, reject the Secondary Transport invitation. Reopen both asset member lists.",
      expected: "Primary has one accepted member; Secondary has no live pending/accepted row for the rejected user; neither user becomes Event Admin.",
      worker: "MUST NOT use a scheduler. Direct membership/outbox effects are conditional and must remain exact-once."
    },
    "ASSET-ASSIGN-001": {
      stage: "assignment-empty",
      why: "Prove that one accepted participant-owned asset can be assigned to exactly one event sub-event with consistent capacity and identity.",
      action: "As event host, open Manual QA Asset Assignment Event, edit the Transport sub-event resources and assign Manual QA Primary Transport once with capacity 4.",
      expected: "Event Resources and the persisted record agree on event, sub-event, asset owner, asset ID and capacity; event and asset membership counts do not duplicate.",
      worker: "MUST NOT use a scheduler unless the UI explicitly reports a named availability consumer; direct resource recompute/outbox effects are conditional."
    }
  };

  function config() {
    const value = CHECKPOINTS[checkpointId];
    if (!value) Q.fail(`unsupported asset-domain checkpoint '${checkpointId}'.`);
    return value;
  }

  function dateIso(offsetMinutes) {
    return new Date(Date.now() + offsetMinutes * 60000).toISOString();
  }

  function disabledAssetPricingDocument() {
    return {
      mode: "fixed",
      basePrice: 0,
      currency: "USD",
      taxMode: "excluded",
      chargeType: "per_attendee",
      quantityRulesEnabled: false,
      quantityRules: [],
      rounding: "none",
      demandRulesEnabled: false,
      demandRules: [],
      timeRulesEnabled: false,
      timeRules: [],
      cancellationPolicy: {
        enabled: false,
        rules: []
      },
      slotPricingEnabled: false,
      slotOverrides: [],
      audience: {
        enabled: false,
        promoCodes: [],
        soldOutLabel: "Show \"Sold Out\""
      },
      enabled: false
    };
  }

  function assetDocument(assetId, ownerUserId, title) {
    const now = Q.nowIso();
    return {
      _id: assetId,
      _class: "com.raxim.myscoutee.profile.data.document.Asset",
      syncKey: assetId,
      assetId,
      ownerUserId,
      type: "Transport",
      title,
      subtitle: "Manual QA controlled transport",
      category: "Transport",
      city: "Austin",
      capacityTotal: 4,
      quantity: 1,
      details: "Controlled manual-QA asset",
      imageUrl: "",
      sourceLink: "",
      routes: ["Austin"],
      policiesEnabled: false,
      policies: [],
      pricing: disabledAssetPricingDocument(),
      requests: [],
      visibility: "Public",
      status: "A",
      createdDate: now,
      createdUser: ownerUserId,
      updatedDate: now,
      updatedUser: ownerUserId
    };
  }

  function visibilityAssetDocument(definition) {
    const document = assetDocument(definition.assetId, hostUserId, definition.title);
    document.subtitle = `${definition.visibility} discovery control`;
    document.category = "Sedan";
    document.city = "";
    document.details = `Manual QA ${definition.visibility} Asset visibility control.`;
    document.routes = [];
    document.sourceLink = `https://example.com/qa/asset-vis-001/${definition.visibility.toLowerCase().replaceAll(" ", "-")}`;
    document.visibility = definition.visibility;
    return document;
  }

  function visibilityEventDocument() {
    const now = Q.nowIso();
    const subEvent = {
      id: VISIBILITY_SUB_EVENT_ID,
      name: "QA Visibility Stage",
      description: "Read-only Transport Explore scaffold",
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: 60,
      optional: false,
      capacityMin: 1,
      capacityMax: 3
    };
    return {
      _id: VISIBILITY_EVENT_ID,
      sourceId: VISIBILITY_EVENT_ID,
      syncKey: VISIBILITY_EVENT_ID,
      title: "QA ASSET-VIS-001 Event",
      subtitle: "Read-only Asset Explore scaffold",
      status: "A",
      published: true,
      isTrashed: false,
      ownerUserId: hostUserId,
      creatorUserId: hostUserId,
      admins: [hostUserId],
      visibility: "public",
      mode: "Casual",
      subEventsEnabled: true,
      subEventDefinitions: [subEvent],
      subEvents: [subEvent],
      capacityTotal: 3,
      acceptedMembers: 3,
      pendingMembers: 0,
      acceptedMemberUserIds: [hostUserId, VISIBILITY_FRIEND_USER_ID, VISIBILITY_UNRELATED_USER_ID],
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      startAtIso: dateIso(180),
      endAtIso: dateIso(300),
      createdDate: now,
      createdUser: hostUserId,
      updatedDate: now,
      updatedUser: hostUserId
    };
  }

  function visibilityEventMemberDocument(userId, role) {
    const document = eventMemberDocument(userId, role);
    document._id = `${PREFIX}:visibility:event-member:${userId}`;
    document.syncKey = document._id;
    document.ownerId = VISIBILITY_EVENT_ID;
    document.metWhere = "QA ASSET-VIS-001 Event";
    return document;
  }

  function memberDocument(assetId, userId, status, invitedByUserId = hostUserId) {
    const now = Q.nowIso();
    const id = `${PREFIX}:member:${assetId.split(":").pop()}:${userId}`;
    return {
      _id: id,
      syncKey: id,
      ownerType: "asset",
      ownerId: assetId,
      userId,
      role: "Member",
      status,
      pendingSource: status === "pending" ? "admin" : null,
      requestKind: status === "pending" ? "invite" : null,
      invitedByUserId: status === "pending" ? invitedByUserId : null,
      metAtIso: now,
      actionAtIso: now,
      metWhere: "Manual QA Asset Members",
      createdDate: now,
      createdUser: hostUserId,
      updatedDate: now,
      updatedUser: hostUserId
    };
  }

  function eventDocument() {
    const now = Q.nowIso();
    const subEvent = {
      id: SUB_EVENT_ID,
      name: "Transport",
      description: "Manual QA transport resource",
      timing: "During",
      offsetMinutes: 0,
      durationMinutes: 60,
      optional: false,
      capacityMin: 1,
      capacityMax: 4
    };
    return {
      _id: EVENT_ID,
      sourceId: EVENT_ID,
      syncKey: EVENT_ID,
      title: "Manual QA Asset Assignment Event",
      subtitle: "Controlled event-resource checkpoint",
      status: "A",
      published: true,
      isTrashed: false,
      ownerUserId: hostUserId,
      creatorUserId: hostUserId,
      admins: [hostUserId],
      visibility: "public",
      mode: "Casual",
      subEventsEnabled: true,
      subEventDefinitions: [subEvent],
      subEvents: [subEvent],
      acceptedMembers: 1,
      pendingMembers: 0,
      acceptedMemberUserIds: [participantUserId],
      pendingMemberUserIds: [],
      invitedMemberUserIds: [],
      startAtIso: dateIso(180),
      endAtIso: dateIso(300),
      createdDate: now,
      createdUser: hostUserId,
      updatedDate: now,
      updatedUser: hostUserId
    };
  }

  function eventMemberDocument(userId, role) {
    const now = Q.nowIso();
    const id = `${PREFIX}:event-member:${userId}`;
    return {
      _id: id,
      syncKey: id,
      ownerType: "event",
      ownerId: EVENT_ID,
      userId,
      role,
      status: "accepted",
      pendingSource: null,
      requestKind: null,
      invitedByUserId: null,
      actionAtIso: now,
      createdDate: now,
      createdUser: hostUserId,
      updatedDate: now,
      updatedUser: hostUserId
    };
  }

  function lifecycleAssetSelector() {
    return {
      ownerUserId: hostUserId,
      title: { $in: LIFE_TITLES }
    };
  }

  function lifecycleDocuments() {
    return Q.collection("assets")
      .find(lifecycleAssetSelector())
      .sort({ type: 1, assetId: 1 })
      .toArray();
  }

  function lifecycleStatusCode(value) {
    const normalized = Q.text(value).toLowerCase();
    switch (normalized) {
      case "active": return "A";
      case "under-review":
      case "under review": return "UR";
      case "blocked": return "B";
      case "deleted": return "D";
      case "inactive": return "I";
      case "trashed":
      case "trash": return "T";
      default: return Q.text(value) || "A";
    }
  }

  function lifecycleAuthoritativeCounts() {
    const counts = { Transport: 0, Accommodation: 0, Supplies: 0, Trash: 0 };
    const suppressed = new Set(["UR", "B", "D", "I", "T"]);
    const assets = Q.collection("assets").find({ ownerUserId: hostUserId }).toArray();
    for (const asset of assets) {
      const status = lifecycleStatusCode(asset.status);
      if (status === "T") counts.Trash += 1;
      if (!suppressed.has(status) && Object.prototype.hasOwnProperty.call(counts, Q.text(asset.type))) {
        counts[Q.text(asset.type)] += 1;
      }
    }
    return counts;
  }

  function lifecycleStoredCounters() {
    const user = Q.ensureUser(hostUserId, "Asset lifecycle owner");
    const activities = user.activities || {};
    const nested = activities.asset || {};
    return {
      legacy: {
        Transport: Q.number(activities.cars),
        Accommodation: Q.number(activities.accommodation),
        Supplies: Q.number(activities.supplies)
      },
      nested: {
        Transport: Q.number(nested.cars),
        Accommodation: Q.number(nested.accommodation),
        Supplies: Q.number(nested.supplies)
      }
    };
  }

  function assertLifecycleCounts(expected, label, options = {}) {
    const authoritative = lifecycleAuthoritativeCounts();
    const stored = lifecycleStoredCounters();
    const allowExternalAssets = options.allowExternalAssets === true;
    for (const type of ["Transport", "Accommodation", "Supplies"]) {
      const authoritativeMismatch = allowExternalAssets
        ? authoritative[type] < expected[type]
        : authoritative[type] !== expected[type];
      if (authoritativeMismatch) {
        const matchingAssets = Q.collection("assets")
          .find({ ownerUserId: hostUserId, type })
          .toArray()
          .map(asset => ({
            assetId: Q.text(asset.assetId),
            title: Q.text(asset.title),
            status: lifecycleStatusCode(asset.status)
        }));
        const expectation = allowExternalAssets ? `at least ${expected[type]}` : `${expected[type]}`;
        Q.fail(`${label}: authoritative ${type} count is ${authoritative[type]}, expected ${expectation}; matching documents=${JSON.stringify(matchingAssets)}.`);
      }
      if (stored.legacy[type] !== authoritative[type] || stored.nested[type] !== authoritative[type]) {
        Q.fail(`${label}: stored ${type} counters are legacy=${stored.legacy[type]}, nested=${stored.nested[type]}, authoritative=${authoritative[type]}.`);
      }
    }
    const trashMismatch = allowExternalAssets
      ? authoritative.Trash < expected.Trash
      : authoritative.Trash !== expected.Trash;
    if (trashMismatch) {
      const expectation = allowExternalAssets ? `at least ${expected.Trash}` : `${expected.Trash}`;
      Q.fail(`${label}: authoritative Trash count is ${authoritative.Trash}, expected ${expectation}.`);
    }
    return { authoritative, stored };
  }

  function lifecycleExpectedCounts(state, phase) {
    const baseline = state.baselineCounts;
    const allActive = phase === "created" || phase === "edited";
    return {
      Transport: baseline.Transport + (allActive ? 1 : 0),
      Accommodation: baseline.Accommodation + (phase === "baseline-ready" ? 0 : 1),
      Supplies: baseline.Supplies + (phase === "baseline-ready" ? 0 : 1),
      Trash: baseline.Trash + (phase === "deleted" ? 1 : 0)
    };
  }

  function isManagedImageUrl(value) {
    const imageUrl = Q.text(value);
    if (!imageUrl.includes("/media/public?key=")) return false;
    try {
      return decodeURIComponent(imageUrl).endsWith("/large.webp");
    } catch (_error) {
      return false;
    }
  }

  function lifecycleAssetMap(expectedCount = 3) {
    const documents = lifecycleDocuments();
    if (documents.length !== expectedCount) {
      Q.fail(`ASSET-LIFE-001 expected ${expectedCount} named Asset documents, found ${documents.length}.`);
    }
    const result = {};
    for (const asset of documents) {
      const type = Q.text(asset.type);
      if (!Object.prototype.hasOwnProperty.call(LIFE_ASSETS, type)) {
        Q.fail(`ASSET-LIFE-001 found unexpected Asset type '${type}'.`);
      }
      if (result[type]) Q.fail(`ASSET-LIFE-001 found duplicate '${type}' controls.`);
      result[type] = asset;
    }
    for (const type of Object.keys(LIFE_ASSETS)) {
      if (!result[type]) Q.fail(`ASSET-LIFE-001 is missing its '${type}' control.`);
    }
    const logicalIds = Object.values(result).map(asset => Q.text(asset.assetId));
    const mongoIds = Object.values(result).map(asset => Q.text(asset._id));
    const syncKeys = Object.values(result).map(asset => Q.text(asset.syncKey));
    for (const [label, values] of [["assetId", logicalIds], ["Mongo _id", mongoIds], ["syncKey", syncKeys]]) {
      if (values.some(value => !value) || new Set(values).size !== 3) {
        Q.fail(`ASSET-LIFE-001 requires three non-empty, distinct ${label} values.`);
      }
    }
    return result;
  }

  function assertLifecycleAsset(asset, type, subtitle, status) {
    const expected = LIFE_ASSETS[type];
    const routes = Array.isArray(asset.routes)
      ? asset.routes.map(value => Q.text(value)).filter(Boolean)
      : [];
    const requests = Array.isArray(asset.requests) ? asset.requests : [];
    const policies = Array.isArray(asset.policies) ? asset.policies : [];
    const topics = Array.isArray(asset.topics) ? asset.topics : [];
    if (Q.text(asset.ownerUserId) !== hostUserId
        || Q.text(asset.type) !== type
        || Q.text(asset.title) !== expected.title
        || Q.text(asset.subtitle) !== subtitle
        || Q.text(asset.category) !== expected.category
        || Q.number(asset.capacityTotal) !== expected.capacityTotal
        || Q.number(asset.quantity) !== expected.quantity
        || Q.text(asset.details) !== expected.details
        || Q.text(asset.sourceLink) !== expected.sourceLink
        || Q.text(asset.visibility) !== "Public"
        || lifecycleStatusCode(asset.status) !== status) {
      Q.fail(`ASSET-LIFE-001 ${type} fields do not match the versioned checklist contract.`);
    }
    if (!Q.text(asset.assetId) || !Q.text(asset._id) || !Q.text(asset.syncKey)
        || !Q.text(asset.createdDate) || !Q.text(asset.createdUser) || !Q.text(asset.updatedDate)
        || Q.text(asset.createdUser) !== hostUserId || Q.text(asset.updatedUser) !== hostUserId) {
      Q.fail(`ASSET-LIFE-001 ${type} identity/audit fields are incomplete.`);
    }
    if (type === "Transport" && !isManagedImageUrl(asset.imageUrl)) {
      Q.fail(`ASSET-LIFE-001 ${type} imageUrl '${Q.text(asset.imageUrl)}' is not a canonical managed large.webp URL.`);
    }
    if (type !== "Transport" && Q.text(asset.imageUrl) && !isManagedImageUrl(asset.imageUrl)) {
      Q.fail(`ASSET-LIFE-001 optional ${type} imageUrl '${Q.text(asset.imageUrl)}' is not a canonical managed large.webp URL.`);
    }
    if (requests.length !== 0 || topics.length !== 0 || asset.policiesEnabled === true || policies.length !== 0) {
      Q.fail(`ASSET-LIFE-001 ${type} unexpectedly contains requests, topics or enabled lending policies.`);
    }
    if (asset.pricing && asset.pricing.enabled === true) {
      Q.fail(`ASSET-LIFE-001 ${type} unexpectedly enabled pricing.`);
    }
    if (type === "Accommodation") {
      if (routes.length !== 1 || !Q.text(asset.city) || Q.text(asset.city) !== routes[0]) {
        Q.fail("ASSET-LIFE-001 Accommodation must persist one required Location identically in city and routes[0].");
      }
    } else if (Q.text(asset.city) || routes.length !== 0) {
      Q.fail(`ASSET-LIFE-001 ${type} must not persist an Accommodation Location.`);
    }
    if (status === "T") {
      if (!Q.text(asset.trashedAtIso) || Q.text(asset.statusBeforeSuppression)) {
        Q.fail("ASSET-LIFE-001 trashed Transport has incomplete or inconsistent suppression markers.");
      }
    } else if (Q.text(asset.trashedAtIso) || Q.text(asset.statusBeforeSuppression)) {
      Q.fail(`ASSET-LIFE-001 active ${type} unexpectedly retains a suppression marker.`);
    }
  }

  function lifecycleStableDomain(asset) {
    return {
      mongoId: Q.text(asset._id),
      syncKey: Q.text(asset.syncKey),
      assetId: Q.text(asset.assetId),
      ownerUserId: Q.text(asset.ownerUserId),
      type: Q.text(asset.type),
      title: Q.text(asset.title),
      subtitle: Q.text(asset.subtitle),
      category: Q.text(asset.category),
      city: Q.text(asset.city),
      capacityTotal: Q.number(asset.capacityTotal),
      quantity: Q.number(asset.quantity),
      details: Q.text(asset.details),
      imageUrl: Q.text(asset.imageUrl),
      sourceLink: Q.text(asset.sourceLink),
      routes: Array.isArray(asset.routes) ? asset.routes.map(value => Q.text(value)).filter(Boolean) : [],
      topics: Array.isArray(asset.topics) ? asset.topics.map(value => Q.text(value)).filter(Boolean) : [],
      policiesEnabled: asset.policiesEnabled === true,
      policies: Array.isArray(asset.policies) ? asset.policies : [],
      pricing: asset.pricing || null,
      requests: Array.isArray(asset.requests) ? asset.requests : [],
      visibility: Q.text(asset.visibility),
      createdDate: Q.text(asset.createdDate),
      createdUser: Q.text(asset.createdUser)
    };
  }

  function assertLifecycleStable(actual, expected, label) {
    if (!Q.sameJson(lifecycleStableDomain(actual), expected)) {
      Q.fail(`ASSET-LIFE-001 ${label} changed outside the permitted lifecycle field.`);
    }
  }

  function assertLifecyclePhase(state, phase) {
    if (Q.text(state.phase) !== phase) {
      Q.fail(`ASSET-LIFE-001 is at phase '${Q.text(state.phase)}', expected '${phase}'.`);
    }
  }

  function assertLifecycleBaseline(state) {
    if (lifecycleDocuments().length !== 0) {
      Q.fail("ASSET-LIFE-001 baseline is not empty; do not delete or overwrite colliding user data.");
    }
    return assertLifecycleCounts(lifecycleExpectedCounts(state, "baseline-ready"), "ASSET-LIFE-001 baseline");
  }

  function assertLifecycleCreated(state, phase = "created", options = {}) {
    const byType = lifecycleAssetMap();
    const transportSubtitle = phase === "created" ? LIFE_INITIAL_SUBTITLE : LIFE_EDITED_SUBTITLE;
    assertLifecycleAsset(byType.Transport, "Transport", transportSubtitle, phase === "deleted" ? "T" : "A");
    assertLifecycleAsset(byType.Accommodation, "Accommodation", LIFE_INITIAL_SUBTITLE, "A");
    assertLifecycleAsset(byType.Supplies, "Supplies", LIFE_INITIAL_SUBTITLE, "A");
    if (state.createdDomains) {
      const expectedTransport = phase === "created"
        ? state.createdDomains.Transport
        : (state.editedTransportDomain || { ...state.createdDomains.Transport, subtitle: LIFE_EDITED_SUBTITLE });
      assertLifecycleStable(byType.Transport, expectedTransport, "Transport identity/schema");
      assertLifecycleStable(byType.Accommodation, state.createdDomains.Accommodation, "Accommodation control");
      assertLifecycleStable(byType.Supplies, state.createdDomains.Supplies, "Supplies control");
    }
    const counts = assertLifecycleCounts(
      lifecycleExpectedCounts(state, phase),
      `ASSET-LIFE-001 ${phase}`,
      options
    );
    return { byType, counts };
  }

  function lifecycleOracle(state) {
    const documents = lifecycleDocuments();
    return {
      checkpointPhase: Q.text(state.phase),
      targetAssets: documents.map(asset => ({
        mongoId: Q.text(asset._id),
        assetId: Q.text(asset.assetId),
        syncKey: Q.text(asset.syncKey),
        type: Q.text(asset.type),
        title: Q.text(asset.title),
        subtitle: Q.text(asset.subtitle),
        category: Q.text(asset.category),
        city: Q.text(asset.city),
        routes: Array.isArray(asset.routes) ? asset.routes.map(value => Q.text(value)).filter(Boolean) : [],
        capacityTotal: Q.number(asset.capacityTotal),
        quantity: Q.number(asset.quantity),
        imageUrl: Q.text(asset.imageUrl),
        status: lifecycleStatusCode(asset.status),
        trashedAtIso: Q.text(asset.trashedAtIso)
      })),
      counts: {
        authoritative: lifecycleAuthoritativeCounts(),
        stored: lifecycleStoredCounters()
      },
      baselineCounts: state.baselineCounts,
      ignoredExternalAssets: Array.isArray(state.ignoredExternalAssets)
        ? state.ignoredExternalAssets
        : []
    };
  }

  function visibilityAssetSelector() {
    return {
      $or: [
        { _id: { $in: VISIBILITY_ASSET_IDS } },
        { assetId: { $in: VISIBILITY_ASSET_IDS } },
        { ownerUserId: hostUserId, title: { $in: VISIBILITY_TITLES } }
      ]
    };
  }

  function visibilityEventSelector() {
    return {
      $or: [
        { _id: VISIBILITY_EVENT_ID },
        { sourceId: VISIBILITY_EVENT_ID },
        { creatorUserId: hostUserId, title: "QA ASSET-VIS-001 Event" }
      ]
    };
  }

  function visibilityDomainSelectors() {
    return [
      { collection: "assets", selector: visibilityAssetSelector() },
      { collection: "events", selector: visibilityEventSelector() },
      { collection: "activityMembers", selector: { ownerId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } } },
      { collection: "assetRequests", selector: { assetId: { $in: VISIBILITY_ASSET_IDS } } },
      { collection: "activityResources", selector: { $or: [
        { ownerId: VISIBILITY_EVENT_ID },
        { "assetAssignmentIds.Transport": { $in: VISIBILITY_ASSET_IDS } }
      ] } },
      { collection: "notificationOutbox", selector: { $or: [
        { entityId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } },
        { "payload.assetId": { $in: VISIBILITY_ASSET_IDS } },
        { "payload.eventId": VISIBILITY_EVENT_ID }
      ] } },
      { collection: "userNotifications", selector: { $or: [
        { sourceId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } },
        { "payload.assetId": { $in: VISIBILITY_ASSET_IDS } },
        { "payload.eventId": VISIBILITY_EVENT_ID }
      ] } },
      { collection: "affinityRecomputeTasks", selector: { targetId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } } }
    ];
  }

  function visibilityRestoreSelectors() {
    return [
      ...visibilityDomainSelectors(),
      { collection: "users", selector: { $or: [
        { _id: { $in: [hostUserId, VISIBILITY_FRIEND_USER_ID, VISIBILITY_UNRELATED_USER_ID] } },
        { userId: { $in: [hostUserId, VISIBILITY_FRIEND_USER_ID, VISIBILITY_UNRELATED_USER_ID] } }
      ] } }
    ];
  }

  function visibilityHashText(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) % 104729;
    }
    return Math.abs(hash);
  }

  function visibilityUsersAreFriends(leftUserId, rightUserId) {
    const firstId = leftUserId.localeCompare(rightUserId) <= 0 ? leftUserId : rightUserId;
    const secondId = leftUserId.localeCompare(rightUserId) <= 0 ? rightUserId : leftUserId;
    return (visibilityHashText(`friend-pair:${firstId}:${secondId}`) % 100) < 32;
  }

  function assertVisibilityActors() {
    const owner = Q.ensureUser(hostUserId, "Asset visibility owner");
    const friend = Q.ensureUser(VISIBILITY_FRIEND_USER_ID, "Asset visibility friend");
    const unrelated = Q.ensureUser(VISIBILITY_UNRELATED_USER_ID, "Asset visibility unrelated control");
    if (!visibilityUsersAreFriends(hostUserId, VISIBILITY_FRIEND_USER_ID)) {
      Q.fail("ASSET-VIS-001 Lina is no longer a deterministic friend of Casey under the product hash contract.");
    }
    if (visibilityUsersAreFriends(hostUserId, VISIBILITY_UNRELATED_USER_ID)) {
      Q.fail("ASSET-VIS-001 Liam is no longer a deterministic non-friend of Casey under the product hash contract.");
    }
    return {
      owner: { userId: hostUserId, name: Q.text(owner.name) },
      friend: { userId: VISIBILITY_FRIEND_USER_ID, name: Q.text(friend.name) },
      unrelated: { userId: VISIBILITY_UNRELATED_USER_ID, name: Q.text(unrelated.name) }
    };
  }

  function visibilityDocuments() {
    return Q.collection("assets")
      .find(visibilityAssetSelector())
      .sort({ assetId: 1 })
      .toArray();
  }

  function visibilityTargetCounters() {
    const user = Q.ensureUser(hostUserId, "Asset visibility owner");
    const activities = user.activities || {};
    const nested = activities.asset || {};
    return {
      legacyTransport: Q.number(activities.cars),
      nestedTransport: Q.number(nested.cars)
    };
  }

  function visibilityExpectedMatrix(phase = "baseline-ready") {
    const publicId = VISIBILITY_ASSETS.public.assetId;
    const friendsId = VISIBILITY_ASSETS.friends.assetId;
    const invitationId = VISIBILITY_ASSETS.invitation.assetId;
    const edited = phase === "visibility-edited";
    return {
      owner: {
        ownedTargetIds: [publicId, friendsId, invitationId],
        exploreTargetIds: [],
        readableDetailIds: [publicId, friendsId, invitationId]
      },
      friend: {
        ownedTargetIds: [],
        exploreTargetIds: edited ? [friendsId] : [publicId, friendsId],
        readableDetailIds: edited ? [friendsId] : [publicId, friendsId],
        deniedDetailIds: edited ? [publicId, invitationId] : [invitationId]
      },
      unrelated: {
        ownedTargetIds: [],
        exploreTargetIds: edited ? [] : [publicId],
        readableDetailIds: edited ? [] : [publicId],
        deniedDetailIds: edited ? [publicId, friendsId, invitationId] : [friendsId, invitationId]
      }
    };
  }

  function assertVisibilityFixture(state, phase = Q.text(state.phase)) {
    const actors = assertVisibilityActors();
    const documents = visibilityDocuments();
    if (documents.length !== 3) {
      Q.fail(`ASSET-VIS-001 expected three target Assets, found ${documents.length}.`);
    }
    const byId = new Map(documents.map(asset => [Q.text(asset.assetId), asset]));
    for (const definition of Object.values(VISIBILITY_ASSETS)) {
      const asset = byId.get(definition.assetId);
      const expectedVisibility = phase === "visibility-edited" && definition.assetId === VISIBILITY_ASSETS.public.assetId
        ? VISIBILITY_EDITED_VISIBILITY
        : definition.visibility;
      if (!asset
          || Q.text(asset._id) !== definition.assetId
          || Q.text(asset.syncKey) !== definition.assetId
          || Q.text(asset.ownerUserId) !== hostUserId
          || Q.text(asset.type) !== "Transport"
          || Q.text(asset.title) !== definition.title
          || Q.text(asset.category) !== "Sedan"
          || Q.text(asset.visibility) !== expectedVisibility
          || lifecycleStatusCode(asset.status) !== "A"
          || Q.number(asset.quantity) !== 1
          || Q.text(asset.city)
          || (Array.isArray(asset.routes) && asset.routes.length !== 0)
          || (Array.isArray(asset.requests) && asset.requests.length !== 0)) {
        Q.fail(`ASSET-VIS-001 '${definition.title}' does not match its '${expectedVisibility}' fixture contract.`);
      }
    }
    const event = Q.collection("events").findOne(visibilityEventSelector());
    if (!event
        || Q.text(event._id) !== VISIBILITY_EVENT_ID
        || Q.text(event.sourceId) !== VISIBILITY_EVENT_ID
        || Q.text(event.title) !== "QA ASSET-VIS-001 Event"
        || Q.text(event.status) !== "A"
        || event.published !== true
        || event.subEventsEnabled !== true
        || !Array.isArray(event.subEventDefinitions)
        || event.subEventDefinitions.length !== 1
        || Q.text(event.subEventDefinitions[0].id) !== VISIBILITY_SUB_EVENT_ID
        || Q.text(event.subEventDefinitions[0].name) !== "QA Visibility Stage") {
      Q.fail("ASSET-VIS-001 Event/Sub-event Explore scaffold is missing or malformed.");
    }
    const members = Q.collection("activityMembers")
      .find({ ownerType: "event", ownerId: VISIBILITY_EVENT_ID })
      .sort({ userId: 1 })
      .toArray();
    const expectedMemberIds = [hostUserId, VISIBILITY_FRIEND_USER_ID, VISIBILITY_UNRELATED_USER_ID].sort();
    const actualMemberIds = members
      .filter(member => Q.text(member.status) === "accepted")
      .map(member => Q.text(member.userId))
      .sort();
    if (members.length !== 3 || !Q.sameJson(actualMemberIds, expectedMemberIds)) {
      Q.fail("ASSET-VIS-001 requires exactly Casey, Lina and Liam as accepted Event scaffold members.");
    }
    const counts = visibilityTargetCounters();
    const expectedTransportCount = Q.number(state.baselineCounts.Transport) + 3;
    const authoritative = lifecycleAuthoritativeCounts();
    if (authoritative.Transport !== expectedTransportCount
        || counts.legacyTransport !== authoritative.Transport
        || counts.nestedTransport !== authoritative.Transport) {
      Q.fail(`ASSET-VIS-001 owner Transport counters are authoritative/legacy/nested ${authoritative.Transport}/${counts.legacyTransport}/${counts.nestedTransport}, expected ${expectedTransportCount}/${expectedTransportCount}/${expectedTransportCount}.`);
    }
    return { actors, documents, event, members, counters: { authoritative, stored: counts } };
  }

  function visibilityDomainSnapshot() {
    const read = (collection, selector) => Q.collection(collection)
      .find(selector)
      .sort({ _id: 1 })
      .toArray();
    const user = Q.ensureUser(hostUserId, "Asset visibility owner");
    const activities = user.activities || {};
    const nested = activities.asset || {};
    return {
      assets: read("assets", visibilityAssetSelector()),
      events: read("events", visibilityEventSelector()),
      members: read("activityMembers", { ownerId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } }),
      requests: read("assetRequests", { assetId: { $in: VISIBILITY_ASSET_IDS } }),
      resources: read("activityResources", { $or: [
        { ownerId: VISIBILITY_EVENT_ID },
        { "assetAssignmentIds.Transport": { $in: VISIBILITY_ASSET_IDS } }
      ] }),
      outbox: read("notificationOutbox", { $or: [
        { entityId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } },
        { "payload.assetId": { $in: VISIBILITY_ASSET_IDS } },
        { "payload.eventId": VISIBILITY_EVENT_ID }
      ] }),
      notifications: read("userNotifications", { $or: [
        { sourceId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } },
        { "payload.assetId": { $in: VISIBILITY_ASSET_IDS } },
        { "payload.eventId": VISIBILITY_EVENT_ID }
      ] }),
      tasks: read("affinityRecomputeTasks", { targetId: { $in: [...VISIBILITY_ASSET_IDS, VISIBILITY_EVENT_ID] } }),
      ownerAssetCounters: [
        ["cars", String(Q.number(activities.cars))],
        ["accommodation", String(Q.number(activities.accommodation))],
        ["supplies", String(Q.number(activities.supplies))],
        ["nestedCars", String(Q.number(nested.cars))],
        ["nestedAccommodation", String(Q.number(nested.accommodation))],
        ["nestedSupplies", String(Q.number(nested.supplies))]
      ]
    };
  }

  function visibilityStableAssetProjection(asset) {
    return {
      _id: Q.text(asset && asset._id),
      syncKey: Q.text(asset && asset.syncKey),
      assetId: Q.text(asset && asset.assetId),
      ownerUserId: Q.text(asset && asset.ownerUserId),
      type: Q.text(asset && asset.type),
      title: Q.text(asset && asset.title),
      subtitle: Q.text(asset && asset.subtitle),
      category: Q.text(asset && asset.category),
      city: Q.text(asset && asset.city),
      capacityTotal: Q.number(asset && asset.capacityTotal),
      quantity: Q.number(asset && asset.quantity),
      details: Q.text(asset && asset.details),
      imageUrl: Q.text(asset && asset.imageUrl),
      sourceLink: Q.text(asset && asset.sourceLink),
      routes: Array.isArray(asset && asset.routes) ? asset.routes.map(Q.text) : [],
      policiesEnabled: asset && asset.policiesEnabled === true,
      policies: Array.isArray(asset && asset.policies) ? asset.policies : [],
      pricing: asset && asset.pricing ? asset.pricing : null,
      requests: Array.isArray(asset && asset.requests) ? asset.requests : [],
      status: lifecycleStatusCode(asset && asset.status),
      createdDate: Q.text(asset && asset.createdDate),
      createdUser: Q.text(asset && asset.createdUser)
    };
  }

  function assertVisibilityEditEffects(state, currentSnapshot) {
    const baseline = state.visibilityReadBaseline;
    const changedKeys = Object.keys(currentSnapshot)
      .filter(key => !Q.sameJson(currentSnapshot[key], baseline && baseline[key]))
      .sort();
    if (!Q.sameJson(changedKeys, ["assets", "tasks"])) {
      Q.fail(`ASSET-VIS-001 visibility Edit changed unexpected persisted domains: ${changedKeys.join(", ") || "none"}.`);
    }
    const byAssetId = values => new Map((values || []).map(asset => [Q.text(asset.assetId), asset]));
    const baselineAssets = byAssetId(baseline.assets);
    const currentAssets = byAssetId(currentSnapshot.assets);
    const publicId = VISIBILITY_ASSETS.public.assetId;
    for (const assetId of VISIBILITY_ASSET_IDS) {
      const before = baselineAssets.get(assetId);
      const after = currentAssets.get(assetId);
      if (!before || !after) {
        Q.fail(`ASSET-VIS-001 visibility Edit lost controlled Asset '${assetId}'.`);
      }
      if (assetId === publicId) {
        const beforeProjection = visibilityStableAssetProjection(before);
        const afterProjection = visibilityStableAssetProjection(after);
        const changedStableFields = Object.keys(afterProjection)
          .filter(key => !Q.sameJson(afterProjection[key], beforeProjection[key]));
        if (changedStableFields.length > 0) {
          Q.fail(`ASSET-VIS-001 Public control changed stable field(s) besides Visibility: ${changedStableFields.join(", ")}.`);
        }
        if (Q.text(after.visibility) !== VISIBILITY_EDITED_VISIBILITY
            || Q.text(after.updatedUser) !== hostUserId
            || Q.text(after.updatedDate) === Q.text(before.updatedDate)) {
          Q.fail("ASSET-VIS-001 Public control did not persist exactly one owner-authored Invitation only visibility update.");
        }
        continue;
      }
      if (!Q.sameJson(after, before)) {
        Q.fail(`ASSET-VIS-001 visibility Edit changed sibling control '${assetId}'.`);
      }
    }
    const tasks = currentSnapshot.tasks || [];
    if (tasks.length !== 1) {
      Q.fail(`ASSET-VIS-001 expected one collapsed affinity task for the edited Asset, found ${tasks.length}.`);
    }
    const task = tasks[0];
    const reasons = Array.isArray(task.reasons) ? task.reasons.map(Q.text) : [];
    const taskStatus = Q.text(task.status).toLowerCase();
    if (Q.text(task.targetType) !== "ASSET"
        || Q.text(task.targetId) !== publicId
        || !reasons.includes("ASSET_CHANGED")
        || !["pending", "running", "done"].includes(taskStatus)
        || Q.text(task.lastError)) {
      Q.fail("ASSET-VIS-001 affinity task does not match the one edited Asset or has failed.");
    }
    return { changedKeys, affinityTaskStatus: taskStatus };
  }

  function visibilityOracle(state) {
    const fixture = assertVisibilityFixture(state);
    const currentSnapshot = visibilityDomainSnapshot();
    const baselineChangedKeys = Object.keys(currentSnapshot)
      .filter(key => !Q.sameJson(currentSnapshot[key], state.visibilityReadBaseline && state.visibilityReadBaseline[key]));
    const edited = Q.text(state.phase) === "visibility-edited";
    return {
      actors: fixture.actors,
      event: {
        eventId: VISIBILITY_EVENT_ID,
        title: Q.text(fixture.event.title),
        subEventId: VISIBILITY_SUB_EVENT_ID,
        subEventTitle: Q.text(fixture.event.subEventDefinitions[0].name)
      },
      assets: fixture.documents.map(asset => ({
        assetId: Q.text(asset.assetId),
        title: Q.text(asset.title),
        visibility: Q.text(asset.visibility),
        ownerUserId: Q.text(asset.ownerUserId),
        status: Q.text(asset.status)
      })),
      targetMatrix: visibilityExpectedMatrix(Q.text(state.phase)),
      counters: fixture.counters,
      baselineComparison: {
        expectedMode: edited ? "single-visibility-edit" : "read-only",
        matchesExpectedMode: edited
          ? Q.sameJson([...baselineChangedKeys].sort(), ["assets", "tasks"])
          : baselineChangedKeys.length === 0,
        changedKeys: baselineChangedKeys
      }
    };
  }

  function selectors() {
    return [
      { collection: "assets", selector: { $or: [{ _id: { $in: IDS } }, { assetId: { $in: IDS } }] } },
      { collection: "events", selector: { $or: [{ _id: EVENT_ID }, { sourceId: EVENT_ID }] } },
      { collection: "activityMembers", selector: { ownerId: { $in: IDS } } },
      { collection: "assetRequests", selector: { assetId: { $in: IDS } } },
      { collection: "activityResources", selector: { $or: [{ ownerId: EVENT_ID }, { "assetAssignmentIds.Transport": { $in: [PRIMARY_ASSET_ID, SECONDARY_ASSET_ID] } }] } },
      { collection: "notificationOutbox", selector: { $or: [
        { entityId: { $in: IDS } },
        { "payload.assetId": { $in: [PRIMARY_ASSET_ID, SECONDARY_ASSET_ID] } },
        { "payload.eventId": EVENT_ID }
      ] } },
      { collection: "userNotifications", selector: { $or: [
        { sourceId: { $in: IDS } },
        { "payload.assetId": { $in: [PRIMARY_ASSET_ID, SECONDARY_ASSET_ID] } },
        { "payload.eventId": EVENT_ID }
      ] } },
      { collection: "affinityRecomputeTasks", selector: { targetId: { $in: IDS } } }
    ];
  }

  function clearFixture() {
    for (const spec of selectors()) Q.collection(spec.collection).deleteMany(spec.selector);
  }

  function stageData(stageKind) {
    if (stageKind === "member-empty") {
      Q.collection("assets").insertOne(assetDocument(
        PRIMARY_ASSET_ID,
        hostUserId,
        "Manual QA Primary Transport"
      ));
      return;
    }
    if (stageKind === "member-two-pending") {
      Q.collection("assets").insertMany([
        assetDocument(PRIMARY_ASSET_ID, hostUserId, "Manual QA Primary Transport"),
        assetDocument(SECONDARY_ASSET_ID, hostUserId, "Manual QA Secondary Transport")
      ]);
      Q.collection("activityMembers").insertMany([
        memberDocument(PRIMARY_ASSET_ID, participantUserId, "pending"),
        memberDocument(SECONDARY_ASSET_ID, thirdUserId, "pending")
      ]);
      return;
    }
    if (stageKind === "assignment-empty") {
      Q.collection("assets").insertOne(assetDocument(
        PRIMARY_ASSET_ID,
        participantUserId,
        "Manual QA Primary Transport"
      ));
      Q.collection("events").insertOne(eventDocument());
      Q.collection("activityMembers").insertMany([
        eventMemberDocument(hostUserId, "Admin"),
        eventMemberDocument(participantUserId, "Member")
      ]);
    }
  }

  function oracle(state) {
    const assets = Q.collection("assets").find({ assetId: { $in: [PRIMARY_ASSET_ID, SECONDARY_ASSET_ID] } }).toArray();
    const assetMembers = Q.collection("activityMembers").find({
      ownerType: "asset",
      ownerId: { $in: [PRIMARY_ASSET_ID, SECONDARY_ASSET_ID] }
    }).toArray();
    const eventMembers = Q.collection("activityMembers").find({ ownerType: "event", ownerId: EVENT_ID }).toArray();
    const resources = Q.collection("activityResources").find({ ownerId: EVENT_ID }).toArray();
    const outboxCount = Q.collection("notificationOutbox").countDocuments({
      $and: [
        { $or: [
          { entityId: { $in: IDS } },
          { "payload.assetId": { $in: [PRIMARY_ASSET_ID, SECONDARY_ASSET_ID] } },
          { "payload.eventId": EVENT_ID }
        ] },
        { createdDate: { $gt: state.stagedAtIso } }
      ]
    });
    return {
      assets: assets.map(asset => ({
        assetId: Q.text(asset.assetId),
        ownerUserId: Q.text(asset.ownerUserId),
        type: Q.text(asset.type),
        title: Q.text(asset.title),
        capacityTotal: asset.capacityTotal,
        status: Q.text(asset.status)
      })),
      assetMembers: assetMembers.map(member => ({
        assetId: Q.text(member.ownerId),
        userId: Q.text(member.userId),
        role: Q.text(member.role),
        status: Q.text(member.status),
        requestKind: Q.text(member.requestKind),
        invitedByUserId: Q.text(member.invitedByUserId)
      })),
      eventMembers: eventMembers.map(member => ({
        eventId: Q.text(member.ownerId),
        userId: Q.text(member.userId),
        role: Q.text(member.role),
        status: Q.text(member.status)
      })),
      resources: resources.map(resource => ({
        eventId: Q.text(resource.ownerId),
        subEventId: Q.text(resource.subEventId),
        assetOwnerUserId: Q.text(resource.assetOwnerUserId),
        transportAssetIds: ((resource.assetAssignmentIds || {}).Transport || []),
        transportSettings: ((resource.assetSettingsByType || {}).Transport || {})
      })),
      afterStageOutboxCount: outboxCount
    };
  }

  function stageLifecycle() {
    const selected = config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    Q.ensureUser(hostUserId, "Asset lifecycle owner");
    if (lifecycleDocuments().length !== 0) {
      Q.fail("ASSET-LIFE-001 target titles already exist for Casey; refusing to overwrite or clear them.");
    }
    const baselineCounts = lifecycleAuthoritativeCounts();
    assertLifecycleCounts(baselineCounts, "ASSET-LIFE-001 pre-stage");
    const stagedAtIso = Q.nowIso();
    const state = {
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId,
      database: db.getName(),
      stagedAtIso,
      phase: "baseline-ready",
      baselineCounts,
      context: {
        hostUserId,
        targetTitles: LIFE_TITLES,
        initialSubtitle: LIFE_INITIAL_SUBTITLE,
        editedSubtitle: LIFE_EDITED_SUBTITLE
      },
      snapshots: []
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: state.phase,
      stagedAtIso,
      identities: state.context,
      why: selected.why,
      workerExpectation: selected.worker,
      baseline: lifecycleOracle(state),
      next: selected.action,
      expectedVisibleResult: selected.expected
    });
  }

  function captureLifecycleCreated() {
    if (checkpointId !== LIFE_CHECKPOINT) Q.fail(`capture-lifecycle-created is restricted to ${LIFE_CHECKPOINT}.`);
    const state = requireMatchingState();
    assertLifecyclePhase(state, "baseline-ready");
    const byType = lifecycleAssetMap();
    assertLifecycleAsset(byType.Transport, "Transport", LIFE_INITIAL_SUBTITLE, "A");
    assertLifecycleAsset(byType.Accommodation, "Accommodation", LIFE_INITIAL_SUBTITLE, "A");
    assertLifecycleAsset(byType.Supplies, "Supplies", LIFE_INITIAL_SUBTITLE, "A");
    const imageUrls = Object.values(byType).map(asset => Q.text(asset.imageUrl)).filter(Boolean);
    if (new Set(imageUrls).size !== imageUrls.length) {
      Q.fail("ASSET-LIFE-001 requires distinct managed media identities for every uploaded Asset image.");
    }
    assertLifecycleCounts(lifecycleExpectedCounts(state, "created"), "ASSET-LIFE-001 created");
    const createdDomains = {};
    for (const type of Object.keys(LIFE_ASSETS)) createdDomains[type] = lifecycleStableDomain(byType[type]);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id, phase: "baseline-ready" },
      {
        $set: {
          phase: "created",
          createdAtIso: Q.nowIso(),
          createdDomains,
          "context.assetIds": {
            Transport: Q.text(byType.Transport.assetId),
            Accommodation: Q.text(byType.Accommodation.assetId),
            Supplies: Q.text(byType.Supplies.assetId)
          }
        }
      }
    );
    const current = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: current.phase,
      oracle: lifecycleOracle(current),
      next: `Edit only Subtitle on ${LIFE_ASSETS.Transport.title} to '${LIFE_EDITED_SUBTITLE}', Save once, close/reopen, then report the Edit phrase.`
    });
  }

  function verifyLifecycleEdited() {
    if (checkpointId !== LIFE_CHECKPOINT) Q.fail(`verify-lifecycle-edited is restricted to ${LIFE_CHECKPOINT}.`);
    const state = requireMatchingState();
    assertLifecyclePhase(state, "created");
    const result = assertLifecycleCreated(state, "edited");
    const editedTransportDomain = lifecycleStableDomain(result.byType.Transport);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id, phase: "created" },
      {
        $set: {
          phase: "edited",
          editedAtIso: Q.nowIso(),
          editedTransportDomain
        }
      }
    );
    const current = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: current.phase,
      oracle: lifecycleOracle(current),
      next: `Delete only ${LIFE_ASSETS.Transport.title} once, confirm once, and verify its card and Transport counters disappear without reload before reporting the Delete phrase.`
    });
  }

  function verifyLifecycleDeleted() {
    if (checkpointId !== LIFE_CHECKPOINT) Q.fail(`verify-lifecycle-deleted is restricted to ${LIFE_CHECKPOINT}.`);
    const state = requireMatchingState();
    const previousPhase = Q.text(state.phase);
    if (previousPhase !== "edited" && previousPhase !== "baseline-ready") {
      Q.fail(`ASSET-LIFE-001 is at phase '${previousPhase}', expected 'edited' or a terminal fast-forward from 'baseline-ready'.`);
    }
    const result = assertLifecycleCreated(state, "deleted", {
      allowExternalAssets: previousPhase === "baseline-ready"
    });
    const ignoredExternalAssets = Q.collection("assets")
      .find({
        ownerUserId: hostUserId,
        title: { $nin: LIFE_TITLES }
      })
      .toArray()
      .map(asset => ({
        assetId: Q.text(asset.assetId),
        type: Q.text(asset.type),
        title: Q.text(asset.title),
        status: lifecycleStatusCode(asset.status)
      }));
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id, phase: previousPhase },
      {
        $set: {
          phase: "deleted",
          deletedAtIso: Q.text(result.byType.Transport.trashedAtIso),
          terminalFastForward: previousPhase === "baseline-ready",
          ignoredExternalAssets,
          "context.assetIds": {
            Transport: Q.text(result.byType.Transport.assetId),
            Accommodation: Q.text(result.byType.Accommodation.assetId),
            Supplies: Q.text(result.byType.Supplies.assetId)
          }
        }
      }
    );
    const current = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: current.phase,
      oracle: lifecycleOracle(current),
      next: "After the single final reload UI check, run status for the terminal persisted oracle."
    });
  }

  function statusLifecycle() {
    const selected = config();
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "not-staged",
        why: selected.why,
        next: `Run stage asset-domain ${checkpointId}.`
      });
      return;
    }
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged checkpoint is '${state.checkpointId}', not '${checkpointId}'.`);
    }
    switch (Q.text(state.phase)) {
      case "baseline-ready": assertLifecycleBaseline(state); break;
      case "created": assertLifecycleCreated(state, "created"); break;
      case "edited": assertLifecycleCreated(state, "edited"); break;
      case "deleted": assertLifecycleCreated(state, "deleted", {
        allowExternalAssets: Array.isArray(state.ignoredExternalAssets) && state.ignoredExternalAssets.length > 0
      }); break;
      default: Q.fail(`ASSET-LIFE-001 has unsupported phase '${Q.text(state.phase)}'.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: state.phase,
      why: selected.why,
      workerExpectation: selected.worker,
      oracle: lifecycleOracle(state),
      next: lifecycleNextAction(state.phase)
    });
  }

  function lifecycleNextAction(phase) {
    switch (Q.text(phase)) {
      case "baseline-ready": return config().action;
      case "created": return `Edit only Subtitle on ${LIFE_ASSETS.Transport.title}, then run verify-lifecycle-edited.`;
      case "edited": return `Delete only ${LIFE_ASSETS.Transport.title}, then run verify-lifecycle-deleted.`;
      case "deleted": return "Run the final reload checks, then status for the terminal persisted oracle.";
      default: return "Stop and inspect the checkpoint phase.";
    }
  }

  function resetLifecycle() {
    const state = requireMatchingState();
    const targetAssets = lifecycleDocuments();
    const assetIds = targetAssets.map(asset => Q.text(asset.assetId)).filter(Boolean);
    if (assetIds.length > 0) {
      const resourceResidue = Q.collection("activityResources").countDocuments({
        $or: [
          { "assetAssignmentIds.Transport": { $in: assetIds } },
          { "assetAssignmentIds.Accommodation": { $in: assetIds } },
          { "assetAssignmentIds.Supplies": { $in: assetIds } }
        ]
      });
      if (resourceResidue !== 0) {
        Q.fail("ASSET-LIFE-001 reset found an unexpected Event resource assignment; refusing to delete a containing resource document.");
      }
      const cleanup = [
        { collection: "activityMembers", selector: { ownerType: "asset", ownerId: { $in: assetIds } } },
        { collection: "assetRequests", selector: { assetId: { $in: assetIds } } },
        { collection: "notificationOutbox", selector: { $or: [
          { entityId: { $in: assetIds } },
          { "payload.assetId": { $in: assetIds } }
        ] } },
        { collection: "userNotifications", selector: { $or: [
          { sourceId: { $in: assetIds } },
          { "payload.assetId": { $in: assetIds } }
        ] } },
        { collection: "affinityRecomputeTasks", selector: { targetId: { $in: assetIds } } }
      ];
      for (const spec of cleanup) Q.collection(spec.collection).deleteMany(spec.selector);
    }
    Q.collection("assets").deleteMany(lifecycleAssetSelector());
    const remainingCounts = lifecycleAuthoritativeCounts();
    const update = {
      $set: {
        "activities.cars": remainingCounts.Transport,
        "activities.accommodation": remainingCounts.Accommodation,
        "activities.supplies": remainingCounts.Supplies,
        "activities.asset.cars": remainingCounts.Transport,
        "activities.asset.accommodation": remainingCounts.Accommodation,
        "activities.asset.supplies": remainingCounts.Supplies
      }
    };
    const userReset = Q.collection("users").updateOne(
      { $or: [{ _id: hostUserId }, { userId: hostUserId }] },
      update
    );
    if (userReset.matchedCount !== 1) Q.fail("ASSET-LIFE-001 reset could not restore the owner counters.");
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      restoredAtIso: Q.nowIso(),
      retainedExternalEvidence: "Managed MinIO image objects and operational telemetry are not deleted by the Mongo checkpoint reset.",
      next: `Run status asset-domain ${checkpointId}; expected phase is not-staged.`
    });
  }

  function stageVisibility() {
    const selected = config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    const actors = assertVisibilityActors();
    for (const spec of visibilityDomainSelectors()) {
      const collisionCount = Q.collection(spec.collection).countDocuments(spec.selector);
      if (collisionCount !== 0) {
        Q.fail(`ASSET-VIS-001 found ${collisionCount} stale target document(s) in '${spec.collection}'; refusing to overwrite them without a recoverable checkpoint state.`);
      }
    }
    const baselineCounts = lifecycleAuthoritativeCounts();
    assertLifecycleCounts(baselineCounts, "ASSET-VIS-001 pre-stage");
    const stagedAtIso = Q.nowIso();
    const state = {
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId,
      database: db.getName(),
      stagedAtIso,
      phase: "staging",
      baselineCounts,
      context: {
        hostUserId,
        friendUserId: VISIBILITY_FRIEND_USER_ID,
        unrelatedUserId: VISIBILITY_UNRELATED_USER_ID,
        eventId: VISIBILITY_EVENT_ID,
        subEventId: VISIBILITY_SUB_EVENT_ID,
        assetIds: VISIBILITY_ASSET_IDS
      },
      snapshots: Q.snapshotSpecs(visibilityRestoreSelectors())
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    try {
      Q.collection("assets").insertMany(Object.values(VISIBILITY_ASSETS).map(visibilityAssetDocument));
      Q.collection("events").insertOne(visibilityEventDocument());
      Q.collection("activityMembers").insertMany([
        visibilityEventMemberDocument(hostUserId, "Admin"),
        visibilityEventMemberDocument(VISIBILITY_FRIEND_USER_ID, "Member"),
        visibilityEventMemberDocument(VISIBILITY_UNRELATED_USER_ID, "Member")
      ]);
      const authoritative = lifecycleAuthoritativeCounts();
      const counterUpdate = Q.collection("users").updateOne(
        { $or: [{ _id: hostUserId }, { userId: hostUserId }] },
        { $set: {
          "activities.cars": authoritative.Transport,
          "activities.accommodation": authoritative.Accommodation,
          "activities.supplies": authoritative.Supplies,
          "activities.asset.cars": authoritative.Transport,
          "activities.asset.accommodation": authoritative.Accommodation,
          "activities.asset.supplies": authoritative.Supplies
        } }
      );
      if (counterUpdate.matchedCount !== 1) {
        Q.fail("ASSET-VIS-001 could not synchronize Casey's Asset counters.");
      }
      assertVisibilityFixture(state);
      const visibilityReadBaseline = visibilityDomainSnapshot();
      Q.collection(Q.STATE_COLLECTION).updateOne(
        { _id: state._id, phase: "staging" },
        { $set: { phase: "baseline-ready", visibilityReadBaseline } }
      );
    } catch (error) {
      Q.fail(`ASSET-VIS-001 stage failed after snapshot: ${Q.text(error && error.message)}. Run reset asset-domain ${checkpointId}.`);
    }
    const current = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: current.phase,
      stagedAtIso,
      identities: current.context,
      actors,
      why: selected.why,
      workerExpectation: selected.worker,
      baseline: visibilityOracle(current),
      next: selected.action,
      expectedVisibleResult: selected.expected
    });
  }

  function statusVisibility() {
    const selected = config();
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "not-staged",
        why: selected.why,
        next: `Run stage asset-domain ${checkpointId}.`
      });
      return;
    }
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged checkpoint is '${state.checkpointId}', not '${checkpointId}'.`);
    }
    if (!state.visibilityReadBaseline) {
      Q.fail("ASSET-VIS-001 has no completed read-only baseline; reset the failed stage before continuing.");
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: Q.text(state.phase),
      why: selected.why,
      workerExpectation: selected.worker,
      oracle: visibilityOracle(state),
      expectedVisibleResult: selected.expected,
      next: Q.text(state.phase) === "visibility-edited"
        ? "Record the browser evidence, close ASSET-VIS-001, then reset the fixture."
        : Q.text(state.phase) === "readonly-verified"
          ? "Complete the single Casey visibility Edit and three-client reload branch, run the edited HTTP matrix, then run verify-visibility-edited."
          : "Complete the baseline checklist reads, run the authenticated HTTP matrix, then run verify-visibility-readonly."
    });
  }

  function verifyVisibilityReadonly() {
    if (checkpointId !== VISIBILITY_CHECKPOINT) {
      Q.fail(`verify-visibility-readonly is restricted to ${VISIBILITY_CHECKPOINT}.`);
    }
    const state = requireMatchingState();
    if (!state.visibilityReadBaseline) {
      Q.fail("ASSET-VIS-001 has no read-only baseline to verify.");
    }
    assertVisibilityFixture(state);
    const current = visibilityDomainSnapshot();
    const changedKeys = Object.keys(current)
      .filter(key => !Q.sameJson(current[key], state.visibilityReadBaseline[key]));
    if (changedKeys.length !== 0) {
      Q.fail(`ASSET-VIS-001 list/detail reads changed persisted state in: ${changedKeys.join(", ")}.`);
    }
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      { $set: { phase: "readonly-verified", verifiedAtIso } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "readonly-verified",
      verifiedAtIso,
      changedPersistedCollections: [],
      oracle: visibilityOracle(requireMatchingState()),
      next: "Change only QA ASSET-VIS-001 Public Transport from Public to Invitation only as Casey, reload all three clients and compare the edited matrix."
    });
  }

  function verifyVisibilityEdited() {
    if (checkpointId !== VISIBILITY_CHECKPOINT) {
      Q.fail(`verify-visibility-edited is restricted to ${VISIBILITY_CHECKPOINT}.`);
    }
    const state = requireMatchingState();
    if (Q.text(state.phase) !== "readonly-verified") {
      Q.fail(`ASSET-VIS-001 visibility Edit verification requires phase 'readonly-verified', found '${Q.text(state.phase)}'.`);
    }
    const fixture = assertVisibilityFixture(state, "visibility-edited");
    const current = visibilityDomainSnapshot();
    const effects = assertVisibilityEditEffects(state, current);
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id, phase: "readonly-verified" },
      { $set: { phase: "visibility-edited", visibilityEditedVerifiedAtIso: verifiedAtIso } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "visibility-edited",
      verifiedAtIso,
      changedPersistedCollections: effects.changedKeys,
      affinityTaskStatus: effects.affinityTaskStatus,
      counters: fixture.counters,
      targetMatrix: visibilityExpectedMatrix("visibility-edited"),
      next: "Record ASSET-VIS-001 PASS only when the reloaded Casey/Lina/Liam browser sets and edited authenticated HTTP visibility/detail matrix also match."
    });
  }

  function resetVisibility() {
    const state = requireMatchingState();
    Q.restoreSnapshots(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      restoredAtIso: Q.nowIso(),
      next: `Run status asset-domain ${checkpointId}; expected phase is not-staged.`
    });
  }

  function stage() {
    if (checkpointId === LIFE_CHECKPOINT) {
      stageLifecycle();
      return;
    }
    if (checkpointId === VISIBILITY_CHECKPOINT) {
      stageVisibility();
      return;
    }
    const selected = config();
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    if (hostUserId === participantUserId) Q.fail("host and participant must differ.");
    Q.ensureUser(hostUserId, "asset owner/event host");
    Q.ensureUser(participantUserId, "asset participant");
    if (selected.stage === "member-two-pending") Q.ensureUser(thirdUserId, "asset rejection target");
    const stagedAtIso = Q.nowIso();
    const state = {
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId,
      database: db.getName(),
      stagedAtIso,
      context: {
        hostUserId,
        participantUserId,
        thirdUserId,
        primaryAssetId: PRIMARY_ASSET_ID,
        secondaryAssetId: SECONDARY_ASSET_ID,
        eventId: EVENT_ID,
        subEventId: SUB_EVENT_ID
      },
      snapshots: Q.snapshotSpecs(selectors())
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    try {
      clearFixture();
      stageData(selected.stage);
    } catch (error) {
      Q.fail(`stage failed after snapshot: ${Q.text(error && error.message)}. Run reset asset-domain ${checkpointId}.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline-ready",
      stagedAtIso,
      identities: state.context,
      why: selected.why,
      workerExpectation: selected.worker,
      baseline: oracle(state),
      next: selected.action,
      expectedVisibleResult: selected.expected
    });
  }

  function requireMatchingState() {
    const state = Q.activeState(SCENARIO, true);
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged checkpoint is '${state.checkpointId}', not '${checkpointId}'.`);
    }
    return state;
  }

  function next() {
    if (checkpointId === LIFE_CHECKPOINT) {
      const state = requireMatchingState();
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: state.phase,
        why: config().why,
        action: lifecycleNextAction(state.phase),
        workerExpectation: config().worker,
        identities: state.context
      });
      return;
    }
    if (checkpointId === VISIBILITY_CHECKPOINT) {
      const state = requireMatchingState();
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: state.phase,
        why: config().why,
        action: config().action,
        expectedVisibleResult: config().expected,
        workerExpectation: config().worker,
        identities: state.context,
        targetMatrix: visibilityExpectedMatrix(Q.text(state.phase))
      });
      return;
    }
    const selected = config();
    const state = requireMatchingState();
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "awaiting-manual-action",
      why: selected.why,
      action: selected.action,
      expectedVisibleResult: selected.expected,
      workerExpectation: selected.worker,
      identities: state.context
    });
  }

  function status() {
    if (checkpointId === LIFE_CHECKPOINT) {
      statusLifecycle();
      return;
    }
    if (checkpointId === VISIBILITY_CHECKPOINT) {
      statusVisibility();
      return;
    }
    const selected = config();
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "not-staged",
        why: selected.why,
        next: `Run stage asset-domain ${checkpointId}.`
      });
      return;
    }
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged checkpoint is '${state.checkpointId}', not '${checkpointId}'.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "inspect-manual-checkpoint",
      why: selected.why,
      workerExpectation: selected.worker,
      oracle: oracle(state),
      expectedVisibleResult: selected.expected,
      next: "Compare the UI screenshot with this identity-level oracle. Record PASS only when asset and event roles remain independently correct."
    });
  }

  function reset() {
    if (checkpointId === LIFE_CHECKPOINT) {
      resetLifecycle();
      return;
    }
    if (checkpointId === VISIBILITY_CHECKPOINT) {
      resetVisibility();
      return;
    }
    config();
    const state = requireMatchingState();
    Q.restoreSnapshots(state.snapshots);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      restoredAtIso: Q.nowIso(),
      next: `Run status asset-domain ${checkpointId}; expected phase is not-staged.`
    });
  }

  Q.assertDeploymentSafety();
  switch (command) {
    case "stage": stage(); break;
    case "next": next(); break;
    case "status": status(); break;
    case "capture-lifecycle-created": captureLifecycleCreated(); break;
    case "verify-lifecycle-edited": verifyLifecycleEdited(); break;
    case "verify-lifecycle-deleted": verifyLifecycleDeleted(); break;
    case "verify-visibility-readonly": verifyVisibilityReadonly(); break;
    case "verify-visibility-edited": verifyVisibilityEdited(); break;
    case "reset": reset(); break;
    default: Q.fail(`unsupported command '${command}'.`);
  }
})();
