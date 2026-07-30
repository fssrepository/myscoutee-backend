/* global db, EJSON, print, process */
(() => {
  "use strict";

  const PREFIX = "admin-job-fixture:v1";
  const SNAPSHOT_COLLECTION = "adminJobFixtureSnapshots";
  const FIXTURE_ACTOR = `${PREFIX}:actor`;
  const SECONDARY_RULE_KEYS_BY_JOB = {
    "event-random-groups": ["notification-outbox"],
    "event-auto-inviter": [
      "event-random-groups",
      "event-tournament-review",
      "event-counter-expiry",
      "notification-outbox",
      "affinity-recompute"
    ],
    "event-tournament-review": [],
    "event-counter-expiry": [],
    "event-checkout-basket-purge": [],
    "notification-outbox": [],
    "notification-read-path": ["notification-outbox"],
    "affinity-recompute": [],
    "scheduled-messages": ["affinity-recompute", "event-random-groups"],
    "account-purge": [],
    "bell-rating-feedback": [
      "notification-outbox",
      "affinity-recompute",
      "event-random-groups"
    ]
  };
  const command = String(process.env.FIXTURE_COMMAND || "").trim();
  const requestedJob = String(process.env.FIXTURE_JOB || "").trim();
  const requestedVariation = String(process.env.FIXTURE_VARIATION || "").trim();
  const requestedDb = String(process.env.FIXTURE_DB || "").trim();

  function fail(message) {
    throw new Error(`[admin-job-fixtures] ${message}`);
  }

  function safeText(value) {
    return value == null ? "" : String(value).trim();
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function pastIso(minutes = 10) {
    return new Date(Date.now() - Math.max(1, minutes) * 60 * 1000).toISOString();
  }

  function futureIso(minutes = 10) {
    return new Date(Date.now() + Math.max(1, minutes) * 60 * 1000).toISOString();
  }

  function printObject(value) {
    print(EJSON.stringify(value, null, 2, { relaxed: true }));
  }

  function assertDeploymentSafety() {
    const currentDb = db.getName();
    if (currentDb !== requestedDb) {
      fail(`mongosh selected '${currentDb}', but FIXTURE_DB requested '${requestedDb}'.`);
    }
    const expected = {
      demo_db: {
        controller: "MyScoutee Demo Operator",
        email: "privacy@demo.myscoutee.test"
      },
      e2e_db: {
        controller: "MyScoutee E2E Operator",
        email: "privacy@e2e.myscoutee.test"
      }
    }[currentDb];
    if (!expected) {
      fail(`database '${currentDb}' is forbidden; only exact demo_db/e2e_db are accepted.`);
    }
    const marker = db.deploymentConfigurations.findOne({
      _id: "deployment-configuration",
      schemaVersion: 3
    });
    const contact = marker && marker.privacyContact ? marker.privacyContact : {};
    if (!marker
        || contact.dataControllerName !== expected.controller
        || contact.privacyContactEmail !== expected.email) {
      fail(
        `deployment marker mismatch for '${currentDb}'. Expected '${expected.controller}' `
          + `and '${expected.email}'. Refusing to continue.`
      );
    }
    return marker;
  }

  function snapshotId(job) {
    return `${PREFIX}:${job}`;
  }

  function fixtureId(job, suffix) {
    return `${PREFIX}:${job}:${suffix}`;
  }

  function collection(name) {
    return db.getCollection(name);
  }

  function requireOneSeededUser(excludedIds = []) {
    const excluded = new Set((excludedIds || []).map(safeText));
    const user = collection("users").find({
      userId: { $exists: true, $nin: ["", null, ...excluded] },
      profileStatus: { $nin: ["deleted", "onboarding"] }
    }).sort({ userId: 1 }).limit(1).toArray()[0];
    if (!user) {
      fail("the selected deployment has no seeded demo user suitable for this variation.");
    }
    return safeText(user.userId || user._id);
  }

  function requireSeededUsers(count) {
    const result = [];
    const cursor = collection("users").find({
      userId: { $exists: true, $nin: ["", null] },
      profileStatus: { $nin: ["deleted", "onboarding"] }
    }).sort({ userId: 1 });
    while (cursor.hasNext() && result.length < count) {
      const user = cursor.next();
      const userId = safeText(user.userId || user._id);
      if (userId && !result.includes(userId)) {
        result.push(userId);
      }
    }
    if (result.length < count) {
      fail(`variation needs ${count} seeded demo users, but found only ${result.length}.`);
    }
    return result;
  }

  function requireRule(ruleKey) {
    const rules = collection("notificationRuleConfigs")
      .find({ ruleKey })
      .limit(2)
      .toArray();
    if (rules.length !== 1) {
      fail(`expected exactly one notificationRuleConfigs document for '${ruleKey}', found ${rules.length}.`);
    }
    return rules[0];
  }

  function makeRuleDue(ruleKey, detail) {
    const currentRule = requireRule(ruleKey);
    if (currentRule.runState && currentRule.runState.currentStatus === "running") {
      fail(`rule '${ruleKey}' is currently running; wait for it to finish before preparing or re-triggering.`);
    }
    const now = nowIso();
    const result = collection("notificationRuleConfigs").updateOne(
      { ruleKey },
      {
        $set: {
          enabled: true,
          "runState.currentStatus": "idle",
          "runState.progressPercent": 0,
          "runState.progressDetail": detail || "Fixture is due for the next scheduled poll.",
          updatedDate: now,
          updatedUser: FIXTURE_ACTOR
        },
        $unset: {
          "runState.lastRunAtIso": "",
          "runState.runStartedAtIso": "",
          "runState.runFinishedAtIso": "",
          "runState.lastRunCount": "",
          "runState.lastError": ""
        }
      }
    );
    if (result.matchedCount !== 1) {
      fail(`could not make rule '${ruleKey}' due.`);
    }
  }

  function setFixturePendingCount(ruleKey, pendingCount, pendingCountUnit) {
    requireRule(ruleKey);
    const normalizedCount = Number(pendingCount);
    if (!Number.isInteger(normalizedCount) || normalizedCount < 0) {
      fail(`fixture pending count for '${ruleKey}' must be a non-negative integer.`);
    }
    const now = nowIso();
    const result = collection("notificationRuleConfigs").updateOne(
      { ruleKey },
      {
        $set: {
          "runState.pendingCount": normalizedCount,
          "runState.pendingCountUnit": safeText(pendingCountUnit) || "admin.jobs.table.affected",
          "runState.pendingCountUpdatedAtIso": now,
          updatedDate: now,
          updatedUser: FIXTURE_ACTOR
        }
      }
    );
    if (result.matchedCount !== 1) {
      fail(`could not persist fixture pending count for '${ruleKey}'.`);
    }
  }

  function normalizeSpecs(specs) {
    const result = [];
    const seenCollections = new Set();
    for (const spec of specs || []) {
      if (!spec || !safeText(spec.collection) || !spec.selector) {
        fail("every snapshot spec needs a collection and selector.");
      }
      if (seenCollections.has(spec.collection)) {
        fail(`snapshot has more than one selector for '${spec.collection}'; combine them with $or.`);
      }
      seenCollections.add(spec.collection);
      result.push({ collection: spec.collection, selector: spec.selector });
    }
    return result;
  }

  function snapshotOptionalField(value, key) {
    const source = value && typeof value === "object" ? value : {};
    return Object.prototype.hasOwnProperty.call(source, key)
      ? { present: true, value: source[key] }
      : { present: false };
  }

  function secondaryRuleKeys(job) {
    if (!Object.prototype.hasOwnProperty.call(SECONDARY_RULE_KEYS_BY_JOB, job)) {
      fail(`fixture '${job}' has no secondary Admin Job rule mapping.`);
    }
    return [...new Set(SECONDARY_RULE_KEYS_BY_JOB[job] || [])];
  }

  function beginSnapshot(job, variation, expected, context, specs, primaryRuleKey) {
    const id = snapshotId(job);
    const existing = collection(SNAPSHOT_COLLECTION).findOne({});
    if (existing) {
      fail(
        `'${existing.job}' is already prepared with variation '${existing.variation}'. `
          + `Only one fixture may be active at a time; run reset ${existing.job} first.`
      );
    }
    const normalizedSpecs = normalizeSpecs(specs);
    const snapshots = normalizedSpecs.map(spec => ({
      collection: spec.collection,
      selector: spec.selector,
      documents: collection(spec.collection).find(spec.selector).toArray()
    }));
    const secondaryRuleKeysForSnapshot = secondaryRuleKeys(job)
      .filter(ruleKey => ruleKey !== primaryRuleKey);
    const affectedRuleKeys = [
      ...(primaryRuleKey ? [primaryRuleKey] : []),
      ...secondaryRuleKeysForSnapshot
    ];
    for (const ruleKey of affectedRuleKeys) {
      const rule = requireRule(ruleKey);
      if (rule.runState && rule.runState.currentStatus === "running") {
        fail(
          `rule '${ruleKey}' is currently running; wait for it to finish before `
            + `preparing '${job}'.`
        );
      }
    }
    const secondaryRuleCounters = secondaryRuleKeysForSnapshot.map(ruleKey => {
      const rule = requireRule(ruleKey);
      return {
        ruleKey,
        pendingCount: snapshotOptionalField(rule.runState, "pendingCount"),
        pendingCountUnit: snapshotOptionalField(rule.runState, "pendingCountUnit"),
        pendingCountUpdatedAtIso: snapshotOptionalField(
          rule.runState,
          "pendingCountUpdatedAtIso"
        )
      };
    });
    const preparedAtIso = nowIso();
    const snapshot = {
      _id: id,
      fixtureVersion: 2,
      job,
      variation,
      expected,
      context: context || {},
      preparedAtIso,
      database: db.getName(),
      snapshots,
      secondaryRuleCounters
    };
    collection(SNAPSHOT_COLLECTION).insertOne(snapshot);
    return snapshot;
  }

  function activeSnapshot(job, required = false) {
    const snapshot = collection(SNAPSHOT_COLLECTION).findOne({ _id: snapshotId(job) });
    if (!snapshot && required) {
      fail(`'${job}' is not prepared. Run prepare ${job} <variation> first.`);
    }
    return snapshot;
  }

  function resetSnapshot(job) {
    const snapshot = activeSnapshot(job, false);
    if (!snapshot) {
      print(`[admin-job-fixtures] ${job}: nothing to reset.`);
      return;
    }
    const snapshots = snapshot.snapshots || [];
    const dataSnapshots = snapshots.filter(
      item => item.collection !== "notificationRuleConfigs"
    );
    const ruleSnapshots = snapshots.filter(
      item => item.collection === "notificationRuleConfigs"
    );
    const primaryRuleKeys = ruleSnapshots.flatMap(item => (item.documents || [])
      .map(document => safeText(document.ruleKey))
      .filter(Boolean));
    const secondaryRuleKeys = (snapshot.secondaryRuleCounters || [])
      .map(item => safeText(item.ruleKey))
      .filter(Boolean);
    const runningRule = [...new Set([...primaryRuleKeys, ...secondaryRuleKeys])]
      .map(ruleKey => collection("notificationRuleConfigs").findOne({ ruleKey }))
      .find(rule => rule && rule.runState && rule.runState.currentStatus === "running");
    if (runningRule) {
      fail(
        `rule '${safeText(runningRule.ruleKey)}' is currently running; wait for it `
          + `to finish before resetting '${job}'.`
      );
    }
    for (const item of dataSnapshots) {
      collection(item.collection).deleteMany(item.selector);
    }
    for (const item of dataSnapshots) {
      const documents = item.documents || [];
      if (documents.length > 0) {
        collection(item.collection).insertMany(documents, { ordered: true });
      }
    }
    for (const item of ruleSnapshots) {
      for (const document of item.documents || []) {
        const ruleKey = safeText(document.ruleKey);
        if (!ruleKey) {
          fail("snapshotted notification rule is missing ruleKey.");
        }
        const result = collection(item.collection).replaceOne(
          {
            ruleKey,
            "runState.currentStatus": { $ne: "running" }
          },
          document
        );
        if (result.matchedCount !== 1) {
          fail(
            `rule '${ruleKey}' started running during reset; wait for it to finish `
              + `and run reset '${job}' again.`
          );
        }
      }
    }
    for (const item of snapshot.secondaryRuleCounters || []) {
      const ruleKey = safeText(item.ruleKey);
      if (!ruleKey) {
        fail("snapshotted secondary notification rule is missing ruleKey.");
      }
      const update = { $set: {}, $unset: {} };
      for (const field of [
        "pendingCount",
        "pendingCountUnit",
        "pendingCountUpdatedAtIso"
      ]) {
        const fieldSnapshot = item[field] || { present: false };
        const path = `runState.${field}`;
        if (fieldSnapshot.present) {
          update.$set[path] = fieldSnapshot.value;
        } else {
          update.$unset[path] = "";
        }
      }
      if (Object.keys(update.$set).length === 0) {
        delete update.$set;
      }
      if (Object.keys(update.$unset).length === 0) {
        delete update.$unset;
      }
      const result = collection("notificationRuleConfigs").updateOne(
        {
          ruleKey,
          "runState.currentStatus": { $ne: "running" }
        },
        update
      );
      if (result.matchedCount !== 1) {
        fail(
          `rule '${ruleKey}' started running during reset; wait for it to finish `
            + `and run reset '${job}' again.`
        );
      }
    }
    collection(SNAPSHOT_COLLECTION).deleteOne({ _id: snapshot._id });
    print(
      `[admin-job-fixtures] ${job}: exact snapshotted documents, primary rule state, `
        + `and secondary rule counters restored; fixture namespace removed.`
    );
  }

  function summarizeRule(ruleKey) {
    if (!ruleKey) {
      return null;
    }
    const rule = requireRule(ruleKey);
    return {
      ruleKey,
      enabled: rule.enabled,
      manualRunEnabled: rule.manualRunEnabled,
      intervalSeconds: rule.timing && rule.timing.intervalSeconds,
      currentStatus: rule.runState && rule.runState.currentStatus,
      lastRunAtIso: rule.runState && rule.runState.lastRunAtIso,
      lastRunCount: rule.runState && rule.runState.lastRunCount,
      pendingCount: rule.runState && rule.runState.pendingCount,
      pendingCountUnit: rule.runState && rule.runState.pendingCountUnit,
      pendingCountUpdatedAtIso: rule.runState && rule.runState.pendingCountUpdatedAtIso,
      progressDetail: rule.runState && rule.runState.progressDetail
    };
  }

  function standardSpecs(ruleKey, specs) {
    const result = [...(specs || [])];
    const existingRuleSpec = result.find(
      spec => spec && spec.collection === "notificationRuleConfigs"
    );
    if (ruleKey) {
      if (existingRuleSpec) {
        existingRuleSpec.selector = {
          $or: [existingRuleSpec.selector, { ruleKey }]
        };
      } else {
        result.push({
          collection: "notificationRuleConfigs",
          selector: { ruleKey }
        });
      }
    }
    return result;
  }

  function run(definition) {
    assertDeploymentSafety();
    if (!definition || definition.job !== requestedJob) {
      fail(`scenario mismatch: requested '${requestedJob}'.`);
    }
    if (!["prepare", "status", "trigger", "reset"].includes(command)) {
      fail(`unsupported command '${command}'.`);
    }
    if (command === "reset") {
      resetSnapshot(definition.job);
      return;
    }
    if (command === "prepare") {
      if (!(definition.variations || []).includes(requestedVariation)) {
        fail(
          `unknown variation '${requestedVariation}' for '${definition.job}'. `
            + `Choose: ${(definition.variations || []).join(", ")}.`
        );
      }
      const setup = definition.build(requestedVariation) || {};
      const snapshot = beginSnapshot(
        definition.job,
        requestedVariation,
        setup.expected || "",
        setup.context || {},
        standardSpecs(definition.ruleKey, setup.specs),
        definition.ruleKey
      );
      try {
        definition.prepare(requestedVariation, setup.context || {}, snapshot);
        if (definition.ruleKey) {
          setFixturePendingCount(
            definition.ruleKey,
            setup.pendingCount,
            setup.pendingCountUnit
          );
        }
        if (definition.ruleKey && !definition.manualTrigger) {
          makeRuleDue(definition.ruleKey);
        }
      } catch (error) {
        print(
          `[admin-job-fixtures] preparation failed after snapshot. `
            + `The snapshot was kept; run reset ${definition.job}.`
        );
        throw error;
      }
      printObject({
        prepared: definition.job,
        variation: requestedVariation,
        database: db.getName(),
        preparedAtIso: snapshot.preparedAtIso,
        expected: setup.expected,
        next: safeText(setup.next) || (definition.manualTrigger
          ? `Use Admin > Admin Jobs > ${definition.job} > Run, then run status ${definition.job}.`
          : `The data and rule are due. Keep the existing app running and run status ${definition.job} after its next scheduler poll.`)
      });
      if (definition.afterPrepare) {
        definition.afterPrepare(requestedVariation, setup.context || {}, snapshot);
      }
      return;
    }
    if (command === "trigger") {
      const snapshot = activeSnapshot(definition.job, true);
      if (definition.manualTrigger) {
        print(
          `[admin-job-fixtures] ${definition.job} is intentionally not invoked by an endpoint. `
            + `Open Admin > Admin Jobs > ${definition.job} > Run.`
        );
      } else if (definition.ruleKey) {
        makeRuleDue(definition.ruleKey, "Fixture trigger re-armed this rule for the next scheduler poll.");
        print(
          `[admin-job-fixtures] ${definition.job}: rule timestamp re-armed. `
            + `No process was started; the existing app scheduler must pick it up.`
        );
      } else {
        print(
          `[admin-job-fixtures] ${definition.job} is an interaction check, not a scheduled job. `
            + `Follow the manual action printed by prepare/status.`
        );
      }
      if (definition.trigger) {
        definition.trigger(snapshot.context || {}, snapshot);
      }
      return;
    }
    const snapshot = activeSnapshot(definition.job, false);
    const context = snapshot ? snapshot.context || {} : {};
    const details = definition.status(context, snapshot) || {};
    printObject({
      job: definition.job,
      database: db.getName(),
      prepared: Boolean(snapshot),
      variation: snapshot && snapshot.variation,
      preparedAtIso: snapshot && snapshot.preparedAtIso,
      expected: snapshot && snapshot.expected,
      rule: summarizeRule(definition.ruleKey),
      current: details
    });
  }

  globalThis.AdminJobFixture = {
    PREFIX,
    SNAPSHOT_COLLECTION,
    FIXTURE_ACTOR,
    activeSnapshot,
    collection,
    fail,
    fixtureId,
    futureIso,
    makeRuleDue,
    nowIso,
    pastIso,
    printObject,
    requireOneSeededUser,
    requireRule,
    requireSeededUsers,
    run,
    safeText
  };
})();
