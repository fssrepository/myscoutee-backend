/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "scheduled-messages";
  const userId = F.fixtureId(job, "user");
  const taskId = F.fixtureId(job, "task");
  const taskKey = F.fixtureId(job, "inactivity");

  F.run({
    job,
    ruleKey: job,
    variations: ["inactive-user", "recent-user"],
    build(variation) {
      const isolatedTaskIds = F.collection("scheduledMessageTasks")
        .find({
          _id: { $ne: taskId },
          status: "scheduled",
          suspended: { $ne: true },
          dueAtIso: { $lte: F.futureIso(5) }
        }, { projection: { _id: 1 } })
        .map(task => task._id)
        .toArray();
      return {
        pendingCount: 1,
        pendingCountUnit: "admin.jobs.rule.scheduled.messages",
        expected: variation === "inactive-user"
          ? "The task completes with lastRunCount=1 and the fixture user changes to status=I/profileStatus=inactive."
          : "The task remains scheduled and dueAtIso moves about 30 days after the recent device activity.",
        context: { userId, taskId, taskKey, isolatedTaskIds },
        specs: [
          { collection: "users", selector: { _id: userId } },
          {
            collection: "scheduledMessageTasks",
            selector: {
              $or: [
                { taskKey },
                { _id: { $in: isolatedTaskIds } }
              ]
            }
          },
          { collection: "scheduledMessageRuns", selector: { ruleKey: taskKey } },
          { collection: "scheduledMessageDeliveries", selector: { ruleKey: taskKey } },
          { collection: "affinityRecomputeTasks", selector: { targetId: userId } },
          {
            collection: "userAffinityEdges",
            selector: { $or: [{ leftUserId: userId }, { rightUserId: userId }] }
          },
          {
            collection: "userRates",
            selector: { $or: [{ ownerUserId: userId }, { relatedUserId: userId }] }
          }
        ]
      };
    },
    prepare(variation, context) {
      const now = F.nowIso();
      if ((context.isolatedTaskIds || []).length > 0) {
        F.collection("scheduledMessageTasks").updateMany(
          { _id: { $in: context.isolatedTaskIds } },
          {
            $set: {
              suspended: true,
              updatedDate: now,
              updatedUser: F.FIXTURE_ACTOR
            }
          }
        );
      }
      const user = {
        _id: userId,
        userId,
        syncKey: userId,
        name: "Admin fixture scheduled-message user",
        initials: "SM",
        status: "A",
        profileStatus: "public",
        devices: [],
        createdDate: F.pastIso(60 * 24 * 40),
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      };
      if (variation === "recent-user") {
        user.devices = [{
          deviceId: F.fixtureId(job, "device"),
          lastSeenAtIso: now,
          lastRegisteredAtIso: now
        }];
      }
      F.collection("users").insertOne(user);
      F.collection("scheduledMessageTasks").insertOne({
        _id: taskId,
        taskKey,
        syncKey: taskId,
        actionKey: "user.profile.inactivate-after-inactivity",
        userId,
        dueAtIso: F.pastIso(5),
        status: "scheduled",
        suspended: false,
        pendingCounterTracked: true,
        payload: { inactiveDays: "30" },
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });
    },
    status(context) {
      const currentTask = F.collection("scheduledMessageTasks").findOne({
        taskKey: context.taskKey || taskKey
      });
      const user = F.collection("users").findOne({ _id: context.userId || userId });
      return {
        quarantinedPreexistingDueTasks: (context.isolatedTaskIds || []).length,
        task: currentTask && {
          id: currentTask._id,
          status: currentTask.status,
          dueAtIso: currentTask.dueAtIso,
          lastRunAtIso: currentTask.lastRunAtIso,
          lastRunStatus: currentTask.lastRunStatus,
          lastRunCount: currentTask.lastRunCount,
          lastRunDetail: currentTask.lastRunDetail
        },
        user: user && {
          id: user._id,
          status: user.status,
          profileStatus: user.profileStatus
        },
        auditRuns: F.collection("scheduledMessageRuns")
          .find({ ruleKey: context.taskKey || taskKey })
          .sort({ startedAtIso: -1 })
          .map(run => ({
            status: run.status,
            affectedCount: run.affectedCount,
            failedCount: run.failedCount,
            detail: run.detail
          }))
          .toArray(),
        deliveries: F.collection("scheduledMessageDeliveries").countDocuments({
          ruleKey: context.taskKey || taskKey
        })
      };
    }
  });
})();
