/* global ManualQa, db, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "entry-domain";
  const CHECKPOINT = "ENTRY-DEMO-REG-001";
  const LANDING_CHECKPOINT = "LANDING-ELIGIBILITY-001";
  const USER_ID_PREFIX = "demo-profile-";
  const CURRENT_PROFILE_FORM_VERSION = 2;
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const checkpointId = Q.text(process.env.MANUAL_QA_CHECKPOINT_ID).toUpperCase();

  function config() {
    if (checkpointId !== CHECKPOINT && checkpointId !== LANDING_CHECKPOINT) {
      Q.fail(`entry-domain supports ${CHECKPOINT} and ${LANDING_CHECKPOINT}.`);
    }
  }

  function isLandingCheckpoint() {
    return checkpointId === LANDING_CHECKPOINT;
  }

  function landingDomainSnapshot() {
    return {
      users: Q.collection("users").countDocuments({}),
      userSessionStates: Q.collection("userSessionStates").countDocuments({}),
      userLoginAudits: Q.collection("userLoginAudits").countDocuments({})
    };
  }

  function countryPartitions() {
    return Q.collection("countryPartitions")
      .find({}, {
        _id: 0,
        partitionKey: 1,
        countryCode: 1,
        countryName: 1,
        source: 1,
        osmType: 1,
        osmId: 1,
        "geometry.type": 1
      })
      .sort({ partitionKey: 1 })
      .toArray();
  }

  function assertLandingCountryBaseline(partitions) {
    const byKey = new Map(partitions.map(partition => [Q.text(partition.partitionKey), partition]));
    for (const expected of [
      ["country:hu", "HU"],
      ["country:gb", "GB"]
    ]) {
      const partition = byKey.get(expected[0]);
      if (!partition
          || Q.text(partition.countryCode).toUpperCase() !== expected[1]
          || Q.text(partition.source) !== "openstreetmap"
          || Q.text(partition.geometry && partition.geometry.type) !== "MultiPolygon") {
        Q.fail(`required OSM partition '${expected[0]}' is missing or malformed.`);
      }
    }
    if (byKey.has("country:fr")) {
      Q.fail("country:fr is already imported; select and document a different not-yet-enabled control before staging.");
    }
  }

  function stageLanding() {
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    const partitions = countryPartitions();
    assertLandingCountryBaseline(partitions);
    const stagedAtIso = Q.nowIso();
    const domainBaseline = landingDomainSnapshot();
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline",
      stagedAtIso,
      domainBaseline,
      countryPartitionKeys: partitions.map(partition => Q.text(partition.partitionKey))
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline",
      stagedAtIso,
      fixtureMutation: false,
      domainBaseline,
      countryPartitions: partitions,
      controls: {
        budapest: "country:hu",
        london: "country:gb",
        paris: "not imported; expected eligible=false"
      },
      next: "Launch the three managed anonymous LANDING-ELIGIBILITY-001 targets, then execute Budapest, London, Paris and the target-scoped permission-denied branch."
    });
  }

  function landingStateStatus(verified) {
    const state = requireState();
    const partitions = countryPartitions();
    assertLandingCountryBaseline(partitions);
    const current = landingDomainSnapshot();
    const unchanged = JSON.stringify(current) === JSON.stringify(state.domainBaseline)
      && JSON.stringify(partitions.map(partition => Q.text(partition.partitionKey)))
        === JSON.stringify(state.countryPartitionKeys || []);
    if (verified && !unchanged) {
      Q.fail("landing eligibility reads changed users, login sessions/audits or the country-partition baseline.");
    }
    return { state, partitions, current, unchanged };
  }

  function statusLanding() {
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "not-staged",
        domain: landingDomainSnapshot(),
        countryPartitions: countryPartitions(),
        next: `Run stage entry-domain ${checkpointId}.`
      });
      return;
    }
    const status = landingStateStatus(false);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: Q.text(status.state.phase) || "baseline",
      stagedAtIso: status.state.stagedAtIso,
      baseline: status.state.domainBaseline,
      current: status.current,
      countryPartitions: status.partitions,
      unchanged: status.unchanged,
      next: status.unchanged
        ? "Continue the next controlled landing branch."
        : "Stop: a read-only landing checkpoint changed its persisted domain baseline."
    });
  }

  function verifyLanding() {
    const status = landingStateStatus(true);
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: status.state._id },
      { $set: { phase: "verified", verifiedAtIso } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "verified",
      verifiedAtIso,
      baseline: status.state.domainBaseline,
      current: status.current,
      countryPartitions: status.partitions,
      unchanged: true,
      next: `Record ${checkpointId} PASS/CLOSED only when the browser/server evidence for all coordinate and permission branches is also complete, then reset the checkpoint pointer.`
    });
  }

  function resetLanding() {
    const status = landingStateStatus(true);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: status.state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      resetAtIso: Q.nowIso(),
      domainDeletionPerformed: false,
      unchanged: true,
      next: `Run status entry-domain ${checkpointId}; expected phase is not-staged.`
    });
  }

  function registrationUsers() {
    return Q.collection("users")
      .find(
        { userId: { $regex: `^${USER_ID_PREFIX}` } },
        {
          _id: 1,
          userId: 1,
          name: 1,
          birthday: 1,
          city: 1,
          height: 1,
          physique: 1,
          languages: 1,
          images: 1,
          profileStatus: 1,
          status: 1,
          profileFormVersion: 1,
          email: 1,
          firebaseUid: 1,
          googleId: 1,
          facebookId: 1,
          createdDate: 1,
          updatedDate: 1
        }
      )
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

  function requireState() {
    const state = Q.activeState(SCENARIO, true);
    if (Q.text(state.checkpointId).toUpperCase() !== checkpointId) {
      Q.fail(`staged entry checkpoint is '${Q.text(state.checkpointId)}', not '${checkpointId}'.`);
    }
    return state;
  }

  function stage() {
    config();
    if (isLandingCheckpoint()) {
      stageLanding();
      return;
    }
    Q.assertNotStaged(SCENARIO);
    const existing = registrationUsers();
    const stagedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).insertOne({
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline",
      stagedAtIso,
      baselineUserIds: existing.map(user => Q.text(user.userId)),
      baselineUserCount: Q.collection("users").countDocuments({}),
      baselineRegistrationUserCount: existing.length
    });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "baseline",
      stagedAtIso,
      baselineUserCount: Q.collection("users").countDocuments({}),
      baselineRegistrationUserCount: existing.length,
      firebaseIdentityCreatedByStage: false,
      fixtureMutation: false,
      next: "Open the managed anonymous ENTRY-DEMO-REG-001 browser, choose Member > New profile, complete onboarding once, then run verify entry-domain ENTRY-DEMO-REG-001."
    });
  }

  function status() {
    config();
    if (isLandingCheckpoint()) {
      statusLanding();
      return;
    }
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId,
        phase: "not-staged",
        registrationUserCount: registrationUsers().length,
        next: `Run stage entry-domain ${checkpointId}.`
      });
      return;
    }
    const candidates = newRegistrationUsers(state);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: Q.text(state.phase) || "baseline",
      stagedAtIso: state.stagedAtIso,
      baselineUserCount: state.baselineUserCount,
      baselineRegistrationUserCount: state.baselineRegistrationUserCount,
      newRegistrationUserCount: candidates.length,
      newRegistrationUsers: candidates.map(user => ({
        userId: Q.text(user.userId),
        name: Q.text(user.name),
        profileStatus: Q.text(user.profileStatus),
        profileFormVersion: Q.number(user.profileFormVersion),
        imageCount: Array.isArray(user.images) ? user.images.length : 0
      })),
      next: candidates.length === 0
        ? "Complete exactly one New profile onboarding flow."
        : candidates.length === 1
          ? `Run verify entry-domain ${checkpointId}.`
          : "Stop: more than one user appeared after the checkpoint baseline."
    });
  }

  function verify() {
    config();
    if (isLandingCheckpoint()) {
      verifyLanding();
      return;
    }
    const state = requireState();
    const candidates = newRegistrationUsers(state);
    if (candidates.length !== 1) {
      Q.fail(`expected exactly one new ${USER_ID_PREFIX} user after the baseline, found ${candidates.length}.`);
    }
    const user = candidates[0];
    const userId = Q.text(user.userId);
    const required = {
      name: Q.text(user.name),
      birthday: Q.text(user.birthday),
      city: Q.text(user.city),
      height: Q.text(user.height),
      physique: Q.text(user.physique),
      languages: Array.isArray(user.languages) ? user.languages.map(Q.text).filter(Boolean) : [],
      images: Array.isArray(user.images) ? user.images.map(Q.text).filter(Boolean) : []
    };
    for (const [field, value] of Object.entries(required)) {
      if ((Array.isArray(value) && value.length === 0) || (!Array.isArray(value) && !value)) {
        Q.fail(`new registration '${userId}' is missing required '${field}'.`);
      }
    }
    if (required.images.length < 3) {
      Q.fail(`new registration '${userId}' has ${required.images.length} images; expected at least 3.`);
    }
    if (Q.text(user.profileStatus) !== "public" || Q.text(user.status).toUpperCase() !== "A") {
      Q.fail(`new registration '${userId}' did not finish in active/public state.`);
    }
    if (Q.number(user.profileFormVersion) !== CURRENT_PROFILE_FORM_VERSION) {
      Q.fail(`new registration '${userId}' has profileFormVersion=${Q.number(user.profileFormVersion)}; expected ${CURRENT_PROFILE_FORM_VERSION}.`);
    }
    const identityFields = ["firebaseUid", "googleId", "facebookId"];
    for (const field of identityFields) {
      if (Q.text(user[field])) {
        Q.fail(`Firebase-inactive demo registration manufactured identity field '${field}'.`);
      }
    }
    const developmentEmail = Q.text(user.email).toLowerCase();
    if (!/^member\+[0-9a-f]{32}@myscoutee\.local$/.test(developmentEmail)) {
      Q.fail(`new registration '${userId}' does not have a stable per-profile development email.`);
    }
    const emailOwners = Q.collection("users").countDocuments({ email: developmentEmail });
    if (emailOwners !== 1) {
      Q.fail(`development email '${developmentEmail}' has ${emailOwners} owners; expected exactly one.`);
    }
    const experienceProfiles = Q.collection("userExperienceProfiles")
      .find({ userId })
      .toArray();
    if (experienceProfiles.length !== 1) {
      Q.fail(`new registration '${userId}' has ${experienceProfiles.length} experience profiles; expected exactly one.`);
    }
    const firebaseLinkedUsers = Q.collection("users").countDocuments({
      userId,
      $or: [
        { firebaseUid: { $nin: [null, ""] } },
        { googleId: { $nin: [null, ""] } },
        { facebookId: { $nin: [null, ""] } }
      ]
    });
    if (firebaseLinkedUsers !== 0) {
      Q.fail(`new registration '${userId}' unexpectedly has an external identity link.`);
    }
    const verifiedAtIso = Q.nowIso();
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      {
        $set: {
          phase: "verified",
          verifiedAtIso,
          registeredUserId: userId
        }
      }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "verified",
      verifiedAtIso,
      user: {
        userId,
        developmentEmail,
        name: required.name,
        city: required.city,
        profileStatus: Q.text(user.profileStatus),
        status: Q.text(user.status),
        profileFormVersion: Q.number(user.profileFormVersion),
        languageCount: required.languages.length,
        imageCount: required.images.length
      },
      cardinality: {
        newUsersSinceBaseline: candidates.length,
        experienceProfiles: experienceProfiles.length,
        firebaseLinkedUsers,
        developmentEmailOwners: emailOwners
      },
      unchanged: {
        externalProviderIdentityFields: "absent",
        developmentEmailPolicy: "a stable per-profile development email is unique; ENTRY-FIREBASE-REG-001 must persist the real verified identity email instead",
        eventFixtures: "not touched",
        paymentRuntime: "not used"
      },
      next: `Record ${checkpointId} PASS/CLOSED, then reset only the checkpoint pointer; retain the disposable profile as transaction evidence.`
    });
  }

  function reset() {
    config();
    if (isLandingCheckpoint()) {
      resetLanding();
      return;
    }
    const state = requireState();
    const candidates = newRegistrationUsers(state);
    if (candidates.length > 1) {
      Q.fail(`refusing to reset tracking with ${candidates.length} post-baseline registration users.`);
    }
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId,
      phase: "reset-complete",
      resetAtIso: Q.nowIso(),
      retainedDisposableUserId: candidates.length === 1 ? Q.text(candidates[0].userId) : null,
      domainDeletionPerformed: false,
      reason: "A completed registration and its uploaded media are retained as transaction evidence. A future replay stages a new baseline around them.",
      next: `Run status entry-domain ${checkpointId}; expected phase is not-staged.`
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
