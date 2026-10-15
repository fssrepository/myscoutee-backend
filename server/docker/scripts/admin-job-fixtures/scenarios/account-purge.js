/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "account-purge";
  const userId = F.fixtureId(job, "user");
  const purgeJobId = F.fixtureId(job, "purge-job");
  const rateId = F.fixtureId(job, "rate");

  F.run({
    job,
    ruleKey: job,
    ruleScope: { baseGroupId: null },
    variations: ["isolated", "with-reference", "with-mcp-events"],
    build(variation) {
      const isolatedUserIds = F.collection("users")
        .find({
          _id: { $ne: userId },
          profileStatus: { $in: ["deleted", "onboarding"] },
          deletedAtIso: { $exists: true, $nin: ["", null], $lte: F.nowIso() }
        }, { projection: { _id: 1 } })
        .map(user => user._id)
        .toArray();
      const isolatedPurgeJobIds = F.collection("accountPurgeJobs")
        .find({
          _id: { $ne: purgeJobId },
          status: { $in: ["pending", "running", "failed"] },
          userId: { $exists: true, $nin: ["", null] }
        }, { projection: { _id: 1 } })
        .map(item => item._id)
        .toArray();
      return {
        pendingCount: 1,
        pendingCountUnit: "admin.jobs.table.affected",
        expected: variation === "with-reference"
          ? "The expired fixture user and its userRates reference disappear; the purge job finishes completed with userId cleared."
          : "The expired fixture user disappears; the purge job finishes completed with userId cleared.",
        context: {
          userId,
          purgeJobId,
          rateId,
          withReference: variation === "with-reference",
          withMcpEvents: variation === "with-mcp-events",
          isolatedUserIds,
          isolatedPurgeJobIds
        },
        specs: [
          {
            collection: "users",
            selector: { _id: { $in: [...isolatedUserIds, userId] } }
          },
          {
            collection: "accountPurgeJobs",
            selector: { _id: { $in: [...isolatedPurgeJobIds, purgeJobId] } }
          },
          {
            collection: "userRates",
            selector: {
              $or: [
                { _id: rateId },
                { ownerUserId: userId },
                { relatedUserId: userId },
                { secondaryRelatedUserId: userId },
                { bridgeUserId: userId }
              ]
            }
          },
          {
            collection: "userAffinityEdges",
            selector: { $or: [{ leftUserId: userId }, { rightUserId: userId }] }
          },
          { collection: "userExperienceProfiles", selector: { userId } },
          { collection: "userFilterPreferences", selector: { userId } },
          { collection: "privacyConsents", selector: { userId } },
          { collection: "userFeedback", selector: { userId } },
          {
            collection: "userReports",
            selector: { $or: [{ userId }, { targetUserId: userId }] }
          },
          { collection: "userSessionActions", selector: { userId } },
          { collection: "payments", selector: { userId } },
          { collection: "scheduledMessageTasks", selector: { userId } },
          { collection: "scheduledMessageDeliveries", selector: { userId } },
          { collection: "emailOutbox", selector: { userId } },
          { collection: "notificationOutbox", selector: { recipientUserIds: userId } },
          { collection: "userNotifications", selector: { recipientUserId: userId } },
          {
            collection: "feedbackAnswers",
            selector: { $or: [{ viewerUserId: userId }, { targetUserId: userId }] }
          },
          { collection: "feedbackStates", selector: { viewerUserId: userId } },
          { collection: "affinityRecomputeTasks", selector: { targetId: { $in: [userId, `USER:${userId}`] } } },
          { collection: "shareTokens", selector: { ownerUserId: userId } },
          ...(variation === "with-mcp-events" ? ["mcpEventSubscriptions", "integrationWebhookDeliveries"].map(collection => ({
            collection, selector: { _id: { $in: [F.fixtureId(job, "mcp-owned"), F.fixtureId(job, "mcp-control")] } }
          })) : [])
        ]
      };
    },
    prepare(variation, context) {
      const now = F.nowIso();
      if ((context.isolatedUserIds || []).length > 0) {
        F.collection("users").updateMany(
          { _id: { $in: context.isolatedUserIds } },
          {
            $set: {
              deletedAtIso: "2099-01-01T00:00:00.000Z",
              updatedDate: now,
              updatedUser: F.FIXTURE_ACTOR
            }
          }
        );
      }
      if ((context.isolatedPurgeJobIds || []).length > 0) {
        F.collection("accountPurgeJobs").updateMany(
          { _id: { $in: context.isolatedPurgeJobIds } },
          {
            $set: {
              status: "running",
              lockedUntilIso: "2099-01-01T00:00:00.000Z",
              updatedDate: now
            }
          }
        );
      }
      F.collection("users").insertOne({
        _id: userId,
        userId,
        syncKey: userId,
        name: "Admin fixture expired deleted user",
        initials: "DP",
        status: "D",
        profileStatus: "deleted",
        accountPurgePendingCounterTracked: true,
        deletedAtIso: F.pastIso(60 * 24 * 45),
        images: [],
        createdDate: F.pastIso(60 * 24 * 90),
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });
      F.collection("accountPurgeJobs").insertOne({
        _id: purgeJobId,
        userId,
        userHash: F.fixtureId(job, "hash"),
        status: "pending",
        stage: "queued",
        ownedEventIds: [],
        ownedAssetIds: [],
        retryCount: 0,
        createdDate: now,
        updatedDate: now
      });
      if (variation === "with-mcp-events") {
        for (const control of [false, true]) {
          const id = F.fixtureId(job, control ? "mcp-control" : "mcp-owned");
          const owner = control ? F.fixtureId(job, "control-user") : userId;
          F.collection("mcpEventSubscriptions").insertOne({
            _id: id, ownerUserId: owner, name: "event.changed", resourceId: id,
            tokenId: id, clientId: id, grantId: id, generation: id,
            enabled: false, secret: null, expiresAt: new Date(Date.now() + 3600000),
            deleteAfter: new Date(Date.now() + 8 * 86400000)
          });
          F.collection("integrationWebhookDeliveries").insertOne({
            _id: id, ownerUserId: owner, subscriptionId: id, subscriptionGeneration: id,
            protocol: "mcp-events", eventType: "event.changed", resourceType: "event", resourceExternalId: id,
            status: "PENDING", attemptCount: 0, createdAtIso: now,
            nextAttemptAtIso: new Date(Date.now() + 3600000).toISOString(),
            payloadJson: JSON.stringify({ eventId: id, name: "event.changed", data: { fixture: true } }),
            deleteAfter: new Date(Date.now() + 7 * 86400000)
          });
        }
      }
      if (variation === "with-reference") {
        F.collection("userRates").insertOne({
          _id: rateId,
          syncKey: rateId,
          mode: "single",
          ownerUserId: userId,
          relatedUserId: F.requireOneSeededUser(),
          scoreGiven: 8,
          scoreReceived: 0,
          met: true,
          createdDate: now,
          createdUser: userId,
          updatedDate: now,
          updatedUser: userId
        });
      }
    },
    status(context) {
      const currentUserId = context.userId || userId;
      const purge = F.collection("accountPurgeJobs").findOne({
        _id: context.purgeJobId || purgeJobId
      });
      return {
        quarantinedPreexistingDeletedUsers: (context.isolatedUserIds || []).length,
        quarantinedPreexistingPurgeJobs: (context.isolatedPurgeJobIds || []).length,
        userExists: F.collection("users").countDocuments({ _id: currentUserId }) === 1,
        mcpEvents: context.withMcpEvents ? {
          ownedSubscriptions: F.collection("mcpEventSubscriptions").countDocuments({ ownerUserId: currentUserId }),
          ownedQueuedPayloads: F.collection("integrationWebhookDeliveries").countDocuments({ ownerUserId: currentUserId }),
          controlSubscriptions: F.collection("mcpEventSubscriptions").countDocuments({ _id: F.fixtureId(job, "mcp-control") }),
          controlQueuedPayloads: F.collection("integrationWebhookDeliveries").countDocuments({ _id: F.fixtureId(job, "mcp-control") })
        } : null,
        relatedRateCount: F.collection("userRates").countDocuments({
          $or: [
            { _id: context.rateId || rateId },
            { ownerUserId: currentUserId },
            { relatedUserId: currentUserId }
          ]
        }),
        purgeJob: purge && {
          id: purge._id,
          userId: purge.userId,
          status: purge.status,
          stage: purge.stage,
          retryCount: purge.retryCount,
          completedAtIso: purge.completedAtIso,
          lastError: purge.lastError
        }
      };
    }
  });
})();
