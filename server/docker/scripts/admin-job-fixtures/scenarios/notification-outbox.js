/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "notification-outbox";
  const outboxId = F.fixtureId(job, "item");
  const userId = F.fixtureId(job, "recipient");

  F.run({
    job,
    ruleKey: job,
    variations: ["due", "future"],
    build(variation) {
      const now = F.nowIso();
      const isolatedOutboxIds = F.collection("notificationOutbox")
        .find({
          _id: { $ne: outboxId },
          status: "pending",
          $or: [
            { nextRetryAt: { $exists: false } },
            { nextRetryAt: null },
            { nextRetryAt: { $lte: now } }
          ]
        }, { projection: { _id: 1 } })
        .map(item => item._id)
        .toArray();
      return {
        pendingCount: 1,
        pendingCountUnit: "admin.jobs.rule.notification.outbox",
        expected: variation === "due"
          ? "With stock demo/e2e Firebase disabled, the item stays pending. If Firebase is deliberately enabled, it becomes sent with zero token successes for this no-device user."
          : "The item stays pending because nextRetryAt is in the future.",
        context: { outboxId, userId, isolatedOutboxIds },
        specs: [
          {
            collection: "notificationOutbox",
            selector: { _id: { $in: [...isolatedOutboxIds, outboxId] } }
          },
          { collection: "users", selector: { _id: userId } }
        ]
      };
    },
    prepare(variation, context) {
      const now = F.nowIso();
      if ((context.isolatedOutboxIds || []).length > 0) {
        F.collection("notificationOutbox").updateMany(
          { _id: { $in: context.isolatedOutboxIds } },
          {
            $set: {
              nextRetryAt: "2099-01-01T00:00:00.000Z",
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
        name: "Admin fixture no-token recipient",
        initials: "NO",
        status: "A",
        profileStatus: "public",
        devices: [],
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });
      F.collection("notificationOutbox").insertOne({
        _id: outboxId,
        syncKey: outboxId,
        notificationType: "admin-fixture-outbox",
        entityType: "fixture",
        entityId: outboxId,
        recipientScope: "users",
        recipientUserIds: [userId],
        deliveryStrategy: "direct",
        title: "Fixture outbox delivery",
        body: "A safe worker fixture with no registered device token.",
        clickUrl: "/game",
        tag: outboxId,
        payload: {
          fixture: "true",
          type: "admin-fixture-outbox",
          entityId: outboxId
        },
        payloadHash: outboxId,
        collapseKey: outboxId,
        status: "pending",
        pendingCounterTracked: true,
        retryCount: 0,
        nextRetryAt: variation === "due" ? F.pastIso(5) : F.futureIso(60),
        tokenSuccessCount: 0,
        tokenFailureCount: 0,
        createdDate: now,
        createdUser: F.FIXTURE_ACTOR,
        updatedDate: now,
        updatedUser: F.FIXTURE_ACTOR
      });
    },
    status(context) {
      const item = F.collection("notificationOutbox").findOne({ _id: context.outboxId || outboxId });
      const deployment = F.collection("deploymentConfigurations").findOne({ _id: "deployment-configuration" });
      return {
        firebaseActive: Boolean(deployment && deployment.firebase && deployment.firebase.active),
        quarantinedPreexistingDueItems: (context.isolatedOutboxIds || []).length,
        outbox: item && {
          id: item._id,
          status: item.status,
          retryCount: item.retryCount,
          nextRetryAt: item.nextRetryAt,
          startedDate: item.startedDate,
          sentDate: item.sentDate,
          tokenSuccessCount: item.tokenSuccessCount,
          tokenFailureCount: item.tokenFailureCount,
          lastError: item.lastError
        }
      };
    }
  });
})();
