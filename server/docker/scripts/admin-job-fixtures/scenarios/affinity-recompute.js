/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "affinity-recompute";
  const userId = F.fixtureId(job, "user");
  const taskId = F.fixtureId(job, "task");
  const taskKey = `USER:${userId}`;

  F.run({
    job,
    ruleKey: job,
    variations: ["isolated-user"],
    build() {
      const isolatedTaskIds = F.collection("affinityRecomputeTasks")
        .find({
          _id: { $ne: taskId },
          status: "pending",
          availableAtIso: { $lte: F.nowIso() }
        }, { projection: { _id: 1 } })
        .map(task => task._id)
        .toArray();
      return {
        pendingCount: 1,
        pendingCountUnit: "admin.jobs.rule.affinity.recompute",
        expected: "The due task moves pending -> running -> done, attemptCount becomes 1, and the isolated user's derived affinity/rate state is recomputed without touching seeded users.",
        context: { userId, taskId, taskKey, isolatedTaskIds },
        specs: [
          { collection: "users", selector: { _id: userId } },
          {
            collection: "affinityRecomputeTasks",
            selector: {
              $or: [
                { _id: { $in: [...isolatedTaskIds, taskId] } },
                { targetId: userId },
                { taskKey }
              ]
            }
          },
          {
            collection: "userAffinityEdges",
            selector: { $or: [{ leftUserId: userId }, { rightUserId: userId }] }
          },
          {
            collection: "userRates",
            selector: {
              $or: [
                { ownerUserId: userId },
                { relatedUserId: userId },
                { secondaryRelatedUserId: userId }
              ]
            }
          }
        ]
      };
    },
    prepare(variation, context) {
      const now = F.nowIso();
      if ((context.isolatedTaskIds || []).length > 0) {
        F.collection("affinityRecomputeTasks").updateMany(
          { _id: { $in: context.isolatedTaskIds } },
          {
            $set: {
              availableAtIso: "2099-01-01T00:00:00.000Z",
              updatedDate: now,
              updatedUser: F.FIXTURE_ACTOR
            }
          }
        );
      }
      F.collection("users").insertOne({
        _id: userId,
        userId,
        syncKey: userId,
        name: "Admin fixture isolated affinity user",
        initials: "AF",
        status: "A",
        profileStatus: "public",
        affinity: 0,
        activities: {},
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });
      F.collection("affinityRecomputeTasks").insertOne({
        _id: taskId,
        version: 0,
        taskKey,
        targetType: "USER",
        targetId: userId,
        reasons: ["USER_CHANGED"],
        status: "pending",
        pendingCounterTracked: true,
        availableAtIso: F.pastIso(5),
        rerunRequested: false,
        attemptCount: 0,
        createdDate: now,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });
    },
    status(context) {
      const currentTask = F.collection("affinityRecomputeTasks").findOne({
        taskKey: context.taskKey || taskKey
      });
      const user = F.collection("users").findOne({ _id: context.userId || userId });
      return {
        quarantinedPreexistingDueTasks: (context.isolatedTaskIds || []).length,
        task: currentTask && {
          id: currentTask._id,
          taskKey: currentTask.taskKey,
          targetType: currentTask.targetType,
          status: currentTask.status,
          attemptCount: currentTask.attemptCount,
          availableAtIso: currentTask.availableAtIso,
          leaseUntilIso: currentTask.leaseUntilIso,
          completedAtIso: currentTask.completedAtIso,
          lastError: currentTask.lastError
        },
        user: user && {
          id: user._id,
          status: user.status,
          profileStatus: user.profileStatus,
          affinity: user.affinity,
          updatedUser: user.updatedUser
        },
        affinityEdgeCount: F.collection("userAffinityEdges").countDocuments({
          $or: [{ leftUserId: context.userId || userId }, { rightUserId: context.userId || userId }]
        }),
        rateCount: F.collection("userRates").countDocuments({
          $or: [
            { ownerUserId: context.userId || userId },
            { relatedUserId: context.userId || userId },
            { secondaryRelatedUserId: context.userId || userId }
          ]
        })
      };
    }
  });
})();
