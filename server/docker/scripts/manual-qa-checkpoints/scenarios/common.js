/* global db, EJSON, print, process */
(() => {
  "use strict";

  const STATE_COLLECTION = "manualQaCheckpointSnapshots";
  const ACTOR = "manual-qa-checkpoint:v1:actor";

  function text(value) {
    return value == null ? "" : String(value).trim();
  }

  function fail(message) {
    throw new Error(`[manual-qa-checkpoints] ${message}`);
  }

  function printObject(value) {
    print(EJSON.stringify(value, null, 2, { relaxed: true }));
  }

  function collection(name) {
    return db.getCollection(name);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function assertDeploymentSafety() {
    const currentDb = db.getName();
    const requestedDb = text(process.env.MANUAL_QA_DB);
    if (currentDb !== requestedDb) {
      fail(`mongosh selected '${currentDb}', but MANUAL_QA_DB requested '${requestedDb}'.`);
    }
    const expected = {
      demo_db: ["MyScoutee Demo Operator", "privacy@demo.myscoutee.test"],
      e2e_db: ["MyScoutee E2E Operator", "privacy@e2e.myscoutee.test"]
    }[currentDb];
    if (!expected) {
      fail(`database '${currentDb}' is forbidden; only exact demo_db/e2e_db are accepted.`);
    }
    const marker = collection("deploymentConfigurations").findOne({
      _id: "deployment-configuration",
      schemaVersion: 4
    });
    const contact = marker && marker.privacyContact ? marker.privacyContact : {};
    if (!marker
        || contact.dataControllerName !== expected[0]
        || contact.privacyContactEmail !== expected[1]) {
      fail(`deployment marker mismatch for '${currentDb}'; refusing to continue.`);
    }
  }

  function stateId(scenario) {
    return `manual-qa-checkpoint:v1:${scenario}:state`;
  }

  function activeState(scenario, required = false) {
    const state = collection(STATE_COLLECTION).findOne({ _id: stateId(scenario) });
    if (!state && required) {
      fail(`${scenario} is not staged; run 'stage ${scenario}' first.`);
    }
    return state;
  }

  function assertNotStaged(scenario) {
    if (activeState(scenario, false)) {
      fail(`${scenario} is already staged; use status or reset first.`);
    }
  }

  function assertNoOtherActiveScenario(scenario) {
    const other = collection(STATE_COLLECTION).findOne({ _id: { $ne: stateId(scenario) } });
    if (other) {
      fail(`another manual scenario '${text(other.scenario)}' is staged; reset it before staging ${scenario}.`);
    }
  }

  function snapshotSpecs(specs) {
    return (specs || []).map(spec => ({
      collection: spec.collection,
      selector: spec.selector,
      documents: collection(spec.collection).find(spec.selector).toArray()
    }));
  }

  function restoreSnapshots(snapshots) {
    for (const snapshot of snapshots || []) {
      collection(snapshot.collection).deleteMany(snapshot.selector);
      if (snapshot.documents && snapshot.documents.length > 0) {
        collection(snapshot.collection).insertMany(snapshot.documents);
      }
    }
  }

  function user(userId) {
    const value = collection("users").findOne({
      $or: [{ _id: userId }, { userId }]
    });
    return {
      userId,
      name: text(value && value.name),
      city: text(value && value.city),
      profileStatus: text(value && value.profileStatus)
    };
  }

  function userIdOf(value) {
    return text(value && (value.userId || value._id));
  }

  function ensureUser(userId, label) {
    const value = collection("users").findOne({ $or: [{ _id: userId }, { userId }] });
    if (!value) fail(`${label || "user"} '${userId}' was not found.`);
    return value;
  }

  function number(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function mapNumber(source, key) {
    return number(source && source[key]);
  }

  function canonical(value) {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === "object" && value.constructor === Object) {
      const result = {};
      for (const key of Object.keys(value).sort()) result[key] = canonical(value[key]);
      return result;
    }
    return value;
  }

  function sameJson(left, right) {
    return EJSON.stringify(canonical(left), null, 0, { relaxed: false })
      === EJSON.stringify(canonical(right), null, 0, { relaxed: false });
  }

  function requireRule(ruleKey) {
    const values = collection("notificationRuleConfigs").find({ ruleKey }).limit(2).toArray();
    if (values.length !== 1) fail(`expected exactly one rule '${ruleKey}', found ${values.length}.`);
    return values[0];
  }

  function assertRuleNotRunning(ruleKey) {
    const rule = requireRule(ruleKey);
    if (rule.runState && rule.runState.currentStatus === "running") {
      fail(`rule '${ruleKey}' is running; wait for a terminal state and retry.`);
    }
    return rule;
  }

  function ruleConfigSnapshot(rule) {
    return {
      ruleId: rule._id,
      ruleKey: rule.ruleKey,
      enabled: rule.enabled,
      manualRunEnabled: rule.manualRunEnabled,
      timing: rule.timing,
      scheduleSlots: rule.scheduleSlots,
      pendingCount: rule.runState && Object.prototype.hasOwnProperty.call(rule.runState, "pendingCount")
        ? { present: true, value: rule.runState.pendingCount }
        : { present: false },
      pendingCountUnit: rule.runState && Object.prototype.hasOwnProperty.call(rule.runState, "pendingCountUnit")
        ? { present: true, value: rule.runState.pendingCountUnit }
        : { present: false },
      pendingCountUpdatedAtIso: rule.runState
        && Object.prototype.hasOwnProperty.call(rule.runState, "pendingCountUpdatedAtIso")
        ? { present: true, value: rule.runState.pendingCountUpdatedAtIso }
        : { present: false }
    };
  }

  function restoreRuleConfig(saved) {
    if (!saved) return;
    const setValues = {
      enabled: saved.enabled,
      manualRunEnabled: saved.manualRunEnabled,
      timing: saved.timing,
      scheduleSlots: saved.scheduleSlots,
      updatedDate: nowIso(),
      updatedUser: ACTOR
    };
    const unsetValues = {};
    for (const field of ["pendingCount", "pendingCountUnit", "pendingCountUpdatedAtIso"]) {
      const record = saved[field];
      const path = `runState.${field}`;
      if (record && record.present) setValues[path] = record.value;
      else unsetValues[path] = "";
    }
    const update = { $set: setValues };
    if (Object.keys(unsetValues).length > 0) update.$unset = unsetValues;
    collection("notificationRuleConfigs").updateOne({ _id: saved.ruleId }, update);
  }

  function holdRule(ruleKey, pendingCount, detail, intervalSeconds = 3600) {
    const now = nowIso();
    const result = collection("notificationRuleConfigs").updateOne(
      { ruleKey, "runState.currentStatus": { $ne: "running" } },
      {
        $set: {
          enabled: true,
          manualRunEnabled: false,
          scheduleSlots: [],
          "timing.mode": "interval",
          "timing.intervalAmount": 1,
          "timing.intervalUnit": "hours",
          "timing.intervalSeconds": intervalSeconds,
          "timing.intervalMinutes": 60,
          "timing.time": "00:00",
          "timing.timezone": "UTC",
          "runState.currentStatus": "idle",
          "runState.progressPercent": 0,
          "runState.progressDetail": detail,
          "runState.lastRunAtIso": now,
          "runState.pendingCount": pendingCount,
          "runState.pendingCountUpdatedAtIso": now,
          updatedDate: now,
          updatedUser: ACTOR
        },
        $unset: {
          "runState.startedAtIso": "",
          "runState.finishedAtIso": "",
          "runState.lastError": ""
        }
      }
    );
    if (result.matchedCount !== 1) fail(`rule '${ruleKey}' became running while staging.`);
  }

  function scheduleRule(ruleKey, delaySeconds, intervalSeconds = 3600) {
    if (!Number.isInteger(delaySeconds) || delaySeconds < 10 || delaySeconds > 120) {
      fail("delay-seconds must be an integer from 10 through 120.");
    }
    const scheduledAt = new Date();
    const lastRunAt = new Date(scheduledAt.getTime() - (intervalSeconds - delaySeconds) * 1000);
    const dueAt = new Date(lastRunAt.getTime() + intervalSeconds * 1000);
    const result = collection("notificationRuleConfigs").updateOne(
      { ruleKey, "runState.currentStatus": { $ne: "running" } },
      {
        $set: {
          enabled: true,
          manualRunEnabled: false,
          scheduleSlots: [],
          "timing.mode": "interval",
          "timing.intervalAmount": 1,
          "timing.intervalUnit": "hours",
          "timing.intervalSeconds": intervalSeconds,
          "timing.intervalMinutes": 60,
          "timing.time": "00:00",
          "timing.timezone": "UTC",
          "runState.currentStatus": "idle",
          "runState.progressPercent": 0,
          "runState.progressDetail": `Manual QA scheduled: eligible after ${dueAt.toISOString()}.`,
          "runState.lastRunAtIso": lastRunAt.toISOString(),
          "runState.pendingCountUpdatedAtIso": scheduledAt.toISOString(),
          updatedDate: scheduledAt.toISOString(),
          updatedUser: ACTOR
        },
        $unset: {
          "runState.startedAtIso": "",
          "runState.finishedAtIso": "",
          "runState.lastError": ""
        }
      }
    );
    if (result.matchedCount !== 1) fail(`rule '${ruleKey}' became running while scheduling.`);
    return {
      scheduledAtIso: scheduledAt.toISOString(),
      expectedDueAtIso: dueAt.toISOString(),
      delaySeconds,
      expectedRunWindow: {
        earliestIso: dueAt.toISOString(),
        latestApproxIso: new Date(dueAt.getTime() + 60000).toISOString()
      }
    };
  }

  function ruleSummary(ruleKey) {
    const rule = requireRule(ruleKey);
    const timing = rule.timing || {};
    const runState = rule.runState || {};
    const intervalSeconds = number(timing.intervalSeconds);
    const lastRun = new Date(text(runState.lastRunAtIso));
    const dueAt = Number.isFinite(lastRun.getTime()) && intervalSeconds > 0
      ? new Date(lastRun.getTime() + intervalSeconds * 1000)
      : null;
    return {
      ruleKey,
      intervalSeconds,
      currentStatus: runState.currentStatus,
      lastRunAtIso: runState.lastRunAtIso,
      lastRunCount: runState.lastRunCount,
      pendingCount: runState.pendingCount,
      progressDetail: runState.progressDetail,
      calculatedDueAtIso: dueAt && dueAt.toISOString()
    };
  }

  globalThis.ManualQa = {
    ACTOR,
    STATE_COLLECTION,
    text,
    fail,
    printObject,
    collection,
    nowIso,
    assertDeploymentSafety,
    stateId,
    activeState,
    assertNotStaged,
    assertNoOtherActiveScenario,
    snapshotSpecs,
    restoreSnapshots,
    user,
    userIdOf,
    ensureUser,
    number,
    mapNumber,
    sameJson,
    requireRule,
    assertRuleNotRunning,
    ruleConfigSnapshot,
    restoreRuleConfig,
    holdRule,
    scheduleRule,
    ruleSummary
  };
})();
