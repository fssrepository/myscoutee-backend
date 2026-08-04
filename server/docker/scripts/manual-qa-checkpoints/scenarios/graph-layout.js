/* global ManualQa, db, process */
(() => {
  "use strict";

  const Q = ManualQa;
  const SCENARIO = "graph-layout";
  const RULE_KEY = "affinity-graph-layout";
  const command = Q.text(process.env.MANUAL_QA_COMMAND);
  const delaySeconds = Number(process.env.MANUAL_QA_DELAY_SECONDS || 30);

  function latestLayout() {
    const layout = Q.collection("adminAffinityGraphLayouts").find({})
      .sort({ generatedAtIso: -1 }).limit(1).toArray()[0] || null;
    if (!layout) {
      return {
        layoutVersion: null,
        generatedAtIso: null,
        source: "live-fallback",
        memberCount: 0,
        linkCount: 0,
        componentCount: 0,
        isolatedCount: 0,
        storedNodes: 0,
        storedEdges: 0,
        storedForests: 0
      };
    }
    const layoutVersion = Q.text(layout.layoutVersion);
    return {
      layoutVersion,
      generatedAtIso: layout.generatedAtIso,
      source: Q.text(layout.source),
      memberCount: Q.number(layout.memberCount),
      linkCount: Q.number(layout.linkCount),
      componentCount: Q.number(layout.componentCount),
      isolatedCount: Q.number(layout.isolatedCount),
      storedNodes: Q.collection("adminAffinityGraphNodes").countDocuments({ layoutVersion }),
      storedEdges: Q.collection("adminAffinityGraphEdges").countDocuments({ layoutVersion }),
      storedForests: Q.collection("adminAffinityGraphForests").countDocuments({ layoutVersion })
    };
  }

  function stage() {
    Q.assertNotStaged(SCENARIO);
    Q.assertNoOtherActiveScenario(SCENARIO);
    const rule = Q.assertRuleNotRunning(RULE_KEY);
    const stagedAtIso = Q.nowIso();
    const state = {
      _id: Q.stateId(SCENARIO),
      scenario: SCENARIO,
      database: db.getName(),
      stagedAtIso,
      scheduledAtIso: null,
      originalRule: Q.ruleConfigSnapshot(rule),
      baseline: null,
      snapshots: []
    };
    Q.collection(Q.STATE_COLLECTION).insertOne(state);
    try {
      Q.holdRule(
        RULE_KEY,
        0,
        "Manual QA affinity graph layout baseline is held until observation windows are open."
      );
      const baseline = latestLayout();
      const snapshots = Q.snapshotSpecs([
        { collection: "adminAffinityGraphLayouts", selector: {} },
        { collection: "adminAffinityGraphNodes", selector: {} },
        { collection: "adminAffinityGraphEdges", selector: {} },
        { collection: "adminAffinityGraphForests", selector: {} }
      ]);
      Q.collection(Q.STATE_COLLECTION).updateOne(
        { _id: state._id },
        { $set: { baseline, snapshots } }
      );
      state.baseline = baseline;
    } catch (error) {
      Q.fail(`stage failed after the rule snapshot: ${Q.text(error && error.message)}. Run reset graph-layout.`);
    }
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: "GRAPH-LAYOUT-001",
      phase: "baseline-ready",
      stagedAtIso,
      baseline: state.baseline,
      rule: Q.ruleSummary(RULE_KEY),
      why: "Prove that the real daily job publishes one complete materialized Admin Affinity Graph layout in the same HTTP demo and production code path.",
      what: "Capture the held Admin Job detail and the reopened Admin Affinity Graph before making the persisted schedule due.",
      expected: "The job is idle with a one-hour hold. The graph reports the baseline layout version, or live fallback if no successful layout exists yet.",
      next: "Open Admin Jobs > Rebuild affinity graph layout and Admin Affinity Graph. Capture both baselines, then run schedule graph-layout 30."
    });
  }

  function schedule() {
    const state = Q.activeState(SCENARIO, true);
    Q.assertRuleNotRunning(RULE_KEY);
    if (state.scheduledAtIso) Q.fail("graph-layout is already scheduled; use status or reset.");
    const timing = Q.scheduleRule(RULE_KEY, delaySeconds);
    Q.collection(Q.STATE_COLLECTION).updateOne(
      { _id: state._id },
      { $set: { ...timing } }
    );
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: "GRAPH-LAYOUT-001",
      phase: "scheduled-waiting",
      ...timing,
      why: "Prove scheduler attribution rather than endpoint or direct-database execution.",
      what: "Keep the Admin Job detail and Admin Affinity Graph windows open while the existing scheduler reaches the printed due time.",
      expected: "The job enters running and then completed once. After reopening the graph, its layoutVersion and generatedAtIso are newer than the baseline.",
      next: "Wait for the normal scheduler, capture the running/completed checkpoint if visible, then run status graph-layout."
    });
  }

  function status() {
    const state = Q.activeState(SCENARIO, false);
    if (!state) {
      Q.printObject({
        scenario: SCENARIO,
        checkpointId: "GRAPH-LAYOUT-001",
        phase: "not-staged",
        next: "Run stage graph-layout only when no other manual checkpoint is active."
      });
      return;
    }
    const current = latestLayout();
    const ruleDocument = Q.requireRule(RULE_KEY);
    const runState = ruleDocument.runState || {};
    const scheduledRuleObserved = Boolean(state.scheduledAtIso)
      && Q.text(runState.lastRunAtIso) >= Q.text(state.scheduledAtIso);
    const newLayoutPublished = Boolean(state.scheduledAtIso)
      && Q.text(current.generatedAtIso) >= Q.text(state.scheduledAtIso)
      && Q.text(current.layoutVersion) !== Q.text(state.baseline && state.baseline.layoutVersion);
    const validation = {
      scheduledRunCompleted: scheduledRuleObserved && runState.lastRunStatus === "completed",
      newMaterializedLayoutPublished: newLayoutPublished && current.source === "materialized",
      storedNodeCountMatches: current.storedNodes === current.memberCount,
      storedEdgeCountMatches: current.storedEdges === current.linkCount,
      storedForestCountMatches: current.storedForests === current.componentCount
    };
    const complete = Object.values(validation).every(Boolean);
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: "GRAPH-LAYOUT-001",
      phase: complete ? "completed" : state.scheduledAtIso ? "scheduled-waiting" : "baseline-ready",
      baseline: state.baseline,
      current,
      rule: {
        ...Q.ruleSummary(RULE_KEY),
        lastRunStatus: runState.lastRunStatus,
        lastRunDetail: runState.lastRunDetail,
        runHistory: (ruleDocument.runHistory || []).slice(-3).map(entry => ({
          trigger: entry.trigger,
          status: entry.status,
          startedAtIso: entry.startedAtIso,
          finishedAtIso: entry.finishedAtIso,
          processedCount: entry.processedCount,
          detail: entry.detail
        }))
      },
      validation,
      next: complete
        ? "Reopen Admin Affinity Graph, capture its new layout version and totals, then reset graph-layout."
        : "Wait for the existing scheduler or reopen the graph after completion, then run status graph-layout again."
    });
  }

  function reset() {
    const state = Q.activeState(SCENARIO, true);
    Q.assertRuleNotRunning(RULE_KEY);
    Q.restoreSnapshots(state.snapshots);
    Q.restoreRuleConfig(state.originalRule);
    Q.collection(Q.STATE_COLLECTION).deleteOne({ _id: state._id });
    Q.printObject({
      scenario: SCENARIO,
      checkpointId: "GRAPH-LAYOUT-001",
      phase: "reset-complete",
      restored: true,
      detail: "The pre-test materialized graph collections and the original daily scheduler configuration were restored. Scheduler run history remains as QA evidence."
    });
  }

  Q.assertDeploymentSafety();
  if (command === "stage") stage();
  else if (command === "schedule") schedule();
  else if (command === "status") status();
  else if (command === "reset") reset();
  else Q.fail(`unsupported command '${command}' for ${SCENARIO}.`);
})();
