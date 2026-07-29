/* global AdminJobFixture */
(() => {
  "use strict";
  const F = AdminJobFixture;
  const job = "bell-rating-feedback";

  function existingUserIds() {
    return new Set(
      F.collection("users")
        .find({ userId: { $exists: true, $nin: ["", null] } }, { projection: { userId: 1 } })
        .map(user => F.safeText(user.userId || user._id))
        .toArray()
    );
  }

  function ratingSetup() {
    const users = existingUserIds();
    const candidates = F.collection("userRates")
      .find({
        mode: "single",
        ownerUserId: { $exists: true, $nin: ["", null] },
        relatedUserId: { $exists: true, $nin: ["", null] }
      })
      .sort({ scoreGiven: 1, updatedDate: -1 })
      .toArray();
    const rate = candidates.find(item =>
      users.has(F.safeText(item.ownerUserId))
        && users.has(F.safeText(item.relatedUserId))
        && F.safeText(item.ownerUserId) !== F.safeText(item.relatedUserId)
    );
    if (!rate) {
      F.fail("rating variation needs one seeded single userRates record between two existing users.");
    }
    const actorUserId = F.safeText(rate.ownerUserId);
    const targetUserId = F.safeText(rate.relatedUserId);
    const actor = F.collection("users").findOne({
      $or: [{ _id: actorUserId }, { userId: actorUserId }]
    });
    const target = F.collection("users").findOne({
      $or: [{ _id: targetUserId }, { userId: targetUserId }]
    });
    return {
      mode: "rating",
      rateId: rate._id,
      actorUserId,
      actorName: actor && actor.name,
      targetUserId,
      targetName: target && target.name,
      baselineBellCount: F.collection("userNotifications").countDocuments({ recipientUserId: targetUserId }),
      baselineOutboxCount: F.collection("notificationOutbox").countDocuments({ recipientUserIds: targetUserId })
    };
  }

  function feedbackSetup() {
    const users = existingUserIds();
    const answers = F.collection("eventFeedbackAnswers")
      .find({
        viewerUserId: { $exists: true, $nin: ["", null] },
        targetUserId: { $exists: true, $nin: ["", null] }
      })
      .sort({ submittedAtIso: -1 })
      .toArray();
    let selected = null;
    for (const answer of answers) {
      const actorUserId = F.safeText(answer.viewerUserId);
      const targetUserId = F.safeText(answer.targetUserId);
      const eventId = F.safeText(answer.eventId);
      if (!users.has(actorUserId) || !users.has(targetUserId) || actorUserId === targetUserId || !eventId) {
        continue;
      }
      const event = F.collection("events").findOne({ sourceId: eventId });
      const acceptedMember = F.collection("activityMembers").findOne({
        ownerType: "event",
        ownerId: eventId,
        userId: actorUserId,
        status: "accepted"
      });
      if (event && acceptedMember) {
        selected = { answer, event };
        break;
      }
    }
    if (!selected) {
      F.fail("feedback variation needs one seeded accepted attendee feedback submission.");
    }
    const actorUserId = F.safeText(selected.answer.viewerUserId);
    const eventId = F.safeText(selected.answer.eventId);
    const eventAnswers = F.collection("eventFeedbackAnswers")
      .find({ viewerUserId: actorUserId, eventId })
      .toArray();
    const targetUserIds = [...new Set(
      eventAnswers
        .map(answer => F.safeText(answer.targetUserId))
        .filter(userId => userId && userId !== actorUserId && users.has(userId))
    )];
    if (targetUserIds.length === 0) {
      F.fail("selected feedback submission has no other-party target.");
    }
    const actor = F.collection("users").findOne({
      $or: [{ _id: actorUserId }, { userId: actorUserId }]
    });
    return {
      mode: "feedback",
      actorUserId,
      actorName: actor && actor.name,
      eventId,
      eventTitle: selected.event.title,
      targetUserIds,
      targetNames: targetUserIds.map(userId => {
        const user = F.collection("users").findOne({ $or: [{ _id: userId }, { userId }] });
        return { userId, name: user && user.name };
      }),
      baselineBellCount: F.collection("userNotifications").countDocuments({
        recipientUserId: { $in: targetUserIds }
      }),
      baselineOutboxCount: F.collection("notificationOutbox").countDocuments({
        recipientUserIds: { $in: targetUserIds }
      })
    };
  }

  function pairSelectors(context) {
    const allUserIds = context.mode === "rating"
      ? [context.actorUserId, context.targetUserId]
      : [context.actorUserId, ...(context.targetUserIds || [])];
    const targetUserIds = context.mode === "rating"
      ? [context.targetUserId]
      : context.targetUserIds;
    const specs = [
      {
        collection: "users",
        selector: {
          $or: [{ _id: { $in: allUserIds } }, { userId: { $in: allUserIds } }]
        }
      },
      {
        collection: "userAffinityEdges",
        selector: {
          $or: [
            { leftUserId: { $in: allUserIds } },
            { rightUserId: { $in: allUserIds } }
          ]
        }
      },
      {
        collection: "affinityRecomputeTasks",
        selector: { targetId: { $in: allUserIds } }
      },
      {
        collection: "userNotifications",
        selector: { recipientUserId: { $in: targetUserIds } }
      },
      {
        collection: "notificationOutbox",
        selector: { recipientUserIds: { $in: targetUserIds } }
      }
    ];
    if (context.mode === "rating") {
      specs.push({
        collection: "userRates",
        selector: {
          $or: [
            { _id: context.rateId },
            { ownerUserId: context.actorUserId, relatedUserId: context.targetUserId },
            { ownerUserId: context.targetUserId, relatedUserId: context.actorUserId }
          ]
        }
      });
    } else {
      specs.push(
        {
          collection: "userRates",
          selector: {
            $or: [
              { ownerUserId: { $in: allUserIds } },
              { relatedUserId: { $in: allUserIds } },
              { secondaryRelatedUserId: { $in: allUserIds } }
            ]
          }
        },
        {
          collection: "eventFeedbackStates",
          selector: { viewerUserId: context.actorUserId, eventId: context.eventId }
        },
        {
          collection: "eventFeedbackAnswers",
          selector: { viewerUserId: context.actorUserId, eventId: context.eventId }
        }
      );
    }
    return specs;
  }

  F.run({
    job,
    variations: ["rating", "feedback"],
    build(variation) {
      const context = variation === "rating" ? ratingSetup() : feedbackSetup();
      return {
        expected: variation === "rating"
          ? "After the actor submits a non-zero rating, the rate changes and the target gets at least one new bell notification. A zero bell delta is a reproducible notification gap."
          : "After the actor resubmits feedback, answers/states reappear and at least one other-party target gets a new bell notification. A zero bell delta is a reproducible notification gap.",
        next: variation === "rating"
          ? "Use the existing demo app as the printed actor, submit a non-zero rating, inspect the target bell, then run status bell-rating-feedback."
          : "Use the existing demo app as the printed actor, submit event feedback, inspect a printed target bell, then run status bell-rating-feedback.",
        context,
        specs: pairSelectors(context)
      };
    },
    prepare(variation, context) {
      const now = F.nowIso();
      if (variation === "rating") {
        F.collection("userRates").updateOne(
          { _id: context.rateId },
          {
            $set: {
              scoreGiven: 0,
              mutuallyRated: false,
              updatedDate: now,
              updatedUser: F.FIXTURE_ACTOR
            },
            $unset: {
              personalityTraitIds: "",
              selectedTraitIds: ""
            }
          }
        );
        return;
      }
      F.collection("eventFeedbackAnswers").deleteMany({
        viewerUserId: context.actorUserId,
        eventId: context.eventId
      });
      F.collection("eventFeedbackStates").deleteMany({
        viewerUserId: context.actorUserId,
        eventId: context.eventId
      });
    },
    afterPrepare(variation, context) {
      if (variation === "rating") {
        F.printObject({
          manualAction: "Switch/impersonate the actor in the existing demo app, open the rating card for the target, and submit a non-zero rating. Then switch to the target and open the bell.",
          actor: { userId: context.actorUserId, name: context.actorName },
          target: { userId: context.targetUserId, name: context.targetName }
        });
        return;
      }
      F.printObject({
        manualAction: "Switch/impersonate the actor in the existing demo app, open this event's pending feedback, submit at least one card for another party, then switch to a target and open the bell.",
        actor: { userId: context.actorUserId, name: context.actorName },
        event: { eventId: context.eventId, title: context.eventTitle },
        targets: context.targetNames
      });
    },
    trigger(context) {
      if (context.mode === "rating") {
        print(
          `[admin-job-fixtures] Manual action: rate ${context.targetUserId} while acting as `
            + `${context.actorUserId}; then inspect the target's bell.`
        );
      } else {
        print(
          `[admin-job-fixtures] Manual action: submit event feedback for ${context.eventId} while acting as `
            + `${context.actorUserId}; then inspect another target's bell.`
        );
      }
    },
    status(context, snapshot) {
      if (!snapshot) {
        return {
          instruction: "Prepare rating or feedback first; status needs the snapshotted actor/target baseline."
        };
      }
      if (context.mode === "rating") {
        const rate = F.collection("userRates").findOne({ _id: context.rateId });
        const bellCount = F.collection("userNotifications").countDocuments({
          recipientUserId: context.targetUserId
        });
        const outboxCount = F.collection("notificationOutbox").countDocuments({
          recipientUserIds: context.targetUserId
        });
        const bellDelta = bellCount - context.baselineBellCount;
        const outboxDelta = outboxCount - context.baselineOutboxCount;
        const changedBellCount = F.collection("userNotifications").countDocuments({
          recipientUserId: context.targetUserId,
          $or: [
            { createdDate: { $gt: snapshot.preparedAtIso } },
            { updatedDate: { $gt: snapshot.preparedAtIso } }
          ]
        });
        const changedOutboxCount = F.collection("notificationOutbox").countDocuments({
          recipientUserIds: context.targetUserId,
          $or: [
            { createdDate: { $gt: snapshot.preparedAtIso } },
            { updatedDate: { $gt: snapshot.preparedAtIso } }
          ]
        });
        const hasBellEvidence = bellDelta > 0 || changedBellCount > 0;
        return {
          actor: { userId: context.actorUserId, name: context.actorName },
          target: { userId: context.targetUserId, name: context.targetName },
          rate: rate && {
            id: rate._id,
            scoreGiven: rate.scoreGiven,
            scoreReceived: rate.scoreReceived,
            updatedDate: rate.updatedDate,
            updatedUser: rate.updatedUser
          },
          bellDelta,
          outboxDelta,
          changedBellCount,
          changedOutboxCount,
          notificationCheck: Number(rate && rate.scoreGiven) > 0 && hasBellEvidence
            ? "PASS: rating changed and the other party received a bell item."
            : Number(rate && rate.scoreGiven) > 0
              ? "FAIL/GAP: rating changed, but no new bell item exists for the other party."
              : "WAITING: submit a non-zero rating in the app."
        };
      }
      const submissions = F.collection("eventFeedbackAnswers").countDocuments({
        viewerUserId: context.actorUserId,
        eventId: context.eventId
      });
      const state = F.collection("eventFeedbackStates").findOne({
        viewerUserId: context.actorUserId,
        eventId: context.eventId
      });
      const bellCount = F.collection("userNotifications").countDocuments({
        recipientUserId: { $in: context.targetUserIds }
      });
      const outboxCount = F.collection("notificationOutbox").countDocuments({
        recipientUserIds: { $in: context.targetUserIds }
      });
      const bellDelta = bellCount - context.baselineBellCount;
      const outboxDelta = outboxCount - context.baselineOutboxCount;
      const changedBellCount = F.collection("userNotifications").countDocuments({
        recipientUserId: { $in: context.targetUserIds },
        $or: [
          { createdDate: { $gt: snapshot.preparedAtIso } },
          { updatedDate: { $gt: snapshot.preparedAtIso } }
        ]
      });
      const changedOutboxCount = F.collection("notificationOutbox").countDocuments({
        recipientUserIds: { $in: context.targetUserIds },
        $or: [
          { createdDate: { $gt: snapshot.preparedAtIso } },
          { updatedDate: { $gt: snapshot.preparedAtIso } }
        ]
      });
      const hasBellEvidence = bellDelta > 0 || changedBellCount > 0;
      return {
        actor: { userId: context.actorUserId, name: context.actorName },
        event: { eventId: context.eventId, title: context.eventTitle },
        targets: context.targetNames,
        submittedAnswerCount: submissions,
        submittedAtIso: state && state.submittedAtIso,
        bellDelta,
        outboxDelta,
        changedBellCount,
        changedOutboxCount,
        notificationCheck: submissions > 0 && hasBellEvidence
          ? "PASS: feedback was stored and another party received a bell item."
          : submissions > 0
            ? "FAIL/GAP: feedback was stored, but no new bell item exists for its other-party targets."
            : "WAITING: submit feedback in the app."
      };
    }
  });
})();
